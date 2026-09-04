#!/usr/bin/env python3
"""
Refresh the InterimExecs static asset clone from the live public site.

Writes demos/interimexecs/wp-clone/ (HTML + CSS/JS/images with relative paths)
and demos/interimexecs/assets/brand/ (logo, favicon, color tokens).

Usage (from repo root):
    python3 scripts/refresh-ie-asset-clone.py

Starter scope: header-nav pages (Home, Problems We Solve, Our Approach,
Case Studies, Blog, About) plus Contact and Interims Apply. Deep links that
are not mirrored stay pointed at https://interimexecs.com/... so they never
404 as relative .html files.

Dummy forms only — Gravity/Mailchimp/login posts are neutralized. Do not
point anything at InterimExecs inboxes.
"""
from __future__ import annotations

import hashlib
import json
import os
import re
import shutil
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from html import unescape
from pathlib import Path
from urllib.parse import unquote, urljoin, urlparse, urlunparse

import requests

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "demos" / "interimexecs" / "wp-clone"
BRAND = ROOT / "demos" / "interimexecs" / "assets" / "brand"
ORIGIN = "https://interimexecs.com"
UA = (
    "Mozilla/5.0 (compatible; SecondShiftAssetClone/1.0; "
    "+https://secondshift.care)"
)

# Keep existing clone filenames so check-market-test.js and hub links stay stable.
PAGE_MAP = {
    "/": "index.html",
    "": "index.html",
    "/contactus/": "contact.html",
    "/contactus": "contact.html",
    "/problems-we-solve/": "services.html",
    "/problems-we-solve": "services.html",
    "/our-approach/": "how-it-works.html",
    "/our-approach": "how-it-works.html",
    "/case-studies/": "case-studies.html",
    "/case-studies": "case-studies.html",
    "/blog/": "blog.html",
    "/blog": "blog.html",
    "/about/": "about.html",
    "/about": "about.html",
    "/membership/": "apply.html",
    "/membership": "apply.html",
}

SEED_PAGES = [
    (ORIGIN + "/", "index.html"),
    (ORIGIN + "/contactus/", "contact.html"),
    (ORIGIN + "/problems-we-solve/", "services.html"),
    (ORIGIN + "/our-approach/", "how-it-works.html"),
    (ORIGIN + "/case-studies/", "case-studies.html"),
    (ORIGIN + "/blog/", "blog.html"),
    (ORIGIN + "/about/", "about.html"),
    (ORIGIN + "/membership/", "apply.html"),
]

SKIP_HOST_SNIPPETS = (
    "googletagmanager.com",
    "google-analytics.com",
    "googleadservices.com",
    "doubleclick.net",
    "facebook.com",
    "facebook.net",
    "linkedin.com/collect",
    "px.ads.linkedin.com",
    "tend.io",
    "zopim.com",
    "zdassets.com",
    "zendesk.com",
    "google.com/recaptcha",
    "gstatic.com/recaptcha",
    "hotjar.com",
    "clarity.ms",
)

SKIP_PATH_SNIPPETS = (
    "/cdn-cgi/",
    "recaptcha",
    "gravityforms/js/",
    "gravityforms/assets/js/",
    "gravity-forms-zero-spam",
    "ajax-login-script",
    "popup-login/ajax",
    "mailchimp-for-wp/assets/js",
    "mc4wp-premium/ajax-forms",
    "contact-form-7",
    "woocommerce/assets/js/frontend",
    "woocommerce/assets/js/sourcebuster",
    "akismet",
    "wp-rocket/assets/js/lazyload",
    "gtag/js",
)

SESSION = requests.Session()
SESSION.headers.update({"User-Agent": UA, "Accept": "*/*"})

downloaded: dict[str, str] = {}  # abs url without fragment -> local posix path
failed: list[str] = []


def log(msg: str) -> None:
    print(msg, flush=True)


def normalize_url(url: str, base: str = ORIGIN + "/") -> str | None:
    if url is None:
        return None
    url = unescape(url).strip().strip("\"'").strip()
    if not url:
        return None
    if url.startswith("data:") or url.startswith("blob:") or url.startswith("about:"):
        return None
    if url.startswith(("javascript:", "mailto:", "tel:", "sms:")):
        return None
    if url.startswith("#"):
        return None
    if url.startswith("//"):
        url = "https:" + url
    url = urljoin(base, url)
    parsed = urlparse(url)
    if parsed.scheme not in ("http", "https"):
        return None
    # Drop fragment; keep query (WP Rocket cache-bust / ver=).
    clean = urlunparse((parsed.scheme, parsed.netloc, parsed.path, "", parsed.query, ""))
    return clean


def host_of(url: str) -> str:
    return urlparse(url).netloc.lower()


def path_of(url: str) -> str:
    return unquote(urlparse(url).path)


def is_ie_host(url: str) -> bool:
    host = host_of(url)
    return host in ("interimexecs.com", "www.interimexecs.com") or host.endswith(
        ".interimexecs.com"
    )


def should_skip_remote(url: str) -> bool:
    low = url.lower()
    if any(s in low for s in SKIP_HOST_SNIPPETS):
        return True
    if any(s in low for s in SKIP_PATH_SNIPPETS):
        return True
    return False


ASSET_EXTS = {
    ".css",
    ".js",
    ".mjs",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".svg",
    ".webp",
    ".avif",
    ".ico",
    ".woff",
    ".woff2",
    ".ttf",
    ".eot",
    ".otf",
    ".map",
    ".mp4",
    ".webm",
    ".mp3",
    ".ogg",
    ".pdf",
}


def is_asset_url(url: str) -> bool:
    path = path_of(url).lower()
    if not path or path.endswith("/"):
        return False
    ext = Path(path).suffix.lower()
    if ext not in ASSET_EXTS:
        return False
    if "/wp-json" in path or path.endswith("/feed"):
        return False
    return True


def local_asset_path(url: str) -> str:
    parsed = urlparse(url)
    path = unquote(parsed.path).lstrip("/")
    if not path:
        digest = hashlib.sha1(url.encode()).hexdigest()[:12]
        path = f"vendor/misc/{digest}"
    # Query-only uniqueness for minified cache files that share a path.
    if parsed.query:
        stem = Path(path)
        digest = hashlib.sha1(parsed.query.encode()).hexdigest()[:8]
        if stem.suffix:
            path = str(stem.with_name(stem.stem + "-" + digest + stem.suffix))
        else:
            path = path + "-" + digest
    path = path.replace("\\", "/")
    while "//" in path:
        path = path.replace("//", "/")
    if path.startswith("wp-content/") or path.startswith("wp-includes/"):
        return path
    host = parsed.netloc.lower().replace("www.", "")
    if host and host != "interimexecs.com":
        return f"vendor/{host}/{path}"
    return path


def mapped_page(url: str) -> str | None:
    parsed = urlparse(url)
    if not is_ie_host(url) and parsed.netloc:
        return None
    key = parsed.path.rstrip("/") + ("/" if parsed.path not in ("", "/") else "")
    if parsed.path in ("", "/"):
        key = "/"
    if key in PAGE_MAP:
        return PAGE_MAP[key]
    # /blog -> blog.html already covered; also allow index-less contactus
    alt = parsed.path.rstrip("/")
    if alt in PAGE_MAP:
        return PAGE_MAP[alt]
    if parsed.path.rstrip("/") + "/" in PAGE_MAP:
        return PAGE_MAP[parsed.path.rstrip("/") + "/"]
    return None


def fetch(url: str, retries: int = 4) -> bytes | None:
    last_err = None
    for i in range(retries):
        try:
            r = SESSION.get(url, timeout=45, allow_redirects=True)
            if r.status_code == 200 and r.content:
                return r.content
            last_err = f"HTTP {r.status_code}"
        except Exception as exc:  # noqa: BLE001
            last_err = str(exc)
        time.sleep(0.4 * (2**i))
    failed.append(f"{url} ({last_err})")
    return None


def save_bytes(rel: str, data: bytes) -> Path:
    dest = OUT / rel
    parent = dest.parent
    if parent.exists() and parent.is_file():
        parent.unlink()
    parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(data)
    return dest


def download_asset(url: str) -> str | None:
    url = normalize_url(url) if not url.startswith("http") else url
    if not url:
        return None
    url = normalize_url(url) or url
    if url in downloaded:
        return downloaded[url]
    if should_skip_remote(url):
        return None
    # Keep Google Fonts / gstatic on CDN so we do not rewrite to a missing file.
    host = host_of(url)
    if host in ("fonts.googleapis.com", "fonts.gstatic.com"):
        return None
    rel = local_asset_path(url)
    dest = OUT / rel
    if dest.exists() and dest.stat().st_size > 0:
        downloaded[url] = rel
        return rel
    data = fetch(url)
    if data is None:
        return None
    save_bytes(rel, data)
    downloaded[url] = rel
    return rel


def iter_srcset(value: str):
    for part in value.split(","):
        bit = part.strip()
        if not bit:
            continue
        pieces = bit.split()
        yield pieces[0], " ".join(pieces[1:])


def collect_urls_from_html(html: str, page_url: str) -> list[str]:
    found = []

    def add(raw: str) -> None:
        n = normalize_url(raw, page_url)
        if n:
            found.append(n)

    for attr in (
        "href",
        "src",
        "data-src",
        "data-lazy-src",
        "data-orig-src",
        "data-bg",
        "poster",
        "content",
    ):
        for m in re.finditer(
            rf'{attr}\s*=\s*["\']([^"\']+)["\']', html, flags=re.I
        ):
            add(m.group(1))
    for attr in ("srcset", "data-srcset", "data-lazy-srcset"):
        for m in re.finditer(
            rf'{attr}\s*=\s*["\']([^"\']+)["\']', html, flags=re.I
        ):
            for u, _d in iter_srcset(m.group(1)):
                add(u)
    for m in re.finditer(r'url\(\s*[\'"]?([^\'")]+)[\'"]?\s*\)', html, flags=re.I):
        add(m.group(1))
    return found


CSS_URL_RE = re.compile(r'url\(\s*[\'"]?([^\'")]+)[\'"]?\s*\)', re.I)


def rewrite_css(css_text: str, css_url: str, css_rel: str) -> str:
    def repl(match: re.Match) -> str:
        raw = match.group(1).strip()
        if raw.startswith("data:"):
            return match.group(0)
        absu = normalize_url(raw, css_url)
        if not absu:
            return match.group(0)
        if host_of(absu) in ("fonts.googleapis.com", "fonts.gstatic.com"):
            return match.group(0)
        if should_skip_remote(absu):
            return match.group(0)
        if not is_asset_url(absu) and not Path(path_of(absu)).suffix:
            return match.group(0)
        rel = download_asset(absu)
        if not rel:
            return match.group(0)
        from_dir = Path(css_rel).parent
        rel_to = os.path.relpath(rel, start=str(from_dir)).replace("\\", "/")
        return f"url({rel_to})"

    return CSS_URL_RE.sub(repl, css_text)


def rewrite_html_url(raw: str, page_url: str) -> str:
    raw_stripped = unescape(raw).strip()
    if not raw_stripped:
        return raw
    if raw_stripped.startswith(("data:", "javascript:", "mailto:", "tel:", "sms:", "#", "about:")):
        return raw
    absu = normalize_url(raw_stripped, page_url)
    if not absu:
        return raw
    page = mapped_page(absu)
    if page:
        parsed = urlparse(unescape(raw_stripped) if raw_stripped.startswith("http") else absu)
        # Preserve in-page hash when the href was a mapped page.
        orig_parsed = urlparse(urljoin(page_url, raw_stripped))
        suffix = ("#" + orig_parsed.fragment) if orig_parsed.fragment else ""
        return page + suffix
    if is_asset_url(absu):
        if should_skip_remote(absu):
            return raw
        if host_of(absu) in ("fonts.googleapis.com", "fonts.gstatic.com"):
            return absu
        rel = downloaded.get(absu) or download_asset(absu)
        if rel:
            return rel
        if is_ie_host(absu):
            # Missing asset — do not leave a root-absolute path behind.
            return absu
        return absu if absu.startswith("http") else raw
    # Non-asset IE URL we did not mirror: keep live absolute (Preview Clone proof).
    if is_ie_host(absu):
        parsed = urlparse(absu)
        live = urlunparse(("https", "interimexecs.com", parsed.path, "", parsed.query, parsed.fragment))
        orig_parsed = urlparse(urljoin(page_url, raw_stripped))
        if orig_parsed.fragment:
            live = live.split("#")[0] + "#" + orig_parsed.fragment
        return live
    return absu if absu.startswith("http") else raw


ATTR_URL_RE = re.compile(
    r'''(?P<attr>\b(?:href|src|data-src|data-lazy-src|data-orig-src|data-bg|poster|action)\s*=\s*)(?P<q>["'])(?P<val>(?:(?!(?P=q)).)*)(?P=q)''',
    re.I,
)
SRCSET_RE = re.compile(
    r'''(?P<attr>\b(?:srcset|data-srcset|data-lazy-srcset)\s*=\s*)(?P<q>["'])(?P<val>(?:(?!(?P=q)).)*)(?P=q)''',
    re.I,
)
STYLE_URL_RE = re.compile(
    r'(?P<pre>style\s*=\s*["\'][^"\']*?)url\(\s*[\'"]?(?P<val>[^\'")]+)[\'"]?\s*\)',
    re.I,
)
META_CONTENT_RE = re.compile(
    r'''(?P<pre><meta\b[^>]+(?:property|name)=["'](?:og:image|og:image:url|og:image:secure_url|twitter:image)["'][^>]+content=)(?P<q>["'])(?P<val>[^"']+)(?P=q)''',
    re.I,
)


def rewrite_html_urls(html: str, page_url: str) -> str:
    def attr_sub(m: re.Match) -> str:
        new = rewrite_html_url(m.group("val"), page_url)
        return f'{m.group("attr")}{m.group("q")}{new}{m.group("q")}'

    html = ATTR_URL_RE.sub(attr_sub, html)

    def srcset_sub(m: re.Match) -> str:
        parts = []
        for u, desc in iter_srcset(m.group("val")):
            nu = rewrite_html_url(u, page_url)
            parts.append((nu + (" " + desc if desc else "")).strip())
        return f'{m.group("attr")}{m.group("q")}{", ".join(parts)}{m.group("q")}'

    html = SRCSET_RE.sub(srcset_sub, html)

    def style_sub(m: re.Match) -> str:
        new = rewrite_html_url(m.group("val"), page_url)
        return f"{m.group('pre')}url({new})"

    html = STYLE_URL_RE.sub(style_sub, html)

    def meta_sub(m: re.Match) -> str:
        new = rewrite_html_url(m.group("val"), page_url)
        return f'{m.group("pre")}{m.group("q")}{new}{m.group("q")}'

    html = META_CONTENT_RE.sub(meta_sub, html)
    return html


def strip_trackers(html: str) -> str:
    # Remove script tags whose src is a tracker / form-submitter.
    def drop_script(m: re.Match) -> str:
        tag = m.group(0)
        low = tag.lower()
        if any(s in low for s in SKIP_HOST_SNIPPETS) or any(
            s in low for s in SKIP_PATH_SNIPPETS
        ):
            return ""
        if "data:text/javascript" in low:
            return ""
        # Inline analytics / chat / recaptcha bootstraps.
        if m.group("body") and re.search(
            r"\b(gtag|fbq|ga\(|dataLayer|zopim|\$zopim|grecaptcha|google_trackConversion|lintrk)\b",
            m.group("body"),
        ):
            return ""
        return tag

    html = re.sub(
        r"<script\b(?P<attrs>[^>]*)>(?P<body>[\s\S]*?)</script>",
        drop_script,
        html,
        flags=re.I,
    )
    # Tracking pixels
    html = re.sub(
        r"<img\b[^>]*(facebook\.com/tr|px\.ads\.linkedin|googleadservices|doubleclick)[^>]*>",
        "",
        html,
        flags=re.I,
    )
    html = re.sub(
        r"<noscript>\s*<img\b[^>]*(facebook\.com/tr|px\.ads\.linkedin)[^>]*>\s*</noscript>",
        "",
        html,
        flags=re.I,
    )
    return html


def neutralize_forms(html: str) -> str:
    def form_sub(m: re.Match) -> str:
        tag = m.group(0)
        tag = re.sub(r'\saction\s*=\s*["\'][^"\']*["\']', "", tag, flags=re.I)
        if re.search(r"\saction\s*=", tag, flags=re.I) is None:
            tag = tag[:-1] + ' action="#" method="post" data-ss-dummy-form="1">'
        if "data-ss-dummy-form" not in tag:
            tag = tag[:-1] + ' data-ss-dummy-form="1">'
        return tag

    html = re.sub(r"<form\b[^>]*>", form_sub, html, flags=re.I)
    # Gravity Forms / CF7 / Mailchimp hidden destinations
    html = re.sub(
        r'(<input\b[^>]*name=["\'](?:gform_submit|gform_ajax|_wpcf7|_mc4wp_form_id)[^>]*>)',
        r"<!-- neutralized \1 -->",
        html,
        flags=re.I,
    )
    # Gravity Forms hides the wrapper until its JS runs. We stripped that JS.
    html = re.sub(
        r"(<div\b[^>]*gform_wrapper[^>]*style=['\"])([^'\"]*)display\s*:\s*none;?([^'\"]*)(['\"])",
        r"\1\2\3\4",
        html,
        flags=re.I,
    )
    html = re.sub(
        r'''\sonclick=(["'])[^"']*gform[^"']*\1''',
        "",
        html,
        flags=re.I,
    )
    return html


def promote_lazy_images(html: str) -> str:
    # Copy data-lazy-src into src so images show without WP Rocket lazyload.
    def img_sub(m: re.Match) -> str:
        tag = m.group(0)
        lazy = re.search(
            r'\b(?:data-lazy-src|data-src)\s*=\s*["\']([^"\']+)["\']', tag, flags=re.I
        )
        if not lazy:
            return tag
        if re.search(r'\bsrc\s*=', tag, flags=re.I):
            # Replace placeholder/data src (may contain the other quote type) with the real lazy URL.
            tag = re.sub(
                r'''\bsrc\s*=\s*(["'])(?:(?!\1).)*\1''',
                f'src="{lazy.group(1)}"',
                tag,
                count=1,
                flags=re.I,
            )
        elif not re.search(r"\bsrc\s*=", tag, flags=re.I):
            tag = tag[:-1] + f' src="{lazy.group(1)}">'
        lazyset = re.search(
            r'\b(?:data-lazy-srcset|data-srcset)\s*=\s*["\']([^"\']+)["\']',
            tag,
            flags=re.I,
        )
        if lazyset:
            if re.search(r"\bsrcset\s*=", tag, flags=re.I):
                tag = re.sub(
                    r'\bsrcset\s*=\s*["\'][^"\']*["\']',
                    f'srcset="{lazyset.group(1)}"',
                    tag,
                    count=1,
                    flags=re.I,
                )
            else:
                tag = tag[:-1] + f' srcset="{lazyset.group(1)}">'
        return tag

    return re.sub(r"<img\b[^>]*>", img_sub, html, flags=re.I)


def inject_chrome(html: str) -> str:
    robots = '<meta name="robots" content="noindex, nofollow" />\n'
    overlay_css = '<link rel="stylesheet" href="css/style.css" />\n'
    overlay_js = '<script src="js/site.js" defer></script>\n'
    badge = (
        '<a class="ss-clone-badge" href="https://secondshift.care/" '
        'title="Second Shift staging clone — dummy forms only. Does not email InterimExecs.">'
        "SS</a>\n"
    )
    if re.search(r'name=["\']robots["\']', html, flags=re.I):
        html = re.sub(
            r'<meta\b[^>]*name=["\']robots["\'][^>]*>',
            robots.strip(),
            html,
            count=1,
            flags=re.I,
        )
    elif re.search(r"</head>", html, flags=re.I):
        html = re.sub(r"</head>", robots + "</head>", html, count=1, flags=re.I)

    if "css/style.css" not in html:
        html = re.sub(r"</head>", overlay_css + "</head>", html, count=1, flags=re.I)
    if "js/site.js" not in html:
        html = re.sub(r"</body>", overlay_js + "</body>", html, count=1, flags=re.I)
    if "ss-clone-badge" not in html:
        html = re.sub(r"</body>", badge + "</body>", html, count=1, flags=re.I)
    return html


def repair_broken_data_uris(html: str) -> str:
    # WP Rocket lazy placeholders are data:image/svg+xml with inner single quotes.
    # A naive attr rewrite can leave `src="file.png"http://www.w3.org/2000/svg'...">`.
    return re.sub(
        r'''(src="[^"]+")http://www\.w3\.org/2000/svg[^"]*"''',
        r"\1",
        html,
        flags=re.I,
    )


def forbid_root_absolute(html: str) -> str:
    # Last-chance sweep so GitHub Pages project paths and check-market-test.js pass.
    def fix_attr(m: re.Match) -> str:
        val = m.group("val")
        if val.startswith("//"):
            return m.group(0)
        if val.startswith("/"):
            rewritten = rewrite_html_url(val, ORIGIN + "/")
            return f'{m.group("attr")}{m.group("q")}{rewritten}{m.group("q")}'
        return m.group(0)

    html = re.sub(
        r'''(?P<attr>\b(?:href|src|action|poster|data-src|data-lazy-src)\s*=\s*)(?P<q>["'])(?P<val>/[^"']*)(?P=q)''',
        fix_attr,
        html,
        flags=re.I,
    )
    return html


def process_page(page_url: str, filename: str) -> None:
    log(f"fetch page {page_url} -> {filename}")
    data = fetch(page_url)
    if data is None:
        raise SystemExit(f"failed to fetch {page_url}")
    html = data.decode("utf-8", errors="replace")
    html = strip_trackers(html)
    html = promote_lazy_images(html)

    urls = collect_urls_from_html(html, page_url)
    asset_urls = []
    for u in urls:
        if should_skip_remote(u):
            continue
        if is_asset_url(u) and host_of(u) not in ("fonts.googleapis.com", "fonts.gstatic.com"):
            if is_ie_host(u) or host_of(u) in (
                "cdnjs.cloudflare.com",
                "ajax.googleapis.com",
            ) or "/wp-content/" in u or "/wp-includes/" in u:
                asset_urls.append(u)

    # Dedup, download in parallel.
    uniq = sorted(set(asset_urls))
    log(f"  {filename}: {len(uniq)} assets")
    with ThreadPoolExecutor(max_workers=8) as pool:
        futs = {pool.submit(download_asset, u): u for u in uniq}
        for fut in as_completed(futs):
            fut.result()

    html = neutralize_forms(html)
    html = rewrite_html_urls(html, page_url)
    html = repair_broken_data_uris(html)
    html = inject_chrome(html)
    html = forbid_root_absolute(html)

    # Canonical / og:url can stay on the live site (proof), but never root-absolute.
    dest = OUT / filename
    dest.write_text(html, encoding="utf-8")
    log(f"  wrote {filename} ({dest.stat().st_size} bytes)")


def process_downloaded_css() -> None:
    css_files = [rel for rel in downloaded.values() if rel.lower().endswith(".css")]
    log(f"rewrite {len(css_files)} CSS files")
    # Reverse map local rel -> source url (first wins is fine)
    rel_to_url = {}
    for url, rel in downloaded.items():
        rel_to_url.setdefault(rel, url)
    for rel in css_files:
        path = OUT / rel
        if not path.exists():
            continue
        text = path.read_text(encoding="utf-8", errors="replace")
        src_url = rel_to_url.get(rel, urljoin(ORIGIN + "/", rel))
        new = rewrite_css(text, src_url, rel)
        path.write_text(new, encoding="utf-8")


def write_overlay_files() -> None:
    css_dir = OUT / "css"
    js_dir = OUT / "js"
    css_dir.mkdir(parents=True, exist_ok=True)
    js_dir.mkdir(parents=True, exist_ok=True)

    (css_dir / "style.css").write_text(
        """/* Second Shift overlay — do not restyle the mirrored InterimExecs chrome.
   Discrete corner badge only. Cookie/chat widgets hidden so the visual
   proof matches the public page, not the live tracking stack. */
.ss-clone-badge {
  position: fixed;
  right: 10px;
  bottom: 10px;
  z-index: 2147483000;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #1b1b1b;
  color: #f3f3f3 !important;
  font: 700 9px/26px "Open Sans", Arial, sans-serif;
  letter-spacing: 0.04em;
  text-align: center;
  text-decoration: none !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
  opacity: 0.72;
}
.ss-clone-badge:hover { opacity: 1; color: #fff !important; }
#cookie-law-info-bar,
.cli-modal-backdrop,
.cli-modal,
#cliSettingsPopup,
.cli-bar,
#wt-cli-iframe-placeholder,
.zopim,
.zendesk-iframe,
iframe[src*="zopim"],
iframe[src*="zendesk"] { display: none !important; }

/* Gravity Forms waits on its own JS to unhide. Show the dummy fields. */
.gform_wrapper { display: block !important; visibility: visible !important; }
.gform_wrapper[style*="display:none"],
.gform_wrapper[style*="display: none"] { display: block !important; }
""",
        encoding="utf-8",
    )

    (js_dir / "site.js").write_text(
        """(function () {
  document.querySelectorAll(".gform_wrapper").forEach(function (el) {
    if (el.style && el.style.display === "none") el.style.display = "block";
    var st = el.getAttribute("style") || "";
    if (/display\\s*:\\s*none/i.test(st)) {
      el.setAttribute("style", st.replace(/display\\s*:\\s*none\\s*;?/gi, ""));
    }
  });
  document.querySelectorAll("[onclick*='gform']").forEach(function (el) {
    el.removeAttribute("onclick");
  });

  function showDummyNotice(form) {
    var note = form.getAttribute("data-ss-notice");
    if (note) return;
    var box = document.createElement("p");
    box.setAttribute("data-ss-notice", "1");
    box.setAttribute("role", "status");
    box.style.cssText = "margin:1rem 0 0;padding:0.75rem 1rem;background:#111;color:#fff;font:14px/1.4 Open Sans,Arial,sans-serif;";
    box.textContent = "Staging clone only. This form does not email InterimExecs or post to the live WordPress site.";
    form.appendChild(box);
    form.setAttribute("data-ss-notice", "1");
  }

  document.addEventListener("submit", function (event) {
    var form = event.target;
    if (!form || !form.tagName || form.tagName.toLowerCase() !== "form") return;
    event.preventDefault();
    event.stopPropagation();
    showDummyNotice(form);
    return false;
  }, true);

  document.addEventListener("click", function (event) {
    var el = event.target && event.target.closest && event.target.closest("button, input[type=submit], input[type=button]");
    if (!el) return;
    var form = el.form || (el.closest && el.closest("form"));
    if (!form) return;
    var type = (el.getAttribute("type") || el.type || "").toLowerCase();
    if (el.tagName.toLowerCase() === "button" && type && type !== "submit") return;
    if (type === "button" || type === "reset") return;
    // Gravity Forms / CF7 ajax buttons
    if (form.getAttribute("data-ss-dummy-form") || form.querySelector("[name=gform_submit], .gform_button, .wpcf7-submit")) {
      event.preventDefault();
      event.stopPropagation();
      showDummyNotice(form);
    }
  }, true);

  // Promote leftover lazy placeholders if a script still swapped them.
  document.querySelectorAll("img[data-lazy-src], img[data-src]").forEach(function (img) {
    var real = img.getAttribute("data-lazy-src") || img.getAttribute("data-src");
    if (real && (!img.getAttribute("src") || /^data:/.test(img.getAttribute("src") || ""))) {
      img.setAttribute("src", real);
    }
  });
})();
""",
        encoding="utf-8",
    )


def extract_brand() -> None:
    BRAND.mkdir(parents=True, exist_ok=True)
    logo_src = None
    for rel in downloaded.values():
        if rel.endswith("ie-logo.svg") or rel.endswith("/ie-logo.svg"):
            logo_src = OUT / rel
            break
    if not logo_src or not logo_src.exists():
        # Direct fetch fallback.
        data = fetch(ORIGIN + "/wp-content/uploads/2019/11/ie-logo.svg")
        if data:
            logo_src = OUT / "wp-content/uploads/2019/11/ie-logo.svg"
            logo_src.parent.mkdir(parents=True, exist_ok=True)
            logo_src.write_bytes(data)

    if logo_src and logo_src.exists():
        shutil.copy2(logo_src, BRAND / "ie-logo.svg")
        assets_logo = OUT / "assets" / "logo.svg"
        assets_logo.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(logo_src, assets_logo)
        # White header variant is the same mark; keep a copy for theme compatibility.
        shutil.copy2(logo_src, OUT / "assets" / "logo-white.svg")

    fav_rel = None
    for url, rel in downloaded.items():
        if "favicon" in rel.lower() and rel.lower().endswith((".png", ".ico", ".svg")):
            fav_rel = rel
            break
    if not fav_rel:
        data = fetch(ORIGIN + "/wp-content/themes/interimexecs/img/favicon.png")
        if data:
            fav_rel = "wp-content/themes/interimexecs/img/favicon.png"
            save_bytes(fav_rel, data)
    if fav_rel and (OUT / fav_rel).exists():
        ext = Path(fav_rel).suffix or ".png"
        shutil.copy2(OUT / fav_rel, BRAND / f"favicon{ext}")

    # Prefer the live theme sheets. Plugin CSS (Bootstrap alerts, Woo) pollutes hex counts.
    theme_blobs = []
    for p in OUT.rglob("*.css"):
        name = str(p).replace("\\", "/").lower()
        if "woocommerce" in name or "cookie-law" in name or "font-awesome" in name:
            continue
        if "interimexecs/style" in name or "css-compiled" in name or "master-preset" in name:
            try:
                theme_blobs.append(p.read_text(encoding="utf-8", errors="ignore"))
            except OSError:
                continue
    theme_text = "\n".join(theme_blobs).lower()

    def present(*hexes: str) -> str | None:
        for h in hexes:
            if h.lower() in theme_text:
                return h.lower()
        return None

    gold = present("#e7bf8f") or "#e7bf8f"
    navy = present("#3c5370") or "#3c5370"
    teal = present("#377d95") or "#377d95"
    teal_bright = present("#008cba") or "#008cba"
    orange = present("#d97732") or "#d97732"
    orange_burnt = present("#db651b") or "#db651b"
    red = present("#a61f22", "#a62428", "#a82626") or "#a61f22"
    red_deep = present("#8f1b1e") or "#8f1b1e"
    ink = present("#272727") or "#272727"

    # Raster PNG sitting inside the live SVG wordmark.
    if (BRAND / "ie-logo.svg").exists():
        svg_text = (BRAND / "ie-logo.svg").read_text(encoding="utf-8", errors="ignore")
        m = re.search(r"data:image/png;base64,([A-Za-z0-9+/=\s]+)", svg_text)
        if m:
            import base64

            png = base64.b64decode(re.sub(r"\s+", "", m.group(1)))
            (BRAND / "ie-logo.png").write_bytes(png)

    brand = {
        "name": "InterimExecs",
        "source": ORIGIN,
        "scraped": time.strftime("%Y-%m-%d"),
        "logo": {
            "svg": "ie-logo.svg",
            "png": "ie-logo.png" if (BRAND / "ie-logo.png").exists() else None,
            "note": "Primary wordmark from the live WordPress header (wp-content/uploads/2019/11/ie-logo.svg).",
        },
        "favicon": "favicon.png" if (BRAND / "favicon.png").exists() else None,
        "fonts": {
            "primary": "Open Sans",
            "display": "Raleway",
            "accent": "Poppins",
            "liveStacks": [
                "Raleway, Open Sans, sans-serif",
                "Open Sans, Helvetica, Arial, sans-serif",
                "Poppins, Open Sans, sans-serif",
            ],
        },
        "colors": {
            "gold": gold,
            "navy": navy,
            "teal": teal,
            "tealBright": teal_bright,
            "orange": orange,
            "orangeBurnt": orange_burnt,
            "red": red,
            "redDeep": red_deep,
            "ink": ink,
            "reds": [h for h in (red, red_deep, "#a62428", "#a82626") if h],
            "neutrals": ["#272727", "#222222", "#f5f5f5", "#c1c1c1", "#dddddd", "#f2f2f2"],
        },
        "reuse": {
            "webflow": "Drop ie-logo.svg (or ie-logo.png) into Refresh/Reimagine as the header mark. Do not invent a new logo.",
            "clone": "wp-clone/assets/logo.svg is a copy of the same file.",
        },
    }
    (BRAND / "brand.json").write_text(json.dumps(brand, indent=2) + "\n", encoding="utf-8")

    colors_md = f"""# InterimExecs brand tokens (scraped {brand['scraped']})

Source: live theme CSS on {ORIGIN} (`style.css`, compiled `master-preset1.css`).
For Webflow Refresh / Reimagine reuse — not a rebrand.

The public site is **navy + gold + teal**, not a flat Coca-Cola red. “RED Team” is
the product name; buttons and chrome use gold (`{gold}`) on dark photography, with
navy (`{navy}`) and teal (`{teal}`) bands. Deep reds appear on a few emphasis bands.

## Logo

- SVG: `ie-logo.svg` (live header wordmark)
- PNG: `ie-logo.png` (same raster extracted from the SVG)
- Favicon: `favicon.png` (theme favicon, if present)
- Clone copy: `../../wp-clone/assets/logo.svg`

Refresh can take the logo from this folder. Do not redraw it.

## Colors

| Token | Hex | Where it shows on the live site |
| --- | --- | --- |
| Gold | `{gold}` | `.gold`, `.btn-yellow`, primary buttons / hovers |
| Navy | `{navy}` | Section bands, cards, footer-adjacent chrome |
| Teal | `{teal}` | Links / secondary type |
| Bright teal | `{teal_bright}` | Compiled preset / Foundation default link |
| Orange | `{orange}` / `{orange_burnt}` | Strong CTAs |
| Brand red | `{red}` | Deep red bands (`{red_deep}` hover) |
| Ink | `{ink}` | Near-black bars and headings |
| Neutrals | `#f5f5f5` mist, `#c1c1c1` lines, `#ffffff` paper | |

## Type

- Body: **Open Sans**
- Headings / nav: **Raleway**
- Occasional bands: **Poppins**

## Refresh later

Re-run from the repo root after a live-site visual change:

```bash
python3 scripts/refresh-ie-asset-clone.py
node scripts/check-market-test.js
```

That overwrites `demos/interimexecs/wp-clone/` and this folder.
"""
    (BRAND / "COLORS.md").write_text(colors_md, encoding="utf-8")
    log(f"brand pack -> {BRAND} gold={gold} navy={navy} red={red}")


def write_clone_readme() -> None:
    (OUT / "README.md").write_text(
        f"""# InterimExecs asset clone

High-fidelity static mirror of the public WordPress site for Second Shift
demos and asset reuse. Served on GitHub Pages at:

https://secondshift.care/demos/interimexecs/wp-clone/

**Preview Clone** on the market-test hub still opens the live site
(`https://interimexecs.com`). This folder is the customize / asset-reuse
mirror (`choices.clone.internalPreview` / `choices.clone.assetMirror`).

## What is mirrored

Starter-scope public pages (same filenames the hub and checks already use):

| File | Live URL |
| --- | --- |
| `index.html` | https://interimexecs.com/ |
| `contact.html` | https://interimexecs.com/contactus/ |
| `services.html` | https://interimexecs.com/problems-we-solve/ |
| `how-it-works.html` | https://interimexecs.com/our-approach/ |
| `case-studies.html` | https://interimexecs.com/case-studies/ |
| `blog.html` | https://interimexecs.com/blog/ |
| `about.html` | https://interimexecs.com/about/ |
| `apply.html` | https://interimexecs.com/membership/ |

Images (hero, logo, headshots, company-mark strip), theme CSS, and JS needed
for nav / carousels are stored with **relative** paths so project Pages works.

Uncloned deep links (individual posts, login, legal) stay on
`https://interimexecs.com/...`.

## Dummy forms

Every `<form>` is neutralized. Nothing posts to InterimExecs or WP Engine.
`js/site.js` intercepts submit and shows a staging notice.

## Staging mark

A 26px corner **SS** badge (`css/style.css`) — not a full-width bar — so a
side-by-side with the live site still proves color, type, spacing, and imagery.

## Refresh from live

From the repo root:

```bash
python3 scripts/refresh-ie-asset-clone.py
node scripts/check-market-test.js
```

The script overwrites this directory and rebuilds `../assets/brand/`
(logo SVG, favicon, `COLORS.md` / `brand.json`). Refresh / Reimagine can take
the logo from `demos/interimexecs/assets/brand/ie-logo.svg`.

Crawled: {time.strftime("%Y-%m-%d")}. Public pages only. No emails, no Stripe,
no Webflow Designer edits.
""",
        encoding="utf-8",
    )


def assert_pages_safe() -> None:
    problems = []
    for page in PAGE_MAP.values():
        path = OUT / page
        if not path.exists():
            problems.append(f"missing {page}")
            continue
        html = path.read_text(encoding="utf-8", errors="replace")
        if 'href="/' in html or "src=\"/" in html:
            problems.append(f"{page} still has root-absolute href/src")
        if 'href="../index.html"' in html or "/ie/" in html or "webflow.io" in html:
            problems.append(f"{page} leaks hub /ie/ or webflow.io")
        if not re.search(r"InterimExecs|interim executive|RED Team", html, re.I):
            problems.append(f"{page} does not look like Interim Execs content")
        for raw in re.findall(r'href="([^"]+\.html)"', html):
            if re.match(r"https?:", raw) or raw.startswith("../"):
                continue
            target = (OUT / raw.split("#")[0]).resolve()
            if not target.exists():
                problems.append(f"{page} broken relative link {raw}")
    for req in ("css/style.css", "js/site.js", "assets/logo.svg"):
        if not (OUT / req).exists():
            problems.append(f"missing {req}")
    if problems:
        raise SystemExit("clone safety failed:\n  " + "\n  ".join(problems))


def main() -> int:
    if OUT.exists():
        # Keep the directory; wipe previous mirror so stale thin-clone files vanish.
        for child in OUT.iterdir():
            if child.is_dir():
                shutil.rmtree(child)
            else:
                child.unlink()
    OUT.mkdir(parents=True, exist_ok=True)
    BRAND.mkdir(parents=True, exist_ok=True)

    for url, name in SEED_PAGES:
        process_page(url, name)

    process_downloaded_css()
    write_overlay_files()
    extract_brand()
    write_clone_readme()
    assert_pages_safe()

    log(f"downloaded {len(downloaded)} assets, {len(failed)} failures")
    if failed:
        log("failures:")
        for item in failed[:40]:
            log("  " + item)
    return 0


if __name__ == "__main__":
    sys.exit(main())

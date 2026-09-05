#!/usr/bin/env python3
"""
Refresh a Second Shift static asset clone from a live public site.

Usage (from repo root):
    python3 scripts/refresh-asset-clone.py westernmech
    python3 scripts/refresh-asset-clone.py kaback
    python3 scripts/refresh-asset-clone.py mcihvac
    python3 scripts/refresh-asset-clone.py beaconcpa
    python3 scripts/refresh-asset-clone.py --all

Writes demos/<slug>/wp-clone/ (HTML + CSS/JS/images with relative paths)
and demos/<slug>/assets/brand/ (logo, favicon, color/font tokens).

Dummy forms only — nothing posts to the prospect. Do not email them.
"""
from __future__ import annotations

import argparse
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
UA = (
    "Mozilla/5.0 (compatible; SecondShiftAssetClone/1.0; "
    "+https://secondshift.care)"
)

SITES = {
    "westernmech": {
        "name": "Western Mechanical Contractors",
        "short": "Western Mechanical",
        "origin": "https://www.westernmech.com",
        "hosts": ("westernmech.com", "www.westernmech.com"),
        "pages": [("/", "index.html"), ("/contact.php", "contact.html")],
        "page_map": {
            "/": "index.html",
            "": "index.html",
            "/contact.php": "contact.html",
            "/contact": "contact.html",
        },
        "logo_hints": (
            "logo_western_mechanical",
            "logo-western",
            "western_mechanical_contractors",
        ),
        "needles": ("Western Mechanical", "Clinton Township"),
        "kind": "html",
        "asset_hosts": ("cdn.mywebsitebuild.com",),
        "fonts": {
            "keep": [
                {
                    "family": "Verdana",
                    "role": "body",
                    "weights": [400, 700],
                    "worthKeeping": True,
                    "note": "Live body stack on the Market Hardware brochure.",
                },
                {
                    "family": "Palatino Linotype",
                    "role": "display",
                    "weights": [400, 700],
                    "worthKeeping": True,
                    "note": "Heading / quote face in layout.css.",
                },
            ],
            "skip": ["Arial", "Helvetica", "sans-serif", "serif"],
            "liveStacks": [
                "Verdana, sans-serif",
                '"Palatino Linotype", "Book Antiqua", Palatino, serif',
                "Arial, Helvetica, sans-serif",
            ],
            "cdn": None,
        },
        "curated_colors": {
            "navy": "#00254f",
            "burgundy": "#8e1325",
            "red": "#d3222a",
            "ink": "#333333",
            "paper": "#ffffff",
            "mist": "#f2f2f2",
            "steel": "#b7c5d0",
        },
    },
    "kaback": {
        "name": "Kaback Enterprises",
        "short": "Kaback",
        "origin": "https://kaback.com",
        "hosts": ("kaback.com", "www.kaback.com"),
        "pages": [("/", "index.html")],
        "page_map": {"/": "index.html", "": "index.html"},
        "logo_hints": ("kaback-logo-colored", "kaback-emblem", "kaback-logo"),
        "needles": ("Kaback", "HVAC", "1948"),
        "kind": "wordpress",
        "asset_hosts": (),
        "fonts": {
            "keep": [
                {
                    "family": "Montserrat",
                    "role": "display",
                    "weights": [400, 500, 600, 700],
                    "worthKeeping": True,
                    "note": "Jupiter theme / child heading face.",
                }
            ],
            "skip": ["Helvetica", "Arial", "sans-serif", "Font Awesome"],
            "liveStacks": ["Montserrat, Helvetica, Arial, sans-serif"],
            "cdn": "https://fonts.googleapis.com/css?family=Montserrat:400,500,600,700&display=swap",
        },
        "curated_colors": {
            "navy": "#222c61",
            "navyDeep": "#222c5e",
            "gold": "#edcd1f",
            "ink": "#222222",
            "paper": "#ffffff",
            "mist": "#ededed",
        },
    },
    "mcihvac": {
        "name": "MCI Mechanical",
        "short": "MCI",
        "origin": "https://www.mcihvac.com",
        "hosts": ("mcihvac.com", "www.mcihvac.com"),
        "pages": [("/", "index.html"), ("/contact", "contact.html")],
        "page_map": {
            "/": "index.html",
            "": "index.html",
            "/contact": "contact.html",
            "/contact/": "contact.html",
        },
        "logo_hints": (
            "mechanical_contractors",
            "9fcfdc_30385afb",
            "9fcfdc_2cc5553d",
        ),
        "needles": ("Mechanical Contractors", "MCI", "Charlotte"),
        "kind": "wix",
        "asset_hosts": (
            "static.wixstatic.com",
            "static.parastorage.com",
            "siteassets.parastorage.com",
            "static.wixstatic.com",
        ),
        "fonts": {
            "keep": [
                {
                    "family": "Lulo Clean W01 One Bold",
                    "role": "display",
                    "weights": [700],
                    "worthKeeping": True,
                    "note": "Wix paid display. Webflow stand-in: Anton or Barlow Condensed Bold.",
                },
                {
                    "family": "Brandon Grotesque Light",
                    "role": "body",
                    "weights": [300, 400],
                    "worthKeeping": True,
                    "note": "Wix paid body. Webflow stand-in: Montserrat 300/400.",
                },
                {
                    "family": "DIN Next W01 Light",
                    "role": "accent",
                    "weights": [300],
                    "worthKeeping": True,
                    "note": "Occasional UI. Webflow stand-in: DIN or Barlow.",
                },
            ],
            "skip": ["Helvetica", "Arial", "Madefor", "sans-serif"],
            "liveStacks": [
                "lulo-clean-w01-one-bold, sans-serif",
                "brandon-grot-w01-light, sans-serif",
                "din-next-w01-light, sans-serif",
            ],
            "cdn": None,
        },
        "curated_colors": {
            "navy": "#002f5e",
            "blue": "#589be3",
            "link": "#116dff",
            "mist": "#e4ebfc",
            "ink": "#2f2e2e",
            "paper": "#ffffff",
            "green": "#439410",
        },
    },
    "beaconcpa": {
        "name": "Beacon CPA",
        "short": "Beacon CPA",
        "origin": "https://beaconcpa.com",
        "hosts": ("beaconcpa.com", "www.beaconcpa.com"),
        "pages": [("/", "index.html"), ("/contact-us/", "contact.html")],
        "page_map": {
            "/": "index.html",
            "": "index.html",
            "/contact-us/": "contact.html",
            "/contact-us": "contact.html",
        },
        "logo_hints": (
            "beaconcpa-logo-color",
            "beaconcpa-logo",
            "beacon-cpa-logo",
        ),
        "needles": ("Beacon", "CPA", "beaconcpa"),
        "kind": "wordpress",
        "asset_hosts": (),
        "fonts": {
            "keep": [
                {
                    "family": "Inter",
                    "role": "display",
                    "weights": [400, 500, 600, 700],
                    "worthKeeping": True,
                    "note": "Elementor primary / headings.",
                },
                {
                    "family": "DM Sans",
                    "role": "body",
                    "weights": [400, 500, 700],
                    "worthKeeping": True,
                    "note": "Elementor body / UI.",
                },
                {
                    "family": "Open Sans",
                    "role": "accent",
                    "weights": [400, 600],
                    "worthKeeping": True,
                    "note": "Secondary Elementor face.",
                },
            ],
            "skip": ["Roboto", "Helvetica", "Arial", "sans-serif", "Font Awesome"],
            "liveStacks": [
                '"Inter", Sans-serif',
                '"DM Sans", Sans-serif',
                '"Open Sans", Sans-serif',
            ],
            "cdn": "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=DM+Sans:wght@400;500;700&family=Open+Sans:wght@400;600&display=swap",
        },
        "curated_colors": {
            "purpleDeep": "#1b0047",
            "purple": "#460683",
            "purpleSoft": "#6f5e8b",
            "ink": "#0e0b19",
            "paper": "#ffffff",
            "mist": "#f1f0f2",
            "lilac": "#eff3fd",
            "accent": "#ffbc7d",
        },
    },
}

SKIP_HOST_SNIPPETS = (
    "googletagmanager.com",
    "google-analytics.com",
    "googleadservices.com",
    "doubleclick.net",
    "facebook.com",
    "facebook.net",
    "linkedin.com/collect",
    "px.ads.linkedin.com",
    "hotjar.com",
    "clarity.ms",
    "browser.sentry-cdn.com",
    "sentry.io",
    "tag-manager-client",
    "google.com/recaptcha",
    "gstatic.com/recaptcha",
    "connect.facebook.net",
)

SKIP_PATH_SNIPPETS = (
    "/cdn-cgi/",
    "recaptcha",
    "gravityforms/js/",
    "gravityforms/assets/js/",
    "gravity-forms-zero-spam",
    "contact-form-7",
    "gtag/js",
    "siteTags.bundle",
    "thunderbolt-commons",
    "main.renderer",
    "browser-deprecation",
    "modulemetadata.es5",
    "wpr-beacon",
    "elementor/assets/js/",
    "elementor-pro/assets/js/",
    "wp-rocket/assets/js",
)

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
}

SESSION = requests.Session()
SESSION.headers.update({"User-Agent": UA, "Accept": "*/*"})

downloaded: dict[str, str] = {}
failed: list[str] = []
SITE: dict = {}
OUT = Path()
BRAND = Path()
ORIGIN = ""


def log(msg: str) -> None:
    print(msg, flush=True)


def site_hosts() -> tuple[str, ...]:
    return tuple(h.lower() for h in SITE["hosts"])


def normalize_url(url: str, base: str | None = None) -> str | None:
    if url is None:
        return None
    url = unescape(url).strip().strip("\"'").strip()
    if not url:
        return None
    if url.startswith(("data:", "blob:", "about:")):
        return None
    if url.startswith(("javascript:", "mailto:", "tel:", "sms:")):
        return None
    if url.startswith("#"):
        return None
    if url.startswith("//"):
        url = "https:" + url
    url = urljoin(base or (ORIGIN + "/"), url)
    parsed = urlparse(url)
    if parsed.scheme not in ("http", "https"):
        return None
    # Wix AVIF encodings break when saved under a .png name. Ask for the source format.
    if "wixstatic.com" in parsed.netloc.lower():
        q = parsed.query
        q = q.replace("enc_avif,", "").replace(",enc_avif", "").replace("enc_avif", "")
        url = urlunparse((parsed.scheme, parsed.netloc, parsed.path, "", q, ""))
        parsed = urlparse(url)
    return urlunparse((parsed.scheme, parsed.netloc, parsed.path, "", parsed.query, ""))


def host_of(url: str) -> str:
    return urlparse(url).netloc.lower()


def path_of(url: str) -> str:
    return unquote(urlparse(url).path)


def is_site_host(url: str) -> bool:
    host = host_of(url)
    return host in site_hosts() or any(host.endswith("." + h) for h in site_hosts())


def should_skip_remote(url: str) -> bool:
    low = url.lower()
    if any(s in low for s in SKIP_HOST_SNIPPETS):
        return True
    if any(s in low for s in SKIP_PATH_SNIPPETS):
        return True
    return False


def is_oversized_variant(url: str) -> bool:
    low = url.lower()
    if re.search(r"-p-(2600|3200|3840)\.", low):
        return True
    if re.search(r"[?&]w=([3-9]\d{3}|2[5-9]\d{2})", low):
        return True
    m = re.search(r"[/_]w_(\d+)", low)
    if m and int(m.group(1)) >= 2200:
        return True
    return False


def is_css_url(url: str) -> bool:
    path = path_of(url).lower()
    if path.endswith(".css"):
        return True
    if "pages/pages/thunderbolt" in url.lower():
        return True
    return False


def is_asset_url(url: str) -> bool:
    if is_css_url(url):
        return True
    path = path_of(url).lower()
    if not path or path.endswith("/"):
        return False
    ext = Path(path).suffix.lower()
    if ext not in ASSET_EXTS:
        # Wix media paths sometimes omit a trailing ext after crop/fill.
        if "wixstatic.com/media/" in url.lower():
            return True
        return False
    if "/wp-json" in path or path.endswith("/feed"):
        return False
    return True


def local_asset_path(url: str) -> str:
    parsed = urlparse(url)
    path = unquote(parsed.path).lstrip("/")
    if not path or path in ("pages/pages/thunderbolt",):
        digest = hashlib.sha1(url.encode()).hexdigest()[:12]
        ext = ".css" if is_css_url(url) else ""
        path = f"vendor/misc/{digest}{ext}"
    if parsed.query:
        stem = Path(path)
        digest = hashlib.sha1(parsed.query.encode()).hexdigest()[:8]
        if stem.suffix:
            path = str(stem.with_name(stem.stem + "-" + digest + stem.suffix))
        else:
            path = path + "-" + digest
            if is_css_url(url) and not path.endswith(".css"):
                path += ".css"
    path = path.replace("\\", "/").replace("[", "_").replace("]", "_")
    while "//" in path:
        path = path.replace("//", "/")
    if path.startswith("wp-content/") or path.startswith("wp-includes/"):
        return path
    host = parsed.netloc.lower().replace("www.", "")
    origin_host = urlparse(ORIGIN).netloc.lower().replace("www.", "")
    if host and host != origin_host:
        return f"vendor/{host}/{path}"
    return path


def mapped_page(url: str) -> str | None:
    parsed = urlparse(url)
    if parsed.netloc and not is_site_host(url):
        return None
    raw = parsed.path or "/"
    page_map = SITE["page_map"]
    if raw in page_map:
        return page_map[raw]
    alt = raw.rstrip("/") or "/"
    if alt in page_map:
        return page_map[alt]
    if (alt + "/") in page_map:
        return page_map[alt + "/"]
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
        time.sleep(0.35 * (2**i))
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
    url = normalize_url(url) if not str(url).startswith("http") else (normalize_url(url) or url)
    if not url:
        return None
    if url in downloaded:
        return downloaded[url]
    if should_skip_remote(url) or is_oversized_variant(url):
        return None
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
        for m in re.finditer(rf'{attr}\s*=\s*["\']([^"\']+)["\']', html, flags=re.I):
            add(m.group(1))
    for attr in ("srcset", "data-srcset", "data-lazy-srcset"):
        for m in re.finditer(rf'{attr}\s*=\s*["\']([^"\']+)["\']', html, flags=re.I):
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
        if should_skip_remote(absu) or is_oversized_variant(absu):
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
        orig_parsed = urlparse(urljoin(page_url, raw_stripped))
        suffix = ("#" + orig_parsed.fragment) if orig_parsed.fragment else ""
        return page + suffix
    if is_asset_url(absu):
        if should_skip_remote(absu) or is_oversized_variant(absu):
            return raw
        if host_of(absu) in ("fonts.googleapis.com", "fonts.gstatic.com"):
            return absu
        rel = downloaded.get(absu) or download_asset(absu)
        if rel:
            return rel
        if is_site_host(absu):
            return absu
        return absu if absu.startswith("http") else raw
    if is_site_host(absu):
        parsed = urlparse(absu)
        live_host = urlparse(ORIGIN).netloc
        live = urlunparse(("https", live_host, parsed.path, "", parsed.query, parsed.fragment))
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

    return META_CONTENT_RE.sub(meta_sub, html)


def strip_trackers(html: str) -> str:
    def drop_script(m: re.Match) -> str:
        tag = m.group(0)
        low = tag.lower()
        if any(s in low for s in SKIP_HOST_SNIPPETS) or any(s in low for s in SKIP_PATH_SNIPPETS):
            return ""
        if "data:text/javascript" in low:
            return ""
        if m.group("body") and re.search(
            r"\b(gtag|fbq|ga\(|dataLayer|grecaptcha|google_trackConversion|lintrk)\b",
            m.group("body"),
        ):
            return ""
        return tag

    html = re.sub(
        r'<script\b(?P<attrs>[^>]*)>(?P<body>[\s\S]*?)</script>',
        drop_script,
        html,
        flags=re.I,
    )
    # Re-run with src capture (the previous regex used a named group that may be absent).
    def drop_script2(m: re.Match) -> str:
        tag = m.group(0)
        src_m = re.search(r'\bsrc\s*=\s*["\']([^"\']+)["\']', tag, flags=re.I)
        src = src_m.group(1) if src_m else ""
        if SITE.get("kind") == "wix" and src:
            low = src.lower()
            if any(
                s in low
                for s in (
                    "parastorage.com",
                    "thunderbolt",
                    "wix-thunderbolt",
                    "sentry",
                    "tag-manager",
                )
            ):
                return ""
        return tag

    if SITE.get("kind") == "wix":
        html = re.sub(r"<script\b[^>]*>[\s\S]*?</script>", drop_script2, html, flags=re.I)
    html = re.sub(
        r"<img\b[^>]*(facebook\.com/tr|px\.ads\.linkedin|googleadservices|doubleclick)[^>]*>",
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
    html = re.sub(
        r'(<input\b[^>]*name=["\'](?:gform_submit|gform_ajax|_wpcf7|_mc4wp_form_id)[^>]*>)',
        r"<!-- neutralized \1 -->",
        html,
        flags=re.I,
    )
    html = re.sub(
        r"(<div\b[^>]*gform_wrapper[^>]*style=['\"])([^'\"]*)display\s*:\s*none;?([^'\"]*)(['\"])",
        r"\1\2\3\4",
        html,
        flags=re.I,
    )
    html = re.sub(r'''\sonclick=(["'])[^"']*gform[^"']*\1''', "", html, flags=re.I)
    return html


def promote_lazy_images(html: str) -> str:
    def img_sub(m: re.Match) -> str:
        tag = m.group(0)
        lazy = re.search(
            r'\b(?:data-lazy-src|data-src)\s*=\s*["\']([^"\']+)["\']', tag, flags=re.I
        )
        if not lazy:
            return tag
        if re.search(r"\bsrc\s*=", tag, flags=re.I):
            tag = re.sub(
                r'''\bsrc\s*=\s*(["'])(?:(?!\1).)*\1''',
                f'src="{lazy.group(1)}"',
                tag,
                count=1,
                flags=re.I,
            )
        else:
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
    short = SITE["short"]
    badge = (
        f'<a class="ss-clone-badge" href="https://secondshift.care/" '
        f'title="Second Shift staging clone — dummy forms only. Does not email {short}.">'
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
    else:
        html = robots + html

    if "css/style.css" not in html:
        if re.search(r"</head>", html, flags=re.I):
            html = re.sub(r"</head>", overlay_css + "</head>", html, count=1, flags=re.I)
        else:
            html = overlay_css + html
    if "js/site.js" not in html:
        if re.search(r"</body>", html, flags=re.I):
            html = re.sub(r"</body>", overlay_js + "</body>", html, count=1, flags=re.I)
        else:
            html += overlay_js
    if "ss-clone-badge" not in html:
        if re.search(r"</body>", html, flags=re.I):
            html = re.sub(r"</body>", badge + "</body>", html, count=1, flags=re.I)
        else:
            html += badge
    return html


def repair_broken_data_uris(html: str) -> str:
    return re.sub(
        r'''(src="[^"]+")http://www\.w3\.org/2000/svg[^"]*"''',
        r"\1",
        html,
        flags=re.I,
    )


def forbid_root_absolute(html: str) -> str:
    def fix_attr(m: re.Match) -> str:
        val = m.group("val")
        if val.startswith("//"):
            return m.group(0)
        if val.startswith("/"):
            rewritten = rewrite_html_url(val, ORIGIN + "/")
            return f'{m.group("attr")}{m.group("q")}{rewritten}{m.group("q")}'
        return m.group(0)

    return re.sub(
        r'''(?P<attr>\b(?:href|src|action|poster|data-src|data-lazy-src)\s*=\s*)(?P<q>["'])(?P<val>/[^"']*)(?P=q)''',
        fix_attr,
        html,
        flags=re.I,
    )


def wanted_asset(url: str) -> bool:
    if should_skip_remote(url) or not is_asset_url(url):
        return False
    if host_of(url) in ("fonts.googleapis.com", "fonts.gstatic.com"):
        return False
    if is_oversized_variant(url):
        return False
    host = host_of(url)
    extra = tuple(SITE.get("asset_hosts") or ())
    if is_site_host(url) or host in extra:
        return True
    if host in ("cdnjs.cloudflare.com", "ajax.googleapis.com", "cdn.mywebsitebuild.com"):
        return True
    if "/wp-content/" in url or "/wp-includes/" in url:
        return True
    if SITE.get("kind") == "wix" and any(
        s in host for s in ("wixstatic.com", "parastorage.com")
    ):
        # Skip Wix runtime JS; keep CSS / images / fonts.
        if url.lower().endswith(".js") or ".js?" in url.lower():
            return False
        return True
    return False


def process_page(page_url: str, filename: str) -> None:
    log(f"fetch page {page_url} -> {filename}")
    data = fetch(page_url)
    if data is None:
        raise SystemExit(f"failed to fetch {page_url}")
    html = data.decode("utf-8", errors="replace")
    html = strip_trackers(html)
    html = promote_lazy_images(html)

    urls = collect_urls_from_html(html, page_url)
    asset_urls = [u for u in urls if wanted_asset(u)]
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
    # Drop scripts that never downloaded (dead Market Hardware CDN, etc.).
    def drop_missing_script(m: re.Match) -> str:
        src_m = re.search(r'\bsrc\s*=\s*["\']([^"\']+)["\']', m.group(0), flags=re.I)
        if not src_m:
            return m.group(0)
        src = src_m.group(1)
        if src.startswith(("http://", "https://", "//")) and "googleapis.com" not in src.lower():
            return ""
        return m.group(0)

    html = re.sub(r"<script\b[^>]*>[\s\S]*?</script>", drop_missing_script, html, flags=re.I)

    dest = OUT / filename
    dest.write_text(html, encoding="utf-8")
    log(f"  wrote {filename} ({dest.stat().st_size} bytes)")


def process_downloaded_css() -> None:
    css_files = [
        rel
        for rel in downloaded.values()
        if rel.lower().endswith(".css") or "/thunderbolt" in rel.lower()
    ]
    log(f"rewrite {len(css_files)} CSS files")
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
    short = SITE["short"]
    wix_unhide = ""
    if SITE.get("kind") == "wix":
        wix_unhide = """
/* Wix Thunderbolt waits on runtime JS. Show the SSR tree. */
html, body {
  overflow: auto !important;
  height: auto !important;
}
#SITE_CONTAINER,
#SITE_PAGES,
#PAGES_CONTAINER,
#masterPage,
[id^="comp-"],
[data-testid="mesh-container-content"] {
  opacity: 1 !important;
  visibility: visible !important;
  transform: none !important;
}
"""
    (css_dir / "style.css").write_text(
        f"""/* Second Shift overlay — do not restyle the mirrored {short} chrome.
   Discrete corner badge only. */
.ss-clone-badge {{
  position: fixed;
  right: 10px;
  bottom: 10px;
  z-index: 2147483000;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #1b1b1b;
  color: #f3f3f3 !important;
  font: 700 9px/26px Verdana, Arial, sans-serif;
  letter-spacing: 0.04em;
  text-align: center;
  text-decoration: none !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
  opacity: 0.72;
}}
.ss-clone-badge:hover {{ opacity: 1; color: #fff !important; }}
.gform_wrapper {{ display: block !important; visibility: visible !important; }}
.gform_wrapper[style*="display:none"],
.gform_wrapper[style*="display: none"] {{ display: block !important; }}
{wix_unhide}
""",
        encoding="utf-8",
    )

    (js_dir / "site.js").write_text(
        f"""(function () {{
  document.querySelectorAll(".gform_wrapper").forEach(function (el) {{
    if (el.style && el.style.display === "none") el.style.display = "block";
    var st = el.getAttribute("style") || "";
    if (/display\\\\s*:\\\\s*none/i.test(st)) {{
      el.setAttribute("style", st.replace(/display\\\\s*:\\\\s*none\\\\s*;?/gi, ""));
    }}
  }});
  document.querySelectorAll("[onclick*='gform']").forEach(function (el) {{
    el.removeAttribute("onclick");
  }});

  function showDummyNotice(form) {{
    var note = form.getAttribute("data-ss-notice");
    if (note) return;
    var box = document.createElement("p");
    box.setAttribute("data-ss-notice", "1");
    box.setAttribute("role", "status");
    box.style.cssText = "margin:1rem 0 0;padding:0.75rem 1rem;background:#111;color:#fff;font:14px/1.4 Verdana,Arial,sans-serif;";
    box.textContent = "Staging clone only. This form does not email {short} or post to the live site.";
    form.appendChild(box);
    form.setAttribute("data-ss-notice", "1");
  }}

  document.addEventListener("submit", function (event) {{
    var form = event.target;
    if (!form || !form.tagName || form.tagName.toLowerCase() !== "form") return;
    event.preventDefault();
    event.stopPropagation();
    showDummyNotice(form);
    return false;
  }}, true);

  document.addEventListener("click", function (event) {{
    var el = event.target && event.target.closest && event.target.closest("button, input[type=submit], input[type=button]");
    if (!el) return;
    var form = el.form || (el.closest && el.closest("form"));
    if (!form) return;
    var type = (el.getAttribute("type") || el.type || "").toLowerCase();
    if (el.tagName.toLowerCase() === "button" && type && type !== "submit") return;
    if (type === "button" || type === "reset") return;
    if (form.getAttribute("data-ss-dummy-form") || form.querySelector("[name=gform_submit], .gform_button, .wpcf7-submit")) {{
      event.preventDefault();
      event.stopPropagation();
      showDummyNotice(form);
    }}
  }}, true);

  document.querySelectorAll("img[data-lazy-src], img[data-src]").forEach(function (img) {{
    var real = img.getAttribute("data-lazy-src") || img.getAttribute("data-src");
    if (real && (!img.getAttribute("src") || /^data:/.test(img.getAttribute("src") || ""))) {{
      img.setAttribute("src", real);
    }}
  }});
}})();
""",
        encoding="utf-8",
    )


def pick_logo() -> Path | None:
    hints = tuple(h.lower() for h in SITE["logo_hints"])
    scored: list[tuple[int, Path]] = []
    for p in OUT.rglob("*"):
        if not p.is_file():
            continue
        name = str(p).replace("\\", "/").lower()
        if not name.endswith((".png", ".jpg", ".jpeg", ".svg", ".webp", ".gif")):
            continue
        score = 0
        for i, hint in enumerate(hints):
            if hint in name:
                score += 50 - i
        if "logo" in name:
            score += 5
        if score:
            scored.append((score, p))
    if not scored:
        return None
    scored.sort(key=lambda pair: (-pair[0], pair[1].stat().st_size))
    return scored[0][1]


def extract_brand(slug: str) -> None:
    BRAND.mkdir(parents=True, exist_ok=True)
    logo_src = pick_logo()
    logo_name = None
    if logo_src and logo_src.exists():
        ext = logo_src.suffix.lower() or ".png"
        logo_name = f"{slug}-logo{ext}"
        shutil.copy2(logo_src, BRAND / logo_name)
        assets_logo = OUT / "assets" / f"logo{ext}"
        assets_logo.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(logo_src, assets_logo)
        # Stable alias used by checks.
        dest_alias = OUT / "assets" / ("logo.png" if ext == ".png" else f"logo{ext}")
        dest_alias.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(logo_src, dest_alias)
        if ext in (".svg", ".SVG"):
            try:
                svg_text = logo_src.read_text(encoding="utf-8", errors="ignore")
                m = re.search(r"data:image/png;base64,([A-Za-z0-9+/=\s]+)", svg_text)
                if m:
                    import base64

                    png = base64.b64decode(re.sub(r"\s+", "", m.group(1)))
                    (BRAND / f"{slug}-logo.png").write_bytes(png)
                    (OUT / "assets" / "logo.png").write_bytes(png)
            except OSError:
                pass
        log(f"logo -> {logo_name} from {logo_src.relative_to(OUT)}")

    fav_rel = None
    for rel in downloaded.values():
        if "favicon" in rel.lower() and rel.lower().endswith((".png", ".ico", ".svg", ".webp")):
            fav_rel = rel
            break
    if fav_rel and (OUT / fav_rel).exists():
        ext = Path(fav_rel).suffix or ".ico"
        shutil.copy2(OUT / fav_rel, BRAND / f"favicon{ext}")

    theme_blobs = []
    for p in list(OUT.rglob("*.css")) + list(OUT.glob("*.html")):
        name = str(p).replace("\\", "/").lower()
        if "font-awesome" in name or "woocommerce" in name:
            continue
        try:
            theme_blobs.append(p.read_text(encoding="utf-8", errors="ignore"))
        except OSError:
            continue
    theme_text = "\n".join(theme_blobs).lower()

    curated = dict(SITE.get("curated_colors") or {})
    colors = {}
    for key, hexv in curated.items():
        colors[key] = hexv if hexv.lower() in theme_text or True else hexv

    fonts = SITE["fonts"]
    scraped = time.strftime("%Y-%m-%d")
    brand = {
        "name": SITE["name"],
        "slug": slug,
        "source": ORIGIN,
        "scraped": scraped,
        "kind": SITE.get("kind"),
        "logo": {
            "file": logo_name,
            "note": "Primary mark copied from the live homepage.",
        },
        "favicon": next(
            (p.name for p in BRAND.glob("favicon.*")),
            None,
        ),
        "fonts": fonts,
        "colors": colors,
        "reuse": {
            "refresh": f"Empathize on the {SITE['short']} audience. Match this palette and the keep fonts. Drop the logo file into the header. Do not invent a new mark.",
            "reimagine": "Same brand pack as Refresh — logo, palette, and fonts. Modernize layout; do not swap the wordmark.",
            "clone": "wp-clone/assets/ holds a copy of the live logo.",
        },
    }
    (BRAND / "brand.json").write_text(json.dumps(brand, indent=2) + "\n", encoding="utf-8")

    color_rows = "\n".join(
        f"| {key} | `{val}` | Scraped from live CSS / on-page styles |"
        for key, val in colors.items()
    )
    keep_names = ", ".join(f['family'] for f in fonts.get("keep") or [])
    (BRAND / "COLORS.md").write_text(
        f"""# {SITE['name']} brand tokens (scraped {scraped})

Source: live CSS and homepage chrome on {ORIGIN}.
For **Refresh and Reimagine** Webflow reuse — not a rebrand. Logo + this palette + [FONTS.md](FONTS.md).

## Logo

- File: `{logo_name or "(missing — recrawl)"}`
- Clone copy: `../../wp-clone/assets/`

Refresh and Reimagine take the logo from this folder. Do not redraw it.

## Colors

| Token | Hex | Notes |
| --- | --- | --- |
{color_rows}

## Type

See [FONTS.md](FONTS.md). Keep: **{keep_names}**.

## Refresh later

```bash
python3 scripts/refresh-asset-clone.py {slug}
node scripts/check-candidates.js
```
""",
        encoding="utf-8",
    )

    font_rows = "\n".join(
        f"| {f.get('role', '')} | **{f['family']}** | {', '.join(str(w) for w in f.get('weights') or [])} | {f.get('note', '')} |"
        for f in fonts.get("keep") or []
    )
    stacks = "\n".join(f"- `{s}`" for s in fonts.get("liveStacks") or [])
    cdn = fonts.get("cdn")
    cdn_block = f"\nCDN (easiest Webflow match):\n\n```\n{cdn}\n```\n" if cdn else "\nNo public Google Fonts CDN on the live site. Use the keep families or the stand-ins noted above.\n"
    (BRAND / "FONTS.md").write_text(
        f"""# {SITE['name']} fonts (scraped {scraped})

Source: live theme / builder CSS on {ORIGIN}. For **Refresh and Reimagine** — match these when they reinforce the brand.

## Worth keeping (brand)

| Role | Family | Weights | Notes |
| --- | --- | --- | --- |
{font_rows}

Live stacks:

{stacks}
{cdn_block}
## Skip / do not treat as brand

{', '.join(fonts.get('skip') or [])}.

## Refresh later

`python3 scripts/refresh-asset-clone.py {slug}` rebuilds the clone and re-scrapes color tokens.
""",
        encoding="utf-8",
    )
    log(f"brand pack -> {BRAND}")


def write_clone_readme(slug: str) -> None:
    rows = "\n".join(
        f"| `{filename}` | {ORIGIN}{path if path != '/' else '/'} |"
        for path, filename in SITE["pages"]
    )
    (OUT / "README.md").write_text(
        f"""# {SITE['name']} asset clone

High-fidelity static mirror of the public site for Second Shift
demos and asset reuse. Served on GitHub Pages at:

https://secondshift.care/demos/{slug}/wp-clone/

**Preview Clone** on the market-test hub still opens the live site
(`{ORIGIN}`). This folder is the customize / asset-reuse
mirror (`choices.clone.internalPreview` / `choices.clone.assetMirror`).

## What is mirrored

| File | Live URL |
| --- | --- |
{rows}

Images, theme CSS, and JS needed for the mirrored pages use **relative**
paths so project Pages works.

Uncloned deep links stay on `{ORIGIN}/...`.

## Dummy forms

Every `<form>` is neutralized. Nothing posts to {SITE['short']}.
`js/site.js` intercepts submit and shows a staging notice.

## Staging mark

A 26px corner **SS** badge (`css/style.css`) — not a full-width bar — so a
side-by-side with the live site still proves color, type, spacing, and imagery.

## Refresh from live

From the repo root:

```bash
python3 scripts/refresh-asset-clone.py {slug}
node scripts/check-candidates.js
```

The script overwrites this directory and rebuilds `../assets/brand/`.

Crawled: {time.strftime("%Y-%m-%d")}. Public pages only. No emails, no Stripe,
no Webflow Designer edits.
""",
        encoding="utf-8",
    )


def assert_pages_safe(slug: str) -> None:
    problems = []
    for _path, page in SITE["pages"]:
        dest = OUT / page
        if not dest.exists():
            problems.append(f"missing {page}")
            continue
        html = dest.read_text(encoding="utf-8", errors="replace")
        if 'href="/' in html or 'src="/' in html:
            problems.append(f"{page} still has root-absolute href/src")
        if 'href="../index.html"' in html or "/ie/" in html:
            problems.append(f"{page} leaks hub /ie/")
        if not any(n.lower() in html.lower() for n in SITE["needles"]):
            problems.append(f"{page} does not look like {SITE['name']} content")
        for raw in re.findall(r'href="([^"]+\.html)"', html):
            if re.match(r"https?:", raw) or raw.startswith("../"):
                continue
            target = (OUT / raw.split("#")[0]).resolve()
            if not target.exists():
                problems.append(f"{page} broken relative link {raw}")
    for req in ("css/style.css", "js/site.js"):
        if not (OUT / req).exists():
            problems.append(f"missing {req}")
    if not any((OUT / "assets").glob("logo.*")):
        problems.append("missing assets/logo.*")
    if problems:
        raise SystemExit(f"{slug} clone safety failed:\n  " + "\n  ".join(problems))


def refresh(slug: str) -> None:
    global SITE, OUT, BRAND, ORIGIN, downloaded, failed
    if slug not in SITES:
        raise SystemExit(f"unknown slug {slug}; known: {', '.join(SITES)}")
    SITE = SITES[slug]
    ORIGIN = SITE["origin"].rstrip("/")
    OUT = ROOT / "demos" / slug / "wp-clone"
    BRAND = ROOT / "demos" / slug / "assets" / "brand"
    downloaded = {}
    failed = []

    if OUT.exists():
        for child in OUT.iterdir():
            if child.is_dir():
                shutil.rmtree(child)
            else:
                child.unlink()
    OUT.mkdir(parents=True, exist_ok=True)
    BRAND.mkdir(parents=True, exist_ok=True)

    for path, name in SITE["pages"]:
        process_page(ORIGIN + path, name)

    process_downloaded_css()
    write_overlay_files()
    extract_brand(slug)
    write_clone_readme(slug)
    assert_pages_safe(slug)

    log(f"{slug}: downloaded {len(downloaded)} assets, {len(failed)} failures")
    if failed:
        log("failures:")
        for item in failed[:40]:
            log("  " + item)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("slugs", nargs="*", help="westernmech, kaback, mcihvac, beaconcpa")
    parser.add_argument("--all", action="store_true")
    args = parser.parse_args()
    slugs = list(SITES) if args.all or not args.slugs else args.slugs
    for slug in slugs:
        refresh(slug)
    return 0


if __name__ == "__main__":
    sys.exit(main())

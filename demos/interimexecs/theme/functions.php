<?php
/**
 * InterimExecs Public Clone — installable demo theme.
 *
 * Second Shift / GrayBeard LLC case-study theme. Recreates the public
 * InterimExecs site in core WordPress only. No Tiny Frog proprietary PHP.
 * No premium plugins. Contact form is staging-only and never emails.
 *
 * @package InterimExecs_Clone
 */

if (!defined('ABSPATH')) {
    exit;
}

define('IE_CLONE_VERSION', '1.0.0');

function ie_clone_setup() {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', array('search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script'));
    add_theme_support('automatic-feed-links');

    register_nav_menus(array(
        'utility' => __('Utility Menu', 'interimexecs-clone'),
        'primary' => __('Primary Menu', 'interimexecs-clone'),
        'footer'  => __('Footer Menu', 'interimexecs-clone'),
    ));
}
add_action('after_setup_theme', 'ie_clone_setup');

function ie_clone_assets() {
    wp_enqueue_style(
        'ie-clone-fonts',
        'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&family=Oswald:wght@400;500;600;700&display=swap',
        array(),
        null
    );
    wp_enqueue_style('ie-clone', get_stylesheet_uri(), array('ie-clone-fonts'), IE_CLONE_VERSION);
    wp_enqueue_script('ie-clone', get_template_directory_uri() . '/js/site.js', array(), IE_CLONE_VERSION, true);
}
add_action('wp_enqueue_scripts', 'ie_clone_assets');

/**
 * Staging contact handler. Does not call wp_mail().
 */
function ie_clone_handle_staging_form() {
    if (empty($_POST['ie_clone_staging']) || empty($_POST['_wpnonce'])) {
        return;
    }
    if (!wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['_wpnonce'])), 'ie_clone_staging')) {
        return;
    }
    if (!empty($_POST['website'])) {
        return;
    }
    set_transient('ie_clone_form_ok_' . ie_clone_visitor_key(), 1, 10 * MINUTE_IN_SECONDS);
    wp_safe_redirect(esc_url_raw(add_query_arg('staging', 'received', wp_get_referer() ? wp_get_referer() : home_url('/'))));
    exit;
}
add_action('template_redirect', 'ie_clone_handle_staging_form');

function ie_clone_visitor_key() {
    $ip = isset($_SERVER['REMOTE_ADDR']) ? sanitize_text_field(wp_unslash($_SERVER['REMOTE_ADDR'])) : 'local';
    return md5($ip);
}

function ie_clone_form_received() {
    return (isset($_GET['staging']) && $_GET['staging'] === 'received')
        || get_transient('ie_clone_form_ok_' . ie_clone_visitor_key());
}

function ie_clone_nav_fallback($args) {
    $items = array(
        home_url('/')                 => 'Home',
        home_url('/services/')        => 'Problems We Solve',
        home_url('/our-approach/')    => 'Our Approach',
        home_url('/case-studies/')    => 'Case Studies',
        home_url('/blog/')            => 'Blog',
        home_url('/about/')           => 'About',
    );
    echo '<nav class="primary-nav" aria-label="Primary">';
    foreach ($items as $url => $label) {
        echo '<a href="' . esc_url($url) . '">' . esc_html($label) . '</a>';
    }
    echo '</nav>';
}

<?php
if (!defined('ABSPATH')) {
    exit;
}
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo('charset'); ?>" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
  <div class="demo-banner">Second Shift staging theme. Dummy forms only — nothing is emailed to Interim Execs.</div>
  <div class="utility">
    <div class="wrap">
      <a href="<?php echo esc_url(home_url('/interims-apply/')); ?>">Interims Apply</a>
      <a class="phone" href="tel:+18478492800">847.849.2800</a>
      <a href="<?php echo esc_url(home_url('/contact/')); ?>">Contact</a>
    </div>
  </div>
  <header class="site-header">
    <div class="wrap">
      <a class="brand" href="<?php echo esc_url(home_url('/')); ?>">
        <span class="brand-mark">IE</span>
        <span class="brand-name">InterimExecs</span>
      </a>
      <button class="nav-toggle" type="button" aria-expanded="false">Menu</button>
      <?php
      if (has_nav_menu('primary')) {
          wp_nav_menu(array(
              'theme_location' => 'primary',
              'container'      => 'nav',
              'container_class'=> 'primary-nav',
              'container_aria_label' => 'Primary',
              'fallback_cb'    => false,
          ));
      } else {
          ie_clone_nav_fallback(array());
      }
      ?>
    </div>
  </header>

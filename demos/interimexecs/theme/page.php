<?php
if (!defined('ABSPATH')) {
    exit;
}
get_header();
?>
<section class="page-hero">
  <div class="wrap">
    <h1><?php the_title(); ?></h1>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <?php
    while (have_posts()) {
        the_post();
        the_content();
    }
    ?>
  </div>
</section>
<?php get_footer(); ?>

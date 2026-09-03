<?php
if (!defined('ABSPATH')) {
    exit;
}
get_header();
?>
<section class="page-hero">
  <div class="wrap">
    <h1><?php echo esc_html(get_the_title(get_option('page_for_posts')) ?: 'Blog'); ?></h1>
    <p>Public listing. Full articles stay on the live site unless you publish them here.</p>
  </div>
</section>
<section class="section">
  <div class="wrap blog-list">
    <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
      <article class="blog-item">
        <p class="meta"><?php echo esc_html(get_the_date()); ?></p>
        <h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
        <?php the_excerpt(); ?>
      </article>
    <?php endwhile; else : ?>
      <p>No posts yet. Use the public clone listing at <code>demos/interimexecs/wp-clone/blog.html</code> for the static demo.</p>
    <?php endif; ?>
  </div>
</section>
<?php get_footer(); ?>

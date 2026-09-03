<?php
/**
 * Template Name: Contact
 */
if (!defined('ABSPATH')) {
    exit;
}
get_header();
?>
<section class="page-hero">
  <div class="wrap">
    <h1>Join Other Bold Organizations Reaching for Big Results</h1>
    <p>InterimExecs &nbsp; Call 847-849-2800 &nbsp; Text 847-562-5267</p>
  </div>
</section>
<section class="section">
  <div class="wrap split">
    <div>
      <p class="kicker">Confidential discussion</p>
      <h2>Contact us</h2>
      <p>Call us at +1 (847) 849-2800 or fill out a contact request form to set up a confidential discussion.</p>
      <p>110 W. Superior Street, Suite 703<br>Chicago IL 60654</p>
    </div>
    <div>
      <?php get_template_part('template-parts/staging-form'); ?>
    </div>
  </div>
</section>
<?php get_footer(); ?>

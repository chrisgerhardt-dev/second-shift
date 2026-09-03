<?php
if (!defined('ABSPATH')) {
    exit;
}
$received = function_exists('ie_clone_form_received') && ie_clone_form_received();
?>
<p class="form-note">Staging form only. This theme does not email Interim Execs or post to the live WordPress site.</p>
<?php if ($received) : ?>
  <div class="form-success show">Received in this staging demo only. No message was sent to Interim Execs.</div>
<?php endif; ?>
<form class="ie-form" action="<?php echo esc_url(home_url(add_query_arg(array()))); ?>" method="post">
  <?php wp_nonce_field('ie_clone_staging'); ?>
  <input type="hidden" name="ie_clone_staging" value="1" />
  <label class="honeypot">Website<input type="text" name="website" tabindex="-1" autocomplete="off"></label>
  <div><label for="first">First Name*</label><input id="first" name="first" required></div>
  <div><label for="last">Last Name*</label><input id="last" name="last" required></div>
  <div><label for="email">Email*</label><input id="email" name="email" type="email" required></div>
  <div><label for="phone">Phone*</label><input id="phone" name="phone" required></div>
  <div class="full"><label for="company">Company*</label><input id="company" name="company" required></div>
  <div class="full"><label for="situation">Situation*</label><textarea id="situation" name="situation" required></textarea></div>
  <label class="full check"><input type="checkbox" name="newsletter"> Sign me up to join top executives, owners, and investors who receive ideas every month from InterimExecs on transformational leadership and business growth.</label>
  <div class="full"><button class="btn" type="submit">Submit</button></div>
</form>

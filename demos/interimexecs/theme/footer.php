<?php
if (!defined('ABSPATH')) {
    exit;
}
?>
  <footer class="site-footer">
    <div class="wrap">
      <div class="footer-grid">
        <div>
          <h3>InterimExecs</h3>
          <p>110 W. Superior Street<br>Suite 703<br>Chicago IL 60654</p>
          <p><a href="tel:+18478492800">847.849.2800</a></p>
        </div>
        <div>
          <h3>Explore</h3>
          <p>
            <a href="<?php echo esc_url(home_url('/services/')); ?>">Problems We Solve</a><br>
            <a href="<?php echo esc_url(home_url('/our-approach/')); ?>">Our Approach</a><br>
            <a href="<?php echo esc_url(home_url('/case-studies/')); ?>">Case Studies</a><br>
            <a href="<?php echo esc_url(home_url('/blog/')); ?>">Blog</a>
          </p>
        </div>
        <div>
          <h3>Company</h3>
          <p>
            <a href="<?php echo esc_url(home_url('/about/')); ?>">About</a><br>
            <a href="<?php echo esc_url(home_url('/contact/')); ?>">Contact</a><br>
            <a href="<?php echo esc_url(home_url('/interims-apply/')); ?>">Interims Apply</a>
          </p>
        </div>
      </div>
      <p class="footer-legal">Public-site clone theme for Second Shift / GrayBeard LLC. Authorized test client. Not Tiny Frog proprietary code.</p>
    </div>
  </footer>
  <?php wp_footer(); ?>
</body>
</html>

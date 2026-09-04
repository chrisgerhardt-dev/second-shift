jQuery( function($) {
	
	if ($(window).width() > 980) {	
		var img_left = $('.sticky-img img').offset();
		var img_width = $('.sticky-img img').width();

		//To switch the grey text to black - when it comes within offset set the class or remove it
		$('.sticky-text ul li').waypoint(function(direction) {
			if (direction == "down") {
				$(this.element).addClass('on');
			}
			else {
				$(this.element).removeClass('on');
			}
		}, 
		{
			offset: '35%'
		}
		);

		//First li should switch the image to be fixed with correct left and width css
		$('.sticky-text ul li:first-child').waypoint(function(direction) {
			if (direction == "down") {
				$('.sticky-img img').addClass('sticky');
				$('.sticky-img img.sticky').css('left', img_left.left);
				$('.sticky-img img.sticky').css('width', img_width);
			}
			else {
				$('.sticky-img img').removeClass('sticky');
				$('.sticky-img img.sticky').css('left', 0);
			}
		});

		//Second last li should switch the image to be normal (because last looks odd)
		$('.sticky-text ul li:nth-last-child(2)').waypoint(function(direction) {
			if (direction == "down") {
				$('.sticky-img img').removeClass('sticky');
				$('.sticky-img img.sticky').css('left', 0);
			}
			else {
				$('.sticky-img img').addClass('sticky');
				$('.sticky-img img.sticky').css('left', img_left.left);
				$('.sticky-img img.sticky').css('width', img_width);
			}
		});
	}

});

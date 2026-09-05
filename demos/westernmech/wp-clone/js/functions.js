(function($){

Site = {
	nav: function() {
		$(this)
			.bind('mouseenter', function(){
				$(this).addClass('hover');
			})
			.bind('mouseleave', function(){
				$(this).removeClass('hover');
			});
	},
	
	validate: function() {
		$(this).validate();
	},

	init: function() {
		// Navigation
		$('#nav li').each(Site.nav);
		
		// Validation
		$('form').each(Site.validate);
	}
};

$(document).ready(Site.init);

})(jQuery);
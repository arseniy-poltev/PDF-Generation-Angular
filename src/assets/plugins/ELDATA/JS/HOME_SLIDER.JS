// JavaScript Document
jQuery(function() {
jQuery('#slider').carouFredSel({
	width: '100%',
	align: true,
	items: 2,
	auto:true,
	items: {
		width: jQuery('#slider_wrapper').width() * 0.15,
		height: 500,
		visible: 1,
		minimum: 1
	},
	scroll: {
		items: 1,
		timeoutDuration : 5000,
		onBefore: function(data) {

			//	find current and next slide
			var currentSlide = jQuery('.slide.active', this),
				nextSlide = data.items.visible,
				_width = jQuery('#slider_wrapper').width();

			//	resize currentslide to small version
			currentSlide.stop().animate({
				width: _width * 0.15
			});		
			currentSlide.removeClass( 'active' );

			//	hide current block
			data.items.old.add( data.items.visible ).find( '.slide-block' ).stop().fadeOut();					

			//	animate clicked slide to large size
			nextSlide.addClass( 'active' );
			nextSlide.stop().animate({
				width: _width * 0.7
			});						
		},
		onAfter: function(data) {
			//	show active slide block
			data.items.visible.last().find( '.slide-block' ).stop().fadeIn();
		}
	},
	onCreate: function(data){

		//	clone images for better sliding and insert them dynamacly in slider
		var newitems = jQuery('.slide',this).clone( true ),
			_width = jQuery('#slider_wrapper').width();

		jQuery(this).trigger( 'insertItem', [newitems, newitems.length, false] );

		//	show images 
		jQuery('.slide', this).fadeIn();
		jQuery('.slide:first-child', this).addClass( 'active' );
		jQuery('.slide', this).width( _width * 0.15 );

		//	enlarge first slide
		jQuery('.slide:first-child', this).animate({
			width: _width * 0.7
		});

		//	show first title block and hide the rest
		jQuery(this).find( '.slide-block' ).hide();
		jQuery(this).find( '.slide.active .slide-block' ).stop().fadeIn();
	}
});

//	Handle click events
jQuery('#slider').children().click(function() {
	jQuery('#slider').trigger( 'slideTo', [this] );
});

//	Enable code below if you want to support browser resizing
jQuery(window).resize(function(){

	var slider = jQuery('#slider'),
		_width = jQuery('#slider_wrapper').width();

	//	show images
	slider.find( '.slide' ).width( _width * 0.15 );

	//	enlarge first slide
	slider.find( '.slide.active' ).width( _width * 0.7 );

	//	update item width config
	slider.trigger( 'configuration', ['items.width', _width * 0.15] );
});

});

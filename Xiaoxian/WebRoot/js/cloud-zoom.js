if (typeof Object.create !== "function") {
	"use strict";
	Object.create = function(b) {
		function a() {
		}
		a.prototype = b;return new a()
	}
}
(function(c, e, a, d) {
	var b = {
		init : function(g, f) {
			var h = this;
			h.elem = f;
			h.jQueryelem = c(f);
			h.imageSrc = h.jQueryelem.data("zoom-image") ? h.jQueryelem.data("zoom-image") : h.jQueryelem.attr("src");
			h.options = c.extend({}, c.fn.elevateZoom.options, g);
			if (h.options.tint) {
				h.options.lensColour = "none", h.options.lensOpacity = "1"
			}
			if (h.options.zoomType == "inner") {
				h.options.showLens = false
			}
			h.jQueryelem.parent().removeAttr("title").removeAttr("alt");
			h.zoomImage = h.imageSrc;h.refresh(1);c("#" + h.options.gallery + " a").click(function(i) {
				if (h.options.galleryActiveClass) {
					c("#" + h.options.gallery + " a").removeClass(h.options.galleryActiveClass);c(this).addClass(h.options.galleryActiveClass)
				}
				i.preventDefault();
				if (c(this).data("zoom-image")) {
					h.zoomImagePre = c(this).data("zoom-image")
				} else {
					h.zoomImagePre = c(this).data("image")
				}
				h.swaptheimage(c(this).data("image"), h.zoomImagePre);return false
			})
		},
		refresh : function(f) {
			var g = this;
			setTimeout(function() {
				g.fetch(g.imageSrc)
			}, f || g.options.refresh)
		},
		fetch : function(f) {
			var h = this;
			var g = new Image();
			g.onload = function() {
				h.largeWidth = g.width;
				h.largeHeight = g.height;h.startZoom();
				h.currentImage = h.imageSrc;h.options.onZoomedImageLoaded(h.jQueryelem)
			};
			g.src = f;return
		},
		startZoom : function() {
			var g = this;
			g.nzWidth = g.jQueryelem.width();
			g.nzHeight = g.jQueryelem.height();
			g.isWindowActive = false;
			g.isLensActive = false;
			g.isTintActive = false;
			g.overWindow = false;
			if (g.options.imageCrossfade) {
				g.zoomWrap = g.jQueryelem.wrap('<div style="height:' + g.nzHeight + "px;width:" + g.nzWidth + 'px;" class="zoomWrapper" />');g.jQueryelem.css("position", "absolute")
			}
			g.zoomLock = 1;
			g.scrollingLock = false;
			g.changeBgSize = false;
			g.currentZoomLevel = g.options.zoomLevel;
			g.nzOffset = g.jQueryelem.offset();
			g.widthRatio = (g.largeWidth / g.currentZoomLevel) / g.nzWidth;
			g.heightRatio = (g.largeHeight / g.currentZoomLevel) / g.nzHeight;
			if (g.options.zoomType == "window") {
				g.zoomWindowStyle = "overflow: hidden;background-position: 0px 0px;text-align:center;background-color: " + String(g.options.zoomWindowBgColour) + ";width: " + String(g.options.zoomWindowWidth) + "px;height: " + String(g.options.zoomWindowHeight) + "px;float: left;background-size: " + g.largeWidth / g.currentZoomLevel + "px " + g.largeHeight / g.currentZoomLevel + "px;display: none;z-index:100;border: " + String(g.options.borderSize) + "px solid " + g.options.borderColour + ";background-repeat: no-repeat;position: absolute;"
			}
			if (g.options.zoomType == "inner") {
				var f = g.jQueryelem.css("border-left-width");
				g.zoomWindowStyle = "overflow: hidden;margin-left: " + String(f) + ";margin-top: " + String(f) + ";background-position: 0px 0px;width: " + String(g.nzWidth) + "px;height: " + String(g.nzHeight) + "px;float: left;display: none;cursor:" + (g.options.cursor) + ";px solid " + g.options.borderColour + ";background-repeat: no-repeat;position: absolute;"
			}
			if (g.options.zoomType == "window") {
				if (g.nzHeight < g.options.zoomWindowWidth / g.widthRatio) {
					lensHeight = g.nzHeight
				} else {
					lensHeight = String((g.options.zoomWindowHeight / g.heightRatio))
				}
				if (g.largeWidth < g.options.zoomWindowWidth) {
					lensWidth = g.nzWidth
				} else {
					lensWidth = (g.options.zoomWindowWidth / g.widthRatio)
				}
				g.lensStyle = "background-position: 0px 0px;width: " + String((g.options.zoomWindowWidth) / g.widthRatio) + "px;height: " + String((g.options.zoomWindowHeight) / g.heightRatio) + "px;float: right;display: none;overflow: hidden;z-index: 999;-webkit-transform: translateZ(0);opacity:" + (g.options.lensOpacity) + ";filter: alpha(opacity = " + (g.options.lensOpacity * 100) + "); zoom:1;width:" + lensWidth + "px;height:" + lensHeight + "px;background-color:" + (g.options.lensColour) + ";cursor:" + (g.options.cursor) + ";border: " + (g.options.lensBorderSize) + "px solid " + (g.options.lensBorderColour) + ";background-repeat: no-repeat;position: absolute;"
			}
			g.tintStyle = "display: block;position: absolute;background-color: " + g.options.tintColour + ";filter:alpha(opacity=0);opacity: 0;width: " + g.nzWidth + "px;height: " + g.nzHeight + "px;";
			g.lensRound = "";
			if (g.options.zoomType == "lens") {
				g.lensStyle = "background-position: 0px 0px;float: left;display: none;border: " + String(g.options.borderSize) + "px solid " + g.options.borderColour + ";width:" + String(g.options.lensSize) + "px;height:" + String(g.options.lensSize) + "px;background-repeat: no-repeat;position: absolute;"
			}
			if (g.options.lensShape == "round") {
				g.lensRound = "border-top-left-radius: " + String(g.options.lensSize / 2 + g.options.borderSize) + "px;border-top-right-radius: " + String(g.options.lensSize / 2 + g.options.borderSize) + "px;border-bottom-left-radius: " + String(g.options.lensSize / 2 + g.options.borderSize) + "px;border-bottom-right-radius: " + String(g.options.lensSize / 2 + g.options.borderSize) + "px;"
			}
			g.zoomContainer = c('<div class="zoomContainer" style="-webkit-transform: translateZ(0);position:absolute;left:' + g.nzOffset.left + "px;top:" + g.nzOffset.top + "px;height:" + g.nzHeight + "px;width:" + g.nzWidth + 'px;"></div>');c("body").append(g.zoomContainer);
			if (g.options.containLensZoom && g.options.zoomType == "lens") {
				g.zoomContainer.css("overflow", "hidden")
			}
			if (g.options.zoomType != "inner") {
				g.zoomLens = c("<div class='zoomLens' style='" + g.lensStyle + g.lensRound + "'>&nbsp;</div>").appendTo(g.zoomContainer).click(function() {
					g.jQueryelem.trigger("click")
				});
				if (g.options.tint) {
					g.tintContainer = c("<div/>").addClass("tintContainer");
					g.zoomTint = c("<div class='zoomTint' style='" + g.tintStyle + "'></div>");g.zoomLens.wrap(g.tintContainer);
					g.zoomTintcss = g.zoomLens.after(g.zoomTint);
					g.zoomTintImage = c('<img style="position: absolute; left: 0px; top: 0px; max-width: none; width: ' + g.nzWidth + "px; height: " + g.nzHeight + 'px;" src="' + g.imageSrc + '">').appendTo(g.zoomLens).click(function() {
						g.jQueryelem.trigger("click")
					})
				}
			}
			if (isNaN(g.options.zoomWindowPosition)) {
				g.zoomWindow = c("<div style='z-index:999;left:" + (g.windowOffsetLeft) + "px;top:" + (g.windowOffsetTop) + "px;" + g.zoomWindowStyle + "' class='zoomWindow'>&nbsp;</div>").appendTo("body").click(function() {
					g.jQueryelem.trigger("click")
				})
			} else {
				g.zoomWindow = c("<div style='z-index:999;left:" + (g.windowOffsetLeft) + "px;top:" + (g.windowOffsetTop) + "px;" + g.zoomWindowStyle + "' class='zoomWindow'>&nbsp;</div>").appendTo(g.zoomContainer).click(function() {
					g.jQueryelem.trigger("click")
				})
			}
			g.zoomWindowContainer = c("<div/>").addClass("zoomWindowContainer").css("width", g.options.zoomWindowWidth);g.zoomWindow.wrap(g.zoomWindowContainer);
			if (g.options.zoomType == "lens") {
				g.zoomLens.css({
					backgroundImage : "url('" + g.imageSrc + "')"
				})
			}
			if (g.options.zoomType == "window") {
				g.zoomWindow.css({
					backgroundImage : "url('" + g.imageSrc + "')"
				})
			}
			if (g.options.zoomType == "inner") {
				g.zoomWindow.css({
					backgroundImage : "url('" + g.imageSrc + "')"
				})
			}
			g.jQueryelem.bind("touchmove", function(h) {
				h.preventDefault();
				var i = h.originalEvent.touches[0] || h.originalEvent.changedTouches[0];
				g.setPosition(i)
			});g.zoomContainer.bind("touchmove", function(h) {
				if (g.options.zoomType == "inner") {
					g.showHideWindow("show")
				}
				h.preventDefault();
				var i = h.originalEvent.touches[0] || h.originalEvent.changedTouches[0];
				g.setPosition(i)
			});g.zoomContainer.bind("touchend", function(h) {
				g.showHideWindow("hide");
				if (g.options.showLens) {
					g.showHideLens("hide")
				}
				if (g.options.tint && g.options.zoomType != "inner") {
					g.showHideTint("hide")
				}
			});g.jQueryelem.bind("touchend", function(h) {
				g.showHideWindow("hide");
				if (g.options.showLens) {
					g.showHideLens("hide")
				}
				if (g.options.tint && g.options.zoomType != "inner") {
					g.showHideTint("hide")
				}
			});
			if (g.options.showLens) {
				g.zoomLens.bind("touchmove", function(h) {
					h.preventDefault();
					var i = h.originalEvent.touches[0] || h.originalEvent.changedTouches[0];
					g.setPosition(i)
				});g.zoomLens.bind("touchend", function(h) {
					g.showHideWindow("hide");
					if (g.options.showLens) {
						g.showHideLens("hide")
					}
					if (g.options.tint && g.options.zoomType != "inner") {
						g.showHideTint("hide")
					}
				})
			}
			g.jQueryelem.bind("mousemove", function(h) {
				if (g.overWindow == false) {
					g.setElements("show")
				}
				if (g.lastX !== h.clientX || g.lastY !== h.clientY) {
					g.setPosition(h);
					g.currentLoc = h
				}
				g.lastX = h.clientX;
				g.lastY = h.clientY
			});g.zoomContainer.bind("mousemove", function(h) {
				if (g.overWindow == false) {
					g.setElements("show")
				}
				if (g.lastX !== h.clientX || g.lastY !== h.clientY) {
					g.setPosition(h);
					g.currentLoc = h
				}
				g.lastX = h.clientX;
				g.lastY = h.clientY
			});
			if (g.options.zoomType != "inner") {
				g.zoomLens.bind("mousemove", function(h) {
					if (g.lastX !== h.clientX || g.lastY !== h.clientY) {
						g.setPosition(h);
						g.currentLoc = h
					}
					g.lastX = h.clientX;
					g.lastY = h.clientY
				})
			}
			if (g.options.tint && g.options.zoomType != "inner") {
				g.zoomTint.bind("mousemove", function(h) {
					if (g.lastX !== h.clientX || g.lastY !== h.clientY) {
						g.setPosition(h);
						g.currentLoc = h
					}
					g.lastX = h.clientX;
					g.lastY = h.clientY
				})
			}
			if (g.options.zoomType == "inner") {
				g.zoomWindow.bind("mousemove", function(h) {
					if (g.lastX !== h.clientX || g.lastY !== h.clientY) {
						g.setPosition(h);
						g.currentLoc = h
					}
					g.lastX = h.clientX;
					g.lastY = h.clientY
				})
			}
			g.zoomContainer.add(g.jQueryelem).mouseenter(function() {
				if (g.overWindow == false) {
					g.setElements("show")
				}
			}).mouseleave(function() {
				if (!g.scrollLock) {
					g.setElements("hide")
				}
			});
			if (g.options.zoomType != "inner") {
				g.zoomWindow.mouseenter(function() {
					g.overWindow = true;g.setElements("hide")
				}).mouseleave(function() {
					g.overWindow = false
				})
			}
			if (g.options.zoomLevel != 1) {
			}
			if (g.options.minZoomLevel) {
				g.minZoomLevel = g.options.minZoomLevel
			} else {
				g.minZoomLevel = g.options.scrollZoomIncrement * 2
			}
			if (g.options.scrollZoom) {
				g.zoomContainer.add(g.jQueryelem).bind("mousewheel DOMMouseScroll MozMousePixelScroll", function(h) {
					g.scrollLock = true;clearTimeout(c.data(this, "timer"));c.data(this, "timer", setTimeout(function() {
						g.scrollLock = false
					}, 250));
					var i = h.originalEvent.wheelDelta || h.originalEvent.detail * -1;
					h.stopImmediatePropagation();h.stopPropagation();h.preventDefault();
					if (i / 120 > 0) {
						if (g.currentZoomLevel >= g.minZoomLevel) {
							g.changeZoomLevel(g.currentZoomLevel - g.options.scrollZoomIncrement)
						}
					} else {
						if (g.options.maxZoomLevel) {
							if (g.currentZoomLevel <= g.options.maxZoomLevel) {
								g.changeZoomLevel(parseFloat(g.currentZoomLevel) + g.options.scrollZoomIncrement)
							}
						} else {
							g.changeZoomLevel(parseFloat(g.currentZoomLevel) + g.options.scrollZoomIncrement)
						}
					}
					return false
				})
			}
		},
		setElements : function(g) {
			var f = this;
			if (!f.options.zoomEnabled) {
				return false
			}
			if (g == "show") {
				if (f.isWindowSet) {
					if (f.options.zoomType == "inner") {
						f.showHideWindow("show")
					}
					if (f.options.zoomType == "window") {
						f.showHideWindow("show")
					}
					if (f.options.showLens) {
						f.showHideLens("show")
					}
					if (f.options.tint && f.options.zoomType != "inner") {
						f.showHideTint("show")
					}
				}
			}
			if (g == "hide") {
				if (f.options.zoomType == "window") {
					f.showHideWindow("hide")
				}
				if (!f.options.tint) {
					f.showHideWindow("hide")
				}
				if (f.options.showLens) {
					f.showHideLens("hide")
				}
				if (f.options.tint) {
					f.showHideTint("hide")
				}
			}
		},
		setPosition : function(f) {
			var g = this;
			if (!g.options.zoomEnabled) {
				return false
			}
			g.nzHeight = g.jQueryelem.height();
			g.nzWidth = g.jQueryelem.width();
			g.nzOffset = g.jQueryelem.offset();
			if (g.options.tint && g.options.zoomType != "inner") {
				g.zoomTint.css({
					top : 0
				});g.zoomTint.css({
					left : 0
				})
			}
			if (g.options.responsive && !g.options.scrollZoom) {
				if (g.options.showLens) {
					if (g.nzHeight < g.options.zoomWindowWidth / g.widthRatio) {
						lensHeight = g.nzHeight
					} else {
						lensHeight = String((g.options.zoomWindowHeight / g.heightRatio))
					}
					if (g.largeWidth < g.options.zoomWindowWidth) {
						lensWidth = g.nzWidth
					} else {
						lensWidth = (g.options.zoomWindowWidth / g.widthRatio)
					}
					g.widthRatio = g.largeWidth / g.nzWidth;
					g.heightRatio = g.largeHeight / g.nzHeight;
					if (g.options.zoomType != "lens") {
						if (g.nzHeight < g.options.zoomWindowWidth / g.widthRatio) {
							lensHeight = g.nzHeight
						} else {
							lensHeight = String((g.options.zoomWindowHeight / g.heightRatio))
						}
						if (g.options.zoomWindowWidth < g.options.zoomWindowWidth) {
							lensWidth = g.nzWidth
						} else {
							lensWidth = (g.options.zoomWindowWidth / g.widthRatio)
						}
						g.zoomLens.css("width", lensWidth);g.zoomLens.css("height", lensHeight);
						if (g.options.tint) {
							g.zoomTintImage.css("width", g.nzWidth);g.zoomTintImage.css("height", g.nzHeight)
						}
					}
					if (g.options.zoomType == "lens") {
						g.zoomLens.css({
							width : String(g.options.lensSize) + "px",
							height : String(g.options.lensSize) + "px"
						})
					}
				}
			}
			g.zoomContainer.css({
				top : g.nzOffset.top
			});g.zoomContainer.css({
				left : g.nzOffset.left
			});
			g.mouseLeft = parseInt(f.pageX - g.nzOffset.left);
			g.mouseTop = parseInt(f.pageY - g.nzOffset.top);
			if (g.options.zoomType == "window") {
				g.Etoppos = (g.mouseTop < (g.zoomLens.height() / 2));
				g.Eboppos = (g.mouseTop > g.nzHeight - (g.zoomLens.height() / 2) - (g.options.lensBorderSize * 2));
				g.Eloppos = (g.mouseLeft < 0 + ((g.zoomLens.width() / 2)));
				g.Eroppos = (g.mouseLeft > (g.nzWidth - (g.zoomLens.width() / 2) - (g.options.lensBorderSize * 2)))
			}
			if (g.options.zoomType == "inner") {
				g.Etoppos = (g.mouseTop < ((g.nzHeight / 2) / g.heightRatio));
				g.Eboppos = (g.mouseTop > (g.nzHeight - ((g.nzHeight / 2) / g.heightRatio)));
				g.Eloppos = (g.mouseLeft < 0 + (((g.nzWidth / 2) / g.widthRatio)));
				g.Eroppos = (g.mouseLeft > (g.nzWidth - (g.nzWidth / 2) / g.widthRatio - (g.options.lensBorderSize * 2)))
			}
			if (g.mouseLeft <= 0 || g.mouseTop < 0 || g.mouseLeft > g.nzWidth || g.mouseTop > g.nzHeight) {
				g.setElements("hide");return
			} else {
				if (g.options.showLens) {
					g.lensLeftPos = String(g.mouseLeft - g.zoomLens.width() / 2);
					g.lensTopPos = String(g.mouseTop - g.zoomLens.height() / 2)
				}
				if (g.Etoppos) {
					g.lensTopPos = 0
				}
				if (g.Eloppos) {
					g.windowLeftPos = 0;
					g.lensLeftPos = 0;
					g.tintpos = 0
				}
				if (g.options.zoomType == "window") {
					if (g.Eboppos) {
						g.lensTopPos = Math.max((g.nzHeight) - g.zoomLens.height() - (g.options.lensBorderSize * 2), 0)
					}
					if (g.Eroppos) {
						g.lensLeftPos = (g.nzWidth - (g.zoomLens.width()) - (g.options.lensBorderSize * 2))
					}
				}
				if (g.options.zoomType == "inner") {
					if (g.Eboppos) {
						g.lensTopPos = Math.max(((g.nzHeight) - (g.options.lensBorderSize * 2)), 0)
					}
					if (g.Eroppos) {
						g.lensLeftPos = (g.nzWidth - (g.nzWidth) - (g.options.lensBorderSize * 2))
					}
				}
				if (g.options.zoomType == "lens") {
					g.windowLeftPos = String(((f.pageX - g.nzOffset.left) * g.widthRatio - g.zoomLens.width() / 2) * (-1));
					g.windowTopPos = String(((f.pageY - g.nzOffset.top) * g.heightRatio - g.zoomLens.height() / 2) * (-1));g.zoomLens.css({
						backgroundPosition : g.windowLeftPos + "px " + g.windowTopPos + "px"
					});
					if (g.changeBgSize) {
						if (g.nzHeight > g.nzWidth) {
							if (g.options.zoomType == "lens") {
								g.zoomLens.css({
									"background-size" : g.largeWidth / g.newvalueheight + "px " + g.largeHeight / g.newvalueheight + "px"
								})
							}
							g.zoomWindow.css({
								"background-size" : g.largeWidth / g.newvalueheight + "px " + g.largeHeight / g.newvalueheight + "px"
							})
						} else {
							if (g.options.zoomType == "lens") {
								g.zoomLens.css({
									"background-size" : g.largeWidth / g.newvaluewidth + "px " + g.largeHeight / g.newvaluewidth + "px"
								})
							}
							g.zoomWindow.css({
								"background-size" : g.largeWidth / g.newvaluewidth + "px " + g.largeHeight / g.newvaluewidth + "px"
							})
						}
						g.changeBgSize = false
					}
					g.setWindowPostition(f)
				}
				if (g.options.tint && g.options.zoomType != "inner") {
					g.setTintPosition(f)
				}
				if (g.options.zoomType == "window") {
					g.setWindowPostition(f)
				}
				if (g.options.zoomType == "inner") {
					g.setWindowPostition(f)
				}
				if (g.options.showLens) {
					if (g.fullwidth && g.options.zoomType != "lens") {
						g.lensLeftPos = 0
					}
					g.zoomLens.css({
						left : g.lensLeftPos + "px",
						top : g.lensTopPos + "px"
					})
				}
			}
		},
		showHideWindow : function(f) {
			var g = this;
			if (f == "show") {
				if (!g.isWindowActive) {
					if (g.options.zoomWindowFadeIn) {
						g.zoomWindow.stop(true, true, false).fadeIn(g.options.zoomWindowFadeIn)
					} else {
						g.zoomWindow.show()
					}
					g.isWindowActive = true
				}
			}
			if (f == "hide") {
				if (g.isWindowActive) {
					if (g.options.zoomWindowFadeOut) {
						g.zoomWindow.stop(true, true).fadeOut(g.options.zoomWindowFadeOut)
					} else {
						g.zoomWindow.hide()
					}
					g.isWindowActive = false
				}
			}
		},
		showHideLens : function(f) {
			var g = this;
			if (f == "show") {
				if (!g.isLensActive) {
					if (g.options.lensFadeIn) {
						g.zoomLens.stop(true, true, false).fadeIn(g.options.lensFadeIn)
					} else {
						g.zoomLens.show()
					}
					g.isLensActive = true
				}
			}
			if (f == "hide") {
				if (g.isLensActive) {
					if (g.options.lensFadeOut) {
						g.zoomLens.stop(true, true).fadeOut(g.options.lensFadeOut)
					} else {
						g.zoomLens.hide()
					}
					g.isLensActive = false
				}
			}
		},
		showHideTint : function(f) {
			var g = this;
			if (f == "show") {
				if (!g.isTintActive) {
					if (g.options.zoomTintFadeIn) {
						g.zoomTint.css({
							opacity : g.options.tintOpacity
						}).animate().stop(true, true).fadeIn("slow")
					} else {
						g.zoomTint.css({
							opacity : g.options.tintOpacity
						}).animate();g.zoomTint.show()
					}
					g.isTintActive = true
				}
			}
			if (f == "hide") {
				if (g.isTintActive) {
					if (g.options.zoomTintFadeOut) {
						g.zoomTint.stop(true, true).fadeOut(g.options.zoomTintFadeOut)
					} else {
						g.zoomTint.hide()
					}
					g.isTintActive = false
				}
			}
		},
		setLensPostition : function(f) {},
		setWindowPostition : function(f) {
			var g = this;
			if (!isNaN(g.options.zoomWindowPosition)) {
				switch (g.options.zoomWindowPosition) {
				case 1:
					g.windowOffsetTop = (g.options.zoomWindowOffety);g.windowOffsetLeft = (+g.nzWidth);
					break;case 2:
					if (g.options.zoomWindowHeight > g.nzHeight) {
						g.windowOffsetTop = ((g.options.zoomWindowHeight / 2) - (g.nzHeight / 2)) * (-1);
						g.windowOffsetLeft = (g.nzWidth)
					} else {
					}
					break;case 3:
					g.windowOffsetTop = (g.nzHeight - g.zoomWindow.height() - (g.options.borderSize * 2));g.windowOffsetLeft = (g.nzWidth);
					break;case 4:
					g.windowOffsetTop = (g.nzHeight);g.windowOffsetLeft = (g.nzWidth);
					break;case 5:
					g.windowOffsetTop = (g.nzHeight);g.windowOffsetLeft = (g.nzWidth - g.zoomWindow.width() - (g.options.borderSize * 2));
					break;case 6:
					if (g.options.zoomWindowHeight > g.nzHeight) {
						g.windowOffsetTop = (g.nzHeight);
						g.windowOffsetLeft = ((g.options.zoomWindowWidth / 2) - (g.nzWidth / 2) + (g.options.borderSize * 2)) * (-1)
					} else {
					}
					break;case 7:
					g.windowOffsetTop = (g.nzHeight);g.windowOffsetLeft = 0;
					break;case 8:
					g.windowOffsetTop = (g.nzHeight);g.windowOffsetLeft = (g.zoomWindow.width() + (g.options.borderSize * 2)) * (-1);
					break;case 9:
					g.windowOffsetTop = (g.nzHeight - g.zoomWindow.height() - (g.options.borderSize * 2));g.windowOffsetLeft = (g.zoomWindow.width() + (g.options.borderSize * 2)) * (-1);
					break;case 10:
					if (g.options.zoomWindowHeight > g.nzHeight) {
						g.windowOffsetTop = ((g.options.zoomWindowHeight / 2) - (g.nzHeight / 2)) * (-1);
						g.windowOffsetLeft = (g.zoomWindow.width() + (g.options.borderSize * 2)) * (-1)
					} else {
					}
					break;case 11:
					g.windowOffsetTop = (g.options.zoomWindowOffety);g.windowOffsetLeft = (g.zoomWindow.width() + (g.options.borderSize * 2)) * (-1);
					break;case 12:
					g.windowOffsetTop = (g.zoomWindow.height() + (g.options.borderSize * 2)) * (-1);g.windowOffsetLeft = (g.zoomWindow.width() + (g.options.borderSize * 2)) * (-1);
					break;case 13:
					g.windowOffsetTop = (g.zoomWindow.height() + (g.options.borderSize * 2)) * (-1);g.windowOffsetLeft = (0);
					break;case 14:
					if (g.options.zoomWindowHeight > g.nzHeight) {
						g.windowOffsetTop = (g.zoomWindow.height() + (g.options.borderSize * 2)) * (-1);
						g.windowOffsetLeft = ((g.options.zoomWindowWidth / 2) - (g.nzWidth / 2) + (g.options.borderSize * 2)) * (-1)
					} else {
					}
					break;case 15:
					g.windowOffsetTop = (g.zoomWindow.height() + (g.options.borderSize * 2)) * (-1);g.windowOffsetLeft = (g.nzWidth - g.zoomWindow.width() - (g.options.borderSize * 2));
					break;case 16:
					g.windowOffsetTop = (g.zoomWindow.height() + (g.options.borderSize * 2)) * (-1);g.windowOffsetLeft = (g.nzWidth);
					break;default:
					g.windowOffsetTop = (g.options.zoomWindowOffety);g.windowOffsetLeft = (g.nzWidth)
				}
			} else {
				g.externalContainer = c("#" + g.options.zoomWindowPosition);
				g.externalContainerWidth = g.externalContainer.width();
				g.externalContainerHeight = g.externalContainer.height();
				g.externalContainerOffset = g.externalContainer.offset();
				g.windowOffsetTop = g.externalContainerOffset.top;
				g.windowOffsetLeft = g.externalContainerOffset.left
			}
			g.isWindowSet = true;
			g.windowOffsetTop = g.windowOffsetTop + g.options.zoomWindowOffety;
			g.windowOffsetLeft = g.windowOffsetLeft + g.options.zoomWindowOffetx;g.zoomWindow.css({
				top : g.windowOffsetTop
			});g.zoomWindow.css({
				left : g.windowOffsetLeft
			});
			if (g.options.zoomType == "inner") {
				g.zoomWindow.css({
					top : 0
				});g.zoomWindow.css({
					left : 0
				})
			}
			g.windowLeftPos = String(((f.pageX - g.nzOffset.left) * g.widthRatio - g.zoomWindow.width() / 2) * (-1));
			g.windowTopPos = String(((f.pageY - g.nzOffset.top) * g.heightRatio - g.zoomWindow.height() / 2) * (-1));
			if (g.Etoppos) {
				g.windowTopPos = 0
			}
			if (g.Eloppos) {
				g.windowLeftPos = 0
			}
			if (g.Eboppos) {
				g.windowTopPos = (g.largeHeight / g.currentZoomLevel - g.zoomWindow.height()) * (-1)
			}
			if (g.Eroppos) {
				g.windowLeftPos = ((g.largeWidth / g.currentZoomLevel - g.zoomWindow.width()) * (-1))
			}
			if (g.fullheight) {
				g.windowTopPos = 0
			}
			if (g.fullwidth) {
				g.windowLeftPos = 0
			}
			if (g.options.zoomType == "window" || g.options.zoomType == "inner") {
				if (g.zoomLock == 1) {
					if (g.widthRatio <= 1) {
						g.windowLeftPos = 0
					}
					if (g.heightRatio <= 1) {
						g.windowTopPos = 0
					}
				}
				if (g.largeHeight < g.options.zoomWindowHeight) {
					g.windowTopPos = 0
				}
				if (g.largeWidth < g.options.zoomWindowWidth) {
					g.windowLeftPos = 0
				}
				if (g.options.easing) {
					if (!g.xp) {
						g.xp = 0
					}
					if (!g.yp) {
						g.yp = 0
					}
					if (!g.loop) {
						g.loop = setInterval(function() {
							g.xp += (g.windowLeftPos - g.xp) / g.options.easingAmount;
							g.yp += (g.windowTopPos - g.yp) / g.options.easingAmount;
							if (g.scrollingLock) {
								clearInterval(g.loop);
								g.xp = g.windowLeftPos;
								g.yp = g.windowTopPos;
								g.xp = ((f.pageX - g.nzOffset.left) * g.widthRatio - g.zoomWindow.width() / 2) * (-1);
								g.yp = (((f.pageY - g.nzOffset.top) * g.heightRatio - g.zoomWindow.height() / 2) * (-1));
								if (g.changeBgSize) {
									if (g.nzHeight > g.nzWidth) {
										if (g.options.zoomType == "lens") {
											g.zoomLens.css({
												"background-size" : g.largeWidth / g.newvalueheight + "px " + g.largeHeight / g.newvalueheight + "px"
											})
										}
										g.zoomWindow.css({
											"background-size" : g.largeWidth / g.newvalueheight + "px " + g.largeHeight / g.newvalueheight + "px"
										})
									} else {
										if (g.options.zoomType != "lens") {
											g.zoomLens.css({
												"background-size" : g.largeWidth / g.newvaluewidth + "px " + g.largeHeight / g.newvalueheight + "px"
											})
										}
										g.zoomWindow.css({
											"background-size" : g.largeWidth / g.newvaluewidth + "px " + g.largeHeight / g.newvaluewidth + "px"
										})
									}
									g.changeBgSize = false
								}
								g.zoomWindow.css({
									backgroundPosition : g.windowLeftPos + "px " + g.windowTopPos + "px"
								});
								g.scrollingLock = false;
								g.loop = false
							} else {
								if (g.changeBgSize) {
									if (g.nzHeight > g.nzWidth) {
										if (g.options.zoomType == "lens") {
											g.zoomLens.css({
												"background-size" : g.largeWidth / g.newvalueheight + "px " + g.largeHeight / g.newvalueheight + "px"
											})
										}
										g.zoomWindow.css({
											"background-size" : g.largeWidth / g.newvalueheight + "px " + g.largeHeight / g.newvalueheight + "px"
										})
									} else {
										if (g.options.zoomType != "lens") {
											g.zoomLens.css({
												"background-size" : g.largeWidth / g.newvaluewidth + "px " + g.largeHeight / g.newvaluewidth + "px"
											})
										}
										g.zoomWindow.css({
											"background-size" : g.largeWidth / g.newvaluewidth + "px " + g.largeHeight / g.newvaluewidth + "px"
										})
									}
									g.changeBgSize = false
								}
								g.zoomWindow.css({
									backgroundPosition : g.xp + "px " + g.yp + "px"
								})
							}
						}, 16)
					}
				} else {
					if (g.changeBgSize) {
						if (g.nzHeight > g.nzWidth) {
							if (g.options.zoomType == "lens") {
								g.zoomLens.css({
									"background-size" : g.largeWidth / g.newvalueheight + "px " + g.largeHeight / g.newvalueheight + "px"
								})
							}
							g.zoomWindow.css({
								"background-size" : g.largeWidth / g.newvalueheight + "px " + g.largeHeight / g.newvalueheight + "px"
							})
						} else {
							if (g.options.zoomType == "lens") {
								g.zoomLens.css({
									"background-size" : g.largeWidth / g.newvaluewidth + "px " + g.largeHeight / g.newvaluewidth + "px"
								})
							}
							if ((g.largeHeight / g.newvaluewidth) < g.options.zoomWindowHeight) {
								g.zoomWindow.css({
									"background-size" : g.largeWidth / g.newvaluewidth + "px " + g.largeHeight / g.newvaluewidth + "px"
								})
							} else {
								g.zoomWindow.css({
									"background-size" : g.largeWidth / g.newvalueheight + "px " + g.largeHeight / g.newvalueheight + "px"
								})
							}
						}
						g.changeBgSize = false
					}
					g.zoomWindow.css({
						backgroundPosition : g.windowLeftPos + "px " + g.windowTopPos + "px"
					})
				}
			}
		},
		setTintPosition : function(f) {
			var g = this;
			g.nzOffset = g.jQueryelem.offset();
			g.tintpos = String(((f.pageX - g.nzOffset.left) - (g.zoomLens.width() / 2)) * (-1));
			g.tintposy = String(((f.pageY - g.nzOffset.top) - g.zoomLens.height() / 2) * (-1));
			if (g.Etoppos) {
				g.tintposy = 0
			}
			if (g.Eloppos) {
				g.tintpos = 0
			}
			if (g.Eboppos) {
				g.tintposy = (g.nzHeight - g.zoomLens.height() - (g.options.lensBorderSize * 2)) * (-1)
			}
			if (g.Eroppos) {
				g.tintpos = ((g.nzWidth - g.zoomLens.width() - (g.options.lensBorderSize * 2)) * (-1))
			}
			if (g.options.tint) {
				if (g.fullheight) {
					g.tintposy = 0
				}
				if (g.fullwidth) {
					g.tintpos = 0
				}
				g.zoomTintImage.css({
					left : g.tintpos + "px"
				});g.zoomTintImage.css({
					top : g.tintposy + "px"
				})
			}
		},
		swaptheimage : function(i, f) {
			var h = this;
			var g = new Image();
			if (h.options.loadingIcon) {
				h.spinner = c("<div style=\"background: url('" + h.options.loadingIcon + "') no-repeat center;height:" + h.nzHeight + "px;width:" + h.nzWidth + 'px;z-index: 2000;position: absolute; background-position: center center;"></div>');h.jQueryelem.after(h.spinner)
			}
			h.options.onImageSwap(h.jQueryelem);
			g.onload = function() {
				h.largeWidth = g.width;
				h.largeHeight = g.height;
				h.zoomImage = f;h.zoomWindow.css({
					"background-size" : h.largeWidth + "px " + h.largeHeight + "px"
				});h.zoomWindow.css({
					"background-size" : h.largeWidth + "px " + h.largeHeight + "px"
				});h.swapAction(i, f);return
			};
			g.src = f
		},
		swapAction : function(m, f) {
			var l = this;
			var h = new Image();
			h.onload = function() {
				l.nzHeight = h.height;
				l.nzWidth = h.width;l.options.onImageSwapComplete(l.jQueryelem);l.doneCallback();return
			};
			h.src = m;
			l.currentZoomLevel = l.options.zoomLevel;
			l.options.maxZoomLevel = false;
			if (l.options.zoomType == "lens") {
				l.zoomLens.css({
					backgroundImage : "url('" + f + "')"
				})
			}
			if (l.options.zoomType == "window") {
				l.zoomWindow.css({
					backgroundImage : "url('" + f + "')"
				})
			}
			if (l.options.zoomType == "inner") {
				l.zoomWindow.css({
					backgroundImage : "url('" + f + "')"
				})
			}
			l.currentImage = f;
			if (l.options.imageCrossfade) {
				var j = l.jQueryelem;
				var g = j.clone();
				l.jQueryelem.attr("src", m);l.jQueryelem.after(g);g.stop(true).fadeOut(l.options.imageCrossfade, function() {
					c(this).remove()
				});l.jQueryelem.width("auto").removeAttr("width");l.jQueryelem.height("auto").removeAttr("height");j.fadeIn(l.options.imageCrossfade);
				if (l.options.tint && l.options.zoomType != "inner") {
					var k = l.zoomTintImage;
					var i = k.clone();
					l.zoomTintImage.attr("src", f);l.zoomTintImage.after(i);i.stop(true).fadeOut(l.options.imageCrossfade, function() {
						c(this).remove()
					});k.fadeIn(l.options.imageCrossfade);l.zoomTint.css({
						height : l.jQueryelem.height()
					});l.zoomTint.css({
						width : l.jQueryelem.width()
					})
				}
				l.zoomContainer.css("height", l.jQueryelem.height());l.zoomContainer.css("width", l.jQueryelem.width());
				if (l.options.zoomType == "inner") {
					if (!l.options.constrainType) {
						l.zoomWrap.parent().css("height", l.jQueryelem.height());l.zoomWrap.parent().css("width", l.jQueryelem.width());l.zoomWindow.css("height", l.jQueryelem.height());l.zoomWindow.css("width", l.jQueryelem.width())
					}
				}
				if (l.options.imageCrossfade) {
					l.zoomWrap.css("height", l.jQueryelem.height());l.zoomWrap.css("width", l.jQueryelem.width())
				}
			} else {
				l.jQueryelem.attr("src", m);
				if (l.options.tint) {
					l.zoomTintImage.attr("src", f);l.zoomTintImage.attr("height", l.jQueryelem.height());l.zoomTintImage.css({
						height : l.jQueryelem.height()
					});l.zoomTint.css({
						height : l.jQueryelem.height()
					})
				}
				l.zoomContainer.css("height", l.jQueryelem.height());l.zoomContainer.css("width", l.jQueryelem.width());
				if (l.options.imageCrossfade) {
					l.zoomWrap.css("height", l.jQueryelem.height());l.zoomWrap.css("width", l.jQueryelem.width())
				}
			}
			if (l.options.constrainType) {
				if (l.options.constrainType == "height") {
					l.zoomContainer.css("height", l.options.constrainSize);l.zoomContainer.css("width", "auto");
					if (l.options.imageCrossfade) {
						l.zoomWrap.css("height", l.options.constrainSize);l.zoomWrap.css("width", "auto");
						l.constwidth = l.zoomWrap.width()
					} else {
						l.jQueryelem.css("height", l.options.constrainSize);l.jQueryelem.css("width", "auto");
						l.constwidth = l.jQueryelem.width()
					}
					if (l.options.zoomType == "inner") {
						l.zoomWrap.parent().css("height", l.options.constrainSize);l.zoomWrap.parent().css("width", l.constwidth);l.zoomWindow.css("height", l.options.constrainSize);l.zoomWindow.css("width", l.constwidth)
					}
					if (l.options.tint) {
						l.tintContainer.css("height", l.options.constrainSize);l.tintContainer.css("width", l.constwidth);l.zoomTint.css("height", l.options.constrainSize);l.zoomTint.css("width", l.constwidth);l.zoomTintImage.css("height", l.options.constrainSize);l.zoomTintImage.css("width", l.constwidth)
					}
				}
				if (l.options.constrainType == "width") {
					l.zoomContainer.css("height", "auto");l.zoomContainer.css("width", l.options.constrainSize);
					if (l.options.imageCrossfade) {
						l.zoomWrap.css("height", "auto");l.zoomWrap.css("width", l.options.constrainSize);
						l.constheight = l.zoomWrap.height()
					} else {
						l.jQueryelem.css("height", "auto");l.jQueryelem.css("width", l.options.constrainSize);
						l.constheight = l.jQueryelem.height()
					}
					if (l.options.zoomType == "inner") {
						l.zoomWrap.parent().css("height", l.constheight);l.zoomWrap.parent().css("width", l.options.constrainSize);l.zoomWindow.css("height", l.constheight);l.zoomWindow.css("width", l.options.constrainSize)
					}
					if (l.options.tint) {
						l.tintContainer.css("height", l.constheight);l.tintContainer.css("width", l.options.constrainSize);l.zoomTint.css("height", l.constheight);l.zoomTint.css("width", l.options.constrainSize);l.zoomTintImage.css("height", l.constheight);l.zoomTintImage.css("width", l.options.constrainSize)
					}
				}
			}
		},
		doneCallback : function() {
			var f = this;
			if (f.options.loadingIcon) {
				f.spinner.hide()
			}
			f.nzOffset = f.jQueryelem.offset();
			f.nzWidth = f.jQueryelem.width();
			f.nzHeight = f.jQueryelem.height();
			f.currentZoomLevel = f.options.zoomLevel;
			f.widthRatio = f.largeWidth / f.nzWidth;
			f.heightRatio = f.largeHeight / f.nzHeight;
			if (f.options.zoomType == "window") {
				if (f.nzHeight < f.options.zoomWindowWidth / f.widthRatio) {
					lensHeight = f.nzHeight
				} else {
					lensHeight = String((f.options.zoomWindowHeight / f.heightRatio))
				}
				if (f.options.zoomWindowWidth < f.options.zoomWindowWidth) {
					lensWidth = f.nzWidth
				} else {
					lensWidth = (f.options.zoomWindowWidth / f.widthRatio)
				}
				if (f.zoomLens) {
					f.zoomLens.css("width", lensWidth);f.zoomLens.css("height", lensHeight)
				}
			}
		},
		getCurrentImage : function() {
			var f = this;
			return f.zoomImage
		},
		getGalleryList : function() {
			var f = this;
			f.gallerylist = [];
			if (f.options.gallery) {
				c("#" + f.options.gallery + " a").each(function() {
					var g = "";
					if (c(this).data("zoom-image")) {
						g = c(this).data("zoom-image")
					} else {
						if (c(this).data("image")) {
							g = c(this).data("image")
						}
					}
					if (g == f.zoomImage) {
						f.gallerylist.unshift({
							href : "" + g + "",
							title : c(this).find("img").attr("title")
						})
					} else {
						f.gallerylist.push({
							href : "" + g + "",
							title : c(this).find("img").attr("title")
						})
					}
				})
			} else {
				f.gallerylist.push({
					href : "" + f.zoomImage + "",
					title : c(this).find("img").attr("title")
				})
			}
			return f.gallerylist
		},
		changeZoomLevel : function(g) {
			var f = this;
			f.scrollingLock = true;
			f.newvalue = parseFloat(g).toFixed(2);
			newvalue = parseFloat(g).toFixed(2);
			maxheightnewvalue = f.largeHeight / ((f.options.zoomWindowHeight / f.nzHeight) * f.nzHeight);
			maxwidthtnewvalue = f.largeWidth / ((f.options.zoomWindowWidth / f.nzWidth) * f.nzWidth);
			if (f.options.zoomType != "inner") {
				if (maxheightnewvalue <= newvalue) {
					f.heightRatio = (f.largeHeight / maxheightnewvalue) / f.nzHeight;
					f.newvalueheight = maxheightnewvalue;
					f.fullheight = true
				} else {
					f.heightRatio = (f.largeHeight / newvalue) / f.nzHeight;
					f.newvalueheight = newvalue;
					f.fullheight = false
				}
				if (maxwidthtnewvalue <= newvalue) {
					f.widthRatio = (f.largeWidth / maxwidthtnewvalue) / f.nzWidth;
					f.newvaluewidth = maxwidthtnewvalue;
					f.fullwidth = true
				} else {
					f.widthRatio = (f.largeWidth / newvalue) / f.nzWidth;
					f.newvaluewidth = newvalue;
					f.fullwidth = false
				}
				if (f.options.zoomType == "lens") {
					if (maxheightnewvalue <= newvalue) {
						f.fullwidth = true;
						f.newvaluewidth = maxheightnewvalue
					} else {
						f.widthRatio = (f.largeWidth / newvalue) / f.nzWidth;
						f.newvaluewidth = newvalue;
						f.fullwidth = false
					}
				}
			}
			if (f.options.zoomType == "inner") {
				maxheightnewvalue = parseFloat(f.largeHeight / f.nzHeight).toFixed(2);
				maxwidthtnewvalue = parseFloat(f.largeWidth / f.nzWidth).toFixed(2);
				if (newvalue > maxheightnewvalue) {
					newvalue = maxheightnewvalue
				}
				if (newvalue > maxwidthtnewvalue) {
					newvalue = maxwidthtnewvalue
				}
				if (maxheightnewvalue <= newvalue) {
					f.heightRatio = (f.largeHeight / newvalue) / f.nzHeight;
					if (newvalue > maxheightnewvalue) {
						f.newvalueheight = maxheightnewvalue
					} else {
						f.newvalueheight = newvalue
					}
					f.fullheight = true
				} else {
					f.heightRatio = (f.largeHeight / newvalue) / f.nzHeight;
					if (newvalue > maxheightnewvalue) {
						f.newvalueheight = maxheightnewvalue
					} else {
						f.newvalueheight = newvalue
					}
					f.fullheight = false
				}
				if (maxwidthtnewvalue <= newvalue) {
					f.widthRatio = (f.largeWidth / newvalue) / f.nzWidth;
					if (newvalue > maxwidthtnewvalue) {
						f.newvaluewidth = maxwidthtnewvalue
					} else {
						f.newvaluewidth = newvalue
					}
					f.fullwidth = true
				} else {
					f.widthRatio = (f.largeWidth / newvalue) / f.nzWidth;
					f.newvaluewidth = newvalue;
					f.fullwidth = false
				}
			}
			scrcontinue = false;
			if (f.options.zoomType == "inner") {
				if (f.nzWidth >= f.nzHeight) {
					if (f.newvaluewidth <= maxwidthtnewvalue) {
						scrcontinue = true
					} else {
						scrcontinue = false;
						f.fullheight = true;
						f.fullwidth = true
					}
				}
				if (f.nzHeight > f.nzWidth) {
					if (f.newvaluewidth <= maxwidthtnewvalue) {
						scrcontinue = true
					} else {
						scrcontinue = false;
						f.fullheight = true;
						f.fullwidth = true
					}
				}
			}
			if (f.options.zoomType != "inner") {
				scrcontinue = true
			}
			if (scrcontinue) {
				f.zoomLock = 0;
				f.changeZoom = true;
				if (((f.options.zoomWindowHeight) / f.heightRatio) <= f.nzHeight) {
					f.currentZoomLevel = f.newvalueheight;
					if (f.options.zoomType != "lens" && f.options.zoomType != "inner") {
						f.changeBgSize = true;f.zoomLens.css({
							height : String((f.options.zoomWindowHeight) / f.heightRatio) + "px"
						})
					}
					if (f.options.zoomType == "lens" || f.options.zoomType == "inner") {
						f.changeBgSize = true
					}
				}
				if ((f.options.zoomWindowWidth / f.widthRatio) <= f.nzWidth) {
					if (f.options.zoomType != "inner") {
						if (f.newvaluewidth > f.newvalueheight) {
							f.currentZoomLevel = f.newvaluewidth
						}
					}
					if (f.options.zoomType != "lens" && f.options.zoomType != "inner") {
						f.changeBgSize = true;f.zoomLens.css({
							width : String((f.options.zoomWindowWidth) / f.widthRatio) + "px"
						})
					}
					if (f.options.zoomType == "lens" || f.options.zoomType == "inner") {
						f.changeBgSize = true
					}
				}
				if (f.options.zoomType == "inner") {
					f.changeBgSize = true;
					if (f.nzWidth > f.nzHeight) {
						f.currentZoomLevel = f.newvaluewidth
					}
					if (f.nzHeight > f.nzWidth) {
						f.currentZoomLevel = f.newvaluewidth
					}
				}
			}
			f.setPosition(f.currentLoc)
		},
		closeAll : function() {
			if (self.zoomWindow) {
				self.zoomWindow.hide()
			}
			if (self.zoomLens) {
				self.zoomLens.hide()
			}
			if (self.zoomTint) {
				self.zoomTint.hide()
			}
		},
		changeState : function(g) {
			var f = this;
			if (g == "enable") {
				f.options.zoomEnabled = true
			}
			if (g == "disable") {
				f.options.zoomEnabled = false
			}
		}
	};
	c.fn.elevateZoom = function(f) {
		return this.each(function() {
			var g = Object.create(b);
			g.init(f, this);c.data(this, "elevateZoom", g)
		})
	};
	c.fn.elevateZoom.options = {
		zoomActivation : "hover",
		zoomEnabled : true,
		preloading : 1,
		zoomLevel : 1,
		scrollZoom : false,
		scrollZoomIncrement : 0.1,
		minZoomLevel : false,
		maxZoomLevel : false,
		easing : false,
		easingAmount : 12,
		lensSize : 200,
		zoomWindowWidth : 400,
		zoomWindowHeight : 400,
		zoomWindowOffetx : 0,
		zoomWindowOffety : 0,
		zoomWindowPosition : 1,
		zoomWindowBgColour : "#fff",
		lensFadeIn : false,
		lensFadeOut : false,
		debug : false,
		zoomWindowFadeIn : false,
		zoomWindowFadeOut : false,
		zoomWindowAlwaysShow : false,
		zoomTintFadeIn : false,
		zoomTintFadeOut : false,
		borderSize : 4,
		showLens : true,
		borderColour : "#888",
		lensBorderSize : 1,
		lensBorderColour : "#000",
		lensShape : "square",
		zoomType : "window",
		containLensZoom : false,
		lensColour : "white",
		lensOpacity : 0.4,
		lenszoom : false,
		tint : false,
		tintColour : "#333",
		tintOpacity : 0.4,
		gallery : false,
		galleryActiveClass : "zoomGalleryActive",
		imageCrossfade : false,
		constrainType : false,
		constrainSize : false,
		loadingIcon : false,
		cursor : "default",
		responsive : true,
		onComplete : c.noop,
		onZoomedImageLoaded : function() {},
		onImageSwap : c.noop,
		onImageSwapComplete : c.noop
	}
})(jQuery, window, document);
if (jQuery("#product-zoom").length > 0) {
	jQuery("#product-zoom").elevateZoom({
		zoomType : "inner",
		cursor : "crosshair",
		zoomWindowFadeIn : 500,
		zoomWindowFadeOut : 750,
		gallery : "gallery_01"
	})
}
jQuery("#gallery_01 .slider-items").owlCarousel({
	autoplay : false,
	items : 3,
	itemsDesktop : [ 1024, 3 ],
	itemsDesktopSmall : [ 900, 3 ],
	itemsTablet : [ 600, 3 ],
	itemsMobile : [ 320, 2 ],
	navigation : true,
	navigationText : [ '<a class="flex-prev"></a>', '<a class="flex-next"></a>' ],
	slideSpeed : 500,
	pagination : false
});
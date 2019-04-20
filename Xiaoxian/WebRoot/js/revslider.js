(function(h, a) {
	function c() {
		if (!b.READY) {
			b.event.determineEventTypes();
			for (var e in b.gestures) {
				b.gestures.hasOwnProperty(e) && b.detection.register(b.gestures[e])
			}
			b.event.onTouch(b.DOCUMENT, b.EVENT_MOVE, b.detection.detect), b.event.onTouch(b.DOCUMENT, b.EVENT_END, b.detection.detect), b.READY = !0
		}
	}
	var b = function(k, j) {
		return new b.Instance(k, j || {})
	};
	b.defaults = {
		stop_browser_behavior : {
			userSelect : "none",
			touchAction : "none",
			touchCallout : "none",
			contentZooming : "none",
			userDrag : "none",
			tapHighlightColor : "rgba(0,0,0,0)"
		}
	}, b.HAS_POINTEREVENTS = navigator.pointerEnabled || navigator.msPointerEnabled, b.HAS_TOUCHEVENTS = "ontouchstart" in h, b.MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i, b.NO_MOUSEEVENTS = b.HAS_TOUCHEVENTS && navigator.userAgent.match(b.MOBILE_REGEX), b.EVENT_TYPES = {}, b.DIRECTION_DOWN = "down", b.DIRECTION_LEFT = "left", b.DIRECTION_UP = "up", b.DIRECTION_RIGHT = "right", b.POINTER_MOUSE = "mouse", b.POINTER_TOUCH = "touch", b.POINTER_PEN = "pen", b.EVENT_START = "start", b.EVENT_MOVE = "move", b.EVENT_END = "end", b.DOCUMENT = document, b.plugins = {}, b.READY = !1, b.Instance = function(l, j) {
		var k = this;
		return c(), this.element = l, this.enabled = !0, this.options = b.utils.extend(b.utils.extend({}, b.defaults), j || {}), this.options.stop_browser_behavior && b.utils.stopDefaultBrowserBehavior(this.element, this.options.stop_browser_behavior), b.event.onTouch(l, b.EVENT_START, function(e) {
				k.enabled && b.detection.startDetect(k, e)
			}), this
	}, b.Instance.prototype = {
		on : function(m, j) {
			for (var l = m.split(" "), k = 0; l.length > k; k++) {
				this.element.addEventListener(l[k], j, !1)
			}
			return this
		},
		off : function(m, j) {
			for (var l = m.split(" "), k = 0; l.length > k; k++) {
				this.element.removeEventListener(l[k], j, !1)
			}
			return this
		},
		trigger : function(m, j) {
			var k = b.DOCUMENT.createEvent("Event");
			k.initEvent(m, !0, !0), k.gesture = j;
			var l = this.element;
			return b.utils.hasParent(j.target, l) && (l = j.target), l.dispatchEvent(k), this
		},
		enable : function(e) {
			return this.enabled = e, this
		}
	};
	var f = null,
		d = !1,
		g = !1;
	b.event = {
		bindDom : function(o, j, l) {
			for (var k = j.split(" "), m = 0; k.length > m; m++) {
				o.addEventListener(k[m], l, !1)
			}
		},
		onTouch : function(m, k, l) {
			var j = this;
			this.bindDom(m, b.EVENT_TYPES[k], function(e) {
				var o = e.type.toLowerCase();
				if (!o.match(/mouse/) || !g) {
					(o.match(/touch/) || o.match(/pointerdown/) || o.match(/mouse/) && 1 === e.which) && (d = !0), o.match(/touch|pointer/) && (g = !0);
					var n = 0;
					d && (b.HAS_POINTEREVENTS && k != b.EVENT_END ? n = b.PointerEvent.updatePointer(k, e) : o.match(/touch/) ? n = e.touches.length : g || (n = o.match(/up/) ? 0 : 1), n > 0 && k == b.EVENT_END ? k = b.EVENT_MOVE : n || (k = b.EVENT_END), n || null === f ? f = e : e = f, l.call(b.detection, j.collectEventData(m, k, e)), b.HAS_POINTEREVENTS && k == b.EVENT_END && (n = b.PointerEvent.updatePointer(k, e))), n || (f = null, d = !1, g = !1, b.PointerEvent.reset())
				}
			})
		},
		determineEventTypes : function() {
			var e;
			e = b.HAS_POINTEREVENTS ? b.PointerEvent.getEvents() : b.NO_MOUSEEVENTS ? [ "touchstart", "touchmove", "touchend touchcancel" ] : [ "touchstart mousedown", "touchmove mousemove", "touchend touchcancel mouseup" ], b.EVENT_TYPES[b.EVENT_START] = e[0], b.EVENT_TYPES[b.EVENT_MOVE] = e[1], b.EVENT_TYPES[b.EVENT_END] = e[2]
		},
		getTouchList : function(e) {
			return b.HAS_POINTEREVENTS ? b.PointerEvent.getTouchList() : e.touches ? e.touches : [ {
				identifier : 1,
				pageX : e.pageX,
				pageY : e.pageY,
				target : e.target
			} ]
		},
		collectEventData : function(p, j, k) {
			var m = this.getTouchList(k, j),
				l = b.POINTER_TOUCH;
			return (k.type.match(/mouse/) || b.PointerEvent.matchType(b.POINTER_MOUSE, k)) && (l = b.POINTER_MOUSE), {
				center : b.utils.getCenter(m),
				timeStamp : (new Date).getTime(),
				target : k.target,
				touches : m,
				eventType : j,
				pointerType : l,
				srcEvent : k,
				preventDefault : function() {
					this.srcEvent.preventManipulation && this.srcEvent.preventManipulation(), this.srcEvent.preventDefault && this.srcEvent.preventDefault()
				},
				stopPropagation : function() {
					this.srcEvent.stopPropagation()
				},
				stopDetect : function() {
					return b.detection.stopDetect()
				}
			}
		}
	}, b.PointerEvent = {
		pointers : {},
		getTouchList : function() {
			var k = this,
				j = [];
			return Object.keys(k.pointers).sort().forEach(function(e) {
					j.push(k.pointers[e])
				}), j
		},
		updatePointer : function(k, j) {
			return k == b.EVENT_END ? this.pointers = {} : (j.identifier = j.pointerId, this.pointers[j.pointerId] = j), Object.keys(this.pointers).length
		},
		matchType : function(l, j) {
			if (!j.pointerType) {
				return !1
			}
			var k = {};
			return k[b.POINTER_MOUSE] = j.pointerType == j.MSPOINTER_TYPE_MOUSE || j.pointerType == b.POINTER_MOUSE, k[b.POINTER_TOUCH] = j.pointerType == j.MSPOINTER_TYPE_TOUCH || j.pointerType == b.POINTER_TOUCH, k[b.POINTER_PEN] = j.pointerType == j.MSPOINTER_TYPE_PEN || j.pointerType == b.POINTER_PEN, k[l]
		},
		getEvents : function() {
			return [ "pointerdown MSPointerDown", "pointermove MSPointerMove", "pointerup pointercancel MSPointerUp MSPointerCancel" ]
		},
		reset : function() {
			this.pointers = {}
		}
	}, b.utils = {
		extend : function(l, j, e) {
			for (var k in j) {
				l[k] !== a && e || (l[k] = j[k])
			}
			return l
		},
		hasParent : function(k, j) {
			for (; k;) {
				if (k == j) {
					return !0
				}
				k = k.parentNode
			}
			return !1
		},
		getCenter : function(o) {
			for (var j = [], l = [], k = 0, m = o.length; m > k; k++) {
				j.push(o[k].pageX), l.push(o[k].pageY)
			}
			return {
				pageX : (Math.min.apply(Math, j) + Math.max.apply(Math, j)) / 2,
				pageY : (Math.min.apply(Math, l) + Math.max.apply(Math, l)) / 2
			}
		},
		getVelocity : function(l, j, k) {
			return {
				x : Math.abs(j / l) || 0,
				y : Math.abs(k / l) || 0
			}
		},
		getAngle : function(m, j) {
			var l = j.pageY - m.pageY,
				k = j.pageX - m.pageX;
			return 180 * Math.atan2(l, k) / Math.PI
		},
		getDirection : function(m, j) {
			var k = Math.abs(m.pageX - j.pageX),
				l = Math.abs(m.pageY - j.pageY);
			return k >= l ? m.pageX - j.pageX > 0 ? b.DIRECTION_LEFT : b.DIRECTION_RIGHT : m.pageY - j.pageY > 0 ? b.DIRECTION_UP : b.DIRECTION_DOWN
		},
		getDistance : function(m, j) {
			var l = j.pageX - m.pageX,
				k = j.pageY - m.pageY;
			return Math.sqrt(l * l + k * k)
		},
		getScale : function(k, j) {
			return k.length >= 2 && j.length >= 2 ? this.getDistance(j[0], j[1]) / this.getDistance(k[0], k[1]) : 1
		},
		getRotation : function(k, j) {
			return k.length >= 2 && j.length >= 2 ? this.getAngle(j[1], j[0]) - this.getAngle(k[1], k[0]) : 0
		},
		isVertical : function(e) {
			return e == b.DIRECTION_UP || e == b.DIRECTION_DOWN
		},
		stopDefaultBrowserBehavior : function(q, j) {
			var l,
				k = [ "webkit", "khtml", "moz", "ms", "o", "" ];
			if (j && q.style) {
				for (var p = 0; k.length > p; p++) {
					for (var m in j) {
						j.hasOwnProperty(m) && (l = m, k[p] && (l = k[p] + l.substring(0, 1).toUpperCase() + l.substring(1)), q.style[l] = j[m])
					}
				}
				"none" == j.userSelect && (q.onselectstart = function() {
					return !1
				})
			}
		}
	}, b.detection = {
		gestures : [],
		current : null,
		previous : null,
		stopped : !1,
		startDetect : function(k, j) {
			this.current || (this.stopped = !1, this.current = {
				inst : k,
				startEvent : b.utils.extend({}, j),
				lastEvent : !1,
				name : ""
			}, this.detect(j))
		},
		detect : function(p) {
			if (this.current && !this.stopped) {
				p = this.extendEventData(p);
				for (var j = this.current.inst.options, k = 0, m = this.gestures.length; m > k; k++) {
					var l = this.gestures[k];
					if (!this.stopped && j[l.name] !== !1 && l.handler.call(l, p, this.current.inst) === !1) {
						this.stopDetect();break
					}
				}
				return this.current && (this.current.lastEvent = p), p.eventType == b.EVENT_END && !p.touches.length - 1 && this.stopDetect(), p
			}
		},
		stopDetect : function() {
			this.previous = b.utils.extend({}, this.current), this.current = null, this.stopped = !0
		},
		extendEventData : function(v) {
			var l = this.current.startEvent;
			if (l && (v.touches.length != l.touches.length || v.touches === l.touches)) {
				l.touches = [];
				for (var m = 0, q = v.touches.length; q > m; m++) {
					l.touches.push(b.utils.extend({}, v.touches[m]))
				}
			}
			var p = v.timeStamp - l.timeStamp,
				u = v.center.pageX - l.center.pageX,
				j = v.center.pageY - l.center.pageY,
				k = b.utils.getVelocity(p, u, j);
			return b.utils.extend(v, {
					deltaTime : p,
					deltaX : u,
					deltaY : j,
					velocityX : k.x,
					velocityY : k.y,
					distance : b.utils.getDistance(l.center, v.center),
					angle : b.utils.getAngle(l.center, v.center),
					direction : b.utils.getDirection(l.center, v.center),
					scale : b.utils.getScale(l.touches, v.touches),
					rotation : b.utils.getRotation(l.touches, v.touches),
					startEvent : l
				}), v
		},
		register : function(j) {
			var e = j.defaults || {};
			return e[j.name] === a && (e[j.name] = !0), b.utils.extend(b.defaults, e, !0), j.index = j.index || 1000, this.gestures.push(j), this.gestures.sort(function(l, k) {
					return l.index < k.index ? -1 : l.index > k.index ? 1 : 0
				}), this.gestures
		}
	}, b.gestures = b.gestures || {}, b.gestures.Hold = {
		name : "hold",
		index : 10,
		defaults : {
			hold_timeout : 500,
			hold_threshold : 1
		},
		timer : null,
		handler : function(k, j) {
			switch (k.eventType) {
			case b.EVENT_START:
				clearTimeout(this.timer), b.detection.current.name = this.name, this.timer = setTimeout(function() {
					"hold" == b.detection.current.name && j.trigger("hold", k)
				}, j.options.hold_timeout);
				break;case b.EVENT_MOVE:
				k.distance > j.options.hold_threshold && clearTimeout(this.timer);
				break;case b.EVENT_END:
				clearTimeout(this.timer)
			}
		}
	}, b.gestures.Tap = {
		name : "tap",
		index : 100,
		defaults : {
			tap_max_touchtime : 250,
			tap_max_distance : 10,
			tap_always : !0,
			doubletap_distance : 20,
			doubletap_interval : 300
		},
		handler : function(m, j) {
			if (m.eventType == b.EVENT_END) {
				var k = b.detection.previous,
					l = !1;
				if (m.deltaTime > j.options.tap_max_touchtime || m.distance > j.options.tap_max_distance) {
					return
				}
				k && "tap" == k.name && m.timeStamp - k.lastEvent.timeStamp < j.options.doubletap_interval && m.distance < j.options.doubletap_distance && (j.trigger("doubletap", m), l = !0), (!l || j.options.tap_always) && (b.detection.current.name = "tap", j.trigger(b.detection.current.name, m))
			}
		}
	}, b.gestures.Swipe = {
		name : "swipe",
		index : 40,
		defaults : {
			swipe_max_touches : 1,
			swipe_velocity : 0.7
		},
		handler : function(k, j) {
			if (k.eventType == b.EVENT_END) {
				if (j.options.swipe_max_touches > 0 && k.touches.length > j.options.swipe_max_touches) {
					return
				}
				(k.velocityX > j.options.swipe_velocity || k.velocityY > j.options.swipe_velocity) && (j.trigger(this.name, k), j.trigger(this.name + k.direction, k))
			}
		}
	}, b.gestures.Drag = {
		name : "drag",
		index : 50,
		defaults : {
			drag_min_distance : 10,
			drag_max_touches : 1,
			drag_block_horizontal : !1,
			drag_block_vertical : !1,
			drag_lock_to_axis : !1,
			drag_lock_min_distance : 25
		},
		triggered : !1,
		handler : function(k, e) {
			if (b.detection.current.name != this.name && this.triggered) {
				return e.trigger(this.name + "end", k), this.triggered = !1, a
			}
			if (!(e.options.drag_max_touches > 0 && k.touches.length > e.options.drag_max_touches)) {
				switch (k.eventType) {
				case b.EVENT_START:
					this.triggered = !1;
					break;case b.EVENT_MOVE:
					if (k.distance < e.options.drag_min_distance && b.detection.current.name != this.name) {
						return
					}
					b.detection.current.name = this.name, (b.detection.current.lastEvent.drag_locked_to_axis || e.options.drag_lock_to_axis && e.options.drag_lock_min_distance <= k.distance) && (k.drag_locked_to_axis = !0);var j = b.detection.current.lastEvent.direction;
					k.drag_locked_to_axis && j !== k.direction && (k.direction = b.utils.isVertical(j) ? 0 > k.deltaY ? b.DIRECTION_UP : b.DIRECTION_DOWN : 0 > k.deltaX ? b.DIRECTION_LEFT : b.DIRECTION_RIGHT), this.triggered || (e.trigger(this.name + "start", k), this.triggered = !0), e.trigger(this.name, k), e.trigger(this.name + k.direction, k), (e.options.drag_block_vertical && b.utils.isVertical(k.direction) || e.options.drag_block_horizontal && !b.utils.isVertical(k.direction)) && k.preventDefault();
					break;case b.EVENT_END:
					this.triggered && e.trigger(this.name + "end", k), this.triggered = !1
				}
			}
		}
	}, b.gestures.Transform = {
		name : "transform",
		index : 45,
		defaults : {
			transform_min_scale : 0.01,
			transform_min_rotation : 1,
			transform_always_block : !1
		},
		triggered : !1,
		handler : function(l, e) {
			if (b.detection.current.name != this.name && this.triggered) {
				return e.trigger(this.name + "end", l), this.triggered = !1, a
			}
			if (!(2 > l.touches.length)) {
				switch (e.options.transform_always_block && l.preventDefault(), l.eventType) {
				case b.EVENT_START:
					this.triggered = !1;
					break;case b.EVENT_MOVE:
					var k = Math.abs(1 - l.scale),
						j = Math.abs(l.rotation);
					if (e.options.transform_min_scale > k && e.options.transform_min_rotation > j) {
						return
					}
					b.detection.current.name = this.name, this.triggered || (e.trigger(this.name + "start", l), this.triggered = !0), e.trigger(this.name, l), j > e.options.transform_min_rotation && e.trigger("rotate", l), k > e.options.transform_min_scale && (e.trigger("pinch", l), e.trigger("pinch" + (1 > l.scale ? "in" : "out"), l));
					break;case b.EVENT_END:
					this.triggered && e.trigger(this.name + "end", l), this.triggered = !1
				}
			}
		}
	}, b.gestures.Touch = {
		name : "touch",
		index : -1 / 0,
		defaults : {
			prevent_default : !1,
			prevent_mouseevents : !1
		},
		handler : function(j, e) {
			return e.options.prevent_mouseevents && j.pointerType == b.POINTER_MOUSE ? (j.stopDetect(), a) : (e.options.prevent_default && j.preventDefault(), j.eventType == b.EVENT_START && e.trigger(this.name, j), a)
		}
	}, b.gestures.Release = {
		name : "release",
		index : 1 / 0,
		handler : function(k, j) {
			k.eventType == b.EVENT_END && j.trigger(this.name, k)
		}
	}, "object" == typeof module && "object" == typeof module.exports ? module.exports = b : (h.Hammer = b, "function" == typeof h.define && h.define.amd && h.define("hammer", [], function() {
		return b
	}))
})(this), function(b, a) {
	b !== a && (Hammer.event.bindDom = function(d, c, e) {
		b(d).on(c, function(g) {
			var f = g.originalEvent || g;
			f.pageX === a && (f.pageX = g.pageX, f.pageY = g.pageY), f.target || (f.target = g.target), f.which === a && (f.which = f.button), f.preventDefault || (f.preventDefault = g.preventDefault), f.stopPropagation || (f.stopPropagation = g.stopPropagation), e.call(this, f)
		})
	}, Hammer.Instance.prototype.on = function(c, d) {
		return b(this.element).on(c, d)
	}, Hammer.Instance.prototype.off = function(c, d) {
		return b(this.element).off(c, d)
	}, Hammer.Instance.prototype.trigger = function(c, f) {
		var d = b(this.element);
		return d.has(f.target).length && (d = b(f.target)), d.trigger({
				type : c,
				gesture : f
			})
	}, b.fn.hammer = function(c) {
		return this.each(function() {
			var e = b(this),
				d = e.data("hammer");
			d ? d && c && Hammer.utils.extend(d.options, c) : e.data("hammer", new Hammer(this, c || {}))
		})
	})
}(window.jQuery || window.Zepto);(function(aD) {
	var ab = aD.GreenSockGlobals || aD;
	if (!ab.TweenLite) {
		var ai,
			aB,
			az,
			aq,
			J,
			at = function(d) {
				var a,
					c = d.split("."),
					b = ab;
				for (a = 0; c.length > a; a++) {
					b[c[a]] = b = b[c[a]] || {}
				}
				return b
			},
			am = at("com.greensock"),
			ah = 1e-10,
			H = [].slice,
			aF = function() {},
			ao = function() {
				var b = Object.prototype.toString,
					a = b.call([]);
				return function(c) {
					return null != c && (c instanceof Array || "object" == typeof c && !!c.push && b.call(c) === a)
				}
			}(),
			ad = {},
			av = function(c, f, e, d) {
				this.sc = ad[c] ? ad[c].sc : [], ad[c] = this, this.gsClass = null, this.func = e;
				var b = [];
				this.check = function(n) {
					for (var k, a, p, o, g = f.length, j = g; --g > -1;) {
						(k = ad[f[g]] || new av(f[g], [])).gsClass ? (b[g] = k.gsClass, j--) : n && k.sc.push(this)
					}
					if (0 === j && e) {
						for (a = ("com.greensock." + c).split("."), p = a.pop(), o = at(a.join("."))[p] = this.gsClass = e.apply(e, b), d && (ab[p] = o, "function" == typeof define && define.amd ? define((aD.GreenSockAMDPath ? aD.GreenSockAMDPath + "/" : "") + c.split(".").join("/"), [], function() {
								return o
							}) : "undefined" != typeof module && module.exports && (module.exports = o)), g = 0; this.sc.length > g; g++) {
							this.sc[g].check()
						}
					}
				}, this.check(!0)
			},
			X = aD._gsDefine = function(d, a, b, c) {
				return new av(d, a, b, c)
			},
			Z = am._class = function(c, a, b) {
				return a = a || function() {}, X(c, [], function() {
						return a
					}, b), a
			};
		X.globals = ab;
		var aH = [ 0, 0, 1, 1 ],
			af = [],
			aE = Z("easing.Ease", function(d, a, b, c) {
				this._func = d, this._type = b || 0, this._power = c || 0, this._params = a ? aH.concat(a) : aH
			}, !0),
			aI = aE.map = {},
			aw = aE.register = function(p, d, g, m) {
				for (var l, j, c, k, f = d.split(","), b = f.length, q = (g || "easeIn,easeOut,easeInOut").split(","); --b > -1;) {
					for (j = f[b], l = m ? Z("easing." + j, null, !0) : am.easing[j] || {}, c = q.length; --c > -1;) {
						k = q[c], aI[j + "." + k] = aI[k + j] = l[k] = p.getRatio ? p : p[k] || new p
					}
				}
			};
		for (az = aE.prototype, az._calcEnd = !1, az.getRatio = function(d) {
				if (this._func) {
					return this._params[0] = d, this._func.apply(null, this._params)
				}
				var a = this._type,
					b = this._power,
					c = 1 === a ? 1 - d : 2 === a ? d : 0.5 > d ? 2 * d : 2 * (1 - d);
				return 1 === b ? c *= c : 2 === b ? c *= c * c : 3 === b ? c *= c * c * c : 4 === b && (c *= c * c * c * c), 1 === a ? 1 - c : 2 === a ? c : 0.5 > d ? c / 2 : 1 - c / 2
			}, ai = [ "Linear", "Quad", "Cubic", "Quart", "Quint,Strong" ], aB = ai.length;--aB > -1;) {
			az = ai[aB] + ",Power" + aB, aw(new aE(null, null, 1, aB), az, "easeOut", !0), aw(new aE(null, null, 2, aB), az, "easeIn" + (0 === aB ? ",easeNone" : "")), aw(new aE(null, null, 3, aB), az, "easeInOut")
		}
		aI.linear = am.easing.Linear.easeIn, aI.swing = am.easing.Quad.easeInOut;
		var aK = Z("events.EventDispatcher", function(a) {
			this._listeners = {}, this._eventTarget = a || this
		});
		az = aK.prototype, az.addEventListener = function(m, b, d, k, j) {
			j = j || 0;
			var g,
				f,
				c = this._listeners[m],
				a = 0;
			for (null == c && (this._listeners[m] = c = []), f = c.length; --f > -1;) {
				g = c[f], g.c === b && g.s === d ? c.splice(f, 1) : 0 === a && j > g.pr && (a = f + 1)
			}
			c.splice(a, 0, {
				c : b,
				s : d,
				up : k,
				pr : j
			}), this !== aq || J || aq.wake()
		}, az.removeEventListener = function(d, a) {
			var b,
				c = this._listeners[d];
			if (c) {
				for (b = c.length; --b > -1;) {
					if (c[b].c === a) {
						return c.splice(b, 1), void 0
					}
				}
			}
		}, az.dispatchEvent = function(f) {
			var a,
				b,
				d,
				c = this._listeners[f];
			if (c) {
				for (a = c.length, b = this._eventTarget; --a > -1;) {
					d = c[a], d.up ? d.c.call(d.s || b, {
						type : f,
						target : b
					}) : d.c.call(d.s || b)
				}
			}
		};
		var V = aD.requestAnimationFrame,
			al = aD.cancelAnimationFrame,
			K = Date.now || function() {
				return (new Date).getTime()
			},
			aC = K();
		for (ai = [ "ms", "moz", "webkit", "o" ], aB = ai.length; --aB > -1 && !V;) {
			V = aD[ai[aB] + "RequestAnimationFrame"], al = aD[ai[aB] + "CancelAnimationFrame"] || aD[ai[aB] + "CancelRequestAnimationFrame"]
		}
		Z("Ticker", function(u, b) {
			var g,
				q,
				p,
				n,
				j,
				d = this,
				a = K(),
				k = b !== !1 && V,
				c = function(l) {
					aC = K(), d.time = (aC - a) / 1000;
					var f,
						h = d.time - j;
					(!g || h > 0 || l === !0) && (d.frame++, j += h + (h >= n ? 0.004 : n - h), f = !0), l !== !0 && (p = q(c)), f && d.dispatchEvent("tick")
				};
			aK.call(d), d.time = d.frame = 0, d.tick = function() {
				c(!0)
			}, d.sleep = function() {
				null != p && (k && al ? al(p) : clearTimeout(p), q = aF, p = null, d === aq && (J = !1))
			}, d.wake = function() {
				null !== p && d.sleep(), q = 0 === g ? aF : k && V ? V : function(e) {
					return setTimeout(e, 0 | 1000 * (j - d.time) + 1)
				}, d === aq && (J = !0), c(2)
			}, d.fps = function(e) {
				return arguments.length ? (g = e, n = 1 / (g || 60), j = this.time + n, d.wake(), void 0) : g
			}, d.useRAF = function(e) {
				return arguments.length ? (d.sleep(), k = e, d.fps(g), void 0) : k
			}, d.fps(u), setTimeout(function() {
				k && (!p || 5 > d.frame) && d.useRAF(!1)
			}, 1500)
		}), az = am.Ticker.prototype = new am.events.EventDispatcher, az.constructor = am.Ticker;
		var aJ = Z("core.Animation", function(c, a) {
			if (this.vars = a = a || {}, this._duration = this._totalDuration = c || 0, this._delay = Number(a.delay) || 0, this._timeScale = 1, this._active = a.immediateRender === !0, this.data = a.data, this._reversed = a.reversed === !0, ay) {
				J || aq.wake();
				var b = this.vars.useFrames ? ag : ay;
				b.add(this, b._time), this.vars.paused && this.paused(!0)
			}
		});
		aq = aJ.ticker = new am.Ticker, az = aJ.prototype, az._dirty = az._gc = az._initted = az._paused = !1, az._totalTime = az._time = 0, az._rawPrevTime = -1, az._next = az._last = az._onUpdate = az._timeline = az.timeline = null, az._paused = !1;
		var Y = function() {
			J && K() - aC > 2000 && aq.wake(), setTimeout(Y, 2000)
		};
		Y(), az.play = function(b, a) {
			return arguments.length && this.seek(b, a), this.reversed(!1).paused(!1)
		}, az.pause = function(b, a) {
			return arguments.length && this.seek(b, a), this.paused(!0)
		}, az.resume = function(b, a) {
			return arguments.length && this.seek(b, a), this.paused(!1)
		}, az.seek = function(b, a) {
			return this.totalTime(Number(b), a !== !1)
		}, az.restart = function(b, a) {
			return this.reversed(!1).paused(!1).totalTime(b ? -this._delay : 0, a !== !1, !0)
		}, az.reverse = function(b, a) {
			return arguments.length && this.seek(b || this.totalDuration(), a), this.reversed(!0).paused(!1)
		}, az.render = function() {}, az.invalidate = function() {
			return this
		}, az.isActive = function() {
			var c,
				a = this._timeline,
				b = this._startTime;
			return !a || !this._gc && !this._paused && a.isActive() && (c = a.rawTime()) >= b && b + this.totalDuration() / this._timeScale > c
		}, az._enabled = function(b, a) {
			return J || aq.wake(), this._gc = !b, this._active = this.isActive(), a !== !0 && (b && !this.timeline ? this._timeline.add(this, this._startTime - this._delay) : !b && this.timeline && this._timeline._remove(this, !0)), !1
		}, az._kill = function() {
			return this._enabled(!1, !1)
		}, az.kill = function(b, a) {
			return this._kill(b, a), this
		}, az._uncache = function(b) {
			for (var a = b ? this : this.timeline; a;) {
				a._dirty = !0, a = a.timeline
			}
			return this
		}, az._swapSelfInParams = function(c) {
			for (var a = c.length, b = c.concat(); --a > -1;) {
				"{self}" === c[a] && (b[a] = this)
			}
			return b
		}, az.eventCallback = function(f, a, b, d) {
			if ("on" === (f || "").substr(0, 2)) {
				var c = this.vars;
				if (1 === arguments.length) {
					return c[f]
				}
				null == a ?
					delete c[f]
					: (c[f] = a, c[f + "Params"] = ao(b) && -1 !== b.join("").indexOf("{self}") ? this._swapSelfInParams(b) : b, c[f + "Scope"] = d), "onUpdate" === f && (this._onUpdate = a)
			}
			return this
		}, az.delay = function(a) {
			return arguments.length ? (this._timeline.smoothChildTiming && this.startTime(this._startTime + a - this._delay), this._delay = a, this) : this._delay
		}, az.duration = function(a) {
			return arguments.length ? (this._duration = this._totalDuration = a, this._uncache(!0), this._timeline.smoothChildTiming && this._time > 0 && this._time < this._duration && 0 !== a && this.totalTime(this._totalTime * (a / this._duration), !0), this) : (this._dirty = !1, this._duration)
		}, az.totalDuration = function(a) {
			return this._dirty = !1, arguments.length ? this.duration(a) : this._totalDuration
		}, az.time = function(b, a) {
			return arguments.length ? (this._dirty && this.totalDuration(), this.totalTime(b > this._duration ? this._duration : b, a)) : this._time
		}, az.totalTime = function(f, a, b) {
			if (J || aq.wake(), !arguments.length) {
				return this._totalTime
			}
			if (this._timeline) {
				if (0 > f && !b && (f += this.totalDuration()), this._timeline.smoothChildTiming) {
					this._dirty && this.totalDuration();
					var d = this._totalDuration,
						c = this._timeline;
					if (f > d && !b && (f = d), this._startTime = (this._paused ? this._pauseTime : c._time) - (this._reversed ? d - f : f) / this._timeScale, c._dirty || this._uncache(!1), c._timeline) {
						for (; c._timeline;) {
							c._timeline._time !== (c._startTime + c._totalTime) / c._timeScale && c.totalTime(c._totalTime, !0), c = c._timeline
						}
					}
				}
				this._gc && this._enabled(!0, !1), (this._totalTime !== f || 0 === this._duration) && this.render(f, a, !1)
			}
			return this
		}, az.progress = az.totalProgress = function(b, a) {
			return arguments.length ? this.totalTime(this.duration() * b, a) : this._time / this.duration()
		}, az.startTime = function(a) {
			return arguments.length ? (a !== this._startTime && (this._startTime = a, this.timeline && this.timeline._sortChildren && this.timeline.add(this, a - this._delay)), this) : this._startTime
		}, az.timeScale = function(c) {
			if (!arguments.length) {
				return this._timeScale
			}
			if (c = c || ah, this._timeline && this._timeline.smoothChildTiming) {
				var a = this._pauseTime,
					b = a || 0 === a ? a : this._timeline.totalTime();
				this._startTime = b - (b - this._startTime) * this._timeScale / c
			}
			return this._timeScale = c, this._uncache(!1)
		}, az.reversed = function(a) {
			return arguments.length ? (a != this._reversed && (this._reversed = a, this.totalTime(this._timeline && !this._timeline.smoothChildTiming ? this.totalDuration() - this._totalTime : this._totalTime, !0)), this) : this._reversed
		}, az.paused = function(d) {
			if (!arguments.length) {
				return this._paused
			}
			if (d != this._paused && this._timeline) {
				J || d || aq.wake();
				var a = this._timeline,
					b = a.rawTime(),
					c = b - this._pauseTime;
				!d && a.smoothChildTiming && (this._startTime += c, this._uncache(!1)), this._pauseTime = d ? b : null, this._paused = d, this._active = this.isActive(), !d && 0 !== c && this._initted && this.duration() && this.render(a.smoothChildTiming ? this._totalTime : (b - this._startTime) / this._timeScale, !0, !0)
			}
			return this._gc && !d && this._enabled(!0, !1), this
		};
		var aA = Z("core.SimpleTimeline", function(a) {
			aJ.call(this, 0, a), this.autoRemoveChildren = this.smoothChildTiming = !0
		});
		az = aA.prototype = new aJ, az.constructor = aA, az.kill()._gc = !1, az._first = az._last = null, az._sortChildren = !1, az.add = az.insert = function(d, a) {
			var b,
				c;
			if (d._startTime = Number(a || 0) + d._delay, d._paused && this !== d._timeline && (d._pauseTime = d._startTime + (this.rawTime() - d._startTime) / d._timeScale), d.timeline && d.timeline._remove(d, !0), d.timeline = d._timeline = this, d._gc && d._enabled(!0, !0), b = this._last, this._sortChildren) {
				for (c = d._startTime; b && b._startTime > c;) {
					b = b._prev
				}
			}
			return b ? (d._next = b._next, b._next = d) : (d._next = this._first, this._first = d), d._next ? d._next._prev = d : this._last = d, d._prev = b, this._timeline && this._uncache(!0), this
		}, az._remove = function(b, a) {
			return b.timeline === this && (a || b._enabled(!1, !0), b.timeline = null, b._prev ? b._prev._next = b._next : this._first === b && (this._first = b._next), b._next ? b._next._prev = b._prev : this._last === b && (this._last = b._prev), this._timeline && this._uncache(!0)), this
		}, az.render = function(f, a, b) {
			var d,
				c = this._first;
			for (this._totalTime = this._time = this._rawPrevTime = f; c;) {
				d = c._next, (c._active || f >= c._startTime && !c._paused) && (c._reversed ? c.render((c._dirty ? c.totalDuration() : c._totalDuration) - (f - c._startTime) * c._timeScale, a, b) : c.render((f - c._startTime) * c._timeScale, a, b)), c = d
			}
		}, az.rawTime = function() {
			return J || aq.wake(), this._totalTime
		};
		var aa = Z("TweenLite", function(c, d, k) {
				if (aJ.call(this, d, k), this.render = aa.prototype.render, null == c) {
					throw "Cannot tween a null target."
				}
				this.target = c = "string" != typeof c ? c : aa.selector(c) || c;
				var j,
					g,
					b,
					h = c.jquery || c.length && c !== aD && c[0] && (c[0] === aD || c[0].nodeType && c[0].style && !c.nodeType),
					f = this.vars.overwrite;
				if (this._overwrite = f = null == f ? ak[aa.defaultOverwrite] : "number" == typeof f ? f >> 0 : ak[f], (h || c instanceof Array || c.push && ao(c)) && "number" != typeof c[0]) {
					for (this._targets = b = H.call(c, 0), this._propLookup = [], this._siblings = [], j = 0; b.length > j; j++) {
						g = b[j], g ? "string" != typeof g ? g.length && g !== aD && g[0] && (g[0] === aD || g[0].nodeType && g[0].style && !g.nodeType) ? (b.splice(j--, 1), this._targets = b = b.concat(H.call(g, 0))) : (this._siblings[j] = W(g, this, !1), 1 === f && this._siblings[j].length > 1 && ax(g, this, null, 1, this._siblings[j])) : (g = b[j--] = aa.selector(g), "string" == typeof g && b.splice(j + 1, 1)) : b.splice(j--, 1)
					}
				} else {
					this._propLookup = {}, this._siblings = W(c, this, !1), 1 === f && this._siblings.length > 1 && ax(c, this, null, 1, this._siblings)
				}
				(this.vars.immediateRender || 0 === d && 0 === this._delay && this.vars.immediateRender !== !1) && this.render(-this._delay, !1, !0)
			}, !0),
			ac = function(a) {
				return a.length && a !== aD && a[0] && (a[0] === aD || a[0].nodeType && a[0].style && !a.nodeType)
			},
			aj = function(d, a) {
				var b,
					c = {};
				for (b in d) {
					ae[b] || b in a && "x" !== b && "y" !== b && "width" !== b && "height" !== b && "className" !== b && "border" !== b || !(!ar[b] || ar[b] && ar[b]._autoCSS) || (c[b] = d[b],
					delete d[b]
					)
				}
				d.css = c
			};
		az = aa.prototype = new aJ, az.constructor = aa, az.kill()._gc = !1, az.ratio = 0, az._firstPT = az._targets = az._overwrittenProps = az._startAt = null, az._notifyPluginsOfEnabled = !1, aa.version = "1.11.5", aa.defaultEase = az._ease = new aE(null, null, 1, 1), aa.defaultOverwrite = "auto", aa.ticker = aq, aa.autoSleep = !0, aa.selector = aD.$ || aD.jQuery || function(a) {
			return aD.$ ? (aa.selector = aD.$, aD.$(a)) : aD.document ? aD.document.getElementById("#" === a.charAt(0) ? a.substr(1) : a) : a
		};
		var au = aa._internals = {
				isArray : ao,
				isSelector : ac
			},
			ar = aa._plugins = {},
			an = aa._tweenLookup = {},
			aG = 0,
			ae = au.reservedProps = {
				ease : 1,
				delay : 1,
				overwrite : 1,
				onComplete : 1,
				onCompleteParams : 1,
				onCompleteScope : 1,
				useFrames : 1,
				runBackwards : 1,
				startAt : 1,
				onUpdate : 1,
				onUpdateParams : 1,
				onUpdateScope : 1,
				onStart : 1,
				onStartParams : 1,
				onStartScope : 1,
				onReverseComplete : 1,
				onReverseCompleteParams : 1,
				onReverseCompleteScope : 1,
				onRepeat : 1,
				onRepeatParams : 1,
				onRepeatScope : 1,
				easeParams : 1,
				yoyo : 1,
				immediateRender : 1,
				repeat : 1,
				repeatDelay : 1,
				data : 1,
				paused : 1,
				reversed : 1,
				autoCSS : 1
			},
			ak = {
				none : 0,
				all : 1,
				auto : 2,
				concurrent : 3,
				allOnStart : 4,
				preexisting : 5,
				"true" : 1,
				"false" : 0
			},
			ag = aJ._rootFramesTimeline = new aA,
			ay = aJ._rootTimeline = new aA;
		ay._startTime = aq.time, ag._startTime = aq.frame, ay._active = ag._active = !0, aJ._updateRoot = function() {
			if (ay.render((aq.time - ay._startTime) * ay._timeScale, !1, !1), ag.render((aq.frame - ag._startTime) * ag._timeScale, !1, !1), !(aq.frame % 120)) {
				var c,
					a,
					b;
				for (b in an) {
					for (a = an[b].tweens, c = a.length; --c > -1;) {
						a[c]._gc && a.splice(c, 1)
					}
					0 === a.length &&
					delete an[b]
				}
				if (b = ay._first, (!b || b._paused) && aa.autoSleep && !ag._first && 1 === aq._listeners.tick.length) {
					for (; b && b._paused;) {
						b = b._next
					}
					b || aq.sleep()
				}
			}
		}, aq.addEventListener("tick", aJ._updateRoot);
		var W = function(g, a, b) {
				var f,
					d,
					c = g._gsTweenID;
				if (an[c || (g._gsTweenID = c = "t" + aG++)] || (an[c] = {
						target : g,
						tweens : []
					}), a && (f = an[c].tweens, f[d = f.length] = a, b)) {
					for (; --d > -1;) {
						f[d] === a && f.splice(d, 1)
					}
				}
				return an[c].tweens
			},
			ax = function(A, d, h, y, x) {
				var q,
					c,
					v,
					j;
				if (1 === y || y >= 4) {
					for (j = x.length, q = 0; j > q; q++) {
						if ((v = x[q]) !== d) {
							v._gc || v._enabled(!1, !1) && (c = !0)
						} else {
							if (5 === y) {
								break
							}
						}
					}
					return c
				}
				var b,
					B = d._startTime + ah,
					k = [],
					g = 0,
					w = 0 === d._duration;
				for (q = x.length; --q > -1;) {
					(v = x[q]) === d || v._gc || v._paused || (v._timeline !== d._timeline ? (b = b || z(d, 0, w), 0 === z(v, b, w) && (k[g++] = v)) : B >= v._startTime && v._startTime + v.totalDuration() / v._timeScale > B && ((w || !v._initted) && 2e-10 >= B - v._startTime || (k[g++] = v)))
				}
				for (q = g; --q > -1;) {
					v = k[q], 2 === y && v._kill(h, A) && (c = !0), (2 !== y || !v._firstPT && v._initted) && v._enabled(!1, !1) && (c = !0)
				}
				return c
			},
			z = function(g, a, b) {
				for (var f = g._timeline, d = f._timeScale, c = g._startTime; f._timeline;) {
					if (c += f._startTime, d *= f._timeScale, f._paused) {
						return -100
					}
					f = f._timeline
				}
				return c /= d, c > a ? c - a : b && c === a || !g._initted && 2 * ah > c - a ? ah : (c += g.totalDuration() / g._timeScale / d) > a + ah ? 0 : c - a - ah
			};
		az._init = function() {
			var m,
				c,
				d,
				k,
				j = this.vars,
				g = this._overwrittenProps,
				b = this._duration,
				h = j.immediateRender,
				f = j.ease;
			if (j.startAt) {
				if (this._startAt && this._startAt.render(-1, !0), j.startAt.overwrite = 0, j.startAt.immediateRender = !0, this._startAt = aa.to(this.target, 0, j.startAt), h) {
					if (this._time > 0) {
						this._startAt = null
					} else {
						if (0 !== b) {
							return
						}
					}
				}
			} else {
				if (j.runBackwards && 0 !== b) {
					if (this._startAt) {
						this._startAt.render(-1, !0), this._startAt = null
					} else {
						d = {};
						for (k in j) {
							ae[k] && "autoCSS" !== k || (d[k] = j[k])
						}
						if (d.overwrite = 0, d.data = "isFromStart", this._startAt = aa.to(this.target, 0, d), j.immediateRender) {
							if (0 === this._time) {
								return
							}
						} else {
							this._startAt.render(-1, !0)
						}
					}
				}
			}
			if (this._ease = f ? f instanceof aE ? j.easeParams instanceof Array ? f.config.apply(f, j.easeParams) : f : "function" == typeof f ? new aE(f, j.easeParams) : aI[f] || aa.defaultEase : aa.defaultEase, this._easeType = this._ease._type, this._easePower = this._ease._power, this._firstPT = null, this._targets) {
				for (m = this._targets.length; --m > -1;) {
					this._initProps(this._targets[m], this._propLookup[m] = {}, this._siblings[m], g ? g[m] : null) && (c = !0)
				}
			} else {
				c = this._initProps(this.target, this._propLookup, this._siblings, g)
			}
			if (c && aa._onPluginEvent("_onInitAllProps", this), g && (this._firstPT || "function" != typeof this.target && this._enabled(!1, !1)), j.runBackwards) {
				for (d = this._firstPT; d;) {
					d.s += d.c, d.c = -d.c, d = d._next
				}
			}
			this._onUpdate = j.onUpdate, this._initted = !0
		}, az._initProps = function(d, g, q, p) {
			var k,
				c,
				m,
				j,
				f,
				b;
			if (null == d) {
				return !1
			}
			this.vars.css || d.style && d !== aD && d.nodeType && ar.css && this.vars.autoCSS !== !1 && aj(this.vars, d);
			for (k in this.vars) {
				if (b = this.vars[k], ae[k]) {
					b && (b instanceof Array || b.push && ao(b)) && -1 !== b.join("").indexOf("{self}") && (this.vars[k] = b = this._swapSelfInParams(b, this))
				} else {
					if (ar[k] && (j = new ar[k])._onInitTween(d, this.vars[k], this)) {
						for (this._firstPT = f = {
								_next : this._firstPT,
								t : j,
								p : "setRatio",
								s : 0,
								c : 1,
								f : !0,
								n : k,
								pg : !0,
								pr : j._priority
							}, c = j._overwriteProps.length; --c > -1;) {
							g[j._overwriteProps[c]] = this._firstPT
						}
						(j._priority || j._onInitAllProps) && (m = !0), (j._onDisable || j._onEnable) && (this._notifyPluginsOfEnabled = !0)
					} else {
						this._firstPT = g[k] = f = {
							_next : this._firstPT,
							t : d,
							p : k,
							f : "function" == typeof d[k],
							n : k,
							pg : !1,
							pr : 0
						}, f.s = f.f ? d[k.indexOf("set") || "function" != typeof d["get" + k.substr(3)] ? k : "get" + k.substr(3)]() : parseFloat(d[k]), f.c = "string" == typeof b && "=" === b.charAt(1) ? parseInt(b.charAt(0) + "1", 10) * Number(b.substr(2)) : Number(b) - f.s || 0
					}
				}
				f && f._next && (f._next._prev = f)
			}
			return p && this._kill(p, d) ? this._initProps(d, g, q, p) : this._overwrite > 1 && this._firstPT && q.length > 1 && ax(d, this, g, this._overwrite, q) ? (this._kill(g, d), this._initProps(d, g, q, p)) : m
		}, az.render = function(v, d, f) {
			var q,
				p,
				j,
				c,
				k = this._time,
				g = this._duration;
			if (v >= g) {
				this._totalTime = this._time = g, this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1, this._reversed || (q = !0, p = "onComplete"), 0 === g && (c = this._rawPrevTime, (0 === v || 0 > c || c === ah) && c !== v && (f = !0, c > ah && (p = "onReverseComplete")), this._rawPrevTime = c = !d || v || 0 === c ? v : ah)
			} else {
				if (1e-07 > v) {
					this._totalTime = this._time = 0, this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0, (0 !== k || 0 === g && this._rawPrevTime > ah) && (p = "onReverseComplete", q = this._reversed), 0 > v ? (this._active = !1, 0 === g && (this._rawPrevTime >= 0 && (f = !0), this._rawPrevTime = c = !d || v || 0 === this._rawPrevTime ? v : ah)) : this._initted || (f = !0)
				} else {
					if (this._totalTime = this._time = v, this._easeType) {
						var b = v / g,
							w = this._easeType,
							h = this._easePower;
						(1 === w || 3 === w && b >= 0.5) && (b = 1 - b), 3 === w && (b *= 2), 1 === h ? b *= b : 2 === h ? b *= b * b : 3 === h ? b *= b * b * b : 4 === h && (b *= b * b * b * b), this.ratio = 1 === w ? 1 - b : 2 === w ? b : 0.5 > v / g ? b / 2 : 1 - b / 2
					} else {
						this.ratio = this._ease.getRatio(v / g)
					}
				}
			}
			if (this._time !== k || f) {
				if (!this._initted) {
					if (this._init(), !this._initted || this._gc) {
						return
					}
					this._time && !q ? this.ratio = this._ease.getRatio(this._time / g) : q && this._ease._calcEnd && (this.ratio = this._ease.getRatio(0 === this._time ? 0 : 1))
				}
				for (this._active || !this._paused && this._time !== k && v >= 0 && (this._active = !0), 0 === k && (this._startAt && (v >= 0 ? this._startAt.render(v, d, f) : p || (p = "_dummyGS")), this.vars.onStart && (0 !== this._time || 0 === g) && (d || this.vars.onStart.apply(this.vars.onStartScope || this, this.vars.onStartParams || af))), j = this._firstPT; j;) {
					j.f ? j.t[j.p](j.c * this.ratio + j.s) : j.t[j.p] = j.c * this.ratio + j.s, j = j._next
				}
				this._onUpdate && (0 > v && this._startAt && this._startTime && this._startAt.render(v, d, f), d || (this._time !== k || q) && this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || af)), p && (this._gc || (0 > v && this._startAt && !this._onUpdate && this._startTime && this._startAt.render(v, d, f), q && (this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), !d && this.vars[p] && this.vars[p].apply(this.vars[p + "Scope"] || this, this.vars[p + "Params"] || af), 0 === g && this._rawPrevTime === ah && c !== ah && (this._rawPrevTime = 0)))
			}
		}, az._kill = function(q, c) {
			if ("all" === q && (q = null), null == q && (null == c || c === this.target)) {
				return this._enabled(!1, !1)
			}
			c = "string" != typeof c ? c || this._targets || this.target : aa.selector(c) || c;
			var f,
				p,
				m,
				j,
				b,
				k,
				g,
				d;
			if ((ao(c) || ac(c)) && "number" != typeof c[0]) {
				for (f = c.length; --f > -1;) {
					this._kill(q, c[f]) && (k = !0)
				}
			} else {
				if (this._targets) {
					for (f = this._targets.length; --f > -1;) {
						if (c === this._targets[f]) {
							b = this._propLookup[f] || {}, this._overwrittenProps = this._overwrittenProps || [], p = this._overwrittenProps[f] = q ? this._overwrittenProps[f] || {} : "all";break
						}
					}
				} else {
					if (c !== this.target) {
						return !1
					}
					b = this._propLookup, p = this._overwrittenProps = q ? this._overwrittenProps || {} : "all"
				}
				if (b) {
					g = q || b, d = q !== p && "all" !== p && q !== b && ("object" != typeof q || !q._tempKill);
					for (m in g) {
						(j = b[m]) && (j.pg && j.t._kill(g) && (k = !0), j.pg && 0 !== j.t._overwriteProps.length || (j._prev ? j._prev._next = j._next : j === this._firstPT && (this._firstPT = j._next), j._next && (j._next._prev = j._prev), j._next = j._prev = null),
						delete b[m]
						), d && (p[m] = 1)
					}
					!this._firstPT && this._initted && this._enabled(!1, !1)
				}
			}
			return k
		}, az.invalidate = function() {
			return this._notifyPluginsOfEnabled && aa._onPluginEvent("_onDisable", this), this._firstPT = null, this._overwrittenProps = null, this._onUpdate = null, this._startAt = null, this._initted = this._active = this._notifyPluginsOfEnabled = !1, this._propLookup = this._targets ? {} : [], this
		}, az._enabled = function(d, a) {
			if (J || aq.wake(), d && this._gc) {
				var b,
					c = this._targets;
				if (c) {
					for (b = c.length; --b > -1;) {
						this._siblings[b] = W(c[b], this, !0)
					}
				} else {
					this._siblings = W(this.target, this, !0)
				}
			}
			return aJ.prototype._enabled.call(this, d, a), this._notifyPluginsOfEnabled && this._firstPT ? aa._onPluginEvent(d ? "_onEnable" : "_onDisable", this) : !1
		}, aa.to = function(c, a, b) {
			return new aa(c, a, b)
		}, aa.from = function(c, a, b) {
			return b.runBackwards = !0, b.immediateRender = 0 != b.immediateRender, new aa(c, a, b)
		}, aa.fromTo = function(d, a, b, c) {
			return c.startAt = b, c.immediateRender = 0 != c.immediateRender && 0 != b.immediateRender, new aa(d, a, c)
		}, aa.delayedCall = function(f, a, b, d, c) {
			return new aa(a, 0, {
				delay : f,
				onComplete : a,
				onCompleteParams : b,
				onCompleteScope : d,
				onReverseComplete : a,
				onReverseCompleteParams : b,
				onReverseCompleteScope : d,
				immediateRender : !1,
				useFrames : c,
				overwrite : 0
			})
		}, aa.set = function(b, a) {
			return new aa(b, 0, a)
		}, aa.getTweensOf = function(g, a) {
			if (null == g) {
				return []
			}
			g = "string" != typeof g ? g : aa.selector(g) || g;
			var b,
				f,
				d,
				c;
			if ((ao(g) || ac(g)) && "number" != typeof g[0]) {
				for (b = g.length, f = []; --b > -1;) {
					f = f.concat(aa.getTweensOf(g[b], a))
				}
				for (b = f.length; --b > -1;) {
					for (c = f[b], d = b; --d > -1;) {
						c === f[d] && f.splice(b, 1)
					}
				}
			} else {
				for (f = W(g).concat(), b = f.length; --b > -1;) {
					(f[b]._gc || a && !f[b].isActive()) && f.splice(b, 1)
				}
			}
			return f
		}, aa.killTweensOf = aa.killDelayedCallsTo = function(f, a, b) {
			"object" == typeof a && (b = a, a = !1);
			for (var d = aa.getTweensOf(f, a), c = d.length; --c > -1;) {
				d[c]._kill(b, f)
			}
		};
		var ap = Z("plugins.TweenPlugin", function(b, a) {
			this._overwriteProps = (b || "").split(","), this._propName = this._overwriteProps[0], this._priority = a || 0, this._super = ap.prototype
		}, !0);
		if (az = ap.prototype, ap.version = "1.10.1", ap.API = 2, az._firstPT = null, az._addTween = function(k, c, d, j, h, f) {
				var b,
					g;
				return null != j && (b = "number" == typeof j || "=" !== j.charAt(1) ? Number(j) - d : parseInt(j.charAt(0) + "1", 10) * Number(j.substr(2))) ? (this._firstPT = g = {
					_next : this._firstPT,
					t : k,
					p : c,
					s : d,
					c : b,
					f : "function" == typeof k[c],
					n : h || c,
					r : f
				}, g._next && (g._next._prev = g), g) : void 0
			}, az.setRatio = function(d) {
				for (var a, b = this._firstPT, c = 1e-06; b;) {
					a = b.c * d + b.s, b.r ? a = 0 | a + (a > 0 ? 0.5 : -0.5) : c > a && a > -c && (a = 0), b.f ? b.t[b.p](a) : b.t[b.p] = a, b = b._next
				}
			}, az._kill = function(d) {
				var a,
					b = this._overwriteProps,
					c = this._firstPT;
				if (null != d[this._propName]) {
					this._overwriteProps = []
				} else {
					for (a = b.length; --a > -1;) {
						null != d[b[a]] && b.splice(a, 1)
					}
				}
				for (; c;) {
					null != d[c.n] && (c._next && (c._next._prev = c._prev), c._prev ? (c._prev._next = c._next, c._prev = null) : this._firstPT === c && (this._firstPT = c._next)), c = c._next
				}
				return !1
			}, az._roundProps = function(c, a) {
				for (var b = this._firstPT; b;) {
					(c[this._propName] || null != b.n && c[b.n.split(this._propName + "_").join("")]) && (b.r = a), b = b._next
				}
			}, aa._onPluginEvent = function(k, c) {
				var d,
					j,
					h,
					f,
					b,
					g = c._firstPT;
				if ("_onInitAllProps" === k) {
					for (; g;) {
						for (b = g._next, j = h; j && j.pr > g.pr;) {
							j = j._next
						}
						(g._prev = j ? j._prev : f) ? g._prev._next = g : h = g, (g._next = j) ? j._prev = g : f = g, g = b
					}
					g = c._firstPT = h
				}
				for (; g;) {
					g.pg && "function" == typeof g.t[k] && g.t[k]() && (d = !0), g = g._next
				}
				return d
			}, ap.activate = function(b) {
				for (var a = b.length; --a > -1;) {
					b[a].API === ap.API && (ar[(new b[a])._propName] = b[a])
				}
				return !0
			}, X.plugin = function(k) {
				if (!(k && k.propName && k.init && k.API)) {
					throw "illegal plugin definition."
				}
				var c,
					d = k.propName,
					j = k.priority || 0,
					h = k.overwriteProps,
					f = {
						init : "_onInitTween",
						set : "setRatio",
						kill : "_kill",
						round : "_roundProps",
						initAll : "_onInitAllProps"
					},
					b = Z("plugins." + d.charAt(0).toUpperCase() + d.substr(1) + "Plugin", function() {
						ap.call(this, d, j), this._overwriteProps = h || []
					}, k.global === !0),
					g = b.prototype = new ap(d);
				g.constructor = b, b.API = k.API;
				for (c in f) {
					"function" == typeof k[c] && (g[f[c]] = k[c])
				}
				return b.version = k.version, ap.activate([ b ]), b
			}, ai = aD._gsQueue) {
			for (aB = 0; ai.length > aB; aB++) {
				ai[aB]()
			}
			for (az in ad) {
				ad[az].func || aD.console.log("GSAP encountered missing dependency: com.greensock." + az)
			}
		}
		J = !1
	}
})(window);(window._gsQueue || (window._gsQueue = [])).push(function() {
	window._gsDefine("TimelineLite", [ "core.Animation", "core.SimpleTimeline", "TweenLite" ], function(v, d, g) {
		var q = function(l) {
				d.call(this, l), this._labels = {}, this.autoRemoveChildren = this.vars.autoRemoveChildren === !0, this.smoothChildTiming = this.vars.smoothChildTiming === !0, this._sortChildren = !0, this._onUpdate = this.vars.onUpdate;
				var a,
					h,
					e = this.vars;
				for (h in e) {
					a = e[h], c(a) && -1 !== a.join("").indexOf("{self}") && (e[h] = this._swapSelfInParams(a))
				}
				c(e.tweens) && this.add(e.tweens, 0, e.align, e.stagger)
			},
			p = 1e-10,
			k = g._internals.isSelector,
			c = g._internals.isArray,
			m = [],
			f = function(l) {
				var a,
					h = {};
				for (a in l) {
					h[a] = l[a]
				}
				return h
			},
			j = function(n, a, h, l) {
				n._timeline.pause(n._startTime), a && a.apply(l || n._timeline, h || m)
			},
			b = m.slice,
			w = q.prototype = new d;
		return q.version = "1.11.5", w.constructor = q, w.kill()._gc = !1, w.to = function(n, a, l, h) {
				return a ? this.add(new g(n, a, l), h) : this.set(n, l, h)
			}, w.from = function(n, a, l, h) {
				return this.add(g.from(n, a, l), h)
			}, w.fromTo = function(u, a, o, l, h) {
				return a ? this.add(g.fromTo(u, a, o, l), h) : this.set(u, l, h)
			}, w.staggerTo = function(C, s, B, h, z, y, D, A) {
				var x,
					n = new q({
						onComplete : y,
						onCompleteParams : D,
						onCompleteScope : A,
						smoothChildTiming : this.smoothChildTiming
					});
				for ("string" == typeof C && (C = g.selector(C) || C), k(C) && (C = b.call(C, 0)), h = h || 0, x = 0; C.length > x; x++) {
					B.startAt && (B.startAt = f(B.startAt)), n.to(C[x], s, f(B), x * h)
				}
				return this.add(n, z)
			}, w.staggerFrom = function(B, l, u, A, z, x, h, y) {
				return u.immediateRender = 0 != u.immediateRender, u.runBackwards = !0, this.staggerTo(B, l, u, A, z, x, h, y)
			}, w.staggerFromTo = function(D, u, y, C, B, z, l, A, x) {
				return C.startAt = y, C.immediateRender = 0 != C.immediateRender && 0 != y.immediateRender, this.staggerTo(D, u, C, B, z, l, A, x)
			}, w.call = function(n, a, l, h) {
				return this.add(g.delayedCall(0, n, a, l), h)
			}, w.set = function(l, a, h) {
				return h = this._parseTimeOrLabel(h, 0, !0), null == a.immediateRender && (a.immediateRender = h === this._time && !this._paused), this.add(new g(l, 0, a), h)
			}, q.exportRoot = function(y, l) {
				y = y || {}, null == y.smoothChildTiming && (y.smoothChildTiming = !0);
				var x,
					s,
					h = new q(y),
					u = h._timeline;
				for (null == l && (l = !0), u._remove(h, !0), h._startTime = 0, h._rawPrevTime = h._time = h._totalTime = u._time, x = u._first; x;) {
					s = x._next, l && x instanceof g && x.target === x.vars.onComplete || h.add(x, x._startTime - x._delay), x = s
				}
				return u.add(h, 0), h
			}, w.add = function(B, y, z, t) {
				var x,
					a,
					C,
					A,
					s,
					e;
				if ("number" != typeof y && (y = this._parseTimeOrLabel(y, 0, !0, B)), !(B instanceof v)) {
					if (B instanceof Array || B && B.push && c(B)) {
						for (z = z || "normal", t = t || 0, x = y, a = B.length, C = 0; a > C; C++) {
							c(A = B[C]) && (A = new q({
								tweens : A
							})), this.add(A, x), "string" != typeof A && "function" != typeof A && ("sequence" === z ? x = A._startTime + A.totalDuration() / A._timeScale : "start" === z && (A._startTime -= A.delay())), x += t
						}
						return this._uncache(!0)
					}
					if ("string" == typeof B) {
						return this.addLabel(B, y)
					}
					if ("function" != typeof B) {
						throw "Cannot add " + B + " into the timeline; it is not a tween, timeline, function, or string."
					}
					B = g.delayedCall(0, B)
				}
				if (d.prototype.add.call(this, B, y), (this._gc || this._time === this._duration) && !this._paused && this._duration < this.duration()) {
					for (s = this, e = s.rawTime() > B._startTime; s._timeline;) {
						e && s._timeline.smoothChildTiming ? s.totalTime(s._totalTime, !0) : s._gc && s._enabled(!0, !1), s = s._timeline
					}
				}
				return this
			}, w.remove = function(a) {
				if (a instanceof v) {
					return this._remove(a, !1)
				}
				if (a instanceof Array || a && a.push && c(a)) {
					for (var h = a.length; --h > -1;) {
						this.remove(a[h])
					}
					return this
				}
				return "string" == typeof a ? this.removeLabel(a) : this.kill(null, a)
			}, w._remove = function(h, a) {
				d.prototype._remove.call(this, h, a);
				var e = this._last;
				return e ? this._time > e._startTime + e._totalDuration / e._timeScale && (this._time = this.duration(), this._totalTime = this._totalDuration) : this._time = this._totalTime = this._duration = this._totalDuration = 0, this
			}, w.append = function(h, a) {
				return this.add(h, this._parseTimeOrLabel(null, a, !0, h))
			}, w.insert = w.insertMultiple = function(n, a, h, l) {
				return this.add(n, a || 0, h, l)
			}, w.appendMultiple = function(n, a, h, l) {
				return this.add(n, this._parseTimeOrLabel(null, a, !0, n), h, l)
			}, w.addLabel = function(h, a) {
				return this._labels[h] = this._parseTimeOrLabel(a), this
			}, w.addPause = function(n, a, h, l) {
				return this.call(j, [ "{self}", a, h, l ], this, n)
			}, w.removeLabel = function(a) {
				return delete this._labels[a]
					, this
			}, w.getLabelTime = function(a) {
				return null != this._labels[a] ? this._labels[a] : -1
			}, w._parseTimeOrLabel = function(a, h, t, o) {
				var l;
				if (o instanceof v && o.timeline === this) {
					this.remove(o)
				} else {
					if (o && (o instanceof Array || o.push && c(o))) {
						for (l = o.length; --l > -1;) {
							o[l] instanceof v && o[l].timeline === this && this.remove(o[l])
						}
					}
				}
				if ("string" == typeof h) {
					return this._parseTimeOrLabel(h, t && "number" == typeof a && null == this._labels[h] ? a - this.duration() : 0, t)
				}
				if (h = h || 0, "string" != typeof a || !isNaN(a) && null == this._labels[a]) {
					null == a && (a = this.duration())
				} else {
					if (l = a.indexOf("="), -1 === l) {
						return null == this._labels[a] ? t ? this._labels[a] = this.duration() + h : h : this._labels[a] + h
					}
					h = parseInt(a.charAt(l - 1) + "1", 10) * Number(a.substr(l + 1)), a = l > 1 ? this._parseTimeOrLabel(a.substr(0, l - 1), 0, t) : this.duration()
				}
				return Number(a) + h
			}, w.seek = function(h, a) {
				return this.totalTime("number" == typeof h ? h : this._parseTimeOrLabel(h), a !== !1)
			}, w.stop = function() {
				return this.paused(!0)
			}, w.gotoAndPlay = function(h, a) {
				return this.play(h, a)
			}, w.gotoAndStop = function(h, a) {
				return this.pause(h, a)
			}, w.render = function(G, y, B) {
				this._gc && this._enabled(!0, !1);
				var F,
					D,
					r,
					A,
					C,
					o = this._dirty ? this.totalDuration() : this._totalDuration,
					H = this._time,
					E = this._startTime,
					z = this._timeScale,
					x = this._paused;
				if (G >= o ? (this._totalTime = this._time = o, this._reversed || this._hasPausedChild() || (D = !0, A = "onComplete", 0 === this._duration && (0 === G || 0 > this._rawPrevTime || this._rawPrevTime === p) && this._rawPrevTime !== G && this._first && (C = !0, this._rawPrevTime > p && (A = "onReverseComplete"))), this._rawPrevTime = this._duration || !y || G || 0 === this._rawPrevTime ? G : p, G = o + 0.0001) : 1e-07 > G ? (this._totalTime = this._time = 0, (0 !== H || 0 === this._duration && (this._rawPrevTime > p || 0 > G && this._rawPrevTime >= 0)) && (A = "onReverseComplete", D = this._reversed), 0 > G ? (this._active = !1, 0 === this._duration && this._rawPrevTime >= 0 && this._first && (C = !0), this._rawPrevTime = G) : (this._rawPrevTime = this._duration || !y || G || 0 === this._rawPrevTime ? G : p, G = 0, this._initted || (C = !0))) : this._totalTime = this._time = this._rawPrevTime = G, this._time !== H && this._first || B || C) {
					if (this._initted || (this._initted = !0), this._active || !this._paused && this._time !== H && G > 0 && (this._active = !0), 0 === H && this.vars.onStart && 0 !== this._time && (y || this.vars.onStart.apply(this.vars.onStartScope || this, this.vars.onStartParams || m)), this._time >= H) {
						for (F = this._first; F && (r = F._next, !this._paused || x);) {
							(F._active || F._startTime <= this._time && !F._paused && !F._gc) && (F._reversed ? F.render((F._dirty ? F.totalDuration() : F._totalDuration) - (G - F._startTime) * F._timeScale, y, B) : F.render((G - F._startTime) * F._timeScale, y, B)), F = r
						}
					} else {
						for (F = this._last; F && (r = F._prev, !this._paused || x);) {
							(F._active || H >= F._startTime && !F._paused && !F._gc) && (F._reversed ? F.render((F._dirty ? F.totalDuration() : F._totalDuration) - (G - F._startTime) * F._timeScale, y, B) : F.render((G - F._startTime) * F._timeScale, y, B)), F = r
						}
					}
					this._onUpdate && (y || this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || m)), A && (this._gc || (E === this._startTime || z !== this._timeScale) && (0 === this._time || o >= this.totalDuration()) && (D && (this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), !y && this.vars[A] && this.vars[A].apply(this.vars[A + "Scope"] || this, this.vars[A + "Params"] || m)))
				}
			}, w._hasPausedChild = function() {
				for (var a = this._first; a;) {
					if (a._paused || a instanceof q && a._hasPausedChild()) {
						return !0
					}
					a = a._next
				}
				return !1
			}, w.getChildren = function(A, l, z, y) {
				y = y || -9999999999;
				for (var u = [], h = this._first, x = 0; h;) {
					y > h._startTime || (h instanceof g ? l !== !1 && (u[x++] = h) : (z !== !1 && (u[x++] = h), A !== !1 && (u = u.concat(h.getChildren(!0, l, z)), x = u.length))), h = h._next
				}
				return u
			}, w.getTweensOf = function(y, l) {
				for (var x = g.getTweensOf(y), u = x.length, o = [], h = 0; --u > -1;) {
					(x[u].timeline === this || l && this._contains(x[u])) && (o[h++] = x[u])
				}
				return o
			}, w._contains = function(h) {
				for (var a = h.timeline; a;) {
					if (a === this) {
						return !0
					}
					a = a.timeline
				}
				return !1
			}, w.shiftChildren = function(x, a, h) {
				h = h || 0;
				for (var u, o = this._first, l = this._labels; o;) {
					o._startTime >= h && (o._startTime += x), o = o._next
				}
				if (a) {
					for (u in l) {
						l[u] >= h && (l[u] += x)
					}
				}
				return this._uncache(!0)
			}, w._kill = function(o, a) {
				if (!o && !a) {
					return this._enabled(!1, !1)
				}
				for (var h = a ? this.getTweensOf(a) : this.getChildren(!0, !0, !1), n = h.length, l = !1; --n > -1;) {
					h[n]._kill(o, a) && (l = !0)
				}
				return l
			}, w.clear = function(l) {
				var a = this.getChildren(!1, !0, !0),
					h = a.length;
				for (this._time = this._totalTime = 0; --h > -1;) {
					a[h]._enabled(!1, !1)
				}
				return l !== !1 && (this._labels = {}), this._uncache(!0)
			}, w.invalidate = function() {
				for (var a = this._first; a;) {
					a.invalidate(), a = a._next
				}
				return this
			}, w._enabled = function(h, a) {
				if (h === this._gc) {
					for (var e = this._first; e;) {
						e._enabled(h, !0), e = e._next
					}
				}
				return d.prototype._enabled.call(this, h, a)
			}, w.duration = function(a) {
				return arguments.length ? (0 !== this.duration() && 0 !== a && this.timeScale(this._duration / a), this) : (this._dirty && this.totalDuration(), this._duration)
			}, w.totalDuration = function(x) {
				if (!arguments.length) {
					if (this._dirty) {
						for (var a, h, u = 0, o = this._last, l = 999999999999; o;) {
							a = o._prev, o._dirty && o.totalDuration(), o._startTime > l && this._sortChildren && !o._paused ? this.add(o, o._startTime - o._delay) : l = o._startTime, 0 > o._startTime && !o._paused && (u -= o._startTime, this._timeline.smoothChildTiming && (this._startTime += o._startTime / this._timeScale), this.shiftChildren(-o._startTime, !1, -9999999999), l = 0), h = o._startTime + o._totalDuration / o._timeScale, h > u && (u = h), o = a
						}
						this._duration = this._totalDuration = u, this._dirty = !1
					}
					return this._totalDuration
				}
				return 0 !== this.totalDuration() && 0 !== x && this.timeScale(this._totalDuration / x), this
			}, w.usesFrames = function() {
				for (var a = this._timeline; a._timeline;) {
					a = a._timeline
				}
				return a === v._rootFramesTimeline
			}, w.rawTime = function() {
				return this._paused ? this._totalTime : (this._timeline.rawTime() - this._startTime) * this._timeScale
			}, q
	}, !0)
}), window._gsDefine && window._gsQueue.pop()();(window._gsQueue || (window._gsQueue = [])).push(function() {
	window._gsDefine("plugins.CSSPlugin", [ "plugins.TweenPlugin", "TweenLite" ], function(bg, au) {
		var aG,
			a7,
			bb,
			aU,
			ad = function() {
				bg.call(this, "css"), this._overwriteProps.length = 0, this.setRatio = ad.prototype.setRatio
			},
			aX = {},
			aO = ad.prototype = new bg("css");
		aO.constructor = ad, ad.version = "1.11.5", ad.API = 2, ad.defaultTransformPerspective = 0, aO = "px", ad.suffixMap = {
			top : aO,
			right : aO,
			bottom : aO,
			left : aO,
			width : aO,
			height : aO,
			fontSize : aO,
			padding : aO,
			margin : aO,
			perspective : aO,
			lineHeight : ""
		};
		var aD,
			bk,
			ab,
			a1,
			ax,
			al,
			ap = /(?:\d|\-\d|\.\d|\-\.\d)+/g,
			aR = /(?:\d|\-\d|\.\d|\-\.\d|\+=\d|\-=\d|\+=.\d|\-=\.\d)+/g,
			aA = /(?:\+=|\-=|\-|\b)[\d\-\.]+[a-zA-Z0-9]*(?:%|\b)/gi,
			bn = /[^\d\-\.]/g,
			bw = /(?:\d|\-|\+|=|#|\.)*/g,
			bh = /opacity *= *([^)]*)/,
			bt = /opacity:([^;]*)/,
			bq = /alpha\(opacity *=.+?\)/i,
			ai = /^(rgb|hsl)/,
			a2 = /([A-Z])/g,
			bc = /-([a-z])/gi,
			a8 = /(^(?:url\(\"|url\())|(?:(\"\))$|\)$)/gi,
			aL = function(b, a) {
				return a.toUpperCase()
			},
			am = /(?:Left|Right|Width)/i,
			af = /(M11|M12|M21|M22)=[\d\-\.e]+/gi,
			aY = /progid\:DXImageTransform\.Microsoft\.Matrix\(.+?\)/i,
			aq = /,(?=[^\)]*(?:\(|$))/gi,
			aS = Math.PI / 180,
			aP = 180 / Math.PI,
			aV = {},
			bu = document,
			aH = bu.createElement("div"),
			av = bu.createElement("img"),
			ay = ad._internals = {
				_specialProps : aX
			},
			bx = navigator.userAgent,
			bz = function() {
				var c,
					a = bx.indexOf("Android"),
					b = bu.createElement("div");
				return ab = -1 !== bx.indexOf("Safari") && -1 === bx.indexOf("Chrome") && (-1 === a || Number(bx.substr(a + 8, 1)) > 3), ax = ab && 6 > Number(bx.substr(bx.indexOf("Version/") + 8, 1)), a1 = -1 !== bx.indexOf("Firefox"), /MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(bx) && (al = parseFloat(RegExp.$1)), b.innerHTML = "<a style='top:1px;opacity:.55;'>a</a>", c = b.getElementsByTagName("a")[0], c ? /^0.55/.test(c.style.opacity) : !1
			}(),
			bl = function(a) {
				return bh.test("string" == typeof a ? a : (a.currentStyle ? a.currentStyle.filter : a.style.filter) || "") ? parseFloat(RegExp.$1) / 100 : 1
			},
			aj = function(a) {},
			aJ = "",
			br = "",
			bo = function(f, a) {
				a = a || aH;
				var b,
					c,
					d = a.style;
				if (void 0 !== d[f]) {
					return f
				}
				for (f = f.charAt(0).toUpperCase() + f.substr(1), b = [ "O", "Moz", "ms", "Ms", "Webkit" ], c = 5; --c > -1 && void 0 === d[b[c] + f];) {
				}
				return c >= 0 ? (br = 3 === c ? "ms" : b[c], aJ = "-" + br.toLowerCase() + "-", br + f) : null
			},
			a5 = bu.defaultView ? bu.defaultView.getComputedStyle : function() {},
			aE = ad.getStyle = function(g, a, b, d, f) {
				var c;
				return bz || "opacity" !== a ? (!d && g.style[a] ? c = g.style[a] : (b = b || a5(g, null)) ? (g = b.getPropertyValue(a.replace(a2, "-$1").toLowerCase()), c = g || b.length ? g : b[a]) : g.currentStyle && (c = g.currentStyle[a]), null == f || c && "none" !== c && "auto" !== c && "auto auto" !== c ? c : f) : bl(g)
			},
			a6 = function(q, c, f, m, p) {
				if ("px" === m || !m) {
					return f
				}
				if ("auto" === m || !f) {
					return 0
				}
				var j,
					b = am.test(c),
					k = q,
					g = aH.style,
					d = 0 > f;
				return d && (f = -f), "%" === m && -1 !== c.indexOf("border") ? j = f / 100 * (b ? q.clientWidth : q.clientHeight) : (g.cssText = "border:0 solid red;position:" + aE(q, "position") + ";line-height:0;", "%" !== m && k.appendChild ? g[b ? "borderLeftWidth" : "borderTopWidth"] = f + m : (k = q.parentNode || bu.body, g[b ? "width" : "height"] = f + m), k.appendChild(aH), j = parseFloat(aH[b ? "offsetWidth" : "offsetHeight"]), k.removeChild(aH), 0 !== j || p || (j = a6(q, c, f, m, !0))), d ? -j : j
			},
			bA = function(f, a, b) {
				if ("absolute" !== aE(f, "position", b)) {
					return 0
				}
				var c = "left" === a ? "Left" : "Top",
					d = aE(f, "margin" + c, b);
				return f["offset" + c] - (a6(f, a, parseFloat(d), d.replace(bw, "")) || 0)
			},
			aa = function(f, a) {
				var b,
					c,
					d = {};
				if (a = a || a5(f, null)) {
					if (b = a.length) {
						for (; --b > -1;) {
							d[a[b].replace(bc, aL)] = a.getPropertyValue(a[b])
						}
					} else {
						for (b in a) {
							d[b] = a[b]
						}
					}
				} else {
					if (a = f.currentStyle || f.style) {
						for (b in a) {
							"string" == typeof b && void 0 === d[b] && (d[b.replace(bc, aL)] = a[b])
						}
					}
				}
				return bz || (d.opacity = bl(f)), c = ak(f, a, !1), d.rotation = c.rotation, d.skewX = c.skewX, d.scaleX = c.scaleX, d.scaleY = c.scaleY, d.x = c.x, d.y = c.y, bs && (d.z = c.z, d.rotationX = c.rotationX, d.rotationY = c.rotationY, d.scaleZ = c.scaleZ), d.filters &&
					delete d.filters
					, d
			},
			aB = function(q, c, f, m, p) {
				var j,
					b,
					k,
					g = {},
					d = q.style;
				for (b in f) {
					"cssText" !== b && "length" !== b && isNaN(b) && (c[b] !== (j = f[b]) || p && p[b]) && -1 === b.indexOf("Origin") && ("number" == typeof j || "string" == typeof j) && (g[b] = "auto" !== j || "left" !== b && "top" !== b ? "" !== j && "auto" !== j && "none" !== j || "string" != typeof c[b] || "" === c[b].replace(bn, "") ? j : 0 : bA(q, b), void 0 !== d[b] && (k = new ac(d, b, d[b], k)))
				}
				if (m) {
					for (b in m) {
						"className" !== b && (g[b] = m[b])
					}
				}
				return {
					difs : g,
					firstMPT : k
				}
			},
			aM = {
				width : [ "Left", "Right" ],
				height : [ "Top", "Bottom" ]
			},
			aK = [ "marginLeft", "marginRight", "marginTop", "marginBottom" ],
			bi = function(g, a, b) {
				var d = parseFloat("width" === a ? g.offsetWidth : g.offsetHeight),
					f = aM[a],
					c = f.length;
				for (b = b || a5(g, null); --c > -1;) {
					d -= parseFloat(aE(g, "padding" + f[c], b, !0)) || 0, d -= parseFloat(aE(g, "border" + f[c] + "Width", b, !0)) || 0
				}
				return d
			},
			aw = function(f, a) {
				(null == f || "" === f || "auto" === f || "auto auto" === f) && (f = "0 0");
				var b = f.split(" "),
					c = -1 !== f.indexOf("left") ? "0%" : -1 !== f.indexOf("right") ? "100%" : b[0],
					d = -1 !== f.indexOf("top") ? "0%" : -1 !== f.indexOf("bottom") ? "100%" : b[1];
				return null == d ? d = "0" : "center" === d && (d = "50%"), ("center" === c || isNaN(parseFloat(c)) && -1 === (c + "").indexOf("=")) && (c = "50%"), a && (a.oxp = -1 !== c.indexOf("%"), a.oyp = -1 !== d.indexOf("%"), a.oxr = "=" === c.charAt(1), a.oyr = "=" === d.charAt(1), a.ox = parseFloat(c.replace(bn, "")), a.oy = parseFloat(d.replace(bn, ""))), c + " " + d + (b.length > 2 ? " " + b[2] : "")
			},
			aI = function(b, a) {
				return "string" == typeof b && "=" === b.charAt(1) ? parseInt(b.charAt(0) + "1", 10) * parseFloat(b.substr(2)) : parseFloat(b) - parseFloat(a)
			},
			a9 = function(b, a) {
				return null == b ? a : "string" == typeof b && "=" === b.charAt(1) ? parseInt(b.charAt(0) + "1", 10) * Number(b.substr(2)) + a : parseFloat(b)
			},
			bd = function(m, c, d, j) {
				var k,
					g,
					b,
					h,
					f = 1e-06;
				return null == m ? h = c : "number" == typeof m ? h = m : (k = 360, g = m.split("_"), b = Number(g[0].replace(bn, "")) * (-1 === m.indexOf("rad") ? 1 : aP) - ("=" === m.charAt(1) ? 0 : c), g.length && (j && (j[d] = c + b), -1 !== m.indexOf("short") && (b %= k, b !== b % (k / 2) && (b = 0 > b ? b + k : b - k)), -1 !== m.indexOf("_cw") && 0 > b ? b = (b + 9999999999 * k) % k - (0 | b / k) * k : -1 !== m.indexOf("ccw") && b > 0 && (b = (b - 9999999999 * k) % k - (0 | b / k) * k)), h = c + b), f > h && h > -f && (h = 0), h
			},
			aW = {
				aqua : [ 0, 255, 255 ],
				lime : [ 0, 255, 0 ],
				silver : [ 192, 192, 192 ],
				black : [ 0, 0, 0 ],
				maroon : [ 128, 0, 0 ],
				teal : [ 0, 128, 128 ],
				blue : [ 0, 0, 255 ],
				navy : [ 0, 0, 128 ],
				white : [ 255, 255, 255 ],
				fuchsia : [ 255, 0, 255 ],
				olive : [ 128, 128, 0 ],
				yellow : [ 255, 255, 0 ],
				orange : [ 255, 165, 0 ],
				gray : [ 128, 128, 128 ],
				purple : [ 128, 0, 128 ],
				green : [ 0, 128, 0 ],
				red : [ 255, 0, 0 ],
				pink : [ 255, 192, 203 ],
				cyan : [ 0, 255, 255 ],
				transparent : [ 255, 255, 255, 0 ]
			},
			ag = function(c, a, b) {
				return c = 0 > c ? c + 1 : c > 1 ? c - 1 : c, 0 | 255 * (1 > 6 * c ? a + 6 * (b - a) * c : 0.5 > c ? b : 2 > 3 * c ? a + 6 * (b - a) * (2 / 3 - c) : a) + 0.5
			},
			aZ = function(j) {
				var c,
					d,
					g,
					h,
					f,
					b;
				return j && "" !== j ? "number" == typeof j ? [ j >> 16, 255 & j >> 8, 255 & j ] : ("," === j.charAt(j.length - 1) && (j = j.substr(0, j.length - 1)), aW[j] ? aW[j] : "#" === j.charAt(0) ? (4 === j.length && (c = j.charAt(1), d = j.charAt(2), g = j.charAt(3), j = "#" + c + c + d + d + g + g), j = parseInt(j.substr(1), 16), [ j >> 16, 255 & j >> 8, 255 & j ]) : "hsl" === j.substr(0, 3) ? (j = j.match(ap), h = Number(j[0]) % 360 / 360, f = Number(j[1]) / 100, b = Number(j[2]) / 100, d = 0.5 >= b ? b * (f + 1) : b + f - b * f, c = 2 * b - d, j.length > 3 && (j[3] = Number(j[3])), j[0] = ag(h + 1 / 3, c, d), j[1] = ag(h, c, d), j[2] = ag(h - 1 / 3, c, d), j) : (j = j.match(ap) || aW.transparent, j[0] = Number(j[0]), j[1] = Number(j[1]), j[2] = Number(j[2]), j.length > 3 && (j[3] = Number(j[3])), j)) : aW.black
			},
			aQ = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#.+?\\b";
		for (aO in aW) {
			aQ += "|" + aO + "\\b"
		}
		aQ = RegExp(aQ + ")", "gi");
		var aF = function(v, d, g, p) {
				if (null == v) {
					return function(a) {
						return a
					}
				}
				var q,
					k = d ? (v.match(aQ) || [ "" ])[0] : "",
					c = v.split(k).join("").match(aA) || [],
					m = v.substr(0, v.indexOf(c[0])),
					j = ")" === v.charAt(v.length - 1) ? ")" : "",
					f = -1 !== v.indexOf(" ") ? " " : ",",
					w = c.length,
					b = w > 0 ? c[0].replace(ap, "") : "";
				return w ? q = d ? function(o) {
					var h,
						n,
						l,
						a;
					if ("number" == typeof o) {
						o += b
					} else {
						if (p && aq.test(o)) {
							for (a = o.replace(aq, "|").split("|"), l = 0; a.length > l; l++) {
								a[l] = q(a[l])
							}
							return a.join(",")
						}
					}
					if (h = (o.match(aQ) || [ k ])[0], n = o.split(h).join("").match(aA) || [], l = n.length, w > l--) {
						for (; w > ++l;) {
							n[l] = g ? n[0 | (l - 1) / 2] : c[l]
						}
					}
					return m + n.join(f) + f + h + j + (-1 !== o.indexOf("inset") ? " inset" : "")
				} : function(o) {
					var a,
						h,
						l;
					if ("number" == typeof o) {
						o += b
					} else {
						if (p && aq.test(o)) {
							for (h = o.replace(aq, "|").split("|"), l = 0; h.length > l; l++) {
								h[l] = q(h[l])
							}
							return h.join(",")
						}
					}
					if (a = o.match(aA) || [], l = a.length, w > l--) {
						for (; w > ++l;) {
							a[l] = g ? a[0 | (l - 1) / 2] : c[l]
						}
					}
					return m + a.join(f) + j
				} : function(a) {
					return a
				}
			},
			bm = function(a) {
				return a = a.split(","), function(c, f, m, p, j, b, k) {
						var g,
							d = (f + "").split(" ");
						for (k = {}, g = 0; 4 > g; g++) {
							k[a[g]] = d[g] = d[g] || d[(g - 1) / 2 >> 0]
						}
						return p.parse(c, k, j, b)
				}
			},
			ac = (ay._setPluginRatio = function(m) {
				this.plugin.setRatio(m);
				for (var c, d, j, k, g = this.data, b = g.proxy, h = g.firstMPT, f = 1e-06; h;) {
					c = b[h.v], h.r ? c = c > 0 ? 0 | c + 0.5 : 0 | c - 0.5 : f > c && c > -f && (c = 0), h.t[h.p] = c, h = h._next
				}
				if (g.autoRotate && (g.autoRotate.rotation = b.rotation), 1 === m) {
					for (h = g.firstMPT; h;) {
						if (d = h.t, d.type) {
							if (1 === d.type) {
								for (k = d.xs0 + d.s + d.xs1, j = 1; d.l > j; j++) {
									k += d["xn" + j] + d["xs" + (j + 1)]
								}
								d.e = k
							}
						} else {
							d.e = d.s + d.xs0
						}
						h = h._next
					}
				}
			}, function(f, a, b, c, d) {
				this.t = f, this.p = a, this.v = b, this.r = d, c && (c._prev = this, this._next = c)
			}),
			a3 = (ay._parseToProxy = function(D, m, w, B, C, y) {
				var g,
					z,
					x,
					v,
					E,
					b = B,
					A = {},
					q = {},
					j = w._transform,
					k = aV;
				for (w._transform = null, aV = m, B = E = w.parse(D, m, B, C), aV = k, y && (w._transform = j, b && (b._prev = null, b._prev && (b._prev._next = null))); B && B !== b;) {
					if (1 >= B.type && (z = B.p, q[z] = B.s + B.c, A[z] = B.s, y || (v = new ac(B, "s", z, v, B.r), B.c = 0), 1 === B.type)) {
						for (g = B.l; --g > 0;) {
							x = "xn" + g, z = B.p + "_" + x, q[z] = B.data[x], A[z] = B[x], y || (v = new ac(B, x, z, v, B.rxp[x]))
						}
					}
					B = B._next
				}
				return {
					proxy : A,
					end : q,
					firstMPT : v,
					pt : E
				}
			}, ay.CSSPropTween = function(q, d, m, n, c, j, g, f, v, b, k) {
				this.t = q, this.p = d, this.s = m, this.c = n, this.n = g || d, q instanceof a3 || aU.push(this.n), this.r = f, this.type = j || 0, v && (this.pr = v, aG = !0), this.b = void 0 === b ? m : b, this.e = void 0 === k ? m + n : k, c && (this._next = c, c._prev = this)
			}),
			az = ad.parseComplex = function(O, q, D, K, M, G, d, H, F, U) {
				D = D || G || "", d = new a3(O, q, 0, 0, d, U ? 2 : 1, null, !1, H, D, K), K += "";
				var b,
					I,
					z,
					j,
					B,
					V,
					Y,
					Q,
					X,
					W,
					J,
					N,
					L = D.split(", ").join(",").split(" "),
					E = K.split(", ").join(",").split(" "),
					m = L.length,
					h = aD !== !1;
				for ((-1 !== K.indexOf(",") || -1 !== D.indexOf(",")) && (L = L.join(" ").replace(aq, ", ").split(" "), E = E.join(" ").replace(aq, ", ").split(" "), m = L.length), m !== E.length && (L = (G || "").split(" "), m = L.length), d.plugin = F, d.setRatio = U, b = 0; m > b; b++) {
					if (j = L[b], B = E[b], Q = parseFloat(j), Q || 0 === Q) {
						d.appendXtra("", Q, aI(B, Q), B.replace(aR, ""), h && -1 !== B.indexOf("px"), !0)
					} else {
						if (M && ("#" === j.charAt(0) || aW[j] || ai.test(j))) {
							N = "," === B.charAt(B.length - 1) ? ")," : ")", j = aZ(j), B = aZ(B), X = j.length + B.length > 6, X && !bz && 0 === B[3] ? (d["xs" + d.l] += d.l ? " transparent" : "transparent", d.e = d.e.split(E[b]).join("transparent")) : (bz || (X = !1), d.appendXtra(X ? "rgba(" : "rgb(", j[0], B[0] - j[0], ",", !0, !0).appendXtra("", j[1], B[1] - j[1], ",", !0).appendXtra("", j[2], B[2] - j[2], X ? "," : N, !0), X && (j = 4 > j.length ? 1 : j[3], d.appendXtra("", j, (4 > B.length ? 1 : B[3]) - j, N, !1)))
						} else {
							if (V = j.match(ap)) {
								if (Y = B.match(aR), !Y || Y.length !== V.length) {
									return d
								}
								for (z = 0, I = 0; V.length > I; I++) {
									J = V[I], W = j.indexOf(J, z), d.appendXtra(j.substr(z, W - z), Number(J), aI(Y[I], J), "", h && "px" === j.substr(W + J.length, 2), 0 === I), z = W + J.length
								}
								d["xs" + d.l] += j.substr(z)
							} else {
								d["xs" + d.l] += d.l ? " " + j : j
							}
						}
					}
				}
				if (-1 !== K.indexOf("=") && d.data) {
					for (N = d.xs0 + d.data.s, b = 1; d.l > b; b++) {
						N += d["xs" + b] + d.data["xn" + b]
					}
					d.e = N + d["xs" + b]
				}
				return d.l || (d.type = -1, d.xs0 = d.e), d.xfirst || d
			},
			an = 9;
		for (aO = a3.prototype, aO.l = aO.pr = 0; --an > 0;) {
			aO["xn" + an] = 0, aO["xs" + an] = ""
		}
		aO.xs0 = "", aO._next = aO._prev = aO.xfirst = aO.data = aO.plugin = aO.setRatio = aO.rxp = null, aO.appendXtra = function(k, c, d, h, j, f) {
			var b = this,
				g = b.l;
			return b["xs" + g] += f && g ? " " + k : k || "", d || 0 === g || b.plugin ? (b.l++, b.type = b.setRatio ? 2 : 1, b["xs" + b.l] = h || "", g > 0 ? (b.data["xn" + g] = c + d, b.rxp["xn" + g] = j, b["xn" + g] = c, b.plugin || (b.xfirst = new a3(b, "xn" + g, c, d, b.xfirst || b, 0, b.n, j, b.pr), b.xfirst.xs0 = 0), b) : (b.data = {
					s : c + d
				}, b.rxp = {}, b.s = c, b.c = d, b.r = j, b)) : (b["xs" + g] += c + (h || ""), b)
		};
		var ar = function(b, a) {
				a = a || {}, this.p = a.prefix ? bo(b) || b : b, aX[b] = aX[this.p] = this, this.format = a.formatter || aF(a.defaultValue, a.color, a.collapsible, a.multi), a.parser && (this.parse = a.parser), this.clrs = a.color, this.multi = a.multi, this.keyword = a.keyword, this.dflt = a.defaultValue, this.pr = a.priority || 0
			},
			aT = ay._registerComplexSpecialProp = function(j, c, d) {
				"object" != typeof c && (c = {
					parser : d
				});
				var g,
					h,
					f = j.split(","),
					b = c.defaultValue;
				for (d = d || [ b ], g = 0; f.length > g; g++) {
					c.prefix = 0 === g && c.prefix, c.defaultValue = d[g] || b, h = new ar(f[g], c)
				}
			},
			aC = function(b) {
				if (!aX[b]) {
					var a = b.charAt(0).toUpperCase() + b.substr(1) + "Plugin";
					aT(b, {
						parser : function(m, e, j, k, g, c, f) {
							var d = (window.GreenSockGlobals || window).com.greensock.plugins[a];
							return d ? (d._cssRegister(), aX[j].parse(m, e, j, k, g, c, f)) : (aj("Error: " + a + " js file not loaded."), g)
						}
					})
				}
			};
		aO = ar.prototype, aO.parseComplex = function(x, d, g, v, w, k) {
			var c,
				m,
				j,
				f,
				y,
				b,
				q = this.keyword;
			if (this.multi && (aq.test(g) || aq.test(d) ? (m = d.replace(aq, "|").split("|"), j = g.replace(aq, "|").split("|")) : q && (m = [ d ], j = [ g ])), j) {
				for (f = j.length > m.length ? j.length : m.length, c = 0; f > c; c++) {
					d = m[c] = m[c] || this.dflt, g = j[c] = j[c] || this.dflt, q && (y = d.indexOf(q), b = g.indexOf(q), y !== b && (g = -1 === b ? j : m, g[c] += " " + q))
				}
				d = m.join(", "), g = j.join(", ")
			}
			return az(x, this.p, d, g, this.clrs, this.dflt, v, this.pr, w, k)
		}, aO.parse = function(h, c, d, g, f, b) {
			return this.parseComplex(h.style, this.format(aE(h, this.p, bb, !1, this.dflt)), this.format(c), f, b)
		}, ad.registerSpecialProp = function(c, a, b) {
			aT(c, {
				parser : function(k, h, j, f, d, g) {
					var e = new a3(k, j, 0, 0, d, 2, j, !1, b);
					return e.plugin = g, e.setRatio = a(k, h, f._tween, j), e
				},
				priority : b
			})
		};
		var bp = "scaleX,scaleY,scaleZ,x,y,z,skewX,rotation,rotationX,rotationY,perspective".split(","),
			by = bo("transform"),
			bj = aJ + "transform",
			bv = bo("transformOrigin"),
			bs = null !== bo("perspective"),
			ak = function(b6, bC, bK, b1) {
				if (b6._gsTransform && bK && !b1) {
					return b6._gsTransform
				}
				var b4,
					bT,
					bV,
					bR,
					bJ,
					b9,
					A,
					bX,
					bF,
					M,
					be,
					bS,
					bH,
					cb = bK ? b6._gsTransform || {
						skewY : 0
					} : {
						skewY : 0
					},
					ch = 0 > cb.scaleX,
					b7 = 2e-05,
					cf = 100000,
					cd = 179.99,
					H = cd * aS,
					bY = bs ? parseFloat(aE(b6, bv, bC, !1, "0 0 0").split(" ")[2]) || cb.zOrigin || 0 : 0;
				for (by ? b4 = aE(b6, bj, bC, !0) : b6.currentStyle && (b4 = b6.currentStyle.filter.match(af), b4 = b4 && 4 === b4.length ? [ b4[0].substr(4), Number(b4[2].substr(4)), Number(b4[1].substr(4)), b4[3].substr(4), cb.x || 0, cb.y || 0 ].join(",") : ""), bT = (b4 || "").match(/(?:\-|\b)[\d\-\.e]+\b/gi) || [], bV = bT.length; --bV > -1;) {
					bR = Number(bT[bV]), bT[bV] = (bJ = bR - (bR |= 0)) ? (0 | bJ * cf + (0 > bJ ? -0.5 : 0.5)) / cf + bR : bR
				}
				if (16 === bT.length) {
					var b5 = bT[8],
						b2 = bT[9],
						bP = bT[10],
						ae = bT[12],
						bW = bT[13],
						bB = bT[14];
					if (cb.zOrigin && (bB = -cb.zOrigin, ae = b5 * bB - bT[12], bW = b2 * bB - bT[13], bB = bP * bB + cb.zOrigin - bT[14]), !bK || b1 || null == cb.rotationX) {
						var bU,
							cg,
							bL,
							bD,
							bG,
							ci,
							cj,
							ca = bT[0],
							L = bT[1],
							bN = bT[2],
							ce = bT[3],
							cc = bT[4],
							bZ = bT[5],
							b0 = bT[6],
							ck = bT[7],
							a = bT[11],
							bI = Math.atan2(b0, bP),
							bQ = -H > bI || bI > H;
						cb.rotationX = bI * aP, bI && (bD = Math.cos(-bI), bG = Math.sin(-bI), bU = cc * bD + b5 * bG, cg = bZ * bD + b2 * bG, bL = b0 * bD + bP * bG, b5 = cc * -bG + b5 * bD, b2 = bZ * -bG + b2 * bD, bP = b0 * -bG + bP * bD, a = ck * -bG + a * bD, cc = bU, bZ = cg, b0 = bL), bI = Math.atan2(b5, ca), cb.rotationY = bI * aP, bI && (ci = -H > bI || bI > H, bD = Math.cos(-bI), bG = Math.sin(-bI), bU = ca * bD - b5 * bG, cg = L * bD - b2 * bG, bL = bN * bD - bP * bG, b2 = L * bG + b2 * bD, bP = bN * bG + bP * bD, a = ce * bG + a * bD, ca = bU, L = cg, bN = bL), bI = Math.atan2(L, bZ), cb.rotation = bI * aP, bI && (cj = -H > bI || bI > H, bD = Math.cos(-bI), bG = Math.sin(-bI), ca = ca * bD + cc * bG, cg = L * bD + bZ * bG, bZ = L * -bG + bZ * bD, b0 = bN * -bG + b0 * bD, L = cg), cj && bQ ? cb.rotation = cb.rotationX = 0 : cj && ci ? cb.rotation = cb.rotationY = 0 : ci && bQ && (cb.rotationY = cb.rotationX = 0), cb.scaleX = (0 | Math.sqrt(ca * ca + L * L) * cf + 0.5) / cf, cb.scaleY = (0 | Math.sqrt(bZ * bZ + b2 * b2) * cf + 0.5) / cf, cb.scaleZ = (0 | Math.sqrt(b0 * b0 + bP * bP) * cf + 0.5) / cf, cb.skewX = 0, cb.perspective = a ? 1 / (0 > a ? -a : a) : 0, cb.x = ae, cb.y = bW, cb.z = bB
					}
				} else {
					if (!(bs && !b1 && bT.length && cb.x === bT[4] && cb.y === bT[5] && (cb.rotationX || cb.rotationY) || void 0 !== cb.x && "none" === aE(b6, "display", bC))) {
						var bO = bT.length >= 6,
							b8 = bO ? bT[0] : 1,
							bE = bT[1] || 0,
							bM = bT[2] || 0,
							b3 = bO ? bT[3] : 1;
						cb.x = bT[4] || 0, cb.y = bT[5] || 0, b9 = Math.sqrt(b8 * b8 + bE * bE), A = Math.sqrt(b3 * b3 + bM * bM), bX = b8 || bE ? Math.atan2(bE, b8) * aP : cb.rotation || 0, bF = bM || b3 ? Math.atan2(bM, b3) * aP + bX : cb.skewX || 0, M = b9 - Math.abs(cb.scaleX || 0), be = A - Math.abs(cb.scaleY || 0), Math.abs(bF) > 90 && 270 > Math.abs(bF) && (ch ? (b9 *= -1, bF += 0 >= bX ? 180 : -180, bX += 0 >= bX ? 180 : -180) : (A *= -1, bF += 0 >= bF ? 180 : -180)), bS = (bX - cb.rotation) % 180, bH = (bF - cb.skewX) % 180, (void 0 === cb.skewX || M > b7 || -b7 > M || be > b7 || -b7 > be || bS > -cd && cd > bS && false | bS * cf || bH > -cd && cd > bH && false | bH * cf) && (cb.scaleX = b9, cb.scaleY = A, cb.rotation = bX, cb.skewX = bF), bs && (cb.rotationX = cb.rotationY = cb.z = 0, cb.perspective = parseFloat(ad.defaultTransformPerspective) || 0, cb.scaleZ = 1)
					}
				}
				cb.zOrigin = bY;
				for (bV in cb) {
					b7 > cb[bV] && cb[bV] > -b7 && (cb[bV] = 0)
				}
				return bK && (b6._gsTransform = cb), cb
			},
			a4 = function(Q) {
				var z,
					D,
					L = this.data,
					N = -L.rotation * aS,
					H = N + L.skewX * aS,
					j = 100000,
					I = (0 | Math.cos(N) * L.scaleX * j) / j,
					F = (0 | Math.sin(N) * L.scaleX * j) / j,
					C = (0 | Math.sin(H) * -L.scaleY * j) / j,
					T = (0 | Math.cos(H) * L.scaleY * j) / j,
					c = this.t.style,
					J = this.t.currentStyle;
				if (J) {
					D = F, F = -C, C = -D, z = J.filter, c.filter = "";
					var A,
						y,
						G = this.t.offsetWidth,
						B = this.t.offsetHeight,
						U = "absolute" !== J.position,
						W = "progid:DXImageTransform.Microsoft.Matrix(M11=" + I + ", M12=" + F + ", M21=" + C + ", M22=" + T,
						V = L.x,
						q = L.y;
					if (null != L.ox && (A = (L.oxp ? 0.01 * G * L.ox : L.ox) - G / 2, y = (L.oyp ? 0.01 * B * L.oy : L.oy) - B / 2, V += A - (A * I + y * F), q += y - (A * C + y * T)), U ? (A = G / 2, y = B / 2, W += ", Dx=" + (A - (A * I + y * F) + V) + ", Dy=" + (y - (A * C + y * T) + q) + ")") : W += ", sizingMethod='auto expand')", c.filter = -1 !== z.indexOf("DXImageTransform.Microsoft.Matrix(") ? z.replace(aY, W) : W + " " + z, (0 === Q || 1 === Q) && 1 === I && 0 === F && 0 === C && 1 === T && (U && -1 === W.indexOf("Dx=0, Dy=0") || bh.test(z) && 100 !== parseFloat(RegExp.$1) || -1 === z.indexOf("gradient(" && z.indexOf("Alpha")) && c.removeAttribute("filter")), !U) {
						var K,
							O,
							M,
							E = 8 > al ? 1 : -1;
						for (A = L.ieOffsetX || 0, y = L.ieOffsetY || 0, L.ieOffsetX = Math.round((G - ((0 > I ? -I : I) * G + (0 > F ? -F : F) * B)) / 2 + V), L.ieOffsetY = Math.round((B - ((0 > T ? -T : T) * B + (0 > C ? -C : C) * G)) / 2 + q), an = 0; 4 > an; an++) {
							O = aK[an], K = J[O], D = -1 !== K.indexOf("px") ? parseFloat(K) : a6(this.t, O, parseFloat(K), K.replace(bw, "")) || 0, M = D !== L[O] ? 2 > an ? -L.ieOffsetX : -L.ieOffsetY : 2 > an ? A - L.ieOffsetX : y - L.ieOffsetY, c[O] = (L[O] = Math.round(D - M * (0 === an || 2 === an ? 1 : E))) + "px"
						}
					}
				}
			},
			bf = function() {
				var bB,
					H,
					L,
					Y,
					ae,
					U,
					p,
					V,
					N,
					K,
					bD,
					j,
					I,
					B,
					F,
					Q,
					J,
					bE,
					bH,
					bC,
					bG,
					bF,
					z,
					X = this.data,
					be = this.t.style,
					Z = X.rotation * aS,
					M = X.scaleX,
					E = X.scaleY,
					q = X.scaleZ,
					W = X.perspective;
				if (a1) {
					var G = 0.0001;
					G > M && M > -G && (M = q = 2e-05), G > E && E > -G && (E = q = 2e-05), !W || X.z || X.rotationX || X.rotationY || (W = 0)
				}
				if (Z || X.skewX) {
					bE = Math.cos(Z), bH = Math.sin(Z), bB = bE, ae = bH, X.skewX && (Z -= X.skewX * aS, bE = Math.cos(Z), bH = Math.sin(Z)), H = -bH, U = bE
				} else {
					if (!(X.rotationY || X.rotationX || 1 !== q || W)) {
						return be[by] = "translate3d(" + X.x + "px," + X.y + "px," + X.z + "px)" + (1 !== M || 1 !== E ? " scale(" + M + "," + E + ")" : ""), void 0
					}
					bB = U = 1, H = ae = 0
				}
				bD = 1, L = Y = p = V = N = K = j = I = B = 0, F = W ? -1 / W : 0, Q = X.zOrigin, J = 100000, Z = X.rotationY * aS, Z && (bE = Math.cos(Z), bH = Math.sin(Z), N = bD * -bH, I = F * -bH, L = bB * bH, p = ae * bH, bD *= bE, F *= bE, bB *= bE, ae *= bE), Z = X.rotationX * aS, Z && (bE = Math.cos(Z), bH = Math.sin(Z), bC = H * bE + L * bH, bG = U * bE + p * bH, bF = K * bE + bD * bH, z = B * bE + F * bH, L = H * -bH + L * bE, p = U * -bH + p * bE, bD = K * -bH + bD * bE, F = B * -bH + F * bE, H = bC, U = bG, K = bF, B = z), 1 !== q && (L *= q, p *= q, bD *= q, F *= q), 1 !== E && (H *= E, U *= E, K *= E, B *= E), 1 !== M && (bB *= M, ae *= M, N *= M, I *= M), Q && (j -= Q, Y = L * j, V = p * j, j = bD * j + Q), Y = (bC = (Y += X.x) - (Y |= 0)) ? (0 | bC * J + (0 > bC ? -0.5 : 0.5)) / J + Y : Y, V = (bC = (V += X.y) - (V |= 0)) ? (0 | bC * J + (0 > bC ? -0.5 : 0.5)) / J + V : V, j = (bC = (j += X.z) - (j |= 0)) ? (0 | bC * J + (0 > bC ? -0.5 : 0.5)) / J + j : j, be[by] = "matrix3d(" + [ (0 | bB * J) / J, (0 | ae * J) / J, (0 | N * J) / J, (0 | I * J) / J, (0 | H * J) / J, (0 | U * J) / J, (0 | K * J) / J, (0 | B * J) / J, (0 | L * J) / J, (0 | p * J) / J, (0 | bD * J) / J, (0 | F * J) / J, Y, V, j, W ? 1 + -j / W : 1 ].join(",") + ")"
			},
			ba = function(m) {
				var c,
					d,
					j,
					k,
					g,
					b = this.data,
					h = this.t,
					f = h.style;
				return b.rotationX || b.rotationY || b.z || b.force3D ? (this.setRatio = bf, bf.call(this, m), void 0) : (b.rotation || b.skewX ? (c = b.rotation * aS, d = c - b.skewX * aS, j = 100000, k = b.scaleX * j, g = b.scaleY * j, f[by] = "matrix(" + (0 | Math.cos(c) * k) / j + "," + (0 | Math.sin(c) * k) / j + "," + (0 | Math.sin(d) * -g) / j + "," + (0 | Math.cos(d) * g) / j + "," + b.x + "," + b.y + ")") : f[by] = "matrix(" + b.scaleX + ",0,0," + b.scaleY + "," + b.x + "," + b.y + ")", void 0)
			};
		aT("transform,scale,scaleX,scaleY,scaleZ,x,y,z,rotation,rotationX,rotationY,rotationZ,skewX,skewY,shortRotation,shortRotationX,shortRotationY,shortRotationZ,transformOrigin,transformPerspective,directionalRotation,parseTransform,force3D", {
			parser : function(H, s, A, G, D, j, E) {
				if (G._transform) {
					return D
				}
				var B,
					z,
					J,
					b,
					F,
					w,
					k,
					q = G._transform = ak(H, bb, !0, E.parseTransform),
					C = H.style,
					x = 1e-06,
					K = bp.length,
					L = E,
					I = {};
				if ("string" == typeof L.transform && by) {
					J = C.cssText, C[by] = L.transform, C.display = "block", B = ak(H, null, !1), C.cssText = J
				} else {
					if ("object" == typeof L) {
						if (B = {
								scaleX : a9(null != L.scaleX ? L.scaleX : L.scale, q.scaleX),
								scaleY : a9(null != L.scaleY ? L.scaleY : L.scale, q.scaleY),
								scaleZ : a9(L.scaleZ, q.scaleZ),
								x : a9(L.x, q.x),
								y : a9(L.y, q.y),
								z : a9(L.z, q.z),
								perspective : a9(L.transformPerspective, q.perspective)
							}, k = L.directionalRotation, null != k) {
							if ("object" == typeof k) {
								for (J in k) {
									L[J] = k[J]
								}
							} else {
								L.rotation = k
							}
						}
						B.rotation = bd("rotation" in L ? L.rotation : "shortRotation" in L ? L.shortRotation + "_short" : "rotationZ" in L ? L.rotationZ : q.rotation, q.rotation, "rotation", I), bs && (B.rotationX = bd("rotationX" in L ? L.rotationX : "shortRotationX" in L ? L.shortRotationX + "_short" : q.rotationX || 0, q.rotationX, "rotationX", I), B.rotationY = bd("rotationY" in L ? L.rotationY : "shortRotationY" in L ? L.shortRotationY + "_short" : q.rotationY || 0, q.rotationY, "rotationY", I)), B.skewX = null == L.skewX ? q.skewX : bd(L.skewX, q.skewX), B.skewY = null == L.skewY ? q.skewY : bd(L.skewY, q.skewY), (z = B.skewY - q.skewY) && (B.skewX += z, B.rotation += z)
					}
				}
				for (bs && null != L.force3D && (q.force3D = L.force3D, w = !0), F = q.force3D || q.z || q.rotationX || q.rotationY || B.z || B.rotationX || B.rotationY || B.perspective, F || null == L.scale || (B.scaleZ = 1); --K > -1;) {
					A = bp[K], b = B[A] - q[A], (b > x || -x > b || null != aV[A]) && (w = !0, D = new a3(q, A, q[A], b, D), A in I && (D.e = I[A]), D.xs0 = 0, D.plugin = j, G._overwriteProps.push(D.n))
				}
				return b = L.transformOrigin, (b || bs && F && q.zOrigin) && (by ? (w = !0, A = bv, b = (b || aE(H, A, bb, !1, "50% 50%")) + "", D = new a3(C, A, 0, 0, D, -1, "transformOrigin"), D.b = C[A], D.plugin = j, bs ? (J = q.zOrigin, b = b.split(" "), q.zOrigin = (b.length > 2 && (0 === J || "0px" !== b[2]) ? parseFloat(b[2]) : J) || 0, D.xs0 = D.e = C[A] = b[0] + " " + (b[1] || "50%") + " 0px", D = new a3(q, "zOrigin", 0, 0, D, -1, D.n), D.b = J, D.xs0 = D.e = q.zOrigin) : D.xs0 = D.e = C[A] = b) : aw(b + "", q)), w && (G._transformType = F || 3 === this._transformType ? 3 : 2), D
			},
			prefix : !0
		}), aT("boxShadow", {
			defaultValue : "0px 0px 0px 0px #999",
			prefix : !0,
			color : !0,
			multi : !0,
			keyword : "inset"
		}), aT("borderRadius", {
			defaultValue : "0px",
			parser : function(K, z, D, G, k) {
				z = this.format(z);
				var H,
					E,
					C,
					M,
					j,
					I,
					A,
					r,
					s,
					F,
					B,
					N,
					R,
					L,
					Q,
					O,
					q = [ "borderTopLeftRadius", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius" ],
					J = K.style;
				for (s = parseFloat(K.offsetWidth), F = parseFloat(K.offsetHeight), H = z.split(" "), E = 0; q.length > E; E++) {
					this.p.indexOf("border") && (q[E] = bo(q[E])), j = M = aE(K, q[E], bb, !1, "0px"), -1 !== j.indexOf(" ") && (M = j.split(" "), j = M[0], M = M[1]), I = C = H[E], A = parseFloat(j), N = j.substr((A + "").length), R = "=" === I.charAt(1), R ? (r = parseInt(I.charAt(0) + "1", 10), I = I.substr(2), r *= parseFloat(I), B = I.substr((r + "").length - (0 > r ? 1 : 0)) || "") : (r = parseFloat(I), B = I.substr((r + "").length)), "" === B && (B = a7[D] || N), B !== N && (L = a6(K, "borderLeft", A, N), Q = a6(K, "borderTop", A, N), "%" === B ? (j = 100 * (L / s) + "%", M = 100 * (Q / F) + "%") : "em" === B ? (O = a6(K, "borderLeft", 1, "em"), j = L / O + "em", M = Q / O + "em") : (j = L + "px", M = Q + "px"), R && (I = parseFloat(j) + r + B, C = parseFloat(M) + r + B)), k = az(J, q[E], j + " " + M, I + " " + C, !1, "0px", k)
				}
				return k
			},
			prefix : !0,
			formatter : aF("0px 0px 0px 0px", !1, !0)
		}), aT("backgroundPosition", {
			defaultValue : "0 0",
			parser : function(D, k, w, C, z, c) {
				var A,
					x,
					v,
					E,
					b,
					B,
					q = "background-position",
					j = bb || a5(D, null),
					y = this.format((j ? al ? j.getPropertyValue(q + "-x") + " " + j.getPropertyValue(q + "-y") : j.getPropertyValue(q) : D.currentStyle.backgroundPositionX + " " + D.currentStyle.backgroundPositionY) || "0 0"),
					s = this.format(k);
				if (-1 !== y.indexOf("%") != (-1 !== s.indexOf("%")) && (B = aE(D, "backgroundImage").replace(a8, ""), B && "none" !== B)) {
					for (A = y.split(" "), x = s.split(" "), av.setAttribute("src", B), v = 2; --v > -1;) {
						y = A[v], E = -1 !== y.indexOf("%"), E !== (-1 !== x[v].indexOf("%")) && (b = 0 === v ? D.offsetWidth - av.width : D.offsetHeight - av.height, A[v] = E ? parseFloat(y) / 100 * b + "px" : 100 * (parseFloat(y) / b) + "%")
					}
					y = A.join(" ")
				}
				return this.parseComplex(D.style, y, s, z, c)
			},
			formatter : aw
		}), aT("backgroundSize", {
			defaultValue : "0 0",
			formatter : aw
		}), aT("perspective", {
			defaultValue : "0px",
			prefix : !0
		}), aT("perspectiveOrigin", {
			defaultValue : "50% 50%",
			prefix : !0
		}), aT("transformStyle", {
			prefix : !0
		}), aT("backfaceVisibility", {
			prefix : !0
		}), aT("userSelect", {
			prefix : !0
		}), aT("margin", {
			parser : bm("marginTop,marginRight,marginBottom,marginLeft")
		}), aT("padding", {
			parser : bm("paddingTop,paddingRight,paddingBottom,paddingLeft")
		}), aT("clip", {
			defaultValue : "rect(0px,0px,0px,0px)",
			parser : function(p, c, f, m, j, b) {
				var k,
					g,
					d;
				return 9 > al ? (g = p.currentStyle, d = 8 > al ? " " : ",", k = "rect(" + g.clipTop + d + g.clipRight + d + g.clipBottom + d + g.clipLeft + ")", c = this.format(c).split(",").join(d)) : (k = this.format(aE(p, this.p, bb, !1, this.dflt)), c = this.format(c)), this.parseComplex(p.style, k, c, j, b)
			}
		}), aT("textShadow", {
			defaultValue : "0px 0px 0px #999",
			color : !0,
			multi : !0
		}), aT("autoRound,strictUnits", {
			parser : function(f, a, b, c, d) {
				return d
			}
		}), aT("border", {
			defaultValue : "0px solid #000",
			parser : function(h, c, d, g, f, b) {
				return this.parseComplex(h.style, this.format(aE(h, "borderTopWidth", bb, !1, "0px") + " " + aE(h, "borderTopStyle", bb, !1, "solid") + " " + aE(h, "borderTopColor", bb, !1, "#000")), this.format(c), f, b)
			},
			color : !0,
			formatter : function(b) {
				var a = b.split(" ");
				return a[0] + " " + (a[1] || "solid") + " " + (b.match(aQ) || [ "#000" ])[0]
			}
		}), aT("borderWidth", {
			parser : bm("borderTopWidth,borderRightWidth,borderBottomWidth,borderLeftWidth")
		}), aT("float,cssFloat,styleFloat", {
			parser : function(j, c, d, g, h) {
				var f = j.style,
					b = "cssFloat" in f ? "cssFloat" : "styleFloat";
				return new a3(f, b, 0, 0, h, -1, d, !1, 0, f[b], c)
			}
		});
		var aN = function(f) {
			var a,
				b = this.t,
				c = b.filter || aE(this.data, "filter"),
				d = 0 | this.s + this.c * f;
			100 === d && (-1 === c.indexOf("atrix(") && -1 === c.indexOf("radient(") && -1 === c.indexOf("oader(") ? (b.removeAttribute("filter"), a = !aE(this.data, "filter")) : (b.filter = c.replace(bq, ""), a = !0)), a || (this.xn1 && (b.filter = c = c || "alpha(opacity=" + d + ")"), -1 === c.indexOf("opacity") ? 0 === d && this.xn1 || (b.filter = c + " alpha(opacity=" + d + ")") : b.filter = c.replace(bh, "opacity=" + d))
		};
		aT("opacity,alpha,autoAlpha", {
			defaultValue : "1",
			parser : function(p, c, f, m, j, b) {
				var k = parseFloat(aE(p, "opacity", bb, !1, "1")),
					g = p.style,
					d = "autoAlpha" === f;
				return "string" == typeof c && "=" === c.charAt(1) && (c = ("-" === c.charAt(0) ? -1 : 1) * parseFloat(c.substr(2)) + k), d && 1 === k && "hidden" === aE(p, "visibility", bb) && 0 !== c && (k = 0), bz ? j = new a3(g, "opacity", k, c - k, j) : (j = new a3(g, "opacity", 100 * k, 100 * (c - k), j), j.xn1 = d ? 1 : 0, g.zoom = 1, j.type = 2, j.b = "alpha(opacity=" + j.s + ")", j.e = "alpha(opacity=" + (j.s + j.c) + ")", j.data = p, j.plugin = b, j.setRatio = aN), d && (j = new a3(g, "visibility", 0, 0, j, -1, null, !1, 0, 0 !== k ? "inherit" : "hidden", 0 === c ? "hidden" : "inherit"), j.xs0 = "inherit", m._overwriteProps.push(j.n), m._overwriteProps.push(f)), j
			}
		});
		var ao = function(b, a) {
				a && (b.removeProperty ? b.removeProperty(a.replace(a2, "-$1").toLowerCase()) : b.removeAttribute(a))
			},
			ah = function(c) {
				if (this.t._gsClassPT = this, 1 === c || 0 === c) {
					this.t.className = 0 === c ? this.b : this.e;
					for (var a = this.data, b = this.t.style; a;) {
						a.v ? b[a.p] = a.v : ao(b, a.p), a = a._next
					}
					1 === c && this.t._gsClassPT === this && (this.t._gsClassPT = null)
				} else {
					this.t.className !== this.e && (this.t.className = this.e)
				}
			};
		aT("className", {
			parser : function(A, m, z, w, g, x, v) {
				var s,
					B,
					b,
					y,
					q,
					j = A.className,
					k = A.style.cssText;
				if (g = w._classNamePT = new a3(A, z, 0, 0, g, 2), g.setRatio = ah, g.pr = -11, aG = !0, g.b = j, B = aa(A, bb), b = A._gsClassPT) {
					for (y = {}, q = b.data; q;) {
						y[q.p] = 1, q = q._next
					}
					b.setRatio(1)
				}
				return A._gsClassPT = g, g.e = "=" !== m.charAt(1) ? m : j.replace(RegExp("\\s*\\b" + m.substr(2) + "\\b"), "") + ("+" === m.charAt(0) ? " " + m.substr(2) : ""), w._tween._duration && (A.className = g.e, s = aB(A, B, aa(A), v, y), A.className = j, g.data = s.firstMPT, A.style.cssText = k, g = g.xfirst = w.parse(A, s.difs, g, x)), g
			}
		});
		var a0 = function(j) {
			if ((1 === j || 0 === j) && this.data._totalTime === this.data._totalDuration && "isFromStart" !== this.data.data) {
				var c,
					d,
					g,
					h,
					f = this.t.style,
					b = aX.transform.parse;
				if ("all" === this.e) {
					f.cssText = "", h = !0
				} else {
					for (c = this.e.split(","), g = c.length; --g > -1;) {
						d = c[g], aX[d] && (aX[d].parse === b ? h = !0 : d = "transformOrigin" === d ? bv : aX[d].p), ao(f, d)
					}
				}
				h && (ao(f, by), this.t._gsTransform &&
				delete this.t._gsTransform
				)
			}
		};
		for (aT("clearProps", {
				parser : function(f, a, c, d, b) {
					return b = new a3(f, c, 0, 0, b, 2), b.setRatio = a0, b.e = a, b.pr = -10, b.data = d._tween, aG = !0, b
				}
			}), aO = "bezier,throwProps,physicsProps,physics2D".split(","), an = aO.length; an--;) {
			aC(aO[an])
		}
		aO = ad.prototype, aO._firstPT = null, aO._onInitTween = function(r, f, n) {
			if (!r.nodeType) {
				return !1
			}
			this._target = r, this._tween = n, this._vars = f, aD = f.autoRound, aG = !1, a7 = f.suffixMap || ad.suffixMap, bb = a5(r, ""), aU = this._overwriteProps;
			var j,
				q,
				a,
				b,
				k,
				h,
				u,
				z,
				s,
				x = r.style;
			if (bk && "" === x.zIndex && (j = aE(r, "zIndex", bb), ("auto" === j || "" === j) && (x.zIndex = 0)), "string" == typeof f && (b = x.cssText, j = aa(r, bb), x.cssText = b + ";" + f, j = aB(r, j, aa(r)).difs, !bz && bt.test(f) && (j.opacity = parseFloat(RegExp.$1)), f = j, x.cssText = b), this._firstPT = q = this.parse(r, f, null), this._transformType) {
				for (s = 3 === this._transformType, by ? ab && (bk = !0, "" === x.zIndex && (u = aE(r, "zIndex", bb), ("auto" === u || "" === u) && (x.zIndex = 0)), ax && (x.WebkitBackfaceVisibility = this._vars.WebkitBackfaceVisibility || (s ? "visible" : "hidden"))) : x.zoom = 1, a = q; a && a._next;) {
					a = a._next
				}
				z = new a3(r, "transform", 0, 0, null, 2), this._linkCSSP(z, null, a), z.setRatio = s && bs ? bf : by ? ba : a4, z.data = this._transform || ak(r, bb, !0), aU.pop()
			}
			if (aG) {
				for (; q;) {
					for (h = q._next, a = b; a && a.pr > q.pr;) {
						a = a._next
					}
					(q._prev = a ? a._prev : k) ? q._prev._next = q : b = q, (q._next = a) ? a._prev = q : k = q, q = h
				}
				this._firstPT = b
			}
			return !0
		}, aO.parse = function(A, o, s, y) {
			var h,
				w,
				B,
				b,
				z,
				q,
				j,
				k,
				x,
				r,
				C = A.style;
			for (h in o) {
				q = o[h], w = aX[h], w ? s = w.parse(A, q, h, this, s, y, o) : (z = aE(A, h, bb) + "", x = "string" == typeof q, "color" === h || "fill" === h || "stroke" === h || -1 !== h.indexOf("Color") || x && ai.test(q) ? (x || (q = aZ(q), q = (q.length > 3 ? "rgba(" : "rgb(") + q.join(",") + ")"), s = az(C, h, z, q, !0, "transparent", s, 0, y)) : !x || -1 === q.indexOf(" ") && -1 === q.indexOf(",") ? (B = parseFloat(z), j = B || 0 === B ? z.substr((B + "").length) : "", ("" === z || "auto" === z) && ("width" === h || "height" === h ? (B = bi(A, h, bb), j = "px") : "left" === h || "top" === h ? (B = bA(A, h, bb), j = "px") : (B = "opacity" !== h ? 0 : 1, j = "")), r = x && "=" === q.charAt(1), r ? (b = parseInt(q.charAt(0) + "1", 10), q = q.substr(2), b *= parseFloat(q), k = q.replace(bw, "")) : (b = parseFloat(q), k = x ? q.substr((b + "").length) || "" : ""), "" === k && (k = h in a7 ? a7[h] : j), q = b || 0 === b ? (r ? b + B : b) + k : o[h], j !== k && "" !== k && (b || 0 === b) && (B || 0 === B) && (B = a6(A, h, B, j), "%" === k ? (B /= a6(A, h, 100, "%") / 100, o.strictUnits !== !0 && (z = B + "%")) : "em" === k ? B /= a6(A, h, 1, "em") : (b = a6(A, h, b, k), k = "px"), r && (b || 0 === b) && (q = b + B + k)), r && (b += B), !B && 0 !== B || !b && 0 !== b ? void 0 !== C[h] && (q || "NaN" != q + "" && null != q) ? (s = new a3(C, h, b || B || 0, 0, s, -1, h, !1, 0, z, q), s.xs0 = "none" !== q || "display" !== h && -1 === h.indexOf("Style") ? q : z) : aj("invalid " + h + " tween value: " + o[h]) : (s = new a3(C, h, B, b - B, s, 0, h, aD !== !1 && ("px" === k || "zIndex" === h), 0, z, q), s.xs0 = k)) : s = az(C, h, z, q, !0, null, s, 0, y)), y && s && !s.plugin && (s.plugin = y)
			}
			return s
		}, aO.setRatio = function(g) {
			var a,
				b,
				d,
				f = this._firstPT,
				c = 1e-06;
			if (1 !== g || this._tween._time !== this._tween._duration && 0 !== this._tween._time) {
				if (g || this._tween._time !== this._tween._duration && 0 !== this._tween._time || this._tween._rawPrevTime === -1e-06) {
					for (; f;) {
						if (a = f.c * g + f.s, f.r ? a = a > 0 ? 0 | a + 0.5 : 0 | a - 0.5 : c > a && a > -c && (a = 0), f.type) {
							if (1 === f.type) {
								if (d = f.l, 2 === d) {
									f.t[f.p] = f.xs0 + a + f.xs1 + f.xn1 + f.xs2
								} else {
									if (3 === d) {
										f.t[f.p] = f.xs0 + a + f.xs1 + f.xn1 + f.xs2 + f.xn2 + f.xs3
									} else {
										if (4 === d) {
											f.t[f.p] = f.xs0 + a + f.xs1 + f.xn1 + f.xs2 + f.xn2 + f.xs3 + f.xn3 + f.xs4
										} else {
											if (5 === d) {
												f.t[f.p] = f.xs0 + a + f.xs1 + f.xn1 + f.xs2 + f.xn2 + f.xs3 + f.xn3 + f.xs4 + f.xn4 + f.xs5
											} else {
												for (b = f.xs0 + a + f.xs1, d = 1; f.l > d; d++) {
													b += f["xn" + d] + f["xs" + (d + 1)]
												}
												f.t[f.p] = b
											}
										}
									}
								}
							} else {
								-1 === f.type ? f.t[f.p] = f.xs0 : f.setRatio && f.setRatio(g)
							}
						} else {
							f.t[f.p] = a + f.xs0
						}
						f = f._next
					}
				} else {
					for (; f;) {
						2 !== f.type ? f.t[f.p] = f.b : f.setRatio(g), f = f._next
					}
				}
			} else {
				for (; f;) {
					2 !== f.type ? f.t[f.p] = f.e : f.setRatio(g), f = f._next
				}
			}
		}, aO._enableTransforms = function(a) {
			this._transformType = a || 3 === this._transformType ? 3 : 2, this._transform = this._transform || ak(this._target, bb, !0)
		}, aO._linkCSSP = function(d, a, b, c) {
			return d && (a && (a._prev = d), d._next && (d._next._prev = d._prev), d._prev ? d._prev._next = d._next : this._firstPT === d && (this._firstPT = d._next, c = !0), b ? b._next = d : c || null !== this._firstPT || (this._firstPT = d), d._next = a, d._prev = b), d
		}, aO._kill = function(a) {
			var b,
				d,
				f,
				c = a;
			if (a.autoAlpha || a.alpha) {
				c = {};
				for (d in a) {
					c[d] = a[d]
				}
				c.opacity = 1, c.autoAlpha && (c.visibility = 1)
			}
			return a.className && (b = this._classNamePT) && (f = b.xfirst, f && f._prev ? this._linkCSSP(f._prev, b._next, f._prev._prev) : f === this._firstPT && (this._firstPT = b._next), b._next && this._linkCSSP(b._next, b._next._next, f._prev), this._classNamePT = null), bg.prototype._kill.call(this, c)
		};
		var at = function(j, c, d) {
			var g,
				h,
				f,
				b;
			if (j.slice) {
				for (h = j.length; --h > -1;) {
					at(j[h], c, d)
				}
			} else {
				for (g = j.childNodes, h = g.length; --h > -1;) {
					f = g[h], b = f.type, f.style && (c.push(aa(f)), d && d.push(f)), 1 !== b && 9 !== b && 11 !== b || !f.childNodes.length || at(f, c, d)
				}
			}
		};
		return ad.cascadeTo = function(v, e, m) {
				var q,
					g,
					c,
					j = au.to(v, e, m),
					f = [ j ],
					d = [],
					w = [],
					b = [],
					k = au._internals.reservedProps;
				for (v = j._targets || j.target, at(v, d, b), j.render(e, !0), at(v, w), j.render(0, !0), j._enabled(!0), q = b.length; --q > -1;) {
					if (g = aB(b[q], d[q], w[q]), g.firstMPT) {
						g = g.difs;
						for (c in m) {
							k[c] && (g[c] = m[c])
						}
						f.push(au.to(b[q], e, g))
					}
				}
				return f
			}, bg.activate([ ad ]), ad
	}, !0)
}), window._gsDefine && window._gsQueue.pop()();
function revslider_showDoubleJqueryError(a) {
	var b = "Revolution Slider Error: You have some jquery.js library include that comes after the revolution files js include.";
	b += "<br> This includes make eliminates the revolution slider libraries, and make it not work.";
	b += "<br><br> To fix it you can:<br>&nbsp;&nbsp;&nbsp; 1. In the Slider Settings -> Troubleshooting set option:  <strong><b>Put JS Includes To Body</b></strong> option to true.";
	b += "<br>&nbsp;&nbsp;&nbsp; 2. Find the double jquery.js include and remove it.";
	b = "<span style='font-size:16px;color:#BC0C06;'>" + b + "</span>";jQuery(a).show().html(b)
}
(function(ak, aP) {
	function aD(a) {
		var f = [],
			c;
		var d = window.location.href.slice(window.location.href.indexOf(a) + 1).split("_");
		for (var b = 0; b < d.length; b++) {
			d[b] = d[b].replace("%3D", "=");
			c = d[b].split("=");f.push(c[0]);
			f[c[0]] = c[1]
		}
		return f
	}
	function aL(g, d) {
		try {
			if (d.hideThumbsUnderResoluition != 0 && d.navigationType == "thumb") {
				if (d.hideThumbsUnderResoluition > ak(window).width()) {
					ak(".tp-bullets").css({
						display : "none"
					})
				} else {
					ak(".tp-bullets").css({
						display : "block"
					})
				}
			}
		} catch (j) {} g.find(".defaultimg").each(function(a) {
			ap(ak(this), d)
		});var h = g.parent();
		if (ak(window).width() < d.hideSliderAtLimit) {
			g.trigger("stoptimer");
			if (h.css("display") != "none") {
				h.data("olddisplay", h.css("display"))
			}
			h.css({
				display : "none"
			})
		} else {
			if (g.is(":hidden")) {
				if (h.data("olddisplay") != aP && h.data("olddisplay") != "undefined" && h.data("olddisplay") != "none") {
					h.css({
						display : h.data("olddisplay")
					})
				} else {
					h.css({
						display : "block"
					})
				}
				g.trigger("restarttimer");setTimeout(function() {
					aL(g, d)
				}, 150)
			}
		}
		var k = 0;
		if (d.forceFullWidth == "on") {
			k = 0 - d.container.parent().offset().left
		}
		try {
			g.parent().find(".tp-bannershadow").css({
				width : d.width,
				left : k
			})
		} catch (j) {} var b = g.find(">ul >li:eq(" + d.act + ") .slotholder");
		var c = g.find(">ul >li:eq(" + d.next + ") .slotholder");
		aO(g, d);c.find(".defaultimg").css({
			opacity : 0
		});b.find(".defaultimg").css({
			opacity : 1
		});c.find(".defaultimg").each(function() {
			var a = ak(this);
			if (a.data("kenburn") != aP) {
				a.data("kenburn").restart()
			}
		});var e = g.find(">ul >li:eq(" + d.next + ")");
		aU(e, d, true);aB(g, d)
	}
	function aN() {
		var a = [ "android", "webos", "iphone", "ipad", "blackberry", "Android", "webos",, "iPod", "iPhone", "iPad", "Blackberry", "BlackBerry" ];
		var b = false;
		for (i in a) {
			if (navigator.userAgent.split(a[i]).length > 1) {
				b = true
			}
		}
		return b
	}
	function aF(d, b) {
		var c = ak('<div style="display:none;"/>').appendTo(ak("body"));
		c.html("<!--[if " + (b || "") + " IE " + (d || "") + "]><a>&nbsp;</a><![endif]-->");var a = c.find("a").length;
		c.remove();return a
	}
	function aR(a, b) {
		ah(b, a)
	}
	function ac(g, k) {
		var f = g.parent();
		if (k.navigationType == "thumb" || k.navsecond == "both") {
			f.append('<div class="tp-bullets tp-thumbs ' + k.navigationStyle + '"><div class="tp-mask"><div class="tp-thumbcontainer"></div></div></div>')
		}
		var l = f.find(".tp-bullets.tp-thumbs .tp-mask .tp-thumbcontainer");
		var j = l.parent();
		j.width(k.thumbWidth * k.thumbAmount);j.height(k.thumbHeight);j.parent().width(k.thumbWidth * k.thumbAmount);j.parent().height(k.thumbHeight);g.find(">ul:first >li").each(function(h) {
			var m = g.find(">ul:first >li:eq(" + h + ")");
			var n = m.find(".defaultimg").css("backgroundColor");
			if (m.data("thumb") != aP) {
				var p = m.data("thumb")
			} else {
				var p = m.find("img:first").attr("src")
			}
			l.append('<div class="bullet thumb" style="background-color:' + n + ";position:relative;width:" + k.thumbWidth + "px;height:" + k.thumbHeight + "px;background-image:url(" + p + ') !important;background-size:cover;background-position:center center;"></div>');
			var c = l.find(".bullet:first")
		});var b = 10;
		l.find(".bullet").each(function(c) {
			var a = ak(this);
			if (c == k.slideamount - 1) {
				a.addClass("last")
			}
			if (c == 0) {
				a.addClass("first")
			}
			a.width(k.thumbWidth);a.height(k.thumbHeight);
			if (b < a.outerWidth(true)) {
				b = a.outerWidth(true)
			}
			a.click(function() {
				if (k.transition == 0 && a.index() != k.act) {
					k.next = a.index();aR(k, g)
				}
			})
		});var d = b * g.find(">ul:first >li").length;
		var e = l.parent().width();
		k.thumbWidth = b;
		if (e < d) {
			ak(document).mousemove(function(a) {
				ak("body").data("mousex", a.pageX)
			});l.parent().mouseenter(function() {
				var x = ak(this);
				x.addClass("over");
				var v = x.offset();
				var p = ak("body").data("mousex") - v.left;
				var w = x.width();
				var q = x.find(".bullet:first").outerWidth(true);
				var y = q * g.find(">ul:first >li").length;
				var h = y - w + 15;
				var n = h / w;
				p = p - 30;
				var m = 0 - p * n;
				if (m > 0) {
					m = 0
				}
				if (m < 0 - y + w) {
					m = 0 - y + w
				}
				az(x, m, 200)
			});l.parent().mousemove(function() {
				var x = ak(this);
				var v = x.offset();
				var p = ak("body").data("mousex") - v.left;
				var w = x.width();
				var q = x.find(".bullet:first").outerWidth(true);
				var y = q * g.find(">ul:first >li").length - 1;
				var h = y - w + 15;
				var n = h / w;
				p = p - 3;
				if (p < 6) {
					p = 0
				}
				if (p + 3 > w - 6) {
					p = w
				}
				var m = 0 - p * n;
				if (m > 0) {
					m = 0
				}
				if (m < 0 - y + w) {
					m = 0 - y + w
				}
				az(x, m, 0)
			});l.parent().mouseleave(function() {
				var a = ak(this);
				a.removeClass("over");an(g)
			})
		}
	}
	function an(g) {
		var q = g.parent().find(".tp-bullets.tp-thumbs .tp-mask .tp-thumbcontainer");
		var k = q.parent();
		var m = k.offset();
		var j = k.find(".bullet:first").outerWidth(true);
		var p = k.find(".bullet.selected").index() * j;
		var l = k.width();
		var j = k.find(".bullet:first").outerWidth(true);
		var v = j * g.find(">ul:first >li").length;
		var b = v - l;
		var h = b / l;
		var d = 0 - p;
		if (d > 0) {
			d = 0
		}
		if (d < 0 - v + l) {
			d = 0 - v + l
		}
		if (!k.hasClass("over")) {
			az(k, d, 200)
		}
	}
	function az(a, c, b) {
		TweenLite.to(a.find(".tp-thumbcontainer"), 0.2, {
			left : c,
			ease : Power3.easeOut,
			overwrite : "auto"
		})
	}
	function ag(c, a) {
		if (a.navigationType == "bullet" || a.navigationType == "both") {
			c.parent().append('<div class="tp-bullets simplebullets ' + a.navigationStyle + '"></div>')
		}
		var b = c.parent().find(".tp-bullets");
		c.find(">ul:first >li").each(function(d) {
			var g = c.find(">ul:first >li:eq(" + d + ") img:first").attr("src");
			b.append('<div class="bullet"></div>');
			var f = b.find(".bullet:first")
		});b.find(".bullet").each(function(e) {
			var d = ak(this);
			if (e == a.slideamount - 1) {
				d.addClass("last")
			}
			if (e == 0) {
				d.addClass("first")
			}
			d.click(function() {
				var f = false;
				if (a.navigationArrows == "withbullet" || a.navigationArrows == "nexttobullets") {
					if (d.index() - 1 == a.act) {
						f = true
					}
				} else {
					if (d.index() == a.act) {
						f = true
					}
				}
				if (a.transition == 0 && !f) {
					if (a.navigationArrows == "withbullet" || a.navigationArrows == "nexttobullets") {
						a.next = d.index() - 1
					} else {
						a.next = d.index()
					}
					aR(a, c)
				}
			})
		});b.append('<div class="tpclear"></div>');aB(c, a)
	}
	function ar(a, c) {
		var d = a.find(".tp-bullets");
		var b = "";
		var f = c.navigationStyle;
		if (c.navigationArrows == "none") {
			b = "visibility:hidden;display:none"
		}
		c.soloArrowStyle = "default";
		if (c.navigationArrows != "none" && c.navigationArrows != "nexttobullets") {
			f = c.soloArrowStyle
		}
		a.parent().append('<div style="' + b + '" class="tp-leftarrow tparrows ' + f + '"></div>');a.parent().append('<div style="' + b + '" class="tp-rightarrow tparrows ' + f + '"></div>');a.parent().find(".tp-rightarrow").click(function() {
			if (c.transition == 0) {
				if (a.data("showus") != aP && a.data("showus") != -1) {
					c.next = a.data("showus") - 1
				} else {
					c.next = c.next + 1
				}
				a.data("showus", -1);
				if (c.next >= c.slideamount) {
					c.next = 0
				}
				if (c.next < 0) {
					c.next = 0
				}
				if (c.act != c.next) {
					aR(c, a)
				}
			}
		});a.parent().find(".tp-leftarrow").click(function() {
			if (c.transition == 0) {
				c.next = c.next - 1;
				c.leftarrowpressed = 1;
				if (c.next < 0) {
					c.next = c.slideamount - 1
				}
				aR(c, a)
			}
		});aB(a, c)
	}
	function aH(a, b) {
		ak(document).keydown(function(c) {
			if (b.transition == 0 && c.keyCode == 39) {
				if (a.data("showus") != aP && a.data("showus") != -1) {
					b.next = a.data("showus") - 1
				} else {
					b.next = b.next + 1
				}
				a.data("showus", -1);
				if (b.next >= b.slideamount) {
					b.next = 0
				}
				if (b.next < 0) {
					b.next = 0
				}
				if (b.act != b.next) {
					aR(b, a)
				}
			}
			if (b.transition == 0 && c.keyCode == 37) {
				b.next = b.next - 1;
				b.leftarrowpressed = 1;
				if (b.next < 0) {
					b.next = b.slideamount - 1
				}
				aR(b, a)
			}
		});aB(a, b)
	}
	function ai(c, a) {
		if (a.touchenabled == "on") {
			var b = Hammer(c, {
				drag_block_vertical : a.drag_block_vertical,
				drag_lock_to_axis : true,
				swipe_velocity : a.swipe_velocity,
				swipe_max_touches : a.swipe_max_touches,
				swipe_min_touches : a.swipe_min_touches,
				prevent_default : false
			});
			b.on("swipeleft", function() {
				if (a.transition == 0) {
					a.next = a.next + 1;
					if (a.next == a.slideamount) {
						a.next = 0
					}
					aR(a, c)
				}
			});b.on("swiperight", function() {
				if (a.transition == 0) {
					a.next = a.next - 1;
					a.leftarrowpressed = 1;
					if (a.next < 0) {
						a.next = a.slideamount - 1
					}
					aR(a, c)
				}
			});b.on("swipeup", function() {
				ak("html, body").animate({
					scrollTop : c.offset().top + c.height() + "px"
				})
			});b.on("swipedown", function() {
				ak("html, body").animate({
					scrollTop : c.offset().top - ak(window).height() + "px"
				})
			})
		}
	}
	function aT(a, d) {
		var b = a.parent().find(".tp-bullets");
		var c = a.parent().find(".tparrows");
		if (b == null) {
			a.append('<div class=".tp-bullets"></div>');
			var b = a.parent().find(".tp-bullets")
		}
		if (c == null) {
			a.append('<div class=".tparrows"></div>');
			var c = a.parent().find(".tparrows")
		}
		a.data("hidethumbs", d.hideThumbs);b.addClass("hidebullets");c.addClass("hidearrows");
		if (aN()) {
			a.hammer().on("touch", function() {
				a.addClass("hovered");
				if (d.onHoverStop == "on") {
					a.trigger("stoptimer")
				}
				clearTimeout(a.data("hidethumbs"));b.removeClass("hidebullets");c.removeClass("hidearrows")
			});a.hammer().on("release", function() {
				a.removeClass("hovered");a.trigger("playtimer");
				if (!a.hasClass("hovered") && !b.hasClass("hovered")) {
					a.data("hidethumbs", setTimeout(function() {
						b.addClass("hidebullets");c.addClass("hidearrows");a.trigger("playtimer")
					}, d.hideNavDelayOnMobile))
				}
			})
		} else {
			b.hover(function() {
				d.overnav = true;
				if (d.onHoverStop == "on") {
					a.trigger("stoptimer")
				}
				b.addClass("hovered");clearTimeout(a.data("hidethumbs"));b.removeClass("hidebullets");c.removeClass("hidearrows")
			}, function() {
				d.overnav = false;a.trigger("playtimer");b.removeClass("hovered");
				if (!a.hasClass("hovered") && !b.hasClass("hovered")) {
					a.data("hidethumbs", setTimeout(function() {
						b.addClass("hidebullets");c.addClass("hidearrows")
					}, d.hideThumbs))
				}
			});c.hover(function() {
				d.overnav = true;
				if (d.onHoverStop == "on") {
					a.trigger("stoptimer")
				}
				b.addClass("hovered");clearTimeout(a.data("hidethumbs"));b.removeClass("hidebullets");c.removeClass("hidearrows")
			}, function() {
				d.overnav = false;a.trigger("playtimer");b.removeClass("hovered")
			});a.on("mouseenter", function() {
				a.addClass("hovered");
				if (d.onHoverStop == "on") {
					a.trigger("stoptimer")
				}
				clearTimeout(a.data("hidethumbs"));b.removeClass("hidebullets");c.removeClass("hidearrows")
			});a.on("mouseleave", function() {
				a.removeClass("hovered");a.trigger("playtimer");
				if (!a.hasClass("hovered") && !b.hasClass("hovered")) {
					a.data("hidethumbs", setTimeout(function() {
						b.addClass("hidebullets");c.addClass("hidearrows")
					}, d.hideThumbs))
				}
			})
		}
	}
	function aB(h, d) {
		var f = h.parent();
		var c = f.find(".tp-bullets");
		if (d.navigationType == "thumb") {
			c.find(".thumb").each(function(k) {
				var a = ak(this);
				a.css({
					width : d.thumbWidth * d.bw + "px",
					height : d.thumbHeight * d.bh + "px"
				})
			});
			var g = c.find(".tp-mask");
			g.width(d.thumbWidth * d.thumbAmount * d.bw);g.height(d.thumbHeight * d.bh);g.parent().width(d.thumbWidth * d.thumbAmount * d.bw);g.parent().height(d.thumbHeight * d.bh)
		}
		var e = f.find(".tp-leftarrow");
		var j = f.find(".tp-rightarrow");
		if (d.navigationType == "thumb" && d.navigationArrows == "nexttobullets") {
			d.navigationArrows = "solo"
		}
		if (d.navigationArrows == "nexttobullets") {
			e.prependTo(c).css({
				"float" : "left"
			});j.insertBefore(c.find(".tpclear")).css({
				"float" : "left"
			})
		}
		var b = 0;
		if (d.forceFullWidth == "on") {
			b = 0 - d.container.parent().offset().left
		}
		if (d.navigationArrows != "none" && d.navigationArrows != "nexttobullets") {
			e.css({
				position : "absolute"
			});j.css({
				position : "absolute"
			});
			if (d.soloArrowLeftValign == "center") {
				e.css({
					top : "50%",
					marginTop : d.soloArrowLeftVOffset - Math.round(e.innerHeight() / 2) + "px"
				})
			}
			if (d.soloArrowLeftValign == "bottom") {
				e.css({
					top : "auto",
					bottom : 0 + d.soloArrowLeftVOffset + "px"
				})
			}
			if (d.soloArrowLeftValign == "top") {
				e.css({
					bottom : "auto",
					top : 0 + d.soloArrowLeftVOffset + "px"
				})
			}
			if (d.soloArrowLeftHalign == "center") {
				e.css({
					left : "50%",
					marginLeft : b + d.soloArrowLeftHOffset - Math.round(e.innerWidth() / 2) + "px"
				})
			}
			if (d.soloArrowLeftHalign == "left") {
				e.css({
					left : 0 + d.soloArrowLeftHOffset + b + "px"
				})
			}
			if (d.soloArrowLeftHalign == "right") {
				e.css({
					right : 0 + d.soloArrowLeftHOffset - b + "px"
				})
			}
			if (d.soloArrowRightValign == "center") {
				j.css({
					top : "50%",
					marginTop : d.soloArrowRightVOffset - Math.round(j.innerHeight() / 2) + "px"
				})
			}
			if (d.soloArrowRightValign == "bottom") {
				j.css({
					top : "auto",
					bottom : 0 + d.soloArrowRightVOffset + "px"
				})
			}
			if (d.soloArrowRightValign == "top") {
				j.css({
					bottom : "auto",
					top : 0 + d.soloArrowRightVOffset + "px"
				})
			}
			if (d.soloArrowRightHalign == "center") {
				j.css({
					left : "50%",
					marginLeft : b + d.soloArrowRightHOffset - Math.round(j.innerWidth() / 2) + "px"
				})
			}
			if (d.soloArrowRightHalign == "left") {
				j.css({
					left : 0 + d.soloArrowRightHOffset + b + "px"
				})
			}
			if (d.soloArrowRightHalign == "right") {
				j.css({
					right : 0 + d.soloArrowRightHOffset - b + "px"
				})
			}
			if (e.position() != null) {
				e.css({
					top : Math.round(parseInt(e.position().top, 0)) + "px"
				})
			}
			if (j.position() != null) {
				j.css({
					top : Math.round(parseInt(j.position().top, 0)) + "px"
				})
			}
		}
		if (d.navigationArrows == "none") {
			e.css({
				visibility : "hidden"
			});j.css({
				visibility : "hidden"
			})
		}
		if (d.navigationVAlign == "center") {
			c.css({
				top : "50%",
				marginTop : d.navigationVOffset - Math.round(c.innerHeight() / 2) + "px"
			})
		}
		if (d.navigationVAlign == "bottom") {
			c.css({
				bottom : 0 + d.navigationVOffset + "px"
			})
		}
		if (d.navigationVAlign == "top") {
			c.css({
				top : 0 + d.navigationVOffset + "px"
			})
		}
		if (d.navigationHAlign == "center") {
			c.css({
				left : "50%",
				marginLeft : b + d.navigationHOffset - Math.round(c.innerWidth() / 2) + "px"
			})
		}
		if (d.navigationHAlign == "left") {
			c.css({
				left : 0 + d.navigationHOffset + b + "px"
			})
		}
		if (d.navigationHAlign == "right") {
			c.css({
				right : 0 + d.navigationHOffset - b + "px"
			})
		}
	}
	function ap(b, d) {
		d.container.closest(".forcefullwidth_wrapper_tp_banner").find(".tp-fullwidth-forcer").css({
			height : d.container.height()
		});d.container.closest(".rev_slider_wrapper").css({
			height : d.container.height()
		});
		d.width = parseInt(d.container.width(), 0);
		d.height = parseInt(d.container.height(), 0);
		d.bw = d.width / d.startwidth;
		d.bh = d.height / d.startheight;
		if (d.bh > d.bw) {
			d.bh = d.bw
		}
		if (d.bh < d.bw) {
			d.bw = d.bh
		}
		if (d.bw < d.bh) {
			d.bh = d.bw
		}
		if (d.bh > 1) {
			d.bw = 1;
			d.bh = 1
		}
		if (d.bw > 1) {
			d.bw = 1;
			d.bh = 1
		}
		d.height = Math.round(d.startheight * (d.width / d.startwidth));
		if (d.height > d.startheight && d.autoHeight != "on") {
			d.height = d.startheight
		}
		if (d.fullScreen == "on") {
			d.height = d.bw * d.startheight;
			var a = d.container.parent().width();
			var e = ak(window).height();
			if (d.fullScreenOffsetContainer != aP) {
				try {
					var c = d.fullScreenOffsetContainer.split(",");
					ak.each(c, function(h, g) {
						e = e - ak(g).outerHeight(true);
						if (e < d.minFullScreenHeight) {
							e = d.minFullScreenHeight
						}
					})
				} catch (f) {}
			}
			d.container.parent().height(e);d.container.css({
				height : "100%"
			});
			d.height = e
		} else {
			d.container.height(d.height)
		}
		d.slotw = Math.ceil(d.width / d.slots);
		if (d.fullSreen == "on") {
			d.sloth = Math.ceil(ak(window).height() / d.slots)
		} else {
			d.sloth = Math.ceil(d.height / d.slots)
		}
		if (d.autoHeight == "on") {
			d.sloth = Math.ceil(b.height() / d.slots)
		}
	}
	function aZ(a, b) {
		a.find(".tp-caption").each(function() {
			ak(this).addClass(ak(this).data("transition"));ak(this).addClass("start")
		});a.find(">ul:first").css({
			overflow : "hidden",
			width : "100%",
			height : "100%",
			maxHeight : a.parent().css("maxHeight")
		});
		if (b.autoHeight == "on") {
			a.find(">ul:first").css({
				overflow : "hidden",
				width : "100%",
				height : "100%",
				maxHeight : "none"
			});a.css({
				maxHeight : "none"
			});a.parent().css({
				maxHeight : "none"
			})
		}
		a.find(">ul:first >li").each(function(d) {
			var f = ak(this);
			f.css({
				width : "100%",
				height : "100%",
				overflow : "hidden"
			});
			if (f.data("link") != aP) {
				var c = f.data("link");
				var g = "_self";
				var e = 60;
				if (f.data("slideindex") == "back") {
					e = 0
				}
				var h = f.data("linktoslide");
				if (f.data("target") != aP) {
					g = f.data("target")
				}
				if (c == "slide") {
					f.append('<div class="tp-caption sft slidelink" style="width:100%;height:100%;z-index:' + e + ';" data-x="0" data-y="0" data-linktoslide="' + h + '" data-start="0"><a style="width:100%;height:100%;display:block"><span style="width:100%;height:100%;display:block"></span></a></div>')
				} else {
					h = "no";f.append('<div class="tp-caption sft slidelink" style="width:100%;height:100%;z-index:' + e + ';" data-x="0" data-y="0" data-linktoslide="' + h + '" data-start="0"><a style="width:100%;height:100%;display:block" target="' + g + '" href="' + c + '"><span style="width:100%;height:100%;display:block"></span></a></div>')
				}
			}
		});a.parent().css({
			overflow : "visible"
		});a.find(">ul:first >li >img").each(function(k) {
			var h = ak(this);
			h.addClass("defaultimg");
			if (h.data("lazyload") != aP && h.data("lazydone") != 1) {
			} else {
				ap(h, b)
			}
			h.wrap('<div class="slotholder" style="width:100%;height:100%;"data-duration="' + h.data("duration") + '"data-zoomstart="' + h.data("zoomstart") + '"data-zoomend="' + h.data("zoomend") + '"data-rotationstart="' + h.data("rotationstart") + '"data-rotationend="' + h.data("rotationend") + '"data-ease="' + h.data("ease") + '"data-duration="' + h.data("duration") + '"data-bgpositionend="' + h.data("bgpositionend") + '"data-bgposition="' + h.data("bgposition") + '"data-duration="' + h.data("duration") + '"data-kenburns="' + h.data("kenburns") + '"data-easeme="' + h.data("ease") + '"data-bgfit="' + h.data("bgfit") + '"data-bgfitend="' + h.data("bgfitend") + '"data-owidth="' + h.data("owidth") + '"data-oheight="' + h.data("oheight") + '"></div>');
			if (b.dottedOverlay != "none" && b.dottedOverlay != aP) {
				h.closest(".slotholder").append('<div class="tp-dottedoverlay ' + b.dottedOverlay + '"></div>')
			}
			var m = h.attr("src");
			var o = h.data("lazyload");
			var d = h.data("bgfit");
			var g = h.data("bgrepeat");
			var j = h.data("bgposition");
			if (d == aP) {
				d = "cover"
			}
			if (g == aP) {
				g = "no-repeat"
			}
			if (j == aP) {
				j = "center center"
			}
			var e = h.closest(".slotholder");
			h.replaceWith('<div class="tp-bgimg defaultimg" data-lazyload="' + h.data("lazyload") + '" data-bgfit="' + d + '"data-bgposition="' + j + '" data-bgrepeat="' + g + '" data-lazydone="' + h.data("lazydone") + '" src="' + m + '" data-src="' + m + '" style="background-color:' + h.css("backgroundColor") + ";background-repeat:" + g + ";background-image:url(" + m + ");background-size:" + d + ";background-position:" + j + ';width:100%;height:100%;"></div>');
			if (aF(8)) {
				e.find(".tp-bgimg").css({
					backgroundImage : "none",
					"background-image" : "none"
				});e.find(".tp-bgimg").append('<img class="ieeightfallbackimage defaultimg" src="' + m + '" style="width:100%">')
			}
			h.css({
				opacity : 0
			});h.data("li-id", k)
		})
	}
	function ae(q, C, E, z) {
		var F = q;
		var H = F.find(".defaultimg");
		var g = F.data("zoomstart");
		var t = F.data("rotationstart");
		if (H.data("currotate") != aP) {
			t = H.data("currotate")
		}
		if (H.data("curscale") != aP) {
			g = H.data("curscale")
		}
		ap(H, C);var A = H.data("src");
		var k = H.css("background-color");
		var x = C.width;
		var D = C.height;
		if (C.autoHeight == "on") {
			D = C.container.height()
		}
		var o = H.data("fxof");
		if (o == aP) {
			o = 0
		}
		fullyoff = 0;var I = 0;
		var B = H.data("bgfit");
		var K = H.data("bgrepeat");
		var j = H.data("bgposition");
		if (B == aP) {
			B = "cover"
		}
		if (K == aP) {
			K = "no-repeat"
		}
		if (j == aP) {
			j = "center center"
		}
		if (F.data("kenburns") == "on") {
			B = g;
			if (B.toString().length < 4) {
				B = aj(B, F, C)
			}
		}
		if (aF(8)) {
			var J = A;
			A = ""
		}
		if (z == "horizontal") {
			if (!E) {
				var I = 0 - C.slotw
			}
			for (var G = 0; G < C.slots; G++) {
				F.append('<div class="slot" style="position:absolute;top:' + (0 + fullyoff) + "px;left:" + (o + G * C.slotw) + "px;overflow:hidden;width:" + C.slotw + "px;height:" + D + 'px"><div class="slotslide" style="position:absolute;top:0px;left:' + I + "px;width:" + C.slotw + "px;height:" + D + 'px;overflow:hidden;"><div style="background-color:' + k + ";position:absolute;top:0px;left:" + (0 - G * C.slotw) + "px;width:" + x + "px;height:" + D + "px;background-image:url(" + A + ");background-repeat:" + K + ";background-size:" + B + ";background-position:" + j + ';"></div></div></div>');
				if (g != aP && t != aP) {
					TweenLite.set(F.find(".slot").last(), {
						rotationZ : t
					})
				}
				if (aF(8)) {
					F.find(".slot ").last().find(".slotslide").append('<img class="ieeightfallbackimage" src="' + J + '" style="width:100%;height:auto">');al(F, C)
				}
			}
		} else {
			if (!E) {
				var I = 0 - C.sloth
			}
			for (var G = 0; G < C.slots + 2; G++) {
				F.append('<div class="slot" style="position:absolute;top:' + (fullyoff + G * C.sloth) + "px;left:" + o + "px;overflow:hidden;width:" + x + "px;height:" + C.sloth + 'px"><div class="slotslide" style="position:absolute;top:' + I + "px;left:0px;width:" + x + "px;height:" + C.sloth + 'px;overflow:hidden;"><div style="background-color:' + k + ";position:absolute;top:" + (0 - G * C.sloth) + "px;left:0px;width:" + x + "px;height:" + D + "px;background-image:url(" + A + ");background-repeat:" + K + ";background-size:" + B + ";background-position:" + j + ';"></div></div></div>');
				if (g != aP && t != aP) {
					TweenLite.set(F.find(".slot").last(), {
						rotationZ : t
					})
				}
				if (aF(8)) {
					F.find(".slot ").last().find(".slotslide").append('<img class="ieeightfallbackimage" src="' + J + '" style="width:100%;height:auto;">');al(F, C)
				}
			}
		}
	}
	function aV(q, D, G) {
		var A = q;
		var H = A.find(".defaultimg");
		var K = A.data("zoomstart");
		var g = A.data("rotationstart");
		if (H.data("currotate") != aP) {
			g = H.data("currotate")
		}
		if (H.data("curscale") != aP) {
			K = H.data("curscale") * 100
		}
		ap(H, D);var t = H.data("src");
		var B = H.css("backgroundColor");
		var k = D.width;
		var z = D.height;
		if (D.autoHeight == "on") {
			z = D.container.height()
		}
		var F = H.data("fxof");
		if (F == aP) {
			F = 0
		}
		fullyoff = 0;var o = 0;
		if (aF(8)) {
			var L = t;
			t = ""
		}
		var C = 0;
		if (D.sloth > D.slotw) {
			C = D.sloth
		} else {
			C = D.slotw
		}
		if (!G) {
			var o = 0 - C
		}
		D.slotw = C;
		D.sloth = C;var P = 0;
		var j = 0;
		var M = H.data("bgfit");
		var I = H.data("bgrepeat");
		var O = H.data("bgposition");
		if (M == aP) {
			M = "cover"
		}
		if (I == aP) {
			I = "no-repeat"
		}
		if (O == aP) {
			O = "center center"
		}
		if (A.data("kenburns") == "on") {
			M = K;
			if (M.toString().length < 4) {
				M = aj(M, A, D)
			}
		}
		for (var J = 0; J < D.slots; J++) {
			j = 0;
			for (var E = 0; E < D.slots; E++) {
				A.append('<div class="slot" style="position:absolute;top:' + (fullyoff + j) + "px;left:" + (F + P) + "px;width:" + C + "px;height:" + C + 'px;overflow:hidden;"><div class="slotslide" data-x="' + P + '" data-y="' + j + '" style="position:absolute;top:' + 0 + "px;left:" + 0 + "px;width:" + C + "px;height:" + C + 'px;overflow:hidden;"><div style="position:absolute;top:' + (0 - j) + "px;left:" + (0 - P) + "px;width:" + k + "px;height:" + z + "px;background-color:" + B + ";background-image:url(" + t + ");background-repeat:" + I + ";background-size:" + M + ";background-position:" + O + ';"></div></div></div>');
				j = j + C;
				if (aF(8)) {
					A.find(".slot ").last().find(".slotslide").append('<img src="' + L + '">');al(A, D)
				}
				if (K != aP && g != aP) {
					TweenLite.set(A.find(".slot").last(), {
						rotationZ : g
					})
				}
			}
			P = P + C
		}
	}
	function al(a, f) {
		if (aF(8)) {
			var c = a.find(".ieeightfallbackimage");
			var d = c.width(),
				b = c.height();
			if (f.startwidth / f.startheight < a.data("owidth") / a.data("oheight")) {
				c.css({
					width : "auto",
					height : "100%"
				})
			} else {
				c.css({
					width : "100%",
					height : "auto"
				})
			}
			setTimeout(function() {
				var g = c.width(),
					e = c.height();
				if (a.data("bgposition") == "center center") {
					c.css({
						position : "absolute",
						top : f.height / 2 - e / 2 + "px",
						left : f.width / 2 - g / 2 + "px"
					})
				}
				if (a.data("bgposition") == "center top" || a.data("bgposition") == "top center") {
					c.css({
						position : "absolute",
						top : "0px",
						left : f.width / 2 - g / 2 + "px"
					})
				}
				if (a.data("bgposition") == "center bottom" || a.data("bgposition") == "bottom center") {
					c.css({
						position : "absolute",
						bottom : "0px",
						left : f.width / 2 - g / 2 + "px"
					})
				}
				if (a.data("bgposition") == "right top" || a.data("bgposition") == "top right") {
					c.css({
						position : "absolute",
						top : "0px",
						right : "0px"
					})
				}
				if (a.data("bgposition") == "right bottom" || a.data("bgposition") == "bottom right") {
					c.css({
						position : "absolute",
						bottom : "0px",
						right : "0px"
					})
				}
				if (a.data("bgposition") == "right center" || a.data("bgposition") == "center right") {
					c.css({
						position : "absolute",
						top : f.height / 2 - e / 2 + "px",
						right : "0px"
					})
				}
				if (a.data("bgposition") == "left bottom" || a.data("bgposition") == "bottom left") {
					c.css({
						position : "absolute",
						bottom : "0px",
						left : "0px"
					})
				}
				if (a.data("bgposition") == "left center" || a.data("bgposition") == "center left") {
					c.css({
						position : "absolute",
						top : f.height / 2 - e / 2 + "px",
						left : "0px"
					})
				}
			}, 20)
		}
	}
	function aO(b, c, a) {
		if (a == aP) {
			a == 80
		}
		setTimeout(function() {
			b.find(".slotholder .slot").each(function() {
				clearTimeout(ak(this).data("tout"));ak(this).remove()
			});
			c.transition = 0
		}, a)
	}
	function aX(a, b) {
		a.find("img, .defaultimg").each(function(d) {
			var c = ak(this);
			if (c.data("lazyload") != c.attr("src") && b < 3 && c.data("lazyload") != aP && c.data("lazyload") != "undefined") {
				if (c.data("lazyload") != aP && c.data("lazyload") != "undefined") {
					c.attr("src", c.data("lazyload"));
					var e = new Image;
					e.onload = function(f) {
						c.data("lazydone", 1);
						if (c.hasClass("defaultimg")) {
							aQ(c, e)
						}
					};
					e.error = function() {
						c.data("lazydone", 1)
					};
					e.src = c.attr("src");
					if (e.complete) {
						if (c.hasClass("defaultimg")) {
							aQ(c, e)
						}
						c.data("lazydone", 1)
					}
				}
			} else {
				if ((c.data("lazyload") === aP || c.data("lazyload") === "undefined") && c.data("lazydone") != 1) {
					var e = new Image;
					e.onload = function() {
						if (c.hasClass("defaultimg")) {
							aQ(c, e)
						}
						c.data("lazydone", 1)
					};
					e.error = function() {
						c.data("lazydone", 1)
					};
					if (c.attr("src") != aP && c.attr("src") != "undefined") {
						e.src = c.attr("src")
					} else {
						e.src = c.data("src")
					}
					if (e.complete) {
						if (c.hasClass("defaultimg")) {
							aQ(c, e)
						}
						c.data("lazydone", 1)
					}
				}
			}
		})
	}
	function aQ(a, f) {
		var c = a.closest("li");
		var d = f.width;
		var b = f.height;
		c.data("owidth", d);c.data("oheight", b);c.find(".slotholder").data("owidth", d);c.find(".slotholder").data("oheight", b);c.data("loadeddone", 1)
	}
	function ah(a, c) {
		try {
			var d = a.find(">ul:first-child >li:eq(" + c.act + ")")
		} catch (b) {
			var d = a.find(">ul:first-child >li:eq(1)")
		}
		c.lastslide = c.act;var f = a.find(">ul:first-child >li:eq(" + c.next + ")");
		var g = f.find(".defaultimg");
		c.bannertimeronpause = true;a.trigger("stoptimer");
		c.cd = 0;
		if (g.data("lazyload") != aP && g.data("lazyload") != "undefined" && g.data("lazydone") != 1) {
			if (!aF(8)) {
				g.css({
					backgroundImage : 'url("' + f.find(".defaultimg").data("lazyload") + '")'
				})
			} else {
				g.attr("src", f.find(".defaultimg").data("lazyload"))
			}
			g.data("src", f.find(".defaultimg").data("lazyload"));g.data("lazydone", 1);g.data("orgw", 0);f.data("loadeddone", 1);TweenLite.set(a.find(".tp-loader"), {
				display : "block",
				opacity : 0
			});TweenLite.to(a.find(".tp-loader"), 0.3, {
				autoAlpha : 1
			});aE(f, function() {
				ax(c, g, a)
			}, c)
		} else {
			if (f.data("loadeddone") === aP) {
				f.data("loadeddone", 1);aE(f, function() {
					ax(c, g, a)
				}, c)
			} else {
				ax(c, g, a)
			}
		}
	}
	function ax(a, c, b) {
		a.bannertimeronpause = false;
		a.cd = 0;b.trigger("nulltimer");TweenLite.to(b.find(".tp-loader"), 0.3, {
			autoAlpha : 0
		});ap(c, a);aB(b, a);ap(c, a);aA(b, a)
	}
	function aA(bm, bu) {
		function bH() {
			ak.each(bF, function(a, c) {
				if (c[0] == br || c[8] == br) {
					bj = c[1];
					V = c[2];
					bJ = a4
				}
				a4 = a4 + 1
			})
		}
		bm.trigger("revolution.slide.onbeforeswap");
		bu.transition = 1;
		bu.videoplaying = false;try {
			var bc = bm.find(">ul:first-child >li:eq(" + bu.act + ")")
		} catch (bx) {
			var bc = bm.find(">ul:first-child >li:eq(1)")
		}
		bu.lastslide = bu.act;var bC = bm.find(">ul:first-child >li:eq(" + bu.next + ")");
		var o = bc.find(".slotholder");
		var a6 = bC.find(".slotholder");
		bc.css({
			visibility : "visible"
		});bC.css({
			visibility : "visible"
		});
		if (a6.data("kenburns") == "on") {
			aC(bm, bu)
		}
		if (bu.ie) {
			if (br == "boxfade") {
				br = "boxslide"
			}
			if (br == "slotfade-vertical") {
				br = "slotzoom-vertical"
			}
			if (br == "slotfade-horizontal") {
				br = "slotzoom-horizontal"
			}
		}
		if (bC.data("delay") != aP) {
			bu.cd = 0;
			bu.delay = bC.data("delay")
		} else {
			bu.delay = bu.origcd
		}
		bm.trigger("restarttimer");bc.css({
			left : "0px",
			top : "0px"
		});bC.css({
			left : "0px",
			top : "0px"
		});
		if (bC.data("differentissplayed") == "prepared") {
			bC.data("differentissplayed", "done");bC.data("transition", bC.data("savedtransition"));bC.data("slotamount", bC.data("savedslotamount"));bC.data("masterspeed", bC.data("savedmasterspeed"))
		}
		if (bC.data("fstransition") != aP && bC.data("differentissplayed") != "done") {
			bC.data("savedtransition", bC.data("transition"));bC.data("savedslotamount", bC.data("slotamount"));bC.data("savedmasterspeed", bC.data("masterspeed"));bC.data("transition", bC.data("fstransition"));bC.data("slotamount", bC.data("fsslotamount"));bC.data("masterspeed", bC.data("fsmasterspeed"));bC.data("differentissplayed", "prepared")
		}
		var bj = 0;
		var M = bC.data("transition").split(",");
		var ba = bC.data("nexttransid");
		if (ba == aP) {
			ba = 0;bC.data("nexttransid", ba)
		} else {
			ba = ba + 1;
			if (ba == M.length) {
				ba = 0
			}
			bC.data("nexttransid", ba)
		}
		var br = M[ba];
		var V = 0;
		if (br == "slidehorizontal") {
			br = "slideleft";
			if (bu.leftarrowpressed == 1) {
				br = "slideright"
			}
		}
		if (br == "slidevertical") {
			br = "slideup";
			if (bu.leftarrowpressed == 1) {
				br = "slidedown"
			}
		}
		var bF = [ [ "boxslide", 0, 1, 10, 0, "box", false, null, 0 ], [ "boxfade", 1, 0, 10, 0, "box", false, null, 1 ], [ "slotslide-horizontal", 2, 0, 0, 200, "horizontal", true, false, 2 ], [ "slotslide-vertical", 3, 0, 0, 200, "vertical", true, false, 3 ], [ "curtain-1", 4, 3, 0, 0, "horizontal", true, true, 4 ], [ "curtain-2", 5, 3, 0, 0, "horizontal", true, true, 5 ], [ "curtain-3", 6, 3, 25, 0, "horizontal", true, true, 6 ], [ "slotzoom-horizontal", 7, 0, 0, 400, "horizontal", true, true, 7 ], [ "slotzoom-vertical", 8, 0, 0, 0, "vertical", true, true, 8 ], [ "slotfade-horizontal", 9, 0, 0, 500, "horizontal", true, null, 9 ], [ "slotfade-vertical", 10, 0, 0, 500, "vertical", true, null, 10 ], [ "fade", 11, 0, 1, 300, "horizontal", true, null, 11 ], [ "slideleft", 12, 0, 1, 0, "horizontal", true, true, 12 ], [ "slideup", 13, 0, 1, 0, "horizontal", true, true, 13 ], [ "slidedown", 14, 0, 1, 0, "horizontal", true, true, 14 ], [ "slideright", 15, 0, 1, 0, "horizontal", true, true, 15 ], [ "papercut", 16, 0, 0, 600, "", null, null, 16 ], [ "3dcurtain-horizontal", 17, 0, 20, 100, "vertical", false, true, 17 ], [ "3dcurtain-vertical", 18, 0, 10, 100, "horizontal", false, true, 18 ], [ "cubic", 19, 0, 20, 600, "horizontal", false, true, 19 ], [ "cube", 19, 0, 20, 600, "horizontal", false, true, 20 ], [ "flyin", 20, 0, 4, 600, "vertical", false, true, 21 ], [ "turnoff", 21, 0, 1, 1600, "horizontal", false, true, 22 ], [ "incube", 22, 0, 20, 600, "horizontal", false, true, 23 ], [ "cubic-horizontal", 23, 0, 20, 500, "vertical", false, true, 24 ], [ "cube-horizontal", 23, 0, 20, 500, "vertical", false, true, 25 ], [ "incube-horizontal", 24, 0, 20, 500, "vertical", false, true, 26 ], [ "turnoff-vertical", 25, 0, 1, 1600, "horizontal", false, true, 27 ], [ "fadefromright", 12, 1, 1, 0, "horizontal", true, true, 28 ], [ "fadefromleft", 15, 1, 1, 0, "horizontal", true, true, 29 ], [ "fadefromtop", 14, 1, 1, 0, "horizontal", true, true, 30 ], [ "fadefrombottom", 13, 1, 1, 0, "horizontal", true, true, 31 ], [ "fadetoleftfadefromright", 12, 2, 1, 0, "horizontal", true, true, 32 ], [ "fadetorightfadetoleft", 15, 2, 1, 0, "horizontal", true, true, 33 ], [ "fadetobottomfadefromtop", 14, 2, 1, 0, "horizontal", true, true, 34 ], [ "fadetotopfadefrombottom", 13, 2, 1, 0, "horizontal", true, true, 35 ], [ "parallaxtoright", 12, 3, 1, 0, "horizontal", true, true, 36 ], [ "parallaxtoleft", 15, 3, 1, 0, "horizontal", true, true, 37 ], [ "parallaxtotop", 14, 3, 1, 0, "horizontal", true, true, 38 ], [ "parallaxtobottom", 13, 3, 1, 0, "horizontal", true, true, 39 ], [ "scaledownfromright", 12, 4, 1, 0, "horizontal", true, true, 40 ], [ "scaledownfromleft", 15, 4, 1, 0, "horizontal", true, true, 41 ], [ "scaledownfromtop", 14, 4, 1, 0, "horizontal", true, true, 42 ], [ "scaledownfrombottom", 13, 4, 1, 0, "horizontal", true, true, 43 ], [ "zoomout", 13, 5, 1, 0, "horizontal", true, true, 44 ], [ "zoomin", 13, 6, 1, 0, "horizontal", true, true, 45 ], [ "notransition", 26, 0, 1, 0, "horizontal", true, null, 46 ] ];
		var bl = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45 ];
		var a8 = [ 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27 ];
		var bj = 0;
		var V = 1;
		var bJ = 0;
		var a4 = 0;
		var by = new Array;
		if (br == "random") {
			br = Math.round(Math.random() * bF.length - 1);
			if (br > bF.length - 1) {
				br = bF.length - 1
			}
		}
		if (br == "random-static") {
			br = Math.round(Math.random() * bl.length - 1);
			if (br > bl.length - 1) {
				br = bl.length - 1
			}
			br = bl[br]
		}
		if (br == "random-premium") {
			br = Math.round(Math.random() * a8.length - 1);
			if (br > a8.length - 1) {
				br = a8.length - 1
			}
			br = a8[br]
		}
		if (bu.isJoomla == true && br == 16) {
			br = Math.round(Math.random() * a8.length - 2) + 1;
			if (br > a8.length - 1) {
				br = a8.length - 1
			}
			br = a8[br]
		}
		bH();
		if (aF(8) && bj > 15 && bj < 28) {
			br = Math.round(Math.random() * bl.length - 1);
			if (br > bl.length - 1) {
				br = bl.length - 1
			}
			br = bl[br];
			a4 = 0;bH()
		}
		var bA = -1;
		if (bu.leftarrowpressed == 1 || bu.act > bu.next) {
			bA = 1
		}
		bu.leftarrowpressed = 0;
		if (bj > 26) {
			bj = 26
		}
		if (bj < 0) {
			bj = 0
		}
		var bn = 300;
		if (bC.data("masterspeed") != aP && bC.data("masterspeed") > 99 && bC.data("masterspeed") < 4001) {
			bn = bC.data("masterspeed")
		}
		by = bF[bJ];bm.parent().find(".bullet").each(function() {
			var a = ak(this);
			a.removeClass("selected");
			if (bu.navigationArrows == "withbullet" || bu.navigationArrows == "nexttobullets") {
				if (a.index() - 1 == bu.next) {
					a.addClass("selected")
				}
			} else {
				if (a.index() == bu.next) {
					a.addClass("selected")
				}
			}
		});bm.find(">li").each(function() {
			var a = ak(this);
			if (a.index != bu.act && a.index != bu.next) {
				a.css({
					"z-index" : 16
				})
			}
		});bc.css({
			"z-index" : 18
		});bC.css({
			"z-index" : 20
		});bC.css({
			opacity : 0
		});
		if (bc.index() != bC.index() && bu.firststart != 1) {
			aK(bc, bu)
		}
		aU(bC, bu);
		if (bC.data("slotamount") == aP || bC.data("slotamount") < 1) {
			bu.slots = Math.round(Math.random() * 12 + 4);
			if (br == "boxslide") {
				bu.slots = Math.round(Math.random() * 6 + 3)
			} else {
				if (br == "flyin") {
					bu.slots = Math.round(Math.random() * 4 + 1)
				}
			}
		} else {
			bu.slots = bC.data("slotamount")
		}
		if (bC.data("rotate") == aP) {
			bu.rotate = 0
		} else {
			if (bC.data("rotate") == 999) {
				bu.rotate = Math.round(Math.random() * 360)
			} else {
				bu.rotate = bC.data("rotate")
			}
		}
		if (!ak.support.transition || bu.ie || bu.ie9) {
			bu.rotate = 0
		}
		if (bu.firststart == 1) {
			bc.css({
				opacity : 0
			});
			bu.firststart = 0
		}
		bn = bn + by[4];
		if ((bj == 4 || bj == 5 || bj == 6) && bu.slots < 3) {
			bu.slots = 3
		}
		if (by[3] != 0) {
			bu.slots = Math.min(bu.slots, by[3])
		}
		if (bj == 9) {
			bu.slots = bu.width / 20
		}
		if (bj == 10) {
			bu.slots = bu.height / 20
		}
		if (by[5] == "box") {
			if (by[7] != null) {
				aV(o, bu, by[7])
			}
			if (by[6] != null) {
				aV(a6, bu, by[6])
			}
		} else {
			if (by[5] == "vertical" || by[5] == "horizontal") {
				if (by[7] != null) {
					ae(o, bu, by[7], by[5])
				}
				if (by[6] != null) {
					ae(a6, bu, by[6], by[5])
				}
			}
		}
		if (bj < 12 || bj > 16) {
			bC.css({
				opacity : 1
			})
		}
		if (bj == 0) {
			a6.find(".defaultimg").css({
				opacity : 0
			});
			var Q = Math.ceil(bu.height / bu.sloth);
			var bh = 0;
			a6.find(".slotslide").each(function(c) {
				var a = ak(this);
				bh = bh + 1;
				if (bh == Q) {
					bh = 0
				}
				TweenLite.fromTo(a, bn / 600, {
					opacity : 0,
					top : 0 - bu.sloth,
					left : 0 - bu.slotw,
					rotation : bu.rotate
				}, {
					opacity : 1,
					transformPerspective : 600,
					top : 0,
					left : 0,
					scale : 1,
					rotation : 0,
					delay : (c * 15 + bh * 30) / 1500,
					ease : Power2.easeOut,
					onComplete : function() {
						if (c == bu.slots * bu.slots - 1) {
							ao(bm, bu, a6, o, bC, bc)
						}
					}
				})
			})
		}
		if (bj == 1) {
			a6.find(".defaultimg").css({
				opacity : 0
			});
			var bk;
			a6.find(".slotslide").each(function(c) {
				var a = ak(this);
				rand = Math.random() * bn + 300;
				rand2 = Math.random() * 500 + 200;
				if (rand + rand2 > bk) {
					bk = rand2 + rand2
				}
				TweenLite.fromTo(a, rand / 1000, {
					opacity : 0,
					transformPerspective : 600,
					rotation : bu.rotate
				}, {
					opacity : 1,
					ease : Power2.easeInOut,
					rotation : 0,
					delay : rand2 / 1000
				})
			});setTimeout(function() {
				ao(bm, bu, a6, o, bC, bc)
			}, bn + 300)
		}
		if (bj == 2) {
			a6.find(".defaultimg").css({
				opacity : 0
			});o.find(".slotslide").each(function() {
				var a = ak(this);
				TweenLite.to(a, bn / 1000, {
					left : bu.slotw,
					rotation : 0 - bu.rotate,
					onComplete : function() {
						ao(bm, bu, a6, o, bC, bc)
					}
				})
			});a6.find(".slotslide").each(function() {
				var a = ak(this);
				TweenLite.fromTo(a, bn / 1000, {
					left : 0 - bu.slotw,
					rotation : bu.rotate,
					transformPerspective : 600
				}, {
					left : 0,
					rotation : 0,
					ease : Power2.easeOut,
					onComplete : function() {
						ao(bm, bu, a6, o, bC, bc)
					}
				})
			})
		}
		if (bj == 3) {
			a6.find(".defaultimg").css({
				opacity : 0
			});o.find(".slotslide").each(function() {
				var a = ak(this);
				TweenLite.to(a, bn / 1000, {
					top : bu.sloth,
					rotation : bu.rotate,
					transformPerspective : 600,
					onComplete : function() {
						ao(bm, bu, a6, o, bC, bc)
					}
				})
			});a6.find(".slotslide").each(function() {
				var a = ak(this);
				TweenLite.fromTo(a, bn / 1000, {
					top : 0 - bu.sloth,
					rotation : bu.rotate,
					transformPerspective : 600
				}, {
					top : 0,
					rotation : 0,
					ease : Power2.easeOut,
					onComplete : function() {
						ao(bm, bu, a6, o, bC, bc)
					}
				})
			})
		}
		if (bj == 4 || bj == 5) {
			a6.find(".defaultimg").css({
				opacity : 0
			});setTimeout(function() {
				o.find(".defaultimg").css({
					opacity : 0
				})
			}, 100);
			var t = bn / 1000;
			var bp = t;
			o.find(".slotslide").each(function(d) {
				var c = ak(this);
				var a = d * t / bu.slots;
				if (bj == 5) {
					a = (bu.slots - d - 1) * t / bu.slots / 1.5
				}
				TweenLite.to(c, t * 3, {
					transformPerspective : 600,
					top : 0 + bu.height,
					opacity : 0.5,
					rotation : bu.rotate,
					ease : Power2.easeInOut,
					delay : a
				})
			});a6.find(".slotslide").each(function(d) {
				var c = ak(this);
				var a = d * t / bu.slots;
				if (bj == 5) {
					a = (bu.slots - d - 1) * t / bu.slots / 1.5
				}
				TweenLite.fromTo(c, t * 3, {
					top : 0 - bu.height,
					opacity : 0.5,
					rotation : bu.rotate,
					transformPerspective : 600
				}, {
					top : 0,
					opacity : 1,
					rotation : 0,
					ease : Power2.easeInOut,
					delay : a,
					onComplete : function() {
						if (d == bu.slots - 1) {
							ao(bm, bu, a6, o, bC, bc)
						}
					}
				})
			})
		}
		if (bj == 6) {
			if (bu.slots < 2) {
				bu.slots = 2
			}
			a6.find(".defaultimg").css({
				opacity : 0
			});setTimeout(function() {
				o.find(".defaultimg").css({
					opacity : 0
				})
			}, 100);o.find(".slotslide").each(function(d) {
				var c = ak(this);
				if (d < bu.slots / 2) {
					var a = (d + 2) * 60
				} else {
					var a = (2 + bu.slots - d) * 60
				}
				TweenLite.to(c, (bn + a) / 1000, {
					top : 0 + bu.height,
					opacity : 1,
					rotation : bu.rotate,
					transformPerspective : 600,
					ease : Power2.easeInOut
				})
			});a6.find(".slotslide").each(function(d) {
				var c = ak(this);
				if (d < bu.slots / 2) {
					var a = (d + 2) * 60
				} else {
					var a = (2 + bu.slots - d) * 60
				}
				TweenLite.fromTo(c, (bn + a) / 1000, {
					top : 0 - bu.height,
					opacity : 1,
					rotation : bu.rotate,
					transformPerspective : 600
				}, {
					top : 0,
					opacity : 1,
					rotation : 0,
					ease : Power2.easeInOut,
					onComplete : function() {
						if (d == Math.round(bu.slots / 2)) {
							ao(bm, bu, a6, o, bC, bc)
						}
					}
				})
			})
		}
		if (bj == 7) {
			bn = bn * 2;a6.find(".defaultimg").css({
				opacity : 0
			});setTimeout(function() {
				o.find(".defaultimg").css({
					opacity : 0
				})
			}, 100);o.find(".slotslide").each(function() {
				var a = ak(this).find("div");
				TweenLite.to(a, bn / 1000, {
					left : 0 - bu.slotw / 2 + "px",
					top : 0 - bu.height / 2 + "px",
					width : bu.slotw * 2 + "px",
					height : bu.height * 2 + "px",
					opacity : 0,
					rotation : bu.rotate,
					transformPerspective : 600,
					ease : Power2.easeOut
				})
			});a6.find(".slotslide").each(function(c) {
				var a = ak(this).find("div");
				TweenLite.fromTo(a, bn / 1000, {
					left : 0,
					top : 0,
					opacity : 0,
					transformPerspective : 600
				}, {
					left : 0 - c * bu.slotw + "px",
					ease : Power2.easeOut,
					top : 0 + "px",
					width : bu.width,
					height : bu.height,
					opacity : 1,
					rotation : 0,
					delay : 0.1,
					onComplete : function() {
						ao(bm, bu, a6, o, bC, bc)
					}
				})
			})
		}
		if (bj == 8) {
			bn = bn * 3;a6.find(".defaultimg").css({
				opacity : 0
			});o.find(".slotslide").each(function() {
				var a = ak(this).find("div");
				TweenLite.to(a, bn / 1000, {
					left : 0 - bu.width / 2 + "px",
					top : 0 - bu.sloth / 2 + "px",
					width : bu.width * 2 + "px",
					height : bu.sloth * 2 + "px",
					transformPerspective : 600,
					opacity : 0,
					rotation : bu.rotate
				})
			});a6.find(".slotslide").each(function(c) {
				var a = ak(this).find("div");
				TweenLite.fromTo(a, bn / 1000, {
					left : 0,
					top : 0,
					opacity : 0,
					transformPerspective : 600
				}, {
					left : 0 + "px",
					top : 0 - c * bu.sloth + "px",
					width : a6.find(".defaultimg").data("neww") + "px",
					height : a6.find(".defaultimg").data("newh") + "px",
					opacity : 1,
					rotation : 0,
					onComplete : function() {
						ao(bm, bu, a6, o, bC, bc)
					}
				})
			})
		}
		if (bj == 9 || bj == 10) {
			a6.find(".defaultimg").css({
				opacity : 0
			});
			var e = 0;
			a6.find(".slotslide").each(function(c) {
				var a = ak(this);
				e++;TweenLite.fromTo(a, bn / 1000, {
					opacity : 0,
					transformPerspective : 600,
					left : 0,
					top : 0
				}, {
					opacity : 1,
					ease : Power2.easeInOut,
					delay : c * 4 / 1000
				})
			});setTimeout(function() {
				ao(bm, bu, a6, o, bC, bc)
			}, bn + e * 4)
		}
		if (bj == 11 || bj == 26) {
			a6.find(".defaultimg").css({
				opacity : 0,
				position : "relative"
			});
			var e = 0;
			if (bj == 26) {
				bn = 0
			}
			a6.find(".slotslide").each(function(c) {
				var a = ak(this);
				TweenLite.fromTo(a, bn / 1000, {
					opacity : 0
				}, {
					opacity : 1,
					ease : Power2.easeInOut
				})
			});setTimeout(function() {
				ao(bm, bu, a6, o, bC, bc)
			}, bn + 15)
		}
		if (bj == 12 || bj == 13 || bj == 14 || bj == 15) {
			setTimeout(function() {
				o.find(".defaultimg").css({
					opacity : 0
				})
			}, 100);a6.find(".defaultimg").css({
				opacity : 0
			});
			var a3 = bu.width;
			var bs = bu.height;
			var bb = a6.find(".slotslide");
			if (bu.fullWidth == "on" || bu.fullSreen == "on") {
				a3 = bb.width();
				bs = bb.height()
			}
			var F = 0;
			var bf = 0;
			if (bj == 12) {
				F = a3
			} else {
				if (bj == 15) {
					F = 0 - a3
				} else {
					if (bj == 13) {
						bf = bs
					} else {
						if (bj == 14) {
							bf = 0 - bs
						}
					}
				}
			}
			var bd = 1;
			var bt = 1;
			var bv = 1;
			var bD = Power2.easeInOut;
			var bL = Power2.easeInOut;
			var bG = bn / 1000;
			var bI = bG;
			if (V == 1) {
				bd = 0
			}
			if (V == 2) {
				bd = 0
			}
			if (V == 3) {
				bD = Power2.easeInOut;
				bL = Power1.easeInOut;bc.css({
					position : "absolute",
					"z-index" : 20
				});bC.css({
					position : "absolute",
					"z-index" : 15
				});
				bG = bn / 1200
			}
			if (V == 4 || V == 5) {
				bt = 0.6
			}
			if (V == 6) {
				bt = 1.4
			}
			if (V == 5 || V == 6) {
				bv = 1.4;
				bd = 0;
				a3 = 0;
				bs = 0;
				F = 0;
				bf = 0
			}
			if (V == 6) {
				bv = 0.6
			}
			TweenLite.fromTo(bb, bG, {
				left : F,
				top : bf,
				scale : bv,
				opacity : bd,
				rotation : bu.rotate
			}, {
				opacity : 1,
				rotation : 0,
				left : 0,
				top : 0,
				scale : 1,
				ease : bL,
				onComplete : function() {
					ao(bm, bu, a6, o, bC, bc);bc.css({
						position : "absolute",
						"z-index" : 18
					});bC.css({
						position : "absolute",
						"z-index" : 20
					})
				}
			});
			var b = o.find(".slotslide");
			if (V == 4 || V == 5) {
				a3 = 0;
				bs = 0
			}
			if (V != 1) {
				if (bj == 12) {
					TweenLite.to(b, bI, {
						left : 0 - a3 + "px",
						scale : bt,
						opacity : bd,
						rotation : bu.rotate,
						ease : bD
					})
				} else {
					if (bj == 15) {
						TweenLite.to(b, bI, {
							left : a3 + "px",
							scale : bt,
							opacity : bd,
							rotation : bu.rotate,
							ease : bD
						})
					} else {
						if (bj == 13) {
							TweenLite.to(b, bI, {
								top : 0 - bs + "px",
								scale : bt,
								opacity : bd,
								rotation : bu.rotate,
								ease : bD
							})
						} else {
							if (bj == 14) {
								TweenLite.to(b, bI, {
									top : bs + "px",
									scale : bt,
									opacity : bd,
									rotation : bu.rotate,
									ease : bD
								})
							}
						}
					}
				}
			}
			bC.css({
				opacity : 1
			})
		}
		if (bj == 16) {
			bc.css({
				position : "absolute",
				"z-index" : 20
			});bC.css({
				position : "absolute",
				"z-index" : 15
			});bc.wrapInner('<div class="tp-half-one" style="position:relative; width:100%;height:100%"></div>');bc.find(".tp-half-one").clone(true).appendTo(bc).addClass("tp-half-two");bc.find(".tp-half-two").removeClass("tp-half-one");
			var a3 = bu.width;
			var bs = bu.height;
			if (bu.autoHeight == "on") {
				bs = bm.height()
			}
			bc.find(".tp-half-one .defaultimg").wrap('<div class="tp-papercut" style="width:' + a3 + "px;height:" + bs + 'px;"></div>');bc.find(".tp-half-two .defaultimg").wrap('<div class="tp-papercut" style="width:' + a3 + "px;height:" + bs + 'px;"></div>');bc.find(".tp-half-two .defaultimg").css({
				position : "absolute",
				top : "-50%"
			});bc.find(".tp-half-two .tp-caption").wrapAll('<div style="position:absolute;top:-50%;left:0px"></div>');TweenLite.set(bc.find(".tp-half-two"), {
				width : a3,
				height : bs,
				overflow : "hidden",
				zIndex : 15,
				position : "absolute",
				top : bs / 2,
				left : "0px",
				transformPerspective : 600,
				transformOrigin : "center bottom"
			});TweenLite.set(bc.find(".tp-half-one"), {
				width : a3,
				height : bs / 2,
				overflow : "visible",
				zIndex : 10,
				position : "absolute",
				top : "0px",
				left : "0px",
				transformPerspective : 600,
				transformOrigin : "center top"
			});
			var bg = bc.find(".defaultimg");
			var bi = Math.round(Math.random() * 20 - 10);
			var a9 = Math.round(Math.random() * 20 - 10);
			var bK = Math.round(Math.random() * 20 - 10);
			var bM = Math.random() * 0.4 - 0.2;
			var a5 = Math.random() * 0.4 - 0.2;
			var bB = Math.random() * 1 + 1;
			var bo = Math.random() * 1 + 1;
			TweenLite.fromTo(bc.find(".tp-half-one"), bn / 1000, {
				width : a3,
				height : bs / 2,
				position : "absolute",
				top : "0px",
				left : "0px",
				transformPerspective : 600,
				transformOrigin : "center top"
			}, {
				scale : bB,
				rotation : bi,
				y : 0 - bs - bs / 4,
				ease : Power2.easeInOut
			});setTimeout(function() {
				TweenLite.set(bc.find(".tp-half-one"), {
					overflow : "hidden"
				})
			}, 50);TweenLite.fromTo(bc.find(".tp-half-one"), bn / 2000, {
				opacity : 1,
				transformPerspective : 600,
				transformOrigin : "center center"
			}, {
				opacity : 0,
				delay : bn / 2000
			});TweenLite.fromTo(bc.find(".tp-half-two"), bn / 1000, {
				width : a3,
				height : bs,
				overflow : "hidden",
				position : "absolute",
				top : bs / 2,
				left : "0px",
				transformPerspective : 600,
				transformOrigin : "center bottom"
			}, {
				scale : bo,
				rotation : a9,
				y : bs + bs / 4,
				ease : Power2.easeInOut
			});TweenLite.fromTo(bc.find(".tp-half-two"), bn / 2000, {
				opacity : 1,
				transformPerspective : 600,
				transformOrigin : "center center"
			}, {
				opacity : 0,
				delay : bn / 2000
			});
			if (bc.html() != null) {
				TweenLite.fromTo(bC, (bn - 200) / 1000, {
					opacity : 0,
					scale : 0.8,
					x : bu.width * bM,
					y : bs * a5,
					rotation : bK,
					transformPerspective : 600,
					transformOrigin : "center center"
				}, {
					rotation : 0,
					scale : 1,
					x : 0,
					y : 0,
					opacity : 1,
					ease : Power2.easeInOut
				})
			}
			a6.find(".defaultimg").css({
				opacity : 1
			});setTimeout(function() {
				bc.css({
					position : "absolute",
					"z-index" : 18
				});bC.css({
					position : "absolute",
					"z-index" : 20
				});a6.find(".defaultimg").css({
					opacity : 1
				});o.find(".defaultimg").css({
					opacity : 0
				});
				if (bc.find(".tp-half-one").length > 0) {
					bc.find(".tp-half-one .defaultimg").unwrap();bc.find(".tp-half-one .slotholder").unwrap()
				}
				bc.find(".tp-half-two").remove();
				bu.transition = 0;
				bu.act = bu.next
			}, bn);bC.css({
				opacity : 1
			})
		}
		if (bj == 17) {
			a6.find(".defaultimg").css({
				opacity : 0
			});a6.find(".slotslide").each(function(c) {
				var a = ak(this);
				TweenLite.fromTo(a, bn / 800, {
					opacity : 0,
					rotationY : 0,
					scale : 0.9,
					rotationX : -110,
					transformPerspective : 600,
					transformOrigin : "center center"
				}, {
					opacity : 1,
					top : 0,
					left : 0,
					scale : 1,
					rotation : 0,
					rotationX : 0,
					rotationY : 0,
					ease : Power3.easeOut,
					delay : c * 0.06,
					onComplete : function() {
						if (c == bu.slots - 1) {
							ao(bm, bu, a6, o, bC, bc)
						}
					}
				})
			})
		}
		if (bj == 18) {
			a6.find(".defaultimg").css({
				opacity : 0
			});a6.find(".slotslide").each(function(c) {
				var a = ak(this);
				TweenLite.fromTo(a, bn / 500, {
					opacity : 0,
					rotationY : 310,
					scale : 0.9,
					rotationX : 10,
					transformPerspective : 600,
					transformOrigin : "center center"
				}, {
					opacity : 1,
					top : 0,
					left : 0,
					scale : 1,
					rotation : 0,
					rotationX : 0,
					rotationY : 0,
					ease : Power3.easeOut,
					delay : c * 0.06,
					onComplete : function() {
						if (c == bu.slots - 1) {
							ao(bm, bu, a6, o, bC, bc)
						}
					}
				})
			})
		}
		if (bj == 19 || bj == 22) {
			a6.find(".defaultimg").css({
				opacity : 0
			});setTimeout(function() {
				o.find(".defaultimg").css({
					opacity : 0
				})
			}, 100);
			var bw = bC.css("z-index");
			var be = bc.css("z-index");
			var bz = 90;
			var bd = 1;
			if (bA == 1) {
				bz = -90
			}
			if (bj == 19) {
				var bq = "center center -" + bu.height / 2;
				bd = 0
			} else {
				var bq = "center center " + bu.height / 2
			}
			TweenLite.fromTo(a6, bn / 2000, {
				transformPerspective : 600,
				z : 0,
				x : 0,
				rotationY : 0
			}, {
				rotationY : 1,
				ease : Power1.easeInOut,
				z : -40
			});TweenLite.fromTo(a6, bn / 2000, {
				transformPerspective : 600,
				z : -40,
				rotationY : 1
			}, {
				rotationY : 0,
				z : 0,
				ease : Power1.easeInOut,
				x : 0,
				delay : 3 * (bn / 4000)
			});TweenLite.fromTo(o, bn / 2000, {
				transformPerspective : 600,
				z : 0,
				x : 0,
				rotationY : 0
			}, {
				rotationY : 1,
				x : 0,
				ease : Power1.easeInOut,
				z : -40
			});TweenLite.fromTo(o, bn / 2000, {
				transformPerspective : 600,
				z : -40,
				x : 0,
				rotationY : 1
			}, {
				rotationY : 0,
				z : 0,
				x : 0,
				ease : Power1.easeInOut,
				delay : 3 * (bn / 4000)
			});a6.find(".slotslide").each(function(c) {
				var a = ak(this);
				TweenLite.fromTo(a, bn / 1000, {
					left : 0,
					rotationY : bu.rotate,
					opacity : bd,
					top : 0,
					scale : 0.8,
					transformPerspective : 600,
					transformOrigin : bq,
					rotationX : bz
				}, {
					left : 0,
					rotationY : 0,
					opacity : 1,
					top : 0,
					z : 0,
					scale : 1,
					rotationX : 0,
					delay : c * 50 / 1000,
					ease : Power2.easeInOut,
					onComplete : function() {
						if (c == bu.slots - 1) {
							ao(bm, bu, a6, o, bC, bc)
						}
					}
				});TweenLite.to(a, 0.1, {
					opacity : 1,
					delay : c * 50 / 1000 + bn / 3000
				})
			});o.find(".slotslide").each(function(d) {
				var c = ak(this);
				var a = -90;
				if (bA == 1) {
					a = 90
				}
				TweenLite.fromTo(c, bn / 1000, {
					opacity : 1,
					rotationY : 0,
					top : 0,
					z : 0,
					scale : 1,
					transformPerspective : 600,
					transformOrigin : bq,
					rotationX : 0
				}, {
					opacity : 1,
					rotationY : bu.rotate,
					top : 0,
					scale : 0.8,
					rotationX : a,
					delay : d * 50 / 1000,
					ease : Power2.easeInOut,
					onComplete : function() {
						if (d == bu.slots - 1) {
							ao(bm, bu, a6, o, bC, bc)
						}
					}
				});TweenLite.to(c, 0.1, {
					opacity : 0,
					delay : d * 50 / 1000 + (bn / 1000 - bn / 10000)
				})
			})
		}
		if (bj == 20) {
			a6.find(".defaultimg").css({
				opacity : 0
			});setTimeout(function() {
				o.find(".defaultimg").css({
					opacity : 0
				})
			}, 100);
			var bw = bC.css("z-index");
			var be = bc.css("z-index");
			if (bA == 1) {
				var bE = -bu.width;
				var bz = 70;
				var bq = "left center -" + bu.height / 2
			} else {
				var bE = bu.width;
				var bz = -70;
				var bq = "right center -" + bu.height / 2
			}
			a6.find(".slotslide").each(function(c) {
				var a = ak(this);
				TweenLite.fromTo(a, bn / 1500, {
					left : bE,
					rotationX : 40,
					z : -600,
					opacity : bd,
					top : 0,
					transformPerspective : 600,
					transformOrigin : bq,
					rotationY : bz
				}, {
					left : 0,
					delay : c * 50 / 1000,
					ease : Power2.easeInOut
				});TweenLite.fromTo(a, bn / 1000, {
					rotationX : 40,
					z : -600,
					opacity : bd,
					top : 0,
					scale : 1,
					transformPerspective : 600,
					transformOrigin : bq,
					rotationY : bz
				}, {
					rotationX : 0,
					opacity : 1,
					top : 0,
					z : 0,
					scale : 1,
					rotationY : 0,
					delay : c * 50 / 1000,
					ease : Power2.easeInOut,
					onComplete : function() {
						if (c == bu.slots - 1) {
							ao(bm, bu, a6, o, bC, bc)
						}
					}
				});TweenLite.to(a, 0.1, {
					opacity : 1,
					delay : c * 50 / 1000 + bn / 2000
				})
			});o.find(".slotslide").each(function(h) {
				var g = ak(this);
				if (bA != 1) {
					var f = -bu.width;
					var d = 70;
					var a = "left center -" + bu.height / 2
				} else {
					var f = bu.width;
					var d = -70;
					var a = "right center -" + bu.height / 2
				}
				TweenLite.fromTo(g, bn / 1000, {
					opacity : 1,
					rotationX : 0,
					top : 0,
					z : 0,
					scale : 1,
					left : 0,
					transformPerspective : 600,
					transformOrigin : a,
					rotationY : 0
				}, {
					opacity : 1,
					rotationX : 40,
					top : 0,
					z : -600,
					left : f,
					scale : 0.8,
					rotationY : d,
					delay : h * 50 / 1000,
					ease : Power2.easeInOut,
					onComplete : function() {
						if (h == bu.slots - 1) {
							ao(bm, bu, a6, o, bC, bc)
						}
					}
				});TweenLite.to(g, 0.1, {
					opacity : 0,
					delay : h * 50 / 1000 + (bn / 1000 - bn / 10000)
				})
			})
		}
		if (bj == 21 || bj == 25) {
			a6.find(".defaultimg").css({
				opacity : 0
			});setTimeout(function() {
				o.find(".defaultimg").css({
					opacity : 0
				})
			}, 100);
			var bw = bC.css("z-index");
			var be = bc.css("z-index");
			if (bA == 1) {
				var bE = -bu.width;
				var bz = 110;
				if (bj == 25) {
					var bq = "center top 0";
					rot2 = -bz;
					bz = bu.rotate
				} else {
					var bq = "left center 0";
					rot2 = bu.rotate
				}
			} else {
				var bE = bu.width;
				var bz = -110;
				if (bj == 25) {
					var bq = "center bottom 0";
					rot2 = -bz;
					bz = bu.rotate
				} else {
					var bq = "right center 0";
					rot2 = bu.rotate
				}
			}
			a6.find(".slotslide").each(function(c) {
				var a = ak(this);
				TweenLite.fromTo(a, bn / 1500, {
					left : 0,
					rotationX : rot2,
					z : 0,
					opacity : 0,
					top : 0,
					scale : 1,
					transformPerspective : 600,
					transformOrigin : bq,
					rotationY : bz
				}, {
					left : 0,
					rotationX : 0,
					top : 0,
					z : 0,
					scale : 1,
					rotationY : 0,
					delay : c * 100 / 1000 + bn / 10000,
					ease : Power2.easeInOut,
					onComplete : function() {
						if (c == bu.slots - 1) {
							ao(bm, bu, a6, o, bC, bc)
						}
					}
				});TweenLite.to(a, 0.3, {
					opacity : 1,
					delay : c * 100 / 1000 + bn * 0.2 / 2000 + bn / 10000
				})
			});
			if (bA != 1) {
				var bE = -bu.width;
				var bz = 90;
				if (bj == 25) {
					var bq = "center top 0";
					rot2 = -bz;
					bz = bu.rotate
				} else {
					var bq = "left center 0";
					rot2 = bu.rotate
				}
			} else {
				var bE = bu.width;
				var bz = -90;
				if (bj == 25) {
					var bq = "center bottom 0";
					rot2 = -bz;
					bz = bu.rotate
				} else {
					var bq = "right center 0";
					rot2 = bu.rotate
				}
			}
			o.find(".slotslide").each(function(c) {
				var a = ak(this);
				TweenLite.fromTo(a, bn / 3000, {
					left : 0,
					rotationX : 0,
					z : 0,
					opacity : 1,
					top : 0,
					scale : 1,
					transformPerspective : 600,
					transformOrigin : bq,
					rotationY : 0
				}, {
					left : 0,
					rotationX : rot2,
					top : 0,
					z : 0,
					scale : 1,
					rotationY : bz,
					delay : c * 100 / 1000,
					ease : Power1.easeInOut
				});TweenLite.to(a, 0.2, {
					opacity : 0,
					delay : c * 50 / 1000 + (bn / 3000 - bn / 10000)
				})
			})
		}
		if (bj == 23 || bj == 24) {
			a6.find(".defaultimg").css({
				opacity : 0
			});setTimeout(function() {
				o.find(".defaultimg").css({
					opacity : 0
				})
			}, 100);
			var bw = bC.css("z-index");
			var be = bc.css("z-index");
			var bz = -90;
			if (bA == 1) {
				bz = 90
			}
			var bd = 1;
			if (bj == 23) {
				var bq = "center center -" + bu.width / 2;
				bd = 0
			} else {
				var bq = "center center " + bu.width / 2
			}
			var w = 0;
			TweenLite.fromTo(a6, bn / 2000, {
				transformPerspective : 600,
				z : 0,
				x : 0,
				rotationY : 0
			}, {
				rotationY : 1,
				ease : Power1.easeInOut,
				z : -90
			});TweenLite.fromTo(a6, bn / 2000, {
				transformPerspective : 600,
				z : -90,
				rotationY : 1
			}, {
				rotationY : 0,
				z : 0,
				ease : Power1.easeInOut,
				x : 0,
				delay : 3 * (bn / 4000)
			});TweenLite.fromTo(o, bn / 2000, {
				transformPerspective : 600,
				z : 0,
				x : 0,
				rotationY : 0
			}, {
				rotationY : 1,
				x : 0,
				ease : Power1.easeInOut,
				z : -90
			});TweenLite.fromTo(o, bn / 2000, {
				transformPerspective : 600,
				z : -90,
				x : 0,
				rotationY : 1
			}, {
				rotationY : 0,
				z : 0,
				x : 0,
				ease : Power1.easeInOut,
				delay : 3 * (bn / 4000)
			});a6.find(".slotslide").each(function(c) {
				var a = ak(this);
				TweenLite.fromTo(a, bn / 1000, {
					left : w,
					rotationX : bu.rotate,
					opacity : bd,
					top : 0,
					scale : 1,
					transformPerspective : 600,
					transformOrigin : bq,
					rotationY : bz
				}, {
					left : 0,
					rotationX : 0,
					opacity : 1,
					top : 0,
					z : 0,
					scale : 1,
					rotationY : 0,
					delay : c * 50 / 1000,
					ease : Power2.easeInOut,
					onComplete : function() {
						if (c == bu.slots - 1) {
							ao(bm, bu, a6, o, bC, bc)
						}
					}
				});TweenLite.to(a, 0.1, {
					opacity : 1,
					delay : c * 50 / 1000 + bn / 3000
				})
			});
			bz = 90;
			if (bA == 1) {
				bz = -90
			}
			o.find(".slotslide").each(function(c) {
				var a = ak(this);
				TweenLite.fromTo(a, bn / 1000, {
					left : 0,
					opacity : 1,
					rotationX : 0,
					top : 0,
					z : 0,
					scale : 1,
					transformPerspective : 600,
					transformOrigin : bq,
					rotationY : 0
				}, {
					left : w,
					opacity : 1,
					rotationX : bu.rotate,
					top : 0,
					scale : 1,
					rotationY : bz,
					delay : c * 50 / 1000,
					ease : Power2.easeInOut,
					onComplete : function() {
						if (c == bu.slots - 1) {
							ao(bm, bu, a6, o, bC, bc)
						}
					}
				});TweenLite.to(a, 0.1, {
					opacity : 0,
					delay : c * 50 / 1000 + (bn / 1000 - bn / 10000)
				})
			})
		}
		var a7 = {};
		a7.slideIndex = bu.next + 1;bm.trigger("revolution.slide.onchange", a7);setTimeout(function() {
			bm.trigger("revolution.slide.onafterswap")
		}, bn);bm.trigger("revolution.slide.onvideostop")
	}
	function ad(a, b) {
	}
	function aG(b, a) {
		b.find(">ul:first-child >li").each(function() {
			var d = ak(this);
			for (var c = 0; c < 10; c++) {
				d.find(".rs-parallaxlevel-" + c).wrapAll('<div style="position:absolute;top:0px;left:0px;width:100%;height:100%;" class="tp-parallax-container" data-parallaxlevel="' + a.parallaxLevels[c] + '"></div>')
			}
		});b.on("mousemove.hoverdir, mouseleave.hoverdir", function(e) {
			console.log("event:" + e.type);switch (e.type) {
			case "mousemove":
				var g = b.offset().top,
					d = b.offset().left,
					h = g + b.height() / 2,
					f = d + b.width() / 2,
					j = f - e.pageX,
					c = h - e.pageY;
				ak(".tp-parallax-container").each(function() {
					var o = ak(this),
						l = parseInt(o.data("parallaxlevel"), 0) / 100,
						m = j * l,
						k = c * l;
					TweenLite.to(o, 0.2, {
						x : m,
						y : k,
						ease : Power3.easeOut
					})
				});
				break;case "mouseleave":
				ak(".tp-parallax-container").each(function() {
					var k = ak(this);
					TweenLite.to(k, 0.4, {
						x : 0,
						y : 0,
						ease : Power3.easeOut
					})
				});
				break
			}
		});
		window.ondeviceorientation = function(d) {
			var f = Math.round(d.beta || 0),
				c = Math.round(d.gamma || 0),
				g = 360 / b.width() * c,
				e = 180 / b.height() * f;
			ak(".tp-parallax-container").each(function() {
				var l = ak(this),
					j = parseInt(l.data("parallaxlevel"), 0) / 100,
					k = g * j,
					h = e * j;
				TweenLite.to(l, 0.2, {
					x : k,
					y : h,
					ease : Power3.easeOut
				})
			})
		};ak(window).bind("deviceorientation", {
			option : a,
			cont : b
		}, function(c) {
			var j = c.data.option;
			var f = c.data.container;
			if (!j.desktop && c.beta !== null && c.gamma !== null) {
				var g = (c.beta || 0) / MAGIC_NUMBER;
				var d = (c.gamma || 0) / MAGIC_NUMBER;
				var h = window.innerHeight > window.innerWidth
			}
		})
	}
	function aC(d, f) {
		try {
			var c = d.find(">ul:first-child >li:eq(" + f.act + ")")
		} catch (g) {
			var c = d.find(">ul:first-child >li:eq(1)")
		}
		f.lastslide = f.act;var e = d.find(">ul:first-child >li:eq(" + f.next + ")");
		var h = c.find(".slotholder");
		var b = e.find(".slotholder");
		b.find(".defaultimg").each(function() {
			var a = ak(this);
			if (a.data("kenburn") != aP) {
				a.data("kenburn").restart()
			}
			TweenLite.killTweensOf(a, false);TweenLite.set(a, {
				scale : 1,
				rotationZ : 0
			});a.data("bgposition", b.data("bgposition"));a.data("currotate", b.data("rotationstart"));a.data("curscale", b.data("bgfit"))
		})
	}
	function ab(B, D) {
		try {
			var x = B.find(">ul:first-child >li:eq(" + D.act + ")")
		} catch (E) {
			var x = B.find(">ul:first-child >li:eq(1)")
		}
		D.lastslide = D.act;var F = B.find(">ul:first-child >li:eq(" + D.next + ")");
		var e = x.find(".slotholder");
		var q = F.find(".slotholder");
		var z = q.data("bgposition"),
			k = q.data("bgpositionend"),
			w = q.data("zoomstart") / 100,
			C = q.data("zoomend") / 100,
			o = q.data("rotationstart"),
			G = q.data("rotationend"),
			A = q.data("bgfit"),
			t = q.data("bgfitend"),
			H = q.data("easeme"),
			j = q.data("duration") / 1000;
		if (A == aP) {
			A = 100
		}
		if (t == aP) {
			t = 100
		}
		A = aj(A, q, D);
		t = aj(t, q, D);
		if (w == aP) {
			w = 1
		}
		if (C == aP) {
			C = 1
		}
		if (o == aP) {
			o = 0
		}
		if (G == aP) {
			G = 0
		}
		if (w < 1) {
			w = 1
		}
		if (C < 1) {
			C = 1
		}
		q.find(".defaultimg").each(function() {
			var a = ak(this);
			a.data("kenburn", TweenLite.fromTo(a, j, {
				transformPerspective : 1200,
				backgroundSize : A,
				z : 0,
				backgroundPosition : z,
				rotationZ : o
			}, {
				yoyo : 2,
				rotationZ : G,
				ease : H,
				backgroundSize : t,
				backgroundPosition : k,
				onUpdate : function() {
					a.data("bgposition", a.css("backgroundPosition"));
					if (!aF(8)) {
						a.data("currotate", av(a))
					}
					if (!aF(8)) {
						a.data("curscale", a.css("backgroundSize"))
					}
				}
			}))
		})
	}
	function aj(a, h, c) {
		var f = h.data("owidth");
		var b = h.data("oheight");
		var g = c.container.width() / f;
		var d = b * g;
		var j = d / c.container.height() * a;
		return a + "% " + j + "%"
	}
	function aI(a) {
		var b = a.css("-webkit-transform") || a.css("-moz-transform") || a.css("-ms-transform") || a.css("-o-transform") || a.css("transform");
		return b
	}
	function at(a) {
		return a.replace(/^matrix(3d)?\((.*)\)$/, "$2").split(/, /)
	}
	function af(a) {
		var g = at(aI(a)),
			c = 1;
		if (g[0] !== "none") {
			var d = g[0],
				b = g[1],
				f = 10;
			c = Math.round(Math.sqrt(d * d + b * b) * f) / f
		}
		return c
	}
	function av(a) {
		var g = a.css("-webkit-transform") || a.css("-moz-transform") || a.css("-ms-transform") || a.css("-o-transform") || a.css("transform");
		if (g !== "none") {
			var c = g.split("(")[1].split(")")[0].split(",");
			var d = c[0];
			var b = c[1];
			var f = Math.round(Math.atan2(b, d) * (180 / Math.PI))
		} else {
			var f = 0
		}
		return f < 0 ? f += 360 : f
	}
	function ao(a, g, c, d, b, f) {
		aO(a, g);c.find(".defaultimg").css({
			opacity : 1
		});
		if (b.index() != f.index()) {
			d.find(".defaultimg").css({
				opacity : 0
			})
		}
		g.act = g.next;an(a);
		if (c.data("kenburns") == "on") {
			ab(a, g)
		}
	}
	function au(f) {
		var b = f.target.getVideoEmbedCode();
		var d = ak("#" + b.split('id="')[1].split('"')[0]);
		var a = d.closest(".tp-simpleresponsive");
		var e = d.parent().data("player");
		if (f.data == YT.PlayerState.PLAYING) {
			var c = a.find(".tp-bannertimer");
			var g = c.data("opt");
			if (d.closest(".tp-caption").data("volume") == "mute") {
				e.mute()
			}
			g.videoplaying = true;a.trigger("stoptimer");a.trigger("revolution.slide.onvideoplay")
		} else {
			var c = a.find(".tp-bannertimer");
			var g = c.data("opt");
			if (f.data != -1) {
				g.videoplaying = false;a.trigger("playtimer");a.trigger("revolution.slide.onvideostop")
			}
		}
		if (f.data == 0 && g.nextslideatend == true) {
			g.container.revnext()
		}
	}
	function aJ(a, c, b) {
		if (a.addEventListener) {
			a.addEventListener(c, b, false)
		} else {
			a.attachEvent(c, b, false)
		}
	}
	function aM(e, b) {
		var c = $f(e);
		var a = ak("#" + e);
		var d = a.closest(".tp-simpleresponsive");
		c.addEvent("ready", function(f) {
			if (b) {
				c.api("play")
			}
			c.addEvent("play", function(g) {
				var j = d.find(".tp-bannertimer");
				var h = j.data("opt");
				h.videoplaying = true;d.trigger("stoptimer");
				if (a.closest(".tp-caption").data("volume") == "mute") {
					c.api("setVolume", "0")
				}
			});c.addEvent("finish", function(g) {
				var j = d.find(".tp-bannertimer");
				var h = j.data("opt");
				h.videoplaying = false;d.trigger("playtimer");d.trigger("revolution.slide.onvideoplay");
				if (h.nextslideatend == true) {
					h.container.revnext()
				}
			});c.addEvent("pause", function(g) {
				var j = d.find(".tp-bannertimer");
				var h = j.data("opt");
				h.videoplaying = false;d.trigger("playtimer");d.trigger("revolution.slide.onvideostop")
			})
		})
	}
	function aS(a, h) {
		var c = h.width();
		var f = h.height();
		var b = a.data("mediaAspect");
		var g = c / f;
		a.css({
			position : "absolute"
		});var d = a.find("video");
		if (g < b) {
			a.width(f * b).height(f);a.css("top", 0).css("left", -(f * b - c) / 2).css("height", f)
		} else {
			a.width(c).height(c / b);a.css("top", -(c / b - f) / 2).css("left", 0).css("height", c / b)
		}
	}
	function a1() {
		var a = new Object;
		a.x = 0;
		a.y = 0;
		a.rotationX = 0;
		a.rotationY = 0;
		a.rotationZ = 0;
		a.scale = 1;
		a.scaleX = 1;
		a.scaleY = 1;
		a.skewX = 0;
		a.skewY = 0;
		a.opacity = 0;
		a.transformOrigin = "center, center";
		a.transformPerspective = 400;
		a.rotation = 0;return a
	}
	function aW(c, a) {
		var b = a.split(";");
		ak.each(b, function(d, g) {
			g = g.split(":");
			var h = g[0],
				f = g[1];
			if (h == "rotationX") {
				c.rotationX = parseInt(f, 0)
			}
			if (h == "rotationY") {
				c.rotationY = parseInt(f, 0)
			}
			if (h == "rotationZ") {
				c.rotationZ = parseInt(f, 0)
			}
			if (h == "rotationZ") {
				c.rotation = parseInt(f, 0)
			}
			if (h == "scaleX") {
				c.scaleX = parseFloat(f)
			}
			if (h == "scaleY") {
				c.scaleY = parseFloat(f)
			}
			if (h == "opacity") {
				c.opacity = parseFloat(f)
			}
			if (h == "skewX") {
				c.skewX = parseInt(f, 0)
			}
			if (h == "skewY") {
				c.skewY = parseInt(f, 0)
			}
			if (h == "x") {
				c.x = parseInt(f, 0)
			}
			if (h == "y") {
				c.y = parseInt(f, 0)
			}
			if (h == "z") {
				c.z = parseInt(f, 0)
			}
			if (h == "transformOrigin") {
				c.transformOrigin = f.toString()
			}
			if (h == "transformPerspective") {
				c.transformPerspective = parseInt(f, 0)
			}
		});return c
	}
	function aY(d) {
		var b = d.split("animation:");
		var c = new Object;
		c.animation = aW(a1(), b[1]);var a = b[0].split(";");
		ak.each(a, function(f, j) {
			j = j.split(":");
			var h = j[0],
				g = j[1];
			if (h == "typ") {
				c.typ = g
			}
			if (h == "speed") {
				c.speed = parseInt(g, 0) / 1000
			}
			if (h == "start") {
				c.start = parseInt(g, 0) / 1000
			}
			if (h == "elementdelay") {
				c.elementdelay = parseFloat(g)
			}
			if (h == "ease") {
				c.ease = g
			}
		});return c
	}
	function aU(d, f, c) {
		var e = 0;
		var g = 0;
		d.find(".tp-caption").each(function(bd) {
			e = f.width / 2 - f.startwidth * f.bw / 2;
			var r = f.bw;
			var W = f.bh;
			if (f.fullScreen == "on") {
				g = f.height / 2 - f.startheight * f.bh / 2
			}
			if (f.autoHeight == "on") {
				g = f.container.height() / 2 - f.startheight * f.bh / 2
			}
			if (g < 0) {
				g = 0
			}
			var a9 = ak(this);
			var z = 0;
			if (f.width < f.hideCaptionAtLimit && a9.data("captionhidden") == "on") {
				a9.addClass("tp-hidden-caption");
				z = 1
			} else {
				if (f.width < f.hideAllCaptionAtLimit || f.width < f.hideAllCaptionAtLilmit) {
					a9.addClass("tp-hidden-caption");
					z = 1
				} else {
					a9.removeClass("tp-hidden-caption")
				}
			}
			if (z == 0) {
				if (a9.data("linktoslide") != aP && !a9.hasClass("hasclicklistener")) {
					a9.addClass("hasclicklistener");a9.css({
						cursor : "pointer"
					});
					if (a9.data("linktoslide") != "no") {
						a9.click(function() {
							var h = ak(this);
							var a = h.data("linktoslide");
							if (a != "next" && a != "prev") {
								f.container.data("showus", a);f.container.parent().find(".tp-rightarrow").click()
							} else {
								if (a == "next") {
									f.container.parent().find(".tp-rightarrow").click()
								} else {
									if (a == "prev") {
										f.container.parent().find(".tp-leftarrow").click()
									}
								}
							}
						})
					}
				}
				if (e < 0) {
					e = 0
				}
				var a3 = "iframe" + Math.round(Math.random() * 1000 + 1);
				if (a9.find("iframe").length > 0 || a9.find("video").length > 0) {
					if (a9.data("autoplayonlyfirsttime") == true || a9.data("autoplayonlyfirsttime") == "true") {
						a9.data("autoplay", true)
					}
					a9.find("iframe").each(function() {
						var x = ak(this);
						if (aN()) {
							var A = x.attr("src");
							x.attr("src", "");x.attr("src", A)
						}
						f.nextslideatend = a9.data("nextslideatend");
						if (a9.data("thumbimage") != aP && a9.data("thumbimage").length > 2 && a9.data("autoplay") != true && !c) {
							a9.find(".tp-thumb-image").remove();a9.append('<div class="tp-thumb-image" style="cursor:pointer; position:absolute;top:0px;left:0px;width:100%;height:100%;background-image:url(' + a9.data("thumbimage") + '); background-size:cover"></div>')
						}
						if (x.attr("src").toLowerCase().indexOf("youtube") >= 0) {
							if (!x.hasClass("HasListener")) {
								try {
									x.attr("id", a3);var C;
									var h = setInterval(function() {
										if (YT != aP) {
											if (typeof YT.Player != aP && typeof YT.Player != "undefined") {
												if (a9.data("autoplay") == true) {
													C = new YT.Player(a3, {
														events : {
															onStateChange : au,
															onReady : function(a) {
																a.target.playVideo()
															}
														}
													})
												} else {
													C = new YT.Player(a3, {
														events : {
															onStateChange : au
														}
													})
												}
												x.addClass("HasListener");a9.data("player", C);clearInterval(h)
											}
										}
									}, 100)
								} catch (l) {}
							} else {
								if (a9.data("autoplay") == true) {
									var C = a9.data("player");
									a9.data("timerplay", setTimeout(function() {
										if (a9.data("forcerewind") == "on") {
											C.seekTo(0)
										}
										C.playVideo()
									}, a9.data("start")))
								}
							}
							a9.find(".tp-thumb-image").click(function() {
								TweenLite.to(ak(this), 0.3, {
									opacity : 0,
									ease : Power3.easeInOut,
									onComplete : function() {
										a9.find(".tp-thumb-image").remove()
									}
								});
								var a = a9.data("player");
								a.playVideo()
							})
						} else {
							if (x.attr("src").toLowerCase().indexOf("vimeo") >= 0) {
								if (!x.hasClass("HasListener")) {
									x.addClass("HasListener");x.attr("id", a3);
									var j = x.attr("src");
									var B = {},
										k = j,
										D = /([^&=]+)=([^&]*)/g,
										w;
									while (w = D.exec(k)) {
										B[decodeURIComponent(w[1])] = decodeURIComponent(w[2])
									}
									if (B.player_id != aP) {
										j = j.replace(B.player_id, a3)
									} else {
										j = j + "&player_id=" + a3
									}
									try {
										j = j.replace("api=0", "api=1")
									} catch (l) {}
									j = j + "&api=1";x.attr("src", j);
									var C = a9.find("iframe")[0];
									var q = setInterval(function() {
										if ($f != aP) {
											if (typeof $f(a3).api != aP && typeof $f(a3).api != "undefined") {
												$f(C).addEvent("ready", function() {
													aM(a3, a9.data("autoplay"))
												});clearInterval(q)
											}
										}
									}, 100)
								} else {
									if (a9.data("autoplay") == true) {
										var x = a9.find("iframe");
										var E = x.attr("id");
										var q = setInterval(function() {
											if ($f != aP) {
												if (typeof $f(E).api != aP && typeof $f(E).api != "undefined") {
													var a = $f(E);
													a9.data("timerplay", setTimeout(function() {
														if (a9.data("forcerewind") == "on") {
															a.api("seekTo", 0)
														}
														a.api("play")
													}, a9.data("start")));clearInterval(q)
												}
											}
										}, 100)
									}
								}
								a9.find(".tp-thumb-image").click(function() {
									TweenLite.to(ak(this), 0.3, {
										opacity : 0,
										ease : Power3.easeInOut,
										onComplete : function() {
											a9.find(".tp-thumb-image").remove()
										}
									});
									var m = a9.find("iframe");
									var p = m.attr("id");
									var a = setInterval(function() {
										if ($f != aP) {
											if (typeof $f(p).api != aP && typeof $f(p).api != "undefined") {
												var n = $f(p);
												n.api("play");clearInterval(a)
											}
										}
									}, 100)
								})
							}
						}
					});
					if (a9.find("video").length > 0) {
						a9.find("video").each(function(h) {
							var a = ak(this);
							var k = this;
							if (!a.parent().hasClass("html5vid")) {
								a.wrap('<div class="html5vid" style="position:relative;top:0px;left:0px;width:auto;height:auto"></div>')
							}
							var j = ak(this).parent();
							if (k.addEventListener) {
								k.addEventListener("loadedmetadata", function() {
									j.data("metaloaded", 1)
								})
							} else {
								k.attachEvent("loadedmetadata", function() {
									j.data("metaloaded", 1)
								})
							}
							if (!a.hasClass("HasListener")) {
								a.addClass("HasListener");k.addEventListener("play", function() {
									j.addClass("videoisplaying");j.find(".tp-poster").remove();
									if (a9.data("volume") == "mute") {
										k.muted = true
									}
									f.container.trigger("revolution.slide.onvideoplay");
									f.videoplaying = true;f.container.trigger("stoptimer")
								});k.addEventListener("pause", function() {
									j.removeClass("videoisplaying");
									f.videoplaying = false;f.container.trigger("playtimer");f.container.trigger("revolution.slide.onvideostop")
								});k.addEventListener("ended", function() {
									j.removeClass("videoisplaying");
									f.videoplaying = false;f.container.trigger("playtimer");f.container.trigger("revolution.slide.onvideostop");
									if (f.nextslideatend == true) {
										f.container.revnext()
									}
								})
							}
							if (a.attr("poster") != aP && j.find(".tp-poster").length == 0) {
								j.append('<div class="tp-poster" style="position:absolute;z-index:1;width:100%;height:100%;top:0px;left:0px;background:url(' + a.attr("poster") + '); background-position:center center;background-size:100%;background-repeat:no-repeat;"></div>')
							}
							if (a.attr("control") == aP && j.find(".tp-video-play-button").length == 0) {
								j.append('<div class="tp-video-play-button"><i class="revicon-right-dir"></i><div class="tp-revstop"></div></div>');j.find(".tp-video-play-button").click(function() {
									if (j.hasClass("videoisplaying")) {
										k.pause()
									} else {
										k.play()
									}
								})
							}
							if (a.attr("control") == aP) {
								j.find("video, .tp-poster").click(function() {
									if (j.hasClass("videoisplaying")) {
										k.pause()
									} else {
										k.play()
									}
								})
							}
							if (a9.data("forcecover") == 1) {
								aS(j, f.container);j.addClass("fullcoveredvideo");a9.addClass("fullcoveredvideo")
							}
							if (a9.data("forcecover") == 1 || a9.hasClass("fullscreenvideo")) {
								j.css({
									width : "100%",
									height : "100%"
								})
							}
							var l = false;
							if (a9.data("autoplayonlyfirsttime") == true || a9.data("autoplayonlyfirsttime") == "true") {
								l = true
							}
							clearInterval(j.data("interval"));j.data("interval", setInterval(function() {
								if (j.data("metaloaded") == 1 || k.duration != NaN) {
									clearInterval(j.data("interval"));
									if (a9.data("dottedoverlay") != "none" && a9.data("dottedoverlay") != aP) {
										if (a9.find(".tp-dottedoverlay").length != 1) {
											j.append('<div class="tp-dottedoverlay ' + a9.data("dottedoverlay") + '"></div>')
										}
									}
									var q = 16 / 9;
									if (a9.data("aspectratio") == "4:3") {
										q = 4 / 3
									}
									j.data("mediaAspect", q);
									if (j.closest(".tp-caption").data("forcecover") == 1) {
										aS(j, f.container);j.addClass("fullcoveredvideo")
									}
									a.css({
										display : "block"
									});
									f.nextslideatend = a9.data("nextslideatend");
									if (a9.data("autoplay") == true || l == true) {
										var m = ak("body").find("#" + f.container.attr("id")).find(".tp-bannertimer");
										setTimeout(function() {
											f.videoplaying = true;f.container.trigger("stoptimer")
										}, 200);
										if (a9.data("forcerewind") == "on" && !j.hasClass("videoisplaying")) {
											if (k.currentTime > 0) {
												k.currentTime = 0
											}
										}
										if (a9.data("volume") == "mute") {
											k.muted = true
										}
										j.data("timerplay", setTimeout(function() {
											if (a9.data("forcerewind") == "on" && !j.hasClass("videoisplaying")) {
												if (k.currentTime > 0) {
													k.currentTime = 0
												}
											}
											if (a9.data("volume") == "mute") {
												k.muted = true
											}
											setTimeout(function() {
												k.play()
											}, 500)
										}, 10 + a9.data("start")))
									}
									if (j.data("ww") == aP) {
										j.data("ww", a.attr("width"))
									}
									if (j.data("hh") == aP) {
										j.data("hh", a.attr("height"))
									}
									if (!a9.hasClass("fullscreenvideo") && a9.data("forcecover") == 1) {
										try {
											j.width(j.data("ww") * f.bw);j.height(j.data("hh") * f.bh)
										} catch (p) {}
									}
									clearInterval(j.data("interval"))
								}
							}), 100)
						})
					}
					if (a9.data("autoplay") == true) {
						var bh = ak("body").find("#" + f.container.attr("id")).find(".tp-bannertimer");
						setTimeout(function() {
							f.videoplaying = true;f.container.trigger("stoptimer")
						}, 200);
						f.videoplaying = true;f.container.trigger("stoptimer");
						if (a9.data("autoplayonlyfirsttime") == true || a9.data("autoplayonlyfirsttime") == "true") {
							a9.data("autoplay", false);a9.data("autoplayonlyfirsttime", false)
						}
					}
				}
				var I = 0;
				var bp = 0;
				if (a9.find("img").length > 0) {
					var bb = a9.find("img");
					if (bb.data("ww") == aP) {
						bb.data("ww", bb.width())
					}
					if (bb.data("hh") == aP) {
						bb.data("hh", bb.height())
					}
					var Y = bb.data("ww");
					var bt = bb.data("hh");
					bb.width(Y * f.bw);bb.height(bt * f.bh);
					I = bb.width();
					bp = bb.height()
				} else {
					if (a9.find("iframe").length > 0 || a9.find("video").length > 0) {
						var t = false;
						var bb = a9.find("iframe");
						if (bb.length == 0) {
							bb = a9.find("video");
							t = true
						}
						bb.css({
							display : "block"
						});
						if (a9.data("ww") == aP) {
							a9.data("ww", bb.width())
						}
						if (a9.data("hh") == aP) {
							a9.data("hh", bb.height())
						}
						var Y = a9.data("ww");
						var bt = a9.data("hh");
						var br = a9;
						if (br.data("fsize") == aP) {
							br.data("fsize", parseInt(br.css("font-size"), 0) || 0)
						}
						if (br.data("pt") == aP) {
							br.data("pt", parseInt(br.css("paddingTop"), 0) || 0)
						}
						if (br.data("pb") == aP) {
							br.data("pb", parseInt(br.css("paddingBottom"), 0) || 0)
						}
						if (br.data("pl") == aP) {
							br.data("pl", parseInt(br.css("paddingLeft"), 0) || 0)
						}
						if (br.data("pr") == aP) {
							br.data("pr", parseInt(br.css("paddingRight"), 0) || 0)
						}
						if (br.data("mt") == aP) {
							br.data("mt", parseInt(br.css("marginTop"), 0) || 0)
						}
						if (br.data("mb") == aP) {
							br.data("mb", parseInt(br.css("marginBottom"), 0) || 0)
						}
						if (br.data("ml") == aP) {
							br.data("ml", parseInt(br.css("marginLeft"), 0) || 0)
						}
						if (br.data("mr") == aP) {
							br.data("mr", parseInt(br.css("marginRight"), 0) || 0)
						}
						if (br.data("bt") == aP) {
							br.data("bt", parseInt(br.css("borderTop"), 0) || 0)
						}
						if (br.data("bb") == aP) {
							br.data("bb", parseInt(br.css("borderBottom"), 0) || 0)
						}
						if (br.data("bl") == aP) {
							br.data("bl", parseInt(br.css("borderLeft"), 0) || 0)
						}
						if (br.data("br") == aP) {
							br.data("br", parseInt(br.css("borderRight"), 0) || 0)
						}
						if (br.data("lh") == aP) {
							br.data("lh", parseInt(br.css("lineHeight"), 0) || 0)
						}
						var R = f.width;
						var bm = f.height;
						if (R > f.startwidth) {
							R = f.startwidth
						}
						if (bm > f.startheight) {
							bm = f.startheight
						}
						if (!a9.hasClass("fullscreenvideo")) {
							a9.css({
								"font-size" : br.data("fsize") * f.bw + "px",
								"padding-top" : br.data("pt") * f.bh + "px",
								"padding-bottom" : br.data("pb") * f.bh + "px",
								"padding-left" : br.data("pl") * f.bw + "px",
								"padding-right" : br.data("pr") * f.bw + "px",
								"margin-top" : br.data("mt") * f.bh + "px",
								"margin-bottom" : br.data("mb") * f.bh + "px",
								"margin-left" : br.data("ml") * f.bw + "px",
								"margin-right" : br.data("mr") * f.bw + "px",
								"border-top" : br.data("bt") * f.bh + "px",
								"border-bottom" : br.data("bb") * f.bh + "px",
								"border-left" : br.data("bl") * f.bw + "px",
								"border-right" : br.data("br") * f.bw + "px",
								"line-height" : br.data("lh") * f.bh + "px",
								height : bt * f.bh + "px"
							})
						} else {
							e = 0;
							g = 0;a9.data("x", 0);a9.data("y", 0);
							var bs = f.height;
							if (f.autoHeight == "on") {
								bs = f.container.height()
							}
							a9.css({
								width : f.width,
								height : bs
							})
						}
						if (t == false) {
							bb.width(Y * f.bw);bb.height(bt * f.bh)
						} else {
							if (a9.data("forcecover") != 1 && !a9.hasClass("fullscreenvideo")) {
								bb.width(Y * f.bw);bb.height(bt * f.bh)
							}
						}
						I = bb.width();
						bp = bb.height()
					} else {
						a9.find(".tp-resizeme, .tp-resizeme *").each(function() {
							ay(ak(this), f)
						});
						if (a9.hasClass("tp-resizeme")) {
							a9.find("*").each(function() {
								ay(ak(this), f)
							})
						}
						ay(a9, f);
						bp = a9.outerHeight(true);
						I = a9.outerWidth(true);
						var bn = a9.outerHeight();
						var be = a9.css("backgroundColor");
						a9.find(".frontcorner").css({
							borderWidth : bn + "px",
							left : 0 - bn + "px",
							borderRight : "0px solid transparent",
							borderTopColor : be
						});a9.find(".frontcornertop").css({
							borderWidth : bn + "px",
							left : 0 - bn + "px",
							borderRight : "0px solid transparent",
							borderBottomColor : be
						});a9.find(".backcorner").css({
							borderWidth : bn + "px",
							right : 0 - bn + "px",
							borderLeft : "0px solid transparent",
							borderBottomColor : be
						});a9.find(".backcornertop").css({
							borderWidth : bn + "px",
							right : 0 - bn + "px",
							borderLeft : "0px solid transparent",
							borderTopColor : be
						})
					}
				}
				if (f.fullScreenAlignForce == "on") {
					e = 0;
					g = 0
				}
				if (a9.data("voffset") == aP) {
					a9.data("voffset", 0)
				}
				if (a9.data("hoffset") == aP) {
					a9.data("hoffset", 0)
				}
				var G = a9.data("voffset") * r;
				var a8 = a9.data("hoffset") * r;
				var ba = f.startwidth * r;
				var s = f.startheight * r;
				if (f.fullScreenAlignForce == "on") {
					ba = f.container.width();
					s = f.container.height()
				}
				if (a9.data("x") == "center" || a9.data("xcenter") == "center") {
					a9.data("xcenter", "center");a9.data("x", ba / 2 - a9.outerWidth(true) / 2 + a8)
				}
				if (a9.data("x") == "left" || a9.data("xleft") == "left") {
					a9.data("xleft", "left");a9.data("x", 0 / r + a8)
				}
				if (a9.data("x") == "right" || a9.data("xright") == "right") {
					a9.data("xright", "right");a9.data("x", (ba - a9.outerWidth(true) + a8) / r)
				}
				if (a9.data("y") == "center" || a9.data("ycenter") == "center") {
					a9.data("ycenter", "center");a9.data("y", s / 2 - a9.outerHeight(true) / 2 + G)
				}
				if (a9.data("y") == "top" || a9.data("ytop") == "top") {
					a9.data("ytop", "top");a9.data("y", 0 / f.bh + G)
				}
				if (a9.data("y") == "bottom" || a9.data("ybottom") == "bottom") {
					a9.data("ybottom", "bottom");a9.data("y", (s - a9.outerHeight(true) + G) / r)
				}
				if (a9.data("start") == aP) {
					a9.data("start", 1000)
				}
				var bg = a9.data("easing");
				if (bg == aP) {
					bg = "Power1.easeOut"
				}
				var bc = a9.data("start") / 1000;
				var o = a9.data("speed") / 1000;
				if (a9.data("x") == "center" || a9.data("xcenter") == "center") {
					var K = a9.data("x") + e
				} else {
					var K = r * a9.data("x") + e
				}
				if (a9.data("y") == "center" || a9.data("ycenter") == "center") {
					var bi = a9.data("y") + g
				} else {
					var bi = f.bh * a9.data("y") + g
				}
				TweenLite.set(a9, {
					top : bi,
					left : K,
					overwrite : "auto"
				});
				if (!c) {
					if (a9.data("timeline") != aP) {
						a9.data("timeline").clear()
					}
					function a4() {
						setTimeout(function() {
							a9.css({
								transform : "none",
								"-moz-transform" : "none",
								"-webkit-transform" : "none"
							})
						}, 100)
					}
					function u() {
						a9.data("timer", setTimeout(function() {
							if (a9.hasClass("fullscreenvideo")) {
								a9.css({
									display : "block"
								})
							}
						}, a9.data("start")))
					}
					var a6 = new TimelineLite({
						smoothChildTiming : true,
						onStart : u
					});
					if (f.fullScreenAlignForce == "on") {
					}
					var X = a9;
					if (a9.data("mySplitText") != aP) {
						a9.data("mySplitText").revert()
					}
					if (a9.data("splitin") == "chars" || a9.data("splitin") == "words" || a9.data("splitin") == "lines" || a9.data("splitout") == "chars" || a9.data("splitout") == "words" || a9.data("splitout") == "lines") {
						if (a9.find("a").length > 0) {
							a9.data("mySplitText", new SplitText(a9.find("a"), {
								type : "lines,words,chars",
								charsClass : "tp-splitted",
								wordsClass : "tp-splitted",
								linesClass : "tp-splitted"
							}))
						} else {
							a9.data("mySplitText", new SplitText(a9, {
								type : "lines,words,chars",
								charsClass : "tp-splitted",
								wordsClass : "tp-splitted",
								linesClass : "tp-splitted"
							}))
						}
						a9.addClass("splitted")
					}
					if (a9.data("splitin") == "chars") {
						X = a9.data("mySplitText").chars
					}
					if (a9.data("splitin") == "words") {
						X = a9.data("mySplitText").words
					}
					if (a9.data("splitin") == "lines") {
						X = a9.data("mySplitText").lines
					}
					var bj = a1();
					var bq = a1();
					if (a9.data("repeat") != aP) {
						repeatV = a9.data("repeat")
					}
					if (a9.data("yoyo") != aP) {
						yoyoV = a9.data("yoyo")
					}
					if (a9.data("repeatdelay") != aP) {
						repeatdelayV = a9.data("repeatdelay")
					}
					if (a9.hasClass("customin")) {
						bj = aW(bj, a9.data("customin"))
					} else {
						if (a9.hasClass("randomrotate")) {
							bj.scale = Math.random() * 3 + 1;
							bj.rotation = Math.round(Math.random() * 200 - 100);
							bj.x = Math.round(Math.random() * 200 - 100);
							bj.y = Math.round(Math.random() * 200 - 100)
						} else {
							if (a9.hasClass("lfr") || a9.hasClass("skewfromright")) {
								bj.x = 15 + f.width
							} else {
								if (a9.hasClass("lfl") || a9.hasClass("skewfromleft")) {
									bj.x = -15 - I
								} else {
									if (a9.hasClass("sfl") || a9.hasClass("skewfromleftshort")) {
										bj.x = -50
									} else {
										if (a9.hasClass("sfr") || a9.hasClass("skewfromrightshort")) {
											bj.x = 50
										} else {
											if (a9.hasClass("lft")) {
												bj.y = -25 - bp
											} else {
												if (a9.hasClass("lfb")) {
													bj.y = 25 + f.height
												} else {
													if (a9.hasClass("sft")) {
														bj.y = -50
													} else {
														if (a9.hasClass("sfb")) {
															bj.y = 50
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
					if (a9.hasClass("skewfromright") || a9.hasClass("skewfromrightshort")) {
						bj.skewX = -85
					} else {
						if (a9.hasClass("skewfromleft") || a9.hasClass("skewfromleftshort")) {
							bj.skewX = 85
						}
					}
					if (a9.hasClass("fade") || a9.hasClass("sft") || a9.hasClass("sfl") || a9.hasClass("sfb") || a9.hasClass("skewfromleftshort") || a9.hasClass("sfr") || a9.hasClass("skewfromrightshort")) {
						bj.opacity = 0
					}
					if (aa().toLowerCase() == "safari") {
						bj.rotationX = 0;
						bj.rotationY = 0
					}
					var a7 = a9.data("elementdelay") == aP ? 0 : a9.data("elementdelay");
					bq.ease = bj.ease = a9.data("easing") == aP ? Power1.easeInOut : a9.data("easing");
					bj.data = new Object;
					bj.data.oldx = bj.x;
					bj.data.oldy = bj.y;
					bq.data = new Object;
					bq.data.oldx = bq.x;
					bq.data.oldy = bq.y;
					bj.x = bj.x * r;
					bj.y = bj.y * r;
					var bk = new TimelineLite;
					if (a9.hasClass("customin")) {
						if (X != a9) {
							a6.add(TweenLite.set(a9, {
								opacity : 1,
								scaleX : 1,
								scaleY : 1,
								rotationX : 0,
								rotationY : 0,
								rotationZ : 0,
								skewX : 0,
								skewY : 0,
								z : 0,
								x : 0,
								y : 0,
								visibility : "visible",
								opacity : 1,
								delay : 0,
								overwrite : "all"
							}))
						}
						bj.visibility = "hidden";
						bq.visibility = "visible";
						bq.overwrite = "all";
						bq.opacity = 1;
						bq.onComplete = a4();
						bq.delay = bc;a6.add(bk.staggerFromTo(X, o, bj, bq, a7), "frame0")
					} else {
						bj.visibility = "visible";
						bj.transformPerspective = 600;
						if (X != a9) {
							a6.add(TweenLite.set(a9, {
								opacity : 1,
								scaleX : 1,
								scaleY : 1,
								rotationX : 0,
								rotationY : 0,
								rotationZ : 0,
								skewX : 0,
								skewY : 0,
								z : 0,
								x : 0,
								y : 0,
								visibility : "visible",
								opacity : 1,
								delay : 0,
								overwrite : "all"
							}))
						}
						bq.visibility = "visible";
						bq.delay = bc;
						bq.onComplete = a4();
						bq.opacity = 1;
						if (a9.hasClass("randomrotate") && X != a9) {
							for (var bd = 0; bd < X.length; bd++) {
								var bu = new Object;
								var U = new Object;
								ak.extend(bu, bj);ak.extend(U, bq);
								bj.scale = Math.random() * 3 + 1;
								bj.rotation = Math.round(Math.random() * 200 - 100);
								bj.x = Math.round(Math.random() * 200 - 100);
								bj.y = Math.round(Math.random() * 200 - 100);
								if (bd != 0) {
									U.delay = bc + bd * a7
								}
								a6.append(TweenLite.fromTo(X[bd], o, bu, U), "frame0")
							}
						} else {
							a6.add(bk.staggerFromTo(X, o, bj, bq, a7), "frame0")
						}
					}
					a9.data("timeline", a6);
					var bo = new Array;
					if (a9.data("frames") != aP) {
						var bf = a9.data("frames");
						bf = bf.replace(/\s+/g, "");
						bf = bf.replace("{", "");
						var bl = bf.split("}");
						ak.each(bl, function(a, j) {
							if (j.length > 0) {
								var h = aY(j);
								aq(a9, f, h, "frame" + (a + 10), r)
							}
						})
					}
					a6 = a9.data("timeline");
					if (a9.data("end") != aP) {
						a0(a9, f, a9.data("end") / 1000, bj, "frame99", r)
					} else {
						a0(a9, f, 999999, bj, "frame99", r)
					}
					a6 = a9.data("timeline");a9.data("timeline", a6)
				}
			}
			if (c) {
				if (a9.data("timeline") != aP) {
					var a5 = a9.data("timeline").getTweensOf();
					ak.each(a5, function(a, j) {
						if (j.vars.data != aP) {
							var k = j.vars.data.oldx * r;
							var h = j.vars.data.oldy * r;
							if (j.progress() != 1 && j.progress() != 0) {
								try {
									j.vars.x = k;
									j.vary.y = h
								} catch (l) {}
							} else {
								if (j.progress() == 1) {
									TweenLite.set(j.target, {
										x : k,
										y : h
									})
								}
							}
						}
					})
				}
			}
		});var b = ak("body").find("#" + f.container.attr("id")).find(".tp-bannertimer");
		b.data("opt", f)
	}
	function aa() {
		var a = navigator.appName,
			d = navigator.userAgent,
			b;
		var c = d.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
		if (c && (b = d.match(/version\/([\.\d]+)/i)) != null) {
			c[2] = b[1]
		}
		c = c ? [ c[1], c[2] ] : [ a, navigator.appVersion, "-?" ];return c[0]
	}
	function aw() {
		var a = navigator.appName,
			d = navigator.userAgent,
			b;
		var c = d.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
		if (c && (b = d.match(/version\/([\.\d]+)/i)) != null) {
			c[2] = b[1]
		}
		c = c ? [ c[1], c[2] ] : [ a, navigator.appVersion, "-?" ];return c[1]
	}
	function ay(a, b) {
		if (a.data("fsize") == aP) {
			a.data("fsize", parseInt(a.css("font-size"), 0) || 0)
		}
		if (a.data("pt") == aP) {
			a.data("pt", parseInt(a.css("paddingTop"), 0) || 0)
		}
		if (a.data("pb") == aP) {
			a.data("pb", parseInt(a.css("paddingBottom"), 0) || 0)
		}
		if (a.data("pl") == aP) {
			a.data("pl", parseInt(a.css("paddingLeft"), 0) || 0)
		}
		if (a.data("pr") == aP) {
			a.data("pr", parseInt(a.css("paddingRight"), 0) || 0)
		}
		if (a.data("mt") == aP) {
			a.data("mt", parseInt(a.css("marginTop"), 0) || 0)
		}
		if (a.data("mb") == aP) {
			a.data("mb", parseInt(a.css("marginBottom"), 0) || 0)
		}
		if (a.data("ml") == aP) {
			a.data("ml", parseInt(a.css("marginLeft"), 0) || 0)
		}
		if (a.data("mr") == aP) {
			a.data("mr", parseInt(a.css("marginRight"), 0) || 0)
		}
		if (a.data("bt") == aP) {
			a.data("bt", parseInt(a.css("borderTopWidth"), 0) || 0)
		}
		if (a.data("bb") == aP) {
			a.data("bb", parseInt(a.css("borderBottomWidth"), 0) || 0)
		}
		if (a.data("bl") == aP) {
			a.data("bl", parseInt(a.css("borderLeftWidth"), 0) || 0)
		}
		if (a.data("br") == aP) {
			a.data("br", parseInt(a.css("borderRightWidth"), 0) || 0)
		}
		if (a.data("ls") == aP) {
			a.data("ls", parseInt(a.css("letterSpacing"), 0) || 0)
		}
		if (a.data("lh") == aP) {
			a.data("lh", parseInt(a.css("lineHeight"), 0) || 0)
		}
		if (a.data("minwidth") == aP) {
			a.data("minwidth", parseInt(a.css("minWidth"), 0) || 0)
		}
		if (a.data("minheight") == aP) {
			a.data("minheight", parseInt(a.css("minHeight"), 0) || 0)
		}
		if (a.data("maxwidth") == aP) {
			a.data("maxwidth", parseInt(a.css("maxWidth"), 0) || "none")
		}
		if (a.data("maxheight") == aP) {
			a.data("maxheight", parseInt(a.css("maxHeight"), 0) || "none")
		}
		if (a.data("wan") == aP) {
			a.data("wan", a.css("-webkit-transition"))
		}
		if (a.data("moan") == aP) {
			a.data("moan", a.css("-moz-animation-transition"))
		}
		if (a.data("man") == aP) {
			a.data("man", a.css("-ms-animation-transition"))
		}
		if (a.data("ani") == aP) {
			a.data("ani", a.css("transition"))
		}
		if (!a.hasClass("tp-splitted")) {
			a.css("-webkit-transition", "none");a.css("-moz-transition", "none");a.css("-ms-transition", "none");a.css("transition", "none");TweenLite.set(a, {
				fontSize : Math.round(a.data("fsize") * b.bw) + "px",
				letterSpacing : Math.floor(a.data("ls") * b.bw) + "px",
				paddingTop : Math.round(a.data("pt") * b.bh) + "px",
				paddingBottom : Math.round(a.data("pb") * b.bh) + "px",
				paddingLeft : Math.round(a.data("pl") * b.bw) + "px",
				paddingRight : Math.round(a.data("pr") * b.bw) + "px",
				marginTop : a.data("mt") * b.bh + "px",
				marginBottom : a.data("mb") * b.bh + "px",
				marginLeft : a.data("ml") * b.bw + "px",
				marginRight : a.data("mr") * b.bw + "px",
				borderTopWidth : Math.round(a.data("bt") * b.bh) + "px",
				borderBottomWidth : Math.round(a.data("bb") * b.bh) + "px",
				borderLeftWidth : Math.round(a.data("bl") * b.bw) + "px",
				borderRightWidth : Math.round(a.data("br") * b.bw) + "px",
				lineHeight : Math.round(a.data("lh") * b.bh) + "px",
				minWidth : a.data("minwidth") * b.bw + "px",
				minHeight : a.data("minheight") * b.bh + "px",
				overwrite : "auto"
			});setTimeout(function() {
				a.css("-webkit-transition", a.data("wan"));a.css("-moz-transition", a.data("moan"));a.css("-ms-transition", a.data("man"));a.css("transition", a.data("ani"))
			}, 30);
			if (a.data("maxheight") != "none") {
				a.css({
					maxHeight : a.data("maxheight") * b.bh + "px"
				})
			}
			if (a.data("maxwidth") != "none") {
				a.css({
					maxWidth : a.data("maxwidth") * b.bw + "px"
				})
			}
		}
	}
	function aK(b, a) {
		b.find(".tp-caption").each(function(v) {
			var k = ak(this);
			if (k.find("iframe").length > 0) {
				try {
					var p = k.find("iframe");
					var h = p.attr("id");
					var q = $f(h);
					q.api("pause");clearTimeout(k.data("timerplay"))
				} catch (m) {} try {
					var w = k.data("player");
					w.stopVideo();clearTimeout(k.data("timerplay"))
				} catch (m) {}
			}
			if (k.find("video").length > 0) {
				try {
					k.find("video").each(function(o) {
						var f = ak(this).parent();
						var l = f.attr("id");
						clearTimeout(f.data("timerplay"));
						var c = this;
						c.pause()
					})
				} catch (m) {}
			}
			try {
				var d = k.data("timeline");
				var g = d.getLabelTime("frame99");
				var j = d.time();
				if (g > j) {
					var e = d.getTweensOf(k);
					ak.each(e, function(c, f) {
						if (c != 0) {
							f.pause()
						}
					});
					if (k.css("opacity") != 0) {
						d.play("frame99")
					} else {
						d.progress(1, false)
					}
				}
			} catch (m) {}
		})
	}
	function aq(c, f, h, d, j) {
		var g = c.data("timeline");
		var k = new TimelineLite;
		var b = c;
		if (h.typ == "chars") {
			b = c.data("mySplitText").chars
		} else {
			if (h.typ == "words") {
				b = c.data("mySplitText").words
			} else {
				if (h.typ == "lines") {
					b = c.data("mySplitText").lines
				}
			}
		}
		h.animation.ease = h.ease;
		if (h.animation.rotationZ != aP) {
			h.animation.rotation = h.animation.rotationZ
		}
		h.animation.data = new Object;
		h.animation.data.oldx = h.animation.x;
		h.animation.data.oldy = h.animation.y;
		h.animation.x = h.animation.x * j;
		h.animation.y = h.animation.y * j;g.add(k.staggerTo(b, h.speed, h.animation, h.elementdelay), h.start);g.addLabel(d, h.start);c.data("timeline", g)
	}
	function a0(g, q, v, m, w, t) {
		var x = g.data("timeline");
		var b = new TimelineLite;
		var j = a1();
		var p = g.data("endspeed") == aP ? g.data("speed") : g.data("endspeed");
		j.ease = g.data("endeasing") == aP ? Power1.easeInOut : g.data("endeasing");
		p = p / 1000;
		if (g.hasClass("ltr") || g.hasClass("ltl") || g.hasClass("str") || g.hasClass("stl") || g.hasClass("ltt") || g.hasClass("ltb") || g.hasClass("stt") || g.hasClass("stb") || g.hasClass("skewtoright") || g.hasClass("skewtorightshort") || g.hasClass("skewtoleft") || g.hasClass("skewtoleftshort") || g.hasClass("fadeout") || g.hasClass("randomrotateout")) {
			if (g.hasClass("skewtoright") || g.hasClass("skewtorightshort")) {
				j.skewX = 35
			} else {
				if (g.hasClass("skewtoleft") || g.hasClass("skewtoleftshort")) {
					j.skewX = -35
				}
			}
			if (g.hasClass("ltr") || g.hasClass("skewtoright")) {
				j.x = q.width + 60
			} else {
				if (g.hasClass("ltl") || g.hasClass("skewtoleft")) {
					j.x = 0 - (q.width + 60)
				} else {
					if (g.hasClass("ltt")) {
						j.y = 0 - (q.height + 60)
					} else {
						if (g.hasClass("ltb")) {
							j.y = q.height + 60
						} else {
							if (g.hasClass("str") || g.hasClass("skewtorightshort")) {
								j.x = 50;
								j.opacity = 0
							} else {
								if (g.hasClass("stl") || g.hasClass("skewtoleftshort")) {
									j.x = -50;
									j.opacity = 0
								} else {
									if (g.hasClass("stt")) {
										j.y = -50;
										j.opacity = 0
									} else {
										if (g.hasClass("stb")) {
											j.y = 50;
											j.opacity = 0
										} else {
											if (g.hasClass("randomrotateout")) {
												j.x = Math.random() * q.width;
												j.y = Math.random() * q.height;
												j.scale = Math.random() * 2 + 0.3;
												j.rotation = Math.random() * 360 - 180;
												j.opacity = 0
											} else {
												if (g.hasClass("fadeout")) {
													j.opacity = 0
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
			if (g.hasClass("skewtorightshort")) {
				j.x = 270
			} else {
				if (g.hasClass("skewtoleftshort")) {
					j.x = -270
				}
			}
			j.data = new Object;
			j.data.oldx = j.x;
			j.data.oldy = j.y;
			j.x = j.x * t;
			j.y = j.y * t;
			j.overwrite = "auto";
			var d = g;
			var d = g;
			if (g.data("splitout") == "chars") {
				d = g.data("mySplitText").chars
			} else {
				if (g.data("splitout") == "words") {
					d = g.data("mySplitText").words
				} else {
					if (g.data("splitout") == "lines") {
						d = g.data("mySplitText").lines
					}
				}
			}
			var k = g.data("endelementdelay") == aP ? 0 : g.data("endelementdelay");
			x.add(b.staggerTo(d, p, j, k), v)
		} else {
			if (g.hasClass("customout")) {
				j = aW(j, g.data("customout"));
				var d = g;
				if (g.data("splitout") == "chars") {
					d = g.data("mySplitText").chars
				} else {
					if (g.data("splitout") == "words") {
						d = g.data("mySplitText").words
					} else {
						if (g.data("splitout") == "lines") {
							d = g.data("mySplitText").lines
						}
					}
				}
				var k = g.data("endelementdelay") == aP ? 0 : g.data("endelementdelay");
				j.onStart = function() {
					TweenLite.set(g, {
						transformPerspective : j.transformPerspective,
						transformOrigin : j.transformOrigin,
						overwrite : "auto"
					})
				};
				j.data = new Object;
				j.data.oldx = j.x;
				j.data.oldy = j.y;
				j.x = j.x * t;
				j.y = j.y * t;x.add(b.staggerTo(d, p, j, k), v)
			} else {
				m.delay = 0;x.add(TweenLite.to(g, p, m), v)
			}
		}
		x.addLabel(w, v);g.data("timeline", x)
	}
	function a2(c, a) {
		c.children().each(function() {
			try {
				ak(this).die("click")
			} catch (d) {} try {
				ak(this).die("mouseenter")
			} catch (d) {} try {
				ak(this).die("mouseleave")
			} catch (d) {} try {
				ak(this).unbind("hover")
			} catch (d) {}
		});try {
			c.die("click", "mouseenter", "mouseleave")
		} catch (b) {} clearInterval(a.cdint);
		c = null
	}
	function am(b, d) {
		d.cd = 0;
		d.loop = 0;
		if (d.stopAfterLoops != aP && d.stopAfterLoops > -1) {
			d.looptogo = d.stopAfterLoops
		} else {
			d.looptogo = 9999999
		}
		if (d.stopAtSlide != aP && d.stopAtSlide > -1) {
			d.lastslidetoshow = d.stopAtSlide
		} else {
			d.lastslidetoshow = 999
		}
		d.stopLoop = "off";
		if (d.looptogo == 0) {
			d.stopLoop = "on"
		}
		if (d.slideamount > 1 && !(d.stopAfterLoops == 0 && d.stopAtSlide == 1)) {
			var a = b.find(".tp-bannertimer");
			b.on("stoptimer", function() {
				a.data("tween").pause();
				if (d.hideTimerBar == "on") {
					a.css({
						visibility : "hidden"
					})
				}
			});b.on("starttimer", function() {
				if (d.conthover != 1 && d.videoplaying != true && d.width > d.hideSliderAtLimit && d.bannertimeronpause != true && d.overnav != true) {
					if (d.stopLoop == "on" && d.next == d.lastslidetoshow - 1) {
					} else {
						a.css({
							visibility : "visible"
						});a.data("tween").play()
					}
				}
				if (d.hideTimerBar == "on") {
					a.css({
						visibility : "hidden"
					})
				}
			});b.on("restarttimer", function() {
				if (d.stopLoop == "on" && d.next == d.lastslidetoshow - 1) {
				} else {
					a.css({
						visibility : "visible"
					});a.data("tween", TweenLite.fromTo(a, d.delay / 1000, {
						width : "0%"
					}, {
						width : "100%",
						ease : Linear.easeNone,
						onComplete : c,
						delay : 1
					}))
				}
				if (d.hideTimerBar == "on") {
					a.css({
						visibility : "hidden"
					})
				}
			});b.on("nulltimer", function() {
				a.data("tween").pause(0);
				if (d.hideTimerBar == "on") {
					a.css({
						visibility : "hidden"
					})
				}
			});
			function c() {
				if (ak("body").find(b).length == 0) {
					a2(b, d);clearInterval(d.cdint)
				}
				if (b.data("conthover-changed") == 1) {
					d.conthover = b.data("conthover");b.data("conthover-changed", 0)
				}
				d.act = d.next;
				d.next = d.next + 1;
				if (d.next > b.find(">ul >li").length - 1) {
					d.next = 0;
					d.looptogo = d.looptogo - 1;
					if (d.looptogo <= 0) {
						d.stopLoop = "on"
					}
				}
				if (d.stopLoop == "on" && d.next == d.lastslidetoshow - 1) {
					b.find(".tp-bannertimer").css({
						visibility : "hidden"
					});b.trigger("revolution.slide.onstop")
				} else {
					a.data("tween").restart()
				}
				ah(b, d)
			}
			a.data("tween", TweenLite.fromTo(a, d.delay / 1000, {
				width : "0%"
			}, {
				width : "100%",
				ease : Linear.easeNone,
				onComplete : c,
				delay : 1
			}));a.data("opt", d);b.hover(function() {
				if (d.onHoverStop == "on" && !aN()) {
					b.trigger("stoptimer");b.trigger("revolution.slide.onpause");
					var e = b.find(">ul >li:eq(" + d.next + ") .slotholder");
					e.find(".defaultimg").each(function() {
						var f = ak(this);
						if (f.data("kenburn") != aP) {
							f.data("kenburn").pause()
						}
					})
				}
			}, function() {
				if (b.data("conthover") != 1) {
					b.trigger("revolution.slide.onresume");b.trigger("starttimer");
					var e = b.find(">ul >li:eq(" + d.next + ") .slotholder");
					e.find(".defaultimg").each(function() {
						var f = ak(this);
						if (f.data("kenburn") != aP) {
							f.data("kenburn").play()
						}
					})
				}
			})
		}
	}
	ak.fn.extend({
		revolution : function(a) {
			ak.fn.revolution.defaults = {
				delay : 9000,
				startheight : 500,
				startwidth : 960,
				fullScreenAlignForce : "off",
				autoHeight : "off",
				hideTimerBar : "off",
				hideThumbs : 200,
				hideNavDelayOnMobile : 1500,
				thumbWidth : 100,
				thumbHeight : 50,
				thumbAmount : 3,
				navigationType : "bullet",
				navigationArrows : "solo",
				hideThumbsOnMobile : "off",
				hideBulletsOnMobile : "off",
				hideArrowsOnMobile : "off",
				hideThumbsUnderResoluition : 0,
				navigationStyle : "round",
				navigationHAlign : "center",
				navigationVAlign : "bottom",
				navigationHOffset : 0,
				navigationVOffset : 20,
				soloArrowLeftHalign : "left",
				soloArrowLeftValign : "center",
				soloArrowLeftHOffset : 20,
				soloArrowLeftVOffset : 0,
				soloArrowRightHalign : "right",
				soloArrowRightValign : "center",
				soloArrowRightHOffset : 20,
				soloArrowRightVOffset : 0,
				keyboardNavigation : "on",
				touchenabled : "on",
				onHoverStop : "on",
				stopAtSlide : -1,
				stopAfterLoops : -1,
				hideCaptionAtLimit : 0,
				hideAllCaptionAtLimit : 0,
				hideSliderAtLimit : 0,
				shadow : 0,
				fullWidth : "off",
				fullScreen : "off",
				minFullScreenHeight : 0,
				fullScreenOffsetContainer : "",
				dottedOverlay : "none",
				forceFullWidth : "off",
				spinner : "spinner0",
				swipe_velocity : 0.4,
				swipe_max_touches : 1,
				swipe_min_touches : 1,
				drag_block_vertical : false,
				isJoomla : false,
				parallax : "off",
				parallaxLevels : [ 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85 ]
			};
			a = ak.extend({}, ak.fn.revolution.defaults, a);return this.each(function() {
				var B = a;
				B.desktop = !navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|BB10|mobi|tablet|opera mini|nexus 7)/i);
				if (B.fullWidth != "on" && B.fullScreen != "on") {
					B.autoHeight = "off"
				}
				if (B.fullScreen == "on") {
					B.autoHeight = "on"
				}
				if (B.fullWidth != "on" && B.fullScreen != "on") {
					forceFulWidth = "off"
				}
				var I = ak(this);
				if (B.fullWidth == "on" && B.autoHeight == "off") {
					I.css({
						maxHeight : B.startheight + "px"
					})
				}
				if (aN() && B.hideThumbsOnMobile == "on" && B.navigationType == "thumb") {
					B.navigationType = "none"
				}
				if (aN() && B.hideBulletsOnMobile == "on" && B.navigationType == "bullet") {
					B.navigationType = "none"
				}
				if (aN() && B.hideBulletsOnMobile == "on" && B.navigationType == "both") {
					B.navigationType = "none"
				}
				if (aN() && B.hideArrowsOnMobile == "on") {
					B.navigationArrows = "none"
				}
				if (B.forceFullWidth == "on") {
					var n = I.parent().offset().left;
					var s = I.parent().css("marginBottom");
					var v = I.parent().css("marginTop");
					if (s == aP) {
						s = 0
					}
					if (v == aP) {
						v = 0
					}
					I.parent().wrap('<div style="position:relative;width:100%;height:auto;margin-top:' + v + ";margin-bottom:" + s + '" class="forcefullwidth_wrapper_tp_banner"></div>');I.closest(".forcefullwidth_wrapper_tp_banner").append('<div class="tp-fullwidth-forcer" style="width:100%;height:' + I.height() + 'px"></div>');I.css({
						backgroundColor : I.parent().css("backgroundColor"),
						backgroundImage : I.parent().css("backgroundImage")
					});I.parent().css({
						left : 0 - n + "px",
						position : "absolute",
						width : ak(window).width()
					});
					B.width = ak(window).width()
				}
				try {
					if (B.hideThumbsUnderResolution > ak(window).width() && B.hideThumbsUnderResolution != 0) {
						I.parent().find(".tp-bullets.tp-thumbs").css({
							display : "none"
						})
					} else {
						I.parent().find(".tp-bullets.tp-thumbs").css({
							display : "block"
						})
					}
				} catch (p) {}
				if (!I.hasClass("revslider-initialised")) {
					I.addClass("revslider-initialised");
					if (I.attr("id") == aP) {
						I.attr("id", "revslider-" + Math.round(Math.random() * 1000 + 5))
					}
					B.firefox13 = false;
					B.ie = !ak.support.opacity;
					B.ie9 = document.documentMode == 9;
					B.origcd = B.delay;
					var e = ak.fn.jquery.split("."),
						J = parseFloat(e[0]),
						j = parseFloat(e[1]),
						F = parseFloat(e[2] || "0");
					if (J == 1 && j < 7) {
						I.html('<div style="text-align:center; padding:40px 0px; font-size:20px; color:#992222;"> The Current Version of jQuery:' + e + " <br>Please update your jQuery Version to min. 1.7 in Case you wish to use the Revolution Slider Plugin</div>")
					}
					if (J > 1) {
						B.ie = false
					}
					if (!ak.support.transition) {
						ak.fn.transition = ak.fn.animate
					}
					I.find(".caption").each(function() {
						ak(this).addClass("tp-caption")
					});
					if (aN()) {
						I.find(".tp-caption").each(function() {
							if (ak(this).data("autoplay") == true) {
								ak(this).data("autoplay", false)
							}
						})
					}
					var K = 0;
					var G = 0;
					var z = 0;
					var r = "http";
					if (location.protocol === "https:") {
						r = "https"
					}
					I.find(".tp-caption iframe").each(function(m) {
						try {
							if (ak(this).attr("src").indexOf("you") > 0 && K == 0) {
								K = 1;
								var f = document.createElement("script");
								var k = "https";
								f.src = k + "://www.youtube.com/iframe_api";
								var b = document.getElementsByTagName("script")[0];
								var l = true;
								ak("head").find("*").each(function() {
									if (ak(this).attr("src") == k + "://www.youtube.com/iframe_api") {
										l = false
									}
								});
								if (l) {
									b.parentNode.insertBefore(f, b)
								}
							}
						} catch (g) {}
					});I.find(".tp-caption iframe").each(function(l) {
						try {
							if (ak(this).attr("src").indexOf("vim") > 0 && G == 0) {
								G = 1;
								var f = document.createElement("script");
								f.src = r + "://a.vimeocdn.com/js/froogaloop2.min.js";
								var g = document.getElementsByTagName("script")[0];
								var b = true;
								ak("head").find("*").each(function() {
									if (ak(this).attr("src") == r + "://a.vimeocdn.com/js/froogaloop2.min.js") {
										b = false
									}
								});
								if (b) {
									g.parentNode.insertBefore(f, g)
								}
							}
						} catch (k) {}
					});I.find(".tp-caption video").each(function(b) {
						ak(this).removeClass("video-js").removeClass("vjs-default-skin");ak(this).attr("preload", "");ak(this).css({
							display : "none"
						})
					});
					if (B.shuffle == "on") {
						for (var t = 0; t < I.find(">ul:first-child >li").length; t++) {
							var d = Math.round(Math.random() * I.find(">ul:first-child >li").length);
							I.find(">ul:first-child >li:eq(" + d + ")").prependTo(I.find(">ul:first-child"))
						}
					}
					B.slots = 4;
					B.act = -1;
					B.next = 0;
					if (B.startWithSlide != aP) {
						B.next = B.startWithSlide
					}
					var y = aD("#")[0];
					if (y.length < 9) {
						if (y.split("slide").length > 1) {
							var c = parseInt(y.split("slide")[1], 0);
							if (c < 1) {
								c = 1
							}
							if (c > I.find(">ul:first >li").length) {
								c = I.find(">ul:first >li").length
							}
							B.next = c - 1
						}
					}
					B.firststart = 1;
					if (B.navigationHOffset == aP) {
						B.navOffsetHorizontal = 0
					}
					if (B.navigationVOffset == aP) {
						B.navOffsetVertical = 0
					}
					I.append('<div class="tp-loader ' + B.spinner + '"><div class="dot1"></div><div class="dot2"></div><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>');
					if (I.find(".tp-bannertimer").length == 0) {
						I.append('<div class="tp-bannertimer" style="visibility:hidden"></div>')
					}
					var h = I.find(".tp-bannertimer");
					if (h.length > 0) {
						h.css({
							width : "0%"
						})
					}
					I.addClass("tp-simpleresponsive");
					B.container = I;
					B.slideamount = I.find(">ul:first >li").length;
					if (I.height() == 0) {
						I.height(B.startheight)
					}
					if (B.startwidth == aP || B.startwidth == 0) {
						B.startwidth = I.width()
					}
					if (B.startheight == aP || B.startheight == 0) {
						B.startheight = I.height()
					}
					B.width = I.width();
					B.height = I.height();
					B.bw = B.startwidth / I.width();
					B.bh = B.startheight / I.height();
					if (B.width != B.startwidth) {
						B.height = Math.round(B.startheight * (B.width / B.startwidth));I.height(B.height)
					}
					if (B.shadow != 0) {
						I.parent().append('<div class="tp-bannershadow tp-shadow' + B.shadow + '"></div>');
						var n = 0;
						if (B.forceFullWidth == "on") {
							n = 0 - B.container.parent().offset().left
						}
						I.parent().find(".tp-bannershadow").css({
							width : B.width,
							left : n
						})
					}
					I.find("ul").css({
						display : "none"
					});
					var C = I;
					I.find("ul").css({
						display : "block"
					});aZ(I, B);
					if (B.parallax != "off") {
						aG(I, B)
					}
					if (B.slideamount > 1) {
						ag(I, B)
					}
					if (B.slideamount > 1) {
						ac(I, B)
					}
					if (B.slideamount > 1) {
						ar(I, B)
					}
					if (B.keyboardNavigation == "on") {
						aH(I, B)
					}
					ai(I, B);
					if (B.hideThumbs > 0) {
						aT(I, B)
					}
					ah(I, B);
					if (B.slideamount > 1) {
						am(I, B)
					}
					setTimeout(function() {
						I.trigger("revolution.slide.onloaded")
					}, 500);ak("body").data("rs-fullScreenMode", false);ak(window).on("mozfullscreenchange webkitfullscreenchange fullscreenchange", function() {
						ak("body").data("rs-fullScreenMode", !ak("body").data("rs-fullScreenMode"));
						if (ak("body").data("rs-fullScreenMode")) {
							setTimeout(function() {
								ak(window).trigger("resize")
							}, 200)
						}
					});ak(window).resize(function() {
						if (ak("body").find(I) != 0) {
							if (B.forceFullWidth == "on") {
								var b = B.container.closest(".forcefullwidth_wrapper_tp_banner").offset().left;
								B.container.parent().css({
									left : 0 - b + "px",
									width : ak(window).width()
								})
							}
						}
						if (I.outerWidth(true) != B.width || I.is(":hidden")) {
							aL(I, B)
						}
					});try {
						if (B.hideThumbsUnderResoluition != 0 && B.navigationType == "thumb") {
							if (B.hideThumbsUnderResoluition > ak(window).width()) {
								ak(".tp-bullets").css({
									display : "none"
								})
							} else {
								ak(".tp-bullets").css({
									display : "block"
								})
							}
						}
					} catch (p) {} I.find(".tp-scrollbelowslider").on("click", function() {
						var f = 0;
						try {
							f = ak("body").find(B.fullScreenOffsetContainer).height()
						} catch (b) {} try {
							f = f - ak(this).data("scrolloffset")
						} catch (b) {} ak("body,html").animate({
							scrollTop : I.offset().top + I.find(">ul >li").height() - f + "px"
						}, {
							duration : 400
						})
					});
					var q = I.parent();
					if (ak(window).width() < B.hideSliderAtLimit) {
						I.trigger("stoptimer");
						if (q.css("display") != "none") {
							q.data("olddisplay", q.css("display"))
						}
						q.css({
							display : "none"
						})
					}
				}
			})
		},
		revscroll : function(a) {
			return this.each(function() {
				var b = ak(this);
				ak("body,html").animate({
					scrollTop : b.offset().top + b.find(">ul >li").height() - a + "px"
				}, {
					duration : 400
				})
			})
		},
		revredraw : function(a) {
			return this.each(function() {
				var d = ak(this);
				var c = d.parent().find(".tp-bannertimer");
				var b = c.data("opt");
				aL(d, b)
			})
		},
		revpause : function(a) {
			return this.each(function() {
				var d = ak(this);
				d.data("conthover", 1);d.data("conthover-changed", 1);d.trigger("revolution.slide.onpause");
				var b = d.parent().find(".tp-bannertimer");
				var c = b.data("opt");
				c.bannertimeronpause = true;d.trigger("stoptimer")
			})
		},
		revresume : function(a) {
			return this.each(function() {
				var d = ak(this);
				d.data("conthover", 0);d.data("conthover-changed", 1);d.trigger("revolution.slide.onresume");
				var b = d.parent().find(".tp-bannertimer");
				var c = b.data("opt");
				c.bannertimeronpause = false;d.trigger("starttimer")
			})
		},
		revnext : function(a) {
			return this.each(function() {
				var b = ak(this);
				b.parent().find(".tp-rightarrow").click()
			})
		},
		revprev : function(a) {
			return this.each(function() {
				var b = ak(this);
				b.parent().find(".tp-leftarrow").click()
			})
		},
		revmaxslide : function(a) {
			return ak(this).find(">ul:first-child >li").length
		},
		revcurrentslide : function(d) {
			var b = ak(this);
			var c = b.parent().find(".tp-bannertimer");
			var a = c.data("opt");
			return a.act
		},
		revlastslide : function(d) {
			var b = ak(this);
			var c = b.parent().find(".tp-bannertimer");
			var a = c.data("opt");
			return a.lastslide
		},
		revshowslide : function(a) {
			return this.each(function() {
				var b = ak(this);
				b.data("showus", a);b.parent().find(".tp-rightarrow").click()
			})
		}
	});
	var aE = function(b, c, a) {
		aX(b, 0);
		var d = setInterval(function() {
			a.bannertimeronpause = true;a.container.trigger("stoptimer");
			a.cd = 0;
			var e = 0;
			b.find("img, .defaultimg").each(function(f) {
				if (ak(this).data("lazydone") != 1) {
					e++
				}
			});
			if (e > 0) {
				aX(b, e)
			} else {
				clearInterval(d);
				if (c != aP) {
					c()
				}
			}
		}, 100)
	}
})(jQuery);(function(q) {
	var I = q.GreenSockGlobals || q,
		D = function(a) {
			var d,
				f = a.split("."),
				c = I;
			for (d = 0; f.length > d; d++) {
				c[f[d]] = c = c[f[d]] || {}
			}
			return c
		},
		G = D("com.greensock.utils"),
		A = function(a) {
			var d = a.nodeType,
				c = "";
			if (1 === d || 9 === d || 11 === d) {
				if ("string" == typeof a.textContent) {
					return a.textContent
				}
				for (a = a.firstChild; a; a = a.nextSibling) {
					c += A(a)
				}
			} else {
				if (3 === d || 4 === d) {
					return a.nodeValue
				}
			}
			return c
		},
		H = document,
		E = H.defaultView ? H.defaultView.getComputedStyle : function() {},
		J = /([A-Z])/g,
		b = function(a, g, d, f) {
			var c;
			return (d = d || E(a, null)) ? (a = d.getPropertyValue(g.replace(J, "-$1").toLowerCase()), c = a || d.length ? a : d[g]) : a.currentStyle && (d = a.currentStyle, c = d[g]), f ? c : parseInt(c, 10) || 0
		},
		w = function(a) {
			return a.length && a[0] && (a[0].nodeType && a[0].style && !a.nodeType || a[0].length && a[0][0]) ? !0 : !1
		},
		B = function(a) {
			var h,
				d,
				f,
				c = [],
				g = a.length;
			for (h = 0; g > h; h++) {
				if (d = a[h], w(d)) {
					for (f = d.length, f = 0; d.length > f; f++) {
						c.push(d[f])
					}
				} else {
					c.push(d)
				}
			}
			return c
		},
		j = ")eefec303079ad17405c",
		z = /(?:<br>|<br\/>|<br \/>)/gi,
		F = H.all && !H.addEventListener,
		k = "<div style='position:relative;display:inline-block;" + (F ? "*display:inline;*zoom:1;'" : "'"),
		K = function(a) {
			a = a || "";
			var d = -1 !== a.indexOf("++"),
				c = 1;
			return d && (a = a.split("++").join("")), function() {
					return k + (a ? " class='" + a + (d ? c++ : "") + "'>" : ">")
			}
		},
		C = G.SplitText = I.SplitText = function(a, c) {
			if ("string" == typeof a && (a = C.selector(a)), !a) {
				throw "cannot split a null element."
			}
			this.elements = w(a) ? B(a) : [ a ], this.chars = [], this.words = [], this.lines = [], this._originals = [], this.vars = c || {}, this.split(c)
		},
		x = function(Z, aw, am, at, ay) {
			z.test(Z.innerHTML) && (Z.innerHTML = Z.innerHTML.replace(z, j));
			var ab,
				ai,
				ap,
				Q,
				ak,
				ad,
				aF,
				o,
				aB,
				aa,
				av,
				aD,
				ax,
				an = A(Z),
				v = aw.type || aw.split || "chars,words,lines",
				ah = -1 !== v.indexOf("lines") ? [] : null,
				aj = -1 !== v.indexOf("words"),
				h = -1 !== v.indexOf("chars"),
				ao = "absolute" === aw.position || aw.absolute === !0,
				al = ao ? "&#173; " : " ",
				c = -999,
				Y = E(Z),
				aq = b(Z, "paddingLeft", Y),
				ae = b(Z, "borderBottomWidth", Y) + b(Z, "borderTopWidth", Y),
				s = b(Z, "borderLeftWidth", Y) + b(Z, "borderRightWidth", Y),
				ag = b(Z, "paddingTop", Y) + b(Z, "paddingBottom", Y),
				ac = b(Z, "paddingLeft", Y) + b(Z, "paddingRight", Y),
				af = b(Z, "textAlign", Y, !0),
				ar = Z.clientHeight,
				au = Z.clientWidth,
				az = an.length,
				aG = "</div>",
				aC = K(aw.wordsClass),
				aE = K(aw.charsClass),
				aA = -1 !== (aw.linesClass || "").indexOf("++"),
				a = aw.linesClass;
			for (aA && (a = a.split("++").join("")), ap = aC(), Q = 0; az > Q; Q++) {
				ad = an.charAt(Q), ")" === ad && an.substr(Q, 20) === j ? (ap += aG + "<BR/>", Q !== az - 1 && (ap += " " + aC()), Q += 19) : " " === ad && " " !== an.charAt(Q - 1) && Q !== az - 1 ? (ap += aG, Q !== az - 1 && (ap += al + aC())) : ap += h && " " !== ad ? aE() + ad + "</div>" : ad
			}
			for (Z.innerHTML = ap + aG, ak = Z.getElementsByTagName("*"), az = ak.length, aF = [], Q = 0; az > Q; Q++) {
				aF[Q] = ak[Q]
			}
			if (ah || ao) {
				for (Q = 0; az > Q; Q++) {
					o = aF[Q], ai = o.parentNode === Z, (ai || ao || h && !aj) && (aB = o.offsetTop, ah && ai && aB !== c && "BR" !== o.nodeName && (ab = [], ah.push(ab), c = aB), ao && (o._x = o.offsetLeft, o._y = aB, o._w = o.offsetWidth, o._h = o.offsetHeight), ah && (aj !== ai && h || (ab.push(o), o._x -= aq), ai && Q && (aF[Q - 1]._wordEnd = !0)))
				}
			}
			for (Q = 0; az > Q; Q++) {
				o = aF[Q], ai = o.parentNode === Z, "BR" !== o.nodeName ? (ao && (av = o.style, aj || ai || (o._x += o.parentNode._x, o._y += o.parentNode._y), av.left = o._x + "px", av.top = o._y + "px", av.position = "absolute", av.display = "block", av.width = o._w + 1 + "px", av.height = o._h + "px"), aj ? ai ? at.push(o) : h && am.push(o) : ai ? (Z.removeChild(o), aF.splice(Q--, 1), az--) : !ai && h && (aB = !ah && !ao && o.nextSibling, Z.appendChild(o), aB || Z.appendChild(H.createTextNode(" ")), am.push(o))) : ah || ao ? (Z.removeChild(o), aF.splice(Q--, 1), az--) : aj || Z.appendChild(o)
			}
			if (ah) {
				for (ao && (aa = H.createElement("div"), Z.appendChild(aa), aD = aa.offsetWidth + "px", aB = aa.offsetParent === Z ? 0 : Z.offsetLeft, Z.removeChild(aa)), av = Z.style.cssText, Z.style.cssText = "display:none;"; Z.firstChild;) {
					Z.removeChild(Z.firstChild)
				}
				for (ax = !ao || !aj && !h, Q = 0; ah.length > Q; Q++) {
					for (ab = ah[Q], aa = H.createElement("div"), aa.style.cssText = "display:block;text-align:" + af + ";position:" + (ao ? "absolute;" : "relative;"), a && (aa.className = a + (aA ? Q + 1 : "")), ay.push(aa), az = ab.length, ak = 0; az > ak; ak++) {
						"BR" !== ab[ak].nodeName && (o = ab[ak], aa.appendChild(o), ax && (o._wordEnd || aj) && aa.appendChild(H.createTextNode(" ")), ao && (0 === ak && (aa.style.top = o._y + "px", aa.style.left = aq + aB + "px"), o.style.top = "0px", aB && (o.style.left = o._x - aB + "px")))
					}
					aj || h || (aa.innerHTML = A(aa).split(String.fromCharCode(160)).join(" ")), ao && (aa.style.width = aD, aa.style.height = o._h + "px"), Z.appendChild(aa)
				}
				Z.style.cssText = av
			}
			ao && (ar > Z.clientHeight && (Z.style.height = ar - ag + "px", ar > Z.clientHeight && (Z.style.height = ar + ae + "px")), au > Z.clientWidth && (Z.style.width = au - ac + "px", au > Z.clientWidth && (Z.style.width = au + s + "px")))
		},
		L = C.prototype;
	L.split = function(a) {
		this.isSplit && this.revert(), this.vars = a || this.vars, this._originals.length = this.chars.length = this.words.length = this.lines.length = 0;
		for (var c = 0; this.elements.length > c; c++) {
			this._originals[c] = this.elements[c].innerHTML, x(this.elements[c], this.vars, this.chars, this.words, this.lines)
		}
		return this.isSplit = !0, this
	}, L.revert = function() {
		if (!this._originals) {
			throw "revert() call wasn't scoped properly."
		}
		for (var a = this._originals.length; --a > -1;) {
			this.elements[a].innerHTML = this._originals[a]
		}
		return this.chars = [], this.words = [], this.lines = [], this.isSplit = !1, this
	}, C.selector = q.$ || q.jQuery || function(a) {
		return q.$ ? (C.selector = q.$, q.$(a)) : H ? H.getElementById("#" === a.charAt(0) ? a.substr(1) : a) : a
	}
})(window || {});jQuery(document).ready(function() {
	jQuery("#rev_slider_4").show().revolution({
		dottedOverlay : "none",
		delay : 5000,
		startwidth : 600,
		startheight : 500,
		hideThumbs : 200,
		thumbWidth : 200,
		thumbHeight : 50,
		thumbAmount : 2,
		navigationType : "thumb",
		navigationArrows : "solo",
		navigationStyle : "round",
		touchenabled : "on",
		onHoverStop : "on",
		swipe_velocity : 0.7,
		swipe_min_touches : 1,
		swipe_max_touches : 1,
		drag_block_vertical : false,
		spinner : "spinner0",
		keyboardNavigation : "off",
		navigationHAlign : "center",
		navigationVAlign : "bottom",
		navigationHOffset : 0,
		navigationVOffset : 20,
		soloArrowLeftHalign : "left",
		soloArrowLeftValign : "center",
		soloArrowLeftHOffset : 20,
		soloArrowLeftVOffset : 0,
		soloArrowRightHalign : "right",
		soloArrowRightValign : "center",
		soloArrowRightHOffset : 20,
		soloArrowRightVOffset : 0,
		shadow : 0,
		fullWidth : "on",
		fullScreen : "off",
		stopLoop : "off",
		stopAfterLoops : -1,
		stopAtSlide : -1,
		shuffle : "off",
		autoHeight : "off",
		forceFullWidth : "on",
		fullScreenAlignForce : "off",
		minFullScreenHeight : 0,
		hideNavDelayOnMobile : 1500,
		hideThumbsOnMobile : "off",
		hideBulletsOnMobile : "off",
		hideArrowsOnMobile : "off",
		hideThumbsUnderResolution : 0,
		hideSliderAtLimit : 0,
		hideCaptionAtLimit : 0,
		hideAllCaptionAtLilmit : 0,
		startWithSlide : 0,
		fullScreenOffsetContainer : ""
	})
});
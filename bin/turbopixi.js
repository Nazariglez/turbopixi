(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            currentQueue[queueIndex].run();
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
(function (process,global){
///<reference path="../defs/device.d.ts" />
//Many checks are based on https://github.com/arasatasaygin/is.js/blob/master/is.js
var userAgent = 'navigator' in window && 'userAgent' in navigator && navigator.userAgent.toLowerCase() || '', vendor = 'navigator' in window && 'vendor' in navigator && navigator.vendor.toLowerCase() || '', appVersion = 'navigator' in window && 'appVersion' in navigator && navigator.appVersion.toLowerCase() || '';
//Browsers
var isChrome = /chrome|chromium/i.test(userAgent) && /google inc/.test(vendor), isFirefox = /firefox/i.test(userAgent), isIE = /msie/i.test(userAgent) || "ActiveXObject" in window, isOpera = /^Opera\//.test(userAgent) || /\x20OPR\//.test(userAgent), isSafari = /safari/i.test(userAgent) && /apple computer/i.test(vendor);
//Devices && OS
var isIphone = /iphone/i.test(userAgent), isIpad = /ipad/i.test(userAgent), isIpod = /ipod/i.test(userAgent), isAndroid = /android/i.test(userAgent), isAndroidPhone = /android/i.test(userAgent) && /mobile/i.test(userAgent), isAndroidTablet = /android/i.test(userAgent) && !/mobile/i.test(userAgent), isLinux = /linux/i.test(appVersion), isMac = /mac/i.test(appVersion), isWindow = /win/i.test(appVersion), isWindowPhone = isWindow && /phone/i.test(userAgent), isWindowTablet = isWindow && !isWindowPhone && /touch/i.test(userAgent), isMobile = isIphone || isIpod || isAndroidPhone || isWindowPhone, isTablet = isIpad || isAndroidTablet || isWindowTablet, isDesktop = !isMobile && !isTablet, isTouchDevice = 'ontouchstart' in window || 'DocumentTouch' in window && document instanceof DocumentTouch, isCocoon = !!navigator.isCocoonJS, isNodeWebkit = !!(typeof process === "object" && process.title === "node" && typeof global === "object"), isEjecta = !!window.ejecta, isCrosswalk = /Crosswalk/.test(userAgent), isCordova = !!window.cordova, isElectron = !!(process && process.versions && (process.versions.electron || process.versions['atom-shell']));
var hasVibrate = !!navigator.vibrate && (isMobile || isTablet), hasMouseWheel = 'onwheel' in window || 'onmousewheel' in window || 'MouseScrollEvent' in window, hasAccelerometer = 'DeviceMotionEvent' in window, hasGamepad = !!navigator.getGamepads || !!navigator.webkitGetGamepads;
//FullScreen
var div = document.createElement('div');
var fullScreenRequest = div.requestFullscreen || div.webkitRequestFullScreen || div.msRequestFullScreen || div.mozRequestFullScreen, fullScreenCancel = document.cancelFullScreen || document.exitFullScreen || document.webkitCancelFullScreen || document.msCancelFullScreen || document.mozCancelFullScreen, hasFullScreen = !!(fullScreenRequest && fullScreenCancel);
//Audio
var hasHTMLAudio = !!window.Audio, webAudioContext = window.AudioContext || window.webkitAudioContext, hasWebAudio = !!webAudioContext, hasAudio = hasWebAudio || hasHTMLAudio, hasMp3 = false, hasOgg = false, hasWav = false, hasM4a = false;
//Audio mimeTypes
if (hasAudio) {
    var audio = document.createElement('audio');
    hasMp3 = audio.canPlayType('audio/mpeg;') !== "";
    hasOgg = audio.canPlayType('audio/ogg; codecs="vorbis"') !== "";
    hasWav = audio.canPlayType('audio/wav') !== "";
    hasM4a = audio.canPlayType('audio/mp4; codecs="mp4a.40.5"') !== "";
}
var Device = {
    isChrome: isChrome,
    isFirefox: isFirefox,
    isIE: isIE,
    isOpera: isOpera,
    isSafari: isSafari,
    isIphone: isIphone,
    isIpad: isIpad,
    isIpod: isIpod,
    isAndroid: isAndroid,
    isAndroidPhone: isAndroidPhone,
    isAndroidTablet: isAndroidTablet,
    isLinux: isLinux,
    isMac: isMac,
    isWindow: isWindow,
    isWindowPhone: isWindowPhone,
    isWindowTablet: isWindowTablet,
    isMobile: isMobile,
    isTablet: isTablet,
    isDesktop: isDesktop,
    isTouchDevice: isTouchDevice,
    isCocoon: isCocoon,
    isNodeWebkit: isNodeWebkit,
    isEjecta: isEjecta,
    isCordova: isCordova,
    isCrosswalk: isCrosswalk,
    isElectron: isElectron,
    isAtomShell: isElectron,
    //isOnline : navigator.onLine,
    hasVibrate: hasVibrate,
    hasMouseWheel: hasMouseWheel,
    hasFullScreen: hasFullScreen,
    hasAccelerometer: hasAccelerometer,
    hasGamepad: hasGamepad,
    fullScreenRequest: fullScreenRequest ? fullScreenRequest.name : undefined,
    fullScreenCancel: fullScreenCancel ? fullScreenCancel.name : undefined,
    hasAudio: hasAudio,
    hasHTMLAudio: hasHTMLAudio,
    hasWebAudio: hasWebAudio,
    webAudioContext: webAudioContext,
    hasMp3: hasMp3,
    hasM4a: hasM4a,
    hasOgg: hasOgg,
    hasWav: hasWav,
    getMouseWheelEvent: function () {
        if (!hasMouseWheel)
            return;
        var evt;
        if ('onwheel' in window) {
            evt = 'wheel';
        }
        else if ('onmousewheel' in window) {
            evt = 'mousewheel';
        }
        else if ('MouseScrollEvent' in window) {
            evt = 'DOMMouseScroll';
        }
        return evt;
    },
    vibrate: function (value) {
        if (hasVibrate) {
            navigator.vibrate(value);
        }
    },
    get isOnline() {
        return window.navigator.onLine;
    }
};
module.exports = Device;

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"_process":1}],3:[function(require,module,exports){
///<reference path="../defs/pixi.d.ts" />
module.exports = function inject() {
    PIXI.DisplayObject.prototype.speed = 0;
    PIXI.DisplayObject.prototype.velocity = new PIXI.Point();
    PIXI.DisplayObject.prototype.direction = 0;
    PIXI.DisplayObject.prototype.rotationSpeed = 0;
    PIXI.DisplayObject.prototype.update = function (deltaTime) {
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;
        this.rotation += this.rotationSpeed * deltaTime;
    };
    PIXI.DisplayObject.prototype.addTo = function (parent) {
        parent.addChild(this);
        return this;
    };
};

},{}],4:[function(require,module,exports){
///<reference path="../defs/pixi.d.ts" />
///<reference path="../defs/core.d.ts" />
var Device = require('./Device');
var last = 0;
var minFrameMS = 20;
var Game = (function () {
    function Game(width, height, config) {
        if (width === void 0) { width = 800; }
        if (height === void 0) { height = 600; }
        this.id = "PixiGame";
        this.stage = new PIXI.Container();
        this.delta = 0;
        this.time = 0;
        this.lastTime = 0;
        this.renderer = PIXI.autoDetectRenderer(width, height);
        this.canvas = this.renderer.view;
        document.body.appendChild(this.canvas);
        this.isWebGL = (this.renderer.type === PIXI.RENDERER_TYPE.WEBGL); //TODO: pull request en las definiciones, esto está mal
        this.isWebAudio = (Device.hasWebAudio); //TODO: check -> && config.useWebAudio
    }
    Game.prototype._animate = function () {
        this.raf = window.requestAnimationFrame(this._animate.bind(this));
        var now = Date.now();
        this.time += Math.min((now - last) / 1000, minFrameMS);
        this.delta = this.time - this.lastTime;
        this.lastTime = this.time;
        last = now;
        this.renderer.render(this.stage);
        this.update(this.delta);
    };
    Game.prototype.update = function (deltaTime) {
        for (var i = 0; i < this.stage.children.length; i++) {
            this.stage.children[i].update(this.delta);
        }
        return this;
    };
    Game.prototype.start = function () {
        this._animate();
        return this;
    };
    Game.prototype.stop = function () {
        window.cancelAnimationFrame(this.raf);
        return this;
    };
    return Game;
})();
module.exports = Game;

},{"./Device":2}],5:[function(require,module,exports){
///<reference path="./defs/pixi.d.ts" />
if (typeof PIXI === "undefined") {
    throw new Error('Not found pixi.js...');
}
var injections = require('./injections');
injections();
var Game = require('./core/Game');
var Device = require('./core/Device');
var TurboPixi = {
    Device: Device,
    Game: Game
};
//Add new classes in pixi.js
for (var c in TurboPixi) {
    PIXI[c] = TurboPixi[c];
}

},{"./core/Device":2,"./core/Game":4,"./injections":6}],6:[function(require,module,exports){
var DisplayObject = require('./core/DisplayObject');
module.exports = function inject() {
    DisplayObject();
};

},{"./core/DisplayObject":3}]},{},[5])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwiY29yZS9jb3JlL3NyYy9jb3JlL0RldmljZS50cyIsImNvcmUvc3JjL2NvcmUvRGlzcGxheU9iamVjdC50cyIsImNvcmUvc3JjL2NvcmUvR2FtZS50cyIsInNyYy9pbmRleC50cyIsInNyYy9pbmplY3Rpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzFGQSwyQ0FBMkM7QUFFM0MsQUFDQSxtRkFEbUY7SUFDL0UsU0FBUyxHQUFVLFdBQVcsSUFBSSxNQUFNLElBQUksV0FBVyxJQUFJLFNBQVMsSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUUsRUFDL0csTUFBTSxH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aUJBQUwsSUFBSSxDQUFDOzs7QUNwRWQsQUFDQSx3Q0FEd0M7QUFDeEMsRUFBRSxDQUFBLENBQUMsT0FBTyxJQUFJLEtBQUssV0FBVyxDQUFDLENBQUEsQ0FBQztJQUM1QixNQUFNLElBQUksS0FBSyxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFDNUMsQ0FBQztBQUVELElBQU8sVUFBVSxXQUFXLGNBQWMsQ0FBQyxDQUFDO0FBQzVDLFVBQVUsRUFBRSxDQUFDO0FBRWIsSUFBTyxJQUFJLFdBQVcsYUFBYSxDQUFDLENBQUM7QUFDckMsSUFBTyxNQUFNLFdBQVcsZUFBZSxDQUFDLENBQUM7QUFFekMsSUFBSSxTQUFTLEdBQUc7SUFDWixNQUFNLEVBQUUsTUFBTTtJQUNkLElBQUksRUFBRSxJQUFJO0NBQ2IsQ0FBQztBQUVGLEFBQ0EsNEJBRDRCO0FBQzVCLEdBQUcsQ0FBQSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDLENBQUEsQ0FBQztJQUNwQixJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzNCLENBQUM7OztBQ25CRCxJQUFPLGFBQWEsV0FBVyxzQkFBc0IsQ0FBQyxDQUFDO0FBRXZELEFBRUMsaUJBRlE7SUFDTCxhQUFhLEVBQUUsQ0FBQztBQUNwQixDQUFDLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHNldFRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgc2V0VGltZW91dChkcmFpblF1ZXVlLCAwKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbi8vIFRPRE8oc2h0eWxtYW4pXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9kZWZzL2RldmljZS5kLnRzXCIgLz5cblxuLy9NYW55IGNoZWNrcyBhcmUgYmFzZWQgb24gaHR0cHM6Ly9naXRodWIuY29tL2FyYXNhdGFzYXlnaW4vaXMuanMvYmxvYi9tYXN0ZXIvaXMuanNcbnZhciB1c2VyQWdlbnQ6c3RyaW5nID0gJ25hdmlnYXRvcicgaW4gd2luZG93ICYmICd1c2VyQWdlbnQnIGluIG5hdmlnYXRvciAmJiBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkgfHwgJycsXG4gICAgdmVuZG9yOnN0cmluZyA9ICduYXZpZ2F0b3InIGluIHdpbmRvdyAmJiAndmVuZG9yJyBpbiBuYXZpZ2F0b3IgJiYgbmF2aWdhdG9yLnZlbmRvci50b0xvd2VyQ2FzZSgpIHx8ICcnLFxuICAgIGFwcFZlcnNpb246c3RyaW5nID0gJ25hdmlnYXRvcicgaW4gd2luZG93ICYmICdhcHBWZXJzaW9uJyBpbiBuYXZpZ2F0b3IgJiYgbmF2aWdhdG9yLmFwcFZlcnNpb24udG9Mb3dlckNhc2UoKSB8fCAnJztcblxuLy9Ccm93c2Vyc1xudmFyIGlzQ2hyb21lOmJvb2xlYW4gPSAvY2hyb21lfGNocm9taXVtL2kudGVzdCh1c2VyQWdlbnQpICYmIC9nb29nbGUgaW5jLy50ZXN0KHZlbmRvciksXG4gICAgaXNGaXJlZm94OmJvb2xlYW4gPSAvZmlyZWZveC9pLnRlc3QodXNlckFnZW50KSxcbiAgICBpc0lFOmJvb2xlYW4gPSAvbXNpZS9pLnRlc3QodXNlckFnZW50KSB8fCBcIkFjdGl2ZVhPYmplY3RcIiBpbiB3aW5kb3csXG4gICAgaXNPcGVyYTpib29sZWFuID0gL15PcGVyYVxcLy8udGVzdCh1c2VyQWdlbnQpIHx8IC9cXHgyME9QUlxcLy8udGVzdCh1c2VyQWdlbnQpLFxuICAgIGlzU2FmYXJpOmJvb2xlYW4gPSAvc2FmYXJpL2kudGVzdCh1c2VyQWdlbnQpICYmIC9hcHBsZSBjb21wdXRlci9pLnRlc3QodmVuZG9yKTtcblxuLy9EZXZpY2VzICYmIE9TXG52YXIgaXNJcGhvbmU6Ym9vbGVhbiA9IC9pcGhvbmUvaS50ZXN0KHVzZXJBZ2VudCksXG4gICAgaXNJcGFkOmJvb2xlYW4gPSAvaXBhZC9pLnRlc3QodXNlckFnZW50KSxcbiAgICBpc0lwb2Q6Ym9vbGVhbiA9IC9pcG9kL2kudGVzdCh1c2VyQWdlbnQpLFxuICAgIGlzQW5kcm9pZDpib29sZWFuID0gL2FuZHJvaWQvaS50ZXN0KHVzZXJBZ2VudCksXG4gICAgaXNBbmRyb2lkUGhvbmU6Ym9vbGVhbiA9IC9hbmRyb2lkL2kudGVzdCh1c2VyQWdlbnQpICYmIC9tb2JpbGUvaS50ZXN0KHVzZXJBZ2VudCksXG4gICAgaXNBbmRyb2lkVGFibGV0OmJvb2xlYW4gPSAvYW5kcm9pZC9pLnRlc3QodXNlckFnZW50KSAmJiAhL21vYmlsZS9pLnRlc3QodXNlckFnZW50KSxcbiAgICBpc0xpbnV4OmJvb2xlYW4gPSAvbGludXgvaS50ZXN0KGFwcFZlcnNpb24pLFxuICAgIGlzTWFjOmJvb2xlYW4gPSAvbWFjL2kudGVzdChhcHBWZXJzaW9uKSxcbiAgICBpc1dpbmRvdzpib29sZWFuID0gL3dpbi9pLnRlc3QoYXBwVmVyc2lvbiksXG4gICAgaXNXaW5kb3dQaG9uZTpib29sZWFuID0gaXNXaW5kb3cgJiYgL3Bob25lL2kudGVzdCh1c2VyQWdlbnQpLFxuICAgIGlzV2luZG93VGFibGV0OmJvb2xlYW4gPSBpc1dpbmRvdyAmJiAhaXNXaW5kb3dQaG9uZSAmJiAvdG91Y2gvaS50ZXN0KHVzZXJBZ2VudCksXG4gICAgaXNNb2JpbGU6Ym9vbGVhbiA9IGlzSXBob25lIHx8IGlzSXBvZHx8IGlzQW5kcm9pZFBob25lIHx8IGlzV2luZG93UGhvbmUsXG4gICAgaXNUYWJsZXQ6Ym9vbGVhbiA9IGlzSXBhZCB8fCBpc0FuZHJvaWRUYWJsZXQgfHwgaXNXaW5kb3dUYWJsZXQsXG4gICAgaXNEZXNrdG9wOmJvb2xlYW4gPSAhaXNNb2JpbGUgJiYgIWlzVGFibGV0LFxuICAgIGlzVG91Y2hEZXZpY2U6Ym9vbGVhbiA9ICdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdyB8fCdEb2N1bWVudFRvdWNoJyBpbiB3aW5kb3cgJiYgZG9jdW1lbnQgaW5zdGFuY2VvZiBEb2N1bWVudFRvdWNoLFxuICAgIGlzQ29jb29uOmJvb2xlYW4gPSAhIW5hdmlnYXRvci5pc0NvY29vbkpTLFxuICAgIGlzTm9kZVdlYmtpdDpib29sZWFuID0gISEodHlwZW9mIHByb2Nlc3MgPT09IFwib2JqZWN0XCIgJiYgcHJvY2Vzcy50aXRsZSA9PT0gXCJub2RlXCIgJiYgdHlwZW9mIGdsb2JhbCA9PT0gXCJvYmplY3RcIiksXG4gICAgaXNFamVjdGE6Ym9vbGVhbiA9ICEhd2luZG93LmVqZWN0YSxcbiAgICBpc0Nyb3Nzd2Fsazpib29sZWFuID0gL0Nyb3Nzd2Fsay8udGVzdCh1c2VyQWdlbnQpLFxuICAgIGlzQ29yZG92YTpib29sZWFuID0gISF3aW5kb3cuY29yZG92YSxcbiAgICBpc0VsZWN0cm9uOmJvb2xlYW4gPSAhIShwcm9jZXNzICYmIHByb2Nlc3MudmVyc2lvbnMgJiYgKHByb2Nlc3MudmVyc2lvbnMuZWxlY3Ryb24gfHwgcHJvY2Vzcy52ZXJzaW9uc1snYXRvbS1zaGVsbCddKSk7XG5cbnZhciBoYXNWaWJyYXRlOmJvb2xlYW4gPSAhIW5hdmlnYXRvci52aWJyYXRlICYmIChpc01vYmlsZSB8fCBpc1RhYmxldCksXG4gICAgaGFzTW91c2VXaGVlbDpib29sZWFuID0gJ29ud2hlZWwnIGluIHdpbmRvdyB8fCAnb25tb3VzZXdoZWVsJyBpbiB3aW5kb3cgfHwgJ01vdXNlU2Nyb2xsRXZlbnQnIGluIHdpbmRvdyxcbiAgICBoYXNBY2NlbGVyb21ldGVyOmJvb2xlYW4gPSAnRGV2aWNlTW90aW9uRXZlbnQnIGluIHdpbmRvdyxcbiAgICBoYXNHYW1lcGFkOmJvb2xlYW4gPSAhIW5hdmlnYXRvci5nZXRHYW1lcGFkcyB8fCAhIW5hdmlnYXRvci53ZWJraXRHZXRHYW1lcGFkcztcblxuLy9GdWxsU2NyZWVuXG52YXIgZGl2OkhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG52YXIgZnVsbFNjcmVlblJlcXVlc3Q6YW55ID0gZGl2LnJlcXVlc3RGdWxsc2NyZWVuIHx8IGRpdi53ZWJraXRSZXF1ZXN0RnVsbFNjcmVlbiB8fCBkaXYubXNSZXF1ZXN0RnVsbFNjcmVlbiB8fCBkaXYubW96UmVxdWVzdEZ1bGxTY3JlZW4sXG4gICAgZnVsbFNjcmVlbkNhbmNlbDphbnkgPSBkb2N1bWVudC5jYW5jZWxGdWxsU2NyZWVuIHx8IGRvY3VtZW50LmV4aXRGdWxsU2NyZWVuIHx8IGRvY3VtZW50LndlYmtpdENhbmNlbEZ1bGxTY3JlZW4gfHwgZG9jdW1lbnQubXNDYW5jZWxGdWxsU2NyZWVuIHx8IGRvY3VtZW50Lm1vekNhbmNlbEZ1bGxTY3JlZW4sXG4gICAgaGFzRnVsbFNjcmVlbjpib29sZWFuID0gISEoZnVsbFNjcmVlblJlcXVlc3QgJiYgZnVsbFNjcmVlbkNhbmNlbCk7XG5cbi8vQXVkaW9cbnZhciBoYXNIVE1MQXVkaW86Ym9vbGVhbiA9ICEhd2luZG93LkF1ZGlvLFxuICAgIHdlYkF1ZGlvQ29udGV4dDphbnkgPSB3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQsXG4gICAgaGFzV2ViQXVkaW86Ym9vbGVhbiA9ICEhd2ViQXVkaW9Db250ZXh0LFxuICAgIGhhc0F1ZGlvOmJvb2xlYW4gPSBoYXNXZWJBdWRpbyB8fCBoYXNIVE1MQXVkaW8sXG4gICAgaGFzTXAzOmJvb2xlYW4gPSBmYWxzZSxcbiAgICBoYXNPZ2c6Ym9vbGVhbiA9IGZhbHNlLFxuICAgIGhhc1dhdjpib29sZWFuID0gZmFsc2UsXG4gICAgaGFzTTRhOmJvb2xlYW4gPSBmYWxzZTtcblxuLy9BdWRpbyBtaW1lVHlwZXNcbmlmKGhhc0F1ZGlvKXtcbiAgICB2YXIgYXVkaW86SFRNTEF1ZGlvRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2F1ZGlvJyk7XG4gICAgaGFzTXAzID0gYXVkaW8uY2FuUGxheVR5cGUoJ2F1ZGlvL21wZWc7JykgIT09IFwiXCI7XG4gICAgaGFzT2dnID0gYXVkaW8uY2FuUGxheVR5cGUoJ2F1ZGlvL29nZzsgY29kZWNzPVwidm9yYmlzXCInKSAhPT0gXCJcIjtcbiAgICBoYXNXYXYgPSBhdWRpby5jYW5QbGF5VHlwZSgnYXVkaW8vd2F2JykgIT09IFwiXCI7XG4gICAgaGFzTTRhID0gYXVkaW8uY2FuUGxheVR5cGUoJ2F1ZGlvL21wNDsgY29kZWNzPVwibXA0YS40MC41XCInKSAhPT0gXCJcIjtcbn1cblxudmFyIERldmljZSA6IERldmljZURhdGEgPSB7XG4gICAgaXNDaHJvbWUgOiBpc0Nocm9tZSxcbiAgICBpc0ZpcmVmb3ggOiBpc0ZpcmVmb3gsXG4gICAgaXNJRSA6IGlzSUUsXG4gICAgaXNPcGVyYSA6IGlzT3BlcmEsXG4gICAgaXNTYWZhcmkgOiBpc1NhZmFyaSxcbiAgICBpc0lwaG9uZSA6IGlzSXBob25lLFxuICAgIGlzSXBhZCA6IGlzSXBhZCxcbiAgICBpc0lwb2QgOiBpc0lwb2QsXG4gICAgaXNBbmRyb2lkIDogaXNBbmRyb2lkLFxuICAgIGlzQW5kcm9pZFBob25lIDogaXNBbmRyb2lkUGhvbmUsXG4gICAgaXNBbmRyb2lkVGFibGV0IDogaXNBbmRyb2lkVGFibGV0LFxuICAgIGlzTGludXggOiBpc0xpbnV4LFxuICAgIGlzTWFjIDogaXNNYWMsXG4gICAgaXNXaW5kb3cgOiBpc1dpbmRvdyxcbiAgICBpc1dpbmRvd1Bob25lIDogaXNXaW5kb3dQaG9uZSxcbiAgICBpc1dpbmRvd1RhYmxldCA6IGlzV2luZG93VGFibGV0LFxuICAgIGlzTW9iaWxlIDogaXNNb2JpbGUsXG4gICAgaXNUYWJsZXQgOiBpc1RhYmxldCxcbiAgICBpc0Rlc2t0b3AgOiBpc0Rlc2t0b3AsXG4gICAgaXNUb3VjaERldmljZSA6IGlzVG91Y2hEZXZpY2UsXG4gICAgaXNDb2Nvb24gOiBpc0NvY29vbixcbiAgICBpc05vZGVXZWJraXQgOiBpc05vZGVXZWJraXQsXG4gICAgaXNFamVjdGEgOiBpc0VqZWN0YSxcbiAgICBpc0NvcmRvdmEgOiBpc0NvcmRvdmEsXG4gICAgaXNDcm9zc3dhbGsgOiBpc0Nyb3Nzd2FsayxcbiAgICBpc0VsZWN0cm9uIDogaXNFbGVjdHJvbixcbiAgICBpc0F0b21TaGVsbCA6IGlzRWxlY3Ryb24sIC8vVE9ETzogUmVtb3ZlIHNvb24sIHdoZW4gYXRvbS1zaGVsbCAodmVyc2lvbikgaXMgZGVwcmVjYXRlZFxuXG4gICAgLy9pc09ubGluZSA6IG5hdmlnYXRvci5vbkxpbmUsXG4gICAgaGFzVmlicmF0ZSA6IGhhc1ZpYnJhdGUsXG4gICAgaGFzTW91c2VXaGVlbCA6IGhhc01vdXNlV2hlZWwsXG4gICAgaGFzRnVsbFNjcmVlbiA6IGhhc0Z1bGxTY3JlZW4sXG4gICAgaGFzQWNjZWxlcm9tZXRlciA6IGhhc0FjY2VsZXJvbWV0ZXIsXG4gICAgaGFzR2FtZXBhZCA6IGhhc0dhbWVwYWQsXG5cbiAgICBmdWxsU2NyZWVuUmVxdWVzdCA6IGZ1bGxTY3JlZW5SZXF1ZXN0ID8gZnVsbFNjcmVlblJlcXVlc3QubmFtZSA6IHVuZGVmaW5lZCxcbiAgICBmdWxsU2NyZWVuQ2FuY2VsIDogZnVsbFNjcmVlbkNhbmNlbCA/IGZ1bGxTY3JlZW5DYW5jZWwubmFtZSA6IHVuZGVmaW5lZCxcblxuICAgIGhhc0F1ZGlvIDogaGFzQXVkaW8sXG4gICAgaGFzSFRNTEF1ZGlvIDogaGFzSFRNTEF1ZGlvLFxuICAgIGhhc1dlYkF1ZGlvOiBoYXNXZWJBdWRpbyxcbiAgICB3ZWJBdWRpb0NvbnRleHQgOiB3ZWJBdWRpb0NvbnRleHQsXG5cbiAgICBoYXNNcDMgOiBoYXNNcDMsXG4gICAgaGFzTTRhIDogaGFzTTRhLFxuICAgIGhhc09nZyA6IGhhc09nZyxcbiAgICBoYXNXYXYgOiBoYXNXYXYsXG5cbiAgICBnZXRNb3VzZVdoZWVsRXZlbnQgOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYoIWhhc01vdXNlV2hlZWwpcmV0dXJuO1xuICAgICAgICB2YXIgZXZ0OnN0cmluZztcbiAgICAgICAgaWYoJ29ud2hlZWwnIGluIHdpbmRvdyl7XG4gICAgICAgICAgICBldnQgPSAnd2hlZWwnO1xuICAgICAgICB9ZWxzZSBpZignb25tb3VzZXdoZWVsJyBpbiB3aW5kb3cpe1xuICAgICAgICAgICAgZXZ0ID0gJ21vdXNld2hlZWwnO1xuICAgICAgICB9ZWxzZSBpZignTW91c2VTY3JvbGxFdmVudCcgaW4gd2luZG93KXtcbiAgICAgICAgICAgIGV2dCA9ICdET01Nb3VzZVNjcm9sbCc7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZXZ0O1xuICAgIH0sXG5cbiAgICB2aWJyYXRlIDogZnVuY3Rpb24odmFsdWU6bnVtYmVyKXtcbiAgICAgICAgaWYoaGFzVmlicmF0ZSl7XG4gICAgICAgICAgICBuYXZpZ2F0b3IudmlicmF0ZSh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgZ2V0IGlzT25saW5lKCkge1xuICAgICAgICByZXR1cm4gd2luZG93Lm5hdmlnYXRvci5vbkxpbmU7XG4gICAgfVxufTtcblxuZXhwb3J0ID0gRGV2aWNlOyIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL2RlZnMvcGl4aS5kLnRzXCIgLz5cblxuZXhwb3J0ID0gZnVuY3Rpb24gaW5qZWN0KCl7XG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5zcGVlZCA9IDA7XG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS52ZWxvY2l0eSA9IG5ldyBQSVhJLlBvaW50KCk7XG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5kaXJlY3Rpb24gPSAwO1xuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUucm90YXRpb25TcGVlZCA9IDA7XG5cbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKGRlbHRhVGltZTogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMucG9zaXRpb24ueCArPSB0aGlzLnZlbG9jaXR5LnggKiBkZWx0YVRpbWU7XG4gICAgICAgIHRoaXMucG9zaXRpb24ueSArPSB0aGlzLnZlbG9jaXR5LnkgKiBkZWx0YVRpbWU7XG4gICAgICAgIHRoaXMucm90YXRpb24gKz0gdGhpcy5yb3RhdGlvblNwZWVkICogZGVsdGFUaW1lO1xuICAgIH07XG5cbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLmFkZFRvID0gZnVuY3Rpb24ocGFyZW50KXtcbiAgICAgICAgcGFyZW50LmFkZENoaWxkKHRoaXMpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59IiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vZGVmcy9waXhpLmQudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vZGVmcy9jb3JlLmQudHNcIiAvPlxuaW1wb3J0IERldmljZSA9IHJlcXVpcmUoJy4vRGV2aWNlJyk7XG52YXIgbGFzdDpudW1iZXIgPSAwO1xudmFyIG1pbkZyYW1lTVMgPSAyMDtcblxuY2xhc3MgR2FtZSB7XG4gICAgaWQ6c3RyaW5nID0gXCJQaXhpR2FtZVwiO1xuXG4gICAgc3RhZ2U6IFBJWEkuQ29udGFpbmVyID0gbmV3IFBJWEkuQ29udGFpbmVyKCk7XG4gICAgcmFmOiBhbnk7XG5cbiAgICByZW5kZXJlcjogUElYSS5XZWJHTFJlbmRlcmVyIHwgUElYSS5DYW52YXNSZW5kZXJlcjtcbiAgICBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50O1xuXG4gICAgZGVsdGE6IG51bWJlciA9IDA7XG4gICAgdGltZTogbnVtYmVyID0gMDtcbiAgICBsYXN0VGltZTogbnVtYmVyID0gMDtcblxuICAgIGlzV2ViR0w6Ym9vbGVhbjtcbiAgICBpc1dlYkF1ZGlvOmJvb2xlYW47XG5cbiAgICBjb25zdHJ1Y3Rvcih3aWR0aDpudW1iZXIgPSA4MDAsIGhlaWdodDpudW1iZXIgPSA2MDAsIGNvbmZpZz86R2FtZUNvbmZpZykge1xuICAgICAgICB0aGlzLnJlbmRlcmVyID0gUElYSS5hdXRvRGV0ZWN0UmVuZGVyZXIod2lkdGgsIGhlaWdodCk7XG4gICAgICAgIHRoaXMuY2FudmFzID0gdGhpcy5yZW5kZXJlci52aWV3O1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMpO1xuXG4gICAgICAgIHRoaXMuaXNXZWJHTCA9ICh0aGlzLnJlbmRlcmVyLnR5cGUgPT09IFBJWEkuUkVOREVSRVJfVFlQRS5XRUJHTCk7IC8vVE9ETzogcHVsbCByZXF1ZXN0IGVuIGxhcyBkZWZpbmljaW9uZXMsIGVzdG8gZXN0w6EgbWFsXG4gICAgICAgIHRoaXMuaXNXZWJBdWRpbyA9IChEZXZpY2UuaGFzV2ViQXVkaW8pOyAvL1RPRE86IGNoZWNrIC0+ICYmIGNvbmZpZy51c2VXZWJBdWRpb1xuICAgIH1cblxuICAgIHByaXZhdGUgX2FuaW1hdGUoKSA6IHZvaWR7XG4gICAgICAgIHRoaXMucmFmID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLl9hbmltYXRlLmJpbmQodGhpcykpO1xuXG4gICAgICAgIHZhciBub3cgOiBudW1iZXIgPSBEYXRlLm5vdygpO1xuXG4gICAgICAgIHRoaXMudGltZSArPSBNYXRoLm1pbigobm93IC0gbGFzdCkvMTAwMCwgbWluRnJhbWVNUyk7XG4gICAgICAgIHRoaXMuZGVsdGEgPSB0aGlzLnRpbWUgLSB0aGlzLmxhc3RUaW1lO1xuICAgICAgICB0aGlzLmxhc3RUaW1lID0gdGhpcy50aW1lO1xuXG4gICAgICAgIGxhc3QgPSBub3c7XG5cbiAgICAgICAgdGhpcy5yZW5kZXJlci5yZW5kZXIodGhpcy5zdGFnZSk7XG5cbiAgICAgICAgdGhpcy51cGRhdGUodGhpcy5kZWx0YSk7XG4gICAgfVxuXG4gICAgdXBkYXRlKGRlbHRhVGltZTpudW1iZXIpIDogR2FtZSB7XG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLnN0YWdlLmNoaWxkcmVuLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIHRoaXMuc3RhZ2UuY2hpbGRyZW5baV0udXBkYXRlKHRoaXMuZGVsdGEpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhcnQoKTpHYW1le1xuICAgICAgICB0aGlzLl9hbmltYXRlKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0b3AoKTpHYW1le1xuICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5yYWYpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbn1cblxuZXhwb3J0ID0gR2FtZTsiLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuL2RlZnMvcGl4aS5kLnRzXCIgLz5cbmlmKHR5cGVvZiBQSVhJID09PSBcInVuZGVmaW5lZFwiKXtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBmb3VuZCBwaXhpLmpzLi4uJyk7XG59XG5cbmltcG9ydCBpbmplY3Rpb25zID0gcmVxdWlyZSgnLi9pbmplY3Rpb25zJyk7XG5pbmplY3Rpb25zKCk7XG5cbmltcG9ydCBHYW1lID0gcmVxdWlyZSgnLi9jb3JlL0dhbWUnKTtcbmltcG9ydCBEZXZpY2UgPSByZXF1aXJlKCcuL2NvcmUvRGV2aWNlJyk7XG5cbnZhciBUdXJib1BpeGkgPSB7XG4gICAgRGV2aWNlOiBEZXZpY2UsXG4gICAgR2FtZTogR2FtZVxufTtcblxuLy9BZGQgbmV3IGNsYXNzZXMgaW4gcGl4aS5qc1xuZm9yKHZhciBjIGluIFR1cmJvUGl4aSl7XG4gICAgUElYSVtjXSA9IFR1cmJvUGl4aVtjXTtcbn1cbiIsImltcG9ydCBEaXNwbGF5T2JqZWN0ID0gcmVxdWlyZSgnLi9jb3JlL0Rpc3BsYXlPYmplY3QnKTtcblxuZXhwb3J0ID0gZnVuY3Rpb24gaW5qZWN0KCl7XG4gICAgRGlzcGxheU9iamVjdCgpO1xufSJdfQ==

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
///<reference path="../defs/pixi.js.d.ts" />
module.exports = function inject() {
    PIXI.Container._killedObjects = [];
    PIXI.Container.prototype.update = function (deltaTime) {
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;
        this.rotation += this.rotationSpeed * deltaTime;
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].update(deltaTime);
        }
        return this;
    };
    PIXI.Container.prototype.addTo = function (parent) {
        parent.addChild(this);
        return this;
    };
    PIXI.Container.prototype.kill = function () {
        PIXI.Container._killedObjects.push(this);
        return this;
    };
    PIXI.Container.prototype.remove = function () {
        if (this.parent) {
            this.parent.removeChild(this);
        }
        return this;
    };
};

},{}],3:[function(require,module,exports){
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

},{"_process":1}],4:[function(require,module,exports){
///<reference path="../defs/pixi.js.d.ts" />
module.exports = function inject() {
    PIXI.DisplayObject.prototype.speed = 0;
    PIXI.DisplayObject.prototype.velocity = new PIXI.Point();
    PIXI.DisplayObject.prototype.direction = 0;
    PIXI.DisplayObject.prototype.rotationSpeed = 0;
    PIXI.DisplayObject.prototype.update = function (deltaTime) {
        return this;
    };
};

},{}],5:[function(require,module,exports){
///<reference path="../defs/pixi.js.d.ts" />
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
        this.stage.position.set(width / 2, height / 2);
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
        //clean killed objects
        var len = PIXI.Container._killedObjects.length;
        if (len) {
            for (var i = 0; i < len; i++)
                PIXI.Container._killedObjects[i].remove();
            PIXI.Container._killedObjects.length = 0;
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
    Object.defineProperty(Game.prototype, "width", {
        get: function () {
            return this.renderer.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "height", {
        get: function () {
            return this.renderer.height;
        },
        enumerable: true,
        configurable: true
    });
    return Game;
})();
module.exports = Game;

},{"./Device":3}],6:[function(require,module,exports){
///<reference path="./defs/pixi.js.d.ts" />
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

},{"./core/Device":3,"./core/Game":5,"./injections":7}],7:[function(require,module,exports){
var DisplayObject = require('./core/DisplayObject');
var Container = require('./core/Container');
module.exports = function inject() {
    DisplayObject();
    Container();
};

},{"./core/Container":2,"./core/DisplayObject":4}]},{},[6])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwiY29yZS9zcmMvY29yZS9Db250YWluZXIudHMiLCJjb3JlL2NvcmUvc3JjL2NvcmUvRGV2aWNlLnRzIiwiY29yZS9zcmMvY29yZS9EaXNwbGF5T2JqZWN0LnRzIiwiY29yZS9zcmMvY29yZS9HYW1lLnRzIiwic3JjL2luZGV4LnRzIiwic3JjL2luamVjdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRkEsNENBQTRDO0FBRTVDLEFBZ0NDLGlCQWhDUTtJQUNMLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxHQUFHLEVBQUUsQ0FBQztJQUVuQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FB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QyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzNCLENBQUM7OztBQ25CRCxJQUFPLGFBQWEsV0FBVyxzQkFBc0IsQ0FBQyxDQUFDO0FBQ3ZELElBQU8sU0FBUyxXQUFXLGtCQUFrQixDQUFDLENBQUM7QUFFL0MsQUFHQyxpQkFIUTtJQUNMLGFBQWEsRUFBRSxDQUFDO0lBQ2hCLFNBQVMsRUFBRSxDQUFDO0FBQ2hCLENBQUMsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gc2V0VGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBzZXRUaW1lb3V0KGRyYWluUXVldWUsIDApO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxuLy8gVE9ETyhzaHR5bG1hbilcbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL2RlZnMvcGl4aS5qcy5kLnRzXCIgLz5cblxuZXhwb3J0ID0gZnVuY3Rpb24gaW5qZWN0KCl7XG4gICAgUElYSS5Db250YWluZXIuX2tpbGxlZE9iamVjdHMgPSBbXTtcblxuICAgIFBJWEkuQ29udGFpbmVyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihkZWx0YVRpbWU6IG51bWJlcikge1xuICAgICAgICB0aGlzLnBvc2l0aW9uLnggKz0gdGhpcy52ZWxvY2l0eS54ICogZGVsdGFUaW1lO1xuICAgICAgICB0aGlzLnBvc2l0aW9uLnkgKz0gdGhpcy52ZWxvY2l0eS55ICogZGVsdGFUaW1lO1xuICAgICAgICB0aGlzLnJvdGF0aW9uICs9IHRoaXMucm90YXRpb25TcGVlZCAqIGRlbHRhVGltZTtcblxuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuW2ldLnVwZGF0ZShkZWx0YVRpbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIFBJWEkuQ29udGFpbmVyLnByb3RvdHlwZS5hZGRUbyA9IGZ1bmN0aW9uKHBhcmVudCl7XG4gICAgICAgIHBhcmVudC5hZGRDaGlsZCh0aGlzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIFBJWEkuQ29udGFpbmVyLnByb3RvdHlwZS5raWxsID0gZnVuY3Rpb24oKXtcbiAgICAgICAgUElYSS5Db250YWluZXIuX2tpbGxlZE9iamVjdHMucHVzaCh0aGlzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIFBJWEkuQ29udGFpbmVyLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbigpe1xuICAgICAgICBpZih0aGlzLnBhcmVudCl7XG4gICAgICAgICAgICB0aGlzLnBhcmVudC5yZW1vdmVDaGlsZCh0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9kZWZzL2RldmljZS5kLnRzXCIgLz5cblxuLy9NYW55IGNoZWNrcyBhcmUgYmFzZWQgb24gaHR0cHM6Ly9naXRodWIuY29tL2FyYXNhdGFzYXlnaW4vaXMuanMvYmxvYi9tYXN0ZXIvaXMuanNcbnZhciB1c2VyQWdlbnQ6c3RyaW5nID0gJ25hdmlnYXRvcicgaW4gd2luZG93ICYmICd1c2VyQWdlbnQnIGluIG5hdmlnYXRvciAmJiBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkgfHwgJycsXG4gICAgdmVuZG9yOnN0cmluZyA9ICduYXZpZ2F0b3InIGluIHdpbmRvdyAmJiAndmVuZG9yJyBpbiBuYXZpZ2F0b3IgJiYgbmF2aWdhdG9yLnZlbmRvci50b0xvd2VyQ2FzZSgpIHx8ICcnLFxuICAgIGFwcFZlcnNpb246c3RyaW5nID0gJ25hdmlnYXRvcicgaW4gd2luZG93ICYmICdhcHBWZXJzaW9uJyBpbiBuYXZpZ2F0b3IgJiYgbmF2aWdhdG9yLmFwcFZlcnNpb24udG9Mb3dlckNhc2UoKSB8fCAnJztcblxuLy9Ccm93c2Vyc1xudmFyIGlzQ2hyb21lOmJvb2xlYW4gPSAvY2hyb21lfGNocm9taXVtL2kudGVzdCh1c2VyQWdlbnQpICYmIC9nb29nbGUgaW5jLy50ZXN0KHZlbmRvciksXG4gICAgaXNGaXJlZm94OmJvb2xlYW4gPSAvZmlyZWZveC9pLnRlc3QodXNlckFnZW50KSxcbiAgICBpc0lFOmJvb2xlYW4gPSAvbXNpZS9pLnRlc3QodXNlckFnZW50KSB8fCBcIkFjdGl2ZVhPYmplY3RcIiBpbiB3aW5kb3csXG4gICAgaXNPcGVyYTpib29sZWFuID0gL15PcGVyYVxcLy8udGVzdCh1c2VyQWdlbnQpIHx8IC9cXHgyME9QUlxcLy8udGVzdCh1c2VyQWdlbnQpLFxuICAgIGlzU2FmYXJpOmJvb2xlYW4gPSAvc2FmYXJpL2kudGVzdCh1c2VyQWdlbnQpICYmIC9hcHBsZSBjb21wdXRlci9pLnRlc3QodmVuZG9yKTtcblxuLy9EZXZpY2VzICYmIE9TXG52YXIgaXNJcGhvbmU6Ym9vbGVhbiA9IC9pcGhvbmUvaS50ZXN0KHVzZXJBZ2VudCksXG4gICAgaXNJcGFkOmJvb2xlYW4gPSAvaXBhZC9pLnRlc3QodXNlckFnZW50KSxcbiAgICBpc0lwb2Q6Ym9vbGVhbiA9IC9pcG9kL2kudGVzdCh1c2VyQWdlbnQpLFxuICAgIGlzQW5kcm9pZDpib29sZWFuID0gL2FuZHJvaWQvaS50ZXN0KHVzZXJBZ2VudCksXG4gICAgaXNBbmRyb2lkUGhvbmU6Ym9vbGVhbiA9IC9hbmRyb2lkL2kudGVzdCh1c2VyQWdlbnQpICYmIC9tb2JpbGUvaS50ZXN0KHVzZXJBZ2VudCksXG4gICAgaXNBbmRyb2lkVGFibGV0OmJvb2xlYW4gPSAvYW5kcm9pZC9pLnRlc3QodXNlckFnZW50KSAmJiAhL21vYmlsZS9pLnRlc3QodXNlckFnZW50KSxcbiAgICBpc0xpbnV4OmJvb2xlYW4gPSAvbGludXgvaS50ZXN0KGFwcFZlcnNpb24pLFxuICAgIGlzTWFjOmJvb2xlYW4gPSAvbWFjL2kudGVzdChhcHBWZXJzaW9uKSxcbiAgICBpc1dpbmRvdzpib29sZWFuID0gL3dpbi9pLnRlc3QoYXBwVmVyc2lvbiksXG4gICAgaXNXaW5kb3dQaG9uZTpib29sZWFuID0gaXNXaW5kb3cgJiYgL3Bob25lL2kudGVzdCh1c2VyQWdlbnQpLFxuICAgIGlzV2luZG93VGFibGV0OmJvb2xlYW4gPSBpc1dpbmRvdyAmJiAhaXNXaW5kb3dQaG9uZSAmJiAvdG91Y2gvaS50ZXN0KHVzZXJBZ2VudCksXG4gICAgaXNNb2JpbGU6Ym9vbGVhbiA9IGlzSXBob25lIHx8IGlzSXBvZHx8IGlzQW5kcm9pZFBob25lIHx8IGlzV2luZG93UGhvbmUsXG4gICAgaXNUYWJsZXQ6Ym9vbGVhbiA9IGlzSXBhZCB8fCBpc0FuZHJvaWRUYWJsZXQgfHwgaXNXaW5kb3dUYWJsZXQsXG4gICAgaXNEZXNrdG9wOmJvb2xlYW4gPSAhaXNNb2JpbGUgJiYgIWlzVGFibGV0LFxuICAgIGlzVG91Y2hEZXZpY2U6Ym9vbGVhbiA9ICdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdyB8fCdEb2N1bWVudFRvdWNoJyBpbiB3aW5kb3cgJiYgZG9jdW1lbnQgaW5zdGFuY2VvZiBEb2N1bWVudFRvdWNoLFxuICAgIGlzQ29jb29uOmJvb2xlYW4gPSAhIW5hdmlnYXRvci5pc0NvY29vbkpTLFxuICAgIGlzTm9kZVdlYmtpdDpib29sZWFuID0gISEodHlwZW9mIHByb2Nlc3MgPT09IFwib2JqZWN0XCIgJiYgcHJvY2Vzcy50aXRsZSA9PT0gXCJub2RlXCIgJiYgdHlwZW9mIGdsb2JhbCA9PT0gXCJvYmplY3RcIiksXG4gICAgaXNFamVjdGE6Ym9vbGVhbiA9ICEhd2luZG93LmVqZWN0YSxcbiAgICBpc0Nyb3Nzd2Fsazpib29sZWFuID0gL0Nyb3Nzd2Fsay8udGVzdCh1c2VyQWdlbnQpLFxuICAgIGlzQ29yZG92YTpib29sZWFuID0gISF3aW5kb3cuY29yZG92YSxcbiAgICBpc0VsZWN0cm9uOmJvb2xlYW4gPSAhIShwcm9jZXNzICYmIHByb2Nlc3MudmVyc2lvbnMgJiYgKHByb2Nlc3MudmVyc2lvbnMuZWxlY3Ryb24gfHwgcHJvY2Vzcy52ZXJzaW9uc1snYXRvbS1zaGVsbCddKSk7XG5cbnZhciBoYXNWaWJyYXRlOmJvb2xlYW4gPSAhIW5hdmlnYXRvci52aWJyYXRlICYmIChpc01vYmlsZSB8fCBpc1RhYmxldCksXG4gICAgaGFzTW91c2VXaGVlbDpib29sZWFuID0gJ29ud2hlZWwnIGluIHdpbmRvdyB8fCAnb25tb3VzZXdoZWVsJyBpbiB3aW5kb3cgfHwgJ01vdXNlU2Nyb2xsRXZlbnQnIGluIHdpbmRvdyxcbiAgICBoYXNBY2NlbGVyb21ldGVyOmJvb2xlYW4gPSAnRGV2aWNlTW90aW9uRXZlbnQnIGluIHdpbmRvdyxcbiAgICBoYXNHYW1lcGFkOmJvb2xlYW4gPSAhIW5hdmlnYXRvci5nZXRHYW1lcGFkcyB8fCAhIW5hdmlnYXRvci53ZWJraXRHZXRHYW1lcGFkcztcblxuLy9GdWxsU2NyZWVuXG52YXIgZGl2OkhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG52YXIgZnVsbFNjcmVlblJlcXVlc3Q6YW55ID0gZGl2LnJlcXVlc3RGdWxsc2NyZWVuIHx8IGRpdi53ZWJraXRSZXF1ZXN0RnVsbFNjcmVlbiB8fCBkaXYubXNSZXF1ZXN0RnVsbFNjcmVlbiB8fCBkaXYubW96UmVxdWVzdEZ1bGxTY3JlZW4sXG4gICAgZnVsbFNjcmVlbkNhbmNlbDphbnkgPSBkb2N1bWVudC5jYW5jZWxGdWxsU2NyZWVuIHx8IGRvY3VtZW50LmV4aXRGdWxsU2NyZWVuIHx8IGRvY3VtZW50LndlYmtpdENhbmNlbEZ1bGxTY3JlZW4gfHwgZG9jdW1lbnQubXNDYW5jZWxGdWxsU2NyZWVuIHx8IGRvY3VtZW50Lm1vekNhbmNlbEZ1bGxTY3JlZW4sXG4gICAgaGFzRnVsbFNjcmVlbjpib29sZWFuID0gISEoZnVsbFNjcmVlblJlcXVlc3QgJiYgZnVsbFNjcmVlbkNhbmNlbCk7XG5cbi8vQXVkaW9cbnZhciBoYXNIVE1MQXVkaW86Ym9vbGVhbiA9ICEhd2luZG93LkF1ZGlvLFxuICAgIHdlYkF1ZGlvQ29udGV4dDphbnkgPSB3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQsXG4gICAgaGFzV2ViQXVkaW86Ym9vbGVhbiA9ICEhd2ViQXVkaW9Db250ZXh0LFxuICAgIGhhc0F1ZGlvOmJvb2xlYW4gPSBoYXNXZWJBdWRpbyB8fCBoYXNIVE1MQXVkaW8sXG4gICAgaGFzTXAzOmJvb2xlYW4gPSBmYWxzZSxcbiAgICBoYXNPZ2c6Ym9vbGVhbiA9IGZhbHNlLFxuICAgIGhhc1dhdjpib29sZWFuID0gZmFsc2UsXG4gICAgaGFzTTRhOmJvb2xlYW4gPSBmYWxzZTtcblxuLy9BdWRpbyBtaW1lVHlwZXNcbmlmKGhhc0F1ZGlvKXtcbiAgICB2YXIgYXVkaW86SFRNTEF1ZGlvRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2F1ZGlvJyk7XG4gICAgaGFzTXAzID0gYXVkaW8uY2FuUGxheVR5cGUoJ2F1ZGlvL21wZWc7JykgIT09IFwiXCI7XG4gICAgaGFzT2dnID0gYXVkaW8uY2FuUGxheVR5cGUoJ2F1ZGlvL29nZzsgY29kZWNzPVwidm9yYmlzXCInKSAhPT0gXCJcIjtcbiAgICBoYXNXYXYgPSBhdWRpby5jYW5QbGF5VHlwZSgnYXVkaW8vd2F2JykgIT09IFwiXCI7XG4gICAgaGFzTTRhID0gYXVkaW8uY2FuUGxheVR5cGUoJ2F1ZGlvL21wNDsgY29kZWNzPVwibXA0YS40MC41XCInKSAhPT0gXCJcIjtcbn1cblxudmFyIERldmljZSA6IERldmljZURhdGEgPSB7XG4gICAgaXNDaHJvbWUgOiBpc0Nocm9tZSxcbiAgICBpc0ZpcmVmb3ggOiBpc0ZpcmVmb3gsXG4gICAgaXNJRSA6IGlzSUUsXG4gICAgaXNPcGVyYSA6IGlzT3BlcmEsXG4gICAgaXNTYWZhcmkgOiBpc1NhZmFyaSxcbiAgICBpc0lwaG9uZSA6IGlzSXBob25lLFxuICAgIGlzSXBhZCA6IGlzSXBhZCxcbiAgICBpc0lwb2QgOiBpc0lwb2QsXG4gICAgaXNBbmRyb2lkIDogaXNBbmRyb2lkLFxuICAgIGlzQW5kcm9pZFBob25lIDogaXNBbmRyb2lkUGhvbmUsXG4gICAgaXNBbmRyb2lkVGFibGV0IDogaXNBbmRyb2lkVGFibGV0LFxuICAgIGlzTGludXggOiBpc0xpbnV4LFxuICAgIGlzTWFjIDogaXNNYWMsXG4gICAgaXNXaW5kb3cgOiBpc1dpbmRvdyxcbiAgICBpc1dpbmRvd1Bob25lIDogaXNXaW5kb3dQaG9uZSxcbiAgICBpc1dpbmRvd1RhYmxldCA6IGlzV2luZG93VGFibGV0LFxuICAgIGlzTW9iaWxlIDogaXNNb2JpbGUsXG4gICAgaXNUYWJsZXQgOiBpc1RhYmxldCxcbiAgICBpc0Rlc2t0b3AgOiBpc0Rlc2t0b3AsXG4gICAgaXNUb3VjaERldmljZSA6IGlzVG91Y2hEZXZpY2UsXG4gICAgaXNDb2Nvb24gOiBpc0NvY29vbixcbiAgICBpc05vZGVXZWJraXQgOiBpc05vZGVXZWJraXQsXG4gICAgaXNFamVjdGEgOiBpc0VqZWN0YSxcbiAgICBpc0NvcmRvdmEgOiBpc0NvcmRvdmEsXG4gICAgaXNDcm9zc3dhbGsgOiBpc0Nyb3Nzd2FsayxcbiAgICBpc0VsZWN0cm9uIDogaXNFbGVjdHJvbixcbiAgICBpc0F0b21TaGVsbCA6IGlzRWxlY3Ryb24sIC8vVE9ETzogUmVtb3ZlIHNvb24sIHdoZW4gYXRvbS1zaGVsbCAodmVyc2lvbikgaXMgZGVwcmVjYXRlZFxuXG4gICAgLy9pc09ubGluZSA6IG5hdmlnYXRvci5vbkxpbmUsXG4gICAgaGFzVmlicmF0ZSA6IGhhc1ZpYnJhdGUsXG4gICAgaGFzTW91c2VXaGVlbCA6IGhhc01vdXNlV2hlZWwsXG4gICAgaGFzRnVsbFNjcmVlbiA6IGhhc0Z1bGxTY3JlZW4sXG4gICAgaGFzQWNjZWxlcm9tZXRlciA6IGhhc0FjY2VsZXJvbWV0ZXIsXG4gICAgaGFzR2FtZXBhZCA6IGhhc0dhbWVwYWQsXG5cbiAgICBmdWxsU2NyZWVuUmVxdWVzdCA6IGZ1bGxTY3JlZW5SZXF1ZXN0ID8gZnVsbFNjcmVlblJlcXVlc3QubmFtZSA6IHVuZGVmaW5lZCxcbiAgICBmdWxsU2NyZWVuQ2FuY2VsIDogZnVsbFNjcmVlbkNhbmNlbCA/IGZ1bGxTY3JlZW5DYW5jZWwubmFtZSA6IHVuZGVmaW5lZCxcblxuICAgIGhhc0F1ZGlvIDogaGFzQXVkaW8sXG4gICAgaGFzSFRNTEF1ZGlvIDogaGFzSFRNTEF1ZGlvLFxuICAgIGhhc1dlYkF1ZGlvOiBoYXNXZWJBdWRpbyxcbiAgICB3ZWJBdWRpb0NvbnRleHQgOiB3ZWJBdWRpb0NvbnRleHQsXG5cbiAgICBoYXNNcDMgOiBoYXNNcDMsXG4gICAgaGFzTTRhIDogaGFzTTRhLFxuICAgIGhhc09nZyA6IGhhc09nZyxcbiAgICBoYXNXYXYgOiBoYXNXYXYsXG5cbiAgICBnZXRNb3VzZVdoZWVsRXZlbnQgOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYoIWhhc01vdXNlV2hlZWwpcmV0dXJuO1xuICAgICAgICB2YXIgZXZ0OnN0cmluZztcbiAgICAgICAgaWYoJ29ud2hlZWwnIGluIHdpbmRvdyl7XG4gICAgICAgICAgICBldnQgPSAnd2hlZWwnO1xuICAgICAgICB9ZWxzZSBpZignb25tb3VzZXdoZWVsJyBpbiB3aW5kb3cpe1xuICAgICAgICAgICAgZXZ0ID0gJ21vdXNld2hlZWwnO1xuICAgICAgICB9ZWxzZSBpZignTW91c2VTY3JvbGxFdmVudCcgaW4gd2luZG93KXtcbiAgICAgICAgICAgIGV2dCA9ICdET01Nb3VzZVNjcm9sbCc7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZXZ0O1xuICAgIH0sXG5cbiAgICB2aWJyYXRlIDogZnVuY3Rpb24odmFsdWU6bnVtYmVyKXtcbiAgICAgICAgaWYoaGFzVmlicmF0ZSl7XG4gICAgICAgICAgICBuYXZpZ2F0b3IudmlicmF0ZSh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgZ2V0IGlzT25saW5lKCkge1xuICAgICAgICByZXR1cm4gd2luZG93Lm5hdmlnYXRvci5vbkxpbmU7XG4gICAgfVxufTtcblxuZXhwb3J0ID0gRGV2aWNlOyIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL2RlZnMvcGl4aS5qcy5kLnRzXCIgLz5cblxuZXhwb3J0ID0gZnVuY3Rpb24gaW5qZWN0KCl7XG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5zcGVlZCA9IDA7XG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS52ZWxvY2l0eSA9IG5ldyBQSVhJLlBvaW50KCk7XG4gICAgUElYSS5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5kaXJlY3Rpb24gPSAwO1xuICAgIFBJWEkuRGlzcGxheU9iamVjdC5wcm90b3R5cGUucm90YXRpb25TcGVlZCA9IDA7XG5cbiAgICBQSVhJLkRpc3BsYXlPYmplY3QucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKGRlbHRhVGltZTpudW1iZXIpe1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL2RlZnMvcGl4aS5qcy5kLnRzXCIgLz5cbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL2RlZnMvY29yZS5kLnRzXCIgLz5cbmltcG9ydCBEZXZpY2UgPSByZXF1aXJlKCcuL0RldmljZScpO1xudmFyIGxhc3Q6bnVtYmVyID0gMDtcbnZhciBtaW5GcmFtZU1TID0gMjA7XG5cbmNsYXNzIEdhbWUge1xuICAgIGlkOnN0cmluZyA9IFwiUGl4aUdhbWVcIjtcblxuICAgIHN0YWdlOiBQSVhJLkNvbnRhaW5lciA9IG5ldyBQSVhJLkNvbnRhaW5lcigpO1xuICAgIHJhZjogYW55O1xuXG4gICAgcmVuZGVyZXI6IFBJWEkuV2ViR0xSZW5kZXJlciB8IFBJWEkuQ2FudmFzUmVuZGVyZXI7XG4gICAgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudDtcblxuICAgIGRlbHRhOiBudW1iZXIgPSAwO1xuICAgIHRpbWU6IG51bWJlciA9IDA7XG4gICAgbGFzdFRpbWU6IG51bWJlciA9IDA7XG5cbiAgICBpc1dlYkdMOmJvb2xlYW47XG4gICAgaXNXZWJBdWRpbzpib29sZWFuO1xuXG4gICAgY29uc3RydWN0b3Iod2lkdGg6bnVtYmVyID0gODAwLCBoZWlnaHQ6bnVtYmVyID0gNjAwLCBjb25maWc/OkdhbWVDb25maWcpIHtcbiAgICAgICAgdGhpcy5yZW5kZXJlciA9IFBJWEkuYXV0b0RldGVjdFJlbmRlcmVyKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICB0aGlzLmNhbnZhcyA9IHRoaXMucmVuZGVyZXIudmlldztcblxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuY2FudmFzKTtcblxuICAgICAgICB0aGlzLmlzV2ViR0wgPSAodGhpcy5yZW5kZXJlci50eXBlID09PSBQSVhJLlJFTkRFUkVSX1RZUEUuV0VCR0wpOyAvL1RPRE86IHB1bGwgcmVxdWVzdCBlbiBsYXMgZGVmaW5pY2lvbmVzLCBlc3RvIGVzdMOhIG1hbFxuICAgICAgICB0aGlzLmlzV2ViQXVkaW8gPSAoRGV2aWNlLmhhc1dlYkF1ZGlvKTsgLy9UT0RPOiBjaGVjayAtPiAmJiBjb25maWcudXNlV2ViQXVkaW9cbiAgICAgICAgdGhpcy5zdGFnZS5wb3NpdGlvbi5zZXQod2lkdGgvMiwgaGVpZ2h0LzIpO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2FuaW1hdGUoKSA6IHZvaWR7XG4gICAgICAgIHRoaXMucmFmID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLl9hbmltYXRlLmJpbmQodGhpcykpO1xuXG4gICAgICAgIHZhciBub3cgOiBudW1iZXIgPSBEYXRlLm5vdygpO1xuXG4gICAgICAgIHRoaXMudGltZSArPSBNYXRoLm1pbigobm93IC0gbGFzdCkvMTAwMCwgbWluRnJhbWVNUyk7XG4gICAgICAgIHRoaXMuZGVsdGEgPSB0aGlzLnRpbWUgLSB0aGlzLmxhc3RUaW1lO1xuICAgICAgICB0aGlzLmxhc3RUaW1lID0gdGhpcy50aW1lO1xuXG4gICAgICAgIGxhc3QgPSBub3c7XG5cbiAgICAgICAgdGhpcy5yZW5kZXJlci5yZW5kZXIodGhpcy5zdGFnZSk7XG5cbiAgICAgICAgdGhpcy51cGRhdGUodGhpcy5kZWx0YSk7XG4gICAgfVxuXG4gICAgdXBkYXRlKGRlbHRhVGltZTpudW1iZXIpIDogR2FtZSB7XG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLnN0YWdlLmNoaWxkcmVuLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIHRoaXMuc3RhZ2UuY2hpbGRyZW5baV0udXBkYXRlKHRoaXMuZGVsdGEpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9jbGVhbiBraWxsZWQgb2JqZWN0c1xuICAgICAgICB2YXIgbGVuOm51bWJlciA9IFBJWEkuQ29udGFpbmVyLl9raWxsZWRPYmplY3RzLmxlbmd0aDtcbiAgICAgICAgaWYobGVuKXtcbiAgICAgICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgbGVuOyBpKyspIFBJWEkuQ29udGFpbmVyLl9raWxsZWRPYmplY3RzW2ldLnJlbW92ZSgpO1xuICAgICAgICAgICAgUElYSS5Db250YWluZXIuX2tpbGxlZE9iamVjdHMubGVuZ3RoID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXJ0KCk6R2FtZXtcbiAgICAgICAgdGhpcy5fYW5pbWF0ZSgpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzdG9wKCk6R2FtZXtcbiAgICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMucmFmKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZ2V0IHdpZHRoKCkgOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJlci53aWR0aDtcbiAgICB9XG5cbiAgICBnZXQgaGVpZ2h0KCkgOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJlci5oZWlnaHQ7XG4gICAgfVxuXG59XG5cbmV4cG9ydCA9IEdhbWU7IiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi9kZWZzL3BpeGkuanMuZC50c1wiIC8+XG5pZih0eXBlb2YgUElYSSA9PT0gXCJ1bmRlZmluZWRcIil7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgZm91bmQgcGl4aS5qcy4uLicpO1xufVxuXG5pbXBvcnQgaW5qZWN0aW9ucyA9IHJlcXVpcmUoJy4vaW5qZWN0aW9ucycpO1xuaW5qZWN0aW9ucygpO1xuXG5pbXBvcnQgR2FtZSA9IHJlcXVpcmUoJy4vY29yZS9HYW1lJyk7XG5pbXBvcnQgRGV2aWNlID0gcmVxdWlyZSgnLi9jb3JlL0RldmljZScpO1xuXG52YXIgVHVyYm9QaXhpID0ge1xuICAgIERldmljZTogRGV2aWNlLFxuICAgIEdhbWU6IEdhbWVcbn07XG5cbi8vQWRkIG5ldyBjbGFzc2VzIGluIHBpeGkuanNcbmZvcih2YXIgYyBpbiBUdXJib1BpeGkpe1xuICAgIFBJWElbY10gPSBUdXJib1BpeGlbY107XG59XG4iLCJpbXBvcnQgRGlzcGxheU9iamVjdCA9IHJlcXVpcmUoJy4vY29yZS9EaXNwbGF5T2JqZWN0Jyk7XG5pbXBvcnQgQ29udGFpbmVyID0gcmVxdWlyZSgnLi9jb3JlL0NvbnRhaW5lcicpO1xuXG5leHBvcnQgPSBmdW5jdGlvbiBpbmplY3QoKXtcbiAgICBEaXNwbGF5T2JqZWN0KCk7XG4gICAgQ29udGFpbmVyKCk7XG59Il19

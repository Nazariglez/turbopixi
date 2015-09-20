/**
 * TurboPixi
 * @version v0.0.0
 * @license MIT
 * @author Nazariglez <nazari.nz@gmail.com>
 */
(function (PIXI) {
    if (!PIXI) {
        throw new Error('Ey! Where is pixi.js??');
    }
    var PIXI_VERSION_REQUIRED = '3.0.7';
    var PIXI_VERSION = PIXI.VERSION.match(/\d.\d.\d/)[0];
    if (PIXI_VERSION < PIXI_VERSION_REQUIRED) {
        throw new Error('Pixi.js v' + PIXI.VERSION + ' it\'s not supported, please use ^' + PIXI_VERSION_REQUIRED);
    }
    ///<reference path="./AudioManager.ts" />
    var HTMLAudio = Audio;
    var PIXI;
    (function (PIXI) {
        var AudioLine = function () {
            function AudioLine(manager) {
                this.manager = manager;
                this.available = true;
                this.loop = false;
                this.paused = false;
                this.muted = false;
                this.startTime = 0;
                this.lastPauseTime = 0;
                this.offsetTime = 0;
                if (!this.manager.context) {
                    this._htmlAudio = new HTMLAudio();
                    this._htmlAudio.addEventListener('ended', this._onEnd.bind(this));
                }
            }
            AudioLine.prototype.setAudio = function (audio, loop, callback) {
                if (typeof loop === 'function') {
                    callback = loop;
                    loop = false;
                }
                this.audio = audio;
                this.available = false;
                this.loop = loop;
                this.callback = callback;
                return this;
            };
            AudioLine.prototype.play = function (pause) {
                if (!pause && this.paused)
                    return this;
                if (this.manager.context) {
                    this._webAudio = this.manager.context.createBufferSource();
                    this._webAudio.start = this._webAudio.start || this._webAudio.noteOn;
                    this._webAudio.stop = this._webAudio.stop || this._webAudio.noteOff;
                    this._webAudio.buffer = this.audio.source;
                    this._webAudio.loop = this.loop || this.audio.loop;
                    this.startTime = this.manager.context.currentTime;
                    this._webAudio.onended = this._onEnd.bind(this);
                    this._webAudio.gainNode = this.manager.createGainNode(this.manager.context);
                    this._webAudio.gainNode.gain.value = this.audio.muted || this.muted ? 0 : this.audio.volume;
                    this._webAudio.gainNode.connect(this.manager.gainNode);
                    this._webAudio.connect(this._webAudio.gainNode);
                    this._webAudio.start(0, pause ? this.lastPauseTime : null);
                } else {
                    this._htmlAudio.src = this.audio.source.src !== '' ? this.audio.source.src : this.audio.source.children[0].src;
                    this._htmlAudio.preload = 'auto';
                    this._htmlAudio.volume = this.audio.muted || this.muted ? 0 : this.audio.volume;
                    this._htmlAudio.load();
                    this._htmlAudio.play();
                }
                return this;
            };
            AudioLine.prototype.stop = function () {
                if (this.manager.context) {
                    this._webAudio.stop(0);
                } else {
                    this._htmlAudio.pause();
                    this._htmlAudio.currentTime = 0;
                }
                this.reset();
                return this;
            };
            AudioLine.prototype.pause = function () {
                if (this.manager.context) {
                    this.offsetTime += this.manager.context.currentTime - this.startTime;
                    this.lastPauseTime = this.offsetTime % this._webAudio.buffer.duration;
                    this._webAudio.stop(0);
                } else {
                    this._htmlAudio.pause();
                }
                this.paused = true;
                return this;
            };
            AudioLine.prototype.resume = function () {
                if (this.paused) {
                    if (this.manager.context) {
                        this.play(true);
                    } else {
                        this._htmlAudio.play();
                    }
                    this.paused = false;
                }
                return this;
            };
            AudioLine.prototype.mute = function () {
                this.muted = true;
                if (this.manager.context) {
                    this._webAudio.gainNode.gain.value = 0;
                } else {
                    this._htmlAudio.volume = 0;
                }
                return this;
            };
            AudioLine.prototype.unmute = function () {
                this.muted = false;
                if (this.manager.context) {
                    this._webAudio.gainNode.gain.value = this.audio.volume;
                } else {
                    this._htmlAudio.volume = this.audio.volume;
                }
                return this;
            };
            AudioLine.prototype.volume = function (value) {
                if (this.manager.context) {
                    this._webAudio.gainNode.gain.value = value;
                } else {
                    this._htmlAudio.volume = value;
                }
                return this;
            };
            AudioLine.prototype.reset = function () {
                this.available = true;
                this.audio = null;
                this.loop = false;
                this.callback = null;
                this.paused = false;
                this.muted = false;
                this._webAudio = null;
                this.startTime = 0;
                this.lastPauseTime = 0;
                this.offsetTime = 0;
                return this;
            };
            AudioLine.prototype._onEnd = function () {
                if (this.callback)
                    this.callback(this.manager, this.audio);
                if (!this.manager.context) {
                    if (this.loop || this.audio.loop) {
                        this._htmlAudio.currentTime = 0;
                        this._htmlAudio.play();
                    } else {
                        this.reset();
                    }
                } else if (this.manager.context && !this.paused) {
                    this.reset();
                }
            };
            return AudioLine;
        }();
        PIXI.AudioLine = AudioLine;
    }(PIXI || (PIXI = {})));
    var PIXI;
    (function (PIXI) {
        (function (GAME_SCALE_TYPE) {
            GAME_SCALE_TYPE[GAME_SCALE_TYPE['NONE'] = 0] = 'NONE';
            GAME_SCALE_TYPE[GAME_SCALE_TYPE['FILL'] = 1] = 'FILL';
            GAME_SCALE_TYPE[GAME_SCALE_TYPE['ASPECT_FIT'] = 2] = 'ASPECT_FIT';
            GAME_SCALE_TYPE[GAME_SCALE_TYPE['ASPECT_FILL'] = 3] = 'ASPECT_FILL';
        }(PIXI.GAME_SCALE_TYPE || (PIXI.GAME_SCALE_TYPE = {})));
        var GAME_SCALE_TYPE = PIXI.GAME_SCALE_TYPE;
        (function (AUDIO_TYPE) {
            AUDIO_TYPE[AUDIO_TYPE['UNKNOWN'] = 0] = 'UNKNOWN';
            AUDIO_TYPE[AUDIO_TYPE['WEBAUDIO'] = 1] = 'WEBAUDIO';
            AUDIO_TYPE[AUDIO_TYPE['HTMLAUDIO'] = 2] = 'HTMLAUDIO';
        }(PIXI.AUDIO_TYPE || (PIXI.AUDIO_TYPE = {})));
        var AUDIO_TYPE = PIXI.AUDIO_TYPE;
        PIXI.zIndexEnabled = true;
    }(PIXI || (PIXI = {})));
    //Many checks are based on https://github.com/arasatasaygin/is.js/blob/master/is.js
    var PIXI;
    (function (PIXI) {
        var Device;
        (function (Device) {
            var navigator = window.navigator;
            var document = window.document;
            var userAgent = 'navigator' in window && 'userAgent' in navigator && navigator.userAgent.toLowerCase() || '', vendor = 'navigator' in window && 'vendor' in navigator && navigator.vendor.toLowerCase() || '', appVersion = 'navigator' in window && 'appVersion' in navigator && navigator.appVersion.toLowerCase() || '';
            //Browsers
            Device.isChrome = /chrome|chromium/i.test(userAgent) && /google inc/.test(vendor), Device.isFirefox = /firefox/i.test(userAgent), Device.isIE = /msie/i.test(userAgent) || 'ActiveXObject' in window, Device.isOpera = /^Opera\//.test(userAgent) || /\x20OPR\//.test(userAgent), Device.isSafari = /safari/i.test(userAgent) && /apple computer/i.test(vendor);
            //Devices && OS
            Device.isIphone = /iphone/i.test(userAgent), Device.isIpad = /ipad/i.test(userAgent), Device.isIpod = /ipod/i.test(userAgent), Device.isAndroid = /android/i.test(userAgent), Device.isAndroidPhone = /android/i.test(userAgent) && /mobile/i.test(userAgent), Device.isAndroidTablet = /android/i.test(userAgent) && !/mobile/i.test(userAgent), Device.isLinux = /linux/i.test(appVersion), Device.isMac = /mac/i.test(appVersion), Device.isWindow = /win/i.test(appVersion), Device.isWindowPhone = Device.isWindow && /phone/i.test(userAgent), Device.isWindowTablet = Device.isWindow && !Device.isWindowPhone && /touch/i.test(userAgent), Device.isMobile = Device.isIphone || Device.isIpod || Device.isAndroidPhone || Device.isWindowPhone, Device.isTablet = Device.isIpad || Device.isAndroidTablet || Device.isWindowTablet, Device.isDesktop = !Device.isMobile && !Device.isTablet, Device.isTouchDevice = 'ontouchstart' in window || 'DocumentTouch' in window && document instanceof DocumentTouch, Device.isCocoon = !!navigator.isCocoonJS, Device.isNodeWebkit = !!(typeof process === 'object' && process.title === 'node' && typeof global === 'object'), Device.isEjecta = !!window.ejecta, Device.isCrosswalk = /Crosswalk/.test(userAgent), Device.isCordova = !!window.cordova, Device.isElectron = !!(typeof process === 'object' && process.versions && (process.versions.electron || process.versions['atom-shell']));
            navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate || null;
            Device.isVibrateSupported = !!navigator.vibrate && (Device.isMobile || Device.isTablet), Device.isMouseWheelSupported = 'onwheel' in window || 'onmousewheel' in window || 'MouseScrollEvent' in window, Device.isAccelerometerSupported = 'DeviceMotionEvent' in window, Device.isGamepadSupported = !!navigator.getGamepads || !!navigator.webkitGetGamepads;
            //FullScreen
            var div = document.createElement('div');
            var fullScreenRequestVendor = div.requestFullscreen || div.webkitRequestFullScreen || div.msRequestFullScreen || div.mozRequestFullScreen, fullScreenCancelVendor = document.cancelFullScreen || document.exitFullScreen || document.webkitCancelFullScreen || document.msCancelFullScreen || document.mozCancelFullScreen;
            Device.isFullScreenSupported = !!(Device.fullScreenRequest && Device.fullScreenCancel), Device.fullScreenRequest = fullScreenRequestVendor ? fullScreenRequestVendor.name : undefined, Device.fullScreenCancel = fullScreenCancelVendor ? fullScreenCancelVendor.name : undefined;
            //Audio
            Device.isHTMLAudioSupported = !!window.Audio, Device.webAudioContext = window.AudioContext || window.webkitAudioContext, Device.isWebAudioSupported = !!Device.webAudioContext, Device.isAudioSupported = Device.isWebAudioSupported || Device.isHTMLAudioSupported, Device.isMp3Supported = false, Device.isOggSupported = false, Device.isWavSupported = false, Device.isM4aSupported = false, Device.globalWebAudioContext = Device.isWebAudioSupported ? new Device.webAudioContext() : undefined;
            //Audio mimeTypes
            if (Device.isAudioSupported) {
                var audio = document.createElement('audio');
                Device.isMp3Supported = audio.canPlayType('audio/mpeg;') !== '';
                Device.isOggSupported = audio.canPlayType('audio/ogg; codecs="vorbis"') !== '';
                Device.isWavSupported = audio.canPlayType('audio/wav') !== '';
                Device.isM4aSupported = audio.canPlayType('audio/mp4; codecs="mp4a.40.5"') !== '';
            }
            function getMouseWheelEvent() {
                if (!Device.isMouseWheelSupported)
                    return;
                var evt;
                if ('onwheel' in window) {
                    evt = 'wheel';
                } else if ('onmousewheel' in window) {
                    evt = 'mousewheel';
                } else if ('MouseScrollEvent' in window) {
                    evt = 'DOMMouseScroll';
                }
                return evt;
            }
            Device.getMouseWheelEvent = getMouseWheelEvent;
            function vibrate(pattern) {
                if (Device.isVibrateSupported) {
                    navigator.vibrate(pattern);
                }
            }
            Device.vibrate = vibrate;
            function getVisibilityChangeEvent() {
                if (typeof document.hidden !== 'undefined') {
                    return 'visibilitychange';
                } else if (typeof document.webkitHidden !== 'undefined') {
                    return 'webkitvisibilitychange';
                } else if (typeof document.mozHidden !== 'undefined') {
                    return 'mozvisibilitychange';
                } else if (typeof document.msHidden !== 'undefined') {
                    return 'msvisibilitychange';
                }
            }
            Device.getVisibilityChangeEvent = getVisibilityChangeEvent;
            function isOnline() {
                return window.navigator.onLine;
            }
            Device.isOnline = isOnline;
        }(Device = PIXI.Device || (PIXI.Device = {})));
    }(PIXI || (PIXI = {})));
    var __extends = this && this.__extends || function (d, b) {
        for (var p in b)
            if (b.hasOwnProperty(p))
                d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        __.prototype = b.prototype;
        d.prototype = new __();
    };
    ///<reference path="../../defs/pixi.js.d.ts" />
    var PIXI;
    (function (PIXI) {
        var Camera = function (_super) {
            __extends(Camera, _super);
            function Camera() {
                _super.call(this);
                this.visible = false;
                this._enabled = false;
                this.zIndex = Infinity;
            }
            Camera.prototype.update = function (deltaTime) {
                if (!this.enabled) {
                    return this;
                }
                _super.prototype.update.call(this, deltaTime);
                return this;
            };
            Object.defineProperty(Camera.prototype, 'enabled', {
                get: function () {
                    return this._enabled;
                },
                set: function (value) {
                    this._enabled = value;
                    this.visible = value;
                },
                enumerable: true,
                configurable: true
            });
            return Camera;
        }(PIXI.Container);
        PIXI.Camera = Camera;
    }(PIXI || (PIXI = {})));
    ///<reference path="../../defs/pixi.js.d.ts" />
    ///<reference path="./TimerManager.ts" />
    var PIXI;
    (function (PIXI) {
        var Timer = function () {
            function Timer(time, manager) {
                if (time === void 0) {
                    time = 1;
                }
                this.time = time;
                this.manager = manager;
                this.active = false;
                this.isEnded = false;
                this.isStarted = false;
                this.expire = false;
                this.delay = 0;
                this.repeat = 0;
                this.loop = false;
                this._delayTime = 0;
                this._elapsedTime = 0;
                this._repeat = 0;
                if (this.manager) {
                    this.addTo(this.manager);
                }
            }
            Timer.prototype.update = function (deltaTime) {
                if (!this.active)
                    return this;
                var deltaMS = deltaTime * 1000;
                if (this.delay > this._delayTime) {
                    this._delayTime += deltaMS;
                    return this;
                }
                if (!this.isStarted) {
                    this.isStarted = true;
                    this._onTimerStart(this._elapsedTime, deltaTime);
                }
                if (this.time > this._elapsedTime) {
                    var t = this._elapsedTime + deltaMS;
                    var ended = t >= this.time;
                    this._elapsedTime = ended ? this.time : t;
                    this._onTimerUpdate(this._elapsedTime, deltaTime);
                    if (ended) {
                        if (this.loop || this.repeat > this._repeat) {
                            this._repeat++;
                            this._onTimerRepeat(this._elapsedTime, deltaTime, this._repeat);
                            this._elapsedTime = 0;
                            return this;
                        }
                        this.isEnded = true;
                        this.active = false;
                        this._onTimerEnd(this._elapsedTime, deltaTime);
                    }
                }
                return this;
            };
            Timer.prototype.addTo = function (timerManager) {
                timerManager.addTimer(this);
                return this;
            };
            Timer.prototype.remove = function () {
                if (!this.manager) {
                    throw new Error('Timer without manager.');
                }
                this.manager.removeTimer(this);
                return this;
            };
            Timer.prototype.start = function () {
                this.active = true;
                return this;
            };
            Timer.prototype.stop = function () {
                this.active = false;
                this._onTimerStop(this._elapsedTime);
                return this;
            };
            Timer.prototype.reset = function () {
                this._elapsedTime = 0;
                this._repeat = 0;
                this._delayTime = 0;
                this.isStarted = false;
                this.isEnded = false;
                return this;
            };
            Timer.prototype.onStart = function (callback) {
                this._onTimerStart = callback;
                return this;
            };
            Timer.prototype.onEnd = function (callback) {
                this._onTimerEnd = callback;
                return this;
            };
            Timer.prototype.onStop = function (callback) {
                this._onTimerStop = callback;
                return this;
            };
            Timer.prototype.onUpdate = function (callback) {
                this._onTimerUpdate = callback;
                return this;
            };
            Timer.prototype.onRepeat = function (callback) {
                this._onTimerRepeat = callback;
                return this;
            };
            Timer.prototype._onTimerStart = function (elapsedTime, deltaTime) {
            };
            Timer.prototype._onTimerStop = function (elapsedTime) {
            };
            Timer.prototype._onTimerRepeat = function (elapsedTime, deltaTime, repeat) {
            };
            Timer.prototype._onTimerUpdate = function (elapsedTime, deltaTime) {
            };
            Timer.prototype._onTimerEnd = function (elapsedTime, deltaTime) {
            };
            return Timer;
        }();
        PIXI.Timer = Timer;
    }(PIXI || (PIXI = {})));
    ///<reference path="../../defs/pixi.js.d.ts" />
    ///<reference path="./Timer.ts" />
    var PIXI;
    (function (PIXI) {
        var TimerManager = function () {
            function TimerManager() {
                this.timers = [];
                this._toDelete = [];
            }
            TimerManager.prototype.update = function (deltaTime) {
                for (var i = 0; i < this.timers.length; i++) {
                    if (this.timers[i].active) {
                        this.timers[i].update(deltaTime);
                        if (this.timers[i].isEnded && this.timers[i].expire) {
                            this.timers[i].remove();
                        }
                    }
                }
                if (this._toDelete.length) {
                    for (i = 0; i < this._toDelete.length; i++) {
                        this._remove(this._toDelete[i]);
                    }
                    this._toDelete.length = 0;
                }
                return this;
            };
            TimerManager.prototype.removeTimer = function (timer) {
                this._toDelete.push(timer);
                return this;
            };
            TimerManager.prototype.addTimer = function (timer) {
                timer.manager = this;
                this.timers.push(timer);
                return timer;
            };
            TimerManager.prototype.createTimer = function (time) {
                return new PIXI.Timer(time, this);
            };
            TimerManager.prototype._remove = function (timer) {
                var index = this.timers.indexOf(timer);
                if (index >= 0)
                    this.timers.splice(index, 1);
            };
            return TimerManager;
        }();
        PIXI.TimerManager = TimerManager;
    }(PIXI || (PIXI = {})));
    ///<reference path="../../defs/pixi.js.d.ts" />
    var PIXI;
    (function (PIXI) {
        var Easing;
        (function (Easing) {
            function linear() {
                return function (k) {
                    return k;
                };
            }
            Easing.linear = linear;
            function inQuad() {
                return function (k) {
                    return k * k;
                };
            }
            Easing.inQuad = inQuad;
            function outQuad() {
                return function (k) {
                    return k * (2 - k);
                };
            }
            Easing.outQuad = outQuad;
            function inOutQuad() {
                return function (k) {
                    if ((k *= 2) < 1)
                        return 0.5 * k * k;
                    return -0.5 * (--k * (k - 2) - 1);
                };
            }
            Easing.inOutQuad = inOutQuad;
            function inCubic() {
                return function (k) {
                    return k * k * k;
                };
            }
            Easing.inCubic = inCubic;
            function outCubic() {
                return function (k) {
                    return --k * k * k + 1;
                };
            }
            Easing.outCubic = outCubic;
            function inOutCubic() {
                return function (k) {
                    if ((k *= 2) < 1)
                        return 0.5 * k * k * k;
                    return 0.5 * ((k -= 2) * k * k + 2);
                };
            }
            Easing.inOutCubic = inOutCubic;
            function inQuart() {
                return function (k) {
                    return k * k * k * k;
                };
            }
            Easing.inQuart = inQuart;
            function outQuart() {
                return function (k) {
                    return 1 - --k * k * k * k;
                };
            }
            Easing.outQuart = outQuart;
            function inOutQuart() {
                return function (k) {
                    if ((k *= 2) < 1)
                        return 0.5 * k * k * k * k;
                    return -0.5 * ((k -= 2) * k * k * k - 2);
                };
            }
            Easing.inOutQuart = inOutQuart;
            function inQuint() {
                return function (k) {
                    return k * k * k * k * k;
                };
            }
            Easing.inQuint = inQuint;
            function outQuint() {
                return function (k) {
                    return --k * k * k * k * k + 1;
                };
            }
            Easing.outQuint = outQuint;
            function inOutQuint() {
                return function (k) {
                    if ((k *= 2) < 1)
                        return 0.5 * k * k * k * k * k;
                    return 0.5 * ((k -= 2) * k * k * k * k + 2);
                };
            }
            Easing.inOutQuint = inOutQuint;
            function inSine() {
                return function (k) {
                    return 1 - Math.cos(k * Math.PI / 2);
                };
            }
            Easing.inSine = inSine;
            function outSine() {
                return function (k) {
                    return Math.sin(k * Math.PI / 2);
                };
            }
            Easing.outSine = outSine;
            function inOutSine() {
                return function (k) {
                    return 0.5 * (1 - Math.cos(Math.PI * k));
                };
            }
            Easing.inOutSine = inOutSine;
            function inExpo() {
                return function (k) {
                    return k === 0 ? 0 : Math.pow(1024, k - 1);
                };
            }
            Easing.inExpo = inExpo;
            function outExpo() {
                return function (k) {
                    return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
                };
            }
            Easing.outExpo = outExpo;
            function inOutExpo() {
                return function (k) {
                    if (k === 0)
                        return 0;
                    if (k === 1)
                        return 1;
                    if ((k *= 2) < 1)
                        return 0.5 * Math.pow(1024, k - 1);
                    return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
                };
            }
            Easing.inOutExpo = inOutExpo;
            function inCirc() {
                return function (k) {
                    return 1 - Math.sqrt(1 - k * k);
                };
            }
            Easing.inCirc = inCirc;
            function outCirc() {
                return function (k) {
                    return Math.sqrt(1 - --k * k);
                };
            }
            Easing.outCirc = outCirc;
            function inOutCirc() {
                return function (k) {
                    if ((k *= 2) < 1)
                        return -0.5 * (Math.sqrt(1 - k * k) - 1);
                    return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
                };
            }
            Easing.inOutCirc = inOutCirc;
            function inElastic() {
                return function (k) {
                    var s, a = 0.1, p = 0.4;
                    if (k === 0)
                        return 0;
                    if (k === 1)
                        return 1;
                    if (!a || a < 1) {
                        a = 1;
                        s = p / 4;
                    } else
                        s = p * Math.asin(1 / a) / (2 * Math.PI);
                    return -(a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
                };
            }
            Easing.inElastic = inElastic;
            function outElastic() {
                return function (k) {
                    var s, a = 0.1, p = 0.4;
                    if (k === 0)
                        return 0;
                    if (k === 1)
                        return 1;
                    if (!a || a < 1) {
                        a = 1;
                        s = p / 4;
                    } else
                        s = p * Math.asin(1 / a) / (2 * Math.PI);
                    return a * Math.pow(2, -10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1;
                };
            }
            Easing.outElastic = outElastic;
            function inOutElastic() {
                return function (k) {
                    var s, a = 0.1, p = 0.4;
                    if (k === 0)
                        return 0;
                    if (k === 1)
                        return 1;
                    if (!a || a < 1) {
                        a = 1;
                        s = p / 4;
                    } else
                        s = p * Math.asin(1 / a) / (2 * Math.PI);
                    if ((k *= 2) < 1)
                        return -0.5 * (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
                    return a * Math.pow(2, -10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p) * 0.5 + 1;
                };
            }
            Easing.inOutElastic = inOutElastic;
            function inBack(v) {
                if (v === void 0) {
                    v = 1.70158;
                }
                return function (k) {
                    var s = v;
                    return k * k * ((s + 1) * k - s);
                };
            }
            Easing.inBack = inBack;
            function outBack(v) {
                if (v === void 0) {
                    v = 1.70158;
                }
                return function (k) {
                    var s = v;
                    return --k * k * ((s + 1) * k + s) + 1;
                };
            }
            Easing.outBack = outBack;
            function inOutBack(v) {
                if (v === void 0) {
                    v = 1.70158;
                }
                return function (k) {
                    var s = v * 1.525;
                    if ((k *= 2) < 1)
                        return 0.5 * (k * k * ((s + 1) * k - s));
                    return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
                };
            }
            Easing.inOutBack = inOutBack;
            function inBounce() {
                return function (k) {
                    return 1 - Easing.outBounce()(1 - k);
                };
            }
            Easing.inBounce = inBounce;
            function outBounce() {
                return function (k) {
                    if (k < 1 / 2.75) {
                        return 7.5625 * k * k;
                    } else if (k < 2 / 2.75) {
                        return 7.5625 * (k -= 1.5 / 2.75) * k + 0.75;
                    } else if (k < 2.5 / 2.75) {
                        return 7.5625 * (k -= 2.25 / 2.75) * k + 0.9375;
                    } else {
                        return 7.5625 * (k -= 2.625 / 2.75) * k + 0.984375;
                    }
                };
            }
            Easing.outBounce = outBounce;
            function inOutBounce() {
                return function (k) {
                    if (k < 0.5)
                        return Easing.inBounce()(k * 2) * 0.5;
                    return Easing.outBounce()(k * 2 - 1) * 0.5 + 0.5;
                };
            }
            Easing.inOutBounce = inOutBounce;
        }(Easing = PIXI.Easing || (PIXI.Easing = {})));
    }(PIXI || (PIXI = {})));
    ///<reference path="../../defs/pixi.js.d.ts" />
    var PIXI;
    (function (PIXI) {
        var Path = function () {
            function Path() {
                this._closed = false;
                this.polygon = new PIXI.Polygon();
                this._tmpPoint = new PIXI.Point();
                this._tmpPoint2 = new PIXI.Point();
                this._tmpDistance = [];
                this.graphicsData = [];
                this.dirty = false;
                this.polygon.closed = false;
            }
            Path.prototype.moveTo = function (x, y) {
                PIXI.Graphics.prototype.moveTo.call(this, x, y);
                this.dirty = true;
                return this;
            };
            Path.prototype.lineTo = function (x, y) {
                PIXI.Graphics.prototype.lineTo.call(this, x, y);
                this.dirty = true;
                return this;
            };
            Path.prototype.bezierCurveTo = function (cpX, cpY, cpX2, cpY2, toX, toY) {
                PIXI.Graphics.prototype.bezierCurveTo.call(this, cpX, cpY, cpX2, cpY2, toX, toY);
                this.dirty = true;
                return this;
            };
            Path.prototype.quadraticCurveTo = function (cpX, cpY, toX, toY) {
                PIXI.Graphics.prototype.quadraticCurveTo.call(this, cpX, cpY, toX, toY);
                this.dirty = true;
                return this;
            };
            Path.prototype.arcTo = function (x1, y1, x2, y2, radius) {
                PIXI.Graphics.prototype.arcTo.call(this, x1, y1, x2, y2, radius);
                this.dirty = true;
                return this;
            };
            Path.prototype.arc = function (cx, cy, radius, startAngle, endAngle, anticlockwise) {
                PIXI.Graphics.prototype.arc.call(this, cx, cy, radius, startAngle, endAngle, anticlockwise);
                this.dirty = true;
                return this;
            };
            Path.prototype.drawShape = function (shape) {
                PIXI.Graphics.prototype.drawShape.call(this, shape);
                this.dirty = true;
                return this;
            };
            Path.prototype.getPoint = function (num) {
                this.parsePoints();
                var len = num * 2;
                this._tmpPoint.set(this.polygon.points[len], this.polygon.points[len + 1]);
                return this._tmpPoint;
            };
            Path.prototype.distanceBetween = function (num1, num2) {
                this.parsePoints();
                var _a = this.getPoint(num1), p1X = _a.x, p1Y = _a.y;
                var _b = this.getPoint(num2), p2X = _b.x, p2Y = _b.y;
                var dx = p2X - p1X;
                var dy = p2Y - p1Y;
                return Math.sqrt(dx * dx + dy * dy);
            };
            Path.prototype.totalDistance = function () {
                this.parsePoints();
                this._tmpDistance.length = 0;
                this._tmpDistance.push(0);
                var len = this.length;
                var distance = 0;
                for (var i = 0; i < len - 1; i++) {
                    distance += this.distanceBetween(i, i + 1);
                    this._tmpDistance.push(distance);
                }
                return distance;
            };
            Path.prototype.getPointAt = function (num) {
                this.parsePoints();
                if (num > this.length) {
                    return this.getPoint(this.length - 1);
                }
                if (num % 1 === 0) {
                    return this.getPoint(num);
                } else {
                    this._tmpPoint2.set(0, 0);
                    var diff = num % 1;
                    var _a = this.getPoint(Math.ceil(num)), ceilX = _a.x, ceilY = _a.y;
                    var _b = this.getPoint(Math.floor(num)), floorX = _b.x, floorY = _b.y;
                    var xx = -((floorX - ceilX) * diff);
                    var yy = -((floorY - ceilY) * diff);
                    this._tmpPoint2.set(floorX + xx, floorY + yy);
                    return this._tmpPoint2;
                }
            };
            Path.prototype.getPointAtDistance = function (distance) {
                this.parsePoints();
                if (!this._tmpDistance)
                    this.totalDistance();
                var len = this._tmpDistance.length;
                var n = 0;
                var totalDistance = this._tmpDistance[this._tmpDistance.length - 1];
                if (distance < 0) {
                    distance = totalDistance + distance;
                } else if (distance > totalDistance) {
                    distance = distance - totalDistance;
                }
                for (var i = 0; i < len; i++) {
                    if (distance >= this._tmpDistance[i]) {
                        n = i;
                    }
                    if (distance < this._tmpDistance[i]) {
                        break;
                    }
                }
                if (n === this.length - 1) {
                    return this.getPointAt(n);
                }
                var diff1 = distance - this._tmpDistance[n];
                var diff2 = this._tmpDistance[n + 1] - this._tmpDistance[n];
                return this.getPointAt(n + diff1 / diff2);
            };
            Path.prototype.parsePoints = function () {
                if (this.dirty) {
                    this.dirty = false;
                    this.polygon.points.length = 0;
                    for (var i = 0; i < this.graphicsData.length; i++) {
                        var shape = this.graphicsData[i].shape;
                        if (shape && shape.points) {
                            this.polygon.points = this.polygon.points.concat(shape.points);
                        }
                    }
                }
                return this;
            };
            Path.prototype.clear = function () {
                this.graphicsData.length = 0;
                this.currentPath = null;
                this.polygon.points.length = 0;
                this._closed = false;
                this.dirty = false;
                return this;
            };
            Object.defineProperty(Path.prototype, 'closed', {
                get: function () {
                    return this._closed;
                },
                set: function (value) {
                    this.polygon.closed = value;
                    this._closed = value;
                    this.dirty = true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Path.prototype, 'length', {
                get: function () {
                    return this.polygon.points.length === 0 ? 0 : this.polygon.points.length / 2 + (this._closed ? 1 : 0);
                },
                enumerable: true,
                configurable: true
            });
            return Path;
        }();
        PIXI.Path = Path;
    }(PIXI || (PIXI = {})));
    ///<reference path="../../defs/pixi.js.d.ts" />
    ///<reference path="./TweenManager.ts" />
    ///<reference path="./Easing.ts" />
    ///<reference path="../display/Scene.ts" />
    ///<reference path="./Path.ts" />
    var PIXI;
    (function (PIXI) {
        var Tween = function () {
            function Tween(target, manager) {
                this.target = target;
                this.manager = manager;
                this.time = 0;
                this.active = false;
                this.easing = PIXI.Easing.linear();
                this.expire = false;
                this.repeat = 0;
                this.loop = false;
                this.delay = 0;
                this.pingPong = false;
                this.isStarted = false;
                this.isEnded = false;
                this._delayTime = 0;
                this._elapsedTime = 0;
                this._repeat = 0;
                this._pingPong = false;
                this.pathReverse = false;
                if (this.manager) {
                    this.addTo(this.manager);
                }
            }
            Tween.prototype.addTo = function (manager) {
                manager.addTween(this);
                return this;
            };
            Tween.prototype.chain = function (tween) {
                if (tween === void 0) {
                    tween = new Tween(this.target);
                }
                this._chainTween = tween;
                return tween;
            };
            Tween.prototype.start = function () {
                this.active = true;
                if (!this.manager) {
                    if (this.target) {
                        if (this.target.parent) {
                            var manager = _findManager(this.target);
                            if (manager) {
                                this.addTo(manager);
                            } else {
                                throw Error('Tweens needs a manager');
                            }
                        } else {
                            throw Error('Tweens needs a manager');
                        }
                    }
                }
                return this;
            };
            Tween.prototype.stop = function () {
                this.active = false;
                this._onTweenStop(this._elapsedTime);
                return this;
            };
            Tween.prototype.to = function (data) {
                this._to = data;
                return this;
            };
            Tween.prototype.from = function (data) {
                this._from = data;
                return this;
            };
            Tween.prototype.remove = function () {
                if (!this.manager) {
                    throw new Error('Tween without manager.');
                }
                this.manager.removeTween(this);
                return this;
            };
            Tween.prototype.reset = function () {
                this._elapsedTime = 0;
                this._repeat = 0;
                this._delayTime = 0;
                this.isStarted = false;
                this.isEnded = false;
                if (this.pingPong && this._pingPong) {
                    var _to = this._to, _from = this._from;
                    this._to = _from;
                    this._from = _to;
                    this._pingPong = false;
                }
                return this;
            };
            Tween.prototype.onStart = function (callback) {
                this._onTweenStart = callback;
                return this;
            };
            Tween.prototype.onEnd = function (callback) {
                this._onTweenEnd = callback;
                return this;
            };
            Tween.prototype.onStop = function (callback) {
                this._onTweenStop = callback;
                return this;
            };
            Tween.prototype.onUpdate = function (callback) {
                this._onTweenUpdate = callback;
                return this;
            };
            Tween.prototype.onRepeat = function (callback) {
                this._onTweenRepeat = callback;
                return this;
            };
            Tween.prototype.onPingPong = function (callback) {
                this._onTweenPingPong = callback;
                return this;
            };
            Tween.prototype.update = function (deltaTime) {
                if (!(this._canUpdate() && (this._to || this.path))) {
                    return this;
                }
                var _to, _from;
                var deltaMS = deltaTime * 1000;
                if (this.delay > this._delayTime) {
                    this._delayTime += deltaMS;
                    return this;
                }
                if (!this.isStarted) {
                    this._parseData();
                    this.isStarted = true;
                    this._onTweenStart(this._elapsedTime, deltaTime);
                }
                var time = this.pingPong ? this.time / 2 : this.time;
                if (time > this._elapsedTime) {
                    var t = this._elapsedTime + deltaMS;
                    var ended = t >= time;
                    this._elapsedTime = ended ? time : t;
                    this._apply(time);
                    var realElapsed = this._pingPong ? time + this._elapsedTime : this._elapsedTime;
                    this._onTweenUpdate(realElapsed, deltaTime);
                    if (ended) {
                        if (this.pingPong && !this._pingPong) {
                            this._pingPong = true;
                            _to = this._to;
                            _from = this._from;
                            this._from = _to;
                            this._to = _from;
                            if (this.path) {
                                _to = this.pathTo;
                                _from = this.pathFrom;
                                this.pathTo = _from;
                                this.pathFrom = _to;
                            }
                            this._onTweenPingPong(realElapsed, deltaTime);
                            this._elapsedTime = 0;
                            return this;
                        }
                        if (this.loop || this.repeat > this._repeat) {
                            this._repeat++;
                            this._onTweenRepeat(realElapsed, deltaTime, this._repeat);
                            this._elapsedTime = 0;
                            if (this.pingPong && this._pingPong) {
                                _to = this._to;
                                _from = this._from;
                                this._to = _from;
                                this._from = _to;
                                if (this.path) {
                                    _to = this.pathTo;
                                    _from = this.pathFrom;
                                    this.pathTo = _from;
                                    this.pathFrom = _to;
                                }
                                this._pingPong = false;
                            }
                            return this;
                        }
                        this.isEnded = true;
                        this.active = false;
                        this._onTweenEnd(realElapsed, deltaTime);
                        if (this._chainTween) {
                            this._chainTween.addTo(this.manager);
                            this._chainTween.start();
                        }
                    }
                    return this;
                }
            };
            Tween.prototype._parseData = function () {
                if (this.isStarted)
                    return;
                if (!this._from)
                    this._from = {};
                _parseRecursiveData(this._to, this._from, this.target);
                if (this.path) {
                    var distance = this.path.totalDistance();
                    if (this.pathReverse) {
                        this.pathFrom = distance;
                        this.pathTo = 0;
                    } else {
                        this.pathFrom = 0;
                        this.pathTo = distance;
                    }
                }
            };
            Tween.prototype._apply = function (time) {
                _recursiveApply(this._to, this._from, this.target, time, this._elapsedTime, this.easing);
                if (this.path) {
                    var b = this.pathFrom, c = this.pathTo - this.pathFrom, d = this.time, t = this._elapsedTime / d;
                    var distance = b + c * this.easing(t);
                    var pos = this.path.getPointAtDistance(distance);
                    this.target.x = pos.x;
                    this.target.y = pos.y;
                }
            };
            Tween.prototype._canUpdate = function () {
                return this.time && this.active && this.target;
            };
            Tween.prototype._onTweenStart = function (elapsedTime, deltaTime) {
            };
            Tween.prototype._onTweenStop = function (elapsedTime) {
            };
            Tween.prototype._onTweenEnd = function (elapsedTime, deltaTime) {
            };
            Tween.prototype._onTweenRepeat = function (elapsedTime, deltaTime, repeat) {
            };
            Tween.prototype._onTweenUpdate = function (elapsedTime, deltaTime) {
            };
            Tween.prototype._onTweenPingPong = function (elapsedTime, deltaTime) {
            };
            return Tween;
        }();
        PIXI.Tween = Tween;
        function _findManager(parent) {
            if (parent instanceof PIXI.Scene) {
                return parent.tweenManager ? parent.tweenManager : null;
            } else if (parent.parent) {
                return _findManager(parent.parent);
            } else {
                return null;
            }
        }
        function _parseRecursiveData(to, from, target) {
            for (var k in to) {
                if (from[k] !== 0 && !from[k]) {
                    if (isObject(target[k])) {
                        from[k] = JSON.parse(JSON.stringify(target[k]));
                        _parseRecursiveData(to[k], from[k], target[k]);
                    } else {
                        from[k] = target[k];
                    }
                }
            }
        }
        function isObject(obj) {
            return Object.prototype.toString.call(obj) === '[object Object]';
        }
        function _recursiveApply(to, from, target, time, elapsed, easing) {
            for (var k in to) {
                if (!isObject(to[k])) {
                    var b = from[k], c = to[k] - from[k], d = time, t = elapsed / d;
                    target[k] = b + c * easing(t);
                } else {
                    _recursiveApply(to[k], from[k], target[k], time, elapsed, easing);
                }
            }
        }
    }(PIXI || (PIXI = {})));
    ///<reference path="../../defs/pixi.js.d.ts" />
    ///<reference path="./Tween.ts" />
    var PIXI;
    (function (PIXI) {
        var TweenManager = function () {
            function TweenManager() {
                this.tweens = [];
                this._toDelete = [];
            }
            TweenManager.prototype.update = function (deltaTime) {
                for (var i = 0; i < this.tweens.length; i++) {
                    if (this.tweens[i].active) {
                        this.tweens[i].update(deltaTime);
                        if (this.tweens[i].isEnded && this.tweens[i].expire) {
                            this.tweens[i].remove();
                        }
                    }
                }
                if (this._toDelete.length) {
                    for (i = 0; i < this._toDelete.length; i++) {
                        this._remove(this._toDelete[i]);
                    }
                    this._toDelete.length = 0;
                }
                return this;
            };
            TweenManager.prototype.getTweensForTarger = function (target) {
                var tweens = [];
                for (var i = 0; i < this.tweens.length; i++) {
                    if (this.tweens[i].target === target) {
                        tweens.push(this.tweens[i]);
                    }
                }
                return tweens;
            };
            TweenManager.prototype.createTween = function (target) {
                return new PIXI.Tween(target, this);
            };
            TweenManager.prototype.addTween = function (tween) {
                tween.manager = this;
                this.tweens.push(tween);
                return tween;
            };
            TweenManager.prototype.removeTween = function (tween) {
                this._toDelete.push(tween);
                return this;
            };
            TweenManager.prototype._remove = function (tween) {
                var index = this.tweens.indexOf(tween);
                if (index >= 0) {
                    this.tweens.splice(index, 1);
                }
            };
            return TweenManager;
        }();
        PIXI.TweenManager = TweenManager;
    }(PIXI || (PIXI = {})));
    var __extends = this && this.__extends || function (d, b) {
        for (var p in b)
            if (b.hasOwnProperty(p))
                d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        __.prototype = b.prototype;
        d.prototype = new __();
    };
    ///<reference path="../../defs/pixi.js.d.ts" />
    ///<reference path="../core/Game.ts" />
    ///<reference path="./Camera.ts" />
    ///<reference path="../timer/TimerManager.ts" />
    ///<reference path="../tween/Tweenmanager.ts" />
    var PIXI;
    (function (PIXI) {
        var Scene = function (_super) {
            __extends(Scene, _super);
            function Scene(id) {
                if (id === void 0) {
                    id = 'scene' + Scene._idLen++;
                }
                _super.call(this);
                this.id = id;
                this.camera = new PIXI.Camera();
                this.timerManager = new PIXI.TimerManager();
                this.tweenManager = new PIXI.TweenManager();
                this.camera.addTo(this);
            }
            Scene.prototype.update = function (deltaTime) {
                this.timerManager.update(deltaTime);
                this.tweenManager.update(deltaTime);
                _super.prototype.update.call(this, deltaTime);
                return this;
            };
            Scene.prototype.addTo = function (game) {
                if (game instanceof PIXI.Game) {
                    game.addScene(this);
                } else {
                    throw new Error('Scenes can only be added to the game');
                }
                return this;
            };
            Scene._idLen = 0;
            return Scene;
        }(PIXI.Container);
        PIXI.Scene = Scene;
    }(PIXI || (PIXI = {})));
    var PIXI;
    (function (PIXI) {
        var InputManager = function () {
            function InputManager(game) {
                this.game = game;
            }
            return InputManager;
        }();
        PIXI.InputManager = InputManager;
    }(PIXI || (PIXI = {})));
    ///<reference path="../../defs/pixi.js.d.ts" />
    var PIXI;
    (function (PIXI) {
        function bitmapFontParserTXT() {
            return function (resource, next) {
                //skip if no data or if not txt
                if (!resource.data || resource.xhrType !== 'text' && resource.xhrType !== 'document') {
                    return next();
                }
                var text = resource.xhrType === 'text' ? resource.data : resource.xhr.responseText;
                //skip if not a bitmap font data
                if (text.indexOf('page') === -1 || text.indexOf('face') === -1 || text.indexOf('info') === -1 || text.indexOf('char') === -1) {
                    return next();
                }
                var url = dirname(resource.url);
                if (url === '.') {
                    url = '';
                }
                if (this.baseUrl && url) {
                    if (this.baseUrl.charAt(this.baseUrl.length - 1) === '/') {
                        url += '/';
                    }
                    url.replace(this.baseUrl, '');
                }
                if (url && url.charAt(url.length - 1) !== '/') {
                    url += '/';
                }
                var textureUrl = getTextureUrl(url, text);
                if (PIXI.utils.TextureCache[textureUrl]) {
                    parse(resource, PIXI.utils.TextureCache[textureUrl]);
                    next();
                } else {
                    var loadOptions = {
                        crossOrigin: resource.crossOrigin,
                        loadType: PIXI.loaders.Resource.LOAD_TYPE.IMAGE
                    };
                    this.add(resource.name + '_image', textureUrl, loadOptions, function (res) {
                        parse(resource, res.texture);
                        next();
                    });
                }
                next();
            };
        }
        PIXI.bitmapFontParserTXT = bitmapFontParserTXT;
        function parse(resource, texture) {
            var currentLine, attr, data = { chars: {} };
            var text = resource.xhrType === 'text' ? resource.data : resource.xhr.responseText;
            var lines = text.split('\n');
            for (var i = 0; i < lines.length; i++) {
                if (lines[i].indexOf('info') === 0) {
                    currentLine = lines[i].substring(5);
                    attr = getAttr(currentLine);
                    data.font = attr.face;
                    data.size = parseInt(attr.size);
                }
                if (lines[i].indexOf('common ') === 0) {
                    currentLine = lines[i].substring(7);
                    attr = getAttr(currentLine);
                    data.lineHeight = parseInt(attr.lineHeight);
                }
                if (lines[i].indexOf('char ') === 0) {
                    currentLine = lines[i].substring(5);
                    attr = getAttr(currentLine);
                    var charCode = parseInt(attr.id);
                    var textureRect = new PIXI.Rectangle(parseInt(attr.x), parseInt(attr.y), parseInt(attr.width), parseInt(attr.height));
                    data.chars[charCode] = {
                        xOffset: parseInt(attr.xoffset),
                        yOffset: parseInt(attr.yoffset),
                        xAdvance: parseInt(attr.xadvance),
                        kerning: {},
                        texture: new PIXI.Texture(texture.baseTexture, textureRect)
                    };
                }
                if (lines[i].indexOf('kerning ') === 0) {
                    currentLine = lines[i].substring(8);
                    attr = getAttr(currentLine);
                    var first = parseInt(attr.first);
                    var second = parseInt(attr.second);
                    data.chars[second].kerning[first] = parseInt(attr.amount);
                }
            }
            resource.bitmapFont = data;
            PIXI.extras.BitmapText.fonts[data.font] = data;
        }
        function dirname(path) {
            return path.replace(/\\/g, '/').replace(/\/[^\/]*$/, '');
        }
        function getTextureUrl(url, data) {
            var textureUrl;
            var lines = data.split('\n');
            for (var i = 0; i < lines.length; i++) {
                if (lines[i].indexOf('page') === 0) {
                    var currentLine = lines[i].substring(5);
                    var file = currentLine.substring(currentLine.indexOf('file=')).split('=')[1];
                    textureUrl = url + file.substr(1, file.length - 2);
                    break;
                }
            }
            return textureUrl;
        }
        function getAttr(line) {
            var regex = /"(\w*\d*\s*(-|_)*)*"/g, attr = line.split(/\s+/g), data = {};
            for (var i = 0; i < attr.length; i++) {
                var d = attr[i].split('=');
                var m = d[1].match(regex);
                if (m && m.length >= 1) {
                    d[1] = d[1].substr(1, d[1].length - 2);
                }
                data[d[0]] = d[1];
            }
            return data;
        }
    }(PIXI || (PIXI = {})));
    ///<reference path="../audio/AudioManager.ts" />
    ///<reference path="../Audio/Audio.ts" />
    var PIXI;
    (function (PIXI) {
        var _allowedExt = [
            'm4a',
            'ogg',
            'mp3',
            'wav'
        ];
        function audioParser() {
            return function (resource, next) {
                if (!PIXI.Device.isAudioSupported || !resource.data) {
                    return next();
                }
                var ext = _getExt(resource.url);
                if (_allowedExt.indexOf(ext) === -1) {
                    return next();
                }
                if (!_canPlay(ext)) {
                    return next();
                }
                var name = resource.name || resource.url;
                if (PIXI.utils._audioTypeSelected === PIXI.AUDIO_TYPE.WEBAUDIO) {
                    PIXI.Device.globalWebAudioContext.decodeAudioData(resource.data, _addToCache.bind(this, next, name));
                } else {
                    return _addToCache(next, name, resource.data);
                }
            };
        }
        PIXI.audioParser = audioParser;
        function audioParserUrl(resourceUrl) {
            var ext;
            var url;
            for (var i = 0; i < resourceUrl.length; i++) {
                ext = _getExt(resourceUrl[i]);
                if (_allowedExt.indexOf(ext) === -1) {
                    break;
                }
                if (_canPlay(ext)) {
                    url = resourceUrl[i];
                    break;
                }
            }
            return url;
        }
        PIXI.audioParserUrl = audioParserUrl;
        function _addToCache(next, name, data) {
            PIXI.utils.AudioCache[name] = new PIXI.Audio(data, name);
            return next();
        }
        function _getExt(url) {
            return url.split('?').shift().split('.').pop().toLowerCase();
        }
        function _canPlay(ext) {
            var deviceCanPlay = false;
            switch (ext) {
            case 'm4a':
                deviceCanPlay = PIXI.Device.isM4aSupported;
                break;
            case 'mp3':
                deviceCanPlay = PIXI.Device.isMp3Supported;
                break;
            case 'ogg':
                deviceCanPlay = PIXI.Device.isOggSupported;
                break;
            case 'wav':
                deviceCanPlay = PIXI.Device.isWavSupported;
                break;
            }
            return deviceCanPlay;
        }
    }(PIXI || (PIXI = {})));
    ///<reference path="../../defs/pixi.js.d.ts" />
    ///<reference path="./const.ts" />
    var PIXI;
    (function (PIXI) {
        var utils;
        (function (utils) {
            utils._audioTypeSelected = PIXI.AUDIO_TYPE.WEBAUDIO;
            utils.AudioCache = {};
        }(utils = PIXI.utils || (PIXI.utils = {})));
    }(PIXI || (PIXI = {})));
    var __extends = this && this.__extends || function (d, b) {
        for (var p in b)
            if (b.hasOwnProperty(p))
                d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        __.prototype = b.prototype;
        d.prototype = new __();
    };
    ///<reference path="../../defs/pixi.js.d.ts" />
    ///<reference path="../core/const.ts" />
    ///<reference path="./bitmapFontParserTxt.ts" />
    ///<reference path="./audioParser.ts" />
    ///<reference path="../core/Utils.ts" />
    var PIXI;
    (function (PIXI) {
        var loaders;
        (function (loaders) {
            loaders.Loader.addPixiMiddleware(PIXI.bitmapFontParserTXT);
            loaders.Loader.addPixiMiddleware(PIXI.audioParser);
            var TurboLoader = function (_super) {
                __extends(TurboLoader, _super);
                function TurboLoader(baseUrl, assetConcurrency) {
                    _super.call(this, baseUrl, assetConcurrency);
                    if (PIXI.Device.isAudioSupported) {
                        _checkAudioType();
                    }
                }
                TurboLoader.prototype.add = function (name, url, options, cb) {
                    if (typeof name === 'object') {
                        if (Object.prototype.toString.call(name.url) === '[object Array]') {
                            name.url = PIXI.audioParserUrl(name.url);
                        }
                    }
                    if (Object.prototype.toString.call(url) === '[object Array]') {
                        url = PIXI.audioParserUrl(url);
                    }
                    return _super.prototype.add.call(this, name, url, options, cb);
                };
                return TurboLoader;
            }(loaders.Loader);
            loaders.Loader = TurboLoader;
            function _checkAudioType() {
                if (PIXI.Device.isMp3Supported)
                    _setAudioExt('mp3');
                if (PIXI.Device.isOggSupported)
                    _setAudioExt('ogg');
                if (PIXI.Device.isWavSupported)
                    _setAudioExt('wav');
                if (PIXI.Device.isM4aSupported)
                    _setAudioExt('m4a');
            }
            function _setAudioExt(ext) {
                if (PIXI.utils._audioTypeSelected === PIXI.AUDIO_TYPE.WEBAUDIO) {
                    loaders.Resource.setExtensionXhrType(ext, loaders.Resource.XHR_RESPONSE_TYPE.BUFFER);
                } else {
                    loaders.Resource.setExtensionLoadType(ext, loaders.Resource.LOAD_TYPE.AUDIO);
                }
            }
        }(loaders = PIXI.loaders || (PIXI.loaders = {})));
    }(PIXI || (PIXI = {})));
    var PIXI;
    (function (PIXI) {
        var DataManager = function () {
            function DataManager(id, usePersistantData) {
                if (usePersistantData === void 0) {
                    usePersistantData = false;
                }
                this.id = id;
                this.usePersistantData = usePersistantData;
                this.load();
            }
            DataManager.prototype.load = function () {
                this._data = JSON.parse(localStorage.getItem(this.id)) || {};
                return this;
            };
            DataManager.prototype.save = function () {
                if (this.usePersistantData) {
                    localStorage.setItem(this.id, JSON.stringify(this._data));
                }
                return this;
            };
            DataManager.prototype.reset = function () {
                this._data = {};
                this.save();
                return this;
            };
            DataManager.prototype.set = function (key, value) {
                if (Object.prototype.toString.call(key) === '[object Object]') {
                    Object.assign(this._data, key);
                } else if (typeof key === 'string') {
                    this._data[key] = value;
                }
                this.save();
                return this;
            };
            DataManager.prototype.get = function (key) {
                if (!key) {
                    return this._data;
                }
                return this._data[key];
            };
            DataManager.prototype.del = function (key) {
                delete this._data[key];
                this.save();
                return this;
            };
            return DataManager;
        }();
        PIXI.DataManager = DataManager;
    }(PIXI || (PIXI = {})));
    ///<reference path="../../defs/pixi.js.d.ts" />
    ///<reference path="./const.ts" />
    ///<reference path="./Device.ts" />
    ///<reference path="../display/Scene.ts" />
    ///<reference path="../audio/AudioManager.ts" />
    ///<reference path="../input/InputManager.ts" />
    ///<reference path="../loader/Loader.ts" />
    ///<reference path="./DataManager.ts" />
    var PIXI;
    (function (PIXI) {
        var last = 0;
        var maxFrameMS = 0.35;
        var defaultGameConfig = {
            id: 'pixi.default.id',
            width: 800,
            height: 600,
            useWebAudio: true,
            usePersistantData: false,
            gameScaleType: PIXI.GAME_SCALE_TYPE.NONE,
            stopAtLostFocus: true,
            assetsUrl: './',
            loaderConcurrency: 10,
            audioChannelLines: 10,
            soundChannelLines: 10,
            musicChannelLines: 1,
            zIndexEnabled: PIXI.zIndexEnabled
        };
        var Game = function () {
            function Game(config, rendererOptions) {
                this._scenes = [];
                this.delta = 0;
                this.time = 0;
                this.lastTime = 0;
                config = Object.assign(defaultGameConfig, config);
                this.id = config.id;
                this.renderer = PIXI.autoDetectRenderer(config.width, config.height, rendererOptions);
                this.canvas = this.renderer.view;
                document.body.appendChild(this.canvas);
                this.isWebGL = this.renderer.type === PIXI.RENDERER_TYPE.WEBGL;
                this.isWebAudio = PIXI.Device.isAudioSupported && PIXI.Device.isWebAudioSupported && config.useWebAudio;
                PIXI.utils._audioTypeSelected = this.isWebAudio ? PIXI.AUDIO_TYPE.WEBAUDIO : PIXI.AUDIO_TYPE.HTMLAUDIO;
                PIXI.zIndexEnabled = config.zIndexEnabled;
                this.input = new PIXI.InputManager(this);
                this.audio = new PIXI.AudioManager(config.audioChannelLines, config.soundChannelLines, config.musicChannelLines);
                this.data = new PIXI.DataManager(this.id, config.usePersistantData);
                this.loader = new PIXI.loaders.Loader(config.assetsUrl, config.loaderConcurrency);
                var initialScene = new PIXI.Scene('initial').addTo(this);
                this.setScene(initialScene);
                if (config.gameScaleType !== PIXI.GAME_SCALE_TYPE.NONE) {
                    this.autoResize(config.gameScaleType);
                }
                if (config.stopAtLostFocus) {
                    this.enableStopAtLostFocus();
                }
            }
            Game.prototype._animate = function () {
                this.raf = window.requestAnimationFrame(this._animate.bind(this));
                if (this.scene) {
                    var now = Date.now();
                    this.time += Math.min((now - last) / 1000, maxFrameMS);
                    this.delta = this.time - this.lastTime;
                    this.lastTime = this.time;
                    last = now;
                    this.update(this.delta);
                    this.renderer.render(this.scene);
                }
            };
            Game.prototype.update = function (deltaTime) {
                this.scene.update(this.delta);
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
                last = Date.now();
                this._animate();
                return this;
            };
            Game.prototype.stop = function () {
                window.cancelAnimationFrame(this.raf);
                return this;
            };
            Game.prototype.enableStopAtLostFocus = function (state) {
                if (state === void 0) {
                    state = true;
                }
                if (state) {
                    document.addEventListener(PIXI.Device.getVisibilityChangeEvent(), this._onVisibilityChange.bind(this));
                } else {
                    document.removeEventListener(PIXI.Device.getVisibilityChangeEvent(), this._onVisibilityChange);
                }
                return this;
            };
            Game.prototype.disableStopAtLostFocus = function () {
                return this.enableStopAtLostFocus(false);
            };
            Game.prototype._onVisibilityChange = function () {
                var isHide = !!(document.hidden || document.webkitHidden || document.mozHidden || document.msHidden);
                if (isHide) {
                    this.stop();
                } else {
                    this.start();
                }
                this.onLostFocus(isHide);
            };
            Game.prototype.onLostFocus = function (isHide) {
                return this;
            };
            Game.prototype.setScene = function (scene) {
                if (!(scene instanceof PIXI.Scene)) {
                    scene = this.getScene(scene);
                }
                this.scene = scene;
                this.scene.position.set(this.width / 2, this.height / 2);
                return this;
            };
            Game.prototype.getScene = function (id) {
                var scene = null;
                for (var i = 0; i < this._scenes.length; i++) {
                    if (this._scenes[i].id === id) {
                        scene = this._scenes[i];
                    }
                }
                return scene;
            };
            Game.prototype.createScene = function (id) {
                return new PIXI.Scene(id).addTo(this);
            };
            Game.prototype.removeScene = function (scene) {
                if (typeof scene === 'string') {
                    scene = this.getScene(scene);
                }
                var index = this._scenes.indexOf(scene);
                if (index !== -1) {
                    this._scenes.splice(index, 1);
                }
                return this;
            };
            Game.prototype.addScene = function (scene) {
                this._scenes.push(scene);
                return this;
            };
            Game.prototype.removeAllScenes = function () {
                this._scenes.length = 0;
                this.scene = null;
                return this;
            };
            Game.prototype.resize = function (width, height, renderer) {
                if (renderer === void 0) {
                    renderer = false;
                }
                if (renderer) {
                    this.renderer.resize(width, height);
                }
                this.canvas.style.width = width + 'px';
                this.canvas.style.height = height + 'px';
                return this;
            };
            Game.prototype.autoResize = function (mode) {
                if (this._resizeListener) {
                    window.removeEventListener('resize', this._resizeListener);
                }
                if (mode === PIXI.GAME_SCALE_TYPE.NONE)
                    return;
                switch (mode) {
                case PIXI.GAME_SCALE_TYPE.ASPECT_FIT:
                    this._resizeListener = this._resizeModeAspectFit;
                    break;
                case PIXI.GAME_SCALE_TYPE.ASPECT_FILL:
                    this._resizeListener = this._resizeModeAspectFill;
                    break;
                case PIXI.GAME_SCALE_TYPE.FILL:
                    this._resizeListener = this._resizeModeFill;
                    break;
                }
                window.addEventListener('resize', this._resizeListener.bind(this));
                this._resizeListener();
                return this;
            };
            Game.prototype._resizeModeAspectFit = function () {
                var ww = parseInt(this.canvas.style.width, 10) || this.canvas.width;
                var hh = parseInt(this.canvas.style.height, 10) || this.canvas.height;
                if (window.innerWidth !== ww || window.innerHeight !== hh) {
                    var scale = Math.min(window.innerWidth / this.width, window.innerHeight / this.height);
                    this.resize(this.width * scale, this.height * scale);
                }
            };
            Game.prototype._resizeModeAspectFill = function () {
                var ww = parseInt(this.canvas.style.width, 10) || this.canvas.width;
                var hh = parseInt(this.canvas.style.height, 10) || this.canvas.height;
                if (window.innerWidth !== ww || window.innerHeight !== hh) {
                    var scale = Math.max(window.innerWidth / this.width, window.innerHeight / this.height);
                    var width = this.width * scale;
                    var height = this.height * scale;
                    var topMargin = (window.innerHeight - height) / 2;
                    var leftMargin = (window.innerWidth - width) / 2;
                    this.resize(width, height);
                    var style = this.canvas.style;
                    style['margin-top'] = topMargin + 'px';
                    style['margin-left'] = leftMargin + 'px';
                }
            };
            Game.prototype._resizeModeFill = function () {
                var ww = parseInt(this.canvas.style.width, 10) || this.canvas.width;
                var hh = parseInt(this.canvas.style.height, 10) || this.canvas.height;
                if (window.innerWidth !== ww || window.innerHeight !== hh) {
                    this.resize(window.innerWidth, window.innerHeight);
                }
            };
            Object.defineProperty(Game.prototype, 'width', {
                get: function () {
                    return this.renderer.width;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Game.prototype, 'height', {
                get: function () {
                    return this.renderer.height;
                },
                enumerable: true,
                configurable: true
            });
            return Game;
        }();
        PIXI.Game = Game;
    }(PIXI || (PIXI = {})));
    ///<reference path="./AudioLine.ts" />
    ///<reference path="../core/Game.ts" />
    var PIXI;
    (function (PIXI) {
        var AudioManager = function () {
            function AudioManager(audioChannelLines, soundChannelLines, musicChannelLines) {
                if (audioChannelLines === void 0) {
                    audioChannelLines = 10;
                }
                if (soundChannelLines === void 0) {
                    soundChannelLines = 10;
                }
                if (musicChannelLines === void 0) {
                    musicChannelLines = 1;
                }
                this.audioChannelLines = audioChannelLines;
                this.soundChannelLines = soundChannelLines;
                this.musicChannelLines = musicChannelLines;
                this.soundLines = [];
                this.musicLines = [];
                this.normalLines = [];
                this._tempLines = [];
                this.musicMuted = false;
                this.soundMuted = false;
                if (PIXI.utils._audioTypeSelected === PIXI.AUDIO_TYPE.WEBAUDIO) {
                    this.context = PIXI.Device.globalWebAudioContext;
                    this.gainNode = this.createGainNode(this.context);
                    this.gainNode.connect(this.context.destination);
                }
                var i;
                for (i = 0; i < this.audioChannelLines; i++) {
                    this.normalLines.push(new PIXI.AudioLine(this));
                }
                for (i = 0; i < this.soundChannelLines; i++) {
                    this.soundLines.push(new PIXI.AudioLine(this));
                }
                for (i = 0; i < this.musicChannelLines; i++) {
                    this.musicLines.push(new PIXI.AudioLine(this));
                }
            }
            AudioManager.prototype.getAudio = function (id) {
                var audio = PIXI.utils.AudioCache[id];
                audio.manager = this;
                return audio;
            };
            AudioManager.prototype.pauseAllLines = function () {
                this.pauseMusic();
                this.pauseSound();
                return this;
            };
            AudioManager.prototype.resumeAllLines = function () {
                this.resumeMusic();
                this.resumeSound();
                return this;
            };
            AudioManager.prototype.play = function (id, loop, callback) {
                if (typeof loop === 'function') {
                    callback = loop;
                    loop = false;
                }
                return this._play(id, this.normalLines, loop, callback);
            };
            AudioManager.prototype.playMusic = function (id, loop, callback) {
                if (typeof loop === 'function') {
                    callback = loop;
                    loop = false;
                }
                return this._play(id, this.musicLines, loop, callback);
            };
            AudioManager.prototype.playSound = function (id, loop, callback) {
                if (typeof loop === 'function') {
                    callback = loop;
                    loop = false;
                }
                return this._play(id, this.soundLines, loop, callback);
            };
            AudioManager.prototype.stop = function (id) {
                return this._stop(id, this.normalLines);
            };
            AudioManager.prototype.stopMusic = function (id) {
                return this._stop(id, this.musicLines);
            };
            AudioManager.prototype.stopSound = function (id) {
                return this._stop(id, this.soundLines);
            };
            AudioManager.prototype.pause = function (id) {
                return this._pause(id, this.normalLines);
            };
            AudioManager.prototype.pauseMusic = function (id) {
                return this._pause(id, this.musicLines);
            };
            AudioManager.prototype.pauseSound = function (id) {
                return this._pause(id, this.soundLines);
            };
            AudioManager.prototype.resume = function (id) {
                return this._resume(id, this.normalLines);
            };
            AudioManager.prototype.resumeMusic = function (id) {
                return this._resume(id, this.musicLines);
            };
            AudioManager.prototype.resumeSound = function (id) {
                return this._resume(id, this.soundLines);
            };
            AudioManager.prototype.mute = function (id) {
                return this._mute(id, this.normalLines);
            };
            AudioManager.prototype.muteMusic = function (id) {
                return this._mute(id, this.musicLines);
            };
            AudioManager.prototype.muteSound = function (id) {
                return this._mute(id, this.soundLines);
            };
            AudioManager.prototype.unmute = function (id) {
                return this._unmute(id, this.normalLines);
            };
            AudioManager.prototype.unmuteMusic = function (id) {
                return this._unmute(id, this.musicLines);
            };
            AudioManager.prototype.unmuteSound = function (id) {
                return this._unmute(id, this.soundLines);
            };
            AudioManager.prototype._pause = function (id, lines) {
                if (!id) {
                    for (var i = 0; i < lines.length; i++) {
                        if (!lines[i].available) {
                            lines[i].pause();
                        }
                    }
                    return this;
                }
                var audioLines = this._getLinesById(id, lines);
                if (audioLines.length) {
                    for (i = 0; i < audioLines.length; i++) {
                        audioLines[i].pause();
                    }
                }
                return this;
            };
            AudioManager.prototype._resume = function (id, lines) {
                if (!id) {
                    for (var i = 0; i < lines.length; i++) {
                        if (!lines[i].available) {
                            lines[i].resume();
                        }
                    }
                    return this;
                }
                var audioLines = this._getLinesById(id, lines);
                if (audioLines.length) {
                    for (i = 0; i < audioLines.length; i++) {
                        audioLines[i].resume();
                    }
                }
                return this;
            };
            AudioManager.prototype._play = function (id, lines, loop, callback) {
                if (loop === void 0) {
                    loop = false;
                }
                var line = this._getAvailableLineFrom(lines);
                if (!line) {
                    console.error('AudioManager: All lines are busy!');
                    return this;
                }
                var audio = this.getAudio(id);
                if (!audio) {
                    console.error('Audio (' + id + ') not found.');
                    return this;
                }
                line.setAudio(audio, loop, callback).play();
                return this;
            };
            AudioManager.prototype._stop = function (id, lines) {
                if (!id) {
                    for (var i = 0; i < lines.length; i++) {
                        if (!lines[i].available) {
                            lines[i].stop();
                        }
                    }
                    return this;
                }
                var audioLines = this._getLinesById(id, lines);
                if (audioLines.length) {
                    for (i = 0; i < audioLines.length; i++) {
                        audioLines[i].stop();
                    }
                }
                return this;
            };
            AudioManager.prototype._mute = function (id, lines) {
                if (!id) {
                    for (var i = 0; i < lines.length; i++) {
                        if (!lines[i].available) {
                            lines[i].mute();
                        }
                    }
                    return this;
                }
                var audioLines = this._getLinesById(id, lines);
                if (audioLines.length) {
                    for (i = 0; i < audioLines.length; i++) {
                        audioLines[i].mute();
                    }
                }
                return this;
            };
            AudioManager.prototype._unmute = function (id, lines) {
                if (!id) {
                    for (var i = 0; i < lines.length; i++) {
                        if (!lines[i].available) {
                            lines[i].unmute();
                        }
                    }
                    return this;
                }
                var audioLines = this._getLinesById(id, lines);
                if (audioLines.length) {
                    for (i = 0; i < audioLines.length; i++) {
                        audioLines[i].unmute();
                    }
                }
                return this;
            };
            AudioManager.prototype._getLinesById = function (id, lines) {
                this._tempLines.length = 0;
                for (var i = 0; i < lines.length; i++) {
                    if (!lines[i].available) {
                        if (lines[i].audio.id === id)
                            this._tempLines.push(lines[i]);
                    }
                }
                return this._tempLines;
            };
            AudioManager.prototype._getAvailableLineFrom = function (lines) {
                var l;
                for (var i = 0; i < lines.length; i++) {
                    if (lines[i].available) {
                        l = lines[i];
                        break;
                    }
                }
                return l;
            };
            AudioManager.prototype.createGainNode = function (ctx) {
                return ctx.createGain ? ctx.createGain() : ctx.createGainNode();
            };
            return AudioManager;
        }();
        PIXI.AudioManager = AudioManager;
    }(PIXI || (PIXI = {})));
    ///<reference path="./AudioManager.ts" />
    var PIXI;
    (function (PIXI) {
        var Audio = function () {
            function Audio(source, id) {
                this.source = source;
                this.id = id;
                this.loop = false;
                this._volume = 1;
                this.muted = false;
            }
            Audio.prototype.play = function (loop, callback) {
                if (!this.manager) {
                    console.error('This audio need a manager.');
                    return this;
                }
                if (typeof loop === 'function') {
                    callback = loop;
                    loop = false;
                }
                this.manager.play(this.id, loop, callback);
                return this;
            };
            Audio.prototype.stop = function () {
                if (!this.manager) {
                    console.error('This audio need a manager.');
                    return this;
                }
                this.manager.stop(this.id);
                return this;
            };
            Audio.prototype.mute = function () {
                if (!this.manager) {
                    console.error('This audio need a manager.');
                    return this;
                }
                this.muted = true;
                this.manager.mute(this.id);
                return this;
            };
            Audio.prototype.unmute = function () {
                if (!this.manager) {
                    console.error('This audio need a manager.');
                    return this;
                }
                this.muted = false;
                this.manager.unmute(this.id);
                return this;
            };
            Audio.prototype.pause = function () {
                if (!this.manager) {
                    console.error('This audio need a manager.');
                    return this;
                }
                this.manager.pause(this.id);
                return this;
            };
            Audio.prototype.resume = function () {
                if (!this.manager) {
                    console.error('This audio need a manager.');
                    return this;
                }
                this.manager.resume(this.id);
                return this;
            };
            Object.defineProperty(Audio.prototype, 'volume', {
                get: function () {
                    return this._volume;
                },
                set: function (value) {
                    this._volume = value;
                    if (this.manager) {
                    }
                },
                enumerable: true,
                configurable: true
            });
            return Audio;
        }();
        PIXI.Audio = Audio;
    }(PIXI || (PIXI = {})));
    ///<reference path="../../defs/pixi.js.d.ts" />
    var PIXI;
    (function (PIXI) {
        var Pool = function () {
            function Pool(amount, objectCtor, args) {
                if (args === void 0) {
                    args = [];
                }
                this.objectCtor = objectCtor;
                this.args = args;
                this._items = [];
                for (var i = 0; i < amount; i++) {
                    this._items.push(this._newObject());
                }
            }
            Pool.prototype._newObject = function () {
                var obj;
                try {
                    obj = new (Function.prototype.bind.apply(this.objectCtor, [null].concat(this.args)))();
                } catch (e) {
                    obj = _newObj(this.objectCtor, this.args);
                }
                var me = this;
                obj.returnToPool = function returnToPool() {
                    me.put(this);
                };
                return obj;
            };
            Pool.prototype.put = function (item) {
                this._items.unshift(item);
                if (item.onReturnToPool)
                    item.onReturnToPool(this);
            };
            Pool.prototype.get = function () {
                var item = this._items.length ? this._items.pop() : this._newObject();
                if (item.onGetFromPool)
                    item.onGetFromPool(this);
                return item;
            };
            Object.defineProperty(Pool.prototype, 'length', {
                get: function () {
                    return this._items.length;
                },
                enumerable: true,
                configurable: true
            });
            return Pool;
        }();
        PIXI.Pool = Pool;
        //safari fix
        function _newObj(obj, args) {
            var ev = 'Function(\'obj\',';
            var fn = '"return new obj(';
            for (var i = 0; i < args.length; i++) {
                ev += '\'a' + i + '\',';
                fn += 'a' + i;
                if (i !== args.length - 1) {
                    fn += ',';
                }
            }
            fn += ')"';
            ev += fn + ')';
            return eval(ev).apply(this, [obj].concat(args));
        }
    }(PIXI || (PIXI = {})));
    ///<reference path="../../defs/pixi.js.d.ts" />
    ///<reference path="../core/const.ts" />
    ///<reference path="../tween/Tween.ts" />
    var PIXI;
    (function (PIXI) {
        PIXI.Container._killedObjects = [];
        PIXI.Container.prototype._zIndex = 0;
        PIXI.Container.prototype.zDirty = false;
        PIXI.Container.prototype.update = function (deltaTime) {
            if (this.zDirty) {
                this.zDirty = false;
                this.sortChildrenByZIndex();
            }
            this.position.x += this.velocity.x * deltaTime;
            this.position.y += this.velocity.y * deltaTime;
            this.rotation += this.rotationSpeed * deltaTime;
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].update(deltaTime);
            }
            return this;
        };
        var _addChild = PIXI.Container.prototype.addChild;
        PIXI.Container.prototype.addChild = function (child) {
            _addChild.call(this, child);
            if (PIXI.zIndexEnabled)
                this.zDirty = true;
            return child;
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
        PIXI.Container.prototype.sortChildrenByZIndex = function () {
            this.children.sort(function (a, b) {
                var aZ = a.zIndex, bZ = b.zIndex;
                return aZ - bZ;
            });
            return this;
        };
        PIXI.Container.prototype.tween = function (manager) {
            return new PIXI.Tween(this);
        };
        Object.defineProperty(PIXI.Container.prototype, 'zIndex', {
            get: function () {
                return this._zIndex;
            },
            set: function (value) {
                this._zIndex = value;
                if (PIXI.zIndexEnabled && this.parent)
                    this.parent.zDirty = true;
            }
        });
    }(PIXI || (PIXI = {})));
    ///<reference path="../../defs/pixi.js.d.ts" />
    var PIXI;
    (function (PIXI) {
        PIXI.DisplayObject.prototype.speed = 0;
        PIXI.DisplayObject.prototype.velocity = new PIXI.Point();
        PIXI.DisplayObject.prototype.direction = 0;
        PIXI.DisplayObject.prototype.rotationSpeed = 0;
        PIXI.DisplayObject.prototype.update = function (deltaTime) {
            return this;
        };
    }(PIXI || (PIXI = {})));
    ///<reference path="../../defs/pixi.js.d.ts" />
    ///<reference path="../tween/Path.ts" />
    var PIXI;
    (function (PIXI) {
        PIXI.Graphics.prototype.drawPath = function (path) {
            path.parsePoints();
            this.drawShape(path.polygon);
            return this;
        };
    }(PIXI || (PIXI = {})));    //todo 
}(typeof PIXI === 'object' ? PIXI : null));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInR1cmJvcGl4aS5qcyIsImluZGV4LnRzIiwiYXVkaW8vQXVkaW9MaW5lLnRzIiwiY29yZS9jb25zdC50cyIsImNvcmUvRGV2aWNlLnRzIiwiZGlzcGxheS9DYW1lcmEudHMiLCJ0aW1lci9UaW1lci50cyIsInRpbWVyL1RpbWVyTWFuYWdlci50cyIsInR3ZWVuL0Vhc2luZy50cyIsInR3ZWVuL1BhdGgudHMiLCJ0d2Vlbi9Ud2Vlbi50cyIsInR3ZWVuL1R3ZWVuTWFuYWdlci50cyIsImRpc3BsYXkvU2NlbmUudHMiLCJpbnB1dC9JbnB1dE1hbmFnZXIudHMiLCJsb2FkZXIvYml0bWFwRm9udFBhcnNlclRYVC50cyIsImxvYWRlci9hdWRpb1BhcnNlci50cyIsImNvcmUvVXRpbHMudHMiLCJsb2FkZXIvTG9hZGVyLnRzIiwiY29yZS9EYXRhTWFuYWdlci50cyIsImNvcmUvR2FtZS50cyIsImF1ZGlvL0F1ZGlvTWFuYWdlci50cyIsImF1ZGlvL0F1ZGlvLnRzIiwiY29yZS9Qb29sLnRzIiwiZGlzcGxheS9Db250YWluZXIudHMiLCJkaXNwbGF5L0Rpc3BsYXlPYmplY3QudHMiLCJkaXNwbGF5L0dyYXBoaWNzLnRzIl0sIm5hbWVzIjpbIlBJWEkiLCJFcnJvciIsIlBJWElfVkVSU0lPTl9SRVFVSVJFRCIsIlBJWElfVkVSU0lPTiIsIlZFUlNJT04iLCJtYXRjaCIsIkhUTUxBdWRpbyIsIkF1ZGlvIiwiUElYSS5BdWRpb0xpbmUiLCJQSVhJLkF1ZGlvTGluZS5jb25zdHJ1Y3RvciIsIlBJWEkuQXVkaW9MaW5lLnNldEF1ZGlvIiwiUElYSS5BdWRpb0xpbmUucGxheSIsIlBJWEkuQXVkaW9MaW5lLnN0b3AiLCJQSVhJLkF1ZGlvTGluZS5wYXVzZSIsIlBJWEkuQXVkaW9MaW5lLnJlc3VtZSIsIlBJWEkuQXVkaW9MaW5lLm11dGUiLCJQSVhJLkF1ZGlvTGluZS51bm11dGUiLCJQSVhJLkF1ZGlvTGluZS52b2x1bWUiLCJQSVhJLkF1ZGlvTGluZS5yZXNldCIsIlBJWEkuQXVkaW9MaW5lLl9vbkVuZCIsIlBJWEkuR0FNRV9TQ0FMRV9UWVBFIiwiUElYSS5BVURJT19UWVBFIiwiUElYSS5EZXZpY2UiLCJQSVhJLkRldmljZS5nZXRNb3VzZVdoZWVsRXZlbnQiLCJQSVhJLkRldmljZS52aWJyYXRlIiwiUElYSS5EZXZpY2UuZ2V0VmlzaWJpbGl0eUNoYW5nZUV2ZW50IiwiUElYSS5EZXZpY2UuaXNPbmxpbmUiLCJfX2V4dGVuZHMiLCJkIiwiYiIsInAiLCJoYXNPd25Qcm9wZXJ0eSIsIl9fIiwiY29uc3RydWN0b3IiLCJwcm90b3R5cGUiLCJQSVhJLkNhbWVyYSIsIlBJWEkuQ2FtZXJhLmNvbnN0cnVjdG9yIiwiUElYSS5DYW1lcmEudXBkYXRlIiwiZ2V0IiwiUElYSS5DYW1lcmEuZW5hYmxlZCIsInNldCIsImVudW1lcmFibGUiLCJjb25maWd1cmFibGUiLCJQSVhJLlRpbWVyIiwiUElYSS5UaW1lci5jb25zdHJ1Y3RvciIsIlBJWEkuVGltZXIudXBkYXRlIiwiUElYSS5UaW1lci5hZGRUbyIsIlBJWEkuVGltZXIucmVtb3ZlIiwiUElYSS5UaW1lci5zdGFydCIsIlBJWEkuVGltZXIuc3RvcCIsIlBJWEkuVGltZXIucmVzZXQiLCJQSVhJLlRpbWVyLm9uU3RhcnQiLCJQSVhJLlRpbWVyLm9uRW5kIiwiUElYSS5UaW1lci5vblN0b3AiLCJQSVhJLlRpbWVyLm9uVXBkYXRlIiwiUElYSS5UaW1lci5vblJlcGVhdCIsIlBJWEkuVGltZXJNYW5hZ2VyIiwiUElYSS5UaW1lck1hbmFnZXIuY29uc3RydWN0b3IiLCJQSVhJLlRpbWVyTWFuYWdlci51cGRhdGUiLCJQSVhJLlRpbWVyTWFuYWdlci5yZW1vdmVUaW1lciIsIlBJWEkuVGltZXJNYW5hZ2VyLmFkZFRpbWVyIiwiUElYSS5UaW1lck1hbmFnZXIuY3JlYXRlVGltZXIiLCJQSVhJLlRpbWVyTWFuYWdlci5fcmVtb3ZlIiwiUElYSS5FYXNpbmciLCJQSVhJLkVhc2luZy5saW5lYXIiLCJrIiwiUElYSS5FYXNpbmcuaW5RdWFkIiwiUElYSS5FYXNpbmcub3V0UXVhZCIsIlBJWEkuRWFzaW5nLmluT3V0UXVhZCIsIlBJWEkuRWFzaW5nLmluQ3ViaWMiLCJQSVhJLkVhc2luZy5vdXRDdWJpYyIsIlBJWEkuRWFzaW5nLmluT3V0Q3ViaWMiLCJQSVhJLkVhc2luZy5pblF1YXJ0IiwiUElYSS5FYXNpbmcub3V0UXVhcnQiLCJQSVhJLkVhc2luZy5pbk91dFF1YXJ0IiwiUElYSS5FYXNpbmcuaW5RdWludCIsIlBJWEkuRWFzaW5nLm91dFF1aW50IiwiUElYSS5FYXNpbmcuaW5PdXRRdWludCIsIlBJWEkuRWFzaW5nLmluU2luZSIsIk1hdGgiLCJjb3MiLCJQSSIsIlBJWEkuRWFzaW5nLm91dFNpbmUiLCJzaW4iLCJQSVhJLkVhc2luZy5pbk91dFNpbmUiLCJQSVhJLkVhc2luZy5pbkV4cG8iLCJwb3ciLCJQSVhJLkVhc2luZy5vdXRFeHBvIiwiUElYSS5FYXNpbmcuaW5PdXRFeHBvIiwiUElYSS5FYXNpbmcuaW5DaXJjIiwic3FydCIsIlBJWEkuRWFzaW5nLm91dENpcmMiLCJQSVhJLkVhc2luZy5pbk91dENpcmMiLCJQSVhJLkVhc2luZy5pbkVsYXN0aWMiLCJzIiwiYSIsImFzaW4iLCJQSVhJLkVhc2luZy5vdXRFbGFzdGljIiwiUElYSS5FYXNpbmcuaW5PdXRFbGFzdGljIiwiUElYSS5FYXNpbmcuaW5CYWNrIiwidiIsIlBJWEkuRWFzaW5nLm91dEJhY2siLCJQSVhJLkVhc2luZy5pbk91dEJhY2siLCJQSVhJLkVhc2luZy5pbkJvdW5jZSIsIkVhc2luZyIsIm91dEJvdW5jZSIsIlBJWEkuRWFzaW5nLm91dEJvdW5jZSIsIlBJWEkuRWFzaW5nLmluT3V0Qm91bmNlIiwiaW5Cb3VuY2UiLCJQSVhJLlBhdGgiLCJQSVhJLlBhdGguY29uc3RydWN0b3IiLCJQSVhJLlBhdGgubW92ZVRvIiwiUElYSS5QYXRoLmxpbmVUbyIsIlBJWEkuUGF0aC5iZXppZXJDdXJ2ZVRvIiwiUElYSS5QYXRoLnF1YWRyYXRpY0N1cnZlVG8iLCJQSVhJLlBhdGguYXJjVG8iLCJQSVhJLlBhdGguYXJjIiwiUElYSS5QYXRoLmRyYXdTaGFwZSIsIlBJWEkuUGF0aC5nZXRQb2ludCIsIlBJWEkuUGF0aC5kaXN0YW5jZUJldHdlZW4iLCJQSVhJLlBhdGgudG90YWxEaXN0YW5jZSIsIlBJWEkuUGF0aC5nZXRQb2ludEF0IiwiUElYSS5QYXRoLmdldFBvaW50QXREaXN0YW5jZSIsIlBJWEkuUGF0aC5wYXJzZVBvaW50cyIsIlBJWEkuUGF0aC5jbGVhciIsIlBJWEkuUGF0aC5jbG9zZWQiLCJQSVhJLlBhdGgubGVuZ3RoIiwiUElYSS5Ud2VlbiIsIlBJWEkuVHdlZW4uY29uc3RydWN0b3IiLCJQSVhJLlR3ZWVuLmFkZFRvIiwiUElYSS5Ud2Vlbi5jaGFpbiIsIlBJWEkuVHdlZW4uc3RhcnQiLCJQSVhJLlR3ZWVuLnN0b3AiLCJQSVhJLlR3ZWVuLnRvIiwiUElYSS5Ud2Vlbi5mcm9tIiwiUElYSS5Ud2Vlbi5yZW1vdmUiLCJQSVhJLlR3ZWVuLnJlc2V0IiwiUElYSS5Ud2Vlbi5vblN0YXJ0IiwiUElYSS5Ud2Vlbi5vbkVuZCIsIlBJWEkuVHdlZW4ub25TdG9wIiwiUElYSS5Ud2Vlbi5vblVwZGF0ZSIsIlBJWEkuVHdlZW4ub25SZXBlYXQiLCJQSVhJLlR3ZWVuLm9uUGluZ1BvbmciLCJQSVhJLlR3ZWVuLnVwZGF0ZSIsIlBJWEkuVHdlZW4uX3BhcnNlRGF0YSIsIlBJWEkuVHdlZW4uX2FwcGx5IiwiUElYSS5Ud2Vlbi5fY2FuVXBkYXRlIiwiUElYSS5fZmluZE1hbmFnZXIiLCJQSVhJLl9wYXJzZVJlY3Vyc2l2ZURhdGEiLCJQSVhJLmlzT2JqZWN0IiwiUElYSS5fcmVjdXJzaXZlQXBwbHkiLCJQSVhJLlR3ZWVuTWFuYWdlciIsIlBJWEkuVHdlZW5NYW5hZ2VyLmNvbnN0cnVjdG9yIiwiUElYSS5Ud2Vlbk1hbmFnZXIudXBkYXRlIiwiUElYSS5Ud2Vlbk1hbmFnZXIuZ2V0VHdlZW5zRm9yVGFyZ2VyIiwiUElYSS5Ud2Vlbk1hbmFnZXIuY3JlYXRlVHdlZW4iLCJQSVhJLlR3ZWVuTWFuYWdlci5hZGRUd2VlbiIsIlBJWEkuVHdlZW5NYW5hZ2VyLnJlbW92ZVR3ZWVuIiwiUElYSS5Ud2Vlbk1hbmFnZXIuX3JlbW92ZSIsIlBJWEkuU2NlbmUiLCJQSVhJLlNjZW5lLmNvbnN0cnVjdG9yIiwiUElYSS5TY2VuZS51cGRhdGUiLCJQSVhJLlNjZW5lLmFkZFRvIiwiUElYSS5JbnB1dE1hbmFnZXIiLCJQSVhJLklucHV0TWFuYWdlci5jb25zdHJ1Y3RvciIsIlBJWEkuYml0bWFwRm9udFBhcnNlclRYVCIsInJlc291cmNlIiwiZGF0YSIsInhoclR5cGUiLCJuZXh0IiwidGV4dCIsInhociIsInJlc3BvbnNlVGV4dCIsImluZGV4T2YiLCJ1cmwiLCJkaXJuYW1lIiwiYmFzZVVybCIsImNoYXJBdCIsImxlbmd0aCIsInJlcGxhY2UiLCJ0ZXh0dXJlVXJsIiwiZ2V0VGV4dHVyZVVybCIsInV0aWxzIiwiVGV4dHVyZUNhY2hlIiwicGFyc2UiLCJsb2FkT3B0aW9ucyIsImNyb3NzT3JpZ2luIiwibG9hZFR5cGUiLCJsb2FkZXJzIiwiUmVzb3VyY2UiLCJMT0FEX1RZUEUiLCJJTUFHRSIsImFkZCIsIm5hbWUiLCJyZXMiLCJ0ZXh0dXJlIiwiUElYSS5wYXJzZSIsIlBJWEkuZGlybmFtZSIsIlBJWEkuZ2V0VGV4dHVyZVVybCIsIlBJWEkuZ2V0QXR0ciIsIlBJWEkuYXVkaW9QYXJzZXIiLCJEZXZpY2UiLCJpc0F1ZGlvU3VwcG9ydGVkIiwiZXh0IiwiX2dldEV4dCIsIl9hbGxvd2VkRXh0IiwiX2NhblBsYXkiLCJfYXVkaW9UeXBlU2VsZWN0ZWQiLCJBVURJT19UWVBFIiwiV0VCQVVESU8iLCJnbG9iYWxXZWJBdWRpb0NvbnRleHQiLCJkZWNvZGVBdWRpb0RhdGEiLCJfYWRkVG9DYWNoZSIsImJpbmQiLCJQSVhJLmF1ZGlvUGFyc2VyVXJsIiwiUElYSS5fYWRkVG9DYWNoZSIsIlBJWEkuX2dldEV4dCIsIlBJWEkuX2NhblBsYXkiLCJQSVhJLnV0aWxzIiwiUElYSS5sb2FkZXJzIiwiUElYSS5sb2FkZXJzLlR1cmJvTG9hZGVyIiwiUElYSS5sb2FkZXJzLlR1cmJvTG9hZGVyLmNvbnN0cnVjdG9yIiwiUElYSS5sb2FkZXJzLlR1cmJvTG9hZGVyLmFkZCIsIlBJWEkubG9hZGVycy5fY2hlY2tBdWRpb1R5cGUiLCJQSVhJLmxvYWRlcnMuX3NldEF1ZGlvRXh0IiwiUElYSS5EYXRhTWFuYWdlciIsIlBJWEkuRGF0YU1hbmFnZXIuY29uc3RydWN0b3IiLCJQSVhJLkRhdGFNYW5hZ2VyLmxvYWQiLCJQSVhJLkRhdGFNYW5hZ2VyLnNhdmUiLCJQSVhJLkRhdGFNYW5hZ2VyLnJlc2V0IiwiUElYSS5EYXRhTWFuYWdlci5zZXQiLCJQSVhJLkRhdGFNYW5hZ2VyLmdldCIsIlBJWEkuRGF0YU1hbmFnZXIuZGVsIiwiUElYSS5HYW1lIiwiUElYSS5HYW1lLmNvbnN0cnVjdG9yIiwiUElYSS5HYW1lLl9hbmltYXRlIiwiUElYSS5HYW1lLnVwZGF0ZSIsIlBJWEkuR2FtZS5zdGFydCIsIlBJWEkuR2FtZS5zdG9wIiwiUElYSS5HYW1lLmVuYWJsZVN0b3BBdExvc3RGb2N1cyIsIlBJWEkuR2FtZS5kaXNhYmxlU3RvcEF0TG9zdEZvY3VzIiwiUElYSS5HYW1lLl9vblZpc2liaWxpdHlDaGFuZ2UiLCJQSVhJLkdhbWUub25Mb3N0Rm9jdXMiLCJQSVhJLkdhbWUuc2V0U2NlbmUiLCJQSVhJLkdhbWUuZ2V0U2NlbmUiLCJQSVhJLkdhbWUuY3JlYXRlU2NlbmUiLCJQSVhJLkdhbWUucmVtb3ZlU2NlbmUiLCJQSVhJLkdhbWUuYWRkU2NlbmUiLCJQSVhJLkdhbWUucmVtb3ZlQWxsU2NlbmVzIiwiUElYSS5HYW1lLnJlc2l6ZSIsIlBJWEkuR2FtZS5hdXRvUmVzaXplIiwiUElYSS5HYW1lLl9yZXNpemVNb2RlQXNwZWN0Rml0IiwiUElYSS5HYW1lLl9yZXNpemVNb2RlQXNwZWN0RmlsbCIsIlBJWEkuR2FtZS5fcmVzaXplTW9kZUZpbGwiLCJQSVhJLkdhbWUud2lkdGgiLCJQSVhJLkdhbWUuaGVpZ2h0IiwiUElYSS5BdWRpb01hbmFnZXIiLCJQSVhJLkF1ZGlvTWFuYWdlci5jb25zdHJ1Y3RvciIsIlBJWEkuQXVkaW9NYW5hZ2VyLmdldEF1ZGlvIiwiUElYSS5BdWRpb01hbmFnZXIucGF1c2VBbGxMaW5lcyIsIlBJWEkuQXVkaW9NYW5hZ2VyLnJlc3VtZUFsbExpbmVzIiwiUElYSS5BdWRpb01hbmFnZXIucGxheSIsIlBJWEkuQXVkaW9NYW5hZ2VyLnBsYXlNdXNpYyIsIlBJWEkuQXVkaW9NYW5hZ2VyLnBsYXlTb3VuZCIsIlBJWEkuQXVkaW9NYW5hZ2VyLnN0b3AiLCJQSVhJLkF1ZGlvTWFuYWdlci5zdG9wTXVzaWMiLCJQSVhJLkF1ZGlvTWFuYWdlci5zdG9wU291bmQiLCJQSVhJLkF1ZGlvTWFuYWdlci5wYXVzZSIsIlBJWEkuQXVkaW9NYW5hZ2VyLnBhdXNlTXVzaWMiLCJQSVhJLkF1ZGlvTWFuYWdlci5wYXVzZVNvdW5kIiwiUElYSS5BdWRpb01hbmFnZXIucmVzdW1lIiwiUElYSS5BdWRpb01hbmFnZXIucmVzdW1lTXVzaWMiLCJQSVhJLkF1ZGlvTWFuYWdlci5yZXN1bWVTb3VuZCIsIlBJWEkuQXVkaW9NYW5hZ2VyLm11dGUiLCJQSVhJLkF1ZGlvTWFuYWdlci5tdXRlTXVzaWMiLCJQSVhJLkF1ZGlvTWFuYWdlci5tdXRlU291bmQiLCJQSVhJLkF1ZGlvTWFuYWdlci51bm11dGUiLCJQSVhJLkF1ZGlvTWFuYWdlci51bm11dGVNdXNpYyIsIlBJWEkuQXVkaW9NYW5hZ2VyLnVubXV0ZVNvdW5kIiwiUElYSS5BdWRpb01hbmFnZXIuX3BhdXNlIiwiUElYSS5BdWRpb01hbmFnZXIuX3Jlc3VtZSIsIlBJWEkuQXVkaW9NYW5hZ2VyLl9wbGF5IiwiUElYSS5BdWRpb01hbmFnZXIuX3N0b3AiLCJQSVhJLkF1ZGlvTWFuYWdlci5fbXV0ZSIsIlBJWEkuQXVkaW9NYW5hZ2VyLl91bm11dGUiLCJQSVhJLkF1ZGlvTWFuYWdlci5fZ2V0TGluZXNCeUlkIiwiUElYSS5BdWRpb01hbmFnZXIuX2dldEF2YWlsYWJsZUxpbmVGcm9tIiwiUElYSS5BdWRpb01hbmFnZXIuY3JlYXRlR2Fpbk5vZGUiLCJQSVhJLkF1ZGlvIiwiUElYSS5BdWRpby5jb25zdHJ1Y3RvciIsIlBJWEkuQXVkaW8ucGxheSIsIlBJWEkuQXVkaW8uc3RvcCIsIlBJWEkuQXVkaW8ubXV0ZSIsIlBJWEkuQXVkaW8udW5tdXRlIiwiUElYSS5BdWRpby5wYXVzZSIsIlBJWEkuQXVkaW8ucmVzdW1lIiwiUElYSS5BdWRpby52b2x1bWUiLCJQSVhJLlBvb2wiLCJQSVhJLlBvb2wuY29uc3RydWN0b3IiLCJQSVhJLlBvb2wuX25ld09iamVjdCIsIlBJWEkuUG9vbC5fbmV3T2JqZWN0LnJldHVyblRvUG9vbCIsIlBJWEkuUG9vbC5wdXQiLCJQSVhJLlBvb2wuZ2V0IiwiUElYSS5Qb29sLmxlbmd0aCIsIl9uZXdPYmoiLCJQSVhJLl9uZXdPYmoiLCJ6RGlydHkiLCJzb3J0Q2hpbGRyZW5CeVpJbmRleCIsInBvc2l0aW9uIiwieCIsInZlbG9jaXR5IiwiZGVsdGFUaW1lIiwieSIsInJvdGF0aW9uIiwicm90YXRpb25TcGVlZCIsImkiLCJjaGlsZHJlbiIsInVwZGF0ZSIsIl9hZGRDaGlsZCIsImNhbGwiLCJjaGlsZCIsInpJbmRleEVuYWJsZWQiLCJwYXJlbnQiLCJhZGRDaGlsZCIsIkNvbnRhaW5lciIsIl9raWxsZWRPYmplY3RzIiwicHVzaCIsInJlbW92ZUNoaWxkIiwic29ydCIsImFaIiwiekluZGV4IiwiYloiLCJUd2VlbiIsIl96SW5kZXgiLCJ2YWx1ZSIsInBhdGgiLCJwYXJzZVBvaW50cyIsImRyYXdTaGFwZSIsInBvbHlnb24iXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0lDTEEsSUFBRyxDQUFDQSxJQUFKLEVBQVM7QUFBQSxRQUNMLE1BQU0sSUFBSUMsS0FBSixDQUFVLHdCQUFWLENBQU4sQ0FESztBQUFBO0lBSVQsSUFBTUMscUJBQUEsR0FBd0IsT0FBOUI7SUFDQSxJQUFNQyxZQUFBLEdBQWVILElBQUEs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QUFUQSxFQUF5QkE7QUFBQUEsWUFDdEQsT0FBTyxJQUFQLENBRHNEQTtBQUFBQSxTQUExREEsQ0FOUTtBQUFBLEtBQVosQ0FBT0EsSUFBQSxJQUFBLENBQUFBLElBQUEsR0FBSSxFQUFKLENBQVA7SUNBQTtBQUFBO0FBQUEsUUFBT0EsSUFBUDtJQUFBLENBQUEsVUFBT0EsSUFBUCxFQUFZO0FBQUEsUUFDUkEsSUFBQUEsQ0FBQUEsUUFBQUEsQ0FBU0EsU0FBVEEsQ0FBbUJBLFFBQW5CQSxHQUE4QkEsVUFBU0EsSUFBVEEsRUFBa0JBO0FBQUFBLFlBQzVDK1UsSUFBQSxDQUFLQyxXQUFMLEdBRDRDaFY7QUFBQUEsWUFFNUMsS0FBS2lWLFNBQUwsQ0FBZUYsSUFBQSxDQUFLRyxPQUFwQixFQUY0Q2xWO0FBQUFBLFlBRzVDLE9BQU8sSUFBUCxDQUg0Q0E7QUFBQUEsU0FBaERBLENBRFE7QUFBQSxLQUFaLENBQU9BLElBQUEsSUFBQSxDQUFBQSxJQUFBLEdBQUksRUFBSixDQUFQIiwiZmlsZSI6InR1cmJvcGl4aS5qcyIsInNvdXJjZXNDb250ZW50IjpbbnVsbCwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vZGVmcy9waXhpLmpzLmQudHNcIiAvPlxuaWYoIVBJWEkpe1xuICAgIHRocm93IG5ldyBFcnJvcignRXkhIFdoZXJlIGlzIHBpeGkuanM/PycpO1xufVxuXG5jb25zdCBQSVhJX1ZFUlNJT05fUkVRVUlSRUQgPSBcIjMuMC43XCI7XG5jb25zdCBQSVhJX1ZFUlNJT04gPSBQSVhJLlZFUlNJT04ubWF0Y2goL1xcZC5cXGQuXFxkLylbMF07XG5cbmlmKFBJWElfVkVSU0lPTiA8IFBJWElfVkVSU0lPTl9SRVFVSVJFRCl7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiUGl4aS5qcyB2XCIgKyBQSVhJLlZFUlNJT04gKyBcIiBpdCdzIG5vdCBzdXBwb3J0ZWQsIHBsZWFzZSB1c2UgXlwiICsgUElYSV9WRVJTSU9OX1JFUVVJUkVEKTtcbn1cbiIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4vQXVkaW9NYW5hZ2VyLnRzXCIgLz5cbnZhciBIVE1MQXVkaW8gPSBBdWRpbztcbm1vZHVsZSBQSVhJIHtcbiAgICBleHBvcnQgY2xhc3MgQXVkaW9MaW5lIHtcbiAgICAgICAgYXZhaWxhYmxlOmJvb2xlYW4gPSB0cnVlO1xuICAgICAgICBhdWRpbzpBdWRpbztcbiAgICAgICAgbG9vcDpib29sZWFuID0gZmFsc2U7XG4gICAgICAgIHBhdXNlZDpib29sZWFuID0gZmFsc2U7XG4gICAgICAgIGNhbGxiYWNrOkZ1bmN0aW9uO1xuICAgICAgICBtdXRlZDpib29sZWFuID0gZmFsc2U7XG5cbiAgICAgICAgc3RhcnRUaW1lOm51bWJlciA9IDA7XG4gICAgICAgIGxhc3RQYXVzZVRpbWU6bnVtYmVyID0gMDtcbiAgICAgICAgb2Zmc2V0VGltZTpudW1iZXIgPSAwO1xuXG4gICAgICAgIHByaXZhdGUgX2h0bWxBdWRpbzpIVE1MQXVkaW9FbGVtZW50O1xuICAgICAgICBwcml2YXRlIF93ZWJBdWRpbzpBdWRpb0J1ZmZlclNvdXJjZU5vZGU7XG5cbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG1hbmFnZXI6QXVkaW9NYW5hZ2VyKXtcbiAgICAgICAgICAgIGlmKCF0aGlzLm1hbmFnZXIuY29udGV4dCl7XG4gICAgICAgICAgICAgICAgdGhpcy5faHRtbEF1ZGlvID0gbmV3IEhUTUxBdWRpbygpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2h0bWxBdWRpby5hZGRFdmVudExpc3RlbmVyKCdlbmRlZCcsIHRoaXMuX29uRW5kLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc2V0QXVkaW8oYXVkaW86QXVkaW8sIGxvb3A6Ym9vbGVhbnxGdW5jdGlvbiwgY2FsbGJhY2s/OkZ1bmN0aW9uKTpBdWRpb0xpbmV7XG4gICAgICAgICAgICBpZih0eXBlb2YgbG9vcCA9PT0gXCJmdW5jdGlvblwiKXtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayA9IDxGdW5jdGlvbj5sb29wO1xuICAgICAgICAgICAgICAgIGxvb3AgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5hdWRpbyA9IGF1ZGlvO1xuICAgICAgICAgICAgdGhpcy5hdmFpbGFibGUgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMubG9vcCA9IDxib29sZWFuPmxvb3A7XG4gICAgICAgICAgICB0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHBsYXkocGF1c2U/OmJvb2xlYW4pOkF1ZGlvTGluZSB7XG4gICAgICAgICAgICBpZighcGF1c2UgJiYgdGhpcy5wYXVzZWQpcmV0dXJuIHRoaXM7XG5cbiAgICAgICAgICAgIGlmKHRoaXMubWFuYWdlci5jb250ZXh0KXtcbiAgICAgICAgICAgICAgICB0aGlzLl93ZWJBdWRpbyA9IHRoaXMubWFuYWdlci5jb250ZXh0LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3dlYkF1ZGlvLnN0YXJ0ID0gdGhpcy5fd2ViQXVkaW8uc3RhcnQgfHwgdGhpcy5fd2ViQXVkaW8ubm90ZU9uO1xuICAgICAgICAgICAgICAgIHRoaXMuX3dlYkF1ZGlvLnN0b3AgPSB0aGlzLl93ZWJBdWRpby5zdG9wIHx8IHRoaXMuX3dlYkF1ZGlvLm5vdGVPZmY7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl93ZWJBdWRpby5idWZmZXIgPSB0aGlzLmF1ZGlvLnNvdXJjZTtcbiAgICAgICAgICAgICAgICB0aGlzLl93ZWJBdWRpby5sb29wID0gdGhpcy5sb29wIHx8IHRoaXMuYXVkaW8ubG9vcDtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0VGltZSA9IHRoaXMubWFuYWdlci5jb250ZXh0LmN1cnJlbnRUaW1lO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fd2ViQXVkaW8ub25lbmRlZCA9IHRoaXMuX29uRW5kLmJpbmQodGhpcyk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl93ZWJBdWRpby5nYWluTm9kZSA9IHRoaXMubWFuYWdlci5jcmVhdGVHYWluTm9kZSh0aGlzLm1hbmFnZXIuY29udGV4dCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fd2ViQXVkaW8uZ2Fpbk5vZGUuZ2Fpbi52YWx1ZSA9ICh0aGlzLmF1ZGlvLm11dGVkIHx8IHRoaXMubXV0ZWQpID8gMCA6IHRoaXMuYXVkaW8udm9sdW1lO1xuICAgICAgICAgICAgICAgIHRoaXMuX3dlYkF1ZGlvLmdhaW5Ob2RlLmNvbm5lY3QodGhpcy5tYW5hZ2VyLmdhaW5Ob2RlKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuX3dlYkF1ZGlvLmNvbm5lY3QodGhpcy5fd2ViQXVkaW8uZ2Fpbk5vZGUpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3dlYkF1ZGlvLnN0YXJ0KDAsIChwYXVzZSkgPyB0aGlzLmxhc3RQYXVzZVRpbWUgOiBudWxsKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHRoaXMuX2h0bWxBdWRpby5zcmMgPSAodGhpcy5hdWRpby5zb3VyY2Uuc3JjICE9PSBcIlwiKSA/IHRoaXMuYXVkaW8uc291cmNlLnNyYyA6IHRoaXMuYXVkaW8uc291cmNlLmNoaWxkcmVuWzBdLnNyYztcbiAgICAgICAgICAgICAgICB0aGlzLl9odG1sQXVkaW8ucHJlbG9hZCA9IFwiYXV0b1wiO1xuICAgICAgICAgICAgICAgIHRoaXMuX2h0bWxBdWRpby52b2x1bWUgPSAodGhpcy5hdWRpby5tdXRlZCB8fCB0aGlzLm11dGVkKSA/IDAgOiB0aGlzLmF1ZGlvLnZvbHVtZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9odG1sQXVkaW8ubG9hZCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2h0bWxBdWRpby5wbGF5KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RvcCgpOkF1ZGlvTGluZSB7XG4gICAgICAgICAgICBpZih0aGlzLm1hbmFnZXIuY29udGV4dCl7XG4gICAgICAgICAgICAgICAgdGhpcy5fd2ViQXVkaW8uc3RvcCgwKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHRoaXMuX2h0bWxBdWRpby5wYXVzZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2h0bWxBdWRpby5jdXJyZW50VGltZSA9IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcGF1c2UoKTpBdWRpb0xpbmV7XG4gICAgICAgICAgICBpZih0aGlzLm1hbmFnZXIuY29udGV4dCl7XG4gICAgICAgICAgICAgICAgdGhpcy5vZmZzZXRUaW1lICs9IHRoaXMubWFuYWdlci5jb250ZXh0LmN1cnJlbnRUaW1lIC0gdGhpcy5zdGFydFRpbWU7XG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0UGF1c2VUaW1lID0gdGhpcy5vZmZzZXRUaW1lJXRoaXMuX3dlYkF1ZGlvLmJ1ZmZlci5kdXJhdGlvbjtcbiAgICAgICAgICAgICAgICB0aGlzLl93ZWJBdWRpby5zdG9wKDApO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgdGhpcy5faHRtbEF1ZGlvLnBhdXNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnBhdXNlZCA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc3VtZSgpOkF1ZGlvTGluZXtcbiAgICAgICAgICAgIGlmKHRoaXMucGF1c2VkKXtcbiAgICAgICAgICAgICAgICBpZih0aGlzLm1hbmFnZXIuY29udGV4dCl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGxheSh0cnVlKTtcbiAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faHRtbEF1ZGlvLnBsYXkoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLnBhdXNlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBtdXRlKCk6QXVkaW9MaW5le1xuICAgICAgICAgICAgdGhpcy5tdXRlZCA9IHRydWU7XG4gICAgICAgICAgICBpZih0aGlzLm1hbmFnZXIuY29udGV4dCl7XG4gICAgICAgICAgICAgICAgdGhpcy5fd2ViQXVkaW8uZ2Fpbk5vZGUuZ2Fpbi52YWx1ZSA9IDA7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICB0aGlzLl9odG1sQXVkaW8udm9sdW1lID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgdW5tdXRlKCk6QXVkaW9MaW5le1xuICAgICAgICAgICAgdGhpcy5tdXRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgaWYodGhpcy5tYW5hZ2VyLmNvbnRleHQpe1xuICAgICAgICAgICAgICAgIHRoaXMuX3dlYkF1ZGlvLmdhaW5Ob2RlLmdhaW4udmFsdWUgPSB0aGlzLmF1ZGlvLnZvbHVtZTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHRoaXMuX2h0bWxBdWRpby52b2x1bWUgPSB0aGlzLmF1ZGlvLnZvbHVtZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgdm9sdW1lKHZhbHVlOm51bWJlcik6QXVkaW9MaW5le1xuICAgICAgICAgICAgaWYodGhpcy5tYW5hZ2VyLmNvbnRleHQpe1xuICAgICAgICAgICAgICAgIHRoaXMuX3dlYkF1ZGlvLmdhaW5Ob2RlLmdhaW4udmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHRoaXMuX2h0bWxBdWRpby52b2x1bWUgPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzZXQoKTpBdWRpb0xpbmV7XG4gICAgICAgICAgICB0aGlzLmF2YWlsYWJsZSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmF1ZGlvID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMubG9vcCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5jYWxsYmFjayA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLnBhdXNlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5tdXRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5fd2ViQXVkaW8gPSBudWxsO1xuXG4gICAgICAgICAgICB0aGlzLnN0YXJ0VGltZSA9IDA7XG4gICAgICAgICAgICB0aGlzLmxhc3RQYXVzZVRpbWUgPSAwO1xuICAgICAgICAgICAgdGhpcy5vZmZzZXRUaW1lID0gMDtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfb25FbmQoKTp2b2lke1xuICAgICAgICAgICAgaWYodGhpcy5jYWxsYmFjayl0aGlzLmNhbGxiYWNrKHRoaXMubWFuYWdlciwgdGhpcy5hdWRpbyk7XG4gICAgICAgICAgICBpZighdGhpcy5tYW5hZ2VyLmNvbnRleHQpe1xuICAgICAgICAgICAgICAgIGlmKHRoaXMubG9vcCB8fCB0aGlzLmF1ZGlvLmxvb3Ape1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9odG1sQXVkaW8uY3VycmVudFRpbWUgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9odG1sQXVkaW8ucGxheSgpO1xuICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfWVsc2UgaWYodGhpcy5tYW5hZ2VyLmNvbnRleHQgJiYgIXRoaXMucGF1c2VkKXtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbn1cblxuaW50ZXJmYWNlIEF1ZGlvQnVmZmVyU291cmNlTm9kZSB7XG4gICAgbm90ZU9uKCk6QXVkaW9CdWZmZXJTb3VyY2VOb2RlO1xuICAgIG5vdGVPZmYoKTpBdWRpb0J1ZmZlclNvdXJjZU5vZGU7XG4gICAgc291cmNlOkF1ZGlvQnVmZmVyO1xuICAgIGdhaW5Ob2RlOkdhaW5Ob2RlO1xufSIsIm1vZHVsZSBQSVhJIHtcbiAgICBleHBvcnQgZW51bSBHQU1FX1NDQUxFX1RZUEUge1xuICAgICAgICBOT05FLFxuICAgICAgICBGSUxMLFxuICAgICAgICBBU1BFQ1RfRklULFxuICAgICAgICBBU1BFQ1RfRklMTFxuICAgIH1cblxuICAgIGV4cG9ydCBlbnVtIEFVRElPX1RZUEUge1xuICAgICAgICBVTktOT1dOLFxuICAgICAgICBXRUJBVURJTyxcbiAgICAgICAgSFRNTEFVRElPXG4gICAgfVxuXG4gICAgZXhwb3J0IHZhciB6SW5kZXhFbmFibGVkOmJvb2xlYW4gPSB0cnVlO1xufSIsIi8vTWFueSBjaGVja3MgYXJlIGJhc2VkIG9uIGh0dHBzOi8vZ2l0aHViLmNvbS9hcmFzYXRhc2F5Z2luL2lzLmpzL2Jsb2IvbWFzdGVyL2lzLmpzXG5cbm1vZHVsZSBQSVhJIHtcbiAgICBleHBvcnQgbW9kdWxlIERldmljZSB7XG4gICAgICAgIHZhciBuYXZpZ2F0b3I6TmF2aWdhdG9yID0gd2luZG93Lm5hdmlnYXRvcjtcbiAgICAgICAgdmFyIGRvY3VtZW50OkRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xuXG4gICAgICAgIHZhciB1c2VyQWdlbnQ6c3RyaW5nID0gJ25hdmlnYXRvcicgaW4gd2luZG93ICYmICd1c2VyQWdlbnQnIGluIG5hdmlnYXRvciAmJiBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkgfHwgJycsXG4gICAgICAgICAgICB2ZW5kb3I6c3RyaW5nID0gJ25hdmlnYXRvcicgaW4gd2luZG93ICYmICd2ZW5kb3InIGluIG5hdmlnYXRvciAmJiBuYXZpZ2F0b3IudmVuZG9yLnRvTG93ZXJDYXNlKCkgfHwgJycsXG4gICAgICAgICAgICBhcHBWZXJzaW9uOnN0cmluZyA9ICduYXZpZ2F0b3InIGluIHdpbmRvdyAmJiAnYXBwVmVyc2lvbicgaW4gbmF2aWdhdG9yICYmIG5hdmlnYXRvci5hcHBWZXJzaW9uLnRvTG93ZXJDYXNlKCkgfHwgJyc7XG5cbiAgICAgICAgLy9Ccm93c2Vyc1xuICAgICAgICBleHBvcnQgdmFyIGlzQ2hyb21lOmJvb2xlYW4gPSAvY2hyb21lfGNocm9taXVtL2kudGVzdCh1c2VyQWdlbnQpICYmIC9nb29nbGUgaW5jLy50ZXN0KHZlbmRvciksXG4gICAgICAgICAgICBpc0ZpcmVmb3g6Ym9vbGVhbiA9IC9maXJlZm94L2kudGVzdCh1c2VyQWdlbnQpLFxuICAgICAgICAgICAgaXNJRTpib29sZWFuID0gL21zaWUvaS50ZXN0KHVzZXJBZ2VudCkgfHwgXCJBY3RpdmVYT2JqZWN0XCIgaW4gd2luZG93LFxuICAgICAgICAgICAgaXNPcGVyYTpib29sZWFuID0gL15PcGVyYVxcLy8udGVzdCh1c2VyQWdlbnQpIHx8IC9cXHgyME9QUlxcLy8udGVzdCh1c2VyQWdlbnQpLFxuICAgICAgICAgICAgaXNTYWZhcmk6Ym9vbGVhbiA9IC9zYWZhcmkvaS50ZXN0KHVzZXJBZ2VudCkgJiYgL2FwcGxlIGNvbXB1dGVyL2kudGVzdCh2ZW5kb3IpO1xuXG4gICAgICAgIC8vRGV2aWNlcyAmJiBPU1xuICAgICAgICBleHBvcnQgdmFyIGlzSXBob25lOmJvb2xlYW4gPSAvaXBob25lL2kudGVzdCh1c2VyQWdlbnQpLFxuICAgICAgICAgICAgaXNJcGFkOmJvb2xlYW4gPSAvaXBhZC9pLnRlc3QodXNlckFnZW50KSxcbiAgICAgICAgICAgIGlzSXBvZDpib29sZWFuID0gL2lwb2QvaS50ZXN0KHVzZXJBZ2VudCksXG4gICAgICAgICAgICBpc0FuZHJvaWQ6Ym9vbGVhbiA9IC9hbmRyb2lkL2kudGVzdCh1c2VyQWdlbnQpLFxuICAgICAgICAgICAgaXNBbmRyb2lkUGhvbmU6Ym9vbGVhbiA9IC9hbmRyb2lkL2kudGVzdCh1c2VyQWdlbnQpICYmIC9tb2JpbGUvaS50ZXN0KHVzZXJBZ2VudCksXG4gICAgICAgICAgICBpc0FuZHJvaWRUYWJsZXQ6Ym9vbGVhbiA9IC9hbmRyb2lkL2kudGVzdCh1c2VyQWdlbnQpICYmICEvbW9iaWxlL2kudGVzdCh1c2VyQWdlbnQpLFxuICAgICAgICAgICAgaXNMaW51eDpib29sZWFuID0gL2xpbnV4L2kudGVzdChhcHBWZXJzaW9uKSxcbiAgICAgICAgICAgIGlzTWFjOmJvb2xlYW4gPSAvbWFjL2kudGVzdChhcHBWZXJzaW9uKSxcbiAgICAgICAgICAgIGlzV2luZG93OmJvb2xlYW4gPSAvd2luL2kudGVzdChhcHBWZXJzaW9uKSxcbiAgICAgICAgICAgIGlzV2luZG93UGhvbmU6Ym9vbGVhbiA9IGlzV2luZG93ICYmIC9waG9uZS9pLnRlc3QodXNlckFnZW50KSxcbiAgICAgICAgICAgIGlzV2luZG93VGFibGV0OmJvb2xlYW4gPSBpc1dpbmRvdyAmJiAhaXNXaW5kb3dQaG9uZSAmJiAvdG91Y2gvaS50ZXN0KHVzZXJBZ2VudCksXG4gICAgICAgICAgICBpc01vYmlsZTpib29sZWFuID0gaXNJcGhvbmUgfHwgaXNJcG9kfHwgaXNBbmRyb2lkUGhvbmUgfHwgaXNXaW5kb3dQaG9uZSxcbiAgICAgICAgICAgIGlzVGFibGV0OmJvb2xlYW4gPSBpc0lwYWQgfHwgaXNBbmRyb2lkVGFibGV0IHx8IGlzV2luZG93VGFibGV0LFxuICAgICAgICAgICAgaXNEZXNrdG9wOmJvb2xlYW4gPSAhaXNNb2JpbGUgJiYgIWlzVGFibGV0LFxuICAgICAgICAgICAgaXNUb3VjaERldmljZTpib29sZWFuID0gJ29udG91Y2hzdGFydCcgaW4gd2luZG93IHx8J0RvY3VtZW50VG91Y2gnIGluIHdpbmRvdyAmJiBkb2N1bWVudCBpbnN0YW5jZW9mIERvY3VtZW50VG91Y2gsXG4gICAgICAgICAgICBpc0NvY29vbjpib29sZWFuID0gISFuYXZpZ2F0b3IuaXNDb2Nvb25KUyxcbiAgICAgICAgICAgIGlzTm9kZVdlYmtpdDpib29sZWFuID0gISEodHlwZW9mIHByb2Nlc3MgPT09IFwib2JqZWN0XCIgJiYgcHJvY2Vzcy50aXRsZSA9PT0gXCJub2RlXCIgJiYgdHlwZW9mIGdsb2JhbCA9PT0gXCJvYmplY3RcIiksXG4gICAgICAgICAgICBpc0VqZWN0YTpib29sZWFuID0gISF3aW5kb3cuZWplY3RhLFxuICAgICAgICAgICAgaXNDcm9zc3dhbGs6Ym9vbGVhbiA9IC9Dcm9zc3dhbGsvLnRlc3QodXNlckFnZW50KSxcbiAgICAgICAgICAgIGlzQ29yZG92YTpib29sZWFuID0gISF3aW5kb3cuY29yZG92YSxcbiAgICAgICAgICAgIGlzRWxlY3Ryb246Ym9vbGVhbiA9ICEhKHR5cGVvZiBwcm9jZXNzID09PSBcIm9iamVjdFwiICYmIHByb2Nlc3MudmVyc2lvbnMgJiYgKHByb2Nlc3MudmVyc2lvbnMuZWxlY3Ryb24gfHwgcHJvY2Vzcy52ZXJzaW9uc1snYXRvbS1zaGVsbCddKSk7XG5cbiAgICAgICAgbmF2aWdhdG9yLnZpYnJhdGUgPSBuYXZpZ2F0b3IudmlicmF0ZSB8fCBuYXZpZ2F0b3Iud2Via2l0VmlicmF0ZSB8fCBuYXZpZ2F0b3IubW96VmlicmF0ZSB8fCBuYXZpZ2F0b3IubXNWaWJyYXRlIHx8IG51bGw7XG4gICAgICAgIGV4cG9ydCB2YXIgaXNWaWJyYXRlU3VwcG9ydGVkOmJvb2xlYW4gPSAhIW5hdmlnYXRvci52aWJyYXRlICYmIChpc01vYmlsZSB8fCBpc1RhYmxldCksXG4gICAgICAgICAgICBpc01vdXNlV2hlZWxTdXBwb3J0ZWQ6Ym9vbGVhbiA9ICdvbndoZWVsJyBpbiB3aW5kb3cgfHwgJ29ubW91c2V3aGVlbCcgaW4gd2luZG93IHx8ICdNb3VzZVNjcm9sbEV2ZW50JyBpbiB3aW5kb3csXG4gICAgICAgICAgICBpc0FjY2VsZXJvbWV0ZXJTdXBwb3J0ZWQ6Ym9vbGVhbiA9ICdEZXZpY2VNb3Rpb25FdmVudCcgaW4gd2luZG93LFxuICAgICAgICAgICAgaXNHYW1lcGFkU3VwcG9ydGVkOmJvb2xlYW4gPSAhIW5hdmlnYXRvci5nZXRHYW1lcGFkcyB8fCAhIW5hdmlnYXRvci53ZWJraXRHZXRHYW1lcGFkcztcblxuICAgICAgICAvL0Z1bGxTY3JlZW5cbiAgICAgICAgdmFyIGRpdjpIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB2YXIgZnVsbFNjcmVlblJlcXVlc3RWZW5kb3I6YW55ID0gZGl2LnJlcXVlc3RGdWxsc2NyZWVuIHx8IGRpdi53ZWJraXRSZXF1ZXN0RnVsbFNjcmVlbiB8fCBkaXYubXNSZXF1ZXN0RnVsbFNjcmVlbiB8fCBkaXYubW96UmVxdWVzdEZ1bGxTY3JlZW4sXG4gICAgICAgICAgICBmdWxsU2NyZWVuQ2FuY2VsVmVuZG9yOmFueSA9IGRvY3VtZW50LmNhbmNlbEZ1bGxTY3JlZW4gfHwgZG9jdW1lbnQuZXhpdEZ1bGxTY3JlZW4gfHwgZG9jdW1lbnQud2Via2l0Q2FuY2VsRnVsbFNjcmVlbiB8fCBkb2N1bWVudC5tc0NhbmNlbEZ1bGxTY3JlZW4gfHwgZG9jdW1lbnQubW96Q2FuY2VsRnVsbFNjcmVlbjtcblxuICAgICAgICBleHBvcnQgdmFyIGlzRnVsbFNjcmVlblN1cHBvcnRlZDpib29sZWFuID0gISEoZnVsbFNjcmVlblJlcXVlc3QgJiYgZnVsbFNjcmVlbkNhbmNlbCksXG4gICAgICAgICAgICBmdWxsU2NyZWVuUmVxdWVzdDpzdHJpbmcgPSAoZnVsbFNjcmVlblJlcXVlc3RWZW5kb3IpID8gZnVsbFNjcmVlblJlcXVlc3RWZW5kb3IubmFtZSA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGZ1bGxTY3JlZW5DYW5jZWw6c3RyaW5nID0gKGZ1bGxTY3JlZW5DYW5jZWxWZW5kb3IpID8gZnVsbFNjcmVlbkNhbmNlbFZlbmRvci5uYW1lIDogdW5kZWZpbmVkO1xuXG4gICAgICAgIC8vQXVkaW9cbiAgICAgICAgZXhwb3J0IHZhciBpc0hUTUxBdWRpb1N1cHBvcnRlZDpib29sZWFuID0gISF3aW5kb3cuQXVkaW8sXG4gICAgICAgICAgICB3ZWJBdWRpb0NvbnRleHQ6YW55ID0gd2luZG93LkF1ZGlvQ29udGV4dCB8fCB3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0LFxuICAgICAgICAgICAgaXNXZWJBdWRpb1N1cHBvcnRlZDpib29sZWFuID0gISF3ZWJBdWRpb0NvbnRleHQsXG4gICAgICAgICAgICBpc0F1ZGlvU3VwcG9ydGVkOmJvb2xlYW4gPSBpc1dlYkF1ZGlvU3VwcG9ydGVkIHx8IGlzSFRNTEF1ZGlvU3VwcG9ydGVkLFxuICAgICAgICAgICAgaXNNcDNTdXBwb3J0ZWQ6Ym9vbGVhbiA9IGZhbHNlLFxuICAgICAgICAgICAgaXNPZ2dTdXBwb3J0ZWQ6Ym9vbGVhbiA9IGZhbHNlLFxuICAgICAgICAgICAgaXNXYXZTdXBwb3J0ZWQ6Ym9vbGVhbiA9IGZhbHNlLFxuICAgICAgICAgICAgaXNNNGFTdXBwb3J0ZWQ6Ym9vbGVhbiA9IGZhbHNlLFxuICAgICAgICAgICAgZ2xvYmFsV2ViQXVkaW9Db250ZXh0OkF1ZGlvQ29udGV4dCA9IChpc1dlYkF1ZGlvU3VwcG9ydGVkKSA/IG5ldyB3ZWJBdWRpb0NvbnRleHQoKSA6IHVuZGVmaW5lZDtcblxuICAgICAgICAvL0F1ZGlvIG1pbWVUeXBlc1xuICAgICAgICBpZihpc0F1ZGlvU3VwcG9ydGVkKXtcbiAgICAgICAgICAgIHZhciBhdWRpbzpIVE1MQXVkaW9FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYXVkaW8nKTtcbiAgICAgICAgICAgIGlzTXAzU3VwcG9ydGVkID0gYXVkaW8uY2FuUGxheVR5cGUoJ2F1ZGlvL21wZWc7JykgIT09IFwiXCI7XG4gICAgICAgICAgICBpc09nZ1N1cHBvcnRlZCA9IGF1ZGlvLmNhblBsYXlUeXBlKCdhdWRpby9vZ2c7IGNvZGVjcz1cInZvcmJpc1wiJykgIT09IFwiXCI7XG4gICAgICAgICAgICBpc1dhdlN1cHBvcnRlZCA9IGF1ZGlvLmNhblBsYXlUeXBlKCdhdWRpby93YXYnKSAhPT0gXCJcIjtcbiAgICAgICAgICAgIGlzTTRhU3VwcG9ydGVkID0gYXVkaW8uY2FuUGxheVR5cGUoJ2F1ZGlvL21wNDsgY29kZWNzPVwibXA0YS40MC41XCInKSAhPT0gXCJcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBnZXRNb3VzZVdoZWVsRXZlbnQoKTpzdHJpbmd7XG4gICAgICAgICAgICBpZighaXNNb3VzZVdoZWVsU3VwcG9ydGVkKXJldHVybjtcbiAgICAgICAgICAgIHZhciBldnQ6c3RyaW5nO1xuICAgICAgICAgICAgaWYoJ29ud2hlZWwnIGluIHdpbmRvdyl7XG4gICAgICAgICAgICAgICAgZXZ0ID0gJ3doZWVsJztcbiAgICAgICAgICAgIH1lbHNlIGlmKCdvbm1vdXNld2hlZWwnIGluIHdpbmRvdyl7XG4gICAgICAgICAgICAgICAgZXZ0ID0gJ21vdXNld2hlZWwnO1xuICAgICAgICAgICAgfWVsc2UgaWYoJ01vdXNlU2Nyb2xsRXZlbnQnIGluIHdpbmRvdyl7XG4gICAgICAgICAgICAgICAgZXZ0ID0gJ0RPTU1vdXNlU2Nyb2xsJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGV2dDtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiB2aWJyYXRlKHBhdHRlcm46IG51bWJlciB8IG51bWJlcltdKTp2b2lke1xuICAgICAgICAgICAgaWYoaXNWaWJyYXRlU3VwcG9ydGVkKXtcbiAgICAgICAgICAgICAgICBuYXZpZ2F0b3IudmlicmF0ZShwYXR0ZXJuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBnZXRWaXNpYmlsaXR5Q2hhbmdlRXZlbnQoKTpzdHJpbmd7XG4gICAgICAgICAgICBpZih0eXBlb2YgZG9jdW1lbnQuaGlkZGVuICE9PSAndW5kZWZpbmVkJyl7XG4gICAgICAgICAgICAgICAgcmV0dXJuICd2aXNpYmlsaXR5Y2hhbmdlJztcbiAgICAgICAgICAgIH1lbHNlIGlmKHR5cGVvZiBkb2N1bWVudC53ZWJraXRIaWRkZW4gIT09ICd1bmRlZmluZWQnKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ3dlYmtpdHZpc2liaWxpdHljaGFuZ2UnO1xuICAgICAgICAgICAgfWVsc2UgaWYodHlwZW9mIGRvY3VtZW50Lm1vekhpZGRlbiAhPT0gJ3VuZGVmaW5lZCcpe1xuICAgICAgICAgICAgICAgIHJldHVybiAnbW96dmlzaWJpbGl0eWNoYW5nZSc7XG4gICAgICAgICAgICB9ZWxzZSBpZih0eXBlb2YgZG9jdW1lbnQubXNIaWRkZW4gIT09ICd1bmRlZmluZWQnKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ21zdmlzaWJpbGl0eWNoYW5nZSc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gaXNPbmxpbmUoKTpib29sZWFue1xuICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5uYXZpZ2F0b3Iub25MaW5lO1xuICAgICAgICB9XG5cblxuICAgIH1cbn1cblxuZGVjbGFyZSB2YXIgcHJvY2VzczphbnksXG4gICAgRG9jdW1lbnRUb3VjaDphbnksXG4gICAgZ2xvYmFsOmFueTtcblxuaW50ZXJmYWNlIE5hdmlnYXRvciB7XG4gICAgaXNDb2Nvb25KUzphbnk7XG4gICAgdmlicmF0ZShwYXR0ZXJuOiBudW1iZXIgfCBudW1iZXJbXSk6Ym9vbGVhbjtcbiAgICBnZXRHYW1lcGFkcygpOmFueTtcbiAgICB3ZWJraXRHZXRHYW1lcGFkcygpOmFueTtcbiAgICB3ZWJraXRWaWJyYXRlKCk6YW55O1xuICAgIG1velZpYnJhdGUoKTphbnk7XG4gICAgbXNWaWJyYXRlKCk6YW55O1xufVxuXG5pbnRlcmZhY2UgV2luZG93IHtcbiAgICBlamVjdGE6YW55O1xuICAgIGNvcmRvdmE6YW55O1xuICAgIEF1ZGlvKCk6SFRNTEF1ZGlvRWxlbWVudDtcbiAgICBBdWRpb0NvbnRleHQoKTphbnk7XG4gICAgd2Via2l0QXVkaW9Db250ZXh0KCk6YW55O1xufVxuXG5pbnRlcmZhY2UgZnVsbFNjcmVlbkRhdGEge1xuICAgIG5hbWU6c3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgRG9jdW1lbnQge1xuICAgIGNhbmNlbEZ1bGxTY3JlZW4oKTpmdWxsU2NyZWVuRGF0YSA7XG4gICAgZXhpdEZ1bGxTY3JlZW4oKTpmdWxsU2NyZWVuRGF0YSA7XG4gICAgd2Via2l0Q2FuY2VsRnVsbFNjcmVlbigpOmZ1bGxTY3JlZW5EYXRhIDtcbiAgICBtc0NhbmNlbEZ1bGxTY3JlZW4oKTpmdWxsU2NyZWVuRGF0YSA7XG4gICAgbW96Q2FuY2VsRnVsbFNjcmVlbigpOmZ1bGxTY3JlZW5EYXRhIDtcbiAgICB3ZWJraXRIaWRkZW46YW55O1xuICAgIG1vekhpZGRlbjphbnk7XG59XG5cbmludGVyZmFjZSBIVE1MRGl2RWxlbWVudCB7XG4gICAgcmVxdWVzdEZ1bGxzY3JlZW4oKTpmdWxsU2NyZWVuRGF0YSA7XG4gICAgd2Via2l0UmVxdWVzdEZ1bGxTY3JlZW4oKTpmdWxsU2NyZWVuRGF0YSA7XG4gICAgbXNSZXF1ZXN0RnVsbFNjcmVlbigpOmZ1bGxTY3JlZW5EYXRhIDtcbiAgICBtb3pSZXF1ZXN0RnVsbFNjcmVlbigpOmZ1bGxTY3JlZW5EYXRhIDtcbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9kZWZzL3BpeGkuanMuZC50c1wiIC8+XG5tb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IGNsYXNzIENhbWVyYSBleHRlbmRzIENvbnRhaW5lciB7XG4gICAgICAgIHZpc2libGU6Ym9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBfZW5hYmxlZDpib29sZWFuID0gZmFsc2U7XG4gICAgICAgIHpJbmRleDpudW1iZXIgPSBJbmZpbml0eTtcbiAgICAgICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgICAgIHN1cGVyKCk7XG4gICAgICAgIH1cblxuICAgICAgICB1cGRhdGUoZGVsdGFUaW1lOm51bWJlcik6Q2FtZXJhe1xuICAgICAgICAgICAgaWYoIXRoaXMuZW5hYmxlZCl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHN1cGVyLnVwZGF0ZShkZWx0YVRpbWUpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgZW5hYmxlZCgpOmJvb2xlYW57XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZW5hYmxlZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldCBlbmFibGVkKHZhbHVlOmJvb2xlYW4pe1xuICAgICAgICAgICAgdGhpcy5fZW5hYmxlZCA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy52aXNpYmxlID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG59IiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vZGVmcy9waXhpLmpzLmQudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi9UaW1lck1hbmFnZXIudHNcIiAvPlxubW9kdWxlIFBJWEkge1xuICAgIGV4cG9ydCBjbGFzcyBUaW1lciB7XG4gICAgICAgIGFjdGl2ZTpib29sZWFuID0gZmFsc2U7XG4gICAgICAgIGlzRW5kZWQ6Ym9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBpc1N0YXJ0ZWQ6Ym9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBleHBpcmU6Ym9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBkZWxheTpudW1iZXIgPSAwO1xuICAgICAgICByZXBlYXQ6bnVtYmVyID0gMDtcbiAgICAgICAgbG9vcDpib29sZWFuID0gZmFsc2U7XG5cbiAgICAgICAgcHJpdmF0ZSBfZGVsYXlUaW1lOm51bWJlciA9IDA7XG4gICAgICAgIHByaXZhdGUgX2VsYXBzZWRUaW1lOm51bWJlciA9IDA7XG4gICAgICAgIHByaXZhdGUgX3JlcGVhdDpudW1iZXIgPSAwO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB0aW1lOm51bWJlciA9IDEsIHB1YmxpYyBtYW5hZ2VyPzpUaW1lck1hbmFnZXIpe1xuICAgICAgICAgICAgaWYodGhpcy5tYW5hZ2VyKXtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZFRvKHRoaXMubWFuYWdlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB1cGRhdGUoZGVsdGFUaW1lOm51bWJlcik6VGltZXJ7XG4gICAgICAgICAgICBpZighdGhpcy5hY3RpdmUpcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB2YXIgZGVsdGFNUzpudW1iZXIgPSBkZWx0YVRpbWUqMTAwMDtcblxuICAgICAgICAgICAgaWYodGhpcy5kZWxheSA+IHRoaXMuX2RlbGF5VGltZSl7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGVsYXlUaW1lICs9IGRlbHRhTVM7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKCF0aGlzLmlzU3RhcnRlZCl7XG4gICAgICAgICAgICAgICAgdGhpcy5pc1N0YXJ0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuX29uVGltZXJTdGFydCh0aGlzLl9lbGFwc2VkVGltZSwgZGVsdGFUaW1lKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYodGhpcy50aW1lID4gdGhpcy5fZWxhcHNlZFRpbWUpe1xuICAgICAgICAgICAgICAgIHZhciB0Om51bWJlciA9IHRoaXMuX2VsYXBzZWRUaW1lK2RlbHRhTVM7XG4gICAgICAgICAgICAgICAgdmFyIGVuZGVkOmJvb2xlYW4gPSAodD49dGhpcy50aW1lKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuX2VsYXBzZWRUaW1lID0gKGVuZGVkKSA/IHRoaXMudGltZSA6IHQ7XG4gICAgICAgICAgICAgICAgdGhpcy5fb25UaW1lclVwZGF0ZSh0aGlzLl9lbGFwc2VkVGltZSwgZGVsdGFUaW1lKTtcblxuICAgICAgICAgICAgICAgIGlmKGVuZGVkKXtcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5sb29wIHx8IHRoaXMucmVwZWF0ID4gdGhpcy5fcmVwZWF0KXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3JlcGVhdCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fb25UaW1lclJlcGVhdCh0aGlzLl9lbGFwc2VkVGltZSwgZGVsdGFUaW1lLCB0aGlzLl9yZXBlYXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxhcHNlZFRpbWUgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzRW5kZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFjdGl2ZSAgPWZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9vblRpbWVyRW5kKHRoaXMuX2VsYXBzZWRUaW1lLCBkZWx0YVRpbWUpO1xuICAgICAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGFkZFRvKHRpbWVyTWFuYWdlcjpUaW1lck1hbmFnZXIpOlRpbWVyIHtcbiAgICAgICAgICAgIHRpbWVyTWFuYWdlci5hZGRUaW1lcih0aGlzKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVtb3ZlKCk6VGltZXJ7XG4gICAgICAgICAgICBpZighdGhpcy5tYW5hZ2VyKXtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaW1lciB3aXRob3V0IG1hbmFnZXIuXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLm1hbmFnZXIucmVtb3ZlVGltZXIodGhpcyk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXJ0KCk6VGltZXJ7XG4gICAgICAgICAgICB0aGlzLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHN0b3AoKTpUaW1lcntcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLl9vblRpbWVyU3RvcCh0aGlzLl9lbGFwc2VkVGltZSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc2V0KCk6VGltZXJ7XG4gICAgICAgICAgICB0aGlzLl9lbGFwc2VkVGltZSA9IDA7XG4gICAgICAgICAgICB0aGlzLl9yZXBlYXQgPSAwO1xuICAgICAgICAgICAgdGhpcy5fZGVsYXlUaW1lID0gMDtcbiAgICAgICAgICAgIHRoaXMuaXNTdGFydGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmlzRW5kZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgb25TdGFydChjYWxsYmFjazpGdW5jdGlvbik6VGltZXJ7XG4gICAgICAgICAgICB0aGlzLl9vblRpbWVyU3RhcnQgPSA8YW55PmNhbGxiYWNrO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBvbkVuZChjYWxsYmFjazpGdW5jdGlvbik6VGltZXJ7XG4gICAgICAgICAgICB0aGlzLl9vblRpbWVyRW5kID0gPGFueT5jYWxsYmFjaztcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgb25TdG9wKGNhbGxiYWNrOkZ1bmN0aW9uKTpUaW1lcntcbiAgICAgICAgICAgIHRoaXMuX29uVGltZXJTdG9wID0gPGFueT5jYWxsYmFjaztcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgb25VcGRhdGUoY2FsbGJhY2s6RnVuY3Rpb24pOlRpbWVye1xuICAgICAgICAgICAgdGhpcy5fb25UaW1lclVwZGF0ZSA9IDxhbnk+Y2FsbGJhY2s7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIG9uUmVwZWF0KGNhbGxiYWNrOkZ1bmN0aW9uKTpUaW1lcntcbiAgICAgICAgICAgIHRoaXMuX29uVGltZXJSZXBlYXQgPSA8YW55PmNhbGxiYWNrO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9vblRpbWVyU3RhcnQoZWxhcHNlZFRpbWU6bnVtYmVyLCBkZWx0YVRpbWU6bnVtYmVyKTp2b2lke31cbiAgICAgICAgcHJpdmF0ZSBfb25UaW1lclN0b3AoZWxhcHNlZFRpbWU6bnVtYmVyKTp2b2lke31cbiAgICAgICAgcHJpdmF0ZSBfb25UaW1lclJlcGVhdChlbGFwc2VkVGltZTpudW1iZXIsIGRlbHRhVGltZTpudW1iZXIsIHJlcGVhdDpudW1iZXIpOnZvaWR7fVxuICAgICAgICBwcml2YXRlIF9vblRpbWVyVXBkYXRlKGVsYXBzZWRUaW1lOm51bWJlciwgZGVsdGFUaW1lOm51bWJlcik6dm9pZHt9XG4gICAgICAgIHByaXZhdGUgX29uVGltZXJFbmQoZWxhcHNlZFRpbWU6bnVtYmVyLCBkZWx0YVRpbWU6bnVtYmVyKTp2b2lke31cbiAgICB9XG59IiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vZGVmcy9waXhpLmpzLmQudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi9UaW1lci50c1wiIC8+XG5tb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IGNsYXNzIFRpbWVyTWFuYWdlciB7XG4gICAgICAgIHRpbWVyczpUaW1lcltdID0gW107XG4gICAgICAgIF90b0RlbGV0ZTpUaW1lcltdID0gW107XG5cbiAgICAgICAgY29uc3RydWN0b3IoKXt9XG5cbiAgICAgICAgdXBkYXRlKGRlbHRhVGltZTpudW1iZXIpOlRpbWVyTWFuYWdlcntcbiAgICAgICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgdGhpcy50aW1lcnMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgIGlmKHRoaXMudGltZXJzW2ldLmFjdGl2ZSl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGltZXJzW2ldLnVwZGF0ZShkZWx0YVRpbWUpO1xuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLnRpbWVyc1tpXS5pc0VuZGVkICYmIHRoaXMudGltZXJzW2ldLmV4cGlyZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRpbWVyc1tpXS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYodGhpcy5fdG9EZWxldGUubGVuZ3RoKXtcbiAgICAgICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCB0aGlzLl90b0RlbGV0ZS5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3JlbW92ZSh0aGlzLl90b0RlbGV0ZVtpXSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5fdG9EZWxldGUubGVuZ3RoID0gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICByZW1vdmVUaW1lcih0aW1lcjpUaW1lcik6VGltZXJNYW5hZ2Vye1xuICAgICAgICAgICAgdGhpcy5fdG9EZWxldGUucHVzaCh0aW1lcik7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGFkZFRpbWVyKHRpbWVyOlRpbWVyKTpUaW1lcntcbiAgICAgICAgICAgIHRpbWVyLm1hbmFnZXIgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy50aW1lcnMucHVzaCh0aW1lcik7XG4gICAgICAgICAgICByZXR1cm4gdGltZXI7XG4gICAgICAgIH1cblxuICAgICAgICBjcmVhdGVUaW1lcih0aW1lPzpudW1iZXIpe1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBUaW1lcih0aW1lLCB0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX3JlbW92ZSh0aW1lcjpUaW1lcik6dm9pZHtcbiAgICAgICAgICAgIHZhciBpbmRleDpudW1iZXIgPSB0aGlzLnRpbWVycy5pbmRleE9mKHRpbWVyKTtcbiAgICAgICAgICAgIGlmKGluZGV4ID49IDApdGhpcy50aW1lcnMuc3BsaWNlKGluZGV4LDEpO1xuICAgICAgICB9XG4gICAgfVxufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2RlZnMvcGl4aS5qcy5kLnRzXCIgLz5cbm1vZHVsZSBQSVhJIHtcbiAgICBleHBvcnQgbW9kdWxlIEVhc2luZyB7XG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBsaW5lYXIoKTpGdW5jdGlvbntcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihrOm51bWJlcik6bnVtYmVye1xuICAgICAgICAgICAgICAgIHJldHVybiBrO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBpblF1YWQoKTpGdW5jdGlvbntcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihrOm51bWJlcik6bnVtYmVye1xuICAgICAgICAgICAgICAgIHJldHVybiBrKms7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIG91dFF1YWQoKTpGdW5jdGlvbntcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihrOm51bWJlcik6bnVtYmVye1xuICAgICAgICAgICAgICAgIHJldHVybiBrKigyLWspO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBpbk91dFF1YWQoKTpGdW5jdGlvbntcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihrOm51bWJlcik6bnVtYmVye1xuICAgICAgICAgICAgICAgIGlmICggKCBrICo9IDIgKSA8IDEgKSByZXR1cm4gMC41ICogayAqIGs7XG4gICAgICAgICAgICAgICAgcmV0dXJuIC0gMC41ICogKCAtLWsgKiAoIGsgLSAyICkgLSAxICk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIGluQ3ViaWMoKTpGdW5jdGlvbntcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoazpudW1iZXIpOm51bWJlcntcbiAgICAgICAgICAgICAgICByZXR1cm4gayAqIGsgKiBrO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBvdXRDdWJpYygpOkZ1bmN0aW9ue1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGs6bnVtYmVyKTpudW1iZXJ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIC0tayAqIGsgKiBrICsgMTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gaW5PdXRDdWJpYygpOkZ1bmN0aW9ue1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGs6bnVtYmVyKTpudW1iZXJ7XG4gICAgICAgICAgICAgICAgaWYgKCAoIGsgKj0gMiApIDwgMSApIHJldHVybiAwLjUgKiBrICogayAqIGs7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDAuNSAqICggKCBrIC09IDIgKSAqIGsgKiBrICsgMiApO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBpblF1YXJ0KCk6RnVuY3Rpb257XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oazpudW1iZXIpOm51bWJlcntcbiAgICAgICAgICAgICAgICByZXR1cm4gayAqIGsgKiBrICogaztcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gb3V0UXVhcnQoKTpGdW5jdGlvbntcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihrOm51bWJlcik6bnVtYmVye1xuICAgICAgICAgICAgICAgIHJldHVybiAxIC0gKCAtLWsgKiBrICogayAqIGsgKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gaW5PdXRRdWFydCgpOkZ1bmN0aW9ue1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGs6bnVtYmVyKTpudW1iZXJ7XG4gICAgICAgICAgICAgICAgaWYgKCAoIGsgKj0gMiApIDwgMSkgcmV0dXJuIDAuNSAqIGsgKiBrICogayAqIGs7XG4gICAgICAgICAgICAgICAgcmV0dXJuIC0gMC41ICogKCAoIGsgLT0gMiApICogayAqIGsgKiBrIC0gMiApO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBpblF1aW50KCk6RnVuY3Rpb257XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oazpudW1iZXIpOm51bWJlcntcbiAgICAgICAgICAgICAgICByZXR1cm4gayAqIGsgKiBrICogayAqIGs7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIG91dFF1aW50KCk6RnVuY3Rpb257XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oazpudW1iZXIpOm51bWJlcntcbiAgICAgICAgICAgICAgICByZXR1cm4gLS1rICogayAqIGsgKiBrICogayArIDE7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIGluT3V0UXVpbnQoKTpGdW5jdGlvbntcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihrOm51bWJlcik6bnVtYmVye1xuICAgICAgICAgICAgICAgIGlmICggKCBrICo9IDIgKSA8IDEgKSByZXR1cm4gMC41ICogayAqIGsgKiBrICogayAqIGs7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDAuNSAqICggKCBrIC09IDIgKSAqIGsgKiBrICogayAqIGsgKyAyICk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIGluU2luZSgpOkZ1bmN0aW9ue1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGs6bnVtYmVyKTpudW1iZXJ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDEgLSBNYXRoLmNvcyggayAqIE1hdGguUEkgLyAyICk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIG91dFNpbmUoKTpGdW5jdGlvbntcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihrOm51bWJlcik6bnVtYmVye1xuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLnNpbiggayAqIE1hdGguUEkgLyAyICk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIGluT3V0U2luZSgpOkZ1bmN0aW9ue1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGs6bnVtYmVyKTpudW1iZXJ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDAuNSAqICggMSAtIE1hdGguY29zKCBNYXRoLlBJICogayApICk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIGluRXhwbygpOkZ1bmN0aW9ue1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGs6bnVtYmVyKTpudW1iZXJ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGsgPT09IDAgPyAwIDogTWF0aC5wb3coIDEwMjQsIGsgLSAxICk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIG91dEV4cG8oKTpGdW5jdGlvbntcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihrOm51bWJlcik6bnVtYmVye1xuICAgICAgICAgICAgICAgIHJldHVybiBrID09PSAxID8gMSA6IDEgLSBNYXRoLnBvdyggMiwgLSAxMCAqIGsgKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gaW5PdXRFeHBvKCk6RnVuY3Rpb257XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oazpudW1iZXIpOm51bWJlcntcbiAgICAgICAgICAgICAgICBpZiAoIGsgPT09IDAgKSByZXR1cm4gMDtcbiAgICAgICAgICAgICAgICBpZiAoIGsgPT09IDEgKSByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICBpZiAoICggayAqPSAyICkgPCAxICkgcmV0dXJuIDAuNSAqIE1hdGgucG93KCAxMDI0LCBrIC0gMSApO1xuICAgICAgICAgICAgICAgIHJldHVybiAwLjUgKiAoIC0gTWF0aC5wb3coIDIsIC0gMTAgKiAoIGsgLSAxICkgKSArIDIgKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gaW5DaXJjKCk6RnVuY3Rpb257XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oazpudW1iZXIpOm51bWJlcntcbiAgICAgICAgICAgICAgICByZXR1cm4gMSAtIE1hdGguc3FydCggMSAtIGsgKiBrICk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIG91dENpcmMoKTpGdW5jdGlvbntcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihrOm51bWJlcik6bnVtYmVye1xuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLnNxcnQoIDEgLSAoIC0tayAqIGsgKSApO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBpbk91dENpcmMoKTpGdW5jdGlvbntcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihrOm51bWJlcik6bnVtYmVye1xuICAgICAgICAgICAgICAgIGlmICggKCBrICo9IDIgKSA8IDEpIHJldHVybiAtIDAuNSAqICggTWF0aC5zcXJ0KCAxIC0gayAqIGspIC0gMSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDAuNSAqICggTWF0aC5zcXJ0KCAxIC0gKCBrIC09IDIpICogaykgKyAxKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gaW5FbGFzdGljKCk6RnVuY3Rpb257XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oazpudW1iZXIpOm51bWJlcntcbiAgICAgICAgICAgICAgICB2YXIgczpudW1iZXIsIGE6bnVtYmVyID0gMC4xLCBwOm51bWJlciA9IDAuNDtcbiAgICAgICAgICAgICAgICBpZiAoIGsgPT09IDAgKSByZXR1cm4gMDtcbiAgICAgICAgICAgICAgICBpZiAoIGsgPT09IDEgKSByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICBpZiAoICFhIHx8IGEgPCAxICkgeyBhID0gMTsgcyA9IHAgLyA0OyB9XG4gICAgICAgICAgICAgICAgZWxzZSBzID0gcCAqIE1hdGguYXNpbiggMSAvIGEgKSAvICggMiAqIE1hdGguUEkgKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gLSAoIGEgKiBNYXRoLnBvdyggMiwgMTAgKiAoIGsgLT0gMSApICkgKiBNYXRoLnNpbiggKCBrIC0gcyApICogKCAyICogTWF0aC5QSSApIC8gcCApICk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIG91dEVsYXN0aWMoKTpGdW5jdGlvbntcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihrOm51bWJlcik6bnVtYmVye1xuICAgICAgICAgICAgICAgIHZhciBzOm51bWJlciwgYTpudW1iZXIgPSAwLjEsIHA6bnVtYmVyID0gMC40O1xuICAgICAgICAgICAgICAgIGlmICggayA9PT0gMCApIHJldHVybiAwO1xuICAgICAgICAgICAgICAgIGlmICggayA9PT0gMSApIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIGlmICggIWEgfHwgYSA8IDEgKSB7IGEgPSAxOyBzID0gcCAvIDQ7IH1cbiAgICAgICAgICAgICAgICBlbHNlIHMgPSBwICogTWF0aC5hc2luKCAxIC8gYSApIC8gKCAyICogTWF0aC5QSSApO1xuICAgICAgICAgICAgICAgIHJldHVybiAoIGEgKiBNYXRoLnBvdyggMiwgLSAxMCAqIGspICogTWF0aC5zaW4oICggayAtIHMgKSAqICggMiAqIE1hdGguUEkgKSAvIHAgKSArIDEgKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gaW5PdXRFbGFzdGljKCk6RnVuY3Rpb257XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oazpudW1iZXIpOm51bWJlcntcbiAgICAgICAgICAgICAgICB2YXIgczpudW1iZXIsIGE6bnVtYmVyID0gMC4xLCBwOm51bWJlciA9IDAuNDtcbiAgICAgICAgICAgICAgICBpZiAoIGsgPT09IDAgKSByZXR1cm4gMDtcbiAgICAgICAgICAgICAgICBpZiAoIGsgPT09IDEgKSByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICBpZiAoICFhIHx8IGEgPCAxICkgeyBhID0gMTsgcyA9IHAgLyA0OyB9XG4gICAgICAgICAgICAgICAgZWxzZSBzID0gcCAqIE1hdGguYXNpbiggMSAvIGEgKSAvICggMiAqIE1hdGguUEkgKTtcbiAgICAgICAgICAgICAgICBpZiAoICggayAqPSAyICkgPCAxICkgcmV0dXJuIC0gMC41ICogKCBhICogTWF0aC5wb3coIDIsIDEwICogKCBrIC09IDEgKSApICogTWF0aC5zaW4oICggayAtIHMgKSAqICggMiAqIE1hdGguUEkgKSAvIHAgKSApO1xuICAgICAgICAgICAgICAgIHJldHVybiBhICogTWF0aC5wb3coIDIsIC0xMCAqICggayAtPSAxICkgKSAqIE1hdGguc2luKCAoIGsgLSBzICkgKiAoIDIgKiBNYXRoLlBJICkgLyBwICkgKiAwLjUgKyAxO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBpbkJhY2sodjpudW1iZXIgPSAxLjcwMTU4KTpGdW5jdGlvbntcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihrOm51bWJlcik6bnVtYmVye1xuICAgICAgICAgICAgICAgIHZhciBzOm51bWJlciA9IHY7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGsgKiBrICogKCAoIHMgKyAxICkgKiBrIC0gcyApO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBvdXRCYWNrKHY6bnVtYmVyID0gMS43MDE1OCk6RnVuY3Rpb257XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oazpudW1iZXIpOm51bWJlcntcbiAgICAgICAgICAgICAgICB2YXIgczpudW1iZXIgPSB2O1xuICAgICAgICAgICAgICAgIHJldHVybiAtLWsgKiBrICogKCAoIHMgKyAxICkgKiBrICsgcyApICsgMTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gaW5PdXRCYWNrKHY6bnVtYmVyID0gMS43MDE1OCk6RnVuY3Rpb257XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oazpudW1iZXIpOm51bWJlcntcbiAgICAgICAgICAgICAgICB2YXIgczpudW1iZXIgPSAgdiAqIDEuNTI1O1xuICAgICAgICAgICAgICAgIGlmICggKCBrICo9IDIgKSA8IDEgKSByZXR1cm4gMC41ICogKCBrICogayAqICggKCBzICsgMSApICogayAtIHMgKSApO1xuICAgICAgICAgICAgICAgIHJldHVybiAwLjUgKiAoICggayAtPSAyICkgKiBrICogKCAoIHMgKyAxICkgKiBrICsgcyApICsgMiApO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBpbkJvdW5jZSgpOkZ1bmN0aW9ue1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGs6bnVtYmVyKTpudW1iZXJ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDEgLSBFYXNpbmcub3V0Qm91bmNlKCkoIDEgLSBrICk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIG91dEJvdW5jZSgpOkZ1bmN0aW9ue1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGs6bnVtYmVyKTpudW1iZXJ7XG4gICAgICAgICAgICAgICAgaWYgKCBrIDwgKCAxIC8gMi43NSApICkge1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiA3LjU2MjUgKiBrICogaztcblxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIGsgPCAoIDIgLyAyLjc1ICkgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDcuNTYyNSAqICggayAtPSAoIDEuNSAvIDIuNzUgKSApICogayArIDAuNzU7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCBrIDwgKCAyLjUgLyAyLjc1ICkgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDcuNTYyNSAqICggayAtPSAoIDIuMjUgLyAyLjc1ICkgKSAqIGsgKyAwLjkzNzU7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiA3LjU2MjUgKiAoIGsgLT0gKCAyLjYyNSAvIDIuNzUgKSApICogayArIDAuOTg0Mzc1O1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBpbk91dEJvdW5jZSgpOkZ1bmN0aW9ue1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGs6bnVtYmVyKTpudW1iZXJ7XG4gICAgICAgICAgICAgICAgaWYgKCBrIDwgMC41ICkgcmV0dXJuIEVhc2luZy5pbkJvdW5jZSgpKCBrICogMiApICogMC41O1xuICAgICAgICAgICAgICAgIHJldHVybiBFYXNpbmcub3V0Qm91bmNlKCkoIGsgKiAyIC0gMSApICogMC41ICsgMC41O1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9kZWZzL3BpeGkuanMuZC50c1wiIC8+XG5tb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IGNsYXNzIFBhdGgge1xuICAgICAgICBwcml2YXRlIF9jbG9zZWQ6Ym9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBwb2x5Z29uOlBvbHlnb24gPSBuZXcgUG9seWdvbigpO1xuXG4gICAgICAgIHByaXZhdGUgX3RtcFBvaW50OlBvaW50ID0gbmV3IFBvaW50KCk7XG4gICAgICAgIHByaXZhdGUgX3RtcFBvaW50MjpQb2ludCA9IG5ldyBQb2ludCgpO1xuXG4gICAgICAgIHByaXZhdGUgX3RtcERpc3RhbmNlOmFueVtdID0gW107XG5cbiAgICAgICAgcHJpdmF0ZSBjdXJyZW50UGF0aDpHcmFwaGljc0RhdGE7XG4gICAgICAgIHByaXZhdGUgZ3JhcGhpY3NEYXRhOkdyYXBoaWNzRGF0YVtdID0gW107XG5cbiAgICAgICAgZGlydHk6Ym9vbGVhbiA9IGZhbHNlO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgICAgICB0aGlzLnBvbHlnb24uY2xvc2VkID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBtb3ZlVG8oeDpudW1iZXIsIHk6bnVtYmVyKTpQYXRoe1xuICAgICAgICAgICAgR3JhcGhpY3MucHJvdG90eXBlLm1vdmVUby5jYWxsKHRoaXMsIHgseSk7XG4gICAgICAgICAgICB0aGlzLmRpcnR5ID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgbGluZVRvKHg6bnVtYmVyLCB5Om51bWJlcik6UGF0aHtcbiAgICAgICAgICAgIEdyYXBoaWNzLnByb3RvdHlwZS5saW5lVG8uY2FsbCh0aGlzLCB4LHkpO1xuICAgICAgICAgICAgdGhpcy5kaXJ0eSA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGJlemllckN1cnZlVG8oY3BYOm51bWJlciwgY3BZOm51bWJlciwgY3BYMjpudW1iZXIsIGNwWTI6bnVtYmVyLCB0b1g6bnVtYmVyLCB0b1k6bnVtYmVyKTpQYXRoe1xuICAgICAgICAgICAgR3JhcGhpY3MucHJvdG90eXBlLmJlemllckN1cnZlVG8uY2FsbCh0aGlzLCBjcFgsIGNwWSwgY3BYMiwgY3BZMiwgdG9YLCB0b1kpO1xuICAgICAgICAgICAgdGhpcy5kaXJ0eSA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHF1YWRyYXRpY0N1cnZlVG8oY3BYOiBudW1iZXIsIGNwWTogbnVtYmVyLCB0b1g6IG51bWJlciwgdG9ZOiBudW1iZXIpOlBhdGh7XG4gICAgICAgICAgICBHcmFwaGljcy5wcm90b3R5cGUucXVhZHJhdGljQ3VydmVUby5jYWxsKHRoaXMsIGNwWCwgY3BZLCB0b1gsIHRvWSk7XG4gICAgICAgICAgICB0aGlzLmRpcnR5ID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgYXJjVG8oeDE6IG51bWJlciwgeTE6IG51bWJlciwgeDI6IG51bWJlciwgeTI6IG51bWJlciwgcmFkaXVzOiBudW1iZXIpOiBQYXRoe1xuICAgICAgICAgICAgR3JhcGhpY3MucHJvdG90eXBlLmFyY1RvLmNhbGwodGhpcywgeDEsIHkxLCB4MiwgeTIsIHJhZGl1cyk7XG4gICAgICAgICAgICB0aGlzLmRpcnR5ID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgYXJjKGN4OiBudW1iZXIsIGN5OiBudW1iZXIsIHJhZGl1czogbnVtYmVyLCBzdGFydEFuZ2xlOiBudW1iZXIsIGVuZEFuZ2xlOiBudW1iZXIsIGFudGljbG9ja3dpc2U/OiBib29sZWFuKTogUGF0aCB7XG4gICAgICAgICAgICBHcmFwaGljcy5wcm90b3R5cGUuYXJjLmNhbGwodGhpcywgY3gsIGN5LCByYWRpdXMsIHN0YXJ0QW5nbGUsIGVuZEFuZ2xlLCBhbnRpY2xvY2t3aXNlKTtcbiAgICAgICAgICAgIHRoaXMuZGlydHkgPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBkcmF3U2hhcGUoc2hhcGU6UG9seWdvbik6UGF0aHtcbiAgICAgICAgICAgIEdyYXBoaWNzLnByb3RvdHlwZS5kcmF3U2hhcGUuY2FsbCh0aGlzLCBzaGFwZSk7XG4gICAgICAgICAgICB0aGlzLmRpcnR5ID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0UG9pbnQobnVtOm51bWJlcik6UG9pbnR7XG4gICAgICAgICAgICB0aGlzLnBhcnNlUG9pbnRzKCk7XG4gICAgICAgICAgICB2YXIgbGVuOm51bWJlciA9IG51bSoyO1xuICAgICAgICAgICAgdGhpcy5fdG1wUG9pbnQuc2V0KHRoaXMucG9seWdvbi5wb2ludHNbbGVuXSx0aGlzLnBvbHlnb24ucG9pbnRzW2xlbiArIDFdKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90bXBQb2ludDtcbiAgICAgICAgfVxuXG4gICAgICAgIGRpc3RhbmNlQmV0d2VlbihudW0xOm51bWJlciwgbnVtMjpudW1iZXIpOm51bWJlcntcbiAgICAgICAgICAgIHRoaXMucGFyc2VQb2ludHMoKTtcbiAgICAgICAgICAgIHZhciB7eDpwMVgsIHk6cDFZfSA9IHRoaXMuZ2V0UG9pbnQobnVtMSk7XG4gICAgICAgICAgICB2YXIge3g6cDJYLCB5OnAyWX0gPSB0aGlzLmdldFBvaW50KG51bTIpO1xuXG4gICAgICAgICAgICB2YXIgZHg6bnVtYmVyID0gcDJYLXAxWDtcbiAgICAgICAgICAgIHZhciBkeTpudW1iZXIgPSBwMlktcDFZO1xuXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KGR4KmR4K2R5KmR5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRvdGFsRGlzdGFuY2UoKTpudW1iZXJ7XG4gICAgICAgICAgICB0aGlzLnBhcnNlUG9pbnRzKCk7XG4gICAgICAgICAgICB0aGlzLl90bXBEaXN0YW5jZS5sZW5ndGggPSAwO1xuICAgICAgICAgICAgdGhpcy5fdG1wRGlzdGFuY2UucHVzaCgwKTtcblxuICAgICAgICAgICAgdmFyIGxlbjpudW1iZXIgPSB0aGlzLmxlbmd0aDtcbiAgICAgICAgICAgIHZhciBkaXN0YW5jZTpudW1iZXIgPSAwO1xuICAgICAgICAgICAgZm9yICh2YXIgaTpudW1iZXIgPSAwOyBpIDwgbGVuIC0gMTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZGlzdGFuY2UgKz0gdGhpcy5kaXN0YW5jZUJldHdlZW4oaSwgaSArIDEpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3RtcERpc3RhbmNlLnB1c2goZGlzdGFuY2UpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZGlzdGFuY2U7XG4gICAgICAgIH1cblxuICAgICAgICBnZXRQb2ludEF0KG51bTpudW1iZXIpOlBvaW50e1xuICAgICAgICAgICAgdGhpcy5wYXJzZVBvaW50cygpO1xuICAgICAgICAgICAgaWYobnVtID4gdGhpcy5sZW5ndGgpe1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFBvaW50KHRoaXMubGVuZ3RoLTEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihudW0lMSA9PT0gMCl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UG9pbnQobnVtKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHRoaXMuX3RtcFBvaW50Mi5zZXQoMCwwKTtcblxuICAgICAgICAgICAgICAgIHZhciBkaWZmOm51bWJlciA9IG51bSUxO1xuXG4gICAgICAgICAgICAgICAgdmFyIHt4OmNlaWxYLCB5OmNlaWxZfSA9IHRoaXMuZ2V0UG9pbnQoTWF0aC5jZWlsKG51bSkpO1xuICAgICAgICAgICAgICAgIHZhciB7eDpmbG9vclgsIHk6Zmxvb3JZfSA9IHRoaXMuZ2V0UG9pbnQoTWF0aC5mbG9vcihudW0pKTtcblxuICAgICAgICAgICAgICAgIHZhciB4eDpudW1iZXIgPSAtKChmbG9vclggLSBjZWlsWCkqZGlmZik7XG4gICAgICAgICAgICAgICAgdmFyIHl5Om51bWJlciA9IC0oKGZsb29yWSAtIGNlaWxZKSpkaWZmKTtcbiAgICAgICAgICAgICAgICB0aGlzLl90bXBQb2ludDIuc2V0KGZsb29yWCArIHh4LCBmbG9vclkgKyB5eSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fdG1wUG9pbnQyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZ2V0UG9pbnRBdERpc3RhbmNlKGRpc3RhbmNlOm51bWJlcik6UG9pbnR7XG4gICAgICAgICAgICB0aGlzLnBhcnNlUG9pbnRzKCk7XG4gICAgICAgICAgICBpZighdGhpcy5fdG1wRGlzdGFuY2UpdGhpcy50b3RhbERpc3RhbmNlKCk7XG4gICAgICAgICAgICB2YXIgbGVuOm51bWJlciA9IHRoaXMuX3RtcERpc3RhbmNlLmxlbmd0aDtcbiAgICAgICAgICAgIHZhciBuOm51bWJlciA9IDA7XG5cbiAgICAgICAgICAgIHZhciB0b3RhbERpc3RhbmNlOm51bWJlciA9IHRoaXMuX3RtcERpc3RhbmNlW3RoaXMuX3RtcERpc3RhbmNlLmxlbmd0aC0xXTtcbiAgICAgICAgICAgIGlmKGRpc3RhbmNlIDwgMCl7XG4gICAgICAgICAgICAgICAgZGlzdGFuY2UgPSB0b3RhbERpc3RhbmNlK2Rpc3RhbmNlO1xuICAgICAgICAgICAgfWVsc2UgaWYoZGlzdGFuY2UgPiB0b3RhbERpc3RhbmNlKXtcbiAgICAgICAgICAgICAgICBkaXN0YW5jZSA9IGRpc3RhbmNlLXRvdGFsRGlzdGFuY2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgbGVuOyBpKyspe1xuICAgICAgICAgICAgICAgIGlmKGRpc3RhbmNlID49IHRoaXMuX3RtcERpc3RhbmNlW2ldKXtcbiAgICAgICAgICAgICAgICAgICAgbiA9IGk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYoZGlzdGFuY2UgPCB0aGlzLl90bXBEaXN0YW5jZVtpXSl7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYobiA9PT0gdGhpcy5sZW5ndGgtMSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UG9pbnRBdChuKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGRpZmYxOm51bWJlciA9IGRpc3RhbmNlLXRoaXMuX3RtcERpc3RhbmNlW25dO1xuICAgICAgICAgICAgdmFyIGRpZmYyOm51bWJlciA9IHRoaXMuX3RtcERpc3RhbmNlW24rMV0gLSB0aGlzLl90bXBEaXN0YW5jZVtuXTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UG9pbnRBdChuK2RpZmYxL2RpZmYyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBhcnNlUG9pbnRzKCk6UGF0aCB7XG4gICAgICAgICAgICBpZih0aGlzLmRpcnR5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kaXJ0eSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMucG9seWdvbi5wb2ludHMubGVuZ3RoID0gMDtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpOm51bWJlciA9IDA7IGkgPCB0aGlzLmdyYXBoaWNzRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc2hhcGU6UG9seWdvbiA9IDxQb2x5Z29uPnRoaXMuZ3JhcGhpY3NEYXRhW2ldLnNoYXBlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2hhcGUgJiYgc2hhcGUucG9pbnRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBvbHlnb24ucG9pbnRzID0gdGhpcy5wb2x5Z29uLnBvaW50cy5jb25jYXQoc2hhcGUucG9pbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBjbGVhcigpOlBhdGh7XG4gICAgICAgICAgICB0aGlzLmdyYXBoaWNzRGF0YS5sZW5ndGggPSAwO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50UGF0aCA9IG51bGw7XG5cbiAgICAgICAgICAgIHRoaXMucG9seWdvbi5wb2ludHMubGVuZ3RoID0gMDtcbiAgICAgICAgICAgIHRoaXMuX2Nsb3NlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5kaXJ0eSA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgY2xvc2VkKCk6Ym9vbGVhbntcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jbG9zZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBzZXQgY2xvc2VkKHZhbHVlKXtcbiAgICAgICAgICAgIHRoaXMucG9seWdvbi5jbG9zZWQgPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuX2Nsb3NlZCA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy5kaXJ0eSA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgbGVuZ3RoKCk6bnVtYmVye1xuICAgICAgICAgICAgcmV0dXJuICh0aGlzLnBvbHlnb24ucG9pbnRzLmxlbmd0aCA9PT0gMCkgPyAwIDogdGhpcy5wb2x5Z29uLnBvaW50cy5sZW5ndGgvMiArICgodGhpcy5fY2xvc2VkKSA/IDEgOiAwKTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9kZWZzL3BpeGkuanMuZC50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuL1R3ZWVuTWFuYWdlci50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuL0Vhc2luZy50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9kaXNwbGF5L1NjZW5lLnRzXCIgLz5cbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4vUGF0aC50c1wiIC8+XG5tb2R1bGUgUElYSXtcbiAgICBleHBvcnQgY2xhc3MgVHdlZW57XG4gICAgICAgIHRpbWU6bnVtYmVyID0gMDtcbiAgICAgICAgYWN0aXZlOmJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgZWFzaW5nOkZ1bmN0aW9uID0gRWFzaW5nLmxpbmVhcigpO1xuICAgICAgICBleHBpcmU6Ym9vbGVhbiA9IGZhbHNlO1xuICAgICAgICByZXBlYXQ6bnVtYmVyID0gMDtcbiAgICAgICAgbG9vcDpib29sZWFuID0gZmFsc2U7XG4gICAgICAgIGRlbGF5Om51bWJlciA9IDA7XG4gICAgICAgIHBpbmdQb25nOmJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgaXNTdGFydGVkOmJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgaXNFbmRlZDpib29sZWFuID0gZmFsc2U7XG5cbiAgICAgICAgcHJpdmF0ZSBfdG86YW55O1xuICAgICAgICBwcml2YXRlIF9mcm9tOmFueTtcbiAgICAgICAgcHJpdmF0ZSBfZGVsYXlUaW1lOm51bWJlciA9IDA7XG4gICAgICAgIHByaXZhdGUgX2VsYXBzZWRUaW1lOm51bWJlciA9IDA7XG4gICAgICAgIHByaXZhdGUgX3JlcGVhdDpudW1iZXIgPSAwO1xuICAgICAgICBwcml2YXRlIF9waW5nUG9uZzpib29sZWFuID0gZmFsc2U7XG5cbiAgICAgICAgcHJpdmF0ZSBfY2hhaW5Ud2VlbjpUd2VlbjtcblxuICAgICAgICBwYXRoOlBhdGg7XG4gICAgICAgIHBhdGhSZXZlcnNlOmJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgcGF0aEZyb206bnVtYmVyO1xuICAgICAgICBwYXRoVG86bnVtYmVyO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB0YXJnZXQ6YW55LCBwdWJsaWMgbWFuYWdlcj86VHdlZW5NYW5hZ2VyKXtcbiAgICAgICAgICAgIGlmKHRoaXMubWFuYWdlcil7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRUbyh0aGlzLm1hbmFnZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgYWRkVG8obWFuYWdlcjpUd2Vlbk1hbmFnZXIpOlR3ZWVue1xuICAgICAgICAgICAgbWFuYWdlci5hZGRUd2Vlbih0aGlzKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgY2hhaW4odHdlZW46VHdlZW4gPSBuZXcgVHdlZW4odGhpcy50YXJnZXQpKTpUd2VlbntcbiAgICAgICAgICAgIHRoaXMuX2NoYWluVHdlZW4gPSB0d2VlbjtcbiAgICAgICAgICAgIHJldHVybiB0d2VlbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXJ0KCk6VHdlZW57XG4gICAgICAgICAgICB0aGlzLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICBpZighdGhpcy5tYW5hZ2VyKXtcbiAgICAgICAgICAgICAgICBpZih0aGlzLnRhcmdldCl7XG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMudGFyZ2V0LnBhcmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1hbmFnZXI6VHdlZW5NYW5hZ2VyID0gX2ZpbmRNYW5hZ2VyKHRoaXMudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtYW5hZ2VyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRUbyhtYW5hZ2VyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoJ1R3ZWVucyBuZWVkcyBhIG1hbmFnZXInKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcignVHdlZW5zIG5lZWRzIGEgbWFuYWdlcicpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBzdG9wKCk6VHdlZW57XG4gICAgICAgICAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5fb25Ud2VlblN0b3AodGhpcy5fZWxhcHNlZFRpbWUpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICB0byhkYXRhOmFueSk6VHdlZW57XG4gICAgICAgICAgICB0aGlzLl90byA9IGRhdGE7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGZyb20oZGF0YTphbnkpOlR3ZWVue1xuICAgICAgICAgICAgdGhpcy5fZnJvbSA9IGRhdGE7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZSgpOlR3ZWVue1xuICAgICAgICAgICAgaWYoIXRoaXMubWFuYWdlcil7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVHdlZW4gd2l0aG91dCBtYW5hZ2VyLlwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLnJlbW92ZVR3ZWVuKHRoaXMpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICByZXNldCgpOlR3ZWVue1xuICAgICAgICAgICAgdGhpcy5fZWxhcHNlZFRpbWUgPSAwO1xuICAgICAgICAgICAgdGhpcy5fcmVwZWF0ID0gMDtcbiAgICAgICAgICAgIHRoaXMuX2RlbGF5VGltZSA9IDA7XG4gICAgICAgICAgICB0aGlzLmlzU3RhcnRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5pc0VuZGVkID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGlmKHRoaXMucGluZ1BvbmcmJnRoaXMuX3BpbmdQb25nKXtcbiAgICAgICAgICAgICAgICB2YXIgX3RvOmFueSA9IHRoaXMuX3RvLFxuICAgICAgICAgICAgICAgICAgICBfZnJvbTphbnkgPSB0aGlzLl9mcm9tO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fdG8gPSBfZnJvbTtcbiAgICAgICAgICAgICAgICB0aGlzLl9mcm9tID0gX3RvO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fcGluZ1BvbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgb25TdGFydChjYWxsYmFjazpGdW5jdGlvbik6VHdlZW57XG4gICAgICAgICAgICB0aGlzLl9vblR3ZWVuU3RhcnQgPSA8YW55PmNhbGxiYWNrO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBvbkVuZChjYWxsYmFjazpGdW5jdGlvbik6VHdlZW57XG4gICAgICAgICAgICB0aGlzLl9vblR3ZWVuRW5kID0gPGFueT5jYWxsYmFjaztcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgb25TdG9wKGNhbGxiYWNrOkZ1bmN0aW9uKTpUd2VlbntcbiAgICAgICAgICAgIHRoaXMuX29uVHdlZW5TdG9wID0gPGFueT5jYWxsYmFjaztcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgb25VcGRhdGUoY2FsbGJhY2s6RnVuY3Rpb24pOlR3ZWVue1xuICAgICAgICAgICAgdGhpcy5fb25Ud2VlblVwZGF0ZSA9IDxhbnk+Y2FsbGJhY2s7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIG9uUmVwZWF0KGNhbGxiYWNrOkZ1bmN0aW9uKTpUd2VlbntcbiAgICAgICAgICAgIHRoaXMuX29uVHdlZW5SZXBlYXQgPSA8YW55PmNhbGxiYWNrO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBvblBpbmdQb25nKGNhbGxiYWNrOkZ1bmN0aW9uKTpUd2VlbntcbiAgICAgICAgICAgIHRoaXMuX29uVHdlZW5QaW5nUG9uZyA9IDxhbnk+Y2FsbGJhY2s7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZShkZWx0YVRpbWU6bnVtYmVyKTpUd2VlbntcbiAgICAgICAgICAgIGlmKCEodGhpcy5fY2FuVXBkYXRlKCkmJih0aGlzLl90b3x8dGhpcy5wYXRoKSkpe1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgX3RvOmFueSwgX2Zyb206YW55O1xuICAgICAgICAgICAgdmFyIGRlbHRhTVMgPSBkZWx0YVRpbWUgKiAxMDAwO1xuXG4gICAgICAgICAgICBpZih0aGlzLmRlbGF5ID4gdGhpcy5fZGVsYXlUaW1lKXtcbiAgICAgICAgICAgICAgICB0aGlzLl9kZWxheVRpbWUgKz0gZGVsdGFNUztcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoIXRoaXMuaXNTdGFydGVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcGFyc2VEYXRhKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5pc1N0YXJ0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuX29uVHdlZW5TdGFydCh0aGlzLl9lbGFwc2VkVGltZSwgZGVsdGFUaW1lKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHRpbWU6bnVtYmVyID0gKHRoaXMucGluZ1BvbmcpID8gdGhpcy50aW1lLzIgOiB0aGlzLnRpbWU7XG4gICAgICAgICAgICBpZih0aW1lID4gdGhpcy5fZWxhcHNlZFRpbWUpe1xuICAgICAgICAgICAgICAgIHZhciB0Om51bWJlciA9IHRoaXMuX2VsYXBzZWRUaW1lK2RlbHRhTVM7XG4gICAgICAgICAgICAgICAgdmFyIGVuZGVkOmJvb2xlYW4gPSAodD49dGltZSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9lbGFwc2VkVGltZSA9IChlbmRlZCkgPyB0aW1lIDogdDtcbiAgICAgICAgICAgICAgICB0aGlzLl9hcHBseSh0aW1lKTtcblxuICAgICAgICAgICAgICAgIHZhciByZWFsRWxhcHNlZDpudW1iZXIgPSAodGhpcy5fcGluZ1BvbmcpID8gdGltZSt0aGlzLl9lbGFwc2VkVGltZSA6IHRoaXMuX2VsYXBzZWRUaW1lO1xuICAgICAgICAgICAgICAgIHRoaXMuX29uVHdlZW5VcGRhdGUocmVhbEVsYXBzZWQsIGRlbHRhVGltZSk7XG5cbiAgICAgICAgICAgICAgICBpZihlbmRlZCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5waW5nUG9uZyAmJiAhdGhpcy5fcGluZ1BvbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3BpbmdQb25nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF90byA9IHRoaXMuX3RvO1xuICAgICAgICAgICAgICAgICAgICAgICAgX2Zyb20gPSB0aGlzLl9mcm9tO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9mcm9tID0gX3RvO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fdG8gPSBfZnJvbTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucGF0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90byA9IHRoaXMucGF0aFRvO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9mcm9tID0gdGhpcy5wYXRoRnJvbTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGF0aFRvID0gX2Zyb207XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXRoRnJvbSA9IF90bztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fb25Ud2VlblBpbmdQb25nKHJlYWxFbGFwc2VkLCBkZWx0YVRpbWUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGFwc2VkVGltZSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmxvb3AgfHwgdGhpcy5yZXBlYXQgPiB0aGlzLl9yZXBlYXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3JlcGVhdCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fb25Ud2VlblJlcGVhdChyZWFsRWxhcHNlZCwgZGVsdGFUaW1lLCB0aGlzLl9yZXBlYXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxhcHNlZFRpbWUgPSAwO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5waW5nUG9uZyAmJiB0aGlzLl9waW5nUG9uZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90byA9IHRoaXMuX3RvO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9mcm9tID0gdGhpcy5fZnJvbTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3RvID0gX2Zyb207XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZnJvbSA9IF90bztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnBhdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RvID0gdGhpcy5wYXRoVG87XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9mcm9tID0gdGhpcy5wYXRoRnJvbTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBhdGhUbyA9IF9mcm9tO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBhdGhGcm9tID0gX3RvO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3BpbmdQb25nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNFbmRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX29uVHdlZW5FbmQocmVhbEVsYXBzZWQsIGRlbHRhVGltZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5fY2hhaW5Ud2Vlbil7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGFpblR3ZWVuLmFkZFRvKHRoaXMubWFuYWdlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGFpblR3ZWVuLnN0YXJ0KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX3BhcnNlRGF0YSgpOnZvaWR7XG4gICAgICAgICAgICBpZih0aGlzLmlzU3RhcnRlZClyZXR1cm47XG5cbiAgICAgICAgICAgIGlmKCF0aGlzLl9mcm9tKXRoaXMuX2Zyb20gPSB7fTtcbiAgICAgICAgICAgIF9wYXJzZVJlY3Vyc2l2ZURhdGEodGhpcy5fdG8sIHRoaXMuX2Zyb20sIHRoaXMudGFyZ2V0KTtcblxuICAgICAgICAgICAgaWYodGhpcy5wYXRoKXtcbiAgICAgICAgICAgICAgICBsZXQgZGlzdGFuY2U6bnVtYmVyID0gdGhpcy5wYXRoLnRvdGFsRGlzdGFuY2UoKTtcbiAgICAgICAgICAgICAgICBpZih0aGlzLnBhdGhSZXZlcnNlKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXRoRnJvbSA9IGRpc3RhbmNlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhdGhUbyA9IDA7XG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGF0aEZyb20gPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhdGhUbyA9IGRpc3RhbmNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX2FwcGx5KHRpbWU6bnVtYmVyKTp2b2lke1xuICAgICAgICAgICAgX3JlY3Vyc2l2ZUFwcGx5KHRoaXMuX3RvLCB0aGlzLl9mcm9tLCB0aGlzLnRhcmdldCwgdGltZSwgdGhpcy5fZWxhcHNlZFRpbWUsIHRoaXMuZWFzaW5nKTtcblxuICAgICAgICAgICAgaWYodGhpcy5wYXRoKXtcbiAgICAgICAgICAgICAgICBsZXQgYjpudW1iZXIgPSB0aGlzLnBhdGhGcm9tLFxuICAgICAgICAgICAgICAgICAgICBjOm51bWJlciA9IHRoaXMucGF0aFRvIC0gdGhpcy5wYXRoRnJvbSxcbiAgICAgICAgICAgICAgICAgICAgZDpudW1iZXIgPSB0aGlzLnRpbWUsXG4gICAgICAgICAgICAgICAgICAgIHQ6bnVtYmVyID0gdGhpcy5fZWxhcHNlZFRpbWUvZDtcblxuICAgICAgICAgICAgICAgIGxldCBkaXN0YW5jZTpudW1iZXIgPSBiICsgKGMqdGhpcy5lYXNpbmcodCkpO1xuICAgICAgICAgICAgICAgIGxldCBwb3M6UG9pbnQgPSB0aGlzLnBhdGguZ2V0UG9pbnRBdERpc3RhbmNlKGRpc3RhbmNlKTtcbiAgICAgICAgICAgICAgICB0aGlzLnRhcmdldC54ID0gcG9zLng7XG4gICAgICAgICAgICAgICAgdGhpcy50YXJnZXQueSA9IHBvcy55O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfY2FuVXBkYXRlKCk6Ym9vbGVhbntcbiAgICAgICAgICAgIHJldHVybiAodGhpcy50aW1lICYmIHRoaXMuYWN0aXZlICYmIHRoaXMudGFyZ2V0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX29uVHdlZW5TdGFydChlbGFwc2VkVGltZTpudW1iZXIsIGRlbHRhVGltZTogbnVtYmVyKTp2b2lke31cbiAgICAgICAgcHJpdmF0ZSBfb25Ud2VlblN0b3AoZWxhcHNlZFRpbWU6bnVtYmVyKTp2b2lke31cbiAgICAgICAgcHJpdmF0ZSBfb25Ud2VlbkVuZChlbGFwc2VkVGltZTpudW1iZXIsIGRlbHRhVGltZTogbnVtYmVyKTp2b2lke31cbiAgICAgICAgcHJpdmF0ZSBfb25Ud2VlblJlcGVhdChlbGFwc2VkVGltZTpudW1iZXIsIGRlbHRhVGltZTogbnVtYmVyLCByZXBlYXQ6bnVtYmVyKTp2b2lke31cbiAgICAgICAgcHJpdmF0ZSBfb25Ud2VlblVwZGF0ZShlbGFwc2VkVGltZTpudW1iZXIsIGRlbHRhVGltZTogbnVtYmVyKTp2b2lke31cbiAgICAgICAgcHJpdmF0ZSBfb25Ud2VlblBpbmdQb25nKGVsYXBzZWRUaW1lOm51bWJlciwgZGVsdGFUaW1lOiBudW1iZXIpOnZvaWR7fVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9maW5kTWFuYWdlcihwYXJlbnQ6YW55KTphbnl7XG4gICAgICAgIGlmKHBhcmVudCBpbnN0YW5jZW9mIFNjZW5lKXtcbiAgICAgICAgICAgIHJldHVybiAocGFyZW50LnR3ZWVuTWFuYWdlcikgPyBwYXJlbnQudHdlZW5NYW5hZ2VyIDogbnVsbDtcbiAgICAgICAgfWVsc2UgaWYocGFyZW50LnBhcmVudCl7XG4gICAgICAgICAgICByZXR1cm4gX2ZpbmRNYW5hZ2VyKHBhcmVudC5wYXJlbnQpO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX3BhcnNlUmVjdXJzaXZlRGF0YSh0bzphbnksIGZyb206YW55LCB0YXJnZXQ6YW55KTp2b2lke1xuICAgICAgICBmb3IodmFyIGsgaW4gdG8pe1xuICAgICAgICAgICAgaWYoZnJvbVtrXSAhPT0gMCAmJiAhZnJvbVtrXSl7XG4gICAgICAgICAgICAgICAgaWYoaXNPYmplY3QodGFyZ2V0W2tdKSl7XG4gICAgICAgICAgICAgICAgICAgIGZyb21ba10gPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHRhcmdldFtrXSkpO1xuICAgICAgICAgICAgICAgICAgICBfcGFyc2VSZWN1cnNpdmVEYXRhKHRvW2tdLCBmcm9tW2tdLCB0YXJnZXRba10pO1xuICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICBmcm9tW2tdID0gdGFyZ2V0W2tdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzT2JqZWN0KG9iajphbnkpOmJvb2xlYW57XG4gICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gXCJbb2JqZWN0IE9iamVjdF1cIjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfcmVjdXJzaXZlQXBwbHkodG86YW55LCBmcm9tOmFueSwgdGFyZ2V0OmFueSwgdGltZTpudW1iZXIsIGVsYXBzZWQ6bnVtYmVyLCBlYXNpbmc6RnVuY3Rpb24pOnZvaWR7XG4gICAgICAgIGZvcih2YXIgayBpbiB0byl7XG4gICAgICAgICAgICBpZighaXNPYmplY3QodG9ba10pKSB7XG4gICAgICAgICAgICAgICAgdmFyIGIgPSBmcm9tW2tdLFxuICAgICAgICAgICAgICAgICAgICBjID0gdG9ba10gLSBmcm9tW2tdLFxuICAgICAgICAgICAgICAgICAgICBkID0gdGltZSxcbiAgICAgICAgICAgICAgICAgICAgdCA9IGVsYXBzZWQvZDtcbiAgICAgICAgICAgICAgICB0YXJnZXRba10gPSBiICsgKGMqZWFzaW5nKHQpKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIF9yZWN1cnNpdmVBcHBseSh0b1trXSwgZnJvbVtrXSwgdGFyZ2V0W2tdLCB0aW1lLCBlbGFwc2VkLCBlYXNpbmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuIiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vZGVmcy9waXhpLmpzLmQudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi9Ud2Vlbi50c1wiIC8+XG5tb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IGNsYXNzIFR3ZWVuTWFuYWdlcntcbiAgICAgICAgdHdlZW5zOlR3ZWVuW10gPSBbXTtcbiAgICAgICAgcHJpdmF0ZSBfdG9EZWxldGU6VHdlZW5bXSA9IFtdO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCl7fVxuXG4gICAgICAgIHVwZGF0ZShkZWx0YVRpbWU6bnVtYmVyKTpUd2Vlbk1hbmFnZXJ7XG4gICAgICAgICAgICBmb3IodmFyIGk6bnVtYmVyID0gMDsgaSA8IHRoaXMudHdlZW5zLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICBpZih0aGlzLnR3ZWVuc1tpXS5hY3RpdmUpe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnR3ZWVuc1tpXS51cGRhdGUoZGVsdGFUaW1lKVxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLnR3ZWVuc1tpXS5pc0VuZGVkICYmIHRoaXMudHdlZW5zW2ldLmV4cGlyZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnR3ZWVuc1tpXS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYodGhpcy5fdG9EZWxldGUubGVuZ3RoKXtcbiAgICAgICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCB0aGlzLl90b0RlbGV0ZS5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3JlbW92ZSh0aGlzLl90b0RlbGV0ZVtpXSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5fdG9EZWxldGUubGVuZ3RoID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0VHdlZW5zRm9yVGFyZ2VyKHRhcmdldDphbnkpOlR3ZWVuW117XG4gICAgICAgICAgICB2YXIgdHdlZW5zOlR3ZWVuW10gPSBbXTtcbiAgICAgICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgdGhpcy50d2VlbnMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgIGlmKHRoaXMudHdlZW5zW2ldLnRhcmdldCA9PT0gdGFyZ2V0KXtcbiAgICAgICAgICAgICAgICAgICAgdHdlZW5zLnB1c2godGhpcy50d2VlbnNbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHR3ZWVucztcbiAgICAgICAgfVxuXG4gICAgICAgIGNyZWF0ZVR3ZWVuKHRhcmdldDphbnkpOlR3ZWVue1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBUd2Vlbih0YXJnZXQsIHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgYWRkVHdlZW4odHdlZW46VHdlZW4pOlR3ZWVue1xuICAgICAgICAgICAgdHdlZW4ubWFuYWdlciA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLnR3ZWVucy5wdXNoKHR3ZWVuKTtcbiAgICAgICAgICAgIHJldHVybiB0d2VlbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZVR3ZWVuKHR3ZWVuOlR3ZWVuKTpUd2Vlbk1hbmFnZXJ7XG4gICAgICAgICAgICB0aGlzLl90b0RlbGV0ZS5wdXNoKHR3ZWVuKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfcmVtb3ZlKHR3ZWVuOlR3ZWVuKXtcbiAgICAgICAgICAgIHZhciBpbmRleDpudW1iZXIgPSB0aGlzLnR3ZWVucy5pbmRleE9mKHR3ZWVuKTtcbiAgICAgICAgICAgIGlmKGluZGV4ID49IDApe1xuICAgICAgICAgICAgICAgIHRoaXMudHdlZW5zLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59IiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vZGVmcy9waXhpLmpzLmQudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vY29yZS9HYW1lLnRzXCIgLz5cbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4vQ2FtZXJhLnRzXCIgLz5cbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL3RpbWVyL1RpbWVyTWFuYWdlci50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi90d2Vlbi9Ud2Vlbm1hbmFnZXIudHNcIiAvPlxubW9kdWxlIFBJWEkge1xuICAgIGV4cG9ydCBjbGFzcyBTY2VuZSBleHRlbmRzIENvbnRhaW5lciB7XG4gICAgICAgIGNhbWVyYTpDYW1lcmEgPSBuZXcgQ2FtZXJhKCk7XG4gICAgICAgIHRpbWVyTWFuYWdlcjpUaW1lck1hbmFnZXIgPSBuZXcgVGltZXJNYW5hZ2VyKCk7XG4gICAgICAgIHR3ZWVuTWFuYWdlcjpUd2Vlbk1hbmFnZXIgPSBuZXcgVHdlZW5NYW5hZ2VyKCk7XG4gICAgICAgIHN0YXRpYyBfaWRMZW46bnVtYmVyID0gMDtcblxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgaWQ6c3RyaW5nID0gKFwic2NlbmVcIiArIFNjZW5lLl9pZExlbisrKSApe1xuICAgICAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgICAgIHRoaXMuY2FtZXJhLmFkZFRvKHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdXBkYXRlKGRlbHRhVGltZTpudW1iZXIpOlNjZW5le1xuICAgICAgICAgICAgdGhpcy50aW1lck1hbmFnZXIudXBkYXRlKGRlbHRhVGltZSk7XG4gICAgICAgICAgICB0aGlzLnR3ZWVuTWFuYWdlci51cGRhdGUoZGVsdGFUaW1lKTtcbiAgICAgICAgICAgIHN1cGVyLnVwZGF0ZShkZWx0YVRpbWUpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBhZGRUbyhnYW1lOkdhbWV8Q29udGFpbmVyKTpTY2VuZSB7XG4gICAgICAgICAgICBpZihnYW1lIGluc3RhbmNlb2YgR2FtZSl7XG4gICAgICAgICAgICAgICAgPEdhbWU+Z2FtZS5hZGRTY2VuZSh0aGlzKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignU2NlbmVzIGNhbiBvbmx5IGJlIGFkZGVkIHRvIHRoZSBnYW1lJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgfVxufSIsIm1vZHVsZSBQSVhJIHtcbiAgICBleHBvcnQgY2xhc3MgSW5wdXRNYW5hZ2Vye1xuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGdhbWU6IEdhbWUpe1xuXG4gICAgICAgIH1cbiAgICB9XG59IiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vZGVmcy9waXhpLmpzLmQudHNcIiAvPlxubW9kdWxlIFBJWEkge1xuICAgIGV4cG9ydCBmdW5jdGlvbiBiaXRtYXBGb250UGFyc2VyVFhUKCk6RnVuY3Rpb257XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihyZXNvdXJjZTogbG9hZGVycy5SZXNvdXJjZSwgbmV4dDpGdW5jdGlvbik6dm9pZHtcblxuICAgICAgICAgICAgLy9za2lwIGlmIG5vIGRhdGEgb3IgaWYgbm90IHR4dFxuICAgICAgICAgICAgaWYoIXJlc291cmNlLmRhdGEgfHwgKHJlc291cmNlLnhoclR5cGUgIT09IFwidGV4dFwiICYmIHJlc291cmNlLnhoclR5cGUgIT09IFwiZG9jdW1lbnRcIikpe1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXh0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciB0ZXh0OnN0cmluZyA9IChyZXNvdXJjZS54aHJUeXBlID09PSBcInRleHRcIikgPyByZXNvdXJjZS5kYXRhIDogcmVzb3VyY2UueGhyLnJlc3BvbnNlVGV4dDtcblxuICAgICAgICAgICAgLy9za2lwIGlmIG5vdCBhIGJpdG1hcCBmb250IGRhdGFcbiAgICAgICAgICAgIGlmKCB0ZXh0LmluZGV4T2YoXCJwYWdlXCIpID09PSAtMSB8fFxuICAgICAgICAgICAgICAgIHRleHQuaW5kZXhPZihcImZhY2VcIikgPT09IC0xIHx8XG4gICAgICAgICAgICAgICAgdGV4dC5pbmRleE9mKFwiaW5mb1wiKSA9PT0gLTEgfHxcbiAgICAgICAgICAgICAgICB0ZXh0LmluZGV4T2YoXCJjaGFyXCIpID09PSAtMSApe1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5leHQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHVybDpzdHJpbmcgPSBkaXJuYW1lKHJlc291cmNlLnVybCk7XG4gICAgICAgICAgICBpZih1cmwgPT09IFwiLlwiKXtcbiAgICAgICAgICAgICAgICB1cmwgPSBcIlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZih0aGlzLmJhc2VVcmwgJiYgdXJsKXtcbiAgICAgICAgICAgICAgICBpZih0aGlzLmJhc2VVcmwuY2hhckF0KHRoaXMuYmFzZVVybC5sZW5ndGgtMSk9PT0gJy8nKXtcbiAgICAgICAgICAgICAgICAgICAgdXJsICs9ICcvJztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB1cmwucmVwbGFjZSh0aGlzLmJhc2VVcmwsICcnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYodXJsICYmIHVybC5jaGFyQXQodXJsLmxlbmd0aCAtIDEpICE9PSAnLycpe1xuICAgICAgICAgICAgICAgIHVybCArPSAnLyc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciB0ZXh0dXJlVXJsOnN0cmluZyA9IGdldFRleHR1cmVVcmwodXJsLCB0ZXh0KTtcbiAgICAgICAgICAgIGlmKHV0aWxzLlRleHR1cmVDYWNoZVt0ZXh0dXJlVXJsXSl7XG4gICAgICAgICAgICAgICAgcGFyc2UocmVzb3VyY2UsIHV0aWxzLlRleHR1cmVDYWNoZVt0ZXh0dXJlVXJsXSk7XG4gICAgICAgICAgICAgICAgbmV4dCgpO1xuICAgICAgICAgICAgfWVsc2V7XG5cbiAgICAgICAgICAgICAgICB2YXIgbG9hZE9wdGlvbnM6YW55ID0ge1xuICAgICAgICAgICAgICAgICAgICBjcm9zc09yaWdpbjogcmVzb3VyY2UuY3Jvc3NPcmlnaW4sXG4gICAgICAgICAgICAgICAgICAgIGxvYWRUeXBlOiBsb2FkZXJzLlJlc291cmNlLkxPQURfVFlQRS5JTUFHRVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICB0aGlzLmFkZChyZXNvdXJjZS5uYW1lICsgJ19pbWFnZScsIHRleHR1cmVVcmwsIGxvYWRPcHRpb25zLCBmdW5jdGlvbihyZXM6YW55KXtcbiAgICAgICAgICAgICAgICAgICAgcGFyc2UocmVzb3VyY2UsIHJlcy50ZXh0dXJlKTtcbiAgICAgICAgICAgICAgICAgICAgbmV4dCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgbmV4dCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFyc2UocmVzb3VyY2U6bG9hZGVycy5SZXNvdXJjZSwgdGV4dHVyZTpUZXh0dXJlKXtcbiAgICAgICAgdmFyIGN1cnJlbnRMaW5lOnN0cmluZywgYXR0cjphdHRyRGF0YSxcbiAgICAgICAgICAgIGRhdGE6Zm9udERhdGEgPSB7XG4gICAgICAgICAgICAgICAgY2hhcnMgOiB7fVxuICAgICAgICAgICAgfTtcblxuICAgICAgICB2YXIgdGV4dDpzdHJpbmcgPSAocmVzb3VyY2UueGhyVHlwZSA9PT0gXCJ0ZXh0XCIpID8gcmVzb3VyY2UuZGF0YSA6IHJlc291cmNlLnhoci5yZXNwb25zZVRleHQ7XG4gICAgICAgIHZhciBsaW5lczpzdHJpbmdbXSA9IHRleHQuc3BsaXQoJ1xcbicpO1xuXG4gICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgaWYobGluZXNbaV0uaW5kZXhPZihcImluZm9cIikgPT09IDApe1xuICAgICAgICAgICAgICAgIGN1cnJlbnRMaW5lID0gbGluZXNbaV0uc3Vic3RyaW5nKDUpO1xuICAgICAgICAgICAgICAgIGF0dHIgPSBnZXRBdHRyKGN1cnJlbnRMaW5lKTtcblxuICAgICAgICAgICAgICAgIGRhdGEuZm9udCA9IGF0dHIuZmFjZTtcbiAgICAgICAgICAgICAgICBkYXRhLnNpemUgPSBwYXJzZUludChhdHRyLnNpemUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihsaW5lc1tpXS5pbmRleE9mKCdjb21tb24gJykgPT09IDApe1xuICAgICAgICAgICAgICAgIGN1cnJlbnRMaW5lID0gbGluZXNbaV0uc3Vic3RyaW5nKDcpO1xuICAgICAgICAgICAgICAgIGF0dHIgPSBnZXRBdHRyKGN1cnJlbnRMaW5lKTtcbiAgICAgICAgICAgICAgICBkYXRhLmxpbmVIZWlnaHQgPSBwYXJzZUludChhdHRyLmxpbmVIZWlnaHQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihsaW5lc1tpXS5pbmRleE9mKFwiY2hhciBcIikgPT09IDApe1xuICAgICAgICAgICAgICAgIGN1cnJlbnRMaW5lID0gbGluZXNbaV0uc3Vic3RyaW5nKDUpO1xuICAgICAgICAgICAgICAgIGF0dHIgPSBnZXRBdHRyKGN1cnJlbnRMaW5lKTtcbiAgICAgICAgICAgICAgICB2YXIgY2hhckNvZGU6bnVtYmVyID0gcGFyc2VJbnQoYXR0ci5pZCk7XG5cbiAgICAgICAgICAgICAgICB2YXIgdGV4dHVyZVJlY3Q6UmVjdGFuZ2xlID0gbmV3IFJlY3RhbmdsZShcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VJbnQoYXR0ci54KSxcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VJbnQoYXR0ci55KSxcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VJbnQoYXR0ci53aWR0aCksXG4gICAgICAgICAgICAgICAgICAgIHBhcnNlSW50KGF0dHIuaGVpZ2h0KVxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICBkYXRhLmNoYXJzW2NoYXJDb2RlXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgeE9mZnNldDogcGFyc2VJbnQoYXR0ci54b2Zmc2V0KSxcbiAgICAgICAgICAgICAgICAgICAgeU9mZnNldDogcGFyc2VJbnQoYXR0ci55b2Zmc2V0KSxcbiAgICAgICAgICAgICAgICAgICAgeEFkdmFuY2U6IHBhcnNlSW50KGF0dHIueGFkdmFuY2UpLFxuICAgICAgICAgICAgICAgICAgICBrZXJuaW5nOiB7fSxcbiAgICAgICAgICAgICAgICAgICAgdGV4dHVyZTogbmV3IFRleHR1cmUodGV4dHVyZS5iYXNlVGV4dHVyZSwgdGV4dHVyZVJlY3QpXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYobGluZXNbaV0uaW5kZXhPZigna2VybmluZyAnKSA9PT0gMCl7XG4gICAgICAgICAgICAgICAgY3VycmVudExpbmUgPSBsaW5lc1tpXS5zdWJzdHJpbmcoOCk7XG4gICAgICAgICAgICAgICAgYXR0ciA9IGdldEF0dHIoY3VycmVudExpbmUpO1xuXG4gICAgICAgICAgICAgICAgdmFyIGZpcnN0ID0gcGFyc2VJbnQoYXR0ci5maXJzdCk7XG4gICAgICAgICAgICAgICAgdmFyIHNlY29uZCA9IHBhcnNlSW50KGF0dHIuc2Vjb25kKTtcblxuICAgICAgICAgICAgICAgIGRhdGEuY2hhcnNbc2Vjb25kXS5rZXJuaW5nW2ZpcnN0XSA9IHBhcnNlSW50KGF0dHIuYW1vdW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJlc291cmNlLmJpdG1hcEZvbnQgPSBkYXRhO1xuICAgICAgICBleHRyYXMuQml0bWFwVGV4dC5mb250c1tkYXRhLmZvbnRdID0gZGF0YTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkaXJuYW1lKHBhdGg6c3RyaW5nKTpzdHJpbmd7XG4gICAgICAgIHJldHVybiBwYXRoLnJlcGxhY2UoL1xcXFwvZywnLycpLnJlcGxhY2UoL1xcL1teXFwvXSokLywgJycpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFRleHR1cmVVcmwodXJsOnN0cmluZywgZGF0YTpzdHJpbmcpOnN0cmluZ3tcbiAgICAgICAgdmFyIHRleHR1cmVVcmw6c3RyaW5nO1xuICAgICAgICB2YXIgbGluZXM6c3RyaW5nW10gPSBkYXRhLnNwbGl0KCdcXG4nKTtcblxuICAgICAgICBmb3IodmFyIGk6bnVtYmVyID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIGlmKGxpbmVzW2ldLmluZGV4T2YoXCJwYWdlXCIpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRMaW5lOnN0cmluZyA9IGxpbmVzW2ldLnN1YnN0cmluZyg1KTtcbiAgICAgICAgICAgICAgICB2YXIgZmlsZTpzdHJpbmcgPSAoY3VycmVudExpbmUuc3Vic3RyaW5nKGN1cnJlbnRMaW5lLmluZGV4T2YoJ2ZpbGU9JykpKS5zcGxpdCgnPScpWzFdO1xuICAgICAgICAgICAgICAgIHRleHR1cmVVcmwgPSB1cmwgKyBmaWxlLnN1YnN0cigxLCBmaWxlLmxlbmd0aC0yKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0ZXh0dXJlVXJsO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEF0dHIobGluZTpzdHJpbmcpOmF0dHJEYXRhe1xuICAgICAgICB2YXIgcmVnZXg6UmVnRXhwID0gL1wiKFxcdypcXGQqXFxzKigtfF8pKikqXCIvZyxcbiAgICAgICAgICAgIGF0dHI6c3RyaW5nW10gPSBsaW5lLnNwbGl0KC9cXHMrL2cpLFxuICAgICAgICAgICAgZGF0YTphbnkgPSB7fTtcblxuICAgICAgICBmb3IodmFyIGk6bnVtYmVyID0gMDsgaSA8IGF0dHIubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgdmFyIGQ6c3RyaW5nW10gPSBhdHRyW2ldLnNwbGl0KCc9Jyk7XG4gICAgICAgICAgICB2YXIgbTpSZWdFeHBNYXRjaEFycmF5ID0gZFsxXS5tYXRjaChyZWdleCk7XG4gICAgICAgICAgICBpZihtICYmIG0ubGVuZ3RoID49IDEpe1xuICAgICAgICAgICAgICAgIGRbMV0gPSBkWzFdLnN1YnN0cigxLCBkWzFdLmxlbmd0aC0yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRhdGFbZFswXV0gPSBkWzFdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIDxhdHRyRGF0YT5kYXRhO1xuICAgIH1cblxuICAgIGludGVyZmFjZSBmb250RGF0YSB7XG4gICAgICAgIGNoYXJzPyA6IGFueTtcbiAgICAgICAgZm9udD8gOiBzdHJpbmc7XG4gICAgICAgIHNpemU/IDogbnVtYmVyO1xuICAgICAgICBsaW5lSGVpZ2h0PyA6IG51bWJlcjtcbiAgICB9XG5cbiAgICBpbnRlcmZhY2UgYXR0ckRhdGEge1xuICAgICAgICBmYWNlPyA6IHN0cmluZztcbiAgICAgICAgc2l6ZT8gOiBzdHJpbmc7XG4gICAgICAgIGxpbmVIZWlnaHQ/IDogc3RyaW5nO1xuICAgICAgICBpZD8gOiBzdHJpbmc7XG4gICAgICAgIHg/IDogc3RyaW5nO1xuICAgICAgICB5PyA6IHN0cmluZztcbiAgICAgICAgd2lkdGg/IDogc3RyaW5nO1xuICAgICAgICBoZWlnaHQ/IDogc3RyaW5nO1xuICAgICAgICB4b2Zmc2V0PyA6IHN0cmluZztcbiAgICAgICAgeW9mZnNldD8gOiBzdHJpbmc7XG4gICAgICAgIHhhZHZhbmNlPyA6IHN0cmluZztcbiAgICAgICAgZmlyc3Q/IDogc3RyaW5nO1xuICAgICAgICBzZWNvbmQ/IDogc3RyaW5nO1xuICAgICAgICBhbW91bnQ/IDogc3RyaW5nO1xuICAgIH1cbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9hdWRpby9BdWRpb01hbmFnZXIudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vQXVkaW8vQXVkaW8udHNcIiAvPlxubW9kdWxlIFBJWEkge1xuICAgIHZhciBfYWxsb3dlZEV4dDpzdHJpbmdbXSA9IFtcIm00YVwiLCBcIm9nZ1wiLCBcIm1wM1wiLCBcIndhdlwiXTtcblxuICAgIGV4cG9ydCBmdW5jdGlvbiBhdWRpb1BhcnNlcigpOkZ1bmN0aW9uIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHJlc291cmNlOmxvYWRlcnMuUmVzb3VyY2UsIG5leHQ6RnVuY3Rpb24pOnZvaWR7XG4gICAgICAgICAgICBpZighRGV2aWNlLmlzQXVkaW9TdXBwb3J0ZWQgfHwgIXJlc291cmNlLmRhdGEpe1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXh0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBleHQ6c3RyaW5nID0gX2dldEV4dChyZXNvdXJjZS51cmwpO1xuXG4gICAgICAgICAgICBpZihfYWxsb3dlZEV4dC5pbmRleE9mKGV4dCkgPT09IC0xKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV4dCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZighX2NhblBsYXkoZXh0KSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5leHQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIG5hbWU6c3RyaW5nID0gcmVzb3VyY2UubmFtZSB8fCByZXNvdXJjZS51cmw7XG4gICAgICAgICAgICBpZih1dGlscy5fYXVkaW9UeXBlU2VsZWN0ZWQgPT09IEFVRElPX1RZUEUuV0VCQVVESU8pe1xuICAgICAgICAgICAgICAgIERldmljZS5nbG9iYWxXZWJBdWRpb0NvbnRleHQuZGVjb2RlQXVkaW9EYXRhKHJlc291cmNlLmRhdGEsIF9hZGRUb0NhY2hlLmJpbmQodGhpcywgbmV4dCwgbmFtZSkpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9hZGRUb0NhY2hlKG5leHQsIG5hbWUsIHJlc291cmNlLmRhdGEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBleHBvcnQgZnVuY3Rpb24gYXVkaW9QYXJzZXJVcmwocmVzb3VyY2VVcmw6c3RyaW5nW10pOnN0cmluZ3tcbiAgICAgICAgdmFyIGV4dDpzdHJpbmc7XG4gICAgICAgIHZhciB1cmw6c3RyaW5nO1xuICAgICAgICBmb3IodmFyIGk6bnVtYmVyID0gMDsgaSA8IHJlc291cmNlVXJsLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIGV4dCA9IF9nZXRFeHQocmVzb3VyY2VVcmxbaV0pO1xuXG4gICAgICAgICAgICBpZihfYWxsb3dlZEV4dC5pbmRleE9mKGV4dCkgPT09IC0xKXtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoX2NhblBsYXkoZXh0KSl7XG4gICAgICAgICAgICAgICAgdXJsID0gcmVzb3VyY2VVcmxbaV07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdXJsO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9hZGRUb0NhY2hlKG5leHQ6RnVuY3Rpb24sIG5hbWU6c3RyaW5nLCBkYXRhOmFueSl7XG4gICAgICAgIHV0aWxzLkF1ZGlvQ2FjaGVbbmFtZV0gPSBuZXcgQXVkaW8oZGF0YSwgbmFtZSk7XG4gICAgICAgIHJldHVybiBuZXh0KCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2dldEV4dCh1cmw6c3RyaW5nKTpzdHJpbmd7XG4gICAgICAgIHJldHVybiB1cmwuc3BsaXQoJz8nKS5zaGlmdCgpLnNwbGl0KCcuJykucG9wKCkudG9Mb3dlckNhc2UoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfY2FuUGxheShleHQ6c3RyaW5nKTpib29sZWFue1xuICAgICAgICB2YXIgZGV2aWNlQ2FuUGxheTpib29sZWFuID0gZmFsc2U7XG4gICAgICAgIHN3aXRjaChleHQpe1xuICAgICAgICAgICAgY2FzZSBcIm00YVwiOmRldmljZUNhblBsYXkgPSBEZXZpY2UuaXNNNGFTdXBwb3J0ZWQ7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIm1wM1wiOmRldmljZUNhblBsYXkgPSBEZXZpY2UuaXNNcDNTdXBwb3J0ZWQ7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIm9nZ1wiOmRldmljZUNhblBsYXkgPSBEZXZpY2UuaXNPZ2dTdXBwb3J0ZWQ7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIndhdlwiOmRldmljZUNhblBsYXkgPSBEZXZpY2UuaXNXYXZTdXBwb3J0ZWQ7IGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZXZpY2VDYW5QbGF5O1xuICAgIH1cbn1cbiIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2RlZnMvcGl4aS5qcy5kLnRzXCIgLz5cbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4vY29uc3QudHNcIiAvPlxubW9kdWxlIFBJWEkge1xuICAgIGV4cG9ydCBtb2R1bGUgdXRpbHMge1xuICAgICAgICBleHBvcnQgdmFyIF9hdWRpb1R5cGVTZWxlY3RlZDpudW1iZXIgPSBBVURJT19UWVBFLldFQkFVRElPO1xuICAgICAgICBleHBvcnQgdmFyIEF1ZGlvQ2FjaGU6YW55ID0ge307XG4gICAgfVxufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2RlZnMvcGl4aS5qcy5kLnRzXCIgLz5cbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL2NvcmUvY29uc3QudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi9iaXRtYXBGb250UGFyc2VyVHh0LnRzXCIgLz5cbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4vYXVkaW9QYXJzZXIudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vY29yZS9VdGlscy50c1wiIC8+XG5tb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IG1vZHVsZSBsb2FkZXJze1xuICAgICAgICBMb2FkZXIuYWRkUGl4aU1pZGRsZXdhcmUoYml0bWFwRm9udFBhcnNlclRYVCk7XG4gICAgICAgIExvYWRlci5hZGRQaXhpTWlkZGxld2FyZShhdWRpb1BhcnNlcik7XG5cbiAgICAgICAgY2xhc3MgVHVyYm9Mb2FkZXIgZXh0ZW5kcyBMb2FkZXIge1xuICAgICAgICAgICAgY29uc3RydWN0b3IoYmFzZVVybDogc3RyaW5nLCBhc3NldENvbmN1cnJlbmN5OiBudW1iZXIpe1xuICAgICAgICAgICAgICAgIHN1cGVyKGJhc2VVcmwsIGFzc2V0Q29uY3VycmVuY3kpO1xuICAgICAgICAgICAgICAgIGlmKERldmljZS5pc0F1ZGlvU3VwcG9ydGVkKXtcbiAgICAgICAgICAgICAgICAgICAgX2NoZWNrQXVkaW9UeXBlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhZGQobmFtZTphbnksIHVybD86YW55ICxvcHRpb25zPzphbnksIGNiPzphbnkpOkxvYWRlcntcbiAgICAgICAgICAgICAgICBpZih0eXBlb2YgbmFtZSA9PT0gJ29iamVjdCcpe1xuICAgICAgICAgICAgICAgICAgICBpZihPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobmFtZS51cmwpID09PSBcIltvYmplY3QgQXJyYXldXCIpe1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZS51cmwgPSBhdWRpb1BhcnNlclVybChuYW1lLnVybCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZihPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodXJsKSA9PT0gXCJbb2JqZWN0IEFycmF5XVwiKXtcbiAgICAgICAgICAgICAgICAgICAgdXJsID0gYXVkaW9QYXJzZXJVcmwodXJsKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gc3VwZXIuYWRkKG5hbWUsIHVybCwgb3B0aW9ucywgY2IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbG9hZGVycy5Mb2FkZXIgPSBUdXJib0xvYWRlcjtcblxuXG4gICAgICAgIGZ1bmN0aW9uIF9jaGVja0F1ZGlvVHlwZSgpOnZvaWR7XG4gICAgICAgICAgICBpZihEZXZpY2UuaXNNcDNTdXBwb3J0ZWQpX3NldEF1ZGlvRXh0KFwibXAzXCIpO1xuICAgICAgICAgICAgaWYoRGV2aWNlLmlzT2dnU3VwcG9ydGVkKV9zZXRBdWRpb0V4dChcIm9nZ1wiKTtcbiAgICAgICAgICAgIGlmKERldmljZS5pc1dhdlN1cHBvcnRlZClfc2V0QXVkaW9FeHQoXCJ3YXZcIik7XG4gICAgICAgICAgICBpZihEZXZpY2UuaXNNNGFTdXBwb3J0ZWQpX3NldEF1ZGlvRXh0KFwibTRhXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gX3NldEF1ZGlvRXh0KGV4dDpzdHJpbmcpOnZvaWQge1xuICAgICAgICAgICAgaWYodXRpbHMuX2F1ZGlvVHlwZVNlbGVjdGVkID09PSBBVURJT19UWVBFLldFQkFVRElPKXtcbiAgICAgICAgICAgICAgICBSZXNvdXJjZS5zZXRFeHRlbnNpb25YaHJUeXBlKGV4dCwgUmVzb3VyY2UuWEhSX1JFU1BPTlNFX1RZUEUuQlVGRkVSKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIFJlc291cmNlLnNldEV4dGVuc2lvbkxvYWRUeXBlKGV4dCwgUmVzb3VyY2UuTE9BRF9UWVBFLkFVRElPKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0iLCJtb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IGNsYXNzIERhdGFNYW5hZ2Vye1xuICAgICAgICBwcml2YXRlIF9kYXRhOmFueTtcblxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGlkOnN0cmluZywgcHVibGljIHVzZVBlcnNpc3RhbnREYXRhOmJvb2xlYW4gPSBmYWxzZSl7XG4gICAgICAgICAgICB0aGlzLmxvYWQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxvYWQoKTpEYXRhTWFuYWdlcntcbiAgICAgICAgICAgIHRoaXMuX2RhdGEgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMuaWQpKSB8fCB7fTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgc2F2ZSgpOkRhdGFNYW5hZ2Vye1xuICAgICAgICAgICAgaWYodGhpcy51c2VQZXJzaXN0YW50RGF0YSl7XG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5pZCwgSlNPTi5zdHJpbmdpZnkodGhpcy5fZGF0YSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICByZXNldCgpOkRhdGFNYW5hZ2Vye1xuICAgICAgICAgICAgdGhpcy5fZGF0YSA9IHt9O1xuICAgICAgICAgICAgdGhpcy5zYXZlKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHNldChrZXk6c3RyaW5nIHwgT2JqZWN0LCB2YWx1ZT86YW55KTpEYXRhTWFuYWdlcntcbiAgICAgICAgICAgIGlmKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChrZXkpID09PSBcIltvYmplY3QgT2JqZWN0XVwiKXtcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMuX2RhdGEsIGtleSk7XG4gICAgICAgICAgICB9ZWxzZSBpZih0eXBlb2Yga2V5ID09PSBcInN0cmluZ1wiKXtcbiAgICAgICAgICAgICAgICB0aGlzLl9kYXRhW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5zYXZlKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGdldChrZXk/OnN0cmluZyk6YW55e1xuICAgICAgICAgICAgaWYoIWtleSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9kYXRhW2tleV07XG4gICAgICAgIH1cblxuICAgICAgICBkZWwoa2V5OnN0cmluZyk6RGF0YU1hbmFnZXJ7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fZGF0YVtrZXldO1xuICAgICAgICAgICAgdGhpcy5zYXZlKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgfVxufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2RlZnMvcGl4aS5qcy5kLnRzXCIgLz5cbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4vY29uc3QudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi9EZXZpY2UudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vZGlzcGxheS9TY2VuZS50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9hdWRpby9BdWRpb01hbmFnZXIudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vaW5wdXQvSW5wdXRNYW5hZ2VyLnRzXCIgLz5cbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL2xvYWRlci9Mb2FkZXIudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi9EYXRhTWFuYWdlci50c1wiIC8+XG5tb2R1bGUgUElYSSB7XG4gICAgdmFyIGxhc3Q6bnVtYmVyID0gMDtcbiAgICB2YXIgbWF4RnJhbWVNUyA9IDAuMzU7XG5cbiAgICB2YXIgZGVmYXVsdEdhbWVDb25maWcgOiBHYW1lQ29uZmlnID0ge1xuICAgICAgICBpZDogXCJwaXhpLmRlZmF1bHQuaWRcIixcbiAgICAgICAgd2lkdGg6ODAwLFxuICAgICAgICBoZWlnaHQ6NjAwLFxuICAgICAgICB1c2VXZWJBdWRpbzogdHJ1ZSxcbiAgICAgICAgdXNlUGVyc2lzdGFudERhdGE6IGZhbHNlLFxuICAgICAgICBnYW1lU2NhbGVUeXBlOiBHQU1FX1NDQUxFX1RZUEUuTk9ORSxcbiAgICAgICAgc3RvcEF0TG9zdEZvY3VzOiB0cnVlLFxuICAgICAgICBhc3NldHNVcmw6IFwiLi9cIixcbiAgICAgICAgbG9hZGVyQ29uY3VycmVuY3k6IDEwLFxuICAgICAgICBhdWRpb0NoYW5uZWxMaW5lczogMTAsXG4gICAgICAgIHNvdW5kQ2hhbm5lbExpbmVzOiAxMCxcbiAgICAgICAgbXVzaWNDaGFubmVsTGluZXM6IDEsXG4gICAgICAgIHpJbmRleEVuYWJsZWQ6IHpJbmRleEVuYWJsZWRcbiAgICB9O1xuXG4gICAgZXhwb3J0IGNsYXNzIEdhbWUge1xuICAgICAgICBpZDpzdHJpbmc7XG4gICAgICAgIHJhZjphbnk7XG5cbiAgICAgICAgcHJpdmF0ZSBfc2NlbmVzOlNjZW5lW10gPSBbXTtcbiAgICAgICAgc2NlbmU6U2NlbmU7XG5cbiAgICAgICAgYXVkaW86QXVkaW9NYW5hZ2VyO1xuICAgICAgICBpbnB1dDpJbnB1dE1hbmFnZXI7XG4gICAgICAgIGRhdGE6RGF0YU1hbmFnZXI7XG4gICAgICAgIGxvYWRlcjpsb2FkZXJzLkxvYWRlcjtcblxuICAgICAgICByZW5kZXJlcjpXZWJHTFJlbmRlcmVyIHwgQ2FudmFzUmVuZGVyZXI7XG4gICAgICAgIGNhbnZhczpIVE1MQ2FudmFzRWxlbWVudDtcblxuICAgICAgICBkZWx0YTpudW1iZXIgPSAwO1xuICAgICAgICB0aW1lOm51bWJlciA9IDA7XG4gICAgICAgIGxhc3RUaW1lOm51bWJlciA9IDA7XG5cbiAgICAgICAgaXNXZWJHTDpib29sZWFuO1xuICAgICAgICBpc1dlYkF1ZGlvOmJvb2xlYW47XG5cbiAgICAgICAgcHJpdmF0ZSBfcmVzaXplTGlzdGVuZXI6YW55O1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGNvbmZpZz86R2FtZUNvbmZpZywgcmVuZGVyZXJPcHRpb25zPzpSZW5kZXJlck9wdGlvbnMpIHtcbiAgICAgICAgICAgIGNvbmZpZyA9ICg8T2JqZWN0Pk9iamVjdCkuYXNzaWduKGRlZmF1bHRHYW1lQ29uZmlnLCBjb25maWcpO1xuICAgICAgICAgICAgdGhpcy5pZCA9IGNvbmZpZy5pZDtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZXIgPSBhdXRvRGV0ZWN0UmVuZGVyZXIoY29uZmlnLndpZHRoLCBjb25maWcuaGVpZ2h0LCByZW5kZXJlck9wdGlvbnMpO1xuICAgICAgICAgICAgdGhpcy5jYW52YXMgPSB0aGlzLnJlbmRlcmVyLnZpZXc7XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMpO1xuXG4gICAgICAgICAgICB0aGlzLmlzV2ViR0wgPSAodGhpcy5yZW5kZXJlci50eXBlID09PSBSRU5ERVJFUl9UWVBFLldFQkdMKTtcbiAgICAgICAgICAgIHRoaXMuaXNXZWJBdWRpbyA9IChEZXZpY2UuaXNBdWRpb1N1cHBvcnRlZCYmRGV2aWNlLmlzV2ViQXVkaW9TdXBwb3J0ZWQmJmNvbmZpZy51c2VXZWJBdWRpbyk7XG4gICAgICAgICAgICB1dGlscy5fYXVkaW9UeXBlU2VsZWN0ZWQgPSB0aGlzLmlzV2ViQXVkaW8gPyBBVURJT19UWVBFLldFQkFVRElPIDogQVVESU9fVFlQRS5IVE1MQVVESU87XG4gICAgICAgICAgICB6SW5kZXhFbmFibGVkID0gY29uZmlnLnpJbmRleEVuYWJsZWQ7XG5cbiAgICAgICAgICAgIHRoaXMuaW5wdXQgPSBuZXcgSW5wdXRNYW5hZ2VyKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5hdWRpbyA9IG5ldyBBdWRpb01hbmFnZXIoY29uZmlnLmF1ZGlvQ2hhbm5lbExpbmVzLCBjb25maWcuc291bmRDaGFubmVsTGluZXMsIGNvbmZpZy5tdXNpY0NoYW5uZWxMaW5lcyk7XG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBuZXcgRGF0YU1hbmFnZXIodGhpcy5pZCwgY29uZmlnLnVzZVBlcnNpc3RhbnREYXRhKTtcbiAgICAgICAgICAgIHRoaXMubG9hZGVyID0gbmV3IGxvYWRlcnMuTG9hZGVyKGNvbmZpZy5hc3NldHNVcmwsIGNvbmZpZy5sb2FkZXJDb25jdXJyZW5jeSk7XG5cbiAgICAgICAgICAgIHZhciBpbml0aWFsU2NlbmU6U2NlbmUgPSBuZXcgU2NlbmUoJ2luaXRpYWwnKS5hZGRUbyh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuc2V0U2NlbmUoaW5pdGlhbFNjZW5lKTtcblxuICAgICAgICAgICAgaWYoY29uZmlnLmdhbWVTY2FsZVR5cGUgIT09IEdBTUVfU0NBTEVfVFlQRS5OT05FKXtcbiAgICAgICAgICAgICAgICB0aGlzLmF1dG9SZXNpemUoY29uZmlnLmdhbWVTY2FsZVR5cGUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihjb25maWcuc3RvcEF0TG9zdEZvY3VzKXtcbiAgICAgICAgICAgICAgICB0aGlzLmVuYWJsZVN0b3BBdExvc3RGb2N1cygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfYW5pbWF0ZSgpOnZvaWQge1xuICAgICAgICAgICAgdGhpcy5yYWYgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuX2FuaW1hdGUuYmluZCh0aGlzKSk7XG5cbiAgICAgICAgICAgIGlmKHRoaXMuc2NlbmUpIHtcbiAgICAgICAgICAgICAgICB2YXIgbm93Om51bWJlciA9IERhdGUubm93KCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnRpbWUgKz0gTWF0aC5taW4oKG5vdyAtIGxhc3QpIC8gMTAwMCwgbWF4RnJhbWVNUyk7XG4gICAgICAgICAgICAgICAgdGhpcy5kZWx0YSA9IHRoaXMudGltZSAtIHRoaXMubGFzdFRpbWU7XG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0VGltZSA9IHRoaXMudGltZTtcblxuICAgICAgICAgICAgICAgIGxhc3QgPSBub3c7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSh0aGlzLmRlbHRhKTtcblxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIucmVuZGVyKHRoaXMuc2NlbmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdXBkYXRlKGRlbHRhVGltZTpudW1iZXIpOkdhbWUge1xuICAgICAgICAgICAgdGhpcy5zY2VuZS51cGRhdGUodGhpcy5kZWx0YSk7XG5cbiAgICAgICAgICAgIC8vY2xlYW4ga2lsbGVkIG9iamVjdHNcbiAgICAgICAgICAgIHZhciBsZW46bnVtYmVyID0gQ29udGFpbmVyLl9raWxsZWRPYmplY3RzLmxlbmd0aDtcbiAgICAgICAgICAgIGlmIChsZW4pIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpOm51bWJlciA9IDA7IGkgPCBsZW47IGkrKykgQ29udGFpbmVyLl9raWxsZWRPYmplY3RzW2ldLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIENvbnRhaW5lci5fa2lsbGVkT2JqZWN0cy5sZW5ndGggPSAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXJ0KCk6R2FtZSB7XG4gICAgICAgICAgICBsYXN0ID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICAgIHRoaXMuX2FuaW1hdGUoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RvcCgpOkdhbWUge1xuICAgICAgICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMucmFmKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgZW5hYmxlU3RvcEF0TG9zdEZvY3VzKHN0YXRlOmJvb2xlYW4gPSB0cnVlKTpHYW1le1xuICAgICAgICAgICAgaWYoc3RhdGUpe1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoRGV2aWNlLmdldFZpc2liaWxpdHlDaGFuZ2VFdmVudCgpLCB0aGlzLl9vblZpc2liaWxpdHlDaGFuZ2UuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKERldmljZS5nZXRWaXNpYmlsaXR5Q2hhbmdlRXZlbnQoKSwgdGhpcy5fb25WaXNpYmlsaXR5Q2hhbmdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgZGlzYWJsZVN0b3BBdExvc3RGb2N1cygpOkdhbWV7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lbmFibGVTdG9wQXRMb3N0Rm9jdXMoZmFsc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfb25WaXNpYmlsaXR5Q2hhbmdlKCl7XG4gICAgICAgICAgICB2YXIgaXNIaWRlID0gISEoZG9jdW1lbnQuaGlkZGVuIHx8IGRvY3VtZW50LndlYmtpdEhpZGRlbiB8fCBkb2N1bWVudC5tb3pIaWRkZW4gfHwgZG9jdW1lbnQubXNIaWRkZW4pO1xuICAgICAgICAgICAgaWYoaXNIaWRlKXtcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5vbkxvc3RGb2N1cyhpc0hpZGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgb25Mb3N0Rm9jdXMoaXNIaWRlOmJvb2xlYW4pOkdhbWV7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHNldFNjZW5lKHNjZW5lOlNjZW5lIHwgc3RyaW5nKTpHYW1lIHtcbiAgICAgICAgICAgIGlmKCEoc2NlbmUgaW5zdGFuY2VvZiBTY2VuZSkpe1xuICAgICAgICAgICAgICAgIHNjZW5lID0gdGhpcy5nZXRTY2VuZSg8c3RyaW5nPnNjZW5lKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5zY2VuZSA9IDxTY2VuZT5zY2VuZTtcbiAgICAgICAgICAgIHRoaXMuc2NlbmUucG9zaXRpb24uc2V0KHRoaXMud2lkdGgvMiwgdGhpcy5oZWlnaHQvMik7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGdldFNjZW5lKGlkOnN0cmluZyk6U2NlbmV7XG4gICAgICAgICAgICB2YXIgc2NlbmU6U2NlbmUgPSBudWxsO1xuICAgICAgICAgICAgZm9yKHZhciBpOm51bWJlciA9IDA7IGkgPCB0aGlzLl9zY2VuZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuX3NjZW5lc1tpXS5pZCA9PT0gaWQpe1xuICAgICAgICAgICAgICAgICAgICBzY2VuZSA9IHRoaXMuX3NjZW5lc1tpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBzY2VuZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNyZWF0ZVNjZW5lKGlkPzpzdHJpbmcpOlNjZW5lIHtcbiAgICAgICAgICAgIHJldHVybiAobmV3IFNjZW5lKGlkKSkuYWRkVG8odGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZW1vdmVTY2VuZShzY2VuZTpzdHJpbmcgfCBTY2VuZSk6R2FtZXtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBzY2VuZSA9PT0gXCJzdHJpbmdcIil7XG4gICAgICAgICAgICAgICAgc2NlbmUgPSB0aGlzLmdldFNjZW5lKDxzdHJpbmc+c2NlbmUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgaW5kZXg6bnVtYmVyID0gdGhpcy5fc2NlbmVzLmluZGV4T2YoPFNjZW5lPnNjZW5lKTtcbiAgICAgICAgICAgIGlmKGluZGV4ICE9PSAtMSl7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2NlbmVzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgYWRkU2NlbmUoc2NlbmU6U2NlbmUpOkdhbWUge1xuICAgICAgICAgICAgdGhpcy5fc2NlbmVzLnB1c2goc2NlbmUpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICByZW1vdmVBbGxTY2VuZXMoKTpHYW1le1xuICAgICAgICAgICAgdGhpcy5fc2NlbmVzLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICB0aGlzLnNjZW5lID0gbnVsbDtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzaXplKHdpZHRoOm51bWJlciwgaGVpZ2h0Om51bWJlciwgcmVuZGVyZXI6Ym9vbGVhbiA9IGZhbHNlKTpHYW1le1xuICAgICAgICAgICAgaWYocmVuZGVyZXIpe1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIucmVzaXplKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5zdHlsZS53aWR0aCA9IHdpZHRoICsgXCJweFwiO1xuICAgICAgICAgICAgdGhpcy5jYW52YXMuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgXCJweFwiO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGF1dG9SZXNpemUobW9kZTpudW1iZXIpOkdhbWUge1xuICAgICAgICAgICAgaWYodGhpcy5fcmVzaXplTGlzdGVuZXIpe1xuICAgICAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl9yZXNpemVMaXN0ZW5lcik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKG1vZGUgPT09IEdBTUVfU0NBTEVfVFlQRS5OT05FKXJldHVybjtcblxuICAgICAgICAgICAgc3dpdGNoKG1vZGUpe1xuICAgICAgICAgICAgICAgIGNhc2UgR0FNRV9TQ0FMRV9UWVBFLkFTUEVDVF9GSVQ6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Jlc2l6ZUxpc3RlbmVyID0gdGhpcy5fcmVzaXplTW9kZUFzcGVjdEZpdDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBHQU1FX1NDQUxFX1RZUEUuQVNQRUNUX0ZJTEw6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Jlc2l6ZUxpc3RlbmVyID0gdGhpcy5fcmVzaXplTW9kZUFzcGVjdEZpbGw7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgR0FNRV9TQ0FMRV9UWVBFLkZJTEw6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Jlc2l6ZUxpc3RlbmVyID0gdGhpcy5fcmVzaXplTW9kZUZpbGw7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5fcmVzaXplTGlzdGVuZXIuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB0aGlzLl9yZXNpemVMaXN0ZW5lcigpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9yZXNpemVNb2RlQXNwZWN0Rml0KCk6dm9pZHtcbiAgICAgICAgICAgIHZhciB3dzpudW1iZXIgPSBwYXJzZUludCh0aGlzLmNhbnZhcy5zdHlsZS53aWR0aCwgMTApIHx8IHRoaXMuY2FudmFzLndpZHRoO1xuICAgICAgICAgICAgdmFyIGhoOm51bWJlciA9IHBhcnNlSW50KHRoaXMuY2FudmFzLnN0eWxlLmhlaWdodCwgMTApIHx8IHRoaXMuY2FudmFzLmhlaWdodDtcbiAgICAgICAgICAgIGlmKHdpbmRvdy5pbm5lcldpZHRoICE9PSB3dyB8fCB3aW5kb3cuaW5uZXJIZWlnaHQgIT09IGhoKXtcbiAgICAgICAgICAgICAgICB2YXIgc2NhbGU6bnVtYmVyID0gTWF0aC5taW4od2luZG93LmlubmVyV2lkdGgvdGhpcy53aWR0aCwgd2luZG93LmlubmVySGVpZ2h0L3RoaXMuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc2l6ZSh0aGlzLndpZHRoKnNjYWxlLCB0aGlzLmhlaWdodCpzY2FsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9yZXNpemVNb2RlQXNwZWN0RmlsbCgpOnZvaWR7XG4gICAgICAgICAgICB2YXIgd3c6bnVtYmVyID0gcGFyc2VJbnQodGhpcy5jYW52YXMuc3R5bGUud2lkdGgsIDEwKSB8fCB0aGlzLmNhbnZhcy53aWR0aDtcbiAgICAgICAgICAgIHZhciBoaDpudW1iZXIgPSBwYXJzZUludCh0aGlzLmNhbnZhcy5zdHlsZS5oZWlnaHQsIDEwKSB8fCB0aGlzLmNhbnZhcy5oZWlnaHQ7XG4gICAgICAgICAgICBpZih3aW5kb3cuaW5uZXJXaWR0aCAhPT0gd3cgfHwgd2luZG93LmlubmVySGVpZ2h0ICE9PSBoaCl7XG4gICAgICAgICAgICAgICAgdmFyIHNjYWxlOm51bWJlciA9IE1hdGgubWF4KHdpbmRvdy5pbm5lcldpZHRoL3RoaXMud2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodC90aGlzLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgdmFyIHdpZHRoOm51bWJlciA9IHRoaXMud2lkdGgqc2NhbGU7XG4gICAgICAgICAgICAgICAgdmFyIGhlaWdodDpudW1iZXIgPSB0aGlzLmhlaWdodCpzY2FsZTtcblxuICAgICAgICAgICAgICAgIHZhciB0b3BNYXJnaW46bnVtYmVyID0gKHdpbmRvdy5pbm5lckhlaWdodC1oZWlnaHQpLzI7XG4gICAgICAgICAgICAgICAgdmFyIGxlZnRNYXJnaW46bnVtYmVyID0gKHdpbmRvdy5pbm5lcldpZHRoLXdpZHRoKS8yO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5yZXNpemUod2lkdGgsIGhlaWdodCk7XG5cbiAgICAgICAgICAgICAgICB2YXIgc3R5bGU6YW55ID0gPGFueT50aGlzLmNhbnZhcy5zdHlsZTtcbiAgICAgICAgICAgICAgICBzdHlsZVsnbWFyZ2luLXRvcCddID0gdG9wTWFyZ2luICsgXCJweFwiO1xuICAgICAgICAgICAgICAgIHN0eWxlWydtYXJnaW4tbGVmdCddID0gbGVmdE1hcmdpbiArIFwicHhcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX3Jlc2l6ZU1vZGVGaWxsKCk6dm9pZHtcbiAgICAgICAgICAgIHZhciB3dzpudW1iZXIgPSBwYXJzZUludCh0aGlzLmNhbnZhcy5zdHlsZS53aWR0aCwgMTApIHx8IHRoaXMuY2FudmFzLndpZHRoO1xuICAgICAgICAgICAgdmFyIGhoOm51bWJlciA9IHBhcnNlSW50KHRoaXMuY2FudmFzLnN0eWxlLmhlaWdodCwgMTApIHx8IHRoaXMuY2FudmFzLmhlaWdodDtcbiAgICAgICAgICAgIGlmKHdpbmRvdy5pbm5lcldpZHRoICE9PSB3dyB8fCB3aW5kb3cuaW5uZXJIZWlnaHQgIT09IGhoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgd2lkdGgoKTpudW1iZXIge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyZXIud2lkdGg7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgaGVpZ2h0KCk6bnVtYmVyIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbmRlcmVyLmhlaWdodDtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBHYW1lQ29uZmlnIHtcbiAgICAgICAgaWQ/OnN0cmluZztcbiAgICAgICAgd2lkdGg/Om51bWJlcjtcbiAgICAgICAgaGVpZ2h0PzpudW1iZXI7XG4gICAgICAgIHVzZVdlYkF1ZGlvPzpib29sZWFuO1xuICAgICAgICB1c2VQZXJzaXN0YW50RGF0YT86Ym9vbGVhbjtcbiAgICAgICAgZ2FtZVNjYWxlVHlwZT86bnVtYmVyO1xuICAgICAgICBzdG9wQXRMb3N0Rm9jdXM/OmJvb2xlYW47XG4gICAgICAgIGFzc2V0c1VybD86c3RyaW5nO1xuICAgICAgICBsb2FkZXJDb25jdXJyZW5jeT86bnVtYmVyO1xuICAgICAgICBhdWRpb0NoYW5uZWxMaW5lcz86bnVtYmVyO1xuICAgICAgICBzb3VuZENoYW5uZWxMaW5lcz86bnVtYmVyO1xuICAgICAgICBtdXNpY0NoYW5uZWxMaW5lcz86bnVtYmVyO1xuICAgICAgICB6SW5kZXhFbmFibGVkPzpib29sZWFuO1xuICAgIH1cbn1cblxuaW50ZXJmYWNlIE9iamVjdCB7XG4gICAgYXNzaWduKHRhcmdldDpPYmplY3QsIC4uLnNvdXJjZXM6T2JqZWN0W10pOk9iamVjdDtcbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuL0F1ZGlvTGluZS50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9jb3JlL0dhbWUudHNcIiAvPlxubW9kdWxlIFBJWEkge1xuICAgIGV4cG9ydCBjbGFzcyBBdWRpb01hbmFnZXJ7XG4gICAgICAgIHNvdW5kTGluZXM6QXVkaW9MaW5lW10gPSBbXTtcbiAgICAgICAgbXVzaWNMaW5lczpBdWRpb0xpbmVbXSA9IFtdO1xuICAgICAgICBub3JtYWxMaW5lczpBdWRpb0xpbmVbXSA9IFtdO1xuICAgICAgICBwcml2YXRlIF90ZW1wTGluZXM6QXVkaW9MaW5lW10gPSBbXTtcblxuICAgICAgICBtdXNpY011dGVkOmJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgc291bmRNdXRlZDpib29sZWFuID0gZmFsc2U7XG5cbiAgICAgICAgY29udGV4dDpBdWRpb0NvbnRleHQ7XG4gICAgICAgIGdhaW5Ob2RlOkF1ZGlvTm9kZTtcblxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGF1ZGlvQ2hhbm5lbExpbmVzOm51bWJlciA9IDEwLCBwcml2YXRlIHNvdW5kQ2hhbm5lbExpbmVzOm51bWJlciA9IDEwLCBwcml2YXRlIG11c2ljQ2hhbm5lbExpbmVzOm51bWJlciA9IDEpe1xuICAgICAgICAgICAgaWYodXRpbHMuX2F1ZGlvVHlwZVNlbGVjdGVkID09PSBBVURJT19UWVBFLldFQkFVRElPKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0ID0gRGV2aWNlLmdsb2JhbFdlYkF1ZGlvQ29udGV4dDtcbiAgICAgICAgICAgICAgICB0aGlzLmdhaW5Ob2RlID0gdGhpcy5jcmVhdGVHYWluTm9kZSh0aGlzLmNvbnRleHQpO1xuICAgICAgICAgICAgICAgIHRoaXMuZ2Fpbk5vZGUuY29ubmVjdCh0aGlzLmNvbnRleHQuZGVzdGluYXRpb24pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgaTpudW1iZXI7XG4gICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCB0aGlzLmF1ZGlvQ2hhbm5lbExpbmVzOyBpKyspe1xuICAgICAgICAgICAgICAgIHRoaXMubm9ybWFsTGluZXMucHVzaChuZXcgQXVkaW9MaW5lKHRoaXMpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yKGkgPSAwOyBpIDwgdGhpcy5zb3VuZENoYW5uZWxMaW5lczsgaSsrKXtcbiAgICAgICAgICAgICAgICB0aGlzLnNvdW5kTGluZXMucHVzaChuZXcgQXVkaW9MaW5lKHRoaXMpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yKGkgPSAwOyBpIDwgdGhpcy5tdXNpY0NoYW5uZWxMaW5lczsgaSsrKXtcbiAgICAgICAgICAgICAgICB0aGlzLm11c2ljTGluZXMucHVzaChuZXcgQXVkaW9MaW5lKHRoaXMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGdldEF1ZGlvKGlkOnN0cmluZyk6QXVkaW97XG4gICAgICAgICAgICB2YXIgYXVkaW86QXVkaW8gPSB1dGlscy5BdWRpb0NhY2hlW2lkXTtcbiAgICAgICAgICAgIGF1ZGlvLm1hbmFnZXIgPSB0aGlzO1xuICAgICAgICAgICAgcmV0dXJuIGF1ZGlvO1xuICAgICAgICB9XG5cbiAgICAgICAgcGF1c2VBbGxMaW5lcygpOkF1ZGlvTWFuYWdlciB7XG4gICAgICAgICAgICB0aGlzLnBhdXNlTXVzaWMoKTtcbiAgICAgICAgICAgIHRoaXMucGF1c2VTb3VuZCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICByZXN1bWVBbGxMaW5lcygpOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIHRoaXMucmVzdW1lTXVzaWMoKTtcbiAgICAgICAgICAgIHRoaXMucmVzdW1lU291bmQoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcGxheShpZDpzdHJpbmcsIGxvb3A/OmJvb2xlYW58RnVuY3Rpb24sIGNhbGxiYWNrPzpGdW5jdGlvbik6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgaWYodHlwZW9mIGxvb3AgPT09IFwiZnVuY3Rpb25cIil7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2sgPSA8RnVuY3Rpb24+bG9vcDtcbiAgICAgICAgICAgICAgICBsb29wID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGxheShpZCwgdGhpcy5ub3JtYWxMaW5lcywgPGJvb2xlYW4+bG9vcCwgY2FsbGJhY2spO1xuICAgICAgICB9XG5cbiAgICAgICAgcGxheU11c2ljKGlkOnN0cmluZywgbG9vcD86Ym9vbGVhbnxGdW5jdGlvbiwgY2FsbGJhY2s/OkZ1bmN0aW9uKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICBpZih0eXBlb2YgbG9vcCA9PT0gXCJmdW5jdGlvblwiKXtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayA9IDxGdW5jdGlvbj5sb29wO1xuICAgICAgICAgICAgICAgIGxvb3AgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wbGF5KGlkLCB0aGlzLm11c2ljTGluZXMsIDxib29sZWFuPmxvb3AsIGNhbGxiYWNrKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBsYXlTb3VuZChpZDpzdHJpbmcsIGxvb3A/OmJvb2xlYW58RnVuY3Rpb24sIGNhbGxiYWNrPzpGdW5jdGlvbik6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgaWYodHlwZW9mIGxvb3AgPT09IFwiZnVuY3Rpb25cIil7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2sgPSA8RnVuY3Rpb24+bG9vcDtcbiAgICAgICAgICAgICAgICBsb29wID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGxheShpZCwgdGhpcy5zb3VuZExpbmVzLCA8Ym9vbGVhbj5sb29wLCBjYWxsYmFjayk7XG4gICAgICAgIH1cblxuICAgICAgICBzdG9wKGlkPzpzdHJpbmcpOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdG9wKGlkLCB0aGlzLm5vcm1hbExpbmVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0b3BNdXNpYyhpZD86c3RyaW5nKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RvcChpZCwgdGhpcy5tdXNpY0xpbmVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0b3BTb3VuZChpZD86c3RyaW5nKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RvcChpZCwgdGhpcy5zb3VuZExpbmVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBhdXNlKGlkPzpzdHJpbmcpOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wYXVzZShpZCwgdGhpcy5ub3JtYWxMaW5lcyk7XG4gICAgICAgIH1cblxuICAgICAgICBwYXVzZU11c2ljKGlkPzpzdHJpbmcpOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wYXVzZShpZCwgdGhpcy5tdXNpY0xpbmVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBhdXNlU291bmQoaWQ/OnN0cmluZyk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BhdXNlKGlkLCB0aGlzLnNvdW5kTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzdW1lKGlkPzpzdHJpbmcpOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZXN1bWUoaWQsIHRoaXMubm9ybWFsTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzdW1lTXVzaWMoaWQ/OnN0cmluZyk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Jlc3VtZShpZCwgdGhpcy5tdXNpY0xpbmVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc3VtZVNvdW5kKGlkPzpzdHJpbmcpOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZXN1bWUoaWQsIHRoaXMuc291bmRMaW5lcyk7XG4gICAgICAgIH1cblxuICAgICAgICBtdXRlKGlkPzpzdHJpbmcpOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tdXRlKGlkLCB0aGlzLm5vcm1hbExpbmVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG11dGVNdXNpYyhpZD86c3RyaW5nKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbXV0ZShpZCwgdGhpcy5tdXNpY0xpbmVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG11dGVTb3VuZChpZD86c3RyaW5nKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbXV0ZShpZCwgdGhpcy5zb3VuZExpbmVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHVubXV0ZShpZD86c3RyaW5nKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdW5tdXRlKGlkLCB0aGlzLm5vcm1hbExpbmVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHVubXV0ZU11c2ljKGlkPzpzdHJpbmcpOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl91bm11dGUoaWQsIHRoaXMubXVzaWNMaW5lcyk7XG4gICAgICAgIH1cblxuICAgICAgICB1bm11dGVTb3VuZChpZD86c3RyaW5nKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdW5tdXRlKGlkLCB0aGlzLnNvdW5kTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfcGF1c2UoaWQ6c3RyaW5nLCBsaW5lczpBdWRpb0xpbmVbXSk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgaWYoIWlkKXtcbiAgICAgICAgICAgICAgICBmb3IodmFyIGk6bnVtYmVyID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICAgICAgaWYoIWxpbmVzW2ldLmF2YWlsYWJsZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lc1tpXS5wYXVzZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBhdWRpb0xpbmVzOkF1ZGlvTGluZVtdID0gdGhpcy5fZ2V0TGluZXNCeUlkKGlkLCBsaW5lcyk7XG4gICAgICAgICAgICBpZihhdWRpb0xpbmVzLmxlbmd0aCl7XG4gICAgICAgICAgICAgICAgZm9yKGkgPSAwOyBpIDwgYXVkaW9MaW5lcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgICAgIGF1ZGlvTGluZXNbaV0ucGF1c2UoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX3Jlc3VtZShpZDpzdHJpbmcsIGxpbmVzOkF1ZGlvTGluZVtdKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICBpZighaWQpe1xuICAgICAgICAgICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBpZighbGluZXNbaV0uYXZhaWxhYmxlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzW2ldLnJlc3VtZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBhdWRpb0xpbmVzOkF1ZGlvTGluZVtdID0gdGhpcy5fZ2V0TGluZXNCeUlkKGlkLCBsaW5lcyk7XG4gICAgICAgICAgICBpZihhdWRpb0xpbmVzLmxlbmd0aCl7XG4gICAgICAgICAgICAgICAgZm9yKGkgPSAwOyBpIDwgYXVkaW9MaW5lcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgICAgIGF1ZGlvTGluZXNbaV0ucmVzdW1lKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9wbGF5KGlkOnN0cmluZywgbGluZXM6QXVkaW9MaW5lW10sIGxvb3A6Ym9vbGVhbiA9IGZhbHNlLCBjYWxsYmFjaz86RnVuY3Rpb24pOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIHZhciBsaW5lOkF1ZGlvTGluZSA9IHRoaXMuX2dldEF2YWlsYWJsZUxpbmVGcm9tKGxpbmVzKTtcbiAgICAgICAgICAgIGlmKCFsaW5lKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdBdWRpb01hbmFnZXI6IEFsbCBsaW5lcyBhcmUgYnVzeSEnKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGF1ZGlvOkF1ZGlvID0gdGhpcy5nZXRBdWRpbyhpZCk7XG4gICAgICAgICAgICBpZighYXVkaW8pe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0F1ZGlvICgnICsgaWQgKyAnKSBub3QgZm91bmQuJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxpbmUuc2V0QXVkaW8oYXVkaW8sIGxvb3AsIGNhbGxiYWNrKS5wbGF5KCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX3N0b3AoaWQ6c3RyaW5nLCBsaW5lczpBdWRpb0xpbmVbXSk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgaWYoIWlkKXtcbiAgICAgICAgICAgICAgICBmb3IodmFyIGk6bnVtYmVyID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICAgICAgaWYoIWxpbmVzW2ldLmF2YWlsYWJsZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lc1tpXS5zdG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGF1ZGlvTGluZXM6QXVkaW9MaW5lW10gPSB0aGlzLl9nZXRMaW5lc0J5SWQoaWQsIGxpbmVzKTtcbiAgICAgICAgICAgIGlmKGF1ZGlvTGluZXMubGVuZ3RoKXtcbiAgICAgICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCBhdWRpb0xpbmVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICAgICAgYXVkaW9MaW5lc1tpXS5zdG9wKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX211dGUoaWQ6c3RyaW5nLCBsaW5lczpBdWRpb0xpbmVbXSk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgaWYoIWlkKXtcbiAgICAgICAgICAgICAgICBmb3IodmFyIGk6bnVtYmVyID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICAgICAgaWYoIWxpbmVzW2ldLmF2YWlsYWJsZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lc1tpXS5tdXRlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGF1ZGlvTGluZXM6QXVkaW9MaW5lW10gPSB0aGlzLl9nZXRMaW5lc0J5SWQoaWQsIGxpbmVzKTtcbiAgICAgICAgICAgIGlmKGF1ZGlvTGluZXMubGVuZ3RoKXtcbiAgICAgICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCBhdWRpb0xpbmVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICAgICAgYXVkaW9MaW5lc1tpXS5tdXRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF91bm11dGUoaWQ6c3RyaW5nLCBsaW5lczpBdWRpb0xpbmVbXSk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgaWYoIWlkKXtcbiAgICAgICAgICAgICAgICBmb3IodmFyIGk6bnVtYmVyID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICAgICAgaWYoIWxpbmVzW2ldLmF2YWlsYWJsZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lc1tpXS51bm11dGUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgYXVkaW9MaW5lczpBdWRpb0xpbmVbXSA9IHRoaXMuX2dldExpbmVzQnlJZChpZCwgbGluZXMpO1xuICAgICAgICAgICAgaWYoYXVkaW9MaW5lcy5sZW5ndGgpe1xuICAgICAgICAgICAgICAgIGZvcihpID0gMDsgaSA8IGF1ZGlvTGluZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBhdWRpb0xpbmVzW2ldLnVubXV0ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfZ2V0TGluZXNCeUlkKGlkOnN0cmluZywgbGluZXM6QXVkaW9MaW5lW10pOkF1ZGlvTGluZVtdIHtcbiAgICAgICAgICAgIHRoaXMuX3RlbXBMaW5lcy5sZW5ndGggPSAwO1xuICAgICAgICAgICAgZm9yKHZhciBpOm51bWJlciA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgaWYoIWxpbmVzW2ldLmF2YWlsYWJsZSl7XG4gICAgICAgICAgICAgICAgICAgIGlmKGxpbmVzW2ldLmF1ZGlvLmlkID09PSBpZCl0aGlzLl90ZW1wTGluZXMucHVzaChsaW5lc1tpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdGVtcExpbmVzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfZ2V0QXZhaWxhYmxlTGluZUZyb20obGluZXM6QXVkaW9MaW5lW10pOkF1ZGlvTGluZXtcbiAgICAgICAgICAgIHZhciBsOkF1ZGlvTGluZTtcbiAgICAgICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgIGlmKGxpbmVzW2ldLmF2YWlsYWJsZSl7XG4gICAgICAgICAgICAgICAgICAgIGwgPSBsaW5lc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGw7XG4gICAgICAgIH1cblxuICAgICAgICBjcmVhdGVHYWluTm9kZShjdHg6QXVkaW9Db250ZXh0KTpHYWluTm9kZXtcbiAgICAgICAgICAgIHJldHVybiBjdHguY3JlYXRlR2FpbiA/IGN0eC5jcmVhdGVHYWluKCkgOiBjdHguY3JlYXRlR2Fpbk5vZGUoKTtcbiAgICAgICAgfVxuXG4gICAgfVxufVxuXG5pbnRlcmZhY2UgQXVkaW9Db250ZXh0IHtcbiAgICBjcmVhdGVHYWluTm9kZSgpOmFueTtcbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuL0F1ZGlvTWFuYWdlci50c1wiIC8+XG5tb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IGNsYXNzIEF1ZGlvIHtcbiAgICAgICAgbG9vcDpib29sZWFuID0gZmFsc2U7XG4gICAgICAgIHByaXZhdGUgX3ZvbHVtZTpudW1iZXIgPSAxO1xuICAgICAgICBtdXRlZDpib29sZWFuID0gZmFsc2U7XG4gICAgICAgIG1hbmFnZXI6QXVkaW9NYW5hZ2VyO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBzb3VyY2U6YW55LCBwdWJsaWMgaWQ6c3RyaW5nKXt9XG5cbiAgICAgICAgcGxheShsb29wPzpib29sZWFufEZ1bmN0aW9uLCBjYWxsYmFjaz86RnVuY3Rpb24pOkF1ZGlve1xuICAgICAgICAgICAgaWYoIXRoaXMubWFuYWdlcil7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignVGhpcyBhdWRpbyBuZWVkIGEgbWFuYWdlci4nKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYodHlwZW9mIGxvb3AgPT09IFwiZnVuY3Rpb25cIil7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2sgPSA8RnVuY3Rpb24+bG9vcDtcbiAgICAgICAgICAgICAgICBsb29wID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5wbGF5KHRoaXMuaWQsIGxvb3AsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RvcCgpOkF1ZGlvIHtcbiAgICAgICAgICAgIGlmKCF0aGlzLm1hbmFnZXIpe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1RoaXMgYXVkaW8gbmVlZCBhIG1hbmFnZXIuJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5zdG9wKHRoaXMuaWQpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBtdXRlKCk6QXVkaW8ge1xuICAgICAgICAgICAgaWYoIXRoaXMubWFuYWdlcil7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignVGhpcyBhdWRpbyBuZWVkIGEgbWFuYWdlci4nKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5tdXRlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLm1hbmFnZXIubXV0ZSh0aGlzLmlkKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgdW5tdXRlKCk6QXVkaW8ge1xuICAgICAgICAgICAgaWYoIXRoaXMubWFuYWdlcil7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignVGhpcyBhdWRpbyBuZWVkIGEgbWFuYWdlci4nKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5tdXRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLnVubXV0ZSh0aGlzLmlkKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcGF1c2UoKTpBdWRpbyB7XG4gICAgICAgICAgICBpZighdGhpcy5tYW5hZ2VyKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdUaGlzIGF1ZGlvIG5lZWQgYSBtYW5hZ2VyLicpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLm1hbmFnZXIucGF1c2UodGhpcy5pZCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc3VtZSgpOkF1ZGlvIHtcbiAgICAgICAgICAgIGlmKCF0aGlzLm1hbmFnZXIpe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1RoaXMgYXVkaW8gbmVlZCBhIG1hbmFnZXIuJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5yZXN1bWUodGhpcy5pZCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCB2b2x1bWUoKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl92b2x1bWU7XG4gICAgICAgIH1cblxuICAgICAgICBzZXQgdm9sdW1lKHZhbHVlOm51bWJlcil7XG4gICAgICAgICAgICB0aGlzLl92b2x1bWUgPSB2YWx1ZTtcblxuICAgICAgICAgICAgaWYodGhpcy5tYW5hZ2VyKXtcbiAgICAgICAgICAgICAgICAvL1RPRE86IHVwZGF0ZSB0aGUgdm9sdW1lIG9uIHRoZSBmbHlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9kZWZzL3BpeGkuanMuZC50c1wiIC8+XG5tb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IGNsYXNzIFBvb2wge1xuICAgICAgICBwcml2YXRlIF9pdGVtczphbnlbXSA9IFtdO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGFtb3VudDpudW1iZXIsIHB1YmxpYyBvYmplY3RDdG9yOmFueSwgcHVibGljIGFyZ3M6YW55W10gPSBbXSl7XG4gICAgICAgICAgICBmb3IodmFyIGk6bnVtYmVyID0gMDsgaSA8IGFtb3VudDsgaSsrKXtcbiAgICAgICAgICAgICAgICB0aGlzLl9pdGVtcy5wdXNoKHRoaXMuX25ld09iamVjdCgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX25ld09iamVjdCgpOmFueXtcbiAgICAgICAgICAgIHZhciBvYmo6YW55O1xuICAgICAgICAgICAgdHJ5e1xuICAgICAgICAgICAgICAgIG9iaiA9IG5ldyAoRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQuYXBwbHkodGhpcy5vYmplY3RDdG9yLCAoW251bGxdKS5jb25jYXQodGhpcy5hcmdzKSkpKCk7XG4gICAgICAgICAgICB9Y2F0Y2goZSl7XG4gICAgICAgICAgICAgICAgb2JqID0gX25ld09iaih0aGlzLm9iamVjdEN0b3IsIHRoaXMuYXJncyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBtZTpQb29sID0gdGhpcztcbiAgICAgICAgICAgIG9iai5yZXR1cm5Ub1Bvb2wgPSBmdW5jdGlvbiByZXR1cm5Ub1Bvb2woKXtcbiAgICAgICAgICAgICAgICAgIG1lLnB1dCh0aGlzKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgIH1cblxuICAgICAgICBwdXQoaXRlbTphbnkpOnZvaWR7XG4gICAgICAgICAgICB0aGlzLl9pdGVtcy51bnNoaWZ0KGl0ZW0pO1xuICAgICAgICAgICAgaWYoaXRlbS5vblJldHVyblRvUG9vbClpdGVtLm9uUmV0dXJuVG9Qb29sKHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0KCk6YW55e1xuICAgICAgICAgICAgdmFyIGl0ZW06YW55ID0gKHRoaXMuX2l0ZW1zLmxlbmd0aCkgPyB0aGlzLl9pdGVtcy5wb3AoKSA6IHRoaXMuX25ld09iamVjdCgpO1xuICAgICAgICAgICAgaWYoaXRlbS5vbkdldEZyb21Qb29sKWl0ZW0ub25HZXRGcm9tUG9vbCh0aGlzKTtcbiAgICAgICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGxlbmd0aCgpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2l0ZW1zLmxlbmd0aDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vc2FmYXJpIGZpeFxuICAgIGZ1bmN0aW9uIF9uZXdPYmoob2JqOmFueSwgYXJnczphbnlbXSk6YW55e1xuICAgICAgICB2YXIgZXY6c3RyaW5nID0gXCJGdW5jdGlvbignb2JqJyxcIjtcbiAgICAgICAgdmFyIGZuOnN0cmluZyA9IFwiXFxcInJldHVybiBuZXcgb2JqKFwiO1xuXG4gICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICBldiArPSBcIidhXCIraStcIicsXCI7XG4gICAgICAgICAgICBmbiArPSBcImFcIitpO1xuICAgICAgICAgICAgaWYoaSAhPT0gYXJncy5sZW5ndGgtMSl7XG4gICAgICAgICAgICAgICAgZm4gKz0gXCIsXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmbiArPSBcIilcXFwiXCI7XG4gICAgICAgIGV2ICs9IGZuICsgXCIpXCI7XG5cbiAgICAgICAgcmV0dXJuIChldmFsKGV2KSkuYXBwbHkodGhpcywgKFtvYmpdKS5jb25jYXQoYXJncykpO1xuICAgIH1cbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9kZWZzL3BpeGkuanMuZC50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9jb3JlL2NvbnN0LnRzXCIgLz5cbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL3R3ZWVuL1R3ZWVuLnRzXCIgLz5cbm1vZHVsZSBQSVhJIHtcbiAgICBDb250YWluZXIuX2tpbGxlZE9iamVjdHMgPSBbXTtcblxuICAgIENvbnRhaW5lci5wcm90b3R5cGUuX3pJbmRleCA9IDA7XG4gICAgQ29udGFpbmVyLnByb3RvdHlwZS56RGlydHkgPSBmYWxzZTtcblxuICAgIENvbnRhaW5lci5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oZGVsdGFUaW1lOiBudW1iZXIpOkNvbnRhaW5lciB7XG4gICAgICAgIGlmKHRoaXMuekRpcnR5KXtcbiAgICAgICAgICAgIHRoaXMuekRpcnR5ID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnNvcnRDaGlsZHJlbkJ5WkluZGV4KCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnBvc2l0aW9uLnggKz0gdGhpcy52ZWxvY2l0eS54ICogZGVsdGFUaW1lO1xuICAgICAgICB0aGlzLnBvc2l0aW9uLnkgKz0gdGhpcy52ZWxvY2l0eS55ICogZGVsdGFUaW1lO1xuICAgICAgICB0aGlzLnJvdGF0aW9uICs9IHRoaXMucm90YXRpb25TcGVlZCAqIGRlbHRhVGltZTtcblxuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuW2ldLnVwZGF0ZShkZWx0YVRpbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIHZhciBfYWRkQ2hpbGQ6RnVuY3Rpb24gPSBDb250YWluZXIucHJvdG90eXBlLmFkZENoaWxkO1xuICAgIENvbnRhaW5lci5wcm90b3R5cGUuYWRkQ2hpbGQgPSBmdW5jdGlvbihjaGlsZDpEaXNwbGF5T2JqZWN0KTpEaXNwbGF5T2JqZWN0e1xuICAgICAgICBfYWRkQ2hpbGQuY2FsbCh0aGlzLCBjaGlsZCk7XG4gICAgICAgIGlmKHpJbmRleEVuYWJsZWQpdGhpcy56RGlydHkgPSB0cnVlO1xuICAgICAgICByZXR1cm4gY2hpbGQ7XG4gICAgfTtcblxuICAgIENvbnRhaW5lci5wcm90b3R5cGUuYWRkVG8gPSBmdW5jdGlvbihwYXJlbnQpOkNvbnRhaW5lcntcbiAgICAgICAgcGFyZW50LmFkZENoaWxkKHRoaXMpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgQ29udGFpbmVyLnByb3RvdHlwZS5raWxsID0gZnVuY3Rpb24oKTpDb250YWluZXJ7XG4gICAgICAgIFBJWEkuQ29udGFpbmVyLl9raWxsZWRPYmplY3RzLnB1c2godGhpcyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBDb250YWluZXIucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmKHRoaXMucGFyZW50KXtcbiAgICAgICAgICAgIHRoaXMucGFyZW50LnJlbW92ZUNoaWxkKHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBDb250YWluZXIucHJvdG90eXBlLnNvcnRDaGlsZHJlbkJ5WkluZGV4ID0gZnVuY3Rpb24oKTpDb250YWluZXIge1xuICAgICAgICB0aGlzLmNoaWxkcmVuLnNvcnQoZnVuY3Rpb24oYTpDb250YWluZXIsIGI6Q29udGFpbmVyKXtcbiAgICAgICAgICAgIHZhciBhWiA9IGEuekluZGV4LFxuICAgICAgICAgICAgICAgIGJaID0gYi56SW5kZXg7XG5cbiAgICAgICAgICAgIHJldHVybiBhWiAtIGJaO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIENvbnRhaW5lci5wcm90b3R5cGUudHdlZW4gPSBmdW5jdGlvbihtYW5hZ2VyPzpUd2Vlbk1hbmFnZXIpOlR3ZWVue1xuICAgICAgICByZXR1cm4gbmV3IFR3ZWVuKHRoaXMpO1xuICAgIH07XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQ29udGFpbmVyLnByb3RvdHlwZSwgJ3pJbmRleCcsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpOm51bWJlcntcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl96SW5kZXg7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZTpudW1iZXIpe1xuICAgICAgICAgICAgdGhpcy5fekluZGV4ID0gdmFsdWU7XG4gICAgICAgICAgICBpZih6SW5kZXhFbmFibGVkJiZ0aGlzLnBhcmVudCl0aGlzLnBhcmVudC56RGlydHkgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICB9KTtcblxufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2RlZnMvcGl4aS5qcy5kLnRzXCIgLz5cblxubW9kdWxlIFBJWEkge1xuICAgIERpc3BsYXlPYmplY3QucHJvdG90eXBlLnNwZWVkID0gMDtcbiAgICBEaXNwbGF5T2JqZWN0LnByb3RvdHlwZS52ZWxvY2l0eSA9IG5ldyBQb2ludCgpO1xuICAgIERpc3BsYXlPYmplY3QucHJvdG90eXBlLmRpcmVjdGlvbiA9IDA7XG4gICAgRGlzcGxheU9iamVjdC5wcm90b3R5cGUucm90YXRpb25TcGVlZCA9IDA7XG5cbiAgICBEaXNwbGF5T2JqZWN0LnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihkZWx0YVRpbWU6bnVtYmVyKTpEaXNwbGF5T2JqZWN0e1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xufVxuIiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vZGVmcy9waXhpLmpzLmQudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vdHdlZW4vUGF0aC50c1wiIC8+XG5tb2R1bGUgUElYSSB7XG4gICAgR3JhcGhpY3MucHJvdG90eXBlLmRyYXdQYXRoID0gZnVuY3Rpb24ocGF0aDpQYXRoKTpHcmFwaGljc3tcbiAgICAgICAgcGF0aC5wYXJzZVBvaW50cygpO1xuICAgICAgICB0aGlzLmRyYXdTaGFwZShwYXRoLnBvbHlnb24pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xufSJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
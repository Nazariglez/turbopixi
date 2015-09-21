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
                //console.log(distance);
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
                    var time_1 = this.pingPong ? this.time / 2 : this.time;
                    var b = this.pathFrom, c = this.pathTo - this.pathFrom, d = time_1, t = this._elapsedTime / d;
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
                this.timeSpeed = 1;
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
                    this.time += Math.min((now - last) / 1000, maxFrameMS) * this.timeSpeed;
                    this.delta = this.time - this.lastTime;
                    this.lastTime = this.time;
                    last = now;
                    this.preUpdate(this.delta);
                    this.update(this.delta);
                    this.renderer.render(this.scene);
                    this.postUpdate(this.delta);
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
            Game.prototype.preUpdate = function (deltaTime) {
            };
            Game.prototype.postUpdate = function (deltaTime) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInR1cmJvcGl4aS5qcyIsImluZGV4LnRzIiwiYXVkaW8vQXVkaW9MaW5lLnRzIiwiY29yZS9jb25zdC50cyIsImNvcmUvRGV2aWNlLnRzIiwiZGlzcGxheS9DYW1lcmEudHMiLCJ0aW1lci9UaW1lci50cyIsInRpbWVyL1RpbWVyTWFuYWdlci50cyIsInR3ZWVuL0Vhc2luZy50cyIsInR3ZWVuL1BhdGgudHMiLCJ0d2Vlbi9Ud2Vlbi50cyIsInR3ZWVuL1R3ZWVuTWFuYWdlci50cyIsImRpc3BsYXkvU2NlbmUudHMiLCJpbnB1dC9JbnB1dE1hbmFnZXIudHMiLCJsb2FkZXIvYml0bWFwRm9udFBhcnNlclRYVC50cyIsImxvYWRlci9hdWRpb1BhcnNlci50cyIsImNvcmUvVXRpbHMudHMiLCJsb2FkZXIvTG9hZGVyLnRzIiwiY29yZS9EYXRhTWFuYWdlci50cyIsImNvcmUvR2FtZS50cyIsImF1ZGlvL0F1ZGlvTWFuYWdlci50cyIsImF1ZGlvL0F1ZGlvLnRzIiwiY29yZS9Qb29sLnRzIiwiZGlzcGxheS9Db250YWluZXIudHMiLCJkaXNwbGF5L0Rpc3BsYXlPYmplY3QudHMiLCJkaXNwbGF5L0dyYXBoaWNzLnRzIl0sIm5hbWVzIjpbIlBJWEkiLCJFcnJvciIsIlBJWElfVkVSU0lPTl9SRVFVSVJFRCIsIlBJWElfVkVSU0lPTiIsIlZFUlNJT04iLCJtYXRjaCIsIkhUTUxBdWRpbyIsIkF1ZGlvIiwiUElYSS5BdWRpb0xpbmUiLCJQSVhJLkF1ZGlvTGluZS5jb25zdHJ1Y3RvciIsIlBJWEkuQXVkaW9MaW5lLnNldEF1ZGlvIiwiUElYSS5BdWRpb0xpbmUucGxheSIsIlBJWEkuQXVkaW9MaW5lLnN0b3AiLCJQSVhJLkF1ZGlvTGluZS5wYXVzZSIsIlBJWEkuQXVkaW9MaW5lLnJlc3VtZSIsIlBJWEkuQXVkaW9MaW5lLm11dGUiLCJQSVhJLkF1ZGlvTGluZS51bm11dGUiLCJQSVhJLkF1ZGlvTGluZS52b2x1bWUiLCJQSVhJLkF1ZGlvTGluZS5yZXNldCIsIlBJWEkuQXVkaW9MaW5lLl9vbkVuZCIsIlBJWEkuR0FNRV9TQ0FMRV9UWVBFIiwiUElYSS5BVURJT19UWVBFIiwiUElYSS5EZXZpY2UiLCJQSVhJLkRldmljZS5nZXRNb3VzZVdoZWVsRXZlbnQiLCJQSVhJLkRldmljZS52aWJyYXRlIiwiUElYSS5EZXZpY2UuZ2V0VmlzaWJpbGl0eUNoYW5nZUV2ZW50IiwiUElYSS5EZXZpY2UuaXNPbmxpbmUiLCJfX2V4dGVuZHMiLCJkIiwiYiIsInAiLCJoYXNPd25Qcm9wZXJ0eSIsIl9fIiwiY29uc3RydWN0b3IiLCJwcm90b3R5cGUiLCJQSVhJLkNhbWVyYSIsIlBJWEkuQ2FtZXJhLmNvbnN0cnVjdG9yIiwiUElYSS5DYW1lcmEudXBkYXRlIiwiZ2V0IiwiUElYSS5DYW1lcmEuZW5hYmxlZCIsInNldCIsImVudW1lcmFibGUiLCJjb25maWd1cmFibGUiLCJQSVhJLlRpbWVyIiwiUElYSS5UaW1lci5jb25zdHJ1Y3RvciIsIlBJWEkuVGltZXIudXBkYXRlIiwiUElYSS5UaW1lci5hZGRUbyIsIlBJWEkuVGltZXIucmVtb3ZlIiwiUElYSS5UaW1lci5zdGFydCIsIlBJWEkuVGltZXIuc3RvcCIsIlBJWEkuVGltZXIucmVzZXQiLCJQSVhJLlRpbWVyLm9uU3RhcnQiLCJQSVhJLlRpbWVyLm9uRW5kIiwiUElYSS5UaW1lci5vblN0b3AiLCJQSVhJLlRpbWVyLm9uVXBkYXRlIiwiUElYSS5UaW1lci5vblJlcGVhdCIsIlBJWEkuVGltZXJNYW5hZ2VyIiwiUElYSS5UaW1lck1hbmFnZXIuY29uc3RydWN0b3IiLCJQSVhJLlRpbWVyTWFuYWdlci51cGRhdGUiLCJQSVhJLlRpbWVyTWFuYWdlci5yZW1vdmVUaW1lciIsIlBJWEkuVGltZXJNYW5hZ2VyLmFkZFRpbWVyIiwiUElYSS5UaW1lck1hbmFnZXIuY3JlYXRlVGltZXIiLCJQSVhJLlRpbWVyTWFuYWdlci5fcmVtb3ZlIiwiUElYSS5FYXNpbmciLCJQSVhJLkVhc2luZy5saW5lYXIiLCJrIiwiUElYSS5FYXNpbmcuaW5RdWFkIiwiUElYSS5FYXNpbmcub3V0UXVhZCIsIlBJWEkuRWFzaW5nLmluT3V0UXVhZCIsIlBJWEkuRWFzaW5nLmluQ3ViaWMiLCJQSVhJLkVhc2luZy5vdXRDdWJpYyIsIlBJWEkuRWFzaW5nLmluT3V0Q3ViaWMiLCJQSVhJLkVhc2luZy5pblF1YXJ0IiwiUElYSS5FYXNpbmcub3V0UXVhcnQiLCJQSVhJLkVhc2luZy5pbk91dFF1YXJ0IiwiUElYSS5FYXNpbmcuaW5RdWludCIsIlBJWEkuRWFzaW5nLm91dFF1aW50IiwiUElYSS5FYXNpbmcuaW5PdXRRdWludCIsIlBJWEkuRWFzaW5nLmluU2luZSIsIk1hdGgiLCJjb3MiLCJQSSIsIlBJWEkuRWFzaW5nLm91dFNpbmUiLCJzaW4iLCJQSVhJLkVhc2luZy5pbk91dFNpbmUiLCJQSVhJLkVhc2luZy5pbkV4cG8iLCJwb3ciLCJQSVhJLkVhc2luZy5vdXRFeHBvIiwiUElYSS5FYXNpbmcuaW5PdXRFeHBvIiwiUElYSS5FYXNpbmcuaW5DaXJjIiwic3FydCIsIlBJWEkuRWFzaW5nLm91dENpcmMiLCJQSVhJLkVhc2luZy5pbk91dENpcmMiLCJQSVhJLkVhc2luZy5pbkVsYXN0aWMiLCJzIiwiYSIsImFzaW4iLCJQSVhJLkVhc2luZy5vdXRFbGFzdGljIiwiUElYSS5FYXNpbmcuaW5PdXRFbGFzdGljIiwiUElYSS5FYXNpbmcuaW5CYWNrIiwidiIsIlBJWEkuRWFzaW5nLm91dEJhY2siLCJQSVhJLkVhc2luZy5pbk91dEJhY2siLCJQSVhJLkVhc2luZy5pbkJvdW5jZSIsIkVhc2luZyIsIm91dEJvdW5jZSIsIlBJWEkuRWFzaW5nLm91dEJvdW5jZSIsIlBJWEkuRWFzaW5nLmluT3V0Qm91bmNlIiwiaW5Cb3VuY2UiLCJQSVhJLlBhdGgiLCJQSVhJLlBhdGguY29uc3RydWN0b3IiLCJQSVhJLlBhdGgubW92ZVRvIiwiUElYSS5QYXRoLmxpbmVUbyIsIlBJWEkuUGF0aC5iZXppZXJDdXJ2ZVRvIiwiUElYSS5QYXRoLnF1YWRyYXRpY0N1cnZlVG8iLCJQSVhJLlBhdGguYXJjVG8iLCJQSVhJLlBhdGguYXJjIiwiUElYSS5QYXRoLmRyYXdTaGFwZSIsIlBJWEkuUGF0aC5nZXRQb2ludCIsIlBJWEkuUGF0aC5kaXN0YW5jZUJldHdlZW4iLCJQSVhJLlBhdGgudG90YWxEaXN0YW5jZSIsIlBJWEkuUGF0aC5nZXRQb2ludEF0IiwiUElYSS5QYXRoLmdldFBvaW50QXREaXN0YW5jZSIsIlBJWEkuUGF0aC5wYXJzZVBvaW50cyIsIlBJWEkuUGF0aC5jbGVhciIsIlBJWEkuUGF0aC5jbG9zZWQiLCJQSVhJLlBhdGgubGVuZ3RoIiwiUElYSS5Ud2VlbiIsIlBJWEkuVHdlZW4uY29uc3RydWN0b3IiLCJQSVhJLlR3ZWVuLmFkZFRvIiwiUElYSS5Ud2Vlbi5jaGFpbiIsIlBJWEkuVHdlZW4uc3RhcnQiLCJQSVhJLlR3ZWVuLnN0b3AiLCJQSVhJLlR3ZWVuLnRvIiwiUElYSS5Ud2Vlbi5mcm9tIiwiUElYSS5Ud2Vlbi5yZW1vdmUiLCJQSVhJLlR3ZWVuLnJlc2V0IiwiUElYSS5Ud2Vlbi5vblN0YXJ0IiwiUElYSS5Ud2Vlbi5vbkVuZCIsIlBJWEkuVHdlZW4ub25TdG9wIiwiUElYSS5Ud2Vlbi5vblVwZGF0ZSIsIlBJWEkuVHdlZW4ub25SZXBlYXQiLCJQSVhJLlR3ZWVuLm9uUGluZ1BvbmciLCJQSVhJLlR3ZWVuLnVwZGF0ZSIsIlBJWEkuVHdlZW4uX3BhcnNlRGF0YSIsIlBJWEkuVHdlZW4uX2FwcGx5IiwiUElYSS5Ud2Vlbi5fY2FuVXBkYXRlIiwiUElYSS5fZmluZE1hbmFnZXIiLCJQSVhJLl9wYXJzZVJlY3Vyc2l2ZURhdGEiLCJQSVhJLmlzT2JqZWN0IiwiUElYSS5fcmVjdXJzaXZlQXBwbHkiLCJQSVhJLlR3ZWVuTWFuYWdlciIsIlBJWEkuVHdlZW5NYW5hZ2VyLmNvbnN0cnVjdG9yIiwiUElYSS5Ud2Vlbk1hbmFnZXIudXBkYXRlIiwiUElYSS5Ud2Vlbk1hbmFnZXIuZ2V0VHdlZW5zRm9yVGFyZ2VyIiwiUElYSS5Ud2Vlbk1hbmFnZXIuY3JlYXRlVHdlZW4iLCJQSVhJLlR3ZWVuTWFuYWdlci5hZGRUd2VlbiIsIlBJWEkuVHdlZW5NYW5hZ2VyLnJlbW92ZVR3ZWVuIiwiUElYSS5Ud2Vlbk1hbmFnZXIuX3JlbW92ZSIsIlBJWEkuU2NlbmUiLCJQSVhJLlNjZW5lLmNvbnN0cnVjdG9yIiwiUElYSS5TY2VuZS51cGRhdGUiLCJQSVhJLlNjZW5lLmFkZFRvIiwiUElYSS5JbnB1dE1hbmFnZXIiLCJQSVhJLklucHV0TWFuYWdlci5jb25zdHJ1Y3RvciIsIlBJWEkuYml0bWFwRm9udFBhcnNlclRYVCIsInJlc291cmNlIiwiZGF0YSIsInhoclR5cGUiLCJuZXh0IiwidGV4dCIsInhociIsInJlc3BvbnNlVGV4dCIsImluZGV4T2YiLCJ1cmwiLCJkaXJuYW1lIiwiYmFzZVVybCIsImNoYXJBdCIsImxlbmd0aCIsInJlcGxhY2UiLCJ0ZXh0dXJlVXJsIiwiZ2V0VGV4dHVyZVVybCIsInV0aWxzIiwiVGV4dHVyZUNhY2hlIiwicGFyc2UiLCJsb2FkT3B0aW9ucyIsImNyb3NzT3JpZ2luIiwibG9hZFR5cGUiLCJsb2FkZXJzIiwiUmVzb3VyY2UiLCJMT0FEX1RZUEUiLCJJTUFHRSIsImFkZCIsIm5hbWUiLCJyZXMiLCJ0ZXh0dXJlIiwiUElYSS5wYXJzZSIsIlBJWEkuZGlybmFtZSIsIlBJWEkuZ2V0VGV4dHVyZVVybCIsIlBJWEkuZ2V0QXR0ciIsIlBJWEkuYXVkaW9QYXJzZXIiLCJEZXZpY2UiLCJpc0F1ZGlvU3VwcG9ydGVkIiwiZXh0IiwiX2dldEV4dCIsIl9hbGxvd2VkRXh0IiwiX2NhblBsYXkiLCJfYXVkaW9UeXBlU2VsZWN0ZWQiLCJBVURJT19UWVBFIiwiV0VCQVVESU8iLCJnbG9iYWxXZWJBdWRpb0NvbnRleHQiLCJkZWNvZGVBdWRpb0RhdGEiLCJfYWRkVG9DYWNoZSIsImJpbmQiLCJQSVhJLmF1ZGlvUGFyc2VyVXJsIiwiUElYSS5fYWRkVG9DYWNoZSIsIlBJWEkuX2dldEV4dCIsIlBJWEkuX2NhblBsYXkiLCJQSVhJLnV0aWxzIiwiUElYSS5sb2FkZXJzIiwiUElYSS5sb2FkZXJzLlR1cmJvTG9hZGVyIiwiUElYSS5sb2FkZXJzLlR1cmJvTG9hZGVyLmNvbnN0cnVjdG9yIiwiUElYSS5sb2FkZXJzLlR1cmJvTG9hZGVyLmFkZCIsIlBJWEkubG9hZGVycy5fY2hlY2tBdWRpb1R5cGUiLCJQSVhJLmxvYWRlcnMuX3NldEF1ZGlvRXh0IiwiUElYSS5EYXRhTWFuYWdlciIsIlBJWEkuRGF0YU1hbmFnZXIuY29uc3RydWN0b3IiLCJQSVhJLkRhdGFNYW5hZ2VyLmxvYWQiLCJQSVhJLkRhdGFNYW5hZ2VyLnNhdmUiLCJQSVhJLkRhdGFNYW5hZ2VyLnJlc2V0IiwiUElYSS5EYXRhTWFuYWdlci5zZXQiLCJQSVhJLkRhdGFNYW5hZ2VyLmdldCIsIlBJWEkuRGF0YU1hbmFnZXIuZGVsIiwiUElYSS5HYW1lIiwiUElYSS5HYW1lLmNvbnN0cnVjdG9yIiwiUElYSS5HYW1lLl9hbmltYXRlIiwiUElYSS5HYW1lLnVwZGF0ZSIsIlBJWEkuR2FtZS5zdGFydCIsIlBJWEkuR2FtZS5zdG9wIiwiUElYSS5HYW1lLmVuYWJsZVN0b3BBdExvc3RGb2N1cyIsIlBJWEkuR2FtZS5kaXNhYmxlU3RvcEF0TG9zdEZvY3VzIiwiUElYSS5HYW1lLl9vblZpc2liaWxpdHlDaGFuZ2UiLCJQSVhJLkdhbWUub25Mb3N0Rm9jdXMiLCJQSVhJLkdhbWUuc2V0U2NlbmUiLCJQSVhJLkdhbWUuZ2V0U2NlbmUiLCJQSVhJLkdhbWUuY3JlYXRlU2NlbmUiLCJQSVhJLkdhbWUucmVtb3ZlU2NlbmUiLCJQSVhJLkdhbWUuYWRkU2NlbmUiLCJQSVhJLkdhbWUucmVtb3ZlQWxsU2NlbmVzIiwiUElYSS5HYW1lLnJlc2l6ZSIsIlBJWEkuR2FtZS5hdXRvUmVzaXplIiwiUElYSS5HYW1lLl9yZXNpemVNb2RlQXNwZWN0Rml0IiwiUElYSS5HYW1lLl9yZXNpemVNb2RlQXNwZWN0RmlsbCIsIlBJWEkuR2FtZS5fcmVzaXplTW9kZUZpbGwiLCJQSVhJLkdhbWUud2lkdGgiLCJQSVhJLkdhbWUuaGVpZ2h0IiwiUElYSS5BdWRpb01hbmFnZXIiLCJQSVhJLkF1ZGlvTWFuYWdlci5jb25zdHJ1Y3RvciIsIlBJWEkuQXVkaW9NYW5hZ2VyLmdldEF1ZGlvIiwiUElYSS5BdWRpb01hbmFnZXIucGF1c2VBbGxMaW5lcyIsIlBJWEkuQXVkaW9NYW5hZ2VyLnJlc3VtZUFsbExpbmVzIiwiUElYSS5BdWRpb01hbmFnZXIucGxheSIsIlBJWEkuQXVkaW9NYW5hZ2VyLnBsYXlNdXNpYyIsIlBJWEkuQXVkaW9NYW5hZ2VyLnBsYXlTb3VuZCIsIlBJWEkuQXVkaW9NYW5hZ2VyLnN0b3AiLCJQSVhJLkF1ZGlvTWFuYWdlci5zdG9wTXVzaWMiLCJQSVhJLkF1ZGlvTWFuYWdlci5zdG9wU291bmQiLCJQSVhJLkF1ZGlvTWFuYWdlci5wYXVzZSIsIlBJWEkuQXVkaW9NYW5hZ2VyLnBhdXNlTXVzaWMiLCJQSVhJLkF1ZGlvTWFuYWdlci5wYXVzZVNvdW5kIiwiUElYSS5BdWRpb01hbmFnZXIucmVzdW1lIiwiUElYSS5BdWRpb01hbmFnZXIucmVzdW1lTXVzaWMiLCJQSVhJLkF1ZGlvTWFuYWdlci5yZXN1bWVTb3VuZCIsIlBJWEkuQXVkaW9NYW5hZ2VyLm11dGUiLCJQSVhJLkF1ZGlvTWFuYWdlci5tdXRlTXVzaWMiLCJQSVhJLkF1ZGlvTWFuYWdlci5tdXRlU291bmQiLCJQSVhJLkF1ZGlvTWFuYWdlci51bm11dGUiLCJQSVhJLkF1ZGlvTWFuYWdlci51bm11dGVNdXNpYyIsIlBJWEkuQXVkaW9NYW5hZ2VyLnVubXV0ZVNvdW5kIiwiUElYSS5BdWRpb01hbmFnZXIuX3BhdXNlIiwiUElYSS5BdWRpb01hbmFnZXIuX3Jlc3VtZSIsIlBJWEkuQXVkaW9NYW5hZ2VyLl9wbGF5IiwiUElYSS5BdWRpb01hbmFnZXIuX3N0b3AiLCJQSVhJLkF1ZGlvTWFuYWdlci5fbXV0ZSIsIlBJWEkuQXVkaW9NYW5hZ2VyLl91bm11dGUiLCJQSVhJLkF1ZGlvTWFuYWdlci5fZ2V0TGluZXNCeUlkIiwiUElYSS5BdWRpb01hbmFnZXIuX2dldEF2YWlsYWJsZUxpbmVGcm9tIiwiUElYSS5BdWRpb01hbmFnZXIuY3JlYXRlR2Fpbk5vZGUiLCJQSVhJLkF1ZGlvIiwiUElYSS5BdWRpby5jb25zdHJ1Y3RvciIsIlBJWEkuQXVkaW8ucGxheSIsIlBJWEkuQXVkaW8uc3RvcCIsIlBJWEkuQXVkaW8ubXV0ZSIsIlBJWEkuQXVkaW8udW5tdXRlIiwiUElYSS5BdWRpby5wYXVzZSIsIlBJWEkuQXVkaW8ucmVzdW1lIiwiUElYSS5BdWRpby52b2x1bWUiLCJQSVhJLlBvb2wiLCJQSVhJLlBvb2wuY29uc3RydWN0b3IiLCJQSVhJLlBvb2wuX25ld09iamVjdCIsIlBJWEkuUG9vbC5fbmV3T2JqZWN0LnJldHVyblRvUG9vbCIsIlBJWEkuUG9vbC5wdXQiLCJQSVhJLlBvb2wuZ2V0IiwiUElYSS5Qb29sLmxlbmd0aCIsIl9uZXdPYmoiLCJQSVhJLl9uZXdPYmoiLCJ6RGlydHkiLCJzb3J0Q2hpbGRyZW5CeVpJbmRleCIsInBvc2l0aW9uIiwieCIsInZlbG9jaXR5IiwiZGVsdGFUaW1lIiwieSIsInJvdGF0aW9uIiwicm90YXRpb25TcGVlZCIsImkiLCJjaGlsZHJlbiIsInVwZGF0ZSIsIl9hZGRDaGlsZCIsImNhbGwiLCJjaGlsZCIsInpJbmRleEVuYWJsZWQiLCJwYXJlbnQiLCJhZGRDaGlsZCIsIkNvbnRhaW5lciIsIl9raWxsZWRPYmplY3RzIiwicHVzaCIsInJlbW92ZUNoaWxkIiwic29ydCIsImFaIiwiekluZGV4IiwiYloiLCJUd2VlbiIsIl96SW5kZXgiLCJ2YWx1ZSIsInBhdGgiLCJwYXJzZVBvaW50cyIsImRyYXdTaGFwZSIsInBvbHlnb24iXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0lDTEEsSUFBRyxDQUFDQSxJQUFKLEVBQVM7QUFBQSxRQUNMLE1BQU0sSUFBSUMsS0FBSixDQUFVLHdCQUFWLENBQU4sQ0FESztBQUFBO0lBSVQsSUFBTUMscUJBQUEsR0FBd0IsT0FBOUI7SUFDQSxJQUFNQyxZQUFBLEdBQWVILElBQUEs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Iiwic291cmNlc0NvbnRlbnQiOltudWxsLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9kZWZzL3BpeGkuanMuZC50c1wiIC8+XG5pZighUElYSSl7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdFeSEgV2hlcmUgaXMgcGl4aS5qcz8/Jyk7XG59XG5cbmNvbnN0IFBJWElfVkVSU0lPTl9SRVFVSVJFRCA9IFwiMy4wLjdcIjtcbmNvbnN0IFBJWElfVkVSU0lPTiA9IFBJWEkuVkVSU0lPTi5tYXRjaCgvXFxkLlxcZC5cXGQvKVswXTtcblxuaWYoUElYSV9WRVJTSU9OIDwgUElYSV9WRVJTSU9OX1JFUVVJUkVEKXtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJQaXhpLmpzIHZcIiArIFBJWEkuVkVSU0lPTiArIFwiIGl0J3Mgbm90IHN1cHBvcnRlZCwgcGxlYXNlIHVzZSBeXCIgKyBQSVhJX1ZFUlNJT05fUkVRVUlSRUQpO1xufVxuIiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi9BdWRpb01hbmFnZXIudHNcIiAvPlxudmFyIEhUTUxBdWRpbyA9IEF1ZGlvO1xubW9kdWxlIFBJWEkge1xuICAgIGV4cG9ydCBjbGFzcyBBdWRpb0xpbmUge1xuICAgICAgICBhdmFpbGFibGU6Ym9vbGVhbiA9IHRydWU7XG4gICAgICAgIGF1ZGlvOkF1ZGlvO1xuICAgICAgICBsb29wOmJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgcGF1c2VkOmJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgY2FsbGJhY2s6RnVuY3Rpb247XG4gICAgICAgIG11dGVkOmJvb2xlYW4gPSBmYWxzZTtcblxuICAgICAgICBzdGFydFRpbWU6bnVtYmVyID0gMDtcbiAgICAgICAgbGFzdFBhdXNlVGltZTpudW1iZXIgPSAwO1xuICAgICAgICBvZmZzZXRUaW1lOm51bWJlciA9IDA7XG5cbiAgICAgICAgcHJpdmF0ZSBfaHRtbEF1ZGlvOkhUTUxBdWRpb0VsZW1lbnQ7XG4gICAgICAgIHByaXZhdGUgX3dlYkF1ZGlvOkF1ZGlvQnVmZmVyU291cmNlTm9kZTtcblxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbWFuYWdlcjpBdWRpb01hbmFnZXIpe1xuICAgICAgICAgICAgaWYoIXRoaXMubWFuYWdlci5jb250ZXh0KXtcbiAgICAgICAgICAgICAgICB0aGlzLl9odG1sQXVkaW8gPSBuZXcgSFRNTEF1ZGlvKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5faHRtbEF1ZGlvLmFkZEV2ZW50TGlzdGVuZXIoJ2VuZGVkJywgdGhpcy5fb25FbmQuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzZXRBdWRpbyhhdWRpbzpBdWRpbywgbG9vcDpib29sZWFufEZ1bmN0aW9uLCBjYWxsYmFjaz86RnVuY3Rpb24pOkF1ZGlvTGluZXtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBsb29wID09PSBcImZ1bmN0aW9uXCIpe1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrID0gPEZ1bmN0aW9uPmxvb3A7XG4gICAgICAgICAgICAgICAgbG9vcCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmF1ZGlvID0gYXVkaW87XG4gICAgICAgICAgICB0aGlzLmF2YWlsYWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5sb29wID0gPGJvb2xlYW4+bG9vcDtcbiAgICAgICAgICAgIHRoaXMuY2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcGxheShwYXVzZT86Ym9vbGVhbik6QXVkaW9MaW5lIHtcbiAgICAgICAgICAgIGlmKCFwYXVzZSAmJiB0aGlzLnBhdXNlZClyZXR1cm4gdGhpcztcblxuICAgICAgICAgICAgaWYodGhpcy5tYW5hZ2VyLmNvbnRleHQpe1xuICAgICAgICAgICAgICAgIHRoaXMuX3dlYkF1ZGlvID0gdGhpcy5tYW5hZ2VyLmNvbnRleHQuY3JlYXRlQnVmZmVyU291cmNlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fd2ViQXVkaW8uc3RhcnQgPSB0aGlzLl93ZWJBdWRpby5zdGFydCB8fCB0aGlzLl93ZWJBdWRpby5ub3RlT247XG4gICAgICAgICAgICAgICAgdGhpcy5fd2ViQXVkaW8uc3RvcCA9IHRoaXMuX3dlYkF1ZGlvLnN0b3AgfHwgdGhpcy5fd2ViQXVkaW8ubm90ZU9mZjtcblxuICAgICAgICAgICAgICAgIHRoaXMuX3dlYkF1ZGlvLmJ1ZmZlciA9IHRoaXMuYXVkaW8uc291cmNlO1xuICAgICAgICAgICAgICAgIHRoaXMuX3dlYkF1ZGlvLmxvb3AgPSB0aGlzLmxvb3AgfHwgdGhpcy5hdWRpby5sb29wO1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRUaW1lID0gdGhpcy5tYW5hZ2VyLmNvbnRleHQuY3VycmVudFRpbWU7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl93ZWJBdWRpby5vbmVuZGVkID0gdGhpcy5fb25FbmQuYmluZCh0aGlzKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuX3dlYkF1ZGlvLmdhaW5Ob2RlID0gdGhpcy5tYW5hZ2VyLmNyZWF0ZUdhaW5Ob2RlKHRoaXMubWFuYWdlci5jb250ZXh0KTtcbiAgICAgICAgICAgICAgICB0aGlzLl93ZWJBdWRpby5nYWluTm9kZS5nYWluLnZhbHVlID0gKHRoaXMuYXVkaW8ubXV0ZWQgfHwgdGhpcy5tdXRlZCkgPyAwIDogdGhpcy5hdWRpby52b2x1bWU7XG4gICAgICAgICAgICAgICAgdGhpcy5fd2ViQXVkaW8uZ2Fpbk5vZGUuY29ubmVjdCh0aGlzLm1hbmFnZXIuZ2Fpbk5vZGUpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fd2ViQXVkaW8uY29ubmVjdCh0aGlzLl93ZWJBdWRpby5nYWluTm9kZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fd2ViQXVkaW8uc3RhcnQoMCwgKHBhdXNlKSA/IHRoaXMubGFzdFBhdXNlVGltZSA6IG51bGwpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgdGhpcy5faHRtbEF1ZGlvLnNyYyA9ICh0aGlzLmF1ZGlvLnNvdXJjZS5zcmMgIT09IFwiXCIpID8gdGhpcy5hdWRpby5zb3VyY2Uuc3JjIDogdGhpcy5hdWRpby5zb3VyY2UuY2hpbGRyZW5bMF0uc3JjO1xuICAgICAgICAgICAgICAgIHRoaXMuX2h0bWxBdWRpby5wcmVsb2FkID0gXCJhdXRvXCI7XG4gICAgICAgICAgICAgICAgdGhpcy5faHRtbEF1ZGlvLnZvbHVtZSA9ICh0aGlzLmF1ZGlvLm11dGVkIHx8IHRoaXMubXV0ZWQpID8gMCA6IHRoaXMuYXVkaW8udm9sdW1lO1xuICAgICAgICAgICAgICAgIHRoaXMuX2h0bWxBdWRpby5sb2FkKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5faHRtbEF1ZGlvLnBsYXkoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBzdG9wKCk6QXVkaW9MaW5lIHtcbiAgICAgICAgICAgIGlmKHRoaXMubWFuYWdlci5jb250ZXh0KXtcbiAgICAgICAgICAgICAgICB0aGlzLl93ZWJBdWRpby5zdG9wKDApO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgdGhpcy5faHRtbEF1ZGlvLnBhdXNlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5faHRtbEF1ZGlvLmN1cnJlbnRUaW1lID0gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwYXVzZSgpOkF1ZGlvTGluZXtcbiAgICAgICAgICAgIGlmKHRoaXMubWFuYWdlci5jb250ZXh0KXtcbiAgICAgICAgICAgICAgICB0aGlzLm9mZnNldFRpbWUgKz0gdGhpcy5tYW5hZ2VyLmNvbnRleHQuY3VycmVudFRpbWUgLSB0aGlzLnN0YXJ0VGltZTtcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RQYXVzZVRpbWUgPSB0aGlzLm9mZnNldFRpbWUldGhpcy5fd2ViQXVkaW8uYnVmZmVyLmR1cmF0aW9uO1xuICAgICAgICAgICAgICAgIHRoaXMuX3dlYkF1ZGlvLnN0b3AoMCk7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICB0aGlzLl9odG1sQXVkaW8ucGF1c2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucGF1c2VkID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzdW1lKCk6QXVkaW9MaW5le1xuICAgICAgICAgICAgaWYodGhpcy5wYXVzZWQpe1xuICAgICAgICAgICAgICAgIGlmKHRoaXMubWFuYWdlci5jb250ZXh0KXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbGF5KHRydWUpO1xuICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9odG1sQXVkaW8ucGxheSgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMucGF1c2VkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIG11dGUoKTpBdWRpb0xpbmV7XG4gICAgICAgICAgICB0aGlzLm11dGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmKHRoaXMubWFuYWdlci5jb250ZXh0KXtcbiAgICAgICAgICAgICAgICB0aGlzLl93ZWJBdWRpby5nYWluTm9kZS5nYWluLnZhbHVlID0gMDtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHRoaXMuX2h0bWxBdWRpby52b2x1bWUgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICB1bm11dGUoKTpBdWRpb0xpbmV7XG4gICAgICAgICAgICB0aGlzLm11dGVkID0gZmFsc2U7XG4gICAgICAgICAgICBpZih0aGlzLm1hbmFnZXIuY29udGV4dCl7XG4gICAgICAgICAgICAgICAgdGhpcy5fd2ViQXVkaW8uZ2Fpbk5vZGUuZ2Fpbi52YWx1ZSA9IHRoaXMuYXVkaW8udm9sdW1lO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgdGhpcy5faHRtbEF1ZGlvLnZvbHVtZSA9IHRoaXMuYXVkaW8udm9sdW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICB2b2x1bWUodmFsdWU6bnVtYmVyKTpBdWRpb0xpbmV7XG4gICAgICAgICAgICBpZih0aGlzLm1hbmFnZXIuY29udGV4dCl7XG4gICAgICAgICAgICAgICAgdGhpcy5fd2ViQXVkaW8uZ2Fpbk5vZGUuZ2Fpbi52YWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgdGhpcy5faHRtbEF1ZGlvLnZvbHVtZSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICByZXNldCgpOkF1ZGlvTGluZXtcbiAgICAgICAgICAgIHRoaXMuYXZhaWxhYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuYXVkaW8gPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5sb29wID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmNhbGxiYWNrID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMucGF1c2VkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLm11dGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLl93ZWJBdWRpbyA9IG51bGw7XG5cbiAgICAgICAgICAgIHRoaXMuc3RhcnRUaW1lID0gMDtcbiAgICAgICAgICAgIHRoaXMubGFzdFBhdXNlVGltZSA9IDA7XG4gICAgICAgICAgICB0aGlzLm9mZnNldFRpbWUgPSAwO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9vbkVuZCgpOnZvaWR7XG4gICAgICAgICAgICBpZih0aGlzLmNhbGxiYWNrKXRoaXMuY2FsbGJhY2sodGhpcy5tYW5hZ2VyLCB0aGlzLmF1ZGlvKTtcbiAgICAgICAgICAgIGlmKCF0aGlzLm1hbmFnZXIuY29udGV4dCl7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5sb29wIHx8IHRoaXMuYXVkaW8ubG9vcCl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2h0bWxBdWRpby5jdXJyZW50VGltZSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2h0bWxBdWRpby5wbGF5KCk7XG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9ZWxzZSBpZih0aGlzLm1hbmFnZXIuY29udGV4dCAmJiAhdGhpcy5wYXVzZWQpe1xuICAgICAgICAgICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxufVxuXG5pbnRlcmZhY2UgQXVkaW9CdWZmZXJTb3VyY2VOb2RlIHtcbiAgICBub3RlT24oKTpBdWRpb0J1ZmZlclNvdXJjZU5vZGU7XG4gICAgbm90ZU9mZigpOkF1ZGlvQnVmZmVyU291cmNlTm9kZTtcbiAgICBzb3VyY2U6QXVkaW9CdWZmZXI7XG4gICAgZ2Fpbk5vZGU6R2Fpbk5vZGU7XG59IiwibW9kdWxlIFBJWEkge1xuICAgIGV4cG9ydCBlbnVtIEdBTUVfU0NBTEVfVFlQRSB7XG4gICAgICAgIE5PTkUsXG4gICAgICAgIEZJTEwsXG4gICAgICAgIEFTUEVDVF9GSVQsXG4gICAgICAgIEFTUEVDVF9GSUxMXG4gICAgfVxuXG4gICAgZXhwb3J0IGVudW0gQVVESU9fVFlQRSB7XG4gICAgICAgIFVOS05PV04sXG4gICAgICAgIFdFQkFVRElPLFxuICAgICAgICBIVE1MQVVESU9cbiAgICB9XG5cbiAgICBleHBvcnQgdmFyIHpJbmRleEVuYWJsZWQ6Ym9vbGVhbiA9IHRydWU7XG59IiwiLy9NYW55IGNoZWNrcyBhcmUgYmFzZWQgb24gaHR0cHM6Ly9naXRodWIuY29tL2FyYXNhdGFzYXlnaW4vaXMuanMvYmxvYi9tYXN0ZXIvaXMuanNcblxubW9kdWxlIFBJWEkge1xuICAgIGV4cG9ydCBtb2R1bGUgRGV2aWNlIHtcbiAgICAgICAgdmFyIG5hdmlnYXRvcjpOYXZpZ2F0b3IgPSB3aW5kb3cubmF2aWdhdG9yO1xuICAgICAgICB2YXIgZG9jdW1lbnQ6RG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG5cbiAgICAgICAgdmFyIHVzZXJBZ2VudDpzdHJpbmcgPSAnbmF2aWdhdG9yJyBpbiB3aW5kb3cgJiYgJ3VzZXJBZ2VudCcgaW4gbmF2aWdhdG9yICYmIG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKSB8fCAnJyxcbiAgICAgICAgICAgIHZlbmRvcjpzdHJpbmcgPSAnbmF2aWdhdG9yJyBpbiB3aW5kb3cgJiYgJ3ZlbmRvcicgaW4gbmF2aWdhdG9yICYmIG5hdmlnYXRvci52ZW5kb3IudG9Mb3dlckNhc2UoKSB8fCAnJyxcbiAgICAgICAgICAgIGFwcFZlcnNpb246c3RyaW5nID0gJ25hdmlnYXRvcicgaW4gd2luZG93ICYmICdhcHBWZXJzaW9uJyBpbiBuYXZpZ2F0b3IgJiYgbmF2aWdhdG9yLmFwcFZlcnNpb24udG9Mb3dlckNhc2UoKSB8fCAnJztcblxuICAgICAgICAvL0Jyb3dzZXJzXG4gICAgICAgIGV4cG9ydCB2YXIgaXNDaHJvbWU6Ym9vbGVhbiA9IC9jaHJvbWV8Y2hyb21pdW0vaS50ZXN0KHVzZXJBZ2VudCkgJiYgL2dvb2dsZSBpbmMvLnRlc3QodmVuZG9yKSxcbiAgICAgICAgICAgIGlzRmlyZWZveDpib29sZWFuID0gL2ZpcmVmb3gvaS50ZXN0KHVzZXJBZ2VudCksXG4gICAgICAgICAgICBpc0lFOmJvb2xlYW4gPSAvbXNpZS9pLnRlc3QodXNlckFnZW50KSB8fCBcIkFjdGl2ZVhPYmplY3RcIiBpbiB3aW5kb3csXG4gICAgICAgICAgICBpc09wZXJhOmJvb2xlYW4gPSAvXk9wZXJhXFwvLy50ZXN0KHVzZXJBZ2VudCkgfHwgL1xceDIwT1BSXFwvLy50ZXN0KHVzZXJBZ2VudCksXG4gICAgICAgICAgICBpc1NhZmFyaTpib29sZWFuID0gL3NhZmFyaS9pLnRlc3QodXNlckFnZW50KSAmJiAvYXBwbGUgY29tcHV0ZXIvaS50ZXN0KHZlbmRvcik7XG5cbiAgICAgICAgLy9EZXZpY2VzICYmIE9TXG4gICAgICAgIGV4cG9ydCB2YXIgaXNJcGhvbmU6Ym9vbGVhbiA9IC9pcGhvbmUvaS50ZXN0KHVzZXJBZ2VudCksXG4gICAgICAgICAgICBpc0lwYWQ6Ym9vbGVhbiA9IC9pcGFkL2kudGVzdCh1c2VyQWdlbnQpLFxuICAgICAgICAgICAgaXNJcG9kOmJvb2xlYW4gPSAvaXBvZC9pLnRlc3QodXNlckFnZW50KSxcbiAgICAgICAgICAgIGlzQW5kcm9pZDpib29sZWFuID0gL2FuZHJvaWQvaS50ZXN0KHVzZXJBZ2VudCksXG4gICAgICAgICAgICBpc0FuZHJvaWRQaG9uZTpib29sZWFuID0gL2FuZHJvaWQvaS50ZXN0KHVzZXJBZ2VudCkgJiYgL21vYmlsZS9pLnRlc3QodXNlckFnZW50KSxcbiAgICAgICAgICAgIGlzQW5kcm9pZFRhYmxldDpib29sZWFuID0gL2FuZHJvaWQvaS50ZXN0KHVzZXJBZ2VudCkgJiYgIS9tb2JpbGUvaS50ZXN0KHVzZXJBZ2VudCksXG4gICAgICAgICAgICBpc0xpbnV4OmJvb2xlYW4gPSAvbGludXgvaS50ZXN0KGFwcFZlcnNpb24pLFxuICAgICAgICAgICAgaXNNYWM6Ym9vbGVhbiA9IC9tYWMvaS50ZXN0KGFwcFZlcnNpb24pLFxuICAgICAgICAgICAgaXNXaW5kb3c6Ym9vbGVhbiA9IC93aW4vaS50ZXN0KGFwcFZlcnNpb24pLFxuICAgICAgICAgICAgaXNXaW5kb3dQaG9uZTpib29sZWFuID0gaXNXaW5kb3cgJiYgL3Bob25lL2kudGVzdCh1c2VyQWdlbnQpLFxuICAgICAgICAgICAgaXNXaW5kb3dUYWJsZXQ6Ym9vbGVhbiA9IGlzV2luZG93ICYmICFpc1dpbmRvd1Bob25lICYmIC90b3VjaC9pLnRlc3QodXNlckFnZW50KSxcbiAgICAgICAgICAgIGlzTW9iaWxlOmJvb2xlYW4gPSBpc0lwaG9uZSB8fCBpc0lwb2R8fCBpc0FuZHJvaWRQaG9uZSB8fCBpc1dpbmRvd1Bob25lLFxuICAgICAgICAgICAgaXNUYWJsZXQ6Ym9vbGVhbiA9IGlzSXBhZCB8fCBpc0FuZHJvaWRUYWJsZXQgfHwgaXNXaW5kb3dUYWJsZXQsXG4gICAgICAgICAgICBpc0Rlc2t0b3A6Ym9vbGVhbiA9ICFpc01vYmlsZSAmJiAhaXNUYWJsZXQsXG4gICAgICAgICAgICBpc1RvdWNoRGV2aWNlOmJvb2xlYW4gPSAnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cgfHwnRG9jdW1lbnRUb3VjaCcgaW4gd2luZG93ICYmIGRvY3VtZW50IGluc3RhbmNlb2YgRG9jdW1lbnRUb3VjaCxcbiAgICAgICAgICAgIGlzQ29jb29uOmJvb2xlYW4gPSAhIW5hdmlnYXRvci5pc0NvY29vbkpTLFxuICAgICAgICAgICAgaXNOb2RlV2Via2l0OmJvb2xlYW4gPSAhISh0eXBlb2YgcHJvY2VzcyA9PT0gXCJvYmplY3RcIiAmJiBwcm9jZXNzLnRpdGxlID09PSBcIm5vZGVcIiAmJiB0eXBlb2YgZ2xvYmFsID09PSBcIm9iamVjdFwiKSxcbiAgICAgICAgICAgIGlzRWplY3RhOmJvb2xlYW4gPSAhIXdpbmRvdy5lamVjdGEsXG4gICAgICAgICAgICBpc0Nyb3Nzd2Fsazpib29sZWFuID0gL0Nyb3Nzd2Fsay8udGVzdCh1c2VyQWdlbnQpLFxuICAgICAgICAgICAgaXNDb3Jkb3ZhOmJvb2xlYW4gPSAhIXdpbmRvdy5jb3Jkb3ZhLFxuICAgICAgICAgICAgaXNFbGVjdHJvbjpib29sZWFuID0gISEodHlwZW9mIHByb2Nlc3MgPT09IFwib2JqZWN0XCIgJiYgcHJvY2Vzcy52ZXJzaW9ucyAmJiAocHJvY2Vzcy52ZXJzaW9ucy5lbGVjdHJvbiB8fCBwcm9jZXNzLnZlcnNpb25zWydhdG9tLXNoZWxsJ10pKTtcblxuICAgICAgICBuYXZpZ2F0b3IudmlicmF0ZSA9IG5hdmlnYXRvci52aWJyYXRlIHx8IG5hdmlnYXRvci53ZWJraXRWaWJyYXRlIHx8IG5hdmlnYXRvci5tb3pWaWJyYXRlIHx8IG5hdmlnYXRvci5tc1ZpYnJhdGUgfHwgbnVsbDtcbiAgICAgICAgZXhwb3J0IHZhciBpc1ZpYnJhdGVTdXBwb3J0ZWQ6Ym9vbGVhbiA9ICEhbmF2aWdhdG9yLnZpYnJhdGUgJiYgKGlzTW9iaWxlIHx8IGlzVGFibGV0KSxcbiAgICAgICAgICAgIGlzTW91c2VXaGVlbFN1cHBvcnRlZDpib29sZWFuID0gJ29ud2hlZWwnIGluIHdpbmRvdyB8fCAnb25tb3VzZXdoZWVsJyBpbiB3aW5kb3cgfHwgJ01vdXNlU2Nyb2xsRXZlbnQnIGluIHdpbmRvdyxcbiAgICAgICAgICAgIGlzQWNjZWxlcm9tZXRlclN1cHBvcnRlZDpib29sZWFuID0gJ0RldmljZU1vdGlvbkV2ZW50JyBpbiB3aW5kb3csXG4gICAgICAgICAgICBpc0dhbWVwYWRTdXBwb3J0ZWQ6Ym9vbGVhbiA9ICEhbmF2aWdhdG9yLmdldEdhbWVwYWRzIHx8ICEhbmF2aWdhdG9yLndlYmtpdEdldEdhbWVwYWRzO1xuXG4gICAgICAgIC8vRnVsbFNjcmVlblxuICAgICAgICB2YXIgZGl2OkhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHZhciBmdWxsU2NyZWVuUmVxdWVzdFZlbmRvcjphbnkgPSBkaXYucmVxdWVzdEZ1bGxzY3JlZW4gfHwgZGl2LndlYmtpdFJlcXVlc3RGdWxsU2NyZWVuIHx8IGRpdi5tc1JlcXVlc3RGdWxsU2NyZWVuIHx8IGRpdi5tb3pSZXF1ZXN0RnVsbFNjcmVlbixcbiAgICAgICAgICAgIGZ1bGxTY3JlZW5DYW5jZWxWZW5kb3I6YW55ID0gZG9jdW1lbnQuY2FuY2VsRnVsbFNjcmVlbiB8fCBkb2N1bWVudC5leGl0RnVsbFNjcmVlbiB8fCBkb2N1bWVudC53ZWJraXRDYW5jZWxGdWxsU2NyZWVuIHx8IGRvY3VtZW50Lm1zQ2FuY2VsRnVsbFNjcmVlbiB8fCBkb2N1bWVudC5tb3pDYW5jZWxGdWxsU2NyZWVuO1xuXG4gICAgICAgIGV4cG9ydCB2YXIgaXNGdWxsU2NyZWVuU3VwcG9ydGVkOmJvb2xlYW4gPSAhIShmdWxsU2NyZWVuUmVxdWVzdCAmJiBmdWxsU2NyZWVuQ2FuY2VsKSxcbiAgICAgICAgICAgIGZ1bGxTY3JlZW5SZXF1ZXN0OnN0cmluZyA9IChmdWxsU2NyZWVuUmVxdWVzdFZlbmRvcikgPyBmdWxsU2NyZWVuUmVxdWVzdFZlbmRvci5uYW1lIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgZnVsbFNjcmVlbkNhbmNlbDpzdHJpbmcgPSAoZnVsbFNjcmVlbkNhbmNlbFZlbmRvcikgPyBmdWxsU2NyZWVuQ2FuY2VsVmVuZG9yLm5hbWUgOiB1bmRlZmluZWQ7XG5cbiAgICAgICAgLy9BdWRpb1xuICAgICAgICBleHBvcnQgdmFyIGlzSFRNTEF1ZGlvU3VwcG9ydGVkOmJvb2xlYW4gPSAhIXdpbmRvdy5BdWRpbyxcbiAgICAgICAgICAgIHdlYkF1ZGlvQ29udGV4dDphbnkgPSB3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQsXG4gICAgICAgICAgICBpc1dlYkF1ZGlvU3VwcG9ydGVkOmJvb2xlYW4gPSAhIXdlYkF1ZGlvQ29udGV4dCxcbiAgICAgICAgICAgIGlzQXVkaW9TdXBwb3J0ZWQ6Ym9vbGVhbiA9IGlzV2ViQXVkaW9TdXBwb3J0ZWQgfHwgaXNIVE1MQXVkaW9TdXBwb3J0ZWQsXG4gICAgICAgICAgICBpc01wM1N1cHBvcnRlZDpib29sZWFuID0gZmFsc2UsXG4gICAgICAgICAgICBpc09nZ1N1cHBvcnRlZDpib29sZWFuID0gZmFsc2UsXG4gICAgICAgICAgICBpc1dhdlN1cHBvcnRlZDpib29sZWFuID0gZmFsc2UsXG4gICAgICAgICAgICBpc000YVN1cHBvcnRlZDpib29sZWFuID0gZmFsc2UsXG4gICAgICAgICAgICBnbG9iYWxXZWJBdWRpb0NvbnRleHQ6QXVkaW9Db250ZXh0ID0gKGlzV2ViQXVkaW9TdXBwb3J0ZWQpID8gbmV3IHdlYkF1ZGlvQ29udGV4dCgpIDogdW5kZWZpbmVkO1xuXG4gICAgICAgIC8vQXVkaW8gbWltZVR5cGVzXG4gICAgICAgIGlmKGlzQXVkaW9TdXBwb3J0ZWQpe1xuICAgICAgICAgICAgdmFyIGF1ZGlvOkhUTUxBdWRpb0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhdWRpbycpO1xuICAgICAgICAgICAgaXNNcDNTdXBwb3J0ZWQgPSBhdWRpby5jYW5QbGF5VHlwZSgnYXVkaW8vbXBlZzsnKSAhPT0gXCJcIjtcbiAgICAgICAgICAgIGlzT2dnU3VwcG9ydGVkID0gYXVkaW8uY2FuUGxheVR5cGUoJ2F1ZGlvL29nZzsgY29kZWNzPVwidm9yYmlzXCInKSAhPT0gXCJcIjtcbiAgICAgICAgICAgIGlzV2F2U3VwcG9ydGVkID0gYXVkaW8uY2FuUGxheVR5cGUoJ2F1ZGlvL3dhdicpICE9PSBcIlwiO1xuICAgICAgICAgICAgaXNNNGFTdXBwb3J0ZWQgPSBhdWRpby5jYW5QbGF5VHlwZSgnYXVkaW8vbXA0OyBjb2RlY3M9XCJtcDRhLjQwLjVcIicpICE9PSBcIlwiO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIGdldE1vdXNlV2hlZWxFdmVudCgpOnN0cmluZ3tcbiAgICAgICAgICAgIGlmKCFpc01vdXNlV2hlZWxTdXBwb3J0ZWQpcmV0dXJuO1xuICAgICAgICAgICAgdmFyIGV2dDpzdHJpbmc7XG4gICAgICAgICAgICBpZignb253aGVlbCcgaW4gd2luZG93KXtcbiAgICAgICAgICAgICAgICBldnQgPSAnd2hlZWwnO1xuICAgICAgICAgICAgfWVsc2UgaWYoJ29ubW91c2V3aGVlbCcgaW4gd2luZG93KXtcbiAgICAgICAgICAgICAgICBldnQgPSAnbW91c2V3aGVlbCc7XG4gICAgICAgICAgICB9ZWxzZSBpZignTW91c2VTY3JvbGxFdmVudCcgaW4gd2luZG93KXtcbiAgICAgICAgICAgICAgICBldnQgPSAnRE9NTW91c2VTY3JvbGwnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZXZ0O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIHZpYnJhdGUocGF0dGVybjogbnVtYmVyIHwgbnVtYmVyW10pOnZvaWR7XG4gICAgICAgICAgICBpZihpc1ZpYnJhdGVTdXBwb3J0ZWQpe1xuICAgICAgICAgICAgICAgIG5hdmlnYXRvci52aWJyYXRlKHBhdHRlcm4pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIGdldFZpc2liaWxpdHlDaGFuZ2VFdmVudCgpOnN0cmluZ3tcbiAgICAgICAgICAgIGlmKHR5cGVvZiBkb2N1bWVudC5oaWRkZW4gIT09ICd1bmRlZmluZWQnKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ3Zpc2liaWxpdHljaGFuZ2UnO1xuICAgICAgICAgICAgfWVsc2UgaWYodHlwZW9mIGRvY3VtZW50LndlYmtpdEhpZGRlbiAhPT0gJ3VuZGVmaW5lZCcpe1xuICAgICAgICAgICAgICAgIHJldHVybiAnd2Via2l0dmlzaWJpbGl0eWNoYW5nZSc7XG4gICAgICAgICAgICB9ZWxzZSBpZih0eXBlb2YgZG9jdW1lbnQubW96SGlkZGVuICE9PSAndW5kZWZpbmVkJyl7XG4gICAgICAgICAgICAgICAgcmV0dXJuICdtb3p2aXNpYmlsaXR5Y2hhbmdlJztcbiAgICAgICAgICAgIH1lbHNlIGlmKHR5cGVvZiBkb2N1bWVudC5tc0hpZGRlbiAhPT0gJ3VuZGVmaW5lZCcpe1xuICAgICAgICAgICAgICAgIHJldHVybiAnbXN2aXNpYmlsaXR5Y2hhbmdlJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBpc09ubGluZSgpOmJvb2xlYW57XG4gICAgICAgICAgICByZXR1cm4gd2luZG93Lm5hdmlnYXRvci5vbkxpbmU7XG4gICAgICAgIH1cblxuXG4gICAgfVxufVxuXG5kZWNsYXJlIHZhciBwcm9jZXNzOmFueSxcbiAgICBEb2N1bWVudFRvdWNoOmFueSxcbiAgICBnbG9iYWw6YW55O1xuXG5pbnRlcmZhY2UgTmF2aWdhdG9yIHtcbiAgICBpc0NvY29vbkpTOmFueTtcbiAgICB2aWJyYXRlKHBhdHRlcm46IG51bWJlciB8IG51bWJlcltdKTpib29sZWFuO1xuICAgIGdldEdhbWVwYWRzKCk6YW55O1xuICAgIHdlYmtpdEdldEdhbWVwYWRzKCk6YW55O1xuICAgIHdlYmtpdFZpYnJhdGUoKTphbnk7XG4gICAgbW96VmlicmF0ZSgpOmFueTtcbiAgICBtc1ZpYnJhdGUoKTphbnk7XG59XG5cbmludGVyZmFjZSBXaW5kb3cge1xuICAgIGVqZWN0YTphbnk7XG4gICAgY29yZG92YTphbnk7XG4gICAgQXVkaW8oKTpIVE1MQXVkaW9FbGVtZW50O1xuICAgIEF1ZGlvQ29udGV4dCgpOmFueTtcbiAgICB3ZWJraXRBdWRpb0NvbnRleHQoKTphbnk7XG59XG5cbmludGVyZmFjZSBmdWxsU2NyZWVuRGF0YSB7XG4gICAgbmFtZTpzdHJpbmc7XG59XG5cbmludGVyZmFjZSBEb2N1bWVudCB7XG4gICAgY2FuY2VsRnVsbFNjcmVlbigpOmZ1bGxTY3JlZW5EYXRhIDtcbiAgICBleGl0RnVsbFNjcmVlbigpOmZ1bGxTY3JlZW5EYXRhIDtcbiAgICB3ZWJraXRDYW5jZWxGdWxsU2NyZWVuKCk6ZnVsbFNjcmVlbkRhdGEgO1xuICAgIG1zQ2FuY2VsRnVsbFNjcmVlbigpOmZ1bGxTY3JlZW5EYXRhIDtcbiAgICBtb3pDYW5jZWxGdWxsU2NyZWVuKCk6ZnVsbFNjcmVlbkRhdGEgO1xuICAgIHdlYmtpdEhpZGRlbjphbnk7XG4gICAgbW96SGlkZGVuOmFueTtcbn1cblxuaW50ZXJmYWNlIEhUTUxEaXZFbGVtZW50IHtcbiAgICByZXF1ZXN0RnVsbHNjcmVlbigpOmZ1bGxTY3JlZW5EYXRhIDtcbiAgICB3ZWJraXRSZXF1ZXN0RnVsbFNjcmVlbigpOmZ1bGxTY3JlZW5EYXRhIDtcbiAgICBtc1JlcXVlc3RGdWxsU2NyZWVuKCk6ZnVsbFNjcmVlbkRhdGEgO1xuICAgIG1velJlcXVlc3RGdWxsU2NyZWVuKCk6ZnVsbFNjcmVlbkRhdGEgO1xufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2RlZnMvcGl4aS5qcy5kLnRzXCIgLz5cbm1vZHVsZSBQSVhJIHtcbiAgICBleHBvcnQgY2xhc3MgQ2FtZXJhIGV4dGVuZHMgQ29udGFpbmVyIHtcbiAgICAgICAgdmlzaWJsZTpib29sZWFuID0gZmFsc2U7XG4gICAgICAgIF9lbmFibGVkOmJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgekluZGV4Om51bWJlciA9IEluZmluaXR5O1xuICAgICAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZShkZWx0YVRpbWU6bnVtYmVyKTpDYW1lcmF7XG4gICAgICAgICAgICBpZighdGhpcy5lbmFibGVkKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc3VwZXIudXBkYXRlKGRlbHRhVGltZSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBlbmFibGVkKCk6Ym9vbGVhbntcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9lbmFibGVkO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0IGVuYWJsZWQodmFsdWU6Ym9vbGVhbil7XG4gICAgICAgICAgICB0aGlzLl9lbmFibGVkID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLnZpc2libGUgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9kZWZzL3BpeGkuanMuZC50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuL1RpbWVyTWFuYWdlci50c1wiIC8+XG5tb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IGNsYXNzIFRpbWVyIHtcbiAgICAgICAgYWN0aXZlOmJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgaXNFbmRlZDpib29sZWFuID0gZmFsc2U7XG4gICAgICAgIGlzU3RhcnRlZDpib29sZWFuID0gZmFsc2U7XG4gICAgICAgIGV4cGlyZTpib29sZWFuID0gZmFsc2U7XG4gICAgICAgIGRlbGF5Om51bWJlciA9IDA7XG4gICAgICAgIHJlcGVhdDpudW1iZXIgPSAwO1xuICAgICAgICBsb29wOmJvb2xlYW4gPSBmYWxzZTtcblxuICAgICAgICBwcml2YXRlIF9kZWxheVRpbWU6bnVtYmVyID0gMDtcbiAgICAgICAgcHJpdmF0ZSBfZWxhcHNlZFRpbWU6bnVtYmVyID0gMDtcbiAgICAgICAgcHJpdmF0ZSBfcmVwZWF0Om51bWJlciA9IDA7XG5cbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIHRpbWU6bnVtYmVyID0gMSwgcHVibGljIG1hbmFnZXI/OlRpbWVyTWFuYWdlcil7XG4gICAgICAgICAgICBpZih0aGlzLm1hbmFnZXIpe1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkVG8odGhpcy5tYW5hZ2VyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZShkZWx0YVRpbWU6bnVtYmVyKTpUaW1lcntcbiAgICAgICAgICAgIGlmKCF0aGlzLmFjdGl2ZSlyZXR1cm4gdGhpcztcbiAgICAgICAgICAgIHZhciBkZWx0YU1TOm51bWJlciA9IGRlbHRhVGltZSoxMDAwO1xuXG4gICAgICAgICAgICBpZih0aGlzLmRlbGF5ID4gdGhpcy5fZGVsYXlUaW1lKXtcbiAgICAgICAgICAgICAgICB0aGlzLl9kZWxheVRpbWUgKz0gZGVsdGFNUztcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoIXRoaXMuaXNTdGFydGVkKXtcbiAgICAgICAgICAgICAgICB0aGlzLmlzU3RhcnRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5fb25UaW1lclN0YXJ0KHRoaXMuX2VsYXBzZWRUaW1lLCBkZWx0YVRpbWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZih0aGlzLnRpbWUgPiB0aGlzLl9lbGFwc2VkVGltZSl7XG4gICAgICAgICAgICAgICAgdmFyIHQ6bnVtYmVyID0gdGhpcy5fZWxhcHNlZFRpbWUrZGVsdGFNUztcbiAgICAgICAgICAgICAgICB2YXIgZW5kZWQ6Ym9vbGVhbiA9ICh0Pj10aGlzLnRpbWUpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fZWxhcHNlZFRpbWUgPSAoZW5kZWQpID8gdGhpcy50aW1lIDogdDtcbiAgICAgICAgICAgICAgICB0aGlzLl9vblRpbWVyVXBkYXRlKHRoaXMuX2VsYXBzZWRUaW1lLCBkZWx0YVRpbWUpO1xuXG4gICAgICAgICAgICAgICAgaWYoZW5kZWQpe1xuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmxvb3AgfHwgdGhpcy5yZXBlYXQgPiB0aGlzLl9yZXBlYXQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVwZWF0Kys7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9vblRpbWVyUmVwZWF0KHRoaXMuX2VsYXBzZWRUaW1lLCBkZWx0YVRpbWUsIHRoaXMuX3JlcGVhdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGFwc2VkVGltZSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNFbmRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWN0aXZlICA9ZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX29uVGltZXJFbmQodGhpcy5fZWxhcHNlZFRpbWUsIGRlbHRhVGltZSk7XG4gICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgYWRkVG8odGltZXJNYW5hZ2VyOlRpbWVyTWFuYWdlcik6VGltZXIge1xuICAgICAgICAgICAgdGltZXJNYW5hZ2VyLmFkZFRpbWVyKHRoaXMpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICByZW1vdmUoKTpUaW1lcntcbiAgICAgICAgICAgIGlmKCF0aGlzLm1hbmFnZXIpe1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRpbWVyIHdpdGhvdXQgbWFuYWdlci5cIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5yZW1vdmVUaW1lcih0aGlzKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhcnQoKTpUaW1lcntcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RvcCgpOlRpbWVye1xuICAgICAgICAgICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuX29uVGltZXJTdG9wKHRoaXMuX2VsYXBzZWRUaW1lKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzZXQoKTpUaW1lcntcbiAgICAgICAgICAgIHRoaXMuX2VsYXBzZWRUaW1lID0gMDtcbiAgICAgICAgICAgIHRoaXMuX3JlcGVhdCA9IDA7XG4gICAgICAgICAgICB0aGlzLl9kZWxheVRpbWUgPSAwO1xuICAgICAgICAgICAgdGhpcy5pc1N0YXJ0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuaXNFbmRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBvblN0YXJ0KGNhbGxiYWNrOkZ1bmN0aW9uKTpUaW1lcntcbiAgICAgICAgICAgIHRoaXMuX29uVGltZXJTdGFydCA9IDxhbnk+Y2FsbGJhY2s7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIG9uRW5kKGNhbGxiYWNrOkZ1bmN0aW9uKTpUaW1lcntcbiAgICAgICAgICAgIHRoaXMuX29uVGltZXJFbmQgPSA8YW55PmNhbGxiYWNrO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBvblN0b3AoY2FsbGJhY2s6RnVuY3Rpb24pOlRpbWVye1xuICAgICAgICAgICAgdGhpcy5fb25UaW1lclN0b3AgPSA8YW55PmNhbGxiYWNrO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBvblVwZGF0ZShjYWxsYmFjazpGdW5jdGlvbik6VGltZXJ7XG4gICAgICAgICAgICB0aGlzLl9vblRpbWVyVXBkYXRlID0gPGFueT5jYWxsYmFjaztcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgb25SZXBlYXQoY2FsbGJhY2s6RnVuY3Rpb24pOlRpbWVye1xuICAgICAgICAgICAgdGhpcy5fb25UaW1lclJlcGVhdCA9IDxhbnk+Y2FsbGJhY2s7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX29uVGltZXJTdGFydChlbGFwc2VkVGltZTpudW1iZXIsIGRlbHRhVGltZTpudW1iZXIpOnZvaWR7fVxuICAgICAgICBwcml2YXRlIF9vblRpbWVyU3RvcChlbGFwc2VkVGltZTpudW1iZXIpOnZvaWR7fVxuICAgICAgICBwcml2YXRlIF9vblRpbWVyUmVwZWF0KGVsYXBzZWRUaW1lOm51bWJlciwgZGVsdGFUaW1lOm51bWJlciwgcmVwZWF0Om51bWJlcik6dm9pZHt9XG4gICAgICAgIHByaXZhdGUgX29uVGltZXJVcGRhdGUoZWxhcHNlZFRpbWU6bnVtYmVyLCBkZWx0YVRpbWU6bnVtYmVyKTp2b2lke31cbiAgICAgICAgcHJpdmF0ZSBfb25UaW1lckVuZChlbGFwc2VkVGltZTpudW1iZXIsIGRlbHRhVGltZTpudW1iZXIpOnZvaWR7fVxuICAgIH1cbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9kZWZzL3BpeGkuanMuZC50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuL1RpbWVyLnRzXCIgLz5cbm1vZHVsZSBQSVhJIHtcbiAgICBleHBvcnQgY2xhc3MgVGltZXJNYW5hZ2VyIHtcbiAgICAgICAgdGltZXJzOlRpbWVyW10gPSBbXTtcbiAgICAgICAgX3RvRGVsZXRlOlRpbWVyW10gPSBbXTtcblxuICAgICAgICBjb25zdHJ1Y3Rvcigpe31cblxuICAgICAgICB1cGRhdGUoZGVsdGFUaW1lOm51bWJlcik6VGltZXJNYW5hZ2Vye1xuICAgICAgICAgICAgZm9yKHZhciBpOm51bWJlciA9IDA7IGkgPCB0aGlzLnRpbWVycy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgaWYodGhpcy50aW1lcnNbaV0uYWN0aXZlKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50aW1lcnNbaV0udXBkYXRlKGRlbHRhVGltZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMudGltZXJzW2ldLmlzRW5kZWQgJiYgdGhpcy50aW1lcnNbaV0uZXhwaXJlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGltZXJzW2ldLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZih0aGlzLl90b0RlbGV0ZS5sZW5ndGgpe1xuICAgICAgICAgICAgICAgIGZvcihpID0gMDsgaSA8IHRoaXMuX3RvRGVsZXRlLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVtb3ZlKHRoaXMuX3RvRGVsZXRlW2ldKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLl90b0RlbGV0ZS5sZW5ndGggPSAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZVRpbWVyKHRpbWVyOlRpbWVyKTpUaW1lck1hbmFnZXJ7XG4gICAgICAgICAgICB0aGlzLl90b0RlbGV0ZS5wdXNoKHRpbWVyKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgYWRkVGltZXIodGltZXI6VGltZXIpOlRpbWVye1xuICAgICAgICAgICAgdGltZXIubWFuYWdlciA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLnRpbWVycy5wdXNoKHRpbWVyKTtcbiAgICAgICAgICAgIHJldHVybiB0aW1lcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNyZWF0ZVRpbWVyKHRpbWU/Om51bWJlcil7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFRpbWVyKHRpbWUsIHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfcmVtb3ZlKHRpbWVyOlRpbWVyKTp2b2lke1xuICAgICAgICAgICAgdmFyIGluZGV4Om51bWJlciA9IHRoaXMudGltZXJzLmluZGV4T2YodGltZXIpO1xuICAgICAgICAgICAgaWYoaW5kZXggPj0gMCl0aGlzLnRpbWVycy5zcGxpY2UoaW5kZXgsMSk7XG4gICAgICAgIH1cbiAgICB9XG59IiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vZGVmcy9waXhpLmpzLmQudHNcIiAvPlxubW9kdWxlIFBJWEkge1xuICAgIGV4cG9ydCBtb2R1bGUgRWFzaW5nIHtcbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIGxpbmVhcigpOkZ1bmN0aW9ue1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGs6bnVtYmVyKTpudW1iZXJ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGs7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIGluUXVhZCgpOkZ1bmN0aW9ue1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGs6bnVtYmVyKTpudW1iZXJ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGsqaztcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gb3V0UXVhZCgpOkZ1bmN0aW9ue1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGs6bnVtYmVyKTpudW1iZXJ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGsqKDItayk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIGluT3V0UXVhZCgpOkZ1bmN0aW9ue1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGs6bnVtYmVyKTpudW1iZXJ7XG4gICAgICAgICAgICAgICAgaWYgKCAoIGsgKj0gMiApIDwgMSApIHJldHVybiAwLjUgKiBrICogaztcbiAgICAgICAgICAgICAgICByZXR1cm4gLSAwLjUgKiAoIC0tayAqICggayAtIDIgKSAtIDEgKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gaW5DdWJpYygpOkZ1bmN0aW9ue1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChrOm51bWJlcik6bnVtYmVye1xuICAgICAgICAgICAgICAgIHJldHVybiBrICogayAqIGs7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIG91dEN1YmljKCk6RnVuY3Rpb257XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oazpudW1iZXIpOm51bWJlcntcbiAgICAgICAgICAgICAgICByZXR1cm4gLS1rICogayAqIGsgKyAxO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBpbk91dEN1YmljKCk6RnVuY3Rpb257XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oazpudW1iZXIpOm51bWJlcntcbiAgICAgICAgICAgICAgICBpZiAoICggayAqPSAyICkgPCAxICkgcmV0dXJuIDAuNSAqIGsgKiBrICogaztcbiAgICAgICAgICAgICAgICByZXR1cm4gMC41ICogKCAoIGsgLT0gMiApICogayAqIGsgKyAyICk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIGluUXVhcnQoKTpGdW5jdGlvbntcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihrOm51bWJlcik6bnVtYmVye1xuICAgICAgICAgICAgICAgIHJldHVybiBrICogayAqIGsgKiBrO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBvdXRRdWFydCgpOkZ1bmN0aW9ue1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGs6bnVtYmVyKTpudW1iZXJ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDEgLSAoIC0tayAqIGsgKiBrICogayApO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBpbk91dFF1YXJ0KCk6RnVuY3Rpb257XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oazpudW1iZXIpOm51bWJlcntcbiAgICAgICAgICAgICAgICBpZiAoICggayAqPSAyICkgPCAxKSByZXR1cm4gMC41ICogayAqIGsgKiBrICogaztcbiAgICAgICAgICAgICAgICByZXR1cm4gLSAwLjUgKiAoICggayAtPSAyICkgKiBrICogayAqIGsgLSAyICk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIGluUXVpbnQoKTpGdW5jdGlvbntcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihrOm51bWJlcik6bnVtYmVye1xuICAgICAgICAgICAgICAgIHJldHVybiBrICogayAqIGsgKiBrICogaztcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gb3V0UXVpbnQoKTpGdW5jdGlvbntcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihrOm51bWJlcik6bnVtYmVye1xuICAgICAgICAgICAgICAgIHJldHVybiAtLWsgKiBrICogayAqIGsgKiBrICsgMTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gaW5PdXRRdWludCgpOkZ1bmN0aW9ue1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGs6bnVtYmVyKTpudW1iZXJ7XG4gICAgICAgICAgICAgICAgaWYgKCAoIGsgKj0gMiApIDwgMSApIHJldHVybiAwLjUgKiBrICogayAqIGsgKiBrICogaztcbiAgICAgICAgICAgICAgICByZXR1cm4gMC41ICogKCAoIGsgLT0gMiApICogayAqIGsgKiBrICogayArIDIgKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gaW5TaW5lKCk6RnVuY3Rpb257XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oazpudW1iZXIpOm51bWJlcntcbiAgICAgICAgICAgICAgICByZXR1cm4gMSAtIE1hdGguY29zKCBrICogTWF0aC5QSSAvIDIgKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gb3V0U2luZSgpOkZ1bmN0aW9ue1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGs6bnVtYmVyKTpudW1iZXJ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGguc2luKCBrICogTWF0aC5QSSAvIDIgKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gaW5PdXRTaW5lKCk6RnVuY3Rpb257XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oazpudW1iZXIpOm51bWJlcntcbiAgICAgICAgICAgICAgICByZXR1cm4gMC41ICogKCAxIC0gTWF0aC5jb3MoIE1hdGguUEkgKiBrICkgKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gaW5FeHBvKCk6RnVuY3Rpb257XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oazpudW1iZXIpOm51bWJlcntcbiAgICAgICAgICAgICAgICByZXR1cm4gayA9PT0gMCA/IDAgOiBNYXRoLnBvdyggMTAyNCwgayAtIDEgKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gb3V0RXhwbygpOkZ1bmN0aW9ue1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGs6bnVtYmVyKTpudW1iZXJ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGsgPT09IDEgPyAxIDogMSAtIE1hdGgucG93KCAyLCAtIDEwICogayApO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBpbk91dEV4cG8oKTpGdW5jdGlvbntcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihrOm51bWJlcik6bnVtYmVye1xuICAgICAgICAgICAgICAgIGlmICggayA9PT0gMCApIHJldHVybiAwO1xuICAgICAgICAgICAgICAgIGlmICggayA9PT0gMSApIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIGlmICggKCBrICo9IDIgKSA8IDEgKSByZXR1cm4gMC41ICogTWF0aC5wb3coIDEwMjQsIGsgLSAxICk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDAuNSAqICggLSBNYXRoLnBvdyggMiwgLSAxMCAqICggayAtIDEgKSApICsgMiApO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBpbkNpcmMoKTpGdW5jdGlvbntcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihrOm51bWJlcik6bnVtYmVye1xuICAgICAgICAgICAgICAgIHJldHVybiAxIC0gTWF0aC5zcXJ0KCAxIC0gayAqIGsgKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gb3V0Q2lyYygpOkZ1bmN0aW9ue1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGs6bnVtYmVyKTpudW1iZXJ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGguc3FydCggMSAtICggLS1rICogayApICk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIGluT3V0Q2lyYygpOkZ1bmN0aW9ue1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGs6bnVtYmVyKTpudW1iZXJ7XG4gICAgICAgICAgICAgICAgaWYgKCAoIGsgKj0gMiApIDwgMSkgcmV0dXJuIC0gMC41ICogKCBNYXRoLnNxcnQoIDEgLSBrICogaykgLSAxKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMC41ICogKCBNYXRoLnNxcnQoIDEgLSAoIGsgLT0gMikgKiBrKSArIDEpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBpbkVsYXN0aWMoKTpGdW5jdGlvbntcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihrOm51bWJlcik6bnVtYmVye1xuICAgICAgICAgICAgICAgIHZhciBzOm51bWJlciwgYTpudW1iZXIgPSAwLjEsIHA6bnVtYmVyID0gMC40O1xuICAgICAgICAgICAgICAgIGlmICggayA9PT0gMCApIHJldHVybiAwO1xuICAgICAgICAgICAgICAgIGlmICggayA9PT0gMSApIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIGlmICggIWEgfHwgYSA8IDEgKSB7IGEgPSAxOyBzID0gcCAvIDQ7IH1cbiAgICAgICAgICAgICAgICBlbHNlIHMgPSBwICogTWF0aC5hc2luKCAxIC8gYSApIC8gKCAyICogTWF0aC5QSSApO1xuICAgICAgICAgICAgICAgIHJldHVybiAtICggYSAqIE1hdGgucG93KCAyLCAxMCAqICggayAtPSAxICkgKSAqIE1hdGguc2luKCAoIGsgLSBzICkgKiAoIDIgKiBNYXRoLlBJICkgLyBwICkgKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gb3V0RWxhc3RpYygpOkZ1bmN0aW9ue1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGs6bnVtYmVyKTpudW1iZXJ7XG4gICAgICAgICAgICAgICAgdmFyIHM6bnVtYmVyLCBhOm51bWJlciA9IDAuMSwgcDpudW1iZXIgPSAwLjQ7XG4gICAgICAgICAgICAgICAgaWYgKCBrID09PSAwICkgcmV0dXJuIDA7XG4gICAgICAgICAgICAgICAgaWYgKCBrID09PSAxICkgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgaWYgKCAhYSB8fCBhIDwgMSApIHsgYSA9IDE7IHMgPSBwIC8gNDsgfVxuICAgICAgICAgICAgICAgIGVsc2UgcyA9IHAgKiBNYXRoLmFzaW4oIDEgLyBhICkgLyAoIDIgKiBNYXRoLlBJICk7XG4gICAgICAgICAgICAgICAgcmV0dXJuICggYSAqIE1hdGgucG93KCAyLCAtIDEwICogaykgKiBNYXRoLnNpbiggKCBrIC0gcyApICogKCAyICogTWF0aC5QSSApIC8gcCApICsgMSApO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBpbk91dEVsYXN0aWMoKTpGdW5jdGlvbntcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihrOm51bWJlcik6bnVtYmVye1xuICAgICAgICAgICAgICAgIHZhciBzOm51bWJlciwgYTpudW1iZXIgPSAwLjEsIHA6bnVtYmVyID0gMC40O1xuICAgICAgICAgICAgICAgIGlmICggayA9PT0gMCApIHJldHVybiAwO1xuICAgICAgICAgICAgICAgIGlmICggayA9PT0gMSApIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIGlmICggIWEgfHwgYSA8IDEgKSB7IGEgPSAxOyBzID0gcCAvIDQ7IH1cbiAgICAgICAgICAgICAgICBlbHNlIHMgPSBwICogTWF0aC5hc2luKCAxIC8gYSApIC8gKCAyICogTWF0aC5QSSApO1xuICAgICAgICAgICAgICAgIGlmICggKCBrICo9IDIgKSA8IDEgKSByZXR1cm4gLSAwLjUgKiAoIGEgKiBNYXRoLnBvdyggMiwgMTAgKiAoIGsgLT0gMSApICkgKiBNYXRoLnNpbiggKCBrIC0gcyApICogKCAyICogTWF0aC5QSSApIC8gcCApICk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGEgKiBNYXRoLnBvdyggMiwgLTEwICogKCBrIC09IDEgKSApICogTWF0aC5zaW4oICggayAtIHMgKSAqICggMiAqIE1hdGguUEkgKSAvIHAgKSAqIDAuNSArIDE7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIGluQmFjayh2Om51bWJlciA9IDEuNzAxNTgpOkZ1bmN0aW9ue1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGs6bnVtYmVyKTpudW1iZXJ7XG4gICAgICAgICAgICAgICAgdmFyIHM6bnVtYmVyID0gdjtcbiAgICAgICAgICAgICAgICByZXR1cm4gayAqIGsgKiAoICggcyArIDEgKSAqIGsgLSBzICk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIG91dEJhY2sodjpudW1iZXIgPSAxLjcwMTU4KTpGdW5jdGlvbntcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihrOm51bWJlcik6bnVtYmVye1xuICAgICAgICAgICAgICAgIHZhciBzOm51bWJlciA9IHY7XG4gICAgICAgICAgICAgICAgcmV0dXJuIC0tayAqIGsgKiAoICggcyArIDEgKSAqIGsgKyBzICkgKyAxO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBpbk91dEJhY2sodjpudW1iZXIgPSAxLjcwMTU4KTpGdW5jdGlvbntcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihrOm51bWJlcik6bnVtYmVye1xuICAgICAgICAgICAgICAgIHZhciBzOm51bWJlciA9ICB2ICogMS41MjU7XG4gICAgICAgICAgICAgICAgaWYgKCAoIGsgKj0gMiApIDwgMSApIHJldHVybiAwLjUgKiAoIGsgKiBrICogKCAoIHMgKyAxICkgKiBrIC0gcyApICk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDAuNSAqICggKCBrIC09IDIgKSAqIGsgKiAoICggcyArIDEgKSAqIGsgKyBzICkgKyAyICk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIGluQm91bmNlKCk6RnVuY3Rpb257XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oazpudW1iZXIpOm51bWJlcntcbiAgICAgICAgICAgICAgICByZXR1cm4gMSAtIEVhc2luZy5vdXRCb3VuY2UoKSggMSAtIGsgKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gb3V0Qm91bmNlKCk6RnVuY3Rpb257XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oazpudW1iZXIpOm51bWJlcntcbiAgICAgICAgICAgICAgICBpZiAoIGsgPCAoIDEgLyAyLjc1ICkgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDcuNTYyNSAqIGsgKiBrO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggayA8ICggMiAvIDIuNzUgKSApIHtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gNy41NjI1ICogKCBrIC09ICggMS41IC8gMi43NSApICkgKiBrICsgMC43NTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIGsgPCAoIDIuNSAvIDIuNzUgKSApIHtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gNy41NjI1ICogKCBrIC09ICggMi4yNSAvIDIuNzUgKSApICogayArIDAuOTM3NTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDcuNTYyNSAqICggayAtPSAoIDIuNjI1IC8gMi43NSApICkgKiBrICsgMC45ODQzNzU7XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIGluT3V0Qm91bmNlKCk6RnVuY3Rpb257XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oazpudW1iZXIpOm51bWJlcntcbiAgICAgICAgICAgICAgICBpZiAoIGsgPCAwLjUgKSByZXR1cm4gRWFzaW5nLmluQm91bmNlKCkoIGsgKiAyICkgKiAwLjU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEVhc2luZy5vdXRCb3VuY2UoKSggayAqIDIgLSAxICkgKiAwLjUgKyAwLjU7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2RlZnMvcGl4aS5qcy5kLnRzXCIgLz5cbm1vZHVsZSBQSVhJIHtcbiAgICBleHBvcnQgY2xhc3MgUGF0aCB7XG4gICAgICAgIHByaXZhdGUgX2Nsb3NlZDpib29sZWFuID0gZmFsc2U7XG4gICAgICAgIHBvbHlnb246UG9seWdvbiA9IG5ldyBQb2x5Z29uKCk7XG5cbiAgICAgICAgcHJpdmF0ZSBfdG1wUG9pbnQ6UG9pbnQgPSBuZXcgUG9pbnQoKTtcbiAgICAgICAgcHJpdmF0ZSBfdG1wUG9pbnQyOlBvaW50ID0gbmV3IFBvaW50KCk7XG5cbiAgICAgICAgcHJpdmF0ZSBfdG1wRGlzdGFuY2U6YW55W10gPSBbXTtcblxuICAgICAgICBwcml2YXRlIGN1cnJlbnRQYXRoOkdyYXBoaWNzRGF0YTtcbiAgICAgICAgcHJpdmF0ZSBncmFwaGljc0RhdGE6R3JhcGhpY3NEYXRhW10gPSBbXTtcblxuICAgICAgICBkaXJ0eTpib29sZWFuID0gZmFsc2U7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgICAgIHRoaXMucG9seWdvbi5jbG9zZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIG1vdmVUbyh4Om51bWJlciwgeTpudW1iZXIpOlBhdGh7XG4gICAgICAgICAgICBHcmFwaGljcy5wcm90b3R5cGUubW92ZVRvLmNhbGwodGhpcywgeCx5KTtcbiAgICAgICAgICAgIHRoaXMuZGlydHkgPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBsaW5lVG8oeDpudW1iZXIsIHk6bnVtYmVyKTpQYXRoe1xuICAgICAgICAgICAgR3JhcGhpY3MucHJvdG90eXBlLmxpbmVUby5jYWxsKHRoaXMsIHgseSk7XG4gICAgICAgICAgICB0aGlzLmRpcnR5ID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgYmV6aWVyQ3VydmVUbyhjcFg6bnVtYmVyLCBjcFk6bnVtYmVyLCBjcFgyOm51bWJlciwgY3BZMjpudW1iZXIsIHRvWDpudW1iZXIsIHRvWTpudW1iZXIpOlBhdGh7XG4gICAgICAgICAgICBHcmFwaGljcy5wcm90b3R5cGUuYmV6aWVyQ3VydmVUby5jYWxsKHRoaXMsIGNwWCwgY3BZLCBjcFgyLCBjcFkyLCB0b1gsIHRvWSk7XG4gICAgICAgICAgICB0aGlzLmRpcnR5ID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcXVhZHJhdGljQ3VydmVUbyhjcFg6IG51bWJlciwgY3BZOiBudW1iZXIsIHRvWDogbnVtYmVyLCB0b1k6IG51bWJlcik6UGF0aHtcbiAgICAgICAgICAgIEdyYXBoaWNzLnByb3RvdHlwZS5xdWFkcmF0aWNDdXJ2ZVRvLmNhbGwodGhpcywgY3BYLCBjcFksIHRvWCwgdG9ZKTtcbiAgICAgICAgICAgIHRoaXMuZGlydHkgPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBhcmNUbyh4MTogbnVtYmVyLCB5MTogbnVtYmVyLCB4MjogbnVtYmVyLCB5MjogbnVtYmVyLCByYWRpdXM6IG51bWJlcik6IFBhdGh7XG4gICAgICAgICAgICBHcmFwaGljcy5wcm90b3R5cGUuYXJjVG8uY2FsbCh0aGlzLCB4MSwgeTEsIHgyLCB5MiwgcmFkaXVzKTtcbiAgICAgICAgICAgIHRoaXMuZGlydHkgPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBhcmMoY3g6IG51bWJlciwgY3k6IG51bWJlciwgcmFkaXVzOiBudW1iZXIsIHN0YXJ0QW5nbGU6IG51bWJlciwgZW5kQW5nbGU6IG51bWJlciwgYW50aWNsb2Nrd2lzZT86IGJvb2xlYW4pOiBQYXRoIHtcbiAgICAgICAgICAgIEdyYXBoaWNzLnByb3RvdHlwZS5hcmMuY2FsbCh0aGlzLCBjeCwgY3ksIHJhZGl1cywgc3RhcnRBbmdsZSwgZW5kQW5nbGUsIGFudGljbG9ja3dpc2UpO1xuICAgICAgICAgICAgdGhpcy5kaXJ0eSA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGRyYXdTaGFwZShzaGFwZTpQb2x5Z29uKTpQYXRoe1xuICAgICAgICAgICAgR3JhcGhpY3MucHJvdG90eXBlLmRyYXdTaGFwZS5jYWxsKHRoaXMsIHNoYXBlKTtcbiAgICAgICAgICAgIHRoaXMuZGlydHkgPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBnZXRQb2ludChudW06bnVtYmVyKTpQb2ludHtcbiAgICAgICAgICAgIHRoaXMucGFyc2VQb2ludHMoKTtcbiAgICAgICAgICAgIHZhciBsZW46bnVtYmVyID0gbnVtKjI7XG4gICAgICAgICAgICB0aGlzLl90bXBQb2ludC5zZXQodGhpcy5wb2x5Z29uLnBvaW50c1tsZW5dLHRoaXMucG9seWdvbi5wb2ludHNbbGVuICsgMV0pO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RtcFBvaW50O1xuICAgICAgICB9XG5cbiAgICAgICAgZGlzdGFuY2VCZXR3ZWVuKG51bTE6bnVtYmVyLCBudW0yOm51bWJlcik6bnVtYmVye1xuICAgICAgICAgICAgdGhpcy5wYXJzZVBvaW50cygpO1xuICAgICAgICAgICAgdmFyIHt4OnAxWCwgeTpwMVl9ID0gdGhpcy5nZXRQb2ludChudW0xKTtcbiAgICAgICAgICAgIHZhciB7eDpwMlgsIHk6cDJZfSA9IHRoaXMuZ2V0UG9pbnQobnVtMik7XG5cbiAgICAgICAgICAgIHZhciBkeDpudW1iZXIgPSBwMlgtcDFYO1xuICAgICAgICAgICAgdmFyIGR5Om51bWJlciA9IHAyWS1wMVk7XG5cbiAgICAgICAgICAgIHJldHVybiBNYXRoLnNxcnQoZHgqZHgrZHkqZHkpO1xuICAgICAgICB9XG5cbiAgICAgICAgdG90YWxEaXN0YW5jZSgpOm51bWJlcntcbiAgICAgICAgICAgIHRoaXMucGFyc2VQb2ludHMoKTtcbiAgICAgICAgICAgIHRoaXMuX3RtcERpc3RhbmNlLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICB0aGlzLl90bXBEaXN0YW5jZS5wdXNoKDApO1xuXG4gICAgICAgICAgICB2YXIgbGVuOm51bWJlciA9IHRoaXMubGVuZ3RoO1xuICAgICAgICAgICAgdmFyIGRpc3RhbmNlOm51bWJlciA9IDA7XG4gICAgICAgICAgICBmb3IgKHZhciBpOm51bWJlciA9IDA7IGkgPCBsZW4gLSAxOyBpKyspIHtcbiAgICAgICAgICAgICAgICBkaXN0YW5jZSArPSB0aGlzLmRpc3RhbmNlQmV0d2VlbihpLCBpICsgMSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fdG1wRGlzdGFuY2UucHVzaChkaXN0YW5jZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBkaXN0YW5jZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldFBvaW50QXQobnVtOm51bWJlcik6UG9pbnR7XG4gICAgICAgICAgICB0aGlzLnBhcnNlUG9pbnRzKCk7XG4gICAgICAgICAgICBpZihudW0gPiB0aGlzLmxlbmd0aCl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UG9pbnQodGhpcy5sZW5ndGgtMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKG51bSUxID09PSAwKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRQb2ludChudW0pO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgdGhpcy5fdG1wUG9pbnQyLnNldCgwLDApO1xuXG4gICAgICAgICAgICAgICAgdmFyIGRpZmY6bnVtYmVyID0gbnVtJTE7XG5cbiAgICAgICAgICAgICAgICB2YXIge3g6Y2VpbFgsIHk6Y2VpbFl9ID0gdGhpcy5nZXRQb2ludChNYXRoLmNlaWwobnVtKSk7XG4gICAgICAgICAgICAgICAgdmFyIHt4OmZsb29yWCwgeTpmbG9vcll9ID0gdGhpcy5nZXRQb2ludChNYXRoLmZsb29yKG51bSkpO1xuXG4gICAgICAgICAgICAgICAgdmFyIHh4Om51bWJlciA9IC0oKGZsb29yWCAtIGNlaWxYKSpkaWZmKTtcbiAgICAgICAgICAgICAgICB2YXIgeXk6bnVtYmVyID0gLSgoZmxvb3JZIC0gY2VpbFkpKmRpZmYpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3RtcFBvaW50Mi5zZXQoZmxvb3JYICsgeHgsIGZsb29yWSArIHl5KTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl90bXBQb2ludDI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBnZXRQb2ludEF0RGlzdGFuY2UoZGlzdGFuY2U6bnVtYmVyKTpQb2ludHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGlzdGFuY2UpO1xuICAgICAgICAgICAgdGhpcy5wYXJzZVBvaW50cygpO1xuICAgICAgICAgICAgaWYoIXRoaXMuX3RtcERpc3RhbmNlKXRoaXMudG90YWxEaXN0YW5jZSgpO1xuICAgICAgICAgICAgdmFyIGxlbjpudW1iZXIgPSB0aGlzLl90bXBEaXN0YW5jZS5sZW5ndGg7XG4gICAgICAgICAgICB2YXIgbjpudW1iZXIgPSAwO1xuXG4gICAgICAgICAgICB2YXIgdG90YWxEaXN0YW5jZTpudW1iZXIgPSB0aGlzLl90bXBEaXN0YW5jZVt0aGlzLl90bXBEaXN0YW5jZS5sZW5ndGgtMV07XG4gICAgICAgICAgICBpZihkaXN0YW5jZSA8IDApe1xuICAgICAgICAgICAgICAgIGRpc3RhbmNlID0gdG90YWxEaXN0YW5jZStkaXN0YW5jZTtcbiAgICAgICAgICAgIH1lbHNlIGlmKGRpc3RhbmNlID4gdG90YWxEaXN0YW5jZSl7XG4gICAgICAgICAgICAgICAgZGlzdGFuY2UgPSBkaXN0YW5jZS10b3RhbERpc3RhbmNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IodmFyIGk6bnVtYmVyID0gMDsgaSA8IGxlbjsgaSsrKXtcbiAgICAgICAgICAgICAgICBpZihkaXN0YW5jZSA+PSB0aGlzLl90bXBEaXN0YW5jZVtpXSl7XG4gICAgICAgICAgICAgICAgICAgIG4gPSBpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmKGRpc3RhbmNlIDwgdGhpcy5fdG1wRGlzdGFuY2VbaV0pe1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKG4gPT09IHRoaXMubGVuZ3RoLTEpe1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFBvaW50QXQobik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBkaWZmMTpudW1iZXIgPSBkaXN0YW5jZS10aGlzLl90bXBEaXN0YW5jZVtuXTtcbiAgICAgICAgICAgIHZhciBkaWZmMjpudW1iZXIgPSB0aGlzLl90bXBEaXN0YW5jZVtuKzFdIC0gdGhpcy5fdG1wRGlzdGFuY2Vbbl07XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFBvaW50QXQobitkaWZmMS9kaWZmMik7XG4gICAgICAgIH1cblxuICAgICAgICBwYXJzZVBvaW50cygpOlBhdGgge1xuICAgICAgICAgICAgaWYodGhpcy5kaXJ0eSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZGlydHkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLnBvbHlnb24ucG9pbnRzLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaTpudW1iZXIgPSAwOyBpIDwgdGhpcy5ncmFwaGljc0RhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNoYXBlOlBvbHlnb24gPSA8UG9seWdvbj50aGlzLmdyYXBoaWNzRGF0YVtpXS5zaGFwZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNoYXBlICYmIHNoYXBlLnBvaW50cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wb2x5Z29uLnBvaW50cyA9IHRoaXMucG9seWdvbi5wb2ludHMuY29uY2F0KHNoYXBlLnBvaW50cyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgY2xlYXIoKTpQYXRoe1xuICAgICAgICAgICAgdGhpcy5ncmFwaGljc0RhdGEubGVuZ3RoID0gMDtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFBhdGggPSBudWxsO1xuXG4gICAgICAgICAgICB0aGlzLnBvbHlnb24ucG9pbnRzLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICB0aGlzLl9jbG9zZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuZGlydHkgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGNsb3NlZCgpOmJvb2xlYW57XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2xvc2VkO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0IGNsb3NlZCh2YWx1ZSl7XG4gICAgICAgICAgICB0aGlzLnBvbHlnb24uY2xvc2VkID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLl9jbG9zZWQgPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuZGlydHkgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGxlbmd0aCgpOm51bWJlcntcbiAgICAgICAgICAgIHJldHVybiAodGhpcy5wb2x5Z29uLnBvaW50cy5sZW5ndGggPT09IDApID8gMCA6IHRoaXMucG9seWdvbi5wb2ludHMubGVuZ3RoLzIgKyAoKHRoaXMuX2Nsb3NlZCkgPyAxIDogMCk7XG4gICAgICAgIH1cbiAgICB9XG59IiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vZGVmcy9waXhpLmpzLmQudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi9Ud2Vlbk1hbmFnZXIudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi9FYXNpbmcudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vZGlzcGxheS9TY2VuZS50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuL1BhdGgudHNcIiAvPlxubW9kdWxlIFBJWEl7XG4gICAgZXhwb3J0IGNsYXNzIFR3ZWVue1xuICAgICAgICB0aW1lOm51bWJlciA9IDA7XG4gICAgICAgIGFjdGl2ZTpib29sZWFuID0gZmFsc2U7XG4gICAgICAgIGVhc2luZzpGdW5jdGlvbiA9IEVhc2luZy5saW5lYXIoKTtcbiAgICAgICAgZXhwaXJlOmJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgcmVwZWF0Om51bWJlciA9IDA7XG4gICAgICAgIGxvb3A6Ym9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBkZWxheTpudW1iZXIgPSAwO1xuICAgICAgICBwaW5nUG9uZzpib29sZWFuID0gZmFsc2U7XG4gICAgICAgIGlzU3RhcnRlZDpib29sZWFuID0gZmFsc2U7XG4gICAgICAgIGlzRW5kZWQ6Ym9vbGVhbiA9IGZhbHNlO1xuXG4gICAgICAgIHByaXZhdGUgX3RvOmFueTtcbiAgICAgICAgcHJpdmF0ZSBfZnJvbTphbnk7XG4gICAgICAgIHByaXZhdGUgX2RlbGF5VGltZTpudW1iZXIgPSAwO1xuICAgICAgICBwcml2YXRlIF9lbGFwc2VkVGltZTpudW1iZXIgPSAwO1xuICAgICAgICBwcml2YXRlIF9yZXBlYXQ6bnVtYmVyID0gMDtcbiAgICAgICAgcHJpdmF0ZSBfcGluZ1Bvbmc6Ym9vbGVhbiA9IGZhbHNlO1xuXG4gICAgICAgIHByaXZhdGUgX2NoYWluVHdlZW46VHdlZW47XG5cbiAgICAgICAgcGF0aDpQYXRoO1xuICAgICAgICBwYXRoUmV2ZXJzZTpib29sZWFuID0gZmFsc2U7XG4gICAgICAgIHBhdGhGcm9tOm51bWJlcjtcbiAgICAgICAgcGF0aFRvOm51bWJlcjtcblxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgdGFyZ2V0OmFueSwgcHVibGljIG1hbmFnZXI/OlR3ZWVuTWFuYWdlcil7XG4gICAgICAgICAgICBpZih0aGlzLm1hbmFnZXIpe1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkVG8odGhpcy5tYW5hZ2VyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGFkZFRvKG1hbmFnZXI6VHdlZW5NYW5hZ2VyKTpUd2VlbntcbiAgICAgICAgICAgIG1hbmFnZXIuYWRkVHdlZW4odGhpcyk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGNoYWluKHR3ZWVuOlR3ZWVuID0gbmV3IFR3ZWVuKHRoaXMudGFyZ2V0KSk6VHdlZW57XG4gICAgICAgICAgICB0aGlzLl9jaGFpblR3ZWVuID0gdHdlZW47XG4gICAgICAgICAgICByZXR1cm4gdHdlZW47XG4gICAgICAgIH1cblxuICAgICAgICBzdGFydCgpOlR3ZWVue1xuICAgICAgICAgICAgdGhpcy5hY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgaWYoIXRoaXMubWFuYWdlcil7XG4gICAgICAgICAgICAgICAgaWYodGhpcy50YXJnZXQpe1xuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLnRhcmdldC5wYXJlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtYW5hZ2VyOlR3ZWVuTWFuYWdlciA9IF9maW5kTWFuYWdlcih0aGlzLnRhcmdldCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobWFuYWdlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkVG8obWFuYWdlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKCdUd2VlbnMgbmVlZHMgYSBtYW5hZ2VyJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoJ1R3ZWVucyBuZWVkcyBhIG1hbmFnZXInKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RvcCgpOlR3ZWVue1xuICAgICAgICAgICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuX29uVHdlZW5TdG9wKHRoaXMuX2VsYXBzZWRUaW1lKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgdG8oZGF0YTphbnkpOlR3ZWVue1xuICAgICAgICAgICAgdGhpcy5fdG8gPSBkYXRhO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBmcm9tKGRhdGE6YW55KTpUd2VlbntcbiAgICAgICAgICAgIHRoaXMuX2Zyb20gPSBkYXRhO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICByZW1vdmUoKTpUd2VlbntcbiAgICAgICAgICAgIGlmKCF0aGlzLm1hbmFnZXIpe1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlR3ZWVuIHdpdGhvdXQgbWFuYWdlci5cIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5yZW1vdmVUd2Vlbih0aGlzKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzZXQoKTpUd2VlbntcbiAgICAgICAgICAgIHRoaXMuX2VsYXBzZWRUaW1lID0gMDtcbiAgICAgICAgICAgIHRoaXMuX3JlcGVhdCA9IDA7XG4gICAgICAgICAgICB0aGlzLl9kZWxheVRpbWUgPSAwO1xuICAgICAgICAgICAgdGhpcy5pc1N0YXJ0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuaXNFbmRlZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICBpZih0aGlzLnBpbmdQb25nJiZ0aGlzLl9waW5nUG9uZyl7XG4gICAgICAgICAgICAgICAgdmFyIF90bzphbnkgPSB0aGlzLl90byxcbiAgICAgICAgICAgICAgICAgICAgX2Zyb206YW55ID0gdGhpcy5fZnJvbTtcblxuICAgICAgICAgICAgICAgIHRoaXMuX3RvID0gX2Zyb207XG4gICAgICAgICAgICAgICAgdGhpcy5fZnJvbSA9IF90bztcblxuICAgICAgICAgICAgICAgIHRoaXMuX3BpbmdQb25nID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIG9uU3RhcnQoY2FsbGJhY2s6RnVuY3Rpb24pOlR3ZWVue1xuICAgICAgICAgICAgdGhpcy5fb25Ud2VlblN0YXJ0ID0gPGFueT5jYWxsYmFjaztcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgb25FbmQoY2FsbGJhY2s6RnVuY3Rpb24pOlR3ZWVue1xuICAgICAgICAgICAgdGhpcy5fb25Ud2VlbkVuZCA9IDxhbnk+Y2FsbGJhY2s7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIG9uU3RvcChjYWxsYmFjazpGdW5jdGlvbik6VHdlZW57XG4gICAgICAgICAgICB0aGlzLl9vblR3ZWVuU3RvcCA9IDxhbnk+Y2FsbGJhY2s7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIG9uVXBkYXRlKGNhbGxiYWNrOkZ1bmN0aW9uKTpUd2VlbntcbiAgICAgICAgICAgIHRoaXMuX29uVHdlZW5VcGRhdGUgPSA8YW55PmNhbGxiYWNrO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBvblJlcGVhdChjYWxsYmFjazpGdW5jdGlvbik6VHdlZW57XG4gICAgICAgICAgICB0aGlzLl9vblR3ZWVuUmVwZWF0ID0gPGFueT5jYWxsYmFjaztcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgb25QaW5nUG9uZyhjYWxsYmFjazpGdW5jdGlvbik6VHdlZW57XG4gICAgICAgICAgICB0aGlzLl9vblR3ZWVuUGluZ1BvbmcgPSA8YW55PmNhbGxiYWNrO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICB1cGRhdGUoZGVsdGFUaW1lOm51bWJlcik6VHdlZW57XG4gICAgICAgICAgICBpZighKHRoaXMuX2NhblVwZGF0ZSgpJiYodGhpcy5fdG98fHRoaXMucGF0aCkpKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIF90bzphbnksIF9mcm9tOmFueTtcbiAgICAgICAgICAgIHZhciBkZWx0YU1TID0gZGVsdGFUaW1lICogMTAwMDtcblxuICAgICAgICAgICAgaWYodGhpcy5kZWxheSA+IHRoaXMuX2RlbGF5VGltZSl7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGVsYXlUaW1lICs9IGRlbHRhTVM7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKCF0aGlzLmlzU3RhcnRlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3BhcnNlRGF0YSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuaXNTdGFydGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9vblR3ZWVuU3RhcnQodGhpcy5fZWxhcHNlZFRpbWUsIGRlbHRhVGltZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciB0aW1lOm51bWJlciA9ICh0aGlzLnBpbmdQb25nKSA/IHRoaXMudGltZS8yIDogdGhpcy50aW1lO1xuICAgICAgICAgICAgaWYodGltZSA+IHRoaXMuX2VsYXBzZWRUaW1lKXtcbiAgICAgICAgICAgICAgICBsZXQgdDpudW1iZXIgPSB0aGlzLl9lbGFwc2VkVGltZStkZWx0YU1TO1xuICAgICAgICAgICAgICAgIGxldCBlbmRlZDpib29sZWFuID0gKHQ+PXRpbWUpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fZWxhcHNlZFRpbWUgPSAoZW5kZWQpID8gdGltZSA6IHQ7XG4gICAgICAgICAgICAgICAgdGhpcy5fYXBwbHkodGltZSk7XG5cbiAgICAgICAgICAgICAgICBsZXQgcmVhbEVsYXBzZWQ6bnVtYmVyID0gKHRoaXMuX3BpbmdQb25nKSA/IHRpbWUrdGhpcy5fZWxhcHNlZFRpbWUgOiB0aGlzLl9lbGFwc2VkVGltZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9vblR3ZWVuVXBkYXRlKHJlYWxFbGFwc2VkLCBkZWx0YVRpbWUpO1xuXG4gICAgICAgICAgICAgICAgaWYoZW5kZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucGluZ1BvbmcgJiYgIXRoaXMuX3BpbmdQb25nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9waW5nUG9uZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBfdG8gPSB0aGlzLl90bztcbiAgICAgICAgICAgICAgICAgICAgICAgIF9mcm9tID0gdGhpcy5fZnJvbTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZnJvbSA9IF90bztcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3RvID0gX2Zyb207XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnBhdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdG8gPSB0aGlzLnBhdGhUbztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfZnJvbSA9IHRoaXMucGF0aEZyb207XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBhdGhUbyA9IF9mcm9tO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGF0aEZyb20gPSBfdG87XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX29uVHdlZW5QaW5nUG9uZyhyZWFsRWxhcHNlZCwgZGVsdGFUaW1lKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxhcHNlZFRpbWUgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5sb29wIHx8IHRoaXMucmVwZWF0ID4gdGhpcy5fcmVwZWF0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZXBlYXQrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX29uVHdlZW5SZXBlYXQocmVhbEVsYXBzZWQsIGRlbHRhVGltZSwgdGhpcy5fcmVwZWF0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2VsYXBzZWRUaW1lID0gMDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucGluZ1BvbmcgJiYgdGhpcy5fcGluZ1BvbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdG8gPSB0aGlzLl90bztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfZnJvbSA9IHRoaXMuX2Zyb207XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl90byA9IF9mcm9tO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2Zyb20gPSBfdG87XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wYXRoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90byA9IHRoaXMucGF0aFRvO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfZnJvbSA9IHRoaXMucGF0aEZyb207XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXRoVG8gPSBfZnJvbTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXRoRnJvbSA9IF90bztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9waW5nUG9uZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzRW5kZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9vblR3ZWVuRW5kKHJlYWxFbGFwc2VkLCBkZWx0YVRpbWUpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX2NoYWluVHdlZW4pe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hhaW5Ud2Vlbi5hZGRUbyh0aGlzLm1hbmFnZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hhaW5Ud2Vlbi5zdGFydCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9wYXJzZURhdGEoKTp2b2lke1xuICAgICAgICAgICAgaWYodGhpcy5pc1N0YXJ0ZWQpcmV0dXJuO1xuXG4gICAgICAgICAgICBpZighdGhpcy5fZnJvbSl0aGlzLl9mcm9tID0ge307XG4gICAgICAgICAgICBfcGFyc2VSZWN1cnNpdmVEYXRhKHRoaXMuX3RvLCB0aGlzLl9mcm9tLCB0aGlzLnRhcmdldCk7XG5cbiAgICAgICAgICAgIGlmKHRoaXMucGF0aCl7XG4gICAgICAgICAgICAgICAgbGV0IGRpc3RhbmNlOm51bWJlciA9IHRoaXMucGF0aC50b3RhbERpc3RhbmNlKCk7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5wYXRoUmV2ZXJzZSl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGF0aEZyb20gPSBkaXN0YW5jZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXRoVG8gPSAwO1xuICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhdGhGcm9tID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXRoVG8gPSBkaXN0YW5jZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9hcHBseSh0aW1lOm51bWJlcik6dm9pZHtcbiAgICAgICAgICAgIF9yZWN1cnNpdmVBcHBseSh0aGlzLl90bywgdGhpcy5fZnJvbSwgdGhpcy50YXJnZXQsIHRpbWUsIHRoaXMuX2VsYXBzZWRUaW1lLCB0aGlzLmVhc2luZyk7XG5cbiAgICAgICAgICAgIGlmKHRoaXMucGF0aCl7XG4gICAgICAgICAgICAgICAgbGV0IHRpbWU6bnVtYmVyID0gKHRoaXMucGluZ1BvbmcpID8gdGhpcy50aW1lLzIgOiB0aGlzLnRpbWU7XG4gICAgICAgICAgICAgICAgbGV0IGI6bnVtYmVyID0gdGhpcy5wYXRoRnJvbSxcbiAgICAgICAgICAgICAgICAgICAgYzpudW1iZXIgPSB0aGlzLnBhdGhUbyAtIHRoaXMucGF0aEZyb20sXG4gICAgICAgICAgICAgICAgICAgIGQ6bnVtYmVyID0gdGltZSxcbiAgICAgICAgICAgICAgICAgICAgdDpudW1iZXIgPSB0aGlzLl9lbGFwc2VkVGltZS9kO1xuXG4gICAgICAgICAgICAgICAgbGV0IGRpc3RhbmNlOm51bWJlciA9IGIgKyAoYyp0aGlzLmVhc2luZyh0KSk7XG4gICAgICAgICAgICAgICAgbGV0IHBvczpQb2ludCA9IHRoaXMucGF0aC5nZXRQb2ludEF0RGlzdGFuY2UoZGlzdGFuY2UpO1xuICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0LnggPSBwb3MueDtcbiAgICAgICAgICAgICAgICB0aGlzLnRhcmdldC55ID0gcG9zLnk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9jYW5VcGRhdGUoKTpib29sZWFue1xuICAgICAgICAgICAgcmV0dXJuICh0aGlzLnRpbWUgJiYgdGhpcy5hY3RpdmUgJiYgdGhpcy50YXJnZXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfb25Ud2VlblN0YXJ0KGVsYXBzZWRUaW1lOm51bWJlciwgZGVsdGFUaW1lOiBudW1iZXIpOnZvaWR7fVxuICAgICAgICBwcml2YXRlIF9vblR3ZWVuU3RvcChlbGFwc2VkVGltZTpudW1iZXIpOnZvaWR7fVxuICAgICAgICBwcml2YXRlIF9vblR3ZWVuRW5kKGVsYXBzZWRUaW1lOm51bWJlciwgZGVsdGFUaW1lOiBudW1iZXIpOnZvaWR7fVxuICAgICAgICBwcml2YXRlIF9vblR3ZWVuUmVwZWF0KGVsYXBzZWRUaW1lOm51bWJlciwgZGVsdGFUaW1lOiBudW1iZXIsIHJlcGVhdDpudW1iZXIpOnZvaWR7fVxuICAgICAgICBwcml2YXRlIF9vblR3ZWVuVXBkYXRlKGVsYXBzZWRUaW1lOm51bWJlciwgZGVsdGFUaW1lOiBudW1iZXIpOnZvaWR7fVxuICAgICAgICBwcml2YXRlIF9vblR3ZWVuUGluZ1BvbmcoZWxhcHNlZFRpbWU6bnVtYmVyLCBkZWx0YVRpbWU6IG51bWJlcik6dm9pZHt9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2ZpbmRNYW5hZ2VyKHBhcmVudDphbnkpOmFueXtcbiAgICAgICAgaWYocGFyZW50IGluc3RhbmNlb2YgU2NlbmUpe1xuICAgICAgICAgICAgcmV0dXJuIChwYXJlbnQudHdlZW5NYW5hZ2VyKSA/IHBhcmVudC50d2Vlbk1hbmFnZXIgOiBudWxsO1xuICAgICAgICB9ZWxzZSBpZihwYXJlbnQucGFyZW50KXtcbiAgICAgICAgICAgIHJldHVybiBfZmluZE1hbmFnZXIocGFyZW50LnBhcmVudCk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfcGFyc2VSZWN1cnNpdmVEYXRhKHRvOmFueSwgZnJvbTphbnksIHRhcmdldDphbnkpOnZvaWR7XG4gICAgICAgIGZvcih2YXIgayBpbiB0byl7XG4gICAgICAgICAgICBpZihmcm9tW2tdICE9PSAwICYmICFmcm9tW2tdKXtcbiAgICAgICAgICAgICAgICBpZihpc09iamVjdCh0YXJnZXRba10pKXtcbiAgICAgICAgICAgICAgICAgICAgZnJvbVtrXSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGFyZ2V0W2tdKSk7XG4gICAgICAgICAgICAgICAgICAgIF9wYXJzZVJlY3Vyc2l2ZURhdGEodG9ba10sIGZyb21ba10sIHRhcmdldFtrXSk7XG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgIGZyb21ba10gPSB0YXJnZXRba107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNPYmplY3Qob2JqOmFueSk6Ym9vbGVhbntcbiAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSBcIltvYmplY3QgT2JqZWN0XVwiO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9yZWN1cnNpdmVBcHBseSh0bzphbnksIGZyb206YW55LCB0YXJnZXQ6YW55LCB0aW1lOm51bWJlciwgZWxhcHNlZDpudW1iZXIsIGVhc2luZzpGdW5jdGlvbik6dm9pZHtcbiAgICAgICAgZm9yKHZhciBrIGluIHRvKXtcbiAgICAgICAgICAgIGlmKCFpc09iamVjdCh0b1trXSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgYiA9IGZyb21ba10sXG4gICAgICAgICAgICAgICAgICAgIGMgPSB0b1trXSAtIGZyb21ba10sXG4gICAgICAgICAgICAgICAgICAgIGQgPSB0aW1lLFxuICAgICAgICAgICAgICAgICAgICB0ID0gZWxhcHNlZC9kO1xuICAgICAgICAgICAgICAgIHRhcmdldFtrXSA9IGIgKyAoYyplYXNpbmcodCkpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgX3JlY3Vyc2l2ZUFwcGx5KHRvW2tdLCBmcm9tW2tdLCB0YXJnZXRba10sIHRpbWUsIGVsYXBzZWQsIGVhc2luZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9kZWZzL3BpeGkuanMuZC50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuL1R3ZWVuLnRzXCIgLz5cbm1vZHVsZSBQSVhJIHtcbiAgICBleHBvcnQgY2xhc3MgVHdlZW5NYW5hZ2Vye1xuICAgICAgICB0d2VlbnM6VHdlZW5bXSA9IFtdO1xuICAgICAgICBwcml2YXRlIF90b0RlbGV0ZTpUd2VlbltdID0gW107XG5cbiAgICAgICAgY29uc3RydWN0b3IoKXt9XG5cbiAgICAgICAgdXBkYXRlKGRlbHRhVGltZTpudW1iZXIpOlR3ZWVuTWFuYWdlcntcbiAgICAgICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgdGhpcy50d2VlbnMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgIGlmKHRoaXMudHdlZW5zW2ldLmFjdGl2ZSl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHdlZW5zW2ldLnVwZGF0ZShkZWx0YVRpbWUpXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMudHdlZW5zW2ldLmlzRW5kZWQgJiYgdGhpcy50d2VlbnNbaV0uZXhwaXJlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHdlZW5zW2ldLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZih0aGlzLl90b0RlbGV0ZS5sZW5ndGgpe1xuICAgICAgICAgICAgICAgIGZvcihpID0gMDsgaSA8IHRoaXMuX3RvRGVsZXRlLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVtb3ZlKHRoaXMuX3RvRGVsZXRlW2ldKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLl90b0RlbGV0ZS5sZW5ndGggPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBnZXRUd2VlbnNGb3JUYXJnZXIodGFyZ2V0OmFueSk6VHdlZW5bXXtcbiAgICAgICAgICAgIHZhciB0d2VlbnM6VHdlZW5bXSA9IFtdO1xuICAgICAgICAgICAgZm9yKHZhciBpOm51bWJlciA9IDA7IGkgPCB0aGlzLnR3ZWVucy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgaWYodGhpcy50d2VlbnNbaV0udGFyZ2V0ID09PSB0YXJnZXQpe1xuICAgICAgICAgICAgICAgICAgICB0d2VlbnMucHVzaCh0aGlzLnR3ZWVuc1tpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdHdlZW5zO1xuICAgICAgICB9XG5cbiAgICAgICAgY3JlYXRlVHdlZW4odGFyZ2V0OmFueSk6VHdlZW57XG4gICAgICAgICAgICByZXR1cm4gbmV3IFR3ZWVuKHRhcmdldCwgdGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICBhZGRUd2Vlbih0d2VlbjpUd2Vlbik6VHdlZW57XG4gICAgICAgICAgICB0d2Vlbi5tYW5hZ2VyID0gdGhpcztcbiAgICAgICAgICAgIHRoaXMudHdlZW5zLnB1c2godHdlZW4pO1xuICAgICAgICAgICAgcmV0dXJuIHR3ZWVuO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVtb3ZlVHdlZW4odHdlZW46VHdlZW4pOlR3ZWVuTWFuYWdlcntcbiAgICAgICAgICAgIHRoaXMuX3RvRGVsZXRlLnB1c2godHdlZW4pO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9yZW1vdmUodHdlZW46VHdlZW4pe1xuICAgICAgICAgICAgdmFyIGluZGV4Om51bWJlciA9IHRoaXMudHdlZW5zLmluZGV4T2YodHdlZW4pO1xuICAgICAgICAgICAgaWYoaW5kZXggPj0gMCl7XG4gICAgICAgICAgICAgICAgdGhpcy50d2VlbnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9kZWZzL3BpeGkuanMuZC50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9jb3JlL0dhbWUudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi9DYW1lcmEudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vdGltZXIvVGltZXJNYW5hZ2VyLnRzXCIgLz5cbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL3R3ZWVuL1R3ZWVubWFuYWdlci50c1wiIC8+XG5tb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IGNsYXNzIFNjZW5lIGV4dGVuZHMgQ29udGFpbmVyIHtcbiAgICAgICAgY2FtZXJhOkNhbWVyYSA9IG5ldyBDYW1lcmEoKTtcbiAgICAgICAgdGltZXJNYW5hZ2VyOlRpbWVyTWFuYWdlciA9IG5ldyBUaW1lck1hbmFnZXIoKTtcbiAgICAgICAgdHdlZW5NYW5hZ2VyOlR3ZWVuTWFuYWdlciA9IG5ldyBUd2Vlbk1hbmFnZXIoKTtcbiAgICAgICAgc3RhdGljIF9pZExlbjpudW1iZXIgPSAwO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBpZDpzdHJpbmcgPSAoXCJzY2VuZVwiICsgU2NlbmUuX2lkTGVuKyspICl7XG4gICAgICAgICAgICBzdXBlcigpO1xuICAgICAgICAgICAgdGhpcy5jYW1lcmEuYWRkVG8odGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICB1cGRhdGUoZGVsdGFUaW1lOm51bWJlcik6U2NlbmV7XG4gICAgICAgICAgICB0aGlzLnRpbWVyTWFuYWdlci51cGRhdGUoZGVsdGFUaW1lKTtcbiAgICAgICAgICAgIHRoaXMudHdlZW5NYW5hZ2VyLnVwZGF0ZShkZWx0YVRpbWUpO1xuICAgICAgICAgICAgc3VwZXIudXBkYXRlKGRlbHRhVGltZSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGFkZFRvKGdhbWU6R2FtZXxDb250YWluZXIpOlNjZW5lIHtcbiAgICAgICAgICAgIGlmKGdhbWUgaW5zdGFuY2VvZiBHYW1lKXtcbiAgICAgICAgICAgICAgICA8R2FtZT5nYW1lLmFkZFNjZW5lKHRoaXMpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTY2VuZXMgY2FuIG9ubHkgYmUgYWRkZWQgdG8gdGhlIGdhbWUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICB9XG59IiwibW9kdWxlIFBJWEkge1xuICAgIGV4cG9ydCBjbGFzcyBJbnB1dE1hbmFnZXJ7XG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZ2FtZTogR2FtZSl7XG5cbiAgICAgICAgfVxuICAgIH1cbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9kZWZzL3BpeGkuanMuZC50c1wiIC8+XG5tb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IGZ1bmN0aW9uIGJpdG1hcEZvbnRQYXJzZXJUWFQoKTpGdW5jdGlvbntcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHJlc291cmNlOiBsb2FkZXJzLlJlc291cmNlLCBuZXh0OkZ1bmN0aW9uKTp2b2lke1xuXG4gICAgICAgICAgICAvL3NraXAgaWYgbm8gZGF0YSBvciBpZiBub3QgdHh0XG4gICAgICAgICAgICBpZighcmVzb3VyY2UuZGF0YSB8fCAocmVzb3VyY2UueGhyVHlwZSAhPT0gXCJ0ZXh0XCIgJiYgcmVzb3VyY2UueGhyVHlwZSAhPT0gXCJkb2N1bWVudFwiKSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5leHQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHRleHQ6c3RyaW5nID0gKHJlc291cmNlLnhoclR5cGUgPT09IFwidGV4dFwiKSA/IHJlc291cmNlLmRhdGEgOiByZXNvdXJjZS54aHIucmVzcG9uc2VUZXh0O1xuXG4gICAgICAgICAgICAvL3NraXAgaWYgbm90IGEgYml0bWFwIGZvbnQgZGF0YVxuICAgICAgICAgICAgaWYoIHRleHQuaW5kZXhPZihcInBhZ2VcIikgPT09IC0xIHx8XG4gICAgICAgICAgICAgICAgdGV4dC5pbmRleE9mKFwiZmFjZVwiKSA9PT0gLTEgfHxcbiAgICAgICAgICAgICAgICB0ZXh0LmluZGV4T2YoXCJpbmZvXCIpID09PSAtMSB8fFxuICAgICAgICAgICAgICAgIHRleHQuaW5kZXhPZihcImNoYXJcIikgPT09IC0xICl7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gbmV4dCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgdXJsOnN0cmluZyA9IGRpcm5hbWUocmVzb3VyY2UudXJsKTtcbiAgICAgICAgICAgIGlmKHVybCA9PT0gXCIuXCIpe1xuICAgICAgICAgICAgICAgIHVybCA9IFwiXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKHRoaXMuYmFzZVVybCAmJiB1cmwpe1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuYmFzZVVybC5jaGFyQXQodGhpcy5iYXNlVXJsLmxlbmd0aC0xKT09PSAnLycpe1xuICAgICAgICAgICAgICAgICAgICB1cmwgKz0gJy8nO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHVybC5yZXBsYWNlKHRoaXMuYmFzZVVybCwgJycpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZih1cmwgJiYgdXJsLmNoYXJBdCh1cmwubGVuZ3RoIC0gMSkgIT09ICcvJyl7XG4gICAgICAgICAgICAgICAgdXJsICs9ICcvJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHRleHR1cmVVcmw6c3RyaW5nID0gZ2V0VGV4dHVyZVVybCh1cmwsIHRleHQpO1xuICAgICAgICAgICAgaWYodXRpbHMuVGV4dHVyZUNhY2hlW3RleHR1cmVVcmxdKXtcbiAgICAgICAgICAgICAgICBwYXJzZShyZXNvdXJjZSwgdXRpbHMuVGV4dHVyZUNhY2hlW3RleHR1cmVVcmxdKTtcbiAgICAgICAgICAgICAgICBuZXh0KCk7XG4gICAgICAgICAgICB9ZWxzZXtcblxuICAgICAgICAgICAgICAgIHZhciBsb2FkT3B0aW9uczphbnkgPSB7XG4gICAgICAgICAgICAgICAgICAgIGNyb3NzT3JpZ2luOiByZXNvdXJjZS5jcm9zc09yaWdpbixcbiAgICAgICAgICAgICAgICAgICAgbG9hZFR5cGU6IGxvYWRlcnMuUmVzb3VyY2UuTE9BRF9UWVBFLklNQUdFXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHRoaXMuYWRkKHJlc291cmNlLm5hbWUgKyAnX2ltYWdlJywgdGV4dHVyZVVybCwgbG9hZE9wdGlvbnMsIGZ1bmN0aW9uKHJlczphbnkpe1xuICAgICAgICAgICAgICAgICAgICBwYXJzZShyZXNvdXJjZSwgcmVzLnRleHR1cmUpO1xuICAgICAgICAgICAgICAgICAgICBuZXh0KCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICBuZXh0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZShyZXNvdXJjZTpsb2FkZXJzLlJlc291cmNlLCB0ZXh0dXJlOlRleHR1cmUpe1xuICAgICAgICB2YXIgY3VycmVudExpbmU6c3RyaW5nLCBhdHRyOmF0dHJEYXRhLFxuICAgICAgICAgICAgZGF0YTpmb250RGF0YSA9IHtcbiAgICAgICAgICAgICAgICBjaGFycyA6IHt9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIHZhciB0ZXh0OnN0cmluZyA9IChyZXNvdXJjZS54aHJUeXBlID09PSBcInRleHRcIikgPyByZXNvdXJjZS5kYXRhIDogcmVzb3VyY2UueGhyLnJlc3BvbnNlVGV4dDtcbiAgICAgICAgdmFyIGxpbmVzOnN0cmluZ1tdID0gdGV4dC5zcGxpdCgnXFxuJyk7XG5cbiAgICAgICAgZm9yKHZhciBpOm51bWJlciA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICBpZihsaW5lc1tpXS5pbmRleE9mKFwiaW5mb1wiKSA9PT0gMCl7XG4gICAgICAgICAgICAgICAgY3VycmVudExpbmUgPSBsaW5lc1tpXS5zdWJzdHJpbmcoNSk7XG4gICAgICAgICAgICAgICAgYXR0ciA9IGdldEF0dHIoY3VycmVudExpbmUpO1xuXG4gICAgICAgICAgICAgICAgZGF0YS5mb250ID0gYXR0ci5mYWNlO1xuICAgICAgICAgICAgICAgIGRhdGEuc2l6ZSA9IHBhcnNlSW50KGF0dHIuc2l6ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKGxpbmVzW2ldLmluZGV4T2YoJ2NvbW1vbiAnKSA9PT0gMCl7XG4gICAgICAgICAgICAgICAgY3VycmVudExpbmUgPSBsaW5lc1tpXS5zdWJzdHJpbmcoNyk7XG4gICAgICAgICAgICAgICAgYXR0ciA9IGdldEF0dHIoY3VycmVudExpbmUpO1xuICAgICAgICAgICAgICAgIGRhdGEubGluZUhlaWdodCA9IHBhcnNlSW50KGF0dHIubGluZUhlaWdodCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKGxpbmVzW2ldLmluZGV4T2YoXCJjaGFyIFwiKSA9PT0gMCl7XG4gICAgICAgICAgICAgICAgY3VycmVudExpbmUgPSBsaW5lc1tpXS5zdWJzdHJpbmcoNSk7XG4gICAgICAgICAgICAgICAgYXR0ciA9IGdldEF0dHIoY3VycmVudExpbmUpO1xuICAgICAgICAgICAgICAgIHZhciBjaGFyQ29kZTpudW1iZXIgPSBwYXJzZUludChhdHRyLmlkKTtcblxuICAgICAgICAgICAgICAgIHZhciB0ZXh0dXJlUmVjdDpSZWN0YW5nbGUgPSBuZXcgUmVjdGFuZ2xlKFxuICAgICAgICAgICAgICAgICAgICBwYXJzZUludChhdHRyLngpLFxuICAgICAgICAgICAgICAgICAgICBwYXJzZUludChhdHRyLnkpLFxuICAgICAgICAgICAgICAgICAgICBwYXJzZUludChhdHRyLndpZHRoKSxcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VJbnQoYXR0ci5oZWlnaHQpXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIGRhdGEuY2hhcnNbY2hhckNvZGVdID0ge1xuICAgICAgICAgICAgICAgICAgICB4T2Zmc2V0OiBwYXJzZUludChhdHRyLnhvZmZzZXQpLFxuICAgICAgICAgICAgICAgICAgICB5T2Zmc2V0OiBwYXJzZUludChhdHRyLnlvZmZzZXQpLFxuICAgICAgICAgICAgICAgICAgICB4QWR2YW5jZTogcGFyc2VJbnQoYXR0ci54YWR2YW5jZSksXG4gICAgICAgICAgICAgICAgICAgIGtlcm5pbmc6IHt9LFxuICAgICAgICAgICAgICAgICAgICB0ZXh0dXJlOiBuZXcgVGV4dHVyZSh0ZXh0dXJlLmJhc2VUZXh0dXJlLCB0ZXh0dXJlUmVjdClcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihsaW5lc1tpXS5pbmRleE9mKCdrZXJuaW5nICcpID09PSAwKXtcbiAgICAgICAgICAgICAgICBjdXJyZW50TGluZSA9IGxpbmVzW2ldLnN1YnN0cmluZyg4KTtcbiAgICAgICAgICAgICAgICBhdHRyID0gZ2V0QXR0cihjdXJyZW50TGluZSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgZmlyc3QgPSBwYXJzZUludChhdHRyLmZpcnN0KTtcbiAgICAgICAgICAgICAgICB2YXIgc2Vjb25kID0gcGFyc2VJbnQoYXR0ci5zZWNvbmQpO1xuXG4gICAgICAgICAgICAgICAgZGF0YS5jaGFyc1tzZWNvbmRdLmtlcm5pbmdbZmlyc3RdID0gcGFyc2VJbnQoYXR0ci5hbW91bnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmVzb3VyY2UuYml0bWFwRm9udCA9IGRhdGE7XG4gICAgICAgIGV4dHJhcy5CaXRtYXBUZXh0LmZvbnRzW2RhdGEuZm9udF0gPSBkYXRhO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRpcm5hbWUocGF0aDpzdHJpbmcpOnN0cmluZ3tcbiAgICAgICAgcmV0dXJuIHBhdGgucmVwbGFjZSgvXFxcXC9nLCcvJykucmVwbGFjZSgvXFwvW15cXC9dKiQvLCAnJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0VGV4dHVyZVVybCh1cmw6c3RyaW5nLCBkYXRhOnN0cmluZyk6c3RyaW5ne1xuICAgICAgICB2YXIgdGV4dHVyZVVybDpzdHJpbmc7XG4gICAgICAgIHZhciBsaW5lczpzdHJpbmdbXSA9IGRhdGEuc3BsaXQoJ1xcbicpO1xuXG4gICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgaWYobGluZXNbaV0uaW5kZXhPZihcInBhZ2VcIikgPT09IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudExpbmU6c3RyaW5nID0gbGluZXNbaV0uc3Vic3RyaW5nKDUpO1xuICAgICAgICAgICAgICAgIHZhciBmaWxlOnN0cmluZyA9IChjdXJyZW50TGluZS5zdWJzdHJpbmcoY3VycmVudExpbmUuaW5kZXhPZignZmlsZT0nKSkpLnNwbGl0KCc9JylbMV07XG4gICAgICAgICAgICAgICAgdGV4dHVyZVVybCA9IHVybCArIGZpbGUuc3Vic3RyKDEsIGZpbGUubGVuZ3RoLTIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRleHR1cmVVcmw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0QXR0cihsaW5lOnN0cmluZyk6YXR0ckRhdGF7XG4gICAgICAgIHZhciByZWdleDpSZWdFeHAgPSAvXCIoXFx3KlxcZCpcXHMqKC18XykqKSpcIi9nLFxuICAgICAgICAgICAgYXR0cjpzdHJpbmdbXSA9IGxpbmUuc3BsaXQoL1xccysvZyksXG4gICAgICAgICAgICBkYXRhOmFueSA9IHt9O1xuXG4gICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgYXR0ci5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICB2YXIgZDpzdHJpbmdbXSA9IGF0dHJbaV0uc3BsaXQoJz0nKTtcbiAgICAgICAgICAgIHZhciBtOlJlZ0V4cE1hdGNoQXJyYXkgPSBkWzFdLm1hdGNoKHJlZ2V4KTtcbiAgICAgICAgICAgIGlmKG0gJiYgbS5sZW5ndGggPj0gMSl7XG4gICAgICAgICAgICAgICAgZFsxXSA9IGRbMV0uc3Vic3RyKDEsIGRbMV0ubGVuZ3RoLTIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGF0YVtkWzBdXSA9IGRbMV07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gPGF0dHJEYXRhPmRhdGE7XG4gICAgfVxuXG4gICAgaW50ZXJmYWNlIGZvbnREYXRhIHtcbiAgICAgICAgY2hhcnM/IDogYW55O1xuICAgICAgICBmb250PyA6IHN0cmluZztcbiAgICAgICAgc2l6ZT8gOiBudW1iZXI7XG4gICAgICAgIGxpbmVIZWlnaHQ/IDogbnVtYmVyO1xuICAgIH1cblxuICAgIGludGVyZmFjZSBhdHRyRGF0YSB7XG4gICAgICAgIGZhY2U/IDogc3RyaW5nO1xuICAgICAgICBzaXplPyA6IHN0cmluZztcbiAgICAgICAgbGluZUhlaWdodD8gOiBzdHJpbmc7XG4gICAgICAgIGlkPyA6IHN0cmluZztcbiAgICAgICAgeD8gOiBzdHJpbmc7XG4gICAgICAgIHk/IDogc3RyaW5nO1xuICAgICAgICB3aWR0aD8gOiBzdHJpbmc7XG4gICAgICAgIGhlaWdodD8gOiBzdHJpbmc7XG4gICAgICAgIHhvZmZzZXQ/IDogc3RyaW5nO1xuICAgICAgICB5b2Zmc2V0PyA6IHN0cmluZztcbiAgICAgICAgeGFkdmFuY2U/IDogc3RyaW5nO1xuICAgICAgICBmaXJzdD8gOiBzdHJpbmc7XG4gICAgICAgIHNlY29uZD8gOiBzdHJpbmc7XG4gICAgICAgIGFtb3VudD8gOiBzdHJpbmc7XG4gICAgfVxufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL2F1ZGlvL0F1ZGlvTWFuYWdlci50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9BdWRpby9BdWRpby50c1wiIC8+XG5tb2R1bGUgUElYSSB7XG4gICAgdmFyIF9hbGxvd2VkRXh0OnN0cmluZ1tdID0gW1wibTRhXCIsIFwib2dnXCIsIFwibXAzXCIsIFwid2F2XCJdO1xuXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGF1ZGlvUGFyc2VyKCk6RnVuY3Rpb24ge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24ocmVzb3VyY2U6bG9hZGVycy5SZXNvdXJjZSwgbmV4dDpGdW5jdGlvbik6dm9pZHtcbiAgICAgICAgICAgIGlmKCFEZXZpY2UuaXNBdWRpb1N1cHBvcnRlZCB8fCAhcmVzb3VyY2UuZGF0YSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5leHQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGV4dDpzdHJpbmcgPSBfZ2V0RXh0KHJlc291cmNlLnVybCk7XG5cbiAgICAgICAgICAgIGlmKF9hbGxvd2VkRXh0LmluZGV4T2YoZXh0KSA9PT0gLTEpe1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXh0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKCFfY2FuUGxheShleHQpKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV4dCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgbmFtZTpzdHJpbmcgPSByZXNvdXJjZS5uYW1lIHx8IHJlc291cmNlLnVybDtcbiAgICAgICAgICAgIGlmKHV0aWxzLl9hdWRpb1R5cGVTZWxlY3RlZCA9PT0gQVVESU9fVFlQRS5XRUJBVURJTyl7XG4gICAgICAgICAgICAgICAgRGV2aWNlLmdsb2JhbFdlYkF1ZGlvQ29udGV4dC5kZWNvZGVBdWRpb0RhdGEocmVzb3VyY2UuZGF0YSwgX2FkZFRvQ2FjaGUuYmluZCh0aGlzLCBuZXh0LCBuYW1lKSk7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICByZXR1cm4gX2FkZFRvQ2FjaGUobmV4dCwgbmFtZSwgcmVzb3VyY2UuZGF0YSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGV4cG9ydCBmdW5jdGlvbiBhdWRpb1BhcnNlclVybChyZXNvdXJjZVVybDpzdHJpbmdbXSk6c3RyaW5ne1xuICAgICAgICB2YXIgZXh0OnN0cmluZztcbiAgICAgICAgdmFyIHVybDpzdHJpbmc7XG4gICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgcmVzb3VyY2VVcmwubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgZXh0ID0gX2dldEV4dChyZXNvdXJjZVVybFtpXSk7XG5cbiAgICAgICAgICAgIGlmKF9hbGxvd2VkRXh0LmluZGV4T2YoZXh0KSA9PT0gLTEpe1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihfY2FuUGxheShleHQpKXtcbiAgICAgICAgICAgICAgICB1cmwgPSByZXNvdXJjZVVybFtpXTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB1cmw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2FkZFRvQ2FjaGUobmV4dDpGdW5jdGlvbiwgbmFtZTpzdHJpbmcsIGRhdGE6YW55KXtcbiAgICAgICAgdXRpbHMuQXVkaW9DYWNoZVtuYW1lXSA9IG5ldyBBdWRpbyhkYXRhLCBuYW1lKTtcbiAgICAgICAgcmV0dXJuIG5leHQoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfZ2V0RXh0KHVybDpzdHJpbmcpOnN0cmluZ3tcbiAgICAgICAgcmV0dXJuIHVybC5zcGxpdCgnPycpLnNoaWZ0KCkuc3BsaXQoJy4nKS5wb3AoKS50b0xvd2VyQ2FzZSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9jYW5QbGF5KGV4dDpzdHJpbmcpOmJvb2xlYW57XG4gICAgICAgIHZhciBkZXZpY2VDYW5QbGF5OmJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgc3dpdGNoKGV4dCl7XG4gICAgICAgICAgICBjYXNlIFwibTRhXCI6ZGV2aWNlQ2FuUGxheSA9IERldmljZS5pc000YVN1cHBvcnRlZDsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwibXAzXCI6ZGV2aWNlQ2FuUGxheSA9IERldmljZS5pc01wM1N1cHBvcnRlZDsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwib2dnXCI6ZGV2aWNlQ2FuUGxheSA9IERldmljZS5pc09nZ1N1cHBvcnRlZDsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwid2F2XCI6ZGV2aWNlQ2FuUGxheSA9IERldmljZS5pc1dhdlN1cHBvcnRlZDsgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRldmljZUNhblBsYXk7XG4gICAgfVxufVxuIiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vZGVmcy9waXhpLmpzLmQudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi9jb25zdC50c1wiIC8+XG5tb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IG1vZHVsZSB1dGlscyB7XG4gICAgICAgIGV4cG9ydCB2YXIgX2F1ZGlvVHlwZVNlbGVjdGVkOm51bWJlciA9IEFVRElPX1RZUEUuV0VCQVVESU87XG4gICAgICAgIGV4cG9ydCB2YXIgQXVkaW9DYWNoZTphbnkgPSB7fTtcbiAgICB9XG59IiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vZGVmcy9waXhpLmpzLmQudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vY29yZS9jb25zdC50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuL2JpdG1hcEZvbnRQYXJzZXJUeHQudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi9hdWRpb1BhcnNlci50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9jb3JlL1V0aWxzLnRzXCIgLz5cbm1vZHVsZSBQSVhJIHtcbiAgICBleHBvcnQgbW9kdWxlIGxvYWRlcnN7XG4gICAgICAgIExvYWRlci5hZGRQaXhpTWlkZGxld2FyZShiaXRtYXBGb250UGFyc2VyVFhUKTtcbiAgICAgICAgTG9hZGVyLmFkZFBpeGlNaWRkbGV3YXJlKGF1ZGlvUGFyc2VyKTtcblxuICAgICAgICBjbGFzcyBUdXJib0xvYWRlciBleHRlbmRzIExvYWRlciB7XG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihiYXNlVXJsOiBzdHJpbmcsIGFzc2V0Q29uY3VycmVuY3k6IG51bWJlcil7XG4gICAgICAgICAgICAgICAgc3VwZXIoYmFzZVVybCwgYXNzZXRDb25jdXJyZW5jeSk7XG4gICAgICAgICAgICAgICAgaWYoRGV2aWNlLmlzQXVkaW9TdXBwb3J0ZWQpe1xuICAgICAgICAgICAgICAgICAgICBfY2hlY2tBdWRpb1R5cGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGFkZChuYW1lOmFueSwgdXJsPzphbnkgLG9wdGlvbnM/OmFueSwgY2I/OmFueSk6TG9hZGVye1xuICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBuYW1lID09PSAnb2JqZWN0Jyl7XG4gICAgICAgICAgICAgICAgICAgIGlmKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChuYW1lLnVybCkgPT09IFwiW29iamVjdCBBcnJheV1cIil7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lLnVybCA9IGF1ZGlvUGFyc2VyVXJsKG5hbWUudXJsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh1cmwpID09PSBcIltvYmplY3QgQXJyYXldXCIpe1xuICAgICAgICAgICAgICAgICAgICB1cmwgPSBhdWRpb1BhcnNlclVybCh1cmwpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBzdXBlci5hZGQobmFtZSwgdXJsLCBvcHRpb25zLCBjYik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsb2FkZXJzLkxvYWRlciA9IFR1cmJvTG9hZGVyO1xuXG5cbiAgICAgICAgZnVuY3Rpb24gX2NoZWNrQXVkaW9UeXBlKCk6dm9pZHtcbiAgICAgICAgICAgIGlmKERldmljZS5pc01wM1N1cHBvcnRlZClfc2V0QXVkaW9FeHQoXCJtcDNcIik7XG4gICAgICAgICAgICBpZihEZXZpY2UuaXNPZ2dTdXBwb3J0ZWQpX3NldEF1ZGlvRXh0KFwib2dnXCIpO1xuICAgICAgICAgICAgaWYoRGV2aWNlLmlzV2F2U3VwcG9ydGVkKV9zZXRBdWRpb0V4dChcIndhdlwiKTtcbiAgICAgICAgICAgIGlmKERldmljZS5pc000YVN1cHBvcnRlZClfc2V0QXVkaW9FeHQoXCJtNGFcIik7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBfc2V0QXVkaW9FeHQoZXh0OnN0cmluZyk6dm9pZCB7XG4gICAgICAgICAgICBpZih1dGlscy5fYXVkaW9UeXBlU2VsZWN0ZWQgPT09IEFVRElPX1RZUEUuV0VCQVVESU8pe1xuICAgICAgICAgICAgICAgIFJlc291cmNlLnNldEV4dGVuc2lvblhoclR5cGUoZXh0LCBSZXNvdXJjZS5YSFJfUkVTUE9OU0VfVFlQRS5CVUZGRVIpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgUmVzb3VyY2Uuc2V0RXh0ZW5zaW9uTG9hZFR5cGUoZXh0LCBSZXNvdXJjZS5MT0FEX1RZUEUuQVVESU8pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSIsIm1vZHVsZSBQSVhJIHtcbiAgICBleHBvcnQgY2xhc3MgRGF0YU1hbmFnZXJ7XG4gICAgICAgIHByaXZhdGUgX2RhdGE6YW55O1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgaWQ6c3RyaW5nLCBwdWJsaWMgdXNlUGVyc2lzdGFudERhdGE6Ym9vbGVhbiA9IGZhbHNlKXtcbiAgICAgICAgICAgIHRoaXMubG9hZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgbG9hZCgpOkRhdGFNYW5hZ2Vye1xuICAgICAgICAgICAgdGhpcy5fZGF0YSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5pZCkpIHx8IHt9O1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBzYXZlKCk6RGF0YU1hbmFnZXJ7XG4gICAgICAgICAgICBpZih0aGlzLnVzZVBlcnNpc3RhbnREYXRhKXtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLmlkLCBKU09OLnN0cmluZ2lmeSh0aGlzLl9kYXRhKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc2V0KCk6RGF0YU1hbmFnZXJ7XG4gICAgICAgICAgICB0aGlzLl9kYXRhID0ge307XG4gICAgICAgICAgICB0aGlzLnNhdmUoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0KGtleTpzdHJpbmcgfCBPYmplY3QsIHZhbHVlPzphbnkpOkRhdGFNYW5hZ2Vye1xuICAgICAgICAgICAgaWYoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGtleSkgPT09IFwiW29iamVjdCBPYmplY3RdXCIpe1xuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24odGhpcy5fZGF0YSwga2V5KTtcbiAgICAgICAgICAgIH1lbHNlIGlmKHR5cGVvZiBrZXkgPT09IFwic3RyaW5nXCIpe1xuICAgICAgICAgICAgICAgIHRoaXMuX2RhdGFba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnNhdmUoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0KGtleT86c3RyaW5nKTphbnl7XG4gICAgICAgICAgICBpZigha2V5KXtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZGF0YTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGFba2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRlbChrZXk6c3RyaW5nKTpEYXRhTWFuYWdlcntcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9kYXRhW2tleV07XG4gICAgICAgICAgICB0aGlzLnNhdmUoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICB9XG59IiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vZGVmcy9waXhpLmpzLmQudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi9jb25zdC50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuL0RldmljZS50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9kaXNwbGF5L1NjZW5lLnRzXCIgLz5cbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL2F1ZGlvL0F1ZGlvTWFuYWdlci50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9pbnB1dC9JbnB1dE1hbmFnZXIudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vbG9hZGVyL0xvYWRlci50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuL0RhdGFNYW5hZ2VyLnRzXCIgLz5cbm1vZHVsZSBQSVhJIHtcbiAgICB2YXIgbGFzdDpudW1iZXIgPSAwO1xuICAgIHZhciBtYXhGcmFtZU1TID0gMC4zNTtcblxuICAgIHZhciBkZWZhdWx0R2FtZUNvbmZpZyA6IEdhbWVDb25maWcgPSB7XG4gICAgICAgIGlkOiBcInBpeGkuZGVmYXVsdC5pZFwiLFxuICAgICAgICB3aWR0aDo4MDAsXG4gICAgICAgIGhlaWdodDo2MDAsXG4gICAgICAgIHVzZVdlYkF1ZGlvOiB0cnVlLFxuICAgICAgICB1c2VQZXJzaXN0YW50RGF0YTogZmFsc2UsXG4gICAgICAgIGdhbWVTY2FsZVR5cGU6IEdBTUVfU0NBTEVfVFlQRS5OT05FLFxuICAgICAgICBzdG9wQXRMb3N0Rm9jdXM6IHRydWUsXG4gICAgICAgIGFzc2V0c1VybDogXCIuL1wiLFxuICAgICAgICBsb2FkZXJDb25jdXJyZW5jeTogMTAsXG4gICAgICAgIGF1ZGlvQ2hhbm5lbExpbmVzOiAxMCxcbiAgICAgICAgc291bmRDaGFubmVsTGluZXM6IDEwLFxuICAgICAgICBtdXNpY0NoYW5uZWxMaW5lczogMSxcbiAgICAgICAgekluZGV4RW5hYmxlZDogekluZGV4RW5hYmxlZFxuICAgIH07XG5cbiAgICBleHBvcnQgY2xhc3MgR2FtZSB7XG4gICAgICAgIGlkOnN0cmluZztcbiAgICAgICAgcmFmOmFueTtcblxuICAgICAgICBwcml2YXRlIF9zY2VuZXM6U2NlbmVbXSA9IFtdO1xuICAgICAgICBzY2VuZTpTY2VuZTtcblxuICAgICAgICBhdWRpbzpBdWRpb01hbmFnZXI7XG4gICAgICAgIGlucHV0OklucHV0TWFuYWdlcjtcbiAgICAgICAgZGF0YTpEYXRhTWFuYWdlcjtcbiAgICAgICAgbG9hZGVyOmxvYWRlcnMuTG9hZGVyO1xuXG4gICAgICAgIHJlbmRlcmVyOldlYkdMUmVuZGVyZXIgfCBDYW52YXNSZW5kZXJlcjtcbiAgICAgICAgY2FudmFzOkhUTUxDYW52YXNFbGVtZW50O1xuXG4gICAgICAgIGRlbHRhOm51bWJlciA9IDA7XG4gICAgICAgIHRpbWU6bnVtYmVyID0gMDtcbiAgICAgICAgbGFzdFRpbWU6bnVtYmVyID0gMDtcblxuICAgICAgICBpc1dlYkdMOmJvb2xlYW47XG4gICAgICAgIGlzV2ViQXVkaW86Ym9vbGVhbjtcblxuICAgICAgICB0aW1lU3BlZWQ6bnVtYmVyID0gMTtcblxuICAgICAgICBwcml2YXRlIF9yZXNpemVMaXN0ZW5lcjphbnk7XG5cbiAgICAgICAgY29uc3RydWN0b3IoY29uZmlnPzpHYW1lQ29uZmlnLCByZW5kZXJlck9wdGlvbnM/OlJlbmRlcmVyT3B0aW9ucykge1xuICAgICAgICAgICAgY29uZmlnID0gKDxPYmplY3Q+T2JqZWN0KS5hc3NpZ24oZGVmYXVsdEdhbWVDb25maWcsIGNvbmZpZyk7XG4gICAgICAgICAgICB0aGlzLmlkID0gY29uZmlnLmlkO1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJlciA9IGF1dG9EZXRlY3RSZW5kZXJlcihjb25maWcud2lkdGgsIGNvbmZpZy5oZWlnaHQsIHJlbmRlcmVyT3B0aW9ucyk7XG4gICAgICAgICAgICB0aGlzLmNhbnZhcyA9IHRoaXMucmVuZGVyZXIudmlldztcblxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XG5cbiAgICAgICAgICAgIHRoaXMuaXNXZWJHTCA9ICh0aGlzLnJlbmRlcmVyLnR5cGUgPT09IFJFTkRFUkVSX1RZUEUuV0VCR0wpO1xuICAgICAgICAgICAgdGhpcy5pc1dlYkF1ZGlvID0gKERldmljZS5pc0F1ZGlvU3VwcG9ydGVkJiZEZXZpY2UuaXNXZWJBdWRpb1N1cHBvcnRlZCYmY29uZmlnLnVzZVdlYkF1ZGlvKTtcbiAgICAgICAgICAgIHV0aWxzLl9hdWRpb1R5cGVTZWxlY3RlZCA9IHRoaXMuaXNXZWJBdWRpbyA/IEFVRElPX1RZUEUuV0VCQVVESU8gOiBBVURJT19UWVBFLkhUTUxBVURJTztcbiAgICAgICAgICAgIHpJbmRleEVuYWJsZWQgPSBjb25maWcuekluZGV4RW5hYmxlZDtcblxuICAgICAgICAgICAgdGhpcy5pbnB1dCA9IG5ldyBJbnB1dE1hbmFnZXIodGhpcyk7XG4gICAgICAgICAgICB0aGlzLmF1ZGlvID0gbmV3IEF1ZGlvTWFuYWdlcihjb25maWcuYXVkaW9DaGFubmVsTGluZXMsIGNvbmZpZy5zb3VuZENoYW5uZWxMaW5lcywgY29uZmlnLm11c2ljQ2hhbm5lbExpbmVzKTtcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IG5ldyBEYXRhTWFuYWdlcih0aGlzLmlkLCBjb25maWcudXNlUGVyc2lzdGFudERhdGEpO1xuICAgICAgICAgICAgdGhpcy5sb2FkZXIgPSBuZXcgbG9hZGVycy5Mb2FkZXIoY29uZmlnLmFzc2V0c1VybCwgY29uZmlnLmxvYWRlckNvbmN1cnJlbmN5KTtcblxuICAgICAgICAgICAgdmFyIGluaXRpYWxTY2VuZTpTY2VuZSA9IG5ldyBTY2VuZSgnaW5pdGlhbCcpLmFkZFRvKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5zZXRTY2VuZShpbml0aWFsU2NlbmUpO1xuXG4gICAgICAgICAgICBpZihjb25maWcuZ2FtZVNjYWxlVHlwZSAhPT0gR0FNRV9TQ0FMRV9UWVBFLk5PTkUpe1xuICAgICAgICAgICAgICAgIHRoaXMuYXV0b1Jlc2l6ZShjb25maWcuZ2FtZVNjYWxlVHlwZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKGNvbmZpZy5zdG9wQXRMb3N0Rm9jdXMpe1xuICAgICAgICAgICAgICAgIHRoaXMuZW5hYmxlU3RvcEF0TG9zdEZvY3VzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9hbmltYXRlKCk6dm9pZCB7XG4gICAgICAgICAgICB0aGlzLnJhZiA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5fYW5pbWF0ZS5iaW5kKHRoaXMpKTtcblxuICAgICAgICAgICAgaWYodGhpcy5zY2VuZSkge1xuICAgICAgICAgICAgICAgIHZhciBub3c6bnVtYmVyID0gRGF0ZS5ub3coKTtcblxuICAgICAgICAgICAgICAgIHRoaXMudGltZSArPSBNYXRoLm1pbigobm93IC0gbGFzdCkgLyAxMDAwLCBtYXhGcmFtZU1TKSAqIHRoaXMudGltZVNwZWVkO1xuICAgICAgICAgICAgICAgIHRoaXMuZGVsdGEgPSB0aGlzLnRpbWUgLSB0aGlzLmxhc3RUaW1lO1xuICAgICAgICAgICAgICAgIHRoaXMubGFzdFRpbWUgPSB0aGlzLnRpbWU7XG5cbiAgICAgICAgICAgICAgICBsYXN0ID0gbm93O1xuXG4gICAgICAgICAgICAgICAgdGhpcy5wcmVVcGRhdGUodGhpcy5kZWx0YSk7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGUodGhpcy5kZWx0YSk7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5yZW5kZXIodGhpcy5zY2VuZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5wb3N0VXBkYXRlKHRoaXMuZGVsdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdXBkYXRlKGRlbHRhVGltZTpudW1iZXIpOkdhbWUge1xuICAgICAgICAgICAgdGhpcy5zY2VuZS51cGRhdGUodGhpcy5kZWx0YSk7XG5cbiAgICAgICAgICAgIC8vY2xlYW4ga2lsbGVkIG9iamVjdHNcbiAgICAgICAgICAgIHZhciBsZW46bnVtYmVyID0gQ29udGFpbmVyLl9raWxsZWRPYmplY3RzLmxlbmd0aDtcbiAgICAgICAgICAgIGlmIChsZW4pIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpOm51bWJlciA9IDA7IGkgPCBsZW47IGkrKykgQ29udGFpbmVyLl9raWxsZWRPYmplY3RzW2ldLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIENvbnRhaW5lci5fa2lsbGVkT2JqZWN0cy5sZW5ndGggPSAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHByZVVwZGF0ZShkZWx0YVRpbWU6bnVtYmVyKXt9XG4gICAgICAgIHBvc3RVcGRhdGUoZGVsdGFUaW1lOm51bWJlcil7fVxuXG5cbiAgICAgICAgc3RhcnQoKTpHYW1lIHtcbiAgICAgICAgICAgIGxhc3QgPSBEYXRlLm5vdygpO1xuICAgICAgICAgICAgdGhpcy5fYW5pbWF0ZSgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBzdG9wKCk6R2FtZSB7XG4gICAgICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5yYWYpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBlbmFibGVTdG9wQXRMb3N0Rm9jdXMoc3RhdGU6Ym9vbGVhbiA9IHRydWUpOkdhbWV7XG4gICAgICAgICAgICBpZihzdGF0ZSl7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihEZXZpY2UuZ2V0VmlzaWJpbGl0eUNoYW5nZUV2ZW50KCksIHRoaXMuX29uVmlzaWJpbGl0eUNoYW5nZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoRGV2aWNlLmdldFZpc2liaWxpdHlDaGFuZ2VFdmVudCgpLCB0aGlzLl9vblZpc2liaWxpdHlDaGFuZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBkaXNhYmxlU3RvcEF0TG9zdEZvY3VzKCk6R2FtZXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVuYWJsZVN0b3BBdExvc3RGb2N1cyhmYWxzZSk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9vblZpc2liaWxpdHlDaGFuZ2UoKXtcbiAgICAgICAgICAgIHZhciBpc0hpZGUgPSAhIShkb2N1bWVudC5oaWRkZW4gfHwgZG9jdW1lbnQud2Via2l0SGlkZGVuIHx8IGRvY3VtZW50Lm1vekhpZGRlbiB8fCBkb2N1bWVudC5tc0hpZGRlbik7XG4gICAgICAgICAgICBpZihpc0hpZGUpe1xuICAgICAgICAgICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLm9uTG9zdEZvY3VzKGlzSGlkZSk7XG4gICAgICAgIH1cblxuICAgICAgICBvbkxvc3RGb2N1cyhpc0hpZGU6Ym9vbGVhbik6R2FtZXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0U2NlbmUoc2NlbmU6U2NlbmUgfCBzdHJpbmcpOkdhbWUge1xuICAgICAgICAgICAgaWYoIShzY2VuZSBpbnN0YW5jZW9mIFNjZW5lKSl7XG4gICAgICAgICAgICAgICAgc2NlbmUgPSB0aGlzLmdldFNjZW5lKDxzdHJpbmc+c2NlbmUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnNjZW5lID0gPFNjZW5lPnNjZW5lO1xuICAgICAgICAgICAgdGhpcy5zY2VuZS5wb3NpdGlvbi5zZXQodGhpcy53aWR0aC8yLCB0aGlzLmhlaWdodC8yKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0U2NlbmUoaWQ6c3RyaW5nKTpTY2VuZXtcbiAgICAgICAgICAgIHZhciBzY2VuZTpTY2VuZSA9IG51bGw7XG4gICAgICAgICAgICBmb3IodmFyIGk6bnVtYmVyID0gMDsgaSA8IHRoaXMuX3NjZW5lcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5fc2NlbmVzW2ldLmlkID09PSBpZCl7XG4gICAgICAgICAgICAgICAgICAgIHNjZW5lID0gdGhpcy5fc2NlbmVzW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHNjZW5lO1xuICAgICAgICB9XG5cbiAgICAgICAgY3JlYXRlU2NlbmUoaWQ/OnN0cmluZyk6U2NlbmUge1xuICAgICAgICAgICAgcmV0dXJuIChuZXcgU2NlbmUoaWQpKS5hZGRUbyh0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZVNjZW5lKHNjZW5lOnN0cmluZyB8IFNjZW5lKTpHYW1le1xuICAgICAgICAgICAgaWYodHlwZW9mIHNjZW5lID09PSBcInN0cmluZ1wiKXtcbiAgICAgICAgICAgICAgICBzY2VuZSA9IHRoaXMuZ2V0U2NlbmUoPHN0cmluZz5zY2VuZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBpbmRleDpudW1iZXIgPSB0aGlzLl9zY2VuZXMuaW5kZXhPZig8U2NlbmU+c2NlbmUpO1xuICAgICAgICAgICAgaWYoaW5kZXggIT09IC0xKXtcbiAgICAgICAgICAgICAgICB0aGlzLl9zY2VuZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBhZGRTY2VuZShzY2VuZTpTY2VuZSk6R2FtZSB7XG4gICAgICAgICAgICB0aGlzLl9zY2VuZXMucHVzaChzY2VuZSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZUFsbFNjZW5lcygpOkdhbWV7XG4gICAgICAgICAgICB0aGlzLl9zY2VuZXMubGVuZ3RoID0gMDtcbiAgICAgICAgICAgIHRoaXMuc2NlbmUgPSBudWxsO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICByZXNpemUod2lkdGg6bnVtYmVyLCBoZWlnaHQ6bnVtYmVyLCByZW5kZXJlcjpib29sZWFuID0gZmFsc2UpOkdhbWV7XG4gICAgICAgICAgICBpZihyZW5kZXJlcil7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5yZXNpemUod2lkdGgsIGhlaWdodCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLndpZHRoID0gd2lkdGggKyBcInB4XCI7XG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyBcInB4XCI7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgYXV0b1Jlc2l6ZShtb2RlOm51bWJlcik6R2FtZSB7XG4gICAgICAgICAgICBpZih0aGlzLl9yZXNpemVMaXN0ZW5lcil7XG4gICAgICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX3Jlc2l6ZUxpc3RlbmVyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYobW9kZSA9PT0gR0FNRV9TQ0FMRV9UWVBFLk5PTkUpcmV0dXJuO1xuXG4gICAgICAgICAgICBzd2l0Y2gobW9kZSl7XG4gICAgICAgICAgICAgICAgY2FzZSBHQU1FX1NDQUxFX1RZUEUuQVNQRUNUX0ZJVDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVzaXplTGlzdGVuZXIgPSB0aGlzLl9yZXNpemVNb2RlQXNwZWN0Rml0O1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIEdBTUVfU0NBTEVfVFlQRS5BU1BFQ1RfRklMTDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVzaXplTGlzdGVuZXIgPSB0aGlzLl9yZXNpemVNb2RlQXNwZWN0RmlsbDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBHQU1FX1NDQUxFX1RZUEUuRklMTDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVzaXplTGlzdGVuZXIgPSB0aGlzLl9yZXNpemVNb2RlRmlsbDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl9yZXNpemVMaXN0ZW5lci5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIHRoaXMuX3Jlc2l6ZUxpc3RlbmVyKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX3Jlc2l6ZU1vZGVBc3BlY3RGaXQoKTp2b2lke1xuICAgICAgICAgICAgdmFyIHd3Om51bWJlciA9IHBhcnNlSW50KHRoaXMuY2FudmFzLnN0eWxlLndpZHRoLCAxMCkgfHwgdGhpcy5jYW52YXMud2lkdGg7XG4gICAgICAgICAgICB2YXIgaGg6bnVtYmVyID0gcGFyc2VJbnQodGhpcy5jYW52YXMuc3R5bGUuaGVpZ2h0LCAxMCkgfHwgdGhpcy5jYW52YXMuaGVpZ2h0O1xuICAgICAgICAgICAgaWYod2luZG93LmlubmVyV2lkdGggIT09IHd3IHx8IHdpbmRvdy5pbm5lckhlaWdodCAhPT0gaGgpe1xuICAgICAgICAgICAgICAgIHZhciBzY2FsZTpudW1iZXIgPSBNYXRoLm1pbih3aW5kb3cuaW5uZXJXaWR0aC90aGlzLndpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQvdGhpcy5oZWlnaHQpO1xuICAgICAgICAgICAgICAgIHRoaXMucmVzaXplKHRoaXMud2lkdGgqc2NhbGUsIHRoaXMuaGVpZ2h0KnNjYWxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX3Jlc2l6ZU1vZGVBc3BlY3RGaWxsKCk6dm9pZHtcbiAgICAgICAgICAgIHZhciB3dzpudW1iZXIgPSBwYXJzZUludCh0aGlzLmNhbnZhcy5zdHlsZS53aWR0aCwgMTApIHx8IHRoaXMuY2FudmFzLndpZHRoO1xuICAgICAgICAgICAgdmFyIGhoOm51bWJlciA9IHBhcnNlSW50KHRoaXMuY2FudmFzLnN0eWxlLmhlaWdodCwgMTApIHx8IHRoaXMuY2FudmFzLmhlaWdodDtcbiAgICAgICAgICAgIGlmKHdpbmRvdy5pbm5lcldpZHRoICE9PSB3dyB8fCB3aW5kb3cuaW5uZXJIZWlnaHQgIT09IGhoKXtcbiAgICAgICAgICAgICAgICB2YXIgc2NhbGU6bnVtYmVyID0gTWF0aC5tYXgod2luZG93LmlubmVyV2lkdGgvdGhpcy53aWR0aCwgd2luZG93LmlubmVySGVpZ2h0L3RoaXMuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICB2YXIgd2lkdGg6bnVtYmVyID0gdGhpcy53aWR0aCpzY2FsZTtcbiAgICAgICAgICAgICAgICB2YXIgaGVpZ2h0Om51bWJlciA9IHRoaXMuaGVpZ2h0KnNjYWxlO1xuXG4gICAgICAgICAgICAgICAgdmFyIHRvcE1hcmdpbjpudW1iZXIgPSAod2luZG93LmlubmVySGVpZ2h0LWhlaWdodCkvMjtcbiAgICAgICAgICAgICAgICB2YXIgbGVmdE1hcmdpbjpudW1iZXIgPSAod2luZG93LmlubmVyV2lkdGgtd2lkdGgpLzI7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnJlc2l6ZSh3aWR0aCwgaGVpZ2h0KTtcblxuICAgICAgICAgICAgICAgIHZhciBzdHlsZTphbnkgPSA8YW55PnRoaXMuY2FudmFzLnN0eWxlO1xuICAgICAgICAgICAgICAgIHN0eWxlWydtYXJnaW4tdG9wJ10gPSB0b3BNYXJnaW4gKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgc3R5bGVbJ21hcmdpbi1sZWZ0J10gPSBsZWZ0TWFyZ2luICsgXCJweFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfcmVzaXplTW9kZUZpbGwoKTp2b2lke1xuICAgICAgICAgICAgdmFyIHd3Om51bWJlciA9IHBhcnNlSW50KHRoaXMuY2FudmFzLnN0eWxlLndpZHRoLCAxMCkgfHwgdGhpcy5jYW52YXMud2lkdGg7XG4gICAgICAgICAgICB2YXIgaGg6bnVtYmVyID0gcGFyc2VJbnQodGhpcy5jYW52YXMuc3R5bGUuaGVpZ2h0LCAxMCkgfHwgdGhpcy5jYW52YXMuaGVpZ2h0O1xuICAgICAgICAgICAgaWYod2luZG93LmlubmVyV2lkdGggIT09IHd3IHx8IHdpbmRvdy5pbm5lckhlaWdodCAhPT0gaGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGdldCB3aWR0aCgpOm51bWJlciB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJlci53aWR0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBoZWlnaHQoKTpudW1iZXIge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyZXIuaGVpZ2h0O1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIEdhbWVDb25maWcge1xuICAgICAgICBpZD86c3RyaW5nO1xuICAgICAgICB3aWR0aD86bnVtYmVyO1xuICAgICAgICBoZWlnaHQ/Om51bWJlcjtcbiAgICAgICAgdXNlV2ViQXVkaW8/OmJvb2xlYW47XG4gICAgICAgIHVzZVBlcnNpc3RhbnREYXRhPzpib29sZWFuO1xuICAgICAgICBnYW1lU2NhbGVUeXBlPzpudW1iZXI7XG4gICAgICAgIHN0b3BBdExvc3RGb2N1cz86Ym9vbGVhbjtcbiAgICAgICAgYXNzZXRzVXJsPzpzdHJpbmc7XG4gICAgICAgIGxvYWRlckNvbmN1cnJlbmN5PzpudW1iZXI7XG4gICAgICAgIGF1ZGlvQ2hhbm5lbExpbmVzPzpudW1iZXI7XG4gICAgICAgIHNvdW5kQ2hhbm5lbExpbmVzPzpudW1iZXI7XG4gICAgICAgIG11c2ljQ2hhbm5lbExpbmVzPzpudW1iZXI7XG4gICAgICAgIHpJbmRleEVuYWJsZWQ/OmJvb2xlYW47XG4gICAgfVxufVxuXG5pbnRlcmZhY2UgT2JqZWN0IHtcbiAgICBhc3NpZ24odGFyZ2V0Ok9iamVjdCwgLi4uc291cmNlczpPYmplY3RbXSk6T2JqZWN0O1xufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4vQXVkaW9MaW5lLnRzXCIgLz5cbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL2NvcmUvR2FtZS50c1wiIC8+XG5tb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IGNsYXNzIEF1ZGlvTWFuYWdlcntcbiAgICAgICAgc291bmRMaW5lczpBdWRpb0xpbmVbXSA9IFtdO1xuICAgICAgICBtdXNpY0xpbmVzOkF1ZGlvTGluZVtdID0gW107XG4gICAgICAgIG5vcm1hbExpbmVzOkF1ZGlvTGluZVtdID0gW107XG4gICAgICAgIHByaXZhdGUgX3RlbXBMaW5lczpBdWRpb0xpbmVbXSA9IFtdO1xuXG4gICAgICAgIG11c2ljTXV0ZWQ6Ym9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBzb3VuZE11dGVkOmJvb2xlYW4gPSBmYWxzZTtcblxuICAgICAgICBjb250ZXh0OkF1ZGlvQ29udGV4dDtcbiAgICAgICAgZ2Fpbk5vZGU6QXVkaW9Ob2RlO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYXVkaW9DaGFubmVsTGluZXM6bnVtYmVyID0gMTAsIHByaXZhdGUgc291bmRDaGFubmVsTGluZXM6bnVtYmVyID0gMTAsIHByaXZhdGUgbXVzaWNDaGFubmVsTGluZXM6bnVtYmVyID0gMSl7XG4gICAgICAgICAgICBpZih1dGlscy5fYXVkaW9UeXBlU2VsZWN0ZWQgPT09IEFVRElPX1RZUEUuV0VCQVVESU8pIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQgPSBEZXZpY2UuZ2xvYmFsV2ViQXVkaW9Db250ZXh0O1xuICAgICAgICAgICAgICAgIHRoaXMuZ2Fpbk5vZGUgPSB0aGlzLmNyZWF0ZUdhaW5Ob2RlKHRoaXMuY29udGV4dCk7XG4gICAgICAgICAgICAgICAgdGhpcy5nYWluTm9kZS5jb25uZWN0KHRoaXMuY29udGV4dC5kZXN0aW5hdGlvbik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBpOm51bWJlcjtcbiAgICAgICAgICAgIGZvcihpID0gMDsgaSA8IHRoaXMuYXVkaW9DaGFubmVsTGluZXM7IGkrKyl7XG4gICAgICAgICAgICAgICAgdGhpcy5ub3JtYWxMaW5lcy5wdXNoKG5ldyBBdWRpb0xpbmUodGhpcykpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCB0aGlzLnNvdW5kQ2hhbm5lbExpbmVzOyBpKyspe1xuICAgICAgICAgICAgICAgIHRoaXMuc291bmRMaW5lcy5wdXNoKG5ldyBBdWRpb0xpbmUodGhpcykpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCB0aGlzLm11c2ljQ2hhbm5lbExpbmVzOyBpKyspe1xuICAgICAgICAgICAgICAgIHRoaXMubXVzaWNMaW5lcy5wdXNoKG5ldyBBdWRpb0xpbmUodGhpcykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZ2V0QXVkaW8oaWQ6c3RyaW5nKTpBdWRpb3tcbiAgICAgICAgICAgIHZhciBhdWRpbzpBdWRpbyA9IHV0aWxzLkF1ZGlvQ2FjaGVbaWRdO1xuICAgICAgICAgICAgYXVkaW8ubWFuYWdlciA9IHRoaXM7XG4gICAgICAgICAgICByZXR1cm4gYXVkaW87XG4gICAgICAgIH1cblxuICAgICAgICBwYXVzZUFsbExpbmVzKCk6QXVkaW9NYW5hZ2VyIHtcbiAgICAgICAgICAgIHRoaXMucGF1c2VNdXNpYygpO1xuICAgICAgICAgICAgdGhpcy5wYXVzZVNvdW5kKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc3VtZUFsbExpbmVzKCk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgdGhpcy5yZXN1bWVNdXNpYygpO1xuICAgICAgICAgICAgdGhpcy5yZXN1bWVTb3VuZCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwbGF5KGlkOnN0cmluZywgbG9vcD86Ym9vbGVhbnxGdW5jdGlvbiwgY2FsbGJhY2s/OkZ1bmN0aW9uKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICBpZih0eXBlb2YgbG9vcCA9PT0gXCJmdW5jdGlvblwiKXtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayA9IDxGdW5jdGlvbj5sb29wO1xuICAgICAgICAgICAgICAgIGxvb3AgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wbGF5KGlkLCB0aGlzLm5vcm1hbExpbmVzLCA8Ym9vbGVhbj5sb29wLCBjYWxsYmFjayk7XG4gICAgICAgIH1cblxuICAgICAgICBwbGF5TXVzaWMoaWQ6c3RyaW5nLCBsb29wPzpib29sZWFufEZ1bmN0aW9uLCBjYWxsYmFjaz86RnVuY3Rpb24pOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIGlmKHR5cGVvZiBsb29wID09PSBcImZ1bmN0aW9uXCIpe1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrID0gPEZ1bmN0aW9uPmxvb3A7XG4gICAgICAgICAgICAgICAgbG9vcCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BsYXkoaWQsIHRoaXMubXVzaWNMaW5lcywgPGJvb2xlYW4+bG9vcCwgY2FsbGJhY2spO1xuICAgICAgICB9XG5cbiAgICAgICAgcGxheVNvdW5kKGlkOnN0cmluZywgbG9vcD86Ym9vbGVhbnxGdW5jdGlvbiwgY2FsbGJhY2s/OkZ1bmN0aW9uKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICBpZih0eXBlb2YgbG9vcCA9PT0gXCJmdW5jdGlvblwiKXtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayA9IDxGdW5jdGlvbj5sb29wO1xuICAgICAgICAgICAgICAgIGxvb3AgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wbGF5KGlkLCB0aGlzLnNvdW5kTGluZXMsIDxib29sZWFuPmxvb3AsIGNhbGxiYWNrKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0b3AoaWQ/OnN0cmluZyk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N0b3AoaWQsIHRoaXMubm9ybWFsTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RvcE11c2ljKGlkPzpzdHJpbmcpOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdG9wKGlkLCB0aGlzLm11c2ljTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RvcFNvdW5kKGlkPzpzdHJpbmcpOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdG9wKGlkLCB0aGlzLnNvdW5kTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcGF1c2UoaWQ/OnN0cmluZyk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BhdXNlKGlkLCB0aGlzLm5vcm1hbExpbmVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBhdXNlTXVzaWMoaWQ/OnN0cmluZyk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BhdXNlKGlkLCB0aGlzLm11c2ljTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcGF1c2VTb3VuZChpZD86c3RyaW5nKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGF1c2UoaWQsIHRoaXMuc291bmRMaW5lcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXN1bWUoaWQ/OnN0cmluZyk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Jlc3VtZShpZCwgdGhpcy5ub3JtYWxMaW5lcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXN1bWVNdXNpYyhpZD86c3RyaW5nKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVzdW1lKGlkLCB0aGlzLm11c2ljTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzdW1lU291bmQoaWQ/OnN0cmluZyk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Jlc3VtZShpZCwgdGhpcy5zb3VuZExpbmVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG11dGUoaWQ/OnN0cmluZyk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX211dGUoaWQsIHRoaXMubm9ybWFsTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgbXV0ZU11c2ljKGlkPzpzdHJpbmcpOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tdXRlKGlkLCB0aGlzLm11c2ljTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgbXV0ZVNvdW5kKGlkPzpzdHJpbmcpOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tdXRlKGlkLCB0aGlzLnNvdW5kTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdW5tdXRlKGlkPzpzdHJpbmcpOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl91bm11dGUoaWQsIHRoaXMubm9ybWFsTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdW5tdXRlTXVzaWMoaWQ/OnN0cmluZyk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3VubXV0ZShpZCwgdGhpcy5tdXNpY0xpbmVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHVubXV0ZVNvdW5kKGlkPzpzdHJpbmcpOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl91bm11dGUoaWQsIHRoaXMuc291bmRMaW5lcyk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9wYXVzZShpZDpzdHJpbmcsIGxpbmVzOkF1ZGlvTGluZVtdKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICBpZighaWQpe1xuICAgICAgICAgICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBpZighbGluZXNbaV0uYXZhaWxhYmxlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzW2ldLnBhdXNlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGF1ZGlvTGluZXM6QXVkaW9MaW5lW10gPSB0aGlzLl9nZXRMaW5lc0J5SWQoaWQsIGxpbmVzKTtcbiAgICAgICAgICAgIGlmKGF1ZGlvTGluZXMubGVuZ3RoKXtcbiAgICAgICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCBhdWRpb0xpbmVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICAgICAgYXVkaW9MaW5lc1tpXS5wYXVzZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfcmVzdW1lKGlkOnN0cmluZywgbGluZXM6QXVkaW9MaW5lW10pOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIGlmKCFpZCl7XG4gICAgICAgICAgICAgICAgZm9yKHZhciBpOm51bWJlciA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgICAgIGlmKCFsaW5lc1tpXS5hdmFpbGFibGUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluZXNbaV0ucmVzdW1lKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGF1ZGlvTGluZXM6QXVkaW9MaW5lW10gPSB0aGlzLl9nZXRMaW5lc0J5SWQoaWQsIGxpbmVzKTtcbiAgICAgICAgICAgIGlmKGF1ZGlvTGluZXMubGVuZ3RoKXtcbiAgICAgICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCBhdWRpb0xpbmVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICAgICAgYXVkaW9MaW5lc1tpXS5yZXN1bWUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX3BsYXkoaWQ6c3RyaW5nLCBsaW5lczpBdWRpb0xpbmVbXSwgbG9vcDpib29sZWFuID0gZmFsc2UsIGNhbGxiYWNrPzpGdW5jdGlvbik6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgdmFyIGxpbmU6QXVkaW9MaW5lID0gdGhpcy5fZ2V0QXZhaWxhYmxlTGluZUZyb20obGluZXMpO1xuICAgICAgICAgICAgaWYoIWxpbmUpe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0F1ZGlvTWFuYWdlcjogQWxsIGxpbmVzIGFyZSBidXN5IScpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgYXVkaW86QXVkaW8gPSB0aGlzLmdldEF1ZGlvKGlkKTtcbiAgICAgICAgICAgIGlmKCFhdWRpbyl7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignQXVkaW8gKCcgKyBpZCArICcpIG5vdCBmb3VuZC4nKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGluZS5zZXRBdWRpbyhhdWRpbywgbG9vcCwgY2FsbGJhY2spLnBsYXkoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfc3RvcChpZDpzdHJpbmcsIGxpbmVzOkF1ZGlvTGluZVtdKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICBpZighaWQpe1xuICAgICAgICAgICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBpZighbGluZXNbaV0uYXZhaWxhYmxlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzW2ldLnN0b3AoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgYXVkaW9MaW5lczpBdWRpb0xpbmVbXSA9IHRoaXMuX2dldExpbmVzQnlJZChpZCwgbGluZXMpO1xuICAgICAgICAgICAgaWYoYXVkaW9MaW5lcy5sZW5ndGgpe1xuICAgICAgICAgICAgICAgIGZvcihpID0gMDsgaSA8IGF1ZGlvTGluZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBhdWRpb0xpbmVzW2ldLnN0b3AoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfbXV0ZShpZDpzdHJpbmcsIGxpbmVzOkF1ZGlvTGluZVtdKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICBpZighaWQpe1xuICAgICAgICAgICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBpZighbGluZXNbaV0uYXZhaWxhYmxlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzW2ldLm11dGUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgYXVkaW9MaW5lczpBdWRpb0xpbmVbXSA9IHRoaXMuX2dldExpbmVzQnlJZChpZCwgbGluZXMpO1xuICAgICAgICAgICAgaWYoYXVkaW9MaW5lcy5sZW5ndGgpe1xuICAgICAgICAgICAgICAgIGZvcihpID0gMDsgaSA8IGF1ZGlvTGluZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBhdWRpb0xpbmVzW2ldLm11dGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX3VubXV0ZShpZDpzdHJpbmcsIGxpbmVzOkF1ZGlvTGluZVtdKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICBpZighaWQpe1xuICAgICAgICAgICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBpZighbGluZXNbaV0uYXZhaWxhYmxlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzW2ldLnVubXV0ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBhdWRpb0xpbmVzOkF1ZGlvTGluZVtdID0gdGhpcy5fZ2V0TGluZXNCeUlkKGlkLCBsaW5lcyk7XG4gICAgICAgICAgICBpZihhdWRpb0xpbmVzLmxlbmd0aCl7XG4gICAgICAgICAgICAgICAgZm9yKGkgPSAwOyBpIDwgYXVkaW9MaW5lcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgICAgIGF1ZGlvTGluZXNbaV0udW5tdXRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9nZXRMaW5lc0J5SWQoaWQ6c3RyaW5nLCBsaW5lczpBdWRpb0xpbmVbXSk6QXVkaW9MaW5lW10ge1xuICAgICAgICAgICAgdGhpcy5fdGVtcExpbmVzLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICBmb3IodmFyIGk6bnVtYmVyID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICBpZighbGluZXNbaV0uYXZhaWxhYmxlKXtcbiAgICAgICAgICAgICAgICAgICAgaWYobGluZXNbaV0uYXVkaW8uaWQgPT09IGlkKXRoaXMuX3RlbXBMaW5lcy5wdXNoKGxpbmVzW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90ZW1wTGluZXM7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9nZXRBdmFpbGFibGVMaW5lRnJvbShsaW5lczpBdWRpb0xpbmVbXSk6QXVkaW9MaW5le1xuICAgICAgICAgICAgdmFyIGw6QXVkaW9MaW5lO1xuICAgICAgICAgICAgZm9yKHZhciBpOm51bWJlciA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgaWYobGluZXNbaV0uYXZhaWxhYmxlKXtcbiAgICAgICAgICAgICAgICAgICAgbCA9IGxpbmVzW2ldO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNyZWF0ZUdhaW5Ob2RlKGN0eDpBdWRpb0NvbnRleHQpOkdhaW5Ob2Rle1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5jcmVhdGVHYWluID8gY3R4LmNyZWF0ZUdhaW4oKSA6IGN0eC5jcmVhdGVHYWluTm9kZSgpO1xuICAgICAgICB9XG5cbiAgICB9XG59XG5cbmludGVyZmFjZSBBdWRpb0NvbnRleHQge1xuICAgIGNyZWF0ZUdhaW5Ob2RlKCk6YW55O1xufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4vQXVkaW9NYW5hZ2VyLnRzXCIgLz5cbm1vZHVsZSBQSVhJIHtcbiAgICBleHBvcnQgY2xhc3MgQXVkaW8ge1xuICAgICAgICBsb29wOmJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgcHJpdmF0ZSBfdm9sdW1lOm51bWJlciA9IDE7XG4gICAgICAgIG11dGVkOmJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgbWFuYWdlcjpBdWRpb01hbmFnZXI7XG5cbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIHNvdXJjZTphbnksIHB1YmxpYyBpZDpzdHJpbmcpe31cblxuICAgICAgICBwbGF5KGxvb3A/OmJvb2xlYW58RnVuY3Rpb24sIGNhbGxiYWNrPzpGdW5jdGlvbik6QXVkaW97XG4gICAgICAgICAgICBpZighdGhpcy5tYW5hZ2VyKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdUaGlzIGF1ZGlvIG5lZWQgYSBtYW5hZ2VyLicpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZih0eXBlb2YgbG9vcCA9PT0gXCJmdW5jdGlvblwiKXtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayA9IDxGdW5jdGlvbj5sb29wO1xuICAgICAgICAgICAgICAgIGxvb3AgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLnBsYXkodGhpcy5pZCwgbG9vcCwgY2FsbGJhY2spO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBzdG9wKCk6QXVkaW8ge1xuICAgICAgICAgICAgaWYoIXRoaXMubWFuYWdlcil7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignVGhpcyBhdWRpbyBuZWVkIGEgbWFuYWdlci4nKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLnN0b3AodGhpcy5pZCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIG11dGUoKTpBdWRpbyB7XG4gICAgICAgICAgICBpZighdGhpcy5tYW5hZ2VyKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdUaGlzIGF1ZGlvIG5lZWQgYSBtYW5hZ2VyLicpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLm11dGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5tdXRlKHRoaXMuaWQpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICB1bm11dGUoKTpBdWRpbyB7XG4gICAgICAgICAgICBpZighdGhpcy5tYW5hZ2VyKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdUaGlzIGF1ZGlvIG5lZWQgYSBtYW5hZ2VyLicpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLm11dGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLm1hbmFnZXIudW5tdXRlKHRoaXMuaWQpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwYXVzZSgpOkF1ZGlvIHtcbiAgICAgICAgICAgIGlmKCF0aGlzLm1hbmFnZXIpe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1RoaXMgYXVkaW8gbmVlZCBhIG1hbmFnZXIuJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5wYXVzZSh0aGlzLmlkKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzdW1lKCk6QXVkaW8ge1xuICAgICAgICAgICAgaWYoIXRoaXMubWFuYWdlcil7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignVGhpcyBhdWRpbyBuZWVkIGEgbWFuYWdlci4nKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLnJlc3VtZSh0aGlzLmlkKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHZvbHVtZSgpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ZvbHVtZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldCB2b2x1bWUodmFsdWU6bnVtYmVyKXtcbiAgICAgICAgICAgIHRoaXMuX3ZvbHVtZSA9IHZhbHVlO1xuXG4gICAgICAgICAgICBpZih0aGlzLm1hbmFnZXIpe1xuICAgICAgICAgICAgICAgIC8vVE9ETzogdXBkYXRlIHRoZSB2b2x1bWUgb24gdGhlIGZseVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2RlZnMvcGl4aS5qcy5kLnRzXCIgLz5cbm1vZHVsZSBQSVhJIHtcbiAgICBleHBvcnQgY2xhc3MgUG9vbCB7XG4gICAgICAgIHByaXZhdGUgX2l0ZW1zOmFueVtdID0gW107XG5cbiAgICAgICAgY29uc3RydWN0b3IoYW1vdW50Om51bWJlciwgcHVibGljIG9iamVjdEN0b3I6YW55LCBwdWJsaWMgYXJnczphbnlbXSA9IFtdKXtcbiAgICAgICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgYW1vdW50OyBpKyspe1xuICAgICAgICAgICAgICAgIHRoaXMuX2l0ZW1zLnB1c2godGhpcy5fbmV3T2JqZWN0KCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfbmV3T2JqZWN0KCk6YW55e1xuICAgICAgICAgICAgdmFyIG9iajphbnk7XG4gICAgICAgICAgICB0cnl7XG4gICAgICAgICAgICAgICAgb2JqID0gbmV3IChGdW5jdGlvbi5wcm90b3R5cGUuYmluZC5hcHBseSh0aGlzLm9iamVjdEN0b3IsIChbbnVsbF0pLmNvbmNhdCh0aGlzLmFyZ3MpKSkoKTtcbiAgICAgICAgICAgIH1jYXRjaChlKXtcbiAgICAgICAgICAgICAgICBvYmogPSBfbmV3T2JqKHRoaXMub2JqZWN0Q3RvciwgdGhpcy5hcmdzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIG1lOlBvb2wgPSB0aGlzO1xuICAgICAgICAgICAgb2JqLnJldHVyblRvUG9vbCA9IGZ1bmN0aW9uIHJldHVyblRvUG9vbCgpe1xuICAgICAgICAgICAgICAgICAgbWUucHV0KHRoaXMpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1dChpdGVtOmFueSk6dm9pZHtcbiAgICAgICAgICAgIHRoaXMuX2l0ZW1zLnVuc2hpZnQoaXRlbSk7XG4gICAgICAgICAgICBpZihpdGVtLm9uUmV0dXJuVG9Qb29sKWl0ZW0ub25SZXR1cm5Ub1Bvb2wodGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQoKTphbnl7XG4gICAgICAgICAgICB2YXIgaXRlbTphbnkgPSAodGhpcy5faXRlbXMubGVuZ3RoKSA/IHRoaXMuX2l0ZW1zLnBvcCgpIDogdGhpcy5fbmV3T2JqZWN0KCk7XG4gICAgICAgICAgICBpZihpdGVtLm9uR2V0RnJvbVBvb2wpaXRlbS5vbkdldEZyb21Qb29sKHRoaXMpO1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgbGVuZ3RoKCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faXRlbXMubGVuZ3RoO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy9zYWZhcmkgZml4XG4gICAgZnVuY3Rpb24gX25ld09iaihvYmo6YW55LCBhcmdzOmFueVtdKTphbnl7XG4gICAgICAgIHZhciBldjpzdHJpbmcgPSBcIkZ1bmN0aW9uKCdvYmonLFwiO1xuICAgICAgICB2YXIgZm46c3RyaW5nID0gXCJcXFwicmV0dXJuIG5ldyBvYmooXCI7XG5cbiAgICAgICAgZm9yKHZhciBpOm51bWJlciA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIGV2ICs9IFwiJ2FcIitpK1wiJyxcIjtcbiAgICAgICAgICAgIGZuICs9IFwiYVwiK2k7XG4gICAgICAgICAgICBpZihpICE9PSBhcmdzLmxlbmd0aC0xKXtcbiAgICAgICAgICAgICAgICBmbiArPSBcIixcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZuICs9IFwiKVxcXCJcIjtcbiAgICAgICAgZXYgKz0gZm4gKyBcIilcIjtcblxuICAgICAgICByZXR1cm4gKGV2YWwoZXYpKS5hcHBseSh0aGlzLCAoW29ial0pLmNvbmNhdChhcmdzKSk7XG4gICAgfVxufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2RlZnMvcGl4aS5qcy5kLnRzXCIgLz5cbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL2NvcmUvY29uc3QudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vdHdlZW4vVHdlZW4udHNcIiAvPlxubW9kdWxlIFBJWEkge1xuICAgIENvbnRhaW5lci5fa2lsbGVkT2JqZWN0cyA9IFtdO1xuXG4gICAgQ29udGFpbmVyLnByb3RvdHlwZS5fekluZGV4ID0gMDtcbiAgICBDb250YWluZXIucHJvdG90eXBlLnpEaXJ0eSA9IGZhbHNlO1xuXG4gICAgQ29udGFpbmVyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihkZWx0YVRpbWU6IG51bWJlcik6Q29udGFpbmVyIHtcbiAgICAgICAgaWYodGhpcy56RGlydHkpe1xuICAgICAgICAgICAgdGhpcy56RGlydHkgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuc29ydENoaWxkcmVuQnlaSW5kZXgoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucG9zaXRpb24ueCArPSB0aGlzLnZlbG9jaXR5LnggKiBkZWx0YVRpbWU7XG4gICAgICAgIHRoaXMucG9zaXRpb24ueSArPSB0aGlzLnZlbG9jaXR5LnkgKiBkZWx0YVRpbWU7XG4gICAgICAgIHRoaXMucm90YXRpb24gKz0gdGhpcy5yb3RhdGlvblNwZWVkICogZGVsdGFUaW1lO1xuXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5baV0udXBkYXRlKGRlbHRhVGltZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgdmFyIF9hZGRDaGlsZDpGdW5jdGlvbiA9IENvbnRhaW5lci5wcm90b3R5cGUuYWRkQ2hpbGQ7XG4gICAgQ29udGFpbmVyLnByb3RvdHlwZS5hZGRDaGlsZCA9IGZ1bmN0aW9uKGNoaWxkOkRpc3BsYXlPYmplY3QpOkRpc3BsYXlPYmplY3R7XG4gICAgICAgIF9hZGRDaGlsZC5jYWxsKHRoaXMsIGNoaWxkKTtcbiAgICAgICAgaWYoekluZGV4RW5hYmxlZCl0aGlzLnpEaXJ0eSA9IHRydWU7XG4gICAgICAgIHJldHVybiBjaGlsZDtcbiAgICB9O1xuXG4gICAgQ29udGFpbmVyLnByb3RvdHlwZS5hZGRUbyA9IGZ1bmN0aW9uKHBhcmVudCk6Q29udGFpbmVye1xuICAgICAgICBwYXJlbnQuYWRkQ2hpbGQodGhpcyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBDb250YWluZXIucHJvdG90eXBlLmtpbGwgPSBmdW5jdGlvbigpOkNvbnRhaW5lcntcbiAgICAgICAgUElYSS5Db250YWluZXIuX2tpbGxlZE9iamVjdHMucHVzaCh0aGlzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIENvbnRhaW5lci5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgaWYodGhpcy5wYXJlbnQpe1xuICAgICAgICAgICAgdGhpcy5wYXJlbnQucmVtb3ZlQ2hpbGQodGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIENvbnRhaW5lci5wcm90b3R5cGUuc29ydENoaWxkcmVuQnlaSW5kZXggPSBmdW5jdGlvbigpOkNvbnRhaW5lciB7XG4gICAgICAgIHRoaXMuY2hpbGRyZW4uc29ydChmdW5jdGlvbihhOkNvbnRhaW5lciwgYjpDb250YWluZXIpe1xuICAgICAgICAgICAgdmFyIGFaID0gYS56SW5kZXgsXG4gICAgICAgICAgICAgICAgYlogPSBiLnpJbmRleDtcblxuICAgICAgICAgICAgcmV0dXJuIGFaIC0gYlo7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgQ29udGFpbmVyLnByb3RvdHlwZS50d2VlbiA9IGZ1bmN0aW9uKG1hbmFnZXI/OlR3ZWVuTWFuYWdlcik6VHdlZW57XG4gICAgICAgIHJldHVybiBuZXcgVHdlZW4odGhpcyk7XG4gICAgfTtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShDb250YWluZXIucHJvdG90eXBlLCAnekluZGV4Jywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCk6bnVtYmVye1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3pJbmRleDtcbiAgICAgICAgfSxcblxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlOm51bWJlcil7XG4gICAgICAgICAgICB0aGlzLl96SW5kZXggPSB2YWx1ZTtcbiAgICAgICAgICAgIGlmKHpJbmRleEVuYWJsZWQmJnRoaXMucGFyZW50KXRoaXMucGFyZW50LnpEaXJ0eSA9IHRydWU7XG4gICAgICAgIH1cblxuICAgIH0pO1xuXG59IiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vZGVmcy9waXhpLmpzLmQudHNcIiAvPlxuXG5tb2R1bGUgUElYSSB7XG4gICAgRGlzcGxheU9iamVjdC5wcm90b3R5cGUuc3BlZWQgPSAwO1xuICAgIERpc3BsYXlPYmplY3QucHJvdG90eXBlLnZlbG9jaXR5ID0gbmV3IFBvaW50KCk7XG4gICAgRGlzcGxheU9iamVjdC5wcm90b3R5cGUuZGlyZWN0aW9uID0gMDtcbiAgICBEaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5yb3RhdGlvblNwZWVkID0gMDtcblxuICAgIERpc3BsYXlPYmplY3QucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKGRlbHRhVGltZTpudW1iZXIpOkRpc3BsYXlPYmplY3R7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG59XG4iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9kZWZzL3BpeGkuanMuZC50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi90d2Vlbi9QYXRoLnRzXCIgLz5cbm1vZHVsZSBQSVhJIHtcbiAgICBHcmFwaGljcy5wcm90b3R5cGUuZHJhd1BhdGggPSBmdW5jdGlvbihwYXRoOlBhdGgpOkdyYXBoaWNze1xuICAgICAgICBwYXRoLnBhcnNlUG9pbnRzKCk7XG4gICAgICAgIHRoaXMuZHJhd1NoYXBlKHBhdGgucG9seWdvbik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG59Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
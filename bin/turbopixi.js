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
    ///<reference path="./TweenManager.ts" />
    ///<reference path="./Easing.ts" />
    ///<reference path="../display/Scene.ts" />
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
                _parseRecursiveData(this._to, this._from, this.target);    //todo: parse paths
            };
            Tween.prototype._apply = function (time) {
                _recursiveApply(this._to, this._from, this.target, time, this._elapsedTime, this.easing);    //todo: apply path
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
                    this.renderer.render(this.scene);
                    this.update(this.delta);
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
    ///<reference path="../core/const.ts" />
    ///<reference path="../tween/Tween.ts" />
    var PIXI;
    (function (PIXI) {
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
        var _addChild = PIXI.Container.prototype.addChild;
        PIXI.Container.prototype.addChild = function (child) {
            _addChild.call(this, child);
            if (PIXI.zIndexEnabled)
                this.sortChildrenByZIndex();
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
        PIXI.Container.prototype.tween = function () {
            return new PIXI.Tween(this);
        };
    }(PIXI || (PIXI = {})));
    ///<reference path="../../defs/pixi.js.d.ts" />
    var PIXI;
    (function (PIXI) {
        PIXI.DisplayObject.prototype.speed = 0;
        PIXI.DisplayObject.prototype.velocity = new PIXI.Point();
        PIXI.DisplayObject.prototype.direction = 0;
        PIXI.DisplayObject.prototype.rotationSpeed = 0;
        PIXI.DisplayObject.prototype.zIndex = 0;
        PIXI.DisplayObject.prototype.update = function (deltaTime) {
            return this;
        };
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
    }(PIXI || (PIXI = {})));    //todo 
}(typeof PIXI === 'object' ? PIXI : null));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInR1cmJvcGl4aS5qcyIsImluZGV4LnRzIiwiYXVkaW8vQXVkaW9MaW5lLnRzIiwiY29yZS9jb25zdC50cyIsImNvcmUvRGV2aWNlLnRzIiwiZGlzcGxheS9DYW1lcmEudHMiLCJ0aW1lci9UaW1lci50cyIsInRpbWVyL1RpbWVyTWFuYWdlci50cyIsInR3ZWVuL0Vhc2luZy50cyIsInR3ZWVuL1R3ZWVuLnRzIiwidHdlZW4vVHdlZW5NYW5hZ2VyLnRzIiwiZGlzcGxheS9TY2VuZS50cyIsImlucHV0L0lucHV0TWFuYWdlci50cyIsImxvYWRlci9iaXRtYXBGb250UGFyc2VyVFhULnRzIiwibG9hZGVyL2F1ZGlvUGFyc2VyLnRzIiwiY29yZS9VdGlscy50cyIsImxvYWRlci9Mb2FkZXIudHMiLCJjb3JlL0RhdGFNYW5hZ2VyLnRzIiwiY29yZS9HYW1lLnRzIiwiYXVkaW8vQXVkaW9NYW5hZ2VyLnRzIiwiYXVkaW8vQXVkaW8udHMiLCJkaXNwbGF5L0NvbnRhaW5lci50cyIsImRpc3BsYXkvRGlzcGxheU9iamVjdC50cyIsImNvcmUvUG9vbC50cyJdLCJuYW1lcyI6WyJQSVhJIiwiRXJyb3IiLCJQSVhJX1ZFUlNJT05fUkVRVUlSRUQiLCJQSVhJX1ZFUlNJT04iLCJWRVJTSU9OIiwibWF0Y2giLCJIVE1MQXVkaW8iLCJBdWRpbyIsIlBJWEkuQXVkaW9MaW5lIiwiUElYSS5BdWRpb0xpbmUuY29uc3RydWN0b3IiLCJQSVhJLkF1ZGlvTGluZS5zZXRBdWRpbyIsIlBJWEkuQXVkaW9MaW5lLnBsYXkiLCJQSVhJLkF1ZGlvTGluZS5zdG9wIiwiUElYSS5BdWRpb0xpbmUucGF1c2UiLCJQSVhJLkF1ZGlvTGluZS5yZXN1bWUiLCJQSVhJLkF1ZGlvTGluZS5tdXRlIiwiUElYSS5BdWRpb0xpbmUudW5tdXRlIiwiUElYSS5BdWRpb0xpbmUudm9sdW1lIiwiUElYSS5BdWRpb0xpbmUucmVzZXQiLCJQSVhJLkF1ZGlvTGluZS5fb25FbmQiLCJQSVhJLkdBTUVfU0NBTEVfVFlQRSIsIlBJWEkuQVVESU9fVFlQRSIsIlBJWEkuRGV2aWNlIiwiUElYSS5EZXZpY2UuZ2V0TW91c2VXaGVlbEV2ZW50IiwiUElYSS5EZXZpY2UudmlicmF0ZSIsIlBJWEkuRGV2aWNlLmdldFZpc2liaWxpdHlDaGFuZ2VFdmVudCIsIlBJWEkuRGV2aWNlLmlzT25saW5lIiwiX19leHRlbmRzIiwiZCIsImIiLCJwIiwiaGFzT3duUHJvcGVydHkiLCJfXyIsImNvbnN0cnVjdG9yIiwicHJvdG90eXBlIiwiUElYSS5DYW1lcmEiLCJQSVhJLkNhbWVyYS5jb25zdHJ1Y3RvciIsIlBJWEkuQ2FtZXJhLnVwZGF0ZSIsImdldCIsIlBJWEkuQ2FtZXJhLmVuYWJsZWQiLCJzZXQiLCJlbnVtZXJhYmxlIiwiY29uZmlndXJhYmxlIiwiUElYSS5UaW1lciIsIlBJWEkuVGltZXIuY29uc3RydWN0b3IiLCJQSVhJLlRpbWVyLnVwZGF0ZSIsIlBJWEkuVGltZXIuYWRkVG8iLCJQSVhJLlRpbWVyLnJlbW92ZSIsIlBJWEkuVGltZXIuc3RhcnQiLCJQSVhJLlRpbWVyLnN0b3AiLCJQSVhJLlRpbWVyLnJlc2V0IiwiUElYSS5UaW1lci5vblN0YXJ0IiwiUElYSS5UaW1lci5vbkVuZCIsIlBJWEkuVGltZXIub25TdG9wIiwiUElYSS5UaW1lci5vblVwZGF0ZSIsIlBJWEkuVGltZXIub25SZXBlYXQiLCJQSVhJLlRpbWVyTWFuYWdlciIsIlBJWEkuVGltZXJNYW5hZ2VyLmNvbnN0cnVjdG9yIiwiUElYSS5UaW1lck1hbmFnZXIudXBkYXRlIiwiUElYSS5UaW1lck1hbmFnZXIucmVtb3ZlVGltZXIiLCJQSVhJLlRpbWVyTWFuYWdlci5hZGRUaW1lciIsIlBJWEkuVGltZXJNYW5hZ2VyLmNyZWF0ZVRpbWVyIiwiUElYSS5UaW1lck1hbmFnZXIuX3JlbW92ZSIsIlBJWEkuRWFzaW5nIiwiUElYSS5FYXNpbmcubGluZWFyIiwiayIsIlBJWEkuRWFzaW5nLmluUXVhZCIsIlBJWEkuRWFzaW5nLm91dFF1YWQiLCJQSVhJLkVhc2luZy5pbk91dFF1YWQiLCJQSVhJLkVhc2luZy5pbkN1YmljIiwiUElYSS5FYXNpbmcub3V0Q3ViaWMiLCJQSVhJLkVhc2luZy5pbk91dEN1YmljIiwiUElYSS5FYXNpbmcuaW5RdWFydCIsIlBJWEkuRWFzaW5nLm91dFF1YXJ0IiwiUElYSS5FYXNpbmcuaW5PdXRRdWFydCIsIlBJWEkuRWFzaW5nLmluUXVpbnQiLCJQSVhJLkVhc2luZy5vdXRRdWludCIsIlBJWEkuRWFzaW5nLmluT3V0UXVpbnQiLCJQSVhJLkVhc2luZy5pblNpbmUiLCJNYXRoIiwiY29zIiwiUEkiLCJQSVhJLkVhc2luZy5vdXRTaW5lIiwic2luIiwiUElYSS5FYXNpbmcuaW5PdXRTaW5lIiwiUElYSS5FYXNpbmcuaW5FeHBvIiwicG93IiwiUElYSS5FYXNpbmcub3V0RXhwbyIsIlBJWEkuRWFzaW5nLmluT3V0RXhwbyIsIlBJWEkuRWFzaW5nLmluQ2lyYyIsInNxcnQiLCJQSVhJLkVhc2luZy5vdXRDaXJjIiwiUElYSS5FYXNpbmcuaW5PdXRDaXJjIiwiUElYSS5FYXNpbmcuaW5FbGFzdGljIiwicyIsImEiLCJhc2luIiwiUElYSS5FYXNpbmcub3V0RWxhc3RpYyIsIlBJWEkuRWFzaW5nLmluT3V0RWxhc3RpYyIsIlBJWEkuRWFzaW5nLmluQmFjayIsInYiLCJQSVhJLkVhc2luZy5vdXRCYWNrIiwiUElYSS5FYXNpbmcuaW5PdXRCYWNrIiwiUElYSS5FYXNpbmcuaW5Cb3VuY2UiLCJFYXNpbmciLCJvdXRCb3VuY2UiLCJQSVhJLkVhc2luZy5vdXRCb3VuY2UiLCJQSVhJLkVhc2luZy5pbk91dEJvdW5jZSIsImluQm91bmNlIiwiUElYSS5Ud2VlbiIsIlBJWEkuVHdlZW4uY29uc3RydWN0b3IiLCJQSVhJLlR3ZWVuLmFkZFRvIiwiUElYSS5Ud2Vlbi5jaGFpbiIsIlBJWEkuVHdlZW4uc3RhcnQiLCJQSVhJLlR3ZWVuLnN0b3AiLCJQSVhJLlR3ZWVuLnRvIiwiUElYSS5Ud2Vlbi5mcm9tIiwiUElYSS5Ud2Vlbi5yZW1vdmUiLCJQSVhJLlR3ZWVuLnJlc2V0IiwiUElYSS5Ud2Vlbi5vblN0YXJ0IiwiUElYSS5Ud2Vlbi5vbkVuZCIsIlBJWEkuVHdlZW4ub25TdG9wIiwiUElYSS5Ud2Vlbi5vblVwZGF0ZSIsIlBJWEkuVHdlZW4ub25SZXBlYXQiLCJQSVhJLlR3ZWVuLm9uUGluZ1BvbmciLCJQSVhJLlR3ZWVuLnVwZGF0ZSIsIlBJWEkuVHdlZW4uX3BhcnNlRGF0YSIsIlBJWEkuVHdlZW4uX2FwcGx5IiwiUElYSS5Ud2Vlbi5fY2FuVXBkYXRlIiwiUElYSS5fZmluZE1hbmFnZXIiLCJQSVhJLl9wYXJzZVJlY3Vyc2l2ZURhdGEiLCJQSVhJLmlzT2JqZWN0IiwiUElYSS5fcmVjdXJzaXZlQXBwbHkiLCJQSVhJLlR3ZWVuTWFuYWdlciIsIlBJWEkuVHdlZW5NYW5hZ2VyLmNvbnN0cnVjdG9yIiwiUElYSS5Ud2Vlbk1hbmFnZXIudXBkYXRlIiwiUElYSS5Ud2Vlbk1hbmFnZXIuZ2V0VHdlZW5zRm9yVGFyZ2VyIiwiUElYSS5Ud2Vlbk1hbmFnZXIuY3JlYXRlVHdlZW4iLCJQSVhJLlR3ZWVuTWFuYWdlci5hZGRUd2VlbiIsIlBJWEkuVHdlZW5NYW5hZ2VyLnJlbW92ZVR3ZWVuIiwiUElYSS5Ud2Vlbk1hbmFnZXIuX3JlbW92ZSIsIlBJWEkuU2NlbmUiLCJQSVhJLlNjZW5lLmNvbnN0cnVjdG9yIiwiUElYSS5TY2VuZS51cGRhdGUiLCJQSVhJLlNjZW5lLmFkZFRvIiwiUElYSS5JbnB1dE1hbmFnZXIiLCJQSVhJLklucHV0TWFuYWdlci5jb25zdHJ1Y3RvciIsIlBJWEkuYml0bWFwRm9udFBhcnNlclRYVCIsInJlc291cmNlIiwiZGF0YSIsInhoclR5cGUiLCJuZXh0IiwidGV4dCIsInhociIsInJlc3BvbnNlVGV4dCIsImluZGV4T2YiLCJ1cmwiLCJkaXJuYW1lIiwiYmFzZVVybCIsImNoYXJBdCIsImxlbmd0aCIsInJlcGxhY2UiLCJ0ZXh0dXJlVXJsIiwiZ2V0VGV4dHVyZVVybCIsInV0aWxzIiwiVGV4dHVyZUNhY2hlIiwicGFyc2UiLCJsb2FkT3B0aW9ucyIsImNyb3NzT3JpZ2luIiwibG9hZFR5cGUiLCJsb2FkZXJzIiwiUmVzb3VyY2UiLCJMT0FEX1RZUEUiLCJJTUFHRSIsImFkZCIsIm5hbWUiLCJyZXMiLCJ0ZXh0dXJlIiwiUElYSS5wYXJzZSIsIlBJWEkuZGlybmFtZSIsIlBJWEkuZ2V0VGV4dHVyZVVybCIsIlBJWEkuZ2V0QXR0ciIsIlBJWEkuYXVkaW9QYXJzZXIiLCJEZXZpY2UiLCJpc0F1ZGlvU3VwcG9ydGVkIiwiZXh0IiwiX2dldEV4dCIsIl9hbGxvd2VkRXh0IiwiX2NhblBsYXkiLCJfYXVkaW9UeXBlU2VsZWN0ZWQiLCJBVURJT19UWVBFIiwiV0VCQVVESU8iLCJnbG9iYWxXZWJBdWRpb0NvbnRleHQiLCJkZWNvZGVBdWRpb0RhdGEiLCJfYWRkVG9DYWNoZSIsImJpbmQiLCJQSVhJLmF1ZGlvUGFyc2VyVXJsIiwiUElYSS5fYWRkVG9DYWNoZSIsIlBJWEkuX2dldEV4dCIsIlBJWEkuX2NhblBsYXkiLCJQSVhJLnV0aWxzIiwiUElYSS5sb2FkZXJzIiwiUElYSS5sb2FkZXJzLlR1cmJvTG9hZGVyIiwiUElYSS5sb2FkZXJzLlR1cmJvTG9hZGVyLmNvbnN0cnVjdG9yIiwiUElYSS5sb2FkZXJzLlR1cmJvTG9hZGVyLmFkZCIsIlBJWEkubG9hZGVycy5fY2hlY2tBdWRpb1R5cGUiLCJQSVhJLmxvYWRlcnMuX3NldEF1ZGlvRXh0IiwiUElYSS5EYXRhTWFuYWdlciIsIlBJWEkuRGF0YU1hbmFnZXIuY29uc3RydWN0b3IiLCJQSVhJLkRhdGFNYW5hZ2VyLmxvYWQiLCJQSVhJLkRhdGFNYW5hZ2VyLnNhdmUiLCJQSVhJLkRhdGFNYW5hZ2VyLnJlc2V0IiwiUElYSS5EYXRhTWFuYWdlci5zZXQiLCJQSVhJLkRhdGFNYW5hZ2VyLmdldCIsIlBJWEkuRGF0YU1hbmFnZXIuZGVsIiwiUElYSS5HYW1lIiwiUElYSS5HYW1lLmNvbnN0cnVjdG9yIiwiUElYSS5HYW1lLl9hbmltYXRlIiwiUElYSS5HYW1lLnVwZGF0ZSIsIlBJWEkuR2FtZS5zdGFydCIsIlBJWEkuR2FtZS5zdG9wIiwiUElYSS5HYW1lLmVuYWJsZVN0b3BBdExvc3RGb2N1cyIsIlBJWEkuR2FtZS5kaXNhYmxlU3RvcEF0TG9zdEZvY3VzIiwiUElYSS5HYW1lLl9vblZpc2liaWxpdHlDaGFuZ2UiLCJQSVhJLkdhbWUub25Mb3N0Rm9jdXMiLCJQSVhJLkdhbWUuc2V0U2NlbmUiLCJQSVhJLkdhbWUuZ2V0U2NlbmUiLCJQSVhJLkdhbWUuY3JlYXRlU2NlbmUiLCJQSVhJLkdhbWUucmVtb3ZlU2NlbmUiLCJQSVhJLkdhbWUuYWRkU2NlbmUiLCJQSVhJLkdhbWUucmVtb3ZlQWxsU2NlbmVzIiwiUElYSS5HYW1lLnJlc2l6ZSIsIlBJWEkuR2FtZS5hdXRvUmVzaXplIiwiUElYSS5HYW1lLl9yZXNpemVNb2RlQXNwZWN0Rml0IiwiUElYSS5HYW1lLl9yZXNpemVNb2RlQXNwZWN0RmlsbCIsIlBJWEkuR2FtZS5fcmVzaXplTW9kZUZpbGwiLCJQSVhJLkdhbWUud2lkdGgiLCJQSVhJLkdhbWUuaGVpZ2h0IiwiUElYSS5BdWRpb01hbmFnZXIiLCJQSVhJLkF1ZGlvTWFuYWdlci5jb25zdHJ1Y3RvciIsIlBJWEkuQXVkaW9NYW5hZ2VyLmdldEF1ZGlvIiwiUElYSS5BdWRpb01hbmFnZXIucGF1c2VBbGxMaW5lcyIsIlBJWEkuQXVkaW9NYW5hZ2VyLnJlc3VtZUFsbExpbmVzIiwiUElYSS5BdWRpb01hbmFnZXIucGxheSIsIlBJWEkuQXVkaW9NYW5hZ2VyLnBsYXlNdXNpYyIsIlBJWEkuQXVkaW9NYW5hZ2VyLnBsYXlTb3VuZCIsIlBJWEkuQXVkaW9NYW5hZ2VyLnN0b3AiLCJQSVhJLkF1ZGlvTWFuYWdlci5zdG9wTXVzaWMiLCJQSVhJLkF1ZGlvTWFuYWdlci5zdG9wU291bmQiLCJQSVhJLkF1ZGlvTWFuYWdlci5wYXVzZSIsIlBJWEkuQXVkaW9NYW5hZ2VyLnBhdXNlTXVzaWMiLCJQSVhJLkF1ZGlvTWFuYWdlci5wYXVzZVNvdW5kIiwiUElYSS5BdWRpb01hbmFnZXIucmVzdW1lIiwiUElYSS5BdWRpb01hbmFnZXIucmVzdW1lTXVzaWMiLCJQSVhJLkF1ZGlvTWFuYWdlci5yZXN1bWVTb3VuZCIsIlBJWEkuQXVkaW9NYW5hZ2VyLm11dGUiLCJQSVhJLkF1ZGlvTWFuYWdlci5tdXRlTXVzaWMiLCJQSVhJLkF1ZGlvTWFuYWdlci5tdXRlU291bmQiLCJQSVhJLkF1ZGlvTWFuYWdlci51bm11dGUiLCJQSVhJLkF1ZGlvTWFuYWdlci51bm11dGVNdXNpYyIsIlBJWEkuQXVkaW9NYW5hZ2VyLnVubXV0ZVNvdW5kIiwiUElYSS5BdWRpb01hbmFnZXIuX3BhdXNlIiwiUElYSS5BdWRpb01hbmFnZXIuX3Jlc3VtZSIsIlBJWEkuQXVkaW9NYW5hZ2VyLl9wbGF5IiwiUElYSS5BdWRpb01hbmFnZXIuX3N0b3AiLCJQSVhJLkF1ZGlvTWFuYWdlci5fbXV0ZSIsIlBJWEkuQXVkaW9NYW5hZ2VyLl91bm11dGUiLCJQSVhJLkF1ZGlvTWFuYWdlci5fZ2V0TGluZXNCeUlkIiwiUElYSS5BdWRpb01hbmFnZXIuX2dldEF2YWlsYWJsZUxpbmVGcm9tIiwiUElYSS5BdWRpb01hbmFnZXIuY3JlYXRlR2Fpbk5vZGUiLCJQSVhJLkF1ZGlvIiwiUElYSS5BdWRpby5jb25zdHJ1Y3RvciIsIlBJWEkuQXVkaW8ucGxheSIsIlBJWEkuQXVkaW8uc3RvcCIsIlBJWEkuQXVkaW8ubXV0ZSIsIlBJWEkuQXVkaW8udW5tdXRlIiwiUElYSS5BdWRpby5wYXVzZSIsIlBJWEkuQXVkaW8ucmVzdW1lIiwiUElYSS5BdWRpby52b2x1bWUiLCJwb3NpdGlvbiIsIngiLCJ2ZWxvY2l0eSIsImRlbHRhVGltZSIsInkiLCJyb3RhdGlvbiIsInJvdGF0aW9uU3BlZWQiLCJpIiwiY2hpbGRyZW4iLCJ1cGRhdGUiLCJfYWRkQ2hpbGQiLCJjYWxsIiwiY2hpbGQiLCJ6SW5kZXhFbmFibGVkIiwic29ydENoaWxkcmVuQnlaSW5kZXgiLCJwYXJlbnQiLCJhZGRDaGlsZCIsIkNvbnRhaW5lciIsIl9raWxsZWRPYmplY3RzIiwicHVzaCIsInJlbW92ZUNoaWxkIiwic29ydCIsImFaIiwiekluZGV4IiwiYloiLCJUd2VlbiIsIlBJWEkuUG9vbCIsIlBJWEkuUG9vbC5jb25zdHJ1Y3RvciIsIlBJWEkuUG9vbC5fbmV3T2JqZWN0IiwiUElYSS5Qb29sLl9uZXdPYmplY3QucmV0dXJuVG9Qb29sIiwiUElYSS5Qb29sLnB1dCIsIlBJWEkuUG9vbC5nZXQiLCJQSVhJLlBvb2wubGVuZ3RoIiwiX25ld09iaiIsIlBJWEkuX25ld09iaiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7SUNMQSxJQUFHLENBQUNBLElBQUosRUFBUztBQUFBLFFBQ0wsTUFBTSxJQUFJQyxLQUFKLENBQVUsd0JBQVYsQ0FBTixDQURLO0FBQUE7SUFJVCxJQUFNQyxxQkFBQSxHQUF3QixPQUE5QjtJQUNBLElBQU1DLFlBQUEsR0FBZUgsSUFBQSxDQUFLSSxPQUFMLENBQWFDLEtBQWIsQ0FBbUIsVUFBbkIsRUFBK0IsQ0FBL0IsQ0FBckI7SUFFQSxJQUFHRixZQUFBLEdBQWVELHFCQUFsQixFQUF3QztBQUFBLFFBQ3BDLE1BQU0sSUFBSUQsS0FBSixDQUFVLGNBQWNELElBQUEsQ0FBS0ksT0FBbkIsR0FBNkIsb0NBQTdCLEdBQW1FRixxQkFBN0UsQ0FBTixDQURvQztBQUFBO0lER3hDO0FBQUEsUUVWSUksU0FBQSxHQUFZQyxLRlVoQjtJRVRBLElBQU9QLElBQVA7SUFBQSxDQUFBLFVBQU9BLElBQVAsRUFBWTtBQUFBLFFBQ1JBLElBQUFBLFNBQUFBLEdBQUFBLFlBQUFBO0FBQUFBLFlBZUlRLFNBQUFBLFNBQUFBLENBQW1CQSxPQUFuQkEsRUFBdUNBO0FBQUFBLGdCQUFwQkMsS0FBQUEsT0FBQUEsR0FBQUEsT0FBQUEsQ0FBb0JEO0FBQUFBLGdCQWR2Q0MsS0FBQUEsU0FBQUEsR0FBb0JBLElBQXBCQSxDQWN1Q0Q7QUFBQUEsZ0JBWnZDQyxLQUFBQSxJQUFBQSxHQUFlQSxLQUFmQSxDQVl1Q0Q7QUFBQUEsZ0JBWHZDQyxLQUFBQSxNQUFB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QUFLQSxNQUFMQSxHQUFZQSxDQUFyQkEsRUFBdUJBO0FBQUFBLG9CQUNuQkEsRUFBQUEsSUFBTUEsR0FBTkEsQ0FEbUJBO0FBQUFBLGlCQUhnQkE7QUFBQUEsYUFKWHpUO0FBQUFBLFlBWWhDeVQsRUFBQUEsSUFBTUEsSUFBTkEsQ0FaZ0N6VDtBQUFBQSxZQWFoQ3lULEVBQUFBLElBQU1BLEVBQUFBLEdBQUtBLEdBQVhBLENBYmdDelQ7QUFBQUEsWUFlaEN5VCxPQUFRQSxJQUFBQSxDQUFLQSxFQUFMQSxDQUFEQSxDQUFXQSxLQUFYQSxDQUFpQkEsSUFBakJBLEVBQXdCQSxDQUFDQSxHQUFEQSxDQUFEQSxDQUFRQSxNQUFSQSxDQUFlQSxJQUFmQSxDQUF2QkEsQ0FBUEEsQ0FmZ0N6VDtBQUFBQSxTQTNDNUI7QUFBQSxLQUFaLENBQU9BLElBQUEsSUFBQSxDQUFBQSxJQUFBLEdBQUksRUFBSixDQUFQIiwiZmlsZSI6InR1cmJvcGl4aS5qcyIsInNvdXJjZXNDb250ZW50IjpbbnVsbCwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vZGVmcy9waXhpLmpzLmQudHNcIiAvPlxuaWYoIVBJWEkpe1xuICAgIHRocm93IG5ldyBFcnJvcignRXkhIFdoZXJlIGlzIHBpeGkuanM/PycpO1xufVxuXG5jb25zdCBQSVhJX1ZFUlNJT05fUkVRVUlSRUQgPSBcIjMuMC43XCI7XG5jb25zdCBQSVhJX1ZFUlNJT04gPSBQSVhJLlZFUlNJT04ubWF0Y2goL1xcZC5cXGQuXFxkLylbMF07XG5cbmlmKFBJWElfVkVSU0lPTiA8IFBJWElfVkVSU0lPTl9SRVFVSVJFRCl7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiUGl4aS5qcyB2XCIgKyBQSVhJLlZFUlNJT04gKyBcIiBpdCdzIG5vdCBzdXBwb3J0ZWQsIHBsZWFzZSB1c2UgXlwiICsgUElYSV9WRVJTSU9OX1JFUVVJUkVEKTtcbn1cbiIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4vQXVkaW9NYW5hZ2VyLnRzXCIgLz5cbnZhciBIVE1MQXVkaW8gPSBBdWRpbztcbm1vZHVsZSBQSVhJIHtcbiAgICBleHBvcnQgY2xhc3MgQXVkaW9MaW5lIHtcbiAgICAgICAgYXZhaWxhYmxlOmJvb2xlYW4gPSB0cnVlO1xuICAgICAgICBhdWRpbzpBdWRpbztcbiAgICAgICAgbG9vcDpib29sZWFuID0gZmFsc2U7XG4gICAgICAgIHBhdXNlZDpib29sZWFuID0gZmFsc2U7XG4gICAgICAgIGNhbGxiYWNrOkZ1bmN0aW9uO1xuICAgICAgICBtdXRlZDpib29sZWFuID0gZmFsc2U7XG5cbiAgICAgICAgc3RhcnRUaW1lOm51bWJlciA9IDA7XG4gICAgICAgIGxhc3RQYXVzZVRpbWU6bnVtYmVyID0gMDtcbiAgICAgICAgb2Zmc2V0VGltZTpudW1iZXIgPSAwO1xuXG4gICAgICAgIHByaXZhdGUgX2h0bWxBdWRpbzpIVE1MQXVkaW9FbGVtZW50O1xuICAgICAgICBwcml2YXRlIF93ZWJBdWRpbzpBdWRpb0J1ZmZlclNvdXJjZU5vZGU7XG5cbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG1hbmFnZXI6QXVkaW9NYW5hZ2VyKXtcbiAgICAgICAgICAgIGlmKCF0aGlzLm1hbmFnZXIuY29udGV4dCl7XG4gICAgICAgICAgICAgICAgdGhpcy5faHRtbEF1ZGlvID0gbmV3IEhUTUxBdWRpbygpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2h0bWxBdWRpby5hZGRFdmVudExpc3RlbmVyKCdlbmRlZCcsIHRoaXMuX29uRW5kLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc2V0QXVkaW8oYXVkaW86QXVkaW8sIGxvb3A6Ym9vbGVhbnxGdW5jdGlvbiwgY2FsbGJhY2s/OkZ1bmN0aW9uKTpBdWRpb0xpbmV7XG4gICAgICAgICAgICBpZih0eXBlb2YgbG9vcCA9PT0gXCJmdW5jdGlvblwiKXtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayA9IDxGdW5jdGlvbj5sb29wO1xuICAgICAgICAgICAgICAgIGxvb3AgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5hdWRpbyA9IGF1ZGlvO1xuICAgICAgICAgICAgdGhpcy5hdmFpbGFibGUgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMubG9vcCA9IDxib29sZWFuPmxvb3A7XG4gICAgICAgICAgICB0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHBsYXkocGF1c2U/OmJvb2xlYW4pOkF1ZGlvTGluZSB7XG4gICAgICAgICAgICBpZighcGF1c2UgJiYgdGhpcy5wYXVzZWQpcmV0dXJuIHRoaXM7XG5cbiAgICAgICAgICAgIGlmKHRoaXMubWFuYWdlci5jb250ZXh0KXtcbiAgICAgICAgICAgICAgICB0aGlzLl93ZWJBdWRpbyA9IHRoaXMubWFuYWdlci5jb250ZXh0LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3dlYkF1ZGlvLnN0YXJ0ID0gdGhpcy5fd2ViQXVkaW8uc3RhcnQgfHwgdGhpcy5fd2ViQXVkaW8ubm90ZU9uO1xuICAgICAgICAgICAgICAgIHRoaXMuX3dlYkF1ZGlvLnN0b3AgPSB0aGlzLl93ZWJBdWRpby5zdG9wIHx8IHRoaXMuX3dlYkF1ZGlvLm5vdGVPZmY7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl93ZWJBdWRpby5idWZmZXIgPSB0aGlzLmF1ZGlvLnNvdXJjZTtcbiAgICAgICAgICAgICAgICB0aGlzLl93ZWJBdWRpby5sb29wID0gdGhpcy5sb29wIHx8IHRoaXMuYXVkaW8ubG9vcDtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0VGltZSA9IHRoaXMubWFuYWdlci5jb250ZXh0LmN1cnJlbnRUaW1lO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fd2ViQXVkaW8ub25lbmRlZCA9IHRoaXMuX29uRW5kLmJpbmQodGhpcyk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl93ZWJBdWRpby5nYWluTm9kZSA9IHRoaXMubWFuYWdlci5jcmVhdGVHYWluTm9kZSh0aGlzLm1hbmFnZXIuY29udGV4dCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fd2ViQXVkaW8uZ2Fpbk5vZGUuZ2Fpbi52YWx1ZSA9ICh0aGlzLmF1ZGlvLm11dGVkIHx8IHRoaXMubXV0ZWQpID8gMCA6IHRoaXMuYXVkaW8udm9sdW1lO1xuICAgICAgICAgICAgICAgIHRoaXMuX3dlYkF1ZGlvLmdhaW5Ob2RlLmNvbm5lY3QodGhpcy5tYW5hZ2VyLmdhaW5Ob2RlKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuX3dlYkF1ZGlvLmNvbm5lY3QodGhpcy5fd2ViQXVkaW8uZ2Fpbk5vZGUpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3dlYkF1ZGlvLnN0YXJ0KDAsIChwYXVzZSkgPyB0aGlzLmxhc3RQYXVzZVRpbWUgOiBudWxsKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHRoaXMuX2h0bWxBdWRpby5zcmMgPSAodGhpcy5hdWRpby5zb3VyY2Uuc3JjICE9PSBcIlwiKSA/IHRoaXMuYXVkaW8uc291cmNlLnNyYyA6IHRoaXMuYXVkaW8uc291cmNlLmNoaWxkcmVuWzBdLnNyYztcbiAgICAgICAgICAgICAgICB0aGlzLl9odG1sQXVkaW8ucHJlbG9hZCA9IFwiYXV0b1wiO1xuICAgICAgICAgICAgICAgIHRoaXMuX2h0bWxBdWRpby52b2x1bWUgPSAodGhpcy5hdWRpby5tdXRlZCB8fCB0aGlzLm11dGVkKSA/IDAgOiB0aGlzLmF1ZGlvLnZvbHVtZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9odG1sQXVkaW8ubG9hZCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2h0bWxBdWRpby5wbGF5KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RvcCgpOkF1ZGlvTGluZSB7XG4gICAgICAgICAgICBpZih0aGlzLm1hbmFnZXIuY29udGV4dCl7XG4gICAgICAgICAgICAgICAgdGhpcy5fd2ViQXVkaW8uc3RvcCgwKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHRoaXMuX2h0bWxBdWRpby5wYXVzZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2h0bWxBdWRpby5jdXJyZW50VGltZSA9IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcGF1c2UoKTpBdWRpb0xpbmV7XG4gICAgICAgICAgICBpZih0aGlzLm1hbmFnZXIuY29udGV4dCl7XG4gICAgICAgICAgICAgICAgdGhpcy5vZmZzZXRUaW1lICs9IHRoaXMubWFuYWdlci5jb250ZXh0LmN1cnJlbnRUaW1lIC0gdGhpcy5zdGFydFRpbWU7XG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0UGF1c2VUaW1lID0gdGhpcy5vZmZzZXRUaW1lJXRoaXMuX3dlYkF1ZGlvLmJ1ZmZlci5kdXJhdGlvbjtcbiAgICAgICAgICAgICAgICB0aGlzLl93ZWJBdWRpby5zdG9wKDApO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgdGhpcy5faHRtbEF1ZGlvLnBhdXNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnBhdXNlZCA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc3VtZSgpOkF1ZGlvTGluZXtcbiAgICAgICAgICAgIGlmKHRoaXMucGF1c2VkKXtcbiAgICAgICAgICAgICAgICBpZih0aGlzLm1hbmFnZXIuY29udGV4dCl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGxheSh0cnVlKTtcbiAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faHRtbEF1ZGlvLnBsYXkoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLnBhdXNlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBtdXRlKCk6QXVkaW9MaW5le1xuICAgICAgICAgICAgdGhpcy5tdXRlZCA9IHRydWU7XG4gICAgICAgICAgICBpZih0aGlzLm1hbmFnZXIuY29udGV4dCl7XG4gICAgICAgICAgICAgICAgdGhpcy5fd2ViQXVkaW8uZ2Fpbk5vZGUuZ2Fpbi52YWx1ZSA9IDA7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICB0aGlzLl9odG1sQXVkaW8udm9sdW1lID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgdW5tdXRlKCk6QXVkaW9MaW5le1xuICAgICAgICAgICAgdGhpcy5tdXRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgaWYodGhpcy5tYW5hZ2VyLmNvbnRleHQpe1xuICAgICAgICAgICAgICAgIHRoaXMuX3dlYkF1ZGlvLmdhaW5Ob2RlLmdhaW4udmFsdWUgPSB0aGlzLmF1ZGlvLnZvbHVtZTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHRoaXMuX2h0bWxBdWRpby52b2x1bWUgPSB0aGlzLmF1ZGlvLnZvbHVtZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgdm9sdW1lKHZhbHVlOm51bWJlcik6QXVkaW9MaW5le1xuICAgICAgICAgICAgaWYodGhpcy5tYW5hZ2VyLmNvbnRleHQpe1xuICAgICAgICAgICAgICAgIHRoaXMuX3dlYkF1ZGlvLmdhaW5Ob2RlLmdhaW4udmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHRoaXMuX2h0bWxBdWRpby52b2x1bWUgPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzZXQoKTpBdWRpb0xpbmV7XG4gICAgICAgICAgICB0aGlzLmF2YWlsYWJsZSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmF1ZGlvID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMubG9vcCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5jYWxsYmFjayA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLnBhdXNlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5tdXRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5fd2ViQXVkaW8gPSBudWxsO1xuXG4gICAgICAgICAgICB0aGlzLnN0YXJ0VGltZSA9IDA7XG4gICAgICAgICAgICB0aGlzLmxhc3RQYXVzZVRpbWUgPSAwO1xuICAgICAgICAgICAgdGhpcy5vZmZzZXRUaW1lID0gMDtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfb25FbmQoKTp2b2lke1xuICAgICAgICAgICAgaWYodGhpcy5jYWxsYmFjayl0aGlzLmNhbGxiYWNrKHRoaXMubWFuYWdlciwgdGhpcy5hdWRpbyk7XG4gICAgICAgICAgICBpZighdGhpcy5tYW5hZ2VyLmNvbnRleHQpe1xuICAgICAgICAgICAgICAgIGlmKHRoaXMubG9vcCB8fCB0aGlzLmF1ZGlvLmxvb3Ape1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9odG1sQXVkaW8uY3VycmVudFRpbWUgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9odG1sQXVkaW8ucGxheSgpO1xuICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfWVsc2UgaWYodGhpcy5tYW5hZ2VyLmNvbnRleHQgJiYgIXRoaXMucGF1c2VkKXtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbn1cblxuaW50ZXJmYWNlIEF1ZGlvQnVmZmVyU291cmNlTm9kZSB7XG4gICAgbm90ZU9uKCk6QXVkaW9CdWZmZXJTb3VyY2VOb2RlO1xuICAgIG5vdGVPZmYoKTpBdWRpb0J1ZmZlclNvdXJjZU5vZGU7XG4gICAgc291cmNlOkF1ZGlvQnVmZmVyO1xuICAgIGdhaW5Ob2RlOkdhaW5Ob2RlO1xufSIsIm1vZHVsZSBQSVhJIHtcbiAgICBleHBvcnQgZW51bSBHQU1FX1NDQUxFX1RZUEUge1xuICAgICAgICBOT05FLFxuICAgICAgICBGSUxMLFxuICAgICAgICBBU1BFQ1RfRklULFxuICAgICAgICBBU1BFQ1RfRklMTFxuICAgIH1cblxuICAgIGV4cG9ydCBlbnVtIEFVRElPX1RZUEUge1xuICAgICAgICBVTktOT1dOLFxuICAgICAgICBXRUJBVURJTyxcbiAgICAgICAgSFRNTEFVRElPXG4gICAgfVxuXG4gICAgZXhwb3J0IHZhciB6SW5kZXhFbmFibGVkOmJvb2xlYW4gPSB0cnVlO1xufSIsIi8vTWFueSBjaGVja3MgYXJlIGJhc2VkIG9uIGh0dHBzOi8vZ2l0aHViLmNvbS9hcmFzYXRhc2F5Z2luL2lzLmpzL2Jsb2IvbWFzdGVyL2lzLmpzXG5cbm1vZHVsZSBQSVhJIHtcbiAgICBleHBvcnQgbW9kdWxlIERldmljZSB7XG4gICAgICAgIHZhciBuYXZpZ2F0b3I6TmF2aWdhdG9yID0gd2luZG93Lm5hdmlnYXRvcjtcbiAgICAgICAgdmFyIGRvY3VtZW50OkRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xuXG4gICAgICAgIHZhciB1c2VyQWdlbnQ6c3RyaW5nID0gJ25hdmlnYXRvcicgaW4gd2luZG93ICYmICd1c2VyQWdlbnQnIGluIG5hdmlnYXRvciAmJiBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkgfHwgJycsXG4gICAgICAgICAgICB2ZW5kb3I6c3RyaW5nID0gJ25hdmlnYXRvcicgaW4gd2luZG93ICYmICd2ZW5kb3InIGluIG5hdmlnYXRvciAmJiBuYXZpZ2F0b3IudmVuZG9yLnRvTG93ZXJDYXNlKCkgfHwgJycsXG4gICAgICAgICAgICBhcHBWZXJzaW9uOnN0cmluZyA9ICduYXZpZ2F0b3InIGluIHdpbmRvdyAmJiAnYXBwVmVyc2lvbicgaW4gbmF2aWdhdG9yICYmIG5hdmlnYXRvci5hcHBWZXJzaW9uLnRvTG93ZXJDYXNlKCkgfHwgJyc7XG5cbiAgICAgICAgLy9Ccm93c2Vyc1xuICAgICAgICBleHBvcnQgdmFyIGlzQ2hyb21lOmJvb2xlYW4gPSAvY2hyb21lfGNocm9taXVtL2kudGVzdCh1c2VyQWdlbnQpICYmIC9nb29nbGUgaW5jLy50ZXN0KHZlbmRvciksXG4gICAgICAgICAgICBpc0ZpcmVmb3g6Ym9vbGVhbiA9IC9maXJlZm94L2kudGVzdCh1c2VyQWdlbnQpLFxuICAgICAgICAgICAgaXNJRTpib29sZWFuID0gL21zaWUvaS50ZXN0KHVzZXJBZ2VudCkgfHwgXCJBY3RpdmVYT2JqZWN0XCIgaW4gd2luZG93LFxuICAgICAgICAgICAgaXNPcGVyYTpib29sZWFuID0gL15PcGVyYVxcLy8udGVzdCh1c2VyQWdlbnQpIHx8IC9cXHgyME9QUlxcLy8udGVzdCh1c2VyQWdlbnQpLFxuICAgICAgICAgICAgaXNTYWZhcmk6Ym9vbGVhbiA9IC9zYWZhcmkvaS50ZXN0KHVzZXJBZ2VudCkgJiYgL2FwcGxlIGNvbXB1dGVyL2kudGVzdCh2ZW5kb3IpO1xuXG4gICAgICAgIC8vRGV2aWNlcyAmJiBPU1xuICAgICAgICBleHBvcnQgdmFyIGlzSXBob25lOmJvb2xlYW4gPSAvaXBob25lL2kudGVzdCh1c2VyQWdlbnQpLFxuICAgICAgICAgICAgaXNJcGFkOmJvb2xlYW4gPSAvaXBhZC9pLnRlc3QodXNlckFnZW50KSxcbiAgICAgICAgICAgIGlzSXBvZDpib29sZWFuID0gL2lwb2QvaS50ZXN0KHVzZXJBZ2VudCksXG4gICAgICAgICAgICBpc0FuZHJvaWQ6Ym9vbGVhbiA9IC9hbmRyb2lkL2kudGVzdCh1c2VyQWdlbnQpLFxuICAgICAgICAgICAgaXNBbmRyb2lkUGhvbmU6Ym9vbGVhbiA9IC9hbmRyb2lkL2kudGVzdCh1c2VyQWdlbnQpICYmIC9tb2JpbGUvaS50ZXN0KHVzZXJBZ2VudCksXG4gICAgICAgICAgICBpc0FuZHJvaWRUYWJsZXQ6Ym9vbGVhbiA9IC9hbmRyb2lkL2kudGVzdCh1c2VyQWdlbnQpICYmICEvbW9iaWxlL2kudGVzdCh1c2VyQWdlbnQpLFxuICAgICAgICAgICAgaXNMaW51eDpib29sZWFuID0gL2xpbnV4L2kudGVzdChhcHBWZXJzaW9uKSxcbiAgICAgICAgICAgIGlzTWFjOmJvb2xlYW4gPSAvbWFjL2kudGVzdChhcHBWZXJzaW9uKSxcbiAgICAgICAgICAgIGlzV2luZG93OmJvb2xlYW4gPSAvd2luL2kudGVzdChhcHBWZXJzaW9uKSxcbiAgICAgICAgICAgIGlzV2luZG93UGhvbmU6Ym9vbGVhbiA9IGlzV2luZG93ICYmIC9waG9uZS9pLnRlc3QodXNlckFnZW50KSxcbiAgICAgICAgICAgIGlzV2luZG93VGFibGV0OmJvb2xlYW4gPSBpc1dpbmRvdyAmJiAhaXNXaW5kb3dQaG9uZSAmJiAvdG91Y2gvaS50ZXN0KHVzZXJBZ2VudCksXG4gICAgICAgICAgICBpc01vYmlsZTpib29sZWFuID0gaXNJcGhvbmUgfHwgaXNJcG9kfHwgaXNBbmRyb2lkUGhvbmUgfHwgaXNXaW5kb3dQaG9uZSxcbiAgICAgICAgICAgIGlzVGFibGV0OmJvb2xlYW4gPSBpc0lwYWQgfHwgaXNBbmRyb2lkVGFibGV0IHx8IGlzV2luZG93VGFibGV0LFxuICAgICAgICAgICAgaXNEZXNrdG9wOmJvb2xlYW4gPSAhaXNNb2JpbGUgJiYgIWlzVGFibGV0LFxuICAgICAgICAgICAgaXNUb3VjaERldmljZTpib29sZWFuID0gJ29udG91Y2hzdGFydCcgaW4gd2luZG93IHx8J0RvY3VtZW50VG91Y2gnIGluIHdpbmRvdyAmJiBkb2N1bWVudCBpbnN0YW5jZW9mIERvY3VtZW50VG91Y2gsXG4gICAgICAgICAgICBpc0NvY29vbjpib29sZWFuID0gISFuYXZpZ2F0b3IuaXNDb2Nvb25KUyxcbiAgICAgICAgICAgIGlzTm9kZVdlYmtpdDpib29sZWFuID0gISEodHlwZW9mIHByb2Nlc3MgPT09IFwib2JqZWN0XCIgJiYgcHJvY2Vzcy50aXRsZSA9PT0gXCJub2RlXCIgJiYgdHlwZW9mIGdsb2JhbCA9PT0gXCJvYmplY3RcIiksXG4gICAgICAgICAgICBpc0VqZWN0YTpib29sZWFuID0gISF3aW5kb3cuZWplY3RhLFxuICAgICAgICAgICAgaXNDcm9zc3dhbGs6Ym9vbGVhbiA9IC9Dcm9zc3dhbGsvLnRlc3QodXNlckFnZW50KSxcbiAgICAgICAgICAgIGlzQ29yZG92YTpib29sZWFuID0gISF3aW5kb3cuY29yZG92YSxcbiAgICAgICAgICAgIGlzRWxlY3Ryb246Ym9vbGVhbiA9ICEhKHR5cGVvZiBwcm9jZXNzID09PSBcIm9iamVjdFwiICYmIHByb2Nlc3MudmVyc2lvbnMgJiYgKHByb2Nlc3MudmVyc2lvbnMuZWxlY3Ryb24gfHwgcHJvY2Vzcy52ZXJzaW9uc1snYXRvbS1zaGVsbCddKSk7XG5cbiAgICAgICAgbmF2aWdhdG9yLnZpYnJhdGUgPSBuYXZpZ2F0b3IudmlicmF0ZSB8fCBuYXZpZ2F0b3Iud2Via2l0VmlicmF0ZSB8fCBuYXZpZ2F0b3IubW96VmlicmF0ZSB8fCBuYXZpZ2F0b3IubXNWaWJyYXRlIHx8IG51bGw7XG4gICAgICAgIGV4cG9ydCB2YXIgaXNWaWJyYXRlU3VwcG9ydGVkOmJvb2xlYW4gPSAhIW5hdmlnYXRvci52aWJyYXRlICYmIChpc01vYmlsZSB8fCBpc1RhYmxldCksXG4gICAgICAgICAgICBpc01vdXNlV2hlZWxTdXBwb3J0ZWQ6Ym9vbGVhbiA9ICdvbndoZWVsJyBpbiB3aW5kb3cgfHwgJ29ubW91c2V3aGVlbCcgaW4gd2luZG93IHx8ICdNb3VzZVNjcm9sbEV2ZW50JyBpbiB3aW5kb3csXG4gICAgICAgICAgICBpc0FjY2VsZXJvbWV0ZXJTdXBwb3J0ZWQ6Ym9vbGVhbiA9ICdEZXZpY2VNb3Rpb25FdmVudCcgaW4gd2luZG93LFxuICAgICAgICAgICAgaXNHYW1lcGFkU3VwcG9ydGVkOmJvb2xlYW4gPSAhIW5hdmlnYXRvci5nZXRHYW1lcGFkcyB8fCAhIW5hdmlnYXRvci53ZWJraXRHZXRHYW1lcGFkcztcblxuICAgICAgICAvL0Z1bGxTY3JlZW5cbiAgICAgICAgdmFyIGRpdjpIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB2YXIgZnVsbFNjcmVlblJlcXVlc3RWZW5kb3I6YW55ID0gZGl2LnJlcXVlc3RGdWxsc2NyZWVuIHx8IGRpdi53ZWJraXRSZXF1ZXN0RnVsbFNjcmVlbiB8fCBkaXYubXNSZXF1ZXN0RnVsbFNjcmVlbiB8fCBkaXYubW96UmVxdWVzdEZ1bGxTY3JlZW4sXG4gICAgICAgICAgICBmdWxsU2NyZWVuQ2FuY2VsVmVuZG9yOmFueSA9IGRvY3VtZW50LmNhbmNlbEZ1bGxTY3JlZW4gfHwgZG9jdW1lbnQuZXhpdEZ1bGxTY3JlZW4gfHwgZG9jdW1lbnQud2Via2l0Q2FuY2VsRnVsbFNjcmVlbiB8fCBkb2N1bWVudC5tc0NhbmNlbEZ1bGxTY3JlZW4gfHwgZG9jdW1lbnQubW96Q2FuY2VsRnVsbFNjcmVlbjtcblxuICAgICAgICBleHBvcnQgdmFyIGlzRnVsbFNjcmVlblN1cHBvcnRlZDpib29sZWFuID0gISEoZnVsbFNjcmVlblJlcXVlc3QgJiYgZnVsbFNjcmVlbkNhbmNlbCksXG4gICAgICAgICAgICBmdWxsU2NyZWVuUmVxdWVzdDpzdHJpbmcgPSAoZnVsbFNjcmVlblJlcXVlc3RWZW5kb3IpID8gZnVsbFNjcmVlblJlcXVlc3RWZW5kb3IubmFtZSA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGZ1bGxTY3JlZW5DYW5jZWw6c3RyaW5nID0gKGZ1bGxTY3JlZW5DYW5jZWxWZW5kb3IpID8gZnVsbFNjcmVlbkNhbmNlbFZlbmRvci5uYW1lIDogdW5kZWZpbmVkO1xuXG4gICAgICAgIC8vQXVkaW9cbiAgICAgICAgZXhwb3J0IHZhciBpc0hUTUxBdWRpb1N1cHBvcnRlZDpib29sZWFuID0gISF3aW5kb3cuQXVkaW8sXG4gICAgICAgICAgICB3ZWJBdWRpb0NvbnRleHQ6YW55ID0gd2luZG93LkF1ZGlvQ29udGV4dCB8fCB3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0LFxuICAgICAgICAgICAgaXNXZWJBdWRpb1N1cHBvcnRlZDpib29sZWFuID0gISF3ZWJBdWRpb0NvbnRleHQsXG4gICAgICAgICAgICBpc0F1ZGlvU3VwcG9ydGVkOmJvb2xlYW4gPSBpc1dlYkF1ZGlvU3VwcG9ydGVkIHx8IGlzSFRNTEF1ZGlvU3VwcG9ydGVkLFxuICAgICAgICAgICAgaXNNcDNTdXBwb3J0ZWQ6Ym9vbGVhbiA9IGZhbHNlLFxuICAgICAgICAgICAgaXNPZ2dTdXBwb3J0ZWQ6Ym9vbGVhbiA9IGZhbHNlLFxuICAgICAgICAgICAgaXNXYXZTdXBwb3J0ZWQ6Ym9vbGVhbiA9IGZhbHNlLFxuICAgICAgICAgICAgaXNNNGFTdXBwb3J0ZWQ6Ym9vbGVhbiA9IGZhbHNlLFxuICAgICAgICAgICAgZ2xvYmFsV2ViQXVkaW9Db250ZXh0OkF1ZGlvQ29udGV4dCA9IChpc1dlYkF1ZGlvU3VwcG9ydGVkKSA/IG5ldyB3ZWJBdWRpb0NvbnRleHQoKSA6IHVuZGVmaW5lZDtcblxuICAgICAgICAvL0F1ZGlvIG1pbWVUeXBlc1xuICAgICAgICBpZihpc0F1ZGlvU3VwcG9ydGVkKXtcbiAgICAgICAgICAgIHZhciBhdWRpbzpIVE1MQXVkaW9FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYXVkaW8nKTtcbiAgICAgICAgICAgIGlzTXAzU3VwcG9ydGVkID0gYXVkaW8uY2FuUGxheVR5cGUoJ2F1ZGlvL21wZWc7JykgIT09IFwiXCI7XG4gICAgICAgICAgICBpc09nZ1N1cHBvcnRlZCA9IGF1ZGlvLmNhblBsYXlUeXBlKCdhdWRpby9vZ2c7IGNvZGVjcz1cInZvcmJpc1wiJykgIT09IFwiXCI7XG4gICAgICAgICAgICBpc1dhdlN1cHBvcnRlZCA9IGF1ZGlvLmNhblBsYXlUeXBlKCdhdWRpby93YXYnKSAhPT0gXCJcIjtcbiAgICAgICAgICAgIGlzTTRhU3VwcG9ydGVkID0gYXVkaW8uY2FuUGxheVR5cGUoJ2F1ZGlvL21wNDsgY29kZWNzPVwibXA0YS40MC41XCInKSAhPT0gXCJcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBnZXRNb3VzZVdoZWVsRXZlbnQoKTpzdHJpbmd7XG4gICAgICAgICAgICBpZighaXNNb3VzZVdoZWVsU3VwcG9ydGVkKXJldHVybjtcbiAgICAgICAgICAgIHZhciBldnQ6c3RyaW5nO1xuICAgICAgICAgICAgaWYoJ29ud2hlZWwnIGluIHdpbmRvdyl7XG4gICAgICAgICAgICAgICAgZXZ0ID0gJ3doZWVsJztcbiAgICAgICAgICAgIH1lbHNlIGlmKCdvbm1vdXNld2hlZWwnIGluIHdpbmRvdyl7XG4gICAgICAgICAgICAgICAgZXZ0ID0gJ21vdXNld2hlZWwnO1xuICAgICAgICAgICAgfWVsc2UgaWYoJ01vdXNlU2Nyb2xsRXZlbnQnIGluIHdpbmRvdyl7XG4gICAgICAgICAgICAgICAgZXZ0ID0gJ0RPTU1vdXNlU2Nyb2xsJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGV2dDtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiB2aWJyYXRlKHBhdHRlcm46IG51bWJlciB8IG51bWJlcltdKTp2b2lke1xuICAgICAgICAgICAgaWYoaXNWaWJyYXRlU3VwcG9ydGVkKXtcbiAgICAgICAgICAgICAgICBuYXZpZ2F0b3IudmlicmF0ZShwYXR0ZXJuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBnZXRWaXNpYmlsaXR5Q2hhbmdlRXZlbnQoKTpzdHJpbmd7XG4gICAgICAgICAgICBpZih0eXBlb2YgZG9jdW1lbnQuaGlkZGVuICE9PSAndW5kZWZpbmVkJyl7XG4gICAgICAgICAgICAgICAgcmV0dXJuICd2aXNpYmlsaXR5Y2hhbmdlJztcbiAgICAgICAgICAgIH1lbHNlIGlmKHR5cGVvZiBkb2N1bWVudC53ZWJraXRIaWRkZW4gIT09ICd1bmRlZmluZWQnKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ3dlYmtpdHZpc2liaWxpdHljaGFuZ2UnO1xuICAgICAgICAgICAgfWVsc2UgaWYodHlwZW9mIGRvY3VtZW50Lm1vekhpZGRlbiAhPT0gJ3VuZGVmaW5lZCcpe1xuICAgICAgICAgICAgICAgIHJldHVybiAnbW96dmlzaWJpbGl0eWNoYW5nZSc7XG4gICAgICAgICAgICB9ZWxzZSBpZih0eXBlb2YgZG9jdW1lbnQubXNIaWRkZW4gIT09ICd1bmRlZmluZWQnKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ21zdmlzaWJpbGl0eWNoYW5nZSc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gaXNPbmxpbmUoKTpib29sZWFue1xuICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5uYXZpZ2F0b3Iub25MaW5lO1xuICAgICAgICB9XG5cblxuICAgIH1cbn1cblxuZGVjbGFyZSB2YXIgcHJvY2VzczphbnksXG4gICAgRG9jdW1lbnRUb3VjaDphbnksXG4gICAgZ2xvYmFsOmFueTtcblxuaW50ZXJmYWNlIE5hdmlnYXRvciB7XG4gICAgaXNDb2Nvb25KUzphbnk7XG4gICAgdmlicmF0ZShwYXR0ZXJuOiBudW1iZXIgfCBudW1iZXJbXSk6Ym9vbGVhbjtcbiAgICBnZXRHYW1lcGFkcygpOmFueTtcbiAgICB3ZWJraXRHZXRHYW1lcGFkcygpOmFueTtcbiAgICB3ZWJraXRWaWJyYXRlKCk6YW55O1xuICAgIG1velZpYnJhdGUoKTphbnk7XG4gICAgbXNWaWJyYXRlKCk6YW55O1xufVxuXG5pbnRlcmZhY2UgV2luZG93IHtcbiAgICBlamVjdGE6YW55O1xuICAgIGNvcmRvdmE6YW55O1xuICAgIEF1ZGlvKCk6SFRNTEF1ZGlvRWxlbWVudDtcbiAgICBBdWRpb0NvbnRleHQoKTphbnk7XG4gICAgd2Via2l0QXVkaW9Db250ZXh0KCk6YW55O1xufVxuXG5pbnRlcmZhY2UgZnVsbFNjcmVlbkRhdGEge1xuICAgIG5hbWU6c3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgRG9jdW1lbnQge1xuICAgIGNhbmNlbEZ1bGxTY3JlZW4oKTpmdWxsU2NyZWVuRGF0YSA7XG4gICAgZXhpdEZ1bGxTY3JlZW4oKTpmdWxsU2NyZWVuRGF0YSA7XG4gICAgd2Via2l0Q2FuY2VsRnVsbFNjcmVlbigpOmZ1bGxTY3JlZW5EYXRhIDtcbiAgICBtc0NhbmNlbEZ1bGxTY3JlZW4oKTpmdWxsU2NyZWVuRGF0YSA7XG4gICAgbW96Q2FuY2VsRnVsbFNjcmVlbigpOmZ1bGxTY3JlZW5EYXRhIDtcbiAgICB3ZWJraXRIaWRkZW46YW55O1xuICAgIG1vekhpZGRlbjphbnk7XG59XG5cbmludGVyZmFjZSBIVE1MRGl2RWxlbWVudCB7XG4gICAgcmVxdWVzdEZ1bGxzY3JlZW4oKTpmdWxsU2NyZWVuRGF0YSA7XG4gICAgd2Via2l0UmVxdWVzdEZ1bGxTY3JlZW4oKTpmdWxsU2NyZWVuRGF0YSA7XG4gICAgbXNSZXF1ZXN0RnVsbFNjcmVlbigpOmZ1bGxTY3JlZW5EYXRhIDtcbiAgICBtb3pSZXF1ZXN0RnVsbFNjcmVlbigpOmZ1bGxTY3JlZW5EYXRhIDtcbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9kZWZzL3BpeGkuanMuZC50c1wiIC8+XG5tb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IGNsYXNzIENhbWVyYSBleHRlbmRzIENvbnRhaW5lciB7XG4gICAgICAgIHZpc2libGU6Ym9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBfZW5hYmxlZDpib29sZWFuID0gZmFsc2U7XG4gICAgICAgIHpJbmRleDpudW1iZXIgPSBJbmZpbml0eTtcbiAgICAgICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgICAgIHN1cGVyKCk7XG4gICAgICAgIH1cblxuICAgICAgICB1cGRhdGUoZGVsdGFUaW1lOm51bWJlcik6Q2FtZXJhe1xuICAgICAgICAgICAgaWYoIXRoaXMuZW5hYmxlZCl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHN1cGVyLnVwZGF0ZShkZWx0YVRpbWUpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgZW5hYmxlZCgpOmJvb2xlYW57XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZW5hYmxlZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldCBlbmFibGVkKHZhbHVlOmJvb2xlYW4pe1xuICAgICAgICAgICAgdGhpcy5fZW5hYmxlZCA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy52aXNpYmxlID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG59IiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vZGVmcy9waXhpLmpzLmQudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi9UaW1lck1hbmFnZXIudHNcIiAvPlxubW9kdWxlIFBJWEkge1xuICAgIGV4cG9ydCBjbGFzcyBUaW1lciB7XG4gICAgICAgIGFjdGl2ZTpib29sZWFuID0gZmFsc2U7XG4gICAgICAgIGlzRW5kZWQ6Ym9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBpc1N0YXJ0ZWQ6Ym9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBleHBpcmU6Ym9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBkZWxheTpudW1iZXIgPSAwO1xuICAgICAgICByZXBlYXQ6bnVtYmVyID0gMDtcbiAgICAgICAgbG9vcDpib29sZWFuID0gZmFsc2U7XG5cbiAgICAgICAgcHJpdmF0ZSBfZGVsYXlUaW1lOm51bWJlciA9IDA7XG4gICAgICAgIHByaXZhdGUgX2VsYXBzZWRUaW1lOm51bWJlciA9IDA7XG4gICAgICAgIHByaXZhdGUgX3JlcGVhdDpudW1iZXIgPSAwO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB0aW1lOm51bWJlciA9IDEsIHB1YmxpYyBtYW5hZ2VyPzpUaW1lck1hbmFnZXIpe1xuICAgICAgICAgICAgaWYodGhpcy5tYW5hZ2VyKXtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZFRvKHRoaXMubWFuYWdlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB1cGRhdGUoZGVsdGFUaW1lOm51bWJlcik6VGltZXJ7XG4gICAgICAgICAgICBpZighdGhpcy5hY3RpdmUpcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB2YXIgZGVsdGFNUzpudW1iZXIgPSBkZWx0YVRpbWUqMTAwMDtcblxuICAgICAgICAgICAgaWYodGhpcy5kZWxheSA+IHRoaXMuX2RlbGF5VGltZSl7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGVsYXlUaW1lICs9IGRlbHRhTVM7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKCF0aGlzLmlzU3RhcnRlZCl7XG4gICAgICAgICAgICAgICAgdGhpcy5pc1N0YXJ0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuX29uVGltZXJTdGFydCh0aGlzLl9lbGFwc2VkVGltZSwgZGVsdGFUaW1lKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYodGhpcy50aW1lID4gdGhpcy5fZWxhcHNlZFRpbWUpe1xuICAgICAgICAgICAgICAgIHZhciB0Om51bWJlciA9IHRoaXMuX2VsYXBzZWRUaW1lK2RlbHRhTVM7XG4gICAgICAgICAgICAgICAgdmFyIGVuZGVkOmJvb2xlYW4gPSAodD49dGhpcy50aW1lKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuX2VsYXBzZWRUaW1lID0gKGVuZGVkKSA/IHRoaXMudGltZSA6IHQ7XG4gICAgICAgICAgICAgICAgdGhpcy5fb25UaW1lclVwZGF0ZSh0aGlzLl9lbGFwc2VkVGltZSwgZGVsdGFUaW1lKTtcblxuICAgICAgICAgICAgICAgIGlmKGVuZGVkKXtcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5sb29wIHx8IHRoaXMucmVwZWF0ID4gdGhpcy5fcmVwZWF0KXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3JlcGVhdCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fb25UaW1lclJlcGVhdCh0aGlzLl9lbGFwc2VkVGltZSwgZGVsdGFUaW1lLCB0aGlzLl9yZXBlYXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxhcHNlZFRpbWUgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzRW5kZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFjdGl2ZSAgPWZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9vblRpbWVyRW5kKHRoaXMuX2VsYXBzZWRUaW1lLCBkZWx0YVRpbWUpO1xuICAgICAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGFkZFRvKHRpbWVyTWFuYWdlcjpUaW1lck1hbmFnZXIpOlRpbWVyIHtcbiAgICAgICAgICAgIHRpbWVyTWFuYWdlci5hZGRUaW1lcih0aGlzKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVtb3ZlKCk6VGltZXJ7XG4gICAgICAgICAgICBpZighdGhpcy5tYW5hZ2VyKXtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaW1lciB3aXRob3V0IG1hbmFnZXIuXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLm1hbmFnZXIucmVtb3ZlVGltZXIodGhpcyk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXJ0KCk6VGltZXJ7XG4gICAgICAgICAgICB0aGlzLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHN0b3AoKTpUaW1lcntcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLl9vblRpbWVyU3RvcCh0aGlzLl9lbGFwc2VkVGltZSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc2V0KCk6VGltZXJ7XG4gICAgICAgICAgICB0aGlzLl9lbGFwc2VkVGltZSA9IDA7XG4gICAgICAgICAgICB0aGlzLl9yZXBlYXQgPSAwO1xuICAgICAgICAgICAgdGhpcy5fZGVsYXlUaW1lID0gMDtcbiAgICAgICAgICAgIHRoaXMuaXNTdGFydGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmlzRW5kZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgb25TdGFydChjYWxsYmFjazpGdW5jdGlvbik6VGltZXJ7XG4gICAgICAgICAgICB0aGlzLl9vblRpbWVyU3RhcnQgPSA8YW55PmNhbGxiYWNrO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBvbkVuZChjYWxsYmFjazpGdW5jdGlvbik6VGltZXJ7XG4gICAgICAgICAgICB0aGlzLl9vblRpbWVyRW5kID0gPGFueT5jYWxsYmFjaztcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgb25TdG9wKGNhbGxiYWNrOkZ1bmN0aW9uKTpUaW1lcntcbiAgICAgICAgICAgIHRoaXMuX29uVGltZXJTdG9wID0gPGFueT5jYWxsYmFjaztcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgb25VcGRhdGUoY2FsbGJhY2s6RnVuY3Rpb24pOlRpbWVye1xuICAgICAgICAgICAgdGhpcy5fb25UaW1lclVwZGF0ZSA9IDxhbnk+Y2FsbGJhY2s7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIG9uUmVwZWF0KGNhbGxiYWNrOkZ1bmN0aW9uKTpUaW1lcntcbiAgICAgICAgICAgIHRoaXMuX29uVGltZXJSZXBlYXQgPSA8YW55PmNhbGxiYWNrO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9vblRpbWVyU3RhcnQoZWxhcHNlZFRpbWU6bnVtYmVyLCBkZWx0YVRpbWU6bnVtYmVyKTp2b2lke31cbiAgICAgICAgcHJpdmF0ZSBfb25UaW1lclN0b3AoZWxhcHNlZFRpbWU6bnVtYmVyKTp2b2lke31cbiAgICAgICAgcHJpdmF0ZSBfb25UaW1lclJlcGVhdChlbGFwc2VkVGltZTpudW1iZXIsIGRlbHRhVGltZTpudW1iZXIsIHJlcGVhdDpudW1iZXIpOnZvaWR7fVxuICAgICAgICBwcml2YXRlIF9vblRpbWVyVXBkYXRlKGVsYXBzZWRUaW1lOm51bWJlciwgZGVsdGFUaW1lOm51bWJlcik6dm9pZHt9XG4gICAgICAgIHByaXZhdGUgX29uVGltZXJFbmQoZWxhcHNlZFRpbWU6bnVtYmVyLCBkZWx0YVRpbWU6bnVtYmVyKTp2b2lke31cbiAgICB9XG59IiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vZGVmcy9waXhpLmpzLmQudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi9UaW1lci50c1wiIC8+XG5tb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IGNsYXNzIFRpbWVyTWFuYWdlciB7XG4gICAgICAgIHRpbWVyczpUaW1lcltdID0gW107XG4gICAgICAgIF90b0RlbGV0ZTpUaW1lcltdID0gW107XG5cbiAgICAgICAgY29uc3RydWN0b3IoKXt9XG5cbiAgICAgICAgdXBkYXRlKGRlbHRhVGltZTpudW1iZXIpOlRpbWVyTWFuYWdlcntcbiAgICAgICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgdGhpcy50aW1lcnMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgIGlmKHRoaXMudGltZXJzW2ldLmFjdGl2ZSl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGltZXJzW2ldLnVwZGF0ZShkZWx0YVRpbWUpO1xuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLnRpbWVyc1tpXS5pc0VuZGVkICYmIHRoaXMudGltZXJzW2ldLmV4cGlyZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRpbWVyc1tpXS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYodGhpcy5fdG9EZWxldGUubGVuZ3RoKXtcbiAgICAgICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCB0aGlzLl90b0RlbGV0ZS5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3JlbW92ZSh0aGlzLl90b0RlbGV0ZVtpXSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5fdG9EZWxldGUubGVuZ3RoID0gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICByZW1vdmVUaW1lcih0aW1lcjpUaW1lcik6VGltZXJNYW5hZ2Vye1xuICAgICAgICAgICAgdGhpcy5fdG9EZWxldGUucHVzaCh0aW1lcik7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGFkZFRpbWVyKHRpbWVyOlRpbWVyKTpUaW1lcntcbiAgICAgICAgICAgIHRpbWVyLm1hbmFnZXIgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy50aW1lcnMucHVzaCh0aW1lcik7XG4gICAgICAgICAgICByZXR1cm4gdGltZXI7XG4gICAgICAgIH1cblxuICAgICAgICBjcmVhdGVUaW1lcih0aW1lPzpudW1iZXIpe1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBUaW1lcih0aW1lLCB0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX3JlbW92ZSh0aW1lcjpUaW1lcik6dm9pZHtcbiAgICAgICAgICAgIHZhciBpbmRleDpudW1iZXIgPSB0aGlzLnRpbWVycy5pbmRleE9mKHRpbWVyKTtcbiAgICAgICAgICAgIGlmKGluZGV4ID49IDApdGhpcy50aW1lcnMuc3BsaWNlKGluZGV4LDEpO1xuICAgICAgICB9XG4gICAgfVxufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2RlZnMvcGl4aS5qcy5kLnRzXCIgLz5cbm1vZHVsZSBQSVhJIHtcbiAgICBleHBvcnQgbW9kdWxlIEVhc2luZyB7XG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBsaW5lYXIoKTpGdW5jdGlvbntcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihrOm51bWJlcik6bnVtYmVye1xuICAgICAgICAgICAgICAgIHJldHVybiBrO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBpblF1YWQoKTpGdW5jdGlvbntcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihrOm51bWJlcik6bnVtYmVye1xuICAgICAgICAgICAgICAgIHJldHVybiBrKms7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIG91dFF1YWQoKTpGdW5jdGlvbntcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihrOm51bWJlcik6bnVtYmVye1xuICAgICAgICAgICAgICAgIHJldHVybiBrKigyLWspO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBpbk91dFF1YWQoKTpGdW5jdGlvbntcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihrOm51bWJlcik6bnVtYmVye1xuICAgICAgICAgICAgICAgIGlmICggKCBrICo9IDIgKSA8IDEgKSByZXR1cm4gMC41ICogayAqIGs7XG4gICAgICAgICAgICAgICAgcmV0dXJuIC0gMC41ICogKCAtLWsgKiAoIGsgLSAyICkgLSAxICk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIGluQ3ViaWMoKTpGdW5jdGlvbntcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoazpudW1iZXIpOm51bWJlcntcbiAgICAgICAgICAgICAgICByZXR1cm4gayAqIGsgKiBrO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBvdXRDdWJpYygpOkZ1bmN0aW9ue1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGs6bnVtYmVyKTpudW1iZXJ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIC0tayAqIGsgKiBrICsgMTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gaW5PdXRDdWJpYygpOkZ1bmN0aW9ue1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGs6bnVtYmVyKTpudW1iZXJ7XG4gICAgICAgICAgICAgICAgaWYgKCAoIGsgKj0gMiApIDwgMSApIHJldHVybiAwLjUgKiBrICogayAqIGs7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDAuNSAqICggKCBrIC09IDIgKSAqIGsgKiBrICsgMiApO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBpblF1YXJ0KCk6RnVuY3Rpb257XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oazpudW1iZXIpOm51bWJlcntcbiAgICAgICAgICAgICAgICByZXR1cm4gayAqIGsgKiBrICogaztcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gb3V0UXVhcnQoKTpGdW5jdGlvbntcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihrOm51bWJlcik6bnVtYmVye1xuICAgICAgICAgICAgICAgIHJldHVybiAxIC0gKCAtLWsgKiBrICogayAqIGsgKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gaW5PdXRRdWFydCgpOkZ1bmN0aW9ue1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGs6bnVtYmVyKTpudW1iZXJ7XG4gICAgICAgICAgICAgICAgaWYgKCAoIGsgKj0gMiApIDwgMSkgcmV0dXJuIDAuNSAqIGsgKiBrICogayAqIGs7XG4gICAgICAgICAgICAgICAgcmV0dXJuIC0gMC41ICogKCAoIGsgLT0gMiApICogayAqIGsgKiBrIC0gMiApO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBpblF1aW50KCk6RnVuY3Rpb257XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oazpudW1iZXIpOm51bWJlcntcbiAgICAgICAgICAgICAgICByZXR1cm4gayAqIGsgKiBrICogayAqIGs7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIG91dFF1aW50KCk6RnVuY3Rpb257XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oazpudW1iZXIpOm51bWJlcntcbiAgICAgICAgICAgICAgICByZXR1cm4gLS1rICogayAqIGsgKiBrICogayArIDE7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIGluT3V0UXVpbnQoKTpGdW5jdGlvbntcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihrOm51bWJlcik6bnVtYmVye1xuICAgICAgICAgICAgICAgIGlmICggKCBrICo9IDIgKSA8IDEgKSByZXR1cm4gMC41ICogayAqIGsgKiBrICogayAqIGs7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDAuNSAqICggKCBrIC09IDIgKSAqIGsgKiBrICogayAqIGsgKyAyICk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIGluU2luZSgpOkZ1bmN0aW9ue1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGs6bnVtYmVyKTpudW1iZXJ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDEgLSBNYXRoLmNvcyggayAqIE1hdGguUEkgLyAyICk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIG91dFNpbmUoKTpGdW5jdGlvbntcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihrOm51bWJlcik6bnVtYmVye1xuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLnNpbiggayAqIE1hdGguUEkgLyAyICk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIGluT3V0U2luZSgpOkZ1bmN0aW9ue1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGs6bnVtYmVyKTpudW1iZXJ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDAuNSAqICggMSAtIE1hdGguY29zKCBNYXRoLlBJICogayApICk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIGluRXhwbygpOkZ1bmN0aW9ue1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGs6bnVtYmVyKTpudW1iZXJ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGsgPT09IDAgPyAwIDogTWF0aC5wb3coIDEwMjQsIGsgLSAxICk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIG91dEV4cG8oKTpGdW5jdGlvbntcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihrOm51bWJlcik6bnVtYmVye1xuICAgICAgICAgICAgICAgIHJldHVybiBrID09PSAxID8gMSA6IDEgLSBNYXRoLnBvdyggMiwgLSAxMCAqIGsgKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gaW5PdXRFeHBvKCk6RnVuY3Rpb257XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oazpudW1iZXIpOm51bWJlcntcbiAgICAgICAgICAgICAgICBpZiAoIGsgPT09IDAgKSByZXR1cm4gMDtcbiAgICAgICAgICAgICAgICBpZiAoIGsgPT09IDEgKSByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICBpZiAoICggayAqPSAyICkgPCAxICkgcmV0dXJuIDAuNSAqIE1hdGgucG93KCAxMDI0LCBrIC0gMSApO1xuICAgICAgICAgICAgICAgIHJldHVybiAwLjUgKiAoIC0gTWF0aC5wb3coIDIsIC0gMTAgKiAoIGsgLSAxICkgKSArIDIgKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gaW5DaXJjKCk6RnVuY3Rpb257XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oazpudW1iZXIpOm51bWJlcntcbiAgICAgICAgICAgICAgICByZXR1cm4gMSAtIE1hdGguc3FydCggMSAtIGsgKiBrICk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIG91dENpcmMoKTpGdW5jdGlvbntcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihrOm51bWJlcik6bnVtYmVye1xuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLnNxcnQoIDEgLSAoIC0tayAqIGsgKSApO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBpbk91dENpcmMoKTpGdW5jdGlvbntcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihrOm51bWJlcik6bnVtYmVye1xuICAgICAgICAgICAgICAgIGlmICggKCBrICo9IDIgKSA8IDEpIHJldHVybiAtIDAuNSAqICggTWF0aC5zcXJ0KCAxIC0gayAqIGspIC0gMSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDAuNSAqICggTWF0aC5zcXJ0KCAxIC0gKCBrIC09IDIpICogaykgKyAxKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gaW5FbGFzdGljKCk6RnVuY3Rpb257XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oazpudW1iZXIpOm51bWJlcntcbiAgICAgICAgICAgICAgICB2YXIgczpudW1iZXIsIGE6bnVtYmVyID0gMC4xLCBwOm51bWJlciA9IDAuNDtcbiAgICAgICAgICAgICAgICBpZiAoIGsgPT09IDAgKSByZXR1cm4gMDtcbiAgICAgICAgICAgICAgICBpZiAoIGsgPT09IDEgKSByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICBpZiAoICFhIHx8IGEgPCAxICkgeyBhID0gMTsgcyA9IHAgLyA0OyB9XG4gICAgICAgICAgICAgICAgZWxzZSBzID0gcCAqIE1hdGguYXNpbiggMSAvIGEgKSAvICggMiAqIE1hdGguUEkgKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gLSAoIGEgKiBNYXRoLnBvdyggMiwgMTAgKiAoIGsgLT0gMSApICkgKiBNYXRoLnNpbiggKCBrIC0gcyApICogKCAyICogTWF0aC5QSSApIC8gcCApICk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIG91dEVsYXN0aWMoKTpGdW5jdGlvbntcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihrOm51bWJlcik6bnVtYmVye1xuICAgICAgICAgICAgICAgIHZhciBzOm51bWJlciwgYTpudW1iZXIgPSAwLjEsIHA6bnVtYmVyID0gMC40O1xuICAgICAgICAgICAgICAgIGlmICggayA9PT0gMCApIHJldHVybiAwO1xuICAgICAgICAgICAgICAgIGlmICggayA9PT0gMSApIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIGlmICggIWEgfHwgYSA8IDEgKSB7IGEgPSAxOyBzID0gcCAvIDQ7IH1cbiAgICAgICAgICAgICAgICBlbHNlIHMgPSBwICogTWF0aC5hc2luKCAxIC8gYSApIC8gKCAyICogTWF0aC5QSSApO1xuICAgICAgICAgICAgICAgIHJldHVybiAoIGEgKiBNYXRoLnBvdyggMiwgLSAxMCAqIGspICogTWF0aC5zaW4oICggayAtIHMgKSAqICggMiAqIE1hdGguUEkgKSAvIHAgKSArIDEgKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gaW5PdXRFbGFzdGljKCk6RnVuY3Rpb257XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oazpudW1iZXIpOm51bWJlcntcbiAgICAgICAgICAgICAgICB2YXIgczpudW1iZXIsIGE6bnVtYmVyID0gMC4xLCBwOm51bWJlciA9IDAuNDtcbiAgICAgICAgICAgICAgICBpZiAoIGsgPT09IDAgKSByZXR1cm4gMDtcbiAgICAgICAgICAgICAgICBpZiAoIGsgPT09IDEgKSByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICBpZiAoICFhIHx8IGEgPCAxICkgeyBhID0gMTsgcyA9IHAgLyA0OyB9XG4gICAgICAgICAgICAgICAgZWxzZSBzID0gcCAqIE1hdGguYXNpbiggMSAvIGEgKSAvICggMiAqIE1hdGguUEkgKTtcbiAgICAgICAgICAgICAgICBpZiAoICggayAqPSAyICkgPCAxICkgcmV0dXJuIC0gMC41ICogKCBhICogTWF0aC5wb3coIDIsIDEwICogKCBrIC09IDEgKSApICogTWF0aC5zaW4oICggayAtIHMgKSAqICggMiAqIE1hdGguUEkgKSAvIHAgKSApO1xuICAgICAgICAgICAgICAgIHJldHVybiBhICogTWF0aC5wb3coIDIsIC0xMCAqICggayAtPSAxICkgKSAqIE1hdGguc2luKCAoIGsgLSBzICkgKiAoIDIgKiBNYXRoLlBJICkgLyBwICkgKiAwLjUgKyAxO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBpbkJhY2sodjpudW1iZXIgPSAxLjcwMTU4KTpGdW5jdGlvbntcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihrOm51bWJlcik6bnVtYmVye1xuICAgICAgICAgICAgICAgIHZhciBzOm51bWJlciA9IHY7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGsgKiBrICogKCAoIHMgKyAxICkgKiBrIC0gcyApO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBvdXRCYWNrKHY6bnVtYmVyID0gMS43MDE1OCk6RnVuY3Rpb257XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oazpudW1iZXIpOm51bWJlcntcbiAgICAgICAgICAgICAgICB2YXIgczpudW1iZXIgPSB2O1xuICAgICAgICAgICAgICAgIHJldHVybiAtLWsgKiBrICogKCAoIHMgKyAxICkgKiBrICsgcyApICsgMTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gaW5PdXRCYWNrKHY6bnVtYmVyID0gMS43MDE1OCk6RnVuY3Rpb257XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oazpudW1iZXIpOm51bWJlcntcbiAgICAgICAgICAgICAgICB2YXIgczpudW1iZXIgPSAgdiAqIDEuNTI1O1xuICAgICAgICAgICAgICAgIGlmICggKCBrICo9IDIgKSA8IDEgKSByZXR1cm4gMC41ICogKCBrICogayAqICggKCBzICsgMSApICogayAtIHMgKSApO1xuICAgICAgICAgICAgICAgIHJldHVybiAwLjUgKiAoICggayAtPSAyICkgKiBrICogKCAoIHMgKyAxICkgKiBrICsgcyApICsgMiApO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBpbkJvdW5jZSgpOkZ1bmN0aW9ue1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGs6bnVtYmVyKTpudW1iZXJ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDEgLSBFYXNpbmcub3V0Qm91bmNlKCkoIDEgLSBrICk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIG91dEJvdW5jZSgpOkZ1bmN0aW9ue1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGs6bnVtYmVyKTpudW1iZXJ7XG4gICAgICAgICAgICAgICAgaWYgKCBrIDwgKCAxIC8gMi43NSApICkge1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiA3LjU2MjUgKiBrICogaztcblxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIGsgPCAoIDIgLyAyLjc1ICkgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDcuNTYyNSAqICggayAtPSAoIDEuNSAvIDIuNzUgKSApICogayArIDAuNzU7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCBrIDwgKCAyLjUgLyAyLjc1ICkgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDcuNTYyNSAqICggayAtPSAoIDIuMjUgLyAyLjc1ICkgKSAqIGsgKyAwLjkzNzU7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiA3LjU2MjUgKiAoIGsgLT0gKCAyLjYyNSAvIDIuNzUgKSApICogayArIDAuOTg0Mzc1O1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBpbk91dEJvdW5jZSgpOkZ1bmN0aW9ue1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGs6bnVtYmVyKTpudW1iZXJ7XG4gICAgICAgICAgICAgICAgaWYgKCBrIDwgMC41ICkgcmV0dXJuIEVhc2luZy5pbkJvdW5jZSgpKCBrICogMiApICogMC41O1xuICAgICAgICAgICAgICAgIHJldHVybiBFYXNpbmcub3V0Qm91bmNlKCkoIGsgKiAyIC0gMSApICogMC41ICsgMC41O1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9kZWZzL3BpeGkuanMuZC50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuL1R3ZWVuTWFuYWdlci50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuL0Vhc2luZy50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9kaXNwbGF5L1NjZW5lLnRzXCIgLz5cbm1vZHVsZSBQSVhJe1xuICAgIGV4cG9ydCBjbGFzcyBUd2VlbntcbiAgICAgICAgdGltZTpudW1iZXIgPSAwO1xuICAgICAgICBhY3RpdmU6Ym9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBlYXNpbmc6RnVuY3Rpb24gPSBFYXNpbmcubGluZWFyKCk7XG4gICAgICAgIGV4cGlyZTpib29sZWFuID0gZmFsc2U7XG4gICAgICAgIHJlcGVhdDpudW1iZXIgPSAwO1xuICAgICAgICBsb29wOmJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgZGVsYXk6bnVtYmVyID0gMDtcbiAgICAgICAgcGluZ1Bvbmc6Ym9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBpc1N0YXJ0ZWQ6Ym9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBpc0VuZGVkOmJvb2xlYW4gPSBmYWxzZTtcblxuICAgICAgICBwcml2YXRlIF90bzphbnk7XG4gICAgICAgIHByaXZhdGUgX2Zyb206YW55O1xuICAgICAgICBwcml2YXRlIF9kZWxheVRpbWU6bnVtYmVyID0gMDtcbiAgICAgICAgcHJpdmF0ZSBfZWxhcHNlZFRpbWU6bnVtYmVyID0gMDtcbiAgICAgICAgcHJpdmF0ZSBfcmVwZWF0Om51bWJlciA9IDA7XG4gICAgICAgIHByaXZhdGUgX3BpbmdQb25nOmJvb2xlYW4gPSBmYWxzZTtcblxuICAgICAgICBwcml2YXRlIF9jaGFpblR3ZWVuOlR3ZWVuO1xuXG4gICAgICAgIC8vdG9kbyBwYXRoXG4gICAgICAgIHBhdGg6YW55O1xuICAgICAgICBwYXRoUmV2ZXJzZTpib29sZWFuID0gZmFsc2U7XG4gICAgICAgIHBhdGhGcm9tOm51bWJlcjtcbiAgICAgICAgcGF0aFRvOm51bWJlcjtcblxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgdGFyZ2V0OmFueSwgcHVibGljIG1hbmFnZXI/OlR3ZWVuTWFuYWdlcil7XG4gICAgICAgICAgICBpZih0aGlzLm1hbmFnZXIpe1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkVG8odGhpcy5tYW5hZ2VyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGFkZFRvKG1hbmFnZXI6VHdlZW5NYW5hZ2VyKTpUd2VlbntcbiAgICAgICAgICAgIG1hbmFnZXIuYWRkVHdlZW4odGhpcyk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGNoYWluKHR3ZWVuOlR3ZWVuID0gbmV3IFR3ZWVuKHRoaXMudGFyZ2V0KSk6VHdlZW57XG4gICAgICAgICAgICB0aGlzLl9jaGFpblR3ZWVuID0gdHdlZW47XG4gICAgICAgICAgICByZXR1cm4gdHdlZW47XG4gICAgICAgIH1cblxuICAgICAgICBzdGFydCgpOlR3ZWVue1xuICAgICAgICAgICAgdGhpcy5hY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgaWYoIXRoaXMubWFuYWdlcil7XG4gICAgICAgICAgICAgICAgaWYodGhpcy50YXJnZXQpe1xuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLnRhcmdldC5wYXJlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtYW5hZ2VyOlR3ZWVuTWFuYWdlciA9IF9maW5kTWFuYWdlcih0aGlzLnRhcmdldCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobWFuYWdlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkVG8obWFuYWdlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKCdUd2VlbnMgbmVlZHMgYSBtYW5hZ2VyJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoJ1R3ZWVucyBuZWVkcyBhIG1hbmFnZXInKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RvcCgpOlR3ZWVue1xuICAgICAgICAgICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuX29uVHdlZW5TdG9wKHRoaXMuX2VsYXBzZWRUaW1lKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgdG8oZGF0YTphbnkpOlR3ZWVue1xuICAgICAgICAgICAgdGhpcy5fdG8gPSBkYXRhO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBmcm9tKGRhdGE6YW55KTpUd2VlbntcbiAgICAgICAgICAgIHRoaXMuX2Zyb20gPSBkYXRhO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICByZW1vdmUoKTpUd2VlbntcbiAgICAgICAgICAgIGlmKCF0aGlzLm1hbmFnZXIpe1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlR3ZWVuIHdpdGhvdXQgbWFuYWdlci5cIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5yZW1vdmVUd2Vlbih0aGlzKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzZXQoKTpUd2VlbntcbiAgICAgICAgICAgIHRoaXMuX2VsYXBzZWRUaW1lID0gMDtcbiAgICAgICAgICAgIHRoaXMuX3JlcGVhdCA9IDA7XG4gICAgICAgICAgICB0aGlzLl9kZWxheVRpbWUgPSAwO1xuICAgICAgICAgICAgdGhpcy5pc1N0YXJ0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuaXNFbmRlZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICBpZih0aGlzLnBpbmdQb25nJiZ0aGlzLl9waW5nUG9uZyl7XG4gICAgICAgICAgICAgICAgdmFyIF90bzphbnkgPSB0aGlzLl90byxcbiAgICAgICAgICAgICAgICAgICAgX2Zyb206YW55ID0gdGhpcy5fZnJvbTtcblxuICAgICAgICAgICAgICAgIHRoaXMuX3RvID0gX2Zyb207XG4gICAgICAgICAgICAgICAgdGhpcy5fZnJvbSA9IF90bztcblxuICAgICAgICAgICAgICAgIHRoaXMuX3BpbmdQb25nID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIG9uU3RhcnQoY2FsbGJhY2s6RnVuY3Rpb24pOlR3ZWVue1xuICAgICAgICAgICAgdGhpcy5fb25Ud2VlblN0YXJ0ID0gPGFueT5jYWxsYmFjaztcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgb25FbmQoY2FsbGJhY2s6RnVuY3Rpb24pOlR3ZWVue1xuICAgICAgICAgICAgdGhpcy5fb25Ud2VlbkVuZCA9IDxhbnk+Y2FsbGJhY2s7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIG9uU3RvcChjYWxsYmFjazpGdW5jdGlvbik6VHdlZW57XG4gICAgICAgICAgICB0aGlzLl9vblR3ZWVuU3RvcCA9IDxhbnk+Y2FsbGJhY2s7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIG9uVXBkYXRlKGNhbGxiYWNrOkZ1bmN0aW9uKTpUd2VlbntcbiAgICAgICAgICAgIHRoaXMuX29uVHdlZW5VcGRhdGUgPSA8YW55PmNhbGxiYWNrO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBvblJlcGVhdChjYWxsYmFjazpGdW5jdGlvbik6VHdlZW57XG4gICAgICAgICAgICB0aGlzLl9vblR3ZWVuUmVwZWF0ID0gPGFueT5jYWxsYmFjaztcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgb25QaW5nUG9uZyhjYWxsYmFjazpGdW5jdGlvbik6VHdlZW57XG4gICAgICAgICAgICB0aGlzLl9vblR3ZWVuUGluZ1BvbmcgPSA8YW55PmNhbGxiYWNrO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICB1cGRhdGUoZGVsdGFUaW1lOm51bWJlcik6VHdlZW57XG4gICAgICAgICAgICBpZighKHRoaXMuX2NhblVwZGF0ZSgpJiYodGhpcy5fdG98fHRoaXMucGF0aCkpKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIF90bzphbnksIF9mcm9tOmFueTtcbiAgICAgICAgICAgIHZhciBkZWx0YU1TID0gZGVsdGFUaW1lICogMTAwMDtcblxuICAgICAgICAgICAgaWYodGhpcy5kZWxheSA+IHRoaXMuX2RlbGF5VGltZSl7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGVsYXlUaW1lICs9IGRlbHRhTVM7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKCF0aGlzLmlzU3RhcnRlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3BhcnNlRGF0YSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuaXNTdGFydGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9vblR3ZWVuU3RhcnQodGhpcy5fZWxhcHNlZFRpbWUsIGRlbHRhVGltZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciB0aW1lOm51bWJlciA9ICh0aGlzLnBpbmdQb25nKSA/IHRoaXMudGltZS8yIDogdGhpcy50aW1lO1xuICAgICAgICAgICAgaWYodGltZSA+IHRoaXMuX2VsYXBzZWRUaW1lKXtcbiAgICAgICAgICAgICAgICB2YXIgdDpudW1iZXIgPSB0aGlzLl9lbGFwc2VkVGltZStkZWx0YU1TO1xuICAgICAgICAgICAgICAgIHZhciBlbmRlZDpib29sZWFuID0gKHQ+PXRpbWUpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fZWxhcHNlZFRpbWUgPSAoZW5kZWQpID8gdGltZSA6IHQ7XG4gICAgICAgICAgICAgICAgdGhpcy5fYXBwbHkodGltZSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgcmVhbEVsYXBzZWQ6bnVtYmVyID0gKHRoaXMuX3BpbmdQb25nKSA/IHRpbWUrdGhpcy5fZWxhcHNlZFRpbWUgOiB0aGlzLl9lbGFwc2VkVGltZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9vblR3ZWVuVXBkYXRlKHJlYWxFbGFwc2VkLCBkZWx0YVRpbWUpO1xuXG4gICAgICAgICAgICAgICAgaWYoZW5kZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucGluZ1BvbmcgJiYgIXRoaXMuX3BpbmdQb25nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9waW5nUG9uZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBfdG8gPSB0aGlzLl90bztcbiAgICAgICAgICAgICAgICAgICAgICAgIF9mcm9tID0gdGhpcy5fZnJvbTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZnJvbSA9IF90bztcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3RvID0gX2Zyb207XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnBhdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdG8gPSB0aGlzLnBhdGhUbztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfZnJvbSA9IHRoaXMucGF0aEZyb207XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBhdGhUbyA9IF9mcm9tO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGF0aEZyb20gPSBfdG87XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX29uVHdlZW5QaW5nUG9uZyhyZWFsRWxhcHNlZCwgZGVsdGFUaW1lKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxhcHNlZFRpbWUgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5sb29wIHx8IHRoaXMucmVwZWF0ID4gdGhpcy5fcmVwZWF0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZXBlYXQrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX29uVHdlZW5SZXBlYXQocmVhbEVsYXBzZWQsIGRlbHRhVGltZSwgdGhpcy5fcmVwZWF0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2VsYXBzZWRUaW1lID0gMDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucGluZ1BvbmcgJiYgdGhpcy5fcGluZ1BvbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdG8gPSB0aGlzLl90bztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfZnJvbSA9IHRoaXMuX2Zyb207XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl90byA9IF9mcm9tO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2Zyb20gPSBfdG87XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wYXRoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90byA9IHRoaXMucGF0aFRvO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfZnJvbSA9IHRoaXMucGF0aEZyb207XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXRoVG8gPSBfZnJvbTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXRoRnJvbSA9IF90bztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9waW5nUG9uZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzRW5kZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9vblR3ZWVuRW5kKHJlYWxFbGFwc2VkLCBkZWx0YVRpbWUpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX2NoYWluVHdlZW4pe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hhaW5Ud2Vlbi5hZGRUbyh0aGlzLm1hbmFnZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hhaW5Ud2Vlbi5zdGFydCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9wYXJzZURhdGEoKTp2b2lke1xuICAgICAgICAgICAgaWYodGhpcy5pc1N0YXJ0ZWQpcmV0dXJuO1xuXG4gICAgICAgICAgICBpZighdGhpcy5fZnJvbSl0aGlzLl9mcm9tID0ge307XG4gICAgICAgICAgICBfcGFyc2VSZWN1cnNpdmVEYXRhKHRoaXMuX3RvLCB0aGlzLl9mcm9tLCB0aGlzLnRhcmdldCk7XG5cbiAgICAgICAgICAgIC8vdG9kbzogcGFyc2UgcGF0aHNcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX2FwcGx5KHRpbWU6bnVtYmVyKTp2b2lke1xuICAgICAgICAgICAgX3JlY3Vyc2l2ZUFwcGx5KHRoaXMuX3RvLCB0aGlzLl9mcm9tLCB0aGlzLnRhcmdldCwgdGltZSwgdGhpcy5fZWxhcHNlZFRpbWUsIHRoaXMuZWFzaW5nKTtcblxuICAgICAgICAgICAgLy90b2RvOiBhcHBseSBwYXRoXG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9jYW5VcGRhdGUoKTpib29sZWFue1xuICAgICAgICAgICAgcmV0dXJuICh0aGlzLnRpbWUgJiYgdGhpcy5hY3RpdmUgJiYgdGhpcy50YXJnZXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfb25Ud2VlblN0YXJ0KGVsYXBzZWRUaW1lOm51bWJlciwgZGVsdGFUaW1lOiBudW1iZXIpOnZvaWR7fVxuICAgICAgICBwcml2YXRlIF9vblR3ZWVuU3RvcChlbGFwc2VkVGltZTpudW1iZXIpOnZvaWR7fVxuICAgICAgICBwcml2YXRlIF9vblR3ZWVuRW5kKGVsYXBzZWRUaW1lOm51bWJlciwgZGVsdGFUaW1lOiBudW1iZXIpOnZvaWR7fVxuICAgICAgICBwcml2YXRlIF9vblR3ZWVuUmVwZWF0KGVsYXBzZWRUaW1lOm51bWJlciwgZGVsdGFUaW1lOiBudW1iZXIsIHJlcGVhdDpudW1iZXIpOnZvaWR7fVxuICAgICAgICBwcml2YXRlIF9vblR3ZWVuVXBkYXRlKGVsYXBzZWRUaW1lOm51bWJlciwgZGVsdGFUaW1lOiBudW1iZXIpOnZvaWR7fVxuICAgICAgICBwcml2YXRlIF9vblR3ZWVuUGluZ1BvbmcoZWxhcHNlZFRpbWU6bnVtYmVyLCBkZWx0YVRpbWU6IG51bWJlcik6dm9pZHt9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2ZpbmRNYW5hZ2VyKHBhcmVudDphbnkpOmFueXtcbiAgICAgICAgaWYocGFyZW50IGluc3RhbmNlb2YgU2NlbmUpe1xuICAgICAgICAgICAgcmV0dXJuIChwYXJlbnQudHdlZW5NYW5hZ2VyKSA/IHBhcmVudC50d2Vlbk1hbmFnZXIgOiBudWxsO1xuICAgICAgICB9ZWxzZSBpZihwYXJlbnQucGFyZW50KXtcbiAgICAgICAgICAgIHJldHVybiBfZmluZE1hbmFnZXIocGFyZW50LnBhcmVudCk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfcGFyc2VSZWN1cnNpdmVEYXRhKHRvOmFueSwgZnJvbTphbnksIHRhcmdldDphbnkpOnZvaWR7XG4gICAgICAgIGZvcih2YXIgayBpbiB0byl7XG4gICAgICAgICAgICBpZihmcm9tW2tdICE9PSAwICYmICFmcm9tW2tdKXtcbiAgICAgICAgICAgICAgICBpZihpc09iamVjdCh0YXJnZXRba10pKXtcbiAgICAgICAgICAgICAgICAgICAgZnJvbVtrXSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGFyZ2V0W2tdKSk7XG4gICAgICAgICAgICAgICAgICAgIF9wYXJzZVJlY3Vyc2l2ZURhdGEodG9ba10sIGZyb21ba10sIHRhcmdldFtrXSk7XG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgIGZyb21ba10gPSB0YXJnZXRba107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNPYmplY3Qob2JqOmFueSk6Ym9vbGVhbntcbiAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSBcIltvYmplY3QgT2JqZWN0XVwiO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9yZWN1cnNpdmVBcHBseSh0bzphbnksIGZyb206YW55LCB0YXJnZXQ6YW55LCB0aW1lOm51bWJlciwgZWxhcHNlZDpudW1iZXIsIGVhc2luZzpGdW5jdGlvbik6dm9pZHtcbiAgICAgICAgZm9yKHZhciBrIGluIHRvKXtcbiAgICAgICAgICAgIGlmKCFpc09iamVjdCh0b1trXSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgYiA9IGZyb21ba10sXG4gICAgICAgICAgICAgICAgICAgIGMgPSB0b1trXSAtIGZyb21ba10sXG4gICAgICAgICAgICAgICAgICAgIGQgPSB0aW1lLFxuICAgICAgICAgICAgICAgICAgICB0ID0gZWxhcHNlZC9kO1xuICAgICAgICAgICAgICAgIHRhcmdldFtrXSA9IGIgKyAoYyplYXNpbmcodCkpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgX3JlY3Vyc2l2ZUFwcGx5KHRvW2tdLCBmcm9tW2tdLCB0YXJnZXRba10sIHRpbWUsIGVsYXBzZWQsIGVhc2luZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9kZWZzL3BpeGkuanMuZC50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuL1R3ZWVuLnRzXCIgLz5cbm1vZHVsZSBQSVhJIHtcbiAgICBleHBvcnQgY2xhc3MgVHdlZW5NYW5hZ2Vye1xuICAgICAgICB0d2VlbnM6VHdlZW5bXSA9IFtdO1xuICAgICAgICBwcml2YXRlIF90b0RlbGV0ZTpUd2VlbltdID0gW107XG5cbiAgICAgICAgY29uc3RydWN0b3IoKXt9XG5cbiAgICAgICAgdXBkYXRlKGRlbHRhVGltZTpudW1iZXIpOlR3ZWVuTWFuYWdlcntcbiAgICAgICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgdGhpcy50d2VlbnMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgIGlmKHRoaXMudHdlZW5zW2ldLmFjdGl2ZSl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHdlZW5zW2ldLnVwZGF0ZShkZWx0YVRpbWUpXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMudHdlZW5zW2ldLmlzRW5kZWQgJiYgdGhpcy50d2VlbnNbaV0uZXhwaXJlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHdlZW5zW2ldLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZih0aGlzLl90b0RlbGV0ZS5sZW5ndGgpe1xuICAgICAgICAgICAgICAgIGZvcihpID0gMDsgaSA8IHRoaXMuX3RvRGVsZXRlLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVtb3ZlKHRoaXMuX3RvRGVsZXRlW2ldKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLl90b0RlbGV0ZS5sZW5ndGggPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBnZXRUd2VlbnNGb3JUYXJnZXIodGFyZ2V0OmFueSk6VHdlZW5bXXtcbiAgICAgICAgICAgIHZhciB0d2VlbnM6VHdlZW5bXSA9IFtdO1xuICAgICAgICAgICAgZm9yKHZhciBpOm51bWJlciA9IDA7IGkgPCB0aGlzLnR3ZWVucy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgaWYodGhpcy50d2VlbnNbaV0udGFyZ2V0ID09PSB0YXJnZXQpe1xuICAgICAgICAgICAgICAgICAgICB0d2VlbnMucHVzaCh0aGlzLnR3ZWVuc1tpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdHdlZW5zO1xuICAgICAgICB9XG5cbiAgICAgICAgY3JlYXRlVHdlZW4odGFyZ2V0OmFueSk6VHdlZW57XG4gICAgICAgICAgICByZXR1cm4gbmV3IFR3ZWVuKHRhcmdldCwgdGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICBhZGRUd2Vlbih0d2VlbjpUd2Vlbik6VHdlZW57XG4gICAgICAgICAgICB0d2Vlbi5tYW5hZ2VyID0gdGhpcztcbiAgICAgICAgICAgIHRoaXMudHdlZW5zLnB1c2godHdlZW4pO1xuICAgICAgICAgICAgcmV0dXJuIHR3ZWVuO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVtb3ZlVHdlZW4odHdlZW46VHdlZW4pOlR3ZWVuTWFuYWdlcntcbiAgICAgICAgICAgIHRoaXMuX3RvRGVsZXRlLnB1c2godHdlZW4pO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9yZW1vdmUodHdlZW46VHdlZW4pe1xuICAgICAgICAgICAgdmFyIGluZGV4Om51bWJlciA9IHRoaXMudHdlZW5zLmluZGV4T2YodHdlZW4pO1xuICAgICAgICAgICAgaWYoaW5kZXggPj0gMCl7XG4gICAgICAgICAgICAgICAgdGhpcy50d2VlbnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9kZWZzL3BpeGkuanMuZC50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9jb3JlL0dhbWUudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi9DYW1lcmEudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vdGltZXIvVGltZXJNYW5hZ2VyLnRzXCIgLz5cbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL3R3ZWVuL1R3ZWVubWFuYWdlci50c1wiIC8+XG5tb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IGNsYXNzIFNjZW5lIGV4dGVuZHMgQ29udGFpbmVyIHtcbiAgICAgICAgY2FtZXJhOkNhbWVyYSA9IG5ldyBDYW1lcmEoKTtcbiAgICAgICAgdGltZXJNYW5hZ2VyOlRpbWVyTWFuYWdlciA9IG5ldyBUaW1lck1hbmFnZXIoKTtcbiAgICAgICAgdHdlZW5NYW5hZ2VyOlR3ZWVuTWFuYWdlciA9IG5ldyBUd2Vlbk1hbmFnZXIoKTtcbiAgICAgICAgc3RhdGljIF9pZExlbjpudW1iZXIgPSAwO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBpZDpzdHJpbmcgPSAoXCJzY2VuZVwiICsgU2NlbmUuX2lkTGVuKyspICl7XG4gICAgICAgICAgICBzdXBlcigpO1xuICAgICAgICAgICAgdGhpcy5jYW1lcmEuYWRkVG8odGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICB1cGRhdGUoZGVsdGFUaW1lOm51bWJlcik6U2NlbmV7XG4gICAgICAgICAgICB0aGlzLnRpbWVyTWFuYWdlci51cGRhdGUoZGVsdGFUaW1lKTtcbiAgICAgICAgICAgIHRoaXMudHdlZW5NYW5hZ2VyLnVwZGF0ZShkZWx0YVRpbWUpO1xuICAgICAgICAgICAgc3VwZXIudXBkYXRlKGRlbHRhVGltZSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGFkZFRvKGdhbWU6R2FtZXxDb250YWluZXIpOlNjZW5lIHtcbiAgICAgICAgICAgIGlmKGdhbWUgaW5zdGFuY2VvZiBHYW1lKXtcbiAgICAgICAgICAgICAgICA8R2FtZT5nYW1lLmFkZFNjZW5lKHRoaXMpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTY2VuZXMgY2FuIG9ubHkgYmUgYWRkZWQgdG8gdGhlIGdhbWUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICB9XG59IiwibW9kdWxlIFBJWEkge1xuICAgIGV4cG9ydCBjbGFzcyBJbnB1dE1hbmFnZXJ7XG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZ2FtZTogR2FtZSl7XG5cbiAgICAgICAgfVxuICAgIH1cbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9kZWZzL3BpeGkuanMuZC50c1wiIC8+XG5tb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IGZ1bmN0aW9uIGJpdG1hcEZvbnRQYXJzZXJUWFQoKTpGdW5jdGlvbntcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHJlc291cmNlOiBsb2FkZXJzLlJlc291cmNlLCBuZXh0OkZ1bmN0aW9uKTp2b2lke1xuXG4gICAgICAgICAgICAvL3NraXAgaWYgbm8gZGF0YSBvciBpZiBub3QgdHh0XG4gICAgICAgICAgICBpZighcmVzb3VyY2UuZGF0YSB8fCAocmVzb3VyY2UueGhyVHlwZSAhPT0gXCJ0ZXh0XCIgJiYgcmVzb3VyY2UueGhyVHlwZSAhPT0gXCJkb2N1bWVudFwiKSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5leHQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHRleHQ6c3RyaW5nID0gKHJlc291cmNlLnhoclR5cGUgPT09IFwidGV4dFwiKSA/IHJlc291cmNlLmRhdGEgOiByZXNvdXJjZS54aHIucmVzcG9uc2VUZXh0O1xuXG4gICAgICAgICAgICAvL3NraXAgaWYgbm90IGEgYml0bWFwIGZvbnQgZGF0YVxuICAgICAgICAgICAgaWYoIHRleHQuaW5kZXhPZihcInBhZ2VcIikgPT09IC0xIHx8XG4gICAgICAgICAgICAgICAgdGV4dC5pbmRleE9mKFwiZmFjZVwiKSA9PT0gLTEgfHxcbiAgICAgICAgICAgICAgICB0ZXh0LmluZGV4T2YoXCJpbmZvXCIpID09PSAtMSB8fFxuICAgICAgICAgICAgICAgIHRleHQuaW5kZXhPZihcImNoYXJcIikgPT09IC0xICl7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gbmV4dCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgdXJsOnN0cmluZyA9IGRpcm5hbWUocmVzb3VyY2UudXJsKTtcbiAgICAgICAgICAgIGlmKHVybCA9PT0gXCIuXCIpe1xuICAgICAgICAgICAgICAgIHVybCA9IFwiXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKHRoaXMuYmFzZVVybCAmJiB1cmwpe1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuYmFzZVVybC5jaGFyQXQodGhpcy5iYXNlVXJsLmxlbmd0aC0xKT09PSAnLycpe1xuICAgICAgICAgICAgICAgICAgICB1cmwgKz0gJy8nO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHVybC5yZXBsYWNlKHRoaXMuYmFzZVVybCwgJycpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZih1cmwgJiYgdXJsLmNoYXJBdCh1cmwubGVuZ3RoIC0gMSkgIT09ICcvJyl7XG4gICAgICAgICAgICAgICAgdXJsICs9ICcvJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHRleHR1cmVVcmw6c3RyaW5nID0gZ2V0VGV4dHVyZVVybCh1cmwsIHRleHQpO1xuICAgICAgICAgICAgaWYodXRpbHMuVGV4dHVyZUNhY2hlW3RleHR1cmVVcmxdKXtcbiAgICAgICAgICAgICAgICBwYXJzZShyZXNvdXJjZSwgdXRpbHMuVGV4dHVyZUNhY2hlW3RleHR1cmVVcmxdKTtcbiAgICAgICAgICAgICAgICBuZXh0KCk7XG4gICAgICAgICAgICB9ZWxzZXtcblxuICAgICAgICAgICAgICAgIHZhciBsb2FkT3B0aW9uczphbnkgPSB7XG4gICAgICAgICAgICAgICAgICAgIGNyb3NzT3JpZ2luOiByZXNvdXJjZS5jcm9zc09yaWdpbixcbiAgICAgICAgICAgICAgICAgICAgbG9hZFR5cGU6IGxvYWRlcnMuUmVzb3VyY2UuTE9BRF9UWVBFLklNQUdFXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHRoaXMuYWRkKHJlc291cmNlLm5hbWUgKyAnX2ltYWdlJywgdGV4dHVyZVVybCwgbG9hZE9wdGlvbnMsIGZ1bmN0aW9uKHJlczphbnkpe1xuICAgICAgICAgICAgICAgICAgICBwYXJzZShyZXNvdXJjZSwgcmVzLnRleHR1cmUpO1xuICAgICAgICAgICAgICAgICAgICBuZXh0KCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICBuZXh0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZShyZXNvdXJjZTpsb2FkZXJzLlJlc291cmNlLCB0ZXh0dXJlOlRleHR1cmUpe1xuICAgICAgICB2YXIgY3VycmVudExpbmU6c3RyaW5nLCBhdHRyOmF0dHJEYXRhLFxuICAgICAgICAgICAgZGF0YTpmb250RGF0YSA9IHtcbiAgICAgICAgICAgICAgICBjaGFycyA6IHt9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIHZhciB0ZXh0OnN0cmluZyA9IChyZXNvdXJjZS54aHJUeXBlID09PSBcInRleHRcIikgPyByZXNvdXJjZS5kYXRhIDogcmVzb3VyY2UueGhyLnJlc3BvbnNlVGV4dDtcbiAgICAgICAgdmFyIGxpbmVzOnN0cmluZ1tdID0gdGV4dC5zcGxpdCgnXFxuJyk7XG5cbiAgICAgICAgZm9yKHZhciBpOm51bWJlciA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICBpZihsaW5lc1tpXS5pbmRleE9mKFwiaW5mb1wiKSA9PT0gMCl7XG4gICAgICAgICAgICAgICAgY3VycmVudExpbmUgPSBsaW5lc1tpXS5zdWJzdHJpbmcoNSk7XG4gICAgICAgICAgICAgICAgYXR0ciA9IGdldEF0dHIoY3VycmVudExpbmUpO1xuXG4gICAgICAgICAgICAgICAgZGF0YS5mb250ID0gYXR0ci5mYWNlO1xuICAgICAgICAgICAgICAgIGRhdGEuc2l6ZSA9IHBhcnNlSW50KGF0dHIuc2l6ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKGxpbmVzW2ldLmluZGV4T2YoJ2NvbW1vbiAnKSA9PT0gMCl7XG4gICAgICAgICAgICAgICAgY3VycmVudExpbmUgPSBsaW5lc1tpXS5zdWJzdHJpbmcoNyk7XG4gICAgICAgICAgICAgICAgYXR0ciA9IGdldEF0dHIoY3VycmVudExpbmUpO1xuICAgICAgICAgICAgICAgIGRhdGEubGluZUhlaWdodCA9IHBhcnNlSW50KGF0dHIubGluZUhlaWdodCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKGxpbmVzW2ldLmluZGV4T2YoXCJjaGFyIFwiKSA9PT0gMCl7XG4gICAgICAgICAgICAgICAgY3VycmVudExpbmUgPSBsaW5lc1tpXS5zdWJzdHJpbmcoNSk7XG4gICAgICAgICAgICAgICAgYXR0ciA9IGdldEF0dHIoY3VycmVudExpbmUpO1xuICAgICAgICAgICAgICAgIHZhciBjaGFyQ29kZTpudW1iZXIgPSBwYXJzZUludChhdHRyLmlkKTtcblxuICAgICAgICAgICAgICAgIHZhciB0ZXh0dXJlUmVjdDpSZWN0YW5nbGUgPSBuZXcgUmVjdGFuZ2xlKFxuICAgICAgICAgICAgICAgICAgICBwYXJzZUludChhdHRyLngpLFxuICAgICAgICAgICAgICAgICAgICBwYXJzZUludChhdHRyLnkpLFxuICAgICAgICAgICAgICAgICAgICBwYXJzZUludChhdHRyLndpZHRoKSxcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VJbnQoYXR0ci5oZWlnaHQpXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIGRhdGEuY2hhcnNbY2hhckNvZGVdID0ge1xuICAgICAgICAgICAgICAgICAgICB4T2Zmc2V0OiBwYXJzZUludChhdHRyLnhvZmZzZXQpLFxuICAgICAgICAgICAgICAgICAgICB5T2Zmc2V0OiBwYXJzZUludChhdHRyLnlvZmZzZXQpLFxuICAgICAgICAgICAgICAgICAgICB4QWR2YW5jZTogcGFyc2VJbnQoYXR0ci54YWR2YW5jZSksXG4gICAgICAgICAgICAgICAgICAgIGtlcm5pbmc6IHt9LFxuICAgICAgICAgICAgICAgICAgICB0ZXh0dXJlOiBuZXcgVGV4dHVyZSh0ZXh0dXJlLmJhc2VUZXh0dXJlLCB0ZXh0dXJlUmVjdClcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihsaW5lc1tpXS5pbmRleE9mKCdrZXJuaW5nICcpID09PSAwKXtcbiAgICAgICAgICAgICAgICBjdXJyZW50TGluZSA9IGxpbmVzW2ldLnN1YnN0cmluZyg4KTtcbiAgICAgICAgICAgICAgICBhdHRyID0gZ2V0QXR0cihjdXJyZW50TGluZSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgZmlyc3QgPSBwYXJzZUludChhdHRyLmZpcnN0KTtcbiAgICAgICAgICAgICAgICB2YXIgc2Vjb25kID0gcGFyc2VJbnQoYXR0ci5zZWNvbmQpO1xuXG4gICAgICAgICAgICAgICAgZGF0YS5jaGFyc1tzZWNvbmRdLmtlcm5pbmdbZmlyc3RdID0gcGFyc2VJbnQoYXR0ci5hbW91bnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmVzb3VyY2UuYml0bWFwRm9udCA9IGRhdGE7XG4gICAgICAgIGV4dHJhcy5CaXRtYXBUZXh0LmZvbnRzW2RhdGEuZm9udF0gPSBkYXRhO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRpcm5hbWUocGF0aDpzdHJpbmcpOnN0cmluZ3tcbiAgICAgICAgcmV0dXJuIHBhdGgucmVwbGFjZSgvXFxcXC9nLCcvJykucmVwbGFjZSgvXFwvW15cXC9dKiQvLCAnJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0VGV4dHVyZVVybCh1cmw6c3RyaW5nLCBkYXRhOnN0cmluZyk6c3RyaW5ne1xuICAgICAgICB2YXIgdGV4dHVyZVVybDpzdHJpbmc7XG4gICAgICAgIHZhciBsaW5lczpzdHJpbmdbXSA9IGRhdGEuc3BsaXQoJ1xcbicpO1xuXG4gICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgaWYobGluZXNbaV0uaW5kZXhPZihcInBhZ2VcIikgPT09IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudExpbmU6c3RyaW5nID0gbGluZXNbaV0uc3Vic3RyaW5nKDUpO1xuICAgICAgICAgICAgICAgIHZhciBmaWxlOnN0cmluZyA9IChjdXJyZW50TGluZS5zdWJzdHJpbmcoY3VycmVudExpbmUuaW5kZXhPZignZmlsZT0nKSkpLnNwbGl0KCc9JylbMV07XG4gICAgICAgICAgICAgICAgdGV4dHVyZVVybCA9IHVybCArIGZpbGUuc3Vic3RyKDEsIGZpbGUubGVuZ3RoLTIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRleHR1cmVVcmw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0QXR0cihsaW5lOnN0cmluZyk6YXR0ckRhdGF7XG4gICAgICAgIHZhciByZWdleDpSZWdFeHAgPSAvXCIoXFx3KlxcZCpcXHMqKC18XykqKSpcIi9nLFxuICAgICAgICAgICAgYXR0cjpzdHJpbmdbXSA9IGxpbmUuc3BsaXQoL1xccysvZyksXG4gICAgICAgICAgICBkYXRhOmFueSA9IHt9O1xuXG4gICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgYXR0ci5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICB2YXIgZDpzdHJpbmdbXSA9IGF0dHJbaV0uc3BsaXQoJz0nKTtcbiAgICAgICAgICAgIHZhciBtOlJlZ0V4cE1hdGNoQXJyYXkgPSBkWzFdLm1hdGNoKHJlZ2V4KTtcbiAgICAgICAgICAgIGlmKG0gJiYgbS5sZW5ndGggPj0gMSl7XG4gICAgICAgICAgICAgICAgZFsxXSA9IGRbMV0uc3Vic3RyKDEsIGRbMV0ubGVuZ3RoLTIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGF0YVtkWzBdXSA9IGRbMV07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gPGF0dHJEYXRhPmRhdGE7XG4gICAgfVxuXG4gICAgaW50ZXJmYWNlIGZvbnREYXRhIHtcbiAgICAgICAgY2hhcnM/IDogYW55O1xuICAgICAgICBmb250PyA6IHN0cmluZztcbiAgICAgICAgc2l6ZT8gOiBudW1iZXI7XG4gICAgICAgIGxpbmVIZWlnaHQ/IDogbnVtYmVyO1xuICAgIH1cblxuICAgIGludGVyZmFjZSBhdHRyRGF0YSB7XG4gICAgICAgIGZhY2U/IDogc3RyaW5nO1xuICAgICAgICBzaXplPyA6IHN0cmluZztcbiAgICAgICAgbGluZUhlaWdodD8gOiBzdHJpbmc7XG4gICAgICAgIGlkPyA6IHN0cmluZztcbiAgICAgICAgeD8gOiBzdHJpbmc7XG4gICAgICAgIHk/IDogc3RyaW5nO1xuICAgICAgICB3aWR0aD8gOiBzdHJpbmc7XG4gICAgICAgIGhlaWdodD8gOiBzdHJpbmc7XG4gICAgICAgIHhvZmZzZXQ/IDogc3RyaW5nO1xuICAgICAgICB5b2Zmc2V0PyA6IHN0cmluZztcbiAgICAgICAgeGFkdmFuY2U/IDogc3RyaW5nO1xuICAgICAgICBmaXJzdD8gOiBzdHJpbmc7XG4gICAgICAgIHNlY29uZD8gOiBzdHJpbmc7XG4gICAgICAgIGFtb3VudD8gOiBzdHJpbmc7XG4gICAgfVxufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL2F1ZGlvL0F1ZGlvTWFuYWdlci50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9BdWRpby9BdWRpby50c1wiIC8+XG5tb2R1bGUgUElYSSB7XG4gICAgdmFyIF9hbGxvd2VkRXh0OnN0cmluZ1tdID0gW1wibTRhXCIsIFwib2dnXCIsIFwibXAzXCIsIFwid2F2XCJdO1xuXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGF1ZGlvUGFyc2VyKCk6RnVuY3Rpb24ge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24ocmVzb3VyY2U6bG9hZGVycy5SZXNvdXJjZSwgbmV4dDpGdW5jdGlvbik6dm9pZHtcbiAgICAgICAgICAgIGlmKCFEZXZpY2UuaXNBdWRpb1N1cHBvcnRlZCB8fCAhcmVzb3VyY2UuZGF0YSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5leHQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGV4dDpzdHJpbmcgPSBfZ2V0RXh0KHJlc291cmNlLnVybCk7XG5cbiAgICAgICAgICAgIGlmKF9hbGxvd2VkRXh0LmluZGV4T2YoZXh0KSA9PT0gLTEpe1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXh0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKCFfY2FuUGxheShleHQpKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV4dCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgbmFtZTpzdHJpbmcgPSByZXNvdXJjZS5uYW1lIHx8IHJlc291cmNlLnVybDtcbiAgICAgICAgICAgIGlmKHV0aWxzLl9hdWRpb1R5cGVTZWxlY3RlZCA9PT0gQVVESU9fVFlQRS5XRUJBVURJTyl7XG4gICAgICAgICAgICAgICAgRGV2aWNlLmdsb2JhbFdlYkF1ZGlvQ29udGV4dC5kZWNvZGVBdWRpb0RhdGEocmVzb3VyY2UuZGF0YSwgX2FkZFRvQ2FjaGUuYmluZCh0aGlzLCBuZXh0LCBuYW1lKSk7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICByZXR1cm4gX2FkZFRvQ2FjaGUobmV4dCwgbmFtZSwgcmVzb3VyY2UuZGF0YSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGV4cG9ydCBmdW5jdGlvbiBhdWRpb1BhcnNlclVybChyZXNvdXJjZVVybDpzdHJpbmdbXSk6c3RyaW5ne1xuICAgICAgICB2YXIgZXh0OnN0cmluZztcbiAgICAgICAgdmFyIHVybDpzdHJpbmc7XG4gICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgcmVzb3VyY2VVcmwubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgZXh0ID0gX2dldEV4dChyZXNvdXJjZVVybFtpXSk7XG5cbiAgICAgICAgICAgIGlmKF9hbGxvd2VkRXh0LmluZGV4T2YoZXh0KSA9PT0gLTEpe1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihfY2FuUGxheShleHQpKXtcbiAgICAgICAgICAgICAgICB1cmwgPSByZXNvdXJjZVVybFtpXTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB1cmw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2FkZFRvQ2FjaGUobmV4dDpGdW5jdGlvbiwgbmFtZTpzdHJpbmcsIGRhdGE6YW55KXtcbiAgICAgICAgdXRpbHMuQXVkaW9DYWNoZVtuYW1lXSA9IG5ldyBBdWRpbyhkYXRhLCBuYW1lKTtcbiAgICAgICAgcmV0dXJuIG5leHQoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfZ2V0RXh0KHVybDpzdHJpbmcpOnN0cmluZ3tcbiAgICAgICAgcmV0dXJuIHVybC5zcGxpdCgnPycpLnNoaWZ0KCkuc3BsaXQoJy4nKS5wb3AoKS50b0xvd2VyQ2FzZSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9jYW5QbGF5KGV4dDpzdHJpbmcpOmJvb2xlYW57XG4gICAgICAgIHZhciBkZXZpY2VDYW5QbGF5OmJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgc3dpdGNoKGV4dCl7XG4gICAgICAgICAgICBjYXNlIFwibTRhXCI6ZGV2aWNlQ2FuUGxheSA9IERldmljZS5pc000YVN1cHBvcnRlZDsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwibXAzXCI6ZGV2aWNlQ2FuUGxheSA9IERldmljZS5pc01wM1N1cHBvcnRlZDsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwib2dnXCI6ZGV2aWNlQ2FuUGxheSA9IERldmljZS5pc09nZ1N1cHBvcnRlZDsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwid2F2XCI6ZGV2aWNlQ2FuUGxheSA9IERldmljZS5pc1dhdlN1cHBvcnRlZDsgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRldmljZUNhblBsYXk7XG4gICAgfVxufVxuIiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vZGVmcy9waXhpLmpzLmQudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi9jb25zdC50c1wiIC8+XG5tb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IG1vZHVsZSB1dGlscyB7XG4gICAgICAgIGV4cG9ydCB2YXIgX2F1ZGlvVHlwZVNlbGVjdGVkOm51bWJlciA9IEFVRElPX1RZUEUuV0VCQVVESU87XG4gICAgICAgIGV4cG9ydCB2YXIgQXVkaW9DYWNoZTphbnkgPSB7fTtcbiAgICB9XG59IiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vZGVmcy9waXhpLmpzLmQudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vY29yZS9jb25zdC50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuL2JpdG1hcEZvbnRQYXJzZXJUeHQudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi9hdWRpb1BhcnNlci50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9jb3JlL1V0aWxzLnRzXCIgLz5cbm1vZHVsZSBQSVhJIHtcbiAgICBleHBvcnQgbW9kdWxlIGxvYWRlcnN7XG4gICAgICAgIExvYWRlci5hZGRQaXhpTWlkZGxld2FyZShiaXRtYXBGb250UGFyc2VyVFhUKTtcbiAgICAgICAgTG9hZGVyLmFkZFBpeGlNaWRkbGV3YXJlKGF1ZGlvUGFyc2VyKTtcblxuICAgICAgICBjbGFzcyBUdXJib0xvYWRlciBleHRlbmRzIExvYWRlciB7XG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihiYXNlVXJsOiBzdHJpbmcsIGFzc2V0Q29uY3VycmVuY3k6IG51bWJlcil7XG4gICAgICAgICAgICAgICAgc3VwZXIoYmFzZVVybCwgYXNzZXRDb25jdXJyZW5jeSk7XG4gICAgICAgICAgICAgICAgaWYoRGV2aWNlLmlzQXVkaW9TdXBwb3J0ZWQpe1xuICAgICAgICAgICAgICAgICAgICBfY2hlY2tBdWRpb1R5cGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGFkZChuYW1lOmFueSwgdXJsPzphbnkgLG9wdGlvbnM/OmFueSwgY2I/OmFueSk6TG9hZGVye1xuICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBuYW1lID09PSAnb2JqZWN0Jyl7XG4gICAgICAgICAgICAgICAgICAgIGlmKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChuYW1lLnVybCkgPT09IFwiW29iamVjdCBBcnJheV1cIil7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lLnVybCA9IGF1ZGlvUGFyc2VyVXJsKG5hbWUudXJsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh1cmwpID09PSBcIltvYmplY3QgQXJyYXldXCIpe1xuICAgICAgICAgICAgICAgICAgICB1cmwgPSBhdWRpb1BhcnNlclVybCh1cmwpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBzdXBlci5hZGQobmFtZSwgdXJsLCBvcHRpb25zLCBjYik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsb2FkZXJzLkxvYWRlciA9IFR1cmJvTG9hZGVyO1xuXG5cbiAgICAgICAgZnVuY3Rpb24gX2NoZWNrQXVkaW9UeXBlKCk6dm9pZHtcbiAgICAgICAgICAgIGlmKERldmljZS5pc01wM1N1cHBvcnRlZClfc2V0QXVkaW9FeHQoXCJtcDNcIik7XG4gICAgICAgICAgICBpZihEZXZpY2UuaXNPZ2dTdXBwb3J0ZWQpX3NldEF1ZGlvRXh0KFwib2dnXCIpO1xuICAgICAgICAgICAgaWYoRGV2aWNlLmlzV2F2U3VwcG9ydGVkKV9zZXRBdWRpb0V4dChcIndhdlwiKTtcbiAgICAgICAgICAgIGlmKERldmljZS5pc000YVN1cHBvcnRlZClfc2V0QXVkaW9FeHQoXCJtNGFcIik7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBfc2V0QXVkaW9FeHQoZXh0OnN0cmluZyk6dm9pZCB7XG4gICAgICAgICAgICBpZih1dGlscy5fYXVkaW9UeXBlU2VsZWN0ZWQgPT09IEFVRElPX1RZUEUuV0VCQVVESU8pe1xuICAgICAgICAgICAgICAgIFJlc291cmNlLnNldEV4dGVuc2lvblhoclR5cGUoZXh0LCBSZXNvdXJjZS5YSFJfUkVTUE9OU0VfVFlQRS5CVUZGRVIpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgUmVzb3VyY2Uuc2V0RXh0ZW5zaW9uTG9hZFR5cGUoZXh0LCBSZXNvdXJjZS5MT0FEX1RZUEUuQVVESU8pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSIsIm1vZHVsZSBQSVhJIHtcbiAgICBleHBvcnQgY2xhc3MgRGF0YU1hbmFnZXJ7XG4gICAgICAgIHByaXZhdGUgX2RhdGE6YW55O1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgaWQ6c3RyaW5nLCBwdWJsaWMgdXNlUGVyc2lzdGFudERhdGE6Ym9vbGVhbiA9IGZhbHNlKXtcbiAgICAgICAgICAgIHRoaXMubG9hZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgbG9hZCgpOkRhdGFNYW5hZ2Vye1xuICAgICAgICAgICAgdGhpcy5fZGF0YSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5pZCkpIHx8IHt9O1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBzYXZlKCk6RGF0YU1hbmFnZXJ7XG4gICAgICAgICAgICBpZih0aGlzLnVzZVBlcnNpc3RhbnREYXRhKXtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLmlkLCBKU09OLnN0cmluZ2lmeSh0aGlzLl9kYXRhKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc2V0KCk6RGF0YU1hbmFnZXJ7XG4gICAgICAgICAgICB0aGlzLl9kYXRhID0ge307XG4gICAgICAgICAgICB0aGlzLnNhdmUoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0KGtleTpzdHJpbmcgfCBPYmplY3QsIHZhbHVlPzphbnkpOkRhdGFNYW5hZ2Vye1xuICAgICAgICAgICAgaWYoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGtleSkgPT09IFwiW29iamVjdCBPYmplY3RdXCIpe1xuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24odGhpcy5fZGF0YSwga2V5KTtcbiAgICAgICAgICAgIH1lbHNlIGlmKHR5cGVvZiBrZXkgPT09IFwic3RyaW5nXCIpe1xuICAgICAgICAgICAgICAgIHRoaXMuX2RhdGFba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnNhdmUoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0KGtleT86c3RyaW5nKTphbnl7XG4gICAgICAgICAgICBpZigha2V5KXtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZGF0YTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGFba2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRlbChrZXk6c3RyaW5nKTpEYXRhTWFuYWdlcntcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9kYXRhW2tleV07XG4gICAgICAgICAgICB0aGlzLnNhdmUoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICB9XG59IiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vZGVmcy9waXhpLmpzLmQudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi9jb25zdC50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuL0RldmljZS50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9kaXNwbGF5L1NjZW5lLnRzXCIgLz5cbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL2F1ZGlvL0F1ZGlvTWFuYWdlci50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9pbnB1dC9JbnB1dE1hbmFnZXIudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vbG9hZGVyL0xvYWRlci50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuL0RhdGFNYW5hZ2VyLnRzXCIgLz5cbm1vZHVsZSBQSVhJIHtcbiAgICB2YXIgbGFzdDpudW1iZXIgPSAwO1xuICAgIHZhciBtYXhGcmFtZU1TID0gMC4zNTtcblxuICAgIHZhciBkZWZhdWx0R2FtZUNvbmZpZyA6IEdhbWVDb25maWcgPSB7XG4gICAgICAgIGlkOiBcInBpeGkuZGVmYXVsdC5pZFwiLFxuICAgICAgICB3aWR0aDo4MDAsXG4gICAgICAgIGhlaWdodDo2MDAsXG4gICAgICAgIHVzZVdlYkF1ZGlvOiB0cnVlLFxuICAgICAgICB1c2VQZXJzaXN0YW50RGF0YTogZmFsc2UsXG4gICAgICAgIGdhbWVTY2FsZVR5cGU6IEdBTUVfU0NBTEVfVFlQRS5OT05FLFxuICAgICAgICBzdG9wQXRMb3N0Rm9jdXM6IHRydWUsXG4gICAgICAgIGFzc2V0c1VybDogXCIuL1wiLFxuICAgICAgICBsb2FkZXJDb25jdXJyZW5jeTogMTAsXG4gICAgICAgIGF1ZGlvQ2hhbm5lbExpbmVzOiAxMCxcbiAgICAgICAgc291bmRDaGFubmVsTGluZXM6IDEwLFxuICAgICAgICBtdXNpY0NoYW5uZWxMaW5lczogMSxcbiAgICAgICAgekluZGV4RW5hYmxlZDogekluZGV4RW5hYmxlZFxuICAgIH07XG5cbiAgICBleHBvcnQgY2xhc3MgR2FtZSB7XG4gICAgICAgIGlkOnN0cmluZztcbiAgICAgICAgcmFmOmFueTtcblxuICAgICAgICBwcml2YXRlIF9zY2VuZXM6U2NlbmVbXSA9IFtdO1xuICAgICAgICBzY2VuZTpTY2VuZTtcblxuICAgICAgICBhdWRpbzpBdWRpb01hbmFnZXI7XG4gICAgICAgIGlucHV0OklucHV0TWFuYWdlcjtcbiAgICAgICAgZGF0YTpEYXRhTWFuYWdlcjtcbiAgICAgICAgbG9hZGVyOmxvYWRlcnMuTG9hZGVyO1xuXG4gICAgICAgIHJlbmRlcmVyOldlYkdMUmVuZGVyZXIgfCBDYW52YXNSZW5kZXJlcjtcbiAgICAgICAgY2FudmFzOkhUTUxDYW52YXNFbGVtZW50O1xuXG4gICAgICAgIGRlbHRhOm51bWJlciA9IDA7XG4gICAgICAgIHRpbWU6bnVtYmVyID0gMDtcbiAgICAgICAgbGFzdFRpbWU6bnVtYmVyID0gMDtcblxuICAgICAgICBpc1dlYkdMOmJvb2xlYW47XG4gICAgICAgIGlzV2ViQXVkaW86Ym9vbGVhbjtcblxuICAgICAgICBwcml2YXRlIF9yZXNpemVMaXN0ZW5lcjphbnk7XG5cbiAgICAgICAgY29uc3RydWN0b3IoY29uZmlnPzpHYW1lQ29uZmlnLCByZW5kZXJlck9wdGlvbnM/OlJlbmRlcmVyT3B0aW9ucykge1xuICAgICAgICAgICAgY29uZmlnID0gKDxPYmplY3Q+T2JqZWN0KS5hc3NpZ24oZGVmYXVsdEdhbWVDb25maWcsIGNvbmZpZyk7XG4gICAgICAgICAgICB0aGlzLmlkID0gY29uZmlnLmlkO1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJlciA9IGF1dG9EZXRlY3RSZW5kZXJlcihjb25maWcud2lkdGgsIGNvbmZpZy5oZWlnaHQsIHJlbmRlcmVyT3B0aW9ucyk7XG4gICAgICAgICAgICB0aGlzLmNhbnZhcyA9IHRoaXMucmVuZGVyZXIudmlldztcblxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XG5cbiAgICAgICAgICAgIHRoaXMuaXNXZWJHTCA9ICh0aGlzLnJlbmRlcmVyLnR5cGUgPT09IFJFTkRFUkVSX1RZUEUuV0VCR0wpO1xuICAgICAgICAgICAgdGhpcy5pc1dlYkF1ZGlvID0gKERldmljZS5pc0F1ZGlvU3VwcG9ydGVkJiZEZXZpY2UuaXNXZWJBdWRpb1N1cHBvcnRlZCYmY29uZmlnLnVzZVdlYkF1ZGlvKTtcbiAgICAgICAgICAgIHV0aWxzLl9hdWRpb1R5cGVTZWxlY3RlZCA9IHRoaXMuaXNXZWJBdWRpbyA/IEFVRElPX1RZUEUuV0VCQVVESU8gOiBBVURJT19UWVBFLkhUTUxBVURJTztcbiAgICAgICAgICAgIHpJbmRleEVuYWJsZWQgPSBjb25maWcuekluZGV4RW5hYmxlZDtcblxuICAgICAgICAgICAgdGhpcy5pbnB1dCA9IG5ldyBJbnB1dE1hbmFnZXIodGhpcyk7XG4gICAgICAgICAgICB0aGlzLmF1ZGlvID0gbmV3IEF1ZGlvTWFuYWdlcihjb25maWcuYXVkaW9DaGFubmVsTGluZXMsIGNvbmZpZy5zb3VuZENoYW5uZWxMaW5lcywgY29uZmlnLm11c2ljQ2hhbm5lbExpbmVzKTtcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IG5ldyBEYXRhTWFuYWdlcih0aGlzLmlkLCBjb25maWcudXNlUGVyc2lzdGFudERhdGEpO1xuICAgICAgICAgICAgdGhpcy5sb2FkZXIgPSBuZXcgbG9hZGVycy5Mb2FkZXIoY29uZmlnLmFzc2V0c1VybCwgY29uZmlnLmxvYWRlckNvbmN1cnJlbmN5KTtcblxuICAgICAgICAgICAgdmFyIGluaXRpYWxTY2VuZTpTY2VuZSA9IG5ldyBTY2VuZSgnaW5pdGlhbCcpLmFkZFRvKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5zZXRTY2VuZShpbml0aWFsU2NlbmUpO1xuXG4gICAgICAgICAgICBpZihjb25maWcuZ2FtZVNjYWxlVHlwZSAhPT0gR0FNRV9TQ0FMRV9UWVBFLk5PTkUpe1xuICAgICAgICAgICAgICAgIHRoaXMuYXV0b1Jlc2l6ZShjb25maWcuZ2FtZVNjYWxlVHlwZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKGNvbmZpZy5zdG9wQXRMb3N0Rm9jdXMpe1xuICAgICAgICAgICAgICAgIHRoaXMuZW5hYmxlU3RvcEF0TG9zdEZvY3VzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9hbmltYXRlKCk6dm9pZCB7XG4gICAgICAgICAgICB0aGlzLnJhZiA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5fYW5pbWF0ZS5iaW5kKHRoaXMpKTtcblxuICAgICAgICAgICAgaWYodGhpcy5zY2VuZSkge1xuICAgICAgICAgICAgICAgIHZhciBub3c6bnVtYmVyID0gRGF0ZS5ub3coKTtcblxuICAgICAgICAgICAgICAgIHRoaXMudGltZSArPSBNYXRoLm1pbigobm93IC0gbGFzdCkgLyAxMDAwLCBtYXhGcmFtZU1TKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRlbHRhID0gdGhpcy50aW1lIC0gdGhpcy5sYXN0VGltZTtcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RUaW1lID0gdGhpcy50aW1lO1xuXG4gICAgICAgICAgICAgICAgbGFzdCA9IG5vdztcblxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIucmVuZGVyKHRoaXMuc2NlbmUpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGUodGhpcy5kZWx0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB1cGRhdGUoZGVsdGFUaW1lOm51bWJlcik6R2FtZSB7XG4gICAgICAgICAgICB0aGlzLnNjZW5lLnVwZGF0ZSh0aGlzLmRlbHRhKTtcblxuICAgICAgICAgICAgLy9jbGVhbiBraWxsZWQgb2JqZWN0c1xuICAgICAgICAgICAgdmFyIGxlbjpudW1iZXIgPSBDb250YWluZXIuX2tpbGxlZE9iamVjdHMubGVuZ3RoO1xuICAgICAgICAgICAgaWYgKGxlbikge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGk6bnVtYmVyID0gMDsgaSA8IGxlbjsgaSsrKSBDb250YWluZXIuX2tpbGxlZE9iamVjdHNbaV0ucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgQ29udGFpbmVyLl9raWxsZWRPYmplY3RzLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhcnQoKTpHYW1lIHtcbiAgICAgICAgICAgIGxhc3QgPSBEYXRlLm5vdygpO1xuICAgICAgICAgICAgdGhpcy5fYW5pbWF0ZSgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBzdG9wKCk6R2FtZSB7XG4gICAgICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5yYWYpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBlbmFibGVTdG9wQXRMb3N0Rm9jdXMoc3RhdGU6Ym9vbGVhbiA9IHRydWUpOkdhbWV7XG4gICAgICAgICAgICBpZihzdGF0ZSl7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihEZXZpY2UuZ2V0VmlzaWJpbGl0eUNoYW5nZUV2ZW50KCksIHRoaXMuX29uVmlzaWJpbGl0eUNoYW5nZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoRGV2aWNlLmdldFZpc2liaWxpdHlDaGFuZ2VFdmVudCgpLCB0aGlzLl9vblZpc2liaWxpdHlDaGFuZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBkaXNhYmxlU3RvcEF0TG9zdEZvY3VzKCk6R2FtZXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVuYWJsZVN0b3BBdExvc3RGb2N1cyhmYWxzZSk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9vblZpc2liaWxpdHlDaGFuZ2UoKXtcbiAgICAgICAgICAgIHZhciBpc0hpZGUgPSAhIShkb2N1bWVudC5oaWRkZW4gfHwgZG9jdW1lbnQud2Via2l0SGlkZGVuIHx8IGRvY3VtZW50Lm1vekhpZGRlbiB8fCBkb2N1bWVudC5tc0hpZGRlbik7XG4gICAgICAgICAgICBpZihpc0hpZGUpe1xuICAgICAgICAgICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLm9uTG9zdEZvY3VzKGlzSGlkZSk7XG4gICAgICAgIH1cblxuICAgICAgICBvbkxvc3RGb2N1cyhpc0hpZGU6Ym9vbGVhbik6R2FtZXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0U2NlbmUoc2NlbmU6U2NlbmUgfCBzdHJpbmcpOkdhbWUge1xuICAgICAgICAgICAgaWYoIShzY2VuZSBpbnN0YW5jZW9mIFNjZW5lKSl7XG4gICAgICAgICAgICAgICAgc2NlbmUgPSB0aGlzLmdldFNjZW5lKDxzdHJpbmc+c2NlbmUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnNjZW5lID0gPFNjZW5lPnNjZW5lO1xuICAgICAgICAgICAgdGhpcy5zY2VuZS5wb3NpdGlvbi5zZXQodGhpcy53aWR0aC8yLCB0aGlzLmhlaWdodC8yKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0U2NlbmUoaWQ6c3RyaW5nKTpTY2VuZXtcbiAgICAgICAgICAgIHZhciBzY2VuZTpTY2VuZSA9IG51bGw7XG4gICAgICAgICAgICBmb3IodmFyIGk6bnVtYmVyID0gMDsgaSA8IHRoaXMuX3NjZW5lcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5fc2NlbmVzW2ldLmlkID09PSBpZCl7XG4gICAgICAgICAgICAgICAgICAgIHNjZW5lID0gdGhpcy5fc2NlbmVzW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHNjZW5lO1xuICAgICAgICB9XG5cbiAgICAgICAgY3JlYXRlU2NlbmUoaWQ/OnN0cmluZyk6U2NlbmUge1xuICAgICAgICAgICAgcmV0dXJuIChuZXcgU2NlbmUoaWQpKS5hZGRUbyh0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZVNjZW5lKHNjZW5lOnN0cmluZyB8IFNjZW5lKTpHYW1le1xuICAgICAgICAgICAgaWYodHlwZW9mIHNjZW5lID09PSBcInN0cmluZ1wiKXtcbiAgICAgICAgICAgICAgICBzY2VuZSA9IHRoaXMuZ2V0U2NlbmUoPHN0cmluZz5zY2VuZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBpbmRleDpudW1iZXIgPSB0aGlzLl9zY2VuZXMuaW5kZXhPZig8U2NlbmU+c2NlbmUpO1xuICAgICAgICAgICAgaWYoaW5kZXggIT09IC0xKXtcbiAgICAgICAgICAgICAgICB0aGlzLl9zY2VuZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBhZGRTY2VuZShzY2VuZTpTY2VuZSk6R2FtZSB7XG4gICAgICAgICAgICB0aGlzLl9zY2VuZXMucHVzaChzY2VuZSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZUFsbFNjZW5lcygpOkdhbWV7XG4gICAgICAgICAgICB0aGlzLl9zY2VuZXMubGVuZ3RoID0gMDtcbiAgICAgICAgICAgIHRoaXMuc2NlbmUgPSBudWxsO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICByZXNpemUod2lkdGg6bnVtYmVyLCBoZWlnaHQ6bnVtYmVyLCByZW5kZXJlcjpib29sZWFuID0gZmFsc2UpOkdhbWV7XG4gICAgICAgICAgICBpZihyZW5kZXJlcil7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5yZXNpemUod2lkdGgsIGhlaWdodCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLndpZHRoID0gd2lkdGggKyBcInB4XCI7XG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyBcInB4XCI7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgYXV0b1Jlc2l6ZShtb2RlOm51bWJlcik6R2FtZSB7XG4gICAgICAgICAgICBpZih0aGlzLl9yZXNpemVMaXN0ZW5lcil7XG4gICAgICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX3Jlc2l6ZUxpc3RlbmVyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYobW9kZSA9PT0gR0FNRV9TQ0FMRV9UWVBFLk5PTkUpcmV0dXJuO1xuXG4gICAgICAgICAgICBzd2l0Y2gobW9kZSl7XG4gICAgICAgICAgICAgICAgY2FzZSBHQU1FX1NDQUxFX1RZUEUuQVNQRUNUX0ZJVDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVzaXplTGlzdGVuZXIgPSB0aGlzLl9yZXNpemVNb2RlQXNwZWN0Rml0O1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIEdBTUVfU0NBTEVfVFlQRS5BU1BFQ1RfRklMTDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVzaXplTGlzdGVuZXIgPSB0aGlzLl9yZXNpemVNb2RlQXNwZWN0RmlsbDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBHQU1FX1NDQUxFX1RZUEUuRklMTDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVzaXplTGlzdGVuZXIgPSB0aGlzLl9yZXNpemVNb2RlRmlsbDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl9yZXNpemVMaXN0ZW5lci5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIHRoaXMuX3Jlc2l6ZUxpc3RlbmVyKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX3Jlc2l6ZU1vZGVBc3BlY3RGaXQoKTp2b2lke1xuICAgICAgICAgICAgdmFyIHd3Om51bWJlciA9IHBhcnNlSW50KHRoaXMuY2FudmFzLnN0eWxlLndpZHRoLCAxMCkgfHwgdGhpcy5jYW52YXMud2lkdGg7XG4gICAgICAgICAgICB2YXIgaGg6bnVtYmVyID0gcGFyc2VJbnQodGhpcy5jYW52YXMuc3R5bGUuaGVpZ2h0LCAxMCkgfHwgdGhpcy5jYW52YXMuaGVpZ2h0O1xuICAgICAgICAgICAgaWYod2luZG93LmlubmVyV2lkdGggIT09IHd3IHx8IHdpbmRvdy5pbm5lckhlaWdodCAhPT0gaGgpe1xuICAgICAgICAgICAgICAgIHZhciBzY2FsZTpudW1iZXIgPSBNYXRoLm1pbih3aW5kb3cuaW5uZXJXaWR0aC90aGlzLndpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQvdGhpcy5oZWlnaHQpO1xuICAgICAgICAgICAgICAgIHRoaXMucmVzaXplKHRoaXMud2lkdGgqc2NhbGUsIHRoaXMuaGVpZ2h0KnNjYWxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX3Jlc2l6ZU1vZGVBc3BlY3RGaWxsKCk6dm9pZHtcbiAgICAgICAgICAgIHZhciB3dzpudW1iZXIgPSBwYXJzZUludCh0aGlzLmNhbnZhcy5zdHlsZS53aWR0aCwgMTApIHx8IHRoaXMuY2FudmFzLndpZHRoO1xuICAgICAgICAgICAgdmFyIGhoOm51bWJlciA9IHBhcnNlSW50KHRoaXMuY2FudmFzLnN0eWxlLmhlaWdodCwgMTApIHx8IHRoaXMuY2FudmFzLmhlaWdodDtcbiAgICAgICAgICAgIGlmKHdpbmRvdy5pbm5lcldpZHRoICE9PSB3dyB8fCB3aW5kb3cuaW5uZXJIZWlnaHQgIT09IGhoKXtcbiAgICAgICAgICAgICAgICB2YXIgc2NhbGU6bnVtYmVyID0gTWF0aC5tYXgod2luZG93LmlubmVyV2lkdGgvdGhpcy53aWR0aCwgd2luZG93LmlubmVySGVpZ2h0L3RoaXMuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICB2YXIgd2lkdGg6bnVtYmVyID0gdGhpcy53aWR0aCpzY2FsZTtcbiAgICAgICAgICAgICAgICB2YXIgaGVpZ2h0Om51bWJlciA9IHRoaXMuaGVpZ2h0KnNjYWxlO1xuXG4gICAgICAgICAgICAgICAgdmFyIHRvcE1hcmdpbjpudW1iZXIgPSAod2luZG93LmlubmVySGVpZ2h0LWhlaWdodCkvMjtcbiAgICAgICAgICAgICAgICB2YXIgbGVmdE1hcmdpbjpudW1iZXIgPSAod2luZG93LmlubmVyV2lkdGgtd2lkdGgpLzI7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnJlc2l6ZSh3aWR0aCwgaGVpZ2h0KTtcblxuICAgICAgICAgICAgICAgIHZhciBzdHlsZTphbnkgPSA8YW55PnRoaXMuY2FudmFzLnN0eWxlO1xuICAgICAgICAgICAgICAgIHN0eWxlWydtYXJnaW4tdG9wJ10gPSB0b3BNYXJnaW4gKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgc3R5bGVbJ21hcmdpbi1sZWZ0J10gPSBsZWZ0TWFyZ2luICsgXCJweFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfcmVzaXplTW9kZUZpbGwoKTp2b2lke1xuICAgICAgICAgICAgdmFyIHd3Om51bWJlciA9IHBhcnNlSW50KHRoaXMuY2FudmFzLnN0eWxlLndpZHRoLCAxMCkgfHwgdGhpcy5jYW52YXMud2lkdGg7XG4gICAgICAgICAgICB2YXIgaGg6bnVtYmVyID0gcGFyc2VJbnQodGhpcy5jYW52YXMuc3R5bGUuaGVpZ2h0LCAxMCkgfHwgdGhpcy5jYW52YXMuaGVpZ2h0O1xuICAgICAgICAgICAgaWYod2luZG93LmlubmVyV2lkdGggIT09IHd3IHx8IHdpbmRvdy5pbm5lckhlaWdodCAhPT0gaGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGdldCB3aWR0aCgpOm51bWJlciB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJlci53aWR0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBoZWlnaHQoKTpudW1iZXIge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyZXIuaGVpZ2h0O1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIEdhbWVDb25maWcge1xuICAgICAgICBpZD86c3RyaW5nO1xuICAgICAgICB3aWR0aD86bnVtYmVyO1xuICAgICAgICBoZWlnaHQ/Om51bWJlcjtcbiAgICAgICAgdXNlV2ViQXVkaW8/OmJvb2xlYW47XG4gICAgICAgIHVzZVBlcnNpc3RhbnREYXRhPzpib29sZWFuO1xuICAgICAgICBnYW1lU2NhbGVUeXBlPzpudW1iZXI7XG4gICAgICAgIHN0b3BBdExvc3RGb2N1cz86Ym9vbGVhbjtcbiAgICAgICAgYXNzZXRzVXJsPzpzdHJpbmc7XG4gICAgICAgIGxvYWRlckNvbmN1cnJlbmN5PzpudW1iZXI7XG4gICAgICAgIGF1ZGlvQ2hhbm5lbExpbmVzPzpudW1iZXI7XG4gICAgICAgIHNvdW5kQ2hhbm5lbExpbmVzPzpudW1iZXI7XG4gICAgICAgIG11c2ljQ2hhbm5lbExpbmVzPzpudW1iZXI7XG4gICAgICAgIHpJbmRleEVuYWJsZWQ/OmJvb2xlYW47XG4gICAgfVxufVxuXG5pbnRlcmZhY2UgT2JqZWN0IHtcbiAgICBhc3NpZ24odGFyZ2V0Ok9iamVjdCwgLi4uc291cmNlczpPYmplY3RbXSk6T2JqZWN0O1xufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4vQXVkaW9MaW5lLnRzXCIgLz5cbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL2NvcmUvR2FtZS50c1wiIC8+XG5tb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IGNsYXNzIEF1ZGlvTWFuYWdlcntcbiAgICAgICAgc291bmRMaW5lczpBdWRpb0xpbmVbXSA9IFtdO1xuICAgICAgICBtdXNpY0xpbmVzOkF1ZGlvTGluZVtdID0gW107XG4gICAgICAgIG5vcm1hbExpbmVzOkF1ZGlvTGluZVtdID0gW107XG4gICAgICAgIHByaXZhdGUgX3RlbXBMaW5lczpBdWRpb0xpbmVbXSA9IFtdO1xuXG4gICAgICAgIG11c2ljTXV0ZWQ6Ym9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBzb3VuZE11dGVkOmJvb2xlYW4gPSBmYWxzZTtcblxuICAgICAgICBjb250ZXh0OkF1ZGlvQ29udGV4dDtcbiAgICAgICAgZ2Fpbk5vZGU6QXVkaW9Ob2RlO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYXVkaW9DaGFubmVsTGluZXM6bnVtYmVyID0gMTAsIHByaXZhdGUgc291bmRDaGFubmVsTGluZXM6bnVtYmVyID0gMTAsIHByaXZhdGUgbXVzaWNDaGFubmVsTGluZXM6bnVtYmVyID0gMSl7XG4gICAgICAgICAgICBpZih1dGlscy5fYXVkaW9UeXBlU2VsZWN0ZWQgPT09IEFVRElPX1RZUEUuV0VCQVVESU8pIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQgPSBEZXZpY2UuZ2xvYmFsV2ViQXVkaW9Db250ZXh0O1xuICAgICAgICAgICAgICAgIHRoaXMuZ2Fpbk5vZGUgPSB0aGlzLmNyZWF0ZUdhaW5Ob2RlKHRoaXMuY29udGV4dCk7XG4gICAgICAgICAgICAgICAgdGhpcy5nYWluTm9kZS5jb25uZWN0KHRoaXMuY29udGV4dC5kZXN0aW5hdGlvbik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBpOm51bWJlcjtcbiAgICAgICAgICAgIGZvcihpID0gMDsgaSA8IHRoaXMuYXVkaW9DaGFubmVsTGluZXM7IGkrKyl7XG4gICAgICAgICAgICAgICAgdGhpcy5ub3JtYWxMaW5lcy5wdXNoKG5ldyBBdWRpb0xpbmUodGhpcykpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCB0aGlzLnNvdW5kQ2hhbm5lbExpbmVzOyBpKyspe1xuICAgICAgICAgICAgICAgIHRoaXMuc291bmRMaW5lcy5wdXNoKG5ldyBBdWRpb0xpbmUodGhpcykpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCB0aGlzLm11c2ljQ2hhbm5lbExpbmVzOyBpKyspe1xuICAgICAgICAgICAgICAgIHRoaXMubXVzaWNMaW5lcy5wdXNoKG5ldyBBdWRpb0xpbmUodGhpcykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZ2V0QXVkaW8oaWQ6c3RyaW5nKTpBdWRpb3tcbiAgICAgICAgICAgIHZhciBhdWRpbzpBdWRpbyA9IHV0aWxzLkF1ZGlvQ2FjaGVbaWRdO1xuICAgICAgICAgICAgYXVkaW8ubWFuYWdlciA9IHRoaXM7XG4gICAgICAgICAgICByZXR1cm4gYXVkaW87XG4gICAgICAgIH1cblxuICAgICAgICBwYXVzZUFsbExpbmVzKCk6QXVkaW9NYW5hZ2VyIHtcbiAgICAgICAgICAgIHRoaXMucGF1c2VNdXNpYygpO1xuICAgICAgICAgICAgdGhpcy5wYXVzZVNvdW5kKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc3VtZUFsbExpbmVzKCk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgdGhpcy5yZXN1bWVNdXNpYygpO1xuICAgICAgICAgICAgdGhpcy5yZXN1bWVTb3VuZCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwbGF5KGlkOnN0cmluZywgbG9vcD86Ym9vbGVhbnxGdW5jdGlvbiwgY2FsbGJhY2s/OkZ1bmN0aW9uKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICBpZih0eXBlb2YgbG9vcCA9PT0gXCJmdW5jdGlvblwiKXtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayA9IDxGdW5jdGlvbj5sb29wO1xuICAgICAgICAgICAgICAgIGxvb3AgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wbGF5KGlkLCB0aGlzLm5vcm1hbExpbmVzLCA8Ym9vbGVhbj5sb29wLCBjYWxsYmFjayk7XG4gICAgICAgIH1cblxuICAgICAgICBwbGF5TXVzaWMoaWQ6c3RyaW5nLCBsb29wPzpib29sZWFufEZ1bmN0aW9uLCBjYWxsYmFjaz86RnVuY3Rpb24pOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIGlmKHR5cGVvZiBsb29wID09PSBcImZ1bmN0aW9uXCIpe1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrID0gPEZ1bmN0aW9uPmxvb3A7XG4gICAgICAgICAgICAgICAgbG9vcCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BsYXkoaWQsIHRoaXMubXVzaWNMaW5lcywgPGJvb2xlYW4+bG9vcCwgY2FsbGJhY2spO1xuICAgICAgICB9XG5cbiAgICAgICAgcGxheVNvdW5kKGlkOnN0cmluZywgbG9vcD86Ym9vbGVhbnxGdW5jdGlvbiwgY2FsbGJhY2s/OkZ1bmN0aW9uKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICBpZih0eXBlb2YgbG9vcCA9PT0gXCJmdW5jdGlvblwiKXtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayA9IDxGdW5jdGlvbj5sb29wO1xuICAgICAgICAgICAgICAgIGxvb3AgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wbGF5KGlkLCB0aGlzLnNvdW5kTGluZXMsIDxib29sZWFuPmxvb3AsIGNhbGxiYWNrKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0b3AoaWQ/OnN0cmluZyk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N0b3AoaWQsIHRoaXMubm9ybWFsTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RvcE11c2ljKGlkPzpzdHJpbmcpOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdG9wKGlkLCB0aGlzLm11c2ljTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RvcFNvdW5kKGlkPzpzdHJpbmcpOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdG9wKGlkLCB0aGlzLnNvdW5kTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcGF1c2UoaWQ/OnN0cmluZyk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BhdXNlKGlkLCB0aGlzLm5vcm1hbExpbmVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBhdXNlTXVzaWMoaWQ/OnN0cmluZyk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BhdXNlKGlkLCB0aGlzLm11c2ljTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcGF1c2VTb3VuZChpZD86c3RyaW5nKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGF1c2UoaWQsIHRoaXMuc291bmRMaW5lcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXN1bWUoaWQ/OnN0cmluZyk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Jlc3VtZShpZCwgdGhpcy5ub3JtYWxMaW5lcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXN1bWVNdXNpYyhpZD86c3RyaW5nKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVzdW1lKGlkLCB0aGlzLm11c2ljTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzdW1lU291bmQoaWQ/OnN0cmluZyk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Jlc3VtZShpZCwgdGhpcy5zb3VuZExpbmVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG11dGUoaWQ/OnN0cmluZyk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX211dGUoaWQsIHRoaXMubm9ybWFsTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgbXV0ZU11c2ljKGlkPzpzdHJpbmcpOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tdXRlKGlkLCB0aGlzLm11c2ljTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgbXV0ZVNvdW5kKGlkPzpzdHJpbmcpOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tdXRlKGlkLCB0aGlzLnNvdW5kTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdW5tdXRlKGlkPzpzdHJpbmcpOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl91bm11dGUoaWQsIHRoaXMubm9ybWFsTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdW5tdXRlTXVzaWMoaWQ/OnN0cmluZyk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3VubXV0ZShpZCwgdGhpcy5tdXNpY0xpbmVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHVubXV0ZVNvdW5kKGlkPzpzdHJpbmcpOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl91bm11dGUoaWQsIHRoaXMuc291bmRMaW5lcyk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9wYXVzZShpZDpzdHJpbmcsIGxpbmVzOkF1ZGlvTGluZVtdKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICBpZighaWQpe1xuICAgICAgICAgICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBpZighbGluZXNbaV0uYXZhaWxhYmxlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzW2ldLnBhdXNlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGF1ZGlvTGluZXM6QXVkaW9MaW5lW10gPSB0aGlzLl9nZXRMaW5lc0J5SWQoaWQsIGxpbmVzKTtcbiAgICAgICAgICAgIGlmKGF1ZGlvTGluZXMubGVuZ3RoKXtcbiAgICAgICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCBhdWRpb0xpbmVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICAgICAgYXVkaW9MaW5lc1tpXS5wYXVzZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfcmVzdW1lKGlkOnN0cmluZywgbGluZXM6QXVkaW9MaW5lW10pOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIGlmKCFpZCl7XG4gICAgICAgICAgICAgICAgZm9yKHZhciBpOm51bWJlciA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgICAgIGlmKCFsaW5lc1tpXS5hdmFpbGFibGUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluZXNbaV0ucmVzdW1lKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGF1ZGlvTGluZXM6QXVkaW9MaW5lW10gPSB0aGlzLl9nZXRMaW5lc0J5SWQoaWQsIGxpbmVzKTtcbiAgICAgICAgICAgIGlmKGF1ZGlvTGluZXMubGVuZ3RoKXtcbiAgICAgICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCBhdWRpb0xpbmVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICAgICAgYXVkaW9MaW5lc1tpXS5yZXN1bWUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX3BsYXkoaWQ6c3RyaW5nLCBsaW5lczpBdWRpb0xpbmVbXSwgbG9vcDpib29sZWFuID0gZmFsc2UsIGNhbGxiYWNrPzpGdW5jdGlvbik6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgdmFyIGxpbmU6QXVkaW9MaW5lID0gdGhpcy5fZ2V0QXZhaWxhYmxlTGluZUZyb20obGluZXMpO1xuICAgICAgICAgICAgaWYoIWxpbmUpe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0F1ZGlvTWFuYWdlcjogQWxsIGxpbmVzIGFyZSBidXN5IScpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgYXVkaW86QXVkaW8gPSB0aGlzLmdldEF1ZGlvKGlkKTtcbiAgICAgICAgICAgIGlmKCFhdWRpbyl7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignQXVkaW8gKCcgKyBpZCArICcpIG5vdCBmb3VuZC4nKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGluZS5zZXRBdWRpbyhhdWRpbywgbG9vcCwgY2FsbGJhY2spLnBsYXkoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfc3RvcChpZDpzdHJpbmcsIGxpbmVzOkF1ZGlvTGluZVtdKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICBpZighaWQpe1xuICAgICAgICAgICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBpZighbGluZXNbaV0uYXZhaWxhYmxlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzW2ldLnN0b3AoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgYXVkaW9MaW5lczpBdWRpb0xpbmVbXSA9IHRoaXMuX2dldExpbmVzQnlJZChpZCwgbGluZXMpO1xuICAgICAgICAgICAgaWYoYXVkaW9MaW5lcy5sZW5ndGgpe1xuICAgICAgICAgICAgICAgIGZvcihpID0gMDsgaSA8IGF1ZGlvTGluZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBhdWRpb0xpbmVzW2ldLnN0b3AoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfbXV0ZShpZDpzdHJpbmcsIGxpbmVzOkF1ZGlvTGluZVtdKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICBpZighaWQpe1xuICAgICAgICAgICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBpZighbGluZXNbaV0uYXZhaWxhYmxlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzW2ldLm11dGUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgYXVkaW9MaW5lczpBdWRpb0xpbmVbXSA9IHRoaXMuX2dldExpbmVzQnlJZChpZCwgbGluZXMpO1xuICAgICAgICAgICAgaWYoYXVkaW9MaW5lcy5sZW5ndGgpe1xuICAgICAgICAgICAgICAgIGZvcihpID0gMDsgaSA8IGF1ZGlvTGluZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBhdWRpb0xpbmVzW2ldLm11dGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX3VubXV0ZShpZDpzdHJpbmcsIGxpbmVzOkF1ZGlvTGluZVtdKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICBpZighaWQpe1xuICAgICAgICAgICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBpZighbGluZXNbaV0uYXZhaWxhYmxlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzW2ldLnVubXV0ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBhdWRpb0xpbmVzOkF1ZGlvTGluZVtdID0gdGhpcy5fZ2V0TGluZXNCeUlkKGlkLCBsaW5lcyk7XG4gICAgICAgICAgICBpZihhdWRpb0xpbmVzLmxlbmd0aCl7XG4gICAgICAgICAgICAgICAgZm9yKGkgPSAwOyBpIDwgYXVkaW9MaW5lcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgICAgIGF1ZGlvTGluZXNbaV0udW5tdXRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9nZXRMaW5lc0J5SWQoaWQ6c3RyaW5nLCBsaW5lczpBdWRpb0xpbmVbXSk6QXVkaW9MaW5lW10ge1xuICAgICAgICAgICAgdGhpcy5fdGVtcExpbmVzLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICBmb3IodmFyIGk6bnVtYmVyID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICBpZighbGluZXNbaV0uYXZhaWxhYmxlKXtcbiAgICAgICAgICAgICAgICAgICAgaWYobGluZXNbaV0uYXVkaW8uaWQgPT09IGlkKXRoaXMuX3RlbXBMaW5lcy5wdXNoKGxpbmVzW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90ZW1wTGluZXM7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9nZXRBdmFpbGFibGVMaW5lRnJvbShsaW5lczpBdWRpb0xpbmVbXSk6QXVkaW9MaW5le1xuICAgICAgICAgICAgdmFyIGw6QXVkaW9MaW5lO1xuICAgICAgICAgICAgZm9yKHZhciBpOm51bWJlciA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgaWYobGluZXNbaV0uYXZhaWxhYmxlKXtcbiAgICAgICAgICAgICAgICAgICAgbCA9IGxpbmVzW2ldO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNyZWF0ZUdhaW5Ob2RlKGN0eDpBdWRpb0NvbnRleHQpOkdhaW5Ob2Rle1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5jcmVhdGVHYWluID8gY3R4LmNyZWF0ZUdhaW4oKSA6IGN0eC5jcmVhdGVHYWluTm9kZSgpO1xuICAgICAgICB9XG5cbiAgICB9XG59XG5cbmludGVyZmFjZSBBdWRpb0NvbnRleHQge1xuICAgIGNyZWF0ZUdhaW5Ob2RlKCk6YW55O1xufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4vQXVkaW9NYW5hZ2VyLnRzXCIgLz5cbm1vZHVsZSBQSVhJIHtcbiAgICBleHBvcnQgY2xhc3MgQXVkaW8ge1xuICAgICAgICBsb29wOmJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgcHJpdmF0ZSBfdm9sdW1lOm51bWJlciA9IDE7XG4gICAgICAgIG11dGVkOmJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgbWFuYWdlcjpBdWRpb01hbmFnZXI7XG5cbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIHNvdXJjZTphbnksIHB1YmxpYyBpZDpzdHJpbmcpe31cblxuICAgICAgICBwbGF5KGxvb3A/OmJvb2xlYW58RnVuY3Rpb24sIGNhbGxiYWNrPzpGdW5jdGlvbik6QXVkaW97XG4gICAgICAgICAgICBpZighdGhpcy5tYW5hZ2VyKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdUaGlzIGF1ZGlvIG5lZWQgYSBtYW5hZ2VyLicpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZih0eXBlb2YgbG9vcCA9PT0gXCJmdW5jdGlvblwiKXtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayA9IDxGdW5jdGlvbj5sb29wO1xuICAgICAgICAgICAgICAgIGxvb3AgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLnBsYXkodGhpcy5pZCwgbG9vcCwgY2FsbGJhY2spO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBzdG9wKCk6QXVkaW8ge1xuICAgICAgICAgICAgaWYoIXRoaXMubWFuYWdlcil7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignVGhpcyBhdWRpbyBuZWVkIGEgbWFuYWdlci4nKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLnN0b3AodGhpcy5pZCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIG11dGUoKTpBdWRpbyB7XG4gICAgICAgICAgICBpZighdGhpcy5tYW5hZ2VyKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdUaGlzIGF1ZGlvIG5lZWQgYSBtYW5hZ2VyLicpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLm11dGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5tdXRlKHRoaXMuaWQpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICB1bm11dGUoKTpBdWRpbyB7XG4gICAgICAgICAgICBpZighdGhpcy5tYW5hZ2VyKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdUaGlzIGF1ZGlvIG5lZWQgYSBtYW5hZ2VyLicpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLm11dGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLm1hbmFnZXIudW5tdXRlKHRoaXMuaWQpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwYXVzZSgpOkF1ZGlvIHtcbiAgICAgICAgICAgIGlmKCF0aGlzLm1hbmFnZXIpe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1RoaXMgYXVkaW8gbmVlZCBhIG1hbmFnZXIuJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5wYXVzZSh0aGlzLmlkKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzdW1lKCk6QXVkaW8ge1xuICAgICAgICAgICAgaWYoIXRoaXMubWFuYWdlcil7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignVGhpcyBhdWRpbyBuZWVkIGEgbWFuYWdlci4nKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLnJlc3VtZSh0aGlzLmlkKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHZvbHVtZSgpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ZvbHVtZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldCB2b2x1bWUodmFsdWU6bnVtYmVyKXtcbiAgICAgICAgICAgIHRoaXMuX3ZvbHVtZSA9IHZhbHVlO1xuXG4gICAgICAgICAgICBpZih0aGlzLm1hbmFnZXIpe1xuICAgICAgICAgICAgICAgIC8vVE9ETzogdXBkYXRlIHRoZSB2b2x1bWUgb24gdGhlIGZseVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2RlZnMvcGl4aS5qcy5kLnRzXCIgLz5cbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL2NvcmUvY29uc3QudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vdHdlZW4vVHdlZW4udHNcIiAvPlxubW9kdWxlIFBJWEkge1xuICAgIENvbnRhaW5lci5fa2lsbGVkT2JqZWN0cyA9IFtdO1xuXG4gICAgQ29udGFpbmVyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihkZWx0YVRpbWU6IG51bWJlcik6Q29udGFpbmVyIHtcbiAgICAgICAgdGhpcy5wb3NpdGlvbi54ICs9IHRoaXMudmVsb2NpdHkueCAqIGRlbHRhVGltZTtcbiAgICAgICAgdGhpcy5wb3NpdGlvbi55ICs9IHRoaXMudmVsb2NpdHkueSAqIGRlbHRhVGltZTtcbiAgICAgICAgdGhpcy5yb3RhdGlvbiArPSB0aGlzLnJvdGF0aW9uU3BlZWQgKiBkZWx0YVRpbWU7XG5cbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbltpXS51cGRhdGUoZGVsdGFUaW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICB2YXIgX2FkZENoaWxkOkZ1bmN0aW9uID0gQ29udGFpbmVyLnByb3RvdHlwZS5hZGRDaGlsZDtcbiAgICBDb250YWluZXIucHJvdG90eXBlLmFkZENoaWxkID0gZnVuY3Rpb24oY2hpbGQ6RGlzcGxheU9iamVjdCk6RGlzcGxheU9iamVjdHtcbiAgICAgICAgX2FkZENoaWxkLmNhbGwodGhpcywgY2hpbGQpO1xuICAgICAgICBpZih6SW5kZXhFbmFibGVkKXRoaXMuc29ydENoaWxkcmVuQnlaSW5kZXgoKTtcbiAgICAgICAgcmV0dXJuIGNoaWxkO1xuICAgIH07XG5cbiAgICBDb250YWluZXIucHJvdG90eXBlLmFkZFRvID0gZnVuY3Rpb24ocGFyZW50KTpDb250YWluZXJ7XG4gICAgICAgIHBhcmVudC5hZGRDaGlsZCh0aGlzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIENvbnRhaW5lci5wcm90b3R5cGUua2lsbCA9IGZ1bmN0aW9uKCk6Q29udGFpbmVye1xuICAgICAgICBQSVhJLkNvbnRhaW5lci5fa2lsbGVkT2JqZWN0cy5wdXNoKHRoaXMpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgQ29udGFpbmVyLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbigpe1xuICAgICAgICBpZih0aGlzLnBhcmVudCl7XG4gICAgICAgICAgICB0aGlzLnBhcmVudC5yZW1vdmVDaGlsZCh0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgQ29udGFpbmVyLnByb3RvdHlwZS5zb3J0Q2hpbGRyZW5CeVpJbmRleCA9IGZ1bmN0aW9uKCk6Q29udGFpbmVyIHtcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5zb3J0KGZ1bmN0aW9uKGE6Q29udGFpbmVyLCBiOkNvbnRhaW5lcil7XG4gICAgICAgICAgICB2YXIgYVogPSBhLnpJbmRleCxcbiAgICAgICAgICAgICAgICBiWiA9IGIuekluZGV4O1xuXG4gICAgICAgICAgICByZXR1cm4gYVogLSBiWjtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBDb250YWluZXIucHJvdG90eXBlLnR3ZWVuID0gZnVuY3Rpb24oKTpUd2VlbntcbiAgICAgICAgcmV0dXJuIG5ldyBUd2Vlbih0aGlzKTtcbiAgICB9XG5cbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9kZWZzL3BpeGkuanMuZC50c1wiIC8+XG5cbm1vZHVsZSBQSVhJIHtcbiAgICBEaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5zcGVlZCA9IDA7XG4gICAgRGlzcGxheU9iamVjdC5wcm90b3R5cGUudmVsb2NpdHkgPSBuZXcgUG9pbnQoKTtcbiAgICBEaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5kaXJlY3Rpb24gPSAwO1xuICAgIERpc3BsYXlPYmplY3QucHJvdG90eXBlLnJvdGF0aW9uU3BlZWQgPSAwO1xuICAgIERpc3BsYXlPYmplY3QucHJvdG90eXBlLnpJbmRleCA9IDA7XG5cbiAgICBEaXNwbGF5T2JqZWN0LnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihkZWx0YVRpbWU6bnVtYmVyKTpEaXNwbGF5T2JqZWN0e1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xufVxuIiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vZGVmcy9waXhpLmpzLmQudHNcIiAvPlxubW9kdWxlIFBJWEkge1xuICAgIGV4cG9ydCBjbGFzcyBQb29sIHtcbiAgICAgICAgcHJpdmF0ZSBfaXRlbXM6YW55W10gPSBbXTtcblxuICAgICAgICBjb25zdHJ1Y3RvcihhbW91bnQ6bnVtYmVyLCBwdWJsaWMgb2JqZWN0Q3RvcjphbnksIHB1YmxpYyBhcmdzOmFueVtdID0gW10pe1xuICAgICAgICAgICAgZm9yKHZhciBpOm51bWJlciA9IDA7IGkgPCBhbW91bnQ7IGkrKyl7XG4gICAgICAgICAgICAgICAgdGhpcy5faXRlbXMucHVzaCh0aGlzLl9uZXdPYmplY3QoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9uZXdPYmplY3QoKTphbnl7XG4gICAgICAgICAgICB2YXIgb2JqOmFueTtcbiAgICAgICAgICAgIHRyeXtcbiAgICAgICAgICAgICAgICBvYmogPSBuZXcgKEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kLmFwcGx5KHRoaXMub2JqZWN0Q3RvciwgKFtudWxsXSkuY29uY2F0KHRoaXMuYXJncykpKSgpO1xuICAgICAgICAgICAgfWNhdGNoKGUpe1xuICAgICAgICAgICAgICAgIG9iaiA9IF9uZXdPYmoodGhpcy5vYmplY3RDdG9yLCB0aGlzLmFyZ3MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgbWU6UG9vbCA9IHRoaXM7XG4gICAgICAgICAgICBvYmoucmV0dXJuVG9Qb29sID0gZnVuY3Rpb24gcmV0dXJuVG9Qb29sKCl7XG4gICAgICAgICAgICAgICAgICBtZS5wdXQodGhpcyk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICB9XG5cbiAgICAgICAgcHV0KGl0ZW06YW55KTp2b2lke1xuICAgICAgICAgICAgdGhpcy5faXRlbXMudW5zaGlmdChpdGVtKTtcbiAgICAgICAgICAgIGlmKGl0ZW0ub25SZXR1cm5Ub1Bvb2wpaXRlbS5vblJldHVyblRvUG9vbCh0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCgpOmFueXtcbiAgICAgICAgICAgIHZhciBpdGVtOmFueSA9ICh0aGlzLl9pdGVtcy5sZW5ndGgpID8gdGhpcy5faXRlbXMucG9wKCkgOiB0aGlzLl9uZXdPYmplY3QoKTtcbiAgICAgICAgICAgIGlmKGl0ZW0ub25HZXRGcm9tUG9vbClpdGVtLm9uR2V0RnJvbVBvb2wodGhpcyk7XG4gICAgICAgICAgICByZXR1cm4gaXRlbTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBsZW5ndGgoKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pdGVtcy5sZW5ndGg7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvL3NhZmFyaSBmaXhcbiAgICBmdW5jdGlvbiBfbmV3T2JqKG9iajphbnksIGFyZ3M6YW55W10pOmFueXtcbiAgICAgICAgdmFyIGV2OnN0cmluZyA9IFwiRnVuY3Rpb24oJ29iaicsXCI7XG4gICAgICAgIHZhciBmbjpzdHJpbmcgPSBcIlxcXCJyZXR1cm4gbmV3IG9iaihcIjtcblxuICAgICAgICBmb3IodmFyIGk6bnVtYmVyID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgZXYgKz0gXCInYVwiK2krXCInLFwiO1xuICAgICAgICAgICAgZm4gKz0gXCJhXCIraTtcbiAgICAgICAgICAgIGlmKGkgIT09IGFyZ3MubGVuZ3RoLTEpe1xuICAgICAgICAgICAgICAgIGZuICs9IFwiLFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm4gKz0gXCIpXFxcIlwiO1xuICAgICAgICBldiArPSBmbiArIFwiKVwiO1xuXG4gICAgICAgIHJldHVybiAoZXZhbChldikpLmFwcGx5KHRoaXMsIChbb2JqXSkuY29uY2F0KGFyZ3MpKTtcbiAgICB9XG59Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
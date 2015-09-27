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
    //TODO: The audios system needs a big refactor/improvement
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
    }(PIXI || (PIXI = {})));
    ///<reference path="../../defs/pixi.js.d.ts" />
    var PIXI;
    (function (PIXI) {
        PIXI.extras.TilingSprite.prototype.tileVelocity = new PIXI.Point();
        PIXI.extras.TilingSprite.prototype.tileSpeed = 0;
        PIXI.extras.TilingSprite.prototype.tileDirection = 0;
        PIXI.extras.TilingSprite.prototype.update = function (deltaTime) {
            this.tilePosition.x += this.tileVel.x * deltaTime;
            this.tilePosition.y += this.tileVel.y * deltaTime;
            PIXI.Container.prototype.update.call(this, deltaTime);
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
    ///<refeence path="../../defs/pixi.js.d.ts" />
    var PIXI;
    (function (PIXI) {
        var SpeedPoint = function (_super) {
            __extends(SpeedPoint, _super);
            function SpeedPoint(x, y, _callback) {
                _super.call(this, x, y);
                this._callback = _callback;
            }
            Object.defineProperty(SpeedPoint.prototype, 'x', {
                get: function () {
                    return this._x;
                },
                set: function (value) {
                    if (value === this._x)
                        return;
                    this._x = value;
                    if (this._callback)
                        this._callback();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SpeedPoint.prototype, 'y', {
                get: function () {
                    return this._y;
                },
                set: function (value) {
                    if (value === this._y)
                        return;
                    this._y = value;
                    if (this._callback)
                        this._callback();
                },
                enumerable: true,
                configurable: true
            });
            return SpeedPoint;
        }(PIXI.Point);
        PIXI.SpeedPoint = SpeedPoint;
    }(PIXI || (PIXI = {})));    //todo 
}(typeof PIXI === 'object' ? PIXI : null));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInR1cmJvcGl4aS5qcyIsImluZGV4LnRzIiwiYXVkaW8vQXVkaW9MaW5lLnRzIiwiY29yZS9jb25zdC50cyIsImNvcmUvRGV2aWNlLnRzIiwiZGlzcGxheS9DYW1lcmEudHMiLCJ0aW1lci9UaW1lci50cyIsInRpbWVyL1RpbWVyTWFuYWdlci50cyIsInR3ZWVuL0Vhc2luZy50cyIsInR3ZWVuL1BhdGgudHMiLCJ0d2Vlbi9Ud2Vlbi50cyIsInR3ZWVuL1R3ZWVuTWFuYWdlci50cyIsImRpc3BsYXkvU2NlbmUudHMiLCJpbnB1dC9JbnB1dE1hbmFnZXIudHMiLCJsb2FkZXIvYml0bWFwRm9udFBhcnNlclRYVC50cyIsImxvYWRlci9hdWRpb1BhcnNlci50cyIsImNvcmUvVXRpbHMudHMiLCJsb2FkZXIvTG9hZGVyLnRzIiwiY29yZS9EYXRhTWFuYWdlci50cyIsImNvcmUvR2FtZS50cyIsImF1ZGlvL0F1ZGlvTWFuYWdlci50cyIsImF1ZGlvL0F1ZGlvLnRzIiwiZGlzcGxheS9Db250YWluZXIudHMiLCJkaXNwbGF5L0Rpc3BsYXlPYmplY3QudHMiLCJkaXNwbGF5L0dyYXBoaWNzLnRzIiwiZGlzcGxheS9UaWxpbmdTcHJpdGUudHMiLCJjb3JlL1Bvb2wudHMiLCJjb3JlL1NwZWVkUG9pbnQudHMiXSwibmFtZXMiOlsiUElYSSIsIkVycm9yIiwiUElYSV9WRVJTSU9OX1JFUVVJUkVEIiwiUElYSV9WRVJTSU9OIiwiVkVSU0lPTiIsIm1hdGNoIiwiSFRNTEF1ZGlvIiwiQXVkaW8iLCJQSVhJLkF1ZGlvTGluZSIsIlBJWEkuQXVkaW9MaW5lLmNvbnN0cnVjdG9yIiwiUElYSS5BdWRpb0xpbmUuc2V0QXVkaW8iLCJQSVhJLkF1ZGlvTGluZS5wbGF5IiwiUElYSS5BdWRpb0xpbmUuc3RvcCIsIlBJWEkuQXVkaW9MaW5lLnBhdXNlIiwiUElYSS5BdWRpb0xpbmUucmVzdW1lIiwiUElYSS5BdWRpb0xpbmUubXV0ZSIsIlBJWEkuQXVkaW9MaW5lLnVubXV0ZSIsIlBJWEkuQXVkaW9MaW5lLnZvbHVtZSIsIlBJWEkuQXVkaW9MaW5lLnJlc2V0IiwiUElYSS5BdWRpb0xpbmUuX29uRW5kIiwiUElYSS5HQU1FX1NDQUxFX1RZUEUiLCJQSVhJLkFVRElPX1RZUEUiLCJQSVhJLkRldmljZSIsIlBJWEkuRGV2aWNlLmdldE1vdXNlV2hlZWxFdmVudCIsIlBJWEkuRGV2aWNlLnZpYnJhdGUiLCJQSVhJLkRldmljZS5nZXRWaXNpYmlsaXR5Q2hhbmdlRXZlbnQiLCJQSVhJLkRldmljZS5pc09ubGluZSIsIl9fZXh0ZW5kcyIsImQiLCJiIiwicCIsImhhc093blByb3BlcnR5IiwiX18iLCJjb25zdHJ1Y3RvciIsInByb3RvdHlwZSIsIlBJWEkuQ2FtZXJhIiwiUElYSS5DYW1lcmEuY29uc3RydWN0b3IiLCJQSVhJLkNhbWVyYS51cGRhdGUiLCJnZXQiLCJQSVhJLkNhbWVyYS5lbmFibGVkIiwic2V0IiwiZW51bWVyYWJsZSIsImNvbmZpZ3VyYWJsZSIsIlBJWEkuVGltZXIiLCJQSVhJLlRpbWVyLmNvbnN0cnVjdG9yIiwiUElYSS5UaW1lci51cGRhdGUiLCJQSVhJLlRpbWVyLmFkZFRvIiwiUElYSS5UaW1lci5yZW1vdmUiLCJQSVhJLlRpbWVyLnN0YXJ0IiwiUElYSS5UaW1lci5zdG9wIiwiUElYSS5UaW1lci5yZXNldCIsIlBJWEkuVGltZXIub25TdGFydCIsIlBJWEkuVGltZXIub25FbmQiLCJQSVhJLlRpbWVyLm9uU3RvcCIsIlBJWEkuVGltZXIub25VcGRhdGUiLCJQSVhJLlRpbWVyLm9uUmVwZWF0IiwiUElYSS5UaW1lck1hbmFnZXIiLCJQSVhJLlRpbWVyTWFuYWdlci5jb25zdHJ1Y3RvciIsIlBJWEkuVGltZXJNYW5hZ2VyLnVwZGF0ZSIsIlBJWEkuVGltZXJNYW5hZ2VyLnJlbW92ZVRpbWVyIiwiUElYSS5UaW1lck1hbmFnZXIuYWRkVGltZXIiLCJQSVhJLlRpbWVyTWFuYWdlci5jcmVhdGVUaW1lciIsIlBJWEkuVGltZXJNYW5hZ2VyLl9yZW1vdmUiLCJQSVhJLkVhc2luZyIsIlBJWEkuRWFzaW5nLmxpbmVhciIsImsiLCJQSVhJLkVhc2luZy5pblF1YWQiLCJQSVhJLkVhc2luZy5vdXRRdWFkIiwiUElYSS5FYXNpbmcuaW5PdXRRdWFkIiwiUElYSS5FYXNpbmcuaW5DdWJpYyIsIlBJWEkuRWFzaW5nLm91dEN1YmljIiwiUElYSS5FYXNpbmcuaW5PdXRDdWJpYyIsIlBJWEkuRWFzaW5nLmluUXVhcnQiLCJQSVhJLkVhc2luZy5vdXRRdWFydCIsIlBJWEkuRWFzaW5nLmluT3V0UXVhcnQiLCJQSVhJLkVhc2luZy5pblF1aW50IiwiUElYSS5FYXNpbmcub3V0UXVpbnQiLCJQSVhJLkVhc2luZy5pbk91dFF1aW50IiwiUElYSS5FYXNpbmcuaW5TaW5lIiwiTWF0aCIsImNvcyIsIlBJIiwiUElYSS5FYXNpbmcub3V0U2luZSIsInNpbiIsIlBJWEkuRWFzaW5nLmluT3V0U2luZSIsIlBJWEkuRWFzaW5nLmluRXhwbyIsInBvdyIsIlBJWEkuRWFzaW5nLm91dEV4cG8iLCJQSVhJLkVhc2luZy5pbk91dEV4cG8iLCJQSVhJLkVhc2luZy5pbkNpcmMiLCJzcXJ0IiwiUElYSS5FYXNpbmcub3V0Q2lyYyIsIlBJWEkuRWFzaW5nLmluT3V0Q2lyYyIsIlBJWEkuRWFzaW5nLmluRWxhc3RpYyIsInMiLCJhIiwiYXNpbiIsIlBJWEkuRWFzaW5nLm91dEVsYXN0aWMiLCJQSVhJLkVhc2luZy5pbk91dEVsYXN0aWMiLCJQSVhJLkVhc2luZy5pbkJhY2siLCJ2IiwiUElYSS5FYXNpbmcub3V0QmFjayIsIlBJWEkuRWFzaW5nLmluT3V0QmFjayIsIlBJWEkuRWFzaW5nLmluQm91bmNlIiwiRWFzaW5nIiwib3V0Qm91bmNlIiwiUElYSS5FYXNpbmcub3V0Qm91bmNlIiwiUElYSS5FYXNpbmcuaW5PdXRCb3VuY2UiLCJpbkJvdW5jZSIsIlBJWEkuUGF0aCIsIlBJWEkuUGF0aC5jb25zdHJ1Y3RvciIsIlBJWEkuUGF0aC5tb3ZlVG8iLCJQSVhJLlBhdGgubGluZVRvIiwiUElYSS5QYXRoLmJlemllckN1cnZlVG8iLCJQSVhJLlBhdGgucXVhZHJhdGljQ3VydmVUbyIsIlBJWEkuUGF0aC5hcmNUbyIsIlBJWEkuUGF0aC5hcmMiLCJQSVhJLlBhdGguZHJhd1NoYXBlIiwiUElYSS5QYXRoLmdldFBvaW50IiwiUElYSS5QYXRoLmRpc3RhbmNlQmV0d2VlbiIsIlBJWEkuUGF0aC50b3RhbERpc3RhbmNlIiwiUElYSS5QYXRoLmdldFBvaW50QXQiLCJQSVhJLlBhdGguZ2V0UG9pbnRBdERpc3RhbmNlIiwiUElYSS5QYXRoLnBhcnNlUG9pbnRzIiwiUElYSS5QYXRoLmNsZWFyIiwiUElYSS5QYXRoLmNsb3NlZCIsIlBJWEkuUGF0aC5sZW5ndGgiLCJQSVhJLlR3ZWVuIiwiUElYSS5Ud2Vlbi5jb25zdHJ1Y3RvciIsIlBJWEkuVHdlZW4uYWRkVG8iLCJQSVhJLlR3ZWVuLmNoYWluIiwiUElYSS5Ud2Vlbi5zdGFydCIsIlBJWEkuVHdlZW4uc3RvcCIsIlBJWEkuVHdlZW4udG8iLCJQSVhJLlR3ZWVuLmZyb20iLCJQSVhJLlR3ZWVuLnJlbW92ZSIsIlBJWEkuVHdlZW4ucmVzZXQiLCJQSVhJLlR3ZWVuLm9uU3RhcnQiLCJQSVhJLlR3ZWVuLm9uRW5kIiwiUElYSS5Ud2Vlbi5vblN0b3AiLCJQSVhJLlR3ZWVuLm9uVXBkYXRlIiwiUElYSS5Ud2Vlbi5vblJlcGVhdCIsIlBJWEkuVHdlZW4ub25QaW5nUG9uZyIsIlBJWEkuVHdlZW4udXBkYXRlIiwiUElYSS5Ud2Vlbi5fcGFyc2VEYXRhIiwiUElYSS5Ud2Vlbi5fYXBwbHkiLCJQSVhJLlR3ZWVuLl9jYW5VcGRhdGUiLCJQSVhJLl9maW5kTWFuYWdlciIsIlBJWEkuX3BhcnNlUmVjdXJzaXZlRGF0YSIsIlBJWEkuaXNPYmplY3QiLCJQSVhJLl9yZWN1cnNpdmVBcHBseSIsIlBJWEkuVHdlZW5NYW5hZ2VyIiwiUElYSS5Ud2Vlbk1hbmFnZXIuY29uc3RydWN0b3IiLCJQSVhJLlR3ZWVuTWFuYWdlci51cGRhdGUiLCJQSVhJLlR3ZWVuTWFuYWdlci5nZXRUd2VlbnNGb3JUYXJnZXIiLCJQSVhJLlR3ZWVuTWFuYWdlci5jcmVhdGVUd2VlbiIsIlBJWEkuVHdlZW5NYW5hZ2VyLmFkZFR3ZWVuIiwiUElYSS5Ud2Vlbk1hbmFnZXIucmVtb3ZlVHdlZW4iLCJQSVhJLlR3ZWVuTWFuYWdlci5fcmVtb3ZlIiwiUElYSS5TY2VuZSIsIlBJWEkuU2NlbmUuY29uc3RydWN0b3IiLCJQSVhJLlNjZW5lLnVwZGF0ZSIsIlBJWEkuU2NlbmUuYWRkVG8iLCJQSVhJLklucHV0TWFuYWdlciIsIlBJWEkuSW5wdXRNYW5hZ2VyLmNvbnN0cnVjdG9yIiwiUElYSS5iaXRtYXBGb250UGFyc2VyVFhUIiwicmVzb3VyY2UiLCJkYXRhIiwieGhyVHlwZSIsIm5leHQiLCJ0ZXh0IiwieGhyIiwicmVzcG9uc2VUZXh0IiwiaW5kZXhPZiIsInVybCIsImRpcm5hbWUiLCJiYXNlVXJsIiwiY2hhckF0IiwibGVuZ3RoIiwicmVwbGFjZSIsInRleHR1cmVVcmwiLCJnZXRUZXh0dXJlVXJsIiwidXRpbHMiLCJUZXh0dXJlQ2FjaGUiLCJwYXJzZSIsImxvYWRPcHRpb25zIiwiY3Jvc3NPcmlnaW4iLCJsb2FkVHlwZSIsImxvYWRlcnMiLCJSZXNvdXJjZSIsIkxPQURfVFlQRSIsIklNQUdFIiwiYWRkIiwibmFtZSIsInJlcyIsInRleHR1cmUiLCJQSVhJLnBhcnNlIiwiUElYSS5kaXJuYW1lIiwiUElYSS5nZXRUZXh0dXJlVXJsIiwiUElYSS5nZXRBdHRyIiwiUElYSS5hdWRpb1BhcnNlciIsIkRldmljZSIsImlzQXVkaW9TdXBwb3J0ZWQiLCJleHQiLCJfZ2V0RXh0IiwiX2FsbG93ZWRFeHQiLCJfY2FuUGxheSIsIl9hdWRpb1R5cGVTZWxlY3RlZCIsIkFVRElPX1RZUEUiLCJXRUJBVURJTyIsImdsb2JhbFdlYkF1ZGlvQ29udGV4dCIsImRlY29kZUF1ZGlvRGF0YSIsIl9hZGRUb0NhY2hlIiwiYmluZCIsIlBJWEkuYXVkaW9QYXJzZXJVcmwiLCJQSVhJLl9hZGRUb0NhY2hlIiwiUElYSS5fZ2V0RXh0IiwiUElYSS5fY2FuUGxheSIsIlBJWEkudXRpbHMiLCJQSVhJLmxvYWRlcnMiLCJQSVhJLmxvYWRlcnMuVHVyYm9Mb2FkZXIiLCJQSVhJLmxvYWRlcnMuVHVyYm9Mb2FkZXIuY29uc3RydWN0b3IiLCJQSVhJLmxvYWRlcnMuVHVyYm9Mb2FkZXIuYWRkIiwiUElYSS5sb2FkZXJzLl9jaGVja0F1ZGlvVHlwZSIsIlBJWEkubG9hZGVycy5fc2V0QXVkaW9FeHQiLCJQSVhJLkRhdGFNYW5hZ2VyIiwiUElYSS5EYXRhTWFuYWdlci5jb25zdHJ1Y3RvciIsIlBJWEkuRGF0YU1hbmFnZXIubG9hZCIsIlBJWEkuRGF0YU1hbmFnZXIuc2F2ZSIsIlBJWEkuRGF0YU1hbmFnZXIucmVzZXQiLCJQSVhJLkRhdGFNYW5hZ2VyLnNldCIsIlBJWEkuRGF0YU1hbmFnZXIuZ2V0IiwiUElYSS5EYXRhTWFuYWdlci5kZWwiLCJQSVhJLkdhbWUiLCJQSVhJLkdhbWUuY29uc3RydWN0b3IiLCJQSVhJLkdhbWUuX2FuaW1hdGUiLCJQSVhJLkdhbWUudXBkYXRlIiwiUElYSS5HYW1lLnN0YXJ0IiwiUElYSS5HYW1lLnN0b3AiLCJQSVhJLkdhbWUuZW5hYmxlU3RvcEF0TG9zdEZvY3VzIiwiUElYSS5HYW1lLmRpc2FibGVTdG9wQXRMb3N0Rm9jdXMiLCJQSVhJLkdhbWUuX29uVmlzaWJpbGl0eUNoYW5nZSIsIlBJWEkuR2FtZS5vbkxvc3RGb2N1cyIsIlBJWEkuR2FtZS5zZXRTY2VuZSIsIlBJWEkuR2FtZS5nZXRTY2VuZSIsIlBJWEkuR2FtZS5jcmVhdGVTY2VuZSIsIlBJWEkuR2FtZS5yZW1vdmVTY2VuZSIsIlBJWEkuR2FtZS5hZGRTY2VuZSIsIlBJWEkuR2FtZS5yZW1vdmVBbGxTY2VuZXMiLCJQSVhJLkdhbWUucmVzaXplIiwiUElYSS5HYW1lLmF1dG9SZXNpemUiLCJQSVhJLkdhbWUuX3Jlc2l6ZU1vZGVBc3BlY3RGaXQiLCJQSVhJLkdhbWUuX3Jlc2l6ZU1vZGVBc3BlY3RGaWxsIiwiUElYSS5HYW1lLl9yZXNpemVNb2RlRmlsbCIsIlBJWEkuR2FtZS53aWR0aCIsIlBJWEkuR2FtZS5oZWlnaHQiLCJQSVhJLkF1ZGlvTWFuYWdlciIsIlBJWEkuQXVkaW9NYW5hZ2VyLmNvbnN0cnVjdG9yIiwiUElYSS5BdWRpb01hbmFnZXIuZ2V0QXVkaW8iLCJQSVhJLkF1ZGlvTWFuYWdlci5wYXVzZUFsbExpbmVzIiwiUElYSS5BdWRpb01hbmFnZXIucmVzdW1lQWxsTGluZXMiLCJQSVhJLkF1ZGlvTWFuYWdlci5wbGF5IiwiUElYSS5BdWRpb01hbmFnZXIucGxheU11c2ljIiwiUElYSS5BdWRpb01hbmFnZXIucGxheVNvdW5kIiwiUElYSS5BdWRpb01hbmFnZXIuc3RvcCIsIlBJWEkuQXVkaW9NYW5hZ2VyLnN0b3BNdXNpYyIsIlBJWEkuQXVkaW9NYW5hZ2VyLnN0b3BTb3VuZCIsIlBJWEkuQXVkaW9NYW5hZ2VyLnBhdXNlIiwiUElYSS5BdWRpb01hbmFnZXIucGF1c2VNdXNpYyIsIlBJWEkuQXVkaW9NYW5hZ2VyLnBhdXNlU291bmQiLCJQSVhJLkF1ZGlvTWFuYWdlci5yZXN1bWUiLCJQSVhJLkF1ZGlvTWFuYWdlci5yZXN1bWVNdXNpYyIsIlBJWEkuQXVkaW9NYW5hZ2VyLnJlc3VtZVNvdW5kIiwiUElYSS5BdWRpb01hbmFnZXIubXV0ZSIsIlBJWEkuQXVkaW9NYW5hZ2VyLm11dGVNdXNpYyIsIlBJWEkuQXVkaW9NYW5hZ2VyLm11dGVTb3VuZCIsIlBJWEkuQXVkaW9NYW5hZ2VyLnVubXV0ZSIsIlBJWEkuQXVkaW9NYW5hZ2VyLnVubXV0ZU11c2ljIiwiUElYSS5BdWRpb01hbmFnZXIudW5tdXRlU291bmQiLCJQSVhJLkF1ZGlvTWFuYWdlci5fcGF1c2UiLCJQSVhJLkF1ZGlvTWFuYWdlci5fcmVzdW1lIiwiUElYSS5BdWRpb01hbmFnZXIuX3BsYXkiLCJQSVhJLkF1ZGlvTWFuYWdlci5fc3RvcCIsIlBJWEkuQXVkaW9NYW5hZ2VyLl9tdXRlIiwiUElYSS5BdWRpb01hbmFnZXIuX3VubXV0ZSIsIlBJWEkuQXVkaW9NYW5hZ2VyLl9nZXRMaW5lc0J5SWQiLCJQSVhJLkF1ZGlvTWFuYWdlci5fZ2V0QXZhaWxhYmxlTGluZUZyb20iLCJQSVhJLkF1ZGlvTWFuYWdlci5jcmVhdGVHYWluTm9kZSIsIlBJWEkuQXVkaW8iLCJQSVhJLkF1ZGlvLmNvbnN0cnVjdG9yIiwiUElYSS5BdWRpby5wbGF5IiwiUElYSS5BdWRpby5zdG9wIiwiUElYSS5BdWRpby5tdXRlIiwiUElYSS5BdWRpby51bm11dGUiLCJQSVhJLkF1ZGlvLnBhdXNlIiwiUElYSS5BdWRpby5yZXN1bWUiLCJQSVhJLkF1ZGlvLnZvbHVtZSIsInpEaXJ0eSIsInNvcnRDaGlsZHJlbkJ5WkluZGV4IiwicG9zaXRpb24iLCJ4IiwidmVsb2NpdHkiLCJkZWx0YVRpbWUiLCJ5Iiwicm90YXRpb24iLCJyb3RhdGlvblNwZWVkIiwiaSIsImNoaWxkcmVuIiwidXBkYXRlIiwiX2FkZENoaWxkIiwiY2FsbCIsImNoaWxkIiwiekluZGV4RW5hYmxlZCIsInBhcmVudCIsImFkZENoaWxkIiwiQ29udGFpbmVyIiwiX2tpbGxlZE9iamVjdHMiLCJwdXNoIiwicmVtb3ZlQ2hpbGQiLCJzb3J0IiwiYVoiLCJ6SW5kZXgiLCJiWiIsIlR3ZWVuIiwiX3pJbmRleCIsInZhbHVlIiwicGF0aCIsInBhcnNlUG9pbnRzIiwiZHJhd1NoYXBlIiwicG9seWdvbiIsInRpbGVQb3NpdGlvbiIsInRpbGVWZWwiLCJQSVhJLlBvb2wiLCJQSVhJLlBvb2wuY29uc3RydWN0b3IiLCJQSVhJLlBvb2wuX25ld09iamVjdCIsIlBJWEkuUG9vbC5fbmV3T2JqZWN0LnJldHVyblRvUG9vbCIsIlBJWEkuUG9vbC5wdXQiLCJQSVhJLlBvb2wuZ2V0IiwiUElYSS5Qb29sLmxlbmd0aCIsIl9uZXdPYmoiLCJQSVhJLl9uZXdPYmoiLCJQSVhJLlNwZWVkUG9pbnQiLCJQSVhJLlNwZWVkUG9pbnQuY29uc3RydWN0b3IiLCJQSVhJLlNwZWVkUG9pbnQueCIsIlBJWEkuU3BlZWRQb2ludC55Il0sIm1hcHBpbmdzIjoiQUFBQTtBQUNB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QkpyVjtBQUFBQSxZQTZCQXFWLE9BQUFBLFVBQUFBLENBN0JBclY7QUFBQUEsU0FBQUEsQ0FBZ0NBLElBQUFBLENBQUFBLEtBQWhDQSxDQUFBQSxDQURRO0FBQUEsUUFDS0EsSUFBQUEsQ0FBQUEsVUFBQUEsR0FBVUEsVUFBVkEsQ0FETDtBQUFBLEtBQVosQ0FBT0EsSUFBQSxJQUFBLENBQUFBLElBQUEsR0FBSSxFQUFKLENBQVAiLCJmaWxlIjoidHVyYm9waXhpLmpzIiwic291cmNlc0NvbnRlbnQiOltudWxsLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9kZWZzL3BpeGkuanMuZC50c1wiIC8+XG5pZighUElYSSl7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdFeSEgV2hlcmUgaXMgcGl4aS5qcz8/Jyk7XG59XG5cbmNvbnN0IFBJWElfVkVSU0lPTl9SRVFVSVJFRCA9IFwiMy4wLjdcIjtcbmNvbnN0IFBJWElfVkVSU0lPTiA9IFBJWEkuVkVSU0lPTi5tYXRjaCgvXFxkLlxcZC5cXGQvKVswXTtcblxuaWYoUElYSV9WRVJTSU9OIDwgUElYSV9WRVJTSU9OX1JFUVVJUkVEKXtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJQaXhpLmpzIHZcIiArIFBJWEkuVkVSU0lPTiArIFwiIGl0J3Mgbm90IHN1cHBvcnRlZCwgcGxlYXNlIHVzZSBeXCIgKyBQSVhJX1ZFUlNJT05fUkVRVUlSRUQpO1xufVxuIiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi9BdWRpb01hbmFnZXIudHNcIiAvPlxudmFyIEhUTUxBdWRpbyA9IEF1ZGlvO1xubW9kdWxlIFBJWEkge1xuICAgIGV4cG9ydCBjbGFzcyBBdWRpb0xpbmUge1xuICAgICAgICBhdmFpbGFibGU6Ym9vbGVhbiA9IHRydWU7XG4gICAgICAgIGF1ZGlvOkF1ZGlvO1xuICAgICAgICBsb29wOmJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgcGF1c2VkOmJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgY2FsbGJhY2s6RnVuY3Rpb247XG4gICAgICAgIG11dGVkOmJvb2xlYW4gPSBmYWxzZTtcblxuICAgICAgICBzdGFydFRpbWU6bnVtYmVyID0gMDtcbiAgICAgICAgbGFzdFBhdXNlVGltZTpudW1iZXIgPSAwO1xuICAgICAgICBvZmZzZXRUaW1lOm51bWJlciA9IDA7XG5cbiAgICAgICAgcHJpdmF0ZSBfaHRtbEF1ZGlvOkhUTUxBdWRpb0VsZW1lbnQ7XG4gICAgICAgIHByaXZhdGUgX3dlYkF1ZGlvOkF1ZGlvQnVmZmVyU291cmNlTm9kZTtcblxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbWFuYWdlcjpBdWRpb01hbmFnZXIpe1xuICAgICAgICAgICAgaWYoIXRoaXMubWFuYWdlci5jb250ZXh0KXtcbiAgICAgICAgICAgICAgICB0aGlzLl9odG1sQXVkaW8gPSBuZXcgSFRNTEF1ZGlvKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5faHRtbEF1ZGlvLmFkZEV2ZW50TGlzdGVuZXIoJ2VuZGVkJywgdGhpcy5fb25FbmQuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzZXRBdWRpbyhhdWRpbzpBdWRpbywgbG9vcDpib29sZWFufEZ1bmN0aW9uLCBjYWxsYmFjaz86RnVuY3Rpb24pOkF1ZGlvTGluZXtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBsb29wID09PSBcImZ1bmN0aW9uXCIpe1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrID0gPEZ1bmN0aW9uPmxvb3A7XG4gICAgICAgICAgICAgICAgbG9vcCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmF1ZGlvID0gYXVkaW87XG4gICAgICAgICAgICB0aGlzLmF2YWlsYWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5sb29wID0gPGJvb2xlYW4+bG9vcDtcbiAgICAgICAgICAgIHRoaXMuY2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcGxheShwYXVzZT86Ym9vbGVhbik6QXVkaW9MaW5lIHtcbiAgICAgICAgICAgIGlmKCFwYXVzZSAmJiB0aGlzLnBhdXNlZClyZXR1cm4gdGhpcztcblxuICAgICAgICAgICAgaWYodGhpcy5tYW5hZ2VyLmNvbnRleHQpe1xuICAgICAgICAgICAgICAgIHRoaXMuX3dlYkF1ZGlvID0gdGhpcy5tYW5hZ2VyLmNvbnRleHQuY3JlYXRlQnVmZmVyU291cmNlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fd2ViQXVkaW8uc3RhcnQgPSB0aGlzLl93ZWJBdWRpby5zdGFydCB8fCB0aGlzLl93ZWJBdWRpby5ub3RlT247XG4gICAgICAgICAgICAgICAgdGhpcy5fd2ViQXVkaW8uc3RvcCA9IHRoaXMuX3dlYkF1ZGlvLnN0b3AgfHwgdGhpcy5fd2ViQXVkaW8ubm90ZU9mZjtcblxuICAgICAgICAgICAgICAgIHRoaXMuX3dlYkF1ZGlvLmJ1ZmZlciA9IHRoaXMuYXVkaW8uc291cmNlO1xuICAgICAgICAgICAgICAgIHRoaXMuX3dlYkF1ZGlvLmxvb3AgPSB0aGlzLmxvb3AgfHwgdGhpcy5hdWRpby5sb29wO1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRUaW1lID0gdGhpcy5tYW5hZ2VyLmNvbnRleHQuY3VycmVudFRpbWU7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl93ZWJBdWRpby5vbmVuZGVkID0gdGhpcy5fb25FbmQuYmluZCh0aGlzKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuX3dlYkF1ZGlvLmdhaW5Ob2RlID0gdGhpcy5tYW5hZ2VyLmNyZWF0ZUdhaW5Ob2RlKHRoaXMubWFuYWdlci5jb250ZXh0KTtcbiAgICAgICAgICAgICAgICB0aGlzLl93ZWJBdWRpby5nYWluTm9kZS5nYWluLnZhbHVlID0gKHRoaXMuYXVkaW8ubXV0ZWQgfHwgdGhpcy5tdXRlZCkgPyAwIDogdGhpcy5hdWRpby52b2x1bWU7XG4gICAgICAgICAgICAgICAgdGhpcy5fd2ViQXVkaW8uZ2Fpbk5vZGUuY29ubmVjdCh0aGlzLm1hbmFnZXIuZ2Fpbk5vZGUpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fd2ViQXVkaW8uY29ubmVjdCh0aGlzLl93ZWJBdWRpby5nYWluTm9kZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fd2ViQXVkaW8uc3RhcnQoMCwgKHBhdXNlKSA/IHRoaXMubGFzdFBhdXNlVGltZSA6IG51bGwpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgdGhpcy5faHRtbEF1ZGlvLnNyYyA9ICh0aGlzLmF1ZGlvLnNvdXJjZS5zcmMgIT09IFwiXCIpID8gdGhpcy5hdWRpby5zb3VyY2Uuc3JjIDogdGhpcy5hdWRpby5zb3VyY2UuY2hpbGRyZW5bMF0uc3JjO1xuICAgICAgICAgICAgICAgIHRoaXMuX2h0bWxBdWRpby5wcmVsb2FkID0gXCJhdXRvXCI7XG4gICAgICAgICAgICAgICAgdGhpcy5faHRtbEF1ZGlvLnZvbHVtZSA9ICh0aGlzLmF1ZGlvLm11dGVkIHx8IHRoaXMubXV0ZWQpID8gMCA6IHRoaXMuYXVkaW8udm9sdW1lO1xuICAgICAgICAgICAgICAgIHRoaXMuX2h0bWxBdWRpby5sb2FkKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5faHRtbEF1ZGlvLnBsYXkoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBzdG9wKCk6QXVkaW9MaW5lIHtcbiAgICAgICAgICAgIGlmKHRoaXMubWFuYWdlci5jb250ZXh0KXtcbiAgICAgICAgICAgICAgICB0aGlzLl93ZWJBdWRpby5zdG9wKDApO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgdGhpcy5faHRtbEF1ZGlvLnBhdXNlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5faHRtbEF1ZGlvLmN1cnJlbnRUaW1lID0gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwYXVzZSgpOkF1ZGlvTGluZXtcbiAgICAgICAgICAgIGlmKHRoaXMubWFuYWdlci5jb250ZXh0KXtcbiAgICAgICAgICAgICAgICB0aGlzLm9mZnNldFRpbWUgKz0gdGhpcy5tYW5hZ2VyLmNvbnRleHQuY3VycmVudFRpbWUgLSB0aGlzLnN0YXJ0VGltZTtcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RQYXVzZVRpbWUgPSB0aGlzLm9mZnNldFRpbWUldGhpcy5fd2ViQXVkaW8uYnVmZmVyLmR1cmF0aW9uO1xuICAgICAgICAgICAgICAgIHRoaXMuX3dlYkF1ZGlvLnN0b3AoMCk7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICB0aGlzLl9odG1sQXVkaW8ucGF1c2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucGF1c2VkID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzdW1lKCk6QXVkaW9MaW5le1xuICAgICAgICAgICAgaWYodGhpcy5wYXVzZWQpe1xuICAgICAgICAgICAgICAgIGlmKHRoaXMubWFuYWdlci5jb250ZXh0KXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbGF5KHRydWUpO1xuICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9odG1sQXVkaW8ucGxheSgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMucGF1c2VkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIG11dGUoKTpBdWRpb0xpbmV7XG4gICAgICAgICAgICB0aGlzLm11dGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmKHRoaXMubWFuYWdlci5jb250ZXh0KXtcbiAgICAgICAgICAgICAgICB0aGlzLl93ZWJBdWRpby5nYWluTm9kZS5nYWluLnZhbHVlID0gMDtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHRoaXMuX2h0bWxBdWRpby52b2x1bWUgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICB1bm11dGUoKTpBdWRpb0xpbmV7XG4gICAgICAgICAgICB0aGlzLm11dGVkID0gZmFsc2U7XG4gICAgICAgICAgICBpZih0aGlzLm1hbmFnZXIuY29udGV4dCl7XG4gICAgICAgICAgICAgICAgdGhpcy5fd2ViQXVkaW8uZ2Fpbk5vZGUuZ2Fpbi52YWx1ZSA9IHRoaXMuYXVkaW8udm9sdW1lO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgdGhpcy5faHRtbEF1ZGlvLnZvbHVtZSA9IHRoaXMuYXVkaW8udm9sdW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICB2b2x1bWUodmFsdWU6bnVtYmVyKTpBdWRpb0xpbmV7XG4gICAgICAgICAgICBpZih0aGlzLm1hbmFnZXIuY29udGV4dCl7XG4gICAgICAgICAgICAgICAgdGhpcy5fd2ViQXVkaW8uZ2Fpbk5vZGUuZ2Fpbi52YWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgdGhpcy5faHRtbEF1ZGlvLnZvbHVtZSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICByZXNldCgpOkF1ZGlvTGluZXtcbiAgICAgICAgICAgIHRoaXMuYXZhaWxhYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuYXVkaW8gPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5sb29wID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmNhbGxiYWNrID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMucGF1c2VkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLm11dGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLl93ZWJBdWRpbyA9IG51bGw7XG5cbiAgICAgICAgICAgIHRoaXMuc3RhcnRUaW1lID0gMDtcbiAgICAgICAgICAgIHRoaXMubGFzdFBhdXNlVGltZSA9IDA7XG4gICAgICAgICAgICB0aGlzLm9mZnNldFRpbWUgPSAwO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9vbkVuZCgpOnZvaWR7XG4gICAgICAgICAgICBpZih0aGlzLmNhbGxiYWNrKXRoaXMuY2FsbGJhY2sodGhpcy5tYW5hZ2VyLCB0aGlzLmF1ZGlvKTtcbiAgICAgICAgICAgIGlmKCF0aGlzLm1hbmFnZXIuY29udGV4dCl7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5sb29wIHx8IHRoaXMuYXVkaW8ubG9vcCl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2h0bWxBdWRpby5jdXJyZW50VGltZSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2h0bWxBdWRpby5wbGF5KCk7XG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9ZWxzZSBpZih0aGlzLm1hbmFnZXIuY29udGV4dCAmJiAhdGhpcy5wYXVzZWQpe1xuICAgICAgICAgICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxufVxuXG5pbnRlcmZhY2UgQXVkaW9CdWZmZXJTb3VyY2VOb2RlIHtcbiAgICBub3RlT24oKTpBdWRpb0J1ZmZlclNvdXJjZU5vZGU7XG4gICAgbm90ZU9mZigpOkF1ZGlvQnVmZmVyU291cmNlTm9kZTtcbiAgICBzb3VyY2U6QXVkaW9CdWZmZXI7XG4gICAgZ2Fpbk5vZGU6R2Fpbk5vZGU7XG59IiwibW9kdWxlIFBJWEkge1xuICAgIGV4cG9ydCBlbnVtIEdBTUVfU0NBTEVfVFlQRSB7XG4gICAgICAgIE5PTkUsXG4gICAgICAgIEZJTEwsXG4gICAgICAgIEFTUEVDVF9GSVQsXG4gICAgICAgIEFTUEVDVF9GSUxMXG4gICAgfVxuXG4gICAgZXhwb3J0IGVudW0gQVVESU9fVFlQRSB7XG4gICAgICAgIFVOS05PV04sXG4gICAgICAgIFdFQkFVRElPLFxuICAgICAgICBIVE1MQVVESU9cbiAgICB9XG5cbiAgICBleHBvcnQgdmFyIHpJbmRleEVuYWJsZWQ6Ym9vbGVhbiA9IHRydWU7XG59IiwiLy9NYW55IGNoZWNrcyBhcmUgYmFzZWQgb24gaHR0cHM6Ly9naXRodWIuY29tL2FyYXNhdGFzYXlnaW4vaXMuanMvYmxvYi9tYXN0ZXIvaXMuanNcblxubW9kdWxlIFBJWEkge1xuICAgIGV4cG9ydCBtb2R1bGUgRGV2aWNlIHtcbiAgICAgICAgdmFyIG5hdmlnYXRvcjpOYXZpZ2F0b3IgPSB3aW5kb3cubmF2aWdhdG9yO1xuICAgICAgICB2YXIgZG9jdW1lbnQ6RG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG5cbiAgICAgICAgdmFyIHVzZXJBZ2VudDpzdHJpbmcgPSAnbmF2aWdhdG9yJyBpbiB3aW5kb3cgJiYgJ3VzZXJBZ2VudCcgaW4gbmF2aWdhdG9yICYmIG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKSB8fCAnJyxcbiAgICAgICAgICAgIHZlbmRvcjpzdHJpbmcgPSAnbmF2aWdhdG9yJyBpbiB3aW5kb3cgJiYgJ3ZlbmRvcicgaW4gbmF2aWdhdG9yICYmIG5hdmlnYXRvci52ZW5kb3IudG9Mb3dlckNhc2UoKSB8fCAnJyxcbiAgICAgICAgICAgIGFwcFZlcnNpb246c3RyaW5nID0gJ25hdmlnYXRvcicgaW4gd2luZG93ICYmICdhcHBWZXJzaW9uJyBpbiBuYXZpZ2F0b3IgJiYgbmF2aWdhdG9yLmFwcFZlcnNpb24udG9Mb3dlckNhc2UoKSB8fCAnJztcblxuICAgICAgICAvL0Jyb3dzZXJzXG4gICAgICAgIGV4cG9ydCB2YXIgaXNDaHJvbWU6Ym9vbGVhbiA9IC9jaHJvbWV8Y2hyb21pdW0vaS50ZXN0KHVzZXJBZ2VudCkgJiYgL2dvb2dsZSBpbmMvLnRlc3QodmVuZG9yKSxcbiAgICAgICAgICAgIGlzRmlyZWZveDpib29sZWFuID0gL2ZpcmVmb3gvaS50ZXN0KHVzZXJBZ2VudCksXG4gICAgICAgICAgICBpc0lFOmJvb2xlYW4gPSAvbXNpZS9pLnRlc3QodXNlckFnZW50KSB8fCBcIkFjdGl2ZVhPYmplY3RcIiBpbiB3aW5kb3csXG4gICAgICAgICAgICBpc09wZXJhOmJvb2xlYW4gPSAvXk9wZXJhXFwvLy50ZXN0KHVzZXJBZ2VudCkgfHwgL1xceDIwT1BSXFwvLy50ZXN0KHVzZXJBZ2VudCksXG4gICAgICAgICAgICBpc1NhZmFyaTpib29sZWFuID0gL3NhZmFyaS9pLnRlc3QodXNlckFnZW50KSAmJiAvYXBwbGUgY29tcHV0ZXIvaS50ZXN0KHZlbmRvcik7XG5cbiAgICAgICAgLy9EZXZpY2VzICYmIE9TXG4gICAgICAgIGV4cG9ydCB2YXIgaXNJcGhvbmU6Ym9vbGVhbiA9IC9pcGhvbmUvaS50ZXN0KHVzZXJBZ2VudCksXG4gICAgICAgICAgICBpc0lwYWQ6Ym9vbGVhbiA9IC9pcGFkL2kudGVzdCh1c2VyQWdlbnQpLFxuICAgICAgICAgICAgaXNJcG9kOmJvb2xlYW4gPSAvaXBvZC9pLnRlc3QodXNlckFnZW50KSxcbiAgICAgICAgICAgIGlzQW5kcm9pZDpib29sZWFuID0gL2FuZHJvaWQvaS50ZXN0KHVzZXJBZ2VudCksXG4gICAgICAgICAgICBpc0FuZHJvaWRQaG9uZTpib29sZWFuID0gL2FuZHJvaWQvaS50ZXN0KHVzZXJBZ2VudCkgJiYgL21vYmlsZS9pLnRlc3QodXNlckFnZW50KSxcbiAgICAgICAgICAgIGlzQW5kcm9pZFRhYmxldDpib29sZWFuID0gL2FuZHJvaWQvaS50ZXN0KHVzZXJBZ2VudCkgJiYgIS9tb2JpbGUvaS50ZXN0KHVzZXJBZ2VudCksXG4gICAgICAgICAgICBpc0xpbnV4OmJvb2xlYW4gPSAvbGludXgvaS50ZXN0KGFwcFZlcnNpb24pLFxuICAgICAgICAgICAgaXNNYWM6Ym9vbGVhbiA9IC9tYWMvaS50ZXN0KGFwcFZlcnNpb24pLFxuICAgICAgICAgICAgaXNXaW5kb3c6Ym9vbGVhbiA9IC93aW4vaS50ZXN0KGFwcFZlcnNpb24pLFxuICAgICAgICAgICAgaXNXaW5kb3dQaG9uZTpib29sZWFuID0gaXNXaW5kb3cgJiYgL3Bob25lL2kudGVzdCh1c2VyQWdlbnQpLFxuICAgICAgICAgICAgaXNXaW5kb3dUYWJsZXQ6Ym9vbGVhbiA9IGlzV2luZG93ICYmICFpc1dpbmRvd1Bob25lICYmIC90b3VjaC9pLnRlc3QodXNlckFnZW50KSxcbiAgICAgICAgICAgIGlzTW9iaWxlOmJvb2xlYW4gPSBpc0lwaG9uZSB8fCBpc0lwb2R8fCBpc0FuZHJvaWRQaG9uZSB8fCBpc1dpbmRvd1Bob25lLFxuICAgICAgICAgICAgaXNUYWJsZXQ6Ym9vbGVhbiA9IGlzSXBhZCB8fCBpc0FuZHJvaWRUYWJsZXQgfHwgaXNXaW5kb3dUYWJsZXQsXG4gICAgICAgICAgICBpc0Rlc2t0b3A6Ym9vbGVhbiA9ICFpc01vYmlsZSAmJiAhaXNUYWJsZXQsXG4gICAgICAgICAgICBpc1RvdWNoRGV2aWNlOmJvb2xlYW4gPSAnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cgfHwnRG9jdW1lbnRUb3VjaCcgaW4gd2luZG93ICYmIGRvY3VtZW50IGluc3RhbmNlb2YgRG9jdW1lbnRUb3VjaCxcbiAgICAgICAgICAgIGlzQ29jb29uOmJvb2xlYW4gPSAhIW5hdmlnYXRvci5pc0NvY29vbkpTLFxuICAgICAgICAgICAgaXNOb2RlV2Via2l0OmJvb2xlYW4gPSAhISh0eXBlb2YgcHJvY2VzcyA9PT0gXCJvYmplY3RcIiAmJiBwcm9jZXNzLnRpdGxlID09PSBcIm5vZGVcIiAmJiB0eXBlb2YgZ2xvYmFsID09PSBcIm9iamVjdFwiKSxcbiAgICAgICAgICAgIGlzRWplY3RhOmJvb2xlYW4gPSAhIXdpbmRvdy5lamVjdGEsXG4gICAgICAgICAgICBpc0Nyb3Nzd2Fsazpib29sZWFuID0gL0Nyb3Nzd2Fsay8udGVzdCh1c2VyQWdlbnQpLFxuICAgICAgICAgICAgaXNDb3Jkb3ZhOmJvb2xlYW4gPSAhIXdpbmRvdy5jb3Jkb3ZhLFxuICAgICAgICAgICAgaXNFbGVjdHJvbjpib29sZWFuID0gISEodHlwZW9mIHByb2Nlc3MgPT09IFwib2JqZWN0XCIgJiYgcHJvY2Vzcy52ZXJzaW9ucyAmJiAocHJvY2Vzcy52ZXJzaW9ucy5lbGVjdHJvbiB8fCBwcm9jZXNzLnZlcnNpb25zWydhdG9tLXNoZWxsJ10pKTtcblxuICAgICAgICBuYXZpZ2F0b3IudmlicmF0ZSA9IG5hdmlnYXRvci52aWJyYXRlIHx8IG5hdmlnYXRvci53ZWJraXRWaWJyYXRlIHx8IG5hdmlnYXRvci5tb3pWaWJyYXRlIHx8IG5hdmlnYXRvci5tc1ZpYnJhdGUgfHwgbnVsbDtcbiAgICAgICAgZXhwb3J0IHZhciBpc1ZpYnJhdGVTdXBwb3J0ZWQ6Ym9vbGVhbiA9ICEhbmF2aWdhdG9yLnZpYnJhdGUgJiYgKGlzTW9iaWxlIHx8IGlzVGFibGV0KSxcbiAgICAgICAgICAgIGlzTW91c2VXaGVlbFN1cHBvcnRlZDpib29sZWFuID0gJ29ud2hlZWwnIGluIHdpbmRvdyB8fCAnb25tb3VzZXdoZWVsJyBpbiB3aW5kb3cgfHwgJ01vdXNlU2Nyb2xsRXZlbnQnIGluIHdpbmRvdyxcbiAgICAgICAgICAgIGlzQWNjZWxlcm9tZXRlclN1cHBvcnRlZDpib29sZWFuID0gJ0RldmljZU1vdGlvbkV2ZW50JyBpbiB3aW5kb3csXG4gICAgICAgICAgICBpc0dhbWVwYWRTdXBwb3J0ZWQ6Ym9vbGVhbiA9ICEhbmF2aWdhdG9yLmdldEdhbWVwYWRzIHx8ICEhbmF2aWdhdG9yLndlYmtpdEdldEdhbWVwYWRzO1xuXG4gICAgICAgIC8vRnVsbFNjcmVlblxuICAgICAgICB2YXIgZGl2OkhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHZhciBmdWxsU2NyZWVuUmVxdWVzdFZlbmRvcjphbnkgPSBkaXYucmVxdWVzdEZ1bGxzY3JlZW4gfHwgZGl2LndlYmtpdFJlcXVlc3RGdWxsU2NyZWVuIHx8IGRpdi5tc1JlcXVlc3RGdWxsU2NyZWVuIHx8IGRpdi5tb3pSZXF1ZXN0RnVsbFNjcmVlbixcbiAgICAgICAgICAgIGZ1bGxTY3JlZW5DYW5jZWxWZW5kb3I6YW55ID0gZG9jdW1lbnQuY2FuY2VsRnVsbFNjcmVlbiB8fCBkb2N1bWVudC5leGl0RnVsbFNjcmVlbiB8fCBkb2N1bWVudC53ZWJraXRDYW5jZWxGdWxsU2NyZWVuIHx8IGRvY3VtZW50Lm1zQ2FuY2VsRnVsbFNjcmVlbiB8fCBkb2N1bWVudC5tb3pDYW5jZWxGdWxsU2NyZWVuO1xuXG4gICAgICAgIGV4cG9ydCB2YXIgaXNGdWxsU2NyZWVuU3VwcG9ydGVkOmJvb2xlYW4gPSAhIShmdWxsU2NyZWVuUmVxdWVzdCAmJiBmdWxsU2NyZWVuQ2FuY2VsKSxcbiAgICAgICAgICAgIGZ1bGxTY3JlZW5SZXF1ZXN0OnN0cmluZyA9IChmdWxsU2NyZWVuUmVxdWVzdFZlbmRvcikgPyBmdWxsU2NyZWVuUmVxdWVzdFZlbmRvci5uYW1lIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgZnVsbFNjcmVlbkNhbmNlbDpzdHJpbmcgPSAoZnVsbFNjcmVlbkNhbmNlbFZlbmRvcikgPyBmdWxsU2NyZWVuQ2FuY2VsVmVuZG9yLm5hbWUgOiB1bmRlZmluZWQ7XG5cbiAgICAgICAgLy9BdWRpb1xuICAgICAgICBleHBvcnQgdmFyIGlzSFRNTEF1ZGlvU3VwcG9ydGVkOmJvb2xlYW4gPSAhIXdpbmRvdy5BdWRpbyxcbiAgICAgICAgICAgIHdlYkF1ZGlvQ29udGV4dDphbnkgPSB3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQsXG4gICAgICAgICAgICBpc1dlYkF1ZGlvU3VwcG9ydGVkOmJvb2xlYW4gPSAhIXdlYkF1ZGlvQ29udGV4dCxcbiAgICAgICAgICAgIGlzQXVkaW9TdXBwb3J0ZWQ6Ym9vbGVhbiA9IGlzV2ViQXVkaW9TdXBwb3J0ZWQgfHwgaXNIVE1MQXVkaW9TdXBwb3J0ZWQsXG4gICAgICAgICAgICBpc01wM1N1cHBvcnRlZDpib29sZWFuID0gZmFsc2UsXG4gICAgICAgICAgICBpc09nZ1N1cHBvcnRlZDpib29sZWFuID0gZmFsc2UsXG4gICAgICAgICAgICBpc1dhdlN1cHBvcnRlZDpib29sZWFuID0gZmFsc2UsXG4gICAgICAgICAgICBpc000YVN1cHBvcnRlZDpib29sZWFuID0gZmFsc2UsXG4gICAgICAgICAgICBnbG9iYWxXZWJBdWRpb0NvbnRleHQ6QXVkaW9Db250ZXh0ID0gKGlzV2ViQXVkaW9TdXBwb3J0ZWQpID8gbmV3IHdlYkF1ZGlvQ29udGV4dCgpIDogdW5kZWZpbmVkO1xuXG4gICAgICAgIC8vQXVkaW8gbWltZVR5cGVzXG4gICAgICAgIGlmKGlzQXVkaW9TdXBwb3J0ZWQpe1xuICAgICAgICAgICAgdmFyIGF1ZGlvOkhUTUxBdWRpb0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhdWRpbycpO1xuICAgICAgICAgICAgaXNNcDNTdXBwb3J0ZWQgPSBhdWRpby5jYW5QbGF5VHlwZSgnYXVkaW8vbXBlZzsnKSAhPT0gXCJcIjtcbiAgICAgICAgICAgIGlzT2dnU3VwcG9ydGVkID0gYXVkaW8uY2FuUGxheVR5cGUoJ2F1ZGlvL29nZzsgY29kZWNzPVwidm9yYmlzXCInKSAhPT0gXCJcIjtcbiAgICAgICAgICAgIGlzV2F2U3VwcG9ydGVkID0gYXVkaW8uY2FuUGxheVR5cGUoJ2F1ZGlvL3dhdicpICE9PSBcIlwiO1xuICAgICAgICAgICAgaXNNNGFTdXBwb3J0ZWQgPSBhdWRpby5jYW5QbGF5VHlwZSgnYXVkaW8vbXA0OyBjb2RlY3M9XCJtcDRhLjQwLjVcIicpICE9PSBcIlwiO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIGdldE1vdXNlV2hlZWxFdmVudCgpOnN0cmluZ3tcbiAgICAgICAgICAgIGlmKCFpc01vdXNlV2hlZWxTdXBwb3J0ZWQpcmV0dXJuO1xuICAgICAgICAgICAgdmFyIGV2dDpzdHJpbmc7XG4gICAgICAgICAgICBpZignb253aGVlbCcgaW4gd2luZG93KXtcbiAgICAgICAgICAgICAgICBldnQgPSAnd2hlZWwnO1xuICAgICAgICAgICAgfWVsc2UgaWYoJ29ubW91c2V3aGVlbCcgaW4gd2luZG93KXtcbiAgICAgICAgICAgICAgICBldnQgPSAnbW91c2V3aGVlbCc7XG4gICAgICAgICAgICB9ZWxzZSBpZignTW91c2VTY3JvbGxFdmVudCcgaW4gd2luZG93KXtcbiAgICAgICAgICAgICAgICBldnQgPSAnRE9NTW91c2VTY3JvbGwnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZXZ0O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIHZpYnJhdGUocGF0dGVybjogbnVtYmVyIHwgbnVtYmVyW10pOnZvaWR7XG4gICAgICAgICAgICBpZihpc1ZpYnJhdGVTdXBwb3J0ZWQpe1xuICAgICAgICAgICAgICAgIG5hdmlnYXRvci52aWJyYXRlKHBhdHRlcm4pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIGdldFZpc2liaWxpdHlDaGFuZ2VFdmVudCgpOnN0cmluZ3tcbiAgICAgICAgICAgIGlmKHR5cGVvZiBkb2N1bWVudC5oaWRkZW4gIT09ICd1bmRlZmluZWQnKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ3Zpc2liaWxpdHljaGFuZ2UnO1xuICAgICAgICAgICAgfWVsc2UgaWYodHlwZW9mIGRvY3VtZW50LndlYmtpdEhpZGRlbiAhPT0gJ3VuZGVmaW5lZCcpe1xuICAgICAgICAgICAgICAgIHJldHVybiAnd2Via2l0dmlzaWJpbGl0eWNoYW5nZSc7XG4gICAgICAgICAgICB9ZWxzZSBpZih0eXBlb2YgZG9jdW1lbnQubW96SGlkZGVuICE9PSAndW5kZWZpbmVkJyl7XG4gICAgICAgICAgICAgICAgcmV0dXJuICdtb3p2aXNpYmlsaXR5Y2hhbmdlJztcbiAgICAgICAgICAgIH1lbHNlIGlmKHR5cGVvZiBkb2N1bWVudC5tc0hpZGRlbiAhPT0gJ3VuZGVmaW5lZCcpe1xuICAgICAgICAgICAgICAgIHJldHVybiAnbXN2aXNpYmlsaXR5Y2hhbmdlJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBpc09ubGluZSgpOmJvb2xlYW57XG4gICAgICAgICAgICByZXR1cm4gd2luZG93Lm5hdmlnYXRvci5vbkxpbmU7XG4gICAgICAgIH1cblxuXG4gICAgfVxufVxuXG5kZWNsYXJlIHZhciBwcm9jZXNzOmFueSxcbiAgICBEb2N1bWVudFRvdWNoOmFueSxcbiAgICBnbG9iYWw6YW55O1xuXG5pbnRlcmZhY2UgTmF2aWdhdG9yIHtcbiAgICBpc0NvY29vbkpTOmFueTtcbiAgICB2aWJyYXRlKHBhdHRlcm46IG51bWJlciB8IG51bWJlcltdKTpib29sZWFuO1xuICAgIGdldEdhbWVwYWRzKCk6YW55O1xuICAgIHdlYmtpdEdldEdhbWVwYWRzKCk6YW55O1xuICAgIHdlYmtpdFZpYnJhdGUoKTphbnk7XG4gICAgbW96VmlicmF0ZSgpOmFueTtcbiAgICBtc1ZpYnJhdGUoKTphbnk7XG59XG5cbmludGVyZmFjZSBXaW5kb3cge1xuICAgIGVqZWN0YTphbnk7XG4gICAgY29yZG92YTphbnk7XG4gICAgQXVkaW8oKTpIVE1MQXVkaW9FbGVtZW50O1xuICAgIEF1ZGlvQ29udGV4dCgpOmFueTtcbiAgICB3ZWJraXRBdWRpb0NvbnRleHQoKTphbnk7XG59XG5cbmludGVyZmFjZSBmdWxsU2NyZWVuRGF0YSB7XG4gICAgbmFtZTpzdHJpbmc7XG59XG5cbmludGVyZmFjZSBEb2N1bWVudCB7XG4gICAgY2FuY2VsRnVsbFNjcmVlbigpOmZ1bGxTY3JlZW5EYXRhIDtcbiAgICBleGl0RnVsbFNjcmVlbigpOmZ1bGxTY3JlZW5EYXRhIDtcbiAgICB3ZWJraXRDYW5jZWxGdWxsU2NyZWVuKCk6ZnVsbFNjcmVlbkRhdGEgO1xuICAgIG1zQ2FuY2VsRnVsbFNjcmVlbigpOmZ1bGxTY3JlZW5EYXRhIDtcbiAgICBtb3pDYW5jZWxGdWxsU2NyZWVuKCk6ZnVsbFNjcmVlbkRhdGEgO1xuICAgIHdlYmtpdEhpZGRlbjphbnk7XG4gICAgbW96SGlkZGVuOmFueTtcbn1cblxuaW50ZXJmYWNlIEhUTUxEaXZFbGVtZW50IHtcbiAgICByZXF1ZXN0RnVsbHNjcmVlbigpOmZ1bGxTY3JlZW5EYXRhIDtcbiAgICB3ZWJraXRSZXF1ZXN0RnVsbFNjcmVlbigpOmZ1bGxTY3JlZW5EYXRhIDtcbiAgICBtc1JlcXVlc3RGdWxsU2NyZWVuKCk6ZnVsbFNjcmVlbkRhdGEgO1xuICAgIG1velJlcXVlc3RGdWxsU2NyZWVuKCk6ZnVsbFNjcmVlbkRhdGEgO1xufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2RlZnMvcGl4aS5qcy5kLnRzXCIgLz5cbm1vZHVsZSBQSVhJIHtcbiAgICBleHBvcnQgY2xhc3MgQ2FtZXJhIGV4dGVuZHMgQ29udGFpbmVyIHtcbiAgICAgICAgdmlzaWJsZTpib29sZWFuID0gZmFsc2U7XG4gICAgICAgIF9lbmFibGVkOmJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgekluZGV4Om51bWJlciA9IEluZmluaXR5O1xuICAgICAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZShkZWx0YVRpbWU6bnVtYmVyKTpDYW1lcmF7XG4gICAgICAgICAgICBpZighdGhpcy5lbmFibGVkKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc3VwZXIudXBkYXRlKGRlbHRhVGltZSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBlbmFibGVkKCk6Ym9vbGVhbntcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9lbmFibGVkO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0IGVuYWJsZWQodmFsdWU6Ym9vbGVhbil7XG4gICAgICAgICAgICB0aGlzLl9lbmFibGVkID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLnZpc2libGUgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9kZWZzL3BpeGkuanMuZC50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuL1RpbWVyTWFuYWdlci50c1wiIC8+XG5tb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IGNsYXNzIFRpbWVyIHtcbiAgICAgICAgYWN0aXZlOmJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgaXNFbmRlZDpib29sZWFuID0gZmFsc2U7XG4gICAgICAgIGlzU3RhcnRlZDpib29sZWFuID0gZmFsc2U7XG4gICAgICAgIGV4cGlyZTpib29sZWFuID0gZmFsc2U7XG4gICAgICAgIGRlbGF5Om51bWJlciA9IDA7XG4gICAgICAgIHJlcGVhdDpudW1iZXIgPSAwO1xuICAgICAgICBsb29wOmJvb2xlYW4gPSBmYWxzZTtcblxuICAgICAgICBwcml2YXRlIF9kZWxheVRpbWU6bnVtYmVyID0gMDtcbiAgICAgICAgcHJpdmF0ZSBfZWxhcHNlZFRpbWU6bnVtYmVyID0gMDtcbiAgICAgICAgcHJpdmF0ZSBfcmVwZWF0Om51bWJlciA9IDA7XG5cbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIHRpbWU6bnVtYmVyID0gMSwgcHVibGljIG1hbmFnZXI/OlRpbWVyTWFuYWdlcil7XG4gICAgICAgICAgICBpZih0aGlzLm1hbmFnZXIpe1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkVG8odGhpcy5tYW5hZ2VyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZShkZWx0YVRpbWU6bnVtYmVyKTpUaW1lcntcbiAgICAgICAgICAgIGlmKCF0aGlzLmFjdGl2ZSlyZXR1cm4gdGhpcztcbiAgICAgICAgICAgIHZhciBkZWx0YU1TOm51bWJlciA9IGRlbHRhVGltZSoxMDAwO1xuXG4gICAgICAgICAgICBpZih0aGlzLmRlbGF5ID4gdGhpcy5fZGVsYXlUaW1lKXtcbiAgICAgICAgICAgICAgICB0aGlzLl9kZWxheVRpbWUgKz0gZGVsdGFNUztcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoIXRoaXMuaXNTdGFydGVkKXtcbiAgICAgICAgICAgICAgICB0aGlzLmlzU3RhcnRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5fb25UaW1lclN0YXJ0KHRoaXMuX2VsYXBzZWRUaW1lLCBkZWx0YVRpbWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZih0aGlzLnRpbWUgPiB0aGlzLl9lbGFwc2VkVGltZSl7XG4gICAgICAgICAgICAgICAgdmFyIHQ6bnVtYmVyID0gdGhpcy5fZWxhcHNlZFRpbWUrZGVsdGFNUztcbiAgICAgICAgICAgICAgICB2YXIgZW5kZWQ6Ym9vbGVhbiA9ICh0Pj10aGlzLnRpbWUpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fZWxhcHNlZFRpbWUgPSAoZW5kZWQpID8gdGhpcy50aW1lIDogdDtcbiAgICAgICAgICAgICAgICB0aGlzLl9vblRpbWVyVXBkYXRlKHRoaXMuX2VsYXBzZWRUaW1lLCBkZWx0YVRpbWUpO1xuXG4gICAgICAgICAgICAgICAgaWYoZW5kZWQpe1xuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmxvb3AgfHwgdGhpcy5yZXBlYXQgPiB0aGlzLl9yZXBlYXQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVwZWF0Kys7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9vblRpbWVyUmVwZWF0KHRoaXMuX2VsYXBzZWRUaW1lLCBkZWx0YVRpbWUsIHRoaXMuX3JlcGVhdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGFwc2VkVGltZSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNFbmRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWN0aXZlICA9ZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX29uVGltZXJFbmQodGhpcy5fZWxhcHNlZFRpbWUsIGRlbHRhVGltZSk7XG4gICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgYWRkVG8odGltZXJNYW5hZ2VyOlRpbWVyTWFuYWdlcik6VGltZXIge1xuICAgICAgICAgICAgdGltZXJNYW5hZ2VyLmFkZFRpbWVyKHRoaXMpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICByZW1vdmUoKTpUaW1lcntcbiAgICAgICAgICAgIGlmKCF0aGlzLm1hbmFnZXIpe1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRpbWVyIHdpdGhvdXQgbWFuYWdlci5cIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5yZW1vdmVUaW1lcih0aGlzKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhcnQoKTpUaW1lcntcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RvcCgpOlRpbWVye1xuICAgICAgICAgICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuX29uVGltZXJTdG9wKHRoaXMuX2VsYXBzZWRUaW1lKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzZXQoKTpUaW1lcntcbiAgICAgICAgICAgIHRoaXMuX2VsYXBzZWRUaW1lID0gMDtcbiAgICAgICAgICAgIHRoaXMuX3JlcGVhdCA9IDA7XG4gICAgICAgICAgICB0aGlzLl9kZWxheVRpbWUgPSAwO1xuICAgICAgICAgICAgdGhpcy5pc1N0YXJ0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuaXNFbmRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBvblN0YXJ0KGNhbGxiYWNrOkZ1bmN0aW9uKTpUaW1lcntcbiAgICAgICAgICAgIHRoaXMuX29uVGltZXJTdGFydCA9IDxhbnk+Y2FsbGJhY2s7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIG9uRW5kKGNhbGxiYWNrOkZ1bmN0aW9uKTpUaW1lcntcbiAgICAgICAgICAgIHRoaXMuX29uVGltZXJFbmQgPSA8YW55PmNhbGxiYWNrO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBvblN0b3AoY2FsbGJhY2s6RnVuY3Rpb24pOlRpbWVye1xuICAgICAgICAgICAgdGhpcy5fb25UaW1lclN0b3AgPSA8YW55PmNhbGxiYWNrO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBvblVwZGF0ZShjYWxsYmFjazpGdW5jdGlvbik6VGltZXJ7XG4gICAgICAgICAgICB0aGlzLl9vblRpbWVyVXBkYXRlID0gPGFueT5jYWxsYmFjaztcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgb25SZXBlYXQoY2FsbGJhY2s6RnVuY3Rpb24pOlRpbWVye1xuICAgICAgICAgICAgdGhpcy5fb25UaW1lclJlcGVhdCA9IDxhbnk+Y2FsbGJhY2s7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX29uVGltZXJTdGFydChlbGFwc2VkVGltZTpudW1iZXIsIGRlbHRhVGltZTpudW1iZXIpOnZvaWR7fVxuICAgICAgICBwcml2YXRlIF9vblRpbWVyU3RvcChlbGFwc2VkVGltZTpudW1iZXIpOnZvaWR7fVxuICAgICAgICBwcml2YXRlIF9vblRpbWVyUmVwZWF0KGVsYXBzZWRUaW1lOm51bWJlciwgZGVsdGFUaW1lOm51bWJlciwgcmVwZWF0Om51bWJlcik6dm9pZHt9XG4gICAgICAgIHByaXZhdGUgX29uVGltZXJVcGRhdGUoZWxhcHNlZFRpbWU6bnVtYmVyLCBkZWx0YVRpbWU6bnVtYmVyKTp2b2lke31cbiAgICAgICAgcHJpdmF0ZSBfb25UaW1lckVuZChlbGFwc2VkVGltZTpudW1iZXIsIGRlbHRhVGltZTpudW1iZXIpOnZvaWR7fVxuICAgIH1cbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9kZWZzL3BpeGkuanMuZC50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuL1RpbWVyLnRzXCIgLz5cbm1vZHVsZSBQSVhJIHtcbiAgICBleHBvcnQgY2xhc3MgVGltZXJNYW5hZ2VyIHtcbiAgICAgICAgdGltZXJzOlRpbWVyW10gPSBbXTtcbiAgICAgICAgX3RvRGVsZXRlOlRpbWVyW10gPSBbXTtcblxuICAgICAgICBjb25zdHJ1Y3Rvcigpe31cblxuICAgICAgICB1cGRhdGUoZGVsdGFUaW1lOm51bWJlcik6VGltZXJNYW5hZ2Vye1xuICAgICAgICAgICAgZm9yKHZhciBpOm51bWJlciA9IDA7IGkgPCB0aGlzLnRpbWVycy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgaWYodGhpcy50aW1lcnNbaV0uYWN0aXZlKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50aW1lcnNbaV0udXBkYXRlKGRlbHRhVGltZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMudGltZXJzW2ldLmlzRW5kZWQgJiYgdGhpcy50aW1lcnNbaV0uZXhwaXJlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGltZXJzW2ldLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZih0aGlzLl90b0RlbGV0ZS5sZW5ndGgpe1xuICAgICAgICAgICAgICAgIGZvcihpID0gMDsgaSA8IHRoaXMuX3RvRGVsZXRlLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVtb3ZlKHRoaXMuX3RvRGVsZXRlW2ldKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLl90b0RlbGV0ZS5sZW5ndGggPSAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZVRpbWVyKHRpbWVyOlRpbWVyKTpUaW1lck1hbmFnZXJ7XG4gICAgICAgICAgICB0aGlzLl90b0RlbGV0ZS5wdXNoKHRpbWVyKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgYWRkVGltZXIodGltZXI6VGltZXIpOlRpbWVye1xuICAgICAgICAgICAgdGltZXIubWFuYWdlciA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLnRpbWVycy5wdXNoKHRpbWVyKTtcbiAgICAgICAgICAgIHJldHVybiB0aW1lcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNyZWF0ZVRpbWVyKHRpbWU/Om51bWJlcil7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFRpbWVyKHRpbWUsIHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfcmVtb3ZlKHRpbWVyOlRpbWVyKTp2b2lke1xuICAgICAgICAgICAgdmFyIGluZGV4Om51bWJlciA9IHRoaXMudGltZXJzLmluZGV4T2YodGltZXIpO1xuICAgICAgICAgICAgaWYoaW5kZXggPj0gMCl0aGlzLnRpbWVycy5zcGxpY2UoaW5kZXgsMSk7XG4gICAgICAgIH1cbiAgICB9XG59IiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vZGVmcy9waXhpLmpzLmQudHNcIiAvPlxubW9kdWxlIFBJWEkge1xuICAgIGV4cG9ydCBtb2R1bGUgRWFzaW5nIHtcbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIGxpbmVhcigpOkZ1bmN0aW9ue1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGs6bnVtYmVyKTpudW1iZXJ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGs7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIGluUXVhZCgpOkZ1bmN0aW9ue1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGs6bnVtYmVyKTpudW1iZXJ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGsqaztcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gb3V0UXVhZCgpOkZ1bmN0aW9ue1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGs6bnVtYmVyKTpudW1iZXJ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGsqKDItayk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIGluT3V0UXVhZCgpOkZ1bmN0aW9ue1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGs6bnVtYmVyKTpudW1iZXJ7XG4gICAgICAgICAgICAgICAgaWYgKCAoIGsgKj0gMiApIDwgMSApIHJldHVybiAwLjUgKiBrICogaztcbiAgICAgICAgICAgICAgICByZXR1cm4gLSAwLjUgKiAoIC0tayAqICggayAtIDIgKSAtIDEgKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gaW5DdWJpYygpOkZ1bmN0aW9ue1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChrOm51bWJlcik6bnVtYmVye1xuICAgICAgICAgICAgICAgIHJldHVybiBrICogayAqIGs7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIG91dEN1YmljKCk6RnVuY3Rpb257XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oazpudW1iZXIpOm51bWJlcntcbiAgICAgICAgICAgICAgICByZXR1cm4gLS1rICogayAqIGsgKyAxO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBpbk91dEN1YmljKCk6RnVuY3Rpb257XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oazpudW1iZXIpOm51bWJlcntcbiAgICAgICAgICAgICAgICBpZiAoICggayAqPSAyICkgPCAxICkgcmV0dXJuIDAuNSAqIGsgKiBrICogaztcbiAgICAgICAgICAgICAgICByZXR1cm4gMC41ICogKCAoIGsgLT0gMiApICogayAqIGsgKyAyICk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIGluUXVhcnQoKTpGdW5jdGlvbntcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihrOm51bWJlcik6bnVtYmVye1xuICAgICAgICAgICAgICAgIHJldHVybiBrICogayAqIGsgKiBrO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBvdXRRdWFydCgpOkZ1bmN0aW9ue1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGs6bnVtYmVyKTpudW1iZXJ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDEgLSAoIC0tayAqIGsgKiBrICogayApO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBpbk91dFF1YXJ0KCk6RnVuY3Rpb257XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oazpudW1iZXIpOm51bWJlcntcbiAgICAgICAgICAgICAgICBpZiAoICggayAqPSAyICkgPCAxKSByZXR1cm4gMC41ICogayAqIGsgKiBrICogaztcbiAgICAgICAgICAgICAgICByZXR1cm4gLSAwLjUgKiAoICggayAtPSAyICkgKiBrICogayAqIGsgLSAyICk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIGluUXVpbnQoKTpGdW5jdGlvbntcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihrOm51bWJlcik6bnVtYmVye1xuICAgICAgICAgICAgICAgIHJldHVybiBrICogayAqIGsgKiBrICogaztcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gb3V0UXVpbnQoKTpGdW5jdGlvbntcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihrOm51bWJlcik6bnVtYmVye1xuICAgICAgICAgICAgICAgIHJldHVybiAtLWsgKiBrICogayAqIGsgKiBrICsgMTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gaW5PdXRRdWludCgpOkZ1bmN0aW9ue1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGs6bnVtYmVyKTpudW1iZXJ7XG4gICAgICAgICAgICAgICAgaWYgKCAoIGsgKj0gMiApIDwgMSApIHJldHVybiAwLjUgKiBrICogayAqIGsgKiBrICogaztcbiAgICAgICAgICAgICAgICByZXR1cm4gMC41ICogKCAoIGsgLT0gMiApICogayAqIGsgKiBrICogayArIDIgKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gaW5TaW5lKCk6RnVuY3Rpb257XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oazpudW1iZXIpOm51bWJlcntcbiAgICAgICAgICAgICAgICByZXR1cm4gMSAtIE1hdGguY29zKCBrICogTWF0aC5QSSAvIDIgKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gb3V0U2luZSgpOkZ1bmN0aW9ue1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGs6bnVtYmVyKTpudW1iZXJ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGguc2luKCBrICogTWF0aC5QSSAvIDIgKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gaW5PdXRTaW5lKCk6RnVuY3Rpb257XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oazpudW1iZXIpOm51bWJlcntcbiAgICAgICAgICAgICAgICByZXR1cm4gMC41ICogKCAxIC0gTWF0aC5jb3MoIE1hdGguUEkgKiBrICkgKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gaW5FeHBvKCk6RnVuY3Rpb257XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oazpudW1iZXIpOm51bWJlcntcbiAgICAgICAgICAgICAgICByZXR1cm4gayA9PT0gMCA/IDAgOiBNYXRoLnBvdyggMTAyNCwgayAtIDEgKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gb3V0RXhwbygpOkZ1bmN0aW9ue1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGs6bnVtYmVyKTpudW1iZXJ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGsgPT09IDEgPyAxIDogMSAtIE1hdGgucG93KCAyLCAtIDEwICogayApO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBpbk91dEV4cG8oKTpGdW5jdGlvbntcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihrOm51bWJlcik6bnVtYmVye1xuICAgICAgICAgICAgICAgIGlmICggayA9PT0gMCApIHJldHVybiAwO1xuICAgICAgICAgICAgICAgIGlmICggayA9PT0gMSApIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIGlmICggKCBrICo9IDIgKSA8IDEgKSByZXR1cm4gMC41ICogTWF0aC5wb3coIDEwMjQsIGsgLSAxICk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDAuNSAqICggLSBNYXRoLnBvdyggMiwgLSAxMCAqICggayAtIDEgKSApICsgMiApO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBpbkNpcmMoKTpGdW5jdGlvbntcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihrOm51bWJlcik6bnVtYmVye1xuICAgICAgICAgICAgICAgIHJldHVybiAxIC0gTWF0aC5zcXJ0KCAxIC0gayAqIGsgKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gb3V0Q2lyYygpOkZ1bmN0aW9ue1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGs6bnVtYmVyKTpudW1iZXJ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGguc3FydCggMSAtICggLS1rICogayApICk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIGluT3V0Q2lyYygpOkZ1bmN0aW9ue1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGs6bnVtYmVyKTpudW1iZXJ7XG4gICAgICAgICAgICAgICAgaWYgKCAoIGsgKj0gMiApIDwgMSkgcmV0dXJuIC0gMC41ICogKCBNYXRoLnNxcnQoIDEgLSBrICogaykgLSAxKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMC41ICogKCBNYXRoLnNxcnQoIDEgLSAoIGsgLT0gMikgKiBrKSArIDEpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBpbkVsYXN0aWMoKTpGdW5jdGlvbntcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihrOm51bWJlcik6bnVtYmVye1xuICAgICAgICAgICAgICAgIHZhciBzOm51bWJlciwgYTpudW1iZXIgPSAwLjEsIHA6bnVtYmVyID0gMC40O1xuICAgICAgICAgICAgICAgIGlmICggayA9PT0gMCApIHJldHVybiAwO1xuICAgICAgICAgICAgICAgIGlmICggayA9PT0gMSApIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIGlmICggIWEgfHwgYSA8IDEgKSB7IGEgPSAxOyBzID0gcCAvIDQ7IH1cbiAgICAgICAgICAgICAgICBlbHNlIHMgPSBwICogTWF0aC5hc2luKCAxIC8gYSApIC8gKCAyICogTWF0aC5QSSApO1xuICAgICAgICAgICAgICAgIHJldHVybiAtICggYSAqIE1hdGgucG93KCAyLCAxMCAqICggayAtPSAxICkgKSAqIE1hdGguc2luKCAoIGsgLSBzICkgKiAoIDIgKiBNYXRoLlBJICkgLyBwICkgKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gb3V0RWxhc3RpYygpOkZ1bmN0aW9ue1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGs6bnVtYmVyKTpudW1iZXJ7XG4gICAgICAgICAgICAgICAgdmFyIHM6bnVtYmVyLCBhOm51bWJlciA9IDAuMSwgcDpudW1iZXIgPSAwLjQ7XG4gICAgICAgICAgICAgICAgaWYgKCBrID09PSAwICkgcmV0dXJuIDA7XG4gICAgICAgICAgICAgICAgaWYgKCBrID09PSAxICkgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgaWYgKCAhYSB8fCBhIDwgMSApIHsgYSA9IDE7IHMgPSBwIC8gNDsgfVxuICAgICAgICAgICAgICAgIGVsc2UgcyA9IHAgKiBNYXRoLmFzaW4oIDEgLyBhICkgLyAoIDIgKiBNYXRoLlBJICk7XG4gICAgICAgICAgICAgICAgcmV0dXJuICggYSAqIE1hdGgucG93KCAyLCAtIDEwICogaykgKiBNYXRoLnNpbiggKCBrIC0gcyApICogKCAyICogTWF0aC5QSSApIC8gcCApICsgMSApO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBpbk91dEVsYXN0aWMoKTpGdW5jdGlvbntcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihrOm51bWJlcik6bnVtYmVye1xuICAgICAgICAgICAgICAgIHZhciBzOm51bWJlciwgYTpudW1iZXIgPSAwLjEsIHA6bnVtYmVyID0gMC40O1xuICAgICAgICAgICAgICAgIGlmICggayA9PT0gMCApIHJldHVybiAwO1xuICAgICAgICAgICAgICAgIGlmICggayA9PT0gMSApIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIGlmICggIWEgfHwgYSA8IDEgKSB7IGEgPSAxOyBzID0gcCAvIDQ7IH1cbiAgICAgICAgICAgICAgICBlbHNlIHMgPSBwICogTWF0aC5hc2luKCAxIC8gYSApIC8gKCAyICogTWF0aC5QSSApO1xuICAgICAgICAgICAgICAgIGlmICggKCBrICo9IDIgKSA8IDEgKSByZXR1cm4gLSAwLjUgKiAoIGEgKiBNYXRoLnBvdyggMiwgMTAgKiAoIGsgLT0gMSApICkgKiBNYXRoLnNpbiggKCBrIC0gcyApICogKCAyICogTWF0aC5QSSApIC8gcCApICk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGEgKiBNYXRoLnBvdyggMiwgLTEwICogKCBrIC09IDEgKSApICogTWF0aC5zaW4oICggayAtIHMgKSAqICggMiAqIE1hdGguUEkgKSAvIHAgKSAqIDAuNSArIDE7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIGluQmFjayh2Om51bWJlciA9IDEuNzAxNTgpOkZ1bmN0aW9ue1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGs6bnVtYmVyKTpudW1iZXJ7XG4gICAgICAgICAgICAgICAgdmFyIHM6bnVtYmVyID0gdjtcbiAgICAgICAgICAgICAgICByZXR1cm4gayAqIGsgKiAoICggcyArIDEgKSAqIGsgLSBzICk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIG91dEJhY2sodjpudW1iZXIgPSAxLjcwMTU4KTpGdW5jdGlvbntcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihrOm51bWJlcik6bnVtYmVye1xuICAgICAgICAgICAgICAgIHZhciBzOm51bWJlciA9IHY7XG4gICAgICAgICAgICAgICAgcmV0dXJuIC0tayAqIGsgKiAoICggcyArIDEgKSAqIGsgKyBzICkgKyAxO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBpbk91dEJhY2sodjpudW1iZXIgPSAxLjcwMTU4KTpGdW5jdGlvbntcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihrOm51bWJlcik6bnVtYmVye1xuICAgICAgICAgICAgICAgIHZhciBzOm51bWJlciA9ICB2ICogMS41MjU7XG4gICAgICAgICAgICAgICAgaWYgKCAoIGsgKj0gMiApIDwgMSApIHJldHVybiAwLjUgKiAoIGsgKiBrICogKCAoIHMgKyAxICkgKiBrIC0gcyApICk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDAuNSAqICggKCBrIC09IDIgKSAqIGsgKiAoICggcyArIDEgKSAqIGsgKyBzICkgKyAyICk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIGluQm91bmNlKCk6RnVuY3Rpb257XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oazpudW1iZXIpOm51bWJlcntcbiAgICAgICAgICAgICAgICByZXR1cm4gMSAtIEVhc2luZy5vdXRCb3VuY2UoKSggMSAtIGsgKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gb3V0Qm91bmNlKCk6RnVuY3Rpb257XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oazpudW1iZXIpOm51bWJlcntcbiAgICAgICAgICAgICAgICBpZiAoIGsgPCAoIDEgLyAyLjc1ICkgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDcuNTYyNSAqIGsgKiBrO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggayA8ICggMiAvIDIuNzUgKSApIHtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gNy41NjI1ICogKCBrIC09ICggMS41IC8gMi43NSApICkgKiBrICsgMC43NTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIGsgPCAoIDIuNSAvIDIuNzUgKSApIHtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gNy41NjI1ICogKCBrIC09ICggMi4yNSAvIDIuNzUgKSApICogayArIDAuOTM3NTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDcuNTYyNSAqICggayAtPSAoIDIuNjI1IC8gMi43NSApICkgKiBrICsgMC45ODQzNzU7XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIGluT3V0Qm91bmNlKCk6RnVuY3Rpb257XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oazpudW1iZXIpOm51bWJlcntcbiAgICAgICAgICAgICAgICBpZiAoIGsgPCAwLjUgKSByZXR1cm4gRWFzaW5nLmluQm91bmNlKCkoIGsgKiAyICkgKiAwLjU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEVhc2luZy5vdXRCb3VuY2UoKSggayAqIDIgLSAxICkgKiAwLjUgKyAwLjU7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2RlZnMvcGl4aS5qcy5kLnRzXCIgLz5cbm1vZHVsZSBQSVhJIHtcbiAgICBleHBvcnQgY2xhc3MgUGF0aCB7XG4gICAgICAgIHByaXZhdGUgX2Nsb3NlZDpib29sZWFuID0gZmFsc2U7XG4gICAgICAgIHBvbHlnb246UG9seWdvbiA9IG5ldyBQb2x5Z29uKCk7XG5cbiAgICAgICAgcHJpdmF0ZSBfdG1wUG9pbnQ6UG9pbnQgPSBuZXcgUG9pbnQoKTtcbiAgICAgICAgcHJpdmF0ZSBfdG1wUG9pbnQyOlBvaW50ID0gbmV3IFBvaW50KCk7XG5cbiAgICAgICAgcHJpdmF0ZSBfdG1wRGlzdGFuY2U6YW55W10gPSBbXTtcblxuICAgICAgICBwcml2YXRlIGN1cnJlbnRQYXRoOkdyYXBoaWNzRGF0YTtcbiAgICAgICAgcHJpdmF0ZSBncmFwaGljc0RhdGE6R3JhcGhpY3NEYXRhW10gPSBbXTtcblxuICAgICAgICBkaXJ0eTpib29sZWFuID0gZmFsc2U7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgICAgIHRoaXMucG9seWdvbi5jbG9zZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIG1vdmVUbyh4Om51bWJlciwgeTpudW1iZXIpOlBhdGh7XG4gICAgICAgICAgICBHcmFwaGljcy5wcm90b3R5cGUubW92ZVRvLmNhbGwodGhpcywgeCx5KTtcbiAgICAgICAgICAgIHRoaXMuZGlydHkgPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBsaW5lVG8oeDpudW1iZXIsIHk6bnVtYmVyKTpQYXRoe1xuICAgICAgICAgICAgR3JhcGhpY3MucHJvdG90eXBlLmxpbmVUby5jYWxsKHRoaXMsIHgseSk7XG4gICAgICAgICAgICB0aGlzLmRpcnR5ID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgYmV6aWVyQ3VydmVUbyhjcFg6bnVtYmVyLCBjcFk6bnVtYmVyLCBjcFgyOm51bWJlciwgY3BZMjpudW1iZXIsIHRvWDpudW1iZXIsIHRvWTpudW1iZXIpOlBhdGh7XG4gICAgICAgICAgICBHcmFwaGljcy5wcm90b3R5cGUuYmV6aWVyQ3VydmVUby5jYWxsKHRoaXMsIGNwWCwgY3BZLCBjcFgyLCBjcFkyLCB0b1gsIHRvWSk7XG4gICAgICAgICAgICB0aGlzLmRpcnR5ID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcXVhZHJhdGljQ3VydmVUbyhjcFg6IG51bWJlciwgY3BZOiBudW1iZXIsIHRvWDogbnVtYmVyLCB0b1k6IG51bWJlcik6UGF0aHtcbiAgICAgICAgICAgIEdyYXBoaWNzLnByb3RvdHlwZS5xdWFkcmF0aWNDdXJ2ZVRvLmNhbGwodGhpcywgY3BYLCBjcFksIHRvWCwgdG9ZKTtcbiAgICAgICAgICAgIHRoaXMuZGlydHkgPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBhcmNUbyh4MTogbnVtYmVyLCB5MTogbnVtYmVyLCB4MjogbnVtYmVyLCB5MjogbnVtYmVyLCByYWRpdXM6IG51bWJlcik6IFBhdGh7XG4gICAgICAgICAgICBHcmFwaGljcy5wcm90b3R5cGUuYXJjVG8uY2FsbCh0aGlzLCB4MSwgeTEsIHgyLCB5MiwgcmFkaXVzKTtcbiAgICAgICAgICAgIHRoaXMuZGlydHkgPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBhcmMoY3g6IG51bWJlciwgY3k6IG51bWJlciwgcmFkaXVzOiBudW1iZXIsIHN0YXJ0QW5nbGU6IG51bWJlciwgZW5kQW5nbGU6IG51bWJlciwgYW50aWNsb2Nrd2lzZT86IGJvb2xlYW4pOiBQYXRoIHtcbiAgICAgICAgICAgIEdyYXBoaWNzLnByb3RvdHlwZS5hcmMuY2FsbCh0aGlzLCBjeCwgY3ksIHJhZGl1cywgc3RhcnRBbmdsZSwgZW5kQW5nbGUsIGFudGljbG9ja3dpc2UpO1xuICAgICAgICAgICAgdGhpcy5kaXJ0eSA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGRyYXdTaGFwZShzaGFwZTpQb2x5Z29uKTpQYXRoe1xuICAgICAgICAgICAgR3JhcGhpY3MucHJvdG90eXBlLmRyYXdTaGFwZS5jYWxsKHRoaXMsIHNoYXBlKTtcbiAgICAgICAgICAgIHRoaXMuZGlydHkgPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBnZXRQb2ludChudW06bnVtYmVyKTpQb2ludHtcbiAgICAgICAgICAgIHRoaXMucGFyc2VQb2ludHMoKTtcbiAgICAgICAgICAgIHZhciBsZW46bnVtYmVyID0gbnVtKjI7XG4gICAgICAgICAgICB0aGlzLl90bXBQb2ludC5zZXQodGhpcy5wb2x5Z29uLnBvaW50c1tsZW5dLHRoaXMucG9seWdvbi5wb2ludHNbbGVuICsgMV0pO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RtcFBvaW50O1xuICAgICAgICB9XG5cbiAgICAgICAgZGlzdGFuY2VCZXR3ZWVuKG51bTE6bnVtYmVyLCBudW0yOm51bWJlcik6bnVtYmVye1xuICAgICAgICAgICAgdGhpcy5wYXJzZVBvaW50cygpO1xuICAgICAgICAgICAgdmFyIHt4OnAxWCwgeTpwMVl9ID0gdGhpcy5nZXRQb2ludChudW0xKTtcbiAgICAgICAgICAgIHZhciB7eDpwMlgsIHk6cDJZfSA9IHRoaXMuZ2V0UG9pbnQobnVtMik7XG5cbiAgICAgICAgICAgIHZhciBkeDpudW1iZXIgPSBwMlgtcDFYO1xuICAgICAgICAgICAgdmFyIGR5Om51bWJlciA9IHAyWS1wMVk7XG5cbiAgICAgICAgICAgIHJldHVybiBNYXRoLnNxcnQoZHgqZHgrZHkqZHkpO1xuICAgICAgICB9XG5cbiAgICAgICAgdG90YWxEaXN0YW5jZSgpOm51bWJlcntcbiAgICAgICAgICAgIHRoaXMucGFyc2VQb2ludHMoKTtcbiAgICAgICAgICAgIHRoaXMuX3RtcERpc3RhbmNlLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICB0aGlzLl90bXBEaXN0YW5jZS5wdXNoKDApO1xuXG4gICAgICAgICAgICB2YXIgbGVuOm51bWJlciA9IHRoaXMubGVuZ3RoO1xuICAgICAgICAgICAgdmFyIGRpc3RhbmNlOm51bWJlciA9IDA7XG4gICAgICAgICAgICBmb3IgKHZhciBpOm51bWJlciA9IDA7IGkgPCBsZW4gLSAxOyBpKyspIHtcbiAgICAgICAgICAgICAgICBkaXN0YW5jZSArPSB0aGlzLmRpc3RhbmNlQmV0d2VlbihpLCBpICsgMSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fdG1wRGlzdGFuY2UucHVzaChkaXN0YW5jZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBkaXN0YW5jZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldFBvaW50QXQobnVtOm51bWJlcik6UG9pbnR7XG4gICAgICAgICAgICB0aGlzLnBhcnNlUG9pbnRzKCk7XG4gICAgICAgICAgICBpZihudW0gPiB0aGlzLmxlbmd0aCl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UG9pbnQodGhpcy5sZW5ndGgtMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKG51bSUxID09PSAwKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRQb2ludChudW0pO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgdGhpcy5fdG1wUG9pbnQyLnNldCgwLDApO1xuXG4gICAgICAgICAgICAgICAgdmFyIGRpZmY6bnVtYmVyID0gbnVtJTE7XG5cbiAgICAgICAgICAgICAgICB2YXIge3g6Y2VpbFgsIHk6Y2VpbFl9ID0gdGhpcy5nZXRQb2ludChNYXRoLmNlaWwobnVtKSk7XG4gICAgICAgICAgICAgICAgdmFyIHt4OmZsb29yWCwgeTpmbG9vcll9ID0gdGhpcy5nZXRQb2ludChNYXRoLmZsb29yKG51bSkpO1xuXG4gICAgICAgICAgICAgICAgdmFyIHh4Om51bWJlciA9IC0oKGZsb29yWCAtIGNlaWxYKSpkaWZmKTtcbiAgICAgICAgICAgICAgICB2YXIgeXk6bnVtYmVyID0gLSgoZmxvb3JZIC0gY2VpbFkpKmRpZmYpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3RtcFBvaW50Mi5zZXQoZmxvb3JYICsgeHgsIGZsb29yWSArIHl5KTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl90bXBQb2ludDI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBnZXRQb2ludEF0RGlzdGFuY2UoZGlzdGFuY2U6bnVtYmVyKTpQb2ludHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGlzdGFuY2UpO1xuICAgICAgICAgICAgdGhpcy5wYXJzZVBvaW50cygpO1xuICAgICAgICAgICAgaWYoIXRoaXMuX3RtcERpc3RhbmNlKXRoaXMudG90YWxEaXN0YW5jZSgpO1xuICAgICAgICAgICAgdmFyIGxlbjpudW1iZXIgPSB0aGlzLl90bXBEaXN0YW5jZS5sZW5ndGg7XG4gICAgICAgICAgICB2YXIgbjpudW1iZXIgPSAwO1xuXG4gICAgICAgICAgICB2YXIgdG90YWxEaXN0YW5jZTpudW1iZXIgPSB0aGlzLl90bXBEaXN0YW5jZVt0aGlzLl90bXBEaXN0YW5jZS5sZW5ndGgtMV07XG4gICAgICAgICAgICBpZihkaXN0YW5jZSA8IDApe1xuICAgICAgICAgICAgICAgIGRpc3RhbmNlID0gdG90YWxEaXN0YW5jZStkaXN0YW5jZTtcbiAgICAgICAgICAgIH1lbHNlIGlmKGRpc3RhbmNlID4gdG90YWxEaXN0YW5jZSl7XG4gICAgICAgICAgICAgICAgZGlzdGFuY2UgPSBkaXN0YW5jZS10b3RhbERpc3RhbmNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IodmFyIGk6bnVtYmVyID0gMDsgaSA8IGxlbjsgaSsrKXtcbiAgICAgICAgICAgICAgICBpZihkaXN0YW5jZSA+PSB0aGlzLl90bXBEaXN0YW5jZVtpXSl7XG4gICAgICAgICAgICAgICAgICAgIG4gPSBpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmKGRpc3RhbmNlIDwgdGhpcy5fdG1wRGlzdGFuY2VbaV0pe1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKG4gPT09IHRoaXMubGVuZ3RoLTEpe1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFBvaW50QXQobik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBkaWZmMTpudW1iZXIgPSBkaXN0YW5jZS10aGlzLl90bXBEaXN0YW5jZVtuXTtcbiAgICAgICAgICAgIHZhciBkaWZmMjpudW1iZXIgPSB0aGlzLl90bXBEaXN0YW5jZVtuKzFdIC0gdGhpcy5fdG1wRGlzdGFuY2Vbbl07XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFBvaW50QXQobitkaWZmMS9kaWZmMik7XG4gICAgICAgIH1cblxuICAgICAgICBwYXJzZVBvaW50cygpOlBhdGgge1xuICAgICAgICAgICAgaWYodGhpcy5kaXJ0eSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZGlydHkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLnBvbHlnb24ucG9pbnRzLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaTpudW1iZXIgPSAwOyBpIDwgdGhpcy5ncmFwaGljc0RhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNoYXBlOlBvbHlnb24gPSA8UG9seWdvbj50aGlzLmdyYXBoaWNzRGF0YVtpXS5zaGFwZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNoYXBlICYmIHNoYXBlLnBvaW50cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wb2x5Z29uLnBvaW50cyA9IHRoaXMucG9seWdvbi5wb2ludHMuY29uY2F0KHNoYXBlLnBvaW50cyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgY2xlYXIoKTpQYXRoe1xuICAgICAgICAgICAgdGhpcy5ncmFwaGljc0RhdGEubGVuZ3RoID0gMDtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFBhdGggPSBudWxsO1xuXG4gICAgICAgICAgICB0aGlzLnBvbHlnb24ucG9pbnRzLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICB0aGlzLl9jbG9zZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuZGlydHkgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGNsb3NlZCgpOmJvb2xlYW57XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2xvc2VkO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0IGNsb3NlZCh2YWx1ZSl7XG4gICAgICAgICAgICB0aGlzLnBvbHlnb24uY2xvc2VkID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLl9jbG9zZWQgPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuZGlydHkgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGxlbmd0aCgpOm51bWJlcntcbiAgICAgICAgICAgIHJldHVybiAodGhpcy5wb2x5Z29uLnBvaW50cy5sZW5ndGggPT09IDApID8gMCA6IHRoaXMucG9seWdvbi5wb2ludHMubGVuZ3RoLzIgKyAoKHRoaXMuX2Nsb3NlZCkgPyAxIDogMCk7XG4gICAgICAgIH1cbiAgICB9XG59IiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vZGVmcy9waXhpLmpzLmQudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi9Ud2Vlbk1hbmFnZXIudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi9FYXNpbmcudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vZGlzcGxheS9TY2VuZS50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuL1BhdGgudHNcIiAvPlxubW9kdWxlIFBJWEl7XG4gICAgZXhwb3J0IGNsYXNzIFR3ZWVue1xuICAgICAgICB0aW1lOm51bWJlciA9IDA7XG4gICAgICAgIGFjdGl2ZTpib29sZWFuID0gZmFsc2U7XG4gICAgICAgIGVhc2luZzpGdW5jdGlvbiA9IEVhc2luZy5saW5lYXIoKTtcbiAgICAgICAgZXhwaXJlOmJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgcmVwZWF0Om51bWJlciA9IDA7XG4gICAgICAgIGxvb3A6Ym9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBkZWxheTpudW1iZXIgPSAwO1xuICAgICAgICBwaW5nUG9uZzpib29sZWFuID0gZmFsc2U7XG4gICAgICAgIGlzU3RhcnRlZDpib29sZWFuID0gZmFsc2U7XG4gICAgICAgIGlzRW5kZWQ6Ym9vbGVhbiA9IGZhbHNlO1xuXG4gICAgICAgIHByaXZhdGUgX3RvOmFueTtcbiAgICAgICAgcHJpdmF0ZSBfZnJvbTphbnk7XG4gICAgICAgIHByaXZhdGUgX2RlbGF5VGltZTpudW1iZXIgPSAwO1xuICAgICAgICBwcml2YXRlIF9lbGFwc2VkVGltZTpudW1iZXIgPSAwO1xuICAgICAgICBwcml2YXRlIF9yZXBlYXQ6bnVtYmVyID0gMDtcbiAgICAgICAgcHJpdmF0ZSBfcGluZ1Bvbmc6Ym9vbGVhbiA9IGZhbHNlO1xuXG4gICAgICAgIHByaXZhdGUgX2NoYWluVHdlZW46VHdlZW47XG5cbiAgICAgICAgcGF0aDpQYXRoO1xuICAgICAgICBwYXRoUmV2ZXJzZTpib29sZWFuID0gZmFsc2U7XG4gICAgICAgIHBhdGhGcm9tOm51bWJlcjtcbiAgICAgICAgcGF0aFRvOm51bWJlcjtcblxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgdGFyZ2V0OmFueSwgcHVibGljIG1hbmFnZXI/OlR3ZWVuTWFuYWdlcil7XG4gICAgICAgICAgICBpZih0aGlzLm1hbmFnZXIpe1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkVG8odGhpcy5tYW5hZ2VyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGFkZFRvKG1hbmFnZXI6VHdlZW5NYW5hZ2VyKTpUd2VlbntcbiAgICAgICAgICAgIG1hbmFnZXIuYWRkVHdlZW4odGhpcyk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGNoYWluKHR3ZWVuOlR3ZWVuID0gbmV3IFR3ZWVuKHRoaXMudGFyZ2V0KSk6VHdlZW57XG4gICAgICAgICAgICB0aGlzLl9jaGFpblR3ZWVuID0gdHdlZW47XG4gICAgICAgICAgICByZXR1cm4gdHdlZW47XG4gICAgICAgIH1cblxuICAgICAgICBzdGFydCgpOlR3ZWVue1xuICAgICAgICAgICAgdGhpcy5hY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgaWYoIXRoaXMubWFuYWdlcil7XG4gICAgICAgICAgICAgICAgaWYodGhpcy50YXJnZXQpe1xuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLnRhcmdldC5wYXJlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtYW5hZ2VyOlR3ZWVuTWFuYWdlciA9IF9maW5kTWFuYWdlcih0aGlzLnRhcmdldCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobWFuYWdlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkVG8obWFuYWdlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKCdUd2VlbnMgbmVlZHMgYSBtYW5hZ2VyJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoJ1R3ZWVucyBuZWVkcyBhIG1hbmFnZXInKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RvcCgpOlR3ZWVue1xuICAgICAgICAgICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuX29uVHdlZW5TdG9wKHRoaXMuX2VsYXBzZWRUaW1lKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgdG8oZGF0YTphbnkpOlR3ZWVue1xuICAgICAgICAgICAgdGhpcy5fdG8gPSBkYXRhO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBmcm9tKGRhdGE6YW55KTpUd2VlbntcbiAgICAgICAgICAgIHRoaXMuX2Zyb20gPSBkYXRhO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICByZW1vdmUoKTpUd2VlbntcbiAgICAgICAgICAgIGlmKCF0aGlzLm1hbmFnZXIpe1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlR3ZWVuIHdpdGhvdXQgbWFuYWdlci5cIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5yZW1vdmVUd2Vlbih0aGlzKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzZXQoKTpUd2VlbntcbiAgICAgICAgICAgIHRoaXMuX2VsYXBzZWRUaW1lID0gMDtcbiAgICAgICAgICAgIHRoaXMuX3JlcGVhdCA9IDA7XG4gICAgICAgICAgICB0aGlzLl9kZWxheVRpbWUgPSAwO1xuICAgICAgICAgICAgdGhpcy5pc1N0YXJ0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuaXNFbmRlZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICBpZih0aGlzLnBpbmdQb25nJiZ0aGlzLl9waW5nUG9uZyl7XG4gICAgICAgICAgICAgICAgdmFyIF90bzphbnkgPSB0aGlzLl90byxcbiAgICAgICAgICAgICAgICAgICAgX2Zyb206YW55ID0gdGhpcy5fZnJvbTtcblxuICAgICAgICAgICAgICAgIHRoaXMuX3RvID0gX2Zyb207XG4gICAgICAgICAgICAgICAgdGhpcy5fZnJvbSA9IF90bztcblxuICAgICAgICAgICAgICAgIHRoaXMuX3BpbmdQb25nID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIG9uU3RhcnQoY2FsbGJhY2s6RnVuY3Rpb24pOlR3ZWVue1xuICAgICAgICAgICAgdGhpcy5fb25Ud2VlblN0YXJ0ID0gPGFueT5jYWxsYmFjaztcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgb25FbmQoY2FsbGJhY2s6RnVuY3Rpb24pOlR3ZWVue1xuICAgICAgICAgICAgdGhpcy5fb25Ud2VlbkVuZCA9IDxhbnk+Y2FsbGJhY2s7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIG9uU3RvcChjYWxsYmFjazpGdW5jdGlvbik6VHdlZW57XG4gICAgICAgICAgICB0aGlzLl9vblR3ZWVuU3RvcCA9IDxhbnk+Y2FsbGJhY2s7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIG9uVXBkYXRlKGNhbGxiYWNrOkZ1bmN0aW9uKTpUd2VlbntcbiAgICAgICAgICAgIHRoaXMuX29uVHdlZW5VcGRhdGUgPSA8YW55PmNhbGxiYWNrO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBvblJlcGVhdChjYWxsYmFjazpGdW5jdGlvbik6VHdlZW57XG4gICAgICAgICAgICB0aGlzLl9vblR3ZWVuUmVwZWF0ID0gPGFueT5jYWxsYmFjaztcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgb25QaW5nUG9uZyhjYWxsYmFjazpGdW5jdGlvbik6VHdlZW57XG4gICAgICAgICAgICB0aGlzLl9vblR3ZWVuUGluZ1BvbmcgPSA8YW55PmNhbGxiYWNrO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICB1cGRhdGUoZGVsdGFUaW1lOm51bWJlcik6VHdlZW57XG4gICAgICAgICAgICBpZighKHRoaXMuX2NhblVwZGF0ZSgpJiYodGhpcy5fdG98fHRoaXMucGF0aCkpKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIF90bzphbnksIF9mcm9tOmFueTtcbiAgICAgICAgICAgIHZhciBkZWx0YU1TID0gZGVsdGFUaW1lICogMTAwMDtcblxuICAgICAgICAgICAgaWYodGhpcy5kZWxheSA+IHRoaXMuX2RlbGF5VGltZSl7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGVsYXlUaW1lICs9IGRlbHRhTVM7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKCF0aGlzLmlzU3RhcnRlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3BhcnNlRGF0YSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuaXNTdGFydGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9vblR3ZWVuU3RhcnQodGhpcy5fZWxhcHNlZFRpbWUsIGRlbHRhVGltZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciB0aW1lOm51bWJlciA9ICh0aGlzLnBpbmdQb25nKSA/IHRoaXMudGltZS8yIDogdGhpcy50aW1lO1xuICAgICAgICAgICAgaWYodGltZSA+IHRoaXMuX2VsYXBzZWRUaW1lKXtcbiAgICAgICAgICAgICAgICBsZXQgdDpudW1iZXIgPSB0aGlzLl9lbGFwc2VkVGltZStkZWx0YU1TO1xuICAgICAgICAgICAgICAgIGxldCBlbmRlZDpib29sZWFuID0gKHQ+PXRpbWUpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fZWxhcHNlZFRpbWUgPSAoZW5kZWQpID8gdGltZSA6IHQ7XG4gICAgICAgICAgICAgICAgdGhpcy5fYXBwbHkodGltZSk7XG5cbiAgICAgICAgICAgICAgICBsZXQgcmVhbEVsYXBzZWQ6bnVtYmVyID0gKHRoaXMuX3BpbmdQb25nKSA/IHRpbWUrdGhpcy5fZWxhcHNlZFRpbWUgOiB0aGlzLl9lbGFwc2VkVGltZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9vblR3ZWVuVXBkYXRlKHJlYWxFbGFwc2VkLCBkZWx0YVRpbWUpO1xuXG4gICAgICAgICAgICAgICAgaWYoZW5kZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucGluZ1BvbmcgJiYgIXRoaXMuX3BpbmdQb25nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9waW5nUG9uZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBfdG8gPSB0aGlzLl90bztcbiAgICAgICAgICAgICAgICAgICAgICAgIF9mcm9tID0gdGhpcy5fZnJvbTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZnJvbSA9IF90bztcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3RvID0gX2Zyb207XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnBhdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdG8gPSB0aGlzLnBhdGhUbztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfZnJvbSA9IHRoaXMucGF0aEZyb207XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBhdGhUbyA9IF9mcm9tO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGF0aEZyb20gPSBfdG87XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX29uVHdlZW5QaW5nUG9uZyhyZWFsRWxhcHNlZCwgZGVsdGFUaW1lKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxhcHNlZFRpbWUgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5sb29wIHx8IHRoaXMucmVwZWF0ID4gdGhpcy5fcmVwZWF0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZXBlYXQrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX29uVHdlZW5SZXBlYXQocmVhbEVsYXBzZWQsIGRlbHRhVGltZSwgdGhpcy5fcmVwZWF0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2VsYXBzZWRUaW1lID0gMDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucGluZ1BvbmcgJiYgdGhpcy5fcGluZ1BvbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdG8gPSB0aGlzLl90bztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfZnJvbSA9IHRoaXMuX2Zyb207XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl90byA9IF9mcm9tO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2Zyb20gPSBfdG87XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wYXRoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90byA9IHRoaXMucGF0aFRvO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfZnJvbSA9IHRoaXMucGF0aEZyb207XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXRoVG8gPSBfZnJvbTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXRoRnJvbSA9IF90bztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9waW5nUG9uZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzRW5kZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9vblR3ZWVuRW5kKHJlYWxFbGFwc2VkLCBkZWx0YVRpbWUpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX2NoYWluVHdlZW4pe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hhaW5Ud2Vlbi5hZGRUbyh0aGlzLm1hbmFnZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hhaW5Ud2Vlbi5zdGFydCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9wYXJzZURhdGEoKTp2b2lke1xuICAgICAgICAgICAgaWYodGhpcy5pc1N0YXJ0ZWQpcmV0dXJuO1xuXG4gICAgICAgICAgICBpZighdGhpcy5fZnJvbSl0aGlzLl9mcm9tID0ge307XG4gICAgICAgICAgICBfcGFyc2VSZWN1cnNpdmVEYXRhKHRoaXMuX3RvLCB0aGlzLl9mcm9tLCB0aGlzLnRhcmdldCk7XG5cbiAgICAgICAgICAgIGlmKHRoaXMucGF0aCl7XG4gICAgICAgICAgICAgICAgbGV0IGRpc3RhbmNlOm51bWJlciA9IHRoaXMucGF0aC50b3RhbERpc3RhbmNlKCk7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5wYXRoUmV2ZXJzZSl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGF0aEZyb20gPSBkaXN0YW5jZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXRoVG8gPSAwO1xuICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhdGhGcm9tID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXRoVG8gPSBkaXN0YW5jZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9hcHBseSh0aW1lOm51bWJlcik6dm9pZHtcbiAgICAgICAgICAgIF9yZWN1cnNpdmVBcHBseSh0aGlzLl90bywgdGhpcy5fZnJvbSwgdGhpcy50YXJnZXQsIHRpbWUsIHRoaXMuX2VsYXBzZWRUaW1lLCB0aGlzLmVhc2luZyk7XG5cbiAgICAgICAgICAgIGlmKHRoaXMucGF0aCl7XG4gICAgICAgICAgICAgICAgbGV0IHRpbWU6bnVtYmVyID0gKHRoaXMucGluZ1BvbmcpID8gdGhpcy50aW1lLzIgOiB0aGlzLnRpbWU7XG4gICAgICAgICAgICAgICAgbGV0IGI6bnVtYmVyID0gdGhpcy5wYXRoRnJvbSxcbiAgICAgICAgICAgICAgICAgICAgYzpudW1iZXIgPSB0aGlzLnBhdGhUbyAtIHRoaXMucGF0aEZyb20sXG4gICAgICAgICAgICAgICAgICAgIGQ6bnVtYmVyID0gdGltZSxcbiAgICAgICAgICAgICAgICAgICAgdDpudW1iZXIgPSB0aGlzLl9lbGFwc2VkVGltZS9kO1xuXG4gICAgICAgICAgICAgICAgbGV0IGRpc3RhbmNlOm51bWJlciA9IGIgKyAoYyp0aGlzLmVhc2luZyh0KSk7XG4gICAgICAgICAgICAgICAgbGV0IHBvczpQb2ludCA9IHRoaXMucGF0aC5nZXRQb2ludEF0RGlzdGFuY2UoZGlzdGFuY2UpO1xuICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0LnggPSBwb3MueDtcbiAgICAgICAgICAgICAgICB0aGlzLnRhcmdldC55ID0gcG9zLnk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9jYW5VcGRhdGUoKTpib29sZWFue1xuICAgICAgICAgICAgcmV0dXJuICh0aGlzLnRpbWUgJiYgdGhpcy5hY3RpdmUgJiYgdGhpcy50YXJnZXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfb25Ud2VlblN0YXJ0KGVsYXBzZWRUaW1lOm51bWJlciwgZGVsdGFUaW1lOiBudW1iZXIpOnZvaWR7fVxuICAgICAgICBwcml2YXRlIF9vblR3ZWVuU3RvcChlbGFwc2VkVGltZTpudW1iZXIpOnZvaWR7fVxuICAgICAgICBwcml2YXRlIF9vblR3ZWVuRW5kKGVsYXBzZWRUaW1lOm51bWJlciwgZGVsdGFUaW1lOiBudW1iZXIpOnZvaWR7fVxuICAgICAgICBwcml2YXRlIF9vblR3ZWVuUmVwZWF0KGVsYXBzZWRUaW1lOm51bWJlciwgZGVsdGFUaW1lOiBudW1iZXIsIHJlcGVhdDpudW1iZXIpOnZvaWR7fVxuICAgICAgICBwcml2YXRlIF9vblR3ZWVuVXBkYXRlKGVsYXBzZWRUaW1lOm51bWJlciwgZGVsdGFUaW1lOiBudW1iZXIpOnZvaWR7fVxuICAgICAgICBwcml2YXRlIF9vblR3ZWVuUGluZ1BvbmcoZWxhcHNlZFRpbWU6bnVtYmVyLCBkZWx0YVRpbWU6IG51bWJlcik6dm9pZHt9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2ZpbmRNYW5hZ2VyKHBhcmVudDphbnkpOmFueXtcbiAgICAgICAgaWYocGFyZW50IGluc3RhbmNlb2YgU2NlbmUpe1xuICAgICAgICAgICAgcmV0dXJuIChwYXJlbnQudHdlZW5NYW5hZ2VyKSA/IHBhcmVudC50d2Vlbk1hbmFnZXIgOiBudWxsO1xuICAgICAgICB9ZWxzZSBpZihwYXJlbnQucGFyZW50KXtcbiAgICAgICAgICAgIHJldHVybiBfZmluZE1hbmFnZXIocGFyZW50LnBhcmVudCk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfcGFyc2VSZWN1cnNpdmVEYXRhKHRvOmFueSwgZnJvbTphbnksIHRhcmdldDphbnkpOnZvaWR7XG4gICAgICAgIGZvcih2YXIgayBpbiB0byl7XG4gICAgICAgICAgICBpZihmcm9tW2tdICE9PSAwICYmICFmcm9tW2tdKXtcbiAgICAgICAgICAgICAgICBpZihpc09iamVjdCh0YXJnZXRba10pKXtcbiAgICAgICAgICAgICAgICAgICAgZnJvbVtrXSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGFyZ2V0W2tdKSk7XG4gICAgICAgICAgICAgICAgICAgIF9wYXJzZVJlY3Vyc2l2ZURhdGEodG9ba10sIGZyb21ba10sIHRhcmdldFtrXSk7XG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgIGZyb21ba10gPSB0YXJnZXRba107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNPYmplY3Qob2JqOmFueSk6Ym9vbGVhbntcbiAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSBcIltvYmplY3QgT2JqZWN0XVwiO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9yZWN1cnNpdmVBcHBseSh0bzphbnksIGZyb206YW55LCB0YXJnZXQ6YW55LCB0aW1lOm51bWJlciwgZWxhcHNlZDpudW1iZXIsIGVhc2luZzpGdW5jdGlvbik6dm9pZHtcbiAgICAgICAgZm9yKHZhciBrIGluIHRvKXtcbiAgICAgICAgICAgIGlmKCFpc09iamVjdCh0b1trXSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgYiA9IGZyb21ba10sXG4gICAgICAgICAgICAgICAgICAgIGMgPSB0b1trXSAtIGZyb21ba10sXG4gICAgICAgICAgICAgICAgICAgIGQgPSB0aW1lLFxuICAgICAgICAgICAgICAgICAgICB0ID0gZWxhcHNlZC9kO1xuICAgICAgICAgICAgICAgIHRhcmdldFtrXSA9IGIgKyAoYyplYXNpbmcodCkpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgX3JlY3Vyc2l2ZUFwcGx5KHRvW2tdLCBmcm9tW2tdLCB0YXJnZXRba10sIHRpbWUsIGVsYXBzZWQsIGVhc2luZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9kZWZzL3BpeGkuanMuZC50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuL1R3ZWVuLnRzXCIgLz5cbm1vZHVsZSBQSVhJIHtcbiAgICBleHBvcnQgY2xhc3MgVHdlZW5NYW5hZ2Vye1xuICAgICAgICB0d2VlbnM6VHdlZW5bXSA9IFtdO1xuICAgICAgICBwcml2YXRlIF90b0RlbGV0ZTpUd2VlbltdID0gW107XG5cbiAgICAgICAgY29uc3RydWN0b3IoKXt9XG5cbiAgICAgICAgdXBkYXRlKGRlbHRhVGltZTpudW1iZXIpOlR3ZWVuTWFuYWdlcntcbiAgICAgICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgdGhpcy50d2VlbnMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgIGlmKHRoaXMudHdlZW5zW2ldLmFjdGl2ZSl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHdlZW5zW2ldLnVwZGF0ZShkZWx0YVRpbWUpXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMudHdlZW5zW2ldLmlzRW5kZWQgJiYgdGhpcy50d2VlbnNbaV0uZXhwaXJlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHdlZW5zW2ldLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZih0aGlzLl90b0RlbGV0ZS5sZW5ndGgpe1xuICAgICAgICAgICAgICAgIGZvcihpID0gMDsgaSA8IHRoaXMuX3RvRGVsZXRlLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVtb3ZlKHRoaXMuX3RvRGVsZXRlW2ldKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLl90b0RlbGV0ZS5sZW5ndGggPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBnZXRUd2VlbnNGb3JUYXJnZXIodGFyZ2V0OmFueSk6VHdlZW5bXXtcbiAgICAgICAgICAgIHZhciB0d2VlbnM6VHdlZW5bXSA9IFtdO1xuICAgICAgICAgICAgZm9yKHZhciBpOm51bWJlciA9IDA7IGkgPCB0aGlzLnR3ZWVucy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgaWYodGhpcy50d2VlbnNbaV0udGFyZ2V0ID09PSB0YXJnZXQpe1xuICAgICAgICAgICAgICAgICAgICB0d2VlbnMucHVzaCh0aGlzLnR3ZWVuc1tpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdHdlZW5zO1xuICAgICAgICB9XG5cbiAgICAgICAgY3JlYXRlVHdlZW4odGFyZ2V0OmFueSk6VHdlZW57XG4gICAgICAgICAgICByZXR1cm4gbmV3IFR3ZWVuKHRhcmdldCwgdGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICBhZGRUd2Vlbih0d2VlbjpUd2Vlbik6VHdlZW57XG4gICAgICAgICAgICB0d2Vlbi5tYW5hZ2VyID0gdGhpcztcbiAgICAgICAgICAgIHRoaXMudHdlZW5zLnB1c2godHdlZW4pO1xuICAgICAgICAgICAgcmV0dXJuIHR3ZWVuO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVtb3ZlVHdlZW4odHdlZW46VHdlZW4pOlR3ZWVuTWFuYWdlcntcbiAgICAgICAgICAgIHRoaXMuX3RvRGVsZXRlLnB1c2godHdlZW4pO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9yZW1vdmUodHdlZW46VHdlZW4pe1xuICAgICAgICAgICAgdmFyIGluZGV4Om51bWJlciA9IHRoaXMudHdlZW5zLmluZGV4T2YodHdlZW4pO1xuICAgICAgICAgICAgaWYoaW5kZXggPj0gMCl7XG4gICAgICAgICAgICAgICAgdGhpcy50d2VlbnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9kZWZzL3BpeGkuanMuZC50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9jb3JlL0dhbWUudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi9DYW1lcmEudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vdGltZXIvVGltZXJNYW5hZ2VyLnRzXCIgLz5cbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL3R3ZWVuL1R3ZWVubWFuYWdlci50c1wiIC8+XG5tb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IGNsYXNzIFNjZW5lIGV4dGVuZHMgQ29udGFpbmVyIHtcbiAgICAgICAgY2FtZXJhOkNhbWVyYSA9IG5ldyBDYW1lcmEoKTtcbiAgICAgICAgdGltZXJNYW5hZ2VyOlRpbWVyTWFuYWdlciA9IG5ldyBUaW1lck1hbmFnZXIoKTtcbiAgICAgICAgdHdlZW5NYW5hZ2VyOlR3ZWVuTWFuYWdlciA9IG5ldyBUd2Vlbk1hbmFnZXIoKTtcbiAgICAgICAgc3RhdGljIF9pZExlbjpudW1iZXIgPSAwO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBpZDpzdHJpbmcgPSAoXCJzY2VuZVwiICsgU2NlbmUuX2lkTGVuKyspICl7XG4gICAgICAgICAgICBzdXBlcigpO1xuICAgICAgICAgICAgdGhpcy5jYW1lcmEuYWRkVG8odGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICB1cGRhdGUoZGVsdGFUaW1lOm51bWJlcik6U2NlbmV7XG4gICAgICAgICAgICB0aGlzLnRpbWVyTWFuYWdlci51cGRhdGUoZGVsdGFUaW1lKTtcbiAgICAgICAgICAgIHRoaXMudHdlZW5NYW5hZ2VyLnVwZGF0ZShkZWx0YVRpbWUpO1xuICAgICAgICAgICAgc3VwZXIudXBkYXRlKGRlbHRhVGltZSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGFkZFRvKGdhbWU6R2FtZXxDb250YWluZXIpOlNjZW5lIHtcbiAgICAgICAgICAgIGlmKGdhbWUgaW5zdGFuY2VvZiBHYW1lKXtcbiAgICAgICAgICAgICAgICA8R2FtZT5nYW1lLmFkZFNjZW5lKHRoaXMpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTY2VuZXMgY2FuIG9ubHkgYmUgYWRkZWQgdG8gdGhlIGdhbWUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICB9XG59IiwibW9kdWxlIFBJWEkge1xuICAgIGV4cG9ydCBjbGFzcyBJbnB1dE1hbmFnZXJ7XG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZ2FtZTogR2FtZSl7XG5cbiAgICAgICAgfVxuICAgIH1cbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9kZWZzL3BpeGkuanMuZC50c1wiIC8+XG5tb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IGZ1bmN0aW9uIGJpdG1hcEZvbnRQYXJzZXJUWFQoKTpGdW5jdGlvbntcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHJlc291cmNlOiBsb2FkZXJzLlJlc291cmNlLCBuZXh0OkZ1bmN0aW9uKTp2b2lke1xuXG4gICAgICAgICAgICAvL3NraXAgaWYgbm8gZGF0YSBvciBpZiBub3QgdHh0XG4gICAgICAgICAgICBpZighcmVzb3VyY2UuZGF0YSB8fCAocmVzb3VyY2UueGhyVHlwZSAhPT0gXCJ0ZXh0XCIgJiYgcmVzb3VyY2UueGhyVHlwZSAhPT0gXCJkb2N1bWVudFwiKSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5leHQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHRleHQ6c3RyaW5nID0gKHJlc291cmNlLnhoclR5cGUgPT09IFwidGV4dFwiKSA/IHJlc291cmNlLmRhdGEgOiByZXNvdXJjZS54aHIucmVzcG9uc2VUZXh0O1xuXG4gICAgICAgICAgICAvL3NraXAgaWYgbm90IGEgYml0bWFwIGZvbnQgZGF0YVxuICAgICAgICAgICAgaWYoIHRleHQuaW5kZXhPZihcInBhZ2VcIikgPT09IC0xIHx8XG4gICAgICAgICAgICAgICAgdGV4dC5pbmRleE9mKFwiZmFjZVwiKSA9PT0gLTEgfHxcbiAgICAgICAgICAgICAgICB0ZXh0LmluZGV4T2YoXCJpbmZvXCIpID09PSAtMSB8fFxuICAgICAgICAgICAgICAgIHRleHQuaW5kZXhPZihcImNoYXJcIikgPT09IC0xICl7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gbmV4dCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgdXJsOnN0cmluZyA9IGRpcm5hbWUocmVzb3VyY2UudXJsKTtcbiAgICAgICAgICAgIGlmKHVybCA9PT0gXCIuXCIpe1xuICAgICAgICAgICAgICAgIHVybCA9IFwiXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKHRoaXMuYmFzZVVybCAmJiB1cmwpe1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuYmFzZVVybC5jaGFyQXQodGhpcy5iYXNlVXJsLmxlbmd0aC0xKT09PSAnLycpe1xuICAgICAgICAgICAgICAgICAgICB1cmwgKz0gJy8nO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHVybC5yZXBsYWNlKHRoaXMuYmFzZVVybCwgJycpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZih1cmwgJiYgdXJsLmNoYXJBdCh1cmwubGVuZ3RoIC0gMSkgIT09ICcvJyl7XG4gICAgICAgICAgICAgICAgdXJsICs9ICcvJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHRleHR1cmVVcmw6c3RyaW5nID0gZ2V0VGV4dHVyZVVybCh1cmwsIHRleHQpO1xuICAgICAgICAgICAgaWYodXRpbHMuVGV4dHVyZUNhY2hlW3RleHR1cmVVcmxdKXtcbiAgICAgICAgICAgICAgICBwYXJzZShyZXNvdXJjZSwgdXRpbHMuVGV4dHVyZUNhY2hlW3RleHR1cmVVcmxdKTtcbiAgICAgICAgICAgICAgICBuZXh0KCk7XG4gICAgICAgICAgICB9ZWxzZXtcblxuICAgICAgICAgICAgICAgIHZhciBsb2FkT3B0aW9uczphbnkgPSB7XG4gICAgICAgICAgICAgICAgICAgIGNyb3NzT3JpZ2luOiByZXNvdXJjZS5jcm9zc09yaWdpbixcbiAgICAgICAgICAgICAgICAgICAgbG9hZFR5cGU6IGxvYWRlcnMuUmVzb3VyY2UuTE9BRF9UWVBFLklNQUdFXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHRoaXMuYWRkKHJlc291cmNlLm5hbWUgKyAnX2ltYWdlJywgdGV4dHVyZVVybCwgbG9hZE9wdGlvbnMsIGZ1bmN0aW9uKHJlczphbnkpe1xuICAgICAgICAgICAgICAgICAgICBwYXJzZShyZXNvdXJjZSwgcmVzLnRleHR1cmUpO1xuICAgICAgICAgICAgICAgICAgICBuZXh0KCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICBuZXh0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZShyZXNvdXJjZTpsb2FkZXJzLlJlc291cmNlLCB0ZXh0dXJlOlRleHR1cmUpe1xuICAgICAgICB2YXIgY3VycmVudExpbmU6c3RyaW5nLCBhdHRyOmF0dHJEYXRhLFxuICAgICAgICAgICAgZGF0YTpmb250RGF0YSA9IHtcbiAgICAgICAgICAgICAgICBjaGFycyA6IHt9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIHZhciB0ZXh0OnN0cmluZyA9IChyZXNvdXJjZS54aHJUeXBlID09PSBcInRleHRcIikgPyByZXNvdXJjZS5kYXRhIDogcmVzb3VyY2UueGhyLnJlc3BvbnNlVGV4dDtcbiAgICAgICAgdmFyIGxpbmVzOnN0cmluZ1tdID0gdGV4dC5zcGxpdCgnXFxuJyk7XG5cbiAgICAgICAgZm9yKHZhciBpOm51bWJlciA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICBpZihsaW5lc1tpXS5pbmRleE9mKFwiaW5mb1wiKSA9PT0gMCl7XG4gICAgICAgICAgICAgICAgY3VycmVudExpbmUgPSBsaW5lc1tpXS5zdWJzdHJpbmcoNSk7XG4gICAgICAgICAgICAgICAgYXR0ciA9IGdldEF0dHIoY3VycmVudExpbmUpO1xuXG4gICAgICAgICAgICAgICAgZGF0YS5mb250ID0gYXR0ci5mYWNlO1xuICAgICAgICAgICAgICAgIGRhdGEuc2l6ZSA9IHBhcnNlSW50KGF0dHIuc2l6ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKGxpbmVzW2ldLmluZGV4T2YoJ2NvbW1vbiAnKSA9PT0gMCl7XG4gICAgICAgICAgICAgICAgY3VycmVudExpbmUgPSBsaW5lc1tpXS5zdWJzdHJpbmcoNyk7XG4gICAgICAgICAgICAgICAgYXR0ciA9IGdldEF0dHIoY3VycmVudExpbmUpO1xuICAgICAgICAgICAgICAgIGRhdGEubGluZUhlaWdodCA9IHBhcnNlSW50KGF0dHIubGluZUhlaWdodCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKGxpbmVzW2ldLmluZGV4T2YoXCJjaGFyIFwiKSA9PT0gMCl7XG4gICAgICAgICAgICAgICAgY3VycmVudExpbmUgPSBsaW5lc1tpXS5zdWJzdHJpbmcoNSk7XG4gICAgICAgICAgICAgICAgYXR0ciA9IGdldEF0dHIoY3VycmVudExpbmUpO1xuICAgICAgICAgICAgICAgIHZhciBjaGFyQ29kZTpudW1iZXIgPSBwYXJzZUludChhdHRyLmlkKTtcblxuICAgICAgICAgICAgICAgIHZhciB0ZXh0dXJlUmVjdDpSZWN0YW5nbGUgPSBuZXcgUmVjdGFuZ2xlKFxuICAgICAgICAgICAgICAgICAgICBwYXJzZUludChhdHRyLngpLFxuICAgICAgICAgICAgICAgICAgICBwYXJzZUludChhdHRyLnkpLFxuICAgICAgICAgICAgICAgICAgICBwYXJzZUludChhdHRyLndpZHRoKSxcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VJbnQoYXR0ci5oZWlnaHQpXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIGRhdGEuY2hhcnNbY2hhckNvZGVdID0ge1xuICAgICAgICAgICAgICAgICAgICB4T2Zmc2V0OiBwYXJzZUludChhdHRyLnhvZmZzZXQpLFxuICAgICAgICAgICAgICAgICAgICB5T2Zmc2V0OiBwYXJzZUludChhdHRyLnlvZmZzZXQpLFxuICAgICAgICAgICAgICAgICAgICB4QWR2YW5jZTogcGFyc2VJbnQoYXR0ci54YWR2YW5jZSksXG4gICAgICAgICAgICAgICAgICAgIGtlcm5pbmc6IHt9LFxuICAgICAgICAgICAgICAgICAgICB0ZXh0dXJlOiBuZXcgVGV4dHVyZSh0ZXh0dXJlLmJhc2VUZXh0dXJlLCB0ZXh0dXJlUmVjdClcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihsaW5lc1tpXS5pbmRleE9mKCdrZXJuaW5nICcpID09PSAwKXtcbiAgICAgICAgICAgICAgICBjdXJyZW50TGluZSA9IGxpbmVzW2ldLnN1YnN0cmluZyg4KTtcbiAgICAgICAgICAgICAgICBhdHRyID0gZ2V0QXR0cihjdXJyZW50TGluZSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgZmlyc3QgPSBwYXJzZUludChhdHRyLmZpcnN0KTtcbiAgICAgICAgICAgICAgICB2YXIgc2Vjb25kID0gcGFyc2VJbnQoYXR0ci5zZWNvbmQpO1xuXG4gICAgICAgICAgICAgICAgZGF0YS5jaGFyc1tzZWNvbmRdLmtlcm5pbmdbZmlyc3RdID0gcGFyc2VJbnQoYXR0ci5hbW91bnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmVzb3VyY2UuYml0bWFwRm9udCA9IGRhdGE7XG4gICAgICAgIGV4dHJhcy5CaXRtYXBUZXh0LmZvbnRzW2RhdGEuZm9udF0gPSBkYXRhO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRpcm5hbWUocGF0aDpzdHJpbmcpOnN0cmluZ3tcbiAgICAgICAgcmV0dXJuIHBhdGgucmVwbGFjZSgvXFxcXC9nLCcvJykucmVwbGFjZSgvXFwvW15cXC9dKiQvLCAnJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0VGV4dHVyZVVybCh1cmw6c3RyaW5nLCBkYXRhOnN0cmluZyk6c3RyaW5ne1xuICAgICAgICB2YXIgdGV4dHVyZVVybDpzdHJpbmc7XG4gICAgICAgIHZhciBsaW5lczpzdHJpbmdbXSA9IGRhdGEuc3BsaXQoJ1xcbicpO1xuXG4gICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgaWYobGluZXNbaV0uaW5kZXhPZihcInBhZ2VcIikgPT09IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudExpbmU6c3RyaW5nID0gbGluZXNbaV0uc3Vic3RyaW5nKDUpO1xuICAgICAgICAgICAgICAgIHZhciBmaWxlOnN0cmluZyA9IChjdXJyZW50TGluZS5zdWJzdHJpbmcoY3VycmVudExpbmUuaW5kZXhPZignZmlsZT0nKSkpLnNwbGl0KCc9JylbMV07XG4gICAgICAgICAgICAgICAgdGV4dHVyZVVybCA9IHVybCArIGZpbGUuc3Vic3RyKDEsIGZpbGUubGVuZ3RoLTIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRleHR1cmVVcmw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0QXR0cihsaW5lOnN0cmluZyk6YXR0ckRhdGF7XG4gICAgICAgIHZhciByZWdleDpSZWdFeHAgPSAvXCIoXFx3KlxcZCpcXHMqKC18XykqKSpcIi9nLFxuICAgICAgICAgICAgYXR0cjpzdHJpbmdbXSA9IGxpbmUuc3BsaXQoL1xccysvZyksXG4gICAgICAgICAgICBkYXRhOmFueSA9IHt9O1xuXG4gICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgYXR0ci5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICB2YXIgZDpzdHJpbmdbXSA9IGF0dHJbaV0uc3BsaXQoJz0nKTtcbiAgICAgICAgICAgIHZhciBtOlJlZ0V4cE1hdGNoQXJyYXkgPSBkWzFdLm1hdGNoKHJlZ2V4KTtcbiAgICAgICAgICAgIGlmKG0gJiYgbS5sZW5ndGggPj0gMSl7XG4gICAgICAgICAgICAgICAgZFsxXSA9IGRbMV0uc3Vic3RyKDEsIGRbMV0ubGVuZ3RoLTIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGF0YVtkWzBdXSA9IGRbMV07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gPGF0dHJEYXRhPmRhdGE7XG4gICAgfVxuXG4gICAgaW50ZXJmYWNlIGZvbnREYXRhIHtcbiAgICAgICAgY2hhcnM/IDogYW55O1xuICAgICAgICBmb250PyA6IHN0cmluZztcbiAgICAgICAgc2l6ZT8gOiBudW1iZXI7XG4gICAgICAgIGxpbmVIZWlnaHQ/IDogbnVtYmVyO1xuICAgIH1cblxuICAgIGludGVyZmFjZSBhdHRyRGF0YSB7XG4gICAgICAgIGZhY2U/IDogc3RyaW5nO1xuICAgICAgICBzaXplPyA6IHN0cmluZztcbiAgICAgICAgbGluZUhlaWdodD8gOiBzdHJpbmc7XG4gICAgICAgIGlkPyA6IHN0cmluZztcbiAgICAgICAgeD8gOiBzdHJpbmc7XG4gICAgICAgIHk/IDogc3RyaW5nO1xuICAgICAgICB3aWR0aD8gOiBzdHJpbmc7XG4gICAgICAgIGhlaWdodD8gOiBzdHJpbmc7XG4gICAgICAgIHhvZmZzZXQ/IDogc3RyaW5nO1xuICAgICAgICB5b2Zmc2V0PyA6IHN0cmluZztcbiAgICAgICAgeGFkdmFuY2U/IDogc3RyaW5nO1xuICAgICAgICBmaXJzdD8gOiBzdHJpbmc7XG4gICAgICAgIHNlY29uZD8gOiBzdHJpbmc7XG4gICAgICAgIGFtb3VudD8gOiBzdHJpbmc7XG4gICAgfVxufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL2F1ZGlvL0F1ZGlvTWFuYWdlci50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9BdWRpby9BdWRpby50c1wiIC8+XG5tb2R1bGUgUElYSSB7XG4gICAgdmFyIF9hbGxvd2VkRXh0OnN0cmluZ1tdID0gW1wibTRhXCIsIFwib2dnXCIsIFwibXAzXCIsIFwid2F2XCJdO1xuXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGF1ZGlvUGFyc2VyKCk6RnVuY3Rpb24ge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24ocmVzb3VyY2U6bG9hZGVycy5SZXNvdXJjZSwgbmV4dDpGdW5jdGlvbik6dm9pZHtcbiAgICAgICAgICAgIGlmKCFEZXZpY2UuaXNBdWRpb1N1cHBvcnRlZCB8fCAhcmVzb3VyY2UuZGF0YSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5leHQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGV4dDpzdHJpbmcgPSBfZ2V0RXh0KHJlc291cmNlLnVybCk7XG5cbiAgICAgICAgICAgIGlmKF9hbGxvd2VkRXh0LmluZGV4T2YoZXh0KSA9PT0gLTEpe1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXh0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKCFfY2FuUGxheShleHQpKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV4dCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgbmFtZTpzdHJpbmcgPSByZXNvdXJjZS5uYW1lIHx8IHJlc291cmNlLnVybDtcbiAgICAgICAgICAgIGlmKHV0aWxzLl9hdWRpb1R5cGVTZWxlY3RlZCA9PT0gQVVESU9fVFlQRS5XRUJBVURJTyl7XG4gICAgICAgICAgICAgICAgRGV2aWNlLmdsb2JhbFdlYkF1ZGlvQ29udGV4dC5kZWNvZGVBdWRpb0RhdGEocmVzb3VyY2UuZGF0YSwgX2FkZFRvQ2FjaGUuYmluZCh0aGlzLCBuZXh0LCBuYW1lKSk7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICByZXR1cm4gX2FkZFRvQ2FjaGUobmV4dCwgbmFtZSwgcmVzb3VyY2UuZGF0YSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGV4cG9ydCBmdW5jdGlvbiBhdWRpb1BhcnNlclVybChyZXNvdXJjZVVybDpzdHJpbmdbXSk6c3RyaW5ne1xuICAgICAgICB2YXIgZXh0OnN0cmluZztcbiAgICAgICAgdmFyIHVybDpzdHJpbmc7XG4gICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgcmVzb3VyY2VVcmwubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgZXh0ID0gX2dldEV4dChyZXNvdXJjZVVybFtpXSk7XG5cbiAgICAgICAgICAgIGlmKF9hbGxvd2VkRXh0LmluZGV4T2YoZXh0KSA9PT0gLTEpe1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihfY2FuUGxheShleHQpKXtcbiAgICAgICAgICAgICAgICB1cmwgPSByZXNvdXJjZVVybFtpXTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB1cmw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2FkZFRvQ2FjaGUobmV4dDpGdW5jdGlvbiwgbmFtZTpzdHJpbmcsIGRhdGE6YW55KXtcbiAgICAgICAgdXRpbHMuQXVkaW9DYWNoZVtuYW1lXSA9IG5ldyBBdWRpbyhkYXRhLCBuYW1lKTtcbiAgICAgICAgcmV0dXJuIG5leHQoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfZ2V0RXh0KHVybDpzdHJpbmcpOnN0cmluZ3tcbiAgICAgICAgcmV0dXJuIHVybC5zcGxpdCgnPycpLnNoaWZ0KCkuc3BsaXQoJy4nKS5wb3AoKS50b0xvd2VyQ2FzZSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9jYW5QbGF5KGV4dDpzdHJpbmcpOmJvb2xlYW57XG4gICAgICAgIHZhciBkZXZpY2VDYW5QbGF5OmJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgc3dpdGNoKGV4dCl7XG4gICAgICAgICAgICBjYXNlIFwibTRhXCI6ZGV2aWNlQ2FuUGxheSA9IERldmljZS5pc000YVN1cHBvcnRlZDsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwibXAzXCI6ZGV2aWNlQ2FuUGxheSA9IERldmljZS5pc01wM1N1cHBvcnRlZDsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwib2dnXCI6ZGV2aWNlQ2FuUGxheSA9IERldmljZS5pc09nZ1N1cHBvcnRlZDsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwid2F2XCI6ZGV2aWNlQ2FuUGxheSA9IERldmljZS5pc1dhdlN1cHBvcnRlZDsgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRldmljZUNhblBsYXk7XG4gICAgfVxufVxuIiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vZGVmcy9waXhpLmpzLmQudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi9jb25zdC50c1wiIC8+XG5tb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IG1vZHVsZSB1dGlscyB7XG4gICAgICAgIGV4cG9ydCB2YXIgX2F1ZGlvVHlwZVNlbGVjdGVkOm51bWJlciA9IEFVRElPX1RZUEUuV0VCQVVESU87XG4gICAgICAgIGV4cG9ydCB2YXIgQXVkaW9DYWNoZTphbnkgPSB7fTtcbiAgICB9XG59IiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vZGVmcy9waXhpLmpzLmQudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vY29yZS9jb25zdC50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuL2JpdG1hcEZvbnRQYXJzZXJUeHQudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi9hdWRpb1BhcnNlci50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9jb3JlL1V0aWxzLnRzXCIgLz5cbm1vZHVsZSBQSVhJIHtcbiAgICBleHBvcnQgbW9kdWxlIGxvYWRlcnN7XG4gICAgICAgIExvYWRlci5hZGRQaXhpTWlkZGxld2FyZShiaXRtYXBGb250UGFyc2VyVFhUKTtcbiAgICAgICAgTG9hZGVyLmFkZFBpeGlNaWRkbGV3YXJlKGF1ZGlvUGFyc2VyKTtcblxuICAgICAgICBjbGFzcyBUdXJib0xvYWRlciBleHRlbmRzIExvYWRlciB7XG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihiYXNlVXJsOiBzdHJpbmcsIGFzc2V0Q29uY3VycmVuY3k6IG51bWJlcil7XG4gICAgICAgICAgICAgICAgc3VwZXIoYmFzZVVybCwgYXNzZXRDb25jdXJyZW5jeSk7XG4gICAgICAgICAgICAgICAgaWYoRGV2aWNlLmlzQXVkaW9TdXBwb3J0ZWQpe1xuICAgICAgICAgICAgICAgICAgICBfY2hlY2tBdWRpb1R5cGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGFkZChuYW1lOmFueSwgdXJsPzphbnkgLG9wdGlvbnM/OmFueSwgY2I/OmFueSk6TG9hZGVye1xuICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBuYW1lID09PSAnb2JqZWN0Jyl7XG4gICAgICAgICAgICAgICAgICAgIGlmKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChuYW1lLnVybCkgPT09IFwiW29iamVjdCBBcnJheV1cIil7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lLnVybCA9IGF1ZGlvUGFyc2VyVXJsKG5hbWUudXJsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh1cmwpID09PSBcIltvYmplY3QgQXJyYXldXCIpe1xuICAgICAgICAgICAgICAgICAgICB1cmwgPSBhdWRpb1BhcnNlclVybCh1cmwpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBzdXBlci5hZGQobmFtZSwgdXJsLCBvcHRpb25zLCBjYik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsb2FkZXJzLkxvYWRlciA9IFR1cmJvTG9hZGVyO1xuXG5cbiAgICAgICAgZnVuY3Rpb24gX2NoZWNrQXVkaW9UeXBlKCk6dm9pZHtcbiAgICAgICAgICAgIGlmKERldmljZS5pc01wM1N1cHBvcnRlZClfc2V0QXVkaW9FeHQoXCJtcDNcIik7XG4gICAgICAgICAgICBpZihEZXZpY2UuaXNPZ2dTdXBwb3J0ZWQpX3NldEF1ZGlvRXh0KFwib2dnXCIpO1xuICAgICAgICAgICAgaWYoRGV2aWNlLmlzV2F2U3VwcG9ydGVkKV9zZXRBdWRpb0V4dChcIndhdlwiKTtcbiAgICAgICAgICAgIGlmKERldmljZS5pc000YVN1cHBvcnRlZClfc2V0QXVkaW9FeHQoXCJtNGFcIik7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBfc2V0QXVkaW9FeHQoZXh0OnN0cmluZyk6dm9pZCB7XG4gICAgICAgICAgICBpZih1dGlscy5fYXVkaW9UeXBlU2VsZWN0ZWQgPT09IEFVRElPX1RZUEUuV0VCQVVESU8pe1xuICAgICAgICAgICAgICAgIFJlc291cmNlLnNldEV4dGVuc2lvblhoclR5cGUoZXh0LCBSZXNvdXJjZS5YSFJfUkVTUE9OU0VfVFlQRS5CVUZGRVIpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgUmVzb3VyY2Uuc2V0RXh0ZW5zaW9uTG9hZFR5cGUoZXh0LCBSZXNvdXJjZS5MT0FEX1RZUEUuQVVESU8pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSIsIm1vZHVsZSBQSVhJIHtcbiAgICBleHBvcnQgY2xhc3MgRGF0YU1hbmFnZXJ7XG4gICAgICAgIHByaXZhdGUgX2RhdGE6YW55O1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgaWQ6c3RyaW5nLCBwdWJsaWMgdXNlUGVyc2lzdGFudERhdGE6Ym9vbGVhbiA9IGZhbHNlKXtcbiAgICAgICAgICAgIHRoaXMubG9hZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgbG9hZCgpOkRhdGFNYW5hZ2Vye1xuICAgICAgICAgICAgdGhpcy5fZGF0YSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5pZCkpIHx8IHt9O1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBzYXZlKCk6RGF0YU1hbmFnZXJ7XG4gICAgICAgICAgICBpZih0aGlzLnVzZVBlcnNpc3RhbnREYXRhKXtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLmlkLCBKU09OLnN0cmluZ2lmeSh0aGlzLl9kYXRhKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc2V0KCk6RGF0YU1hbmFnZXJ7XG4gICAgICAgICAgICB0aGlzLl9kYXRhID0ge307XG4gICAgICAgICAgICB0aGlzLnNhdmUoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0KGtleTpzdHJpbmcgfCBPYmplY3QsIHZhbHVlPzphbnkpOkRhdGFNYW5hZ2Vye1xuICAgICAgICAgICAgaWYoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGtleSkgPT09IFwiW29iamVjdCBPYmplY3RdXCIpe1xuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24odGhpcy5fZGF0YSwga2V5KTtcbiAgICAgICAgICAgIH1lbHNlIGlmKHR5cGVvZiBrZXkgPT09IFwic3RyaW5nXCIpe1xuICAgICAgICAgICAgICAgIHRoaXMuX2RhdGFba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnNhdmUoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0KGtleT86c3RyaW5nKTphbnl7XG4gICAgICAgICAgICBpZigha2V5KXtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZGF0YTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGFba2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRlbChrZXk6c3RyaW5nKTpEYXRhTWFuYWdlcntcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9kYXRhW2tleV07XG4gICAgICAgICAgICB0aGlzLnNhdmUoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICB9XG59IiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vZGVmcy9waXhpLmpzLmQudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi9jb25zdC50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuL0RldmljZS50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9kaXNwbGF5L1NjZW5lLnRzXCIgLz5cbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL2F1ZGlvL0F1ZGlvTWFuYWdlci50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9pbnB1dC9JbnB1dE1hbmFnZXIudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vbG9hZGVyL0xvYWRlci50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuL0RhdGFNYW5hZ2VyLnRzXCIgLz5cbm1vZHVsZSBQSVhJIHtcbiAgICB2YXIgbGFzdDpudW1iZXIgPSAwO1xuICAgIHZhciBtYXhGcmFtZU1TID0gMC4zNTtcblxuICAgIHZhciBkZWZhdWx0R2FtZUNvbmZpZyA6IEdhbWVDb25maWcgPSB7XG4gICAgICAgIGlkOiBcInBpeGkuZGVmYXVsdC5pZFwiLFxuICAgICAgICB3aWR0aDo4MDAsXG4gICAgICAgIGhlaWdodDo2MDAsXG4gICAgICAgIHVzZVdlYkF1ZGlvOiB0cnVlLFxuICAgICAgICB1c2VQZXJzaXN0YW50RGF0YTogZmFsc2UsXG4gICAgICAgIGdhbWVTY2FsZVR5cGU6IEdBTUVfU0NBTEVfVFlQRS5OT05FLFxuICAgICAgICBzdG9wQXRMb3N0Rm9jdXM6IHRydWUsXG4gICAgICAgIGFzc2V0c1VybDogXCIuL1wiLFxuICAgICAgICBsb2FkZXJDb25jdXJyZW5jeTogMTAsXG4gICAgICAgIGF1ZGlvQ2hhbm5lbExpbmVzOiAxMCxcbiAgICAgICAgc291bmRDaGFubmVsTGluZXM6IDEwLFxuICAgICAgICBtdXNpY0NoYW5uZWxMaW5lczogMSxcbiAgICAgICAgekluZGV4RW5hYmxlZDogekluZGV4RW5hYmxlZFxuICAgIH07XG5cbiAgICBleHBvcnQgY2xhc3MgR2FtZSB7XG4gICAgICAgIGlkOnN0cmluZztcbiAgICAgICAgcmFmOmFueTtcblxuICAgICAgICBwcml2YXRlIF9zY2VuZXM6U2NlbmVbXSA9IFtdO1xuICAgICAgICBzY2VuZTpTY2VuZTtcblxuICAgICAgICBhdWRpbzpBdWRpb01hbmFnZXI7XG4gICAgICAgIGlucHV0OklucHV0TWFuYWdlcjtcbiAgICAgICAgZGF0YTpEYXRhTWFuYWdlcjtcbiAgICAgICAgbG9hZGVyOmxvYWRlcnMuTG9hZGVyO1xuXG4gICAgICAgIHJlbmRlcmVyOldlYkdMUmVuZGVyZXIgfCBDYW52YXNSZW5kZXJlcjtcbiAgICAgICAgY2FudmFzOkhUTUxDYW52YXNFbGVtZW50O1xuXG4gICAgICAgIGRlbHRhOm51bWJlciA9IDA7XG4gICAgICAgIHRpbWU6bnVtYmVyID0gMDtcbiAgICAgICAgbGFzdFRpbWU6bnVtYmVyID0gMDtcblxuICAgICAgICBpc1dlYkdMOmJvb2xlYW47XG4gICAgICAgIGlzV2ViQXVkaW86Ym9vbGVhbjtcblxuICAgICAgICB0aW1lU3BlZWQ6bnVtYmVyID0gMTtcblxuICAgICAgICBwcml2YXRlIF9yZXNpemVMaXN0ZW5lcjphbnk7XG5cbiAgICAgICAgY29uc3RydWN0b3IoY29uZmlnPzpHYW1lQ29uZmlnLCByZW5kZXJlck9wdGlvbnM/OlJlbmRlcmVyT3B0aW9ucykge1xuICAgICAgICAgICAgY29uZmlnID0gKDxPYmplY3Q+T2JqZWN0KS5hc3NpZ24oZGVmYXVsdEdhbWVDb25maWcsIGNvbmZpZyk7XG4gICAgICAgICAgICB0aGlzLmlkID0gY29uZmlnLmlkO1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJlciA9IGF1dG9EZXRlY3RSZW5kZXJlcihjb25maWcud2lkdGgsIGNvbmZpZy5oZWlnaHQsIHJlbmRlcmVyT3B0aW9ucyk7XG4gICAgICAgICAgICB0aGlzLmNhbnZhcyA9IHRoaXMucmVuZGVyZXIudmlldztcblxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XG5cbiAgICAgICAgICAgIHRoaXMuaXNXZWJHTCA9ICh0aGlzLnJlbmRlcmVyLnR5cGUgPT09IFJFTkRFUkVSX1RZUEUuV0VCR0wpO1xuICAgICAgICAgICAgdGhpcy5pc1dlYkF1ZGlvID0gKERldmljZS5pc0F1ZGlvU3VwcG9ydGVkJiZEZXZpY2UuaXNXZWJBdWRpb1N1cHBvcnRlZCYmY29uZmlnLnVzZVdlYkF1ZGlvKTtcbiAgICAgICAgICAgIHV0aWxzLl9hdWRpb1R5cGVTZWxlY3RlZCA9IHRoaXMuaXNXZWJBdWRpbyA/IEFVRElPX1RZUEUuV0VCQVVESU8gOiBBVURJT19UWVBFLkhUTUxBVURJTztcbiAgICAgICAgICAgIHpJbmRleEVuYWJsZWQgPSBjb25maWcuekluZGV4RW5hYmxlZDtcblxuICAgICAgICAgICAgdGhpcy5pbnB1dCA9IG5ldyBJbnB1dE1hbmFnZXIodGhpcyk7XG4gICAgICAgICAgICB0aGlzLmF1ZGlvID0gbmV3IEF1ZGlvTWFuYWdlcihjb25maWcuYXVkaW9DaGFubmVsTGluZXMsIGNvbmZpZy5zb3VuZENoYW5uZWxMaW5lcywgY29uZmlnLm11c2ljQ2hhbm5lbExpbmVzKTtcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IG5ldyBEYXRhTWFuYWdlcih0aGlzLmlkLCBjb25maWcudXNlUGVyc2lzdGFudERhdGEpO1xuICAgICAgICAgICAgdGhpcy5sb2FkZXIgPSBuZXcgbG9hZGVycy5Mb2FkZXIoY29uZmlnLmFzc2V0c1VybCwgY29uZmlnLmxvYWRlckNvbmN1cnJlbmN5KTtcblxuICAgICAgICAgICAgdmFyIGluaXRpYWxTY2VuZTpTY2VuZSA9IG5ldyBTY2VuZSgnaW5pdGlhbCcpLmFkZFRvKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5zZXRTY2VuZShpbml0aWFsU2NlbmUpO1xuXG4gICAgICAgICAgICBpZihjb25maWcuZ2FtZVNjYWxlVHlwZSAhPT0gR0FNRV9TQ0FMRV9UWVBFLk5PTkUpe1xuICAgICAgICAgICAgICAgIHRoaXMuYXV0b1Jlc2l6ZShjb25maWcuZ2FtZVNjYWxlVHlwZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKGNvbmZpZy5zdG9wQXRMb3N0Rm9jdXMpe1xuICAgICAgICAgICAgICAgIHRoaXMuZW5hYmxlU3RvcEF0TG9zdEZvY3VzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9hbmltYXRlKCk6dm9pZCB7XG4gICAgICAgICAgICB0aGlzLnJhZiA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5fYW5pbWF0ZS5iaW5kKHRoaXMpKTtcblxuICAgICAgICAgICAgaWYodGhpcy5zY2VuZSkge1xuICAgICAgICAgICAgICAgIHZhciBub3c6bnVtYmVyID0gRGF0ZS5ub3coKTtcblxuICAgICAgICAgICAgICAgIHRoaXMudGltZSArPSBNYXRoLm1pbigobm93IC0gbGFzdCkgLyAxMDAwLCBtYXhGcmFtZU1TKSAqIHRoaXMudGltZVNwZWVkO1xuICAgICAgICAgICAgICAgIHRoaXMuZGVsdGEgPSB0aGlzLnRpbWUgLSB0aGlzLmxhc3RUaW1lO1xuICAgICAgICAgICAgICAgIHRoaXMubGFzdFRpbWUgPSB0aGlzLnRpbWU7XG5cbiAgICAgICAgICAgICAgICBsYXN0ID0gbm93O1xuXG4gICAgICAgICAgICAgICAgdGhpcy5wcmVVcGRhdGUodGhpcy5kZWx0YSk7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGUodGhpcy5kZWx0YSk7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5yZW5kZXIodGhpcy5zY2VuZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5wb3N0VXBkYXRlKHRoaXMuZGVsdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdXBkYXRlKGRlbHRhVGltZTpudW1iZXIpOkdhbWUge1xuICAgICAgICAgICAgdGhpcy5zY2VuZS51cGRhdGUodGhpcy5kZWx0YSk7XG5cbiAgICAgICAgICAgIC8vY2xlYW4ga2lsbGVkIG9iamVjdHNcbiAgICAgICAgICAgIHZhciBsZW46bnVtYmVyID0gQ29udGFpbmVyLl9raWxsZWRPYmplY3RzLmxlbmd0aDtcbiAgICAgICAgICAgIGlmIChsZW4pIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpOm51bWJlciA9IDA7IGkgPCBsZW47IGkrKykgQ29udGFpbmVyLl9raWxsZWRPYmplY3RzW2ldLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIENvbnRhaW5lci5fa2lsbGVkT2JqZWN0cy5sZW5ndGggPSAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHByZVVwZGF0ZShkZWx0YVRpbWU6bnVtYmVyKXt9XG4gICAgICAgIHBvc3RVcGRhdGUoZGVsdGFUaW1lOm51bWJlcil7fVxuXG5cbiAgICAgICAgc3RhcnQoKTpHYW1lIHtcbiAgICAgICAgICAgIGxhc3QgPSBEYXRlLm5vdygpO1xuICAgICAgICAgICAgdGhpcy5fYW5pbWF0ZSgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBzdG9wKCk6R2FtZSB7XG4gICAgICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5yYWYpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBlbmFibGVTdG9wQXRMb3N0Rm9jdXMoc3RhdGU6Ym9vbGVhbiA9IHRydWUpOkdhbWV7XG4gICAgICAgICAgICBpZihzdGF0ZSl7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihEZXZpY2UuZ2V0VmlzaWJpbGl0eUNoYW5nZUV2ZW50KCksIHRoaXMuX29uVmlzaWJpbGl0eUNoYW5nZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoRGV2aWNlLmdldFZpc2liaWxpdHlDaGFuZ2VFdmVudCgpLCB0aGlzLl9vblZpc2liaWxpdHlDaGFuZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBkaXNhYmxlU3RvcEF0TG9zdEZvY3VzKCk6R2FtZXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVuYWJsZVN0b3BBdExvc3RGb2N1cyhmYWxzZSk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9vblZpc2liaWxpdHlDaGFuZ2UoKXtcbiAgICAgICAgICAgIHZhciBpc0hpZGUgPSAhIShkb2N1bWVudC5oaWRkZW4gfHwgZG9jdW1lbnQud2Via2l0SGlkZGVuIHx8IGRvY3VtZW50Lm1vekhpZGRlbiB8fCBkb2N1bWVudC5tc0hpZGRlbik7XG4gICAgICAgICAgICBpZihpc0hpZGUpe1xuICAgICAgICAgICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLm9uTG9zdEZvY3VzKGlzSGlkZSk7XG4gICAgICAgIH1cblxuICAgICAgICBvbkxvc3RGb2N1cyhpc0hpZGU6Ym9vbGVhbik6R2FtZXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0U2NlbmUoc2NlbmU6U2NlbmUgfCBzdHJpbmcpOkdhbWUge1xuICAgICAgICAgICAgaWYoIShzY2VuZSBpbnN0YW5jZW9mIFNjZW5lKSl7XG4gICAgICAgICAgICAgICAgc2NlbmUgPSB0aGlzLmdldFNjZW5lKDxzdHJpbmc+c2NlbmUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnNjZW5lID0gPFNjZW5lPnNjZW5lO1xuICAgICAgICAgICAgdGhpcy5zY2VuZS5wb3NpdGlvbi5zZXQodGhpcy53aWR0aC8yLCB0aGlzLmhlaWdodC8yKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0U2NlbmUoaWQ6c3RyaW5nKTpTY2VuZXtcbiAgICAgICAgICAgIHZhciBzY2VuZTpTY2VuZSA9IG51bGw7XG4gICAgICAgICAgICBmb3IodmFyIGk6bnVtYmVyID0gMDsgaSA8IHRoaXMuX3NjZW5lcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5fc2NlbmVzW2ldLmlkID09PSBpZCl7XG4gICAgICAgICAgICAgICAgICAgIHNjZW5lID0gdGhpcy5fc2NlbmVzW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHNjZW5lO1xuICAgICAgICB9XG5cbiAgICAgICAgY3JlYXRlU2NlbmUoaWQ/OnN0cmluZyk6U2NlbmUge1xuICAgICAgICAgICAgcmV0dXJuIChuZXcgU2NlbmUoaWQpKS5hZGRUbyh0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZVNjZW5lKHNjZW5lOnN0cmluZyB8IFNjZW5lKTpHYW1le1xuICAgICAgICAgICAgaWYodHlwZW9mIHNjZW5lID09PSBcInN0cmluZ1wiKXtcbiAgICAgICAgICAgICAgICBzY2VuZSA9IHRoaXMuZ2V0U2NlbmUoPHN0cmluZz5zY2VuZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBpbmRleDpudW1iZXIgPSB0aGlzLl9zY2VuZXMuaW5kZXhPZig8U2NlbmU+c2NlbmUpO1xuICAgICAgICAgICAgaWYoaW5kZXggIT09IC0xKXtcbiAgICAgICAgICAgICAgICB0aGlzLl9zY2VuZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBhZGRTY2VuZShzY2VuZTpTY2VuZSk6R2FtZSB7XG4gICAgICAgICAgICB0aGlzLl9zY2VuZXMucHVzaChzY2VuZSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZUFsbFNjZW5lcygpOkdhbWV7XG4gICAgICAgICAgICB0aGlzLl9zY2VuZXMubGVuZ3RoID0gMDtcbiAgICAgICAgICAgIHRoaXMuc2NlbmUgPSBudWxsO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICByZXNpemUod2lkdGg6bnVtYmVyLCBoZWlnaHQ6bnVtYmVyLCByZW5kZXJlcjpib29sZWFuID0gZmFsc2UpOkdhbWV7XG4gICAgICAgICAgICBpZihyZW5kZXJlcil7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5yZXNpemUod2lkdGgsIGhlaWdodCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLndpZHRoID0gd2lkdGggKyBcInB4XCI7XG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyBcInB4XCI7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgYXV0b1Jlc2l6ZShtb2RlOm51bWJlcik6R2FtZSB7XG4gICAgICAgICAgICBpZih0aGlzLl9yZXNpemVMaXN0ZW5lcil7XG4gICAgICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX3Jlc2l6ZUxpc3RlbmVyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYobW9kZSA9PT0gR0FNRV9TQ0FMRV9UWVBFLk5PTkUpcmV0dXJuO1xuXG4gICAgICAgICAgICBzd2l0Y2gobW9kZSl7XG4gICAgICAgICAgICAgICAgY2FzZSBHQU1FX1NDQUxFX1RZUEUuQVNQRUNUX0ZJVDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVzaXplTGlzdGVuZXIgPSB0aGlzLl9yZXNpemVNb2RlQXNwZWN0Rml0O1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIEdBTUVfU0NBTEVfVFlQRS5BU1BFQ1RfRklMTDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVzaXplTGlzdGVuZXIgPSB0aGlzLl9yZXNpemVNb2RlQXNwZWN0RmlsbDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBHQU1FX1NDQUxFX1RZUEUuRklMTDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVzaXplTGlzdGVuZXIgPSB0aGlzLl9yZXNpemVNb2RlRmlsbDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl9yZXNpemVMaXN0ZW5lci5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIHRoaXMuX3Jlc2l6ZUxpc3RlbmVyKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX3Jlc2l6ZU1vZGVBc3BlY3RGaXQoKTp2b2lke1xuICAgICAgICAgICAgdmFyIHd3Om51bWJlciA9IHBhcnNlSW50KHRoaXMuY2FudmFzLnN0eWxlLndpZHRoLCAxMCkgfHwgdGhpcy5jYW52YXMud2lkdGg7XG4gICAgICAgICAgICB2YXIgaGg6bnVtYmVyID0gcGFyc2VJbnQodGhpcy5jYW52YXMuc3R5bGUuaGVpZ2h0LCAxMCkgfHwgdGhpcy5jYW52YXMuaGVpZ2h0O1xuICAgICAgICAgICAgaWYod2luZG93LmlubmVyV2lkdGggIT09IHd3IHx8IHdpbmRvdy5pbm5lckhlaWdodCAhPT0gaGgpe1xuICAgICAgICAgICAgICAgIHZhciBzY2FsZTpudW1iZXIgPSBNYXRoLm1pbih3aW5kb3cuaW5uZXJXaWR0aC90aGlzLndpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQvdGhpcy5oZWlnaHQpO1xuICAgICAgICAgICAgICAgIHRoaXMucmVzaXplKHRoaXMud2lkdGgqc2NhbGUsIHRoaXMuaGVpZ2h0KnNjYWxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX3Jlc2l6ZU1vZGVBc3BlY3RGaWxsKCk6dm9pZHtcbiAgICAgICAgICAgIHZhciB3dzpudW1iZXIgPSBwYXJzZUludCh0aGlzLmNhbnZhcy5zdHlsZS53aWR0aCwgMTApIHx8IHRoaXMuY2FudmFzLndpZHRoO1xuICAgICAgICAgICAgdmFyIGhoOm51bWJlciA9IHBhcnNlSW50KHRoaXMuY2FudmFzLnN0eWxlLmhlaWdodCwgMTApIHx8IHRoaXMuY2FudmFzLmhlaWdodDtcbiAgICAgICAgICAgIGlmKHdpbmRvdy5pbm5lcldpZHRoICE9PSB3dyB8fCB3aW5kb3cuaW5uZXJIZWlnaHQgIT09IGhoKXtcbiAgICAgICAgICAgICAgICB2YXIgc2NhbGU6bnVtYmVyID0gTWF0aC5tYXgod2luZG93LmlubmVyV2lkdGgvdGhpcy53aWR0aCwgd2luZG93LmlubmVySGVpZ2h0L3RoaXMuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICB2YXIgd2lkdGg6bnVtYmVyID0gdGhpcy53aWR0aCpzY2FsZTtcbiAgICAgICAgICAgICAgICB2YXIgaGVpZ2h0Om51bWJlciA9IHRoaXMuaGVpZ2h0KnNjYWxlO1xuXG4gICAgICAgICAgICAgICAgdmFyIHRvcE1hcmdpbjpudW1iZXIgPSAod2luZG93LmlubmVySGVpZ2h0LWhlaWdodCkvMjtcbiAgICAgICAgICAgICAgICB2YXIgbGVmdE1hcmdpbjpudW1iZXIgPSAod2luZG93LmlubmVyV2lkdGgtd2lkdGgpLzI7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnJlc2l6ZSh3aWR0aCwgaGVpZ2h0KTtcblxuICAgICAgICAgICAgICAgIHZhciBzdHlsZTphbnkgPSA8YW55PnRoaXMuY2FudmFzLnN0eWxlO1xuICAgICAgICAgICAgICAgIHN0eWxlWydtYXJnaW4tdG9wJ10gPSB0b3BNYXJnaW4gKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgc3R5bGVbJ21hcmdpbi1sZWZ0J10gPSBsZWZ0TWFyZ2luICsgXCJweFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfcmVzaXplTW9kZUZpbGwoKTp2b2lke1xuICAgICAgICAgICAgdmFyIHd3Om51bWJlciA9IHBhcnNlSW50KHRoaXMuY2FudmFzLnN0eWxlLndpZHRoLCAxMCkgfHwgdGhpcy5jYW52YXMud2lkdGg7XG4gICAgICAgICAgICB2YXIgaGg6bnVtYmVyID0gcGFyc2VJbnQodGhpcy5jYW52YXMuc3R5bGUuaGVpZ2h0LCAxMCkgfHwgdGhpcy5jYW52YXMuaGVpZ2h0O1xuICAgICAgICAgICAgaWYod2luZG93LmlubmVyV2lkdGggIT09IHd3IHx8IHdpbmRvdy5pbm5lckhlaWdodCAhPT0gaGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGdldCB3aWR0aCgpOm51bWJlciB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJlci53aWR0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBoZWlnaHQoKTpudW1iZXIge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyZXIuaGVpZ2h0O1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIEdhbWVDb25maWcge1xuICAgICAgICBpZD86c3RyaW5nO1xuICAgICAgICB3aWR0aD86bnVtYmVyO1xuICAgICAgICBoZWlnaHQ/Om51bWJlcjtcbiAgICAgICAgdXNlV2ViQXVkaW8/OmJvb2xlYW47XG4gICAgICAgIHVzZVBlcnNpc3RhbnREYXRhPzpib29sZWFuO1xuICAgICAgICBnYW1lU2NhbGVUeXBlPzpudW1iZXI7XG4gICAgICAgIHN0b3BBdExvc3RGb2N1cz86Ym9vbGVhbjtcbiAgICAgICAgYXNzZXRzVXJsPzpzdHJpbmc7XG4gICAgICAgIGxvYWRlckNvbmN1cnJlbmN5PzpudW1iZXI7XG4gICAgICAgIGF1ZGlvQ2hhbm5lbExpbmVzPzpudW1iZXI7XG4gICAgICAgIHNvdW5kQ2hhbm5lbExpbmVzPzpudW1iZXI7XG4gICAgICAgIG11c2ljQ2hhbm5lbExpbmVzPzpudW1iZXI7XG4gICAgICAgIHpJbmRleEVuYWJsZWQ/OmJvb2xlYW47XG4gICAgfVxufVxuXG5pbnRlcmZhY2UgT2JqZWN0IHtcbiAgICBhc3NpZ24odGFyZ2V0Ok9iamVjdCwgLi4uc291cmNlczpPYmplY3RbXSk6T2JqZWN0O1xufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4vQXVkaW9MaW5lLnRzXCIgLz5cbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL2NvcmUvR2FtZS50c1wiIC8+XG4vL1RPRE86IFRoZSBhdWRpb3Mgc3lzdGVtIG5lZWRzIGEgYmlnIHJlZmFjdG9yL2ltcHJvdmVtZW50XG5tb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IGNsYXNzIEF1ZGlvTWFuYWdlcntcbiAgICAgICAgc291bmRMaW5lczpBdWRpb0xpbmVbXSA9IFtdO1xuICAgICAgICBtdXNpY0xpbmVzOkF1ZGlvTGluZVtdID0gW107XG4gICAgICAgIG5vcm1hbExpbmVzOkF1ZGlvTGluZVtdID0gW107XG4gICAgICAgIHByaXZhdGUgX3RlbXBMaW5lczpBdWRpb0xpbmVbXSA9IFtdO1xuXG4gICAgICAgIG11c2ljTXV0ZWQ6Ym9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBzb3VuZE11dGVkOmJvb2xlYW4gPSBmYWxzZTtcblxuICAgICAgICBjb250ZXh0OkF1ZGlvQ29udGV4dDtcbiAgICAgICAgZ2Fpbk5vZGU6QXVkaW9Ob2RlO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYXVkaW9DaGFubmVsTGluZXM6bnVtYmVyID0gMTAsIHByaXZhdGUgc291bmRDaGFubmVsTGluZXM6bnVtYmVyID0gMTAsIHByaXZhdGUgbXVzaWNDaGFubmVsTGluZXM6bnVtYmVyID0gMSl7XG4gICAgICAgICAgICBpZih1dGlscy5fYXVkaW9UeXBlU2VsZWN0ZWQgPT09IEFVRElPX1RZUEUuV0VCQVVESU8pIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQgPSBEZXZpY2UuZ2xvYmFsV2ViQXVkaW9Db250ZXh0O1xuICAgICAgICAgICAgICAgIHRoaXMuZ2Fpbk5vZGUgPSB0aGlzLmNyZWF0ZUdhaW5Ob2RlKHRoaXMuY29udGV4dCk7XG4gICAgICAgICAgICAgICAgdGhpcy5nYWluTm9kZS5jb25uZWN0KHRoaXMuY29udGV4dC5kZXN0aW5hdGlvbik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBpOm51bWJlcjtcbiAgICAgICAgICAgIGZvcihpID0gMDsgaSA8IHRoaXMuYXVkaW9DaGFubmVsTGluZXM7IGkrKyl7XG4gICAgICAgICAgICAgICAgdGhpcy5ub3JtYWxMaW5lcy5wdXNoKG5ldyBBdWRpb0xpbmUodGhpcykpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCB0aGlzLnNvdW5kQ2hhbm5lbExpbmVzOyBpKyspe1xuICAgICAgICAgICAgICAgIHRoaXMuc291bmRMaW5lcy5wdXNoKG5ldyBBdWRpb0xpbmUodGhpcykpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCB0aGlzLm11c2ljQ2hhbm5lbExpbmVzOyBpKyspe1xuICAgICAgICAgICAgICAgIHRoaXMubXVzaWNMaW5lcy5wdXNoKG5ldyBBdWRpb0xpbmUodGhpcykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZ2V0QXVkaW8oaWQ6c3RyaW5nKTpBdWRpb3tcbiAgICAgICAgICAgIHZhciBhdWRpbzpBdWRpbyA9IHV0aWxzLkF1ZGlvQ2FjaGVbaWRdO1xuICAgICAgICAgICAgYXVkaW8ubWFuYWdlciA9IHRoaXM7XG4gICAgICAgICAgICByZXR1cm4gYXVkaW87XG4gICAgICAgIH1cblxuICAgICAgICBwYXVzZUFsbExpbmVzKCk6QXVkaW9NYW5hZ2VyIHtcbiAgICAgICAgICAgIHRoaXMucGF1c2VNdXNpYygpO1xuICAgICAgICAgICAgdGhpcy5wYXVzZVNvdW5kKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc3VtZUFsbExpbmVzKCk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgdGhpcy5yZXN1bWVNdXNpYygpO1xuICAgICAgICAgICAgdGhpcy5yZXN1bWVTb3VuZCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwbGF5KGlkOnN0cmluZywgbG9vcD86Ym9vbGVhbnxGdW5jdGlvbiwgY2FsbGJhY2s/OkZ1bmN0aW9uKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICBpZih0eXBlb2YgbG9vcCA9PT0gXCJmdW5jdGlvblwiKXtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayA9IDxGdW5jdGlvbj5sb29wO1xuICAgICAgICAgICAgICAgIGxvb3AgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wbGF5KGlkLCB0aGlzLm5vcm1hbExpbmVzLCA8Ym9vbGVhbj5sb29wLCBjYWxsYmFjayk7XG4gICAgICAgIH1cblxuICAgICAgICBwbGF5TXVzaWMoaWQ6c3RyaW5nLCBsb29wPzpib29sZWFufEZ1bmN0aW9uLCBjYWxsYmFjaz86RnVuY3Rpb24pOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIGlmKHR5cGVvZiBsb29wID09PSBcImZ1bmN0aW9uXCIpe1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrID0gPEZ1bmN0aW9uPmxvb3A7XG4gICAgICAgICAgICAgICAgbG9vcCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BsYXkoaWQsIHRoaXMubXVzaWNMaW5lcywgPGJvb2xlYW4+bG9vcCwgY2FsbGJhY2spO1xuICAgICAgICB9XG5cbiAgICAgICAgcGxheVNvdW5kKGlkOnN0cmluZywgbG9vcD86Ym9vbGVhbnxGdW5jdGlvbiwgY2FsbGJhY2s/OkZ1bmN0aW9uKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICBpZih0eXBlb2YgbG9vcCA9PT0gXCJmdW5jdGlvblwiKXtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayA9IDxGdW5jdGlvbj5sb29wO1xuICAgICAgICAgICAgICAgIGxvb3AgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wbGF5KGlkLCB0aGlzLnNvdW5kTGluZXMsIDxib29sZWFuPmxvb3AsIGNhbGxiYWNrKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0b3AoaWQ/OnN0cmluZyk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N0b3AoaWQsIHRoaXMubm9ybWFsTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RvcE11c2ljKGlkPzpzdHJpbmcpOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdG9wKGlkLCB0aGlzLm11c2ljTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RvcFNvdW5kKGlkPzpzdHJpbmcpOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdG9wKGlkLCB0aGlzLnNvdW5kTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcGF1c2UoaWQ/OnN0cmluZyk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BhdXNlKGlkLCB0aGlzLm5vcm1hbExpbmVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBhdXNlTXVzaWMoaWQ/OnN0cmluZyk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BhdXNlKGlkLCB0aGlzLm11c2ljTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcGF1c2VTb3VuZChpZD86c3RyaW5nKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGF1c2UoaWQsIHRoaXMuc291bmRMaW5lcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXN1bWUoaWQ/OnN0cmluZyk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Jlc3VtZShpZCwgdGhpcy5ub3JtYWxMaW5lcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXN1bWVNdXNpYyhpZD86c3RyaW5nKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVzdW1lKGlkLCB0aGlzLm11c2ljTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzdW1lU291bmQoaWQ/OnN0cmluZyk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Jlc3VtZShpZCwgdGhpcy5zb3VuZExpbmVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG11dGUoaWQ/OnN0cmluZyk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX211dGUoaWQsIHRoaXMubm9ybWFsTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgbXV0ZU11c2ljKGlkPzpzdHJpbmcpOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tdXRlKGlkLCB0aGlzLm11c2ljTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgbXV0ZVNvdW5kKGlkPzpzdHJpbmcpOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tdXRlKGlkLCB0aGlzLnNvdW5kTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdW5tdXRlKGlkPzpzdHJpbmcpOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl91bm11dGUoaWQsIHRoaXMubm9ybWFsTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdW5tdXRlTXVzaWMoaWQ/OnN0cmluZyk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3VubXV0ZShpZCwgdGhpcy5tdXNpY0xpbmVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHVubXV0ZVNvdW5kKGlkPzpzdHJpbmcpOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl91bm11dGUoaWQsIHRoaXMuc291bmRMaW5lcyk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9wYXVzZShpZDpzdHJpbmcsIGxpbmVzOkF1ZGlvTGluZVtdKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICBpZighaWQpe1xuICAgICAgICAgICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBpZighbGluZXNbaV0uYXZhaWxhYmxlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzW2ldLnBhdXNlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGF1ZGlvTGluZXM6QXVkaW9MaW5lW10gPSB0aGlzLl9nZXRMaW5lc0J5SWQoaWQsIGxpbmVzKTtcbiAgICAgICAgICAgIGlmKGF1ZGlvTGluZXMubGVuZ3RoKXtcbiAgICAgICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCBhdWRpb0xpbmVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICAgICAgYXVkaW9MaW5lc1tpXS5wYXVzZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfcmVzdW1lKGlkOnN0cmluZywgbGluZXM6QXVkaW9MaW5lW10pOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIGlmKCFpZCl7XG4gICAgICAgICAgICAgICAgZm9yKHZhciBpOm51bWJlciA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgICAgIGlmKCFsaW5lc1tpXS5hdmFpbGFibGUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluZXNbaV0ucmVzdW1lKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGF1ZGlvTGluZXM6QXVkaW9MaW5lW10gPSB0aGlzLl9nZXRMaW5lc0J5SWQoaWQsIGxpbmVzKTtcbiAgICAgICAgICAgIGlmKGF1ZGlvTGluZXMubGVuZ3RoKXtcbiAgICAgICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCBhdWRpb0xpbmVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICAgICAgYXVkaW9MaW5lc1tpXS5yZXN1bWUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX3BsYXkoaWQ6c3RyaW5nLCBsaW5lczpBdWRpb0xpbmVbXSwgbG9vcDpib29sZWFuID0gZmFsc2UsIGNhbGxiYWNrPzpGdW5jdGlvbik6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgdmFyIGxpbmU6QXVkaW9MaW5lID0gdGhpcy5fZ2V0QXZhaWxhYmxlTGluZUZyb20obGluZXMpO1xuICAgICAgICAgICAgaWYoIWxpbmUpe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0F1ZGlvTWFuYWdlcjogQWxsIGxpbmVzIGFyZSBidXN5IScpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgYXVkaW86QXVkaW8gPSB0aGlzLmdldEF1ZGlvKGlkKTtcbiAgICAgICAgICAgIGlmKCFhdWRpbyl7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignQXVkaW8gKCcgKyBpZCArICcpIG5vdCBmb3VuZC4nKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGluZS5zZXRBdWRpbyhhdWRpbywgbG9vcCwgY2FsbGJhY2spLnBsYXkoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfc3RvcChpZDpzdHJpbmcsIGxpbmVzOkF1ZGlvTGluZVtdKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICBpZighaWQpe1xuICAgICAgICAgICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBpZighbGluZXNbaV0uYXZhaWxhYmxlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzW2ldLnN0b3AoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgYXVkaW9MaW5lczpBdWRpb0xpbmVbXSA9IHRoaXMuX2dldExpbmVzQnlJZChpZCwgbGluZXMpO1xuICAgICAgICAgICAgaWYoYXVkaW9MaW5lcy5sZW5ndGgpe1xuICAgICAgICAgICAgICAgIGZvcihpID0gMDsgaSA8IGF1ZGlvTGluZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBhdWRpb0xpbmVzW2ldLnN0b3AoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfbXV0ZShpZDpzdHJpbmcsIGxpbmVzOkF1ZGlvTGluZVtdKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICBpZighaWQpe1xuICAgICAgICAgICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBpZighbGluZXNbaV0uYXZhaWxhYmxlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzW2ldLm11dGUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgYXVkaW9MaW5lczpBdWRpb0xpbmVbXSA9IHRoaXMuX2dldExpbmVzQnlJZChpZCwgbGluZXMpO1xuICAgICAgICAgICAgaWYoYXVkaW9MaW5lcy5sZW5ndGgpe1xuICAgICAgICAgICAgICAgIGZvcihpID0gMDsgaSA8IGF1ZGlvTGluZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBhdWRpb0xpbmVzW2ldLm11dGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX3VubXV0ZShpZDpzdHJpbmcsIGxpbmVzOkF1ZGlvTGluZVtdKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICBpZighaWQpe1xuICAgICAgICAgICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBpZighbGluZXNbaV0uYXZhaWxhYmxlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzW2ldLnVubXV0ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBhdWRpb0xpbmVzOkF1ZGlvTGluZVtdID0gdGhpcy5fZ2V0TGluZXNCeUlkKGlkLCBsaW5lcyk7XG4gICAgICAgICAgICBpZihhdWRpb0xpbmVzLmxlbmd0aCl7XG4gICAgICAgICAgICAgICAgZm9yKGkgPSAwOyBpIDwgYXVkaW9MaW5lcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgICAgIGF1ZGlvTGluZXNbaV0udW5tdXRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9nZXRMaW5lc0J5SWQoaWQ6c3RyaW5nLCBsaW5lczpBdWRpb0xpbmVbXSk6QXVkaW9MaW5lW10ge1xuICAgICAgICAgICAgdGhpcy5fdGVtcExpbmVzLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICBmb3IodmFyIGk6bnVtYmVyID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICBpZighbGluZXNbaV0uYXZhaWxhYmxlKXtcbiAgICAgICAgICAgICAgICAgICAgaWYobGluZXNbaV0uYXVkaW8uaWQgPT09IGlkKXRoaXMuX3RlbXBMaW5lcy5wdXNoKGxpbmVzW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90ZW1wTGluZXM7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9nZXRBdmFpbGFibGVMaW5lRnJvbShsaW5lczpBdWRpb0xpbmVbXSk6QXVkaW9MaW5le1xuICAgICAgICAgICAgdmFyIGw6QXVkaW9MaW5lO1xuICAgICAgICAgICAgZm9yKHZhciBpOm51bWJlciA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgaWYobGluZXNbaV0uYXZhaWxhYmxlKXtcbiAgICAgICAgICAgICAgICAgICAgbCA9IGxpbmVzW2ldO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNyZWF0ZUdhaW5Ob2RlKGN0eDpBdWRpb0NvbnRleHQpOkdhaW5Ob2Rle1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5jcmVhdGVHYWluID8gY3R4LmNyZWF0ZUdhaW4oKSA6IGN0eC5jcmVhdGVHYWluTm9kZSgpO1xuICAgICAgICB9XG5cbiAgICB9XG59XG5cbmludGVyZmFjZSBBdWRpb0NvbnRleHQge1xuICAgIGNyZWF0ZUdhaW5Ob2RlKCk6YW55O1xufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4vQXVkaW9NYW5hZ2VyLnRzXCIgLz5cbm1vZHVsZSBQSVhJIHtcbiAgICBleHBvcnQgY2xhc3MgQXVkaW8ge1xuICAgICAgICBsb29wOmJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgcHJpdmF0ZSBfdm9sdW1lOm51bWJlciA9IDE7XG4gICAgICAgIG11dGVkOmJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgbWFuYWdlcjpBdWRpb01hbmFnZXI7XG5cbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIHNvdXJjZTphbnksIHB1YmxpYyBpZDpzdHJpbmcpe31cblxuICAgICAgICBwbGF5KGxvb3A/OmJvb2xlYW58RnVuY3Rpb24sIGNhbGxiYWNrPzpGdW5jdGlvbik6QXVkaW97XG4gICAgICAgICAgICBpZighdGhpcy5tYW5hZ2VyKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdUaGlzIGF1ZGlvIG5lZWQgYSBtYW5hZ2VyLicpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZih0eXBlb2YgbG9vcCA9PT0gXCJmdW5jdGlvblwiKXtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayA9IDxGdW5jdGlvbj5sb29wO1xuICAgICAgICAgICAgICAgIGxvb3AgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLnBsYXkodGhpcy5pZCwgbG9vcCwgY2FsbGJhY2spO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBzdG9wKCk6QXVkaW8ge1xuICAgICAgICAgICAgaWYoIXRoaXMubWFuYWdlcil7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignVGhpcyBhdWRpbyBuZWVkIGEgbWFuYWdlci4nKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLnN0b3AodGhpcy5pZCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIG11dGUoKTpBdWRpbyB7XG4gICAgICAgICAgICBpZighdGhpcy5tYW5hZ2VyKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdUaGlzIGF1ZGlvIG5lZWQgYSBtYW5hZ2VyLicpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLm11dGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5tdXRlKHRoaXMuaWQpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICB1bm11dGUoKTpBdWRpbyB7XG4gICAgICAgICAgICBpZighdGhpcy5tYW5hZ2VyKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdUaGlzIGF1ZGlvIG5lZWQgYSBtYW5hZ2VyLicpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLm11dGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLm1hbmFnZXIudW5tdXRlKHRoaXMuaWQpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwYXVzZSgpOkF1ZGlvIHtcbiAgICAgICAgICAgIGlmKCF0aGlzLm1hbmFnZXIpe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1RoaXMgYXVkaW8gbmVlZCBhIG1hbmFnZXIuJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5wYXVzZSh0aGlzLmlkKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzdW1lKCk6QXVkaW8ge1xuICAgICAgICAgICAgaWYoIXRoaXMubWFuYWdlcil7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignVGhpcyBhdWRpbyBuZWVkIGEgbWFuYWdlci4nKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLnJlc3VtZSh0aGlzLmlkKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHZvbHVtZSgpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ZvbHVtZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldCB2b2x1bWUodmFsdWU6bnVtYmVyKXtcbiAgICAgICAgICAgIHRoaXMuX3ZvbHVtZSA9IHZhbHVlO1xuXG4gICAgICAgICAgICBpZih0aGlzLm1hbmFnZXIpe1xuICAgICAgICAgICAgICAgIC8vVE9ETzogdXBkYXRlIHRoZSB2b2x1bWUgb24gdGhlIGZseVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2RlZnMvcGl4aS5qcy5kLnRzXCIgLz5cbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL2NvcmUvY29uc3QudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vdHdlZW4vVHdlZW4udHNcIiAvPlxubW9kdWxlIFBJWEkge1xuICAgIENvbnRhaW5lci5fa2lsbGVkT2JqZWN0cyA9IFtdO1xuXG4gICAgQ29udGFpbmVyLnByb3RvdHlwZS5fekluZGV4ID0gMDtcbiAgICBDb250YWluZXIucHJvdG90eXBlLnpEaXJ0eSA9IGZhbHNlO1xuXG4gICAgQ29udGFpbmVyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihkZWx0YVRpbWU6IG51bWJlcik6Q29udGFpbmVyIHtcbiAgICAgICAgaWYodGhpcy56RGlydHkpe1xuICAgICAgICAgICAgdGhpcy56RGlydHkgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuc29ydENoaWxkcmVuQnlaSW5kZXgoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucG9zaXRpb24ueCArPSB0aGlzLnZlbG9jaXR5LnggKiBkZWx0YVRpbWU7XG4gICAgICAgIHRoaXMucG9zaXRpb24ueSArPSB0aGlzLnZlbG9jaXR5LnkgKiBkZWx0YVRpbWU7XG4gICAgICAgIHRoaXMucm90YXRpb24gKz0gdGhpcy5yb3RhdGlvblNwZWVkICogZGVsdGFUaW1lO1xuXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5baV0udXBkYXRlKGRlbHRhVGltZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgdmFyIF9hZGRDaGlsZDpGdW5jdGlvbiA9IENvbnRhaW5lci5wcm90b3R5cGUuYWRkQ2hpbGQ7XG4gICAgQ29udGFpbmVyLnByb3RvdHlwZS5hZGRDaGlsZCA9IGZ1bmN0aW9uKGNoaWxkOkRpc3BsYXlPYmplY3QpOkRpc3BsYXlPYmplY3R7XG4gICAgICAgIF9hZGRDaGlsZC5jYWxsKHRoaXMsIGNoaWxkKTtcbiAgICAgICAgaWYoekluZGV4RW5hYmxlZCl0aGlzLnpEaXJ0eSA9IHRydWU7XG4gICAgICAgIHJldHVybiBjaGlsZDtcbiAgICB9O1xuXG4gICAgQ29udGFpbmVyLnByb3RvdHlwZS5hZGRUbyA9IGZ1bmN0aW9uKHBhcmVudCk6Q29udGFpbmVye1xuICAgICAgICBwYXJlbnQuYWRkQ2hpbGQodGhpcyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBDb250YWluZXIucHJvdG90eXBlLmtpbGwgPSBmdW5jdGlvbigpOkNvbnRhaW5lcntcbiAgICAgICAgUElYSS5Db250YWluZXIuX2tpbGxlZE9iamVjdHMucHVzaCh0aGlzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIENvbnRhaW5lci5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgaWYodGhpcy5wYXJlbnQpe1xuICAgICAgICAgICAgdGhpcy5wYXJlbnQucmVtb3ZlQ2hpbGQodGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIENvbnRhaW5lci5wcm90b3R5cGUuc29ydENoaWxkcmVuQnlaSW5kZXggPSBmdW5jdGlvbigpOkNvbnRhaW5lciB7XG4gICAgICAgIHRoaXMuY2hpbGRyZW4uc29ydChmdW5jdGlvbihhOkNvbnRhaW5lciwgYjpDb250YWluZXIpe1xuICAgICAgICAgICAgdmFyIGFaID0gYS56SW5kZXgsXG4gICAgICAgICAgICAgICAgYlogPSBiLnpJbmRleDtcblxuICAgICAgICAgICAgcmV0dXJuIGFaIC0gYlo7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgQ29udGFpbmVyLnByb3RvdHlwZS50d2VlbiA9IGZ1bmN0aW9uKG1hbmFnZXI/OlR3ZWVuTWFuYWdlcik6VHdlZW57XG4gICAgICAgIHJldHVybiBuZXcgVHdlZW4odGhpcyk7XG4gICAgfTtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShDb250YWluZXIucHJvdG90eXBlLCAnekluZGV4Jywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCk6bnVtYmVye1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3pJbmRleDtcbiAgICAgICAgfSxcblxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlOm51bWJlcil7XG4gICAgICAgICAgICB0aGlzLl96SW5kZXggPSB2YWx1ZTtcbiAgICAgICAgICAgIGlmKHpJbmRleEVuYWJsZWQmJnRoaXMucGFyZW50KXRoaXMucGFyZW50LnpEaXJ0eSA9IHRydWU7XG4gICAgICAgIH1cblxuICAgIH0pO1xuXG59IiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vZGVmcy9waXhpLmpzLmQudHNcIiAvPlxuXG5tb2R1bGUgUElYSSB7XG4gICAgRGlzcGxheU9iamVjdC5wcm90b3R5cGUuc3BlZWQgPSAwO1xuICAgIERpc3BsYXlPYmplY3QucHJvdG90eXBlLnZlbG9jaXR5ID0gbmV3IFBvaW50KCk7XG4gICAgRGlzcGxheU9iamVjdC5wcm90b3R5cGUuZGlyZWN0aW9uID0gMDtcbiAgICBEaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5yb3RhdGlvblNwZWVkID0gMDtcblxuICAgIERpc3BsYXlPYmplY3QucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKGRlbHRhVGltZTpudW1iZXIpOkRpc3BsYXlPYmplY3R7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG59XG4iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9kZWZzL3BpeGkuanMuZC50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi90d2Vlbi9QYXRoLnRzXCIgLz5cbm1vZHVsZSBQSVhJIHtcbiAgICBHcmFwaGljcy5wcm90b3R5cGUuZHJhd1BhdGggPSBmdW5jdGlvbihwYXRoOlBhdGgpOkdyYXBoaWNze1xuICAgICAgICBwYXRoLnBhcnNlUG9pbnRzKCk7XG4gICAgICAgIHRoaXMuZHJhd1NoYXBlKHBhdGgucG9seWdvbik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG59IiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vZGVmcy9waXhpLmpzLmQudHNcIiAvPlxuXG5tb2R1bGUgUElYSSB7XG4gICAgZXh0cmFzLlRpbGluZ1Nwcml0ZS5wcm90b3R5cGUudGlsZVZlbG9jaXR5ID0gbmV3IFBvaW50KCk7XG4gICAgZXh0cmFzLlRpbGluZ1Nwcml0ZS5wcm90b3R5cGUudGlsZVNwZWVkID0gMDtcbiAgICBleHRyYXMuVGlsaW5nU3ByaXRlLnByb3RvdHlwZS50aWxlRGlyZWN0aW9uID0gMDtcblxuICAgIGV4dHJhcy5UaWxpbmdTcHJpdGUucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKGRlbHRhVGltZTpudW1iZXIpOmV4dHJhcy5UaWxpbmdTcHJpdGV7XG4gICAgICAgIHRoaXMudGlsZVBvc2l0aW9uLnggKz0gdGhpcy50aWxlVmVsLnggKiBkZWx0YVRpbWU7XG4gICAgICAgIHRoaXMudGlsZVBvc2l0aW9uLnkgKz0gdGhpcy50aWxlVmVsLnkgKiBkZWx0YVRpbWU7XG5cbiAgICAgICAgQ29udGFpbmVyLnByb3RvdHlwZS51cGRhdGUuY2FsbCh0aGlzLCBkZWx0YVRpbWUpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9kZWZzL3BpeGkuanMuZC50c1wiIC8+XG5tb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IGNsYXNzIFBvb2wge1xuICAgICAgICBwcml2YXRlIF9pdGVtczphbnlbXSA9IFtdO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGFtb3VudDpudW1iZXIsIHB1YmxpYyBvYmplY3RDdG9yOmFueSwgcHVibGljIGFyZ3M6YW55W10gPSBbXSl7XG4gICAgICAgICAgICBmb3IodmFyIGk6bnVtYmVyID0gMDsgaSA8IGFtb3VudDsgaSsrKXtcbiAgICAgICAgICAgICAgICB0aGlzLl9pdGVtcy5wdXNoKHRoaXMuX25ld09iamVjdCgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX25ld09iamVjdCgpOmFueXtcbiAgICAgICAgICAgIHZhciBvYmo6YW55O1xuICAgICAgICAgICAgdHJ5e1xuICAgICAgICAgICAgICAgIG9iaiA9IG5ldyAoRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQuYXBwbHkodGhpcy5vYmplY3RDdG9yLCAoW251bGxdKS5jb25jYXQodGhpcy5hcmdzKSkpKCk7XG4gICAgICAgICAgICB9Y2F0Y2goZSl7XG4gICAgICAgICAgICAgICAgb2JqID0gX25ld09iaih0aGlzLm9iamVjdEN0b3IsIHRoaXMuYXJncyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBtZTpQb29sID0gdGhpcztcbiAgICAgICAgICAgIG9iai5yZXR1cm5Ub1Bvb2wgPSBmdW5jdGlvbiByZXR1cm5Ub1Bvb2woKXtcbiAgICAgICAgICAgICAgICAgIG1lLnB1dCh0aGlzKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgIH1cblxuICAgICAgICBwdXQoaXRlbTphbnkpOnZvaWR7XG4gICAgICAgICAgICB0aGlzLl9pdGVtcy51bnNoaWZ0KGl0ZW0pO1xuICAgICAgICAgICAgaWYoaXRlbS5vblJldHVyblRvUG9vbClpdGVtLm9uUmV0dXJuVG9Qb29sKHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0KCk6YW55e1xuICAgICAgICAgICAgdmFyIGl0ZW06YW55ID0gKHRoaXMuX2l0ZW1zLmxlbmd0aCkgPyB0aGlzLl9pdGVtcy5wb3AoKSA6IHRoaXMuX25ld09iamVjdCgpO1xuICAgICAgICAgICAgaWYoaXRlbS5vbkdldEZyb21Qb29sKWl0ZW0ub25HZXRGcm9tUG9vbCh0aGlzKTtcbiAgICAgICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGxlbmd0aCgpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2l0ZW1zLmxlbmd0aDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vc2FmYXJpIGZpeFxuICAgIGZ1bmN0aW9uIF9uZXdPYmoob2JqOmFueSwgYXJnczphbnlbXSk6YW55e1xuICAgICAgICB2YXIgZXY6c3RyaW5nID0gXCJGdW5jdGlvbignb2JqJyxcIjtcbiAgICAgICAgdmFyIGZuOnN0cmluZyA9IFwiXFxcInJldHVybiBuZXcgb2JqKFwiO1xuXG4gICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICBldiArPSBcIidhXCIraStcIicsXCI7XG4gICAgICAgICAgICBmbiArPSBcImFcIitpO1xuICAgICAgICAgICAgaWYoaSAhPT0gYXJncy5sZW5ndGgtMSl7XG4gICAgICAgICAgICAgICAgZm4gKz0gXCIsXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmbiArPSBcIilcXFwiXCI7XG4gICAgICAgIGV2ICs9IGZuICsgXCIpXCI7XG5cbiAgICAgICAgcmV0dXJuIChldmFsKGV2KSkuYXBwbHkodGhpcywgKFtvYmpdKS5jb25jYXQoYXJncykpO1xuICAgIH1cbn0iLCIvLy88cmVmZWVuY2UgcGF0aD1cIi4uLy4uL2RlZnMvcGl4aS5qcy5kLnRzXCIgLz5cbm1vZHVsZSBQSVhJIHtcbiAgICBleHBvcnQgY2xhc3MgU3BlZWRQb2ludCBleHRlbmRzIFBvaW50IHtcbiAgICAgICAgcHJpdmF0ZSBfeDpudW1iZXI7XG4gICAgICAgIHByaXZhdGUgX3k6bnVtYmVyO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHg/Om51bWJlciwgeT86bnVtYmVyICxwcml2YXRlIF9jYWxsYmFjaz86RnVuY3Rpb24pe1xuICAgICAgICAgICAgc3VwZXIoeCx5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldCB4KHZhbHVlKXtcbiAgICAgICAgICAgIGlmKHZhbHVlID09PSB0aGlzLl94KXJldHVybjtcbiAgICAgICAgICAgIHRoaXMuX3ggPSB2YWx1ZTtcblxuICAgICAgICAgICAgaWYodGhpcy5fY2FsbGJhY2spdGhpcy5fY2FsbGJhY2soKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCB4KCk6bnVtYmVye1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3g7XG4gICAgICAgIH1cblxuICAgICAgICBzZXQgeSh2YWx1ZSl7XG4gICAgICAgICAgICBpZih2YWx1ZSA9PT0gdGhpcy5feSlyZXR1cm47XG4gICAgICAgICAgICB0aGlzLl95ID0gdmFsdWU7XG5cbiAgICAgICAgICAgIGlmKHRoaXMuX2NhbGxiYWNrKXRoaXMuX2NhbGxiYWNrKCk7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgeSgpOm51bWJlcntcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl95O1xuICAgICAgICB9XG4gICAgfVxufSJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
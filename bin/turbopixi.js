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
    }(PIXI || (PIXI = {})));
    var PIXI;
    (function (PIXI) {
        var AudioManager = function () {
            function AudioManager(game) {
                this.game = game;
            }
            return AudioManager;
        }();
        PIXI.AudioManager = AudioManager;
    }(PIXI || (PIXI = {})));
    var PIXI;
    (function (PIXI) {
        var DataManager = function () {
            function DataManager(game, usePersitantData) {
                if (usePersitantData === void 0) {
                    usePersitantData = false;
                }
                this.game = game;
                this.usePersistantData = usePersitantData;
                this.load();
            }
            DataManager.prototype.load = function () {
                this._data = JSON.parse(localStorage.getItem(this.game.id)) || {};
                return this;
            };
            DataManager.prototype.save = function () {
                if (this.usePersistantData) {
                    localStorage.setItem(this.game.id, JSON.stringify(this._data));
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
    //Many checks are based on https://github.com/arasatasaygin/is.js/blob/master/is.js
    ///<reference path="../../defs/pixi.js.d.ts" />
    var PIXI;
    (function (PIXI) {
        var navigator = window.navigator;
        var document = window.document;
        var userAgent = 'navigator' in window && 'userAgent' in navigator && navigator.userAgent.toLowerCase() || '', vendor = 'navigator' in window && 'vendor' in navigator && navigator.vendor.toLowerCase() || '', appVersion = 'navigator' in window && 'appVersion' in navigator && navigator.appVersion.toLowerCase() || '';
        //Browsers
        var isChrome = /chrome|chromium/i.test(userAgent) && /google inc/.test(vendor), isFirefox = /firefox/i.test(userAgent), isIE = /msie/i.test(userAgent) || 'ActiveXObject' in window, isOpera = /^Opera\//.test(userAgent) || /\x20OPR\//.test(userAgent), isSafari = /safari/i.test(userAgent) && /apple computer/i.test(vendor);
        //Devices && OS
        var isIphone = /iphone/i.test(userAgent), isIpad = /ipad/i.test(userAgent), isIpod = /ipod/i.test(userAgent), isAndroid = /android/i.test(userAgent), isAndroidPhone = /android/i.test(userAgent) && /mobile/i.test(userAgent), isAndroidTablet = /android/i.test(userAgent) && !/mobile/i.test(userAgent), isLinux = /linux/i.test(appVersion), isMac = /mac/i.test(appVersion), isWindow = /win/i.test(appVersion), isWindowPhone = isWindow && /phone/i.test(userAgent), isWindowTablet = isWindow && !isWindowPhone && /touch/i.test(userAgent), isMobile = isIphone || isIpod || isAndroidPhone || isWindowPhone, isTablet = isIpad || isAndroidTablet || isWindowTablet, isDesktop = !isMobile && !isTablet, isTouchDevice = 'ontouchstart' in window || 'DocumentTouch' in window && document instanceof DocumentTouch, isCocoon = !!navigator.isCocoonJS, isNodeWebkit = !!(typeof process === 'object' && process.title === 'node' && typeof global === 'object'), isEjecta = !!window.ejecta, isCrosswalk = /Crosswalk/.test(userAgent), isCordova = !!window.cordova, isElectron = !!(typeof process === 'object' && process.versions && (process.versions.electron || process.versions['atom-shell']));
        var hasVibrate = !!navigator.vibrate && (isMobile || isTablet), hasMouseWheel = 'onwheel' in window || 'onmousewheel' in window || 'MouseScrollEvent' in window, hasAccelerometer = 'DeviceMotionEvent' in window, hasGamepad = !!navigator.getGamepads || !!navigator.webkitGetGamepads;
        //FullScreen
        var div = document.createElement('div');
        var fullScreenRequest = div.requestFullscreen || div.webkitRequestFullScreen || div.msRequestFullScreen || div.mozRequestFullScreen, fullScreenCancel = document.cancelFullScreen || document.exitFullScreen || document.webkitCancelFullScreen || document.msCancelFullScreen || document.mozCancelFullScreen, hasFullScreen = !!(fullScreenRequest && fullScreenCancel);
        //Audio
        var hasHTMLAudio = !!window.Audio, webAudioContext = window.AudioContext || window.webkitAudioContext, hasWebAudio = !!webAudioContext, hasAudio = hasWebAudio || hasHTMLAudio, hasMp3 = false, hasOgg = false, hasWav = false, hasM4a = false;
        //Audio mimeTypes
        if (hasAudio) {
            var audio = document.createElement('audio');
            hasMp3 = audio.canPlayType('audio/mpeg;') !== '';
            hasOgg = audio.canPlayType('audio/ogg; codecs="vorbis"') !== '';
            hasWav = audio.canPlayType('audio/wav') !== '';
            hasM4a = audio.canPlayType('audio/mp4; codecs="mp4a.40.5"') !== '';
        }
        PIXI.Device = {
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
                } else if ('onmousewheel' in window) {
                    evt = 'mousewheel';
                } else if ('MouseScrollEvent' in window) {
                    evt = 'DOMMouseScroll';
                }
                return evt;
            },
            vibrate: function (pattern) {
                if (hasVibrate) {
                    navigator.vibrate(pattern);
                }
            },
            getVisibilityChangeEvent: function () {
                if (typeof document.hidden !== 'undefined') {
                    return 'visibilitychange';
                } else if (typeof document.webkitHidden !== 'undefined') {
                    return 'webkitvisibilitychange';
                } else if (typeof document.mozHidden !== 'undefined') {
                    return 'mozvisibilitychange';
                } else if (typeof document.msHidden !== 'undefined') {
                    return 'msvisibilitychange';
                }
            },
            get isOnline() {
                return window.navigator.onLine;
            }
        };
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
        var Scene = function (_super) {
            __extends(Scene, _super);
            function Scene(id) {
                if (id === void 0) {
                    id = 'scene' + Scene._idLen++;
                }
                _super.call(this);
                this.id = id;
            }
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
    ///<reference path="./Device.ts" />
    ///<reference path="../display/Scene.ts" />
    ///<reference path="../audio/AudioManager.ts" />
    ///<reference path="../input/InputManager.ts" />
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
            stopAtLostFocus: true
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
                this.isWebAudio = PIXI.Device.hasWebAudio && config.useWebAudio;
                this.input = new PIXI.InputManager(this);
                this.audio = new PIXI.AudioManager(this);
                this.data = new PIXI.DataManager(this, config.usePersistantData);
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
                for (var i = 0; i < this.scene.children.length; i++) {
                    this.scene.children[i].update(this.delta);
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
    ///<reference path="../../defs/pixi.js.d.ts" />
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
    var PIXI;
    (function (PIXI) {
        var LoaderMiddleware = [];
        PIXI.loaders.Loader._pixiMiddleware = PIXI.loaders.Loader._pixiMiddleware.concat(LoaderMiddleware);
    }(PIXI || (PIXI = {})));
}(typeof PIXI === 'object' ? PIXI : null));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInR1cmJvcGl4aS5qcyIsImluZGV4LnRzIiwiYXVkaW8vQXVkaW9NYW5hZ2VyLnRzIiwiY29yZS9EYXRhTWFuYWdlci50cyIsImNvcmUvRGV2aWNlLnRzIiwiZGlzcGxheS9TY2VuZS50cyIsImlucHV0L0lucHV0TWFuYWdlci50cyIsImNvcmUvR2FtZS50cyIsImRpc3BsYXkvQ29udGFpbmVyLnRzIiwiZGlzcGxheS9EaXNwbGF5T2JqZWN0LnRzIiwibG9hZGVyL0xvYWRlci50cyJdLCJuYW1lcyI6WyJQSVhJIiwiRXJyb3IiLCJQSVhJX1ZFUlNJT05fUkVRVUlSRUQiLCJQSVhJX1ZFUlNJT04iLCJWRVJTSU9OIiwibWF0Y2giLCJQSVhJLkdBTUVfU0NBTEVfVFlQRSIsIlBJWEkuQVVESU9fVFlQRSIsIlBJWEkuQXVkaW9NYW5hZ2VyIiwiUElYSS5BdWRpb01hbmFnZXIuY29uc3RydWN0b3IiLCJQSVhJLkRhdGFNYW5hZ2VyIiwiUElYSS5EYXRhTWFuYWdlci5jb25zdHJ1Y3RvciIsIlBJWEkuRGF0YU1hbmFnZXIubG9hZCIsIlBJWEkuRGF0YU1hbmFnZXIuc2F2ZSIsIlBJWEkuRGF0YU1hbmFnZXIucmVzZXQiLCJQSVhJLkRhdGFNYW5hZ2VyLnNldCIsIlBJWEkuRGF0YU1hbmFnZXIuZ2V0IiwiUElYSS5EYXRhTWFuYWdlci5kZWwiLCJoYXNNb3VzZVdoZWVsIiwiZXZ0Iiwid2luZG93IiwiaGFzVmlicmF0ZSIsIm5hdmlnYXRvciIsInZpYnJhdGUiLCJwYXR0ZXJuIiwiZG9jdW1lbnQiLCJoaWRkZW4iLCJ3ZWJraXRIaWRkZW4iLCJtb3pIaWRkZW4iLCJtc0hpZGRlbiIsIlBJWEkuaXNPbmxpbmUiLCJfX2V4dGVuZHMiLCJkIiwiYiIsInAiLCJoYXNPd25Qcm9wZXJ0eSIsIl9fIiwiY29uc3RydWN0b3IiLCJwcm90b3R5cGUiLCJQSVhJLlNjZW5lIiwiUElYSS5TY2VuZS5jb25zdHJ1Y3RvciIsIlBJWEkuU2NlbmUuYWRkVG8iLCJQSVhJLklucHV0TWFuYWdlciIsIlBJWEkuSW5wdXRNYW5hZ2VyLmNvbnN0cnVjdG9yIiwiUElYSS5HYW1lIiwiUElYSS5HYW1lLmNvbnN0cnVjdG9yIiwiUElYSS5HYW1lLl9hbmltYXRlIiwiUElYSS5HYW1lLnVwZGF0ZSIsIlBJWEkuR2FtZS5zdGFydCIsIlBJWEkuR2FtZS5zdG9wIiwiUElYSS5HYW1lLmVuYWJsZVN0b3BBdExvc3RGb2N1cyIsIlBJWEkuR2FtZS5kaXNhYmxlU3RvcEF0TG9zdEZvY3VzIiwiUElYSS5HYW1lLl9vblZpc2liaWxpdHlDaGFuZ2UiLCJQSVhJLkdhbWUub25Mb3N0Rm9jdXMiLCJQSVhJLkdhbWUuc2V0U2NlbmUiLCJQSVhJLkdhbWUuZ2V0U2NlbmUiLCJQSVhJLkdhbWUuY3JlYXRlU2NlbmUiLCJQSVhJLkdhbWUucmVtb3ZlU2NlbmUiLCJQSVhJLkdhbWUuYWRkU2NlbmUiLCJQSVhJLkdhbWUucmVtb3ZlQWxsU2NlbmVzIiwiUElYSS5HYW1lLnJlc2l6ZSIsIlBJWEkuR2FtZS5hdXRvUmVzaXplIiwiUElYSS5HYW1lLl9yZXNpemVNb2RlQXNwZWN0Rml0IiwiUElYSS5HYW1lLl9yZXNpemVNb2RlQXNwZWN0RmlsbCIsIlBJWEkuR2FtZS5fcmVzaXplTW9kZUZpbGwiLCJnZXQiLCJQSVhJLkdhbWUud2lkdGgiLCJlbnVtZXJhYmxlIiwiY29uZmlndXJhYmxlIiwiUElYSS5HYW1lLmhlaWdodCIsInBvc2l0aW9uIiwieCIsInZlbG9jaXR5IiwiZGVsdGFUaW1lIiwieSIsInJvdGF0aW9uIiwicm90YXRpb25TcGVlZCIsImkiLCJjaGlsZHJlbiIsImxlbmd0aCIsInVwZGF0ZSIsInBhcmVudCIsImFkZENoaWxkIiwiQ29udGFpbmVyIiwiX2tpbGxlZE9iamVjdHMiLCJwdXNoIiwicmVtb3ZlQ2hpbGQiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0lDTEEsSUFBRyxDQUFDQSxJQUFKLEVBQVM7QUFBQSxRQUNMLE1BQU0sSUFBSUMsS0FBSixDQUFVLHdC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Q0FBeENBLENBSlE7QUFBQSxRQU1SQSxJQUFBQSxDQUFBQSxhQUFBQSxDQUFjQSxTQUFkQSxDQUF3QkEsTUFBeEJBLEdBQWlDQSxVQUFTQSxTQUFUQSxFQUF5QkE7QUFBQUEsWUFDdEQsT0FBTyxJQUFQLENBRHNEQTtBQUFBQSxTQUExREEsQ0FOUTtBQUFBLEtBQVosQ0FBT0EsSUFBQSxJQUFBLENBQUFBLElBQUEsR0FBSSxFQUFKLENBQVA7SUNEQTtBQUFBLFFBQU9BLElBQVA7SUFBQSxDQUFBLFVBQU9BLElBQVAsRUFBWTtBQUFBLFFBQ1JBLElBQUlBLGdCQUFBQSxHQUF5QkEsRUFBN0JBLENBRFE7QUFBQSxRQUtSQSxJQUFBQSxDQUFBQSxPQUFBQSxDQUFRQSxNQUFSQSxDQUFlQSxlQUFmQSxHQUFpQ0EsSUFBQUEsQ0FBQUEsT0FBQUEsQ0FBUUEsTUFBUkEsQ0FBZUEsZUFBZkEsQ0FBK0JBLE1BQS9CQSxDQUFzQ0EsZ0JBQXRDQSxDQUFqQ0EsQ0FMUTtBQUFBLEtBQVosQ0FBT0EsSUFBQSxJQUFBLENBQUFBLElBQUEsR0FBSSxFQUFKLENBQVAiLCJmaWxlIjoidHVyYm9waXhpLmpzIiwic291cmNlc0NvbnRlbnQiOltudWxsLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9kZWZzL3BpeGkuanMuZC50c1wiIC8+XG5pZighUElYSSl7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdFeSEgV2hlcmUgaXMgcGl4aS5qcz8/Jyk7XG59XG5cbmNvbnN0IFBJWElfVkVSU0lPTl9SRVFVSVJFRCA9IFwiMy4wLjdcIjtcbmNvbnN0IFBJWElfVkVSU0lPTiA9IFBJWEkuVkVSU0lPTi5tYXRjaCgvXFxkLlxcZC5cXGQvKVswXTtcblxuaWYoUElYSV9WRVJTSU9OIDwgUElYSV9WRVJTSU9OX1JFUVVJUkVEKXtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJQaXhpLmpzIHZcIiArIFBJWEkuVkVSU0lPTiArIFwiIGl0J3Mgbm90IHN1cHBvcnRlZCwgcGxlYXNlIHVzZSBeXCIgKyBQSVhJX1ZFUlNJT05fUkVRVUlSRUQpO1xufVxuXG5tb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IGVudW0gR0FNRV9TQ0FMRV9UWVBFIHtcbiAgICAgICAgTk9ORSxcbiAgICAgICAgRklMTCxcbiAgICAgICAgQVNQRUNUX0ZJVCxcbiAgICAgICAgQVNQRUNUX0ZJTExcbiAgICB9XG5cbiAgICBleHBvcnQgZW51bSBBVURJT19UWVBFIHtcbiAgICAgICAgVU5LTk9XTixcbiAgICAgICAgV0VCQVVESU8sXG4gICAgICAgIEhUTUxBVURJT1xuICAgIH1cbn1cbiIsIm1vZHVsZSBQSVhJIHtcbiAgICBleHBvcnQgY2xhc3MgQXVkaW9NYW5hZ2Vye1xuICAgICAgICBnYW1lOkdhbWU7XG5cbiAgICAgICAgY29uc3RydWN0b3IoZ2FtZTogR2FtZSl7XG4gICAgICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB9XG4gICAgfVxufSIsIm1vZHVsZSBQSVhJIHtcbiAgICBleHBvcnQgY2xhc3MgRGF0YU1hbmFnZXJ7XG4gICAgICAgIGdhbWU6R2FtZTtcbiAgICAgICAgdXNlUGVyc2lzdGFudERhdGE6Ym9vbGVhbjtcblxuICAgICAgICBwcml2YXRlIF9kYXRhOmFueTtcblxuICAgICAgICBjb25zdHJ1Y3RvcihnYW1lOkdhbWUsIHVzZVBlcnNpdGFudERhdGE6Ym9vbGVhbiA9IGZhbHNlKXtcbiAgICAgICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgICAgICB0aGlzLnVzZVBlcnNpc3RhbnREYXRhID0gdXNlUGVyc2l0YW50RGF0YTtcbiAgICAgICAgICAgIHRoaXMubG9hZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgbG9hZCgpOkRhdGFNYW5hZ2Vye1xuICAgICAgICAgICAgdGhpcy5fZGF0YSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5nYW1lLmlkKSkgfHwge307XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHNhdmUoKTpEYXRhTWFuYWdlcntcbiAgICAgICAgICAgIGlmKHRoaXMudXNlUGVyc2lzdGFudERhdGEpe1xuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMuZ2FtZS5pZCwgSlNPTi5zdHJpbmdpZnkodGhpcy5fZGF0YSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICByZXNldCgpOkRhdGFNYW5hZ2Vye1xuICAgICAgICAgICAgdGhpcy5fZGF0YSA9IHt9O1xuICAgICAgICAgICAgdGhpcy5zYXZlKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHNldChrZXk6c3RyaW5nIHwgT2JqZWN0LCB2YWx1ZT86YW55KTpEYXRhTWFuYWdlcntcbiAgICAgICAgICAgIGlmKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChrZXkpID09PSBcIltvYmplY3QgT2JqZWN0XVwiKXtcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMuX2RhdGEsIGtleSk7XG4gICAgICAgICAgICB9ZWxzZSBpZih0eXBlb2Yga2V5ID09PSBcInN0cmluZ1wiKXtcbiAgICAgICAgICAgICAgICB0aGlzLl9kYXRhW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5zYXZlKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGdldChrZXk/OnN0cmluZyk6YW55e1xuICAgICAgICAgICAgaWYoIWtleSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9kYXRhW2tleV07XG4gICAgICAgIH1cblxuICAgICAgICBkZWwoa2V5OnN0cmluZyk6RGF0YU1hbmFnZXJ7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fZGF0YVtrZXldO1xuICAgICAgICAgICAgdGhpcy5zYXZlKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgfVxufSIsIi8vTWFueSBjaGVja3MgYXJlIGJhc2VkIG9uIGh0dHBzOi8vZ2l0aHViLmNvbS9hcmFzYXRhc2F5Z2luL2lzLmpzL2Jsb2IvbWFzdGVyL2lzLmpzXG5cbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2RlZnMvcGl4aS5qcy5kLnRzXCIgLz5cbm1vZHVsZSBQSVhJIHtcbiAgICB2YXIgbmF2aWdhdG9yOk5hdmlnYXRvciA9IHdpbmRvdy5uYXZpZ2F0b3I7XG4gICAgdmFyIGRvY3VtZW50OkRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xuXG4gICAgdmFyIHVzZXJBZ2VudDpzdHJpbmcgPSAnbmF2aWdhdG9yJyBpbiB3aW5kb3cgJiYgJ3VzZXJBZ2VudCcgaW4gbmF2aWdhdG9yICYmIG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKSB8fCAnJyxcbiAgICAgICAgdmVuZG9yOnN0cmluZyA9ICduYXZpZ2F0b3InIGluIHdpbmRvdyAmJiAndmVuZG9yJyBpbiBuYXZpZ2F0b3IgJiYgbmF2aWdhdG9yLnZlbmRvci50b0xvd2VyQ2FzZSgpIHx8ICcnLFxuICAgICAgICBhcHBWZXJzaW9uOnN0cmluZyA9ICduYXZpZ2F0b3InIGluIHdpbmRvdyAmJiAnYXBwVmVyc2lvbicgaW4gbmF2aWdhdG9yICYmIG5hdmlnYXRvci5hcHBWZXJzaW9uLnRvTG93ZXJDYXNlKCkgfHwgJyc7XG5cbiAgICAvL0Jyb3dzZXJzXG4gICAgdmFyIGlzQ2hyb21lOmJvb2xlYW4gPSAvY2hyb21lfGNocm9taXVtL2kudGVzdCh1c2VyQWdlbnQpICYmIC9nb29nbGUgaW5jLy50ZXN0KHZlbmRvciksXG4gICAgICAgIGlzRmlyZWZveDpib29sZWFuID0gL2ZpcmVmb3gvaS50ZXN0KHVzZXJBZ2VudCksXG4gICAgICAgIGlzSUU6Ym9vbGVhbiA9IC9tc2llL2kudGVzdCh1c2VyQWdlbnQpIHx8IFwiQWN0aXZlWE9iamVjdFwiIGluIHdpbmRvdyxcbiAgICAgICAgaXNPcGVyYTpib29sZWFuID0gL15PcGVyYVxcLy8udGVzdCh1c2VyQWdlbnQpIHx8IC9cXHgyME9QUlxcLy8udGVzdCh1c2VyQWdlbnQpLFxuICAgICAgICBpc1NhZmFyaTpib29sZWFuID0gL3NhZmFyaS9pLnRlc3QodXNlckFnZW50KSAmJiAvYXBwbGUgY29tcHV0ZXIvaS50ZXN0KHZlbmRvcik7XG5cbiAgICAvL0RldmljZXMgJiYgT1NcbiAgICB2YXIgaXNJcGhvbmU6Ym9vbGVhbiA9IC9pcGhvbmUvaS50ZXN0KHVzZXJBZ2VudCksXG4gICAgICAgIGlzSXBhZDpib29sZWFuID0gL2lwYWQvaS50ZXN0KHVzZXJBZ2VudCksXG4gICAgICAgIGlzSXBvZDpib29sZWFuID0gL2lwb2QvaS50ZXN0KHVzZXJBZ2VudCksXG4gICAgICAgIGlzQW5kcm9pZDpib29sZWFuID0gL2FuZHJvaWQvaS50ZXN0KHVzZXJBZ2VudCksXG4gICAgICAgIGlzQW5kcm9pZFBob25lOmJvb2xlYW4gPSAvYW5kcm9pZC9pLnRlc3QodXNlckFnZW50KSAmJiAvbW9iaWxlL2kudGVzdCh1c2VyQWdlbnQpLFxuICAgICAgICBpc0FuZHJvaWRUYWJsZXQ6Ym9vbGVhbiA9IC9hbmRyb2lkL2kudGVzdCh1c2VyQWdlbnQpICYmICEvbW9iaWxlL2kudGVzdCh1c2VyQWdlbnQpLFxuICAgICAgICBpc0xpbnV4OmJvb2xlYW4gPSAvbGludXgvaS50ZXN0KGFwcFZlcnNpb24pLFxuICAgICAgICBpc01hYzpib29sZWFuID0gL21hYy9pLnRlc3QoYXBwVmVyc2lvbiksXG4gICAgICAgIGlzV2luZG93OmJvb2xlYW4gPSAvd2luL2kudGVzdChhcHBWZXJzaW9uKSxcbiAgICAgICAgaXNXaW5kb3dQaG9uZTpib29sZWFuID0gaXNXaW5kb3cgJiYgL3Bob25lL2kudGVzdCh1c2VyQWdlbnQpLFxuICAgICAgICBpc1dpbmRvd1RhYmxldDpib29sZWFuID0gaXNXaW5kb3cgJiYgIWlzV2luZG93UGhvbmUgJiYgL3RvdWNoL2kudGVzdCh1c2VyQWdlbnQpLFxuICAgICAgICBpc01vYmlsZTpib29sZWFuID0gaXNJcGhvbmUgfHwgaXNJcG9kfHwgaXNBbmRyb2lkUGhvbmUgfHwgaXNXaW5kb3dQaG9uZSxcbiAgICAgICAgaXNUYWJsZXQ6Ym9vbGVhbiA9IGlzSXBhZCB8fCBpc0FuZHJvaWRUYWJsZXQgfHwgaXNXaW5kb3dUYWJsZXQsXG4gICAgICAgIGlzRGVza3RvcDpib29sZWFuID0gIWlzTW9iaWxlICYmICFpc1RhYmxldCxcbiAgICAgICAgaXNUb3VjaERldmljZTpib29sZWFuID0gJ29udG91Y2hzdGFydCcgaW4gd2luZG93IHx8J0RvY3VtZW50VG91Y2gnIGluIHdpbmRvdyAmJiBkb2N1bWVudCBpbnN0YW5jZW9mIERvY3VtZW50VG91Y2gsXG4gICAgICAgIGlzQ29jb29uOmJvb2xlYW4gPSAhIW5hdmlnYXRvci5pc0NvY29vbkpTLFxuICAgICAgICBpc05vZGVXZWJraXQ6Ym9vbGVhbiA9ICEhKHR5cGVvZiBwcm9jZXNzID09PSBcIm9iamVjdFwiICYmIHByb2Nlc3MudGl0bGUgPT09IFwibm9kZVwiICYmIHR5cGVvZiBnbG9iYWwgPT09IFwib2JqZWN0XCIpLFxuICAgICAgICBpc0VqZWN0YTpib29sZWFuID0gISF3aW5kb3cuZWplY3RhLFxuICAgICAgICBpc0Nyb3Nzd2Fsazpib29sZWFuID0gL0Nyb3Nzd2Fsay8udGVzdCh1c2VyQWdlbnQpLFxuICAgICAgICBpc0NvcmRvdmE6Ym9vbGVhbiA9ICEhd2luZG93LmNvcmRvdmEsXG4gICAgICAgIGlzRWxlY3Ryb246Ym9vbGVhbiA9ICEhKHR5cGVvZiBwcm9jZXNzID09PSBcIm9iamVjdFwiICYmIHByb2Nlc3MudmVyc2lvbnMgJiYgKHByb2Nlc3MudmVyc2lvbnMuZWxlY3Ryb24gfHwgcHJvY2Vzcy52ZXJzaW9uc1snYXRvbS1zaGVsbCddKSk7XG5cbiAgICB2YXIgaGFzVmlicmF0ZTpib29sZWFuID0gISFuYXZpZ2F0b3IudmlicmF0ZSAmJiAoaXNNb2JpbGUgfHwgaXNUYWJsZXQpLFxuICAgICAgICBoYXNNb3VzZVdoZWVsOmJvb2xlYW4gPSAnb253aGVlbCcgaW4gd2luZG93IHx8ICdvbm1vdXNld2hlZWwnIGluIHdpbmRvdyB8fCAnTW91c2VTY3JvbGxFdmVudCcgaW4gd2luZG93LFxuICAgICAgICBoYXNBY2NlbGVyb21ldGVyOmJvb2xlYW4gPSAnRGV2aWNlTW90aW9uRXZlbnQnIGluIHdpbmRvdyxcbiAgICAgICAgaGFzR2FtZXBhZDpib29sZWFuID0gISFuYXZpZ2F0b3IuZ2V0R2FtZXBhZHMgfHwgISFuYXZpZ2F0b3Iud2Via2l0R2V0R2FtZXBhZHM7XG5cbiAgICAvL0Z1bGxTY3JlZW5cbiAgICB2YXIgZGl2OkhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdmFyIGZ1bGxTY3JlZW5SZXF1ZXN0OmFueSA9IGRpdi5yZXF1ZXN0RnVsbHNjcmVlbiB8fCBkaXYud2Via2l0UmVxdWVzdEZ1bGxTY3JlZW4gfHwgZGl2Lm1zUmVxdWVzdEZ1bGxTY3JlZW4gfHwgZGl2Lm1velJlcXVlc3RGdWxsU2NyZWVuLFxuICAgICAgICBmdWxsU2NyZWVuQ2FuY2VsOmFueSA9IGRvY3VtZW50LmNhbmNlbEZ1bGxTY3JlZW4gfHwgZG9jdW1lbnQuZXhpdEZ1bGxTY3JlZW4gfHwgZG9jdW1lbnQud2Via2l0Q2FuY2VsRnVsbFNjcmVlbiB8fCBkb2N1bWVudC5tc0NhbmNlbEZ1bGxTY3JlZW4gfHwgZG9jdW1lbnQubW96Q2FuY2VsRnVsbFNjcmVlbixcbiAgICAgICAgaGFzRnVsbFNjcmVlbjpib29sZWFuID0gISEoZnVsbFNjcmVlblJlcXVlc3QgJiYgZnVsbFNjcmVlbkNhbmNlbCk7XG5cbiAgICAvL0F1ZGlvXG4gICAgdmFyIGhhc0hUTUxBdWRpbzpib29sZWFuID0gISF3aW5kb3cuQXVkaW8sXG4gICAgICAgIHdlYkF1ZGlvQ29udGV4dDphbnkgPSB3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQsXG4gICAgICAgIGhhc1dlYkF1ZGlvOmJvb2xlYW4gPSAhIXdlYkF1ZGlvQ29udGV4dCxcbiAgICAgICAgaGFzQXVkaW86Ym9vbGVhbiA9IGhhc1dlYkF1ZGlvIHx8IGhhc0hUTUxBdWRpbyxcbiAgICAgICAgaGFzTXAzOmJvb2xlYW4gPSBmYWxzZSxcbiAgICAgICAgaGFzT2dnOmJvb2xlYW4gPSBmYWxzZSxcbiAgICAgICAgaGFzV2F2OmJvb2xlYW4gPSBmYWxzZSxcbiAgICAgICAgaGFzTTRhOmJvb2xlYW4gPSBmYWxzZTtcblxuICAgIC8vQXVkaW8gbWltZVR5cGVzXG4gICAgaWYoaGFzQXVkaW8pe1xuICAgICAgICB2YXIgYXVkaW86SFRNTEF1ZGlvRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2F1ZGlvJyk7XG4gICAgICAgIGhhc01wMyA9IGF1ZGlvLmNhblBsYXlUeXBlKCdhdWRpby9tcGVnOycpICE9PSBcIlwiO1xuICAgICAgICBoYXNPZ2cgPSBhdWRpby5jYW5QbGF5VHlwZSgnYXVkaW8vb2dnOyBjb2RlY3M9XCJ2b3JiaXNcIicpICE9PSBcIlwiO1xuICAgICAgICBoYXNXYXYgPSBhdWRpby5jYW5QbGF5VHlwZSgnYXVkaW8vd2F2JykgIT09IFwiXCI7XG4gICAgICAgIGhhc000YSA9IGF1ZGlvLmNhblBsYXlUeXBlKCdhdWRpby9tcDQ7IGNvZGVjcz1cIm1wNGEuNDAuNVwiJykgIT09IFwiXCI7XG4gICAgfVxuXG4gICAgZXhwb3J0IHZhciBEZXZpY2UgOiBEZXZpY2VEYXRhID0ge1xuICAgICAgICBpc0Nocm9tZSA6IGlzQ2hyb21lLFxuICAgICAgICBpc0ZpcmVmb3ggOiBpc0ZpcmVmb3gsXG4gICAgICAgIGlzSUUgOiBpc0lFLFxuICAgICAgICBpc09wZXJhIDogaXNPcGVyYSxcbiAgICAgICAgaXNTYWZhcmkgOiBpc1NhZmFyaSxcbiAgICAgICAgaXNJcGhvbmUgOiBpc0lwaG9uZSxcbiAgICAgICAgaXNJcGFkIDogaXNJcGFkLFxuICAgICAgICBpc0lwb2QgOiBpc0lwb2QsXG4gICAgICAgIGlzQW5kcm9pZCA6IGlzQW5kcm9pZCxcbiAgICAgICAgaXNBbmRyb2lkUGhvbmUgOiBpc0FuZHJvaWRQaG9uZSxcbiAgICAgICAgaXNBbmRyb2lkVGFibGV0IDogaXNBbmRyb2lkVGFibGV0LFxuICAgICAgICBpc0xpbnV4IDogaXNMaW51eCxcbiAgICAgICAgaXNNYWMgOiBpc01hYyxcbiAgICAgICAgaXNXaW5kb3cgOiBpc1dpbmRvdyxcbiAgICAgICAgaXNXaW5kb3dQaG9uZSA6IGlzV2luZG93UGhvbmUsXG4gICAgICAgIGlzV2luZG93VGFibGV0IDogaXNXaW5kb3dUYWJsZXQsXG4gICAgICAgIGlzTW9iaWxlIDogaXNNb2JpbGUsXG4gICAgICAgIGlzVGFibGV0IDogaXNUYWJsZXQsXG4gICAgICAgIGlzRGVza3RvcCA6IGlzRGVza3RvcCxcbiAgICAgICAgaXNUb3VjaERldmljZSA6IGlzVG91Y2hEZXZpY2UsXG4gICAgICAgIGlzQ29jb29uIDogaXNDb2Nvb24sXG4gICAgICAgIGlzTm9kZVdlYmtpdCA6IGlzTm9kZVdlYmtpdCxcbiAgICAgICAgaXNFamVjdGEgOiBpc0VqZWN0YSxcbiAgICAgICAgaXNDb3Jkb3ZhIDogaXNDb3Jkb3ZhLFxuICAgICAgICBpc0Nyb3Nzd2FsayA6IGlzQ3Jvc3N3YWxrLFxuICAgICAgICBpc0VsZWN0cm9uIDogaXNFbGVjdHJvbixcbiAgICAgICAgaXNBdG9tU2hlbGwgOiBpc0VsZWN0cm9uLCAvL1RPRE86IFJlbW92ZSBzb29uLCB3aGVuIGF0b20tc2hlbGwgKHZlcnNpb24pIGlzIGRlcHJlY2F0ZWRcblxuICAgICAgICAvL2lzT25saW5lIDogbmF2aWdhdG9yLm9uTGluZSxcbiAgICAgICAgaGFzVmlicmF0ZSA6IGhhc1ZpYnJhdGUsXG4gICAgICAgIGhhc01vdXNlV2hlZWwgOiBoYXNNb3VzZVdoZWVsLFxuICAgICAgICBoYXNGdWxsU2NyZWVuIDogaGFzRnVsbFNjcmVlbixcbiAgICAgICAgaGFzQWNjZWxlcm9tZXRlciA6IGhhc0FjY2VsZXJvbWV0ZXIsXG4gICAgICAgIGhhc0dhbWVwYWQgOiBoYXNHYW1lcGFkLFxuXG4gICAgICAgIGZ1bGxTY3JlZW5SZXF1ZXN0IDogZnVsbFNjcmVlblJlcXVlc3QgPyBmdWxsU2NyZWVuUmVxdWVzdC5uYW1lIDogdW5kZWZpbmVkLFxuICAgICAgICBmdWxsU2NyZWVuQ2FuY2VsIDogZnVsbFNjcmVlbkNhbmNlbCA/IGZ1bGxTY3JlZW5DYW5jZWwubmFtZSA6IHVuZGVmaW5lZCxcblxuICAgICAgICBoYXNBdWRpbyA6IGhhc0F1ZGlvLFxuICAgICAgICBoYXNIVE1MQXVkaW8gOiBoYXNIVE1MQXVkaW8sXG4gICAgICAgIGhhc1dlYkF1ZGlvOiBoYXNXZWJBdWRpbyxcbiAgICAgICAgd2ViQXVkaW9Db250ZXh0IDogd2ViQXVkaW9Db250ZXh0LFxuXG4gICAgICAgIGhhc01wMyA6IGhhc01wMyxcbiAgICAgICAgaGFzTTRhIDogaGFzTTRhLFxuICAgICAgICBoYXNPZ2cgOiBoYXNPZ2csXG4gICAgICAgIGhhc1dhdiA6IGhhc1dhdixcblxuICAgICAgICBnZXRNb3VzZVdoZWVsRXZlbnQgOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmKCFoYXNNb3VzZVdoZWVsKXJldHVybjtcbiAgICAgICAgICAgIHZhciBldnQ6c3RyaW5nO1xuICAgICAgICAgICAgaWYoJ29ud2hlZWwnIGluIHdpbmRvdyl7XG4gICAgICAgICAgICAgICAgZXZ0ID0gJ3doZWVsJztcbiAgICAgICAgICAgIH1lbHNlIGlmKCdvbm1vdXNld2hlZWwnIGluIHdpbmRvdyl7XG4gICAgICAgICAgICAgICAgZXZ0ID0gJ21vdXNld2hlZWwnO1xuICAgICAgICAgICAgfWVsc2UgaWYoJ01vdXNlU2Nyb2xsRXZlbnQnIGluIHdpbmRvdyl7XG4gICAgICAgICAgICAgICAgZXZ0ID0gJ0RPTU1vdXNlU2Nyb2xsJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGV2dDtcbiAgICAgICAgfSxcblxuICAgICAgICB2aWJyYXRlIDogZnVuY3Rpb24ocGF0dGVybjogbnVtYmVyIHwgbnVtYmVyW10pe1xuICAgICAgICAgICAgaWYoaGFzVmlicmF0ZSl7XG4gICAgICAgICAgICAgICAgbmF2aWdhdG9yLnZpYnJhdGUocGF0dGVybik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0VmlzaWJpbGl0eUNoYW5nZUV2ZW50OiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgaWYodHlwZW9mIGRvY3VtZW50LmhpZGRlbiAhPT0gJ3VuZGVmaW5lZCcpe1xuICAgICAgICAgICAgICAgIHJldHVybiAndmlzaWJpbGl0eWNoYW5nZSc7XG4gICAgICAgICAgICB9ZWxzZSBpZih0eXBlb2YgZG9jdW1lbnQud2Via2l0SGlkZGVuICE9PSAndW5kZWZpbmVkJyl7XG4gICAgICAgICAgICAgICAgcmV0dXJuICd3ZWJraXR2aXNpYmlsaXR5Y2hhbmdlJztcbiAgICAgICAgICAgIH1lbHNlIGlmKHR5cGVvZiBkb2N1bWVudC5tb3pIaWRkZW4gIT09ICd1bmRlZmluZWQnKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ21venZpc2liaWxpdHljaGFuZ2UnO1xuICAgICAgICAgICAgfWVsc2UgaWYodHlwZW9mIGRvY3VtZW50Lm1zSGlkZGVuICE9PSAndW5kZWZpbmVkJyl7XG4gICAgICAgICAgICAgICAgcmV0dXJuICdtc3Zpc2liaWxpdHljaGFuZ2UnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGdldCBpc09ubGluZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB3aW5kb3cubmF2aWdhdG9yLm9uTGluZTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIERldmljZURhdGEge1xuICAgICAgICBpc0Nocm9tZSA6IGJvb2xlYW47XG4gICAgICAgIGlzRmlyZWZveCA6IGJvb2xlYW47XG4gICAgICAgIGlzSUUgOiBib29sZWFuO1xuICAgICAgICBpc09wZXJhIDogYm9vbGVhbjtcbiAgICAgICAgaXNTYWZhcmkgOiBib29sZWFuO1xuICAgICAgICBpc0lwaG9uZSA6IGJvb2xlYW47XG4gICAgICAgIGlzSXBhZCA6IGJvb2xlYW47XG4gICAgICAgIGlzSXBvZCA6IGJvb2xlYW47XG4gICAgICAgIGlzQW5kcm9pZCA6IGJvb2xlYW47XG4gICAgICAgIGlzQW5kcm9pZFBob25lIDogYm9vbGVhbjtcbiAgICAgICAgaXNBbmRyb2lkVGFibGV0IDogYm9vbGVhbjtcbiAgICAgICAgaXNMaW51eCA6IGJvb2xlYW47XG4gICAgICAgIGlzTWFjIDogYm9vbGVhbjtcbiAgICAgICAgaXNXaW5kb3cgOiBib29sZWFuO1xuICAgICAgICBpc1dpbmRvd1Bob25lIDogYm9vbGVhbjtcbiAgICAgICAgaXNXaW5kb3dUYWJsZXQgOiBib29sZWFuO1xuICAgICAgICBpc01vYmlsZSA6IGJvb2xlYW47XG4gICAgICAgIGlzVGFibGV0IDogYm9vbGVhbjtcbiAgICAgICAgaXNEZXNrdG9wIDogYm9vbGVhbjtcbiAgICAgICAgaXNUb3VjaERldmljZSA6IGJvb2xlYW47XG4gICAgICAgIGlzQ29jb29uIDogYm9vbGVhbjtcbiAgICAgICAgaXNOb2RlV2Via2l0IDogYm9vbGVhbjtcbiAgICAgICAgaXNFamVjdGEgOiBib29sZWFuO1xuICAgICAgICBpc0NvcmRvdmEgOiBib29sZWFuO1xuICAgICAgICBpc0Nyb3Nzd2FsayA6IGJvb2xlYW47XG4gICAgICAgIGlzRWxlY3Ryb24gOiBib29sZWFuO1xuICAgICAgICBpc0F0b21TaGVsbCA6IGJvb2xlYW47XG5cbiAgICAgICAgaGFzVmlicmF0ZSA6IGJvb2xlYW47XG4gICAgICAgIGhhc01vdXNlV2hlZWwgOiBib29sZWFuO1xuICAgICAgICBoYXNGdWxsU2NyZWVuIDogYm9vbGVhbjtcbiAgICAgICAgaGFzQWNjZWxlcm9tZXRlciA6IGJvb2xlYW47XG4gICAgICAgIGhhc0dhbWVwYWQgOiBib29sZWFuO1xuXG4gICAgICAgIGZ1bGxTY3JlZW5SZXF1ZXN0OmZ1bGxTY3JlZW5EYXRhO1xuICAgICAgICBmdWxsU2NyZWVuQ2FuY2VsOmZ1bGxTY3JlZW5EYXRhO1xuXG4gICAgICAgIGhhc0F1ZGlvIDogYm9vbGVhbjtcbiAgICAgICAgaGFzSFRNTEF1ZGlvIDogYm9vbGVhbjtcbiAgICAgICAgaGFzV2ViQXVkaW8gOiBib29sZWFuO1xuICAgICAgICB3ZWJBdWRpb0NvbnRleHQ6YW55O1xuXG4gICAgICAgIGhhc01wMyA6IGJvb2xlYW47XG4gICAgICAgIGhhc000YSA6IGJvb2xlYW47XG4gICAgICAgIGhhc09nZyA6IGJvb2xlYW47XG4gICAgICAgIGhhc1dhdiA6IGJvb2xlYW47XG5cbiAgICAgICAgaXNPbmxpbmU6Ym9vbGVhbjtcblxuICAgICAgICBnZXRNb3VzZVdoZWVsRXZlbnQoKTpzdHJpbmc7XG5cbiAgICAgICAgdmlicmF0ZSh2YWx1ZTpudW1iZXIpOnZvaWQ7XG5cbiAgICAgICAgZ2V0VmlzaWJpbGl0eUNoYW5nZUV2ZW50KCk6c3RyaW5nO1xuICAgIH1cbn1cblxuZGVjbGFyZSB2YXIgcHJvY2VzczphbnksXG4gICAgRG9jdW1lbnRUb3VjaDphbnksXG4gICAgZ2xvYmFsOmFueTtcblxuaW50ZXJmYWNlIE5hdmlnYXRvciB7XG4gICAgaXNDb2Nvb25KUzphbnk7XG4gICAgdmlicmF0ZShwYXR0ZXJuOiBudW1iZXIgfCBudW1iZXJbXSk6Ym9vbGVhbjtcbiAgICBnZXRHYW1lcGFkcygpOmFueTtcbiAgICB3ZWJraXRHZXRHYW1lcGFkcygpOmFueTtcbn1cblxuaW50ZXJmYWNlIFdpbmRvdyB7XG4gICAgZWplY3RhOmFueTtcbiAgICBjb3Jkb3ZhOmFueTtcbiAgICBBdWRpbygpOkhUTUxBdWRpb0VsZW1lbnQ7XG4gICAgQXVkaW9Db250ZXh0KCk6YW55O1xuICAgIHdlYmtpdEF1ZGlvQ29udGV4dCgpOmFueTtcbn1cblxuaW50ZXJmYWNlIGZ1bGxTY3JlZW5EYXRhIHtcbiAgICBuYW1lOnN0cmluZztcbn1cblxuaW50ZXJmYWNlIERvY3VtZW50IHtcbiAgICBjYW5jZWxGdWxsU2NyZWVuKCk6ZnVsbFNjcmVlbkRhdGEgO1xuICAgIGV4aXRGdWxsU2NyZWVuKCk6ZnVsbFNjcmVlbkRhdGEgO1xuICAgIHdlYmtpdENhbmNlbEZ1bGxTY3JlZW4oKTpmdWxsU2NyZWVuRGF0YSA7XG4gICAgbXNDYW5jZWxGdWxsU2NyZWVuKCk6ZnVsbFNjcmVlbkRhdGEgO1xuICAgIG1vekNhbmNlbEZ1bGxTY3JlZW4oKTpmdWxsU2NyZWVuRGF0YSA7XG4gICAgd2Via2l0SGlkZGVuOmFueTtcbiAgICBtb3pIaWRkZW46YW55O1xufVxuXG5pbnRlcmZhY2UgSFRNTERpdkVsZW1lbnQge1xuICAgIHJlcXVlc3RGdWxsc2NyZWVuKCk6ZnVsbFNjcmVlbkRhdGEgO1xuICAgIHdlYmtpdFJlcXVlc3RGdWxsU2NyZWVuKCk6ZnVsbFNjcmVlbkRhdGEgO1xuICAgIG1zUmVxdWVzdEZ1bGxTY3JlZW4oKTpmdWxsU2NyZWVuRGF0YSA7XG4gICAgbW96UmVxdWVzdEZ1bGxTY3JlZW4oKTpmdWxsU2NyZWVuRGF0YSA7XG59IiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vZGVmcy9waXhpLmpzLmQudHNcIiAvPlxubW9kdWxlIFBJWEkge1xuICAgIGV4cG9ydCBjbGFzcyBTY2VuZSBleHRlbmRzIENvbnRhaW5lciB7XG4gICAgICAgIGlkOnN0cmluZztcbiAgICAgICAgc3RhdGljIF9pZExlbjpudW1iZXIgPSAwO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGlkOnN0cmluZyA9IChcInNjZW5lXCIgKyBTY2VuZS5faWRMZW4rKykgKXtcbiAgICAgICAgICAgIHN1cGVyKCk7XG4gICAgICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIH1cblxuICAgICAgICBhZGRUbyhnYW1lOkdhbWV8Q29udGFpbmVyKTpTY2VuZSB7XG4gICAgICAgICAgICBpZihnYW1lIGluc3RhbmNlb2YgR2FtZSl7XG4gICAgICAgICAgICAgICAgPEdhbWU+Z2FtZS5hZGRTY2VuZSh0aGlzKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignU2NlbmVzIGNhbiBvbmx5IGJlIGFkZGVkIHRvIHRoZSBnYW1lJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgIH1cbn0iLCJtb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IGNsYXNzIElucHV0TWFuYWdlcntcbiAgICAgICAgZ2FtZTpHYW1lO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGdhbWU6IEdhbWUpe1xuICAgICAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9kZWZzL3BpeGkuanMuZC50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuL0RldmljZS50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9kaXNwbGF5L1NjZW5lLnRzXCIgLz5cbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL2F1ZGlvL0F1ZGlvTWFuYWdlci50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9pbnB1dC9JbnB1dE1hbmFnZXIudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi9EYXRhTWFuYWdlci50c1wiIC8+XG5tb2R1bGUgUElYSSB7XG4gICAgdmFyIGxhc3Q6bnVtYmVyID0gMDtcbiAgICB2YXIgbWF4RnJhbWVNUyA9IDAuMzU7XG5cbiAgICB2YXIgZGVmYXVsdEdhbWVDb25maWcgOiBHYW1lQ29uZmlnID0ge1xuICAgICAgICBpZDogXCJwaXhpLmRlZmF1bHQuaWRcIixcbiAgICAgICAgd2lkdGg6ODAwLFxuICAgICAgICBoZWlnaHQ6NjAwLFxuICAgICAgICB1c2VXZWJBdWRpbzogdHJ1ZSxcbiAgICAgICAgdXNlUGVyc2lzdGFudERhdGE6IGZhbHNlLFxuICAgICAgICBnYW1lU2NhbGVUeXBlOiBHQU1FX1NDQUxFX1RZUEUuTk9ORSxcbiAgICAgICAgc3RvcEF0TG9zdEZvY3VzOiB0cnVlXG4gICAgfTtcblxuICAgIGV4cG9ydCBjbGFzcyBHYW1lIHtcbiAgICAgICAgaWQ6c3RyaW5nO1xuICAgICAgICByYWY6YW55O1xuXG4gICAgICAgIHByaXZhdGUgX3NjZW5lczpTY2VuZVtdID0gW107XG4gICAgICAgIHNjZW5lOlNjZW5lO1xuXG4gICAgICAgIGF1ZGlvOkF1ZGlvTWFuYWdlcjtcbiAgICAgICAgaW5wdXQ6SW5wdXRNYW5hZ2VyO1xuICAgICAgICBkYXRhOkRhdGFNYW5hZ2VyO1xuXG4gICAgICAgIHJlbmRlcmVyOldlYkdMUmVuZGVyZXIgfCBDYW52YXNSZW5kZXJlcjtcbiAgICAgICAgY2FudmFzOkhUTUxDYW52YXNFbGVtZW50O1xuXG4gICAgICAgIGRlbHRhOm51bWJlciA9IDA7XG4gICAgICAgIHRpbWU6bnVtYmVyID0gMDtcbiAgICAgICAgbGFzdFRpbWU6bnVtYmVyID0gMDtcblxuICAgICAgICBpc1dlYkdMOmJvb2xlYW47XG4gICAgICAgIGlzV2ViQXVkaW86Ym9vbGVhbjtcblxuICAgICAgICBwcml2YXRlIF9yZXNpemVMaXN0ZW5lcjphbnk7XG5cbiAgICAgICAgY29uc3RydWN0b3IoY29uZmlnPzpHYW1lQ29uZmlnLCByZW5kZXJlck9wdGlvbnM/OlJlbmRlcmVyT3B0aW9ucykge1xuICAgICAgICAgICAgY29uZmlnID0gKDxPYmplY3Q+T2JqZWN0KS5hc3NpZ24oZGVmYXVsdEdhbWVDb25maWcsIGNvbmZpZyk7XG4gICAgICAgICAgICB0aGlzLmlkID0gY29uZmlnLmlkO1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJlciA9IGF1dG9EZXRlY3RSZW5kZXJlcihjb25maWcud2lkdGgsIGNvbmZpZy5oZWlnaHQsIHJlbmRlcmVyT3B0aW9ucyk7XG4gICAgICAgICAgICB0aGlzLmNhbnZhcyA9IHRoaXMucmVuZGVyZXIudmlldztcblxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XG5cbiAgICAgICAgICAgIHRoaXMuaXNXZWJHTCA9ICh0aGlzLnJlbmRlcmVyLnR5cGUgPT09IFJFTkRFUkVSX1RZUEUuV0VCR0wpO1xuICAgICAgICAgICAgdGhpcy5pc1dlYkF1ZGlvID0gKERldmljZS5oYXNXZWJBdWRpbyYmY29uZmlnLnVzZVdlYkF1ZGlvKTtcblxuICAgICAgICAgICAgdGhpcy5pbnB1dCA9IG5ldyBJbnB1dE1hbmFnZXIodGhpcyk7XG4gICAgICAgICAgICB0aGlzLmF1ZGlvID0gbmV3IEF1ZGlvTWFuYWdlcih0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IG5ldyBEYXRhTWFuYWdlcih0aGlzLCBjb25maWcudXNlUGVyc2lzdGFudERhdGEpO1xuXG4gICAgICAgICAgICB2YXIgaW5pdGlhbFNjZW5lOlNjZW5lID0gbmV3IFNjZW5lKCdpbml0aWFsJykuYWRkVG8odGhpcyk7XG4gICAgICAgICAgICB0aGlzLnNldFNjZW5lKGluaXRpYWxTY2VuZSk7XG5cbiAgICAgICAgICAgIGlmKGNvbmZpZy5nYW1lU2NhbGVUeXBlICE9PSBHQU1FX1NDQUxFX1RZUEUuTk9ORSl7XG4gICAgICAgICAgICAgICAgdGhpcy5hdXRvUmVzaXplKGNvbmZpZy5nYW1lU2NhbGVUeXBlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoY29uZmlnLnN0b3BBdExvc3RGb2N1cyl7XG4gICAgICAgICAgICAgICAgdGhpcy5lbmFibGVTdG9wQXRMb3N0Rm9jdXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX2FuaW1hdGUoKTp2b2lkIHtcbiAgICAgICAgICAgIHRoaXMucmFmID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLl9hbmltYXRlLmJpbmQodGhpcykpO1xuXG4gICAgICAgICAgICBpZih0aGlzLnNjZW5lKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5vdzpudW1iZXIgPSBEYXRlLm5vdygpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy50aW1lICs9IE1hdGgubWluKChub3cgLSBsYXN0KSAvIDEwMDAsIG1heEZyYW1lTVMpO1xuICAgICAgICAgICAgICAgIHRoaXMuZGVsdGEgPSB0aGlzLnRpbWUgLSB0aGlzLmxhc3RUaW1lO1xuICAgICAgICAgICAgICAgIHRoaXMubGFzdFRpbWUgPSB0aGlzLnRpbWU7XG5cbiAgICAgICAgICAgICAgICBsYXN0ID0gbm93O1xuXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5yZW5kZXIodGhpcy5zY2VuZSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSh0aGlzLmRlbHRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZShkZWx0YVRpbWU6bnVtYmVyKTpHYW1lIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zY2VuZS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMuc2NlbmUuY2hpbGRyZW5baV0udXBkYXRlKHRoaXMuZGVsdGEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL2NsZWFuIGtpbGxlZCBvYmplY3RzXG4gICAgICAgICAgICB2YXIgbGVuOm51bWJlciA9IENvbnRhaW5lci5fa2lsbGVkT2JqZWN0cy5sZW5ndGg7XG4gICAgICAgICAgICBpZiAobGVuKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaTpudW1iZXIgPSAwOyBpIDwgbGVuOyBpKyspIENvbnRhaW5lci5fa2lsbGVkT2JqZWN0c1tpXS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICBDb250YWluZXIuX2tpbGxlZE9iamVjdHMubGVuZ3RoID0gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBzdGFydCgpOkdhbWUge1xuICAgICAgICAgICAgbGFzdCA9IERhdGUubm93KCk7XG4gICAgICAgICAgICB0aGlzLl9hbmltYXRlKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHN0b3AoKTpHYW1lIHtcbiAgICAgICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLnJhZik7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGVuYWJsZVN0b3BBdExvc3RGb2N1cyhzdGF0ZTpib29sZWFuID0gdHJ1ZSk6R2FtZXtcbiAgICAgICAgICAgIGlmKHN0YXRlKXtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKERldmljZS5nZXRWaXNpYmlsaXR5Q2hhbmdlRXZlbnQoKSwgdGhpcy5fb25WaXNpYmlsaXR5Q2hhbmdlLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihEZXZpY2UuZ2V0VmlzaWJpbGl0eUNoYW5nZUV2ZW50KCksIHRoaXMuX29uVmlzaWJpbGl0eUNoYW5nZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGRpc2FibGVTdG9wQXRMb3N0Rm9jdXMoKTpHYW1le1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZW5hYmxlU3RvcEF0TG9zdEZvY3VzKGZhbHNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX29uVmlzaWJpbGl0eUNoYW5nZSgpe1xuICAgICAgICAgICAgdmFyIGlzSGlkZSA9ICEhKGRvY3VtZW50LmhpZGRlbiB8fCBkb2N1bWVudC53ZWJraXRIaWRkZW4gfHwgZG9jdW1lbnQubW96SGlkZGVuIHx8IGRvY3VtZW50Lm1zSGlkZGVuKTtcbiAgICAgICAgICAgIGlmKGlzSGlkZSl7XG4gICAgICAgICAgICAgICAgdGhpcy5zdG9wKCk7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMub25Mb3N0Rm9jdXMoaXNIaWRlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9uTG9zdEZvY3VzKGlzSGlkZTpib29sZWFuKTpHYW1le1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBzZXRTY2VuZShzY2VuZTpTY2VuZSB8IHN0cmluZyk6R2FtZSB7XG4gICAgICAgICAgICBpZighKHNjZW5lIGluc3RhbmNlb2YgU2NlbmUpKXtcbiAgICAgICAgICAgICAgICBzY2VuZSA9IHRoaXMuZ2V0U2NlbmUoPHN0cmluZz5zY2VuZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuc2NlbmUgPSA8U2NlbmU+c2NlbmU7XG4gICAgICAgICAgICB0aGlzLnNjZW5lLnBvc2l0aW9uLnNldCh0aGlzLndpZHRoLzIsIHRoaXMuaGVpZ2h0LzIpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBnZXRTY2VuZShpZDpzdHJpbmcpOlNjZW5le1xuICAgICAgICAgICAgdmFyIHNjZW5lOlNjZW5lID0gbnVsbDtcbiAgICAgICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgdGhpcy5fc2NlbmVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICBpZih0aGlzLl9zY2VuZXNbaV0uaWQgPT09IGlkKXtcbiAgICAgICAgICAgICAgICAgICAgc2NlbmUgPSB0aGlzLl9zY2VuZXNbaV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gc2NlbmU7XG4gICAgICAgIH1cblxuICAgICAgICBjcmVhdGVTY2VuZShpZD86c3RyaW5nKTpTY2VuZSB7XG4gICAgICAgICAgICByZXR1cm4gKG5ldyBTY2VuZShpZCkpLmFkZFRvKHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVtb3ZlU2NlbmUoc2NlbmU6c3RyaW5nIHwgU2NlbmUpOkdhbWV7XG4gICAgICAgICAgICBpZih0eXBlb2Ygc2NlbmUgPT09IFwic3RyaW5nXCIpe1xuICAgICAgICAgICAgICAgIHNjZW5lID0gdGhpcy5nZXRTY2VuZSg8c3RyaW5nPnNjZW5lKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGluZGV4Om51bWJlciA9IHRoaXMuX3NjZW5lcy5pbmRleE9mKDxTY2VuZT5zY2VuZSk7XG4gICAgICAgICAgICBpZihpbmRleCAhPT0gLTEpe1xuICAgICAgICAgICAgICAgIHRoaXMuX3NjZW5lcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGFkZFNjZW5lKHNjZW5lOlNjZW5lKTpHYW1lIHtcbiAgICAgICAgICAgIHRoaXMuX3NjZW5lcy5wdXNoKHNjZW5lKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVtb3ZlQWxsU2NlbmVzKCk6R2FtZXtcbiAgICAgICAgICAgIHRoaXMuX3NjZW5lcy5sZW5ndGggPSAwO1xuICAgICAgICAgICAgdGhpcy5zY2VuZSA9IG51bGw7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc2l6ZSh3aWR0aDpudW1iZXIsIGhlaWdodDpudW1iZXIsIHJlbmRlcmVyOmJvb2xlYW4gPSBmYWxzZSk6R2FtZXtcbiAgICAgICAgICAgIGlmKHJlbmRlcmVyKXtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnJlc2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5jYW52YXMuc3R5bGUud2lkdGggPSB3aWR0aCArIFwicHhcIjtcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLmhlaWdodCA9IGhlaWdodCArIFwicHhcIjtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBhdXRvUmVzaXplKG1vZGU6bnVtYmVyKTpHYW1lIHtcbiAgICAgICAgICAgIGlmKHRoaXMuX3Jlc2l6ZUxpc3RlbmVyKXtcbiAgICAgICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5fcmVzaXplTGlzdGVuZXIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihtb2RlID09PSBHQU1FX1NDQUxFX1RZUEUuTk9ORSlyZXR1cm47XG5cbiAgICAgICAgICAgIHN3aXRjaChtb2RlKXtcbiAgICAgICAgICAgICAgICBjYXNlIEdBTUVfU0NBTEVfVFlQRS5BU1BFQ1RfRklUOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZXNpemVMaXN0ZW5lciA9IHRoaXMuX3Jlc2l6ZU1vZGVBc3BlY3RGaXQ7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgR0FNRV9TQ0FMRV9UWVBFLkFTUEVDVF9GSUxMOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZXNpemVMaXN0ZW5lciA9IHRoaXMuX3Jlc2l6ZU1vZGVBc3BlY3RGaWxsO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIEdBTUVfU0NBTEVfVFlQRS5GSUxMOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZXNpemVMaXN0ZW5lciA9IHRoaXMuX3Jlc2l6ZU1vZGVGaWxsO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX3Jlc2l6ZUxpc3RlbmVyLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgdGhpcy5fcmVzaXplTGlzdGVuZXIoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfcmVzaXplTW9kZUFzcGVjdEZpdCgpOnZvaWR7XG4gICAgICAgICAgICB2YXIgd3c6bnVtYmVyID0gcGFyc2VJbnQodGhpcy5jYW52YXMuc3R5bGUud2lkdGgsIDEwKSB8fCB0aGlzLmNhbnZhcy53aWR0aDtcbiAgICAgICAgICAgIHZhciBoaDpudW1iZXIgPSBwYXJzZUludCh0aGlzLmNhbnZhcy5zdHlsZS5oZWlnaHQsIDEwKSB8fCB0aGlzLmNhbnZhcy5oZWlnaHQ7XG4gICAgICAgICAgICBpZih3aW5kb3cuaW5uZXJXaWR0aCAhPT0gd3cgfHwgd2luZG93LmlubmVySGVpZ2h0ICE9PSBoaCl7XG4gICAgICAgICAgICAgICAgdmFyIHNjYWxlOm51bWJlciA9IE1hdGgubWluKHdpbmRvdy5pbm5lcldpZHRoL3RoaXMud2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodC90aGlzLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXNpemUodGhpcy53aWR0aCpzY2FsZSwgdGhpcy5oZWlnaHQqc2NhbGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfcmVzaXplTW9kZUFzcGVjdEZpbGwoKTp2b2lke1xuICAgICAgICAgICAgdmFyIHd3Om51bWJlciA9IHBhcnNlSW50KHRoaXMuY2FudmFzLnN0eWxlLndpZHRoLCAxMCkgfHwgdGhpcy5jYW52YXMud2lkdGg7XG4gICAgICAgICAgICB2YXIgaGg6bnVtYmVyID0gcGFyc2VJbnQodGhpcy5jYW52YXMuc3R5bGUuaGVpZ2h0LCAxMCkgfHwgdGhpcy5jYW52YXMuaGVpZ2h0O1xuICAgICAgICAgICAgaWYod2luZG93LmlubmVyV2lkdGggIT09IHd3IHx8IHdpbmRvdy5pbm5lckhlaWdodCAhPT0gaGgpe1xuICAgICAgICAgICAgICAgIHZhciBzY2FsZTpudW1iZXIgPSBNYXRoLm1heCh3aW5kb3cuaW5uZXJXaWR0aC90aGlzLndpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQvdGhpcy5oZWlnaHQpO1xuICAgICAgICAgICAgICAgIHZhciB3aWR0aDpudW1iZXIgPSB0aGlzLndpZHRoKnNjYWxlO1xuICAgICAgICAgICAgICAgIHZhciBoZWlnaHQ6bnVtYmVyID0gdGhpcy5oZWlnaHQqc2NhbGU7XG5cbiAgICAgICAgICAgICAgICB2YXIgdG9wTWFyZ2luOm51bWJlciA9ICh3aW5kb3cuaW5uZXJIZWlnaHQtaGVpZ2h0KS8yO1xuICAgICAgICAgICAgICAgIHZhciBsZWZ0TWFyZ2luOm51bWJlciA9ICh3aW5kb3cuaW5uZXJXaWR0aC13aWR0aCkvMjtcblxuICAgICAgICAgICAgICAgIHRoaXMucmVzaXplKHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgICAgICAgICAgICAgdmFyIHN0eWxlOmFueSA9IDxhbnk+dGhpcy5jYW52YXMuc3R5bGU7XG4gICAgICAgICAgICAgICAgc3R5bGVbJ21hcmdpbi10b3AnXSA9IHRvcE1hcmdpbiArIFwicHhcIjtcbiAgICAgICAgICAgICAgICBzdHlsZVsnbWFyZ2luLWxlZnQnXSA9IGxlZnRNYXJnaW4gKyBcInB4XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9yZXNpemVNb2RlRmlsbCgpOnZvaWR7XG4gICAgICAgICAgICB2YXIgd3c6bnVtYmVyID0gcGFyc2VJbnQodGhpcy5jYW52YXMuc3R5bGUud2lkdGgsIDEwKSB8fCB0aGlzLmNhbnZhcy53aWR0aDtcbiAgICAgICAgICAgIHZhciBoaDpudW1iZXIgPSBwYXJzZUludCh0aGlzLmNhbnZhcy5zdHlsZS5oZWlnaHQsIDEwKSB8fCB0aGlzLmNhbnZhcy5oZWlnaHQ7XG4gICAgICAgICAgICBpZih3aW5kb3cuaW5uZXJXaWR0aCAhPT0gd3cgfHwgd2luZG93LmlubmVySGVpZ2h0ICE9PSBoaCkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVzaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHdpZHRoKCk6bnVtYmVyIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbmRlcmVyLndpZHRoO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGhlaWdodCgpOm51bWJlciB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJlci5oZWlnaHQ7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgR2FtZUNvbmZpZyB7XG4gICAgICAgIGlkPzpzdHJpbmc7XG4gICAgICAgIHdpZHRoPzpudW1iZXI7XG4gICAgICAgIGhlaWdodD86bnVtYmVyO1xuICAgICAgICB1c2VXZWJBdWRpbz86Ym9vbGVhbjtcbiAgICAgICAgdXNlUGVyc2lzdGFudERhdGE/OmJvb2xlYW47XG4gICAgICAgIGdhbWVTY2FsZVR5cGU/Om51bWJlcjtcbiAgICAgICAgc3RvcEF0TG9zdEZvY3VzPzpib29sZWFuO1xuICAgIH1cbn1cblxuaW50ZXJmYWNlIE9iamVjdCB7XG4gICAgYXNzaWduKHRhcmdldDpPYmplY3QsIC4uLnNvdXJjZXM6T2JqZWN0W10pOk9iamVjdDtcbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9kZWZzL3BpeGkuanMuZC50c1wiIC8+XG5cbm1vZHVsZSBQSVhJIHtcbiAgICBDb250YWluZXIuX2tpbGxlZE9iamVjdHMgPSBbXTtcblxuICAgIENvbnRhaW5lci5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oZGVsdGFUaW1lOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5wb3NpdGlvbi54ICs9IHRoaXMudmVsb2NpdHkueCAqIGRlbHRhVGltZTtcbiAgICAgICAgdGhpcy5wb3NpdGlvbi55ICs9IHRoaXMudmVsb2NpdHkueSAqIGRlbHRhVGltZTtcbiAgICAgICAgdGhpcy5yb3RhdGlvbiArPSB0aGlzLnJvdGF0aW9uU3BlZWQgKiBkZWx0YVRpbWU7XG5cbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbltpXS51cGRhdGUoZGVsdGFUaW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBDb250YWluZXIucHJvdG90eXBlLmFkZFRvID0gZnVuY3Rpb24ocGFyZW50KXtcbiAgICAgICAgcGFyZW50LmFkZENoaWxkKHRoaXMpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgQ29udGFpbmVyLnByb3RvdHlwZS5raWxsID0gZnVuY3Rpb24oKXtcbiAgICAgICAgUElYSS5Db250YWluZXIuX2tpbGxlZE9iamVjdHMucHVzaCh0aGlzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIENvbnRhaW5lci5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgaWYodGhpcy5wYXJlbnQpe1xuICAgICAgICAgICAgdGhpcy5wYXJlbnQucmVtb3ZlQ2hpbGQodGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG59IiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vZGVmcy9waXhpLmpzLmQudHNcIiAvPlxuXG5tb2R1bGUgUElYSSB7XG4gICAgRGlzcGxheU9iamVjdC5wcm90b3R5cGUuc3BlZWQgPSAwO1xuICAgIERpc3BsYXlPYmplY3QucHJvdG90eXBlLnZlbG9jaXR5ID0gbmV3IFBvaW50KCk7XG4gICAgRGlzcGxheU9iamVjdC5wcm90b3R5cGUuZGlyZWN0aW9uID0gMDtcbiAgICBEaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5yb3RhdGlvblNwZWVkID0gMDtcblxuICAgIERpc3BsYXlPYmplY3QucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKGRlbHRhVGltZTpudW1iZXIpe1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xufVxuIiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vZGVmcy9waXhpLmpzLmQudHNcIiAvPlxubW9kdWxlIFBJWEkge1xuICAgIHZhciBMb2FkZXJNaWRkbGV3YXJlOmFueVtdID0gW107XG5cblxuXG4gICAgbG9hZGVycy5Mb2FkZXIuX3BpeGlNaWRkbGV3YXJlID0gbG9hZGVycy5Mb2FkZXIuX3BpeGlNaWRkbGV3YXJlLmNvbmNhdChMb2FkZXJNaWRkbGV3YXJlKTtcbn0iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
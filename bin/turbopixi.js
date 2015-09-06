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
            stopAtLostFocus: true,
            assetsUrl: '',
            loaderConcurrency: 10
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
        PIXI.loaders.Loader.addPixiMiddleware(function () {
            console.log('');
        });
    }(PIXI || (PIXI = {})));
}(typeof PIXI === 'object' ? PIXI : null));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInR1cmJvcGl4aS5qcyIsImluZGV4LnRzIiwiYXVkaW8vQXVkaW9NYW5hZ2VyLnRzIiwiY29yZS9EYXRhTWFuYWdlci50cyIsImNvcmUvRGV2aWNlLnRzIiwiZGlzcGxheS9TY2VuZS50cyIsImlucHV0L0lucHV0TWFuYWdlci50cyIsImNvcmUvR2FtZS50cyIsImRpc3BsYXkvQ29udGFpbmVyLnRzIiwiZGlzcGxheS9EaXNwbGF5T2JqZWN0LnRzIiwibG9hZGVyL0xvYWRlci50cyJdLCJuYW1lcyI6WyJQSVhJIiwiRXJyb3IiLCJQSVhJX1ZFUlNJT05fUkVRVUlSRUQiLCJQSVhJX1ZFUlNJT04iLCJWRVJTSU9OIiwibWF0Y2giLCJQSVhJLkdBTUVfU0NBTEVfVFlQRSIsIlBJWEkuQVVESU9fVFlQRSIsIlBJWEkuQXVkaW9NYW5hZ2VyIiwiUElYSS5BdWRpb01hbmFnZXIuY29uc3RydWN0b3IiLCJQSVhJLkRhdGFNYW5hZ2VyIiwiUElYSS5EYXRhTWFuYWdlci5jb25zdHJ1Y3RvciIsIlBJWEkuRGF0YU1hbmFnZXIubG9hZCIsIlBJWEkuRGF0YU1hbmFnZXIuc2F2ZSIsIlBJWEkuRGF0YU1hbmFnZXIucmVzZXQiLCJQSVhJLkRhdGFNYW5hZ2VyLnNldCIsIlBJWEkuRGF0YU1hbmFnZXIuZ2V0IiwiUElYSS5EYXRhTWFuYWdlci5kZWwiLCJoYXNNb3VzZVdoZWVsIiwiZXZ0Iiwid2luZG93IiwiaGFzVmlicmF0ZSIsIm5hdmlnYXRvciIsInZpYnJhdGUiLCJwYXR0ZXJuIiwiZG9jdW1lbnQiLCJoaWRkZW4iLCJ3ZWJraXRIaWRkZW4iLCJtb3pIaWRkZW4iLCJtc0hpZGRlbiIsIlBJWEkuaXNPbmxpbmUiLCJfX2V4dGVuZHMiLCJkIiwiYiIsInAiLCJoYXNPd25Qcm9wZXJ0eSIsIl9fIiwiY29uc3RydWN0b3IiLCJwcm90b3R5cGUiLCJQSVhJLlNjZW5lIiwiUElYSS5TY2VuZS5jb25zdHJ1Y3RvciIsIlBJWEkuU2NlbmUuYWRkVG8iLCJQSVhJLklucHV0TWFuYWdlciIsIlBJWEkuSW5wdXRNYW5hZ2VyLmNvbnN0cnVjdG9yIiwiUElYSS5HYW1lIiwiUElYSS5HYW1lLmNvbnN0cnVjdG9yIiwiUElYSS5HYW1lLl9hbmltYXRlIiwiUElYSS5HYW1lLnVwZGF0ZSIsIlBJWEkuR2FtZS5zdGFydCIsIlBJWEkuR2FtZS5zdG9wIiwiUElYSS5HYW1lLmVuYWJsZVN0b3BBdExvc3RGb2N1cyIsIlBJWEkuR2FtZS5kaXNhYmxlU3RvcEF0TG9zdEZvY3VzIiwiUElYSS5HYW1lLl9vblZpc2liaWxpdHlDaGFuZ2UiLCJQSVhJLkdhbWUub25Mb3N0Rm9jdXMiLCJQSVhJLkdhbWUuc2V0U2NlbmUiLCJQSVhJLkdhbWUuZ2V0U2NlbmUiLCJQSVhJLkdhbWUuY3JlYXRlU2NlbmUiLCJQSVhJLkdhbWUucmVtb3ZlU2NlbmUiLCJQSVhJLkdhbWUuYWRkU2NlbmUiLCJQSVhJLkdhbWUucmVtb3ZlQWxsU2NlbmVzIiwiUElYSS5HYW1lLnJlc2l6ZSIsIlBJWEkuR2FtZS5hdXRvUmVzaXplIiwiUElYSS5HYW1lLl9yZXNpemVNb2RlQXNwZWN0Rml0IiwiUElYSS5HYW1lLl9yZXNpemVNb2RlQXNwZWN0RmlsbCIsIlBJWEkuR2FtZS5fcmVzaXplTW9kZUZpbGwiLCJnZXQiLCJQSVhJLkdhbWUud2lkdGgiLCJlbnVtZXJhYmxlIiwiY29uZmlndXJhYmxlIiwiUElYSS5HYW1lLmhlaWdodCIsInBvc2l0aW9uIiwieCIsInZlbG9jaXR5IiwiZGVsdGFUaW1lIiwieSIsInJvdGF0aW9uIiwicm90YXRpb25TcGVlZCIsImkiLCJjaGlsZHJlbiIsImxlbmd0aCIsInVwZGF0ZSIsInBhcmVudCIsImFkZENoaWxkIiwiQ29udGFpbmVyIiwiX2tpbGxlZE9iamVjdHMiLCJwdXNoIiwicmVtb3ZlQ2hpbGQiLCJjb25zb2xlIiwibG9nIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtJQ0xBLElBQUcsQ0FBQ0EsSUFBSixFQUFTO0FBQUEsUUFDTCxNQUFNLElB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QUFBLENBQUFBLGFBQUFBLENBQWNBLFNBQWRBLENBQXdCQSxRQUF4QkEsR0FBbUNBLElBQUlBLElBQUFBLENBQUFBLEtBQUpBLEVBQW5DQSxDQUZRO0FBQUEsUUFHUkEsSUFBQUEsQ0FBQUEsYUFBQUEsQ0FBY0EsU0FBZEEsQ0FBd0JBLFNBQXhCQSxHQUFvQ0EsQ0FBcENBLENBSFE7QUFBQSxRQUlSQSxJQUFBQSxDQUFBQSxhQUFBQSxDQUFjQSxTQUFkQSxDQUF3QkEsYUFBeEJBLEdBQXdDQSxDQUF4Q0EsQ0FKUTtBQUFBLFFBTVJBLElBQUFBLENBQUFBLGFBQUFBLENBQWNBLFNBQWRBLENBQXdCQSxNQUF4QkEsR0FBaUNBLFVBQVNBLFNBQVRBLEVBQXlCQTtBQUFBQSxZQUN0RCxPQUFPLElBQVAsQ0FEc0RBO0FBQUFBLFNBQTFEQSxDQU5RO0FBQUEsS0FBWixDQUFPQSxJQUFBLElBQUEsQ0FBQUEsSUFBQSxHQUFJLEVBQUosQ0FBUDtJQ0RBO0FBQUEsUUFBT0EsSUFBUDtJQUFBLENBQUEsVUFBT0EsSUFBUCxFQUFZO0FBQUEsUUFDUkEsSUFBQUEsQ0FBQUEsT0FBQUEsQ0FBUUEsTUFBUkEsQ0FBZUEsaUJBQWZBLENBQWlDQSxZQUFBQTtBQUFBQSxZQUM3QnVGLE9BQUEsQ0FBUUMsR0FBUixDQUFZLEVBQVosRUFENkJ4RjtBQUFBQSxTQUFqQ0EsRUFEUTtBQUFBLEtBQVosQ0FBT0EsSUFBQSxJQUFBLENBQUFBLElBQUEsR0FBSSxFQUFKLENBQVAiLCJmaWxlIjoidHVyYm9waXhpLmpzIiwic291cmNlc0NvbnRlbnQiOltudWxsLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9kZWZzL3BpeGkuanMuZC50c1wiIC8+XG5pZighUElYSSl7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdFeSEgV2hlcmUgaXMgcGl4aS5qcz8/Jyk7XG59XG5cbmNvbnN0IFBJWElfVkVSU0lPTl9SRVFVSVJFRCA9IFwiMy4wLjdcIjtcbmNvbnN0IFBJWElfVkVSU0lPTiA9IFBJWEkuVkVSU0lPTi5tYXRjaCgvXFxkLlxcZC5cXGQvKVswXTtcblxuaWYoUElYSV9WRVJTSU9OIDwgUElYSV9WRVJTSU9OX1JFUVVJUkVEKXtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJQaXhpLmpzIHZcIiArIFBJWEkuVkVSU0lPTiArIFwiIGl0J3Mgbm90IHN1cHBvcnRlZCwgcGxlYXNlIHVzZSBeXCIgKyBQSVhJX1ZFUlNJT05fUkVRVUlSRUQpO1xufVxuXG5tb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IGVudW0gR0FNRV9TQ0FMRV9UWVBFIHtcbiAgICAgICAgTk9ORSxcbiAgICAgICAgRklMTCxcbiAgICAgICAgQVNQRUNUX0ZJVCxcbiAgICAgICAgQVNQRUNUX0ZJTExcbiAgICB9XG5cbiAgICBleHBvcnQgZW51bSBBVURJT19UWVBFIHtcbiAgICAgICAgVU5LTk9XTixcbiAgICAgICAgV0VCQVVESU8sXG4gICAgICAgIEhUTUxBVURJT1xuICAgIH1cbn1cbiIsIm1vZHVsZSBQSVhJIHtcbiAgICBleHBvcnQgY2xhc3MgQXVkaW9NYW5hZ2Vye1xuICAgICAgICBnYW1lOkdhbWU7XG5cbiAgICAgICAgY29uc3RydWN0b3IoZ2FtZTogR2FtZSl7XG4gICAgICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB9XG4gICAgfVxufSIsIm1vZHVsZSBQSVhJIHtcbiAgICBleHBvcnQgY2xhc3MgRGF0YU1hbmFnZXJ7XG4gICAgICAgIGdhbWU6R2FtZTtcbiAgICAgICAgdXNlUGVyc2lzdGFudERhdGE6Ym9vbGVhbjtcblxuICAgICAgICBwcml2YXRlIF9kYXRhOmFueTtcblxuICAgICAgICBjb25zdHJ1Y3RvcihnYW1lOkdhbWUsIHVzZVBlcnNpdGFudERhdGE6Ym9vbGVhbiA9IGZhbHNlKXtcbiAgICAgICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgICAgICB0aGlzLnVzZVBlcnNpc3RhbnREYXRhID0gdXNlUGVyc2l0YW50RGF0YTtcbiAgICAgICAgICAgIHRoaXMubG9hZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgbG9hZCgpOkRhdGFNYW5hZ2Vye1xuICAgICAgICAgICAgdGhpcy5fZGF0YSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5nYW1lLmlkKSkgfHwge307XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHNhdmUoKTpEYXRhTWFuYWdlcntcbiAgICAgICAgICAgIGlmKHRoaXMudXNlUGVyc2lzdGFudERhdGEpe1xuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMuZ2FtZS5pZCwgSlNPTi5zdHJpbmdpZnkodGhpcy5fZGF0YSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICByZXNldCgpOkRhdGFNYW5hZ2Vye1xuICAgICAgICAgICAgdGhpcy5fZGF0YSA9IHt9O1xuICAgICAgICAgICAgdGhpcy5zYXZlKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHNldChrZXk6c3RyaW5nIHwgT2JqZWN0LCB2YWx1ZT86YW55KTpEYXRhTWFuYWdlcntcbiAgICAgICAgICAgIGlmKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChrZXkpID09PSBcIltvYmplY3QgT2JqZWN0XVwiKXtcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMuX2RhdGEsIGtleSk7XG4gICAgICAgICAgICB9ZWxzZSBpZih0eXBlb2Yga2V5ID09PSBcInN0cmluZ1wiKXtcbiAgICAgICAgICAgICAgICB0aGlzLl9kYXRhW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5zYXZlKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGdldChrZXk/OnN0cmluZyk6YW55e1xuICAgICAgICAgICAgaWYoIWtleSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9kYXRhW2tleV07XG4gICAgICAgIH1cblxuICAgICAgICBkZWwoa2V5OnN0cmluZyk6RGF0YU1hbmFnZXJ7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fZGF0YVtrZXldO1xuICAgICAgICAgICAgdGhpcy5zYXZlKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgfVxufSIsIi8vTWFueSBjaGVja3MgYXJlIGJhc2VkIG9uIGh0dHBzOi8vZ2l0aHViLmNvbS9hcmFzYXRhc2F5Z2luL2lzLmpzL2Jsb2IvbWFzdGVyL2lzLmpzXG5cbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2RlZnMvcGl4aS5qcy5kLnRzXCIgLz5cbm1vZHVsZSBQSVhJIHtcbiAgICB2YXIgbmF2aWdhdG9yOk5hdmlnYXRvciA9IHdpbmRvdy5uYXZpZ2F0b3I7XG4gICAgdmFyIGRvY3VtZW50OkRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xuXG4gICAgdmFyIHVzZXJBZ2VudDpzdHJpbmcgPSAnbmF2aWdhdG9yJyBpbiB3aW5kb3cgJiYgJ3VzZXJBZ2VudCcgaW4gbmF2aWdhdG9yICYmIG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKSB8fCAnJyxcbiAgICAgICAgdmVuZG9yOnN0cmluZyA9ICduYXZpZ2F0b3InIGluIHdpbmRvdyAmJiAndmVuZG9yJyBpbiBuYXZpZ2F0b3IgJiYgbmF2aWdhdG9yLnZlbmRvci50b0xvd2VyQ2FzZSgpIHx8ICcnLFxuICAgICAgICBhcHBWZXJzaW9uOnN0cmluZyA9ICduYXZpZ2F0b3InIGluIHdpbmRvdyAmJiAnYXBwVmVyc2lvbicgaW4gbmF2aWdhdG9yICYmIG5hdmlnYXRvci5hcHBWZXJzaW9uLnRvTG93ZXJDYXNlKCkgfHwgJyc7XG5cbiAgICAvL0Jyb3dzZXJzXG4gICAgdmFyIGlzQ2hyb21lOmJvb2xlYW4gPSAvY2hyb21lfGNocm9taXVtL2kudGVzdCh1c2VyQWdlbnQpICYmIC9nb29nbGUgaW5jLy50ZXN0KHZlbmRvciksXG4gICAgICAgIGlzRmlyZWZveDpib29sZWFuID0gL2ZpcmVmb3gvaS50ZXN0KHVzZXJBZ2VudCksXG4gICAgICAgIGlzSUU6Ym9vbGVhbiA9IC9tc2llL2kudGVzdCh1c2VyQWdlbnQpIHx8IFwiQWN0aXZlWE9iamVjdFwiIGluIHdpbmRvdyxcbiAgICAgICAgaXNPcGVyYTpib29sZWFuID0gL15PcGVyYVxcLy8udGVzdCh1c2VyQWdlbnQpIHx8IC9cXHgyME9QUlxcLy8udGVzdCh1c2VyQWdlbnQpLFxuICAgICAgICBpc1NhZmFyaTpib29sZWFuID0gL3NhZmFyaS9pLnRlc3QodXNlckFnZW50KSAmJiAvYXBwbGUgY29tcHV0ZXIvaS50ZXN0KHZlbmRvcik7XG5cbiAgICAvL0RldmljZXMgJiYgT1NcbiAgICB2YXIgaXNJcGhvbmU6Ym9vbGVhbiA9IC9pcGhvbmUvaS50ZXN0KHVzZXJBZ2VudCksXG4gICAgICAgIGlzSXBhZDpib29sZWFuID0gL2lwYWQvaS50ZXN0KHVzZXJBZ2VudCksXG4gICAgICAgIGlzSXBvZDpib29sZWFuID0gL2lwb2QvaS50ZXN0KHVzZXJBZ2VudCksXG4gICAgICAgIGlzQW5kcm9pZDpib29sZWFuID0gL2FuZHJvaWQvaS50ZXN0KHVzZXJBZ2VudCksXG4gICAgICAgIGlzQW5kcm9pZFBob25lOmJvb2xlYW4gPSAvYW5kcm9pZC9pLnRlc3QodXNlckFnZW50KSAmJiAvbW9iaWxlL2kudGVzdCh1c2VyQWdlbnQpLFxuICAgICAgICBpc0FuZHJvaWRUYWJsZXQ6Ym9vbGVhbiA9IC9hbmRyb2lkL2kudGVzdCh1c2VyQWdlbnQpICYmICEvbW9iaWxlL2kudGVzdCh1c2VyQWdlbnQpLFxuICAgICAgICBpc0xpbnV4OmJvb2xlYW4gPSAvbGludXgvaS50ZXN0KGFwcFZlcnNpb24pLFxuICAgICAgICBpc01hYzpib29sZWFuID0gL21hYy9pLnRlc3QoYXBwVmVyc2lvbiksXG4gICAgICAgIGlzV2luZG93OmJvb2xlYW4gPSAvd2luL2kudGVzdChhcHBWZXJzaW9uKSxcbiAgICAgICAgaXNXaW5kb3dQaG9uZTpib29sZWFuID0gaXNXaW5kb3cgJiYgL3Bob25lL2kudGVzdCh1c2VyQWdlbnQpLFxuICAgICAgICBpc1dpbmRvd1RhYmxldDpib29sZWFuID0gaXNXaW5kb3cgJiYgIWlzV2luZG93UGhvbmUgJiYgL3RvdWNoL2kudGVzdCh1c2VyQWdlbnQpLFxuICAgICAgICBpc01vYmlsZTpib29sZWFuID0gaXNJcGhvbmUgfHwgaXNJcG9kfHwgaXNBbmRyb2lkUGhvbmUgfHwgaXNXaW5kb3dQaG9uZSxcbiAgICAgICAgaXNUYWJsZXQ6Ym9vbGVhbiA9IGlzSXBhZCB8fCBpc0FuZHJvaWRUYWJsZXQgfHwgaXNXaW5kb3dUYWJsZXQsXG4gICAgICAgIGlzRGVza3RvcDpib29sZWFuID0gIWlzTW9iaWxlICYmICFpc1RhYmxldCxcbiAgICAgICAgaXNUb3VjaERldmljZTpib29sZWFuID0gJ29udG91Y2hzdGFydCcgaW4gd2luZG93IHx8J0RvY3VtZW50VG91Y2gnIGluIHdpbmRvdyAmJiBkb2N1bWVudCBpbnN0YW5jZW9mIERvY3VtZW50VG91Y2gsXG4gICAgICAgIGlzQ29jb29uOmJvb2xlYW4gPSAhIW5hdmlnYXRvci5pc0NvY29vbkpTLFxuICAgICAgICBpc05vZGVXZWJraXQ6Ym9vbGVhbiA9ICEhKHR5cGVvZiBwcm9jZXNzID09PSBcIm9iamVjdFwiICYmIHByb2Nlc3MudGl0bGUgPT09IFwibm9kZVwiICYmIHR5cGVvZiBnbG9iYWwgPT09IFwib2JqZWN0XCIpLFxuICAgICAgICBpc0VqZWN0YTpib29sZWFuID0gISF3aW5kb3cuZWplY3RhLFxuICAgICAgICBpc0Nyb3Nzd2Fsazpib29sZWFuID0gL0Nyb3Nzd2Fsay8udGVzdCh1c2VyQWdlbnQpLFxuICAgICAgICBpc0NvcmRvdmE6Ym9vbGVhbiA9ICEhd2luZG93LmNvcmRvdmEsXG4gICAgICAgIGlzRWxlY3Ryb246Ym9vbGVhbiA9ICEhKHR5cGVvZiBwcm9jZXNzID09PSBcIm9iamVjdFwiICYmIHByb2Nlc3MudmVyc2lvbnMgJiYgKHByb2Nlc3MudmVyc2lvbnMuZWxlY3Ryb24gfHwgcHJvY2Vzcy52ZXJzaW9uc1snYXRvbS1zaGVsbCddKSk7XG5cbiAgICB2YXIgaGFzVmlicmF0ZTpib29sZWFuID0gISFuYXZpZ2F0b3IudmlicmF0ZSAmJiAoaXNNb2JpbGUgfHwgaXNUYWJsZXQpLFxuICAgICAgICBoYXNNb3VzZVdoZWVsOmJvb2xlYW4gPSAnb253aGVlbCcgaW4gd2luZG93IHx8ICdvbm1vdXNld2hlZWwnIGluIHdpbmRvdyB8fCAnTW91c2VTY3JvbGxFdmVudCcgaW4gd2luZG93LFxuICAgICAgICBoYXNBY2NlbGVyb21ldGVyOmJvb2xlYW4gPSAnRGV2aWNlTW90aW9uRXZlbnQnIGluIHdpbmRvdyxcbiAgICAgICAgaGFzR2FtZXBhZDpib29sZWFuID0gISFuYXZpZ2F0b3IuZ2V0R2FtZXBhZHMgfHwgISFuYXZpZ2F0b3Iud2Via2l0R2V0R2FtZXBhZHM7XG5cbiAgICAvL0Z1bGxTY3JlZW5cbiAgICB2YXIgZGl2OkhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdmFyIGZ1bGxTY3JlZW5SZXF1ZXN0OmFueSA9IGRpdi5yZXF1ZXN0RnVsbHNjcmVlbiB8fCBkaXYud2Via2l0UmVxdWVzdEZ1bGxTY3JlZW4gfHwgZGl2Lm1zUmVxdWVzdEZ1bGxTY3JlZW4gfHwgZGl2Lm1velJlcXVlc3RGdWxsU2NyZWVuLFxuICAgICAgICBmdWxsU2NyZWVuQ2FuY2VsOmFueSA9IGRvY3VtZW50LmNhbmNlbEZ1bGxTY3JlZW4gfHwgZG9jdW1lbnQuZXhpdEZ1bGxTY3JlZW4gfHwgZG9jdW1lbnQud2Via2l0Q2FuY2VsRnVsbFNjcmVlbiB8fCBkb2N1bWVudC5tc0NhbmNlbEZ1bGxTY3JlZW4gfHwgZG9jdW1lbnQubW96Q2FuY2VsRnVsbFNjcmVlbixcbiAgICAgICAgaGFzRnVsbFNjcmVlbjpib29sZWFuID0gISEoZnVsbFNjcmVlblJlcXVlc3QgJiYgZnVsbFNjcmVlbkNhbmNlbCk7XG5cbiAgICAvL0F1ZGlvXG4gICAgdmFyIGhhc0hUTUxBdWRpbzpib29sZWFuID0gISF3aW5kb3cuQXVkaW8sXG4gICAgICAgIHdlYkF1ZGlvQ29udGV4dDphbnkgPSB3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQsXG4gICAgICAgIGhhc1dlYkF1ZGlvOmJvb2xlYW4gPSAhIXdlYkF1ZGlvQ29udGV4dCxcbiAgICAgICAgaGFzQXVkaW86Ym9vbGVhbiA9IGhhc1dlYkF1ZGlvIHx8IGhhc0hUTUxBdWRpbyxcbiAgICAgICAgaGFzTXAzOmJvb2xlYW4gPSBmYWxzZSxcbiAgICAgICAgaGFzT2dnOmJvb2xlYW4gPSBmYWxzZSxcbiAgICAgICAgaGFzV2F2OmJvb2xlYW4gPSBmYWxzZSxcbiAgICAgICAgaGFzTTRhOmJvb2xlYW4gPSBmYWxzZTtcblxuICAgIC8vQXVkaW8gbWltZVR5cGVzXG4gICAgaWYoaGFzQXVkaW8pe1xuICAgICAgICB2YXIgYXVkaW86SFRNTEF1ZGlvRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2F1ZGlvJyk7XG4gICAgICAgIGhhc01wMyA9IGF1ZGlvLmNhblBsYXlUeXBlKCdhdWRpby9tcGVnOycpICE9PSBcIlwiO1xuICAgICAgICBoYXNPZ2cgPSBhdWRpby5jYW5QbGF5VHlwZSgnYXVkaW8vb2dnOyBjb2RlY3M9XCJ2b3JiaXNcIicpICE9PSBcIlwiO1xuICAgICAgICBoYXNXYXYgPSBhdWRpby5jYW5QbGF5VHlwZSgnYXVkaW8vd2F2JykgIT09IFwiXCI7XG4gICAgICAgIGhhc000YSA9IGF1ZGlvLmNhblBsYXlUeXBlKCdhdWRpby9tcDQ7IGNvZGVjcz1cIm1wNGEuNDAuNVwiJykgIT09IFwiXCI7XG4gICAgfVxuXG4gICAgZXhwb3J0IHZhciBEZXZpY2UgOiBEZXZpY2VEYXRhID0ge1xuICAgICAgICBpc0Nocm9tZSA6IGlzQ2hyb21lLFxuICAgICAgICBpc0ZpcmVmb3ggOiBpc0ZpcmVmb3gsXG4gICAgICAgIGlzSUUgOiBpc0lFLFxuICAgICAgICBpc09wZXJhIDogaXNPcGVyYSxcbiAgICAgICAgaXNTYWZhcmkgOiBpc1NhZmFyaSxcbiAgICAgICAgaXNJcGhvbmUgOiBpc0lwaG9uZSxcbiAgICAgICAgaXNJcGFkIDogaXNJcGFkLFxuICAgICAgICBpc0lwb2QgOiBpc0lwb2QsXG4gICAgICAgIGlzQW5kcm9pZCA6IGlzQW5kcm9pZCxcbiAgICAgICAgaXNBbmRyb2lkUGhvbmUgOiBpc0FuZHJvaWRQaG9uZSxcbiAgICAgICAgaXNBbmRyb2lkVGFibGV0IDogaXNBbmRyb2lkVGFibGV0LFxuICAgICAgICBpc0xpbnV4IDogaXNMaW51eCxcbiAgICAgICAgaXNNYWMgOiBpc01hYyxcbiAgICAgICAgaXNXaW5kb3cgOiBpc1dpbmRvdyxcbiAgICAgICAgaXNXaW5kb3dQaG9uZSA6IGlzV2luZG93UGhvbmUsXG4gICAgICAgIGlzV2luZG93VGFibGV0IDogaXNXaW5kb3dUYWJsZXQsXG4gICAgICAgIGlzTW9iaWxlIDogaXNNb2JpbGUsXG4gICAgICAgIGlzVGFibGV0IDogaXNUYWJsZXQsXG4gICAgICAgIGlzRGVza3RvcCA6IGlzRGVza3RvcCxcbiAgICAgICAgaXNUb3VjaERldmljZSA6IGlzVG91Y2hEZXZpY2UsXG4gICAgICAgIGlzQ29jb29uIDogaXNDb2Nvb24sXG4gICAgICAgIGlzTm9kZVdlYmtpdCA6IGlzTm9kZVdlYmtpdCxcbiAgICAgICAgaXNFamVjdGEgOiBpc0VqZWN0YSxcbiAgICAgICAgaXNDb3Jkb3ZhIDogaXNDb3Jkb3ZhLFxuICAgICAgICBpc0Nyb3Nzd2FsayA6IGlzQ3Jvc3N3YWxrLFxuICAgICAgICBpc0VsZWN0cm9uIDogaXNFbGVjdHJvbixcbiAgICAgICAgaXNBdG9tU2hlbGwgOiBpc0VsZWN0cm9uLCAvL1RPRE86IFJlbW92ZSBzb29uLCB3aGVuIGF0b20tc2hlbGwgKHZlcnNpb24pIGlzIGRlcHJlY2F0ZWRcblxuICAgICAgICAvL2lzT25saW5lIDogbmF2aWdhdG9yLm9uTGluZSxcbiAgICAgICAgaGFzVmlicmF0ZSA6IGhhc1ZpYnJhdGUsXG4gICAgICAgIGhhc01vdXNlV2hlZWwgOiBoYXNNb3VzZVdoZWVsLFxuICAgICAgICBoYXNGdWxsU2NyZWVuIDogaGFzRnVsbFNjcmVlbixcbiAgICAgICAgaGFzQWNjZWxlcm9tZXRlciA6IGhhc0FjY2VsZXJvbWV0ZXIsXG4gICAgICAgIGhhc0dhbWVwYWQgOiBoYXNHYW1lcGFkLFxuXG4gICAgICAgIGZ1bGxTY3JlZW5SZXF1ZXN0IDogZnVsbFNjcmVlblJlcXVlc3QgPyBmdWxsU2NyZWVuUmVxdWVzdC5uYW1lIDogdW5kZWZpbmVkLFxuICAgICAgICBmdWxsU2NyZWVuQ2FuY2VsIDogZnVsbFNjcmVlbkNhbmNlbCA/IGZ1bGxTY3JlZW5DYW5jZWwubmFtZSA6IHVuZGVmaW5lZCxcblxuICAgICAgICBoYXNBdWRpbyA6IGhhc0F1ZGlvLFxuICAgICAgICBoYXNIVE1MQXVkaW8gOiBoYXNIVE1MQXVkaW8sXG4gICAgICAgIGhhc1dlYkF1ZGlvOiBoYXNXZWJBdWRpbyxcbiAgICAgICAgd2ViQXVkaW9Db250ZXh0IDogd2ViQXVkaW9Db250ZXh0LFxuXG4gICAgICAgIGhhc01wMyA6IGhhc01wMyxcbiAgICAgICAgaGFzTTRhIDogaGFzTTRhLFxuICAgICAgICBoYXNPZ2cgOiBoYXNPZ2csXG4gICAgICAgIGhhc1dhdiA6IGhhc1dhdixcblxuICAgICAgICBnZXRNb3VzZVdoZWVsRXZlbnQgOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmKCFoYXNNb3VzZVdoZWVsKXJldHVybjtcbiAgICAgICAgICAgIHZhciBldnQ6c3RyaW5nO1xuICAgICAgICAgICAgaWYoJ29ud2hlZWwnIGluIHdpbmRvdyl7XG4gICAgICAgICAgICAgICAgZXZ0ID0gJ3doZWVsJztcbiAgICAgICAgICAgIH1lbHNlIGlmKCdvbm1vdXNld2hlZWwnIGluIHdpbmRvdyl7XG4gICAgICAgICAgICAgICAgZXZ0ID0gJ21vdXNld2hlZWwnO1xuICAgICAgICAgICAgfWVsc2UgaWYoJ01vdXNlU2Nyb2xsRXZlbnQnIGluIHdpbmRvdyl7XG4gICAgICAgICAgICAgICAgZXZ0ID0gJ0RPTU1vdXNlU2Nyb2xsJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGV2dDtcbiAgICAgICAgfSxcblxuICAgICAgICB2aWJyYXRlIDogZnVuY3Rpb24ocGF0dGVybjogbnVtYmVyIHwgbnVtYmVyW10pe1xuICAgICAgICAgICAgaWYoaGFzVmlicmF0ZSl7XG4gICAgICAgICAgICAgICAgbmF2aWdhdG9yLnZpYnJhdGUocGF0dGVybik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0VmlzaWJpbGl0eUNoYW5nZUV2ZW50OiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgaWYodHlwZW9mIGRvY3VtZW50LmhpZGRlbiAhPT0gJ3VuZGVmaW5lZCcpe1xuICAgICAgICAgICAgICAgIHJldHVybiAndmlzaWJpbGl0eWNoYW5nZSc7XG4gICAgICAgICAgICB9ZWxzZSBpZih0eXBlb2YgZG9jdW1lbnQud2Via2l0SGlkZGVuICE9PSAndW5kZWZpbmVkJyl7XG4gICAgICAgICAgICAgICAgcmV0dXJuICd3ZWJraXR2aXNpYmlsaXR5Y2hhbmdlJztcbiAgICAgICAgICAgIH1lbHNlIGlmKHR5cGVvZiBkb2N1bWVudC5tb3pIaWRkZW4gIT09ICd1bmRlZmluZWQnKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ21venZpc2liaWxpdHljaGFuZ2UnO1xuICAgICAgICAgICAgfWVsc2UgaWYodHlwZW9mIGRvY3VtZW50Lm1zSGlkZGVuICE9PSAndW5kZWZpbmVkJyl7XG4gICAgICAgICAgICAgICAgcmV0dXJuICdtc3Zpc2liaWxpdHljaGFuZ2UnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGdldCBpc09ubGluZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB3aW5kb3cubmF2aWdhdG9yLm9uTGluZTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIERldmljZURhdGEge1xuICAgICAgICBpc0Nocm9tZSA6IGJvb2xlYW47XG4gICAgICAgIGlzRmlyZWZveCA6IGJvb2xlYW47XG4gICAgICAgIGlzSUUgOiBib29sZWFuO1xuICAgICAgICBpc09wZXJhIDogYm9vbGVhbjtcbiAgICAgICAgaXNTYWZhcmkgOiBib29sZWFuO1xuICAgICAgICBpc0lwaG9uZSA6IGJvb2xlYW47XG4gICAgICAgIGlzSXBhZCA6IGJvb2xlYW47XG4gICAgICAgIGlzSXBvZCA6IGJvb2xlYW47XG4gICAgICAgIGlzQW5kcm9pZCA6IGJvb2xlYW47XG4gICAgICAgIGlzQW5kcm9pZFBob25lIDogYm9vbGVhbjtcbiAgICAgICAgaXNBbmRyb2lkVGFibGV0IDogYm9vbGVhbjtcbiAgICAgICAgaXNMaW51eCA6IGJvb2xlYW47XG4gICAgICAgIGlzTWFjIDogYm9vbGVhbjtcbiAgICAgICAgaXNXaW5kb3cgOiBib29sZWFuO1xuICAgICAgICBpc1dpbmRvd1Bob25lIDogYm9vbGVhbjtcbiAgICAgICAgaXNXaW5kb3dUYWJsZXQgOiBib29sZWFuO1xuICAgICAgICBpc01vYmlsZSA6IGJvb2xlYW47XG4gICAgICAgIGlzVGFibGV0IDogYm9vbGVhbjtcbiAgICAgICAgaXNEZXNrdG9wIDogYm9vbGVhbjtcbiAgICAgICAgaXNUb3VjaERldmljZSA6IGJvb2xlYW47XG4gICAgICAgIGlzQ29jb29uIDogYm9vbGVhbjtcbiAgICAgICAgaXNOb2RlV2Via2l0IDogYm9vbGVhbjtcbiAgICAgICAgaXNFamVjdGEgOiBib29sZWFuO1xuICAgICAgICBpc0NvcmRvdmEgOiBib29sZWFuO1xuICAgICAgICBpc0Nyb3Nzd2FsayA6IGJvb2xlYW47XG4gICAgICAgIGlzRWxlY3Ryb24gOiBib29sZWFuO1xuICAgICAgICBpc0F0b21TaGVsbCA6IGJvb2xlYW47XG5cbiAgICAgICAgaGFzVmlicmF0ZSA6IGJvb2xlYW47XG4gICAgICAgIGhhc01vdXNlV2hlZWwgOiBib29sZWFuO1xuICAgICAgICBoYXNGdWxsU2NyZWVuIDogYm9vbGVhbjtcbiAgICAgICAgaGFzQWNjZWxlcm9tZXRlciA6IGJvb2xlYW47XG4gICAgICAgIGhhc0dhbWVwYWQgOiBib29sZWFuO1xuXG4gICAgICAgIGZ1bGxTY3JlZW5SZXF1ZXN0OmZ1bGxTY3JlZW5EYXRhO1xuICAgICAgICBmdWxsU2NyZWVuQ2FuY2VsOmZ1bGxTY3JlZW5EYXRhO1xuXG4gICAgICAgIGhhc0F1ZGlvIDogYm9vbGVhbjtcbiAgICAgICAgaGFzSFRNTEF1ZGlvIDogYm9vbGVhbjtcbiAgICAgICAgaGFzV2ViQXVkaW8gOiBib29sZWFuO1xuICAgICAgICB3ZWJBdWRpb0NvbnRleHQ6YW55O1xuXG4gICAgICAgIGhhc01wMyA6IGJvb2xlYW47XG4gICAgICAgIGhhc000YSA6IGJvb2xlYW47XG4gICAgICAgIGhhc09nZyA6IGJvb2xlYW47XG4gICAgICAgIGhhc1dhdiA6IGJvb2xlYW47XG5cbiAgICAgICAgaXNPbmxpbmU6Ym9vbGVhbjtcblxuICAgICAgICBnZXRNb3VzZVdoZWVsRXZlbnQoKTpzdHJpbmc7XG5cbiAgICAgICAgdmlicmF0ZSh2YWx1ZTpudW1iZXIpOnZvaWQ7XG5cbiAgICAgICAgZ2V0VmlzaWJpbGl0eUNoYW5nZUV2ZW50KCk6c3RyaW5nO1xuICAgIH1cbn1cblxuZGVjbGFyZSB2YXIgcHJvY2VzczphbnksXG4gICAgRG9jdW1lbnRUb3VjaDphbnksXG4gICAgZ2xvYmFsOmFueTtcblxuaW50ZXJmYWNlIE5hdmlnYXRvciB7XG4gICAgaXNDb2Nvb25KUzphbnk7XG4gICAgdmlicmF0ZShwYXR0ZXJuOiBudW1iZXIgfCBudW1iZXJbXSk6Ym9vbGVhbjtcbiAgICBnZXRHYW1lcGFkcygpOmFueTtcbiAgICB3ZWJraXRHZXRHYW1lcGFkcygpOmFueTtcbn1cblxuaW50ZXJmYWNlIFdpbmRvdyB7XG4gICAgZWplY3RhOmFueTtcbiAgICBjb3Jkb3ZhOmFueTtcbiAgICBBdWRpbygpOkhUTUxBdWRpb0VsZW1lbnQ7XG4gICAgQXVkaW9Db250ZXh0KCk6YW55O1xuICAgIHdlYmtpdEF1ZGlvQ29udGV4dCgpOmFueTtcbn1cblxuaW50ZXJmYWNlIGZ1bGxTY3JlZW5EYXRhIHtcbiAgICBuYW1lOnN0cmluZztcbn1cblxuaW50ZXJmYWNlIERvY3VtZW50IHtcbiAgICBjYW5jZWxGdWxsU2NyZWVuKCk6ZnVsbFNjcmVlbkRhdGEgO1xuICAgIGV4aXRGdWxsU2NyZWVuKCk6ZnVsbFNjcmVlbkRhdGEgO1xuICAgIHdlYmtpdENhbmNlbEZ1bGxTY3JlZW4oKTpmdWxsU2NyZWVuRGF0YSA7XG4gICAgbXNDYW5jZWxGdWxsU2NyZWVuKCk6ZnVsbFNjcmVlbkRhdGEgO1xuICAgIG1vekNhbmNlbEZ1bGxTY3JlZW4oKTpmdWxsU2NyZWVuRGF0YSA7XG4gICAgd2Via2l0SGlkZGVuOmFueTtcbiAgICBtb3pIaWRkZW46YW55O1xufVxuXG5pbnRlcmZhY2UgSFRNTERpdkVsZW1lbnQge1xuICAgIHJlcXVlc3RGdWxsc2NyZWVuKCk6ZnVsbFNjcmVlbkRhdGEgO1xuICAgIHdlYmtpdFJlcXVlc3RGdWxsU2NyZWVuKCk6ZnVsbFNjcmVlbkRhdGEgO1xuICAgIG1zUmVxdWVzdEZ1bGxTY3JlZW4oKTpmdWxsU2NyZWVuRGF0YSA7XG4gICAgbW96UmVxdWVzdEZ1bGxTY3JlZW4oKTpmdWxsU2NyZWVuRGF0YSA7XG59IiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vZGVmcy9waXhpLmpzLmQudHNcIiAvPlxubW9kdWxlIFBJWEkge1xuICAgIGV4cG9ydCBjbGFzcyBTY2VuZSBleHRlbmRzIENvbnRhaW5lciB7XG4gICAgICAgIGlkOnN0cmluZztcbiAgICAgICAgc3RhdGljIF9pZExlbjpudW1iZXIgPSAwO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGlkOnN0cmluZyA9IChcInNjZW5lXCIgKyBTY2VuZS5faWRMZW4rKykgKXtcbiAgICAgICAgICAgIHN1cGVyKCk7XG4gICAgICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIH1cblxuICAgICAgICBhZGRUbyhnYW1lOkdhbWV8Q29udGFpbmVyKTpTY2VuZSB7XG4gICAgICAgICAgICBpZihnYW1lIGluc3RhbmNlb2YgR2FtZSl7XG4gICAgICAgICAgICAgICAgPEdhbWU+Z2FtZS5hZGRTY2VuZSh0aGlzKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignU2NlbmVzIGNhbiBvbmx5IGJlIGFkZGVkIHRvIHRoZSBnYW1lJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgIH1cbn0iLCJtb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IGNsYXNzIElucHV0TWFuYWdlcntcbiAgICAgICAgZ2FtZTpHYW1lO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGdhbWU6IEdhbWUpe1xuICAgICAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9kZWZzL3BpeGkuanMuZC50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuL0RldmljZS50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9kaXNwbGF5L1NjZW5lLnRzXCIgLz5cbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL2F1ZGlvL0F1ZGlvTWFuYWdlci50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9pbnB1dC9JbnB1dE1hbmFnZXIudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi9EYXRhTWFuYWdlci50c1wiIC8+XG5tb2R1bGUgUElYSSB7XG4gICAgdmFyIGxhc3Q6bnVtYmVyID0gMDtcbiAgICB2YXIgbWF4RnJhbWVNUyA9IDAuMzU7XG5cbiAgICB2YXIgZGVmYXVsdEdhbWVDb25maWcgOiBHYW1lQ29uZmlnID0ge1xuICAgICAgICBpZDogXCJwaXhpLmRlZmF1bHQuaWRcIixcbiAgICAgICAgd2lkdGg6ODAwLFxuICAgICAgICBoZWlnaHQ6NjAwLFxuICAgICAgICB1c2VXZWJBdWRpbzogdHJ1ZSxcbiAgICAgICAgdXNlUGVyc2lzdGFudERhdGE6IGZhbHNlLFxuICAgICAgICBnYW1lU2NhbGVUeXBlOiBHQU1FX1NDQUxFX1RZUEUuTk9ORSxcbiAgICAgICAgc3RvcEF0TG9zdEZvY3VzOiB0cnVlLFxuICAgICAgICBhc3NldHNVcmw6IFwiXCIsXG4gICAgICAgIGxvYWRlckNvbmN1cnJlbmN5OiAxMFxuICAgIH07XG5cbiAgICBleHBvcnQgY2xhc3MgR2FtZSB7XG4gICAgICAgIGlkOnN0cmluZztcbiAgICAgICAgcmFmOmFueTtcblxuICAgICAgICBwcml2YXRlIF9zY2VuZXM6U2NlbmVbXSA9IFtdO1xuICAgICAgICBzY2VuZTpTY2VuZTtcblxuICAgICAgICBhdWRpbzpBdWRpb01hbmFnZXI7XG4gICAgICAgIGlucHV0OklucHV0TWFuYWdlcjtcbiAgICAgICAgZGF0YTpEYXRhTWFuYWdlcjtcbiAgICAgICAgbG9hZGVyOmxvYWRlcnMuTG9hZGVyO1xuXG4gICAgICAgIHJlbmRlcmVyOldlYkdMUmVuZGVyZXIgfCBDYW52YXNSZW5kZXJlcjtcbiAgICAgICAgY2FudmFzOkhUTUxDYW52YXNFbGVtZW50O1xuXG4gICAgICAgIGRlbHRhOm51bWJlciA9IDA7XG4gICAgICAgIHRpbWU6bnVtYmVyID0gMDtcbiAgICAgICAgbGFzdFRpbWU6bnVtYmVyID0gMDtcblxuICAgICAgICBpc1dlYkdMOmJvb2xlYW47XG4gICAgICAgIGlzV2ViQXVkaW86Ym9vbGVhbjtcblxuICAgICAgICBwcml2YXRlIF9yZXNpemVMaXN0ZW5lcjphbnk7XG5cbiAgICAgICAgY29uc3RydWN0b3IoY29uZmlnPzpHYW1lQ29uZmlnLCByZW5kZXJlck9wdGlvbnM/OlJlbmRlcmVyT3B0aW9ucykge1xuICAgICAgICAgICAgY29uZmlnID0gKDxPYmplY3Q+T2JqZWN0KS5hc3NpZ24oZGVmYXVsdEdhbWVDb25maWcsIGNvbmZpZyk7XG4gICAgICAgICAgICB0aGlzLmlkID0gY29uZmlnLmlkO1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJlciA9IGF1dG9EZXRlY3RSZW5kZXJlcihjb25maWcud2lkdGgsIGNvbmZpZy5oZWlnaHQsIHJlbmRlcmVyT3B0aW9ucyk7XG4gICAgICAgICAgICB0aGlzLmNhbnZhcyA9IHRoaXMucmVuZGVyZXIudmlldztcblxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XG5cbiAgICAgICAgICAgIHRoaXMuaXNXZWJHTCA9ICh0aGlzLnJlbmRlcmVyLnR5cGUgPT09IFJFTkRFUkVSX1RZUEUuV0VCR0wpO1xuICAgICAgICAgICAgdGhpcy5pc1dlYkF1ZGlvID0gKERldmljZS5oYXNXZWJBdWRpbyYmY29uZmlnLnVzZVdlYkF1ZGlvKTtcblxuICAgICAgICAgICAgdGhpcy5pbnB1dCA9IG5ldyBJbnB1dE1hbmFnZXIodGhpcyk7XG4gICAgICAgICAgICB0aGlzLmF1ZGlvID0gbmV3IEF1ZGlvTWFuYWdlcih0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IG5ldyBEYXRhTWFuYWdlcih0aGlzLCBjb25maWcudXNlUGVyc2lzdGFudERhdGEpO1xuICAgICAgICAgICAgdGhpcy5sb2FkZXIgPSBuZXcgbG9hZGVycy5Mb2FkZXIoY29uZmlnLmFzc2V0c1VybCwgY29uZmlnLmxvYWRlckNvbmN1cnJlbmN5KTtcblxuICAgICAgICAgICAgdmFyIGluaXRpYWxTY2VuZTpTY2VuZSA9IG5ldyBTY2VuZSgnaW5pdGlhbCcpLmFkZFRvKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5zZXRTY2VuZShpbml0aWFsU2NlbmUpO1xuXG4gICAgICAgICAgICBpZihjb25maWcuZ2FtZVNjYWxlVHlwZSAhPT0gR0FNRV9TQ0FMRV9UWVBFLk5PTkUpe1xuICAgICAgICAgICAgICAgIHRoaXMuYXV0b1Jlc2l6ZShjb25maWcuZ2FtZVNjYWxlVHlwZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKGNvbmZpZy5zdG9wQXRMb3N0Rm9jdXMpe1xuICAgICAgICAgICAgICAgIHRoaXMuZW5hYmxlU3RvcEF0TG9zdEZvY3VzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9hbmltYXRlKCk6dm9pZCB7XG4gICAgICAgICAgICB0aGlzLnJhZiA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5fYW5pbWF0ZS5iaW5kKHRoaXMpKTtcblxuICAgICAgICAgICAgaWYodGhpcy5zY2VuZSkge1xuICAgICAgICAgICAgICAgIHZhciBub3c6bnVtYmVyID0gRGF0ZS5ub3coKTtcblxuICAgICAgICAgICAgICAgIHRoaXMudGltZSArPSBNYXRoLm1pbigobm93IC0gbGFzdCkgLyAxMDAwLCBtYXhGcmFtZU1TKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRlbHRhID0gdGhpcy50aW1lIC0gdGhpcy5sYXN0VGltZTtcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RUaW1lID0gdGhpcy50aW1lO1xuXG4gICAgICAgICAgICAgICAgbGFzdCA9IG5vdztcblxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIucmVuZGVyKHRoaXMuc2NlbmUpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGUodGhpcy5kZWx0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB1cGRhdGUoZGVsdGFUaW1lOm51bWJlcik6R2FtZSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc2NlbmUuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNjZW5lLmNoaWxkcmVuW2ldLnVwZGF0ZSh0aGlzLmRlbHRhKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9jbGVhbiBraWxsZWQgb2JqZWN0c1xuICAgICAgICAgICAgdmFyIGxlbjpudW1iZXIgPSBDb250YWluZXIuX2tpbGxlZE9iamVjdHMubGVuZ3RoO1xuICAgICAgICAgICAgaWYgKGxlbikge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGk6bnVtYmVyID0gMDsgaSA8IGxlbjsgaSsrKSBDb250YWluZXIuX2tpbGxlZE9iamVjdHNbaV0ucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgQ29udGFpbmVyLl9raWxsZWRPYmplY3RzLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhcnQoKTpHYW1lIHtcbiAgICAgICAgICAgIGxhc3QgPSBEYXRlLm5vdygpO1xuICAgICAgICAgICAgdGhpcy5fYW5pbWF0ZSgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBzdG9wKCk6R2FtZSB7XG4gICAgICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5yYWYpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBlbmFibGVTdG9wQXRMb3N0Rm9jdXMoc3RhdGU6Ym9vbGVhbiA9IHRydWUpOkdhbWV7XG4gICAgICAgICAgICBpZihzdGF0ZSl7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihEZXZpY2UuZ2V0VmlzaWJpbGl0eUNoYW5nZUV2ZW50KCksIHRoaXMuX29uVmlzaWJpbGl0eUNoYW5nZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoRGV2aWNlLmdldFZpc2liaWxpdHlDaGFuZ2VFdmVudCgpLCB0aGlzLl9vblZpc2liaWxpdHlDaGFuZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBkaXNhYmxlU3RvcEF0TG9zdEZvY3VzKCk6R2FtZXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVuYWJsZVN0b3BBdExvc3RGb2N1cyhmYWxzZSk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9vblZpc2liaWxpdHlDaGFuZ2UoKXtcbiAgICAgICAgICAgIHZhciBpc0hpZGUgPSAhIShkb2N1bWVudC5oaWRkZW4gfHwgZG9jdW1lbnQud2Via2l0SGlkZGVuIHx8IGRvY3VtZW50Lm1vekhpZGRlbiB8fCBkb2N1bWVudC5tc0hpZGRlbik7XG4gICAgICAgICAgICBpZihpc0hpZGUpe1xuICAgICAgICAgICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLm9uTG9zdEZvY3VzKGlzSGlkZSk7XG4gICAgICAgIH1cblxuICAgICAgICBvbkxvc3RGb2N1cyhpc0hpZGU6Ym9vbGVhbik6R2FtZXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0U2NlbmUoc2NlbmU6U2NlbmUgfCBzdHJpbmcpOkdhbWUge1xuICAgICAgICAgICAgaWYoIShzY2VuZSBpbnN0YW5jZW9mIFNjZW5lKSl7XG4gICAgICAgICAgICAgICAgc2NlbmUgPSB0aGlzLmdldFNjZW5lKDxzdHJpbmc+c2NlbmUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnNjZW5lID0gPFNjZW5lPnNjZW5lO1xuICAgICAgICAgICAgdGhpcy5zY2VuZS5wb3NpdGlvbi5zZXQodGhpcy53aWR0aC8yLCB0aGlzLmhlaWdodC8yKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0U2NlbmUoaWQ6c3RyaW5nKTpTY2VuZXtcbiAgICAgICAgICAgIHZhciBzY2VuZTpTY2VuZSA9IG51bGw7XG4gICAgICAgICAgICBmb3IodmFyIGk6bnVtYmVyID0gMDsgaSA8IHRoaXMuX3NjZW5lcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5fc2NlbmVzW2ldLmlkID09PSBpZCl7XG4gICAgICAgICAgICAgICAgICAgIHNjZW5lID0gdGhpcy5fc2NlbmVzW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHNjZW5lO1xuICAgICAgICB9XG5cbiAgICAgICAgY3JlYXRlU2NlbmUoaWQ/OnN0cmluZyk6U2NlbmUge1xuICAgICAgICAgICAgcmV0dXJuIChuZXcgU2NlbmUoaWQpKS5hZGRUbyh0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZVNjZW5lKHNjZW5lOnN0cmluZyB8IFNjZW5lKTpHYW1le1xuICAgICAgICAgICAgaWYodHlwZW9mIHNjZW5lID09PSBcInN0cmluZ1wiKXtcbiAgICAgICAgICAgICAgICBzY2VuZSA9IHRoaXMuZ2V0U2NlbmUoPHN0cmluZz5zY2VuZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBpbmRleDpudW1iZXIgPSB0aGlzLl9zY2VuZXMuaW5kZXhPZig8U2NlbmU+c2NlbmUpO1xuICAgICAgICAgICAgaWYoaW5kZXggIT09IC0xKXtcbiAgICAgICAgICAgICAgICB0aGlzLl9zY2VuZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBhZGRTY2VuZShzY2VuZTpTY2VuZSk6R2FtZSB7XG4gICAgICAgICAgICB0aGlzLl9zY2VuZXMucHVzaChzY2VuZSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZUFsbFNjZW5lcygpOkdhbWV7XG4gICAgICAgICAgICB0aGlzLl9zY2VuZXMubGVuZ3RoID0gMDtcbiAgICAgICAgICAgIHRoaXMuc2NlbmUgPSBudWxsO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICByZXNpemUod2lkdGg6bnVtYmVyLCBoZWlnaHQ6bnVtYmVyLCByZW5kZXJlcjpib29sZWFuID0gZmFsc2UpOkdhbWV7XG4gICAgICAgICAgICBpZihyZW5kZXJlcil7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5yZXNpemUod2lkdGgsIGhlaWdodCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLndpZHRoID0gd2lkdGggKyBcInB4XCI7XG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyBcInB4XCI7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgYXV0b1Jlc2l6ZShtb2RlOm51bWJlcik6R2FtZSB7XG4gICAgICAgICAgICBpZih0aGlzLl9yZXNpemVMaXN0ZW5lcil7XG4gICAgICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX3Jlc2l6ZUxpc3RlbmVyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYobW9kZSA9PT0gR0FNRV9TQ0FMRV9UWVBFLk5PTkUpcmV0dXJuO1xuXG4gICAgICAgICAgICBzd2l0Y2gobW9kZSl7XG4gICAgICAgICAgICAgICAgY2FzZSBHQU1FX1NDQUxFX1RZUEUuQVNQRUNUX0ZJVDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVzaXplTGlzdGVuZXIgPSB0aGlzLl9yZXNpemVNb2RlQXNwZWN0Rml0O1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIEdBTUVfU0NBTEVfVFlQRS5BU1BFQ1RfRklMTDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVzaXplTGlzdGVuZXIgPSB0aGlzLl9yZXNpemVNb2RlQXNwZWN0RmlsbDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBHQU1FX1NDQUxFX1RZUEUuRklMTDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVzaXplTGlzdGVuZXIgPSB0aGlzLl9yZXNpemVNb2RlRmlsbDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl9yZXNpemVMaXN0ZW5lci5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIHRoaXMuX3Jlc2l6ZUxpc3RlbmVyKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX3Jlc2l6ZU1vZGVBc3BlY3RGaXQoKTp2b2lke1xuICAgICAgICAgICAgdmFyIHd3Om51bWJlciA9IHBhcnNlSW50KHRoaXMuY2FudmFzLnN0eWxlLndpZHRoLCAxMCkgfHwgdGhpcy5jYW52YXMud2lkdGg7XG4gICAgICAgICAgICB2YXIgaGg6bnVtYmVyID0gcGFyc2VJbnQodGhpcy5jYW52YXMuc3R5bGUuaGVpZ2h0LCAxMCkgfHwgdGhpcy5jYW52YXMuaGVpZ2h0O1xuICAgICAgICAgICAgaWYod2luZG93LmlubmVyV2lkdGggIT09IHd3IHx8IHdpbmRvdy5pbm5lckhlaWdodCAhPT0gaGgpe1xuICAgICAgICAgICAgICAgIHZhciBzY2FsZTpudW1iZXIgPSBNYXRoLm1pbih3aW5kb3cuaW5uZXJXaWR0aC90aGlzLndpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQvdGhpcy5oZWlnaHQpO1xuICAgICAgICAgICAgICAgIHRoaXMucmVzaXplKHRoaXMud2lkdGgqc2NhbGUsIHRoaXMuaGVpZ2h0KnNjYWxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX3Jlc2l6ZU1vZGVBc3BlY3RGaWxsKCk6dm9pZHtcbiAgICAgICAgICAgIHZhciB3dzpudW1iZXIgPSBwYXJzZUludCh0aGlzLmNhbnZhcy5zdHlsZS53aWR0aCwgMTApIHx8IHRoaXMuY2FudmFzLndpZHRoO1xuICAgICAgICAgICAgdmFyIGhoOm51bWJlciA9IHBhcnNlSW50KHRoaXMuY2FudmFzLnN0eWxlLmhlaWdodCwgMTApIHx8IHRoaXMuY2FudmFzLmhlaWdodDtcbiAgICAgICAgICAgIGlmKHdpbmRvdy5pbm5lcldpZHRoICE9PSB3dyB8fCB3aW5kb3cuaW5uZXJIZWlnaHQgIT09IGhoKXtcbiAgICAgICAgICAgICAgICB2YXIgc2NhbGU6bnVtYmVyID0gTWF0aC5tYXgod2luZG93LmlubmVyV2lkdGgvdGhpcy53aWR0aCwgd2luZG93LmlubmVySGVpZ2h0L3RoaXMuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICB2YXIgd2lkdGg6bnVtYmVyID0gdGhpcy53aWR0aCpzY2FsZTtcbiAgICAgICAgICAgICAgICB2YXIgaGVpZ2h0Om51bWJlciA9IHRoaXMuaGVpZ2h0KnNjYWxlO1xuXG4gICAgICAgICAgICAgICAgdmFyIHRvcE1hcmdpbjpudW1iZXIgPSAod2luZG93LmlubmVySGVpZ2h0LWhlaWdodCkvMjtcbiAgICAgICAgICAgICAgICB2YXIgbGVmdE1hcmdpbjpudW1iZXIgPSAod2luZG93LmlubmVyV2lkdGgtd2lkdGgpLzI7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnJlc2l6ZSh3aWR0aCwgaGVpZ2h0KTtcblxuICAgICAgICAgICAgICAgIHZhciBzdHlsZTphbnkgPSA8YW55PnRoaXMuY2FudmFzLnN0eWxlO1xuICAgICAgICAgICAgICAgIHN0eWxlWydtYXJnaW4tdG9wJ10gPSB0b3BNYXJnaW4gKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgc3R5bGVbJ21hcmdpbi1sZWZ0J10gPSBsZWZ0TWFyZ2luICsgXCJweFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfcmVzaXplTW9kZUZpbGwoKTp2b2lke1xuICAgICAgICAgICAgdmFyIHd3Om51bWJlciA9IHBhcnNlSW50KHRoaXMuY2FudmFzLnN0eWxlLndpZHRoLCAxMCkgfHwgdGhpcy5jYW52YXMud2lkdGg7XG4gICAgICAgICAgICB2YXIgaGg6bnVtYmVyID0gcGFyc2VJbnQodGhpcy5jYW52YXMuc3R5bGUuaGVpZ2h0LCAxMCkgfHwgdGhpcy5jYW52YXMuaGVpZ2h0O1xuICAgICAgICAgICAgaWYod2luZG93LmlubmVyV2lkdGggIT09IHd3IHx8IHdpbmRvdy5pbm5lckhlaWdodCAhPT0gaGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGdldCB3aWR0aCgpOm51bWJlciB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJlci53aWR0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBoZWlnaHQoKTpudW1iZXIge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyZXIuaGVpZ2h0O1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIEdhbWVDb25maWcge1xuICAgICAgICBpZD86c3RyaW5nO1xuICAgICAgICB3aWR0aD86bnVtYmVyO1xuICAgICAgICBoZWlnaHQ/Om51bWJlcjtcbiAgICAgICAgdXNlV2ViQXVkaW8/OmJvb2xlYW47XG4gICAgICAgIHVzZVBlcnNpc3RhbnREYXRhPzpib29sZWFuO1xuICAgICAgICBnYW1lU2NhbGVUeXBlPzpudW1iZXI7XG4gICAgICAgIHN0b3BBdExvc3RGb2N1cz86Ym9vbGVhbjtcbiAgICAgICAgYXNzZXRzVXJsPzpzdHJpbmc7XG4gICAgICAgIGxvYWRlckNvbmN1cnJlbmN5PzpudW1iZXI7XG4gICAgfVxufVxuXG5pbnRlcmZhY2UgT2JqZWN0IHtcbiAgICBhc3NpZ24odGFyZ2V0Ok9iamVjdCwgLi4uc291cmNlczpPYmplY3RbXSk6T2JqZWN0O1xufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2RlZnMvcGl4aS5qcy5kLnRzXCIgLz5cblxubW9kdWxlIFBJWEkge1xuICAgIENvbnRhaW5lci5fa2lsbGVkT2JqZWN0cyA9IFtdO1xuXG4gICAgQ29udGFpbmVyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihkZWx0YVRpbWU6IG51bWJlcikge1xuICAgICAgICB0aGlzLnBvc2l0aW9uLnggKz0gdGhpcy52ZWxvY2l0eS54ICogZGVsdGFUaW1lO1xuICAgICAgICB0aGlzLnBvc2l0aW9uLnkgKz0gdGhpcy52ZWxvY2l0eS55ICogZGVsdGFUaW1lO1xuICAgICAgICB0aGlzLnJvdGF0aW9uICs9IHRoaXMucm90YXRpb25TcGVlZCAqIGRlbHRhVGltZTtcblxuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuW2ldLnVwZGF0ZShkZWx0YVRpbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIENvbnRhaW5lci5wcm90b3R5cGUuYWRkVG8gPSBmdW5jdGlvbihwYXJlbnQpe1xuICAgICAgICBwYXJlbnQuYWRkQ2hpbGQodGhpcyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBDb250YWluZXIucHJvdG90eXBlLmtpbGwgPSBmdW5jdGlvbigpe1xuICAgICAgICBQSVhJLkNvbnRhaW5lci5fa2lsbGVkT2JqZWN0cy5wdXNoKHRoaXMpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgQ29udGFpbmVyLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbigpe1xuICAgICAgICBpZih0aGlzLnBhcmVudCl7XG4gICAgICAgICAgICB0aGlzLnBhcmVudC5yZW1vdmVDaGlsZCh0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9kZWZzL3BpeGkuanMuZC50c1wiIC8+XG5cbm1vZHVsZSBQSVhJIHtcbiAgICBEaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5zcGVlZCA9IDA7XG4gICAgRGlzcGxheU9iamVjdC5wcm90b3R5cGUudmVsb2NpdHkgPSBuZXcgUG9pbnQoKTtcbiAgICBEaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5kaXJlY3Rpb24gPSAwO1xuICAgIERpc3BsYXlPYmplY3QucHJvdG90eXBlLnJvdGF0aW9uU3BlZWQgPSAwO1xuXG4gICAgRGlzcGxheU9iamVjdC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oZGVsdGFUaW1lOm51bWJlcil7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG59XG4iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9kZWZzL3BpeGkuanMuZC50c1wiIC8+XG5tb2R1bGUgUElYSSB7XG4gICAgbG9hZGVycy5Mb2FkZXIuYWRkUGl4aU1pZGRsZXdhcmUoZnVuY3Rpb24oKXtcbiAgICAgICAgY29uc29sZS5sb2coJycpXG4gICAgfSk7XG59Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
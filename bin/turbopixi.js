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
            get isOnline() {
                return window.navigator.onLine;
            }
        };
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
        var minFrameMS = 20;
        var defaultGameConfig = {
            id: 'pixi.default.id',
            width: 800,
            height: 600,
            useWebAudio: true,
            usePersistantData: false,
            gameScaleType: PIXI.GAME_SCALE_TYPE.NONE
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
            }
            Game.prototype._animate = function () {
                this.raf = window.requestAnimationFrame(this._animate.bind(this));
                var now = Date.now();
                this.time += Math.min((now - last) / 1000, minFrameMS);
                this.delta = this.time - this.lastTime;
                this.lastTime = this.time;
                last = now;
                this.renderer.render(this.scene);
                this.update(this.delta);
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
                this._animate();
                return this;
            };
            Game.prototype.stop = function () {
                window.cancelAnimationFrame(this.raf);
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
            Game.prototype.addScene = function (scene) {
                this._scenes.push(scene);
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
}(typeof PIXI === 'object' ? PIXI : null));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInR1cmJvcGl4aS5qcyIsImluZGV4LnRzIiwiYXVkaW8vQXVkaW9NYW5hZ2VyLnRzIiwiZGlzcGxheS9Db250YWluZXIudHMiLCJkaXNwbGF5L0Rpc3BsYXlPYmplY3QudHMiLCJkaXNwbGF5L1NjZW5lLnRzIiwiY29yZS9EYXRhTWFuYWdlci50cyIsImNvcmUvRGV2aWNlLnRzIiwiaW5wdXQvSW5wdXRNYW5hZ2VyLnRzIiwiY29yZS9HYW1lLnRzIl0sIm5hbWVzIjpbIlBJWEkiLCJFcnJvciIsIlBJWElfVkVSU0lPTl9SRVFVSVJFRCIsIlBJWElfVkVSU0lPTiIsIlZFUlNJT04iLCJtYXRjaCIsIlBJWEkuR0FNRV9TQ0FMRV9UWVBFIiwiUElYSS5BVURJT19UWVBFIiwiUElYSS5BdWRpb01hbmFnZXIiLCJQSVhJLkF1ZGlvTWFuYWdlci5jb25zdHJ1Y3RvciIsInBvc2l0aW9uIiwieCIsInZlbG9jaXR5IiwiZGVsdGFUaW1lIiwieSIsInJvdGF0aW9uIiwicm90YXRpb25TcGVlZCIsImkiLCJjaGlsZHJlbiIsImxlbmd0aCIsInVwZGF0ZSIsInBhcmVudCIsImFkZENoaWxkIiwiQ29udGFpbmVyIiwiX2tpbGxlZE9iamVjdHMiLCJwdXNoIiwicmVtb3ZlQ2hpbGQiLCJfX2V4dGVuZHMiLCJkIiwiYiIsInAiLCJoYXNPd25Qcm9wZXJ0eSIsIl9fIiwiY29uc3RydWN0b3IiLCJwcm90b3R5cGUiLCJQSVhJLlNjZW5lIiwiUElYSS5TY2VuZS5jb25zdHJ1Y3RvciIsIlBJWEkuU2NlbmUuYWRkVG8iLCJQSVhJLkRhdGFNYW5hZ2VyIiwiUElYSS5EYXRhTWFuYWdlci5jb25zdHJ1Y3RvciIsIlBJWEkuRGF0YU1hbmFnZXIubG9hZCIsIlBJWEkuRGF0YU1hbmFnZXIuc2F2ZSIsIlBJWEkuRGF0YU1hbmFnZXIucmVzZXQiLCJQSVhJLkRhdGFNYW5hZ2VyLnNldCIsIlBJWEkuRGF0YU1hbmFnZXIuZ2V0IiwiUElYSS5EYXRhTWFuYWdlci5kZWwiLCJoYXNNb3VzZVdoZWVsIiwiZXZ0Iiwid2luZG93IiwiaGFzVmlicmF0ZSIsIm5hdmlnYXRvciIsInZpYnJhdGUiLCJwYXR0ZXJuIiwiUElYSS5pc09ubGluZSIsIlBJWEkuSW5wdXRNYW5hZ2VyIiwiUElYSS5JbnB1dE1hbmFnZXIuY29uc3RydWN0b3IiLCJQSVhJLkdhbWUiLCJQSVhJLkdhbWUuY29uc3RydWN0b3IiLCJQSVhJLkdhbWUuX2FuaW1hdGUiLCJQSVhJLkdhbWUudXBkYXRlIiwiUElYSS5HYW1lLnN0YXJ0IiwiUElYSS5HYW1lLnN0b3AiLCJQSVhJLkdhbWUuc2V0U2NlbmUiLCJQSVhJLkdhbWUuZ2V0U2NlbmUiLCJQSVhJLkdhbWUuYWRkU2NlbmUiLCJQSVhJLkdhbWUucmVzaXplIiwiUElYSS5HYW1lLmF1dG9SZXNpemUiLCJQSVhJLkdhbWUuX3Jlc2l6ZU1vZGVBc3BlY3RGaXQiLCJQSVhJLkdhbWUuX3Jlc2l6ZU1vZGVBc3BlY3RGaWxsIiwiUElYSS5HYW1lLl9yZXNpemVNb2RlRmlsbCIsImdldCIsIlBJWEkuR2FtZS53aWR0aCIsImVudW1lcmFibGUiLCJjb25maWd1cmFibGUiLCJQSVhJLkdhbWUuaGVpZ2h0Il0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtJQ0xBLElBQUcsQ0FBQ0EsSUFBSixFQUFTO0FBQUEsUUFDTCxNQUFNLElBQUlDLEtBQUosQ0FBVSx3QkFBVixDQUFOLENBREs7QUFBQTtJQUlULElBQU1DLHFCQUFBLEdBQXdCLE9BQTlCO0lBQ0EsSUFBTUMsWUFBQSxHQUFlSCxJQUFBLENBQUtJLE9BQUwsQ0FBYUMsS0FBYixDQUFtQixVQUFuQixFQUErQixDQUEvQixDQUFyQjtJQUVBLElBQUdGLFlBQUEsR0FBZUQscUJBQWxCLEVBQXdDO0FBQUEsUUFDcEMsTUFBTSxJQUFJRCxLQUFKLENBQVUsY0FBY0QsSUFBQSxDQUFLSSxPQUFuQixHQUE2QixvQ0FBN0IsR0FBbUVGLHFCQUE3RSxDQUFOLENBRG9DO0FBQUE7SUFJeEMsSUFBT0YsSUFBUDtJ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QU9BLFVBQW5CQSxFQUErQkEsTUFBQUEsQ0FBT0EsV0FBdENBLEVBRHNEQTtBQUFBQSxpQkFIOURiO0FBQUFBLGFBQVFBLENBaExaeEQ7QUFBQUEsWUF3TEl3RCxNQUFBQSxDQUFBQSxjQUFBQSxDQUFJQSxJQUFBQSxDQUFBQSxTQUFKQSxFQUFJQSxPQUFKQSxFQUFTQTtBQUFBQSxnQlR1TkxjLEdBQUEsRVN2TkpkLFlBQUFBO0FBQUFBLG9CQUNJZSxPQUFPQSxLQUFLQSxRQUFMQSxDQUFjQSxLQUFyQkEsQ0FESmY7QUFBQUEsaUJBQVNBO0FBQUFBLGdCVDBOTGdCLFVBQUEsRUFBWSxJUzFOUGhCO0FBQUFBLGdCVDJOTGlCLFlBQUEsRUFBYyxJUzNOVGpCO0FBQUFBLGFBQVRBLEVBeExKeEQ7QUFBQUEsWUE0TEl3RCxNQUFBQSxDQUFBQSxjQUFBQSxDQUFJQSxJQUFBQSxDQUFBQSxTQUFKQSxFQUFJQSxRQUFKQSxFQUFVQTtBQUFBQSxnQlQwTk5jLEdBQUEsRVMxTkpkLFlBQUFBO0FBQUFBLG9CQUNJa0IsT0FBT0EsS0FBS0EsUUFBTEEsQ0FBY0EsTUFBckJBLENBREpsQjtBQUFBQSxpQkFBVUE7QUFBQUEsZ0JUNk5OZ0IsVUFBQSxFQUFZLElTN05OaEI7QUFBQUEsZ0JUOE5OaUIsWUFBQSxFQUFjLElTOU5SakI7QUFBQUEsYUFBVkEsRUE1TEp4RDtBQUFBQSxZQWdNQXdELE9BQUFBLElBQUFBLENBaE1BeEQ7QUFBQUEsU0FBQUEsRUFBQUEsQ0FiUTtBQUFBLFFBYUtBLElBQUFBLENBQUFBLElBQUFBLEdBQUlBLElBQUpBLENBYkw7QUFBQSxLQUFaLENBQU9BLElBQUEsSUFBQSxDQUFBQSxJQUFBLEdBQUksRUFBSixDQUFQIiwiZmlsZSI6InR1cmJvcGl4aS5qcyIsInNvdXJjZXNDb250ZW50IjpbbnVsbCwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vZGVmcy9waXhpLmpzLmQudHNcIiAvPlxuaWYoIVBJWEkpe1xuICAgIHRocm93IG5ldyBFcnJvcignRXkhIFdoZXJlIGlzIHBpeGkuanM/PycpO1xufVxuXG5jb25zdCBQSVhJX1ZFUlNJT05fUkVRVUlSRUQgPSBcIjMuMC43XCI7XG5jb25zdCBQSVhJX1ZFUlNJT04gPSBQSVhJLlZFUlNJT04ubWF0Y2goL1xcZC5cXGQuXFxkLylbMF07XG5cbmlmKFBJWElfVkVSU0lPTiA8IFBJWElfVkVSU0lPTl9SRVFVSVJFRCl7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiUGl4aS5qcyB2XCIgKyBQSVhJLlZFUlNJT04gKyBcIiBpdCdzIG5vdCBzdXBwb3J0ZWQsIHBsZWFzZSB1c2UgXlwiICsgUElYSV9WRVJTSU9OX1JFUVVJUkVEKTtcbn1cblxubW9kdWxlIFBJWEkge1xuICAgIGV4cG9ydCBlbnVtIEdBTUVfU0NBTEVfVFlQRSB7XG4gICAgICAgIE5PTkUsXG4gICAgICAgIEZJTEwsXG4gICAgICAgIEFTUEVDVF9GSVQsXG4gICAgICAgIEFTUEVDVF9GSUxMXG4gICAgfVxuXG4gICAgZXhwb3J0IGVudW0gQVVESU9fVFlQRSB7XG4gICAgICAgIFVOS05PV04sXG4gICAgICAgIFdFQkFVRElPLFxuICAgICAgICBIVE1MQVVESU9cbiAgICB9XG59XG4iLCJtb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IGNsYXNzIEF1ZGlvTWFuYWdlcntcbiAgICAgICAgZ2FtZTpHYW1lO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGdhbWU6IEdhbWUpe1xuICAgICAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9kZWZzL3BpeGkuanMuZC50c1wiIC8+XG5cbm1vZHVsZSBQSVhJIHtcbiAgICBDb250YWluZXIuX2tpbGxlZE9iamVjdHMgPSBbXTtcblxuICAgIENvbnRhaW5lci5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oZGVsdGFUaW1lOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5wb3NpdGlvbi54ICs9IHRoaXMudmVsb2NpdHkueCAqIGRlbHRhVGltZTtcbiAgICAgICAgdGhpcy5wb3NpdGlvbi55ICs9IHRoaXMudmVsb2NpdHkueSAqIGRlbHRhVGltZTtcbiAgICAgICAgdGhpcy5yb3RhdGlvbiArPSB0aGlzLnJvdGF0aW9uU3BlZWQgKiBkZWx0YVRpbWU7XG5cbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbltpXS51cGRhdGUoZGVsdGFUaW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBDb250YWluZXIucHJvdG90eXBlLmFkZFRvID0gZnVuY3Rpb24ocGFyZW50KXtcbiAgICAgICAgcGFyZW50LmFkZENoaWxkKHRoaXMpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgQ29udGFpbmVyLnByb3RvdHlwZS5raWxsID0gZnVuY3Rpb24oKXtcbiAgICAgICAgUElYSS5Db250YWluZXIuX2tpbGxlZE9iamVjdHMucHVzaCh0aGlzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIENvbnRhaW5lci5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgaWYodGhpcy5wYXJlbnQpe1xuICAgICAgICAgICAgdGhpcy5wYXJlbnQucmVtb3ZlQ2hpbGQodGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG59IiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vZGVmcy9waXhpLmpzLmQudHNcIiAvPlxuXG5tb2R1bGUgUElYSSB7XG4gICAgRGlzcGxheU9iamVjdC5wcm90b3R5cGUuc3BlZWQgPSAwO1xuICAgIERpc3BsYXlPYmplY3QucHJvdG90eXBlLnZlbG9jaXR5ID0gbmV3IFBvaW50KCk7XG4gICAgRGlzcGxheU9iamVjdC5wcm90b3R5cGUuZGlyZWN0aW9uID0gMDtcbiAgICBEaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5yb3RhdGlvblNwZWVkID0gMDtcblxuICAgIERpc3BsYXlPYmplY3QucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKGRlbHRhVGltZTpudW1iZXIpe1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xufVxuIiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vZGVmcy9waXhpLmpzLmQudHNcIiAvPlxubW9kdWxlIFBJWEkge1xuICAgIGV4cG9ydCBjbGFzcyBTY2VuZSBleHRlbmRzIENvbnRhaW5lciB7XG4gICAgICAgIGlkOnN0cmluZztcbiAgICAgICAgc3RhdGljIF9pZExlbjpudW1iZXIgPSAwO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGlkOnN0cmluZyA9IChcInNjZW5lXCIgKyBTY2VuZS5faWRMZW4rKykgKXtcbiAgICAgICAgICAgIHN1cGVyKCk7XG4gICAgICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIH1cblxuICAgICAgICBhZGRUbyhnYW1lOkdhbWV8Q29udGFpbmVyKTpTY2VuZSB7XG4gICAgICAgICAgICBpZihnYW1lIGluc3RhbmNlb2YgR2FtZSl7XG4gICAgICAgICAgICAgICAgPEdhbWU+Z2FtZS5hZGRTY2VuZSh0aGlzKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignU2NlbmVzIGNhbiBvbmx5IGJlIGFkZGVkIHRvIHRoZSBnYW1lJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgIH1cbn0iLCJtb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IGNsYXNzIERhdGFNYW5hZ2Vye1xuICAgICAgICBnYW1lOkdhbWU7XG4gICAgICAgIHVzZVBlcnNpc3RhbnREYXRhOmJvb2xlYW47XG5cbiAgICAgICAgcHJpdmF0ZSBfZGF0YTphbnk7XG5cbiAgICAgICAgY29uc3RydWN0b3IoZ2FtZTpHYW1lLCB1c2VQZXJzaXRhbnREYXRhOmJvb2xlYW4gPSBmYWxzZSl7XG4gICAgICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICAgICAgdGhpcy51c2VQZXJzaXN0YW50RGF0YSA9IHVzZVBlcnNpdGFudERhdGE7XG4gICAgICAgICAgICB0aGlzLmxvYWQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxvYWQoKTpEYXRhTWFuYWdlcntcbiAgICAgICAgICAgIHRoaXMuX2RhdGEgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMuZ2FtZS5pZCkpIHx8IHt9O1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBzYXZlKCk6RGF0YU1hbmFnZXJ7XG4gICAgICAgICAgICBpZih0aGlzLnVzZVBlcnNpc3RhbnREYXRhKXtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLmdhbWUuaWQsIEpTT04uc3RyaW5naWZ5KHRoaXMuX2RhdGEpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzZXQoKTpEYXRhTWFuYWdlcntcbiAgICAgICAgICAgIHRoaXMuX2RhdGEgPSB7fTtcbiAgICAgICAgICAgIHRoaXMuc2F2ZSgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBzZXQoa2V5OnN0cmluZyB8IE9iamVjdCwgdmFsdWU/OmFueSk6RGF0YU1hbmFnZXJ7XG4gICAgICAgICAgICBpZihPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoa2V5KSA9PT0gXCJbb2JqZWN0IE9iamVjdF1cIil7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLl9kYXRhLCBrZXkpO1xuICAgICAgICAgICAgfWVsc2UgaWYodHlwZW9mIGtleSA9PT0gXCJzdHJpbmdcIil7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGF0YVtrZXldID0gdmFsdWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuc2F2ZSgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQoa2V5PzpzdHJpbmcpOmFueXtcbiAgICAgICAgICAgIGlmKCFrZXkpe1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9kYXRhO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZGF0YVtrZXldO1xuICAgICAgICB9XG5cbiAgICAgICAgZGVsKGtleTpzdHJpbmcpOkRhdGFNYW5hZ2Vye1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2RhdGFba2V5XTtcbiAgICAgICAgICAgIHRoaXMuc2F2ZSgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgIH1cbn0iLCIvL01hbnkgY2hlY2tzIGFyZSBiYXNlZCBvbiBodHRwczovL2dpdGh1Yi5jb20vYXJhc2F0YXNheWdpbi9pcy5qcy9ibG9iL21hc3Rlci9pcy5qc1xuXG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9kZWZzL3BpeGkuanMuZC50c1wiIC8+XG5tb2R1bGUgUElYSSB7XG4gICAgdmFyIG5hdmlnYXRvcjpOYXZpZ2F0b3IgPSB3aW5kb3cubmF2aWdhdG9yO1xuICAgIHZhciBkb2N1bWVudDpEb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcblxuICAgIHZhciB1c2VyQWdlbnQ6c3RyaW5nID0gJ25hdmlnYXRvcicgaW4gd2luZG93ICYmICd1c2VyQWdlbnQnIGluIG5hdmlnYXRvciAmJiBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkgfHwgJycsXG4gICAgICAgIHZlbmRvcjpzdHJpbmcgPSAnbmF2aWdhdG9yJyBpbiB3aW5kb3cgJiYgJ3ZlbmRvcicgaW4gbmF2aWdhdG9yICYmIG5hdmlnYXRvci52ZW5kb3IudG9Mb3dlckNhc2UoKSB8fCAnJyxcbiAgICAgICAgYXBwVmVyc2lvbjpzdHJpbmcgPSAnbmF2aWdhdG9yJyBpbiB3aW5kb3cgJiYgJ2FwcFZlcnNpb24nIGluIG5hdmlnYXRvciAmJiBuYXZpZ2F0b3IuYXBwVmVyc2lvbi50b0xvd2VyQ2FzZSgpIHx8ICcnO1xuXG4gICAgLy9Ccm93c2Vyc1xuICAgIHZhciBpc0Nocm9tZTpib29sZWFuID0gL2Nocm9tZXxjaHJvbWl1bS9pLnRlc3QodXNlckFnZW50KSAmJiAvZ29vZ2xlIGluYy8udGVzdCh2ZW5kb3IpLFxuICAgICAgICBpc0ZpcmVmb3g6Ym9vbGVhbiA9IC9maXJlZm94L2kudGVzdCh1c2VyQWdlbnQpLFxuICAgICAgICBpc0lFOmJvb2xlYW4gPSAvbXNpZS9pLnRlc3QodXNlckFnZW50KSB8fCBcIkFjdGl2ZVhPYmplY3RcIiBpbiB3aW5kb3csXG4gICAgICAgIGlzT3BlcmE6Ym9vbGVhbiA9IC9eT3BlcmFcXC8vLnRlc3QodXNlckFnZW50KSB8fCAvXFx4MjBPUFJcXC8vLnRlc3QodXNlckFnZW50KSxcbiAgICAgICAgaXNTYWZhcmk6Ym9vbGVhbiA9IC9zYWZhcmkvaS50ZXN0KHVzZXJBZ2VudCkgJiYgL2FwcGxlIGNvbXB1dGVyL2kudGVzdCh2ZW5kb3IpO1xuXG4gICAgLy9EZXZpY2VzICYmIE9TXG4gICAgdmFyIGlzSXBob25lOmJvb2xlYW4gPSAvaXBob25lL2kudGVzdCh1c2VyQWdlbnQpLFxuICAgICAgICBpc0lwYWQ6Ym9vbGVhbiA9IC9pcGFkL2kudGVzdCh1c2VyQWdlbnQpLFxuICAgICAgICBpc0lwb2Q6Ym9vbGVhbiA9IC9pcG9kL2kudGVzdCh1c2VyQWdlbnQpLFxuICAgICAgICBpc0FuZHJvaWQ6Ym9vbGVhbiA9IC9hbmRyb2lkL2kudGVzdCh1c2VyQWdlbnQpLFxuICAgICAgICBpc0FuZHJvaWRQaG9uZTpib29sZWFuID0gL2FuZHJvaWQvaS50ZXN0KHVzZXJBZ2VudCkgJiYgL21vYmlsZS9pLnRlc3QodXNlckFnZW50KSxcbiAgICAgICAgaXNBbmRyb2lkVGFibGV0OmJvb2xlYW4gPSAvYW5kcm9pZC9pLnRlc3QodXNlckFnZW50KSAmJiAhL21vYmlsZS9pLnRlc3QodXNlckFnZW50KSxcbiAgICAgICAgaXNMaW51eDpib29sZWFuID0gL2xpbnV4L2kudGVzdChhcHBWZXJzaW9uKSxcbiAgICAgICAgaXNNYWM6Ym9vbGVhbiA9IC9tYWMvaS50ZXN0KGFwcFZlcnNpb24pLFxuICAgICAgICBpc1dpbmRvdzpib29sZWFuID0gL3dpbi9pLnRlc3QoYXBwVmVyc2lvbiksXG4gICAgICAgIGlzV2luZG93UGhvbmU6Ym9vbGVhbiA9IGlzV2luZG93ICYmIC9waG9uZS9pLnRlc3QodXNlckFnZW50KSxcbiAgICAgICAgaXNXaW5kb3dUYWJsZXQ6Ym9vbGVhbiA9IGlzV2luZG93ICYmICFpc1dpbmRvd1Bob25lICYmIC90b3VjaC9pLnRlc3QodXNlckFnZW50KSxcbiAgICAgICAgaXNNb2JpbGU6Ym9vbGVhbiA9IGlzSXBob25lIHx8IGlzSXBvZHx8IGlzQW5kcm9pZFBob25lIHx8IGlzV2luZG93UGhvbmUsXG4gICAgICAgIGlzVGFibGV0OmJvb2xlYW4gPSBpc0lwYWQgfHwgaXNBbmRyb2lkVGFibGV0IHx8IGlzV2luZG93VGFibGV0LFxuICAgICAgICBpc0Rlc2t0b3A6Ym9vbGVhbiA9ICFpc01vYmlsZSAmJiAhaXNUYWJsZXQsXG4gICAgICAgIGlzVG91Y2hEZXZpY2U6Ym9vbGVhbiA9ICdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdyB8fCdEb2N1bWVudFRvdWNoJyBpbiB3aW5kb3cgJiYgZG9jdW1lbnQgaW5zdGFuY2VvZiBEb2N1bWVudFRvdWNoLFxuICAgICAgICBpc0NvY29vbjpib29sZWFuID0gISFuYXZpZ2F0b3IuaXNDb2Nvb25KUyxcbiAgICAgICAgaXNOb2RlV2Via2l0OmJvb2xlYW4gPSAhISh0eXBlb2YgcHJvY2VzcyA9PT0gXCJvYmplY3RcIiAmJiBwcm9jZXNzLnRpdGxlID09PSBcIm5vZGVcIiAmJiB0eXBlb2YgZ2xvYmFsID09PSBcIm9iamVjdFwiKSxcbiAgICAgICAgaXNFamVjdGE6Ym9vbGVhbiA9ICEhd2luZG93LmVqZWN0YSxcbiAgICAgICAgaXNDcm9zc3dhbGs6Ym9vbGVhbiA9IC9Dcm9zc3dhbGsvLnRlc3QodXNlckFnZW50KSxcbiAgICAgICAgaXNDb3Jkb3ZhOmJvb2xlYW4gPSAhIXdpbmRvdy5jb3Jkb3ZhLFxuICAgICAgICBpc0VsZWN0cm9uOmJvb2xlYW4gPSAhISh0eXBlb2YgcHJvY2VzcyA9PT0gXCJvYmplY3RcIiAmJiBwcm9jZXNzLnZlcnNpb25zICYmIChwcm9jZXNzLnZlcnNpb25zLmVsZWN0cm9uIHx8IHByb2Nlc3MudmVyc2lvbnNbJ2F0b20tc2hlbGwnXSkpO1xuXG4gICAgdmFyIGhhc1ZpYnJhdGU6Ym9vbGVhbiA9ICEhbmF2aWdhdG9yLnZpYnJhdGUgJiYgKGlzTW9iaWxlIHx8IGlzVGFibGV0KSxcbiAgICAgICAgaGFzTW91c2VXaGVlbDpib29sZWFuID0gJ29ud2hlZWwnIGluIHdpbmRvdyB8fCAnb25tb3VzZXdoZWVsJyBpbiB3aW5kb3cgfHwgJ01vdXNlU2Nyb2xsRXZlbnQnIGluIHdpbmRvdyxcbiAgICAgICAgaGFzQWNjZWxlcm9tZXRlcjpib29sZWFuID0gJ0RldmljZU1vdGlvbkV2ZW50JyBpbiB3aW5kb3csXG4gICAgICAgIGhhc0dhbWVwYWQ6Ym9vbGVhbiA9ICEhbmF2aWdhdG9yLmdldEdhbWVwYWRzIHx8ICEhbmF2aWdhdG9yLndlYmtpdEdldEdhbWVwYWRzO1xuXG4gICAgLy9GdWxsU2NyZWVuXG4gICAgdmFyIGRpdjpIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHZhciBmdWxsU2NyZWVuUmVxdWVzdDphbnkgPSBkaXYucmVxdWVzdEZ1bGxzY3JlZW4gfHwgZGl2LndlYmtpdFJlcXVlc3RGdWxsU2NyZWVuIHx8IGRpdi5tc1JlcXVlc3RGdWxsU2NyZWVuIHx8IGRpdi5tb3pSZXF1ZXN0RnVsbFNjcmVlbixcbiAgICAgICAgZnVsbFNjcmVlbkNhbmNlbDphbnkgPSBkb2N1bWVudC5jYW5jZWxGdWxsU2NyZWVuIHx8IGRvY3VtZW50LmV4aXRGdWxsU2NyZWVuIHx8IGRvY3VtZW50LndlYmtpdENhbmNlbEZ1bGxTY3JlZW4gfHwgZG9jdW1lbnQubXNDYW5jZWxGdWxsU2NyZWVuIHx8IGRvY3VtZW50Lm1vekNhbmNlbEZ1bGxTY3JlZW4sXG4gICAgICAgIGhhc0Z1bGxTY3JlZW46Ym9vbGVhbiA9ICEhKGZ1bGxTY3JlZW5SZXF1ZXN0ICYmIGZ1bGxTY3JlZW5DYW5jZWwpO1xuXG4gICAgLy9BdWRpb1xuICAgIHZhciBoYXNIVE1MQXVkaW86Ym9vbGVhbiA9ICEhd2luZG93LkF1ZGlvLFxuICAgICAgICB3ZWJBdWRpb0NvbnRleHQ6YW55ID0gd2luZG93LkF1ZGlvQ29udGV4dCB8fCB3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0LFxuICAgICAgICBoYXNXZWJBdWRpbzpib29sZWFuID0gISF3ZWJBdWRpb0NvbnRleHQsXG4gICAgICAgIGhhc0F1ZGlvOmJvb2xlYW4gPSBoYXNXZWJBdWRpbyB8fCBoYXNIVE1MQXVkaW8sXG4gICAgICAgIGhhc01wMzpib29sZWFuID0gZmFsc2UsXG4gICAgICAgIGhhc09nZzpib29sZWFuID0gZmFsc2UsXG4gICAgICAgIGhhc1dhdjpib29sZWFuID0gZmFsc2UsXG4gICAgICAgIGhhc000YTpib29sZWFuID0gZmFsc2U7XG5cbiAgICAvL0F1ZGlvIG1pbWVUeXBlc1xuICAgIGlmKGhhc0F1ZGlvKXtcbiAgICAgICAgdmFyIGF1ZGlvOkhUTUxBdWRpb0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhdWRpbycpO1xuICAgICAgICBoYXNNcDMgPSBhdWRpby5jYW5QbGF5VHlwZSgnYXVkaW8vbXBlZzsnKSAhPT0gXCJcIjtcbiAgICAgICAgaGFzT2dnID0gYXVkaW8uY2FuUGxheVR5cGUoJ2F1ZGlvL29nZzsgY29kZWNzPVwidm9yYmlzXCInKSAhPT0gXCJcIjtcbiAgICAgICAgaGFzV2F2ID0gYXVkaW8uY2FuUGxheVR5cGUoJ2F1ZGlvL3dhdicpICE9PSBcIlwiO1xuICAgICAgICBoYXNNNGEgPSBhdWRpby5jYW5QbGF5VHlwZSgnYXVkaW8vbXA0OyBjb2RlY3M9XCJtcDRhLjQwLjVcIicpICE9PSBcIlwiO1xuICAgIH1cblxuICAgIGV4cG9ydCB2YXIgRGV2aWNlIDogRGV2aWNlRGF0YSA9IHtcbiAgICAgICAgaXNDaHJvbWUgOiBpc0Nocm9tZSxcbiAgICAgICAgaXNGaXJlZm94IDogaXNGaXJlZm94LFxuICAgICAgICBpc0lFIDogaXNJRSxcbiAgICAgICAgaXNPcGVyYSA6IGlzT3BlcmEsXG4gICAgICAgIGlzU2FmYXJpIDogaXNTYWZhcmksXG4gICAgICAgIGlzSXBob25lIDogaXNJcGhvbmUsXG4gICAgICAgIGlzSXBhZCA6IGlzSXBhZCxcbiAgICAgICAgaXNJcG9kIDogaXNJcG9kLFxuICAgICAgICBpc0FuZHJvaWQgOiBpc0FuZHJvaWQsXG4gICAgICAgIGlzQW5kcm9pZFBob25lIDogaXNBbmRyb2lkUGhvbmUsXG4gICAgICAgIGlzQW5kcm9pZFRhYmxldCA6IGlzQW5kcm9pZFRhYmxldCxcbiAgICAgICAgaXNMaW51eCA6IGlzTGludXgsXG4gICAgICAgIGlzTWFjIDogaXNNYWMsXG4gICAgICAgIGlzV2luZG93IDogaXNXaW5kb3csXG4gICAgICAgIGlzV2luZG93UGhvbmUgOiBpc1dpbmRvd1Bob25lLFxuICAgICAgICBpc1dpbmRvd1RhYmxldCA6IGlzV2luZG93VGFibGV0LFxuICAgICAgICBpc01vYmlsZSA6IGlzTW9iaWxlLFxuICAgICAgICBpc1RhYmxldCA6IGlzVGFibGV0LFxuICAgICAgICBpc0Rlc2t0b3AgOiBpc0Rlc2t0b3AsXG4gICAgICAgIGlzVG91Y2hEZXZpY2UgOiBpc1RvdWNoRGV2aWNlLFxuICAgICAgICBpc0NvY29vbiA6IGlzQ29jb29uLFxuICAgICAgICBpc05vZGVXZWJraXQgOiBpc05vZGVXZWJraXQsXG4gICAgICAgIGlzRWplY3RhIDogaXNFamVjdGEsXG4gICAgICAgIGlzQ29yZG92YSA6IGlzQ29yZG92YSxcbiAgICAgICAgaXNDcm9zc3dhbGsgOiBpc0Nyb3Nzd2FsayxcbiAgICAgICAgaXNFbGVjdHJvbiA6IGlzRWxlY3Ryb24sXG4gICAgICAgIGlzQXRvbVNoZWxsIDogaXNFbGVjdHJvbiwgLy9UT0RPOiBSZW1vdmUgc29vbiwgd2hlbiBhdG9tLXNoZWxsICh2ZXJzaW9uKSBpcyBkZXByZWNhdGVkXG5cbiAgICAgICAgLy9pc09ubGluZSA6IG5hdmlnYXRvci5vbkxpbmUsXG4gICAgICAgIGhhc1ZpYnJhdGUgOiBoYXNWaWJyYXRlLFxuICAgICAgICBoYXNNb3VzZVdoZWVsIDogaGFzTW91c2VXaGVlbCxcbiAgICAgICAgaGFzRnVsbFNjcmVlbiA6IGhhc0Z1bGxTY3JlZW4sXG4gICAgICAgIGhhc0FjY2VsZXJvbWV0ZXIgOiBoYXNBY2NlbGVyb21ldGVyLFxuICAgICAgICBoYXNHYW1lcGFkIDogaGFzR2FtZXBhZCxcblxuICAgICAgICBmdWxsU2NyZWVuUmVxdWVzdCA6IGZ1bGxTY3JlZW5SZXF1ZXN0ID8gZnVsbFNjcmVlblJlcXVlc3QubmFtZSA6IHVuZGVmaW5lZCxcbiAgICAgICAgZnVsbFNjcmVlbkNhbmNlbCA6IGZ1bGxTY3JlZW5DYW5jZWwgPyBmdWxsU2NyZWVuQ2FuY2VsLm5hbWUgOiB1bmRlZmluZWQsXG5cbiAgICAgICAgaGFzQXVkaW8gOiBoYXNBdWRpbyxcbiAgICAgICAgaGFzSFRNTEF1ZGlvIDogaGFzSFRNTEF1ZGlvLFxuICAgICAgICBoYXNXZWJBdWRpbzogaGFzV2ViQXVkaW8sXG4gICAgICAgIHdlYkF1ZGlvQ29udGV4dCA6IHdlYkF1ZGlvQ29udGV4dCxcblxuICAgICAgICBoYXNNcDMgOiBoYXNNcDMsXG4gICAgICAgIGhhc000YSA6IGhhc000YSxcbiAgICAgICAgaGFzT2dnIDogaGFzT2dnLFxuICAgICAgICBoYXNXYXYgOiBoYXNXYXYsXG5cbiAgICAgICAgZ2V0TW91c2VXaGVlbEV2ZW50IDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZighaGFzTW91c2VXaGVlbClyZXR1cm47XG4gICAgICAgICAgICB2YXIgZXZ0OnN0cmluZztcbiAgICAgICAgICAgIGlmKCdvbndoZWVsJyBpbiB3aW5kb3cpe1xuICAgICAgICAgICAgICAgIGV2dCA9ICd3aGVlbCc7XG4gICAgICAgICAgICB9ZWxzZSBpZignb25tb3VzZXdoZWVsJyBpbiB3aW5kb3cpe1xuICAgICAgICAgICAgICAgIGV2dCA9ICdtb3VzZXdoZWVsJztcbiAgICAgICAgICAgIH1lbHNlIGlmKCdNb3VzZVNjcm9sbEV2ZW50JyBpbiB3aW5kb3cpe1xuICAgICAgICAgICAgICAgIGV2dCA9ICdET01Nb3VzZVNjcm9sbCc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBldnQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdmlicmF0ZSA6IGZ1bmN0aW9uKHBhdHRlcm46IG51bWJlciB8IG51bWJlcltdKXtcbiAgICAgICAgICAgIGlmKGhhc1ZpYnJhdGUpe1xuICAgICAgICAgICAgICAgIG5hdmlnYXRvci52aWJyYXRlKHBhdHRlcm4pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGdldCBpc09ubGluZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB3aW5kb3cubmF2aWdhdG9yLm9uTGluZTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIERldmljZURhdGEge1xuICAgICAgICBpc0Nocm9tZSA6IGJvb2xlYW47XG4gICAgICAgIGlzRmlyZWZveCA6IGJvb2xlYW47XG4gICAgICAgIGlzSUUgOiBib29sZWFuO1xuICAgICAgICBpc09wZXJhIDogYm9vbGVhbjtcbiAgICAgICAgaXNTYWZhcmkgOiBib29sZWFuO1xuICAgICAgICBpc0lwaG9uZSA6IGJvb2xlYW47XG4gICAgICAgIGlzSXBhZCA6IGJvb2xlYW47XG4gICAgICAgIGlzSXBvZCA6IGJvb2xlYW47XG4gICAgICAgIGlzQW5kcm9pZCA6IGJvb2xlYW47XG4gICAgICAgIGlzQW5kcm9pZFBob25lIDogYm9vbGVhbjtcbiAgICAgICAgaXNBbmRyb2lkVGFibGV0IDogYm9vbGVhbjtcbiAgICAgICAgaXNMaW51eCA6IGJvb2xlYW47XG4gICAgICAgIGlzTWFjIDogYm9vbGVhbjtcbiAgICAgICAgaXNXaW5kb3cgOiBib29sZWFuO1xuICAgICAgICBpc1dpbmRvd1Bob25lIDogYm9vbGVhbjtcbiAgICAgICAgaXNXaW5kb3dUYWJsZXQgOiBib29sZWFuO1xuICAgICAgICBpc01vYmlsZSA6IGJvb2xlYW47XG4gICAgICAgIGlzVGFibGV0IDogYm9vbGVhbjtcbiAgICAgICAgaXNEZXNrdG9wIDogYm9vbGVhbjtcbiAgICAgICAgaXNUb3VjaERldmljZSA6IGJvb2xlYW47XG4gICAgICAgIGlzQ29jb29uIDogYm9vbGVhbjtcbiAgICAgICAgaXNOb2RlV2Via2l0IDogYm9vbGVhbjtcbiAgICAgICAgaXNFamVjdGEgOiBib29sZWFuO1xuICAgICAgICBpc0NvcmRvdmEgOiBib29sZWFuO1xuICAgICAgICBpc0Nyb3Nzd2FsayA6IGJvb2xlYW47XG4gICAgICAgIGlzRWxlY3Ryb24gOiBib29sZWFuO1xuICAgICAgICBpc0F0b21TaGVsbCA6IGJvb2xlYW47XG5cbiAgICAgICAgaGFzVmlicmF0ZSA6IGJvb2xlYW47XG4gICAgICAgIGhhc01vdXNlV2hlZWwgOiBib29sZWFuO1xuICAgICAgICBoYXNGdWxsU2NyZWVuIDogYm9vbGVhbjtcbiAgICAgICAgaGFzQWNjZWxlcm9tZXRlciA6IGJvb2xlYW47XG4gICAgICAgIGhhc0dhbWVwYWQgOiBib29sZWFuO1xuXG4gICAgICAgIGZ1bGxTY3JlZW5SZXF1ZXN0OmZ1bGxTY3JlZW5EYXRhO1xuICAgICAgICBmdWxsU2NyZWVuQ2FuY2VsOmZ1bGxTY3JlZW5EYXRhO1xuXG4gICAgICAgIGhhc0F1ZGlvIDogYm9vbGVhbjtcbiAgICAgICAgaGFzSFRNTEF1ZGlvIDogYm9vbGVhbjtcbiAgICAgICAgaGFzV2ViQXVkaW8gOiBib29sZWFuO1xuICAgICAgICB3ZWJBdWRpb0NvbnRleHQ6YW55O1xuXG4gICAgICAgIGhhc01wMyA6IGJvb2xlYW47XG4gICAgICAgIGhhc000YSA6IGJvb2xlYW47XG4gICAgICAgIGhhc09nZyA6IGJvb2xlYW47XG4gICAgICAgIGhhc1dhdiA6IGJvb2xlYW47XG5cbiAgICAgICAgaXNPbmxpbmU6Ym9vbGVhbjtcblxuICAgICAgICBnZXRNb3VzZVdoZWVsRXZlbnQoKTpzdHJpbmc7XG5cbiAgICAgICAgdmlicmF0ZSh2YWx1ZTpudW1iZXIpOnZvaWQ7XG4gICAgfVxufVxuXG5kZWNsYXJlIHZhciBwcm9jZXNzOmFueSxcbiAgICBEb2N1bWVudFRvdWNoOmFueSxcbiAgICBnbG9iYWw6YW55O1xuXG5pbnRlcmZhY2UgTmF2aWdhdG9yIHtcbiAgICBpc0NvY29vbkpTOmFueTtcbiAgICB2aWJyYXRlKHBhdHRlcm46IG51bWJlciB8IG51bWJlcltdKTpib29sZWFuO1xuICAgIGdldEdhbWVwYWRzKCk6YW55O1xuICAgIHdlYmtpdEdldEdhbWVwYWRzKCk6YW55O1xufVxuXG5pbnRlcmZhY2UgV2luZG93IHtcbiAgICBlamVjdGE6YW55O1xuICAgIGNvcmRvdmE6YW55O1xuICAgIEF1ZGlvKCk6SFRNTEF1ZGlvRWxlbWVudDtcbiAgICBBdWRpb0NvbnRleHQoKTphbnk7XG4gICAgd2Via2l0QXVkaW9Db250ZXh0KCk6YW55O1xufVxuXG5pbnRlcmZhY2UgZnVsbFNjcmVlbkRhdGEge1xuICAgIG5hbWU6c3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgRG9jdW1lbnQge1xuICAgIGNhbmNlbEZ1bGxTY3JlZW4oKTpmdWxsU2NyZWVuRGF0YSA7XG4gICAgZXhpdEZ1bGxTY3JlZW4oKTpmdWxsU2NyZWVuRGF0YSA7XG4gICAgd2Via2l0Q2FuY2VsRnVsbFNjcmVlbigpOmZ1bGxTY3JlZW5EYXRhIDtcbiAgICBtc0NhbmNlbEZ1bGxTY3JlZW4oKTpmdWxsU2NyZWVuRGF0YSA7XG4gICAgbW96Q2FuY2VsRnVsbFNjcmVlbigpOmZ1bGxTY3JlZW5EYXRhIDtcbn1cblxuaW50ZXJmYWNlIEhUTUxEaXZFbGVtZW50IHtcbiAgICByZXF1ZXN0RnVsbHNjcmVlbigpOmZ1bGxTY3JlZW5EYXRhIDtcbiAgICB3ZWJraXRSZXF1ZXN0RnVsbFNjcmVlbigpOmZ1bGxTY3JlZW5EYXRhIDtcbiAgICBtc1JlcXVlc3RGdWxsU2NyZWVuKCk6ZnVsbFNjcmVlbkRhdGEgO1xuICAgIG1velJlcXVlc3RGdWxsU2NyZWVuKCk6ZnVsbFNjcmVlbkRhdGEgO1xufSIsIm1vZHVsZSBQSVhJIHtcbiAgICBleHBvcnQgY2xhc3MgSW5wdXRNYW5hZ2Vye1xuICAgICAgICBnYW1lOkdhbWU7XG5cbiAgICAgICAgY29uc3RydWN0b3IoZ2FtZTogR2FtZSl7XG4gICAgICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB9XG4gICAgfVxufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2RlZnMvcGl4aS5qcy5kLnRzXCIgLz5cbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4vRGV2aWNlLnRzXCIgLz5cbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL2Rpc3BsYXkvU2NlbmUudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vYXVkaW8vQXVkaW9NYW5hZ2VyLnRzXCIgLz5cbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL2lucHV0L0lucHV0TWFuYWdlci50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuL0RhdGFNYW5hZ2VyLnRzXCIgLz5cbm1vZHVsZSBQSVhJIHtcbiAgICB2YXIgbGFzdDpudW1iZXIgPSAwO1xuICAgIHZhciBtaW5GcmFtZU1TID0gMjA7XG5cbiAgICB2YXIgZGVmYXVsdEdhbWVDb25maWcgOiBHYW1lQ29uZmlnID0ge1xuICAgICAgICBpZDogXCJwaXhpLmRlZmF1bHQuaWRcIixcbiAgICAgICAgd2lkdGg6ODAwLFxuICAgICAgICBoZWlnaHQ6NjAwLFxuICAgICAgICB1c2VXZWJBdWRpbzogdHJ1ZSxcbiAgICAgICAgdXNlUGVyc2lzdGFudERhdGE6IGZhbHNlLFxuICAgICAgICBnYW1lU2NhbGVUeXBlOiBHQU1FX1NDQUxFX1RZUEUuTk9ORVxuICAgIH07XG5cbiAgICBleHBvcnQgY2xhc3MgR2FtZSB7XG4gICAgICAgIGlkOnN0cmluZztcbiAgICAgICAgcmFmOmFueTtcblxuICAgICAgICBwcml2YXRlIF9zY2VuZXM6U2NlbmVbXSA9IFtdO1xuICAgICAgICBzY2VuZTpTY2VuZTtcblxuICAgICAgICBhdWRpbzpBdWRpb01hbmFnZXI7XG4gICAgICAgIGlucHV0OklucHV0TWFuYWdlcjtcbiAgICAgICAgZGF0YTpEYXRhTWFuYWdlcjtcblxuICAgICAgICByZW5kZXJlcjpXZWJHTFJlbmRlcmVyIHwgQ2FudmFzUmVuZGVyZXI7XG4gICAgICAgIGNhbnZhczpIVE1MQ2FudmFzRWxlbWVudDtcblxuICAgICAgICBkZWx0YTpudW1iZXIgPSAwO1xuICAgICAgICB0aW1lOm51bWJlciA9IDA7XG4gICAgICAgIGxhc3RUaW1lOm51bWJlciA9IDA7XG5cbiAgICAgICAgaXNXZWJHTDpib29sZWFuO1xuICAgICAgICBpc1dlYkF1ZGlvOmJvb2xlYW47XG5cbiAgICAgICAgcHJpdmF0ZSBfcmVzaXplTGlzdGVuZXI6YW55O1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGNvbmZpZz86R2FtZUNvbmZpZywgcmVuZGVyZXJPcHRpb25zPzpSZW5kZXJlck9wdGlvbnMpIHtcbiAgICAgICAgICAgIGNvbmZpZyA9ICg8T2JqZWN0Pk9iamVjdCkuYXNzaWduKGRlZmF1bHRHYW1lQ29uZmlnLCBjb25maWcpO1xuICAgICAgICAgICAgdGhpcy5pZCA9IGNvbmZpZy5pZDtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZXIgPSBhdXRvRGV0ZWN0UmVuZGVyZXIoY29uZmlnLndpZHRoLCBjb25maWcuaGVpZ2h0LCByZW5kZXJlck9wdGlvbnMpO1xuICAgICAgICAgICAgdGhpcy5jYW52YXMgPSB0aGlzLnJlbmRlcmVyLnZpZXc7XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMpO1xuXG4gICAgICAgICAgICB0aGlzLmlzV2ViR0wgPSAodGhpcy5yZW5kZXJlci50eXBlID09PSBSRU5ERVJFUl9UWVBFLldFQkdMKTtcbiAgICAgICAgICAgIHRoaXMuaXNXZWJBdWRpbyA9IChEZXZpY2UuaGFzV2ViQXVkaW8mJmNvbmZpZy51c2VXZWJBdWRpbyk7XG5cbiAgICAgICAgICAgIHRoaXMuaW5wdXQgPSBuZXcgSW5wdXRNYW5hZ2VyKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5hdWRpbyA9IG5ldyBBdWRpb01hbmFnZXIodGhpcyk7XG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBuZXcgRGF0YU1hbmFnZXIodGhpcywgY29uZmlnLnVzZVBlcnNpc3RhbnREYXRhKTtcblxuICAgICAgICAgICAgdmFyIGluaXRpYWxTY2VuZTpTY2VuZSA9IG5ldyBTY2VuZSgnaW5pdGlhbCcpLmFkZFRvKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5zZXRTY2VuZShpbml0aWFsU2NlbmUpO1xuXG4gICAgICAgICAgICBpZihjb25maWcuZ2FtZVNjYWxlVHlwZSAhPT0gR0FNRV9TQ0FMRV9UWVBFLk5PTkUpe1xuICAgICAgICAgICAgICAgIHRoaXMuYXV0b1Jlc2l6ZShjb25maWcuZ2FtZVNjYWxlVHlwZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9hbmltYXRlKCk6dm9pZCB7XG4gICAgICAgICAgICB0aGlzLnJhZiA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5fYW5pbWF0ZS5iaW5kKHRoaXMpKTtcblxuICAgICAgICAgICAgdmFyIG5vdzpudW1iZXIgPSBEYXRlLm5vdygpO1xuXG4gICAgICAgICAgICB0aGlzLnRpbWUgKz0gTWF0aC5taW4oKG5vdyAtIGxhc3QpIC8gMTAwMCwgbWluRnJhbWVNUyk7XG4gICAgICAgICAgICB0aGlzLmRlbHRhID0gdGhpcy50aW1lIC0gdGhpcy5sYXN0VGltZTtcbiAgICAgICAgICAgIHRoaXMubGFzdFRpbWUgPSB0aGlzLnRpbWU7XG5cbiAgICAgICAgICAgIGxhc3QgPSBub3c7XG5cbiAgICAgICAgICAgIHRoaXMucmVuZGVyZXIucmVuZGVyKHRoaXMuc2NlbmUpO1xuXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZSh0aGlzLmRlbHRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZShkZWx0YVRpbWU6bnVtYmVyKTpHYW1lIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zY2VuZS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMuc2NlbmUuY2hpbGRyZW5baV0udXBkYXRlKHRoaXMuZGVsdGEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL2NsZWFuIGtpbGxlZCBvYmplY3RzXG4gICAgICAgICAgICB2YXIgbGVuOm51bWJlciA9IENvbnRhaW5lci5fa2lsbGVkT2JqZWN0cy5sZW5ndGg7XG4gICAgICAgICAgICBpZiAobGVuKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaTpudW1iZXIgPSAwOyBpIDwgbGVuOyBpKyspIENvbnRhaW5lci5fa2lsbGVkT2JqZWN0c1tpXS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICBDb250YWluZXIuX2tpbGxlZE9iamVjdHMubGVuZ3RoID0gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBzdGFydCgpOkdhbWUge1xuICAgICAgICAgICAgdGhpcy5fYW5pbWF0ZSgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBzdG9wKCk6R2FtZSB7XG4gICAgICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5yYWYpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBzZXRTY2VuZShzY2VuZTpTY2VuZSB8IHN0cmluZyk6R2FtZSB7XG4gICAgICAgICAgICBpZighKHNjZW5lIGluc3RhbmNlb2YgU2NlbmUpKXtcbiAgICAgICAgICAgICAgICBzY2VuZSA9IHRoaXMuZ2V0U2NlbmUoPHN0cmluZz5zY2VuZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuc2NlbmUgPSA8U2NlbmU+c2NlbmU7XG4gICAgICAgICAgICB0aGlzLnNjZW5lLnBvc2l0aW9uLnNldCh0aGlzLndpZHRoLzIsIHRoaXMuaGVpZ2h0LzIpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBnZXRTY2VuZShpZDpzdHJpbmcpOlNjZW5le1xuICAgICAgICAgICAgdmFyIHNjZW5lOlNjZW5lID0gbnVsbDtcbiAgICAgICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgdGhpcy5fc2NlbmVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICBpZih0aGlzLl9zY2VuZXNbaV0uaWQgPT09IGlkKXtcbiAgICAgICAgICAgICAgICAgICAgc2NlbmUgPSB0aGlzLl9zY2VuZXNbaV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gc2NlbmU7XG4gICAgICAgIH1cblxuICAgICAgICBhZGRTY2VuZShzY2VuZTpTY2VuZSk6R2FtZSB7XG4gICAgICAgICAgICB0aGlzLl9zY2VuZXMucHVzaChzY2VuZSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc2l6ZSh3aWR0aDpudW1iZXIsIGhlaWdodDpudW1iZXIsIHJlbmRlcmVyOmJvb2xlYW4gPSBmYWxzZSk6R2FtZXtcbiAgICAgICAgICAgIGlmKHJlbmRlcmVyKXtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnJlc2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5jYW52YXMuc3R5bGUud2lkdGggPSB3aWR0aCArIFwicHhcIjtcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLmhlaWdodCA9IGhlaWdodCArIFwicHhcIjtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBhdXRvUmVzaXplKG1vZGU6bnVtYmVyKTpHYW1lIHtcbiAgICAgICAgICAgIGlmKHRoaXMuX3Jlc2l6ZUxpc3RlbmVyKXtcbiAgICAgICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5fcmVzaXplTGlzdGVuZXIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihtb2RlID09PSBHQU1FX1NDQUxFX1RZUEUuTk9ORSlyZXR1cm47XG5cbiAgICAgICAgICAgIHN3aXRjaChtb2RlKXtcbiAgICAgICAgICAgICAgICBjYXNlIEdBTUVfU0NBTEVfVFlQRS5BU1BFQ1RfRklUOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZXNpemVMaXN0ZW5lciA9IHRoaXMuX3Jlc2l6ZU1vZGVBc3BlY3RGaXQ7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgR0FNRV9TQ0FMRV9UWVBFLkFTUEVDVF9GSUxMOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZXNpemVMaXN0ZW5lciA9IHRoaXMuX3Jlc2l6ZU1vZGVBc3BlY3RGaWxsO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIEdBTUVfU0NBTEVfVFlQRS5GSUxMOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZXNpemVMaXN0ZW5lciA9IHRoaXMuX3Jlc2l6ZU1vZGVGaWxsO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX3Jlc2l6ZUxpc3RlbmVyLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgdGhpcy5fcmVzaXplTGlzdGVuZXIoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfcmVzaXplTW9kZUFzcGVjdEZpdCgpOnZvaWR7XG4gICAgICAgICAgICB2YXIgd3c6bnVtYmVyID0gcGFyc2VJbnQodGhpcy5jYW52YXMuc3R5bGUud2lkdGgsIDEwKSB8fCB0aGlzLmNhbnZhcy53aWR0aDtcbiAgICAgICAgICAgIHZhciBoaDpudW1iZXIgPSBwYXJzZUludCh0aGlzLmNhbnZhcy5zdHlsZS5oZWlnaHQsIDEwKSB8fCB0aGlzLmNhbnZhcy5oZWlnaHQ7XG4gICAgICAgICAgICBpZih3aW5kb3cuaW5uZXJXaWR0aCAhPT0gd3cgfHwgd2luZG93LmlubmVySGVpZ2h0ICE9PSBoaCl7XG4gICAgICAgICAgICAgICAgdmFyIHNjYWxlOm51bWJlciA9IE1hdGgubWluKHdpbmRvdy5pbm5lcldpZHRoL3RoaXMud2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodC90aGlzLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXNpemUodGhpcy53aWR0aCpzY2FsZSwgdGhpcy5oZWlnaHQqc2NhbGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfcmVzaXplTW9kZUFzcGVjdEZpbGwoKTp2b2lke1xuICAgICAgICAgICAgdmFyIHd3Om51bWJlciA9IHBhcnNlSW50KHRoaXMuY2FudmFzLnN0eWxlLndpZHRoLCAxMCkgfHwgdGhpcy5jYW52YXMud2lkdGg7XG4gICAgICAgICAgICB2YXIgaGg6bnVtYmVyID0gcGFyc2VJbnQodGhpcy5jYW52YXMuc3R5bGUuaGVpZ2h0LCAxMCkgfHwgdGhpcy5jYW52YXMuaGVpZ2h0O1xuICAgICAgICAgICAgaWYod2luZG93LmlubmVyV2lkdGggIT09IHd3IHx8IHdpbmRvdy5pbm5lckhlaWdodCAhPT0gaGgpe1xuICAgICAgICAgICAgICAgIHZhciBzY2FsZTpudW1iZXIgPSBNYXRoLm1heCh3aW5kb3cuaW5uZXJXaWR0aC90aGlzLndpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQvdGhpcy5oZWlnaHQpO1xuICAgICAgICAgICAgICAgIHZhciB3aWR0aDpudW1iZXIgPSB0aGlzLndpZHRoKnNjYWxlO1xuICAgICAgICAgICAgICAgIHZhciBoZWlnaHQ6bnVtYmVyID0gdGhpcy5oZWlnaHQqc2NhbGU7XG5cbiAgICAgICAgICAgICAgICB2YXIgdG9wTWFyZ2luOm51bWJlciA9ICh3aW5kb3cuaW5uZXJIZWlnaHQtaGVpZ2h0KS8yO1xuICAgICAgICAgICAgICAgIHZhciBsZWZ0TWFyZ2luOm51bWJlciA9ICh3aW5kb3cuaW5uZXJXaWR0aC13aWR0aCkvMjtcblxuICAgICAgICAgICAgICAgIHRoaXMucmVzaXplKHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgICAgICAgICAgICAgdmFyIHN0eWxlOmFueSA9IDxhbnk+dGhpcy5jYW52YXMuc3R5bGU7XG4gICAgICAgICAgICAgICAgc3R5bGVbJ21hcmdpbi10b3AnXSA9IHRvcE1hcmdpbiArIFwicHhcIjtcbiAgICAgICAgICAgICAgICBzdHlsZVsnbWFyZ2luLWxlZnQnXSA9IGxlZnRNYXJnaW4gKyBcInB4XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9yZXNpemVNb2RlRmlsbCgpOnZvaWR7XG4gICAgICAgICAgICB2YXIgd3c6bnVtYmVyID0gcGFyc2VJbnQodGhpcy5jYW52YXMuc3R5bGUud2lkdGgsIDEwKSB8fCB0aGlzLmNhbnZhcy53aWR0aDtcbiAgICAgICAgICAgIHZhciBoaDpudW1iZXIgPSBwYXJzZUludCh0aGlzLmNhbnZhcy5zdHlsZS5oZWlnaHQsIDEwKSB8fCB0aGlzLmNhbnZhcy5oZWlnaHQ7XG4gICAgICAgICAgICBpZih3aW5kb3cuaW5uZXJXaWR0aCAhPT0gd3cgfHwgd2luZG93LmlubmVySGVpZ2h0ICE9PSBoaCkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVzaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHdpZHRoKCk6bnVtYmVyIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbmRlcmVyLndpZHRoO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGhlaWdodCgpOm51bWJlciB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJlci5oZWlnaHQ7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgR2FtZUNvbmZpZyB7XG4gICAgICAgIGlkPzpzdHJpbmc7XG4gICAgICAgIHdpZHRoPzpudW1iZXI7XG4gICAgICAgIGhlaWdodD86bnVtYmVyO1xuICAgICAgICB1c2VXZWJBdWRpbz86Ym9vbGVhbjtcbiAgICAgICAgdXNlUGVyc2lzdGFudERhdGE/OmJvb2xlYW47XG4gICAgICAgIGdhbWVTY2FsZVR5cGU/Om51bWJlcjtcbiAgICB9XG59XG5cbmludGVyZmFjZSBPYmplY3Qge1xuICAgIGFzc2lnbih0YXJnZXQ6T2JqZWN0LCAuLi5zb3VyY2VzOk9iamVjdFtdKTpPYmplY3Q7XG59Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
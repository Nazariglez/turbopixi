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
}(typeof PIXI === 'object' ? PIXI : null));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInR1cmJvcGl4aS5qcyIsImluZGV4LnRzIiwiY29yZS9EYXRhTWFuYWdlci50cyIsImNvcmUvRGV2aWNlLnRzIiwiZGlzcGxheS9TY2VuZS50cyIsImF1ZGlvL0F1ZGlvTWFuYWdlci50cyIsImlucHV0L0lucHV0TWFuYWdlci50cyIsImNvcmUvR2FtZS50cyIsImRpc3BsYXkvQ29udGFpbmVyLnRzIiwiZGlzcGxheS9EaXNwbGF5T2JqZWN0LnRzIl0sIm5hbWVzIjpbIlBJWEkiLCJFcnJvciIsIlBJWElfVkVSU0lPTl9SRVFVSVJFRCIsIlBJWElfVkVSU0lPTiIsIlZFUlNJT04iLCJtYXRjaCIsIlBJWEkuR0FNRV9TQ0FMRV9UWVBFIiwiUElYSS5BVURJT19UWVBFIiwiUElYSS5EYXRhTWFuYWdlciIsIlBJWEkuRGF0YU1hbmFnZXIuY29uc3RydWN0b3IiLCJQSVhJLkRhdGFNYW5hZ2VyLmxvYWQiLCJQSVhJLkRhdGFNYW5hZ2VyLnNhdmUiLCJQSVhJLkRhdGFNYW5hZ2VyLnJlc2V0IiwiUElYSS5EYXRhTWFuYWdlci5zZXQiLCJQSVhJLkRhdGFNYW5hZ2VyLmdldCIsIlBJWEkuRGF0YU1hbmFnZXIuZGVsIiwiaGFzTW91c2VXaGVlbCIsImV2dCIsIndpbmRvdyIsImhhc1ZpYnJhdGUiLCJuYXZpZ2F0b3IiLCJ2aWJyYXRlIiwicGF0dGVybiIsIlBJWEkuaXNPbmxpbmUiLCJfX2V4dGVuZHMiLCJkIiwiYiIsInAiLCJoYXNPd25Qcm9wZXJ0eSIsIl9fIiwiY29uc3RydWN0b3IiLCJwcm90b3R5cGUiLCJQSVhJLlNjZW5lIiwiUElYSS5TY2VuZS5jb25zdHJ1Y3RvciIsIlBJWEkuU2NlbmUuYWRkVG8iLCJQSVhJLkF1ZGlvTWFuYWdlciIsIlBJWEkuQXVkaW9NYW5hZ2VyLmNvbnN0cnVjdG9yIiwiUElYSS5JbnB1dE1hbmFnZXIiLCJQSVhJLklucHV0TWFuYWdlci5jb25zdHJ1Y3RvciIsIlBJWEkuR2FtZSIsIlBJWEkuR2FtZS5jb25zdHJ1Y3RvciIsIlBJWEkuR2FtZS5fYW5pbWF0ZSIsIlBJWEkuR2FtZS51cGRhdGUiLCJQSVhJLkdhbWUuc3RhcnQiLCJQSVhJLkdhbWUuc3RvcCIsIlBJWEkuR2FtZS5zZXRTY2VuZSIsIlBJWEkuR2FtZS5nZXRTY2VuZSIsIlBJWEkuR2FtZS5hZGRTY2VuZSIsIlBJWEkuR2FtZS5yZXNpemUiLCJQSVhJLkdhbWUuYXV0b1Jlc2l6ZSIsIlBJWEkuR2FtZS5fcmVzaXplTW9kZUFzcGVjdEZpdCIsIlBJWEkuR2FtZS5fcmVzaXplTW9kZUFzcGVjdEZpbGwiLCJQSVhJLkdhbWUuX3Jlc2l6ZU1vZGVGaWxsIiwiZ2V0IiwiUElYSS5HYW1lLndpZHRoIiwiZW51bWVyYWJsZSIsImNvbmZpZ3VyYWJsZSIsIlBJWEkuR2FtZS5oZWlnaHQiLCJwb3NpdGlvbiIsIngiLCJ2ZWxvY2l0eSIsImRlbHRhVGltZSIsInkiLCJyb3RhdGlvbiIsInJvdGF0aW9uU3BlZWQiLCJpIiwiY2hpbGRyZW4iLCJsZW5ndGgiLCJ1cGRhdGUiLCJwYXJlbnQiLCJhZGRDaGlsZCIsIkNvbnRhaW5lciIsIl9raWxsZWRPYmplY3RzIiwicHVzaCIsInJlbW92ZUNoaWxkIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtJQ0xBLElBQUcsQ0FBQ0EsSUFBSixFQUFTO0FBQUEsUUFDTCxNQUFNLElBQUlDLEtBQUosQ0FBVSx3QkFBVixDQUFOLENBREs7QUFBQTtJQUlULElBQU1DLHFCQUFBLEdBQXdCLE9BQTlCO0lBQ0EsSUFBTUMsWUFBQSxHQUFlSCxJQUFBLENBQUtJLE9BQUwsQ0FBYUMsS0FBYixDQUFtQixVQUFuQixFQUErQixDQUEvQixDQUFyQjtJQUVBLElBQUdGLFlBQUEsR0FBZUQscUJBQWxCLEVBQXdDO0FBQUEsUUFDcEMsTUFBTSxJQUFJRCxLQUFKLENBQVUsY0FBY0QsSUFBQSxDQUFLSSxPQUFuQixHQUE2QixvQ0FBN0IsR0FBbUVGLHFCQUE3RSxDQUFOLENBRG9DO0FBQUE7SUFJeEMsSUFBT0YsSUFBUDtJ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QUEsWUFDekIsSUFBRyxLQUFLcUUsTUFBUixFQUFlO0FBQUEsZ0JBQ1gsS0FBS0EsTUFBTCxDQUFZSyxXQUFaLENBQXdCLElBQXhCLEVBRFc7QUFBQSxhQURVMUU7QUFBQUEsWUFJekIsT0FBTyxJQUFQLENBSnlCQTtBQUFBQSxTQUE3QkEsQ0F6QlE7QUFBQSxLQUFaLENBQU9BLElBQUEsSUFBQSxDQUFBQSxJQUFBLEdBQUksRUFBSixDQUFQO0lDQUE7QUFBQSxRQUFPQSxJQUFQO0lBQUEsQ0FBQSxVQUFPQSxJQUFQLEVBQVk7QUFBQSxRQUNSQSxJQUFBQSxDQUFBQSxhQUFBQSxDQUFjQSxTQUFkQSxDQUF3QkEsS0FBeEJBLEdBQWdDQSxDQUFoQ0EsQ0FEUTtBQUFBLFFBRVJBLElBQUFBLENBQUFBLGFBQUFBLENBQWNBLFNBQWRBLENBQXdCQSxRQUF4QkEsR0FBbUNBLElBQUlBLElBQUFBLENBQUFBLEtBQUpBLEVBQW5DQSxDQUZRO0FBQUEsUUFHUkEsSUFBQUEsQ0FBQUEsYUFBQUEsQ0FBY0EsU0FBZEEsQ0FBd0JBLFNBQXhCQSxHQUFvQ0EsQ0FBcENBLENBSFE7QUFBQSxRQUlSQSxJQUFBQSxDQUFBQSxhQUFBQSxDQUFjQSxTQUFkQSxDQUF3QkEsYUFBeEJBLEdBQXdDQSxDQUF4Q0EsQ0FKUTtBQUFBLFFBTVJBLElBQUFBLENBQUFBLGFBQUFBLENBQWNBLFNBQWRBLENBQXdCQSxNQUF4QkEsR0FBaUNBLFVBQVNBLFNBQVRBLEVBQXlCQTtBQUFBQSxZQUN0RCxPQUFPLElBQVAsQ0FEc0RBO0FBQUFBLFNBQTFEQSxDQU5RO0FBQUEsS0FBWixDQUFPQSxJQUFBLElBQUEsQ0FBQUEsSUFBQSxHQUFJLEVBQUosQ0FBUCIsImZpbGUiOiJ0dXJib3BpeGkuanMiLCJzb3VyY2VzQ29udGVudCI6W251bGwsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL2RlZnMvcGl4aS5qcy5kLnRzXCIgLz5cbmlmKCFQSVhJKXtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0V5ISBXaGVyZSBpcyBwaXhpLmpzPz8nKTtcbn1cblxuY29uc3QgUElYSV9WRVJTSU9OX1JFUVVJUkVEID0gXCIzLjAuN1wiO1xuY29uc3QgUElYSV9WRVJTSU9OID0gUElYSS5WRVJTSU9OLm1hdGNoKC9cXGQuXFxkLlxcZC8pWzBdO1xuXG5pZihQSVhJX1ZFUlNJT04gPCBQSVhJX1ZFUlNJT05fUkVRVUlSRUQpe1xuICAgIHRocm93IG5ldyBFcnJvcihcIlBpeGkuanMgdlwiICsgUElYSS5WRVJTSU9OICsgXCIgaXQncyBub3Qgc3VwcG9ydGVkLCBwbGVhc2UgdXNlIF5cIiArIFBJWElfVkVSU0lPTl9SRVFVSVJFRCk7XG59XG5cbm1vZHVsZSBQSVhJIHtcbiAgICBleHBvcnQgZW51bSBHQU1FX1NDQUxFX1RZUEUge1xuICAgICAgICBOT05FLFxuICAgICAgICBGSUxMLFxuICAgICAgICBBU1BFQ1RfRklULFxuICAgICAgICBBU1BFQ1RfRklMTFxuICAgIH1cblxuICAgIGV4cG9ydCBlbnVtIEFVRElPX1RZUEUge1xuICAgICAgICBVTktOT1dOLFxuICAgICAgICBXRUJBVURJTyxcbiAgICAgICAgSFRNTEFVRElPXG4gICAgfVxufVxuIiwibW9kdWxlIFBJWEkge1xuICAgIGV4cG9ydCBjbGFzcyBEYXRhTWFuYWdlcntcbiAgICAgICAgZ2FtZTpHYW1lO1xuICAgICAgICB1c2VQZXJzaXN0YW50RGF0YTpib29sZWFuO1xuXG4gICAgICAgIHByaXZhdGUgX2RhdGE6YW55O1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGdhbWU6R2FtZSwgdXNlUGVyc2l0YW50RGF0YTpib29sZWFuID0gZmFsc2Upe1xuICAgICAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgICAgIHRoaXMudXNlUGVyc2lzdGFudERhdGEgPSB1c2VQZXJzaXRhbnREYXRhO1xuICAgICAgICAgICAgdGhpcy5sb2FkKCk7XG4gICAgICAgIH1cblxuICAgICAgICBsb2FkKCk6RGF0YU1hbmFnZXJ7XG4gICAgICAgICAgICB0aGlzLl9kYXRhID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmdhbWUuaWQpKSB8fCB7fTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgc2F2ZSgpOkRhdGFNYW5hZ2Vye1xuICAgICAgICAgICAgaWYodGhpcy51c2VQZXJzaXN0YW50RGF0YSl7XG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5nYW1lLmlkLCBKU09OLnN0cmluZ2lmeSh0aGlzLl9kYXRhKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc2V0KCk6RGF0YU1hbmFnZXJ7XG4gICAgICAgICAgICB0aGlzLl9kYXRhID0ge307XG4gICAgICAgICAgICB0aGlzLnNhdmUoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0KGtleTpzdHJpbmcgfCBPYmplY3QsIHZhbHVlPzphbnkpOkRhdGFNYW5hZ2Vye1xuICAgICAgICAgICAgaWYoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGtleSkgPT09IFwiW29iamVjdCBPYmplY3RdXCIpe1xuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24odGhpcy5fZGF0YSwga2V5KTtcbiAgICAgICAgICAgIH1lbHNlIGlmKHR5cGVvZiBrZXkgPT09IFwic3RyaW5nXCIpe1xuICAgICAgICAgICAgICAgIHRoaXMuX2RhdGFba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnNhdmUoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0KGtleT86c3RyaW5nKTphbnl7XG4gICAgICAgICAgICBpZigha2V5KXtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZGF0YTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGFba2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRlbChrZXk6c3RyaW5nKTpEYXRhTWFuYWdlcntcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9kYXRhW2tleV07XG4gICAgICAgICAgICB0aGlzLnNhdmUoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICB9XG59IiwiLy9NYW55IGNoZWNrcyBhcmUgYmFzZWQgb24gaHR0cHM6Ly9naXRodWIuY29tL2FyYXNhdGFzYXlnaW4vaXMuanMvYmxvYi9tYXN0ZXIvaXMuanNcblxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vZGVmcy9waXhpLmpzLmQudHNcIiAvPlxubW9kdWxlIFBJWEkge1xuICAgIHZhciBuYXZpZ2F0b3I6TmF2aWdhdG9yID0gd2luZG93Lm5hdmlnYXRvcjtcbiAgICB2YXIgZG9jdW1lbnQ6RG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG5cbiAgICB2YXIgdXNlckFnZW50OnN0cmluZyA9ICduYXZpZ2F0b3InIGluIHdpbmRvdyAmJiAndXNlckFnZW50JyBpbiBuYXZpZ2F0b3IgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpIHx8ICcnLFxuICAgICAgICB2ZW5kb3I6c3RyaW5nID0gJ25hdmlnYXRvcicgaW4gd2luZG93ICYmICd2ZW5kb3InIGluIG5hdmlnYXRvciAmJiBuYXZpZ2F0b3IudmVuZG9yLnRvTG93ZXJDYXNlKCkgfHwgJycsXG4gICAgICAgIGFwcFZlcnNpb246c3RyaW5nID0gJ25hdmlnYXRvcicgaW4gd2luZG93ICYmICdhcHBWZXJzaW9uJyBpbiBuYXZpZ2F0b3IgJiYgbmF2aWdhdG9yLmFwcFZlcnNpb24udG9Mb3dlckNhc2UoKSB8fCAnJztcblxuICAgIC8vQnJvd3NlcnNcbiAgICB2YXIgaXNDaHJvbWU6Ym9vbGVhbiA9IC9jaHJvbWV8Y2hyb21pdW0vaS50ZXN0KHVzZXJBZ2VudCkgJiYgL2dvb2dsZSBpbmMvLnRlc3QodmVuZG9yKSxcbiAgICAgICAgaXNGaXJlZm94OmJvb2xlYW4gPSAvZmlyZWZveC9pLnRlc3QodXNlckFnZW50KSxcbiAgICAgICAgaXNJRTpib29sZWFuID0gL21zaWUvaS50ZXN0KHVzZXJBZ2VudCkgfHwgXCJBY3RpdmVYT2JqZWN0XCIgaW4gd2luZG93LFxuICAgICAgICBpc09wZXJhOmJvb2xlYW4gPSAvXk9wZXJhXFwvLy50ZXN0KHVzZXJBZ2VudCkgfHwgL1xceDIwT1BSXFwvLy50ZXN0KHVzZXJBZ2VudCksXG4gICAgICAgIGlzU2FmYXJpOmJvb2xlYW4gPSAvc2FmYXJpL2kudGVzdCh1c2VyQWdlbnQpICYmIC9hcHBsZSBjb21wdXRlci9pLnRlc3QodmVuZG9yKTtcblxuICAgIC8vRGV2aWNlcyAmJiBPU1xuICAgIHZhciBpc0lwaG9uZTpib29sZWFuID0gL2lwaG9uZS9pLnRlc3QodXNlckFnZW50KSxcbiAgICAgICAgaXNJcGFkOmJvb2xlYW4gPSAvaXBhZC9pLnRlc3QodXNlckFnZW50KSxcbiAgICAgICAgaXNJcG9kOmJvb2xlYW4gPSAvaXBvZC9pLnRlc3QodXNlckFnZW50KSxcbiAgICAgICAgaXNBbmRyb2lkOmJvb2xlYW4gPSAvYW5kcm9pZC9pLnRlc3QodXNlckFnZW50KSxcbiAgICAgICAgaXNBbmRyb2lkUGhvbmU6Ym9vbGVhbiA9IC9hbmRyb2lkL2kudGVzdCh1c2VyQWdlbnQpICYmIC9tb2JpbGUvaS50ZXN0KHVzZXJBZ2VudCksXG4gICAgICAgIGlzQW5kcm9pZFRhYmxldDpib29sZWFuID0gL2FuZHJvaWQvaS50ZXN0KHVzZXJBZ2VudCkgJiYgIS9tb2JpbGUvaS50ZXN0KHVzZXJBZ2VudCksXG4gICAgICAgIGlzTGludXg6Ym9vbGVhbiA9IC9saW51eC9pLnRlc3QoYXBwVmVyc2lvbiksXG4gICAgICAgIGlzTWFjOmJvb2xlYW4gPSAvbWFjL2kudGVzdChhcHBWZXJzaW9uKSxcbiAgICAgICAgaXNXaW5kb3c6Ym9vbGVhbiA9IC93aW4vaS50ZXN0KGFwcFZlcnNpb24pLFxuICAgICAgICBpc1dpbmRvd1Bob25lOmJvb2xlYW4gPSBpc1dpbmRvdyAmJiAvcGhvbmUvaS50ZXN0KHVzZXJBZ2VudCksXG4gICAgICAgIGlzV2luZG93VGFibGV0OmJvb2xlYW4gPSBpc1dpbmRvdyAmJiAhaXNXaW5kb3dQaG9uZSAmJiAvdG91Y2gvaS50ZXN0KHVzZXJBZ2VudCksXG4gICAgICAgIGlzTW9iaWxlOmJvb2xlYW4gPSBpc0lwaG9uZSB8fCBpc0lwb2R8fCBpc0FuZHJvaWRQaG9uZSB8fCBpc1dpbmRvd1Bob25lLFxuICAgICAgICBpc1RhYmxldDpib29sZWFuID0gaXNJcGFkIHx8IGlzQW5kcm9pZFRhYmxldCB8fCBpc1dpbmRvd1RhYmxldCxcbiAgICAgICAgaXNEZXNrdG9wOmJvb2xlYW4gPSAhaXNNb2JpbGUgJiYgIWlzVGFibGV0LFxuICAgICAgICBpc1RvdWNoRGV2aWNlOmJvb2xlYW4gPSAnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cgfHwnRG9jdW1lbnRUb3VjaCcgaW4gd2luZG93ICYmIGRvY3VtZW50IGluc3RhbmNlb2YgRG9jdW1lbnRUb3VjaCxcbiAgICAgICAgaXNDb2Nvb246Ym9vbGVhbiA9ICEhbmF2aWdhdG9yLmlzQ29jb29uSlMsXG4gICAgICAgIGlzTm9kZVdlYmtpdDpib29sZWFuID0gISEodHlwZW9mIHByb2Nlc3MgPT09IFwib2JqZWN0XCIgJiYgcHJvY2Vzcy50aXRsZSA9PT0gXCJub2RlXCIgJiYgdHlwZW9mIGdsb2JhbCA9PT0gXCJvYmplY3RcIiksXG4gICAgICAgIGlzRWplY3RhOmJvb2xlYW4gPSAhIXdpbmRvdy5lamVjdGEsXG4gICAgICAgIGlzQ3Jvc3N3YWxrOmJvb2xlYW4gPSAvQ3Jvc3N3YWxrLy50ZXN0KHVzZXJBZ2VudCksXG4gICAgICAgIGlzQ29yZG92YTpib29sZWFuID0gISF3aW5kb3cuY29yZG92YSxcbiAgICAgICAgaXNFbGVjdHJvbjpib29sZWFuID0gISEodHlwZW9mIHByb2Nlc3MgPT09IFwib2JqZWN0XCIgJiYgcHJvY2Vzcy52ZXJzaW9ucyAmJiAocHJvY2Vzcy52ZXJzaW9ucy5lbGVjdHJvbiB8fCBwcm9jZXNzLnZlcnNpb25zWydhdG9tLXNoZWxsJ10pKTtcblxuICAgIHZhciBoYXNWaWJyYXRlOmJvb2xlYW4gPSAhIW5hdmlnYXRvci52aWJyYXRlICYmIChpc01vYmlsZSB8fCBpc1RhYmxldCksXG4gICAgICAgIGhhc01vdXNlV2hlZWw6Ym9vbGVhbiA9ICdvbndoZWVsJyBpbiB3aW5kb3cgfHwgJ29ubW91c2V3aGVlbCcgaW4gd2luZG93IHx8ICdNb3VzZVNjcm9sbEV2ZW50JyBpbiB3aW5kb3csXG4gICAgICAgIGhhc0FjY2VsZXJvbWV0ZXI6Ym9vbGVhbiA9ICdEZXZpY2VNb3Rpb25FdmVudCcgaW4gd2luZG93LFxuICAgICAgICBoYXNHYW1lcGFkOmJvb2xlYW4gPSAhIW5hdmlnYXRvci5nZXRHYW1lcGFkcyB8fCAhIW5hdmlnYXRvci53ZWJraXRHZXRHYW1lcGFkcztcblxuICAgIC8vRnVsbFNjcmVlblxuICAgIHZhciBkaXY6SFRNTERpdkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB2YXIgZnVsbFNjcmVlblJlcXVlc3Q6YW55ID0gZGl2LnJlcXVlc3RGdWxsc2NyZWVuIHx8IGRpdi53ZWJraXRSZXF1ZXN0RnVsbFNjcmVlbiB8fCBkaXYubXNSZXF1ZXN0RnVsbFNjcmVlbiB8fCBkaXYubW96UmVxdWVzdEZ1bGxTY3JlZW4sXG4gICAgICAgIGZ1bGxTY3JlZW5DYW5jZWw6YW55ID0gZG9jdW1lbnQuY2FuY2VsRnVsbFNjcmVlbiB8fCBkb2N1bWVudC5leGl0RnVsbFNjcmVlbiB8fCBkb2N1bWVudC53ZWJraXRDYW5jZWxGdWxsU2NyZWVuIHx8IGRvY3VtZW50Lm1zQ2FuY2VsRnVsbFNjcmVlbiB8fCBkb2N1bWVudC5tb3pDYW5jZWxGdWxsU2NyZWVuLFxuICAgICAgICBoYXNGdWxsU2NyZWVuOmJvb2xlYW4gPSAhIShmdWxsU2NyZWVuUmVxdWVzdCAmJiBmdWxsU2NyZWVuQ2FuY2VsKTtcblxuICAgIC8vQXVkaW9cbiAgICB2YXIgaGFzSFRNTEF1ZGlvOmJvb2xlYW4gPSAhIXdpbmRvdy5BdWRpbyxcbiAgICAgICAgd2ViQXVkaW9Db250ZXh0OmFueSA9IHdpbmRvdy5BdWRpb0NvbnRleHQgfHwgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dCxcbiAgICAgICAgaGFzV2ViQXVkaW86Ym9vbGVhbiA9ICEhd2ViQXVkaW9Db250ZXh0LFxuICAgICAgICBoYXNBdWRpbzpib29sZWFuID0gaGFzV2ViQXVkaW8gfHwgaGFzSFRNTEF1ZGlvLFxuICAgICAgICBoYXNNcDM6Ym9vbGVhbiA9IGZhbHNlLFxuICAgICAgICBoYXNPZ2c6Ym9vbGVhbiA9IGZhbHNlLFxuICAgICAgICBoYXNXYXY6Ym9vbGVhbiA9IGZhbHNlLFxuICAgICAgICBoYXNNNGE6Ym9vbGVhbiA9IGZhbHNlO1xuXG4gICAgLy9BdWRpbyBtaW1lVHlwZXNcbiAgICBpZihoYXNBdWRpbyl7XG4gICAgICAgIHZhciBhdWRpbzpIVE1MQXVkaW9FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYXVkaW8nKTtcbiAgICAgICAgaGFzTXAzID0gYXVkaW8uY2FuUGxheVR5cGUoJ2F1ZGlvL21wZWc7JykgIT09IFwiXCI7XG4gICAgICAgIGhhc09nZyA9IGF1ZGlvLmNhblBsYXlUeXBlKCdhdWRpby9vZ2c7IGNvZGVjcz1cInZvcmJpc1wiJykgIT09IFwiXCI7XG4gICAgICAgIGhhc1dhdiA9IGF1ZGlvLmNhblBsYXlUeXBlKCdhdWRpby93YXYnKSAhPT0gXCJcIjtcbiAgICAgICAgaGFzTTRhID0gYXVkaW8uY2FuUGxheVR5cGUoJ2F1ZGlvL21wNDsgY29kZWNzPVwibXA0YS40MC41XCInKSAhPT0gXCJcIjtcbiAgICB9XG5cbiAgICBleHBvcnQgdmFyIERldmljZSA6IERldmljZURhdGEgPSB7XG4gICAgICAgIGlzQ2hyb21lIDogaXNDaHJvbWUsXG4gICAgICAgIGlzRmlyZWZveCA6IGlzRmlyZWZveCxcbiAgICAgICAgaXNJRSA6IGlzSUUsXG4gICAgICAgIGlzT3BlcmEgOiBpc09wZXJhLFxuICAgICAgICBpc1NhZmFyaSA6IGlzU2FmYXJpLFxuICAgICAgICBpc0lwaG9uZSA6IGlzSXBob25lLFxuICAgICAgICBpc0lwYWQgOiBpc0lwYWQsXG4gICAgICAgIGlzSXBvZCA6IGlzSXBvZCxcbiAgICAgICAgaXNBbmRyb2lkIDogaXNBbmRyb2lkLFxuICAgICAgICBpc0FuZHJvaWRQaG9uZSA6IGlzQW5kcm9pZFBob25lLFxuICAgICAgICBpc0FuZHJvaWRUYWJsZXQgOiBpc0FuZHJvaWRUYWJsZXQsXG4gICAgICAgIGlzTGludXggOiBpc0xpbnV4LFxuICAgICAgICBpc01hYyA6IGlzTWFjLFxuICAgICAgICBpc1dpbmRvdyA6IGlzV2luZG93LFxuICAgICAgICBpc1dpbmRvd1Bob25lIDogaXNXaW5kb3dQaG9uZSxcbiAgICAgICAgaXNXaW5kb3dUYWJsZXQgOiBpc1dpbmRvd1RhYmxldCxcbiAgICAgICAgaXNNb2JpbGUgOiBpc01vYmlsZSxcbiAgICAgICAgaXNUYWJsZXQgOiBpc1RhYmxldCxcbiAgICAgICAgaXNEZXNrdG9wIDogaXNEZXNrdG9wLFxuICAgICAgICBpc1RvdWNoRGV2aWNlIDogaXNUb3VjaERldmljZSxcbiAgICAgICAgaXNDb2Nvb24gOiBpc0NvY29vbixcbiAgICAgICAgaXNOb2RlV2Via2l0IDogaXNOb2RlV2Via2l0LFxuICAgICAgICBpc0VqZWN0YSA6IGlzRWplY3RhLFxuICAgICAgICBpc0NvcmRvdmEgOiBpc0NvcmRvdmEsXG4gICAgICAgIGlzQ3Jvc3N3YWxrIDogaXNDcm9zc3dhbGssXG4gICAgICAgIGlzRWxlY3Ryb24gOiBpc0VsZWN0cm9uLFxuICAgICAgICBpc0F0b21TaGVsbCA6IGlzRWxlY3Ryb24sIC8vVE9ETzogUmVtb3ZlIHNvb24sIHdoZW4gYXRvbS1zaGVsbCAodmVyc2lvbikgaXMgZGVwcmVjYXRlZFxuXG4gICAgICAgIC8vaXNPbmxpbmUgOiBuYXZpZ2F0b3Iub25MaW5lLFxuICAgICAgICBoYXNWaWJyYXRlIDogaGFzVmlicmF0ZSxcbiAgICAgICAgaGFzTW91c2VXaGVlbCA6IGhhc01vdXNlV2hlZWwsXG4gICAgICAgIGhhc0Z1bGxTY3JlZW4gOiBoYXNGdWxsU2NyZWVuLFxuICAgICAgICBoYXNBY2NlbGVyb21ldGVyIDogaGFzQWNjZWxlcm9tZXRlcixcbiAgICAgICAgaGFzR2FtZXBhZCA6IGhhc0dhbWVwYWQsXG5cbiAgICAgICAgZnVsbFNjcmVlblJlcXVlc3QgOiBmdWxsU2NyZWVuUmVxdWVzdCA/IGZ1bGxTY3JlZW5SZXF1ZXN0Lm5hbWUgOiB1bmRlZmluZWQsXG4gICAgICAgIGZ1bGxTY3JlZW5DYW5jZWwgOiBmdWxsU2NyZWVuQ2FuY2VsID8gZnVsbFNjcmVlbkNhbmNlbC5uYW1lIDogdW5kZWZpbmVkLFxuXG4gICAgICAgIGhhc0F1ZGlvIDogaGFzQXVkaW8sXG4gICAgICAgIGhhc0hUTUxBdWRpbyA6IGhhc0hUTUxBdWRpbyxcbiAgICAgICAgaGFzV2ViQXVkaW86IGhhc1dlYkF1ZGlvLFxuICAgICAgICB3ZWJBdWRpb0NvbnRleHQgOiB3ZWJBdWRpb0NvbnRleHQsXG5cbiAgICAgICAgaGFzTXAzIDogaGFzTXAzLFxuICAgICAgICBoYXNNNGEgOiBoYXNNNGEsXG4gICAgICAgIGhhc09nZyA6IGhhc09nZyxcbiAgICAgICAgaGFzV2F2IDogaGFzV2F2LFxuXG4gICAgICAgIGdldE1vdXNlV2hlZWxFdmVudCA6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYoIWhhc01vdXNlV2hlZWwpcmV0dXJuO1xuICAgICAgICAgICAgdmFyIGV2dDpzdHJpbmc7XG4gICAgICAgICAgICBpZignb253aGVlbCcgaW4gd2luZG93KXtcbiAgICAgICAgICAgICAgICBldnQgPSAnd2hlZWwnO1xuICAgICAgICAgICAgfWVsc2UgaWYoJ29ubW91c2V3aGVlbCcgaW4gd2luZG93KXtcbiAgICAgICAgICAgICAgICBldnQgPSAnbW91c2V3aGVlbCc7XG4gICAgICAgICAgICB9ZWxzZSBpZignTW91c2VTY3JvbGxFdmVudCcgaW4gd2luZG93KXtcbiAgICAgICAgICAgICAgICBldnQgPSAnRE9NTW91c2VTY3JvbGwnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZXZ0O1xuICAgICAgICB9LFxuXG4gICAgICAgIHZpYnJhdGUgOiBmdW5jdGlvbihwYXR0ZXJuOiBudW1iZXIgfCBudW1iZXJbXSl7XG4gICAgICAgICAgICBpZihoYXNWaWJyYXRlKXtcbiAgICAgICAgICAgICAgICBuYXZpZ2F0b3IudmlicmF0ZShwYXR0ZXJuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBnZXQgaXNPbmxpbmUoKSB7XG4gICAgICAgICAgICByZXR1cm4gd2luZG93Lm5hdmlnYXRvci5vbkxpbmU7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgZXhwb3J0IGludGVyZmFjZSBEZXZpY2VEYXRhIHtcbiAgICAgICAgaXNDaHJvbWUgOiBib29sZWFuO1xuICAgICAgICBpc0ZpcmVmb3ggOiBib29sZWFuO1xuICAgICAgICBpc0lFIDogYm9vbGVhbjtcbiAgICAgICAgaXNPcGVyYSA6IGJvb2xlYW47XG4gICAgICAgIGlzU2FmYXJpIDogYm9vbGVhbjtcbiAgICAgICAgaXNJcGhvbmUgOiBib29sZWFuO1xuICAgICAgICBpc0lwYWQgOiBib29sZWFuO1xuICAgICAgICBpc0lwb2QgOiBib29sZWFuO1xuICAgICAgICBpc0FuZHJvaWQgOiBib29sZWFuO1xuICAgICAgICBpc0FuZHJvaWRQaG9uZSA6IGJvb2xlYW47XG4gICAgICAgIGlzQW5kcm9pZFRhYmxldCA6IGJvb2xlYW47XG4gICAgICAgIGlzTGludXggOiBib29sZWFuO1xuICAgICAgICBpc01hYyA6IGJvb2xlYW47XG4gICAgICAgIGlzV2luZG93IDogYm9vbGVhbjtcbiAgICAgICAgaXNXaW5kb3dQaG9uZSA6IGJvb2xlYW47XG4gICAgICAgIGlzV2luZG93VGFibGV0IDogYm9vbGVhbjtcbiAgICAgICAgaXNNb2JpbGUgOiBib29sZWFuO1xuICAgICAgICBpc1RhYmxldCA6IGJvb2xlYW47XG4gICAgICAgIGlzRGVza3RvcCA6IGJvb2xlYW47XG4gICAgICAgIGlzVG91Y2hEZXZpY2UgOiBib29sZWFuO1xuICAgICAgICBpc0NvY29vbiA6IGJvb2xlYW47XG4gICAgICAgIGlzTm9kZVdlYmtpdCA6IGJvb2xlYW47XG4gICAgICAgIGlzRWplY3RhIDogYm9vbGVhbjtcbiAgICAgICAgaXNDb3Jkb3ZhIDogYm9vbGVhbjtcbiAgICAgICAgaXNDcm9zc3dhbGsgOiBib29sZWFuO1xuICAgICAgICBpc0VsZWN0cm9uIDogYm9vbGVhbjtcbiAgICAgICAgaXNBdG9tU2hlbGwgOiBib29sZWFuO1xuXG4gICAgICAgIGhhc1ZpYnJhdGUgOiBib29sZWFuO1xuICAgICAgICBoYXNNb3VzZVdoZWVsIDogYm9vbGVhbjtcbiAgICAgICAgaGFzRnVsbFNjcmVlbiA6IGJvb2xlYW47XG4gICAgICAgIGhhc0FjY2VsZXJvbWV0ZXIgOiBib29sZWFuO1xuICAgICAgICBoYXNHYW1lcGFkIDogYm9vbGVhbjtcblxuICAgICAgICBmdWxsU2NyZWVuUmVxdWVzdDpmdWxsU2NyZWVuRGF0YTtcbiAgICAgICAgZnVsbFNjcmVlbkNhbmNlbDpmdWxsU2NyZWVuRGF0YTtcblxuICAgICAgICBoYXNBdWRpbyA6IGJvb2xlYW47XG4gICAgICAgIGhhc0hUTUxBdWRpbyA6IGJvb2xlYW47XG4gICAgICAgIGhhc1dlYkF1ZGlvIDogYm9vbGVhbjtcbiAgICAgICAgd2ViQXVkaW9Db250ZXh0OmFueTtcblxuICAgICAgICBoYXNNcDMgOiBib29sZWFuO1xuICAgICAgICBoYXNNNGEgOiBib29sZWFuO1xuICAgICAgICBoYXNPZ2cgOiBib29sZWFuO1xuICAgICAgICBoYXNXYXYgOiBib29sZWFuO1xuXG4gICAgICAgIGlzT25saW5lOmJvb2xlYW47XG5cbiAgICAgICAgZ2V0TW91c2VXaGVlbEV2ZW50KCk6c3RyaW5nO1xuXG4gICAgICAgIHZpYnJhdGUodmFsdWU6bnVtYmVyKTp2b2lkO1xuICAgIH1cbn1cblxuZGVjbGFyZSB2YXIgcHJvY2VzczphbnksXG4gICAgRG9jdW1lbnRUb3VjaDphbnksXG4gICAgZ2xvYmFsOmFueTtcblxuaW50ZXJmYWNlIE5hdmlnYXRvciB7XG4gICAgaXNDb2Nvb25KUzphbnk7XG4gICAgdmlicmF0ZShwYXR0ZXJuOiBudW1iZXIgfCBudW1iZXJbXSk6Ym9vbGVhbjtcbiAgICBnZXRHYW1lcGFkcygpOmFueTtcbiAgICB3ZWJraXRHZXRHYW1lcGFkcygpOmFueTtcbn1cblxuaW50ZXJmYWNlIFdpbmRvdyB7XG4gICAgZWplY3RhOmFueTtcbiAgICBjb3Jkb3ZhOmFueTtcbiAgICBBdWRpbygpOkhUTUxBdWRpb0VsZW1lbnQ7XG4gICAgQXVkaW9Db250ZXh0KCk6YW55O1xuICAgIHdlYmtpdEF1ZGlvQ29udGV4dCgpOmFueTtcbn1cblxuaW50ZXJmYWNlIGZ1bGxTY3JlZW5EYXRhIHtcbiAgICBuYW1lOnN0cmluZztcbn1cblxuaW50ZXJmYWNlIERvY3VtZW50IHtcbiAgICBjYW5jZWxGdWxsU2NyZWVuKCk6ZnVsbFNjcmVlbkRhdGEgO1xuICAgIGV4aXRGdWxsU2NyZWVuKCk6ZnVsbFNjcmVlbkRhdGEgO1xuICAgIHdlYmtpdENhbmNlbEZ1bGxTY3JlZW4oKTpmdWxsU2NyZWVuRGF0YSA7XG4gICAgbXNDYW5jZWxGdWxsU2NyZWVuKCk6ZnVsbFNjcmVlbkRhdGEgO1xuICAgIG1vekNhbmNlbEZ1bGxTY3JlZW4oKTpmdWxsU2NyZWVuRGF0YSA7XG59XG5cbmludGVyZmFjZSBIVE1MRGl2RWxlbWVudCB7XG4gICAgcmVxdWVzdEZ1bGxzY3JlZW4oKTpmdWxsU2NyZWVuRGF0YSA7XG4gICAgd2Via2l0UmVxdWVzdEZ1bGxTY3JlZW4oKTpmdWxsU2NyZWVuRGF0YSA7XG4gICAgbXNSZXF1ZXN0RnVsbFNjcmVlbigpOmZ1bGxTY3JlZW5EYXRhIDtcbiAgICBtb3pSZXF1ZXN0RnVsbFNjcmVlbigpOmZ1bGxTY3JlZW5EYXRhIDtcbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9kZWZzL3BpeGkuanMuZC50c1wiIC8+XG5tb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IGNsYXNzIFNjZW5lIGV4dGVuZHMgQ29udGFpbmVyIHtcbiAgICAgICAgaWQ6c3RyaW5nO1xuICAgICAgICBzdGF0aWMgX2lkTGVuOm51bWJlciA9IDA7XG5cbiAgICAgICAgY29uc3RydWN0b3IoaWQ6c3RyaW5nID0gKFwic2NlbmVcIiArIFNjZW5lLl9pZExlbisrKSApe1xuICAgICAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGFkZFRvKGdhbWU6R2FtZXxDb250YWluZXIpOlNjZW5lIHtcbiAgICAgICAgICAgIGlmKGdhbWUgaW5zdGFuY2VvZiBHYW1lKXtcbiAgICAgICAgICAgICAgICA8R2FtZT5nYW1lLmFkZFNjZW5lKHRoaXMpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTY2VuZXMgY2FuIG9ubHkgYmUgYWRkZWQgdG8gdGhlIGdhbWUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfVxufSIsIm1vZHVsZSBQSVhJIHtcbiAgICBleHBvcnQgY2xhc3MgQXVkaW9NYW5hZ2Vye1xuICAgICAgICBnYW1lOkdhbWU7XG5cbiAgICAgICAgY29uc3RydWN0b3IoZ2FtZTogR2FtZSl7XG4gICAgICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB9XG4gICAgfVxufSIsIm1vZHVsZSBQSVhJIHtcbiAgICBleHBvcnQgY2xhc3MgSW5wdXRNYW5hZ2Vye1xuICAgICAgICBnYW1lOkdhbWU7XG5cbiAgICAgICAgY29uc3RydWN0b3IoZ2FtZTogR2FtZSl7XG4gICAgICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB9XG4gICAgfVxufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2RlZnMvcGl4aS5qcy5kLnRzXCIgLz5cbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4vRGV2aWNlLnRzXCIgLz5cbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL2Rpc3BsYXkvU2NlbmUudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vYXVkaW8vQXVkaW9NYW5hZ2VyLnRzXCIgLz5cbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL2lucHV0L0lucHV0TWFuYWdlci50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuL0RhdGFNYW5hZ2VyLnRzXCIgLz5cbm1vZHVsZSBQSVhJIHtcbiAgICB2YXIgbGFzdDpudW1iZXIgPSAwO1xuICAgIHZhciBtaW5GcmFtZU1TID0gMjA7XG5cbiAgICB2YXIgZGVmYXVsdEdhbWVDb25maWcgOiBHYW1lQ29uZmlnID0ge1xuICAgICAgICBpZDogXCJwaXhpLmRlZmF1bHQuaWRcIixcbiAgICAgICAgd2lkdGg6ODAwLFxuICAgICAgICBoZWlnaHQ6NjAwLFxuICAgICAgICB1c2VXZWJBdWRpbzogdHJ1ZSxcbiAgICAgICAgdXNlUGVyc2lzdGFudERhdGE6IGZhbHNlLFxuICAgICAgICBnYW1lU2NhbGVUeXBlOiBHQU1FX1NDQUxFX1RZUEUuTk9ORVxuICAgIH07XG5cbiAgICBleHBvcnQgY2xhc3MgR2FtZSB7XG4gICAgICAgIGlkOnN0cmluZztcbiAgICAgICAgcmFmOmFueTtcblxuICAgICAgICBwcml2YXRlIF9zY2VuZXM6U2NlbmVbXSA9IFtdO1xuICAgICAgICBzY2VuZTpTY2VuZTtcblxuICAgICAgICBhdWRpbzpBdWRpb01hbmFnZXI7XG4gICAgICAgIGlucHV0OklucHV0TWFuYWdlcjtcbiAgICAgICAgZGF0YTpEYXRhTWFuYWdlcjtcblxuICAgICAgICByZW5kZXJlcjpXZWJHTFJlbmRlcmVyIHwgQ2FudmFzUmVuZGVyZXI7XG4gICAgICAgIGNhbnZhczpIVE1MQ2FudmFzRWxlbWVudDtcblxuICAgICAgICBkZWx0YTpudW1iZXIgPSAwO1xuICAgICAgICB0aW1lOm51bWJlciA9IDA7XG4gICAgICAgIGxhc3RUaW1lOm51bWJlciA9IDA7XG5cbiAgICAgICAgaXNXZWJHTDpib29sZWFuO1xuICAgICAgICBpc1dlYkF1ZGlvOmJvb2xlYW47XG5cbiAgICAgICAgcHJpdmF0ZSBfcmVzaXplTGlzdGVuZXI6YW55O1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGNvbmZpZz86R2FtZUNvbmZpZywgcmVuZGVyZXJPcHRpb25zPzpSZW5kZXJlck9wdGlvbnMpIHtcbiAgICAgICAgICAgIGNvbmZpZyA9ICg8T2JqZWN0Pk9iamVjdCkuYXNzaWduKGRlZmF1bHRHYW1lQ29uZmlnLCBjb25maWcpO1xuICAgICAgICAgICAgdGhpcy5pZCA9IGNvbmZpZy5pZDtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZXIgPSBhdXRvRGV0ZWN0UmVuZGVyZXIoY29uZmlnLndpZHRoLCBjb25maWcuaGVpZ2h0LCByZW5kZXJlck9wdGlvbnMpO1xuICAgICAgICAgICAgdGhpcy5jYW52YXMgPSB0aGlzLnJlbmRlcmVyLnZpZXc7XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMpO1xuXG4gICAgICAgICAgICB0aGlzLmlzV2ViR0wgPSAodGhpcy5yZW5kZXJlci50eXBlID09PSBSRU5ERVJFUl9UWVBFLldFQkdMKTtcbiAgICAgICAgICAgIHRoaXMuaXNXZWJBdWRpbyA9IChEZXZpY2UuaGFzV2ViQXVkaW8mJmNvbmZpZy51c2VXZWJBdWRpbyk7XG5cbiAgICAgICAgICAgIHRoaXMuaW5wdXQgPSBuZXcgSW5wdXRNYW5hZ2VyKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5hdWRpbyA9IG5ldyBBdWRpb01hbmFnZXIodGhpcyk7XG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBuZXcgRGF0YU1hbmFnZXIodGhpcywgY29uZmlnLnVzZVBlcnNpc3RhbnREYXRhKTtcblxuICAgICAgICAgICAgdmFyIGluaXRpYWxTY2VuZTpTY2VuZSA9IG5ldyBTY2VuZSgnaW5pdGlhbCcpLmFkZFRvKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5zZXRTY2VuZShpbml0aWFsU2NlbmUpO1xuXG4gICAgICAgICAgICBpZihjb25maWcuZ2FtZVNjYWxlVHlwZSAhPT0gR0FNRV9TQ0FMRV9UWVBFLk5PTkUpe1xuICAgICAgICAgICAgICAgIHRoaXMuYXV0b1Jlc2l6ZShjb25maWcuZ2FtZVNjYWxlVHlwZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9hbmltYXRlKCk6dm9pZCB7XG4gICAgICAgICAgICB0aGlzLnJhZiA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5fYW5pbWF0ZS5iaW5kKHRoaXMpKTtcblxuICAgICAgICAgICAgdmFyIG5vdzpudW1iZXIgPSBEYXRlLm5vdygpO1xuXG4gICAgICAgICAgICB0aGlzLnRpbWUgKz0gTWF0aC5taW4oKG5vdyAtIGxhc3QpIC8gMTAwMCwgbWluRnJhbWVNUyk7XG4gICAgICAgICAgICB0aGlzLmRlbHRhID0gdGhpcy50aW1lIC0gdGhpcy5sYXN0VGltZTtcbiAgICAgICAgICAgIHRoaXMubGFzdFRpbWUgPSB0aGlzLnRpbWU7XG5cbiAgICAgICAgICAgIGxhc3QgPSBub3c7XG5cbiAgICAgICAgICAgIHRoaXMucmVuZGVyZXIucmVuZGVyKHRoaXMuc2NlbmUpO1xuXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZSh0aGlzLmRlbHRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZShkZWx0YVRpbWU6bnVtYmVyKTpHYW1lIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zY2VuZS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMuc2NlbmUuY2hpbGRyZW5baV0udXBkYXRlKHRoaXMuZGVsdGEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL2NsZWFuIGtpbGxlZCBvYmplY3RzXG4gICAgICAgICAgICB2YXIgbGVuOm51bWJlciA9IENvbnRhaW5lci5fa2lsbGVkT2JqZWN0cy5sZW5ndGg7XG4gICAgICAgICAgICBpZiAobGVuKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaTpudW1iZXIgPSAwOyBpIDwgbGVuOyBpKyspIENvbnRhaW5lci5fa2lsbGVkT2JqZWN0c1tpXS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICBDb250YWluZXIuX2tpbGxlZE9iamVjdHMubGVuZ3RoID0gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBzdGFydCgpOkdhbWUge1xuICAgICAgICAgICAgdGhpcy5fYW5pbWF0ZSgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBzdG9wKCk6R2FtZSB7XG4gICAgICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5yYWYpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBzZXRTY2VuZShzY2VuZTpTY2VuZSB8IHN0cmluZyk6R2FtZSB7XG4gICAgICAgICAgICBpZighKHNjZW5lIGluc3RhbmNlb2YgU2NlbmUpKXtcbiAgICAgICAgICAgICAgICBzY2VuZSA9IHRoaXMuZ2V0U2NlbmUoPHN0cmluZz5zY2VuZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuc2NlbmUgPSA8U2NlbmU+c2NlbmU7XG4gICAgICAgICAgICB0aGlzLnNjZW5lLnBvc2l0aW9uLnNldCh0aGlzLndpZHRoLzIsIHRoaXMuaGVpZ2h0LzIpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBnZXRTY2VuZShpZDpzdHJpbmcpOlNjZW5le1xuICAgICAgICAgICAgdmFyIHNjZW5lOlNjZW5lID0gbnVsbDtcbiAgICAgICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgdGhpcy5fc2NlbmVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICBpZih0aGlzLl9zY2VuZXNbaV0uaWQgPT09IGlkKXtcbiAgICAgICAgICAgICAgICAgICAgc2NlbmUgPSB0aGlzLl9zY2VuZXNbaV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gc2NlbmU7XG4gICAgICAgIH1cblxuICAgICAgICBhZGRTY2VuZShzY2VuZTpTY2VuZSk6R2FtZSB7XG4gICAgICAgICAgICB0aGlzLl9zY2VuZXMucHVzaChzY2VuZSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc2l6ZSh3aWR0aDpudW1iZXIsIGhlaWdodDpudW1iZXIsIHJlbmRlcmVyOmJvb2xlYW4gPSBmYWxzZSk6R2FtZXtcbiAgICAgICAgICAgIGlmKHJlbmRlcmVyKXtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnJlc2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5jYW52YXMuc3R5bGUud2lkdGggPSB3aWR0aCArIFwicHhcIjtcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLmhlaWdodCA9IGhlaWdodCArIFwicHhcIjtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBhdXRvUmVzaXplKG1vZGU6bnVtYmVyKTpHYW1lIHtcbiAgICAgICAgICAgIGlmKHRoaXMuX3Jlc2l6ZUxpc3RlbmVyKXtcbiAgICAgICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5fcmVzaXplTGlzdGVuZXIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihtb2RlID09PSBHQU1FX1NDQUxFX1RZUEUuTk9ORSlyZXR1cm47XG5cbiAgICAgICAgICAgIHN3aXRjaChtb2RlKXtcbiAgICAgICAgICAgICAgICBjYXNlIEdBTUVfU0NBTEVfVFlQRS5BU1BFQ1RfRklUOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZXNpemVMaXN0ZW5lciA9IHRoaXMuX3Jlc2l6ZU1vZGVBc3BlY3RGaXQ7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgR0FNRV9TQ0FMRV9UWVBFLkFTUEVDVF9GSUxMOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZXNpemVMaXN0ZW5lciA9IHRoaXMuX3Jlc2l6ZU1vZGVBc3BlY3RGaWxsO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIEdBTUVfU0NBTEVfVFlQRS5GSUxMOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZXNpemVMaXN0ZW5lciA9IHRoaXMuX3Jlc2l6ZU1vZGVGaWxsO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX3Jlc2l6ZUxpc3RlbmVyLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgdGhpcy5fcmVzaXplTGlzdGVuZXIoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfcmVzaXplTW9kZUFzcGVjdEZpdCgpOnZvaWR7XG4gICAgICAgICAgICB2YXIgd3c6bnVtYmVyID0gcGFyc2VJbnQodGhpcy5jYW52YXMuc3R5bGUud2lkdGgsIDEwKSB8fCB0aGlzLmNhbnZhcy53aWR0aDtcbiAgICAgICAgICAgIHZhciBoaDpudW1iZXIgPSBwYXJzZUludCh0aGlzLmNhbnZhcy5zdHlsZS5oZWlnaHQsIDEwKSB8fCB0aGlzLmNhbnZhcy5oZWlnaHQ7XG4gICAgICAgICAgICBpZih3aW5kb3cuaW5uZXJXaWR0aCAhPT0gd3cgfHwgd2luZG93LmlubmVySGVpZ2h0ICE9PSBoaCl7XG4gICAgICAgICAgICAgICAgdmFyIHNjYWxlOm51bWJlciA9IE1hdGgubWluKHdpbmRvdy5pbm5lcldpZHRoL3RoaXMud2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodC90aGlzLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXNpemUodGhpcy53aWR0aCpzY2FsZSwgdGhpcy5oZWlnaHQqc2NhbGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfcmVzaXplTW9kZUFzcGVjdEZpbGwoKTp2b2lke1xuICAgICAgICAgICAgdmFyIHd3Om51bWJlciA9IHBhcnNlSW50KHRoaXMuY2FudmFzLnN0eWxlLndpZHRoLCAxMCkgfHwgdGhpcy5jYW52YXMud2lkdGg7XG4gICAgICAgICAgICB2YXIgaGg6bnVtYmVyID0gcGFyc2VJbnQodGhpcy5jYW52YXMuc3R5bGUuaGVpZ2h0LCAxMCkgfHwgdGhpcy5jYW52YXMuaGVpZ2h0O1xuICAgICAgICAgICAgaWYod2luZG93LmlubmVyV2lkdGggIT09IHd3IHx8IHdpbmRvdy5pbm5lckhlaWdodCAhPT0gaGgpe1xuICAgICAgICAgICAgICAgIHZhciBzY2FsZTpudW1iZXIgPSBNYXRoLm1heCh3aW5kb3cuaW5uZXJXaWR0aC90aGlzLndpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQvdGhpcy5oZWlnaHQpO1xuICAgICAgICAgICAgICAgIHZhciB3aWR0aDpudW1iZXIgPSB0aGlzLndpZHRoKnNjYWxlO1xuICAgICAgICAgICAgICAgIHZhciBoZWlnaHQ6bnVtYmVyID0gdGhpcy5oZWlnaHQqc2NhbGU7XG5cbiAgICAgICAgICAgICAgICB2YXIgdG9wTWFyZ2luOm51bWJlciA9ICh3aW5kb3cuaW5uZXJIZWlnaHQtaGVpZ2h0KS8yO1xuICAgICAgICAgICAgICAgIHZhciBsZWZ0TWFyZ2luOm51bWJlciA9ICh3aW5kb3cuaW5uZXJXaWR0aC13aWR0aCkvMjtcblxuICAgICAgICAgICAgICAgIHRoaXMucmVzaXplKHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgICAgICAgICAgICAgdmFyIHN0eWxlOmFueSA9IDxhbnk+dGhpcy5jYW52YXMuc3R5bGU7XG4gICAgICAgICAgICAgICAgc3R5bGVbJ21hcmdpbi10b3AnXSA9IHRvcE1hcmdpbiArIFwicHhcIjtcbiAgICAgICAgICAgICAgICBzdHlsZVsnbWFyZ2luLWxlZnQnXSA9IGxlZnRNYXJnaW4gKyBcInB4XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9yZXNpemVNb2RlRmlsbCgpOnZvaWR7XG4gICAgICAgICAgICB2YXIgd3c6bnVtYmVyID0gcGFyc2VJbnQodGhpcy5jYW52YXMuc3R5bGUud2lkdGgsIDEwKSB8fCB0aGlzLmNhbnZhcy53aWR0aDtcbiAgICAgICAgICAgIHZhciBoaDpudW1iZXIgPSBwYXJzZUludCh0aGlzLmNhbnZhcy5zdHlsZS5oZWlnaHQsIDEwKSB8fCB0aGlzLmNhbnZhcy5oZWlnaHQ7XG4gICAgICAgICAgICBpZih3aW5kb3cuaW5uZXJXaWR0aCAhPT0gd3cgfHwgd2luZG93LmlubmVySGVpZ2h0ICE9PSBoaCkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVzaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHdpZHRoKCk6bnVtYmVyIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbmRlcmVyLndpZHRoO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGhlaWdodCgpOm51bWJlciB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJlci5oZWlnaHQ7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgR2FtZUNvbmZpZyB7XG4gICAgICAgIGlkPzpzdHJpbmc7XG4gICAgICAgIHdpZHRoPzpudW1iZXI7XG4gICAgICAgIGhlaWdodD86bnVtYmVyO1xuICAgICAgICB1c2VXZWJBdWRpbz86Ym9vbGVhbjtcbiAgICAgICAgdXNlUGVyc2lzdGFudERhdGE/OmJvb2xlYW47XG4gICAgICAgIGdhbWVTY2FsZVR5cGU/Om51bWJlcjtcbiAgICB9XG59XG5cbmludGVyZmFjZSBPYmplY3Qge1xuICAgIGFzc2lnbih0YXJnZXQ6T2JqZWN0LCAuLi5zb3VyY2VzOk9iamVjdFtdKTpPYmplY3Q7XG59IiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vZGVmcy9waXhpLmpzLmQudHNcIiAvPlxuXG5tb2R1bGUgUElYSSB7XG4gICAgQ29udGFpbmVyLl9raWxsZWRPYmplY3RzID0gW107XG5cbiAgICBDb250YWluZXIucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKGRlbHRhVGltZTogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMucG9zaXRpb24ueCArPSB0aGlzLnZlbG9jaXR5LnggKiBkZWx0YVRpbWU7XG4gICAgICAgIHRoaXMucG9zaXRpb24ueSArPSB0aGlzLnZlbG9jaXR5LnkgKiBkZWx0YVRpbWU7XG4gICAgICAgIHRoaXMucm90YXRpb24gKz0gdGhpcy5yb3RhdGlvblNwZWVkICogZGVsdGFUaW1lO1xuXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5baV0udXBkYXRlKGRlbHRhVGltZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgQ29udGFpbmVyLnByb3RvdHlwZS5hZGRUbyA9IGZ1bmN0aW9uKHBhcmVudCl7XG4gICAgICAgIHBhcmVudC5hZGRDaGlsZCh0aGlzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIENvbnRhaW5lci5wcm90b3R5cGUua2lsbCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFBJWEkuQ29udGFpbmVyLl9raWxsZWRPYmplY3RzLnB1c2godGhpcyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBDb250YWluZXIucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmKHRoaXMucGFyZW50KXtcbiAgICAgICAgICAgIHRoaXMucGFyZW50LnJlbW92ZUNoaWxkKHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2RlZnMvcGl4aS5qcy5kLnRzXCIgLz5cblxubW9kdWxlIFBJWEkge1xuICAgIERpc3BsYXlPYmplY3QucHJvdG90eXBlLnNwZWVkID0gMDtcbiAgICBEaXNwbGF5T2JqZWN0LnByb3RvdHlwZS52ZWxvY2l0eSA9IG5ldyBQb2ludCgpO1xuICAgIERpc3BsYXlPYmplY3QucHJvdG90eXBlLmRpcmVjdGlvbiA9IDA7XG4gICAgRGlzcGxheU9iamVjdC5wcm90b3R5cGUucm90YXRpb25TcGVlZCA9IDA7XG5cbiAgICBEaXNwbGF5T2JqZWN0LnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihkZWx0YVRpbWU6bnVtYmVyKXtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
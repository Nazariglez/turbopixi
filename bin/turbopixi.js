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
    var PIXI;
    (function (PIXI) {
        function bitmapFontParserTXT() {
            return function (resource, next) {
                //skip if no data or if not txt
                if (!resource.data || resource.xhrType !== 'text') {
                    return next();
                }
                var text = resource.data;
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
                var textureUrl = getTextureUrl(url, resource.data);
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
            var lines = resource.data.split('\n');
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
                resource.bitmapFont = data;
                PIXI.extras.BitmapText.fonts[data.font] = data;
            }
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
    ///<reference path="../../defs/pixi.js.d.ts" />
    ///<reference path="./bitmapFontParserTxt.ts" />
    var PIXI;
    (function (PIXI) {
        PIXI.loaders.Loader.addPixiMiddleware(PIXI.bitmapFontParserTXT);
    }(PIXI || (PIXI = {})));
    ///<reference path="../../defs/pixi.js.d.ts" />
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
}(typeof PIXI === 'object' ? PIXI : null));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInR1cmJvcGl4aS5qcyIsImluZGV4LnRzIiwiYXVkaW8vQXVkaW9NYW5hZ2VyLnRzIiwiY29yZS9EYXRhTWFuYWdlci50cyIsImNvcmUvRGV2aWNlLnRzIiwiZGlzcGxheS9TY2VuZS50cyIsImlucHV0L0lucHV0TWFuYWdlci50cyIsImxvYWRlci9iaXRtYXBGb250UGFyc2VyVFhULnRzIiwibG9hZGVyL0xvYWRlci50cyIsImNvcmUvR2FtZS50cyIsImRpc3BsYXkvQ29udGFpbmVyLnRzIiwiZGlzcGxheS9EaXNwbGF5T2JqZWN0LnRzIl0sIm5hbWVzIjpbIlBJWEkiLCJFcnJvciIsIlBJWElfVkVSU0lPTl9SRVFVSVJFRCIsIlBJWElfVkVSU0lPTiIsIlZFUlNJT04iLCJtYXRjaCIsIlBJWEkuR0FNRV9TQ0FMRV9UWVBFIiwiUElYSS5BVURJT19UWVBFIiwiUElYSS5BdWRpb01hbmFnZXIiLCJQSVhJLkF1ZGlvTWFuYWdlci5jb25zdHJ1Y3RvciIsIlBJWEkuRGF0YU1hbmFnZXIiLCJQSVhJLkRhdGFNYW5hZ2VyLmNvbnN0cnVjdG9yIiwiUElYSS5EYXRhTWFuYWdlci5sb2FkIiwiUElYSS5EYXRhTWFuYWdlci5zYXZlIiwiUElYSS5EYXRhTWFuYWdlci5yZXNldCIsIlBJWEkuRGF0YU1hbmFnZXIuc2V0IiwiUElYSS5EYXRhTWFuYWdlci5nZXQiLCJQSVhJLkRhdGFNYW5hZ2VyLmRlbCIsImhhc01vdXNlV2hlZWwiLCJldnQiLCJ3aW5kb3ciLCJoYXNWaWJyYXRlIiwibmF2aWdhdG9yIiwidmlicmF0ZSIsInBhdHRlcm4iLCJkb2N1bWVudCIsImhpZGRlbiIsIndlYmtpdEhpZGRlbiIsIm1vekhpZGRlbiIsIm1zSGlkZGVuIiwiUElYSS5pc09ubGluZSIsIl9fZXh0ZW5kcyIsImQiLCJiIiwicCIsImhhc093blByb3BlcnR5IiwiX18iLCJjb25zdHJ1Y3RvciIsInByb3RvdHlwZSIsIlBJWEkuU2NlbmUiLCJQSVhJLlNjZW5lLmNvbnN0cnVjdG9yIiwiUElYSS5TY2VuZS5hZGRUbyIsIlBJWEkuSW5wdXRNYW5hZ2VyIiwiUElYSS5JbnB1dE1hbmFnZXIuY29uc3RydWN0b3IiLCJQSVhJLmJpdG1hcEZvbnRQYXJzZXJUWFQiLCJyZXNvdXJjZSIsImRhdGEiLCJ4aHJUeXBlIiwibmV4dCIsInRleHQiLCJpbmRleE9mIiwidXJsIiwiZGlybmFtZSIsImJhc2VVcmwiLCJjaGFyQXQiLCJsZW5ndGgiLCJyZXBsYWNlIiwidGV4dHVyZVVybCIsImdldFRleHR1cmVVcmwiLCJ1dGlscyIsIlRleHR1cmVDYWNoZSIsInBhcnNlIiwibG9hZE9wdGlvbnMiLCJjcm9zc09yaWdpbiIsImxvYWRUeXBlIiwibG9hZGVycyIsIlJlc291cmNlIiwiTE9BRF9UWVBFIiwiSU1BR0UiLCJhZGQiLCJuYW1lIiwicmVzIiwidGV4dHVyZSIsIlBJWEkucGFyc2UiLCJQSVhJLmRpcm5hbWUiLCJQSVhJLmdldFRleHR1cmVVcmwiLCJQSVhJLmdldEF0dHIiLCJQSVhJLkdhbWUiLCJQSVhJLkdhbWUuY29uc3RydWN0b3IiLCJQSVhJLkdhbWUuX2FuaW1hdGUiLCJQSVhJLkdhbWUudXBkYXRlIiwiUElYSS5HYW1lLnN0YXJ0IiwiUElYSS5HYW1lLnN0b3AiLCJQSVhJLkdhbWUuZW5hYmxlU3RvcEF0TG9zdEZvY3VzIiwiUElYSS5HYW1lLmRpc2FibGVTdG9wQXRMb3N0Rm9jdXMiLCJQSVhJLkdhbWUuX29uVmlzaWJpbGl0eUNoYW5nZSIsIlBJWEkuR2FtZS5vbkxvc3RGb2N1cyIsIlBJWEkuR2FtZS5zZXRTY2VuZSIsIlBJWEkuR2FtZS5nZXRTY2VuZSIsIlBJWEkuR2FtZS5jcmVhdGVTY2VuZSIsIlBJWEkuR2FtZS5yZW1vdmVTY2VuZSIsIlBJWEkuR2FtZS5hZGRTY2VuZSIsIlBJWEkuR2FtZS5yZW1vdmVBbGxTY2VuZXMiLCJQSVhJLkdhbWUucmVzaXplIiwiUElYSS5HYW1lLmF1dG9SZXNpemUiLCJQSVhJLkdhbWUuX3Jlc2l6ZU1vZGVBc3BlY3RGaXQiLCJQSVhJLkdhbWUuX3Jlc2l6ZU1vZGVBc3BlY3RGaWxsIiwiUElYSS5HYW1lLl9yZXNpemVNb2RlRmlsbCIsImdldCIsIlBJWEkuR2FtZS53aWR0aCIsImVudW1lcmFibGUiLCJjb25maWd1cmFibGUiLCJQSVhJLkdhbWUuaGVpZ2h0IiwicG9zaXRpb24iLCJ4IiwidmVsb2NpdHkiLCJkZWx0YVRpbWUiLCJ5Iiwicm90YXRpb24iLCJyb3RhdGlvblNwZWVkIiwiaSIsImNoaWxkcmVuIiwidXBkYXRlIiwicGFyZW50IiwiYWRkQ2hpbGQiLCJDb250YWluZXIiLCJfa2lsbGVkT2JqZWN0cyIsInB1c2giLCJyZW1vdmVDaGlsZCJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7SUNMQSxJQUFHLENBQUNBLElBQUosRUFBUztBQUFBLFFBQ0wsTUFBTSxJQUFJQyxLQUFKLENBQVUsd0JBQVYsQ0FBTixDQURLO0FBQUE7SUFJVCxJQUFNQyxxQkFBQSxHQUF3QixPQUE5QjtJQUNBLElBQU1DLFlBQUEsR0FBZUgsSUFBQSxDQUFLSSxPQUFMLENBQWFDLEtBQWIsQ0FBbUIsVUFBbkIsRUFBK0IsQ0FBL0IsQ0FBckI7SUFFQSxJQUFHRixZQUFBLEdBQWVELHFCQUFsQixFQUF3QztBQUFBLFFBQ3BDLE1BQU0sSUFBSUQsS0FBSixDQUFVLGNBQWNELElBQUEsQ0FBS0ksT0FBbkIsR0FBNkIsb0NBQTdCLEdBQW1FRixxQkFBN0UsQ0FBTixDQURvQztBQUFBO0lBSXhDLElBQU9GLElBQVA7SUFBQSxDQUFBLFVBQU9BLElBQVAsRUFBWTtBQUFBLFFBQ1JBLENBQUFBLFVBQVlBLGVBQVpBLEVBQTJCQTtBQUFBQSxZQUN2Qk0sZUFBQUEsQ0FBQUEsZUFBQUEsQ0FBQUEsTUFBQUEsSUFBQUEsQ0FBQUEsSUFBQUEsTUFBQUEsQ0FEdUJOO0FBQUFBLFlBRXZCTSxlQUFBQSxDQUFBQSxlQUFBQSxDQUFBQSxNQUFBQSxJQUFBQSxDQUFBQSxJQUFBQSxNQUFBQSxDQUZ1Qk47QUFBQUEsWUFHdkJNLGVBQUFBLENBQUFB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SkEsRUFBbkNBLENBRlE7QUFBQSxRQUdSQSxJQUFBQSxDQUFBQSxhQUFBQSxDQUFjQSxTQUFkQSxDQUF3QkEsU0FBeEJBLEdBQW9DQSxDQUFwQ0EsQ0FIUTtBQUFBLFFBSVJBLElBQUFBLENBQUFBLGFBQUFBLENBQWNBLFNBQWRBLENBQXdCQSxhQUF4QkEsR0FBd0NBLENBQXhDQSxDQUpRO0FBQUEsUUFNUkEsSUFBQUEsQ0FBQUEsYUFBQUEsQ0FBY0EsU0FBZEEsQ0FBd0JBLE1BQXhCQSxHQUFpQ0EsVUFBU0EsU0FBVEEsRUFBeUJBO0FBQUFBLFlBQ3RELE9BQU8sSUFBUCxDQURzREE7QUFBQUEsU0FBMURBLENBTlE7QUFBQSxLQUFaLENBQU9BLElBQUEsSUFBQSxDQUFBQSxJQUFBLEdBQUksRUFBSixDQUFQIiwiZmlsZSI6InR1cmJvcGl4aS5qcyIsInNvdXJjZXNDb250ZW50IjpbbnVsbCwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vZGVmcy9waXhpLmpzLmQudHNcIiAvPlxuaWYoIVBJWEkpe1xuICAgIHRocm93IG5ldyBFcnJvcignRXkhIFdoZXJlIGlzIHBpeGkuanM/PycpO1xufVxuXG5jb25zdCBQSVhJX1ZFUlNJT05fUkVRVUlSRUQgPSBcIjMuMC43XCI7XG5jb25zdCBQSVhJX1ZFUlNJT04gPSBQSVhJLlZFUlNJT04ubWF0Y2goL1xcZC5cXGQuXFxkLylbMF07XG5cbmlmKFBJWElfVkVSU0lPTiA8IFBJWElfVkVSU0lPTl9SRVFVSVJFRCl7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiUGl4aS5qcyB2XCIgKyBQSVhJLlZFUlNJT04gKyBcIiBpdCdzIG5vdCBzdXBwb3J0ZWQsIHBsZWFzZSB1c2UgXlwiICsgUElYSV9WRVJTSU9OX1JFUVVJUkVEKTtcbn1cblxubW9kdWxlIFBJWEkge1xuICAgIGV4cG9ydCBlbnVtIEdBTUVfU0NBTEVfVFlQRSB7XG4gICAgICAgIE5PTkUsXG4gICAgICAgIEZJTEwsXG4gICAgICAgIEFTUEVDVF9GSVQsXG4gICAgICAgIEFTUEVDVF9GSUxMXG4gICAgfVxuXG4gICAgZXhwb3J0IGVudW0gQVVESU9fVFlQRSB7XG4gICAgICAgIFVOS05PV04sXG4gICAgICAgIFdFQkFVRElPLFxuICAgICAgICBIVE1MQVVESU9cbiAgICB9XG59XG4iLCJtb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IGNsYXNzIEF1ZGlvTWFuYWdlcntcbiAgICAgICAgZ2FtZTpHYW1lO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGdhbWU6IEdhbWUpe1xuICAgICAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJtb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IGNsYXNzIERhdGFNYW5hZ2Vye1xuICAgICAgICBnYW1lOkdhbWU7XG4gICAgICAgIHVzZVBlcnNpc3RhbnREYXRhOmJvb2xlYW47XG5cbiAgICAgICAgcHJpdmF0ZSBfZGF0YTphbnk7XG5cbiAgICAgICAgY29uc3RydWN0b3IoZ2FtZTpHYW1lLCB1c2VQZXJzaXRhbnREYXRhOmJvb2xlYW4gPSBmYWxzZSl7XG4gICAgICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICAgICAgdGhpcy51c2VQZXJzaXN0YW50RGF0YSA9IHVzZVBlcnNpdGFudERhdGE7XG4gICAgICAgICAgICB0aGlzLmxvYWQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxvYWQoKTpEYXRhTWFuYWdlcntcbiAgICAgICAgICAgIHRoaXMuX2RhdGEgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMuZ2FtZS5pZCkpIHx8IHt9O1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBzYXZlKCk6RGF0YU1hbmFnZXJ7XG4gICAgICAgICAgICBpZih0aGlzLnVzZVBlcnNpc3RhbnREYXRhKXtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLmdhbWUuaWQsIEpTT04uc3RyaW5naWZ5KHRoaXMuX2RhdGEpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzZXQoKTpEYXRhTWFuYWdlcntcbiAgICAgICAgICAgIHRoaXMuX2RhdGEgPSB7fTtcbiAgICAgICAgICAgIHRoaXMuc2F2ZSgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBzZXQoa2V5OnN0cmluZyB8IE9iamVjdCwgdmFsdWU/OmFueSk6RGF0YU1hbmFnZXJ7XG4gICAgICAgICAgICBpZihPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoa2V5KSA9PT0gXCJbb2JqZWN0IE9iamVjdF1cIil7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLl9kYXRhLCBrZXkpO1xuICAgICAgICAgICAgfWVsc2UgaWYodHlwZW9mIGtleSA9PT0gXCJzdHJpbmdcIil7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGF0YVtrZXldID0gdmFsdWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuc2F2ZSgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQoa2V5PzpzdHJpbmcpOmFueXtcbiAgICAgICAgICAgIGlmKCFrZXkpe1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9kYXRhO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZGF0YVtrZXldO1xuICAgICAgICB9XG5cbiAgICAgICAgZGVsKGtleTpzdHJpbmcpOkRhdGFNYW5hZ2Vye1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2RhdGFba2V5XTtcbiAgICAgICAgICAgIHRoaXMuc2F2ZSgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgIH1cbn0iLCIvL01hbnkgY2hlY2tzIGFyZSBiYXNlZCBvbiBodHRwczovL2dpdGh1Yi5jb20vYXJhc2F0YXNheWdpbi9pcy5qcy9ibG9iL21hc3Rlci9pcy5qc1xuXG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9kZWZzL3BpeGkuanMuZC50c1wiIC8+XG5tb2R1bGUgUElYSSB7XG4gICAgdmFyIG5hdmlnYXRvcjpOYXZpZ2F0b3IgPSB3aW5kb3cubmF2aWdhdG9yO1xuICAgIHZhciBkb2N1bWVudDpEb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcblxuICAgIHZhciB1c2VyQWdlbnQ6c3RyaW5nID0gJ25hdmlnYXRvcicgaW4gd2luZG93ICYmICd1c2VyQWdlbnQnIGluIG5hdmlnYXRvciAmJiBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkgfHwgJycsXG4gICAgICAgIHZlbmRvcjpzdHJpbmcgPSAnbmF2aWdhdG9yJyBpbiB3aW5kb3cgJiYgJ3ZlbmRvcicgaW4gbmF2aWdhdG9yICYmIG5hdmlnYXRvci52ZW5kb3IudG9Mb3dlckNhc2UoKSB8fCAnJyxcbiAgICAgICAgYXBwVmVyc2lvbjpzdHJpbmcgPSAnbmF2aWdhdG9yJyBpbiB3aW5kb3cgJiYgJ2FwcFZlcnNpb24nIGluIG5hdmlnYXRvciAmJiBuYXZpZ2F0b3IuYXBwVmVyc2lvbi50b0xvd2VyQ2FzZSgpIHx8ICcnO1xuXG4gICAgLy9Ccm93c2Vyc1xuICAgIHZhciBpc0Nocm9tZTpib29sZWFuID0gL2Nocm9tZXxjaHJvbWl1bS9pLnRlc3QodXNlckFnZW50KSAmJiAvZ29vZ2xlIGluYy8udGVzdCh2ZW5kb3IpLFxuICAgICAgICBpc0ZpcmVmb3g6Ym9vbGVhbiA9IC9maXJlZm94L2kudGVzdCh1c2VyQWdlbnQpLFxuICAgICAgICBpc0lFOmJvb2xlYW4gPSAvbXNpZS9pLnRlc3QodXNlckFnZW50KSB8fCBcIkFjdGl2ZVhPYmplY3RcIiBpbiB3aW5kb3csXG4gICAgICAgIGlzT3BlcmE6Ym9vbGVhbiA9IC9eT3BlcmFcXC8vLnRlc3QodXNlckFnZW50KSB8fCAvXFx4MjBPUFJcXC8vLnRlc3QodXNlckFnZW50KSxcbiAgICAgICAgaXNTYWZhcmk6Ym9vbGVhbiA9IC9zYWZhcmkvaS50ZXN0KHVzZXJBZ2VudCkgJiYgL2FwcGxlIGNvbXB1dGVyL2kudGVzdCh2ZW5kb3IpO1xuXG4gICAgLy9EZXZpY2VzICYmIE9TXG4gICAgdmFyIGlzSXBob25lOmJvb2xlYW4gPSAvaXBob25lL2kudGVzdCh1c2VyQWdlbnQpLFxuICAgICAgICBpc0lwYWQ6Ym9vbGVhbiA9IC9pcGFkL2kudGVzdCh1c2VyQWdlbnQpLFxuICAgICAgICBpc0lwb2Q6Ym9vbGVhbiA9IC9pcG9kL2kudGVzdCh1c2VyQWdlbnQpLFxuICAgICAgICBpc0FuZHJvaWQ6Ym9vbGVhbiA9IC9hbmRyb2lkL2kudGVzdCh1c2VyQWdlbnQpLFxuICAgICAgICBpc0FuZHJvaWRQaG9uZTpib29sZWFuID0gL2FuZHJvaWQvaS50ZXN0KHVzZXJBZ2VudCkgJiYgL21vYmlsZS9pLnRlc3QodXNlckFnZW50KSxcbiAgICAgICAgaXNBbmRyb2lkVGFibGV0OmJvb2xlYW4gPSAvYW5kcm9pZC9pLnRlc3QodXNlckFnZW50KSAmJiAhL21vYmlsZS9pLnRlc3QodXNlckFnZW50KSxcbiAgICAgICAgaXNMaW51eDpib29sZWFuID0gL2xpbnV4L2kudGVzdChhcHBWZXJzaW9uKSxcbiAgICAgICAgaXNNYWM6Ym9vbGVhbiA9IC9tYWMvaS50ZXN0KGFwcFZlcnNpb24pLFxuICAgICAgICBpc1dpbmRvdzpib29sZWFuID0gL3dpbi9pLnRlc3QoYXBwVmVyc2lvbiksXG4gICAgICAgIGlzV2luZG93UGhvbmU6Ym9vbGVhbiA9IGlzV2luZG93ICYmIC9waG9uZS9pLnRlc3QodXNlckFnZW50KSxcbiAgICAgICAgaXNXaW5kb3dUYWJsZXQ6Ym9vbGVhbiA9IGlzV2luZG93ICYmICFpc1dpbmRvd1Bob25lICYmIC90b3VjaC9pLnRlc3QodXNlckFnZW50KSxcbiAgICAgICAgaXNNb2JpbGU6Ym9vbGVhbiA9IGlzSXBob25lIHx8IGlzSXBvZHx8IGlzQW5kcm9pZFBob25lIHx8IGlzV2luZG93UGhvbmUsXG4gICAgICAgIGlzVGFibGV0OmJvb2xlYW4gPSBpc0lwYWQgfHwgaXNBbmRyb2lkVGFibGV0IHx8IGlzV2luZG93VGFibGV0LFxuICAgICAgICBpc0Rlc2t0b3A6Ym9vbGVhbiA9ICFpc01vYmlsZSAmJiAhaXNUYWJsZXQsXG4gICAgICAgIGlzVG91Y2hEZXZpY2U6Ym9vbGVhbiA9ICdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdyB8fCdEb2N1bWVudFRvdWNoJyBpbiB3aW5kb3cgJiYgZG9jdW1lbnQgaW5zdGFuY2VvZiBEb2N1bWVudFRvdWNoLFxuICAgICAgICBpc0NvY29vbjpib29sZWFuID0gISFuYXZpZ2F0b3IuaXNDb2Nvb25KUyxcbiAgICAgICAgaXNOb2RlV2Via2l0OmJvb2xlYW4gPSAhISh0eXBlb2YgcHJvY2VzcyA9PT0gXCJvYmplY3RcIiAmJiBwcm9jZXNzLnRpdGxlID09PSBcIm5vZGVcIiAmJiB0eXBlb2YgZ2xvYmFsID09PSBcIm9iamVjdFwiKSxcbiAgICAgICAgaXNFamVjdGE6Ym9vbGVhbiA9ICEhd2luZG93LmVqZWN0YSxcbiAgICAgICAgaXNDcm9zc3dhbGs6Ym9vbGVhbiA9IC9Dcm9zc3dhbGsvLnRlc3QodXNlckFnZW50KSxcbiAgICAgICAgaXNDb3Jkb3ZhOmJvb2xlYW4gPSAhIXdpbmRvdy5jb3Jkb3ZhLFxuICAgICAgICBpc0VsZWN0cm9uOmJvb2xlYW4gPSAhISh0eXBlb2YgcHJvY2VzcyA9PT0gXCJvYmplY3RcIiAmJiBwcm9jZXNzLnZlcnNpb25zICYmIChwcm9jZXNzLnZlcnNpb25zLmVsZWN0cm9uIHx8IHByb2Nlc3MudmVyc2lvbnNbJ2F0b20tc2hlbGwnXSkpO1xuXG4gICAgdmFyIGhhc1ZpYnJhdGU6Ym9vbGVhbiA9ICEhbmF2aWdhdG9yLnZpYnJhdGUgJiYgKGlzTW9iaWxlIHx8IGlzVGFibGV0KSxcbiAgICAgICAgaGFzTW91c2VXaGVlbDpib29sZWFuID0gJ29ud2hlZWwnIGluIHdpbmRvdyB8fCAnb25tb3VzZXdoZWVsJyBpbiB3aW5kb3cgfHwgJ01vdXNlU2Nyb2xsRXZlbnQnIGluIHdpbmRvdyxcbiAgICAgICAgaGFzQWNjZWxlcm9tZXRlcjpib29sZWFuID0gJ0RldmljZU1vdGlvbkV2ZW50JyBpbiB3aW5kb3csXG4gICAgICAgIGhhc0dhbWVwYWQ6Ym9vbGVhbiA9ICEhbmF2aWdhdG9yLmdldEdhbWVwYWRzIHx8ICEhbmF2aWdhdG9yLndlYmtpdEdldEdhbWVwYWRzO1xuXG4gICAgLy9GdWxsU2NyZWVuXG4gICAgdmFyIGRpdjpIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHZhciBmdWxsU2NyZWVuUmVxdWVzdDphbnkgPSBkaXYucmVxdWVzdEZ1bGxzY3JlZW4gfHwgZGl2LndlYmtpdFJlcXVlc3RGdWxsU2NyZWVuIHx8IGRpdi5tc1JlcXVlc3RGdWxsU2NyZWVuIHx8IGRpdi5tb3pSZXF1ZXN0RnVsbFNjcmVlbixcbiAgICAgICAgZnVsbFNjcmVlbkNhbmNlbDphbnkgPSBkb2N1bWVudC5jYW5jZWxGdWxsU2NyZWVuIHx8IGRvY3VtZW50LmV4aXRGdWxsU2NyZWVuIHx8IGRvY3VtZW50LndlYmtpdENhbmNlbEZ1bGxTY3JlZW4gfHwgZG9jdW1lbnQubXNDYW5jZWxGdWxsU2NyZWVuIHx8IGRvY3VtZW50Lm1vekNhbmNlbEZ1bGxTY3JlZW4sXG4gICAgICAgIGhhc0Z1bGxTY3JlZW46Ym9vbGVhbiA9ICEhKGZ1bGxTY3JlZW5SZXF1ZXN0ICYmIGZ1bGxTY3JlZW5DYW5jZWwpO1xuXG4gICAgLy9BdWRpb1xuICAgIHZhciBoYXNIVE1MQXVkaW86Ym9vbGVhbiA9ICEhd2luZG93LkF1ZGlvLFxuICAgICAgICB3ZWJBdWRpb0NvbnRleHQ6YW55ID0gd2luZG93LkF1ZGlvQ29udGV4dCB8fCB3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0LFxuICAgICAgICBoYXNXZWJBdWRpbzpib29sZWFuID0gISF3ZWJBdWRpb0NvbnRleHQsXG4gICAgICAgIGhhc0F1ZGlvOmJvb2xlYW4gPSBoYXNXZWJBdWRpbyB8fCBoYXNIVE1MQXVkaW8sXG4gICAgICAgIGhhc01wMzpib29sZWFuID0gZmFsc2UsXG4gICAgICAgIGhhc09nZzpib29sZWFuID0gZmFsc2UsXG4gICAgICAgIGhhc1dhdjpib29sZWFuID0gZmFsc2UsXG4gICAgICAgIGhhc000YTpib29sZWFuID0gZmFsc2U7XG5cbiAgICAvL0F1ZGlvIG1pbWVUeXBlc1xuICAgIGlmKGhhc0F1ZGlvKXtcbiAgICAgICAgdmFyIGF1ZGlvOkhUTUxBdWRpb0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhdWRpbycpO1xuICAgICAgICBoYXNNcDMgPSBhdWRpby5jYW5QbGF5VHlwZSgnYXVkaW8vbXBlZzsnKSAhPT0gXCJcIjtcbiAgICAgICAgaGFzT2dnID0gYXVkaW8uY2FuUGxheVR5cGUoJ2F1ZGlvL29nZzsgY29kZWNzPVwidm9yYmlzXCInKSAhPT0gXCJcIjtcbiAgICAgICAgaGFzV2F2ID0gYXVkaW8uY2FuUGxheVR5cGUoJ2F1ZGlvL3dhdicpICE9PSBcIlwiO1xuICAgICAgICBoYXNNNGEgPSBhdWRpby5jYW5QbGF5VHlwZSgnYXVkaW8vbXA0OyBjb2RlY3M9XCJtcDRhLjQwLjVcIicpICE9PSBcIlwiO1xuICAgIH1cblxuICAgIGV4cG9ydCB2YXIgRGV2aWNlIDogRGV2aWNlRGF0YSA9IHtcbiAgICAgICAgaXNDaHJvbWUgOiBpc0Nocm9tZSxcbiAgICAgICAgaXNGaXJlZm94IDogaXNGaXJlZm94LFxuICAgICAgICBpc0lFIDogaXNJRSxcbiAgICAgICAgaXNPcGVyYSA6IGlzT3BlcmEsXG4gICAgICAgIGlzU2FmYXJpIDogaXNTYWZhcmksXG4gICAgICAgIGlzSXBob25lIDogaXNJcGhvbmUsXG4gICAgICAgIGlzSXBhZCA6IGlzSXBhZCxcbiAgICAgICAgaXNJcG9kIDogaXNJcG9kLFxuICAgICAgICBpc0FuZHJvaWQgOiBpc0FuZHJvaWQsXG4gICAgICAgIGlzQW5kcm9pZFBob25lIDogaXNBbmRyb2lkUGhvbmUsXG4gICAgICAgIGlzQW5kcm9pZFRhYmxldCA6IGlzQW5kcm9pZFRhYmxldCxcbiAgICAgICAgaXNMaW51eCA6IGlzTGludXgsXG4gICAgICAgIGlzTWFjIDogaXNNYWMsXG4gICAgICAgIGlzV2luZG93IDogaXNXaW5kb3csXG4gICAgICAgIGlzV2luZG93UGhvbmUgOiBpc1dpbmRvd1Bob25lLFxuICAgICAgICBpc1dpbmRvd1RhYmxldCA6IGlzV2luZG93VGFibGV0LFxuICAgICAgICBpc01vYmlsZSA6IGlzTW9iaWxlLFxuICAgICAgICBpc1RhYmxldCA6IGlzVGFibGV0LFxuICAgICAgICBpc0Rlc2t0b3AgOiBpc0Rlc2t0b3AsXG4gICAgICAgIGlzVG91Y2hEZXZpY2UgOiBpc1RvdWNoRGV2aWNlLFxuICAgICAgICBpc0NvY29vbiA6IGlzQ29jb29uLFxuICAgICAgICBpc05vZGVXZWJraXQgOiBpc05vZGVXZWJraXQsXG4gICAgICAgIGlzRWplY3RhIDogaXNFamVjdGEsXG4gICAgICAgIGlzQ29yZG92YSA6IGlzQ29yZG92YSxcbiAgICAgICAgaXNDcm9zc3dhbGsgOiBpc0Nyb3Nzd2FsayxcbiAgICAgICAgaXNFbGVjdHJvbiA6IGlzRWxlY3Ryb24sXG4gICAgICAgIGlzQXRvbVNoZWxsIDogaXNFbGVjdHJvbiwgLy9UT0RPOiBSZW1vdmUgc29vbiwgd2hlbiBhdG9tLXNoZWxsICh2ZXJzaW9uKSBpcyBkZXByZWNhdGVkXG5cbiAgICAgICAgLy9pc09ubGluZSA6IG5hdmlnYXRvci5vbkxpbmUsXG4gICAgICAgIGhhc1ZpYnJhdGUgOiBoYXNWaWJyYXRlLFxuICAgICAgICBoYXNNb3VzZVdoZWVsIDogaGFzTW91c2VXaGVlbCxcbiAgICAgICAgaGFzRnVsbFNjcmVlbiA6IGhhc0Z1bGxTY3JlZW4sXG4gICAgICAgIGhhc0FjY2VsZXJvbWV0ZXIgOiBoYXNBY2NlbGVyb21ldGVyLFxuICAgICAgICBoYXNHYW1lcGFkIDogaGFzR2FtZXBhZCxcblxuICAgICAgICBmdWxsU2NyZWVuUmVxdWVzdCA6IGZ1bGxTY3JlZW5SZXF1ZXN0ID8gZnVsbFNjcmVlblJlcXVlc3QubmFtZSA6IHVuZGVmaW5lZCxcbiAgICAgICAgZnVsbFNjcmVlbkNhbmNlbCA6IGZ1bGxTY3JlZW5DYW5jZWwgPyBmdWxsU2NyZWVuQ2FuY2VsLm5hbWUgOiB1bmRlZmluZWQsXG5cbiAgICAgICAgaGFzQXVkaW8gOiBoYXNBdWRpbyxcbiAgICAgICAgaGFzSFRNTEF1ZGlvIDogaGFzSFRNTEF1ZGlvLFxuICAgICAgICBoYXNXZWJBdWRpbzogaGFzV2ViQXVkaW8sXG4gICAgICAgIHdlYkF1ZGlvQ29udGV4dCA6IHdlYkF1ZGlvQ29udGV4dCxcblxuICAgICAgICBoYXNNcDMgOiBoYXNNcDMsXG4gICAgICAgIGhhc000YSA6IGhhc000YSxcbiAgICAgICAgaGFzT2dnIDogaGFzT2dnLFxuICAgICAgICBoYXNXYXYgOiBoYXNXYXYsXG5cbiAgICAgICAgZ2V0TW91c2VXaGVlbEV2ZW50IDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZighaGFzTW91c2VXaGVlbClyZXR1cm47XG4gICAgICAgICAgICB2YXIgZXZ0OnN0cmluZztcbiAgICAgICAgICAgIGlmKCdvbndoZWVsJyBpbiB3aW5kb3cpe1xuICAgICAgICAgICAgICAgIGV2dCA9ICd3aGVlbCc7XG4gICAgICAgICAgICB9ZWxzZSBpZignb25tb3VzZXdoZWVsJyBpbiB3aW5kb3cpe1xuICAgICAgICAgICAgICAgIGV2dCA9ICdtb3VzZXdoZWVsJztcbiAgICAgICAgICAgIH1lbHNlIGlmKCdNb3VzZVNjcm9sbEV2ZW50JyBpbiB3aW5kb3cpe1xuICAgICAgICAgICAgICAgIGV2dCA9ICdET01Nb3VzZVNjcm9sbCc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBldnQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdmlicmF0ZSA6IGZ1bmN0aW9uKHBhdHRlcm46IG51bWJlciB8IG51bWJlcltdKXtcbiAgICAgICAgICAgIGlmKGhhc1ZpYnJhdGUpe1xuICAgICAgICAgICAgICAgIG5hdmlnYXRvci52aWJyYXRlKHBhdHRlcm4pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGdldFZpc2liaWxpdHlDaGFuZ2VFdmVudDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBkb2N1bWVudC5oaWRkZW4gIT09ICd1bmRlZmluZWQnKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ3Zpc2liaWxpdHljaGFuZ2UnO1xuICAgICAgICAgICAgfWVsc2UgaWYodHlwZW9mIGRvY3VtZW50LndlYmtpdEhpZGRlbiAhPT0gJ3VuZGVmaW5lZCcpe1xuICAgICAgICAgICAgICAgIHJldHVybiAnd2Via2l0dmlzaWJpbGl0eWNoYW5nZSc7XG4gICAgICAgICAgICB9ZWxzZSBpZih0eXBlb2YgZG9jdW1lbnQubW96SGlkZGVuICE9PSAndW5kZWZpbmVkJyl7XG4gICAgICAgICAgICAgICAgcmV0dXJuICdtb3p2aXNpYmlsaXR5Y2hhbmdlJztcbiAgICAgICAgICAgIH1lbHNlIGlmKHR5cGVvZiBkb2N1bWVudC5tc0hpZGRlbiAhPT0gJ3VuZGVmaW5lZCcpe1xuICAgICAgICAgICAgICAgIHJldHVybiAnbXN2aXNpYmlsaXR5Y2hhbmdlJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBnZXQgaXNPbmxpbmUoKSB7XG4gICAgICAgICAgICByZXR1cm4gd2luZG93Lm5hdmlnYXRvci5vbkxpbmU7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgZXhwb3J0IGludGVyZmFjZSBEZXZpY2VEYXRhIHtcbiAgICAgICAgaXNDaHJvbWUgOiBib29sZWFuO1xuICAgICAgICBpc0ZpcmVmb3ggOiBib29sZWFuO1xuICAgICAgICBpc0lFIDogYm9vbGVhbjtcbiAgICAgICAgaXNPcGVyYSA6IGJvb2xlYW47XG4gICAgICAgIGlzU2FmYXJpIDogYm9vbGVhbjtcbiAgICAgICAgaXNJcGhvbmUgOiBib29sZWFuO1xuICAgICAgICBpc0lwYWQgOiBib29sZWFuO1xuICAgICAgICBpc0lwb2QgOiBib29sZWFuO1xuICAgICAgICBpc0FuZHJvaWQgOiBib29sZWFuO1xuICAgICAgICBpc0FuZHJvaWRQaG9uZSA6IGJvb2xlYW47XG4gICAgICAgIGlzQW5kcm9pZFRhYmxldCA6IGJvb2xlYW47XG4gICAgICAgIGlzTGludXggOiBib29sZWFuO1xuICAgICAgICBpc01hYyA6IGJvb2xlYW47XG4gICAgICAgIGlzV2luZG93IDogYm9vbGVhbjtcbiAgICAgICAgaXNXaW5kb3dQaG9uZSA6IGJvb2xlYW47XG4gICAgICAgIGlzV2luZG93VGFibGV0IDogYm9vbGVhbjtcbiAgICAgICAgaXNNb2JpbGUgOiBib29sZWFuO1xuICAgICAgICBpc1RhYmxldCA6IGJvb2xlYW47XG4gICAgICAgIGlzRGVza3RvcCA6IGJvb2xlYW47XG4gICAgICAgIGlzVG91Y2hEZXZpY2UgOiBib29sZWFuO1xuICAgICAgICBpc0NvY29vbiA6IGJvb2xlYW47XG4gICAgICAgIGlzTm9kZVdlYmtpdCA6IGJvb2xlYW47XG4gICAgICAgIGlzRWplY3RhIDogYm9vbGVhbjtcbiAgICAgICAgaXNDb3Jkb3ZhIDogYm9vbGVhbjtcbiAgICAgICAgaXNDcm9zc3dhbGsgOiBib29sZWFuO1xuICAgICAgICBpc0VsZWN0cm9uIDogYm9vbGVhbjtcbiAgICAgICAgaXNBdG9tU2hlbGwgOiBib29sZWFuO1xuXG4gICAgICAgIGhhc1ZpYnJhdGUgOiBib29sZWFuO1xuICAgICAgICBoYXNNb3VzZVdoZWVsIDogYm9vbGVhbjtcbiAgICAgICAgaGFzRnVsbFNjcmVlbiA6IGJvb2xlYW47XG4gICAgICAgIGhhc0FjY2VsZXJvbWV0ZXIgOiBib29sZWFuO1xuICAgICAgICBoYXNHYW1lcGFkIDogYm9vbGVhbjtcblxuICAgICAgICBmdWxsU2NyZWVuUmVxdWVzdDpmdWxsU2NyZWVuRGF0YTtcbiAgICAgICAgZnVsbFNjcmVlbkNhbmNlbDpmdWxsU2NyZWVuRGF0YTtcblxuICAgICAgICBoYXNBdWRpbyA6IGJvb2xlYW47XG4gICAgICAgIGhhc0hUTUxBdWRpbyA6IGJvb2xlYW47XG4gICAgICAgIGhhc1dlYkF1ZGlvIDogYm9vbGVhbjtcbiAgICAgICAgd2ViQXVkaW9Db250ZXh0OmFueTtcblxuICAgICAgICBoYXNNcDMgOiBib29sZWFuO1xuICAgICAgICBoYXNNNGEgOiBib29sZWFuO1xuICAgICAgICBoYXNPZ2cgOiBib29sZWFuO1xuICAgICAgICBoYXNXYXYgOiBib29sZWFuO1xuXG4gICAgICAgIGlzT25saW5lOmJvb2xlYW47XG5cbiAgICAgICAgZ2V0TW91c2VXaGVlbEV2ZW50KCk6c3RyaW5nO1xuXG4gICAgICAgIHZpYnJhdGUodmFsdWU6bnVtYmVyKTp2b2lkO1xuXG4gICAgICAgIGdldFZpc2liaWxpdHlDaGFuZ2VFdmVudCgpOnN0cmluZztcbiAgICB9XG59XG5cbmRlY2xhcmUgdmFyIHByb2Nlc3M6YW55LFxuICAgIERvY3VtZW50VG91Y2g6YW55LFxuICAgIGdsb2JhbDphbnk7XG5cbmludGVyZmFjZSBOYXZpZ2F0b3Ige1xuICAgIGlzQ29jb29uSlM6YW55O1xuICAgIHZpYnJhdGUocGF0dGVybjogbnVtYmVyIHwgbnVtYmVyW10pOmJvb2xlYW47XG4gICAgZ2V0R2FtZXBhZHMoKTphbnk7XG4gICAgd2Via2l0R2V0R2FtZXBhZHMoKTphbnk7XG59XG5cbmludGVyZmFjZSBXaW5kb3cge1xuICAgIGVqZWN0YTphbnk7XG4gICAgY29yZG92YTphbnk7XG4gICAgQXVkaW8oKTpIVE1MQXVkaW9FbGVtZW50O1xuICAgIEF1ZGlvQ29udGV4dCgpOmFueTtcbiAgICB3ZWJraXRBdWRpb0NvbnRleHQoKTphbnk7XG59XG5cbmludGVyZmFjZSBmdWxsU2NyZWVuRGF0YSB7XG4gICAgbmFtZTpzdHJpbmc7XG59XG5cbmludGVyZmFjZSBEb2N1bWVudCB7XG4gICAgY2FuY2VsRnVsbFNjcmVlbigpOmZ1bGxTY3JlZW5EYXRhIDtcbiAgICBleGl0RnVsbFNjcmVlbigpOmZ1bGxTY3JlZW5EYXRhIDtcbiAgICB3ZWJraXRDYW5jZWxGdWxsU2NyZWVuKCk6ZnVsbFNjcmVlbkRhdGEgO1xuICAgIG1zQ2FuY2VsRnVsbFNjcmVlbigpOmZ1bGxTY3JlZW5EYXRhIDtcbiAgICBtb3pDYW5jZWxGdWxsU2NyZWVuKCk6ZnVsbFNjcmVlbkRhdGEgO1xuICAgIHdlYmtpdEhpZGRlbjphbnk7XG4gICAgbW96SGlkZGVuOmFueTtcbn1cblxuaW50ZXJmYWNlIEhUTUxEaXZFbGVtZW50IHtcbiAgICByZXF1ZXN0RnVsbHNjcmVlbigpOmZ1bGxTY3JlZW5EYXRhIDtcbiAgICB3ZWJraXRSZXF1ZXN0RnVsbFNjcmVlbigpOmZ1bGxTY3JlZW5EYXRhIDtcbiAgICBtc1JlcXVlc3RGdWxsU2NyZWVuKCk6ZnVsbFNjcmVlbkRhdGEgO1xuICAgIG1velJlcXVlc3RGdWxsU2NyZWVuKCk6ZnVsbFNjcmVlbkRhdGEgO1xufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2RlZnMvcGl4aS5qcy5kLnRzXCIgLz5cbm1vZHVsZSBQSVhJIHtcbiAgICBleHBvcnQgY2xhc3MgU2NlbmUgZXh0ZW5kcyBDb250YWluZXIge1xuICAgICAgICBpZDpzdHJpbmc7XG4gICAgICAgIHN0YXRpYyBfaWRMZW46bnVtYmVyID0gMDtcblxuICAgICAgICBjb25zdHJ1Y3RvcihpZDpzdHJpbmcgPSAoXCJzY2VuZVwiICsgU2NlbmUuX2lkTGVuKyspICl7XG4gICAgICAgICAgICBzdXBlcigpO1xuICAgICAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICB9XG5cbiAgICAgICAgYWRkVG8oZ2FtZTpHYW1lfENvbnRhaW5lcik6U2NlbmUge1xuICAgICAgICAgICAgaWYoZ2FtZSBpbnN0YW5jZW9mIEdhbWUpe1xuICAgICAgICAgICAgICAgIDxHYW1lPmdhbWUuYWRkU2NlbmUodGhpcyk7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NjZW5lcyBjYW4gb25seSBiZSBhZGRlZCB0byB0aGUgZ2FtZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICB9XG59IiwibW9kdWxlIFBJWEkge1xuICAgIGV4cG9ydCBjbGFzcyBJbnB1dE1hbmFnZXJ7XG4gICAgICAgIGdhbWU6R2FtZTtcblxuICAgICAgICBjb25zdHJ1Y3RvcihnYW1lOiBHYW1lKXtcbiAgICAgICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIH1cbiAgICB9XG59IiwibW9kdWxlIFBJWEkge1xuICAgIGV4cG9ydCBmdW5jdGlvbiBiaXRtYXBGb250UGFyc2VyVFhUKCl7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihyZXNvdXJjZTogUElYSS5sb2FkZXJzLlJlc291cmNlLCBuZXh0OkZ1bmN0aW9uKXtcblxuICAgICAgICAgICAgLy9za2lwIGlmIG5vIGRhdGEgb3IgaWYgbm90IHR4dFxuICAgICAgICAgICAgaWYoIXJlc291cmNlLmRhdGEgfHwgcmVzb3VyY2UueGhyVHlwZSAhPT0gXCJ0ZXh0XCIpe1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXh0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciB0ZXh0OnN0cmluZyA9IHJlc291cmNlLmRhdGE7XG5cbiAgICAgICAgICAgIC8vc2tpcCBpZiBub3QgYSBiaXRtYXAgZm9udCBkYXRhXG4gICAgICAgICAgICBpZiggdGV4dC5pbmRleE9mKFwicGFnZVwiKSA9PT0gLTEgfHxcbiAgICAgICAgICAgICAgICB0ZXh0LmluZGV4T2YoXCJmYWNlXCIpID09PSAtMSB8fFxuICAgICAgICAgICAgICAgIHRleHQuaW5kZXhPZihcImluZm9cIikgPT09IC0xIHx8XG4gICAgICAgICAgICAgICAgdGV4dC5pbmRleE9mKFwiY2hhclwiKSA9PT0gLTEgKXtcblxuICAgICAgICAgICAgICAgIHJldHVybiBuZXh0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciB1cmw6c3RyaW5nID0gZGlybmFtZShyZXNvdXJjZS51cmwpO1xuICAgICAgICAgICAgaWYodXJsID09PSBcIi5cIil7XG4gICAgICAgICAgICAgICAgdXJsID0gXCJcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYodGhpcy5iYXNlVXJsICYmIHVybCl7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5iYXNlVXJsLmNoYXJBdCh0aGlzLmJhc2VVcmwubGVuZ3RoLTEpPT09ICcvJyl7XG4gICAgICAgICAgICAgICAgICAgIHVybCArPSAnLyc7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdXJsLnJlcGxhY2UodGhpcy5iYXNlVXJsLCAnJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKHVybCAmJiB1cmwuY2hhckF0KHVybC5sZW5ndGggLSAxKSAhPT0gJy8nKXtcbiAgICAgICAgICAgICAgICB1cmwgKz0gJy8nO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgdGV4dHVyZVVybDpzdHJpbmcgPSBnZXRUZXh0dXJlVXJsKHVybCwgcmVzb3VyY2UuZGF0YSk7XG4gICAgICAgICAgICBpZih1dGlscy5UZXh0dXJlQ2FjaGVbdGV4dHVyZVVybF0pe1xuICAgICAgICAgICAgICAgIHBhcnNlKHJlc291cmNlLCB1dGlscy5UZXh0dXJlQ2FjaGVbdGV4dHVyZVVybF0pO1xuICAgICAgICAgICAgICAgIG5leHQoKTtcbiAgICAgICAgICAgIH1lbHNle1xuXG4gICAgICAgICAgICAgICAgdmFyIGxvYWRPcHRpb25zOmFueSA9IHtcbiAgICAgICAgICAgICAgICAgICAgY3Jvc3NPcmlnaW46IHJlc291cmNlLmNyb3NzT3JpZ2luLFxuICAgICAgICAgICAgICAgICAgICBsb2FkVHlwZTogbG9hZGVycy5SZXNvdXJjZS5MT0FEX1RZUEUuSU1BR0VcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgdGhpcy5hZGQocmVzb3VyY2UubmFtZSArICdfaW1hZ2UnLCB0ZXh0dXJlVXJsLCBsb2FkT3B0aW9ucywgZnVuY3Rpb24ocmVzOmFueSl7XG4gICAgICAgICAgICAgICAgICAgIHBhcnNlKHJlc291cmNlLCByZXMudGV4dHVyZSk7XG4gICAgICAgICAgICAgICAgICAgIG5leHQoKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIG5leHQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlKHJlc291cmNlOmxvYWRlcnMuUmVzb3VyY2UsIHRleHR1cmU6VGV4dHVyZSl7XG4gICAgICAgIHZhciBjdXJyZW50TGluZTpzdHJpbmcsIGF0dHI6YXR0ckRhdGEsXG4gICAgICAgICAgICBkYXRhOmZvbnREYXRhID0ge1xuICAgICAgICAgICAgICAgIGNoYXJzIDoge31cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgdmFyIGxpbmVzOnN0cmluZ1tdID0gcmVzb3VyY2UuZGF0YS5zcGxpdCgnXFxuJyk7XG5cbiAgICAgICAgZm9yKHZhciBpOm51bWJlciA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICBpZihsaW5lc1tpXS5pbmRleE9mKFwiaW5mb1wiKSA9PT0gMCl7XG4gICAgICAgICAgICAgICAgY3VycmVudExpbmUgPSBsaW5lc1tpXS5zdWJzdHJpbmcoNSk7XG4gICAgICAgICAgICAgICAgYXR0ciA9IGdldEF0dHIoY3VycmVudExpbmUpO1xuXG4gICAgICAgICAgICAgICAgZGF0YS5mb250ID0gYXR0ci5mYWNlO1xuICAgICAgICAgICAgICAgIGRhdGEuc2l6ZSA9IHBhcnNlSW50KGF0dHIuc2l6ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKGxpbmVzW2ldLmluZGV4T2YoJ2NvbW1vbiAnKSA9PT0gMCl7XG4gICAgICAgICAgICAgICAgY3VycmVudExpbmUgPSBsaW5lc1tpXS5zdWJzdHJpbmcoNyk7XG4gICAgICAgICAgICAgICAgYXR0ciA9IGdldEF0dHIoY3VycmVudExpbmUpO1xuICAgICAgICAgICAgICAgIGRhdGEubGluZUhlaWdodCA9IHBhcnNlSW50KGF0dHIubGluZUhlaWdodCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKGxpbmVzW2ldLmluZGV4T2YoXCJjaGFyIFwiKSA9PT0gMCl7XG4gICAgICAgICAgICAgICAgY3VycmVudExpbmUgPSBsaW5lc1tpXS5zdWJzdHJpbmcoNSk7XG4gICAgICAgICAgICAgICAgYXR0ciA9IGdldEF0dHIoY3VycmVudExpbmUpO1xuICAgICAgICAgICAgICAgIHZhciBjaGFyQ29kZTpudW1iZXIgPSBwYXJzZUludChhdHRyLmlkKTtcblxuICAgICAgICAgICAgICAgIHZhciB0ZXh0dXJlUmVjdDpSZWN0YW5nbGUgPSBuZXcgUmVjdGFuZ2xlKFxuICAgICAgICAgICAgICAgICAgICBwYXJzZUludChhdHRyLngpLFxuICAgICAgICAgICAgICAgICAgICBwYXJzZUludChhdHRyLnkpLFxuICAgICAgICAgICAgICAgICAgICBwYXJzZUludChhdHRyLndpZHRoKSxcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VJbnQoYXR0ci5oZWlnaHQpXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIGRhdGEuY2hhcnNbY2hhckNvZGVdID0ge1xuICAgICAgICAgICAgICAgICAgICB4T2Zmc2V0OiBwYXJzZUludChhdHRyLnhvZmZzZXQpLFxuICAgICAgICAgICAgICAgICAgICB5T2Zmc2V0OiBwYXJzZUludChhdHRyLnlvZmZzZXQpLFxuICAgICAgICAgICAgICAgICAgICB4QWR2YW5jZTogcGFyc2VJbnQoYXR0ci54YWR2YW5jZSksXG4gICAgICAgICAgICAgICAgICAgIGtlcm5pbmc6IHt9LFxuICAgICAgICAgICAgICAgICAgICB0ZXh0dXJlOiBuZXcgVGV4dHVyZSh0ZXh0dXJlLmJhc2VUZXh0dXJlLCB0ZXh0dXJlUmVjdClcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihsaW5lc1tpXS5pbmRleE9mKCdrZXJuaW5nICcpID09PSAwKXtcbiAgICAgICAgICAgICAgICBjdXJyZW50TGluZSA9IGxpbmVzW2ldLnN1YnN0cmluZyg4KTtcbiAgICAgICAgICAgICAgICBhdHRyID0gZ2V0QXR0cihjdXJyZW50TGluZSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgZmlyc3QgPSBwYXJzZUludChhdHRyLmZpcnN0KTtcbiAgICAgICAgICAgICAgICB2YXIgc2Vjb25kID0gcGFyc2VJbnQoYXR0ci5zZWNvbmQpO1xuXG4gICAgICAgICAgICAgICAgZGF0YS5jaGFyc1tzZWNvbmRdLmtlcm5pbmdbZmlyc3RdID0gcGFyc2VJbnQoYXR0ci5hbW91bnQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXNvdXJjZS5iaXRtYXBGb250ID0gZGF0YTtcbiAgICAgICAgICAgIGV4dHJhcy5CaXRtYXBUZXh0LmZvbnRzW2RhdGEuZm9udF0gPSBkYXRhO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGlybmFtZShwYXRoOnN0cmluZyk6c3RyaW5ne1xuICAgICAgICByZXR1cm4gcGF0aC5yZXBsYWNlKC9cXFxcL2csJy8nKS5yZXBsYWNlKC9cXC9bXlxcL10qJC8sICcnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRUZXh0dXJlVXJsKHVybDpzdHJpbmcsIGRhdGE6c3RyaW5nKTpzdHJpbmd7XG4gICAgICAgIHZhciB0ZXh0dXJlVXJsOnN0cmluZztcbiAgICAgICAgdmFyIGxpbmVzOnN0cmluZ1tdID0gZGF0YS5zcGxpdCgnXFxuJyk7XG5cbiAgICAgICAgZm9yKHZhciBpOm51bWJlciA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICBpZihsaW5lc1tpXS5pbmRleE9mKFwicGFnZVwiKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50TGluZTpzdHJpbmcgPSBsaW5lc1tpXS5zdWJzdHJpbmcoNSk7XG4gICAgICAgICAgICAgICAgdmFyIGZpbGU6c3RyaW5nID0gKGN1cnJlbnRMaW5lLnN1YnN0cmluZyhjdXJyZW50TGluZS5pbmRleE9mKCdmaWxlPScpKSkuc3BsaXQoJz0nKVsxXTtcbiAgICAgICAgICAgICAgICB0ZXh0dXJlVXJsID0gdXJsICsgZmlsZS5zdWJzdHIoMSwgZmlsZS5sZW5ndGgtMik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGV4dHVyZVVybDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRBdHRyKGxpbmU6c3RyaW5nKTphdHRyRGF0YXtcbiAgICAgICAgdmFyIHJlZ2V4OlJlZ0V4cCA9IC9cIihcXHcqXFxkKlxccyooLXxfKSopKlwiL2csXG4gICAgICAgICAgICBhdHRyOnN0cmluZ1tdID0gbGluZS5zcGxpdCgvXFxzKy9nKSxcbiAgICAgICAgICAgIGRhdGE6YW55ID0ge307XG5cbiAgICAgICAgZm9yKHZhciBpOm51bWJlciA9IDA7IGkgPCBhdHRyLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIHZhciBkOnN0cmluZ1tdID0gYXR0cltpXS5zcGxpdCgnPScpO1xuICAgICAgICAgICAgdmFyIG06c3RyaW5nW10gPSBkWzFdLm1hdGNoKHJlZ2V4KTtcbiAgICAgICAgICAgIGlmKG0gJiYgbS5sZW5ndGggPj0gMSl7XG4gICAgICAgICAgICAgICAgZFsxXSA9IGRbMV0uc3Vic3RyKDEsIGRbMV0ubGVuZ3RoLTIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGF0YVtkWzBdXSA9IGRbMV07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gPGF0dHJEYXRhPmRhdGE7XG4gICAgfVxuXG4gICAgaW50ZXJmYWNlIGZvbnREYXRhIHtcbiAgICAgICAgY2hhcnM/IDogYW55O1xuICAgICAgICBmb250PyA6IHN0cmluZztcbiAgICAgICAgc2l6ZT8gOiBudW1iZXI7XG4gICAgICAgIGxpbmVIZWlnaHQ/IDogbnVtYmVyO1xuICAgIH1cblxuICAgIGludGVyZmFjZSBhdHRyRGF0YSB7XG4gICAgICAgIGZhY2U/IDogc3RyaW5nO1xuICAgICAgICBzaXplPyA6IHN0cmluZztcbiAgICAgICAgbGluZUhlaWdodD8gOiBzdHJpbmc7XG4gICAgICAgIGlkPyA6IHN0cmluZztcbiAgICAgICAgeD8gOiBzdHJpbmc7XG4gICAgICAgIHk/IDogc3RyaW5nO1xuICAgICAgICB3aWR0aD8gOiBzdHJpbmc7XG4gICAgICAgIGhlaWdodD8gOiBzdHJpbmc7XG4gICAgICAgIHhvZmZzZXQ/IDogc3RyaW5nO1xuICAgICAgICB5b2Zmc2V0PyA6IHN0cmluZztcbiAgICAgICAgeGFkdmFuY2U/IDogc3RyaW5nO1xuICAgICAgICBmaXJzdD8gOiBzdHJpbmc7XG4gICAgICAgIHNlY29uZD8gOiBzdHJpbmc7XG4gICAgICAgIGFtb3VudD8gOiBzdHJpbmc7XG4gICAgfVxufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2RlZnMvcGl4aS5qcy5kLnRzXCIgLz5cbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4vYml0bWFwRm9udFBhcnNlclR4dC50c1wiIC8+XG5tb2R1bGUgUElYSSB7XG4gICAgbG9hZGVycy5Mb2FkZXIuYWRkUGl4aU1pZGRsZXdhcmUoYml0bWFwRm9udFBhcnNlclRYVCk7XG59IiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vZGVmcy9waXhpLmpzLmQudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi9EZXZpY2UudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vZGlzcGxheS9TY2VuZS50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9hdWRpby9BdWRpb01hbmFnZXIudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vaW5wdXQvSW5wdXRNYW5hZ2VyLnRzXCIgLz5cbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL2xvYWRlci9Mb2FkZXIudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi9EYXRhTWFuYWdlci50c1wiIC8+XG5tb2R1bGUgUElYSSB7XG4gICAgdmFyIGxhc3Q6bnVtYmVyID0gMDtcbiAgICB2YXIgbWF4RnJhbWVNUyA9IDAuMzU7XG5cbiAgICB2YXIgZGVmYXVsdEdhbWVDb25maWcgOiBHYW1lQ29uZmlnID0ge1xuICAgICAgICBpZDogXCJwaXhpLmRlZmF1bHQuaWRcIixcbiAgICAgICAgd2lkdGg6ODAwLFxuICAgICAgICBoZWlnaHQ6NjAwLFxuICAgICAgICB1c2VXZWJBdWRpbzogdHJ1ZSxcbiAgICAgICAgdXNlUGVyc2lzdGFudERhdGE6IGZhbHNlLFxuICAgICAgICBnYW1lU2NhbGVUeXBlOiBHQU1FX1NDQUxFX1RZUEUuTk9ORSxcbiAgICAgICAgc3RvcEF0TG9zdEZvY3VzOiB0cnVlLFxuICAgICAgICBhc3NldHNVcmw6IFwiXCIsXG4gICAgICAgIGxvYWRlckNvbmN1cnJlbmN5OiAxMFxuICAgIH07XG5cbiAgICBleHBvcnQgY2xhc3MgR2FtZSB7XG4gICAgICAgIGlkOnN0cmluZztcbiAgICAgICAgcmFmOmFueTtcblxuICAgICAgICBwcml2YXRlIF9zY2VuZXM6U2NlbmVbXSA9IFtdO1xuICAgICAgICBzY2VuZTpTY2VuZTtcblxuICAgICAgICBhdWRpbzpBdWRpb01hbmFnZXI7XG4gICAgICAgIGlucHV0OklucHV0TWFuYWdlcjtcbiAgICAgICAgZGF0YTpEYXRhTWFuYWdlcjtcbiAgICAgICAgbG9hZGVyOmxvYWRlcnMuTG9hZGVyO1xuXG4gICAgICAgIHJlbmRlcmVyOldlYkdMUmVuZGVyZXIgfCBDYW52YXNSZW5kZXJlcjtcbiAgICAgICAgY2FudmFzOkhUTUxDYW52YXNFbGVtZW50O1xuXG4gICAgICAgIGRlbHRhOm51bWJlciA9IDA7XG4gICAgICAgIHRpbWU6bnVtYmVyID0gMDtcbiAgICAgICAgbGFzdFRpbWU6bnVtYmVyID0gMDtcblxuICAgICAgICBpc1dlYkdMOmJvb2xlYW47XG4gICAgICAgIGlzV2ViQXVkaW86Ym9vbGVhbjtcblxuICAgICAgICBwcml2YXRlIF9yZXNpemVMaXN0ZW5lcjphbnk7XG5cbiAgICAgICAgY29uc3RydWN0b3IoY29uZmlnPzpHYW1lQ29uZmlnLCByZW5kZXJlck9wdGlvbnM/OlJlbmRlcmVyT3B0aW9ucykge1xuICAgICAgICAgICAgY29uZmlnID0gKDxPYmplY3Q+T2JqZWN0KS5hc3NpZ24oZGVmYXVsdEdhbWVDb25maWcsIGNvbmZpZyk7XG4gICAgICAgICAgICB0aGlzLmlkID0gY29uZmlnLmlkO1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJlciA9IGF1dG9EZXRlY3RSZW5kZXJlcihjb25maWcud2lkdGgsIGNvbmZpZy5oZWlnaHQsIHJlbmRlcmVyT3B0aW9ucyk7XG4gICAgICAgICAgICB0aGlzLmNhbnZhcyA9IHRoaXMucmVuZGVyZXIudmlldztcblxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XG5cbiAgICAgICAgICAgIHRoaXMuaXNXZWJHTCA9ICh0aGlzLnJlbmRlcmVyLnR5cGUgPT09IFJFTkRFUkVSX1RZUEUuV0VCR0wpO1xuICAgICAgICAgICAgdGhpcy5pc1dlYkF1ZGlvID0gKERldmljZS5oYXNXZWJBdWRpbyYmY29uZmlnLnVzZVdlYkF1ZGlvKTtcblxuICAgICAgICAgICAgdGhpcy5pbnB1dCA9IG5ldyBJbnB1dE1hbmFnZXIodGhpcyk7XG4gICAgICAgICAgICB0aGlzLmF1ZGlvID0gbmV3IEF1ZGlvTWFuYWdlcih0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IG5ldyBEYXRhTWFuYWdlcih0aGlzLCBjb25maWcudXNlUGVyc2lzdGFudERhdGEpO1xuICAgICAgICAgICAgdGhpcy5sb2FkZXIgPSBuZXcgbG9hZGVycy5Mb2FkZXIoY29uZmlnLmFzc2V0c1VybCwgY29uZmlnLmxvYWRlckNvbmN1cnJlbmN5KTtcblxuICAgICAgICAgICAgdmFyIGluaXRpYWxTY2VuZTpTY2VuZSA9IG5ldyBTY2VuZSgnaW5pdGlhbCcpLmFkZFRvKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5zZXRTY2VuZShpbml0aWFsU2NlbmUpO1xuXG4gICAgICAgICAgICBpZihjb25maWcuZ2FtZVNjYWxlVHlwZSAhPT0gR0FNRV9TQ0FMRV9UWVBFLk5PTkUpe1xuICAgICAgICAgICAgICAgIHRoaXMuYXV0b1Jlc2l6ZShjb25maWcuZ2FtZVNjYWxlVHlwZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKGNvbmZpZy5zdG9wQXRMb3N0Rm9jdXMpe1xuICAgICAgICAgICAgICAgIHRoaXMuZW5hYmxlU3RvcEF0TG9zdEZvY3VzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9hbmltYXRlKCk6dm9pZCB7XG4gICAgICAgICAgICB0aGlzLnJhZiA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5fYW5pbWF0ZS5iaW5kKHRoaXMpKTtcblxuICAgICAgICAgICAgaWYodGhpcy5zY2VuZSkge1xuICAgICAgICAgICAgICAgIHZhciBub3c6bnVtYmVyID0gRGF0ZS5ub3coKTtcblxuICAgICAgICAgICAgICAgIHRoaXMudGltZSArPSBNYXRoLm1pbigobm93IC0gbGFzdCkgLyAxMDAwLCBtYXhGcmFtZU1TKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRlbHRhID0gdGhpcy50aW1lIC0gdGhpcy5sYXN0VGltZTtcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RUaW1lID0gdGhpcy50aW1lO1xuXG4gICAgICAgICAgICAgICAgbGFzdCA9IG5vdztcblxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIucmVuZGVyKHRoaXMuc2NlbmUpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGUodGhpcy5kZWx0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB1cGRhdGUoZGVsdGFUaW1lOm51bWJlcik6R2FtZSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc2NlbmUuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNjZW5lLmNoaWxkcmVuW2ldLnVwZGF0ZSh0aGlzLmRlbHRhKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9jbGVhbiBraWxsZWQgb2JqZWN0c1xuICAgICAgICAgICAgdmFyIGxlbjpudW1iZXIgPSBDb250YWluZXIuX2tpbGxlZE9iamVjdHMubGVuZ3RoO1xuICAgICAgICAgICAgaWYgKGxlbikge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGk6bnVtYmVyID0gMDsgaSA8IGxlbjsgaSsrKSBDb250YWluZXIuX2tpbGxlZE9iamVjdHNbaV0ucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgQ29udGFpbmVyLl9raWxsZWRPYmplY3RzLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhcnQoKTpHYW1lIHtcbiAgICAgICAgICAgIGxhc3QgPSBEYXRlLm5vdygpO1xuICAgICAgICAgICAgdGhpcy5fYW5pbWF0ZSgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBzdG9wKCk6R2FtZSB7XG4gICAgICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5yYWYpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBlbmFibGVTdG9wQXRMb3N0Rm9jdXMoc3RhdGU6Ym9vbGVhbiA9IHRydWUpOkdhbWV7XG4gICAgICAgICAgICBpZihzdGF0ZSl7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihEZXZpY2UuZ2V0VmlzaWJpbGl0eUNoYW5nZUV2ZW50KCksIHRoaXMuX29uVmlzaWJpbGl0eUNoYW5nZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoRGV2aWNlLmdldFZpc2liaWxpdHlDaGFuZ2VFdmVudCgpLCB0aGlzLl9vblZpc2liaWxpdHlDaGFuZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBkaXNhYmxlU3RvcEF0TG9zdEZvY3VzKCk6R2FtZXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVuYWJsZVN0b3BBdExvc3RGb2N1cyhmYWxzZSk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9vblZpc2liaWxpdHlDaGFuZ2UoKXtcbiAgICAgICAgICAgIHZhciBpc0hpZGUgPSAhIShkb2N1bWVudC5oaWRkZW4gfHwgZG9jdW1lbnQud2Via2l0SGlkZGVuIHx8IGRvY3VtZW50Lm1vekhpZGRlbiB8fCBkb2N1bWVudC5tc0hpZGRlbik7XG4gICAgICAgICAgICBpZihpc0hpZGUpe1xuICAgICAgICAgICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLm9uTG9zdEZvY3VzKGlzSGlkZSk7XG4gICAgICAgIH1cblxuICAgICAgICBvbkxvc3RGb2N1cyhpc0hpZGU6Ym9vbGVhbik6R2FtZXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0U2NlbmUoc2NlbmU6U2NlbmUgfCBzdHJpbmcpOkdhbWUge1xuICAgICAgICAgICAgaWYoIShzY2VuZSBpbnN0YW5jZW9mIFNjZW5lKSl7XG4gICAgICAgICAgICAgICAgc2NlbmUgPSB0aGlzLmdldFNjZW5lKDxzdHJpbmc+c2NlbmUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnNjZW5lID0gPFNjZW5lPnNjZW5lO1xuICAgICAgICAgICAgdGhpcy5zY2VuZS5wb3NpdGlvbi5zZXQodGhpcy53aWR0aC8yLCB0aGlzLmhlaWdodC8yKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0U2NlbmUoaWQ6c3RyaW5nKTpTY2VuZXtcbiAgICAgICAgICAgIHZhciBzY2VuZTpTY2VuZSA9IG51bGw7XG4gICAgICAgICAgICBmb3IodmFyIGk6bnVtYmVyID0gMDsgaSA8IHRoaXMuX3NjZW5lcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5fc2NlbmVzW2ldLmlkID09PSBpZCl7XG4gICAgICAgICAgICAgICAgICAgIHNjZW5lID0gdGhpcy5fc2NlbmVzW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHNjZW5lO1xuICAgICAgICB9XG5cbiAgICAgICAgY3JlYXRlU2NlbmUoaWQ/OnN0cmluZyk6U2NlbmUge1xuICAgICAgICAgICAgcmV0dXJuIChuZXcgU2NlbmUoaWQpKS5hZGRUbyh0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZVNjZW5lKHNjZW5lOnN0cmluZyB8IFNjZW5lKTpHYW1le1xuICAgICAgICAgICAgaWYodHlwZW9mIHNjZW5lID09PSBcInN0cmluZ1wiKXtcbiAgICAgICAgICAgICAgICBzY2VuZSA9IHRoaXMuZ2V0U2NlbmUoPHN0cmluZz5zY2VuZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBpbmRleDpudW1iZXIgPSB0aGlzLl9zY2VuZXMuaW5kZXhPZig8U2NlbmU+c2NlbmUpO1xuICAgICAgICAgICAgaWYoaW5kZXggIT09IC0xKXtcbiAgICAgICAgICAgICAgICB0aGlzLl9zY2VuZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBhZGRTY2VuZShzY2VuZTpTY2VuZSk6R2FtZSB7XG4gICAgICAgICAgICB0aGlzLl9zY2VuZXMucHVzaChzY2VuZSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZUFsbFNjZW5lcygpOkdhbWV7XG4gICAgICAgICAgICB0aGlzLl9zY2VuZXMubGVuZ3RoID0gMDtcbiAgICAgICAgICAgIHRoaXMuc2NlbmUgPSBudWxsO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICByZXNpemUod2lkdGg6bnVtYmVyLCBoZWlnaHQ6bnVtYmVyLCByZW5kZXJlcjpib29sZWFuID0gZmFsc2UpOkdhbWV7XG4gICAgICAgICAgICBpZihyZW5kZXJlcil7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5yZXNpemUod2lkdGgsIGhlaWdodCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLndpZHRoID0gd2lkdGggKyBcInB4XCI7XG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyBcInB4XCI7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgYXV0b1Jlc2l6ZShtb2RlOm51bWJlcik6R2FtZSB7XG4gICAgICAgICAgICBpZih0aGlzLl9yZXNpemVMaXN0ZW5lcil7XG4gICAgICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX3Jlc2l6ZUxpc3RlbmVyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYobW9kZSA9PT0gR0FNRV9TQ0FMRV9UWVBFLk5PTkUpcmV0dXJuO1xuXG4gICAgICAgICAgICBzd2l0Y2gobW9kZSl7XG4gICAgICAgICAgICAgICAgY2FzZSBHQU1FX1NDQUxFX1RZUEUuQVNQRUNUX0ZJVDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVzaXplTGlzdGVuZXIgPSB0aGlzLl9yZXNpemVNb2RlQXNwZWN0Rml0O1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIEdBTUVfU0NBTEVfVFlQRS5BU1BFQ1RfRklMTDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVzaXplTGlzdGVuZXIgPSB0aGlzLl9yZXNpemVNb2RlQXNwZWN0RmlsbDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBHQU1FX1NDQUxFX1RZUEUuRklMTDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVzaXplTGlzdGVuZXIgPSB0aGlzLl9yZXNpemVNb2RlRmlsbDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl9yZXNpemVMaXN0ZW5lci5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIHRoaXMuX3Jlc2l6ZUxpc3RlbmVyKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX3Jlc2l6ZU1vZGVBc3BlY3RGaXQoKTp2b2lke1xuICAgICAgICAgICAgdmFyIHd3Om51bWJlciA9IHBhcnNlSW50KHRoaXMuY2FudmFzLnN0eWxlLndpZHRoLCAxMCkgfHwgdGhpcy5jYW52YXMud2lkdGg7XG4gICAgICAgICAgICB2YXIgaGg6bnVtYmVyID0gcGFyc2VJbnQodGhpcy5jYW52YXMuc3R5bGUuaGVpZ2h0LCAxMCkgfHwgdGhpcy5jYW52YXMuaGVpZ2h0O1xuICAgICAgICAgICAgaWYod2luZG93LmlubmVyV2lkdGggIT09IHd3IHx8IHdpbmRvdy5pbm5lckhlaWdodCAhPT0gaGgpe1xuICAgICAgICAgICAgICAgIHZhciBzY2FsZTpudW1iZXIgPSBNYXRoLm1pbih3aW5kb3cuaW5uZXJXaWR0aC90aGlzLndpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQvdGhpcy5oZWlnaHQpO1xuICAgICAgICAgICAgICAgIHRoaXMucmVzaXplKHRoaXMud2lkdGgqc2NhbGUsIHRoaXMuaGVpZ2h0KnNjYWxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX3Jlc2l6ZU1vZGVBc3BlY3RGaWxsKCk6dm9pZHtcbiAgICAgICAgICAgIHZhciB3dzpudW1iZXIgPSBwYXJzZUludCh0aGlzLmNhbnZhcy5zdHlsZS53aWR0aCwgMTApIHx8IHRoaXMuY2FudmFzLndpZHRoO1xuICAgICAgICAgICAgdmFyIGhoOm51bWJlciA9IHBhcnNlSW50KHRoaXMuY2FudmFzLnN0eWxlLmhlaWdodCwgMTApIHx8IHRoaXMuY2FudmFzLmhlaWdodDtcbiAgICAgICAgICAgIGlmKHdpbmRvdy5pbm5lcldpZHRoICE9PSB3dyB8fCB3aW5kb3cuaW5uZXJIZWlnaHQgIT09IGhoKXtcbiAgICAgICAgICAgICAgICB2YXIgc2NhbGU6bnVtYmVyID0gTWF0aC5tYXgod2luZG93LmlubmVyV2lkdGgvdGhpcy53aWR0aCwgd2luZG93LmlubmVySGVpZ2h0L3RoaXMuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICB2YXIgd2lkdGg6bnVtYmVyID0gdGhpcy53aWR0aCpzY2FsZTtcbiAgICAgICAgICAgICAgICB2YXIgaGVpZ2h0Om51bWJlciA9IHRoaXMuaGVpZ2h0KnNjYWxlO1xuXG4gICAgICAgICAgICAgICAgdmFyIHRvcE1hcmdpbjpudW1iZXIgPSAod2luZG93LmlubmVySGVpZ2h0LWhlaWdodCkvMjtcbiAgICAgICAgICAgICAgICB2YXIgbGVmdE1hcmdpbjpudW1iZXIgPSAod2luZG93LmlubmVyV2lkdGgtd2lkdGgpLzI7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnJlc2l6ZSh3aWR0aCwgaGVpZ2h0KTtcblxuICAgICAgICAgICAgICAgIHZhciBzdHlsZTphbnkgPSA8YW55PnRoaXMuY2FudmFzLnN0eWxlO1xuICAgICAgICAgICAgICAgIHN0eWxlWydtYXJnaW4tdG9wJ10gPSB0b3BNYXJnaW4gKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgc3R5bGVbJ21hcmdpbi1sZWZ0J10gPSBsZWZ0TWFyZ2luICsgXCJweFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfcmVzaXplTW9kZUZpbGwoKTp2b2lke1xuICAgICAgICAgICAgdmFyIHd3Om51bWJlciA9IHBhcnNlSW50KHRoaXMuY2FudmFzLnN0eWxlLndpZHRoLCAxMCkgfHwgdGhpcy5jYW52YXMud2lkdGg7XG4gICAgICAgICAgICB2YXIgaGg6bnVtYmVyID0gcGFyc2VJbnQodGhpcy5jYW52YXMuc3R5bGUuaGVpZ2h0LCAxMCkgfHwgdGhpcy5jYW52YXMuaGVpZ2h0O1xuICAgICAgICAgICAgaWYod2luZG93LmlubmVyV2lkdGggIT09IHd3IHx8IHdpbmRvdy5pbm5lckhlaWdodCAhPT0gaGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGdldCB3aWR0aCgpOm51bWJlciB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJlci53aWR0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBoZWlnaHQoKTpudW1iZXIge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyZXIuaGVpZ2h0O1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIEdhbWVDb25maWcge1xuICAgICAgICBpZD86c3RyaW5nO1xuICAgICAgICB3aWR0aD86bnVtYmVyO1xuICAgICAgICBoZWlnaHQ/Om51bWJlcjtcbiAgICAgICAgdXNlV2ViQXVkaW8/OmJvb2xlYW47XG4gICAgICAgIHVzZVBlcnNpc3RhbnREYXRhPzpib29sZWFuO1xuICAgICAgICBnYW1lU2NhbGVUeXBlPzpudW1iZXI7XG4gICAgICAgIHN0b3BBdExvc3RGb2N1cz86Ym9vbGVhbjtcbiAgICAgICAgYXNzZXRzVXJsPzpzdHJpbmc7XG4gICAgICAgIGxvYWRlckNvbmN1cnJlbmN5PzpudW1iZXI7XG4gICAgfVxufVxuXG5pbnRlcmZhY2UgT2JqZWN0IHtcbiAgICBhc3NpZ24odGFyZ2V0Ok9iamVjdCwgLi4uc291cmNlczpPYmplY3RbXSk6T2JqZWN0O1xufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2RlZnMvcGl4aS5qcy5kLnRzXCIgLz5cblxubW9kdWxlIFBJWEkge1xuICAgIENvbnRhaW5lci5fa2lsbGVkT2JqZWN0cyA9IFtdO1xuXG4gICAgQ29udGFpbmVyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihkZWx0YVRpbWU6IG51bWJlcikge1xuICAgICAgICB0aGlzLnBvc2l0aW9uLnggKz0gdGhpcy52ZWxvY2l0eS54ICogZGVsdGFUaW1lO1xuICAgICAgICB0aGlzLnBvc2l0aW9uLnkgKz0gdGhpcy52ZWxvY2l0eS55ICogZGVsdGFUaW1lO1xuICAgICAgICB0aGlzLnJvdGF0aW9uICs9IHRoaXMucm90YXRpb25TcGVlZCAqIGRlbHRhVGltZTtcblxuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuW2ldLnVwZGF0ZShkZWx0YVRpbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIENvbnRhaW5lci5wcm90b3R5cGUuYWRkVG8gPSBmdW5jdGlvbihwYXJlbnQpe1xuICAgICAgICBwYXJlbnQuYWRkQ2hpbGQodGhpcyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBDb250YWluZXIucHJvdG90eXBlLmtpbGwgPSBmdW5jdGlvbigpe1xuICAgICAgICBQSVhJLkNvbnRhaW5lci5fa2lsbGVkT2JqZWN0cy5wdXNoKHRoaXMpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgQ29udGFpbmVyLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbigpe1xuICAgICAgICBpZih0aGlzLnBhcmVudCl7XG4gICAgICAgICAgICB0aGlzLnBhcmVudC5yZW1vdmVDaGlsZCh0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9kZWZzL3BpeGkuanMuZC50c1wiIC8+XG5cbm1vZHVsZSBQSVhJIHtcbiAgICBEaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5zcGVlZCA9IDA7XG4gICAgRGlzcGxheU9iamVjdC5wcm90b3R5cGUudmVsb2NpdHkgPSBuZXcgUG9pbnQoKTtcbiAgICBEaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5kaXJlY3Rpb24gPSAwO1xuICAgIERpc3BsYXlPYmplY3QucHJvdG90eXBlLnJvdGF0aW9uU3BlZWQgPSAwO1xuXG4gICAgRGlzcGxheU9iamVjdC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oZGVsdGFUaW1lOm51bWJlcil7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
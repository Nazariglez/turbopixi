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
                this.soundMaxLines = 10;
                this.musicMaxLines = 1;
                this.musicMuted = false;
                this.soundMuted = false;
                if (PIXI.utils._audioTypeSelected === PIXI.AUDIO_TYPE.WEBAUDIO) {
                    this.context = PIXI.Device.globalWebAudioContext;
                }
            }
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
                this.volume = 1;
                this.muted = false;
            }
            return Audio;
        }();
        PIXI.Audio = Audio;
    }(PIXI || (PIXI = {})));
    var PIXI;
    (function (PIXI) {
        var AudioLine = function () {
            function AudioLine(manager) {
                this.manager = manager;
            }
            return AudioLine;
        }();
        PIXI.AudioLine = AudioLine;
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
            function DataManager(game, usePersistantData) {
                if (usePersistantData === void 0) {
                    usePersistantData = false;
                }
                this.game = game;
                this.usePersistantData = usePersistantData;
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
        function audioParser() {
            return function (resource, next) {
                if (!PIXI.Device.isAudioSupported || !resource.data) {
                    return next();
                }
                var _allowedExt = [
                    'm4a',
                    'ogg',
                    'mp3',
                    'wav'
                ];
                var ext = _getExt(resource.url);
                if (_allowedExt.indexOf(ext) === -1) {
                    return next();
                }
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
                if (!deviceCanPlay) {
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
        function _addToCache(next, name, data) {
            PIXI.utils.AudioCache[name] = new PIXI.Audio(data, name);
            return next();
        }
        function _getExt(url) {
            return url.split('?').shift().split('.').pop().toLowerCase();
        }
    }(PIXI || (PIXI = {})));
    ///<reference path="../../defs/pixi.js.d.ts" />
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
                this.isWebAudio = PIXI.Device.isAudioSupported && PIXI.Device.isWebAudioSupported && config.useWebAudio;
                PIXI.utils._audioTypeSelected = this.isWebAudio ? PIXI.AUDIO_TYPE.WEBAUDIO : PIXI.AUDIO_TYPE.HTMLAUDIO;
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
}(typeof PIXI === 'object' ? PIXI : null));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInR1cmJvcGl4aS5qcyIsImluZGV4LnRzIiwiYXVkaW8vQXVkaW9NYW5hZ2VyLnRzIiwiYXVkaW8vQXVkaW8udHMiLCJhdWRpby9BdWRpb0xpbmUudHMiLCJkaXNwbGF5L0NvbnRhaW5lci50cyIsImRpc3BsYXkvRGlzcGxheU9iamVjdC50cyIsImRpc3BsYXkvU2NlbmUudHMiLCJjb3JlL0RhdGFNYW5hZ2VyLnRzIiwiY29yZS9EZXZpY2UudHMiLCJpbnB1dC9JbnB1dE1hbmFnZXIudHMiLCJsb2FkZXIvYml0bWFwRm9udFBhcnNlclRYVC50cyIsImxvYWRlci9hdWRpb1BhcnNlci50cyIsImNvcmUvVXRpbHMudHMiLCJsb2FkZXIvTG9hZGVyLnRzIiwiY29yZS9HYW1lLnRzIl0sIm5hbWVzIjpbIlBJWEkiLCJFcnJvciIsIlBJWElfVkVSU0lPTl9SRVFVSVJFRCIsIlBJWElfVkVSU0lPTiIsIlZFUlNJT04iLCJtYXRjaCIsIlBJWEkuR0FNRV9TQ0FMRV9UWVBFIiwiUElYSS5BVURJT19UWVBFIiwiUElYSS5BdWRpb01hbmFnZXIiLCJQSVhJLkF1ZGlvTWFuYWdlci5jb25zdHJ1Y3RvciIsIlBJWEkuQXVkaW8iLCJQSVhJLkF1ZGlvLmNvbnN0cnVjdG9yIiwiUElYSS5BdWRpb0xpbmUiLCJQSVhJLkF1ZGlvTGluZS5jb25zdHJ1Y3RvciIsInBvc2l0aW9uIiwieCIsInZlbG9jaXR5IiwiZGVsdGFUaW1lIiwieSIsInJvdGF0aW9uIiwicm90YXRpb25TcGVlZCIsImkiLCJjaGlsZHJlbiIsImxlbmd0aCIsInVwZGF0ZSIsInBhcmVudCIsImFkZENoaWxkIiwiQ29udGFpbmVyIiwiX2tpbGxlZE9iamVjdHMiLCJwdXNoIiwicmVtb3ZlQ2hpbGQiLCJfX2V4dGVuZHMiLCJkIiwiYiIsInAiLCJoYXNPd25Qcm9wZXJ0eSIsIl9fIiwiY29uc3RydWN0b3IiLCJwcm90b3R5cGUiLCJQSVhJLlNjZW5lIiwiUElYSS5TY2VuZS5jb25zdHJ1Y3RvciIsIlBJWEkuU2NlbmUuYWRkVG8iLCJQSVhJLkRhdGFNYW5hZ2VyIiwiUElYSS5EYXRhTWFuYWdlci5jb25zdHJ1Y3RvciIsIlBJWEkuRGF0YU1hbmFnZXIubG9hZCIsIlBJWEkuRGF0YU1hbmFnZXIuc2F2ZSIsIlBJWEkuRGF0YU1hbmFnZXIucmVzZXQiLCJQSVhJLkRhdGFNYW5hZ2VyLnNldCIsIlBJWEkuRGF0YU1hbmFnZXIuZ2V0IiwiUElYSS5EYXRhTWFuYWdlci5kZWwiLCJQSVhJLkRldmljZSIsIlBJWEkuRGV2aWNlLmdldE1vdXNlV2hlZWxFdmVudCIsIlBJWEkuRGV2aWNlLnZpYnJhdGUiLCJQSVhJLkRldmljZS5nZXRWaXNpYmlsaXR5Q2hhbmdlRXZlbnQiLCJQSVhJLkRldmljZS5pc09ubGluZSIsIlBJWEkuSW5wdXRNYW5hZ2VyIiwiUElYSS5JbnB1dE1hbmFnZXIuY29uc3RydWN0b3IiLCJQSVhJLmJpdG1hcEZvbnRQYXJzZXJUWFQiLCJyZXNvdXJjZSIsImRhdGEiLCJ4aHJUeXBlIiwibmV4dCIsInRleHQiLCJ4aHIiLCJyZXNwb25zZVRleHQiLCJpbmRleE9mIiwidXJsIiwiZGlybmFtZSIsImJhc2VVcmwiLCJjaGFyQXQiLCJyZXBsYWNlIiwidGV4dHVyZVVybCIsImdldFRleHR1cmVVcmwiLCJ1dGlscyIsIlRleHR1cmVDYWNoZSIsInBhcnNlIiwibG9hZE9wdGlvbnMiLCJjcm9zc09yaWdpbiIsImxvYWRUeXBlIiwibG9hZGVycyIsIlJlc291cmNlIiwiTE9BRF9UWVBFIiwiSU1BR0UiLCJhZGQiLCJuYW1lIiwicmVzIiwidGV4dHVyZSIsIlBJWEkucGFyc2UiLCJQSVhJLmRpcm5hbWUiLCJQSVhJLmdldFRleHR1cmVVcmwiLCJQSVhJLmdldEF0dHIiLCJQSVhJLmF1ZGlvUGFyc2VyIiwiRGV2aWNlIiwiaXNBdWRpb1N1cHBvcnRlZCIsIl9hbGxvd2VkRXh0IiwiZXh0IiwiX2dldEV4dCIsImRldmljZUNhblBsYXkiLCJpc000YVN1cHBvcnRlZCIsImlzTXAzU3VwcG9ydGVkIiwiaXNPZ2dTdXBwb3J0ZWQiLCJpc1dhdlN1cHBvcnRlZCIsIl9hdWRpb1R5cGVTZWxlY3RlZCIsIkFVRElPX1RZUEUiLCJXRUJBVURJTyIsImdsb2JhbFdlYkF1ZGlvQ29udGV4dCIsImRlY29kZUF1ZGlvRGF0YSIsIl9hZGRUb0NhY2hlIiwiYmluZCIsIlBJWEkuX2FkZFRvQ2FjaGUiLCJQSVhJLl9nZXRFeHQiLCJQSVhJLnV0aWxzIiwiUElYSS5sb2FkZXJzIiwiUElYSS5sb2FkZXJzLlR1cmJvTG9hZGVyIiwiUElYSS5sb2FkZXJzLlR1cmJvTG9hZGVyLmNvbnN0cnVjdG9yIiwiUElYSS5sb2FkZXJzLl9jaGVja0F1ZGlvVHlwZSIsIlBJWEkubG9hZGVycy5fc2V0QXVkaW9FeHQiLCJQSVhJLkdhbWUiLCJQSVhJLkdhbWUuY29uc3RydWN0b3IiLCJQSVhJLkdhbWUuX2FuaW1hdGUiLCJQSVhJLkdhbWUudXBkYXRlIiwiUElYSS5HYW1lLnN0YXJ0IiwiUElYSS5HYW1lLnN0b3AiLCJQSVhJLkdhbWUuZW5hYmxlU3RvcEF0TG9zdEZvY3VzIiwiUElYSS5HYW1lLmRpc2FibGVTdG9wQXRMb3N0Rm9jdXMiLCJQSVhJLkdhbWUuX29uVmlzaWJpbGl0eUNoYW5nZSIsIlBJWEkuR2FtZS5vbkxvc3RGb2N1cyIsIlBJWEkuR2FtZS5zZXRTY2VuZSIsIlBJWEkuR2FtZS5nZXRTY2VuZSIsIlBJWEkuR2FtZS5jcmVhdGVTY2VuZSIsIlBJWEkuR2FtZS5yZW1vdmVTY2VuZSIsIlBJWEkuR2FtZS5hZGRTY2VuZSIsIlBJWEkuR2FtZS5yZW1vdmVBbGxTY2VuZXMiLCJQSVhJLkdhbWUucmVzaXplIiwiUElYSS5HYW1lLmF1dG9SZXNpemUiLCJQSVhJLkdhbWUuX3Jlc2l6ZU1vZGVBc3BlY3RGaXQiLCJQSVhJLkdhbWUuX3Jlc2l6ZU1vZGVBc3BlY3RGaWxsIiwiUElYSS5HYW1lLl9yZXNpemVNb2RlRmlsbCIsImdldCIsIlBJWEkuR2FtZS53aWR0aCIsImVudW1lcmFibGUiLCJjb25maWd1cmFibGUiLCJQSVhJLkdhbWUuaGVpZ2h0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InR1cmJvcGl4aS5qcyIsInNvdXJjZXNDb250ZW50IjpbbnVsbCwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vZGVmcy9waXhpLmpzLmQudHNcIiAvPlxuaWYoIVBJWEkpe1xuICAgIHRocm93IG5ldyBFcnJvcignRXkhIFdoZXJlIGlzIHBpeGkuanM/PycpO1xufVxuXG5jb25zdCBQSVhJX1ZFUlNJT05fUkVRVUlSRUQgPSBcIjMuMC43XCI7XG5jb25zdCBQSVhJX1ZFUlNJT04gPSBQSVhJLlZFUlNJT04ubWF0Y2goL1xcZC5cXGQuXFxkLylbMF07XG5cbmlmKFBJWElfVkVSU0lPTiA8IFBJWElfVkVSU0lPTl9SRVFVSVJFRCl7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiUGl4aS5qcyB2XCIgKyBQSVhJLlZFUlNJT04gKyBcIiBpdCdzIG5vdCBzdXBwb3J0ZWQsIHBsZWFzZSB1c2UgXlwiICsgUElYSV9WRVJTSU9OX1JFUVVJUkVEKTtcbn1cblxubW9kdWxlIFBJWEkge1xuICAgIGV4cG9ydCBlbnVtIEdBTUVfU0NBTEVfVFlQRSB7XG4gICAgICAgIE5PTkUsXG4gICAgICAgIEZJTEwsXG4gICAgICAgIEFTUEVDVF9GSVQsXG4gICAgICAgIEFTUEVDVF9GSUxMXG4gICAgfVxuXG4gICAgZXhwb3J0IGVudW0gQVVESU9fVFlQRSB7XG4gICAgICAgIFVOS05PV04sXG4gICAgICAgIFdFQkFVRElPLFxuICAgICAgICBIVE1MQVVESU9cbiAgICB9XG59XG4iLCJtb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IGNsYXNzIEF1ZGlvTWFuYWdlcntcbiAgICAgICAgc291bmRNYXhMaW5lczpudW1iZXIgPSAxMDtcbiAgICAgICAgbXVzaWNNYXhMaW5lczpudW1iZXIgPSAxO1xuXG4gICAgICAgIG11c2ljTXV0ZWQ6Ym9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBzb3VuZE11dGVkOmJvb2xlYW4gPSBmYWxzZTtcblxuICAgICAgICBjb250ZXh0OkF1ZGlvQ29udGV4dDtcblxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGdhbWU6IEdhbWUpe1xuICAgICAgICAgICAgaWYodXRpbHMuX2F1ZGlvVHlwZVNlbGVjdGVkID09PSBBVURJT19UWVBFLldFQkFVRElPKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0ID0gRGV2aWNlLmdsb2JhbFdlYkF1ZGlvQ29udGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfVxufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4vQXVkaW9NYW5hZ2VyLnRzXCIgLz5cbm1vZHVsZSBQSVhJIHtcbiAgICBleHBvcnQgY2xhc3MgQXVkaW8ge1xuICAgICAgICBsb29wOmJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgdm9sdW1lOm51bWJlciA9IDE7XG4gICAgICAgIG11dGVkOmJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgbWFuYWdlcjpBdWRpb01hbmFnZXI7XG5cbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIHNvdXJjZTphbnksIHB1YmxpYyBpZDpzdHJpbmcpe1xuICAgICAgICB9XG4gICAgfVxufSIsIm1vZHVsZSBQSVhJIHtcbiAgICBleHBvcnQgY2xhc3MgQXVkaW9MaW5lIHtcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG1hbmFnZXI6QXVkaW9NYW5hZ2VyKXtcblxuICAgICAgICB9XG4gICAgfVxufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2RlZnMvcGl4aS5qcy5kLnRzXCIgLz5cblxubW9kdWxlIFBJWEkge1xuICAgIENvbnRhaW5lci5fa2lsbGVkT2JqZWN0cyA9IFtdO1xuXG4gICAgQ29udGFpbmVyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihkZWx0YVRpbWU6IG51bWJlcikge1xuICAgICAgICB0aGlzLnBvc2l0aW9uLnggKz0gdGhpcy52ZWxvY2l0eS54ICogZGVsdGFUaW1lO1xuICAgICAgICB0aGlzLnBvc2l0aW9uLnkgKz0gdGhpcy52ZWxvY2l0eS55ICogZGVsdGFUaW1lO1xuICAgICAgICB0aGlzLnJvdGF0aW9uICs9IHRoaXMucm90YXRpb25TcGVlZCAqIGRlbHRhVGltZTtcblxuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuW2ldLnVwZGF0ZShkZWx0YVRpbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIENvbnRhaW5lci5wcm90b3R5cGUuYWRkVG8gPSBmdW5jdGlvbihwYXJlbnQpe1xuICAgICAgICBwYXJlbnQuYWRkQ2hpbGQodGhpcyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBDb250YWluZXIucHJvdG90eXBlLmtpbGwgPSBmdW5jdGlvbigpe1xuICAgICAgICBQSVhJLkNvbnRhaW5lci5fa2lsbGVkT2JqZWN0cy5wdXNoKHRoaXMpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgQ29udGFpbmVyLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbigpe1xuICAgICAgICBpZih0aGlzLnBhcmVudCl7XG4gICAgICAgICAgICB0aGlzLnBhcmVudC5yZW1vdmVDaGlsZCh0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9kZWZzL3BpeGkuanMuZC50c1wiIC8+XG5cbm1vZHVsZSBQSVhJIHtcbiAgICBEaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5zcGVlZCA9IDA7XG4gICAgRGlzcGxheU9iamVjdC5wcm90b3R5cGUudmVsb2NpdHkgPSBuZXcgUG9pbnQoKTtcbiAgICBEaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5kaXJlY3Rpb24gPSAwO1xuICAgIERpc3BsYXlPYmplY3QucHJvdG90eXBlLnJvdGF0aW9uU3BlZWQgPSAwO1xuXG4gICAgRGlzcGxheU9iamVjdC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oZGVsdGFUaW1lOm51bWJlcil7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG59XG4iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9kZWZzL3BpeGkuanMuZC50c1wiIC8+XG5tb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IGNsYXNzIFNjZW5lIGV4dGVuZHMgQ29udGFpbmVyIHtcbiAgICAgICAgaWQ6c3RyaW5nO1xuICAgICAgICBzdGF0aWMgX2lkTGVuOm51bWJlciA9IDA7XG5cbiAgICAgICAgY29uc3RydWN0b3IoaWQ6c3RyaW5nID0gKFwic2NlbmVcIiArIFNjZW5lLl9pZExlbisrKSApe1xuICAgICAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGFkZFRvKGdhbWU6R2FtZXxDb250YWluZXIpOlNjZW5lIHtcbiAgICAgICAgICAgIGlmKGdhbWUgaW5zdGFuY2VvZiBHYW1lKXtcbiAgICAgICAgICAgICAgICA8R2FtZT5nYW1lLmFkZFNjZW5lKHRoaXMpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTY2VuZXMgY2FuIG9ubHkgYmUgYWRkZWQgdG8gdGhlIGdhbWUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfVxufSIsIm1vZHVsZSBQSVhJIHtcbiAgICBleHBvcnQgY2xhc3MgRGF0YU1hbmFnZXJ7XG4gICAgICAgIHByaXZhdGUgX2RhdGE6YW55O1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZ2FtZTpHYW1lLCBwdWJsaWMgdXNlUGVyc2lzdGFudERhdGE6Ym9vbGVhbiA9IGZhbHNlKXtcbiAgICAgICAgICAgIHRoaXMubG9hZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgbG9hZCgpOkRhdGFNYW5hZ2Vye1xuICAgICAgICAgICAgdGhpcy5fZGF0YSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5nYW1lLmlkKSkgfHwge307XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHNhdmUoKTpEYXRhTWFuYWdlcntcbiAgICAgICAgICAgIGlmKHRoaXMudXNlUGVyc2lzdGFudERhdGEpe1xuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMuZ2FtZS5pZCwgSlNPTi5zdHJpbmdpZnkodGhpcy5fZGF0YSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICByZXNldCgpOkRhdGFNYW5hZ2Vye1xuICAgICAgICAgICAgdGhpcy5fZGF0YSA9IHt9O1xuICAgICAgICAgICAgdGhpcy5zYXZlKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHNldChrZXk6c3RyaW5nIHwgT2JqZWN0LCB2YWx1ZT86YW55KTpEYXRhTWFuYWdlcntcbiAgICAgICAgICAgIGlmKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChrZXkpID09PSBcIltvYmplY3QgT2JqZWN0XVwiKXtcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMuX2RhdGEsIGtleSk7XG4gICAgICAgICAgICB9ZWxzZSBpZih0eXBlb2Yga2V5ID09PSBcInN0cmluZ1wiKXtcbiAgICAgICAgICAgICAgICB0aGlzLl9kYXRhW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5zYXZlKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGdldChrZXk/OnN0cmluZyk6YW55e1xuICAgICAgICAgICAgaWYoIWtleSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9kYXRhW2tleV07XG4gICAgICAgIH1cblxuICAgICAgICBkZWwoa2V5OnN0cmluZyk6RGF0YU1hbmFnZXJ7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fZGF0YVtrZXldO1xuICAgICAgICAgICAgdGhpcy5zYXZlKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgfVxufSIsIi8vTWFueSBjaGVja3MgYXJlIGJhc2VkIG9uIGh0dHBzOi8vZ2l0aHViLmNvbS9hcmFzYXRhc2F5Z2luL2lzLmpzL2Jsb2IvbWFzdGVyL2lzLmpzXG5cbm1vZHVsZSBQSVhJIHtcbiAgICBleHBvcnQgbW9kdWxlIERldmljZSB7XG4gICAgICAgIHZhciBuYXZpZ2F0b3I6TmF2aWdhdG9yID0gd2luZG93Lm5hdmlnYXRvcjtcbiAgICAgICAgdmFyIGRvY3VtZW50OkRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xuXG4gICAgICAgIHZhciB1c2VyQWdlbnQ6c3RyaW5nID0gJ25hdmlnYXRvcicgaW4gd2luZG93ICYmICd1c2VyQWdlbnQnIGluIG5hdmlnYXRvciAmJiBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkgfHwgJycsXG4gICAgICAgICAgICB2ZW5kb3I6c3RyaW5nID0gJ25hdmlnYXRvcicgaW4gd2luZG93ICYmICd2ZW5kb3InIGluIG5hdmlnYXRvciAmJiBuYXZpZ2F0b3IudmVuZG9yLnRvTG93ZXJDYXNlKCkgfHwgJycsXG4gICAgICAgICAgICBhcHBWZXJzaW9uOnN0cmluZyA9ICduYXZpZ2F0b3InIGluIHdpbmRvdyAmJiAnYXBwVmVyc2lvbicgaW4gbmF2aWdhdG9yICYmIG5hdmlnYXRvci5hcHBWZXJzaW9uLnRvTG93ZXJDYXNlKCkgfHwgJyc7XG5cbiAgICAgICAgLy9Ccm93c2Vyc1xuICAgICAgICBleHBvcnQgdmFyIGlzQ2hyb21lOmJvb2xlYW4gPSAvY2hyb21lfGNocm9taXVtL2kudGVzdCh1c2VyQWdlbnQpICYmIC9nb29nbGUgaW5jLy50ZXN0KHZlbmRvciksXG4gICAgICAgICAgICBpc0ZpcmVmb3g6Ym9vbGVhbiA9IC9maXJlZm94L2kudGVzdCh1c2VyQWdlbnQpLFxuICAgICAgICAgICAgaXNJRTpib29sZWFuID0gL21zaWUvaS50ZXN0KHVzZXJBZ2VudCkgfHwgXCJBY3RpdmVYT2JqZWN0XCIgaW4gd2luZG93LFxuICAgICAgICAgICAgaXNPcGVyYTpib29sZWFuID0gL15PcGVyYVxcLy8udGVzdCh1c2VyQWdlbnQpIHx8IC9cXHgyME9QUlxcLy8udGVzdCh1c2VyQWdlbnQpLFxuICAgICAgICAgICAgaXNTYWZhcmk6Ym9vbGVhbiA9IC9zYWZhcmkvaS50ZXN0KHVzZXJBZ2VudCkgJiYgL2FwcGxlIGNvbXB1dGVyL2kudGVzdCh2ZW5kb3IpO1xuXG4gICAgICAgIC8vRGV2aWNlcyAmJiBPU1xuICAgICAgICBleHBvcnQgdmFyIGlzSXBob25lOmJvb2xlYW4gPSAvaXBob25lL2kudGVzdCh1c2VyQWdlbnQpLFxuICAgICAgICAgICAgaXNJcGFkOmJvb2xlYW4gPSAvaXBhZC9pLnRlc3QodXNlckFnZW50KSxcbiAgICAgICAgICAgIGlzSXBvZDpib29sZWFuID0gL2lwb2QvaS50ZXN0KHVzZXJBZ2VudCksXG4gICAgICAgICAgICBpc0FuZHJvaWQ6Ym9vbGVhbiA9IC9hbmRyb2lkL2kudGVzdCh1c2VyQWdlbnQpLFxuICAgICAgICAgICAgaXNBbmRyb2lkUGhvbmU6Ym9vbGVhbiA9IC9hbmRyb2lkL2kudGVzdCh1c2VyQWdlbnQpICYmIC9tb2JpbGUvaS50ZXN0KHVzZXJBZ2VudCksXG4gICAgICAgICAgICBpc0FuZHJvaWRUYWJsZXQ6Ym9vbGVhbiA9IC9hbmRyb2lkL2kudGVzdCh1c2VyQWdlbnQpICYmICEvbW9iaWxlL2kudGVzdCh1c2VyQWdlbnQpLFxuICAgICAgICAgICAgaXNMaW51eDpib29sZWFuID0gL2xpbnV4L2kudGVzdChhcHBWZXJzaW9uKSxcbiAgICAgICAgICAgIGlzTWFjOmJvb2xlYW4gPSAvbWFjL2kudGVzdChhcHBWZXJzaW9uKSxcbiAgICAgICAgICAgIGlzV2luZG93OmJvb2xlYW4gPSAvd2luL2kudGVzdChhcHBWZXJzaW9uKSxcbiAgICAgICAgICAgIGlzV2luZG93UGhvbmU6Ym9vbGVhbiA9IGlzV2luZG93ICYmIC9waG9uZS9pLnRlc3QodXNlckFnZW50KSxcbiAgICAgICAgICAgIGlzV2luZG93VGFibGV0OmJvb2xlYW4gPSBpc1dpbmRvdyAmJiAhaXNXaW5kb3dQaG9uZSAmJiAvdG91Y2gvaS50ZXN0KHVzZXJBZ2VudCksXG4gICAgICAgICAgICBpc01vYmlsZTpib29sZWFuID0gaXNJcGhvbmUgfHwgaXNJcG9kfHwgaXNBbmRyb2lkUGhvbmUgfHwgaXNXaW5kb3dQaG9uZSxcbiAgICAgICAgICAgIGlzVGFibGV0OmJvb2xlYW4gPSBpc0lwYWQgfHwgaXNBbmRyb2lkVGFibGV0IHx8IGlzV2luZG93VGFibGV0LFxuICAgICAgICAgICAgaXNEZXNrdG9wOmJvb2xlYW4gPSAhaXNNb2JpbGUgJiYgIWlzVGFibGV0LFxuICAgICAgICAgICAgaXNUb3VjaERldmljZTpib29sZWFuID0gJ29udG91Y2hzdGFydCcgaW4gd2luZG93IHx8J0RvY3VtZW50VG91Y2gnIGluIHdpbmRvdyAmJiBkb2N1bWVudCBpbnN0YW5jZW9mIERvY3VtZW50VG91Y2gsXG4gICAgICAgICAgICBpc0NvY29vbjpib29sZWFuID0gISFuYXZpZ2F0b3IuaXNDb2Nvb25KUyxcbiAgICAgICAgICAgIGlzTm9kZVdlYmtpdDpib29sZWFuID0gISEodHlwZW9mIHByb2Nlc3MgPT09IFwib2JqZWN0XCIgJiYgcHJvY2Vzcy50aXRsZSA9PT0gXCJub2RlXCIgJiYgdHlwZW9mIGdsb2JhbCA9PT0gXCJvYmplY3RcIiksXG4gICAgICAgICAgICBpc0VqZWN0YTpib29sZWFuID0gISF3aW5kb3cuZWplY3RhLFxuICAgICAgICAgICAgaXNDcm9zc3dhbGs6Ym9vbGVhbiA9IC9Dcm9zc3dhbGsvLnRlc3QodXNlckFnZW50KSxcbiAgICAgICAgICAgIGlzQ29yZG92YTpib29sZWFuID0gISF3aW5kb3cuY29yZG92YSxcbiAgICAgICAgICAgIGlzRWxlY3Ryb246Ym9vbGVhbiA9ICEhKHR5cGVvZiBwcm9jZXNzID09PSBcIm9iamVjdFwiICYmIHByb2Nlc3MudmVyc2lvbnMgJiYgKHByb2Nlc3MudmVyc2lvbnMuZWxlY3Ryb24gfHwgcHJvY2Vzcy52ZXJzaW9uc1snYXRvbS1zaGVsbCddKSk7XG5cbiAgICAgICAgZXhwb3J0IHZhciBpc1ZpYnJhdGVTdXBwb3J0ZWQ6Ym9vbGVhbiA9ICEhbmF2aWdhdG9yLnZpYnJhdGUgJiYgKGlzTW9iaWxlIHx8IGlzVGFibGV0KSxcbiAgICAgICAgICAgIGlzTW91c2VXaGVlbFN1cHBvcnRlZDpib29sZWFuID0gJ29ud2hlZWwnIGluIHdpbmRvdyB8fCAnb25tb3VzZXdoZWVsJyBpbiB3aW5kb3cgfHwgJ01vdXNlU2Nyb2xsRXZlbnQnIGluIHdpbmRvdyxcbiAgICAgICAgICAgIGlzQWNjZWxlcm9tZXRlclN1cHBvcnRlZDpib29sZWFuID0gJ0RldmljZU1vdGlvbkV2ZW50JyBpbiB3aW5kb3csXG4gICAgICAgICAgICBpc0dhbWVwYWRTdXBwb3J0ZWQ6Ym9vbGVhbiA9ICEhbmF2aWdhdG9yLmdldEdhbWVwYWRzIHx8ICEhbmF2aWdhdG9yLndlYmtpdEdldEdhbWVwYWRzO1xuXG4gICAgICAgIC8vRnVsbFNjcmVlblxuICAgICAgICB2YXIgZGl2OkhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHZhciBmdWxsU2NyZWVuUmVxdWVzdFZlbmRvcjphbnkgPSBkaXYucmVxdWVzdEZ1bGxzY3JlZW4gfHwgZGl2LndlYmtpdFJlcXVlc3RGdWxsU2NyZWVuIHx8IGRpdi5tc1JlcXVlc3RGdWxsU2NyZWVuIHx8IGRpdi5tb3pSZXF1ZXN0RnVsbFNjcmVlbixcbiAgICAgICAgICAgIGZ1bGxTY3JlZW5DYW5jZWxWZW5kb3I6YW55ID0gZG9jdW1lbnQuY2FuY2VsRnVsbFNjcmVlbiB8fCBkb2N1bWVudC5leGl0RnVsbFNjcmVlbiB8fCBkb2N1bWVudC53ZWJraXRDYW5jZWxGdWxsU2NyZWVuIHx8IGRvY3VtZW50Lm1zQ2FuY2VsRnVsbFNjcmVlbiB8fCBkb2N1bWVudC5tb3pDYW5jZWxGdWxsU2NyZWVuO1xuXG4gICAgICAgIGV4cG9ydCB2YXIgaXNGdWxsU2NyZWVuU3VwcG9ydGVkOmJvb2xlYW4gPSAhIShmdWxsU2NyZWVuUmVxdWVzdCAmJiBmdWxsU2NyZWVuQ2FuY2VsKSxcbiAgICAgICAgICAgIGZ1bGxTY3JlZW5SZXF1ZXN0OnN0cmluZyA9IChmdWxsU2NyZWVuUmVxdWVzdFZlbmRvcikgPyBmdWxsU2NyZWVuUmVxdWVzdFZlbmRvci5uYW1lIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgZnVsbFNjcmVlbkNhbmNlbDpzdHJpbmcgPSAoZnVsbFNjcmVlbkNhbmNlbFZlbmRvcikgPyBmdWxsU2NyZWVuQ2FuY2VsVmVuZG9yLm5hbWUgOiB1bmRlZmluZWQ7XG5cbiAgICAgICAgLy9BdWRpb1xuICAgICAgICBleHBvcnQgdmFyIGlzSFRNTEF1ZGlvU3VwcG9ydGVkOmJvb2xlYW4gPSAhIXdpbmRvdy5BdWRpbyxcbiAgICAgICAgICAgIHdlYkF1ZGlvQ29udGV4dDphbnkgPSB3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQsXG4gICAgICAgICAgICBpc1dlYkF1ZGlvU3VwcG9ydGVkOmJvb2xlYW4gPSAhIXdlYkF1ZGlvQ29udGV4dCxcbiAgICAgICAgICAgIGlzQXVkaW9TdXBwb3J0ZWQ6Ym9vbGVhbiA9IGlzV2ViQXVkaW9TdXBwb3J0ZWQgfHwgaXNIVE1MQXVkaW9TdXBwb3J0ZWQsXG4gICAgICAgICAgICBpc01wM1N1cHBvcnRlZDpib29sZWFuID0gZmFsc2UsXG4gICAgICAgICAgICBpc09nZ1N1cHBvcnRlZDpib29sZWFuID0gZmFsc2UsXG4gICAgICAgICAgICBpc1dhdlN1cHBvcnRlZDpib29sZWFuID0gZmFsc2UsXG4gICAgICAgICAgICBpc000YVN1cHBvcnRlZDpib29sZWFuID0gZmFsc2UsXG4gICAgICAgICAgICBnbG9iYWxXZWJBdWRpb0NvbnRleHQ6QXVkaW9Db250ZXh0ID0gKGlzV2ViQXVkaW9TdXBwb3J0ZWQpID8gbmV3IHdlYkF1ZGlvQ29udGV4dCgpIDogdW5kZWZpbmVkO1xuXG4gICAgICAgIC8vQXVkaW8gbWltZVR5cGVzXG4gICAgICAgIGlmKGlzQXVkaW9TdXBwb3J0ZWQpe1xuICAgICAgICAgICAgdmFyIGF1ZGlvOkhUTUxBdWRpb0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhdWRpbycpO1xuICAgICAgICAgICAgaXNNcDNTdXBwb3J0ZWQgPSBhdWRpby5jYW5QbGF5VHlwZSgnYXVkaW8vbXBlZzsnKSAhPT0gXCJcIjtcbiAgICAgICAgICAgIGlzT2dnU3VwcG9ydGVkID0gYXVkaW8uY2FuUGxheVR5cGUoJ2F1ZGlvL29nZzsgY29kZWNzPVwidm9yYmlzXCInKSAhPT0gXCJcIjtcbiAgICAgICAgICAgIGlzV2F2U3VwcG9ydGVkID0gYXVkaW8uY2FuUGxheVR5cGUoJ2F1ZGlvL3dhdicpICE9PSBcIlwiO1xuICAgICAgICAgICAgaXNNNGFTdXBwb3J0ZWQgPSBhdWRpby5jYW5QbGF5VHlwZSgnYXVkaW8vbXA0OyBjb2RlY3M9XCJtcDRhLjQwLjVcIicpICE9PSBcIlwiO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIGdldE1vdXNlV2hlZWxFdmVudCgpOnN0cmluZ3tcbiAgICAgICAgICAgIGlmKCFpc01vdXNlV2hlZWxTdXBwb3J0ZWQpcmV0dXJuO1xuICAgICAgICAgICAgdmFyIGV2dDpzdHJpbmc7XG4gICAgICAgICAgICBpZignb253aGVlbCcgaW4gd2luZG93KXtcbiAgICAgICAgICAgICAgICBldnQgPSAnd2hlZWwnO1xuICAgICAgICAgICAgfWVsc2UgaWYoJ29ubW91c2V3aGVlbCcgaW4gd2luZG93KXtcbiAgICAgICAgICAgICAgICBldnQgPSAnbW91c2V3aGVlbCc7XG4gICAgICAgICAgICB9ZWxzZSBpZignTW91c2VTY3JvbGxFdmVudCcgaW4gd2luZG93KXtcbiAgICAgICAgICAgICAgICBldnQgPSAnRE9NTW91c2VTY3JvbGwnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZXZ0O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIHZpYnJhdGUocGF0dGVybjogbnVtYmVyIHwgbnVtYmVyW10pOnZvaWR7XG4gICAgICAgICAgICBpZihpc1ZpYnJhdGVTdXBwb3J0ZWQpe1xuICAgICAgICAgICAgICAgIG5hdmlnYXRvci52aWJyYXRlKHBhdHRlcm4pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIGdldFZpc2liaWxpdHlDaGFuZ2VFdmVudCgpOnN0cmluZ3tcbiAgICAgICAgICAgIGlmKHR5cGVvZiBkb2N1bWVudC5oaWRkZW4gIT09ICd1bmRlZmluZWQnKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ3Zpc2liaWxpdHljaGFuZ2UnO1xuICAgICAgICAgICAgfWVsc2UgaWYodHlwZW9mIGRvY3VtZW50LndlYmtpdEhpZGRlbiAhPT0gJ3VuZGVmaW5lZCcpe1xuICAgICAgICAgICAgICAgIHJldHVybiAnd2Via2l0dmlzaWJpbGl0eWNoYW5nZSc7XG4gICAgICAgICAgICB9ZWxzZSBpZih0eXBlb2YgZG9jdW1lbnQubW96SGlkZGVuICE9PSAndW5kZWZpbmVkJyl7XG4gICAgICAgICAgICAgICAgcmV0dXJuICdtb3p2aXNpYmlsaXR5Y2hhbmdlJztcbiAgICAgICAgICAgIH1lbHNlIGlmKHR5cGVvZiBkb2N1bWVudC5tc0hpZGRlbiAhPT0gJ3VuZGVmaW5lZCcpe1xuICAgICAgICAgICAgICAgIHJldHVybiAnbXN2aXNpYmlsaXR5Y2hhbmdlJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBpc09ubGluZSgpOmJvb2xlYW57XG4gICAgICAgICAgICByZXR1cm4gd2luZG93Lm5hdmlnYXRvci5vbkxpbmU7XG4gICAgICAgIH1cblxuXG4gICAgfVxufVxuXG5kZWNsYXJlIHZhciBwcm9jZXNzOmFueSxcbiAgICBEb2N1bWVudFRvdWNoOmFueSxcbiAgICBnbG9iYWw6YW55O1xuXG5pbnRlcmZhY2UgTmF2aWdhdG9yIHtcbiAgICBpc0NvY29vbkpTOmFueTtcbiAgICB2aWJyYXRlKHBhdHRlcm46IG51bWJlciB8IG51bWJlcltdKTpib29sZWFuO1xuICAgIGdldEdhbWVwYWRzKCk6YW55O1xuICAgIHdlYmtpdEdldEdhbWVwYWRzKCk6YW55O1xufVxuXG5pbnRlcmZhY2UgV2luZG93IHtcbiAgICBlamVjdGE6YW55O1xuICAgIGNvcmRvdmE6YW55O1xuICAgIEF1ZGlvKCk6SFRNTEF1ZGlvRWxlbWVudDtcbiAgICBBdWRpb0NvbnRleHQoKTphbnk7XG4gICAgd2Via2l0QXVkaW9Db250ZXh0KCk6YW55O1xufVxuXG5pbnRlcmZhY2UgZnVsbFNjcmVlbkRhdGEge1xuICAgIG5hbWU6c3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgRG9jdW1lbnQge1xuICAgIGNhbmNlbEZ1bGxTY3JlZW4oKTpmdWxsU2NyZWVuRGF0YSA7XG4gICAgZXhpdEZ1bGxTY3JlZW4oKTpmdWxsU2NyZWVuRGF0YSA7XG4gICAgd2Via2l0Q2FuY2VsRnVsbFNjcmVlbigpOmZ1bGxTY3JlZW5EYXRhIDtcbiAgICBtc0NhbmNlbEZ1bGxTY3JlZW4oKTpmdWxsU2NyZWVuRGF0YSA7XG4gICAgbW96Q2FuY2VsRnVsbFNjcmVlbigpOmZ1bGxTY3JlZW5EYXRhIDtcbiAgICB3ZWJraXRIaWRkZW46YW55O1xuICAgIG1vekhpZGRlbjphbnk7XG59XG5cbmludGVyZmFjZSBIVE1MRGl2RWxlbWVudCB7XG4gICAgcmVxdWVzdEZ1bGxzY3JlZW4oKTpmdWxsU2NyZWVuRGF0YSA7XG4gICAgd2Via2l0UmVxdWVzdEZ1bGxTY3JlZW4oKTpmdWxsU2NyZWVuRGF0YSA7XG4gICAgbXNSZXF1ZXN0RnVsbFNjcmVlbigpOmZ1bGxTY3JlZW5EYXRhIDtcbiAgICBtb3pSZXF1ZXN0RnVsbFNjcmVlbigpOmZ1bGxTY3JlZW5EYXRhIDtcbn0iLCJtb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IGNsYXNzIElucHV0TWFuYWdlcntcbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBnYW1lOiBHYW1lKXtcblxuICAgICAgICB9XG4gICAgfVxufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2RlZnMvcGl4aS5qcy5kLnRzXCIgLz5cbm1vZHVsZSBQSVhJIHtcbiAgICBleHBvcnQgZnVuY3Rpb24gYml0bWFwRm9udFBhcnNlclRYVCgpOkZ1bmN0aW9ue1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24ocmVzb3VyY2U6IGxvYWRlcnMuUmVzb3VyY2UsIG5leHQ6RnVuY3Rpb24pOnZvaWR7XG5cbiAgICAgICAgICAgIC8vc2tpcCBpZiBubyBkYXRhIG9yIGlmIG5vdCB0eHRcbiAgICAgICAgICAgIGlmKCFyZXNvdXJjZS5kYXRhIHx8IChyZXNvdXJjZS54aHJUeXBlICE9PSBcInRleHRcIiAmJiByZXNvdXJjZS54aHJUeXBlICE9PSBcImRvY3VtZW50XCIpKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV4dCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgdGV4dDpzdHJpbmcgPSAocmVzb3VyY2UueGhyVHlwZSA9PT0gXCJ0ZXh0XCIpID8gcmVzb3VyY2UuZGF0YSA6IHJlc291cmNlLnhoci5yZXNwb25zZVRleHQ7XG5cbiAgICAgICAgICAgIC8vc2tpcCBpZiBub3QgYSBiaXRtYXAgZm9udCBkYXRhXG4gICAgICAgICAgICBpZiggdGV4dC5pbmRleE9mKFwicGFnZVwiKSA9PT0gLTEgfHxcbiAgICAgICAgICAgICAgICB0ZXh0LmluZGV4T2YoXCJmYWNlXCIpID09PSAtMSB8fFxuICAgICAgICAgICAgICAgIHRleHQuaW5kZXhPZihcImluZm9cIikgPT09IC0xIHx8XG4gICAgICAgICAgICAgICAgdGV4dC5pbmRleE9mKFwiY2hhclwiKSA9PT0gLTEgKXtcblxuICAgICAgICAgICAgICAgIHJldHVybiBuZXh0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciB1cmw6c3RyaW5nID0gZGlybmFtZShyZXNvdXJjZS51cmwpO1xuICAgICAgICAgICAgaWYodXJsID09PSBcIi5cIil7XG4gICAgICAgICAgICAgICAgdXJsID0gXCJcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYodGhpcy5iYXNlVXJsICYmIHVybCl7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5iYXNlVXJsLmNoYXJBdCh0aGlzLmJhc2VVcmwubGVuZ3RoLTEpPT09ICcvJyl7XG4gICAgICAgICAgICAgICAgICAgIHVybCArPSAnLyc7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdXJsLnJlcGxhY2UodGhpcy5iYXNlVXJsLCAnJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKHVybCAmJiB1cmwuY2hhckF0KHVybC5sZW5ndGggLSAxKSAhPT0gJy8nKXtcbiAgICAgICAgICAgICAgICB1cmwgKz0gJy8nO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgdGV4dHVyZVVybDpzdHJpbmcgPSBnZXRUZXh0dXJlVXJsKHVybCwgdGV4dCk7XG4gICAgICAgICAgICBpZih1dGlscy5UZXh0dXJlQ2FjaGVbdGV4dHVyZVVybF0pe1xuICAgICAgICAgICAgICAgIHBhcnNlKHJlc291cmNlLCB1dGlscy5UZXh0dXJlQ2FjaGVbdGV4dHVyZVVybF0pO1xuICAgICAgICAgICAgICAgIG5leHQoKTtcbiAgICAgICAgICAgIH1lbHNle1xuXG4gICAgICAgICAgICAgICAgdmFyIGxvYWRPcHRpb25zOmFueSA9IHtcbiAgICAgICAgICAgICAgICAgICAgY3Jvc3NPcmlnaW46IHJlc291cmNlLmNyb3NzT3JpZ2luLFxuICAgICAgICAgICAgICAgICAgICBsb2FkVHlwZTogbG9hZGVycy5SZXNvdXJjZS5MT0FEX1RZUEUuSU1BR0VcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgdGhpcy5hZGQocmVzb3VyY2UubmFtZSArICdfaW1hZ2UnLCB0ZXh0dXJlVXJsLCBsb2FkT3B0aW9ucywgZnVuY3Rpb24ocmVzOmFueSl7XG4gICAgICAgICAgICAgICAgICAgIHBhcnNlKHJlc291cmNlLCByZXMudGV4dHVyZSk7XG4gICAgICAgICAgICAgICAgICAgIG5leHQoKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIG5leHQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlKHJlc291cmNlOmxvYWRlcnMuUmVzb3VyY2UsIHRleHR1cmU6VGV4dHVyZSl7XG4gICAgICAgIHZhciBjdXJyZW50TGluZTpzdHJpbmcsIGF0dHI6YXR0ckRhdGEsXG4gICAgICAgICAgICBkYXRhOmZvbnREYXRhID0ge1xuICAgICAgICAgICAgICAgIGNoYXJzIDoge31cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgdmFyIHRleHQ6c3RyaW5nID0gKHJlc291cmNlLnhoclR5cGUgPT09IFwidGV4dFwiKSA/IHJlc291cmNlLmRhdGEgOiByZXNvdXJjZS54aHIucmVzcG9uc2VUZXh0O1xuICAgICAgICB2YXIgbGluZXM6c3RyaW5nW10gPSB0ZXh0LnNwbGl0KCdcXG4nKTtcblxuICAgICAgICBmb3IodmFyIGk6bnVtYmVyID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIGlmKGxpbmVzW2ldLmluZGV4T2YoXCJpbmZvXCIpID09PSAwKXtcbiAgICAgICAgICAgICAgICBjdXJyZW50TGluZSA9IGxpbmVzW2ldLnN1YnN0cmluZyg1KTtcbiAgICAgICAgICAgICAgICBhdHRyID0gZ2V0QXR0cihjdXJyZW50TGluZSk7XG5cbiAgICAgICAgICAgICAgICBkYXRhLmZvbnQgPSBhdHRyLmZhY2U7XG4gICAgICAgICAgICAgICAgZGF0YS5zaXplID0gcGFyc2VJbnQoYXR0ci5zaXplKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYobGluZXNbaV0uaW5kZXhPZignY29tbW9uICcpID09PSAwKXtcbiAgICAgICAgICAgICAgICBjdXJyZW50TGluZSA9IGxpbmVzW2ldLnN1YnN0cmluZyg3KTtcbiAgICAgICAgICAgICAgICBhdHRyID0gZ2V0QXR0cihjdXJyZW50TGluZSk7XG4gICAgICAgICAgICAgICAgZGF0YS5saW5lSGVpZ2h0ID0gcGFyc2VJbnQoYXR0ci5saW5lSGVpZ2h0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYobGluZXNbaV0uaW5kZXhPZihcImNoYXIgXCIpID09PSAwKXtcbiAgICAgICAgICAgICAgICBjdXJyZW50TGluZSA9IGxpbmVzW2ldLnN1YnN0cmluZyg1KTtcbiAgICAgICAgICAgICAgICBhdHRyID0gZ2V0QXR0cihjdXJyZW50TGluZSk7XG4gICAgICAgICAgICAgICAgdmFyIGNoYXJDb2RlOm51bWJlciA9IHBhcnNlSW50KGF0dHIuaWQpO1xuXG4gICAgICAgICAgICAgICAgdmFyIHRleHR1cmVSZWN0OlJlY3RhbmdsZSA9IG5ldyBSZWN0YW5nbGUoXG4gICAgICAgICAgICAgICAgICAgIHBhcnNlSW50KGF0dHIueCksXG4gICAgICAgICAgICAgICAgICAgIHBhcnNlSW50KGF0dHIueSksXG4gICAgICAgICAgICAgICAgICAgIHBhcnNlSW50KGF0dHIud2lkdGgpLFxuICAgICAgICAgICAgICAgICAgICBwYXJzZUludChhdHRyLmhlaWdodClcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgZGF0YS5jaGFyc1tjaGFyQ29kZV0gPSB7XG4gICAgICAgICAgICAgICAgICAgIHhPZmZzZXQ6IHBhcnNlSW50KGF0dHIueG9mZnNldCksXG4gICAgICAgICAgICAgICAgICAgIHlPZmZzZXQ6IHBhcnNlSW50KGF0dHIueW9mZnNldCksXG4gICAgICAgICAgICAgICAgICAgIHhBZHZhbmNlOiBwYXJzZUludChhdHRyLnhhZHZhbmNlKSxcbiAgICAgICAgICAgICAgICAgICAga2VybmluZzoge30sXG4gICAgICAgICAgICAgICAgICAgIHRleHR1cmU6IG5ldyBUZXh0dXJlKHRleHR1cmUuYmFzZVRleHR1cmUsIHRleHR1cmVSZWN0KVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKGxpbmVzW2ldLmluZGV4T2YoJ2tlcm5pbmcgJykgPT09IDApe1xuICAgICAgICAgICAgICAgIGN1cnJlbnRMaW5lID0gbGluZXNbaV0uc3Vic3RyaW5nKDgpO1xuICAgICAgICAgICAgICAgIGF0dHIgPSBnZXRBdHRyKGN1cnJlbnRMaW5lKTtcblxuICAgICAgICAgICAgICAgIHZhciBmaXJzdCA9IHBhcnNlSW50KGF0dHIuZmlyc3QpO1xuICAgICAgICAgICAgICAgIHZhciBzZWNvbmQgPSBwYXJzZUludChhdHRyLnNlY29uZCk7XG5cbiAgICAgICAgICAgICAgICBkYXRhLmNoYXJzW3NlY29uZF0ua2VybmluZ1tmaXJzdF0gPSBwYXJzZUludChhdHRyLmFtb3VudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXNvdXJjZS5iaXRtYXBGb250ID0gZGF0YTtcbiAgICAgICAgZXh0cmFzLkJpdG1hcFRleHQuZm9udHNbZGF0YS5mb250XSA9IGRhdGE7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGlybmFtZShwYXRoOnN0cmluZyk6c3RyaW5ne1xuICAgICAgICByZXR1cm4gcGF0aC5yZXBsYWNlKC9cXFxcL2csJy8nKS5yZXBsYWNlKC9cXC9bXlxcL10qJC8sICcnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRUZXh0dXJlVXJsKHVybDpzdHJpbmcsIGRhdGE6c3RyaW5nKTpzdHJpbmd7XG4gICAgICAgIHZhciB0ZXh0dXJlVXJsOnN0cmluZztcbiAgICAgICAgdmFyIGxpbmVzOnN0cmluZ1tdID0gZGF0YS5zcGxpdCgnXFxuJyk7XG5cbiAgICAgICAgZm9yKHZhciBpOm51bWJlciA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICBpZihsaW5lc1tpXS5pbmRleE9mKFwicGFnZVwiKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50TGluZTpzdHJpbmcgPSBsaW5lc1tpXS5zdWJzdHJpbmcoNSk7XG4gICAgICAgICAgICAgICAgdmFyIGZpbGU6c3RyaW5nID0gKGN1cnJlbnRMaW5lLnN1YnN0cmluZyhjdXJyZW50TGluZS5pbmRleE9mKCdmaWxlPScpKSkuc3BsaXQoJz0nKVsxXTtcbiAgICAgICAgICAgICAgICB0ZXh0dXJlVXJsID0gdXJsICsgZmlsZS5zdWJzdHIoMSwgZmlsZS5sZW5ndGgtMik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGV4dHVyZVVybDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRBdHRyKGxpbmU6c3RyaW5nKTphdHRyRGF0YXtcbiAgICAgICAgdmFyIHJlZ2V4OlJlZ0V4cCA9IC9cIihcXHcqXFxkKlxccyooLXxfKSopKlwiL2csXG4gICAgICAgICAgICBhdHRyOnN0cmluZ1tdID0gbGluZS5zcGxpdCgvXFxzKy9nKSxcbiAgICAgICAgICAgIGRhdGE6YW55ID0ge307XG5cbiAgICAgICAgZm9yKHZhciBpOm51bWJlciA9IDA7IGkgPCBhdHRyLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIHZhciBkOnN0cmluZ1tdID0gYXR0cltpXS5zcGxpdCgnPScpO1xuICAgICAgICAgICAgdmFyIG06UmVnRXhwTWF0Y2hBcnJheSA9IGRbMV0ubWF0Y2gocmVnZXgpO1xuICAgICAgICAgICAgaWYobSAmJiBtLmxlbmd0aCA+PSAxKXtcbiAgICAgICAgICAgICAgICBkWzFdID0gZFsxXS5zdWJzdHIoMSwgZFsxXS5sZW5ndGgtMik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkYXRhW2RbMF1dID0gZFsxXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiA8YXR0ckRhdGE+ZGF0YTtcbiAgICB9XG5cbiAgICBpbnRlcmZhY2UgZm9udERhdGEge1xuICAgICAgICBjaGFycz8gOiBhbnk7XG4gICAgICAgIGZvbnQ/IDogc3RyaW5nO1xuICAgICAgICBzaXplPyA6IG51bWJlcjtcbiAgICAgICAgbGluZUhlaWdodD8gOiBudW1iZXI7XG4gICAgfVxuXG4gICAgaW50ZXJmYWNlIGF0dHJEYXRhIHtcbiAgICAgICAgZmFjZT8gOiBzdHJpbmc7XG4gICAgICAgIHNpemU/IDogc3RyaW5nO1xuICAgICAgICBsaW5lSGVpZ2h0PyA6IHN0cmluZztcbiAgICAgICAgaWQ/IDogc3RyaW5nO1xuICAgICAgICB4PyA6IHN0cmluZztcbiAgICAgICAgeT8gOiBzdHJpbmc7XG4gICAgICAgIHdpZHRoPyA6IHN0cmluZztcbiAgICAgICAgaGVpZ2h0PyA6IHN0cmluZztcbiAgICAgICAgeG9mZnNldD8gOiBzdHJpbmc7XG4gICAgICAgIHlvZmZzZXQ/IDogc3RyaW5nO1xuICAgICAgICB4YWR2YW5jZT8gOiBzdHJpbmc7XG4gICAgICAgIGZpcnN0PyA6IHN0cmluZztcbiAgICAgICAgc2Vjb25kPyA6IHN0cmluZztcbiAgICAgICAgYW1vdW50PyA6IHN0cmluZztcbiAgICB9XG59IiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vYXVkaW8vQXVkaW9NYW5hZ2VyLnRzXCIgLz5cbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL0F1ZGlvL0F1ZGlvLnRzXCIgLz5cbm1vZHVsZSBQSVhJIHtcbiAgICBleHBvcnQgZnVuY3Rpb24gYXVkaW9QYXJzZXIoKTpGdW5jdGlvbiB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihyZXNvdXJjZTpsb2FkZXJzLlJlc291cmNlLCBuZXh0OkZ1bmN0aW9uKTp2b2lke1xuICAgICAgICAgICAgaWYoIURldmljZS5pc0F1ZGlvU3VwcG9ydGVkIHx8ICFyZXNvdXJjZS5kYXRhKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV4dCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgX2FsbG93ZWRFeHQ6c3RyaW5nW10gPSBbXCJtNGFcIiwgXCJvZ2dcIiwgXCJtcDNcIiwgXCJ3YXZcIl07XG4gICAgICAgICAgICB2YXIgZXh0OnN0cmluZyA9IF9nZXRFeHQocmVzb3VyY2UudXJsKTtcblxuICAgICAgICAgICAgaWYoX2FsbG93ZWRFeHQuaW5kZXhPZihleHQpID09PSAtMSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5leHQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGRldmljZUNhblBsYXk6Ym9vbGVhbiA9IGZhbHNlO1xuICAgICAgICAgICAgc3dpdGNoKGV4dCl7XG4gICAgICAgICAgICAgICAgY2FzZSBcIm00YVwiOmRldmljZUNhblBsYXkgPSBEZXZpY2UuaXNNNGFTdXBwb3J0ZWQ7IGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJtcDNcIjpkZXZpY2VDYW5QbGF5ID0gRGV2aWNlLmlzTXAzU3VwcG9ydGVkOyBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwib2dnXCI6ZGV2aWNlQ2FuUGxheSA9IERldmljZS5pc09nZ1N1cHBvcnRlZDsgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcIndhdlwiOmRldmljZUNhblBsYXkgPSBEZXZpY2UuaXNXYXZTdXBwb3J0ZWQ7IGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZighZGV2aWNlQ2FuUGxheSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5leHQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIG5hbWU6c3RyaW5nID0gcmVzb3VyY2UubmFtZSB8fCByZXNvdXJjZS51cmw7XG4gICAgICAgICAgICBpZih1dGlscy5fYXVkaW9UeXBlU2VsZWN0ZWQgPT09IEFVRElPX1RZUEUuV0VCQVVESU8pe1xuICAgICAgICAgICAgICAgIERldmljZS5nbG9iYWxXZWJBdWRpb0NvbnRleHQuZGVjb2RlQXVkaW9EYXRhKHJlc291cmNlLmRhdGEsIF9hZGRUb0NhY2hlLmJpbmQodGhpcywgbmV4dCwgbmFtZSkpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9hZGRUb0NhY2hlKG5leHQsIG5hbWUsIHJlc291cmNlLmRhdGEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfYWRkVG9DYWNoZShuZXh0OkZ1bmN0aW9uLCBuYW1lOnN0cmluZywgZGF0YTphbnkpe1xuICAgICAgICB1dGlscy5BdWRpb0NhY2hlW25hbWVdID0gbmV3IEF1ZGlvKGRhdGEsIG5hbWUpO1xuICAgICAgICByZXR1cm4gbmV4dCgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9nZXRFeHQodXJsOnN0cmluZyk6c3RyaW5ne1xuICAgICAgICByZXR1cm4gdXJsLnNwbGl0KCc/Jykuc2hpZnQoKS5zcGxpdCgnLicpLnBvcCgpLnRvTG93ZXJDYXNlKCk7XG4gICAgfVxufVxuIiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vZGVmcy9waXhpLmpzLmQudHNcIiAvPlxubW9kdWxlIFBJWEkge1xuICAgIGV4cG9ydCBtb2R1bGUgdXRpbHMge1xuICAgICAgICBleHBvcnQgdmFyIF9hdWRpb1R5cGVTZWxlY3RlZDpudW1iZXIgPSBBVURJT19UWVBFLldFQkFVRElPO1xuICAgICAgICBleHBvcnQgdmFyIEF1ZGlvQ2FjaGU6YW55ID0ge307XG4gICAgfVxufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2RlZnMvcGl4aS5qcy5kLnRzXCIgLz5cbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4vYml0bWFwRm9udFBhcnNlclR4dC50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuL2F1ZGlvUGFyc2VyLnRzXCIgLz5cbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL2NvcmUvVXRpbHMudHNcIiAvPlxubW9kdWxlIFBJWEkge1xuICAgIGV4cG9ydCBtb2R1bGUgbG9hZGVyc3tcbiAgICAgICAgTG9hZGVyLmFkZFBpeGlNaWRkbGV3YXJlKGJpdG1hcEZvbnRQYXJzZXJUWFQpO1xuICAgICAgICBMb2FkZXIuYWRkUGl4aU1pZGRsZXdhcmUoYXVkaW9QYXJzZXIpO1xuXG4gICAgICAgIGNsYXNzIFR1cmJvTG9hZGVyIGV4dGVuZHMgTG9hZGVyIHtcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGJhc2VVcmw6IHN0cmluZywgYXNzZXRDb25jdXJyZW5jeTogbnVtYmVyKXtcbiAgICAgICAgICAgICAgICBzdXBlcihiYXNlVXJsLCBhc3NldENvbmN1cnJlbmN5KTtcbiAgICAgICAgICAgICAgICBpZihEZXZpY2UuaXNBdWRpb1N1cHBvcnRlZCl7XG4gICAgICAgICAgICAgICAgICAgIF9jaGVja0F1ZGlvVHlwZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxvYWRlcnMuTG9hZGVyID0gVHVyYm9Mb2FkZXI7XG5cblxuICAgICAgICBmdW5jdGlvbiBfY2hlY2tBdWRpb1R5cGUoKTp2b2lke1xuICAgICAgICAgICAgaWYoRGV2aWNlLmlzTXAzU3VwcG9ydGVkKV9zZXRBdWRpb0V4dChcIm1wM1wiKTtcbiAgICAgICAgICAgIGlmKERldmljZS5pc09nZ1N1cHBvcnRlZClfc2V0QXVkaW9FeHQoXCJvZ2dcIik7XG4gICAgICAgICAgICBpZihEZXZpY2UuaXNXYXZTdXBwb3J0ZWQpX3NldEF1ZGlvRXh0KFwid2F2XCIpO1xuICAgICAgICAgICAgaWYoRGV2aWNlLmlzTTRhU3VwcG9ydGVkKV9zZXRBdWRpb0V4dChcIm00YVwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIF9zZXRBdWRpb0V4dChleHQ6c3RyaW5nKTp2b2lkIHtcbiAgICAgICAgICAgIGlmKHV0aWxzLl9hdWRpb1R5cGVTZWxlY3RlZCA9PT0gQVVESU9fVFlQRS5XRUJBVURJTyl7XG4gICAgICAgICAgICAgICAgUmVzb3VyY2Uuc2V0RXh0ZW5zaW9uWGhyVHlwZShleHQsIFJlc291cmNlLlhIUl9SRVNQT05TRV9UWVBFLkJVRkZFUik7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBSZXNvdXJjZS5zZXRFeHRlbnNpb25Mb2FkVHlwZShleHQsIFJlc291cmNlLkxPQURfVFlQRS5BVURJTyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59IiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vZGVmcy9waXhpLmpzLmQudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi9EZXZpY2UudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vZGlzcGxheS9TY2VuZS50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9hdWRpby9BdWRpb01hbmFnZXIudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vaW5wdXQvSW5wdXRNYW5hZ2VyLnRzXCIgLz5cbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL2xvYWRlci9Mb2FkZXIudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi9EYXRhTWFuYWdlci50c1wiIC8+XG5tb2R1bGUgUElYSSB7XG4gICAgdmFyIGxhc3Q6bnVtYmVyID0gMDtcbiAgICB2YXIgbWF4RnJhbWVNUyA9IDAuMzU7XG5cbiAgICB2YXIgZGVmYXVsdEdhbWVDb25maWcgOiBHYW1lQ29uZmlnID0ge1xuICAgICAgICBpZDogXCJwaXhpLmRlZmF1bHQuaWRcIixcbiAgICAgICAgd2lkdGg6ODAwLFxuICAgICAgICBoZWlnaHQ6NjAwLFxuICAgICAgICB1c2VXZWJBdWRpbzogdHJ1ZSxcbiAgICAgICAgdXNlUGVyc2lzdGFudERhdGE6IGZhbHNlLFxuICAgICAgICBnYW1lU2NhbGVUeXBlOiBHQU1FX1NDQUxFX1RZUEUuTk9ORSxcbiAgICAgICAgc3RvcEF0TG9zdEZvY3VzOiB0cnVlLFxuICAgICAgICBhc3NldHNVcmw6IFwiXCIsXG4gICAgICAgIGxvYWRlckNvbmN1cnJlbmN5OiAxMFxuICAgIH07XG5cbiAgICBleHBvcnQgY2xhc3MgR2FtZSB7XG4gICAgICAgIGlkOnN0cmluZztcbiAgICAgICAgcmFmOmFueTtcblxuICAgICAgICBwcml2YXRlIF9zY2VuZXM6U2NlbmVbXSA9IFtdO1xuICAgICAgICBzY2VuZTpTY2VuZTtcblxuICAgICAgICBhdWRpbzpBdWRpb01hbmFnZXI7XG4gICAgICAgIGlucHV0OklucHV0TWFuYWdlcjtcbiAgICAgICAgZGF0YTpEYXRhTWFuYWdlcjtcbiAgICAgICAgbG9hZGVyOmxvYWRlcnMuTG9hZGVyO1xuXG4gICAgICAgIHJlbmRlcmVyOldlYkdMUmVuZGVyZXIgfCBDYW52YXNSZW5kZXJlcjtcbiAgICAgICAgY2FudmFzOkhUTUxDYW52YXNFbGVtZW50O1xuXG4gICAgICAgIGRlbHRhOm51bWJlciA9IDA7XG4gICAgICAgIHRpbWU6bnVtYmVyID0gMDtcbiAgICAgICAgbGFzdFRpbWU6bnVtYmVyID0gMDtcblxuICAgICAgICBpc1dlYkdMOmJvb2xlYW47XG4gICAgICAgIGlzV2ViQXVkaW86Ym9vbGVhbjtcblxuICAgICAgICBwcml2YXRlIF9yZXNpemVMaXN0ZW5lcjphbnk7XG5cbiAgICAgICAgY29uc3RydWN0b3IoY29uZmlnPzpHYW1lQ29uZmlnLCByZW5kZXJlck9wdGlvbnM/OlJlbmRlcmVyT3B0aW9ucykge1xuICAgICAgICAgICAgY29uZmlnID0gKDxPYmplY3Q+T2JqZWN0KS5hc3NpZ24oZGVmYXVsdEdhbWVDb25maWcsIGNvbmZpZyk7XG4gICAgICAgICAgICB0aGlzLmlkID0gY29uZmlnLmlkO1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJlciA9IGF1dG9EZXRlY3RSZW5kZXJlcihjb25maWcud2lkdGgsIGNvbmZpZy5oZWlnaHQsIHJlbmRlcmVyT3B0aW9ucyk7XG4gICAgICAgICAgICB0aGlzLmNhbnZhcyA9IHRoaXMucmVuZGVyZXIudmlldztcblxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XG5cbiAgICAgICAgICAgIHRoaXMuaXNXZWJHTCA9ICh0aGlzLnJlbmRlcmVyLnR5cGUgPT09IFJFTkRFUkVSX1RZUEUuV0VCR0wpO1xuICAgICAgICAgICAgdGhpcy5pc1dlYkF1ZGlvID0gKERldmljZS5pc0F1ZGlvU3VwcG9ydGVkJiZEZXZpY2UuaXNXZWJBdWRpb1N1cHBvcnRlZCYmY29uZmlnLnVzZVdlYkF1ZGlvKTtcbiAgICAgICAgICAgIHV0aWxzLl9hdWRpb1R5cGVTZWxlY3RlZCA9IHRoaXMuaXNXZWJBdWRpbyA/IEFVRElPX1RZUEUuV0VCQVVESU8gOiBBVURJT19UWVBFLkhUTUxBVURJTztcblxuICAgICAgICAgICAgdGhpcy5pbnB1dCA9IG5ldyBJbnB1dE1hbmFnZXIodGhpcyk7XG4gICAgICAgICAgICB0aGlzLmF1ZGlvID0gbmV3IEF1ZGlvTWFuYWdlcih0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IG5ldyBEYXRhTWFuYWdlcih0aGlzLCBjb25maWcudXNlUGVyc2lzdGFudERhdGEpO1xuICAgICAgICAgICAgdGhpcy5sb2FkZXIgPSBuZXcgbG9hZGVycy5Mb2FkZXIoY29uZmlnLmFzc2V0c1VybCwgY29uZmlnLmxvYWRlckNvbmN1cnJlbmN5KTtcblxuICAgICAgICAgICAgdmFyIGluaXRpYWxTY2VuZTpTY2VuZSA9IG5ldyBTY2VuZSgnaW5pdGlhbCcpLmFkZFRvKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5zZXRTY2VuZShpbml0aWFsU2NlbmUpO1xuXG4gICAgICAgICAgICBpZihjb25maWcuZ2FtZVNjYWxlVHlwZSAhPT0gR0FNRV9TQ0FMRV9UWVBFLk5PTkUpe1xuICAgICAgICAgICAgICAgIHRoaXMuYXV0b1Jlc2l6ZShjb25maWcuZ2FtZVNjYWxlVHlwZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKGNvbmZpZy5zdG9wQXRMb3N0Rm9jdXMpe1xuICAgICAgICAgICAgICAgIHRoaXMuZW5hYmxlU3RvcEF0TG9zdEZvY3VzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9hbmltYXRlKCk6dm9pZCB7XG4gICAgICAgICAgICB0aGlzLnJhZiA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5fYW5pbWF0ZS5iaW5kKHRoaXMpKTtcblxuICAgICAgICAgICAgaWYodGhpcy5zY2VuZSkge1xuICAgICAgICAgICAgICAgIHZhciBub3c6bnVtYmVyID0gRGF0ZS5ub3coKTtcblxuICAgICAgICAgICAgICAgIHRoaXMudGltZSArPSBNYXRoLm1pbigobm93IC0gbGFzdCkgLyAxMDAwLCBtYXhGcmFtZU1TKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRlbHRhID0gdGhpcy50aW1lIC0gdGhpcy5sYXN0VGltZTtcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RUaW1lID0gdGhpcy50aW1lO1xuXG4gICAgICAgICAgICAgICAgbGFzdCA9IG5vdztcblxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIucmVuZGVyKHRoaXMuc2NlbmUpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGUodGhpcy5kZWx0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB1cGRhdGUoZGVsdGFUaW1lOm51bWJlcik6R2FtZSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc2NlbmUuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNjZW5lLmNoaWxkcmVuW2ldLnVwZGF0ZSh0aGlzLmRlbHRhKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9jbGVhbiBraWxsZWQgb2JqZWN0c1xuICAgICAgICAgICAgdmFyIGxlbjpudW1iZXIgPSBDb250YWluZXIuX2tpbGxlZE9iamVjdHMubGVuZ3RoO1xuICAgICAgICAgICAgaWYgKGxlbikge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGk6bnVtYmVyID0gMDsgaSA8IGxlbjsgaSsrKSBDb250YWluZXIuX2tpbGxlZE9iamVjdHNbaV0ucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgQ29udGFpbmVyLl9raWxsZWRPYmplY3RzLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhcnQoKTpHYW1lIHtcbiAgICAgICAgICAgIGxhc3QgPSBEYXRlLm5vdygpO1xuICAgICAgICAgICAgdGhpcy5fYW5pbWF0ZSgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBzdG9wKCk6R2FtZSB7XG4gICAgICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5yYWYpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBlbmFibGVTdG9wQXRMb3N0Rm9jdXMoc3RhdGU6Ym9vbGVhbiA9IHRydWUpOkdhbWV7XG4gICAgICAgICAgICBpZihzdGF0ZSl7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihEZXZpY2UuZ2V0VmlzaWJpbGl0eUNoYW5nZUV2ZW50KCksIHRoaXMuX29uVmlzaWJpbGl0eUNoYW5nZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoRGV2aWNlLmdldFZpc2liaWxpdHlDaGFuZ2VFdmVudCgpLCB0aGlzLl9vblZpc2liaWxpdHlDaGFuZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBkaXNhYmxlU3RvcEF0TG9zdEZvY3VzKCk6R2FtZXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVuYWJsZVN0b3BBdExvc3RGb2N1cyhmYWxzZSk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9vblZpc2liaWxpdHlDaGFuZ2UoKXtcbiAgICAgICAgICAgIHZhciBpc0hpZGUgPSAhIShkb2N1bWVudC5oaWRkZW4gfHwgZG9jdW1lbnQud2Via2l0SGlkZGVuIHx8IGRvY3VtZW50Lm1vekhpZGRlbiB8fCBkb2N1bWVudC5tc0hpZGRlbik7XG4gICAgICAgICAgICBpZihpc0hpZGUpe1xuICAgICAgICAgICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLm9uTG9zdEZvY3VzKGlzSGlkZSk7XG4gICAgICAgIH1cblxuICAgICAgICBvbkxvc3RGb2N1cyhpc0hpZGU6Ym9vbGVhbik6R2FtZXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0U2NlbmUoc2NlbmU6U2NlbmUgfCBzdHJpbmcpOkdhbWUge1xuICAgICAgICAgICAgaWYoIShzY2VuZSBpbnN0YW5jZW9mIFNjZW5lKSl7XG4gICAgICAgICAgICAgICAgc2NlbmUgPSB0aGlzLmdldFNjZW5lKDxzdHJpbmc+c2NlbmUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnNjZW5lID0gPFNjZW5lPnNjZW5lO1xuICAgICAgICAgICAgdGhpcy5zY2VuZS5wb3NpdGlvbi5zZXQodGhpcy53aWR0aC8yLCB0aGlzLmhlaWdodC8yKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0U2NlbmUoaWQ6c3RyaW5nKTpTY2VuZXtcbiAgICAgICAgICAgIHZhciBzY2VuZTpTY2VuZSA9IG51bGw7XG4gICAgICAgICAgICBmb3IodmFyIGk6bnVtYmVyID0gMDsgaSA8IHRoaXMuX3NjZW5lcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5fc2NlbmVzW2ldLmlkID09PSBpZCl7XG4gICAgICAgICAgICAgICAgICAgIHNjZW5lID0gdGhpcy5fc2NlbmVzW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHNjZW5lO1xuICAgICAgICB9XG5cbiAgICAgICAgY3JlYXRlU2NlbmUoaWQ/OnN0cmluZyk6U2NlbmUge1xuICAgICAgICAgICAgcmV0dXJuIChuZXcgU2NlbmUoaWQpKS5hZGRUbyh0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZVNjZW5lKHNjZW5lOnN0cmluZyB8IFNjZW5lKTpHYW1le1xuICAgICAgICAgICAgaWYodHlwZW9mIHNjZW5lID09PSBcInN0cmluZ1wiKXtcbiAgICAgICAgICAgICAgICBzY2VuZSA9IHRoaXMuZ2V0U2NlbmUoPHN0cmluZz5zY2VuZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBpbmRleDpudW1iZXIgPSB0aGlzLl9zY2VuZXMuaW5kZXhPZig8U2NlbmU+c2NlbmUpO1xuICAgICAgICAgICAgaWYoaW5kZXggIT09IC0xKXtcbiAgICAgICAgICAgICAgICB0aGlzLl9zY2VuZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBhZGRTY2VuZShzY2VuZTpTY2VuZSk6R2FtZSB7XG4gICAgICAgICAgICB0aGlzLl9zY2VuZXMucHVzaChzY2VuZSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZUFsbFNjZW5lcygpOkdhbWV7XG4gICAgICAgICAgICB0aGlzLl9zY2VuZXMubGVuZ3RoID0gMDtcbiAgICAgICAgICAgIHRoaXMuc2NlbmUgPSBudWxsO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICByZXNpemUod2lkdGg6bnVtYmVyLCBoZWlnaHQ6bnVtYmVyLCByZW5kZXJlcjpib29sZWFuID0gZmFsc2UpOkdhbWV7XG4gICAgICAgICAgICBpZihyZW5kZXJlcil7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5yZXNpemUod2lkdGgsIGhlaWdodCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLndpZHRoID0gd2lkdGggKyBcInB4XCI7XG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyBcInB4XCI7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgYXV0b1Jlc2l6ZShtb2RlOm51bWJlcik6R2FtZSB7XG4gICAgICAgICAgICBpZih0aGlzLl9yZXNpemVMaXN0ZW5lcil7XG4gICAgICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX3Jlc2l6ZUxpc3RlbmVyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYobW9kZSA9PT0gR0FNRV9TQ0FMRV9UWVBFLk5PTkUpcmV0dXJuO1xuXG4gICAgICAgICAgICBzd2l0Y2gobW9kZSl7XG4gICAgICAgICAgICAgICAgY2FzZSBHQU1FX1NDQUxFX1RZUEUuQVNQRUNUX0ZJVDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVzaXplTGlzdGVuZXIgPSB0aGlzLl9yZXNpemVNb2RlQXNwZWN0Rml0O1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIEdBTUVfU0NBTEVfVFlQRS5BU1BFQ1RfRklMTDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVzaXplTGlzdGVuZXIgPSB0aGlzLl9yZXNpemVNb2RlQXNwZWN0RmlsbDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBHQU1FX1NDQUxFX1RZUEUuRklMTDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVzaXplTGlzdGVuZXIgPSB0aGlzLl9yZXNpemVNb2RlRmlsbDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl9yZXNpemVMaXN0ZW5lci5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIHRoaXMuX3Jlc2l6ZUxpc3RlbmVyKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX3Jlc2l6ZU1vZGVBc3BlY3RGaXQoKTp2b2lke1xuICAgICAgICAgICAgdmFyIHd3Om51bWJlciA9IHBhcnNlSW50KHRoaXMuY2FudmFzLnN0eWxlLndpZHRoLCAxMCkgfHwgdGhpcy5jYW52YXMud2lkdGg7XG4gICAgICAgICAgICB2YXIgaGg6bnVtYmVyID0gcGFyc2VJbnQodGhpcy5jYW52YXMuc3R5bGUuaGVpZ2h0LCAxMCkgfHwgdGhpcy5jYW52YXMuaGVpZ2h0O1xuICAgICAgICAgICAgaWYod2luZG93LmlubmVyV2lkdGggIT09IHd3IHx8IHdpbmRvdy5pbm5lckhlaWdodCAhPT0gaGgpe1xuICAgICAgICAgICAgICAgIHZhciBzY2FsZTpudW1iZXIgPSBNYXRoLm1pbih3aW5kb3cuaW5uZXJXaWR0aC90aGlzLndpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQvdGhpcy5oZWlnaHQpO1xuICAgICAgICAgICAgICAgIHRoaXMucmVzaXplKHRoaXMud2lkdGgqc2NhbGUsIHRoaXMuaGVpZ2h0KnNjYWxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX3Jlc2l6ZU1vZGVBc3BlY3RGaWxsKCk6dm9pZHtcbiAgICAgICAgICAgIHZhciB3dzpudW1iZXIgPSBwYXJzZUludCh0aGlzLmNhbnZhcy5zdHlsZS53aWR0aCwgMTApIHx8IHRoaXMuY2FudmFzLndpZHRoO1xuICAgICAgICAgICAgdmFyIGhoOm51bWJlciA9IHBhcnNlSW50KHRoaXMuY2FudmFzLnN0eWxlLmhlaWdodCwgMTApIHx8IHRoaXMuY2FudmFzLmhlaWdodDtcbiAgICAgICAgICAgIGlmKHdpbmRvdy5pbm5lcldpZHRoICE9PSB3dyB8fCB3aW5kb3cuaW5uZXJIZWlnaHQgIT09IGhoKXtcbiAgICAgICAgICAgICAgICB2YXIgc2NhbGU6bnVtYmVyID0gTWF0aC5tYXgod2luZG93LmlubmVyV2lkdGgvdGhpcy53aWR0aCwgd2luZG93LmlubmVySGVpZ2h0L3RoaXMuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICB2YXIgd2lkdGg6bnVtYmVyID0gdGhpcy53aWR0aCpzY2FsZTtcbiAgICAgICAgICAgICAgICB2YXIgaGVpZ2h0Om51bWJlciA9IHRoaXMuaGVpZ2h0KnNjYWxlO1xuXG4gICAgICAgICAgICAgICAgdmFyIHRvcE1hcmdpbjpudW1iZXIgPSAod2luZG93LmlubmVySGVpZ2h0LWhlaWdodCkvMjtcbiAgICAgICAgICAgICAgICB2YXIgbGVmdE1hcmdpbjpudW1iZXIgPSAod2luZG93LmlubmVyV2lkdGgtd2lkdGgpLzI7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnJlc2l6ZSh3aWR0aCwgaGVpZ2h0KTtcblxuICAgICAgICAgICAgICAgIHZhciBzdHlsZTphbnkgPSA8YW55PnRoaXMuY2FudmFzLnN0eWxlO1xuICAgICAgICAgICAgICAgIHN0eWxlWydtYXJnaW4tdG9wJ10gPSB0b3BNYXJnaW4gKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgc3R5bGVbJ21hcmdpbi1sZWZ0J10gPSBsZWZ0TWFyZ2luICsgXCJweFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfcmVzaXplTW9kZUZpbGwoKTp2b2lke1xuICAgICAgICAgICAgdmFyIHd3Om51bWJlciA9IHBhcnNlSW50KHRoaXMuY2FudmFzLnN0eWxlLndpZHRoLCAxMCkgfHwgdGhpcy5jYW52YXMud2lkdGg7XG4gICAgICAgICAgICB2YXIgaGg6bnVtYmVyID0gcGFyc2VJbnQodGhpcy5jYW52YXMuc3R5bGUuaGVpZ2h0LCAxMCkgfHwgdGhpcy5jYW52YXMuaGVpZ2h0O1xuICAgICAgICAgICAgaWYod2luZG93LmlubmVyV2lkdGggIT09IHd3IHx8IHdpbmRvdy5pbm5lckhlaWdodCAhPT0gaGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGdldCB3aWR0aCgpOm51bWJlciB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJlci53aWR0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBoZWlnaHQoKTpudW1iZXIge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyZXIuaGVpZ2h0O1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIEdhbWVDb25maWcge1xuICAgICAgICBpZD86c3RyaW5nO1xuICAgICAgICB3aWR0aD86bnVtYmVyO1xuICAgICAgICBoZWlnaHQ/Om51bWJlcjtcbiAgICAgICAgdXNlV2ViQXVkaW8/OmJvb2xlYW47XG4gICAgICAgIHVzZVBlcnNpc3RhbnREYXRhPzpib29sZWFuO1xuICAgICAgICBnYW1lU2NhbGVUeXBlPzpudW1iZXI7XG4gICAgICAgIHN0b3BBdExvc3RGb2N1cz86Ym9vbGVhbjtcbiAgICAgICAgYXNzZXRzVXJsPzpzdHJpbmc7XG4gICAgICAgIGxvYWRlckNvbmN1cnJlbmN5PzpudW1iZXI7XG4gICAgfVxufVxuXG5pbnRlcmZhY2UgT2JqZWN0IHtcbiAgICBhc3NpZ24odGFyZ2V0Ok9iamVjdCwgLi4uc291cmNlczpPYmplY3RbXSk6T2JqZWN0O1xufSJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
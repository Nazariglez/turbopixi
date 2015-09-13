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
                this.isPaused = false;
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
                } else {
                    this._htmlAudio.pause();
                    this._htmlAudio.currentTime = 0;
                }
                this.reset();
                return this;
            };
            AudioLine.prototype.pause = function () {
                if (this.manager.context) {
                } else {
                    this._htmlAudio.pause();
                }
                this.paused = true;
                return this;
            };
            AudioLine.prototype.resume = function () {
                if (this.paused) {
                    if (this.manager.context) {
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
                } else {
                    this._htmlAudio.volume = 0;
                }
                return this;
            };
            AudioLine.prototype.unmute = function () {
                this.muted = false;
                this.muted = true;
                if (this.manager.context) {
                } else {
                    this._htmlAudio.volume = this.audio.volume;
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
            soundMaxLines: 10,
            musicMaxLines: 1
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
                this.audio = new PIXI.AudioManager(config.soundMaxLines, config.musicMaxLines);
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
    ///<reference path="./AudioLine.ts" />
    ///<reference path="../core/Game.ts" />
    var PIXI;
    (function (PIXI) {
        var AudioManager = function () {
            function AudioManager(soundMaxLines, musicMaxLines) {
                if (soundMaxLines === void 0) {
                    soundMaxLines = 10;
                }
                if (musicMaxLines === void 0) {
                    musicMaxLines = 1;
                }
                this.soundMaxLines = soundMaxLines;
                this.musicMaxLines = musicMaxLines;
                this.soundLines = [];
                this.musicLines = [];
                this._tempLines = [];
                this.musicMuted = false;
                this.soundMuted = false;
                if (PIXI.utils._audioTypeSelected === PIXI.AUDIO_TYPE.WEBAUDIO) {
                    this.context = PIXI.Device.globalWebAudioContext;
                    this.gainNode = _createGainNode(this.context);
                    this.gainNode.connect(this.context.destination);
                }
                var i;
                for (i = 0; i < this.soundMaxLines; i++) {
                    this.soundLines.push(new PIXI.AudioLine(this));
                }
                for (i = 0; i < this.musicMaxLines; i++) {
                    this.musicLines.push(new PIXI.AudioLine(this));
                }
            }
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
            AudioManager.prototype.stopMusic = function (id) {
                return this._stop(id, this.musicLines);
            };
            AudioManager.prototype.stopSound = function (id) {
                return this._stop(id, this.soundLines);
            };
            AudioManager.prototype.pauseMusic = function (id) {
                return this._pause(id, this.musicLines);
            };
            AudioManager.prototype.pauseSound = function (id) {
                return this._pause(id, this.soundLines);
            };
            AudioManager.prototype.resumeMusic = function (id) {
                return this._resume(id, this.musicLines);
            };
            AudioManager.prototype.resumeSound = function (id) {
                return this._resume(id, this.soundLines);
            };
            AudioManager.prototype.muteMusic = function (id) {
                return this._mute(id, this.musicLines);
            };
            AudioManager.prototype.muteSound = function (id) {
                return this._mute(id, this.soundLines);
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
                var audio = PIXI.utils.AudioCache[id];
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
            return AudioManager;
        }();
        PIXI.AudioManager = AudioManager;
        function _createGainNode(ctx) {
            return ctx.createGain ? ctx.createGain() : ctx.createGainNode();
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInR1cmJvcGl4aS5qcyIsImluZGV4LnRzIiwiYXVkaW8vQXVkaW9MaW5lLnRzIiwiY29yZS9jb25zdC50cyIsImNvcmUvRGV2aWNlLnRzIiwiZGlzcGxheS9TY2VuZS50cyIsImlucHV0L0lucHV0TWFuYWdlci50cyIsImxvYWRlci9iaXRtYXBGb250UGFyc2VyVFhULnRzIiwibG9hZGVyL2F1ZGlvUGFyc2VyLnRzIiwiY29yZS9VdGlscy50cyIsImxvYWRlci9Mb2FkZXIudHMiLCJjb3JlL0RhdGFNYW5hZ2VyLnRzIiwiY29yZS9HYW1lLnRzIiwiYXVkaW8vQXVkaW9NYW5hZ2VyLnRzIiwiYXVkaW8vQXVkaW8udHMiLCJkaXNwbGF5L0NvbnRhaW5lci50cyIsImRpc3BsYXkvRGlzcGxheU9iamVjdC50cyJdLCJuYW1lcyI6WyJQSVhJIiwiRXJyb3IiLCJQSVhJX1ZFUlNJT05fUkVRVUlSRUQiLCJQSVhJX1ZFUlNJT04iLCJWRVJTSU9OIiwibWF0Y2giLCJIVE1MQXVkaW8iLCJBdWRpbyIsIlBJWEkuQXVkaW9MaW5lIiwiUElYSS5BdWRpb0xpbmUuY29uc3RydWN0b3IiLCJQSVhJLkF1ZGlvTGluZS5zZXRBdWRpbyIsIlBJWEkuQXVkaW9MaW5lLnBsYXkiLCJQSVhJLkF1ZGlvTGluZS5zdG9wIiwiUElYSS5BdWRpb0xpbmUucGF1c2UiLCJQSVhJLkF1ZGlvTGluZS5yZXN1bWUiLCJQSVhJLkF1ZGlvTGluZS5tdXRlIiwiUElYSS5BdWRpb0xpbmUudW5tdXRlIiwiUElYSS5BdWRpb0xpbmUucmVzZXQiLCJQSVhJLkF1ZGlvTGluZS5fb25FbmQiLCJQSVhJLkdBTUVfU0NBTEVfVFlQRSIsIlBJWEkuQVVESU9fVFlQRSIsIlBJWEkuRGV2aWNlIiwiUElYSS5EZXZpY2UuZ2V0TW91c2VXaGVlbEV2ZW50IiwiUElYSS5EZXZpY2UudmlicmF0ZSIsIlBJWEkuRGV2aWNlLmdldFZpc2liaWxpdHlDaGFuZ2VFdmVudCIsIlBJWEkuRGV2aWNlLmlzT25saW5lIiwiX19leHRlbmRzIiwiZCIsImIiLCJwIiwiaGFzT3duUHJvcGVydHkiLCJfXyIsImNvbnN0cnVjdG9yIiwicHJvdG90eXBlIiwiUElYSS5TY2VuZSIsIlBJWEkuU2NlbmUuY29uc3RydWN0b3IiLCJQSVhJLlNjZW5lLmFkZFRvIiwiUElYSS5JbnB1dE1hbmFnZXIiLCJQSVhJLklucHV0TWFuYWdlci5jb25zdHJ1Y3RvciIsIlBJWEkuYml0bWFwRm9udFBhcnNlclRYVCIsInJlc291cmNlIiwiZGF0YSIsInhoclR5cGUiLCJuZXh0IiwidGV4dCIsInhociIsInJlc3BvbnNlVGV4dCIsImluZGV4T2YiLCJ1cmwiLCJkaXJuYW1lIiwiYmFzZVVybCIsImNoYXJBdCIsImxlbmd0aCIsInJlcGxhY2UiLCJ0ZXh0dXJlVXJsIiwiZ2V0VGV4dHVyZVVybCIsInV0aWxzIiwiVGV4dHVyZUNhY2hlIiwicGFyc2UiLCJsb2FkT3B0aW9ucyIsImNyb3NzT3JpZ2luIiwibG9hZFR5cGUiLCJsb2FkZXJzIiwiUmVzb3VyY2UiLCJMT0FEX1RZUEUiLCJJTUFHRSIsImFkZCIsIm5hbWUiLCJyZXMiLCJ0ZXh0dXJlIiwiUElYSS5wYXJzZSIsIlBJWEkuZGlybmFtZSIsIlBJWEkuZ2V0VGV4dHVyZVVybCIsIlBJWEkuZ2V0QXR0ciIsIlBJWEkuYXVkaW9QYXJzZXIiLCJEZXZpY2UiLCJpc0F1ZGlvU3VwcG9ydGVkIiwiZXh0IiwiX2dldEV4dCIsIl9hbGxvd2VkRXh0IiwiX2NhblBsYXkiLCJfYXVkaW9UeXBlU2VsZWN0ZWQiLCJBVURJT19UWVBFIiwiV0VCQVVESU8iLCJnbG9iYWxXZWJBdWRpb0NvbnRleHQiLCJkZWNvZGVBdWRpb0RhdGEiLCJfYWRkVG9DYWNoZSIsImJpbmQiLCJQSVhJLmF1ZGlvUGFyc2VyVXJsIiwiUElYSS5fYWRkVG9DYWNoZSIsIlBJWEkuX2dldEV4dCIsIlBJWEkuX2NhblBsYXkiLCJQSVhJLnV0aWxzIiwiUElYSS5sb2FkZXJzIiwiUElYSS5sb2FkZXJzLlR1cmJvTG9hZGVyIiwiUElYSS5sb2FkZXJzLlR1cmJvTG9hZGVyLmNvbnN0cnVjdG9yIiwiUElYSS5sb2FkZXJzLlR1cmJvTG9hZGVyLmFkZCIsIlBJWEkubG9hZGVycy5fY2hlY2tBdWRpb1R5cGUiLCJQSVhJLmxvYWRlcnMuX3NldEF1ZGlvRXh0IiwiUElYSS5EYXRhTWFuYWdlciIsIlBJWEkuRGF0YU1hbmFnZXIuY29uc3RydWN0b3IiLCJQSVhJLkRhdGFNYW5hZ2VyLmxvYWQiLCJQSVhJLkRhdGFNYW5hZ2VyLnNhdmUiLCJQSVhJLkRhdGFNYW5hZ2VyLnJlc2V0IiwiUElYSS5EYXRhTWFuYWdlci5zZXQiLCJQSVhJLkRhdGFNYW5hZ2VyLmdldCIsIlBJWEkuRGF0YU1hbmFnZXIuZGVsIiwiUElYSS5HYW1lIiwiUElYSS5HYW1lLmNvbnN0cnVjdG9yIiwiUElYSS5HYW1lLl9hbmltYXRlIiwiUElYSS5HYW1lLnVwZGF0ZSIsIlBJWEkuR2FtZS5zdGFydCIsIlBJWEkuR2FtZS5zdG9wIiwiUElYSS5HYW1lLmVuYWJsZVN0b3BBdExvc3RGb2N1cyIsIlBJWEkuR2FtZS5kaXNhYmxlU3RvcEF0TG9zdEZvY3VzIiwiUElYSS5HYW1lLl9vblZpc2liaWxpdHlDaGFuZ2UiLCJQSVhJLkdhbWUub25Mb3N0Rm9jdXMiLCJQSVhJLkdhbWUuc2V0U2NlbmUiLCJQSVhJLkdhbWUuZ2V0U2NlbmUiLCJQSVhJLkdhbWUuY3JlYXRlU2NlbmUiLCJQSVhJLkdhbWUucmVtb3ZlU2NlbmUiLCJQSVhJLkdhbWUuYWRkU2NlbmUiLCJQSVhJLkdhbWUucmVtb3ZlQWxsU2NlbmVzIiwiUElYSS5HYW1lLnJlc2l6ZSIsIlBJWEkuR2FtZS5hdXRvUmVzaXplIiwiUElYSS5HYW1lLl9yZXNpemVNb2RlQXNwZWN0Rml0IiwiUElYSS5HYW1lLl9yZXNpemVNb2RlQXNwZWN0RmlsbCIsIlBJWEkuR2FtZS5fcmVzaXplTW9kZUZpbGwiLCJnZXQiLCJQSVhJLkdhbWUud2lkdGgiLCJlbnVtZXJhYmxlIiwiY29uZmlndXJhYmxlIiwiUElYSS5HYW1lLmhlaWdodCIsIlBJWEkuQXVkaW9NYW5hZ2VyIiwiUElYSS5BdWRpb01hbmFnZXIuY29uc3RydWN0b3IiLCJQSVhJLkF1ZGlvTWFuYWdlci5wYXVzZUFsbExpbmVzIiwiUElYSS5BdWRpb01hbmFnZXIucmVzdW1lQWxsTGluZXMiLCJQSVhJLkF1ZGlvTWFuYWdlci5wbGF5TXVzaWMiLCJQSVhJLkF1ZGlvTWFuYWdlci5wbGF5U291bmQiLCJQSVhJLkF1ZGlvTWFuYWdlci5zdG9wTXVzaWMiLCJQSVhJLkF1ZGlvTWFuYWdlci5zdG9wU291bmQiLCJQSVhJLkF1ZGlvTWFuYWdlci5wYXVzZU11c2ljIiwiUElYSS5BdWRpb01hbmFnZXIucGF1c2VTb3VuZCIsIlBJWEkuQXVkaW9NYW5hZ2VyLnJlc3VtZU11c2ljIiwiUElYSS5BdWRpb01hbmFnZXIucmVzdW1lU291bmQiLCJQSVhJLkF1ZGlvTWFuYWdlci5tdXRlTXVzaWMiLCJQSVhJLkF1ZGlvTWFuYWdlci5tdXRlU291bmQiLCJQSVhJLkF1ZGlvTWFuYWdlci51bm11dGVNdXNpYyIsIlBJWEkuQXVkaW9NYW5hZ2VyLnVubXV0ZVNvdW5kIiwiUElYSS5BdWRpb01hbmFnZXIuX3BhdXNlIiwiUElYSS5BdWRpb01hbmFnZXIuX3Jlc3VtZSIsIlBJWEkuQXVkaW9NYW5hZ2VyLl9wbGF5IiwiUElYSS5BdWRpb01hbmFnZXIuX3N0b3AiLCJQSVhJLkF1ZGlvTWFuYWdlci5fbXV0ZSIsIlBJWEkuQXVkaW9NYW5hZ2VyLl91bm11dGUiLCJQSVhJLkF1ZGlvTWFuYWdlci5fZ2V0TGluZXNCeUlkIiwiUElYSS5BdWRpb01hbmFnZXIuX2dldEF2YWlsYWJsZUxpbmVGcm9tIiwiUElYSS5fY3JlYXRlR2Fpbk5vZGUiLCJQSVhJLkF1ZGlvIiwiUElYSS5BdWRpby5jb25zdHJ1Y3RvciIsInBvc2l0aW9uIiwieCIsInZlbG9jaXR5IiwiZGVsdGFUaW1lIiwieSIsInJvdGF0aW9uIiwicm90YXRpb25TcGVlZCIsImkiLCJjaGlsZHJlbiIsInVwZGF0ZSIsInBhcmVudCIsImFkZENoaWxkIiwiQ29udGFp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U0FBQUEsQ0FBVUEsU0FBVkEsQ0FBb0JBLE1BQXBCQSxHQUE2QkEsWUFBQUE7QUFBQUEsWUFDekIsSUFBRyxLQUFLMEssTUFBUixFQUFlO0FBQUEsZ0JBQ1gsS0FBS0EsTUFBTCxDQUFZSyxXQUFaLENBQXdCLElBQXhCLEVBRFc7QUFBQSxhQURVL0s7QUFBQUEsWUFJekIsT0FBTyxJQUFQLENBSnlCQTtBQUFBQSxTQUE3QkEsQ0F6QlE7QUFBQSxLQUFaLENBQU9BLElBQUEsSUFBQSxDQUFBQSxJQUFBLEdBQUksRUFBSixDQUFQO0lDQUE7QUFBQSxRQUFPQSxJQUFQO0lBQUEsQ0FBQSxVQUFPQSxJQUFQLEVBQVk7QUFBQSxRQUNSQSxJQUFBQSxDQUFBQSxhQUFBQSxDQUFjQSxTQUFkQSxDQUF3QkEsS0FBeEJBLEdBQWdDQSxDQUFoQ0EsQ0FEUTtBQUFBLFFBRVJBLElBQUFBLENBQUFBLGFBQUFBLENBQWNBLFNBQWRBLENBQXdCQSxRQUF4QkEsR0FBbUNBLElBQUlBLElBQUFBLENBQUFBLEtBQUpBLEVBQW5DQSxDQUZRO0FBQUEsUUFHUkEsSUFBQUEsQ0FBQUEsYUFBQUEsQ0FBY0EsU0FBZEEsQ0FBd0JBLFNBQXhCQSxHQUFvQ0EsQ0FBcENBLENBSFE7QUFBQSxRQUlSQSxJQUFBQSxDQUFBQSxhQUFBQSxDQUFjQSxTQUFkQSxDQUF3QkEsYUFBeEJBLEdBQXdDQSxDQUF4Q0EsQ0FKUTtBQUFBLFFBTVJBLElBQUFBLENBQUFBLGFBQUFBLENBQWNBLFNBQWRBLENBQXdCQSxNQUF4QkEsR0FBaUNBLFVBQVNBLFNBQVRBLEVBQXlCQTtBQUFBQSxZQUN0RCxPQUFPLElBQVAsQ0FEc0RBO0FBQUFBLFNBQTFEQSxDQU5RO0FBQUEsS0FBWixDQUFPQSxJQUFBLElBQUEsQ0FBQUEsSUFBQSxHQUFJLEVBQUosQ0FBUCIsImZpbGUiOiJ0dXJib3BpeGkuanMiLCJzb3VyY2VzQ29udGVudCI6W251bGwsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL2RlZnMvcGl4aS5qcy5kLnRzXCIgLz5cbmlmKCFQSVhJKXtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0V5ISBXaGVyZSBpcyBwaXhpLmpzPz8nKTtcbn1cblxuY29uc3QgUElYSV9WRVJTSU9OX1JFUVVJUkVEID0gXCIzLjAuN1wiO1xuY29uc3QgUElYSV9WRVJTSU9OID0gUElYSS5WRVJTSU9OLm1hdGNoKC9cXGQuXFxkLlxcZC8pWzBdO1xuXG5pZihQSVhJX1ZFUlNJT04gPCBQSVhJX1ZFUlNJT05fUkVRVUlSRUQpe1xuICAgIHRocm93IG5ldyBFcnJvcihcIlBpeGkuanMgdlwiICsgUElYSS5WRVJTSU9OICsgXCIgaXQncyBub3Qgc3VwcG9ydGVkLCBwbGVhc2UgdXNlIF5cIiArIFBJWElfVkVSU0lPTl9SRVFVSVJFRCk7XG59XG4iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuL0F1ZGlvTWFuYWdlci50c1wiIC8+XG52YXIgSFRNTEF1ZGlvID0gQXVkaW87XG5tb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IGNsYXNzIEF1ZGlvTGluZSB7XG4gICAgICAgIGF2YWlsYWJsZTpib29sZWFuID0gdHJ1ZTtcbiAgICAgICAgYXVkaW86QXVkaW87XG4gICAgICAgIGxvb3A6Ym9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBwYXVzZWQ6Ym9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBjYWxsYmFjazpGdW5jdGlvbjtcbiAgICAgICAgbXV0ZWQ6Ym9vbGVhbiA9IGZhbHNlO1xuXG4gICAgICAgIHN0YXJ0VGltZTpudW1iZXIgPSAwO1xuICAgICAgICBsYXN0UGF1c2VUaW1lOm51bWJlciA9IDA7XG4gICAgICAgIG9mZnNldFRpbWU6bnVtYmVyID0gMDtcblxuICAgICAgICBpc1BhdXNlZDpib29sZWFuID0gZmFsc2U7XG5cbiAgICAgICAgcHJpdmF0ZSBfaHRtbEF1ZGlvOkhUTUxBdWRpb0VsZW1lbnQ7XG4gICAgICAgIHByaXZhdGUgX3dlYkF1ZGlvOkF1ZGlvQ29udGV4dDtcblxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbWFuYWdlcjpBdWRpb01hbmFnZXIpe1xuICAgICAgICAgICAgaWYoIXRoaXMubWFuYWdlci5jb250ZXh0KXtcbiAgICAgICAgICAgICAgICB0aGlzLl9odG1sQXVkaW8gPSBuZXcgSFRNTEF1ZGlvKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5faHRtbEF1ZGlvLmFkZEV2ZW50TGlzdGVuZXIoJ2VuZGVkJywgdGhpcy5fb25FbmQuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzZXRBdWRpbyhhdWRpbzpBdWRpbywgbG9vcDpib29sZWFufEZ1bmN0aW9uLCBjYWxsYmFjaz86RnVuY3Rpb24pOkF1ZGlvTGluZXtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBsb29wID09PSBcImZ1bmN0aW9uXCIpe1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrID0gPEZ1bmN0aW9uPmxvb3A7XG4gICAgICAgICAgICAgICAgbG9vcCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmF1ZGlvID0gYXVkaW87XG4gICAgICAgICAgICB0aGlzLmF2YWlsYWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5sb29wID0gPGJvb2xlYW4+bG9vcDtcbiAgICAgICAgICAgIHRoaXMuY2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcGxheShwYXVzZT86Ym9vbGVhbik6QXVkaW9MaW5lIHtcbiAgICAgICAgICAgIGlmKCFwYXVzZSAmJiB0aGlzLnBhdXNlZClyZXR1cm4gdGhpcztcblxuICAgICAgICAgICAgaWYodGhpcy5tYW5hZ2VyLmNvbnRleHQpe1xuXG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICB0aGlzLl9odG1sQXVkaW8uc3JjID0gKHRoaXMuYXVkaW8uc291cmNlLnNyYyAhPT0gXCJcIikgPyB0aGlzLmF1ZGlvLnNvdXJjZS5zcmMgOiB0aGlzLmF1ZGlvLnNvdXJjZS5jaGlsZHJlblswXS5zcmM7XG4gICAgICAgICAgICAgICAgdGhpcy5faHRtbEF1ZGlvLnByZWxvYWQgPSBcImF1dG9cIjtcbiAgICAgICAgICAgICAgICB0aGlzLl9odG1sQXVkaW8udm9sdW1lID0gKHRoaXMuYXVkaW8ubXV0ZWQgfHwgdGhpcy5tdXRlZCkgPyAwIDogdGhpcy5hdWRpby52b2x1bWU7XG4gICAgICAgICAgICAgICAgdGhpcy5faHRtbEF1ZGlvLmxvYWQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9odG1sQXVkaW8ucGxheSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHN0b3AoKTpBdWRpb0xpbmUge1xuICAgICAgICAgICAgaWYodGhpcy5tYW5hZ2VyLmNvbnRleHQpe1xuXG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICB0aGlzLl9odG1sQXVkaW8ucGF1c2UoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9odG1sQXVkaW8uY3VycmVudFRpbWUgPSAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHBhdXNlKCk6QXVkaW9MaW5le1xuICAgICAgICAgICAgaWYodGhpcy5tYW5hZ2VyLmNvbnRleHQpe1xuXG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICB0aGlzLl9odG1sQXVkaW8ucGF1c2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucGF1c2VkID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzdW1lKCk6QXVkaW9MaW5le1xuICAgICAgICAgICAgaWYodGhpcy5wYXVzZWQpe1xuICAgICAgICAgICAgICAgIGlmKHRoaXMubWFuYWdlci5jb250ZXh0KXtcblxuICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9odG1sQXVkaW8ucGxheSgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMucGF1c2VkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIG11dGUoKTpBdWRpb0xpbmV7XG4gICAgICAgICAgICB0aGlzLm11dGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmKHRoaXMubWFuYWdlci5jb250ZXh0KXtcblxuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgdGhpcy5faHRtbEF1ZGlvLnZvbHVtZSA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHVubXV0ZSgpOkF1ZGlvTGluZXtcbiAgICAgICAgICAgIHRoaXMubXV0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMubXV0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgaWYodGhpcy5tYW5hZ2VyLmNvbnRleHQpe1xuXG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICB0aGlzLl9odG1sQXVkaW8udm9sdW1lID0gdGhpcy5hdWRpby52b2x1bWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc2V0KCk6QXVkaW9MaW5le1xuICAgICAgICAgICAgdGhpcy5hdmFpbGFibGUgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5hdWRpbyA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmxvb3AgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuY2FsbGJhY2sgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5wYXVzZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMubXV0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuX3dlYkF1ZGlvID0gbnVsbDtcblxuICAgICAgICAgICAgdGhpcy5zdGFydFRpbWUgPSAwO1xuICAgICAgICAgICAgdGhpcy5sYXN0UGF1c2VUaW1lID0gMDtcbiAgICAgICAgICAgIHRoaXMub2Zmc2V0VGltZSA9IDA7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX29uRW5kKCk6dm9pZHtcbiAgICAgICAgICAgIGlmKHRoaXMuY2FsbGJhY2spdGhpcy5jYWxsYmFjayh0aGlzLm1hbmFnZXIsIHRoaXMuYXVkaW8pO1xuXG4gICAgICAgICAgICBpZighdGhpcy5tYW5hZ2VyLmNvbnRleHQpe1xuICAgICAgICAgICAgICAgIGlmKHRoaXMubG9vcCB8fCB0aGlzLmF1ZGlvLmxvb3Ape1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9odG1sQXVkaW8uY3VycmVudFRpbWUgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9odG1sQXVkaW8ucGxheSgpO1xuICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfWVsc2UgaWYodGhpcy5tYW5hZ2VyLmNvbnRleHQgJiYgIXRoaXMucGF1c2VkKXtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59IiwibW9kdWxlIFBJWEkge1xuICAgIGV4cG9ydCBlbnVtIEdBTUVfU0NBTEVfVFlQRSB7XG4gICAgICAgIE5PTkUsXG4gICAgICAgIEZJTEwsXG4gICAgICAgIEFTUEVDVF9GSVQsXG4gICAgICAgIEFTUEVDVF9GSUxMXG4gICAgfVxuXG4gICAgZXhwb3J0IGVudW0gQVVESU9fVFlQRSB7XG4gICAgICAgIFVOS05PV04sXG4gICAgICAgIFdFQkFVRElPLFxuICAgICAgICBIVE1MQVVESU9cbiAgICB9XG59IiwiLy9NYW55IGNoZWNrcyBhcmUgYmFzZWQgb24gaHR0cHM6Ly9naXRodWIuY29tL2FyYXNhdGFzYXlnaW4vaXMuanMvYmxvYi9tYXN0ZXIvaXMuanNcblxubW9kdWxlIFBJWEkge1xuICAgIGV4cG9ydCBtb2R1bGUgRGV2aWNlIHtcbiAgICAgICAgdmFyIG5hdmlnYXRvcjpOYXZpZ2F0b3IgPSB3aW5kb3cubmF2aWdhdG9yO1xuICAgICAgICB2YXIgZG9jdW1lbnQ6RG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG5cbiAgICAgICAgdmFyIHVzZXJBZ2VudDpzdHJpbmcgPSAnbmF2aWdhdG9yJyBpbiB3aW5kb3cgJiYgJ3VzZXJBZ2VudCcgaW4gbmF2aWdhdG9yICYmIG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKSB8fCAnJyxcbiAgICAgICAgICAgIHZlbmRvcjpzdHJpbmcgPSAnbmF2aWdhdG9yJyBpbiB3aW5kb3cgJiYgJ3ZlbmRvcicgaW4gbmF2aWdhdG9yICYmIG5hdmlnYXRvci52ZW5kb3IudG9Mb3dlckNhc2UoKSB8fCAnJyxcbiAgICAgICAgICAgIGFwcFZlcnNpb246c3RyaW5nID0gJ25hdmlnYXRvcicgaW4gd2luZG93ICYmICdhcHBWZXJzaW9uJyBpbiBuYXZpZ2F0b3IgJiYgbmF2aWdhdG9yLmFwcFZlcnNpb24udG9Mb3dlckNhc2UoKSB8fCAnJztcblxuICAgICAgICAvL0Jyb3dzZXJzXG4gICAgICAgIGV4cG9ydCB2YXIgaXNDaHJvbWU6Ym9vbGVhbiA9IC9jaHJvbWV8Y2hyb21pdW0vaS50ZXN0KHVzZXJBZ2VudCkgJiYgL2dvb2dsZSBpbmMvLnRlc3QodmVuZG9yKSxcbiAgICAgICAgICAgIGlzRmlyZWZveDpib29sZWFuID0gL2ZpcmVmb3gvaS50ZXN0KHVzZXJBZ2VudCksXG4gICAgICAgICAgICBpc0lFOmJvb2xlYW4gPSAvbXNpZS9pLnRlc3QodXNlckFnZW50KSB8fCBcIkFjdGl2ZVhPYmplY3RcIiBpbiB3aW5kb3csXG4gICAgICAgICAgICBpc09wZXJhOmJvb2xlYW4gPSAvXk9wZXJhXFwvLy50ZXN0KHVzZXJBZ2VudCkgfHwgL1xceDIwT1BSXFwvLy50ZXN0KHVzZXJBZ2VudCksXG4gICAgICAgICAgICBpc1NhZmFyaTpib29sZWFuID0gL3NhZmFyaS9pLnRlc3QodXNlckFnZW50KSAmJiAvYXBwbGUgY29tcHV0ZXIvaS50ZXN0KHZlbmRvcik7XG5cbiAgICAgICAgLy9EZXZpY2VzICYmIE9TXG4gICAgICAgIGV4cG9ydCB2YXIgaXNJcGhvbmU6Ym9vbGVhbiA9IC9pcGhvbmUvaS50ZXN0KHVzZXJBZ2VudCksXG4gICAgICAgICAgICBpc0lwYWQ6Ym9vbGVhbiA9IC9pcGFkL2kudGVzdCh1c2VyQWdlbnQpLFxuICAgICAgICAgICAgaXNJcG9kOmJvb2xlYW4gPSAvaXBvZC9pLnRlc3QodXNlckFnZW50KSxcbiAgICAgICAgICAgIGlzQW5kcm9pZDpib29sZWFuID0gL2FuZHJvaWQvaS50ZXN0KHVzZXJBZ2VudCksXG4gICAgICAgICAgICBpc0FuZHJvaWRQaG9uZTpib29sZWFuID0gL2FuZHJvaWQvaS50ZXN0KHVzZXJBZ2VudCkgJiYgL21vYmlsZS9pLnRlc3QodXNlckFnZW50KSxcbiAgICAgICAgICAgIGlzQW5kcm9pZFRhYmxldDpib29sZWFuID0gL2FuZHJvaWQvaS50ZXN0KHVzZXJBZ2VudCkgJiYgIS9tb2JpbGUvaS50ZXN0KHVzZXJBZ2VudCksXG4gICAgICAgICAgICBpc0xpbnV4OmJvb2xlYW4gPSAvbGludXgvaS50ZXN0KGFwcFZlcnNpb24pLFxuICAgICAgICAgICAgaXNNYWM6Ym9vbGVhbiA9IC9tYWMvaS50ZXN0KGFwcFZlcnNpb24pLFxuICAgICAgICAgICAgaXNXaW5kb3c6Ym9vbGVhbiA9IC93aW4vaS50ZXN0KGFwcFZlcnNpb24pLFxuICAgICAgICAgICAgaXNXaW5kb3dQaG9uZTpib29sZWFuID0gaXNXaW5kb3cgJiYgL3Bob25lL2kudGVzdCh1c2VyQWdlbnQpLFxuICAgICAgICAgICAgaXNXaW5kb3dUYWJsZXQ6Ym9vbGVhbiA9IGlzV2luZG93ICYmICFpc1dpbmRvd1Bob25lICYmIC90b3VjaC9pLnRlc3QodXNlckFnZW50KSxcbiAgICAgICAgICAgIGlzTW9iaWxlOmJvb2xlYW4gPSBpc0lwaG9uZSB8fCBpc0lwb2R8fCBpc0FuZHJvaWRQaG9uZSB8fCBpc1dpbmRvd1Bob25lLFxuICAgICAgICAgICAgaXNUYWJsZXQ6Ym9vbGVhbiA9IGlzSXBhZCB8fCBpc0FuZHJvaWRUYWJsZXQgfHwgaXNXaW5kb3dUYWJsZXQsXG4gICAgICAgICAgICBpc0Rlc2t0b3A6Ym9vbGVhbiA9ICFpc01vYmlsZSAmJiAhaXNUYWJsZXQsXG4gICAgICAgICAgICBpc1RvdWNoRGV2aWNlOmJvb2xlYW4gPSAnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cgfHwnRG9jdW1lbnRUb3VjaCcgaW4gd2luZG93ICYmIGRvY3VtZW50IGluc3RhbmNlb2YgRG9jdW1lbnRUb3VjaCxcbiAgICAgICAgICAgIGlzQ29jb29uOmJvb2xlYW4gPSAhIW5hdmlnYXRvci5pc0NvY29vbkpTLFxuICAgICAgICAgICAgaXNOb2RlV2Via2l0OmJvb2xlYW4gPSAhISh0eXBlb2YgcHJvY2VzcyA9PT0gXCJvYmplY3RcIiAmJiBwcm9jZXNzLnRpdGxlID09PSBcIm5vZGVcIiAmJiB0eXBlb2YgZ2xvYmFsID09PSBcIm9iamVjdFwiKSxcbiAgICAgICAgICAgIGlzRWplY3RhOmJvb2xlYW4gPSAhIXdpbmRvdy5lamVjdGEsXG4gICAgICAgICAgICBpc0Nyb3Nzd2Fsazpib29sZWFuID0gL0Nyb3Nzd2Fsay8udGVzdCh1c2VyQWdlbnQpLFxuICAgICAgICAgICAgaXNDb3Jkb3ZhOmJvb2xlYW4gPSAhIXdpbmRvdy5jb3Jkb3ZhLFxuICAgICAgICAgICAgaXNFbGVjdHJvbjpib29sZWFuID0gISEodHlwZW9mIHByb2Nlc3MgPT09IFwib2JqZWN0XCIgJiYgcHJvY2Vzcy52ZXJzaW9ucyAmJiAocHJvY2Vzcy52ZXJzaW9ucy5lbGVjdHJvbiB8fCBwcm9jZXNzLnZlcnNpb25zWydhdG9tLXNoZWxsJ10pKTtcblxuICAgICAgICBleHBvcnQgdmFyIGlzVmlicmF0ZVN1cHBvcnRlZDpib29sZWFuID0gISFuYXZpZ2F0b3IudmlicmF0ZSAmJiAoaXNNb2JpbGUgfHwgaXNUYWJsZXQpLFxuICAgICAgICAgICAgaXNNb3VzZVdoZWVsU3VwcG9ydGVkOmJvb2xlYW4gPSAnb253aGVlbCcgaW4gd2luZG93IHx8ICdvbm1vdXNld2hlZWwnIGluIHdpbmRvdyB8fCAnTW91c2VTY3JvbGxFdmVudCcgaW4gd2luZG93LFxuICAgICAgICAgICAgaXNBY2NlbGVyb21ldGVyU3VwcG9ydGVkOmJvb2xlYW4gPSAnRGV2aWNlTW90aW9uRXZlbnQnIGluIHdpbmRvdyxcbiAgICAgICAgICAgIGlzR2FtZXBhZFN1cHBvcnRlZDpib29sZWFuID0gISFuYXZpZ2F0b3IuZ2V0R2FtZXBhZHMgfHwgISFuYXZpZ2F0b3Iud2Via2l0R2V0R2FtZXBhZHM7XG5cbiAgICAgICAgLy9GdWxsU2NyZWVuXG4gICAgICAgIHZhciBkaXY6SFRNTERpdkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdmFyIGZ1bGxTY3JlZW5SZXF1ZXN0VmVuZG9yOmFueSA9IGRpdi5yZXF1ZXN0RnVsbHNjcmVlbiB8fCBkaXYud2Via2l0UmVxdWVzdEZ1bGxTY3JlZW4gfHwgZGl2Lm1zUmVxdWVzdEZ1bGxTY3JlZW4gfHwgZGl2Lm1velJlcXVlc3RGdWxsU2NyZWVuLFxuICAgICAgICAgICAgZnVsbFNjcmVlbkNhbmNlbFZlbmRvcjphbnkgPSBkb2N1bWVudC5jYW5jZWxGdWxsU2NyZWVuIHx8IGRvY3VtZW50LmV4aXRGdWxsU2NyZWVuIHx8IGRvY3VtZW50LndlYmtpdENhbmNlbEZ1bGxTY3JlZW4gfHwgZG9jdW1lbnQubXNDYW5jZWxGdWxsU2NyZWVuIHx8IGRvY3VtZW50Lm1vekNhbmNlbEZ1bGxTY3JlZW47XG5cbiAgICAgICAgZXhwb3J0IHZhciBpc0Z1bGxTY3JlZW5TdXBwb3J0ZWQ6Ym9vbGVhbiA9ICEhKGZ1bGxTY3JlZW5SZXF1ZXN0ICYmIGZ1bGxTY3JlZW5DYW5jZWwpLFxuICAgICAgICAgICAgZnVsbFNjcmVlblJlcXVlc3Q6c3RyaW5nID0gKGZ1bGxTY3JlZW5SZXF1ZXN0VmVuZG9yKSA/IGZ1bGxTY3JlZW5SZXF1ZXN0VmVuZG9yLm5hbWUgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBmdWxsU2NyZWVuQ2FuY2VsOnN0cmluZyA9IChmdWxsU2NyZWVuQ2FuY2VsVmVuZG9yKSA/IGZ1bGxTY3JlZW5DYW5jZWxWZW5kb3IubmFtZSA6IHVuZGVmaW5lZDtcblxuICAgICAgICAvL0F1ZGlvXG4gICAgICAgIGV4cG9ydCB2YXIgaXNIVE1MQXVkaW9TdXBwb3J0ZWQ6Ym9vbGVhbiA9ICEhd2luZG93LkF1ZGlvLFxuICAgICAgICAgICAgd2ViQXVkaW9Db250ZXh0OmFueSA9IHdpbmRvdy5BdWRpb0NvbnRleHQgfHwgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dCxcbiAgICAgICAgICAgIGlzV2ViQXVkaW9TdXBwb3J0ZWQ6Ym9vbGVhbiA9ICEhd2ViQXVkaW9Db250ZXh0LFxuICAgICAgICAgICAgaXNBdWRpb1N1cHBvcnRlZDpib29sZWFuID0gaXNXZWJBdWRpb1N1cHBvcnRlZCB8fCBpc0hUTUxBdWRpb1N1cHBvcnRlZCxcbiAgICAgICAgICAgIGlzTXAzU3VwcG9ydGVkOmJvb2xlYW4gPSBmYWxzZSxcbiAgICAgICAgICAgIGlzT2dnU3VwcG9ydGVkOmJvb2xlYW4gPSBmYWxzZSxcbiAgICAgICAgICAgIGlzV2F2U3VwcG9ydGVkOmJvb2xlYW4gPSBmYWxzZSxcbiAgICAgICAgICAgIGlzTTRhU3VwcG9ydGVkOmJvb2xlYW4gPSBmYWxzZSxcbiAgICAgICAgICAgIGdsb2JhbFdlYkF1ZGlvQ29udGV4dDpBdWRpb0NvbnRleHQgPSAoaXNXZWJBdWRpb1N1cHBvcnRlZCkgPyBuZXcgd2ViQXVkaW9Db250ZXh0KCkgOiB1bmRlZmluZWQ7XG5cbiAgICAgICAgLy9BdWRpbyBtaW1lVHlwZXNcbiAgICAgICAgaWYoaXNBdWRpb1N1cHBvcnRlZCl7XG4gICAgICAgICAgICB2YXIgYXVkaW86SFRNTEF1ZGlvRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2F1ZGlvJyk7XG4gICAgICAgICAgICBpc01wM1N1cHBvcnRlZCA9IGF1ZGlvLmNhblBsYXlUeXBlKCdhdWRpby9tcGVnOycpICE9PSBcIlwiO1xuICAgICAgICAgICAgaXNPZ2dTdXBwb3J0ZWQgPSBhdWRpby5jYW5QbGF5VHlwZSgnYXVkaW8vb2dnOyBjb2RlY3M9XCJ2b3JiaXNcIicpICE9PSBcIlwiO1xuICAgICAgICAgICAgaXNXYXZTdXBwb3J0ZWQgPSBhdWRpby5jYW5QbGF5VHlwZSgnYXVkaW8vd2F2JykgIT09IFwiXCI7XG4gICAgICAgICAgICBpc000YVN1cHBvcnRlZCA9IGF1ZGlvLmNhblBsYXlUeXBlKCdhdWRpby9tcDQ7IGNvZGVjcz1cIm1wNGEuNDAuNVwiJykgIT09IFwiXCI7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gZ2V0TW91c2VXaGVlbEV2ZW50KCk6c3RyaW5ne1xuICAgICAgICAgICAgaWYoIWlzTW91c2VXaGVlbFN1cHBvcnRlZClyZXR1cm47XG4gICAgICAgICAgICB2YXIgZXZ0OnN0cmluZztcbiAgICAgICAgICAgIGlmKCdvbndoZWVsJyBpbiB3aW5kb3cpe1xuICAgICAgICAgICAgICAgIGV2dCA9ICd3aGVlbCc7XG4gICAgICAgICAgICB9ZWxzZSBpZignb25tb3VzZXdoZWVsJyBpbiB3aW5kb3cpe1xuICAgICAgICAgICAgICAgIGV2dCA9ICdtb3VzZXdoZWVsJztcbiAgICAgICAgICAgIH1lbHNlIGlmKCdNb3VzZVNjcm9sbEV2ZW50JyBpbiB3aW5kb3cpe1xuICAgICAgICAgICAgICAgIGV2dCA9ICdET01Nb3VzZVNjcm9sbCc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBldnQ7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gdmlicmF0ZShwYXR0ZXJuOiBudW1iZXIgfCBudW1iZXJbXSk6dm9pZHtcbiAgICAgICAgICAgIGlmKGlzVmlicmF0ZVN1cHBvcnRlZCl7XG4gICAgICAgICAgICAgICAgbmF2aWdhdG9yLnZpYnJhdGUocGF0dGVybik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gZ2V0VmlzaWJpbGl0eUNoYW5nZUV2ZW50KCk6c3RyaW5ne1xuICAgICAgICAgICAgaWYodHlwZW9mIGRvY3VtZW50LmhpZGRlbiAhPT0gJ3VuZGVmaW5lZCcpe1xuICAgICAgICAgICAgICAgIHJldHVybiAndmlzaWJpbGl0eWNoYW5nZSc7XG4gICAgICAgICAgICB9ZWxzZSBpZih0eXBlb2YgZG9jdW1lbnQud2Via2l0SGlkZGVuICE9PSAndW5kZWZpbmVkJyl7XG4gICAgICAgICAgICAgICAgcmV0dXJuICd3ZWJraXR2aXNpYmlsaXR5Y2hhbmdlJztcbiAgICAgICAgICAgIH1lbHNlIGlmKHR5cGVvZiBkb2N1bWVudC5tb3pIaWRkZW4gIT09ICd1bmRlZmluZWQnKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ21venZpc2liaWxpdHljaGFuZ2UnO1xuICAgICAgICAgICAgfWVsc2UgaWYodHlwZW9mIGRvY3VtZW50Lm1zSGlkZGVuICE9PSAndW5kZWZpbmVkJyl7XG4gICAgICAgICAgICAgICAgcmV0dXJuICdtc3Zpc2liaWxpdHljaGFuZ2UnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIGlzT25saW5lKCk6Ym9vbGVhbntcbiAgICAgICAgICAgIHJldHVybiB3aW5kb3cubmF2aWdhdG9yLm9uTGluZTtcbiAgICAgICAgfVxuXG5cbiAgICB9XG59XG5cbmRlY2xhcmUgdmFyIHByb2Nlc3M6YW55LFxuICAgIERvY3VtZW50VG91Y2g6YW55LFxuICAgIGdsb2JhbDphbnk7XG5cbmludGVyZmFjZSBOYXZpZ2F0b3Ige1xuICAgIGlzQ29jb29uSlM6YW55O1xuICAgIHZpYnJhdGUocGF0dGVybjogbnVtYmVyIHwgbnVtYmVyW10pOmJvb2xlYW47XG4gICAgZ2V0R2FtZXBhZHMoKTphbnk7XG4gICAgd2Via2l0R2V0R2FtZXBhZHMoKTphbnk7XG59XG5cbmludGVyZmFjZSBXaW5kb3cge1xuICAgIGVqZWN0YTphbnk7XG4gICAgY29yZG92YTphbnk7XG4gICAgQXVkaW8oKTpIVE1MQXVkaW9FbGVtZW50O1xuICAgIEF1ZGlvQ29udGV4dCgpOmFueTtcbiAgICB3ZWJraXRBdWRpb0NvbnRleHQoKTphbnk7XG59XG5cbmludGVyZmFjZSBmdWxsU2NyZWVuRGF0YSB7XG4gICAgbmFtZTpzdHJpbmc7XG59XG5cbmludGVyZmFjZSBEb2N1bWVudCB7XG4gICAgY2FuY2VsRnVsbFNjcmVlbigpOmZ1bGxTY3JlZW5EYXRhIDtcbiAgICBleGl0RnVsbFNjcmVlbigpOmZ1bGxTY3JlZW5EYXRhIDtcbiAgICB3ZWJraXRDYW5jZWxGdWxsU2NyZWVuKCk6ZnVsbFNjcmVlbkRhdGEgO1xuICAgIG1zQ2FuY2VsRnVsbFNjcmVlbigpOmZ1bGxTY3JlZW5EYXRhIDtcbiAgICBtb3pDYW5jZWxGdWxsU2NyZWVuKCk6ZnVsbFNjcmVlbkRhdGEgO1xuICAgIHdlYmtpdEhpZGRlbjphbnk7XG4gICAgbW96SGlkZGVuOmFueTtcbn1cblxuaW50ZXJmYWNlIEhUTUxEaXZFbGVtZW50IHtcbiAgICByZXF1ZXN0RnVsbHNjcmVlbigpOmZ1bGxTY3JlZW5EYXRhIDtcbiAgICB3ZWJraXRSZXF1ZXN0RnVsbFNjcmVlbigpOmZ1bGxTY3JlZW5EYXRhIDtcbiAgICBtc1JlcXVlc3RGdWxsU2NyZWVuKCk6ZnVsbFNjcmVlbkRhdGEgO1xuICAgIG1velJlcXVlc3RGdWxsU2NyZWVuKCk6ZnVsbFNjcmVlbkRhdGEgO1xufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2RlZnMvcGl4aS5qcy5kLnRzXCIgLz5cbm1vZHVsZSBQSVhJIHtcbiAgICBleHBvcnQgY2xhc3MgU2NlbmUgZXh0ZW5kcyBDb250YWluZXIge1xuICAgICAgICBpZDpzdHJpbmc7XG4gICAgICAgIHN0YXRpYyBfaWRMZW46bnVtYmVyID0gMDtcblxuICAgICAgICBjb25zdHJ1Y3RvcihpZDpzdHJpbmcgPSAoXCJzY2VuZVwiICsgU2NlbmUuX2lkTGVuKyspICl7XG4gICAgICAgICAgICBzdXBlcigpO1xuICAgICAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICB9XG5cbiAgICAgICAgYWRkVG8oZ2FtZTpHYW1lfENvbnRhaW5lcik6U2NlbmUge1xuICAgICAgICAgICAgaWYoZ2FtZSBpbnN0YW5jZW9mIEdhbWUpe1xuICAgICAgICAgICAgICAgIDxHYW1lPmdhbWUuYWRkU2NlbmUodGhpcyk7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NjZW5lcyBjYW4gb25seSBiZSBhZGRlZCB0byB0aGUgZ2FtZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICB9XG59IiwibW9kdWxlIFBJWEkge1xuICAgIGV4cG9ydCBjbGFzcyBJbnB1dE1hbmFnZXJ7XG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZ2FtZTogR2FtZSl7XG5cbiAgICAgICAgfVxuICAgIH1cbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9kZWZzL3BpeGkuanMuZC50c1wiIC8+XG5tb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IGZ1bmN0aW9uIGJpdG1hcEZvbnRQYXJzZXJUWFQoKTpGdW5jdGlvbntcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHJlc291cmNlOiBsb2FkZXJzLlJlc291cmNlLCBuZXh0OkZ1bmN0aW9uKTp2b2lke1xuXG4gICAgICAgICAgICAvL3NraXAgaWYgbm8gZGF0YSBvciBpZiBub3QgdHh0XG4gICAgICAgICAgICBpZighcmVzb3VyY2UuZGF0YSB8fCAocmVzb3VyY2UueGhyVHlwZSAhPT0gXCJ0ZXh0XCIgJiYgcmVzb3VyY2UueGhyVHlwZSAhPT0gXCJkb2N1bWVudFwiKSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5leHQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHRleHQ6c3RyaW5nID0gKHJlc291cmNlLnhoclR5cGUgPT09IFwidGV4dFwiKSA/IHJlc291cmNlLmRhdGEgOiByZXNvdXJjZS54aHIucmVzcG9uc2VUZXh0O1xuXG4gICAgICAgICAgICAvL3NraXAgaWYgbm90IGEgYml0bWFwIGZvbnQgZGF0YVxuICAgICAgICAgICAgaWYoIHRleHQuaW5kZXhPZihcInBhZ2VcIikgPT09IC0xIHx8XG4gICAgICAgICAgICAgICAgdGV4dC5pbmRleE9mKFwiZmFjZVwiKSA9PT0gLTEgfHxcbiAgICAgICAgICAgICAgICB0ZXh0LmluZGV4T2YoXCJpbmZvXCIpID09PSAtMSB8fFxuICAgICAgICAgICAgICAgIHRleHQuaW5kZXhPZihcImNoYXJcIikgPT09IC0xICl7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gbmV4dCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgdXJsOnN0cmluZyA9IGRpcm5hbWUocmVzb3VyY2UudXJsKTtcbiAgICAgICAgICAgIGlmKHVybCA9PT0gXCIuXCIpe1xuICAgICAgICAgICAgICAgIHVybCA9IFwiXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKHRoaXMuYmFzZVVybCAmJiB1cmwpe1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuYmFzZVVybC5jaGFyQXQodGhpcy5iYXNlVXJsLmxlbmd0aC0xKT09PSAnLycpe1xuICAgICAgICAgICAgICAgICAgICB1cmwgKz0gJy8nO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHVybC5yZXBsYWNlKHRoaXMuYmFzZVVybCwgJycpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZih1cmwgJiYgdXJsLmNoYXJBdCh1cmwubGVuZ3RoIC0gMSkgIT09ICcvJyl7XG4gICAgICAgICAgICAgICAgdXJsICs9ICcvJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHRleHR1cmVVcmw6c3RyaW5nID0gZ2V0VGV4dHVyZVVybCh1cmwsIHRleHQpO1xuICAgICAgICAgICAgaWYodXRpbHMuVGV4dHVyZUNhY2hlW3RleHR1cmVVcmxdKXtcbiAgICAgICAgICAgICAgICBwYXJzZShyZXNvdXJjZSwgdXRpbHMuVGV4dHVyZUNhY2hlW3RleHR1cmVVcmxdKTtcbiAgICAgICAgICAgICAgICBuZXh0KCk7XG4gICAgICAgICAgICB9ZWxzZXtcblxuICAgICAgICAgICAgICAgIHZhciBsb2FkT3B0aW9uczphbnkgPSB7XG4gICAgICAgICAgICAgICAgICAgIGNyb3NzT3JpZ2luOiByZXNvdXJjZS5jcm9zc09yaWdpbixcbiAgICAgICAgICAgICAgICAgICAgbG9hZFR5cGU6IGxvYWRlcnMuUmVzb3VyY2UuTE9BRF9UWVBFLklNQUdFXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHRoaXMuYWRkKHJlc291cmNlLm5hbWUgKyAnX2ltYWdlJywgdGV4dHVyZVVybCwgbG9hZE9wdGlvbnMsIGZ1bmN0aW9uKHJlczphbnkpe1xuICAgICAgICAgICAgICAgICAgICBwYXJzZShyZXNvdXJjZSwgcmVzLnRleHR1cmUpO1xuICAgICAgICAgICAgICAgICAgICBuZXh0KCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICBuZXh0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZShyZXNvdXJjZTpsb2FkZXJzLlJlc291cmNlLCB0ZXh0dXJlOlRleHR1cmUpe1xuICAgICAgICB2YXIgY3VycmVudExpbmU6c3RyaW5nLCBhdHRyOmF0dHJEYXRhLFxuICAgICAgICAgICAgZGF0YTpmb250RGF0YSA9IHtcbiAgICAgICAgICAgICAgICBjaGFycyA6IHt9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIHZhciB0ZXh0OnN0cmluZyA9IChyZXNvdXJjZS54aHJUeXBlID09PSBcInRleHRcIikgPyByZXNvdXJjZS5kYXRhIDogcmVzb3VyY2UueGhyLnJlc3BvbnNlVGV4dDtcbiAgICAgICAgdmFyIGxpbmVzOnN0cmluZ1tdID0gdGV4dC5zcGxpdCgnXFxuJyk7XG5cbiAgICAgICAgZm9yKHZhciBpOm51bWJlciA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICBpZihsaW5lc1tpXS5pbmRleE9mKFwiaW5mb1wiKSA9PT0gMCl7XG4gICAgICAgICAgICAgICAgY3VycmVudExpbmUgPSBsaW5lc1tpXS5zdWJzdHJpbmcoNSk7XG4gICAgICAgICAgICAgICAgYXR0ciA9IGdldEF0dHIoY3VycmVudExpbmUpO1xuXG4gICAgICAgICAgICAgICAgZGF0YS5mb250ID0gYXR0ci5mYWNlO1xuICAgICAgICAgICAgICAgIGRhdGEuc2l6ZSA9IHBhcnNlSW50KGF0dHIuc2l6ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKGxpbmVzW2ldLmluZGV4T2YoJ2NvbW1vbiAnKSA9PT0gMCl7XG4gICAgICAgICAgICAgICAgY3VycmVudExpbmUgPSBsaW5lc1tpXS5zdWJzdHJpbmcoNyk7XG4gICAgICAgICAgICAgICAgYXR0ciA9IGdldEF0dHIoY3VycmVudExpbmUpO1xuICAgICAgICAgICAgICAgIGRhdGEubGluZUhlaWdodCA9IHBhcnNlSW50KGF0dHIubGluZUhlaWdodCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKGxpbmVzW2ldLmluZGV4T2YoXCJjaGFyIFwiKSA9PT0gMCl7XG4gICAgICAgICAgICAgICAgY3VycmVudExpbmUgPSBsaW5lc1tpXS5zdWJzdHJpbmcoNSk7XG4gICAgICAgICAgICAgICAgYXR0ciA9IGdldEF0dHIoY3VycmVudExpbmUpO1xuICAgICAgICAgICAgICAgIHZhciBjaGFyQ29kZTpudW1iZXIgPSBwYXJzZUludChhdHRyLmlkKTtcblxuICAgICAgICAgICAgICAgIHZhciB0ZXh0dXJlUmVjdDpSZWN0YW5nbGUgPSBuZXcgUmVjdGFuZ2xlKFxuICAgICAgICAgICAgICAgICAgICBwYXJzZUludChhdHRyLngpLFxuICAgICAgICAgICAgICAgICAgICBwYXJzZUludChhdHRyLnkpLFxuICAgICAgICAgICAgICAgICAgICBwYXJzZUludChhdHRyLndpZHRoKSxcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VJbnQoYXR0ci5oZWlnaHQpXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIGRhdGEuY2hhcnNbY2hhckNvZGVdID0ge1xuICAgICAgICAgICAgICAgICAgICB4T2Zmc2V0OiBwYXJzZUludChhdHRyLnhvZmZzZXQpLFxuICAgICAgICAgICAgICAgICAgICB5T2Zmc2V0OiBwYXJzZUludChhdHRyLnlvZmZzZXQpLFxuICAgICAgICAgICAgICAgICAgICB4QWR2YW5jZTogcGFyc2VJbnQoYXR0ci54YWR2YW5jZSksXG4gICAgICAgICAgICAgICAgICAgIGtlcm5pbmc6IHt9LFxuICAgICAgICAgICAgICAgICAgICB0ZXh0dXJlOiBuZXcgVGV4dHVyZSh0ZXh0dXJlLmJhc2VUZXh0dXJlLCB0ZXh0dXJlUmVjdClcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihsaW5lc1tpXS5pbmRleE9mKCdrZXJuaW5nICcpID09PSAwKXtcbiAgICAgICAgICAgICAgICBjdXJyZW50TGluZSA9IGxpbmVzW2ldLnN1YnN0cmluZyg4KTtcbiAgICAgICAgICAgICAgICBhdHRyID0gZ2V0QXR0cihjdXJyZW50TGluZSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgZmlyc3QgPSBwYXJzZUludChhdHRyLmZpcnN0KTtcbiAgICAgICAgICAgICAgICB2YXIgc2Vjb25kID0gcGFyc2VJbnQoYXR0ci5zZWNvbmQpO1xuXG4gICAgICAgICAgICAgICAgZGF0YS5jaGFyc1tzZWNvbmRdLmtlcm5pbmdbZmlyc3RdID0gcGFyc2VJbnQoYXR0ci5hbW91bnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmVzb3VyY2UuYml0bWFwRm9udCA9IGRhdGE7XG4gICAgICAgIGV4dHJhcy5CaXRtYXBUZXh0LmZvbnRzW2RhdGEuZm9udF0gPSBkYXRhO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRpcm5hbWUocGF0aDpzdHJpbmcpOnN0cmluZ3tcbiAgICAgICAgcmV0dXJuIHBhdGgucmVwbGFjZSgvXFxcXC9nLCcvJykucmVwbGFjZSgvXFwvW15cXC9dKiQvLCAnJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0VGV4dHVyZVVybCh1cmw6c3RyaW5nLCBkYXRhOnN0cmluZyk6c3RyaW5ne1xuICAgICAgICB2YXIgdGV4dHVyZVVybDpzdHJpbmc7XG4gICAgICAgIHZhciBsaW5lczpzdHJpbmdbXSA9IGRhdGEuc3BsaXQoJ1xcbicpO1xuXG4gICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgaWYobGluZXNbaV0uaW5kZXhPZihcInBhZ2VcIikgPT09IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudExpbmU6c3RyaW5nID0gbGluZXNbaV0uc3Vic3RyaW5nKDUpO1xuICAgICAgICAgICAgICAgIHZhciBmaWxlOnN0cmluZyA9IChjdXJyZW50TGluZS5zdWJzdHJpbmcoY3VycmVudExpbmUuaW5kZXhPZignZmlsZT0nKSkpLnNwbGl0KCc9JylbMV07XG4gICAgICAgICAgICAgICAgdGV4dHVyZVVybCA9IHVybCArIGZpbGUuc3Vic3RyKDEsIGZpbGUubGVuZ3RoLTIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRleHR1cmVVcmw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0QXR0cihsaW5lOnN0cmluZyk6YXR0ckRhdGF7XG4gICAgICAgIHZhciByZWdleDpSZWdFeHAgPSAvXCIoXFx3KlxcZCpcXHMqKC18XykqKSpcIi9nLFxuICAgICAgICAgICAgYXR0cjpzdHJpbmdbXSA9IGxpbmUuc3BsaXQoL1xccysvZyksXG4gICAgICAgICAgICBkYXRhOmFueSA9IHt9O1xuXG4gICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgYXR0ci5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICB2YXIgZDpzdHJpbmdbXSA9IGF0dHJbaV0uc3BsaXQoJz0nKTtcbiAgICAgICAgICAgIHZhciBtOlJlZ0V4cE1hdGNoQXJyYXkgPSBkWzFdLm1hdGNoKHJlZ2V4KTtcbiAgICAgICAgICAgIGlmKG0gJiYgbS5sZW5ndGggPj0gMSl7XG4gICAgICAgICAgICAgICAgZFsxXSA9IGRbMV0uc3Vic3RyKDEsIGRbMV0ubGVuZ3RoLTIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGF0YVtkWzBdXSA9IGRbMV07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gPGF0dHJEYXRhPmRhdGE7XG4gICAgfVxuXG4gICAgaW50ZXJmYWNlIGZvbnREYXRhIHtcbiAgICAgICAgY2hhcnM/IDogYW55O1xuICAgICAgICBmb250PyA6IHN0cmluZztcbiAgICAgICAgc2l6ZT8gOiBudW1iZXI7XG4gICAgICAgIGxpbmVIZWlnaHQ/IDogbnVtYmVyO1xuICAgIH1cblxuICAgIGludGVyZmFjZSBhdHRyRGF0YSB7XG4gICAgICAgIGZhY2U/IDogc3RyaW5nO1xuICAgICAgICBzaXplPyA6IHN0cmluZztcbiAgICAgICAgbGluZUhlaWdodD8gOiBzdHJpbmc7XG4gICAgICAgIGlkPyA6IHN0cmluZztcbiAgICAgICAgeD8gOiBzdHJpbmc7XG4gICAgICAgIHk/IDogc3RyaW5nO1xuICAgICAgICB3aWR0aD8gOiBzdHJpbmc7XG4gICAgICAgIGhlaWdodD8gOiBzdHJpbmc7XG4gICAgICAgIHhvZmZzZXQ/IDogc3RyaW5nO1xuICAgICAgICB5b2Zmc2V0PyA6IHN0cmluZztcbiAgICAgICAgeGFkdmFuY2U/IDogc3RyaW5nO1xuICAgICAgICBmaXJzdD8gOiBzdHJpbmc7XG4gICAgICAgIHNlY29uZD8gOiBzdHJpbmc7XG4gICAgICAgIGFtb3VudD8gOiBzdHJpbmc7XG4gICAgfVxufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL2F1ZGlvL0F1ZGlvTWFuYWdlci50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9BdWRpby9BdWRpby50c1wiIC8+XG5tb2R1bGUgUElYSSB7XG4gICAgdmFyIF9hbGxvd2VkRXh0OnN0cmluZ1tdID0gW1wibTRhXCIsIFwib2dnXCIsIFwibXAzXCIsIFwid2F2XCJdO1xuXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGF1ZGlvUGFyc2VyKCk6RnVuY3Rpb24ge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24ocmVzb3VyY2U6bG9hZGVycy5SZXNvdXJjZSwgbmV4dDpGdW5jdGlvbik6dm9pZHtcbiAgICAgICAgICAgIGlmKCFEZXZpY2UuaXNBdWRpb1N1cHBvcnRlZCB8fCAhcmVzb3VyY2UuZGF0YSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5leHQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGV4dDpzdHJpbmcgPSBfZ2V0RXh0KHJlc291cmNlLnVybCk7XG5cbiAgICAgICAgICAgIGlmKF9hbGxvd2VkRXh0LmluZGV4T2YoZXh0KSA9PT0gLTEpe1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXh0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKCFfY2FuUGxheShleHQpKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV4dCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgbmFtZTpzdHJpbmcgPSByZXNvdXJjZS5uYW1lIHx8IHJlc291cmNlLnVybDtcbiAgICAgICAgICAgIGlmKHV0aWxzLl9hdWRpb1R5cGVTZWxlY3RlZCA9PT0gQVVESU9fVFlQRS5XRUJBVURJTyl7XG4gICAgICAgICAgICAgICAgRGV2aWNlLmdsb2JhbFdlYkF1ZGlvQ29udGV4dC5kZWNvZGVBdWRpb0RhdGEocmVzb3VyY2UuZGF0YSwgX2FkZFRvQ2FjaGUuYmluZCh0aGlzLCBuZXh0LCBuYW1lKSk7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICByZXR1cm4gX2FkZFRvQ2FjaGUobmV4dCwgbmFtZSwgcmVzb3VyY2UuZGF0YSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGV4cG9ydCBmdW5jdGlvbiBhdWRpb1BhcnNlclVybChyZXNvdXJjZVVybDpzdHJpbmdbXSk6c3RyaW5ne1xuICAgICAgICB2YXIgZXh0OnN0cmluZztcbiAgICAgICAgdmFyIHVybDpzdHJpbmc7XG4gICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgcmVzb3VyY2VVcmwubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgZXh0ID0gX2dldEV4dChyZXNvdXJjZVVybFtpXSk7XG5cbiAgICAgICAgICAgIGlmKF9hbGxvd2VkRXh0LmluZGV4T2YoZXh0KSA9PT0gLTEpe1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihfY2FuUGxheShleHQpKXtcbiAgICAgICAgICAgICAgICB1cmwgPSByZXNvdXJjZVVybFtpXTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB1cmw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2FkZFRvQ2FjaGUobmV4dDpGdW5jdGlvbiwgbmFtZTpzdHJpbmcsIGRhdGE6YW55KXtcbiAgICAgICAgdXRpbHMuQXVkaW9DYWNoZVtuYW1lXSA9IG5ldyBBdWRpbyhkYXRhLCBuYW1lKTtcbiAgICAgICAgcmV0dXJuIG5leHQoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfZ2V0RXh0KHVybDpzdHJpbmcpOnN0cmluZ3tcbiAgICAgICAgcmV0dXJuIHVybC5zcGxpdCgnPycpLnNoaWZ0KCkuc3BsaXQoJy4nKS5wb3AoKS50b0xvd2VyQ2FzZSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9jYW5QbGF5KGV4dDpzdHJpbmcpOmJvb2xlYW57XG4gICAgICAgIHZhciBkZXZpY2VDYW5QbGF5OmJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgc3dpdGNoKGV4dCl7XG4gICAgICAgICAgICBjYXNlIFwibTRhXCI6ZGV2aWNlQ2FuUGxheSA9IERldmljZS5pc000YVN1cHBvcnRlZDsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwibXAzXCI6ZGV2aWNlQ2FuUGxheSA9IERldmljZS5pc01wM1N1cHBvcnRlZDsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwib2dnXCI6ZGV2aWNlQ2FuUGxheSA9IERldmljZS5pc09nZ1N1cHBvcnRlZDsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwid2F2XCI6ZGV2aWNlQ2FuUGxheSA9IERldmljZS5pc1dhdlN1cHBvcnRlZDsgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRldmljZUNhblBsYXk7XG4gICAgfVxufVxuIiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vZGVmcy9waXhpLmpzLmQudHNcIiAvPlxubW9kdWxlIFBJWEkge1xuICAgIGV4cG9ydCBtb2R1bGUgdXRpbHMge1xuICAgICAgICBleHBvcnQgdmFyIF9hdWRpb1R5cGVTZWxlY3RlZDpudW1iZXIgPSBBVURJT19UWVBFLldFQkFVRElPO1xuICAgICAgICBleHBvcnQgdmFyIEF1ZGlvQ2FjaGU6YW55ID0ge307XG4gICAgfVxufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2RlZnMvcGl4aS5qcy5kLnRzXCIgLz5cbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL2NvcmUvY29uc3QudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi9iaXRtYXBGb250UGFyc2VyVHh0LnRzXCIgLz5cbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4vYXVkaW9QYXJzZXIudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vY29yZS9VdGlscy50c1wiIC8+XG5tb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IG1vZHVsZSBsb2FkZXJze1xuICAgICAgICBMb2FkZXIuYWRkUGl4aU1pZGRsZXdhcmUoYml0bWFwRm9udFBhcnNlclRYVCk7XG4gICAgICAgIExvYWRlci5hZGRQaXhpTWlkZGxld2FyZShhdWRpb1BhcnNlcik7XG5cbiAgICAgICAgY2xhc3MgVHVyYm9Mb2FkZXIgZXh0ZW5kcyBMb2FkZXIge1xuICAgICAgICAgICAgY29uc3RydWN0b3IoYmFzZVVybDogc3RyaW5nLCBhc3NldENvbmN1cnJlbmN5OiBudW1iZXIpe1xuICAgICAgICAgICAgICAgIHN1cGVyKGJhc2VVcmwsIGFzc2V0Q29uY3VycmVuY3kpO1xuICAgICAgICAgICAgICAgIGlmKERldmljZS5pc0F1ZGlvU3VwcG9ydGVkKXtcbiAgICAgICAgICAgICAgICAgICAgX2NoZWNrQXVkaW9UeXBlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhZGQobmFtZTphbnksIHVybD86YW55ICxvcHRpb25zPzphbnksIGNiPzphbnkpOkxvYWRlcntcbiAgICAgICAgICAgICAgICBpZih0eXBlb2YgbmFtZSA9PT0gJ29iamVjdCcpe1xuICAgICAgICAgICAgICAgICAgICBpZihPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobmFtZS51cmwpID09PSBcIltvYmplY3QgQXJyYXldXCIpe1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZS51cmwgPSBhdWRpb1BhcnNlclVybChuYW1lLnVybCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZihPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodXJsKSA9PT0gXCJbb2JqZWN0IEFycmF5XVwiKXtcbiAgICAgICAgICAgICAgICAgICAgdXJsID0gYXVkaW9QYXJzZXJVcmwodXJsKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gc3VwZXIuYWRkKG5hbWUsIHVybCwgb3B0aW9ucywgY2IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbG9hZGVycy5Mb2FkZXIgPSBUdXJib0xvYWRlcjtcblxuXG4gICAgICAgIGZ1bmN0aW9uIF9jaGVja0F1ZGlvVHlwZSgpOnZvaWR7XG4gICAgICAgICAgICBpZihEZXZpY2UuaXNNcDNTdXBwb3J0ZWQpX3NldEF1ZGlvRXh0KFwibXAzXCIpO1xuICAgICAgICAgICAgaWYoRGV2aWNlLmlzT2dnU3VwcG9ydGVkKV9zZXRBdWRpb0V4dChcIm9nZ1wiKTtcbiAgICAgICAgICAgIGlmKERldmljZS5pc1dhdlN1cHBvcnRlZClfc2V0QXVkaW9FeHQoXCJ3YXZcIik7XG4gICAgICAgICAgICBpZihEZXZpY2UuaXNNNGFTdXBwb3J0ZWQpX3NldEF1ZGlvRXh0KFwibTRhXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gX3NldEF1ZGlvRXh0KGV4dDpzdHJpbmcpOnZvaWQge1xuICAgICAgICAgICAgaWYodXRpbHMuX2F1ZGlvVHlwZVNlbGVjdGVkID09PSBBVURJT19UWVBFLldFQkFVRElPKXtcbiAgICAgICAgICAgICAgICBSZXNvdXJjZS5zZXRFeHRlbnNpb25YaHJUeXBlKGV4dCwgUmVzb3VyY2UuWEhSX1JFU1BPTlNFX1RZUEUuQlVGRkVSKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIFJlc291cmNlLnNldEV4dGVuc2lvbkxvYWRUeXBlKGV4dCwgUmVzb3VyY2UuTE9BRF9UWVBFLkFVRElPKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0iLCJtb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IGNsYXNzIERhdGFNYW5hZ2Vye1xuICAgICAgICBwcml2YXRlIF9kYXRhOmFueTtcblxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGdhbWU6R2FtZSwgcHVibGljIHVzZVBlcnNpc3RhbnREYXRhOmJvb2xlYW4gPSBmYWxzZSl7XG4gICAgICAgICAgICB0aGlzLmxvYWQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxvYWQoKTpEYXRhTWFuYWdlcntcbiAgICAgICAgICAgIHRoaXMuX2RhdGEgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMuZ2FtZS5pZCkpIHx8IHt9O1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBzYXZlKCk6RGF0YU1hbmFnZXJ7XG4gICAgICAgICAgICBpZih0aGlzLnVzZVBlcnNpc3RhbnREYXRhKXtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLmdhbWUuaWQsIEpTT04uc3RyaW5naWZ5KHRoaXMuX2RhdGEpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzZXQoKTpEYXRhTWFuYWdlcntcbiAgICAgICAgICAgIHRoaXMuX2RhdGEgPSB7fTtcbiAgICAgICAgICAgIHRoaXMuc2F2ZSgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBzZXQoa2V5OnN0cmluZyB8IE9iamVjdCwgdmFsdWU/OmFueSk6RGF0YU1hbmFnZXJ7XG4gICAgICAgICAgICBpZihPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoa2V5KSA9PT0gXCJbb2JqZWN0IE9iamVjdF1cIil7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLl9kYXRhLCBrZXkpO1xuICAgICAgICAgICAgfWVsc2UgaWYodHlwZW9mIGtleSA9PT0gXCJzdHJpbmdcIil7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGF0YVtrZXldID0gdmFsdWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuc2F2ZSgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQoa2V5PzpzdHJpbmcpOmFueXtcbiAgICAgICAgICAgIGlmKCFrZXkpe1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9kYXRhO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZGF0YVtrZXldO1xuICAgICAgICB9XG5cbiAgICAgICAgZGVsKGtleTpzdHJpbmcpOkRhdGFNYW5hZ2Vye1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2RhdGFba2V5XTtcbiAgICAgICAgICAgIHRoaXMuc2F2ZSgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgIH1cbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9kZWZzL3BpeGkuanMuZC50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuL2NvbnN0LnRzXCIgLz5cbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4vRGV2aWNlLnRzXCIgLz5cbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL2Rpc3BsYXkvU2NlbmUudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vYXVkaW8vQXVkaW9NYW5hZ2VyLnRzXCIgLz5cbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL2lucHV0L0lucHV0TWFuYWdlci50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9sb2FkZXIvTG9hZGVyLnRzXCIgLz5cbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4vRGF0YU1hbmFnZXIudHNcIiAvPlxubW9kdWxlIFBJWEkge1xuICAgIHZhciBsYXN0Om51bWJlciA9IDA7XG4gICAgdmFyIG1heEZyYW1lTVMgPSAwLjM1O1xuXG4gICAgdmFyIGRlZmF1bHRHYW1lQ29uZmlnIDogR2FtZUNvbmZpZyA9IHtcbiAgICAgICAgaWQ6IFwicGl4aS5kZWZhdWx0LmlkXCIsXG4gICAgICAgIHdpZHRoOjgwMCxcbiAgICAgICAgaGVpZ2h0OjYwMCxcbiAgICAgICAgdXNlV2ViQXVkaW86IHRydWUsXG4gICAgICAgIHVzZVBlcnNpc3RhbnREYXRhOiBmYWxzZSxcbiAgICAgICAgZ2FtZVNjYWxlVHlwZTogR0FNRV9TQ0FMRV9UWVBFLk5PTkUsXG4gICAgICAgIHN0b3BBdExvc3RGb2N1czogdHJ1ZSxcbiAgICAgICAgYXNzZXRzVXJsOiBcIi4vXCIsXG4gICAgICAgIGxvYWRlckNvbmN1cnJlbmN5OiAxMCxcbiAgICAgICAgc291bmRNYXhMaW5lczogMTAsXG4gICAgICAgIG11c2ljTWF4TGluZXM6IDFcbiAgICB9O1xuXG4gICAgZXhwb3J0IGNsYXNzIEdhbWUge1xuICAgICAgICBpZDpzdHJpbmc7XG4gICAgICAgIHJhZjphbnk7XG5cbiAgICAgICAgcHJpdmF0ZSBfc2NlbmVzOlNjZW5lW10gPSBbXTtcbiAgICAgICAgc2NlbmU6U2NlbmU7XG5cbiAgICAgICAgYXVkaW86QXVkaW9NYW5hZ2VyO1xuICAgICAgICBpbnB1dDpJbnB1dE1hbmFnZXI7XG4gICAgICAgIGRhdGE6RGF0YU1hbmFnZXI7XG4gICAgICAgIGxvYWRlcjpsb2FkZXJzLkxvYWRlcjtcblxuICAgICAgICByZW5kZXJlcjpXZWJHTFJlbmRlcmVyIHwgQ2FudmFzUmVuZGVyZXI7XG4gICAgICAgIGNhbnZhczpIVE1MQ2FudmFzRWxlbWVudDtcblxuICAgICAgICBkZWx0YTpudW1iZXIgPSAwO1xuICAgICAgICB0aW1lOm51bWJlciA9IDA7XG4gICAgICAgIGxhc3RUaW1lOm51bWJlciA9IDA7XG5cbiAgICAgICAgaXNXZWJHTDpib29sZWFuO1xuICAgICAgICBpc1dlYkF1ZGlvOmJvb2xlYW47XG5cbiAgICAgICAgcHJpdmF0ZSBfcmVzaXplTGlzdGVuZXI6YW55O1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGNvbmZpZz86R2FtZUNvbmZpZywgcmVuZGVyZXJPcHRpb25zPzpSZW5kZXJlck9wdGlvbnMpIHtcbiAgICAgICAgICAgIGNvbmZpZyA9ICg8T2JqZWN0Pk9iamVjdCkuYXNzaWduKGRlZmF1bHRHYW1lQ29uZmlnLCBjb25maWcpO1xuICAgICAgICAgICAgdGhpcy5pZCA9IGNvbmZpZy5pZDtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZXIgPSBhdXRvRGV0ZWN0UmVuZGVyZXIoY29uZmlnLndpZHRoLCBjb25maWcuaGVpZ2h0LCByZW5kZXJlck9wdGlvbnMpO1xuICAgICAgICAgICAgdGhpcy5jYW52YXMgPSB0aGlzLnJlbmRlcmVyLnZpZXc7XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMpO1xuXG4gICAgICAgICAgICB0aGlzLmlzV2ViR0wgPSAodGhpcy5yZW5kZXJlci50eXBlID09PSBSRU5ERVJFUl9UWVBFLldFQkdMKTtcbiAgICAgICAgICAgIHRoaXMuaXNXZWJBdWRpbyA9IChEZXZpY2UuaXNBdWRpb1N1cHBvcnRlZCYmRGV2aWNlLmlzV2ViQXVkaW9TdXBwb3J0ZWQmJmNvbmZpZy51c2VXZWJBdWRpbyk7XG4gICAgICAgICAgICB1dGlscy5fYXVkaW9UeXBlU2VsZWN0ZWQgPSB0aGlzLmlzV2ViQXVkaW8gPyBBVURJT19UWVBFLldFQkFVRElPIDogQVVESU9fVFlQRS5IVE1MQVVESU87XG5cbiAgICAgICAgICAgIHRoaXMuaW5wdXQgPSBuZXcgSW5wdXRNYW5hZ2VyKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5hdWRpbyA9IG5ldyBBdWRpb01hbmFnZXIoY29uZmlnLnNvdW5kTWF4TGluZXMsIGNvbmZpZy5tdXNpY01heExpbmVzKTtcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IG5ldyBEYXRhTWFuYWdlcih0aGlzLCBjb25maWcudXNlUGVyc2lzdGFudERhdGEpO1xuICAgICAgICAgICAgdGhpcy5sb2FkZXIgPSBuZXcgbG9hZGVycy5Mb2FkZXIoY29uZmlnLmFzc2V0c1VybCwgY29uZmlnLmxvYWRlckNvbmN1cnJlbmN5KTtcblxuICAgICAgICAgICAgdmFyIGluaXRpYWxTY2VuZTpTY2VuZSA9IG5ldyBTY2VuZSgnaW5pdGlhbCcpLmFkZFRvKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5zZXRTY2VuZShpbml0aWFsU2NlbmUpO1xuXG4gICAgICAgICAgICBpZihjb25maWcuZ2FtZVNjYWxlVHlwZSAhPT0gR0FNRV9TQ0FMRV9UWVBFLk5PTkUpe1xuICAgICAgICAgICAgICAgIHRoaXMuYXV0b1Jlc2l6ZShjb25maWcuZ2FtZVNjYWxlVHlwZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKGNvbmZpZy5zdG9wQXRMb3N0Rm9jdXMpe1xuICAgICAgICAgICAgICAgIHRoaXMuZW5hYmxlU3RvcEF0TG9zdEZvY3VzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9hbmltYXRlKCk6dm9pZCB7XG4gICAgICAgICAgICB0aGlzLnJhZiA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5fYW5pbWF0ZS5iaW5kKHRoaXMpKTtcblxuICAgICAgICAgICAgaWYodGhpcy5zY2VuZSkge1xuICAgICAgICAgICAgICAgIHZhciBub3c6bnVtYmVyID0gRGF0ZS5ub3coKTtcblxuICAgICAgICAgICAgICAgIHRoaXMudGltZSArPSBNYXRoLm1pbigobm93IC0gbGFzdCkgLyAxMDAwLCBtYXhGcmFtZU1TKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRlbHRhID0gdGhpcy50aW1lIC0gdGhpcy5sYXN0VGltZTtcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RUaW1lID0gdGhpcy50aW1lO1xuXG4gICAgICAgICAgICAgICAgbGFzdCA9IG5vdztcblxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIucmVuZGVyKHRoaXMuc2NlbmUpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGUodGhpcy5kZWx0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB1cGRhdGUoZGVsdGFUaW1lOm51bWJlcik6R2FtZSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc2NlbmUuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNjZW5lLmNoaWxkcmVuW2ldLnVwZGF0ZSh0aGlzLmRlbHRhKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9jbGVhbiBraWxsZWQgb2JqZWN0c1xuICAgICAgICAgICAgdmFyIGxlbjpudW1iZXIgPSBDb250YWluZXIuX2tpbGxlZE9iamVjdHMubGVuZ3RoO1xuICAgICAgICAgICAgaWYgKGxlbikge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGk6bnVtYmVyID0gMDsgaSA8IGxlbjsgaSsrKSBDb250YWluZXIuX2tpbGxlZE9iamVjdHNbaV0ucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgQ29udGFpbmVyLl9raWxsZWRPYmplY3RzLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhcnQoKTpHYW1lIHtcbiAgICAgICAgICAgIGxhc3QgPSBEYXRlLm5vdygpO1xuICAgICAgICAgICAgdGhpcy5fYW5pbWF0ZSgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBzdG9wKCk6R2FtZSB7XG4gICAgICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5yYWYpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBlbmFibGVTdG9wQXRMb3N0Rm9jdXMoc3RhdGU6Ym9vbGVhbiA9IHRydWUpOkdhbWV7XG4gICAgICAgICAgICBpZihzdGF0ZSl7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihEZXZpY2UuZ2V0VmlzaWJpbGl0eUNoYW5nZUV2ZW50KCksIHRoaXMuX29uVmlzaWJpbGl0eUNoYW5nZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoRGV2aWNlLmdldFZpc2liaWxpdHlDaGFuZ2VFdmVudCgpLCB0aGlzLl9vblZpc2liaWxpdHlDaGFuZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBkaXNhYmxlU3RvcEF0TG9zdEZvY3VzKCk6R2FtZXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVuYWJsZVN0b3BBdExvc3RGb2N1cyhmYWxzZSk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9vblZpc2liaWxpdHlDaGFuZ2UoKXtcbiAgICAgICAgICAgIHZhciBpc0hpZGUgPSAhIShkb2N1bWVudC5oaWRkZW4gfHwgZG9jdW1lbnQud2Via2l0SGlkZGVuIHx8IGRvY3VtZW50Lm1vekhpZGRlbiB8fCBkb2N1bWVudC5tc0hpZGRlbik7XG4gICAgICAgICAgICBpZihpc0hpZGUpe1xuICAgICAgICAgICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLm9uTG9zdEZvY3VzKGlzSGlkZSk7XG4gICAgICAgIH1cblxuICAgICAgICBvbkxvc3RGb2N1cyhpc0hpZGU6Ym9vbGVhbik6R2FtZXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0U2NlbmUoc2NlbmU6U2NlbmUgfCBzdHJpbmcpOkdhbWUge1xuICAgICAgICAgICAgaWYoIShzY2VuZSBpbnN0YW5jZW9mIFNjZW5lKSl7XG4gICAgICAgICAgICAgICAgc2NlbmUgPSB0aGlzLmdldFNjZW5lKDxzdHJpbmc+c2NlbmUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnNjZW5lID0gPFNjZW5lPnNjZW5lO1xuICAgICAgICAgICAgdGhpcy5zY2VuZS5wb3NpdGlvbi5zZXQodGhpcy53aWR0aC8yLCB0aGlzLmhlaWdodC8yKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0U2NlbmUoaWQ6c3RyaW5nKTpTY2VuZXtcbiAgICAgICAgICAgIHZhciBzY2VuZTpTY2VuZSA9IG51bGw7XG4gICAgICAgICAgICBmb3IodmFyIGk6bnVtYmVyID0gMDsgaSA8IHRoaXMuX3NjZW5lcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5fc2NlbmVzW2ldLmlkID09PSBpZCl7XG4gICAgICAgICAgICAgICAgICAgIHNjZW5lID0gdGhpcy5fc2NlbmVzW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHNjZW5lO1xuICAgICAgICB9XG5cbiAgICAgICAgY3JlYXRlU2NlbmUoaWQ/OnN0cmluZyk6U2NlbmUge1xuICAgICAgICAgICAgcmV0dXJuIChuZXcgU2NlbmUoaWQpKS5hZGRUbyh0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZVNjZW5lKHNjZW5lOnN0cmluZyB8IFNjZW5lKTpHYW1le1xuICAgICAgICAgICAgaWYodHlwZW9mIHNjZW5lID09PSBcInN0cmluZ1wiKXtcbiAgICAgICAgICAgICAgICBzY2VuZSA9IHRoaXMuZ2V0U2NlbmUoPHN0cmluZz5zY2VuZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBpbmRleDpudW1iZXIgPSB0aGlzLl9zY2VuZXMuaW5kZXhPZig8U2NlbmU+c2NlbmUpO1xuICAgICAgICAgICAgaWYoaW5kZXggIT09IC0xKXtcbiAgICAgICAgICAgICAgICB0aGlzLl9zY2VuZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBhZGRTY2VuZShzY2VuZTpTY2VuZSk6R2FtZSB7XG4gICAgICAgICAgICB0aGlzLl9zY2VuZXMucHVzaChzY2VuZSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZUFsbFNjZW5lcygpOkdhbWV7XG4gICAgICAgICAgICB0aGlzLl9zY2VuZXMubGVuZ3RoID0gMDtcbiAgICAgICAgICAgIHRoaXMuc2NlbmUgPSBudWxsO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICByZXNpemUod2lkdGg6bnVtYmVyLCBoZWlnaHQ6bnVtYmVyLCByZW5kZXJlcjpib29sZWFuID0gZmFsc2UpOkdhbWV7XG4gICAgICAgICAgICBpZihyZW5kZXJlcil7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5yZXNpemUod2lkdGgsIGhlaWdodCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLndpZHRoID0gd2lkdGggKyBcInB4XCI7XG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyBcInB4XCI7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgYXV0b1Jlc2l6ZShtb2RlOm51bWJlcik6R2FtZSB7XG4gICAgICAgICAgICBpZih0aGlzLl9yZXNpemVMaXN0ZW5lcil7XG4gICAgICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX3Jlc2l6ZUxpc3RlbmVyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYobW9kZSA9PT0gR0FNRV9TQ0FMRV9UWVBFLk5PTkUpcmV0dXJuO1xuXG4gICAgICAgICAgICBzd2l0Y2gobW9kZSl7XG4gICAgICAgICAgICAgICAgY2FzZSBHQU1FX1NDQUxFX1RZUEUuQVNQRUNUX0ZJVDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVzaXplTGlzdGVuZXIgPSB0aGlzLl9yZXNpemVNb2RlQXNwZWN0Rml0O1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIEdBTUVfU0NBTEVfVFlQRS5BU1BFQ1RfRklMTDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVzaXplTGlzdGVuZXIgPSB0aGlzLl9yZXNpemVNb2RlQXNwZWN0RmlsbDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBHQU1FX1NDQUxFX1RZUEUuRklMTDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVzaXplTGlzdGVuZXIgPSB0aGlzLl9yZXNpemVNb2RlRmlsbDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl9yZXNpemVMaXN0ZW5lci5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIHRoaXMuX3Jlc2l6ZUxpc3RlbmVyKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX3Jlc2l6ZU1vZGVBc3BlY3RGaXQoKTp2b2lke1xuICAgICAgICAgICAgdmFyIHd3Om51bWJlciA9IHBhcnNlSW50KHRoaXMuY2FudmFzLnN0eWxlLndpZHRoLCAxMCkgfHwgdGhpcy5jYW52YXMud2lkdGg7XG4gICAgICAgICAgICB2YXIgaGg6bnVtYmVyID0gcGFyc2VJbnQodGhpcy5jYW52YXMuc3R5bGUuaGVpZ2h0LCAxMCkgfHwgdGhpcy5jYW52YXMuaGVpZ2h0O1xuICAgICAgICAgICAgaWYod2luZG93LmlubmVyV2lkdGggIT09IHd3IHx8IHdpbmRvdy5pbm5lckhlaWdodCAhPT0gaGgpe1xuICAgICAgICAgICAgICAgIHZhciBzY2FsZTpudW1iZXIgPSBNYXRoLm1pbih3aW5kb3cuaW5uZXJXaWR0aC90aGlzLndpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQvdGhpcy5oZWlnaHQpO1xuICAgICAgICAgICAgICAgIHRoaXMucmVzaXplKHRoaXMud2lkdGgqc2NhbGUsIHRoaXMuaGVpZ2h0KnNjYWxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX3Jlc2l6ZU1vZGVBc3BlY3RGaWxsKCk6dm9pZHtcbiAgICAgICAgICAgIHZhciB3dzpudW1iZXIgPSBwYXJzZUludCh0aGlzLmNhbnZhcy5zdHlsZS53aWR0aCwgMTApIHx8IHRoaXMuY2FudmFzLndpZHRoO1xuICAgICAgICAgICAgdmFyIGhoOm51bWJlciA9IHBhcnNlSW50KHRoaXMuY2FudmFzLnN0eWxlLmhlaWdodCwgMTApIHx8IHRoaXMuY2FudmFzLmhlaWdodDtcbiAgICAgICAgICAgIGlmKHdpbmRvdy5pbm5lcldpZHRoICE9PSB3dyB8fCB3aW5kb3cuaW5uZXJIZWlnaHQgIT09IGhoKXtcbiAgICAgICAgICAgICAgICB2YXIgc2NhbGU6bnVtYmVyID0gTWF0aC5tYXgod2luZG93LmlubmVyV2lkdGgvdGhpcy53aWR0aCwgd2luZG93LmlubmVySGVpZ2h0L3RoaXMuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICB2YXIgd2lkdGg6bnVtYmVyID0gdGhpcy53aWR0aCpzY2FsZTtcbiAgICAgICAgICAgICAgICB2YXIgaGVpZ2h0Om51bWJlciA9IHRoaXMuaGVpZ2h0KnNjYWxlO1xuXG4gICAgICAgICAgICAgICAgdmFyIHRvcE1hcmdpbjpudW1iZXIgPSAod2luZG93LmlubmVySGVpZ2h0LWhlaWdodCkvMjtcbiAgICAgICAgICAgICAgICB2YXIgbGVmdE1hcmdpbjpudW1iZXIgPSAod2luZG93LmlubmVyV2lkdGgtd2lkdGgpLzI7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnJlc2l6ZSh3aWR0aCwgaGVpZ2h0KTtcblxuICAgICAgICAgICAgICAgIHZhciBzdHlsZTphbnkgPSA8YW55PnRoaXMuY2FudmFzLnN0eWxlO1xuICAgICAgICAgICAgICAgIHN0eWxlWydtYXJnaW4tdG9wJ10gPSB0b3BNYXJnaW4gKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgc3R5bGVbJ21hcmdpbi1sZWZ0J10gPSBsZWZ0TWFyZ2luICsgXCJweFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfcmVzaXplTW9kZUZpbGwoKTp2b2lke1xuICAgICAgICAgICAgdmFyIHd3Om51bWJlciA9IHBhcnNlSW50KHRoaXMuY2FudmFzLnN0eWxlLndpZHRoLCAxMCkgfHwgdGhpcy5jYW52YXMud2lkdGg7XG4gICAgICAgICAgICB2YXIgaGg6bnVtYmVyID0gcGFyc2VJbnQodGhpcy5jYW52YXMuc3R5bGUuaGVpZ2h0LCAxMCkgfHwgdGhpcy5jYW52YXMuaGVpZ2h0O1xuICAgICAgICAgICAgaWYod2luZG93LmlubmVyV2lkdGggIT09IHd3IHx8IHdpbmRvdy5pbm5lckhlaWdodCAhPT0gaGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGdldCB3aWR0aCgpOm51bWJlciB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJlci53aWR0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBoZWlnaHQoKTpudW1iZXIge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyZXIuaGVpZ2h0O1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIEdhbWVDb25maWcge1xuICAgICAgICBpZD86c3RyaW5nO1xuICAgICAgICB3aWR0aD86bnVtYmVyO1xuICAgICAgICBoZWlnaHQ/Om51bWJlcjtcbiAgICAgICAgdXNlV2ViQXVkaW8/OmJvb2xlYW47XG4gICAgICAgIHVzZVBlcnNpc3RhbnREYXRhPzpib29sZWFuO1xuICAgICAgICBnYW1lU2NhbGVUeXBlPzpudW1iZXI7XG4gICAgICAgIHN0b3BBdExvc3RGb2N1cz86Ym9vbGVhbjtcbiAgICAgICAgYXNzZXRzVXJsPzpzdHJpbmc7XG4gICAgICAgIGxvYWRlckNvbmN1cnJlbmN5PzpudW1iZXI7XG4gICAgICAgIHNvdW5kTWF4TGluZXM/Om51bWJlcjtcbiAgICAgICAgbXVzaWNNYXhMaW5lcz86bnVtYmVyO1xuICAgIH1cbn1cblxuaW50ZXJmYWNlIE9iamVjdCB7XG4gICAgYXNzaWduKHRhcmdldDpPYmplY3QsIC4uLnNvdXJjZXM6T2JqZWN0W10pOk9iamVjdDtcbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuL0F1ZGlvTGluZS50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9jb3JlL0dhbWUudHNcIiAvPlxubW9kdWxlIFBJWEkge1xuICAgIGV4cG9ydCBjbGFzcyBBdWRpb01hbmFnZXJ7XG4gICAgICAgIHNvdW5kTGluZXM6QXVkaW9MaW5lW10gPSBbXTtcbiAgICAgICAgbXVzaWNMaW5lczpBdWRpb0xpbmVbXSA9IFtdO1xuICAgICAgICBwcml2YXRlIF90ZW1wTGluZXM6QXVkaW9MaW5lW10gPSBbXTtcblxuICAgICAgICBtdXNpY011dGVkOmJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgc291bmRNdXRlZDpib29sZWFuID0gZmFsc2U7XG5cbiAgICAgICAgY29udGV4dDpBdWRpb0NvbnRleHQ7XG4gICAgICAgIGdhaW5Ob2RlOkF1ZGlvTm9kZTtcblxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHNvdW5kTWF4TGluZXM6bnVtYmVyID0gMTAsIHByaXZhdGUgbXVzaWNNYXhMaW5lczpudW1iZXIgPSAxKXtcbiAgICAgICAgICAgIGlmKHV0aWxzLl9hdWRpb1R5cGVTZWxlY3RlZCA9PT0gQVVESU9fVFlQRS5XRUJBVURJTykge1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dCA9IERldmljZS5nbG9iYWxXZWJBdWRpb0NvbnRleHQ7XG4gICAgICAgICAgICAgICAgdGhpcy5nYWluTm9kZSA9IF9jcmVhdGVHYWluTm9kZSh0aGlzLmNvbnRleHQpO1xuICAgICAgICAgICAgICAgIHRoaXMuZ2Fpbk5vZGUuY29ubmVjdCh0aGlzLmNvbnRleHQuZGVzdGluYXRpb24pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgaTpudW1iZXI7XG4gICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCB0aGlzLnNvdW5kTWF4TGluZXM7IGkrKyl7XG4gICAgICAgICAgICAgICAgdGhpcy5zb3VuZExpbmVzLnB1c2gobmV3IEF1ZGlvTGluZSh0aGlzKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvcihpID0gMDsgaSA8IHRoaXMubXVzaWNNYXhMaW5lczsgaSsrKXtcbiAgICAgICAgICAgICAgICB0aGlzLm11c2ljTGluZXMucHVzaChuZXcgQXVkaW9MaW5lKHRoaXMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHBhdXNlQWxsTGluZXMoKTpBdWRpb01hbmFnZXIge1xuICAgICAgICAgICAgdGhpcy5wYXVzZU11c2ljKCk7XG4gICAgICAgICAgICB0aGlzLnBhdXNlU291bmQoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzdW1lQWxsTGluZXMoKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICB0aGlzLnJlc3VtZU11c2ljKCk7XG4gICAgICAgICAgICB0aGlzLnJlc3VtZVNvdW5kKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHBsYXlNdXNpYyhpZDpzdHJpbmcsIGxvb3A/OmJvb2xlYW58RnVuY3Rpb24sIGNhbGxiYWNrPzpGdW5jdGlvbik6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgaWYodHlwZW9mIGxvb3AgPT09IFwiZnVuY3Rpb25cIil7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2sgPSA8RnVuY3Rpb24+bG9vcDtcbiAgICAgICAgICAgICAgICBsb29wID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGxheShpZCwgdGhpcy5tdXNpY0xpbmVzLCA8Ym9vbGVhbj5sb29wLCBjYWxsYmFjayk7XG4gICAgICAgIH1cblxuICAgICAgICBwbGF5U291bmQoaWQ6c3RyaW5nLCBsb29wPzpib29sZWFufEZ1bmN0aW9uLCBjYWxsYmFjaz86RnVuY3Rpb24pOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIGlmKHR5cGVvZiBsb29wID09PSBcImZ1bmN0aW9uXCIpe1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrID0gPEZ1bmN0aW9uPmxvb3A7XG4gICAgICAgICAgICAgICAgbG9vcCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BsYXkoaWQsIHRoaXMuc291bmRMaW5lcywgPGJvb2xlYW4+bG9vcCwgY2FsbGJhY2spO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RvcE11c2ljKGlkPzpzdHJpbmcpOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdG9wKGlkLCB0aGlzLm11c2ljTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RvcFNvdW5kKGlkPzpzdHJpbmcpOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdG9wKGlkLCB0aGlzLnNvdW5kTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcGF1c2VNdXNpYyhpZD86c3RyaW5nKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGF1c2UoaWQsIHRoaXMubXVzaWNMaW5lcyk7XG4gICAgICAgIH1cblxuICAgICAgICBwYXVzZVNvdW5kKGlkPzpzdHJpbmcpOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wYXVzZShpZCwgdGhpcy5zb3VuZExpbmVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc3VtZU11c2ljKGlkPzpzdHJpbmcpOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZXN1bWUoaWQsIHRoaXMubXVzaWNMaW5lcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXN1bWVTb3VuZChpZD86c3RyaW5nKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVzdW1lKGlkLCB0aGlzLnNvdW5kTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgbXV0ZU11c2ljKGlkPzpzdHJpbmcpOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tdXRlKGlkLCB0aGlzLm11c2ljTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgbXV0ZVNvdW5kKGlkPzpzdHJpbmcpOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tdXRlKGlkLCB0aGlzLnNvdW5kTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdW5tdXRlTXVzaWMoaWQ/OnN0cmluZyk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3VubXV0ZShpZCwgdGhpcy5tdXNpY0xpbmVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHVubXV0ZVNvdW5kKGlkPzpzdHJpbmcpOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl91bm11dGUoaWQsIHRoaXMuc291bmRMaW5lcyk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIHByaXZhdGUgX3BhdXNlKGlkOnN0cmluZywgbGluZXM6QXVkaW9MaW5lW10pOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIGlmKCFpZCl7XG4gICAgICAgICAgICAgICAgZm9yKHZhciBpOm51bWJlciA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgICAgIGlmKCFsaW5lc1tpXS5hdmFpbGFibGUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluZXNbaV0ucGF1c2UoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgYXVkaW9MaW5lczpBdWRpb0xpbmVbXSA9IHRoaXMuX2dldExpbmVzQnlJZChpZCwgbGluZXMpO1xuICAgICAgICAgICAgaWYoYXVkaW9MaW5lcy5sZW5ndGgpe1xuICAgICAgICAgICAgICAgIGZvcihpID0gMDsgaSA8IGF1ZGlvTGluZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBhdWRpb0xpbmVzW2ldLnBhdXNlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9yZXN1bWUoaWQ6c3RyaW5nLCBsaW5lczpBdWRpb0xpbmVbXSk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgaWYoIWlkKXtcbiAgICAgICAgICAgICAgICBmb3IodmFyIGk6bnVtYmVyID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICAgICAgaWYoIWxpbmVzW2ldLmF2YWlsYWJsZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lc1tpXS5yZXN1bWUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgYXVkaW9MaW5lczpBdWRpb0xpbmVbXSA9IHRoaXMuX2dldExpbmVzQnlJZChpZCwgbGluZXMpO1xuICAgICAgICAgICAgaWYoYXVkaW9MaW5lcy5sZW5ndGgpe1xuICAgICAgICAgICAgICAgIGZvcihpID0gMDsgaSA8IGF1ZGlvTGluZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBhdWRpb0xpbmVzW2ldLnJlc3VtZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfcGxheShpZDpzdHJpbmcsIGxpbmVzOkF1ZGlvTGluZVtdLCBsb29wOmJvb2xlYW4gPSBmYWxzZSwgY2FsbGJhY2s/OkZ1bmN0aW9uKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICB2YXIgbGluZTpBdWRpb0xpbmUgPSB0aGlzLl9nZXRBdmFpbGFibGVMaW5lRnJvbShsaW5lcyk7XG4gICAgICAgICAgICBpZighbGluZSl7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignQXVkaW9NYW5hZ2VyOiBBbGwgbGluZXMgYXJlIGJ1c3khJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBhdWRpbzpBdWRpbyA9IHV0aWxzLkF1ZGlvQ2FjaGVbaWRdO1xuICAgICAgICAgICAgaWYoIWF1ZGlvKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdBdWRpbyAoJyArIGlkICsgJykgbm90IGZvdW5kLicpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsaW5lLnNldEF1ZGlvKGF1ZGlvLCBsb29wLCBjYWxsYmFjaykucGxheSgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9zdG9wKGlkOnN0cmluZywgbGluZXM6QXVkaW9MaW5lW10pOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIGlmKCFpZCl7XG4gICAgICAgICAgICAgICAgZm9yKHZhciBpOm51bWJlciA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgICAgIGlmKCFsaW5lc1tpXS5hdmFpbGFibGUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluZXNbaV0uc3RvcCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBhdWRpb0xpbmVzOkF1ZGlvTGluZVtdID0gdGhpcy5fZ2V0TGluZXNCeUlkKGlkLCBsaW5lcyk7XG4gICAgICAgICAgICBpZihhdWRpb0xpbmVzLmxlbmd0aCl7XG4gICAgICAgICAgICAgICAgZm9yKGkgPSAwOyBpIDwgYXVkaW9MaW5lcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgICAgIGF1ZGlvTGluZXNbaV0uc3RvcCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9tdXRlKGlkOnN0cmluZywgbGluZXM6QXVkaW9MaW5lW10pOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIGlmKCFpZCl7XG4gICAgICAgICAgICAgICAgZm9yKHZhciBpOm51bWJlciA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgICAgIGlmKCFsaW5lc1tpXS5hdmFpbGFibGUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluZXNbaV0ubXV0ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBhdWRpb0xpbmVzOkF1ZGlvTGluZVtdID0gdGhpcy5fZ2V0TGluZXNCeUlkKGlkLCBsaW5lcyk7XG4gICAgICAgICAgICBpZihhdWRpb0xpbmVzLmxlbmd0aCl7XG4gICAgICAgICAgICAgICAgZm9yKGkgPSAwOyBpIDwgYXVkaW9MaW5lcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgICAgIGF1ZGlvTGluZXNbaV0ubXV0ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfdW5tdXRlKGlkOnN0cmluZywgbGluZXM6QXVkaW9MaW5lW10pOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIGlmKCFpZCl7XG4gICAgICAgICAgICAgICAgZm9yKHZhciBpOm51bWJlciA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgICAgIGlmKCFsaW5lc1tpXS5hdmFpbGFibGUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluZXNbaV0udW5tdXRlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGF1ZGlvTGluZXM6QXVkaW9MaW5lW10gPSB0aGlzLl9nZXRMaW5lc0J5SWQoaWQsIGxpbmVzKTtcbiAgICAgICAgICAgIGlmKGF1ZGlvTGluZXMubGVuZ3RoKXtcbiAgICAgICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCBhdWRpb0xpbmVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICAgICAgYXVkaW9MaW5lc1tpXS51bm11dGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX2dldExpbmVzQnlJZChpZDpzdHJpbmcsIGxpbmVzOkF1ZGlvTGluZVtdKTpBdWRpb0xpbmVbXSB7XG4gICAgICAgICAgICB0aGlzLl90ZW1wTGluZXMubGVuZ3RoID0gMDtcbiAgICAgICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgIGlmKCFsaW5lc1tpXS5hdmFpbGFibGUpe1xuICAgICAgICAgICAgICAgICAgICBpZihsaW5lc1tpXS5hdWRpby5pZCA9PT0gaWQpdGhpcy5fdGVtcExpbmVzLnB1c2gobGluZXNbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RlbXBMaW5lcztcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX2dldEF2YWlsYWJsZUxpbmVGcm9tKGxpbmVzOkF1ZGlvTGluZVtdKTpBdWRpb0xpbmV7XG4gICAgICAgICAgICB2YXIgbDpBdWRpb0xpbmU7XG4gICAgICAgICAgICBmb3IodmFyIGk6bnVtYmVyID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICBpZihsaW5lc1tpXS5hdmFpbGFibGUpe1xuICAgICAgICAgICAgICAgICAgICBsID0gbGluZXNbaV07XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBsO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfY3JlYXRlR2Fpbk5vZGUoY3R4OkF1ZGlvQ29udGV4dCk6R2Fpbk5vZGV7XG4gICAgICAgIHJldHVybiBjdHguY3JlYXRlR2FpbiA/IGN0eC5jcmVhdGVHYWluKCkgOiBjdHguY3JlYXRlR2Fpbk5vZGUoKTtcbiAgICB9XG59XG5cbmludGVyZmFjZSBBdWRpb0NvbnRleHQge1xuICAgIGNyZWF0ZUdhaW5Ob2RlKCk6YW55O1xufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4vQXVkaW9NYW5hZ2VyLnRzXCIgLz5cbm1vZHVsZSBQSVhJIHtcbiAgICBleHBvcnQgY2xhc3MgQXVkaW8ge1xuICAgICAgICBsb29wOmJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgdm9sdW1lOm51bWJlciA9IDE7XG4gICAgICAgIG11dGVkOmJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgbWFuYWdlcjpBdWRpb01hbmFnZXI7XG5cbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIHNvdXJjZTphbnksIHB1YmxpYyBpZDpzdHJpbmcpe1xuICAgICAgICB9XG4gICAgfVxufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2RlZnMvcGl4aS5qcy5kLnRzXCIgLz5cblxubW9kdWxlIFBJWEkge1xuICAgIENvbnRhaW5lci5fa2lsbGVkT2JqZWN0cyA9IFtdO1xuXG4gICAgQ29udGFpbmVyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihkZWx0YVRpbWU6IG51bWJlcikge1xuICAgICAgICB0aGlzLnBvc2l0aW9uLnggKz0gdGhpcy52ZWxvY2l0eS54ICogZGVsdGFUaW1lO1xuICAgICAgICB0aGlzLnBvc2l0aW9uLnkgKz0gdGhpcy52ZWxvY2l0eS55ICogZGVsdGFUaW1lO1xuICAgICAgICB0aGlzLnJvdGF0aW9uICs9IHRoaXMucm90YXRpb25TcGVlZCAqIGRlbHRhVGltZTtcblxuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuW2ldLnVwZGF0ZShkZWx0YVRpbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIENvbnRhaW5lci5wcm90b3R5cGUuYWRkVG8gPSBmdW5jdGlvbihwYXJlbnQpe1xuICAgICAgICBwYXJlbnQuYWRkQ2hpbGQodGhpcyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBDb250YWluZXIucHJvdG90eXBlLmtpbGwgPSBmdW5jdGlvbigpe1xuICAgICAgICBQSVhJLkNvbnRhaW5lci5fa2lsbGVkT2JqZWN0cy5wdXNoKHRoaXMpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgQ29udGFpbmVyLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbigpe1xuICAgICAgICBpZih0aGlzLnBhcmVudCl7XG4gICAgICAgICAgICB0aGlzLnBhcmVudC5yZW1vdmVDaGlsZCh0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9kZWZzL3BpeGkuanMuZC50c1wiIC8+XG5cbm1vZHVsZSBQSVhJIHtcbiAgICBEaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5zcGVlZCA9IDA7XG4gICAgRGlzcGxheU9iamVjdC5wcm90b3R5cGUudmVsb2NpdHkgPSBuZXcgUG9pbnQoKTtcbiAgICBEaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5kaXJlY3Rpb24gPSAwO1xuICAgIERpc3BsYXlPYmplY3QucHJvdG90eXBlLnJvdGF0aW9uU3BlZWQgPSAwO1xuXG4gICAgRGlzcGxheU9iamVjdC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oZGVsdGFUaW1lOm51bWJlcil7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
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
            AudioLine.prototype.volume = function (value) {
                if (this.manager.context) {
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
            musicChannelLines: 1
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
                    this.gainNode = _createGainNode(this.context);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInR1cmJvcGl4aS5qcyIsImluZGV4LnRzIiwiYXVkaW8vQXVkaW9MaW5lLnRzIiwiY29yZS9jb25zdC50cyIsImNvcmUvRGV2aWNlLnRzIiwiZGlzcGxheS9TY2VuZS50cyIsImlucHV0L0lucHV0TWFuYWdlci50cyIsImxvYWRlci9iaXRtYXBGb250UGFyc2VyVFhULnRzIiwibG9hZGVyL2F1ZGlvUGFyc2VyLnRzIiwiY29yZS9VdGlscy50cyIsImxvYWRlci9Mb2FkZXIudHMiLCJjb3JlL0RhdGFNYW5hZ2VyLnRzIiwiY29yZS9HYW1lLnRzIiwiYXVkaW8vQXVkaW9NYW5hZ2VyLnRzIiwiYXVkaW8vQXVkaW8udHMiLCJkaXNwbGF5L0NvbnRhaW5lci50cyIsImRpc3BsYXkvRGlzcGxheU9iamVjdC50cyJdLCJuYW1lcyI6WyJQSVhJIiwiRXJyb3IiLCJQSVhJX1ZFUlNJT05fUkVRVUlSRUQiLCJQSVhJX1ZFUlNJT04iLCJWRVJTSU9OIiwibWF0Y2giLCJIVE1MQXVkaW8iLCJBdWRpbyIsIlBJWEkuQXVkaW9MaW5lIiwiUElYSS5BdWRpb0xpbmUuY29uc3RydWN0b3IiLCJQSVhJLkF1ZGlvTGluZS5zZXRBdWRpbyIsIlBJWEkuQXVkaW9MaW5lLnBsYXkiLCJQSVhJLkF1ZGlvTGluZS5zdG9wIiwiUElYSS5BdWRpb0xpbmUucGF1c2UiLCJQSVhJLkF1ZGlvTGluZS5yZXN1bWUiLCJQSVhJLkF1ZGlvTGluZS5tdXRlIiwiUElYSS5BdWRpb0xpbmUudW5tdXRlIiwiUElYSS5BdWRpb0xpbmUudm9sdW1lIiwiUElYSS5BdWRpb0xpbmUucmVzZXQiLCJQSVhJLkF1ZGlvTGluZS5fb25FbmQiLCJQSVhJLkdBTUVfU0NBTEVfVFlQRSIsIlBJWEkuQVVESU9fVFlQRSIsIlBJWEkuRGV2aWNlIiwiUElYSS5EZXZpY2UuZ2V0TW91c2VXaGVlbEV2ZW50IiwiUElYSS5EZXZpY2UudmlicmF0ZSIsIlBJWEkuRGV2aWNlLmdldFZpc2liaWxpdHlDaGFuZ2VFdmVudCIsIlBJWEkuRGV2aWNlLmlzT25saW5lIiwiX19leHRlbmRzIiwiZCIsImIiLCJwIiwiaGFzT3duUHJvcGVydHkiLCJfXyIsImNvbnN0cnVjdG9yIiwicHJvdG90eXBlIiwiUElYSS5TY2VuZSIsIlBJWEkuU2NlbmUuY29uc3RydWN0b3IiLCJQSVhJLlNjZW5lLmFkZFRvIiwiUElYSS5JbnB1dE1hbmFnZXIiLCJQSVhJLklucHV0TWFuYWdlci5jb25zdHJ1Y3RvciIsIlBJWEkuYml0bWFwRm9udFBhcnNlclRYVCIsInJlc291cmNlIiwiZGF0YSIsInhoclR5cGUiLCJuZXh0IiwidGV4dCIsInhociIsInJlc3BvbnNlVGV4dCIsImluZGV4T2YiLCJ1cmwiLCJkaXJuYW1lIiwiYmFzZVVybCIsImNoYXJBdCIsImxlbmd0aCIsInJlcGxhY2UiLCJ0ZXh0dXJlVXJsIiwiZ2V0VGV4dHVyZVVybCIsInV0aWxzIiwiVGV4dHVyZUNhY2hlIiwicGFyc2UiLCJsb2FkT3B0aW9ucyIsImNyb3NzT3JpZ2luIiwibG9hZFR5cGUiLCJsb2FkZXJzIiwiUmVzb3VyY2UiLCJMT0FEX1RZUEUiLCJJTUFHRSIsImFkZCIsIm5hbWUiLCJyZXMiLCJ0ZXh0dXJlIiwiUElYSS5wYXJzZSIsIlBJWEkuZGlybmFtZSIsIlBJWEkuZ2V0VGV4dHVyZVVybCIsIlBJWEkuZ2V0QXR0ciIsIlBJWEkuYXVkaW9QYXJzZXIiLCJEZXZpY2UiLCJpc0F1ZGlvU3VwcG9ydGVkIiwiZXh0IiwiX2dldEV4dCIsIl9hbGxvd2VkRXh0IiwiX2NhblBsYXkiLCJfYXVkaW9UeXBlU2VsZWN0ZWQiLCJBVURJT19UWVBFIiwiV0VCQVVESU8iLCJnbG9iYWxXZWJBdWRpb0NvbnRleHQiLCJkZWNvZGVBdWRpb0RhdGEiLCJfYWRkVG9DYWNoZSIsImJpbmQiLCJQSVhJLmF1ZGlvUGFyc2VyVXJsIiwiUElYSS5fYWRkVG9DYWNoZSIsIlBJWEkuX2dldEV4dCIsIlBJWEkuX2NhblBsYXkiLCJQSVhJLnV0aWxzIiwiUElYSS5sb2FkZXJzIiwiUElYSS5sb2FkZXJzLlR1cmJvTG9hZGVyIiwiUElYSS5sb2FkZXJzLlR1cmJvTG9hZGVyLmNvbnN0cnVjdG9yIiwiUElYSS5sb2FkZXJzLlR1cmJvTG9hZGVyLmFkZCIsIlBJWEkubG9hZGVycy5fY2hlY2tBdWRpb1R5cGUiLCJQSVhJLmxvYWRlcnMuX3NldEF1ZGlvRXh0IiwiUElYSS5EYXRhTWFuYWdlciIsIlBJWEkuRGF0YU1hbmFnZXIuY29uc3RydWN0b3IiLCJQSVhJLkRhdGFNYW5hZ2VyLmxvYWQiLCJQSVhJLkRhdGFNYW5hZ2VyLnNhdmUiLCJQSVhJLkRhdGFNYW5hZ2VyLnJlc2V0IiwiUElYSS5EYXRhTWFuYWdlci5zZXQiLCJQSVhJLkRhdGFNYW5hZ2VyLmdldCIsIlBJWEkuRGF0YU1hbmFnZXIuZGVsIiwiUElYSS5HYW1lIiwiUElYSS5HYW1lLmNvbnN0cnVjdG9yIiwiUElYSS5HYW1lLl9hbmltYXRlIiwiUElYSS5HYW1lLnVwZGF0ZSIsIlBJWEkuR2FtZS5zdGFydCIsIlBJWEkuR2FtZS5zdG9wIiwiUElYSS5HYW1lLmVuYWJsZVN0b3BBdExvc3RGb2N1cyIsIlBJWEkuR2FtZS5kaXNhYmxlU3RvcEF0TG9zdEZvY3VzIiwiUElYSS5HYW1lLl9vblZpc2liaWxpdHlDaGFuZ2UiLCJQSVhJLkdhbWUub25Mb3N0Rm9jdXMiLCJQSVhJLkdhbWUuc2V0U2NlbmUiLCJQSVhJLkdhbWUuZ2V0U2NlbmUiLCJQSVhJLkdhbWUuY3JlYXRlU2NlbmUiLCJQSVhJLkdhbWUucmVtb3ZlU2NlbmUiLCJQSVhJLkdhbWUuYWRkU2NlbmUiLCJQSVhJLkdhbWUucmVtb3ZlQWxsU2NlbmVzIiwiUElYSS5HYW1lLnJlc2l6ZSIsIlBJWEkuR2FtZS5hdXRvUmVzaXplIiwiUElYSS5HYW1lLl9yZXNpemVNb2RlQXNwZWN0Rml0IiwiUElYSS5HYW1lLl9yZXNpemVNb2RlQXNwZWN0RmlsbCIsIlBJWEkuR2FtZS5fcmVzaXplTW9kZUZpbGwiLCJnZXQiLCJQSVhJLkdhbWUud2lkdGgiLCJlbnVtZXJhYmxlIiwiY29uZmlndXJhYmxlIiwiUElYSS5HYW1lLmhlaWdodCIsIlBJWEkuQXVkaW9NYW5hZ2VyIiwiUElYSS5BdWRpb01hbmFnZXIuY29uc3RydWN0b3IiLCJQSVhJLkF1ZGlvTWFuYWdlci5nZXRBdWRpbyIsIlBJWEkuQXVkaW9NYW5hZ2VyLnBhdXNlQWxsTGluZXMiLCJQSVhJLkF1ZGlvTWFuYWdlci5yZXN1bWVBbGxMaW5lcyIsIlBJWEkuQXVkaW9NYW5hZ2VyLnBsYXkiLCJQSVhJLkF1ZGlvTWFuYWdlci5wbGF5TXVzaWMiLCJQSVhJLkF1ZGlvTWFuYWdlci5wbGF5U291bmQiLCJQSVhJLkF1ZGlvTWFuYWdlci5zdG9wIiwiUElYSS5BdWRpb01hbmFnZXIuc3RvcE11c2ljIiwiUElYSS5BdWRpb01hbmFnZXIuc3RvcFNvdW5kIiwiUElYSS5BdWRpb01hbmFnZXIucGF1c2UiLCJQSVhJLkF1ZGlvTWFuYWdlci5wYXVzZU11c2ljIiwiUElYSS5BdWRpb01hbmFnZXIucGF1c2VTb3VuZCIsIlBJWEkuQXVkaW9NYW5hZ2VyLnJlc3VtZSIsIlBJWEkuQXVkaW9NYW5hZ2VyLnJlc3VtZU11c2ljIiwiUElYSS5BdWRpb01hbmFnZXIucmVzdW1lU291bmQiLCJQSVhJLkF1ZGlvTWFuYWdlci5tdXRlIiwiUElYSS5BdWRpb01hbmFnZXIubXV0ZU11c2ljIiwiUElYSS5BdWRpb01hbmFnZXIubXV0ZVNvdW5kIiwiUElYSS5BdWRpb01hbmFnZXIudW5tdXRlIiwiUElYSS5BdWRpb01hbmFnZXIudW5tdXRlTXVzaWMiLCJQSVhJLkF1ZGlvTWFuYWdlci51bm11dGVTb3VuZCIsIlBJWEkuQXVkaW9NYW5hZ2VyLl9wYXVzZSIsIlBJWEkuQXVkaW9NYW5hZ2VyLl9yZXN1bWUiLCJQSVhJLkF1ZGlvTWFuYWdlci5fcGxheSIsIlBJWEkuQXVkaW9NYW5hZ2VyLl9zdG9wIiwiUElYSS5BdWRpb01hbmFnZXIuX211dGUiLCJQSVhJLkF1ZGlvTWFuYWdlci5fdW5tdXRlIiwiUElYSS5BdWRpb01hbmFnZXIuX2dldExpbmVzQnlJZCIsIlBJWEkuQXVkaW9NYW5hZ2VyLl9nZXRBdmFpbGFibGVMaW5lRnJvbSIsIlBJWEkuX2NyZWF0ZUdhaW5Ob2RlIiwiUElYSS5BdWRpbyIsIlBJWEkuQXVkaW8uY29uc3RydWN0b3IiLCJQSVhJLkF1ZGlvLnBsYXkiLCJQSVhJLkF1ZGlvLnN0b3AiLCJQSVhJLkF1ZGlvLm11dGUiLCJQSVhJLkF1ZGlvLnVubXV0ZSIsIlBJWEkuQXVkaW8ucGF1c2UiLCJQSVhJLkF1ZGlvLnJlc3VtZSIsIlBJWEkuQXVkaW8udm9sdW1lIiwic2V0IiwicG9zaXRpb24iLCJ4IiwidmVsb2NpdHkiLCJkZWx0YVRpbWUiLCJ5Iiwicm90YXRpb24iLCJyb3RhdGlvblNwZWVkIiwiaSIsImNoaWxkcmVuIiwidXBkYXRlIiwicGFyZW50IiwiYWRkQ2hpbGQiLCJDb250YWluZXIiLCJfa2lsbGVkT2JqZWN0cyIsInB1c2giLCJyZW1vdmVDaGlsZCJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7SUNMQSxJQUFHLENBQUNBLElBQUosRUFBUztBQUFBLFFBQ0wsTUFBTSxJQUFJQyxLQUFKLENBQVUsd0JBQVYsQ0FBTixDQURLO0FBQUE7SUFJVCxJQUFNQyxxQkFBQSxHQUF3QixPQUE5QjtJQUNBLElBQU1DLFlBQUEsR0FBZUgsSUFBQSxDQUFLSSxPQUFMLENBQWFDLEtBQWIsQ0FBbUIsVUFBbkIsRUFBK0IsQ0FBL0IsQ0FBckI7SUFFQSxJQUFHRixZQUFBLEdBQWVELHFCQUFsQixFQUF3QztBQUFBLFFBQ3BDLE1BQU0sSUFBSUQsS0FBSixDQUFVLGNBQWNELElBQUEsQ0FBS0ksT0FBbkIsR0FBNkIsb0NBQTdCLEdBQW1FRixxQkFBN0UsQ0FBTixDQURvQztBQUFBO0lER3hDO0FBQUEsUUVWSUksU0FBQSxHQUFZQyxLRlVoQjtJRVRBLElBQU9QLElBQVA7SUFBQSxDQUFBLFVBQU9BLElBQVAsRUFBWTtBQUFBLFFBQ1JBLElBQUFBLFNBQUFBLEdBQUFBLFlBQUFBO0FBQUFBLFlBZUlRLFNBQUFBLFNBQUFBLENBQW1CQSxP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QUFBLFFBRVJBLElBQUFBLENBQUFBLGFBQUFBLENBQWNBLFNBQWRBLENBQXdCQSxRQUF4QkEsR0FBbUNBLElBQUlBLElBQUFBLENBQUFBLEtBQUpBLEVBQW5DQSxDQUZRO0FBQUEsUUFHUkEsSUFBQUEsQ0FBQUEsYUFBQUEsQ0FBY0EsU0FBZEEsQ0FBd0JBLFNBQXhCQSxHQUFvQ0EsQ0FBcENBLENBSFE7QUFBQSxRQUlSQSxJQUFBQSxDQUFBQSxhQUFBQSxDQUFjQSxTQUFkQSxDQUF3QkEsYUFBeEJBLEdBQXdDQSxDQUF4Q0EsQ0FKUTtBQUFBLFFBTVJBLElBQUFBLENBQUFBLGFBQUFBLENBQWNBLFNBQWRBLENBQXdCQSxNQUF4QkEsR0FBaUNBLFVBQVNBLFNBQVRBLEVBQXlCQTtBQUFBQSxZQUN0RCxPQUFPLElBQVAsQ0FEc0RBO0FBQUFBLFNBQTFEQSxDQU5RO0FBQUEsS0FBWixDQUFPQSxJQUFBLElBQUEsQ0FBQUEsSUFBQSxHQUFJLEVBQUosQ0FBUCIsImZpbGUiOiJ0dXJib3BpeGkuanMiLCJzb3VyY2VzQ29udGVudCI6W251bGwsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL2RlZnMvcGl4aS5qcy5kLnRzXCIgLz5cbmlmKCFQSVhJKXtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0V5ISBXaGVyZSBpcyBwaXhpLmpzPz8nKTtcbn1cblxuY29uc3QgUElYSV9WRVJTSU9OX1JFUVVJUkVEID0gXCIzLjAuN1wiO1xuY29uc3QgUElYSV9WRVJTSU9OID0gUElYSS5WRVJTSU9OLm1hdGNoKC9cXGQuXFxkLlxcZC8pWzBdO1xuXG5pZihQSVhJX1ZFUlNJT04gPCBQSVhJX1ZFUlNJT05fUkVRVUlSRUQpe1xuICAgIHRocm93IG5ldyBFcnJvcihcIlBpeGkuanMgdlwiICsgUElYSS5WRVJTSU9OICsgXCIgaXQncyBub3Qgc3VwcG9ydGVkLCBwbGVhc2UgdXNlIF5cIiArIFBJWElfVkVSU0lPTl9SRVFVSVJFRCk7XG59XG4iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuL0F1ZGlvTWFuYWdlci50c1wiIC8+XG52YXIgSFRNTEF1ZGlvID0gQXVkaW87XG5tb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IGNsYXNzIEF1ZGlvTGluZSB7XG4gICAgICAgIGF2YWlsYWJsZTpib29sZWFuID0gdHJ1ZTtcbiAgICAgICAgYXVkaW86QXVkaW87XG4gICAgICAgIGxvb3A6Ym9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBwYXVzZWQ6Ym9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBjYWxsYmFjazpGdW5jdGlvbjtcbiAgICAgICAgbXV0ZWQ6Ym9vbGVhbiA9IGZhbHNlO1xuXG4gICAgICAgIHN0YXJ0VGltZTpudW1iZXIgPSAwO1xuICAgICAgICBsYXN0UGF1c2VUaW1lOm51bWJlciA9IDA7XG4gICAgICAgIG9mZnNldFRpbWU6bnVtYmVyID0gMDtcblxuICAgICAgICBwcml2YXRlIF9odG1sQXVkaW86SFRNTEF1ZGlvRWxlbWVudDtcbiAgICAgICAgcHJpdmF0ZSBfd2ViQXVkaW86QXVkaW9Db250ZXh0O1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBtYW5hZ2VyOkF1ZGlvTWFuYWdlcil7XG4gICAgICAgICAgICBpZighdGhpcy5tYW5hZ2VyLmNvbnRleHQpe1xuICAgICAgICAgICAgICAgIHRoaXMuX2h0bWxBdWRpbyA9IG5ldyBIVE1MQXVkaW8oKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9odG1sQXVkaW8uYWRkRXZlbnRMaXN0ZW5lcignZW5kZWQnLCB0aGlzLl9vbkVuZC5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHNldEF1ZGlvKGF1ZGlvOkF1ZGlvLCBsb29wOmJvb2xlYW58RnVuY3Rpb24sIGNhbGxiYWNrPzpGdW5jdGlvbik6QXVkaW9MaW5le1xuICAgICAgICAgICAgaWYodHlwZW9mIGxvb3AgPT09IFwiZnVuY3Rpb25cIil7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2sgPSA8RnVuY3Rpb24+bG9vcDtcbiAgICAgICAgICAgICAgICBsb29wID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuYXVkaW8gPSBhdWRpbztcbiAgICAgICAgICAgIHRoaXMuYXZhaWxhYmxlID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmxvb3AgPSA8Ym9vbGVhbj5sb29wO1xuICAgICAgICAgICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwbGF5KHBhdXNlPzpib29sZWFuKTpBdWRpb0xpbmUge1xuICAgICAgICAgICAgaWYoIXBhdXNlICYmIHRoaXMucGF1c2VkKXJldHVybiB0aGlzO1xuXG4gICAgICAgICAgICBpZih0aGlzLm1hbmFnZXIuY29udGV4dCl7XG5cbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHRoaXMuX2h0bWxBdWRpby5zcmMgPSAodGhpcy5hdWRpby5zb3VyY2Uuc3JjICE9PSBcIlwiKSA/IHRoaXMuYXVkaW8uc291cmNlLnNyYyA6IHRoaXMuYXVkaW8uc291cmNlLmNoaWxkcmVuWzBdLnNyYztcbiAgICAgICAgICAgICAgICB0aGlzLl9odG1sQXVkaW8ucHJlbG9hZCA9IFwiYXV0b1wiO1xuICAgICAgICAgICAgICAgIHRoaXMuX2h0bWxBdWRpby52b2x1bWUgPSAodGhpcy5hdWRpby5tdXRlZCB8fCB0aGlzLm11dGVkKSA/IDAgOiB0aGlzLmF1ZGlvLnZvbHVtZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9odG1sQXVkaW8ubG9hZCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2h0bWxBdWRpby5wbGF5KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RvcCgpOkF1ZGlvTGluZSB7XG4gICAgICAgICAgICBpZih0aGlzLm1hbmFnZXIuY29udGV4dCl7XG5cbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHRoaXMuX2h0bWxBdWRpby5wYXVzZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2h0bWxBdWRpby5jdXJyZW50VGltZSA9IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcGF1c2UoKTpBdWRpb0xpbmV7XG4gICAgICAgICAgICBpZih0aGlzLm1hbmFnZXIuY29udGV4dCl7XG5cbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHRoaXMuX2h0bWxBdWRpby5wYXVzZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5wYXVzZWQgPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICByZXN1bWUoKTpBdWRpb0xpbmV7XG4gICAgICAgICAgICBpZih0aGlzLnBhdXNlZCl7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5tYW5hZ2VyLmNvbnRleHQpe1xuXG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2h0bWxBdWRpby5wbGF5KCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5wYXVzZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgbXV0ZSgpOkF1ZGlvTGluZXtcbiAgICAgICAgICAgIHRoaXMubXV0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgaWYodGhpcy5tYW5hZ2VyLmNvbnRleHQpe1xuXG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICB0aGlzLl9odG1sQXVkaW8udm9sdW1lID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgdW5tdXRlKCk6QXVkaW9MaW5le1xuICAgICAgICAgICAgdGhpcy5tdXRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5tdXRlZCA9IHRydWU7XG4gICAgICAgICAgICBpZih0aGlzLm1hbmFnZXIuY29udGV4dCl7XG5cbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHRoaXMuX2h0bWxBdWRpby52b2x1bWUgPSB0aGlzLmF1ZGlvLnZvbHVtZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgdm9sdW1lKHZhbHVlOm51bWJlcik6QXVkaW9MaW5le1xuICAgICAgICAgICAgaWYodGhpcy5tYW5hZ2VyLmNvbnRleHQpe1xuXG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICB0aGlzLl9odG1sQXVkaW8udm9sdW1lID0gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc2V0KCk6QXVkaW9MaW5le1xuICAgICAgICAgICAgdGhpcy5hdmFpbGFibGUgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5hdWRpbyA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmxvb3AgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuY2FsbGJhY2sgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5wYXVzZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMubXV0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuX3dlYkF1ZGlvID0gbnVsbDtcblxuICAgICAgICAgICAgdGhpcy5zdGFydFRpbWUgPSAwO1xuICAgICAgICAgICAgdGhpcy5sYXN0UGF1c2VUaW1lID0gMDtcbiAgICAgICAgICAgIHRoaXMub2Zmc2V0VGltZSA9IDA7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX29uRW5kKCk6dm9pZHtcbiAgICAgICAgICAgIGlmKHRoaXMuY2FsbGJhY2spdGhpcy5jYWxsYmFjayh0aGlzLm1hbmFnZXIsIHRoaXMuYXVkaW8pO1xuXG4gICAgICAgICAgICBpZighdGhpcy5tYW5hZ2VyLmNvbnRleHQpe1xuICAgICAgICAgICAgICAgIGlmKHRoaXMubG9vcCB8fCB0aGlzLmF1ZGlvLmxvb3Ape1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9odG1sQXVkaW8uY3VycmVudFRpbWUgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9odG1sQXVkaW8ucGxheSgpO1xuICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfWVsc2UgaWYodGhpcy5tYW5hZ2VyLmNvbnRleHQgJiYgIXRoaXMucGF1c2VkKXtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59IiwibW9kdWxlIFBJWEkge1xuICAgIGV4cG9ydCBlbnVtIEdBTUVfU0NBTEVfVFlQRSB7XG4gICAgICAgIE5PTkUsXG4gICAgICAgIEZJTEwsXG4gICAgICAgIEFTUEVDVF9GSVQsXG4gICAgICAgIEFTUEVDVF9GSUxMXG4gICAgfVxuXG4gICAgZXhwb3J0IGVudW0gQVVESU9fVFlQRSB7XG4gICAgICAgIFVOS05PV04sXG4gICAgICAgIFdFQkFVRElPLFxuICAgICAgICBIVE1MQVVESU9cbiAgICB9XG59IiwiLy9NYW55IGNoZWNrcyBhcmUgYmFzZWQgb24gaHR0cHM6Ly9naXRodWIuY29tL2FyYXNhdGFzYXlnaW4vaXMuanMvYmxvYi9tYXN0ZXIvaXMuanNcblxubW9kdWxlIFBJWEkge1xuICAgIGV4cG9ydCBtb2R1bGUgRGV2aWNlIHtcbiAgICAgICAgdmFyIG5hdmlnYXRvcjpOYXZpZ2F0b3IgPSB3aW5kb3cubmF2aWdhdG9yO1xuICAgICAgICB2YXIgZG9jdW1lbnQ6RG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG5cbiAgICAgICAgdmFyIHVzZXJBZ2VudDpzdHJpbmcgPSAnbmF2aWdhdG9yJyBpbiB3aW5kb3cgJiYgJ3VzZXJBZ2VudCcgaW4gbmF2aWdhdG9yICYmIG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKSB8fCAnJyxcbiAgICAgICAgICAgIHZlbmRvcjpzdHJpbmcgPSAnbmF2aWdhdG9yJyBpbiB3aW5kb3cgJiYgJ3ZlbmRvcicgaW4gbmF2aWdhdG9yICYmIG5hdmlnYXRvci52ZW5kb3IudG9Mb3dlckNhc2UoKSB8fCAnJyxcbiAgICAgICAgICAgIGFwcFZlcnNpb246c3RyaW5nID0gJ25hdmlnYXRvcicgaW4gd2luZG93ICYmICdhcHBWZXJzaW9uJyBpbiBuYXZpZ2F0b3IgJiYgbmF2aWdhdG9yLmFwcFZlcnNpb24udG9Mb3dlckNhc2UoKSB8fCAnJztcblxuICAgICAgICAvL0Jyb3dzZXJzXG4gICAgICAgIGV4cG9ydCB2YXIgaXNDaHJvbWU6Ym9vbGVhbiA9IC9jaHJvbWV8Y2hyb21pdW0vaS50ZXN0KHVzZXJBZ2VudCkgJiYgL2dvb2dsZSBpbmMvLnRlc3QodmVuZG9yKSxcbiAgICAgICAgICAgIGlzRmlyZWZveDpib29sZWFuID0gL2ZpcmVmb3gvaS50ZXN0KHVzZXJBZ2VudCksXG4gICAgICAgICAgICBpc0lFOmJvb2xlYW4gPSAvbXNpZS9pLnRlc3QodXNlckFnZW50KSB8fCBcIkFjdGl2ZVhPYmplY3RcIiBpbiB3aW5kb3csXG4gICAgICAgICAgICBpc09wZXJhOmJvb2xlYW4gPSAvXk9wZXJhXFwvLy50ZXN0KHVzZXJBZ2VudCkgfHwgL1xceDIwT1BSXFwvLy50ZXN0KHVzZXJBZ2VudCksXG4gICAgICAgICAgICBpc1NhZmFyaTpib29sZWFuID0gL3NhZmFyaS9pLnRlc3QodXNlckFnZW50KSAmJiAvYXBwbGUgY29tcHV0ZXIvaS50ZXN0KHZlbmRvcik7XG5cbiAgICAgICAgLy9EZXZpY2VzICYmIE9TXG4gICAgICAgIGV4cG9ydCB2YXIgaXNJcGhvbmU6Ym9vbGVhbiA9IC9pcGhvbmUvaS50ZXN0KHVzZXJBZ2VudCksXG4gICAgICAgICAgICBpc0lwYWQ6Ym9vbGVhbiA9IC9pcGFkL2kudGVzdCh1c2VyQWdlbnQpLFxuICAgICAgICAgICAgaXNJcG9kOmJvb2xlYW4gPSAvaXBvZC9pLnRlc3QodXNlckFnZW50KSxcbiAgICAgICAgICAgIGlzQW5kcm9pZDpib29sZWFuID0gL2FuZHJvaWQvaS50ZXN0KHVzZXJBZ2VudCksXG4gICAgICAgICAgICBpc0FuZHJvaWRQaG9uZTpib29sZWFuID0gL2FuZHJvaWQvaS50ZXN0KHVzZXJBZ2VudCkgJiYgL21vYmlsZS9pLnRlc3QodXNlckFnZW50KSxcbiAgICAgICAgICAgIGlzQW5kcm9pZFRhYmxldDpib29sZWFuID0gL2FuZHJvaWQvaS50ZXN0KHVzZXJBZ2VudCkgJiYgIS9tb2JpbGUvaS50ZXN0KHVzZXJBZ2VudCksXG4gICAgICAgICAgICBpc0xpbnV4OmJvb2xlYW4gPSAvbGludXgvaS50ZXN0KGFwcFZlcnNpb24pLFxuICAgICAgICAgICAgaXNNYWM6Ym9vbGVhbiA9IC9tYWMvaS50ZXN0KGFwcFZlcnNpb24pLFxuICAgICAgICAgICAgaXNXaW5kb3c6Ym9vbGVhbiA9IC93aW4vaS50ZXN0KGFwcFZlcnNpb24pLFxuICAgICAgICAgICAgaXNXaW5kb3dQaG9uZTpib29sZWFuID0gaXNXaW5kb3cgJiYgL3Bob25lL2kudGVzdCh1c2VyQWdlbnQpLFxuICAgICAgICAgICAgaXNXaW5kb3dUYWJsZXQ6Ym9vbGVhbiA9IGlzV2luZG93ICYmICFpc1dpbmRvd1Bob25lICYmIC90b3VjaC9pLnRlc3QodXNlckFnZW50KSxcbiAgICAgICAgICAgIGlzTW9iaWxlOmJvb2xlYW4gPSBpc0lwaG9uZSB8fCBpc0lwb2R8fCBpc0FuZHJvaWRQaG9uZSB8fCBpc1dpbmRvd1Bob25lLFxuICAgICAgICAgICAgaXNUYWJsZXQ6Ym9vbGVhbiA9IGlzSXBhZCB8fCBpc0FuZHJvaWRUYWJsZXQgfHwgaXNXaW5kb3dUYWJsZXQsXG4gICAgICAgICAgICBpc0Rlc2t0b3A6Ym9vbGVhbiA9ICFpc01vYmlsZSAmJiAhaXNUYWJsZXQsXG4gICAgICAgICAgICBpc1RvdWNoRGV2aWNlOmJvb2xlYW4gPSAnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cgfHwnRG9jdW1lbnRUb3VjaCcgaW4gd2luZG93ICYmIGRvY3VtZW50IGluc3RhbmNlb2YgRG9jdW1lbnRUb3VjaCxcbiAgICAgICAgICAgIGlzQ29jb29uOmJvb2xlYW4gPSAhIW5hdmlnYXRvci5pc0NvY29vbkpTLFxuICAgICAgICAgICAgaXNOb2RlV2Via2l0OmJvb2xlYW4gPSAhISh0eXBlb2YgcHJvY2VzcyA9PT0gXCJvYmplY3RcIiAmJiBwcm9jZXNzLnRpdGxlID09PSBcIm5vZGVcIiAmJiB0eXBlb2YgZ2xvYmFsID09PSBcIm9iamVjdFwiKSxcbiAgICAgICAgICAgIGlzRWplY3RhOmJvb2xlYW4gPSAhIXdpbmRvdy5lamVjdGEsXG4gICAgICAgICAgICBpc0Nyb3Nzd2Fsazpib29sZWFuID0gL0Nyb3Nzd2Fsay8udGVzdCh1c2VyQWdlbnQpLFxuICAgICAgICAgICAgaXNDb3Jkb3ZhOmJvb2xlYW4gPSAhIXdpbmRvdy5jb3Jkb3ZhLFxuICAgICAgICAgICAgaXNFbGVjdHJvbjpib29sZWFuID0gISEodHlwZW9mIHByb2Nlc3MgPT09IFwib2JqZWN0XCIgJiYgcHJvY2Vzcy52ZXJzaW9ucyAmJiAocHJvY2Vzcy52ZXJzaW9ucy5lbGVjdHJvbiB8fCBwcm9jZXNzLnZlcnNpb25zWydhdG9tLXNoZWxsJ10pKTtcblxuICAgICAgICBleHBvcnQgdmFyIGlzVmlicmF0ZVN1cHBvcnRlZDpib29sZWFuID0gISFuYXZpZ2F0b3IudmlicmF0ZSAmJiAoaXNNb2JpbGUgfHwgaXNUYWJsZXQpLFxuICAgICAgICAgICAgaXNNb3VzZVdoZWVsU3VwcG9ydGVkOmJvb2xlYW4gPSAnb253aGVlbCcgaW4gd2luZG93IHx8ICdvbm1vdXNld2hlZWwnIGluIHdpbmRvdyB8fCAnTW91c2VTY3JvbGxFdmVudCcgaW4gd2luZG93LFxuICAgICAgICAgICAgaXNBY2NlbGVyb21ldGVyU3VwcG9ydGVkOmJvb2xlYW4gPSAnRGV2aWNlTW90aW9uRXZlbnQnIGluIHdpbmRvdyxcbiAgICAgICAgICAgIGlzR2FtZXBhZFN1cHBvcnRlZDpib29sZWFuID0gISFuYXZpZ2F0b3IuZ2V0R2FtZXBhZHMgfHwgISFuYXZpZ2F0b3Iud2Via2l0R2V0R2FtZXBhZHM7XG5cbiAgICAgICAgLy9GdWxsU2NyZWVuXG4gICAgICAgIHZhciBkaXY6SFRNTERpdkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdmFyIGZ1bGxTY3JlZW5SZXF1ZXN0VmVuZG9yOmFueSA9IGRpdi5yZXF1ZXN0RnVsbHNjcmVlbiB8fCBkaXYud2Via2l0UmVxdWVzdEZ1bGxTY3JlZW4gfHwgZGl2Lm1zUmVxdWVzdEZ1bGxTY3JlZW4gfHwgZGl2Lm1velJlcXVlc3RGdWxsU2NyZWVuLFxuICAgICAgICAgICAgZnVsbFNjcmVlbkNhbmNlbFZlbmRvcjphbnkgPSBkb2N1bWVudC5jYW5jZWxGdWxsU2NyZWVuIHx8IGRvY3VtZW50LmV4aXRGdWxsU2NyZWVuIHx8IGRvY3VtZW50LndlYmtpdENhbmNlbEZ1bGxTY3JlZW4gfHwgZG9jdW1lbnQubXNDYW5jZWxGdWxsU2NyZWVuIHx8IGRvY3VtZW50Lm1vekNhbmNlbEZ1bGxTY3JlZW47XG5cbiAgICAgICAgZXhwb3J0IHZhciBpc0Z1bGxTY3JlZW5TdXBwb3J0ZWQ6Ym9vbGVhbiA9ICEhKGZ1bGxTY3JlZW5SZXF1ZXN0ICYmIGZ1bGxTY3JlZW5DYW5jZWwpLFxuICAgICAgICAgICAgZnVsbFNjcmVlblJlcXVlc3Q6c3RyaW5nID0gKGZ1bGxTY3JlZW5SZXF1ZXN0VmVuZG9yKSA/IGZ1bGxTY3JlZW5SZXF1ZXN0VmVuZG9yLm5hbWUgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBmdWxsU2NyZWVuQ2FuY2VsOnN0cmluZyA9IChmdWxsU2NyZWVuQ2FuY2VsVmVuZG9yKSA/IGZ1bGxTY3JlZW5DYW5jZWxWZW5kb3IubmFtZSA6IHVuZGVmaW5lZDtcblxuICAgICAgICAvL0F1ZGlvXG4gICAgICAgIGV4cG9ydCB2YXIgaXNIVE1MQXVkaW9TdXBwb3J0ZWQ6Ym9vbGVhbiA9ICEhd2luZG93LkF1ZGlvLFxuICAgICAgICAgICAgd2ViQXVkaW9Db250ZXh0OmFueSA9IHdpbmRvdy5BdWRpb0NvbnRleHQgfHwgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dCxcbiAgICAgICAgICAgIGlzV2ViQXVkaW9TdXBwb3J0ZWQ6Ym9vbGVhbiA9ICEhd2ViQXVkaW9Db250ZXh0LFxuICAgICAgICAgICAgaXNBdWRpb1N1cHBvcnRlZDpib29sZWFuID0gaXNXZWJBdWRpb1N1cHBvcnRlZCB8fCBpc0hUTUxBdWRpb1N1cHBvcnRlZCxcbiAgICAgICAgICAgIGlzTXAzU3VwcG9ydGVkOmJvb2xlYW4gPSBmYWxzZSxcbiAgICAgICAgICAgIGlzT2dnU3VwcG9ydGVkOmJvb2xlYW4gPSBmYWxzZSxcbiAgICAgICAgICAgIGlzV2F2U3VwcG9ydGVkOmJvb2xlYW4gPSBmYWxzZSxcbiAgICAgICAgICAgIGlzTTRhU3VwcG9ydGVkOmJvb2xlYW4gPSBmYWxzZSxcbiAgICAgICAgICAgIGdsb2JhbFdlYkF1ZGlvQ29udGV4dDpBdWRpb0NvbnRleHQgPSAoaXNXZWJBdWRpb1N1cHBvcnRlZCkgPyBuZXcgd2ViQXVkaW9Db250ZXh0KCkgOiB1bmRlZmluZWQ7XG5cbiAgICAgICAgLy9BdWRpbyBtaW1lVHlwZXNcbiAgICAgICAgaWYoaXNBdWRpb1N1cHBvcnRlZCl7XG4gICAgICAgICAgICB2YXIgYXVkaW86SFRNTEF1ZGlvRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2F1ZGlvJyk7XG4gICAgICAgICAgICBpc01wM1N1cHBvcnRlZCA9IGF1ZGlvLmNhblBsYXlUeXBlKCdhdWRpby9tcGVnOycpICE9PSBcIlwiO1xuICAgICAgICAgICAgaXNPZ2dTdXBwb3J0ZWQgPSBhdWRpby5jYW5QbGF5VHlwZSgnYXVkaW8vb2dnOyBjb2RlY3M9XCJ2b3JiaXNcIicpICE9PSBcIlwiO1xuICAgICAgICAgICAgaXNXYXZTdXBwb3J0ZWQgPSBhdWRpby5jYW5QbGF5VHlwZSgnYXVkaW8vd2F2JykgIT09IFwiXCI7XG4gICAgICAgICAgICBpc000YVN1cHBvcnRlZCA9IGF1ZGlvLmNhblBsYXlUeXBlKCdhdWRpby9tcDQ7IGNvZGVjcz1cIm1wNGEuNDAuNVwiJykgIT09IFwiXCI7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gZ2V0TW91c2VXaGVlbEV2ZW50KCk6c3RyaW5ne1xuICAgICAgICAgICAgaWYoIWlzTW91c2VXaGVlbFN1cHBvcnRlZClyZXR1cm47XG4gICAgICAgICAgICB2YXIgZXZ0OnN0cmluZztcbiAgICAgICAgICAgIGlmKCdvbndoZWVsJyBpbiB3aW5kb3cpe1xuICAgICAgICAgICAgICAgIGV2dCA9ICd3aGVlbCc7XG4gICAgICAgICAgICB9ZWxzZSBpZignb25tb3VzZXdoZWVsJyBpbiB3aW5kb3cpe1xuICAgICAgICAgICAgICAgIGV2dCA9ICdtb3VzZXdoZWVsJztcbiAgICAgICAgICAgIH1lbHNlIGlmKCdNb3VzZVNjcm9sbEV2ZW50JyBpbiB3aW5kb3cpe1xuICAgICAgICAgICAgICAgIGV2dCA9ICdET01Nb3VzZVNjcm9sbCc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBldnQ7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gdmlicmF0ZShwYXR0ZXJuOiBudW1iZXIgfCBudW1iZXJbXSk6dm9pZHtcbiAgICAgICAgICAgIGlmKGlzVmlicmF0ZVN1cHBvcnRlZCl7XG4gICAgICAgICAgICAgICAgbmF2aWdhdG9yLnZpYnJhdGUocGF0dGVybik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gZ2V0VmlzaWJpbGl0eUNoYW5nZUV2ZW50KCk6c3RyaW5ne1xuICAgICAgICAgICAgaWYodHlwZW9mIGRvY3VtZW50LmhpZGRlbiAhPT0gJ3VuZGVmaW5lZCcpe1xuICAgICAgICAgICAgICAgIHJldHVybiAndmlzaWJpbGl0eWNoYW5nZSc7XG4gICAgICAgICAgICB9ZWxzZSBpZih0eXBlb2YgZG9jdW1lbnQud2Via2l0SGlkZGVuICE9PSAndW5kZWZpbmVkJyl7XG4gICAgICAgICAgICAgICAgcmV0dXJuICd3ZWJraXR2aXNpYmlsaXR5Y2hhbmdlJztcbiAgICAgICAgICAgIH1lbHNlIGlmKHR5cGVvZiBkb2N1bWVudC5tb3pIaWRkZW4gIT09ICd1bmRlZmluZWQnKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ21venZpc2liaWxpdHljaGFuZ2UnO1xuICAgICAgICAgICAgfWVsc2UgaWYodHlwZW9mIGRvY3VtZW50Lm1zSGlkZGVuICE9PSAndW5kZWZpbmVkJyl7XG4gICAgICAgICAgICAgICAgcmV0dXJuICdtc3Zpc2liaWxpdHljaGFuZ2UnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIGlzT25saW5lKCk6Ym9vbGVhbntcbiAgICAgICAgICAgIHJldHVybiB3aW5kb3cubmF2aWdhdG9yLm9uTGluZTtcbiAgICAgICAgfVxuXG5cbiAgICB9XG59XG5cbmRlY2xhcmUgdmFyIHByb2Nlc3M6YW55LFxuICAgIERvY3VtZW50VG91Y2g6YW55LFxuICAgIGdsb2JhbDphbnk7XG5cbmludGVyZmFjZSBOYXZpZ2F0b3Ige1xuICAgIGlzQ29jb29uSlM6YW55O1xuICAgIHZpYnJhdGUocGF0dGVybjogbnVtYmVyIHwgbnVtYmVyW10pOmJvb2xlYW47XG4gICAgZ2V0R2FtZXBhZHMoKTphbnk7XG4gICAgd2Via2l0R2V0R2FtZXBhZHMoKTphbnk7XG59XG5cbmludGVyZmFjZSBXaW5kb3cge1xuICAgIGVqZWN0YTphbnk7XG4gICAgY29yZG92YTphbnk7XG4gICAgQXVkaW8oKTpIVE1MQXVkaW9FbGVtZW50O1xuICAgIEF1ZGlvQ29udGV4dCgpOmFueTtcbiAgICB3ZWJraXRBdWRpb0NvbnRleHQoKTphbnk7XG59XG5cbmludGVyZmFjZSBmdWxsU2NyZWVuRGF0YSB7XG4gICAgbmFtZTpzdHJpbmc7XG59XG5cbmludGVyZmFjZSBEb2N1bWVudCB7XG4gICAgY2FuY2VsRnVsbFNjcmVlbigpOmZ1bGxTY3JlZW5EYXRhIDtcbiAgICBleGl0RnVsbFNjcmVlbigpOmZ1bGxTY3JlZW5EYXRhIDtcbiAgICB3ZWJraXRDYW5jZWxGdWxsU2NyZWVuKCk6ZnVsbFNjcmVlbkRhdGEgO1xuICAgIG1zQ2FuY2VsRnVsbFNjcmVlbigpOmZ1bGxTY3JlZW5EYXRhIDtcbiAgICBtb3pDYW5jZWxGdWxsU2NyZWVuKCk6ZnVsbFNjcmVlbkRhdGEgO1xuICAgIHdlYmtpdEhpZGRlbjphbnk7XG4gICAgbW96SGlkZGVuOmFueTtcbn1cblxuaW50ZXJmYWNlIEhUTUxEaXZFbGVtZW50IHtcbiAgICByZXF1ZXN0RnVsbHNjcmVlbigpOmZ1bGxTY3JlZW5EYXRhIDtcbiAgICB3ZWJraXRSZXF1ZXN0RnVsbFNjcmVlbigpOmZ1bGxTY3JlZW5EYXRhIDtcbiAgICBtc1JlcXVlc3RGdWxsU2NyZWVuKCk6ZnVsbFNjcmVlbkRhdGEgO1xuICAgIG1velJlcXVlc3RGdWxsU2NyZWVuKCk6ZnVsbFNjcmVlbkRhdGEgO1xufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2RlZnMvcGl4aS5qcy5kLnRzXCIgLz5cbm1vZHVsZSBQSVhJIHtcbiAgICBleHBvcnQgY2xhc3MgU2NlbmUgZXh0ZW5kcyBDb250YWluZXIge1xuICAgICAgICBpZDpzdHJpbmc7XG4gICAgICAgIHN0YXRpYyBfaWRMZW46bnVtYmVyID0gMDtcblxuICAgICAgICBjb25zdHJ1Y3RvcihpZDpzdHJpbmcgPSAoXCJzY2VuZVwiICsgU2NlbmUuX2lkTGVuKyspICl7XG4gICAgICAgICAgICBzdXBlcigpO1xuICAgICAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICB9XG5cbiAgICAgICAgYWRkVG8oZ2FtZTpHYW1lfENvbnRhaW5lcik6U2NlbmUge1xuICAgICAgICAgICAgaWYoZ2FtZSBpbnN0YW5jZW9mIEdhbWUpe1xuICAgICAgICAgICAgICAgIDxHYW1lPmdhbWUuYWRkU2NlbmUodGhpcyk7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NjZW5lcyBjYW4gb25seSBiZSBhZGRlZCB0byB0aGUgZ2FtZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICB9XG59IiwibW9kdWxlIFBJWEkge1xuICAgIGV4cG9ydCBjbGFzcyBJbnB1dE1hbmFnZXJ7XG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZ2FtZTogR2FtZSl7XG5cbiAgICAgICAgfVxuICAgIH1cbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9kZWZzL3BpeGkuanMuZC50c1wiIC8+XG5tb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IGZ1bmN0aW9uIGJpdG1hcEZvbnRQYXJzZXJUWFQoKTpGdW5jdGlvbntcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHJlc291cmNlOiBsb2FkZXJzLlJlc291cmNlLCBuZXh0OkZ1bmN0aW9uKTp2b2lke1xuXG4gICAgICAgICAgICAvL3NraXAgaWYgbm8gZGF0YSBvciBpZiBub3QgdHh0XG4gICAgICAgICAgICBpZighcmVzb3VyY2UuZGF0YSB8fCAocmVzb3VyY2UueGhyVHlwZSAhPT0gXCJ0ZXh0XCIgJiYgcmVzb3VyY2UueGhyVHlwZSAhPT0gXCJkb2N1bWVudFwiKSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5leHQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHRleHQ6c3RyaW5nID0gKHJlc291cmNlLnhoclR5cGUgPT09IFwidGV4dFwiKSA/IHJlc291cmNlLmRhdGEgOiByZXNvdXJjZS54aHIucmVzcG9uc2VUZXh0O1xuXG4gICAgICAgICAgICAvL3NraXAgaWYgbm90IGEgYml0bWFwIGZvbnQgZGF0YVxuICAgICAgICAgICAgaWYoIHRleHQuaW5kZXhPZihcInBhZ2VcIikgPT09IC0xIHx8XG4gICAgICAgICAgICAgICAgdGV4dC5pbmRleE9mKFwiZmFjZVwiKSA9PT0gLTEgfHxcbiAgICAgICAgICAgICAgICB0ZXh0LmluZGV4T2YoXCJpbmZvXCIpID09PSAtMSB8fFxuICAgICAgICAgICAgICAgIHRleHQuaW5kZXhPZihcImNoYXJcIikgPT09IC0xICl7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gbmV4dCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgdXJsOnN0cmluZyA9IGRpcm5hbWUocmVzb3VyY2UudXJsKTtcbiAgICAgICAgICAgIGlmKHVybCA9PT0gXCIuXCIpe1xuICAgICAgICAgICAgICAgIHVybCA9IFwiXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKHRoaXMuYmFzZVVybCAmJiB1cmwpe1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuYmFzZVVybC5jaGFyQXQodGhpcy5iYXNlVXJsLmxlbmd0aC0xKT09PSAnLycpe1xuICAgICAgICAgICAgICAgICAgICB1cmwgKz0gJy8nO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHVybC5yZXBsYWNlKHRoaXMuYmFzZVVybCwgJycpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZih1cmwgJiYgdXJsLmNoYXJBdCh1cmwubGVuZ3RoIC0gMSkgIT09ICcvJyl7XG4gICAgICAgICAgICAgICAgdXJsICs9ICcvJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHRleHR1cmVVcmw6c3RyaW5nID0gZ2V0VGV4dHVyZVVybCh1cmwsIHRleHQpO1xuICAgICAgICAgICAgaWYodXRpbHMuVGV4dHVyZUNhY2hlW3RleHR1cmVVcmxdKXtcbiAgICAgICAgICAgICAgICBwYXJzZShyZXNvdXJjZSwgdXRpbHMuVGV4dHVyZUNhY2hlW3RleHR1cmVVcmxdKTtcbiAgICAgICAgICAgICAgICBuZXh0KCk7XG4gICAgICAgICAgICB9ZWxzZXtcblxuICAgICAgICAgICAgICAgIHZhciBsb2FkT3B0aW9uczphbnkgPSB7XG4gICAgICAgICAgICAgICAgICAgIGNyb3NzT3JpZ2luOiByZXNvdXJjZS5jcm9zc09yaWdpbixcbiAgICAgICAgICAgICAgICAgICAgbG9hZFR5cGU6IGxvYWRlcnMuUmVzb3VyY2UuTE9BRF9UWVBFLklNQUdFXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHRoaXMuYWRkKHJlc291cmNlLm5hbWUgKyAnX2ltYWdlJywgdGV4dHVyZVVybCwgbG9hZE9wdGlvbnMsIGZ1bmN0aW9uKHJlczphbnkpe1xuICAgICAgICAgICAgICAgICAgICBwYXJzZShyZXNvdXJjZSwgcmVzLnRleHR1cmUpO1xuICAgICAgICAgICAgICAgICAgICBuZXh0KCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICBuZXh0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZShyZXNvdXJjZTpsb2FkZXJzLlJlc291cmNlLCB0ZXh0dXJlOlRleHR1cmUpe1xuICAgICAgICB2YXIgY3VycmVudExpbmU6c3RyaW5nLCBhdHRyOmF0dHJEYXRhLFxuICAgICAgICAgICAgZGF0YTpmb250RGF0YSA9IHtcbiAgICAgICAgICAgICAgICBjaGFycyA6IHt9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIHZhciB0ZXh0OnN0cmluZyA9IChyZXNvdXJjZS54aHJUeXBlID09PSBcInRleHRcIikgPyByZXNvdXJjZS5kYXRhIDogcmVzb3VyY2UueGhyLnJlc3BvbnNlVGV4dDtcbiAgICAgICAgdmFyIGxpbmVzOnN0cmluZ1tdID0gdGV4dC5zcGxpdCgnXFxuJyk7XG5cbiAgICAgICAgZm9yKHZhciBpOm51bWJlciA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICBpZihsaW5lc1tpXS5pbmRleE9mKFwiaW5mb1wiKSA9PT0gMCl7XG4gICAgICAgICAgICAgICAgY3VycmVudExpbmUgPSBsaW5lc1tpXS5zdWJzdHJpbmcoNSk7XG4gICAgICAgICAgICAgICAgYXR0ciA9IGdldEF0dHIoY3VycmVudExpbmUpO1xuXG4gICAgICAgICAgICAgICAgZGF0YS5mb250ID0gYXR0ci5mYWNlO1xuICAgICAgICAgICAgICAgIGRhdGEuc2l6ZSA9IHBhcnNlSW50KGF0dHIuc2l6ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKGxpbmVzW2ldLmluZGV4T2YoJ2NvbW1vbiAnKSA9PT0gMCl7XG4gICAgICAgICAgICAgICAgY3VycmVudExpbmUgPSBsaW5lc1tpXS5zdWJzdHJpbmcoNyk7XG4gICAgICAgICAgICAgICAgYXR0ciA9IGdldEF0dHIoY3VycmVudExpbmUpO1xuICAgICAgICAgICAgICAgIGRhdGEubGluZUhlaWdodCA9IHBhcnNlSW50KGF0dHIubGluZUhlaWdodCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKGxpbmVzW2ldLmluZGV4T2YoXCJjaGFyIFwiKSA9PT0gMCl7XG4gICAgICAgICAgICAgICAgY3VycmVudExpbmUgPSBsaW5lc1tpXS5zdWJzdHJpbmcoNSk7XG4gICAgICAgICAgICAgICAgYXR0ciA9IGdldEF0dHIoY3VycmVudExpbmUpO1xuICAgICAgICAgICAgICAgIHZhciBjaGFyQ29kZTpudW1iZXIgPSBwYXJzZUludChhdHRyLmlkKTtcblxuICAgICAgICAgICAgICAgIHZhciB0ZXh0dXJlUmVjdDpSZWN0YW5nbGUgPSBuZXcgUmVjdGFuZ2xlKFxuICAgICAgICAgICAgICAgICAgICBwYXJzZUludChhdHRyLngpLFxuICAgICAgICAgICAgICAgICAgICBwYXJzZUludChhdHRyLnkpLFxuICAgICAgICAgICAgICAgICAgICBwYXJzZUludChhdHRyLndpZHRoKSxcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VJbnQoYXR0ci5oZWlnaHQpXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIGRhdGEuY2hhcnNbY2hhckNvZGVdID0ge1xuICAgICAgICAgICAgICAgICAgICB4T2Zmc2V0OiBwYXJzZUludChhdHRyLnhvZmZzZXQpLFxuICAgICAgICAgICAgICAgICAgICB5T2Zmc2V0OiBwYXJzZUludChhdHRyLnlvZmZzZXQpLFxuICAgICAgICAgICAgICAgICAgICB4QWR2YW5jZTogcGFyc2VJbnQoYXR0ci54YWR2YW5jZSksXG4gICAgICAgICAgICAgICAgICAgIGtlcm5pbmc6IHt9LFxuICAgICAgICAgICAgICAgICAgICB0ZXh0dXJlOiBuZXcgVGV4dHVyZSh0ZXh0dXJlLmJhc2VUZXh0dXJlLCB0ZXh0dXJlUmVjdClcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihsaW5lc1tpXS5pbmRleE9mKCdrZXJuaW5nICcpID09PSAwKXtcbiAgICAgICAgICAgICAgICBjdXJyZW50TGluZSA9IGxpbmVzW2ldLnN1YnN0cmluZyg4KTtcbiAgICAgICAgICAgICAgICBhdHRyID0gZ2V0QXR0cihjdXJyZW50TGluZSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgZmlyc3QgPSBwYXJzZUludChhdHRyLmZpcnN0KTtcbiAgICAgICAgICAgICAgICB2YXIgc2Vjb25kID0gcGFyc2VJbnQoYXR0ci5zZWNvbmQpO1xuXG4gICAgICAgICAgICAgICAgZGF0YS5jaGFyc1tzZWNvbmRdLmtlcm5pbmdbZmlyc3RdID0gcGFyc2VJbnQoYXR0ci5hbW91bnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmVzb3VyY2UuYml0bWFwRm9udCA9IGRhdGE7XG4gICAgICAgIGV4dHJhcy5CaXRtYXBUZXh0LmZvbnRzW2RhdGEuZm9udF0gPSBkYXRhO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRpcm5hbWUocGF0aDpzdHJpbmcpOnN0cmluZ3tcbiAgICAgICAgcmV0dXJuIHBhdGgucmVwbGFjZSgvXFxcXC9nLCcvJykucmVwbGFjZSgvXFwvW15cXC9dKiQvLCAnJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0VGV4dHVyZVVybCh1cmw6c3RyaW5nLCBkYXRhOnN0cmluZyk6c3RyaW5ne1xuICAgICAgICB2YXIgdGV4dHVyZVVybDpzdHJpbmc7XG4gICAgICAgIHZhciBsaW5lczpzdHJpbmdbXSA9IGRhdGEuc3BsaXQoJ1xcbicpO1xuXG4gICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgaWYobGluZXNbaV0uaW5kZXhPZihcInBhZ2VcIikgPT09IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudExpbmU6c3RyaW5nID0gbGluZXNbaV0uc3Vic3RyaW5nKDUpO1xuICAgICAgICAgICAgICAgIHZhciBmaWxlOnN0cmluZyA9IChjdXJyZW50TGluZS5zdWJzdHJpbmcoY3VycmVudExpbmUuaW5kZXhPZignZmlsZT0nKSkpLnNwbGl0KCc9JylbMV07XG4gICAgICAgICAgICAgICAgdGV4dHVyZVVybCA9IHVybCArIGZpbGUuc3Vic3RyKDEsIGZpbGUubGVuZ3RoLTIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRleHR1cmVVcmw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0QXR0cihsaW5lOnN0cmluZyk6YXR0ckRhdGF7XG4gICAgICAgIHZhciByZWdleDpSZWdFeHAgPSAvXCIoXFx3KlxcZCpcXHMqKC18XykqKSpcIi9nLFxuICAgICAgICAgICAgYXR0cjpzdHJpbmdbXSA9IGxpbmUuc3BsaXQoL1xccysvZyksXG4gICAgICAgICAgICBkYXRhOmFueSA9IHt9O1xuXG4gICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgYXR0ci5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICB2YXIgZDpzdHJpbmdbXSA9IGF0dHJbaV0uc3BsaXQoJz0nKTtcbiAgICAgICAgICAgIHZhciBtOlJlZ0V4cE1hdGNoQXJyYXkgPSBkWzFdLm1hdGNoKHJlZ2V4KTtcbiAgICAgICAgICAgIGlmKG0gJiYgbS5sZW5ndGggPj0gMSl7XG4gICAgICAgICAgICAgICAgZFsxXSA9IGRbMV0uc3Vic3RyKDEsIGRbMV0ubGVuZ3RoLTIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGF0YVtkWzBdXSA9IGRbMV07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gPGF0dHJEYXRhPmRhdGE7XG4gICAgfVxuXG4gICAgaW50ZXJmYWNlIGZvbnREYXRhIHtcbiAgICAgICAgY2hhcnM/IDogYW55O1xuICAgICAgICBmb250PyA6IHN0cmluZztcbiAgICAgICAgc2l6ZT8gOiBudW1iZXI7XG4gICAgICAgIGxpbmVIZWlnaHQ/IDogbnVtYmVyO1xuICAgIH1cblxuICAgIGludGVyZmFjZSBhdHRyRGF0YSB7XG4gICAgICAgIGZhY2U/IDogc3RyaW5nO1xuICAgICAgICBzaXplPyA6IHN0cmluZztcbiAgICAgICAgbGluZUhlaWdodD8gOiBzdHJpbmc7XG4gICAgICAgIGlkPyA6IHN0cmluZztcbiAgICAgICAgeD8gOiBzdHJpbmc7XG4gICAgICAgIHk/IDogc3RyaW5nO1xuICAgICAgICB3aWR0aD8gOiBzdHJpbmc7XG4gICAgICAgIGhlaWdodD8gOiBzdHJpbmc7XG4gICAgICAgIHhvZmZzZXQ/IDogc3RyaW5nO1xuICAgICAgICB5b2Zmc2V0PyA6IHN0cmluZztcbiAgICAgICAgeGFkdmFuY2U/IDogc3RyaW5nO1xuICAgICAgICBmaXJzdD8gOiBzdHJpbmc7XG4gICAgICAgIHNlY29uZD8gOiBzdHJpbmc7XG4gICAgICAgIGFtb3VudD8gOiBzdHJpbmc7XG4gICAgfVxufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL2F1ZGlvL0F1ZGlvTWFuYWdlci50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9BdWRpby9BdWRpby50c1wiIC8+XG5tb2R1bGUgUElYSSB7XG4gICAgdmFyIF9hbGxvd2VkRXh0OnN0cmluZ1tdID0gW1wibTRhXCIsIFwib2dnXCIsIFwibXAzXCIsIFwid2F2XCJdO1xuXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGF1ZGlvUGFyc2VyKCk6RnVuY3Rpb24ge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24ocmVzb3VyY2U6bG9hZGVycy5SZXNvdXJjZSwgbmV4dDpGdW5jdGlvbik6dm9pZHtcbiAgICAgICAgICAgIGlmKCFEZXZpY2UuaXNBdWRpb1N1cHBvcnRlZCB8fCAhcmVzb3VyY2UuZGF0YSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5leHQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGV4dDpzdHJpbmcgPSBfZ2V0RXh0KHJlc291cmNlLnVybCk7XG5cbiAgICAgICAgICAgIGlmKF9hbGxvd2VkRXh0LmluZGV4T2YoZXh0KSA9PT0gLTEpe1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXh0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKCFfY2FuUGxheShleHQpKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV4dCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgbmFtZTpzdHJpbmcgPSByZXNvdXJjZS5uYW1lIHx8IHJlc291cmNlLnVybDtcbiAgICAgICAgICAgIGlmKHV0aWxzLl9hdWRpb1R5cGVTZWxlY3RlZCA9PT0gQVVESU9fVFlQRS5XRUJBVURJTyl7XG4gICAgICAgICAgICAgICAgRGV2aWNlLmdsb2JhbFdlYkF1ZGlvQ29udGV4dC5kZWNvZGVBdWRpb0RhdGEocmVzb3VyY2UuZGF0YSwgX2FkZFRvQ2FjaGUuYmluZCh0aGlzLCBuZXh0LCBuYW1lKSk7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICByZXR1cm4gX2FkZFRvQ2FjaGUobmV4dCwgbmFtZSwgcmVzb3VyY2UuZGF0YSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGV4cG9ydCBmdW5jdGlvbiBhdWRpb1BhcnNlclVybChyZXNvdXJjZVVybDpzdHJpbmdbXSk6c3RyaW5ne1xuICAgICAgICB2YXIgZXh0OnN0cmluZztcbiAgICAgICAgdmFyIHVybDpzdHJpbmc7XG4gICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgcmVzb3VyY2VVcmwubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgZXh0ID0gX2dldEV4dChyZXNvdXJjZVVybFtpXSk7XG5cbiAgICAgICAgICAgIGlmKF9hbGxvd2VkRXh0LmluZGV4T2YoZXh0KSA9PT0gLTEpe1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihfY2FuUGxheShleHQpKXtcbiAgICAgICAgICAgICAgICB1cmwgPSByZXNvdXJjZVVybFtpXTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB1cmw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2FkZFRvQ2FjaGUobmV4dDpGdW5jdGlvbiwgbmFtZTpzdHJpbmcsIGRhdGE6YW55KXtcbiAgICAgICAgdXRpbHMuQXVkaW9DYWNoZVtuYW1lXSA9IG5ldyBBdWRpbyhkYXRhLCBuYW1lKTtcbiAgICAgICAgcmV0dXJuIG5leHQoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfZ2V0RXh0KHVybDpzdHJpbmcpOnN0cmluZ3tcbiAgICAgICAgcmV0dXJuIHVybC5zcGxpdCgnPycpLnNoaWZ0KCkuc3BsaXQoJy4nKS5wb3AoKS50b0xvd2VyQ2FzZSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9jYW5QbGF5KGV4dDpzdHJpbmcpOmJvb2xlYW57XG4gICAgICAgIHZhciBkZXZpY2VDYW5QbGF5OmJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgc3dpdGNoKGV4dCl7XG4gICAgICAgICAgICBjYXNlIFwibTRhXCI6ZGV2aWNlQ2FuUGxheSA9IERldmljZS5pc000YVN1cHBvcnRlZDsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwibXAzXCI6ZGV2aWNlQ2FuUGxheSA9IERldmljZS5pc01wM1N1cHBvcnRlZDsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwib2dnXCI6ZGV2aWNlQ2FuUGxheSA9IERldmljZS5pc09nZ1N1cHBvcnRlZDsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwid2F2XCI6ZGV2aWNlQ2FuUGxheSA9IERldmljZS5pc1dhdlN1cHBvcnRlZDsgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRldmljZUNhblBsYXk7XG4gICAgfVxufVxuIiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vZGVmcy9waXhpLmpzLmQudHNcIiAvPlxubW9kdWxlIFBJWEkge1xuICAgIGV4cG9ydCBtb2R1bGUgdXRpbHMge1xuICAgICAgICBleHBvcnQgdmFyIF9hdWRpb1R5cGVTZWxlY3RlZDpudW1iZXIgPSBBVURJT19UWVBFLldFQkFVRElPO1xuICAgICAgICBleHBvcnQgdmFyIEF1ZGlvQ2FjaGU6YW55ID0ge307XG4gICAgfVxufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2RlZnMvcGl4aS5qcy5kLnRzXCIgLz5cbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL2NvcmUvY29uc3QudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi9iaXRtYXBGb250UGFyc2VyVHh0LnRzXCIgLz5cbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4vYXVkaW9QYXJzZXIudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vY29yZS9VdGlscy50c1wiIC8+XG5tb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IG1vZHVsZSBsb2FkZXJze1xuICAgICAgICBMb2FkZXIuYWRkUGl4aU1pZGRsZXdhcmUoYml0bWFwRm9udFBhcnNlclRYVCk7XG4gICAgICAgIExvYWRlci5hZGRQaXhpTWlkZGxld2FyZShhdWRpb1BhcnNlcik7XG5cbiAgICAgICAgY2xhc3MgVHVyYm9Mb2FkZXIgZXh0ZW5kcyBMb2FkZXIge1xuICAgICAgICAgICAgY29uc3RydWN0b3IoYmFzZVVybDogc3RyaW5nLCBhc3NldENvbmN1cnJlbmN5OiBudW1iZXIpe1xuICAgICAgICAgICAgICAgIHN1cGVyKGJhc2VVcmwsIGFzc2V0Q29uY3VycmVuY3kpO1xuICAgICAgICAgICAgICAgIGlmKERldmljZS5pc0F1ZGlvU3VwcG9ydGVkKXtcbiAgICAgICAgICAgICAgICAgICAgX2NoZWNrQXVkaW9UeXBlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhZGQobmFtZTphbnksIHVybD86YW55ICxvcHRpb25zPzphbnksIGNiPzphbnkpOkxvYWRlcntcbiAgICAgICAgICAgICAgICBpZih0eXBlb2YgbmFtZSA9PT0gJ29iamVjdCcpe1xuICAgICAgICAgICAgICAgICAgICBpZihPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobmFtZS51cmwpID09PSBcIltvYmplY3QgQXJyYXldXCIpe1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZS51cmwgPSBhdWRpb1BhcnNlclVybChuYW1lLnVybCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZihPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodXJsKSA9PT0gXCJbb2JqZWN0IEFycmF5XVwiKXtcbiAgICAgICAgICAgICAgICAgICAgdXJsID0gYXVkaW9QYXJzZXJVcmwodXJsKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gc3VwZXIuYWRkKG5hbWUsIHVybCwgb3B0aW9ucywgY2IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbG9hZGVycy5Mb2FkZXIgPSBUdXJib0xvYWRlcjtcblxuXG4gICAgICAgIGZ1bmN0aW9uIF9jaGVja0F1ZGlvVHlwZSgpOnZvaWR7XG4gICAgICAgICAgICBpZihEZXZpY2UuaXNNcDNTdXBwb3J0ZWQpX3NldEF1ZGlvRXh0KFwibXAzXCIpO1xuICAgICAgICAgICAgaWYoRGV2aWNlLmlzT2dnU3VwcG9ydGVkKV9zZXRBdWRpb0V4dChcIm9nZ1wiKTtcbiAgICAgICAgICAgIGlmKERldmljZS5pc1dhdlN1cHBvcnRlZClfc2V0QXVkaW9FeHQoXCJ3YXZcIik7XG4gICAgICAgICAgICBpZihEZXZpY2UuaXNNNGFTdXBwb3J0ZWQpX3NldEF1ZGlvRXh0KFwibTRhXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gX3NldEF1ZGlvRXh0KGV4dDpzdHJpbmcpOnZvaWQge1xuICAgICAgICAgICAgaWYodXRpbHMuX2F1ZGlvVHlwZVNlbGVjdGVkID09PSBBVURJT19UWVBFLldFQkFVRElPKXtcbiAgICAgICAgICAgICAgICBSZXNvdXJjZS5zZXRFeHRlbnNpb25YaHJUeXBlKGV4dCwgUmVzb3VyY2UuWEhSX1JFU1BPTlNFX1RZUEUuQlVGRkVSKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIFJlc291cmNlLnNldEV4dGVuc2lvbkxvYWRUeXBlKGV4dCwgUmVzb3VyY2UuTE9BRF9UWVBFLkFVRElPKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0iLCJtb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IGNsYXNzIERhdGFNYW5hZ2Vye1xuICAgICAgICBwcml2YXRlIF9kYXRhOmFueTtcblxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGlkOnN0cmluZywgcHVibGljIHVzZVBlcnNpc3RhbnREYXRhOmJvb2xlYW4gPSBmYWxzZSl7XG4gICAgICAgICAgICB0aGlzLmxvYWQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxvYWQoKTpEYXRhTWFuYWdlcntcbiAgICAgICAgICAgIHRoaXMuX2RhdGEgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMuaWQpKSB8fCB7fTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgc2F2ZSgpOkRhdGFNYW5hZ2Vye1xuICAgICAgICAgICAgaWYodGhpcy51c2VQZXJzaXN0YW50RGF0YSl7XG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5pZCwgSlNPTi5zdHJpbmdpZnkodGhpcy5fZGF0YSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICByZXNldCgpOkRhdGFNYW5hZ2Vye1xuICAgICAgICAgICAgdGhpcy5fZGF0YSA9IHt9O1xuICAgICAgICAgICAgdGhpcy5zYXZlKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHNldChrZXk6c3RyaW5nIHwgT2JqZWN0LCB2YWx1ZT86YW55KTpEYXRhTWFuYWdlcntcbiAgICAgICAgICAgIGlmKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChrZXkpID09PSBcIltvYmplY3QgT2JqZWN0XVwiKXtcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMuX2RhdGEsIGtleSk7XG4gICAgICAgICAgICB9ZWxzZSBpZih0eXBlb2Yga2V5ID09PSBcInN0cmluZ1wiKXtcbiAgICAgICAgICAgICAgICB0aGlzLl9kYXRhW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5zYXZlKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGdldChrZXk/OnN0cmluZyk6YW55e1xuICAgICAgICAgICAgaWYoIWtleSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9kYXRhW2tleV07XG4gICAgICAgIH1cblxuICAgICAgICBkZWwoa2V5OnN0cmluZyk6RGF0YU1hbmFnZXJ7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fZGF0YVtrZXldO1xuICAgICAgICAgICAgdGhpcy5zYXZlKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgfVxufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2RlZnMvcGl4aS5qcy5kLnRzXCIgLz5cbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4vY29uc3QudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi9EZXZpY2UudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vZGlzcGxheS9TY2VuZS50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9hdWRpby9BdWRpb01hbmFnZXIudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vaW5wdXQvSW5wdXRNYW5hZ2VyLnRzXCIgLz5cbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL2xvYWRlci9Mb2FkZXIudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi9EYXRhTWFuYWdlci50c1wiIC8+XG5tb2R1bGUgUElYSSB7XG4gICAgdmFyIGxhc3Q6bnVtYmVyID0gMDtcbiAgICB2YXIgbWF4RnJhbWVNUyA9IDAuMzU7XG5cbiAgICB2YXIgZGVmYXVsdEdhbWVDb25maWcgOiBHYW1lQ29uZmlnID0ge1xuICAgICAgICBpZDogXCJwaXhpLmRlZmF1bHQuaWRcIixcbiAgICAgICAgd2lkdGg6ODAwLFxuICAgICAgICBoZWlnaHQ6NjAwLFxuICAgICAgICB1c2VXZWJBdWRpbzogdHJ1ZSxcbiAgICAgICAgdXNlUGVyc2lzdGFudERhdGE6IGZhbHNlLFxuICAgICAgICBnYW1lU2NhbGVUeXBlOiBHQU1FX1NDQUxFX1RZUEUuTk9ORSxcbiAgICAgICAgc3RvcEF0TG9zdEZvY3VzOiB0cnVlLFxuICAgICAgICBhc3NldHNVcmw6IFwiLi9cIixcbiAgICAgICAgbG9hZGVyQ29uY3VycmVuY3k6IDEwLFxuICAgICAgICBhdWRpb0NoYW5uZWxMaW5lczogMTAsXG4gICAgICAgIHNvdW5kQ2hhbm5lbExpbmVzOiAxMCxcbiAgICAgICAgbXVzaWNDaGFubmVsTGluZXM6IDFcbiAgICB9O1xuXG4gICAgZXhwb3J0IGNsYXNzIEdhbWUge1xuICAgICAgICBpZDpzdHJpbmc7XG4gICAgICAgIHJhZjphbnk7XG5cbiAgICAgICAgcHJpdmF0ZSBfc2NlbmVzOlNjZW5lW10gPSBbXTtcbiAgICAgICAgc2NlbmU6U2NlbmU7XG5cbiAgICAgICAgYXVkaW86QXVkaW9NYW5hZ2VyO1xuICAgICAgICBpbnB1dDpJbnB1dE1hbmFnZXI7XG4gICAgICAgIGRhdGE6RGF0YU1hbmFnZXI7XG4gICAgICAgIGxvYWRlcjpsb2FkZXJzLkxvYWRlcjtcblxuICAgICAgICByZW5kZXJlcjpXZWJHTFJlbmRlcmVyIHwgQ2FudmFzUmVuZGVyZXI7XG4gICAgICAgIGNhbnZhczpIVE1MQ2FudmFzRWxlbWVudDtcblxuICAgICAgICBkZWx0YTpudW1iZXIgPSAwO1xuICAgICAgICB0aW1lOm51bWJlciA9IDA7XG4gICAgICAgIGxhc3RUaW1lOm51bWJlciA9IDA7XG5cbiAgICAgICAgaXNXZWJHTDpib29sZWFuO1xuICAgICAgICBpc1dlYkF1ZGlvOmJvb2xlYW47XG5cbiAgICAgICAgcHJpdmF0ZSBfcmVzaXplTGlzdGVuZXI6YW55O1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGNvbmZpZz86R2FtZUNvbmZpZywgcmVuZGVyZXJPcHRpb25zPzpSZW5kZXJlck9wdGlvbnMpIHtcbiAgICAgICAgICAgIGNvbmZpZyA9ICg8T2JqZWN0Pk9iamVjdCkuYXNzaWduKGRlZmF1bHRHYW1lQ29uZmlnLCBjb25maWcpO1xuICAgICAgICAgICAgdGhpcy5pZCA9IGNvbmZpZy5pZDtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZXIgPSBhdXRvRGV0ZWN0UmVuZGVyZXIoY29uZmlnLndpZHRoLCBjb25maWcuaGVpZ2h0LCByZW5kZXJlck9wdGlvbnMpO1xuICAgICAgICAgICAgdGhpcy5jYW52YXMgPSB0aGlzLnJlbmRlcmVyLnZpZXc7XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMpO1xuXG4gICAgICAgICAgICB0aGlzLmlzV2ViR0wgPSAodGhpcy5yZW5kZXJlci50eXBlID09PSBSRU5ERVJFUl9UWVBFLldFQkdMKTtcbiAgICAgICAgICAgIHRoaXMuaXNXZWJBdWRpbyA9IChEZXZpY2UuaXNBdWRpb1N1cHBvcnRlZCYmRGV2aWNlLmlzV2ViQXVkaW9TdXBwb3J0ZWQmJmNvbmZpZy51c2VXZWJBdWRpbyk7XG4gICAgICAgICAgICB1dGlscy5fYXVkaW9UeXBlU2VsZWN0ZWQgPSB0aGlzLmlzV2ViQXVkaW8gPyBBVURJT19UWVBFLldFQkFVRElPIDogQVVESU9fVFlQRS5IVE1MQVVESU87XG5cbiAgICAgICAgICAgIHRoaXMuaW5wdXQgPSBuZXcgSW5wdXRNYW5hZ2VyKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5hdWRpbyA9IG5ldyBBdWRpb01hbmFnZXIoY29uZmlnLmF1ZGlvQ2hhbm5lbExpbmVzLCBjb25maWcuc291bmRDaGFubmVsTGluZXMsIGNvbmZpZy5tdXNpY0NoYW5uZWxMaW5lcyk7XG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBuZXcgRGF0YU1hbmFnZXIodGhpcy5pZCwgY29uZmlnLnVzZVBlcnNpc3RhbnREYXRhKTtcbiAgICAgICAgICAgIHRoaXMubG9hZGVyID0gbmV3IGxvYWRlcnMuTG9hZGVyKGNvbmZpZy5hc3NldHNVcmwsIGNvbmZpZy5sb2FkZXJDb25jdXJyZW5jeSk7XG5cbiAgICAgICAgICAgIHZhciBpbml0aWFsU2NlbmU6U2NlbmUgPSBuZXcgU2NlbmUoJ2luaXRpYWwnKS5hZGRUbyh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuc2V0U2NlbmUoaW5pdGlhbFNjZW5lKTtcblxuICAgICAgICAgICAgaWYoY29uZmlnLmdhbWVTY2FsZVR5cGUgIT09IEdBTUVfU0NBTEVfVFlQRS5OT05FKXtcbiAgICAgICAgICAgICAgICB0aGlzLmF1dG9SZXNpemUoY29uZmlnLmdhbWVTY2FsZVR5cGUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihjb25maWcuc3RvcEF0TG9zdEZvY3VzKXtcbiAgICAgICAgICAgICAgICB0aGlzLmVuYWJsZVN0b3BBdExvc3RGb2N1cygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfYW5pbWF0ZSgpOnZvaWQge1xuICAgICAgICAgICAgdGhpcy5yYWYgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuX2FuaW1hdGUuYmluZCh0aGlzKSk7XG5cbiAgICAgICAgICAgIGlmKHRoaXMuc2NlbmUpIHtcbiAgICAgICAgICAgICAgICB2YXIgbm93Om51bWJlciA9IERhdGUubm93KCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnRpbWUgKz0gTWF0aC5taW4oKG5vdyAtIGxhc3QpIC8gMTAwMCwgbWF4RnJhbWVNUyk7XG4gICAgICAgICAgICAgICAgdGhpcy5kZWx0YSA9IHRoaXMudGltZSAtIHRoaXMubGFzdFRpbWU7XG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0VGltZSA9IHRoaXMudGltZTtcblxuICAgICAgICAgICAgICAgIGxhc3QgPSBub3c7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnJlbmRlcih0aGlzLnNjZW5lKTtcblxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKHRoaXMuZGVsdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdXBkYXRlKGRlbHRhVGltZTpudW1iZXIpOkdhbWUge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnNjZW5lLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zY2VuZS5jaGlsZHJlbltpXS51cGRhdGUodGhpcy5kZWx0YSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vY2xlYW4ga2lsbGVkIG9iamVjdHNcbiAgICAgICAgICAgIHZhciBsZW46bnVtYmVyID0gQ29udGFpbmVyLl9raWxsZWRPYmplY3RzLmxlbmd0aDtcbiAgICAgICAgICAgIGlmIChsZW4pIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpOm51bWJlciA9IDA7IGkgPCBsZW47IGkrKykgQ29udGFpbmVyLl9raWxsZWRPYmplY3RzW2ldLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIENvbnRhaW5lci5fa2lsbGVkT2JqZWN0cy5sZW5ndGggPSAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXJ0KCk6R2FtZSB7XG4gICAgICAgICAgICBsYXN0ID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICAgIHRoaXMuX2FuaW1hdGUoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RvcCgpOkdhbWUge1xuICAgICAgICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMucmFmKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgZW5hYmxlU3RvcEF0TG9zdEZvY3VzKHN0YXRlOmJvb2xlYW4gPSB0cnVlKTpHYW1le1xuICAgICAgICAgICAgaWYoc3RhdGUpe1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoRGV2aWNlLmdldFZpc2liaWxpdHlDaGFuZ2VFdmVudCgpLCB0aGlzLl9vblZpc2liaWxpdHlDaGFuZ2UuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKERldmljZS5nZXRWaXNpYmlsaXR5Q2hhbmdlRXZlbnQoKSwgdGhpcy5fb25WaXNpYmlsaXR5Q2hhbmdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgZGlzYWJsZVN0b3BBdExvc3RGb2N1cygpOkdhbWV7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lbmFibGVTdG9wQXRMb3N0Rm9jdXMoZmFsc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfb25WaXNpYmlsaXR5Q2hhbmdlKCl7XG4gICAgICAgICAgICB2YXIgaXNIaWRlID0gISEoZG9jdW1lbnQuaGlkZGVuIHx8IGRvY3VtZW50LndlYmtpdEhpZGRlbiB8fCBkb2N1bWVudC5tb3pIaWRkZW4gfHwgZG9jdW1lbnQubXNIaWRkZW4pO1xuICAgICAgICAgICAgaWYoaXNIaWRlKXtcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5vbkxvc3RGb2N1cyhpc0hpZGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgb25Mb3N0Rm9jdXMoaXNIaWRlOmJvb2xlYW4pOkdhbWV7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHNldFNjZW5lKHNjZW5lOlNjZW5lIHwgc3RyaW5nKTpHYW1lIHtcbiAgICAgICAgICAgIGlmKCEoc2NlbmUgaW5zdGFuY2VvZiBTY2VuZSkpe1xuICAgICAgICAgICAgICAgIHNjZW5lID0gdGhpcy5nZXRTY2VuZSg8c3RyaW5nPnNjZW5lKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5zY2VuZSA9IDxTY2VuZT5zY2VuZTtcbiAgICAgICAgICAgIHRoaXMuc2NlbmUucG9zaXRpb24uc2V0KHRoaXMud2lkdGgvMiwgdGhpcy5oZWlnaHQvMik7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGdldFNjZW5lKGlkOnN0cmluZyk6U2NlbmV7XG4gICAgICAgICAgICB2YXIgc2NlbmU6U2NlbmUgPSBudWxsO1xuICAgICAgICAgICAgZm9yKHZhciBpOm51bWJlciA9IDA7IGkgPCB0aGlzLl9zY2VuZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuX3NjZW5lc1tpXS5pZCA9PT0gaWQpe1xuICAgICAgICAgICAgICAgICAgICBzY2VuZSA9IHRoaXMuX3NjZW5lc1tpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBzY2VuZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNyZWF0ZVNjZW5lKGlkPzpzdHJpbmcpOlNjZW5lIHtcbiAgICAgICAgICAgIHJldHVybiAobmV3IFNjZW5lKGlkKSkuYWRkVG8odGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZW1vdmVTY2VuZShzY2VuZTpzdHJpbmcgfCBTY2VuZSk6R2FtZXtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBzY2VuZSA9PT0gXCJzdHJpbmdcIil7XG4gICAgICAgICAgICAgICAgc2NlbmUgPSB0aGlzLmdldFNjZW5lKDxzdHJpbmc+c2NlbmUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgaW5kZXg6bnVtYmVyID0gdGhpcy5fc2NlbmVzLmluZGV4T2YoPFNjZW5lPnNjZW5lKTtcbiAgICAgICAgICAgIGlmKGluZGV4ICE9PSAtMSl7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2NlbmVzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgYWRkU2NlbmUoc2NlbmU6U2NlbmUpOkdhbWUge1xuICAgICAgICAgICAgdGhpcy5fc2NlbmVzLnB1c2goc2NlbmUpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICByZW1vdmVBbGxTY2VuZXMoKTpHYW1le1xuICAgICAgICAgICAgdGhpcy5fc2NlbmVzLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICB0aGlzLnNjZW5lID0gbnVsbDtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzaXplKHdpZHRoOm51bWJlciwgaGVpZ2h0Om51bWJlciwgcmVuZGVyZXI6Ym9vbGVhbiA9IGZhbHNlKTpHYW1le1xuICAgICAgICAgICAgaWYocmVuZGVyZXIpe1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIucmVzaXplKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5zdHlsZS53aWR0aCA9IHdpZHRoICsgXCJweFwiO1xuICAgICAgICAgICAgdGhpcy5jYW52YXMuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgXCJweFwiO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGF1dG9SZXNpemUobW9kZTpudW1iZXIpOkdhbWUge1xuICAgICAgICAgICAgaWYodGhpcy5fcmVzaXplTGlzdGVuZXIpe1xuICAgICAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl9yZXNpemVMaXN0ZW5lcik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKG1vZGUgPT09IEdBTUVfU0NBTEVfVFlQRS5OT05FKXJldHVybjtcblxuICAgICAgICAgICAgc3dpdGNoKG1vZGUpe1xuICAgICAgICAgICAgICAgIGNhc2UgR0FNRV9TQ0FMRV9UWVBFLkFTUEVDVF9GSVQ6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Jlc2l6ZUxpc3RlbmVyID0gdGhpcy5fcmVzaXplTW9kZUFzcGVjdEZpdDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBHQU1FX1NDQUxFX1RZUEUuQVNQRUNUX0ZJTEw6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Jlc2l6ZUxpc3RlbmVyID0gdGhpcy5fcmVzaXplTW9kZUFzcGVjdEZpbGw7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgR0FNRV9TQ0FMRV9UWVBFLkZJTEw6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Jlc2l6ZUxpc3RlbmVyID0gdGhpcy5fcmVzaXplTW9kZUZpbGw7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5fcmVzaXplTGlzdGVuZXIuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB0aGlzLl9yZXNpemVMaXN0ZW5lcigpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9yZXNpemVNb2RlQXNwZWN0Rml0KCk6dm9pZHtcbiAgICAgICAgICAgIHZhciB3dzpudW1iZXIgPSBwYXJzZUludCh0aGlzLmNhbnZhcy5zdHlsZS53aWR0aCwgMTApIHx8IHRoaXMuY2FudmFzLndpZHRoO1xuICAgICAgICAgICAgdmFyIGhoOm51bWJlciA9IHBhcnNlSW50KHRoaXMuY2FudmFzLnN0eWxlLmhlaWdodCwgMTApIHx8IHRoaXMuY2FudmFzLmhlaWdodDtcbiAgICAgICAgICAgIGlmKHdpbmRvdy5pbm5lcldpZHRoICE9PSB3dyB8fCB3aW5kb3cuaW5uZXJIZWlnaHQgIT09IGhoKXtcbiAgICAgICAgICAgICAgICB2YXIgc2NhbGU6bnVtYmVyID0gTWF0aC5taW4od2luZG93LmlubmVyV2lkdGgvdGhpcy53aWR0aCwgd2luZG93LmlubmVySGVpZ2h0L3RoaXMuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc2l6ZSh0aGlzLndpZHRoKnNjYWxlLCB0aGlzLmhlaWdodCpzY2FsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9yZXNpemVNb2RlQXNwZWN0RmlsbCgpOnZvaWR7XG4gICAgICAgICAgICB2YXIgd3c6bnVtYmVyID0gcGFyc2VJbnQodGhpcy5jYW52YXMuc3R5bGUud2lkdGgsIDEwKSB8fCB0aGlzLmNhbnZhcy53aWR0aDtcbiAgICAgICAgICAgIHZhciBoaDpudW1iZXIgPSBwYXJzZUludCh0aGlzLmNhbnZhcy5zdHlsZS5oZWlnaHQsIDEwKSB8fCB0aGlzLmNhbnZhcy5oZWlnaHQ7XG4gICAgICAgICAgICBpZih3aW5kb3cuaW5uZXJXaWR0aCAhPT0gd3cgfHwgd2luZG93LmlubmVySGVpZ2h0ICE9PSBoaCl7XG4gICAgICAgICAgICAgICAgdmFyIHNjYWxlOm51bWJlciA9IE1hdGgubWF4KHdpbmRvdy5pbm5lcldpZHRoL3RoaXMud2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodC90aGlzLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgdmFyIHdpZHRoOm51bWJlciA9IHRoaXMud2lkdGgqc2NhbGU7XG4gICAgICAgICAgICAgICAgdmFyIGhlaWdodDpudW1iZXIgPSB0aGlzLmhlaWdodCpzY2FsZTtcblxuICAgICAgICAgICAgICAgIHZhciB0b3BNYXJnaW46bnVtYmVyID0gKHdpbmRvdy5pbm5lckhlaWdodC1oZWlnaHQpLzI7XG4gICAgICAgICAgICAgICAgdmFyIGxlZnRNYXJnaW46bnVtYmVyID0gKHdpbmRvdy5pbm5lcldpZHRoLXdpZHRoKS8yO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5yZXNpemUod2lkdGgsIGhlaWdodCk7XG5cbiAgICAgICAgICAgICAgICB2YXIgc3R5bGU6YW55ID0gPGFueT50aGlzLmNhbnZhcy5zdHlsZTtcbiAgICAgICAgICAgICAgICBzdHlsZVsnbWFyZ2luLXRvcCddID0gdG9wTWFyZ2luICsgXCJweFwiO1xuICAgICAgICAgICAgICAgIHN0eWxlWydtYXJnaW4tbGVmdCddID0gbGVmdE1hcmdpbiArIFwicHhcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX3Jlc2l6ZU1vZGVGaWxsKCk6dm9pZHtcbiAgICAgICAgICAgIHZhciB3dzpudW1iZXIgPSBwYXJzZUludCh0aGlzLmNhbnZhcy5zdHlsZS53aWR0aCwgMTApIHx8IHRoaXMuY2FudmFzLndpZHRoO1xuICAgICAgICAgICAgdmFyIGhoOm51bWJlciA9IHBhcnNlSW50KHRoaXMuY2FudmFzLnN0eWxlLmhlaWdodCwgMTApIHx8IHRoaXMuY2FudmFzLmhlaWdodDtcbiAgICAgICAgICAgIGlmKHdpbmRvdy5pbm5lcldpZHRoICE9PSB3dyB8fCB3aW5kb3cuaW5uZXJIZWlnaHQgIT09IGhoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgd2lkdGgoKTpudW1iZXIge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyZXIud2lkdGg7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgaGVpZ2h0KCk6bnVtYmVyIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbmRlcmVyLmhlaWdodDtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBHYW1lQ29uZmlnIHtcbiAgICAgICAgaWQ/OnN0cmluZztcbiAgICAgICAgd2lkdGg/Om51bWJlcjtcbiAgICAgICAgaGVpZ2h0PzpudW1iZXI7XG4gICAgICAgIHVzZVdlYkF1ZGlvPzpib29sZWFuO1xuICAgICAgICB1c2VQZXJzaXN0YW50RGF0YT86Ym9vbGVhbjtcbiAgICAgICAgZ2FtZVNjYWxlVHlwZT86bnVtYmVyO1xuICAgICAgICBzdG9wQXRMb3N0Rm9jdXM/OmJvb2xlYW47XG4gICAgICAgIGFzc2V0c1VybD86c3RyaW5nO1xuICAgICAgICBsb2FkZXJDb25jdXJyZW5jeT86bnVtYmVyO1xuICAgICAgICBhdWRpb0NoYW5uZWxMaW5lcz86bnVtYmVyO1xuICAgICAgICBzb3VuZENoYW5uZWxMaW5lcz86bnVtYmVyO1xuICAgICAgICBtdXNpY0NoYW5uZWxMaW5lcz86bnVtYmVyO1xuICAgIH1cbn1cblxuaW50ZXJmYWNlIE9iamVjdCB7XG4gICAgYXNzaWduKHRhcmdldDpPYmplY3QsIC4uLnNvdXJjZXM6T2JqZWN0W10pOk9iamVjdDtcbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuL0F1ZGlvTGluZS50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9jb3JlL0dhbWUudHNcIiAvPlxubW9kdWxlIFBJWEkge1xuICAgIGV4cG9ydCBjbGFzcyBBdWRpb01hbmFnZXJ7XG4gICAgICAgIHNvdW5kTGluZXM6QXVkaW9MaW5lW10gPSBbXTtcbiAgICAgICAgbXVzaWNMaW5lczpBdWRpb0xpbmVbXSA9IFtdO1xuICAgICAgICBub3JtYWxMaW5lczpBdWRpb0xpbmVbXSA9IFtdO1xuICAgICAgICBwcml2YXRlIF90ZW1wTGluZXM6QXVkaW9MaW5lW10gPSBbXTtcblxuICAgICAgICBtdXNpY011dGVkOmJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgc291bmRNdXRlZDpib29sZWFuID0gZmFsc2U7XG5cbiAgICAgICAgY29udGV4dDpBdWRpb0NvbnRleHQ7XG4gICAgICAgIGdhaW5Ob2RlOkF1ZGlvTm9kZTtcblxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGF1ZGlvQ2hhbm5lbExpbmVzOm51bWJlciA9IDEwLCBwcml2YXRlIHNvdW5kQ2hhbm5lbExpbmVzOm51bWJlciA9IDEwLCBwcml2YXRlIG11c2ljQ2hhbm5lbExpbmVzOm51bWJlciA9IDEpe1xuICAgICAgICAgICAgaWYodXRpbHMuX2F1ZGlvVHlwZVNlbGVjdGVkID09PSBBVURJT19UWVBFLldFQkFVRElPKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0ID0gRGV2aWNlLmdsb2JhbFdlYkF1ZGlvQ29udGV4dDtcbiAgICAgICAgICAgICAgICB0aGlzLmdhaW5Ob2RlID0gX2NyZWF0ZUdhaW5Ob2RlKHRoaXMuY29udGV4dCk7XG4gICAgICAgICAgICAgICAgdGhpcy5nYWluTm9kZS5jb25uZWN0KHRoaXMuY29udGV4dC5kZXN0aW5hdGlvbik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBpOm51bWJlcjtcbiAgICAgICAgICAgIGZvcihpID0gMDsgaSA8IHRoaXMuYXVkaW9DaGFubmVsTGluZXM7IGkrKyl7XG4gICAgICAgICAgICAgICAgdGhpcy5ub3JtYWxMaW5lcy5wdXNoKG5ldyBBdWRpb0xpbmUodGhpcykpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCB0aGlzLnNvdW5kQ2hhbm5lbExpbmVzOyBpKyspe1xuICAgICAgICAgICAgICAgIHRoaXMuc291bmRMaW5lcy5wdXNoKG5ldyBBdWRpb0xpbmUodGhpcykpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCB0aGlzLm11c2ljQ2hhbm5lbExpbmVzOyBpKyspe1xuICAgICAgICAgICAgICAgIHRoaXMubXVzaWNMaW5lcy5wdXNoKG5ldyBBdWRpb0xpbmUodGhpcykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZ2V0QXVkaW8oaWQ6c3RyaW5nKTpBdWRpb3tcbiAgICAgICAgICAgIHZhciBhdWRpbzpBdWRpbyA9IHV0aWxzLkF1ZGlvQ2FjaGVbaWRdO1xuICAgICAgICAgICAgYXVkaW8ubWFuYWdlciA9IHRoaXM7XG4gICAgICAgICAgICByZXR1cm4gYXVkaW87XG4gICAgICAgIH1cblxuICAgICAgICBwYXVzZUFsbExpbmVzKCk6QXVkaW9NYW5hZ2VyIHtcbiAgICAgICAgICAgIHRoaXMucGF1c2VNdXNpYygpO1xuICAgICAgICAgICAgdGhpcy5wYXVzZVNvdW5kKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc3VtZUFsbExpbmVzKCk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgdGhpcy5yZXN1bWVNdXNpYygpO1xuICAgICAgICAgICAgdGhpcy5yZXN1bWVTb3VuZCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwbGF5KGlkOnN0cmluZywgbG9vcD86Ym9vbGVhbnxGdW5jdGlvbiwgY2FsbGJhY2s/OkZ1bmN0aW9uKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICBpZih0eXBlb2YgbG9vcCA9PT0gXCJmdW5jdGlvblwiKXtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayA9IDxGdW5jdGlvbj5sb29wO1xuICAgICAgICAgICAgICAgIGxvb3AgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wbGF5KGlkLCB0aGlzLm5vcm1hbExpbmVzLCA8Ym9vbGVhbj5sb29wLCBjYWxsYmFjayk7XG4gICAgICAgIH1cblxuICAgICAgICBwbGF5TXVzaWMoaWQ6c3RyaW5nLCBsb29wPzpib29sZWFufEZ1bmN0aW9uLCBjYWxsYmFjaz86RnVuY3Rpb24pOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIGlmKHR5cGVvZiBsb29wID09PSBcImZ1bmN0aW9uXCIpe1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrID0gPEZ1bmN0aW9uPmxvb3A7XG4gICAgICAgICAgICAgICAgbG9vcCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BsYXkoaWQsIHRoaXMubXVzaWNMaW5lcywgPGJvb2xlYW4+bG9vcCwgY2FsbGJhY2spO1xuICAgICAgICB9XG5cbiAgICAgICAgcGxheVNvdW5kKGlkOnN0cmluZywgbG9vcD86Ym9vbGVhbnxGdW5jdGlvbiwgY2FsbGJhY2s/OkZ1bmN0aW9uKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICBpZih0eXBlb2YgbG9vcCA9PT0gXCJmdW5jdGlvblwiKXtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayA9IDxGdW5jdGlvbj5sb29wO1xuICAgICAgICAgICAgICAgIGxvb3AgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wbGF5KGlkLCB0aGlzLnNvdW5kTGluZXMsIDxib29sZWFuPmxvb3AsIGNhbGxiYWNrKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0b3AoaWQ/OnN0cmluZyk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N0b3AoaWQsIHRoaXMubm9ybWFsTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RvcE11c2ljKGlkPzpzdHJpbmcpOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdG9wKGlkLCB0aGlzLm11c2ljTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RvcFNvdW5kKGlkPzpzdHJpbmcpOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdG9wKGlkLCB0aGlzLnNvdW5kTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcGF1c2UoaWQ/OnN0cmluZyk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BhdXNlKGlkLCB0aGlzLm5vcm1hbExpbmVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBhdXNlTXVzaWMoaWQ/OnN0cmluZyk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BhdXNlKGlkLCB0aGlzLm11c2ljTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcGF1c2VTb3VuZChpZD86c3RyaW5nKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGF1c2UoaWQsIHRoaXMuc291bmRMaW5lcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXN1bWUoaWQ/OnN0cmluZyk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Jlc3VtZShpZCwgdGhpcy5ub3JtYWxMaW5lcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXN1bWVNdXNpYyhpZD86c3RyaW5nKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVzdW1lKGlkLCB0aGlzLm11c2ljTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzdW1lU291bmQoaWQ/OnN0cmluZyk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Jlc3VtZShpZCwgdGhpcy5zb3VuZExpbmVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG11dGUoaWQ/OnN0cmluZyk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX211dGUoaWQsIHRoaXMubm9ybWFsTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgbXV0ZU11c2ljKGlkPzpzdHJpbmcpOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tdXRlKGlkLCB0aGlzLm11c2ljTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgbXV0ZVNvdW5kKGlkPzpzdHJpbmcpOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tdXRlKGlkLCB0aGlzLnNvdW5kTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdW5tdXRlKGlkPzpzdHJpbmcpOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl91bm11dGUoaWQsIHRoaXMubm9ybWFsTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdW5tdXRlTXVzaWMoaWQ/OnN0cmluZyk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3VubXV0ZShpZCwgdGhpcy5tdXNpY0xpbmVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHVubXV0ZVNvdW5kKGlkPzpzdHJpbmcpOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl91bm11dGUoaWQsIHRoaXMuc291bmRMaW5lcyk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9wYXVzZShpZDpzdHJpbmcsIGxpbmVzOkF1ZGlvTGluZVtdKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICBpZighaWQpe1xuICAgICAgICAgICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBpZighbGluZXNbaV0uYXZhaWxhYmxlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzW2ldLnBhdXNlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGF1ZGlvTGluZXM6QXVkaW9MaW5lW10gPSB0aGlzLl9nZXRMaW5lc0J5SWQoaWQsIGxpbmVzKTtcbiAgICAgICAgICAgIGlmKGF1ZGlvTGluZXMubGVuZ3RoKXtcbiAgICAgICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCBhdWRpb0xpbmVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICAgICAgYXVkaW9MaW5lc1tpXS5wYXVzZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfcmVzdW1lKGlkOnN0cmluZywgbGluZXM6QXVkaW9MaW5lW10pOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIGlmKCFpZCl7XG4gICAgICAgICAgICAgICAgZm9yKHZhciBpOm51bWJlciA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgICAgIGlmKCFsaW5lc1tpXS5hdmFpbGFibGUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluZXNbaV0ucmVzdW1lKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGF1ZGlvTGluZXM6QXVkaW9MaW5lW10gPSB0aGlzLl9nZXRMaW5lc0J5SWQoaWQsIGxpbmVzKTtcbiAgICAgICAgICAgIGlmKGF1ZGlvTGluZXMubGVuZ3RoKXtcbiAgICAgICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCBhdWRpb0xpbmVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICAgICAgYXVkaW9MaW5lc1tpXS5yZXN1bWUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX3BsYXkoaWQ6c3RyaW5nLCBsaW5lczpBdWRpb0xpbmVbXSwgbG9vcDpib29sZWFuID0gZmFsc2UsIGNhbGxiYWNrPzpGdW5jdGlvbik6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgdmFyIGxpbmU6QXVkaW9MaW5lID0gdGhpcy5fZ2V0QXZhaWxhYmxlTGluZUZyb20obGluZXMpO1xuICAgICAgICAgICAgaWYoIWxpbmUpe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0F1ZGlvTWFuYWdlcjogQWxsIGxpbmVzIGFyZSBidXN5IScpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgYXVkaW86QXVkaW8gPSB0aGlzLmdldEF1ZGlvKGlkKTtcbiAgICAgICAgICAgIGlmKCFhdWRpbyl7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignQXVkaW8gKCcgKyBpZCArICcpIG5vdCBmb3VuZC4nKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGluZS5zZXRBdWRpbyhhdWRpbywgbG9vcCwgY2FsbGJhY2spLnBsYXkoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfc3RvcChpZDpzdHJpbmcsIGxpbmVzOkF1ZGlvTGluZVtdKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICBpZighaWQpe1xuICAgICAgICAgICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBpZighbGluZXNbaV0uYXZhaWxhYmxlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzW2ldLnN0b3AoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgYXVkaW9MaW5lczpBdWRpb0xpbmVbXSA9IHRoaXMuX2dldExpbmVzQnlJZChpZCwgbGluZXMpO1xuICAgICAgICAgICAgaWYoYXVkaW9MaW5lcy5sZW5ndGgpe1xuICAgICAgICAgICAgICAgIGZvcihpID0gMDsgaSA8IGF1ZGlvTGluZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBhdWRpb0xpbmVzW2ldLnN0b3AoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfbXV0ZShpZDpzdHJpbmcsIGxpbmVzOkF1ZGlvTGluZVtdKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICBpZighaWQpe1xuICAgICAgICAgICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBpZighbGluZXNbaV0uYXZhaWxhYmxlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzW2ldLm11dGUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgYXVkaW9MaW5lczpBdWRpb0xpbmVbXSA9IHRoaXMuX2dldExpbmVzQnlJZChpZCwgbGluZXMpO1xuICAgICAgICAgICAgaWYoYXVkaW9MaW5lcy5sZW5ndGgpe1xuICAgICAgICAgICAgICAgIGZvcihpID0gMDsgaSA8IGF1ZGlvTGluZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBhdWRpb0xpbmVzW2ldLm11dGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX3VubXV0ZShpZDpzdHJpbmcsIGxpbmVzOkF1ZGlvTGluZVtdKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICBpZighaWQpe1xuICAgICAgICAgICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBpZighbGluZXNbaV0uYXZhaWxhYmxlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzW2ldLnVubXV0ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBhdWRpb0xpbmVzOkF1ZGlvTGluZVtdID0gdGhpcy5fZ2V0TGluZXNCeUlkKGlkLCBsaW5lcyk7XG4gICAgICAgICAgICBpZihhdWRpb0xpbmVzLmxlbmd0aCl7XG4gICAgICAgICAgICAgICAgZm9yKGkgPSAwOyBpIDwgYXVkaW9MaW5lcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgICAgIGF1ZGlvTGluZXNbaV0udW5tdXRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9nZXRMaW5lc0J5SWQoaWQ6c3RyaW5nLCBsaW5lczpBdWRpb0xpbmVbXSk6QXVkaW9MaW5lW10ge1xuICAgICAgICAgICAgdGhpcy5fdGVtcExpbmVzLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICBmb3IodmFyIGk6bnVtYmVyID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICBpZighbGluZXNbaV0uYXZhaWxhYmxlKXtcbiAgICAgICAgICAgICAgICAgICAgaWYobGluZXNbaV0uYXVkaW8uaWQgPT09IGlkKXRoaXMuX3RlbXBMaW5lcy5wdXNoKGxpbmVzW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90ZW1wTGluZXM7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9nZXRBdmFpbGFibGVMaW5lRnJvbShsaW5lczpBdWRpb0xpbmVbXSk6QXVkaW9MaW5le1xuICAgICAgICAgICAgdmFyIGw6QXVkaW9MaW5lO1xuICAgICAgICAgICAgZm9yKHZhciBpOm51bWJlciA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgaWYobGluZXNbaV0uYXZhaWxhYmxlKXtcbiAgICAgICAgICAgICAgICAgICAgbCA9IGxpbmVzW2ldO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbDtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2NyZWF0ZUdhaW5Ob2RlKGN0eDpBdWRpb0NvbnRleHQpOkdhaW5Ob2Rle1xuICAgICAgICByZXR1cm4gY3R4LmNyZWF0ZUdhaW4gPyBjdHguY3JlYXRlR2FpbigpIDogY3R4LmNyZWF0ZUdhaW5Ob2RlKCk7XG4gICAgfVxufVxuXG5pbnRlcmZhY2UgQXVkaW9Db250ZXh0IHtcbiAgICBjcmVhdGVHYWluTm9kZSgpOmFueTtcbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuL0F1ZGlvTWFuYWdlci50c1wiIC8+XG5tb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IGNsYXNzIEF1ZGlvIHtcbiAgICAgICAgbG9vcDpib29sZWFuID0gZmFsc2U7XG4gICAgICAgIHByaXZhdGUgX3ZvbHVtZTpudW1iZXIgPSAxO1xuICAgICAgICBtdXRlZDpib29sZWFuID0gZmFsc2U7XG4gICAgICAgIG1hbmFnZXI6QXVkaW9NYW5hZ2VyO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBzb3VyY2U6YW55LCBwdWJsaWMgaWQ6c3RyaW5nKXt9XG5cbiAgICAgICAgcGxheShsb29wPzpib29sZWFufEZ1bmN0aW9uLCBjYWxsYmFjaz86RnVuY3Rpb24pOkF1ZGlve1xuICAgICAgICAgICAgaWYoIXRoaXMubWFuYWdlcil7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignVGhpcyBhdWRpbyBuZWVkIGEgbWFuYWdlci4nKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYodHlwZW9mIGxvb3AgPT09IFwiZnVuY3Rpb25cIil7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2sgPSA8RnVuY3Rpb24+bG9vcDtcbiAgICAgICAgICAgICAgICBsb29wID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5wbGF5KHRoaXMuaWQsIGxvb3AsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RvcCgpOkF1ZGlvIHtcbiAgICAgICAgICAgIGlmKCF0aGlzLm1hbmFnZXIpe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1RoaXMgYXVkaW8gbmVlZCBhIG1hbmFnZXIuJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5zdG9wKHRoaXMuaWQpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBtdXRlKCk6QXVkaW8ge1xuICAgICAgICAgICAgaWYoIXRoaXMubWFuYWdlcil7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignVGhpcyBhdWRpbyBuZWVkIGEgbWFuYWdlci4nKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5tdXRlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLm1hbmFnZXIubXV0ZSh0aGlzLmlkKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgdW5tdXRlKCk6QXVkaW8ge1xuICAgICAgICAgICAgaWYoIXRoaXMubWFuYWdlcil7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignVGhpcyBhdWRpbyBuZWVkIGEgbWFuYWdlci4nKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5tdXRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLnVubXV0ZSh0aGlzLmlkKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcGF1c2UoKTpBdWRpbyB7XG4gICAgICAgICAgICBpZighdGhpcy5tYW5hZ2VyKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdUaGlzIGF1ZGlvIG5lZWQgYSBtYW5hZ2VyLicpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLm1hbmFnZXIucGF1c2UodGhpcy5pZCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc3VtZSgpOkF1ZGlvIHtcbiAgICAgICAgICAgIGlmKCF0aGlzLm1hbmFnZXIpe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1RoaXMgYXVkaW8gbmVlZCBhIG1hbmFnZXIuJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5yZXN1bWUodGhpcy5pZCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCB2b2x1bWUoKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl92b2x1bWU7XG4gICAgICAgIH1cblxuICAgICAgICBzZXQgdm9sdW1lKHZhbHVlOm51bWJlcil7XG4gICAgICAgICAgICB0aGlzLl92b2x1bWUgPSB2YWx1ZTtcblxuICAgICAgICAgICAgaWYodGhpcy5tYW5hZ2VyKXtcbiAgICAgICAgICAgICAgICAvL1RPRE86IHVwZGF0ZSB0aGUgdm9sdW1lIG9uIHRoZSBmbHlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9kZWZzL3BpeGkuanMuZC50c1wiIC8+XG5cbm1vZHVsZSBQSVhJIHtcbiAgICBDb250YWluZXIuX2tpbGxlZE9iamVjdHMgPSBbXTtcblxuICAgIENvbnRhaW5lci5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oZGVsdGFUaW1lOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5wb3NpdGlvbi54ICs9IHRoaXMudmVsb2NpdHkueCAqIGRlbHRhVGltZTtcbiAgICAgICAgdGhpcy5wb3NpdGlvbi55ICs9IHRoaXMudmVsb2NpdHkueSAqIGRlbHRhVGltZTtcbiAgICAgICAgdGhpcy5yb3RhdGlvbiArPSB0aGlzLnJvdGF0aW9uU3BlZWQgKiBkZWx0YVRpbWU7XG5cbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbltpXS51cGRhdGUoZGVsdGFUaW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBDb250YWluZXIucHJvdG90eXBlLmFkZFRvID0gZnVuY3Rpb24ocGFyZW50KXtcbiAgICAgICAgcGFyZW50LmFkZENoaWxkKHRoaXMpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgQ29udGFpbmVyLnByb3RvdHlwZS5raWxsID0gZnVuY3Rpb24oKXtcbiAgICAgICAgUElYSS5Db250YWluZXIuX2tpbGxlZE9iamVjdHMucHVzaCh0aGlzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIENvbnRhaW5lci5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgaWYodGhpcy5wYXJlbnQpe1xuICAgICAgICAgICAgdGhpcy5wYXJlbnQucmVtb3ZlQ2hpbGQodGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG59IiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vZGVmcy9waXhpLmpzLmQudHNcIiAvPlxuXG5tb2R1bGUgUElYSSB7XG4gICAgRGlzcGxheU9iamVjdC5wcm90b3R5cGUuc3BlZWQgPSAwO1xuICAgIERpc3BsYXlPYmplY3QucHJvdG90eXBlLnZlbG9jaXR5ID0gbmV3IFBvaW50KCk7XG4gICAgRGlzcGxheU9iamVjdC5wcm90b3R5cGUuZGlyZWN0aW9uID0gMDtcbiAgICBEaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5yb3RhdGlvblNwZWVkID0gMDtcblxuICAgIERpc3BsYXlPYmplY3QucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKGRlbHRhVGltZTpudW1iZXIpe1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
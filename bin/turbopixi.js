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
                    this._webAudio.gainNode.value = this.audio.muted || this.muted ? 0 : this.audio.volume;
                    this._webAudio.gainNode.connect(this.manager.gainNode);
                    this._webAudio.connect(this._webAudio.gainNode);
                    this._webAudio.start(0, pause ? this.lastPauseTime : null);
                    console.log(this._webAudio, this._webAudio.gainNode.value);
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
                console.log('end');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInR1cmJvcGl4aS5qcyIsImluZGV4LnRzIiwiYXVkaW8vQXVkaW9MaW5lLnRzIiwiY29yZS9jb25zdC50cyIsImNvcmUvRGV2aWNlLnRzIiwiZGlzcGxheS9TY2VuZS50cyIsImlucHV0L0lucHV0TWFuYWdlci50cyIsImxvYWRlci9iaXRtYXBGb250UGFyc2VyVFhULnRzIiwibG9hZGVyL2F1ZGlvUGFyc2VyLnRzIiwiY29yZS9VdGlscy50cyIsImxvYWRlci9Mb2FkZXIudHMiLCJjb3JlL0RhdGFNYW5hZ2VyLnRzIiwiY29yZS9HYW1lLnRzIiwiYXVkaW8vQXVkaW9NYW5hZ2VyLnRzIiwiYXVkaW8vQXVkaW8udHMiLCJkaXNwbGF5L0NvbnRhaW5lci50cyIsImRpc3BsYXkvRGlzcGxheU9iamVjdC50cyJdLCJuYW1lcyI6WyJQSVhJIiwiRXJyb3IiLCJQSVhJX1ZFUlNJT05fUkVRVUlSRUQiLCJQSVhJX1ZFUlNJT04iLCJWRVJTSU9OIiwibWF0Y2giLCJIVE1MQXVkaW8iLCJBdWRpbyIsIlBJWEkuQXVkaW9MaW5lIiwiUElYSS5BdWRpb0xpbmUuY29uc3RydWN0b3IiLCJQSVhJLkF1ZGlvTGluZS5zZXRBdWRpbyIsIlBJWEkuQXVkaW9MaW5lLnBsYXkiLCJQSVhJLkF1ZGlvTGluZS5zdG9wIiwiUElYSS5BdWRpb0xpbmUucGF1c2UiLCJQSVhJLkF1ZGlvTGluZS5yZXN1bWUiLCJQSVhJLkF1ZGlvTGluZS5tdXRlIiwiUElYSS5BdWRpb0xpbmUudW5tdXRlIiwiUElYSS5BdWRpb0xpbmUudm9sdW1lIiwiUElYSS5BdWRpb0xpbmUucmVzZXQiLCJQSVhJLkF1ZGlvTGluZS5fb25FbmQiLCJQSVhJLkdBTUVfU0NBTEVfVFlQRSIsIlBJWEkuQVVESU9fVFlQRSIsIlBJWEkuRGV2aWNlIiwiUElYSS5EZXZpY2UuZ2V0TW91c2VXaGVlbEV2ZW50IiwiUElYSS5EZXZpY2UudmlicmF0ZSIsIlBJWEkuRGV2aWNlLmdldFZpc2liaWxpdHlDaGFuZ2VFdmVudCIsIlBJWEkuRGV2aWNlLmlzT25saW5lIiwiX19leHRlbmRzIiwiZCIsImIiLCJwIiwiaGFzT3duUHJvcGVydHkiLCJfXyIsImNvbnN0cnVjdG9yIiwicHJvdG90eXBlIiwiUElYSS5TY2VuZSIsIlBJWEkuU2NlbmUuY29uc3RydWN0b3IiLCJQSVhJLlNjZW5lLmFkZFRvIiwiUElYSS5JbnB1dE1hbmFnZXIiLCJQSVhJLklucHV0TWFuYWdlci5jb25zdHJ1Y3RvciIsIlBJWEkuYml0bWFwRm9udFBhcnNlclRYVCIsInJlc291cmNlIiwiZGF0YSIsInhoclR5cGUiLCJuZXh0IiwidGV4dCIsInhociIsInJlc3BvbnNlVGV4dCIsImluZGV4T2YiLCJ1cmwiLCJkaXJuYW1lIiwiYmFzZVVybCIsImNoYXJBdCIsImxlbmd0aCIsInJlcGxhY2UiLCJ0ZXh0dXJlVXJsIiwiZ2V0VGV4dHVyZVVybCIsInV0aWxzIiwiVGV4dHVyZUNhY2hlIiwicGFyc2UiLCJsb2FkT3B0aW9ucyIsImNyb3NzT3JpZ2luIiwibG9hZFR5cGUiLCJsb2FkZXJzIiwiUmVzb3VyY2UiLCJMT0FEX1RZUEUiLCJJTUFHRSIsImFkZCIsIm5hbWUiLCJyZXMiLCJ0ZXh0dXJlIiwiUElYSS5wYXJzZSIsIlBJWEkuZGlybmFtZSIsIlBJWEkuZ2V0VGV4dHVyZVVybCIsIlBJWEkuZ2V0QXR0ciIsIlBJWEkuYXVkaW9QYXJzZXIiLCJEZXZpY2UiLCJpc0F1ZGlvU3VwcG9ydGVkIiwiZXh0IiwiX2dldEV4dCIsIl9hbGxvd2VkRXh0IiwiX2NhblBsYXkiLCJfYXVkaW9UeXBlU2VsZWN0ZWQiLCJBVURJT19UWVBFIiwiV0VCQVVESU8iLCJnbG9iYWxXZWJBdWRpb0NvbnRleHQiLCJkZWNvZGVBdWRpb0RhdGEiLCJfYWRkVG9DYWNoZSIsImJpbmQiLCJQSVhJLmF1ZGlvUGFyc2VyVXJsIiwiUElYSS5fYWRkVG9DYWNoZSIsIlBJWEkuX2dldEV4dCIsIlBJWEkuX2NhblBsYXkiLCJQSVhJLnV0aWxzIiwiUElYSS5sb2FkZXJzIiwiUElYSS5sb2FkZXJzLlR1cmJvTG9hZGVyIiwiUElYSS5sb2FkZXJzLlR1cmJvTG9hZGVyLmNvbnN0cnVjdG9yIiwiUElYSS5sb2FkZXJzLlR1cmJvTG9hZGVyLmFkZCIsIlBJWEkubG9hZGVycy5fY2hlY2tBdWRpb1R5cGUiLCJQSVhJLmxvYWRlcnMuX3NldEF1ZGlvRXh0IiwiUElYSS5EYXRhTWFuYWdlciIsIlBJWEkuRGF0YU1hbmFnZXIuY29uc3RydWN0b3IiLCJQSVhJLkRhdGFNYW5hZ2VyLmxvYWQiLCJQSVhJLkRhdGFNYW5hZ2VyLnNhdmUiLCJQSVhJLkRhdGFNYW5hZ2VyLnJlc2V0IiwiUElYSS5EYXRhTWFuYWdlci5zZXQiLCJQSVhJLkRhdGFNYW5hZ2VyLmdldCIsIlBJWEkuRGF0YU1hbmFnZXIuZGVsIiwiUElYSS5HYW1lIiwiUElYSS5HYW1lLmNvbnN0cnVjdG9yIiwiUElYSS5HYW1lLl9hbmltYXRlIiwiUElYSS5HYW1lLnVwZGF0ZSIsIlBJWEkuR2FtZS5zdGFydCIsIlBJWEkuR2FtZS5zdG9wIiwiUElYSS5HYW1lLmVuYWJsZVN0b3BBdExvc3RGb2N1cyIsIlBJWEkuR2FtZS5kaXNhYmxlU3RvcEF0TG9zdEZvY3VzIiwiUElYSS5HYW1lLl9vblZpc2liaWxpdHlDaGFuZ2UiLCJQSVhJLkdhbWUub25Mb3N0Rm9jdXMiLCJQSVhJLkdhbWUuc2V0U2NlbmUiLCJQSVhJLkdhbWUuZ2V0U2NlbmUiLCJQSVhJLkdhbWUuY3JlYXRlU2NlbmUiLCJQSVhJLkdhbWUucmVtb3ZlU2NlbmUiLCJQSVhJLkdhbWUuYWRkU2NlbmUiLCJQSVhJLkdhbWUucmVtb3ZlQWxsU2NlbmVzIiwiUElYSS5HYW1lLnJlc2l6ZSIsIlBJWEkuR2FtZS5hdXRvUmVzaXplIiwiUElYSS5HYW1lLl9yZXNpemVNb2RlQXNwZWN0Rml0IiwiUElYSS5HYW1lLl9yZXNpemVNb2RlQXNwZWN0RmlsbCIsIlBJWEkuR2FtZS5fcmVzaXplTW9kZUZpbGwiLCJnZXQiLCJQSVhJLkdhbWUud2lkdGgiLCJlbnVtZXJhYmxlIiwiY29uZmlndXJhYmxlIiwiUElYSS5HYW1lLmhlaWdodCIsIlBJWEkuQXVkaW9NYW5hZ2VyIiwiUElYSS5BdWRpb01hbmFnZXIuY29uc3RydWN0b3IiLCJQSVhJLkF1ZGlvTWFuYWdlci5nZXRBdWRpbyIsIlBJWEkuQXVkaW9NYW5hZ2VyLnBhdXNlQWxsTGluZXMiLCJQSVhJLkF1ZGlvTWFuYWdlci5yZXN1bWVBbGxMaW5lcyIsIlBJWEkuQXVkaW9NYW5hZ2VyLnBsYXkiLCJQSVhJLkF1ZGlvTWFuYWdlci5wbGF5TXVzaWMiLCJQSVhJLkF1ZGlvTWFuYWdlci5wbGF5U291bmQiLCJQSVhJLkF1ZGlvTWFuYWdlci5zdG9wIiwiUElYSS5BdWRpb01hbmFnZXIuc3RvcE11c2ljIiwiUElYSS5BdWRpb01hbmFnZXIuc3RvcFNvdW5kIiwiUElYSS5BdWRpb01hbmFnZXIucGF1c2UiLCJQSVhJLkF1ZGlvTWFuYWdlci5wYXVzZU11c2ljIiwiUElYSS5BdWRpb01hbmFnZXIucGF1c2VTb3VuZCIsIlBJWEkuQXVkaW9NYW5hZ2VyLnJlc3VtZSIsIlBJWEkuQXVkaW9NYW5hZ2VyLnJlc3VtZU11c2ljIiwiUElYSS5BdWRpb01hbmFnZXIucmVzdW1lU291bmQiLCJQSVhJLkF1ZGlvTWFuYWdlci5tdXRlIiwiUElYSS5BdWRpb01hbmFnZXIubXV0ZU11c2ljIiwiUElYSS5BdWRpb01hbmFnZXIubXV0ZVNvdW5kIiwiUElYSS5BdWRpb01hbmFnZXIudW5tdXRlIiwiUElYSS5BdWRpb01hbmFnZXIudW5tdXRlTXVzaWMiLCJQSVhJLkF1ZGlvTWFuYWdlci51bm11dGVTb3VuZCIsIlBJWEkuQXVkaW9NYW5hZ2VyLl9wYXVzZSIsIlBJWEkuQXVkaW9NYW5hZ2VyLl9yZXN1bWUiLCJQSVhJLkF1ZGlvTWFuYWdlci5fcGxheSIsIlBJWEkuQXVkaW9NYW5hZ2VyLl9zdG9wIiwiUElYSS5BdWRpb01hbmFnZXIuX211dGUiLCJQSVhJLkF1ZGlvTWFuYWdlci5fdW5tdXRlIiwiUElYSS5BdWRpb01hbmFnZXIuX2dldExpbmVzQnlJZCIsIlBJWEkuQXVkaW9NYW5hZ2VyLl9nZXRBdmFpbGFibGVMaW5lRnJvbSIsIlBJWEkuQXVkaW9NYW5hZ2VyLmNyZWF0ZUdhaW5Ob2RlIiwiUElYSS5BdWRpbyIsIlBJWEkuQXVkaW8uY29uc3RydWN0b3IiLCJQSVhJLkF1ZGlvLnBsYXkiLCJQSVhJLkF1ZGlvLnN0b3AiLCJQSVhJLkF1ZGlvLm11dGUiLCJQSVhJLkF1ZGlvLnVubXV0ZSIsIlBJWEkuQXVkaW8ucGF1c2UiLCJQSVhJLkF1ZGlvLnJlc3VtZSIsIlBJWEkuQXVkaW8udm9sdW1lIiwic2V0IiwicG9zaXRpb24iLCJ4IiwidmVsb2NpdHkiLCJkZWx0YVRpbWUiLCJ5Iiwicm90YXRpb24iLCJyb3RhdGlvblNwZWVkIiwiaSIsImNoaWxkcmVuIiwidXBkYXRlIiwicGFyZW50IiwiYWRkQ2hpbGQiLCJDb250YWluZXIiLCJfa2lsbGVkT2JqZWN0cyIsInB1c2giLCJyZW1vdmVDaGlsZCJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7SUNMQSxJQUFHLENBQUNBLElBQUosRUFBUztBQUFBLFFBQ0wsTUFBTSxJQUFJQyxLQUFKLENBQVUsd0JBQVYsQ0FBTixDQURLO0FBQUE7SUFJVCxJQUFNQyxxQkFBQSxHQUF3QixPQUE5QjtJQUNBLElBQU1DLFlBQUEsR0FBZUgsSUFBQSxDQUFLSSxPQUFMLENBQWFDLEtBQWIsQ0FBbUIsVUFBbkIsRUFBK0IsQ0FBL0IsQ0FBckI7SUFFQSxJQUFHRixZQUFBLEdBQWVELHFCQUFsQixFQUF3QztBQUFBLFFBQ3BDLE1BQU0sSUFBSUQsS0FBSixDQUFVLGNBQWNELElBQUEsQ0FBS0ksT0FBbkIsR0FBNkIsb0NBQTdCLEdBQW1FRixxQkFBN0UsQ0FBTixDQURvQztBQUFBO0lER3hDO0FBQUEsUUVWSUksU0FBQSxHQUFZQyxLRlVoQjtJRVRBLElBQU9QLElBQVA7SUFBQSxDQUFBLFVBQU9BLElBQVAsRUFBWTtBQUFBLFFBQ1JBLElBQUFBLFNBQUFBLEdBQUFBLFlBQUFBO0FBQUFBLFlBZUlRLFNBQUFBLFNB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T0FBTyxJQUFQLENBRHNEQTtBQUFBQSxTQUExREEsQ0FOUTtBQUFBLEtBQVosQ0FBT0EsSUFBQSxJQUFBLENBQUFBLElBQUEsR0FBSSxFQUFKLENBQVAiLCJmaWxlIjoidHVyYm9waXhpLmpzIiwic291cmNlc0NvbnRlbnQiOltudWxsLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9kZWZzL3BpeGkuanMuZC50c1wiIC8+XG5pZighUElYSSl7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdFeSEgV2hlcmUgaXMgcGl4aS5qcz8/Jyk7XG59XG5cbmNvbnN0IFBJWElfVkVSU0lPTl9SRVFVSVJFRCA9IFwiMy4wLjdcIjtcbmNvbnN0IFBJWElfVkVSU0lPTiA9IFBJWEkuVkVSU0lPTi5tYXRjaCgvXFxkLlxcZC5cXGQvKVswXTtcblxuaWYoUElYSV9WRVJTSU9OIDwgUElYSV9WRVJTSU9OX1JFUVVJUkVEKXtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJQaXhpLmpzIHZcIiArIFBJWEkuVkVSU0lPTiArIFwiIGl0J3Mgbm90IHN1cHBvcnRlZCwgcGxlYXNlIHVzZSBeXCIgKyBQSVhJX1ZFUlNJT05fUkVRVUlSRUQpO1xufVxuIiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi9BdWRpb01hbmFnZXIudHNcIiAvPlxudmFyIEhUTUxBdWRpbyA9IEF1ZGlvO1xubW9kdWxlIFBJWEkge1xuICAgIGV4cG9ydCBjbGFzcyBBdWRpb0xpbmUge1xuICAgICAgICBhdmFpbGFibGU6Ym9vbGVhbiA9IHRydWU7XG4gICAgICAgIGF1ZGlvOkF1ZGlvO1xuICAgICAgICBsb29wOmJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgcGF1c2VkOmJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgY2FsbGJhY2s6RnVuY3Rpb247XG4gICAgICAgIG11dGVkOmJvb2xlYW4gPSBmYWxzZTtcblxuICAgICAgICBzdGFydFRpbWU6bnVtYmVyID0gMDtcbiAgICAgICAgbGFzdFBhdXNlVGltZTpudW1iZXIgPSAwO1xuICAgICAgICBvZmZzZXRUaW1lOm51bWJlciA9IDA7XG5cbiAgICAgICAgcHJpdmF0ZSBfaHRtbEF1ZGlvOkhUTUxBdWRpb0VsZW1lbnQ7XG4gICAgICAgIHByaXZhdGUgX3dlYkF1ZGlvOkF1ZGlvQnVmZmVyU291cmNlTm9kZTtcblxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbWFuYWdlcjpBdWRpb01hbmFnZXIpe1xuICAgICAgICAgICAgaWYoIXRoaXMubWFuYWdlci5jb250ZXh0KXtcbiAgICAgICAgICAgICAgICB0aGlzLl9odG1sQXVkaW8gPSBuZXcgSFRNTEF1ZGlvKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5faHRtbEF1ZGlvLmFkZEV2ZW50TGlzdGVuZXIoJ2VuZGVkJywgdGhpcy5fb25FbmQuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzZXRBdWRpbyhhdWRpbzpBdWRpbywgbG9vcDpib29sZWFufEZ1bmN0aW9uLCBjYWxsYmFjaz86RnVuY3Rpb24pOkF1ZGlvTGluZXtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBsb29wID09PSBcImZ1bmN0aW9uXCIpe1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrID0gPEZ1bmN0aW9uPmxvb3A7XG4gICAgICAgICAgICAgICAgbG9vcCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmF1ZGlvID0gYXVkaW87XG4gICAgICAgICAgICB0aGlzLmF2YWlsYWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5sb29wID0gPGJvb2xlYW4+bG9vcDtcbiAgICAgICAgICAgIHRoaXMuY2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcGxheShwYXVzZT86Ym9vbGVhbik6QXVkaW9MaW5lIHtcbiAgICAgICAgICAgIGlmKCFwYXVzZSAmJiB0aGlzLnBhdXNlZClyZXR1cm4gdGhpcztcblxuICAgICAgICAgICAgaWYodGhpcy5tYW5hZ2VyLmNvbnRleHQpe1xuICAgICAgICAgICAgICAgIHRoaXMuX3dlYkF1ZGlvID0gdGhpcy5tYW5hZ2VyLmNvbnRleHQuY3JlYXRlQnVmZmVyU291cmNlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fd2ViQXVkaW8uc3RhcnQgPSB0aGlzLl93ZWJBdWRpby5zdGFydCB8fCB0aGlzLl93ZWJBdWRpby5ub3RlT247XG4gICAgICAgICAgICAgICAgdGhpcy5fd2ViQXVkaW8uc3RvcCA9IHRoaXMuX3dlYkF1ZGlvLnN0b3AgfHwgdGhpcy5fd2ViQXVkaW8ubm90ZU9mZjtcblxuICAgICAgICAgICAgICAgIHRoaXMuX3dlYkF1ZGlvLmJ1ZmZlciA9IHRoaXMuYXVkaW8uc291cmNlO1xuICAgICAgICAgICAgICAgIHRoaXMuX3dlYkF1ZGlvLmxvb3AgPSB0aGlzLmxvb3AgfHwgdGhpcy5hdWRpby5sb29wO1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRUaW1lID0gdGhpcy5tYW5hZ2VyLmNvbnRleHQuY3VycmVudFRpbWU7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl93ZWJBdWRpby5vbmVuZGVkID0gdGhpcy5fb25FbmQuYmluZCh0aGlzKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuX3dlYkF1ZGlvLmdhaW5Ob2RlID0gdGhpcy5tYW5hZ2VyLmNyZWF0ZUdhaW5Ob2RlKHRoaXMubWFuYWdlci5jb250ZXh0KTtcbiAgICAgICAgICAgICAgICB0aGlzLl93ZWJBdWRpby5nYWluTm9kZS52YWx1ZSA9ICh0aGlzLmF1ZGlvLm11dGVkIHx8IHRoaXMubXV0ZWQpID8gMCA6IHRoaXMuYXVkaW8udm9sdW1lO1xuICAgICAgICAgICAgICAgIHRoaXMuX3dlYkF1ZGlvLmdhaW5Ob2RlLmNvbm5lY3QodGhpcy5tYW5hZ2VyLmdhaW5Ob2RlKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuX3dlYkF1ZGlvLmNvbm5lY3QodGhpcy5fd2ViQXVkaW8uZ2Fpbk5vZGUpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3dlYkF1ZGlvLnN0YXJ0KDAsIChwYXVzZSkgPyB0aGlzLmxhc3RQYXVzZVRpbWUgOiBudWxsKTtcblxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuX3dlYkF1ZGlvLCB0aGlzLl93ZWJBdWRpby5nYWluTm9kZS52YWx1ZSk7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICB0aGlzLl9odG1sQXVkaW8uc3JjID0gKHRoaXMuYXVkaW8uc291cmNlLnNyYyAhPT0gXCJcIikgPyB0aGlzLmF1ZGlvLnNvdXJjZS5zcmMgOiB0aGlzLmF1ZGlvLnNvdXJjZS5jaGlsZHJlblswXS5zcmM7XG4gICAgICAgICAgICAgICAgdGhpcy5faHRtbEF1ZGlvLnByZWxvYWQgPSBcImF1dG9cIjtcbiAgICAgICAgICAgICAgICB0aGlzLl9odG1sQXVkaW8udm9sdW1lID0gKHRoaXMuYXVkaW8ubXV0ZWQgfHwgdGhpcy5tdXRlZCkgPyAwIDogdGhpcy5hdWRpby52b2x1bWU7XG4gICAgICAgICAgICAgICAgdGhpcy5faHRtbEF1ZGlvLmxvYWQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9odG1sQXVkaW8ucGxheSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHN0b3AoKTpBdWRpb0xpbmUge1xuICAgICAgICAgICAgaWYodGhpcy5tYW5hZ2VyLmNvbnRleHQpe1xuICAgICAgICAgICAgICAgIHRoaXMuX3dlYkF1ZGlvLnN0b3AoMCk7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICB0aGlzLl9odG1sQXVkaW8ucGF1c2UoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9odG1sQXVkaW8uY3VycmVudFRpbWUgPSAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHBhdXNlKCk6QXVkaW9MaW5le1xuICAgICAgICAgICAgaWYodGhpcy5tYW5hZ2VyLmNvbnRleHQpe1xuXG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICB0aGlzLl9odG1sQXVkaW8ucGF1c2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucGF1c2VkID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzdW1lKCk6QXVkaW9MaW5le1xuICAgICAgICAgICAgaWYodGhpcy5wYXVzZWQpe1xuICAgICAgICAgICAgICAgIGlmKHRoaXMubWFuYWdlci5jb250ZXh0KXtcblxuICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9odG1sQXVkaW8ucGxheSgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMucGF1c2VkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIG11dGUoKTpBdWRpb0xpbmV7XG4gICAgICAgICAgICB0aGlzLm11dGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmKHRoaXMubWFuYWdlci5jb250ZXh0KXtcblxuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgdGhpcy5faHRtbEF1ZGlvLnZvbHVtZSA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHVubXV0ZSgpOkF1ZGlvTGluZXtcbiAgICAgICAgICAgIHRoaXMubXV0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMubXV0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgaWYodGhpcy5tYW5hZ2VyLmNvbnRleHQpe1xuXG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICB0aGlzLl9odG1sQXVkaW8udm9sdW1lID0gdGhpcy5hdWRpby52b2x1bWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHZvbHVtZSh2YWx1ZTpudW1iZXIpOkF1ZGlvTGluZXtcbiAgICAgICAgICAgIGlmKHRoaXMubWFuYWdlci5jb250ZXh0KXtcblxuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgdGhpcy5faHRtbEF1ZGlvLnZvbHVtZSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICByZXNldCgpOkF1ZGlvTGluZXtcbiAgICAgICAgICAgIHRoaXMuYXZhaWxhYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuYXVkaW8gPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5sb29wID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmNhbGxiYWNrID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMucGF1c2VkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLm11dGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLl93ZWJBdWRpbyA9IG51bGw7XG5cbiAgICAgICAgICAgIHRoaXMuc3RhcnRUaW1lID0gMDtcbiAgICAgICAgICAgIHRoaXMubGFzdFBhdXNlVGltZSA9IDA7XG4gICAgICAgICAgICB0aGlzLm9mZnNldFRpbWUgPSAwO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9vbkVuZCgpOnZvaWR7XG4gICAgICAgICAgICBpZih0aGlzLmNhbGxiYWNrKXRoaXMuY2FsbGJhY2sodGhpcy5tYW5hZ2VyLCB0aGlzLmF1ZGlvKTtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2VuZCcpXG4gICAgICAgICAgICBpZighdGhpcy5tYW5hZ2VyLmNvbnRleHQpe1xuICAgICAgICAgICAgICAgIGlmKHRoaXMubG9vcCB8fCB0aGlzLmF1ZGlvLmxvb3Ape1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9odG1sQXVkaW8uY3VycmVudFRpbWUgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9odG1sQXVkaW8ucGxheSgpO1xuICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfWVsc2UgaWYodGhpcy5tYW5hZ2VyLmNvbnRleHQgJiYgIXRoaXMucGF1c2VkKXtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbn1cblxuaW50ZXJmYWNlIEF1ZGlvQnVmZmVyU291cmNlTm9kZSB7XG4gICAgbm90ZU9uKCk6QXVkaW9CdWZmZXJTb3VyY2VOb2RlO1xuICAgIG5vdGVPZmYoKTpBdWRpb0J1ZmZlclNvdXJjZU5vZGU7XG4gICAgc291cmNlOkF1ZGlvQnVmZmVyO1xuICAgIGdhaW5Ob2RlOmFueTtcbn0iLCJtb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IGVudW0gR0FNRV9TQ0FMRV9UWVBFIHtcbiAgICAgICAgTk9ORSxcbiAgICAgICAgRklMTCxcbiAgICAgICAgQVNQRUNUX0ZJVCxcbiAgICAgICAgQVNQRUNUX0ZJTExcbiAgICB9XG5cbiAgICBleHBvcnQgZW51bSBBVURJT19UWVBFIHtcbiAgICAgICAgVU5LTk9XTixcbiAgICAgICAgV0VCQVVESU8sXG4gICAgICAgIEhUTUxBVURJT1xuICAgIH1cbn0iLCIvL01hbnkgY2hlY2tzIGFyZSBiYXNlZCBvbiBodHRwczovL2dpdGh1Yi5jb20vYXJhc2F0YXNheWdpbi9pcy5qcy9ibG9iL21hc3Rlci9pcy5qc1xuXG5tb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IG1vZHVsZSBEZXZpY2Uge1xuICAgICAgICB2YXIgbmF2aWdhdG9yOk5hdmlnYXRvciA9IHdpbmRvdy5uYXZpZ2F0b3I7XG4gICAgICAgIHZhciBkb2N1bWVudDpEb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcblxuICAgICAgICB2YXIgdXNlckFnZW50OnN0cmluZyA9ICduYXZpZ2F0b3InIGluIHdpbmRvdyAmJiAndXNlckFnZW50JyBpbiBuYXZpZ2F0b3IgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpIHx8ICcnLFxuICAgICAgICAgICAgdmVuZG9yOnN0cmluZyA9ICduYXZpZ2F0b3InIGluIHdpbmRvdyAmJiAndmVuZG9yJyBpbiBuYXZpZ2F0b3IgJiYgbmF2aWdhdG9yLnZlbmRvci50b0xvd2VyQ2FzZSgpIHx8ICcnLFxuICAgICAgICAgICAgYXBwVmVyc2lvbjpzdHJpbmcgPSAnbmF2aWdhdG9yJyBpbiB3aW5kb3cgJiYgJ2FwcFZlcnNpb24nIGluIG5hdmlnYXRvciAmJiBuYXZpZ2F0b3IuYXBwVmVyc2lvbi50b0xvd2VyQ2FzZSgpIHx8ICcnO1xuXG4gICAgICAgIC8vQnJvd3NlcnNcbiAgICAgICAgZXhwb3J0IHZhciBpc0Nocm9tZTpib29sZWFuID0gL2Nocm9tZXxjaHJvbWl1bS9pLnRlc3QodXNlckFnZW50KSAmJiAvZ29vZ2xlIGluYy8udGVzdCh2ZW5kb3IpLFxuICAgICAgICAgICAgaXNGaXJlZm94OmJvb2xlYW4gPSAvZmlyZWZveC9pLnRlc3QodXNlckFnZW50KSxcbiAgICAgICAgICAgIGlzSUU6Ym9vbGVhbiA9IC9tc2llL2kudGVzdCh1c2VyQWdlbnQpIHx8IFwiQWN0aXZlWE9iamVjdFwiIGluIHdpbmRvdyxcbiAgICAgICAgICAgIGlzT3BlcmE6Ym9vbGVhbiA9IC9eT3BlcmFcXC8vLnRlc3QodXNlckFnZW50KSB8fCAvXFx4MjBPUFJcXC8vLnRlc3QodXNlckFnZW50KSxcbiAgICAgICAgICAgIGlzU2FmYXJpOmJvb2xlYW4gPSAvc2FmYXJpL2kudGVzdCh1c2VyQWdlbnQpICYmIC9hcHBsZSBjb21wdXRlci9pLnRlc3QodmVuZG9yKTtcblxuICAgICAgICAvL0RldmljZXMgJiYgT1NcbiAgICAgICAgZXhwb3J0IHZhciBpc0lwaG9uZTpib29sZWFuID0gL2lwaG9uZS9pLnRlc3QodXNlckFnZW50KSxcbiAgICAgICAgICAgIGlzSXBhZDpib29sZWFuID0gL2lwYWQvaS50ZXN0KHVzZXJBZ2VudCksXG4gICAgICAgICAgICBpc0lwb2Q6Ym9vbGVhbiA9IC9pcG9kL2kudGVzdCh1c2VyQWdlbnQpLFxuICAgICAgICAgICAgaXNBbmRyb2lkOmJvb2xlYW4gPSAvYW5kcm9pZC9pLnRlc3QodXNlckFnZW50KSxcbiAgICAgICAgICAgIGlzQW5kcm9pZFBob25lOmJvb2xlYW4gPSAvYW5kcm9pZC9pLnRlc3QodXNlckFnZW50KSAmJiAvbW9iaWxlL2kudGVzdCh1c2VyQWdlbnQpLFxuICAgICAgICAgICAgaXNBbmRyb2lkVGFibGV0OmJvb2xlYW4gPSAvYW5kcm9pZC9pLnRlc3QodXNlckFnZW50KSAmJiAhL21vYmlsZS9pLnRlc3QodXNlckFnZW50KSxcbiAgICAgICAgICAgIGlzTGludXg6Ym9vbGVhbiA9IC9saW51eC9pLnRlc3QoYXBwVmVyc2lvbiksXG4gICAgICAgICAgICBpc01hYzpib29sZWFuID0gL21hYy9pLnRlc3QoYXBwVmVyc2lvbiksXG4gICAgICAgICAgICBpc1dpbmRvdzpib29sZWFuID0gL3dpbi9pLnRlc3QoYXBwVmVyc2lvbiksXG4gICAgICAgICAgICBpc1dpbmRvd1Bob25lOmJvb2xlYW4gPSBpc1dpbmRvdyAmJiAvcGhvbmUvaS50ZXN0KHVzZXJBZ2VudCksXG4gICAgICAgICAgICBpc1dpbmRvd1RhYmxldDpib29sZWFuID0gaXNXaW5kb3cgJiYgIWlzV2luZG93UGhvbmUgJiYgL3RvdWNoL2kudGVzdCh1c2VyQWdlbnQpLFxuICAgICAgICAgICAgaXNNb2JpbGU6Ym9vbGVhbiA9IGlzSXBob25lIHx8IGlzSXBvZHx8IGlzQW5kcm9pZFBob25lIHx8IGlzV2luZG93UGhvbmUsXG4gICAgICAgICAgICBpc1RhYmxldDpib29sZWFuID0gaXNJcGFkIHx8IGlzQW5kcm9pZFRhYmxldCB8fCBpc1dpbmRvd1RhYmxldCxcbiAgICAgICAgICAgIGlzRGVza3RvcDpib29sZWFuID0gIWlzTW9iaWxlICYmICFpc1RhYmxldCxcbiAgICAgICAgICAgIGlzVG91Y2hEZXZpY2U6Ym9vbGVhbiA9ICdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdyB8fCdEb2N1bWVudFRvdWNoJyBpbiB3aW5kb3cgJiYgZG9jdW1lbnQgaW5zdGFuY2VvZiBEb2N1bWVudFRvdWNoLFxuICAgICAgICAgICAgaXNDb2Nvb246Ym9vbGVhbiA9ICEhbmF2aWdhdG9yLmlzQ29jb29uSlMsXG4gICAgICAgICAgICBpc05vZGVXZWJraXQ6Ym9vbGVhbiA9ICEhKHR5cGVvZiBwcm9jZXNzID09PSBcIm9iamVjdFwiICYmIHByb2Nlc3MudGl0bGUgPT09IFwibm9kZVwiICYmIHR5cGVvZiBnbG9iYWwgPT09IFwib2JqZWN0XCIpLFxuICAgICAgICAgICAgaXNFamVjdGE6Ym9vbGVhbiA9ICEhd2luZG93LmVqZWN0YSxcbiAgICAgICAgICAgIGlzQ3Jvc3N3YWxrOmJvb2xlYW4gPSAvQ3Jvc3N3YWxrLy50ZXN0KHVzZXJBZ2VudCksXG4gICAgICAgICAgICBpc0NvcmRvdmE6Ym9vbGVhbiA9ICEhd2luZG93LmNvcmRvdmEsXG4gICAgICAgICAgICBpc0VsZWN0cm9uOmJvb2xlYW4gPSAhISh0eXBlb2YgcHJvY2VzcyA9PT0gXCJvYmplY3RcIiAmJiBwcm9jZXNzLnZlcnNpb25zICYmIChwcm9jZXNzLnZlcnNpb25zLmVsZWN0cm9uIHx8IHByb2Nlc3MudmVyc2lvbnNbJ2F0b20tc2hlbGwnXSkpO1xuXG4gICAgICAgIGV4cG9ydCB2YXIgaXNWaWJyYXRlU3VwcG9ydGVkOmJvb2xlYW4gPSAhIW5hdmlnYXRvci52aWJyYXRlICYmIChpc01vYmlsZSB8fCBpc1RhYmxldCksXG4gICAgICAgICAgICBpc01vdXNlV2hlZWxTdXBwb3J0ZWQ6Ym9vbGVhbiA9ICdvbndoZWVsJyBpbiB3aW5kb3cgfHwgJ29ubW91c2V3aGVlbCcgaW4gd2luZG93IHx8ICdNb3VzZVNjcm9sbEV2ZW50JyBpbiB3aW5kb3csXG4gICAgICAgICAgICBpc0FjY2VsZXJvbWV0ZXJTdXBwb3J0ZWQ6Ym9vbGVhbiA9ICdEZXZpY2VNb3Rpb25FdmVudCcgaW4gd2luZG93LFxuICAgICAgICAgICAgaXNHYW1lcGFkU3VwcG9ydGVkOmJvb2xlYW4gPSAhIW5hdmlnYXRvci5nZXRHYW1lcGFkcyB8fCAhIW5hdmlnYXRvci53ZWJraXRHZXRHYW1lcGFkcztcblxuICAgICAgICAvL0Z1bGxTY3JlZW5cbiAgICAgICAgdmFyIGRpdjpIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB2YXIgZnVsbFNjcmVlblJlcXVlc3RWZW5kb3I6YW55ID0gZGl2LnJlcXVlc3RGdWxsc2NyZWVuIHx8IGRpdi53ZWJraXRSZXF1ZXN0RnVsbFNjcmVlbiB8fCBkaXYubXNSZXF1ZXN0RnVsbFNjcmVlbiB8fCBkaXYubW96UmVxdWVzdEZ1bGxTY3JlZW4sXG4gICAgICAgICAgICBmdWxsU2NyZWVuQ2FuY2VsVmVuZG9yOmFueSA9IGRvY3VtZW50LmNhbmNlbEZ1bGxTY3JlZW4gfHwgZG9jdW1lbnQuZXhpdEZ1bGxTY3JlZW4gfHwgZG9jdW1lbnQud2Via2l0Q2FuY2VsRnVsbFNjcmVlbiB8fCBkb2N1bWVudC5tc0NhbmNlbEZ1bGxTY3JlZW4gfHwgZG9jdW1lbnQubW96Q2FuY2VsRnVsbFNjcmVlbjtcblxuICAgICAgICBleHBvcnQgdmFyIGlzRnVsbFNjcmVlblN1cHBvcnRlZDpib29sZWFuID0gISEoZnVsbFNjcmVlblJlcXVlc3QgJiYgZnVsbFNjcmVlbkNhbmNlbCksXG4gICAgICAgICAgICBmdWxsU2NyZWVuUmVxdWVzdDpzdHJpbmcgPSAoZnVsbFNjcmVlblJlcXVlc3RWZW5kb3IpID8gZnVsbFNjcmVlblJlcXVlc3RWZW5kb3IubmFtZSA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGZ1bGxTY3JlZW5DYW5jZWw6c3RyaW5nID0gKGZ1bGxTY3JlZW5DYW5jZWxWZW5kb3IpID8gZnVsbFNjcmVlbkNhbmNlbFZlbmRvci5uYW1lIDogdW5kZWZpbmVkO1xuXG4gICAgICAgIC8vQXVkaW9cbiAgICAgICAgZXhwb3J0IHZhciBpc0hUTUxBdWRpb1N1cHBvcnRlZDpib29sZWFuID0gISF3aW5kb3cuQXVkaW8sXG4gICAgICAgICAgICB3ZWJBdWRpb0NvbnRleHQ6YW55ID0gd2luZG93LkF1ZGlvQ29udGV4dCB8fCB3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0LFxuICAgICAgICAgICAgaXNXZWJBdWRpb1N1cHBvcnRlZDpib29sZWFuID0gISF3ZWJBdWRpb0NvbnRleHQsXG4gICAgICAgICAgICBpc0F1ZGlvU3VwcG9ydGVkOmJvb2xlYW4gPSBpc1dlYkF1ZGlvU3VwcG9ydGVkIHx8IGlzSFRNTEF1ZGlvU3VwcG9ydGVkLFxuICAgICAgICAgICAgaXNNcDNTdXBwb3J0ZWQ6Ym9vbGVhbiA9IGZhbHNlLFxuICAgICAgICAgICAgaXNPZ2dTdXBwb3J0ZWQ6Ym9vbGVhbiA9IGZhbHNlLFxuICAgICAgICAgICAgaXNXYXZTdXBwb3J0ZWQ6Ym9vbGVhbiA9IGZhbHNlLFxuICAgICAgICAgICAgaXNNNGFTdXBwb3J0ZWQ6Ym9vbGVhbiA9IGZhbHNlLFxuICAgICAgICAgICAgZ2xvYmFsV2ViQXVkaW9Db250ZXh0OkF1ZGlvQ29udGV4dCA9IChpc1dlYkF1ZGlvU3VwcG9ydGVkKSA/IG5ldyB3ZWJBdWRpb0NvbnRleHQoKSA6IHVuZGVmaW5lZDtcblxuICAgICAgICAvL0F1ZGlvIG1pbWVUeXBlc1xuICAgICAgICBpZihpc0F1ZGlvU3VwcG9ydGVkKXtcbiAgICAgICAgICAgIHZhciBhdWRpbzpIVE1MQXVkaW9FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYXVkaW8nKTtcbiAgICAgICAgICAgIGlzTXAzU3VwcG9ydGVkID0gYXVkaW8uY2FuUGxheVR5cGUoJ2F1ZGlvL21wZWc7JykgIT09IFwiXCI7XG4gICAgICAgICAgICBpc09nZ1N1cHBvcnRlZCA9IGF1ZGlvLmNhblBsYXlUeXBlKCdhdWRpby9vZ2c7IGNvZGVjcz1cInZvcmJpc1wiJykgIT09IFwiXCI7XG4gICAgICAgICAgICBpc1dhdlN1cHBvcnRlZCA9IGF1ZGlvLmNhblBsYXlUeXBlKCdhdWRpby93YXYnKSAhPT0gXCJcIjtcbiAgICAgICAgICAgIGlzTTRhU3VwcG9ydGVkID0gYXVkaW8uY2FuUGxheVR5cGUoJ2F1ZGlvL21wNDsgY29kZWNzPVwibXA0YS40MC41XCInKSAhPT0gXCJcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBnZXRNb3VzZVdoZWVsRXZlbnQoKTpzdHJpbmd7XG4gICAgICAgICAgICBpZighaXNNb3VzZVdoZWVsU3VwcG9ydGVkKXJldHVybjtcbiAgICAgICAgICAgIHZhciBldnQ6c3RyaW5nO1xuICAgICAgICAgICAgaWYoJ29ud2hlZWwnIGluIHdpbmRvdyl7XG4gICAgICAgICAgICAgICAgZXZ0ID0gJ3doZWVsJztcbiAgICAgICAgICAgIH1lbHNlIGlmKCdvbm1vdXNld2hlZWwnIGluIHdpbmRvdyl7XG4gICAgICAgICAgICAgICAgZXZ0ID0gJ21vdXNld2hlZWwnO1xuICAgICAgICAgICAgfWVsc2UgaWYoJ01vdXNlU2Nyb2xsRXZlbnQnIGluIHdpbmRvdyl7XG4gICAgICAgICAgICAgICAgZXZ0ID0gJ0RPTU1vdXNlU2Nyb2xsJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGV2dDtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiB2aWJyYXRlKHBhdHRlcm46IG51bWJlciB8IG51bWJlcltdKTp2b2lke1xuICAgICAgICAgICAgaWYoaXNWaWJyYXRlU3VwcG9ydGVkKXtcbiAgICAgICAgICAgICAgICBuYXZpZ2F0b3IudmlicmF0ZShwYXR0ZXJuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBnZXRWaXNpYmlsaXR5Q2hhbmdlRXZlbnQoKTpzdHJpbmd7XG4gICAgICAgICAgICBpZih0eXBlb2YgZG9jdW1lbnQuaGlkZGVuICE9PSAndW5kZWZpbmVkJyl7XG4gICAgICAgICAgICAgICAgcmV0dXJuICd2aXNpYmlsaXR5Y2hhbmdlJztcbiAgICAgICAgICAgIH1lbHNlIGlmKHR5cGVvZiBkb2N1bWVudC53ZWJraXRIaWRkZW4gIT09ICd1bmRlZmluZWQnKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ3dlYmtpdHZpc2liaWxpdHljaGFuZ2UnO1xuICAgICAgICAgICAgfWVsc2UgaWYodHlwZW9mIGRvY3VtZW50Lm1vekhpZGRlbiAhPT0gJ3VuZGVmaW5lZCcpe1xuICAgICAgICAgICAgICAgIHJldHVybiAnbW96dmlzaWJpbGl0eWNoYW5nZSc7XG4gICAgICAgICAgICB9ZWxzZSBpZih0eXBlb2YgZG9jdW1lbnQubXNIaWRkZW4gIT09ICd1bmRlZmluZWQnKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ21zdmlzaWJpbGl0eWNoYW5nZSc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gaXNPbmxpbmUoKTpib29sZWFue1xuICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5uYXZpZ2F0b3Iub25MaW5lO1xuICAgICAgICB9XG5cblxuICAgIH1cbn1cblxuZGVjbGFyZSB2YXIgcHJvY2VzczphbnksXG4gICAgRG9jdW1lbnRUb3VjaDphbnksXG4gICAgZ2xvYmFsOmFueTtcblxuaW50ZXJmYWNlIE5hdmlnYXRvciB7XG4gICAgaXNDb2Nvb25KUzphbnk7XG4gICAgdmlicmF0ZShwYXR0ZXJuOiBudW1iZXIgfCBudW1iZXJbXSk6Ym9vbGVhbjtcbiAgICBnZXRHYW1lcGFkcygpOmFueTtcbiAgICB3ZWJraXRHZXRHYW1lcGFkcygpOmFueTtcbn1cblxuaW50ZXJmYWNlIFdpbmRvdyB7XG4gICAgZWplY3RhOmFueTtcbiAgICBjb3Jkb3ZhOmFueTtcbiAgICBBdWRpbygpOkhUTUxBdWRpb0VsZW1lbnQ7XG4gICAgQXVkaW9Db250ZXh0KCk6YW55O1xuICAgIHdlYmtpdEF1ZGlvQ29udGV4dCgpOmFueTtcbn1cblxuaW50ZXJmYWNlIGZ1bGxTY3JlZW5EYXRhIHtcbiAgICBuYW1lOnN0cmluZztcbn1cblxuaW50ZXJmYWNlIERvY3VtZW50IHtcbiAgICBjYW5jZWxGdWxsU2NyZWVuKCk6ZnVsbFNjcmVlbkRhdGEgO1xuICAgIGV4aXRGdWxsU2NyZWVuKCk6ZnVsbFNjcmVlbkRhdGEgO1xuICAgIHdlYmtpdENhbmNlbEZ1bGxTY3JlZW4oKTpmdWxsU2NyZWVuRGF0YSA7XG4gICAgbXNDYW5jZWxGdWxsU2NyZWVuKCk6ZnVsbFNjcmVlbkRhdGEgO1xuICAgIG1vekNhbmNlbEZ1bGxTY3JlZW4oKTpmdWxsU2NyZWVuRGF0YSA7XG4gICAgd2Via2l0SGlkZGVuOmFueTtcbiAgICBtb3pIaWRkZW46YW55O1xufVxuXG5pbnRlcmZhY2UgSFRNTERpdkVsZW1lbnQge1xuICAgIHJlcXVlc3RGdWxsc2NyZWVuKCk6ZnVsbFNjcmVlbkRhdGEgO1xuICAgIHdlYmtpdFJlcXVlc3RGdWxsU2NyZWVuKCk6ZnVsbFNjcmVlbkRhdGEgO1xuICAgIG1zUmVxdWVzdEZ1bGxTY3JlZW4oKTpmdWxsU2NyZWVuRGF0YSA7XG4gICAgbW96UmVxdWVzdEZ1bGxTY3JlZW4oKTpmdWxsU2NyZWVuRGF0YSA7XG59IiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vZGVmcy9waXhpLmpzLmQudHNcIiAvPlxubW9kdWxlIFBJWEkge1xuICAgIGV4cG9ydCBjbGFzcyBTY2VuZSBleHRlbmRzIENvbnRhaW5lciB7XG4gICAgICAgIGlkOnN0cmluZztcbiAgICAgICAgc3RhdGljIF9pZExlbjpudW1iZXIgPSAwO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGlkOnN0cmluZyA9IChcInNjZW5lXCIgKyBTY2VuZS5faWRMZW4rKykgKXtcbiAgICAgICAgICAgIHN1cGVyKCk7XG4gICAgICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIH1cblxuICAgICAgICBhZGRUbyhnYW1lOkdhbWV8Q29udGFpbmVyKTpTY2VuZSB7XG4gICAgICAgICAgICBpZihnYW1lIGluc3RhbmNlb2YgR2FtZSl7XG4gICAgICAgICAgICAgICAgPEdhbWU+Z2FtZS5hZGRTY2VuZSh0aGlzKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignU2NlbmVzIGNhbiBvbmx5IGJlIGFkZGVkIHRvIHRoZSBnYW1lJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgIH1cbn0iLCJtb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IGNsYXNzIElucHV0TWFuYWdlcntcbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBnYW1lOiBHYW1lKXtcblxuICAgICAgICB9XG4gICAgfVxufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2RlZnMvcGl4aS5qcy5kLnRzXCIgLz5cbm1vZHVsZSBQSVhJIHtcbiAgICBleHBvcnQgZnVuY3Rpb24gYml0bWFwRm9udFBhcnNlclRYVCgpOkZ1bmN0aW9ue1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24ocmVzb3VyY2U6IGxvYWRlcnMuUmVzb3VyY2UsIG5leHQ6RnVuY3Rpb24pOnZvaWR7XG5cbiAgICAgICAgICAgIC8vc2tpcCBpZiBubyBkYXRhIG9yIGlmIG5vdCB0eHRcbiAgICAgICAgICAgIGlmKCFyZXNvdXJjZS5kYXRhIHx8IChyZXNvdXJjZS54aHJUeXBlICE9PSBcInRleHRcIiAmJiByZXNvdXJjZS54aHJUeXBlICE9PSBcImRvY3VtZW50XCIpKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV4dCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgdGV4dDpzdHJpbmcgPSAocmVzb3VyY2UueGhyVHlwZSA9PT0gXCJ0ZXh0XCIpID8gcmVzb3VyY2UuZGF0YSA6IHJlc291cmNlLnhoci5yZXNwb25zZVRleHQ7XG5cbiAgICAgICAgICAgIC8vc2tpcCBpZiBub3QgYSBiaXRtYXAgZm9udCBkYXRhXG4gICAgICAgICAgICBpZiggdGV4dC5pbmRleE9mKFwicGFnZVwiKSA9PT0gLTEgfHxcbiAgICAgICAgICAgICAgICB0ZXh0LmluZGV4T2YoXCJmYWNlXCIpID09PSAtMSB8fFxuICAgICAgICAgICAgICAgIHRleHQuaW5kZXhPZihcImluZm9cIikgPT09IC0xIHx8XG4gICAgICAgICAgICAgICAgdGV4dC5pbmRleE9mKFwiY2hhclwiKSA9PT0gLTEgKXtcblxuICAgICAgICAgICAgICAgIHJldHVybiBuZXh0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciB1cmw6c3RyaW5nID0gZGlybmFtZShyZXNvdXJjZS51cmwpO1xuICAgICAgICAgICAgaWYodXJsID09PSBcIi5cIil7XG4gICAgICAgICAgICAgICAgdXJsID0gXCJcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYodGhpcy5iYXNlVXJsICYmIHVybCl7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5iYXNlVXJsLmNoYXJBdCh0aGlzLmJhc2VVcmwubGVuZ3RoLTEpPT09ICcvJyl7XG4gICAgICAgICAgICAgICAgICAgIHVybCArPSAnLyc7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdXJsLnJlcGxhY2UodGhpcy5iYXNlVXJsLCAnJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKHVybCAmJiB1cmwuY2hhckF0KHVybC5sZW5ndGggLSAxKSAhPT0gJy8nKXtcbiAgICAgICAgICAgICAgICB1cmwgKz0gJy8nO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgdGV4dHVyZVVybDpzdHJpbmcgPSBnZXRUZXh0dXJlVXJsKHVybCwgdGV4dCk7XG4gICAgICAgICAgICBpZih1dGlscy5UZXh0dXJlQ2FjaGVbdGV4dHVyZVVybF0pe1xuICAgICAgICAgICAgICAgIHBhcnNlKHJlc291cmNlLCB1dGlscy5UZXh0dXJlQ2FjaGVbdGV4dHVyZVVybF0pO1xuICAgICAgICAgICAgICAgIG5leHQoKTtcbiAgICAgICAgICAgIH1lbHNle1xuXG4gICAgICAgICAgICAgICAgdmFyIGxvYWRPcHRpb25zOmFueSA9IHtcbiAgICAgICAgICAgICAgICAgICAgY3Jvc3NPcmlnaW46IHJlc291cmNlLmNyb3NzT3JpZ2luLFxuICAgICAgICAgICAgICAgICAgICBsb2FkVHlwZTogbG9hZGVycy5SZXNvdXJjZS5MT0FEX1RZUEUuSU1BR0VcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgdGhpcy5hZGQocmVzb3VyY2UubmFtZSArICdfaW1hZ2UnLCB0ZXh0dXJlVXJsLCBsb2FkT3B0aW9ucywgZnVuY3Rpb24ocmVzOmFueSl7XG4gICAgICAgICAgICAgICAgICAgIHBhcnNlKHJlc291cmNlLCByZXMudGV4dHVyZSk7XG4gICAgICAgICAgICAgICAgICAgIG5leHQoKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIG5leHQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlKHJlc291cmNlOmxvYWRlcnMuUmVzb3VyY2UsIHRleHR1cmU6VGV4dHVyZSl7XG4gICAgICAgIHZhciBjdXJyZW50TGluZTpzdHJpbmcsIGF0dHI6YXR0ckRhdGEsXG4gICAgICAgICAgICBkYXRhOmZvbnREYXRhID0ge1xuICAgICAgICAgICAgICAgIGNoYXJzIDoge31cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgdmFyIHRleHQ6c3RyaW5nID0gKHJlc291cmNlLnhoclR5cGUgPT09IFwidGV4dFwiKSA/IHJlc291cmNlLmRhdGEgOiByZXNvdXJjZS54aHIucmVzcG9uc2VUZXh0O1xuICAgICAgICB2YXIgbGluZXM6c3RyaW5nW10gPSB0ZXh0LnNwbGl0KCdcXG4nKTtcblxuICAgICAgICBmb3IodmFyIGk6bnVtYmVyID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIGlmKGxpbmVzW2ldLmluZGV4T2YoXCJpbmZvXCIpID09PSAwKXtcbiAgICAgICAgICAgICAgICBjdXJyZW50TGluZSA9IGxpbmVzW2ldLnN1YnN0cmluZyg1KTtcbiAgICAgICAgICAgICAgICBhdHRyID0gZ2V0QXR0cihjdXJyZW50TGluZSk7XG5cbiAgICAgICAgICAgICAgICBkYXRhLmZvbnQgPSBhdHRyLmZhY2U7XG4gICAgICAgICAgICAgICAgZGF0YS5zaXplID0gcGFyc2VJbnQoYXR0ci5zaXplKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYobGluZXNbaV0uaW5kZXhPZignY29tbW9uICcpID09PSAwKXtcbiAgICAgICAgICAgICAgICBjdXJyZW50TGluZSA9IGxpbmVzW2ldLnN1YnN0cmluZyg3KTtcbiAgICAgICAgICAgICAgICBhdHRyID0gZ2V0QXR0cihjdXJyZW50TGluZSk7XG4gICAgICAgICAgICAgICAgZGF0YS5saW5lSGVpZ2h0ID0gcGFyc2VJbnQoYXR0ci5saW5lSGVpZ2h0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYobGluZXNbaV0uaW5kZXhPZihcImNoYXIgXCIpID09PSAwKXtcbiAgICAgICAgICAgICAgICBjdXJyZW50TGluZSA9IGxpbmVzW2ldLnN1YnN0cmluZyg1KTtcbiAgICAgICAgICAgICAgICBhdHRyID0gZ2V0QXR0cihjdXJyZW50TGluZSk7XG4gICAgICAgICAgICAgICAgdmFyIGNoYXJDb2RlOm51bWJlciA9IHBhcnNlSW50KGF0dHIuaWQpO1xuXG4gICAgICAgICAgICAgICAgdmFyIHRleHR1cmVSZWN0OlJlY3RhbmdsZSA9IG5ldyBSZWN0YW5nbGUoXG4gICAgICAgICAgICAgICAgICAgIHBhcnNlSW50KGF0dHIueCksXG4gICAgICAgICAgICAgICAgICAgIHBhcnNlSW50KGF0dHIueSksXG4gICAgICAgICAgICAgICAgICAgIHBhcnNlSW50KGF0dHIud2lkdGgpLFxuICAgICAgICAgICAgICAgICAgICBwYXJzZUludChhdHRyLmhlaWdodClcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgZGF0YS5jaGFyc1tjaGFyQ29kZV0gPSB7XG4gICAgICAgICAgICAgICAgICAgIHhPZmZzZXQ6IHBhcnNlSW50KGF0dHIueG9mZnNldCksXG4gICAgICAgICAgICAgICAgICAgIHlPZmZzZXQ6IHBhcnNlSW50KGF0dHIueW9mZnNldCksXG4gICAgICAgICAgICAgICAgICAgIHhBZHZhbmNlOiBwYXJzZUludChhdHRyLnhhZHZhbmNlKSxcbiAgICAgICAgICAgICAgICAgICAga2VybmluZzoge30sXG4gICAgICAgICAgICAgICAgICAgIHRleHR1cmU6IG5ldyBUZXh0dXJlKHRleHR1cmUuYmFzZVRleHR1cmUsIHRleHR1cmVSZWN0KVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKGxpbmVzW2ldLmluZGV4T2YoJ2tlcm5pbmcgJykgPT09IDApe1xuICAgICAgICAgICAgICAgIGN1cnJlbnRMaW5lID0gbGluZXNbaV0uc3Vic3RyaW5nKDgpO1xuICAgICAgICAgICAgICAgIGF0dHIgPSBnZXRBdHRyKGN1cnJlbnRMaW5lKTtcblxuICAgICAgICAgICAgICAgIHZhciBmaXJzdCA9IHBhcnNlSW50KGF0dHIuZmlyc3QpO1xuICAgICAgICAgICAgICAgIHZhciBzZWNvbmQgPSBwYXJzZUludChhdHRyLnNlY29uZCk7XG5cbiAgICAgICAgICAgICAgICBkYXRhLmNoYXJzW3NlY29uZF0ua2VybmluZ1tmaXJzdF0gPSBwYXJzZUludChhdHRyLmFtb3VudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXNvdXJjZS5iaXRtYXBGb250ID0gZGF0YTtcbiAgICAgICAgZXh0cmFzLkJpdG1hcFRleHQuZm9udHNbZGF0YS5mb250XSA9IGRhdGE7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGlybmFtZShwYXRoOnN0cmluZyk6c3RyaW5ne1xuICAgICAgICByZXR1cm4gcGF0aC5yZXBsYWNlKC9cXFxcL2csJy8nKS5yZXBsYWNlKC9cXC9bXlxcL10qJC8sICcnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRUZXh0dXJlVXJsKHVybDpzdHJpbmcsIGRhdGE6c3RyaW5nKTpzdHJpbmd7XG4gICAgICAgIHZhciB0ZXh0dXJlVXJsOnN0cmluZztcbiAgICAgICAgdmFyIGxpbmVzOnN0cmluZ1tdID0gZGF0YS5zcGxpdCgnXFxuJyk7XG5cbiAgICAgICAgZm9yKHZhciBpOm51bWJlciA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICBpZihsaW5lc1tpXS5pbmRleE9mKFwicGFnZVwiKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50TGluZTpzdHJpbmcgPSBsaW5lc1tpXS5zdWJzdHJpbmcoNSk7XG4gICAgICAgICAgICAgICAgdmFyIGZpbGU6c3RyaW5nID0gKGN1cnJlbnRMaW5lLnN1YnN0cmluZyhjdXJyZW50TGluZS5pbmRleE9mKCdmaWxlPScpKSkuc3BsaXQoJz0nKVsxXTtcbiAgICAgICAgICAgICAgICB0ZXh0dXJlVXJsID0gdXJsICsgZmlsZS5zdWJzdHIoMSwgZmlsZS5sZW5ndGgtMik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGV4dHVyZVVybDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRBdHRyKGxpbmU6c3RyaW5nKTphdHRyRGF0YXtcbiAgICAgICAgdmFyIHJlZ2V4OlJlZ0V4cCA9IC9cIihcXHcqXFxkKlxccyooLXxfKSopKlwiL2csXG4gICAgICAgICAgICBhdHRyOnN0cmluZ1tdID0gbGluZS5zcGxpdCgvXFxzKy9nKSxcbiAgICAgICAgICAgIGRhdGE6YW55ID0ge307XG5cbiAgICAgICAgZm9yKHZhciBpOm51bWJlciA9IDA7IGkgPCBhdHRyLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIHZhciBkOnN0cmluZ1tdID0gYXR0cltpXS5zcGxpdCgnPScpO1xuICAgICAgICAgICAgdmFyIG06UmVnRXhwTWF0Y2hBcnJheSA9IGRbMV0ubWF0Y2gocmVnZXgpO1xuICAgICAgICAgICAgaWYobSAmJiBtLmxlbmd0aCA+PSAxKXtcbiAgICAgICAgICAgICAgICBkWzFdID0gZFsxXS5zdWJzdHIoMSwgZFsxXS5sZW5ndGgtMik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkYXRhW2RbMF1dID0gZFsxXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiA8YXR0ckRhdGE+ZGF0YTtcbiAgICB9XG5cbiAgICBpbnRlcmZhY2UgZm9udERhdGEge1xuICAgICAgICBjaGFycz8gOiBhbnk7XG4gICAgICAgIGZvbnQ/IDogc3RyaW5nO1xuICAgICAgICBzaXplPyA6IG51bWJlcjtcbiAgICAgICAgbGluZUhlaWdodD8gOiBudW1iZXI7XG4gICAgfVxuXG4gICAgaW50ZXJmYWNlIGF0dHJEYXRhIHtcbiAgICAgICAgZmFjZT8gOiBzdHJpbmc7XG4gICAgICAgIHNpemU/IDogc3RyaW5nO1xuICAgICAgICBsaW5lSGVpZ2h0PyA6IHN0cmluZztcbiAgICAgICAgaWQ/IDogc3RyaW5nO1xuICAgICAgICB4PyA6IHN0cmluZztcbiAgICAgICAgeT8gOiBzdHJpbmc7XG4gICAgICAgIHdpZHRoPyA6IHN0cmluZztcbiAgICAgICAgaGVpZ2h0PyA6IHN0cmluZztcbiAgICAgICAgeG9mZnNldD8gOiBzdHJpbmc7XG4gICAgICAgIHlvZmZzZXQ/IDogc3RyaW5nO1xuICAgICAgICB4YWR2YW5jZT8gOiBzdHJpbmc7XG4gICAgICAgIGZpcnN0PyA6IHN0cmluZztcbiAgICAgICAgc2Vjb25kPyA6IHN0cmluZztcbiAgICAgICAgYW1vdW50PyA6IHN0cmluZztcbiAgICB9XG59IiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vYXVkaW8vQXVkaW9NYW5hZ2VyLnRzXCIgLz5cbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL0F1ZGlvL0F1ZGlvLnRzXCIgLz5cbm1vZHVsZSBQSVhJIHtcbiAgICB2YXIgX2FsbG93ZWRFeHQ6c3RyaW5nW10gPSBbXCJtNGFcIiwgXCJvZ2dcIiwgXCJtcDNcIiwgXCJ3YXZcIl07XG5cbiAgICBleHBvcnQgZnVuY3Rpb24gYXVkaW9QYXJzZXIoKTpGdW5jdGlvbiB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihyZXNvdXJjZTpsb2FkZXJzLlJlc291cmNlLCBuZXh0OkZ1bmN0aW9uKTp2b2lke1xuICAgICAgICAgICAgaWYoIURldmljZS5pc0F1ZGlvU3VwcG9ydGVkIHx8ICFyZXNvdXJjZS5kYXRhKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV4dCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZXh0OnN0cmluZyA9IF9nZXRFeHQocmVzb3VyY2UudXJsKTtcblxuICAgICAgICAgICAgaWYoX2FsbG93ZWRFeHQuaW5kZXhPZihleHQpID09PSAtMSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5leHQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoIV9jYW5QbGF5KGV4dCkpe1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXh0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBuYW1lOnN0cmluZyA9IHJlc291cmNlLm5hbWUgfHwgcmVzb3VyY2UudXJsO1xuICAgICAgICAgICAgaWYodXRpbHMuX2F1ZGlvVHlwZVNlbGVjdGVkID09PSBBVURJT19UWVBFLldFQkFVRElPKXtcbiAgICAgICAgICAgICAgICBEZXZpY2UuZ2xvYmFsV2ViQXVkaW9Db250ZXh0LmRlY29kZUF1ZGlvRGF0YShyZXNvdXJjZS5kYXRhLCBfYWRkVG9DYWNoZS5iaW5kKHRoaXMsIG5leHQsIG5hbWUpKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHJldHVybiBfYWRkVG9DYWNoZShuZXh0LCBuYW1lLCByZXNvdXJjZS5kYXRhKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGF1ZGlvUGFyc2VyVXJsKHJlc291cmNlVXJsOnN0cmluZ1tdKTpzdHJpbmd7XG4gICAgICAgIHZhciBleHQ6c3RyaW5nO1xuICAgICAgICB2YXIgdXJsOnN0cmluZztcbiAgICAgICAgZm9yKHZhciBpOm51bWJlciA9IDA7IGkgPCByZXNvdXJjZVVybC5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICBleHQgPSBfZ2V0RXh0KHJlc291cmNlVXJsW2ldKTtcblxuICAgICAgICAgICAgaWYoX2FsbG93ZWRFeHQuaW5kZXhPZihleHQpID09PSAtMSl7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKF9jYW5QbGF5KGV4dCkpe1xuICAgICAgICAgICAgICAgIHVybCA9IHJlc291cmNlVXJsW2ldO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHVybDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfYWRkVG9DYWNoZShuZXh0OkZ1bmN0aW9uLCBuYW1lOnN0cmluZywgZGF0YTphbnkpe1xuICAgICAgICB1dGlscy5BdWRpb0NhY2hlW25hbWVdID0gbmV3IEF1ZGlvKGRhdGEsIG5hbWUpO1xuICAgICAgICByZXR1cm4gbmV4dCgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9nZXRFeHQodXJsOnN0cmluZyk6c3RyaW5ne1xuICAgICAgICByZXR1cm4gdXJsLnNwbGl0KCc/Jykuc2hpZnQoKS5zcGxpdCgnLicpLnBvcCgpLnRvTG93ZXJDYXNlKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2NhblBsYXkoZXh0OnN0cmluZyk6Ym9vbGVhbntcbiAgICAgICAgdmFyIGRldmljZUNhblBsYXk6Ym9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBzd2l0Y2goZXh0KXtcbiAgICAgICAgICAgIGNhc2UgXCJtNGFcIjpkZXZpY2VDYW5QbGF5ID0gRGV2aWNlLmlzTTRhU3VwcG9ydGVkOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJtcDNcIjpkZXZpY2VDYW5QbGF5ID0gRGV2aWNlLmlzTXAzU3VwcG9ydGVkOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJvZ2dcIjpkZXZpY2VDYW5QbGF5ID0gRGV2aWNlLmlzT2dnU3VwcG9ydGVkOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJ3YXZcIjpkZXZpY2VDYW5QbGF5ID0gRGV2aWNlLmlzV2F2U3VwcG9ydGVkOyBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGV2aWNlQ2FuUGxheTtcbiAgICB9XG59XG4iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9kZWZzL3BpeGkuanMuZC50c1wiIC8+XG5tb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IG1vZHVsZSB1dGlscyB7XG4gICAgICAgIGV4cG9ydCB2YXIgX2F1ZGlvVHlwZVNlbGVjdGVkOm51bWJlciA9IEFVRElPX1RZUEUuV0VCQVVESU87XG4gICAgICAgIGV4cG9ydCB2YXIgQXVkaW9DYWNoZTphbnkgPSB7fTtcbiAgICB9XG59IiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vZGVmcy9waXhpLmpzLmQudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vY29yZS9jb25zdC50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuL2JpdG1hcEZvbnRQYXJzZXJUeHQudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi9hdWRpb1BhcnNlci50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9jb3JlL1V0aWxzLnRzXCIgLz5cbm1vZHVsZSBQSVhJIHtcbiAgICBleHBvcnQgbW9kdWxlIGxvYWRlcnN7XG4gICAgICAgIExvYWRlci5hZGRQaXhpTWlkZGxld2FyZShiaXRtYXBGb250UGFyc2VyVFhUKTtcbiAgICAgICAgTG9hZGVyLmFkZFBpeGlNaWRkbGV3YXJlKGF1ZGlvUGFyc2VyKTtcblxuICAgICAgICBjbGFzcyBUdXJib0xvYWRlciBleHRlbmRzIExvYWRlciB7XG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihiYXNlVXJsOiBzdHJpbmcsIGFzc2V0Q29uY3VycmVuY3k6IG51bWJlcil7XG4gICAgICAgICAgICAgICAgc3VwZXIoYmFzZVVybCwgYXNzZXRDb25jdXJyZW5jeSk7XG4gICAgICAgICAgICAgICAgaWYoRGV2aWNlLmlzQXVkaW9TdXBwb3J0ZWQpe1xuICAgICAgICAgICAgICAgICAgICBfY2hlY2tBdWRpb1R5cGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGFkZChuYW1lOmFueSwgdXJsPzphbnkgLG9wdGlvbnM/OmFueSwgY2I/OmFueSk6TG9hZGVye1xuICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBuYW1lID09PSAnb2JqZWN0Jyl7XG4gICAgICAgICAgICAgICAgICAgIGlmKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChuYW1lLnVybCkgPT09IFwiW29iamVjdCBBcnJheV1cIil7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lLnVybCA9IGF1ZGlvUGFyc2VyVXJsKG5hbWUudXJsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh1cmwpID09PSBcIltvYmplY3QgQXJyYXldXCIpe1xuICAgICAgICAgICAgICAgICAgICB1cmwgPSBhdWRpb1BhcnNlclVybCh1cmwpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBzdXBlci5hZGQobmFtZSwgdXJsLCBvcHRpb25zLCBjYik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsb2FkZXJzLkxvYWRlciA9IFR1cmJvTG9hZGVyO1xuXG5cbiAgICAgICAgZnVuY3Rpb24gX2NoZWNrQXVkaW9UeXBlKCk6dm9pZHtcbiAgICAgICAgICAgIGlmKERldmljZS5pc01wM1N1cHBvcnRlZClfc2V0QXVkaW9FeHQoXCJtcDNcIik7XG4gICAgICAgICAgICBpZihEZXZpY2UuaXNPZ2dTdXBwb3J0ZWQpX3NldEF1ZGlvRXh0KFwib2dnXCIpO1xuICAgICAgICAgICAgaWYoRGV2aWNlLmlzV2F2U3VwcG9ydGVkKV9zZXRBdWRpb0V4dChcIndhdlwiKTtcbiAgICAgICAgICAgIGlmKERldmljZS5pc000YVN1cHBvcnRlZClfc2V0QXVkaW9FeHQoXCJtNGFcIik7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBfc2V0QXVkaW9FeHQoZXh0OnN0cmluZyk6dm9pZCB7XG4gICAgICAgICAgICBpZih1dGlscy5fYXVkaW9UeXBlU2VsZWN0ZWQgPT09IEFVRElPX1RZUEUuV0VCQVVESU8pe1xuICAgICAgICAgICAgICAgIFJlc291cmNlLnNldEV4dGVuc2lvblhoclR5cGUoZXh0LCBSZXNvdXJjZS5YSFJfUkVTUE9OU0VfVFlQRS5CVUZGRVIpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgUmVzb3VyY2Uuc2V0RXh0ZW5zaW9uTG9hZFR5cGUoZXh0LCBSZXNvdXJjZS5MT0FEX1RZUEUuQVVESU8pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSIsIm1vZHVsZSBQSVhJIHtcbiAgICBleHBvcnQgY2xhc3MgRGF0YU1hbmFnZXJ7XG4gICAgICAgIHByaXZhdGUgX2RhdGE6YW55O1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgaWQ6c3RyaW5nLCBwdWJsaWMgdXNlUGVyc2lzdGFudERhdGE6Ym9vbGVhbiA9IGZhbHNlKXtcbiAgICAgICAgICAgIHRoaXMubG9hZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgbG9hZCgpOkRhdGFNYW5hZ2Vye1xuICAgICAgICAgICAgdGhpcy5fZGF0YSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5pZCkpIHx8IHt9O1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBzYXZlKCk6RGF0YU1hbmFnZXJ7XG4gICAgICAgICAgICBpZih0aGlzLnVzZVBlcnNpc3RhbnREYXRhKXtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLmlkLCBKU09OLnN0cmluZ2lmeSh0aGlzLl9kYXRhKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc2V0KCk6RGF0YU1hbmFnZXJ7XG4gICAgICAgICAgICB0aGlzLl9kYXRhID0ge307XG4gICAgICAgICAgICB0aGlzLnNhdmUoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0KGtleTpzdHJpbmcgfCBPYmplY3QsIHZhbHVlPzphbnkpOkRhdGFNYW5hZ2Vye1xuICAgICAgICAgICAgaWYoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGtleSkgPT09IFwiW29iamVjdCBPYmplY3RdXCIpe1xuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24odGhpcy5fZGF0YSwga2V5KTtcbiAgICAgICAgICAgIH1lbHNlIGlmKHR5cGVvZiBrZXkgPT09IFwic3RyaW5nXCIpe1xuICAgICAgICAgICAgICAgIHRoaXMuX2RhdGFba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnNhdmUoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0KGtleT86c3RyaW5nKTphbnl7XG4gICAgICAgICAgICBpZigha2V5KXtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZGF0YTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGFba2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRlbChrZXk6c3RyaW5nKTpEYXRhTWFuYWdlcntcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9kYXRhW2tleV07XG4gICAgICAgICAgICB0aGlzLnNhdmUoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICB9XG59IiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vZGVmcy9waXhpLmpzLmQudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi9jb25zdC50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuL0RldmljZS50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9kaXNwbGF5L1NjZW5lLnRzXCIgLz5cbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL2F1ZGlvL0F1ZGlvTWFuYWdlci50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9pbnB1dC9JbnB1dE1hbmFnZXIudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vbG9hZGVyL0xvYWRlci50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuL0RhdGFNYW5hZ2VyLnRzXCIgLz5cbm1vZHVsZSBQSVhJIHtcbiAgICB2YXIgbGFzdDpudW1iZXIgPSAwO1xuICAgIHZhciBtYXhGcmFtZU1TID0gMC4zNTtcblxuICAgIHZhciBkZWZhdWx0R2FtZUNvbmZpZyA6IEdhbWVDb25maWcgPSB7XG4gICAgICAgIGlkOiBcInBpeGkuZGVmYXVsdC5pZFwiLFxuICAgICAgICB3aWR0aDo4MDAsXG4gICAgICAgIGhlaWdodDo2MDAsXG4gICAgICAgIHVzZVdlYkF1ZGlvOiB0cnVlLFxuICAgICAgICB1c2VQZXJzaXN0YW50RGF0YTogZmFsc2UsXG4gICAgICAgIGdhbWVTY2FsZVR5cGU6IEdBTUVfU0NBTEVfVFlQRS5OT05FLFxuICAgICAgICBzdG9wQXRMb3N0Rm9jdXM6IHRydWUsXG4gICAgICAgIGFzc2V0c1VybDogXCIuL1wiLFxuICAgICAgICBsb2FkZXJDb25jdXJyZW5jeTogMTAsXG4gICAgICAgIGF1ZGlvQ2hhbm5lbExpbmVzOiAxMCxcbiAgICAgICAgc291bmRDaGFubmVsTGluZXM6IDEwLFxuICAgICAgICBtdXNpY0NoYW5uZWxMaW5lczogMVxuICAgIH07XG5cbiAgICBleHBvcnQgY2xhc3MgR2FtZSB7XG4gICAgICAgIGlkOnN0cmluZztcbiAgICAgICAgcmFmOmFueTtcblxuICAgICAgICBwcml2YXRlIF9zY2VuZXM6U2NlbmVbXSA9IFtdO1xuICAgICAgICBzY2VuZTpTY2VuZTtcblxuICAgICAgICBhdWRpbzpBdWRpb01hbmFnZXI7XG4gICAgICAgIGlucHV0OklucHV0TWFuYWdlcjtcbiAgICAgICAgZGF0YTpEYXRhTWFuYWdlcjtcbiAgICAgICAgbG9hZGVyOmxvYWRlcnMuTG9hZGVyO1xuXG4gICAgICAgIHJlbmRlcmVyOldlYkdMUmVuZGVyZXIgfCBDYW52YXNSZW5kZXJlcjtcbiAgICAgICAgY2FudmFzOkhUTUxDYW52YXNFbGVtZW50O1xuXG4gICAgICAgIGRlbHRhOm51bWJlciA9IDA7XG4gICAgICAgIHRpbWU6bnVtYmVyID0gMDtcbiAgICAgICAgbGFzdFRpbWU6bnVtYmVyID0gMDtcblxuICAgICAgICBpc1dlYkdMOmJvb2xlYW47XG4gICAgICAgIGlzV2ViQXVkaW86Ym9vbGVhbjtcblxuICAgICAgICBwcml2YXRlIF9yZXNpemVMaXN0ZW5lcjphbnk7XG5cbiAgICAgICAgY29uc3RydWN0b3IoY29uZmlnPzpHYW1lQ29uZmlnLCByZW5kZXJlck9wdGlvbnM/OlJlbmRlcmVyT3B0aW9ucykge1xuICAgICAgICAgICAgY29uZmlnID0gKDxPYmplY3Q+T2JqZWN0KS5hc3NpZ24oZGVmYXVsdEdhbWVDb25maWcsIGNvbmZpZyk7XG4gICAgICAgICAgICB0aGlzLmlkID0gY29uZmlnLmlkO1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJlciA9IGF1dG9EZXRlY3RSZW5kZXJlcihjb25maWcud2lkdGgsIGNvbmZpZy5oZWlnaHQsIHJlbmRlcmVyT3B0aW9ucyk7XG4gICAgICAgICAgICB0aGlzLmNhbnZhcyA9IHRoaXMucmVuZGVyZXIudmlldztcblxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XG5cbiAgICAgICAgICAgIHRoaXMuaXNXZWJHTCA9ICh0aGlzLnJlbmRlcmVyLnR5cGUgPT09IFJFTkRFUkVSX1RZUEUuV0VCR0wpO1xuICAgICAgICAgICAgdGhpcy5pc1dlYkF1ZGlvID0gKERldmljZS5pc0F1ZGlvU3VwcG9ydGVkJiZEZXZpY2UuaXNXZWJBdWRpb1N1cHBvcnRlZCYmY29uZmlnLnVzZVdlYkF1ZGlvKTtcbiAgICAgICAgICAgIHV0aWxzLl9hdWRpb1R5cGVTZWxlY3RlZCA9IHRoaXMuaXNXZWJBdWRpbyA/IEFVRElPX1RZUEUuV0VCQVVESU8gOiBBVURJT19UWVBFLkhUTUxBVURJTztcblxuICAgICAgICAgICAgdGhpcy5pbnB1dCA9IG5ldyBJbnB1dE1hbmFnZXIodGhpcyk7XG4gICAgICAgICAgICB0aGlzLmF1ZGlvID0gbmV3IEF1ZGlvTWFuYWdlcihjb25maWcuYXVkaW9DaGFubmVsTGluZXMsIGNvbmZpZy5zb3VuZENoYW5uZWxMaW5lcywgY29uZmlnLm11c2ljQ2hhbm5lbExpbmVzKTtcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IG5ldyBEYXRhTWFuYWdlcih0aGlzLmlkLCBjb25maWcudXNlUGVyc2lzdGFudERhdGEpO1xuICAgICAgICAgICAgdGhpcy5sb2FkZXIgPSBuZXcgbG9hZGVycy5Mb2FkZXIoY29uZmlnLmFzc2V0c1VybCwgY29uZmlnLmxvYWRlckNvbmN1cnJlbmN5KTtcblxuICAgICAgICAgICAgdmFyIGluaXRpYWxTY2VuZTpTY2VuZSA9IG5ldyBTY2VuZSgnaW5pdGlhbCcpLmFkZFRvKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5zZXRTY2VuZShpbml0aWFsU2NlbmUpO1xuXG4gICAgICAgICAgICBpZihjb25maWcuZ2FtZVNjYWxlVHlwZSAhPT0gR0FNRV9TQ0FMRV9UWVBFLk5PTkUpe1xuICAgICAgICAgICAgICAgIHRoaXMuYXV0b1Jlc2l6ZShjb25maWcuZ2FtZVNjYWxlVHlwZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKGNvbmZpZy5zdG9wQXRMb3N0Rm9jdXMpe1xuICAgICAgICAgICAgICAgIHRoaXMuZW5hYmxlU3RvcEF0TG9zdEZvY3VzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9hbmltYXRlKCk6dm9pZCB7XG4gICAgICAgICAgICB0aGlzLnJhZiA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5fYW5pbWF0ZS5iaW5kKHRoaXMpKTtcblxuICAgICAgICAgICAgaWYodGhpcy5zY2VuZSkge1xuICAgICAgICAgICAgICAgIHZhciBub3c6bnVtYmVyID0gRGF0ZS5ub3coKTtcblxuICAgICAgICAgICAgICAgIHRoaXMudGltZSArPSBNYXRoLm1pbigobm93IC0gbGFzdCkgLyAxMDAwLCBtYXhGcmFtZU1TKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRlbHRhID0gdGhpcy50aW1lIC0gdGhpcy5sYXN0VGltZTtcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RUaW1lID0gdGhpcy50aW1lO1xuXG4gICAgICAgICAgICAgICAgbGFzdCA9IG5vdztcblxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIucmVuZGVyKHRoaXMuc2NlbmUpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGUodGhpcy5kZWx0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB1cGRhdGUoZGVsdGFUaW1lOm51bWJlcik6R2FtZSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc2NlbmUuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNjZW5lLmNoaWxkcmVuW2ldLnVwZGF0ZSh0aGlzLmRlbHRhKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9jbGVhbiBraWxsZWQgb2JqZWN0c1xuICAgICAgICAgICAgdmFyIGxlbjpudW1iZXIgPSBDb250YWluZXIuX2tpbGxlZE9iamVjdHMubGVuZ3RoO1xuICAgICAgICAgICAgaWYgKGxlbikge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGk6bnVtYmVyID0gMDsgaSA8IGxlbjsgaSsrKSBDb250YWluZXIuX2tpbGxlZE9iamVjdHNbaV0ucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgQ29udGFpbmVyLl9raWxsZWRPYmplY3RzLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhcnQoKTpHYW1lIHtcbiAgICAgICAgICAgIGxhc3QgPSBEYXRlLm5vdygpO1xuICAgICAgICAgICAgdGhpcy5fYW5pbWF0ZSgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBzdG9wKCk6R2FtZSB7XG4gICAgICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5yYWYpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBlbmFibGVTdG9wQXRMb3N0Rm9jdXMoc3RhdGU6Ym9vbGVhbiA9IHRydWUpOkdhbWV7XG4gICAgICAgICAgICBpZihzdGF0ZSl7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihEZXZpY2UuZ2V0VmlzaWJpbGl0eUNoYW5nZUV2ZW50KCksIHRoaXMuX29uVmlzaWJpbGl0eUNoYW5nZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoRGV2aWNlLmdldFZpc2liaWxpdHlDaGFuZ2VFdmVudCgpLCB0aGlzLl9vblZpc2liaWxpdHlDaGFuZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBkaXNhYmxlU3RvcEF0TG9zdEZvY3VzKCk6R2FtZXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVuYWJsZVN0b3BBdExvc3RGb2N1cyhmYWxzZSk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9vblZpc2liaWxpdHlDaGFuZ2UoKXtcbiAgICAgICAgICAgIHZhciBpc0hpZGUgPSAhIShkb2N1bWVudC5oaWRkZW4gfHwgZG9jdW1lbnQud2Via2l0SGlkZGVuIHx8IGRvY3VtZW50Lm1vekhpZGRlbiB8fCBkb2N1bWVudC5tc0hpZGRlbik7XG4gICAgICAgICAgICBpZihpc0hpZGUpe1xuICAgICAgICAgICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLm9uTG9zdEZvY3VzKGlzSGlkZSk7XG4gICAgICAgIH1cblxuICAgICAgICBvbkxvc3RGb2N1cyhpc0hpZGU6Ym9vbGVhbik6R2FtZXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0U2NlbmUoc2NlbmU6U2NlbmUgfCBzdHJpbmcpOkdhbWUge1xuICAgICAgICAgICAgaWYoIShzY2VuZSBpbnN0YW5jZW9mIFNjZW5lKSl7XG4gICAgICAgICAgICAgICAgc2NlbmUgPSB0aGlzLmdldFNjZW5lKDxzdHJpbmc+c2NlbmUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnNjZW5lID0gPFNjZW5lPnNjZW5lO1xuICAgICAgICAgICAgdGhpcy5zY2VuZS5wb3NpdGlvbi5zZXQodGhpcy53aWR0aC8yLCB0aGlzLmhlaWdodC8yKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0U2NlbmUoaWQ6c3RyaW5nKTpTY2VuZXtcbiAgICAgICAgICAgIHZhciBzY2VuZTpTY2VuZSA9IG51bGw7XG4gICAgICAgICAgICBmb3IodmFyIGk6bnVtYmVyID0gMDsgaSA8IHRoaXMuX3NjZW5lcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5fc2NlbmVzW2ldLmlkID09PSBpZCl7XG4gICAgICAgICAgICAgICAgICAgIHNjZW5lID0gdGhpcy5fc2NlbmVzW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHNjZW5lO1xuICAgICAgICB9XG5cbiAgICAgICAgY3JlYXRlU2NlbmUoaWQ/OnN0cmluZyk6U2NlbmUge1xuICAgICAgICAgICAgcmV0dXJuIChuZXcgU2NlbmUoaWQpKS5hZGRUbyh0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZVNjZW5lKHNjZW5lOnN0cmluZyB8IFNjZW5lKTpHYW1le1xuICAgICAgICAgICAgaWYodHlwZW9mIHNjZW5lID09PSBcInN0cmluZ1wiKXtcbiAgICAgICAgICAgICAgICBzY2VuZSA9IHRoaXMuZ2V0U2NlbmUoPHN0cmluZz5zY2VuZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBpbmRleDpudW1iZXIgPSB0aGlzLl9zY2VuZXMuaW5kZXhPZig8U2NlbmU+c2NlbmUpO1xuICAgICAgICAgICAgaWYoaW5kZXggIT09IC0xKXtcbiAgICAgICAgICAgICAgICB0aGlzLl9zY2VuZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBhZGRTY2VuZShzY2VuZTpTY2VuZSk6R2FtZSB7XG4gICAgICAgICAgICB0aGlzLl9zY2VuZXMucHVzaChzY2VuZSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZUFsbFNjZW5lcygpOkdhbWV7XG4gICAgICAgICAgICB0aGlzLl9zY2VuZXMubGVuZ3RoID0gMDtcbiAgICAgICAgICAgIHRoaXMuc2NlbmUgPSBudWxsO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICByZXNpemUod2lkdGg6bnVtYmVyLCBoZWlnaHQ6bnVtYmVyLCByZW5kZXJlcjpib29sZWFuID0gZmFsc2UpOkdhbWV7XG4gICAgICAgICAgICBpZihyZW5kZXJlcil7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5yZXNpemUod2lkdGgsIGhlaWdodCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLndpZHRoID0gd2lkdGggKyBcInB4XCI7XG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyBcInB4XCI7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgYXV0b1Jlc2l6ZShtb2RlOm51bWJlcik6R2FtZSB7XG4gICAgICAgICAgICBpZih0aGlzLl9yZXNpemVMaXN0ZW5lcil7XG4gICAgICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX3Jlc2l6ZUxpc3RlbmVyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYobW9kZSA9PT0gR0FNRV9TQ0FMRV9UWVBFLk5PTkUpcmV0dXJuO1xuXG4gICAgICAgICAgICBzd2l0Y2gobW9kZSl7XG4gICAgICAgICAgICAgICAgY2FzZSBHQU1FX1NDQUxFX1RZUEUuQVNQRUNUX0ZJVDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVzaXplTGlzdGVuZXIgPSB0aGlzLl9yZXNpemVNb2RlQXNwZWN0Rml0O1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIEdBTUVfU0NBTEVfVFlQRS5BU1BFQ1RfRklMTDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVzaXplTGlzdGVuZXIgPSB0aGlzLl9yZXNpemVNb2RlQXNwZWN0RmlsbDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBHQU1FX1NDQUxFX1RZUEUuRklMTDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVzaXplTGlzdGVuZXIgPSB0aGlzLl9yZXNpemVNb2RlRmlsbDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl9yZXNpemVMaXN0ZW5lci5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIHRoaXMuX3Jlc2l6ZUxpc3RlbmVyKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX3Jlc2l6ZU1vZGVBc3BlY3RGaXQoKTp2b2lke1xuICAgICAgICAgICAgdmFyIHd3Om51bWJlciA9IHBhcnNlSW50KHRoaXMuY2FudmFzLnN0eWxlLndpZHRoLCAxMCkgfHwgdGhpcy5jYW52YXMud2lkdGg7XG4gICAgICAgICAgICB2YXIgaGg6bnVtYmVyID0gcGFyc2VJbnQodGhpcy5jYW52YXMuc3R5bGUuaGVpZ2h0LCAxMCkgfHwgdGhpcy5jYW52YXMuaGVpZ2h0O1xuICAgICAgICAgICAgaWYod2luZG93LmlubmVyV2lkdGggIT09IHd3IHx8IHdpbmRvdy5pbm5lckhlaWdodCAhPT0gaGgpe1xuICAgICAgICAgICAgICAgIHZhciBzY2FsZTpudW1iZXIgPSBNYXRoLm1pbih3aW5kb3cuaW5uZXJXaWR0aC90aGlzLndpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQvdGhpcy5oZWlnaHQpO1xuICAgICAgICAgICAgICAgIHRoaXMucmVzaXplKHRoaXMud2lkdGgqc2NhbGUsIHRoaXMuaGVpZ2h0KnNjYWxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX3Jlc2l6ZU1vZGVBc3BlY3RGaWxsKCk6dm9pZHtcbiAgICAgICAgICAgIHZhciB3dzpudW1iZXIgPSBwYXJzZUludCh0aGlzLmNhbnZhcy5zdHlsZS53aWR0aCwgMTApIHx8IHRoaXMuY2FudmFzLndpZHRoO1xuICAgICAgICAgICAgdmFyIGhoOm51bWJlciA9IHBhcnNlSW50KHRoaXMuY2FudmFzLnN0eWxlLmhlaWdodCwgMTApIHx8IHRoaXMuY2FudmFzLmhlaWdodDtcbiAgICAgICAgICAgIGlmKHdpbmRvdy5pbm5lcldpZHRoICE9PSB3dyB8fCB3aW5kb3cuaW5uZXJIZWlnaHQgIT09IGhoKXtcbiAgICAgICAgICAgICAgICB2YXIgc2NhbGU6bnVtYmVyID0gTWF0aC5tYXgod2luZG93LmlubmVyV2lkdGgvdGhpcy53aWR0aCwgd2luZG93LmlubmVySGVpZ2h0L3RoaXMuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICB2YXIgd2lkdGg6bnVtYmVyID0gdGhpcy53aWR0aCpzY2FsZTtcbiAgICAgICAgICAgICAgICB2YXIgaGVpZ2h0Om51bWJlciA9IHRoaXMuaGVpZ2h0KnNjYWxlO1xuXG4gICAgICAgICAgICAgICAgdmFyIHRvcE1hcmdpbjpudW1iZXIgPSAod2luZG93LmlubmVySGVpZ2h0LWhlaWdodCkvMjtcbiAgICAgICAgICAgICAgICB2YXIgbGVmdE1hcmdpbjpudW1iZXIgPSAod2luZG93LmlubmVyV2lkdGgtd2lkdGgpLzI7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnJlc2l6ZSh3aWR0aCwgaGVpZ2h0KTtcblxuICAgICAgICAgICAgICAgIHZhciBzdHlsZTphbnkgPSA8YW55PnRoaXMuY2FudmFzLnN0eWxlO1xuICAgICAgICAgICAgICAgIHN0eWxlWydtYXJnaW4tdG9wJ10gPSB0b3BNYXJnaW4gKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgc3R5bGVbJ21hcmdpbi1sZWZ0J10gPSBsZWZ0TWFyZ2luICsgXCJweFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfcmVzaXplTW9kZUZpbGwoKTp2b2lke1xuICAgICAgICAgICAgdmFyIHd3Om51bWJlciA9IHBhcnNlSW50KHRoaXMuY2FudmFzLnN0eWxlLndpZHRoLCAxMCkgfHwgdGhpcy5jYW52YXMud2lkdGg7XG4gICAgICAgICAgICB2YXIgaGg6bnVtYmVyID0gcGFyc2VJbnQodGhpcy5jYW52YXMuc3R5bGUuaGVpZ2h0LCAxMCkgfHwgdGhpcy5jYW52YXMuaGVpZ2h0O1xuICAgICAgICAgICAgaWYod2luZG93LmlubmVyV2lkdGggIT09IHd3IHx8IHdpbmRvdy5pbm5lckhlaWdodCAhPT0gaGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGdldCB3aWR0aCgpOm51bWJlciB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJlci53aWR0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBoZWlnaHQoKTpudW1iZXIge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyZXIuaGVpZ2h0O1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIEdhbWVDb25maWcge1xuICAgICAgICBpZD86c3RyaW5nO1xuICAgICAgICB3aWR0aD86bnVtYmVyO1xuICAgICAgICBoZWlnaHQ/Om51bWJlcjtcbiAgICAgICAgdXNlV2ViQXVkaW8/OmJvb2xlYW47XG4gICAgICAgIHVzZVBlcnNpc3RhbnREYXRhPzpib29sZWFuO1xuICAgICAgICBnYW1lU2NhbGVUeXBlPzpudW1iZXI7XG4gICAgICAgIHN0b3BBdExvc3RGb2N1cz86Ym9vbGVhbjtcbiAgICAgICAgYXNzZXRzVXJsPzpzdHJpbmc7XG4gICAgICAgIGxvYWRlckNvbmN1cnJlbmN5PzpudW1iZXI7XG4gICAgICAgIGF1ZGlvQ2hhbm5lbExpbmVzPzpudW1iZXI7XG4gICAgICAgIHNvdW5kQ2hhbm5lbExpbmVzPzpudW1iZXI7XG4gICAgICAgIG11c2ljQ2hhbm5lbExpbmVzPzpudW1iZXI7XG4gICAgfVxufVxuXG5pbnRlcmZhY2UgT2JqZWN0IHtcbiAgICBhc3NpZ24odGFyZ2V0Ok9iamVjdCwgLi4uc291cmNlczpPYmplY3RbXSk6T2JqZWN0O1xufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4vQXVkaW9MaW5lLnRzXCIgLz5cbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL2NvcmUvR2FtZS50c1wiIC8+XG5tb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IGNsYXNzIEF1ZGlvTWFuYWdlcntcbiAgICAgICAgc291bmRMaW5lczpBdWRpb0xpbmVbXSA9IFtdO1xuICAgICAgICBtdXNpY0xpbmVzOkF1ZGlvTGluZVtdID0gW107XG4gICAgICAgIG5vcm1hbExpbmVzOkF1ZGlvTGluZVtdID0gW107XG4gICAgICAgIHByaXZhdGUgX3RlbXBMaW5lczpBdWRpb0xpbmVbXSA9IFtdO1xuXG4gICAgICAgIG11c2ljTXV0ZWQ6Ym9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBzb3VuZE11dGVkOmJvb2xlYW4gPSBmYWxzZTtcblxuICAgICAgICBjb250ZXh0OkF1ZGlvQ29udGV4dDtcbiAgICAgICAgZ2Fpbk5vZGU6QXVkaW9Ob2RlO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYXVkaW9DaGFubmVsTGluZXM6bnVtYmVyID0gMTAsIHByaXZhdGUgc291bmRDaGFubmVsTGluZXM6bnVtYmVyID0gMTAsIHByaXZhdGUgbXVzaWNDaGFubmVsTGluZXM6bnVtYmVyID0gMSl7XG4gICAgICAgICAgICBpZih1dGlscy5fYXVkaW9UeXBlU2VsZWN0ZWQgPT09IEFVRElPX1RZUEUuV0VCQVVESU8pIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQgPSBEZXZpY2UuZ2xvYmFsV2ViQXVkaW9Db250ZXh0O1xuICAgICAgICAgICAgICAgIHRoaXMuZ2Fpbk5vZGUgPSB0aGlzLmNyZWF0ZUdhaW5Ob2RlKHRoaXMuY29udGV4dCk7XG4gICAgICAgICAgICAgICAgdGhpcy5nYWluTm9kZS5jb25uZWN0KHRoaXMuY29udGV4dC5kZXN0aW5hdGlvbik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBpOm51bWJlcjtcbiAgICAgICAgICAgIGZvcihpID0gMDsgaSA8IHRoaXMuYXVkaW9DaGFubmVsTGluZXM7IGkrKyl7XG4gICAgICAgICAgICAgICAgdGhpcy5ub3JtYWxMaW5lcy5wdXNoKG5ldyBBdWRpb0xpbmUodGhpcykpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCB0aGlzLnNvdW5kQ2hhbm5lbExpbmVzOyBpKyspe1xuICAgICAgICAgICAgICAgIHRoaXMuc291bmRMaW5lcy5wdXNoKG5ldyBBdWRpb0xpbmUodGhpcykpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCB0aGlzLm11c2ljQ2hhbm5lbExpbmVzOyBpKyspe1xuICAgICAgICAgICAgICAgIHRoaXMubXVzaWNMaW5lcy5wdXNoKG5ldyBBdWRpb0xpbmUodGhpcykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZ2V0QXVkaW8oaWQ6c3RyaW5nKTpBdWRpb3tcbiAgICAgICAgICAgIHZhciBhdWRpbzpBdWRpbyA9IHV0aWxzLkF1ZGlvQ2FjaGVbaWRdO1xuICAgICAgICAgICAgYXVkaW8ubWFuYWdlciA9IHRoaXM7XG4gICAgICAgICAgICByZXR1cm4gYXVkaW87XG4gICAgICAgIH1cblxuICAgICAgICBwYXVzZUFsbExpbmVzKCk6QXVkaW9NYW5hZ2VyIHtcbiAgICAgICAgICAgIHRoaXMucGF1c2VNdXNpYygpO1xuICAgICAgICAgICAgdGhpcy5wYXVzZVNvdW5kKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc3VtZUFsbExpbmVzKCk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgdGhpcy5yZXN1bWVNdXNpYygpO1xuICAgICAgICAgICAgdGhpcy5yZXN1bWVTb3VuZCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwbGF5KGlkOnN0cmluZywgbG9vcD86Ym9vbGVhbnxGdW5jdGlvbiwgY2FsbGJhY2s/OkZ1bmN0aW9uKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICBpZih0eXBlb2YgbG9vcCA9PT0gXCJmdW5jdGlvblwiKXtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayA9IDxGdW5jdGlvbj5sb29wO1xuICAgICAgICAgICAgICAgIGxvb3AgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wbGF5KGlkLCB0aGlzLm5vcm1hbExpbmVzLCA8Ym9vbGVhbj5sb29wLCBjYWxsYmFjayk7XG4gICAgICAgIH1cblxuICAgICAgICBwbGF5TXVzaWMoaWQ6c3RyaW5nLCBsb29wPzpib29sZWFufEZ1bmN0aW9uLCBjYWxsYmFjaz86RnVuY3Rpb24pOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIGlmKHR5cGVvZiBsb29wID09PSBcImZ1bmN0aW9uXCIpe1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrID0gPEZ1bmN0aW9uPmxvb3A7XG4gICAgICAgICAgICAgICAgbG9vcCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BsYXkoaWQsIHRoaXMubXVzaWNMaW5lcywgPGJvb2xlYW4+bG9vcCwgY2FsbGJhY2spO1xuICAgICAgICB9XG5cbiAgICAgICAgcGxheVNvdW5kKGlkOnN0cmluZywgbG9vcD86Ym9vbGVhbnxGdW5jdGlvbiwgY2FsbGJhY2s/OkZ1bmN0aW9uKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICBpZih0eXBlb2YgbG9vcCA9PT0gXCJmdW5jdGlvblwiKXtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayA9IDxGdW5jdGlvbj5sb29wO1xuICAgICAgICAgICAgICAgIGxvb3AgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wbGF5KGlkLCB0aGlzLnNvdW5kTGluZXMsIDxib29sZWFuPmxvb3AsIGNhbGxiYWNrKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0b3AoaWQ/OnN0cmluZyk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N0b3AoaWQsIHRoaXMubm9ybWFsTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RvcE11c2ljKGlkPzpzdHJpbmcpOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdG9wKGlkLCB0aGlzLm11c2ljTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RvcFNvdW5kKGlkPzpzdHJpbmcpOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdG9wKGlkLCB0aGlzLnNvdW5kTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcGF1c2UoaWQ/OnN0cmluZyk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BhdXNlKGlkLCB0aGlzLm5vcm1hbExpbmVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBhdXNlTXVzaWMoaWQ/OnN0cmluZyk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BhdXNlKGlkLCB0aGlzLm11c2ljTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcGF1c2VTb3VuZChpZD86c3RyaW5nKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGF1c2UoaWQsIHRoaXMuc291bmRMaW5lcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXN1bWUoaWQ/OnN0cmluZyk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Jlc3VtZShpZCwgdGhpcy5ub3JtYWxMaW5lcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXN1bWVNdXNpYyhpZD86c3RyaW5nKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVzdW1lKGlkLCB0aGlzLm11c2ljTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzdW1lU291bmQoaWQ/OnN0cmluZyk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Jlc3VtZShpZCwgdGhpcy5zb3VuZExpbmVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG11dGUoaWQ/OnN0cmluZyk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX211dGUoaWQsIHRoaXMubm9ybWFsTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgbXV0ZU11c2ljKGlkPzpzdHJpbmcpOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tdXRlKGlkLCB0aGlzLm11c2ljTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgbXV0ZVNvdW5kKGlkPzpzdHJpbmcpOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tdXRlKGlkLCB0aGlzLnNvdW5kTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdW5tdXRlKGlkPzpzdHJpbmcpOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl91bm11dGUoaWQsIHRoaXMubm9ybWFsTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdW5tdXRlTXVzaWMoaWQ/OnN0cmluZyk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3VubXV0ZShpZCwgdGhpcy5tdXNpY0xpbmVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHVubXV0ZVNvdW5kKGlkPzpzdHJpbmcpOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl91bm11dGUoaWQsIHRoaXMuc291bmRMaW5lcyk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9wYXVzZShpZDpzdHJpbmcsIGxpbmVzOkF1ZGlvTGluZVtdKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICBpZighaWQpe1xuICAgICAgICAgICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBpZighbGluZXNbaV0uYXZhaWxhYmxlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzW2ldLnBhdXNlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGF1ZGlvTGluZXM6QXVkaW9MaW5lW10gPSB0aGlzLl9nZXRMaW5lc0J5SWQoaWQsIGxpbmVzKTtcbiAgICAgICAgICAgIGlmKGF1ZGlvTGluZXMubGVuZ3RoKXtcbiAgICAgICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCBhdWRpb0xpbmVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICAgICAgYXVkaW9MaW5lc1tpXS5wYXVzZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfcmVzdW1lKGlkOnN0cmluZywgbGluZXM6QXVkaW9MaW5lW10pOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIGlmKCFpZCl7XG4gICAgICAgICAgICAgICAgZm9yKHZhciBpOm51bWJlciA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgICAgIGlmKCFsaW5lc1tpXS5hdmFpbGFibGUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluZXNbaV0ucmVzdW1lKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGF1ZGlvTGluZXM6QXVkaW9MaW5lW10gPSB0aGlzLl9nZXRMaW5lc0J5SWQoaWQsIGxpbmVzKTtcbiAgICAgICAgICAgIGlmKGF1ZGlvTGluZXMubGVuZ3RoKXtcbiAgICAgICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCBhdWRpb0xpbmVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICAgICAgYXVkaW9MaW5lc1tpXS5yZXN1bWUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX3BsYXkoaWQ6c3RyaW5nLCBsaW5lczpBdWRpb0xpbmVbXSwgbG9vcDpib29sZWFuID0gZmFsc2UsIGNhbGxiYWNrPzpGdW5jdGlvbik6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgdmFyIGxpbmU6QXVkaW9MaW5lID0gdGhpcy5fZ2V0QXZhaWxhYmxlTGluZUZyb20obGluZXMpO1xuICAgICAgICAgICAgaWYoIWxpbmUpe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0F1ZGlvTWFuYWdlcjogQWxsIGxpbmVzIGFyZSBidXN5IScpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgYXVkaW86QXVkaW8gPSB0aGlzLmdldEF1ZGlvKGlkKTtcbiAgICAgICAgICAgIGlmKCFhdWRpbyl7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignQXVkaW8gKCcgKyBpZCArICcpIG5vdCBmb3VuZC4nKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGluZS5zZXRBdWRpbyhhdWRpbywgbG9vcCwgY2FsbGJhY2spLnBsYXkoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfc3RvcChpZDpzdHJpbmcsIGxpbmVzOkF1ZGlvTGluZVtdKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICBpZighaWQpe1xuICAgICAgICAgICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBpZighbGluZXNbaV0uYXZhaWxhYmxlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzW2ldLnN0b3AoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgYXVkaW9MaW5lczpBdWRpb0xpbmVbXSA9IHRoaXMuX2dldExpbmVzQnlJZChpZCwgbGluZXMpO1xuICAgICAgICAgICAgaWYoYXVkaW9MaW5lcy5sZW5ndGgpe1xuICAgICAgICAgICAgICAgIGZvcihpID0gMDsgaSA8IGF1ZGlvTGluZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBhdWRpb0xpbmVzW2ldLnN0b3AoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfbXV0ZShpZDpzdHJpbmcsIGxpbmVzOkF1ZGlvTGluZVtdKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICBpZighaWQpe1xuICAgICAgICAgICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBpZighbGluZXNbaV0uYXZhaWxhYmxlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzW2ldLm11dGUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgYXVkaW9MaW5lczpBdWRpb0xpbmVbXSA9IHRoaXMuX2dldExpbmVzQnlJZChpZCwgbGluZXMpO1xuICAgICAgICAgICAgaWYoYXVkaW9MaW5lcy5sZW5ndGgpe1xuICAgICAgICAgICAgICAgIGZvcihpID0gMDsgaSA8IGF1ZGlvTGluZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBhdWRpb0xpbmVzW2ldLm11dGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX3VubXV0ZShpZDpzdHJpbmcsIGxpbmVzOkF1ZGlvTGluZVtdKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICBpZighaWQpe1xuICAgICAgICAgICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBpZighbGluZXNbaV0uYXZhaWxhYmxlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzW2ldLnVubXV0ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBhdWRpb0xpbmVzOkF1ZGlvTGluZVtdID0gdGhpcy5fZ2V0TGluZXNCeUlkKGlkLCBsaW5lcyk7XG4gICAgICAgICAgICBpZihhdWRpb0xpbmVzLmxlbmd0aCl7XG4gICAgICAgICAgICAgICAgZm9yKGkgPSAwOyBpIDwgYXVkaW9MaW5lcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgICAgIGF1ZGlvTGluZXNbaV0udW5tdXRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9nZXRMaW5lc0J5SWQoaWQ6c3RyaW5nLCBsaW5lczpBdWRpb0xpbmVbXSk6QXVkaW9MaW5lW10ge1xuICAgICAgICAgICAgdGhpcy5fdGVtcExpbmVzLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICBmb3IodmFyIGk6bnVtYmVyID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICBpZighbGluZXNbaV0uYXZhaWxhYmxlKXtcbiAgICAgICAgICAgICAgICAgICAgaWYobGluZXNbaV0uYXVkaW8uaWQgPT09IGlkKXRoaXMuX3RlbXBMaW5lcy5wdXNoKGxpbmVzW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90ZW1wTGluZXM7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9nZXRBdmFpbGFibGVMaW5lRnJvbShsaW5lczpBdWRpb0xpbmVbXSk6QXVkaW9MaW5le1xuICAgICAgICAgICAgdmFyIGw6QXVkaW9MaW5lO1xuICAgICAgICAgICAgZm9yKHZhciBpOm51bWJlciA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgaWYobGluZXNbaV0uYXZhaWxhYmxlKXtcbiAgICAgICAgICAgICAgICAgICAgbCA9IGxpbmVzW2ldO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNyZWF0ZUdhaW5Ob2RlKGN0eDpBdWRpb0NvbnRleHQpOkdhaW5Ob2Rle1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5jcmVhdGVHYWluID8gY3R4LmNyZWF0ZUdhaW4oKSA6IGN0eC5jcmVhdGVHYWluTm9kZSgpO1xuICAgICAgICB9XG5cbiAgICB9XG59XG5cbmludGVyZmFjZSBBdWRpb0NvbnRleHQge1xuICAgIGNyZWF0ZUdhaW5Ob2RlKCk6YW55O1xufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4vQXVkaW9NYW5hZ2VyLnRzXCIgLz5cbm1vZHVsZSBQSVhJIHtcbiAgICBleHBvcnQgY2xhc3MgQXVkaW8ge1xuICAgICAgICBsb29wOmJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgcHJpdmF0ZSBfdm9sdW1lOm51bWJlciA9IDE7XG4gICAgICAgIG11dGVkOmJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgbWFuYWdlcjpBdWRpb01hbmFnZXI7XG5cbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIHNvdXJjZTphbnksIHB1YmxpYyBpZDpzdHJpbmcpe31cblxuICAgICAgICBwbGF5KGxvb3A/OmJvb2xlYW58RnVuY3Rpb24sIGNhbGxiYWNrPzpGdW5jdGlvbik6QXVkaW97XG4gICAgICAgICAgICBpZighdGhpcy5tYW5hZ2VyKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdUaGlzIGF1ZGlvIG5lZWQgYSBtYW5hZ2VyLicpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZih0eXBlb2YgbG9vcCA9PT0gXCJmdW5jdGlvblwiKXtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayA9IDxGdW5jdGlvbj5sb29wO1xuICAgICAgICAgICAgICAgIGxvb3AgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLnBsYXkodGhpcy5pZCwgbG9vcCwgY2FsbGJhY2spO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBzdG9wKCk6QXVkaW8ge1xuICAgICAgICAgICAgaWYoIXRoaXMubWFuYWdlcil7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignVGhpcyBhdWRpbyBuZWVkIGEgbWFuYWdlci4nKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLnN0b3AodGhpcy5pZCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIG11dGUoKTpBdWRpbyB7XG4gICAgICAgICAgICBpZighdGhpcy5tYW5hZ2VyKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdUaGlzIGF1ZGlvIG5lZWQgYSBtYW5hZ2VyLicpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLm11dGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5tdXRlKHRoaXMuaWQpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICB1bm11dGUoKTpBdWRpbyB7XG4gICAgICAgICAgICBpZighdGhpcy5tYW5hZ2VyKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdUaGlzIGF1ZGlvIG5lZWQgYSBtYW5hZ2VyLicpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLm11dGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLm1hbmFnZXIudW5tdXRlKHRoaXMuaWQpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwYXVzZSgpOkF1ZGlvIHtcbiAgICAgICAgICAgIGlmKCF0aGlzLm1hbmFnZXIpe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1RoaXMgYXVkaW8gbmVlZCBhIG1hbmFnZXIuJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5wYXVzZSh0aGlzLmlkKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzdW1lKCk6QXVkaW8ge1xuICAgICAgICAgICAgaWYoIXRoaXMubWFuYWdlcil7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignVGhpcyBhdWRpbyBuZWVkIGEgbWFuYWdlci4nKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLnJlc3VtZSh0aGlzLmlkKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHZvbHVtZSgpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ZvbHVtZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldCB2b2x1bWUodmFsdWU6bnVtYmVyKXtcbiAgICAgICAgICAgIHRoaXMuX3ZvbHVtZSA9IHZhbHVlO1xuXG4gICAgICAgICAgICBpZih0aGlzLm1hbmFnZXIpe1xuICAgICAgICAgICAgICAgIC8vVE9ETzogdXBkYXRlIHRoZSB2b2x1bWUgb24gdGhlIGZseVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2RlZnMvcGl4aS5qcy5kLnRzXCIgLz5cblxubW9kdWxlIFBJWEkge1xuICAgIENvbnRhaW5lci5fa2lsbGVkT2JqZWN0cyA9IFtdO1xuXG4gICAgQ29udGFpbmVyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihkZWx0YVRpbWU6IG51bWJlcikge1xuICAgICAgICB0aGlzLnBvc2l0aW9uLnggKz0gdGhpcy52ZWxvY2l0eS54ICogZGVsdGFUaW1lO1xuICAgICAgICB0aGlzLnBvc2l0aW9uLnkgKz0gdGhpcy52ZWxvY2l0eS55ICogZGVsdGFUaW1lO1xuICAgICAgICB0aGlzLnJvdGF0aW9uICs9IHRoaXMucm90YXRpb25TcGVlZCAqIGRlbHRhVGltZTtcblxuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuW2ldLnVwZGF0ZShkZWx0YVRpbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIENvbnRhaW5lci5wcm90b3R5cGUuYWRkVG8gPSBmdW5jdGlvbihwYXJlbnQpe1xuICAgICAgICBwYXJlbnQuYWRkQ2hpbGQodGhpcyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBDb250YWluZXIucHJvdG90eXBlLmtpbGwgPSBmdW5jdGlvbigpe1xuICAgICAgICBQSVhJLkNvbnRhaW5lci5fa2lsbGVkT2JqZWN0cy5wdXNoKHRoaXMpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgQ29udGFpbmVyLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbigpe1xuICAgICAgICBpZih0aGlzLnBhcmVudCl7XG4gICAgICAgICAgICB0aGlzLnBhcmVudC5yZW1vdmVDaGlsZCh0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9kZWZzL3BpeGkuanMuZC50c1wiIC8+XG5cbm1vZHVsZSBQSVhJIHtcbiAgICBEaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5zcGVlZCA9IDA7XG4gICAgRGlzcGxheU9iamVjdC5wcm90b3R5cGUudmVsb2NpdHkgPSBuZXcgUG9pbnQoKTtcbiAgICBEaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5kaXJlY3Rpb24gPSAwO1xuICAgIERpc3BsYXlPYmplY3QucHJvdG90eXBlLnJvdGF0aW9uU3BlZWQgPSAwO1xuXG4gICAgRGlzcGxheU9iamVjdC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oZGVsdGFUaW1lOm51bWJlcil7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
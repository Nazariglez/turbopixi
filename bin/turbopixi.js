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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInR1cmJvcGl4aS5qcyIsImluZGV4LnRzIiwiYXVkaW8vQXVkaW9MaW5lLnRzIiwiY29yZS9jb25zdC50cyIsImNvcmUvRGV2aWNlLnRzIiwiZGlzcGxheS9TY2VuZS50cyIsImlucHV0L0lucHV0TWFuYWdlci50cyIsImxvYWRlci9iaXRtYXBGb250UGFyc2VyVFhULnRzIiwibG9hZGVyL2F1ZGlvUGFyc2VyLnRzIiwiY29yZS9VdGlscy50cyIsImxvYWRlci9Mb2FkZXIudHMiLCJjb3JlL0RhdGFNYW5hZ2VyLnRzIiwiY29yZS9HYW1lLnRzIiwiYXVkaW8vQXVkaW9NYW5hZ2VyLnRzIiwiYXVkaW8vQXVkaW8udHMiLCJkaXNwbGF5L0NvbnRhaW5lci50cyIsImRpc3BsYXkvRGlzcGxheU9iamVjdC50cyJdLCJuYW1lcyI6WyJQSVhJIiwiRXJyb3IiLCJQSVhJX1ZFUlNJT05fUkVRVUlSRUQiLCJQSVhJX1ZFUlNJT04iLCJWRVJTSU9OIiwibWF0Y2giLCJIVE1MQXVkaW8iLCJBdWRpbyIsIlBJWEkuQXVkaW9MaW5lIiwiUElYSS5BdWRpb0xpbmUuY29uc3RydWN0b3IiLCJQSVhJLkF1ZGlvTGluZS5zZXRBdWRpbyIsIlBJWEkuQXVkaW9MaW5lLnBsYXkiLCJQSVhJLkF1ZGlvTGluZS5zdG9wIiwiUElYSS5BdWRpb0xpbmUucGF1c2UiLCJQSVhJLkF1ZGlvTGluZS5yZXN1bWUiLCJQSVhJLkF1ZGlvTGluZS5tdXRlIiwiUElYSS5BdWRpb0xpbmUudW5tdXRlIiwiUElYSS5BdWRpb0xpbmUudm9sdW1lIiwiUElYSS5BdWRpb0xpbmUucmVzZXQiLCJQSVhJLkF1ZGlvTGluZS5fb25FbmQiLCJQSVhJLkdBTUVfU0NBTEVfVFlQRSIsIlBJWEkuQVVESU9fVFlQRSIsIlBJWEkuRGV2aWNlIiwiUElYSS5EZXZpY2UuZ2V0TW91c2VXaGVlbEV2ZW50IiwiUElYSS5EZXZpY2UudmlicmF0ZSIsIlBJWEkuRGV2aWNlLmdldFZpc2liaWxpdHlDaGFuZ2VFdmVudCIsIlBJWEkuRGV2aWNlLmlzT25saW5lIiwiX19leHRlbmRzIiwiZCIsImIiLCJwIiwiaGFzT3duUHJvcGVydHkiLCJfXyIsImNvbnN0cnVjdG9yIiwicHJvdG90eXBlIiwiUElYSS5TY2VuZSIsIlBJWEkuU2NlbmUuY29uc3RydWN0b3IiLCJQSVhJLlNjZW5lLmFkZFRvIiwiUElYSS5JbnB1dE1hbmFnZXIiLCJQSVhJLklucHV0TWFuYWdlci5jb25zdHJ1Y3RvciIsIlBJWEkuYml0bWFwRm9udFBhcnNlclRYVCIsInJlc291cmNlIiwiZGF0YSIsInhoclR5cGUiLCJuZXh0IiwidGV4dCIsInhociIsInJlc3BvbnNlVGV4dCIsImluZGV4T2YiLCJ1cmwiLCJkaXJuYW1lIiwiYmFzZVVybCIsImNoYXJBdCIsImxlbmd0aCIsInJlcGxhY2UiLCJ0ZXh0dXJlVXJsIiwiZ2V0VGV4dHVyZVVybCIsInV0aWxzIiwiVGV4dHVyZUNhY2hlIiwicGFyc2UiLCJsb2FkT3B0aW9ucyIsImNyb3NzT3JpZ2luIiwibG9hZFR5cGUiLCJsb2FkZXJzIiwiUmVzb3VyY2UiLCJMT0FEX1RZUEUiLCJJTUFHRSIsImFkZCIsIm5hbWUiLCJyZXMiLCJ0ZXh0dXJlIiwiUElYSS5wYXJzZSIsIlBJWEkuZGlybmFtZSIsIlBJWEkuZ2V0VGV4dHVyZVVybCIsIlBJWEkuZ2V0QXR0ciIsIlBJWEkuYXVkaW9QYXJzZXIiLCJEZXZpY2UiLCJpc0F1ZGlvU3VwcG9ydGVkIiwiZXh0IiwiX2dldEV4dCIsIl9hbGxvd2VkRXh0IiwiX2NhblBsYXkiLCJfYXVkaW9UeXBlU2VsZWN0ZWQiLCJBVURJT19UWVBFIiwiV0VCQVVESU8iLCJnbG9iYWxXZWJBdWRpb0NvbnRleHQiLCJkZWNvZGVBdWRpb0RhdGEiLCJfYWRkVG9DYWNoZSIsImJpbmQiLCJQSVhJLmF1ZGlvUGFyc2VyVXJsIiwiUElYSS5fYWRkVG9DYWNoZSIsIlBJWEkuX2dldEV4dCIsIlBJWEkuX2NhblBsYXkiLCJQSVhJLnV0aWxzIiwiUElYSS5sb2FkZXJzIiwiUElYSS5sb2FkZXJzLlR1cmJvTG9hZGVyIiwiUElYSS5sb2FkZXJzLlR1cmJvTG9hZGVyLmNvbnN0cnVjdG9yIiwiUElYSS5sb2FkZXJzLlR1cmJvTG9hZGVyLmFkZCIsIlBJWEkubG9hZGVycy5fY2hlY2tBdWRpb1R5cGUiLCJQSVhJLmxvYWRlcnMuX3NldEF1ZGlvRXh0IiwiUElYSS5EYXRhTWFuYWdlciIsIlBJWEkuRGF0YU1hbmFnZXIuY29uc3RydWN0b3IiLCJQSVhJLkRhdGFNYW5hZ2VyLmxvYWQiLCJQSVhJLkRhdGFNYW5hZ2VyLnNhdmUiLCJQSVhJLkRhdGFNYW5hZ2VyLnJlc2V0IiwiUElYSS5EYXRhTWFuYWdlci5zZXQiLCJQSVhJLkRhdGFNYW5hZ2VyLmdldCIsIlBJWEkuRGF0YU1hbmFnZXIuZGVsIiwiUElYSS5HYW1lIiwiUElYSS5HYW1lLmNvbnN0cnVjdG9yIiwiUElYSS5HYW1lLl9hbmltYXRlIiwiUElYSS5HYW1lLnVwZGF0ZSIsIlBJWEkuR2FtZS5zdGFydCIsIlBJWEkuR2FtZS5zdG9wIiwiUElYSS5HYW1lLmVuYWJsZVN0b3BBdExvc3RGb2N1cyIsIlBJWEkuR2FtZS5kaXNhYmxlU3RvcEF0TG9zdEZvY3VzIiwiUElYSS5HYW1lLl9vblZpc2liaWxpdHlDaGFuZ2UiLCJQSVhJLkdhbWUub25Mb3N0Rm9jdXMiLCJQSVhJLkdhbWUuc2V0U2NlbmUiLCJQSVhJLkdhbWUuZ2V0U2NlbmUiLCJQSVhJLkdhbWUuY3JlYXRlU2NlbmUiLCJQSVhJLkdhbWUucmVtb3ZlU2NlbmUiLCJQSVhJLkdhbWUuYWRkU2NlbmUiLCJQSVhJLkdhbWUucmVtb3ZlQWxsU2NlbmVzIiwiUElYSS5HYW1lLnJlc2l6ZSIsIlBJWEkuR2FtZS5hdXRvUmVzaXplIiwiUElYSS5HYW1lLl9yZXNpemVNb2RlQXNwZWN0Rml0IiwiUElYSS5HYW1lLl9yZXNpemVNb2RlQXNwZWN0RmlsbCIsIlBJWEkuR2FtZS5fcmVzaXplTW9kZUZpbGwiLCJnZXQiLCJQSVhJLkdhbWUud2lkdGgiLCJlbnVtZXJhYmxlIiwiY29uZmlndXJhYmxlIiwiUElYSS5HYW1lLmhlaWdodCIsIlBJWEkuQXVkaW9NYW5hZ2VyIiwiUElYSS5BdWRpb01hbmFnZXIuY29uc3RydWN0b3IiLCJQSVhJLkF1ZGlvTWFuYWdlci5nZXRBdWRpbyIsIlBJWEkuQXVkaW9NYW5hZ2VyLnBhdXNlQWxsTGluZXMiLCJQSVhJLkF1ZGlvTWFuYWdlci5yZXN1bWVBbGxMaW5lcyIsIlBJWEkuQXVkaW9NYW5hZ2VyLnBsYXkiLCJQSVhJLkF1ZGlvTWFuYWdlci5wbGF5TXVzaWMiLCJQSVhJLkF1ZGlvTWFuYWdlci5wbGF5U291bmQiLCJQSVhJLkF1ZGlvTWFuYWdlci5zdG9wIiwiUElYSS5BdWRpb01hbmFnZXIuc3RvcE11c2ljIiwiUElYSS5BdWRpb01hbmFnZXIuc3RvcFNvdW5kIiwiUElYSS5BdWRpb01hbmFnZXIucGF1c2UiLCJQSVhJLkF1ZGlvTWFuYWdlci5wYXVzZU11c2ljIiwiUElYSS5BdWRpb01hbmFnZXIucGF1c2VTb3VuZCIsIlBJWEkuQXVkaW9NYW5hZ2VyLnJlc3VtZSIsIlBJWEkuQXVkaW9NYW5hZ2VyLnJlc3VtZU11c2ljIiwiUElYSS5BdWRpb01hbmFnZXIucmVzdW1lU291bmQiLCJQSVhJLkF1ZGlvTWFuYWdlci5tdXRlIiwiUElYSS5BdWRpb01hbmFnZXIubXV0ZU11c2ljIiwiUElYSS5BdWRpb01hbmFnZXIubXV0ZVNvdW5kIiwiUElYSS5BdWRpb01hbmFnZXIudW5tdXRlIiwiUElYSS5BdWRpb01hbmFnZXIudW5tdXRlTXVzaWMiLCJQSVhJLkF1ZGlvTWFuYWdlci51bm11dGVTb3VuZCIsIlBJWEkuQXVkaW9NYW5hZ2VyLl9wYXVzZSIsIlBJWEkuQXVkaW9NYW5hZ2VyLl9yZXN1bWUiLCJQSVhJLkF1ZGlvTWFuYWdlci5fcGxheSIsIlBJWEkuQXVkaW9NYW5hZ2VyLl9zdG9wIiwiUElYSS5BdWRpb01hbmFnZXIuX211dGUiLCJQSVhJLkF1ZGlvTWFuYWdlci5fdW5tdXRlIiwiUElYSS5BdWRpb01hbmFnZXIuX2dldExpbmVzQnlJZCIsIlBJWEkuQXVkaW9NYW5hZ2VyLl9nZXRBdmFpbGFibGVMaW5lRnJvbSIsIlBJWEkuQXVkaW9NYW5hZ2VyLmNyZWF0ZUdhaW5Ob2RlIiwiUElYSS5BdWRpbyIsIlBJWEkuQXVkaW8uY29uc3RydWN0b3IiLCJQSVhJLkF1ZGlvLnBsYXkiLCJQSVhJLkF1ZGlvLnN0b3AiLCJQSVhJLkF1ZGlvLm11dGUiLCJQSVhJLkF1ZGlvLnVubXV0ZSIsIlBJWEkuQXVkaW8ucGF1c2UiLCJQSVhJLkF1ZGlvLnJlc3VtZSIsIlBJWEkuQXVkaW8udm9sdW1lIiwic2V0IiwicG9zaXRpb24iLCJ4IiwidmVsb2NpdHkiLCJkZWx0YVRpbWUiLCJ5Iiwicm90YXRpb24iLCJyb3RhdGlvblNwZWVkIiwiaSIsImNoaWxkcmVuIiwidXBkYXRlIiwicGFyZW50IiwiYWRkQ2hpbGQiLCJDb250YWluZXIiLCJfa2lsbGVkT2JqZWN0cyIsInB1c2giLCJyZW1vdmVDaGlsZCJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7SUNMQSxJQUFHLENBQUNBLElBQUosRUFBUztBQUFBLFFBQ0wsTUFBTSxJQUFJQyxLQUFKLENBQVUsd0JBQVYsQ0FBTixDQURLO0FBQUE7SUFJVCxJQUFNQyxxQkFBQSxHQUF3QixPQUE5QjtJQUNBLElBQU1DLFlBQUEsR0FBZUgsSUFBQSxDQUFLSSxPQUFMLENBQWFDLEtBQWIsQ0FBbUIsVUFBbkIsRUFBK0IsQ0FBL0IsQ0FBckI7SUFFQSxJQUFHRixZQUFBLEdBQWVELHFCQUFsQixFQUF3QztBQUFBLFFBQ3BDLE1BQU0sSUFBSUQsS0FBSixDQUFVLGNBQWNELElBQUEsQ0FBS0ksT0FBbkIsR0FBNkIsb0NBQTdCLEdBQW1FRixxQkFBN0UsQ0FBTixDQURvQztBQUFBO0lER3hDO0FBQUEsUUVWSUksU0FBQSxHQUFZQyxLRlVoQjtJRVRBLElBQU9QLElBQVA7SUFBQSxDQUFBLFVBQU9BLElBQVAsRUFBWTtBQUFBLFFBQ1JBLElBQUFBLFNBQUFBLEdBQUFBLFlBQUFBO0FBQUFBLFlBZUlRLFNBQUFBLFNB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QUFBQSxhQUFBQSxDQUFjQSxTQUFkQSxDQUF3QkEsS0FBeEJBLEdBQWdDQSxDQUFoQ0EsQ0FEUTtBQUFBLFFBRVJBLElBQUFBLENBQUFBLGFBQUFBLENBQWNBLFNBQWRBLENBQXdCQSxRQUF4QkEsR0FBbUNBLElBQUlBLElBQUFBLENBQUFBLEtBQUpBLEVBQW5DQSxDQUZRO0FBQUEsUUFHUkEsSUFBQUEsQ0FBQUEsYUFBQUEsQ0FBY0EsU0FBZEEsQ0FBd0JBLFNBQXhCQSxHQUFvQ0EsQ0FBcENBLENBSFE7QUFBQSxRQUlSQSxJQUFBQSxDQUFBQSxhQUFBQSxDQUFjQSxTQUFkQSxDQUF3QkEsYUFBeEJBLEdBQXdDQSxDQUF4Q0EsQ0FKUTtBQUFBLFFBTVJBLElBQUFBLENBQUFBLGFBQUFBLENBQWNBLFNBQWRBLENBQXdCQSxNQUF4QkEsR0FBaUNBLFVBQVNBLFNBQVRBLEVBQXlCQTtBQUFBQSxZQUN0RCxPQUFPLElBQVAsQ0FEc0RBO0FBQUFBLFNBQTFEQSxDQU5RO0FBQUEsS0FBWixDQUFPQSxJQUFBLElBQUEsQ0FBQUEsSUFBQSxHQUFJLEVBQUosQ0FBUCIsImZpbGUiOiJ0dXJib3BpeGkuanMiLCJzb3VyY2VzQ29udGVudCI6W251bGwsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL2RlZnMvcGl4aS5qcy5kLnRzXCIgLz5cbmlmKCFQSVhJKXtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0V5ISBXaGVyZSBpcyBwaXhpLmpzPz8nKTtcbn1cblxuY29uc3QgUElYSV9WRVJTSU9OX1JFUVVJUkVEID0gXCIzLjAuN1wiO1xuY29uc3QgUElYSV9WRVJTSU9OID0gUElYSS5WRVJTSU9OLm1hdGNoKC9cXGQuXFxkLlxcZC8pWzBdO1xuXG5pZihQSVhJX1ZFUlNJT04gPCBQSVhJX1ZFUlNJT05fUkVRVUlSRUQpe1xuICAgIHRocm93IG5ldyBFcnJvcihcIlBpeGkuanMgdlwiICsgUElYSS5WRVJTSU9OICsgXCIgaXQncyBub3Qgc3VwcG9ydGVkLCBwbGVhc2UgdXNlIF5cIiArIFBJWElfVkVSU0lPTl9SRVFVSVJFRCk7XG59XG4iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuL0F1ZGlvTWFuYWdlci50c1wiIC8+XG52YXIgSFRNTEF1ZGlvID0gQXVkaW87XG5tb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IGNsYXNzIEF1ZGlvTGluZSB7XG4gICAgICAgIGF2YWlsYWJsZTpib29sZWFuID0gdHJ1ZTtcbiAgICAgICAgYXVkaW86QXVkaW87XG4gICAgICAgIGxvb3A6Ym9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBwYXVzZWQ6Ym9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBjYWxsYmFjazpGdW5jdGlvbjtcbiAgICAgICAgbXV0ZWQ6Ym9vbGVhbiA9IGZhbHNlO1xuXG4gICAgICAgIHN0YXJ0VGltZTpudW1iZXIgPSAwO1xuICAgICAgICBsYXN0UGF1c2VUaW1lOm51bWJlciA9IDA7XG4gICAgICAgIG9mZnNldFRpbWU6bnVtYmVyID0gMDtcblxuICAgICAgICBwcml2YXRlIF9odG1sQXVkaW86SFRNTEF1ZGlvRWxlbWVudDtcbiAgICAgICAgcHJpdmF0ZSBfd2ViQXVkaW86QXVkaW9CdWZmZXJTb3VyY2VOb2RlO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBtYW5hZ2VyOkF1ZGlvTWFuYWdlcil7XG4gICAgICAgICAgICBpZighdGhpcy5tYW5hZ2VyLmNvbnRleHQpe1xuICAgICAgICAgICAgICAgIHRoaXMuX2h0bWxBdWRpbyA9IG5ldyBIVE1MQXVkaW8oKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9odG1sQXVkaW8uYWRkRXZlbnRMaXN0ZW5lcignZW5kZWQnLCB0aGlzLl9vbkVuZC5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHNldEF1ZGlvKGF1ZGlvOkF1ZGlvLCBsb29wOmJvb2xlYW58RnVuY3Rpb24sIGNhbGxiYWNrPzpGdW5jdGlvbik6QXVkaW9MaW5le1xuICAgICAgICAgICAgaWYodHlwZW9mIGxvb3AgPT09IFwiZnVuY3Rpb25cIil7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2sgPSA8RnVuY3Rpb24+bG9vcDtcbiAgICAgICAgICAgICAgICBsb29wID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuYXVkaW8gPSBhdWRpbztcbiAgICAgICAgICAgIHRoaXMuYXZhaWxhYmxlID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmxvb3AgPSA8Ym9vbGVhbj5sb29wO1xuICAgICAgICAgICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwbGF5KHBhdXNlPzpib29sZWFuKTpBdWRpb0xpbmUge1xuICAgICAgICAgICAgaWYoIXBhdXNlICYmIHRoaXMucGF1c2VkKXJldHVybiB0aGlzO1xuXG4gICAgICAgICAgICBpZih0aGlzLm1hbmFnZXIuY29udGV4dCl7XG4gICAgICAgICAgICAgICAgdGhpcy5fd2ViQXVkaW8gPSB0aGlzLm1hbmFnZXIuY29udGV4dC5jcmVhdGVCdWZmZXJTb3VyY2UoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl93ZWJBdWRpby5zdGFydCA9IHRoaXMuX3dlYkF1ZGlvLnN0YXJ0IHx8IHRoaXMuX3dlYkF1ZGlvLm5vdGVPbjtcbiAgICAgICAgICAgICAgICB0aGlzLl93ZWJBdWRpby5zdG9wID0gdGhpcy5fd2ViQXVkaW8uc3RvcCB8fCB0aGlzLl93ZWJBdWRpby5ub3RlT2ZmO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fd2ViQXVkaW8uYnVmZmVyID0gdGhpcy5hdWRpby5zb3VyY2U7XG4gICAgICAgICAgICAgICAgdGhpcy5fd2ViQXVkaW8ubG9vcCA9IHRoaXMubG9vcCB8fCB0aGlzLmF1ZGlvLmxvb3A7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydFRpbWUgPSB0aGlzLm1hbmFnZXIuY29udGV4dC5jdXJyZW50VGltZTtcblxuICAgICAgICAgICAgICAgIHRoaXMuX3dlYkF1ZGlvLm9uZW5kZWQgPSB0aGlzLl9vbkVuZC5iaW5kKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fd2ViQXVkaW8uZ2Fpbk5vZGUgPSB0aGlzLm1hbmFnZXIuY3JlYXRlR2Fpbk5vZGUodGhpcy5tYW5hZ2VyLmNvbnRleHQpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3dlYkF1ZGlvLmdhaW5Ob2RlLmdhaW4udmFsdWUgPSAodGhpcy5hdWRpby5tdXRlZCB8fCB0aGlzLm11dGVkKSA/IDAgOiB0aGlzLmF1ZGlvLnZvbHVtZTtcbiAgICAgICAgICAgICAgICB0aGlzLl93ZWJBdWRpby5nYWluTm9kZS5jb25uZWN0KHRoaXMubWFuYWdlci5nYWluTm9kZSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl93ZWJBdWRpby5jb25uZWN0KHRoaXMuX3dlYkF1ZGlvLmdhaW5Ob2RlKTtcbiAgICAgICAgICAgICAgICB0aGlzLl93ZWJBdWRpby5zdGFydCgwLCAocGF1c2UpID8gdGhpcy5sYXN0UGF1c2VUaW1lIDogbnVsbCk7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICB0aGlzLl9odG1sQXVkaW8uc3JjID0gKHRoaXMuYXVkaW8uc291cmNlLnNyYyAhPT0gXCJcIikgPyB0aGlzLmF1ZGlvLnNvdXJjZS5zcmMgOiB0aGlzLmF1ZGlvLnNvdXJjZS5jaGlsZHJlblswXS5zcmM7XG4gICAgICAgICAgICAgICAgdGhpcy5faHRtbEF1ZGlvLnByZWxvYWQgPSBcImF1dG9cIjtcbiAgICAgICAgICAgICAgICB0aGlzLl9odG1sQXVkaW8udm9sdW1lID0gKHRoaXMuYXVkaW8ubXV0ZWQgfHwgdGhpcy5tdXRlZCkgPyAwIDogdGhpcy5hdWRpby52b2x1bWU7XG4gICAgICAgICAgICAgICAgdGhpcy5faHRtbEF1ZGlvLmxvYWQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9odG1sQXVkaW8ucGxheSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHN0b3AoKTpBdWRpb0xpbmUge1xuICAgICAgICAgICAgaWYodGhpcy5tYW5hZ2VyLmNvbnRleHQpe1xuICAgICAgICAgICAgICAgIHRoaXMuX3dlYkF1ZGlvLnN0b3AoMCk7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICB0aGlzLl9odG1sQXVkaW8ucGF1c2UoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9odG1sQXVkaW8uY3VycmVudFRpbWUgPSAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHBhdXNlKCk6QXVkaW9MaW5le1xuICAgICAgICAgICAgaWYodGhpcy5tYW5hZ2VyLmNvbnRleHQpe1xuICAgICAgICAgICAgICAgIHRoaXMub2Zmc2V0VGltZSArPSB0aGlzLm1hbmFnZXIuY29udGV4dC5jdXJyZW50VGltZSAtIHRoaXMuc3RhcnRUaW1lO1xuICAgICAgICAgICAgICAgIHRoaXMubGFzdFBhdXNlVGltZSA9IHRoaXMub2Zmc2V0VGltZSV0aGlzLl93ZWJBdWRpby5idWZmZXIuZHVyYXRpb247XG4gICAgICAgICAgICAgICAgdGhpcy5fd2ViQXVkaW8uc3RvcCgwKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHRoaXMuX2h0bWxBdWRpby5wYXVzZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5wYXVzZWQgPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICByZXN1bWUoKTpBdWRpb0xpbmV7XG4gICAgICAgICAgICBpZih0aGlzLnBhdXNlZCl7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5tYW5hZ2VyLmNvbnRleHQpe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsYXkodHJ1ZSk7XG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2h0bWxBdWRpby5wbGF5KCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5wYXVzZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgbXV0ZSgpOkF1ZGlvTGluZXtcbiAgICAgICAgICAgIHRoaXMubXV0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgaWYodGhpcy5tYW5hZ2VyLmNvbnRleHQpe1xuICAgICAgICAgICAgICAgIHRoaXMuX3dlYkF1ZGlvLmdhaW5Ob2RlLmdhaW4udmFsdWUgPSAwO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgdGhpcy5faHRtbEF1ZGlvLnZvbHVtZSA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHVubXV0ZSgpOkF1ZGlvTGluZXtcbiAgICAgICAgICAgIHRoaXMubXV0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmKHRoaXMubWFuYWdlci5jb250ZXh0KXtcbiAgICAgICAgICAgICAgICB0aGlzLl93ZWJBdWRpby5nYWluTm9kZS5nYWluLnZhbHVlID0gdGhpcy5hdWRpby52b2x1bWU7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICB0aGlzLl9odG1sQXVkaW8udm9sdW1lID0gdGhpcy5hdWRpby52b2x1bWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHZvbHVtZSh2YWx1ZTpudW1iZXIpOkF1ZGlvTGluZXtcbiAgICAgICAgICAgIGlmKHRoaXMubWFuYWdlci5jb250ZXh0KXtcbiAgICAgICAgICAgICAgICB0aGlzLl93ZWJBdWRpby5nYWluTm9kZS5nYWluLnZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICB0aGlzLl9odG1sQXVkaW8udm9sdW1lID0gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc2V0KCk6QXVkaW9MaW5le1xuICAgICAgICAgICAgdGhpcy5hdmFpbGFibGUgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5hdWRpbyA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmxvb3AgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuY2FsbGJhY2sgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5wYXVzZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMubXV0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuX3dlYkF1ZGlvID0gbnVsbDtcblxuICAgICAgICAgICAgdGhpcy5zdGFydFRpbWUgPSAwO1xuICAgICAgICAgICAgdGhpcy5sYXN0UGF1c2VUaW1lID0gMDtcbiAgICAgICAgICAgIHRoaXMub2Zmc2V0VGltZSA9IDA7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX29uRW5kKCk6dm9pZHtcbiAgICAgICAgICAgIGlmKHRoaXMuY2FsbGJhY2spdGhpcy5jYWxsYmFjayh0aGlzLm1hbmFnZXIsIHRoaXMuYXVkaW8pO1xuICAgICAgICAgICAgaWYoIXRoaXMubWFuYWdlci5jb250ZXh0KXtcbiAgICAgICAgICAgICAgICBpZih0aGlzLmxvb3AgfHwgdGhpcy5hdWRpby5sb29wKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faHRtbEF1ZGlvLmN1cnJlbnRUaW1lID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faHRtbEF1ZGlvLnBsYXkoKTtcbiAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1lbHNlIGlmKHRoaXMubWFuYWdlci5jb250ZXh0ICYmICF0aGlzLnBhdXNlZCl7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG59XG5cbmludGVyZmFjZSBBdWRpb0J1ZmZlclNvdXJjZU5vZGUge1xuICAgIG5vdGVPbigpOkF1ZGlvQnVmZmVyU291cmNlTm9kZTtcbiAgICBub3RlT2ZmKCk6QXVkaW9CdWZmZXJTb3VyY2VOb2RlO1xuICAgIHNvdXJjZTpBdWRpb0J1ZmZlcjtcbiAgICBnYWluTm9kZTpHYWluTm9kZTtcbn0iLCJtb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IGVudW0gR0FNRV9TQ0FMRV9UWVBFIHtcbiAgICAgICAgTk9ORSxcbiAgICAgICAgRklMTCxcbiAgICAgICAgQVNQRUNUX0ZJVCxcbiAgICAgICAgQVNQRUNUX0ZJTExcbiAgICB9XG5cbiAgICBleHBvcnQgZW51bSBBVURJT19UWVBFIHtcbiAgICAgICAgVU5LTk9XTixcbiAgICAgICAgV0VCQVVESU8sXG4gICAgICAgIEhUTUxBVURJT1xuICAgIH1cbn0iLCIvL01hbnkgY2hlY2tzIGFyZSBiYXNlZCBvbiBodHRwczovL2dpdGh1Yi5jb20vYXJhc2F0YXNheWdpbi9pcy5qcy9ibG9iL21hc3Rlci9pcy5qc1xuXG5tb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IG1vZHVsZSBEZXZpY2Uge1xuICAgICAgICB2YXIgbmF2aWdhdG9yOk5hdmlnYXRvciA9IHdpbmRvdy5uYXZpZ2F0b3I7XG4gICAgICAgIHZhciBkb2N1bWVudDpEb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcblxuICAgICAgICB2YXIgdXNlckFnZW50OnN0cmluZyA9ICduYXZpZ2F0b3InIGluIHdpbmRvdyAmJiAndXNlckFnZW50JyBpbiBuYXZpZ2F0b3IgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpIHx8ICcnLFxuICAgICAgICAgICAgdmVuZG9yOnN0cmluZyA9ICduYXZpZ2F0b3InIGluIHdpbmRvdyAmJiAndmVuZG9yJyBpbiBuYXZpZ2F0b3IgJiYgbmF2aWdhdG9yLnZlbmRvci50b0xvd2VyQ2FzZSgpIHx8ICcnLFxuICAgICAgICAgICAgYXBwVmVyc2lvbjpzdHJpbmcgPSAnbmF2aWdhdG9yJyBpbiB3aW5kb3cgJiYgJ2FwcFZlcnNpb24nIGluIG5hdmlnYXRvciAmJiBuYXZpZ2F0b3IuYXBwVmVyc2lvbi50b0xvd2VyQ2FzZSgpIHx8ICcnO1xuXG4gICAgICAgIC8vQnJvd3NlcnNcbiAgICAgICAgZXhwb3J0IHZhciBpc0Nocm9tZTpib29sZWFuID0gL2Nocm9tZXxjaHJvbWl1bS9pLnRlc3QodXNlckFnZW50KSAmJiAvZ29vZ2xlIGluYy8udGVzdCh2ZW5kb3IpLFxuICAgICAgICAgICAgaXNGaXJlZm94OmJvb2xlYW4gPSAvZmlyZWZveC9pLnRlc3QodXNlckFnZW50KSxcbiAgICAgICAgICAgIGlzSUU6Ym9vbGVhbiA9IC9tc2llL2kudGVzdCh1c2VyQWdlbnQpIHx8IFwiQWN0aXZlWE9iamVjdFwiIGluIHdpbmRvdyxcbiAgICAgICAgICAgIGlzT3BlcmE6Ym9vbGVhbiA9IC9eT3BlcmFcXC8vLnRlc3QodXNlckFnZW50KSB8fCAvXFx4MjBPUFJcXC8vLnRlc3QodXNlckFnZW50KSxcbiAgICAgICAgICAgIGlzU2FmYXJpOmJvb2xlYW4gPSAvc2FmYXJpL2kudGVzdCh1c2VyQWdlbnQpICYmIC9hcHBsZSBjb21wdXRlci9pLnRlc3QodmVuZG9yKTtcblxuICAgICAgICAvL0RldmljZXMgJiYgT1NcbiAgICAgICAgZXhwb3J0IHZhciBpc0lwaG9uZTpib29sZWFuID0gL2lwaG9uZS9pLnRlc3QodXNlckFnZW50KSxcbiAgICAgICAgICAgIGlzSXBhZDpib29sZWFuID0gL2lwYWQvaS50ZXN0KHVzZXJBZ2VudCksXG4gICAgICAgICAgICBpc0lwb2Q6Ym9vbGVhbiA9IC9pcG9kL2kudGVzdCh1c2VyQWdlbnQpLFxuICAgICAgICAgICAgaXNBbmRyb2lkOmJvb2xlYW4gPSAvYW5kcm9pZC9pLnRlc3QodXNlckFnZW50KSxcbiAgICAgICAgICAgIGlzQW5kcm9pZFBob25lOmJvb2xlYW4gPSAvYW5kcm9pZC9pLnRlc3QodXNlckFnZW50KSAmJiAvbW9iaWxlL2kudGVzdCh1c2VyQWdlbnQpLFxuICAgICAgICAgICAgaXNBbmRyb2lkVGFibGV0OmJvb2xlYW4gPSAvYW5kcm9pZC9pLnRlc3QodXNlckFnZW50KSAmJiAhL21vYmlsZS9pLnRlc3QodXNlckFnZW50KSxcbiAgICAgICAgICAgIGlzTGludXg6Ym9vbGVhbiA9IC9saW51eC9pLnRlc3QoYXBwVmVyc2lvbiksXG4gICAgICAgICAgICBpc01hYzpib29sZWFuID0gL21hYy9pLnRlc3QoYXBwVmVyc2lvbiksXG4gICAgICAgICAgICBpc1dpbmRvdzpib29sZWFuID0gL3dpbi9pLnRlc3QoYXBwVmVyc2lvbiksXG4gICAgICAgICAgICBpc1dpbmRvd1Bob25lOmJvb2xlYW4gPSBpc1dpbmRvdyAmJiAvcGhvbmUvaS50ZXN0KHVzZXJBZ2VudCksXG4gICAgICAgICAgICBpc1dpbmRvd1RhYmxldDpib29sZWFuID0gaXNXaW5kb3cgJiYgIWlzV2luZG93UGhvbmUgJiYgL3RvdWNoL2kudGVzdCh1c2VyQWdlbnQpLFxuICAgICAgICAgICAgaXNNb2JpbGU6Ym9vbGVhbiA9IGlzSXBob25lIHx8IGlzSXBvZHx8IGlzQW5kcm9pZFBob25lIHx8IGlzV2luZG93UGhvbmUsXG4gICAgICAgICAgICBpc1RhYmxldDpib29sZWFuID0gaXNJcGFkIHx8IGlzQW5kcm9pZFRhYmxldCB8fCBpc1dpbmRvd1RhYmxldCxcbiAgICAgICAgICAgIGlzRGVza3RvcDpib29sZWFuID0gIWlzTW9iaWxlICYmICFpc1RhYmxldCxcbiAgICAgICAgICAgIGlzVG91Y2hEZXZpY2U6Ym9vbGVhbiA9ICdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdyB8fCdEb2N1bWVudFRvdWNoJyBpbiB3aW5kb3cgJiYgZG9jdW1lbnQgaW5zdGFuY2VvZiBEb2N1bWVudFRvdWNoLFxuICAgICAgICAgICAgaXNDb2Nvb246Ym9vbGVhbiA9ICEhbmF2aWdhdG9yLmlzQ29jb29uSlMsXG4gICAgICAgICAgICBpc05vZGVXZWJraXQ6Ym9vbGVhbiA9ICEhKHR5cGVvZiBwcm9jZXNzID09PSBcIm9iamVjdFwiICYmIHByb2Nlc3MudGl0bGUgPT09IFwibm9kZVwiICYmIHR5cGVvZiBnbG9iYWwgPT09IFwib2JqZWN0XCIpLFxuICAgICAgICAgICAgaXNFamVjdGE6Ym9vbGVhbiA9ICEhd2luZG93LmVqZWN0YSxcbiAgICAgICAgICAgIGlzQ3Jvc3N3YWxrOmJvb2xlYW4gPSAvQ3Jvc3N3YWxrLy50ZXN0KHVzZXJBZ2VudCksXG4gICAgICAgICAgICBpc0NvcmRvdmE6Ym9vbGVhbiA9ICEhd2luZG93LmNvcmRvdmEsXG4gICAgICAgICAgICBpc0VsZWN0cm9uOmJvb2xlYW4gPSAhISh0eXBlb2YgcHJvY2VzcyA9PT0gXCJvYmplY3RcIiAmJiBwcm9jZXNzLnZlcnNpb25zICYmIChwcm9jZXNzLnZlcnNpb25zLmVsZWN0cm9uIHx8IHByb2Nlc3MudmVyc2lvbnNbJ2F0b20tc2hlbGwnXSkpO1xuXG4gICAgICAgIGV4cG9ydCB2YXIgaXNWaWJyYXRlU3VwcG9ydGVkOmJvb2xlYW4gPSAhIW5hdmlnYXRvci52aWJyYXRlICYmIChpc01vYmlsZSB8fCBpc1RhYmxldCksXG4gICAgICAgICAgICBpc01vdXNlV2hlZWxTdXBwb3J0ZWQ6Ym9vbGVhbiA9ICdvbndoZWVsJyBpbiB3aW5kb3cgfHwgJ29ubW91c2V3aGVlbCcgaW4gd2luZG93IHx8ICdNb3VzZVNjcm9sbEV2ZW50JyBpbiB3aW5kb3csXG4gICAgICAgICAgICBpc0FjY2VsZXJvbWV0ZXJTdXBwb3J0ZWQ6Ym9vbGVhbiA9ICdEZXZpY2VNb3Rpb25FdmVudCcgaW4gd2luZG93LFxuICAgICAgICAgICAgaXNHYW1lcGFkU3VwcG9ydGVkOmJvb2xlYW4gPSAhIW5hdmlnYXRvci5nZXRHYW1lcGFkcyB8fCAhIW5hdmlnYXRvci53ZWJraXRHZXRHYW1lcGFkcztcblxuICAgICAgICAvL0Z1bGxTY3JlZW5cbiAgICAgICAgdmFyIGRpdjpIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB2YXIgZnVsbFNjcmVlblJlcXVlc3RWZW5kb3I6YW55ID0gZGl2LnJlcXVlc3RGdWxsc2NyZWVuIHx8IGRpdi53ZWJraXRSZXF1ZXN0RnVsbFNjcmVlbiB8fCBkaXYubXNSZXF1ZXN0RnVsbFNjcmVlbiB8fCBkaXYubW96UmVxdWVzdEZ1bGxTY3JlZW4sXG4gICAgICAgICAgICBmdWxsU2NyZWVuQ2FuY2VsVmVuZG9yOmFueSA9IGRvY3VtZW50LmNhbmNlbEZ1bGxTY3JlZW4gfHwgZG9jdW1lbnQuZXhpdEZ1bGxTY3JlZW4gfHwgZG9jdW1lbnQud2Via2l0Q2FuY2VsRnVsbFNjcmVlbiB8fCBkb2N1bWVudC5tc0NhbmNlbEZ1bGxTY3JlZW4gfHwgZG9jdW1lbnQubW96Q2FuY2VsRnVsbFNjcmVlbjtcblxuICAgICAgICBleHBvcnQgdmFyIGlzRnVsbFNjcmVlblN1cHBvcnRlZDpib29sZWFuID0gISEoZnVsbFNjcmVlblJlcXVlc3QgJiYgZnVsbFNjcmVlbkNhbmNlbCksXG4gICAgICAgICAgICBmdWxsU2NyZWVuUmVxdWVzdDpzdHJpbmcgPSAoZnVsbFNjcmVlblJlcXVlc3RWZW5kb3IpID8gZnVsbFNjcmVlblJlcXVlc3RWZW5kb3IubmFtZSA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGZ1bGxTY3JlZW5DYW5jZWw6c3RyaW5nID0gKGZ1bGxTY3JlZW5DYW5jZWxWZW5kb3IpID8gZnVsbFNjcmVlbkNhbmNlbFZlbmRvci5uYW1lIDogdW5kZWZpbmVkO1xuXG4gICAgICAgIC8vQXVkaW9cbiAgICAgICAgZXhwb3J0IHZhciBpc0hUTUxBdWRpb1N1cHBvcnRlZDpib29sZWFuID0gISF3aW5kb3cuQXVkaW8sXG4gICAgICAgICAgICB3ZWJBdWRpb0NvbnRleHQ6YW55ID0gd2luZG93LkF1ZGlvQ29udGV4dCB8fCB3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0LFxuICAgICAgICAgICAgaXNXZWJBdWRpb1N1cHBvcnRlZDpib29sZWFuID0gISF3ZWJBdWRpb0NvbnRleHQsXG4gICAgICAgICAgICBpc0F1ZGlvU3VwcG9ydGVkOmJvb2xlYW4gPSBpc1dlYkF1ZGlvU3VwcG9ydGVkIHx8IGlzSFRNTEF1ZGlvU3VwcG9ydGVkLFxuICAgICAgICAgICAgaXNNcDNTdXBwb3J0ZWQ6Ym9vbGVhbiA9IGZhbHNlLFxuICAgICAgICAgICAgaXNPZ2dTdXBwb3J0ZWQ6Ym9vbGVhbiA9IGZhbHNlLFxuICAgICAgICAgICAgaXNXYXZTdXBwb3J0ZWQ6Ym9vbGVhbiA9IGZhbHNlLFxuICAgICAgICAgICAgaXNNNGFTdXBwb3J0ZWQ6Ym9vbGVhbiA9IGZhbHNlLFxuICAgICAgICAgICAgZ2xvYmFsV2ViQXVkaW9Db250ZXh0OkF1ZGlvQ29udGV4dCA9IChpc1dlYkF1ZGlvU3VwcG9ydGVkKSA/IG5ldyB3ZWJBdWRpb0NvbnRleHQoKSA6IHVuZGVmaW5lZDtcblxuICAgICAgICAvL0F1ZGlvIG1pbWVUeXBlc1xuICAgICAgICBpZihpc0F1ZGlvU3VwcG9ydGVkKXtcbiAgICAgICAgICAgIHZhciBhdWRpbzpIVE1MQXVkaW9FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYXVkaW8nKTtcbiAgICAgICAgICAgIGlzTXAzU3VwcG9ydGVkID0gYXVkaW8uY2FuUGxheVR5cGUoJ2F1ZGlvL21wZWc7JykgIT09IFwiXCI7XG4gICAgICAgICAgICBpc09nZ1N1cHBvcnRlZCA9IGF1ZGlvLmNhblBsYXlUeXBlKCdhdWRpby9vZ2c7IGNvZGVjcz1cInZvcmJpc1wiJykgIT09IFwiXCI7XG4gICAgICAgICAgICBpc1dhdlN1cHBvcnRlZCA9IGF1ZGlvLmNhblBsYXlUeXBlKCdhdWRpby93YXYnKSAhPT0gXCJcIjtcbiAgICAgICAgICAgIGlzTTRhU3VwcG9ydGVkID0gYXVkaW8uY2FuUGxheVR5cGUoJ2F1ZGlvL21wNDsgY29kZWNzPVwibXA0YS40MC41XCInKSAhPT0gXCJcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBnZXRNb3VzZVdoZWVsRXZlbnQoKTpzdHJpbmd7XG4gICAgICAgICAgICBpZighaXNNb3VzZVdoZWVsU3VwcG9ydGVkKXJldHVybjtcbiAgICAgICAgICAgIHZhciBldnQ6c3RyaW5nO1xuICAgICAgICAgICAgaWYoJ29ud2hlZWwnIGluIHdpbmRvdyl7XG4gICAgICAgICAgICAgICAgZXZ0ID0gJ3doZWVsJztcbiAgICAgICAgICAgIH1lbHNlIGlmKCdvbm1vdXNld2hlZWwnIGluIHdpbmRvdyl7XG4gICAgICAgICAgICAgICAgZXZ0ID0gJ21vdXNld2hlZWwnO1xuICAgICAgICAgICAgfWVsc2UgaWYoJ01vdXNlU2Nyb2xsRXZlbnQnIGluIHdpbmRvdyl7XG4gICAgICAgICAgICAgICAgZXZ0ID0gJ0RPTU1vdXNlU2Nyb2xsJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGV2dDtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiB2aWJyYXRlKHBhdHRlcm46IG51bWJlciB8IG51bWJlcltdKTp2b2lke1xuICAgICAgICAgICAgaWYoaXNWaWJyYXRlU3VwcG9ydGVkKXtcbiAgICAgICAgICAgICAgICBuYXZpZ2F0b3IudmlicmF0ZShwYXR0ZXJuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBnZXRWaXNpYmlsaXR5Q2hhbmdlRXZlbnQoKTpzdHJpbmd7XG4gICAgICAgICAgICBpZih0eXBlb2YgZG9jdW1lbnQuaGlkZGVuICE9PSAndW5kZWZpbmVkJyl7XG4gICAgICAgICAgICAgICAgcmV0dXJuICd2aXNpYmlsaXR5Y2hhbmdlJztcbiAgICAgICAgICAgIH1lbHNlIGlmKHR5cGVvZiBkb2N1bWVudC53ZWJraXRIaWRkZW4gIT09ICd1bmRlZmluZWQnKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ3dlYmtpdHZpc2liaWxpdHljaGFuZ2UnO1xuICAgICAgICAgICAgfWVsc2UgaWYodHlwZW9mIGRvY3VtZW50Lm1vekhpZGRlbiAhPT0gJ3VuZGVmaW5lZCcpe1xuICAgICAgICAgICAgICAgIHJldHVybiAnbW96dmlzaWJpbGl0eWNoYW5nZSc7XG4gICAgICAgICAgICB9ZWxzZSBpZih0eXBlb2YgZG9jdW1lbnQubXNIaWRkZW4gIT09ICd1bmRlZmluZWQnKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ21zdmlzaWJpbGl0eWNoYW5nZSc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gaXNPbmxpbmUoKTpib29sZWFue1xuICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5uYXZpZ2F0b3Iub25MaW5lO1xuICAgICAgICB9XG5cblxuICAgIH1cbn1cblxuZGVjbGFyZSB2YXIgcHJvY2VzczphbnksXG4gICAgRG9jdW1lbnRUb3VjaDphbnksXG4gICAgZ2xvYmFsOmFueTtcblxuaW50ZXJmYWNlIE5hdmlnYXRvciB7XG4gICAgaXNDb2Nvb25KUzphbnk7XG4gICAgdmlicmF0ZShwYXR0ZXJuOiBudW1iZXIgfCBudW1iZXJbXSk6Ym9vbGVhbjtcbiAgICBnZXRHYW1lcGFkcygpOmFueTtcbiAgICB3ZWJraXRHZXRHYW1lcGFkcygpOmFueTtcbn1cblxuaW50ZXJmYWNlIFdpbmRvdyB7XG4gICAgZWplY3RhOmFueTtcbiAgICBjb3Jkb3ZhOmFueTtcbiAgICBBdWRpbygpOkhUTUxBdWRpb0VsZW1lbnQ7XG4gICAgQXVkaW9Db250ZXh0KCk6YW55O1xuICAgIHdlYmtpdEF1ZGlvQ29udGV4dCgpOmFueTtcbn1cblxuaW50ZXJmYWNlIGZ1bGxTY3JlZW5EYXRhIHtcbiAgICBuYW1lOnN0cmluZztcbn1cblxuaW50ZXJmYWNlIERvY3VtZW50IHtcbiAgICBjYW5jZWxGdWxsU2NyZWVuKCk6ZnVsbFNjcmVlbkRhdGEgO1xuICAgIGV4aXRGdWxsU2NyZWVuKCk6ZnVsbFNjcmVlbkRhdGEgO1xuICAgIHdlYmtpdENhbmNlbEZ1bGxTY3JlZW4oKTpmdWxsU2NyZWVuRGF0YSA7XG4gICAgbXNDYW5jZWxGdWxsU2NyZWVuKCk6ZnVsbFNjcmVlbkRhdGEgO1xuICAgIG1vekNhbmNlbEZ1bGxTY3JlZW4oKTpmdWxsU2NyZWVuRGF0YSA7XG4gICAgd2Via2l0SGlkZGVuOmFueTtcbiAgICBtb3pIaWRkZW46YW55O1xufVxuXG5pbnRlcmZhY2UgSFRNTERpdkVsZW1lbnQge1xuICAgIHJlcXVlc3RGdWxsc2NyZWVuKCk6ZnVsbFNjcmVlbkRhdGEgO1xuICAgIHdlYmtpdFJlcXVlc3RGdWxsU2NyZWVuKCk6ZnVsbFNjcmVlbkRhdGEgO1xuICAgIG1zUmVxdWVzdEZ1bGxTY3JlZW4oKTpmdWxsU2NyZWVuRGF0YSA7XG4gICAgbW96UmVxdWVzdEZ1bGxTY3JlZW4oKTpmdWxsU2NyZWVuRGF0YSA7XG59IiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vZGVmcy9waXhpLmpzLmQudHNcIiAvPlxubW9kdWxlIFBJWEkge1xuICAgIGV4cG9ydCBjbGFzcyBTY2VuZSBleHRlbmRzIENvbnRhaW5lciB7XG4gICAgICAgIGlkOnN0cmluZztcbiAgICAgICAgc3RhdGljIF9pZExlbjpudW1iZXIgPSAwO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGlkOnN0cmluZyA9IChcInNjZW5lXCIgKyBTY2VuZS5faWRMZW4rKykgKXtcbiAgICAgICAgICAgIHN1cGVyKCk7XG4gICAgICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIH1cblxuICAgICAgICBhZGRUbyhnYW1lOkdhbWV8Q29udGFpbmVyKTpTY2VuZSB7XG4gICAgICAgICAgICBpZihnYW1lIGluc3RhbmNlb2YgR2FtZSl7XG4gICAgICAgICAgICAgICAgPEdhbWU+Z2FtZS5hZGRTY2VuZSh0aGlzKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignU2NlbmVzIGNhbiBvbmx5IGJlIGFkZGVkIHRvIHRoZSBnYW1lJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgIH1cbn0iLCJtb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IGNsYXNzIElucHV0TWFuYWdlcntcbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBnYW1lOiBHYW1lKXtcblxuICAgICAgICB9XG4gICAgfVxufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2RlZnMvcGl4aS5qcy5kLnRzXCIgLz5cbm1vZHVsZSBQSVhJIHtcbiAgICBleHBvcnQgZnVuY3Rpb24gYml0bWFwRm9udFBhcnNlclRYVCgpOkZ1bmN0aW9ue1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24ocmVzb3VyY2U6IGxvYWRlcnMuUmVzb3VyY2UsIG5leHQ6RnVuY3Rpb24pOnZvaWR7XG5cbiAgICAgICAgICAgIC8vc2tpcCBpZiBubyBkYXRhIG9yIGlmIG5vdCB0eHRcbiAgICAgICAgICAgIGlmKCFyZXNvdXJjZS5kYXRhIHx8IChyZXNvdXJjZS54aHJUeXBlICE9PSBcInRleHRcIiAmJiByZXNvdXJjZS54aHJUeXBlICE9PSBcImRvY3VtZW50XCIpKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV4dCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgdGV4dDpzdHJpbmcgPSAocmVzb3VyY2UueGhyVHlwZSA9PT0gXCJ0ZXh0XCIpID8gcmVzb3VyY2UuZGF0YSA6IHJlc291cmNlLnhoci5yZXNwb25zZVRleHQ7XG5cbiAgICAgICAgICAgIC8vc2tpcCBpZiBub3QgYSBiaXRtYXAgZm9udCBkYXRhXG4gICAgICAgICAgICBpZiggdGV4dC5pbmRleE9mKFwicGFnZVwiKSA9PT0gLTEgfHxcbiAgICAgICAgICAgICAgICB0ZXh0LmluZGV4T2YoXCJmYWNlXCIpID09PSAtMSB8fFxuICAgICAgICAgICAgICAgIHRleHQuaW5kZXhPZihcImluZm9cIikgPT09IC0xIHx8XG4gICAgICAgICAgICAgICAgdGV4dC5pbmRleE9mKFwiY2hhclwiKSA9PT0gLTEgKXtcblxuICAgICAgICAgICAgICAgIHJldHVybiBuZXh0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciB1cmw6c3RyaW5nID0gZGlybmFtZShyZXNvdXJjZS51cmwpO1xuICAgICAgICAgICAgaWYodXJsID09PSBcIi5cIil7XG4gICAgICAgICAgICAgICAgdXJsID0gXCJcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYodGhpcy5iYXNlVXJsICYmIHVybCl7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5iYXNlVXJsLmNoYXJBdCh0aGlzLmJhc2VVcmwubGVuZ3RoLTEpPT09ICcvJyl7XG4gICAgICAgICAgICAgICAgICAgIHVybCArPSAnLyc7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdXJsLnJlcGxhY2UodGhpcy5iYXNlVXJsLCAnJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKHVybCAmJiB1cmwuY2hhckF0KHVybC5sZW5ndGggLSAxKSAhPT0gJy8nKXtcbiAgICAgICAgICAgICAgICB1cmwgKz0gJy8nO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgdGV4dHVyZVVybDpzdHJpbmcgPSBnZXRUZXh0dXJlVXJsKHVybCwgdGV4dCk7XG4gICAgICAgICAgICBpZih1dGlscy5UZXh0dXJlQ2FjaGVbdGV4dHVyZVVybF0pe1xuICAgICAgICAgICAgICAgIHBhcnNlKHJlc291cmNlLCB1dGlscy5UZXh0dXJlQ2FjaGVbdGV4dHVyZVVybF0pO1xuICAgICAgICAgICAgICAgIG5leHQoKTtcbiAgICAgICAgICAgIH1lbHNle1xuXG4gICAgICAgICAgICAgICAgdmFyIGxvYWRPcHRpb25zOmFueSA9IHtcbiAgICAgICAgICAgICAgICAgICAgY3Jvc3NPcmlnaW46IHJlc291cmNlLmNyb3NzT3JpZ2luLFxuICAgICAgICAgICAgICAgICAgICBsb2FkVHlwZTogbG9hZGVycy5SZXNvdXJjZS5MT0FEX1RZUEUuSU1BR0VcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgdGhpcy5hZGQocmVzb3VyY2UubmFtZSArICdfaW1hZ2UnLCB0ZXh0dXJlVXJsLCBsb2FkT3B0aW9ucywgZnVuY3Rpb24ocmVzOmFueSl7XG4gICAgICAgICAgICAgICAgICAgIHBhcnNlKHJlc291cmNlLCByZXMudGV4dHVyZSk7XG4gICAgICAgICAgICAgICAgICAgIG5leHQoKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIG5leHQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlKHJlc291cmNlOmxvYWRlcnMuUmVzb3VyY2UsIHRleHR1cmU6VGV4dHVyZSl7XG4gICAgICAgIHZhciBjdXJyZW50TGluZTpzdHJpbmcsIGF0dHI6YXR0ckRhdGEsXG4gICAgICAgICAgICBkYXRhOmZvbnREYXRhID0ge1xuICAgICAgICAgICAgICAgIGNoYXJzIDoge31cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgdmFyIHRleHQ6c3RyaW5nID0gKHJlc291cmNlLnhoclR5cGUgPT09IFwidGV4dFwiKSA/IHJlc291cmNlLmRhdGEgOiByZXNvdXJjZS54aHIucmVzcG9uc2VUZXh0O1xuICAgICAgICB2YXIgbGluZXM6c3RyaW5nW10gPSB0ZXh0LnNwbGl0KCdcXG4nKTtcblxuICAgICAgICBmb3IodmFyIGk6bnVtYmVyID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIGlmKGxpbmVzW2ldLmluZGV4T2YoXCJpbmZvXCIpID09PSAwKXtcbiAgICAgICAgICAgICAgICBjdXJyZW50TGluZSA9IGxpbmVzW2ldLnN1YnN0cmluZyg1KTtcbiAgICAgICAgICAgICAgICBhdHRyID0gZ2V0QXR0cihjdXJyZW50TGluZSk7XG5cbiAgICAgICAgICAgICAgICBkYXRhLmZvbnQgPSBhdHRyLmZhY2U7XG4gICAgICAgICAgICAgICAgZGF0YS5zaXplID0gcGFyc2VJbnQoYXR0ci5zaXplKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYobGluZXNbaV0uaW5kZXhPZignY29tbW9uICcpID09PSAwKXtcbiAgICAgICAgICAgICAgICBjdXJyZW50TGluZSA9IGxpbmVzW2ldLnN1YnN0cmluZyg3KTtcbiAgICAgICAgICAgICAgICBhdHRyID0gZ2V0QXR0cihjdXJyZW50TGluZSk7XG4gICAgICAgICAgICAgICAgZGF0YS5saW5lSGVpZ2h0ID0gcGFyc2VJbnQoYXR0ci5saW5lSGVpZ2h0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYobGluZXNbaV0uaW5kZXhPZihcImNoYXIgXCIpID09PSAwKXtcbiAgICAgICAgICAgICAgICBjdXJyZW50TGluZSA9IGxpbmVzW2ldLnN1YnN0cmluZyg1KTtcbiAgICAgICAgICAgICAgICBhdHRyID0gZ2V0QXR0cihjdXJyZW50TGluZSk7XG4gICAgICAgICAgICAgICAgdmFyIGNoYXJDb2RlOm51bWJlciA9IHBhcnNlSW50KGF0dHIuaWQpO1xuXG4gICAgICAgICAgICAgICAgdmFyIHRleHR1cmVSZWN0OlJlY3RhbmdsZSA9IG5ldyBSZWN0YW5nbGUoXG4gICAgICAgICAgICAgICAgICAgIHBhcnNlSW50KGF0dHIueCksXG4gICAgICAgICAgICAgICAgICAgIHBhcnNlSW50KGF0dHIueSksXG4gICAgICAgICAgICAgICAgICAgIHBhcnNlSW50KGF0dHIud2lkdGgpLFxuICAgICAgICAgICAgICAgICAgICBwYXJzZUludChhdHRyLmhlaWdodClcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgZGF0YS5jaGFyc1tjaGFyQ29kZV0gPSB7XG4gICAgICAgICAgICAgICAgICAgIHhPZmZzZXQ6IHBhcnNlSW50KGF0dHIueG9mZnNldCksXG4gICAgICAgICAgICAgICAgICAgIHlPZmZzZXQ6IHBhcnNlSW50KGF0dHIueW9mZnNldCksXG4gICAgICAgICAgICAgICAgICAgIHhBZHZhbmNlOiBwYXJzZUludChhdHRyLnhhZHZhbmNlKSxcbiAgICAgICAgICAgICAgICAgICAga2VybmluZzoge30sXG4gICAgICAgICAgICAgICAgICAgIHRleHR1cmU6IG5ldyBUZXh0dXJlKHRleHR1cmUuYmFzZVRleHR1cmUsIHRleHR1cmVSZWN0KVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKGxpbmVzW2ldLmluZGV4T2YoJ2tlcm5pbmcgJykgPT09IDApe1xuICAgICAgICAgICAgICAgIGN1cnJlbnRMaW5lID0gbGluZXNbaV0uc3Vic3RyaW5nKDgpO1xuICAgICAgICAgICAgICAgIGF0dHIgPSBnZXRBdHRyKGN1cnJlbnRMaW5lKTtcblxuICAgICAgICAgICAgICAgIHZhciBmaXJzdCA9IHBhcnNlSW50KGF0dHIuZmlyc3QpO1xuICAgICAgICAgICAgICAgIHZhciBzZWNvbmQgPSBwYXJzZUludChhdHRyLnNlY29uZCk7XG5cbiAgICAgICAgICAgICAgICBkYXRhLmNoYXJzW3NlY29uZF0ua2VybmluZ1tmaXJzdF0gPSBwYXJzZUludChhdHRyLmFtb3VudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXNvdXJjZS5iaXRtYXBGb250ID0gZGF0YTtcbiAgICAgICAgZXh0cmFzLkJpdG1hcFRleHQuZm9udHNbZGF0YS5mb250XSA9IGRhdGE7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGlybmFtZShwYXRoOnN0cmluZyk6c3RyaW5ne1xuICAgICAgICByZXR1cm4gcGF0aC5yZXBsYWNlKC9cXFxcL2csJy8nKS5yZXBsYWNlKC9cXC9bXlxcL10qJC8sICcnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRUZXh0dXJlVXJsKHVybDpzdHJpbmcsIGRhdGE6c3RyaW5nKTpzdHJpbmd7XG4gICAgICAgIHZhciB0ZXh0dXJlVXJsOnN0cmluZztcbiAgICAgICAgdmFyIGxpbmVzOnN0cmluZ1tdID0gZGF0YS5zcGxpdCgnXFxuJyk7XG5cbiAgICAgICAgZm9yKHZhciBpOm51bWJlciA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICBpZihsaW5lc1tpXS5pbmRleE9mKFwicGFnZVwiKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50TGluZTpzdHJpbmcgPSBsaW5lc1tpXS5zdWJzdHJpbmcoNSk7XG4gICAgICAgICAgICAgICAgdmFyIGZpbGU6c3RyaW5nID0gKGN1cnJlbnRMaW5lLnN1YnN0cmluZyhjdXJyZW50TGluZS5pbmRleE9mKCdmaWxlPScpKSkuc3BsaXQoJz0nKVsxXTtcbiAgICAgICAgICAgICAgICB0ZXh0dXJlVXJsID0gdXJsICsgZmlsZS5zdWJzdHIoMSwgZmlsZS5sZW5ndGgtMik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGV4dHVyZVVybDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRBdHRyKGxpbmU6c3RyaW5nKTphdHRyRGF0YXtcbiAgICAgICAgdmFyIHJlZ2V4OlJlZ0V4cCA9IC9cIihcXHcqXFxkKlxccyooLXxfKSopKlwiL2csXG4gICAgICAgICAgICBhdHRyOnN0cmluZ1tdID0gbGluZS5zcGxpdCgvXFxzKy9nKSxcbiAgICAgICAgICAgIGRhdGE6YW55ID0ge307XG5cbiAgICAgICAgZm9yKHZhciBpOm51bWJlciA9IDA7IGkgPCBhdHRyLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIHZhciBkOnN0cmluZ1tdID0gYXR0cltpXS5zcGxpdCgnPScpO1xuICAgICAgICAgICAgdmFyIG06UmVnRXhwTWF0Y2hBcnJheSA9IGRbMV0ubWF0Y2gocmVnZXgpO1xuICAgICAgICAgICAgaWYobSAmJiBtLmxlbmd0aCA+PSAxKXtcbiAgICAgICAgICAgICAgICBkWzFdID0gZFsxXS5zdWJzdHIoMSwgZFsxXS5sZW5ndGgtMik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkYXRhW2RbMF1dID0gZFsxXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiA8YXR0ckRhdGE+ZGF0YTtcbiAgICB9XG5cbiAgICBpbnRlcmZhY2UgZm9udERhdGEge1xuICAgICAgICBjaGFycz8gOiBhbnk7XG4gICAgICAgIGZvbnQ/IDogc3RyaW5nO1xuICAgICAgICBzaXplPyA6IG51bWJlcjtcbiAgICAgICAgbGluZUhlaWdodD8gOiBudW1iZXI7XG4gICAgfVxuXG4gICAgaW50ZXJmYWNlIGF0dHJEYXRhIHtcbiAgICAgICAgZmFjZT8gOiBzdHJpbmc7XG4gICAgICAgIHNpemU/IDogc3RyaW5nO1xuICAgICAgICBsaW5lSGVpZ2h0PyA6IHN0cmluZztcbiAgICAgICAgaWQ/IDogc3RyaW5nO1xuICAgICAgICB4PyA6IHN0cmluZztcbiAgICAgICAgeT8gOiBzdHJpbmc7XG4gICAgICAgIHdpZHRoPyA6IHN0cmluZztcbiAgICAgICAgaGVpZ2h0PyA6IHN0cmluZztcbiAgICAgICAgeG9mZnNldD8gOiBzdHJpbmc7XG4gICAgICAgIHlvZmZzZXQ/IDogc3RyaW5nO1xuICAgICAgICB4YWR2YW5jZT8gOiBzdHJpbmc7XG4gICAgICAgIGZpcnN0PyA6IHN0cmluZztcbiAgICAgICAgc2Vjb25kPyA6IHN0cmluZztcbiAgICAgICAgYW1vdW50PyA6IHN0cmluZztcbiAgICB9XG59IiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vYXVkaW8vQXVkaW9NYW5hZ2VyLnRzXCIgLz5cbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL0F1ZGlvL0F1ZGlvLnRzXCIgLz5cbm1vZHVsZSBQSVhJIHtcbiAgICB2YXIgX2FsbG93ZWRFeHQ6c3RyaW5nW10gPSBbXCJtNGFcIiwgXCJvZ2dcIiwgXCJtcDNcIiwgXCJ3YXZcIl07XG5cbiAgICBleHBvcnQgZnVuY3Rpb24gYXVkaW9QYXJzZXIoKTpGdW5jdGlvbiB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihyZXNvdXJjZTpsb2FkZXJzLlJlc291cmNlLCBuZXh0OkZ1bmN0aW9uKTp2b2lke1xuICAgICAgICAgICAgaWYoIURldmljZS5pc0F1ZGlvU3VwcG9ydGVkIHx8ICFyZXNvdXJjZS5kYXRhKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV4dCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZXh0OnN0cmluZyA9IF9nZXRFeHQocmVzb3VyY2UudXJsKTtcblxuICAgICAgICAgICAgaWYoX2FsbG93ZWRFeHQuaW5kZXhPZihleHQpID09PSAtMSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5leHQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoIV9jYW5QbGF5KGV4dCkpe1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXh0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBuYW1lOnN0cmluZyA9IHJlc291cmNlLm5hbWUgfHwgcmVzb3VyY2UudXJsO1xuICAgICAgICAgICAgaWYodXRpbHMuX2F1ZGlvVHlwZVNlbGVjdGVkID09PSBBVURJT19UWVBFLldFQkFVRElPKXtcbiAgICAgICAgICAgICAgICBEZXZpY2UuZ2xvYmFsV2ViQXVkaW9Db250ZXh0LmRlY29kZUF1ZGlvRGF0YShyZXNvdXJjZS5kYXRhLCBfYWRkVG9DYWNoZS5iaW5kKHRoaXMsIG5leHQsIG5hbWUpKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHJldHVybiBfYWRkVG9DYWNoZShuZXh0LCBuYW1lLCByZXNvdXJjZS5kYXRhKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGF1ZGlvUGFyc2VyVXJsKHJlc291cmNlVXJsOnN0cmluZ1tdKTpzdHJpbmd7XG4gICAgICAgIHZhciBleHQ6c3RyaW5nO1xuICAgICAgICB2YXIgdXJsOnN0cmluZztcbiAgICAgICAgZm9yKHZhciBpOm51bWJlciA9IDA7IGkgPCByZXNvdXJjZVVybC5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICBleHQgPSBfZ2V0RXh0KHJlc291cmNlVXJsW2ldKTtcblxuICAgICAgICAgICAgaWYoX2FsbG93ZWRFeHQuaW5kZXhPZihleHQpID09PSAtMSl7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKF9jYW5QbGF5KGV4dCkpe1xuICAgICAgICAgICAgICAgIHVybCA9IHJlc291cmNlVXJsW2ldO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHVybDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfYWRkVG9DYWNoZShuZXh0OkZ1bmN0aW9uLCBuYW1lOnN0cmluZywgZGF0YTphbnkpe1xuICAgICAgICB1dGlscy5BdWRpb0NhY2hlW25hbWVdID0gbmV3IEF1ZGlvKGRhdGEsIG5hbWUpO1xuICAgICAgICByZXR1cm4gbmV4dCgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9nZXRFeHQodXJsOnN0cmluZyk6c3RyaW5ne1xuICAgICAgICByZXR1cm4gdXJsLnNwbGl0KCc/Jykuc2hpZnQoKS5zcGxpdCgnLicpLnBvcCgpLnRvTG93ZXJDYXNlKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2NhblBsYXkoZXh0OnN0cmluZyk6Ym9vbGVhbntcbiAgICAgICAgdmFyIGRldmljZUNhblBsYXk6Ym9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBzd2l0Y2goZXh0KXtcbiAgICAgICAgICAgIGNhc2UgXCJtNGFcIjpkZXZpY2VDYW5QbGF5ID0gRGV2aWNlLmlzTTRhU3VwcG9ydGVkOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJtcDNcIjpkZXZpY2VDYW5QbGF5ID0gRGV2aWNlLmlzTXAzU3VwcG9ydGVkOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJvZ2dcIjpkZXZpY2VDYW5QbGF5ID0gRGV2aWNlLmlzT2dnU3VwcG9ydGVkOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJ3YXZcIjpkZXZpY2VDYW5QbGF5ID0gRGV2aWNlLmlzV2F2U3VwcG9ydGVkOyBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGV2aWNlQ2FuUGxheTtcbiAgICB9XG59XG4iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9kZWZzL3BpeGkuanMuZC50c1wiIC8+XG5tb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IG1vZHVsZSB1dGlscyB7XG4gICAgICAgIGV4cG9ydCB2YXIgX2F1ZGlvVHlwZVNlbGVjdGVkOm51bWJlciA9IEFVRElPX1RZUEUuV0VCQVVESU87XG4gICAgICAgIGV4cG9ydCB2YXIgQXVkaW9DYWNoZTphbnkgPSB7fTtcbiAgICB9XG59IiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vZGVmcy9waXhpLmpzLmQudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vY29yZS9jb25zdC50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuL2JpdG1hcEZvbnRQYXJzZXJUeHQudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi9hdWRpb1BhcnNlci50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9jb3JlL1V0aWxzLnRzXCIgLz5cbm1vZHVsZSBQSVhJIHtcbiAgICBleHBvcnQgbW9kdWxlIGxvYWRlcnN7XG4gICAgICAgIExvYWRlci5hZGRQaXhpTWlkZGxld2FyZShiaXRtYXBGb250UGFyc2VyVFhUKTtcbiAgICAgICAgTG9hZGVyLmFkZFBpeGlNaWRkbGV3YXJlKGF1ZGlvUGFyc2VyKTtcblxuICAgICAgICBjbGFzcyBUdXJib0xvYWRlciBleHRlbmRzIExvYWRlciB7XG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihiYXNlVXJsOiBzdHJpbmcsIGFzc2V0Q29uY3VycmVuY3k6IG51bWJlcil7XG4gICAgICAgICAgICAgICAgc3VwZXIoYmFzZVVybCwgYXNzZXRDb25jdXJyZW5jeSk7XG4gICAgICAgICAgICAgICAgaWYoRGV2aWNlLmlzQXVkaW9TdXBwb3J0ZWQpe1xuICAgICAgICAgICAgICAgICAgICBfY2hlY2tBdWRpb1R5cGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGFkZChuYW1lOmFueSwgdXJsPzphbnkgLG9wdGlvbnM/OmFueSwgY2I/OmFueSk6TG9hZGVye1xuICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBuYW1lID09PSAnb2JqZWN0Jyl7XG4gICAgICAgICAgICAgICAgICAgIGlmKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChuYW1lLnVybCkgPT09IFwiW29iamVjdCBBcnJheV1cIil7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lLnVybCA9IGF1ZGlvUGFyc2VyVXJsKG5hbWUudXJsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh1cmwpID09PSBcIltvYmplY3QgQXJyYXldXCIpe1xuICAgICAgICAgICAgICAgICAgICB1cmwgPSBhdWRpb1BhcnNlclVybCh1cmwpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBzdXBlci5hZGQobmFtZSwgdXJsLCBvcHRpb25zLCBjYik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsb2FkZXJzLkxvYWRlciA9IFR1cmJvTG9hZGVyO1xuXG5cbiAgICAgICAgZnVuY3Rpb24gX2NoZWNrQXVkaW9UeXBlKCk6dm9pZHtcbiAgICAgICAgICAgIGlmKERldmljZS5pc01wM1N1cHBvcnRlZClfc2V0QXVkaW9FeHQoXCJtcDNcIik7XG4gICAgICAgICAgICBpZihEZXZpY2UuaXNPZ2dTdXBwb3J0ZWQpX3NldEF1ZGlvRXh0KFwib2dnXCIpO1xuICAgICAgICAgICAgaWYoRGV2aWNlLmlzV2F2U3VwcG9ydGVkKV9zZXRBdWRpb0V4dChcIndhdlwiKTtcbiAgICAgICAgICAgIGlmKERldmljZS5pc000YVN1cHBvcnRlZClfc2V0QXVkaW9FeHQoXCJtNGFcIik7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBfc2V0QXVkaW9FeHQoZXh0OnN0cmluZyk6dm9pZCB7XG4gICAgICAgICAgICBpZih1dGlscy5fYXVkaW9UeXBlU2VsZWN0ZWQgPT09IEFVRElPX1RZUEUuV0VCQVVESU8pe1xuICAgICAgICAgICAgICAgIFJlc291cmNlLnNldEV4dGVuc2lvblhoclR5cGUoZXh0LCBSZXNvdXJjZS5YSFJfUkVTUE9OU0VfVFlQRS5CVUZGRVIpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgUmVzb3VyY2Uuc2V0RXh0ZW5zaW9uTG9hZFR5cGUoZXh0LCBSZXNvdXJjZS5MT0FEX1RZUEUuQVVESU8pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSIsIm1vZHVsZSBQSVhJIHtcbiAgICBleHBvcnQgY2xhc3MgRGF0YU1hbmFnZXJ7XG4gICAgICAgIHByaXZhdGUgX2RhdGE6YW55O1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgaWQ6c3RyaW5nLCBwdWJsaWMgdXNlUGVyc2lzdGFudERhdGE6Ym9vbGVhbiA9IGZhbHNlKXtcbiAgICAgICAgICAgIHRoaXMubG9hZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgbG9hZCgpOkRhdGFNYW5hZ2Vye1xuICAgICAgICAgICAgdGhpcy5fZGF0YSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5pZCkpIHx8IHt9O1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBzYXZlKCk6RGF0YU1hbmFnZXJ7XG4gICAgICAgICAgICBpZih0aGlzLnVzZVBlcnNpc3RhbnREYXRhKXtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLmlkLCBKU09OLnN0cmluZ2lmeSh0aGlzLl9kYXRhKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc2V0KCk6RGF0YU1hbmFnZXJ7XG4gICAgICAgICAgICB0aGlzLl9kYXRhID0ge307XG4gICAgICAgICAgICB0aGlzLnNhdmUoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0KGtleTpzdHJpbmcgfCBPYmplY3QsIHZhbHVlPzphbnkpOkRhdGFNYW5hZ2Vye1xuICAgICAgICAgICAgaWYoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGtleSkgPT09IFwiW29iamVjdCBPYmplY3RdXCIpe1xuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24odGhpcy5fZGF0YSwga2V5KTtcbiAgICAgICAgICAgIH1lbHNlIGlmKHR5cGVvZiBrZXkgPT09IFwic3RyaW5nXCIpe1xuICAgICAgICAgICAgICAgIHRoaXMuX2RhdGFba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnNhdmUoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0KGtleT86c3RyaW5nKTphbnl7XG4gICAgICAgICAgICBpZigha2V5KXtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZGF0YTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGFba2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRlbChrZXk6c3RyaW5nKTpEYXRhTWFuYWdlcntcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9kYXRhW2tleV07XG4gICAgICAgICAgICB0aGlzLnNhdmUoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICB9XG59IiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vZGVmcy9waXhpLmpzLmQudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi9jb25zdC50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuL0RldmljZS50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9kaXNwbGF5L1NjZW5lLnRzXCIgLz5cbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL2F1ZGlvL0F1ZGlvTWFuYWdlci50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9pbnB1dC9JbnB1dE1hbmFnZXIudHNcIiAvPlxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vbG9hZGVyL0xvYWRlci50c1wiIC8+XG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuL0RhdGFNYW5hZ2VyLnRzXCIgLz5cbm1vZHVsZSBQSVhJIHtcbiAgICB2YXIgbGFzdDpudW1iZXIgPSAwO1xuICAgIHZhciBtYXhGcmFtZU1TID0gMC4zNTtcblxuICAgIHZhciBkZWZhdWx0R2FtZUNvbmZpZyA6IEdhbWVDb25maWcgPSB7XG4gICAgICAgIGlkOiBcInBpeGkuZGVmYXVsdC5pZFwiLFxuICAgICAgICB3aWR0aDo4MDAsXG4gICAgICAgIGhlaWdodDo2MDAsXG4gICAgICAgIHVzZVdlYkF1ZGlvOiB0cnVlLFxuICAgICAgICB1c2VQZXJzaXN0YW50RGF0YTogZmFsc2UsXG4gICAgICAgIGdhbWVTY2FsZVR5cGU6IEdBTUVfU0NBTEVfVFlQRS5OT05FLFxuICAgICAgICBzdG9wQXRMb3N0Rm9jdXM6IHRydWUsXG4gICAgICAgIGFzc2V0c1VybDogXCIuL1wiLFxuICAgICAgICBsb2FkZXJDb25jdXJyZW5jeTogMTAsXG4gICAgICAgIGF1ZGlvQ2hhbm5lbExpbmVzOiAxMCxcbiAgICAgICAgc291bmRDaGFubmVsTGluZXM6IDEwLFxuICAgICAgICBtdXNpY0NoYW5uZWxMaW5lczogMVxuICAgIH07XG5cbiAgICBleHBvcnQgY2xhc3MgR2FtZSB7XG4gICAgICAgIGlkOnN0cmluZztcbiAgICAgICAgcmFmOmFueTtcblxuICAgICAgICBwcml2YXRlIF9zY2VuZXM6U2NlbmVbXSA9IFtdO1xuICAgICAgICBzY2VuZTpTY2VuZTtcblxuICAgICAgICBhdWRpbzpBdWRpb01hbmFnZXI7XG4gICAgICAgIGlucHV0OklucHV0TWFuYWdlcjtcbiAgICAgICAgZGF0YTpEYXRhTWFuYWdlcjtcbiAgICAgICAgbG9hZGVyOmxvYWRlcnMuTG9hZGVyO1xuXG4gICAgICAgIHJlbmRlcmVyOldlYkdMUmVuZGVyZXIgfCBDYW52YXNSZW5kZXJlcjtcbiAgICAgICAgY2FudmFzOkhUTUxDYW52YXNFbGVtZW50O1xuXG4gICAgICAgIGRlbHRhOm51bWJlciA9IDA7XG4gICAgICAgIHRpbWU6bnVtYmVyID0gMDtcbiAgICAgICAgbGFzdFRpbWU6bnVtYmVyID0gMDtcblxuICAgICAgICBpc1dlYkdMOmJvb2xlYW47XG4gICAgICAgIGlzV2ViQXVkaW86Ym9vbGVhbjtcblxuICAgICAgICBwcml2YXRlIF9yZXNpemVMaXN0ZW5lcjphbnk7XG5cbiAgICAgICAgY29uc3RydWN0b3IoY29uZmlnPzpHYW1lQ29uZmlnLCByZW5kZXJlck9wdGlvbnM/OlJlbmRlcmVyT3B0aW9ucykge1xuICAgICAgICAgICAgY29uZmlnID0gKDxPYmplY3Q+T2JqZWN0KS5hc3NpZ24oZGVmYXVsdEdhbWVDb25maWcsIGNvbmZpZyk7XG4gICAgICAgICAgICB0aGlzLmlkID0gY29uZmlnLmlkO1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJlciA9IGF1dG9EZXRlY3RSZW5kZXJlcihjb25maWcud2lkdGgsIGNvbmZpZy5oZWlnaHQsIHJlbmRlcmVyT3B0aW9ucyk7XG4gICAgICAgICAgICB0aGlzLmNhbnZhcyA9IHRoaXMucmVuZGVyZXIudmlldztcblxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XG5cbiAgICAgICAgICAgIHRoaXMuaXNXZWJHTCA9ICh0aGlzLnJlbmRlcmVyLnR5cGUgPT09IFJFTkRFUkVSX1RZUEUuV0VCR0wpO1xuICAgICAgICAgICAgdGhpcy5pc1dlYkF1ZGlvID0gKERldmljZS5pc0F1ZGlvU3VwcG9ydGVkJiZEZXZpY2UuaXNXZWJBdWRpb1N1cHBvcnRlZCYmY29uZmlnLnVzZVdlYkF1ZGlvKTtcbiAgICAgICAgICAgIHV0aWxzLl9hdWRpb1R5cGVTZWxlY3RlZCA9IHRoaXMuaXNXZWJBdWRpbyA/IEFVRElPX1RZUEUuV0VCQVVESU8gOiBBVURJT19UWVBFLkhUTUxBVURJTztcblxuICAgICAgICAgICAgdGhpcy5pbnB1dCA9IG5ldyBJbnB1dE1hbmFnZXIodGhpcyk7XG4gICAgICAgICAgICB0aGlzLmF1ZGlvID0gbmV3IEF1ZGlvTWFuYWdlcihjb25maWcuYXVkaW9DaGFubmVsTGluZXMsIGNvbmZpZy5zb3VuZENoYW5uZWxMaW5lcywgY29uZmlnLm11c2ljQ2hhbm5lbExpbmVzKTtcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IG5ldyBEYXRhTWFuYWdlcih0aGlzLmlkLCBjb25maWcudXNlUGVyc2lzdGFudERhdGEpO1xuICAgICAgICAgICAgdGhpcy5sb2FkZXIgPSBuZXcgbG9hZGVycy5Mb2FkZXIoY29uZmlnLmFzc2V0c1VybCwgY29uZmlnLmxvYWRlckNvbmN1cnJlbmN5KTtcblxuICAgICAgICAgICAgdmFyIGluaXRpYWxTY2VuZTpTY2VuZSA9IG5ldyBTY2VuZSgnaW5pdGlhbCcpLmFkZFRvKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5zZXRTY2VuZShpbml0aWFsU2NlbmUpO1xuXG4gICAgICAgICAgICBpZihjb25maWcuZ2FtZVNjYWxlVHlwZSAhPT0gR0FNRV9TQ0FMRV9UWVBFLk5PTkUpe1xuICAgICAgICAgICAgICAgIHRoaXMuYXV0b1Jlc2l6ZShjb25maWcuZ2FtZVNjYWxlVHlwZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKGNvbmZpZy5zdG9wQXRMb3N0Rm9jdXMpe1xuICAgICAgICAgICAgICAgIHRoaXMuZW5hYmxlU3RvcEF0TG9zdEZvY3VzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9hbmltYXRlKCk6dm9pZCB7XG4gICAgICAgICAgICB0aGlzLnJhZiA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5fYW5pbWF0ZS5iaW5kKHRoaXMpKTtcblxuICAgICAgICAgICAgaWYodGhpcy5zY2VuZSkge1xuICAgICAgICAgICAgICAgIHZhciBub3c6bnVtYmVyID0gRGF0ZS5ub3coKTtcblxuICAgICAgICAgICAgICAgIHRoaXMudGltZSArPSBNYXRoLm1pbigobm93IC0gbGFzdCkgLyAxMDAwLCBtYXhGcmFtZU1TKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRlbHRhID0gdGhpcy50aW1lIC0gdGhpcy5sYXN0VGltZTtcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RUaW1lID0gdGhpcy50aW1lO1xuXG4gICAgICAgICAgICAgICAgbGFzdCA9IG5vdztcblxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIucmVuZGVyKHRoaXMuc2NlbmUpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGUodGhpcy5kZWx0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB1cGRhdGUoZGVsdGFUaW1lOm51bWJlcik6R2FtZSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc2NlbmUuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNjZW5lLmNoaWxkcmVuW2ldLnVwZGF0ZSh0aGlzLmRlbHRhKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9jbGVhbiBraWxsZWQgb2JqZWN0c1xuICAgICAgICAgICAgdmFyIGxlbjpudW1iZXIgPSBDb250YWluZXIuX2tpbGxlZE9iamVjdHMubGVuZ3RoO1xuICAgICAgICAgICAgaWYgKGxlbikge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGk6bnVtYmVyID0gMDsgaSA8IGxlbjsgaSsrKSBDb250YWluZXIuX2tpbGxlZE9iamVjdHNbaV0ucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgQ29udGFpbmVyLl9raWxsZWRPYmplY3RzLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhcnQoKTpHYW1lIHtcbiAgICAgICAgICAgIGxhc3QgPSBEYXRlLm5vdygpO1xuICAgICAgICAgICAgdGhpcy5fYW5pbWF0ZSgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBzdG9wKCk6R2FtZSB7XG4gICAgICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5yYWYpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBlbmFibGVTdG9wQXRMb3N0Rm9jdXMoc3RhdGU6Ym9vbGVhbiA9IHRydWUpOkdhbWV7XG4gICAgICAgICAgICBpZihzdGF0ZSl7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihEZXZpY2UuZ2V0VmlzaWJpbGl0eUNoYW5nZUV2ZW50KCksIHRoaXMuX29uVmlzaWJpbGl0eUNoYW5nZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoRGV2aWNlLmdldFZpc2liaWxpdHlDaGFuZ2VFdmVudCgpLCB0aGlzLl9vblZpc2liaWxpdHlDaGFuZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBkaXNhYmxlU3RvcEF0TG9zdEZvY3VzKCk6R2FtZXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVuYWJsZVN0b3BBdExvc3RGb2N1cyhmYWxzZSk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9vblZpc2liaWxpdHlDaGFuZ2UoKXtcbiAgICAgICAgICAgIHZhciBpc0hpZGUgPSAhIShkb2N1bWVudC5oaWRkZW4gfHwgZG9jdW1lbnQud2Via2l0SGlkZGVuIHx8IGRvY3VtZW50Lm1vekhpZGRlbiB8fCBkb2N1bWVudC5tc0hpZGRlbik7XG4gICAgICAgICAgICBpZihpc0hpZGUpe1xuICAgICAgICAgICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLm9uTG9zdEZvY3VzKGlzSGlkZSk7XG4gICAgICAgIH1cblxuICAgICAgICBvbkxvc3RGb2N1cyhpc0hpZGU6Ym9vbGVhbik6R2FtZXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0U2NlbmUoc2NlbmU6U2NlbmUgfCBzdHJpbmcpOkdhbWUge1xuICAgICAgICAgICAgaWYoIShzY2VuZSBpbnN0YW5jZW9mIFNjZW5lKSl7XG4gICAgICAgICAgICAgICAgc2NlbmUgPSB0aGlzLmdldFNjZW5lKDxzdHJpbmc+c2NlbmUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnNjZW5lID0gPFNjZW5lPnNjZW5lO1xuICAgICAgICAgICAgdGhpcy5zY2VuZS5wb3NpdGlvbi5zZXQodGhpcy53aWR0aC8yLCB0aGlzLmhlaWdodC8yKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0U2NlbmUoaWQ6c3RyaW5nKTpTY2VuZXtcbiAgICAgICAgICAgIHZhciBzY2VuZTpTY2VuZSA9IG51bGw7XG4gICAgICAgICAgICBmb3IodmFyIGk6bnVtYmVyID0gMDsgaSA8IHRoaXMuX3NjZW5lcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5fc2NlbmVzW2ldLmlkID09PSBpZCl7XG4gICAgICAgICAgICAgICAgICAgIHNjZW5lID0gdGhpcy5fc2NlbmVzW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHNjZW5lO1xuICAgICAgICB9XG5cbiAgICAgICAgY3JlYXRlU2NlbmUoaWQ/OnN0cmluZyk6U2NlbmUge1xuICAgICAgICAgICAgcmV0dXJuIChuZXcgU2NlbmUoaWQpKS5hZGRUbyh0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZVNjZW5lKHNjZW5lOnN0cmluZyB8IFNjZW5lKTpHYW1le1xuICAgICAgICAgICAgaWYodHlwZW9mIHNjZW5lID09PSBcInN0cmluZ1wiKXtcbiAgICAgICAgICAgICAgICBzY2VuZSA9IHRoaXMuZ2V0U2NlbmUoPHN0cmluZz5zY2VuZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBpbmRleDpudW1iZXIgPSB0aGlzLl9zY2VuZXMuaW5kZXhPZig8U2NlbmU+c2NlbmUpO1xuICAgICAgICAgICAgaWYoaW5kZXggIT09IC0xKXtcbiAgICAgICAgICAgICAgICB0aGlzLl9zY2VuZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBhZGRTY2VuZShzY2VuZTpTY2VuZSk6R2FtZSB7XG4gICAgICAgICAgICB0aGlzLl9zY2VuZXMucHVzaChzY2VuZSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZUFsbFNjZW5lcygpOkdhbWV7XG4gICAgICAgICAgICB0aGlzLl9zY2VuZXMubGVuZ3RoID0gMDtcbiAgICAgICAgICAgIHRoaXMuc2NlbmUgPSBudWxsO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICByZXNpemUod2lkdGg6bnVtYmVyLCBoZWlnaHQ6bnVtYmVyLCByZW5kZXJlcjpib29sZWFuID0gZmFsc2UpOkdhbWV7XG4gICAgICAgICAgICBpZihyZW5kZXJlcil7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5yZXNpemUod2lkdGgsIGhlaWdodCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLndpZHRoID0gd2lkdGggKyBcInB4XCI7XG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyBcInB4XCI7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgYXV0b1Jlc2l6ZShtb2RlOm51bWJlcik6R2FtZSB7XG4gICAgICAgICAgICBpZih0aGlzLl9yZXNpemVMaXN0ZW5lcil7XG4gICAgICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX3Jlc2l6ZUxpc3RlbmVyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYobW9kZSA9PT0gR0FNRV9TQ0FMRV9UWVBFLk5PTkUpcmV0dXJuO1xuXG4gICAgICAgICAgICBzd2l0Y2gobW9kZSl7XG4gICAgICAgICAgICAgICAgY2FzZSBHQU1FX1NDQUxFX1RZUEUuQVNQRUNUX0ZJVDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVzaXplTGlzdGVuZXIgPSB0aGlzLl9yZXNpemVNb2RlQXNwZWN0Rml0O1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIEdBTUVfU0NBTEVfVFlQRS5BU1BFQ1RfRklMTDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVzaXplTGlzdGVuZXIgPSB0aGlzLl9yZXNpemVNb2RlQXNwZWN0RmlsbDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBHQU1FX1NDQUxFX1RZUEUuRklMTDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVzaXplTGlzdGVuZXIgPSB0aGlzLl9yZXNpemVNb2RlRmlsbDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl9yZXNpemVMaXN0ZW5lci5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIHRoaXMuX3Jlc2l6ZUxpc3RlbmVyKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX3Jlc2l6ZU1vZGVBc3BlY3RGaXQoKTp2b2lke1xuICAgICAgICAgICAgdmFyIHd3Om51bWJlciA9IHBhcnNlSW50KHRoaXMuY2FudmFzLnN0eWxlLndpZHRoLCAxMCkgfHwgdGhpcy5jYW52YXMud2lkdGg7XG4gICAgICAgICAgICB2YXIgaGg6bnVtYmVyID0gcGFyc2VJbnQodGhpcy5jYW52YXMuc3R5bGUuaGVpZ2h0LCAxMCkgfHwgdGhpcy5jYW52YXMuaGVpZ2h0O1xuICAgICAgICAgICAgaWYod2luZG93LmlubmVyV2lkdGggIT09IHd3IHx8IHdpbmRvdy5pbm5lckhlaWdodCAhPT0gaGgpe1xuICAgICAgICAgICAgICAgIHZhciBzY2FsZTpudW1iZXIgPSBNYXRoLm1pbih3aW5kb3cuaW5uZXJXaWR0aC90aGlzLndpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQvdGhpcy5oZWlnaHQpO1xuICAgICAgICAgICAgICAgIHRoaXMucmVzaXplKHRoaXMud2lkdGgqc2NhbGUsIHRoaXMuaGVpZ2h0KnNjYWxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX3Jlc2l6ZU1vZGVBc3BlY3RGaWxsKCk6dm9pZHtcbiAgICAgICAgICAgIHZhciB3dzpudW1iZXIgPSBwYXJzZUludCh0aGlzLmNhbnZhcy5zdHlsZS53aWR0aCwgMTApIHx8IHRoaXMuY2FudmFzLndpZHRoO1xuICAgICAgICAgICAgdmFyIGhoOm51bWJlciA9IHBhcnNlSW50KHRoaXMuY2FudmFzLnN0eWxlLmhlaWdodCwgMTApIHx8IHRoaXMuY2FudmFzLmhlaWdodDtcbiAgICAgICAgICAgIGlmKHdpbmRvdy5pbm5lcldpZHRoICE9PSB3dyB8fCB3aW5kb3cuaW5uZXJIZWlnaHQgIT09IGhoKXtcbiAgICAgICAgICAgICAgICB2YXIgc2NhbGU6bnVtYmVyID0gTWF0aC5tYXgod2luZG93LmlubmVyV2lkdGgvdGhpcy53aWR0aCwgd2luZG93LmlubmVySGVpZ2h0L3RoaXMuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICB2YXIgd2lkdGg6bnVtYmVyID0gdGhpcy53aWR0aCpzY2FsZTtcbiAgICAgICAgICAgICAgICB2YXIgaGVpZ2h0Om51bWJlciA9IHRoaXMuaGVpZ2h0KnNjYWxlO1xuXG4gICAgICAgICAgICAgICAgdmFyIHRvcE1hcmdpbjpudW1iZXIgPSAod2luZG93LmlubmVySGVpZ2h0LWhlaWdodCkvMjtcbiAgICAgICAgICAgICAgICB2YXIgbGVmdE1hcmdpbjpudW1iZXIgPSAod2luZG93LmlubmVyV2lkdGgtd2lkdGgpLzI7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnJlc2l6ZSh3aWR0aCwgaGVpZ2h0KTtcblxuICAgICAgICAgICAgICAgIHZhciBzdHlsZTphbnkgPSA8YW55PnRoaXMuY2FudmFzLnN0eWxlO1xuICAgICAgICAgICAgICAgIHN0eWxlWydtYXJnaW4tdG9wJ10gPSB0b3BNYXJnaW4gKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgc3R5bGVbJ21hcmdpbi1sZWZ0J10gPSBsZWZ0TWFyZ2luICsgXCJweFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfcmVzaXplTW9kZUZpbGwoKTp2b2lke1xuICAgICAgICAgICAgdmFyIHd3Om51bWJlciA9IHBhcnNlSW50KHRoaXMuY2FudmFzLnN0eWxlLndpZHRoLCAxMCkgfHwgdGhpcy5jYW52YXMud2lkdGg7XG4gICAgICAgICAgICB2YXIgaGg6bnVtYmVyID0gcGFyc2VJbnQodGhpcy5jYW52YXMuc3R5bGUuaGVpZ2h0LCAxMCkgfHwgdGhpcy5jYW52YXMuaGVpZ2h0O1xuICAgICAgICAgICAgaWYod2luZG93LmlubmVyV2lkdGggIT09IHd3IHx8IHdpbmRvdy5pbm5lckhlaWdodCAhPT0gaGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGdldCB3aWR0aCgpOm51bWJlciB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJlci53aWR0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBoZWlnaHQoKTpudW1iZXIge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyZXIuaGVpZ2h0O1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIEdhbWVDb25maWcge1xuICAgICAgICBpZD86c3RyaW5nO1xuICAgICAgICB3aWR0aD86bnVtYmVyO1xuICAgICAgICBoZWlnaHQ/Om51bWJlcjtcbiAgICAgICAgdXNlV2ViQXVkaW8/OmJvb2xlYW47XG4gICAgICAgIHVzZVBlcnNpc3RhbnREYXRhPzpib29sZWFuO1xuICAgICAgICBnYW1lU2NhbGVUeXBlPzpudW1iZXI7XG4gICAgICAgIHN0b3BBdExvc3RGb2N1cz86Ym9vbGVhbjtcbiAgICAgICAgYXNzZXRzVXJsPzpzdHJpbmc7XG4gICAgICAgIGxvYWRlckNvbmN1cnJlbmN5PzpudW1iZXI7XG4gICAgICAgIGF1ZGlvQ2hhbm5lbExpbmVzPzpudW1iZXI7XG4gICAgICAgIHNvdW5kQ2hhbm5lbExpbmVzPzpudW1iZXI7XG4gICAgICAgIG11c2ljQ2hhbm5lbExpbmVzPzpudW1iZXI7XG4gICAgfVxufVxuXG5pbnRlcmZhY2UgT2JqZWN0IHtcbiAgICBhc3NpZ24odGFyZ2V0Ok9iamVjdCwgLi4uc291cmNlczpPYmplY3RbXSk6T2JqZWN0O1xufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4vQXVkaW9MaW5lLnRzXCIgLz5cbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL2NvcmUvR2FtZS50c1wiIC8+XG5tb2R1bGUgUElYSSB7XG4gICAgZXhwb3J0IGNsYXNzIEF1ZGlvTWFuYWdlcntcbiAgICAgICAgc291bmRMaW5lczpBdWRpb0xpbmVbXSA9IFtdO1xuICAgICAgICBtdXNpY0xpbmVzOkF1ZGlvTGluZVtdID0gW107XG4gICAgICAgIG5vcm1hbExpbmVzOkF1ZGlvTGluZVtdID0gW107XG4gICAgICAgIHByaXZhdGUgX3RlbXBMaW5lczpBdWRpb0xpbmVbXSA9IFtdO1xuXG4gICAgICAgIG11c2ljTXV0ZWQ6Ym9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBzb3VuZE11dGVkOmJvb2xlYW4gPSBmYWxzZTtcblxuICAgICAgICBjb250ZXh0OkF1ZGlvQ29udGV4dDtcbiAgICAgICAgZ2Fpbk5vZGU6QXVkaW9Ob2RlO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYXVkaW9DaGFubmVsTGluZXM6bnVtYmVyID0gMTAsIHByaXZhdGUgc291bmRDaGFubmVsTGluZXM6bnVtYmVyID0gMTAsIHByaXZhdGUgbXVzaWNDaGFubmVsTGluZXM6bnVtYmVyID0gMSl7XG4gICAgICAgICAgICBpZih1dGlscy5fYXVkaW9UeXBlU2VsZWN0ZWQgPT09IEFVRElPX1RZUEUuV0VCQVVESU8pIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQgPSBEZXZpY2UuZ2xvYmFsV2ViQXVkaW9Db250ZXh0O1xuICAgICAgICAgICAgICAgIHRoaXMuZ2Fpbk5vZGUgPSB0aGlzLmNyZWF0ZUdhaW5Ob2RlKHRoaXMuY29udGV4dCk7XG4gICAgICAgICAgICAgICAgdGhpcy5nYWluTm9kZS5jb25uZWN0KHRoaXMuY29udGV4dC5kZXN0aW5hdGlvbik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBpOm51bWJlcjtcbiAgICAgICAgICAgIGZvcihpID0gMDsgaSA8IHRoaXMuYXVkaW9DaGFubmVsTGluZXM7IGkrKyl7XG4gICAgICAgICAgICAgICAgdGhpcy5ub3JtYWxMaW5lcy5wdXNoKG5ldyBBdWRpb0xpbmUodGhpcykpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCB0aGlzLnNvdW5kQ2hhbm5lbExpbmVzOyBpKyspe1xuICAgICAgICAgICAgICAgIHRoaXMuc291bmRMaW5lcy5wdXNoKG5ldyBBdWRpb0xpbmUodGhpcykpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCB0aGlzLm11c2ljQ2hhbm5lbExpbmVzOyBpKyspe1xuICAgICAgICAgICAgICAgIHRoaXMubXVzaWNMaW5lcy5wdXNoKG5ldyBBdWRpb0xpbmUodGhpcykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZ2V0QXVkaW8oaWQ6c3RyaW5nKTpBdWRpb3tcbiAgICAgICAgICAgIHZhciBhdWRpbzpBdWRpbyA9IHV0aWxzLkF1ZGlvQ2FjaGVbaWRdO1xuICAgICAgICAgICAgYXVkaW8ubWFuYWdlciA9IHRoaXM7XG4gICAgICAgICAgICByZXR1cm4gYXVkaW87XG4gICAgICAgIH1cblxuICAgICAgICBwYXVzZUFsbExpbmVzKCk6QXVkaW9NYW5hZ2VyIHtcbiAgICAgICAgICAgIHRoaXMucGF1c2VNdXNpYygpO1xuICAgICAgICAgICAgdGhpcy5wYXVzZVNvdW5kKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc3VtZUFsbExpbmVzKCk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgdGhpcy5yZXN1bWVNdXNpYygpO1xuICAgICAgICAgICAgdGhpcy5yZXN1bWVTb3VuZCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwbGF5KGlkOnN0cmluZywgbG9vcD86Ym9vbGVhbnxGdW5jdGlvbiwgY2FsbGJhY2s/OkZ1bmN0aW9uKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICBpZih0eXBlb2YgbG9vcCA9PT0gXCJmdW5jdGlvblwiKXtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayA9IDxGdW5jdGlvbj5sb29wO1xuICAgICAgICAgICAgICAgIGxvb3AgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wbGF5KGlkLCB0aGlzLm5vcm1hbExpbmVzLCA8Ym9vbGVhbj5sb29wLCBjYWxsYmFjayk7XG4gICAgICAgIH1cblxuICAgICAgICBwbGF5TXVzaWMoaWQ6c3RyaW5nLCBsb29wPzpib29sZWFufEZ1bmN0aW9uLCBjYWxsYmFjaz86RnVuY3Rpb24pOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIGlmKHR5cGVvZiBsb29wID09PSBcImZ1bmN0aW9uXCIpe1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrID0gPEZ1bmN0aW9uPmxvb3A7XG4gICAgICAgICAgICAgICAgbG9vcCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BsYXkoaWQsIHRoaXMubXVzaWNMaW5lcywgPGJvb2xlYW4+bG9vcCwgY2FsbGJhY2spO1xuICAgICAgICB9XG5cbiAgICAgICAgcGxheVNvdW5kKGlkOnN0cmluZywgbG9vcD86Ym9vbGVhbnxGdW5jdGlvbiwgY2FsbGJhY2s/OkZ1bmN0aW9uKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICBpZih0eXBlb2YgbG9vcCA9PT0gXCJmdW5jdGlvblwiKXtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayA9IDxGdW5jdGlvbj5sb29wO1xuICAgICAgICAgICAgICAgIGxvb3AgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wbGF5KGlkLCB0aGlzLnNvdW5kTGluZXMsIDxib29sZWFuPmxvb3AsIGNhbGxiYWNrKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0b3AoaWQ/OnN0cmluZyk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N0b3AoaWQsIHRoaXMubm9ybWFsTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RvcE11c2ljKGlkPzpzdHJpbmcpOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdG9wKGlkLCB0aGlzLm11c2ljTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RvcFNvdW5kKGlkPzpzdHJpbmcpOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdG9wKGlkLCB0aGlzLnNvdW5kTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcGF1c2UoaWQ/OnN0cmluZyk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BhdXNlKGlkLCB0aGlzLm5vcm1hbExpbmVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBhdXNlTXVzaWMoaWQ/OnN0cmluZyk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BhdXNlKGlkLCB0aGlzLm11c2ljTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcGF1c2VTb3VuZChpZD86c3RyaW5nKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGF1c2UoaWQsIHRoaXMuc291bmRMaW5lcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXN1bWUoaWQ/OnN0cmluZyk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Jlc3VtZShpZCwgdGhpcy5ub3JtYWxMaW5lcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXN1bWVNdXNpYyhpZD86c3RyaW5nKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVzdW1lKGlkLCB0aGlzLm11c2ljTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzdW1lU291bmQoaWQ/OnN0cmluZyk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Jlc3VtZShpZCwgdGhpcy5zb3VuZExpbmVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG11dGUoaWQ/OnN0cmluZyk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX211dGUoaWQsIHRoaXMubm9ybWFsTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgbXV0ZU11c2ljKGlkPzpzdHJpbmcpOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tdXRlKGlkLCB0aGlzLm11c2ljTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgbXV0ZVNvdW5kKGlkPzpzdHJpbmcpOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tdXRlKGlkLCB0aGlzLnNvdW5kTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdW5tdXRlKGlkPzpzdHJpbmcpOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl91bm11dGUoaWQsIHRoaXMubm9ybWFsTGluZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdW5tdXRlTXVzaWMoaWQ/OnN0cmluZyk6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3VubXV0ZShpZCwgdGhpcy5tdXNpY0xpbmVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHVubXV0ZVNvdW5kKGlkPzpzdHJpbmcpOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl91bm11dGUoaWQsIHRoaXMuc291bmRMaW5lcyk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9wYXVzZShpZDpzdHJpbmcsIGxpbmVzOkF1ZGlvTGluZVtdKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICBpZighaWQpe1xuICAgICAgICAgICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBpZighbGluZXNbaV0uYXZhaWxhYmxlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzW2ldLnBhdXNlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGF1ZGlvTGluZXM6QXVkaW9MaW5lW10gPSB0aGlzLl9nZXRMaW5lc0J5SWQoaWQsIGxpbmVzKTtcbiAgICAgICAgICAgIGlmKGF1ZGlvTGluZXMubGVuZ3RoKXtcbiAgICAgICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCBhdWRpb0xpbmVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICAgICAgYXVkaW9MaW5lc1tpXS5wYXVzZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfcmVzdW1lKGlkOnN0cmluZywgbGluZXM6QXVkaW9MaW5lW10pOkF1ZGlvTWFuYWdlcntcbiAgICAgICAgICAgIGlmKCFpZCl7XG4gICAgICAgICAgICAgICAgZm9yKHZhciBpOm51bWJlciA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgICAgIGlmKCFsaW5lc1tpXS5hdmFpbGFibGUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluZXNbaV0ucmVzdW1lKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGF1ZGlvTGluZXM6QXVkaW9MaW5lW10gPSB0aGlzLl9nZXRMaW5lc0J5SWQoaWQsIGxpbmVzKTtcbiAgICAgICAgICAgIGlmKGF1ZGlvTGluZXMubGVuZ3RoKXtcbiAgICAgICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCBhdWRpb0xpbmVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICAgICAgYXVkaW9MaW5lc1tpXS5yZXN1bWUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX3BsYXkoaWQ6c3RyaW5nLCBsaW5lczpBdWRpb0xpbmVbXSwgbG9vcDpib29sZWFuID0gZmFsc2UsIGNhbGxiYWNrPzpGdW5jdGlvbik6QXVkaW9NYW5hZ2Vye1xuICAgICAgICAgICAgdmFyIGxpbmU6QXVkaW9MaW5lID0gdGhpcy5fZ2V0QXZhaWxhYmxlTGluZUZyb20obGluZXMpO1xuICAgICAgICAgICAgaWYoIWxpbmUpe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0F1ZGlvTWFuYWdlcjogQWxsIGxpbmVzIGFyZSBidXN5IScpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgYXVkaW86QXVkaW8gPSB0aGlzLmdldEF1ZGlvKGlkKTtcbiAgICAgICAgICAgIGlmKCFhdWRpbyl7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignQXVkaW8gKCcgKyBpZCArICcpIG5vdCBmb3VuZC4nKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGluZS5zZXRBdWRpbyhhdWRpbywgbG9vcCwgY2FsbGJhY2spLnBsYXkoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfc3RvcChpZDpzdHJpbmcsIGxpbmVzOkF1ZGlvTGluZVtdKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICBpZighaWQpe1xuICAgICAgICAgICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBpZighbGluZXNbaV0uYXZhaWxhYmxlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzW2ldLnN0b3AoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgYXVkaW9MaW5lczpBdWRpb0xpbmVbXSA9IHRoaXMuX2dldExpbmVzQnlJZChpZCwgbGluZXMpO1xuICAgICAgICAgICAgaWYoYXVkaW9MaW5lcy5sZW5ndGgpe1xuICAgICAgICAgICAgICAgIGZvcihpID0gMDsgaSA8IGF1ZGlvTGluZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBhdWRpb0xpbmVzW2ldLnN0b3AoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfbXV0ZShpZDpzdHJpbmcsIGxpbmVzOkF1ZGlvTGluZVtdKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICBpZighaWQpe1xuICAgICAgICAgICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBpZighbGluZXNbaV0uYXZhaWxhYmxlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzW2ldLm11dGUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgYXVkaW9MaW5lczpBdWRpb0xpbmVbXSA9IHRoaXMuX2dldExpbmVzQnlJZChpZCwgbGluZXMpO1xuICAgICAgICAgICAgaWYoYXVkaW9MaW5lcy5sZW5ndGgpe1xuICAgICAgICAgICAgICAgIGZvcihpID0gMDsgaSA8IGF1ZGlvTGluZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBhdWRpb0xpbmVzW2ldLm11dGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX3VubXV0ZShpZDpzdHJpbmcsIGxpbmVzOkF1ZGlvTGluZVtdKTpBdWRpb01hbmFnZXJ7XG4gICAgICAgICAgICBpZighaWQpe1xuICAgICAgICAgICAgICAgIGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBpZighbGluZXNbaV0uYXZhaWxhYmxlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzW2ldLnVubXV0ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBhdWRpb0xpbmVzOkF1ZGlvTGluZVtdID0gdGhpcy5fZ2V0TGluZXNCeUlkKGlkLCBsaW5lcyk7XG4gICAgICAgICAgICBpZihhdWRpb0xpbmVzLmxlbmd0aCl7XG4gICAgICAgICAgICAgICAgZm9yKGkgPSAwOyBpIDwgYXVkaW9MaW5lcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgICAgIGF1ZGlvTGluZXNbaV0udW5tdXRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9nZXRMaW5lc0J5SWQoaWQ6c3RyaW5nLCBsaW5lczpBdWRpb0xpbmVbXSk6QXVkaW9MaW5lW10ge1xuICAgICAgICAgICAgdGhpcy5fdGVtcExpbmVzLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICBmb3IodmFyIGk6bnVtYmVyID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICBpZighbGluZXNbaV0uYXZhaWxhYmxlKXtcbiAgICAgICAgICAgICAgICAgICAgaWYobGluZXNbaV0uYXVkaW8uaWQgPT09IGlkKXRoaXMuX3RlbXBMaW5lcy5wdXNoKGxpbmVzW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90ZW1wTGluZXM7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9nZXRBdmFpbGFibGVMaW5lRnJvbShsaW5lczpBdWRpb0xpbmVbXSk6QXVkaW9MaW5le1xuICAgICAgICAgICAgdmFyIGw6QXVkaW9MaW5lO1xuICAgICAgICAgICAgZm9yKHZhciBpOm51bWJlciA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgaWYobGluZXNbaV0uYXZhaWxhYmxlKXtcbiAgICAgICAgICAgICAgICAgICAgbCA9IGxpbmVzW2ldO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNyZWF0ZUdhaW5Ob2RlKGN0eDpBdWRpb0NvbnRleHQpOkdhaW5Ob2Rle1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5jcmVhdGVHYWluID8gY3R4LmNyZWF0ZUdhaW4oKSA6IGN0eC5jcmVhdGVHYWluTm9kZSgpO1xuICAgICAgICB9XG5cbiAgICB9XG59XG5cbmludGVyZmFjZSBBdWRpb0NvbnRleHQge1xuICAgIGNyZWF0ZUdhaW5Ob2RlKCk6YW55O1xufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4vQXVkaW9NYW5hZ2VyLnRzXCIgLz5cbm1vZHVsZSBQSVhJIHtcbiAgICBleHBvcnQgY2xhc3MgQXVkaW8ge1xuICAgICAgICBsb29wOmJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgcHJpdmF0ZSBfdm9sdW1lOm51bWJlciA9IDE7XG4gICAgICAgIG11dGVkOmJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgbWFuYWdlcjpBdWRpb01hbmFnZXI7XG5cbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIHNvdXJjZTphbnksIHB1YmxpYyBpZDpzdHJpbmcpe31cblxuICAgICAgICBwbGF5KGxvb3A/OmJvb2xlYW58RnVuY3Rpb24sIGNhbGxiYWNrPzpGdW5jdGlvbik6QXVkaW97XG4gICAgICAgICAgICBpZighdGhpcy5tYW5hZ2VyKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdUaGlzIGF1ZGlvIG5lZWQgYSBtYW5hZ2VyLicpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZih0eXBlb2YgbG9vcCA9PT0gXCJmdW5jdGlvblwiKXtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayA9IDxGdW5jdGlvbj5sb29wO1xuICAgICAgICAgICAgICAgIGxvb3AgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLnBsYXkodGhpcy5pZCwgbG9vcCwgY2FsbGJhY2spO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBzdG9wKCk6QXVkaW8ge1xuICAgICAgICAgICAgaWYoIXRoaXMubWFuYWdlcil7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignVGhpcyBhdWRpbyBuZWVkIGEgbWFuYWdlci4nKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLnN0b3AodGhpcy5pZCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIG11dGUoKTpBdWRpbyB7XG4gICAgICAgICAgICBpZighdGhpcy5tYW5hZ2VyKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdUaGlzIGF1ZGlvIG5lZWQgYSBtYW5hZ2VyLicpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLm11dGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5tdXRlKHRoaXMuaWQpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICB1bm11dGUoKTpBdWRpbyB7XG4gICAgICAgICAgICBpZighdGhpcy5tYW5hZ2VyKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdUaGlzIGF1ZGlvIG5lZWQgYSBtYW5hZ2VyLicpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLm11dGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLm1hbmFnZXIudW5tdXRlKHRoaXMuaWQpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwYXVzZSgpOkF1ZGlvIHtcbiAgICAgICAgICAgIGlmKCF0aGlzLm1hbmFnZXIpe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1RoaXMgYXVkaW8gbmVlZCBhIG1hbmFnZXIuJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5wYXVzZSh0aGlzLmlkKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzdW1lKCk6QXVkaW8ge1xuICAgICAgICAgICAgaWYoIXRoaXMubWFuYWdlcil7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignVGhpcyBhdWRpbyBuZWVkIGEgbWFuYWdlci4nKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLnJlc3VtZSh0aGlzLmlkKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHZvbHVtZSgpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ZvbHVtZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldCB2b2x1bWUodmFsdWU6bnVtYmVyKXtcbiAgICAgICAgICAgIHRoaXMuX3ZvbHVtZSA9IHZhbHVlO1xuXG4gICAgICAgICAgICBpZih0aGlzLm1hbmFnZXIpe1xuICAgICAgICAgICAgICAgIC8vVE9ETzogdXBkYXRlIHRoZSB2b2x1bWUgb24gdGhlIGZseVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2RlZnMvcGl4aS5qcy5kLnRzXCIgLz5cblxubW9kdWxlIFBJWEkge1xuICAgIENvbnRhaW5lci5fa2lsbGVkT2JqZWN0cyA9IFtdO1xuXG4gICAgQ29udGFpbmVyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihkZWx0YVRpbWU6IG51bWJlcikge1xuICAgICAgICB0aGlzLnBvc2l0aW9uLnggKz0gdGhpcy52ZWxvY2l0eS54ICogZGVsdGFUaW1lO1xuICAgICAgICB0aGlzLnBvc2l0aW9uLnkgKz0gdGhpcy52ZWxvY2l0eS55ICogZGVsdGFUaW1lO1xuICAgICAgICB0aGlzLnJvdGF0aW9uICs9IHRoaXMucm90YXRpb25TcGVlZCAqIGRlbHRhVGltZTtcblxuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuW2ldLnVwZGF0ZShkZWx0YVRpbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIENvbnRhaW5lci5wcm90b3R5cGUuYWRkVG8gPSBmdW5jdGlvbihwYXJlbnQpe1xuICAgICAgICBwYXJlbnQuYWRkQ2hpbGQodGhpcyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBDb250YWluZXIucHJvdG90eXBlLmtpbGwgPSBmdW5jdGlvbigpe1xuICAgICAgICBQSVhJLkNvbnRhaW5lci5fa2lsbGVkT2JqZWN0cy5wdXNoKHRoaXMpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgQ29udGFpbmVyLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbigpe1xuICAgICAgICBpZih0aGlzLnBhcmVudCl7XG4gICAgICAgICAgICB0aGlzLnBhcmVudC5yZW1vdmVDaGlsZCh0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9kZWZzL3BpeGkuanMuZC50c1wiIC8+XG5cbm1vZHVsZSBQSVhJIHtcbiAgICBEaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5zcGVlZCA9IDA7XG4gICAgRGlzcGxheU9iamVjdC5wcm90b3R5cGUudmVsb2NpdHkgPSBuZXcgUG9pbnQoKTtcbiAgICBEaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5kaXJlY3Rpb24gPSAwO1xuICAgIERpc3BsYXlPYmplY3QucHJvdG90eXBlLnJvdGF0aW9uU3BlZWQgPSAwO1xuXG4gICAgRGlzcGxheU9iamVjdC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oZGVsdGFUaW1lOm51bWJlcil7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
//Many checks are based on https://github.com/arasatasaygin/is.js/blob/master/is.js

module PIXI {
    export module Device {
        var navigator:Navigator = window.navigator;
        var document:Document = window.document;

        var userAgent:string = 'navigator' in window && 'userAgent' in navigator && navigator.userAgent.toLowerCase() || '',
            vendor:string = 'navigator' in window && 'vendor' in navigator && navigator.vendor.toLowerCase() || '',
            appVersion:string = 'navigator' in window && 'appVersion' in navigator && navigator.appVersion.toLowerCase() || '';

        //Browsers
        export var isChrome:boolean = /chrome|chromium/i.test(userAgent) && /google inc/.test(vendor),
            isFirefox:boolean = /firefox/i.test(userAgent),
            isIE:boolean = /msie/i.test(userAgent) || "ActiveXObject" in window,
            isOpera:boolean = /^Opera\//.test(userAgent) || /\x20OPR\//.test(userAgent),
            isSafari:boolean = /safari/i.test(userAgent) && /apple computer/i.test(vendor);

        //Devices && OS
        export var isIphone:boolean = /iphone/i.test(userAgent),
            isIpad:boolean = /ipad/i.test(userAgent),
            isIpod:boolean = /ipod/i.test(userAgent),
            isAndroid:boolean = /android/i.test(userAgent),
            isAndroidPhone:boolean = /android/i.test(userAgent) && /mobile/i.test(userAgent),
            isAndroidTablet:boolean = /android/i.test(userAgent) && !/mobile/i.test(userAgent),
            isLinux:boolean = /linux/i.test(appVersion),
            isMac:boolean = /mac/i.test(appVersion),
            isWindow:boolean = /win/i.test(appVersion),
            isWindowPhone:boolean = isWindow && /phone/i.test(userAgent),
            isWindowTablet:boolean = isWindow && !isWindowPhone && /touch/i.test(userAgent),
            isMobile:boolean = isIphone || isIpod|| isAndroidPhone || isWindowPhone,
            isTablet:boolean = isIpad || isAndroidTablet || isWindowTablet,
            isDesktop:boolean = !isMobile && !isTablet,
            isTouchDevice:boolean = 'ontouchstart' in window ||'DocumentTouch' in window && document instanceof DocumentTouch,
            isCocoon:boolean = !!navigator.isCocoonJS,
            isNodeWebkit:boolean = !!(typeof process === "object" && process.title === "node" && typeof global === "object"),
            isEjecta:boolean = !!window.ejecta,
            isCrosswalk:boolean = /Crosswalk/.test(userAgent),
            isCordova:boolean = !!window.cordova,
            isElectron:boolean = !!(typeof process === "object" && process.versions && (process.versions.electron || process.versions['atom-shell']));

        export var isVibrateSupported:boolean = !!navigator.vibrate && (isMobile || isTablet),
            isMouseWheelSupported:boolean = 'onwheel' in window || 'onmousewheel' in window || 'MouseScrollEvent' in window,
            isAccelerometerSupported:boolean = 'DeviceMotionEvent' in window,
            isGamepadSupported:boolean = !!navigator.getGamepads || !!navigator.webkitGetGamepads;

        //FullScreen
        var div:HTMLDivElement = document.createElement('div');
        var fullScreenRequestVendor:any = div.requestFullscreen || div.webkitRequestFullScreen || div.msRequestFullScreen || div.mozRequestFullScreen,
            fullScreenCancelVendor:any = document.cancelFullScreen || document.exitFullScreen || document.webkitCancelFullScreen || document.msCancelFullScreen || document.mozCancelFullScreen;

        export var isFullScreenSupported:boolean = !!(fullScreenRequest && fullScreenCancel),
            fullScreenRequest:string = (fullScreenRequestVendor) ? fullScreenRequestVendor.name : undefined,
            fullScreenCancel:string = (fullScreenCancelVendor) ? fullScreenCancelVendor.name : undefined;

        //Audio
        export var isHTMLAudioSupported:boolean = !!window.Audio,
            webAudioContext:any = window.AudioContext || window.webkitAudioContext,
            isWebAudioSupported:boolean = !!webAudioContext,
            isAudioSupported:boolean = isWebAudioSupported || isHTMLAudioSupported,
            isMp3Supported:boolean = false,
            isOggSupported:boolean = false,
            isWavSupported:boolean = false,
            isM4aSupported:boolean = false,
            globalWebAudioContext:AudioContext = (isWebAudioSupported) ? new webAudioContext() : undefined;

        //Audio mimeTypes
        if(isAudioSupported){
            var audio:HTMLAudioElement = document.createElement('audio');
            isMp3Supported = audio.canPlayType('audio/mpeg;') !== "";
            isOggSupported = audio.canPlayType('audio/ogg; codecs="vorbis"') !== "";
            isWavSupported = audio.canPlayType('audio/wav') !== "";
            isM4aSupported = audio.canPlayType('audio/mp4; codecs="mp4a.40.5"') !== "";
        }

        export function getMouseWheelEvent():string{
            if(!isMouseWheelSupported)return;
            var evt:string;
            if('onwheel' in window){
                evt = 'wheel';
            }else if('onmousewheel' in window){
                evt = 'mousewheel';
            }else if('MouseScrollEvent' in window){
                evt = 'DOMMouseScroll';
            }

            return evt;
        }

        export function vibrate(pattern: number | number[]):void{
            if(isVibrateSupported){
                navigator.vibrate(pattern);
            }
        }

        export function getVisibilityChangeEvent():string{
            if(typeof document.hidden !== 'undefined'){
                return 'visibilitychange';
            }else if(typeof document.webkitHidden !== 'undefined'){
                return 'webkitvisibilitychange';
            }else if(typeof document.mozHidden !== 'undefined'){
                return 'mozvisibilitychange';
            }else if(typeof document.msHidden !== 'undefined'){
                return 'msvisibilitychange';
            }
        }

        export function isOnline():boolean{
            return window.navigator.onLine;
        }


    }
}

declare var process:any,
    DocumentTouch:any,
    global:any;

interface Navigator {
    isCocoonJS:any;
    vibrate(pattern: number | number[]):boolean;
    getGamepads():any;
    webkitGetGamepads():any;
}

interface Window {
    ejecta:any;
    cordova:any;
    Audio():HTMLAudioElement;
    AudioContext():any;
    webkitAudioContext():any;
}

interface fullScreenData {
    name:string;
}

interface Document {
    cancelFullScreen():fullScreenData ;
    exitFullScreen():fullScreenData ;
    webkitCancelFullScreen():fullScreenData ;
    msCancelFullScreen():fullScreenData ;
    mozCancelFullScreen():fullScreenData ;
    webkitHidden:any;
    mozHidden:any;
}

interface HTMLDivElement {
    requestFullscreen():fullScreenData ;
    webkitRequestFullScreen():fullScreenData ;
    msRequestFullScreen():fullScreenData ;
    mozRequestFullScreen():fullScreenData ;
}
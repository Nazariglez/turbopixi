module PIXI {
    //Many checks are based on https://github.com/arasatasaygin/is.js/blob/master/is.js
    var userAgent:string = 'navigator' in window && 'userAgent' in navigator && navigator.userAgent.toLowerCase() || '',
        vendor:string = 'navigator' in window && 'vendor' in navigator && navigator.vendor.toLowerCase() || '',
        appVersion:string = 'navigator' in window && 'appVersion' in navigator && navigator.appVersion.toLowerCase() || '';

    //Browsers
    var isChrome:boolean = /chrome|chromium/i.test(userAgent) && /google inc/.test(vendor),
        isFirefox:boolean = /firefox/i.test(userAgent),
        isIE:boolean = /msie/i.test(userAgent) || "ActiveXObject" in window,
        isOpera:boolean = /^Opera\//.test(userAgent) || /\x20OPR\//.test(userAgent),
        isSafari:boolean = /safari/i.test(userAgent) && /apple computer/i.test(vendor);

    //Devices && OS
    var isIphone:boolean = /iphone/i.test(userAgent),
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

    var hasVibrate:boolean = !!navigator.vibrate && (isMobile || isTablet),
        hasMouseWheel:boolean = 'onwheel' in window || 'onmousewheel' in window || 'MouseScrollEvent' in window,
        hasAccelerometer:boolean = 'DeviceMotionEvent' in window,
        hasGamepad:boolean = !!navigator.getGamepads || !!navigator.webkitGetGamepads;

    //FullScreen
    var div:HTMLDivElement = document.createElement('div');
    var fullScreenRequest:any = div.requestFullscreen || div.webkitRequestFullScreen || div.msRequestFullScreen || div.mozRequestFullScreen,
        fullScreenCancel:any = document.cancelFullScreen || document.exitFullScreen || document.webkitCancelFullScreen || document.msCancelFullScreen || document.mozCancelFullScreen,
        hasFullScreen:boolean = !!(fullScreenRequest && fullScreenCancel);

    //Audio
    var hasHTMLAudio:boolean = !!window.Audio,
        webAudioContext:any = window.AudioContext || window.webkitAudioContext,
        hasWebAudio:boolean = !!webAudioContext,
        hasAudio:boolean = hasWebAudio || hasHTMLAudio,
        hasMp3:boolean = false,
        hasOgg:boolean = false,
        hasWav:boolean = false,
        hasM4a:boolean = false;

    //Audio mimeTypes
    if(hasAudio){
        var audio:HTMLAudioElement = document.createElement('audio');
        hasMp3 = audio.canPlayType('audio/mpeg;') !== "";
        hasOgg = audio.canPlayType('audio/ogg; codecs="vorbis"') !== "";
        hasWav = audio.canPlayType('audio/wav') !== "";
        hasM4a = audio.canPlayType('audio/mp4; codecs="mp4a.40.5"') !== "";
    }

    export var Device : DeviceData = {
        isChrome : isChrome,
        isFirefox : isFirefox,
        isIE : isIE,
        isOpera : isOpera,
        isSafari : isSafari,
        isIphone : isIphone,
        isIpad : isIpad,
        isIpod : isIpod,
        isAndroid : isAndroid,
        isAndroidPhone : isAndroidPhone,
        isAndroidTablet : isAndroidTablet,
        isLinux : isLinux,
        isMac : isMac,
        isWindow : isWindow,
        isWindowPhone : isWindowPhone,
        isWindowTablet : isWindowTablet,
        isMobile : isMobile,
        isTablet : isTablet,
        isDesktop : isDesktop,
        isTouchDevice : isTouchDevice,
        isCocoon : isCocoon,
        isNodeWebkit : isNodeWebkit,
        isEjecta : isEjecta,
        isCordova : isCordova,
        isCrosswalk : isCrosswalk,
        isElectron : isElectron,
        isAtomShell : isElectron, //TODO: Remove soon, when atom-shell (version) is deprecated

        //isOnline : navigator.onLine,
        hasVibrate : hasVibrate,
        hasMouseWheel : hasMouseWheel,
        hasFullScreen : hasFullScreen,
        hasAccelerometer : hasAccelerometer,
        hasGamepad : hasGamepad,

        fullScreenRequest : fullScreenRequest ? fullScreenRequest.name : undefined,
        fullScreenCancel : fullScreenCancel ? fullScreenCancel.name : undefined,

        hasAudio : hasAudio,
        hasHTMLAudio : hasHTMLAudio,
        hasWebAudio: hasWebAudio,
        webAudioContext : webAudioContext,

        hasMp3 : hasMp3,
        hasM4a : hasM4a,
        hasOgg : hasOgg,
        hasWav : hasWav,

        getMouseWheelEvent : function() {
            if(!hasMouseWheel)return;
            var evt:string;
            if('onwheel' in window){
                evt = 'wheel';
            }else if('onmousewheel' in window){
                evt = 'mousewheel';
            }else if('MouseScrollEvent' in window){
                evt = 'DOMMouseScroll';
            }

            return evt;
        },

        vibrate : function(value:number){
            if(hasVibrate){
                navigator.vibrate(value);
            }
        },

        get isOnline() {
            return window.navigator.onLine;
        }
    };

}

declare var process:any,
    DocumentTouch:any,
    global:any;

interface Navigator {
    isCocoonJS:any;
    vibrate(value:Number):boolean;
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
}

interface HTMLDivElement {
    requestFullscreen():fullScreenData ;
    webkitRequestFullScreen():fullScreenData ;
    msRequestFullScreen():fullScreenData ;
    mozRequestFullScreen():fullScreenData ;
}

interface DeviceData {
    isChrome : boolean;
    isFirefox : boolean;
    isIE : boolean;
    isOpera : boolean;
    isSafari : boolean;
    isIphone : boolean;
    isIpad : boolean;
    isIpod : boolean;
    isAndroid : boolean;
    isAndroidPhone : boolean;
    isAndroidTablet : boolean;
    isLinux : boolean;
    isMac : boolean;
    isWindow : boolean;
    isWindowPhone : boolean;
    isWindowTablet : boolean;
    isMobile : boolean;
    isTablet : boolean;
    isDesktop : boolean;
    isTouchDevice : boolean;
    isCocoon : boolean;
    isNodeWebkit : boolean;
    isEjecta : boolean;
    isCordova : boolean;
    isCrosswalk : boolean;
    isElectron : boolean;
    isAtomShell : boolean;

    hasVibrate : boolean;
    hasMouseWheel : boolean;
    hasFullScreen : boolean;
    hasAccelerometer : boolean;
    hasGamepad : boolean;

    fullScreenRequest:fullScreenData;
    fullScreenCancel:fullScreenData;

    hasAudio : boolean;
    hasHTMLAudio : boolean;
    hasWebAudio : boolean;
    webAudioContext:any;

    hasMp3 : boolean;
    hasM4a : boolean;
    hasOgg : boolean;
    hasWav : boolean;

    isOnline:boolean;

    getMouseWheelEvent():string;

    vibrate(value:number):void;
}
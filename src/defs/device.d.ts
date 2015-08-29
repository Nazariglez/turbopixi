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

declare const PIXI_VERSION_REQUIRED: string;
declare const PIXI_VERSION: string;
declare module PIXI {
    enum GAME_SCALE_TYPE {
        NONE = 0,
        FILL = 1,
        ASPECT_FIT = 2,
        ASPECT_FILL = 3,
    }
    enum AUDIO_TYPE {
        UNKNOWN = 0,
        WEBAUDIO = 1,
        HTMLAUDIO = 2,
    }
}

declare module PIXI {
    class AudioManager {
        game: Game;
        constructor(game: Game);
    }
}


declare module PIXI {
}


declare module PIXI {
}


declare module PIXI {
    class Scene extends Container {
        id: string;
        static _idLen: number;
        constructor(id?: string);
        addTo(game: Game | Container): Scene;
    }
}

declare module PIXI {
    class DataManager {
        game: Game;
        usePersistantData: boolean;
        private _data;
        constructor(game: Game, usePersitantData?: boolean);
        load(): DataManager;
        save(): DataManager;
        reset(): DataManager;
        set(key: string | Object, value?: any): DataManager;
        get(key?: string): any;
        del(key: string): DataManager;
    }
}


declare module PIXI {
    var Device: DeviceData;
    interface DeviceData {
        isChrome: boolean;
        isFirefox: boolean;
        isIE: boolean;
        isOpera: boolean;
        isSafari: boolean;
        isIphone: boolean;
        isIpad: boolean;
        isIpod: boolean;
        isAndroid: boolean;
        isAndroidPhone: boolean;
        isAndroidTablet: boolean;
        isLinux: boolean;
        isMac: boolean;
        isWindow: boolean;
        isWindowPhone: boolean;
        isWindowTablet: boolean;
        isMobile: boolean;
        isTablet: boolean;
        isDesktop: boolean;
        isTouchDevice: boolean;
        isCocoon: boolean;
        isNodeWebkit: boolean;
        isEjecta: boolean;
        isCordova: boolean;
        isCrosswalk: boolean;
        isElectron: boolean;
        isAtomShell: boolean;
        hasVibrate: boolean;
        hasMouseWheel: boolean;
        hasFullScreen: boolean;
        hasAccelerometer: boolean;
        hasGamepad: boolean;
        fullScreenRequest: fullScreenData;
        fullScreenCancel: fullScreenData;
        hasAudio: boolean;
        hasHTMLAudio: boolean;
        hasWebAudio: boolean;
        webAudioContext: any;
        hasMp3: boolean;
        hasM4a: boolean;
        hasOgg: boolean;
        hasWav: boolean;
        isOnline: boolean;
        getMouseWheelEvent(): string;
        vibrate(value: number): void;
    }
}
declare var process: any, DocumentTouch: any, global: any;
interface Navigator {
    isCocoonJS: any;
    vibrate(pattern: number | number[]): boolean;
    getGamepads(): any;
    webkitGetGamepads(): any;
}
interface Window {
    ejecta: any;
    cordova: any;
    Audio(): HTMLAudioElement;
    AudioContext(): any;
    webkitAudioContext(): any;
}
interface fullScreenData {
    name: string;
}
interface Document {
    cancelFullScreen(): fullScreenData;
    exitFullScreen(): fullScreenData;
    webkitCancelFullScreen(): fullScreenData;
    msCancelFullScreen(): fullScreenData;
    mozCancelFullScreen(): fullScreenData;
}
interface HTMLDivElement {
    requestFullscreen(): fullScreenData;
    webkitRequestFullScreen(): fullScreenData;
    msRequestFullScreen(): fullScreenData;
    mozRequestFullScreen(): fullScreenData;
}

declare module PIXI {
    class InputManager {
        game: Game;
        constructor(game: Game);
    }
}







declare module PIXI {
    class Game {
        id: string;
        raf: any;
        private _scenes;
        scene: Scene;
        audio: AudioManager;
        input: InputManager;
        data: DataManager;
        renderer: WebGLRenderer | CanvasRenderer;
        canvas: HTMLCanvasElement;
        delta: number;
        time: number;
        lastTime: number;
        isWebGL: boolean;
        isWebAudio: boolean;
        private _resizeListener;
        constructor(config?: GameConfig, rendererOptions?: RendererOptions);
        private _animate();
        update(deltaTime: number): Game;
        start(): Game;
        stop(): Game;
        setScene(scene: Scene | string): Game;
        getScene(id: string): Scene;
        addScene(scene: Scene): Game;
        resize(width: number, height: number, renderer?: boolean): Game;
        autoResize(mode: number): Game;
        private _resizeModeAspectFit();
        private _resizeModeAspectFill();
        private _resizeModeFill();
        width: number;
        height: number;
    }
    interface GameConfig {
        id?: string;
        width?: number;
        height?: number;
        useWebAudio?: boolean;
        usePersistantData?: boolean;
        gameScaleType?: number;
    }
}
interface Object {
    assign(target: Object, ...sources: Object[]): Object;
}

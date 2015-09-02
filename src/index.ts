///<reference path="../defs/pixi.js.d.ts" />
if(!PIXI){
    throw new Error('Ey! Where is pixi.js??');
}

const PIXI_VERSION_REQUIRED = "3.0.7";
const PIXI_VERSION = PIXI.VERSION.match(/\d.\d.\d/)[0];

if(PIXI_VERSION < PIXI_VERSION_REQUIRED){
    throw new Error("Pixi.js v" + PIXI.VERSION + " it's not supported, please use ^" + PIXI_VERSION_REQUIRED);
}

module PIXI {
    export enum GAME_SCALE_TYPE {
        NONE,
        FILL,
        ASPECT_FIT,
        ASPECT_FILL
    }

    export enum AUDIO_TYPE {
        UNKNOWN,
        WEBAUDIO,
        HTMLAUDIO
    }
}

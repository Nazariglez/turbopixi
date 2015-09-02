///<reference path="../defs/pixi.js.d.ts" />
if(!PIXI){
    throw new Error('Ey! Where is pixi.js??');
}

const PIXI_VERSION_REQUIRED = "3.0.7";

if(getVersion(PIXI.VERSION) < PIXI_VERSION_REQUIRED){
    throw new Error("Pixi.js v" + PIXI.VERSION + " it's not supported, please use ^" + PIXI_VERSION_REQUIRED);
}

function getVersion(stringVersion:string):string {
   return stringVersion.match(/\d.\d.\d/)[0];
}

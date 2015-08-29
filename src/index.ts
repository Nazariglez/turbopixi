///<reference path="./defs/pixi.js.d.ts" />
if(typeof PIXI === "undefined"){
    throw new Error('Not found pixi.js...');
}

import injections = require('./injections');
injections();

import Game = require('./core/Game');
import Device = require('./core/Device');

var TurboPixi = {
    Device: Device,
    Game: Game
};

//Add new classes in pixi.js
for(var c in TurboPixi){
    PIXI[c] = TurboPixi[c];
}

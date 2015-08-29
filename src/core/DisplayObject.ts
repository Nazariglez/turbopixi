///<reference path="../defs/pixi.js.d.ts" />

export = function inject(){
    PIXI.DisplayObject.prototype.speed = 0;
    PIXI.DisplayObject.prototype.velocity = new PIXI.Point();
    PIXI.DisplayObject.prototype.direction = 0;
    PIXI.DisplayObject.prototype.rotationSpeed = 0;

    PIXI.DisplayObject.prototype.update = function(deltaTime:number){
        return this;
    };
}
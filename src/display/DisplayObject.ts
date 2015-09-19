///<reference path="../../defs/pixi.js.d.ts" />

module PIXI {
    DisplayObject.prototype.speed = 0;
    DisplayObject.prototype.velocity = new Point();
    DisplayObject.prototype.direction = 0;
    DisplayObject.prototype.rotationSpeed = 0;

    DisplayObject.prototype.update = function(deltaTime:number):DisplayObject{
        return this;
    };
}

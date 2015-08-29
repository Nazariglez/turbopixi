///<reference path="../defs/pixi.d.ts" />

export = function inject(){
    PIXI.DisplayObject.prototype.speed = 0;
    PIXI.DisplayObject.prototype.velocity = new PIXI.Point();
    PIXI.DisplayObject.prototype.direction = 0;
    PIXI.DisplayObject.prototype.rotationSpeed = 0;

    PIXI.DisplayObject.prototype.update = function(deltaTime: number) {
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;
        this.rotation += this.rotationSpeed * deltaTime;
    };

    PIXI.DisplayObject.prototype.addTo = function(parent){
        parent.addChild(this);
        return this;
    }
}
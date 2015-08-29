///<reference path="../defs/pixi.d.ts" />

export = function inject(){

    PIXI.DisplayObject.prototype.update = function(deltaTime: number) {
        PIXI.DisplayObject.prototype.update.call(this, deltaTime);

        for(var i = 0; i < this.children.length; i++){
            this.children[i].update(deltaTime);
        }
    };

}
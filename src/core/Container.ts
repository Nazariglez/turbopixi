///<reference path="../defs/pixi.js.d.ts" />

export = function inject(){

    PIXI.Container.prototype.update = function(deltaTime: number) {
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;
        this.rotation += this.rotationSpeed * deltaTime;

        for(var i = 0; i < this.children.length; i++){
            this.children[i].update(deltaTime);
        }

        return this;
    };

    PIXI.Container.prototype.addTo = function(parent){
        parent.addChild(this);
        return this;
    }

}
///<reference path="../../defs/pixi.js.d.ts" />

module PIXI {
    Container._killedObjects = [];

    Container.prototype.update = function(deltaTime: number) {
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;
        this.rotation += this.rotationSpeed * deltaTime;

        for(var i = 0; i < this.children.length; i++){
            this.children[i].update(deltaTime);
        }

        return this;
    };

    Container.prototype.addTo = function(parent){
        parent.addChild(this);
        return this;
    };

    Container.prototype.kill = function(){
        PIXI.Container._killedObjects.push(this);
        return this;
    };

    Container.prototype.remove = function(){
        if(this.parent){
            this.parent.removeChild(this);
        }
        return this;
    }

}
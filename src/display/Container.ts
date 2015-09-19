///<reference path="../../defs/pixi.js.d.ts" />
///<reference path="../core/const.ts" />
///<reference path="../tween/Tween.ts" />
module PIXI {
    Container._killedObjects = [];

    Container.prototype._zIndex = 0;
    Container.prototype.zDirty = false;

    Container.prototype.update = function(deltaTime: number):Container {
        if(this.zDirty){
            this.zDirty = false;
            this.sortChildrenByZIndex();
        }

        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;
        this.rotation += this.rotationSpeed * deltaTime;

        for(var i = 0; i < this.children.length; i++){
            this.children[i].update(deltaTime);
        }

        return this;
    };

    var _addChild:Function = Container.prototype.addChild;
    Container.prototype.addChild = function(child:DisplayObject):DisplayObject{
        _addChild.call(this, child);
        if(zIndexEnabled)this.zDirty = true;
        return child;
    };

    Container.prototype.addTo = function(parent):Container{
        parent.addChild(this);
        return this;
    };

    Container.prototype.kill = function():Container{
        PIXI.Container._killedObjects.push(this);
        return this;
    };

    Container.prototype.remove = function(){
        if(this.parent){
            this.parent.removeChild(this);
        }
        return this;
    };

    Container.prototype.sortChildrenByZIndex = function():Container {
        this.children.sort(function(a:Container, b:Container){
            var aZ = a.zIndex,
                bZ = b.zIndex;

            return aZ - bZ;
        });
        return this;
    };

    Container.prototype.tween = function(manager?:TweenManager):Tween{
        return new Tween(this);
    };

    Object.defineProperty(Container.prototype, 'zIndex', {
        get: function():number{
            return this._zIndex;
        },

        set: function(value:number){
            this._zIndex = value;
            if(zIndexEnabled&&this.parent)this.parent.zDirty = true;
        }

    });

}
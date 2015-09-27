///<reference path="../../defs/pixi.js.d.ts" />

module PIXI {
    extras.TilingSprite.prototype.tileVelocity = new Point();
    extras.TilingSprite.prototype.tileSpeed = 0;
    extras.TilingSprite.prototype.tileDirection = 0;

    extras.TilingSprite.prototype.update = function(deltaTime:number):extras.TilingSprite{
        this.tilePosition.x += this.tileVel.x * deltaTime;
        this.tilePosition.y += this.tileVel.y * deltaTime;

        Container.prototype.update.call(this, deltaTime);
        return this;
    }

}
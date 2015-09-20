///<reference path="../../defs/pixi.js.d.ts" />
///<reference path="../tween/Path.ts" />
module PIXI {
    Graphics.prototype.drawPath = function(path:Path):Graphics{
        path.parsePoints();
        this.drawShape(path.polygon);
        return this;
    };
}
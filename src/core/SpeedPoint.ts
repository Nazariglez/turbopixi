///<refeence path="../../defs/pixi.js.d.ts" />
module PIXI {
    export class SpeedPoint extends Point {
        private _x:number;
        private _y:number;

        constructor(x?:number, y?:number ,private _callback?:Function){
            super(x,y);
        }

        set x(value){
            if(value === this._x)return;
            this._x = value;

            if(this._callback)this._callback();
        }

        get x():number{
            return this._x;
        }

        set y(value){
            if(value === this._y)return;
            this._y = value;

            if(this._callback)this._callback();
        }

        get y():number{
            return this._y;
        }
    }
}
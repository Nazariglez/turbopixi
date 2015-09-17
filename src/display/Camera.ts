///<reference path="../../defs/pixi.js.d.ts" />
module PIXI {
    export class Camera extends Container {
        visible:boolean = false;
        _enabled:boolean = false;
        zIndex:number = Infinity;
        constructor(){
            super();
        }

        update(deltaTime:number):Camera{
            if(!this.enabled){
                return this;
            }

            super.update(deltaTime);
            return this;
        }

        get enabled():boolean{
            return this._enabled;
        }

        set enabled(value:boolean){
            this._enabled = value;
            this.visible = value;
        }
    }
}
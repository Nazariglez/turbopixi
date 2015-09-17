///<reference path="../../defs/pixi.js.d.ts" />
module PIXI {
    export class Camera extends Container {
        enabled:boolean = false;
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
    }
}
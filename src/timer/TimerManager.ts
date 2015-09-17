///<reference path="../../defs/pixi.js.d.ts" />
///<reference path="./Timer.ts" />
module PIXI {
    export class TimerManager {
        timers:Timer[] = [];
        _toDelete:Timer[] = [];

        constructor(){}

        update(gameTime:number):TimerManager{
            for(var i:number = 0; i < this.timers.length; i++){
                if(this.timers[i].active){

                }
            }

            return this;
        }
    }
}
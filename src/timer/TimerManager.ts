///<reference path="../../defs/pixi.js.d.ts" />
///<reference path="./Timer.ts" />
module PIXI {
    export class TimerManager {
        timers:Timer[] = [];
        _toDelete:Timer[] = [];

        constructor(){}

        update(deltaTime:number):TimerManager{
            for(var i:number = 0; i < this.timers.length; i++){
                if(this.timers[i].active){
                    this.timers[i].update(deltaTime);
                    if(this.timers[i].isEnded && this.timers[i].expire){
                        this.timers[i].remove();
                    }
                }
            }

            if(this._toDelete.length){
                for(i = 0; i < this._toDelete.length; i++){
                    this._remove(this._toDelete[i]);
                }

                this._toDelete.length = 0;
            }

            return this;
        }

        removeTimer(timer:Timer):TimerManager{
            this._toDelete.push(timer);
            return this;
        }

        addTimer(timer:Timer):Timer{
            timer.manager = this;
            this.timers.push(timer);
            return timer;
        }

        createTimer(time?:number){
            return new Timer(time, this);
        }

        private _remove(timer:Timer):void{
            var index:number = this.timers.indexOf(timer);
            if(index >= 0)this.timers.splice(index,1);
        }
    }
}
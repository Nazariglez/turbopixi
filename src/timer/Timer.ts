///<reference path="../../defs/pixi.js.d.ts" />
///<reference path="./TimerManager.ts" />
module PIXI {
    export class Timer {
        active:boolean = false;
        isEnded:boolean = false;
        isStarted:boolean = false;
        expire:boolean = false;
        delay:number = 0;
        repeat:number = 0;
        loop:boolean = false;

        private _delayTime:number = 0;
        private _elapsedTime:number = 0;
        private _repeat:number = 0;

        constructor(public time:number = 1, public manager?:TimerManager){
            if(this.manager){
                this.addTo(this.manager);
            }
        }

        update(deltaTime:number):Timer{
            if(!this.active)return this;
            var deltaMS:number = deltaTime*1000;

            if(this.delay > this._delayTime){
                this._delayTime += deltaMS;
                return this;
            }

            if(!this.isStarted){
                this.isStarted = true;
                this._onTimerStart(this._elapsedTime, deltaTime);
            }

            if(this.time > this._elapsedTime){
                var t:number = this._elapsedTime+deltaMS;
                var ended:boolean = (t>=this.time);

                this._elapsedTime = (ended) ? this.time : t;
                this._onTimerUpdate(this._elapsedTime, deltaTime);

                if(ended){
                    if(this.loop || this.repeat > this._repeat){
                        this._repeat++;
                        this._onTimerRepeat(this._elapsedTime, deltaTime, this._repeat);
                        this._elapsedTime = 0;
                        return this;
                    }

                    this.isEnded = true;
                    this.active  =false;
                    this._onTimerEnd(this._elapsedTime, deltaTime);
                }


            }
            return this;
        }

        addTo(timerManager:TimerManager):Timer {
            timerManager.addTimer(this);
            return this;
        }

        remove():Timer{
            if(!this.manager){
                throw new Error("Timer without manager.");
            }

            this.manager.removeTimer(this);
            return this;
        }

        start():Timer{
            this.active = true;
            return this;
        }

        stop():Timer{
            this.active = false;
            this._onTimerStop(this._elapsedTime);
            return this;
        }

        reset():Timer{
            this._elapsedTime = 0;
            this._repeat = 0;
            this._delayTime = 0;
            this.isStarted = false;
            this.isEnded = false;
            return this;
        }

        onStart(callback:Function):Timer{
            this._onTimerStart = <any>callback;
            return this;
        }

        onEnd(callback:Function):Timer{
            this._onTimerEnd = <any>callback;
            return this;
        }

        onStop(callback:Function):Timer{
            this._onTimerStop = <any>callback;
            return this;
        }

        onUpdate(callback:Function):Timer{
            this._onTimerUpdate = <any>callback;
            return this;
        }

        onRepeat(callback:Function):Timer{
            this._onTimerRepeat = <any>callback;
            return this;
        }

        private _onTimerStart(elapsedTime:number, deltaTime:number):void{}
        private _onTimerStop(elapsedTime:number):void{}
        private _onTimerRepeat(elapsedTime:number, deltaTime:number, repeat:number):void{}
        private _onTimerUpdate(elapsedTime:number, deltaTime:number):void{}
        private _onTimerEnd(elapsedTime:number, deltaTime:number):void{}
    }
}
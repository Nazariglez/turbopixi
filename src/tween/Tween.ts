///<reference path="../../defs/pixi.js.d.ts" />
///<reference path="./TweenManager.ts" />
///<reference path="./Easing.ts" />
///<reference path="../display/Scene.ts" />
///<reference path="./Path.ts" />
module PIXI{
    export class Tween{
        time:number = 0;
        active:boolean = false;
        easing:Function = Easing.linear();
        expire:boolean = false;
        repeat:number = 0;
        loop:boolean = false;
        delay:number = 0;
        pingPong:boolean = false;
        isStarted:boolean = false;
        isEnded:boolean = false;

        private _to:any;
        private _from:any;
        private _delayTime:number = 0;
        private _elapsedTime:number = 0;
        private _repeat:number = 0;
        private _pingPong:boolean = false;

        private _chainTween:Tween;

        path:Path;
        pathReverse:boolean = false;
        pathFrom:number;
        pathTo:number;

        constructor(public target:any, public manager?:TweenManager){
            if(this.manager){
                this.addTo(this.manager);
            }
        }

        addTo(manager:TweenManager):Tween{
            manager.addTween(this);
            return this;
        }

        chain(tween:Tween = new Tween(this.target)):Tween{
            this._chainTween = tween;
            return tween;
        }

        start():Tween{
            this.active = true;
            if(!this.manager){
                if(this.target){
                    if(this.target.parent) {
                        var manager:TweenManager = _findManager(this.target);
                        if (manager) {
                            this.addTo(manager);
                        } else {
                            throw Error('Tweens needs a manager');
                        }
                    }else{
                        throw Error('Tweens needs a manager');
                    }
                }
            }
            return this;
        }

        stop():Tween{
            this.active = false;
            this._onTweenStop(this._elapsedTime);
            return this;
        }

        to(data:any):Tween{
            this._to = data;
            return this;
        }

        from(data:any):Tween{
            this._from = data;
            return this;
        }

        remove():Tween{
            if(!this.manager){
                throw new Error("Tween without manager.");
            }

            this.manager.removeTween(this);
            return this;
        }

        reset():Tween{
            this._elapsedTime = 0;
            this._repeat = 0;
            this._delayTime = 0;
            this.isStarted = false;
            this.isEnded = false;

            if(this.pingPong&&this._pingPong){
                var _to:any = this._to,
                    _from:any = this._from;

                this._to = _from;
                this._from = _to;

                this._pingPong = false;
            }
            return this;
        }

        onStart(callback:Function):Tween{
            this._onTweenStart = <any>callback;
            return this;
        }

        onEnd(callback:Function):Tween{
            this._onTweenEnd = <any>callback;
            return this;
        }

        onStop(callback:Function):Tween{
            this._onTweenStop = <any>callback;
            return this;
        }

        onUpdate(callback:Function):Tween{
            this._onTweenUpdate = <any>callback;
            return this;
        }

        onRepeat(callback:Function):Tween{
            this._onTweenRepeat = <any>callback;
            return this;
        }

        onPingPong(callback:Function):Tween{
            this._onTweenPingPong = <any>callback;
            return this;
        }

        update(deltaTime:number):Tween{
            if(!(this._canUpdate()&&(this._to||this.path))){
                return this;
            }

            var _to:any, _from:any;
            var deltaMS = deltaTime * 1000;

            if(this.delay > this._delayTime){
                this._delayTime += deltaMS;
                return this;
            }

            if(!this.isStarted) {
                this._parseData();
                this.isStarted = true;
                this._onTweenStart(this._elapsedTime, deltaTime);
            }

            var time:number = (this.pingPong) ? this.time/2 : this.time;
            if(time > this._elapsedTime){
                var t:number = this._elapsedTime+deltaMS;
                var ended:boolean = (t>=time);

                this._elapsedTime = (ended) ? time : t;
                this._apply(time);

                var realElapsed:number = (this._pingPong) ? time+this._elapsedTime : this._elapsedTime;
                this._onTweenUpdate(realElapsed, deltaTime);

                if(ended) {
                    if (this.pingPong && !this._pingPong) {
                        this._pingPong = true;
                        _to = this._to;
                        _from = this._from;

                        this._from = _to;
                        this._to = _from;

                        if (this.path) {
                            _to = this.pathTo;
                            _from = this.pathFrom;

                            this.pathTo = _from;
                            this.pathFrom = _to;
                        }

                        this._onTweenPingPong(realElapsed, deltaTime);

                        this._elapsedTime = 0;
                        return this;
                    }

                    if (this.loop || this.repeat > this._repeat) {
                        this._repeat++;
                        this._onTweenRepeat(realElapsed, deltaTime, this._repeat);
                        this._elapsedTime = 0;

                        if (this.pingPong && this._pingPong) {
                            _to = this._to;
                            _from = this._from;

                            this._to = _from;
                            this._from = _to;

                            if (this.path) {
                                _to = this.pathTo;
                                _from = this.pathFrom;

                                this.pathTo = _from;
                                this.pathFrom = _to;
                            }

                            this._pingPong = false;
                        }
                        return this;
                    }

                    this.isEnded = true;
                    this.active = false;
                    this._onTweenEnd(realElapsed, deltaTime);

                    if(this._chainTween){
                        this._chainTween.addTo(this.manager);
                        this._chainTween.start();
                    }
                }

                return this;
            }
        }

        private _parseData():void{
            if(this.isStarted)return;

            if(!this._from)this._from = {};
            _parseRecursiveData(this._to, this._from, this.target);

            if(this.path){
                let distance:number = this.path.totalDistance();
                if(this.pathReverse){
                    this.pathFrom = distance;
                    this.pathTo = 0;
                }else{
                    this.pathFrom = 0;
                    this.pathTo = distance;
                }
            }
        }

        private _apply(time:number):void{
            _recursiveApply(this._to, this._from, this.target, time, this._elapsedTime, this.easing);

            if(this.path){
                let b:number = this.pathFrom,
                    c:number = this.pathTo - this.pathFrom,
                    d:number = this.time,
                    t:number = this._elapsedTime/d;

                let distance:number = b + (c*this.easing(t));
                let pos:Point = this.path.getPointAtDistance(distance);
                this.target.x = pos.x;
                this.target.y = pos.y;
            }
        }

        private _canUpdate():boolean{
            return (this.time && this.active && this.target);
        }

        private _onTweenStart(elapsedTime:number, deltaTime: number):void{}
        private _onTweenStop(elapsedTime:number):void{}
        private _onTweenEnd(elapsedTime:number, deltaTime: number):void{}
        private _onTweenRepeat(elapsedTime:number, deltaTime: number, repeat:number):void{}
        private _onTweenUpdate(elapsedTime:number, deltaTime: number):void{}
        private _onTweenPingPong(elapsedTime:number, deltaTime: number):void{}
    }

    function _findManager(parent:any):any{
        if(parent instanceof Scene){
            return (parent.tweenManager) ? parent.tweenManager : null;
        }else if(parent.parent){
            return _findManager(parent.parent);
        }else{
            return null;
        }
    }

    function _parseRecursiveData(to:any, from:any, target:any):void{
        for(var k in to){
            if(from[k] !== 0 && !from[k]){
                if(isObject(target[k])){
                    from[k] = JSON.parse(JSON.stringify(target[k]));
                    _parseRecursiveData(to[k], from[k], target[k]);
                }else{
                    from[k] = target[k];
                }
            }
        }
    }

    function isObject(obj:any):boolean{
        return Object.prototype.toString.call(obj) === "[object Object]";
    }

    function _recursiveApply(to:any, from:any, target:any, time:number, elapsed:number, easing:Function):void{
        for(var k in to){
            if(!isObject(to[k])) {
                var b = from[k],
                    c = to[k] - from[k],
                    d = time,
                    t = elapsed/d;
                target[k] = b + (c*easing(t));
            }else{
                _recursiveApply(to[k], from[k], target[k], time, elapsed, easing);
            }
        }
    }
}

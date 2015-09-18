///<reference path="../../defs/pixi.js.d.ts" />
///<reference path="./Tween.ts" />
module PIXI {
    export class TweenManager{
        tweens:Tween[] = [];
        private _toDelete:Tween[] = [];

        constructor(){}

        update(deltaTime:number):TweenManager{
            for(var i:number = 0; i < this.tweens.length; i++){
                if(this.tweens[i].active){
                    this.tweens[i].update(deltaTime)
                    if(this.tweens[i].isEnded && this.tweens[i].expire){
                        this.tweens[i].remove();
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

        getTweensForTarger(target:any):Tween[]{
            var tweens:Tween[] = [];
            for(var i:number = 0; i < this.tweens.length; i++){
                if(this.tweens[i].target === target){
                    tweens.push(this.tweens[i]);
                }
            }

            return tweens;
        }

        createTween(target:any):Tween{
            return new Tween(target, this);
        }

        addTween(tween:Tween):Tween{
            tween.manager = this;
            this.tweens.push(tween);
            return tween;
        }

        removeTween(tween:Tween):TweenManager{
            this._toDelete.push(tween);
            return this;
        }

        private _remove(tween:Tween){
            var index:number = this.tweens.indexOf(tween);
            if(index >= 0){
                this.tweens.splice(index, 1);
            }
        }
    }
}
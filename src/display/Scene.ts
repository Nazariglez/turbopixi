///<reference path="../../defs/pixi.js.d.ts" />
///<reference path="../core/Game.ts" />
///<reference path="./Camera.ts" />
///<reference path="../timer/TimerManager.ts" />
///<reference path="../tween/Tweenmanager.ts" />
module PIXI {
    export class Scene extends Container {
        camera:Camera = new Camera();
        timerManager:TimerManager = new TimerManager();
        tweenManager:TweenManager = new TweenManager();
        static _idLen:number = 0;

        constructor(public id:string = ("scene" + Scene._idLen++) ){
            super();
            this.camera.addTo(this);
        }

        update(deltaTime:number):Scene{
            this.timerManager.update(deltaTime);
            this.tweenManager.update(deltaTime);
            super.update(deltaTime);
            return this;
        }

        addTo(game:Game|Container):Scene {
            if(game instanceof Game){
                <Game>game.addScene(this);
            }else{
                throw new Error('Scenes can only be added to the game');
            }
            return this;
        }

    }
}
///<reference path="../../defs/pixi.js.d.ts" />
///<reference path="../core/Game.ts" />
///<reference path="./Camera.ts" />
module PIXI {
    export class Scene extends Container {
        camera:Camera;
        static _idLen:number = 0;

        constructor(public id:string = ("scene" + Scene._idLen++) ){
            super();
            this.camera = new Camera();
            this.camera.addTo(this);
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
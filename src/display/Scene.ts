///<reference path="../../defs/pixi.js.d.ts" />
module PIXI {
    export class Scene extends Container {
        id:string;
        static _idLen:number = 0;

        constructor(id:string = ("scene" + Scene._idLen++) ){
            super();
            this.id = id;
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
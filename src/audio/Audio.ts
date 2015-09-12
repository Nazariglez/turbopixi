///<reference path="./AudioManager.ts" />
module PIXI {
    export class Audio {
        loop:boolean = false;
        volume:number = 1;
        muted:boolean = false;
        manager:AudioManager;

        constructor(public source:any, public id:string){
        }
    }
}
///<reference path="./AudioManager.ts" />
module PIXI {
    export class Audio {
        id:string;
        source:any;
        loop:boolean = false;
        volume:number = 1;
        muted:boolean = false;
        manager:AudioManager;

        constructor(data:any, id:string){
            this.id = id;
            this.source = data;
        }
    }
}
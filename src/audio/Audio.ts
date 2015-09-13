///<reference path="./AudioManager.ts" />
module PIXI {
    export class Audio {
        loop:boolean = false;
        private _volume:number = 1;
        muted:boolean = false;
        manager:AudioManager;

        constructor(public source:any, public id:string){}

        play(loop?:boolean|Function, callback?:Function):Audio{
            if(!this.manager){
                console.error('This audio need a manager.');
                return this;
            }

            if(typeof loop === "function"){
                callback = <Function>loop;
                loop = false;
            }

            this.manager.play(this.id, loop, callback);
            return this;
        }

        stop():Audio {
            if(!this.manager){
                console.error('This audio need a manager.');
                return this;
            }

            this.manager.stop(this.id);
            return this;
        }

        mute():Audio {
            if(!this.manager){
                console.error('This audio need a manager.');
                return this;
            }

            this.muted = true;
            this.manager.mute(this.id);
            return this;
        }

        unmute():Audio {
            if(!this.manager){
                console.error('This audio need a manager.');
                return this;
            }

            this.muted = false;
            this.manager.unmute(this.id);
            return this;
        }

        pause():Audio {
            if(!this.manager){
                console.error('This audio need a manager.');
                return this;
            }

            this.manager.pause(this.id);
            return this;
        }

        resume():Audio {
            if(!this.manager){
                console.error('This audio need a manager.');
                return this;
            }

            this.manager.resume(this.id);
            return this;
        }

        get volume(){
            return this._volume;
        }

        set volume(value:number){
            this._volume = value;

            if(this.manager){
                //TODO: update the volume on the fly
            }
        }
    }
}
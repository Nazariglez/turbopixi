///<reference path="./AudioManager.ts" />
var HTMLAudio = Audio;
module PIXI {
    export class AudioLine {
        available:boolean = true;
        audio:Audio;
        loop:boolean = false;
        paused:boolean = false;
        callback:Function;
        muted:boolean = false;

        startTime:number = 0;
        lastPauseTime:number = 0;
        offsetTime:number = 0;

        private _htmlAudio:HTMLAudioElement;
        private _webAudio:AudioBufferSourceNode;

        constructor(public manager:AudioManager){
            if(!this.manager.context){
                this._htmlAudio = new HTMLAudio();
                this._htmlAudio.addEventListener('ended', this._onEnd.bind(this));
            }
        }

        setAudio(audio:Audio, loop:boolean|Function, callback?:Function):AudioLine{
            if(typeof loop === "function"){
                callback = <Function>loop;
                loop = false;
            }

            this.audio = audio;
            this.available = false;
            this.loop = <boolean>loop;
            this.callback = callback;
            return this;
        }

        play(pause?:boolean):AudioLine {
            if(!pause && this.paused)return this;

            if(this.manager.context){
                this._webAudio = this.manager.context.createBufferSource();
                this._webAudio.start = this._webAudio.start || this._webAudio.noteOn;
                this._webAudio.stop = this._webAudio.stop || this._webAudio.noteOff;

                this._webAudio.buffer = this.audio.source;
                this._webAudio.loop = this.loop || this.audio.loop;
                this.startTime = this.manager.context.currentTime;

                this._webAudio.onended = this._onEnd.bind(this);

                this._webAudio.gainNode = this.manager.createGainNode(this.manager.context);
                this._webAudio.gainNode.gain.value = (this.audio.muted || this.muted) ? 0 : this.audio.volume;
                this._webAudio.gainNode.connect(this.manager.gainNode);

                this._webAudio.connect(this._webAudio.gainNode);
                this._webAudio.start(0, (pause) ? this.lastPauseTime : null);
            }else{
                this._htmlAudio.src = (this.audio.source.src !== "") ? this.audio.source.src : this.audio.source.children[0].src;
                this._htmlAudio.preload = "auto";
                this._htmlAudio.volume = (this.audio.muted || this.muted) ? 0 : this.audio.volume;
                this._htmlAudio.load();
                this._htmlAudio.play();
            }

            return this;
        }

        stop():AudioLine {
            if(this.manager.context){
                this._webAudio.stop(0);
            }else{
                this._htmlAudio.pause();
                this._htmlAudio.currentTime = 0;
            }

            this.reset();
            return this;
        }

        pause():AudioLine{
            if(this.manager.context){
                this.offsetTime += this.manager.context.currentTime - this.startTime;
                this.lastPauseTime = this.offsetTime%this._webAudio.buffer.duration;
                this._webAudio.stop(0);
            }else{
                this._htmlAudio.pause();
            }
            this.paused = true;
            return this;
        }

        resume():AudioLine{
            if(this.paused){
                if(this.manager.context){
                    this.play(true);
                }else{
                    this._htmlAudio.play();
                }

                this.paused = false;
            }
            return this;
        }

        mute():AudioLine{
            this.muted = true;
            if(this.manager.context){
                this._webAudio.gainNode.gain.value = 0;
            }else{
                this._htmlAudio.volume = 0;
            }
            return this;
        }

        unmute():AudioLine{
            this.muted = false;
            if(this.manager.context){
                this._webAudio.gainNode.gain.value = this.audio.volume;
            }else{
                this._htmlAudio.volume = this.audio.volume;
            }
            return this;
        }

        volume(value:number):AudioLine{
            if(this.manager.context){
                this._webAudio.gainNode.gain.value = value;
            }else{
                this._htmlAudio.volume = value;
            }
            return this;
        }

        reset():AudioLine{
            this.available = true;
            this.audio = null;
            this.loop = false;
            this.callback = null;
            this.paused = false;
            this.muted = false;
            this._webAudio = null;

            this.startTime = 0;
            this.lastPauseTime = 0;
            this.offsetTime = 0;
            return this;
        }

        private _onEnd():void{
            if(this.callback)this.callback(this.manager, this.audio);
            if(!this.manager.context){
                if(this.loop || this.audio.loop){
                    this._htmlAudio.currentTime = 0;
                    this._htmlAudio.play();
                }else{
                    this.reset();
                }
            }else if(this.manager.context && !this.paused){
                this.reset();
            }
        }
    }

}

interface AudioBufferSourceNode {
    noteOn():AudioBufferSourceNode;
    noteOff():AudioBufferSourceNode;
    source:AudioBuffer;
    gainNode:GainNode;
}
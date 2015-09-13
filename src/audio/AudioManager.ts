///<reference path="./AudioLine.ts" />
///<reference path="../core/Game.ts" />
module PIXI {
    export class AudioManager{
        soundLines:AudioLine[] = [];
        musicLines:AudioLine[] = [];
        private _tempLines:AudioLine[] = [];

        musicMuted:boolean = false;
        soundMuted:boolean = false;

        context:AudioContext;
        gainNode:AudioNode;

        constructor(private soundMaxLines:number = 10, private musicMaxLines:number = 1){
            if(utils._audioTypeSelected === AUDIO_TYPE.WEBAUDIO) {
                this.context = Device.globalWebAudioContext;
                this.gainNode = _createGainNode(this.context);
                this.gainNode.connect(this.context.destination);
            }

            var i:number;
            for(i = 0; i < this.soundMaxLines; i++){
                this.soundLines.push(new AudioLine(this));
            }

            for(i = 0; i < this.musicMaxLines; i++){
                this.musicLines.push(new AudioLine(this));
            }
        }

        pauseAllLines():AudioManager {
            this.pauseMusic();
            this.pauseSound();
            return this;
        }

        resumeAllLines():AudioManager{
            this.resumeMusic();
            this.resumeSound();
            return this;
        }

        playMusic(id:string, loop?:boolean|Function, callback?:Function):AudioManager{
            if(typeof loop === "function"){
                callback = <Function>loop;
                loop = false;
            }
            return this._play(id, this.musicLines, <boolean>loop, callback);
        }

        playSound(id:string, loop?:boolean|Function, callback?:Function):AudioManager{
            if(typeof loop === "function"){
                callback = <Function>loop;
                loop = false;
            }
            return this._play(id, this.soundLines, <boolean>loop, callback);
        }

        stopMusic(id?:string):AudioManager{
            return this._stop(id, this.musicLines);
        }

        stopSound(id?:string):AudioManager{
            return this._stop(id, this.soundLines);
        }

        pauseMusic(id?:string):AudioManager{
            return this._pause(id, this.musicLines);
        }

        pauseSound(id?:string):AudioManager{
            return this._pause(id, this.soundLines);
        }

        resumeMusic(id?:string):AudioManager{
            return this._resume(id, this.musicLines);
        }

        resumeSound(id?:string):AudioManager{
            return this._resume(id, this.soundLines);
        }

        muteMusic(id?:string):AudioManager{
            return this._mute(id, this.musicLines);
        }

        muteSound(id?:string):AudioManager{
            return this._mute(id, this.soundLines);
        }

        unmuteMusic(id?:string):AudioManager{
            return this._unmute(id, this.musicLines);
        }

        unmuteSound(id?:string):AudioManager{
            return this._unmute(id, this.soundLines);
        }


        private _pause(id:string, lines:AudioLine[]):AudioManager{
            if(!id){
                for(var i:number = 0; i < lines.length; i++){
                    if(!lines[i].available){
                        lines[i].pause();
                    }
                }

                return this;
            }

            var audioLines:AudioLine[] = this._getLinesById(id, lines);
            if(audioLines.length){
                for(i = 0; i < audioLines.length; i++){
                    audioLines[i].pause();
                }
            }
            return this;
        }

        private _resume(id:string, lines:AudioLine[]):AudioManager{
            if(!id){
                for(var i:number = 0; i < lines.length; i++){
                    if(!lines[i].available){
                        lines[i].resume();
                    }
                }

                return this;
            }

            var audioLines:AudioLine[] = this._getLinesById(id, lines);
            if(audioLines.length){
                for(i = 0; i < audioLines.length; i++){
                    audioLines[i].resume();
                }
            }
            return this;
        }

        private _play(id:string, lines:AudioLine[], loop:boolean = false, callback?:Function):AudioManager{
            var line:AudioLine = this._getAvailableLineFrom(lines);
            if(!line){
                console.error('AudioManager: All lines are busy!');
                return this;
            }

            var audio:Audio = utils.AudioCache[id];
            if(!audio){
                console.error('Audio (' + id + ') not found.');
                return this;
            }

            line.setAudio(audio, loop, callback).play();
            return this;
        }

        private _stop(id:string, lines:AudioLine[]):AudioManager{
            if(!id){
                for(var i:number = 0; i < lines.length; i++){
                    if(!lines[i].available){
                        lines[i].stop();
                    }
                }

                return this;
            }

            var audioLines:AudioLine[] = this._getLinesById(id, lines);
            if(audioLines.length){
                for(i = 0; i < audioLines.length; i++){
                    audioLines[i].stop();
                }
            }

            return this;
        }

        private _mute(id:string, lines:AudioLine[]):AudioManager{
            if(!id){
                for(var i:number = 0; i < lines.length; i++){
                    if(!lines[i].available){
                        lines[i].mute();
                    }
                }

                return this;
            }

            var audioLines:AudioLine[] = this._getLinesById(id, lines);
            if(audioLines.length){
                for(i = 0; i < audioLines.length; i++){
                    audioLines[i].mute();
                }
            }
            return this;
        }

        private _unmute(id:string, lines:AudioLine[]):AudioManager{
            if(!id){
                for(var i:number = 0; i < lines.length; i++){
                    if(!lines[i].available){
                        lines[i].unmute();
                    }
                }

                return this;
            }

            var audioLines:AudioLine[] = this._getLinesById(id, lines);
            if(audioLines.length){
                for(i = 0; i < audioLines.length; i++){
                    audioLines[i].unmute();
                }
            }
            return this;
        }

        private _getLinesById(id:string, lines:AudioLine[]):AudioLine[] {
            this._tempLines.length = 0;
            for(var i:number = 0; i < lines.length; i++){
                if(!lines[i].available){
                    if(lines[i].audio.id === id)this._tempLines.push(lines[i]);
                }
            }

            return this._tempLines;
        }

        private _getAvailableLineFrom(lines:AudioLine[]):AudioLine{
            var l:AudioLine;
            for(var i:number = 0; i < lines.length; i++){
                if(lines[i].available){
                    l = lines[i];
                    break;
                }
            }
            return l;
        }

    }

    function _createGainNode(ctx:AudioContext):GainNode{
        return ctx.createGain ? ctx.createGain() : ctx.createGainNode();
    }
}

interface AudioContext {
    createGainNode():any;
}
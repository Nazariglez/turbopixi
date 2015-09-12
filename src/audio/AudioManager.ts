module PIXI {
    export class AudioManager{
        soundMaxLines:number = 10;
        musicMaxLines:number = 1;

        musicMuted:boolean = false;
        soundMuted:boolean = false;

        context:AudioContext;

        constructor(private game: Game){
            if(utils._audioTypeSelected === AUDIO_TYPE.WEBAUDIO) {
                this.context = Device.globalWebAudioContext;
            }
        }

    }
}
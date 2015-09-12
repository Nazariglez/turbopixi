///<reference path="../../defs/pixi.js.d.ts" />
///<reference path="./bitmapFontParserTxt.ts" />
///<reference path="./audioParser.ts" />
///<reference path="../core/Utils.ts" />
module PIXI {
    export module loaders{
        Loader.addPixiMiddleware(bitmapFontParserTXT);
        Loader.addPixiMiddleware(audioParser);

        class TurboLoader extends Loader {
            constructor(baseUrl: string, assetConcurrency: number){
                super(baseUrl, assetConcurrency);
                if(Device.isAudioSupported){
                    _checkAudioType();
                }
            }
        }

        loaders.Loader = TurboLoader;


        function _checkAudioType():void{
            if(Device.isMp3Supported)_setAudioExt("mp3");
            if(Device.isOggSupported)_setAudioExt("ogg");
            if(Device.isWavSupported)_setAudioExt("wav");
            if(Device.isM4aSupported)_setAudioExt("m4a");
        }

        function _setAudioExt(ext:string):void {
            if(utils._audioTypeSelected === AUDIO_TYPE.WEBAUDIO){
                Resource.setExtensionXhrType(ext, Resource.XHR_RESPONSE_TYPE.BUFFER);
            }else{
                Resource.setExtensionLoadType(ext, Resource.LOAD_TYPE.AUDIO);
            }
        }
    }
}
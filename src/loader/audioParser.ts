///<reference path="../audio/AudioManager.ts" />
///<reference path="../Audio/Audio.ts" />
module PIXI {
    export function audioParser():Function {
        return function(resource:loaders.Resource, next:Function):void{
            if(!Device.isAudioSupported || !resource.data){
                return next();
            }

            var _allowedExt:string[] = ["m4a", "ogg", "mp3", "wav"];
            var ext:string = _getExt(resource.url);

            if(_allowedExt.indexOf(ext) === -1){
                return next();
            }

            var deviceCanPlay:boolean = false;
            switch(ext){
                case "m4a":deviceCanPlay = Device.isM4aSupported; break;
                case "mp3":deviceCanPlay = Device.isMp3Supported; break;
                case "ogg":deviceCanPlay = Device.isOggSupported; break;
                case "wav":deviceCanPlay = Device.isWavSupported; break;
            }

            if(!deviceCanPlay){
                return next();
            }

            var name:string = resource.name || resource.url;
            if(utils._audioTypeSelected === AUDIO_TYPE.WEBAUDIO){
                Device.globalWebAudioContext.decodeAudioData(resource.data, _addToCache.bind(this, next, name));
            }else{
                return _addToCache(next, name, resource.data);
            }

        }
    }

    function _addToCache(next:Function, name:string, data:any){
        utils.AudioCache[name] = new Audio(data, name);
        return next();
    }

    function _getExt(url:string):string{
        return url.split('?').shift().split('.').pop().toLowerCase();
    }
}

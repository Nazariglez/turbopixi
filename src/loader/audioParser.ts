///<reference path="../audio/AudioManager.ts" />
///<reference path="../Audio/Audio.ts" />
module PIXI {
    var _allowedExt:string[] = ["m4a", "ogg", "mp3", "wav"];

    export function audioParser():Function {
        return function(resource:loaders.Resource, next:Function):void{
            if(!Device.isAudioSupported || !resource.data){
                return next();
            }

            var ext:string = _getExt(resource.url);

            if(_allowedExt.indexOf(ext) === -1){
                return next();
            }

            if(!_canPlay(ext)){
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

    export function audioParserUrl(resourceUrl:string[]):string{
        var ext:string;
        var url:string;
        for(var i:number = 0; i < resourceUrl.length; i++){
            ext = _getExt(resourceUrl[i]);

            if(_allowedExt.indexOf(ext) === -1){
                break;
            }

            if(_canPlay(ext)){
                url = resourceUrl[i];
                break;
            }
        }

        return url;
    }

    function _addToCache(next:Function, name:string, data:any){
        utils.AudioCache[name] = new Audio(data, name);
        return next();
    }

    function _getExt(url:string):string{
        return url.split('?').shift().split('.').pop().toLowerCase();
    }

    function _canPlay(ext:string):boolean{
        var deviceCanPlay:boolean = false;
        switch(ext){
            case "m4a":deviceCanPlay = Device.isM4aSupported; break;
            case "mp3":deviceCanPlay = Device.isMp3Supported; break;
            case "ogg":deviceCanPlay = Device.isOggSupported; break;
            case "wav":deviceCanPlay = Device.isWavSupported; break;
        }
        return deviceCanPlay;
    }
}

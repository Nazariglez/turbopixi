///<reference path="../../defs/pixi.js.d.ts" />
module PIXI {
    export function bitmapFontParserTXT():Function{
        return function(resource: loaders.Resource, next:Function):void{

            //skip if no data or if not txt
            if(!resource.data || (resource.xhrType !== "text" && resource.xhrType !== "document")){
                return next();
            }

            var text:string = (resource.xhrType === "text") ? resource.data : resource.xhr.responseText;

            //skip if not a bitmap font data
            if( text.indexOf("page") === -1 ||
                text.indexOf("face") === -1 ||
                text.indexOf("info") === -1 ||
                text.indexOf("char") === -1 ){

                return next();
            }

            var url:string = dirname(resource.url);
            if(url === "."){
                url = "";
            }

            if(this.baseUrl && url){
                if(this.baseUrl.charAt(this.baseUrl.length-1)=== '/'){
                    url += '/';
                }

                url.replace(this.baseUrl, '');
            }

            if(url && url.charAt(url.length - 1) !== '/'){
                url += '/';
            }

            var textureUrl:string = getTextureUrl(url, text);
            if(utils.TextureCache[textureUrl]){
                parse(resource, utils.TextureCache[textureUrl]);
                next();
            }else{

                var loadOptions:any = {
                    crossOrigin: resource.crossOrigin,
                    loadType: loaders.Resource.LOAD_TYPE.IMAGE
                };

                this.add(resource.name + '_image', textureUrl, loadOptions, function(res:any){
                    parse(resource, res.texture);
                    next();
                });

            }


            next();
        }
    }

    function parse(resource:loaders.Resource, texture:Texture){
        var currentLine:string, attr:attrData,
            data:fontData = {
                chars : {}
            };

        var text:string = (resource.xhrType === "text") ? resource.data : resource.xhr.responseText;
        var lines:string[] = text.split('\n');

        for(var i:number = 0; i < lines.length; i++){
            if(lines[i].indexOf("info") === 0){
                currentLine = lines[i].substring(5);
                attr = getAttr(currentLine);

                data.font = attr.face;
                data.size = parseInt(attr.size);
            }

            if(lines[i].indexOf('common ') === 0){
                currentLine = lines[i].substring(7);
                attr = getAttr(currentLine);
                data.lineHeight = parseInt(attr.lineHeight);
            }

            if(lines[i].indexOf("char ") === 0){
                currentLine = lines[i].substring(5);
                attr = getAttr(currentLine);
                var charCode:number = parseInt(attr.id);

                var textureRect:Rectangle = new Rectangle(
                    parseInt(attr.x),
                    parseInt(attr.y),
                    parseInt(attr.width),
                    parseInt(attr.height)
                );

                data.chars[charCode] = {
                    xOffset: parseInt(attr.xoffset),
                    yOffset: parseInt(attr.yoffset),
                    xAdvance: parseInt(attr.xadvance),
                    kerning: {},
                    texture: new Texture(texture.baseTexture, textureRect)
                };
            }

            if(lines[i].indexOf('kerning ') === 0){
                currentLine = lines[i].substring(8);
                attr = getAttr(currentLine);

                var first = parseInt(attr.first);
                var second = parseInt(attr.second);

                data.chars[second].kerning[first] = parseInt(attr.amount);
            }
        }

        resource.bitmapFont = data;
        extras.BitmapText.fonts[data.font] = data;
    }

    function dirname(path:string):string{
        return path.replace(/\\/g,'/').replace(/\/[^\/]*$/, '');
    }

    function getTextureUrl(url:string, data:string):string{
        var textureUrl:string;
        var lines:string[] = data.split('\n');

        for(var i:number = 0; i < lines.length; i++){
            if(lines[i].indexOf("page") === 0) {
                var currentLine:string = lines[i].substring(5);
                var file:string = (currentLine.substring(currentLine.indexOf('file='))).split('=')[1];
                textureUrl = url + file.substr(1, file.length-2);
                break;
            }
        }

        return textureUrl;
    }

    function getAttr(line:string):attrData{
        var regex:RegExp = /"(\w*\d*\s*(-|_)*)*"/g,
            attr:string[] = line.split(/\s+/g),
            data:any = {};

        for(var i:number = 0; i < attr.length; i++){
            var d:string[] = attr[i].split('=');
            var m:RegExpMatchArray = d[1].match(regex);
            if(m && m.length >= 1){
                d[1] = d[1].substr(1, d[1].length-2);
            }
            data[d[0]] = d[1];
        }

        return <attrData>data;
    }

    interface fontData {
        chars? : any;
        font? : string;
        size? : number;
        lineHeight? : number;
    }

    interface attrData {
        face? : string;
        size? : string;
        lineHeight? : string;
        id? : string;
        x? : string;
        y? : string;
        width? : string;
        height? : string;
        xoffset? : string;
        yoffset? : string;
        xadvance? : string;
        first? : string;
        second? : string;
        amount? : string;
    }
}
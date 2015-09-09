///<reference path="../../defs/pixi.js.d.ts" />
///<reference path="./bitmapFontParserTxt.ts" />
module PIXI {
    loaders.Loader.addPixiMiddleware(bitmapFontParserTXT);
}
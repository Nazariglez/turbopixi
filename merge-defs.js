var fs = require('fs'),
    path = require('path');

var intro = "declare module PIXI {";
var outro = "\n\n}" +
        "\n\n" +
        "declare module 'pixi.js' {" +
        "\n    export = PIXI;" +
        "\n}";

function merge(output, files, callback){
    var regex = /\s*(declare)?\s*module\s?PIXI\s*\{/g;

    var content = [];
    files.forEach(function(file){
        var dir = path.normalize(__dirname + '/' + file);
        content.push(fs.readFileSync(dir, 'utf8').split('\n'));
    });

    var definitions = "";
    for(var i = 0; i < content.length; i++){
        var f = content[i];
        for(var l = 0; l < f.length; l++){
            var match = f[l].match(regex);
            if(match){
                definitions += getBlock(f,l);
            }
        }
    }

    fs.writeFile(output, intro + definitions + outro, "utf8", callback);
}

function getBlock(file, line){
    var block = "";
    var braces = 1;

    for(var l = line+1; l < file.length; l++){
        var open = file[l].match(/\{/g);
        var close = file[l].match(/\}/g);
        braces += (open) ? open.length : 0;
        braces -= (close) ? close.length : 0;

        if(!braces){
            break;
        }

        if(braces >= 1){
            var spaces = getSpaces(braces - ((open) ? 1 : 0));
            block += "\n" + spaces + (file[l]).trim();
        }
    }

    return block;
}

function getSpaces(num){
    var spaces = "";
    for(var i = 0; i < num; i++)spaces += "  ";
    return spaces;
}

module.exports = merge;
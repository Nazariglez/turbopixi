///<reference path="../defs/pixi.d.ts" />
///<reference path="../defs/core.d.ts" />
import Device = require('./Device');
var last:number = 0;
var minFrameMS = 20;

class Game {
    id:string = "PixiGame";

    stage: PIXI.Container = new PIXI.Container();
    raf: any;

    renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
    canvas: HTMLCanvasElement;

    delta: number = 0;
    time: number = 0;
    lastTime: number = 0;

    isWebGL:boolean;
    isWebAudio:boolean;

    constructor(width:number = 800, height:number = 600, config?:GameConfig) {
        this.renderer = PIXI.autoDetectRenderer(width, height);
        this.canvas = this.renderer.view;

        document.body.appendChild(this.canvas);

        this.isWebGL = (this.renderer.type === PIXI.RENDERER_TYPE.WEBGL); //TODO: pull request en las definiciones, esto está mal
        this.isWebAudio = (Device.hasWebAudio); //TODO: check -> && config.useWebAudio
    }

    private _animate() : void{
        this.raf = window.requestAnimationFrame(this._animate.bind(this));

        var now : number = Date.now();

        this.time += Math.min((now - last)/1000, minFrameMS);
        this.delta = this.time - this.lastTime;
        this.lastTime = this.time;

        last = now;

        this.renderer.render(this.stage);

        this.update(this.delta);
    }

    update(deltaTime:number) : Game {
        for(var i = 0; i < this.stage.children.length; i++){
            this.stage.children[i].update(this.delta);
        }

        return this;
    }

    start():Game{
        this._animate();
        return this;
    }

    stop():Game{
        window.cancelAnimationFrame(this.raf);
        return this;
    }

}

export = Game;
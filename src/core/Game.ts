///<reference path="../../defs/pixi.js.d.ts" />
///<reference path="./Device.ts" />
///<reference path="../display/Scene.ts" />
///<reference path="../audio/AudioManager.ts" />
///<reference path="../input/InputManager.ts" />
module PIXI {
    var last:number = 0;
    var minFrameMS = 20;

    var defaultGameConfig : GameConfig = {
        id: "pixi.default.id",
        useWebAudio: true,
        width:800,
        height:600
    };

    export class Game {
        id:string;
        raf:any;

        private _scenes:Scene[] = [];
        scene:Scene;

        audio:AudioManager;
        input:InputManager;

        renderer:WebGLRenderer | CanvasRenderer;
        canvas:HTMLCanvasElement;

        delta:number = 0;
        time:number = 0;
        lastTime:number = 0;

        isWebGL:boolean;
        isWebAudio:boolean;

        constructor(config?:GameConfig, rendererOptions?:RendererOptions) {
            config = (<Object>Object).assign(defaultGameConfig, config);
            this.id = config.id;
            this.renderer = autoDetectRenderer(config.width, config.height, rendererOptions);
            this.canvas = this.renderer.view;

            document.body.appendChild(this.canvas);

            this.isWebGL = (this.renderer.type === RENDERER_TYPE.WEBGL);
            this.isWebAudio = (Device.hasWebAudio&&config.useWebAudio);

            var initialScene:Scene = new Scene('initial').addTo(this);
            this.setScene(initialScene);

            this.input = new InputManager(this);
            this.audio = new AudioManager(this);
        }

        private _animate():void {
            this.raf = window.requestAnimationFrame(this._animate.bind(this));

            var now:number = Date.now();

            this.time += Math.min((now - last) / 1000, minFrameMS);
            this.delta = this.time - this.lastTime;
            this.lastTime = this.time;

            last = now;

            this.renderer.render(this.scene);

            this.update(this.delta);
        }

        update(deltaTime:number):Game {
            for (var i = 0; i < this.scene.children.length; i++) {
                this.scene.children[i].update(this.delta);
            }

            //clean killed objects
            var len:number = Container._killedObjects.length;
            if (len) {
                for (var i:number = 0; i < len; i++) Container._killedObjects[i].remove();
                Container._killedObjects.length = 0;
            }

            return this;
        }

        start():Game {
            this._animate();
            return this;
        }

        stop():Game {
            window.cancelAnimationFrame(this.raf);
            return this;
        }

        setScene(scene:Scene | string):Game {
            if(!(scene instanceof Scene)){
                scene = this.getScene(<string>scene);
            }

            this.scene = <Scene>scene;
            this.scene.position.set(this.width/2, this.height/2);
            return this;
        }

        getScene(id:string):Scene{
            var scene:Scene = null;
            for(var i:number = 0; i < this._scenes.length; i++){
                if(this._scenes[i].id === id){
                    scene = this._scenes[i];
                }
            }

            return scene;
        }

        addScene(scene:Scene):Game {
            this._scenes.push(scene);
            return this;
        }

        get width():number {
            return this.renderer.width;
        }

        get height():number {
            return this.renderer.height;
        }

    }

    export interface GameConfig {
        id?:string;
        width?:number;
        height?:number;
        useWebAudio?:boolean;
    }
}

interface Object {
    assign(target:Object, ...sources:Object[]):Object;
}
module PIXI {
    export class DataManager{
        game:Game;
        usePersistantData:boolean;

        private _data:any;

        constructor(game:Game, usePersitantData:boolean = false){
            this.game = game;
            this.usePersistantData = usePersitantData;
            this.load();
        }

        load():DataManager{
            this._data = JSON.parse(localStorage.getItem(this.game.id)) || {};
            return this;
        }

        save():DataManager{
            if(this.usePersistantData){
                localStorage.setItem(this.game.id, JSON.stringify(this._data));
            }
            return this;
        }

        reset():DataManager{
            this._data = {};
            this.save();
            return this;
        }

        set(key:string | Object, value?:any):DataManager{
            if(Object.prototype.toString.call(key) === "[object Object]"){
                Object.assign(this._data, key);
            }else if(typeof key === "string"){
                this._data[key] = value;
            }

            this.save();
            return this;
        }

        get(key?:string):any{
            if(!key){
                return this._data;
            }

            return this._data[key];
        }

        del(key:string):DataManager{
            delete this._data[key];
            this.save();
            return this;
        }

    }
}
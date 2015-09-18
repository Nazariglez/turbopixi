module PIXI {
    export class Pool {
        private _items:any[] = [];

        constructor(amount:number, public objectCtor:any, public args:any[] = []){
            for(var i:number = 0; i < amount; i++){
                this._items.push(this._newObject());
            }
        }

        private _newObject():any{
            var obj:any;
            try{
                obj = new (Function.prototype.bind.apply(this.objectCtor, ([null]).concat(this.args)))();
            }catch(e){
                obj = _newObj(this.objectCtor, this.args);
            }

            var me:Pool = this;
            obj.returnToPool = function returnToPool(){
                  me.put(this);
            };

            return obj;
        }

        put(item:any):void{
            this._items.unshift(item);
            if(item.onReturnToPool)item.onReturnToPool(this);
        }

        get():any{
            var item:any = (this._items.length) ? this._items.pop() : this._newObject();
            if(item.onGetFromPool)item.onGetFromPool(this);
            return item;
        }

        get length(){
            return this._items.length;
        }
    }

    //safari fix
    function _newObj(obj:any, args:any[]):any{
        var ev:string = "Function('obj',";
        var fn:string = "\"return new obj(";

        for(var i:number = 0; i < args.length; i++){
            ev += "'a"+i+"',";
            fn += "a"+i;
            if(i !== args.length-1){
                fn += ",";
            }
        }

        fn += ")\"";
        ev += fn + ")";

        return (eval(ev)).apply(this, ([obj]).concat(args));
    }
}
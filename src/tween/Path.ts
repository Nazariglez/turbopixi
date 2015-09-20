///<reference path="../../defs/pixi.js.d.ts" />
module PIXI {
    export class Path {
        private _closed:boolean = false;
        polygon:Polygon = new Polygon();

        private _tmpPoint:Point = new Point();
        private _tmpPoint2:Point = new Point();

        private _tmpDistance:any[] = [];

        private currentPath:GraphicsData;
        private graphicsData:GraphicsData[] = [];

        dirty:boolean = false;

        constructor(){
            this.polygon.closed = false;
        }

        moveTo(x:number, y:number):Path{
            Graphics.prototype.moveTo.call(this, x,y);
            this.dirty = true;
            return this;
        }

        lineTo(x:number, y:number):Path{
            Graphics.prototype.lineTo.call(this, x,y);
            this.dirty = true;
            return this;
        }

        bezierCurveTo(cpX:number, cpY:number, cpX2:number, cpY2:number, toX:number, toY:number):Path{
            Graphics.prototype.bezierCurveTo.call(this, cpX, cpY, cpX2, cpY2, toX, toY);
            this.dirty = true;
            return this;
        }

        quadraticCurveTo(cpX: number, cpY: number, toX: number, toY: number):Path{
            Graphics.prototype.quadraticCurveTo.call(this, cpX, cpY, toX, toY);
            this.dirty = true;
            return this;
        }

        arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): Path{
            Graphics.prototype.arcTo.call(this, x1, y1, x2, y2, radius);
            this.dirty = true;
            return this;
        }

        arc(cx: number, cy: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): Path {
            Graphics.prototype.arc.call(this, cx, cy, radius, startAngle, endAngle, anticlockwise);
            this.dirty = true;
            return this;
        }

        drawShape(shape:Polygon):Path{
            Graphics.prototype.drawShape.call(this, shape);
            this.dirty = true;
            return this;
        }

        getPoint(num:number):Point{
            this.parsePoints();
            var len:number = num*2;
            this._tmpPoint.set(this.polygon.points[len],this.polygon.points[len + 1]);
            return this._tmpPoint;
        }

        distanceBetween(num1:number, num2:number):number{
            this.parsePoints();
            var {x:p1X, y:p1Y} = this.getPoint(num1);
            var {x:p2X, y:p2Y} = this.getPoint(num2);

            var dx:number = p2X-p1X;
            var dy:number = p2Y-p1Y;

            return Math.sqrt(dx*dx+dy*dy);
        }

        totalDistance():number{
            this.parsePoints();
            this._tmpDistance.length = 0;
            this._tmpDistance.push(0);

            var len:number = this.length;
            var distance:number = 0;
            for (var i:number = 0; i < len - 1; i++) {
                distance += this.distanceBetween(i, i + 1);
                this._tmpDistance.push(distance);
            }

            return distance;
        }

        getPointAt(num:number):Point{
            this.parsePoints();
            if(num > this.length){
                return this.getPoint(this.length-1);
            }

            if(num%1 === 0){
                return this.getPoint(num);
            }else{
                this._tmpPoint2.set(0,0);

                var diff:number = num%1;

                var {x:ceilX, y:ceilY} = this.getPoint(Math.ceil(num));
                var {x:floorX, y:floorY} = this.getPoint(Math.floor(num));

                var xx:number = -((floorX - ceilX)*diff);
                var yy:number = -((floorY - ceilY)*diff);
                this._tmpPoint2.set(floorX + xx, floorY + yy);

                return this._tmpPoint2;
            }
        }

        getPointAtDistance(distance:number):Point{
            this.parsePoints();
            if(!this._tmpDistance)this.totalDistance();
            var len:number = this._tmpDistance.length;
            var n:number = 0;

            var totalDistance:number = this._tmpDistance[this._tmpDistance.length-1];
            if(distance < 0){
                distance = totalDistance+distance;
            }else if(distance > totalDistance){
                distance = distance-totalDistance;
            }

            for(var i:number = 0; i < len; i++){
                if(distance >= this._tmpDistance[i]){
                    n = i;
                }

                if(distance < this._tmpDistance[i]){
                    break;
                }
            }

            if(n === this.length-1){
                return this.getPointAt(n);
            }

            var diff1:number = distance-this._tmpDistance[n];
            var diff2:number = this._tmpDistance[n+1] - this._tmpDistance[n];

            return this.getPointAt(n+diff1/diff2);
        }

        parsePoints():Path {
            if(this.dirty) {
                this.dirty = false;
                this.polygon.points.length = 0;
                for (var i:number = 0; i < this.graphicsData.length; i++) {
                    var shape:Polygon = <Polygon>this.graphicsData[i].shape;
                    if (shape && shape.points) {
                        this.polygon.points = this.polygon.points.concat(shape.points);
                    }
                }
            }

            return this;
        }

        clear():Path{
            this.graphicsData.length = 0;
            this.currentPath = null;

            this.polygon.points.length = 0;
            this._closed = false;
            this.dirty = false;
            return this;
        }

        get closed():boolean{
            return this._closed;
        }

        set closed(value){
            this.polygon.closed = value;
            this._closed = value;
            this.dirty = true;
        }

        get length():number{
            return (this.polygon.points.length === 0) ? 0 : this.polygon.points.length/2 + ((this._closed) ? 1 : 0);
        }
    }
}
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

            return this._tmpPoint;
        }

        distanceeBetween(num1:number, num2:number):number{

            return 0;
        }

        totalDistance():number{

            return 0;
        }

        getPointAt(num:number):Point{

            return this._tmpPoint;
        }

        getPointAtDistance(distance:number):Point{

            return this._tmpPoint;
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

        get closed():boolean{
            return this._closed;
        }

        set closed(value){
            this.polygon.closed = value;
            this._closed = value;
            this.dirty = true;
        }
    }
}
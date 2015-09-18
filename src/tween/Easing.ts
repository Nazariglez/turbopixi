///<reference path="../../defs/pixi.js.d.ts" />
module PIXI {
    export module Easing {
        export function linear():Function{
            return function(k:number):number{
                return k;
            };
        }

        export function inQuad():Function{
            return function(k:number):number{
                return k*k;
            };
        }

        export function outQuad():Function{
            return function(k:number):number{
                return k*(2-k);
            };
        }

        export function inOutQuad():Function{
            return function(k:number):number{
                if ( ( k *= 2 ) < 1 ) return 0.5 * k * k;
                return - 0.5 * ( --k * ( k - 2 ) - 1 );
            };
        }

        export function inCubic():Function{
            return function (k:number):number{
                return k * k * k;
            };
        }

        export function outCubic():Function{
            return function(k:number):number{
                return --k * k * k + 1;
            };
        }

        export function inOutCubic():Function{
            return function(k:number):number{
                if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k;
                return 0.5 * ( ( k -= 2 ) * k * k + 2 );
            };
        }

        export function inQuart():Function{
            return function(k:number):number{
                return k * k * k * k;
            };
        }

        export function outQuart():Function{
            return function(k:number):number{
                return 1 - ( --k * k * k * k );
            };
        }

        export function inOutQuart():Function{
            return function(k:number):number{
                if ( ( k *= 2 ) < 1) return 0.5 * k * k * k * k;
                return - 0.5 * ( ( k -= 2 ) * k * k * k - 2 );
            };
        }

        export function inQuint():Function{
            return function(k:number):number{
                return k * k * k * k * k;
            };
        }

        export function outQuint():Function{
            return function(k:number):number{
                return --k * k * k * k * k + 1;
            };
        }

        export function inOutQuint():Function{
            return function(k:number):number{
                if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k * k * k;
                return 0.5 * ( ( k -= 2 ) * k * k * k * k + 2 );
            };
        }

        export function inSine():Function{
            return function(k:number):number{
                return 1 - Math.cos( k * Math.PI / 2 );
            };
        }

        export function outSine():Function{
            return function(k:number):number{
                return Math.sin( k * Math.PI / 2 );
            };
        }

        export function inOutSine():Function{
            return function(k:number):number{
                return 0.5 * ( 1 - Math.cos( Math.PI * k ) );
            };
        }

        export function inExpo():Function{
            return function(k:number):number{
                return k === 0 ? 0 : Math.pow( 1024, k - 1 );
            };
        }

        export function outExpo():Function{
            return function(k:number):number{
                return k === 1 ? 1 : 1 - Math.pow( 2, - 10 * k );
            };
        }

        export function inOutExpo():Function{
            return function(k:number):number{
                if ( k === 0 ) return 0;
                if ( k === 1 ) return 1;
                if ( ( k *= 2 ) < 1 ) return 0.5 * Math.pow( 1024, k - 1 );
                return 0.5 * ( - Math.pow( 2, - 10 * ( k - 1 ) ) + 2 );
            };
        }

        export function inCirc():Function{
            return function(k:number):number{
                return 1 - Math.sqrt( 1 - k * k );
            };
        }

        export function outCirc():Function{
            return function(k:number):number{
                return Math.sqrt( 1 - ( --k * k ) );
            };
        }

        export function inOutCirc():Function{
            return function(k:number):number{
                if ( ( k *= 2 ) < 1) return - 0.5 * ( Math.sqrt( 1 - k * k) - 1);
                return 0.5 * ( Math.sqrt( 1 - ( k -= 2) * k) + 1);
            };
        }

        export function inElastic():Function{
            return function(k:number):number{
                var s:number, a:number = 0.1, p:number = 0.4;
                if ( k === 0 ) return 0;
                if ( k === 1 ) return 1;
                if ( !a || a < 1 ) { a = 1; s = p / 4; }
                else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
                return - ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
            };
        }

        export function outElastic():Function{
            return function(k:number):number{
                var s:number, a:number = 0.1, p:number = 0.4;
                if ( k === 0 ) return 0;
                if ( k === 1 ) return 1;
                if ( !a || a < 1 ) { a = 1; s = p / 4; }
                else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
                return ( a * Math.pow( 2, - 10 * k) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) + 1 );
            };
        }

        export function inOutElastic():Function{
            return function(k:number):number{
                var s:number, a:number = 0.1, p:number = 0.4;
                if ( k === 0 ) return 0;
                if ( k === 1 ) return 1;
                if ( !a || a < 1 ) { a = 1; s = p / 4; }
                else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
                if ( ( k *= 2 ) < 1 ) return - 0.5 * ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
                return a * Math.pow( 2, -10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) * 0.5 + 1;
            };
        }

        export function inBack(v:number = 1.70158):Function{
            return function(k:number):number{
                var s:number = v;
                return k * k * ( ( s + 1 ) * k - s );
            };
        }

        export function outBack(v:number = 1.70158):Function{
            return function(k:number):number{
                var s:number = v;
                return --k * k * ( ( s + 1 ) * k + s ) + 1;
            };
        }

        export function inOutBack(v:number = 1.70158):Function{
            return function(k:number):number{
                var s:number =  v * 1.525;
                if ( ( k *= 2 ) < 1 ) return 0.5 * ( k * k * ( ( s + 1 ) * k - s ) );
                return 0.5 * ( ( k -= 2 ) * k * ( ( s + 1 ) * k + s ) + 2 );
            };
        }

        export function inBounce():Function{
            return function(k:number):number{
                return 1 - Easing.outBounce()( 1 - k );
            };
        }

        export function outBounce():Function{
            return function(k:number):number{
                if ( k < ( 1 / 2.75 ) ) {

                    return 7.5625 * k * k;

                } else if ( k < ( 2 / 2.75 ) ) {

                    return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;

                } else if ( k < ( 2.5 / 2.75 ) ) {

                    return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;

                } else {

                    return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;

                }
            };
        }

        export function inOutBounce():Function{
            return function(k:number):number{
                if ( k < 0.5 ) return Easing.inBounce()( k * 2 ) * 0.5;
                return Easing.outBounce()( k * 2 - 1 ) * 0.5 + 0.5;
            };
        }
    }
}
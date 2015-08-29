var gulp = require('gulp');

var source = require('vinyl-source-stream');
var browserify = require('browserify');
var tsify = require('tsify');
var watchify = require('watchify');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

var config = {
    debug: true,
    publicPath: __dirname + '/bin',
    app: {
        path: __dirname + '/src',
        main: 'index.ts',
        result: 'turbopixi'
    }
};

function getBundler(args){
    args = args || {};
    args.debug = config.debug;
    args.fullPaths = false;
    args.basedir = config.app.path;

    return browserify(args)
        .add(config.app.path + '/' + config.app.main)
        .plugin(tsify, { target: 'ES5' });
}

function createBundler(bundler){
    bundler = bundler || getBundler();
    return bundler.bundle()

        .on('error', function(err){
            console.error('Error: ' + err.message);
        })

        .pipe(source(config.app.result + '.js'))
        .pipe(gulp.dest(config.publicPath))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(rename(config.app.result + '.min.js'))
        .pipe(gulp.dest(config.publicPath));
}

function watch(){
    var bundler = watchify(getBundler(watchify.args));

    bundler.on('update', function(){
        console.log('Compiling...');
        var bundle = createBundler(bundler);
    });

    bundler.on('time', function(time){
        console.log('Compiled in ' + (time/1000) + ' seconds.');
    });

    return createBundler(bundler);
}

gulp.task('compile', function() {
    var bundler = getBundler();
    return createBundler(bundler);
});

gulp.task('watch', function(){
    return watch();
});

gulp.task('getDefs', function(){
    return gulp.src('../pixi-typescript/pixi.js.d.ts')
        .pipe(gulp.dest('./src/defs/'));
});
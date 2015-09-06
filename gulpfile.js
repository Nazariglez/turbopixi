var gulp = require('gulp');
var typescript = require('gulp-typescript');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var merge = require('merge2');
var sourcemaps = require('gulp-sourcemaps');
var stripComments = require('gulp-strip-comments');
var header = require('gulp-header');
var wrap = require('gulp-wrap-js');
var fs = require('fs');
var watch = require('gulp-watch');
var runSequence = require('run-sequence');
var mergeDefs = require('./merge-defs');
var clean = require('gulp-clean');

var pkg = require('./package.json');
var banner = ['/**',
    ' * TurboPixi',
    ' * @version v<%= pkg.version %>',
    ' * @license <%= pkg.license %>',
    ' * @author <%= pkg.author %>',
    ' */',
    ''].join('\n');

var txtWrapper = fs.readFileSync('./file-wrapper.txt', 'utf8');

gulp.task('default', function(){
    console.log('Use \'gulp compile\' or \'gulp watch\'');
});

gulp.task('compile', function(callback){
    runSequence('compile-js', 'create-def', 'clean-def', callback);
});

gulp.task('create-def', function(){
    mergeDefs(
        './bin/turbopixi.d.ts',

        [
            "./defs/pixi.js.d.ts",
            "./bin/tmp.turbopixi.d.ts"
        ]
    );

    return gulp.src('');
});

gulp.task('compile-js', function(){
    var tsResult = gulp.src('./src/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(typescript({
            noImplicitAny: true,
            sortOutput: true,
            module: "commonjs",
            target: "ES5",
            declarationFiles: true
        }));

    return merge([
        tsResult.js.pipe(concat('turbopixi.js'))
            .pipe(wrap(txtWrapper))
            .pipe(header(banner, {pkg:pkg}))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest('./bin/'))
            .pipe(rename('turbopixi.min.js'))
            .pipe(uglify())
            .pipe(header(banner, {pkg:pkg}))
            .pipe(gulp.dest('./bin/')),

        tsResult.dts.pipe(concat('tmp.turbopixi.d.ts'))
            .pipe(stripComments())
            .pipe(gulp.dest('./bin'))
    ]);
});

gulp.task('clean-def', function(){
    return gulp.src('./bin/tmp.turbopixi.d.ts', {read: false})
        .pipe(clean());
});

gulp.task('watch', function(){
    return gulp.src('./src/**/*.ts')
        .pipe(watch('./src/**/*.ts', function(){
            gulp.start('compile');
        }));
});



//private tasks to watch my custom changes at pixi definitions
gulp.task('watch-defs', function(){
    gulp.watch('../pixi-typescript/pixi.js.d.ts', ['get-defs']);
});

gulp.task('get-defs', function(){
    return gulp.src('../pixi-typescript/pixi.js.d.ts')
        .pipe(gulp.dest('./defs/'));
});
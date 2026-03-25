const gulp = require('gulp');

const fileInclude = require('gulp-file-include');
const htmlclean = require('gulp-htmlclean');
const webpHTML = require('gulp-webp-html');

const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const csso = require('gulp-csso');

const webpack = require('webpack-stream');
const babel = require('gulp-babel');

const imageMin = require('gulp-imagemin');
const webp = require('gulp-webp');

const changed = require('gulp-changed');

const browserSync = require('browser-sync').create();

const clean = require('gulp-clean');

const fs = require('fs');
const { DESTRUCTION } = require('dns/promises');

gulp.task('html:docs', function() {
    return gulp.src('./src/html/*.html')
        .pipe(changed('./docs/'))
        .pipe(fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(webpHTML())
        .pipe(htmlclean())
        .pipe(gulp.dest('./docs/'))
});

gulp.task('sass:docs', function() {
    return gulp.src('./src/scss/*.scss')
        .pipe(changed('./docs/css/'))
        .pipe(sourcemaps.init())
        .pipe(autoprefixer())
        .pipe(sass())
        .pipe(csso())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./docs/css/'));
});

gulp.task('scripts:docs', function() {
    return gulp.src('src/js/*.js')
        .pipe(changed('./docs/js/'))
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(webpack(require('../webpack.config.js')))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./docs/js/'));
});

gulp.task('images:docs', function() {
    return gulp.src('./src/img/**/*')
        .pipe(changed('./docs/img/'))
        .pipe(webp())
        .pipe(gulp.dest('./docs/img/'))

        .pipe(gulp.src('./src/img/**/*'))
        .pipe(changed('./docs/img/'))
        .pipe(imageMin({ verbose:true }))
        .pipe(gulp.dest('./docs/img/'))
});

gulp.task('fonts:docs', function() {
    return gulp.src('./src/fonts/**/*')
        .pipe(changed('./docs/fonts/'))
        .pipe(gulp.dest('./docs/fonts/'));
});

gulp.task('files:docs', function() {
    return gulp.src('./src/files/**/*')
        .pipe(changed('./docs/files/'))
        .pipe(gulp.dest('./docs/files/'));
});

gulp.task('server:docs', function() {
    browserSync.init({
        server: {
        baseDir: "./docs"
        },
        port: 3000,
        open: true,
        notify: false
    });
});

gulp.task('clean:docs', function (done) {
    if(fs.existsSync('./docs/')) {
        return gulp.src('./docs', {read: false})
        .pipe(clean());
    }
    done();
});
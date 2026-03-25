const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');

const webpack = require('webpack-stream');
const babel = require('gulp-babel');

const imageMin = require('gulp-imagemin');

const changed = require('gulp-changed');

const browserSync = require('browser-sync').create();

const clean = require('gulp-clean');

const fs = require('fs');
const { DESTRUCTION } = require('dns/promises');

gulp.task('html:dev', function() {
    return gulp.src('./src/html/*.html')
        .pipe(changed('./build/'), {hasChanged: changed.compareContents})
        .pipe(fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('./build/'))
});

gulp.task('sass:dev', function() {
    return gulp.src('./src/scss/*.scss')
        .pipe(changed('./build/css/'))
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./build/css/'));
});

gulp.task('scripts:dev', function() {
    return gulp.src('src/js/*.js')
        .pipe(changed('./build/js/'))
        .pipe(sourcemaps.init())
        // .pipe(babel({
        //     presets: ['@babel/preset-env']
        // }))
        .pipe(webpack(require('./../webpack.config.js')))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./build/js/'));
});

gulp.task('images:dev', function() {
    return gulp.src('./src/img/**/*')
        .pipe(changed('./build/img/'))
        // .pipe(imageMin({ verbose:true }))
        .pipe(gulp.dest('./build/img/'));
});

gulp.task('fonts:dev', function() {
    return gulp.src('./src/fonts/**/*')
        .pipe(changed('./build/fonts/'))
        .pipe(gulp.dest('./build/fonts/'));
});

gulp.task('files:dev', function() {
    return gulp.src('./src/files/**/*')
        .pipe(changed('./build/files/'))
        .pipe(gulp.dest('./build/files/'));
});

gulp.task('server:dev', function() {
    browserSync.init({
        server: {
        baseDir: "./build"
        },
        port: 3000,
        open: true,
        notify: false
    });
});

gulp.task('clean:dev', function (done) {
    if(fs.existsSync('./build/')) {
        return gulp.src('./build', {read: false})
        .pipe(clean());
    }
    done();
});

gulp.task('watch:dev', function() {
    gulp.watch('./src/scss/**/*.scss', gulp.parallel('sass:dev'));
    gulp.watch('./src/**/*.html', gulp.parallel('html:dev'));
    gulp.watch('./src/js/**/*.js', gulp.parallel('scripts:dev'));
    gulp.watch('./src/img/**/*', gulp.parallel('images:dev'));
    gulp.watch('./src/fonts/**/*', gulp.parallel('fonts:dev'));
    gulp.watch('./src/files/**/*', gulp.parallel('files:dev'));
});
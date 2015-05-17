'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var wrench = require('wrench');
var $ = {}; //loaded additional gulp files

wrench.readdirSyncRecursive('./gulp').filter(function(file) {
    gutil.log(file);
    return (/\.(js)$/i).test(file);
}).map(function(file) {
    require('./gulp/' + file)(gulp);
});

//gulp.task('dafault',function(){
//   return gutil.log('gulp is running');
//});
//
//gulp.task('copy-osx-resource',function(){
//    return gulp.src('src/app/**/*')
//        .pipe(gulp.dest('dist/Electron.app/Contents/Resources/default_app'));
//});
//
//gulp.task('build-osx', function(){
//    return gulp.src('.electrons/Electron.app/**/*')
//        .pipe(gulp.dest('dist/Electron.app'));
//});
//
//gulp.task('copy-linux-resource',function(){
//    gutil.log('copy linux resource');
//});
//
//gulp.task('build-linux',['copy-linux-resource'],function(){
//    gutil.log('build-linux');
//});
//
//gulp.task('copy-win-resource',function(){
//    gutil.log('copy win resource');
//});
//
//gulp.task('build-win',['copy-win-resource'],function(){
//    gutil.log('build-win');
//});
//
//gulp.task('build-clean',function(){
//    return gutil.log('build elecgron folder clean and delete all file ');
//});
//
//gulp.task('build-all',['build-osx','build-win','build-linux']);

#!/usr/bin/env node

var config = require('../config.json');
// maintainer note - update this manually when doing new releases:
var version = config.version;
var fs = require('fs');
var xfs = require('fs-extra');
var os = require('os');
var path = require('path');
var extract = require('extract-zip');
var download = require('electron-download');
var runSequence = require('gulp-run-sequence');
var platform = os.platform();

function onerror (err) {
    throw err
}

var paths = {
    darwin: path.join(__dirname, '../.electrons/osx/Electron.app/Contents/MacOS/Electron'),
    linux: path.join(__dirname, '../.electrons/linux/electron'),
    win32: path.join(__dirname, '../.electrons/win32/electron.exe')
};

//if (!paths[platform]) throw new Error('Unknown platform: ' + platform)

// downloads if not cached
//download({version: version}, extractFile);

// unzips and makes path.txt point at the correct executable
function extractFile (err, zipPath) {
    if (err) return onerror(err)
    fs.writeFile(path.join(__dirname, 'path.txt'), paths[platform], function (err) {
        if (err) return onerror(err)
        //extract(zipPath, {dir: path.join(__dirname, '../.electrons')}, function (err) {
        extract(zipPath, {dir: path.join(__dirname, config[platform].downloadPath)}, function (err) {
            if (err) return onerror(err)
            fileCopy(config[platform]);
        })
    })

}

function fileCopy(osType){
    xfs.ensureDir('dist',function(err){
        if(err) return console.log(err);
    })
    xfs.copy(osType.filepath.toString() ,osType.destpath.toString(),'-r',function(err){
        if(err)return console.log(err);
        //일렉트론을 다운로드 받았을 때에 리소스 파일 복사.
        appResource(osType);
    });
}

function appResource(osType){
    xfs.copy('./src/app',osType.resource.toString(),function(err){
        if(err)return console.log(err);
    });
}

module.exports = function(gulp,gulpsync){
    gulp.task('download-win-binary',function(){
        platform="win32";
        download({version: version, platform: 'win32'}, extractFile);
    });

    gulp.task('download-osx-binary',function(){
        platform="darwin";
        download({version: version, platform: 'darwin'}, extractFile);
    });

    gulp.task('download-linux-binary',function(){
        platform="linux";
        download({version: version, platform: 'linux'}, extractFile);
    });

    gulp.task('build-osx',function(){
        runSequence('download-osx-binary',function(){
            appResource(config[platform]);
        });
    });

    gulp.task('build-linux',function(){
        runSequence('download-linux-binary',function(){
            appResource(config[platform]);
        });
    });

    gulp.task('build-win',function(){
        runSequence('download-win-binary',function(){
            appResource(config[platform]);
        });
    });

    gulp.task('build-all',function(){
        console.log('1');
        runSequence('build-osx','build-linux','build-win',function(err){
           if(err)return console.log(err);
            console.log('all binary build done');
        });
    });
}
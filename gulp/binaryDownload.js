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
    darwin: path.join(__dirname, '../.electrons/Electron.app/Contents/MacOS/Electron'),
    linux: path.join(__dirname, '../.electrons/electron'),
    win32: path.join(__dirname, '../.electrons/electron.exe')
};

//if (!paths[platform]) throw new Error('Unknown platform: ' + platform)

// downloads if not cached
//download({version: version}, extractFile);

// unzips and makes path.txt point at the correct executable
function extractFile (err, zipPath) {
    console.log('3');
    if (err) return onerror(err)
    fs.writeFile(path.join(__dirname, 'path.txt'), paths[platform], function (err) {
        if (err) return onerror(err)
        extract(zipPath, {dir: path.join(__dirname, '../.electrons')}, function (err) {
            if (err) return onerror(err)
            fileCopy(config[platform]);
        })
    })

}

//module.exports={
//    //download all kind of os Binary - 모든 운영체제의 바이너리를 다운로드 한다.
//    downloadAllBin:function downloadAllBin() {
//        download({version: version, platform: 'win32'}, extractFile);
//        //download({version: version, platform: 'darwin'}, extractFile);
//        //download({version: version, platform: 'linux'}, extractFile);
//    },
//
//    //download one kind of os Binary - 한종류의 바이너리를 다운로드 한다.
//    downloadBin:function downloadBin(osType){
//        if(osType === '' || osType != null){
//            download({version: version, platform: osType}, extractFile(osType));
//        }
//    }
//}
function fileCopy(osType){
    console.log('4');
    console.log('file copy function');
    xfs.ensureDir('dist',function(err){
        if(err) return console.log(err);
        console.log('makeDir success!');
    })
    xfs.copy(osType.filepath.toString() ,osType.destpath.toString(),'-r',function(err){
        if(err)return console.log(err);
        console.log('electron copy done');
        //일렉트론을 다운로드 받았을 때에 리소스 파일 복사.
        appResource(osType);
    });
}

function appResource(osType){
    xfs.copy('./src/app',osType.resource.toString(),function(err){
        if(err)return console.log(err);
        console.log('resource copy done');
    });
}

module.exports = function(gulp,gulpsync){
    gulp.task('download-win-binary',function(){
        console.log('download-win-binary');
        download({version: version, platform: 'win32'}, extractFile);
    });

    gulp.task('download-osx-binary',function(){
        console.log('download-osx-binary');
        download({version: version, platform: 'darwin'}, extractFile);
    });

    gulp.task('download-linux-binary',function(){
        console.log('download-linux-binary');
        download({version: version, platform: 'linux'}, extractFile);
    });

    gulp.task('build-osx',function(){
        console.log('1');
        runSequence('download-osx-binary',function(){
            appResource(config[platform]);
        });
    });
}
const shelljs = require('shelljs');

copyProject();

function copyProject() {
    shelljs.rm('-rf', ['./dist/assets/','./dist/config/','./dist/css/','./dist/scripts/']);
    shelljs.mkdir('-p', './dist');
    shelljs.cp('-rf', './assets', './dist/assets');
    shelljs.cp('-rf', './config', './dist/config');
    shelljs.cp('-rf', './css', './dist/css');
    shelljs.cp('-rf', './scripts', './dist/scripts');
    shelljs.cp('-f', './index.html', './dist');
}

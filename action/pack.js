var lights = require("../lights.js");
var util = require("../lib/util.js");
var exec = require('child_process').exec;
var fs = require("fs");


var NpmStrategy = require(__dirname + "/../node_modules/pac/lib/npm/strategy"),
    RepoClient = require("fis-repo-client"),
    client = new RepoClient(lights.config.get('repos')),
    AdmZip = require('adm-zip');

exports.name = 'pack';
exports.usage = [
    '',
    '',
    '  lights pack'
].join('\n');

exports.register = function(commander){
    commander
        .action(function(){
            var dir = process.cwd();
            exec('npm shrinkwrap', function (error, stdout, stderr) {
                if (error !== null) {
                    client.util.log("error", 'npm shrinkwrap error！please make sure all modules are set in package.json. error detail:' + error, "red", true);
                }else{                 
                    packModule(dir);
                }
            });
        });
};

//打包模块，直接调用node-pac源文件
function packModule(dir){
    var strategy = new NpmStrategy({
        mode: 'production',
        verbose: false
    });
    strategy.pack(null,function(){
        var zip = new AdmZip();
        var moduleDir = dir+"/.modules";
        if(util.exists(moduleDir)){
            zip.addLocalFolder(moduleDir);
            zip.writeZip(dir+"/modules.zip");
            util.del(moduleDir);
        }else{
            client.util.log("error", 'can not found node pack result(.modules)', "red", true);
        }   
    });
    
}

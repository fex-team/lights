var lights = require("../lights.js");
var util = require("../lib/util.js");
var exec = require('child_process').exec;
var fs = require("fs");

var NpmStrategy = require(__dirname + "/../node_modules/pac/lib/npm/strategy"),
    RepoClient = require("fis-repo-client"),
    client = new RepoClient(lights.config.get('repos')),
    AdmZip = require('adm-zip');

exports.name = 'build';
exports.usage = [
    '',
    '',
    '   lights build',
    ''
].join('\n');

exports.register = function(commander){
    commander
        .option('--force', 'Publish an exist version component', Boolean)
        .action(function(){
            var dir = process.cwd(),
            options = {
                force : commander.force
            };
            buildModule(dir);
        });
};

//重新编译模块
function buildModule(dir){
    var moduleDir = dir+"/node_modules";
    var zipFile = dir + "/modules.zip";
    util.del(moduleDir);
    util.mkdir(moduleDir);

    if(util.exists(zipFile)){
        //解压缩文件之后使用node-pac install安装模块，然后使用npm rebuild重新编译
        var zip = new AdmZip(zipFile);
        zip.extractAllTo(dir + "/.modules", true);
        var strategy = new NpmStrategy({
            mode: 'production',
            verbose: false
        });

        strategy.install(function(){
            util.del(dir + "/.modules");
            exec('npm rebuild', function (error, stdout, stderr) {
                if (error !== null) {
                    client.util.log("error", "npm rebuild error:" +  error, "red", true);
                }else{
                    console.log("node_modules rebuild success!");
                }
            }); 
        })
    }else{
        client.util.log("error", "can not found modules.zip file", "red", true);
    }  
}

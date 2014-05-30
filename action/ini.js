var lights = require('../lights.js');
var RepoClient = require("fis-repo-client"),
    client = new RepoClient(lights.config.get('repos'));

var initJson = require("init-package-json");

exports.name = 'ini';
exports.desc = 'Interactively create a package.json file';
exports.usage = [
    '',
    'lights ini',
    'Interactively create a package.json file',
    ''
].join('\n');


exports.register = function(commander){
    commander.action(function(){
        var initFile = require.resolve('../lib/init-module.js');
        var dir = process.cwd();

        initJson(dir, initFile, function (error, data) {
            if(error){
                client.util.log("error", "Add package.json failed: " + error, "red");
            }else{
                client.util.log("log", "Add package.json success! ", "green");
            }
        });
    });
};

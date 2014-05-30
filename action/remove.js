var lights = require("../lights.js"),
    RepoClient = require("fis-repo-client"),
    client = new RepoClient(lights.config.get('repos')),
    CONFIG_FILE = "package.json";

exports.name = 'remove';
exports.desc = 'remove pkg of light';
exports.usage = [
    '',
    '',
    '    lights remove <pkg>',
    ''
].join('\n');

exports.register = function(commander){
    commander.action(function(){
        var args = Array.prototype.slice.call(arguments);
        if(args.length >= 1 && typeof args[0] == "string"){
            var pkg = args[0];
            var version = 'latest';
            var index = args[0].indexOf('@');
            if(index > 0){
                pkg = args[0].slice(0, index);
                version = args[0].slice(index+1);
            }
            var dir = lights.util.realpath(process.cwd());
            var pkgDir = dir + '/' + pkg;
            if(lights.util.isDir(pkgDir)){
                var ret = lights.util.del(pkgDir);
                if(ret){
                    client.util.log("log", "Remove success : Remove [" + pkg +'] success', "green");
                }else{
                    client.util.log("error", "Remove error : Remove [" + pkg +'] failed', "red");
                }
            }else{
                client.util.log("notice", "Remove notice : [" + pkg  +"] does not exists!", "yellow");
            }
        }else{
            commander.help();
        }
    });
};
var lights = require("../lights.js"),
    RepoClient = require("fis-repo-client"),
    client = new RepoClient(lights.config.get('repos')),
    install = require('./install.js');

exports.name = 'update';
exports.desc = 'update pkg of light';
exports.usage = [
    '',
    '',
    '    lights update <pkg>',
    ''
].join('\n');

exports.register = function(commander){
    commander.action(function(){
        var args = Array.prototype.slice.call(arguments);
        if(args.length >= 1 && typeof args[0] == "string"){
            var options = {
                overwrite : true
            };
            install.installPkg(args[0], commander, options);
        }else{
            commander.help();
        }
    });
};
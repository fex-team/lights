var lights = require("../lights.js"),
    RepoClient = require("fis-repo-client"),
    path = require('path'),
    async = require('async'),
    fs = require('fs'),
    CONFIG_FILE = "package.json",
    DEFAULT_OPTION = {
        deps : true,
        overwrite : false
    };

    exports.name = 'install';
    exports.usage = [
        '',
        '',
        '    lights install',
        '    lights install <pkg>',
        '    lights install <pkg>@<version>'
    ].join('\n');

    exports.desc = 'install components and demos';

    exports.register = function(commander){
        commander
            .option("--repos <url>", "repository")
            .action(function(){
                var args = Array.prototype.slice.call(arguments);
                if(args.length >= 1 && typeof args[0] == "string"){
                    install(args[0], commander, DEFAULT_OPTION);
                }else{
                    installDeps(commander, DEFAULT_OPTION);
                }
            });
};

exports.installPkg = function(info, commander, options){
    options = lights.util.merge(DEFAULT_OPTION, options);
    install(info, commander, options);
};

function install(componentInfo, commander, options){
    var client = new RepoClient(commander.repos || lights.config.get('repos'));
    var dir = lights.util.realpath(process.cwd());
    var component = {
        name : componentInfo,
        version : "latest"
    };
    if(componentInfo.indexOf("@") > 0){
        var infos = componentInfo.split("@");
        component.name = infos[0];
        component.version = infos[1];
    }
    client.install(dir, component, options, function(error, result){
        if(error){
            client.util.log("error", "Install failed : Install [" + component.name + '@' + component.version +"] failed", "red");
        }else{
            client.util.log("log", "Install success : Install [" + component.name + '@' + component.version +"] success", "green");
        }
    });
};

function installDeps(commander, options){
    var client = new RepoClient(commander.repos || lights.config.get('repos'));
    var dir = lights.util.realpath(process.cwd());
    var installDir = path.dirname(dir),
        configFile = dir + "/" + CONFIG_FILE;
    if(client.util.isFile(configFile)){
        var jsonObj = client.util.readJSON(configFile);
        var component = {
            name : jsonObj.name,
            version : jsonObj.version
        };
        client.installDeps(installDir, component, options, function(err, result){
            if(err){
                client.util.log("log", "Install failed : Install dependencies failed", "red");
                client.util.log("log", err, 'white');
            }else{
                client.util.log("log", "Install success : Install dependencies success", "green");
            }
        });
    }else{
        client.util.log("log", "package.json do not exist", "white");
    }
};


  
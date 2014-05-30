
var lights = require("../lights.js"),
    RepoClient = require("fis-repo-client"),
    client = new RepoClient(lights.config.get('repos')),
    CONFIG_FILE = "package.json";

exports.usage = [
    '',
    '',
    '    lights owner add <username> <pkg>',
    '    lights owner rm  <username> <pkg>',
    '    lights owner ls  <pkg>'
].join('\n');

exports.desc = 'change ownership of resource';

exports.register = function owner(commander){
    commander
    .action(function(){
        var args = Array.prototype.slice.call(arguments);
        var op_type = args[0],
        pkg = {
            name : null,
            version : "latest"
        },
        options = {
            op_type : op_type
        },
        pkgJson = process.cwd() + "/" + CONFIG_FILE;

        switch(op_type){
            case "rm":
            case "add":
                if(args.length == 3){
                    options.username = args[1];
                    if(lights.util.isFile(pkgJson)){
                        var config = lights.util.readJSON(pkgJson);
                        pkg.name = config.name;
                    }else{
                        client.util.log("error", "Owner " + op_type + " error : missing param", "red", true);
                    }
                }else if(args.length > 3){
                    options.username = args[1];
                    pkg.name = args[2];
                }else{
                    client.util.log("error", "Owner " + op_type + " error : missing param", "red", true);
                }
                break;
            case "ls":
                if(args.length  == 2){
                    if(lights.util.isFile(pkgJson)){
                        var config = lights.util.readJSON(pkgJson);
                        pkg.name = config.name;
                    }else{
                        client.util.log("error", "Owner " + op_type + " error : missing param", "red", true);
                    }
                }else if(args.length >= 3){
                    pkg.name = args[1];
                }else{
                    client.util.log("error", "Owner " + op_type + " error : missing param", "red", true);
                }
                break;
            default:
                commander.help();
                break;
        }

        client.owner(op_type, pkg, options, function(error, message){
            if(error){
                client.util.log("error", "Owner " + op_type + " error : " + error, "red");
            }else{
                client.util.log("log", "Owner " + op_type + " success" + message, "green");
            }
        });

    });
   
};

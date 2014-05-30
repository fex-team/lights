var lights = require("../lights.js"),
    RepoClient = require("fis-repo-client"),
    client = new RepoClient(lights.config.get('repos'));

exports.name = 'publish';
exports.usage = [
    '',
    '',
    '   lights publish',
    '',
    '   Notice: publish ./ directory which must has package.json file'
].join('\n');

exports.register = function(commander){
    commander
        .option('--force', 'Publish an exist version component', Boolean)
        .action(function(){
            var dir = process.cwd(),
            options = {
                force : commander.force
            };
            var username = client.conf.get("username");
            if(username){
                //有用户 publish directly
                client.publish(dir, options, cb);
            }else{
                //没有用户 adduser
                client.util.log("log", "You have to adduser first.\n", "yellow");
                commander.prompt("Input Username: ", function(name){
                    commander.password("Input Password: ", '*', function(password){
                        commander.prompt("Input Email: ", function(email){
                            client.adduser(name, password, email, function(error, message){
                                if(error){
                                    client.util.log("error", "Adduser error : " + error, "red", true);
                                }else{
                                    client.util.log("log", "Adduser success : " + message, "green");
                                    client.publish(dir, options, cb);
                                }
                            });
                        });
                    });
                });
            }
        });
};

function cb(e, m){
    if(e){
        client.util.log("error", "Publish error : " + e, "red", true);
    }else{
        client.util.log("log", "Publish success : " + m, "green", true);
    }    
}


var lights = require('../lights.js');
    RepoClient = require("fis-repo-client"),
    client = new RepoClient(lights.config.get('repos'));


exports.name = 'config';
exports.desc = 'edit config of light';
exports.usage = [
    '',
    '',
    '   lights config set <key> <value>',
    '   lights config get [<key>]',
    '   lights config ls',
    '',
    '   key includes: repos, username, email',
    ''
].join('\n');

exports.configKeys = [
    'repos'
];

function getAllConf(){
    var conf = client.conf.getAll();
    var r = [];
    for(var i in conf){
        if(i != '_auth'){
            r.push(i + ': ' + conf[i]);
        }
    }
    return r.join('\n');
};

exports.register = function(commander){
    commander.action(function(){
        var args = Array.prototype.slice.call(arguments);
        var action = args[0];
        switch (action){
            case 'set':
                var key = args[1],
                    value = args[2];
                if(lights.util.is(key, 'String') && lights.util.is(value, 'String')){
                    if(!client.util.in_array(key, exports.configKeys)){
                        client.util.log('error', 'Sorry, Set invalid config. the valid config include: ' + exports.configKeys.join(', '), 'red');
                    }else{
                        var obj = {};
                        obj[key] = value;
                        client.conf.setConf(obj);
                        client.util.log('log', 'Set config [' + key + ": " + value + '] success!', 'green');
                    }
                }else{
                    client.util.log("error", exports.usage, "");
                }
                break;
            case 'get':
                var key = args[1];
                if(lights.util.is(key, 'String')){
                    client.util.log('log', key + ': ' + (client.conf.get(key) || 'null'), 'yellow');
                }else{
                    client.util.log("log", exports.usage, '');
                }
                break;
            case 'ls' :
                client.util.log('log', getAllConf() || 'null', 'yellow');
                break;
            default :
                commander.help();
                break;
        };
    });
};

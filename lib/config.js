var ini = require('ini'),
    path = require('path'),
    fs = require('fs');

var join = path.join,
    exists = fs.existsSync || path.existsSync,
    win = process.platform === "win32",
    home = win ? process.env.USERPROFILE : process.env.HOME,
    rc_file = join(home, '.fisrc');

var DEFAULT_REPOS = 'http://lightjs.duapp.com';

function mkdir(path, mode){
    if (typeof mode === 'undefined') {
        //511 === 0777
        mode = 511 & (~process.umask());
    }
    if(exists(path)) return;
    path.split('/').reduce(function(prev, next) {
        if(prev && !exists(prev)) {
            fs.mkdirSync(prev, mode);
        }
        return prev + '/' + next;
    });
    if(!exists(path)) {
        fs.mkdirSync(path, mode);
    }
}

function write(filename, data){
    if(!exists(filename)){
        mkdir(path.dirname(filename));
    }
    fs.writeFileSync(filename, data, null);
}

var config = null;
if(exists(rc_file)){
    config = ini.parse(fs.readFileSync(rc_file, 'utf-8'));
}else{
    config = null;
}
exports.getAll = function(){
    if(config){
        return config;
    }
    return null;
};

exports.get = function(key){
    if(key == 'repos'){
        return getRepos();
    }
    if(config){
        return config[key];
    }
    return null;
};

function getRepos(){
    var key = 'repos';
    if(config && config[key]){
        return config[key];
    }else{
        return DEFAULT_REPOS;
    }
    return null;
};

exports.set = function(values){
    if(!config){
        config = {};
    }
    for(var key in values){
        if(!values.hasOwnProperty(key)) continue;
        config[key] = values[key];
    }
    write(rc_file, ini.stringify(config));
};

'use strict';

var lights = module.exports;

lights.util = require('./lib/util.js');

lights.log = require('./lib/log.js');

lights.config = require('./lib/config.js');

lights.cli = {};
lights.cli.info = lights.util.readJSON(__dirname + '/package.json');
lights.cli.name = 'lights';
lights.cli.color = require('colors');

lights.cli.commander = null;

lights.cli.help = function(){
     var content = [
            '',
            '  Usage: ' + lights.cli.name + ' <command>',
            '',
            '  Commands:',
            '',
            '       install      install resource from lights',
            '       search       search resource of lights',
            '       adduser      add user of lights',
            '       publish      publish resource to lights',
            '       unpublish    remove resource to lights',
            '       update       update resource to latest version',
            '       remove       remove resource of lights',
            '       owner        change ownership of resource',
            '       config       set or get config of lights',
            '       pack         pack node_modules and lock version',
            '       build        rebuild node_modules',
            '       ini          create a package.json file'
        ];
    content = content.concat([
            '',
            '  Options:',
            '',
            '       -h, --help     output usage information',
            '       -v, --version  output the version number',
            ''
    ]);
    console.log(content.join('\n'));
};

lights.cli.version = function(){
    var content = [
        '',
        '  v' + lights.cli.info.version,
        ''
    ].join('\n');
    console.log(content);
};

lights.require = function(path, cliName){
    try {
        return require(path);
    } catch(e) {
        lights.cli.help();
        e.message = 'lights do not support command [' + cliName + ']';
        lights.log.error(e);
    }
};

//run cli tools
lights.cli.run = function(argv){
    var first = argv[2];
    if(argv.length < 3 || first === '-h' ||  first === '--help'){
        lights.cli.help();
    } else if(first === '-v' || first === '--version'){
        lights.cli.version();
    }else if(first[0] === '-'){
        lights.cli.help();
    } else {
        //register command
        var commander = lights.cli.commander = require('commander'),
            path = './action/' + argv[2] + '.js';

        var cmd = lights.require(path, argv[2]);
            cmd.register(
                commander
                    .command(cmd.name || first)
                    .usage(cmd.usage)
                    .description(cmd.desc)
            );
            commander.parse(argv); 
    }
};



var fs = require('fs');
var path = require('path');

exports.name = prompt('name', package.name || basename);
exports.version = prompt('version', package.version || '0.0.0');

if (!package.description) {
    exports.description = prompt('description')
}

if (!package.repository) {
    exports.repository = function (cb) {
        fs.readFile('.git/config', 'utf8', function (er, gconf) {
            if (er || !gconf) return cb(null, prompt('git repository'))

            gconf = gconf.split(/\r?\n/)
            var i = gconf.indexOf('[remote "origin"]')
            if (i !== -1) {
                var u = gconf[i + 1]
                if (!u.match(/^\s*url =/)) u = gconf[i + 2]
                if (!u.match(/^\s*url =/)) u = null
                else u = u.replace(/^\s*url = /, '')
            }
            if (u && u.match(/^git@github.com:/))
                u = u.replace(/^git@github.com:/, 'git://github.com/')

            return cb(null, prompt('git repository', u))
        })
    }
}

if (!package.keywords) {
    exports.keywords = prompt('keywords', function (s) {
        if (!s) return undefined
        if (Array.isArray(s)) s = s.join(' ')
        if (typeof s !== 'string') return s
        return s.split(/[\s,]+/)
    })
}

exports.license = prompt('license', 'MIT');

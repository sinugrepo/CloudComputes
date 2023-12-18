const fs            = require('fs')
const path          = require('path')
const parseName     = require('../helpers/parse-basename')
const middleware    = {}
const currDir       = process.cwd()

fs.readdirSync(currDir + '/middlewares').forEach(file => {
    let extname   = path.extname(file)
    let basename  = path.basename(file, extname)

    if (~file.indexOf('.js') && basename !== 'index') {
        middleware[parseName(basename)] = require(currDir + '/middlewares/' + basename)
    }
})

module.exports = {
    ...middleware
}

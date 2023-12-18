const fs            = require('fs')
const path          = require('path')
const parseName     = require('../helpers/parse-basename')
const controllers   = {}
const currdir       = process.cwd()

fs.readdirSync(currdir + '/controllers').forEach(file => {
    let extname   = path.extname(file)
    let basename  = path.basename(file, extname)
    
    if (~file.indexOf('.js') && basename !== 'index') {
        controllers[parseName(basename)] = require(currdir + '/controllers/' + basename)
    }
})

module.exports = {
    ...controllers
}

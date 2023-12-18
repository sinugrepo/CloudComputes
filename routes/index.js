const fs    = require('fs')
const path  = require('path')

module.exports = (app) => {
    const currDir = process.cwd()
    
    fs.readdirSync(currDir + '/routes').forEach((file) => {
        let extname     = path.extname(file)
        let basename    = path.basename(file, extname)
        
        if (~file.indexOf('.js') && basename !== 'index') {
            app.use('/' + basename, require(currDir + '/routes/' + file))
        }
    })
}

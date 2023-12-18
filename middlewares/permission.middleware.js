const _         = require('lodash');
const fs        = require('fs');
const axios     = require('axios');
const jwt       = require('jsonwebtoken');
const Logger    = require('../utils/Logger');

// method : read, create, update, delete
module.exports = function permissionMiddleware(path, method, key = null) {
    return async function (req, res, next) {
        try {
            return next();
            
            const { aid }       = req.headers;
            const currDir       = process.cwd()
            const authKey       = fs.readFileSync(currDir + '/auth.pem');
            const accessToken   = jwt.sign({aid: aid, svc: 'USRSVC'}, authKey, {
                expiresIn: 30, // expires in 30 seconds
                algorithm: 'RS256'
            });
            
            // change method for update
            if (method.toLowerCase() === 'create') {
                key     = _.isEmpty(key) ? 'id' : key;
                if (typeof req.body[key] !== 'undefined') {
                    method  = 'update';
                }
            }
            
            let response = await axios.get(`${CONFIG.AUTH_SERVICE}/permissions/access`, {
                headers: {
                    Authorization: accessToken,
                    path: path,
                    access: method
                }
            });
            next();
            if (response.data) {
                if (typeof response.data.acknowledge !== 'undefined' && response.data.acknowledge === true) {
                    if (typeof response.data.result !== 'undefined') {
                        if (response.data.result.access !== 'undefined' && response.data.result.access === true){
                            next();
                        } else {
                            let err         = new Error(`Info : You don't have an access for this resources - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                                err.code    = 401
                            next(err);
                        }
                    } else {
                        let err = new Error(`Error : You don't have an access for this resources - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                            err.code = 401
                        next(err);
                    }
                } else {
                    let err         = new Error(`Error : You don't have an access for this resources - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                        err.code    = 401
                    next(err);
                }
            } else {
                let err         = new Error(`Error : You don't have an access for this resources - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                    err.code    = 401
                next(err);
            }
        } catch (error) {
            let err         = new Error(error.message);
                err.code    = 500;
            next(err);
        }
    }
}
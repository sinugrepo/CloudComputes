const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Logger = require('../utils/Logger');
const parseValidator = require('../helpers/parse-validator');
const ValidationMiddleware = {}

ValidationMiddleware.validation = (req, res, next) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        Logger.info(`  ├── Error : validation`);

        let validator = parseValidator(errors.array());
        let message = typeof validator.messages == 'string' ? validator.messages : 'Something went wrong';
        let result = typeof validator.result != 'undefined' ? validator.result : 'Something went wrong';

        let error = new Error(message);
        error.validation = validator;

        next(error);
    } else {
        next();
    }
}

ValidationMiddleware.authorization = async (req, res, next) => {
    try {
        // const decode = jwt.decode(req.headers.authorization, { algorithm: 'RS256' });
        // jwt.verify(req.headers.authorization, keys[decode.aid], { algorithm: 'RS256' });

        // req.headers['aid'] = decode.aid;
        // req.headers['uid'] = decode.uid;

        next();
    } catch (error) {
        let err = new Error('Your token is invalid, please try again with different token!')
        err.code = 401;
        next(err);
    }
}

module.exports = ValidationMiddleware;
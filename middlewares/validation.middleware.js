const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Logger = require('../utils/Logger');
const parseValidator = require('../helpers/parse-validator');
const firebaseAdmin = require('../helpers/firebase-admin')
const UserModel = require('../models/user.model');

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
        const { authorization } = req.headers
        let message = ''
        let code = 401
        let acknowledge = false

        try {
            if (!authorization) {
                message = 'There is no token given'
            } else {
                const verifiedFirebaseUser = await firebaseAdmin.auth().verifyIdToken(authorization, true)
                if (verifiedFirebaseUser) {
                    const currentUser = await UserModel.getBy({
                        condition: [{ key: `uid = '${verifiedFirebaseUser.user_id}'`}],
                        fields: [
                            'user_id',
                            'uid',
                            'email',
                            'password',
                            'provider',
                            'institution_id',
                            'fullname',
                            'phone',
                            'otp',
                            'otp_expired',
                            'verified',
                            'created_at',
                            'updated_at',
                        ],
                    })

                    if (currentUser.verified === 0) {
                        throw { message: 'Your account is not verified, please verify!', code: 'not_verified' }
                    }

                    req.currentUser = currentUser
                    next()
                }
            }
        } catch (error) {
            if (['ERR_INVALID_ARG_TYPE', 'auth/argument-error', 'auth/id-token-expired'].includes(error.code)) {
                message = `Your token is invalid, please try again with different token!`
            } else if (error.code === 'not_verified') {
                message = error.message
            } else {
                console.error('Something went wrong', error)
                message = 'Something went wrong'
                code = 500
            }
        }

        if (message !== '') {
            res.status(code).send({
                message,
                acknowledge,
                data: null
            })
        }
    } catch (error) {
        let err = new Error('Your token is invalid, please try again with different token!')
        err.code = 401;
        next(err);
    }
}

module.exports = ValidationMiddleware;
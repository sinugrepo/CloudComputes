const _ = require('lodash');
const bcrypt = require('bcrypt')
const UserModel = require('../models/user.model');
const InstitutionModel = require('../models/institution.model');
const parseResponse = require('../helpers/parse-response');
const firebaseAdmin = require('../helpers/firebase-admin')
const RegisterController = {}


RegisterController.save = async (req, res, next) => {
    try {
        let {
            fullname,
            email,
            access_code: accessCode,
            phone,
            password,
        } = req.body;

        const getInstitution = await InstitutionModel.getBy({
            condition: [{ key: `access_code = '${accessCode}'` }]
        })

        let acknowledge = false
        let msg = 'access code not found'
        
        const getEmail = await firebaseAdmin.auth().getUserByEmail(email)
        .then((userRecord) => {
            return userRecord
        })
        .catch((error) => {
            console.log(`${error.message} with code : `, error.code)
            return false
        })

        if (!_.isNull(getInstitution) && getEmail === false) {
            const saltRounds = CONFIG.SALT_ROUNDS
            password = await bcrypt.hash(password, saltRounds)
    
            let { uid } = await firebaseAdmin.auth().createUser({
                displayName: fullname,
                email,
                password,
            })

            let data = [
                { key: 'uid', value: uid },
                { key: 'provider', value: 'register' },
                { key: 'email', value: email },
                { key: 'password', value: password },
                { key: 'institution_id', value: getInstitution.institution_id },
                { key: 'fullname', value: fullname },
                { key: 'phone', value: phone },
            ];
            
            const insert = await UserModel.save(data);

            const registerId = insert.insertId
            acknowledge = registerId > 0
            msg = acknowledge ? 'success' : 'failed'
        } else {
            msg = 'email exist'
        }

        parseResponse(res, 200, null, msg, acknowledge);
    } catch (error) {
        let err = new Error(error.message);
        err.code = 500;
        next(err);
    }
}

module.exports = RegisterController;
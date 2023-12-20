const _ = require('lodash');
const UserModel = require('../models/user.model');
const InstitutionModel = require('../models/institution.model');
const parseResponse = require('../helpers/parse-response');
const UserController = {}

UserController.currentUser = async (req, res, next) => {
    try {
        let { uid } = req.currentUser

        const record = await UserModel.getBy({
            condition: [{ jointer: 'AND', key: 'uid', value: uid, op: '=' }],
            fields: ['user_id', 'uid', 'email', 'fullname', 'phone', 'verified', 'users.institution_id', 'institutions.name', 'institutions.access_code'],
            join: ['JOIN institutions ON institutions.institution_id = users.institution_id']
        });
        
        parseResponse(res, 200, _.isEmpty(record) ? {} : record, _.isEmpty(record) ? 'no data found' : 'success');
    } catch (error) {
        let err = new Error(error.message);
        err.code = 500;
        next(err);
    }
}

UserController.update = async (req, res, next) => {
    try {
        let { user_id: userId } = req.currentUser
        let {
            fullname,
            access_code: accessCode,
            phone,
        } = req.body;

        const getInstitution = await InstitutionModel.getBy({
            condition: [{ key: `access_code = '${accessCode}'` }]
        })

        let acknowledge = false
        let msg = 'access code not found'
        if (!_.isNull(getInstitution)) {
            let data = [
                { key: 'institution_id', value: getInstitution.institution_id },
                { key: 'fullname', value: fullname },
                { key: 'phone', value: phone },
            ];
            let condition = [{ key: `user_id = ${userId}` }]
            const update = await UserModel.save(data, condition);

            const registerId = update.affectedRows
            acknowledge = registerId === 1
            msg = acknowledge ? 'success' : 'failed'
        }

        parseResponse(res, 200, null, msg, acknowledge);
    } catch (error) {
        let err = new Error(error.message);
        err.code = 500;
        next(err);
    }
}

module.exports = UserController;
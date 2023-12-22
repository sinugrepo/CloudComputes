const _ = require('lodash');
const bcrypt = require('bcrypt')
const UserModel = require('../models/user.model');
const ComplaintModel = require('../models/complaint.model');
const CategoryModel = require('../models/category.model');
const InstitutionModel = require('../models/institution.model');
const parseResponse = require('../helpers/parse-response');
const otpUtil = require('../utils/OTP')
const firebaseAdmin = require('../helpers/firebase-admin')
const moment = require('moment')
const UserController = {}

UserController.currentUser = async (req, res, next) => {
    try {
        let { uid } = req.currentUser

        const record = await UserModel.getBy({
            condition: [{ jointer: 'AND', key: 'uid', value: uid, op: '=' }],
            fields: ['user_id', 'uid', 'email', 'fullname', 'phone', 'verified', 'users.institution_id', 'institutions.name', 'institutions.access_code'],
            join: ['JOIN institutions ON institutions.institution_id = users.institution_id']
        });
        
        if (record) {
            const totalByCategory = await ComplaintModel.getAll({
                fields: [`COUNT(complaints.complaint_id) AS total`, 'complaints.category_id'],
                condition: [{ jointer: 'AND', key: 'user_id', value: `${record.user_id}`, op: '=' }],
                group: ['complaints.category_id'],
                join: ['JOIN categories ON categories.category_id = complaints.category_id']
            })
            let totalObject = _.keyBy(totalByCategory, 'category_id')
            let total = totalByCategory.map(val => val.total).reduce((a, b) => a + b)
            
            let categories = await CategoryModel.getAll({
                fields: ['category_id', 'name']
            })
            categories = categories.map(val => {
                val.total = typeof totalObject[val.category_id] !== 'undefined' ? totalObject[val.category_id].total : 0

                return val
            })
            
            record.complaint_total = {
                total,
                categories
            }
        }
        
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

UserController.resetPassword = async (req, res, next) => {
    try {
        let { email, password } = req.body

        const user = await UserModel.getBy({
            condition: [
                { jointer: 'AND', key: 'email', value: email, op: '=' },
            ],
            fields: ['user_id', 'uid'],
        });

        let acknowledge = false
        let msg = 'not found'
        if (user) {
            firebaseAdmin.auth().updateUser(user.uid, {
                password
            })

            const passwordHash = await bcrypt.hash(password, CONFIG.SALT_ROUNDS)
            UserModel.save([
                { key: 'password', value: passwordHash },
                { key: 'otp', value: null },
                { key: 'otp_expired', value: null },
            ], [
                { jointer: 'AND', key: 'email', value: email, op: '=' }
            ])

            acknowledge = true
            msg = 'success'
        }

        parseResponse(res, 200, null, msg, acknowledge);
    } catch (error) {
        let err = new Error(error.message);
        err.code = 500;
        next(err);
    }
}

UserController.resetPasswordRequest = async (req, res, next) => {
    try {
        let { email } = req.body

        const user = await UserModel.getBy({
            condition: [
                { jointer: 'AND', key: 'email', value: email, op: '=' },
            ],
            fields: ['verified'],
        });

        let msg = 'not found'
        let ack = false
        if (user && user.verified === 1) {
            const generateOTP = otpUtil.generate()
            const otpExpired = moment().add(3, 'minutes').format('YYYY-MM-DD HH:mm:ss')
            data = [
                { key: 'otp', value: generateOTP },
                { key: 'otp_expired', value: otpExpired },
            ]
            await UserModel.save(data, [
                { jointer: 'AND', key: 'email', value: email, op: '=' }
            ])
    
            const htmlMail = `OTP <b>${generateOTP}</b>`
            otpUtil.sendMail({to: email, html: htmlMail})

            msg = 'success'
            ack = true
        }
        
        parseResponse(res, 200, null, msg, ack);
    } catch (error) {
        let err = new Error(error.message);
        err.code = 500;
        next(err);
    }
}

UserController.resetPasswordVerification = async (req, res, next) => {
    try {
        let { email, otp } = req.body

        const user = await UserModel.getBy({
            condition: [
                { jointer: 'AND', key: 'email', value: email, op: '=' },
            ],
            fields: ['otp', 'otp_expired'],
        });

        let acknowledge = false
        let msg = 'not found'
        let now = moment().format('YYYY-MM-DD HH:mm:ss')
        if (user) {
            let data = []
            if (now > user.otp_expired) {
                msg = 'expired'

                const generateOTP = otpUtil.generate()
                const otpExpired = moment().add(3, 'minutes').format('YYYY-MM-DD HH:mm:ss')
                data = [
                    { key: 'otp', value: generateOTP },
                    { key: 'otp_expired', value: otpExpired },
                ]

                const htmlMail = `OTP <b>${generateOTP}</b>`
                otpUtil.sendMail({to: email, html: htmlMail})
            } else if (otp !== user.otp) {
                msg = 'not matched'
            } else {
                data = [
                    { key: 'otp', value: null },
                    { key: 'otp_expired', value: null },
                ]

                msg = 'success'
                acknowledge = true
            }

            if (data.length > 0) {
                await UserModel.save(data, [
                    { jointer: 'AND', key: 'email', value: email, op: '=' }
                ])
            }
        }

        parseResponse(res, 200, null, msg, acknowledge);
    } catch (error) {
        let err = new Error(error.message);
        err.code = 500;
        next(err);
    }
}

module.exports = UserController;
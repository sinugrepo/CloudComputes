const _ = require('lodash');
const bcrypt = require('bcrypt')
const UserModel = require('../models/user.model');
const InstitutionModel = require('../models/institution.model');
const parseResponse = require('../helpers/parse-response');
const firebaseAdmin = require('../helpers/firebase-admin')
const moment = require('moment')
const otpUtil = require('../utils/OTP')
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
        if (!_.isNull(getInstitution)) {
            const getEmail = await firebaseAdmin.auth().getUserByEmail(email)
            .then((userRecord) => {
                return userRecord
            })
            .catch((error) => {
                console.info(`INFO - ${error.message} with code : `, error.code)
                return false
            })
            let uid = null
            if (getEmail === false) {
                let createUser = await firebaseAdmin.auth().createUser({
                    displayName: fullname,
                    email,
                    password,
                })
                uid = createUser.uid
            } else {
                uid = getEmail.uid
            }

            const generateOTP = otpUtil.generate()
            const otpExpired = moment().add(3, 'minutes').format('YYYY-MM-DD HH:mm:ss')
            const passwordHash = await bcrypt.hash(password, CONFIG.SALT_ROUNDS)

            const user = await UserModel.getBy({
                condition: [
                    { jointer: 'AND', key: 'uid', value: uid, op: '=' },
                ],
                fields: ['verified'],
            });

            if (user && user.verified === 1) {
                msg = 'email exist'
            } else {
                let condition = []
                if (user && user.verified === 0) {
                    condition = [{ key: `email = '${email}'` }]
                }

                let insert = await UserModel.save([
                    { key: 'uid', value: uid },
                    { key: 'provider', value: 'register' },
                    { key: 'email', value: email },
                    { key: 'password', value: passwordHash },
                    { key: 'institution_id', value: getInstitution.institution_id },
                    { key: 'fullname', value: fullname },
                    { key: 'phone', value: phone },
                    { key: 'otp', value: generateOTP },
                    { key: 'otp_expired', value: otpExpired },
                ], condition);

                acknowledge = (insert.insertId > 0) || (insert.affectedRows === 1)
                msg = acknowledge ? 'success' : 'failed'
    
                if (acknowledge > 0) {
                    const htmlMail = `OTP <b>${generateOTP}</b>`
                    otpUtil.sendMail({to: email, html: htmlMail})

                    msg = 'success'
                }
            }
        }

        parseResponse(res, 200, null, msg, acknowledge);
    } catch (error) {
        let err = new Error(error.message);
        err.code = 500;
        next(err);
    }
}

RegisterController.otpVerification = async (req, res, next) => {
    try {
        let { email, otp } = req.body

        const user = await UserModel.getBy({
            condition: [
                { jointer: 'AND', key: 'email', value: email, op: '=' },
            ],
            fields: ['verified', 'otp', 'otp_expired'],
        });

        let acknowledge = false
        let msg = 'not found'
        let now = moment().format('YYYY-MM-DD HH:mm:ss')
        if (user) {
            let data = []
            if (parseInt(user.verified) === 1) {
                msg = 'verified'
            } else if (now > user.otp_expired) {
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
                    { key: 'verified', value: '1' },
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

module.exports = RegisterController;
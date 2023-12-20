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
        
        const getEmail = await firebaseAdmin.auth().getUserByEmail(email)
        .then((userRecord) => {
            return userRecord
        })
        .catch((error) => {
            console.info(`INFO - ${error.message} with code : `, error.code)
            return false
        })

        if (!_.isNull(getInstitution) && getEmail === false) {
            const passwordHash = await bcrypt.hash(password, CONFIG.SALT_ROUNDS)
    
            let { uid } = await firebaseAdmin.auth().createUser({
                displayName: fullname,
                email,
                password,
            })
            // let uid = 'asdasdadasd'

            const generateOTP = otpUtil.generate()
            const otpExpired = moment().add(3, 'minutes').format('YYYY-MM-DD HH:mm:ss')
            let data = [
                { key: 'uid', value: uid },
                { key: 'provider', value: 'register' },
                { key: 'email', value: email },
                { key: 'password', value: passwordHash },
                { key: 'institution_id', value: getInstitution.institution_id },
                { key: 'fullname', value: fullname },
                { key: 'phone', value: phone },
                { key: 'otp', value: generateOTP },
                { key: 'otp_expired', value: otpExpired },
            ];
            
            const insert = await UserModel.save(data);

            const registerId = insert.insertId
            acknowledge = registerId > 0
            msg = acknowledge ? 'success' : 'failed'

            if (registerId > 0) {
                const htmlMail = `OTP <b>${generateOTP}</b>`
                otpUtil.sendMail({to: email, html: htmlMail})
            }
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
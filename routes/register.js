const router = require('express').Router();
const { header, body } = require('express-validator');
const { RegisterController } = require('../controllers');
const { ValidationMiddleware } = require('../middlewares');

router
    .post('/', RegisterController.save)
    .post('/otp-verification', RegisterController.otpVerification)

module.exports = router;
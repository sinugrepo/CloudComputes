const router = require('express').Router();
const UserController = require('../controllers/user.controller');
const ValidationMiddleware = require('../middlewares/validation.middleware');

router
    .post('/reset-password', UserController.resetPassword)
    .post('/reset-password/request', UserController.resetPasswordRequest)
    .post('/reset-password/otp-verification', UserController.resetPasswordVerification)
    .all('/*', ValidationMiddleware.authorization)
    .get('/current-user', UserController.currentUser)
    .put('/', UserController.update)

module.exports = router;
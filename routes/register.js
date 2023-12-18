const router = require('express').Router();
const { header, body } = require('express-validator');
const { RegisterController } = require('../controllers');
const { ValidationMiddleware } = require('../middlewares');

router
    .post('/', RegisterController.save)

module.exports = router;
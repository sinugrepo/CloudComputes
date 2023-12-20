const router = require('express').Router();
const UserController = require('../controllers/user.controller');
const ValidationMiddleware = require('../middlewares/validation.middleware');

router
    .all('/*', ValidationMiddleware.authorization)
    .get('/current-user', UserController.currentUser)
    .put('/', UserController.update)

module.exports = router;
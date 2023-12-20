const router = require('express').Router();
const { header, body } = require('express-validator');
const { CategoryController } = require('../controllers');
const ValidationMiddleware = require('../middlewares/validation.middleware');

const Validation = {
    all: [
        header('authorization')
            .not().isEmpty().withMessage('Invalid param ?')
    ],
    save: [
        body('name')
            .not().isEmpty().withMessage('Invalid param ?')
    ]
};

router
    .all('/*', ValidationMiddleware.authorization)
    .get('/', CategoryController.all)
    .get('/:id', CategoryController.get)
    .post('/', CategoryController.save)
    .delete('/:id', CategoryController.delete)

module.exports = router;
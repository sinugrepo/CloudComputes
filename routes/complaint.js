const router = require('express').Router();
const { header, body } = require('express-validator');
const multer = require('multer')
const path = require('path')

const ComplaintController = require('../controllers/complaint.controller');
const ValidationMiddleware = require('../middlewares/validation.middleware');

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ dest: 'uploads/', storage })

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
    .get('/question', ComplaintController.question)
    .get('/history', ComplaintController.history)
    .get('/leaderboard', ComplaintController.leaderboard)
    .get('/:id', ComplaintController.detail)
    .post('/', upload.single('file'), ComplaintController.save)

module.exports = router;
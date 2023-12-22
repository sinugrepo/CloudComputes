const router = require('express').Router();
const { header, body } = require('express-validator');
const DatasetController = require('../controllers/dataset.controller');

router
    .get('/', DatasetController.all)

module.exports = router;
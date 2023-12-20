const _ = require('lodash');
const slugify = require('slugify');
const CategoryModel = require('../models/category.model');
const parseResponse = require('../helpers/parse-response');
const CategoryController = {}

CategoryController.get = async (req, res, next) => {
    try {
        const { id } = req.params;
        const record = await CategoryModel.getBy([{ jointer: 'AND', key: 'category_id', value: id, op: '=' }], [], [], 1);

        parseResponse(res, 200, _.isEmpty(record) ? {} : record, _.isEmpty(record) ? 'no data found' : 'success');
    } catch (error) {
        let err = new Error(error.message);
        err.code = 500;
        next(err);
    }
}

CategoryController.all = async (req, res, next) => {
    try {
        let { page, limit, keyword } = req.query;
        let condition = [];

        page = _.isEmpty(page) ? 1 : page;
        limit = _.isEmpty(limit) ? 15 : limit;
        if (!_.isEmpty(keyword)) {
            condition.push({ key: `name LIKE '%${keyword}%'` });
        }

        const fields = ['category_id', 'name']
        
        let record  = await CategoryModel.getAll({condition, page, limit, fields});
        let total   = await CategoryModel.getCount({condition});

        const pages = Math.ceil(total / limit);

        let response = { page, pages, limit, total, record };

        parseResponse(res, 200, response, _.isEmpty(record) ? 'no data found' : 'success');
    } catch (error) {
        let err = new Error(error.message);
        err.code = 500;
        next(err);
    }
}

CategoryController.delete = async (req, res, next) => {
    try {
        const { id } = req.params;
        const record = await CategoryModel.delete([{ jointer: 'AND', key: 'id', value: id, op: '=' }]);

        parseResponse(res, 200, record, _.isEmpty(record) ? 'no data found' : 'success');
    } catch (error) {
        let err = new Error(error.message);
        err.code = 500;
        next(err);
    }
}

CategoryController.save = async (req, res, next) => {
    try {
        let { id, name, slot_id, status, position, type, start_date, end_date, } = req.body;
        let app_code = req.headers.aid;

        name = slugify(name, { replacement: '_', lower: true });
        status = (_.isEmpty(status) || _.isUndefined(status)) ? 'A' : status

        let record = {};
        let condition = [];
        let data = [
            { key: 'app_code', value: app_code },
            { key: 'name', value: name },
            { key: 'type', value: type },
            { key: 'slot_id', value: slot_id },
            { key: 'status', value: status },
            { key: 'position', value: position }
        ];
        if (type == 2) {
            data.push({ key: 'start_date', value: start_date })
            data.push({ key: 'end_date', value: end_date })
        }
        else if (type == 1) {
            data.push({ key: 'start_date', value: null })
            data.push({ key: 'end_date', value: null })
        }

        if (id != '' && id != undefined) {
            console.log('msk ke update', String(id))
            let existing_cond = [
                { jointer: 'AND', key: 'id', value: `${id}`, op: '=' },
                { jointer: 'OR', key: 'name', value: name, op: '=' }
            ];

            let existing = await CategoryModel.getBy(existing_cond, [], [], 1);

            if (!_.isEmpty(existing)) {
                condition.push({ key: 'id', value: `${existing.id}` });
            }
        }
        
        record = await CategoryModel.save(data, condition);

        parseResponse(res, 200, record, _.isEmpty(record) ? 'no data found' : 'success');
    } catch (error) {
        let err = new Error(error.message);
        err.code = 500;
        next(err);
    }
}

module.exports = CategoryController;
const _ = require('lodash');
const parseResponse = require('../helpers/parse-response');
const ComplaintModel = require('../models/complaint.model');
const DatasetController = {}

DatasetController.all = async (req, res, next) => {
    try {
        let record  = await ComplaintModel.getAll({
            group: ['complaints.category_id'],
            fields: ['complaints.category_id', 'categories.name category_name'],
            join: ['JOIN categories ON categories.category_id = complaints.category_id']
        });
        const getData = []
        for (let index = 0; index < record.length; index++) {
            const val = record[index];
            
            val.highest = await ComplaintModel.getBy({
                condition: [{ key: `category_id = ${val.category_id}` }],
                fields: ['complaint_id id', 'violence_description text', 'violence_label label'],
                sort: ['violence_score DESC']
            })
            getData.push(val.highest)
            
            val.lowest = await ComplaintModel.getBy({
                condition: [{ key: `category_id = ${val.category_id}` }],
                fields: ['complaint_id id', 'violence_description text', 'violence_label label'],
                sort: ['violence_score ASC']
            })
            getData.push(val.lowest)
        }

        let result = [
            {"id": 1, "text": "Once upon a time...", "label": "Low"},
            {"id": 2, "text": "In a land far away...", "label": "Middle"},
            {"id": 3, "text": "It was a dark and stormy night...", "label": "Critical"}
        ]

        res.status(200).json(getData)
    } catch (error) {
        console.error(error)
        res.status(200).json([])
    }
}

module.exports = DatasetController;
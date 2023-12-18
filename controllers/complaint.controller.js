const _ = require('lodash');
const QuestionModel = require('../models/question.model');
const ChoiceModel = require('../models/choice.model');
const ComplaintModel = require('../models/complaint.model');
const AnswerModel = require('../models/answer.model');
const InstitutionModel = require('../models/institution.model');
const parseResponse = require('../helpers/parse-response');
const ComplaintController = {}

ComplaintController.detail = async (req, res, next) => {
    try {
        const { id } = req.params;
        const record = await ComplaintModel.getBy({
            condition: [{ jointer: 'AND', key: 'complaint_id', value: id, op: '=' }],
            fields: ['perpetrator', 'victim', 'incident_date', 'description', 'file', 'violence_level']
        });

        parseResponse(res, 200, record, _.isEmpty(record) ? 'no data found' : 'success');
    } catch (error) {
        let err = new Error(error.message);
        err.code = 500;
        next(err);
    }
}

ComplaintController.leaderboard = async (req, res, next) => {
    try {
        const page = '1'
        const limit = '10';
        const fields = ['institutions.name', 'COUNT(*) as total_complaints']
        const group = ['institutions.institution_id']
        const sort = ['total_complaints ASC']
        const join = [
            'JOIN users ON institutions.institution_id = users.institution_id',
            'JOIN complaints ON users.user_id = complaints.user_id',
        ]
        
        let record  = await InstitutionModel.getAll({page, limit, fields, group, sort, join});

        parseResponse(res, 200, record, _.isEmpty(record) ? 'no data found' : 'success');
    } catch (error) {
        let err = new Error(error.message);
        err.code = 500;
        next(err);
    }
}

ComplaintController.history = async (req, res, next) => {
    try {
        let { page, limit, category_id: categoryId } = req.query;
        let userId = 1
        let condition = [
            { key: `user_id = '${userId}'` }
        ];

        page = _.isEmpty(page) ? 1 : page;
        limit = _.isEmpty(limit) ? 15 : limit;

        if (!_.isEmpty(categoryId)) {
            condition.push({ key: `category_id = '${categoryId}'` });
        }

        const fields = ['complaint_id', 'perpetrator', 'victim', 'incident_date', 'description', 'file', 'created_at', 'updated_at']
        const sort = ['complaint_id DESC']
        
        let record  = await ComplaintModel.getAll({condition, page, limit, fields, sort});
        let total   = await ComplaintModel.getCount({condition});

        const pages = Math.ceil(total / limit);

        let response = { page, pages, limit, total, record };

        parseResponse(res, 200, response, _.isEmpty(record) ? 'No data found!' : 'success');
    } catch (error) {
        let err = new Error(error.message);
        err.code = 500;
        next(err);
    }
}

ComplaintController.save = async (req, res, next) => {
    try {
        let {
            category_id: categoryId,
            perpetrator,
            victim,
            incident_date: incidentDate,
            description,
            answer,
        } = req.body;
        answer = JSON.parse(answer)
        const filename = req.file.filename
        let userId = 1

        let data = [
            { key: 'user_id', value: userId },
            { key: 'category_id', value: categoryId },
            { key: 'perpetrator', value: perpetrator },
            { key: 'victim', value: victim },
            { key: 'incident_date', value: incidentDate },
            { key: 'description', value: description },
            { key: 'file', value: `${CONFIG.URL}/${filename}` },
        ];
        
        const insert = await ComplaintModel.save(data);

        let msg = 'failed'
        const complaintId = insert.insertId
        const acknowledge = complaintId > 0
        if (acknowledge) {
            msg = 'success'
            
            const questionIds = answer.map(val => val.question_id)
            const choiceIds = answer.filter(val => _.isNumber(val.answer)).map(val => val.answer)

            let condition = [{ key: `question_id IN (${questionIds.join(',')})` }];
            let fields = ['question_id', 'category_id', 'question', 'type']
            let questions  = await QuestionModel.getAll({condition, fields});
            const questionObject = _.keyBy(questions, 'question_id')

            condition = [{ key: `choice_id IN (${choiceIds.join(',')})` }];
            fields = ['choice_id', 'question_id', 'choice']
            const choices  = await ChoiceModel.getAll({condition, fields});
            const choiceObject = _.keyBy(choices, 'choice_id')

            let answerCompose = []
            let answerField = ['complaint_id', 'question_id', 'choice_id', 'choice_text', 'meta_question', 'meta_choice',]
            answer.map(val => {
                let choiceId = _.isNumber(val.answer) ? val.answer : 0
                let choiceText = _.isNumber(val.answer) ? null : val.answer
                let metaChoice = _.isNumber(val.answer) ? JSON.stringify(choiceObject[val.answer]) : null

                answerCompose.push([
                    complaintId,
                    val.question_id,
                    choiceId,
                    choiceText,
                    JSON.stringify(questionObject[val.question_id]),
                    metaChoice,
                ])
            })
            const saveAnswerBatch = await AnswerModel.saveBatch({field: answerField, data: answerCompose})
        }

        parseResponse(res, 200, { id: complaintId }, msg, acknowledge);
    } catch (error) {
        let err = new Error(error.message);
        err.code = 500;
        next(err);
    }
}

ComplaintController.question = async (req, res, next) => {
    try {
        let { category_id: categoryId } = req.query;
        categoryId = categoryId || 0

        let condition = [{ key: `category_id = ${categoryId}` }];
        let fields = ['question_id', 'category_id', 'question', 'type']
        let record  = await QuestionModel.getAll({condition, fields});

        if (record.length > 0) {
            const questionIds = record.map(question => question.question_id)
            condition = [{ key: `question_id IN (${questionIds.join(',')})` }];
            fields = ['choice_id', 'question_id', 'choice']
            const choices  = await ChoiceModel.getAll({condition, fields});
            let tes = _.keyBy(choices, 'question_id')
            console.log('tes', tes)

            const choiceComposition = {}
            choices.forEach(val => {
                if (_.isUndefined(choiceComposition[val.question_id])) {
                    choiceComposition[val.question_id] = [{
                        id: val.choice_id,
                        text: val.choice,
                    }]
                } else {
                    choiceComposition[val.question_id].push({
                        id: val.choice_id,
                        text: val.choice,
                    })
                }
            })

            record = record.map(val => {
                val.choices = []

                if (val.type === 'dropdown') {
                    val.choices = choiceComposition[val.question_id] || []
                }

                return val
            })
        }

        parseResponse(res, 200, record, _.isEmpty(record) ? 'No data found!' : 'success');
    } catch (error) {
        let err = new Error(error.message);
        err.code = 500;
        next(err);
    }
}

module.exports = ComplaintController;
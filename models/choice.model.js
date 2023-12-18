const _ = require('lodash');
const moment = require('moment');
const CoreDB = require('../utils/CoreDB');
const ChoiceModel = {}

const tableName = 'choices'

ChoiceModel.save = async (data, condition = []) => {
    if (condition.length > 0) {
        CoreDB.update(tableName);

        data.push({ key: 'updated', value: moment().format('YYYY-MM-DD kk:mm:ss') });

        CoreDB.setData(data);
        condition.forEach((record, index) => {
            let jointer = !_.isEmpty(record.jointer) ? record.jointer : 'AND';

            if (!_.isEmpty(record.value)) {
                let op = !_.isEmpty(record.op) ? record.op : '=';

                CoreDB.setWhere(`${jointer} ${record.key} ${op} ?`, record.value);
            } else {
                CoreDB.setWhere(`${jointer} ${record.key}`);
            }
        })
    } else {
        CoreDB.insert(tableName)
        CoreDB.setData(data);
    }

    return await CoreDB.execute();
}

ChoiceModel.delete = async (condition) => {
    CoreDB.delete(tableName);

    condition.forEach((record, index) => {
        let jointer = !_.isEmpty(record.jointer) ? record.jointer : 'AND';

        if (!_.isEmpty(record.value)) {
            let op = !_.isEmpty(record.op) ? record.op : '=';

            CoreDB.setWhere(`${jointer} ${record.key} ${op} ?`, record.value);
        } else {
            CoreDB.setWhere(`${jointer} ${record.key}`);
        }
    })

    return await CoreDB.execute();
}

ChoiceModel.getBy = async (condition = [], join = [], group = [], limit = null) => {
    CoreDB.select(tableName);

    if (condition.length > 0) {
        condition.forEach((record, index) => {
            let jointer = !_.isEmpty(record.jointer) ? record.jointer : 'AND';

            if (!_.isEmpty(record.value)) {
                let op = !_.isEmpty(record.op) ? record.op : '=';

                CoreDB.setWhere(`${jointer} ${record.key} ${op} ?`, record.value);
            } else {
                CoreDB.setWhere(`${jointer} ${record.key}`);
            }
        })
    }

    // if (join.length > 0) {
    //     join.forEach((record, index) => {
    //         CoreDB.setJoin(record);
    //     })
    // }

    // if (group.length > 0) {
    //     group.forEach((record, index) => {
    //         CoreDB.setJoin(record);
    //     })
    // }

    CoreDB.setLimit(limit);
    let result = await CoreDB.execute();

    return result.length == 1 ? result[0] : result;
}

ChoiceModel.getAll = async ({condition = [], join = [], group = [], sort = [], page = null, limit = null, fields = ['*']}) => {
    const now = new Date();
    CoreDB.select(tableName);
    CoreDB.setFields(fields);
    if (condition.length > 0) {
        condition.forEach((record, index) => {
            let jointer = !_.isEmpty(record.jointer) ? record.jointer : 'AND';
            if (!_.isEmpty(record.value)) {
                let op = !_.isEmpty(record.op) ? record.op : '=';
                CoreDB.setWhere(`${jointer} ${record.key} ${op} ?`, record.value);
            } else {
                CoreDB.setWhere(`${jointer} ${record.key}`);
            }
        })
    }

    if (join.length > 0) {
        join.forEach((record, index) => {
            CoreDB.setJoin(record);
        })
    }

    if (group.length > 0) {
        group.forEach((record, index) => {
            CoreDB.setJoin(record);
        })
    }

    if (sort.length > 0) {
        sort.forEach((record, index) => {
            CoreDB.setOrder(record);
        })
    }

    if (!_.isEmpty(page) || !_.isEmpty(limit)) {
        CoreDB.setPage(page);
        CoreDB.setLimit(limit);
    }

    return await CoreDB.execute();
}

ChoiceModel.getCount = async ({condition = [], join = [], group = [], sort = []}) => {
    CoreDB.select(tableName);
    CoreDB.setFields([`COUNT(${tableName}.category_id) AS total`]);

    if (condition.length > 0) {
        condition.forEach((record, index) => {
            let jointer = !_.isEmpty(record.jointer) ? record.jointer : 'AND';

            if (!_.isEmpty(record.value)) {
                let op = !_.isEmpty(record.op) ? record.op : '=';

                CoreDB.setWhere(`${jointer} ${record.key} ${op} ?`, record.value);
            } else {
                CoreDB.setWhere(`${jointer} ${record.key}`);
            }
        })
    }

    if (join.length > 0) {
        join.forEach((record, index) => {
            CoreDB.setJoin(record);
        })
    }

    if (group.length > 0) {
        group.forEach((record, index) => {
            CoreDB.setJoin(record);
        })
    }

    if (sort.length > 0) {
        sort.forEach((record, index) => {
            CoreDB.setOrder(record);
        })
    }

    let total = await CoreDB.execute();
    total = _.isEmpty(total) ? 0 : total[0].total;

    return total;
}

module.exports = ChoiceModel;
const _ = require('lodash');
const moment = require('moment');
const CoreDB = require('../utils/CoreDB');
const ComplaintModel = {}

const tableName = 'complaints'

ComplaintModel.save = async (data, condition = []) => {
    if (condition.length > 0) {
        CoreDB.update(tableName);

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

ComplaintModel.delete = async (condition) => {
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

ComplaintModel.getBy = async ({condition = [], join = [], group = [], fields = [], sort = []}) => {
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

    // if (group.length > 0) {
    //     group.forEach((record, index) => {
    //         CoreDB.setJoin(record);
    //     })
    // }

    if (sort.length > 0) {
        sort.forEach((record, index) => {
            CoreDB.setOrder(record);
        })
    }

    CoreDB.setLimit(1);
    let result = await CoreDB.execute();

    return result.length > 0 ? result[0] : null;
}

ComplaintModel.getAll = async ({condition = [], join = [], group = [], sort = [], page = null, limit = null, fields = ['*']}) => {
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
            CoreDB.setGroup(record);
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

ComplaintModel.getCount = async ({condition = [], join = [], group = [], sort = []}) => {
    CoreDB.select(tableName);
    CoreDB.setFields([`COUNT(${tableName}.complaint_id) AS total`]);

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

ComplaintModel.saveBatch = async ({field = [], data = []}) => {
    CoreDB.insert(tableName);
    CoreDB.setFields(field);

    return await CoreDB.insertBatch(data);
}

module.exports = ComplaintModel;
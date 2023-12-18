const _ = require('lodash');
const mysql = require('mysql');
const Logger = require('./Logger');
const DB = mysql.createPool({
    connectionLimit: CONFIG.CONNECTION_LIMIT,
    host: CONFIG.DB_HOST,
    user: CONFIG.DB_USER,
    password: CONFIG.DB_PASS,
    database: CONFIG.DB_NAME,
    timezone: 'Asia/Jakarta'
});

DB.on('acquire', (connection) => {
    // console.log('  ├── DB :: connection %d acquired', connection.threadId);
});

DB.on('connection', (connection) => {
    // console.log('  ├── DB :: connection created %d', connection.threadId);
});

DB.on('enqueue', (connection) => {
    // console.log('  ├── DB :: queued to wait for an available connection %d', connection.threadId);
});

DB.on('release', (connection) => {
    // console.log('  ├── DB :: connection %d released', connection.threadId);
});

const CoreDB = {};
const STATE = {
    SELECT: 'select',
    INSERT: 'insert',
    UPDATE: 'update',
    DELETE: 'delete'
}

let _state  = STATE.SELECT;
let _table  = null;
let _fields = null;
let _data   = null;
let _join   = null;
let _where  = null;
let _values = null;
let _group  = null;
let _order  = null;
let _limit  = null;
let _page   = null;

CoreDB.query = (query, values) => {
    if (CONFIG.LOG_DB === true) {
        Logger.info(`access DB from query => ${query} With values "${values}"`, { "query": query, "values": values });
    }

    return new Promise((resolve, reject) => {
        try {
            DB.getConnection((err, connection) => {
                if (err) {
                    Logger.error(`Error : Database connection`);
                    reject(err)
                } else {
                    connection.query(query, values, (error, result, fields) => {
                        connection.release();

                        if (error) {
                            Logger.error(`Error : sqlMessage -> ${error.sqlMessage}`)
                            Logger.error(`Error : query -> ${query}`)
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    });
                }
            })
        } catch (error) {
            reject(error);
        }
    })
}

CoreDB.select = (table) => {
    _table  = table;
    _state  = STATE.SELECT;

    _fields = [];
    _data   = [];
    _values = [];
    _join   = [];
    _where  = [];
    _group  = [];
    _order  = [];

    _page   = null;
    _limit  = null;
}

CoreDB.insert = (table) => {
    _table  = table;
    _state  = STATE.INSERT;

    _fields = [];
    _data   = [];
    _values = [];
    _join   = [];
    _where  = [];
    _group  = [];
    _order  = [];
}

CoreDB.update = (table) => {
    _table  = table;
    _state  = STATE.UPDATE;

    _fields = [];
    _data   = [];
    _values = [];
    _join   = [];
    _where  = [];
    _group  = [];
    _order  = [];
}

CoreDB.delete = (table) => {
    _table  = table;
    _state  = STATE.DELETE;

    _fields = [];
    _data   = [];
    _values = [];
    _join   = [];
    _where  = [];
    _group  = [];
    _order  = [];
}

CoreDB.setFields = (fields) => {
    if (_.isString(fields)) {
        fields  = fields.split(',');
    }

    if (fields.length > 0) {
        fields.forEach((value, index) => {
            _fields.push(value);
        })
    }
}

CoreDB.setData = (data) => {
    if (_.isArray(data) && data.length > 0) {
        data.forEach((value, index) => {
            if (_state == 'insert') {
                _data.push(`${value.key}`);
            } else if (_state == 'update') {
                _data.push(`${value.key} = ?`);
            }

            _values.push(value.value);
        })
    }
}

CoreDB.setJoin = (join) => {
    _join.push(join);
}

CoreDB.setWhere = (field, value) => {
    let regex = /[\\?]/gm;

    if (regex.test(field)) {
        _values.push(value);
    }

    _where.push(`${field}`);
}

CoreDB.setGroup = (group) => {
    _group.push(group);
}

CoreDB.setOrder = (order) => {
    _order.push(order);
}

CoreDB.setLimit = (limit) => {
    _limit = limit;
}

CoreDB.setPage = (page) => {
    _page = page;
}

CoreDB.execute = async () => {
    let table       = _table;
    let values      = _values;
    let data        = !_.isEmpty(_data) ? (_data).join(', ') : '';
    let fields      = !_.isEmpty(_fields) ? (_fields).join(', ') : '*';
    let joins       = !_.isEmpty(_join) ? (_join).join(' ') : '';
    let condition   = !_.isEmpty(_where) ? 'WHERE 1 ' + (_where).join(' ') : '';
    let groups      = !_.isEmpty(_group) ? 'GROUP BY ' + (_group).join(', ') : '';
    let orders      = !_.isEmpty(_order) ? 'ORDER BY ' + (_order).join(', ') : '';
    let offset      = (_.isEmpty(_page) || _page == 1) ? 0 : (_page - 1) * _limit;
    let limit       = _limit !== null && _page > 0 ? `LIMIT ${offset}, ${_limit}` : '';
    let query       = null;

    limit = _limit == 1 ? `LIMIT 1` : limit;

    if (_state == STATE.SELECT) {
        query = `SELECT ${fields} FROM ${table} ${joins} ${condition} ${groups} ${orders} ${limit}`;
    } else if (_state == STATE.INSERT) {
        let value = [];

        if (_data.length > 0) {
            _data.forEach((v, index) => {
                value.push('?');
            })
        }

        value = value.join(', ');
        query = `INSERT INTO ${table} (${data}) VALUES (${value})`;
    } else if (_state == STATE.UPDATE) {
        query = `UPDATE ${table} SET ${data} ${joins} ${condition}`;
    } else if (_state == STATE.DELETE) {
        query = `DELETE FROM ${table}  ${joins} ${condition}`;
    }

    return await CoreDB.query(query, values);
}

CoreDB.insertBatch = async (value) => {
    let table   = _table;
    let fields  = !_.isEmpty(_fields) ? (_fields).join(', ') : '*';
    let query   = `INSERT INTO ${table} (${fields}) VALUES ?`;
    let values  = [value];

    return await CoreDB.query(query, values);
}

module.exports = CoreDB;
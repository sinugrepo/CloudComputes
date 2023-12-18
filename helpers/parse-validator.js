const _         = require('lodash');

module.exports = function parseValidator(error) {
    let result    = {};
    let transform = [];
    let message   = [];
    
    // transform array object to object and grouping by param
    transform = _.transform(error, function(res, value, key) {
        if (typeof res[`${value.location}`] == 'undefined') {
            res[`${value.location}`] = [];
        }

        if (typeof res[`${value.location}`][`${value.param}`] == 'undefined') {
            res[`${value.location}`][`${value.param}`] = [];
        }

        res[`${value.location}`][`${value.param}`].push((value.msg).replace('?', value.param));
    }, {});

    // transform result to array message
    for (var key in transform) {
        if (typeof result[`${key}`] == 'undefined') {
            result[`${key}`] = [];
        }
        for (var k in transform[key]) {
            result[`${key}`].push({ param: k, messages: transform[key][k] });

            if (transform.hasOwnProperty(key)) {
                message.push(key);
            }
        }
    }

    // let messages = 'Invalid request on ' + message.join(', ');
    let messages    = 'Invalid request!'
    
    return { result, messages };
}
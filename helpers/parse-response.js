module.exports = function parseResponse(response, status, data, message, acknowledge = true) {
    response.status(status)
        .send({
            message,
            acknowledge,
            data,
        })
}
  
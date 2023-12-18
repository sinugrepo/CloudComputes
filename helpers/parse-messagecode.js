module.exports = parseMessageCode = (code, message = 'Something went wrong') => {
    const codes = [
        {
            "code": 300,
            "message": "The request has more than one possible response"
        },
        {
            "code": 301,
            "message": "This response code means that the URI of the requested resource has been changed"
        },
        {
            "code": 302,
            "message": "This response code means that the URI of requested resource has been changed temporarily"
        },
        {
            "code": 303,
            "message": "The server sent this response to direct the client to get the requested resource at another URI with a GET request"
        },
        {
            "code": 304,
            "message": "This is used for caching purposes"
        },
        {
            "code": 305,
            "message": "Was defined in a previous version of the HTTP specification to indicate that a requested response must be accessed by a proxy"
        },
        {
            "code": 306,
            "message": "This response code is no longer used, it is just reserved currently"
        },
        {
            "code": 307,
            "message": "The server sends this response to direct the client to get the requested resource at another URI with same method that was used in the prior request"
        },
        {
            "code": 308,
            "message": "This means that the resource is now permanently located at another URI"
        },
        {
            "code": 400,
            "message": "This response means that server could not understand the request due to invalid syntax"
        },
        {
            "code": 401,
            "message": "Although the HTTP standard specifies 'unauthorized', semantically this response means 'unauthenticated'"
        },
        {
            "code": 402,
            "message": "This response code is reserved for future use"
        },
        {
            "code": 403,
            "message": "Oops, sesi Anda telah berakhir. Ayo login lagi!"
        },
        {
            "code": 404,
            "message": "The server can not find your request"
        },
        {
            "code": 405,
            "message": "The request method is known by the server but has been disabled and cannot be used"
        },
        {
            "code": 406,
            "message": "This response is sent when the web server, after performing server-driven content negotiation, doesn't find any content following the criteria given by the user agent"
        },
        {
            "code": 407,
            "message": "This is similar to 401 but authentication is needed to be done by a proxy"
        },
        {
            "code": 408,
            "message": "This response is sent on an idle connection by some servers, even without any previous request by the client"
        },
        {
            "code": 409,
            "message": "This response is sent when a request conflicts with the current state of the server"
        },
        {
            "code": 410,
            "message": "This response would be sent when the requested content has been permanently deleted from server, with no forwarding address"
        },
        {
            "code": 411,
            "message": "Server rejected the request because the Content-Length header field is not defined and the server requires it"
        },
        {
            "code": 412,
            "message": "The client has indicated preconditions in its headers which the server does not meet"
        },
        {
            "code": 413,
            "message": "Request entity is larger than limits defined by server; the server might close the connection or return an Retry-After header field"
        },
        {
            "code": 414,
            "message": "The URI requested by the client is longer than the server is willing to interpret"
        },
        {
            "code": 415,
            "message": "The media format of the requested data is not supported by the server, so the server is rejecting the request"
        },
        {
            "code": 416,
            "message": "The range specified by the Range header field in the request can't be fulfilled"
        },
        {
            "code": 417,
            "message": "This response code means the expectation indicated by the Expect request header field can't be met by the server"
        },
        {
            "code": 426,
            "message": "The server refuses to perform the request using the current protocol but might be willing to do so after the client upgrades to a different protocol"
        },
        {
            "code": 428,
            "message": "The origin server requires the request to be conditional"
        },
        {
            "code": 429,
            "message": "The user has sent too many requests in a given amount of time ('rate limiting')"
        },
        {
            "code": 431,
            "message": "The server is unwilling to process the request because its header fields are too large"
        },
        {
            "code": 500,
            "message": "The server has encountered a situation it doesn't know how to handle"
        },
        {
            "code": 501,
            "message": "The request method is not supported by the server and cannot be handled"
        },
        {
            "code": 502,
            "message": "This error response means that the server, while working as a gateway to get a response needed to handle the request, got an invalid response"
        },
        {
            "code": 503,
            "message": "The server is not ready to handle the request. Common causes are a server that is down for maintenance or that is overloaded"
        },
        {
            "code": 504,
            "message": "Sorry, there is a problem with our server. Please try again later. If there are still problems, please contact ITD"
        },
        {
            "code": 505,
            "message": "The HTTP version used in the request is not supported by the server."
        },
        {
            "code": 511,
            "message": "The 511 status code indicates that the client needs to authenticate to gain network access"
        },
        // error connection database
        {
            "code": 'PROTOCOL_CONNECTION_LOST',
            "message": "Database connection was closed."
        },
        {
            "code": 'ER_CON_COUNT_ERROR',
            "message": "Database has too many connections."
        },
        {
            "code": 'ECONNREFUSED',
            "message": "Database connection was refused."
        },
        {
            "code": 'ER_PARSE_ERROR',
            "message": "You have an error in your query."
        },
        {
            "code": 'ER_BAD_DB_ERROR',
            "message": "Unknown database selected."
        },
        {
            "code": 'ER_BAD_FIELD_ERROR',
            "message": "Unknown column in your query."
        },
        {
            "code": 'ER_NO_SUCH_TABLE',
            "message": "Unknown table selected."
        },
        {
            "code": 488,
            "message": "You have an error in your query or database."
        }
    ];
    
    return (typeof codes.find(v => v.code == code) == 'undefined' ? message : codes.find(v => v.code == code).message);
}
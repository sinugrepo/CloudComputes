require('dotenv').config()

const express       = require("express");
const cors          = require('cors')
const bodyParser    = require("body-parser");
const responseTime  = require('response-time');
const app           = express();
const config        = process.env;

const parseMessageCode      = require('./helpers/parse-messagecode');

// Configuration Environment API
global.CONFIG       = {
    // General
    VERSION     : config.API_VERSION,
    MAINTENANCE : config.API_MAINTENANCE == 'true',
    CACHE       : config.API_CACHE == 'true',
    LOG_DB      : config.API_LOGDB == 'true',
    LOG_FILE    : config.API_LOGFILE == 'true',
    LOG_CONSOLE : config.API_LOGCONSOLE == 'true',
    ENVIRONMENT : process.env.NODE_ENV || config.ENVIRONMENT ||'development',
    PORT        : process.env.PORT || config.PORT,
    HOST        : config.HOST,
    URL         : config.API_ENVIRONMENT === 'development' ? `http://${config.HOST}:${config.PORT}` : config.URL,

    // Database
    DB_HOST     : config.DB_HOST,
    DB_USER     : config.DB_USER,
    DB_PASS     : config.DB_PASS,
    DB_NAME     : config.DB_NAME,
    CONNECTION_LIMIT    : config.CONNECTION_LIMIT,

    // Logging --> MongoDB
    LOGS_COLLECTION : config.LOGS_COLLECTION,
    LOGS_CONNECT    : `mongodb://${config.LOGS_USER}:${config.LOGS_PASS}@${config.LOGS_HOST}/${config.LOGS_DB}`,
    LOGS_DIR        : config.LOGS_DIR,
    LOGS_MAIL_TO    : config.LOGS_MAIL_TO,
    LOGS_MAIL_FROM  : config.LOGS_MAIL_FROM,
    LOGS_MAIL_HOST  : config.LOGS_MAIL_HOST,
    LOGS_MAIL_UNAME : config.LOGS_MAIL_UNAME,
    LOGS_MAIL_PASS  : config.LOGS_MAIL_PASS,
    LOGS_FROM       : config.LOGS_FROM,

    // Services
    AUTH_SERVICE    : config.AUTH_SERVICE,

    // CONFIGURATION
    SALT_ROUNDS : parseInt(config.SALT_ROUNDS),
}

//Logging
const Logger        = require("./utils/Logger");

// Use Middlewares
app.use(cors());
app.use(responseTime());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(Logger.httpRequest);

// load files
app.use('/uploads', express.static('uploads'))

// API Routes
require('./routes')(app);

// Service is under maintenance && Catching error and forward to error handler
app.use(function (req, res, next) {
    if (CONFIG.MAINTENANCE === true) {
        let err     = new Error('The server is under maintenance');
        err.code    = 503
        next(err)
    } else {
        let err     = new Error('The server can not find your request');
        err.code    = 404;
        next(err)
    }
});

// Error handler
app.use(function (err, req, res, next) {
    let message     = null;
    let validation  = typeof err.validation != 'undefined' ? err.validation.result : null;
    
    if (typeof err.validation != 'undefined' && typeof err.validation.messages == 'string') {
        message = err.validation.messages;
    } else {
        message = parseMessageCode(err.code, err.message)
    }
    
    res.status(err.code || 400)
        .send({
            message,
            acknowledge : false,
            data      : null,
        })
    //Error
    Logger.error(`${err.code} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
});

// Logger error middleware request
app.use(Logger.errorHttpRequest);

const server    = app.listen(CONFIG.PORT, CONFIG.HOST, function () {
    Logger.info(`Starting App listening on port ${server.address().port}`);

    console.log('═══════════════════════════════════════');
    console.log('       App listening on port %s', server.address().port);
    console.log('       Press Ctrl+C to quit.');
    console.log('═══════════════════════════════════════');
});
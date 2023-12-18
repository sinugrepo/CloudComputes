const winston           = require('winston');
const fs                = require('fs');
const moment            = require('moment');
const expressWinston    = require('express-winston');

require('winston-daily-rotate-file');
require('winston-mongodb');
require('winston-mail');

let logDirectory = (CONFIG.LOGS_DIR || 'logs'); //change this with your path

if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

function formatParams(info) {
    const {
        timestamp,
        level,
        message,
        ...args
    } = info;

    const date = moment.utc().local().format('YYYY-MM-DD HH:mm:ss');
    
    if (CONFIG.ENVIRONMENT === 'production') {
        return `[${date} :: ${CONFIG.LOGS_FROM} :: ${level}] ${message}`;
    } else {
        return `[${date} :: ${CONFIG.LOGS_FROM} :: ${level}] ${message} ${Object.keys(args).length ? JSON.stringify(args, "", "") : ""}`;
    }
}

//winston options for various logging type
let options = {
    file: {
        filename    : 'logs-%DATE%.log',
        datePattern : 'YYYY-MM-DD',
        dirname     : logDirectory,
        format      : winston.format.combine(
            winston.format.timestamp(),
            winston.format.align(),
            winston.format.printf(formatParams)
        )
    },
    console: {
        level   : CONFIG.ENVIRONMENT === 'development' ? 'debug' : 'info',
        format  : winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
            winston.format.align(),
            winston.format.printf(formatParams)
        )
    },
    database: {
        db          : CONFIG.LOGS_CONNECT,
        collection  : CONFIG.LOGS_COLLECTION,
        level       : CONFIG.ENVIRONMENT === 'development' ? 'debug' : 'info',
        format      : winston.format.combine(
            winston.format.timestamp(),
            winston.format.metadata({
                fillExcept: ['message', 'level', 'timestamp']
            }),
        ),
        options: {
            poolSize            : 2,
            autoReconnect       : false,
            useUnifiedTopology  : true,
            useNewUrlParser     : true
        }
    },
    mail : {
        level   : 'error',
        to      : CONFIG.LOGS_MAIL_TO,
        from    : CONFIG.LOGS_MAIL_FROM,
        subject : 'An Error Occured On Server. Please Check IT ASAP',
        host    : CONFIG.LOGS_MAIL_HOST,
        username: CONFIG.LOGS_MAIL_UNAME,
        password: CONFIG.LOGS_MAIL_PASS,
        ssl     : true,
    }
};


// Configuration Logs
let configLogger        = [];
let exceptionLogger     = [];
if (CONFIG.LOG_SAVEDB === true) {
    configLogger.push(new winston.transports.MongoDB(options.database));
}
if (CONFIG.LOG_FILE === true) {
    configLogger.push(new winston.transports.DailyRotateFile(options.file));
}
if (CONFIG.LOG_CONSOLE === true) {
    configLogger.push(new winston.transports.Console(options.console));
}

exceptionLogger = configLogger;
if (CONFIG.LOG_SENDEMAIL === true) {
    exceptionLogger.push(new winston.transports.Mail(options.mail));
}

//Logger route error and success
let routeLogoption = {
    transports: configLogger,
    exceptionHandlers: exceptionLogger,
    msg: function(req, res) {
        return ` \n└─┬── method         : ${req.method}\n` +
            `  ├── Host              : ${req.headers.host} ::: "${req.url}" ::: ${req.ip} ::: Version HTTP/${req.httpVersion}\n` +
            `  ├── Authorization     : ${req.headers.authorization}\n` +
            `  ├── User-agent        : ${req.get("user-agent")}\n` +
            `  └── Response Time     : ${res.responseTime} ms\n`
    },
    statusLevels: false,
    level: function(req, res) {
        var level = "";
        if (res.statusCode >= 100) {
            level = "info";
        }
        if (res.statusCode >= 400) {
            level = "warn";
        }
        if (res.statusCode >= 500) {
            level = "error";
        }
        // Ops is worried about hacking attempts so make Unauthorized and Forbidden critical
        if (res.statusCode == 401 || res.statusCode == 403) {
            level = "critical";
        }
        return level;
    }
};

//iniatilize logger
let Logger = winston.createLogger({
    transports: configLogger,
    exceptionHandlers: exceptionLogger,
    exitOnError: false, // do not exit on handled exceptions
});
// Capture middleware Log
Logger.httpRequest = expressWinston.logger(routeLogoption)
// Error middleware Log
Logger.errorHttpRequest = expressWinston.errorLogger(routeLogoption)

module.exports = Logger;
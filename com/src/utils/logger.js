// LOG
var path = require('path');
var winston = require('winston');

var filename = path.join(__dirname, '../../log/event');
var exceptFilename = path.join(__dirname, '../../log/exception');
var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.DailyRotateFile)({filename: filename})
    ],
    exceptionHandlers: [
        new (winston.transports.Console)(),
        new winston.transports.DailyRotateFile({filename: exceptFilename})
    ]
});

module.exports = logger;
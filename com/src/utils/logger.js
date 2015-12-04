// LOG
var path = require('path');
var winston = require('winston');

var filename = path.join(__dirname, '../../log/logs');
var exceptFilename = path.join(__dirname, '../../log/exceptions');


var logTransport = [
    new (winston.transports.DailyRotateFile)({filename: filename})
];
var logException = [
    new winston.transports.DailyRotateFile({filename: exceptFilename})
];

// Gestion logs consile si mode debug
if (!global.modeProd) {
    logTransport.push(new (winston.transports.Console)());
    logException.push(new (winston.transports.Console)());
}

var logger = new (winston.Logger)({
    transports: logTransport,
    exceptionHandlers: logException
});

module.exports = logger;
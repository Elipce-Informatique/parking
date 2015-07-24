// LOG
var path = require('path');
var winston = require('winston');

var filename = path.join(__dirname, '../../log/event');
var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.DailyRotateFile)({filename: filename})
    ]
});

module.exports = logger;
// Dependencies
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var mysql = require('mysql');
var _ = require('lodash');


// Local modules
var logger = require('../utils/logger.js');
var errorHandler = require('../message_routes.js');


// -----------------------------------------------------------------
// Creates the Config class
function Error() {
    if (this instanceof Error === false) {
        throw new TypeError("Classes can't be function-called");
    }
    EventEmitter.call(this);
}

// Extend EventEmitter to use this.emit
util.inherits(Error, EventEmitter);
// -----------------------------------------------------------------

// Define the Error class
// -----------------------------------------------------------------
/**
 * insert, update or delete a sensor returns an error
 * @param error: object
 * @param client: WS client
 */
Error.prototype.onSensorConfigUpdateDone = function (error, client) {
    logger.log('error', 'onSensorConfigUpdateDone ERROR', error);
};

/**
 * insert, update or delete a display returns an error
 * @param error: object
 * @param client: WS client
 */
Error.prototype.onDisplayConfigUpdateDone = function (error, client) {
    logger.log('error', 'onDisplayConfigUpdateDone ERROR', error);
};

/**
 * insert, update or delete a counter returns an error
 * @param error: object
 * @param client: WS client
 */
Error.prototype.onCounterConfigUpdateDone = function (error, client) {
    logger.log('error', 'onCounterConfigUpdateDone ERROR', error);
};

/**
 * insert, update or delete a view returns an error
 * @param error: object
 * @param client: WS client
 */
Error.prototype.onViewConfigUpdateDone = function (error, client) {
    logger.log('error', 'onViewConfigUpdateDone ERROR', error);
};

/**
 * insert, update or delete a setting returns an error
 * @param error: object
 * @param client: WS client
 */
Error.prototype.onSettingsUpdateDone = function (error, client) {
    logger.log('error', 'onSettingsConfigUpdateDone ERROR', error);
};


module.exports = Error;
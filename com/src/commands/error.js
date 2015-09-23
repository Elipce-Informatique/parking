// Dependencies
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var mysql = require('mysql');
var _ = require('lodash');


// Local modules
var logger = require('../utils/logger.js');
var errorHandler = require('../message_routes.js');
var messenger = require('../utils/messenger.js');
var servModel = require('../models/server.js');
var busModel = require('../models/bus.js');
var sensorModel = require('../models/sensor.js');
var displayModel = require('../models/display.js');
var counterModel = require('../models/counter.js');
var viewModel = require('../models/view.js');
var parkingModel = require('../models/parking.js');
var settingModel = require('../models/setting.js');


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

};

/**
 * insert, update or delete a display returns an error
 * @param error: object
 * @param client: WS client
 */
Error.prototype.onDisplayConfigUpdateDone = function (error, client) {

};

/**
 * insert, update or delete a counter returns an error
 * @param error: object
 * @param client: WS client
 */
Error.prototype.onCounterConfigUpdateDone = function (error, client) {

};

/**
 * insert, update or delete a view returns an error
 * @param error: object
 * @param client: WS client
 */
Error.prototype.onViewConfigUpdateDone = function (error, client) {

};

/**
 * insert, update or delete a setting returns an error
 * @param error: object
 * @param client: WS client
 */
Error.prototype.onSettingsUpdateDone = function (error, client) {

};




module.exports = Error;
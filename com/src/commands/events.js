// Dependencies
var util = require('util');
var EventEmitter = require('events').EventEmitter;

// Local modules
var logger = require('../utils/logger.js');
var errorHandler = require('../message_routes.js');
var messenger = require('../utils/messenger.js');

/**
 * Handle all events
 */
function Events() {
    EventEmitter.call(this);
}

// Extend EventEmitter to use this.emit
util.inherits(Events, EventEmitter);

/**
 * Sends the eventQuery to the controller
 * If provided, AchId will be send in the data object.
 *
 * @param ackID : number -> The value of  ackID must exactly match the value that was
 * received with the previous event report.
 */
Events.prototype.sendEventQuery = function (ackID) {

};
/**
 * Handle the events sent
 * @param data
 */
Events.prototype.onEventData = function (data) {

};

module.exports = Events;
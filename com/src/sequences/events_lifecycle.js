/**
 * Created by yann on 24/07/2015.
 */

// Dependencies
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var mysql = require('mysql');
var _ = require('lodash');


// Local modules
var logger = require('../utils/logger.js');
var errorHandler = require('../message_routes.js');
var messenger = require('../utils/messenger.js');

// -----------------------------------------------------------------
// Creates the Events class
function Events() {
    if (this instanceof Events === false) {
        throw new TypeError("Classes can't be function-called");
    }
    EventEmitter.call(this);

    // ATTRIBUTES DECLARATION
    this.ackId = 0;
}

// Extend EventEmitter to use this.emit
util.inherits(Events, EventEmitter);
// -----------------------------------------------------------------

/**
 * Called once the controller is connected to start the events lifecycle.
 * Calls the event query without ackID
 */
Events.prototype.startEventLoop = function () {
    this.sendInitialEventQuery();
};

/**
 * Send the EventQuery with the ackID
 * @param ackID
 */
Events.prototype.sendEventQuery = function (ackID) {
    messenger.sendToController('eventQuery', {
        "ackID": ackID
    });
};

/**
 * Send the EventQuery without the ackID
 * This is typically for initial query
 */
Events.prototype.sendInitialEventQuery = function () {
    messenger.sendToController('eventQuery', {});
};


/**
 * Capabilities message received from the controller
 * @param data
 * @param client
 */
Events.prototype.onEventData = function (data) {
    this.emit('eventData', data);

    // TODO : handle events received.
};

module.exports = Events;
/**
 * Created by yann on 24/07/2015.
 */

// Dependencies
var mysql = require('mysql');
var _ = require('lodash');


// Local modules
var logger = require('../utils/logger.js');

// -----------------------------------------------------------------
// Creates the Events class
function Events(events_controller) {
    if (this instanceof Events === false) {
        throw new TypeError("Classes can't be function-called");
    }

    // ATTRIBUTES DECLARATION
    this.ackId = 0;
    this.events_controller = events_controller;
}

// -----------------------------------------------------------------

/**
 * Called once the controller is connected to start the events lifecycle.
 * Calls the event query without ackID
 */
Events.prototype.startEventLoop = function () {
    this.events_controller.sendInitialEventQuery();
};

/**
 * Capabilities message received from the controller
 * @param data
 * @param client
 */
Events.prototype.onEventData = function (data) {

    // TODO : handle events received.
};

module.exports = Events;
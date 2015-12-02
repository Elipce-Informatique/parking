// Dependencies
var util = require('util');
var EventEmitter = require('events').EventEmitter;

// Local modules
var logger = require('../utils/logger.js');
var messenger = require('../utils/messenger.js');

/**
 * Class that handle events messages.
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
    logger.log('info', '****** EVENT QUERY '+ackID);
    messenger.sendToController('eventQuery', {
        "ackID": ackID
    });
};

/**
 * Send the EventQuery without the ackID
 * This is typically for initial query
 */
Events.prototype.sendInitialEventQuery = function () {
    //logger.log('info', '********* INITIAL EVENT QUERY');
    messenger.sendToController('eventQuery', {});
};


/**
 * Handle the events sent
 * @param data
 */
Events.prototype.onEventData = function (data) {
    this.emit('eventData', data);
};

module.exports = Events;
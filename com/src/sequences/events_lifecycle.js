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
function EventsLifeCycle(events_controller) {
    if (this instanceof EventsLifeCycle === false) {
        throw new TypeError("Classes can't be function-called");
    }

    // ATTRIBUTES DECLARATION
    this.ackID = 0;
    this.events_controller = events_controller;
}

// -----------------------------------------------------------------

/**
 * Called once the controller is connected to start the events lifecycle.
 * Calls the event query without ackID
 */
EventsLifeCycle.prototype.startEventLoop = function () {
    this.events_controller.on('eventData', this.onEventData);
    this.events_controller.sendInitialEventQuery();
};

/**
 * Capabilities message received from the controller
 * @param data
 * @param client
 */
EventsLifeCycle.prototype.onEventData = function (data) {
    logger.log('info', '#2 onEventData : %o', data);

    // Update ackID to the new value
    this.ackID = _.isNumber(data.ackID) ? data.ackID : this.ackID;

    /*
     * Possible events fields:
     * - date
     * - event
     * - source
     * - ID
     * - state
     * - hwstate
     * - sense
     * - supply
     * - count
     */
    var cacheEvt = {};
    var evts = data.list;
    if (_.isArray(evts)) {
        _.each(evts, function (evt) {
            logger.log('info', 'Détail EVT : ', evt);
            cacheEvt = _.assign(cacheEvt, evt);
            switch (cacheEvt.event) {
                case "startup":
                    break;
                case "init":
                    break;
                case "state":
                    switch (cacheEvt.source) {
                        case "bus":
                            break;
                        case "sensor":
                            break;
                        case "display":
                            break;
                        case "counter":
                            break;
                        default:
                    }
                    break;
                default:
            }
        }, this);
    }
};

module.exports = EventsLifeCycle;
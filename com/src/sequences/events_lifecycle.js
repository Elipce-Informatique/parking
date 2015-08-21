/**
 * Created by yann on 24/07/2015.
 */

// Dependencies
var mysql = require('mysql');
var _ = require('lodash');


// Local modules
var logger = require('../utils/logger.js');
var busModel = require('../models/bus.js');
var sensorModel = require('../models/sensor.js');
var displayModel = require('../models/display.js');

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
    this.events_controller.on('eventData', this.onEventData.bind(this));
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
     * - class
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
        var aStartupEvt = [];
        var aInitEvt = [];
        var aBusEvt = [];
        var aSensorEvt = [];
        var aDisplayEvt = [];
        var aCounterEvt = [];
        var aFirmwareUpdateEvt = [];
        _.each(evts, function (evt) {

            // Omit class key if the ID key is absent
            if (typeof evt.ID === "undefined") {
                cacheEvt = _.omit(cacheEvt, ['class']);
            }

            // If source changes reset all properties except the 3 commons
            if (typeof evt.class !== "undefined") {
                cacheEvt = _.pick(cacheEvt, ['date', 'event']);
            }

            // if the event key changes, reset
            if (typeof evt.event !== "undefined") {
                cacheEvt = _.pick(cacheEvt, ['date', 'source']);
            }

            // FILTER EVTS ON THEIR TYPE
            cacheEvt = _.assign(cacheEvt, evt);

            // DISPATCHES THE EVENT
            switch (cacheEvt.event) {
                case "startup":
                    aStartupEvt.push(_.cloneDeep(cacheEvt));
                    break;
                case "init":
                    aInitEvt.push(_.cloneDeep(cacheEvt));
                    break;
                case "state":
                    switch (cacheEvt.class) {
                        case "bus":
                            aBusEvt.push(_.cloneDeep(cacheEvt));
                            break;
                        case "sensor":
                            aSensorEvt.push(_.cloneDeep(cacheEvt));
                            break;
                        case "display":
                            aDisplayEvt.push(_.cloneDeep(cacheEvt));
                            break;
                        case "counter":
                            aCounterEvt.push(_.cloneDeep(cacheEvt));
                            break;
                        default:
                    }
                    break;
                case "firmwareUpdate":
                    aFirmwareUpdateEvt.push(_.cloneDeep(cacheEvt));
                    break;
                default:
            }
        }, this);

        // INSERT THE EVENTS GATHERED
        sensorModel.insertSensorEvents(aSensorEvt);
    }

    // Send the next EventQuery
    this.events_controller.sendEventQuery(this.ackID);

};

module.exports = EventsLifeCycle;
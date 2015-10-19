/**
 * Created by yann on 24/07/2015.
 */

// Dependencies
var mysql = require('mysql');
var _ = require('lodash');
var Q = require('q')

// Local modules
var logger = require('../utils/logger.js');
var messenger = require('../utils/messenger.js');
var busModel = require('../models/bus.js');
var sensorModel = require('../models/sensor.js');
var displayModel = require('../models/display.js');
var viewModel = require('../models/view.js');
var counterModel = require('../models/counter.js');

// -----------------------------------------------------------------
// Creates the Events class
function EventsLifeCycle(events_controller) {
    if (this instanceof EventsLifeCycle === false) {
        throw new TypeError("Classes can't be function-called");
    }
    //logger.log('info', 'UUUUUUUUUUUUUUUUUUUUUUU PASS constructeur Events');


    // ATTRIBUTES DECLARATION
    this.ackID = 0;
    this.pool = null;
    this.events_controller = events_controller;
    this.eventsStored = [];
    this.ackIDStored = [];

    // Mysql connexion with pool : only 1 connexion VERY IMORTANT
    if (this.pool === null) {
        this.pool = require('../utils/mysql_helper.js').pool();
    }
}

// -----------------------------------------------------------------

/**
 * Called once the controller is connected to start the events lifecycle.
 * Calls the event query without ackID
 */
EventsLifeCycle.prototype.startEventLoop = function () {
    // UNBIND
    this.events_controller.removeAllListeners('eventData');
    // BIND
    this.events_controller.on('eventData', this.onEventData.bind(this));
    // FIRST EVENT QUERY
    this.events_controller.sendInitialEventQuery();
};

/**
 * Capabilities message received from the controller
 * @param data
 * @param client
 */
EventsLifeCycle.prototype.onEventData = function (data) {
    logger.log('info', '#2 onEventData, next ackID: ' + data.ackID, data);

    // Update ackID to the new value
    //this.ackID = _.isNumber(data.ackID) ? data.ackID : this.ackID;
    if (_.isNumber(data.ackID)) {
        this.ackID = data.ackID;
    }
    else {
        //logger.log('info', '############ ackID IS NOT A NUMBER ' + data.ackID);

    }

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

    // Maybe used when all events are sent
    //this.eventsStored = this.eventsStored.concat(evts);
    //this.ackIDStored = this.ackIDStored.concat([data.ackID]);
    //logger.log('info', '============= EVTS ', this.eventsStored, JSON.stringify(this.eventsStored));
    //logger.log('info', '+++++++++++++ ackID ', this.ackIDStored);

    if (_.isArray(evts)) {
        var aStartupEvt = [];
        var aInitEvt = [];
        var aBusEvt = [];
        var aSensorEvt = [];
        var aDisplayEvt = [];
        var aCounterEvt = [];
        var aViewEvt = [];
        var aFirmwareUpdateEvt = [];

        // Parse events
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
                        case "view":
                            aViewEvt.push(_.cloneDeep(cacheEvt));
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

        // SENSOR
        var pSensors = Q.promise(function (resolve, reject) {
            if (aSensorEvt.length > 0) {
                // INSERT THE SENSOR EVENTS GATHERED
                sensorModel.insertSensorEvents(this.pool, aSensorEvt, function () {
                    // NOTIFY ALL THE SUPERVISIONS THAT SOMETHING HAVE CHANGED !
                    messenger.supervisionBroadcast("sensor_event");
                    resolve();
                }, data.ackID);
            }
            else{
                resolve();
            }
        }.bind(this));

        // VIEW
        var pViews = Q.promise(function (resolve, reject) {
            if (aViewEvt.length > 0) {
                // INSERT THE VIEW EVENTS GATHERED
                viewModel.insertViewEvents(this.pool, aViewEvt, function (viewsId) {
                    // Views to update on supervision
                    if (viewsId.length > 0) {
                        // NOTIFY ALL THE SUPERVISIONS THAT SOMETHING HAVE CHANGED !
                        messenger.supervisionBroadcast("view_event", viewsId);
                        resolve();
                    }
                    else{
                        resolve();
                    }
                }, data.ackID);
            }
            else{
                resolve();
            }
        }.bind(this));

        // COUNTER
        var pCounters = Q.promise(function (resolve, reject) {
            if (aCounterEvt.length > 0) {
                // INSERT THE COUNTER EVENTS GATHERED
                counterModel.insertCounterEvents(this.pool, aCounterEvt);
            }
            resolve();
        }.bind(this));

        // DISPLAY
        var pDisplays = Q.promise(function (resolve, reject) {
            if (aDisplayEvt.length > 0) {
                // INSERT THE DISPLAY EVENTS GATHERED
                displayModel.insertDisplayEvents(this.pool, aDisplayEvt);
            }
            resolve();
        }.bind(this));

        // BUS
        var pBusses = Q.promise(function (resolve, reject) {
            if (aBusEvt.length > 0) {
                // INSERT THE BUS EVENTS GATHERED
                busModel.insertBusEvents(this.pool, aBusEvt);
            }
            resolve();
        }.bind(this));


        // Send next event query when all inserted
        Q.all([pSensors, pViews, pCounters, pDisplays, pBusses]).then(function(){
            //logger.log('info', "##### CHUNK FINISHED, NEXT"+data.ackID);
            // Send the next EventQuery
            this.events_controller.sendEventQuery(data.ackID);
        }.bind(this));
    }
}

module.exports = EventsLifeCycle;
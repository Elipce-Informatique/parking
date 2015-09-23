/**
 * Created by yann on 07/08/2015.
 */
// Dependencies
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var Q = require('q');

// Local modules
var logger = require('../utils/logger.js');
var messenger = require('../utils/messenger.js');
var sensorModel = require('../models/sensor.js');
var displayModel = require('../models/display.js');
var helper = require('../utils/general_helper.js');

/**
 * Class that handle bus enum messages.
 */
function BusEnumeration() {
    EventEmitter.call(this);

    // VARIABLES
    this.sensors = {};
    this.displays = {};
    this.controllers = [];// Controllers from busConfigQuery
    this.pool = null;
    // Mysql connexion with pool : only 1 connexion VERY IMORTANT
    if (this.pool === null) {
        this.pool = require('../utils/mysql_helper.js').pool();
    }
}

// Extend EventEmitter to use this.emit
util.inherits(BusEnumeration, EventEmitter);

/**
 * Start a background bus enumeration job on controller
 * @param bus: bus infos
 */
BusEnumeration.prototype.startJobBusEnum = function (bus) {
    logger.log('info', 'START JOB : BUS ENUM on bus ' + bus.ID)
    messenger.sendToController("startJob", {
        job: "busEnum",
        class: "bus",
        ID: bus.ID
    });
}

/**
 * Controller answer a bus enum start job
 * @param data: see usherJSON
 */
BusEnumeration.prototype.onBusEnum = function (data) {
    // State "start" just an information
    switch (data.state) {
        case "start":
            logger.log('info', "START BUSENUM ON BUS " + data.ID);
            break;
        case "update":
            // Store equipment in DB
            switch (data.param.class) {
                case "sensor": // sensor to insert on the bus data.ID
                    if (this.sensors[data.ID] === undefined) {
                        this.sensors[data.ID] = {
                            data: [data.param],
                            inserted: false
                        };
                    }
                    break;
                case "display": // display to insert
                    if (this.displays[data.ID] === undefined) {
                        this.displays[data.ID] = {
                            data: [data.param],
                            inserted: false
                        };
                    }
                    break;
                default:
                    logger.log('error', 'onBusEnum equipment ' + data.param.class + ' does not exist');
                    break;
            }
            break;
        case "test": // Test from page test with sensors on bus 1 (en dur)
            // Sensors on this bus
            this.sensors[data.ID].data = data.param;
        case "done":
            // Process sensors inserts on the bus data.ID
            if (this.sensors[data.ID] !== undefined && this.sensors[data.ID].data.length > 0) {
                sensorModel.insertSensorsFromBusEnum(data.ID, this.sensors[data.ID].data)
                    .then(function ok(sensorsInserted) {
                        // At least 1 sensor to insert
                        if (sensorsInserted.length > 0) {
                            // Send sensors to controller DB
                            messenger.sendToController("sensorConfigUpdate", {
                                busID: data.ID,
                                sensor: sensorsInserted
                            });
                            logger.log('info', 'sensorConfigUpdate ', sensorsInserted);

                            // Update network address
                            var busEnumJson = helper.dbSensorsToBusEnum(sensorsInserted);
                            messenger.sendToController("startJob", {
                                job: "busEnum",
                                class: "bus",
                                ID: data.ID,
                                param: busEnumJson
                            });
                            logger.log('info', 'busEnumUpdate on bus ' + data.ID, busEnumJson);
                        }
                        else {
                            logger.log('info', 'BUSENUM DONE, NO SENSORS TO INSERT ');
                        }
                        // Sensors on this bus inserted or already inserted
                        this.sensors[data.ID].inserted = true;

                        // Bus enum finished
                        if (this.checkInitFinished()) {
                            logger.log('info', 'EMIT init_parking_finished');
                            this.emit('init_parking_finished');
                        }

                    }.bind(this), function ko(err) {
                        logger.log('error', 'Supervision DB error : sensors not inserted from BusEnum ', err);
                    });
            }
            // Displays inserts
            if (this.displays[data.ID] !== undefined && this.displays[data.ID].length > 0) {
                displayModel.insertDisplaysFromBusEnum(data.ID, this.displays[data.ID]);
            }
            break;
        case "failed":
            logger.log('error', 'BusEnum failed on bus ' + data.ID);
            this.sensors[data.ID] = {
                data: [],
                inserted: true
            };
            this.displays[data.ID] = {
                data: [],
                inserted: true
            };
            break;
        default:
            break;
    }
}

/**
 * Set this.controllers variable
 * @param data: controllers and buses from busConfigQuery
 */
BusEnumeration.prototype.setControllers = function (data) {
    this.controllers = data;
}

/**
 * Set this.controllers variable
 * @param data: controllers and buses from busConfigQuery
 */
BusEnumeration.prototype.checkInitFinished = function () {

    logger.log('info', 'controllers: ',this.controllers);
    // Parse controllers
    this.controllers.forEach(function (controller) {
        // Parse busses
        controller.bus.forEach(function (bus) {
            //logger.log('info', 'CAN ?: '+bus.protocol+' bus ID '+bus.ID);
            if (bus.protocol == 'CAN' && (this.sensors[bus.ID] === undefined || !this.sensors[bus.ID].inserted)) {
                return false;
            }
        }, this);
    }, this);

    return true;
}

module.exports = BusEnumeration;

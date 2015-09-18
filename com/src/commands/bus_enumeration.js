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
        case "update":
            // Store equipment in DB
            switch (data.param.class) {
                case "sensor": // sensor to insert on the bus data.ID
                    if (this.sensors[data.ID] === undefined) {
                        this.sensors[data.ID] = [];
                    }
                    this.sensors[data.ID].push(data.param);
                    break;
                case "display": // display to insert
                    if (this.displays[data.ID] === undefined) {
                        this.displays[data.ID] = [];
                    }
                    this.displays[data.ID].push(data.param);
                    break;
                default:
                    logger.log('error', 'onBusEnum equipment ' + data.param.class + ' does not exist');
                    break;
            }
            break;
        case "done":
            // Process sensors inserts on the bus
            if (this.sensors[data.ID] !== undefined && this.sensors[data.ID].length > 0) {
                sensorModel.insertSensorsFromBusEnum(this.pool, data.ID, this.sensors[data.ID])
                    .then(function ok(sensorsInserted) {
                        // Send sensors to controller DB
                        messenger.sendToController("sensorConfigUpdate", {
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
                        logger.log('info', 'busEnumUpdate ', busEnumJson);

                    }, function ko(err) {
                        logger.log('error', 'Supervision SB error : sensors not inserted from BusEnum ', err);
                    });
            }
            // Displays inserts
            if (this.displays[data.ID] !== undefined && this.displays[data.ID].length > 0) {
                displayModel.insertDisplaysFromBusEnum(data.ID, this.displays[data.ID]);
            }
            break;
        case "failed":
            logger.log('error', 'BusEnum failed on bus ' + data.ID);
            break;
        default:
            break;
    }

}


module.exports = BusEnumeration;
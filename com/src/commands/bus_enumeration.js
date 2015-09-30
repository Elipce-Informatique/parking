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
    this.emitDelta = []; // delta between busEnum and supervision
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
                            data: [],
                            inserted: false
                        };
                    }
                    this.sensors[data.ID].data.push(data.param);
                    break;
                case "display": // display to insert
                    if (this.displays[data.ID] === undefined) {
                        this.displays[data.ID] = {
                            data: [],
                            inserted: false
                        };
                    }
                    this.displays[data.ID].data.push(data.param);
                    break;
                default:
                    logger.log('error', 'onBusEnum equipment ' + data.param.class + ' does not exist');
                    break;
            }
            break;
        case "test": // Test from page test with sensors on bus 1 (en dur)
            // Init
            this.sensors[data.ID] = {
                data: [],
                inserted: false
            };
            // Sensors on this bus
            this.sensors[data.ID].data = data.param;
        case "done":
            //logger.log('info', "BUSENUM DONE. INIT MODE "+global.initMode);
            // Classic busEnum init mode
            if (global.initMode == 1) {
                //logger.log('info', "PROCESS INIT 1");
                this.processInit1(data);
            }
            // Virtual sensors init mode
            if (global.initMode == 2) {
                //logger.log('info', "PROCESS INIT 1");
                this.processInit2(data);
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
 * Check if all busses are init
 */
BusEnumeration.prototype.checkInitFinished = function () {

    //logger.log('info', 'controllers: ',this.controllers);
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

/**
 * On a DONE busEnum, process data when we are in init 1
 * @param data: data from busEnum
 * @constructor
 */
BusEnumeration.prototype.processInit1 = function (data) {
    // Process sensors inserts on the bus data.ID
    if (this.sensors[data.ID] !== undefined && this.sensors[data.ID].data.length > 0) {
        //logger.log('info', "BUSSSSSS");
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
}

/**
 * On a DONE busEnum, process data when we are in init 2
 * @param data: data from busEnum
 * @constructor
 */
BusEnumeration.prototype.processInit2 = function (data) {
    // Process sensors inserts on the bus data.ID
    if (this.sensors[data.ID] !== undefined && this.sensors[data.ID].data.length > 0) {
        // Init bus
        var emitObj = {
            bus: data.ID
        };

        // Start sensors synchro between virtuals and busEnum
        sensorModel.synchroSensors(this.pool, data.ID, this.sensors[data.ID].data, function ok(obj) {
                //logger.log('info', "SYNCHRO RESULT",obj)
                var sensorsDelta = obj.delta;
                var sensorsInserted = obj.sensors;

                // At least 1 sensor to insert in controllerDB
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
                    logger.log('info', 'BUSENUM DONE, NO SENSORS TO INSERT IN CONTROLLER DB AND TO ADDRESS ');
                }

                // At least 1 sensor In bus Enum and not in supervision DB
                if (sensorsDelta.length > 0) {
                    logger.log('error', 'SENSORS FROM BUSENUM NOT IN SUPERVISION DB', sensorsDelta);
                    emitObj.delta = sensorsDelta;
                    // Push to global variable
                    this.emitDelta.push(emitObj);
                }
                // All sensors are OK
                else {
                    // Open bus
                    messenger.sendToController("remoteControl", {
                        command: "start",
                        class: "bus",
                        ID: data.ID
                    });
                }

                // Sensors on this bus inserted or already inserted
                this.sensors[data.ID].inserted = true;

                // ALL Bus enum finished
                if (this.checkInitFinished()) {
                    logger.log('info', 'EMIT init_parking_finished', this.emitDelta);
                    this.emit('init_parking_finished', this.emitDelta);
                    this.emitDelta = [];
                }

            }.bind(this), function ko(err) {
                logger.log('error', 'Supervision DB error : sensors not synchro from BusEnum ', err);
            });
    }
    // Displays inserts
    if (this.displays[data.ID] !== undefined && this.displays[data.ID].length > 0) {
        displayModel.insertDisplaysFromBusEnum(data.ID, this.displays[data.ID]);
    }
}


module.exports = BusEnumeration;

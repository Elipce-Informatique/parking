// Dependencies
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var mysql = require('mysql');
var _ = require('lodash');


// Local modules
var logger = require('../utils/logger.js');
var errorHandler = require('../message_routes.js');
var messenger = require('../utils/messenger.js');
var servModel = require('../models/server.js');
var busModel = require('../models/bus.js');
var sensorModel = require('../models/sensor.js');
var displayModel = require('../models/display.js');
var counterModel = require('../models/counter.js');
var viewModel = require('../models/view.js');
var parkingModel = require('../models/parking.js');
var settingModel = require('../models/setting.js');


// -----------------------------------------------------------------
// Creates the Config class
function Config() {
    if (this instanceof Config === false) {
        throw new TypeError("Classes can't be function-called");
    }
    EventEmitter.call(this);
}

// Extend EventEmitter to use this.emit
util.inherits(Config, EventEmitter);
// -----------------------------------------------------------------

// Define the Config class
// -----------------------------------------------------------------
/**
 * Capabilities message received from the controller
 * @param data
 * @param client
 */
Config.prototype.onCapabilities = function (data, client) {
    this.emit('capabilitiesData', data);

    global.controllerClient = client;
    client.isController = true;
};


/**
 * COM server capabilities
 * @param port: port used to communicate
 * @param client: websocket client
 */
Config.prototype.sendCapabilities = function (client) {

    servModel.getCapabilities(global.port, function (err, rows, fields) {

        // Error
        if (err) {
            // SQL error
            logger.log('error', 'capabilities SQL error ' + err.message);
            messenger.sendToController('capabilities', {}, {
                action: "SQL error",
                text: err.message
            });
        }
        // No error
        else {
            // Update result
            logger.log('info', 'Sending capabilities answer ! ', rows[0]);
            messenger.sendToController('capabilities', rows[0]);
        }
    });
};


/**
 * Parking ID
 */
Config.prototype.setParkingId = function () {

    parkingModel.getInfos(global.port, function (err, result) {

        if (err) {
            logger.log('error', 'Model parking, function getInfos callback error');
        }
        else {
            global.parkingId = result[0]['id'];
        }
    });

};

// --------------------------------------------------------------------------------------------
/**
 * Sends a remoteControl command to the controller
 *
 * @param command : string -> the command to send on the remoteControl query
 */
Config.prototype.sendRemoteControl = function (command) {
    messenger.sendToController("remoteControl", {
        "command": command
    });
};

// --------------------------------------------------------------------------------------------
/**
 * Send the configuration query (without params)
 * to fetch controller's configuration
 */
Config.prototype.sendConfigurationQuery = function () {
    messenger.sendToController("configuration", {});
};
/**
 * Get the configuration data
 * to fetch controller's configuration
 */
Config.prototype.onConfigurationData = function (data) {
    this.emit('configurationData', data);
};

/**
 * Send the configuration update (without data)
 * to update controller's configuration
 */
Config.prototype.sendConfigurationUpdate = function (data) {
    messenger.sendToController("configuration", data);
};

// --------------------------------------------------------------------------------------------
/**
 * Get all parking buses
 */
Config.prototype.getSupervisionBuses = function (client) {
    busModel.getBuses(global.port, function (err, result) {
        if (err) {
            logger.log('error', 'Model bus, function getBuses callback error');
        }
        // Get busses OK
        else {
            logger.log('info', 'getSupervisionBuses', result);
            this.emit('onGetSupervisionBuses', result, client);
        }
    }.bind(this))
};

/**
 * Send a busConfigQuery to the controller
 * @param client : socket from which the initial query comes from
 */
Config.prototype.sendBusConfigQuery = function (client) {
    messenger.sendToController("busConfigQuery", {}, {}, client);
};


/**
 * Insert the configuration of all the buses in DB
 * @param data: data key from the response
 */
Config.prototype.onBusConfigData = function (data) {
    // At least 1 controller
    if (_.isArray(data) && data.length > 0) {
        // Insert buses and controllers
        busModel.insertBuses(data, function (bool) {
            // Busses inserted OK
            if (bool) {
                logger.log('info','BUSSES inserted EMIT busConfigData');
                this.emit('busConfigData', data);
            }
            // Busses NOT inserted
            else {
                logger.log('error', 'BUSSES NOT INSERTED, BUS ENUM NOT LAUNCHED')
            }
        }.bind(this));
    }
};

/**
 * Send a busConfigUpdate to the controller
 * @param dataUpdate: data to send to the controller for the update
 * @param client: WS client which send busConfigUpdate
 */
Config.prototype.sendBusConfigUpdate = function (dataUpdate, client) {
    messenger.sendToController("busConfigUpdate", {'bus': dataUpdate}, {}, client);
};

/**
 * The last busConfigUpdate has been completed
 */
Config.prototype.onBusConfigUpdateDone = function (data) {
    this.emit('busConfigUpdateDone', data);

    logger.log('info', 'onBusConfigUpdateDone received: %o', data);
};

// --------------------------------------------------------------------------------------------
/**
 * Send a sensorConfigQuery to the controller
 */
Config.prototype.sendSensorConfigQuery = function (busId, client) {
    messenger.sendToController("sensorConfigQuery", {
        "busID": busId
    }, {}, client);
};

/** TODO
 * insert the configuration of all the sensors for one bus in DB
 * @param data: data key from the response
 */
Config.prototype.onSensorConfigData = function (data) {
    this.emit('sensorConfigData', data);
    // At least 1 sensor on the current bus
    if (_.isArray(data.sensor) && data.sensor.length > 0) {
        sensorModel.insertSensors(data.busID, data.sensor);
    }
    // No more sensors on the bus : END scan
    else {
        // Send to init_parking: sensors inserted on the current controller
        //logger.log('info', '------NOTIFICATION onEmptyBus');
        global.events.emit('emptyBus', data.busID);
    }
};

/** TODO
 * Send a sensorConfigUpdate to the controller
 * @param dataUpdate: data to send to the controller for the update
 */
Config.prototype.sendSensorConfigUpdate = function (dataUpdate) {

};

/**
 * The last sensorConfigUpdate has been completed
 */
Config.prototype.onSensorConfigUpdateDone = function () {
    this.emit('sensorConfigUpdateDone');

    logger.log('info', 'onBusConfigUpdateDone');
};

// --------------------------------------------------------------------------------------------
/**
 * Send a displayConfigQuery to the controller
 * @param busId: bus id to get all displays config infos
 */
Config.prototype.sendDisplayConfigQuery = function (busId, client) {
    messenger.sendToController("displayConfigQuery", {
        "busID": busId
    }, {}, client);
};

/**
 * insert the configuration of all the displays for one bus in DB
 * @param data: data key from the response
 */
Config.prototype.onDisplayConfigData = function (data) {
    this.emit('displayConfigData', data);
    // At least 1 display
    if (_.isArray(data.display) && data.display.length > 0) {
        logger.log('info', 'onDisplayConfigData received: %o', data);
        displayModel.insertDisplays(data.busID, data.display);
    }
};

/** TODO
 * Send a sensorConfigUpdate to the controller
 * @param dataUpdate: data to send to the controller for the update
 */
Config.prototype.sendDisplayConfigUpdate = function (dataUpdate) {

};

/**
 * The last displayConfigUpdate has been completed
 */
Config.prototype.onDisplayConfigUpdateDone = function () {
    this.emit('displayConfigUpdateDone');

    logger.log('info', 'onDisplayConfigUpdateDone');
};

// --------------------------------------------------------------------------------------------
/**
 * Send a counterConfigQuery to the controller
 */
Config.prototype.sendCounterConfigQuery = function (client) {
    messenger.sendToController("counterConfigQuery", {}, {}, client);
};

/**
 * insert the configuration of all the counters in DB
 * @param data: data key from the response
 */
Config.prototype.onCounterConfigData = function (data) {
    this.emit('counterConfigData', data);

    //logger.log('info', 'onCounterConfigData received: %o', data);

    // At least 1 counter
    if (_.isArray(data) && data.length > 0) {
        logger.log('info', 'onCounterConfigData received: %o', data);
        counterModel.insertCounters(data);
    }
};

/** TODO
 * Send a counterConfigUpdate to the controller
 * @param dataUpdate: data to send to the controller for the update
 */
Config.prototype.sendCounterConfigUpdate = function (dataUpdate) {

};

/**
 * The last counterConfigUpdate has been completed
 */
Config.prototype.onCounterConfigUpdateDone = function () {
    this.emit('counterConfigUpdateDone');

    logger.log('info', 'onCounterConfigUpdateDone');
};

// --------------------------------------------------------------------------------------------
/**
 * Send a viewConfigQuery to the controller
 */
Config.prototype.sendViewConfigQuery = function (client) {
    messenger.sendToController("viewConfigQuery", {}, {}, client);
};

/**
 * insert the configuration of all the views in DB
 * @param data: data key from the response
 */
Config.prototype.onViewConfigData = function (data) {
    this.emit('viewConfigUpdateDone', data);
    //logger.log('info', 'onViewConfigData received: %o', data);
    // At least 1 view
    if (_.isArray(data) && data.length > 0) {
        logger.log('info', 'onViewConfigData received: %o', data);
        viewModel.insertViews(data);
    }
};

/** TODO
 * Send a viewConfigUpdate to the controller
 * @param dataUpdate: data to send to the controller for the update
 */
Config.prototype.sendViewConfigUpdate = function (dataUpdate) {

};

/**
 * The last viewConfigUpdate has been completed
 */
Config.prototype.onViewConfigUpdateDone = function () {
    logger.log('info', 'onViewConfigUpdateDone');
};

// --------------------------------------------------------------------------------------------
/**
 * Send a settingsQuery to the controller
 */
Config.prototype.sendSettingsQuery = function (client) {
    messenger.sendToController("settingsQuery", {}, {}, client);
};

/**
 * insert the settings
 * @param data: data key from the response
 */
Config.prototype.onSettingsData = function (data) {
    this.emit('settingsData', data);

    // At least 1 setting
    if (_.isArray(data) && data.length > 0) {
        logger.log('info', 'onSettingsData received: ', data);
        settingModel.insertSettings(data);
    }
};
/**
 * The last sensorConfigUpdate has been completed
 */
Config.prototype.onSettingsUpdateDone = function () {
    this.emit('settingsUpdateDone');

    logger.log('info', 'onSettingsUpdateDone');
};

// --------------------------------------------------------------------------------------------
/**
 * Send a notification to the client when parking initialization finished
 * @param client
 */
Config.prototype.sendNotificationInitFinished = function (client, busId) {
    logger.log('info', '************** NOTIFICATION CLIENT init_parking_finished ON BUS ', busId);
    messenger.send(client, 'init_parking_finished', {});

};


module.exports = Config;
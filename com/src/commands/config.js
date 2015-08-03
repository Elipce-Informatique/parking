// Dependencies
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var mysql = require('mysql');


// Local modules
var logger = require('../utils/logger.js');
var errorHandler = require('../message_routes.js');
var servModel = require('../models/server.js');
var messenger = require('../utils/messenger.js');


// -----------------------------------------------------------------
// Creates the Config class
function Config() {

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
    this.sendCapabilities(client);
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
            messenger.send(client, 'capabilities', {}, {
                action: "SQL error",
                text: err.message
            });
        }
        // No error
        else {
            // Update result
            logger.log('info', 'Sending capabilities answer ! ');
            messenger.send(client, 'capabilities', rows[0]);

            //var message = {
            //    "messageType": "capabilities",
            //    "data": rows[0]
            //};
            //client.send(JSON.stringify(message), errorHandler.onSendError);
            //logger.log('info', '2 - capabilities answer OK : ');

        }

        // Close DB
        // connexion.end(); // Attention fait BUGGER ???
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

    logger.log('info', 'Config data from controller : %o', data);
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
 * Send a busConfigQuery to the controller
 * @param client : socket from which the initial query comes from
 */
Config.prototype.sendBusConfigQuery = function (client) {
    messenger.sendToController("busConfigQuery", {}, {}, client);
};


/**
 * insert the configuration of all the buses in DB
 * @param data: data key from the response
 */
Config.prototype.onBusConfigData = function (data) {
    this.emit('busConfigData', data);

    // At least 1 controller
    if (data.length > 0) {
        //Query structure
        var sql = "INSERT IGNORE INTO bus(concentrateur_id, `type`, num, protocole, parameter, name, v4_id)" +
            "VALUES (?,?,?,?,?,?,?)";
        // Mysql connector
        var connection = require('../utils/mysql_helper.js');
        // Transaction
        connection.beginTransaction(function (err) {

            // Parse controllers
            data.forEach(function (controller) {
                // Parking and controller infos from port and controller ID
                var sqlController = "" +
                    "SELECT c.id " +
                    "FROM server_com s " +
                    "JOIN parking p ON p.id=s.parking_id " +
                    "JOIN concentrateur c ON c.parking_id=p.id " +
                    "WHERE s.protocol_port = ? " +
                    "AND c.v4_id = ? ";

                connection.query(sqlController, [global.port, controller.controllerID], function (err, rows) {
                    if (err) {
                        return connection.rollback(function () {
                            logger.log('error', 'busConfigData: SELECT controller transaction rollback: ' + sqlController);
                        });
                    }
                    else {

                        // At least 1 bus
                        if (controller.bus.length > 0) {
                            var concentrateurId = rows[0]['id'];
                            // Parse buses
                            controller.bus.forEach(function (bus) {

                                // Prepare sql
                                var inst = mysql.format(sql, [
                                    concentrateurId,
                                    bus.busType,
                                    bus.busNumber,
                                    bus.protocol,
                                    bus.parameter,
                                    bus.name,
                                    bus.ID]);

                                // Insert bus
                                connection.query(inst, function (err, result) {
                                    if (err) {
                                        return connection.rollback(function () {
                                            logger.log('error', 'busConfigData: Transaction rollback: ' + inst);
                                        });
                                    } else {
                                        logger.log('info', 'inserted query: ' + inst);
                                    }
                                });
                            }, this);
                        }
                    }
                });

            }, this);
            // COMMIT
            connection.commit(function (err) {
                if (err) {
                    return connection.rollback(function () {
                        logger.log('error', 'busConfigData: Transaction rollback: General');
                    });
                }
                else {
                    logger.log('info', 'busConfigData: Transaction commit');
                }
            });
        });
    }

};

/** TODO
 * Send a busConfigUpdate to the controller
 * @param dataUpdate: data to send to the controller for the update
 */
Config.prototype.sendBusConfigUpdate = function (dataUpdate) {

};

/** TODO
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

    logger.log('info', 'onSensorConfigData received: %o', data);
};

/** TODO
 * Send a sensorConfigUpdate to the controller
 * @param dataUpdate: data to send to the controller for the update
 */
Config.prototype.sendSensorConfigUpdate = function (dataUpdate) {

};

/** TODO
 * The last sensorConfigUpdate has been completed
 */
Config.prototype.onSensorConfigUpdateDone = function (data) {
    this.emit('sensorConfigUpdateDone', data);

    logger.log('info', 'onBusConfigUpdateDone received: %o', data);
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

/** TODO
 * insert the configuration of all the displays for one bus in DB
 * @param data: data key from the response
 */
Config.prototype.onDisplayConfigData = function (data) {
    this.emit('displayConfigData', data);

    logger.log('info', 'onDisplayConfigData received: %o', data);
};

/** TODO
 * Send a sensorConfigUpdate to the controller
 * @param dataUpdate: data to send to the controller for the update
 */
Config.prototype.sendDisplayConfigUpdate = function (dataUpdate) {

};

/** TODO
 * The last displayConfigUpdate has been completed
 */
Config.prototype.onDisplayConfigUpdateDone = function (data) {
    this.emit('displayConfigUpdateDone', data);

    logger.log('info', 'onDisplayConfigUpdateDone received: %o', data);
};

// --------------------------------------------------------------------------------------------
/**
 * Send a counterConfigQuery to the controller
 */
Config.prototype.sendCounterConfigQuery = function (client) {
    messenger.sendToController("counterConfigQuery", {}, {}, client);
};

/** TODO
 * insert the configuration of all the counters in DB
 * @param data: data key from the response
 */
Config.prototype.onCounterConfigData = function (data) {
    this.emit('counterConfigData', data);

    logger.log('info', 'onCounterConfigData received: %o', data);
};

/** TODO
 * Send a counterConfigUpdate to the controller
 * @param dataUpdate: data to send to the controller for the update
 */
Config.prototype.sendCounterConfigUpdate = function (dataUpdate) {

};

/** TODO
 * The last counterConfigUpdate has been completed
 */
Config.prototype.onCounterConfigUpdateDone = function (data) {
    this.emit('counterConfigUpdateDone', data);

    logger.log('info', 'onCounterConfigUpdateDone received: %o', data);
};

// --------------------------------------------------------------------------------------------
/**
 * Send a viewConfigQuery to the controller
 */
Config.prototype.sendViewConfigQuery = function (client) {
    messenger.sendToController("viewConfigQuery", {}, {}, client);
};

/** TODO
 * insert the configuration of all the views in DB
 * @param data: data key from the response
 */
Config.prototype.onViewConfigData = function (data) {
    logger.log('info', 'onViewConfigData received: %o', data);
};

/** TODO
 * Send a viewConfigUpdate to the controller
 * @param dataUpdate: data to send to the controller for the update
 */
Config.prototype.sendViewConfigUpdate = function (dataUpdate) {

};

/** TODO
 * The last viewConfigUpdate has been completed
 */
Config.prototype.onViewConfigUpdateDone = function () {
    logger.log('info', 'onViewConfigUpdateDone received: %o', data);
};

// --------------------------------------------------------------------------------------------


module.exports = Config;
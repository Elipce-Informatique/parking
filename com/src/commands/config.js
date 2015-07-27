// Dependencies
var mysql = require('mysql');

// Local modules
var logger = require('../utils/logger.js');
var errorHandler = require('../message_routes.js');
var servModel = require('../models/server.js');

module.exports = {
    onCapabilities: function (data, client) {
        global.controllerClient = client;
        client.isController = true;
        // Send capabilities back to the controller
        this.sendCapabilities(port, client)
    },
    /**
     * COM server capabilities
     * @param port: port used to communicate
     * @param client: websocket client
     */
    sendCapabilities: function (port, client) {

        servModel.getCapabilities(port, function (err, rows, fields) {
            // Variables
            var retour = {
                messageType: 'capabilities',
                data: {}
            };

            // Error
            if (err) {
                // SQL error
                logger.log('error', 'capabilities SQL error ' + err.message);
                retour = {
                    messageType: 'capabilities',
                    error: {
                        action: "SQL error",
                        text: err.message
                    }
                }
            }
            // No error
            else {
                // Update result
                retour.data = rows[0];
                logger.log('info', 'capabilities answer OK : ' + retour.data);
            }

            // Send
            client.send(JSON.stringify(retour), errorHandler.onSendError);

            // Close DB
            // connexion.end(); // Attention fait BUGGER ???
        });
    },

    // --------------------------------------------------------------------------------------------
    /**
     * Send a busConfigQuery to the controller
     */
    sendBusConfigQuery: function (client) {
        // There is no controller yet
        if (global.controllerClient == null) {
            // Error message to the original client
            client.send(JSON.stringify({
                "messageType": "busConfigQuery"
            }), errorHandler.onSendError);
        } else {
            global.controllerClient.send(JSON.stringify({
                "messageType": "busConfigQuery"
            }), errorHandler.onSendError);
        }
    },

    /**
     * insert the configuration of all the buses in DB
     * @param port: port used to communicate
     * @param data: data key from the response
     */
    onBusConfigData: function (port, data) {
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

                    connection.query(sqlController, [port, controller.controllerID], function (err, rows) {
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

    },
    /** TODO
     * Send a busConfigUpdate to the controller
     * @param dataUpdate: data to send to the controller for the update
     */
    sendBusConfigUpdate: function (dataUpdate) {

    },
    /** TODO
     * The last busConfigUpdate has been completed
     */
    onBusConfigUpdateDone: function (data) {
        logger.log('info', 'onBusConfigUpdateDone received: %o', data);
    },
    // --------------------------------------------------------------------------------------------
    /**
     * Send a sensorConfigQuery to the controller
     */
    sendSensorConfigQuery: function (busId) {
        global.controllerClient.send(JSON.stringify({
            "messageType": "sensorConfigQuery",
            "data": {
                "busID": busId
            }
        }), errorHandler.onSendError);
    },
    /** TODO
     * insert the configuration of all the sensors for one bus in DB
     * @param data: data key from the response
     */
    onSensorConfigData: function (data) {
        logger.log('info', 'onSensorConfigData received: %o', data);
    },
    /** TODO
     * Send a sensorConfigUpdate to the controller
     * @param dataUpdate: data to send to the controller for the update
     */
    sendSensorConfigUpdate: function (dataUpdate) {

    },
    /** TODO
     * The last sensorConfigUpdate has been completed
     */
    onSensorConfigUpdateDone: function (data) {
        logger.log('info', 'onBusConfigUpdateDone received: %o', data);
    },
    // --------------------------------------------------------------------------------------------
    /**
     * Send a displayConfigQuery to the controller
     * @param busId: bus id to get all displays config infos
     */
    sendDisplayConfigQuery: function (busId) {
        global.controllerClient.send(JSON.stringify({
            "messageType": "displayConfigQuery",
            "data": {
                "busID": busId
            }
        }), errorHandler.onSendError);
    },
    /** TODO
     * insert the configuration of all the displays for one bus in DB
     * @param data: data key from the response
     */
    onDisplayConfigData: function (data) {
        logger.log('info', 'onDisplayConfigData received: %o', data);
    },
    /** TODO
     * Send a sensorConfigUpdate to the controller
     * @param dataUpdate: data to send to the controller for the update
     */
    sendDisplayConfigUpdate: function (dataUpdate) {

    },
    /** TODO
     * The last displayConfigUpdate has been completed
     */
    onDisplayConfigUpdateDone: function (data) {
        logger.log('info', 'onDisplayConfigUpdateDone received: %o', data);
    },
    // --------------------------------------------------------------------------------------------
    /**
     * Send a counterConfigQuery to the controller
     */
    sendCounterConfigQuery: function () {
        global.controllerClient.send(JSON.stringify({
            "messageType": "counterConfigQuery"
        }), errorHandler.onSendError);
    },
    /** TODO
     * insert the configuration of all the counters in DB
     * @param data: data key from the response
     */
    onCounterConfigData: function (data) {
        logger.log('info', 'onCounterConfigData received: %o', data);
    },
    /** TODO
     * Send a counterConfigUpdate to the controller
     * @param dataUpdate: data to send to the controller for the update
     */
    sendCounterConfigUpdate: function (dataUpdate) {

    },
    /** TODO
     * The last counterConfigUpdate has been completed
     */
    onCounterConfigUpdateDone: function (data) {
        logger.log('info', 'onCounterConfigUpdateDone received: %o', data);
    },
    // --------------------------------------------------------------------------------------------
    /**
     * Send a viewConfigQuery to the controller
     */
    sendViewConfigQuery: function () {
        global.controllerClient.send(JSON.stringify({
            "messageType": "viewConfigQuery"
        }), errorHandler.onSendError);
    },
    /** TODO
     * insert the configuration of all the views in DB
     * @param data: data key from the response
     */
    onViewConfigData: function (data) {
        logger.log('info', 'onViewConfigData received: %o', data);
    },
    /** TODO
     * Send a viewConfigUpdate to the controller
     * @param dataUpdate: data to send to the controller for the update
     */
    sendViewConfigUpdate: function (dataUpdate) {

    },
    /** TODO
     * The last viewConfigUpdate has been completed
     */
    onViewConfigUpdateDone: function () {
        logger.log('info', 'onViewConfigUpdateDone received: %o', data);
    }
    // --------------------------------------------------------------------------------------------
};
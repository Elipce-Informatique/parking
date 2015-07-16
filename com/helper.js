// Dependencies
var mysql = require('mysql');

var server = ({
    /**
     * COM server capabilities
     * @param port: port used to communicate
     * @param client: websocket client
     */
    capabilities: function (port, client) {
        // Dependencies
        var connexion = require('./mysql.js');

        // Variables
        var retour = {
            messageType: 'capabilities',
            data: {}
        }
        // Query
        var sql = "" +
            "SELECT protocol_version AS protocolVersion," +
            "protocol_port AS protocolPort," +
            "software_name AS softwareName," +
            "software_version AS softwareVersion," +
            "software_build_date AS softwareBuildDate," +
            "software_os AS softwareOs, " +
            "'" + Date.now() + "' AS `date` " +
            "FROM server_com " +
            "WHERE protocol_port = ?";

        // Exectute
        connexion.query(sql, port, function (err, rows, fields) {
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
                logger.log('info', 'capabilities answer OK');
            }

            // Send
            client.send(JSON.stringify(retour));

            // Close DB
            //connexion.end(); // Attention fait BUGGER ???
        });
    },

    /**
     * Configuration of all the buses
     * @param port: port used to communicate
     * @param controllers: array in data key
     */
    busConfigData: function (port, controllers) {
        // At least 1 controller
        if (controllers.length > 0) {
            //Query structure
            // TODO v4_id unique dans la base + insert igore
            var sql = "INSERT INTO bus(concentrateur_id, `type`, num, protocole, parameter, name)" +
                "VALUES (?,?,?,?,?,?)";
            // Mysql connector
            var connection = require('./mysql.js');
            // Transaction
            connection.beginTransaction(function (err) {

                // Parse controllers
                controllers.forEach(function (controller) {
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
                        else{

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
                                        bus.name]);

                                    // Insert bus
                                    connection.query(inst, function (err, result) {
                                        if (err) {
                                            return connection.rollback(function () {
                                                logger.log('error', 'busConfigData: Transaction rollback: ' + inst);
                                            });
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

    }
});

module.exports.Server = server;


// LOG
var path = require('path');
var winston = require('winston');

var filename = path.join(__dirname, '/log/event');
var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.DailyRotateFile)({filename: filename})
    ]
});

module.exports.Log = logger;


// ONLY USED FOR TESTS
var client = ({
    /**
     * Client send capabilities infos (contoller)
     * @returns {{messageType: string, data: {toto: string}}}
     */
    capabilities: function () {
        var retour = {
            messageType: 'capabilities',
            data: {}
        }
        return retour;
    },

    busConfigData: function () {
        return {
            "messageType": "busConfigData",
            "data": [
                {
                    "controllerID": 1,
                    "bus": [
                        {
                            "ID": 1,
                            "busType": "CAN",
                            "busNumber": 1,
                            "protocol": "p8",
                            "parameter": "ter",
                            "name": "A"
                        },
                        {
                            "ID": 2,
                            "busType": "CAN",
                            "busNumber": 2,
                            "protocol": "p8",
                            "parameter": "ter",
                            "name": "B"
                        }
                    ]
                },
                {
                    "controllerID": 2,
                    "bus": [
                        {
                            "ID": 3,
                            "busType": "CAN",
                            "busNumber": 1,
                            "protocol": "p8",
                            "parameter": "ter",
                            "name": "A"
                        }
                    ]
                }
            ]

        }
    },

    busConfigQuery: function () {
        return {
            messageType: "busConfigQuery",
            data: {}
        }
    }
});

module.exports.Client = client;
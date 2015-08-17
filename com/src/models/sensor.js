/**
 * Created by yann on 24/07/2015.
 */

var logger = require('../utils/logger.js');
var errorHandler = require('../utils/error_handler.js');

var mysql = require('mysql');
//Enable mysql-queues
var queues = require('mysql-queues');
var _ = require('lodash');
var Q = require('q');

module.exports = {
    /**
     * Sensors structure :
     * [{
     *        "ID": < number > ,
     *        "address": < number > ,
     *        "spaceType": < string > ,
     *        "overstay": < number > ,
     *        "destination": [ < number > , ...],
     *        "deviceInfo": {
     *            "manufacturer": < string > ,
     *            "modelName": < string > ,
     *            "serialNumber": < string > ,
     *            "softwareVersion": < string > ,
     *            "hardwareVersion": < string > ,
     *            "deviceType": < string >
     *        },
     *        "name": < string > ,
     *    }, < more entries > ]
     *
     * @param busV4Id : Unique ID of the bus on the controller
     * @param sensors : Array of sensors as described above
     */
    insertSensors: function (busV4Id, sensors) {
        // MYSQL CONNECTOR AND QUEUES
        var connection = require('../utils/mysql_helper.js')();
        queues(connection);
        var trans = connection.startTransaction();
        var assocs = [];

        // Get bus infos in our DB
        var sqlBus = "SELECT b.id " +
            "FROM server_com s " +
            "JOIN parking p ON p.id=s.parking_id " +
            "JOIN concentrateur c ON c.parking_id=p.id " +
            "JOIN bus b ON b.concentrateur_id=c.id " +
            "WHERE s.protocol_port = ? " +
            "AND b.v4_id = ? ";
        var sqlSensor = "INSERT IGNORE INTO capteur (bus_id, adresse, libelle, v4_id) " +
            "VALUES (?,?,?,?)";
        var select = "SELECT id FROM compteur WHERE v4_id=?";
        var sqlAssoc = "INSERT IGNORE INTO capteur_compteur(capteur_id, compteur_id) " +
            "VALUES(?, ?)";

        trans.query(sqlBus, [global.port, busV4Id], function (err, rows) {
            if (err && trans.rollback) {
                trans.rollback();
                throw err;
            }
            var busId = rows[0]['id'];
            // LOOP OVER ALL SENSORS FOR INSERTION
            _.each(sensors, function (sensor) {

                // Preparing query
                var inst = mysql.format(sqlSensor, [
                    busId,
                    sensor.address,
                    sensor.name,
                    sensor.ID
                ]);

                // Insert sensor
                trans.query(inst, function (err, result) {
                    // ROLLBACK THE TRANSACTION
                    if (err && trans.rollback) {
                        trans.rollback();
                        logger.log('error', 'TRANSACTION ROLLBACK');
                        throw err;
                    }
                    else {
                        // Associations with counters
                        if (sensor.destination !== undefined) {
                            // Parse counters
                            sensor.destination.forEach(function (counterId) {
                                assocs.push([result.insertId, counterId]);
                            }, this);
                        }
                    }
                });
            }, this);
        });

        // TRANSACTION COMMIT IF NO ROLLBACK OCCURED
        var promise = Q.Promise(function (resolve, reject) {
            trans.commit(function (err, info) {
                if (err) {
                    reject(err);
                } else {

                    resolve(assocs);
                }
            });
        });

        trans.execute();

        // Insert counters finished
        promise.then(function resolve(assocs) {

            logger.log('info', 'TRANSACTION COMMIT SENSORS OK');
            // Assocs between counters
            if (assocs.length > 0) {
                logger.log('info', 'ASSOCS', assocs);
                // New queue
                var transAssoc = connection.startTransaction();
                assocs.forEach(function (assoc) {
                    // Promise
                    var promiseIdSensor = Q.Promise(function (resolve, reject) {
                        // SELECT id from v4_id
                        var sqlFormatted = mysql.format(select, assoc[1]);
                        transAssoc.query(sqlFormatted, function (err, result) {
                            if (err && trans.rollback) {
                                reject(err);
                            }
                            else {
                                //logger.log('info', 'ASSOC with [id, V4]', assoc);
                                resolve([assoc[0], result[0]['id']]);
                            }
                        });

                    }.bind(this))
                        .then(function resolve(tab) {
                            // Prepare insertion
                            var inst = mysql.format(sqlAssoc, tab);
                            logger.log('info', 'ASSOC SENSOR COUNTERS', inst);
                            // Insert bus
                            transAssoc.query(inst, function (err, result) {
                                if (err && trans.rollback) {
                                    trans.rollback();
                                    logger.log('error', 'TRANSACTION ROLLBACK');
                                    throw err;
                                }
                            });
                        }, function reject(err) {
                            trans.rollback();
                            logger.log('error', 'SELECT id FROM v4_id KO');
                        });

                });
                // Commit INSERT counters
                transAssoc.commit(function (err, info) {
                    if (err) {
                        logger.log('error', 'TRANSACTION ASSOC COMMIT ERROR');
                    } else {
                        logger.log('info', 'TRANSACTION COMMIT ASSOCS OK');
                    }
                    // Ending mysql connection once all queries have been executed
                    connection.end(errorHandler.onMysqlEnd);
                });
                // Execute the queue INSERT assoc counters - counters
                transAssoc.execute();
            }
            else {
                logger.log('info', 'No associations between sensors and counters');
                // Ending mysql connection once all queries have been executed
                connection.end(errorHandler.onMysqlEnd);

            }

        }, function reject(err) {
            logger.log('error', 'TRANSACTION COMMIT SENSORS ERROR');
        }.bind(this));
    },

    /**
     * Insert an event in the journal_equipment_plan table
     * @param event
     */
    insertSensorEvent: function (event) {
        logger.log('info', 'SENSOR EVENT to store : %o', event);
    }
};
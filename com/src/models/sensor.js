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
        var controllerId = '';

        // Get bus infos in our DB
        var sqlBus = "SELECT b.id, c.v4_id AS controllerID " +
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
            controllerId = rows[0]['controllerId'];
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
                //logger.log('info', 'ASSOCS', assocs);
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
                            //logger.log('info', 'ASSOC SENSOR COUNTERS', inst);
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
                // Commit INSERT sensors
                transAssoc.commit(function (err, info) {
                    if (err) {
                        logger.log('error', 'TRANSACTION ASSOC COMMIT ERROR');
                    } else {
                        logger.log('info', 'TRANSACTION COMMIT ASSOCS OK');

                        // Send to init_parking: counters inserted
                        logger.log('info', '------NOTIFICATION sensorsInserted');
                        global.events.emit('sensorsInserted', controllerId, busV4Id);
                    }
                    // Ending mysql connection once all queries have been executed
                    connection.end(errorHandler.onMysqlEnd);
                });
                // Execute the queue INSERT assoc counters - counters
                transAssoc.execute();
            }
            // No assoc between counters
            else {
                logger.log('info', 'No associations between sensors and counters');
                // Ending mysql connection once all queries have been executed
                connection.end(errorHandler.onMysqlEnd);
                // Send to init_parking: counters inserted
                logger.log('info', '------NOTIFICATION sensorsInserted');
                global.events.emit('sensorsInserted', controllerId, busV4Id);

            }

        }, function reject(err) {
            logger.log('error', 'TRANSACTION COMMIT SENSORS ERROR');
        }.bind(this));
    },

    /**
     * Insert an event in the journal_equipment_plan table
     * @param events : array of events to insert
     */
    insertSensorEvents: function (events) {
        logger.log('info', 'SENSOR EVENTS to store : %o', events);

        var connection = require('../utils/mysql_helper.js')();
        queues(connection);
        var trans = connection.startTransaction();

        // Insertion in the event table
        var eventSql = "INSERT INTO event_capteur (capteur_id,date,state,sense,supply,dfu)" +
            "VALUES (?,?,?,?,?,?)";

        // FETCH SPACE AND SENSOR DATA
        var getPlaceInfosSql = "SELECT c.id AS capteur_id, p.id AS place_id, tp.id AS type_place_id, eo.id AS etat_occupation_id, plan.id AS plan_id FROM capteur c" +
            " JOIN place p ON p.capteur_id=c.id" +
            " JOIN type_place tp ON p.type_place_id=tp.id" +
            " JOIN etat_occupation eo ON eo.type_place_id=tp.id" +
            " JOIN allee a ON a.id=p.allee_id" +
            " JOIN zone z ON z.id=a.zone_id" +
            " JOIN plan ON plan.id=z.plan_id" +

            " WHERE eo.is_occupe=? AND c.id=?";

        // FETCH SENSOR ID FROM SENSOR V4_ID. NEED TO GO THROUGH THE PARKING
        var getSensorIdSql = "SELECT c.id FROM capteur c" +
            "   JOIN place p ON p.capteur_id=c.id" +
            "   JOIN allee a ON a.id=p.allee_id" +
            "   JOIN zone z ON z.id=a.zone_id" +
            "   JOIN plan ON plan.id=z.plan_id" +
            "   JOIN niveau n ON n.id=plan.niveau_id" +
            "   JOIN parking pa ON pa.id=n.parking_id" +

            "   WHERE c.v4_id=?";
        // LOOP OVER ALL EVENTS
        _.each(events, function (evt) {
            logger.log('info', 'V4 ID de cet envent sensor ID : ' + evt.ID);

            var p1 = Q.promise(function (resolve, reject) {
                logger.log('info', 'PASS promiose 1, : ');
                var inst = mysql.format(getSensorIdSql, [evt.ID]);
                trans.query(inst, function (err, result) {

                    // ROLLBACK THE TRANSACTION
                    if (err && trans.rollback) {
                        reject(err);
                    }
                    else if (result.length == 0) {
                        reject(new Error("The sensor with v4_id " + evt.ID + " is not attached to a space"));
                    }
                    // WE HAVE A SENSORID TO PERFORM ALL THE INSERTIONS !
                    else {
                        logger.log('info', 'PASS resolve promiose 1');
                        resolve(result);
                    }
                });
            }).then(function (result) {
                logger.log('info', 'PASS promiose 2,', result);
                return Q.promise(function (resolve, reject) {
                    var sensorId = result[0].id;
                    logger.log('info', 'PASS promiose 2, sensor id: ' + sensorId);

                    // INSERT IN THE EVENT TABLE
                    trans.query(eventSql, [sensorId, evt.date, evt.state, evt.sense, evt.supply, evt.dfu], function (err, result) {
                        if (err && trans.rollback) {
                            reject(err);
                        }
                    });

                    // HANDLE EACH TYPE OF SENSE EVENT
                    switch (evt.sense) {
                        case "undef":
                            // We do not change the journal in database
                            break;
                        case "free":
                            // Update journal AND etat d'occupation for the space
                            trans.query(getPlaceInfosSql, ['0', sensorId], function (err, rows) {
                                if (err) {
                                    trans.rollback();
                                    logger.log('error', 'TRANSACTION ROLLBACK');
                                    throw err;
                                } else {
                                    resolve({
                                        sense: evt.sense,
                                        data: rows
                                    });
                                }
                            });
                            break;
                        case "occupied":
                            // Update journal AND etat d'occupation for the space
                            trans.query(getPlaceInfosSql, ['1', sensorId], function (err, rows) {
                                if (err) {
                                    trans.rollback();
                                    logger.log('error', 'TRANSACTION ROLLBACK');
                                    throw err;
                                } else {
                                    resolve({
                                        sense: evt.sense,
                                        data: rows
                                    });
                                }
                            });
                            break;
                        case "overstay":
                            // Update journal BUT leave the same etat d'occupation
                            break;
                        case "error":
                            // We do not change the journal in database
                            break;
                        default:
                    }
                });
            }).then(function (oData) {
                // insertion event OK ?
                logger.log('info', 'pass PROMIOSE 3: ', oData);
            });

        });

        // TRANSACTION COMMIT IF NO ROLLBACK OCCURED
        trans.commit(function (err, info) {
            if (err) {
                logger.log('error', 'TRANSACTION COMMIT ERROR');
            } else {
                logger.log('info', 'TRANSACTION COMMIT OK');
            }
            // ENDING MYSQL CONNECTION ONCE ALL QUERIES HAVE BEEN EXECUTED
            connection.end(errorHandler.onMysqlEnd);
        });

    }
};
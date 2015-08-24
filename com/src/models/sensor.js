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
     *        "spaceType": < stringL > ,
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
        var assocs = []; // Assocs counters and settings
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
        //var selectSensorId = "SELECT id FROM capteur WHERE v4_id=?"; // capteur.id = result.insertId
        var sqlAssoc = "INSERT IGNORE INTO capteur_compteur(capteur_id, compteur_id) " +
            "VALUES(?, (SELECT id FROM compteur WHERE v4_id=?))";
        var sqlSettings = "INSERT IGNORE INTO capteur_config(capteur_id, config_equipement_id) " +
            "VALUES(?, (SELECT id FROM config_equipement WHERE v4_id=?))";

        trans.query(sqlBus, [global.port, busV4Id], function (err, rows) {
            if (err && trans.rollback) {
                trans.rollback();
                throw err;
            }
            var busId = rows[0]['id'];
            controllerId = rows[0]['controllerID'];

            // LOOP OVER ALL SENSORS FOR INSERTION
            _.each(sensors, function (sensor) {

                // Preparing query
                var inst = mysql.format(sqlSensor, [
                    busId,
                    sensor.address,
                    sensor.name,
                    sensor.ID
                ]);

                // Insert ONE sensor
                trans.query(inst, function (err, result) {
                    // ROLLBACK THE TRANSACTION
                    if (err && trans.rollback) {
                        trans.rollback();
                        logger.log('error', 'ERREUR SQL');
                        throw err;
                    }
                    else {
                        // Associations with counters
                        if (sensor.destination !== undefined || sensor.settings !== undefined) {

                            var obj = {
                                sensorId: result.insertId
                            };
                            // Counters
                            if (sensor.destination !== undefined) {
                                obj['counters'] = [];
                                // Parse counters
                                sensor.destination.forEach(function (counterId) {
                                    obj.counters.push(counterId);
                                }, this);
                            }
                            // Settings
                            if (sensor.settings !== undefined) {
                                obj['settings'] = [];
                                // Parse settings
                                sensor.settings.forEach(function (conf) {
                                    obj.settings.push(conf);
                                }, this);
                            }
                            // Add obj
                            assocs.push(obj);
                        }
                    }
                });
            }, this);
        });

        // TRANSACTION COMMIT IF NO ROLLBACK OCCURED
        var promise = Q.Promise(function (resolve, reject) {
            trans.commit(function (err, info) {
                if (err && trans.rollback()) {
                    logger.log('info', 'TRANSACTION COMMIT SENSORS REJECT');
                    reject(err, trans);
                } else {
                    resolve(assocs);
                }
            });
        });

        trans.execute();

        // Insert counters finished
        promise.then(function resolve(assocs) {

                logger.log('info', 'TRANSACTION COMMIT SENSORS OK');
                // Assocs between counters OR/AND settings
                if (assocs.length > 0) {
                    //logger.log('info', '++++++++++++ASSOCS', assocs);
                    // New transaction
                    var transAssoc = connection.startTransaction();
                    //logger.log('info', 'DECLARATION TRANSACTION', assocs.length);
                    // Parse all sensors associations
                    assocs.forEach(function (assoc) {
                        //logger.log('info', '****ASSOC', assocs);
                        var inst = '';
                        // Couters
                        if (assoc.counters !== undefined) {
                            //logger.log('info', '****COUNTERS', assoc.counters );
                            // Parse counters
                            assoc.counters.forEach(function (counterId) {
                                // Prepare insertion assoc counters
                                inst = mysql.format(sqlAssoc, [assoc.sensorId, counterId]);
                                //logger.log('info', 'ASSOC SENSOR COUNTERS', inst);
                                // Insert Insert assoc sensor_counter
                                transAssoc.query(inst, function (err, result) {
                                    if (err) {
                                        //transAssoc.rollback();
                                        logger.log('error', 'ERREUR SQL INSERT capteur_compteur', [sensorId, counterId]);
                                    }
                                });
                            }, this);
                        }

                        // Settings
                        if (assoc.settings !== undefined) {
                            // Parse settings
                            assoc.settings.forEach(function (settingId) {
                                // Prepare insertion assoc counters
                                inst = mysql.format(sqlSettings, [assoc.sensorId, settingId]);
                                //logger.log('info', 'ASSOC SENSOR SETTING', inst);
                                // Insert Insert assoc sensor_setting
                                transAssoc.query(inst, function (err, result) {
                                    if (err) {
                                        //transAssoc.rollback();
                                        logger.log('error', 'ERREUR SQL INSERT capteur_config', [sensorId, settingId]);
                                    }
                                });
                            }, this);
                        }


                    }, this);
                    // Commit INSERT sensors
                    transAssoc.commit(function (err, info) {
                        //logger.log('error', 'COMMITTTTTTTTTTTTTT');
                        if (err) {
                            logger.log('error', 'TRANSACTION ASSOC COMMIT ERROR');
                        }
                        else {
                            logger.log('info', 'TRANSACTION COMMIT ASSOCS OK');
                        }
                        // Ending mysql connection once all queries have been executed
                        connection.end(errorHandler.onMysqlEnd);
                    }.bind(this));
                    // Execute the queue INSERT assoc counters - counters
                    transAssoc.execute();
                }
                // No assoc between counters OR settings
                else {
                    logger.log('info', 'No associations between sensors and (counters or settings)');
                    // Ending mysql connection once all queries have been executed
                    connection.end(errorHandler.onMysqlEnd);

                }

            }.bind(this),
            function reject(err, trans) {
                trans.rollback();
                logger.log('error', 'TRANSACTION COMMIT SENSORS ERROR');
            }.bind(this));
    },

    /**
     * Insert an event in the journal_equipment_plan table
     * @param events : array of events to insert
     * @param onFinished : function called when event insertion is done
     */
    insertSensorEvents: function (events, onFinished) {
        logger.log('info', 'SENSOR EVENTS to store : %o', events);

        var connection = require('../utils/mysql_helper.js')();
        queues(connection);
        var queue = connection.createQueue();

        // Insertion in the event table
        var eventSql = "INSERT INTO event_capteur (capteur_id,date,state,sense,supply,dfu)" +
            "VALUES (?,?,?,?,?,?)";

        // FETCH SENSOR ID FROM SENSOR V4_ID. NEED TO GO THROUGH THE PARKING
        var getSensorIdSql = "SELECT c.id FROM capteur c" +
            "   JOIN place p ON p.capteur_id=c.id" +
            "   JOIN allee a ON a.id=p.allee_id" +
            "   JOIN zone z ON z.id=a.zone_id" +
            "   JOIN plan ON plan.id=z.plan_id" +
            "   JOIN niveau n ON n.id=plan.niveau_id" +
            "   JOIN parking pa ON pa.id=n.parking_id" +

            "   WHERE c.v4_id=?";

        // FETCH SPACE AND SENSOR DATA
        var getPlaceInfosSql = "SELECT c.id AS capteur_id, p.id AS place_id, tp.id AS type_place_id, eo.id AS etat_occupation_id, plan.id AS plan_id FROM capteur c" +
            " JOIN place p ON p.capteur_id=c.id" +
            " JOIN type_place tp ON p.type_place_id=tp.id" +
            " JOIN etat_occupation eo ON eo.type_place_id=tp.id" +
            " JOIN allee a ON a.id=p.allee_id" +
            " JOIN zone z ON z.id=a.zone_id" +
            " JOIN plan ON plan.id=z.plan_id" +

            " WHERE eo.is_occupe=? AND c.id=?";

        // INSERT THE JOURNAL EVENT
        var journalSql = "INSERT INTO journal_equipement_plan (plan_id, place_id, etat_occupation_id, overstay, date_evt)" +
            "VALUES (?,?,?,?,?)";

        // UPDATE THE SPACE "ETAT D'OCCUPATION"
        var updatePlaceSql = "UPDATE place SET etat_occupation_id=? WHERE id=?";

        // LOOP OVER ALL EVENTS
        _.each(events, function (evt) {
            logger.log('info', 'V4 ID de cet envent sensor ID : ' + evt.ID);

            var p1 = Q.promise(function (resolve, reject) {
                logger.log('info', 'PASS promiose 1, : ');
                var inst = mysql.format(getSensorIdSql, [evt.ID]);
                logger.log('info', 'SQL sensor ID : ' + inst);
                queue.query(inst, function (err, result) {

                    // ROLLBACK THE TRANSACTION
                    if (err) {
                        logger.log('error', 'ERREUR SQL : ' + inst);
                        reject(err);
                    }
                    else if (result.length == 0) {
                        logger.log('error', 'LES PLACES NE SONT PROBABLEMENT PAS ASSOCIEES AUX CAPTEURS !');
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
                    var inst = mysql.format(eventSql, [sensorId, evt.date, evt.state, evt.sense, evt.supply, evt.dfu]);
                    queue.query(inst, function (err, result) {
                        if (err) {
                            logger.log('error', 'ERREUR SQL : ' + inst);
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
                            var inst = mysql.format(getPlaceInfosSql, ['0', sensorId]);
                            queue.query(inst, function (err, rows) {
                                if (err) {
                                    logger.log('error', 'ERREUR SQL : ' + inst);
                                } else if (rows.length) {
                                    resolve({
                                        sense: evt.sense,
                                        data: rows[0]
                                    });
                                }
                            });
                            break;
                        case "occupied":
                            // Update journal AND etat d'occupation for the space
                            var inst = mysql.format(getPlaceInfosSql, ['1', sensorId]);
                            queue.query(inst, function (err, rows) {
                                if (err) {
                                    logger.log('error', 'ERREUR SQL : ' + inst);
                                } else if (rows.length) {
                                    resolve({
                                        sense: evt.sense,
                                        data: rows[0]
                                    });
                                }
                            });
                            break;
                        case "overstay":
                            // Update journal AND etat d'occupation for the space
                            var inst = mysql.format(getPlaceInfosSql, ['1', sensorId]);
                            queue.query(inst, ['1', sensorId], function (err, rows) {
                                if (err) {
                                    logger.log('error', 'ERREUR SQL : ' + inst);
                                } else if (rows.length) {
                                    resolve({
                                        sense: evt.sense,
                                        data: rows[0]
                                    });
                                }
                            });
                            break;
                        case "error":
                            // We do not change the journal in database
                            break;
                        default:
                    }
                });
            }).then(function (oData) {
                logger.log('info', 'PASS promiose 2,', result);
                return Q.promise(function (resolve, reject) {
                    // insertion event OK ?
                    logger.log('info', 'pass PROMIOSE 3: ', oData);
                    var sense = oData['sense'] == 'overstay' ? 1 : 0;
                    var evtData = oData['data'];

                    // UPDATE JOURNAL (plan_id, place_id, etat_occupation_id, overstay, date_evt)
                    var inst = mysql.format(journalSql, [
                        evtData.plan_id,
                        evtData.place_id,
                        evtData.etat_occupation_id,
                        sense,
                        evt.date
                    ]);
                    queue.query(inst, function (err, result) {
                        if (err) {
                            logger.log('error', 'ERREUR SQL : ' + inst);
                        }
                    });

                    // UPDATE ETAT D'OCCUPATION FOR THE SPACE
                    var inst = mysql.format(updatePlaceSql, [
                        evtData.etat_occupation_id,
                        evtData.place_id
                    ]);
                    queue.query(inst, function (err, result) {
                        if (err) {
                            logger.log('error', 'ERREUR SQL : ' + inst);
                        }
                    });
                });
            });

        });

        // TRANSACTION COMMIT IF NO ROLLBACK OCCURED
        queue.execute(function (err, info) {
            // ERROR CHECK
            if (err) {
                logger.log('error', 'SQL QUEUE ERROR');
            } else {
                logger.log('info', 'SQL QUEUE OK');
            }

            // NOTIFY CALLER THAT WE'RE DONE
            onFinished();

            // ENDING MYSQL CONNECTION ONCE ALL QUERIES HAVE BEEN EXECUTED
            connection.end(errorHandler.onMysqlEnd);
        });

    }
};
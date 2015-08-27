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
        var connection = require('../utils/mysql_helper.js').standardConnexion();
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
    insertSensorEvents: function (pool, events, onFinished) {
        logger.log('info', 'SENSOR EVENTS to store ', events);

        var mysqlHelper = require('../utils/mysql_helper.js');

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
            "   JOIN server_com s ON s.parking_id=pa.id" +
            "   WHERE c.v4_id=?" +
            "   AND s.protocol_port=?";

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
        _.each(events, function (evt, index) {
            //logger.log('info', 'V4 ID de cet event sensor ID : ' + evt.ID);
            // SensorId from v4_id
            return Q.promise(function (resolve, reject) {
                //logger.log('info', 'PASS promise 1 ');
                mysqlHelper.execute(pool, getSensorIdSql, [evt.ID, global.port], function (err, result) {
                    //logger.log('info', 'QUERY SENSOR ID', result);
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
                        //logger.log('info', 'PASS resolve promise 1 - result ', result);
                        resolve(result);
                    }
                });
            }).then(function resolve1(result) {

                return Q.promise(function (resolve, reject) {
                    //logger.log('info', 'PASS promise 2,' + result);
                    var sensorId = result[0].id;
                    //logger.log('info', 'PASS promiose 2, sensor id: ' + sensorId);

                    // INSERT IN THE EVENT TABLE
                    var insertEvent = mysql.format(eventSql, [sensorId, evt.date, evt.state, evt.sense, evt.supply, evt.dfu]);
                    mysqlHelper.execute(pool, eventSql, [sensorId, evt.date, evt.state, evt.sense, evt.supply, evt.dfu],
                        function (err, result) {
                            if (err) {
                                logger.log('error', 'ERREUR SQL INSERT event_table : ' + insertEvent, err);
                            }
                            else {
                                //logger.log('info', 'INSERTED event_table OK');
                            }
                        });

                    // ONLINE SENSORS
                    if (evt.state == 'online') {
                        // HANDLE EACH TYPE OF SENSE EVENT
                        switch (evt.sense) {
                            case "undef":
                                logger.log('error', 'UNDEF event.sense ');
                                reject();
                                // We do not change the journal in database
                                break;
                            case "free":
                                //logger.log('info', 'FREE');
                                // Update journal AND etat d'occupation for the space
                                var instFree = mysql.format(getPlaceInfosSql, ['0', sensorId]);
                                mysqlHelper.execute(pool, getPlaceInfosSql, ['0', sensorId], function (err, rows) {
                                    if (err || rows.length === 0) {
                                        logger.log('error', 'ERREUR SQL GET INFOS PLACE: ' + instFree, err);
                                        reject(err);
                                    } else {
                                        //logger.log('info', 'RESOLVE FREE');
                                        resolve({
                                            sense: evt.sense,
                                            data: rows[0]
                                        });
                                    }
                                });
                                break;
                            case "occupied":
                                //logger.log('info', 'OCCUPIED');
                                // Update journal AND etat d'occupation for the space
                                var instOccupied = mysql.format(getPlaceInfosSql, ['1', sensorId]);
                                mysqlHelper.execute(pool, getPlaceInfosSql, ['1', sensorId], function (err, rows) {
                                    if (err || rows.length === 0) {
                                        logger.log('error', 'ERREUR SQL GET INFOS PLACE: ' + instOccupied, err);
                                        reject(err);
                                    } else {
                                        //logger.log('info', 'RESOLVE OCCUPIED');
                                        resolve({
                                            sense: evt.sense,
                                            data: rows[0]
                                        });
                                    }
                                });
                                break;
                            case "overstay":
                                // Update journal AND etat d'occupation for the space
                                instOverstay = mysql.format(getPlaceInfosSql, ['1', sensorId]);
                                mysqlHelper.execute(pool, getPlaceInfosSql, ['1', sensorId], function (err, rows) {
                                    if (err || rows.length === 0) {
                                        logger.log('error', 'ERREUR SQL : ' + instOverstay);
                                        reject(err);
                                    } else {
                                        resolve({
                                            sense: evt.sense,
                                            data: rows[0]
                                        });
                                    }
                                });
                                break;
                            case "error":
                                logger.log('error', 'event.sense = ERROR');
                                reject();
                                // We do not change the journal in database
                                break;
                            default:
                                logger.log('error', 'UNKNOWN event.sense ', evt);
                                reject();
                                break;
                        }
                    }
                    // State <> online
                    else{
                        reject();
                    }
                });
            }, function reject1(err) {
                logger.log('error', 'REJECT promise 1', err);
            }).then(function resolve2(oData) {
                //logger.log('info', 'promise 2 OK ');
                // oData = car space free / occupied + infos
                //logger.log('info', 'pass PROMIOSE 3: ', oData);
                var sense = oData.sense == 'overstay' ? 1 : 0;
                var evtData = oData.data;
                // UPDATE JOURNAL (plan_id, place_id, etat_occupation_id, overstay, date_evt)
                var inst = mysql.format(journalSql, [
                    evtData.plan_id,
                    evtData.place_id,
                    evtData.etat_occupation_id,
                    sense,
                    evt.date
                ]);

                var p1 = Q.promise(function (resolve, reject) {
                    mysqlHelper.execute(pool, journalSql, [
                            evtData.plan_id,
                            evtData.place_id,
                            evtData.etat_occupation_id,
                            sense,
                            evt.date
                        ],
                        function (err, result) {
                            if (err) {
                                logger.log('error', 'ERREUR INSERT journal_equipement_plan SQL : ' + inst, err);
                            }
                            resolve();
                        });
                });

                // UPDATE ETAT D'OCCUPATION FOR THE SPACE
                var p2 = Q.promise(function (resolve, reject) {
                    mysqlHelper.execute(pool, updatePlaceSql, [
                            evtData.etat_occupation_id,
                            evtData.place_id
                        ],
                        function (err, result) {
                            if (err) {
                                logger.log('error', 'ERREUR UPDATE place SQL', err);
                            }
                            else {
                                //logger.log('info', 'UPDATE PLACE  ' + evtData.place_id + ' etat_occupation: ' + evtData.etat_occupation_id, err);
                            }
                            resolve();

                        });
                });

                return Q.all([p1, p2]);

            }, function reject2() {
                logger.log('error', 'REJECT promise 2');
            }).then(function resolveAll() {

                // FINAL SENSOR EVENT
                if (index == (events.length - 1)) {
                    logger.log('info', 'NOTIFICATION SENSOR EVENTS OK ');
                    // NOTIFY CALLER THAT WE'RE DONE
                    onFinished();
                }
            });

        });// fin _.each


    }
};
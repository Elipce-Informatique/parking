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
                                        logger.log('error', '[-]init[-] ERREUR SQL INSERT capteur_compteur', [assoc.sensorId, counterId]);
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
                                        logger.log('error', '[-]init[-] ERREUR SQL INSERT capteur_config', [assoc.sensorId, settingId]);
                                    }
                                });
                            }, this);
                        }


                    }, this);
                    // Commit INSERT sensors
                    transAssoc.commit(function (err, info) {
                        //logger.log('error', 'COMMITTTTTTTTTTTTTT');
                        if (err) {
                            logger.log('error', '[-]init[-] TRANSACTION ASSOC COMMIT ERROR');
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
    insertSensorEvents: function (pool, events, onFinished, ackID) {
        logger.log('info', 'SENSOR EVENTS to store '+ackID, events);

        var mysqlHelper = require('../utils/mysql_helper.js');

        // Insertion in the event table
        var eventSql = "INSERT INTO event_capteur (capteur_id,date,state,sense,supply,dfu)" +
            "VALUES (?,?,?,?,?,?)";

        // FETCH SENSOR ID FROM SENSOR V4_ID. NEED TO GO THROUGH THE PARKING
        var getSensorIdSql = "SELECT c.id " +
            "   FROM capteur c" +
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
        var getPlaceInfosSql = "SELECT c.id AS capteur_id, p.id AS place_id, tp.id AS type_place_id, " +
            " eo.id AS etat_occupation_id, plan.id AS plan_id " +
            " FROM capteur c" +
            " JOIN place p ON p.capteur_id=c.id" +
            " JOIN type_place tp ON p.type_place_id=tp.id" +
            " JOIN etat_occupation eo ON eo.type_place_id=tp.id" +
            " JOIN allee a ON a.id=p.allee_id" +
            " JOIN zone z ON z.id=a.zone_id" +
            " JOIN plan ON plan.id=z.plan_id" +
            " WHERE eo.is_occupe=? " +
            " AND c.id=?";

        // INSERT THE JOURNAL EVENT
        var journalSql = "INSERT INTO journal_equipement_plan (plan_id, place_id, etat_occupation_id, overstay, date_evt)" +
            "VALUES (?,?,?,?,?)";

        var selectLastSense = "SELECT e.sense " +
            "FROM event_capteur e " +
            "WHERE capteur_id=? " +
            "AND e.id=(SELECT MAX(e2.id) " +
            "           FROM event_capteur e2 " +
            "           WHERE e2.capteur_id=e.capteur_id) ";

        // UPDATE THE SPACE "ETAT D'OCCUPATION"
        var updatePlaceSql = "UPDATE place SET etat_occupation_id=? WHERE id=?";

        // LOOP OVER ALL EVENTS
        _.each(events, function (evt, index) {
            // Promise 1
            return Q.promise(function (resolve, reject) {
                //logger.log('info', 'PASS promise 1 ');
                mysqlHelper.execute(pool, getSensorIdSql, [evt.ID, global.port], function (err, result) {
                    //logger.log('info', 'QUERY SENSOR ID', result);
                    // ROLLBACK THE TRANSACTION
                    if (err) {
                        logger.log('error', 'ERREUR SQL GET SENSOR ID, v4_id: ' + evt.ID);
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

                //logger.log('info', 'PASS promise 2,' + result);
                var sensorId = result[0].id;

                // Promise 2 Composée de 2 promises
                var p1 = Q.promise(function (resolve, reject) {
                    //logger.log('info', 'PASS promiose 2, sensor id: ' + sensorId);


                    var sense = evt.sense;
                    // No sense key
                    if (evt.sense === undefined) {
                        // Last sense of the sensor
                        mysqlHelper.execute(pool, selectLastSense, [sensorId], function (err, rows) {
                            if (err ) {
                                logger.log('error', 'ERREUR SQL GET LAST SENSE ', err);
                                reject(err);
                            }
                            else if(rows.length === 0){

                                resolve({
                                    sense: 'free',
                                    sensorId: sensorId
                                });
                            }
                            else {

                                resolve({
                                    sense: rows[0]['sense'],
                                    sensorId: sensorId
                                });
                            }
                        });
                    }
                    // Sense key OK in the message
                    else {
                        resolve({
                            sense: sense,
                            sensorId: sensorId
                        });
                    }
                });

                var p2 = Q.promise(function (resolve, reject) {
                    var state = evt.state;
                    // No state key
                    if (evt.state === undefined) {
                        // Last state of the sensor
                        mysqlHelper.execute(pool, selectLastState, [sensorId], function (err, rows) {
                            if (err ) {
                                logger.log('error', 'ERREUR SQL GET LAST STATE ', err);
                                reject(err);
                            }
                            else if (rows.length === 0){
                                resolve({
                                    state: 'online',
                                    sensorId: sensorId
                                });
                            }
                            else {

                                resolve({
                                    state: rows[0]['state'],
                                    sensorId: sensorId
                                });
                            }
                        });
                    }
                    // Sense key OK in the message
                    else {
                        resolve({
                            state: state,
                            sensorId: sensorId
                        });
                    }
                });

                return Q.all([p1, p2]);

            }, function reject1(err) {
                logger.log('error', 'REJECT SENSOR promise 1', err);
                // Call onFinished function idf we are on last event
                sendFinished(index,(events.length - 1), onFinished, ackID);
            }).then(function resolve2(obj) {
                //logger.log('info', "++++++++++++++ OBJET Q.ALL", obj);
                // Promise 3
                return Q.promise(function (resolve, reject) {
                    var objSense = obj[0];
                    var objState = obj[1];
                    var sensorId = objSense.sensorId;
                    var sense = objSense.sense;
                    var state = objState.state;

                    var inst = mysql.format(eventSql,[sensorId, evt.date, state, sense, evt.supply, evt.dfu]);
                    //logger.log('info', '##### EVENT_CAPTEUR: '+ inst);
                    // INSERT IN THE EVENT TABLE
                    mysqlHelper.execute(pool, inst,
                        function (err, result) {
                            if (err) {
                                logger.log('error', 'ERREUR SQL INSERT event_sensor '+inst, err);
                            }
                            else {
                                //logger.log('info', 'INSERTED event_sensor OK');
                            }
                        });

                    // ONLINE SENSORS
                    if (state == 'online') {
                        // HANDLE EACH TYPE OF SENSE EVENT
                        switch (sense) {
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
                                logger.log('error', "default event.sense " + sense + ". Last sense is getting from BDD in precedent promise, so we don't have to pas here");
                                reject();
                                break;
                        }
                    }
                    // State <> online
                    else {
                        reject('NO ONLINE');
                    }
                });
            }, function reject2(err) {
                logger.log('error', 'REJECT SENSOR promise 2', err);
                // Call onFinished function idf we are on last event
                sendFinished(index,(events.length - 1), onFinished, ackID);
            }).then(function resolve3(oData) {
                //logger.log('info', 'promise 3 OK ');
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
                //logger.log('info', '##### JOURNAL_EQUIPEMENT_PLAN: '+ inst);

                var p1 = Q.promise(function (resolve, reject) {
                    mysqlHelper.execute(pool, inst,
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

            }, function reject3(err) {
                if (err != 'NO ONLINE') {
                    logger.log('error', 'REJECT SENSOR promise 3',err);
                }
                // Call onFinished function idf we are on last event
                sendFinished(index,(events.length - 1), onFinished, ackID);

            }).then(function resolveAll() {
                // Call onFinished function idf we are on last event
                sendFinished(index,(events.length - 1), onFinished, ackID);
            });

        });// fin _.each

        /**
         * Send a notification when events are finished
         * @param index: current index
         * @param total: last index
         * @param callback
         */
        function sendFinished(index, total, callback, ackID){
            //logger.log('info','ackID: '+ ackID+' info', 'index:'+index+' total:'+total);
            // FINAL SENSOR EVENT
            if (index == total) {
                //logger.log('info', 'NOTIFICATION SENSOR EVENTS FINISHED '+ackID);
                // NOTIFY CALLER THAT WE'RE DONE
                callback();
            }
        }
    },

    /**
     * Insert sensors in supervision DB
     * @param busId: bus.id
     * @param sensors: sensors array
     */
    insertSensorsFromBusEnum: function (busId, sensors) {
        logger.log('info', 'SENSORS FROM BUS ENUM TO INSERT ' + busId, sensors);

        // MYSQL CONNECTOR AND QUEUES
        var connection = require('../utils/mysql_helper.js').standardConnexion();
        queues(connection);
        var trans = connection.startTransaction();

        // Variables
        var params = [];
        var instSql = '';
        var sensorsInserted = [];
        var libelle = '';

        var sqlBus = "SELECT b.id " +
            "FROM server_com s " +
            "JOIN parking p ON p.id=s.parking_id " +
            "JOIN concentrateur c ON c.parking_id=p.id " +
            "JOIN bus b ON b.concentrateur_id=c.id " +
            "WHERE s.protocol_port =" + global.port + " " +
            "AND b.v4_id = ? ";

        var sqlSensor = "INSERT IGNORE INTO capteur (bus_id, adresse, libelle, sn, num_noeud, leg, software_version) " +
            "VALUES ((" + sqlBus + "), ?, ?, ?, ?, ?, ?)";

        var updateV4 = "UPDATE capteur SET v4_id=? WHERE id=?";

        // Parse sensors
        sensors.forEach(function (sensor) {
            // Address
            var adresse = parseInt(sensor.leg) == 2 ? (parseInt(sensor.index) + global.legLength) : parseInt(sensor.index);// "var" important pour le passage de adresse dans la callback qui suit
            //logger.log('info', '+++++++ adresse ', parseInt(sensor.leg), parseInt(sensor.index), adresse);
            libelle = sensor.modelName + ' #' + busId + '#' + adresse;
            // Prepare sql
            params = [
                busId,
                adresse,
                libelle,
                sensor.ssn,
                parseInt(sensor.index),
                parseInt(sensor.leg),
                sensor.softwareVersion
            ];
            instSql = mysql.format(sqlSensor, params);
            //logger.log('info', '###### SQL', instSql);
            // Insert bus
            trans.query(instSql, function (err, result) {
                // INSERT KO
                if (err && trans.rollback) {
                    trans.rollback();
                    logger.log('error', 'TRANSACTION ROLLBACK', err);
                    throw err;
                }
                // INSERT OK
                else {
                    var sensorId = result.insertId;
                    instSql = mysql.format(updateV4, [sensorId, sensorId]);
                    //logger.log('info', '###### ', instSql);
                    // UPDATE v4_id
                    trans.query(instSql);

                    // ELSE -> Sensor already exists
                    if (sensorId > 0) {
                        // Strore sensor
                        sensorsInserted.push({
                            ID: sensorId,
                            address: adresse,
                            spaceType: "generic",
                            deviceInfo: {
                                serialNumber: sensor.ssn,
                                modelName: sensor.modelName,
                                softwareVersion: sensor.softwareVersion
                            } // Si suppression de deviceInfo alors aller modifier general_helper.dbSensorsToBusEnum
                        })
                    }
                }
            });
        }, this);
        // Commit INSERT sensors
        var promise = Q.Promise(function (resolve, reject) {
            trans.commit(function (err, info) {
                if (err) {
                    reject(err);
                    logger.log('error', 'TRANSACTION COMMIT SENSORS ERROR');
                } else {
                    resolve(sensorsInserted);
                    logger.log('info', 'TRANSACTION COMMIT SENSORS OK');
                }
                // END MySQL connexion
                connection.end(errorHandler.onMysqlEnd);
            });
        })

        // Execute the queue INSERT counters
        trans.execute();

        return promise;
    },

    /**
     * Synchro sensors betwwen supervision DB and busEnum result
     * @param pool: MySQL connexion
     * @param busId: bus.id
     * @param sensors: sensors array
     */
    synchroSensors: function (pool, busId, sensors, onSynchroFinished, onError) {
        logger.log('info', 'SENSORS FROM BUS ENUM TO SYNCHRO ' + busId, sensors);

        // MYSQL CONNECTOR AND QUEUES
        var mysqlHelper = require('../utils/mysql_helper.js');
        var connection = mysqlHelper.standardConnexion();
        queues(connection);
        var trans = connection.startTransaction();

        // Variables;
        var sensorsDelta = [];
        var sensorsInserted = [];

        var sqlSensor = "" +
            "SELECT c.*, tp.v4_type_place, GROUP_CONCAT(ce.v4_id SEPARATOR ',')AS settings " +
            "FROM parking p " +
            "JOIN concentrateur con ON con.parking_id=p.id " +
            "JOIN bus b ON b.concentrateur_id=con.id " +
            "JOIN capteur c ON c.bus_id=b.id " +
            "LEFT JOIN place pl ON pl.capteur_id=c.id " +
            "LEFT JOIN type_place tp ON tp.id=pl.type_place_id " +
            "LEFT JOIN capteur_config cc ON cc.capteur_id=c.id " +
            "LEFT JOIN config_equipement ce ON ce.id=cc.config_equipement_id " +
            "WHERE p.id =" + global.parkingId + " " +
            "AND b.v4_id = ? " +
            "AND c.leg = ? " +
            "AND c.num_noeud = ? " +
            "GROUP BY c.id ";

        var updateCapteur = "" +
            "UPDATE capteur SET libelle=?, sn=?, software_version=?, v4_id=? " +
            "WHERE id=? ";

        Q.promise(function (resolve, reject) {
            // Parse sensors
            sensors.forEach(function (sensor, index) {

                Q.promise(function (resolve, reject) {
                    // Get virtual sensor
                    mysqlHelper.execute(pool, sqlSensor, [busId, sensor.leg, sensor.index], function (err, result) {
                        //logger.log('info', 'EXEC');
                        if (err) {
                            logger.log('error', 'ERROR GET VIRTUAL SENSOR', err);
                            reject(sensor);
                        }
                        else {
                            // No virtual sensor for the unicity bus-leg-index
                            if (result.length === 0) {
                                logger.log('error', 'NO VIRTUAL SENSOR IN SUPERVISION DB', sensor);
                                reject(sensor);

                            }
                            else {
                                resolve({
                                    busEnum: sensor,
                                    db: result[0]
                                })
                            }
                        }

                    });
                }).then(function onVirtualSensorExists(obj) {
                    //logger.log('info', 'YOUHOU');
                    // Variables
                    var sensor = obj.busEnum;// Sensor from busEnum
                    var dbSensor = obj.db; // Sensor from supervision DB

                    // Sensor unique name
                    var libelle = sensor.modelName + ' #' + busId + '#' + dbSensor['adresse'];

                    return Q.promise(function (resolve, reject) {

                        // Update sensor
                        trans.query(updateCapteur, [
                            libelle,
                            sensor.ssn,
                            sensor.softwareVersion,
                            dbSensor.id,
                            dbSensor.id
                        ], function (err, result) {
                            // INSERT KO
                            if (err && trans.rollback) {
                                reject(err)
                                throw err;
                            }
                            else {
                                // New sensor => match now
                                if (dbSensor.v4_id === null) {
                                    // New controller DB sensor
                                    var temp = {
                                        ID: dbSensor.id,
                                        address: dbSensor.adresse,
                                        spaceType: dbSensor.v4_type_place == null ? "generic" : dbSensor.v4_type_place,
                                        deviceInfo: {
                                            serialNumber: sensor.ssn,
                                            modelName: sensor.modelName,
                                            softwareVersion: sensor.softwareVersion
                                        } // Si suppression de deviceInfo alors aller modifier general_helper.dbSensorsToBusEnum
                                    }
                                    // Setting key
                                    var settings = dbSensor.settings == null ? {} : {
                                        settings: dbSensor.settings.split(',')
                                    };
                                    // Add settings key
                                    temp = _.extend(temp, settings);
                                    // Store sensor
                                    resolve(temp);
                                }
                                else {
                                    resolve();
                                }
                            }

                        });
                    });
                }, function onVirtualSensorKo(sensor) {
                    // Sensor in busEnum and not in virtuals
                    sensorsDelta.push(sensor);

                }).then(function onUpdateSensorOk(newSensor) {

                    //logger.log('info', 'NEW SENSOR', newSensor);
                    if (newSensor !== undefined) {
                        sensorsInserted.push(newSensor);
                    }

                    // Last sensor in the foreach => COMMIT
                    if (index == (sensors.length - 1)) {
                        resolve(sensorsInserted);
                    }
                }, function onUpdateSensorKo(err){

                    trans.rollback();
                    logger.log('error', 'TRANSACTION UPDATE VIRTUAL SENSOR ROLLBACK', err);
                    // Callback synchro finished KO
                    onError(err);

                    // END MySQL connexion
                    connection.end(errorHandler.onMysqlEnd);
                });


            }, this);
        }).then(function ok(si) {

            trans.commit(function (err, info) {
                if (err) {
                    logger.log('error', 'TRANSACTION COMMIT VIRTUAL SENSORS ERROR');
                    // Callback synchro finished KO
                    onError(err);
                } else {
                    // Callback synchro finished ok
                    onSynchroFinished({
                        delta: sensorsDelta,
                        sensors: si
                    });
                    logger.log('info', 'TRANSACTION COMMIT SENSORS OK');
                }
                // END MySQL connexion
                connection.end(errorHandler.onMysqlEnd);
            });
        });
    }

};
/**
 * Created by vivian on 17/08/2015.
 */

var logger = require('../utils/logger.js');
var errorHandler = require('../utils/error_handler.js');

var mysql = require('mysql');
//Enable mysql-queues
var queues = require('mysql-queues');
var Q = require('q');

module.exports = {
    /**
     * Insert the counters provided by the controller
     * @param data : list of all counters
     */
    insertViews: function (data) {


        var subquerySpaceType = "SELECT id FROM type_place WHERE cell_nb=?";
        //Query structure
        var insertView =
            "INSERT IGNORE INTO vue(libelle, compteur_id, afficheur_id, cellNr, total, " +
            "offset, emptyLow, emptyHigh, fullLow, fullHigh, v4_id, type_place_id)" +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, (SELECT id FROM type_place WHERE cell_nb=?))";

        var selectDisplay =
            "SELECT a.id " +
            "FROM afficheur a " +
            "JOIN bus b ON b.id=a.bus_id " +
            "JOIN concentrateur c ON c.id=b.concentrateur_id " +
            "WHERE c.parking_id=? " +
            "AND a.v4_id=?";

        var selectCounter = "SELECT id FROM compteur WHERE v4_id=?";

        // MYSQL CONNECTOR AND QUEUES
        var connection = require('../utils/mysql_helper.js').standardConnexion();
        queues(connection);

        // TRANSACTION
        var trans = connection.startTransaction();
        // At least 1 view
        if (data.length > 0) {
            var assocs = [];
            // Parse counters
            data.forEach(function (view) {

                // Get display ID
                var p1 = Q.promise(function (resolve, reject) {
                    var inst = mysql.format(selectDisplay, [global.parkingId, view.displayID]);
                    //logger.log('info', 'P1', inst);
                    trans.query(inst, function (err, result) {
                        if (err && trans.rollback) {
                            //logger.log('error', 'SQL P1 fail', err);
                            reject(err);
                        }
                        else {
                            //logger.log('info', 'P1 result', result);
                            resolve(result[0]['id']);
                        }
                    });
                });

                // Get counter ID
                var p2 = Q.promise(function (resolve, reject) {
                    var inst = mysql.format(selectCounter, [view.counterID]);
                    //logger.log('info', 'P2', inst);

                    trans.query(inst, function (err, result) {
                        if (err && trans.rollback) {
                            logger.log('error', 'SQL P2 fail', err);
                            reject(err);
                        }
                        else {
                            //logger.log('info', 'P2 result', result);
                            resolve(result[0]['id']);
                        }
                    });
                });

                Q.all([p1, p2]).then(function (data) {
                    //logger.log('info', 'ALL (p1+p2)', data);
                    var inst = mysql.format(insertView, [
                        view.name,
                        data['1'],
                        data['0'],
                        view.cellNr,
                        view.total,
                        view.offset,
                        view.emptyLow,
                        view.emptyHigh,
                        view.fullLow,
                        view.fullHigh,
                        view.ID,
                        view.cellNr,
                    ]);
                    //logger.log('info', 'Insert view', inst);
                    -
                        // Insert view
                        trans.query(inst, function (err, result) {
                            if (err) {
                                logger.log('error', 'INSERT VIEW KO', err);
                            }
                            else {
                                //logger.log('info', 'INSERT VIEW OK');
                            }
                        });

                }, function (err) {
                    logger.log('error', 'PROMISES P1 et P2 KO', err);
                });

                trans.commit(function (err, info) {
                    if (err) {
                        logger.log('error', 'TRANSACTION COMMIT ERROR');
                    } else {
                        logger.log('info', 'TRANSACTION SELECT DISPLAY COUNTER OK');
                    }
                });
            });
        }
    },

    /**
     * Insert an event in the event_vue table
     * @param pool : Mysql connection
     * @param events : array of events to insert
     * @param onFinished : function called when event insertion is done
     */
    insertViewEvents: function (pool, events, onFinished) {
        logger.log('info', 'VIEWS EVENTS to store ', events);

        var mysqlHelper = require('../utils/mysql_helper.js');

        // Insertion in the event table
        var eventSql = "INSERT INTO event_vue(vue_id,date,occupied,free,count,state)" +
            "VALUES (?,?,?,?,?,?)";

        // FETCH VIEW ID FROM V4_ID. NEED TO GO THROUGH THE PARKING
        var sqlViewId = "SELECT v.id " +
            "   FROM vue v" +
            "   JOIN afficheur a ON a.id=v.afficheur_id" +
            "   JOIN plan ON plan.id=a.plan_id" +
            "   JOIN niveau n ON n.id=plan.niveau_id" +
            "   JOIN parking pa ON pa.id=n.parking_id" +
            "   JOIN server_com s ON s.parking_id=pa.id" +
            "   WHERE v.v4_id=?" +
            "   AND s.protocol_port=?";

        // UPDATE VIEW TABLE
        var sqlUpdateView = "UPDATE vue " +
            "SET occupees=?, " +
            "libres=? " +
            "WHERE id=?";

        // LOOP OVER ALL EVENTS
        _.each(events, function (evt, index) {
            //logger.log('info', 'V4 ID de cet event sensor ID : ' + evt.ID);
            // SensorId from v4_id
            return Q.promise(function (resolve, reject) {
                //logger.log('info', 'PASS promise 1 ');
                mysqlHelper.execute(pool, sqlViewId, [evt.ID, global.port], function (err, result) {

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
                            var instFree = mysql.format(sqlUpdateView, ['0', sensorId]);
                            mysqlHelper.execute(pool, sqlUpdateView, ['0', sensorId], function (err, rows) {
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
                            var instOccupied = mysql.format(sqlUpdateView, ['1', sensorId]);
                            mysqlHelper.execute(pool, sqlUpdateView, ['1', sensorId], function (err, rows) {
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
                            instOverstay = mysql.format(sqlUpdateView, ['1', sensorId]);
                            mysqlHelper.execute(pool, sqlUpdateView, ['1', sensorId], function (err, rows) {
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
}
/**
 * Created by vivian on 17/08/2015.
 */

var logger = require('../utils/logger.js');
var errorHandler = require('../utils/error_handler.js');

var mysql = require('mysql');
//Enable mysql-queues
var queues = require('mysql-queues');
var Q = require('q');
var _ = require('lodash');

module.exports = {
    /**
     * Insert the views provided by the controller
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
                            // Display found
                            if(result.length > 0) {
                                //logger.log('info', 'P1 result', result);
                                resolve(result[0]['id']);
                            }
                            // Display not found
                            else{
                                reject({
                                    erreur_bdd : '[-]init[-] DISPLAY DOESNT EXIST '+view.displayID
                                })
                            }
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
    insertViewEvents: function (pool, events, onFinished, ackID) {
        logger.log('info', 'VIEWS EVENTS to store ', events);

        var mysqlHelper = require('../utils/mysql_helper.js');
        var viewsId = [];

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
            // Promise 1
            return Q.promise(function (resolve, reject) {
                //logger.log('info', 'PASS promise 1 ');
                mysqlHelper.execute(pool, sqlViewId, [evt.ID, global.port], function (err, result) {

                    // ROLLBACK THE TRANSACTION
                    if (err) {
                        logger.log('error', 'ERREUR SQL GET VIEW ID', err);
                        reject(err);
                    }
                    else if (result.length == 0) {

                        logger.log('error', 'NO V4 ID VIEW ' + evt.ID + ". Les afficheurs ne sont probablement pas créés sur le plan");
                        reject(err);
                    }
                    else {
                        resolve(result);
                    }
                });
            }).then(function resolve1(result) {

                var viewId = result[0].id;
                viewsId.push(viewId);

                var p1 = Q.promise(function (resolve, reject) {
                    // INSERT IN THE EVENT TABLE
                    mysqlHelper.execute(pool, eventSql, [viewId, evt.date, evt.occupied, evt.free, evt.count, evt.state],
                        function (err, result) {
                            if (err) {
                                logger.log('error', 'ERREUR SQL INSERT event_vue : ', err);
                            }
                            resolve();
                        });
                });

                var free = '';
                // UPDATE VIEW
                switch (evt.state) {
                    case "normal":
                        free = evt.free;
                        break;
                    case "empty":
                        free = evt.state;
                        break;
                    case "full":
                        free = evt.state;
                        break;
                    default:
                        logger.log('error', 'UNKNOWN evt.state', evt);
                        reject();
                        break;
                }

                // UPDATE VIEW
                var p2 = Q.promise(function (resolve, reject) {
                    mysqlHelper.execute(pool, sqlUpdateView, [evt.occupied, free, viewId],
                        function (err, result) {
                            if (err) {
                                logger.log('error', 'ERREUR SQL UPDATE vue ', err);
                            }
                            resolve();
                        });
                });

                return Q.all([p1, p2]);

            }, function reject1(err) {
                logger.log('error', 'REJECT VIEW promise', err);
                // FINAL VIEW EVENT
                logger.log('info','ackID: '+ackID+' info', 'index:'+index+' total:'+(events.length - 1));
                if (index == (events.length - 1)) {
                    logger.log('info', 'NOTIFICATION VIEW EVENTS FINISHED rejected '+ackID);
                    // NOTIFY CALLER THAT WE'RE DONE
                    onFinished(viewsId);
                }
            }).then(function resolveAll() {

                // FINAL VIEW EVENT
                if (index == (events.length - 1)) {
                    logger.log('info', 'NOTIFICATION VIEW EVENTS FINISHED resolved '+ackID);
                    // NOTIFY CALLER THAT WE'RE DONE
                    onFinished(viewsId);
                }
            });

        });// fin _.each

    },

    /**
     * Delete all views in the array
     * @param viewsId: views ID array
     */
    deleteViews: function (viewsId) {

        // MYSQL CONNECTOR AND QUEUES
        var connection = require('../utils/mysql_helper.js').standardConnexion();
        queues(connection);
        var trans = connection.startTransaction();

        var sqlDelete = "" +
            "DELETE FROM vue " +
            "WHERE id=? ";

        // Parse views id
        viewsId.forEach(function (viewId) {
            trans.query(sqlDelete, [viewId], function (err, result) {
                // DELETE KO
                if (err && trans.rollback) {
                    trans.rollback();
                    logger.log('error', 'TRANSACTION ROLLBACK DELETE VIEW', err);
                    throw err;
                }
            });
        }, this);

        // Commit DELETE views
        trans.commit(function (err, info) {
            if (err) {
                logger.log('error', 'TRANSACTION COMMIT VIEWS ERROR', err);
            }
            // END MySQL connexion
            connection.end(errorHandler.onMysqlEnd);
        });


        // Execute the queue DELETE views
        trans.execute();

    }
}
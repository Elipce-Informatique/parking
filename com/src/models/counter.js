/**
 * Created by vivian on 14/08/2015.
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
     * Insert the counters provided by the controller
     * @param data : list of all counters
     */
    insertCounters: function (data) {

        //Query structure
        var sqlCpt = "INSERT IGNORE INTO compteur(libelle, v4_id)" +
            "VALUES (?, ?)";
        var sqlCptAssoc = "INSERT IGNORE INTO compteur_compteur(compteur_id, compteur_fils_id)" +
            "VALUES (?, ?)";
        var select = "SELECT id FROM compteur WHERE v4_id=?";

        // MYSQL CONNECTOR AND QUEUES
        var connection = require('../utils/mysql_helper.js').standardConnexion();
        queues(connection);

        // TRANSACTION
        var trans = connection.startTransaction();
        // At least 1 counter
        if (data.length > 0) {
            var assocs = [];
            // Parse counters
            data.forEach(function (counter) {

                // Prepare sql
                var inst = mysql.format(sqlCpt, [
                    counter.name,
                    counter.ID
                ]);

                // Insert bus
                trans.query(inst, function (err, result) {
                    if (err && trans.rollback) {
                        trans.rollback();
                        logger.log('error', 'TRANSACTION ROLLBACK');
                        throw err;
                    }
                    else {
                        // Association between counters
                        if (counter.destination !== undefined) {
                            // Parse associations
                            counter.destination.forEach(function (counterFils) {
                                if (result.insertId > 0) {
                                    assocs.push([result.insertId, counterFils]);
                                }
                            }, this);
                        }
                    }
                });
            });
            // Commit INSERT counters
            var promise = Q.Promise(function (resolve, reject) {
                trans.commit(function (err, info) {
                    if (err) {
                        reject(err);
                        logger.log('error', 'TRANSACTION COMMIT ERROR');
                    } else {
                        resolve(assocs);
                        logger.log('info', 'TRANSACTION COMMIT COUNTERS OK');
                    }
                });
            })
        }
        // Execute the queue INSERT counters
        trans.execute();

        // Insert counters finished
        promise.then(function (assocs) {

            // Assocs between counters
            if (assocs.length > 0) {
                // New queue
                var transAssoc = connection.startTransaction();
                assocs.forEach(function (assoc) {
                    // Promise
                    var promiseIdCounter = Q.Promise(function (resolve, reject) {
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

                    }.bind(this)).then(function resolve(cpts) {
                        // Prepare insertion
                        var inst = mysql.format(sqlCptAssoc, cpts);
                        //logger.log('info', 'ASSOC COUNTERS COUNTERS', inst);
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
                    }
                    //else {
                    //    logger.log('info', 'TRANSACTION COMMIT ASSOCS COUNTERS OK');
                    //}
                    // Ending mysql connection once all queries have been executed
                    connection.end(errorHandler.onMysqlEnd);
                    // Send to init_parking: counters inserted
                    global.events.emit('countersInserted');
                });
                // Execute the queue INSERT assoc counters - counters
                transAssoc.execute();
            }
            else {
                logger.log('info', 'No associations between counters and counters');
                // Ending mysql connection once all queries have been executed
                connection.end(errorHandler.onMysqlEnd);
                // Send to init_parking: counters inserted
                global.events.emit('countersInserted');
            }

        });
    },

    /**
     * Insert an event in the event_compteur table
     * @param pool : Mysql connection
     * @param events : array of events to insert
     * @param onFinished : function called when event insertion is done
     */
    insertCounterEvents: function (pool, events, onFinished) {
        logger.log('info', 'COUNTER EVENTS to store ', events);

        var mysqlHelper = require('../utils/mysql_helper.js');
        var countersId = [];

        // Insertion in the event table
        var eventSql = "INSERT INTO event_compteur(compteur_id,date,count)" +
            "VALUES (?,?,?)";

        // FETCH COUNTER ID FROM V4_ID. NEED TO GO THROUGH THE PARKING
        var sqlCounterId = "SELECT c.id " +
            "   FROM compteur c" +
            "   JOIN vue v ON v.compteur_id=c.id" +
            "   JOIN afficheur a ON a.id=v.afficheur_id" +
            "   JOIN plan ON plan.id=a.plan_id" +
            "   JOIN niveau n ON n.id=plan.niveau_id" +
            "   JOIN parking pa ON pa.id=n.parking_id" +
            "   JOIN server_com s ON s.parking_id=pa.id" +
            "   WHERE c.v4_id=?" +
            "   AND s.protocol_port=?";

        // LOOP OVER ALL EVENTS
        _.each(events, function (evt, index) {
            // Promise 1
            return Q.promise(function (resolve, reject) {
                //logger.log('info', 'PASS promise 1 ');
                mysqlHelper.execute(pool, sqlCounterId, [evt.ID, global.port], function (err, result) {

                    // ROLLBACK THE TRANSACTION
                    if (err) {
                        logger.log('error', 'ERREUR SQL GET COUNTER ID', err);
                        reject(err);
                    }
                    else if (result.length == 0) {
                        logger.log('error', 'NO V4 ID COUNTER ' + evt.ID + ". Les compteurs ne sont probablement pas associés à une vue");
                        reject(err);
                    }
                    else {
                        resolve(result);
                    }
                });
            }).then(function resolve1(result) {

                var counterId = result[0].id;
                countersId.push(counterId);

                return Q.promise(function (resolve, reject) {
                    // INSERT IN THE EVENT TABLE
                    mysqlHelper.execute(pool, eventSql, [counterId, evt.date, evt.count],
                        function (err, result) {
                            if (err) {
                                logger.log('error', 'ERREUR SQL INSERT event_compteur: ', err);
                            }
                            resolve();
                        });
                });


            }, function reject1(err) {
                logger.log('error', 'REJECT promise 1', err);
            }).then(function resolveEventCompteur() {

                // FINAL COUNTER EVENT
                if (index == (events.length - 1)) {
                    logger.log('info', 'NOTIFICATION COUNTER EVENTS OK ');
                    // NOTIFY CALLER THAT WE'RE DONE
                    onFinished(countersId);
                }
            });

        });// fin _.each

    }
};
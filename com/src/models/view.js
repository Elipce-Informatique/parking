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

        //Query structure
        var sqlView =
            "INSERT IGNORE INTO vue(libelle, compteur_id, afficheur_id, cellNr, total, " +
            "offset, emptyLow, emptyHigh, fullLow, fullHigh, v4_id)" +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        var selectDisplay =
            "SELECT a.id " +
            "FROM afficheur a" +
            "JOIN bus b ON b.id=a.bus_id" +
            "JOIN concentrateur c ON c.id=b.concentrateur_id" +
            "WHERE c.parking_id=?";

        var selectCounter = "SELECT id FROM compteur WHERE v4_id=?";

        // MYSQL CONNECTOR AND QUEUES
        var connection = require('../utils/mysql_helper.js')();
        queues(connection);

        // TRANSACTION
        var trans = connection.startTransaction();
        // At least 1 view
        if (data.length > 0) {
            var assocs = [];
            // Parse counters
            data.forEach(function (view) {

                // Get display ID and counter ID
                var p1 = Q.promise(function(resolve, reject){
                    trans.query(mysql.format(selectDisplay, [view.displayID]), function (err, result) {
                        if (err && trans.rollback) {
                            reject(err);
                        }
                        else{
                            resolve(result);
                        }
                    });
                });

                var p2 = Q.promise(function(resolve, reject){
                    trans.query(mysql.format(selectCounter, [view.counterID]), function (err, result) {if (err && trans.rollback) {
                        reject(err);
                    }
                    else{
                        resolve(result);
                    }
                    });
                });

                Q.all([p1,p2]).then(function(data){
                    logger.log('info', 'ALL data: ', data);
                });



                // Prepare sql
                var inst = mysql.format(sqlView, [
                    view.name,
                    view.ID
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
                        if (view.destination !== undefined) {
                            // Parse associations
                            view.destination.forEach(function (counterFils) {
                                if (result.insertId > 0) {
                                    assocs.push([result.insertId, counterFils]);
                                }
                            }, this);
                        }
                    }
                });
            });
            // Commit INSERT counters
            var promise = new Promise(function (resolve, reject) {
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
                    var promiseIdCounter = new Promise(function (resolve, reject) {
                        // SELECT id from v4_id
                        var sqlFormatted = mysql.format(select, assoc[1]);
                        transAssoc.query(sqlFormatted, function (err, result) {
                            if (err && trans.rollback) {
                                reject(err);
                            }
                            else {
                                logger.log('info', 'ASSOC with [id, V4]', assoc);
                                resolve([assoc[0], result[0]['id']]);
                            }
                        });

                    }.bind(this)).then(function resolve(cpts) {
                            // Prepare insertion
                            var inst = mysql.format(sqlAssoc, cpts);
                            logger.log('info', 'ASSOC COUNTERS COUNTERS', inst);
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
                        logger.log('info', 'TRANSACTION COMMIT ASSOCS COUNTERS OK');
                    }
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
    }
};
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
        var insertView =
            "INSERT IGNORE INTO vue(libelle, compteur_id, afficheur_id, cellNr, total, " +
            "offset, emptyLow, emptyHigh, fullLow, fullHigh, v4_id)" +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        var selectDisplay =
            "SELECT a.id " +
            "FROM afficheur a " +
            "JOIN bus b ON b.id=a.bus_id " +
            "JOIN concentrateur c ON c.id=b.concentrateur_id " +
            "WHERE c.parking_id=? " +
            "AND a.v4_id=?";

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
                        view.ID
                    ]);
                    //logger.log('info', 'Insert view', inst);

                    // Insert view
                    trans.query(inst, function (err, result) {
                        if (err && trans.rollback) {
                            logger.log('error', 'INSERT VIEW KO', err);
                        }
                        else {
                            logger.log('info', 'INSERT VIEW OK');
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
    }
};
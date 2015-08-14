/**
 * Created by vivian on 14/08/2015.
 */

var logger = require('../utils/logger.js');
var errorHandler = require('../utils/error_handler.js');

var mysql = require('mysql');
//Enable mysql-queues
var queues = require('mysql-queues');

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

        // MYSQL CONNECTOR AND QUEUES
        var connection = require('../utils/mysql_helper.js')();
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
                                assocs.push([result.insertId, counterFils]);
                            }, this);
                        }
                    }
                });
            });

            // Assocs between counters
            if(assocs.length > 0){
                assocs.forEach(function(assoc){
                    // Prepare sql
                    var inst = mysql.format(sqlCptAssoc, assoc);

                    // Insert bus
                    trans.query(inst, function (err, result) {
                        if (err && trans.rollback) {
                            trans.rollback();
                            logger.log('error', 'TRANSACTION ROLLBACK');
                            throw err;
                        }
                    });
                });
            }
        }

        trans.commit(function (err, info) {
            if (err) {
                logger.log('error', 'TRANSACTION COMMIT ERROR');
            } else {
                logger.log('info', 'TRANSACTION COMMIT OK');
            }
            // Ending mysql connection once all queries have been executed
            connection.end(errorHandler.onMysqlEnd);
            // Send to init_parking: counters inserted
            global.events.emit('countersInserted');
        });
    }
}
;
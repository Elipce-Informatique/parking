/**
 * Created by vivian on 21/08/2015.
 */

var logger = require('../utils/logger.js');
var errorHandler = require('../utils/error_handler.js');

var mysql = require('mysql');
//Enable mysql-queues
var queues = require('mysql-queues');
var Q = require('q');

module.exports = {
    /**
     * Insert the settings provided by the controller
     * @param data : list of all settings
     */
    insertSettings: function (data) {

        //Query structure
        var sqlSetting = "INSERT IGNORE INTO compteur(libelle, json, v4_id)" +
            "VALUES (?, ?, ?)";

        // MYSQL CONNECTOR AND QUEUES
        var connection = require('../utils/mysql_helper.js')();
        queues(connection);

        // At least 1 setting
        if (data.length > 0) {
            // TRANSACTION
            var trans = connection.startTransaction();
            // Parse settings
            data.forEach(function (setting) {

                // Prepare sql
                var inst = mysql.format(sqlSetting, [
                    setting.name,
                    setting.json,
                    setting.ID
                ]);

                // Insert setting
                trans.query(inst, function (err, result) {
                    if (err) {
                        trans.rollback();
                        logger.log('error', 'TRANSACTION ROLLBACK');
                    }
                });
            });
            trans.commit(function (err, info) {
                if (err) {
                    logger.log('error', 'TRANSACTION COMMIT ERROR');
                }
            });
        }
    }
};
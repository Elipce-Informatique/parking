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
        var sqlSetting = "INSERT IGNORE INTO config_equipement(libelle, json, v4_id)" +
            "VALUES (?, ?, ?)";

        // MYSQL CONNECTOR AND QUEUES
        var connection = require('../utils/mysql_helper.js').standardConnexion();
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
                    JSON.stringify(setting.json),
                    setting.ID
                ]);
                //logger.log('info', 'INSERT config', inst);

                // Insert setting
                trans.query(inst, function (err, result) {
                    if (err && trans.rollback) {
                        //logger.log('error', '***********TRANS',trans);
                        trans.rollback();
                        logger.log('error', 'TRANSACTION ROLLBACK');
                    }
                }.bind(this));
            }, this);
            trans.commit(function (err, info) {
                if (err) {
                    logger.log('error', 'TRANSACTION COMMIT ERROR');
                }
                else{
                    //logger.log('info', 'TRANSACTION COMMIT SETTINGS OK');
                }
            });
        }
    }
};
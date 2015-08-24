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
     *  "ID": < number > ,
     *  "address": < number > ,
     *  "deviceInfo": {
     *      "manufacturer": < string > ,
     *      "modelName": < string > ,
     *      "serialNumber": < string > ,
     *      "softwareVersion": < string > ,
     *      "hardwareVersion": < string > ,
     *      "deviceType": < string >
     *  },
     *  "name": < string > ,
     *  }, < more entries > ]
     *
     * @param busV4Id : Unique ID of the bus on the controller
     * @param sensors : Array of sensors as described above
     */
    insertDisplays: function (busV4Id, displays) {
        // MYSQL CONNECTOR AND QUEUES
        var connection = require('../utils/mysql_helper.js')();
        queues(connection);
        var trans = connection.startTransaction();

        // GET BUS INFOS IN OUR DB
        var sqlBus = "SELECT b.id " +
            "FROM server_com s " +
            "JOIN parking p ON p.id=s.parking_id " +
            "JOIN concentrateur c ON c.parking_id=p.id " +
            "JOIN bus b ON b.concentrateur_id=c.id " +
            "WHERE s.protocol_port = ? " +
            "AND b.v4_id = ? ";

        var sqlDisplay = "INSERT IGNORE INTO afficheur (bus_id, adresse, reference, v4_id, manufacturer, " +
            "model_name, serial_number, software_version, hardware_version) " +
            "VALUES (?,?,?,?,?,?,?,?,?)";

        var insertDisplayConfig = "INSERT IGNORE INTO afficheur_config(afficheur_id, config_equipement_id) " +
            "VALUES (?, (SELECT id FROM config_equipement WHERE v4_id=?))";

        // Settings associations
        var assocs = [];

        // BusId from V4
        trans.query(sqlBus, [global.port, busV4Id], function (err, rows) {
            if (err && trans.rollback) {
                trans.rollback();
                throw err;
            }
            var busId = rows[0]['id'];
            // LOOP OVER ALL DISPLAYS FOR INSERTION
            _.each(displays, function (display) {

                // Preparing query
                var inst = mysql.format(sqlDisplay, [
                    busId,
                    display.address,
                    display.name,
                    display.ID,
                    display.namufacturer,
                    display.modelName,
                    display.serialNumber,
                    display.softwareVersion,
                    display.hardwareVersion
                ]);

                // Insert display
                trans.query(inst, function (err, result) {
                    // ROLLBACK THE TRANSACTION
                    if (err && trans.rollback) {
                        trans.rollback();
                        logger.log('error', 'TRANSACTION ROLLBACK');
                        throw err;
                    }
                    else {
                        // Settings assicated to the display
                        if (display.settings !== undefined) {
                            // Parse current display settings
                            display.settings.forEach(function (setting) {
                                assocs.push([result.insertId, setting]);
                            }, this);
                        }
                    }
                });
            }, this);
        });

        // TRANSACTION COMMIT IF NO ROLLBACK OCCURED
        var promise = Q.Promise(function (resolve, reject) {
            trans.commit(function (err, info) {
                if (err) {
                    logger.log('error', 'TRANSACTION COMMIT ERROR');
                    reject(err, trans);
                } else {
                    logger.log('info', 'TRANSACTION COMMIT DISPLAYS OK');
                    resolve(assocs);
                }
            }.bind(this));
        }.bind(this));

        // Execute transaction
        trans.execute();

        // Promise ready
        promise.then(function (tab) {
            var q = connection.createQueue();
            logger.log('info', 'ASSOCS DISPLAY SETTING', tab);
            tab.forEach(function (assoc) {
                q.query(mysql.format(insertDisplayConfig, assoc));
            }, this);
            q.execute();
            // ENDING MYSQL CONNECTION ONCE ALL QUERIES HAVE BEEN EXECUTED
            connection.end(errorHandler.onMysqlEnd);
        })
    }
};
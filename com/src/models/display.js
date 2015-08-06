/**
 * Created by yann on 24/07/2015.
 */

var logger = require('../utils/logger.js');
var errorHandler = require('../utils/error_handler.js');

var mysql = require('mysql');
//Enable mysql-queues
var queues = require('mysql-queues');
var _ = require('lodash');

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

        var sqlDisplay = "INSERT IGNORE INTO afficheur (bus_id, adresse, reference, v4_id) " +
            "VALUES (?,?,?)";
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
                    display.name]);

                // Insert bus
                trans.query(inst, function (err, result) {
                    // ROLLBACK THE TRANSACTION
                    if (err && trans.rollback) {
                        trans.rollback();
                        logger.log('error', 'TRANSACTION ROLLBACK');
                        throw err;
                    }
                });
            }, this);
        });

        // TRANSACTION COMMIT IF NO ROLLBACK OCCURED
        trans.commit(function (err, info) {
            if (err) {
                logger.log('error', 'TRANSACTION COMMIT ERROR');
            } else {
                logger.log('info', 'TRANSACTION COMMIT OK');
            }
            // ENDING MYSQL CONNECTION ONCE ALL QUERIES HAVE BEEN EXECUTED
            connection.end(errorHandler.onMysqlEnd);
        });
    }
};
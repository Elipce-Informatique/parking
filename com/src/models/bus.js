/**
 * Created by yann on 24/07/2015.
 */

var logger = require('../utils/logger.js');

var mysql = require('mysql');
//Enable mysql-queues
var queues = require('mysql-queues');

module.exports = {
    insertBuses: function (data) {

        //Query structure
        var sql = "INSERT IGNORE INTO bus(concentrateur_id, `type`, num, protocole, parameter, name, v4_id)" +
            "VALUES (?,?,?,?,?,?,?)";

        // MYSQL CONNECTOR AND QUEUES
        var connection = require('../utils/mysql_helper.js')();
        queues(connection);

        // TRANSACTION
        var trans = connection.startTransaction();
        // Parse controllers
        data.forEach(function (controller) {
            // Parking and controller infos from port and controller ID
            var sqlController = "" +
                "SELECT c.id " +
                "FROM server_com s " +
                "JOIN parking p ON p.id=s.parking_id " +
                "JOIN concentrateur c ON c.parking_id=p.id " +
                "WHERE s.protocol_port = ? " +
                "AND c.v4_id = ? ";

            trans.query(sqlController, [global.port, controller.controllerID], function (err, rows) {
                if (err && trans.rollback) {
                    trans.rollback();
                    throw err;
                }
                else {

                    // At least 1 bus
                    if (controller.bus.length > 0) {
                        var concentrateurId = rows[0]['id'];
                        // Parse buses
                        controller.bus.forEach(function (bus) {

                            // Prepare sql
                            var inst = mysql.format(sql, [
                                concentrateurId,
                                bus.busType,
                                bus.busNumber,
                                bus.protocol,
                                bus.parameter,
                                bus.name,
                                bus.ID]);

                            // Insert bus
                            trans.query(inst, function (err, result) {
                                if (err && trans.rollback) {
                                    trans.rollback();
                                    logger.log('error', 'TRANSACTION ROLLBACK' );
                                    throw err;
                                }
                            });
                        }, this);
                    }
                }
            });
            trans.commit(function (err, info) {
                if (err) {
                    logger.log('error', 'TRANSACTION COMMIT ERROR');
                } else {
                    logger.log('info', 'TRANSACTION COMMIT OK');
                }
            });

        }, this);
        //// COMMIT
        //connection.commit(function (err) {
        //    if (err) {
        //        return connection.rollback(function () {
        //            logger.log('error', 'busConfigData: Transaction rollback: General');
        //        });
        //    }
        //    else {
        //        logger.log('info', 'busConfigData: Transaction commit');
        //    }
        //});
    }
};
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
var _ = require('lodash');

module.exports = {
    /**
     * Insert the buses provided by the controller
     * @param data : list of all controllers with a bus property featuring an array of buses.
     * @param onBusInserted : callback function
     */
    insertBuses: function (data, onBusInserted) {
        logger.log('info', 'START INSERT BUSSES', data);
        //Query structure insert controller
        var insertController = "INSERT IGNORE INTO concentrateur(parking_id, v4_id) " +
            "VALUES (?, ?)";

        //Query structure insert bus
        var sql = "INSERT IGNORE INTO bus(concentrateur_id, `type`, num, protocole, parameter, name, v4_id)" +
            "VALUES (?,?,?,?,?,?,?)";

        // MYSQL CONNECTOR AND QUEUES
        var connection = require('../utils/mysql_helper.js').standardConnexion();
        queues(connection);

        // TRANSACTION
        var trans = connection.startTransaction();
        // Controllers inserted
        var controllersInserted = [];

        // Parse controllers
        data.forEach(function (controller) {
            // INSERT controller
            var inst = mysql.format(insertController, [global.parkingId, controller.controllerID]);
            trans.query(inst, function (err, result) {
                if (err && trans.rollback) {
                    logger.log('error', 'ERROR CONTROLLER INSERTED ', err);
                    throw err;
                }
                // Insert controller OK
                else {
                    //logger.log('info', 'CTRL INSERTED ', result);
                    controllersInserted.push({
                        id: result.insertId,
                        busses: _.cloneDeep(controller.bus)
                    });
                }
            });
        }, this);// Fin foreach


        // TRANSACTION COMMIT IF NO ROLLBACK OCCURED
        var promise = Q.Promise(function (resolve, reject) {
            trans.commit(function (err, info) {
                if (err && trans.rollback()) {
                    logger.log('error', 'TRANSACTION COMMIT CONTROLLERS REJECT');
                    reject(err, trans);
                } else {
                    logger.log('info', 'CONTROLLERS INSERTED OK');
                    resolve(controllersInserted);
                }
            });
        });

        // Transaction execution
        trans.execute();

        // Controllers inserted, then
        promise.then(function controllersOk(controllers) {

            //logger.log('info', 'PASSE PROMISE BUSSES', controllers);
            trans = connection.startTransaction();
            // Parse controllers
            controllers.forEach(function (controller, indexCtrl) {

                //logger.log('info', 'ID CTRL ' + controller.id + ' length: ' + controller.busses.length);
                // New controller inserted AND At least 1 bus
                if (controller.id > 0 && controller.busses.length > 0) {
                    var concentrateurId = controller.id;
                    // Parse buses
                    controller.busses.forEach(function (bus, indexBus) {

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
                                logger.log('error', 'ERROR BUS INSERTED ', err);
                                trans.rollback();
                                throw err;
                            }
                            else {
                                //logger.log('info', 'BUS INSERTED ' + bus.ID, result);
                            }
                        });
                    }, this);
                }
            })// fin foreach controllers

            // TRANSACTION COMMIT IF NO ROLLBACK OCCURED
            var promiseBusses = Q.Promise(function (resolve, reject) {
                trans.commit(function (err, info) {
                    if (err && trans.rollback()) {
                        logger.log('error', 'TRANSACTION COMMIT CONTROLLERS REJECT');
                        reject(err, trans);
                    } else {
                        resolve(controllersInserted);
                    }
                });
            });

            trans.execute();

            promiseBusses.then(function promiseBussesOk() {

                logger.log('info', 'TRANSACTION COMMIT BUSSES OK');
                // Ending mysql connection once all queries have been executed
                connection.end(errorHandler.onMysqlEnd);
                onBusInserted(true);

            }, function promisesBussesKo() {

                // Rollback => ending conexion
                trans.rollback();
                connection.end(errorHandler.onMysqlEnd);
                logger.log('error', 'ERROR INSERT BUSSES', err);
                onBusInserted(false);
            });


        }, function promisesCtrlKo(err) {
            logger.log('error', 'ERROR INSERT CONTROLLERS', err);
            // Rollback => ending conexion
            trans.rollback();
            connection.end(errorHandler.onMysqlEnd);
            onBusInserted(false);
        });
    },

    /**
     * Insert an event in the event_bus table
     * @param pool : Mysql connection
     * @param events : array of events to insert
     * @param onFinished : function called when event insertion is done
     */
    insertBusEvents: function (pool, events, onFinished) {
        logger.log('info', 'BUS EVENTS to store ', events);

        var mysqlHelper = require('../utils/mysql_helper.js');
        var busesId = [];

        // Insertion in the event table
        var eventSql = "INSERT INTO event_bus(bus_id,date,state,hwstate)" +
            "VALUES (?,?,?,?)";

        // FETCH BUS ID FROM V4_ID. NEED TO GO THROUGH THE PARKING
        var sqlBusId = "SELECT b.id " +
            "   FROM bus b" +
            "   JOIN concentrateur c ON c.id=b.concentrateur_id" +
            "   JOIN parking pa ON pa.id=c.parking_id" +
            "   JOIN server_com s ON s.parking_id=pa.id" +
            "   WHERE b.v4_id=?" +
            "   AND s.protocol_port=?";

        // LOOP OVER ALL EVENTS
        _.each(events, function (evt, index) {
            // Promise 1
            return Q.promise(function (resolve, reject) {
                //logger.log('info', 'PASS promise 1 ');
                mysqlHelper.execute(pool, sqlBusId, [evt.ID, global.port], function (err, result) {

                    // ROLLBACK THE TRANSACTION
                    if (err) {
                        logger.log('error', 'ERREUR SQL GET BUS ID', err);
                        reject(err);
                    }
                    else if (result.length == 0) {
                        logger.log('error', 'NO V4 ID BUS ' + evt.ID + ". Le bus n'est probablement pas lié à un concentrateur");
                        reject(err);
                    }
                    else {
                        resolve(result);
                    }
                });
            }).then(function resolve1(result) {

                var busId = result[0].id;
                busesId.push(busId);

                return Q.promise(function (resolve, reject) {
                    // INSERT IN THE EVENT TABLE
                    mysqlHelper.execute(pool, eventSql, [busId, evt.date, evt.state, evt.hwstate],
                        function (err, result) {
                            if (err) {
                                logger.log('error', 'ERREUR SQL INSERT event_bus: ', err);
                            }
                            resolve();
                        });
                });


            }, function reject1(err) {
                logger.log('error', 'REJECT promise 1', err);
            }).then(function resolveEventBus() {

                // FINAL COUNTER EVENT
                if (index == (events.length - 1)) {
                    //logger.log('info', 'NOTIFICATION BUS EVENTS OK ');
                    // NOTIFY CALLER THAT WE'RE DONE
                    onFinished(busesId);
                }
            });

        });// fin _.each

    }

    ,

    /**
     * Get all parking buses
     * @param port: listening parking port
     * @param callback: callback function with result parameter
     */
    getBuses: function (port, callback) {
        var connexion = require('../utils/mysql_helper.js').standardConnexion();

        var sql = "" +
            "SELECT b.id, b.concentrateur_id AS controllerID, b.type AS busType, b.num AS busNumber, " +
            "b.protocole AS protocol, b.parameter, b.name " +
            "FROM bus b " +
            "JOIN concentrateur c ON c.id=b.concentrateur_id " +
            "JOIN parking p ON p.id=c.parking_id " +
            "JOIN server_com s ON s.parking_id=p.id " +
            "WHERE s.protocol_port = ? ";

        connexion.query(sql, [global.port], function (err, result) {

            callback(err, result);
            // End the connection once the callback is done
            // to avoid the fatal error due to the server timeout
            connexion.end();
        });
    }
};
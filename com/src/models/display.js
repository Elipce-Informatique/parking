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
        var connection = require('../utils/mysql_helper.js').standardConnexion();
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
    },

    /**
     * Insert an event in the event_affciheur table
     * @param pool : Mysql connection
     * @param events : array of events to insert
     * @param onFinished : function called when event insertion is done
     */
    insertDisplayEvents: function (pool, events, onFinished) {
        logger.log('info', 'DISPLAY EVENTS to store ', events);

        var mysqlHelper = require('../utils/mysql_helper.js');
        var displaysId = [];

        // Insertion in the event table
        var eventSql = "INSERT INTO event_afficheur(afficheur_id,date,state,supply,dfu)" +
            "VALUES (?,?,?,?,?)";

        // FETCH COUNTER ID FROM V4_ID. NEED TO GO THROUGH THE PARKING
        var sqlDisplayId = "SELECT a.id " +
            "   FROM afficheur a" +
            "   JOIN plan ON plan.id=a.plan_id" +
            "   JOIN niveau n ON n.id=plan.niveau_id" +
            "   JOIN parking pa ON pa.id=n.parking_id" +
            "   JOIN server_com s ON s.parking_id=pa.id" +
            "   WHERE a.v4_id=?" +
            "   AND s.protocol_port=?";

        // LOOP OVER ALL EVENTS
        _.each(events, function (evt, index) {
            // Promise 1
            return Q.promise(function (resolve, reject) {
                //logger.log('info', 'PASS promise 1 ');
                mysqlHelper.execute(pool, sqlDisplayId, [evt.ID, global.port], function (err, result) {

                    // ROLLBACK THE TRANSACTION
                    if (err) {
                        logger.log('error', 'ERREUR SQL GET DISPLAY ID', err);
                        reject(err);
                    }
                    else if (result.length == 0) {
                        logger.log('error', 'NO V4 ID DISPLAY ' + evt.ID + ". L'afficheur n'est probablement pas associé à un plan");
                        reject(err);
                    }
                    else {
                        resolve(result);
                    }
                });
            }).then(function resolve1(result) {

                var displayId = result[0].id;
                displaysId.push(displayId);

                return Q.promise(function (resolve, reject) {
                    // INSERT IN THE EVENT TABLE
                    mysqlHelper.execute(pool, eventSql, [displayId, evt.date, evt.state, evt.supply, evt.dfu],
                        function (err, result) {
                            if (err) {
                                logger.log('error', 'ERREUR SQL INSERT event_afficheur: ', err);
                            }
                            resolve();
                        });
                });


            }, function reject1(err) {
                logger.log('error', 'REJECT promise 1', err);
            }).then(function resolveEventAfficheur() {

                // FINAL DISPLAY EVENT
                if (index == (events.length - 1)) {
                    //logger.log('info', 'NOTIFICATION DISPLAY EVENTS OK ');
                    // NOTIFY CALLER THAT WE'RE DONE
                    onFinished(displaysId);
                }
            });

        });// fin _.each
    },

    /**
     * Insert displays in supervision DB
     * @param busId
     * @param sensors
     */
    insertDisplaysFromBusEnum: function(busId, sensors){

    }
};
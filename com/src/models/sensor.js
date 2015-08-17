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
     *        "ID": < number > ,
     *        "address": < number > ,
     *        "spaceType": < string > ,
     *        "overstay": < number > ,
     *        "destination": [ < number > , ...],
     *        "deviceInfo": {
     *            "manufacturer": < string > ,
     *            "modelName": < string > ,
     *            "serialNumber": < string > ,
     *            "softwareVersion": < string > ,
     *            "hardwareVersion": < string > ,
     *            "deviceType": < string >
     *        },
     *        "name": < string > ,
     *    }, < more entries > ]
     *
     * @param busV4Id : Unique ID of the bus on the controller
     * @param sensors : Array of sensors as described above
     */
    insertSensors: function (busV4Id, sensors) {
        // MYSQL CONNECTOR AND QUEUES
        var connection = require('../utils/mysql_helper.js')();
        queues(connection);
        var trans = connection.startTransaction();

        // Get bus infos in our DB
        var sqlBus = "SELECT b.id " +
            "FROM server_com s " +
            "JOIN parking p ON p.id=s.parking_id " +
            "JOIN concentrateur c ON c.parking_id=p.id " +
            "JOIN bus b ON b.concentrateur_id=c.id " +
            "WHERE s.protocol_port = ? " +
            "AND b.v4_id = ? ";
        var sqlSensor = "INSERT IGNORE INTO capteur (bus_id, adresse, libelle, v4_id) " +
            "VALUES (?,?,?,?)";
        trans.query(sqlBus, [global.port, busV4Id], function (err, rows) {
            if (err && trans.rollback) {
                trans.rollback();
                throw err;
            }
            var busId = rows[0]['id'];
            // LOOP OVER ALL SENSORS FOR INSERTION
            _.each(sensors, function (sensor) {

                // Preparing query
                var inst = mysql.format(sqlSensor, [
                    busId,
                    sensor.address,
                    sensor.name,
                    sensor.ID
                ]);

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
    },

    /**
     * Insert an event in the journal_equipment_plan table
     * @param events : array of events to insert
     */
    insertSensorEvents: function (events) {
        logger.log('info', 'SENSOR EVENTS to store : %o', events);

        var connection = require('../utils/mysql_helper.js')();
        queues(connection);
        var trans = connection.startTransaction();

        // Insertion in the event table
        var eventSql = "INSERT INTO event_capteur (capteur_id,date,state,sense,supply,dfu)" +
            "VALUES (?,?,?,?,?,?)";

        // Fetch space and sensor data
        var getPlaceInfosSql = "SELECT c.id AS capteur_id, p.id AS place_id, tp.id AS type_place_id, eo.id AS etat_occupation_id, plan.id AS plan_id FROM capteur c" +
            " JOIN place p ON p.capteur_id=c.id" +
            " JOIN type_place tp ON p.type_place_id=tp.id" +
            " JOIN etat_occupation eo ON eo.type_place_id=tp.id" +
            " JOIN allee a ON a.id=p.allee_id" +
            " JOIN zone z ON z.id=a.zone_id" +
            " JOIN plan ON plan.id=z.plan_id" +

            " WHERE eo.is_occupe=? AND c.id=(" +
            "   SELECT c.id FROM capteur c" +
            "   JOIN place p ON p.capteur_id=c.id" +
            "   JOIN allee a ON a.id=p.allee_id" +
            "   JOIN zone z ON z.id=a.zone_id" +
            "   JOIN plan ON plan.id=z.plan_id" +
            "   JOIN niveau n ON n.id=plan.niveau_id" +
            "   JOIN parking pa ON pa.id=n.parking_id" +

            "   WHERE c.v4_id=? and pa.id=?" +
            ")";

        // LOOP OVER ALL EVENTS
        _.each(events, function (evt) {
            var getSensorIdSql = "SELECT c.id FROM capteur c" +
                "   JOIN place p ON p.capteur_id=c.id" +
                "   JOIN allee a ON a.id=p.allee_id" +
                "   JOIN zone z ON z.id=a.zone_id" +
                "   JOIN plan ON plan.id=z.plan_id" +
                "   JOIN niveau n ON n.id=plan.niveau_id" +
                "   JOIN parking pa ON pa.id=n.parking_id" +

                "   WHERE c.v4_id=?";

            trans.query(getSensorIdSql, [evt.ID], function (err, result) {
                // ROLLBACK THE TRANSACTION
                if (err && trans.rollback) {
                    trans.rollback();
                    logger.log('error', 'TRANSACTION ROLLBACK');
                    throw err;
                } else {
                    var sensorId = result[0].id;
                    logger.log('error', 'SENsor ID : ' + sensorId);

                    trans.query(eventSql, [sensorId, evt.date, evt.state, evt.sense, evt.supply, evt.dfu], function (err, result) {
                        if (err && trans.rollback) {
                            trans.rollback();
                            logger.log('error', 'TRANSACTION ROLLBACK');
                            throw err;
                        }
                    });

                    // HANDLE EACH TYPE OF SENSE EVENT
                    switch (events.sense) {
                        case "undef":
                            // We do not change the journal in database
                            break;
                        case "free":
                            // Update journal AND etat d'occupation for the space
                            trans.query(getPlaceInfosSql, ['0', evt.ID], function (err, rows) {

                            });
                            break;
                        case "occupied":
                            // Update journal AND etat d'occupation for the space
                            trans.query(getPlaceInfosSql, ['1', evt.ID], function (err, rows) {

                            });
                            break;
                        case "overstay":
                            // Update journal BUT leave the same etat d'occupation
                            break;
                        case "error":
                            // We do not change the journal in database
                            break;
                        default:
                    }
                }
            });

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
/**
 * Created by vivian on 17/08/2015.
 */
var mysql = require('mysql');
var logger = require('../utils/logger.js');

module.exports = {
    /**
     * Get parking information
     * @param port
     * @param callback
     */
    getInfos: function (port, callback) {
        // Dependencies
        var connexion = require('../utils/mysql_helper.js').standardConnexion();

        // Query
        var sql = "" +
            "SELECT p.* " +
            "FROM parking p " +
            "JOIN server_com s ON s.parking_id=p.id " +
            "WHERE s.protocol_port = ?";
        connexion.query(sql, port, function (err, rows, fields) {
            callback(err, rows, fields);
            // End the connection once the callback is done
            // to avoid the fatal error due to the server timeout
            connexion.end();
        });
    },

    /**
     * Update field parking.last_synchro_ok to indicate the last synchro time
     * @param pool: MySQL connexion
     * @param onUpdate: callback on sql execution
     */
    updateSynchro: function (pool, onUpdate) {
        var mysqlHelper = require('../utils/mysql_helper.js');

        var update = "" +
            "UPDATE parking " +
            "SET last_synchro_ok=UTC_TIMESTAMP() " +
            "WHERE id=?";

        mysqlHelper.execute(pool, update, [global.parkingId], function (err, result) {
            onUpdate(err, result);
        });
    },

    /**
     * Get all displays of the parking
     * @param pool: MySQL connexion
     * @param onGetDisplays: callback function
     */
    getAllDisplays: function(pool, onGetDisplays){

        var mysqlHelper = require('../utils/mysql_helper.js');

        var sql = "" +
            "SELECT b.v4_id AS busID, a.v4_id AS ID, a.adresse AS address, a.manufacturer, a.model_name AS modelName, a.reference AS name, " +
            "a.serial_number AS serialNumber, a.software_version AS softwareVersion, a.hardware_version AS hardwareVersion, a.a_supprimer, " +
            "GROUP_CONCAT(ce.id SEPARATOR ',')AS settings " +
            "FROM parking p " +
            "JOIN concentrateur c ON c.parking_id=p.id " +
            "JOIN bus b ON b.concentrateur_id=c.id " +
            "JOIN afficheur a ON b.id=a.bus_id " +
            "LEFT JOIN afficheur_config ac ON ac.afficheur_id=a.id " +
            "LEFT JOIN config_equipement ce ON ce .id=ac.config_equipement_id " +
            "WHERE p.id = ? " +
            "GROUP BY a.id " +
            "ORDER BY b.id, a.adresse";

        mysqlHelper.execute(pool, sql, [global.parkingId], function (err, result) {
            onGetDisplays(err, result);
        });
    },

    /**
     * Get all views of the parking
     * @param pool: MySQL connexion
     * @param onGetViews: callback function
     */
    getAllViews: function(pool, onGetViews){

        var mysqlHelper = require('../utils/mysql_helper.js');

        var sql = "" +
            "SELECT v.v4_id AS ID, a.v4_id AS displayID, v.cellNr, co.v4_id AS counterID, v.total, v.offset, v.emptyLow, v.emptyHigh, " +
            "v.fullLow, v.fullHigh, v.libelle AS name " +
            "FROM parking p " +
            "JOIN concentrateur c ON c.parking_id=p.id " +
            "JOIN bus b ON b.concentrateur_id=c.id " +
            "JOIN afficheur a ON b.id=a.bus_id " +
            "JOIN vue v ON v.afficheur_id=a.id " +
            "JOIN compteur co ON co.id=v.compteur_id " +
            "WHERE p.id = ? ";

        var inst = mysql.format(sql, [global.parkingId]);
        //logger.log('info','getAllViews: '+inst);
        mysqlHelper.execute(pool, inst, function (err, result) {
            onGetViews(err, result);
        });
    },

    /**
     * Get all counters of the parking
     * @param pool: MySQL connexion
     * @param onGetCounters: callback function
     */
    getAllCounters: function(pool, onGetCounters){

        var mysqlHelper = require('../utils/mysql_helper.js');

        var sql = "" +
            "SELECT co.v4_id AS ID, co.libelle AS name, GROUP_CONCAT(cf.v4_id SEPARATOR ',')AS destination " +
            "FROM parking p " +
            "JOIN concentrateur c ON c.parking_id=p.id " +
            "JOIN bus b ON b.concentrateur_id=c.id " +
            "JOIN afficheur a ON b.id=a.bus_id " +
            "JOIN vue v ON v.afficheur_id=a.id " +
            "JOIN compteur co ON co.id=v.compteur_id " +
            "LEFT JOIN compteur_compteur cc ON cc.compteur_id=co.id " +
            "LEFT JOIN compteur cf ON cf.id=cc.compteur_fils_id " +
            "WHERE p.id = ? " +
            "GROUP BY co.id";

        var inst = mysql.format(sql, [global.parkingId]);
        //logger.log('info','getAllCounters: '+inst);
        mysqlHelper.execute(pool, inst, function (err, result) {
            onGetCounters(err, result);
        });
    },

    /**
     * Get all counter/sensor of the parking
     * @param pool: MySQL connexion
     * @param onGetAssocCountersSensors: callback function
     */
    getAllAssocCountersSensors: function(pool, onGetAssocCountersSensors){

        var mysqlHelper = require('../utils/mysql_helper.js');

        var sql = "" +
            "SELECT ca.v4_id AS ID, GROUP_CONCAT(co.v4_id SEPARATOR ',')AS destination " +
            "FROM parking p " +
            "JOIN concentrateur c ON c.parking_id=p.id " +
            "JOIN bus b ON b.concentrateur_id=c.id " +
            "JOIN afficheur a ON b.id=a.bus_id " +
            "JOIN vue v ON v.afficheur_id=a.id " +
            "JOIN compteur co ON co.id=v.compteur_id " +
            "JOIN capteur_compteur cc ON cc.compteur_id=co.id " +
            "JOIN capteur ca ON ca.id=cc.capteur_id " +
            "WHERE p.id = ? " +
            "GROUP BY ca.id";

        var inst = mysql.format(sql, [global.parkingId]);
        //logger.log('info','getAllAssocs: '+inst);
        mysqlHelper.execute(pool, inst, function (err, result) {
            onGetAssocCountersSensors(err, result);
        });
    }
}
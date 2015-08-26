/**
 * Created by vivian on 17/08/2015.
 */
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
    }
};
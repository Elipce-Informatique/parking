/**
 * Created by yann on 24/07/2015.
 */
module.exports = {
    /**
     * Get the capabilities for for the server with the port in params
     * @param port
     * @param callback
     */
    getCapabilities: function (port, callback) {
        // Dependencies
        var connexion = require('../utils/mysql_helper.js');

        // Query
        var sql = "" +
            "SELECT protocol_version AS protocolVersion," +
            "protocol_port AS protocolPort," +
            "software_name AS softwareName," +
            "software_version AS softwareVersion," +
            "software_build_date AS softwareBuildDate," +
            "software_os AS softwareOs, " +
            "'" + Date.now() + "' AS `date` " +
            "FROM server_com " +
            "WHERE protocol_port = ?";
        connexion.query(sql, port, callback);
    }
};
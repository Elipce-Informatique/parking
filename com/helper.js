var server = ({
    /**
     * COM server capabilities
     * @param port: port used to communicate
     * @param client: websocket client
     */
    capabilities: function (port, client) {
        // Dependencies
        var connexion = require('./mysql.js');

        // Variables
        var retour = {
            messageType: 'capabilities',
            data: {}
        }
        // Query
        var sql = "" +
            "SELECT protocol_version AS protocolVersion," +
            "protocol_port AS protocolPort," +
            "software_name AS softwareName," +
            "software_version AS softwareVersion," +
            "software_build_date AS softwareBuildDate," +
            "software_os AS softwareOs " +
            "FROM server_com " +
            "WHERE protocol_port = ?";

        // Exectute
        connexion.query(sql, port, function(err, rows, fields) {
            if (err) throw err;

            // Update result
            retour.data = rows[0];

            // Send
            //console.log('Envoi du server: '+JSON.stringify(retour));
            client.send(JSON.stringify(retour));
        });
        // Close DB
        connexion.end();
    }
});

module.exports.Server = server;

var client = ({
    /**
     * Client send capabilities infos (contoller)
     * @returns {{messageType: string, data: {toto: string}}}
     */
    capabilities: function () {
        var retour = {
            messageType: 'capabilities',
            data: {
                'toto': 'from client'
            }
        }
        return retour;
    }
});

module.exports.Client = client;
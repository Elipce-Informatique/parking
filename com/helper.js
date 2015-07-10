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
            "software_os AS softwareOs, " +
            "'"+Date.now() + "' AS `date` " +
            "FROM server_com " +
            "WHERE protocol_port = ?";

        // Exectute
        connexion.query(sql, port, function (err, rows, fields) {
            // Error
            if (err) {
                // SQL error
                logger.log('error', 'capabilities SQL error ' + err.message);
                retour = {
                    messageType: 'capabilities',
                    error: {
                        action: "SQL error",
                        text: err.message
                    }
                }
            }
            // No error
            else {
                // Update result
                retour.data = rows[0];
                logger.log('info', 'capabilities answer OK');
            }

            // Send
            client.send(JSON.stringify(retour));

            // Close DB
            //connexion.end(); // Attention fait BUGGER ???
        });
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
            data: {}
        }
        return retour;
    }
});

module.exports.Client = client;


// LOG
var path = require('path');
var winston = require('winston');

var filename = path.join(__dirname, '/log/event');
var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.DailyRotateFile)({filename: filename})
    ]
});

module.exports.Log = logger;
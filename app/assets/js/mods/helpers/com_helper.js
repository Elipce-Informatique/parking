var client = ({

    /***************************************************************
     *************** CONTROLLER CONFIGURATION ************************
     ***************************************************************/

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
    },

    /**
     * Communication server configures the controller
     * @param host: controller host
     * @param port: port used to communicate
     * @param timeZone: time zone
     * @param syslogServer: log server adress
     */
    configuration: function (host, port, timeZone, syslogServer) {

        var retour = {
            messageType: 'configuration',
            data: {
                serverURL: "wss://" + host + ":" + port + "/",
                timezone: "Europe/Berlin",
                syslogServer: syslogServer
            }
        }
        return retour;
    },

    /**
     * Send a command to the controller
     * @param command:
     * - reset
     * - initialize
     * @returns {{messageType: string, data: {command: *}}}
     */
    remoteControl: function (command) {
        return {
            messageType: "remoteControl",
            "data": {
                command: command
            }
        }
    },


    /***************************************************************
     *************** DATABASE CONFIGURATION ************************
     ***************************************************************/

    busConfigQuery: function () {
        return {
            messageType: "busConfigQuery",
            data: {}
        }
    }


});

module.exports = client;

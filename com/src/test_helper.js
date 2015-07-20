/**
 * Test module to "simulate" a controller with a local client
 */

module.exports = {
    /**
     * Client (contoller) send capabilities infos
     * @returns {{messageType: string, data: {toto: string}}}
     */
    capabilities: function () {
        var retour = {
            messageType: 'capabilities',
            data: {}
        };
        return retour;
    },

    busConfigData: function () {
        return {
            "messageType": "busConfigData",
            "data": [
                {
                    "controllerID": 1,
                    "bus": [
                        {
                            "ID": 1,
                            "busType": "CAN",
                            "busNumber": 1,
                            "protocol": "p8",
                            "parameter": "ter",
                            "name": "A"
                        },
                        {
                            "ID": 2,
                            "busType": "CAN",
                            "busNumber": 2,
                            "protocol": "p8",
                            "parameter": "ter",
                            "name": "B"
                        }
                    ]
                },
                {
                    "controllerID": 2,
                    "bus": [
                        {
                            "ID": 3,
                            "busType": "CAN",
                            "busNumber": 1,
                            "protocol": "p8",
                            "parameter": "ter",
                            "name": "A"
                        }
                    ]
                }
            ]

        };
    },

    busConfigQuery: function () {
        return {
            messageType: "busConfigQuery",
            data: {}
        }
    }
};
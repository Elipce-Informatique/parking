// Local modules
var logger = require('./logger.js');
var _ = require('lodash');

module.exports = {
    /**
     * Convert DB sensors array to bus enumerate update message array
     * @param dbSensors: [{
                        ID: result.insertId,
                        busId: busId,
                        address: adresse,
                        spaceType: "generic"
                    }]
     */
    dbSensorsToBusEnum: function (dbSensors) {

        // Parse sensors
        return _.map(dbSensors, function (sensor) {
            return {
                device: "sensor",
                ssn: sensor.serialNumber,
                address: sensor.deviceInfo.address
            }
        });
    },

    /**
     * Convert supervision DB displays to controller DB displays
     * @param dbDisplays: result of parking.getAllDisplays
     * @returns {{busID: (*|busID), display: Array}[]}
     */
    dbDisplaysToConfigUpdate: function (dbDisplays) {
        var currentBus = dbDisplays[0].busID;
        var retour = [{
            busID: currentBus,
            display: []
        }];
        var indBus = 0;

        // Parse displays
        dbDisplays.forEach(function (display, index) {

            if (display.busID != currentBus) {
                indBus++;
                currentBus = display.busID;
                retour.push({
                    busID: currentBus,
                    display: []
                })
            }
            retour[indBus].display.push({
                ID: display.ID,
                address: display.address,
                name: display.name,
                deviceInfo: {
                    manufacturer: display.manufacturer,
                    modelName: display.modelName,
                    serialNumber: display.serialNumber,
                    softwareVersion: display.softwareVersion,
                    hardwareVersion: display.hardwareVersion
                }
            });
        }, this);

        return retour;
    },

    /**
     * Convert DB sensors array to bus enumerate update message array
     * @param dbSensors: [{
                        ID: result.insertId,
                        busId: busId,
                        address: adresse,
                        spaceType: "generic"
                    }]
     */
    dbCountersToConfigUpdate: function (dbCounters) {
// TODO a terminer
        // Parse sensors
        return _.map(dbCounters, function (counter) {
            return {
                ID: counter.ID,
                destination: [],
                name: counter.name
            }
        });
    },
};
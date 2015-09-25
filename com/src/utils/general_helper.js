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
        var viewsToDelete = [];

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
            var obj = {
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
            };
            // DELETE
            if(display.a_supprimer == '1'){
                obj.DELETE = true;
                // Views
                viewsToDelete.push(display.ID);
            }
            retour[indBus].display.push(obj);
        }, this);

        return {
            update: retour,
            delete: viewsToDelete
        };
    },

    /**
     * Convert DB counters array to bus enumerate update message array
     * @param dbCounters: [{
                        ID: result.insertId,
                        busId: busId,
                        address: adresse,
                        spaceType: "generic"
                    }]
     */
    dbCountersToConfigUpdate: function (dbCounters) {
        // Parse sensors
        return _.map(dbCounters, function (counter) {
            var obj = {
                ID: counter.ID,
                name: counter.name
            }
            // Destinations ?
            if (counter.destination !== null) {
                obj.destination = counter.destination.split(',');
            }
            return obj;
        });
    },

    /**
     * Convert DB assoc sensors array to bus enumerate update message array
     * @param dbAssoc: [{
                        ID: result.insertId,
                        busId: busId,
                        address: adresse,
                        spaceType: "generic"
                    }]
     */
    dbAssocCountersSensorsToConfigUpdate: function (dbAssoc) {
        // Parse assoc
        return _.map(dbAssoc, function (assoc) {
            if (assoc.destination !== null) {
                return {
                    ID: assoc.ID,
                    destination: assoc.destination.split(',')
                }
            }
        });
    }
}
;
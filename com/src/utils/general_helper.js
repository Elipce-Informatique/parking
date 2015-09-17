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
        return _.map(dbSensors, function(sensor){
           return {
               device: "sensor",
               ssn: sensor.serialNumber,
               address: sensor.address
           }
        });
    }
};
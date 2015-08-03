/**
 * Created by yann on 24/07/2015.
 */
var config = require('../commands/config.js'), config = new config();
var logger = require('../utils/logger.js');

module.exports = {
    /**
     * Starts the initialisation procedure
     */
    start: function () {
        this.bindEvents();
        // 1 - GET ALL THE CONFIGURATION FROM THE CONTROLLER
        config.sendConfigurationQuery();
    },
    bindEvents: function () {
        config.on('onCapabilitiesData', this.onCapabilitiesData);
        config.on('configurationData', this.onConfigurationData);
        config.on('busConfigData', this.onBusConfigData);
        config.on('sensorConfigData', this.onSensorConfigData);
        config.on('displayConfigData', this.onDisplayConfigData);
        config.on('counterConfigData', this.onCounterConfigData);
    },

    /**
     * Handle capabilites data for the parking initialization process.
     * @param data : the data sent by the controller
     */
    onCapabilitiesData: function (data) {

    },
    /**
     * Handle Configuration data for the parking initialization process.
     * @param data : the data sent by the controller
     */
    onConfigurationData: function (data) {

    },
    /**
     * Handle BusConfig data for the parking initialization process.
     * @param data : the data sent by the controller
     */
    onBusConfigData: function (data) {

    },
    /**
     * Handle SensorConfig data for the parking initialization process.
     * @param data : the data sent by the controller
     */
    onSensorConfigData: function (data) {

    },
    /**
     * Handle DisplayConfig data for the parking initialization process.
     * @param data : the data sent by the controller
     */
    onDisplayConfigData: function (data) {

    },
    /**
     * Handle CounterConfig data for the parking initialization process.
     * @param data : the data sent by the controller
     */
    onCounterConfigData: function (data) {

    }
};
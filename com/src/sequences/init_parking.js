/**
 * Created by yann on 24/07/2015.
 */

var _ = require('lodash');

var Config = require('../commands/config.js');
var logger = require('../utils/logger.js');

module.exports = {
    config: {},
    /**
     * Starts the initialisation procedure
     */
    start: function (config) {
        this.config = null;
        if (config instanceof Config) {
            this.config = config;
        } else {
            throw new TypeError("Config instance expected");
        }
        this.bindEvents();
        // 1 - GET ALL THE CONFIGURATION FROM THE CONTROLLER
        this.config.sendConfigurationQuery();
        this.config.sendBusConfigQuery();
        this.config.sendCounterConfigQuery();
    },
    bindEvents: function () {
        logger.log('info', 'Binding events from the init procedure');
        this.config.on('configurationData', this.onConfigurationData.bind(this));
        this.config.on('busConfigData', this.onBusConfigData.bind(this));
        this.config.on('sensorConfigData', this.onSensorConfigData.bind(this));
        this.config.on('displayConfigData', this.onDisplayConfigData.bind(this));
        this.config.on('counterConfigData', this.onCounterConfigData.bind(this));
    },

    /**
     * Handle Configuration data for the parking initialization process.
     * @param data : the data sent by the controller
     */
    onConfigurationData: function (data) {
        logger.log('info', 'onConfigurationData');
    },
    /**
     * Handle BusConfig data for the parking initialization process.
     * @param data : the data sent by the controller
     */
    onBusConfigData: function (data) {
        logger.log('info', 'TEST EVTS busConfigData: data -> ', data);
        _.each(data, function (ctrl) {
            _.each(ctrl.bus, function (bus) {
                this.config.sendSensorConfigQuery(bus.ID);
                this.config.sendDisplayConfigQuery(bus.ID);
            }, this);
        }, this);
    },
    /**
     * Handle SensorConfig data for the parking initialization process.
     * @param data : the data sent by the controller
     */
    onSensorConfigData: function (data) {
        logger.log('info', 'onSensorConfigData : ');
    },
    /**
     * Handle DisplayConfig data for the parking initialization process.
     * @param data : the data sent by the controller
     */
    onDisplayConfigData: function (data) {
        logger.log('info', 'onDisplayConfigData : ');
    },
    /**
     * Handle CounterConfig data for the parking initialization process.
     * @param data : the data sent by the controller
     */
    onCounterConfigData: function (data) {
        logger.log('info', 'onCounterConfigData');
    }
};
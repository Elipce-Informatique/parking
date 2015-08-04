/**
 * Created by yann on 24/07/2015.
 */
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
        this.config.on('configurationData', this.onConfigurationData);
        this.config.on('busConfigData', this.onBusConfigData);
        this.config.on('sensorConfigData', this.onSensorConfigData);
        this.config.on('displayConfigData', this.onDisplayConfigData);
        this.config.on('counterConfigData', this.onCounterConfigData);

        // TODO TEST
        this.config.on('testEvt', this.onTest);
        this.config.testEvts('Hello world');
        // TODO TEST
    },

    onTest: function (msg) {
        logger.log('info', 'TEST EVTS CALLBACk : ' + msg);
    },

    /**
     * Handle Configuration data for the parking initialization process.
     * @param data : the data sent by the controller
     */
    onConfigurationData: function (data) {
        logger.log('info', 'TEST EVTS : ');
    },
    /**
     * Handle BusConfig data for the parking initialization process.
     * @param data : the data sent by the controller
     */
    onBusConfigData: function (data) {
        logger.log('info', 'TEST EVTS : ');
    },
    /**
     * Handle SensorConfig data for the parking initialization process.
     * @param data : the data sent by the controller
     */
    onSensorConfigData: function (data) {
        logger.log('info', 'TEST EVTS : ');
    },
    /**
     * Handle DisplayConfig data for the parking initialization process.
     * @param data : the data sent by the controller
     */
    onDisplayConfigData: function (data) {
        logger.log('info', 'TEST EVTS : ');
    },
    /**
     * Handle CounterConfig data for the parking initialization process.
     * @param data : the data sent by the controller
     */
    onCounterConfigData: function (data) {
        logger.log('info', 'TEST EVTS : ');
    }
};
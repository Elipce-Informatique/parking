/**
 * Created by yann on 24/07/2015.
 */

var _ = require('lodash');

var Config = require('../commands/config.js');
var logger = require('../utils/logger.js');

module.exports = {
    config: {},
    controllers: [],
    clientConnected: null,
    /**
     * Starts the initialisation procedure
     */
    start: function (client, config) {
        logger.log('info', 'START PARKING INIT');
        this.config = null;
        if (config instanceof Config) {
            this.config = config;
        } else {
            throw new TypeError("Config instance expected");
        }
        this.clientConnected = client;
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
        global.events.on('countersInserted', this.onCountersInserted.bind(this));
        global.events.on('sensorsInserted', this.onSensorsInserted.bind(this));
    },

    /**
     * Handle Configuration data for the parking initialization process.
     * @param data : the data sent by the controller
     */
    onConfigurationData: function (data) {
        logger.log('info', 'onConfigurationData', data);
    },
    /**
     * Handle BusConfig data for the parking initialization process.
     * @param data : the data sent by the controller
     */
    onBusConfigData: function (data) {
        logger.log('info', 'TEST EVTS busConfigData: data -> ', data);

        // Save controllers
        this.controllers = data;

        // Parse controllers
        _.each(data, function (ctrl) {
            // Parse buses
            _.each(ctrl.bus, function (bus) {
                // Display query
                this.config.sendDisplayConfigQuery(bus.ID);
            }, this);
        }, this);
    },
    /**
     * Handle SensorConfig data for the parking initialization process.
     * @param data : the data sent by the controller
     */
    onSensorConfigData: function (data) {
        logger.log('info', 'onSensorConfigData : ', data);
    },
    /**
     * Handle DisplayConfig data for the parking initialization process.
     * @param data : the data sent by the controller
     */
    onDisplayConfigData: function (data) {
        logger.log('info', 'onDisplayConfigData : ', data);
    },
    /**
     * Handle CounterConfig data for the parking initialization process.
     * @param data : the data sent by the controller
     */
    onCounterConfigData: function (data) {
        logger.log('info', 'onCounterConfigData', data);
    },
    /**
     * Handle event when counters are inserted in our DB
     * @param data : the data sent by the controller
     */
    onCountersInserted: function () {

        logger.log('info', 'onCountersInserted');
        // Views query
        this.config.sendViewConfigQuery();

        // Parse controllers
        _.each(this.controllers, function (ctrl) {
            // Parse buses
            _.each(ctrl.bus, function (bus) {
                // Sensors query
                this.config.sendSensorConfigQuery(bus.ID);
            }, this);
        }, this);
    },

    /**
     * Handle event when sensors are inserted in our DB on a bus in parameter
     * @param bus : Bus v4 ID
     */
    onSensorsInserted: function (controllerID, busID) {
        // Last controller
        var lastCtrl = this.controllers.last();
        // We work on the last controller AND last bus
        if(lastCtrl.ID == controllerID && lastCtrl.bus.last().ID == bus){
            // Send message to client
            logger.log('info', '---------NOTIFICATION sendNotificationInitFinished');
            this.config.sendNotificationInitFinished(client);
        }
    }
};
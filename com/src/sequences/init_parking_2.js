/**
 * Created by vivian on 14/09/2015.
 */

var _ = require('lodash');

var Config = require('../commands/config.js');
var BusEnum = require('../commands/bus_enumeration.js');
var logger = require('../utils/logger.js');
var BusEnumSequence = require('./bus_enumeration.js');

module.exports = {
    config: null,
    busEnum: null,
    controllers: [],
    clientConnected: null,
    busEnumSequence: null,

    /**
     * Starts the initialisation procedure
     * @param client: client WS connected
     * @param config: config controller instance (commands/config.js)
     * @param busEnum: bus_enumeration controller instance (commands/bus_enumeration.js)
     */
    start: function (client, config, busEnum) {
        logger.log('info', 'START PARKING INIT 2');
        // Init config controller
        if (config instanceof Config) {
            this.config = config;
        } else {
            throw new TypeError("Config instance expected");
        }

        // Init bus enumerate controller
        if (busEnum instanceof BusEnum) {
            this.busEnum = busEnum;
        } else {
            throw new TypeError("BusEnum instance expected");
        }
        // Client connected
        this.clientConnected = client;
        // Listen events
        this.unBindEvents();
        this.bindEvents();

        // Instance of bus enumeration Sequence with the busEnum controller
        this.busEnumSequence = new BusEnumSequence(this.busEnum);

        // BUSES are stored in the supervision DB, send buses to controller
        this.config.getSupervisionBuses()

    },

    unBindEvents: function () {


        // TODO ATTENTION code à améliorer: une seule instance de config, suppression de tous les listeners
        //this.config.removeAllListeners('configurationData');
        //this.config.removeAllListeners('busConfigData');
        //this.config.removeAllListeners('sensorConfigData');
        //this.config.removeAllListeners('displayConfigData');
        //this.config.removeAllListeners('counterConfigData');
        //this.config.removeAllListeners('settingsData');
        //global.events.removeAllListeners('countersInserted');
        //global.events.removeAllListeners('emptyBus');
    },
    bindEvents: function () {
        logger.log('info', 'Binding events from the init procedure');
        this.config.on('onGetSupervisionBuses', this.onGetSupervisionBuses.bind(this));

        //this.config.on('configurationData', this.onConfigurationData.bind(this));
        //this.config.on('busConfigData', this.onBusConfigData.bind(this));
        //this.config.on('sensorConfigData', this.onSensorConfigData.bind(this));
        //this.config.on('displayConfigData', this.onDisplayConfigData.bind(this));
        //this.config.on('counterConfigData', this.onCounterConfigData.bind(this));
        //this.config.on('settingsData', this.onSettingsData.bind(this));
        //global.events.on('countersInserted', this.onCountersInserted.bind(this));
        //global.events.on('emptyBus', this.onEmptyBus.bind(this));
    },

    /**
     * Handle buses data for the parking initialization process.
     * @param data : buses
     */
    onGetSupervisionBuses: function (data) {
        logger.log('info', 'onGetSupervisionBuses', data);
        // init buses controller DB
        this.config.sendBusConfigUpdate(data);
        // Send bus enum sequence
        this.busEnumSequence.start(data);
    },


    /*******************************
     * ************ OLD *************
     */
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
     * Handle event when bus has no sensors
     * @param busID: current bus scanned
     */
    onEmptyBus: function (busID) {

        var initFinished = false;
        // Last controller
        if (typeof  this.controllers == 'object') {
            var key = '0';
            _.each(this.controllers, function (ctrl, key) {
                key = key;
            });
            var lastCtrl = this.controllers[key];
        }
        // Array
        else {
            var lastCtrl = _.last(this.controllers);
        }

        // Current bus scanned on the last controller ?
        _.each(lastCtrl.bus, function (bus) {
            if (bus.ID == busID) {
                //logger.log('info', '++++++++++++COMPARE bus foreach ', bus.ID, 'bus scanned ', busID);
                initFinished = true;
                return;
            }
        }, this);

        // Init parking finished
        if (initFinished) {
            // Send message to client
            //logger.log('info', 'NOTIFICATION sendNotificationInitFinished');
            this.config.sendNotificationInitFinished(this.clientConnected, busID);
        }
    },

    /**
     * Handle settings data for the parking initialization process.
     * @param data : the data sent by the controller
     */
    onSettingsData: function (data) {
        logger.log('info', 'onSettingsData', data);
    }
};

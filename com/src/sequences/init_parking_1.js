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
        logger.log('info', 'START PARKING INIT 1');
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
        this.config.getSupervisionBuses(client)

    },

    unBindEvents: function () {

        this.config.removeAllListeners('onGetSupervisionBuses');
    },
    bindEvents: function () {
        logger.log('info', 'Binding events from the init procedure');
        this.config.on('onGetSupervisionBuses', this.onGetSupervisionBuses.bind(this));
    },

    /**
     * Handle buses data for the parking initialization process.
     * @param data : buses
     * @param client: WS client which send busConfigUpdate
     */
    onGetSupervisionBuses: function (data, client) {
        logger.log('info', 'onGetSupervisionBuses', data);
        // init buses controller DB
        this.config.sendBusConfigUpdate(data, client);
        // Send bus enum sequence
        this.busEnumSequence.start(data);
    }
};

/**
 * Created by yann on 07/08/2015.
 */
// Dependencies
var util = require('util');
var EventEmitter = require('events').EventEmitter;

// Local modules
var logger = require('../utils/logger.js');
var messenger = require('../utils/messenger.js');

/**
 * Class that handle events messages.
 */
function BusEnumeration() {
    EventEmitter.call(this);
}

// Extend EventEmitter to use this.emit
util.inherits(BusEnumeration, EventEmitter);


module.exports = BusEnumeration;
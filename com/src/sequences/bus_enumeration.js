/**
 * Created by yann on 07/08/2015.
 */
// Dependencies
var mysql = require('mysql');
var _ = require('lodash');


// Local modules
var logger = require('../utils/logger.js');

// -----------------------------------------------------------------
// Creates the BusEnumeration class
function BusEnumerationSequence(busenum_controller) {
    if (this instanceof BusEnumerationSequence === false) {
        throw new TypeError("Classes can't be function-called");
    }

    // ATTRIBUTES DECLARATION
    this.busenum_controller = busenum_controller;
    this.pool = null

    // Mysql connexion with pool : only 1 connexion VERY IMORTANT
    if (this.pool === null) {
        this.pool = require('../utils/mysql_helper.js').pool();
    }
}

// -----------------------------------------------------------------

/**
 * Launch the bus enum for each bus
 * @param buses: buses list from supervision DB
 */
BusEnumerationSequence.prototype.start = function (buses) {

    // Send bus enum on each semi bus
    buses.forEach(function(bus,index){
        // Send a startJobBusEnum to controller
        this.busenum_controller.startJobBusEnum(bus);
    }, this);

}

module.exports = BusEnumerationSequence;

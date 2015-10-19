/**
 * Created by vivian on 24/09/2015.
 */
// Dependencies
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var Q = require('q');

// Local modules
var logger = require('../utils/logger.js');
var messenger = require('../utils/messenger.js');
var parking = require('../models/parking.js');
var display = require('../models/display.js');
var viewModel = require('../models/view.js');
var helper = require('../utils/general_helper.js');

/**
 * Class that handle bus enum messages.
 */
function Synchro() {
    EventEmitter.call(this);

    // VARIABLES
    this.displaySynchro = {
        display: null,
        counter: null,
        view: null
    }

    this.pool = null;
    // Mysql connexion with pool : only 1 connexion VERY IMORTANT
    if (this.pool === null) {
        this.pool = require('../utils/mysql_helper.js').pool();
    }
}

// Extend EventEmitter to use this.emit
util.inherits(Synchro, EventEmitter);

/**
 * A supervision client is connecting
 * @param: supervision client
 */
Synchro.prototype.onNewSupervision = function (client) {
    messenger.send(client, "controllerStatus", {
        controller: global.controllerClient !== null
    });
}

/**
 * Supervision launched a synchro
 */
Synchro.prototype.onStartSynchro = function () {

    logger.log('info', "START SYNCHRO DISPLAYS");

    // RAZ synchro variable
    this.displaySynchro = {
        display: null,
        counter: null,
        view: null
    }

    // GET + send displays
    parking.getAllDisplays(this.pool, function onGetDisplays(err, result) {
        if (err) {
            logger.log('error', "ERROR GET ALL DISPLAYS", err);
        }
        else {
            // Convert data
            var obj = helper.dbDisplaysToConfigUpdate(result)
            var data = obj.update;
            logger.log('info', "DISPLAY UPDATES", result);
            // Parse busses
            data.forEach(function (obj) {
                // Send update to controller
                //logger.log('info','######### ',obj);
                messenger.sendToController("displayConfigUpdate", obj);

            }, this);

            // Displays and views to delete
            if (obj.delete.length > 0) {
                // Views to delete
                obj.delete.forEach(function (displayId) {
                    // Get all views from display ID
                    display.getViews(this.pool, displayId, function (err, result) {
                        if (err) {
                            logger.log('error', "ERROR GET VIEWS FROM DISPLAY " + displayId, err);
                        }
                        else {
                            if (result.length > 0) {
                                var supervisionViewsId = [];
                                // Parse result
                                result.forEach(function (view) {
                                    //logger.log('info', "###########DELETE VIEW "+view.ID);
                                    // DELETE view in controller DB
                                    messenger.sendToController("viewConfigUpdate", {
                                        ID: view.ID,
                                        DELETE: true
                                    });
                                    // Views to delete in supervision DB
                                    supervisionViewsId.push(view.supervision_id);
                                }, this);
                                // DELETE views in supervision DB
                                viewModel.deleteViews(supervisionViewsId);
                            }

                        }
                    });
                }, this);
                // DELETE display in supervision DB
                display.deleteDisplays(obj.delete);
            }
        }
    }.bind(this));

    // GET + send views
    parking.getAllViews(this.pool, function onGetViews(err, result) {
        if (err) {
            logger.log('error', "ERROR GET ALL VIEWS", err);
        }
        else {
            logger.log('info', "VIEW UPDATES", result);
            // Send update to controller
            messenger.sendToController("viewConfigUpdate", result);
        }
    });

    // GET + send counters
    parking.getAllCounters(this.pool, function onGetCounters(err, result) {
        if (err) {
            logger.log('error', "ERROR GET ALL COUNTERS", err);
        }
        else {
            logger.log('info', "COUNTER UPDATES", result);
            var counters = helper.dbCountersToConfigUpdate(result);
            // Send update to controller
            messenger.sendToController("counterConfigUpdate", counters);
        }
    });

    // GET assoc counters/sensors + send update sensor
    parking.getAllAssocCountersSensors(this.pool, function onGetAssoc(err, result) {
        if (err) {
            logger.log('error', "ERROR GET ALL ASSOC COUNTERS/SENSORS", err);
        }
        else {
            logger.log('info', "ASSOC COUNTER/SENSOR UPDATES", result);
            var sensors = helper.dbAssocCountersSensorsToConfigUpdate(result);
            // Send update to controller
            messenger.sendToController("sensorConfigUpdate", sensors);
        }
    });
}

/**
 * Calculate if synchro is finished and update the last su=ynchro in DB
 * @param equipment: display, counter or view
 * @param isInserted: boolean => true: onConfigUpdateDone without error, false: onConfigUpdateDone with error
 */
Synchro.prototype.onConfigUpdateDone = function (equipment, isInserted) {
    //logger.log('info', 'START JOB : BUS ENUM on bus ' + bus.ID)
    this.displaySynchro[equipment] = isInserted;
    // Synchro finished
    if (this.checkSynchroFinished()) {
        // Update table parking
        parking.updateSynchro(this.pool, function onUpdate(err, result) {
            if (err) {
                logger.log('error', "ERROR UPDATE LAST SYNCHRO", err);
            }
            else {
                //logger.log('info', "LAST SYNCHRO", result);
            }
            // RAZ synchro variable
            this.displaySynchro = {
                display: null,
                counter: null,
                view: null
            }
        })
    }

}

/**
 * Check if synchro is finished
 */
Synchro.prototype.checkSynchroFinished = function () {
    // Synchro finished
    if (this.displaySynchro.display !== null && this.displaySynchro.counter !== null && this.displaySynchro.view !== null) {
        // Synchro OK
        return (this.displaySynchro.display && this.displaySynchro.counter && this.displaySynchro.view);
    }
}

module.exports = Synchro;

var toto =

{
    "busID": 11,
    "display": [{
        "ID": 19,
        "address": 1,
        "name": "test",
        "deviceInfo": {
            "manufacturer": "test",
            "modelName": "test",
            "serialNumber": "test",
            "softwareVersion": "test",
            "hardwareVersion": "test"
        }
    }, {
        "ID": 21,
        "address": 2,
        "name": "vivian 2",
        "deviceInfo": {
            "manufacturer": "vivian 2",
            "modelName": "vivian 2",
            "serialNumber": "vivian 2",
            "softwareVersion": "vivian 2",
            "hardwareVersion": "vivian 2"
        }
    }]
}
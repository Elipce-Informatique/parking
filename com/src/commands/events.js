/**
 * Handle all events
 */

module.exports = {
    /**
     * Sends the eventQuery to the controller
     * If provided, AchId will be send in the data object.
     *
     * @param ackID : number -> The value of  ackID must exactly match the value that was
     * received with the previous event report.
     */
    sendEventQuery: function (ackID) {

    },
    /**
     * Handle the events sent
     * @param data
     */
    onEventData: function(data){

    }
};
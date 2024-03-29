var form_data_helper = require('../helpers/form_data_helper');
var helper = require('../helpers/com_helper.js');
var W3CWebSocket = require('websocket').w3cwebsocket;

var simu = {
    timer: {},

    init: function (idPlan) {

        //this.host = this.modeDev ? '127.0.0.1' : this.host;

        window.clearInterval(this.timer);

        // Répétition
        this.timer = window.setInterval(function () {

            // FormData
            var fData = form_data_helper('', 'GET');

            // Requête
            $.ajax({
                url: BASE_URI + 'parking/simulator/' + idPlan,
                type: 'POST',
                data: fData,
                global: false,
                processData: false,
                contentType: false,
                dataType: 'json',
                context: this,
                success: function (bool) {
                },
                error: function (xhr, status, err) {
                    console.error(status, err.toString());
                }
            });

        }, 7000);


        //// CONNEXION WEBSOCKET CLIENT
        //var client = new W3CWebSocket('ws://' + this.host + ':' + this.port);
        //
        //client.onerror = function () {
        //    console.log('Connection Error');
        //};
        //
        //client.onopen = function () {
        //    console.log('WebSocket Client Connected %o', client);
        //
        //    if (client.readyState === client.OPEN) {
        //        console.log('send capabilities');
        //        client.send(JSON.stringify(helper.hello()));
        //    }
        //};
        //
        //client.onclose = function () {
        //    console.log('echo-protocol Client Closed - Tentative reconnexion');
        //    // reconnexion
        //    client = new W3CWebSocket('ws://' + this.host + ':' + this.port);
        //}.bind(this);
        //
        //client.onmessage = function (e) {
        //    if (typeof e.data === 'string') {
        //        console.log("Received: '" + e.data + "'");
        //    }
        //};
    }
};


module.exports = simu;
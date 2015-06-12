var form_data_helper = require('../helpers/form_data_helper');

var simu = {
    timer: {},

    init: function (idPlan) {

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
    }
};


module.exports = simu;
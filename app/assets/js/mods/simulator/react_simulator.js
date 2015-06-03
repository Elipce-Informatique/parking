var form_data_helper = require('../helpers/form_data_helper');

var simu = function (idPlan) {

    // Répétition
    window.setInterval(function () {

        // FormData
        var fData = form_data_helper('', 'GET');

        // Requête
        $.ajax({
            url: BASE_URI + 'parking/simulator/' + idPlan,
            type: 'POST',
            data: fData,
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
};


module.exports = simu;
var simu = function (){

    var idNiveau = 1;

    // Répétition
    window.setInterval(function(){

        // AJAX
        $.ajax({
            url: BASE_URI + 'simulator/' + idNiveau,
            dataType: 'json',
            context: this,
            async: true,
            success: function (bool) {
                console.log('maj bdd %o', bool);
            },
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }
        });
    }, 7000);
}



module.exports.store = simu;
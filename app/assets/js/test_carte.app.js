$(function () {

    // INITIALISATION DE LA CARTE
    var origine = [0, 0];
    var haut_droit = [100, 100];
    var map = L.map('map_test').setView([0, 0], 0);
    L.imageOverlay(BASE_URI + 'public/images/test_carte.svg', [origine, haut_droit]).addTo(map);

});
// Composant de la map
var ParkingMap = require('./mods/composants/parking_map');

/**
 * Au chargement du DOM
 * Préparation de la carte
 */
$(function () {

    var url = BASE_URI + 'public/images/test_carte.svg';
    var map = React.render(
        <ParkingMap imgUrl={url} divId="div_carte"  />,
        document.getElementById('map_test')
    );

    // TEST EN DUR: ajout d'un polygon pour test dedans ou dehors
    var coords = [
        {"lat": 72.28906720017675, "lng": 26.2518310546875},
        {"lat": 72.28906720017675, "lng": 28.7127685546875},
        {"lat": 70.90226826757711, "lng": 28.3612060546875},
        {"lat": 71.01695975726373, "lng": 26.0760498046875}];
    var latLngs = [];
    _.each(coords, function (latln) {
        latLngs.push(new L.LatLng(latln.lat, latln.lng))
    });
    var polyTest = new L.polygon(latLngs);
    polyTest.id = 'test';

    testGroup.addLayer(polyTest);
    console.log(map);
});




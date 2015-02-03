// Composant de la map
var ParkingMap = require('./mods/composants/admin_parking_map');

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
});




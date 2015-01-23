var isPointInPolygon = require('./mods/helpers/map_helper').isPointInPolygon;
var getCentroid = require('./mods/helpers/map_helper').getCentroid;
var isPolygonInPolygonByCenter = require('./mods/helpers/map_helper').isPolygonInPolygonByCenter;

var map = {};
var testGroup = {};

$(function () {

    // ------------------------------------------
    // INITIALISATION DE LA CARTE ---------------
    // ------------------------------------------
    var origine = [0, 0];
    var haut_droit = [100, 100];

    // CRÉATION DE LA MAP
    map = new L.Map('map_test', {
        fullscreenControl: true,
        drawControl: true
    }).setView([0, 0], 0);

    // AJOUT DE L'IMAGE DE FOND
    L.imageOverlay(BASE_URI + 'public/images/test_carte.svg', [origine, haut_droit]).addTo(map);

    // CRÉATION D'UNE FORME, AJOUT À LA CARTE
    map.on('draw:created', function (e) {
        drawCreated(e, map);
    });

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

    // CRÉATION D'UN GROUPE DE POLYGONS
    testGroup = new L.layerGroup();
    map.addLayer(testGroup);

    testGroup.addLayer(polyTest);


    console.log(map);
});

/**
 * Manipule le polyX créé pour en extraire les infos nécessaire
 * TODO : voir pour gerder une référence vers le polygon créé
 * @param e
 * @param map
 */
function drawCreated(e, map) {
    console.log('Item created : ');
    console.log(_.cloneDeep(e));

    var poly = testGroup.getLayers()[0];
    console.log('PASS getlayer');
    console.log(poly._latlngs);


    var type = e.layerType,
        layer = e.layer;

    // ACTION SELON LE TYPE DE DESSIN
    switch (type) {
        case 'marker':
            console.log(isPointInPolygon(poly._latlngs, e.layer._latlng));
            break;
        case 'polygon':
            console.log(isPolygonInPolygonByCenter(e.layer._latlngs, poly._latlngs));
            break;
        case 'polyline':
            break;
        case 'rectangle':
            break;
        case 'circle':
            break;
        default:
    }
    // Do whatever else you need to. (save to db, add to map etc)
    map.addLayer(layer);
}

/**
 *
 */
function initDrawPlugin() {

}
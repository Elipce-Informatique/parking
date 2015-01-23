var isPointInPolygon = require('./mods/helpers/map_helper').isPointInPolygon;
var getCentroid = require('./mods/helpers/map_helper').getCentroid;
var isPolygonInPolygonByCenter = require('./mods/helpers/map_helper').isPolygonInPolygonByCenter;
var isPolygonInPolygon = require('./mods/helpers/map_helper').isPolygonInPolygon;

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
        fullscreenControl: true
    }).setView([0, 0], 0);

    // AJOUT DE L'IMAGE DE FOND
    L.imageOverlay(BASE_URI + 'public/images/test_carte.svg', [origine, haut_droit]).addTo(map);

    initDrawPlugin();
    initCustomButtons();

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

/**
 * Manipule le polyX créé pour en extraire les infos nécessaire
 * TODO : voir pour garder une référence vers le polygon créé
 *
 * @param e: évènement contenant le layer et son conteneur
 * @param map: la carte sur laquelle ajotuer le layer
 */
function drawCreated(e, map) {
    console.log('Item created : ');
    console.log(_.cloneDeep(e));

    var poly = testGroup.getLayers()[0];
    console.log('PASS getlayer de base');
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
            // PAS DE POLYLINE DANS L'APPLI NORMALEMENT
            break;
        case 'rectangle':
            console.log(isPolygonInPolygon(e.layer._latlngs, poly._latlngs));
            break;
        case 'circle':
            // PAS DE CERCLE DANS L'APPLI NORMALEMENT
            break;
        default:
    }
    // Do whatever else you need to. (save to db, add to map etc)
    map.addLayer(layer);
}

/**
 * Paramètre le plugin de dessin sur la carte
 */
function initDrawPlugin() {
    // CRÉATION D'UN GROUPE DE POLYGONS
    testGroup = new L.featureGroup();
    map.addLayer(testGroup);

    var options = {
        position: 'topright',
        draw: {
            polyline: false,
            polygon: {
                allowIntersection: false, // Restricts shapes to simple polygons
                drawError: {
                    color: '#e1e100', // Color the shape will turn when intersects
                    message: Lang.get('administration_parking.carte.erreur_polygon') // Message that will show when intersect
                },
                shapeOptions: {
                    color: '#bada55'
                }
            },
            circle: false, // Turns off this drawing tool
            rectangle: {
                shapeOptions: {
                    clickable: false
                }
            }
        },
        edit: {
            featureGroup: testGroup, //REQUIRED!!
            remove: true
        }
    };
    var drawControl = new L.Control.Draw(options);
    map.addControl(drawControl);

    // QUAND UNE FORME EST CRÉÉE
    map.on('draw:created', function (e) {
        drawCreated(e, map);
    });
}

/**
 * Paramètre les boutons perso ajoutés à la carte
 */
function initCustomButtons() {
    L.easyButton(
        'fa-car',
        function () {
            console.log('test passs bouton place');
        },
        'Ajouter une place',
        map
    );

    L.easyButton(
        'fa-exchange',
        function () {
            console.log('test passs bouton allée');
        },
        'Ajouter une allée',
        map
    );

    L.easyButton(
        'fa-circle-o',
        function () {
            console.log('test passs bouton zone');
        },
        'Ajouter une zone',
        map
    );
    L.easyButton(
        'fa-desktop',
        function () {
            console.log('test passs bouton afficheur');
        },
        'Ajouter un afficheur',
        map
    );

}
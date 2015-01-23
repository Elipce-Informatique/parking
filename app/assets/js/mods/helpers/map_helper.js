/**
 * Created by yann on 22/01/2015.
 */
var classifyPoint = require("robust-point-in-polygon");

/**
 * Calcul le barycentre géométrique du polygon passé en paramètres
 *
 * @param arr : tableau de latlng:
 * [
 *  {lat: xx,yyy, lng: xx,yyy},
 *  {lat: xx,yyy, lng: xx,yyy},
 *  {lat: xx,yyy, lng: xx,yyy},
 *  {lat: xx,yyy, lng: xx,yyy},
 *  {lat: xx,yyy, lng: xx,yyy}
 * ]
 * @returns {*}
 */
function getCentroid(polygon) {
    var arr = getLatLngArrayFromCoordsArray(polygon);

    // Calcul du barycentre géométrique
    return arr.reduce(function (x, y, i, coords) {
        return [
            x[0] + y[0] / coords.length,
            x[1] + y[1] / coords.length
        ];
    }, [0, 0]);
}

/**
 *
 * @param polygon : Le polygon servant de surface à tester structuré de manière suivante:
 * [
 *  {lat: xx,yyy, lng: xx,yyy},
 *  {lat: xx,yyy, lng: xx,yyy},
 *  {lat: xx,yyy, lng: xx,yyy},
 *  {lat: xx,yyy, lng: xx,yyy},
 *  {lat: xx,yyy, lng: xx,yyy}
 * ]
 *
 * @param point : Le point à tester pour savoir s'il est contenu dans le polygon
 */
function isPointInPolygon(polygon, latlng) {
    var point = [latlng.lat, latlng.lng];
    var verticesPoly = getLatLngArrayFromCoordsArray(polygon);
    var resultTest = classifyPoint(verticesPoly, point);
    return resultTest == -1;
}

/**
 * Test si le centre de "polygon" appartient à "surface"
 * Les deux paramètres sont un tableau de lat lng comme suit:
 * [
 *  {lat: xx,yyy, lng: xx,yyy},
 *  {lat: xx,yyy, lng: xx,yyy},
 *  {lat: xx,yyy, lng: xx,yyy},
 *  {lat: xx,yyy, lng: xx,yyy},
 *  {lat: xx,yyy, lng: xx,yyy}
 * ]
 * @param polygon : Le polygon dont on va tester l'appartenance à surface via son centre
 * @param surface : Le polygon servant de surface de test. C'est lui qui contient ou non polygon
 *
 * @return: true ou false
 */
function isPolygonInPolygonByCenter(polygon, surface) {
    var center = getCentroid(polygon);
    center = {lat: center[0], lng: center[1]};
    return isPointInPolygon(surface, center);
}

/**
 * Test si tous les points de "polygon" appartient à "surface"
 * Les deux paramètres sont un tableau de lat lng comme suit:
 * [
 *  {lat: xx,yyy, lng: xx,yyy},
 *  {lat: xx,yyy, lng: xx,yyy},
 *  {lat: xx,yyy, lng: xx,yyy},
 *  {lat: xx,yyy, lng: xx,yyy},
 *  {lat: xx,yyy, lng: xx,yyy}
 * ]
 * @param polygon : Le polygon dont on va tester l'appartenance à surface
 * @param surface : Le polygon servant de surface de test. C'est lui qui contient ou non polygon
 *
 * @return: true ou false
 */
function isPolygonInPolygon(polygon, surface) {
    var retour = true;
    _.each(polygon, function (coord) {
        if(!isPointInPolygon(surface, coord)){
            retour = false;
            return false;
        }
    });

    return retour;
}

/**
 * Transforme un tableau d'objets au format lat lng en un tableau de coordonnées
 * @param aLatLng [
 *  {lat: xx,yyy, lng: xx,yyy},
 *  {lat: xx,yyy, lng: xx,yyy},
 *  {lat: xx,yyy, lng: xx,yyy},
 *  {lat: xx,yyy, lng: xx,yyy},
 *  {lat: xx,yyy, lng: xx,yyy}
 * ]
 *
 * @returns {Array} [
 *  [xx,yyy, xx,yyy],
 *  [xx,yyy, xx,yyy],
 *  [xx,yyy, xx,yyy],
 *  [xx,yyy, xx,yyy],
 *  [xx,yyy, xx,yyy]
 * ]
 */
function getLatLngArrayFromCoordsArray(aLatLng) {
    return _.map(aLatLng, function (latln) {
        return [latln.lat, latln.lng];
    });
}

/**
 * Transforme un tableau de coordonnées au format tableau en format objet
 * @param aCoords [
 *  [xx,yyy, xx,yyy],
 *  [xx,yyy, xx,yyy],
 *  [xx,yyy, xx,yyy],
 *  [xx,yyy, xx,yyy],
 *  [xx,yyy, xx,yyy]
 * ]
 *
 * @returns {Array} [
 *  {lat: xx,yyy, lng: xx,yyy},
 *  {lat: xx,yyy, lng: xx,yyy},
 *  {lat: xx,yyy, lng: xx,yyy},
 *  {lat: xx,yyy, lng: xx,yyy},
 *  {lat: xx,yyy, lng: xx,yyy}
 * ]
 */
function getCoordsArrayFromLatLngArray(aCoords) {
    return _.map(aCoords, function (latln) {
        return {lat: latln[0], lng: latln[1]};
    });
}

module.exports = {
    getCentroid: getCentroid,
    isPointInPolygon: isPointInPolygon,
    isPolygonInPolygonByCenter: isPolygonInPolygonByCenter,
    getLatLngArrayFromCoordsArray: getLatLngArrayFromCoordsArray,
    isPolygonInPolygon: isPolygonInPolygon
};
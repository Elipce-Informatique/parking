/**
 * Created by yann on 22/01/2015.
 */
var _ = require('lodash');
var classifyPoint = require("robust-point-in-polygon");
var poly = require('polygon');

var mapOptions = require('./map_options');
var MathHelper = require('./math_helper');


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
    var arr = getCoordsArrayFromLatLngArray(polygon);

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
    var verticesPoly = getCoordsArrayFromLatLngArray(polygon);
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
 * Test si tous les points de "polygon" appartiennent à "surface"
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
function arePointsInPolygon(polygon, surface) {
    var retour = true;
    _.each(polygon, function (coord) {
        if (!isPointInPolygon(surface, coord)) {
            retour = false;
            return false;
        }
    });

    return retour;
}

/**
 * Test si au moins un point de "polygon" appartient à "surface"
 * Les deux paramètres sont un tableau de lat lng comme suit:
 * [
 *  {lat: xx,yyy, lng: xx,yyy},
 *  {lat: xx,yyy, lng: xx,yyy},
 *  {lat: xx,yyy, lng: xx,yyy},
 *  {lat: xx,yyy, lng: xx,yyy},
 *  {lat: xx,yyy, lng: xx,yyy}
 * ]
 * @param polygon : Le polygon dont on va tester l'appartenance à surface
 * @param surface : Le polygon servant de surface de test.
 * C'est lui qui contient ou non des points de polygon
 *
 * @return: true ou false
 */
function arePointsPartiallyInPolygon(polygon, surface) {
    var retour = false;
    _.each(polygon, function (coord) {
        if (isPointInPolygon(surface, coord)) {
            retour = true;
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
function getCoordsArrayFromLatLngArray(aLatLng) {
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
function getLatLngArrayFromCoordsArray(aCoords) {
    return _.map(aCoords, function (latln) {
        return {lat: latln[0], lng: latln[1]};
    });
}

/**
 * Calcule et retourne le dernier point d'un parallèlogramme en fonction des 3 premiers
 * @param latlngs : array de 3 points exactement
 *
 * @return : object Dernier point du paral
 */
function getLastPointOfParallelogramme(latlngs) {
    if (latlngs.length != 3) {
        return {};
    } else {
        // Parallélogramme ABCD de milieu K
        var A = latlngs[0], B = latlngs[1], C = latlngs[2], D = {lat: 0, lng: 0}, K = {lat: 0, lng: 0};

        // I - Calcule du milieu K
        K.lat = ((A.lat + C.lat) / 2);
        K.lng = ((A.lng + C.lng) / 2);

        // II - calcule des coordonnées de D en fonction de B et K
        D.lat = A.lat + C.lat - B.lat;
        D.lng = A.lng + C.lng - B.lng;
        return D;
    }
}

/**
 * Retourne un tableau de layers correspondant a l'id passé (options.data.id)
 * @param id
 * @param layerGroup
 * @returns {Array}
 */
function findMarkerByPlaceId(id, layerGroup) {
    var layers = [];
    layerGroup.eachLayer(function (layer) {
        if (layer.options.data.id == id) {
            layers.push(layer);
        }
    });
    return layers;
}

/**
 * Calcule le calibre de la map en fonction de la longueur saisie et du segment
 * @param longueur : longueur saisie par l'utilisateur
 * @param coords : coordonnées du segment
 * @returns {number} : nombre à mettre en BDD
 */
function generateCalibreValue(longueur, coords) {
    var dx = parseFloat(parseFloat(coords[0].lat) - parseFloat(coords[1].lat)),
        dy = parseFloat(parseFloat(coords[0].lng) - parseFloat(coords[1].lng));
    var calibre = longueur / Math.sqrt((dx * dx) + (dy * dy));
    return calibre;
}

/**
 * CRS perso pour afficher le plan en full screen
 * et modifier le comportement du zoom pour le rendre plus progressif
 * @type {void|*}
 */
var customZoomCRS = L.extend({}, L.CRS.Simple, {
    scale: function (zoom) {
        // This method should return the tile grid size
        // (which is always square) for a specific zoom
        // We want 0 = 200px = 2 tiles @ 100x100px,
        // 1 = 300px = 3 tiles @ 100x100px, etc.
        // Ie.: (200 + zoom*100)/100 => 2 + zoom
        return 2 + zoom;
    }
});


/**
 * Test si container contient totalement contained (pas d'intersection de leurs côtés)
 * Les deux paramètres sont un tableau de lat lng comme suit:
 * [
 *  {lat: xx,yyy, lng: xx,yyy},
 *  {lat: xx,yyy, lng: xx,yyy},
 *  {lat: xx,yyy, lng: xx,yyy},
 *  {lat: xx,yyy, lng: xx,yyy},
 *  {lat: xx,yyy, lng: xx,yyy}
 * ]
 * @param container : polygon le plus grand (ex: zone)
 * @param contained : polygon le plus petit (ex : allée)
 *
 * @returns boolean true ou false
 */
function polygonContainsPolygon(container, contained) {

    var polyContainer = new Polygon(getCoordsArrayFromLatLngArray(container));
    var polyContained = new Polygon(getCoordsArrayFromLatLngArray(contained));

    return polyContainer.containsPolygon(polyContained);
}

/**
 * Test si container contient totalement contained (pas d'intersection de leurs côtés)
 * Les deux paramètres sont un tableau de lat lng comme suit:
 * [
 *  {lat: xx,yyy, lng: xx,yyy},
 *  {lat: xx,yyy, lng: xx,yyy},
 *  {lat: xx,yyy, lng: xx,yyy},
 *  {lat: xx,yyy, lng: xx,yyy},
 *  {lat: xx,yyy, lng: xx,yyy}
 * ]
 * @param poly1
 * @param poly2
 * @returns {boolean}
 */
function polygonIntersection(poly1, poly2) {
    var oPoly1 = new Polygon(getCoordsArrayFromLatLngArray(poly1));
    var oPoly2 = new Polygon(getCoordsArrayFromLatLngArray(poly2));

    // Les polygons ne se contiennent pas totalement l'un l'autre, intersection possible
    if (!polygonContainsPolygon(poly1, poly2) || !polygonContainsPolygon(poly2, poly1)) {
        var intersect = oPoly1.union(oPoly2);
        // Si on a une union entre les deux, c'est qu'il y a intersection
        return !(intersect.length == 0);
    } else {
        return false;
    }
}

/**
 * Retourne le tableau des polygons contenus dans le polyfon container.
 * Les polygons doivent être au format suivant :
 * [
 *  {lat: xx,yyy, lng: xx,yyy},
 *  {lat: xx,yyy, lng: xx,yyy},
 *  {lat: xx,yyy, lng: xx,yyy},
 *  {lat: xx,yyy, lng: xx,yyy},
 *  {lat: xx,yyy, lng: xx,yyy}
 * ]
 * @param container : polygon le plus grand (ex: zone)
 * @param polygons : Tableau des polygons
 *
 * @returns array plein ou vide selon la géométrie
 */
function getPolygonsContainedInPolygon(container, polygons) {
    return _.filter(polygons, function (poly) {
        return polygonContainsPolygon(container, poly);
    });
}

/**
 * Retourne le tableau des polygons contenus dans le polyfon container.
 * Le polygons doivent être au format suivant :
 * [
 *  {lat: xx,yyy, lng: xx,yyy},
 *  {lat: xx,yyy, lng: xx,yyy},
 *  {lat: xx,yyy, lng: xx,yyy},
 *  {lat: xx,yyy, lng: xx,yyy},
 *  {lat: xx,yyy, lng: xx,yyy}
 * ]
 * @param container : polygon le plus grand (ex: zone)
 * @param polygons : Tableau des polygons
 *
 * @returns array plein ou vide selon la géométrie
 */
function getPointsContainedInPolygon(container, points) {
    return _.filter(points, function (point) {
        var isIn = isPointInPolygon(container, point);
        return isIn;
    });
}

/**
 * Retourne un tableau de tableaux d'objets
 * [
 *  [
 *  {lat: xx,yyy, lng: xx,yyy},
 *  {lat: xx,yyy, lng: xx,yyy},
 *  ],
 *  [
 *  {lat: xx,yyy, lng: xx,yyy},
 *  {lat: xx,yyy, lng: xx,yyy},
 *  ],
 *  ...
 * ]
 *
 * @param layerGroup le layer group à transformer
 */
function getPolygonsArrayFromLeafletLayerGroup(layerGroup) {
    var retour = [];

    var polygons = layerGroup._layers;
    if (!_.isEmpty(polygons)) {
        _.forIn(polygons, function (val, key) {
            if (val._latlngs == undefined) {
                var forme = _.values(val._layers)[0]._latlngs;
                retour.push(forme);
            } else {
                retour.push(val._latlngs);
            }
        });
    }

    return retour;
}

function getFeaturesArrayFromLeafletLayerGroup(layerGroup) {
    var retour = [];

    var polygons = layerGroup._layers;
    if (!_.isEmpty(polygons)) {
        _.forIn(polygons, function (val, key) {
            if (val._latlngs == undefined) {
                var forme = _.values(val._layers)[0];
                retour.push(forme);
            } else {
                retour.push(val);
            }
        });
    }

    return retour;
}

/**
 * Retourne un tableau d'objets
 * [
 *  {lat: xx,yyy, lng: xx,yyy},
 *  {lat: xx,yyy, lng: xx,yyy},
 *  {lat: xx,yyy, lng: xx,yyy},
 *  {lat: xx,yyy, lng: xx,yyy}
 *  ...
 * ]
 *
 * @param layerGroup le layer group à transformer
 */
function getMarkersArrayFromLeafletLayerGroup(layerGroup) {
    var retour = [];

    var polygons = layerGroup._layers;
    if (!_.isEmpty(polygons)) {
        _.forIn(polygons, function (val, key) {
            if (val._latlng == undefined) {
                console.error('Marker sans coordonnées ??? %o', val);
            } else {
                retour.push(val._latlng);
            }
        });
    }

    return retour;
}

/**
 * Crée et retourne une forme leaflet à partir d'un geoJson
 * @param geoJson
 * @returns {polygon}
 */
function createFeatureFromCoordinates(coordinates, extraData, style) {
    var poly = new L.polygon(coordinates, style);
    poly.options.data = extraData;
    return poly;
}

/**
 * Retourne un tableau de marker de toutes les places présentes sur la carte
 * @param _inst
 * @returns {Array|*}
 */
function getAllPlaces(_inst) {
    // PLACES DE LA CARTE
    return _.map(_inst.mapInst.placesMarkersGroup._layers, function (p) {
        if (p._latlng == undefined) {
            console.error('Marker sans coordonnées ??? %o', p);
        } else {
            return p;
        }
    });
}

/**
 * retourne le tableau des places contenues dans l'allée par leur centre (Marker)
 * Le tableau de retour contient la propriété options.data du marker pour éviter
 * la redondance circulaire lié à la map quand on le transforme en JSON.
 * @param formDom : DOM du formulaire
 * @param allee : allee à tester (format layer Leaflet)
 * @param _inst : données d'instance du store
 */
function getPlacesInAllee(allee, _inst) {
    // TOUTES LES PLACES DE LA CARTE
    var allPlaces = getAllPlaces(_inst);

    // LISTE DES PLACES CONTENUES DANS L'ALLÉE
    var placesInAllee = _.filter(allPlaces, function (place) {
        var isIn = isPointInPolygon(allee._latlngs, place._latlng);
        return isIn;
    });

    // EXTRACTION DE LA PROPRIÉTÉ DATA POUR ÉVITER LA REDONDANCE LIÉE À LA MAP.
    placesInAllee = _.map(placesInAllee, function (place) {
        return place.options.data;
    });

    return placesInAllee;
}

/**
 * retourne le tableau des places contenues dans la zone par leur centre (Marker)
 * Le tableau de retour contient la propriété options.data du marker pour éviter
 * la redondance circulaire lié à la map quand on le transforme en JSON.
 *
 * @param zone : zone dessinnée par l'utilisateur (format layer Leaflet)
 * @param _inst : données d'instance du store
 */
function getPlacesInZone(zone, _inst) {
    // PLACES DE LA CARTE
    var allPlaces = getAllPlaces(_inst);

    // LISTE DES PLACES CONTENUES DANS LA ZONE
    var placesInZone = _.filter(allPlaces, function (place) {
        var isIn = isPointInPolygon(zone.e.layer._latlngs, place._latlng);
        return isIn;
    });

    // EXTRACTION DE LA PROPRIÉTÉ DATA POUR ÉVITER LA REDONDANCE LIÉE À LA MAP.
    placesInZone = _.map(placesInZone, function (place) {
        return place.options.data;
    });

    return placesInZone;
}

/**
 * Retourne l'id de l'allée dans lequel se trouve le point ou null.
 * @param point -> le point à tester {lat: xx, lng: xx}
 * @param allees -> La liste des allées présentes dans le store (_inst.allees) (Format objet BDD)
 */
function getAlleeIdFromPoint(point, allees) {
    return _.reduce(allees, function (result, a) {
        if (a.geojson != "") {
            var poly = JSON.parse(a.geojson);
            if ((result == null) && this.isPointInPolygon(poly, point)) {
                return a.id;
            } else {
                return result;
            }
        } else {
            return result;
        }
    }, null, this);
}

/**
 * Retourne l'id de l'allée par défaut de la zone dans lequel se trouve le point ou null
 * @param point -> le point à tester {lat: xx, lng: xx}
 * @param zones -> La liste des zones présentes dans le store (_inst.allees) (Format objet BDD)
 */
function getDefaultAlleeIdInZoneFromPoint(point, zones) {
    return _.reduce(zones, function (result, z) {
        if (z.geojson != "") {
            var poly = JSON.parse(z.geojson);
            if ((result == null) && this.isPointInPolygon(poly, point)) {
                return z.alleeDefault.id;
            } else {
                return result;
            }
        } else {
            return result;
        }
    }, null, this);
}

/**
 * Ce que le module exporte.
 * @type {{getCentroid: getCentroid, isPointInPolygon: isPointInPolygon, isPolygonInPolygonByCenter: isPolygonInPolygonByCenter, getLatLngArrayFromCoordsArray: getCoordsArrayFromLatLngArray, isPolygonInPolygon: arePointsInPolygon}}
 */
module.exports = {
    getCentroid: getCentroid,
    isPointInPolygon: isPointInPolygon,
    arePointsInPolygon: arePointsInPolygon,
    arePointsPartiallyInPolygon: arePointsPartiallyInPolygon,
    isPolygonInPolygonByCenter: isPolygonInPolygonByCenter,
    polygonContainsPolygon: polygonContainsPolygon,
    polygonIntersection: polygonIntersection,
    getCoordsArrayFromLatLngArray: getCoordsArrayFromLatLngArray,
    getLastPointOfParallelogramme: getLastPointOfParallelogramme,
    findMarkerByPlaceId: findMarkerByPlaceId,
    generateCalibreValue: generateCalibreValue,
    getPolygonsArrayFromLeafletLayerGroup: getPolygonsArrayFromLeafletLayerGroup,
    getMarkersArrayFromLeafletLayerGroup: getMarkersArrayFromLeafletLayerGroup,
    getPolygonsContainedInPolygon: getPolygonsContainedInPolygon,
    getPointsContainedInPolygon: getPointsContainedInPolygon,
    getFeaturesArrayFromLeafletLayerGroup: getFeaturesArrayFromLeafletLayerGroup,
    getAllPlaces: getAllPlaces,
    getPlacesInAllee: getPlacesInAllee,
    getPlacesInZone: getPlacesInZone,
    createFeatureFromCoordinates: createFeatureFromCoordinates,
    getAlleeIdFromPoint: getAlleeIdFromPoint,
    getDefaultAlleeIdInZoneFromPoint: getDefaultAlleeIdInZoneFromPoint,
    customZoomCRS: customZoomCRS
};

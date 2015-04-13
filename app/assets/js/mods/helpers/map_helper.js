/**
 * Created by yann on 22/01/2015.
 */
var _ = require('lodash');
var classifyPoint = require("robust-point-in-polygon");

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
        if (!isPointInPolygon(surface, coord)) {
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
 * Crée les places (Markers placés au milieu des places)
 *
 * @param calibre float : Calibre de la carte, ce nombre représente des cm/deg
 * @param parallelogramme array : Parallélogramme de base pour créer les places (tableau de points)
 * @param nbPlaces int : Nombre de places à créer
 * @param espacePoteaux float : Nombre de places entre chaque poteaux en partant de la première palce
 * @param largeurPoteaux float : largeur d'un poteau en cm
 * @param prefix string : préfixe pour le nom des places à créer
 * @param num int : entier, numéro de place initial
 * @param incr : incrément du numéro de places
 * @param suffix string : suffixe du nom de la place
 */
function createPlacesFromParallelogramme(calibre, parallelogramme, nbPlaces, espacePoteaux, largeurPoteaux, prefix, num, suffix, incr, alleeDefaultId, typePlaceDefaultId, color) {

    console.group('==> createPlacesFromParallelogramme : Parallélogramme %o', parallelogramme);

    //--------------------------------------------------------------------
    // Le parallélogramme
    var A, B, C, D;
    // Coordonnées axe central
    var xj, yj, xk, yk;
    // Longueurs des segments (plates, poteaux etc...
    var lJK, lPoteaux, LPlacesEffectif, lPlace;
    // Pas entre les éléments
    var dxTotal, dyTotal, dxPlace, dyPlace, dxPoteau, dyPoteau, dxAB, dyAB;
    // Coords premier point
    var place1 = {};
    // Angle de rotation des markers
    var angleMarker;
    //--------------------------------------------------------------------

    // Affectation des 4 points
    A = parallelogramme[0];
    B = parallelogramme[1];
    C = parallelogramme[2];
    D = parallelogramme[3];

    // --------------------------------------------------------------------
    // 1 - CALCUL COEFICIENT DIRECTEUR BC ET DELTAS -----------------------
    // --------------------------------------------------------------------
    console.log('A : %o, B : %o, C : %o, D : %o', A, B, C, D);
    dxTotal = (C.lng - B.lng);
    dyTotal = (C.lat - B.lat);
    console.log('Dx Total = %o Dy Total = %o', dxTotal, dyTotal);

    // --------------------------------------------------------------------
    // 2 - CALCUL LONGUEUR TOTALE DU SEGMENT ------------------------------
    // --------------------------------------------------------------------
    xj = (A.lng + B.lng) / 2;
    yj = (A.lat + B.lat) / 2;
    console.log('coords de J : lat = %o lng = %o', yj, xj);

    xk = (D.lng + C.lng) / 2;
    yk = (D.lat + C.lat) / 2;
    console.log('coords de K : lat = %o lng = %o', yk, xk);

    // Longueur en degrés
    lJK = Math.sqrt(Math.pow((xk - xj), 2) + Math.pow((yk - yj), 2));
    console.log('longueur JK = %o', lJK);
    // --------------------------------------------------------------------
    // 3 - CALCUL ESPACE TOTAL POTEAUX ------------------------------------
    // --------------------------------------------------------------------
    // un espacement de 0 veut dire pas de poteaux
    if (espacePoteaux == 0) {
        lPoteaux = 0;
    } else {
        // Longueur en cm
        var nbPoteaux = Math.floor(nbPlaces / espacePoteaux);
        lPoteaux = nbPoteaux * largeurPoteaux;
        // Longueur en degrés
        lPoteaux = lPoteaux / calibre;
    }


    console.log('Taille totale utilisée par les poteaux = %o', lPoteaux);
    // --------------------------------------------------------------------
    // 4 - CALCUL TAILLE 1 PLACE ------------------------------------------
    // --------------------------------------------------------------------
    // Taille totale occupée par toutes les places
    LPlacesEffectif = lJK - lPoteaux;
    console.log('Espace effectif réservé aux places = %o', LPlacesEffectif);
    // Taille d'une place
    lPlace = LPlacesEffectif / nbPlaces;
    console.log('Taille d`\'une palce = %o', lPlace);
    // Deltas d'une place
    dxPlace = (lPlace / lJK) * dxTotal;
    dyPlace = (lPlace / lJK) * dyTotal;
    console.log('Dx pour 1 place = %o Dy pour 1 place = %o', dxPlace, dyPlace);

    // --------------------------------------------------------------------
    // 5 - CALCUL DELTA 1 POTEAU ------------------------------------------
    // --------------------------------------------------------------------
    dxPoteau = ((lPoteaux / nbPoteaux) / lJK) * dxTotal;
    dyPoteau = ((lPoteaux / nbPoteaux) / lJK) * dyTotal;
    console.log('Dx pour 1 poteau = %o Dy pour 1 poteau = %o', dxPoteau, dyPoteau);

    // --------------------------------------------------------------------
    // 6 - CALCUL COORDONNÉES 1ER POINT -----------------------------------
    // --------------------------------------------------------------------
    var xPlace1 = xj + (dxPlace / 2);
    var yPlace1 = yj + (dyPlace / 2);
    place1.lat = yPlace1;
    place1.lng = xPlace1;
    console.log('Coordonnées place 1 = %o', place1);

    // --------------------------------------------------------------------
    // 7 - CALCUL ANGLE DE ROTATION MARKER --------------------------------
    // --------------------------------------------------------------------

    dxAB = (B.lng - A.lng);
    dyAB = (B.lat - A.lat);
    console.log('dxAB = %o, dyAB = %o', dxAB, dyAB);

    // On considère AB comme une verticale
    if (Math.abs(dxAB * calibre) < 10) {
        angleMarker = 0;
    }
    // On considère AB comme une horizontale
    else if (Math.abs(dyAB * calibre) < 10) {
        angleMarker = 90;
    }
    // On calcul l'angle
    else {
        var S = {lat: B.lat, lng: A.lng};
        console.log('Poins S (ABS rectangle en S) : %o, ', S);

        var AS = dyAB;
        var BS = dxAB;
        var AB = Math.sqrt(Math.pow(AS, 2) + Math.pow(BS, 2));

        // Calcul du sinus
        var sinA = BS / AB;

        console.log('AVANT CORRECTION : sin A = %o, angle A = %o °', sinA, MathHelper.toDegrees(Math.asin(sinA)));
        /* On a le sinus, maintenant on va calculer l'angle de rotation:
         * -> Si dyAB > 0, on ne touche à rien
         * -> Si dyAB < 0, on a 2 possibilités
         * ---> dxAB < 0 : -PI/2
         * ---> dxAB > 0 : +PI/2
         */
        var angleRad = Math.asin(sinA);
        if (dyAB < 0) {
            angleRad = (dxAB < 0) ? (angleRad - ((Math.PI / 2) - Math.abs(angleRad)) * 2) : (angleRad + ((Math.PI / 2) - Math.abs(angleRad)) * 2);
        }
        angleMarker = MathHelper.toDegrees(angleRad);
        console.log('sin A = %o, angle A = %o °', sinA, angleMarker);
    }

    console.log('Angle final = %o', angleMarker);

    // --------------------------------------------------------------------
    // 8 - CRÉATION DES MARKERS AVEC LES INFORMATIONS ---------------------
    // --------------------------------------------------------------------

    var coordsPrec = place1; // Marker initial
    var ASuiv = A, BSuiv = B; // Bord gauche parallélogramme initial
    var increment = parseInt(incr);
    // On parcourt un tableau de chiffres de 1 à nbPlace
    var places = _.map(_.range(1, parseInt(nbPlaces) + 1, 1), function (n) {

        // Création des données nécessaire à la place
        var numPlace = parseInt(num) + (n * increment) - increment;
        var nom = prefix + ' ' + numPlace + ' ' + suffix;
        var coords = {lat: 0, lng: 0};

        // ******************************************************
        // CALCUL PARALLELOGRAMME PLACE
        // ******************************************************
        var APlace, BPlace, CPlace, DPlace;
        if (n == 1) {
            APlace = ASuiv;
            BPlace = BSuiv;
            CPlace = L.latLng(BPlace.lat + dyPlace, BPlace.lng + dxPlace);
            DPlace = L.latLng(APlace.lat + dyPlace, APlace.lng + dxPlace);
        } else {
            // Ajout des poteaux si besoin (on est sur une place qui succède un poteau)
            if (((n - 1) % espacePoteaux) == 0) {
                console.log('On doit placer un poteau.');
                APlace = L.latLng(ASuiv.lat + dyPoteau, ASuiv.lng + dxPoteau);
                BPlace = L.latLng(BSuiv.lat + dyPoteau, BSuiv.lng + dxPoteau);
                CPlace = L.latLng(BPlace.lat + dyPlace, BPlace.lng + dxPlace);
                DPlace = L.latLng(APlace.lat + dyPlace, APlace.lng + dxPlace);
            } else {
                APlace = ASuiv;
                BPlace = BSuiv;
                CPlace = L.latLng(BPlace.lat + dyPlace, BPlace.lng + dxPlace);
                DPlace = L.latLng(APlace.lat + dyPlace, APlace.lng + dxPlace);
            }
        }
        // Décalage de la place pour la suivante
        ASuiv = DPlace;
        BSuiv = CPlace;

        // ******************************************************
        // CALCUL COORDONNEES CENTRE MARKER
        // ******************************************************
        // Utilisation de place1 si on est sur la première place
        if (n == 1) {
            coords.lat = coordsPrec.lat;
            coords.lng = coordsPrec.lng;
        } else {
            // Ajout des poteaux si besoin (on est sur une place qui succède un poteau)
            if (((n - 1) % espacePoteaux) == 0) {
                console.log('On doit placer un poteau.');
                coords.lat = coordsPrec.lat + dyPlace + dyPoteau;
                coords.lng = coordsPrec.lng + dxPlace + dxPoteau;
            } else {
                coords.lat = coordsPrec.lat + dyPlace;
                coords.lng = coordsPrec.lng + dxPlace;
            }
        }
        // Décalage des coordsPrec
        coordsPrec = coords;

        var extraData = {
            libelle: nom,
            num: numPlace,
            allee_id: alleeDefaultId,
            type_place_id: typePlaceDefaultId,
            angle: angleMarker,
            lat: coords.lat,
            lng: coords.lng
        };

        // Création du marker leaflet
        var marker = createPlaceMarker(coords, nom, angleMarker, extraData);

        // Création du parallélogramme
        var coordsPara = [APlace, BPlace, CPlace, DPlace];
        var parallelogrammePlace = createPlaceParallelogramme(coordsPara, extraData, nom, color);
        console.log('Polygon correspondant à la place : %o', parallelogrammePlace);

        // Variable de retour
        var retour = {
            data: extraData,
            marker: marker,
            polygon: parallelogrammePlace
        };

        return retour;
    });

    console.log('Liste finale des places : %o', places);
    // Fin du groupe de logs
    console.groupEnd();

    return places;
}

/**
 * Crée un marker place en fonction des paramètres
 *
 * @param coords : coordonnées de la place
 * @param nom : nom de la place
 * @param angleMarker : angle à donner au marker
 * @param extraData : données supplémentaires à associer au marker
 *
 * @returns {exports.DataMarker} : le marker créé
 */
function createPlaceMarker(coords, nom, angleMarker, extraData) {
    var marker = new mapOptions.DataMarker([coords.lat, coords.lng], {
        icon: new mapOptions.placeRouge(),
        data: extraData
    });
    marker.setIconAngle(angleMarker);
    marker.bindLabel(nom);
    return marker;
}

/**
 * Crée un marker place en fonction des paramètres
 *
 * @returns {exports.DataMarker} : le marker créé
 */
function createPlaceParallelogramme(coordsPara, extraData, nom, color) {
    var parallelogrammePlace = new L.polygon(coordsPara, {
        data: extraData,
        color: "#" + color,
        opacity: 0.9,
        fillColor: color
    });
    parallelogrammePlace.bindLabel(nom);
    return parallelogrammePlace;
}

/**
 * Crée le parallélogramme d'une palce en fonction d'un objet geoJSON
 * @param geoJson
 * @param extraData
 * @param nom
 * @param color
 * @returns {dataPlaces.geoJson}
 */
function createPlaceParallelogrammeFromGeoJson(geoJson, extraData, nom, color) {
    var style = {
        data: extraData,
        color: "#" + color,
        opacity: 0.9,
        fillColor: "#"+ color
    };
    var parallelogrammePlace = new L.geoJson(JSON.parse(geoJson), {style: style});
    parallelogrammePlace.bindLabel(nom);
    return parallelogrammePlace;
}


/**
 * Ce que le module exporte.
 * @type {{getCentroid: getCentroid, isPointInPolygon: isPointInPolygon, isPolygonInPolygonByCenter: isPolygonInPolygonByCenter, getLatLngArrayFromCoordsArray: getLatLngArrayFromCoordsArray, isPolygonInPolygon: isPolygonInPolygon}}
 */
module.exports = {
    getCentroid: getCentroid,
    isPointInPolygon: isPointInPolygon,
    isPolygonInPolygonByCenter: isPolygonInPolygonByCenter,
    getLatLngArrayFromCoordsArray: getLatLngArrayFromCoordsArray,
    isPolygonInPolygon: isPolygonInPolygon,
    getLastPointOfParallelogramme: getLastPointOfParallelogramme,
    createPlacesFromParallelogramme: createPlacesFromParallelogramme,
    createPlaceMarker: createPlaceMarker,
    createPlaceParallelogramme: createPlaceParallelogramme,
    createPlaceParallelogrammeFromGeoJson: createPlaceParallelogrammeFromGeoJson
};


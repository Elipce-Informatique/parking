/**
 * Created by yann on 04/05/2015.
 */
var mapOptions = require('./map_options');
var MathHelper = require('./math_helper');
var mapHelper = require('./map_helper');

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
 * @param alleeDefaultId
 * @param typePlaceDefaultId
 * @param color
 * @param etat_occupation
 * @param allees : toutes les allées de la map
 * @param zones : toutes les zones de la map
 */
function createPlacesFromParallelogramme(calibre, parallelogramme, nbPlaces, espacePoteaux, largeurPoteaux, prefix, num, suffix, incr, alleeDefaultId, typePlaceDefaultId, color, etat_occupation, allees, zones) {

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
    dxTotal = (C.lng - B.lng);
    dyTotal = (C.lat - B.lat);

    // --------------------------------------------------------------------
    // 2 - CALCUL LONGUEUR TOTALE DU SEGMENT ------------------------------
    // --------------------------------------------------------------------
    xj = (A.lng + B.lng) / 2;
    yj = (A.lat + B.lat) / 2;


    xk = (D.lng + C.lng) / 2;
    yk = (D.lat + C.lat) / 2;

    // Longueur en degrés
    lJK = Math.sqrt(Math.pow((xk - xj), 2) + Math.pow((yk - yj), 2));
    // --------------------------------------------------------------------
    // 3 - CALCUL ESPACE TOTAL POTEAUX ------------------------------------
    // --------------------------------------------------------------------
    // un espacement de 0 veut dire pas de poteaux
    if (espacePoteaux == 0) {
        lPoteaux = 0;
    } else {
        // Nombre
        var nbPoteaux = Math.floor((nbPlaces - 1) / espacePoteaux);
        // Longueur en cm
        lPoteaux = nbPoteaux * largeurPoteaux;
        // Longueur en degrés
        lPoteaux = lPoteaux / calibre;
    }


    // --------------------------------------------------------------------
    // 4 - CALCUL TAILLE 1 PLACE ------------------------------------------
    // --------------------------------------------------------------------
    // Taille totale occupée par toutes les places
    LPlacesEffectif = lJK - lPoteaux;
    // Taille d'une place
    lPlace = LPlacesEffectif / nbPlaces;
    // Deltas d'une place
    dxPlace = (lPlace / lJK) * dxTotal;
    dyPlace = (lPlace / lJK) * dyTotal;

    // --------------------------------------------------------------------
    // 5 - CALCUL DELTA 1 POTEAU ------------------------------------------
    // --------------------------------------------------------------------
    dxPoteau = ((lPoteaux / nbPoteaux) / lJK) * dxTotal;
    dyPoteau = ((lPoteaux / nbPoteaux) / lJK) * dyTotal;

    // --------------------------------------------------------------------
    // 6 - CALCUL COORDONNÉES 1ER POINT -----------------------------------
    // --------------------------------------------------------------------
    var xPlace1 = xj + (dxPlace / 2);
    var yPlace1 = yj + (dyPlace / 2);
    place1.lat = yPlace1;
    place1.lng = xPlace1;

    // --------------------------------------------------------------------
    // 7 - CALCUL ANGLE DE ROTATION MARKER --------------------------------
    // --------------------------------------------------------------------

    dxAB = (B.lng - A.lng);
    dyAB = (B.lat - A.lat);

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

        var AS = dyAB;
        var BS = dxAB;
        var AB = Math.sqrt(Math.pow(AS, 2) + Math.pow(BS, 2));

        // Calcul du sinus
        var sinA = BS / AB;

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
    }


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
                coords.lat = coordsPrec.lat + dyPlace + dyPoteau;
                coords.lng = coordsPrec.lng + dxPlace + dxPoteau;
            } else {
                coords.lat = coordsPrec.lat + dyPlace;
                coords.lng = coordsPrec.lng + dxPlace;
            }
        }
        // Décalage des coordsPrec
        coordsPrec = coords;

        // Détermination de l'id de l'allée en fonction des coordonnées
        var alleeId = mapHelper.getAlleeIdFromPoint(coords, allees);
        if (alleeId == null) {
            alleeId = mapHelper.getDefaultAlleeIdInZoneFromPoint(coords, zones);

            alleeId = (alleeId == null) ? alleeDefaultId : alleeId;
        }


        var extraData = {
            libelle: nom,
            num: numPlace,
            allee_id: alleeId,
            type_place_id: typePlaceDefaultId,
            etat_occupation_id: etat_occupation.id,
            angle: angleMarker,
            lat: coords.lat,
            lng: coords.lng
        };

        // Création du marker leaflet
        var marker = createPlaceMarker(coords, nom, angleMarker, extraData);

        // Création du parallélogramme
        var coordsPara = [APlace, BPlace, CPlace, DPlace];
        var parallelogrammePlace = createPlaceParallelogramme(coordsPara, extraData, nom, color);

        // Variable de retour
        var retour = {
            data: extraData,
            marker: marker,
            polygon: parallelogrammePlace
        };

        return retour;
    });

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
 *
 * @param p
 * @returns {{polygon: dataPlaces.geoJson, marker: {}}}
 */
function createPlaceFromData(p, types_places) {
    var coords = {lat: p.lat, lng: p.lng};
    var nom = p.libelle;
    var angleMarker = p.angle;
    var extraData = p;
    var color = _.reduce(types_places, function (sum, n) {
        if (n.id == p.type_place_id) {
            return n.couleur;
        } else {
            return sum;
        }
    }, "FF0000", this);

    var marker = {};
    if (p.etat_occupation.is_occupe == "1") {
        marker = createPlaceMarker(coords, nom, angleMarker, extraData);
    }
    var polygon = createPlaceParallelogrammeFromCoordinates(JSON.parse(p.geojson), extraData, nom, color);

    return {
        polygon: polygon,
        marker: marker
    };
}

/**
 * Crée le parallélogramme d'une palce en fonction d'une liste de coordonnées
 * @param coords
 * @param extraData
 * @param nom
 * @param color
 * @returns place
 */
function createPlaceParallelogrammeFromCoordinates(coords, extraData, nom, color) {
    var style = {
        color: "#" + color,
        opacity: 0.9,
        fillColor: "#" + color
    };

    // Récup des coordonnées
    var parallelogrammePlace = mapHelper.createFeatureFromCoordinates(coords, extraData, style);

    parallelogrammePlace.bindLabel(nom);
    return parallelogrammePlace;
}


module.exports = {
    createPlacesFromParallelogramme: createPlacesFromParallelogramme,
    createPlaceMarker: createPlaceMarker,
    createPlaceParallelogramme: createPlaceParallelogramme,
    createPlaceParallelogrammeFromCoordinates: createPlaceParallelogrammeFromCoordinates,
    createPlaceFromData: createPlaceFromData
};

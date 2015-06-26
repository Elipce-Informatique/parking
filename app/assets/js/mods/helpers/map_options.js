/**
 * Enum des diférents modes de dessin
 * @type {{place: number, allee: number, zone: number, afficheur: number}}
 */
module.exports.dessin = {
    place: 1,
    allee: 2,
    zone: 3,
    afficheur: 4,
    place_auto: 5,
    calibre: 6,
    capteur: 7 // Pas vraiment un mode de dessin, c'est pour savoir qu'on est en mode capteur
};

/**
 * Enum des classes CSS pour les boutons de changement de mode
 * @type {{place: string, allee: string, zone: string, afficheur: string}}
 */
module.exports.icon = {
    place: "fa-car",
    allee: "fa-exchange",
    zone: "fa-circle-o",
    afficheur: "fa-desktop",
    place_auto: "fa-magic",
    calibre: "fa-arrows",
    capteur: "fa-wifi"
};

// PRÉPARATION DE L'OBJET COLOR :
var colors = {};
colors[module.exports.dessin.place] = '#bada55';
colors[module.exports.dessin.place_auto] = '#bada55';
colors[module.exports.dessin.allee] = '#5478da';
colors[module.exports.dessin.zone] = '#da5454';
colors[module.exports.dessin.calibre] = '#2C75FF';
colors[module.exports.dessin.afficheur] = '#000000';

// PRÉPARATION DE L'OBJET GROUPS:
var groups = {};
groups[module.exports.dessin.place] = 'placesGroup';
groups[module.exports.dessin.place_auto] = 'placesGroup';
groups[module.exports.dessin.allee] = 'alleesGroup';
groups[module.exports.dessin.zone] = 'zonesGroup';
groups[module.exports.dessin.afficheur] = 'afficheursGroup';
groups[module.exports.dessin.calibre] = 'calibreGroup';

/**
 * Paramètres du controle de dessin
 * @type {{position: string}}
 */
module.exports.control = {
    draw: {
        position: 'topright',
        colors: colors
    },
    groups: groups
};

/**
 * Enum du "protocole" de communication entre le store et le composant.
 * Il décrit les différents types de messages possibles
 * @type {{mode_change: number, add_forme: number, delete_forme: number}}
 */
module.exports.type_messages = {
    mode_change: 1,
    add_forme: 2,
    delete_forme: 3,
    new_place_auto: 4,
    add_places: 5,
    occuper_places: 6,
    liberer_places: 7,
    new_calibre: 8,
    hide_modal: 9,
    new_zone: 10,
    new_allee: 11,
    add_zones: 12,
    add_allees: 13,
    show_infos: 14,
    update_infos: 15,
    hide_infos: 16,
    delete_place: 17,
    set_calibre: 18,
    new_afficheur: 19
};

/**
 * Marker
 */
module.exports.afficheurMarker = L.Icon.extend({
    options: {
        iconAnchor: new L.Point(12, 40),
        iconSize: new L.Point(25, 41),
        iconUrl: BASE_URI + 'public/images/marker-icon.png'
    }
});

/**
 * Marker de place tut tut la voiture
 * @type {void|*}
 */
module.exports.placeGenerique = L.Icon.extend({
    options: {
        iconAnchor: new L.Point(9, 20),
        iconSize: new L.Point(18, 40),
        iconUrl: BASE_URI + 'public/images/icone_voiture_noire.svg'
    }
});

/**
 * Marker de place tut tut la voiture
 * @type {void|*}
 */
module.exports.placeRouge = L.Icon.extend({
    options: {
        iconAnchor: new L.Point(7, 16),
        iconSize: new L.Point(14, 32),
        iconUrl: BASE_URI + 'public/images/icone_voiture_rouge.svg'
    }
});

/**
 * Marker de place tut tut la voiture
 * @type {void|*}
 */
module.exports.pastilleCapteur = L.Icon.extend({
    options: {
        iconAnchor: new L.Point(7, 7),
        iconSize: new L.Point(14, 14),
        iconUrl: BASE_URI + 'public/images/pastille.png'
    }
});

/**
 * Marker de place tut tut la voiture
 * @type {void|*}
 */
module.exports.iconInvisible = L.Icon.extend({
    options: {
        iconAnchor: new L.Point(0, 0),
        iconSize: new L.Point(0, 0),
        iconUrl: BASE_URI + 'public/images/pastille.png'
    }
});

/**
 * Ajout de propriétés perso au marker de type place
 * @type {void|*}
 */
module.exports.DataMarker = L.Marker.extend({
    data: {}
});
/**
 *
 * @type {{}}
 */
module.exports.modal_type = {
    zone: 1,
    allee: 2,
    afficheur: 3,
    place_multiple: 4,
    place_simple: 5,
    capteur: 6,
    luminosite: 7,
    calibre: 8
};

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
    capteur: 7, // Pas vraiment un mode de dessin, c'est pour savoir qu'on est en mode capteur
    alerte_full: 8,
    alerte_change: 9,
    reservation: 10,
    capteur_afficheur: 11,
    capteur_virtuel: 12, // Pas vraiment un mode de dessin, c'est pour savoir qu'on est en mode capteur_virtuel
    afficheur_get: 13
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
    capteur: "fa-wifi",
    capteur_afficheur: "fa-link",
    alerte_full: 'fa-stop',
    alerte_change: 'fa-exchange',
    reservation: 'fa-ticket'
};

// PRÉPARATION DE L'OBJET COLOR :
var colors = {};
colors[module.exports.dessin.place] = '#bada55';
colors[module.exports.dessin.place_auto] = '#bada55';
colors[module.exports.dessin.allee] = '#5478da';
colors[module.exports.dessin.zone] = '#da5454';
colors[module.exports.dessin.calibre] = '#2C75FF';
colors[module.exports.dessin.afficheur] = '#000000';
colors[module.exports.dessin.afficheur_get] = '#000000';
colors[module.exports.dessin.capteur_afficheur] = '#000000';

// PRÉPARATION DE L'OBJET GROUPS:
var groups = {};
groups[module.exports.dessin.place] = 'placesGroup';
groups[module.exports.dessin.place_auto] = 'placesGroup';
groups[module.exports.dessin.allee] = 'alleesGroup';
groups[module.exports.dessin.zone] = 'zonesGroup';
groups[module.exports.dessin.afficheur] = 'afficheursGroup';
groups[module.exports.dessin.afficheur_get] = 'afficheursGroup';
groups[module.exports.dessin.capteur_afficheur] = 'capteurAfficheursGroup';
groups[module.exports.dessin.calibre] = 'calibreGroup';
groups[module.exports.dessin.alerte_full] = 'alerteFullGroup';
groups[module.exports.dessin.alerte_change] = 'alerteChangeGroup';
groups[module.exports.dessin.reservation] = 'reservationGroup';

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
    new_afficheur: 19,
    alerte_full: 20,
    add_afficheurs: 21,
    add_alertes_full: 22,
    edit_place: 23,
    edit_allee: 24,
    edit_zone: 25,
    edit_afficheur: 26,
    update_afficheurs: 27,
    capteur_afficheur: 28,
    synchro_notif: 29,
    annuler_capteur_virtuel: 30,
    set_id_capteur_virtuel: 31,
    delete_capteur_from_num: 32,
    set_init_mode: 33,
    new_afficheur_get: 34
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
module.exports.pastilleCapteurVirtuel = L.Icon.extend({
    options: {
        iconAnchor: new L.Point(7, 7),
        iconSize: new L.Point(14, 14),
        iconUrl: BASE_URI + 'public/images/pastille_jaune.png'
    }
});

/**
 * TODO
 * Marker d'afficheur
 * @type {void|*}
 */
module.exports.iconAfficheur = L.Icon.extend({
    options: {
        iconAnchor: new L.Point(40, 15),
        iconSize: new L.Point(80, 29),
        iconUrl: BASE_URI + 'public/images/afficheur_icon.PNG'
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
 * Marker de place alerte full
 * @type {void|*}
 */
module.exports.markerFull = L.Icon.extend({
    options: {
        iconAnchor: new L.Point(7, 7),
        iconSize: new L.Point(14, 14),
        iconUrl: BASE_URI + 'public/images/full.png'
    }
});


/**
 * Marker de place alerte change
 * @type {void|*}
 */
module.exports.markerChange = L.Icon.extend({
    options: {
        iconAnchor: new L.Point(7, 7),
        iconSize: new L.Point(14, 14),
        iconUrl: BASE_URI + 'public/images/change.png'
    }
});


/**
 * Marker de place reservation
 * @type {void|*}
 */
module.exports.markerReservation = L.Icon.extend({
    options: {
        iconAnchor: new L.Point(7, 7),
        iconSize: new L.Point(14, 14),
        iconUrl: BASE_URI + 'public/images/reservation.png'
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
 * Différents types de modales à afficher dans la carte
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
    calibre: 8,
    edit_place: 9,
    edit_allee: 10,
    edit_zone: 11,
    edit_afficheur: 12,
    capteur_afficheur: 13,
    capteur_virtuel: 14,
    afficheur_get: 15
};

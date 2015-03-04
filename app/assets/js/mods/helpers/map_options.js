/**
 * Created by yann on 29/01/2015.
 */

/**
 * Enum des diférents modes de dessin
 * @type {{place: number, allee: number, zone: number, afficheur: number}}
 */
module.exports.dessin = {
    place: 1,
    allee: 2,
    zone: 3,
    afficheur: 4,
    place_auto: 5
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
    place_auto: "fa-magic"
};

// PRÉPARATION DE L'OBJET COLOR :
var colors = {};
colors[module.exports.dessin.place] = '#bada55';
colors[module.exports.dessin.allee] = '#5478da';
colors[module.exports.dessin.zone] = '#da5454';

// PRÉPARATION DE L'OBJET GROUPS:
var groups = {};
groups[module.exports.dessin.place] = 'placesGroup';
groups[module.exports.dessin.allee] = 'alleesGroup';
groups[module.exports.dessin.zone] = 'zonesGroup';
groups[module.exports.dessin.afficheur] = 'afficheursGroup';

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
    delete_forme: 3
};

/**
 * PUTIN ça marchait hier !!
 */
module.exports.afficheurMarker = L.Icon.extend({
    options: {
        iconAnchor: new L.Point(12, 40),
        iconSize: new L.Point(25, 41),
        iconUrl: BASE_URI + 'public/images/marker-icon.png'
    }
});

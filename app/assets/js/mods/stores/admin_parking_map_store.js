var mapOptions = require('../helpers/map_options');
var mapHelper = require('../helpers/map_helper');
/**
 * Created by yann on 27/01/2015.
 *
 * Store permettant la gestion de toutes les actions liés à une carte.
 *
 *
 * @param object parkingInfos: infos sur le parking sur lequel on travail
 * @param string currentMode: Mode de dessin actuel (place|allee|zone|afficheur)
 * @param array places: Tableau des places (type layer)
 * @param array allees: Tableau des allées (type layer)
 * @param array zones: Tableau des zones (type layer)
 * @param array afficheurs: Tableau des afficheurs (type layer)
 * @param object lastDraw: dernière forme dessinée (type layer)
 *
 *
 * Ce store décelenche une mise à jour dans le composant
 * avec des données structurées de la manière suivante:
 * {
 *     type: voir_map_options,
 *     data: {}
 * }
 */
var store = Reflux.createStore({
    _inst: {
        parkingInfos: {},
        currentMode: mapOptions.dessin.place,
        places: [],
        allees: [],
        zones: [],
        afficheurs: [],
        lastDraw: {}
    },
    listenables: Actions.map,
    getInitialState: function () {
        return {};
    },
    // INITIAL SETUP
    init: function () {
    },


    onMap_initialized: function (data) {
        console.log(data);
    },

    /**
     * ---------------------------------------------------------------------------
     * EVENTS DE DESSIN ----------------------------------------------------------
     * ---------------------------------------------------------------------------
     */
    // CRÉATION D'UN DESSIN FINIE (Ajout a la carte)
    onDraw_created: function (data) {
        console.log('Pass onDraw_created %o', data);

        // Si en mode place auto, on va calculer le parallèlogramme
        if (this._inst.currentMode == mapOptions.dessin.place_auto) {
            data = this.createParallelogramme(data);
        }

        // TODO : afficher le parallèlogramme fini si mode place auto
        var retour = {
            type: mapOptions.type_messages.add_forme,
            data: data
        };

        this.trigger(retour);
    },
    onDraw_deleted: function (data) {
        console.log('Pass onDraw_created %o', data);
    },
    onDraw_drawstart: function (data) {
        console.log('Pass onDraw_drawstart %o', data);
    },
    onDraw_drawstop: function (data) {
        console.log('Pass onDraw_drawstop %o', data);
    },
    // A VOIR COMMENT RECUP LES DESSINS
    onDraw_editstart: function (data) {
        console.log('Pass onDraw_editstart %o', data);
    },
    onDraw_editstop: function (data) {
        console.log('Pass onDraw_editstop %o', data);
    },
    onDraw_deletestart: function (data) {
        console.log('Pass onDraw_deletestart %o', data);
    },
    onDraw_deletestop: function (data) {
        console.log('Pass onDraw_deletestop %o', data);
    },

    /**
     * ---------------------------------------------------------------------------
     * CHANGEMENT DU MODE DE DESSIN ----------------------------------------------
     * ---------------------------------------------------------------------------
     */
    onMode_place: function (data) {
        this._inst.currentMode = mapOptions.dessin.place;

        var retour = {
            type: mapOptions.type_messages.mode_change,
            data: {
                mode: mapOptions.dessin.place
            }
        };
        this.trigger(retour);
    },
    onMode_place_auto: function (data) {
        this._inst.currentMode = mapOptions.dessin.place_auto;

        var retour = {
            type: mapOptions.type_messages.mode_change,
            data: {
                mode: mapOptions.dessin.place_auto
            }
        };
        this.trigger(retour);
    },
    onMode_allee: function (data) {
        this._inst.currentMode = mapOptions.dessin.allee;

        var retour = {
            type: mapOptions.type_messages.mode_change,
            data: {
                mode: mapOptions.dessin.allee
            }
        };
        this.trigger(retour);
    },
    onMode_zone: function (data) {
        this._inst.currentMode = mapOptions.dessin.zone;

        var retour = {
            type: mapOptions.type_messages.mode_change,
            data: {
                mode: mapOptions.dessin.zone
            }
        };
        this.trigger(retour);
    },
    onMode_afficheur: function (data) {
        this._inst.currentMode = mapOptions.dessin.afficheur;

        var retour = {
            type: mapOptions.type_messages.mode_change,
            data: {
                mode: mapOptions.dessin.afficheur
            }
        };
        this.trigger(retour);
    },

    /**
     * Les data correspondent au layer créé par le plugin. Le premier test consiste à vérifier qu'on ait 3 points
     * @param data : le Layer créé par le plugin de map
     */
    createParallelogramme: function (data) {
        console.log('createParallelogramme : %o', data);

        if (data.e.layer._latlngs.length != 3) {
            swal('Merci de tracer exactement 3 points !');
            return {};
        } else {
            var lastPoint = mapHelper.getLastPointOfParallelogramme(data.e.layer._latlngs);
            data.e.layer._latlngs.push(lastPoint);
            return data;
        }

    }
});

module.exports = store;
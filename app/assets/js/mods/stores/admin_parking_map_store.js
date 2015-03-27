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
        calibre: 1,
        parkingInfos: {},
        currentMode: mapOptions.dessin.place,
        places: [],
        allees: [],
        zones: [],
        afficheurs: [],
        lastDraw: {},
        lastParallelogramme: {}
    },

    /**
     * GROUPES D'ACTIONS À ÉCOUTER
     */
    listenables: [Actions.map, Actions.validation],

    getInitialState: function () {
        return {};
    },
    init: function () {

    },


    /**
     * Appellé lors de l'initialisation de la map pour renseigner le calibre initial
     * et charger les données des zones, places et allées de ce niveau
     *
     * @param map : objet leaflet
     * @param calibre : calibre initial de la carte (cm/deg)
     * @param parkingInfos : object avec deux clés idParking et niveauId
     */
    onMap_initialized: function (map, calibre, parkingInfos) {

        console.log('Calibre au niveau du store : ' + calibre);
        console.log('Infos du parking au niveau du store : %o', parkingInfos);
        this._inst.calibre = calibre;

        // Récupération en BDD des données du parking sélectionné
        $.ajax({
            method: 'GET',
            url: BASE_URI + 'parking/niveau/' + parkingInfos.niveauId, /* TODO */
            dataType: 'json',
            context: this,
            async: true,
            success: function (data) {
                console.log('Retour AJAX init map : %o', data);
            },
            error: function (xhr, status, err) {
                console.error(status, err);
            }
        })
    },

    /**
     * ---------------------------------------------------------------------------
     * EVENTS DE DESSIN ----------------------------------------------------------
     * ---------------------------------------------------------------------------
     */
    // CRÉATION D'UN DESSIN FINIE (Ajout a la carte)
    onDraw_created: function (data) {
        console.log('Pass onDraw_created %o', data);

        // SI EN MODE PLACE AUTO, ON VA CALCULER LE PARALLÈLOGRAMME
        if (this._inst.currentMode == mapOptions.dessin.place_auto) {
            data = this.createParallelogramme(data);

            // LE PARALLÉLOGRAMME N'A PAS ÉTÉ CONSTRUIT (PAS LE BON NOMBRE DE POINTS PROBABLEMENT)
            if (!_.isEmpty(data)) {
                // on garde le parallélogramme dans le store pour le retour de la popup
                this._inst.lastParallelogramme = data;
                var retour = {
                    type: mapOptions.type_messages.new_place_auto,
                    data: data
                };
                this.trigger(retour);
            }
        }
        // SINON, ON AJOUTE SIMPLEMENT LA FORME À LA MAP
        else {
            var retour = {
                type: mapOptions.type_messages.add_forme,
                data: data
            };
            this.trigger(retour);
        }
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
     * ---------------------------------------------------------------------------
     * VALIDATION DES FORMULAIRES ------------------------------------------------
     * ---------------------------------------------------------------------------
     */

    /**
     * Appellée quand un formulaire a été validé syntaxiquement et métierment parlent.
     * @param formDom : noeud racine contenant le formulaire
     * @param formId : id du formulaire
     */
    onSubmit_form: function (formDom, formId) {
        console.group('- - - - - Pass onSubmitForm');
        console.log('DOM du form : %o', formDom);
        console.log('ID du form : ' + formId);
        console.groupEnd();

        // SÉLECTION DU FORMULAIRE POUR TRAITER L'ACTION
        switch (formId) {
            case "form_mod_places_multiples":
                this.handlePlacesMultiples(formDom, this._inst.lastParallelogramme.e.layer._latlngs);
                break;
            default:
                break;
        }
    },

    /**
     * Récupère les données de la popup de création de plusieurs places.
     *
     * @param formDom : dom du formulaire avec les informations de la popup
     * @param parallelogramme : tableau des points du parallélogramme
     */
    handlePlacesMultiples: function (formDom, parallelogramme) {
        console.log('Parallélogramme pour créer les places multiples : %o', parallelogramme);
        var $form = $(formDom);
        var nbPlaces = $form.find('[name=nb_place]').val(),
            spacePoteaux = $form.find('[name=nb_poteaux]').val(),
            largPoteaux = $form.find('[name=taille_poteaux]').val(),
            pref = $form.find('[name=prefixe]').val(),
            inc = $form.find('[name=increment]').val(),
            suff = $form.find('[name=suffixe]').val();
        console.log(
            'Places : ' + nbPlaces +
            ' Espace poteaux : ' + spacePoteaux +
            ' Largeur poteaux : ' + largPoteaux +
            ' Préfixe : ' + pref +
            ' Inc : ' + inc +
            ' Suff : ' + suff);

        var places = [];
        // CONTRÔLE DES NOMBRES ENTRÉS
        if (parseInt(spacePoteaux) < parseInt(nbPlaces)) {
            places = mapHelper.createPlacesFromParallelogramme(
                this._inst.calibre,
                parallelogramme,
                nbPlaces,
                spacePoteaux,
                largPoteaux,
                pref,
                inc,
                suff);

            this._inst.places = this._inst.places.concat(places);
            console.log('Tableau des places dans le store : %o', this._inst.places);

            // Enregistrement des places via le serveur

            // Envoi des infos à afficher sur la carte
            var retour = {
                type: mapOptions.type_messages.add_formes,
                data: places
            };
            this.trigger(retour);
        } else {
            swal(Lang.get('administration_parking.carte.swal_interval_incorrect'));
        }
    },

    /**
     * ---------------------------------------------------------------------------
     * UTILITAIRES DIVERSES ------------------------------------------------------
     * ---------------------------------------------------------------------------
     */
    /**
     * Les data correspondent au layer créé par le plugin. Le premier test consiste à vérifier qu'on ait 3 points
     * @param data : le Layer créé par le plugin de map
     */
    createParallelogramme: function (data) {
        console.log('createParallelogramme : %o', data);

        if (data.e.layer._latlngs.length != 3) {
            swal(Lang.get('administration_parking.carte.3_points_seulement'));
            return {};
        } else {
            var lastPoint = mapHelper.getLastPointOfParallelogramme(data.e.layer._latlngs);
            data.e.layer._latlngs.push(lastPoint);
            return data;
        }

    }
});

module.exports = store;
var _ = require('lodash');

var mapOptions = require('../helpers/map_options');
var mapHelper = require('../helpers/map_helper');
var formDataHelper = require('../helpers/form_data_helper');
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
        parkingInfos: {
            id: 0,
            libelle: '',
            description: '',
            init: 0
        },
        niveauInfos: {
            id: 0,
            libelle: '',
            description: '',
            plan: '',
            parking_id: 0,
            etat_general_id: 0,
            defaultZone: {}, // Zone par defaut du niveau
            defaultAllee: {} // Allee par défaut du niveau
        },
        types_places: [], // Types de places de la BDD
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
     * @param parkingInfos : object avec deux clés parkingId et niveauId
     */
    onMap_initialized: function (map, calibre, parkingInfos) {

        console.log('Calibre au niveau du store : ' + calibre);
        console.log('Infos du parking au niveau du store : %o', parkingInfos);
        this._inst.calibre = calibre;

        // Récupération en BDD des données du parking sélectionné
        $.ajax({
            method: 'GET',
            url: BASE_URI + 'parking/' + parkingInfos.parkingId,
            dataType: 'json',
            context: this,
            success: function (data) {
                // Récup des données
                this._inst.parkingInfos.id = data.id;
                this._inst.parkingInfos.libelle = data.libelle;
                this._inst.parkingInfos.description = data.description;
                this._inst.parkingInfos.init = data.init;
            },
            error: function (xhr, status, err) {
                console.error(status, err);
            }
        });

        // Récupération en BDD des données du niveau sélectionné
        $.ajax({
            method: 'GET',
            url: BASE_URI + 'parking/niveau/' + parkingInfos.niveauId,
            dataType: 'json',
            context: this,
            success: function (data) {
                console.log('Retour AJAX init map infos niveau : %o', data);

                // ---------------------------------------------------------------------
                // Récupération des données du niveau
                this._inst.niveauInfos.id = data.id;
                this._inst.niveauInfos.libelle = data.libelle;
                this._inst.niveauInfos.description = data.description;
                this._inst.niveauInfos.plan = data.plan;
                this._inst.niveauInfos.parking_id = data.parking_id;
                this._inst.niveauInfos.etat_general_id = data.etat_general_id;

                // Extraction des sous éléments du niveau
                var zones = data.zones;
                var jsonZones = [];
                var allees = [];
                var jsonAllees = [];
                var places = [];
                var jsonPlaces = [];

                // Récupération des json zones et des allées
                _.each(zones, function (z) {
                    jsonZones.push(z.geojson);
                    Array.prototype.push.apply(allees, z.allees);

                    // Récupération zone par défaut
                    z.defaut == "1" ? this._inst.niveauInfos.defaultZone = z : '';
                }, this);
                console.log('jsonZones : %o -- allees : %o', jsonZones, allees);

                // Récupération des json allées et des places
                _.each(allees, function (a) {
                    jsonAllees.push(a.geojson);
                    Array.prototype.push.apply(places, a.places);

                    // Récupération allée par défaut
                    a.defaut == "1" ? this._inst.niveauInfos.defaultAllee = a : '';
                }, this);
                console.log('jsonAllees : %o -- places : %o', jsonAllees, places);

                // Récupération des json allées et des places
                _.each(places, function (p) {
                    jsonPlaces.push(p.geojson);
                }, this);
                console.log('jsonPlaces : %o', jsonPlaces);
                // ---------------------------------------------------------------------

                console.log('this._inst a la fin des récupérations AJAX : %o', this._inst);
            },
            error: function (xhr, status, err) {
                console.error(status, err);
            }
        });
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
            num = $form.find('[name=num_initial]').val(),
            suff = $form.find('[name=suffixe]').val(),
            incr = $form.find('[name=increment]').val();

        console.log(
            'Places : ' + nbPlaces +
            ' Espace poteaux : ' + spacePoteaux +
            ' Largeur poteaux : ' + largPoteaux +
            ' Préfixe : ' + pref +
            ' Inc : ' + num +
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
                num,
                suff,
                incr,
                this._inst.niveauInfos.defaultAllee.id);

            this._inst.places = this._inst.places.concat(places);
            console.log('Tableau des places dans le store : %o', this._inst.places);

            // TODO Création des geoJson des places pour le marker et le parallélogramme
            var jsonPlaces = _.map(places, function (p) {
                var json = p.marker.toGeoJSON();
                json.properties = p.data;
                return json;
            }, this);
            console.log('Tableau de geoJson à enregistrer: %o', jsonPlaces);

            // Enregistrement des places via le serveur
            var fData = formDataHelper('', 'POST');
            fData.append('places', jsonPlaces);


            $.ajax({
                type: 'POST',
                url: 'parking/place',
                data: {},
                success: function (data) {
                    console.log('Pass succès ajax places multiples : %o', data);
                },
                error: function (xhr, type, exception) {
                    // if ajax fails display error alert
                    alert("ajax error response error " + type);
                    alert("ajax error response body " + xhr.responseText);
                }
            });

            // Envoi des infos à afficher sur la carte
            // TODO : le mettre dans le succès ajax
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
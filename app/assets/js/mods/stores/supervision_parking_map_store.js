var mapOptions = require('../helpers/map_options');
var mapHelper = require('../helpers/map_helper');
var zoneHelper = require('../helpers/zone_helper');
var alleeHelper = require('../helpers/allee_helper');
var placeHelper = require('../helpers/place_helper');
var afficheurHelper = require('../helpers/afficheur_helper');

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
        defaults: {
            type_place: {},
            zone: {},
            allee: {}
        },
        parkingInfos: {
            id: 0,
            libelle: '',
            description: '',
            init: 0
        },
        planInfos: {
            id: 0,
            libelle: '',
            description: '',
            plan: '',
            parking_id: 0,
            etat_general_id: 0
        },
        types_places: [],
        places: [],
        allees: [],
        zones: [],
        afficheurs: []
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
    onMap_initialized: function (map, calibre, parkingInfos, mapInst) {

        // Récupération du calibre
        this._inst.calibre = calibre;
        this._inst.mapInst = mapInst;

        // Récupération en BDD des données du parking sélectionné
        var p1 = this.recupInfosParking(map, calibre, parkingInfos);

        // Récupération en BDD des données du niveau sélectionné (zones, allées, places)
        var p2 = this.recupInfosPlan(map, calibre, parkingInfos);

        // Récupération en BDD des données de types de places
        var p3 = this.recupInfosTypesPlaces();


        $.when(p1, p2, p3).done(function () {
            // Affichage des places du niveau
            this.affichageDataInitial();
        }.bind(this));
    },

    /**
     * Récupère les places qui ont changé
     * @param data
     */
    onRefresh_places: function (data, planId) {

        if (this._inst.planInfos.id == planId) {
            var ajout = [], suppression = [];
            _.each(data, function (p, i) {
                // C'EST UN AJOUT
                if (p.etat_occupation && p.etat_occupation.is_occupe == "1") {
                    ajout.push(placeHelper.createPlaceFromData(p, this._inst.types_places));
                }
                // C'EST UNE SUPPRESSION
                else {
                    suppression.push(p);
                }
            }, this);

            if (ajout.length) {
                // On balance les occupations
                this.trigger({
                    type: mapOptions.type_messages.occuper_places,
                    data: ajout
                });
            }
            if (suppression.length) {
                // On balance les libérations
                this.trigger({
                    type: mapOptions.type_messages.liberer_places,
                    data: suppression
                });
            }
        }
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

    },

    /**
     * ---------------------------------------------------------------------------
     * UTILITAIRES DIVERSES ------------------------------------------------------
     * ---------------------------------------------------------------------------
     */

    /**
     * Appel AJAX pour récupérer les informations du parking
     */
    recupInfosParking: function (map, calibre, parkingInfos) {
        return $.ajax({
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
    },

    /**
     * Appel AJAX pour récupérer les données du niveau courant en BDD
     */
    recupInfosPlan: function (map, calibre, parkingInfos) {
        return $.ajax({
            method: 'GET',
            url: BASE_URI + 'parking/plan/' + parkingInfos.planId + '/places',
            dataType: 'json',
            context: this,
            success: function (data) {

                // ---------------------------------------------------------------------
                // Récupération des données du niveau
                this._inst.planInfos.id = data.id;
                this._inst.planInfos.libelle = data.libelle;
                this._inst.planInfos.description = data.description;
                this._inst.planInfos.plan = data.plan;
                this._inst.planInfos.parking_id = data.parking_id;
                this._inst.planInfos.etat_general_id = data.etat_general_id;

                // Extraction des sous éléments du niveau
                var zones = data.zones;
                var jsonZones = [];
                var allees = [];
                var jsonAllees = [];
                var places = [];
                var jsonPlaces = [];

                this._inst.mapInst.placesMarkersGroup.options.maxClusterRadius = data.cluster_radius;
                map.setZoom(data.zoom_level);

                // RÉCUPÉRATION DES JSON ZONES ET DES ALLÉES
                _.each(zones, function (z) {
                    jsonZones.push(z.geojson);
                    Array.prototype.push.apply(allees, z.allees);

                    // Récupération zone par défaut
                    z.defaut == "1" ? this._inst.defaults.zone = z : '';
                }, this);

                // RÉCUPÉRATION DES JSON ALLÉES ET DES PLACES
                _.each(allees, function (a) {
                    jsonAllees.push(a.geojson);
                    Array.prototype.push.apply(places, a.places);

                    // Récupération allée par défaut
                    a.defaut == "1" ? this._inst.defaults.allee = a : '';
                }, this);

                // RÉCUPÉRATION DES JSON ALLÉES ET DES PLACES
                _.each(places, function (p) {
                    jsonPlaces.push(p.geojson);
                }, this);

                this._inst.places = places;
                this._inst.allees = allees;
                this._inst.zones = zones;
                this._inst.afficheurs = data.afficheurs;
                console.log('Afficheurs dans les data : %o', data.afficheurs);
                // ---------------------------------------------------------------------
            },
            error: function (xhr, status, err) {
                console.error(status, err);
            }
        });
    },

    /**
     * Requête AJAX pour récupérer les types de places en BDD
     */
    recupInfosTypesPlaces: function () {
        return $.ajax({
            url: 'parking/type_place/all',
            context: this,
            success: function (data) {
                if (_.isArray(data)) {

                    // Tous les types de places
                    this._inst.types_places = data;

                    // Recherche du type par défaut
                    var defaultType = _.filter(data, function (d) {
                        if (d.defaut == "1") {
                            return true;
                        }
                        return false;
                    });
                    if (_.size(defaultType)) {
                        this._inst.defaults.type_place = defaultType[0];
                    }
                }
                else {
                    console.error('Erreur de chargement des types de palaces');
                }
            },
            error: function (xhr, type, exception) {
                // if ajax fails display error alert
                console.error("ajax error response error " + type);
                console.error("ajax error response body " + xhr.responseText);
            }
        });
    },

    /**
     * Fonction appellée lors de l'init, on a déjà toutes les données dans _inst
     */
    affichageDataInitial: function () {
        // LES PLACES À AFFICHER SUR LA MAP ----------------------------------------------------
        var placesMap = _.map(this._inst.places, function (p) {
            return placeHelper.createPlaceFromData(p, this._inst.types_places);
        }, this);

        var message = {
            type: mapOptions.type_messages.add_places,
            data: placesMap
        };
        this.trigger(message);

        // LES ALLEES À AFFICHER SUR LA MAP ----------------------------------------------------
        var alleesMap = alleeHelper.createAlleesMapFromAlleesBDD(this._inst.allees, alleeHelper.style);

        message = {
            type: mapOptions.type_messages.add_allees,
            data: alleesMap
        };
        this.trigger(message);

        // LES ZONES À AFFICHER SUR LA MAP ----------------------------------------------------
        var zonesMap = zoneHelper.createZonesMapFromZonesBDD(this._inst.zones, zoneHelper.style);

        message = {
            type: mapOptions.type_messages.add_zones,
            data: zonesMap
        };
        this.trigger(message);

        // LES AFFICHEURS À AFFICHER SUR LA MAP ----------------------------------------------------
        var afficheursMap = afficheurHelper.createAfficheursMapFromAfficheursBDD(this._inst.afficheurs, afficheurHelper.style);
        message = {
            type: mapOptions.type_messages.add_afficheurs,
            data: afficheursMap
        };
        this.trigger(message);

    }
});

module.exports = store;
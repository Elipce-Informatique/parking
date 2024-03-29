require('sweetalert');

var mapOptions = require('../helpers/map_options');
var mapHelper = require('../helpers/map_helper');
var zoneHelper = require('../helpers/zone_helper');
var alleeHelper = require('../helpers/allee_helper');
var placeHelper = require('../helpers/place_helper');
var afficheurHelper = require('../helpers/afficheur_helper');
var formDataHelper = require('../helpers/form_data_helper');
var comHelper = require('../helpers/com_helper');
var moment = require('moment');
var config = require('../../config/config.js');

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
        calibre: 0,
        defaults: { // Objets par défauts pour la création des places
            type_place: {},
            zone: {},
            allee: {},
            etat_occupation: {}
        },
        parkingInfos: {
            id: 0,
            libelle: '',
            description: '',
            init: 0,
            last_aff_update: '',
            last_synchro_ok: ''
        },
        planInfos: {
            id: 0,
            libelle: '',
            description: '',
            plan: '',
            parking_id: 0,
            etat_general_id: 0
        },
        capteur_place: { // Dernier capteur placé
            concentrateur: {},  // Concentrateur concerné
            configs_ids: [],
            bus: {},            // Bus concerné
            capteurInit: {},    // Capteur initial pour l'affectation
            capteursTotaux: [], // Liste des capteurs totaux à affecter
            capteursRestant: [] // Liste des capteurs restant à affecter sur le bus
        },
        capteur_place_virtuel: {
            concentrateur: {},
            configs_ids: [],
            bus: {},
            bus_id: 0,
            leg_num: 0,
            last_noeud: 0,
            last_adresse: 0,
            nb_restant: 0,
            capteurs_a_envoyer: []
        },
        is_editing: false,
        types_places: [], // Types de places de la BDD
        currentMode: mapOptions.dessin.place,
        places: [], // Places avec data base de données
        allees: [], // Allées avec data base de donées
        zones: [],  // Zones avec data base de données
        afficheurs: [],
        lastDraw: {},
        lastParallelogramme: {},
        lastCalibre: {},
        contextMenuTarget: {}, // Cible du dernier context menu
        mapInst: {},
        placesToAssociateToAfficheur: []
    },

    /**
     * GROUPES D'ACTIONS À ÉCOUTER
     */
    listenables: [Actions.map, Actions.validation, Actions.com],

    getInitialState: function () {
        return {};
    },

    init: function () {
    },

    resetLocalState: function () {
        this._inst.capteur_place_virtuel = {
            concentrateur: {},
            configs_ids: [],
            bus: {},
            bus_id: 0,
            leg_num: 0,
            last_noeud: 0,
            last_adresse: 0,
            nb_restant: 0,
            capteurs_a_envoyer: []
        };
        this._inst.capteur_place = { // Dernier capteur placé
            concentrateur: {},       // Concentrateur concerné
            configs_ids: [],
            bus: {},                 // Bus concerné
            capteurInit: {},         // Capteur initial pour l'affectation
            capteursTotaux: [],      // Liste des capteurs totaux à affecter
            capteursRestant: []      // Liste des capteurs restant à affecter sur le bus
        };
    },


    /**
     * Appellé lors de l'initialisation de la map pour renseigner le calibre initial
     * et charger les données des zones, places et allées de ce niveau
     *
     * @param map : objet leaflet
     * @param calibre : calibre initial de la carte (cm/deg)
     * @param parkingInfos : object avec deux clés parkingId et planId
     */
    onMap_initialized: function (map, calibre, parkingInfos, mapInst) {

        this.resetLocalState();

        // Récupération de l'instance de la map
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
            this.connectWs(this._inst.parkingInfos.id);
        }.bind(this));
    }
    ,

    /**
     * ---------------------------------------------------------------------------
     * EVENTS DE DESSIN ----------------------------------------------------------
     * ---------------------------------------------------------------------------
     */
    // CRÉATION D'UN DESSIN FINIE (Ajout a la carte)
    onDraw_created: function (data) {
        this._inst.lastDraw = data;


        switch (this._inst.currentMode) {
            // -------------------------------------------------------------
            // SI EN MODE PLACE AUTO, ON VA CALCULER LE PARALLELLOGRAMME
            case mapOptions.dessin.place_auto:
                var donnee = this.createParallelogramme(data);

                // LE PARALLÉLOGRAMME N'A PAS ÉTÉ CONSTRUIT (PAS LE BON NOMBRE DE POINTS PROBABLEMENT)
                if (!_.isEmpty(donnee)) {
                    // on garde le parallélogramme dans le store pour le retour de la popup
                    this._inst.lastParallelogramme = donnee;
                    var retour = {
                        type: mapOptions.type_messages.new_place_auto,
                        data: donnee
                    };
                    this.trigger(retour);
                }
                break;
            // -------------------------------------------------------------
            // CALCUL DU CALIBRE
            case mapOptions.dessin.calibre:
                var coords = this.checkCalibre(data);

                // LE SEGMENT N'A PAS ÉTÉ CONSTRUIT (PAS LE BON NOMBRE DE POINTS PROBABLEMENT)
                if (!_.isEmpty(coords)) {
                    this._inst.lastCalibre = data;
                    var retour = {
                        type: mapOptions.type_messages.new_calibre,
                        data: coords
                    };
                    this.trigger(retour);
                }
                break;
            // -------------------------------------------------------------
            // PROCÉDURE DE CRÉATION DE ZONE
            case mapOptions.dessin.zone:
                var zones, allees;
                zones = mapHelper.getPolygonsArrayFromLeafletLayerGroup(this._inst.mapInst.zonesGroup);
                allees = mapHelper.getPolygonsArrayFromLeafletLayerGroup(this._inst.mapInst.alleesGroup);

                var geometryOk = zoneHelper.geometryCheck(data.e.layer._latlngs, zones, allees);

                // Géométrie OK ouverture de la POPUP
                if (geometryOk) {
                    var retour = {
                        type: mapOptions.type_messages.new_zone,
                        data: data
                    };
                    this.trigger(retour);
                }
                break;
            // -------------------------------------------------------------
            // PROCÉDURE DE CRÉATION D'ALLÉE
            case mapOptions.dessin.allee:
                var zones, allees;
                zones = mapHelper.getPolygonsArrayFromLeafletLayerGroup(this._inst.mapInst.zonesGroup);
                allees = mapHelper.getPolygonsArrayFromLeafletLayerGroup(this._inst.mapInst.alleesGroup);

                var geometryOk = alleeHelper.geometryCheck(data.e.layer._latlngs, zones, allees);

                // Géométrie OK ouverture de la POPUP
                if (geometryOk) {
                    var retour = {
                        type: mapOptions.type_messages.new_allee,
                        data: data
                    };
                    this.trigger(retour);
                }
                break;
            // -------------------------------------------------------------
            // PROCÉDURE DE CRÉATION D'AFFICHEUR
            case mapOptions.dessin.afficheur:
                //console.log('PASS ADD AFFICHEUR : %o', data);
                var dessin = data.e.layer;

                // INIT DES VARIABLES NÉCESSAIRES À LA CRÉATION
                var poly = null;
                var marker = {};
                var markerCoords = {};

                // GÉNÉRATION DES INFOS SELON LE MODE DE DESSON CHOISI
                if (data.e.layerType === "polyline") {
                    poly = dessin;
                    markerCoords = afficheurHelper.getCoordAfficheurFromPolyline(dessin);

                    // Mode polyline, on crée un marker au bout
                    marker = new L.marker(markerCoords);
                } else {
                    marker = dessin;
                    markerCoords = dessin._latlng;
                    // Mode marker, on laisse le polyline à null
                }

                // PRÉPARATION DU RETOUR
                var retour = {
                    type: mapOptions.type_messages.new_afficheur,
                    data: {
                        coords: markerCoords,
                        polyline: poly,
                        marker: marker
                    }
                };
                this.trigger(retour);
                break;
            // -------------------------------------------------------------
            // PROCÉDURE DE CRÉATION D'AFFICHEUR
            case mapOptions.dessin.afficheur_get:
                console.log('PASS ADD AFFICHEUR : %o', data);
                var dessin = data.e.layer;

                // INIT DES VARIABLES NÉCESSAIRES À LA CRÉATION
                var poly = null;
                var marker = {};
                var markerCoords = {};

                // GÉNÉRATION DES INFOS SELON LE MODE DE DESSON CHOISI
                if (data.e.layerType === "polyline") {
                    poly = dessin;
                    markerCoords = afficheurHelper.getCoordAfficheurFromPolyline(dessin);

                    // Mode polyline, on crée un marker au bout
                    marker = new L.marker(markerCoords);
                } else {
                    marker = dessin;
                    markerCoords = dessin._latlng;
                    // Mode marker, on laisse le polyline à null
                }

                // PRÉPARATION DU RETOUR
                var retour = {
                    type: mapOptions.type_messages.new_afficheur_get,
                    data: {
                        coords: markerCoords,
                        polyline: poly,
                        marker: marker
                    }
                };
                this.trigger(retour);
                break;
            case mapOptions.dessin.capteur_afficheur:
                console.log('PASS FORME CAPTEUR_AFFICHEUR DESSINEE : %o', data);
                var places = afficheurHelper.getPlacesInAfficheur(data, this._inst);
                this._inst.placesToAssociateToAfficheur = places;

                if (places != false) {
                    var retour = {
                        type: mapOptions.type_messages.capteur_afficheur,
                        data: {
                            places: places
                        }
                    };
                    this.trigger(retour);
                }

                break;
            // -------------------------------------------------------------
            // SINON, ON AJOUTE SIMPLEMENT LA FORME À LA MAP
            default:
                var retour = {
                    type: mapOptions.type_messages.add_forme,
                    data: data
                };
                this.trigger(retour);
                break;
        }
    },
    onDraw_edited: function (data) {
        //console.log('Pass onDraw_edited %o', data);
        var editedEntities = _.values(data.e.layers._layers);
        switch (this._inst.currentMode) {
            // -------------------------------------------------------------
            // MODIFICATION D'UNE OU PLUSIEURS PLACES
            case mapOptions.dessin.place:
            case mapOptions.dessin.place_auto:
                placeHelper.editPlacesGeometry(
                    editedEntities,
                    this._inst.zones,
                    this._inst.allees,
                    this._inst.defaults.allee
                );
                break;
            // -------------------------------------------------------------
            // MODIFICATION D'UNE OU PLUSIEURS ZONES
            case mapOptions.dessin.zone:
                break;
            // -------------------------------------------------------------
            // MODIFICATION D'UNE OU PLUSIEURS ALLÉES
            case mapOptions.dessin.allee:
                break;
            // -------------------------------------------------------------
            // MODIFICATION D'UN OU PLISIEURS AFFICHEURS
            case mapOptions.dessin.afficheur:
                // pas encore pris en compte
                break;
            // -------------------------------------------------------------
            // SINON, ON AJOUTE SIMPLEMENT LA FORME À LA MAP
            default:
                //
                break;
        }
    },
    // SUPPRESSION D'UN DESSIN
    onDraw_deleted: function (data) {
        //console.log('Pass onDraw_deleted %o', data);
        var deletedEntities = _.values(data.e.layers._layers);
        if (deletedEntities.length > 0) {
            switch (this._inst.currentMode) {
                // -------------------------------------------------------------
                // SUPPRESSION D'UNE OU PLUSIEURS PLACES
                case mapOptions.dessin.place:
                case mapOptions.dessin.place_auto:
                    var context = this;
                    swal({
                        title: Lang.get('administration_parking.carte.swal_titre_confirm'),
                        text: Lang.get('administration_parking.carte.swal_msg_confirm_place'),
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: Lang.get('global.del'),
                        cancelButtonText: Lang.get('global.annuler'),
                        closeOnConfirm: true,
                        closeOnCancel: true
                    }, function (isConfirm) {
                        if (isConfirm) {
                            context.deletePlaces(deletedEntities)
                        } else {
                            context.cancelDeletePlaces(deletedEntities);
                        }
                    });
                    break;
                // -------------------------------------------------------------
                // SUPPRESSION D'UNE OU PLUSIEURS ZONES
                case mapOptions.dessin.zone:
                    var context = this;
                    swal({
                        title: Lang.get('administration_parking.carte.swal_titre_confirm'),
                        text: Lang.get('administration_parking.carte.swal_msg_confirm_zone'),
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: Lang.get('global.del'),
                        cancelButtonText: Lang.get('global.annuler'),
                        closeOnConfirm: true,
                        closeOnCancel: true
                    }, function (isConfirm) {
                        if (isConfirm) {
                            context.deleteZones(deletedEntities)
                        } else {
                            context.cancelDeleteZones(deletedEntities);
                        }
                    });
                    break;
                // -------------------------------------------------------------
                // SUPPRESSION D'UNE OU PLUSIEURS ALLÉES
                case mapOptions.dessin.allee:
                    var context = this;
                    swal({
                        title: Lang.get('administration_parking.carte.swal_titre_confirm'),
                        text: Lang.get('administration_parking.carte.swal_msg_confirm_allee'),
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: Lang.get('global.del'),
                        cancelButtonText: Lang.get('global.annuler'),
                        closeOnConfirm: true,
                        closeOnCancel: true
                    }, function (isConfirm) {
                        if (isConfirm) {
                            context.deleteAllees(deletedEntities)
                        } else {
                            context.cancelDeleteAllees(deletedEntities);
                        }
                    });
                    break;
                // -------------------------------------------------------------
                // SUPPRESSION D'UN OU PLISIEURS AFFICHEURS
                case mapOptions.dessin.afficheur:
                    var context = this;
                    swal({
                        title: Lang.get('administration_parking.carte.swal_titre_confirm'),
                        text: Lang.get('administration_parking.carte.swal_msg_confirm_afficheur'),
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: Lang.get('global.del'),
                        cancelButtonText: Lang.get('global.annuler'),
                        closeOnConfirm: true,
                        closeOnCancel: true
                    }, function (isConfirm) {
                        if (isConfirm) {
                            context.deleteAfficheurs(deletedEntities)
                        } else {
                            context.cancelDeleteAfficheurs(deletedEntities);
                        }
                    });
                    break;
                // -------------------------------------------------------------
                // SINON, ON AJOUTE SIMPLEMENT LA FORME À LA MAP
                default:
                    //
                    break;
            }
        } else {
            swal(Lang.get('administration_parking.carte.err_aucun_forme_select'));
        }
    },
    onDraw_drawstart: function (data) {
        this._inst.is_editing = true;
        //console.log('Pass onDraw_drawstart %o', data);
    },
    onDraw_drawstop: function (data) {
        this._inst.is_editing = false;
        //console.log('Pass onDraw_drawstop %o', data);
    },
    // A VOIR COMMENT RECUP LES DESSINS
    onDraw_editstart: function (data) {
        this._inst.is_editing = true;
    },
    onDraw_editstop: function (data) {
        this._inst.is_editing = false;
    },
    onDraw_deletestart: function (data) {
        this._inst.is_editing = true;
    },
    onDraw_deletestop: function (data) {
        this._inst.is_editing = false;
    },

    /**
     * ---------------------------------------------------------------------------
     * AJOUT D'UNE FEATURE À LA CARTE --------------------------------------------
     * ---------------------------------------------------------------------------
     */
    onFeature_place_add: function (e) {
        var store = this;
        e.layer.bindContextMenu({
            contextmenu: true,
            contextmenuItems: placeHelper.administrationContextMenu(e, store)
        });
    },
    onMarker_place_add: function (e) {
        var store = this;
        e.layer.bindContextMenu({
            contextmenu: true,
            contextmenuItems: placeHelper.administrationCapteurContextMenu(e, store)
        });
    },
    onFeature_allee_add: function (e) {
        var store = this;
        e.layer.bindContextMenu({
            contextmenu: true,
            contextmenuItems: alleeHelper.administrationContextMenu(e, store)
        });
    },
    onFeature_zone_add: function (e) {
        e.layer.bindContextMenu({
            contextmenu: true,
            contextmenuItems: [{
                text: '<b>' + e.layer.options.data.libelle + '</b>',
                index: 0
            }, {
                separator: true,
                index: 1
            }, {
                text: Lang.get('global.modifier'),
                index: 2,
                callback: function (evt) {
                    // LANCEMENT DU MODAL DE MODIF DE ZONES
                    var data = {
                        layer: this.layer
                    };
                    var retour = {
                        type: mapOptions.type_messages.edit_zone,
                        data: data
                    };
                    this.storeContext.trigger(retour);
                }.bind({
                        e: e,
                        storeContext: this
                    })
            }]
        });
    },
    /**
     * Affecte le contextMenu sur les afficheurs ajoutés à la map
     * @param e
     */
    onFeature_afficheur_add: function (e) {
        //console.log('feature afficheur add : %o', e);
        e.layer.bindContextMenu({
            contextmenu: true,
            contextmenuItems: [{
                text: '<b>' + e.layer.options.data.libelle + '</b>',
                index: 0
            }, {
                separator: true,
                index: 1
            }, {
                text: Lang.get('global.modifier'),
                index: 2,
                callback: function (evt) {
                    // LANCEMENT DU MODAL DE MODIF DE AFFICHEURS
                    var data = {
                        layer: this.layer
                    };
                    var retour = {
                        type: mapOptions.type_messages.edit_afficheur,
                        data: data
                    };
                    this.storeContext.trigger(retour);
                }.bind({
                        e: e,
                        storeContext: this
                    })
            },
                {
                    text: Lang.get('global.reset'),
                    index: 2,
                    callback: function (evt) {
                        var context = this;
                        // LANCEMENT SWAL CONFIRMATION RESET AFFICHEUR
                        swal({
                            title: Lang.get('administration_parking.carte.swal_titre_confirm'),
                            text: Lang.get('administration_parking.carte.swal_msg_confirm_reset_afficheur'),
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: Lang.get('global.reset'),
                            cancelButtonText: Lang.get('global.annuler'),
                            closeOnConfirm: true,
                            closeOnCancel: true
                        }, function (isConfirm) {
                            if (isConfirm) {
                                context.storeContext.resetAfficheur(context.e);
                            }
                        });

                    }.bind({
                            e: e,
                            storeContext: this
                        })
                }]
        });
    },

    /**
     * ---------------------------------------------------------------------------
     * CHANGEMENT DU MODE DE DESSIN ----------------------------------------------
     * ---------------------------------------------------------------------------
     */
    onMode_place: function (data) {
        if (this.canSwitchMode()) {
            this._inst.currentMode = mapOptions.dessin.place;

            var retour = {
                type: mapOptions.type_messages.mode_change,
                data: {
                    mode: mapOptions.dessin.place
                }
            };
            this.trigger(retour);
        }
    },
    onMode_place_auto: function (data) {
        if (this.canSwitchMode()) {
            this._inst.currentMode = mapOptions.dessin.place_auto;

            var retour = {
                type: mapOptions.type_messages.mode_change,
                data: {
                    mode: mapOptions.dessin.place_auto
                }
            };
            this.trigger(retour);
        }
    },
    onMode_allee: function (data) {
        if (this.canSwitchMode()) {
            this._inst.currentMode = mapOptions.dessin.allee;

            var retour = {
                type: mapOptions.type_messages.mode_change,
                data: {
                    mode: mapOptions.dessin.allee
                }
            };
            this.trigger(retour);
        }
    },
    onMode_zone: function (data) {
        if (this.canSwitchMode()) {
            this._inst.currentMode = mapOptions.dessin.zone;

            var retour = {
                type: mapOptions.type_messages.mode_change,
                data: {
                    mode: mapOptions.dessin.zone
                }
            };
            this.trigger(retour);
        }
    },
    /**
     * Passe en mode afficheurs, attention le fonctionnel
     * derrière dépend du switch sur le mode d'init du parking
     * @param data
     */
    onMode_afficheur: function (data) {

        if (this.canSwitchMode()) {
            switch (this._inst.parkingInfos.init_mode) {
                // MODE REEL
                case '0':
                case '1':
                {
                    this._inst.currentMode = mapOptions.dessin.afficheur_get;

                    var retour = {
                        type: mapOptions.type_messages.mode_change,
                        data: {
                            mode: mapOptions.dessin.afficheur_get
                        }
                    };
                    this.trigger(retour);
                    break;
                    break;
                }
                // MODE VIRTUEL
                case '2':
                {
                    this._inst.currentMode = mapOptions.dessin.afficheur;

                    var retour = {
                        type: mapOptions.type_messages.mode_change,
                        data: {
                            mode: mapOptions.dessin.afficheur
                        }
                    };
                    this.trigger(retour);
                    break;
                }
                default:
            }
        }

    },
    onMode_calibre: function (data) {
        if (this.canSwitchMode()) {
            this._inst.currentMode = mapOptions.dessin.calibre;

            var retour = {
                type: mapOptions.type_messages.mode_change,
                data: {
                    mode: mapOptions.dessin.calibre
                }
            };

            this.trigger(retour);
        }
    },

    onMode_capteur: function (data) {
        if (this.canSwitchMode()) {
            switch (this._inst.parkingInfos.init_mode) {
                // MODE REEL
                case '0':
                case '1':
                {
                    if (this._inst.parkingInfos.init != 0) {
                        this._inst.currentMode = mapOptions.dessin.capteur;

                        var retour = {
                            type: mapOptions.type_messages.mode_change,
                            data: {
                                mode: mapOptions.dessin.capteur
                            }
                        };
                        this.trigger(retour);

                        // Pour éviter d'éventuels glitch du à une utilisation bizarre
                        this._inst.mapInst.placesGroup.off('click', this.onPlaceCapteurClick, this);
                    } else {
                        swal(Lang.get('administration_parking.carte.err_parking_non_init'));
                    }
                    break;
                }
                // MODE VIRTUEL
                case '2':
                {
                    if (this._inst.capteur_place_virtuel.capteurs_a_envoyer.length == 0) {
                        this._inst.currentMode = mapOptions.dessin.capteur;

                        var retour = {
                            type: mapOptions.type_messages.mode_change,
                            data: {
                                mode: mapOptions.dessin.capteur_virtuel
                            }
                        };
                        this.trigger(retour);

                        // Pour éviter d'éventuels glitch du à une utilisation bizarre
                        this._inst.mapInst.placesGroup.off('click', this.onPlaceCapteurClick, this);
                    }
                    else {
                        swal(Lang.get('administration_parking.carte.err_affectation_non_finie'));
                    }
                    break;
                }
                default:
            }
        }


    },

    onMode_capteur_afficheur: function (data) {
        if (this.canSwitchMode()) {
            this._inst.currentMode = mapOptions.dessin.capteur_afficheur;

            var retour = {
                type: mapOptions.type_messages.mode_change,
                data: {
                    mode: mapOptions.dessin.capteur_afficheur
                }
            };

            this.trigger(retour);
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
        // SÉLECTION DU FORMULAIRE POUR TRAITER L'ACTION
        switch (formId) {
            case "form_mod_places_multiples":
                this.handlePlacesMultiples(formDom, this._inst.lastParallelogramme.e.layer._latlngs);
                break;
            case "form_mod_calibre":
                this.handleCalibre(formDom, this._inst.lastCalibre.e.layer._latlngs);
                break;
            case "form_mod_zone":
                this.handleZone(formDom, this._inst.lastDraw);
                break;
            case "form_mod_allee":
                this.handleAllee(formDom, this._inst.lastDraw);
                break;
            case "form_mod_edit_place":
                this.handleUpdatePlace(formId, formDom);
                break;
            case "form_mod_afficheur":
                this.handleAfficheur(formId, formDom);
                break;
            case 'form_mod_select_afficheur':
                this.handleCapteurAfficheur(formId, formDom);
                break;

            default:
                break;
        }
    },


    /**
     * Lance le message de synchro
     */
    onStart_synchro: function () {
        if (window.clientWs != null) {
            window.clientWs.send(JSON.stringify(comHelper.messages.startSynchroDisplays()));
        }
    },

    /**
     * Récupère les données de la popup de création de plusieurs places.
     *
     * @param formDom : dom du formulaire avec les informations de la popup
     * @param parallelogramme : tableau des points du parallélogramme
     */
    handlePlacesMultiples: function (formDom, parallelogramme) {
        var $form = $(formDom);

        // RÉCUPÉRATION DES DONNÉES DE LA MODALE
        var nbPlaces = $form.find('[name=nb_place]').val(),
            spacePoteaux = $form.find('[name=nb_poteaux]').val(),
            largPoteaux = $form.find('[name=taille_poteaux]').val(),
            pref = $form.find('[name=prefixe]').val(),
            num = $form.find('[name=num_initial]').val(),
            suff = $form.find('[name=suffixe]').val(),
            incr = $form.find('[name=increment]').val();

        var places = [];
        // CONTRÔLE DES NOMBRES ENTRÉS
        if (parseInt(spacePoteaux) < parseInt(nbPlaces)) {
            places = placeHelper.createPlacesFromParallelogramme(
                this._inst.calibre,
                parallelogramme,
                nbPlaces,
                spacePoteaux,
                largPoteaux,
                pref,
                num,
                suff,
                incr,
                this._inst.defaults.allee.id,
                this._inst.defaults.type_place.id,
                this._inst.defaults.type_place.couleur,
                this._inst.defaults.etat_occupation,
                this._inst.allees,
                this._inst.zones
            );

            // CRÉATION DU TABLEAU DE DONNÉES À ENREGISTRER
            var dataPlaces = _.map(places, function (p) {
                var json = JSON.stringify(p.polygon._latlngs);
                return _.extend(p.data, {
                    geoJson: json
                });
            }, this);

            // --------------------------------------------------------------------------

            // FORMATAGE DES DONNÉES POUR L'ENVOI
            var fData = formDataHelper('', 'POST');
            fData.append('places', JSON.stringify(dataPlaces));

            // ENREGISTREMENT AJAX DES PLACES
            $.ajax({
                type: 'POST',
                url: BASE_URI + 'parking/place',
                processData: false,
                contentType: false,
                data: fData,
                context: this,
                success: function (data) {
                    // TEST ÉTAT INSERTION
                    if (data.retour.length > 0) {
                        // 1 - TRANSFORMATION DES DATA DE LA BDD EN PLACES
                        var placesCreated = this.createPlacesMapFromPlacesBDD(data.retour);
                        // 2 - SAUVEGARDE DES PLACES EN LOCAL DNAS LE STORE
                        this._inst.places = this._inst.places.concat(placesCreated);

                        // 3 - ENVOI DES INFOS À AFFICHER SUR LA CARTE
                        var retour = {
                            type: mapOptions.type_messages.add_places,
                            data: placesCreated
                        };
                        this.trigger(retour);
                        Actions.notif.success();
                    } else {
                        Actions.notif.error(Lang.get('administration_parking.carte.insert_places_fail'));
                    }
                },
                error: function (xhr, type, exception) {
                    // if ajax fails display error alert
                    console.error("ajax error response error " + type);
                    console.error("ajax error response body " + xhr.responseText);
                }
            });
            // --------------------------------------------------------------------------
        } else {
            // NOMBRE DE POTEAUX INCORRECT
            swal(Lang.get('administration_parking.carte.swal_interval_incorrect'));
        }
    },

    /**
     * Insert l'afficheur saisi dans le form
     */
    handleAfficheur: function (formId, formDom) {
        var forme = this._inst.lastDraw.e;
        var lat, lng, ligne;

        // RÉCUPÉRATION DES DONNÉES À ENVOYER :
        var fData = formDataHelper(formId, 'POST');
        fData.append('plan_id', this._inst.planInfos.id);
        switch (forme.layerType) {
            case "marker":
                fData.append('lat', forme.layer._latlng.lat);
                fData.append('lng', forme.layer._latlng.lng);
                break;
            case "polyline":
                var coords = _.last(forme.layer._latlngs);
                fData.append('ligne', JSON.stringify(forme.layer._latlngs));
                fData.append('lat', coords.lat);
                fData.append('lng', coords.lng);
                break;
            default:
        }

        $.ajax({
            type: 'POST',
            url: BASE_URI + 'parking/afficheur',
            processData: false,
            contentType: false,
            context: this,
            data: fData
        })
            .done(function (data) {
                if (typeof data == 'object') {
                    Actions.notif.success();
                    this._inst.afficheurs.push(data);
                    this.trigger_notif_synchro();
                    var afficheursMap = afficheurHelper.createAfficheursMapFromAfficheursBDD([data]);

                    var message = {
                        type: mapOptions.type_messages.add_afficheurs,
                        data: afficheursMap
                    };
                    this.trigger(message);
                } else {
                    Actions.notif.error();
                }
            })
            .fail(function (xhr, type, exception) {
                // if ajax fails display error alert
                console.error("ajax error response error " + type);
                console.error("ajax error response body " + xhr.responseText);
            });
    },

    /**
     *
     * @param formId : Id du form
     * @param formDom : dom du form
     */
    handleCapteurAfficheur: function (formId, formDom) {
        // EXTRACTION DE L'ID DE L'AFFICHEUR SÉLECTIONNÉ
        var affId = $(formDom).find('[name=afficheur_id]').val();

        // RECHERCHE DE L'AFFICHEUR SÉLECTIONNÉ
        var afficheur = _.reduce(this._inst.afficheurs, function (result, a) {
            if (a.id == affId) {
                return a;
            }
            else {
                return result;
            }
        }, {}, this);

        // GÉNÉRATION DES DONNÉE DE RETOUR
        var dataCounters = afficheurHelper.prepareCountersData(this._inst.placesToAssociateToAfficheur, afficheur);


        var fData = formDataHelper('', 'POST');
        fData.append('data', JSON.stringify(dataCounters));

        $.ajax({
            type: 'POST',
            url: BASE_URI + 'parking/afficheur/' + affId + '/set_counters_views ',
            processData: false,
            contentType: false,
            dataType: 'json',
            context: this,
            data: fData
        })
            .done(function (data) {
                // On success use return data here
                if (data != false) {
                    Actions.notif.success();
                } else {
                    console.error('AJAX compteurs KO');
                    Actions.notif.error();
                }
                var retour = {
                    type: mapOptions.type_messages.hide_modal,
                    data: {}
                };
                this.trigger(retour);
            })
            .fail(function (xhr, type, exception) {
                // if ajax fails display error alert
                console.error("ajax error response error " + type);
                console.error("ajax error response body " + xhr.responseText);
            });

    },

    /**
     * Récupère la place sur laquelle le click droit à été fait
     * Met à jour les infos en fonction de la saisie
     * @param formId
     * @param formDom
     */
    handleUpdatePlace: function (formId, formDom) {
        console.log('Target menu : %o', this._inst.contextMenuTarget);
        var idPlace = this._inst.contextMenuTarget.options.data.id;

        var fData = formDataHelper(formId, 'PATCH');

        $.ajax({
            type: 'POST',
            url: BASE_URI + 'parking/place/' + idPlace.toString(),
            processData: false,
            contentType: false,
            data: fData,
            context: this,
            success: function (data) {
                if (!data.errorBdd) {
                    // 1 - TRANSFORMATION DES DATA DE LA BDD EN PLACES
                    var placesCreated = this.createPlacesMapFromPlacesBDD([data.model]);
                    this._inst.mapInst.placesGroup.removeLayer(this._inst.contextMenuTarget);
                    this._inst.mapInst.placesGroup.addLayer(placesCreated[0].polygon);

                    Actions.notif.success();
                    var retour = {
                        type: mapOptions.type_messages.hide_modal,
                        data: {}
                    };
                    this.trigger(retour);
                }
                else {
                    Actions.notif.error(Lang.get('administration_parking.carte.modif_places_fail'));
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
     *
     * @param formDom
     * @param coords
     */
    handleCalibre: function (formDom, coords) {
        var $form = $(formDom);
        var longueur = $form.find('[name=calibre]').val();
        var calibre = mapHelper.generateCalibreValue(parseFloat(longueur), coords);

        var fData = formDataHelper('', 'POST');
        fData.append('calibre', calibre);

        $.ajax({
            type: 'POST',
            url: BASE_URI + 'parking/plan/' + this._inst.planInfos.id + '/calibre',
            processData: false,
            contentType: false,
            data: fData,
            context: this
        })
            .done(function (data) {

                // TEST ÉTAT INSERTION
                if (data.retour) {
                    Actions.notif.success();

                    // MASQUAGE MODAL
                    var retour = {
                        type: mapOptions.type_messages.hide_modal,
                        data: {}
                    };
                    this.trigger(retour);

                    // MAJ CALIBRE STORE
                    this._inst.calibre = calibre;

                    // ACTIVATION CALIBRE SUR MAP
                    var retour = {
                        type: mapOptions.type_messages.set_calibre,
                        data: calibre
                    };
                    this.trigger(retour);

                } else {
                    Actions.notif.error(Lang.get('administration_parking.carte.calibre_update_fail'));
                }
            })
            .fail(function (xhr, type, exception) {
                // if ajax fails display error alert
                console.error("ajax error response error " + type);
                console.error("ajax error response body " + xhr.responseText);
            });

    },

    /**
     * Gère l'insertion en BDD de la zone avec le formulaire de la modale et la forme dessinée
     * @param formDom
     * @param zone
     */
    handleZone: function (formDom, zone) {
        zoneHelper.createZone(formDom, zone, this._inst, function (data) {
            data = JSON.parse(data);
            // TEST ÉTAT INSERTION
            if (typeof(data.retour) !== 'undefined') {
                // 1 - TRANSFORMATION DES DATA DE LA BDD EN ZONES
                var zonesCreated = zoneHelper.createZonesMapFromZonesBDD([data.retour], zoneHelper.style);
                // 2 - SAUVEGARDE DES ZONES EN LOCAL DNAS LE STORE
                this._inst.zones = this._inst.zones.concat(zonesCreated);
                // 3 - ENVOI DES INFOS À AFFICHER SUR LA CARTE
                var retour = {
                    type: mapOptions.type_messages.add_zones,
                    data: zonesCreated
                };
                this.trigger(retour);
                Actions.notif.success();
            } else {
                Actions.notif.error();
            }
        }.bind(this));
    },

    /**
     * Gère l'insertion en BDD de l'allée avec le formulaire de la modale et la forme dessinée
     * @param formDom
     * @param allee
     */
    handleAllee: function (formDom, allee) {
        alleeHelper.createAllee(formDom, allee, this._inst, function (data) {
            data = JSON.parse(data);
            // TEST ÉTAT INSERTION
            if (typeof(data.retour) !== 'undefined') {
                // 1 - TRANSFORMATION DES DATA DE LA BDD EN ALLEES
                var alleesCreated = alleeHelper.createAlleesMapFromAlleesBDD([data.retour], alleeHelper.style);
                // 2 - SAUVEGARDE DES ALLEES EN LOCAL DNAS LE STORE
                this._inst.allees = this._inst.allees.concat(alleesCreated);
                // 3 - ENVOI DES INFOS À AFFICHER SUR LA CARTE
                var retour = {
                    type: mapOptions.type_messages.add_allees,
                    data: alleesCreated
                };
                this.trigger(retour);
                Actions.notif.success();
            } else {
                Actions.notif.error();
            }
        }.bind(this));
    },


    /**
     * Supprime des zones
     * @param data : array les données formes à supprimer
     */
    deleteZones: function (data) {

        // INIT des données de retour
        var fData = formDataHelper('', 'DELETE');
        var ids = _.map(data, function (d) {
            return d.options.data.id;
        });
        fData.append('ids', ids);

        var url = BASE_URI + 'parking/zone/delete_many';

        this.deleteFromIds(url, fData);

    },
    /**
     * Annule la suppression visuelle des zones
     * @param data : array les données formes à remettre sur la carte
     */
    cancelDeleteZones: function (data) {
        var zonesMap = _.map(data, function (z) {
            return {
                data: z.options.data,
                polygon: z
            };
        }, this);

        var message = {
            type: mapOptions.type_messages.add_zones,
            data: zonesMap
        };
        this.trigger(message);
    },
    /**
     * Supprime des allées
     * @param data : array les données fournies par l'event "draw:deleted"
     * de leaflet.draw
     */
    deleteAllees: function (data) {

        // INIT des données de retour
        var fData = formDataHelper('', 'DELETE');
        var ids = _.map(data, function (d) {
            return d.options.data.id;
        });
        fData.append('ids', ids);

        var url = BASE_URI + 'parking/allee/delete_many';

        this.deleteFromIds(url, fData);
    },
    /**
     * Annule la suppression visuelle des allées
     * @param data : array les données formes à remettre sur la carte
     */
    cancelDeleteAllees: function (data) {
        var alleesMap = _.map(data, function (a) {
            return {
                data: a.options.data,
                polygon: a
            };
        }, this);

        var message = {
            type: mapOptions.type_messages.add_allees,
            data: alleesMap
        };
        this.trigger(message);
    },
    /**
     * Supprime des places
     * @param data : array les données fournies par l'event "draw:deleted"
     * de leaflet.draw
     */
    deletePlaces: function (data) {

        // INIT des données de retour
        var fData = formDataHelper('', 'DELETE');
        var ids = _.map(data, function (d) {
            return d.options.data.id;
        });
        fData.append('ids', ids);

        var url = BASE_URI + 'parking/place/delete_many';

        this.deleteFromIds(url, fData);
    },
    /**
     * Annule la suppression visuelle des places
     * @param data : array les données formes à remettre sur la carte
     */
    cancelDeletePlaces: function (data) {
        var placesMap = _.map(data, function (p) {
            return {
                data: p.options.data,
                polygon: p
            };
        }, this);

        var message = {
            type: mapOptions.type_messages.add_places,
            data: placesMap
        };
        this.trigger(message);
    },

    /**
     * Supprime des allées
     * @param data : array les données fournies par l'event "draw:deleted"
     * de leaflet.draw
     */
    deleteAfficheurs: function (data) {

        // INIT des données de retour
        var fData = formDataHelper('', 'DELETE');
        var ids = _.map(data, function (d) {
            Actions.map.delete_afficheur_line(d.options.data.id);
            return d.options.data.id;
        });


        // SI ON A DES AFFICHEURS À VIRER...
        fData.append('ids', ids);
        var url = BASE_URI + 'parking/afficheur/delocate_many';
        this.deleteFromIds(url, fData, function () {
            this.trigger_notif_synchro();
        }.bind(this));
    },
    /**
     * Annule la suppression visuelle des allées
     * @param data : array les données formes à remettre sur la carte
     */
    cancelDeleteAfficheurs: function (data) {
        var afficheursMap = _.map(data, function (a) {
            return {
                data: a.options.data,
                polygon: a
            };
        }, this);

        var message = {
            type: mapOptions.type_messages.add_afficheurs,
            data: afficheursMap
        };
        this.trigger(message);
    },

    /**
     * Lance le reset de l'afficheur passé en paramètre
     * @param e : l'objet leaflet de l'afficheur
     */
    resetAfficheur: function (e) {
        var aff = e.layer.options.data;
        var fdata = formDataHelper('', 'PATCH');
        $.ajax({
            type: 'POST',
            url: BASE_URI + 'parking/afficheur/' + aff.id + '/reset',
            processData: false,
            contentType: false,
            dataType: 'json',
            context: this,
            data: fdata
        })
            .done(function (data) {
                // on success use return data here
                if (data == "OK") {
                    this.trigger_notif_synchro();
                }
            })
            .fail(function (xhr, type, exception) {
                // if ajax fails display error alert
                console.error("ajax error response error " + type);
                console.error("ajax error response body " + xhr.responseText);
            });
    },

    /**
     * Lance une requête AJAX sur l'url et les data passées en params
     * puis notifie l'utilisateur selon le retour
     * @param url => url à appeller
     * @param fData => données à passer dans la requête
     */
    deleteFromIds: function (url, fData, onSuccess) {
        $.ajax({
            type: 'POST',
            url: url,
            processData: false,
            contentType: false,
            data: fData
        })
            .done(function (result) {
                if (result.save) {
                    Actions.notif.success();
                    onSuccess != undefined ? onSuccess() : null;
                } else {
                    Actions.notif.error();
                }
            })
            .fail(function (xhr, type, exception) {
                // if ajax fails display error alert
                console.error("ajax error response error " + type);
                console.error("ajax error response body " + xhr.responseText);
                Actions.notif.error();
            });
    },

    /**
     * Appellée quand la modale est validée pour initialiser la série d'affectation.
     *
     * @param concentrateur
     * @param bus
     * @param capteurInit -> Premier capteur à affecter
     * @param capteurs -> Capteurs restant sur le BUS concerné
     */
    onStart_affectation_capteurs: function (concentrateur, bus, capteurInit, capteurs) {
        // REMPLISSAGE DES INFOS
        this._inst.capteur_place.concentrateur = concentrateur;
        this._inst.capteur_place.bus = bus;
        this._inst.capteur_place.capteurInit = capteurInit;
        this._inst.capteur_place.capteursTotaux = capteurs;
        this._inst.capteur_place.capteursRestant = capteurs;

        // MISE À JOUR DU MESSAGE D'INFO
        var infos = mapHelper.generateInfosCapteurPlace(
            concentrateur.v4_id,
            bus.num,
            capteurInit.adresse,
            capteurs.length
        );

        var retour = {
            type: mapOptions.type_messages.hide_modal,
            data: {}
        };
        this.trigger(retour);

        // INIT MESSAGE D INFO
        retour = {
            type: mapOptions.type_messages.show_infos,
            data: infos
        };
        this.trigger(retour);

        // ATTACHEMENT DES ÉVÈNEMENTS SUR LES PLACES
        this._inst.mapInst.placesGroup.off('click', this.onPlaceCapteurClick, this);
        this._inst.mapInst.placesGroup.on('click', this.onPlaceCapteurClick, this);
    },

    /**
     * Commence la procédure de création de capteurs
     * @param concentrateurId
     * @param busId
     * @param legNum
     * @param maxAdresse
     * @param configs_ids
     */
    onStart_affectation_capteurs_virtuels: function (concentrateur, bus, legNum, maxAdresse, maxNumNoeud, configs_ids) {
        this._inst.capteur_place_virtuel.concentrateur = concentrateur;
        this._inst.capteur_place_virtuel.configs_ids = configs_ids;
        this._inst.capteur_place_virtuel.bus = bus;
        this._inst.capteur_place_virtuel.bus_id = bus.id;
        this._inst.capteur_place_virtuel.leg_num = parseInt(legNum);
        this._inst.capteur_place_virtuel.last_noeud = parseInt(maxNumNoeud);
        this._inst.capteur_place_virtuel.last_adresse = parseInt(maxAdresse);
        this._inst.capteur_place_virtuel.nb_restant = config.legLength[legNum] - maxNumNoeud;

        var infos = mapHelper.generateInfosCapteurPlaceVirtuel(
            concentrateur.v4_id,
            bus.num,
            maxAdresse,
            this._inst.capteur_place_virtuel.nb_restant
        );

        // Cachage de la modale
        var retour = {
            type: mapOptions.type_messages.hide_modal,
            data: {}
        };
        this.trigger(retour);

        // INIT MESSAGE D'INFO
        retour = {
            type: mapOptions.type_messages.show_infos,
            data: infos
        };
        this.trigger(retour);

        // ATTACHEMENT DES ÉVÈNEMENTS SUR LES PLACES
        this._inst.mapInst.placesGroup.off('click', this.onPlaceCapteurVirtuelClick, this);
        this._inst.mapInst.placesGroup.on('click', this.onPlaceCapteurVirtuelClick, this);
    },

    /**
     * Event listener sur click d'une place quand on est en mode capteur.
     * #- Récupère la place cliquée
     * #- Récupère le capteur à affecter
     * #- Test si place libre en JS
     * #- Lance l'update AJAX
     * - Si succès
     *      #- changement couleur place affectée
     *      #- Affectation du capteur id dans la place sur la carte
     *      #- Suppression du capteur de la liste restante
     *      #- Modification du message d'info
     *      - Avertissement si on a affecté le dernier capteur
     * - Si fail
     *      - Notification utilisateur (Place déjà affectée )
     *
     * @param evt
     */
    onPlaceCapteurClick: function (evt) {

        var place = _.cloneDeep(evt.layer.options.data);
        var capteur = _.first(this._inst.capteur_place.capteursRestant);


        // PLACE NON AFFECTÉE
        if (place.capteur_id == null) {

            // Formattage des données
            var fData = formDataHelper('', 'POST');
            fData.append('capteur_id', capteur.id);
            fData.append('mode_modif', 0);

            $.ajax({
                type: 'POST',
                url: BASE_URI + 'parking/place/' + place.id + '/setCapteur',
                processData: false,
                contentType: false,
                data: fData,
                context: this
            })
                .done(function (retour) {
                    // OK
                    if (retour.save) {

                        // SUPPRESSION PLACE MAP
                        var retourTrigger = {
                            type: mapOptions.type_messages.delete_place,
                            data: {
                                place_id: place.id
                            }
                        };
                        this.trigger(retourTrigger);

                        var newPlace = retour.model;
                        // CREATION PLACE MAP
                        retourTrigger = {
                            type: mapOptions.type_messages.add_places,
                            data: this.createPlacesMapFromPlacesBDD([newPlace])
                        };
                        this.trigger(retourTrigger);

                        // SUPPRESSION DU CAPTEUR DE LA LISTE RESTANTE
                        this._inst.capteur_place.capteursRestant = _.drop(this._inst.capteur_place.capteursRestant);

                        // MODIFICATION MESSAGE INFOS
                        var infos = mapHelper.generateInfosCapteurPlace(
                            this._inst.capteur_place.concentrateur.v4_id,
                            this._inst.capteur_place.bus.num,
                            this._inst.capteur_place.capteursRestant.length ? _.first(this._inst.capteur_place.capteursRestant).adresse : '',
                            this._inst.capteur_place.capteursRestant.length
                        );

                        retourTrigger = {
                            type: mapOptions.type_messages.update_infos,
                            data: infos
                        };

                        this.trigger(retourTrigger);

                        // DERNIER CAPTEUR ?
                        if (this._inst.capteur_place.capteursRestant.length == 0) {
                            swal(Lang.get('administration_parking.carte.swal_capteur_bus_finie'));

                            retourTrigger = {
                                type: mapOptions.type_messages.hide_infos,
                                data: infos
                            };
                            this.trigger(retourTrigger);
                            this._inst.mapInst.placesGroup.off('click', this.onPlaceCapteurClick, this);
                        }

                    }
                    // ERREURS
                    else if (retour.doublon) {
                        // Petite notif venant de PHP
                        Actions.notif.error(Lang.get('administration_parking.carte.place_deja_affectee'));
                    } else {
                        // Erreur de BDD
                        Actions.notif.error();
                    }
                })
                .fail(function (xhr, type, exception) {
                    //TODO if ajax fails display error alert
                    console.error("ajax error response error " + type);
                    console.error("ajax error response body " + xhr.responseText);
                });
        }
        // PLACE AFFECTÉE
        else {
            // Petite notif selon vérif JS
            Actions.notif.error(Lang.get('administration_parking.carte.place_deja_affectee'));
        }
    },

    /**
     * Event listener sur click d'une place quand on est en mode capteur virtuel.
     * #- Récupère la place cliquée
     * #- Test si place libre en JS
     * #- Crée le capteur à insérer
     * #- Met le capteur à insérer dans la liste
     *
     * @param evt : evt click sur place leaflet
     */
    onPlaceCapteurVirtuelClick: function (evt) {
        // RÉCUPÉRATION PLACE CLIQUÉE
        var place = _.cloneDeep(evt.layer.options.data);

        // PLACE NON AFFECTÉE
        if (place.capteur_id == null && this._inst.capteur_place_virtuel.nb_restant > 0) {
            // CRÉATION DU CAPTEUR
            var capteur = {
                bus: this._inst.capteur_place_virtuel.bus,
                place_id: place.id,
                bus_id: this._inst.capteur_place_virtuel.bus_id,
                num_noeud: this._inst.capteur_place_virtuel.last_noeud + 1,
                adresse: this._inst.capteur_place_virtuel.last_adresse + 1,
                leg: this._inst.capteur_place_virtuel.leg_num,
                software_version: '',
                v4_id: 0
            };

            this._inst.capteur_place_virtuel.capteurs_a_envoyer.push(capteur);

            // INCRÉMENT DU LAST NOEUD
            this._inst.capteur_place_virtuel.last_noeud++;
            this._inst.capteur_place_virtuel.last_adresse++;
            this._inst.capteur_place_virtuel.nb_restant--;

            // MODIFICATION MESSAGE INFOS
            var infos = mapHelper.generateInfosCapteurPlaceVirtuel(
                this._inst.capteur_place_virtuel.concentrateur.v4_id,
                this._inst.capteur_place_virtuel.bus.num,
                this._inst.capteur_place_virtuel.last_adresse,
                this._inst.capteur_place_virtuel.nb_restant
            );

            var retourTrigger = {
                type: mapOptions.type_messages.update_infos,
                data: infos
            };
            this.trigger(retourTrigger);

            // SUPPRESSION PLACE MAP
            var retourTrigger = {
                type: mapOptions.type_messages.delete_place,
                data: {
                    place_id: place.id
                }
            };
            this.trigger(retourTrigger);

            // REMETTRE LA PLACE AVEC UN CAPTEUR ID POUR ÉVITER DE RÉASSOCIER
            var newPlace = place;
            newPlace.capteur_id = 0;
            newPlace.capteur = capteur;
            retourTrigger = {
                type: mapOptions.type_messages.add_places,
                data: this.createPlacesMapFromPlacesBDD([newPlace])
            };
            this.trigger(retourTrigger);
        } else {

        }
    },

    /**
     * Arrête l'affectation:
     * - Supprime les events listeners sur les places
     * - Vide les données du store en rapport avec l'affectation
     */
    onStop_affectation_capteurs: function () {

        // MISE À JOUR DU MESSAGE D'INFO
        var retour = {
            type: mapOptions.type_messages.hide_infos,
            data: {}
        };
        this.trigger(retour);

        // DÉTACHEMENT DES ÉVÈNEMENTS SUR LES PLACES
        this._inst.mapInst.placesGroup.off('click', this.onPlaceCapteurClick, this);
    },
    /**
     * Arrête l'affectation:
     * - Supprime les events listeners sur les places
     * - Vide les données du store en rapport avec l'affectation
     */
    onStop_affectation_capteurs_virtuels: function () {
        // DÉTACHEMENT DES ÉVÈNEMENTS SUR LES PLACES
        this._inst.mapInst.placesGroup.off('click', this.onPlaceCapteurVirtuelClick, this);

        var fData = formDataHelper('', 'POST');
        fData.append('capteurs', JSON.stringify(this._inst.capteur_place_virtuel.capteurs_a_envoyer));
        fData.append('configs_ids', JSON.stringify(this._inst.capteur_place_virtuel.configs_ids));

        $.ajax({
            type: 'POST',
            url: BASE_URI + 'parking/capteur/create_virtuels',
            processData: false,
            contentType: false,
            dataType: 'json',
            context: this,
            data: fData
        })
            .done(function (data) {
                if (data) {
                    this.resetLocalState();
                    Actions.notif.success();
                    var retourTrigger = {
                        type: mapOptions.type_messages.hide_infos,
                        data: ''
                    };
                    this.trigger(retourTrigger);

                    retourTrigger = {
                        type: mapOptions.type_messages.set_id_capteur_virtuel,
                        data: ''
                    };
                    this.trigger(retourTrigger);
                } else {
                    Actions.notif.error();
                }
            })
            .fail(function (xhr, type, exception) {
                // if ajax fails display error alert
                console.error("ajax error response error " + type);
                console.error("ajax error response body " + xhr.responseText);
            });
    },

    cancel_affectation_capteurs_virtuels: function () {

        // SUPPRESSION DES CAPTEURS VIRTUELS PAS ENCORE EN BDD
        var retourTrigger = {
            type: mapOptions.type_messages.annuler_capteur_virtuel,
            data: ''
        };
        this.trigger(retourTrigger);

        // MASQUAGE DES INFOS EN BAS DE PAGE
        retourTrigger = {
            type: mapOptions.type_messages.hide_infos,
            data: ''
        };
        this.trigger(retourTrigger);
        this.resetLocalState();
    },

    /**
     * Lance la suppression des capteurs à partir de celui apssé en paramètre
     */
    onDelete_capteur_virtuel_bdd: function (capteur) {

        var fData = new formDataHelper('', 'DELETE');
        $.ajax({
            type: 'POST',
            url: BASE_URI + 'parking/capteur/delete/' + capteur.bus_id + '/' + capteur.leg + '/' + capteur.num_noeud,
            processData: false,
            contentType: false,
            dataType: 'json',
            context: this,
            data: fData
        })
            .done(function (data) {
                console.log('Data suppression : %o', data);
                // Suppression carte si OK
                if (data) {
                    Actions.notif.success();

                    // SUPPRESSION DES CAPTEURS VIRTUELS PAS ENCORE EN BDD
                    var retourTrigger = {
                        type: mapOptions.type_messages.delete_capteur_from_num,
                        data: {
                            bus_id: capteur.bus_id,
                            leg: capteur.leg,
                            num_noeud: capteur.num_noeud
                        }
                    };
                    this.trigger(retourTrigger);
                }
            })
            .fail(function (xhr, type, exception) {
                // if ajax fails display error alert
                console.error("ajax error response error " + type);
                console.error("ajax error response body " + xhr.responseText);
            });
    },

    /**
     * ---------------------------------------------------------------------------
     * UTILITAIRES DIVERSES ------------------------------------------------------
     * ---------------------------------------------------------------------------
     */

    /**
     * Les data correspondent au layer créé par le plugin.
     * Le premier test consiste à vérifier qu'on ait 3 points.
     * @param data : le Layer créé par le plugin de map
     */
    createParallelogramme: function (data) {

        if (data.e.layer._latlngs.length != 3) {
            swal(Lang.get('administration_parking.carte.3_points_seulement'));
            return {};
        } else {
            var lastPoint = mapHelper.getLastPointOfParallelogramme(data.e.layer._latlngs);
            data.e.layer._latlngs.push(lastPoint);
            return data;
        }

    },

    /**
     * Vérifie le dessin pour le calibre:
     * Deux points exactement
     * @param data
     * @returns {L.Polyline._latlngs|*|L.Polygon._latlngs}
     */
    checkCalibre: function (data) {
        var coords = data.e.layer._latlngs;

        if (coords.length != 2) {
            swal(Lang.get('administration_parking.carte.swal_calibre_points_ko'));
            coords = {};
        }
        return coords;
    },

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
                this._inst.parkingInfos.init_mode = data.init_mode;
                this._inst.parkingInfos.last_aff_update = moment(data.last_aff_update).utc();
                this._inst.parkingInfos.last_synchro_ok = moment(data.last_synchro_ok).utc();
                this._inst.parkingInfos.up_to_date = this._inst.parkingInfos.last_synchro_ok.isAfter(this._inst.parkingInfos.last_aff_update);

                // DÉCLENCHEMENT DE LA NOTIF SI BESOIN
                this._inst.parkingInfos.up_to_date ? null : this.trigger_notif_synchro();
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
                this._inst.calibre = data.calibre;

                if (parseFloat(data.calibre) == 0) {
                    this.swalCalibre();
                }

                map.setZoom(data.zoom_level);

                // Extraction des sous éléments du niveau
                var plan = data;
                var zones = [];
                var allees = [];
                var places = [];
                // RÉCUPÉRATION DES ZONES
                Array.prototype.push.apply(zones, plan.zones);

                // RÉCUPÉRATION DES JSON ZONES ET DES ALLÉES
                zones = _.map(zones, function (z) {

                    Array.prototype.push.apply(allees, z.allees);
                    // RÉCUPÉRATION ZONE PAR DÉFAUT
                    if (z.defaut == "1") {
                        this._inst.defaults.zone = z;
                        // RÉCUPÉRATION ALLÉE PAR DÉFAUT
                        _.map(z.allees, function (a) {
                            a.defaut == "1" ? this._inst.defaults.allee = a : '';
                        }, this);
                    }
                    // RÉCUPÉRATION ALLEE PAR DÉFAUT DE CETTE ZONE
                    _.map(z.allees, function (a) {
                        return a.defaut == "1" ? z.alleeDefault = a : '';
                    }, this);

                    return z;
                }, this);

                // RÉCUPÉRATION DES JSON ALLÉES ET DES PLACES
                _.each(allees, function (a) {
                    Array.prototype.push.apply(places, a.places);
                }, this);

                this._inst.places = places;
                this._inst.allees = allees;
                this._inst.zones = zones;
                this._inst.afficheurs = data.afficheurs;
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
                            this._inst.defaults.etat_occupation = _.reduce(d.etats_occupations, function (sum, e) {
                                if (e.is_occupe == '0') {
                                    return e;
                                } else {
                                    return sum;
                                }
                            });
                            return true;
                        }
                        return false;
                    }, this);
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
        // SETUP CALIBRE -----------------------------------------------------------------------
        message = {
            type: mapOptions.type_messages.set_calibre,
            data: this._inst.calibre
        };
        this.trigger(message);

        // SETUP INIT_MODE -----------------------------------------------------------------------
        message = {
            type: mapOptions.type_messages.set_init_mode,
            data: this._inst.parkingInfos.init_mode
        };
        this.trigger(message);

        // LES PLACES À AFFICHER SUR LA MAP ----------------------------------------------------
        var placesMap = this.createPlacesMapFromPlacesBDD(this._inst.places);

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
        var afficheursMap = afficheurHelper.createAfficheursMapFromAfficheursBDD(this._inst.afficheurs);

        message = {
            type: mapOptions.type_messages.add_afficheurs,
            data: afficheursMap
        };
        this.trigger(message);

    },

    /**
     * Lance la connexion au WS avec l'id du parking
     * @param parkingId
     */
    connectWs: function (parkingId) {
        comHelper.client.initWebSocket(parkingId);
    },

    /**
     * Crée les places à afficher sur la map en fonction d'un tableau de places venant directement de la BDD
     *
     * @param placesBDD : objet de type place sorti d'Eloquent.
     * @returns : tableau de places prêt pour le trigger vers la map
     */
    createPlacesMapFromPlacesBDD: function (placesBDD) {
        return _.map(placesBDD, function (p) {
            var coords = {lat: p.lat, lng: p.lng};
            var nom = p.libelle;
            var angleMarker = p.angle;
            var extraData = p;
            var color = _.reduce(this._inst.types_places, function (sum, n) {
                if (n.id == p.type_place_id) {
                    return n.couleur;
                } else {
                    return sum;
                }
            }, "FF0000", this);

            var marker = placeHelper.createPlaceMarker(coords, nom, angleMarker, extraData);

            // PARALLÉLOGRAMME
            var polygon = placeHelper.createPlaceParallelogrammeFromCoordinates(JSON.parse(p.geojson), extraData, nom, color);

            return {
                data: p,
                polygon: polygon,
                marker: marker
            };
        }, this);
    },

    /**
     * Affiche un afficheur sur la carte
     */
    onAfficheur_created: function (afficheur) {
        var afficheursMap = afficheurHelper.createAfficheursMapFromAfficheursBDD([afficheur]);

        var message = {
            type: mapOptions.type_messages.add_afficheurs,
            data: afficheursMap
        };
        this.trigger(message);
    },

    /**
     * Prévient l'utilisateur que le plan qu'il visualise n'est pas calibré.
     */
    swalCalibre: function () {
        swal({
            title: Lang.get('administration_parking.carte.swal_calibre_non_init_titre'),
            text: Lang.get('administration_parking.carte.swal_calibre_non_init'),
            html: true
        });
    },

    /**
     * Masque la modale active
     */
    onHide_modale: function () {
        var retour = {
            type: mapOptions.type_messages.hide_modal,
            data: {}
        };
        this.trigger(retour);
    },
    /**
     * Lance l'affichage de la notification pour commencer la synchro
     */
    trigger_notif_synchro: function () {
        // startSynchroDisplay
        if (this._inst.parkingInfos.init_mode != '0') {
            var retour = {
                type: mapOptions.type_messages.synchro_notif,
                data: {}
            };
            this.trigger(retour);
        }
    },

    /**
     * Affiche la boite de confirmation pour changer de mode alors qu'une édition est en cours.
     * @return {*}
     */
    canSwitchMode: function () {
        if (this._inst.is_editing) {
            return confirm(Lang.get('administration_parking.carte.confirm_edit_stop'));
        }
        else {
            return true;
        }
    }
});

module.exports = store;
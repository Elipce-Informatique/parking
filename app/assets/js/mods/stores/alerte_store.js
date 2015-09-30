var _ = require('lodash');
require('sweetalert');

var mapOptions = require('../helpers/map_options');
var mapHelper = require('../helpers/map_helper');
var alerteHelper = require('../helpers/alerte_helper');
var zoneHelper = require('../helpers/zone_helper');
var alleeHelper = require('../helpers/allee_helper');
var placeHelper = require('../helpers/place_helper');
var formDataHelper = require('../helpers/form_data_helper');

/**
 *
 * Store permettant la gestion de toutes les actions liées à une carte.
 *
 *
 * @param object parkingInfos: infos sur le parking sur lequel on travaille
 * @param string currentMode: Mode de dessin actuel (alerte_full|alerte_change|reservation)
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
        capteur_place: {
            concentrateur: {},  // Concentrateur concerné
            bus: {},            // Bus concerné
            capteurInit: {},    // Capteur initial pour l'affectation
            capteursTotaux: [], // Liste des capteurs totaux à affecter
            capteursRestant: [] // Liste des capteurs restant à affecter sur le bus
        },
        types_places: [], // Types de places de la BDD
        currentMode: mapOptions.dessin.place,
        places: [], // Places avec data base de données
        allees: [], // Allées avec data base de donées
        zones: [],  // Zones avec data base de données
        afficheurs: [],
        lastDraw: {},
        lastParallelogramme: {},
        lastCalibre: {},
        mapInst: {},
        alertes: [],
        reservation: []
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
     * @param parkingInfos : object avec deux clés parkingId et planId
     */
    onMap_initialized: function (map, calibre, parkingInfos, mapInst) {

        // Récupération de l'instance de la map
        this._inst.mapInst = mapInst;

        // Récupération en BDD des données du parking sélectionné
        var p1 = this.recupInfosParking(map, calibre, parkingInfos);

        // Récupération en BDD des données du niveau sélectionné (zones, allées, places)
        var p2 = this.recupInfosPlan(map, calibre, parkingInfos);

        // Récupération en BDD des données de types de places
        var p3 = this.recupInfosTypesPlaces();

        // Récupération alertes "full"
        var p4 = this.recupAlertes(parkingInfos.planId);

        $.when(p1, p2, p3, p4).done(function () {
            // Affichage des places du niveau
            this.affichageDataInitial();
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
        console.log('Darw created %o', data);
        this._inst.lastDraw = data;


        switch (this._inst.currentMode) {
            // -------------------------------------------------------------
            // Alerte full
            case mapOptions.dessin.alerte_full:
                var retour = {
                    type: mapOptions.type_messages.alerte_full,
                    data: data
                };
                this.trigger(retour);

                break;
            // -------------------------------------------------------------
            // Alerte change
            case mapOptions.dessin.alerte_change:
                // Création parallèlogramme
                var donnee = this.createParallelogramme(data);

                // LE PARALLÉLOGRAMME N'A PAS ÉTÉ CONSTRUIT (PAS LE BON NOMBRE DE POINTS PROBABLEMENT)
                if (!_.isEmpty(donnee)) {
                    // on garde le parallélogramme dans le store pour le retour de la popup
                    this._inst.lastParallelogramme = donnee;
                    var retour = {
                        type: mapOptions.type_messages.alerte_change,
                        data: donnee
                    };
                    this.trigger(retour);
                }
                break;
            // -------------------------------------------------------------
            // Réservation
            case mapOptions.dessin.reservation:
                var zones, allees;
                zones = mapHelper.getPolygonsArrayFromLeafletLayerGroup(this._inst.mapInst.zonesGroup);
                allees = mapHelper.getPolygonsArrayFromLeafletLayerGroup(this._inst.mapInst.alleesGroup);

                var geometryOk = alerteHelper.geometryCheck(data.e.layer._latlngs, zones, allees);

                // Géométrie OK ouverture de la POPUP
                if (geometryOk) {
                    var retour = {
                        type: mapOptions.type_messages.reservation,
                        data: data
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
        console.log('Pass onDraw_edited %o', data);
    },
    // SUPPRESSION D'UN DESSIN
    onDraw_deleted: function (data) {
        console.log('Pass onDraw_deleted %o', data);
        var deletedEntities = _.values(data.e.layers._layers);
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
                // pas encore pris en compte
                break;
            // -------------------------------------------------------------
            // SINON, ON AJOUTE SIMPLEMENT LA FORME À LA MAP
            default:
                //
                break;
        }
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
    onMode_alerte_full: function (data) {
        this._inst.currentMode = mapOptions.dessin.alerte_full;

        var retour = {
            type: mapOptions.type_messages.mode_change,
            data: {
                mode: mapOptions.dessin.alerte_full
            }
        };
        this.trigger(retour);
    },
    onMode_alerte_change: function (data) {
        this._inst.currentMode = mapOptions.dessin.alerte_change;

        var retour = {
            type: mapOptions.type_messages.mode_change,
            data: {
                mode: mapOptions.dessin.alerte_change
            }
        };
        this.trigger(retour);
    },
    onMode_reservation: function (data) {
        this._inst.currentMode = mapOptions.dessin.reservation;

        var retour = {
            type: mapOptions.type_messages.mode_change,
            data: {
                mode: mapOptions.dessin.reservation
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

        // SÉLECTION DU FORMULAIRE POUR TRAITER L'ACTION
        switch (formId) {
            case "form_alerte_full":
                this.handleFull(formDom, this._inst.lastDraw);
                break;
            case "form_alerte_change":
                this.handleChange(formDom, this._inst.lastDraw);
                break;
            case "form_reservation":
                this.handleReservation(formDom, this._inst.lastDraw);
                break;
            default:
                break;
        }
    },

    /**
     * Création d'une alerte de type "full"
     * @param formDom: Objet DOM du formulaire
     * @param zone: zone géométrique dessinée par le user
     */
    handleFull: function (formDom, zone) {
        alerteHelper.createAlerteFull(formDom, zone, this._inst, function (tab) {
            // Sauvegarde OK
            if (tab.save) {
                // Notification
                Actions.notif.success(Lang.get('global.notif_success'));

                tab.places.forEach(function (place) {

                    // Ajout des markers
                    var marker = L.marker([place.lat, place.lng], {
                        icon: new mapOptions.markerFull(),
                        data: place
                    }).bindLabel(
                        tab.model.description
                    );
                    this._inst.mapInst.alerteFullGroup.addLayer(marker);

                }, this);

                // Fermeture modal
                this.trigger({'type': mapOptions.type_messages.hide_modal});
            }
            // Erreur SQL
            else {
                Actions.notif.error(Lang.get('global.notif_erreur'));
            }
        }.bind(this));
    },

    /**
     * Gère l'insertion en BDD de l'allée avec le formulaire de la modale et la forme dessinée
     * @param formDom
     * @param allee
     */
    handleChange: function (formDom, allee) {
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


    /*************************************************************************
     * *********************************UTILITAIRES*************************
     * **********************************************************************/

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
                this._inst.afficheurs = [];
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
     * Requête AJAX pour récupérer les alertes
     */
    recupAlertes: function (planId) {
        return $.ajax({
            url: 'parking/alerte/all/'+planId,
            context: this,
            success: function (data) {
                // Les alertes
                this._inst.alertes = data;
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

        //console.log('alertes %o',this._inst.alertes);
        // LES ALERTES
        if (this._inst.alertes.length > 0) {
            // Parcours des types d'alertes
            this._inst.alertes.forEach(function (typeAlerte) {
                switch (typeAlerte.code) {
                    case 'full':
                        // On a des alertes de type "full"
                        if (typeAlerte.alertes.length > 0) {
                            var marker;
                            var markers = [];
                            // Parcours des alertes de type "full"
                            typeAlerte.alertes.forEach(function (full) {
                                // Il y a des places associées à cette alerte
                                if (full.places.length > 0) {
                                    // Parcours des places
                                    markers = _.union(markers, _.map(full.places, function (place) {
                                        // Création du marker
                                        marker = L.marker([place.lat, place.lng], {
                                            icon: new mapOptions.markerFull(),
                                            data: place
                                        }).bindLabel(
                                           full.description
                                        );
                                        return marker;

                                    }.bind(this)));
                                }
                            }, this);
                            // Envoie des données à la map
                            message = {
                                type: mapOptions.type_messages.add_alertes_full,
                                data: markers
                            };
                            //console.log('message %o', message);
                            this.trigger(message);
                        }

                        break;
                    case 'change':

                        break;
                    default:
                        break;
                }
            }, this);
        }

        // Par défaut sur alerte "full"
        message = {
            type: mapOptions.type_messages.mode_change,
            data: {
                mode: mapOptions.dessin.alerte_full
            }
        };
        this.trigger(message);
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
    }

});

module.exports = store;
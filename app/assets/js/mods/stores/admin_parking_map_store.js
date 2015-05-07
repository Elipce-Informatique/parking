var _ = require('lodash');
require('sweetalert');

var mapOptions = require('../helpers/map_options');
var mapHelper = require('../helpers/map_helper');
var zoneHelper = require('../helpers/zone_helper');
var alleeHelper = require('../helpers/allee_helper');
var placeHelper = require('../helpers/place_helper');
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
        types_places: [], // Types de places de la BDD
        currentMode: mapOptions.dessin.place,
        places: [], // Places avec data base de données
        allees: [], // Allées avec data base de donées
        zones: [],  // Zones avec data base de données
        afficheurs: [],
        lastDraw: {},
        lastParallelogramme: {},
        lastCalibre: {},
        mapInst: {}
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
            this.affichagePlacesInitial();
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
            // CALCUL DU CALIBRE ET SUPPRESSION DE LA FORME
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
                console.log('Géométrie ok = %o', geometryOk);

                // TODO : On ajoute à la carte juste pour test
                if (geometryOk) {
                    var retour = {
                        type: mapOptions.type_messages.new_zone,
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
    onDraw_deleted: function (data) {
        //console.log('Pass onDraw_created %o', data);
    },
    onDraw_drawstart: function (data) {
        //console.log('Pass onDraw_drawstart %o', data);
    },
    onDraw_drawstop: function (data) {
        //console.log('Pass onDraw_drawstop %o', data);
    },
    // A VOIR COMMENT RECUP LES DESSINS
    onDraw_editstart: function (data) {
        //console.log('Pass onDraw_editstart %o', data);
    },
    onDraw_editstop: function (data) {
        //console.log('Pass onDraw_editstop %o', data);
    },
    onDraw_deletestart: function (data) {
        //console.log('Pass onDraw_deletestart %o', data);
    },
    onDraw_deletestop: function (data) {
        //console.log('Pass onDraw_deletestop %o', data);
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
    onMode_calibre: function (d) {
        this._inst.currentMode = mapOptions.dessin.calibre;

        var retour = {
            type: mapOptions.type_messages.mode_change,
            data: {
                mode: mapOptions.dessin.calibre
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
            case "form_mod_places_multiples":
                this.handlePlacesMultiples(formDom, this._inst.lastParallelogramme.e.layer._latlngs);
                break;
            case "form_mod_calibre":
                this.handleCalibre(formDom, this._inst.lastCalibre.e.layer._latlngs);
                break;
            case "form_mod_zone":
                this.handleZone(formDom, this._inst.lastDraw);
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
                this._inst.defaults.etat_occupation
            );

            // CRÉATION DU TABLEAU DE DONNÉES À ENREGISTRER
            var dataPlaces = _.map(places, function (p) {
                var json = p.polygon.toGeoJSON();
                return _.extend(p.data, {
                    geoJson: JSON.stringify(json)
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
                    if (data.retour) {
                        // SAUVEGARDE DES PLACES EN LOCAL DNAS LE STORE
                        this._inst.places = this._inst.places.concat(places);

                        // ENVOI DES INFOS À AFFICHER SUR LA CARTE
                        var retour = {
                            type: mapOptions.type_messages.add_places,
                            data: places
                        };
                        this.trigger(retour);
                        Actions.notif.success();
                    } else {
                        Actions.notif.error(Lang.get('administration_parking.carte.insert_places_fail'));
                    }
                },
                error: function (xhr, type, exception) {
                    // if ajax fails display error alert
                    alert("ajax error response error " + type);
                    alert("ajax error response body " + xhr.responseText);
                }
            });
            // --------------------------------------------------------------------------
        } else {
            // NOMBRE DE POTEAUX INCORRECT
            swal(Lang.get('administration_parking.carte.swal_interval_incorrect'));
        }
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
                    var retour = {
                        type: mapOptions.type_messages.hide_modal,
                        data: {}
                    };
                    this.trigger(retour);
                } else {
                    Actions.notif.error(Lang.get('administration_parking.carte.calibre_update_fail'));
                }
            })
            .fail(function (xhr, type, exception) {
                // if ajax fails display error alert
                alert("ajax error response error " + type);
                alert("ajax error response body " + xhr.responseText);
            });

    },

    /**
     * Gère l'insertion en BDD de la zone avec le formulaire de la modale et la forme dessinée
     * @param formDom
     * @param zone
     */
    handleZone: function (formDom, zone) {
        zoneHelper.createZone(formDom, zone, this._inst);
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

                // Extraction des sous éléments du niveau
                var plan = data;
                var zones = [];
                var jsonZones = [];
                var allees = [];
                var jsonAllees = [];
                var places = [];
                var jsonPlaces = [];
                // RÉCUPÉRATION DES ZONES
                Array.prototype.push.apply(zones, plan.zones);

                // RÉCUPÉRATION DES JSON ZONES ET DES ALLÉES
                _.each(zones, function (z) {
                    jsonZones.push(z.geojson);
                    Array.prototype.push.apply(allees, z.allees);
                    // RÉCUPÉRATION ZONE PAR DÉFAUT
                    z.defaut == "1" ? this._inst.defaults.zone = z : '';
                }, this);

                // RÉCUPÉRATION DES JSON ALLÉES ET DES PLACES
                _.each(allees, function (a) {
                    jsonAllees.push(a.geojson);
                    Array.prototype.push.apply(places, a.places);

                    // RÉCUPÉRATION ALLÉE PAR DÉFAUT
                    a.defaut == "1" ? this._inst.defaults.allee = a : '';
                }, this);

                // RÉCUPÉRATION DES JSON ALLÉES ET DES PLACES
                _.each(places, function (p) {
                    jsonPlaces.push(p.geojson);
                }, this);

                this._inst.places = places;
                this._inst.allees = allees;
                this._inst.zones = zones;
                this._inst.afficheurs = []; // TODO récupérer les afficheurs

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
                alert("ajax error response error " + type);
                alert("ajax error response body " + xhr.responseText);
            }
        });
    },

    /**
     * Fonction appellée lors de l'init, on a déjà toutes les données dans _inst
     */
    affichagePlacesInitial: function () {
        var placesMap = _.map(this._inst.places, function (p) {
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
            var polygon = placeHelper.createPlaceParallelogrammeFromGeoJson(p.geojson, extraData, nom, color);

            return {
                data: p,
                polygon: polygon,
                marker: marker
            };
        }, this);

        var message = {
            type: mapOptions.type_messages.add_places,
            data: placesMap
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
    }
});

module.exports = store;
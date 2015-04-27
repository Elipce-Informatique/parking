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
        niveauInfos: {
            id: 0,
            libelle: '',
            description: '',
            plan: '',
            parking_id: 0,
            etat_general_id: 0
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

        // Récupération du calibre
        this._inst.calibre = calibre;

        // Récupération en BDD des données du parking sélectionné
        var p1 = this.recupInfosParking(map, calibre, parkingInfos);

        // Récupération en BDD des données du niveau sélectionné (zones, allées, places)
        var p2 = this.recupInfosNiveau(map, calibre, parkingInfos)

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
            console.log('Tableau de places à enregistrer: %o', dataPlaces);

            // --------------------------------------------------------------------------

            // FORMATAGE DES DONNÉES POUR L'ENVOI
            var fData = formDataHelper('', 'POST');
            fData.append('places', JSON.stringify(dataPlaces));

            // ENREGISTREMENT AJAX DES PLACES
            $.ajax({
                type: 'POST',
                url: 'parking/place',
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
    recupInfosNiveau: function (map, calibre, parkingInfos) {
        return $.ajax({
            method: 'GET',
            url: BASE_URI + 'parking/niveau/' + parkingInfos.planId,
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
                this._inst.afficheurs = []; // TODO récupérer les afficheurs

                // ---------------------------------------------------------------------

                console.log('this._inst a la fin des récupérations AJAX : %o', this._inst);
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
                console.log('Retour des TYPES PLACES : %o', data);
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
        console.log('Pass affichage places init : %o', _.clone(this._inst));
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

            var marker = mapHelper.createPlaceMarker(coords, nom, angleMarker, extraData);
            var polygon = mapHelper.createPlaceParallelogrammeFromGeoJson(p.geojson, extraData, nom, color);

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

    }
});

module.exports = store;
var React = require('react/addons');
var mapOptions = require('../../helpers/map_options');
// STORE DE LA CARTE
var mapStore = require('../../stores/admin_parking_map_store');
var mapHelper = require('../../helpers/map_helper');

// COMPOSANTS
var ModalPlaces = require('../modals/mod_places_multiples');
var ModalCalibre = require('../modals/mod_calibre');
var ModalZone = require('../modals/mod_zone');
var ModalAllee = require('../modals/mod_allee');
var ModalCapteur = require('../modals/mod_capteur');
var ModalAfficheur = require('../modals/mod_afficheur');
var ModalEditPlace = require('../modals/mod_edit_place');
var Field = require('../formulaire/react_form_fields');
var InputTextEditable = Field.InputTextEditable;
var InputNumberEditable = Field.InputNumberEditable;
var Modal = ReactB.Modal;
var Button = ReactB.Button;


// UTILITAIRES


/**
 * Created by yann on 27/01/2015.
 * Composant pour créer une carte de parking en mode administration outils de dessins.
 * @param defaultDrawMode : mapOptions.dessin.xxxx
 * @param calibre : nombre de cm/deg sur cette carte
 */
var parkingMap = React.createClass({
    displayName: 'admin_parking_map',

    mixins: [Reflux.ListenerMixin, ReactB.OverlayMixin],
    /**
     * Définition du type des props du composant.
     */
    propTypes: {
        divId: React.PropTypes.string.isRequired,
        imgUrl: React.PropTypes.string.isRequired,
        parkingId: React.PropTypes.number.isRequired,
        planId: React.PropTypes.number.isRequired,
        mapHeight: React.PropTypes.number,
        defaultDrawMode: React.PropTypes.number,
        calibre: React.PropTypes.number
    },
    /**
     * Variables d'instance du composant.
     * Utilisées pour intéragir avec la carte.
     */
    _inst: {},
    initInst: function () {
        this._inst = {
            map: {},                              // Instance de la carte leaflet
            currentMode: mapOptions.dessin.place, // Mode de dessin actuel
            lastNum: 0,
            placesGroup: {},                      // Layer group contenant toutes les places
            placesMarkersGroup: {},               // Layer group contenant tout les markers des places
            alleesGroup: {},                      // Layer group contenant toutes les allées
            zonesGroup: {},                       // Layer group contenant toutes les zones
            afficheursGroup: {},                  // Layer group contenant tous les afficheurs
            calibreGroup: {},                     // Juste pour l'init du calibre
            drawControl: {},                      // Barre d'outils de dessin active sur la carte
            infosControl: undefined,              // Cadre d'informations en bas à droite de la carte
            calibre: 0

        };
    },

    getDefaultProps: function () {
        return {
            defaultDrawMode: mapOptions.dessin.place,
            mapHeight: 300,
            calibre: 0,
            module_url: 'parking'
        };
    },

    getInitialState: function () {
        return {
            currentDrawGroup: mapOptions.control.groups[this._inst.currentMode],
            isModalOpen: false,
            modalParams: {}
        };
    },

    /**
     * Application de la carte sur le div avec les paramètres
     */
    componentDidMount: function () {
        this.initInst();
        this.initMap();
        this.initDrawPlugin();
        this.initCustomButtons();

        this.listenTo(mapStore, this.onStoreTrigger);
    },

    /**
     * Le composant ne sera jamais mis à jour
     * On ne veut pas écraser la map a chaque mise à jour, juste la modifier avec ses méthodes
     */
    shouldComponentUpdate: function (nextProps, nextState) {
        return true;
    },

    /**
     * Clear la map avant de supprimer le node
     */
    componentWillUnmount: function () {
        this._inst.map.remove();
        this.initInst();
    },


    /**
     * ------------------------------------------
     * INITIALISATION DE LA CARTE ---------------
     * ------------------------------------------
     * Avec l'image passée en paramètres et des coordonnées
     * carrées allant de 0 à 100 en lon et en lat
     */
    initMap: function () {
        var origine = [-250, -250];
        var haut_droit = [250, 250];

        // CRÉATION DE LA MAP
        this._inst.map = new L.Map(this.props.divId, {
            crs: mapHelper.customZoomCRS,
            maxZoom: 12,
            contextmenu: true
        }).setView([0, 0], 0);

        // AJOUT DE L'IMAGE DE FOND
        L.imageOverlay(this.props.imgUrl, [origine, haut_droit]).addTo(this._inst.map);

        // Transmission des données du parking au store:
        var parkingData = {
            parkingId: this.props.parkingId,
            planId: this.props.planId
        };
        // INIT des layers
        this._inst.placesMarkersGroup = new L.LayerGroup();
        this._inst.map.addLayer(this._inst.placesMarkersGroup);
        this._inst.placesGroup = new L.FeatureGroup();
        this._inst.map.addLayer(this._inst.placesGroup);
        this._inst.alleesGroup = new L.FeatureGroup();
        this._inst.map.addLayer(this._inst.alleesGroup);
        this._inst.zonesGroup = new L.FeatureGroup();
        this._inst.map.addLayer(this._inst.zonesGroup);
        this._inst.afficheursGroup = new L.FeatureGroup();
        this._inst.map.addLayer(this._inst.afficheursGroup);
        this._inst.calibreGroup = new L.FeatureGroup();
        this._inst.map.addLayer(this._inst.calibreGroup);

        // INIT EVENTS LAERS
        this._inst.placesGroup.on('layeradd', Actions.map.feature_place_add);
        this._inst.alleesGroup.on('layeradd', Actions.map.feature_allee_add);
        this._inst.zonesGroup.on('layeradd', Actions.map.feature_zone_add);
        this._inst.afficheursGroup.on('layeradd', Actions.map.feature_afficheur_add);

        Actions.map.map_initialized(this._inst.map, this.props.calibre, parkingData, this._inst);
    },
    /**
     * Paramètre le plugin de dessin sur la carte lors de l'INIT de la map
     */
    initDrawPlugin: function () {
        this.changeDrawToolbar(this.props.defaultDrawMode);

        /**
         * ÉVÈNEMENTS LIÉS AU PLUGIN
         */
            // QUAND UNE FORME EST CRÉÉE
        this._inst.map.on('draw:created', function (e) {
            var data = {e: {}};
            data.e = e;
            Actions.map.draw_created(data);
        });
        // QUAND UNE FORME EST SUPPRIMÉE
        this._inst.map.on('draw:deleted', function (e) {
            var data = {e: {}};
            data.e = e;
            Actions.map.draw_deleted(data);
        });
        // QUAND LE DESSIN COMMENCE
        this._inst.map.on('draw:drawstart', function (e) {
            var data = {e: {}};
            data.e = e;
            Actions.map.draw_drawstart(data);
        });
        // QUAND LE DESSIN S'ARRÊTE
        this._inst.map.on('draw:drawstop', function (e) {
            var data = {e: {}};
            data.e = e;
            Actions.map.draw_drawstop(data);
        });
        // QUAND L'ÉDITION S'ARRÊTE
        this._inst.map.on('draw:editstart', function (e) {
            var data = {e: {}};
            data.e = e;
            Actions.map.draw_editstart(data);
        });
        // QUAND UNE OU PLUSIEURS FORMES ONT ÉTÉ ÉDITÉES
        this._inst.map.on('draw:edited', function (e) {
            var data = {e: {}};
            data.e = e;
            Actions.map.draw_edited(data);
        });
        // QUAND L'ÉDITION EST ARRÊTÉE
        this._inst.map.on('draw:editstop', function (e) {
            var data = {e: {}};
            data.e = e;
            Actions.map.draw_editstop(data);
        });
        // QUAND LA SUPPRESSION COMMENCE
        this._inst.map.on('draw:deletestart', function (e) {
            var data = {e: {}};
            data.e = e;
            Actions.map.draw_deletestart(data);
        });
        // QUAND LA SUPPRESSION S'ARRÊTE
        this._inst.map.on('draw:deletestop', function (e) {
            var data = {e: {}};
            data.e = e;
            Actions.map.draw_deletestop(data);
        });

    },

    /**
     * Paramètre les boutons perso ajoutés à la carte
     */
    initCustomButtons: function () {

        // PLACE DE PARKING
        L.easyButton(
            mapOptions.icon.place,
            function () {
                Actions.map.mode_place();
            },
            Lang.get('administration_parking.carte.ajouter_place'),
            this._inst.map
        );

        // PLACE DE PARKING MODE AUTOMATIQUE
        L.easyButton(
            mapOptions.icon.place_auto,
            function () {
                Actions.map.mode_place_auto();
            },
            Lang.get('administration_parking.carte.ajouter_place_auto'),
            this._inst.map
        );

        // ALLÉE
        L.easyButton(
            mapOptions.icon.allee,
            function () {
                Actions.map.mode_allee();
            },
            Lang.get('administration_parking.carte.ajouter_allee'),
            this._inst.map
        );

        // ZONE
        L.easyButton(
            mapOptions.icon.zone,
            function () {
                Actions.map.mode_zone();
            },
            Lang.get('administration_parking.carte.ajouter_zone'),
            this._inst.map
        );

        // AFFICHEUR
        L.easyButton(
            mapOptions.icon.afficheur,
            function () {
                Actions.map.mode_afficheur();
            },
            Lang.get('administration_parking.carte.ajouter_afficheur'),
            this._inst.map
        );

        // CAPTEUR
        L.easyButton(
            mapOptions.icon.capteur,
            function () {
                Actions.map.mode_capteur();
            },
            Lang.get('administration_parking.carte.capteur_place'),
            this._inst.map
        );

        // CALIBRE
        L.easyButton(
            mapOptions.icon.calibre,
            function () {
                Actions.map.mode_calibre();
            },
            Lang.get('administration_parking.carte.calibrer'),
            this._inst.map
        );

        // ---------------------------------------------------------
        // LANCEMENT DE L'ACTION POUR SÉLECTIONNER LE BOUTON "PLACE":
        Actions.map.mode_place();

    },
    /**
     * Supprime et remet le drawControl pour utiliser le bon layer
     * @param mode_dessin mode de dessin ou null
     */
    changeDrawToolbar: function (mode_dessin) {
        // 1 : SUPPRIMER L'ANCIENNE TOOLBAR :
        jQuery.isEmptyObject(this._inst.drawControl) ? '' : this._inst.map.removeControl(this._inst.drawControl);

        // AUCUN DESSIN NÉCESSAIRE
        if (mode_dessin == null) {
            this._inst.drawControl = {};
        }
        // MISE EN PLACE DE LA BARRE DE DESSIN
        else if (this._inst.calibre != 0) {
            // 2 : MISE EN PLACE DU NOUVEAU MODE
            this._inst.currentMode = mode_dessin;

            // 2 CONSTRUCTION DES OPTIONS
            // ------- LES POLYLINES ----------
            var polyline = (this._inst.currentMode == mapOptions.dessin.calibre || this._inst.currentMode == mapOptions.dessin.afficheur) ? {
                shapeOptions: {
                    color: mapOptions.control.draw.colors[this._inst.currentMode]
                }
            } : false;
            // ------- LES POLYGONS ----------
            var polygon = (this._inst.currentMode == mapOptions.dessin.allee || this._inst.currentMode == mapOptions.dessin.zone || this._inst.currentMode == mapOptions.dessin.place_auto || this._inst.currentMode == mapOptions.dessin.place) ? {
                allowIntersection: false, // Restricts shapes to simple polygons
                drawError: {
                    color: '#e1e100', // Color the shape will turn when intersects
                    message: Lang.get('administration_parking.carte.erreur_polygon') // Message that will show when intersect
                },
                shapeOptions: {
                    color: mapOptions.control.draw.colors[this._inst.currentMode]
                },
                repeatMode: true
            } : false;
            // ------- LES CERCLES ----------
            var circle = false;
            // ------- LES RECTANGLES ----------
            var rectangle = (this._inst.currentMode == mapOptions.dessin.allee || this._inst.currentMode == mapOptions.dessin.zone || this._inst.currentMode == mapOptions.dessin.place) ? {
                shapeOptions: {
                    color: mapOptions.control.draw.colors[this._inst.currentMode]
                },
                repeatMode: true
            } : false;
            // ------- LES MARKERS ----------
            var marker = (this._inst.currentMode == mapOptions.dessin.afficheur) ? {
                icon: new mapOptions.afficheurMarker(),
                repeatMode: true
            } : false;

            // 3 : Init du layerGroup pour la modif
            var group = this._inst[mapOptions.control.groups[this._inst.currentMode]];


            // 3 CRÉATION DU NOUVEAU CONTRÔLE
            var options = {
                position: 'topright',
                draw: {
                    polyline: polyline,
                    polygon: polygon,
                    circle: circle,
                    rectangle: rectangle,
                    marker: marker
                },
                edit: {
                    featureGroup: group,
                    edit: (
                    this._inst.currentMode == mapOptions.dessin.place ||
                    this._inst.currentMode == mapOptions.dessin.place_auto
                    ),
                    remove: (
                    this._inst.currentMode == mapOptions.dessin.allee ||
                    this._inst.currentMode == mapOptions.dessin.zone ||
                    this._inst.currentMode == mapOptions.dessin.place_auto ||
                    this._inst.currentMode == mapOptions.dessin.place ||
                    this._inst.currentMode == mapOptions.dessin.afficheur
                    )
                }
            };


            this._inst.drawControl = new L.Control.Draw(options);
            this._inst.map.addControl(this._inst.drawControl);
        }
        // CALIBRE 0, ON N'AUTORISE QUE L'OUTIL CALIBRE !
        else {
            this._inst.currentMode = mode_dessin;
            // ------- MODE CALIBRE SEULEMENT ----------
            var polyline = this._inst.currentMode == mapOptions.dessin.calibre ? {
                shapeOptions: {
                    color: mapOptions.control.draw.colors[this._inst.currentMode]
                }
            } : false;

            var options = {
                position: 'topright',
                draw: {
                    polyline: polyline,
                    polygon: false,
                    circle: false,
                    rectangle: false,
                    marker: false
                },
                edit: false
            };

            this._inst.drawControl = new L.Control.Draw(options);
            this._inst.map.addControl(this._inst.drawControl);
        }
    },

    /**
     * Affiche le cadre d'information en bas à droite
     * avec un message par défaut (param)
     */
    showInfos: function (message) {
        // Just in case :
        this.hideInfos();

        this._inst.infosControl = L.control({
            position: 'bottomright'
        });

        this._inst.infosControl.onAdd = function (map) {
            this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
            this.update(message);
            return this._div;
        };

        // Méthode appellée lors de la mise à jour du controle
        this._inst.infosControl.update = function (message) {
            this._div.innerHTML = message != undefined ? message : '';
        };

        this._inst.infosControl.addTo(this._inst.map);
    },

    /**
     * Met à jour le contenu du block d'infos
     * @param message : Message HTML à afficher dans le div d'infos
     */
    updateInfos: function (message) {
        this._inst.infosControl.update(message);
    },

    /**
     * Masque le contenu du bloc d'info
     */
    hideInfos: function () {
        if (typeof(this._inst.infosControl) == 'object') {
            this._inst.map.removeControl(this._inst.infosControl);
        }
        this._inst.infosControl = undefined;
    },


    /**
     * Déclenché par la mise à jour des données du store
     */
    onStoreTrigger: function (data) {
        switch (data.type) {
            case mapOptions.type_messages.mode_change:
                this.onModeChange(data);
                break;
            case mapOptions.type_messages.add_forme:
                this.onFormeAdded(data);
                break;
            case mapOptions.type_messages.add_places:
                this.onPlacesAdded(data);
                break;
            case mapOptions.type_messages.add_afficheurs:
                this.onAfficheursAdded(data);
                break;
            case mapOptions.type_messages.add_zones:
                this.onZonesAdded(data);
                break;
            case mapOptions.type_messages.add_allees:
                this.onAlleesAdded(data);
                break;
            case mapOptions.type_messages.new_place_auto:
                this._onNewPlaceAuto(data);
                break;
            case mapOptions.type_messages.new_calibre:
                this._onNewCalibre(data);
                break;
            case mapOptions.type_messages.delete_forme:
                break;
            case mapOptions.type_messages.delete_place:
                this.onDeletePlace(data);
                break;
            case mapOptions.type_messages.new_zone:
                this._onNewZone(data);
                break;
            case mapOptions.type_messages.new_allee:
                this._onNewAllee(data);
                break;
            case mapOptions.type_messages.show_infos:
                this.showInfos(data.data);
                break;
            case mapOptions.type_messages.update_infos:
                this.updateInfos(data.data);
                break;
            case mapOptions.type_messages.hide_infos:
                this.hideInfos();
                break;

            case mapOptions.type_messages.hide_modal:
                this.setState({
                    isModalOpen: false
                });
                break;
            case mapOptions.type_messages.set_calibre:
                this.onSetCalibre(data);
                break;
            case mapOptions.type_messages.new_afficheur:
                this._onNewAfficheur(data);
                break;

            case mapOptions.type_messages.edit_place:
                this._onEditPlace(data.data);
                break;
            case mapOptions.type_messages.edit_allee:
                this._onEditAllee(data.data);
                break;
            case mapOptions.type_messages.edit_zone:
                this._onEditZone(data.data);
                break;
            case mapOptions.type_messages.edit_afficheur:
                this._onEditAfficheur(data.data);
                break;
            default:
                break;
        }
        this.orderLayerGroups();
    },

    /**
     * Effectue les actions nécessaires au changement du mode de dessin
     * - Sélection du bouton
     * - Changement contrôle de dessin pour changer de layer
     * @param data
     */
    onModeChange: function (data) {
        // Suppression du div d'infos si présent
        this.hideInfos();
        /**
         * Fonction locale pour sélectionner un bouton
         * @param className : classe du bouton
         */
        var selectButton = function (className) {
            $('.btn-fa-selected').removeClass('btn-fa-selected');
            $('.' + className).parent().addClass('btn-fa-selected');
        };
        // Changer la barre d'outil de dessin pour qu'elle utilise le bon layerGroup
        switch (data.data.mode) {
            case mapOptions.dessin.place:
                this.changeDrawToolbar(data.data.mode);
                selectButton(mapOptions.icon.place);
                break;
            case mapOptions.dessin.place_auto:
                this.changeDrawToolbar(data.data.mode);
                selectButton(mapOptions.icon.place_auto);
                break;
            case mapOptions.dessin.allee:
                this.changeDrawToolbar(data.data.mode);
                selectButton(mapOptions.icon.allee);
                break;
            case mapOptions.dessin.zone:
                this.changeDrawToolbar(data.data.mode);
                selectButton(mapOptions.icon.zone);
                break;
            case mapOptions.dessin.afficheur:
                this.changeDrawToolbar(data.data.mode);
                selectButton(mapOptions.icon.afficheur);
                break;
            case mapOptions.dessin.capteur:
                this.changeDrawToolbar(null);
                selectButton(mapOptions.icon.capteur);
                // TRAITEMENT CHANGEMENT MODE À LA MAIN ICI
                // CAR PAS PRIS EN COMPTE DANS changeDrawToolbar(null)
                this._inst.currentMode = mapOptions.dessin.capteur;
                this.setState({
                    modalType: mapOptions.modal_type.capteur,
                    isModalOpen: true
                });
                break;
            case mapOptions.dessin.calibre:
                this.changeDrawToolbar(data.data.mode);
                selectButton(mapOptions.icon.calibre);
                break;

            default:
                this.changeDrawToolbar(mapOptions.dessin.place);
                // PAR DÉFAUT, ON SÉLECTIONNE LE MODE PLACE AU CAS OÙ
                selectButton(mapOptions.icon.place);
                break;
        }
    },

    /**
     * Met à jour le calibre sur la map
     * Permet d'activer ou désactiver le dessin si calibre = 0
     * @param data
     */
    onSetCalibre: function (data) {
        this._inst.calibre = data.data;
        this.changeDrawToolbar(this._inst.currentMode);
    },

    /**
     * Ajoute la forme dessinnée au layer courant
     * @param data : le couple type-data envoyé par le store
     */
    onFormeAdded: function (data) {
        var layer = data.data.e.layer;
        var layerGroup = this._inst[mapOptions.control.groups[this._inst.currentMode]];
        layerGroup.addLayer(layer);
    },

    /**
     * Ajoute les PLACES
     * @param data : le couple type-data envoyé par le store
     */
    onPlacesAdded: function (formes) {
        var liste_data = formes.data;
        _.each(liste_data, function (place) {
            this._inst.lastNum = Math.max(this._inst.lastNum, place.data.num);
            this._inst.placesGroup.addLayer(place.polygon);
            // MARKER SI CAPTEUR
            if (place.data.capteur_id != null) {
                var marker = L.marker([place.data.lat, place.data.lng], {
                    icon: new mapOptions.pastilleCapteur(),
                    data: place.data
                }).bindLabel(
                    place.data.capteur.bus.concentrateur.v4_id + '.' +
                    place.data.capteur.bus.num + '.' +
                    place.data.capteur.adresse
                );
                this._inst.placesMarkersGroup.addLayer(marker);
            }
            // MARKER INVISIBLE SI PAS CAPTEUR
            else {
                var marker = L.marker([place.data.lat, place.data.lng], {
                    icon: new mapOptions.iconInvisible(),
                    data: place.data
                });
                this._inst.placesMarkersGroup.addLayer(marker);
            }
            //
        }, this);

        this.setState({
            isModalOpen: false
        });
    },

    /**
     * Ajoute les AFFICHEURS
     * @param formes : [{data: {}, poly: {}}]
     */
    onAfficheursAdded: function (formes) {
        var liste_data = formes.data;
        console.log('data a afficher : %o', liste_data);
        _.each(liste_data, function (afficheur) {
            // MARKER DANS TOUS LES CAS
            if (afficheur.data.lat != null && afficheur.data.lng) {
                var marker = L.marker([afficheur.data.lat, afficheur.data.lng], {
                    icon: new mapOptions.iconAfficheur(),
                    data: afficheur.data
                }).bindLabel(afficheur.data.reference);

                this._inst.afficheursGroup.addLayer(marker);

                // AJOUT DU POLYLINE AU GROUPE AFFICHEUR
                console.log('Afficheur : %o', afficheur);
                console.log('Afficheur polygon : %o', afficheur.polyline);
                if (!_.isEmpty(afficheur.polyline)) {
                    this._inst.afficheursGroup.addLayer(afficheur.polyline);
                }
            }

        }, this);

        this.setState({
            isModalOpen: false
        });
    },

    /**
     * Ajoute les ZONES
     * @param data : le couple type-data envoyé par le store
     */
    onZonesAdded: function (formes) {
        var liste_data = formes.data;
        _.each(liste_data, function (zone) {
            if (zone != null) {
                this._inst.zonesGroup.addLayer(zone.polygon);
            }
        }, this);

        this.setState({
            isModalOpen: false
        });
    },

    /**
     * Ajoute les ALLEES
     * @param data -> le couple type-data envoyé par le store
     */
    onAlleesAdded: function (formes) {
        var liste_data = formes.data;
        _.each(liste_data, function (allee) {
            if (allee != null) {
                this._inst.alleesGroup.addLayer(allee.polygon);
            }
        }, this);

        this.setState({
            isModalOpen: false
        });
    },

    /**
     * Supprime une place du plan
     * @param data -> le couple type-data envoyé par le store
     */
    onDeletePlace: function (data) {
        var place_id = data.data.place_id;
        _.each(this._inst.placesGroup._layers, function (p) {
            var id = p.options.data.id;

            // Id identiques, on supprime la place
            if (id == place_id) {
                this._inst.placesGroup.removeLayer(p);
            }
        }, this);
    },


    /**
     * Remet tous les featuresGroups en ordre (zIndex)
     * L'ordre de bas en haut:
     * - Zone
     * - Allée
     * - Place
     * - Afficheur
     */
    orderLayerGroups: function () {
        this._inst.zonesGroup.bringToFront();
        this._inst.alleesGroup.bringToFront();
        this._inst.placesGroup.bringToFront();
        this._inst.afficheursGroup.bringToFront()
    },


    /**
     * Appellée par la méthode onStoreTrigger quand l'utilisateur a tracé un triangle de place auto.
     *
     * Renseigne les informations nécessaires dans le state pour l'affichage de la modale de saisie des infos
     * @param data
     * @private
     */
    _onNewPlaceAuto: function (data) {
        this.setState({
            modalType: mapOptions.modal_type.place_multiple,
            isModalOpen: true,
            parallelogramme_places: data
        });
    },

    /**
     * Appellée par la méthode onStoreTrigger quand l'utilisateur a tracé un segment de calibre.
     *
     * Renseigne les informations nécessaires dans le state pour l'affichage de la modale de saisie des infos
     * @param data
     * @private
     */
    _onNewCalibre: function (data) {
        this.setState({
            modalType: mapOptions.modal_type.calibre,
            isModalOpen: true,
            segment: data
        });
    },

    /**
     * Affiche la modale de création de zone
     * @param data
     * @private
     */
    _onNewZone: function (data) {
        this.setState({
            modalType: mapOptions.modal_type.zone,
            isModalOpen: true,
            parallelogramme_places: data
        });
    },

    /**
     * Affiche la modale de création d'allée
     * @param data
     * @private
     */
    _onNewAllee: function (data) {
        this.setState({
            modalType: mapOptions.modal_type.allee,
            isModalOpen: true,
            parallelogramme_places: data
        });
    },

    /**
     * Affiche la modale de création d'allée
     * @param data
     * @private
     */
    _onNewAfficheur: function (data) {
        console.log('_onNewAfficheur : %o', data);
        this.setState({
            modalType: mapOptions.modal_type.afficheur,
            isModalOpen: true,
            afficheurData: data.data
        });
    },

    /**
     * Lance l'affichage de la modale EditPlace
     * @private
     */
    _onEditPlace: function (data) {
        this.setState({
            modalType: mapOptions.modal_type.edit_place,
            isModalOpen: true,
            editData: data.layer,
            modalParams: data.modalParams
        });
    },

    /**
     * Lance l'affichage de la modale EditAllee
     * @private
     */
    _onEditAllee: function (data) {
        this.setState({
            modalType: mapOptions.modal_type.edit_allee,
            isModalOpen: true,
            editData: data.layer
        });
    },

    /**
     * Lance l'affichage de la modale EditZone
     * @private
     */
    _onEditZone: function (data) {
        this.setState({
            modalType: mapOptions.modal_type.edit_zone,
            isModalOpen: true,
            editData: data.layer
        });
    },

    /**
     * Lance l'affichage de la modale EditAfficheur
     * @private
     */
    _onEditAfficheur: function (data) {
        this.setState({
            modalType: mapOptions.modal_type.edit_afficheur,
            isModalOpen: true,
            editData: data.layer
        });
    },

    /*******************************************************************/
    /*******************************************************************/
    /*******************************************************************/
    /**
     * Modal de saisie des informations pour créer une zone
     * @returns {XML}
     * @private
     */
    _modalZone: function () {
        if (!this.state.isModalOpen) {
            return <span/>;
        } else {
            return (<ModalZone
                onToggle={this.handleToggle}
            />);
        }
    },
    /**
     * Modal de saisie des informations pour créer une allée
     * @returns {XML}
     * @private
     */
    _modalAllee: function () {
        if (!this.state.isModalOpen) {
            return <span/>;
        } else {
            return (<ModalEditPlace
                onToggle={this.handleToggle}
            />);
        }
    },

    /**
     * Modal de saisie des informations pour créer un afficheur
     * @returns {XML}
     * @private
     */
    _modalAfficheur: function () {
        if (!this.state.isModalOpen) {
            return <span/>;
        } else {
            return (<ModalAfficheur
                onToggle={this.handleToggle}
                parkingId={this.props.parkingId}
                planId={this.props.planId}
                drawData={this.state.afficheurData}
            />);
        }
    },
    /**
     * Modal de saisie des informations pour créer un ensemble de places
     * @returns {XML}
     * @private
     */
    _modalPlaceMultiple: function () {
        if (!this.state.isModalOpen) {
            return <span/>;
        } else {
            return (
                <ModalPlaces
                    onToggle={this.handleToggle}
                    numPlace={this._inst.lastNum + 1}
                />
            );
        }
    },
    /**
     * TODO : Modal de saisie des informations pour créer une place
     * @returns {XML}
     * @private
     */
    _modalPlaceSimple: function () {
        if (!this.state.isModalOpen) {
            return <span/>;
        } else {
            return (<Modal bsStyle="primary" title="Modal heading" onHide={this.handleToggle}>
                <div className="modal-body">
                    This modal is controlled by our custom trigger component.
                </div>
                <div className="modal-footer">
                    <Button onClick={this.handleToggle}>Close</Button>
                </div>
            </Modal>);
        }
    },
    /**
     * Modal de saisie des informations pour créer un capteur
     * @returns {XML}
     * @private
     */
    _modalCapteur: function () {
        if (!this.state.isModalOpen) {
            return <span/>;
        } else {
            return (<ModalCapteur
                onToggle={this.handleToggle}
                parkingId={this.props.parkingId}
            />);
        }
    },
    /**
     * TODO : Modal de saisie des informations pour régler la luminosité
     * @returns {XML}
     * @private
     */
    _modalLuminosite: function () {
        if (!this.state.isModalOpen) {
            return <span/>;
        } else {
            return (<Modal bsStyle="primary" title="Modal heading" onHide={this.handleToggle}>
                <div className="modal-body">
                    This modal is controlled by our custom trigger component.
                </div>
                <div className="modal-footer">
                    <Button onClick={this.handleToggle}>Close</Button>
                </div>
            </Modal>);
        }
    },

    /**
     * @returns {XML}
     * @private
     */
    _modalCalibre: function () {
        if (!this.state.isModalOpen) {
            return <span/>;
        } else {
            return (
                <Modal bsStyle="primary" title="Modal heading" onHide={this.handleToggle}>
                    <div className="modal-body">
                        This modal is controlled by our custom trigger component.
                    </div>
                    <div className="modal-footer">
                        <Button onClick={this.handleToggle}>Close</Button>
                    </div>
                </Modal>
            );
        }
    },

    /**
     * TODO
     * @returns {XML}
     * @private
     */
    _modalEditPlace: function () {
        if (!this.state.isModalOpen) {
            return <span/>;
        } else {
            return (
                <ModalEditPlace
                    onToggle={this.handleToggle}
                    parkingId={this.props.parkingId}

                    {...this.state.modalParams}
                />
            );
        }
    },

    /**
     * TODO
     * @returns {XML}
     * @private
     */
    _modalEditAllee: function () {
        if (!this.state.isModalOpen) {
            return <span/>;
        } else {
            return (
                <Modal bsStyle="primary" title="Modal heading" onHide={this.handleToggle}>
                    <div className="modal-body">
                        This modal is controlled by our custom trigger component.
                    </div>
                    <div className="modal-footer">
                        <Button onClick={this.handleToggle}>Close</Button>
                    </div>
                </Modal>
            );
        }
    },

    /**
     * TODO
     * @returns {XML}
     * @private
     */
    _modalEditZone: function () {
        if (!this.state.isModalOpen) {
            return <span/>;
        } else {
            return (
                <Modal bsStyle="primary" title="Modal heading" onHide={this.handleToggle}>
                    <div className="modal-body">
                        This modal is controlled by our custom trigger component.
                    </div>
                    <div className="modal-footer">
                        <Button onClick={this.handleToggle}>Close</Button>
                    </div>
                </Modal>
            );
        }
    },

    /**
     * TODO
     * @returns {XML}
     * @private
     */
    _modalEditAfficheur: function () {
        if (!this.state.isModalOpen) {
            return <span/>;
        } else {
            return (
                <Modal bsStyle="primary" title="Modal heading" onHide={this.handleToggle}>
                    <div className="modal-body">
                        This modal is controlled by our custom trigger component.
                    </div>
                    <div className="modal-footer">
                        <Button onClick={this.handleToggle}>Close</Button>
                    </div>
                </Modal>
            );
        }
    },

    /**
     * Méthode appellée par le "OverlayMixin", au moment du montage initial et de chaque update.
     * La valeur retournée est ajoutée au body de la page.
     * @returns {XML}
     */
    renderOverlay: function () {
        var retour = {};
        switch (this.state.modalType) {
            case mapOptions.modal_type.zone:
                retour = this._modalZone();
                break;
            case mapOptions.modal_type.allee:
                retour = this._modalAllee();
                break;
            case mapOptions.modal_type.afficheur:
                retour = this._modalAfficheur();
                break;
            case mapOptions.modal_type.place_multiple:
                retour = this._modalPlaceMultiple();
                break;
            case mapOptions.modal_type.place_simple:
                retour = this._modalPlaceSimple();
                break;
            case mapOptions.modal_type.capteur:
                retour = this._modalCapteur();
                break;
            case mapOptions.modal_type.luminosite:
                retour = this._modalLuminosite();
                break;
            case mapOptions.modal_type.calibre:
                retour = this._modalCalibre();
                break;

            case mapOptions.modal_type.edit_place:
                retour = this._modalEditPlace();
                break;
            case mapOptions.modal_type.edit_allee:
                retour = this._modalEditAllee();
                break;
            case mapOptions.modal_type.edit_zone:
                retour = this._modalEditZone();
                break;
            case mapOptions.modal_type.edit_afficheur:
                retour = this._modalEditAfficheur();
                break;
            default:
                retour = <span/>;
                break;
        }

        return retour;
    },
    handleToggle: function () {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    },


    /**
     * Affichage du composant
     * @returns {XML}
     */
    render: function () {
        var style = {height: "100%"};
        return <div id={this.props.divId} style={style}> </div>;
    }
});

module.exports = parkingMap;

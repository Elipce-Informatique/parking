var React = require('react/addons');
var mapOptions = require('../../helpers/map_options');
// STORE DE LA CARTE
var mapStore = require('../../stores/alerte_store');
var mapHelper = require('../../helpers/map_helper');

// COMPOSANTS
var Field = require('../formulaire/react_form_fields');
var InputTextEditable = Field.InputTextEditable;
var InputNumberEditable = Field.InputNumberEditable;
var Modal = ReactB.Modal;
var Button = ReactB.Button;

var ModalAlerteFull = require('../modals/mod_alerte_full');
var ModalAlerteChange= require('../modals/mod_alerte_change');
var ModalReservation = require('../modals/mod_reservation');


/**
 * Composant pour créer une carte de parking en mode administration outils de dessins.
 * @param defaultDrawMode : mapOptions.dessin.xxxx
 * @param calibre : nombre de cm/deg sur cette carte
 */
var parkingMap = React.createClass({
    displayName: 'alerte_map',

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
            isModalOpen: false
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
            maxZoom: 12
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
        this._inst.alerteFullGroup = new L.FeatureGroup();
        this._inst.map.addLayer(this._inst.alerteFullGroup);
        this._inst.alerteFullMarkersGroup = new L.LayerGroup();
        this._inst.map.addLayer(this._inst.alerteFullMarkersGroup);
        this._inst.alerteChangeGroup = new L.FeatureGroup();
        this._inst.map.addLayer(this._inst.alerteChangeGroup);
        this._inst.reservationGroup = new L.FeatureGroup();
        this._inst.map.addLayer(this._inst.reservationGroup);

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

        // Alerte de type zone complète
        L.easyButton(
            mapOptions.icon.alerte_full,
            function () {
                Actions.map.mode_alerte_full();
            },
            Lang.get('supervision.alerte.full'),
            this._inst.map
        );

        // Alerte de type changement d'état de place
        L.easyButton(
            mapOptions.icon.alerte_change,
            function () {
                Actions.map.mode_alerte_change();
            },
            Lang.get('supervision.alerte.change'),
            this._inst.map
        );

        // Réservation
        L.easyButton(
            mapOptions.icon.reservation,
            function () {
                Actions.map.mode_reservation();
            },
            Lang.get('supervision.alerte.reservation'),
            this._inst.map
        );

        // ---------------------------------------------------------
        // LANCEMENT DE L'ACTION POUR SÉLECTIONNER LE BOUTON "ALERTE FULL":
        Actions.map.mode_alerte_full();

    },
    /**
     * Supprime et remet le drawControl pour utiliser le bon layer
     * @param mode_dessin mode de dessin ou null
     */
    changeDrawToolbar: function (mode_dessin) {
        // 1 : SUPPRIMER L'ANCIENNE TOOLBAR :
        //console.log('uuu %o', this._inst.drawControl);
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
            var polyline = false;
            // ------- LES POLYGONS ----------
            var polygon = (this._inst.currentMode == mapOptions.dessin.alerte_full || this._inst.currentMode == mapOptions.dessin.alerte_change) ? {
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
            var rectangle = false;
            // ------- LES MARKERS ----------
            var marker = (this._inst.currentMode == mapOptions.dessin.alerte_change || this._inst.currentMode == mapOptions.dessin.reservation) ? {
                icon: new mapOptions.afficheurMarker(),
                repeatMode: true
            } : false;

            // 3 : Init du layerGroup pour la modif
            var group = this._inst[mapOptions.control.groups[this._inst.currentMode]];
            //console.log('polygone %o', polygon);

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
                    remove: true
                }
            };


            this._inst.drawControl = new L.Control.Draw(options);
            this._inst.map.addControl(this._inst.drawControl);
        }
        // CALIBRE 0
        else {
            // TODO
            //console.log('veuillez calibrer');
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
        console.log('store trigger '+data.type);
        switch (data.type) {
            // Génériques
            case mapOptions.type_messages.mode_change:
                this.onModeChange(data);
                break;
            case mapOptions.type_messages.add_forme:
                this.onFormeAdded(data);
                break;
            case mapOptions.type_messages.add_places:
                this.onPlacesAdded(data);
                break;
            case mapOptions.type_messages.add_zones:
                this.onZonesAdded(data);
                break;
            case mapOptions.type_messages.add_allees:
                this.onAlleesAdded(data);
                break;
            case mapOptions.type_messages.set_calibre:
                this.onSetCalibre(data);
                break;
            case mapOptions.type_messages.alerte_full:
            case mapOptions.type_messages.alerte_change:
            case mapOptions.type_messages.reservation:
                this.setState({
                    isModalOpen: true
                });
                break;
            case mapOptions.type_messages.hide_modal:
                this.setState({
                    isModalOpen: false
                });
                break;
            case mapOptions.type_messages.add_alertes_full:
                this.onAddAlertesMarkers(data.data);
                break;
            default:
                break;
        }
        this.orderLayerGroups();
    },

    /**
     * Effectue les actions nécessaires au chandement du mode de dessin
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
            //console.log(className);
            $('.btn-fa-selected').removeClass('btn-fa-selected');
            $('.' + className).parent().addClass('btn-fa-selected');
        };
        // Changer la barre d'outil de dessin pour qu'elle utilise le bon layerGroup
        switch (data.data.mode) {
            case mapOptions.dessin.alerte_full:
                this.changeDrawToolbar(data.data.mode);
                selectButton(mapOptions.icon.alerte_full);
                break;
            case mapOptions.dessin.alerte_change:
                this.changeDrawToolbar(data.data.mode);
                selectButton(mapOptions.icon.alerte_change);
                break;
            case mapOptions.dessin.reservation:
                this.changeDrawToolbar(data.data.mode);
                selectButton(mapOptions.icon.reservation);
                break;
            default:
                console.log('defeult');
                this.changeDrawToolbar(mapOptions.dessin.alerte_full);
                // PAR DÉFAUT, ON SÉLECTIONNE LE MODE PLACE AU CAS OÙ
                selectButton(mapOptions.icon.alerte_full);
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
            // Dessin de la place
            this._inst.lastNum = Math.max(this._inst.lastNum, place.data.num);
            this._inst.placesGroup.addLayer(place.polygon);

            // Marker invisible au centre de chaque place
            var marker = L.marker([place.data.lat, place.data.lng], {
                icon: new mapOptions.iconInvisible(),
                data: place.data
            });
            this._inst.placesMarkersGroup.addLayer(marker);
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
     * Ajout des markers de type alerte sur la map
     * @param data: tableau de markers
     */
    onAddAlertesMarkers: function(data){
        //console.log('onAddAlertesMarkers %o', data);
        // Parcours des markers à ajouter
        data.forEach(function(marker){
            this._inst.alerteFullMarkersGroup.addLayer(marker);
        },this);
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



    /*******************************************************************/
    /*******************************************************************/
    /*******************************************************************/
    // TODO repère modal
    /**
     * Modal pour créer une alerte de type "full"
     * @returns {XML}
     * @private
     */
    _modalFull: function () {
        if (!this.state.isModalOpen) {
            //console.log('modal fermée');
            return <span/>;
        } else {
            //console.log('modal ouverte');
            return (<ModalAlerteFull
                onToggle={this.handleToggle}
            />);
        }
    },
    /**
     * Modal alerte de type "change"
     * @returns {XML}
     * @private
     */
    _modalChange: function () {
        if (!this.state.isModalOpen) {
            return <span/>;
        } else {
            return (<ModalAlerteChange
                onToggle={this.handleToggle}
            />);
        }
    },

    /**
     * Modal réservation
     * @returns {XML}
     * @private
     */
    _modalReservation: function () {
        if (!this.state.isModalOpen) {
            return <span/>;
        } else {
            return (<ModalReservation
                onToggle={this.handleToggle}
            />);
        }
    },

    /**
     * Méthode appellée par le "OverlayMixin", au moment du montage initial et de chaque update.
     * La valeur retournée est ajoutée au body de la page.
     * @returns {XML}
     */
    renderOverlay: function () {
        var retour = '';
        switch (this.state.modalType) {
            case mapOptions.modal_type.alerte_full:
                retour = this._modalFull();
                break;
            case mapOptions.modal_type.alerte_change:
                retour = this._modalChange();
                break;
            case mapOptions.modal_type.reservation:
                retour = this._modalReservation();
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

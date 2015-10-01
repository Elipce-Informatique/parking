var React = require('react/addons');
// Options pour paramétrer la carte
var mapOptions = require('../../helpers/map_options');
var mapHelper = require('../../helpers/map_helper');
var afficheurHelper = require('../../helpers/afficheur_helper');
// STORE DE LA CARTE
var supervisionStore = require('../../stores/supervision_parking_map_store');

// UTILITAIRES
var ListenerMixin = Reflux.ListenerMixin;
var simu = require('../../simulator/react_simulator');

/**
 * Created by yann on 27/01/2015.
 *
 * Composant pour créer une carte de parking en mode administration outils de dessins.
 *
 */
var parkingMap = React.createClass({
    mixins: [ListenerMixin],
    /**
     * Définition du type des props du composant.
     */
    propTypes: {
        divId: React.PropTypes.string.isRequired,
        imgUrl: React.PropTypes.string.isRequired,
        parkingId: React.PropTypes.number.isRequired,
        planId: React.PropTypes.number.isRequired,
        parkingLogo: React.PropTypes.string,
        mapHeight: React.PropTypes.number,
        calibre: React.PropTypes.number
    },
    /**
     * Variables d'instance du composant.
     * Utilisées pour intéragir avec la carte.
     */
    _inst: {
        map: {},
        placesMarkersGroup: {},
        placesGroup: {},
        alleesGroup: {},
        zonesGroup: {},
        afficheursGroup: {}
    },

    getDefaultProps: function () {
        return {
            mapHeight: 300,
            calibre: 93,
            module_url: 'parking',
            parkingLogo: ''
        };
    },

    getInitialState: function () {
        return {};
    },

    /**
     * Application de la carte sur le div avec les paramètres
     */
    componentDidMount: function () {
        this.initMap();

        this.listenTo(supervisionStore, this.onStoreTrigger);

        // Lancement du simulateur
        //simu(this.props.planId);
    },

    /**
     * Clear la map avant de supprimer le node
     */
    componentWillUnmount: function () {
        this._inst.map.remove();
        this.hideLogo();
    },

    /**
     * Le composant ne sera jamais mis à jour
     * On ne veut pas écraser la map a chaque mise à jour, juste la modifier avec ses méthodes
     */
    shouldComponentUpdate: function (nextProps, nextState) {
        return true;
    },

    /**
     * ------------------------------------------
     * - INITIALISATION DE LA CARTE -------------
     * ------------------------------------------
     * Avec l'image passée en paramètres et des coordonnées
     * carrées allant de 0 à 100 en lon et en lat
     */
    initMap: function () {
        var origine = [-250, -250];
        var haut_droit = [250, 250];


        // CRÉATION DE LA MAP
        var baseLayer = L.imageOverlay(this.props.imgUrl, [origine, haut_droit]);
        this._inst.map = new L.Map(this.props.divId, {
            crs: mapHelper.customZoomCRS,
            layers: [baseLayer],
            maxZoom: 12,
            contextmenu: true
        }).setView([0, 0], 0);

        // GESTION RÉORGANISATION DES LAYERS
        this._inst.map.on('overlayadd', this.orderLayerGroups);

        // Transmission des données du parking au store:
        var parkingData = {
            parkingId: this.props.parkingId,
            planId: this.props.planId
        };
        Actions.map.map_initialized(this._inst.map, this.props.calibre, parkingData, this._inst);

        // INIT des layers
        this._inst.placesMarkersGroup = new L.MarkerClusterGroup({
            maxClusterRadius: 10
        });

        this._inst.map.addLayer(this._inst.placesMarkersGroup);
        this._inst.placesGroup = new L.geoJson();
        this._inst.map.addLayer(this._inst.placesGroup);
        this._inst.alleesGroup = new L.geoJson();
        //this._inst.map.addLayer(this._inst.alleesGroup);
        this._inst.zonesGroup = new L.geoJson();
        //this._inst.map.addLayer(this._inst.zonesGroup);
        this._inst.afficheursGroup = new L.geoJson();
        this._inst.map.addLayer(this._inst.afficheursGroup);

        // LayerControl pour afficher ou non les zones et allées
        var overlaysMaps = {
            "Zones": this._inst.zonesGroup,
            "Allées": this._inst.alleesGroup
        };

        var layerControl = L.control.layers({}, overlaysMaps);
        layerControl.addTo(this._inst.map);

        if (this.props.parkingLogo != '') {
            this.showLogo(this.props.parkingLogo);
        }

        // INIT EVENTS LAERS POUR EVENTUELLEMENT CONTEXT MENU
        this._inst.placesGroup.on('layeradd', Actions.map.feature_place_add);
        //this._inst.placesMarkersGroup.on('layeradd', Actions.map.feature_place_add);
        this._inst.alleesGroup.on('layeradd', Actions.map.feature_allee_add);
        this._inst.zonesGroup.on('layeradd', Actions.map.feature_zone_add);
        this._inst.afficheursGroup.on('layeradd', Actions.map.feature_afficheur_add);
    },

    /**
     * Affiche le cadre d'information en haut à droite
     * avec un logo
     */
    showLogo: function (logo) {
        // Just in case :
        this.hideLogo();

        this._inst.infosControl = L.control({
            position: 'topright'
        });

        this._inst.infosControl.onAdd = function (map) {
            this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
            this.update(logo);
            return this._div;
        };

        // Méthode appellée lors de la mise à jour du controle
        this._inst.infosControl.update = function (logo) {
            this._div.innerHTML = logo != undefined ? '<img src="' + DOC_URI + 'logo_parking/' + logo + '" />' : '';
        };

        this._inst.infosControl.addTo(this._inst.map);
    },

    /**
     * Met à jour le contenu du block d'infos
     * @param logo : Message HTML à afficher dans le div d'infos
     */
    updateLogo: function (logo) {
        this._inst.infosControl.update(logo);
    },

    /**
     * Masque le contenu du bloc d'info
     */
    hideLogo: function () {
        if (typeof(this._inst.infosControl) == 'object') {
            this._inst.map.removeControl(this._inst.infosControl);
        }
        this._inst.infosControl = undefined;
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
    },

    /**
     * Ajoute les PLACES
     * @param formes : tableau de places
     */
    onPlacesAdded: function (formes) {
        var liste_data = formes.data;
        _.each(liste_data, function (place) {
            this._inst.placesGroup.addLayer(place.polygon);

            if (!_.isEmpty(place.marker)) {
                this._inst.placesMarkersGroup.addLayer(place.marker);
            }
        }, this);
    },

    /**
     * @param places
     */
    onPlacesOccuped: function (data) {
        var places = data.data;
        _.each(places, function (p, i) {
            var marker = p.marker;
            var exists = mapHelper.findMarkerByPlaceId(marker.options.data.id, this._inst.placesMarkersGroup);
            if (exists.length == 0) {
                this._inst.placesMarkersGroup.addLayer(marker);
            }
        }, this);
    },

    /**
     * @param places
     */
    onPlacesFreed: function (data) {
        var places = data.data;
        // Parcourt des place a supprimer
        _.each(places, function (p, i) {
            // Récup de la liste des markers a supprimer
            var exists = mapHelper.findMarkerByPlaceId(p.id, this._inst.placesMarkersGroup);
            // Suppression du marker
            if (exists.length == 1) {
                this._inst.placesMarkersGroup.removeLayer(exists[0]);
            }
        }, this);
    },

    /**
     * Ajoute les AFFICHEURS à la carte
     * @param formes : [{data: {}, poly: {}}]
     */
    onAfficheursAdded: function (formes) {
        // On sort les données du message
        var liste_data = formes.data;
        //console.log('data a afficher : %o', liste_data);
        _.each(liste_data, function (afficheur) {

            if (afficheur != undefined && afficheur.data.lat != null && afficheur.data.lng) {

                //console.log('Data détail : %o', afficheur.data.vues_bis);

                var htmlAfficheur = afficheurHelper.generateAfficheurLabel(afficheur);

                // CRÉATION DU MARKER
                var marker = L.marker([afficheur.data.lat, afficheur.data.lng], {
                    icon: new mapOptions.iconInvisible(),
                    data: afficheur.data
                }).bindLabel(htmlAfficheur, {
                    noHide: true,
                    className: 'afficheur_label',
                    clickable: true
                });

                // AJOUT DU MARKER AU GROUPE AFFICHEUR (Affichage)
                this._inst.afficheursGroup.addLayer(marker);

                // AJOUT DU POLYLINE AU GROUPE AFFICHEUR
                if (!_.isEmpty(afficheur.polyline)) {
                    this._inst.afficheursGroup.addLayer(afficheur.polyline);
                }
                else {
                }

            }
            //else{
            //    console.log('Afficheur undefined');
            //}

        }, this);

        // ATTACHE LE CONTEXTMENU
        Actions.map.label_afficheurs_add();

        this.setState({
            isModalOpen: false
        });
    },

    /**
     *
     * @param data
     */
    onAfficheursUpdated: function (data) {
        //console.log('PROCESS DATA %o', data);
        //console.log('AFFICHEURS MAP %o', this._inst.afficheursGroup);
        var afficheurs = afficheurHelper.createAfficheursMapFromAfficheursBDD(data.data);

        // Parcours les afficheurs impactés et les chercher dans les markers
        _.each(afficheurs, function (affModif) {
            var idModif = affModif.data.id;
            var aff = {};
            _.each(this._inst.afficheursGroup._layers, function (affMap) {

                // CE N'EST PAS UN POLYLINE, ON EST SUR UN MARKER
                if (typeof affMap._path === 'undefined' && affMap.options.data.id == idModif) {
                    affMap.unbindLabel();
                    aff = affMap;
                }
            }, this);

            // ATTACHEMENT DU NOUVEAU LABEL
            aff.bindLabel(afficheurHelper.generateAfficheurLabel(affModif), {
                noHide: true,
                className: 'afficheur_label',
                clickable: true
            });
            // AFFICHAGE DU NOUVEAU LABEL
            aff.showLabel();

        }, this);

        // ATTACHE LE CONTEXTMENU
        Actions.map.label_afficheurs_add();
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
        try {
            this._inst.zonesGroup.bringToFront();
        } catch (e) {

        }
        try {
            this._inst.alleesGroup.bringToFront();
        } catch (e) {

        }
        try {
            this._inst.placesGroup.bringToFront();
        } catch (e) {

        }
        try {
            this._inst.afficheursGroup.bringToFront()
        } catch (e) {

        }
    },
    /**
     * Déclenché par la mise à jour des données du store
     */
    onStoreTrigger: function (data) {
        switch (data.type) {
            case mapOptions.type_messages.add_forme:
                this.onFormeAdded(data);
                break;
            case mapOptions.type_messages.add_zones:
                this.onZonesAdded(data);
                break;
            case mapOptions.type_messages.add_allees:
                this.onAlleesAdded(data);
                break;
            case mapOptions.type_messages.add_places:
                this.onPlacesAdded(data);
                break;
            case mapOptions.type_messages.add_afficheurs:
                this.onAfficheursAdded(data);
                break;
            case mapOptions.type_messages.update_afficheurs:
                this.onAfficheursUpdated(data);
                break;

            case mapOptions.type_messages.delete_forme:
                break;
            case mapOptions.type_messages.occuper_places:
                this.onPlacesOccuped(data);
                break;
            case mapOptions.type_messages.liberer_places:
                this.onPlacesFreed(data);
                break;

            default:
                break;
        }
        this.orderLayerGroups();
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

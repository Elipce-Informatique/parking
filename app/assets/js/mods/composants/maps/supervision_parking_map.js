var React = require('react/addons');
// Options pour paramétrer la carte
var mapOptions = require('../../helpers/map_options');
var mapHelper = require('../../helpers/map_helper');
// STORE DE LA CARTE
var supervisionStore = require('../../stores/supervision_parking_map_store');

// UTILITAIRES
var ListenerMixin = Reflux.ListenerMixin;

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
            defaultDrawMode: mapOptions.dessin.place,
            mapHeight: 300,
            calibre: 93,
            module_url: 'parking'
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
        Actions.map.map_initialized(this._inst.map, this.props.calibre, parkingData);

        // INIT des layers
        this._inst.placesMarkersGroup = new L.MarkerClusterGroup({
            maxClusterRadius: 25
        });
        this._inst.map.addLayer(this._inst.placesMarkersGroup);
        this._inst.placesGroup = new L.geoJson();
        this._inst.map.addLayer(this._inst.placesGroup);
        this._inst.alleesGroup = new L.geoJson();
        this._inst.map.addLayer(this._inst.alleesGroup);
        this._inst.zonesGroup = new L.geoJson();
        this._inst.map.addLayer(this._inst.zonesGroup);
        this._inst.afficheursGroup = new L.geoJson();
        this._inst.map.addLayer(this._inst.afficheursGroup);
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
     * Déclenché par la mise à jour des données du store
     */
    onStoreTrigger: function (data) {
        switch (data.type) {
            case mapOptions.type_messages.add_forme:
                this.onFormeAdded(data);
                break;
            case mapOptions.type_messages.add_places:
                this.onPlacesAdded(data);
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

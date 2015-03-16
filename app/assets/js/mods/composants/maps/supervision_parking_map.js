// Options pour paramétrer la carte
var mapOptions = require('../../helpers/map_options');
// STORE DE LA CARTE
// TODO : store de supervision

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
    },
    /**
     * Variables d'instance du composant.
     * Utilisées pour intéragir avec la carte.
     */
    _inst: {
        map: {},
        placesGroup: {},
        alleesGroup: {},
        zonesGroup: {},
        afficheursGroup: {}
    },

    getDefaultProps: function () {
        return {};
    },

    getInitialState: function () {
        return {};
    },

    /**
     * Application de la carte sur le div avec les paramètres
     */
    componentDidMount: function () {
        this.initMap();

        // Todo: raccorder le store supervision au conposant
        //this.listenTo(mapStore, this.onStoreTrigger);
    },

    /**
     * Le composant ne sera jamais mis à jour
     * On ne veut pas écraser la map a chaque mise à jour, juste la modifier avec ses méthodes
     */
    shouldComponentUpdate: function (nextProps, nextState) {
        return false;
    },

    render: function () {
        var style = {height: "100%"};
        return <div id={this.props.divId} style={style}> </div>;
    },

    /**
     * ------------------------------------------
     * INITIALISATION DE LA CARTE ---------------
     * ------------------------------------------
     * Avec l'image passée en paramètres et des coordonnées
     * carrées allant de 0 à 100 en lon et en lat
     */
    initMap: function () {
        var origine = [0, 0];
        var haut_droit = [100, 100];

        // CRÉATION DE LA MAP
        this._inst.map = new L.Map(this.props.divId, {
            fullscreenControl: true
        }).setView([50, 50], 3);

        // AJOUT DE L'IMAGE DE FOND
        L.imageOverlay(this.props.imgUrl, [origine, haut_droit]).addTo(this._inst.map);
        Actions.map.map_initialized(this._inst.map);

        // INIT des layers
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
            case mapOptions.type_messages.mode_change:
                this.onModeChange(data);
                break;
            case mapOptions.type_messages.add_forme:
                this.onFormeAdded(data);
                break;
            case mapOptions.type_messages.delete_forme:
                break;
            default:
                break;
        }
        this.orderLayerGroups();
    }
});

module.exports = parkingMap;

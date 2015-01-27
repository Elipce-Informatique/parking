var mapStore = require('../stores/parking_map_store');
var isPointInPolygon = require('../helpers/map_helper').isPointInPolygon;
var getCentroid = require('../helpers/map_helper').getCentroid;
var isPolygonInPolygonByCenter = require('../helpers/map_helper').isPolygonInPolygonByCenter;
var isPolygonInPolygon = require('../helpers/map_helper').isPolygonInPolygon;
var ListenerMixin = Reflux.ListenerMixin;

/**
 * Created by yann on 27/01/2015.
 *
 * TODO : Snippet de base pour un composant react. Commentaire à éditer
 * @param name : nom a afficher dans le composant
 */
var parkingMap = React.createClass({
    mixins: [ListenerMixin],
    propTypes: {
        divId: React.PropTypes.string.isRequired,
        imgUrl: React.PropTypes.string.isRequired,
        defaultDrawMode: React.PropTypes.string
    },
    /**
     * Variables d'instance du composant
     */
    _inst: {
        map: {},
        placesGroup: {},
        alleesGroup: {},
        zonesGroup: {},
        afficheursGroup: {},
        drawControl: {}
    },

    getDefaultProps: function () {
        return {};
    },

    getInitialState: function () {
        return {
            currentDrawGroup: 'placesGroup'
        };
    },

    /**
     * Application de la carte sur le div avec les paramètres
     */
    componentDidMount: function () {
        this.initMap();
        this.initDrawPlugin();
        this.initCustomButtons();
    },

    /**
     * Le composant ne sera jamais mis à jour
     * On ne veut pas écraser la map a chaque mise à jour, juste la modifier avec ses méthodes
     */
    shouldComponentUpdate: function (nextProps, nextState) {
        return false;
    },

    render: function () {
        return <div id={this.props.divId}> </div>;
    },
    /**
     * ------------------------------------------
     * INITIALISATION DE LA CARTE ---------------
     * ------------------------------------------
     * Avec l'image passée en paramètres et des coordonnées
     * carrées allant de 0 à 100 en lon comme en lat
     */
    initMap: function () {
        var origine = [0, 0];
        var haut_droit = [100, 100];
        // CRÉATION DE LA MAP
        this._inst.map = new L.Map('map_test', {
            fullscreenControl: true
        }).setView([50, 50], 3);
        // AJOUT DE L'IMAGE DE FOND
        L.imageOverlay(this.props.imgUrl, [origine, haut_droit]).addTo(this._inst.map);
        Actions.map.map_initialized(this._inst.map);

        // Ajout des layers
        this._inst.placesGroup = new L.featureGroup();
        this._inst.map.addLayer(this._inst.placesGroup);
        this._inst.alleesGroup = new L.featureGroup();
        this._inst.map.addLayer(this._inst.alleesGroup);
        this._inst.zonesGroup = new L.featureGroup();
        this._inst.map.addLayer(this._inst.zonesGroup);
        this._inst.afficheursGroup = new L.featureGroup();
        this._inst.map.addLayer(this._inst.afficheursGroup);
    },
    /**
     * Paramètre le plugin de dessin sur la carte
     */
    initDrawPlugin: function () {
        var options = {
            position: 'topright',
            draw: {
                polyline: false,
                polygon: {
                    allowIntersection: false, // Restricts shapes to simple polygons
                    drawError: {
                        color: '#e1e100', // Color the shape will turn when intersects
                        message: Lang.get('administration_parking.carte.erreur_polygon') // Message that will show when intersect
                    },
                    shapeOptions: {
                        color: '#bada55'
                    }
                },
                circle: false, // Turns off this drawing tool
                rectangle: {
                    shapeOptions: {
                        clickable: false
                    }
                }
            },
            edit: {
                featureGroup: this._inst[this.state.currentDrawGroup], //REQUIRED!!
                remove: true
            }
        };
        this._inst.drawControl = new L.Control.Draw(options);
        this._inst.map.addControl(this._inst.drawControl);

        var data = {
            e: {},
            map: this._inst.map
        };

        // QUAND UNE FORME EST CRÉÉE
        this._inst.map.on('draw:created', function (e) {
            data.e = _.cloneDeep(e);
            Actions.map.draw_created(data);
        });
        // QUAND UNE FORME EST SUPPRIMÉE
        this._inst.map.on('draw:deleted', function (e) {
            data.e = _.cloneDeep(e);
            Actions.map.draw_deleted(data);
        });
        // QUAND LE DESSIN COMMENCE
        this._inst.map.on('draw:drawstart', function (e) {
            data.e = _.cloneDeep(e);
            Actions.map.draw_drawstart(data);
        });
        // QUAND LE DESSIN S'ARRÊTE
        this._inst.map.on('draw:drawstop', function (e) {
            data.e = _.cloneDeep(e);
            Actions.map.draw_drawstop(data);
        });
        // QUAND L'ÉDITION S'ARRÊTE
        this._inst.map.on('draw:editstart', function (e) {
            data.e = _.cloneDeep(e);
            Actions.map.draw_editstart(data);
        });
        // QUAND L'ÉDITION EST ARRÊTÉE
        this._inst.map.on('draw:editstop', function (e) {
            data.e = _.cloneDeep(e);
            Actions.map.draw_editstop(data);
        });
        // QUAND LA SUPPRESSION COMMENCE
        this._inst.map.on('draw:deletestart', function (e) {
            data.e = _.cloneDeep(e);
            Actions.map.draw_deletestart(data);
        });
        // QUAND LA SUPPRESSION S'ARRÊTE
        this._inst.map.on('draw:deletestop', function (e) {
            data.e = _.cloneDeep(e);
            Actions.map.draw_deletestop(data);
        });

    },

    /**
     * Paramètre les boutons perso ajoutés à la carte
     */
    initCustomButtons: function () {

        //"mode_place",
        //"mode_allee",
        //"mode_zone",
        //"mode_afficheur"

        // PLACE DE PARKING
        L.easyButton(
            'fa-car',
            function () {
                Actions.map.mode_place();
            },
            Lang.get('ajouter_place'),
            this._inst.map
        );

        // ALLÉE
        L.easyButton(
            'fa-exchange',
            function () {
                Actions.map.mode_allee();
            },
            Lang.get('ajouter_allee'),
            this._inst.map
        );

        // ZONE
        L.easyButton(
            'fa-circle-o',
            function () {
                Actions.map.mode_zone();
            },
            Lang.get('ajouter_zone'),
            this._inst.map
        );

        // AFFICHEUR
        L.easyButton(
            'fa-desktop',
            function () {
                Actions.map.mode_afficheur();
            },
            Lang.get('ajouter_afficheur'),
            this._inst.map
        );
    }
});

function selectCustomButton(link) {
    $('.btn-fa-selected').removeClass('btn-fa-selected');
    $(link).addClass('btn-fa-selected');
}

module.exports = parkingMap;

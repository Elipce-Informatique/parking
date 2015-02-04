var mapOptions = require('../helpers/map_options');
// STORE DE LA CARTE
var mapStore = require('../stores/admin_parking_map_store');

// UTILITAIRES
var ListenerMixin = Reflux.ListenerMixin;

/**
 * Created by yann on 27/01/2015.
 *
 * Composant pour créer une carte de parking en mode administration outils de dessins.
 *
 * @param defaultDrawMode :
 */
var parkingMap = React.createClass({
    mixins: [ListenerMixin],
    /**
     * Définition du type des props du composant.
     */
    propTypes: {
        divId: React.PropTypes.string.isRequired,
        imgUrl: React.PropTypes.string.isRequired,
        defaultDrawMode: React.PropTypes.number,
        iconPlace: React.PropTypes.string,
        iconAllee: React.PropTypes.string,
        iconZone: React.PropTypes.string,
        iconAfficheur: React.PropTypes.string
    },
    /**
     * Variables d'instance du composant.
     * Utilisées pour intéragir avec la carte.
     */
    _inst: {
        map: {},
        currentMode: mapOptions.dessin.place,
        placesGroup: {},
        alleesGroup: {},
        zonesGroup: {},
        afficheursGroup: {},
        drawControl: {}
    },

    getDefaultProps: function () {
        return {
            defaultDrawMode: mapOptions.dessin.place,
            iconPlace: mapOptions.icon.place,
            iconAllee: mapOptions.icon.allee,
            iconZone: mapOptions.icon.zone,
            iconAfficheur: mapOptions.icon.afficheur
        };
    },

    getInitialState: function () {
        return {
            currentDrawGroup: mapOptions.control.groups[this._inst.currentMode]
        };
    },

    /**
     * Application de la carte sur le div avec les paramètres
     */
    componentDidMount: function () {
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
     * carrées allant de 0 à 100 en lon et en lat
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

        // INIT des layers
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
                Actions.map.mode_place(this._link);
            },
            Lang.get('ajouter_place'),
            this._inst.map
        );

        // ALLÉE
        L.easyButton(
            mapOptions.icon.allee,
            function () {
                Actions.map.mode_allee(this._link);
            },
            Lang.get('ajouter_allee'),
            this._inst.map
        );

        // ZONE
        L.easyButton(
            mapOptions.icon.zone,
            function () {
                Actions.map.mode_zone(this._link);
            },
            Lang.get('ajouter_zone'),
            this._inst.map
        );

        // AFFICHEUR
        L.easyButton(
            mapOptions.icon.afficheur,
            function () {
                Actions.map.mode_afficheur(this._link);
            },
            Lang.get('ajouter_afficheur'),
            this._inst.map
        );

        // Lancement de l'action pour sélectionner le bouton "place":
        Actions.map.mode_place();

    },
    /**
     * Supprime et remet le drawControl pour utiliser le bon layer
     * @param mode_dessin
     */
    changeDrawToolbar: function (mode_dessin) {
        // 1 : SUPPRIMER L'ANCIENNE TOOLBAR :
        jQuery.isEmptyObject(this._inst.drawControl) ? '' : this._inst.map.removeControl(this._inst.drawControl);

        // 2 : MISE EN PLACE DU NOUVEAU MODE
        this._inst.currentMode = mode_dessin;

        // 2 CONSTRUCTION DES OPTIONS
        // ------- LES POLYLINES ----------
        var polyline = false;
        // ------- LES POLYGONS ----------
        var polygon = (this._inst.currentMode == mapOptions.dessin.place || this._inst.currentMode == mapOptions.dessin.allee || this._inst.currentMode == mapOptions.dessin.zone) ? {
            allowIntersection: false, // Restricts shapes to simple polygons
            drawError: {
                color: '#e1e100', // Color the shape will turn when intersects
                message: Lang.get('administration_parking.carte.erreur_polygon') // Message that will show when intersect
            },
            shapeOptions: {
                color: mapOptions.control.draw.colors[this._inst.currentMode]
            }
        } : false;
        // ------- LES CERCLES ----------
        var circle = false;
        // ------- LES RECTANGLES ----------
        var rectangle = (this._inst.currentMode == mapOptions.dessin.place || this._inst.currentMode == mapOptions.dessin.allee || this._inst.currentMode == mapOptions.dessin.zone) ? {
            shapeOptions: {
                color: mapOptions.control.draw.colors[this._inst.currentMode]
            }
        } : false;
        // ------- LES MARKERS ----------
        var marker = (this._inst.currentMode == mapOptions.dessin.afficheur) ? {icon: new mapOptions.afficheurMarker()} : false;

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
                remove: true
            }
        };


        this._inst.drawControl = new L.Control.Draw(options);
        this._inst.map.addControl(this._inst.drawControl);
    },

    /**
     * Effectue les actions nécessaires au chandement du mode de dessin
     * - Sélection du bouton
     * - Changement contrôle de dessin pour changer de layer
     * @param data
     */
    onModeChange: function (data) {
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
            default:
                this.changeDrawToolbar(mapOptions.dessin.place);
                // Par défaut, on sélectionne le mode place au cas ou
                selectButton(mapOptions.icon.place);
                break;
        }
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

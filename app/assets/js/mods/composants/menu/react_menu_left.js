var React = require('react/addons');
var PanelGroup = require('../react_bootstrap_accordion').PanelGroup;
var PanelA = require('../react_bootstrap_accordion').Panel;
var Glyphicon = ReactB.Glyphicon;

var storeMenuLeft = require('../../stores/stores_menus').menu_left;

var actionMenuLeftDidMount = Actions.menu.menu_left_did_mount;

/**
 * Created by yann on 08/12/2014.
 *
 */
var MenuLeft = React.createClass({
    mixins: [Reflux.ListenerMixin],
    /**
     * Vérification éventuelle des types des propriétés
     */
    propTypes: {
        data: React.PropTypes.array,
        appName: React.PropTypes.string,
        appUrl: React.PropTypes.string
    },
    /**
     * Méthode appellée à la création du composant,
     * initialise les propriétés non définies lors de l'appel avec les valeurs retournées
     * @returns object
     */
    getDefaultProps: function () {
        return {
            data: [],
            appName: "Project Name",
            appUrl: BASE_URI
        };
    },
    /**
     * État initial des données du composant
     * @returns les données de l'état initial
     */
    getInitialState: function () {
        return {data: this.props.data};
    },
    /**
     * Callback appelé lorsque le composant est affiché.
     * C'est par exemple ici qu'on peut faire un appel ajax pour
     * charger ses données dynamiquement !
     */
    componentDidMount: function () {
        this.listenTo(storeMenuLeft, this.handleStoreData);
        actionMenuLeftDidMount();
    },
    /**
     * Test si le composant doit être réaffiché avec les nouvelles données
     * @param nextProps : Nouvelles propriétés
     * @param nextState : Nouvel état
     * @returns {boolean} : true ou false selon si le composant doit être mis à jour
     */
    shouldComponentUpdate: function (nextProps, nextState) {
        return true;
    },
    /**
     * Méthode appellée pour construire le composant.
     * A chaque fois que son contenu est mis à jour.
     * @returns {XML}
     */
    render: function () {
        var items = [];

        // MISE EN FORME DES DONNEES POUR L'AFFICHAGE
        var panelsData = _.map(this.state.data, this.prepareMenuItems, this);


        // PARCOURS DES HEADERS POUR CREER LES ELEMENTS REACT
        var panels = _.map(panelsData, function (child, i, list) {
            var id = "pan-menu-" + child.id;
            return <PanelA
                id={id}
                key={id}
                icon={child.icon}
                title={child.traduction}
                url={child.url}
                collapseData={child.children}
                groupId="accordion-menu-left"
            />;
        }, this);

        return (
            <div>
                <a className="navmenu-brand navmenu-bordered-brand" href={this.props.appUrl}>
                    <Glyphicon glyph="home"/> {this.props.appName}</a>
                <PanelGroup id="accordion-menu-left">
                    {panels}
                </PanelGroup>
            </div>
        )
    },

    prepareMenuItems: function (child, i, list) {
        var temp = _.clone(child);
        temp.url = BASE_URI + child.url;
        temp.traduction = Lang.get('menu.side.' + child.traduction);

        if (child.children.length > 0) {
            temp.children = _.map(child.children, this.prepareMenuItems, this);
        }

        return temp;
    },

    handleStoreData: function (data) {
        this.setState({data: data});
    }
});


module.exports = MenuLeft;
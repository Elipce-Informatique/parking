var React = require('react/addons');
var AccessMixin = require('../../mixins/component_access');
var menuItemsDataStore = require('../../stores/stores_menus').menu_top_items;
var menuUserDataStore = require('../../stores/stores_menus').menu_top_user;
var actionMenuDidMount = Actions.menu.menu_top_did_mount;
var Glyphicon = ReactB.Glyphicon;
var OverlayTrigger = ReactB.OverlayTrigger;
var Tooltip = ReactB.Tooltip;

/**
 * Created by yann on 19/11/2014.
 * Affiche le nom du projet dans un header de navbar
 * @param name : nom a afficher dans le composant
 */
var AppName = React.createClass({
    getDefaultProps: function () {
        return {
            url: "#",
            toggleMenu: false
        };
    },
    /**
     * Test si le composant doit être réaffiché avec les nouvelles données
     * @param nextProps : Nouvelles propriétés
     * @param nextState : Nouvel état
     * @returns {boolean} : true ou false selon si le composant doit être mis à jour
     */
    shouldComponentUpdate: function (nextProps, nextState) {
        return false;
    },
    /**
     * Méthode appellée pour construire le composant.
     * A chaque fois que son contenu est mis à jour.
     * @returns {XML}
     */
    render: function () {

        // CONDITION D'AFFICHAGE DU BOUTON MENU GAUCHE OU DU TITRE DE L'APPLI
        var toggleMenu = this.props.toggleMenu ?
            (<button type="button" className="navbar-toggle navbar-toggle-menuleft" data-toggle="offcanvas" title={Lang.get('global.toggle_menu_left')} data-target=".navmenu" data-canvas="body">
                <a>
                    <Glyphicon glyph="th-list"/>
                </a>
            </button>) : (<a className="navbar-brand" href={this.props.url}>
            <Glyphicon glyph="home"/> {this.props.name}</a>
        );
        return (
            <div className="navbar-header">
                <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                    <span className="sr-only">Toggle navigation</span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                </button>
                    {toggleMenu}
            </div>
        )
    }
});

/**
 * Created by yann on 19/11/2014.
 *
 * @param dataMenu : données à afficher dans le menu au format JSON
 * [
 *  {traduction: "item_1", url: "item_1", active: true, accessible: true},
 *  {traduction: "item_2", url: "item_2", active: false, accessible: true, icon: "star"},
 *  {traduction: "item_3", url: "item_3", active: false, accessible: false, icon: "cloud"}
 * ]
 */
var ListItemsMenu = React.createClass({
    /**
     * Vérification éventuelle des types des propriétés
     */
    propTypes: {
        dataMenu: React.PropTypes.array.isRequired
    },
    /**
     * Méthode appellée à la création du composant,
     * initialise les propriétés non définies lors de l'appel avec les valeurs retournées
     * @returns object
     */
    getDefaultProps: function () {
        return {};
    },
    /**
     * État initial des données du composant
     * @returns les données de l'état initial
     */
    getInitialState: function () {
        return {};
    },
    /**
     * Callback appelé lorsque le composant est affiché.
     * C'est par exemple ici qu'on peut faire un appel ajax pour
     * charger ses données dynamiquement !
     */
    componentDidMount: function () {

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
        var data = this.props.dataMenu;

        var items = [];
        // PARCOURS DES ITEMS DE MENU
        data.forEach(function (item) {
            var libelle = Lang.get("menu.top." + item.traduction);
            var url = (item.accessible ? item.url : "#");
            var classnames = (item.active ? "active " : "") + (item.accessible ? "" : "disabled");
            var props = {
                className: classnames
            }
            var icon = <Glyphicon glyph={item.icon}/>;

            items.push(
                <li key={item.id} {...props}>
                    <a href={url}>
                        {icon} {libelle}</a>
                </li>
            );
        });
        return (
            <ul className="nav navbar-nav navbar-left">
                {items}
            </ul>
        )
    }
});

/**
 * Created by yann on 19/11/2014.
 *
 * Composant placé à droite du menu haut pour afficher les infos de l'utilisateur
 * @param nomUtilisateur : nom de l'utilisateur
 * @param logoutRoute : url de logout de l'application
 * @param logoutText : Texte pour le bouton logout
 * @param dropdown : menu déroulant contenant les raccourcis de l'utilisateur
 * [
 *  {label: "profil", route:"/utilisateur/120"},
 *  {label: "parametres", route:"/parametres"}
 * ]
 */
var UserInfos = React.createClass({
    /**
     * Vérification éventuelle des types des propriétés
     */
    propTypes: {
        nomUtilisateur: React.PropTypes.string,
        logoutRoute: React.PropTypes.string,
        logoutText: React.PropTypes.string,
        dropdown: React.PropTypes.array
    },
    /**
     * Méthode appellée à la création du composant,
     * initialise les propriétés non définies lors de l'appel avec les valeurs retournées
     * @returns object
     */
    getDefaultProps: function () {
        return {dropdown: []};
    },
    /**
     * État initial des données du composant
     * @returns les données de l'état initial
     */
    getInitialState: function () {
        return {};
    },
    /**
     * Callback appelé lorsque le composant est affiché.
     * C'est par exemple ici qu'on peut faire un appel ajax pour
     * charger ses données dynamiquement !
     */
    componentDidMount: function () {

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
        var dropdown = this.getDropdown();

        return (
            <ul className="nav navbar-nav navbar-right">
                <li className="dropdown">
                    <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
                        <Glyphicon glyph="user"/> {this.props.nomUtilisateur}
                        <span className="caret"></span>
                    </a>
                    {dropdown}
                </li>
            </ul>
        );
    },
    getDropdown: function () {
        var itemsDrop = [];
        this.props.dropdown.forEach(function (link) {
            var item = <li key={link.route}>
                <a href={link.route}>{link.label}</a>
            </li>;
            itemsDrop.push(item);
        });
        return (
            <ul className="dropdown-menu" role="menu">
                {itemsDrop}
                <li className="divider"></li>
                <li>
                    <a href={this.props.logoutRoute}>{this.props.logoutText}</a>
                </li>
            </ul>
        );
    }
});

/**
 * Created by yann on 18/11/2014.
 * Composant de base du menu top utilisateur
 *
 * @param appName : Nom de l'application à afficher en haut à gauche
 * @param appUrl : Url associée au nom de l'application (typiquement l'accueil)
 */
var MenuTop = React.createClass({
    mixins: [Reflux.ListenerMixin],
    propTypes: {
        // You can declare that a prop is a specific JS primitive. By default, these
        // are all optional.
        appName: React.PropTypes.string.isRequired,
        appUrl: React.PropTypes.string.isRequired
    },
    /**
     * Méthode appellée à la création du composant,
     * initialise les propriétés non définies lors de l'appel avec les valeurs retournées
     * @returns object
     */
    getDefaultProps: function () {
        return {
            appName: "Mon Application",
            appUrl: BASE_URI
        };
    },
    getInitialState: function () {
        var state = {
            userInfos: {},
            dataItems: []
        }
        return state;
    },
    componentWillMount: function () {
        this.listenTo(menuUserDataStore, this.refreshUserInfos);
        this.listenTo(menuItemsDataStore, this.refreshDataItems);
    },
    componentDidMount: function () {
        // TRIGGER DE L'ACTION POUR CHARGER LES DATA
        actionMenuDidMount();
    },
    /**
     * Méthode appellée pour construire le composant.
     * A chaque fois que son contenu est mis à jour.
     * @returns {XML}
     */
    render: function () {
        var appName = {};
        if (Auth.menu_left.length != 0) {
            appName = <AppName toggleMenu={true} name={this.props.appName} url={this.props.appUrl} />;
        }
        else {
            appName = <AppName toggleMenu={false} name={this.props.appName} url={this.props.appUrl} />;
        }
        return (
            <div className="container-fluid">
                {appName}
                <div id="navbar" className="navbar-collapse collapse">
                    <ListItemsMenu dataMenu={this.state.dataItems} />

                    <UserInfos {...this.state.userInfos} />
                </div>
            </div>
        );
    },
    refreshUserInfos: function (infos) {
        this.setState({userInfos: infos});
    },
    refreshDataItems: function (data) {
        this.setState({dataItems: data});
    }
});


module.exports = MenuTop;
/**
 * Created by yann on 19/11/2014.
 * Affiche le nom du projet dans un header de navbar
 * @param name : nom a afficher dans le composant
 */
var AppName = React.createClass({
    getDefaultProps: function () {
        return {
            name: "Mon Application",
            url: "#"
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
        return (
            <div className="navbar-header">
                <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                    <span className="sr-only">Toggle navigation</span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                </button>
                <a className="navbar-brand" href={this.props.url}>{this.props.name}</a>
            </div>
        )
    }
});

/**
 * Created by yann on 19/11/2014.
 *
 * TODO : Snippet de base pour un composant react. Commentaire à éditer
 * @param dataMenu : données à afficher dans le menu au format JSON
 * [
 *  {label: "item_1", url: "http://toto.com/item_1", active: true, accessible: true},
 *  {label: "item_2", url: "http://toto.com/item_2", active: false, accessible: true, icon: "glyphicon glyphicon-star"},
 *  {label: "item_3", url: "http://toto.com/item_3", active: false, accessible: false, icon: "glyphicon glyphicon-cloud"}
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
        data.forEach(function (item) {
            var libelle = Lang.get("menu.top." + item.label);
            var url = (item.accessible ? item.url : "#")
            var classnames = (item.active ? "active " : "") + (item.accessible ? "" : "disabled");
            var props = {
                className: classnames
            }

            items.push(
                <li key={item.label} {...props}>
                    <a href={url}>{libelle}</a>
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
                        <i className="glyphicon glyphicon-user"></i> {this.props.nomUtilisateur}
                        <span className="caret"></span>
                    </a>
                    {dropdown}
                </li>
            </ul>
        );
    },
    getDropdown: function () {
        var itemsDrop = [];
        this.props.dropdown.forEach(function(){

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
 * @param menuDataUrl : Url pour aller chercher les données contenues qui composent le menu
 * @param userDataUrl : Url pour aller chercher les données de l'utilisateur
 */
var MenuTop = React.createClass({
    propTypes: {
        // You can declare that a prop is a specific JS primitive. By default, these
        // are all optional.
        appName: React.PropTypes.string.isRequired,
        appUrl: React.PropTypes.string.isRequired,
        menuDataUrl: React.PropTypes.string.isRequired,
        userDataUrl: React.PropTypes.string.isRequired
    },
    /**
     * Méthode appellée à la création du composant,
     * initialise les propriétés non définies lors de l'appel avec les valeurs retournées
     * @returns object
     */
    getDefaultProps: function () {
        return {
            appName: "Mon Application",
            appUrl: ""
        };
    },
    getInitialState: function () {
        var state = {
            userInfos: this.getUserInfos(),
            dataItems: this.getDataItems()
        }
        return state;
    },
    /**
     * Méthode appellée pour construire le composant.
     * A chaque fois que son contenu est mis à jour.
     * @returns {XML}
     */
    render: function () {
        return (
            <div className="container-fluid">
                <AppName name={this.props.appName} url={this.props.appUrl} />
                <div id="navbar" className="navbar-collapse collapse">
                    <ListItemsMenu dataMenu={this.state.dataItems} />

                    <UserInfos {...this.state.userInfos} />
                </div>
            </div>
        )
    },
    getUserInfos: function () {
        // TODO : requête AJAX
        var infos = {
            nomUtilisateur: "JEAN Guy",
            logoutRoute: BASE_URI + "logout",
            logoutText: "Logout",
            dropdown: []
        }
        return infos;
    },
    getDataItems: function () {
        // TODO : requête AJAX
        return [
            {
                label: "item_1",
                url: "http://toto.com/item_1",
                active: true,
                accessible: true
            },
            {
                label: "item_2",
                url: "http://toto.com/item_2",
                active: false,
                accessible: true,
                icon: "glyphicon glyphicon-star"
            },
            {
                label: "item_3",
                url: "http://toto.com/item_3",
                active: false,
                accessible: false,
                icon: "glyphicon glyphicon-cloud"
            }];
    }
});


module.exports = MenuTop;
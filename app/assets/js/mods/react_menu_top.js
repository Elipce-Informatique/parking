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
        dataMenu: React.PropTypes.object.isRequired
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
 * TODO : Snippet de base pour un composant react. Commentaire à éditer
 * @param name : nom a afficher dans le composant
 */
var UserInfos = React.createClass({
    /**
     * Vérification éventuelle des types des propriétés
     */
    propTypes: {},
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
        var profil = Lang.get('')
        return (
            <ul className="nav navbar-nav navbar-right">
                <li className="dropdown">
                    <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
                        <i className="glyphicon glyphicon-user"></i> Jean Guy <span className="caret"></span>
                        </a>
                        <ul className="dropdown-menu" role="menu">
                            <li>
                                <a href="#">Action</a>
                            </li>
                            <li>
                                <a href="#">Another action</a>
                            </li>
                            <li>
                                <a href="#">Something else here</a>
                            </li>
                            <li className="divider"></li>
                            <li>
                                <a href="#">Separated link</a>
                            </li>
                        </ul>
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
            *                      TODO : définir la structure de ce retour (nom, url, acces, actif)
            * @param userDataUrl : Url pour aller chercher les données de l'utilisateur
            *                      TODO : Définir la structure de ces données
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
                appUrl: "#"
                };
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
                <ListItemsMenu dataMenu={dataItems} />
                <UserInfos />
                </div>
                </div>
                )
                }
                });

            var dataItems = [
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

            module.exports = MenuTop;
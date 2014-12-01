(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./app/assets/js/global/menu.app.js":[function(require,module,exports){
/**
 * Created by yann on 18/11/2014.
 * Instantiation des menus de l'application
 */
var MenuTop = require('.././mods/react_menu_top');

$(function () {

    // Création du menu d'en haut si la page le permet
    if (document.getElementById('menu-top')) {
        // Variables du menu
        var name = Lang.get('global.app_name');

        React.render(React.createElement(MenuTop, {appName: name}), document.getElementById('menu-top'));
    }
});

},{".././mods/react_menu_top":"C:\\Program Files (x86)\\EasyPHP-DevServer-14.1VC11\\data\\localweb\\elipce_workflow\\app\\assets\\js\\mods\\react_menu_top.js"}],"C:\\Program Files (x86)\\EasyPHP-DevServer-14.1VC11\\data\\localweb\\elipce_workflow\\app\\assets\\js\\mods\\mixins\\component_access.js":[function(require,module,exports){
/**
 * Utilise la variable de classe
 * @type {{componentWillMount: Function}}
 */
var AuthentLevelMixin = {
    componentWillMount: function () {
        this._originalRender = this.render;
        this._setRenderMethod();
    },
    componentWillUpdate: function () {
        this._setRenderMethod();
    },
    _emptyRender: function () {
        return React.createElement("span", null);
    },
    _setRenderMethod: function () {
        this.render = Auth.canAccess(this.module_url) ? this._originalRender : this._emptyRender;
    }
}

module.exports = AuthentLevelMixin;
},{}],"C:\\Program Files (x86)\\EasyPHP-DevServer-14.1VC11\\data\\localweb\\elipce_workflow\\app\\assets\\js\\mods\\react_menu_top.js":[function(require,module,exports){
var AccessMixin = require('./mixins/component_access');

var actionMenuDidMount = Reflux.createAction();

/**
 * Gère les données à afficher dans la lsite des items de menu
 */
var menuItemsDataStore = Reflux.createStore({
    // Initial setup
    init: function () {
        // Register statusUpdate action
        this.listenTo(actionMenuDidMount, this.fetchMenuData);
    },
    fetchMenuData: function () {
        var data = Auth.menu_top.items;
        data.forEach(function (item, i) {
            item.active = false;
            item.accessible = (item.accessible ? true : false);

            data[i] = item;
        });
        this.trigger(data);
    }
});

/**
 * Gère les données à afficher dans le menu utilisateur
 */
var menuUserDataStore = Reflux.createStore({
    // Initial setup
    init: function () {
        // Register statusUpdate action
        this.listenTo(actionMenuDidMount, this.fetchUserData);
    },
    fetchUserData: function () {
        var data = Auth.menu_top.user;
        this.trigger(data);
    }
});

/**
 * Created by yann on 19/11/2014.
 * Affiche le nom du projet dans un header de navbar
 * @param name : nom a afficher dans le composant
 */
var AppName = React.createClass({displayName: 'AppName',
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
            React.createElement("div", {className: "navbar-header"}, 
                React.createElement("button", {type: "button", className: "navbar-toggle collapsed", 'data-toggle': "collapse", 'data-target': "#navbar", 'aria-expanded': "false", 'aria-controls': "navbar"}, 
                    React.createElement("span", {className: "sr-only"}, "Toggle navigation"), 
                    React.createElement("span", {className: "icon-bar"}), 
                    React.createElement("span", {className: "icon-bar"}), 
                    React.createElement("span", {className: "icon-bar"})
                ), 
                React.createElement("a", {className: "navbar-brand", href: this.props.url}, this.props.name)
            )
        )
    }
});

/**
 * Created by yann on 19/11/2014.
 *
 * TODO : Snippet de base pour un composant react. Commentaire à éditer
 * @param dataMenu : données à afficher dans le menu au format JSON
 * [
 *  {traduction: "item_1", url: "item_1", active: true, accessible: true},
 *  {traduction: "item_2", url: "item_2", active: false, accessible: true, icon: "glyphicon glyphicon-star"},
 *  {traduction: "item_3", url: "item_3", active: false, accessible: false, icon: "glyphicon glyphicon-cloud"}
 * ]
 */
var ListItemsMenu = React.createClass({displayName: 'ListItemsMenu',
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

            items.push(
                React.createElement("li", React.__spread({key: item.id},  props), 
                    React.createElement("a", {href: url}, libelle)
                )
            );
        });
        return (
            React.createElement("ul", {className: "nav navbar-nav navbar-left"}, 
                items
            )
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
var UserInfos = React.createClass({displayName: 'UserInfos',
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
            React.createElement("ul", {className: "nav navbar-nav navbar-right"}, 
                React.createElement("li", {className: "dropdown"}, 
                    React.createElement("a", {href: "#", className: "dropdown-toggle", 'data-toggle': "dropdown", role: "button", 'aria-expanded': "false"}, 
                        React.createElement("i", {className: "glyphicon glyphicon-user"}), " ", this.props.nomUtilisateur, 
                        React.createElement("span", {className: "caret"})
                    ), 
                    dropdown
                )
            )
        );
    },
    getDropdown: function () {
        var itemsDrop = [];
        this.props.dropdown.forEach(function (link) {
            var item = React.createElement("li", {key: link.route}, 
                React.createElement("a", {href: link.route}, link.label)
            );
            itemsDrop.push(item);
        });
        return (
            React.createElement("ul", {className: "dropdown-menu", role: "menu"}, 
                itemsDrop, 
                React.createElement("li", {className: "divider"}), 
                React.createElement("li", null, 
                    React.createElement("a", {href: this.props.logoutRoute}, this.props.logoutText)
                )
            )
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
var MenuTop = React.createClass({displayName: 'MenuTop',
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
            appUrl: BASE_URI,
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
        return (
            React.createElement("div", {className: "container-fluid"}, 
                React.createElement(AppName, {name: this.props.appName, url: this.props.appUrl}), 
                React.createElement("div", {id: "navbar", className: "navbar-collapse collapse"}, 
                    React.createElement(ListItemsMenu, {dataMenu: this.state.dataItems}), 

                    React.createElement(UserInfos, React.__spread({},  this.state.userInfos))
                )
            )
        )
    },
    refreshUserInfos: function (infos) {
        this.setState({userInfos: infos});
    },
    refreshDataItems: function (data) {
        this.setState({dataItems: data});
    }
});


module.exports = MenuTop;
},{"./mixins/component_access":"C:\\Program Files (x86)\\EasyPHP-DevServer-14.1VC11\\data\\localweb\\elipce_workflow\\app\\assets\\js\\mods\\mixins\\component_access.js"}]},{},["./app/assets/js/global/menu.app.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiYXBwXFxhc3NldHNcXGpzXFxnbG9iYWxcXG1lbnUuYXBwLmpzIiwiYXBwXFxhc3NldHNcXGpzXFxtb2RzXFxtaXhpbnNcXGNvbXBvbmVudF9hY2Nlc3MuanMiLCJhcHBcXGFzc2V0c1xcanNcXG1vZHNcXHJlYWN0X21lbnVfdG9wLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogQ3JlYXRlZCBieSB5YW5uIG9uIDE4LzExLzIwMTQuXG4gKiBJbnN0YW50aWF0aW9uIGRlcyBtZW51cyBkZSBsJ2FwcGxpY2F0aW9uXG4gKi9cbnZhciBNZW51VG9wID0gcmVxdWlyZSgnLi4vLi9tb2RzL3JlYWN0X21lbnVfdG9wJyk7XG5cbiQoZnVuY3Rpb24gKCkge1xuXG4gICAgLy8gQ3LDqWF0aW9uIGR1IG1lbnUgZCdlbiBoYXV0IHNpIGxhIHBhZ2UgbGUgcGVybWV0XG4gICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZW51LXRvcCcpKSB7XG4gICAgICAgIC8vIFZhcmlhYmxlcyBkdSBtZW51XG4gICAgICAgIHZhciBuYW1lID0gTGFuZy5nZXQoJ2dsb2JhbC5hcHBfbmFtZScpO1xuXG4gICAgICAgIFJlYWN0LnJlbmRlcihSZWFjdC5jcmVhdGVFbGVtZW50KE1lbnVUb3AsIHthcHBOYW1lOiBuYW1lfSksIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZW51LXRvcCcpKTtcbiAgICB9XG59KTtcbiIsIi8qKlxuICogVXRpbGlzZSBsYSB2YXJpYWJsZSBkZSBjbGFzc2VcbiAqIEB0eXBlIHt7Y29tcG9uZW50V2lsbE1vdW50OiBGdW5jdGlvbn19XG4gKi9cbnZhciBBdXRoZW50TGV2ZWxNaXhpbiA9IHtcbiAgICBjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fb3JpZ2luYWxSZW5kZXIgPSB0aGlzLnJlbmRlcjtcbiAgICAgICAgdGhpcy5fc2V0UmVuZGVyTWV0aG9kKCk7XG4gICAgfSxcbiAgICBjb21wb25lbnRXaWxsVXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX3NldFJlbmRlck1ldGhvZCgpO1xuICAgIH0sXG4gICAgX2VtcHR5UmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCBudWxsKTtcbiAgICB9LFxuICAgIF9zZXRSZW5kZXJNZXRob2Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5yZW5kZXIgPSBBdXRoLmNhbkFjY2Vzcyh0aGlzLm1vZHVsZV91cmwpID8gdGhpcy5fb3JpZ2luYWxSZW5kZXIgOiB0aGlzLl9lbXB0eVJlbmRlcjtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQXV0aGVudExldmVsTWl4aW47IiwidmFyIEFjY2Vzc01peGluID0gcmVxdWlyZSgnLi9taXhpbnMvY29tcG9uZW50X2FjY2VzcycpO1xuXG52YXIgYWN0aW9uTWVudURpZE1vdW50ID0gUmVmbHV4LmNyZWF0ZUFjdGlvbigpO1xuXG4vKipcbiAqIEfDqHJlIGxlcyBkb25uw6llcyDDoCBhZmZpY2hlciBkYW5zIGxhIGxzaXRlIGRlcyBpdGVtcyBkZSBtZW51XG4gKi9cbnZhciBtZW51SXRlbXNEYXRhU3RvcmUgPSBSZWZsdXguY3JlYXRlU3RvcmUoe1xuICAgIC8vIEluaXRpYWwgc2V0dXBcbiAgICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIFJlZ2lzdGVyIHN0YXR1c1VwZGF0ZSBhY3Rpb25cbiAgICAgICAgdGhpcy5saXN0ZW5UbyhhY3Rpb25NZW51RGlkTW91bnQsIHRoaXMuZmV0Y2hNZW51RGF0YSk7XG4gICAgfSxcbiAgICBmZXRjaE1lbnVEYXRhOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBkYXRhID0gQXV0aC5tZW51X3RvcC5pdGVtcztcbiAgICAgICAgZGF0YS5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtLCBpKSB7XG4gICAgICAgICAgICBpdGVtLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgaXRlbS5hY2Nlc3NpYmxlID0gKGl0ZW0uYWNjZXNzaWJsZSA/IHRydWUgOiBmYWxzZSk7XG5cbiAgICAgICAgICAgIGRhdGFbaV0gPSBpdGVtO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy50cmlnZ2VyKGRhdGEpO1xuICAgIH1cbn0pO1xuXG4vKipcbiAqIEfDqHJlIGxlcyBkb25uw6llcyDDoCBhZmZpY2hlciBkYW5zIGxlIG1lbnUgdXRpbGlzYXRldXJcbiAqL1xudmFyIG1lbnVVc2VyRGF0YVN0b3JlID0gUmVmbHV4LmNyZWF0ZVN0b3JlKHtcbiAgICAvLyBJbml0aWFsIHNldHVwXG4gICAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBSZWdpc3RlciBzdGF0dXNVcGRhdGUgYWN0aW9uXG4gICAgICAgIHRoaXMubGlzdGVuVG8oYWN0aW9uTWVudURpZE1vdW50LCB0aGlzLmZldGNoVXNlckRhdGEpO1xuICAgIH0sXG4gICAgZmV0Y2hVc2VyRGF0YTogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZGF0YSA9IEF1dGgubWVudV90b3AudXNlcjtcbiAgICAgICAgdGhpcy50cmlnZ2VyKGRhdGEpO1xuICAgIH1cbn0pO1xuXG4vKipcbiAqIENyZWF0ZWQgYnkgeWFubiBvbiAxOS8xMS8yMDE0LlxuICogQWZmaWNoZSBsZSBub20gZHUgcHJvamV0IGRhbnMgdW4gaGVhZGVyIGRlIG5hdmJhclxuICogQHBhcmFtIG5hbWUgOiBub20gYSBhZmZpY2hlciBkYW5zIGxlIGNvbXBvc2FudFxuICovXG52YXIgQXBwTmFtZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ0FwcE5hbWUnLFxuICAgIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbmFtZTogXCJNb24gQXBwbGljYXRpb25cIixcbiAgICAgICAgICAgIHVybDogXCIjXCJcbiAgICAgICAgfTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFRlc3Qgc2kgbGUgY29tcG9zYW50IGRvaXQgw6p0cmUgcsOpYWZmaWNow6kgYXZlYyBsZXMgbm91dmVsbGVzIGRvbm7DqWVzXG4gICAgICogQHBhcmFtIG5leHRQcm9wcyA6IE5vdXZlbGxlcyBwcm9wcmnDqXTDqXNcbiAgICAgKiBAcGFyYW0gbmV4dFN0YXRlIDogTm91dmVsIMOpdGF0XG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IDogdHJ1ZSBvdSBmYWxzZSBzZWxvbiBzaSBsZSBjb21wb3NhbnQgZG9pdCDDqnRyZSBtaXMgw6Agam91clxuICAgICAqL1xuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZTogZnVuY3Rpb24gKG5leHRQcm9wcywgbmV4dFN0YXRlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIE3DqXRob2RlIGFwcGVsbMOpZSBwb3VyIGNvbnN0cnVpcmUgbGUgY29tcG9zYW50LlxuICAgICAqIEEgY2hhcXVlIGZvaXMgcXVlIHNvbiBjb250ZW51IGVzdCBtaXMgw6Agam91ci5cbiAgICAgKiBAcmV0dXJucyB7WE1MfVxuICAgICAqL1xuICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIm5hdmJhci1oZWFkZXJcIn0sIFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIiwge3R5cGU6IFwiYnV0dG9uXCIsIGNsYXNzTmFtZTogXCJuYXZiYXItdG9nZ2xlIGNvbGxhcHNlZFwiLCAnZGF0YS10b2dnbGUnOiBcImNvbGxhcHNlXCIsICdkYXRhLXRhcmdldCc6IFwiI25hdmJhclwiLCAnYXJpYS1leHBhbmRlZCc6IFwiZmFsc2VcIiwgJ2FyaWEtY29udHJvbHMnOiBcIm5hdmJhclwifSwgXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtjbGFzc05hbWU6IFwic3Itb25seVwifSwgXCJUb2dnbGUgbmF2aWdhdGlvblwiKSwgXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtjbGFzc05hbWU6IFwiaWNvbi1iYXJcIn0pLCBcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge2NsYXNzTmFtZTogXCJpY29uLWJhclwifSksIFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7Y2xhc3NOYW1lOiBcImljb24tYmFyXCJ9KVxuICAgICAgICAgICAgICAgICksIFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHtjbGFzc05hbWU6IFwibmF2YmFyLWJyYW5kXCIsIGhyZWY6IHRoaXMucHJvcHMudXJsfSwgdGhpcy5wcm9wcy5uYW1lKVxuICAgICAgICAgICAgKVxuICAgICAgICApXG4gICAgfVxufSk7XG5cbi8qKlxuICogQ3JlYXRlZCBieSB5YW5uIG9uIDE5LzExLzIwMTQuXG4gKlxuICogVE9ETyA6IFNuaXBwZXQgZGUgYmFzZSBwb3VyIHVuIGNvbXBvc2FudCByZWFjdC4gQ29tbWVudGFpcmUgw6Agw6lkaXRlclxuICogQHBhcmFtIGRhdGFNZW51IDogZG9ubsOpZXMgw6AgYWZmaWNoZXIgZGFucyBsZSBtZW51IGF1IGZvcm1hdCBKU09OXG4gKiBbXG4gKiAge3RyYWR1Y3Rpb246IFwiaXRlbV8xXCIsIHVybDogXCJpdGVtXzFcIiwgYWN0aXZlOiB0cnVlLCBhY2Nlc3NpYmxlOiB0cnVlfSxcbiAqICB7dHJhZHVjdGlvbjogXCJpdGVtXzJcIiwgdXJsOiBcIml0ZW1fMlwiLCBhY3RpdmU6IGZhbHNlLCBhY2Nlc3NpYmxlOiB0cnVlLCBpY29uOiBcImdseXBoaWNvbiBnbHlwaGljb24tc3RhclwifSxcbiAqICB7dHJhZHVjdGlvbjogXCJpdGVtXzNcIiwgdXJsOiBcIml0ZW1fM1wiLCBhY3RpdmU6IGZhbHNlLCBhY2Nlc3NpYmxlOiBmYWxzZSwgaWNvbjogXCJnbHlwaGljb24gZ2x5cGhpY29uLWNsb3VkXCJ9XG4gKiBdXG4gKi9cbnZhciBMaXN0SXRlbXNNZW51ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiAnTGlzdEl0ZW1zTWVudScsXG4gICAgLyoqXG4gICAgICogVsOpcmlmaWNhdGlvbiDDqXZlbnR1ZWxsZSBkZXMgdHlwZXMgZGVzIHByb3ByacOpdMOpc1xuICAgICAqL1xuICAgIHByb3BUeXBlczoge1xuICAgICAgICBkYXRhTWVudTogUmVhY3QuUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWRcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIE3DqXRob2RlIGFwcGVsbMOpZSDDoCBsYSBjcsOpYXRpb24gZHUgY29tcG9zYW50LFxuICAgICAqIGluaXRpYWxpc2UgbGVzIHByb3ByacOpdMOpcyBub24gZMOpZmluaWVzIGxvcnMgZGUgbCdhcHBlbCBhdmVjIGxlcyB2YWxldXJzIHJldG91cm7DqWVzXG4gICAgICogQHJldHVybnMgb2JqZWN0XG4gICAgICovXG4gICAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB7fTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIMOJdGF0IGluaXRpYWwgZGVzIGRvbm7DqWVzIGR1IGNvbXBvc2FudFxuICAgICAqIEByZXR1cm5zIGxlcyBkb25uw6llcyBkZSBsJ8OpdGF0IGluaXRpYWxcbiAgICAgKi9cbiAgICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogQ2FsbGJhY2sgYXBwZWzDqSBsb3JzcXVlIGxlIGNvbXBvc2FudCBlc3QgYWZmaWNow6kuXG4gICAgICogQydlc3QgcGFyIGV4ZW1wbGUgaWNpIHF1J29uIHBldXQgZmFpcmUgdW4gYXBwZWwgYWpheCBwb3VyXG4gICAgICogY2hhcmdlciBzZXMgZG9ubsOpZXMgZHluYW1pcXVlbWVudCAhXG4gICAgICovXG4gICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uICgpIHtcblxuICAgIH0sXG4gICAgLyoqXG4gICAgICogVGVzdCBzaSBsZSBjb21wb3NhbnQgZG9pdCDDqnRyZSByw6lhZmZpY2jDqSBhdmVjIGxlcyBub3V2ZWxsZXMgZG9ubsOpZXNcbiAgICAgKiBAcGFyYW0gbmV4dFByb3BzIDogTm91dmVsbGVzIHByb3ByacOpdMOpc1xuICAgICAqIEBwYXJhbSBuZXh0U3RhdGUgOiBOb3V2ZWwgw6l0YXRcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gOiB0cnVlIG91IGZhbHNlIHNlbG9uIHNpIGxlIGNvbXBvc2FudCBkb2l0IMOqdHJlIG1pcyDDoCBqb3VyXG4gICAgICovXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlOiBmdW5jdGlvbiAobmV4dFByb3BzLCBuZXh0U3RhdGUpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBNw6l0aG9kZSBhcHBlbGzDqWUgcG91ciBjb25zdHJ1aXJlIGxlIGNvbXBvc2FudC5cbiAgICAgKiBBIGNoYXF1ZSBmb2lzIHF1ZSBzb24gY29udGVudSBlc3QgbWlzIMOgIGpvdXIuXG4gICAgICogQHJldHVybnMge1hNTH1cbiAgICAgKi9cbiAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLnByb3BzLmRhdGFNZW51O1xuXG4gICAgICAgIHZhciBpdGVtcyA9IFtdO1xuICAgICAgICAvLyBQQVJDT1VSUyBERVMgSVRFTVMgREUgTUVOVVxuICAgICAgICBkYXRhLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIHZhciBsaWJlbGxlID0gTGFuZy5nZXQoXCJtZW51LnRvcC5cIiArIGl0ZW0udHJhZHVjdGlvbik7XG4gICAgICAgICAgICB2YXIgdXJsID0gKGl0ZW0uYWNjZXNzaWJsZSA/IGl0ZW0udXJsIDogXCIjXCIpO1xuICAgICAgICAgICAgdmFyIGNsYXNzbmFtZXMgPSAoaXRlbS5hY3RpdmUgPyBcImFjdGl2ZSBcIiA6IFwiXCIpICsgKGl0ZW0uYWNjZXNzaWJsZSA/IFwiXCIgOiBcImRpc2FibGVkXCIpO1xuICAgICAgICAgICAgdmFyIHByb3BzID0ge1xuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogY2xhc3NuYW1lc1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpdGVtcy5wdXNoKFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCBSZWFjdC5fX3NwcmVhZCh7a2V5OiBpdGVtLmlkfSwgIHByb3BzKSwgXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHtocmVmOiB1cmx9LCBsaWJlbGxlKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInVsXCIsIHtjbGFzc05hbWU6IFwibmF2IG5hdmJhci1uYXYgbmF2YmFyLWxlZnRcIn0sIFxuICAgICAgICAgICAgICAgIGl0ZW1zXG4gICAgICAgICAgICApXG4gICAgICAgIClcbiAgICB9XG59KTtcblxuLyoqXG4gKiBDcmVhdGVkIGJ5IHlhbm4gb24gMTkvMTEvMjAxNC5cbiAqXG4gKiBDb21wb3NhbnQgcGxhY8OpIMOgIGRyb2l0ZSBkdSBtZW51IGhhdXQgcG91ciBhZmZpY2hlciBsZXMgaW5mb3MgZGUgbCd1dGlsaXNhdGV1clxuICogQHBhcmFtIG5vbVV0aWxpc2F0ZXVyIDogbm9tIGRlIGwndXRpbGlzYXRldXJcbiAqIEBwYXJhbSBsb2dvdXRSb3V0ZSA6IHVybCBkZSBsb2dvdXQgZGUgbCdhcHBsaWNhdGlvblxuICogQHBhcmFtIGxvZ291dFRleHQgOiBUZXh0ZSBwb3VyIGxlIGJvdXRvbiBsb2dvdXRcbiAqIEBwYXJhbSBkcm9wZG93biA6IG1lbnUgZMOpcm91bGFudCBjb250ZW5hbnQgbGVzIHJhY2NvdXJjaXMgZGUgbCd1dGlsaXNhdGV1clxuICogW1xuICogIHtsYWJlbDogXCJwcm9maWxcIiwgcm91dGU6XCIvdXRpbGlzYXRldXIvMTIwXCJ9LFxuICogIHtsYWJlbDogXCJwYXJhbWV0cmVzXCIsIHJvdXRlOlwiL3BhcmFtZXRyZXNcIn1cbiAqIF1cbiAqL1xudmFyIFVzZXJJbmZvcyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ1VzZXJJbmZvcycsXG4gICAgLyoqXG4gICAgICogVsOpcmlmaWNhdGlvbiDDqXZlbnR1ZWxsZSBkZXMgdHlwZXMgZGVzIHByb3ByacOpdMOpc1xuICAgICAqL1xuICAgIHByb3BUeXBlczoge1xuICAgICAgICBub21VdGlsaXNhdGV1cjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgbG9nb3V0Um91dGU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIGxvZ291dFRleHQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIGRyb3Bkb3duOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIE3DqXRob2RlIGFwcGVsbMOpZSDDoCBsYSBjcsOpYXRpb24gZHUgY29tcG9zYW50LFxuICAgICAqIGluaXRpYWxpc2UgbGVzIHByb3ByacOpdMOpcyBub24gZMOpZmluaWVzIGxvcnMgZGUgbCdhcHBlbCBhdmVjIGxlcyB2YWxldXJzIHJldG91cm7DqWVzXG4gICAgICogQHJldHVybnMgb2JqZWN0XG4gICAgICovXG4gICAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB7ZHJvcGRvd246IFtdfTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIMOJdGF0IGluaXRpYWwgZGVzIGRvbm7DqWVzIGR1IGNvbXBvc2FudFxuICAgICAqIEByZXR1cm5zIGxlcyBkb25uw6llcyBkZSBsJ8OpdGF0IGluaXRpYWxcbiAgICAgKi9cbiAgICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogQ2FsbGJhY2sgYXBwZWzDqSBsb3JzcXVlIGxlIGNvbXBvc2FudCBlc3QgYWZmaWNow6kuXG4gICAgICogQydlc3QgcGFyIGV4ZW1wbGUgaWNpIHF1J29uIHBldXQgZmFpcmUgdW4gYXBwZWwgYWpheCBwb3VyXG4gICAgICogY2hhcmdlciBzZXMgZG9ubsOpZXMgZHluYW1pcXVlbWVudCAhXG4gICAgICovXG4gICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uICgpIHtcblxuICAgIH0sXG4gICAgLyoqXG4gICAgICogVGVzdCBzaSBsZSBjb21wb3NhbnQgZG9pdCDDqnRyZSByw6lhZmZpY2jDqSBhdmVjIGxlcyBub3V2ZWxsZXMgZG9ubsOpZXNcbiAgICAgKiBAcGFyYW0gbmV4dFByb3BzIDogTm91dmVsbGVzIHByb3ByacOpdMOpc1xuICAgICAqIEBwYXJhbSBuZXh0U3RhdGUgOiBOb3V2ZWwgw6l0YXRcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gOiB0cnVlIG91IGZhbHNlIHNlbG9uIHNpIGxlIGNvbXBvc2FudCBkb2l0IMOqdHJlIG1pcyDDoCBqb3VyXG4gICAgICovXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlOiBmdW5jdGlvbiAobmV4dFByb3BzLCBuZXh0U3RhdGUpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBNw6l0aG9kZSBhcHBlbGzDqWUgcG91ciBjb25zdHJ1aXJlIGxlIGNvbXBvc2FudC5cbiAgICAgKiBBIGNoYXF1ZSBmb2lzIHF1ZSBzb24gY29udGVudSBlc3QgbWlzIMOgIGpvdXIuXG4gICAgICogQHJldHVybnMge1hNTH1cbiAgICAgKi9cbiAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGRyb3Bkb3duID0gdGhpcy5nZXREcm9wZG93bigpO1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidWxcIiwge2NsYXNzTmFtZTogXCJuYXYgbmF2YmFyLW5hdiBuYXZiYXItcmlnaHRcIn0sIFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCB7Y2xhc3NOYW1lOiBcImRyb3Bkb3duXCJ9LCBcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwge2hyZWY6IFwiI1wiLCBjbGFzc05hbWU6IFwiZHJvcGRvd24tdG9nZ2xlXCIsICdkYXRhLXRvZ2dsZSc6IFwiZHJvcGRvd25cIiwgcm9sZTogXCJidXR0b25cIiwgJ2FyaWEtZXhwYW5kZWQnOiBcImZhbHNlXCJ9LCBcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpXCIsIHtjbGFzc05hbWU6IFwiZ2x5cGhpY29uIGdseXBoaWNvbi11c2VyXCJ9KSwgXCIgXCIsIHRoaXMucHJvcHMubm9tVXRpbGlzYXRldXIsIFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge2NsYXNzTmFtZTogXCJjYXJldFwifSlcbiAgICAgICAgICAgICAgICAgICAgKSwgXG4gICAgICAgICAgICAgICAgICAgIGRyb3Bkb3duXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuICAgICAgICApO1xuICAgIH0sXG4gICAgZ2V0RHJvcGRvd246IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGl0ZW1zRHJvcCA9IFtdO1xuICAgICAgICB0aGlzLnByb3BzLmRyb3Bkb3duLmZvckVhY2goZnVuY3Rpb24gKGxpbmspIHtcbiAgICAgICAgICAgIHZhciBpdGVtID0gUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIHtrZXk6IGxpbmsucm91dGV9LCBcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYVwiLCB7aHJlZjogbGluay5yb3V0ZX0sIGxpbmsubGFiZWwpXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaXRlbXNEcm9wLnB1c2goaXRlbSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInVsXCIsIHtjbGFzc05hbWU6IFwiZHJvcGRvd24tbWVudVwiLCByb2xlOiBcIm1lbnVcIn0sIFxuICAgICAgICAgICAgICAgIGl0ZW1zRHJvcCwgXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIHtjbGFzc05hbWU6IFwiZGl2aWRlclwifSksIFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCBudWxsLCBcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwge2hyZWY6IHRoaXMucHJvcHMubG9nb3V0Um91dGV9LCB0aGlzLnByb3BzLmxvZ291dFRleHQpXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuICAgICAgICApO1xuICAgIH1cbn0pO1xuXG4vKipcbiAqIENyZWF0ZWQgYnkgeWFubiBvbiAxOC8xMS8yMDE0LlxuICogQ29tcG9zYW50IGRlIGJhc2UgZHUgbWVudSB0b3AgdXRpbGlzYXRldXJcbiAqXG4gKiBAcGFyYW0gYXBwTmFtZSA6IE5vbSBkZSBsJ2FwcGxpY2F0aW9uIMOgIGFmZmljaGVyIGVuIGhhdXQgw6AgZ2F1Y2hlXG4gKiBAcGFyYW0gYXBwVXJsIDogVXJsIGFzc29jacOpZSBhdSBub20gZGUgbCdhcHBsaWNhdGlvbiAodHlwaXF1ZW1lbnQgbCdhY2N1ZWlsKVxuICovXG52YXIgTWVudVRvcCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ01lbnVUb3AnLFxuICAgIG1peGluczogW1JlZmx1eC5MaXN0ZW5lck1peGluXSxcbiAgICBwcm9wVHlwZXM6IHtcbiAgICAgICAgLy8gWW91IGNhbiBkZWNsYXJlIHRoYXQgYSBwcm9wIGlzIGEgc3BlY2lmaWMgSlMgcHJpbWl0aXZlLiBCeSBkZWZhdWx0LCB0aGVzZVxuICAgICAgICAvLyBhcmUgYWxsIG9wdGlvbmFsLlxuICAgICAgICBhcHBOYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICAgIGFwcFVybDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkXG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBNw6l0aG9kZSBhcHBlbGzDqWUgw6AgbGEgY3LDqWF0aW9uIGR1IGNvbXBvc2FudCxcbiAgICAgKiBpbml0aWFsaXNlIGxlcyBwcm9wcmnDqXTDqXMgbm9uIGTDqWZpbmllcyBsb3JzIGRlIGwnYXBwZWwgYXZlYyBsZXMgdmFsZXVycyByZXRvdXJuw6llc1xuICAgICAqIEByZXR1cm5zIG9iamVjdFxuICAgICAqL1xuICAgIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYXBwTmFtZTogXCJNb24gQXBwbGljYXRpb25cIixcbiAgICAgICAgICAgIGFwcFVybDogQkFTRV9VUkksXG4gICAgICAgIH07XG4gICAgfSxcbiAgICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHN0YXRlID0ge1xuICAgICAgICAgICAgdXNlckluZm9zOiB7fSxcbiAgICAgICAgICAgIGRhdGFJdGVtczogW11cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgfSxcbiAgICBjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5saXN0ZW5UbyhtZW51VXNlckRhdGFTdG9yZSwgdGhpcy5yZWZyZXNoVXNlckluZm9zKTtcbiAgICAgICAgdGhpcy5saXN0ZW5UbyhtZW51SXRlbXNEYXRhU3RvcmUsIHRoaXMucmVmcmVzaERhdGFJdGVtcyk7XG4gICAgfSxcbiAgICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBUUklHR0VSIERFIEwnQUNUSU9OIFBPVVIgQ0hBUkdFUiBMRVMgREFUQVxuICAgICAgICBhY3Rpb25NZW51RGlkTW91bnQoKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIE3DqXRob2RlIGFwcGVsbMOpZSBwb3VyIGNvbnN0cnVpcmUgbGUgY29tcG9zYW50LlxuICAgICAqIEEgY2hhcXVlIGZvaXMgcXVlIHNvbiBjb250ZW51IGVzdCBtaXMgw6Agam91ci5cbiAgICAgKiBAcmV0dXJucyB7WE1MfVxuICAgICAqL1xuICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImNvbnRhaW5lci1mbHVpZFwifSwgXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChBcHBOYW1lLCB7bmFtZTogdGhpcy5wcm9wcy5hcHBOYW1lLCB1cmw6IHRoaXMucHJvcHMuYXBwVXJsfSksIFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2lkOiBcIm5hdmJhclwiLCBjbGFzc05hbWU6IFwibmF2YmFyLWNvbGxhcHNlIGNvbGxhcHNlXCJ9LCBcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChMaXN0SXRlbXNNZW51LCB7ZGF0YU1lbnU6IHRoaXMuc3RhdGUuZGF0YUl0ZW1zfSksIFxuXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVXNlckluZm9zLCBSZWFjdC5fX3NwcmVhZCh7fSwgIHRoaXMuc3RhdGUudXNlckluZm9zKSlcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApXG4gICAgICAgIClcbiAgICB9LFxuICAgIHJlZnJlc2hVc2VySW5mb3M6IGZ1bmN0aW9uIChpbmZvcykge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHt1c2VySW5mb3M6IGluZm9zfSk7XG4gICAgfSxcbiAgICByZWZyZXNoRGF0YUl0ZW1zOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtkYXRhSXRlbXM6IGRhdGF9KTtcbiAgICB9XG59KTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IE1lbnVUb3A7Il19

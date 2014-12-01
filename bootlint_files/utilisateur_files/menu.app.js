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

var AuthentLevelMixin = {
    componentWillMount: function() {
        // TODO :
        if(!Auth.check()) {
            // Disable component
            this.render = function () {
                return false;
            }
        }
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
        console.log('Pass getDropdown');
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
        console.log(infos);
        this.setState({userInfos: infos});
    },
    refreshDataItems: function (data) {
        this.setState({dataItems: data});
    }
});


module.exports = MenuTop;
},{"./mixins/component_access":"C:\\Program Files (x86)\\EasyPHP-DevServer-14.1VC11\\data\\localweb\\elipce_workflow\\app\\assets\\js\\mods\\mixins\\component_access.js"}]},{},["./app/assets/js/global/menu.app.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiYXBwXFxhc3NldHNcXGpzXFxnbG9iYWxcXG1lbnUuYXBwLmpzIiwiYXBwXFxhc3NldHNcXGpzXFxtb2RzXFxtaXhpbnNcXGNvbXBvbmVudF9hY2Nlc3MuanMiLCJhcHBcXGFzc2V0c1xcanNcXG1vZHNcXHJlYWN0X21lbnVfdG9wLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIENyZWF0ZWQgYnkgeWFubiBvbiAxOC8xMS8yMDE0LlxuICogSW5zdGFudGlhdGlvbiBkZXMgbWVudXMgZGUgbCdhcHBsaWNhdGlvblxuICovXG52YXIgTWVudVRvcCA9IHJlcXVpcmUoJy4uLy4vbW9kcy9yZWFjdF9tZW51X3RvcCcpO1xuXG4kKGZ1bmN0aW9uICgpIHtcblxuICAgIC8vIENyw6lhdGlvbiBkdSBtZW51IGQnZW4gaGF1dCBzaSBsYSBwYWdlIGxlIHBlcm1ldFxuICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVudS10b3AnKSkge1xuICAgICAgICAvLyBWYXJpYWJsZXMgZHUgbWVudVxuICAgICAgICB2YXIgbmFtZSA9IExhbmcuZ2V0KCdnbG9iYWwuYXBwX25hbWUnKTtcblxuICAgICAgICBSZWFjdC5yZW5kZXIoUmVhY3QuY3JlYXRlRWxlbWVudChNZW51VG9wLCB7YXBwTmFtZTogbmFtZX0pLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVudS10b3AnKSk7XG4gICAgfVxufSk7XG4iLCJcbnZhciBBdXRoZW50TGV2ZWxNaXhpbiA9IHtcbiAgICBjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBUT0RPIDpcbiAgICAgICAgaWYoIUF1dGguY2hlY2soKSkge1xuICAgICAgICAgICAgLy8gRGlzYWJsZSBjb21wb25lbnRcbiAgICAgICAgICAgIHRoaXMucmVuZGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBdXRoZW50TGV2ZWxNaXhpbjsiLCJ2YXIgQWNjZXNzTWl4aW4gPSByZXF1aXJlKCcuL21peGlucy9jb21wb25lbnRfYWNjZXNzJyk7XG5cbnZhciBhY3Rpb25NZW51RGlkTW91bnQgPSBSZWZsdXguY3JlYXRlQWN0aW9uKCk7XG5cbi8qKlxuICogR8OocmUgbGVzIGRvbm7DqWVzIMOgIGFmZmljaGVyIGRhbnMgbGEgbHNpdGUgZGVzIGl0ZW1zIGRlIG1lbnVcbiAqL1xudmFyIG1lbnVJdGVtc0RhdGFTdG9yZSA9IFJlZmx1eC5jcmVhdGVTdG9yZSh7XG4gICAgLy8gSW5pdGlhbCBzZXR1cFxuICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gUmVnaXN0ZXIgc3RhdHVzVXBkYXRlIGFjdGlvblxuICAgICAgICB0aGlzLmxpc3RlblRvKGFjdGlvbk1lbnVEaWRNb3VudCwgdGhpcy5mZXRjaE1lbnVEYXRhKTtcbiAgICB9LFxuICAgIGZldGNoTWVudURhdGE6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGRhdGEgPSBBdXRoLm1lbnVfdG9wLml0ZW1zO1xuICAgICAgICBkYXRhLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGkpIHtcbiAgICAgICAgICAgIGl0ZW0uYWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICBpdGVtLmFjY2Vzc2libGUgPSAoaXRlbS5hY2Nlc3NpYmxlID8gdHJ1ZSA6IGZhbHNlKTtcblxuICAgICAgICAgICAgZGF0YVtpXSA9IGl0ZW07XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnRyaWdnZXIoZGF0YSk7XG4gICAgfVxufSk7XG5cbi8qKlxuICogR8OocmUgbGVzIGRvbm7DqWVzIMOgIGFmZmljaGVyIGRhbnMgbGUgbWVudSB1dGlsaXNhdGV1clxuICovXG52YXIgbWVudVVzZXJEYXRhU3RvcmUgPSBSZWZsdXguY3JlYXRlU3RvcmUoe1xuICAgIC8vIEluaXRpYWwgc2V0dXBcbiAgICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIFJlZ2lzdGVyIHN0YXR1c1VwZGF0ZSBhY3Rpb25cbiAgICAgICAgdGhpcy5saXN0ZW5UbyhhY3Rpb25NZW51RGlkTW91bnQsIHRoaXMuZmV0Y2hVc2VyRGF0YSk7XG4gICAgfSxcbiAgICBmZXRjaFVzZXJEYXRhOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBkYXRhID0gQXV0aC5tZW51X3RvcC51c2VyO1xuICAgICAgICB0aGlzLnRyaWdnZXIoZGF0YSk7XG4gICAgfVxufSk7XG5cbi8qKlxuICogQ3JlYXRlZCBieSB5YW5uIG9uIDE5LzExLzIwMTQuXG4gKiBBZmZpY2hlIGxlIG5vbSBkdSBwcm9qZXQgZGFucyB1biBoZWFkZXIgZGUgbmF2YmFyXG4gKiBAcGFyYW0gbmFtZSA6IG5vbSBhIGFmZmljaGVyIGRhbnMgbGUgY29tcG9zYW50XG4gKi9cbnZhciBBcHBOYW1lID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiAnQXBwTmFtZScsXG4gICAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBuYW1lOiBcIk1vbiBBcHBsaWNhdGlvblwiLFxuICAgICAgICAgICAgdXJsOiBcIiNcIlxuICAgICAgICB9O1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogVGVzdCBzaSBsZSBjb21wb3NhbnQgZG9pdCDDqnRyZSByw6lhZmZpY2jDqSBhdmVjIGxlcyBub3V2ZWxsZXMgZG9ubsOpZXNcbiAgICAgKiBAcGFyYW0gbmV4dFByb3BzIDogTm91dmVsbGVzIHByb3ByacOpdMOpc1xuICAgICAqIEBwYXJhbSBuZXh0U3RhdGUgOiBOb3V2ZWwgw6l0YXRcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gOiB0cnVlIG91IGZhbHNlIHNlbG9uIHNpIGxlIGNvbXBvc2FudCBkb2l0IMOqdHJlIG1pcyDDoCBqb3VyXG4gICAgICovXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlOiBmdW5jdGlvbiAobmV4dFByb3BzLCBuZXh0U3RhdGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogTcOpdGhvZGUgYXBwZWxsw6llIHBvdXIgY29uc3RydWlyZSBsZSBjb21wb3NhbnQuXG4gICAgICogQSBjaGFxdWUgZm9pcyBxdWUgc29uIGNvbnRlbnUgZXN0IG1pcyDDoCBqb3VyLlxuICAgICAqIEByZXR1cm5zIHtYTUx9XG4gICAgICovXG4gICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibmF2YmFyLWhlYWRlclwifSwgXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiLCB7dHlwZTogXCJidXR0b25cIiwgY2xhc3NOYW1lOiBcIm5hdmJhci10b2dnbGUgY29sbGFwc2VkXCIsICdkYXRhLXRvZ2dsZSc6IFwiY29sbGFwc2VcIiwgJ2RhdGEtdGFyZ2V0JzogXCIjbmF2YmFyXCIsICdhcmlhLWV4cGFuZGVkJzogXCJmYWxzZVwiLCAnYXJpYS1jb250cm9scyc6IFwibmF2YmFyXCJ9LCBcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge2NsYXNzTmFtZTogXCJzci1vbmx5XCJ9LCBcIlRvZ2dsZSBuYXZpZ2F0aW9uXCIpLCBcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge2NsYXNzTmFtZTogXCJpY29uLWJhclwifSksIFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7Y2xhc3NOYW1lOiBcImljb24tYmFyXCJ9KSwgXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtjbGFzc05hbWU6IFwiaWNvbi1iYXJcIn0pXG4gICAgICAgICAgICAgICAgKSwgXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwge2NsYXNzTmFtZTogXCJuYXZiYXItYnJhbmRcIiwgaHJlZjogdGhpcy5wcm9wcy51cmx9LCB0aGlzLnByb3BzLm5hbWUpXG4gICAgICAgICAgICApXG4gICAgICAgIClcbiAgICB9XG59KTtcblxuLyoqXG4gKiBDcmVhdGVkIGJ5IHlhbm4gb24gMTkvMTEvMjAxNC5cbiAqXG4gKiBUT0RPIDogU25pcHBldCBkZSBiYXNlIHBvdXIgdW4gY29tcG9zYW50IHJlYWN0LiBDb21tZW50YWlyZSDDoCDDqWRpdGVyXG4gKiBAcGFyYW0gZGF0YU1lbnUgOiBkb25uw6llcyDDoCBhZmZpY2hlciBkYW5zIGxlIG1lbnUgYXUgZm9ybWF0IEpTT05cbiAqIFtcbiAqICB7dHJhZHVjdGlvbjogXCJpdGVtXzFcIiwgdXJsOiBcIml0ZW1fMVwiLCBhY3RpdmU6IHRydWUsIGFjY2Vzc2libGU6IHRydWV9LFxuICogIHt0cmFkdWN0aW9uOiBcIml0ZW1fMlwiLCB1cmw6IFwiaXRlbV8yXCIsIGFjdGl2ZTogZmFsc2UsIGFjY2Vzc2libGU6IHRydWUsIGljb246IFwiZ2x5cGhpY29uIGdseXBoaWNvbi1zdGFyXCJ9LFxuICogIHt0cmFkdWN0aW9uOiBcIml0ZW1fM1wiLCB1cmw6IFwiaXRlbV8zXCIsIGFjdGl2ZTogZmFsc2UsIGFjY2Vzc2libGU6IGZhbHNlLCBpY29uOiBcImdseXBoaWNvbiBnbHlwaGljb24tY2xvdWRcIn1cbiAqIF1cbiAqL1xudmFyIExpc3RJdGVtc01lbnUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6ICdMaXN0SXRlbXNNZW51JyxcbiAgICAvKipcbiAgICAgKiBWw6lyaWZpY2F0aW9uIMOpdmVudHVlbGxlIGRlcyB0eXBlcyBkZXMgcHJvcHJpw6l0w6lzXG4gICAgICovXG4gICAgcHJvcFR5cGVzOiB7XG4gICAgICAgIGRhdGFNZW51OiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZFxuICAgIH0sXG4gICAgLyoqXG4gICAgICogTcOpdGhvZGUgYXBwZWxsw6llIMOgIGxhIGNyw6lhdGlvbiBkdSBjb21wb3NhbnQsXG4gICAgICogaW5pdGlhbGlzZSBsZXMgcHJvcHJpw6l0w6lzIG5vbiBkw6lmaW5pZXMgbG9ycyBkZSBsJ2FwcGVsIGF2ZWMgbGVzIHZhbGV1cnMgcmV0b3VybsOpZXNcbiAgICAgKiBAcmV0dXJucyBvYmplY3RcbiAgICAgKi9cbiAgICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogw4l0YXQgaW5pdGlhbCBkZXMgZG9ubsOpZXMgZHUgY29tcG9zYW50XG4gICAgICogQHJldHVybnMgbGVzIGRvbm7DqWVzIGRlIGwnw6l0YXQgaW5pdGlhbFxuICAgICAqL1xuICAgIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4ge307XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBDYWxsYmFjayBhcHBlbMOpIGxvcnNxdWUgbGUgY29tcG9zYW50IGVzdCBhZmZpY2jDqS5cbiAgICAgKiBDJ2VzdCBwYXIgZXhlbXBsZSBpY2kgcXUnb24gcGV1dCBmYWlyZSB1biBhcHBlbCBhamF4IHBvdXJcbiAgICAgKiBjaGFyZ2VyIHNlcyBkb25uw6llcyBkeW5hbWlxdWVtZW50ICFcbiAgICAgKi9cbiAgICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gKCkge1xuXG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBUZXN0IHNpIGxlIGNvbXBvc2FudCBkb2l0IMOqdHJlIHLDqWFmZmljaMOpIGF2ZWMgbGVzIG5vdXZlbGxlcyBkb25uw6llc1xuICAgICAqIEBwYXJhbSBuZXh0UHJvcHMgOiBOb3V2ZWxsZXMgcHJvcHJpw6l0w6lzXG4gICAgICogQHBhcmFtIG5leHRTdGF0ZSA6IE5vdXZlbCDDqXRhdFxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSA6IHRydWUgb3UgZmFsc2Ugc2Vsb24gc2kgbGUgY29tcG9zYW50IGRvaXQgw6p0cmUgbWlzIMOgIGpvdXJcbiAgICAgKi9cbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGU6IGZ1bmN0aW9uIChuZXh0UHJvcHMsIG5leHRTdGF0ZSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIE3DqXRob2RlIGFwcGVsbMOpZSBwb3VyIGNvbnN0cnVpcmUgbGUgY29tcG9zYW50LlxuICAgICAqIEEgY2hhcXVlIGZvaXMgcXVlIHNvbiBjb250ZW51IGVzdCBtaXMgw6Agam91ci5cbiAgICAgKiBAcmV0dXJucyB7WE1MfVxuICAgICAqL1xuICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZGF0YSA9IHRoaXMucHJvcHMuZGF0YU1lbnU7XG5cbiAgICAgICAgdmFyIGl0ZW1zID0gW107XG4gICAgICAgIC8vIFBBUkNPVVJTIERFUyBJVEVNUyBERSBNRU5VXG4gICAgICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgdmFyIGxpYmVsbGUgPSBMYW5nLmdldChcIm1lbnUudG9wLlwiICsgaXRlbS50cmFkdWN0aW9uKTtcbiAgICAgICAgICAgIHZhciB1cmwgPSAoaXRlbS5hY2Nlc3NpYmxlID8gaXRlbS51cmwgOiBcIiNcIik7XG4gICAgICAgICAgICB2YXIgY2xhc3NuYW1lcyA9IChpdGVtLmFjdGl2ZSA/IFwiYWN0aXZlIFwiIDogXCJcIikgKyAoaXRlbS5hY2Nlc3NpYmxlID8gXCJcIiA6IFwiZGlzYWJsZWRcIik7XG4gICAgICAgICAgICB2YXIgcHJvcHMgPSB7XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiBjbGFzc25hbWVzXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGl0ZW1zLnB1c2goXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIFJlYWN0Ll9fc3ByZWFkKHtrZXk6IGl0ZW0uaWR9LCAgcHJvcHMpLCBcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwge2hyZWY6IHVybH0sIGxpYmVsbGUpXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidWxcIiwge2NsYXNzTmFtZTogXCJuYXYgbmF2YmFyLW5hdiBuYXZiYXItbGVmdFwifSwgXG4gICAgICAgICAgICAgICAgaXRlbXNcbiAgICAgICAgICAgIClcbiAgICAgICAgKVxuICAgIH1cbn0pO1xuXG4vKipcbiAqIENyZWF0ZWQgYnkgeWFubiBvbiAxOS8xMS8yMDE0LlxuICpcbiAqIENvbXBvc2FudCBwbGFjw6kgw6AgZHJvaXRlIGR1IG1lbnUgaGF1dCBwb3VyIGFmZmljaGVyIGxlcyBpbmZvcyBkZSBsJ3V0aWxpc2F0ZXVyXG4gKiBAcGFyYW0gbm9tVXRpbGlzYXRldXIgOiBub20gZGUgbCd1dGlsaXNhdGV1clxuICogQHBhcmFtIGxvZ291dFJvdXRlIDogdXJsIGRlIGxvZ291dCBkZSBsJ2FwcGxpY2F0aW9uXG4gKiBAcGFyYW0gbG9nb3V0VGV4dCA6IFRleHRlIHBvdXIgbGUgYm91dG9uIGxvZ291dFxuICogQHBhcmFtIGRyb3Bkb3duIDogbWVudSBkw6lyb3VsYW50IGNvbnRlbmFudCBsZXMgcmFjY291cmNpcyBkZSBsJ3V0aWxpc2F0ZXVyXG4gKiBbXG4gKiAge2xhYmVsOiBcInByb2ZpbFwiLCByb3V0ZTpcIi91dGlsaXNhdGV1ci8xMjBcIn0sXG4gKiAge2xhYmVsOiBcInBhcmFtZXRyZXNcIiwgcm91dGU6XCIvcGFyYW1ldHJlc1wifVxuICogXVxuICovXG52YXIgVXNlckluZm9zID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiAnVXNlckluZm9zJyxcbiAgICAvKipcbiAgICAgKiBWw6lyaWZpY2F0aW9uIMOpdmVudHVlbGxlIGRlcyB0eXBlcyBkZXMgcHJvcHJpw6l0w6lzXG4gICAgICovXG4gICAgcHJvcFR5cGVzOiB7XG4gICAgICAgIG5vbVV0aWxpc2F0ZXVyOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBsb2dvdXRSb3V0ZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgbG9nb3V0VGV4dDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgZHJvcGRvd246IFJlYWN0LlByb3BUeXBlcy5hcnJheVxuICAgIH0sXG4gICAgLyoqXG4gICAgICogTcOpdGhvZGUgYXBwZWxsw6llIMOgIGxhIGNyw6lhdGlvbiBkdSBjb21wb3NhbnQsXG4gICAgICogaW5pdGlhbGlzZSBsZXMgcHJvcHJpw6l0w6lzIG5vbiBkw6lmaW5pZXMgbG9ycyBkZSBsJ2FwcGVsIGF2ZWMgbGVzIHZhbGV1cnMgcmV0b3VybsOpZXNcbiAgICAgKiBAcmV0dXJucyBvYmplY3RcbiAgICAgKi9cbiAgICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHtkcm9wZG93bjogW119O1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogw4l0YXQgaW5pdGlhbCBkZXMgZG9ubsOpZXMgZHUgY29tcG9zYW50XG4gICAgICogQHJldHVybnMgbGVzIGRvbm7DqWVzIGRlIGwnw6l0YXQgaW5pdGlhbFxuICAgICAqL1xuICAgIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4ge307XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBDYWxsYmFjayBhcHBlbMOpIGxvcnNxdWUgbGUgY29tcG9zYW50IGVzdCBhZmZpY2jDqS5cbiAgICAgKiBDJ2VzdCBwYXIgZXhlbXBsZSBpY2kgcXUnb24gcGV1dCBmYWlyZSB1biBhcHBlbCBhamF4IHBvdXJcbiAgICAgKiBjaGFyZ2VyIHNlcyBkb25uw6llcyBkeW5hbWlxdWVtZW50ICFcbiAgICAgKi9cbiAgICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gKCkge1xuXG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBUZXN0IHNpIGxlIGNvbXBvc2FudCBkb2l0IMOqdHJlIHLDqWFmZmljaMOpIGF2ZWMgbGVzIG5vdXZlbGxlcyBkb25uw6llc1xuICAgICAqIEBwYXJhbSBuZXh0UHJvcHMgOiBOb3V2ZWxsZXMgcHJvcHJpw6l0w6lzXG4gICAgICogQHBhcmFtIG5leHRTdGF0ZSA6IE5vdXZlbCDDqXRhdFxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSA6IHRydWUgb3UgZmFsc2Ugc2Vsb24gc2kgbGUgY29tcG9zYW50IGRvaXQgw6p0cmUgbWlzIMOgIGpvdXJcbiAgICAgKi9cbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGU6IGZ1bmN0aW9uIChuZXh0UHJvcHMsIG5leHRTdGF0ZSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIE3DqXRob2RlIGFwcGVsbMOpZSBwb3VyIGNvbnN0cnVpcmUgbGUgY29tcG9zYW50LlxuICAgICAqIEEgY2hhcXVlIGZvaXMgcXVlIHNvbiBjb250ZW51IGVzdCBtaXMgw6Agam91ci5cbiAgICAgKiBAcmV0dXJucyB7WE1MfVxuICAgICAqL1xuICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZHJvcGRvd24gPSB0aGlzLmdldERyb3Bkb3duKCk7XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiLCB7Y2xhc3NOYW1lOiBcIm5hdiBuYXZiYXItbmF2IG5hdmJhci1yaWdodFwifSwgXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIHtjbGFzc05hbWU6IFwiZHJvcGRvd25cIn0sIFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYVwiLCB7aHJlZjogXCIjXCIsIGNsYXNzTmFtZTogXCJkcm9wZG93bi10b2dnbGVcIiwgJ2RhdGEtdG9nZ2xlJzogXCJkcm9wZG93blwiLCByb2xlOiBcImJ1dHRvblwiLCAnYXJpYS1leHBhbmRlZCc6IFwiZmFsc2VcIn0sIFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImlcIiwge2NsYXNzTmFtZTogXCJnbHlwaGljb24gZ2x5cGhpY29uLXVzZXJcIn0pLCBcIiBcIiwgdGhpcy5wcm9wcy5ub21VdGlsaXNhdGV1ciwgXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7Y2xhc3NOYW1lOiBcImNhcmV0XCJ9KVxuICAgICAgICAgICAgICAgICAgICApLCBcbiAgICAgICAgICAgICAgICAgICAgZHJvcGRvd25cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApXG4gICAgICAgICk7XG4gICAgfSxcbiAgICBnZXREcm9wZG93bjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaXRlbXNEcm9wID0gW107XG4gICAgICAgIHRoaXMucHJvcHMuZHJvcGRvd24uZm9yRWFjaChmdW5jdGlvbiAobGluaykge1xuICAgICAgICAgICAgdmFyIGl0ZW0gPSBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGlcIiwge2tleTogbGluay5yb3V0ZX0sIFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHtocmVmOiBsaW5rLnJvdXRlfSwgbGluay5sYWJlbClcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpdGVtc0Ryb3AucHVzaChpdGVtKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdQYXNzIGdldERyb3Bkb3duJyk7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidWxcIiwge2NsYXNzTmFtZTogXCJkcm9wZG93bi1tZW51XCIsIHJvbGU6IFwibWVudVwifSwgXG4gICAgICAgICAgICAgICAgaXRlbXNEcm9wLCBcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGlcIiwge2NsYXNzTmFtZTogXCJkaXZpZGVyXCJ9KSwgXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIG51bGwsIFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYVwiLCB7aHJlZjogdGhpcy5wcm9wcy5sb2dvdXRSb3V0ZX0sIHRoaXMucHJvcHMubG9nb3V0VGV4dClcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApXG4gICAgICAgICk7XG4gICAgfVxufSk7XG5cbi8qKlxuICogQ3JlYXRlZCBieSB5YW5uIG9uIDE4LzExLzIwMTQuXG4gKiBDb21wb3NhbnQgZGUgYmFzZSBkdSBtZW51IHRvcCB1dGlsaXNhdGV1clxuICpcbiAqIEBwYXJhbSBhcHBOYW1lIDogTm9tIGRlIGwnYXBwbGljYXRpb24gw6AgYWZmaWNoZXIgZW4gaGF1dCDDoCBnYXVjaGVcbiAqIEBwYXJhbSBhcHBVcmwgOiBVcmwgYXNzb2Npw6llIGF1IG5vbSBkZSBsJ2FwcGxpY2F0aW9uICh0eXBpcXVlbWVudCBsJ2FjY3VlaWwpXG4gKi9cbnZhciBNZW51VG9wID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiAnTWVudVRvcCcsXG4gICAgbWl4aW5zOiBbUmVmbHV4Lkxpc3RlbmVyTWl4aW5dLFxuICAgIHByb3BUeXBlczoge1xuICAgICAgICAvLyBZb3UgY2FuIGRlY2xhcmUgdGhhdCBhIHByb3AgaXMgYSBzcGVjaWZpYyBKUyBwcmltaXRpdmUuIEJ5IGRlZmF1bHQsIHRoZXNlXG4gICAgICAgIC8vIGFyZSBhbGwgb3B0aW9uYWwuXG4gICAgICAgIGFwcE5hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgICAgYXBwVXJsOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWRcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIE3DqXRob2RlIGFwcGVsbMOpZSDDoCBsYSBjcsOpYXRpb24gZHUgY29tcG9zYW50LFxuICAgICAqIGluaXRpYWxpc2UgbGVzIHByb3ByacOpdMOpcyBub24gZMOpZmluaWVzIGxvcnMgZGUgbCdhcHBlbCBhdmVjIGxlcyB2YWxldXJzIHJldG91cm7DqWVzXG4gICAgICogQHJldHVybnMgb2JqZWN0XG4gICAgICovXG4gICAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBhcHBOYW1lOiBcIk1vbiBBcHBsaWNhdGlvblwiLFxuICAgICAgICAgICAgYXBwVXJsOiBCQVNFX1VSSSxcbiAgICAgICAgfTtcbiAgICB9LFxuICAgIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgc3RhdGUgPSB7XG4gICAgICAgICAgICB1c2VySW5mb3M6IHt9LFxuICAgICAgICAgICAgZGF0YUl0ZW1zOiBbXVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9LFxuICAgIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmxpc3RlblRvKG1lbnVVc2VyRGF0YVN0b3JlLCB0aGlzLnJlZnJlc2hVc2VySW5mb3MpO1xuICAgICAgICB0aGlzLmxpc3RlblRvKG1lbnVJdGVtc0RhdGFTdG9yZSwgdGhpcy5yZWZyZXNoRGF0YUl0ZW1zKTtcbiAgICB9LFxuICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIFRSSUdHRVIgREUgTCdBQ1RJT04gUE9VUiBDSEFSR0VSIExFUyBEQVRBXG4gICAgICAgIGFjdGlvbk1lbnVEaWRNb3VudCgpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogTcOpdGhvZGUgYXBwZWxsw6llIHBvdXIgY29uc3RydWlyZSBsZSBjb21wb3NhbnQuXG4gICAgICogQSBjaGFxdWUgZm9pcyBxdWUgc29uIGNvbnRlbnUgZXN0IG1pcyDDoCBqb3VyLlxuICAgICAqIEByZXR1cm5zIHtYTUx9XG4gICAgICovXG4gICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiY29udGFpbmVyLWZsdWlkXCJ9LCBcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEFwcE5hbWUsIHtuYW1lOiB0aGlzLnByb3BzLmFwcE5hbWUsIHVybDogdGhpcy5wcm9wcy5hcHBVcmx9KSwgXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7aWQ6IFwibmF2YmFyXCIsIGNsYXNzTmFtZTogXCJuYXZiYXItY29sbGFwc2UgY29sbGFwc2VcIn0sIFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KExpc3RJdGVtc01lbnUsIHtkYXRhTWVudTogdGhpcy5zdGF0ZS5kYXRhSXRlbXN9KSwgXG5cbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChVc2VySW5mb3MsIFJlYWN0Ll9fc3ByZWFkKHt9LCAgdGhpcy5zdGF0ZS51c2VySW5mb3MpKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIClcbiAgICAgICAgKVxuICAgIH0sXG4gICAgcmVmcmVzaFVzZXJJbmZvczogZnVuY3Rpb24gKGluZm9zKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGluZm9zKTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7dXNlckluZm9zOiBpbmZvc30pO1xuICAgIH0sXG4gICAgcmVmcmVzaERhdGFJdGVtczogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7ZGF0YUl0ZW1zOiBkYXRhfSk7XG4gICAgfVxufSk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBNZW51VG9wOyJdfQ==

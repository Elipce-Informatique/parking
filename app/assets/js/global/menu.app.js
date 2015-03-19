var React = require('react/addons');
var Collapse = require('../mods/composants/react_collapse').Collapse;
var CollapseBody = require('../mods/composants/react_collapse').CollapseBody;

var CollapseSidebar = require('../mods/composants/react_collapse').CollapseSidebar;

/**
 * Created by yann on 18/11/2014.
 * Instantiation des menus de l'application
 */
(function () {
    var MenuTop = require('../mods/composants/menu/react_menu_top');
    var MenuLeft = require('../mods/composants/menu/react_menu_left');

    $(function () {

        var name = Lang.get('global.app_name');
        // CRÉATION DU MENU D'EN HAUT SI LA PAGE LE PERMET
        if (document.getElementById('menu-top')) {
            React.render(<MenuTop appName={name} />, document.getElementById('menu-top'));
        }

        // CRÉATION DU MENU GAUCHE SI LA PAGE LE PERMET
        if (document.getElementById('menu-left')) {
            // Variables du menu
            React.render(<MenuLeft appName={name}/>, document.getElementById('menu-left'));
        }
    });

})();

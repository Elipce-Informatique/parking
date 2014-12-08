/**
 * Created by yann on 18/11/2014.
 * Instantiation des menus de l'application
 */

(function () {
    var MenuTop = require('../mods/composants/react_menu_top');

    $(function () {

        // CRÉATION DU MENU D'EN HAUT SI LA PAGE LE PERMET
        if (document.getElementById('menu-top')) {
            // Variables du menu
            var name = Lang.get('global.app_name');

            React.render(<MenuTop appName={name} />, document.getElementById('menu-top'));
        }

        // CRÉATION DU MENU GAUCHE SI LA PAGE LE PERMET
        if (document.getElementById('menu-left')) {
            // TODO
        }
    });

})();

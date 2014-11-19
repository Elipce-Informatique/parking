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
        var url = BASE_URI + "accueil";

        React.render(<MenuTop appName={name} appUrl={url} />, document.getElementById('menu-top'));
    }
});

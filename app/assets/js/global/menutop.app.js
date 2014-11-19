/**
 * Created by yann on 18/11/2014.
 * Instantiation de la barre de menu haut de l'application
 */
var MenuTop = require('.././mods/react_menu_top');

$(function(){

    // Variables du menu
    var name = Lang.get('global.app_name');
    var url = BASE_URI + "accueil";

    React.render(<MenuTop appName={name} appUrl={url} />, document.getElementById('menu-top'));
});

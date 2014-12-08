/**
 * Created by yann on 02/12/2014.
 * @param name : nom a afficher dans le composant
 */
var BlockAccueil = require('./mods/composants/react_block_accueil');

$(function () {

    // BLOCK MÉTIER ADMIN
    var url_administration = BASE_URI + 'administration';
    React.render(<BlockAccueil
        titre={Lang.get('global.administration')}
        texte={Lang.get('accueil.block_admin_text')}
        bouton={Lang.get('global.acceder')}
        bouton_url={url_administration}
        module_url="administration"/>,
        document.getElementById('block_admin'));
});
var React = require('react/addons');
require('./global/global');
var Block = require('./mods/composants/react_block_accueil');

$(function () {

    // BLOCK FONCTIONNALITÉ UTILISATEUR
    var url_utilisateur = BASE_URI + 'visualisation';
    React.render(<Block
            titre={Lang.get('supervision.accueil.block_visualisation_titre')}
            texte={Lang.get('supervision.accueil.block_visualisation_texte')}
            bouton={Lang.get('global.gerer')}
            bouton_url={url_utilisateur}
            module_url="visualisation"/>,
        document.getElementById('block_visualisation'));

    // BLOCK FONCTIONNALITÉ PROFILS
    var url_profils = BASE_URI + 'commandes_forcees';
    React.render(<Block
            titre={Lang.get('supervision.accueil.block_commandes_titre')}
            texte={Lang.get('supervision.accueil.block_commandes_texte')}
            bouton={Lang.get('global.gerer')}
            bouton_url={url_profils}
            module_url="commandes_forcees"/>,
        document.getElementById('block_commandes'));
});
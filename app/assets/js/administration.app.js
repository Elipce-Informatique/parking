var Block = require('./mods/composants/react_block_accueil');

$(function () {

    // BLOCK FONCTIONNALITÉ UTILISATEUR
    var url_utilisateur = BASE_URI + 'utilisateur';
    React.render(<Block
        titre={Lang.get('administration.accueil.block_utilisateur_titre')}
        texte={Lang.get('administration.accueil.block_utilisateur_texte')}
        bouton={Lang.get('global.gerer')}
        bouton_url={url_utilisateur}
        module_url="utilisateur"/>,
        document.getElementById('block_utilisateur'));

    // BLOCK FONCTIONNALITÉ PROFILS
    var url_profils = BASE_URI + 'profils';
    React.render(<Block
        titre={Lang.get('administration.accueil.block_profil_titre')}
        texte={Lang.get('administration.accueil.block_profil_texte')}
        bouton={Lang.get('global.gerer')}
        bouton_url={url_profils}
        module_url="profils"/>,
        document.getElementById('block_profil'));
});
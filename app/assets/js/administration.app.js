var Block = require('./mods/react_block_accueil');

$(function () {

    // BLOCK FONCTIONNALITÉ UTILISATEUR
    var url_utilisateur = BASE_URI + 'utilisateur';
    React.render(<Block
        titre={Lang.get('administration.block_utilisateur_titre')}
        texte={Lang.get('administration.block_utilisateur_texte')}
        bouton={Lang.get('administration.bouton_utilisateur')}
        bouton_url={url_utilisateur}
        module_url="utilisateur"/>,
        document.getElementById('block_utilisateur'))

    // BLOCK FONCTIONNALITÉ PROFILS
    var url_utilisateur = BASE_URI + 'profils';
    React.render(<Block
        titre={Lang.get('administration.block_utilisateur_titre')}
        texte={Lang.get('administration.block_utilisateur_texte')}
        bouton={Lang.get('administration.bouton_utilisateur')}
        bouton_url={url_utilisateur}
        module_url="utilisateur"/>,
        document.getElementById('block_profil'));
});
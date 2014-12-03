var Block = require('./mods/react_block_accueil');

$(function () {
    React.render(<Block titre={Lang.get('administration.block_utilisateur_titre')}
        texte={Lang.get('administration.block_utilisateur_texte')}
        bouton={Lang.get('administration.bouton_utilisateur')}

        module_url="utilisateur"/>,
        document.getElementById('block_utilisateur'));
});
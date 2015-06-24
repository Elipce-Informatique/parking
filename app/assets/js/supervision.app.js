var React = require('react/addons');
require('./global/global');
var Block = require('./mods/composants/react_block_accueil');

$(function () {

    // Visualisation supervision
    React.render(<Block
            titre={Lang.get('supervision.accueil.block_visualisation_titre')}
            texte={Lang.get('supervision.accueil.block_visualisation_texte')}
            bouton={Lang.get('global.gerer')}
            bouton_url={BASE_URI + 'visualisation'}
            module_url="visualisation"/>,
        document.getElementById('block_visualisation'));

    // Alertes et réservations
    React.render(<Block
            titre={Lang.get('supervision.accueil.block_alerte_titre')}
            texte={Lang.get('supervision.accueil.block_alerte_texte')}
            bouton={Lang.get('global.gerer')}
            bouton_url={BASE_URI + 'alerte'}
            module_url="alerte"/>,
        document.getElementById('block_alertes'));
});
require('./global/global');
var React = require('react/addons');
var Block = require('./mods/composants/react_block_accueil');

$(function () {

    // BLOCK administration parking
    var url_etats_d_occupation = BASE_URI + 'etats_d_occupation';
    var url_configuration_parking = BASE_URI + 'configuration_parking';
    React.render(<Block
            titre={Lang.get('menu.side.etats_d_occupation')}
            texte={Lang.get('administration_parking.etats_d_occupation.texte')}
            bouton={Lang.get('global.gerer')}
            bouton_url={url_etats_d_occupation}
            module_url="etats_d_occupation"/>,
        document.getElementById('block_etats_d_occupation'));

    React.render(<Block
            titre={Lang.get('menu.side.configuration_parking')}
            texte={Lang.get('administration_parking.configuration_parking.texte')}
            bouton={Lang.get('global.gerer')}
            bouton_url={url_configuration_parking}
            module_url="configuration_parking"/>,
        document.getElementById('block_configuration_parking'));
});
require('./global/global');
var React = require('react/addons');
var Block = require('./mods/composants/react_block_accueil');

$(function () {

    // BLOCK administration parking
    var url_etats_d_occupation = BASE_URI + 'etats_d_occupation';
    var url_configuration_parking = BASE_URI + 'configuration_parking';

    // Etats d'occupation
    React.render(<Block
            titre={Lang.get('menu.side.etats_d_occupation')}
            texte={Lang.get('administration_parking.etats_d_occupation.texte')}
            bouton={Lang.get('global.gerer')}
            bouton_url={url_etats_d_occupation}
            module_url="etats_d_occupation"/>,
        document.getElementById('1'));

    // Parking
    React.render(<Block
            titre={Lang.get('menu.side.parking')}
            texte={Lang.get('administration_parking.parking.texte')}
            bouton={Lang.get('global.gerer')}
            bouton_url={BASE_URI + 'gestion_parking'}
            module_url="gestion_parking"/>,
        document.getElementById('2'));

    // Niveaux
    React.render(<Block
            titre={Lang.get('menu.side.niveau')}
            texte={Lang.get('administration_parking.niveau.texte')}
            bouton={Lang.get('global.gerer')}
            bouton_url={BASE_URI + 'niveau'}
            module_url="niveau"/>,
        document.getElementById('3'));

    // Configuration du parking
    React.render(<Block
            titre={Lang.get('menu.side.configuration_parking')}
            texte={Lang.get('administration_parking.configuration_parking.texte')}
            bouton={Lang.get('global.gerer')}
            bouton_url={url_configuration_parking}
            module_url="configuration_parking"/>,
        document.getElementById('4'));
});
var Block = require('./mods/composants/react_block_accueil');

$(function () {

    // BLOCK administration parking
    var url_etats_d_occupation = BASE_URI + 'etats_d_occupation';
    React.render(<Block
                    titre={Lang.get('menu.side.etats_d_occupation')}
                    texte={Lang.get('administration_parking.etats_d_occupation.texte')}
                    bouton={Lang.get('global.gerer')}
                    bouton_url={url_etats_d_occupation}
                    module_url="etats_d_occupation"/>,
                document.getElementById('block_etats_d_occupation'));

    // BLOCK CALENDRIER
    var urlCal = BASE_URI + 'calendrier';
    React.render(<Block
            titre={Lang.get('menu.side.calendrier')}
            texte={Lang.get('administration_parking.calendrier.texte')}
            bouton={Lang.get('global.gerer')}
            bouton_url={urlCal}
            module_url="calendrier"/>,
        document.getElementById('block_calendrier'));

});
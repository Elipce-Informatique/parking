/**
 * Created by vivian on 19/02/2015.
 */
require('./global/global');
var React = require('react/addons');
var Block = require('./mods/composants/react_block_accueil');

$(function () {

    // BLOCK JOURS PREDEFINIS
    var urlJour = BASE_URI + 'calendrier_jours';
    React.render(<Block
            titre={Lang.get('menu.side.jours_predef')}
            texte={Lang.get('calendrier.jours.texte')}
            bouton={Lang.get('global.gerer')}
            bouton_url={urlJour}
            module_url="calendrier_jours"/>,
        document.getElementById('block_jours_predef'));

    // BLOCK PROGRAMMATION HORAIRE
    var urlProg = BASE_URI + 'calendrier_programmation';
    React.render(<Block
            titre={Lang.get('menu.side.prog_horaire')}
            texte={Lang.get('calendrier.prog_horaire.texte')}
            bouton={Lang.get('global.gerer')}
            bouton_url={urlProg}
            module_url="calendrier_programmation"/>,
        document.getElementById('block_prog_horaire'));
});
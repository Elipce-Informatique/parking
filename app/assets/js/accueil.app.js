/**
 * Created by yann on 02/12/2014.
 * @param name : nom a afficher dans le composant
 */
var React = require('react/addons');
require('./global/global');
var BlockAccueil = require('./mods/composants/react_block_accueil');

$(function () {

    // BLOCK MÉTIER ADMIN PORTAIL
    var url_administration = BASE_URI + 'administration';
    React.render(<BlockAccueil
        titre={Lang.get('menu.top.administration')}
        texte={Lang.get('accueil.block_admin_text')}
        bouton={Lang.get('global.acceder')}
        bouton_url={url_administration}
        module_url="administration"/>,
        document.getElementById('block_administration'));

    // BLOCK MÉTIER ADMIN PARKING
    var urlParking = BASE_URI + 'administration_parking';
    React.render(<BlockAccueil
            titre={Lang.get('menu.top.administration_parking')}
            texte={Lang.get('accueil.block_admin_parking_text')}
            bouton={Lang.get('global.acceder')}
            bouton_url={urlParking}
            module_url="administration_parking"/>,
        document.getElementById('block_administration_parking'));

    // BLOCK MÉTIER SUPERVISION
    var urlSupervision = BASE_URI + 'supervision';
    React.render(<BlockAccueil
            titre={Lang.get('menu.top.supervision')}
            texte={Lang.get('accueil.block_supervision_text')}
            bouton={Lang.get('global.acceder')}
            bouton_url={urlSupervision}
            module_url="supervision"/>,
        document.getElementById('block_supervision'));

    // BLOCK MÉTIER CALENDRIER
    var urlCalendrier = BASE_URI + 'calendrier';
    React.render(<BlockAccueil
            titre={Lang.get('menu.top.calendrier')}
            texte={Lang.get('accueil.block_calendrier_text')}
            bouton={Lang.get('global.acceder')}
            bouton_url={urlCalendrier}
            module_url="calendrier"/>,
        document.getElementById('block_calendrier'));
});
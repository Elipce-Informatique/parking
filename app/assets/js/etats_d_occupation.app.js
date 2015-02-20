/* Composant react de la page profils */
require('./global/global');
var ReactPageEtatsDoccupation = require('./mods/page/react_page_etats_d_occupation');

$(function(){

    /* Ajout de l'élément react_page_profil à l'ID "page_profil" défini dans profil.app.js */
    var oReactPageEtatsDoccupation = React.render(
        <ReactPageEtatsDoccupation id="tab_etats_d_occupation"/>,
        document.getElementById('page_etats_d_occupation')
    );

});
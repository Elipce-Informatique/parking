/* Composant react de la page profils */
var ReactPageProfil = require('./mods/page/react_page_profil');

$(function(){

    /* Ajout de l'élément react_page_profil à l'ID "page_profil" défini dans profil.app.js */
    var oReactPageProfil = React.render(
        <ReactPageProfil id="tab_profil"/>,
        document.getElementById('page_profil')
    );

});
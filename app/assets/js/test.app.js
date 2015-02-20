/* Composant react de la page test */
require('./global/global');
var ReactPageTest = require('./mods/page/react_page_test');

$(function(){

    /* Ajout de l'élément react_page_profil à l'ID "page_profil" défini dans profil.app.js */
    var oReactPageTest = React.render(
        <ReactPageTest id="page_test"/>,
        document.getElementById('page_test')
    );

});
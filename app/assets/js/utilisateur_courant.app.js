// ATTENTION la majuscule est super importante
var PageUserCourant = require('./mods/page/react_page_utilisateur_courant');

$(function(){
    var oReactPageUserCourant = React.render(
        <PageUserCourant />,
        document.getElementById('content_user')
    );
});
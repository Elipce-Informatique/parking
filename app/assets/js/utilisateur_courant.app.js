// ATTENTION la majuscule est super importante
var PageUserCourant = require('./mods/page/react_page_utilisateur_courant').Composant;

$(function(){
    console.log('ICICIIIII');
    var oReactPageUser = React.render(
        <PageUserCourant />,
        document.getElementById('content_user')
    );
});
// ATTENTION la majuscule est super importante
require('./global/global');
var PageUser = require('./mods/page/react_page_utilisateur').Composant;

$(function(){

    var oReactPageUser = React.render(
        <PageUser />,
        document.getElementById('content_user')
    );
});
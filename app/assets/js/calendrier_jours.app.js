// ATTENTION la majuscule est super importante
require('./global/global');
var PageJours = require('./mods/page/react_page_calendrier_jours').Composant;

$(function(){

    var oReactPageJours = React.render(
        <PageJours/>,
        document.getElementById('content_jours')
    );
});
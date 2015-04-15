// ATTENTION la majuscule est super importante
require('./global/global');
var React = require('react/addons');
var PageProg = require('./mods/page/react_page_calendrier_prog').Composant;

$(function(){

    React.render(
        <PageProg/>,
        document.getElementById('content_prog')
    );
});
// ATTENTION la majuscule est super importante
require('./global/global');
var React = require('react/addons');
var PageNiveau = require('./mods/page/react_page_parking').Composant;

$(function(){

    React.render(
        <PageNiveau/>,
        document.getElementById('content_parking')
    );
});
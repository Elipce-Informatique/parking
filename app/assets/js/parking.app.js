// ATTENTION la majuscule est super importante
require('./global/global');
var React = require('react/addons');
var PageParking = require('./mods/page/react_page_parking').Composant;

$(function(){

    React.render(
        <PageParking/>,
        document.getElementById('content_parking')
    );
});
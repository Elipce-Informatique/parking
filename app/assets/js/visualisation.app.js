require('./global/global');
var React = require('react/addons');

var PageVisu = require('./mods/page/react_page_visualisation');

// Au chargement du DOM
$(function () {
    var ReactPageVisu = React.render(
        <PageVisu/>,
        document.getElementById('visualisation_parking')
    );
});
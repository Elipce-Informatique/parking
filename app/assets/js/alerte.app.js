require('./global/global');
var React = require('react/addons');
var Page = require('./mods/page/react_page_alerte');

$(function(){

    React.render(
        <Page/>,
        document.getElementById('content_alerte')
    );
});
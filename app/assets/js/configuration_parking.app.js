require('./global/global');

var PageConfig = require('./mods/page/react_page_configuration_parking');

// Au chargement du DOM
$(function () {
    var oReactPageConfig = React.render(
        <PageConfig/>,
        document.getElementById('configuration_parking')
    );
});
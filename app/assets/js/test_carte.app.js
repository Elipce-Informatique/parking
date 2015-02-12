// Composant de la map
var ParkingMap = require('./mods/composants/admin_parking_map');
var Collapse = require('./mods/composants/react_collapse').Collapse;
var CollapseBody = require('./mods/composants/react_collapse').CollapseBody;
var CollapseSidebar = require('./mods/composants/react_collapse').CollapseSidebar;

/**
 * Au chargement du DOM
 * Préparation de la carte
 */
$(function () {

    var url = BASE_URI + 'public/images/test_carte.svg';
    var map = React.render(
        <Collapse align="right" sideWidth={3}>
            <CollapseBody>
                <ParkingMap imgUrl={url} divId="div_carte" mapHeight={300}  />
            </CollapseBody>
            <CollapseSidebar title="Reporting">
                <span>Voici le contenu de la sidebar Voici le contenu de la sidebar Voici le contenu de la sidebar Voici le contenu de la sidebar Voici le contenu de la sidebar</span>
            </CollapseSidebar>
        </Collapse>,
        document.getElementById('map_test')
    );
});




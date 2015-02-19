// Composant de la map
var ParkingMap = require('./mods/composants/maps/supervision_parking_map');
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
        <Collapse align="left" sideWidth={6}>
            <CollapseBody>
                <ParkingMap imgUrl={url} divId="div_carte"/>
            </CollapseBody>
            <CollapseSidebar title="Reporting">
                <span>Voici le contenu de la sidebar Voici le contenu de la sidebar Voici le contenu de la sidebar Voici le contenu de la sidebar Voici le contenu de la sidebar</span>
            </CollapseSidebar>
        </Collapse>,
        document.getElementById('map_test')
    );
});




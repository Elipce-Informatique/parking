var Collapse = require('../mods/composants/react_collapse').Collapse;
var CollapseBody = require('../mods/composants/react_collapse').CollapseBody;
var CollapseSidebar = require('../mods/composants/react_collapse').CollapseSidebar;

/**
 * Created by yann on 18/11/2014.
 * Instantiation des menus de l'application
 */
(function () {
    var MenuTop = require('../mods/composants/menu/react_menu_top');
    var MenuLeft = require('../mods/composants/menu/react_menu_left');

    $(function () {

        // CRÉATION DU MENU D'EN HAUT SI LA PAGE LE PERMET
        if (document.getElementById('menu-top')) {
            // Variables du menu
            var name = Lang.get('global.app_name');

            React.render(<MenuTop appName={name} />, document.getElementById('menu-top'));
        }

        // CRÉATION DU MENU GAUCHE SI LA PAGE LE PERMET
        if (document.getElementById('menu-left')) {

            React.render(
                <Collapse align="right" sideWidth={12}>
                    <CollapseBody>
                        <MenuLeft/>
                    </CollapseBody>
                    <CollapseSidebar title="Menu">
                        <span></span>
                    </CollapseSidebar>
                </Collapse>, document.getElementById('menu-left'));
        }
    });

})();

/**
 * Created by vivian on 26/02/2015.
 */
// Composants
var React = require('react/addons');
var OverlayTrigger = ReactB.OverlayTrigger;
var Tooltip = ReactB.Tooltip;
var Glyphicon = ReactB.Glyphicon;


// Fonctions

/**
 * Ajoute un addon "etoile" devant le champ pour indiquer qu'il est obligatoire
 * @param attrs: attributs HTML
 * @param value: value du champ Input
 * @returns {*}
 */
var addRequiredAddon = function (attrs, value) {
    return _.extend(attrs, {
        addonBefore: <OverlayTrigger placement="top" overlay={<Tooltip>
            {Lang.get('global.champ_obligatoire')}
        </Tooltip>}>
            <Glyphicon glyph="asterisk" />
        </OverlayTrigger>
    });
}

module.exports.addRequiredAddon = addRequiredAddon;
// Gestion du temps
var React = require('react/addons');
var moment = require('moment');
require('moment/locale/fr');
moment.locale(Lang.locale());

// Chargement des composants React Bootstrap
var Row = ReactB.Row;
var Col = ReactB.Col;
var Panel = ReactB.Panel;
var Label = ReactB.Label;
var Badge = ReactB.Badge;
var Glyph = ReactB.Glyphicon;

/**
 * Created by yann on 20/02/2015.
 *
 */
var ZoneReporting = React.createClass({

    propTypes: {
        vertical: React.PropTypes.bool
    },

    getDefaultProps: function () {
        return {vertical: false};
    },

    getInitialState: function () {
        return {};
    },

    componentDidMount: function () {

    },

    shouldComponentUpdate: function (nextProps, nextState) {
        return true;
    },

    render: function () {
        return (
            <Row className="row_reporting full-height">

            </Row>
        );
    }
});


module.exports = ZoneReporting;
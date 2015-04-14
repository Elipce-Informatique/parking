// Gestion du temps
var React = require('react/addons');
var moment = require('moment');
require('moment/locale/fr');
moment.locale(Lang.locale());

// Chargement des composants React Bootstrap
var Row = ReactB.Row;
var Col = ReactB.Col;
var ProgressBar = ReactB.ProgressBar;
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
        var md = this.props.vertical ? 12 : 4;
        return (
            <Row className="row_reporting full-height">
                <Col md={md}>
                    <StatBar libelle="Total places occupées" label='%(now)s - %(percent)s%' bsStyle='danger' max={1000} now={200} />
                    <StatBar libelle="Total places libres"  max={1000} now={245} />
                    <StatBar libelle="Pourcentage occupation" bsStyle='warning' label='%(percent)s%' max={1000} now={755} />
                </Col>
                <Col md={md}>
                    <StatBar libelle="Places occupées Niveau 1" bsStyle='danger'now={40} />
                    <StatBar libelle="Places libres Niveau 1" now={60} />
                    <StatBar libelle="Pourcentage occupation Niveau 1" bsStyle='warning' label='%(percent)s%' now={40} />
                </Col>
                <Col md={md}>
                    <StatBar libelle="Places occupées Zone A1" bsStyle='danger' max={30} now={10} />
                    <StatBar libelle="Places libres Zone A1" max={30} now={20} />
                    <StatBar libelle="Pourcentage occupation Zone A1" bsStyle='warning' label='%(percent)s%' max={30} now={10} />
                </Col>
            </Row>
        );
    }
});

/**
 * Created by yann on 14/04/2015.
 *
 * @param name : nom a afficher dans le composant
 */
var StatBar = React.createClass({

    propTypes: {
        libelle: React.PropTypes.string.isRequired,
        bsStyle: React.PropTypes.string,
        striped: React.PropTypes.bool,
        active: React.PropTypes.bool,
        label: React.PropTypes.string,
        min: React.PropTypes.number,
        max: React.PropTypes.number,
        now: React.PropTypes.number
    },

    getDefaultProps: function () {
        return {
            bsStyle: "success",
            striped: true,
            active: true,
            label: '%(now)s',
            min: 0,
            max: 100,
            now: 50
        };
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
            <Row>
                <Col md={4}>
                    <label className="label-stats">{this.props.libelle}</label>
                </Col>
                <Col md={8}>
                    <ProgressBar {...this.props} />
                </Col>
            </Row>);
    }
});


module.exports = ZoneReporting;
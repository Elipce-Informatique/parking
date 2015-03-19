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
var ZoneTempsReel = React.createClass({

    propTypes: {},

    getDefaultProps: function () {
        return {};
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
            <Row className="row_temps_reel">
                <Col md={3}>
                    <Panel
                        header={<strong>{Lang.get('administration_parking.treel.alerte')}</strong>}
                        bsStyle="warning"
                        className="treel-alerte">
                        <AlertMessage bsStyle="danger" label="Zone 1" message="est complète."/>
                        <AlertMessage bsStyle="success" label="Allée 1" message="est vide."/>
                        <AlertMessage bsStyle="success" label="Zone 2" message="est vide."/>
                        <AlertMessage bsStyle="warning" label="Ventouse" message="sur la place p42."/>
                        <AlertMessage bsStyle="danger" label="Zone 1" message="est complète."/>
                        <AlertMessage bsStyle="info" label="Niveau 2" message="s'est allumé."/>
                        <AlertMessage bsStyle="success" label="Zone 2" message="est vide."/>
                        <AlertMessage bsStyle="danger" label="allée 42" message="est complète."/>
                        <AlertMessage bsStyle="danger" label="niveau 3" message="est complète."/>
                        <AlertMessage bsStyle="info" label="Niveau 2" message="s'est allumé."/>
                        <AlertMessage bsStyle="warning" label="Ventouse" message="sur la place p24."/>

                    </Panel>
                </Col>
                <Col md={3}>
                    <Panel
                        header={<strong>{Lang.get('administration_parking.treel.journal')}</strong>}
                        bsStyle="warning"
                        className="treel-journal">
                        <AlertMessage bsStyle="success" label="P8" message="se libère."/>
                        <AlertMessage bsStyle="success" label="P32" message="se libère."/>
                        <AlertMessage bsStyle="warning" label="P21" message="est occupée."/>
                        <AlertMessage bsStyle="success" label="P534" message="se libère."/>
                        <AlertMessage bsStyle="warning" label="P850" message="est occupée."/>
                        <AlertMessage bsStyle="warning" label="P73" message="est occupée."/>
                        <AlertMessage bsStyle="warning" label="P245" message="est occupée."/>
                        <AlertMessage bsStyle="success" label="P42" message="se libère."/>
                    </Panel>
                </Col>
                <Col md={3}>
                    <Panel
                        header={<strong>{Lang.get('administration_parking.treel.anomalie')}</strong>}
                        bsStyle="warning"
                        className="treel-anomalie">
                        <AlertMessage bsStyle="danger" label={<Glyph glyph="exclamation-sign"/>} message="le capteur 01-03-128 ne fonctionne plus."/>
                        <AlertMessage bsStyle="danger" label={<Glyph glyph="exclamation-sign"/>} message="le capteur 04-02-136 ne fonctionne plus."/>
                        <AlertMessage bsStyle="danger" label={<Glyph glyph="exclamation-sign"/>} message="le capteur 01-05-037 ne fonctionne plus."/>
                        <AlertMessage bsStyle="danger" label={<Glyph glyph="exclamation-sign"/>} message="le capteur 03-06-201 ne fonctionne plus."/>
                        <AlertMessage bsStyle="danger" label={<Glyph glyph="exclamation-sign"/>} message="le capteur 03-00-205 ne fonctionne plus."/>
                        <AlertMessage bsStyle="danger" label={<Glyph glyph="exclamation-sign"/>} message="le capteur 01-08-209 ne fonctionne plus."/>
                        <AlertMessage bsStyle="danger" label={<Glyph glyph="exclamation-sign"/>} message="le capteur 02-04-204 ne fonctionne plus."/>
                    </Panel>
                </Col>
                <Col md={3}>
                    <Panel
                        header={<strong>{Lang.get('administration_parking.treel.test')}</strong>}
                        bsStyle="warning"
                        className="treel-test">
                        Panel content
                    </Panel>
                </Col>
            </Row>);
    }
});

/**
 * Created by yann on 23/02/2015.
 */
var AlertMessage = React.createClass({

    propTypes: {
        label: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.object
        ]),
        message: React.PropTypes.string.isRequired,
        datetime: React.PropTypes.string,
        bsStyle: React.PropTypes.string
    },

    getDefaultProps: function () {

        return {
            bsStyle: "default",
            datetime: moment().format('LT')
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
        return (<span className="alert-message-wrapper">
            <Label bsStyle="default">{this.props.datetime}</Label>
            <Label bsStyle={this.props.bsStyle}>{this.props.label}</Label>
            <span className="alert-message">{" " + this.props.message}</span>
            <br/>
        </span>);
    }
});


module.exports = ZoneTempsReel;
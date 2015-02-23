// Gestion du temps
var moment = require('moment');
require('moment/locale/fr');
moment.locale(Lang.locale());

// Chargement des composants React Bootstrap
var Row = ReactB.Row;
var Col = ReactB.Col;
var Panel = ReactB.Panel;
var Label = ReactB.Label;
var Badge = ReactB.Badge;

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
                        <AlertMessage bsStyle="danger" label="allée 42" message="est complète."/>
                        <AlertMessage bsStyle="danger" label="niveau 3" message="est complète."/>

                    </Panel>
                </Col>
                <Col md={3}>
                    <Panel
                        header={<strong>{Lang.get('administration_parking.treel.journal')}</strong>}
                        bsStyle="warning"
                        className="treel-journal">
                        -
                        <Label bsStyle="success">P8</Label>
                        se libère.
                        <br/>
                        -
                        <Label bsStyle="success">P312</Label>
                        se libère.
                        <br/>
                        -
                        <Label bsStyle="warning">P21</Label>
                        est occupée.
                        <br/>
                        -
                        <Label bsStyle="success">P534</Label>
                        se libère.
                        <br/>
                        -
                        <Label bsStyle="warning">P850</Label>
                        est occupée.
                        <br/>
                        -
                        <Label bsStyle="warning">P73</Label>
                        est occupée.
                        <br/>
                        -
                        <Label bsStyle="warning">P245</Label>
                        est occupée.
                        <br/>
                        -
                        <Label bsStyle="success">P42</Label>
                        se libère.
                        <br/>
                    </Panel>
                </Col>
                <Col md={3}>
                    <Panel
                        header={<strong>{Lang.get('administration_parking.treel.anomalie')}</strong>}
                        bsStyle="warning"
                        className="treel-anomalie">
                        Panel content
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
        label: React.PropTypes.string.isRequired,
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
        return (<span>
            <Badge>{this.props.datetime}</Badge>
            <Label bsStyle={this.props.bsStyle}>{this.props.label}</Label>
            {" " + this.props.message}
            <br/>
        </span>);
    }
});


module.exports = ZoneTempsReel;
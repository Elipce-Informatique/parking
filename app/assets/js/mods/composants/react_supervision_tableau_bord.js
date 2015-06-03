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
var OverlayTrigger = ReactB.OverlayTrigger;
var Tooltip = ReactB.Tooltip;

/**
 * Created by yann on 20/02/2015.
 *
 */
var TableauBord = React.createClass({

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
                <Col md={md} className="full-height" key={1}>
                    <PanelOccupCourante />
                </Col>
                <Col md={md} className="full-height" key={2}>
                    <PanelOccupNiveaux />
                </Col>
                <Col md={md} className="full-height" key={3}>
                    <PanelOccupZones />
                </Col>
            </Row>
        );
    }
});

/**
 * Created by yann on 15/04/2015.
 * TODO tout traduire et lier le state aux données réelles (ajouter total etc...)
 * @param name : nom a afficher dans le composant
 */
var PanelOccupCourante = React.createClass({

    propTypes: {},

    getDefaultProps: function () {
        return {};
    },

    getInitialState: function () {
        return {
            dataOccupationPark: [
                {
                    bsStyle: 'danger',
                    label: '%(now)s',
                    now: 683
                },
                {
                    bsStyle: 'success',
                    label: '%(now)s',
                    now: 817
                }
            ],
            dataOccupationNiveau: [
                {
                    bsStyle: 'danger',
                    label: '%(now)s',
                    now: 125
                },
                {
                    bsStyle: 'success',
                    label: '%(now)s',
                    now: 375
                }
            ]
        };
    },

    componentDidMount: function () {

    }
    ,

    shouldComponentUpdate: function (nextProps, nextState) {
        return true;
    }
    ,

    render: function () {
        return (
            <Panel style={{height: '115px'}}>
                <StatBarWrapper libelle="Occupation du parking" tooltip="45.5% de places occupées" key={1}>
                    <StackedStatBar data={this.state.dataOccupationPark} max={1500} />
                </StatBarWrapper>
                <StatBarWrapper libelle="Occupation du niveau" tooltip="25% de places occupées" key={2}>
                    <StackedStatBar data={this.state.dataOccupationNiveau} max={500} />
                </StatBarWrapper>
            </Panel>);
    }
});

/**
 * Created by yann on 15/04/2015.
 *
 * TODO tout traduire et lier le state aux données réelles
 * @param name : nom a afficher dans le composant
 */
var PanelOccupNiveaux = React.createClass({

    propTypes: {},

    getDefaultProps: function () {
        return {};
    },

    getInitialState: function () {
        return {
            dataOccupation: [
                {
                    libelle: 'Niveau 1',
                    taux: 75,
                    max: 500,
                    data: [
                        {
                            bsStyle: 'danger',
                            label: '%(now)s',
                            now: 333
                        },
                        {
                            bsStyle: 'success',
                            label: '%(now)s',
                            now: 167
                        }
                    ]
                },
                {
                    libelle: 'Niveau 2',
                    taux: 45,
                    max: 500,
                    data: [
                        {
                            bsStyle: 'danger',
                            label: '%(now)s',
                            now: 225
                        },
                        {
                            bsStyle: 'success',
                            label: '%(now)s',
                            now: 275
                        }
                    ]
                },
                {
                    libelle: 'Niveau 3',
                    taux: 25,
                    max: 500,
                    data: [
                        {
                            bsStyle: 'danger',
                            label: '%(now)s',
                            now: 125
                        },
                        {
                            bsStyle: 'success',
                            label: '%(now)s',
                            now: 375
                        }
                    ]
                }
            ]
        };
    },

    componentDidMount: function () {

    }
    ,

    shouldComponentUpdate: function (nextProps, nextState) {
        return true;
    }
    ,

    render: function () {
        var bars = [];
        bars = _.map(this.state.dataOccupation, function (d, i) {
            return (
                <StatBarWrapper libelle={d.libelle} tooltip={d.taux + "% de places occupées"} key={i}>
                    <StackedStatBar data={d.data} max={d.max} />
                </StatBarWrapper>
            );
        });
        return (
            <Panel style={{height: '115px'}}>
            {bars}
            </Panel>);
    }
});

/**
 * Created by yann on 15/04/2015.
 *
 * TODO : tout traduire et lier le state aux données réelles
 * @param name : nom a afficher dans le composant
 */
var PanelOccupZones = React.createClass({

    propTypes: {},

    getDefaultProps: function () {
        return {};
    },

    getInitialState: function () {
        return {
            dataOccupation: [
                {
                    libelle: 'Zone par défaut 1',
                    taux: 75,
                    max: 500,
                    data: [
                        {
                            bsStyle: 'danger',
                            label: '%(now)s',
                            now: 333
                        },
                        {
                            bsStyle: 'success',
                            label: '%(now)s',
                            now: 167
                        }
                    ]
                },
                {
                    libelle: 'Zone par défaut 2',
                    taux: 45,
                    max: 500,
                    data: [
                        {
                            bsStyle: 'danger',
                            label: '%(now)s',
                            now: 225
                        },
                        {
                            bsStyle: 'success',
                            label: '%(now)s',
                            now: 275
                        }
                    ]
                },
                {
                    libelle: 'Zone par défaut 3',
                    taux: 25,
                    max: 500,
                    data: [
                        {
                            bsStyle: 'danger',
                            label: '%(now)s',
                            now: 125
                        },
                        {
                            bsStyle: 'success',
                            label: '%(now)s',
                            now: 375
                        }
                    ]
                }
            ]
        };
        ;
    },

    componentDidMount: function () {

    },

    shouldComponentUpdate: function (nextProps, nextState) {
        return true;
    },

    render: function () {
        var bars = [];
        bars = _.map(this.state.dataOccupation, function (d, i) {
            return (
                <StatBarWrapper libelle={d.libelle} tooltip={d.taux + "% de places occupées"}  key={i}>
                    <StackedStatBar data={d.data} max={d.max} />
                </StatBarWrapper>
            );
        });
        return (
            <Panel style={{height: '115px'}}>
                {bars}
            </Panel>);
    }
});


/**
 * Created by yann on 14/04/2015.
 *
 * Crée une barre de progression pour les stats avec pas mal de props par défaut.
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
        return (<ProgressBar {...this.props} />);
    }
});

/**
 * Affiche une barre stackée en fonction des data passées.
 * Les data sont les props à passer à chaque morceau de barre.
 *
 * Pas de label affiché devant.
 *
 * @param name : nom a afficher dans le composant
 */
var StackedStatBar = React.createClass({

    propTypes: {
        data: React.PropTypes.array.isRequired,
        min: React.PropTypes.number,
        max: React.PropTypes.number,
        striped: React.PropTypes.bool,
        active: React.PropTypes.bool
    },

    getDefaultProps: function () {
        return {
            min: 0,
            max: 100,
            striped: true,
            active: true
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
        var bars = _.map(this.props.data, function (d, i) {
            return (
                <ProgressBar {...d}
                    min={this.props.min}
                    max={this.props.max}
                    key={i}
                />
            );
        }, this);

        return (
            <ProgressBar {... this.props}>
                {bars}
            </ProgressBar>
        );
    }
});

/**
 * Created by yann on 15/04/2015.
 *
 * @param name : nom a afficher dans le composant
 */
var StatBarWrapper = React.createClass({

    propTypes: {
        libelle: React.PropTypes.string.isRequired,
        tooltip: React.PropTypes.string,
        simpleBarData: React.PropTypes.object
    },

    getDefaultProps: function () {
        return {
            tooltip: ''
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
        var bars = this.props.simpleBarData ? <StatBar {...this.props.simpleBarData} /> : this.props.children;
        if (this.props.tooltip != '') {
            bars = (
                <OverlayTrigger
                    placement='bottom'
                    overlay={<Tooltip>
                            {this.props.tooltip}</Tooltip>}>
                    {this.props.children}
                </OverlayTrigger>);
        }

        return (
            <Row>
                <Col md={4} key={1}>
                    <label className="label-stats">{this.props.libelle}</label>
                </Col>
                <Col md={8} key={2}>
                    {bars}
                </Col>
            </Row>
        );
    }
});


module.exports = TableauBord;
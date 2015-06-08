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

    mixins: [Reflux.ListenerMixin],

    propTypes: {
        parkingId: React.PropTypes.any.isRequired,
        vertical: React.PropTypes.bool
    },

    getDefaultProps: function () {
        return {vertical: false};
    },

    getInitialState: function () {
        // State vide pour éviter les erreurs de références
        return {
            'b1': [],
            'b2': [],
            'b3': [],
            'prefs': {
                'b1': {
                    'types': [],
                    'ordre': []
                },
                'b2': {
                    'types': [],
                    'ordre': []
                },
                'b3': {
                    'types': [],
                    'ordre': []
                }
            },
            'types': []

        };
    },

    componentWillMount: function () {
        this.listenTo(store, this.updateState, this.updateState);
    },

    shouldComponentUpdate: function (nextProps, nextState) {
        return true;
    },

    componentWillReceiveProps: function (np) {
        if (np.parkingId != '') {
            Actions.supervision.tableau_bord_update(np.parkingId);
        }
    },

    /**
     * Retour du store, met à jour le state de la page
     * @param data : les nouvelles données venant du store
     */
    updateState: function (data) {
        // MAJ data automatique, lifecycle "UPDATE"
        this.setState(data);
    },

    render: function () {
        var md = this.props.vertical ? 12 : 4;

        console.log('State tableau de bord : %o', this.state);

        return (
            <Row className="row_reporting full-height">
                <Col md={md} className="full-height" key={1}>
                    <PanelOccupCourante data={this.state.b1} preferences={this.state.prefs.b1} />
                </Col>
                <Col md={md} className="full-height" key={2}>
                    <PanelOccupNiveaux data={this.state.b2} preferences={this.state.prefs.b2}/>
                </Col>
                <Col md={md} className="full-height" key={3}>
                    <PanelOccupZones data={this.state.b3} preferences={this.state.prefs.b3}/>
                </Col>
            </Row>
        );
    }
});

/**
 * Created by yann on 15/04/2015.
 * TODO tout refaire avec les bonnes données
 * @param name : nom a afficher dans le composant
 */
var PanelOccupCourante = React.createClass({

    propTypes: {
        data: React.PropTypes.object.isRequired,
        preferences: React.PropTypes.object.isRequired
    },

    getDefaultProps: function () {
        return {};
    },

    getInitialState: function () {
        return {};
    },

    componentDidMount: function () {

    }
    ,

    shouldComponentUpdate: function (nextProps, nextState) {
        return true;
    }
    ,

    render: function () {

        var totalBar = [];
        var detailBars = [];
        // DATA dispo
        if (_.keys(this.props.data).length > 0) {
            // Séparation des données
            var data = this.props.data;
            var total = data['TOTAL'];
            var detail = _.omit(data, 'TOTAL');

            // ---------------------------------
            // Génération de la barre de total
            var dataTotal = [
                {
                    bsStyle: 'danger',
                    label: '%(now)s',
                    now: total.occupee
                },
                {
                    bsStyle: 'success',
                    label: '%(now)s',
                    now: total.libre
                }
            ];
            totalBar = (
                <StatBarWrapper
                    libelle={total.libelle + ' (' + total.total + ')'}
                    tooltip={(total.occupee / total.total * 100).toFixed(2) + "% " + Lang.get('supervision.tab_bord.tooltip_occupation')}
                    key='total'>
                    <StackedStatBar
                        data={dataTotal}
                        max={total.total} />
                </StatBarWrapper>
            );

            // ---------------------------------
            // Génération des barres de détail
            detailBars = _.map(detail, function (d) {
                var dataDetail = [
                    {
                        bsStyle: 'danger',
                        label: '%(now)s',
                        now: d.occupee
                    },
                    {
                        bsStyle: 'success',
                        label: '%(now)s',
                        now: d.libre
                    }
                ];

                return (
                    <StatBarWrapper
                        libelle={d.libelle + ' (' + d.total + ')'}
                        tooltip={(d.occupee / d.total * 100).toFixed(2) + "% " + Lang.get('supervision.tab_bord.tooltip_occupation')}
                        key={'detail-' + d.libelle}>
                        <StackedStatBar
                            data={dataDetail}
                            max={d.total} />
                    </StatBarWrapper>);
            });

        }

        return (
            <Panel style={{height: '115px'}}>
            {totalBar}
            {detailBars}
            </Panel>
        );
    }
});

/**
 * Created by yann on 15/04/2015.
 *
 * TODO tout traduire et lier le state aux données réelles
 * @param name : nom a afficher dans le composant
 */
var PanelOccupNiveaux = React.createClass({

    propTypes: {
        data: React.PropTypes.object.isRequired,
        preferences: React.PropTypes.object.isRequired
    },

    getDefaultProps: function () {
        return {};
    },

    getInitialState: function () {
        return {
            dataOccupation: []
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
        console.log('DATA niveaux : %o', this.props.data);

        var bars = [];
        // DATA dispos
        if (_.keys(this.props.data).length > 0) {

            // PARCOURT DES PLANS
            _.each(this.props.data, function (plan, libelle) {

                // Séparation des données
                var data = plan;
                var total = data['TOTAL'];
                var detail = _.omit(data, 'TOTAL');

                // ---------------------------------
                // Génération de la barre de total
                var dataTotal = [
                    {
                        bsStyle: 'danger',
                        label: '%(now)s',
                        now: total.occupee
                    },
                    {
                        bsStyle: 'success',
                        label: '%(now)s',
                        now: total.libre
                    }
                ];
                bars.push(
                    <StatBarWrapper
                        libelle={total.libelle + ' ' + libelle + ' (' + total.total + ')'}
                        tooltip={(total.occupee / total.total * 100).toFixed(2) + "% " + Lang.get('supervision.tab_bord.tooltip_occupation')}
                        key={'total' + libelle}>
                        <StackedStatBar
                            data={dataTotal}
                            max={total.total} />
                    </StatBarWrapper>
                );

                // ---------------------------------
                // Génération des barres de détail
                Array.prototype.push.apply(bars, _.map(detail, function (d) {
                    var dataDetail = [
                        {
                            bsStyle: 'danger',
                            label: '%(now)s',
                            now: d.occupee
                        },
                        {
                            bsStyle: 'success',
                            label: '%(now)s',
                            now: d.libre
                        }
                    ];
                    return (
                        <StatBarWrapper
                            libelle={d.libelle + ' (' + d.total + ')'}
                            tooltip={(d.occupee / d.total * 100).toFixed(2) + "% " + Lang.get('supervision.tab_bord.tooltip_occupation')}
                            key={'detail-' + libelle + '-' + d.libelle }>
                            <StackedStatBar
                                data={dataDetail}
                                max={d.total} />
                        </StatBarWrapper>);
                }));

            });
        }

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

    propTypes: {
        data: React.PropTypes.array.isRequired,
        preferences: React.PropTypes.object.isRequired
    },

    getDefaultProps: function () {
        return {};
    },

    getInitialState: function () {
        return {
            dataOccupation: []
        };
    },

    componentDidMount: function () {

    },

    shouldComponentUpdate: function (nextProps, nextState) {
        return true;
    },

    render: function () {
        var totalBar = [];
        var detailBars = [];
        return (
            <Panel style={{height: '115px'}}>
                {totalBar}
                {detailBars}
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


var store = Reflux.createStore({
    getInitialState: function () {
        return {};
    },
    // Initial setup
    init: function () {
        // Register statusUpdate action
        this.listenTo(Actions.supervision.tableau_bord_update, this.updateTableauBord);

    },
    /**
     * Récupère les donnée AJAX du tabeau de bord
     */
    updateTableauBord: function (parkingId) {
        var url = BASE_URI + 'parking/' + parkingId + '/tableau_bord';
        console.log('url = %o', url);
        $.ajax({
            type: 'GET',
            url: url,
            context: this,
            global: false
        })
            .done(function (retour) {
                // On success use return data here
                this.trigger(retour);
            })
            .fail(function (xhr, type, exception) {
                // if ajax fails display error alert
                console.error("ajax error response error " + type);
                console.error("ajax error response body " + xhr.responseText);
            });
    }
});
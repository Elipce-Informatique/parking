// Gestion du temps
var React = require('react/addons');
var moment = require('moment');
require('moment/locale/fr');
moment.locale(Lang.locale());
require('sweetalert');

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

// MODALS
var ModalPrefs = require('./modals/mod_preferences_blocs');
var form_data_helper = require('../helpers/form_data_helper');

/**
 * Created by yann on 20/02/2015.
 *
 */
var TableauBord = React.createClass({

    mixins: [Reflux.ListenerMixin, ReactB.OverlayMixin],

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
            'types': [],
            modalPref: {
                display: false,
                bloc: ''
            },
            display: false
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
            this.setState({display: true});
        } else {
            this.setState({display: false});
        }
    },

    /**
     * Retour du store, met à jour le state de la page
     * @param data : les nouvelles données venant du store
     */
    updateState: function (data) {
        // MAJ data automatique, lifecycle "UPDATE"
        if (!data.reset) {
            this.setState(data);
        } else {
            this.replaceState(this.getInitialState());

        }
    },
    /**
     * Méthode appellée par le "OverlayMixin", au moment du montage initial et de chaque update.
     * La valeur retournée est ajoutée au body de la page.
     * @returns {XML}
     */
    renderOverlay: function () {
        if (this.state.modalPref.display) {
            // Préparation des datas de la combobox:
            var dataCombo = _.map(this.state.types, function (t) {
                return {label: t.libelle, value: t.id.toString()};
            });
            var selectedIds = this.state.prefs[this.state.modalPref.bloc].types;
            console.log('Selected Ids : %o', selectedIds);

            var mod = (
                <ModalPrefs
                    onToggle={this.toggleModal}
                    bloc={this.state.modalPref.bloc}
                    titre={Lang.get('supervision.tab_bord.' + this.state.modalPref.bloc)}
                    dataCombo={dataCombo}
                    initialSelectedIds={selectedIds}
                />);
            return mod;
        } else {
            return null;
        }
    },
    toggleModal: function () {
        this.setState({
            modalPref: {
                display: !this.state.modalPref.display
            }
        });
    },
    showModal: function () {
        this.setState({
            modalPref: {
                display: true
            }
        });
    },
    hideModal: function () {
        this.setState({
            modalPref: {
                display: false
            }
        });
    },

    render: function () {
        var md = this.props.vertical ? 12 : 4;

        console.log('State tableau de bord : %o', this.state);

        if (this.state.display) {
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
        } else {
            return null;
        }
    }
});

/**
 * Created by yann on 15/04/2015.
 * TODO tout refaire avec les bonnes données
 * @param name : nom a afficher dans le composant
 */
var PanelOccupCourante = React.createClass({

    propTypes: {
        data: React.PropTypes.any.isRequired,
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
    },

    /**
     *
     * @param e
     */
    _handleClick: function (e) {
        Actions.supervision.preferences_blocs('b1');
    },
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
            var pourcent = parseFloat((total.occupee / total.total * 100).toFixed(2));
            totalBar = (
                <StatBarWrapper
                    libelle={total.libelle}
                    tooltip={(isNaN(pourcent) ? 0 : pourcent) + "% " + Lang.get('supervision.tab_bord.tooltip_occupation')}
                    badge={total.total.toString()}
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
                        libelle={d.libelle}
                        libelleColor={d.couleur}
                        tooltip={(d.occupee / d.total * 100).toFixed(2) + "% " + Lang.get('supervision.tab_bord.tooltip_occupation')}
                        badge={d.total.toString()}
                        key={'detail-' + d.libelle}>
                        <StackedStatBar
                            data={dataDetail}
                            max={d.total} />
                    </StatBarWrapper>);
            });

        }

        return (
            <Panel onClick={this._handleClick} style={{height: '115px'}}>
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
        data: React.PropTypes.any.isRequired,
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
    },
    /**
     *
     * @param e
     */
    _handleClick: function (e) {
        Actions.supervision.preferences_blocs('b2');
    },

    render: function () {
        var bars = generateBarsFromData(this.props.data);

        return (
            <Panel onClick={this._handleClick} style={{height: '115px'}}>
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
        data: React.PropTypes.any.isRequired,
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
    /**
     *
     * @param e
     */
    _handleClick: function (e) {
        Actions.supervision.preferences_blocs('b3');
    },
    render: function () {
        var bars = generateBarsFromData(this.props.data);

        return (
            <Panel onClick={this._handleClick} style={{height: '115px'}}>
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
 */
var StatBarWrapper = React.createClass({

    propTypes: {
        libelle: React.PropTypes.string.isRequired,
        libelleColor: React.PropTypes.string,
        tooltip: React.PropTypes.string,
        badge: React.PropTypes.string,
        simpleBarData: React.PropTypes.object
    },

    getDefaultProps: function () {
        return {
            tooltip: '',
            badge: '',
            libelleColor: ''
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

        // Génération du tooltip pour la barre
        if (this.props.tooltip != '') {
            bars = (
                <OverlayTrigger
                    placement='bottom'
                    overlay={<Tooltip>
                            {this.props.tooltip}</Tooltip>}>
                    {this.props.children}
                </OverlayTrigger>);
        }

        // Génération de la couleur du label
        var style = {};
        if (this.props.libelleColor != '') {
            style = {
                'background-color': '#' + this.props.libelleColor
            };
        }

        // Génération du badge pour le label
        var badge = '';
        if (this.props.badge != '') {
            badge = (<Label
                className="label-stats"
                bsStyle='primary'
                style={style}>
                        {this.props.badge}
            </Label>);
        }

        return (
            <Row>
                <Col md={4} key={1}>
                    <Row className="row-label">
                        <Col md={2}>
                            {{badge}}
                        </Col>
                        <Col md={10}>
                            <label className="label-stats" >{'' + this.props.libelle}</label>
                        </Col>
                    </Row>
                </Col>
                <Col md={8} key={2}>
                    {bars}
                </Col>
            </Row>
        );
    }
});

/**
 * Génère les barres des blocs 2 et 3 (groupés par plan et zone)
 *
 * @param dataBars
 * @returns {Array}
 */
function generateBarsFromData(dataBars) {
    var bars = [];
    // DATA dispos
    if (_.keys(dataBars).length > 0) {

        // PARCOURT DES PLANS
        _.each(dataBars, function (plan, libelle) {

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
            var pourcent = parseFloat((total.occupee / total.total * 100).toFixed(2));
            bars.push(
                <StatBarWrapper
                    libelle={total.libelle + ' ' + libelle}
                    tooltip={(isNaN(pourcent) ? 0 : pourcent) + "% " + Lang.get('supervision.tab_bord.tooltip_occupation')}
                    badge={total.total}
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
                var pourcent = parseFloat((d.occupee / d.total * 100).toFixed(2));

                return (
                    <StatBarWrapper
                        libelle={d.libelle + ' ' + libelle }
                        libelleColor={d.couleur}
                        tooltip={(isNaN(pourcent) ? 0 : pourcent) + "% " + Lang.get('supervision.tab_bord.tooltip_occupation')}
                        badge={d.total.toString()}
                        key={'detail-' + libelle + '-' + d.libelle }>
                        <StackedStatBar
                            data={dataDetail}
                            max={d.total} />
                    </StatBarWrapper>);
            }));

        });
    }

    return bars;
}

module.exports = TableauBord;


var store = Reflux.createStore({
    _inst: {
        prefs: {},
        types: {},
        parkingId: '',
        bloc_modal: ''
    },
    getInitialState: function () {
        return {};
    },
    // Initial setup
    init: function () {
        // Register statusUpdate action
        this.listenTo(Actions.supervision.tableau_bord_update, this.updateTableauBord);
        this.listenTo(Actions.supervision.preferences_blocs, this.modalPreferences);
        this.listenTo(Actions.validation.submit_form, this.submitModal);

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
                if (retour != '') {
                    this.trigger(retour);
                    this._inst.prefs = retour.prefs;
                    this._inst.parkingId = parkingId;
                } else {
                    swal(Lang.get('supervision.tab_bord.swal_aucune_place'));
                    this.trigger({reset: true});
                }
            })
            .fail(function (xhr, type, exception) {
                // if ajax fails display error alert
                console.error("ajax error response error " + type);
                console.error("ajax error response body " + xhr.responseText);
            });
    },

    modalPreferences: function (bloc) {
        var prefsBloc = this._inst.prefs[bloc];

        // On est bien sur un parking
        if (prefsBloc != undefined) {
            // Il faut maintenant appeller la popup avec en paramètres les préférences de l'utilisateur
            // (Vu qu'elles sont dispos dans le composant (state) on a juste à appeller l'overlayTrigger)
            this._inst.bloc_modal = bloc;
            this.trigger({
                modalPref: {
                    display: true,
                    bloc: bloc
                }
            });
        }
    },

    /**
     * Gère l'enregistrement AJAX des données sélectionnées dans la modale
     */
    submitModal: function (e) {
        var fData = form_data_helper('form_mod_prefs', 'POST');
        fData.append('parking_id', this._inst.parkingId);
        fData.append('bloc', this._inst.bloc_modal);

        $.ajax({
            type: 'POST',
            url: BASE_URI + 'moncompte/preferences_supervision',
            processData: false,
            contentType: false,
            data: fData,
            context: this
        })
            .done(function (retour) {
                if (retour.save) {
                    // MASQUAGE MODALE
                    this.trigger({
                        modalPref: {
                            display: false,
                            bloc: ''
                        }
                    });
                    // RAFRAICHISSEMENT TAB BORD
                    Actions.supervision.tableau_bord_update(this._inst.parkingId);
                    Actions.notif.success();
                } else {
                    Actions.notif.error();
                }
            })
            .fail(function (xhr, type, exception) {
                // if ajax fails display error alert
                console.error("ajax error response error " + type);
                console.error("ajax error response body " + xhr.responseText);
            });
    }
});
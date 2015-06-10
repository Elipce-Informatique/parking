/********************************************/
var React = require('react');
var TreeView = require('react-bootstrap-treeview/dist/js/react-bootstrap-treeview');
var Simulator = require('../simulator/react_simulator');

// COMPOSANTS NÉCESSAIRES:
var Collapse = require('../composants/react_collapse').Collapse;
var CollapseBody = require('../composants/react_collapse').CollapseBody;
var CollapseSidebar = require('../composants/react_collapse').CollapseSidebar;
var ParkingMap = require('../composants/maps/supervision_parking_map');
var TestD3 = require('../charts/test_d3');
var ZoneTempsReel = require('../composants/react_supervision_temps_reel');
var TableauBord = require('../composants/react_supervision_tableau_bord');

var Col = ReactB.Col;
var Row = ReactB.Row;
var Jumbotron = ReactB.Jumbotron;
var PageHeader = ReactB.PageHeader;
var Glyphicon = ReactB.Glyphicon;

/* Gestion de la modification et des droits */
var AuthentMixins = require('../mixins/component_access');
/* Pour le listenTo           */
var MixinGestMod = require('../mixins/gestion_modif');
/* Pour la gestion des modifs */
// HELPERS
var pageState = require('../helpers/page_helper').pageState;
var mapHelper = require('../helpers/map_helper');

/************************************************************************************************/
/*                                                                                              */
/*                               COMPOSANT REACT PAGE                                           */
/*                                                                                              */
/************************************************************************************************/

var Page = React.createClass({
    mixins: [Reflux.ListenerMixin, AuthentMixins, MixinGestMod],

    propTypes: {},

    getDefaultProps: function () {
        return {
            module_url: 'visualisation'
        };
    },

    /**
     * État initial des données du composant
     */
    getInitialState: function () {
        return {
            etatPage: pageState.liste,
            treeView: [],
            planId: '',
            url: false,
            parkingId: ''
        };
    },

    componentWillMount: function () {
        //Simulator(1);

        this.listenTo(store, this.updateState, this.updateState);
    },

    componentDidMount: function () {

    },

    shouldComponentUpdate: function (nextProps, nextState) {
        return true;
    },

    /**
     * Retour du store, met à jour le state de la page
     * @param data : les nouvelles données venant du store
     */
    updateState: function (data) {
        // MAJ data automatique, lifecycle "UPDATE"
        this.setState(data);
    },

    onRetour: function () {
        // Actions a effectuer sur click bouton retour
    },

    /**
     *
     * @returns {XML}
     * @private
     */
    modeCarte: function () {

        // CRÉATION TREEVIEW
        var treeView = {};
        if (this.state.treeView.length) {
            var data = this.state.treeView;
            treeView = (<TreeView
                key="tree"
                data={data}
                levels={3}
                color="#555555"
                selectedColor="#222222"
                selectedBackColor='#eeeeee'
                onLineClicked={Actions.map.plan_selected}
                isSelectionExclusive={true}
                treeNodeAttributes={{
                    'data-id': 'id',
                    'data-is-plan': 'is-plan',
                    'data-plan-id': 'plan-id',
                    'data-parking-id': 'parking-id',
                    'data-url': 'url',
                    'data-logo': 'logo'
                }}
                nodeIcon= "glyphicon glyphicon-stop small"
                enableLinks={false}
                expandIcon= "glyphicon glyphicon-folder-close small"
                collapseIcon= "glyphicon glyphicon-folder-open small"
                classText="small"
                showTags={true}/>);
        }

        // CRÉATION MAP
        var map = (
            <Jumbotron className="jumbo-selection" bsStyle='warning'>
                <h1>
                    <Glyphicon glyph='hand-up' /> {Lang.get('global.selection')}
                </h1>
                <p>{Lang.get('supervision.carte.selection_plan')}</p>
            </Jumbotron>
        );
        if (this.state.url) {

            map = <ParkingMap
                imgUrl={this.state.url}
                parkingId={this.state.parkingId}
                parkingLogo={this.state.logo}
                planId={this.state.planId}
                divId="div_carte"
                key={Date.now()}
            />
        }

        return (
            <Col md={12} className="full-height flex-wrapper">
                <Row id="row_reporting" className="flex-header" key={1}>
                    <Col id="zone_reporting" className="full-height" md={12}>
                        <TableauBord parkingId={this.state.parkingId} />
                    </Col>
                </Row>

                <Row id="page_test" className="flex-body" key={2}>
                    <Col md={12} id="visualisation_parking" className="full-height" style={{position: 'absolute'}}>
                        <Collapse align="left" sideWidth={2}>
                            <CollapseBody>
                            {map}
                            </CollapseBody>
                            <CollapseSidebar title="Sélection">
                            {treeView}
                            </CollapseSidebar>
                        </Collapse>
                    </Col>
                </Row >
            </Col>
        );
    },

    render: function () {
        var retour = {};

        // Switch la structure de la page en fonction de l'état courant
        switch (this.state.etatPage) {
            case pageState.liste:
                retour = this.modeCarte();
                break;
            default:
                retour = <div>Hello World !</div>;
        }
        return retour;
    }
});

module.exports = Page;

/************************************************************************************************/
/*                                                                                              */
/*                               STORE REFLUX PAGE                                              */
/*                                                                                              */
/************************************************************************************************/
var store = Reflux.createStore({
        getInitialState: function () {
            var retour = {};

            $.ajax({
                type: 'GET',
                url: BASE_URI + 'parking/plan/1',
                async: false
            })
                .done(function (data) {
                    retour = {niveau: data};
                })
                .fail(function (xhr, type, exception) {
                    // if ajax fails display error alert
                    console.error("ajax error response error " + type);
                    console.error("ajax error response body " + xhr.responseText);
                });

            return retour;
        },
        // Initial setup
        init: function () {
            this.listenTo(Actions.bandeau.creer, this._create);
            this.listenTo(Actions.bandeau.editer, this._edit);
            this.listenTo(Actions.bandeau.supprimer, this._suppr);
            this.listenTo(Actions.validation.submit_form, this._save);
            this.listenTo(Actions.map.plan_selected, this._plan_selected);

            // Init du treeView
            mapHelper.initTreeviewParkingAjax(function (data) {
                var dataTableau = mapHelper.recursiveTreeViewParking(data, 0);
                this.trigger({treeView: dataTableau});
            }, this);
        },

        /**
         * Quand un item du treeview est cliqué
         * @param evt :
         * @private
         */
        _plan_selected: function (evt) {
            var $elt = $(evt.currentTarget);

            // ON EST SUR UN ELT DE TYPE PLAN !
            if ($elt.data('is-plan')) {
                var data = $elt.data();
                console.log('data: %o', data);

                var state = {
                    planId: data.id,
                    url: DOC_URI + 'plans/' + data.url,
                    parkingId: data.parkingId,
                    logo: data.logo
                };
                this.trigger(state);
            } else {
            }
        },

        // Action create du bandeau
        _create: function () {

        }
        ,

// Action edit du bandeau
        _edit: function () {

        }
        ,

// Action suppr du bandeau
        _suppr: function () {

        }
        ,

// Action save du bandeau
        _save: function () {

        }
    })
    ;
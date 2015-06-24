var React = require('react/addons');

// PANEL GAUCHE
var TreeView = require('react-bootstrap-treeview/dist/js/react-bootstrap-treeview');
var Collapse = require('../composants/react_collapse').Collapse;
var CollapseBody = require('../composants/react_collapse').CollapseBody;
var CollapseSidebar = require('../composants/react_collapse').CollapseSidebar;
var mapHelper = require('../helpers/map_helper');

var Jumbotron = ReactB.Jumbotron;
var PageHeader = ReactB.PageHeader;
var Glyphicon = ReactB.Glyphicon;

var AlerteMap = require('../composants/maps/alerte_map');
/* Gestion de la modification et des droits */
var AuthentMixins = require('../mixins/component_access');
/* Pour le listenTo           */
var MixinGestMod = require('../mixins/gestion_modif');
/* Pour la gestion des modifs */
// HELPERS
var pageState = require('../helpers/page_helper').pageState;

/************************************************************************************************/
/*                                                                                              */
/*                               COMPOSANT REACT PAGE                                           */
/*                                                                                              */
/************************************************************************************************/

var Page = React.createClass({
    mixins: [Reflux.ListenerMixin, AuthentMixins, MixinGestMod],

    propTypes: {},

    getDefaultProps: function () {
        return {module_url: 'alerte'};
    },

    /**
     * État initial des données du composant
     */
    getInitialState: function () {
        return {
            treeView: [],
            url: false,
            planId: 0,
            parkingId: 0
        };
    },

    componentWillMount: function () {
        this.listenTo(store, this._updateState, this._updateState);
    },

    shouldComponentUpdate: function (nextProps, nextState) {
        return true;
    },

    onRetour: function(){},

    /**
     * Retour du store, met à jour le state de la page
     * @param data : les nouvelles données venant du store
     */
    _updateState: function (data) {
        // MAJ data automatique, lifecycle "UPDATE"
        this.setState(data);
    },

    render: function () {
        // Création Treeview
        var treeView = '';
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
                underlineLeafOnly={true}
                treeNodeAttributes={{
                    'data-id': 'id',
                    'data-is-plan': 'is-plan',
                    'data-plan-id': 'plan-id',
                    'data-parking-id': 'parking-id',
                    'data-url': 'url'
                }}
                nodeIcon= "glyphicon glyphicon-eye-close small"
                nodeIconSelected= "glyphicon glyphicon-eye-open small"
                enableLinks={false}
                expandIcon= "glyphicon glyphicon-folder-open small"
                collapseIcon= "glyphicon glyphicon-folder-close small"
                classText="small"
                showTags={true}/>);
        }

        // Création Map
        var map = (
            <Jumbotron className="jumbo-selection" bsStyle='warning'>
                <h1>
                    <Glyphicon glyph='hand-up' /> {Lang.get('global.selection')}
                </h1>
                <p>{Lang.get('supervision.alerte.description')}</p>
            </Jumbotron>
        );
        // Plan sélectionné
        if (this.state.url) {
            map = (
                <AlerteMap
                    imgUrl={this.state.url}
                    divId="div_carte"
                    parkingId={this.state.parkingId}
                    planId={this.state.planId}
                    key={Date.now()}/>
            );
        }

        /*

         */
        return (
            <Collapse
                isCollapsed={false}
                align="left"
                sideWidth={2}>
                <CollapseBody>
                {map}
                </CollapseBody>
                <CollapseSidebar title="Sélection">
                {treeView}
                </CollapseSidebar>
            </Collapse>
        );
    }
});

module.exports = Page;

/************************************************************************************************/
/*                                                                                              */
/*                               STORE REFLUX PAGE                                              */
/*                                                                                              */
/************************************************************************************************/
var store = Reflux.createStore({
    state: {
    },

    // Initial setup
    init: function () {
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

            var state = {
                planId: data.id,
                url: DOC_URI + 'plans/' + data.url,
                parkingId: data.parkingId
            };
            this.trigger(state);
        } else {

        }
    }
});
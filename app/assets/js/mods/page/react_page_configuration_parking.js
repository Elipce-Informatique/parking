var React = require('react/addons');

// PANEL GAUCHE
var TreeView = require('react-bootstrap-treeview/dist/js/react-bootstrap-treeview');
var Collapse = require('../composants/react_collapse').Collapse;
var CollapseBody = require('../composants/react_collapse').CollapseBody;
var CollapseSidebar = require('../composants/react_collapse').CollapseSidebar;

var AdminMap = require('../composants/maps/admin_parking_map');
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
        return {module_url: 'configuration_parking'};
    },

    /**
     * État initial des données du composant
     */
    getInitialState: function () {
        return {
            etatPage: pageState.liste,
            treeView: []
        };
    },

    componentWillMount: function () {
        this.listenTo(store, this._updateState, this._updateState);
    },

    componentDidMount: function () {

    },

    shouldComponentUpdate: function (nextProps, nextState) {
        return true;
    },

    onRetour: function () {

    },

    /**
     * Retour du store, met à jour le state de la page
     * @param data : les nouvelles données venant du store
     */
    _updateState: function (data) {
        console.log('Update data : %o', data);
        // MAJ data automatique, lifecycle "UPDATE"
        this.setState(data);
    },

    /**
     * Page en mode liste
     * @returns {XML}
     * @private
     */
    _liste: function () {
        return <div>Hello liste !</div>;
    },

    /**
     * page en mode visu
     * @returns {XML}
     * @private
     */
    _visu: function () {
        return <div>Hello world !</div>;
    },

    /**
     * Page en mode creation
     * @returns {XML}
     * @private
     */
    _creation: function () {
        return <div>Hello world !</div>;
    },

    // Affiche la carte
    _carte: function () {
        var data = this.state.treeView;
        console.log('Data treeview : %o', data);

        var url = BASE_URI + 'public/images/beauvais_p3.svg';
        return <Collapse align="left" sideWidth={2}>
            <CollapseBody>
                <AdminMap imgUrl={url} divId="div_carte" parkingId={1} planId={1}/>
            </CollapseBody>
            <CollapseSidebar title="Sélection">
                <TreeView
                    data={data}
                    levels={0}
                    color="#555555"
                    selectedColor="#222222"
                    selectedBackColor='#eeeeee'
                    onLineClicked={function () {
                        console.log('click');
                    }}
                    isSelectionExclusive={true}
                    treeNodeAttributes={{'data-id': 'id'}}/>
            </CollapseSidebar>
        </Collapse>;
    },

    render: function () {
        var retour = {};

        // Switch la structure de la page en fonction de l'état courant
        switch (this.state.etatPage) {
            case pageState.liste:
                retour = this._carte();
                break;
            default:
                retour = this._liste();
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
    state: {
        pageState: pageState.liste
    },
    getInitialState: function () {
        return {pageState: this.state.pageState};
    },
    // Initial setup
    init: function () {
        this.listenTo(Actions.bandeau.creer, this._create);
        this.listenTo(Actions.bandeau.editer, this._edit);
        this.listenTo(Actions.bandeau.supprimer, this._suppr);
        this.listenTo(Actions.validation.submit_form, this._save);

        // Init du treeView
        this._initRecursiveAjax();
    },
    /**
     * Génère les données du treeview à gauche de la map
     * @param data
     */
    _initRecursiveAjax: function () {
        $.ajax({
            type: 'GET',
            url: BASE_URI + 'configuration_parking/treeview_carte',
            context: this
        })
            .done(function (data) {
                var dataTableau = this._recursiveTreeView(data);
                console.log('TTRIGGERRR');
                this.trigger({treeView: dataTableau});
            })
            .fail(function (xhr, type, exception) {
                // if ajax fails display error alert
                alert("ajax error response error " + type);
                alert("ajax error response body " + xhr.responseText);
            });

    },

    _recursiveTreeView: function (data) {
        var retour = _.map(data, function (d, i) {
            var elt = {text: d.libelle, id: d.id};

            // On est actuellement sur un parking
            if (d.niveaux !== undefined) {
                elt['nodes'] = this._recursiveTreeView(d.niveaux);
            }
            // On est sur un niveau
            else if (d.plans !== undefined) {

                // On est sur un niveau à un seul plan
                if (d.plans.length === 1) {
                    elt['url'] = d.plans[0].url;
                    elt['is-plan'] = true;
                } else {
                    elt['nodes'] = this._recursiveTreeView(d.plans);
                }
            }
            // On est sur un plan
            else if (d.url != undefined) {
                elt['url'] = d.url;
                elt['is-plan'] = true;
            }
            return elt;
        }, this);

        return retour;
    },

    // Action create du bandeau
    _create: function () {

    },

    // Action edit du bandeau
    _edit: function () {

    },

    // Action suppr du bandeau
    _suppr: function () {

    },

    // Action save du bandeau
    _save: function () {

    }
});
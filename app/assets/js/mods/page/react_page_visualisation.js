/********************************************/
var React = require('react');

// COMPOSANTS NÉCESSAIRES:
var Collapse = require('../composants/react_collapse').Collapse;
var CollapseBody = require('../composants/react_collapse').CollapseBody;
var CollapseSidebar = require('../composants/react_collapse').CollapseSidebar;
var ParkingMap = require('../composants/maps/supervision_parking_map');
var TestD3 = require('../charts/test_d3');
var ZoneTempsReel = require('../composants/react_supervision_temps_reel');
var ZoneReporting = require('../composants/react_supervision_reporting');
var Col = ReactB.Col;
var Row = ReactB.Row;

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
        return {
            module_url: 'visualisation'
        };
    },

    /**
     * État initial des données du composant
     */
    getInitialState: function () {
        return {
            etatPage: pageState.liste
        };
    },

    componentWillMount: function () {
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
        var url = BASE_URI + 'public/images/beauvais_p3.svg';
        return (
            <Col md={12} className="full-height flex-wrapper">
                <Row id="row_reporting" className="flex-header" key={1}>
                    <Col id="zone_reporting" className="full-height" md={12}>
                        <ZoneReporting />
                    </Col>
                </Row>

                <Row id="page_test" className="flex-body" key={2}>
                    <Col md={12} id="visualisation_parking" className="full-height" style={{position: 'absolute'}}>
                        <Collapse align="left" sideWidth={2}>
                            <CollapseBody>
                                <Collapse align="right" sideWidth={3}>
                                    <CollapseBody>

                                        <ParkingMap parkingId={1} niveauId={1} imgUrl={url} divId="div_carte"/>

                                    </CollapseBody>
                                    <CollapseSidebar title="Temps Réel">

                                        <ZoneTempsReel vertical={true} />

                                    </CollapseSidebar>
                                </Collapse>
                            </CollapseBody>
                            <CollapseSidebar title="Sélection">
                                sélection parking
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
        return {};
    },
    // Initial setup
    init: function () {
        this.listenTo(Actions.bandeau.creer, this._create);
        this.listenTo(Actions.bandeau.editer, this._edit);
        this.listenTo(Actions.bandeau.supprimer, this._suppr);
        this.listenTo(Actions.validation.submit_form, this._save);
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
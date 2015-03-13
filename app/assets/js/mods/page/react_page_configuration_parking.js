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
        return {};
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
        var url = BASE_URI + 'public/images/test_carte_bis_2.svg';
        return <AdminMap imgUrl={url} divId="div_carte"/>;
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
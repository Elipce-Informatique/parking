var React = require('react/addons');
// COMPOSANTS PERSO
var FicheUser = require('../react_fiche_utilisateur').Composant;
var Bandeau = require('../composants/bandeau/react_bandeau');
var BandeauEdition = require('../composants/bandeau/react_bandeau_edition');

// COMPOSANTS REACTB
var Col = ReactB.Col;

// MIXINS
var MixinGestMod = require('../mixins/gestion_modif');

// HELPERS
var pageState = require('../helpers/page_helper').pageState;
/**
 * Created by yann on 13/01/2015.
 *
 * TODO : Snippet de base pour un composant react. Commentaire à éditer
 * @param name : nom a afficher dans le composant
 */
var PageCompte = React.createClass({

    mixins: [Reflux.ListenerMixin, MixinGestMod],

    propTypes: {
        idUser: React.PropTypes.number.isRequired,
        dataUser: React.PropTypes.object.isRequired
    },

    getDefaultProps: function () {
        return {};
    },

    getInitialState: function () {
        return {
            etat: pageState.visu,
            dataUser: this.props.dataUser
        };
    },

    componentDidMount: function () {
        this.listenTo(pageCompteStore, this.updateData, this.updateData);
    },

    render: function () {
        var dynamic = this.display();
        return (
            <Col md={12}>
                {dynamic}
            </Col>
        )
    },

    display: function () {
        //console.log('Render, state data user: %o', this.state.dataUser);
        var comp;

        switch (this.state.etat) {
            case pageState.edition:
                comp =
                    <div key="pageCompteRootEdit">
                        <BandeauEdition mode={1} titre={Lang.get('administration.moncompte.titre')} sousTitre={this.state.dataUser.nom + ' ' + this.state.dataUser.prenom}/>
                        <FicheUser editable={true} userData={this.props.dataUser} idUser={this.props.idUser} modeCompte={true}/>
                    </div>;
                break;
            default:
                var btnEditer = [{
                    libelle: Lang.get('global.edit'),
                    style: "default",
                    icon: "edit",
                    attrs: {disabled: false},
                    evts: {onClick: this.modeEdition}
                }];
                comp = (
                    <div key="pageCompteRoot">
                        <Bandeau
                            titre={Lang.get('administration.moncompte.titre')}
                            sousTitre={this.state.dataUser.nom + ' ' + this.state.dataUser.prenom}
                            btnList={btnEditer}/>
                        <FicheUser editable={false} userData={this.props.dataUser} idUser={this.props.idUser} modeCompte={true}/>
                    </div>);
                break;

        }
        return comp;
    },

    updateData: function (obj) {
        //console.log('PAGE USER data %o',obj);
        // MAJ data
        this.setState(obj);
    },
    modeEdition: function (e) {
        this.setState({etat: pageState.edition});
    },

    onRetour: function () {
        window.location.replace(BASE_URI+'moncompte');
    }
});

module.exports.Composant = PageCompte;


var pageCompteStore = Reflux.createStore({

    // Variables
    stateLocal: {etat: pageState.liste},

    // Initial setup
    init: function () {

        // Register statusUpdate action
        this.listenTo(Actions.utilisateur.display_user, this.modeVisu);
        this.listenTo(Actions.bandeau.editer, this.modeEdition);
        this.listenTo(Actions.validation.submit_form, this.sauvegarder);
        this.listenTo(Actions.bandeau.supprimer, this.supprimer);
        this.listenTo(Actions.utilisateur.saveOK, this.loadProfil);
        this.listenTo(Actions.utilisateur.updateBandeau, this.setNomPrenom);

    },
    modeVisu: function (idUser) {
        this.stateLocal = {etat: pageState.visu};
        this.trigger(this.stateLocal);
    },

    modeEdition: function () {
        this.stateLocal = {etat: pageState.edition}
        this.trigger(this.stateLocal);
    },


    /**
     * Indique à la fiche utilisateur de sauvegarder les données
     */
    sauvegarder: function () {
        // La fiche user enregistre l'utilisateur
        Actions.utilisateur.save_user(this.stateLocal.idUser);
    },

    /**
     * Retour de la fiche utilisateur pour mise à jour des infos de la page
     * @param data
     */
    setNomPrenom: function (nom, prenom, id) {
        this.stateLocal.idUser = id;
        //console.log('PAGE USER trigger %o', this.stateLocal);
        this.trigger({dataUser: {nom: nom, prenom: prenom}});
    },

    /**
     * Suppression d'un utilisateur
     */
    supprimer: function () {
        // Boite de confirmation

        // Suppr
        this.stateLocal = {idUser: this.stateLocal.idUser, etat: pageState.suppression}
        Actions.utilisateur.delete_user(this.stateLocal.idUser);
    },
    loadProfil: function () {

    }
});

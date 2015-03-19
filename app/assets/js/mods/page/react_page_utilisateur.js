// Composants REACT
var React = require('react/addons');
var DataTableBandeauUser = require('../react_data_table_bandeau_utilisateur').Composant;
var BandeauListe = require('../composants/bandeau/react_bandeau_liste');
var BandeauVisu = require('../composants/bandeau/react_bandeau_visu');
var BandeauEdition = require('../composants/bandeau/react_bandeau_edition');
var BandeauGenerique = require('../composants/bandeau/react_bandeau_generique');
var Button = ReactB.Button;
var FicheUser = require('../react_fiche_utilisateur').Composant;
var Row = ReactB.Row;
var Col = ReactB.Col;

// MIXINS
var AuthentMixins = require('../mixins/component_access');
var MixinGestMod = require('../mixins/gestion_modif');

// STORE
var storeFicheUser = require('../react_fiche_utilisateur').store

/**
 * Page utilisateur
 * @param attributes: props de Input (react bootstrap) ex: {value:Toto, label: Champ texte:}
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 */
var PageUser = React.createClass({

    mixins: [Reflux.ListenerMixin, MixinGestMod],


    getDefaultProps: function () {
        return {module_url: 'utilisateur'}
    },

    getInitialState: function () {
        return {
            etat: 'liste',
            idUser: 0,
            dataUser: {nom: '', prenom: ''}
        };
    },

    componentDidMount: function () {
        this.listenTo(pageUserStore, this.updateData, this.updateData);
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
        var react;

        switch (this.state.etat) {
            case 'visu':
                react =
                    <div key="rootPageuser">
                        <BandeauGenerique
                            key="bandeauVisu"
                            bandeauType={this.state.etat}
                            module_url="utilisateur"
                            titre={Lang.get('administration.utilisateur.titre')}
                            sousTitre={this.state.dataUser.nom + ' ' + this.state.dataUser.prenom}/>
                        <FicheUser
                            key="ficheUserKey"
                            editable={false}
                            idUser={this.state.idUser}/>
                    </div>;
                break;
            case 'edition':
                react =
                    <div key="rootPageuser">
                        <BandeauGenerique
                            key="bandeauEdition"
                            form_id="form_utilisateur"
                            bandeauType={this.state.etat}
                            module_url="utilisateur"
                            mode={1}
                            titre={Lang.get('administration.utilisateur.titre')}
                            sousTitre={this.state.dataUser.nom + ' ' + this.state.dataUser.prenom}
                        />
                        <FicheUser
                            key="ficheUserKey"
                            editable={true}
                            idUser={this.state.idUser}/>
                    </div>;
                break;
            case 'creation':
                react =
                    <div key="rootPageuser">
                        <BandeauGenerique
                            key="bandeauCreation"
                            form_id="form_utilisateur"
                            bandeauType={this.state.etat}
                            module_url="utilisateur"
                            mode={0}
                            titre={Lang.get('administration.utilisateur.titre')}/>
                        <FicheUser
                            key="ficheUserKey"
                            editable={true}
                            idUser={0}/>
                    </div>;
                break;
            default:
                react =
                    <div key="rootPageuser">
                        <BandeauGenerique
                            key="bandeauListe"
                            bandeauType={this.state.etat}
                            module_url="utilisateur"
                            titre={Lang.get('administration.utilisateur.titre')}/>
                        <Row>
                            <Col md={12}>
                                <DataTableBandeauUser/>
                            </Col>
                        </Row>
                    </div>;
                break;

        }
        return react;
    },

    updateData: function (obj) {
        //console.log('PAGE USER data %o',obj);
        // MAJ data
        this.setState(obj);
    },

    onRetour: function () {
        this.setState({etat: 'liste', idUser: ''});
    }
});
module.exports.Composant = PageUser;


// Creates a DataStore
var pageUserStore = Reflux.createStore({

    // Variables
    stateLocal: {idUser: 0, etat: 'liste'},

    // Initial setup
    init: function () {

        // Register statusUpdate action
        this.listenTo(Actions.utilisateur.display_user, this.modeVisu);
        this.listenTo(Actions.bandeau.creer, this.modeCreation);
        this.listenTo(Actions.bandeau.editer, this.modeEdition);
        this.listenTo(Actions.validation.submit_form, this.sauvegarder);
        this.listenTo(Actions.bandeau.supprimer, this.supprimer);
        this.listenTo(Actions.utilisateur.saveOK, this.loadProfil);
        this.listenTo(Actions.utilisateur.supprOK, this.modeListe);
        this.listenTo(Actions.utilisateur.updateBandeau, this.setNomPrenom)

    },

    loadProfil: function (id) {
        this.trigger({etat: 'edition', idUser: id});
    },

    modeVisu: function (idUser) {
        this.stateLocal = {idUser: idUser, etat: 'visu', dataUser: {nom: '', prenom: ''}};
        this.trigger(this.stateLocal);
    },

    modeCreation: function () {
        //console.log('Mode création');
        this.stateLocal = {idUser: 0, etat: 'creation', dataUser: {nom: '', prenom: ''}};
        //console.log('PAGE USER mode création '+this.idUser);
        this.trigger(this.stateLocal);
    },

    modeEdition: function () {
        //console.log('Mode édition');
        this.stateLocal = {idUser: this.stateLocal.idUser, etat: 'edition'}
        this.trigger(this.stateLocal);
    },

    modeListe: function () {
        this.stateLocal = {idUser: 0, etat: 'liste'}
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
        this.trigger({dataUser: {nom: nom, prenom: prenom}, idUser: id});
    },

    /**
     * Suppression d'un utilisateur
     */
    supprimer: function () {
        // Boite de confirmation

        // Suppr
        this.stateLocal = {idUser: this.stateLocal.idUser, etat: 'suppression'}
        Actions.utilisateur.delete_user(this.stateLocal.idUser);
    }
});
module.exports.store = pageUserStore;
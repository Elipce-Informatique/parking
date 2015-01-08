// Composants REACT
var DataTableBandeauUser = require('../react_data_table_bandeau_utilisateur').Composant;
var BandeauListe = require('../composants/bandeau/react_bandeau_liste');
var BandeauVisu = require('../composants/bandeau/react_bandeau_visu');
var BandeauEdition = require('../composants/bandeau/react_bandeau_edition');
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

    mixins: [Reflux.ListenerMixin,AuthentMixins,MixinGestMod],


    getDefaultProps: function () {
        return {module_url: 'utilisateur'}
    },

    getInitialState: function () {
        return {etat: 'liste',
                idUser: 0,
                dataUser: {nom:'',prenom:''}
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
                    <div key={this.state.etat}>
                        <BandeauVisu titre={Lang.get('administration.utilisateur.titre')} sousTitre={this.state.dataUser.nom+' '+this.state.dataUser.prenom}/>
                        <FicheUser editable={false} idUser={this.state.idUser}/>
                    </div>;
                break;
            case 'edition':
                react =
                    <div key={this.state.etat}>
                        <BandeauEdition mode={1} titre={Lang.get('administration.utilisateur.titre')} sousTitre={this.state.dataUser.nom+' '+this.state.dataUser.prenom}/>
                        <FicheUser editable={true} idUser={this.state.idUser}/>
                    </div>;
                break;
            case 'creation':
                react =
                    <div key={this.state.etat}>
                        <BandeauEdition mode={0} titre={Lang.get('administration.utilisateur.titre')}/>
                        <FicheUser editable={true} idUser={0}/>
                    </div>;
                break;
            default:
                react =
                    <div key={this.state.etat}>
                        <BandeauListe titre={Lang.get('administration.utilisateur.titre')}/>
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

    onRetour: function(){
        this.setState({etat: 'liste', idUser: ''});
    }
});
module.exports.Composant = PageUser;


// Creates a DataStore
var pageUserStore = Reflux.createStore({

    // Variables
    stateLocal : {idUser:0, etat: 'liste'},

    // Initial setup
    init: function () {

        // Register statusUpdate action
        this.listenTo(Actions.utilisateur.display_user, this.modeVisu);
        this.listenTo(Actions.bandeau.creer, this.modeCreation);
        this.listenTo(Actions.bandeau.editer, this.modeEdition);
        this.listenTo(Actions.validation.submit_form, this.sauvegarder);
        this.listenTo(storeFicheUser, this.setDataUser);
        this.listenTo(Actions.bandeau.supprimer, this.supprimer);

    },

    modeVisu: function (idUser) {
        this.stateLocal = {idUser:idUser, etat: 'visu'}
        this.trigger(this.stateLocal);
    },

    modeCreation: function () {
        this.stateLocal = {idUser:0, etat: 'creation'}
        //console.log('PAGE USER mode création '+this.idUser);
        this.trigger(this.stateLocal);
    },

    modeEdition: function () {
        this.stateLocal = {idUser:this.stateLocal.idUser, etat: 'edition'}
        this.trigger(this.stateLocal);
    },

    modeListe: function () {
        this.stateLocal = {idUser:0, etat: 'liste'}
        this.trigger(this.stateLocal);
    },

    /**
     * Indique à la fiche utilisateur de sauvegarder les données
     */
    sauvegarder: function(){
        // La fiche user enregistre l'utilisateur
        Actions.utilisateur.save_user(this.stateLocal.idUser);
    },

    /**
     * Retour de la fiche utilisateur pour mise à jour des infos de la page
     * @param data
     */
    setDataUser: function(data){
        // Variables
        this.stateLocal.dataUser = data;

        // Nouvel utilisateur
        if(this.stateLocal.etat === 'creation'){
            this.stateLocal.idUser = data.id;
            this.stateLocal.etat = 'edition';
        }

        // Suppression utilisateur
        if(this.stateLocal.etat === 'suppression'){
            this.stateLocal.idUser = 0;
            this.stateLocal.etat = 'liste';
        }

        //console.log('PAGE USER trigger %o', this.stateLocal);
        this.trigger(this.stateLocal);
    },

    /**
     * Suppression d'un utilisateur
     */
    supprimer : function(){
        // Boite de confirmation

        // Suppr
        this.stateLocal = {idUser:this.stateLocal.idUser, etat: 'suppression'}
        Actions.utilisateur.delete_user(this.stateLocal.idUser);
    }
});
module.exports.store = pageUserStore;
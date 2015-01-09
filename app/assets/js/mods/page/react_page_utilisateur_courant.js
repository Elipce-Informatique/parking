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
var PageUserCourant = React.createClass({

    mixins: [Reflux.ListenerMixin,AuthentMixins,MixinGestMod],

    getDefaultProps: function () {
        return {module_url: 'utilisateur'}
    },

    getInitialState: function () {
        return {idUser: 0,
            dataUser: {nom:'',prenom:''}
        };
    },

    componentDidMount: function () {
        this.listenTo(pageUserStore, this.updateData, this.updateData);
    },

    render: function () {
        return (
            <Col md={12}>
                <div key={this.state.etat}>
                    <BandeauEdition mode={1} titre={Lang.get('administration.utilisateur.titre')} sousTitre={this.state.dataUser.nom+' '+this.state.dataUser.prenom}/>
                    <FicheUser editable={true} idUser={this.state.idUser}/>
                </div>
            </Col>
        )
    },

    updateData: function (obj) {
        //console.log('PAGE USER data %o',obj);
        // MAJ data
        this.setState(obj);
    },

    onRetour: function(){
        /* Go etat accueil */
        console.log('Retour vers l\'accueil à faire !!');
    }
});
module.exports.Composant = PageUserCourant;


// Creates a DataStore
var pageUserStore = Reflux.createStore({
    idUser: 0,

    // Initial setup
    init: function () {

        // Register statusUpdate action
        this.listenTo(Actions.validation.submit_form, this.sauvegarder);
        this.listenTo(Actions.utilisateur.saveOK, this.loadProfil);
        this.listenTo(Actions.utilisateur.updateBandeau, this.setNomPrenom)
    },

    loadProfil: function(id){
        this.idUser = id;
        this.trigger({idUser:id});
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
    setNomPrenom: function(nom, prenom, id){
        this.stateLocal.idUser = id;
        //console.log('PAGE USER trigger %o', this.stateLocal);
        this.trigger({dataUser:{nom:nom, prenom:prenom}, idUser:id});
    }
});
module.exports.store = pageUserStore;
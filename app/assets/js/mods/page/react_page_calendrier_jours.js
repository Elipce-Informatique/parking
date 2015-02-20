// Composants REACT
var DataTableBandeauJours = require('../react_data_table_bandeau_calendrier_jours').Composant;
var BandeauListe = require('../composants/bandeau/react_bandeau_liste');
var BandeauVisu = require('../composants/bandeau/react_bandeau_visu');
var BandeauEdition = require('../composants/bandeau/react_bandeau_edition');
var BandeauGenerique = require('../composants/bandeau/react_bandeau_generique');
var Button = ReactB.Button;
var Row = ReactB.Row;
var Col = ReactB.Col;

// MIXINS
var AuthentMixins = require('../mixins/component_access');
var MixinGestMod = require('../mixins/gestion_modif');

/**
 * Page calendrier jours
 * @param attributes: props de Input (react bootstrap) ex: {value:Toto, label: Champ texte:}
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 */
var PageCalendrierJours = React.createClass({

    mixins: [Reflux.ListenerMixin,MixinGestMod],


    getDefaultProps: function () {
        return {module_url: 'calendrier_jours'}
    },

    getInitialState: function () {
        return {
            etat: 'liste',
            idJour: 0,
            dataJour: []
        };
    },
    componentDidMount: function () {
        this.listenTo(storeCalendrierJours, this.updateData, this.updateData);
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

        //console.log('STATE %o', this.state);
        switch (this.state.etat) {
            case 'visu':
                react =
                    <div key="root">
                        <BandeauGenerique key="bandeauVisu" bandeauType={this.state.etat} module_url="calendrier_jours" titre={Lang.get('calendrier.jours.titre')} sousTitre={this.state.dataJour.libelle}/>
                        <Row>
                            <Col md={12}>

                            </Col>
                        </Row>
                    </div>;
                break;
            case 'edition':
                react =
                    <div key="root">
                        <BandeauGenerique key="bandeauEdition" bandeauType={this.state.etat} module_url="calendrier_jours" mode={1} titre={Lang.get('calendrier.jours.titre')} sousTitre={this.state.dataJour.libelle}/>
                    </div>;
                break;
            case 'creation':
                react =
                    <div key="root">
                        <BandeauGenerique key="bandeauCreation" bandeauType={this.state.etat} module_url="calendrier_jours" mode={0} titre={Lang.get('calendrier.jours.titre')}/>
                    </div>;
                break;
            default:
                react =
                    <div key="root">
                        <BandeauGenerique key="bandeauListe" bandeauType={this.state.etat} module_url="calendrier_jours" titre={Lang.get('calendrier.jours.titre')}/>
                        <Row>
                            <Col md={12}>
                                <DataTableBandeauJours data={this.state.dataJour}/>
                            </Col>
                        </Row>
                    </div>;
                break;

        }
        return react;
    },

    updateData: function (obj) {
        //console.log('CALLBACK PAGE JOURS data %o',_.cloneDeep(obj));
        // MAJ data
        this.setState(obj);
    },

    onRetour: function(){
        this.setState({etat: 'liste', idJour: ''});
    }
});
module.exports.Composant = PageCalendrierJours;





// Creates a DataStore
var storeCalendrierJours = Reflux.createStore({

    // Variables
    stateLocal : {idJour:0, etat: 'liste', dataJour:[]},

    // Initial setup
    init: function () {


        // Register statusUpdate action
        //this.listenTo(Actions.utilisateur.load_data_all_users, this.getData);

        // Register statusUpdate action
        this.listenTo(Actions.jours.display_jours, this.modeVisu);
        //this.listenTo(Actions.bandeau.creer, this.modeCreation);
        //this.listenTo(Actions.bandeau.editer, this.modeEdition);
        //this.listenTo(Actions.validation.submit_form, this.sauvegarder);
        //this.listenTo(Actions.bandeau.supprimer, this.supprimer);
        //this.listenTo(Actions.utilisateur.saveOK, this.loadProfil);
        //this.listenTo(Actions.utilisateur.supprOK, this.modeListe);
        //this.listenTo(Actions.utilisateur.updateBandeau, this.setNomPrenom)

    },

    getInitialState:function(){
        // AJAX
        $.ajax({
            url: BASE_URI+'calendrier_jours/all',
            dataType: 'json',
            context: this,
            async:false,
            success: function(data) {
                this.stateLocal.dataJour = data;
                //console.log(data);
            },
            error: function(xhr, status, err) {
                console.error(status, err.toString());
                this.stateLocal.dataJour = [];
            }
        });
        return this.stateLocal;
    },

    modeVisu: function (idJour) {
        // Infos
        this.stateLocal.idJour = idJour;
        this.stateLocal.etat = 'visu';
        // AJAX
        $.ajax({
            url: BASE_URI+'calendrier_jours/'+idJour,
            dataType: 'json',
            context: this,
            async:true,
            success: function(data) {
                this.stateLocal.dataJour = data;
                this.trigger(this.stateLocal);
                //console.log(data);
            },
            error: function(xhr, status, err) {
                console.error(status, err.toString());
                this.stateLocal.dataJour = [];
                this.trigger(this.stateLocal);
            }
        });
    },

    modeCreation: function () {
        console.log('Mode création');
        this.stateLocal = {idJour:0, etat: 'creation', dataJour:{nom:'', prenom:''}};
        //console.log('PAGE USER mode création '+this.idJour);
        this.trigger(this.stateLocal);
    },

    modeEdition: function () {
        console.log('Mode édition');
        this.stateLocal = {idJour:this.stateLocal.idJour, etat: 'edition'}
        this.trigger(this.stateLocal);
    },

    modeListe: function () {
        this.stateLocal = {idJour:0, etat: 'liste'}
        this.trigger(this.stateLocal);
    },

    /**
     * Indique à la fiche utilisateur de sauvegarder les données
     */
    sauvegarder: function(){
        // La fiche user enregistre l'utilisateur
        Actions.utilisateur.save_user(this.stateLocal.idJour);
    },

    /**
     * Retour de la fiche utilisateur pour mise à jour des infos de la page
     * @param data
     */
    setNomPrenom: function(nom, prenom, id){
        this.stateLocal.idJour = id;
        //console.log('PAGE USER trigger %o', this.stateLocal);
        this.trigger({dataJour:{nom:nom, prenom:prenom}, idJour:id});
    },

    /**
     * Suppression d'un utilisateur
     */
    supprimer : function(){
        // Boite de confirmation

        // Suppr
        this.stateLocal = {idJour:this.stateLocal.idJour, etat: 'suppression'}
        Actions.utilisateur.delete_user(this.stateLocal.idJour);
    }
});
module.exports.store = storeCalendrierJours;
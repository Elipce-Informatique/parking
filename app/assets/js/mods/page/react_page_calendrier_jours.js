// Composants REACT
var DataTableBandeauJours = require('../react_data_table_bandeau_calendrier_jours').Composant;
var BandeauListe = require('../composants/bandeau/react_bandeau_liste');
var BandeauVisu = require('../composants/bandeau/react_bandeau_visu');
var BandeauEdition = require('../composants/bandeau/react_bandeau_edition');
var BandeauGenerique = require('../composants/bandeau/react_bandeau_generique');
var Button = ReactB.Button;
var Row = ReactB.Row;
var Col = ReactB.Col;
var FormJours = require('../react_form_calendrier_jours').Composant;
//console.log(FormJours);console.log(Col);
// MIXINS
var AuthentMixins = require('../mixins/component_access');
var MixinGestMod = require('../mixins/gestion_modif');
// HELPERS
var pageState = require('../helpers/page_helper').pageState;

/**
 * Page calendrier jours
 * @param attributes: props de Input (react bootstrap) ex: {value:Toto, label: Champ texte:}
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 */
var PageCalendrierJours = React.createClass({

    mixins: [Reflux.ListenerMixin, MixinGestMod],


    getDefaultProps: function () {
        return {module_url: 'calendrier_jours'}
    },

    getInitialState: function () {
        return {
            etat: pageState.liste,
            idJour: 0,
            listeJours: [],// Tableau de jours prédéfinis
            detailJour : {}, // Objet contenant les infos du jour prédéfini en cours de sélection
            validationLibelle : {} // Etat de validation du libelle (vert ou rouge)
        };
    },
    componentDidMount: function () {
        this.listenTo(storeCalendrierJours, this.updateData, this.updateData);
    },

    updateData: function (obj) {
        //console.log('CALLBACK PAGE JOURS data %o',_.cloneDeep(obj));
        // MAJ data
        this.setState(obj);
    },

    onRetour: function () {
        this.setState({etat: pageState.liste, idJour: 0});
        // Maj liste des jours prédéfinis
        Actions.jours.display_jours();
    },

    /**
     * Calcul du render en fonction de l'état d'affichage de la page
     * @returns {*}
     */
    display: function () {
        // Variables
        var react;
        var mode = 1;

        // Affichage en fonction de l'état de la page
        switch (this.state.etat) {
            case pageState.visu:
                react =
                    <div key="root">
                        <BandeauGenerique key="bandeauVisu" bandeauType={this.state.etat} module_url="calendrier_jours" titre={Lang.get('calendrier.jours.titre')} sousTitre={this.state.detailJour.libelle}/>
                        <Row>
                            <Col md={12}>

                            </Col>
                        </Row>
                    </div>;
                break;
            case pageState.creation:
                mode = 0;
            case pageState.edition:
                react =
                    <div key="root">
                        <BandeauGenerique key="bandeauCreation" bandeauType={this.state.etat} module_url="calendrier_jours" mode={mode} titre={Lang.get('calendrier.jours.titre')}/>
                        <FormJours editable={true} detailJour={this.state.detailJour} idJour={this.state.idJour} validationLibelle={this.state.validationLibelle} />
                    </div>;
                break;
            default:
                react =
                    <div key="root">
                        <BandeauGenerique key="bandeauListe" bandeauType={this.state.etat} module_url="calendrier_jours" titre={Lang.get('calendrier.jours.titre')}/>
                        <Row>
                            <Col md={12}>
                                <DataTableBandeauJours data={this.state.listeJours}/>
                            </Col>
                        </Row>
                    </div>;
                break;

        }
        return react;
    },

    render: function () {
        var dynamic = this.display();
        return (
            <Col md={12}>
                {dynamic}
            </Col>
        )
    }
});
module.exports.Composant = PageCalendrierJours;


// Creates a DataStore
var storeCalendrierJours = Reflux.createStore({

    // Variables
    stateLocal: {
        idJour: 0,
        etat: pageState.liste,
        listeJours: [],
        detailJour: {},
        validationLibelle : {}
    },
    libelleInitial : '',

    // Initial setup
    init: function () {
        // Register statusUpdate action
        this.listenTo(Actions.jours.display_jours, this.modeVisu);
        this.listenTo(Actions.bandeau.creer, this.modeCreation);
        // Toutes les actions de bandeau et validation
        this.listenToMany(Actions.bandeau);
        this.listenToMany(Actions.validation);

    },
    /**
     * 1er chargement des données, tous les jours pérédéfinis
     * @returns {*}
     */
    getInitialState: function () {
        // AJAX
        $.ajax({
            url: BASE_URI + 'calendrier_jours/all',
            dataType: 'json',
            context: this,
            async: false,
            success: function (data) {
                this.stateLocal.listeJours = data;
                //console.log(data);
            },
            error: function (xhr, status, err) {
                console.error(status, err.toString());
                this.stateLocal.listeJours = [];
            }
        });
        return this.stateLocal;
    },

    /**
     * Chargement des données d'un jour prédéfini
     * @param idJour: jour_calendrier.id
     */
    modeVisu: function (idJour) {
        // Infos
        this.stateLocal.idJour = idJour;
        this.stateLocal.etat = pageState.visu;
        // AJAX
        $.ajax({
            url: BASE_URI + 'calendrier_jours/' + idJour,
            dataType: 'json',
            context: this,
            async: true,
            success: function (data) {
                // Détail du jour
                this.stateLocal.detailJour = data;
                // Maj page
                this.trigger(this.stateLocal);
                // Maj libelle + id
                this.libelleInitial = data.libelle;
                this.stateLocal.id = idJour;
            },
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }
        });
    },

    /**
     * Création d'un jour prédéfini, formulaire vide
     */
    modeCreation: function () {
        this.stateLocal = {
            idJour: 0,
            etat: pageState.creation,
            detailJour: {
                libelle: '',
                ouverture: '',
                fermeture: '',
                couleur: ''
            }
        };
        this.trigger(this.stateLocal);
    },

    /**
     * Modification du jour prédéfini en cours d'affichage
     */
    modeEdition: function () {
        this.stateLocal = {
            idJour: this.stateLocal.idJour,
            etat: pageState.edition
        };
        this.trigger(this.stateLocal);
    },

    /**
     * Accueil de la page, tableau de jours prédéfinis
     */
    modeListe: function () {
        this.stateLocal = {
            idJour: 0,
            etat: pageState.liste
        };
        this.trigger(this.stateLocal);
    },

    /**
     * onChange de n'importe quel élément du FORM
     * @param e: evt
     */
    onForm_field_changed: function(e){
        var data = {};
        // MAJ du state STORE
        data[e.name] = e.value
        this.stateLocal.detailJour = _.extend(this.stateLocal.detailJour, data);
    },

    /**
     * Vérifications "Métiers" du formulaire sur onBlur de n'imoprte quel champ du FORM
     * @param data : Object {name: "email", value: "yann.pltv@gmail.com", form: DOMNode}
     */
    onForm_field_verif: function(e){
        var data = {};

        // Vérif champ libellé:
        if(e.name == 'libelle'){
            //  booléen en fonction du mode créatioon ou édition
            this.stateLocal.validationLibelle = this.libelleChange(e.value, (this.stateLocal.id !== 0));
            this.trigger(this.stateLocal);
        }

    },

    /**
     * Vérification de l'unicité du libelle en BDD
     * @param value: valeur du champ libelle
     * @param edit: booléen true:mode édition; false: mode création
     * @returns {{}}
     */
    libelleChange: function(value, edit){
        /* Variable de retour */
        var retour = {};

        /* libelle  non vide et non identique au libellé de départ */
        if(value.length>0 && value != this.libelleInitial){

            // AJAX
            $.ajax({
                url:      BASE_URI + 'calendrier_jours/libelle/'+value, /* correspond au module url de la BDD */
                dataType: 'json',
                context:  this,
                async: false,
                success:  function (bExist) {
                    // Le libellé existe déjà
                    if(bExist){
                        retour['data-valid'] = false;
                        retour.bsStyle   = 'error';
                        retour.help = Lang.get('calendrier.jours.libelleExists');
                    }
                },

                error: function (xhr, status, err) {
                    console.error(status, err.toString());
                }
            });
        }
        return retour;
    },

    /**
     * Sauvegarder les données
     * @param e: evt click du bouton
     */
    onSubmit_form: function (e) {
        // Variables
        var url = this.id === 0 ? '' : this.stateLocal.idJour;
        url = BASE_URI + 'calendrier_jours/' + url;
        var method = this.id === 0 ? 'POST' : 'PUT';

        // FormData
        var fData = form_data_helper('form_etat_d_occupation', method);

        // Requête
        $.ajax({
            url: url,
            type: 'POST',
            data: fData,
            processData: false,
            contentType: false,
            dataType: 'json',
            context: this,
            success: function (tab) {
                // Sauvegarde OK
                if (tab.save == true) {
                    Actions.notif.success(Lang.get('global.notif_success'));
                    //console.log('ID: '+tab.id+ ' '+this.state.libelle);
                    // On indique à la page qu'on passe en mode edition
                    Actions.etats_d_occupation.goModif(tab.id, this.state.libelle);
                    // Le store est informé du nouvel ID
                    this.id = tab.id
                }
                // Etat d'occupation existe déjà
                else if (tab.save == false && tab.errorBdd == false) {
                    Actions.notif.error(Lang.get('administration_parking.etats_d_occupation.errorExist'));
                }
                // Erreur SQL
                else {
                    Actions.notif.error(Lang.get('global.notif_erreur'));
                }
            },

            error: function (xhr, status, err) {
                console.error(status, err.toString());
                Actions.notif.error('AJAX : ' + Lang.get('global.notif_erreur'));
            }
        });
    }
});
module.exports.store = storeCalendrierJours;
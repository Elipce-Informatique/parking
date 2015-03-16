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
var form_data_helper  = require('../helpers/form_data_helper');

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
            validationLibelle : {}, // Etat de validation du libelle (vert ou rouge),
            sousTitre : '' // sous titre du bandeau
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
        Actions.jours.display_all_jours();
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
                        <BandeauGenerique key="bandeauVisu" bandeauType={this.state.etat} module_url="calendrier_jours" titre={Lang.get('calendrier.jours.titre')} sousTitre={this.state.sousTitre}/>
                        <FormJours editable={false} detailJour={this.state.detailJour} idJour={this.state.idJour} />
                    </div>;
                break;
            case pageState.creation:
                mode = 0;
                react =
                    <div key="root">
                        <BandeauGenerique key="bandeauCreation" bandeauType={this.state.etat} module_url="calendrier_jours" mode={mode} titre={Lang.get('calendrier.jours.titre')}/>
                        <FormJours editable={true} detailJour={this.state.detailJour} idJour={this.state.idJour} validationLibelle={this.state.validationLibelle} />
                    </div>;
                break;
            case pageState.edition:
                react =
                    <div key="root">
                        <BandeauGenerique key="bandeauCreation" bandeauType={this.state.etat} module_url="calendrier_jours" mode={mode} titre={Lang.get('calendrier.jours.titre')} sousTitre={this.state.sousTitre}/>
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
        validationLibelle : {},
        sousTitre : ''
    },

    // Initial setup
    init: function () {
        // Register statusUpdate action
        this.listenTo(Actions.jours.display_all_jours, this.modeListe);
        this.listenTo(Actions.jours.display_detail_jour, this.modeVisu);
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
     * Accueil de la page, tableau de jours prédéfinis
     */
    modeListe: function () {
        this.stateLocal = {
            idJour: 0,
            etat: pageState.liste
        };

        // AJAX
        $.ajax({
            url: BASE_URI + 'calendrier_jours/all',
            dataType: 'json',
            context: this,
            async: true,
            success: function (data) {
                // Tous les jours prédéfinis en BDD
                this.stateLocal.listeJours = data;
                this.trigger(this.stateLocal);
            },
            error: function (xhr, status, err) {
                console.error(status, err.toString());
                this.stateLocal.listeJours = [];
            }
        });
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
                // Détail du jour + id
                this.stateLocal.detailJour = data;
                // Maj libelle + id
                this.stateLocal.sousTitre = data.libelle;
                // Maj page
                this.trigger(this.stateLocal);
            },
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }
        });
    },

    /**
     * Bouton créer du bandeau: affichage du formulaire vide
     */
    onCreer: function () {
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
     * Bouton editer du bandeau: affichage du formulaire en mode edition (Input au lieu de libellés)
     */
    onEditer: function () {
        // Passage en mode edition
        this.stateLocal = _.extend(this.stateLocal, {
            etat: pageState.edition
        });
        // Update composant React
        this.trigger(this.stateLocal);
    },

    /**
     * onChange de n'importe quel élément du FORM
     * @param e: evt
     */
    onForm_field_changed: function(e){
        console.log('CHANGED '+e.name);
        var data = {};
        // MAJ du state STORE
        data[e.name] = e.value
        this.stateLocal.detailJour = _.extend(this.stateLocal.detailJour, data);
    },

    /**
     * Vérifications "Métiers" du formulaire sur onBlur de n'imoprte quel champ du FORM
     * @param data : Object {name: "email", value: "yann.pltv@gmail.com", form: DOMNode}
     */
    onForm_field_verif: function(data){

        // Le champ BLUR est le champ libelle
        if(data.name == 'libelle'){
            //  Test doublon du libellé
            this.stateLocal.validationLibelle = this.libelleChange(data.value, this.stateLocal.idJour);
            this.trigger(this.stateLocal);
        }

    },

    /**
     * Vérification de l'unicité du libelle en BDD
     * @param value: valeur du champ libelle
     * @param id: ID jour_calendrier ou 0 si mode création
     * @returns {{}}
     */
    libelleChange: function(value, id){
        /* Variable de retour */
        var retour = {};

        /* libelle  non vide et non identique au libellé de départ */
        if(value.length>0 && value != this.stateLocal.sousTitre){

            // URL en fonction du mode création ou edtion
            var finUrl = id === 0 ? '' : '/'+id;
            
            // AJAX
            $.ajax({
                url:      BASE_URI + 'calendrier_jours/libelle/'+value +finUrl,
                dataType: 'json',
                context:  this,
                async: false,
                success:  function (bExist) {
                    // Le libellé existe déjà
                    if(bExist){
                        // Champ libelle erroné
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
        var url = this.stateLocal.idJour === 0 ? '' : this.stateLocal.idJour;
        url = BASE_URI + 'calendrier_jours/' + url;
        var method = this.stateLocal.idJour === 0 ? 'POST' : 'PUT';

        // FormData
        var fData = form_data_helper('form_jours', method);

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
                if (tab.save) {
                    // Notification
                    Actions.notif.success(Lang.get('global.notif_success'));
                    // Mode edition
                    this.stateLocal.etat = pageState.edition;
                    // Mode création Ok
                    if(tab.obj !== null) {
                        // Maj State local + nouveau libellé
                        this.stateLocal.idJour = tab.obj.id;
                        this.stateLocal.detailJour = tab.obj;
                        this.stateLocal.sousTitre = tab.obj.libelle;
                    }
                    // Mode édition
                    else{
                        // Nouveau sous titre
                        this.stateLocal.sousTitre = this.stateLocal.detailJour.libelle;
                    }
                    // Maj state
                    this.trigger(this.stateLocal);
                }
                // Le jour existe déjà
                else if (tab.save == false && tab.errorBdd == false) {
                    // Notification
                    Actions.notif.error(Lang.get('calendrier.jours.libelleExists'));
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
    },

    /**
     * Suppression d'un jour prédéfini
     */
    onSupprimer: function () {
        // Variables
        var url = BASE_URI + 'calendrier_jours/' + this.stateLocal.idJour;
        var method = 'DELETE';

        // Requête
        $.ajax({
            url: url,
            dataType: 'json',
            context: this,
            type: method,
            data: {'_token': $('#_token').val()},
            success: function (bool) {
                // suppression OK
                if(bool) {
                    // Mode liste
                    this.modeListe();
                    // Notification green
                    Actions.notif.success(Lang.get('global.notif_success'));
                }
                // Suppression KO
                else{
                    // Notifictaion erreur
                    Actions.notif.error(Lang.get('global.notif_erreur'));
                }
            },
            error: function (xhr, status, err) {
                console.error(status, err.toString());
                Actions.notif.error(Lang.get('global.notif_erreur'));
            }
        });
    }
});
module.exports.store = storeCalendrierJours;
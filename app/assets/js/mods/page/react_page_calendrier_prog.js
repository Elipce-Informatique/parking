// Composants REACT
var React = require('react');
var Calendrier = require('../react_calendrier').Composant;


var BandeauCalendrierVisu = require('../composants/bandeau/react_bandeau_calendrier_visu');
var BandeauCalendrierEdit = require('../composants/bandeau/react_bandeau_calendrier_edit');
var BandeauVide = require('../composants/bandeau/react_bandeau_vide');
var Button = ReactB.Button;
var Row = ReactB.Row;
var Col = ReactB.Col;
var FormJours = require('../react_form_calendrier_jours').Composant;

// MIXINS
var AuthentMixins = require('../mixins/component_access');
var MixinGestMod = require('../mixins/gestion_modif');

// HELPERS
var pageState = require('../helpers/page_helper').pageState;
var form_data_helper = require('../helpers/form_data_helper');

// LIBS
var moment = require('moment');

/**
 * Page calendrier programmation horaire
 * @param attributes: props de Input (react bootstrap) ex: {value:Toto, label: Champ texte:}
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 */
var PageCalendrierProg = React.createClass({

    mixins: [Reflux.ListenerMixin, MixinGestMod, AuthentMixins],


    getDefaultProps: function () {
        return {module_url: 'calendrier_programmation'}
    },

    getInitialState: function () {
        return {
            etat: pageState.liste,
            idParking: 0,
            jours: [],// Tableau de jours prédéfinis
            parkings: [], // Tableau de parkingsd
            sousTitre: '' // sous titre du bandeau
        };
    },
    componentDidMount: function () {
        this.listenTo(storeCalendrierProg, this.updateData, this.updateData);
    },

    updateData: function (obj) {
        // MAJ data
        this.setState(obj);
    },

    onRetour: function () {
        this.setState({etat: pageState.liste, idParking: 0});
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
                        <BandeauCalendrierVisu
                            key="bandeauVisu"
                            module_url="calendrier_programmation"
                            titre={Lang.get('calendrier.prog_horaire.titre')}
                            sousTitre={this.state.sousTitre}/>
                        <Calendrier
                            editable={true}
                            jours={this.state.jours}/>
                    </div>;
                break;
            case pageState.edition:

                // Jours prédéfinis
                var btnRight = {};
                if (this.state.jours.length > 0) {
                    btnRight = _.map(this.state.jours, function (jour) {
                        return (
                            <Button>
                        {jour.libelle}
                            </Button>
                        );
                    });
                }
                var groupRight = (
                    <ButtonGroup>
                        {btnRight}
                    </ButtonGroup>);

                react =
                    <div key="root">
                        <BandeauCalendrierEdit
                            key="bv"
                            module_url="calendrier_programmation"
                            mode={mode}
                            titre={Lang.get('calendrier.prog_horaire.titre')}
                            sousTitre={Lang.get('global.edit')}
                            jours = {groupRight}/>
                        <Calendrier
                            editable={true}
                            jours={this.state.jours}
                            treeView={this.state.parkings}/>
                    </div>
                break;
            default:
                react =
                    <div key="root">
                        <BandeauVide
                            key="bc"
                            module_url="calendrier_programmation"
                            titre={Lang.get('calendrier.prog_horaire.titre')}/>
                        <Calendrier
                            editable={false}
                            jours={this.state.jours}
                            treeView={this.state.parkings}/>
                    </div>
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
module.exports.Composant = PageCalendrierProg;


// Creates a DataStore
var storeCalendrierProg = Reflux.createStore({

    // Variables
    stateLocal: {
        etat: pageState.liste,
        idParking: 0,
        jours: [],
        parkings: [],
        sousTitre: ''
    },

    // Initial setup
    init: function () {
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
            url: BASE_URI + 'calendrier_programmation/init',
            dataType: 'json',
            context: this,
            async: false,
            success: function (data) {
                this.stateLocal = _.extend(this.stateLocal, data);
                //console.log(data);
            },
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }
        });
        return this.stateLocal;
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
                    if (tab.obj !== null) {
                        // Maj State local + nouveau libellé
                        this.stateLocal.idJour = tab.obj.id;
                        this.stateLocal.detailJour = tab.obj;
                        this.stateLocal.sousTitre = tab.obj.libelle;
                    }
                    // Mode édition
                    else {
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
    }
});
module.exports.store = storeCalendrierProg;
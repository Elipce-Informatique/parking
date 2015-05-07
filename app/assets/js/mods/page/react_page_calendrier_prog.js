// Composants REACT
var React = require('react');
var Calendrier = require('../react_calendrier').Composant;


var BandeauCalendrierVisu = require('../composants/bandeau/react_bandeau_calendrier_visu');
var BandeauCalendrierEdit = require('../composants/bandeau/react_bandeau_calendrier_edit');
var BandeauVide = require('../composants/bandeau/react_bandeau_vide');
var Fields = require('../composants/formulaire/react_form_fields');
var RadioGroup = Fields.RadioGroup;
var Radio = Fields.InputRadioBootstrapEditable;
var Button = ReactB.Button;
var Row = ReactB.Row;
var Col = ReactB.Col;
var DataTableBandeau = require('../composants/tableau/react_data_table_bandeau');
var ColorPicker = require('../composants/react_color').ColorPicker;

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
        return {
            module_url: 'calendrier_programmation',
            datatable: {
                head: [
                    Lang.get('global.parking'),
                    Lang.get('global.description')
                ],
                hide: ['id']
            }
        }
    },

    getInitialState: function () {
        return {
            etat: pageState.liste,
            idParking: 0,
            jours: [],// Tableau de jours prédéfinis
            parkings: [], // Tableau de parkings
            calendrier: {}, // Données du calendrier affiché
            sousTitre: '', // sous titre du bandeau
            currentJour: {} // Jour prédéfini choisi (objet contyenant les infos de la BDD)
        };
    },
    componentDidMount: function () {
        this.listenTo(storeCalendrierProg, this.updateData, this.updateData);
    },

    /**
     * Affiche le calendrier en mode visu lors du clic sur le tableau de parkings²
     * @param e: event
     */
    displayCalendar: function (e) {
        // Ligne du tableau
        var id = $(e.currentTarget).data('id');
        Actions.calendrier.display_calendar(id);
    },

    /**
     * Click sur un bouton jour prédéfini
     * @param e: event
     */
    handleClickJour: function (e) {
        // ID jour
        var id = $(e.currentTarget).find('input').data('id');
        // Recherche de l'objet jour
        var day = _.reduce(this.state.jours, function (result, jour, index) {
            if (jour.id == id) {
                return jour;
            }
            return result;
        }, {}, this);
        this.setState({currentJour: day});
    },

    updateData: function (obj) {
        // MAJ data
        this.setState(obj);
    },

    onRetour: function () {
        this.setState({
            etat: pageState.liste,
            idParking: 0,
            sousTitre: ''
        });
    },
    /**
     * Calcul du render en fonction de l'état d'affichage de la page
     * @returns {*}
     */
    display: function () {
        // Variables
        var react;

        //console.log('render %o', _.cloneDeep(this.state));
        // Affichage en fonction de l'état de la page
        switch (this.state.etat) {

            case pageState.visu:
                react =
                    <div key="root">
                        <BandeauCalendrierVisu
                            key="bandeauVisu"
                            module_url="calendrier_programmation"
                            titre={Lang.get('calendrier.prog_horaire.titre')}
                            sousTitre={this.state.sousTitre}
                            onRetour = {this.onRetour}/>
                        <Calendrier
                            editable={false}
                            data={this.state.calendrier}/>
                    </div>;
                break;
            case pageState.edition:

                // Jours prédéfinis
                var btnRight = {};
                if (this.state.jours.length > 0) {
                    btnRight = _.map(this.state.jours, function (jour, index) {

                        return (
                            <Radio
                                editable={true}
                                attributes={{
                                    'data-id': jour.id
                                }}
                                evts={{
                                    onClick: this.handleClickJour
                                }}
                                key={index}>
                                <div>
                                    <div
                                        style={{
                                            backgroundColor: '#' + jour.couleur,
                                            height: '20px',
                                            width: '20px',
                                            borderRadius: '5px',
                                            float: 'left',
                                            marginRight: '5px'
                                        }}
                                    />
                                {jour.libelle}
                                </div>
                            </Radio>

                        );
                    }, this);
                }
                var groupRight = (
                    <RadioGroup
                        key="rg"
                        gestMod={false}
                        bootstrap={true}
                        attributes={{
                            name: "joursPredef"
                        }}
                        radioGroupAttributes={{}}>
                     {btnRight}
                    </RadioGroup>
                );

                console.log('currentJour %o', this.state.currentJour);
                react =
                    <div key="root">
                        <BandeauCalendrierEdit
                            key="bv"
                            module_url="calendrier_programmation"
                            titre={Lang.get('calendrier.prog_horaire.titre')}
                            sousTitre={this.state.sousTitre}
                            jours = {groupRight}
                            onRetour = {this.onRetour}/>
                        <Calendrier
                            editable={true}
                            data={this.state.calendrier}
                            jour={this.state.currentJour}
                        />
                    </div>
                break;
            default:
                react =
                    <div key="root">
                        <BandeauVide
                            key="bc"
                            module_url="calendrier_programmation"
                            titre={Lang.get('calendrier.prog_horaire.titre')}
                            form_id="calendar"/>
                        <DataTableBandeau
                            id="tab_park"
                            head={this.props.datatable.head}
                            data={this.state.parkings}
                            hide={this.props.datatable.hide}
                            bUnderline={true}
                            evts={{onClick: this.displayCalendar}}/>
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
        calendrier: {},
        sousTitre: ''
    },

    // Initial setup
    init: function () {
        // Actions spécifiques
        this.listenToMany(Actions.calendrier);
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
                // Tri des data parking
                data.parkings = _.map(data.parkings, function (park) {
                    return {
                        id: park.id,
                        libelle: park.libelle,
                        description: park.description
                    }
                });
                // MAJ du state local
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
     * Affiche le calendrier du parking en mode visu
     * @param idParking: ID parking
     */
    onDisplay_calendar: function (idParking) {

        // Data parking
        $.ajax({
            url: BASE_URI + 'calendrier_programmation/' + idParking,
            dataType: 'json',
            context: this,
            async: true,
            success: function (data) {

                // MAJ du state local
                var temp = {
                    calendrier: data.calendriers,
                    etat: pageState.visu,
                    idParking: idParking,
                    sousTitre: data.libelle
                };

                this.stateLocal = _.extend(this.stateLocal, temp);
                // Envoi state
                this.trigger(this.stateLocal);
            },
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }
        });
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
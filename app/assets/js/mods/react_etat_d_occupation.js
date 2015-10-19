/**
 * Created by Pierre on 22/01/2015.
 * Modified bu Vivian on 06/03/2015
 */
var React = require('react/addons');
var async = require('async');
/***********************/
/* Composants Boostrap */
var Row = ReactB.Row;
var Col = ReactB.Col;

// HELPER
var form_data_helper = require('./helpers/form_data_helper');

/*************************/
/* Composants formulaire */
var Field = require('./composants/formulaire/react_form_fields');
var Form = Field.Form;
var InputTextEditable = Field.InputTextEditable;
var react_color = require('./composants/react_color');
var ColorPickerEditable = react_color.ColorPickerEditable;
var InputSelectEditable = Field.InputSelectEditable;
var RadioGroup = Field.RadioGroup;
var InputRadio = Field.InputRadioBootstrapEditable;


var reactEtatDoccupation = React.createClass({

    mixins: [Reflux.ListenerMixin],

    libelleIniDefine: false,

    propTypes: {
        id: React.PropTypes.number.isRequired,
        editable: React.PropTypes.bool
    },

    getDefaultProps: function () {
        return {
            editable: false,
            id: 0
        }
    },

    getInitialState: function () {
        //console.log('getInitialState');
        return {
            id: 0,
            libelle: '',
            validation: {},// Etat de validation du champ libelle: {isValid, style, tooltip}
            couleur: 'FFFFFF',
            is_occupe: '1', // 1 ou 0
            type_place_id: '',
            dataTypesPlace: []  // Données de la liste déroulante data_place_id
        };
    },

    componentWillMount: function () {
        // Liaison au store
        this.listenTo(reactEtatDoccupationStore, this.updateData, this.updateData);

        // Données de l'état d'occupation + les 2 combos
        Actions.etats_d_occupation.show(this.props.id);
    },

    componentWillReceiveProps: function (np, ns) {
        // Données de l'état d'occupation + les 2 combos
        Actions.etats_d_occupation.show(np.id);
    },

    /**
     * Mise à jour des données utilisateur
     * @param {object} data
     */
    updateData: function (data) {
        this.setState(data);

    },

    render: function () {

        // Attributs de base du libellé
        var attrs = {
            value: this.state.libelle,
            label: Lang.get('global.libelle'),
            name: 'libelle',
            wrapperClassName: 'col-md-4',
            labelClassName: 'col-md-1 text-right',
            groupClassName: 'row',
            required: true
        };


        // Etat de validation du champ libelle (rouge ou vert)
        if (_.keys(this.state.validation).length > 0) {
            // Attributs validator
            attrs = _.merge(attrs, {
                bsStyle: this.state.validation.style,
                'data-valid': this.state.validation.isValid,
                help: this.state.validation.tooltip
            });
        }

        // RENDER
        return (
            <Form   ref="form"
                attributes={{
                    className: "form_etat_d_occupation",
                    id: "form_etat_d_occupation"
                }}
            >
                <InputTextEditable
                    attributes={attrs}
                    editable={this.props.editable}
                />
                <InputSelectEditable
                    attributes={{
                        label: Lang.get('administration_parking.etats_d_occupation.type_place'),
                        name: "type_place_id",
                        selectCol: 4,
                        labelCol: 1,
                        required: true
                    }}
                    data         ={this.state.dataTypesPlace}
                    editable     ={this.props.editable}
                    selectedValue={this.state.type_place_id}
                    placeholder  ={Lang.get('global.selection')}
                    labelClass = "text-right"
                    key={Date.now()}
                />
                <ColorPickerEditable
                    label = {Lang.get('administration_parking.etats_d_occupation.tableau.couleur')}
                    attributes={{
                        name: "couleur",
                        required: true,
                        value: this.state.couleur
                    }}
                    editable={this.props.editable}
                    mdLabel={1}
                    mdColor={2}
                    labelClass="text-right"
                />
                <Row>
                    <Col md={1}>
                        <label
                            className="text-right">
                                {Lang.get('administration_parking.etats_d_occupation.etat_place')}
                        </label>
                    </Col>
                    <Col md={4}>
                        <RadioGroup attributes={{name: "is_occupe"}} bootstrap={true}>
                            <InputRadio
                                key={'bt1'}
                                editable={this.props.editable}
                                attributes={{
                                    checked: parseInt(this.state.is_occupe) === 1,
                                    value: '1'
                                }}
                            >
                    {Lang.get('global.oui')}
                            </ InputRadio>
                            <InputRadio
                                key={'bt2'}
                                editable={this.props.editable}
                                attributes={{
                                    checked: parseInt(this.state.is_occupe) === 0,
                                    value: '0'
                                }}
                            >
                    {Lang.get('global.non')}
                            </ InputRadio>
                        </RadioGroup>
                    </Col>
                </Row>

            </Form>
        );
    }
});
module.exports = reactEtatDoccupation;

// Creates a DataStore
var reactEtatDoccupationStore = Reflux.createStore({

    state: {},
    libelleInitial: '',// En mode édition, libellé en BDD
    id: 0,

    // Initial setup
    init: function () {
        this.listenToMany(Actions.etats_d_occupation);
        this.listenToMany(Actions.bandeau);
        this.listenToMany(Actions.validation);
    },

    onCreer: function () {
        this.onShow(0);
    },
    /**
     * Affichage du détail de l'état d'occupation
     * @param idEtat: ID etat_occupation
     */
    onShow: function (idEtat) {
        // ID dans le STORE
        this.id = idEtat;
        //console.log('id: '+idEtat);

        // AJAX
        $.ajax({
            url: BASE_URI + 'etats_d_occupation/' + idEtat,
            dataType: 'json',
            context: this,
            async: false,
            success: function (data) {

                // Combo type place : transformation en {label:'', value:''}
                data.dataTypesPlace = _.map(data.dataTypesPlace, function (type) {
                    return {
                        label: type.libelle,
                        value: type.id.toString() // Chaine de caractères pour le react-select
                    }
                });
                //
                data.type_place_id = data.type_place_id.toString(); // Chaine de caractères pour le react-select
                // MAJ state STORE
                this.state = _.extend(this.state, data);
                //console.log('type modif %o', this.state.dataTypesPlace);
                // Libellé initial
                this.libelleInitial = data.libelle;
                // MAJ libellé bandeau
                //Actions.etats_d_occupation.setLibelle(data.libelle);// ARTUNG
                // Envoi data
                this.trigger(data);
            },
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }
        });

    },

    /**
     * onChange de n'importe quel élément du FORM
     * @param e: evt
     */
    onForm_field_changed: function (e) {
        var data = {};
        // MAJ du state STORE
        data[e.name] = e.value
        this.state = _.extend(this.state, data);

        // Si on est sur une combo on trigger pour la value
        if(e.name == 'type_place_id'){
            this.trigger(this.state);
        }
    },

    /**
     * Vérifications "Métiers" du formulaire sur onBlur de n'imoprte quel champ du FORM
     * @param data : Object {name: "email", value: "yann.pltv@gmail.com", form: DOMNode}
     */
    onForm_field_verif: function (e) {
        var data = {};

        // Vérif champ libellé:
        if (e.name == 'libelle') {
            //  booléen en fonction du mode créatioon ou édition
            this.state.validation = this.libelleChange(e.value, (this.id !== 0));
            this.trigger(this.state);
        }

    },

    /**
     * Vérification de l'unicité du libelle en BDD
     * @param value: valeur du champ libelle
     * @param edit: booléen true:mode édition; false: mode création
     * @returns {{}}
     */
    libelleChange: function (value, edit) {
        /* Variable de retour */
        var retour = {};

        /* libelle  non vide et non identique au libellé de départ */
        if (value.length > 0 && value != this.libelleInitial) {

            // AJAX
            $.ajax({
                url: BASE_URI + 'etats_d_occupation/libelle/' + value, /* correspond au module url de la BDD */
                dataType: 'json',
                context: this,
                async: false,
                success: function (bool) {
                    // Le libellé existe déjà
                    if (!bool) {
                        retour.isValid = false;
                        retour.style = 'error';
                        retour.tooltip = Lang.get('administration_parking.etats_d_occupation.libelleExist');
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
     * Sauvegarder
     * @param e: evt click du bouton
     */
    onSubmit_form: function (e) {
        // Variables
        var url = this.id === 0 ? '' : this.id;
        url = BASE_URI + 'etats_d_occupation/' + url;
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
    },
    onVerify_form_save: function(){

    }
});
/**
 * Created by Pierre on 22/01/2015.
 */

/***********************/
/* Composants Boostrap */
var Row = ReactB.Row;
var Col = ReactB.Col;

var form_data_helper  = require('./helpers/form_data_helper');

/*************************/
/* Composants formulaire */
var Field               = require('./composants/formulaire/react_form_fields');
var Form                = Field.Form;
var InputTextEditable   = Field.InputTextEditable;
var react_color         = require('./composants/react_color');
var ColorPickerEditable = react_color.ColorPickerEditable;
var InputSelectEditable         = Field.InputSelectEditable;

/**********/
/* Mixinx */
var FormValidationMixin = require('./mixins/form_validation');

var reactEtatDoccupation = React.createClass({

    mixins: [Reflux.ListenerMixin, FormValidationMixin],

    libelleIniDefine:false,

    propTypes: {
        id:       React.PropTypes.number.isRequired,
        editable: React.PropTypes.bool
    },

    getDefaultProps: function () {
        return {
            editable: false,
            id: 0,
            data: {}
        }
    },

    getInitialState: function () {
        //console.log('getInitialState');
        return  {libelle:        '',
                 couleur:        'FFFFFF',
                 etat_place_id:  '',
                 type_place_id:  '',
                 dataEtatsPlace: [],
                 dataTypesPlace: []
                };
    },

    componentWillMount: function () {
        //console.log('componentWillMount');
        // Liaison au store
        this.listenTo(reactEtatDoccupationStore, this.updateData, this.updateData);

        // Données de l'état d'occupation
        Actions.etats_d_occupation.show(this.props.id);

        // Données des combos
        Actions.etats_d_occupation.getTypePlace(this.props.idUser==0);
        Actions.etats_d_occupation.getEtatPlace(this.props.modeCompte);
    },

    componentDidUpdate: function(pp, ps) {
        jscolor.init();
    },

    componentDidMount: function(){
        jscolor.init();
        Actions.etats_d_occupation.setId(this.props.id);
        Actions.etats_d_occupation.changeCouleur(this.state.couleur);

    },

    onBlurCouleur: function(e) {
        console.log('onBlurCouleur');
        Actions.etats_d_occupation.changeCouleur(e.target.value);
    },

    etatPlaceChange: function(e, data){
        Actions.etats_d_occupation.changeEtatPlace((data[0] !== undefined?data[0]['value']:''));
    },

    typePlaceChange: function(e, data){
        Actions.etats_d_occupation.changeTypePlace((data[0] !== undefined?data[0]['value']:''));
    },

    render: function () {
        //var stateLocal = _.cloneDeep(this.state);
        //console.log('FORM ETAT OCCUP Render %o', stateLocal);

        var fAttrs   = {className:"form_etat_d_occupation", id:"form_etat_d_occupation"};

        var etatPlaceSelected = [];
        if(this.state.etat_place_id != '')
            etatPlaceSelected = [this.state.etat_place_id.toString()];

        var typePlaceSelected = [];
        if(this.state.type_place_id != '')
            typePlaceSelected = [this.state.type_place_id.toString()];

        // Test si besoin de forcer le style du libelle
        attrs = {value:           this.state.libelle,
            label:           Lang.get('global.libelle'),
            name:            'libelle',
            wrapperClassName:'col-md-4',
            labelClassName:  'col-md-2',
            groupClassName:  'row',
            required:true};
        if(this.state.dataLibelle != undefined ){
            var attrs2  = {bsStyle:this.state.dataLibelle.style, 'data-valid':this.state.dataLibelle.isValid, help:this.state.dataLibelle.tooltip};
            attrs       = _.merge(attrs, attrs2);
        }

        /* Défini le libelleInitial */
        if(this.id != 0 && this.libelleIniDefine == false && this.state.libelle != ''){
            this.libelleIniDefine = true;
            Actions.etats_d_occupation.setLibelleInitial(this.state.libelle);
        }

        return (<Form ref="form" attributes={fAttrs}>
                    <Row>
                        <Col md={12}>
                            <InputTextEditable attributes={attrs}
                                               editable={this.props.editable}
                            />
                        </Col>
                        <Col md={12}>
                            <ColorPickerEditable
                                label = {Lang.get('administration_parking.etats_d_occupation.tableau.couleur')}
                                attributes={{
                                    name: "couleur",
                                    required: true,
                                    value: this.state.couleur
                                }}
                                editable={this.props.editable}
                                mdLabel={2}
                                mdColor={2}
                                evts={{onBlur:this.onBlurCouleur}}
                            />
                        </Col>
                        <Col md={12}>
                            <InputSelectEditable evts      ={{onChange:this.etatPlaceChange}}
                                                 attributes={{label:    Lang.get('administration_parking.etats_d_occupation.etat_place'),
                                                              name:     "data_etat_place",
                                                              selectCol:4,
                                                              labelCol: 2,
                                                              required:true}}
                                                 data         ={this.state.dataEtatsPlace}
                                                 editable     ={this.props.editable}
                                                 selectedValue={etatPlaceSelected}
                                                 placeholder  ={Lang.get('global.selection')}/>
                        </Col>
                        <Col md={12}>
                            <InputSelectEditable evts      ={{onChange:this.typePlaceChange}}
                                                 attributes={{label:    Lang.get('administration_parking.etats_d_occupation.type_place'),
                                                              name:     "data_etat_place",
                                                              selectCol:4,
                                                              labelCol: 2,
                                                              required:true}}
                                                 data         ={this.state.dataTypesPlace}
                                                 editable     ={this.props.editable}
                                                 selectedValue={typePlaceSelected}
                                                 placeholder  ={Lang.get('global.selection')}/>
                        </Col>
                    </Row>
                </Form>
        );
    },

    /**
     * Mise à jour des données utilisateur
     * @param {object} data
     */
    updateData: function (data) {
        try {
            this.setState(data);
        }
        catch (e) {

        }
    }
});
module.exports = reactEtatDoccupation;

// Creates a DataStore
var reactEtatDoccupationStore = Reflux.createStore({

    state:{},
    libelleInitial:'',
    id:0,

    // Initial setup
    init: function () {
        this.listenToMany(Actions.etats_d_occupation);
        this.listenToMany(Actions.bandeau);
        this.listenToMany(Actions.validation);
    },

    onSetId: function(newId){
        this.id = newId;
    },

    onSetLibelleInitial: function(libelleIni){
        //console.log('onSetLibelleInitial : %o', libelleIni);
        this.libelleInitial = libelleIni;
    },

    onShow: function(idEtat){
        var that = this;

        // AJAX
        $.ajax({
            url: BASE_URI + 'etats_d_occupation/' + idEtat, /* correspond au module url de la BDD */
            dataType: 'json',
            context: that,
            async: false,
            success: function (data) {
                that.nameEtatDoccupation = data.libelle;
                that.trigger(data);
                Actions.etats_d_occupation.setLibelle(data.libelle);
            },
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }
        });
    },

    onChangeCouleur: function(value){
        this.state = _.extend(this.state, {couleur:value});
    },

    onForm_field_changed: function(e){
        var data = {};

        // Mise à jour du state
        if(e.name == 'libelle')
            data.libelle = e.value;
        else if(e.name == 'etat_place')
            data.etat_place_id = e.value;
        else if(e.name == 'type_place')
            data.type_place_id = e.value;

        this.state = _.extend(this.state, data);

        this.trigger(this.state);
    },

    onChangeEtatPlace: function(idEtatPlace){
        this.state = _.extend(this.state, {etat_place_id:idEtatPlace});
    },

    onChangeTypePlace: function(idTypePlace){
        this.state = _.extend(this.state, {type_place_id:idTypePlace});
    },

    /**
     * Vérifications "Métiers" du formulaire
     * @param data : Object {name: "email", value: "yann.pltv@gmail.com", form: DOMNode}
     */
    onForm_field_verif: function(e){
        var data = {};

        // VÉFIR ADRESSE MAIL:
        if(e.name == 'libelle'){
            if(this.modeCreate)
                data = this.libelleCreateChange(e.value);
            else
                data = this.libelleEditChange(e.value);
        }

        this.state = _.extend(this.state, data);
        this.trigger(this.state);
    },

    /**
     * Vérification de l'unicité du libelle en BDD
     * @param value
     * @param edit
     * @returns {{}}
     */
    libelleChange: function(value, edit){
        /* Varaible de retour */
        var retour = {};
        retour.dataLibelle = {};

        //console.log('this.libelleInitial : %o, value : %o', this.libelleInitial, value);
        /* Est-ce que l'email est supérieur à 4 caractère (x@x.xx)? */
        if(value.length>=1 && value != this.libelleInitial){

            // AJAX
            $.ajax({
                url:      BASE_URI + 'etats_d_occupation/libelle/'+value, /* correspond au module url de la BDD */
                dataType: 'json',
                context:  this,
                async: false,
                success:  function (good) {
                    /* En vert */
                    if(good.good == false){
                        retour.dataLibelle.isValid = false;
                        retour.dataLibelle.style   = 'error';
                        retour.dataLibelle.tooltip = Lang.get('administration_parking.etats_d_occupation.libelleExist');
                    }
                },

                error: function (xhr, status, err) {
                    console.error(status, err.toString());
                }
            });
        }
        return retour;
    },

    libelleEditChange: function (value){
        return this.libelleChange(value, true);
    },

    libelleCreateChange: function (value){
        return this.libelleChange(value, false);
    },


    /**
     * Appellé quand on clique sur le bouton sauvegarder
     * @param idEtat
     */
    onSubmit_form: function (e) {
        //console.log('this.state : %o', this.state);

        //console.log('FICHE USER SAVE '+idUser);
        // Variables
        var url = this.id === 0 ? '' : this.id;

        url = BASE_URI + 'etats_d_occupation/' + url;

        //console.log('SAVE '+idUser+' URL '+url);
        var method = this.id === 0 ? 'POST' : 'PUT';

        // FormData
        var fData = form_data_helper('form_etat_d_occupation', method);


        fData.append('type_place_id', this.state.type_place_id);
        fData.append('etat_place_id', this.state.type_place_id);
        fData.append('couleur',       this.state.couleur);
        fData.append('id',            this.id);


        // Requête
        $.ajax({
            url: url,
            type: 'POST',
            data: fData,
            processData: false,
            contentType: false,
            dataType:'json',
            context: this,
            success: function (tab) {
                if(tab.save == true) {
                    Actions.notif.success(Lang.get('global.notif_success'));
                    Actions.etats_d_occupation.goModif(tab.id, this.state.libelle);
                }
                /* Etat déjà existant */
                else if(tab.save == false && tab.errorBdd == false){
                    Actions.notif.error(Lang.get('administration_parking.etats_d_occupation.errorExist'));
                }
                else
                    Actions.notif.error(Lang.get('global.notif_erreur'));
            },

            error: function (xhr, status, err) {
                console.error(status, err.toString());
                Actions.notif.error('AJAX : '+Lang.get('global.notif_erreur'));
            }
        });
    },

    onSupprimer: function (e) {
        // Variables
        var url = BASE_URI + 'etats_d_occupation/' + this.id;
        var method = 'DELETE';

        // Requête
        $.ajax({
            url: url,
            dataType: 'json',
            context: this,
            type: method,
            data: {'_token': $('#_token').val()},
            success: function (tab) {
                Actions.utilisateur.supprOK();
            },
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }
        });
    }
});
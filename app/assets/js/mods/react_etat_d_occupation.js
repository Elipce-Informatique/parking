/**
 * Created by Pierre on 22/01/2015.
 */

/***********************/
/* Composants Boostrap */
var Row = ReactB.Row;
var Col = ReactB.Col;

/*************************/
/* Composants formulaire */
var Field               = require('./composants/formulaire/react_form_fields');
var Form                = Field.Form;
var InputTextEditable   = Field.InputTextEditable;
var react_color         = require('./composants/react_color');
var ColorPickerEditable = react_color.ColorPickerEditable;

/**********/
/* Mixinx */
var FormValidationMixin = require('./mixins/form_validation');

var reactEtatDoccupation = React.createClass({

    mixins: [Reflux.ListenerMixin, FormValidationMixin],

    propTypes: {
        id:       React.PropTypes.number.isRequired,
        editable: React.PropTypes.bool
    },

    getDefaultProps: function () {
        return {
            editable:false,
            id:0,
            data: {}
        }
    },

    getInitialState: function () {
        console.log('getInitialState');
        return  {libelle:       '',
                 couleur:       '#FFFFFF',
                 etatPlaceId:   '',
                 etatCapteurId: '',
                 dataEtatPlace: [],
                 dataTypePlace: []
                };
    },

    componentWillMount: function () {
        console.log('componentWillMount');
        // Liaison au store
        this.listenTo(reactEtatDoccupationStore, this.updateData, this.updateData);

        // Données de l'état d'occupation
        Actions.etats_d_occupation.show(this.props.id);

        // Données des combos
        Actions.etats_d_occupation.getTypePlace(this.props.idUser==0);
        Actions.etats_d_occupation.getEtatPlace(this.props.modeCompte);

        // Sauvegarde du libelle initiale
        libelleInitial = this.state.libelle;
    },

    componentDidUpdate: function(pp, ps) {
        jscolor.init();
    },

    componentDidMount: function(){
        jscolor.init();
    },

    onBlurCouleur: function(e) {
        console.log('onBlurCouleur');
        Actions.etats_d_occupation.changeCouleur(e.target.value);
    },

    render: function () {
        console.log('Render avec state : %o', this.state);
        var fAttrs   = {className:"form_etat_d_occupation", id:"form_etat_d_occupation"};

        return (<Form ref="form" attributes={fAttrs}>
                    <Row>
                        <Col md={12}>
                            <InputTextEditable attributes={{label:Lang.get('global.libelle'), name:'libelle', value:this.state.libelle, wrapperClassName:'col-md-4',labelClassName:'col-md-2',groupClassName:'row'}} editable={this.props.editable} />
                        </Col>
                        <Col md={12}>
                            <ColorPickerEditable evts={{onBlur:this.onBlurCouleur}} attributes={{value:this.state.couleur, label:Lang.get('administration_parking.etats_d_occupation.tableau.couleur'), wrapperClassName:'col-md-4',labelClassName:'col-md-2',groupClassName:'row'}} editable={this.props.editable} />
                        </Col>
                        <Col md={12}>
                            Combo état place
                        </Col>
                        <Col md={12}>
                            Combo type place
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

    // Initial setup
    init: function () {
        // Register statusUpdate action
        this.listenTo(Actions.etats_d_occupation.changeCouleur, this.changeCouleur);
        this.listenTo(Actions.validation.form_field_changed,    this.formChange);
        this.listenTo(Actions.etats_d_occupation.show,          this.loadInfos);
    },

    loadInfos: function(idEtat){
        var that = this;

        // AJAX
        $.ajax({
            url: BASE_URI + 'etats_d_occupation/' + idEtat, /* correspond au module url de la BDD */
            dataType: 'json',
            context: that,
            async: false,
            success: function (data) {
                console.log('data : %o', data);
                that.nameEtatDoccupation = data.libelle;
                that.trigger(data[0]);
            },
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }
        });
    },

    changeCouleur: function(value){
        console.log('store changeCouleur');
        this.state = _.extend(this.state, {couleur:value});
    },

    set_initial_state: function(data){
        this.state = data;
        this.libelleInitial = data['libelle'];
        console.log('this.emailInitial : %o', this.emailInitial);
    },

    setEtatCreateEdit: function(modeCreate_P){
        this.modeCreate = modeCreate_P;
    },

    formChange: function(e){
        var data = {};

        console.log('e.name : %o', e.name);
        
        // Mise à jour du state
        if(e.name == 'libelle')
            data.libelle = e.value;
        else if(e.name == 'etat_place')
            data.etat_place_id = e.value;
        else if(e.name == 'type_place')
            data.type_place_id = e.value;

        this.state = _.extend(this.state, data);

        console.log('trigger avec : %o', this.state);
        this.trigger(this.state);
    },

    /**
     * Vérifications "Métiers" du formulaire
     * @param data : Object {name: "email", value: "yann.pltv@gmail.com", form: DOMNode}
     */
    formVerif: function(e){
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
     * Appellé quand on clique sur le bouton sauvegarder
     * @param idUser
     */
    sauvegarder: function (idEtat) {
        //console.log('FICHE USER SAVE '+idUser);
        // Variables
        var url = idEtat === 0 ? '' : idEtat;

        url = BASE_URI + 'etats_d_occupation/' + url;

        //console.log('SAVE '+idUser+' URL '+url);
        var method = idUser === 0 ? 'POST' : 'PUT';

        // FormData
        var fData = form_data_helper('form_utilisateur', method);

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
                    //Actions.etats_d_occupation.saveOK(tab.idUser*1);
                    //Actions.etats_d_occupation.load_user_info(tab.idUser*1);
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

    supprimer: function (idEtat) {
        // Variables
        var url = BASE_URI + 'etats_d_occupation/' + idEtat;
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
                this.trigger(this.dataUser);
            }
        });
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
    }
});
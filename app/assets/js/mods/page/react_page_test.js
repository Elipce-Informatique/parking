
/***********************/
/* Composants Boostrap */
var Row = ReactB.Row;
var Col = ReactB.Col;
var Button = ReactB.Button;

/*********************************************/
/* Composant input pour le libelle du profil */
var Field                 = require('../composants/formulaire/react_form_fields');
var InputTextEditable     = Field.InputTextEditable;
var InputMailEditable     = Field.InputMailEditable;
var InputPasswordEditable = Field.InputPasswordEditable;
var InputRadioEditable    = Field.InputRadioEditable;
var ButtonGroup                 = ReactB.ButtonGroup;
var InputRadioBootstrapEditable = Field.InputRadioBootstrapEditable;
var InputCheckboxEditable       = Field.InputCheckboxEditable;
var InputDateEditable           = Field.InputDateEditable;
var InputSelect                 = Field.InputSelect;
var InputSelectEditable         = Field.InputSelectEditable;
var InputNumberEditable         = Field.InputNumberEditable;
var InputTelEditable            = Field.InputTelEditable;
var react_photo                 = require('../composants/react_photo');
var ImageEditable               = react_photo.PhotoEditable;
var react_color                 = require('../composants/react_color');
var ColorPicker                 = react_color.ColorPicker;
var ColorPickerEditable         = react_color.ColorPickerEditable;
//var DateTimePicker              = require('react-bootstrap-datetimepicker');
var InputDate                   =    Field.InputDate;
var InputDateEditable           =    Field.InputDateEditable;
var InputTime                   =    Field.InputTime;
var InputTimeEditable           =    Field.InputTimeEditable;
var Form                        = Field.Form;

/*****************************************************
/* MIXINS */
var MixinGestMod = require('../mixins/gestion_modif');
var FormValidationMixin = require('../mixins/form_validation')

/*****************************************************
 /* HELPERS */
var form_data_helper  = require('../helpers/form_data_helper');


/**************************************************
 * PAGE REACT
 */
var ReactPageTest               = React.createClass({

    mixins: [MixinGestMod, Reflux.ListenerMixin, FormValidationMixin],
    /**
     * État initial des données du composant
     * @returns les données de l'état initial
     */
    getInitialState: function () {

        return {};
    },

    /**
     * Avant le premier Render()
     */
    componentWillMount: function () {
        this.listenTo(storeTest,this.update);
    },

    /**
     * Test si le composant doit être réaffiché avec les nouvelles données
     * @param nextProps : Nouvelles propriétés
     * @param nextState : Nouvel état
     * @returns {boolean} : true ou false selon si le composant doit être mis à jour
     */
    shouldComponentUpdate: function (nextProps, nextState) {
        return true;
    },

    update: function(data){
      this.setState(data);
    },
    /**
     * Méthode appellée pour construire le composant.
     * A chaque fois que son contenu est mis à jour.
     * @returns {XML}
     */
    render: function () {
        var editable = true;
        var indice = 0;

        /*********************/
        /* Paramètres Select */
        var options = [
            { value: '1abricot', label: 'Abricot' },
            { value: '2fambroise', label: 'Framboise' },
            { value: '3pomme', label: 'Pomme' },
            { value: '4poire', label: 'Poire' },
            { value: '5fraise', label: 'Fraise' }
        ];

        function selectChange(value, aData){

            _.each(aData, function(val, key){
                indice++;
            });
            //console.log('ChangeSelect '+indice);
        }

        function clickImage(evt){
            var copie = _.clone(evt);
        }
        /* FIN : Paramètres Select */
        /***************************/
        return(
        <Form attributes={{id:"form_test"}}>
            <Row id="Champ_texte">
                <Col md={12}>
                    <InputTextEditable
                        attributes={
                            {   label:'InputTextEditable',
                                name:"InputTextEditable",
                                value:'Vivian',
                                wrapperClassName:'col-md-4',
                                labelClassName:'col-md-2',
                                groupClassName:'row'}}
                        editable={editable} />
                </Col>
            </Row>

            <Row id="Champ_texte_area">
                <Col md={12}>
                    <InputTextEditable area={true} attributes={{label:'InputTextEditableArea', name:"InputTextEditableArea", value:'InputTextEditableArea', wrapperClassName:'col-md-4',labelClassName:'col-md-2',groupClassName:'row'}} editable={editable} />
                </Col>
            </Row>

            <Row id="Champ_mail">
                <Col md={12}>
                    <InputMailEditable attributes={{label:'InputMailEditable', name:"InputMailEditable", value:'InputMailEditable@elipce.com', wrapperClassName:'col-md-4',labelClassName:'col-md-2',groupClassName:'row'}} editable={editable} />
                </Col>
            </Row>

            <Row id="Champ_password">
                <Col md={12}>
                    <InputPasswordEditable attributes={{label:'InputPasswordEditable', name:"InputPasswordEditable", value:"", wrapperClassName:'col-md-4',labelClassName:'col-md-2',groupClassName:'row'}} editable={editable} />
                </Col>
            </Row>

            <Row id="InputImageEditable">
                <Col md={12}>
                    <ImageEditable src='./app/assets/images/cross.gif' evts={{onClick:clickImage}} name="InputImageEditable" attributes={{name:"InputImageEditable", imgCol:4,labelCol:2}} editable={editable} />
                </Col>
            </Row>
            <Row id="InputColor">
                <Col md={12}>
                    <ColorPicker color="AAAAAA" label="Couleur" mdColor={4} mdLabel={2} />
                </Col>
            </Row>
            <Row id="InputColorEditable">
                <Col md={12}>
                    <ColorPickerEditable
                        evts={{onBlur:function(e){console.log('blur color '+$(e.currentTarget).val());}}}
                        label="Couleur modifiable"
                        mdColor={4}
                        mdLabel={2}
                        labelClass="text-right"
                        gestMod={true}
                        attributes={{name:"color", required:false, value:'E2156B'}}
                        editable={editable} />
                </Col>
            </Row>

            <InputSelectEditable
                multi={false}
                evts={{onChange:selectChange}}
                attributes={{label:'Mes fruits', name:"Select", selectCol:4,labelCol:2, required:true}}
                data={options}
                editable={editable}
                placeholder={'PlaceHolder...'}
                labelClass='text-right'
                selectedValue={["5fraise","3pomme"]}
            />

            <Button
                bsStyle="success"
                onClick={function(){
                            var fData = form_data_helper('form_test', 'POST');
                            //console.log('DATA: %o',fData);
                            var f = $('#form_test').serializeArray();
                            //console.log('DATA %o',f);
                            // Vérif champ erronés
                            Actions.validation.verify_form_save();
                        }}
            >Valider</Button>

            <Row id="Input number">
                <Col md={12}>
                    <InputNumberEditable min={-10} max={10} step={0.01} attributes={{label:'Input number', name:"InputNumber", value:5, wrapperClassName:'col-md-4',labelClassName:'col-md-2',groupClassName:'row'}} editable={editable} />
                </Col>
            </Row>

            <Row id="Input tel">
                <Col md={12}>
                    <InputTelEditable attributes={{label:'Input tel', name:"InputTel", value:'0475757575', wrapperClassName:'col-md-4',labelClassName:'col-md-2',groupClassName:'row'}} editable={editable} />
                </Col>
            </Row>

            <Row id="Champ_radioBoostrap">
                <Col md={2}>
                    <label>Radio Boostrap</label>
                </Col>
                <Col md={4}>
                    <ButtonGroup data-toggle="buttons" bsSize="xsmall">
                        <InputRadioBootstrapEditable key={'bt1'} editable={editable} attributes={{className:'active'}}>Btn 1</ InputRadioBootstrapEditable>
                        <InputRadioBootstrapEditable key={'bt2'} editable={editable}>Btn 2</ InputRadioBootstrapEditable>
                    </ButtonGroup>
                </Col>
            </Row>

            <Row id="Champ_radio">
                    <Col md={2}>
                    </Col>
                    <Col md={10}>
                        <InputRadioEditable key={'bt1'} editable={editable} attributes={{label:'InputRadioEditable 1', checked:true, name:"InputRadioEditable[]", wrapperClassName:'col-md-4',labelClassName:'col-md-2',groupClassName:'row'}} />
                    </Col>
                </Row>
                <Row >
                    <Col md={2}>
                    </Col>
                    <Col md={10}>
                        <InputRadioEditable key={'bt2'} editable={editable} attributes={{label:'InputRadioEditable 2', name:"InputRadioEditable[]", wrapperClassName:'col-md-4',labelClassName:'col-md-2',groupClassName:'row'}} />
                    </Col>
            </Row>

            <Row id="Champ_checkBox">
                <Col md={2}>
                </Col>
                <Col md={10}>
                    <InputCheckboxEditable key={'bt1'} attributes={{label:'InputCheckboxEditable', name:"InputCheckboxEditable", wrapperClassName:'col-md-4',labelClassName:'col-md-2',groupClassName:'row'}} editable={editable} />
                </Col>
            </Row>

            <Row id="Champ_datetime">
                    <Col md={12}>
                    <InputDate attributes={{label:'Champ date natif',value:'2015-02-23',required:true, wrapperClassName:'col-md-4',labelClassName:'col-md-2',groupClassName:'row'}} />
                </Col>
            </Row>

            <Row id="Champ_datetime_editable">
                <Col md={12}>
                    <InputDateEditable attributes={{label:'Champ date editable',value:'2015-02-23',required:true, wrapperClassName:'col-md-4',labelClassName:'col-md-2',groupClassName:'row'}} editable={editable} />
                </Col>
            </Row>

            <Row id="Champ_time_editable">
                <Col md={12}>
                    <InputTimeEditable attributes={{label:'Champ time editable',value:'10:00:25', wrapperClassName:'col-md-4',labelClassName:'col-md-2',groupClassName:'row'}} editable={editable} />
                </Col>
            </Row>

        </Form>)
    },

    /**
     * Retour du store "pageProfilStore", met à jour le state de la page
     * @param data
     */
    updateState: function(data) {
        // MAJ data automatique, lifecycle "UPDATE"
        this.setState(data);
    },

    onRetour: function(){

    }
});
module.exports = ReactPageTest;

// Creates a DataStore
var storeTest = Reflux.createStore({

    // Initial setup
    init: function () {
        this.listenToMany(Actions.validation);
    },

    /**
     * onChange de n'importe quel élément du FORM
     * @param e: evt
     */
    onForm_field_changed: function (e) {
        console.log('CHANGED');
    },

    /**
     * Vérifications "Métiers" du formulaire sur onBlur de n'imoprte quel champ du FORM
     */
    onForm_field_verif: function (e) {
        console.log('VERIF');

    }
});
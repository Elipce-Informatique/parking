
/***********************/
/* Composants Boostrap */
var Row = ReactB.Row;
var Col = ReactB.Col;

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
var InputSelectEditable         = Field.InputSelectEditable;
var InputNumberEditable         = Field.InputNumberEditable;
var InputTelEditable            = Field.InputTelEditable;
var react_photo                 = require('../composants/react_photo');
var ImageEditable               = react_photo.PhotoEditable;
var react_color                 = require('../composants/react_color');
var ColorPicker                 = react_color.ColorPicker;
var ColorPickerEditable         = react_color.ColorPickerEditable;
//var ColorPicker                 = react_color.ColorPicker;
//var DateTimePicker              = require('react-bootstrap-datetimepicker');
var InputDate                   =    Field.InputDate;
var InputDateEditable           =    Field.InputDateEditable;
var InputTime                   =    Field.InputTime;
var InputTimeEditable           =    Field.InputTimeEditable;
var Form                        = Field.Form;

// MIXINS ////
var MixinGestMod = require('../mixins/gestion_modif');

var ReactPageTest               = React.createClass({

    mixins: [MixinGestMod, Reflux.ListenerMixin],
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
    componentWillMount: function () {},

    /**
     * Test si le composant doit être réaffiché avec les nouvelles données
     * @param nextProps : Nouvelles propriétés
     * @param nextState : Nouvel état
     * @returns {boolean} : true ou false selon si le composant doit être mis à jour
     */
    shouldComponentUpdate: function (nextProps, nextState) {
        return true;
    },

    /**
     * Méthode appellée pour construire le composant.
     * A chaque fois que son contenu est mis à jour.
     * @returns {XML}
     */
    render: function () {
        var editable = true;

        /*********************/
        /* Paramètres Select */
        var options = [
            { value: '0', label: 'Fraise' },
            { value: '1', label: 'Abricot' },
            { value: '2', label: 'Framboise' },
            { value: '3', label: 'Pomme' },
            { value: '4', label: 'Poire' }
        ];

        function selectChange(value, aData){

            var indice = 0;
            _.each(aData, function(val, key){
                indice++;
            });
        }

        function clickImage(evt){
            var copie = _.clone(evt);
        }
        /* FIN : Paramètres Select */
        /***************************/
        
        return  <Form>
            <Row id="Champ_texte">
                <Col md={12}>
                    <InputTextEditable attributes={{label:'InputTextEditable', name:"InputTextEditable", value:'Vivian', wrapperClassName:'col-md-4',labelClassName:'col-md-2',groupClassName:'row'}} editable={editable} />
                </Col>
            </Row>

            <Row id="Champ_texte_area">
                <Col md={12}>
                    <InputTextEditable area={true} attributes={{label:'InputTextEditableArea', name:"InputTextEditableArea", value:'InputTextEditableArea', wrapperClassName:'col-md-4',labelClassName:'col-md-2',groupClassName:'row'}} editable={editable} />
                </Col>
            </Row>

            <Row id="Champ_mail">
                <Col md={12}>
                    <InputMailEditable attributes={{label:'InputMailEditable', name:"InputMailEditable", value:'InputMailEditable', wrapperClassName:'col-md-4',labelClassName:'col-md-2',groupClassName:'row'}} editable={editable} />
                </Col>
            </Row>

            <Row id="Champ_password">
                <Col md={12}>
                    <InputPasswordEditable attributes={{label:'InputPasswordEditable', name:"InputPasswordEditable", value:"InputPasswordEditable", wrapperClassName:'col-md-4',labelClassName:'col-md-2',groupClassName:'row'}} editable={editable} />
                </Col>
            </Row>

            <Row id="InputImageEditable">
                <Col md={12}>
                    <ImageEditable src='./app/assets/images/cross.gif' evts={{onClick:clickImage}} name="InputImageEditable" attributes={{name:"InputImageEditable", imgCol:4,labelCol:2}} editable={editable} />
                </Col>
            </Row>
            <Row id="InputColor">
                <Col md={12}>
                    <ColorPicker color="#123456" label="Couleur" mdColor={4} mdLabel={2} />
                </Col>
            </Row>
            <Row id="InputColorEditable">
                <Col md={12}>
                    <ColorPickerEditable color="#AAAAAA" label="Couleur" mdColor={4} mdLabel={2} attributes={{name:"toto"}} editable={editable} />
                </Col>
            </Row>

            <Row id="Select">
                <Col md={12}>
                    <InputSelectEditable multi={true} evts={{onChange:selectChange}} attributes={{label:'Select', name:"Select", selectCol:4,labelCol:2}} data={options} editable={editable} selectedValue={['2']} placeholder={'PlaceHolder...'}/>
                </Col>
            </Row>

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

        </Form>;
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
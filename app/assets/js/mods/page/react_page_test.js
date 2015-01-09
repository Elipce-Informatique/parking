
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
var react_photo                 = require('../react_photo');
var ImageEditable               = react_photo.PhotoEditable;

var ReactPageTest               = React.createClass({

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
            console.info('Value : '+value);

            var indice = 0;
            _.each(aData, function(val, key){
                console.info('aData['+indice+'], label : '+aData[indice]['label']+', value : '+aData[indice]['value']);
                indice++;
            });
        }

        function clickImage(evt){
            var copie = _.clone(evt);
            console.info('clickImage, evt : %o', copie);
        }
        /* FIN : Paramètres Select */
        /***************************/

        return  <div>
            <Row id="Champ_texte">
                <Col md={12}>
                    <InputTextEditable attributes={{label:'InputTextEditable', name:"InputTextEditable", value:'InputTextEditable', wrapperClassName:'col-md-4',labelClassName:'col-md-2',groupClassName:'row'}} editable={editable} />
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
                    <ImageEditable src='./app/assets/images/portrait_vide.gif' evts={{onClick:clickImage}} attributes={{name:"InputImageEditable", imgCol:4,labelCol:2}} editable={editable} />
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
        </div>;
    },

    /**
     * Retour du store "pageProfilStore", met à jour le state de la page
     * @param data
     */
    updateState: function(data) {
        // MAJ data automatique, lifecycle "UPDATE"
        this.setState(data);
    }
});
module.exports = ReactPageTest;
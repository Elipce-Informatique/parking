
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

var ReactPageTest = React.createClass({

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
            console.log('Value : '+value);

            var indice = 0;
            _.each(aData, function(val, key){
                console.log('aData['+indice+'], label : '+aData[indice]['label']+', value : '+aData[indice]['value']);
                indice++;
            });
        }
        /* FIN : Paramètres Select */
        /***************************/

        return  <div>
            <Row id="Champ_texte">
                <Col md={12}>
                    <InputTextEditable attributes={{label:'InputTextEditable', name:"InputTextEditable", value:'InputTextEditable', wrapperClassName:'col-md-4',labelClassName:'col-md-2',groupClassName:'row'}} editable={true} />
                </Col>
            </Row>

            <Row id="Champ_mail">
                <Col md={12}>
                    <InputMailEditable attributes={{label:'InputMailEditable', name:"InputMailEditable", value:'InputMailEditable', wrapperClassName:'col-md-4',labelClassName:'col-md-2',groupClassName:'row'}} editable={true} />
                </Col>
            </Row>

            <Row id="Champ_password">
                <Col md={12}>
                    <InputPasswordEditable attributes={{label:'InputPasswordEditable', name:"InputPasswordEditable", value:"InputPasswordEditable", wrapperClassName:'col-md-4',labelClassName:'col-md-2',groupClassName:'row'}} editable={true} />
                </Col>
            </Row>

            <Row id="Champ_radioBoostrap">
                <Col md={12}>
                    <ButtonGroup data-toggle="buttons" bsSize="xsmall">
                        <InputRadioBootstrapEditable key={'bt1'} editable={true} attributes={{className:'active'}}>Btn 1</ InputRadioBootstrapEditable>
                        <InputRadioBootstrapEditable key={'bt2'} editable={true}>Btn 2</ InputRadioBootstrapEditable>
                    </ButtonGroup>
                </Col>
            </Row>

            <Row id="Champ_radio">
                    <Col md={2}>
                        <p>InputRadioEditable</p>
                    </Col>
                    <Col md={1}>
                        <InputRadioEditable key={'bt1'} editable={true} attributes={{name:'btGroup[]', checked:'checked'}} />
                    </Col>
                    <Col md={2}>
                        <p>InputRadioEditable</p>
                    </Col>
                    <Col md={1}>
                        <InputRadioEditable key={'bt2'} editable={true} attributes={{name:'btGroup[]'}} />
                    </Col>
            </Row>

            <Row id="Champ_checkBox">
                <Col md={2}>
                    <p>InputCheckboxEditable</p>
                </Col>
                <Col md={1}>
                    <InputCheckboxEditable key={'bt1'} editable={true} />
                </Col>
            </Row>

            <Row id="Select">
                <Col md={6}>
                    <InputSelectEditable multi={true} evts={{onChange:selectChange}} attributes={{label:'Select', name:"Select", selectCol:5,labelCol:1}} data={options} editable={true} selectedValue={['2']} placeholder={'PlaceHolder...'}/>
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
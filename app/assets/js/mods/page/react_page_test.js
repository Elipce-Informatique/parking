/***********************/
/* Composants Boostrap */
var Row = ReactB.Row;
var Col = ReactB.Col;
var Button = ReactB.Button;

/*********************************************/
/* Composant input pour le libelle du profil */
var Field = require('../composants/formulaire/react_form_fields');
var InputTextEditable = Field.InputTextEditable;
var InputMailEditable = Field.InputMailEditable;
var InputPasswordEditable = Field.InputPasswordEditable;
var InputRadioEditable = Field.InputRadioEditable;
var ButtonGroup = ReactB.ButtonGroup;
var InputRadioBootstrapEditable = Field.InputRadioBootstrapEditable;
var InputCheckboxEditable = Field.InputCheckboxEditable;
var InputDateEditable = Field.InputDateEditable;
var InputSelect = Field.InputSelect;
var InputSelectEditable = Field.InputSelectEditable;
var InputNumberEditable = Field.InputNumberEditable;
var InputTelEditable = Field.InputTelEditable;
var react_photo = require('../composants/react_photo');
var ImageEditable = react_photo.PhotoEditable;
var react_color = require('../composants/react_color');
var ColorPicker = react_color.ColorPicker;
var ColorPickerEditable = react_color.ColorPickerEditable;
//var DateTimePicker              = require('react-bootstrap-datetimepicker');
var InputDate = Field.InputDate;
var InputDateEditable = Field.InputDateEditable;
var InputTime = Field.InputTime;
var InputTimeEditable = Field.InputTimeEditable;
var Form = Field.Form;

//var Modal1 = require('../composants/modals/test_modal_1');
//var Modal2 = require('../composants/modals/test_modal_2');
var Modal = ReactB.Modal;

/*****************************************************
 /* MIXINS */
var MixinGestMod = require('../mixins/gestion_modif');

/*****************************************************
 /* HELPERS */
var form_data_helper = require('../helpers/form_data_helper');


/**************************************************
 * PAGE REACT
 */
var ReactPageTest = React.createClass({

    mixins: [MixinGestMod, Reflux.ListenerMixin, ReactB.OverlayMixin],
    /**
     * État initial des données du composant
     * @returns object : les données de l'état initial
     */
    getInitialState: function () {
        return {
            isModalOpen: false,
            modalType: 1
        };
    },

    /**
     * Avant le premier Render()
     */
    componentWillMount: function () {
        this.listenTo(storeTest, this.update);
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

    /**
     * Appellé en retour du store test
     * @param data
     */
    update: function (data) {
        this.setState(data);
    },


    /**
     * Appellé par le mixin MixinGestMod quand l'utilisateur a cliqué sur retour
     * et a validé l'intention de perdre toutes les modifications en cours.
     */
    onRetour: function () {

    },

    /**
     * Se base sur le state isModalOpen ET modalType
     * pour afficher ou non un modal.
     * Cette fonction est appellée au render initial et lors de toutes les updates du composant.
     * Le code retourné est ajouté à la fin du <body> de la page.
     */
    renderOverlay: function () {
        console.log('Pass renderOverlay');
        var retour = {};
        switch (this.state.modalType) {
            case 1:
                if (!this.state.isModalOpen) {
                    retour = <span/>;
                } else {
                    retour = (<Modal bsStyle="primary" title="Modal 1" onRequestHide={this.toggleModal}>
                        <div className="modal-body">
                            This modal is controlled by our custom trigger component.
                        </div>
                        <div className="modal-footer">
                            <Button onClick={this.toggleModal}>Close</Button>
                            <Button onClick={Actions.test.modal1_save}>Save</Button>
                        </div>
                    </Modal>);

                }
                break;

            default:
                if (!this.state.isModalOpen) {
                    retour = <span/>;
                } else {
                    retour = (<Modal bsStyle="primary" title="Modal 2" onRequestHide={this.toggleModal}>
                        <div className="modal-body">
                            This modal is controlled by our custom trigger component.
                        </div>
                        <div className="modal-footer">
                            <Button onClick={this.toggleModal}>Close</Button>
                            <Button onClick={Actions.test.modal2_save}>Save</Button>
                        </div>
                    </Modal>);
                }
                break;
        }
        console.log('retour : %o', retour);
        return retour;
    },

    /**
     * Inverse le booléen correspondant à l'état d'affichage de la modale
     */
    toggleModal: function () {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    },

    /**
     * Affiche le modal 1
     */
    toggleModal1: function () {
        this.setState({
            isModalOpen: true,
            modalType: 1
        });
    },

    /**
     * Affiche le modal 2
     */
    toggleModal2: function () {
        this.setState({
            isModalOpen: true,
            modalType: 2
        });
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
            {value: '1abricot', label: 'Abricot'},
            {value: '2fambroise', label: 'Framboise'},
            {value: '3pomme', label: 'Pomme'},
            {value: '4poire', label: 'Poire'},
            {value: '5fraise', label: 'Fraise'}
        ];

        function selectChange(value, aData) {

            _.each(aData, function (val, key) {
                indice++;
            });
            //console.log('ChangeSelect '+indice);
        }

        function clickImage(evt) {
            var copie = _.clone(evt);
        }

        /* FIN : Paramètres Select */
        /***************************/
        return (
            <Form attributes={{id: "form_test"}}>

                <InputTextEditable
                    attributes={
                    {
                        label: 'InputTextEditable',
                        name: "InputTextEditable",
                        value: 'Vivian',
                        wrapperClassName: 'col-md-4',
                        labelClassName: 'col-md-2',
                        groupClassName: 'row'
                    }}
                    editable={editable} />

                <InputTextEditable
                    area={true}
                    attributes={{
                        label: 'InputTextEditableArea',
                        name: "InputTextEditableArea",
                        value: 'InputTextEditableArea',
                        wrapperClassName: 'col-md-4',
                        labelClassName: 'col-md-2',
                        groupClassName: 'row'
                    }}
                    editable={editable} />

                <InputMailEditable
                    attributes={{
                        label: 'InputMailEditable',
                        name: "InputMailEditable",
                        value: 'InputMailEditable@elipce.com',
                        wrapperClassName: 'col-md-4',
                        labelClassName: 'col-md-2',
                        groupClassName: 'row'
                    }}
                    editable={editable} />

                <InputPasswordEditable
                    attributes={{
                        label: 'InputPasswordEditable',
                        name: "InputPasswordEditable",
                        value: "",
                        wrapperClassName: 'col-md-4',
                        labelClassName: 'col-md-2',
                        groupClassName: 'row'
                    }}
                    editable={editable} />


                <ImageEditable
                    src='./app/assets/images/cross.gif'
                    evts={{onClick: clickImage}}
                    name="InputImageEditable"
                    attributes={{
                        name: "InputImageEditable",
                        imgCol: 4,
                        labelCol: 2
                    }}
                    editable={editable} />


                <ColorPickerEditable
                    evts={{
                        onBlur: function (e) {
                            console.log('blur color ' + $(e.currentTarget).val());
                        }
                    }}
                    label="Couleur modifiable"
                    mdColor={4}
                    mdLabel={2}
                    labelClass="text-right"
                    gestMod={true}
                    attributes={{name: "color", required: false, value: 'E2156B'}}
                    editable={editable} />

                <InputSelectEditable
                    multi={false}
                    evts={{onChange: selectChange}}
                    attributes={{label: 'Mes fruits', name: "Select", selectCol: 4, labelCol: 2, required: true}}
                    data={options}
                    editable={editable}
                    placeholder={'PlaceHolder...'}
                    labelClass='text-right'
                    selectedValue={["5fraise", "3pomme"]}
                />

                <Button
                    bsStyle="success"
                    onClick={function () {
                        var fData = form_data_helper('form_test', 'POST');
                        //console.log('DATA: %o',fData);
                        var f = $('#form_test').serializeArray();
                        //console.log('DATA %o',f);
                        // Vérif champ erronés
                        Actions.validation.verify_form_save();
                    }}
                >Valider</Button>

                <InputNumberEditable
                    min={-10}
                    max={10}
                    step={0.01}
                    attributes={{
                        label: 'Input number',
                        name: "InputNumber",
                        value: 5,
                        wrapperClassName: 'col-md-4',
                        labelClassName: 'col-md-2',
                        groupClassName: 'row'
                    }}
                    editable={editable} />

                <InputTelEditable
                    attributes={{
                        label: 'Input tel',
                        name: "InputTel",
                        htmlFor: 'form_test',
                        value: '0475757575',
                        wrapperClassName: 'col-md-4',
                        labelClassName: 'col-md-2',
                        groupClassName: 'row'
                    }}
                    editable={editable} />

                <Row id="Champ_radioBoostrap">
                    <Col md={2}>
                        <label>Radio Boostrap</label>
                    </Col>
                    <Col md={4}>
                        <ButtonGroup
                            data-toggle="buttons"
                            bsSize="xsmall">
                            <InputRadioBootstrapEditable
                                key={'bt1'}
                                editable={editable}
                                attributes={{
                                    className: 'active'
                                }}
                            >Btn 1</ InputRadioBootstrapEditable>
                            <InputRadioBootstrapEditable
                                key={'bt2'}
                                editable={editable}
                            >Btn 2</ InputRadioBootstrapEditable>
                        </ButtonGroup>
                    </Col>
                </Row>

                <InputRadioEditable
                    key={'bta'}
                    editable={editable}
                    attributes={{
                        label: 'InputRadioEditable 1',
                        checked: true,
                        name: "InputRadioEditable[]",
                        wrapperClassName: 'col-md-4',
                        labelClassName: 'col-md-2',
                        groupClassName: 'row'
                    }}
                />

                <InputRadioEditable
                    key={'btb'}
                    editable={editable}
                    attributes={{
                        label: 'InputRadioEditable 2',
                        name: "InputRadioEditable[]",
                        wrapperClassName: 'col-md-4',
                        labelClassName: 'col-md-2',
                        groupClassName: 'row'
                    }} />

                <InputCheckboxEditable
                    key={'bty'}
                    attributes={{
                        label: 'InputCheckboxEditable',
                        name: "InputCheckboxEditable",
                        htmlFor: 'form_test',
                        wrapperClassName: 'col-md-4',
                        labelClassName: 'col-md-2',
                        groupClassName: 'row'
                    }}
                    editable={editable} />

                <InputDateEditable
                    attributes={{
                        label: 'Champ date editable',
                        value: '2015-02-23',
                        htmlFor: 'form_test',
                        required: true,
                        wrapperClassName: 'col-md-4',
                        labelClassName: 'col-md-2',
                        groupClassName: 'row'
                    }}
                    editable={editable} />

                <InputTimeEditable
                    attributes={{
                        label: 'Champ time editable',
                        name: 'time_field',
                        value: '10:00:25',
                        htmlFor: 'form_test',
                        wrapperClassName: 'col-md-4',
                        labelClassName: 'col-md-2',
                        groupClassName: 'row'
                    }}
                    editable={editable} />

                <Button bsStyle="primary" onClick={this.toggleModal1}>Modal 1</Button>

                <Button bsStyle="success" onClick={this.toggleModal2}>Modal 2</Button>
            </Form>)
    }


});
module.exports = ReactPageTest;

// Creates a DataStore
var storeTest = Reflux.createStore({

    // Initial setup
    init: function () {
        this.listenToMany(Actions.validation);
        this.listenToMany(Actions.test);
    },

    /**
     * Appellé lors du click sur le bouton save du modal 1
     * @param data
     */
    onModal1_save: function (data) {
        console.log('Save MODAL 1 : %o', data);
    },

    /**
     * Appellé lors du click sur le bouton save du modal 2
     * @param data
     */
    onModal2_save: function (data) {
        console.log('Save MODAL 2 : %o', data);
    },
    /**
     * onChange de n'importe quel élément du FORM
     * @param e: {name, value, form}
     */
    onForm_field_changed: function (e) {
        console.log('CHANGED ' + e.name + ' %o', e);
    },

    /**
     * Vérifications "Métiers" du formulaire sur onBlur de n'imoprte quel champ du FORM
     */
    onForm_field_verif: function (e) {
        console.log('VERIF ' + e.name);

    }
});
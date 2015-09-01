/***********************/
var React = require('react/addons');
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
var RadioGroup = Field.RadioGroup;
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

var ModalUn = require('../composants/modals/test_modal_1');
var Modal2 = require('../composants/modals/test_modal_2');
var Modal = ReactB.Modal;
var Select = require('react-select');

/*****************************************************
 /* MIXINS */
var MixinGestMod = require('../mixins/gestion_modif');

/*****************************************************
 /* HELPERS */
var form_data_helper = require('../helpers/form_data_helper');
var pageState = require('../helpers/page_helper').pageState;


/******************************************************************
 * *************** COM WEBSOCKET *********************************
 ****************************************************************
 */
var com = require('../helpers/com_helper');
var messagesHelper = com.messages;
var supervision_helper = require('../helpers/supervision_helper');


/**************************************************
 * PAGE REACT
 */
var ReactPageTest = React.createClass({

        mixins: [MixinGestMod, Reflux.ListenerMixin, ReactB.OverlayMixin],
        clientWs: '',
        viewEvents: [
            {
                date: new Date().toISOString(),
                event: "state",
                class: "view",
                ID: 2,
                state: "normal",
                count: 60,
                occupied: 40,
                free: 60
            },
            {
                date: new Date().toISOString(),
                event: "state",
                class: "view",
                ID: 3,
                state: "normal",
                count: 7,
                occupied: 8,
                free: 7
            },
            {
                date: new Date().toISOString(),
                event: "state",
                class: "view",
                ID: 4,
                state: "normal",
                count: 2,
                occupied: 8,
                free: 10
            },
            {
                date: new Date().toISOString(),
                event: "state",
                class: "view",
                ID: 2,
                state: "normal",
                count: 10,
                occupied: 90,
                free: 10
            },
            {
                date: new Date().toISOString(),
                event: "state",
                class: "view",
                ID: 3,
                state: "normal",
                count: 0,
                occupied: 0,
                free: "full"
            },
            {
                date: new Date().toISOString(),
                event: "state",
                class: "view",
                ID: 4,
                state: "normal",
                count: 0,
                occupied: 0,
                free: "empty"
            }],
        ackId: 0,


        updateView: function () {

            var tab = _.cloneDeep(this.viewEvents);
            tab.splice(this.ackId, 3);
            this.ackId += 3;
            // RAZ
            if (this.ackId == 6) {
                this.ackId = 0;
            }

            console.log('page test ' + this.ackId + ' list: %o', tab);
            return {
                "messageType": "eventData",
                "data": {
                    "ackID": this.ackId,

                    "list": tab
                }
            }
        },

        sendEventsView: function () {

            var msg = JSON.stringify(this.updateView());
            //console.log('message: %o', msg);
            //console.log('client: %o', this.clientWs);
            this.clientWs.send(msg);

        },
        /**
         * État initial des données du composant
         * @returns object : les données de l'état initial
         */
        getInitialState: function () {
            return {
                isModalOpen: false,
                modalType: 1,
                options: [],
                select: ''
            };
        },

        /**
         * Avant le premier Render()
         */
        componentWillMount: function () {
            this.listenTo(storeTest, this.update);
        },

        componentDidMount: function () {
            this.setState({
                options: [
                    {value: '1abricot', label: 'Abricot'},
                    {value: '2fambroise', label: 'Framboise'},
                    {value: '3pomme', label: 'Pomme'},
                    {value: '4poire', label: 'Poire'},
                    {value: '5fraise', label: 'Fraise'}
                ]
            })
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
            //console.log('Pass renderOverlay');
            var retour = {};
            switch (this.state.modalType) {
                case 1:
                    if (!this.state.isModalOpen) {
                        return <span key="modal-test"/>;
                    } else {
                        return <ModalUn key="modal-test" onToggle={this.toggleModal} />;
                    }
                    break;

                default:
                    if (!this.state.isModalOpen) {
                        return <span key="modal-test"/>;
                    } else {
                        return <Modal2 key="modal-test" onToggle={this.toggleModal} />;
                    }
                    break;
            }
            //console.log('retour : %o', retour);
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


            function selectChange(value, aData) {

                _.each(aData, function (val, key) {
                    indice++;
                });
            }

            function clickImage(evt) {
                var copie = _.clone(evt);
            }

            /* FIN : Paramètres Select */
            /***************************/
            return (
                <div>
                    <Form attributes={{id: "form_com"}}>
                        <h1>COMMUNICATION TOOL</h1>
                        <Button
                            onClick={function () {
                                // Connexion controller
                                supervision_helper.init(0, 0, 1, 0, function OK(clientWs) {
                                    this.clientWs = clientWs;
                                    console.log('Connecté');
                                }.bind(this));
                            }.bind(this)}>
                            Connexion
                        </Button>
                        <Button
                            onClick={function sendQuery() {
                                this.clientWs.send(JSON.stringify(messagesHelper.settingsQuery()))
                            }}>
                            Send settingsQuery
                        </Button>
                        <Button
                            onClick={function sendReset() {
                                this.clientWs.send(JSON.stringify(messagesHelper.remoteControl('reset')))
                            }}>
                            Reset
                        </Button>

                        <Button
                            onClick={this.sendEventsView.bind(this)}>
                            View events
                        </Button>
                    </Form>

                    <hr/>

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
                            attributes={{
                                label: 'Mes fruits',
                                name: "Select",
                                selectCol: 4,
                                labelCol: 2,
                                required: true
                            }}
                            data={this.state.options}
                            editable={editable}
                            placeholder={'PlaceHolder...'}
                            labelClass='text-right'
                            selectedValue={["5fraise", "3pomme"]}
                        />
                        <ColorPicker
                            color="FF2800"
                            label="Mon label"
                            mdLabel={3}
                            mdColor={2}
                            height={10}
                            width={20}
                            labelClass="text-right"
                        />

            {{
                /*
                 <InputSelectEditable
                 multi={true}
                 evts={{onChange: selectChange}}
                 attributes={{
                 label: 'Mes fruits',
                 name: "Select",
                 selectCol: 4,
                 labelCol: 2,
                 required: true
                 }}
                 data={this.state.options}
                 editable={editable}
                 placeholder={'PlaceHolder...'}
                 labelClass='text-right'
                 />
                 */
            }}

                        <InputSelectEditable
                            multi={false}
                            attributes={{name: "SelectSansLabel", selectCol: 4, required: true}}
                            data={this.state.options}
                            editable={editable}
                            placeholder={'PlaceHolder...'}
                            labelClass='text-right'
                            selectedValue={"3pomme"}
                        />
                        <Select
                            multi={false}
                            placeholder="Select your favourite(s)"
                            options={this.state.options}
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
                            step={0.1}
                            attributes={{
                                required: true,
                                label: 'Input number',
                                name: "InputNumber",
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
                                <label>Radio Boostrap NEW generation</label>
                            </Col>
                            <Col md={4}>
                                <RadioGroup attributes={{name: "bootstrap"}} bootstrap={true}>
                                    <InputRadioBootstrapEditable
                                        key={'bt1'}
                                        editable={editable}
                                        attributes={{
                                            checked: true,
                                            value: 'btn1'
                                        }}
                                        evts={{
                                            onClick: function () {
                                                console.log('CLICK');
                                            }
                                        }}
                                    >
                                        Btn 1
                                    </ InputRadioBootstrapEditable>
                                    <InputRadioBootstrapEditable
                                        key={'bt2'}
                                        editable={editable}
                                        attributes={{
                                            value: 'btn2'
                                        }}
                                        evts={{
                                            onClick: function () {
                                                console.log('CLICK');
                                            }
                                        }}
                                    >
                                        Btn 2
                                    </ InputRadioBootstrapEditable>
                                </RadioGroup>
                            </Col>
                            <Col md={4}>
                                <RadioGroup attributes={{name: "bootstrap"}} bootstrap={true}>
                                </RadioGroup>
                            </Col>
                        </Row>
            {/* EXemple de radio inline*/}
                        <RadioGroup
                            attributes={{
                                name: "radio"
                            }}>
                            <InputRadioEditable
                                editable={editable}
                                attributes={{
                                    label: 'InputRadioEditable 1',
                                    checked: true,
                                    name: "a_ecraser",
                                    value: 'un',
                                    groupClassName: 'col-md-2'
                                }}
                                evts={{
                                    onChange: function () {
                                        console.log('Change');
                                    }
                                }}
                                key = "zouzou"
                            />
                            <InputRadioEditable
                                editable={editable}
                                attributes={{
                                    label: 'InputRadioEditable 2',
                                    checked: false,
                                    name: "a_ecraser",
                                    value: 'deux',
                                    groupClassName: 'col-md-2'
                                }}
                                evts={{
                                    onChange: function () {
                                        console.log('Change');
                                    }
                                }}
                                key = "pitchoune"/>
                        </RadioGroup>

                 {/* EXemple de radio les uns sous les autres*/}
                        <RadioGroup
                            editable={editable}
                            attributes={{
                                name: "ab"
                            }}>
                            <InputRadioEditable
                                editable={editable}
                                attributes={{
                                    label: 'A',
                                    checked: true,
                                    name: "a_ecraser",
                                    value: 'A',
                                    groupClassName: 'col-md-12'
                                }}
                                key = "a"
                            />
                            <InputRadioEditable
                                editable={editable}
                                attributes={{
                                    label: 'B',
                                    checked: false,
                                    name: "a_ecraser",
                                    value: 'B',
                                    groupClassName: 'col-md-12'
                                }}
                                key = "b"/>
                        </RadioGroup>

                        <Row>
                            <InputCheckboxEditable
                                key={'bty'}
                                attributes={{
                                    label: 'check1',
                                    name: "check[]",
                                    value: 'check1',
                                    checked: true,
                                    htmlFor: 'form_test',
                                    groupClassName: 'col-md-2'
                                }}
                                editable={editable} />

                            <InputCheckboxEditable
                                key={'btz'}
                                attributes={{
                                    label: 'check2',
                                    name: "check[]",
                                    value: 'check2',
                                    checked: true,
                                    htmlFor: 'form_test',
                                    groupClassName: 'col-md-2'
                                }}
                                editable={editable} />
                        </Row>
                        <InputDateEditable
                            attributes={{
                                label: 'Champ date editable',
                                name: 'date',
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
                    </Form>
                </div>
            )
        }
    })
    ;
module.exports = ReactPageTest;

// Creates a DataStore
var storeTest = Reflux.createStore({

    // Initial setup
    init: function () {
        this.listenToMany(Actions.validation);
    },

    /**
     * Appelé apprès la sélection du formulaire dans le listener de l'action 'submit_form'
     * @param data
     */
    onModal1_save: function (data) {
        console.log('Save MODAL 1 : %o', $(data).serializeArray());
        this.trigger({
            isModalOpen: false
        });
    },

    /**
     * Appelé apprès la sélection du formulaire dans le listener de l'action 'submit_form'
     * @param data
     */
    onModal2_save: function (data) {
        console.log('Save MODAL 2 : %o', $(data).serializeArray());
        this.trigger({
            isModalOpen: false
        });
    },

    /**
     * Appellée par le mixin form verif
     */
    onSubmit_form: function (domNode, idForm) {
        console.group('------ Submit form ');
        console.log('domNode : %o', domNode);
        console.log('idForm : %o', idForm);
        switch (idForm) {
            case "form_modal_test_1":
                this.onModal1_save(domNode);
                break;
            case "form_modal_test_2":
                this.onModal2_save(domNode);
                break;
            default:
                var f = form_data_helper('form_test', 'POST');
                ////console.log('DATA: %o',fData);
                //var f = $('#form_test').serializeArray();
                //f.push({name: '_token', value: $('#_token').val()});
                //console.log('DATA sur validation  %o', f);


                $.ajax({
                    url: BASE_URI + 'post_dump',
                    data: f,
                    dataType: 'json',
                    context: this,
                    method: 'POST',
                    async: false,
                    processData: false,
                    contentType: false,
                    success: function (good) {
                    },

                    error: function (xhr, status, err) {
                        console.error(status, err.toString());
                    }
                });
                break;
        }
        console.groupEnd();
    },
    /**
     * onChange de n'importe quel élément du FORM
     * @param obj: {name, value, form}
     */
    onForm_field_changed: function (obj) {
        console.log('CHANGED ' + obj.name + ': ' + obj.value);
        if (obj.name == 'select') {
            this.trigger({select: obj.value});
        }
    },

    /**
     * Vérifications "Métiers" du formulaire sur onBlur de n'imoprte quel champ du FORM
     */
    onForm_field_verif: function (obj) {
        console.log('VERIF ' + obj.name + ': ' + obj.value);

    }
});
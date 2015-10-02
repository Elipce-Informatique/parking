// COMPOSANTS REACT
var React = require('react/addons');
var Field = require('./composants/formulaire/react_form_fields');
var InputTextEditable = Field.InputTextEditable;
var Color = require('./composants/react_color').ColorPickerEditable;
var Row = ReactB.Row;
var Col = ReactB.Col;
var Button = ReactB.Button;
var Form = Field.Form;
var InputNumberEditable = Field.InputNumberEditable;
var Validator = require('validator');
var Select = Field.InputSelectEditable;
var com = require('./helpers/com_helper');
var client = com.client;
var messagesHelper = com.messages;
var Upload = Field.InputFile;
var Photo = require('./composants/react_photo').PhotoEditable;
var RadioGroup = Field.RadioGroup;
var InputRadio = Field.InputRadioBootstrapEditable;

/**
 * Formulaire de jours prédéfinis
 * @param editable: Booléen pour autoriser ou non la modification des données de l'utilisateur
 * @param idParkings: ID table jour_calendrier
 */
var FormParking = React.createClass({

        mixins: [Reflux.ListenerMixin],
        unscribe: {},

        propTypes: {
            editable: React.PropTypes.bool.isRequired,
            detailParking: React.PropTypes.object,
            idParking: React.PropTypes.number,
            validationLibelle: React.PropTypes.object, // Permet de colorer le champ en fonction des vérifications métiers effectuées dans la page
            users: React.PropTypes.array,
            mode: React.PropTypes.string.isRequired
        },
        getDefaultProps: function () {
            return {
                detailParking: {},
                idParking: 0,
                validationLibelle: {}
            }
        },

        componentWillMount: function () {
            this.unscribe = Actions.com.message_controller.listen(this.onInitParkingFinished);
        },

        componentWillUnmount: function () {
            this.unscribe();
            //console.log('unsuscribe');
        },

        render: function () {
            //console.log'render form detail: %o',this.props.detailParking)
            var ligneInit = '';
            var logo = ''
            // Mode edition
            if (this.props.mode == 'edition') {
                // Ligne synchronisation qui était auparavant une init à faire une seule fois
                var blocInit = "";
                var attr = {disabled: true};
                // Mode edition
                if (this.props.editable) {
                    attr = {
                        onClick: this.initParking,
                        disabled: false
                    }
                }
                blocInit = (
                    <Button
                {...attr}
                        bsStyle='primary'>
                        {Lang.get("administration_parking.parking.btn")}
                    </Button>
                );
                // Logo
                var src = src = this.props.detailParking.logo == '' ? {} : {
                    src: DOC_URI + 'logo_parking/' + this.props.detailParking.logo
                };
                logo = (

                    <Col
                        md={2}
                        className = "text-center">
                        <Photo
                            editable={this.props.editable}
                            {...src}
                            name={"logo"}
                            typeOfFile="img"
                            alertOn={true}
                            libelle={Lang.get('global.logo')}
                            attributes={{
                                required: false
                            }}/>
                    </Col>
                );
                // Row synchronisation (anciennement init)
                ligneInit = (
                    <Row>
                        <Col
                            md={2}
                            className="text-right">
                            <label>
                    {Lang.get('administration_parking.parking.synchro')}
                            </label>
                        </Col>
                        <Col
                            md={4}
                            className="text-left">
                    {blocInit}
                        </Col>
                    </Row>
                );
            }
            // Mode création
            else {

                // Logo
                logo = (
                    <Col
                        md={2}>
                        <Upload
                            name={"logo"}
                            typeOfFile="img"
                            alertOn={true}
                            libelle={Lang.get('global.telecharger')}
                            attributes={{
                                required: false
                            }}
                        />
                    </Col>
                );
            }

            return (
                <Form attributes={{id: "form_parking"}}>
                    <Row />
                    <InputTextEditable
                        attributes={_.extend({
                            label: Lang.get('global.parking'),
                            name: "libelle",
                            value: this.props.detailParking.libelle,
                            required: true,
                            wrapperClassName: 'col-md-4',
                            labelClassName: 'col-md-2 text-right',
                            groupClassName: 'row'
                        }, this.props.validationLibelle)}
                        editable={this.props.editable}/>

                    <InputTextEditable
                        attributes={{
                            label: Lang.get('global.description'),
                            name: "description",
                            value: this.props.detailParking.description,
                            required: false,
                            wrapperClassName: 'col-md-4',
                            labelClassName: 'col-md-2 text-right',
                            groupClassName: 'row'
                        }}
                        editable={this.props.editable}
                        area = {true} />


                    <InputNumberEditable
                        attributes={{
                            label: Lang.get('administration_parking.parking.protocol_version'),
                            name: "protocol_version",
                            value: this.props.detailParking.server_com.protocol_version,
                            required: true,
                            placeholder: '1',
                            wrapperClassName: 'col-md-2',
                            labelClassName: 'col-md-2 text-right',
                            groupClassName: 'row'
                        }}
                        editable={this.props.editable}
                        min={0}/>

                    <InputNumberEditable
                        attributes={{
                            label: Lang.get('administration_parking.parking.port'),
                            name: "protocol_port",
                            value: this.props.detailParking.server_com.protocol_port,
                            required: true,
                            placeholder: 'ex: 26000',
                            wrapperClassName: 'col-md-2',
                            labelClassName: 'col-md-2 text-right',
                            groupClassName: 'row'
                        }}
                        editable={this.props.editable}
                        min={0}/>

                    <Row>
                        <Col md={2}>
                            <label
                                className="text-right">
                                {Lang.get('administration_parking.parking.init_mode')}
                            </label>
                        </Col>
                        <Col md={4}>
                            <RadioGroup
                                attributes={{
                                    name: "init_mode"
                                }}
                                bootstrap={true}>
                                <InputRadio
                                    key={'bt1'}
                                    editable={this.props.editable}
                                    attributes={{
                                        checked: parseInt(this.props.detailParking.init_mode) === 0,
                                        value: '0'
                                    }}
                                >
                    {Lang.get('administration_parking.parking.get')}
                                </ InputRadio>
                                <InputRadio
                                    key={'bt2'}
                                    editable={this.props.editable}
                                    attributes={{
                                        checked: parseInt(this.props.detailParking.init_mode) === 1,
                                        value: '1'
                                    }}
                                >
                    {Lang.get('administration_parking.parking.set')}
                                </ InputRadio>
                                <InputRadio
                                    key={'bt3'}
                                    editable={this.props.editable}
                                    attributes={{
                                        checked: parseInt(this.props.detailParking.init_mode) === 2,
                                        value: '2'
                                    }}
                                >
                    {Lang.get('administration_parking.parking.set_virtuel')}
                                </ InputRadio>
                            </RadioGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col
                            md={2}
                            className="text-right">
                            <label>{Lang.get('global.logo')}</label>
                        </Col>
                        {logo}
                    </Row>

                    <Select
                        attributes={{
                            label: Lang.get('administration_parking.parking.users'),
                            name: "utilisateurs",
                            selectCol: 4,
                            labelCol: 2,
                            required: false
                        }}
                        data         ={this.props.users}
                        editable     ={this.props.editable}
                        selectedValue={this.props.detailParking.utilisateurs}
                        placeholder  ={Lang.get('global.selection')}
                        labelClass = "text-right"
                        key={Date.now()}
                        multi={true}/>

            {ligneInit}
                </Form>
            );
        },

        /**
         * Lance la procédure d'initialisation du parking en fonction du mode d'init
         * @param e: evt
         */
        initParking: function (e) {

            /**
             * Local function used to start Init if WS already connected or in connexion
             */
            var startInitProcess = function (clientWs) {
                // Envoie initialisazion
                clientWs.send(JSON.stringify(messagesHelper.initParking(this.props.detailParking.init_mode)));
                console.log('Lancer procédure init parking ' + this.props.detailParking.init_mode);
                // Chargement
                $.blockUI({
                    message: '<div class="alert alert-warning" role="alert" style="margin:0"><h1 style="margin:0"><div id="facebookG"><div id="blockG_1" class="facebook_blockG"></div><div id="blockG_2" class="facebook_blockG"></div><div id="blockG_3" class="facebook_blockG"></div></div>' + Lang.get('global.block_ui') + '</h1></div>',
                    baseZ: 9999, // POUR PASSER PAR DESSUS LES MODALES BOOTSTRAP
                    css: {
                        'border-radius': '5px',
                        'border-color': '#E7CC9D'
                    },
                    fadeOut: 50,
                    fadeIn: 100
                });
            }.bind(this);

            // WS already connected
            if (clientWs !== null) {
                startInitProcess(clientWs);
            }
            // WS NOT connected
            else {
                // Connexion controller
                client.initWebSocket(this.props.detailParking.id, function (clientWs) {
                    startInitProcess(clientWs);
                }.bind(this), function () {
                    // Impossible de se connecter au server
                    console.log('callback err connexion');
                    swal(Lang.get('global.com.errConnServer'));
                });
            }
        },

        parkInitialized: false,
        /**
         * Callback when parking init finished
         */
        onInitParkingFinished: function (message) {
            if (message.messageType == 'init_parking_finished') {

                console.log('Callback init_parking_finished %o', message);
                // Fin chargement
                $.unblockUI();
                // Parking non init encore
                if (!this.parkInitialized) {

                    // TODO process data DELTA
                    if (message.data !== undefined) {
                        console.log('DELTA %o', message.data);
                        // Sensors not in supervision and on physical network
                        var txt = _.map(message.data, function (obj) {
                            var busId = obj.bus;
                            // Parse all delta sensors on this bus
                            var temp = _.map(obj.delta, function (sensor) {
                                return busId + '.' + sensor.leg + '.' + sensor.index;
                            });
                            return temp.join("<br/>");
                        });
                        // SWAL // TODO swal avec petit texte + scroll
                        swal({
                            title: '',
                            text: '<p style="font-size:8pt;">' + Lang.get('administration_parking.parking.delta') + '<br/>' + txt + '</p>',
                            html: true,
                            animation: "slide-from-top",
                            customClass: "swal_overflow"
                        });

                    }
                    else {
                        // Action enregistrement parking init
                        Actions.parking.parking_initialized(this.props.detailParking.id);
                        this.parkInitialized = true;
                    }
                }
            }
        }

    })
    ;
module.exports.Composant = FormParking;

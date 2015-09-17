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
        //console.log'render form detail: %o',this.props.detailParking);


        var ligneInit = '';
        if (this.props.mode == 'edition') {
            var blocInit = "";
            // Parking déjà init
            if (this.props.detailParking.init == '1') {
                blocInit = Lang.get('administration_parking.parking.txt')
            }
            // Parking non init
            else {
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
            }
            ligneInit = (
                <Row>
                    <Col
                        md={2}
                        className="text-right">
                        <label>
                    {Lang.get('administration_parking.parking.init')}
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
        // Connexion controller
        client.initWebSocket(this.props.detailParking.id, function (clientWs) {
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
        }.bind(this), function () {
            // Impossible de se connecter au server
            console.log('callback err connexion');
            swal(Lang.get('global.com.errConnServer'));
        });
    },

    parkInitialized: false,
    /**
     * Callback when parking init finished
     */
    onInitParkingFinished: function (message) {
        if (message.messageType == 'init_parking_finished') {
            console.log('Callback finished');
            // Fin chargement
            $.unblockUI();
            if (!this.parkInitialized) {
                // Action enregistrement parking init
                Actions.parking.parking_initialized(this.props.detailParking.id);
                this.parkInitialized = true;
            }
        }
    }

});
module.exports.Composant = FormParking;

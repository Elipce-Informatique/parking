var React = require('react/addons');
/* Gestion de la modification et des droits */
var ComponentAccessMixins = require('../../mixins/component_access');
/* Pour le listenTo */
var MixinGestMod = require('../../mixins/gestion_modif');

var initModale = Reflux.createAction();

var Field = require('../formulaire/react_form_fields');
var Form = Field.Form;
var BtnSave = Field.BtnSave;
var InputTextEditable = Field.InputTextEditable;
var InputNumberEditable = Field.InputNumberEditable;
var InputCheckboxEditable = Field.InputCheckboxEditable;
var InputSelectEditable = Field.InputSelectEditable;
var Modal = ReactB.Modal;
var Row = ReactB.Row;
var Col = ReactB.Col;
var Button = ReactB.Button;

/**
 * Created by yann on 12/03/2015.
 *
 * Modal pour configurer modifier une place
 */
var ModalEditPlace = React.createClass({

    mixins: [Reflux.ListenerMixin, ComponentAccessMixins, MixinGestMod],

    propTypes: {
        onToggle: React.PropTypes.func.isRequired,
        typesPlaces: React.PropTypes.array.isRequired,
        dataItem: React.PropTypes.object.isRequired,
        parkingId: React.PropTypes.number.isRequired
    },

    getDefaultProps: function () {
        return {
            module_url: 'configuration_parking'
        };
    },

    getInitialState: function () {
        return {
            type_place_id: '',
            capteur_id: '',
            selectTypes: [],
            selectCapteurs: []
        };
    },
    componentWillMount: function () {
        this.listenTo(store, this.onStoreTrigger);
        initModale(this.props.parkingId, this.props.dataItem.id);
        // Génération des données de la liste des types
        var data = _.map(this.props.typesPlaces, function (tp) {
            return {
                label: tp.libelle,
                value: tp.id + ""
            };
        });
        this.setState({
            selectTypes: data,
            type_place_id: this.props.dataItem.type_place_id,
            capteur_id: this.props.dataItem.capteur_id == null ? '' : this.props.dataItem.capteur_id
        });
    },
    componentDidMount: function () {

    },

    shouldComponentUpdate: function (nextProps, nextState) {
        return true;
    },

    // Rien à faire dans la popup à priori
    onRetour: function () {

    },

    onStoreTrigger: function (data) {
        this.setState(data);
    },

    render: function () {

        // Fix bug data selected
        var capteur_id = this.state.capteur_id;
        if (this.state.selectCapteurs.length == 0) {
            capteur_id = "";
        }

        return (
            <Modal
                bsStyle="primary"
                title={Lang.get('administration_parking.carte.titre_edit_place')}
                onHide={this.props.onToggle}>

                <div className="modal-body">
                    <Form attributes={{id: "form_mod_edit_place"}}>
                    {/* TYPE PLACE select */}
                        <InputSelectEditable
                            multi={false}
                            attributes={{
                                label: Lang.get('global.type_place'),
                                name: "type_place_id",
                                selectCol: 6,
                                labelCol: 3,
                                required: true
                            }}
                            data={this.state.selectTypes}
                            editable={true}
                            placeholder={Lang.get('global.type_place')}
                            labelClass='text-right'
                            selectedValue={this.state.type_place_id.toString()}
                        />

                    {/* CAPTEUR PLACE select */}
                        <InputSelectEditable
                            multi={false}
                            attributes={{
                                label: Lang.get('global.capteur'),
                                name: "capteur_id",
                                selectCol: 6,
                                labelCol: 3,
                                required: false
                            }}
                            data={this.state.selectCapteurs}
                            editable={true}
                            placeholder={Lang.get('global.capteur')}
                            labelClass='text-right'
                            selectedValue={capteur_id.toString()}
                        />

                    {/* LIBELLE input text */}
                        <InputTextEditable
                            attributes={{
                                label: Lang.get('global.libelle'),
                                name: "libelle",
                                value: this.props.dataItem.libelle,
                                required: false,
                                groupClassName: 'row',
                                wrapperClassName: 'col-md-6',
                                labelClassName: 'col-md-3 text-right'
                            }}
                            editable={true}
                            evts={{}} />
                    {/* BONNE checkbox */}
                        <Row>
                            <InputCheckboxEditable
                                key={'chk_bonne'}
                                attributes={{
                                    label: Lang.get('global.bonne'),
                                    name: "bonne[]",
                                    value: 'bonne',
                                    checked: (this.props.dataItem.bonne == "1"),
                                    htmlFor: 'form_mod_edit_place',
                                    groupClassName: 'col-md-6 col-md-offset-3'
                                }}
                                editable={true} />
                        </Row>
                    {/* CAPTEUR select */}

                    </Form>
                </div>

                <div className="modal-footer">
                    <Button
                        onClick={this.props.onToggle}>
                            {Lang.get('global.annuler')}
                    </Button>
                    <BtnSave
                        form_id="form_mod_edit_place"
                        libelle={Lang.get('global.create')} />
                </div>
            </Modal>
        );
    }
});

/**
 * Store qui gère les données des combobox
 */
var store = Reflux.createStore({
    _inst: {
        place_id: '',
        ajax_data: [],      // Les données brutes reçues en AJAX
        clearCapteurs: []   // La liste des capteurs sans place du parking
    },
    getInitialState: function () {
        return {};
    },
    // Initial setup
    init: function () {
        // REGISTER STATUSUPDATE ACTION
        this.listenTo(initModale, this.loadInitData); // Appellé à l'affichage de la modale
    },


    /**
     * Charge les données du réseau du parking en fonction de l'ID du parking
     * @param parkId : id du parking
     */
    loadInitData: function (parkId, place_id) {
        //console.log('PASS INIT DATA avec id : %o', parkId);
        this._inst.place_id = place_id;

        $.ajax({
            type: 'GET',
            url: BASE_URI + 'parking/' + parkId + '/concentrateurs',
            processData: false,
            contentType: false,
            data: {},
            context: this
        })
            .done(function (data) {
                this.handleAjaxResult(data);
            })
            .fail(function (xhr, type, exception) {
                // if ajax fails display error alert
                console.error("ajax error response error " + type);
                console.error("ajax error response body " + xhr.responseText);
            });
    },
    /**
     * Traite le retour de la requête AJAX ci-dessus
     * @param data
     */
    handleAjaxResult: function (data) {
        this._inst.ajax_data = data;

        var concentrateurs = data;
        var buses = [];
        var allCapteurs = [];
        var clearCapteurs = [];

        // I - PARCOURT DES CONCENTRATEURS POUR SORTIR TOUS LES BUSES
        _.each(concentrateurs, function (c) {
            _.each(c.buses, function (b) {
                _.each(b.capteurs, function (ca) {
                    if (ca.place == null || ca.place.id == this._inst.place_id) {
                        // Capteur à ajouter
                        clearCapteurs.push({
                            label: c.v4_id.toString() + '.' + b.num.toString() + '.' + ca.adresse.toString(),
                            value: ca.id.toString()
                        })
                    }
                }, this);
            }, this);
        }, this);

        this.trigger({
            selectCapteurs: clearCapteurs
        });

    }
});

module.exports = ModalEditPlace;
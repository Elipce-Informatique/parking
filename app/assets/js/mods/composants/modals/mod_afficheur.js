var React = require('react/addons');
/* Gestion de la modification et des droits */
var ComponentAccessMixins = require('../../mixins/component_access');
/* Pour le listenTo */
var MixinGestMod = require('../../mixins/gestion_modif');
var storeComboConfig = require('../../stores/store_combo_config_equipment');

// Actions Reflux locale à cette modale
var initModale = Reflux.createAction();

// COMPOSANTS
var Field = require('../formulaire/react_form_fields');
var formDataHeler = require('../../helpers/form_data_helper');
var Form = Field.Form;
var BtnSave = Field.BtnSave;
var InputNumberEditable = Field.InputNumberEditable;
var InputSelectEditable = Field.InputSelectEditable;
var InputTextEditable = Field.InputTextEditable;
var Modal = ReactB.Modal;
var Row = ReactB.Row;
var Col = ReactB.Col;
var Button = ReactB.Button;

/**
 * Created by yann on 12/03/2015.
 *
 * Modal pour configurer les afficheurs de places
 */
var ModalAfficheur = React.createClass({

    mixins: [Reflux.ListenerMixin, ComponentAccessMixins, MixinGestMod],

    propTypes: {
        onToggle: React.PropTypes.func.isRequired,
        parkingId: React.PropTypes.number.isRequired,
        planId: React.PropTypes.number.isRequired,
        drawData: React.PropTypes.object.isRequired
    },

    getDefaultProps: function () {
        return {
            module_url: 'configuration_parking'
        };
    },

    getInitialState: function () {
        return {
            listConcentrateurs: [],
            listBuses: [],
            listConfigs: [],
            concentrateur_id: '',
            bus_id: '',
            reference: '',
            manufacturer: '',
            model_name: '',
            serial_number: '',
            software_version: '',
            hardware_version: '',
            configs_ids: [],
            combo_config_name: ''
        };
    },
    componentWillMount: function () {
        this.listenTo(store, this.updateData);
        this.listenTo(storeComboConfig, this.updateData, this.updateData);

        initModale(this.props.parkingId, this.props.planId, this.props.drawData);
    },

    componentDidMount: function () {
    },

    shouldComponentUpdate: function (nextProps, nextState) {
        return true;
    },

    // Rien à faire dans la popup à priori
    onRetour: function () {

    },

    /**
     * Met à jour le state avec les données du store
     * @param data : données à ajouter au state
     */
    updateData: function (data) {
        this.setState(data);
    },

    render: function () {
        return (
            <Modal
                title={Lang.get('administration_parking.carte.titre_afficheur')}
                onHide={this.props.onToggle}>

                <div className="modal-body">
                    <Form attributes={{id: "form_mod_afficheur"}}>

                        <InputTextEditable
                            editable={true}
                            attributes={{
                                label: Lang.get('administration_parking.carte.reference'),
                                name: "reference",
                                placeholder: Lang.get('administration_parking.carte.reference'),
                                value: this.state.reference,
                                wrapperClassName: 'col-md-6',
                                labelClassName: 'col-md-4 text-right',
                                groupClassName: 'row',
                                required: true
                            }}
                        />

                        <InputSelectEditable
                            editable={true}
                            data={this.state.listConcentrateurs}
                            selectedValue={this.state.concentrateur_id}
                            placeholder={Lang.get('global.concentrateur')}
                            attributes={{
                                name: 'concentrateur_id',
                                label: Lang.get('global.concentrateur'),
                                labelCol: 4,
                                selectCol: 6,
                                htmlFor: 'form_mod_capteur',
                                required: true
                            }}
                            labelClass='text-right'
                        />

                        <InputSelectEditable
                            editable={true}
                            data={this.state.listBuses}
                            selectedValue={this.state.bus_id}
                            placeholder={Lang.get('global.bus')}
                            attributes={{
                                name: 'bus_id',
                                label: Lang.get('global.bus'),
                                labelCol: 4,
                                selectCol: 6,
                                htmlFor: 'form_mod_capteur',
                                required: true
                            }}
                            labelClass='text-right'
                        />

                        <InputSelectEditable
                            editable={true}
                            data={this.state.listConfigs}
                            selectedValue={this.state.configs_ids}
                            placeholder={Lang.get('global.config')}
                            multi={true}
                            attributes={{
                                name: this.state.combo_config_name,
                                label: Lang.get('global.config'),
                                labelCol: 4,
                                selectCol: 6,
                                htmlFor: 'form_mod_capteur',
                                required: true
                            }}
                            labelClass='text-right'
                        />

                        <InputTextEditable
                            editable={true}
                            attributes={{
                                label: Lang.get('administration_parking.carte.manufacturer'),
                                name: "manufacturer",
                                placeholder: Lang.get('administration_parking.carte.manufacturer'),
                                value: this.state.manufacturer,
                                wrapperClassName: 'col-md-6',
                                labelClassName: 'col-md-4 text-right',
                                groupClassName: 'row',
                                required: false
                            }}
                        />

                        <InputTextEditable
                            editable={true}
                            attributes={{
                                label: Lang.get('administration_parking.carte.model_name'),
                                name: "model_name",
                                placeholder: Lang.get('administration_parking.carte.model_name'),
                                value: this.state.model_name,
                                wrapperClassName: 'col-md-6',
                                labelClassName: 'col-md-4 text-right',
                                groupClassName: 'row',
                                required: false
                            }}
                        />

                        <InputTextEditable
                            editable={true}
                            attributes={{
                                label: Lang.get('administration_parking.carte.serial_number'),
                                name: "serial_number",
                                placeholder: Lang.get('administration_parking.carte.serial_number'),
                                value: this.state.serial_number,
                                wrapperClassName: 'col-md-6',
                                labelClassName: 'col-md-4 text-right',
                                groupClassName: 'row',
                                required: false
                            }}
                        />

                        <InputTextEditable
                            editable={true}
                            attributes={{
                                label: Lang.get('administration_parking.carte.software_version'),
                                name: "software_version",
                                placeholder: Lang.get('administration_parking.carte.software_version'),
                                value: this.state.software_version,
                                wrapperClassName: 'col-md-6',
                                labelClassName: 'col-md-4 text-right',
                                groupClassName: 'row',
                                required: false
                            }}
                        />

                        <InputTextEditable
                            editable={true}
                            attributes={{
                                label: Lang.get('administration_parking.carte.hardware_version'),
                                name: "hardware_version",
                                placeholder: Lang.get('administration_parking.carte.hardware_version'),
                                value: this.state.hardware_version,
                                wrapperClassName: 'col-md-6',
                                labelClassName: 'col-md-4 text-right',
                                groupClassName: 'row',
                                required: false
                            }}
                        />

                    </Form>
                </div>

                <div className="modal-footer">
                    <Button
                        onClick={this.props.onToggle}>
                            {Lang.get('global.annuler')}
                    </Button>
                    <BtnSave
                        form_id="form_mod_afficheur"
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
        ajax_data: [],      // Les données brutes reçues en AJAX
        concentrateurs: [], // La liste de tous les concentrateurs du parking
        buses: []           // La liste de tous les buses du parking
    },
    localState: {},
    getInitialState: function () {
        return {};
    },
    // Initial setup
    init: function () {
        // REGISTER STATUSUPDATE ACTION
        this.listenTo(Actions.validation.form_field_changed, this.updateForm);
        this.listenTo(Actions.validation.submit_form, this.onSubmit_form);
        this.listenTo(initModale, this.loadInitData); // Appellé à l'affichage de la modale

        this.listenTo(Actions.map.liste_concentrateurs, this.getConcentrateurCombo);
        this.listenTo(Actions.map.liste_buses, this.getBusCombo);
    },

    /**
     * Mise à jour des combos sur chaque action de l'utilisateur
     * passant les tests de vérification auto.
     * @param data
     */
    updateForm: function (data) {
        var dat = {};
        // MAJ du state STORE
        dat[data.name] = data.value;
        this.localState = _.extend(this.localState, dat);

        switch (data.name) {
            // Concentrateur selected
            case 'concentrateur_id':
                this.localState.bus_id = "";
                this.localState.listBuses = this.getBusCombo(data.value);
                this.trigger(this.localState);
                break;
            // Bus selected
            case 'bus_id':
                this.trigger(this.localState);
                break;
        }
    },

    initLocalState: function () {
        this.localState = {
            listConcentrateurs: [],
            listBuses: [],
            concentrateur_id: '',
            bus_id: '',
            reference: '',
            manufacturer: '',
            model_name: '',
            serial_number: '',
            software_version: '',
            hardware_version: ''
        };
    },
    /**
     * Charge les données du réseau du parking en fonction de l'ID du parking
     * @param parkId : id du parking
     */
    loadInitData: function (parkId) {
        this.initLocalState();

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
                var concentrateursData = this.getConcentrateurCombo();
                this.localState.listConcentrateurs = concentrateursData;
                this.trigger(this.localState);
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

        // I - PARCOURT DES CONCENTRATEURS POUR SORTIR TOUS LES BUSES
        _.each(concentrateurs, function (c) {
            Array.prototype.push.apply(buses, c.buses);
        });

        this._inst.concentrateurs = concentrateurs;
        this._inst.buses = buses;
    },

    /*****************************************************************************
     * UPDATE COMBOBOXES *********************************************************
     *****************************************************************************/

    /**
     * Retourne la liste des concentrateurs pour la combo
     *
     * @return retourne les données au format attendu par le composant select:
     * [
     *   {label:'Framboise', value:'0', ce que l'on veut...},
     *   {label:'Pomme', value:'1', ce que l'on veut...}
     * ]
     */
    getConcentrateurCombo: function () {
        return _.map(this._inst.concentrateurs, function (c) {
            return {
                label: c.v4_id,
                value: c.id.toString()
            };
        });
    },
    /**
     * Retourne la liste des buses pour la combo en fonction du concentrateur sélected
     *
     * @return retourne les données au format attendu par le composant select:
     * [
     *   {label:'Framboise', value:'0', ce que l'on veut...},
     *   {label:'Pomme', value:'1', ce que l'on veut...}
     * ]
     */
    getBusCombo: function (concentrateurId) {
        var buses = _.filter(this._inst.buses, function (b) {
            return b.concentrateur_id == concentrateurId;
        });
        return _.map(buses, function (b) {
            return {
                label: b.name.toString(),
                value: b.id.toString()
            }
        });

    },


    /**
     * Retourne le concentrateur en fonction de son id
     * @param concentrateurId : id du concentrateur
     */
    getConcentrateurFromId: function (concentrateurId) {
        return _.reduce(this._inst.concentrateurs, function (retour, c) {
            if (c.id == concentrateurId) {
                return c;
            } else {
                return retour;
            }
        }, null);
    },
    /**
     * Retourne le bus en fonction de son id
     * @param busId : id du bus
     */
    getBusFromId: function (busId) {
        return _.reduce(this._inst.buses, function (retour, b) {
            if (b.id == busId) {
                return b;
            } else {
                return retour;
            }
        }, null);
    }

});

module.exports = ModalAfficheur;
var React = require('react/addons');
/* Gestion de la modification et des droits */
var ComponentAccessMixins = require('../../mixins/component_access');
/* Pour le listenTo */
var MixinGestMod = require('../../mixins/gestion_modif');

// Actions Reflux locale à cette modale
var initModale = Reflux.createAction();

// COMPOSANTS
var Field = require('../formulaire/react_form_fields');
var formDataHeler = require('../../helpers/form_data_helper');
var Form = Field.Form;
var BtnSave = Field.BtnSave;
var InputNumberEditable = Field.InputNumberEditable;
var InputSelectEditable = Field.InputSelectEditable;
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
    },

    getDefaultProps: function () {
        return {
            module_url: 'configuration_parking'
        };
    },

    getInitialState: function () {
        return {
            listAfficheurs: [],
            afficheur_id: ''
        };
    },
    componentWillMount: function () {
        this.listenTo(store, this.updateData);
        initModale(this.props.parkingId, this.props.planId);
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
                    <Form attributes={{id: "form_mod_select_afficheur"}}>

                        <InputSelectEditable
                            editable={true}
                            data={this.state.combo}
                            selectedValue={this.state.afficheur_id}
                            placeholder={Lang.get('global.afficheur')}
                            attributes={{
                                name: 'afficheur_id',
                                label: Lang.get('global.afficheur'),
                                labelCol: 4,
                                selectCol: 6,
                                htmlFor: 'form_mod_afficheur',
                                required: true
                            }}
                            labelClass='text-right'
                        />
                    </Form>
                </div>

                <div className="modal-footer">
                    <Button
                        onClick={this.props.onToggle}>
                            {Lang.get('global.annuler')}
                    </Button>
                    <BtnSave
                        form_id="form_mod_select_afficheur"
                        libelle={Lang.get('global.associer')} />
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
        afficheurs: [],       // Les données brutes reçues en AJAX (liste des afficheurs)
        comboAfficheurs: [],
        planId: '',
        parkingId: ''
    },
    getInitialState: function () {
        return {};
    },
    // Initial setup
    init: function () {
        // REGISTER STATUSUPDATE ACTION
        this.listenTo(Actions.validation.form_field_changed, this.updateCombos);
        this.listenTo(initModale, this.loadInitData); // Appellé à l'affichage de la modale
    },

    /**
     * Mise à jour des combos sur chaque action de l'utilisateur
     * passant les tests de vérification auto.
     * @param data
     */
    updateCombos: function (data) {
        if (data.name == "afficheur_id") {
            var retour = {afficheur_id: data.value};
            this.trigger(retour);
        }
    },
    /**
     * Charge les données du réseau du parking en fonction de l'ID du parking
     * @param parkId : id du parking
     */
    loadInitData: function (parkId, planId) {
        this._inst.parkingId = parkId;
        this._inst.planId = planId;

        $.ajax({
            type: 'GET',
            url: BASE_URI + 'parking/' + parkId + '/afficheurs_libres',
            processData: false,
            contentType: false,
            data: {},
            context: this
        })
            .done(function (data) {
                this._inst.afficheurs = data;
                this._inst.comboAfficheurs = this.getComboAfficheurs(data);
                this.trigger({combo: this._inst.comboAfficheurs});
            })
            .fail(function (xhr, type, exception) {
                // if ajax fails display error alert
                console.error("ajax error response error " + type);
                console.error("ajax error response body " + xhr.responseText);
            });
    },

    /*****************************************************************************
     * UPDATE COMBOBOXES *********************************************************
     *****************************************************************************/
    getComboAfficheurs: function (data) {
        var combo = _.map(data, function (d) {
            return {
                label: d.reference,
                value: d.id.toString()
            };
        });


        return combo
    }

});

module.exports = ModalAfficheur;
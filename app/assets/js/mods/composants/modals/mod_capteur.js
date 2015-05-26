var React = require('react/addons');
/* Gestion de la modification et des droits */
var ComponentAccessMixins = require('../../mixins/component_access');
/* Pour le listenTo */
var MixinGestMod = require('../../mixins/gestion_modif');

var Field = require('../formulaire/react_form_fields');
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
 * Modal pour configurer les capteurs de places
 */
var ModalCapteur = React.createClass({

    mixins: [Reflux.ListenerMixin, ComponentAccessMixins, MixinGestMod],

    propTypes: {
        onToggle: React.PropTypes.func.isRequired,
        parkingId: React.PropTypes.number.isRequired
    },

    getDefaultProps: function () {
        return {
            module_url: 'configuration_parking'
        };
    },

    getInitialState: function () {
        return {};
    },
    componentWillMount: function () {
        this.listenTo(store, this.updateData);
        Actions.map.liste_concentrateurs(this.props.parkingId);

    },

    componentDidMount: function () {
    },

    shouldComponentUpdate: function (nextProps, nextState) {
        return true;
    },

    // Rien à faire dans la popup à priori
    onRetour: function () {

    },

    updateData: function (data) {
        this.setState(data);
    },

    render: function () {
        return (
            <Modal
                bsStyle="primary"
                title={Lang.get('administration_parking.carte.titre_capteur')}
                onRequestHide={this.props.onToggle}>

                <div className="modal-body">
                    <Form attributes={{id: "form_mod_capteur"}}>
                        <InputSelectEditable
                            editable={true}
                            data={[]}
                            selectedValue=''
                            placeholder={Lang.get('global.concentrateur')}
                            attributes={{
                                name: 'concentrateur_id',
                                label: Lang.get('global.concentrateur'),
                                labelCol: 4,
                                selectCol: 6,
                                htmlFor: 'form_mod_capteur'
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
                        form_id="form_mod_calibre"
                        libelle={Lang.get('global.create')} />
                </div>
            </Modal>
        );
    }
});

var store = Reflux.createStore({
    getInitialState: function () {
        return {};
    },
    // Initial setup
    init: function () {
        // REGISTER STATUSUPDATE ACTION
        this.listenTo(Actions.validation.form_field_verif, this.updateCombos);
        this.listenTo(Actions.map.liste_concentrateurs, this.listeConcentrateurs);
    },
    /**
     * Mise à jour des combos sur chaque action de l'utilisateur
     * passant les tests de vérification auto.
     * @param data
     */
    updateCombos: function (data) {
        console.log('UpdateCombos data : %o', data);
    },
    /**
     * Charge les données de la combo des concentrateurs en fonction de l'ID du parking
     * @param parkId : id du parking
     */
    listeConcentrateurs: function (parkId) {
        console.log('PASS liste concentrateurs avec id : %o', parkId);

    }
});

module.exports = ModalCapteur;
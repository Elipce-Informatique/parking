var React = require('react/addons');
/* Gestion de la modification */
/* Pour le listenTo */
var MixinGestMod = require('../../mixins/gestion_modif');

var Field = require('../formulaire/react_form_fields');
var Form = Field.Form;
var BtnSave = Field.BtnSave;
var InputSelectEditable = Field.InputSelectEditable;
var Modal = ReactB.Modal;
var Row = ReactB.Row;
var Col = ReactB.Col;
var Button = ReactB.Button;

/**
 * Created by yann on 09/06/2015.
 *
 * Modal pour configurer les préférences d'un bloc de supervision
 */
var ModalPreferences = React.createClass({

    mixins: [Reflux.ListenerMixin, MixinGestMod],

    propTypes: {
        onToggle: React.PropTypes.func.isRequired,
        bloc: React.PropTypes.string.isRequired,
        titre: React.PropTypes.string.isRequired,
        dataCombo: React.PropTypes.array.isRequired,
        initialSelectedIds: React.PropTypes.array.isRequired
    },

    getDefaultProps: function () {
        return {};
    },

    getInitialState: function () {
        return {combo_types: []};
    },

    componentDidMount: function () {
        this.listenTo(store, this.updateState);
        this.setState({combo_types: this.props.initialSelectedIds});
    },

    shouldComponentUpdate: function (nextProps, nextState) {
        return true;
    },

    // Rien à faire dans la popup à priori
    onRetour: function () {

    },

    updateState: function (ns) {
        this.setState(ns);
    },

    render: function () {
        return (
            <Modal
                bsStyle="primary"
                title={this.props.titre}
                onRequestHide={this.props.onToggle}>

                <div className="modal-body">
                    <Form attributes={{id: "form_mod_prefs"}}>
                        <InputSelectEditable
                            editable={true}
                            data={this.props.dataCombo}
                            selectedValue={this.state.combo_types}
                            multi={true}
                            attributes={{
                                name: 'combo_types',
                                label: Lang.get('supervision.tab_bord.type_place'),
                                labelCol: 3,
                                selectCol: 9
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
                        form_id="form_mod_prefs"
                        libelle={Lang.get('global.edit')} />
                </div>
            </Modal>
        );
    }
});

module.exports = ModalPreferences;

/**
 * Gère la combo des types de places
 */
var store = Reflux.createStore({
    stateLocal: {},
    getInitialState: function () {
        return {};
    },
    // Initial setup
    init: function () {
        this.stateLocal = {};
        // Register statusUpdate action
        this.listenTo(Actions.validation.form_field_changed, this.onForm_field_changed);
    },

    /**
     * onChange de n'importe quel élément du FORM
     * @param e: evt
     */
    onForm_field_changed: function (e) {
        var data = {};
        // MAJ du state STORE
        data[e.name] = e.value;
        this.stateLocal = _.extend(this.stateLocal, data);

        // Si on est sur une combo on trigger pour les selectedValue
        if (e.name == 'combo_types') {
            this.trigger(this.stateLocal);
        }
    }
});
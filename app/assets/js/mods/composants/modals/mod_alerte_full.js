var React = require('react/addons');
// Gestion des modifications et des droits
var ComponentAccessMixins = require('../../mixins/component_access');
var MixinGestMod = require('../../mixins/gestion_modif');

var Field = require('../formulaire/react_form_fields');
var Form = Field.Form;
var BtnSave = Field.BtnSave;
var InputTextEditable = Field.InputTextEditable;
var Modal = ReactB.Modal;
var Row = ReactB.Row;
var Col = ReactB.Col;
var Button = ReactB.Button;

/**
 *
 * Modal pour configurer l'alerte de type "full"
 */
var ModalAlerte = React.createClass({

    mixins: [Reflux.ListenerMixin, ComponentAccessMixins, MixinGestMod],

    propTypes: {
        onToggle: React.PropTypes.func.isRequired
    },

    getDefaultProps: function () {
        return {
            module_url: 'alerte'
        };
    },

    getInitialState: function () {
        return {};
    },

    componentDidMount: function () {
    },

    shouldComponentUpdate: function (nextProps, nextState) {
        return true;
    },

    // Rien à faire dans la popup à priori
    onRetour: function () {

    },

    render: function () {
        return (
            <Modal
                bsStyle="primary"
                title={Lang.get('supervision.alerte.full')}
                onRequestHide={this.props.onToggle}>

                <div className="modal-body">
                    <Form attributes={{id: "form_alerte_full"}}>
                        <InputTextEditable
                            attributes={
                            {
                                label: Lang.get('global.nom'),
                                name: "libelle",
                                required: true,
                                groupClassName: 'row',
                                wrapperClassName: 'col-md-9',
                                labelClassName: 'col-md-3 text-right'
                            }}
                            editable={true}
                            evts={{}} />

                        <InputTextEditable
                            attributes={
                            {
                                label: Lang.get('global.message'),
                                name: "message",
                                required: true,
                                groupClassName: 'row',
                                wrapperClassName: 'col-md-9',
                                labelClassName: 'col-md-3 text-right'
                            }}
                            area = {true}
                            editable={true}
                            evts={{}} />
                    </Form>
                </div>

                <div className="modal-footer">
                    <Button
                        onClick={this.props.onToggle}>
                            {Lang.get('global.annuler')}
                    </Button>
                    <BtnSave
                        form_id="form_alerte_full"
                        libelle={Lang.get('global.create')} />
                </div>
            </Modal>
        );
    }
});

module.exports = ModalAlerte;
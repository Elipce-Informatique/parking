var React = require('react/addons');
/* Gestion de la modification et des droits */
var ComponentAccessMixins = require('../../mixins/component_access');
/* Pour le listenTo */
var MixinGestMod = require('../../mixins/gestion_modif');

var Field = require('../formulaire/react_form_fields');
var Form = Field.Form;
var BtnSave = Field.BtnSave;
var InputNumberEditable = Field.InputNumberEditable;
var Modal = ReactB.Modal;
var Row = ReactB.Row;
var Col = ReactB.Col;
var Button = ReactB.Button;

/**
 * Created by yann on 12/03/2015.
 *
 * Modal pour configurer le calibre
 */
var ModalCalibre = React.createClass({

    mixins: [Reflux.ListenerMixin, ComponentAccessMixins, MixinGestMod],

    propTypes: {
        onToggle: React.PropTypes.func.isRequired
    },

    getDefaultProps: function () {
        return {
            module_url: 'configuration_parking'
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
                title={Lang.get('administration_parking.carte.titre_calibre')}
                onRequestHide={this.props.onToggle}>

                <div className="modal-body">
                    <Form attributes={{id: "form_mod_calibre"}}>
                        <InputNumberEditable
                            attributes={
                            {
                                label: Lang.get('administration_parking.carte.field_calibre'),
                                name: "calibre",
                                value: 100,
                                required: false,
                                groupClassName: 'row',
                                wrapperClassName: 'col-md-9',
                                labelClassName: 'col-md-3 text-right'

                            }}
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
                        form_id="form_mod_calibre"
                        libelle={Lang.get('global.create')} />
                </div>
            </Modal>
        );
    }
});

module.exports = ModalCalibre;
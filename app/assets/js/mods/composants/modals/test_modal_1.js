/* Gestion de la modification et des droits */
var React = require('react/addons');
var ComponentAccessMixins = require('../../mixins/component_access');
/* Pour le listenTo */
var MixinGestMod = require('../../mixins/gestion_modif');

var Field = require('../formulaire/react_form_fields');
var Form = Field.Form;
var InputTextEditable = Field.InputTextEditable;
var InputNumberEditable = Field.InputNumberEditable;
var ButtonSave = require('../formulaire/react_btn_save');
var Modal = ReactB.Modal;
var Button = ReactB.Button;

/**
 * Created by yann on 12/03/2015.
 *
 * Modal pour créer un groupe de places
 */
var ModalUn = React.createClass({

    mixins: [MixinGestMod, Reflux.ListenerMixin],

    propTypes: {
        onToggle: React.PropTypes.func.isRequired
    },

    getDefaultProps: function () {
        return {module_url: 'test'};
    },

    getInitialState: function () {
        return {};
    },

    componentDidMount: function () {

    },

    shouldComponentUpdate: function (nextProps, nextState) {
        return true;
    },

    onRetour: function () {

    },

    render: function () {
        return (
            <Modal bsStyle="primary" title="Modal heading" onHide={this.props.onToggle}>
                <div className="modal-body">
                    <Form attributes={{id: "form_modal_test_1"}}>

                        <InputNumberEditable
                            attributes={
                            {
                                label: "Ceci est un chiffre",
                                min: '0',
                                name: "nb_place",
                                value: this.state.nom,
                                required: false,
                                groupClassName: 'row',
                                wrapperClassName: 'col-md-4',
                                labelClassName: 'col-md-4 text-right'
                            }}
                            editable={true}
                            evts={{}} />
                    </Form>
                </div>
                <div className="modal-footer">
                    <Button onClick={this.props.onToggle}>{Lang.get('global.annuler')}</Button>
                    <ButtonSave
                        form_id="form_modal_test_1"
                        libelle="Save"
                    />
                </div>
            </Modal>
        );
    }
});

module.exports = ModalUn;
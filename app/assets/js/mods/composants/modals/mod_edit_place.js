var React = require('react/addons');
/* Gestion de la modification et des droits */
var ComponentAccessMixins = require('../../mixins/component_access');
/* Pour le listenTo */
var MixinGestMod = require('../../mixins/gestion_modif');

var Field = require('../formulaire/react_form_fields');
var Form = Field.Form;
var BtnSave = Field.BtnSave;
var InputTextEditable = Field.InputTextEditable;
var InputNumberEditable = Field.InputNumberEditable;
var InputCheckboxEditable = Field.InputCheckboxEditable;
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
        dataItem: React.PropTypes.object.isRequired
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
        console.log('Props de la modale : %o', this.props);
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
                title={Lang.get('administration_parking.carte.titre_edit_place')}
                onRequestHide={this.props.onToggle}>

                <div className="modal-body">
                    <Form attributes={{id: "form_mod_edit_place"}}>
                    {/* TYPE PLACE select */}

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
                                    label: 'TEST',
                                    name: "bonne[]",
                                    value: 'bonne',
                                    checked: false,
                                    htmlFor: 'form_mod_edit_place',
                                    groupClassName: 'col-md-2 col-md-offset-3'
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

module.exports = ModalEditPlace;
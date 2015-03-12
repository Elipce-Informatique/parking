/* Gestion de la modification et des droits */
var AuthentMixins = require('../../mixins/component_access');
/* Pour le listenTo */
var MixinGestMod = require('../../mixins/gestion_modif');

var Field = require('../formulaire/react_form_fields');
var InputTextEditable = Field.InputTextEditable;
var InputNumberEditable = Field.InputNumberEditable;
var Modal = ReactB.Modal;
var Button = ReactB.Button;

/**
 * Created by yann on 12/03/2015.
 *
 * Modal pour créer un groupe de places
 */
var ModalPlaces = React.createClass({

    mixins: [AuthentMixins, MixinGestMod],

    propTypes: {
        onToggle: React.PropTypes.func.isRequired,
        onSave: React.PropTypes.func.isRequired
    },

    getDefaultProps: function () {
        return {};
    },

    getInitialState: function () {
        return {};
    },

    componentDidMount: function () {

    },

    shouldComponentUpdate: function (nextProps, nextState) {
        return true;
    },

    render: function () {
        return (
            <Modal bsStyle="primary" title="Modal heading" onRequestHide={this.props.onToggle}>
                <div className="modal-body">

                    <InputNumberEditable
                        attributes={
                        {
                            label: Lang.get('administration_parking.carte.nb_places'),
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

                </div>
                <div className="modal-footer">
                    <Button onClick={this.props.onToggle}>{Lang.get('global.annuler')}</Button>
                </div>
            </Modal>
        );
    }
});

module.exports = ModalPlaces;
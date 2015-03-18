/* Gestion de la modification et des droits */
var React = require('react/addons');
var ComponentAccessMixins = require('../../mixins/component_access');
/* Pour le listenTo */
var MixinGestMod = require('../../mixins/gestion_modif');

var Field = require('../formulaire/react_form_fields');
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
var Modal2 = React.createClass({

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
            <Modal bsStyle="primary" title="Modal heading" onRequestHide={this.props.onToggle}>
                <div className="modal-body">

                    // NOMBRE DE PLACES
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

                    // NOMBRE DE POTEAUX
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

                    // TAILLE DES POTEAUX
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

                    //
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
                    <ButtonSave
                        form_id=""
                        libelle="Save"
                    />
                </div>
            </Modal>
        );
    }
});

module.exports = Modal2;
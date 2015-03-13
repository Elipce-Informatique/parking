/* Gestion de la modification et des droits */
var ComponentAccessMixins = require('../../mixins/component_access');
/* Pour le listenTo */
var MixinGestMod = require('../../mixins/gestion_modif');

var Field = require('../formulaire/react_form_fields');
var Form = require('../formulaire/react_form_fields');
var InputTextEditable = Field.InputTextEditable;
var InputNumberEditable = Field.InputNumberEditable;
var Modal = ReactB.Modal;
var Row = ReactB.Row;
var Col = ReactB.Col;
var Button = ReactB.Button;

/**
 * Created by yann on 12/03/2015.
 *
 * Modal pour créer un groupe de places
 */
var ModalPlaces = React.createClass({

    mixins: [ComponentAccessMixins, MixinGestMod],

    propTypes: {
        onToggle: React.PropTypes.func.isRequired,
        onSave: React.PropTypes.func.isRequired
    },

    getDefaultProps: function () {
        return {module_url: 'configuration_parking'};
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


                    {/***********************************************************************/}
                    {/* NB PLACES */}
                    <InputNumberEditable
                        attributes={
                        {
                            label: Lang.get('administration_parking.carte.nb_places'),
                            min: '0',
                            name: "nb_place",
                            value: this.state.nom,
                            required: false,
                            groupClassName: 'row',
                            wrapperClassName: 'col-md-3',
                            labelClassName: 'col-md-6 text-right'
                        }}
                        editable={true}
                        evts={{}} />

                    {/* NB POTEAUX */}
                    <InputNumberEditable
                        attributes={
                        {
                            label: Lang.get('administration_parking.carte.nb_poteaux'),
                            min: '0',
                            name: "nb_place",
                            value: this.state.nom,
                            required: false,
                            groupClassName: 'row',
                            wrapperClassName: 'col-md-3',
                            labelClassName: 'col-md-6 text-right'
                        }}
                        editable={true}
                        evts={{}} />

                    {/* TAILLE POTEAUX */}
                    <InputNumberEditable
                        attributes={
                        {
                            label: Lang.get('administration_parking.carte.largeur_poteaux'),
                            min: '0',
                            name: "nb_place",
                            value: this.state.nom,
                            required: false,
                            groupClassName: 'row',
                            wrapperClassName: 'col-md-3',
                            labelClassName: 'col-md-6 text-right'
                        }}
                        editable={true}
                        evts={{}} />

                    {/***********************************************************************/}
                    <Row>
                    {/* PRÉFIXE */}
                        <Col md={4}>
                            <Row>
                                <InputTextEditable
                                    attributes={
                                    {
                                        label: Lang.get('administration_parking.carte.pref'),
                                        name: "nb_place",
                                        value: this.state.nom,
                                        required: false,
                                        groupClassName: '',
                                        wrapperClassName: 'col-md-9',
                                        labelClassName: 'col-md-3 text-right'
                                    }}
                                    editable={true}
                                    evts={{}} />
                            </Row>
                        </Col>

                    {/* INCREMENT */}
                        <Col md={4}>
                            <Row>
                                <InputNumberEditable
                                    attributes={
                                    {
                                        label: Lang.get('administration_parking.carte.incr'),
                                        min: '0',
                                        name: "nb_place",
                                        value: this.state.nom,
                                        required: false,
                                        groupClassName: '',
                                        wrapperClassName: 'col-md-9',
                                        labelClassName: 'col-md-3 text-right'
                                    }}
                                    editable={true}
                                    evts={{}} />
                            </Row>
                        </Col>

                    {/* SUFFIXE */}
                        <Col md={4}>
                            <Row>
                                <InputTextEditable
                                    attributes={
                                    {
                                        label: Lang.get('administration_parking.carte.suff'),
                                        name: "nb_place",
                                        value: this.state.nom,
                                        required: false,
                                        groupClassName: '',
                                        wrapperClassName: 'col-md-9',
                                        labelClassName: 'col-md-3 text-right'
                                    }}
                                    editable={true}
                                    evts={{}} />
                            </Row>
                        </Col>
                    </Row>
                {/***********************************************************************/}

                </div>
                <div className="modal-footer">
                    <Button onClick={this.props.onToggle}>{Lang.get('global.annuler')}</Button>
                    <Button bsStyle="success" onClick={this.props.onToggle}>{Lang.get('global.sauvegarder')}</Button>
                </div>
            </Modal>
        );
    }
});

module.exports = ModalPlaces;
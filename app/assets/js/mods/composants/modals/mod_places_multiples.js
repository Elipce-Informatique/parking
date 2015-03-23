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

    mixins: [Reflux.ListenerMixin, ComponentAccessMixins, MixinGestMod],

    propTypes: {
        onToggle: React.PropTypes.func.isRequired,
        calibre: React.PropTypes.number
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
                title={Lang.get('administration_parking.carte.titre_places_multiples')}
                onRequestHide={this.props.onToggle}>

                <div className="modal-body">
                    <Form attributes={{id: "form_mod_places_multiples"}}>
                    {/***********************************************************************/}
                    {/* NB PLACES */}
                        <InputNumberEditable
                            attributes={
                            {
                                label: Lang.get('administration_parking.carte.nb_places'),
                                min: '0',
                                name: "nb_place",
                                value: '3',
                                required: false,
                                groupClassName: 'row',
                                wrapperClassName: 'col-md-3',
                                labelClassName: 'col-md-6 text-right'
                            }}
                            editable={true}
                            evts={{}} />

                    {/* INTERVALLE POTEAUX */}
                        <InputNumberEditable
                            attributes={
                            {
                                label: Lang.get('administration_parking.carte.intervalle_poteaux'),
                                min: '0',
                                name: "nb_poteaux",
                                value: '1',
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
                                name: "taille_poteaux",
                                value: '1',
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
                                <InputTextEditable
                                    attributes={
                                    {
                                        label: Lang.get('administration_parking.carte.pref'),
                                        name: "prefixe",
                                        value: 'A',
                                        required: false,
                                        groupClassName: 'row',
                                        wrapperClassName: 'col-md-9',
                                        labelClassName: 'col-md-3 text-right'
                                    }}
                                    editable={true}
                                    evts={{}} />
                            </Col>

                    {/* INCREMENT */}
                            <Col md={4}>
                                <InputNumberEditable
                                    attributes={
                                    {
                                        label: Lang.get('administration_parking.carte.incr'),
                                        min: '0',
                                        name: "increment",
                                        value: 1,
                                        required: false,
                                        groupClassName: 'row',
                                        wrapperClassName: 'col-md-9',
                                        labelClassName: 'col-md-3 text-right'
                                    }}
                                    editable={true}
                                    evts={{}} />
                            </Col>

                    {/* SUFFIXE */}
                            <Col md={4}>
                                <InputTextEditable
                                    attributes={
                                    {
                                        label: Lang.get('administration_parking.carte.suff'),
                                        name: "suffixe",
                                        value: 'S1',
                                        required: false,
                                        groupClassName: 'row',
                                        wrapperClassName: 'col-md-9',
                                        labelClassName: 'col-md-3 text-right'
                                    }}
                                    editable={true}
                                    evts={{}} />
                            </Col>
                        </Row>
                {/***********************************************************************/}
                    </Form>
                </div>

                <div className="modal-footer">
                    <Button
                        onClick={this.props.onToggle}>
                            {Lang.get('global.annuler')}
                    </Button>
                    <BtnSave
                        form_id="form_mod_places_multiples"
                        libelle={Lang.get('global.create')} />
                </div>
            </Modal>
        );
    }
});

module.exports = ModalPlaces;
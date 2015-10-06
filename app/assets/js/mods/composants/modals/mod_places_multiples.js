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

var modalInit = Reflux.createAction();

/**
 * Created by yann on 12/03/2015.
 *
 * Modal pour créer un groupe de places
 */
var ModalPlaces = React.createClass({

    mixins: [Reflux.ListenerMixin, ComponentAccessMixins, MixinGestMod],

    propTypes: {
        onToggle: React.PropTypes.func.isRequired,
        numPlace: React.PropTypes.string.isRequired
    },

    getInitialState: function () {
        return {
            module_url: 'configuration_parking',
            nb_place: '',
            nb_poteaux: '',
            taille_poteaux: '',
            prefixe: '',
            num_initial: '',
            suffixe: '',
            increment: ''
        };
    },

    componentWillMount: function () {
        console.log('Pass listenTo');
        this.listenTo(store, this.updateState);
        modalInit(this.props.numPlace);
    },

    shouldComponentUpdate: function (nextProps, nextState) {
        return true;
    },

    updateState: function (state) {
        this.setState(state);
    },

    // Rien à faire dans la popup à priori
    onRetour: function () {

    },

    render: function () {
        return (
            <Modal
                bsStyle="primary"
                title={Lang.get('administration_parking.carte.titre_places_multiples')}
                onHide={this.props.onToggle}>

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
                                value: this.state.nb_place,
                                required: true,
                                groupClassName: 'row',
                                wrapperClassName: 'col-md-4',
                                labelClassName: 'col-md-5 text-right'
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
                                value: this.state.nb_poteaux,
                                required: true,
                                groupClassName: 'row',
                                wrapperClassName: 'col-md-4',
                                labelClassName: 'col-md-5 text-right'
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
                                value: this.state.taille_poteaux,
                                required: true,
                                groupClassName: 'row',
                                wrapperClassName: 'col-md-4',
                                labelClassName: 'col-md-5 text-right'
                            }}
                            editable={true}
                            evts={{}} />

                    {/***********************************************************************/}
                        <Row>
                    {/* PRÉFIXE */}
                            <Col md={3}>
                                <InputTextEditable
                                    attributes={
                                    {
                                        label: Lang.get('administration_parking.carte.pref'),
                                        name: "prefixe",
                                        value: this.state.prefixe,
                                        required: false,
                                        groupClassName: 'row',
                                        wrapperClassName: 'col-md-9',
                                        labelClassName: 'col-md-3 text-right'
                                    }}
                                    editable={true}
                                    evts={{}} />
                            </Col>

                    {/* NUMERO DE DEPART */}
                            <Col md={6}>
                                <InputNumberEditable
                                    attributes={
                                    {
                                        label: Lang.get('administration_parking.carte.num_initial'),
                                        min: '0',
                                        name: "num_initial",
                                        value: this.state.num_initial,
                                        required: true,
                                        groupClassName: 'row',
                                        wrapperClassName: 'col-md-9',
                                        labelClassName: 'col-md-3 text-right'
                                    }}
                                    editable={true}
                                    evts={{}} />
                            </Col>

                    {/* SUFFIXE */}
                            <Col md={3}>
                                <InputTextEditable
                                    attributes={
                                    {
                                        label: Lang.get('administration_parking.carte.suff'),
                                        name: "suffixe",
                                        value: this.state.suffixe,
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
                    {/* INCREMENT */}
                        <Row>
                            <Col md={4} mdOffset={4}>
                                <InputNumberEditable
                                    attributes={
                                    {
                                        label: Lang.get('administration_parking.carte.incr'),
                                        min: '1',
                                        name: "increment",
                                        value: this.state.increment,
                                        required: true,
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

var store = Reflux.createStore({
    localState: {
        nb_place: '',
        nb_poteaux: '',
        taille_poteaux: '',
        prefixe: '',
        num_initial: '',
        suffixe: '',
        increment: '1'
    },
    getInitialState: function () {
        return {};
    },
    // Initial setup
    init: function () {
        // Register statusUpdate action
        this.listenTo(modalInit, this.initState);
        this.listenTo(Actions.validation.form_field_changed, this.onForm_field_changed);
    },
    initState: function (numPlace) {
        this.localState.num_initial = numPlace;
        this.trigger(this.localState);
    },

    onForm_field_changed: function (data) {
        var dat = {};
        // MAJ du state STORE
        dat[data.name] = data.value;
        this.localState = _.extend(this.localState, dat);
        this.trigger(this.localState);
    }
});

module.exports = ModalPlaces;
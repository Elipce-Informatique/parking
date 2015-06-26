var React = require('react/addons');
/* Gestion de la modification et des droits */
var ComponentAccessMixins = require('../../mixins/component_access');
/* Pour le listenTo */
var MixinGestMod = require('../../mixins/gestion_modif');

var Field = require('../formulaire/react_form_fields');
var Form = Field.Form;
var BtnSave = Field.BtnSave;
var InputNumberEditable = Field.InputNumberEditable;
var InputSelectEditable = Field.InputSelectEditable;
var Modal = ReactB.Modal;
var Row = ReactB.Row;
var Col = ReactB.Col;
var Button = ReactB.Button;

/**
 * Created by yann on 12/03/2015.
 *
 * Modal pour configurer les afficheurs de places
 */
var ModalAfficheur = React.createClass({

    mixins: [Reflux.ListenerMixin, ComponentAccessMixins, MixinGestMod],

    propTypes: {
        onToggle: React.PropTypes.func.isRequired,
        parkingId: React.PropTypes.number.isRequired
    },

    getDefaultProps: function () {
        return {
            module_url: 'configuration_parking'
        };
    },

    getInitialState: function () {
        return {
            listAfficheurs: [],
            afficheur_id: ''
        };
    },
    componentWillMount: function () {
        this.listenTo(store, this.updateData);
        Actions.map.init_modale(this.props.parkingId);

    },

    componentDidMount: function () {
    },

    shouldComponentUpdate: function (nextProps, nextState) {
        return true;
    },

    // Rien à faire dans la popup à priori
    onRetour: function () {

    },

    /**
     * Met à jour le state avec les données du store
     * @param data : données à ajouter au state
     */
    updateData: function (data) {
        this.setState(data);
    },

    render: function () {
        return (
            <Modal
                title={Lang.get('administration_parking.carte.titre_afficheur')}
                onRequestHide={this.props.onToggle}>

                <div className="modal-body">
                    <Form attributes={{id: "form_mod_afficheur"}}>

                        <InputSelectEditable
                            editable={true}
                            data={this.state.listAfficheurs}
                            selectedValue={this.state.afficheur_id}
                            placeholder={Lang.get('global.afficheur')}
                            attributes={{
                                name: 'afficheur_id',
                                label: Lang.get('global.afficheur'),
                                labelCol: 4,
                                selectCol: 6,
                                htmlFor: 'form_mod_afficheur',
                                required: true
                            }}
                            labelClass='text-right'
                        />
                    </Form>
                </div>

                <div className="modal-footer">
                    <Button
                        onClick={this.props.onToggle}>
                            {Lang.get('global.annuler')}
                    </Button>
                    <BtnSave
                        form_id="form_mod_afficheur"
                        libelle={Lang.get('global.create')} />
                </div>
            </Modal>
        );
    }
});

/**
 * Store qui gère les données des combobox
 */
var store = Reflux.createStore({
    _inst: {
        dataAjax: []       // Les données brutes reçues en AJAX (liste des afficheurs)
    },
    getInitialState: function () {
        return {};
    },
    // Initial setup
    init: function () {
        // REGISTER STATUSUPDATE ACTION
        this.listenTo(Actions.validation.form_field_changed, this.updateCombos);
        this.listenTo(Actions.validation.submit_form, this.onSubmit_form);
        this.listenTo(Actions.map.init_modale, this.loadInitData); // Appellé à l'affichage de la modale
    },

    /**
     * Appellée quand un formulaire a été validé syntaxiquement et métierment parlent.
     * @param formDom : noeud racine contenant le formulaire
     * @param formId : id du formulaire
     */
    onSubmit_form: function (formDom, formId) {
        // OBLIGÉ DE TRAITER ÇA ICI PLUTOT QUE DANS LE STORE DE LA MAP
        // POUR AVOIR ACCÈS AUX DONNÉES DES AFFICHEURS.
        switch (formId) {
            case "form_mod_afficheur":
                this.handleAfficheur(formDom);
                break;
        }
    },

    /**
     * Gère la validation de la modale afficheurs.
     * - Remplis le cadre d'infos de la carte
     *
     * @param formDom : le DOM du formulaire
     */
    handleAfficheur: function (formDom) {
        // TODO traiter le form de la modale
    },

    /**
     * Mise à jour des combos sur chaque action de l'utilisateur
     * passant les tests de vérification auto.
     * @param data
     */
    updateCombos: function (data) {
        var retour = {};

        this.trigger(retour);
    },
    /**
     * Charge les données du réseau du parking en fonction de l'ID du parking
     * @param parkId : id du parking
     */
    loadInitData: function (parkId) {

        $.ajax({
            type: 'GET',
            url: BASE_URI + 'parking/' + parkId + '/afficheurs',
            processData: false,
            contentType: false,
            data: {},
            context: this
        })
            .done(function (data) {
                console.log('Data init chargées : %o', data);
            })
            .fail(function (xhr, type, exception) {
                // if ajax fails display error alert
                console.error("ajax error response error " + type);
                console.error("ajax error response body " + xhr.responseText);
            });
    },

    /*****************************************************************************
     * UPDATE COMBOBOXES *********************************************************
     *****************************************************************************/

    /**
     *
     */
    getComboAfficheurs: function () {

    }


});

module.exports = ModalAfficheur;
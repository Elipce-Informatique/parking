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
 * Modal pour configurer les capteurs de places
 */
var ModalCapteur = React.createClass({

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
            listConcentrateurs: [],
            listBus: [],
            listAdress: []
        };
    },
    componentWillMount: function () {
        this.listenTo(store, this.updateData);
        Actions.map.liste_concentrateurs(this.props.parkingId);

    },

    componentDidMount: function () {
    },

    shouldComponentUpdate: function (nextProps, nextState) {
        return true;
    },

    // Rien à faire dans la popup à priori
    onRetour: function () {

    },

    updateData: function (data) {
        console.log('COMPOSANT MODALE update data : %o', data);
        this.setState(data);
    },

    render: function () {
        return (
            <Modal
                bsStyle="primary"
                title={Lang.get('administration_parking.carte.titre_capteur')}
                onRequestHide={this.props.onToggle}>

                <div className="modal-body">
                    <Form attributes={{id: "form_mod_capteur"}}>

                        <InputSelectEditable
                            editable={true}
                            data={this.state.listConcentrateurs}
                            selectedValue=''
                            placeholder={Lang.get('global.concentrateur')}
                            attributes={{
                                name: 'concentrateur_id',
                                label: Lang.get('global.concentrateur'),
                                labelCol: 4,
                                selectCol: 6,
                                htmlFor: 'form_mod_capteur',
                                required: true
                            }}
                            labelClass='text-right'
                        />

                        <InputSelectEditable
                            editable={true}
                            data={this.state.listConcentrateurs}
                            selectedValue=''
                            placeholder={Lang.get('global.bus')}
                            attributes={{
                                name: 'concentrateur_id',
                                label: Lang.get('global.bus'),
                                labelCol: 4,
                                selectCol: 6,
                                htmlFor: 'form_mod_capteur',
                                required: true
                            }}
                            labelClass='text-right'
                        />

                        <InputSelectEditable
                            editable={true}
                            data={this.state.listConcentrateurs}
                            selectedValue=''
                            placeholder={Lang.get('global.adresse')}
                            attributes={{
                                name: 'concentrateur_id',
                                label: Lang.get('global.adresse'),
                                labelCol: 4,
                                selectCol: 6,
                                htmlFor: 'form_mod_capteur',
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
                        form_id="form_mod_capteur"
                        libelle={Lang.get('global.create')} />
                </div>
            </Modal>
        );
    }
});

var store = Reflux.createStore({
    _inst: {
        dataAjax: [],       // Les données brutes reçues en AJAX
        concentrateurs: [], // La liste de tous les concentrateurs du parking
        buses: [],          // La liste de tous les buses du parking
        allCapteurs: [],    // La liste de tous les capteurs du parking
        clearCapteurs: []   // La liste des capteurs sans place du parking
    },
    getInitialState: function () {
        return {};
    },
    // Initial setup
    init: function () {
        // REGISTER STATUSUPDATE ACTION
        this.listenTo(Actions.validation.form_field_verif, this.updateCombos);
        this.listenTo(Actions.map.liste_concentrateurs, this.listeConcentrateurs);
    },
    /**
     * Mise à jour des combos sur chaque action de l'utilisateur
     * passant les tests de vérification auto.
     * @param data
     */
    updateCombos: function (data) {
        console.log('UpdateCombos data : %o', data);
    },
    /**
     * Charge les données de la combo des concentrateurs en fonction de l'ID du parking
     * @param parkId : id du parking
     */
    listeConcentrateurs: function (parkId) {
        console.log('PASS liste concentrateurs avec id : %o', parkId);

        $.ajax({
            type: 'GET',
            url: BASE_URI + 'parking/' + parkId + '/concentrateurs',
            processData: false,
            contentType: false,
            data: {},
            context: this
        })
            .done(function (data) {
                this.handleAjaxResult(data);
            })
            .fail(function (xhr, type, exception) {
                // if ajax fails display error alert
                alert("ajax error response error " + type);
                alert("ajax error response body " + xhr.responseText);
            });
    },
    /**
     * Traite le retour de la requête AJAX ci-dessus
     * @param data
     */
    handleAjaxResult: function (data) {
        this._inst.dataAjax = data;

        var concentrateurs = data;
        var buses = [];
        var allCapteurs = [];
        var clearCapteurs = [];

        // I - PARCOURT DES CONCENTRATEURS POUR SORTIR TOUS LES BUSES
        _.each(concentrateurs, function (c) {
            Array.prototype.push.apply(buses, c.buses);
        });

        // 2 PARCOURT DES BUSES POUR LISTER LES CAPTEURS
        buses = _.map(buses, function (b) {
            // LISTE DE TOUS LES CAPTEURS
            Array.prototype.push.apply(allCapteurs, b.capteurs);

            // FILTRE DES CAPTEURS POUR TROUVER QUE CEUX QUI N'ONT PAS DE PLACE
            clearCapteurs = _.filter(b.capteurs, function (c) {
                return c.place == null;
            });

            // MODIF DES CAPTEURS DE CE BUS ET RETURN
            var retour = b;
            retour.capteurs = clearCapteurs;
            return retour;
        });

        this._inst.concentrateurs = concentrateurs;
        this._inst.buses = buses;
        this._inst.allCapteurs = allCapteurs;
        this._inst.clearCapteurs = clearCapteurs;

        console.log('TOUS LES CONCENTRATEURS: %o', concentrateurs);
        console.log('TOUS LES BUSES: %o', buses);
        console.log('ALL CAPTEURS : %o', allCapteurs);
        console.log('CLEAR CAPTEURS : %o', clearCapteurs);

        console.log('GET CONCENTRATEURS COMBO : %o', this.getConcentrateurCombo());
        console.log('GET BUSES COMBO : %o', this.getBusCombo(1));
        console.log('GET ADRESSES COMBO : %o', this.getAdresseCombo(1));
    },
    /**
     * Retourne la liste des concentrateurs pour la combo
     *
     * @return retourne les données au format attendu par le composant select:
     * [
     *   {label:'Framboise', value:0, ce que l'on veut...},
     *   {label:'Pomme', value:1, ce que l'on veut...}
     * ]
     */
    getConcentrateurCombo: function () {
        return _.map(this._inst.concentrateurs, function (c) {
            return {
                label: c.v4_id,
                value: c.id
            };
        });
    },
    /**
     * Retourne la liste des buses pour la combo en fonction du concentrateur sélected
     *
     * @return retourne les données au format attendu par le composant select:
     * [
     *   {label:'Framboise', value:0, ce que l'on veut...},
     *   {label:'Pomme', value:1, ce que l'on veut...}
     * ]
     */
    getBusCombo: function (concentrateurId) {
        var buses = _.filter(this._inst.buses, function (b) {
            return b.concentrateur_id == concentrateurId;
        });
        return _.map(buses, function (b) {
            return {
                label: b.num,
                value: b.id
            }
        });

    },
    /**
     * Retourne la liste des adresses pour la combo en fonction du bus choisi
     *
     * @return retourne les données au format attendu par le composant select:
     * [
     *   {label:'Framboise', value:0, ce que l'on veut...},
     *   {label:'Pomme', value:1, ce que l'on veut...}
     * ]
     */
    getAdresseCombo: function (busId) {
        var capteurs = _.filter(this._inst.clearCapteurs, function (c) {
            return c.bus_id == busId;
        });

        return _.map(capteurs, function (c) {
            return {
                label: c.adresse,
                value: c.id
            }
        });
    }

});

module.exports = ModalCapteur;
var React = require('react/addons');
/* Gestion de la modification et des droits */
var ComponentAccessMixins = require('../../mixins/component_access');
/* Pour le listenTo */
var MixinGestMod = require('../../mixins/gestion_modif');

var initModale = Reflux.createAction();

var Field = require('../formulaire/react_form_fields');
var Form = Field.Form;
var BtnSave = Field.BtnSave;
var InputTextEditable = Field.InputTextEditable;
var InputNumberEditable = Field.InputNumberEditable;
var InputCheckboxEditable = Field.InputCheckboxEditable;
var InputSelectEditable = Field.InputSelectEditable;
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
        dataItem: React.PropTypes.object.isRequired,
        parkingId: React.PropTypes.number.isRequired
    },

    getDefaultProps: function () {
        return {
            module_url: 'configuration_parking'
        };
    },

    getInitialState: function () {
        return {
            type_place_id: '',
            capteur_id: '',
            selectTypes: [],
            selectCapteurs: []
        };
    },
    componentWillMount: function () {
        initModale(this.props.parkingId, this.props.dataItem.id);
        // Génération des données de la liste des types
        var data = _.map(this.props.typesPlaces, function (tp) {
            return {
                label: tp.libelle,
                value: tp.id + ""
            };
        });
        this.setState({
            selectTypes: data,
            type_place_id: this.props.dataItem.type_place_id,
            capteur_id: this.props.dataItem.capteur_id
        });
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
                        <InputSelectEditable
                            multi={false}
                            attributes={{
                                label: Lang.get('global.type_place'),
                                name: "type_place_id",
                                selectCol: 6,
                                labelCol: 3,
                                required: true
                            }}
                            data={this.state.selectTypes}
                            editable={true}
                            placeholder={Lang.get('global.type_place')}
                            labelClass='text-right'
                            selectedValue={this.state.type_place_id.toString()}
                        />

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
                                    label: Lang.get('global.bonne'),
                                    name: "bonne[]",
                                    value: 'bonne',
                                    checked: (this.props.dataItem.bonne == "1"),
                                    htmlFor: 'form_mod_edit_place',
                                    groupClassName: 'col-md-6 col-md-offset-3'
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

/**
 * Store qui gère les données des combobox
 */
var store = Reflux.createStore({
    _inst: {
        place_id: '',
        ajax_data: [],      // Les données brutes reçues en AJAX
        clearCapteurs: []   // La liste des capteurs sans place du parking
    },
    getInitialState: function () {
        return {};
    },
    // Initial setup
    init: function () {
        // REGISTER STATUSUPDATE ACTION
        this.listenTo(Actions.validation.form_field_changed, this.updateCombos);
        this.listenTo(Actions.validation.submit_form, this.onSubmit_form);
        this.listenTo(initModale, this.loadInitData); // Appellé à l'affichage de la modale

        this.listenTo(Actions.map.liste_concentrateurs, this.getConcentrateurCombo);
        this.listenTo(Actions.map.liste_buses, this.getBusCombo);
        this.listenTo(Actions.map.liste_capteurs, this.getAdresseCombo);
    },

    /**
     * Appellée quand un formulaire a été validé syntaxiquement et métierment parlent.
     * @param formDom : noeud racine contenant le formulaire
     * @param formId : id du formulaire
     */
    onSubmit_form: function (formDom, formId) {
        // OBLIGÉ DE TRAITER ÇA ICI PLUTOT QUE DANS LE STORE DE LA MAP
        // POUR AVOIR ACCÈS AUX DONNÉES DES CAPTEURS.
        // LA SUITE SE PASSE DANS LE STORE MAP UNE FOIS QUE LES DONNÉES ONT ÉTÉ RÉCUPÉRÉES.
        switch (formId) {
            case "form_mod_capteur":
                this.handleCapteur(formDom);
                break;
        }
    },

    /**
     * Gère la validation de la modale "capteur de plac".
     * - Remplis le cadre d'infos de la carte
     * - Lance le cycle de vie d'affectation des capteurs
     *
     * @param formDom : le DOM du formulaire
     */
    handleCapteur: function (formDom) {

        var concentrateurId, busId, capteurId, $dom = $(formDom);
        concentrateurId = $dom.find('[name=concentrateur_id]').val();
        busId = $dom.find('[name=bus_id]').val();
        capteurId = $dom.find('[name=capteur_id]').val();

        var concentrateur = this.getConcentrateurFromId(concentrateurId);
        var bus = this.getBusFromId(busId);
        var capteurInit = this.getCapteurFromId(capteurId);
        var capteurs = this.getRemainingClearCapteursFromBus(busId, capteurInit);

        // LANCEMENT DE LA PROCÉDURE D'AFFECTATION DANS LE STORE PARKING MAP
        Actions.map.start_affectation_capteurs(concentrateur, bus, capteurInit, capteurs);
    },

    /**
     * Mise à jour des combos sur chaque action de l'utilisateur
     * passant les tests de vérification auto.
     * @param data
     */
    updateCombos: function (data) {

        var retour = {};
        // update selected value de la combo actuelle
        retour[data.name] = data.value;

        this.trigger(retour);
    },
    /**
     * Charge les données du réseau du parking en fonction de l'ID du parking
     * @param parkId : id du parking
     */
    loadInitData: function (parkId, place_id) {
        //console.log('PASS INIT DATA avec id : %o', parkId);
        this._inst.place_id = place_id;

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
                console.error("ajax error response error " + type);
                console.error("ajax error response body " + xhr.responseText);
            });
    },
    /**
     * Traite le retour de la requête AJAX ci-dessus
     * @param data
     */
    handleAjaxResult: function (data) {
        this._inst.ajax_data = data;

        var concentrateurs = data;
        var buses = [];
        var allCapteurs = [];
        var clearCapteurs = [];

        // I - PARCOURT DES CONCENTRATEURS POUR SORTIR TOUS LES BUSES
        _.each(concentrateurs, function (c) {
            Array.prototype.push.apply(buses, c.buses);
        });

        _.each(buses, function (b) {
            // LISTE DE TOUS LES CAPTEURS
            Array.prototype.push.apply(allCapteurs, b.capteurs);

            // FILTRE DES CAPTEURS POUR TROUVER QUE CEUX QUI N'ONT PAS DE PLACE
            Array.prototype.push.apply(clearCapteurs, _.filter(b.capteurs, function (c) {
                return (c.place == null || c.place.id == this._inst.place_id);
            }, this));
        }, this);


    },

    /*****************************************************************************
     * UPDATE COMBOBOXES *********************************************************
     *****************************************************************************/

    /**
     * Retourne la liste des adresses pour la combo en fonction du bus choisi
     *
     * @return retourne les données au format attendu par le composant select:
     * [
     *   {label:'Framboise', value:'0', ce que l'on veut...},
     *   {label:'Pomme', value:'1', ce que l'on veut...}
     * ]
     */
    getAdresseCombo: function (busId) {
        var capteurs = _.filter(this._inst.clearCapteurs, function (c) {
            return c.bus_id == busId;
        });

        return _.map(capteurs, function (c) {
            return {
                label: c.adresse,
                value: c.id.toString()
            }
        });
    },

    /**
     * Retourne le capteur en fonction de son id
     * @param capteurId : id du capteur
     */
    getCapteurFromId: function (capteurId) {
        return _.reduce(this._inst.allCapteurs, function (retour, c) {
            if (c.id == capteurId) {
                return c;
            } else {
                return retour;
            }
        }, null);
    }

});

module.exports = ModalEditPlace;
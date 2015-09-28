var React = require('react/addons');
/* Gestion de la modification et des droits */
var ComponentAccessMixins = require('../../mixins/component_access');
/* Pour le listenTo */
var MixinGestMod = require('../../mixins/gestion_modif');

var initModale = Reflux.createAction();

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
var ModalCapteurVirtuel = React.createClass({

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
            listBuses: [],
            listLegs: [],
            concentrateur_id: '',
            bus_id: '',
            leg_num: ''
        };
    },
    componentWillMount: function () {
        this.listenTo(store, this.updateData);
        initModale(this.props.parkingId);

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
                title={Lang.get('administration_parking.carte.titre_capteur_virtuel')}
                onHide={this.props.onToggle}>

                <div className="modal-body">
                    <Form attributes={{id: "form_mod_capteur_virtuel"}}>

                        <InputSelectEditable
                            editable={true}
                            data={this.state.listConcentrateurs}
                            selectedValue={this.state.concentrateur_id}
                            placeholder={Lang.get('global.concentrateur')}
                            attributes={{
                                name: 'concentrateur_id',
                                label: Lang.get('global.concentrateur'),
                                labelCol: 4,
                                selectCol: 6,
                                htmlFor: 'form_mod_capteur_virtuel',
                                required: true
                            }}
                            labelClass='text-right'
                        />

                        <InputSelectEditable
                            editable={true}
                            data={this.state.listBuses}
                            selectedValue={this.state.bus_id}
                            placeholder={Lang.get('global.bus')}
                            attributes={{
                                name: 'bus_id',
                                label: Lang.get('global.bus'),
                                labelCol: 4,
                                selectCol: 6,
                                htmlFor: 'form_mod_capteur_virtuel',
                                required: true
                            }}
                            labelClass='text-right'
                        />

                        <InputSelectEditable
                            editable={true}
                            data={this.state.listLegs}
                            selectedValue={this.state.leg_num}
                            placeholder={Lang.get('global.leg')}
                            attributes={{
                                name: 'leg_num',
                                label: Lang.get('global.leg'),
                                labelCol: 4,
                                selectCol: 6,
                                htmlFor: 'form_mod_capteur_virtuel',
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
                        form_id="form_mod_capteur_virtuel"
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
        ajax_data: [],      // Les données brutes reçues en AJAX
        concentrateurs: [], // La liste de tous les concentrateurs du parking
        buses: [],          // La liste de tous les buses du parking
        allCapteurs: [],    // La liste de tous les capteurs du parking
        clearCapteurs: [],   // La liste des capteurs sans place du parking
        legs: []            // La liste des legs
    },
    getInitialState: function () {
        return {};
    },
    // Initial setup
    init: function () {
        // REGISTER STATUSUPDATE ACTION
        this.listenTo(Actions.validation.form_field_changed, this.updateForm);
        this.listenTo(Actions.validation.submit_form, this.onSubmit_form);
        this.listenTo(initModale, this.loadInitData); // Appellé à l'affichage de la modale

        this.listenTo(Actions.map.liste_concentrateurs, this.getConcentrateurCombo);
        this.listenTo(Actions.map.liste_buses, this.getBusCombo);
    },

    /**
     * Appellée quand un formulaire a été validé syntaxiquement et métierment parlent.
     * @param formDom : noeud racine contenant le formulaire
     * @param formId : id du formulaire
     */
    onSubmit_form: function (formDom, formId) {
        console.log('PASS SUBMIT FORM form id : ' + formId);
        // OBLIGÉ DE TRAITER ÇA ICI PLUTOT QUE DANS LE STORE DE LA MAP
        // POUR AVOIR ACCÈS AUX DONNÉES DES CAPTEURS.
        // LA SUITE SE PASSE DANS LE STORE MAP UNE FOIS QUE LES DONNÉES ONT ÉTÉ RÉCUPÉRÉES.
        switch (formId) {
            case "form_mod_capteur_virtuel":
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
        // TODO adapter ça aux legs etc...
        var concentrateurId, busId, legNum, $dom = $(formDom);
        concentrateurId = $dom.find('[name=concentrateur_id]').val();
        busId = $dom.find('[name=bus_id]').val();
        legNum = $dom.find('[name=leg_num]').val();

        var concentrateur = this.getConcentrateurFromId(concentrateurId);
        var bus = this.getBusFromId(busId);

        // LANCEMENT DE LA PROCÉDURE D'AFFECTATION DANS LE STORE PARKING MAP
        this.getMaxAdressOnLeg(concentrateur, bus, legNum);
    },

    /**
     * Mise à jour des combos sur chaque action de l'utilisateur
     * passant les tests de vérification auto.
     * @param data
     */
    updateForm: function (data) {

        var retour = {};
        // update selected value de la combo actuelle
        retour[data.name] = data.value;
        switch (data.name) {
            // Concentrateur selected
            case 'concentrateur_id':
                retour.bus_id = "";
                retour.listBuses = this.getBusCombo(data.value);
                break;
            // Bus selected
            case 'bus_id':
                break;
        }

        this.trigger(retour);
    },
    /**
     * Charge les données du réseau du parking en fonction de l'ID du parking
     * @param parkId : id du parking
     */
    loadInitData: function (parkId) {
        //console.log('PASS INIT DATA avec id : %o', parkId);

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
                var concentrateursData = this.getConcentrateurCombo();
                var legData = this.getLegCombo();
                this.trigger({
                    listConcentrateurs: concentrateursData,
                    listLegs: legData
                });
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

        // 2 PARCOURT DES BUSES POUR LISTER LES CAPTEURS
        buses = _.map(buses, function (b) {
            // LISTE DE TOUS LES CAPTEURS
            Array.prototype.push.apply(allCapteurs, b.capteurs);

            // FILTRE DES CAPTEURS POUR TROUVER QUE CEUX QUI N'ONT PAS DE PLACE
            Array.prototype.push.apply(clearCapteurs, _.filter(b.capteurs, function (c) {
                return c.place == null;
            }));

            // MODIF DES CAPTEURS DE CE BUS ET RETURN
            var retour = b;
            retour.capteurs = clearCapteurs;
            return retour;
        });

        this._inst.concentrateurs = concentrateurs;
        this._inst.buses = buses;
        this._inst.allCapteurs = allCapteurs;
        this._inst.clearCapteurs = clearCapteurs;
    },

    /**
     *
     * @param concentrateurId
     * @param busId
     * @param legNum
     */
    getMaxAdressOnLeg: function (concentrateur, bus, legNum) {
        $.ajax({
            type: 'GET',
            url: BASE_URI + 'parking/bus/' + bus.id + '/' + legNum + '/max_noeud',
            processData: false,
            contentType: false,
            context: this
        })
            .done(function (data) {
                if (!_.isNaN(parseInt(data))) {
                    console.log('Data max adresse : %o', data);
                    Actions.map.start_affectation_capteurs_virtuels(concentrateur, bus, legNum, data);
                }
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
     * Retourne la liste des concentrateurs pour la combo
     *
     * @return retourne les données au format attendu par le composant select:
     * [
     *   {label:'Framboise', value:'0', ce que l'on veut...},
     *   {label:'Pomme', value:'1', ce que l'on veut...}
     * ]
     */
    getConcentrateurCombo: function () {
        return _.map(this._inst.concentrateurs, function (c) {
            return {
                label: c.v4_id,
                value: c.id.toString()
            };
        });
    },
    /**
     * Retourne la liste des buses pour la combo en fonction du concentrateur sélected
     *
     * @return retourne les données au format attendu par le composant select:
     * [
     *   {label:'Framboise', value:'0', ce que l'on veut...},
     *   {label:'Pomme', value:'1', ce que l'on veut...}
     * ]
     */
    getBusCombo: function (concentrateurId) {
        var buses = _.filter(this._inst.buses, function (b) {
            return b.concentrateur_id == concentrateurId;
        });
        return _.map(buses, function (b) {
            return {
                label: b.name.toString() + ' - ' + b.num.toString(),
                value: b.id.toString()
            }
        });

    },

    /**
     * Retourne la liste des adresses pour la combo en fonction du bus choisi
     *
     * @return retourne les données au format attendu par le composant select:
     * [
     *   {label:'Framboise', value:'0', ce que l'on veut...},
     *   {label:'Pomme', value:'1', ce que l'on veut...}
     * ]
     */
    getLegCombo: function () {
        var legs = [];
        for (var i = 1; i <= 2; i++) {
            legs.push({
                label: 'Leg ' + i,
                value: i
            });
        }

        return legs;
    },

    /**
     * Retourne la liste des capteurs non affectés du bus
     * à partir de l'adresse passée en params
     *
     * @return retourne la liste des capteurs clears du bus à partir du capteur passé en param
     */
    getRemainingClearCapteursFromBus: function (busId, capteurInit) {
        return _.filter(this._inst.clearCapteurs, function (c) {
            return (c.bus_id == busId) && (c.adresse >= capteurInit.adresse);
        });
    },

    /**
     * Retourne la liste des capteurs non affectés du bus
     * à partir de l'adresse passée en params
     *
     * @return retourne la liste des capteurs clears du bus à partir du capteur passé en param
     */
    getLastAdresseFromBusLeg: function (busId, capteurInit) {
        return _.reduce(this._inst.clearCapteurs, function (total, c) {
            return (c.bus_id == busId) && (c.adresse >= capteurInit.adresse);
        });
    },

    /**
     * Retourne le concentrateur en fonction de son id
     * @param concentrateurId : id du concentrateur
     */
    getConcentrateurFromId: function (concentrateurId) {
        return _.reduce(this._inst.concentrateurs, function (retour, c) {
            if (c.id == concentrateurId) {
                return c;
            } else {
                return retour;
            }
        }, null);
    },
    /**
     * Retourne le bus en fonction de son id
     * @param busId : id du bus
     */
    getBusFromId: function (busId) {
        return _.reduce(this._inst.buses, function (retour, b) {
            if (b.id == busId) {
                return b;
            } else {
                return retour;
            }
        }, null);
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

module.exports = ModalCapteurVirtuel;
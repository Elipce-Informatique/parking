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
            listBuses: [],
            listAdress: [],
            concentrateur_id: '',
            bus_id: '',
            capteur_id: ''
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
                title={Lang.get('administration_parking.carte.titre_capteur')}
                onRequestHide={this.props.onToggle}>

                <div className="modal-body">
                    <Form attributes={{id: "form_mod_capteur"}}>

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
                                htmlFor: 'form_mod_capteur',
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
                                htmlFor: 'form_mod_capteur',
                                required: true
                            }}
                            labelClass='text-right'
                        />

                        <InputSelectEditable
                            editable={true}
                            data={this.state.listAdress}
                            selectedValue={this.state.capteur_id}
                            placeholder={Lang.get('global.adresse')}
                            attributes={{
                                name: 'capteur_id',
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

/**
 * Store qui gère les données des combobox
 */
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
        this.listenTo(Actions.validation.form_field_changed, this.updateCombos);
        this.listenTo(Actions.validation.submit_form, this.onSubmit_form);
        this.listenTo(Actions.map.init_modale, this.loadInitData); // Appellé à l'affichage de la modale

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
        switch (data.name) {
            // Concentrateur selected
            case 'concentrateur_id':
                retour.bus_id = "";
                retour.listBuses = this.getBusCombo(data.value);
                retour.capteur_id = "";
                retour.listAdress = this.getAdresseCombo("");
                break;
            // Bus selected
            case 'bus_id':
                retour.capteur_id = "";
                retour.listAdress = this.getAdresseCombo(data.value);
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
                this.trigger({
                    listConcentrateurs: concentrateursData
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
                label: b.num.toString(),
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

module.exports = ModalCapteur;
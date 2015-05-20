// Composants REACT
var React = require('react/addons');
var DataTable = require('../composants/tableau/react_data_table_bandeau');
var BandeauListe = require('../composants/bandeau/react_bandeau_liste');
var BandeauVisu = require('../composants/bandeau/react_bandeau_visu');
var BandeauEdition = require('../composants/bandeau/react_bandeau_edition');
var BandeauGenerique = require('../composants/bandeau/react_bandeau_generique');
var Button = ReactB.Button;
var Row = ReactB.Row;
var Col = ReactB.Col;
var FormNiveau = require('../react_form_niveau').Composant;

// MIXINS
var AuthentMixins = require('../mixins/component_access');
var MixinGestMod = require('../mixins/gestion_modif');

// HELPERS
var pageState = require('../helpers/page_helper').pageState;
var form_data_helper = require('../helpers/form_data_helper');

/**
 * Page calendrier jours
 * @param attributes: props de Input (react bootstrap) ex: {value:Toto, label: Champ texte:}
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 */
var PageNiveau = React.createClass({

    mixins: [Reflux.ListenerMixin, MixinGestMod, AuthentMixins],


    getDefaultProps: function () {
        return {module_url: 'calendrier_jours'}
    },

    getInitialState: function () {
        return {
            etat: pageState.liste,
            idNiveau: 0,
            listeNiveaux: [],// Tableau de niveaux
            detailNiveau: {}, // Objet contenant les infos du niveau en cours de sélection
            validationLibelle: {}, // Etat de validation du libelle (vert ou rouge),
            sousTitre: '', // sous titre du bandeau
            parkings: [] // parkings liés au user connecté
        };
    },
    componentDidMount: function () {
        this.listenTo(storeNiveau, this.updateData, this.updateData);
    },

    updateData: function (obj) {
        //console.log('CALLBACK PAGE JOURS data %o',_.cloneDeep(obj));
        // MAJ data
        this.setState(obj);
    },

    onRetour: function () {
        this.setState({etat: pageState.liste, idNiveau: 0});
        // Maj liste des jours prédéfinis
        Actions.niveau.display_all_niveaux();
    },

    displayNiveau: function (e) {
        // Ligne du tableau
        var id = $(e.currentTarget).data('id');
        Actions.niveau.display_detail_niveau(id);
    },

    /**
     * Calcul du render en fonction de l'état d'affichage de la page
     * @returns {*}
     */
    display: function () {
        // Variables
        var react;
        var mode = 1;

        // Affichage en fonction de l'état de la page
        switch (this.state.etat) {
            case pageState.visu:
                react =
                    <div key="root">
                        <BandeauGenerique
                            key="bandeauVisu"
                            bandeauType={this.state.etat}
                            module_url="niveau"
                            titre={Lang.get('administration_parking.niveau.titre')}
                            sousTitre={this.state.sousTitre}/>
                        <FormNiveau
                            editable={false}
                            detailNiveau={this.state.detailNiveau}
                            idNiveau={this.state.idNiveau} />
                    </div>;
                break;
            case pageState.creation:
                mode = 0;
                react =
                    <div key="root">
                        <BandeauGenerique
                            key="bandeauCreation"
                            bandeauType={this.state.etat}
                            module_url="niveau"
                            mode={mode}
                            titre={Lang.get('administration_parking.niveau.titre')}/>
                        <FormNiveau
                            editable={true}
                            detailNiveau={this.state.detailNiveau}
                            idNiveau={this.state.idNiveau}
                            validationLibelle={this.state.validationLibelle} />
                    </div>;
                break;
            case pageState.edition:
                react =
                    <div key="root">
                        <BandeauGenerique
                            key="bandeauCreation"
                            bandeauType={this.state.etat}
                            module_url="niveau"
                            mode={mode}
                            titre={Lang.get('administration_parking.niveau.titre')}
                            sousTitre={this.state.sousTitre}/>
                        <FormNiveau
                            editable={true}
                            detailNiveau={this.state.detailNiveau}
                            idNiveau={this.state.idNiveau}
                            validationLibelle={this.state.validationLibelle}
                            parkings={this.state.parkings}/>
                    </div>;
                break;
            default:
                var props = {
                    head: [
                        Lang.get('global.parking'),
                        Lang.get('global.niveau'),
                        Lang.get('global.description'),
                        Lang.get('administration_parking.niveau.nb_plan')
                    ],
                    hide: ['id']
                };

                react =
                    <div key="root">
                        <BandeauGenerique
                            key="bandeauListe"
                            bandeauType={this.state.etat}
                            module_url="niveau"
                            titre={Lang.get('administration_parking.niveau.titre')}/>
                        <Row>
                            <Col md={12}>
                                <DataTable
                                    data={this.state.listeNiveaux}
                                    id="tab_niveau"
                                    {...props}
                                    bUnderline={true}
                                    evts={{onClick: this.displayNiveau}}/>
                            </Col>
                        </Row>
                    </div>;
                break;

        }
        return react;
    },

    render: function () {
        var dynamic = this.display();
        return (
            <Col md={12}>
                {dynamic}
            </Col>
        )
    }
});
module.exports.Composant = PageNiveau;


// Creates a DataStore
var storeNiveau = Reflux.createStore({

    // Variables
    stateLocal: {
        idNiveau: 0,
        etat: pageState.liste,
        listeNiveaux: [],
        detailNiveau: {},
        validationLibelle: {},
        sousTitre: '',
        parkings: []
    },

    // Initial setup
    init: function () {
        // Register statusUpdate action
        this.listenToMany(Actions.niveau);
        // Toutes les actions de bandeau et validation
        this.listenToMany(Actions.bandeau);
        this.listenToMany(Actions.validation);

    },
    /**
     * 1er chargement des données, tous les jours pérédéfinis
     * @returns {*}
     */
    getInitialState: function () {
        // AJAX
        $.ajax({
            url: BASE_URI + 'parking/niveau/all',
            dataType: 'json',
            context: this,
            async: false,
            success: function (data) {
                // Calcul des niveaux à afficher
                var niveaux = this.processNiveauxList(data);
                // MAJ du state local
                this.stateLocal.listeNiveaux = niveaux;
                //console.log(data);
                // Calcul des parkings du user
                var parkings = _.map(data, function (park) {
                    // Données du niveau qui nous intéressent
                    return _.pick(park, ['id', 'libelle']);
                }.bind(this));
                // MAJ du state local
                this.stateLocal.parkings = parkings;

            },
            error: function (xhr, status, err) {
                console.error(status, err.toString());
                this.stateLocal.listeNiveaux = [];
            }
        });
        return this.stateLocal;
    },

    /**
     * A partir des données des niveaux de parkings, contruit des data "niveau"
     * @param data: données de la BDD (Parking::getTreeviewParking())
     */
    processNiveauxList: function (data) {
        var niveaux = [];
        // Des parkings sont associés au user
        if (data.length > 0) {
            // Parcours des parkings
            data.forEach(function (park, index) {
                // Des niveaux dans le parking
                if (park.niveaux.length > 0) {
                    // Parcours des niveaux
                    var niveauParkCourant = _.map(park.niveaux, function (niveau) {
                        // Données du niveau qui nous intéressent
                        var temp = _.pick(niveau, ['id', 'libelle', 'description']);
                        // ajout du nb plans
                        temp.nb = niveau.plans.length;
                        // Ajout du nom de parking
                        temp = _.extend({parking: park.libelle}, temp);
                        return temp;
                    }.bind(this));

                    // Ajout au tableau de niveaux
                    niveaux = _.extend(niveaux, niveauParkCourant);
                }

            }, this);
        }
        return niveaux
    },

    /**
     * Affichage du détail du niveau
     * @param id: ID niveau
     */
    onDisplay_detail_niveau: function (id) {
        // Infos
        this.stateLocal.idNiveau = id;
        this.stateLocal.etat = pageState.visu;
        // AJAX
        $.ajax({
            url: BASE_URI + 'parking/niveau/' + id,
            dataType: 'json',
            context: this,
            async: true,
            success: function (data) {
                // Détail du jour + id
                this.stateLocal.detailNiveau = data;
                // Maj libelle + id
                this.stateLocal.sousTitre = data.libelle;
                // Maj page
                this.trigger(this.stateLocal);
            },
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }
        });
    },

    /**
     * Accueil de la page, tableau de niveaux
     */
    onDisplay_all_niveaux: function () {
        this.stateLocal = {
            idNiveau: 0,
            etat: pageState.liste
        };

        // AJAX
        $.ajax({
            url: BASE_URI + 'parking/niveau/all',
            dataType: 'json',
            context: this,
            async: true,
            success: function (data) {
                // Calcul des niveaux à afficher
                var niveaux = this.processNiveauxList(data);
                // MAJ du state local
                this.stateLocal.listeNiveaux = niveaux;
                // Envoi du state
                this.trigger(this.stateLocal);
            },
            error: function (xhr, status, err) {
                console.error(status, err.toString());
                this.stateLocal.listeNiveaux = [];
            }
        });
    },


    /**
     * Bouton créer du bandeau: affichage du formulaire vide
     */
    onCreer: function () {
        this.stateLocal = {
            idNiveau: 0,
            etat: pageState.creation,
            detailNiveau: {
                libelle: '',
                ouverture: '',
                fermeture: '',
                couleur: ''
            }
        };
        this.trigger(this.stateLocal);
    },

    /**
     * Bouton editer du bandeau: affichage du formulaire en mode edition (Input au lieu de libellés)
     */
    onEditer: function () {
        // Passage en mode edition
        this.stateLocal = _.extend(this.stateLocal, {
            etat: pageState.edition
        });
        // Update composant React
        this.trigger(this.stateLocal);
    },

    /**
     * onChange de n'importe quel élément du FORM
     * @param e: evt
     */
    onForm_field_changed: function (e) {
        var data = {};
        // MAJ du state STORE
        data[e.name] = e.value
        this.stateLocal.detailNiveau = _.extend(this.stateLocal.detailNiveau, data);
    },

    /**
     * Vérifications "Métiers" du formulaire sur onBlur de n'imoprte quel champ du FORM
     * @param data : Object {name: "email", value: "yann.pltv@gmail.com", form: DOMNode}
     */
    onForm_field_verif: function (data) {

        // Le champ BLUR est le champ libelle
        if (data.name == 'libelle') {
            //  Test doublon du libellé
            this.stateLocal.validationLibelle = this.libelleChange(data.value, this.stateLocal.idNiveau);
            this.trigger(this.stateLocal);
        }

    },

    /**
     * Vérification de l'unicité du libelle en BDD
     * @param value: valeur du champ libelle
     * @param id: ID jour_calendrier ou 0 si mode création
     * @returns {{}}
     */
    libelleChange: function (value, id) {
        /* Variable de retour */
        var retour = {};

        /* libelle  non vide et non identique au libellé de départ */
        if (value.length > 0 && value != this.stateLocal.sousTitre) {

            // URL en fonction du mode création ou edtion
            var finUrl = id === 0 ? '' : '/' + id;

            // AJAX
            $.ajax({
                url: BASE_URI + 'calendrier_jours/libelle/' + value + finUrl,
                dataType: 'json',
                context: this,
                async: false,
                success: function (bExist) {
                    // Le libellé existe déjà
                    if (bExist) {
                        // Champ libelle erroné
                        retour['data-valid'] = false;
                        retour.bsStyle = 'error';
                        retour.help = Lang.get('calendrier.jours.libelleExists');
                    }
                },

                error: function (xhr, status, err) {
                    console.error(status, err.toString());
                }
            });
        }
        return retour;
    },

    /**
     * Sauvegarder les données
     * @param e: evt click du bouton
     */
    onSubmit_form: function (e) {
        // Variables
        var url = this.stateLocal.idNiveau === 0 ? '' : this.stateLocal.idNiveau;
        url = BASE_URI + 'calendrier_jours/' + url;
        var method = this.stateLocal.idNiveau === 0 ? 'POST' : 'PUT';

        // FormData
        var fData = form_data_helper('form_jours', method);

        // Requête
        $.ajax({
            url: url,
            type: 'POST',
            data: fData,
            processData: false,
            contentType: false,
            dataType: 'json',
            context: this,
            success: function (tab) {
                // Sauvegarde OK
                if (tab.save) {
                    // Notification
                    Actions.notif.success(Lang.get('global.notif_success'));
                    // Mode edition
                    this.stateLocal.etat = pageState.edition;
                    // Mode création Ok
                    if (tab.obj !== null) {
                        // Maj State local + nouveau libellé
                        this.stateLocal.idNiveau = tab.obj.id;
                        this.stateLocal.detailNiveau = tab.obj;
                        this.stateLocal.sousTitre = tab.obj.libelle;
                    }
                    // Mode édition
                    else {
                        // Nouveau sous titre
                        this.stateLocal.sousTitre = this.stateLocal.detailNiveau.libelle;
                    }
                    // Maj state
                    this.trigger(this.stateLocal);
                }
                // Le jour existe déjà
                else if (tab.save == false && tab.errorBdd == false) {
                    // Notification
                    Actions.notif.error(Lang.get('calendrier.jours.libelleExists'));
                }
                // Erreur SQL
                else {
                    Actions.notif.error(Lang.get('global.notif_erreur'));
                }
            },

            error: function (xhr, status, err) {
                console.error(status, err.toString());
                Actions.notif.error('AJAX : ' + Lang.get('global.notif_erreur'));
            }
        });
    },

    /**
     * Suppression d'un jour prédéfini
     */
    onSupprimer: function () {
        // Variables
        var url = BASE_URI + 'calendrier_jours/' + this.stateLocal.idNiveau;
        var method = 'DELETE';

        // Requête
        $.ajax({
            url: url,
            dataType: 'json',
            context: this,
            type: method,
            data: {'_token': $('#_token').val()},
            success: function (bool) {
                // suppression OK
                if (bool) {
                    // Mode liste
                    this.modeListe();
                    // Notification green
                    Actions.notif.success(Lang.get('global.notif_success'));
                }
                // Suppression KO
                else {
                    // Notifictaion erreur
                    Actions.notif.error(Lang.get('global.notif_erreur'));
                }
            },
            error: function (xhr, status, err) {
                console.error(status, err.toString());
                Actions.notif.error(Lang.get('global.notif_erreur'));
            }
        });
    }
});
module.exports.store = storeNiveau;
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
var async = require('async');
var Form = require('../react_form_parking').Composant;
// MIXINS
var AuthentMixins = require('../mixins/component_access');
var MixinGestMod = require('../mixins/gestion_modif');
// HELPERS
var pageState = require('../helpers/page_helper').pageState;
var form_data_helper = require('../helpers/form_data_helper');

/**
 * Page parking
 * @param attributes: props de Input (react bootstrap) ex: {value:Toto, label: Champ texte:}
 * @param evts: evenements de Input (react bootstrap)  ex: {onClick: maFonction}
 */
var PageParking = React.createClass({

    mixins: [Reflux.ListenerMixin, MixinGestMod, AuthentMixins],


    getDefaultProps: function () {
        return {module_url: 'gestion_parking'}
    },

    getInitialState: function () {
        return {
            etat: pageState.liste,
            idParking: 0,
            listeParkings: [],// Tableau de jours prédéfinis
            detailParking: {}, // Objet contenant les infos du jour prédéfini en cours de sélection
            validationLibelle: {}, // Etat de validation du libelle (vert ou rouge),
            sousTitre: '', // sous titre du bandeau
            users: [] // Tous les utilisateurs
        };
    },
    componentDidMount: function () {
        this.listenTo(storeParking, this.updateData, this.updateData);
    },

    updateData: function (obj) {
        //console.log('CALLBACK PAGE JOURS data %o',_.cloneDeep(obj));
        // MAJ data
        this.setState(obj);
    },

    onRetour: function () {
        this.setState({etat: pageState.liste, idParking: 0});
        // Maj liste des jours prédéfinis
        Actions.parking.display_all_parkings();
    },

    /**
     * Affichage du détail du parking
     * @param e
     */
    displayParking: function (e) {
        // Ligne du tableau
        var id = $(e.currentTarget).data('id');
        Actions.parking.display_detail_parking(id);
    },

    /**
     * Calcul du render en fonction de l'état d'affichage de la page
     * @returns {*}
     */
    display: function () {
        // Variables
        var react;
        var mode = 1;

        //console.log('render page: %o', this.state.users);
        // Affichage en fonction de l'état de la page
        switch (this.state.etat) {
            case pageState.visu:
                react =
                    <div key="root">
                        <BandeauGenerique
                            key="bandeauVisu"
                            bandeauType={this.state.etat}
                            module_url="gestion_parking"
                            titre={Lang.get('administration_parking.parking.titre')}
                            sousTitre={this.state.sousTitre}/>
                        <Form
                            editable={false}
                            detailParking={this.state.detailParking}
                            idNiveau={this.state.idNiveau}
                            parkings={this.state.parkings}
                            nbUpload={this.state.nbUpload}
                            users={this.state.users}
                            usersSelected={this.state.detailParking.utilisateurs}
                            mode="edition"
                        />
                    </div>;
                break;
            case pageState.creation:
                mode = 0;
                react =
                    <div key="root">
                        <BandeauGenerique
                            key="bandeauCreation"
                            bandeauType={this.state.etat}
                            module_url="gestion_parking"
                            mode={mode}
                            titre={Lang.get('administration_parking.parking.titre')}/>
                        <Form
                            editable={true}
                            detailParking={this.state.detailParking}
                            idNiveau={this.state.idNiveau}
                            validationLibelle={this.state.validationLibelle}
                            parkings={this.state.parkings}
                            nbUpload={this.state.nbUpload}
                            users={this.state.users}
                            usersSelected={this.state.detailParking.utilisateurs}
                            mode="creation"/>
                    </div>;
                break;
            case pageState.edition:
                react =
                    <div key="root">
                        <BandeauGenerique
                            key="bandeauCreation"
                            bandeauType={this.state.etat}
                            module_url="gestion_parking"
                            mode={mode}
                            titre={Lang.get('administration_parking.parking.titre')}
                            sousTitre={this.state.sousTitre}/>
                        <Form
                            editable={true}
                            detailParking={this.state.detailParking}
                            idNiveau={this.state.idNiveau}
                            validationLibelle={this.state.validationLibelle}
                            parkings={this.state.parkings}
                            nbUpload={this.state.nbUpload}
                            users={this.state.users}
                            usersSelected={this.state.detailParking.utilisateurs}
                            mode="edition"/>
                    </div>;
                break;
            default:
                var props = {
                    head: [
                        Lang.get('global.parking'),
                        Lang.get('global.description'),
                        Lang.get('administration_parking.parking.port')
                    ],
                    hide: ['id']
                };

                react =
                    <div key="root">
                        <BandeauGenerique
                            key="bandeauListe"
                            bandeauType={this.state.etat}
                            module_url="niveau"
                            titre={Lang.get('administration_parking.parking.titre')}/>
                        <Row>
                            <Col md={12}>
                                <DataTable
                                    data={this.state.listeParkings}
                                    id="tab_parking"
                                    {...props}
                                    bUnderline={true}
                                    evts={{onClick: this.displayParking}}/>
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
module.exports.Composant = PageParking;


// Creates a DataStore
var storeParking = Reflux.createStore({

    // Variables
    stateLocal: {
        idParking: 0,
        etat: pageState.liste,
        listeParkings: [],
        detailParking: {},
        validationLibelle: {},
        sousTitre: '',
        users: [],
        usersSelected: []
    },

    // Initial setup
    init: function () {
        // Register statusUpdate action
        this.listenToMany(Actions.parking);
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
            url: BASE_URI + 'parking/gestion_parking/all',
            dataType: 'json',
            context: this,
            async: false,
            success: function (parkPlusUsers) {
                // Parkings
                var data = parkPlusUsers.parkings;
                this.stateLocal.listeParkings = _.map(data, function (park) {
                    return _.omit(park, 'pivot')
                }, this);
                // Utilisateurs
                this.stateLocal.users = _.map(parkPlusUsers.users, function (user) {
                    // Données du niveau qui nous intéressent
                    return {
                        label: user.nom + ' ' + user.prenom,
                        value: user.id.toString()
                    };
                }.bind(this));
            },
            error: function (xhr, status, err) {
                console.error(status, err.toString());
                this.stateLocal.listeParkings = [];
                this.stateLocal.users = [];
            }
        });
        return this.stateLocal;
    },

    /**
     * Accueil de la page, tableau de parkings
     */
    onDisplay_all_parkings: function () {
        this.stateLocal = {
            idParking: 0,
            etat: pageState.liste
        };

        // AJAX
        $.ajax({
            url: BASE_URI + 'parking/gestion_parking/all',
            dataType: 'json',
            context: this,
            async: true,
            success: function (parkPlusUsers) {
                // Parkings
                var data = parkPlusUsers.parkings;
                this.stateLocal.listeParkings = _.map(data, function (park) {
                    return _.omit(park, 'pivot')
                }, this);
                // Utilisateurs
                this.stateLocal.users = _.map(parkPlusUsers.users, function (user) {
                    // Données du niveau qui nous intéressent
                    return {
                        label: user.nom + ' ' + user.prenom,
                        value: user.id.toString()
                    };
                }.bind(this));
                this.trigger(this.stateLocal);
            },
            error: function (xhr, status, err) {
                console.error(status, err.toString());
                this.stateLocal.listeParkings = [];
                this.stateLocal.users = [];
            }
        });
    },

    /**
     * Chargement des données d'un parking
     * @param idParking: parking.id
     */
    onDisplay_detail_parking: function (idParking) {
        // Infos
        this.stateLocal.idParking = idParking;
        this.stateLocal.etat = pageState.visu;
        // AJAX
        $.ajax({
            url: BASE_URI + 'parking/gestion_parking/' + idParking,
            dataType: 'json',
            context: this,
            async: true,
            success: function (data) {
                // ID des utilsateurs associés au parking
                data.utilisateurs = _.map(data.utilisateurs, function (user) {
                    return user.id.toString();
                });
                // Détail du jour + id
                this.stateLocal.detailParking = data;
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
     * Bouton créer du bandeau: affichage du formulaire vide
     */
    onCreer: function () {
        this.stateLocal = {
            idParking: 0,
            etat: pageState.creation,
            detailParking: {
                libelle: '',
                description: '',
                ip: '',
                server_com: {
                    protocol_version: '1',
                    protocol_port: '',
                    software_name: 'Guidance COM server',
                    software_version: '1.0.0',
                    software_os: 'Linux',
                    sofware_version: '2015-09-17 11:11:00'
                }
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
        data[e.name] = e.value;
        this.stateLocal.detailParking = _.extend(this.stateLocal.detailParking, data);

        // Si on est sur une combo on trigger pour les selectedValue
        if (e.name == 'utilisateurs') {
            this.trigger(this.stateLocal);
        }
    },

    /**
     * Vérifications "Métiers" du formulaire sur onBlur de n'imoprte quel champ du FORM
     * @param data : Object {name: "email", value: "yann.pltv@gmail.com", form: DOMNode}
     */
    onForm_field_verif: function (data) {

        // Le champ BLUR est le champ libelle
        if (data.name == 'libelle') {
            //  Test doublon du libellé
            this.stateLocal.validationLibelle = this.libelleChange(data.value, this.stateLocal.idParking);
            this.trigger(this.stateLocal);
        }

    },

    /**
     * Vérification de l'unicité du libelle en BDD
     * @param value: valeur du champ libelle
     * @param id: ID parking ou 0 si mode création
     * @returns {{}}
     */
    libelleChange: function (value, id) {
        // Variable de retour
        var retour = {};

        // libelle  non vide et non identique au libellé de départ
        if (value.length > 0 && value != this.stateLocal.sousTitre) {

            // URL en fonction du mode création ou edtion
            var finUrl = id === 0 ? '' : '/' + id;

            // AJAX
            $.ajax({
                url: BASE_URI + 'parking/gestion_parking/libelle/' + value + finUrl,
                dataType: 'json',
                context: this,
                async: false,
                success: function (bExist) {
                    // Le libellé existe déjà
                    if (bExist) {
                        // Champ libelle erroné
                        retour = {
                            'data-valid': false,
                            bsStyle: 'error',
                            help: Lang.get('administration_parking.parking.libelleExists')
                        };
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
        var url = this.stateLocal.idParking === 0 ? '' : this.stateLocal.idParking;
        url = BASE_URI + 'parking/gestion_parking/' + url;
        var method = this.stateLocal.idParking === 0 ? 'POST' : 'PUT';

        // FormData
        var fData = form_data_helper('form_parking', method);

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
                    // On passe en mode edition
                    this.stateLocal.etat = pageState.edition;


                    // ID des utilsateurs associés au parking
                    tab.model.utilisateurs = _.map(tab.model.utilisateurs, function (user) {
                        return user.id.toString();
                    });

                    // Maj State local + nouveau libellé
                    this.stateLocal.idParking = tab.model.id;
                    this.stateLocal.detailParking = tab.model;
                    this.stateLocal.sousTitre = tab.model.libelle;

                    // Maj state
                    this.trigger(this.stateLocal);
                }
                // Libellé existant
                else if (tab.save == false && tab.errorBdd == false) {
                    // Notification
                    Actions.notif.error(Lang.get('administration_parking.parking.libelleExists'));
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
        var url = BASE_URI + 'parking/gestion_parking/' + this.stateLocal.idParking;
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
                    this.onDisplay_all_parkings();
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
    },



    /**
     * L'init du parking a été réalisée avec succes (GET buses, sensors, displays, counters, views)
     */
    onParking_initialized: function (idParking) {

        // Requête
        $.ajax({
            url: BASE_URI + 'parking/gestion_parking/initialized/' + idParking,
            type: 'POST',
            data: form_data_helper('form_parking', 'POST'),
            processData: false,
            contentType: false,
            dataType: 'json',
            context: this,
            success: function (tab) {
                // Sauvegarde OK
                if (tab.save) {
                    // Notification
                    Actions.notif.success(Lang.get('global.notif_success'));
                    // Maj State local
                    tab.model.utilisateurs = this.stateLocal.detailParking.utilisateurs;
                    this.stateLocal.detailParking = tab.model;
                    // Maj state
                    this.trigger(this.stateLocal);
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
    }
});
module.exports.store = storeParking;
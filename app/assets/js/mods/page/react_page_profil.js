/**
 * Created by Pierre on 16/12/2014.
 * Modified by Vivian on 20/03/2015
 */
var React = require('react/addons');
/***********************/
/* Composants Boostrap */
var Row = ReactB.Row;
var Col = ReactB.Col;

/*******   MIXIN  ************/
var AuthentMixins = require('../mixins/component_access');
var MixinGestMod = require('../mixins/gestion_modif');

/***************************/
/* Composants react  */
var BandeauVisu = require('../composants/bandeau/react_bandeau_visu');
var BandeauEdition = require('../composants/bandeau/react_bandeau_edition');
var BandeauListe = require('../composants/bandeau/react_bandeau_liste');
var BandeauGenerique = require('../composants/bandeau/react_bandeau_generique');
var DataTableBandeauProfil = require('../react_data_table_bandeau_profil');
var DataTableModule = require('../react_data_table_module').composant;

/*******************************/
// HELPERS
var pageState = require('../helpers/page_helper').pageState;
var form_data_helper = require ('../helpers/form_data_helper')

/************************************************************************************************/
/*                                                                                              */
/*                               COMPOSANT REACT PAGE PROFIL                                    */
/*                                                                                              */
/************************************************************************************************/
var ReactPageProfil = React.createClass({

    /* Ce composant gère les droits d'accès et les modifications */
    mixins: [Reflux.ListenerMixin, AuthentMixins, MixinGestMod],

    /**
     * Les props par défaut
     */
    getDefaultProps: function () {

        return {
            module_url: 'profils'
        };
    },

    /**
     * État initial des données du composant
     * @returns les données de l'état initial
     */
    getInitialState: function () {

        return {
            titrePageIni: Lang.get('global.profils'),   /* Titre initial : Profils               */
            nameProfil: '',                             /* Pas de profil de sélectionné          */
            idProfil: 0,                                /* Id NULL au début                      */
            etatPageProfil: 'liste'                     /*  Affichage initial, liste des profils */
        };
    },

    /**
     * Avant le premier Render()
     */
    componentWillMount: function () {
        /* On abonne ReactPageProfil au store "pageProfilStore" : */
        /*     - pageProfilStore, déclenché par :                 */
        /*                           - profil_create              */
        /*                           - profil_edit                */
        /*                           - profil_suppr               */
        /*                           - profil_retour              */
        /*                           - profil_save                */
        this.listenTo(pageProfilStore, this.updateState, this.updateState);
    },

    /**
     * Test si le composant doit être réaffiché avec les nouvelles données
     * @param nextProps : Nouvelles propriétés
     * @param nextState : Nouvel état
     * @returns {boolean} : true ou false selon si le composant doit être mis à jour
     */
    shouldComponentUpdate: function (nextProps, nextState) {
        return true;
    },

    handleClickProfil : function(evt) {
        Actions.profil.profil_select(_.clone(evt));
    },

    handleClickRadio: function(evt) {
        Actions.profil.radio_change(_.clone(evt));
    },

    /**
     * Retour du store "pageProfilStore", met à jour le state de la page
     * @param data
     */
    updateState: function (data) {
        // MAJ data automatique, lifecycle "UPDATE"
        this.setState(data);
    },

    getComponentSwitchState: function () {

        // Variables
        var mode = 1;
        // Paramètres pour les radios Boutons
        var aReactElements =
        {
            '1': {
                type: 'RadioBts',
                name_prefix: 'etat_',
                name_dynamic: 'id',
                libelles: [Lang.get('administration.profil.visu'), Lang.get('administration.profil.modif'), Lang.get('administration.profil.aucun')],
                values: ['visu','modif','no_access'],
                onClick: this.handleClickRadio,
                checked: 'access_level'
            }
        }

        /* Selon l'état de la page */
        switch (this.state.etatPageProfil) {

            /* On a sélectionné un profil                      */
            /* On affiche :                                    */
            /*    - le bandeau (Retour/Créer/Editer/Supprimer) */
            /*    - le nom du profil NON éditable              */
            /*    - le tableau des modules NON éditable        */
            case pageState.visu:
                return <Col md={12} key="rootPageProfil">
                    <BandeauGenerique
                        bandeauType={this.state.etatPageProfil}
                        module_url="profils"
                        titre={this.state.titrePageIni}
                        sousTitre={this.state.nameProfil}
                        confirmationOnSupprimer={false}
                    />
                    <Row>
                        <Col md={12}>
                            <DataTableModule
                                head={[Lang.get('administration.profil.module'), Lang.get('global.droits')]}
                                hide={['id']}
                                idProfil={this.state.idProfil}
                                nameProfil={this.state.nameProfil}
                                editable={false}
                                id="tab_module"
                                bUnderline={false}
                                reactElements={aReactElements} />
                        </Col>
                    </Row>
                </Col>;
                break;

            /* On édite/créer un profil             */
            /* On affiche :                         */
            /*    - le bandeau                      */
            /*    - le nom du profil EDITABLE       */
            /*    - le tableau des modules EDITABLE */
            case pageState.creation:
                mode = 0;
            case pageState.edition:
                return <Col md={12} key="rootPageProfil">
                    <BandeauGenerique
                        bandeauType={this.state.etatPageProfil}
                        module_url="profils"
                        mode={mode}
                        titre={this.state.titrePageIni}
                        sousTitre={this.state.nameProfil} />
                    <Row>
                        <Col md={12}>
                            <DataTableModule
                                head={[Lang.get('administration.profil.module'), Lang.get('global.droits')]}
                                hide={['id']}
                                editable={true}
                                idProfil={this.state.idProfil}
                                nameProfil={this.state.nameProfil}
                                id="tab_module"
                                bUnderline={false}
                                reactElements={aReactElements} />
                        </Col>
                    </Row>
                </Col>;
                break;

            /* On arrive sur la page "Profils" */
            /* On affiche :                    */
            /*    - le bandeau (Créer)         */
            /*    - le tableau des profils     */
            case pageState.liste:
            default:
                return <Col md={12}  key="rootPageProfil">

                    <BandeauGenerique
                        bandeauType={this.state.etatPageProfil}
                        module_url="profils"
                        titre={this.state.titrePageIni} />
                    <Row>
                        <Col md={12}>
                            <DataTableBandeauProfil
                                id="tableProfils"
                                head={[Lang.get('global.profils')]}
                                hide={['id']}
                                evts={{'onClick': this.handleClickProfil}} />
                        </Col>
                    </Row>
                </Col>;
                break;
        }
    },

    onRetour: function () {
        this.setState({etatPageProfil: 'liste', titrePage: Lang.get('global.profils'), idProfil: 0, nameProfil: ''});
    },


    /**
     * Méthode appellée pour construire le composant.
     * A chaque fois que son contenu est mis à jour.
     * @returns {XML}
     */
    render: function () {

        return this.getComponentSwitchState();
    }
});
module.exports = ReactPageProfil;
/************************************************************************************************/
/*                                                                                              */
/*                           FIN : COMPOSANT REACT PAGE PROFIL                                  */
/*                                                                                              */
/************************************************************************************************/


/**************************************************************************************************************/
/*                                                                                                            */
/*                                        STORES                                                              */
/*                                                                                                            */
/**************************************************************************************************************/


/************************************************************************/
/*                          PAGEPROFILSTORE                             */
/*              Store associé à la page profil                          */
/************************************************************************/
var pageProfilStore = Reflux.createStore({
    idProfilSelect: 0,
    nameProfil: '',
    isNameProfilModif: false,
    matriceBtnRadio: {},
    isMatriceModuleModif: false,

    // Initial setup
    init: function () {
        // Actions spécifiques profil
        this.listenTo(Actions.profil.profil_select, this.profilSelect);// Click ligne tableau profil

        // Toutes les actions de bandeau
        this.listenToMany(Actions.bandeau);
        // Toutes les actions de validations
        this.listenToMany(Actions.validation);
    },

    getInitialState: function () {
        return {etatPageProfil: 'liste'};
    },

    /**
     * Sélection d'une ligne de tableau
     * @param evt
     */
    profilSelect: function (evt) {
        // ID du profil selectionné
        this.idProfilSelect = $(evt.currentTarget).data('id');


        // AJAX
        $.ajax({
            url: BASE_URI + 'profils/' + this.idProfilSelect, /* correspond au module url de la BDD */
            dataType: 'json',
            context: this,
            async: false,
            success: function (data) {
                // Nom du profil
                this.nameProfil = data.traduction;
                // Envoi data
                this.trigger({
                    idProfil: this.idProfilSelect,
                    etatPageProfil: 'visu',
                    nameProfil: this.nameProfil
                });
            },
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }
        });
    },

    onCreer: function () {
        this.idProfilSelect = 0;
        this.trigger({
            etatPageProfil: 'creation',
            nameProfil: '',
            idProfil: 0
        });
    },

    onEditer: function () {
        this.trigger({etatPageProfil: 'edition'});
    },

    /**
     * Action du bouton 'supprimer'
     */
    onSupprimer: function () {

        // Vérification que le profil n'est pas associé à un utilisateur
        var suppr = this.isProfilUsed(this.idProfilSelect);

        // Un utilisateur est associé au profil, demande de confirmation de suppression
        if (suppr) {
            setTimeout(function () {
                // Boite de dialogue perso
                swal({
                        title: Lang.get('global.attention'),
                        text: Lang.get('administration.profil.supprProfilAlert'),
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonText: Lang.get('global.oui'),
                        cancelButtonText: Lang.get('global.annuler'),
                        closeOnConfirm: true
                    },
                    function (isConfirm) {
                        if (isConfirm) {
                            this.supprimerProfil();
                        }
                    }.bind(this));
            }.bind(this), 100);
        }
        // Pas d'utilisateur associé au profil
        else {
            // Boite de dialogue générique
            swal({
                title: Lang.get('global.suppression_titre'),
                text: Lang.get('global.suppression_corps'),
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: Lang.get('global.ok'),
                cancelButtonText: Lang.get('global.annuler'),
                closeOnConfirm: true
            }, function (isConfirm) {
                // Supression
                this.supprimerProfil();
            }.bind(this));
        }
    },

    /**
     * Supression du profil
     */
    supprimerProfil: function () {

        // AJAX
        $.ajax({
            url: BASE_URI + 'profils/' + this.idProfilSelect, /* correspond au module url de la BDD */
            dataType: 'json',
            context: this,
            type: 'DELETE',
            data: {'_token': $('#_token').val()},
            success: function (data) {
                // Mode liste
                this.idProfilSelect = 0;
                this.trigger({
                    idProfil: 0,
                    etatPageProfil: 'liste',
                    nameProfil: ''
                });
                // Notification OK
                Actions.notif.success(Lang.get('global.notif_success'));
            },
            error: function (xhr, status, err) {
                console.error(status, err.toString());
                Actions.notif.error('AJAX : ' + Lang.get('global.notif_erreur'));
            }
        }, this);
    },

    /**
     * Le profil est-il associé à un utilisateur
     * @param idProfil
     * @returns {boolean}
     */
    isProfilUsed: function (idProfil) {
        // Variable
        var retour = false;

        // AJAX
        $.ajax({
            url: BASE_URI + 'profils/use/' + this.idProfilSelect, /* correspond au module url de la BDD */
            dataType: 'json',
            context: this,
            async: false,
            success: function (bool) {
                retour = bool;
            },

            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }
        });

        return retour;
    },

    onSubmit_form: function () {
        // Variables
        var url = BASE_URI + 'profils/' + (this.idProfilSelect === 0 ? '' : this.idProfilSelect);
        var method = this.idProfilSelect === 0 ? 'POST' : 'PUT';
        var posts = form_data_helper('form_profil', method);

        // Requête
        $.ajax({
            url: url,
            type: 'POST',
            data: posts,
            processData: false,
            contentType: false,
            dataType: 'json',
            context: this,
            success: function (tab) {
                // Enregistrement OK
                if (tab.save) {
                    this.idProfilSelect = tab.idProfil;

                    // Passe variable aux composants qui écoutent l'action actionLoadData
                    this.trigger({
                        idProfil: tab.idProfil,
                        etatPageProfil: 'edition',
                        nameProfil: tab.nameProfil
                    });

                    // Notification OK
                    Actions.notif.success(Lang.get('global.notif_success'));
                }
                // Enregistrement KO
                else {
                    // Notification KO
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
/**************************************************************************************************************/
/*                                                                                                            */
/*                                            FIN : STORES                                                    */
/*                                                                                                            */
/**************************************************************************************************************/

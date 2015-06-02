var React = require('react/addons');
require('sweetalert');
/**
 * Created by Yann on 15/11/2014.
 * Inclusion des libs globales (ex: React, jQuery) installées via NPM
 * Parsé ensuite par gulp et browserify pour aller dans le dossier public
 */

(function (global) {
    /*
     |--------------------------------------------------------------------------
     | INCLUSIONS DE MODULES GLOBAUX
     |--------------------------------------------------------------------------
     */
    global._ = require('lodash');
    global.Reflux = require('reflux');
    global.ReactB = require('react-bootstrap');

    /*
     |--------------------------------------------------------------------------
     | DEFINITION DE GLOBALES
     |--------------------------------------------------------------------------
     */
    // URL de base du projet. Définie en PHP dans structure.blade.php, ici juste pour référence IDE.
    global.BASE_URI;
    global.STORAGE_URI = global.BASE_URI + 'app/storage/';
    global.DOC_URI = global.STORAGE_URI + 'documents/';
    global.ALLOW_BLOCK_UI = true;

    /*
     |--------------------------------------------------------------------------
     | ACTIONS GLOBALES REFLUX
     |--------------------------------------------------------------------------
     */
    global.Actions = {};
    global.Actions.global = Reflux.createActions([
        "table_bandeau_line_clicked",
        "gestion_modif_change",
        "gestion_modif_reset"
    ]);

    /*
     |--------------------------------------------------------------------------
     | ACTIONS VALIDATION REFLUX
     |--------------------------------------------------------------------------
     */
    global.Actions.validation = Reflux.createActions([
        "form_field_changed", // Appellée quand la valeur d'un champ de formulaire est modifié
        "form_field_verif",   // Appellée quand la valeur d'un champ de formulaire est valide
        "verify_form_save",   // Appellée quand le form est validé par l'utilisateur
        "submit_form"        // Appellée quand le form est validé par l'utilisateur et que les champs sont bons
    ]);

    /*
     |--------------------------------------------------------------------------
     | ACTIONS NOTIFICATIONS REFLUX
     |--------------------------------------------------------------------------
     */
    global.Actions.notif = Reflux.createActions([
        "success",
        "warning",
        "error",
        "default"
    ]);

    /*
     |--------------------------------------------------------------------------
     | ACTIONS MENU REFLUX
     |--------------------------------------------------------------------------
     */
    global.Actions.menu = Reflux.createActions([
        "menu_top_did_mount",
        "menu_left_did_mount"
    ]);

    /*
     |--------------------------------------------------------------------------
     | ACTIONS CARTE REFLUX
     |--------------------------------------------------------------------------
     */
    global.Actions.map = Reflux.createActions([
        // ACTIONS MAP GENERALES
        "map_initialized",
        // ACTIONS DE DESSIN
        "draw_created",
        "draw_deleted",
        "draw_drawstart",
        "draw_drawstop",
        "draw_editstart",
        "draw_editstop",
        "draw_deletestart",
        "draw_deletestop",
        // ACTIONS DE CHANGMENT MODE DE DESSIN
        "mode_place",
        "mode_place_auto",
        "mode_allee",
        "mode_zone",
        "mode_afficheur",
        "mode_calibre",
        "mode_capteur",
        // ACTIONS POUR LES MODALES
        "pm_creer", // places multiples
        // ACTIONS DE RAFRAICHISSEMENT
        "refresh_places",
        "refresh_afficheurs",
        // CHANGEMENT DE PLAN
        "plan_selected",
        // MODALE CAPTEURS DE PLACE
        "init_modale",
        "liste_concentrateurs",
        "liste_buses",
        "liste_capteurs",
        "start_affectation_capteurs",
        "stop_affectation_capteurs"
    ]);

    /*
     |--------------------------------------------------------------------------
     | ACTIONS BANDEAU REFLUX
     |--------------------------------------------------------------------------
     */
    global.Actions.bandeau = Reflux.createActions([
        "creer",
        "editer",
        "supprimer",
        "sauvegarder",
        "retour", // /!\ NE PAS ECOUTER SI VOUS VOULEZ LA GESTION DES MODIFS IMPLEMENTER LE MIXIN GESTMOD DANS LA PAGE /!\
        "boutons_perso"
    ]);

    /*
     |--------------------------------------------------------------------------
     | ACTIONS USER REFLUX
     |--------------------------------------------------------------------------
     */
    global.Actions.utilisateur = Reflux.createActions([
        "load_data_all_users",
        "display_user",
        "load_user_info",
        "save_user",
        "edit_user",
        "create_user",
        "delete_user",
        "changePhoto",
        "saveOK",
        "supprOK",
        "updateBandeau",
        "updateHideShowProfil",
        "set_etat_compte",
        "set_initial_state"
    ]);

    global.Actions.etats_d_occupation = Reflux.createActions([
        "select",
        "getInfosEtatsDoccupation",
        "show",
        "goModif",
        "setLibelle"
    ]);

    /*
     |--------------------------------------------------------------------------
     | ACTION PROFIL REFLUX
     |--------------------------------------------------------------------------
     */
    global.Actions.profil = Reflux.createActions([
        "profil_select", /* Sélection d'une ligne sur le tableau profil                                          */
        "profil_update", /* Recharge les données du tableau des profils                                          */
        "module_update", /* Recharge les données du tableau des modules                                          */
        "radio_change", /* Action déclenchée lors du changement d'état d'un radio bouton du tableau des modules */
        "libelle_change", /* Onchange du libelle du profil                                                        */
    ]);

    /*
     |--------------------------------------------------------------------------
     | ACTIONS JOURS PREDEFINIS
     |--------------------------------------------------------------------------
     */
    global.Actions.jours = Reflux.createActions([
        "display_detail_jour", /* Sélection d'une ligne sur le tableau profil                                          */
        "display_all_jours" /* Affiche tous les jours prédéfinis */
    ]);

    /*
     |--------------------------------------------------------------------------
     | ACTIONS CALENDRIER PROGRAMMATION
     |--------------------------------------------------------------------------
     */
    global.Actions.calendrier = Reflux.createActions([
        "display_calendar", /* Sélection d'une ligne sur le tableau parking */
        "add_days", // Ajoute un ou plusieurs jours au celndrier
        "prev_year", // Année précédente
        "next_year" // Année suivante
    ]);

    /*
     |--------------------------------------------------------------------------
     | ACTIONS NIVEAU
     |--------------------------------------------------------------------------
     */
    global.Actions.niveau = Reflux.createActions([
        "display_all_niveaux", // affiche tous les niveaux
        "display_detail_niveau", // affiche le détail du niveau
        "add_upload", // ajoute une ligne d'upload
        "del_upload" // supprime une ligne d'upload
    ]);

})(window);


$(function () {

    /*
     |--------------------------------------------------------------------------
     | GESTION DES NOTIFICATIONS
     |--------------------------------------------------------------------------
     */
    var Notify = require('../mods/composants/react_notify');
    React.render(<Notify />, document.getElementById('composant_react_notifications'));

    $(document).bind('keydown', function (e) {
        if (e.ctrlKey && (e.which == 83)) {
            e.preventDefault();
            swal('Raté ! Si tu veux vraiment sauvegarder la page, utilise le menu de ton navigateur.');
        }
    });

    /*
     |--------------------------------------------------------------------------
     | GESTION DU BLOCKAGE UI SUR REQUÊTE AJAX
     |--------------------------------------------------------------------------
     */
    $(document).ajaxStart(function () {
        if (ALLOW_BLOCK_UI) {
            $.blockUI({
                message: '<div class="alert alert-warning" role="alert" style="margin:0"><h1 style="margin:0"><div id="facebookG"><div id="blockG_1" class="facebook_blockG"></div><div id="blockG_2" class="facebook_blockG"></div><div id="blockG_3" class="facebook_blockG"></div></div>' + Lang.get('global.block_ui') + '</h1></div>',
                baseZ: 9999, // POUR PASSER PAR DESSUS LES MODALES BOOTSTRAP
                css: {
                    'border-radius': '5px',
                    'border-color': '#E7CC9D'
                },
                fadeOut: 50,
                fadeIn: 100
            });
        }
    }).ajaxStop(function () {
        $.unblockUI();
    });
});

module.exports = {};
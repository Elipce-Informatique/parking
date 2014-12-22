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
    global.$ = global.jQuery = require('jquery');
    global.Parsley = require('parsleyjs');
    global.React = require('react/addons');
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
     | ACTIONS BANDEAU REFLUX
     |--------------------------------------------------------------------------
     */
    global.Actions.bandeau = Reflux.createActions([
        "creer",
        "editer",
        "supprimer",
        "sauvegarder",
        "retour", // NE PAS ECOUTER SI VOUS VOULEZ LA GESTION DES MODIFS
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
        "delete_user"
    ]);

    /*
     |--------------------------------------------------------------------------
     | ACTION PROFIL REFLUX
     |--------------------------------------------------------------------------
     */
    global.Actions.profil = Reflux.createActions([
        "profil_select", /* Sélection d'une ligne sur le tableau profil                                          */
        "profil_update", /* Action déclenchée depuis la sauvegarde d'un profil                                   */
        "radio_change",  /* Action déclenchée lors du changement d'état d'un radio bouton du tableau des modules */
        "libelle_change" /* Onchange du libelle du profil                                                        */
    ]);
})(window);

/*
 |--------------------------------------------------------------------------
 | GESTION DES NOTIFICATIONS
 |--------------------------------------------------------------------------
 */
$(function(){
    var Notify = require('../mods/composants/react_notify');
    React.render(<Notify />, document.getElementById('composant_react_notifications'))
});
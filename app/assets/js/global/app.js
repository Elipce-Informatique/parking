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
    global.React = require('react/addons');
    global._ = require('lodash');
    global.Reflux = require('reflux');
    global.ReactB = require('react-bootstrap');


    /*
     |--------------------------------------------------------------------------
     | DEFINITION DE CONSTANTESDEFINITION DE CONSTANTES
     |--------------------------------------------------------------------------
     */
    // URL de base du projet. Définie en PHP (structure.blade.php), ici juste pour référence.
    global.BASE_URI;

    /*
     |--------------------------------------------------------------------------
     | ACTIONS GLOBALES REFLUX
     |--------------------------------------------------------------------------
     */
    global.Actions = {};
    global.Actions.global = Reflux.createActions([
        "table_bandeau_line_clicked"
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
     | ACTIONS USER REFLUX
     |--------------------------------------------------------------------------
     */
    global.Actions.utilisateur = Reflux.createActions([
        "load_data",
        "display_user"
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
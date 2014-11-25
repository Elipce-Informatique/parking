/**
 * Created by Yann on 15/11/2014.
 * Inclusion des libs globales (ex: React, jQuery) installées via NPM
 * Parsé ensuite par gulp et browserify pour aller dans le dossier public
 */

/*
 |--------------------------------------------------------------------------
 | INCLUSIONS DE MODULES GLOBAUX
 |--------------------------------------------------------------------------
 */
window.$ = window.jQuery = require('jquery');
window.React = require('react/addons');
window._ = require('underscore/underscore');
window.Reflux = require('reflux');
window.ReactB = require('react-bootstrap');


/*
 |--------------------------------------------------------------------------
 | DEFINITION DE CONSTANTESDEFINITION DE CONSTANTES
 |--------------------------------------------------------------------------
 */
// URL de base du projet. Définie en PHP (structure.blade.php), ici juste pour référence.
window.BASE_URI;

/*
 |--------------------------------------------------------------------------
 | ACTIONS GLOBALES REFLUX
 |--------------------------------------------------------------------------
 */
window.Actions = Reflux.createActions([
    "tableBandeauLineClicked"
]);

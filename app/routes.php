<?php

/*
|--------------------------------------------------------------------------
| Filtres Globaux à l'application
|--------------------------------------------------------------------------
*/
Route::when('*', 'csrf', array('post', 'put', 'delete', 'patch'));

/*
|--------------------------------------------------------------------------
| Routes non-ressources de l'application
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/

Route::get('/', ['as' => 'index', 'uses' => 'SessionsController@create']);
Route::controller('password', 'RemindersController');

/*
|--------------------------------------------------------------------------
| Ressource Authentification
|--------------------------------------------------------------------------
|
| Gestion de l'authentification utilisateur
|
*/
Route::resource('sessions', 'SessionsController');

// Alias d'URL
Route::get('login', 'SessionsController@create');
Route::get('logout', 'SessionsController@destroy');


/*
|--------------------------------------------------------------------------
| GROUPE UTILISATEUR AUTHENTIFIE SIMPLE
|--------------------------------------------------------------------------
|
| Gestion des routes qui nécessitent d'être authentifié mais pas d'avoir
| des droits spécifiques.
|
*/
Route::group(['before' => 'auth'], function () {
    // PAGE D'ACCUEIL
    Route::get('accueil', 'AccueilController@index');
    // FICHE UTILISATEUR
    Route::get('moncompte', 'UtilisateurController@compte');
    Route::put('moncompte', 'UtilisateurController@updateCompte');
    Route::get('moncompte/verifMPD/{pass}', 'UtilisateurController@verifMDPcompte');
});

/*
|--------------------------------------------------------------------------
| GROUPE UTILISATEUR AUTHENTIFIE + DROITS ACCESS
|--------------------------------------------------------------------------
|
| Gestion des routes qui nécessitent d'être authentifié ET d'avoir
| des droits spécifiques.
|
*/
Route::group(['before' => 'auth|auth.canaccess'], function () {


    /* **************************************************************************
    * ADMINISTRATION PORTAIL
    */
    Route::get('administration', ['as' => 'administration', 'uses' => 'AdministrationController@index']);
    /*
     * Gestion des utilisateurs
     */
    Route::get('utilisateur/all', 'UtilisateurController@all');
    Route::get('utilisateur/profil/{idUser}', 'UtilisateurController@getProfilsUsers');
    Route::resource('utilisateur', 'UtilisateurController');
    Route::get('utilisateur/email/{email}/{id?}', 'UtilisateurController@isMailExists');

    /*
     * Gestion profils (association profiles module)
     */
    Route::get('profils/all', 'ProfilController@all');
    Route::get('profils/{profils}/modules', 'ProfilController@getProfilModule');
    Route::resource('profils', 'ProfilController');
    Route::get('module/all', 'ProfilController@getModules');
    Route::get('profils/libelle/{libelle}/{id?}', 'ProfilController@getProfilExistLibelle');
    Route::get('profils/use/{profil}', 'ProfilController@isProfilUsed');

    /* **************************************************************************
     * ADMINISTRATION PARKING
     */
    Route::get('administration_parking', ['as' => 'administration_parking', 'uses' => 'AdministrationParkingController@index']);

    /*
     * Etats d'occupation (d'une place de parking, menu Administration parking)
     */
    Route::get('etats_d_occupation', ['as' => 'etats_d_occupation', 'uses' => 'EtatsDoccupationController@index']);
    Route::get('etats_d_occupation/all', 'EtatsDoccupationController@all');
    Route::get('etats_d_occupation/{id}', 'EtatsDoccupationController@show');
    Route::get('etats_d_occupation/libelle/{libelle}', 'EtatsDoccupationController@getLibelleExist');
    Route::resource('etats_d_occupation', 'EtatsDoccupationController');

    /*
     * Configuration d'un parking
     */
    Route::resource('configuration_parking', 'ConfigurationParkingController');

    /* **************************************************************************
     * SUPERVISION PARKING
     */
    Route::get('supervision', ['as' => 'supervision_parking', 'uses' => 'SupervisionParkingController@index']);
    Route::get('visualisation', 'SupervisionParkingController@visualisation');
    Route::get('commandes_forcees', 'SupervisionParkingController@commandes');

    /* **************************************************************************
     * CALENDRIER PARKING
     */
    Route::resource('calendrier', 'CalendrierController');

    /*
     * Jours prédéfinis
     */
    Route::get('calendrier_jours/all', 'CalendrierJoursController@all');
    Route::get('calendrier_jours/libelle/{libelle}/{id?}', 'CalendrierJoursController@verifLibelle');
    Route::resource('calendrier_jours', 'CalendrierJoursController');

    /*
     * Programmation horaire
     */
    Route::get('calendrier_programmation/all', 'CalendrierProgrammationController@all');
    Route::get('calendrier_programmation/libelle/{libelle}/{id?}', 'CalendrierProgrammationController@verifLibelle');
    Route::resource('calendrier_programmation', 'CalendrierProgrammationController');


    /* **************************************************************************
     * Test
     */
    Route::resource('test', 'TestController');
});

/*
|--------------------------------------------------------------------------
| GROUPE UTILISATEUR AUTHENTIFIE + DROITS ACCESS + DROIT PARKING
|--------------------------------------------------------------------------
|
| Gestion des routes qui nécessitent d'être authentifié ET d'avoir
| des droits spécifiques.
|
*/
Route::group(['before' => 'auth|auth.canaccess|auth.parking', 'prefix' => 'parking'], function () {
    Route::resource('niveau', 'NiveauxController');
    Route::resource('afficheur', 'AfficheursController');
    Route::resource('zone', 'ZonesController');
    Route::resource('allee', 'AlleesController');
    Route::resource('place', 'PlacesController');
    Route::resource('capteur', 'CapteursController');

    // Type place
    Route::get('type_place/all', 'TypesPlacesController@showAll');
    Route::resource('type_place', 'TypesPlacesController');

    // Journaux
    Route::get('journal_equipement', 'JournalEquipementNiveauController@index');
    Route::get('journal_equipement/{parkingId}', 'JournalEquipementNiveauController@show');
    Route::get('journal_equipement/{parkingId}/{journalId}', 'JournalEquipementNiveauController@showFromVersion');
    Route::get('journal_place/{parkingId}/{journalId}', 'JournalEquipementNiveauController@showPlacesFromVersion');
    Route::resource('simulator', 'SimulatorController');
});

Route::group(['before' => 'auth|auth.canaccess|auth.parking'], function () {
    Route::resource('parking', 'ParkingsController'); // url ressource /parking
});

/*
|--------------------------------------------------------------------------
| GROUPE API MENU
|--------------------------------------------------------------------------
|
| Gestion des routes qui fournissent les données pour le menu
|
*/
Route::group(['before' => 'auth', 'prefix' => 'menu'], function () {
    // MENU TOP RESTFUL
    Route::get('top_from_auth', 'MenuController@menuTopItemsFromSession');
    Route::get('top_user_from_auth', 'MenuController@menuTopInfosUserFromSession');
});

/*
|--------------------------------------------------------------------------
| TESTS EN DUR
|--------------------------------------------------------------------------
*/
// test de parapetres ajax, retourne tout ce qui est passé en paramètres
Route::post('post_dump', function () {
    dd(Input::all());
});
Route::get('test_carte', 'TestController@indexCarte');

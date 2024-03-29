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
    Route::post('moncompte/preferences_supervision', 'UtilisateurController@setPreferenceSupervision');
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

    // Jours prédéfinis
    Route::get('calendrier_jours/all', 'CalendrierJoursController@all');
    Route::get('calendrier_jours/libelle/{libelle}/{id?}', 'CalendrierJoursController@verifLibelle');
    Route::resource('calendrier_jours', 'CalendrierJoursController');

    //  Programmation horaire
    Route::get('calendrier_programmation/init', 'CalendrierProgrammationController@init');
    Route::get('calendrier_programmation/visu/{parking}/{annee}', 'CalendrierProgrammationController@visu');
    Route::resource('calendrier_programmation', 'CalendrierProgrammationController');


    // Niveaux
    Route::get('niveau', 'NiveauxController@index');

    // Alertes
    Route::get('alerte', 'AlerteController@index');

    // Parking
    Route::get('gestion_parking', 'ParkingsController@index');

    /* **************************************************************************/
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

    // TREEVIEWS
    Route::get('treeview_carte', 'ConfigurationParkingController@menuTreeView');

    // GESTION PLANS ET NIVEAUX
    Route::get('plan/{id}/places', 'PlansController@showWithPlaces');
    Route::post('plan/{id}/calibre', 'PlansController@updateCalibre');
    Route::get('niveau/{id}/places', 'NiveauxController@showWithPlaces');
    Route::get('niveau/{id}/afficheurs', 'NiveauxController@getAfficheurs');
    Route::get('bus/{busId}/{legNum}/max_noeud', 'BusController@maxNoeudOnLeg');

    // SEULEMENT DES DATA, jamais du HTML (créer d'autres routes pour les pages d'adiministration des niveaux, zones, allées)
    Route::get('niveau/all', 'NiveauxController@all');
    Route::get('niveau/libelle/{libelle}/{id?}', 'NiveauxController@verifLibelle');

    // GESTION ZONES ALLEES PLACES, AFFICHEURS
    Route::delete('afficheur/delocate_many', 'AfficheursController@delocateMany');
    Route::post('afficheur/{id}/setGeometry', 'AfficheursController@setGeometry');
    Route::post('afficheur/{id}/set_counters_views', 'AfficheursController@setCountersViews');
    Route::patch('afficheur/{id}/reset', 'AfficheursController@reset');
    Route::get('afficheur/updateAfficheurs', 'AfficheursController@updateAfficheurs');
    Route::get('afficheur/{id}/places', 'AfficheursController@getPlaces');
    Route::delete('allee/delete_many', 'AlleesController@destroyMany');
    Route::delete('place/delete_many', 'PlacesController@destroyMany');
    Route::post('place/{id}/setCapteur', 'PlacesController@setCapteur');
    Route::post('capteur/create_virtuels', 'CapteursController@create_virtuels');
    Route::delete('capteur/delete/{busId}/{leg}/{num}', 'CapteursController@deleteFromNum');
    Route::patch('place/update_places_geo', 'PlacesController@updatePlacesGeo');
    Route::patch('place/{id}', 'PlacesController@updatePlace');
    Route::delete('zone/delete_many', 'ZonesController@destroyMany');

    // GESTION PARKING
    Route::get('gestion_parking/all', 'ParkingsController@all');
    Route::get('gestion_parking/libelle/{libelle}/{id?}', 'ParkingsController@verifLibelle');
    Route::post('gestion_parking/initialized/{id}', 'ParkingsController@initialized');
    Route::put('gestion_parking/update_state/{id}', 'ParkingsController@updateState');

    // ALERTES et RESERVATIONS
    Route::get('alerte/all/{id}', 'AlerteController@all');

    // RESSOURCES DÉPENDANT D'UN PARKING
    Route::resource('alerte', 'AlerteController');
    Route::resource('niveau', 'NiveauxController');
    Route::resource('plan', 'PlansController');
    Route::resource('afficheur', 'AfficheursController');
    Route::resource('zone', 'ZonesController');
    Route::resource('allee', 'AlleesController');
    Route::resource('place', 'PlacesController');
    Route::resource('capteur', 'CapteursController');
    Route::resource('gestion_parking', 'ParkingsController');

    // TYPE PLACE
    Route::get('type_place/all', 'TypesPlacesController@showAll');
    Route::resource('type_place', 'TypesPlacesController');

    // JOURNAL EQUIPEMENTS
    Route::get('journal_equipement', 'JournalEquipementPlanController@index');
    Route::get('journal_equipement/last/{planId}', 'JournalEquipementPlanController@last');
    Route::get('journal_equipement/{planId}', 'JournalEquipementPlanController@show');
    Route::get('journal_equipement/{planId}/{journalId}', 'JournalEquipementPlanController@showFromVersion');
    Route::get('journal_place/{planId}/{journalId}', 'JournalEquipementPlanController@showPlacesFromVersion');

    // JOURNAL ALERTES
    Route::get('journal_alerte/last/{planId}', 'JournalAlerteController@last');
    Route::get('journal_alerte/{parkingId}/{planId}', 'JournalAlerteController@showFromVersion');


    // CONFIGURATION ÉQUIPMENT
    Route::get('config_equipement/all', 'ConfigEquipementController@all');
    Route::get('config_equipement/combo_all', 'ConfigEquipementController@comboAll');
    Route::resource('config_equipement', 'ConfigEquipementController');

    // SIMULATEUR
    Route::get('simulator/capteurs', 'SimulatorController@capteurs');
    Route::get('simulator/foire/{planId}', 'SimulatorController@foire');
    Route::get('simulator/alertes', 'SimulatorController@alertes');
    Route::resource('simulator', 'SimulatorController');
});

// RESSOURCE PARKING SÉPARÉE DU GROUPE AVEC PRÉFIXE PARKING POUR DES RAISONS LOGIQUES
Route::group(['before' => 'auth|auth.canaccess|auth.parking'], function () {
    Route::get('parking/{id}/concentrateurs', 'ParkingsController@getConcentrateurs');
    Route::get('parking/{id}/afficheurs_libres', 'ParkingsController@getAfficheursLibre');
    Route::get('parking/{id}/afficheurs_get', 'ParkingsController@getAfficheursGet');
    Route::get('parking/{id}/tableau_bord', 'ParkingsController@getTableauBordData');
    Route::resource('parking', 'ParkingsController');
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

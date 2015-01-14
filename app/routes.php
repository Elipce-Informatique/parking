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

Route::get('/', ['as'=>'index', 'uses'=>'SessionsController@create']);
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
    // GESTION DES UTILISATEURS
    Route::get('utilisateur/all', 'UtilisateurController@all');
    Route::get('utilisateur/profil/{idProfil}', 'UtilisateurController@getUserAndProfil');
    Route::resource('utilisateur', 'UtilisateurController');
    Route::get('utilisateur/email/{email}', 'UtilisateurController@getUserExist');

    // GESTION PROFILS (association profiles module)
    Route::get('profils/all', 'ProfilController@all');
    Route::get('profils/{profils}/modules', 'ProfilController@getProfilModule');
    Route::resource('profils', 'ProfilController');
    Route::get('module/all', 'ProfilController@getModules');
    Route::get('profils/libelle/{libelle}', 'ProfilController@getProfilExistLibelle');

    // administration
    Route::get('administration',['as'=>'administration', 'uses'=>'AdministrationController@index'] );

    // test
    Route::resource('test', 'TestController');
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
Route::get('test', 'TestController@index');
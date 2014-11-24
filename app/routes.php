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

Route::get('/', 'SessionsController@create');
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

Route::group(['before' => 'auth'], function () {
    Route::get('accueil', 'AccueilController@index');

    /*
    |--------------------------------------------------------------------------
    | Ressource utilisateurs
    |--------------------------------------------------------------------------
    |
    | Gestion des informations utilisateur
    |
    */
    Route::get('utilisateur/all', 'UtilisateurController@all');
    Route::resource('utilisateur', 'UtilisateurController');
    Route::get('logout', 'SessionsController@destroy');
});


/*
|--------------------------------------------------------------------------
| TESTS
|--------------------------------------------------------------------------
*/
Route::get('test', 'TestController@index');
<?php

use Illuminate\Redis\Database;
/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/

Route::get('/', 'SessionsController@create');
Route::get('/accueil', function(){
//    Utilisateur::create(['nom'=>'perez','email'=>'vivian.perez@elipce.com','password'=>Hash::make('elipce05')]);
    return 'Page d\'accueil de l\'appli de la mort qui tue';
});


Route::get('/utilisateur', 'UtilisateurController@index');
/*
|--------------------------------------------------------------------------
| Authentification  Routes
|--------------------------------------------------------------------------
|
| Gestion de l'authentification utilisateur
|
*/
Route::resource('sessions', 'SessionsController');

// Alias d'URL
Route::get('login', 'SessionsController@create');
Route::get('logout', 'SessionsController@destroy');


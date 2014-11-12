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

Route::get('/', 'HomeController@showWelcome');


/*
|--------------------------------------------------------------------------
| Authentification  Routes
|--------------------------------------------------------------------------
|
| Gestion du l'authentification utilisateur
|
*/
Route::get('login', 'SessionController@create');
Route::get('logout', 'SessionController@destroy');

Route::resource('session', 'SessionController');

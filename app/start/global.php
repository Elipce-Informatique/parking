<?php

/*
|--------------------------------------------------------------------------
| Register The Laravel Class Loader
|--------------------------------------------------------------------------
|
| In addition to using Composer, you may use the Laravel class loader to
| load your controllers and models. This is useful for keeping all of
| your classes in the "global" namespace without Composer updating.
|
*/

ClassLoader::addDirectories(array(

    app_path() . '/commands',
    app_path() . '/controllers',
    app_path() . '/models',
    app_path() . '/database/seeds',

));

/*
|--------------------------------------------------------------------------
| Application Error Logger
|--------------------------------------------------------------------------
|
| Here we will configure the error logger setup for the application which
| is built on top of the wonderful Monolog library. By default we will
| build a basic log file setup which creates a single file for logs.
|
*/
use Monolog\Logger;
use Monolog\Handler\RotatingFileHandler;
use Monolog\Formatter\LineFormatter;

$formatter = new LineFormatter(null, null, true, false);

$handler = new RotatingFileHandler(storage_path() . '/logs/100-debug.log', 0, Logger::DEBUG);
$handler->setFormatter($formatter);
Log::getMonolog()->pushHandler($handler);

$handler = new RotatingFileHandler(storage_path() . '/logs/200-info.log', 0, Logger::INFO);
$handler->setFormatter($formatter);
Log::getMonolog()->pushHandler($handler);

$handler = new RotatingFileHandler(storage_path() . '/logs/250-notice.log', 0, Logger::NOTICE);
$handler->setFormatter($formatter);
Log::getMonolog()->pushHandler($handler);

$handler = new RotatingFileHandler(storage_path() . '/logs/300-warning.log', 0, Logger::WARNING);
$handler->setFormatter($formatter);
Log::getMonolog()->pushHandler($handler);

$handler = new RotatingFileHandler(storage_path() . '/logs/400-error.log', 0, Logger::ERROR);
$handler->setFormatter($formatter);
Log::getMonolog()->pushHandler($handler);

$handler = new RotatingFileHandler(storage_path() . '/logs/500-critical.log', 0, Logger::CRITICAL);
$handler->setFormatter($formatter);
Log::getMonolog()->pushHandler($handler);

$handler = new RotatingFileHandler(storage_path() . '/logs/550-alert.log', 0, Logger::ALERT);
$handler->setFormatter($formatter);
Log::getMonolog()->pushHandler($handler);

$handler = new RotatingFileHandler(storage_path() . '/logs/600-emergency.log', 0, Logger::EMERGENCY);
$handler->setFormatter($formatter);
Log::getMonolog()->pushHandler($handler);

/*
|--------------------------------------------------------------------------
| Application Error Handler
|--------------------------------------------------------------------------
|
| Here you may handle any errors that occur in your application, including
| logging them or displaying custom views for specific errors. You may
| even register several error handlers to handle different types of
| exceptions. If nothing is returned, the default error view is
| shown, which includes a detailed stack trace during debug.
|
*/

App::error(function (Exception $exception, $code) {
    Log::error($exception);
});

/*
|--------------------------------------------------------------------------
| Maintenance Mode Handler
|--------------------------------------------------------------------------
|
| The "down" Artisan command gives you the ability to put an application
| into maintenance mode. Here, you will define what is displayed back
| to the user if maintenance mode is in effect for the application.
|
*/

App::down(function () {
    return Response::make("Be right back!", 503);
});

/*
|--------------------------------------------------------------------------
| Require The Filters File
|--------------------------------------------------------------------------
|
| Next we will load the filters file for the application. This gives us
| a nice separate location to store our route and application filter
| definitions instead of putting them all in the main routes file.
|
*/

require app_path() . '/filters.php';


Utilisateur::creating(function ($post) {
    if (Auth::check()) {
        $post->created_by = Auth::user()->id;
        $post->updated_by = Auth::user()->id;
    }
});

Utilisateur::updating(function ($post) {
    if (Auth::check()) {
        $post->updated_by = Auth::user()->id;
    }
});

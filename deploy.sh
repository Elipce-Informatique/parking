#!/bin/sh

git pull --ff-only origin p022-beauvais
npm update
php /bin/composer.phar update
gulp deploy
php artisan migrate

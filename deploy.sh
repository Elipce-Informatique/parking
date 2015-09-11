#!/bin/sh

git pull --ff-only origin p023-annecy
npm update
php /bin/composer.phar update
gulp deploy

#!/bin/sh

git pull --ff-only origin branch
npm update
php /bin/composer.phar update
gulp deploy

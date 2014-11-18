/**
 * Created by Yann on 15/11/2014.
 * Inclusion des libs globales (ex: React, jQuery) installées via NPM
 * Parsé ensuite par gulp et browserify pour aller dans le dossier public
 */


window.$ = window.jQuery = require('jquery');
window.React = require('react/addons');
window._ = require('underscore/underscore');

/**
 * Created by Yann on 15/11/2014.
 * Inclusion des libs globales (ex: React, jQuery) installées via NPM
 * Parsé ensuite par gulp et browserify pour aller dans le dossier public
 */

(function (global) {
    /*
     |--------------------------------------------------------------------------
     | INCLUSIONS DE MODULES GLOBAUX
     |--------------------------------------------------------------------------
     */
    global.$ = global.jQuery = require('jquery');
    global.$(document).ajaxStart(function () {
        console.log('PASS AJAX START');
        global.$.blockUI({
            message: '<div class="alert alert-warning" role="alert" style="margin:0"><h1 style="margin:0"><div id="facebookG"><div id="blockG_1" class="facebook_blockG"></div><div id="blockG_2" class="facebook_blockG"></div><div id="blockG_3" class="facebook_blockG"></div></div>' + Lang.get('global.block_ui') + '</h1></div>',
            baseZ: 9999, // POUR PASSER PAR DESSUS LES MODALES BOOTSTRAP
            css: {
                'border-radius': '5px',
                'border-color': '#E7CC9D'
            }
        });
    }).ajaxStop(function () {
        console.log('PASS AJAX STOP');
        global.$.unblockUI();
    });
})(window);

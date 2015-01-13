/**
 * Created by yann on 13/01/2015.
 */
var Validator = require('validator');

/**
 * Rempli un objet de type FormData avec les données du formulaire désigné par l'id passé en paramètres.
 * @param formId : id du formulaire
 * @param method : Facultatif, par déffaut à POST. Les valeurs suivantes sont acceptées:
 * GET, POST, PUT, PATCH, DELETE à ajouter pour Laravel
 * @return FormData : l'objet FormData rempli avec les données du formulaire et le token
 */
var formDataBuilder = function (formId, method) {

    // REMPLISSAGE DU FORMULAIRE AVEC LES DONNÉES
    var fData = new FormData($('#' + formId)[0]);

    // AJOUT DE LA MÉTHODE
    var methode = 'POST';
    if (typeof(method) == 'string') {
        methode = Validator.matches(method, /^(GET|POST|PUT|PATCH|DELETE)$/) ? method.toUpperCase() : 'POST';
    }
    fData.append('_method', methode);

    // AJOUT DU TOKEN
    fData.append('_token', $('#_token').val());

    return fData;
};

module.exports.formDataBuilder = formDataBuilder;
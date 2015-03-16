/**
 * Created by yann on 05/01/2015.
 */

var storeVerif = Reflux.createStore({
    getInitialState: function () {
        return {};
    },
    // Initial setup
    init: function () {
        // Register statusUpdate action
        this.listenTo(Actions.validation.verify_form_save, this.triggerValidation);
    },
    triggerValidation: function (data) {
        this.trigger(data);
    }
});

/**
 * Ce mixin doit être implémenté dans le composant qui contient le formulaire à l'intérieur de son DOM
 * Il se base sur getDOMNode pour récupérer les infos dans le form.
 * @type {{componentWillMount: Function, verifyForm: Function}}
 */
var FormValidationMixin = {
    componentWillMount: function () {
        // CHECK MIXIN
        if (typeof(this.listenTo) == 'undefined') {
            console.error('Oulalalala, tu n\'as pas mis le mixin Reflux.ListenerMixin dans ton composant "' +
            this._currentElement.type.displayName + '" !!! Corrige vite ça si tu veux que ça marche !');
        } else {
            this.listenTo(storeVerif, this.verifyForm);
        }
    },
    /**
     * Data au cas ou action perso ??
     * @param data
     */
    verifyForm: function (data) {

        // Récupération du formulaire
        var $form = $(this.getDOMNode());

        // Test si champs invalides
        if ($form.find('[data-valid=false]').length == 0) {
            Actions.validation.submit_form(this.getDOMNode());
        }

        // Tout va très bien, on peut enregistrer !
        else {
            $.notify(Lang.get('global.form_incorrect'), 'error');
        }
    }
};

module.exports = FormValidationMixin
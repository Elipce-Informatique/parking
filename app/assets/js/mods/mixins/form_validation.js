/**
 * Created by yann on 05/01/2015.
 */

var storeVerif = Reflux.createStore({
    // Initial setup
    init: function () {
        // Register statusUpdate action
        this.listenTo(Actions.validation.verify_form_save, this.triggerValidation);
    },
    triggerValidation: function (form_id) {
        this.trigger(form_id);
    }
});

/**
 * Ce mixin écoute le store vérif déclaré ci-dessus pour appeller la méthode verifyForm
 * quand l'action de sauvegarde "validation.verify_form_save" est lancée.
 *
 * La méthode verifyForm sélectionne le DOMNode du composant react courant (contenant le form dans sa
 * déscendance), puis vérifie qu'aucun data-valid=false n'est présent dans les enfants du form.
 *
 * @type {{componentWillMount: Function, verifyForm: Function}}
 */
var FormValidationMixin = {
    componentWillMount: function () {
        // CHECK MIXIN
        if (typeof(this.listenTo) == 'undefined') {
            console.error('Oulalalala, tu n\'as pas mis le mixin Reflux.ListenerMixin dans ton composant "' +
            this._reactInternalInstance._currentElement.type.displayName + '" !!! Corrige vite ça si tu veux que ça marche !');
        } else {
            this.listenTo(storeVerif, this.verifyForm);
        }
    },
    /**
     * Test si on a des éléments invalides dans le formulaire du composant courant
     * SI on est bien sur le formulaire désigné par l'ID passé en paramètre
     *
     * @param form_id : id du formulaire à tester
     */
    verifyForm: function (form_id) {
        // Récupération du formulaire
        var $form = $(this.getDOMNode());

        // Si on est sur le bon form !
        if (($form.find('form').attr('id') == form_id) || ($form.attr('id') == form_id)|| (form_id == '')) {
            // Aucuns champs ne sont invalides, on déclenche
            // l'action d'enregistrement avec en params le form
            if ($form.find('[data-valid=false]').length == 0) {
                Actions.validation.submit_form(this.getDOMNode(), form_id);
            }

            // Tout va très mal, on ne peut pas enregistrer !
            else {
                $.notify(Lang.get('global.form_incorrect'), 'error');
            }
        }
    }
};

module.exports = FormValidationMixin;

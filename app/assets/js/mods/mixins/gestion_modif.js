var storeGestMod = require('../stores/gestion_modif');
/**
 * Created by yann on 17/12/2014.
 *
 * Mixin appliqué sur le composant page ou formulaire
 * pour gérer les modifications des champs comportant
 * l'attribut 'data-gest-mod'
 */
var mixinGestionModif = {
    componentDidMount: function () {
        // CHECK MIXIN
        if (typeof(this.listenTo) == 'undefined') {
            console.error('Oulalalala, tu n\'a pas mis le mixin Reflux.ListenerMixin dans ton composant ' +
            this._reactInternalInstance._currentElement.type.displayName + ' !!! Corrige vite ça si tu veux que ça marche ! ' +
            'Ceci est un message du mixin Gestion Modifs.');
        }
        // CHECK ONRETOUR
        if (typeof(this.onRetour) == 'undefined') {
            console.error('Oulalalala, tu n\'a pas défini la méthode onRetour dans ton composant ' +
            this._reactInternalInstance._currentElement.type.displayName + ' !!! Corrige vite ça si tu veux que ça marche ! ' +
            'Ceci est un message du mixin Gestion Modifs.');
        }

        // ECOUTE
        this.listenTo(storeGestMod, this.onStoreGestModTrigger);
        this.attachEventsOnForm();
    },
    componentDidUpdate: function (pp, ps) {
        this.attachEventsOnForm();
    },
    attachEventsOnForm: function () {
        var $page = $(this.getDOMNode());
        $page.off("change", '[data-gest-mod]', this.triggerChange);
        $page.on("change", '[data-gest-mod]', this.triggerChange);
    },
    triggerChange: function (e) {
        Actions.global.gestion_modif_change(e);
    },
    triggerReset: function () {
        Actions.global.gestion_modif_reset();
    },
    onStoreGestModTrigger: function (data) {
        switch (data.action) {
            case 'retour':
                if (data.confirm && confirm(Lang.get('global.gest_mod_confirm_question'))) {
                    this.triggerReset();
                    this.onRetour();
                }
                else if (!data.confirm) {
                    this.onRetour();
                }
                break;
            case 'bandeau_perso':
                if (data.confirm && confirm(Lang.get('global.gest_mod_confirm_question'))) {
                    this.triggerReset();
                    this.onClickBandeauPerso(data.evt);
                } else if (!data.confirm) {
                    this.onRetour();
                }
                break;
            default :
                break;
        }
    }
};

module.exports = mixinGestionModif;
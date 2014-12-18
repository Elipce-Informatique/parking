var storeGestMod = require('../stores/gestion_modif');
/**
 * Created by yann on 17/12/2014.
 */
var mixinGestionModif = {
    componentDidMount: function () {
        // Check mixin
        if (typeof(this.listenTo) == 'undefined') {
            console.error('Oulalalala, tu n\'a pas mis le mixin Reflux.ListenerMixin dans ton composant ' +
            this._currentElement.type.displayName + ' !!! Corrige vite ça si tu veux que ça marche !');
        }

        this.listenTo(storeGestMod, this.onStoreGestModTrigger);

        this.attachEventsOnForm();
    },
    componentDidUpdate: function (pp, ps) {
        this.attachEventsOnForm();
    },
    attachEventsOnForm: function () {
        //console.log(this.getDOMNode());
        var $page = $(this.getDOMNode());
        $page.off("change", '[data-gest-mod]', this.triggerChange);
        $page.on("change", '[data-gest-mod]', this.triggerChange);
    },
    triggerChange: function (e) {
        Actions.global.gestion_modif_change(e);
    },
    onStoreGestModTrigger: function (data) {
        switch (data.action) {
            case 'retour':
                if(confirm(Lang.get('gest_mod_confirm_question'))){
                    this.onRetour();
                }
                break;
            case 'bandeau_perso':
                if(confirm(Lang.get('gest_mod_confirm_question'))){
                    this.onClickBandeauPerso(data.evt);
                }
                break;
            default :
                break;
        }
    }
};

module.exports = mixinGestionModif;
/**
 * Store gestion des modifs :
 * Le mixin gestion des modifs écoute ce store pour afficher
 * une confirmation
 * - sur le bouton retour si besoin.
 * - Ou bien sur le click d'un bouton bandeau perso nécessitant la gestion des modifs
 */
var store = Reflux.createStore({
    hasModif: false,
    init: function () {
        // Change formulaire
        this.listenTo(Actions.global.gestion_modif_change, $.proxy(this.modifFlag, this));
        this.listenTo(Actions.global.gestion_modif_reset, $.proxy(this.resetFlag, this));
        this.listenTo(Actions.validation.submit_form, $.proxy(this.resetFlag, this));
        this.listenTo(Actions.bandeau.retour, $.proxy(this.triggerBack, this));
        this.listenTo(Actions.bandeau.boutons_perso, $.proxy(this.triggerBoutonsPerso, this));
        $(window).on('beforeunload', $.proxy(this.beforeUnLoad, this));
    },
    modifFlag: function (e) {
        this.hasModif = true;
    },
    resetFlag: function (e) {
        this.hasModif = false;
    },
    triggerBack: function (e) {
        this.trigger({confirm: this.hasModif, action: 'retour'});
    },
    triggerBoutonsPerso: function (e) {
        this.trigger({confirm: this.hasModif, action: 'bandeau_perso', evt: _.cloneDeep(e)});
    },
    beforeUnLoad: function (e) {
        if (this.hasModif) {
            return Lang.get('global.gest_mod_confirm');
        }
    }
});

module.exports = store;
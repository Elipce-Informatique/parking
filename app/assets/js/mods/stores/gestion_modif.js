/*
* Store gestion des modifs
 */
Reflux.createStore({
    hasModif: false,

    init: function () {
        // Change formulaire
        this.listenTo(Actions.global.gestion_modif_change, this.modifFlag);
        this.listenTo(Actions.global.gestion_modif_reset, this.resetFlag);
    },
    modifFlag: function () {
        this.hasModif = true;
        console.log('Pass Modif Flag');
    },
    resetFlag: function(){
        this.hasModif = false;
    }
});
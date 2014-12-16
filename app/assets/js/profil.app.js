/* Composant visuel tableau qui liste les profils */

/* Composant react de la page profils */
var ReactPageProfil = require('./mods/page/react_page_profil');


$(function(){

    /* Ajout de l'élément react_page_profil à l'ID "page_profil" défini dans profil.app.js */
    var oReactPageProfil = React.render(
        <ReactPageProfil id="tab_profil"/>,
        document.getElementById('page_profil')
    );
});





//
///* Création du store du tableau profil       */
///* On a abonné le composant tableau au store */
//var moduleProfilRadioStore = Reflux.createStore({
//
//    // Initial setup
//    init: function() {
//
//        // Register statusUpdate action
//        this.listenTo(Actions.profil.radio_change, this.setEtatRadioInBdd);
//    },
//
//    /* Charge les données à chaque évènement load_profil */
//    setEtatRadioInBdd: function(evt) {
//        console.log('setEtatRadioInBdd');
//        if($(evt.currentTarget).hasAttribute('checked')) {
//            console.log('Un radio vient d\'être coché!');
//            var idModule = $(evt.currentTarget).data('id');
//
//            console.log('ID module : '+idModule);
//        }
//        else{
//            console.log('Clic sur radio non checked');
//        }
//    }
//});
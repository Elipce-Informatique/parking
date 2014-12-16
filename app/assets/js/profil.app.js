/* Composant visuel tableau qui liste les profils */
/* + Store qui écoute l'évènement "profil_select" */
var DataTableBandeauProfil       = require('./mods/react_data_table_bandeau_profil');

/* Store qui écoute l'évènement "profil_select", associe le tableau des modules     */
var DataTableModuleProfil = require('./mods/react_data_table_module_profil');

/* Composant visuel Bandeau */
var Bandeau                      = require('./mods/composants/bandeau/react_bandeau');


$(function(){

    /* Bandeau associé à l'ID "bandeau" */
    var oBandeau = React.render(
        <Bandeau titre={Lang.get('administration.profil.titre')}/>,
        document.getElementById('bandeau')
    );

    /* Paramètres du tableau des profils, sur clic d'une ligne, déclenche l'action "profil_select" */
    var headP = [Lang.get('global.profil')];              // Entête du tableau
    var hideP = ['id'];                                    // ID à retourner sur ligne sélectionnée
    var evtsP = {'onClick':handleClickProfil};

    /* Tableau des profils */
    var oReactTableProfil = React.render(
        <DataTableBandeauProfil head={headP} hide={hideP} id="tab_profil" evts={evtsP} />,
        document.getElementById('tableau_profil_react')
    );

    /* Paramètres du tableau des modules avec droits d'accès */
    var headMP = [Lang.get('global.module'), Lang.get('administration.profil.visu_modif')]; // Entête du tableau
    var hideMP = ['id', 'IDprofil'];

    /* Paramètres pour les radios Boutons */
    var aLibelle = new Array(Lang.get('administration.profil.visu'), Lang.get('administration.profil.modif'), Lang.get('administration.profil.aucun'));
    var aName    = new Array('btnVisu', 'btnModif', 'btnAucun');
    var aReactElements = {};
    aReactElements['1'] = new Array();
    aReactElements['1'][0] = 'Radio';                            /* Type de composant à ajouter dans la colonne '1' */
    aReactElements['1'][1] = {'name':aName, 'libelle':aLibelle}; /* Name des radio boutons et libelle               */
    aReactElements['1'][2] = {'onClick':handleClickRadio};       /* Evenement sur click des radio bouton            */

    /* Tableau des modules avec droits d'accès */
    var oReactTableModuleProfil = React.render(
        <DataTableModuleProfil head={headMP} hide={hideMP} id="tab_module_profil" bUnderline={false} reactElements={aReactElements} />,
        document.getElementById('tableau_module_profil_react')
    );
});

/* Action appelé lors d'un clic sur une ligne du tableau profil */
function handleClickProfil(evt){
    var copie = _.clone(evt);
    Actions.profil.profil_select(copie);
}

/* Action à appeler lors d'un changement d'état d'un radioBouton */
function handleClickRadio(evt){
    var copie = _.clone(evt);
    Actions.profil.radio_change(copie);
}

/* Création du store du tableau profil       */
/* On a abonné le composant tableau au store */
var moduleProfilRadioStore = Reflux.createStore({

    // Initial setup
    init: function() {

        // Register statusUpdate action
        this.listenTo(Actions.profil.radio_change, this.setEtatRadioInBdd);
    },

    /* Charge les données à chaque évènement load_profil */
    setEtatRadioInBdd: function(evt) {
        console.log('setEtatRadioInBdd');
        if($(evt.currentTarget).hasAttribute('checked')) {
            console.log('Un radio vient d\'être coché!');
            var idModule = $(evt.currentTarget).data('id');

            console.log('ID module : '+idModule);
        }
        else{
            console.log('Clic sur radio non checked');
        }
    }
});
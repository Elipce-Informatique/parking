/* Composant visuel tableau qui liste les profils */
/* + Store qui écoute l'évènement "profil_select" */
var DataTableBandeauProfil       = require('./mods/react_data_table_bandeau_profil');

/* Store qui écoute l'évènement "profil_select", associe le tableau des modules     */
var DataTableModuleProfil = require('./mods/react_data_table_module_profil');

/* Composant visuel Bandeau */
var Bandeau                      = require('./mods/composants/react_bandeau');


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
        <DataTableBandeauProfil head={headP} hide={hideP} id="tab_profil" evts={evtsP}/>,
        document.getElementById('tableau_profil_react')
    );

    /* Paramètres du tableau des modules avec droits d'accès */
    var headMP = [Lang.get('global.module'), Lang.get('administration.profil.visu_modif')]; // Entête du tableau
    var hideMP = ['id'];

    /* Tableau des modules avec droits d'accès */
    var oReactTableModuleProfil = React.render(
        <DataTableModuleProfil head={headMP} hide={hideMP} id="tab_module_profil" bUnderline={false} />,
        document.getElementById('tableau_module_profil_react')
    );
});



/* Action appelé lors d'un clic sur une ligne du tableau profil */
function handleClickProfil(evt){
    var copie = _.clone(evt);
    Actions.profil.profil_select(copie);
}
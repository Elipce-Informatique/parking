var DataTableBandeauProfil       = require('./mods/react_data_table_bandeau_profil');
var DataTableBandeauModuleProfil = require('./mods/react_data_table_bandeau_module_profil');
var Bandeau                      = require('./mods/react_bandeau');

$(function(){

    /* Bandeau */
    var oBandeau = React.render(
        <Bandeau titre={Lang.get('administration.profil.titre')}/>,
        document.getElementById('bandeau')
    );

    /* Paramètres du tableau des profils */
    var headP = [Lang.get('global.profil')];
    var hideP = ['id'];
    var evtsP = {'onClick':Actions.profil.profil_select};

    /* Tableau des profils */
    var oReactTableProfil = React.render(
        <DataTableBandeauProfil head={headP} hide={hideP} id="tab_profil" evts={evtsP}/>,
        document.getElementById('tableau_profil_react')
    );


    /* Paramètres du tableau des modules avec droits d'accès */
    var headMP = [Lang.get('global.profil')];
    var hideMP = ['id'];
    //var evtsMP = {'onClick':Actions.profil.profil_select};

    /* Tableau des modules avec droits d'accès */
    var oReactTableModuleProfil = React.render(
        <DataTableBandeauModuleProfil head={headMP} hide={hideMP} id="tab_module_profil"/>,
        document.getElementById('tableau_module_profil_react')
    );


});
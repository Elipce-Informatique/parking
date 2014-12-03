var DataTableBandeauProfil = require('./mods/react_data_table_bandeau_profil');
var Bandeau                = require('./mods/react_bandeau');

$(function(){
    var oBandeau = React.render(
        <Bandeau titre={Lang.get('administration.profil.titre')}/>,
        document.getElementById('bandeau')
    );

    var oReactTableProfil = React.render(
        <DataTableBandeauProfil head={head} hide={hide} id="tab_users" evts={evts}/>,
        document.getElementById('tableau_profil_react')
    );
});
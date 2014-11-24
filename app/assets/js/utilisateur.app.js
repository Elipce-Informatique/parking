// Modules perso
// ATTENTION la majuscule est super importante
//var Table = require('./mods/react_table');
var DataTable = require('./mods/react_data_table');
var Bandeau = require('./mods/react_bandeau');

$(function(){
    // Tableau
    var head = ['Nom','E-mail'];
    var url = BASE_URI+'utilisateur/all';
    var hide = ['id'];
    var attr = {className:'toto'};
    var evts = {};
    
    var oReactTable = React.render(
        <DataTable head={head} url={url} hide={hide} id="tab_users" attributes={attr} />,
        document.getElementById('tableau_react')
    );
    
    // Bandeau
     var oBandeau = React.render(
        <Bandeau titre={Lang.get('utilisateur.titre')}/>,
        document.getElementById('bandeau')
    );
    
    // Click bouton IIIII
    $('#test').click(function(){
       oReactTable.forceUpdate();
    });
});

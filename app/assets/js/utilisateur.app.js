// Modules perso
// ATTENTION la majuscule est super importante
//var Table = require('./mods/react_table');
var DataTable = require('./mods/react_data_table');

$(function(){
    var head = ['Nom','E-mail'];
    var url = BASE_URI+'utilisateur/all';
    var hide = ['id'];
    React.render(
        <DataTable head={head} url={url} hide={hide} id="tab_users"/>,
        document.getElementById('tableau_react')
    );
});

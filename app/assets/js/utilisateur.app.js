// Modules perso
// ATTENTION la majuscule est super importante
var Table = require('./mods/react_table');

$(function(){
    var head = ['Nom','E-mail'];
    var url = BASE_URI+'utilisateur/all';
    var hide = ['id'];
    React.render(
        <Table head={head} url={url} hide={hide}/>,
        document.getElementById('tableau_react')
    );
});

// NODES MODULES
var $ = require('jquery');
var React = require('react/addons');

// Modules perso
// ATTENTION la majuscule est super importante
var Table = require('./mods/react_table');

$(function(){
    var head = ['Nom','Prénom','Date de naissance'];
    var url = 'utilisateur/all';
    var hide = ['password'];
    React.render(
        <Table head={head} url={url} hide={hide}/>,
        document.getElementById('tableau_react')
    );
});

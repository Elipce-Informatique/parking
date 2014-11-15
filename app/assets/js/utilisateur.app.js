// NODES MODULES
var $ = require('jquery');
var React = require('react/addons');

// Modules perso
// ATTENTION la majuscule est super importante
var Table = require('./mods/react_table');

$(function(){
    var monTab = [{'nom':'Nom','prenom':'Prénom','date_naissance':'Date de naissance'},{'nom':'Perez','prenom':'Vivian','date_naissance':'26/02/1985'}];
    var test = 'toto';
    React.render(
        <Table data={monTab}/>,
        document.getElementById('tableau_react')
    );
});

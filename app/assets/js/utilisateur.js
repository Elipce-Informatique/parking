// NODES MODULES
var $ = require('jquery');
var React = require('react/addons');

// Modules perso
var table = require('mods/react_table');

$(function(){
    var monTab = []
    React.render(
        <table data=monTab />,
        document.getElementById('hello')
    );
});

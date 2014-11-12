/**
 * Created by Zarkaos on 10/11/2014.
 */
// NODES MODULES
var $ = require('jquery');
var React = require('react/addons');

// Modules perso
var Hello = require('./mods/react_hello');

$(function(){
    $('.welcome').find('h1').prop('id', 'hello');

    React.render(
        <Hello name="hacker de laravel" />,
        document.getElementById('hello')
    );
});

var mysql      = require('mysql');

var connection = mysql.createConnection({
    host     : '192.168.1.220',
    user     : 'root',
    password : 'elipce',
    database : 'parking'
});

connection.connect(function(err){
    if(err){
        console.log('erreur connexion: '+ err.stack);
    }
});

module.exports = connection;
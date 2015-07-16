// Variables
var modeDev = false;
var connexionInfos = modeDev ? {
    host     : '192.168.1.220',
    user     : 'root',
    password : 'elipce',
    database : 'parking'
} : {
    host     : 'localhost',
    user     : 'parking',
    password : 'bruno2015',
    database : 'parking'
};

// Dependencies
var mysql      = require('mysql');
var logger = require('./helper.js').Log;

// DB connexion
var connection = mysql.createConnection(connexionInfos);

// Try to connect
connection.connect(function(err){
    if(err){
        logger.log('error', 'SQL connexion error '+err.message);
    }
});

module.exports = connection;
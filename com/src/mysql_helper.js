// Variables
var connexionInfos = (process.env.PRODUCTION && process.env.PRODUCTION == 'true') ?  {
    host     : 'localhost',
    user     : 'parking',
    password : 'bruno2015',
    database : 'parking'
} :
{
    host     : '192.168.1.220',
    user     : 'root',
    password : 'elipce',
    database : 'parking'
};

// Dependencies
var mysql      = require('mysql');
var logger = require('./logger.js');

// DB connexion
logger.log('info', 'Infos de connexion : %o', connexionInfos)
var connection = mysql.createConnection(connexionInfos);

// Try to connect
connection.connect(function(err){
    if(err){
        logger.log('error', 'SQL connexion error : %o', err.message);
    }
});

module.exports = connection;
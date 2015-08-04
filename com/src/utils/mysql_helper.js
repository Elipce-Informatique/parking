// TODO get all that config from elsewhere ?
var connexionInfos = (process.env.PRODUCTION && process.env.PRODUCTION == 'true') ? {
    host: 'localhost',
    user: 'parking',
    password: 'bruno2015',
    database: 'parking'
} :
{
    host: '192.168.1.220',
    user: 'root',
    password: 'elipce',
    database: 'parking'
};

// Dependencies
var mysql = require('mysql');
var logger = require('./logger.js');

function newConnection() {
    console.log('new mysql connection');
    var connection = mysql.createConnection(connexionInfos);

    // Try to connect
    connection.connect(function (err) {
        if (err) {
            logger.log('error', 'SQL connexion error : %o', err.message);
        }
    });

    return connection
}

module.exports = newConnection;
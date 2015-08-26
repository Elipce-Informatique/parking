// Dependencies
var mysql = require('mysql');
var logger = require('./logger.js');
var _ = require('lodash');

// TODO get all that config from elsewhere ?
var mysqlClass = {

    connexionInfos: (process.env.PRODUCTION && process.env.PRODUCTION == 'true') ? {
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
    },


    standardConnexion: function () {
        //console.log('new mysql connection');
        var connection = mysql.createConnection(this.connexionInfos);

        // Try to connect
        connection.connect(function (err) {
            if (err) {
                logger.log('error', 'SQL connexion error ', err.message);
            }
        });

        return connection;
    },

    /**
     * Uses for multiple connexion (max 150)
     * @returns {Function}
     */
    pool: function () {
        var infos = _.extends(this.connexionInfos, {connectionLimit: 10});
        mysql.createPool(infos);
        return pool;
    },

    /**
     * Execute a query on the pool (don't use another connexion handler)
     * @param pool: an object mysql.createPool()
     * @param sql: query
     * @param params: array: query parameters
     * @param callback: function callback
     */
    execute: function (pool, sql, params, callback) {
        pool.getConnection(function (err, connection) {
            if (err) {
                logger.error('Mysql connection error: ' + err);
                callback(err, true);
                return;
            }
            var query = connection.query(sql, params, callback);
            query.on('error', function (err) {
                logger.error('Mysql query error: ' + err);
                callback(err, true);
            });
            query.on('result', function (rows) {
                callback(false, rows);
            });
            query.on('end', function () {
                connection.release();
            });
        });
    }
}
module.exports = mysqlClass;
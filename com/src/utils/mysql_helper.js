// Dependencies
var mysql = require('mysql');
var logger = require('./logger.js');
var _ = require('lodash');
var conf = require('../../config/config.js');

var mysqlClass = {

    connexionInfos: (process.env.PRODUCTION && process.env.PRODUCTION == 'true') ? conf.prod.database :
        conf.dev.database,


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
        var infos = _.extend(this.connexionInfos, {connectionLimit: global.poolNumber});
        //logger.log('info', '+++++++++++++++ POOL: '+global.poolNumber);
        return mysql.createPool(infos);
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
                logger.log('error', 'Mysql connection error: ' + err);
                callback(err, true);
                return;
            }

            var rand = Math.random();

            var query = connection.query(sql, params/*, callback*/);
            query.on('error', function (err) {
                logger.log('error', 'Mysql query error: ' + err);
                logger.log('error', 'Mysql query error RANDOM: ' + rand);
                callback(err, true);
                //connection.release();
            });
            query.on('result', function (rows) {
                callback(false, rows);
            });
            query.on('end', function () {
                logger.log('error', 'Mysql query end RANDOM: ' + rand);
                connection.release();
            });
        });
    }
}
module.exports = mysqlClass;
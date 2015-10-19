/**
 * Created by yann on 09/09/2015.
 */


/**
 * All the server specific config for the communication
 */
module.exports = {
    dev: {
        host: '127.0.0.1',
        port: 26000,
        database: {
            host: '192.168.1.220',
            user: 'root',
            password: 'elipce',
            database: 'parking'
        },
        certificates:{
            ca: "./auth/ca.crt",
            cert: "./auth/server.crt",
            key: "./auth/server.key"
        }
    },
    prod: {
        host: '185.24.155.69',
        port: 26022,
        database: {
            host: 'localhost',
            user: 'p022',
            password: 'p022',
            database: 'p022'
        },
        certificates:{
            ca: "./auth/ca.crt",
            cert: "./auth/server.crt",
            key: "./auth/server.key"
        }
    },
    legLength: 62
};
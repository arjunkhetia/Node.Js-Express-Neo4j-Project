var neo4j = require('neo4j-driver');

const URI = 'neo4j://localhost';
const USER = 'neo4j';
const PASSWORD = 'password';
const DATABASE = 'neo4j';

const driverConfig = {
    maxTransactionRetryTime: 30000,            // Specify the maximum time of transactions allowed to retry executeRead and executeWrite functions.
    disableLosslessIntegers: true,             // Make this driver always return native JavaScript numbers for integer values.
    connectionAcquisitionTimeout: 60000,       // The maximum amount of time to wait to acquire a connection from the pool (to either create a new connection or borrow an existing one).
    connectionTimeout: 30000,                  // Specify socket connection timeout in milliseconds.
    maxConnectionLifetime: 60 * 60 * 1000,     // The maximum allowed lifetime for a pooled connection in milliseconds. Pooled connections older than this threshold will be closed and removed from the pool.
    maxConnectionPoolSize: 100,                // The maximum total number of connections allowed to be managed by the connection pool, per host (includes both in-use and idle connections).
    useBigInt: false,                          // Make this driver always return native Javascript BigInt for integer values.
};

var driver;
var session;

module.exports.connect = () => new Promise((resolve, reject) => {
    driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD), driverConfig);
    driver ? resolve() : reject();
});

module.exports.getDriver = () => {
    if(!driver) {
        throw new Error('Call Connect First...');
    }
    return driver;
}

module.exports.getSession = () => {
    session = driver.session({ database: DATABASE });
    if(!session) {
        throw new Error('Call Connect First...');
    }
    return session;
}

module.exports.closeSession = async () => {
    if(!session) {
        throw new Error('Call Connect First...');
    }
    await session.close();
}

module.exports.close = async () => {
    if(!session) {
        throw new Error('Call Connect First...');
    }
    await session.close();
    await driver.close();
}
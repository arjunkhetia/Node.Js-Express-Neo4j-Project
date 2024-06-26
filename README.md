# Node-Express-Neo4j Project   ![Version][version-image]

![Linux Build][linuxbuild-image]
![Windows Build][windowsbuild-image]
![NSP Status][nspstatus-image]
![Test Coverage][coverage-image]
![Dependency Status][dependency-image]
![devDependencies Status][devdependency-image]

The quickest way to get start with Node.Js, Express and Neo4j, just clone the project:

```bash
$ git clone https://github.com/arjunkhetia/Node.Js-Express-Neo4j-Project.git
```

Install dependencies:

```bash
$ npm install
```

Start Express.js app at `http://localhost:3000/`:

```bash
$ npm start
```

# Nodemon

Nodemon will watch the files in the directory in which nodemon was started, and if any files change, nodemon will automatically restart your node application.

Start Express.js app with nodemon at `http://localhost:3000/`:

```bash
$ nodemon bin/www
```

# Node PortFinder

Node PortFinder is a tool to find an open port or domain socket on the machine.

```js
var portfinder = require('portfinder');
var port = 3000;
var portSpan = 999;
portfinder.getPort({
  port: port,    // minimum port number
  stopPort: port + portSpan // maximum port number
}, function (err, openPort) {
  if (err) throw err;
  port = openPort;
});
```

# Nodejs Cluster

Node.js runs in a single process, by default. Ideally, we want one process for each CPU core, so we can distribute the workload across all the cores. Hence improving the scalability of web apps handling HTTP requests and performance in general. In addition to this, if one worker crashes, the others are still available to handle requests.

```js
var cluster = require('cluster');
var workers = process.env.WORKERS || require('os').cpus().length;

if (cluster.isMaster) {
  console.log('Master cluster is running on %s with %s workers', process.pid, workers);
  for (var i = 0; i < workers; ++i) {
    var worker = cluster.fork().process;
    console.log('worker %s on %s started', i+1, worker.pid);
  }
  cluster.on('exit', function(worker, code, signal) {
    console.log('worker %s died. restarting...', worker.process.pid);
    cluster.fork();
  });
}

if (cluster.isWorker) {
  // Server code
}
```

# Logger - Morgan & Winston

Morgan - HTTP request logger middleware for node.js:

```js
var logger = require('morgan');
app.use(logger('dev'));
app.use(logger(':remote-addr :remote-user :datetime :req[header] :method :url HTTP/:http-version :status :res[content-length] :res[header] :response-time[digits] :referrer :user-agent', {
    stream: accessLogStream
}));
```

Winston - is designed to be a simple and universal logging library with support for multiple transports:

```js
var winston = require('winston');
var logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.colorize({
        all: true
    }),
    winston.format.printf(
        data => `${data.level} : ${data.message}`
    )
  ),
  transports: [
    new winston.transports.Console({
      level: 'silly'
    }),
    new winston.transports.File({
      level: 'silly',
      filename: './log/ServerData.log'
    })
  ]
});
```

# Rotating File Stream

To provide an automated rotation of Express/Connect logs or anything else that writes to a log on a regular basis that needs to be rotated based on date.

```js
var rfs    = require('rotating-file-stream');
var accessLogStream = rfs('file.log', {
    size:     '10M', // rotate every 10 MegaBytes written
    interval: '1d', // rotate daily
    compress: 'gzip' // compress rotated files
    path: 'log' // folder path for log files
});
```

# Neo4j Database Connectivity (with connection pool)

This is the official Neo4j driver for JavaScript. A Connection Pool is a cache of database connections maintained by your driver so that connections can be re-used when new connections to the database are required. 

```js
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
```

![Neo4j Page](https://github.com/arjunkhetia/Node.Js-Express-Neo4j-Project/blob/main/public/neo4j.png "Neo4j Page")

# Server Status Monitor

Express Status Monitor is simple, self-hosted module based on Socket.io and Chart.js to report realtime server metrics for Express-based ode servers.

```js
app.use(require('express-status-monitor')({
  title: 'Server Status', // title for status screen
  path: '/status', // path for server status invokation
  spans: [{
    interval: 1, // every second
    retention: 60 // keep 60 datapoints in memory
  }, {
    interval: 5, // every 5 seconds
    retention: 60
  }],
  chartVisibility: {
    cpu: true, // enable CPU Usage
    mem: true, // enable Memory Usage
    load: true, // enable One Minute Load Avg
    eventLoop: true, // enable EventLoop Precess Usage
    heap: true, // enable Heap Memory Usage
    responseTime: true, // enable Response Time
    rps: true, // enable Requests per Second
    statusCodes: true // enable Status Codes
  },
  healthChecks: [{
    protocol: 'http', // protocol
    host: 'localhost' // server host name
    path: '/users', // endpoint to check status
    port: '3000' // server port
  }], // health check will be considered successful if the endpoint returns a 200 status code
  ignoreStartsWith: '/admin' // ignore path starts with
}));
```

![Monitoring Page](https://github.com/arjunkhetia/Node.Js-Express-Neo4j-Project/blob/main/public/status-monitor.png "Monitoring Page")

[version-image]: https://img.shields.io/badge/Version-1.0.0-orange.svg
[linuxbuild-image]: https://img.shields.io/badge/Linux-passing-brightgreen.svg
[windowsbuild-image]: https://img.shields.io/badge/Windows-passing-brightgreen.svg
[nspstatus-image]: https://img.shields.io/badge/nsp-no_known_vulns-blue.svg
[coverage-image]: https://img.shields.io/coveralls/expressjs/express/master.svg
[dependency-image]: https://img.shields.io/badge/dependencies-up_to_date-brightgreen.svg
[devdependency-image]: https://img.shields.io/badge/devdependencies-up_to_date-yellow.svg

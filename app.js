'use strict';

const Hapi = require('hapi');
const routes = require('./api/routes');
const { cookiesTTL, users } = require('./config');


const server = new Hapi.Server({
    port: 3000,
    host: '127.0.0.1'
});

const init = async () => {
    await server.state('gitapp', {
        ttl: cookiesTTL,
        encoding: 'base64json',
        isSecure: false
    });
    await server.route(routes);
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};


process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
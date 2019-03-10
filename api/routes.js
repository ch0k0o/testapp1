const {
    login,
    getRepos,
    getRepoInfo,
    getRepoCommits,
    getRepoPatch,
    checkAuthorization
} = require('./utils');

const routes = [{
        method: 'POST',
        path: '/login',
        handler: login
    },
    {
        path: '/repos',
        method: 'GET',
        config: {
            handler: getRepos,
            pre: [{ method: checkAuthorization }]
        }
    },
    {
        path: '/generalInfo/{nameId}',
        method: 'GET',
        config: {
            handler: getRepoInfo,
            pre: [{ method: checkAuthorization }]
        }
    },
    {
        path: '/commits/{nameId}',
        method: 'GET',
        config: {
            handler: getRepoCommits,
            pre: [{ method: checkAuthorization }]
        }
    },
    {
        path: '/patch/{nameId}/{patchId}',
        method: 'GET',
        config: {
            handler: getRepoPatch,
            pre: [{ method: checkAuthorization }]
        }
    }
];


module.exports = routes;
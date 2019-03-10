'use strict';

const Promise = require('bluebird');
const request = require('request');
const Boom = require('boom');
const NodeCache = require('node-cache');
const createToken = require('./token');
const jwt = require('jsonwebtoken');
const {
    secret,
    organization,
    users,
    cacheTTL
} = require('../config');

Promise.promisifyAll(request, {
    multiArgs: true
});

Promise.promisifyAll(NodeCache.prototype);

const myCache = new NodeCache({
    stdTTL: cacheTTL
});

const headers = {
    'User-Agent': 'githubapp'
};


const sendRequest = (options) => {
    let {
        url
    } = options;

    return myCache.getAsync(url)
        .then((value) => {
            if (!value) {
                return request.getAsync(options).spread((response, body) => {
                        let res = JSON.parse(body);
                        if (response.statusCode != 200) {
                            return Boom.boomify(new Error(res.message), {
                                statusCode: response.statusCode
                            });
                        }
                        return res;
                    })
                    .then(res => {
                        return myCache.setAsync(url, res)
                            .then(() => res);
                    })
                    .catch(error => {
                        throw error;
                    });
            }
            return value;
        })
        .catch(error => {
            throw error;
        });
}

const getRepos = () => {
    return sendRequest({
        url: `https://api.github.com/users/${organization}/repos`,
        headers
    });
};

const getRepoInfo = (req) => {
    let {
        nameId
    } = req.params;

    return sendRequest({
        url: `https://api.github.com/repos/${organization}/${nameId}`,
        headers
    });
};

const getRepoCommits = (req) => {
    let {
        nameId
    } = req.params;

    return sendRequest({
        url: `https://api.github.com/repos/${organization}/${nameId}/commits`,
        headers
    });
};

const getRepoPatch = (req) => {
    let {
        nameId,
        patchId
    } = req.params;

    return sendRequest({
        url: `https://api.github.com/repos/${organization}/${nameId}/pulls/${patchId}.patch`,
        headers
    });
};

const login = (req, h) => {
    let {
        payload
    } = req;
    let userIsValid = false;
    let user;

    Object.keys(users).forEach(key => {
        if ((users[key].username === payload.username) && (users[key].username === payload.username)) {
            user = users[key];
            userIsValid = true;
        }
    });

    if (userIsValid) {
        let token = createToken(user);

        myCache.set(token, true);

        let cookie = token;

        const response = h.response('success');
        response.state('gitapp', cookie);
        return response.code(201);
    } else {
        throw Boom.badRequest('Invalid credentials');
    }
}

const checkAuthorization = (req) => {
    const userJWT = req.state.gitapp;
    if (!userJWT) {
        //token is missing
        throw Boom.unauthorized('Invalid or missing authorization token');
    } else {
        try {
            var userJWTPayload = jwt.verify(userJWT, secret);
            if (!userJWTPayload) {
                //token is invalid
                throw Boom.unauthorized('Invalid or missing authorization token');
            } else {
                //There's a valid token...see if it is present in the cache
                let token = myCache.get(userJWT);
                if (!token) {
                    throw Boom.unauthorized('Your token has expired! Log in again.');

                }
            }
        } catch (err) {
            throw Boom.unauthorized('Invalid or missing authorization token');
        }
    }

    return true;
}


module.exports = {
    getRepos,
    getRepoInfo,
    getRepoCommits,
    getRepoPatch,
    login,
    checkAuthorization
};
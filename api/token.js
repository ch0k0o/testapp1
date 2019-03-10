
'use strict';

const jwt = require('jsonwebtoken');
const { secret, jwtTTL } = require('../config');

function createToken(user) {
  let scopes;

  if (user.admin) {
    scopes = 'admin';
  }
  // Sign the JWT
  return jwt.sign({ id: user.id, username: user.username, scope: scopes }, secret, { algorithm: 'HS256', expiresIn: jwtTTL } );
}

module.exports = createToken;
const jwt = require('jsonwebtoken');
require('dotenv').config(); 

// set token secret and expiration date
const secret = 'supersecretsecret';
const expiration = '2h';

module.exports = {
  // function for our authentication
  authMiddleware: function ({req}) {
    // allows token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      return req; //Return request back to front end if no token is provided
    }

    // verify token and get user data out of it
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data; // Attach user data to request from decoded jwt if valid
    } catch {
      console.log('Invalid token');
    }

    // return request with user data decoded from jwt
    return req;
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
    // Create new jwt with provided credentials
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};

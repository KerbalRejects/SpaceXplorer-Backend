'use strict';

const jwt = require('jsonwebtoken'); // auth
const jwksClient = require('jwks-rsa'); // auth

// Define a client, this is a connection to YOUR auth0 account, using the URL given in your dashboard
const client = jwksClient({
  jwksUri: process.env.JWKS_URI,
  cache: true,  // Enable caching
  rateLimit: true,  // Enable rate limiting
  jwksRequestsPerMinute: 5,  // Limit requests to prevent rate limiting
  timeout: 10000  // Set timeout to 10 seconds
});

// This is a special function for express called "Middleware"
// We can simply "use()" this in our server
// When a user is validated, request.user will contain their information
// Otherwise, this will force an error
function verifyUser(request, response, next) {
  try {
    // Check if authorization header exists
    if (!request.headers.authorization) {
      return next('Authorization header missing');
    }

    const token = request.headers.authorization.split(' ')[1];
    if (!token) {
      return next('Token missing');
    }

    jwt.verify(token, getKey, {}, function(err, user) {
      if (err) {
        console.error('JWT verification error:', err.message);
        return next('Invalid token');
      }
      request.user = user;
      next();
    });
  } catch (error) {
    console.error('Auth error:', error.message);
    next('Not Authorized');
  }
}


// =============== HELPER METHODS, pulled from the jsonwebtoken documentation =================== //
//                 https://www.npmjs.com/package/jsonwebtoken                                     //

// Match the JWT's key to your Auth0 Account Key so we can validate it
function getKey(header, callback) {
  // Validate header and kid
  if (!header || !header.kid) {
    return callback(new Error('Invalid token header. No kid present.'));
  }

  client.getSigningKey(header.kid, function (err, key) {
    if (err) {
      console.error('Error getting signing key:', err.message);
      return callback(err);
    }

    if (!key) {
      return callback(new Error('No signing key found'));
    }

    try {
      // Get the signing key
      const signingKey = key.publicKey || key.rsaPublicKey;
      if (!signingKey) {
        return callback(new Error('Invalid signing key'));
      }

      callback(null, signingKey);
    } catch (error) {
      console.error('Error processing signing key:', error.message);
      callback(error);
    }
  });
}



module.exports = verifyUser;
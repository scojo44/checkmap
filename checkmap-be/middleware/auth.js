/** Convenience middleware to handle common auth cases in routes. */
const jwt = require('jsonwebtoken')
const {SECRET_KEY} = require('../config')
const {UnauthorizedError} = require('../expressError');
const {UserRole} = require('../db');

/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username and isAdmin field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */

function authenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers && req.headers.authorization;

    if(authHeader) {
      const token = authHeader.replace(/^[Bb]earer /, "").trim();
      res.locals.userToken = jwt.verify(token, SECRET_KEY);
    }

    return next();
  }
  catch(err) {
    return next();
  }
}

/** Middleware to use when they must be logged in.
 *
 * If not, raises Unauthorized.
 */

function ensureLoggedIn(req, res, next) {
  try {
    if(!res.locals.userToken)
      throw new UnauthorizedError('You must be logged in with a valid token.');

    return next();
  }
  catch(err) {
    return next(err);
  }
}

/** Middleware to use when they must have admin rights.
 *
 * If not, raises Unauthorized.
 */

function ensureAdmin(req, res, next) {
  try {
    if(res.locals.userToken?.role !== UserRole.Admin)
      throw new UnauthorizedError('You must be logged in with administrator privileges.');

    return next();
  }
  catch(err) {
    return next(err);
  }
}

/** Middleware to use when they must be the affected user or have admin rights.
 *
 * If not, raises Unauthorized.
 */

function ensureSelfOrAdmin(req, res, next) {
  try {
    const loginMatchesUserRoute = res.locals.userToken?.username === req.params.username;
    const userIsAdmin = res.locals.userToken?.role === UserRole.Admin;
    if(!loginMatchesUserRoute && !userIsAdmin)
      throw new UnauthorizedError('You must be logged in with a valid token.');

    return next();
  }
  catch(err) {
    return next(err);
  }
}

module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureAdmin,
  ensureSelfOrAdmin
}

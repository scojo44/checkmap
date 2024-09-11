/** Routes for authentication. */
const express = require('express')
const jsonschema = require('jsonschema')

const {BadRequestError} = require('../expressError')
const {createToken, authenticateUser, registerUser} = require('../helpers/tokens')
const userAuthSchema = require('../schemas/userAuth.json')
const userRegisterSchema = require('../schemas/userRegister.json')

const router = new express.Router();

/** POST /auth/token: {username, password} => {token}
 *
 * Returns a JWT token which can be used to authenticate further requests.
 *
 * Authorization required: None
 */

router.post("/token", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userAuthSchema);
    if(!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const {username, password} = req.body;
    const user = await authenticateUser(username, password);
    const token = createToken(user);
    return res.json({token});
  } catch (err) {
    return next(err);
  }
});

/** POST /auth/register: {user} => {token}
 *
 * User must include {username, password}.  Optional: {imageURL}
 *
 * Returns a JWT token which can be used to authenticate further requests.
 *
 * Authorization required: None
 */

router.post("/register", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userRegisterSchema);
    if(!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const newUser = await registerUser({...req.body});
    const token = createToken(newUser);
    return res.status(201).json({token});
  } catch (err) {
    return next(err);
  }
});

module.exports = router

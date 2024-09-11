/** Routes for users. */
const express = require('express')
const bcrypt = require('bcrypt')
const jsonschema = require('jsonschema')

const {BCRYPT_WORK_FACTOR} = require('../config')
const {NotFoundError, BadRequestError} = require('../expressError')
const {createToken, registerUser} = require('../helpers/tokens')
const {ensureLoggedIn, ensureAdmin, ensureSelfOrAdmin} = require('../middleware/auth')
const {db} = require('../db')
const userCreateSchema = require('../schemas/userRegisterByAdmin.json')
const userUpdateSchema = require('../schemas/userUpdate.json')

const router = express.Router();

// Common select statements
const selectUserBasic = { // Exclude the password
  username: true,
  imageURL: true,
  role: true
};
const selectUserFull = { // Includes relations
  ...selectUserBasic,
  lists: true
};

/** GET / => {users}
 *
 * Returns a list of all users.
 *
 * Authorization required: Admin
 **/

router.get("/", ensureLoggedIn, ensureAdmin, async function (req, res, next) {
  try {
    const users = await db.user.findMany({
      select: selectUserFull,
      orderBy: {username: 'asc'}
    });

    return res.json({users});
  }
  catch(err) {
    return next(err);
  }
});

/** GET /[username] => {user}
 *
 * Returns the user with the given username
 *
 * Authorization required: Login
 **/

router.get("/:username", ensureLoggedIn, ensureSelfOrAdmin, async function (req, res, next) {
  try {
    const username = req.params.username;
    const user = await db.user.findUnique({
      select: selectUserFull,
      where: {username}
    });

    if(!user) throw new NotFoundError(`User ${username} doesn't exist.`);
    return res.json({user});
  }
  catch(err) {
    return next(err);
  }
});

/** POST / {user} => {user, token}
 *
 * Adds a new user. This is not the registration endpoint.  Instead, this is only
 * for admin users to add new users.  The new user being added can be an admin.
 *
 * Returns the newly created user and an authentication token for them.
 *
 * Authorization required: Admin
 **/

router.post("/", ensureLoggedIn, ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userCreateSchema);
    if(!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    // Create the user
    const user = await registerUser(req.body);
    const token = createToken(user);
    return res.status(201).json({user, token});
  }
  catch(err) {
    return next(err);
  }
});

/** PATCH /[username] {data} => {user}
 *
 * Updates username's user record.  Data must include one of:  {password, imageURL}
 *
 * Returns the updated user without lists.
 *
 * Authorization required: Login
 **/

router.patch("/:username", ensureLoggedIn, ensureSelfOrAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userUpdateSchema);
    if(!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const username = req.params.username;

    // Make sure the user exists
    if(!await db.user.findUnique({where: {username}, select: {username: true}}))
      throw new NotFoundError(`User ${username} doesn't exist.`);

    // Hash the new password
    if(req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, BCRYPT_WORK_FACTOR);
    }

    // Update the user record
    const user = await db.user.update({
      data: req.body,
      where: {username},
      select: selectUserBasic
    });

    return res.json({user});
  }
  catch(err) {
    return next(err);
  }
});

/** DELETE /[username] => {deleted: username}
 * 
 * Deletes the user with the given username and returns the username.
 *
 * Authorization required: Login
 **/

router.delete("/:username", ensureLoggedIn, ensureSelfOrAdmin, async function (req, res, next) {
  try {
    const username = req.params.username;

    // Make sure the user exists
    if(!await db.user.findUnique({where: {username}, select: {username: true}}))
      throw new NotFoundError(`User ${username} doesn't exist.`);

    // Delete the user
    const user = await db.user.delete({
      where: {username},
      select: {username: true}
    });

    return res.json({deleted: user.username});
  }
  catch(err) {
    return next(err);
  }
});

module.exports = router

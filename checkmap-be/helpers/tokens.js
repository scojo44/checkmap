const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const {BCRYPT_WORK_FACTOR} = require('../config')
const {SECRET_KEY} = require('../config');
const {BadRequestError, UnauthorizedError} = require('../expressError')
const {db, UserRole} = require('../db');

/** return signed JWT from user data. */

function createToken(user) {
  console.assert(user.role !== undefined, "createToken passed user without role property");

  const payload = {
    username: user.username,
    role: user.role || UserRole.User
  };

  return jwt.sign(payload, SECRET_KEY);
}

/** Register user with data.
 *
 * Returns {username, imageURL, role, lists}
 * - lists willl be an empty array since just added a new user
 *
 * Throws BadRequestError on duplicates.
 **/

async function registerUser({username, password, imageURL, role = UserRole.User}) {
  if(await db.user.findUnique({where: {username}, select: {username: true}})) {
    throw new BadRequestError(`Duplicate username: ${username}`);
  }

  return await db.user.create({
    data: {
      username,
      password: await bcrypt.hash(password, BCRYPT_WORK_FACTOR),
      imageURL,
      role
    },
    select: {
      username: true,
      imageURL: true,
      role: true
    }
  });
}

/** authenticate user with username, password.
 *
 * Returns { username, first_name, last_name, email, is_admin }
 *
 * Throws UnauthorizedError is user not found or wrong password.
 **/

async function authenticateUser(username, guessPassword) {
  const userRecord = await db.user.findUnique({where: {username}});

  // Compare hashed password to a new hash from tried password
  if(userRecord) {
    const {password, ...user} = userRecord; // Separate the hashed password from the user

    if(await bcrypt.compare(guessPassword, password)) {
      return user;
    }
  }

  throw new UnauthorizedError("Invalid username/password");
}

module.exports = {createToken, registerUser, authenticateUser}

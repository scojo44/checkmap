/** Routes for lists. */
const express = require('express')
const jsonschema = require('jsonschema')

const {NotFoundError, BadRequestError, UnauthorizedError} = require('../expressError')
const {userOwnsList} = require('../helpers/list')
const {ensureLoggedIn} = require('../middleware/auth')
const {db, LIST_INCLUDE_REGIONS, USER_SELECT_NO_PASSWORD} = require('../db')
const listUpdateSchema = require('../schemas/listUpdate.json')

const router = express.Router();

/** GET /lists/[listID] => {list}
 *
 * Returns the list with regions.
 *
 * Authorization required: Login
 **/

router.get("/:listID", ensureLoggedIn, async function (req, res, next) {
  try {
    const listID = +req.params.listID;
    const list = await db.list.findUnique({
      include: {
        ...LIST_INCLUDE_REGIONS,
        owner: {select: USER_SELECT_NO_PASSWORD}
      },
      where: {id: listID}
    });

    // Verify the list exists and user is authorized
    if(!list) throw new NotFoundError(`List #${listID} doesn't exist.`);
    if(!userOwnsList(list, res.locals.userToken)) throw new UnauthorizedError();

    return res.json({list});
  }
  catch(err) {
    return next(err);
  }
});

/** PATCH /lists/[listID] {data} => {list}
 *
 * Updates the list record for list #lisID.  Data must include one of: {name, description}
 *
 * Returns the updated list without regions.
 *
 * Authorization required: Login
 **/

router.patch("/:listID", ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, listUpdateSchema);
    if(!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const listID = +req.params.listID;
    const list = await db.list.findUnique({where: {id: listID}, select: {id: true, ownerName: true}})

    // Verify the list exists and user is authorized
    if(!list) throw new NotFoundError(`List #${listID} doesn't exist.`);
    if(!userOwnsList(list, res.locals.userToken)) throw new UnauthorizedError();

    // Update the list record
    const updatedList = await db.list.update({data: req.body, where: {id: listID}});
    return res.json({list: updatedList});
  }
  catch(err) {
    return next(err);
  }
});

/** DELETE /lists/[listID] => {deleted: listID}
 * 
 * Deletes the list with the given list ID and returns the list ID.
 *
 * Authorization required: Login
 **/

router.delete("/:listID", ensureLoggedIn, async function (req, res, next) {
  try {
    const listID = +req.params.listID;
    const list = await db.list.findUnique({where: {id: listID}, select: {id: true, ownerName: true}});

    // Verify the list exists and user is authorized
    if(!list) throw new NotFoundError(`List #${listID} doesn't exist.`);
    if(!userOwnsList(list, res.locals.userToken)) throw new UnauthorizedError();

    // Delete the list
    await db.list.delete({where: {id: listID}});
    return res.json({deleted: listID});
  }
  catch(err) {
    return next(err);
  }
});

module.exports = router

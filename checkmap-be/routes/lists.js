/** Routes for lists. */
const express = require('express')
const jsonschema = require('jsonschema')

const {NotFoundError, BadRequestError} = require('../expressError')
const {getListRegion} = require('../helpers/list')
const {ensureLoggedIn, ensureSelfOrAdmin} = require('../middleware/auth')
const {db, RegionType} = require('../db')
const listCreateSchema = require('../schemas/listCreate.json')
const listUpdateSchema = require('../schemas/listUpdate.json')

const router = express.Router({mergeParams: true});

const INCLUDE_REGIONS = {
  counties: {orderBy: {name: 'asc'}},
  states: {orderBy: {name: 'asc'}}
};

/** GET /[username]/lists => {lists}
 *
 * Returns the users' lists with regions.
 *
 * Authorization required: Login
 **/

router.get("/", ensureLoggedIn, ensureSelfOrAdmin, async function (req, res, next) {
  try {
    const {username} = req.params;

    // Verify the user exists
    if(!await db.user.findUnique({where: {username}, select: {username: true}}))
      throw new NotFoundError(`User ${username} doesn't exist.`);

    const lists = await db.list.findMany({
      include: INCLUDE_REGIONS,
      where: {ownerName: username},
      orderBy: {name: 'asc'}
    });

    return res.json({lists});
  }
  catch(err) {
    return next(err);
  }
});

/** GET /[username]/lists/[listID] => {list}
 *
 * Returns the list with regions.
 *
 * Authorization required: Login
 **/

router.get("/:listID", ensureLoggedIn, ensureSelfOrAdmin, async function (req, res, next) {
  try {
    const listID = +req.params.listID;
    const list = await db.list.findUnique({
      include: INCLUDE_REGIONS,
      where: {id: listID}
    });

    // Verify the list exists
    if(!list) throw new NotFoundError(`List #${listID} doesn't exist.`);

    return res.json({list});
  }
  catch(err) {
    return next(err);
  }
});

/** POST /[username]/lists {name, description (optional), regionType} => {list}
 *
 * Adds a new list.
 *
 * Returns the newly created list with (empty) regions.
 *
 * Authorization required: Login
 **/

router.post("/", ensureLoggedIn, ensureSelfOrAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, listCreateSchema);
    if(!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const {username} = req.params;

    // Verify the user exists
    if(!await db.user.findUnique({where: {username}, select: {username: true}}))
      throw new NotFoundError(`User ${username} doesn't exist.`);

    // Create the list
    const list = await db.list.create({
      data: {
        ...req.body,
        ownerName: username
      },
      include: INCLUDE_REGIONS
    });
    return res.status(201).json({list});
  }
  catch(err) {
    return next(err);
  }
});

/** PATCH /[username]/lists/[listID] {data} => {list}
 *
 * Updates the list record for list #lisID.  Data must include one of: {name, description}
 *
 * Returns the updated list without regions.
 *
 * Authorization required: Login
 **/

router.patch("/:listID", ensureLoggedIn, ensureSelfOrAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, listUpdateSchema);
    if(!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const listID = +req.params.listID;
    const list = await db.list.findUnique({where: {id: listID}, select: {id: true}})

    // Verify the list exists
    if(!list) throw new NotFoundError(`List #${listID} doesn't exist.`);

    // Update the list record
    const updatedList = await db.list.update({data: req.body, where: {id: listID}});
    return res.json({list: updatedList});
  }
  catch(err) {
    return next(err);
  }
});

/** DELETE /[username]/lists/[listID] => {deleted: listID}
 * 
 * Deletes the list with the given list ID and returns the list ID.
 *
 * Authorization required: Login
 **/

router.delete("/:listID", ensureLoggedIn, ensureSelfOrAdmin, async function (req, res, next) {
  try {
    const listID = +req.params.listID;
    const list = await db.list.findUnique({where: {id: listID}, select: {id: true}});

    // Verify the list exists
    if(!list) throw new NotFoundError(`List #${listID} doesn't exist.`);

    // Delete the list
    await db.list.delete({where: {id: listID}});
    return res.json({deleted: listID});
  }
  catch(err) {
    return next(err);
  }
});

module.exports = router

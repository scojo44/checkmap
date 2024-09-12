/** Routes for lists. */
const express = require('express')
const jsonschema = require('jsonschema')

const {NotFoundError, BadRequestError, UnauthorizedError} = require('../expressError')
const {getListRegion, userOwnsList} = require('../helpers/list')
const {ensureLoggedIn} = require('../middleware/auth')
const {db} = require('../db')
const listRegionAddRemoveSchema = require('../schemas/listRegionAddRemove.json')

const router = express.Router({mergeParams: true});

/** GET /lists/[listID]/regions => {regionType, regions}
 *
 * Returns the list's regions.
 *
 * Authorization required: Login
 **/

router.get("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const {username} = req.params;
    const listID = +req.params.listID;

    // Get the list, making sure it exists and user is authorized
    let list = await db.list.findUnique({where: {id: listID}, select: {id: true, regionType: true, ownerName: true}})
    if(!list) throw new NotFoundError(`List #${listID} doesn't exist.`);
    if(!userOwnsList(list, res.locals.userToken)) throw new UnauthorizedError();

    const {regionModel, regionsField} = getListRegion(list);

    list = await db.list.findUnique({
      where: {id: listID},
      include: {[regionsField]: {orderBy: {name: 'asc'}}}
    });

    return res.json({regionType: list.regionType, regions: list[regionsField]});
  }
  catch(err) {
    return next(err);
  }
});

/** POST /lists/[listID]/regions {regionID} => {added: region}
 *
 * Adds a region to a list.  The list's region type will already be set to states or counties.
 *
 * Returns the added region.
 *
 * Authorization required: Login
 **/

router.post("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, listRegionAddRemoveSchema);
    if(!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const {username} = req.params;
    const listID = +req.params.listID;
    const regionID = +req.body.regionID;

    // Get the list, making sure it exists and user is authorized
    const list = await db.list.findUnique({where: {id: listID}, select: {id: true, regionType: true, ownerName: true}})
    if(!list) throw new NotFoundError(`List #${listID} doesn't exist.`);
    if(!userOwnsList(list, res.locals.userToken)) throw new UnauthorizedError();

    const {regionModel, regionsField} = getListRegion(list);

    // Get the county or state record, making sure it exists
    const region = await db[regionModel].findUnique({where: {id: regionID}, select: {id: true, name: true}});
    if(!region) throw new NotFoundError(`Unknown ${list.regionType}: #${regionID}`);

    // Add the region to the list
    await db.list.update({
      where: {id: list.id},
      data: {
        [regionsField]: {
          connect: {id: regionID}
        }
      }
    })
    return res.json({added: region});
  }
  catch(err) {
    return next(err);
  }
});

/** DELETE /lists/[listID]/regions/[regionID] {regionID} => {removed: region}
 *
 * Removes a region from a list.
 *
 * Returns the deleted region.
 *
 * Authorization required: Login
 **/

router.delete("/:regionID", ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate({regionID: +req.params.regionID}, listRegionAddRemoveSchema);
    if(!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const {username} = req.params;
    const listID = +req.params.listID;
    const regionID = +req.params.regionID;

    // Get the list, making sure it exists and user is authorized
    let list = await db.list.findUnique({where: {id: listID}, select: {id: true, regionType: true, ownerName: true}})
    if(!list) throw new NotFoundError(`List #${listID} doesn't exist.`);
    if(!userOwnsList(list, res.locals.userToken)) throw new UnauthorizedError();

    const {regionModel, regionsField} = getListRegion(list);

    // Reload the list with the collection of regions
    list = await db.list.findUnique({where: {id: listID}, include: {[regionsField]: {where: {id: regionID}}}});

    // Check the region to remove is in the list
    if(list[regionsField].length === 0)
      throw new NotFoundError(`Region #${regionID} not in list.`);

    // Get the county or state record
    const region = await db[regionModel].findUnique({where: {id: regionID}, select: {id: true, name: true}});

    // Add the region to the list
    await db.list.update({
      where: {id: list.id},
      data: {
        [regionsField]: {
          disconnect: {id: regionID}
        }
      }
    })
    return res.json({removed: region});
  }
  catch(err) {
    return next(err);
  }
});

module.exports = router

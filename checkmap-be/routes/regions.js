const express = require('express')

const {NotFoundError} = require('../expressError')
const {ensureLoggedIn} = require('../middleware/auth')
const {db, RegionType} = require('../db');
const {getListRegion} = require('../helpers/list');

const router = express.Router();

/** GET /regions?type=RegionType => {regionType, regions}
 *
 * Returns all the county info.
 *
 * Authorization required: Login
 **/

router.get("/", async function (req, res, next) {
  try {
    const {type} = req.query;

    if(!RegionType[type]) throw new NotFoundError(`Unknown region type: ${type}`);

    const {regionModel} = getListRegion(type);
    const regions = await db[regionModel].findMany();

    return res.json(regions);
  }
  catch(err) {
    return next(err);
  }
});

module.exports = router

const {db, RegionType, UserRole} = require('../db')

/** Determine which region type the list uses.
 * 
 * Returns the region model name (county) and region database table/field name (counties)
 * 
 * Throws a NotFoundError the list doesn't exist.
 */

function getListRegion(list) {
  let regionModel;
  let regionsField;

  // Figure out which model and field/table names to use.
  switch(list.regionType) {
    case RegionType.County:  regionModel = 'county';  regionsField = 'counties';  break;
    case RegionType.State:   regionModel = 'state';   regionsField = 'states';    break;
  }

  return {regionModel, regionsField};
}

/** Returns true if the logged in user owns the list or is an admin. */

function userOwnsList(list, token) {
  const isListOwner = token?.username === list.ownerName;
  const isAdmin = token?.role === UserRole.Admin;

  return isListOwner || isAdmin
}

module.exports = {getListRegion, userOwnsList}
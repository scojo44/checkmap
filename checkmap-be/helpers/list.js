const {db, RegionType} = require('../db')

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

module.exports = {getListRegion}

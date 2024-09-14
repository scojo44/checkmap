const {db, CountyType} = require('../db')
const geoJSONCountiesDisplay = require('./us-county-boundaries-display.json')
const geoJSONStates = require('./us-state-boundaries.json')

/** Kick off seeding the database */

async function seedDatabase() {
  try {
    if(await db.state.count() === 0) seedStates();
    if(await db.county.count() === 0) seedCounties();
  }
  catch(e) {
    console.error(e);
  }
}

/** Load state info and boundaries into the database */

function seedStates() {
  console.log('==== Seeding state info...');

  geoJSONStates.features.map(async state => {
    const {geoid, name} = state.properties;

      await db.state.create({
        data: {
          id: +geoid,
          name,
          boundary: state
        }
      });
  });

  console.log('==== State info loaded!');
}

/** Load county or county-equivalent info and boundaries into the database */

function seedCounties() {
  console.log('==== Seeding county info...');
  const countyTypes = {};

  geoJSONCountiesDisplay.features.map(async county => {
    const {geoid, stusab, statefp, name, namelsad} = county.properties;

    // Get what the state or territory calls a "county" from the long name
    let type = namelsad.replace(name, '').trimStart(); // Remove the short name from the long name
    countyTypes[type] = (countyTypes[type] || 0) + 1; // Count the counties for each type

    // Set the county type
    switch (type) {
      case 'County':  type = CountyType.County;  break;
      case 'Parish':  type = CountyType.Parish;  break; // Louisiana
      case 'Municipio':  type = CountyType.Municipio;  break; // Puerto Rico
      case 'city':  type = CountyType.IndependentCity;  break; // Alaska
      case 'City and Borough':  type = CountyType.CityAndBorough;  break; // Alaska
      case 'Borough':  type = CountyType.Borough;  break; // Alaska
      case 'Census Area':  type = CountyType.CensusArea;  break; // Alaska
      case 'Island':  type = CountyType.District;  break; // US Virgin Islands
      case 'District':  type = CountyType.District;  break; // American Somoa
      case 'Municipality':  type = CountyType.Municipality;  break; // Northern Mariana Islands & Anchorage & Skagway, AK
      default:
        console.log('==== County has no type!', geoid, stusab, name, namelsad);
        break;
    }

    // Fix some oddities from OpenDataSoft's county data
    if(geoid === 32510) county.type = CountyType.IndependentCity; // Carson City, NV
    if(geoid === 60030) county.type = CountyType.UnorganizedAtoll; // Rose Island, American Somoa
    if(geoid === 60040) county.type = CountyType.UnorganizedAtoll; // Swains Island, American Somoa

    await db.county.create({
      data: {
        id: +geoid,
        name,
        fullName: namelsad,
        stateID: +statefp,
        boundary: county
      }
    });
  });

  console.log('==== County type statistics', countyTypes);
  console.log('==== County info loaded!');
}

module.exports = seedDatabase;

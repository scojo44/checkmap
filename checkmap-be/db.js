/** Database setup for Checkmap. */
const {PrismaClient, UserRole, RegionType, CountyType} = require('@prisma/client')
const {getDatabaseURI} = require('./config')

const db = new PrismaClient({
  datasourceUrl: getDatabaseURI()
});

// Needed for Render with prisma?
// ssl: {rejectUnauthorized: false}

// Common select and include statements
const LIST_INCLUDE_REGIONS = {
  counties: {orderBy: {name: 'asc'}},
  states: {orderBy: {name: 'asc'}}
};
const USER_SELECT_NO_PASSWORD = {
  username: true,
  imageURL: true,
  role: true
};
const USER_SELECT_WITH_RELATIONS = {
  ...USER_SELECT_NO_PASSWORD,
  lists: {include: LIST_INCLUDE_REGIONS}
};

module.exports = {
  db, UserRole, RegionType, CountyType,
  LIST_INCLUDE_REGIONS,
  USER_SELECT_NO_PASSWORD,
  USER_SELECT_WITH_RELATIONS
}

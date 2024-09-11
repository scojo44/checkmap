/** Database setup for Checkmap. */
const {PrismaClient, UserRole, RegionType, CountyType} = require('@prisma/client')
const {getDatabaseURI} = require('./config')

const db = new PrismaClient({
  datasourceUrl: getDatabaseURI()
});

// Needed for Render with prisma?
// ssl: {rejectUnauthorized: false}

module.exports = {db, UserRole, RegionType, CountyType}

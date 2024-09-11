const color = require('colors-cli')

/** Use dev database, testing database, or via env var, production database
 * 
 * Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
 * See the documentation for all the connection string options: https://pris.ly/d/connection-strings
 */
function getDatabaseURI() {
  const DEV_DB_URI = 'postgresql://scott@localhost:5432/checkmap?schema=public';

  return (process.env.NODE_ENV === "test")
    ? DEV_DB_URI.replace('checkmap', 'checkmap_test')
    : process.env.DATABASE_URL || DEV_DB_URI; // Production and non-test dev databases
}

// Speed up bcrypt during tests.  Value for production considered good enough as of 2021.
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;
const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";
const PORT = +process.env.PORT || 3000;

// Show the comfiguration in the console once per startup.  Avoids flooding the console while running tests.
if(!global.configShown) {
  global.configShown = true;
  console.log(
`===== Checkmap Config ================'
${color.yellow("NODE_ENV:")} ${process.env.NODE_ENV}
${color.yellow("SECRET_KEY:")} ${SECRET_KEY}
${color.yellow("PORT:")} ${PORT.toString()}
${color.yellow("BCRYPT_WORK_FACTOR")} ${BCRYPT_WORK_FACTOR}
${color.yellow("Database:")} ${getDatabaseURI()}
======================================`);
}

module.exports = {
  SECRET_KEY,
  PORT,
  BCRYPT_WORK_FACTOR,
  getDatabaseURI
}

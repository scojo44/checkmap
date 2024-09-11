const bcrypt = require('bcrypt')
const {BCRYPT_WORK_FACTOR} = require('./config')
const {createToken} = require('./helpers/tokens')
const {db, UserRole, RegionType} = require('./db')

async function commonBeforeAll() {}
async function commonBeforeEach() {
  // Clear users and lists
  await db.user.deleteMany();
  await db.$executeRaw`ALTER SEQUENCE lists_id_seq RESTART WITH 1`; // This is a tag function/tagged template

  // Create test users
  await db.user.create({
    data: {
      username: 'u1',
      imageURL: 'u1.jpeg',
      password: await bcrypt.hash("password1", BCRYPT_WORK_FACTOR)
    }
  });
  await db.user.create({
    data: {
      username: 'u2',
      password: await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
      role: UserRole.Admin
    }
  });
  await db.user.create({
    data: {
      username: 'u3',
      password: await bcrypt.hash("password3", BCRYPT_WORK_FACTOR)
    }
  });

  // Create test lists
  await db.list.create({
    data: {
      name: 'Test List 1a',
      description: 'This is a test list.',
      regionType: RegionType.State,
      ownerName: 'u1',
      states: {
        connect: [{id: 16}, {id: 30}, {id: 53}] // Idaho, Montana, Washington
      }
    }
  });
  await db.list.create({
    data: {
      name: 'Test List 1b',
      description: 'This is another test list.',
      regionType: RegionType.County,
      ownerName: 'u1'
    }
  });
  await db.list.create({
    data: {
      name: 'Test List 2',
      description: 'This is also a test list.',
      regionType: RegionType.County,
      ownerName: 'u2'
    }
  });
}
async function commonAfterEach() {}
async function commonAfterAll() {}

// Create test tokens
const tokenUser1 = createToken({username: 'u1', role: UserRole.User});
const tokenUser2Admin = createToken({username: 'u2', role: UserRole.Admin});

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  tokenUser1,
  tokenUser2Admin
}

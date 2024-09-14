const jwt = require('jsonwebtoken')

const {commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll, tokenUser1, tokenUser2Admin} = require('../_testCommon')
const {SECRET_KEY} = require('../config')
const {db, RegionType} = require('../db')
const {getListRegion, userOwnsList} = require('./list')

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/**************************************************************/
describe("getListRegion", () => {
  test('works', async function () {
    const {regionModel, regionsField} = getListRegion(RegionType.State);

    expect(regionModel).toEqual('state');
    expect(regionsField).toEqual('states');
  });
});

/**************************************************************/
describe("userOwnsList", () => {
  test('works for self', async function () {
    const list = await db.list.findUnique({where: {id: 1}, select: {ownerName: true}});

    expect(userOwnsList(list, jwt.verify(tokenUser1, SECRET_KEY))).toBe(true);
  });

  test('works for admin', async function () {
    const list = await db.list.findUnique({where: {id: 1}, select: {ownerName: true}});

    expect(userOwnsList(list, jwt.verify(tokenUser2Admin, SECRET_KEY))).toBe(true);
  });

  test('unauth for other user', async function () {
    const list = await db.list.findUnique({where: {id: 3}, select: {ownerName: true}});

    expect(userOwnsList(list, jwt.verify(tokenUser1, SECRET_KEY))).toBe(false);
  });
});

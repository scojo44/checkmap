const jwt = require('jsonwebtoken')

const {commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll, tokenUser1, tokenUser2Admin} = require('../_testCommon')
const {SECRET_KEY} = require('../config')
const {db} = require('../db')
const { UnauthorizedError } = require('../expressError')
const {getListRegion, userOwnsList} = require('./list')

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/**************************************************************/
describe("getListRegion", () => {
  test('works', async function () {
    const list = await db.list.findUnique({where: {id: 1}, select: {regionType: true}});
    const {regionModel, regionsField} = getListRegion(list);

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

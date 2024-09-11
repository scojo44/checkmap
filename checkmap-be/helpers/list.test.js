const {commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll} = require('../_testCommon')
const {db} = require('../db')
const {getListRegion} = require('./list')

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

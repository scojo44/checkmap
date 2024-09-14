const request = require('supertest')

const {commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll, tokenUser1, tokenUser2Admin} = require('../_testCommon')
const app = require('../app')
const {UserRole, RegionType} = require('../db')

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/**************************************************************/
describe('GET /lists/:id/regions', function () {
  const expectedRegions = {
    regionType: RegionType.State,
    regions: [
    {id: 16, name: 'Idaho', boundary: expect.any(Object)},
    {id: 30, name: 'Montana', boundary: expect.any(Object)},
    {id: 53, name: 'Washington', boundary: expect.any(Object)}
  ]};
  
  test('works for self', async function () {
    const resp = await request(app)
      .get(`/lists/1/regions`)
      .set('authorization', `Bearer ${tokenUser1}`);

    expect(resp.body).toEqual(expectedRegions);
  });

  test('works for admins', async function () {
    const resp = await request(app)
      .get(`/lists/1/regions`)
      .set('authorization', `Bearer ${tokenUser2Admin}`);

    expect(resp.body).toEqual(expectedRegions);
  });

  test('unauth for other non-admin user', async function () {
    const resp = await request(app)
      .get(`/lists/3/regions`)
      .set('authorization', `Bearer ${tokenUser1}`);

    expect(resp.statusCode).toEqual(401);
  });

  test('unauth for anon', async function () {
    const resp = await request(app)
      .get(`/lists/1/regions`);

    expect(resp.statusCode).toEqual(401);
  });

  test('not found if list not found', async function () {
    const resp = await request(app)
      .get(`/lists/9999999/regions`)
      .set('authorization', `Bearer ${tokenUser1}`);

    expect(resp.statusCode).toEqual(404);
  });
});

/**************************************************************/
describe('POST /lists/:id/regions', function () {
  const utahID = {regionID: 49};
  const utah = {
    id: 49,
    name: 'Utah'
  }
  
  test('works for self', async function () {
    const resp = await request(app)
      .post(`/lists/1/regions`)
      .send(utahID)
      .set('authorization', `Bearer ${tokenUser1}`);

    expect(resp.body).toEqual({added: utah});
  });

  test('works for admins', async function () {
    const resp = await request(app)
      .post(`/lists/1/regions`)
      .send(utahID)
      .set('authorization', `Bearer ${tokenUser2Admin}`);

    expect(resp.body).toEqual({added: utah});
  });

  test('unauth for other non-admin user', async function () {
    const resp = await request(app)
      .post(`/lists/3/regions`)
      .send(utahID)
      .set('authorization', `Bearer ${tokenUser1}`);

    expect(resp.statusCode).toEqual(401);
  });

  test('unauth for anon', async function () {
    const resp = await request(app)
      .post(`/lists/1/regions`)
      .send(utahID)

    expect(resp.statusCode).toEqual(401);
  });

  test('not found if list not found', async function () {
    const resp = await request(app)
      .post(`/lists/9999/add`)
      .send(utahID)
      .set('authorization', `Bearer ${tokenUser1}`);

    expect(resp.statusCode).toEqual(404);
  });

  test('not found if region not found', async function () {
    const resp = await request(app)
      .post(`/lists/1/regions`)
      .send({regionID: 99999999})
      .set('authorization', `Bearer ${tokenUser1}`);

    expect(resp.statusCode).toEqual(404);
  });

  test('bad request if negative region ID', async function () {
    const resp = await request(app)
      .post(`/lists/1/regions`)
      .send({regionID: -123})
      .set('authorization', `Bearer ${tokenUser1}`);

    expect(resp.statusCode).toEqual(400);
  });

  test('bad request if region not an integer', async function () {
    const resp = await request(app)
      .post(`/lists/1/regions`)
      .send({regionID: 'xyzzy'})
      .set('authorization', `Bearer ${tokenUser1}`);

    expect(resp.statusCode).toEqual(400);
  });
});

/**************************************************************/
describe('DELETE /lists/:listID/regions/:regionID', function () {
  const washington = {
    id: 53,
    name: 'Washington'
  }
  
  test('works for self', async function () {
    const resp = await request(app)
      .delete(`/lists/1/regions/53`)
      .set('authorization', `Bearer ${tokenUser1}`);

    expect(resp.body).toEqual({removed: washington});
  });

  test('works for admins', async function () {
    const resp = await request(app)
      .delete(`/lists/1/regions/53`)
      .set('authorization', `Bearer ${tokenUser2Admin}`);

    expect(resp.body).toEqual({removed: washington});
  });

  test('unauth for other non-admin user', async function () {
    const resp = await request(app)
      .delete(`/lists/3/regions/53`)
      .set('authorization', `Bearer ${tokenUser1}`);

    expect(resp.statusCode).toEqual(401);
  });

  test('unauth for anon', async function () {
    const resp = await request(app)
      .delete(`/lists/1/regions/53`);

    expect(resp.statusCode).toEqual(401);
  });

  test('not found if list not found', async function () {
    const resp = await request(app)
      .delete(`/lists/9999/regions/53`)
      .set('authorization', `Bearer ${tokenUser1}`);

    expect(resp.statusCode).toEqual(404);
  });

  test('not found if region exists but not in list', async function () {
    const resp = await request(app)
      .delete(`/lists/1/regions/32`) // Nevada
      .set('authorization', `Bearer ${tokenUser1}`);

    expect(resp.statusCode).toEqual(404);
  });

  test('not found if region not found', async function () {
    const resp = await request(app)
      .delete(`/lists/1/regions/99999999`)
      .set('authorization', `Bearer ${tokenUser1}`);

    expect(resp.statusCode).toEqual(404);
  });

  test('bad request if negative region ID', async function () {
    const resp = await request(app)
      .delete(`/lists/1/regions/-24`)
      .set('authorization', `Bearer ${tokenUser1}`);

    expect(resp.statusCode).toEqual(400);
  });

  test('bad request if region not an integer', async function () {
    const resp = await request(app)
      .delete(`/lists/1/regions/xyzzy`)
      .set('authorization', `Bearer ${tokenUser1}`);

    expect(resp.statusCode).toEqual(400);
  });
});

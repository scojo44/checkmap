const request = require('supertest')

const {commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll, tokenUser1, tokenUser2Admin} = require('../_testCommon')
const app = require('../app')
const {UserRole, RegionType} = require('../db')

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/**************************************************************/
describe('GET /lists/:id', function () {
  const expectedList = {
    id: 1,
    name: 'Test List 1a',
    description: 'This is a test list.',
    color: 'cornflowerblue',
    ownerName: 'u1',
    regionType: RegionType.State,
    counties: [],
    states: [
      {id: 16, name: 'Idaho', boundary: expect.any(Object)},
      {id: 30, name: 'Montana', boundary: expect.any(Object)},
      {id: 53, name: 'Washington', boundary: expect.any(Object)}
    ],
    owner: {
      username: 'u1',
      imageURL: 'u1.jpeg',
      role: UserRole.User,
    }
  };

  test('works for admins', async function () {
    const resp = await request(app)
      .get(`/lists/1`)
      .set('authorization', `Bearer ${tokenUser2Admin}`);

    expect(resp.body).toEqual({list: expectedList});
  });

  test('works for self', async function () {
    const resp = await request(app)
      .get(`/lists/1`)
      .set('authorization', `Bearer ${tokenUser1}`);

    expect(resp.body).toEqual({list: expectedList});
  });

  test('unauth for other non-admin user', async function () {
    const resp = await request(app)
      .get(`/lists/3`)
      .set('authorization', `Bearer ${tokenUser1}`);

    expect(resp.statusCode).toEqual(401);
  });

  test('unauth for anon', async function () {
    const resp = await request(app)
      .get(`/lists/1`);

    expect(resp.statusCode).toEqual(401);
  });

  test('not found for non-existing list', async function () {
    const resp = await request(app)
      .get(`/lists/9999`)
      .set('authorization', `Bearer ${tokenUser1}`);

    expect(resp.statusCode).toEqual(404);
  });
});

/**************************************************************/
describe('PATCH /lists/:id', () => {
  const expectedList = {
    id: 1,
    name: 'Test List 1a',
    description: 'This is a better description.',
    color: 'cornflowerblue',
    regionType: RegionType.State,
    ownerName: 'u1'
  };

  test('works for self', async function () {
    const resp = await request(app)
      .patch(`/lists/1`)
      .send({description: 'This is a better description.'})
      .set('authorization', `Bearer ${tokenUser1}`);

    expect(resp.body).toEqual({list: expectedList});
  });

  test('works for admins', async function () {
    const resp = await request(app)
      .patch(`/lists/1`)
      .send({description: 'This is a better description.'})
      .set('authorization', `Bearer ${tokenUser2Admin}`);

    expect(resp.body).toEqual({list: expectedList});
  });

  test('unauth for other non-admin user', async function () {
    const resp = await request(app)
      .patch(`/lists/3`)
      .send({description: 'This is a better description.'})
      .set('authorization', `Bearer ${tokenUser1}`);

    expect(resp.statusCode).toEqual(401);
  });

  test('unauth for anon', async function () {
    const resp = await request(app)
      .patch(`/lists/1`)
      .send({description: 'This is a better description.'})

    expect(resp.statusCode).toEqual(401);
  });

  test('not found for non-existing list', async function () {
    const resp = await request(app)
      .patch(`/lists/9999`)
      .send({description: 'This is a better description.'})
      .set('authorization', `Bearer ${tokenUser1}`);

    expect(resp.statusCode).toEqual(404);
  });

  test('bad request if invalid data', async function () {
    const resp = await request(app)
      .patch(`/lists/1`)
      .send({name: 'This name is tooooooooo looooooooooooong'})
      .set('authorization', `Bearer ${tokenUser1}`);

    expect(resp.statusCode).toEqual(400);
  });

  test('bad request if no data', async function () {
    const resp = await request(app)
      .patch(`/lists/1`)
      .send({})
      .set('authorization', `Bearer ${tokenUser1}`);

    expect(resp.statusCode).toEqual(400);
  });
});

/**************************************************************/
describe('DELETE /lists/:id', function () {
  test('works for self', async function () {
    const resp = await request(app)
      .delete(`/lists/1`)
      .set('authorization', `Bearer ${tokenUser1}`);

    expect(resp.body).toEqual({deleted: 1});
  });

  test('works for admins', async function () {
    const resp = await request(app)
      .delete(`/lists/1`)
      .set('authorization', `Bearer ${tokenUser2Admin}`);

    expect(resp.body).toEqual({deleted: 1});
  });

  test('unauth for other non-admin user', async function () {
    const resp = await request(app)
      .delete(`/lists/3`)
      .set('authorization', `Bearer ${tokenUser1}`);

    expect(resp.statusCode).toEqual(401);
  });

  test('unauth for anon', async function () {
    const resp = await request(app)
      .delete(`/lists/1`);

    expect(resp.statusCode).toEqual(401);
  });

  test('not found for non-existing list', async function () {
    const resp = await request(app)
      .delete(`/lists/9999`)
      .set('authorization', `Bearer ${tokenUser1}`);

    expect(resp.statusCode).toEqual(404);
  });
});

const request = require('supertest')

const {commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll, tokenUser1, tokenUser2Admin} = require('../_testCommon')
const app = require('../app')
const {UserRole, RegionType} = require('../db')

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/**************************************************************/
describe('GET /users/:username/lists', function () {
  const expectedLists = [
    {
      id: 1,
      name: 'Test List 1a',
      description: 'This is a test list.',
      ownerName: 'u1',
      regionType: RegionType.State,
      counties: [],
      states: [
        {id: 16, name: 'Idaho', boundary: expect.any(Object)},
        {id: 30, name: 'Montana', boundary: expect.any(Object)},
        {id: 53, name: 'Washington', boundary: expect.any(Object)}
      ]
    },
    {
      id: 2,
      name: 'Test List 1b',
      description: 'This is another test list.',
      ownerName: 'u1',
      regionType: RegionType.County,
      counties: [],
      states: []
    }
  ]
  
  test('works for self', async function () {
    const resp = await request(app)
      .get(`/users/u1/lists`)
      .set('authorization', `Bearer ${tokenUser1}`);

    expect(resp.body).toEqual({lists: expectedLists});
  });

  test('works for admins', async function () {
    const resp = await request(app)
      .get(`/users/u1/lists`)
      .set('authorization', `Bearer ${tokenUser2Admin}`);

    expect(resp.body).toEqual({lists: expectedLists});
  });

  test('unauth for other non-admin user', async function () {
    const resp = await request(app)
      .get(`/users/u3/lists`)
      .set('authorization', `Bearer ${tokenUser1}`);

    expect(resp.statusCode).toEqual(401);
  });

  test('unauth for anon', async function () {
    const resp = await request(app)
      .get(`/users/u1/lists`);

    expect(resp.statusCode).toEqual(401);
  });

  test('not found if user not found', async function () {
    const resp = await request(app)
      .get(`/users/xyzzy/lists`)
      .set('authorization', `Bearer ${tokenUser2Admin}`);

    expect(resp.statusCode).toEqual(404);
  });
});

/**************************************************************/
describe('GET /users/:username/lists/:id', function () {
  const expectedList = {
    id: 1,
    name: 'Test List 1a',
    description: 'This is a test list.',
    ownerName: 'u1',
    regionType: RegionType.State,
    counties: [],
    states: [
      {id: 16, name: 'Idaho', boundary: expect.any(Object)},
      {id: 30, name: 'Montana', boundary: expect.any(Object)},
      {id: 53, name: 'Washington', boundary: expect.any(Object)}
    ]
  };

  test('works for admins', async function () {
    const resp = await request(app)
      .get(`/users/u1/lists/1`)
      .set('authorization', `Bearer ${tokenUser2Admin}`);

    expect(resp.body).toEqual({list: expectedList});
  });

  test('works for self', async function () {
    const resp = await request(app)
      .get(`/users/u1/lists/1`)
      .set('authorization', `Bearer ${tokenUser1}`);

    expect(resp.body).toEqual({list: expectedList});
  });

  test('unauth for other non-admin user', async function () {
    const resp = await request(app)
      .get(`/users/u3/lists/3`)
      .set('authorization', `Bearer ${tokenUser1}`);

    expect(resp.statusCode).toEqual(401);
  });

  test('unauth for anon', async function () {
    const resp = await request(app)
      .get(`/users/u1/lists/1`);

    expect(resp.statusCode).toEqual(401);
  });

  test('not found for non-existing list', async function () {
    const resp = await request(app)
      .get(`/users/u1/lists/9999`)
      .set('authorization', `Bearer ${tokenUser1}`);

    expect(resp.statusCode).toEqual(404);
  });
});

/**************************************************************/
describe('POST /users/:username/lists', function () {
  const newList = {
    name: 'New List',
    description: 'This is a new test list.',
    regionType: RegionType.County
  };
  const createdList = {
    ...newList,
    id: 4,
    ownerName: 'u1',
    states: [],
    counties: []
  }
  
  test('works for self', async function () {
    const resp = await request(app)
      .post(`/users/u1/lists`)
      .send(newList)
      .set('authorization', `Bearer ${tokenUser1}`);

    expect(resp.body).toEqual({list: createdList});
  });

  test('works for admins', async function () {
    const resp = await request(app)
      .post(`/users/u1/lists`)
      .send(newList)
      .set('authorization', `Bearer ${tokenUser2Admin}`);

    expect(resp.body).toEqual({list: createdList});
  });

  test('unauth for other non-admin user', async function () {
    const resp = await request(app)
      .post(`/users/u3/lists`)
      .send(newList)
      .set('authorization', `Bearer ${tokenUser1}`);

    expect(resp.statusCode).toEqual(401);
  });

  test('unauth for anon', async function () {
    const resp = await request(app)
      .post(`/users/u1/lists`)
      .send(newList);

    expect(resp.statusCode).toEqual(401);
  });

  test('not found if user not found', async function () {
    const resp = await request(app)
      .post(`/users/xyzzy/lists`)
      .send(newList)
      .set('authorization', `Bearer ${tokenUser2Admin}`);

    expect(resp.statusCode).toEqual(404);
  });
});

/**************************************************************/
describe('PATCH /users/:username/lists/:id', () => {
  const expectedList = {
    id: 1,
    name: 'Test List 1a',
    description: 'This is a better description.',
    regionType: RegionType.State,
    ownerName: 'u1'
  };

  test('works for self', async function () {
    const resp = await request(app)
      .patch(`/users/u1/lists/1`)
      .send({description: 'This is a better description.'})
      .set('authorization', `Bearer ${tokenUser1}`);

    expect(resp.body).toEqual({list: expectedList});
  });

  test('works for admins', async function () {
    const resp = await request(app)
      .patch(`/users/u1/lists/1`)
      .send({description: 'This is a better description.'})
      .set('authorization', `Bearer ${tokenUser2Admin}`);

    expect(resp.body).toEqual({list: expectedList});
  });

  test('unauth for other non-admin user', async function () {
    const resp = await request(app)
      .patch(`/users/u3/lists/3`)
      .send({description: 'This is a better description.'})
      .set('authorization', `Bearer ${tokenUser1}`);

    expect(resp.statusCode).toEqual(401);
  });

  test('unauth for anon', async function () {
    const resp = await request(app)
      .patch(`/users/u1/lists/1`)
      .send({description: 'This is a better description.'})

    expect(resp.statusCode).toEqual(401);
  });

  test('not found for non-existing list', async function () {
    const resp = await request(app)
      .patch(`/users/u1/lists/9999`)
      .send({description: 'This is a better description.'})
      .set('authorization', `Bearer ${tokenUser1}`);

    expect(resp.statusCode).toEqual(404);
  });

  test('bad request if invalid data', async function () {
    const resp = await request(app)
      .patch(`/users/u1/lists/1`)
      .send({name: 'This name is tooooooooo looooooooooooong'})
      .set('authorization', `Bearer ${tokenUser1}`);

    expect(resp.statusCode).toEqual(400);
  });

  test('bad request if no data', async function () {
    const resp = await request(app)
      .patch(`/users/u1/lists/1`)
      .send({})
      .set('authorization', `Bearer ${tokenUser1}`);

    expect(resp.statusCode).toEqual(400);
  });
});

/**************************************************************/
describe('DELETE /users/:username/lists/:id', function () {
  test('works for self', async function () {
    const resp = await request(app)
      .delete(`/users/u1/lists/1`)
      .set('authorization', `Bearer ${tokenUser1}`);

    expect(resp.body).toEqual({deleted: 1});
  });

  test('works for admins', async function () {
    const resp = await request(app)
      .delete(`/users/u1/lists/1`)
      .set('authorization', `Bearer ${tokenUser2Admin}`);

    expect(resp.body).toEqual({deleted: 1});
  });

  test('unauth for other non-admin user', async function () {
    const resp = await request(app)
      .delete(`/users/u3/lists/3`)
      .set('authorization', `Bearer ${tokenUser1}`);

    expect(resp.statusCode).toEqual(401);
  });

  test('unauth for anon', async function () {
    const resp = await request(app)
      .delete(`/users/u1/lists/1`);

    expect(resp.statusCode).toEqual(401);
  });

  test('not found for non-existing list', async function () {
    const resp = await request(app)
      .delete(`/users/u1/lists/9999`)
      .set('authorization', `Bearer ${tokenUser1}`);

    expect(resp.statusCode).toEqual(404);
  });
});

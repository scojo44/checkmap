const request = require('supertest')

const {commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll, tokenUser1, tokenUser2Admin} = require('../_testCommon')
const app = require('../app')
const {authenticateUser} = require('../helpers/tokens')
const {UserRole, RegionType} = require('../db')

const REGEX_JWT_TOKEN = /^ey[A-Za-z0-9_-]+\.ey[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/**************************************************************/
describe('GET /users', function () {
  const u1 = {
    username: 'u1',
    imageURL: 'u1.jpeg',
    role: UserRole.User,
    lists: [
      {
        id: 1,
        name: 'Test List 1a',
        description: 'This is a test list.',
        regionType: RegionType.State,
        ownerName: 'u1'
      },
      {
        id: 2,
        name: 'Test List 1b',
        description: 'This is another test list.',
        regionType: RegionType.County,
        ownerName: 'u1'
      }
    ]
  };
  const u2 = {
    username: 'u2',
    imageURL: null,
    role: UserRole.Admin,
    lists: [
      {
        id: 3,
        name: 'Test List 2',
        description: 'This is also a test list.',
        regionType: RegionType.County,
        ownerName: 'u2'
      }
    ]
  };
  const u3 = {
    username: 'u3',
    imageURL: null,
    role: UserRole.User,
    lists: []
  };

  test('works for admins', async function () {
    const resp = await request(app)
      .get('/users')
      .set('authorization', `Bearer ${tokenUser2Admin}`);

    expect(resp.body.users).toEqual([u1, u2, u3]);
  });

  test('unauth for non-admin users', async function () {
    const resp = await request(app)
      .get('/users')
      .set('authorization', `Bearer ${tokenUser1}`);

    expect(resp.statusCode).toEqual(401);
  });

  test('unauth for anon', async function () {
    const resp = await request(app)
      .get('/users');

    expect(resp.statusCode).toEqual(401);
  });
});

/**************************************************************/
describe('GET /users/:username', function () {
  const expectedUser = {
    username: 'u1',
    imageURL: 'u1.jpeg',
    role: UserRole.User,
    lists: [
      {
        id: 1,
        name: 'Test List 1a',
        description: 'This is a test list.',
        regionType: RegionType.State,
        ownerName: 'u1'
      },
      {
        id: 2,
        name: 'Test List 1b',
        description: 'This is another test list.',
        regionType: RegionType.County,
        ownerName: 'u1'
      }
    ]
  };

  test('works for admins', async function () {
    const resp = await request(app)
      .get(`/users/u1`)
      .set('authorization', `Bearer ${tokenUser2Admin}`);

    expect(resp.body).toEqual({ user: expectedUser });
  });

  test('works for self', async function () {
    const resp = await request(app)
      .get(`/users/u1`)
      .set('authorization', `Bearer ${tokenUser1}`);

    expect(resp.body).toEqual({ user: expectedUser });
  });

  test('unauth for other non-admin user', async function () {
    const resp = await request(app)
      .get(`/users/u3`)
      .set('authorization', `Bearer ${tokenUser1}`);

    expect(resp.statusCode).toEqual(401);
  });

  test('unauth for anon', async function () {
    const resp = await request(app)
      .get(`/users/u1`);

    expect(resp.statusCode).toEqual(401);
  });

  test('not found if user not found', async function () {
    const resp = await request(app)
      .get(`/users/xyzzy`)
      .set('authorization', `Bearer ${tokenUser2Admin}`);

    expect(resp.statusCode).toEqual(404);
  });
});

/**************************************************************/
describe('POST /users', function () {
  const newUser = {
    username: 'u-new',
    password: 'password-new',
    imageURL: 'new.jpeg',
    role: UserRole.User
  };

  // Create admin user with a copy
  const newAdmin = structuredClone(newUser);
  newAdmin.role = UserRole.Admin;

  test('works for admins: create non-admin', async function () {
    const resp = await request(app)
      .post('/users')
      .send(newUser)
      .set('authorization', `Bearer ${tokenUser2Admin}`);

    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      user: {
        ...newUser,
        password: undefined, // Removes password
      },
      token: expect.stringMatching(REGEX_JWT_TOKEN)
    });
  });

  test('works for admins: create admin', async function () {
    const resp = await request(app)
      .post('/users')
      .send(newAdmin)
      .set('authorization', `Bearer ${tokenUser2Admin}`);

    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      user: {
        ...newAdmin,
        password: undefined, // Removes password
      },
      token: expect.stringMatching(REGEX_JWT_TOKEN)
    });
  });

  test('unauth for non-admin users', async function () {
    const resp = await request(app)
      .post('/users')
      .send(newUser)
      .set('authorization', `Bearer ${tokenUser1}`);

    expect(resp.statusCode).toEqual(401);
  });

  test('unauth for anon', async function () {
    const resp = await request(app)
      .post('/users')
      .send(newUser);

    expect(resp.statusCode).toEqual(401);
  });

  test('bad request if missing data', async function () {
    const resp = await request(app)
      .post('/users')
      .send({imageURL: 'new.jpeg'}) // Missing required username
      .set('authorization', `Bearer ${tokenUser2Admin}`);

    expect(resp.statusCode).toEqual(400);
  });

  test('bad request if invalid data', async function () {
    const resp = await request(app)
      .post('/users')
      .send({
        username: 'u-new',
        password: 'password-new',
        imageURL: 1234,
        role: UserRole.Admin
      })
      .set('authorization', `Bearer ${tokenUser2Admin}`);

    expect(resp.statusCode).toEqual(400);
  });
});

/**************************************************************/
describe('PATCH /users/:username', () => {
  const expectedUser = {
    username: 'u1',
    imageURL: 'updated.jpeg',
    role: UserRole.User
  };

  test('works for admins', async function () {
    const resp = await request(app)
      .patch(`/users/u1`)
      .send({imageURL: 'updated.jpeg'})
      .set('authorization', `Bearer ${tokenUser2Admin}`);

    expect(resp.body).toEqual({user: expectedUser});
  });

  test('works for self', async function () {
    const resp = await request(app)
      .patch(`/users/u1`)
      .send({imageURL: 'updated.jpeg'})
      .set('authorization', `Bearer ${tokenUser1}`);

    expect(resp.body).toEqual({user: expectedUser});
  });

  test('unauth for other non-admin user', async function () {
    const resp = await request(app)
      .patch(`/users/u3`)
      .send({imageURL: 'updated.jpeg'})
      .set('authorization', `Bearer ${tokenUser1}`);

    expect(resp.statusCode).toEqual(401);
  });

  test('unauth for anon', async function () {
    const resp = await request(app)
      .patch(`/users/u1`)
      .send({imageURL: 'updated.jpeg'})

    expect(resp.statusCode).toEqual(401);
  });

  test('not found if no such user', async function () {
    const resp = await request(app)
      .patch(`/users/xyzzy`)
      .send({imageURL: 'updated.jpeg'})
      .set('authorization', `Bearer ${tokenUser2Admin}`);

    expect(resp.statusCode).toEqual(404);
  });

  test('bad request if invalid data', async function () {
    const resp = await request(app)
      .patch(`/users/u1`)
      .send({imageURL: 1234})
      .set('authorization', `Bearer ${tokenUser2Admin}`);

    expect(resp.statusCode).toEqual(400);
  });

  test('bad request if no data', async function () {
    const resp = await request(app)
      .patch(`/users/u1`)
      .send({})
      .set('authorization', `Bearer ${tokenUser2Admin}`);

    expect(resp.statusCode).toEqual(400);
  });

  test('works: set new password', async function () {
    const resp = await request(app)
      .patch(`/users/u1`)
      .send({password: 'new-password'})
      .set('authorization', `Bearer ${tokenUser1}`);

    expect(resp.body.user).toEqual({
      username: 'u1',
      imageURL: 'u1.jpeg',
      role: UserRole.User
    });

    const isSuccessful = await authenticateUser('u1', 'new-password');
    expect(isSuccessful).toBeTruthy();
  });
});

/**************************************************************/
describe('DELETE /users/:username', function () {
  test('works for admins', async function () {
    const resp = await request(app)
      .delete(`/users/u1`)
      .set('authorization', `Bearer ${tokenUser2Admin}`);

    expect(resp.body).toEqual({deleted: 'u1'});
  });

  test('works for self', async function () {
    const resp = await request(app)
      .delete(`/users/u1`)
      .set('authorization', `Bearer ${tokenUser1}`);

    expect(resp.body).toEqual({deleted: 'u1'});
  });

  test('unauth for other non-admin user', async function () {
    const resp = await request(app)
      .delete(`/users/u3`)
      .set('authorization', `Bearer ${tokenUser1}`);

    expect(resp.statusCode).toEqual(401);
  });

  test('unauth for anon', async function () {
    const resp = await request(app)
      .delete(`/users/u1`);

    expect(resp.statusCode).toEqual(401);
  });

  test('not found if user missing', async function () {
    const resp = await request(app)
      .delete(`/users/xyzzy`)
      .set('authorization', `Bearer ${tokenUser2Admin}`);

    expect(resp.statusCode).toEqual(404);
  });
});

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

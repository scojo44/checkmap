const request = require('supertest')
const jwt = require('jsonwebtoken')
const {commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll} = require('../_testCommon')
const app = require('../app');
const {SECRET_KEY} = require('../config');
const {UserRole} = require('../db');

const REGEX_JWT_TOKEN = /^ey[A-Za-z0-9_-]+\.ey[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/**************************************************************/
describe("POST /auth/token", function () {
  test("works", async function () {
    const resp = await request(app)
      .post("/auth/token")
      .send({
        username: "u1",
        password: "password1"
      });

    expect(resp.body).toEqual({
      token: expect.stringMatching(REGEX_JWT_TOKEN)
    });
    expect(jwt.verify(resp.body.token, SECRET_KEY)).toMatchObject({
      username: 'u1',
      role: UserRole.User
    })
  });

  test("unauth with non-existent user", async function () {
    const resp = await request(app)
      .post("/auth/token")
      .send({
        username: "no-such-user",
        password: "password1"
      });
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth with wrong password", async function () {
    const resp = await request(app)
      .post("/auth/token")
      .send({
        username: "u1",
        password: "nope"
      });
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request with missing data", async function () {
    const resp = await request(app)
      .post("/auth/token")
      .send({username: "u1"});
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
      .post("/auth/token")
      .send({
        username: 42,
        password: "above-is-a-number"
      });
    expect(resp.statusCode).toEqual(400);
  });
});

/**************************************************************/
describe("POST /auth/register", function () {
  test("works for anon", async function () {
    const resp = await request(app)
      .post("/auth/register")
      .send({
        username: "new",
        password: "password"
      });

    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      token: expect.stringMatching(REGEX_JWT_TOKEN)
    });
  });

  test("bad request with admin role", async function () {
    const resp = await request(app)
      .post("/auth/register")
      .send({
        username: "new",
        password: "password",
        role: UserRole.Admin
      });

      expect(resp.statusCode).toEqual(400);
  });

  test("bad request with missing fields", async function () {
    const resp = await request(app)
      .post("/auth/register")
      .send({username: "new"});

      expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
      .post("/auth/register")
      .send({
        username: "new",
        password: "password",
        imageURL: 1234
      });

    expect(resp.statusCode).toEqual(400);
  });
});

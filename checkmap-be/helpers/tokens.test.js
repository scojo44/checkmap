const jwt = require('jsonwebtoken')

const {commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll} = require('../_testCommon')
const {SECRET_KEY} = require('../config')
const {BadRequestError, UnauthorizedError} = require('../expressError');
const {db, UserRole} = require('../db');
const {createToken, registerUser, authenticateUser} = require('./tokens');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/**************************************************************/
describe("createToken", () => {
  test("works: not admin", () => {
    const token = createToken({username: "test", role: UserRole.User});
    const payload = jwt.verify(token, SECRET_KEY);

    expect(payload).toEqual({
      iat: expect.any(Number),
      username: "test",
      role: UserRole.User
    });
  });

  test("works: admin", () => {
    const token = createToken({username: "test", role: UserRole.Admin});
    const payload = jwt.verify(token, SECRET_KEY);

    expect(payload).toEqual({
      iat: expect.any(Number),
      username: "test",
      role: UserRole.Admin
    });
  });

  test("works: default no admin", () => {
    // Given the security risk if this didn't work, checking this specifically
    const token = createToken({username: "test"});
    const payload = jwt.verify(token, SECRET_KEY);

    expect(payload).toEqual({
      iat: expect.any(Number),
      username: "test",
      role: UserRole.User
    });
  });
});

/**************************************************************/
describe('registerUser', () => {
  const newUser = {
    username: 'new',
    imageURL: 'new.jpeg',
    role: UserRole.User
  };

  test('works', async () => {
    const user = await registerUser({
      ...newUser,
      password: 'password'
    });
    expect(user).toEqual(newUser);

    const found = await db.user.findUnique({
      where: {username: 'new'}
    });
    expect(found).toBeTruthy();
    expect(found.role).toEqual(UserRole.User);
  });

  test('works: adds admin', async () => {
    const user = await registerUser({
      ...newUser,
      password: 'password',
      role: UserRole.Admin
    });
    expect(user).toEqual({
      ...newUser,
      role: UserRole.Admin
    });

    const found = await db.user.findUnique({
      where: {username: 'new'}
    });
    expect(found).toBeTruthy();
    expect(found.role).toEqual(UserRole.Admin);
  });

  test('bad request with dup data', async () => {
    // First, register a user
    await registerUser({...newUser, password: 'password'});

    // Now try to register the same user
    const promise = registerUser({...newUser, password: 'password'});
    await expect(promise).rejects.toThrow(BadRequestError);
  });
});

/**************************************************************/
describe('authenticateUser', () => {
  test('works', async () => {
    const user = await authenticateUser('u1', 'password1');
    expect(user).toEqual({
      username: 'u1',
      imageURL: 'u1.jpeg',
      role: UserRole.User
    });
  });

  test('unauth if no such user', async () => {
    const promise = authenticateUser('nope', 'password');
    await expect(promise).rejects.toThrow(UnauthorizedError);
  });

  test('unauth if wrong password', async () => {
    const promise = authenticateUser('u1', 'wrong');
    await expect(promise).rejects.toThrow(UnauthorizedError);
  });
});

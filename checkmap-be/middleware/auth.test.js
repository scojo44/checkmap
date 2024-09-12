const jwt = require('jsonwebtoken')
const {SECRET_KEY} = require('../config')
const {UnauthorizedError} = require('../expressError')
const {UserRole} = require('../db');
const {authenticateJWT, ensureLoggedIn, ensureAdmin, ensureSelfOrAdmin} = require('./auth');

const testJWT = jwt.sign({username: "test", role: UserRole.User}, SECRET_KEY);
const badJWT = jwt.sign({username: "test", role: UserRole.User}, "wrong");

/**************************************************************/
describe("authenticateJWT", () => {
  test("works: via header", () => {
    expect.assertions(2);

    //there are multiple ways to pass an authorization token, this is how you pass it in the header.
    //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
    const req = {headers: {authorization: `Bearer ${testJWT}`}};
    const res = {locals: {}};
    const next = err => {
      expect(err).toBeFalsy();
    };

    authenticateJWT(req, res, next);
    expect(res.locals).toEqual({
      userToken: {
        iat: expect.any(Number),
        username: "test",
        role: UserRole.User
      }
    });
  });

  test("works: no header", () => {
    expect.assertions(2);

    const req = {};
    const res = {locals: {}};
    const next = err => {
      expect(err).toBeFalsy();
    };

    authenticateJWT(req, res, next);
    expect(res.locals).toEqual({});
  });

  test("works: invalid token", () => {
    expect.assertions(2);

    const req = {headers: {authorization: `Bearer ${badJWT}`}};
    const res = {locals: {}};
    const next = err => {
      expect(err).toBeFalsy();
    };

    authenticateJWT(req, res, next);
    expect(res.locals).toEqual({});
  });
});

/**************************************************************/
describe("ensureLoggedIn", () => {
  test("works", () => {
    expect.assertions(1);

    const req = {};
    const res = {locals: {userToken: {username: "test", role: UserRole.User}}};
    const next = err => {
      expect(err).toBeFalsy();
    };

    ensureLoggedIn(req, res, next);
  });

  test("unauth if no login", () => {
    expect.assertions(1);

    const req = {};
    const res = {locals: {}};
    const next = err => {
      expect(err).toBeInstanceOf(UnauthorizedError);
    };

    ensureLoggedIn(req, res, next);
  });
});

/**************************************************************/
describe("ensureAdmin", () => {
  test("works", () => {
    expect.assertions(1);

    const req = {};
    const res = {locals: {userToken: {username: "test", role: UserRole.Admin}}};
    const next = err => {
      expect(err).toBeFalsy();
    };

    ensureAdmin(req, res, next);
  });

  test("unauth if no admin rights", () => {
    expect.assertions(1);

    const req = {};
    const res = {locals: {userToken: {username: "test", role: UserRole.User}}};
    const next = err => {
      expect(err).toBeInstanceOf(UnauthorizedError);
    };

    ensureAdmin(req, res, next);
  });
});

/**************************************************************/
describe("ensureSelfOrAdmin", () => {
  test("works for user", () => {
    expect.assertions(1);

    const req = {params: {username: 'test'}};
    const res = {locals: {userToken: {username: "test", role: UserRole.User}}};
    const next = err => {
      expect(err).toBeFalsy();
    };

    ensureSelfOrAdmin(req, res, next);
  });

  test("works for admin", () => {
    expect.assertions(1);

    const req = {params: {username: 'anyone'}};
    const res = {locals: {userToken: {username: "test", role: UserRole.Admin}}};
    const next = err => {
      expect(err).toBeFalsy();
    };

    ensureSelfOrAdmin(req, res, next);
  });

  test("unauth if not the same user", () => {
    expect.assertions(1);

    const req = {params: {username: 'someoneelse'}};
    const res = {locals: {userToken: {username: "test", role: UserRole.User}}};
    const next = err => {
      expect(err).toBeInstanceOf(UnauthorizedError);
    };

    ensureSelfOrAdmin(req, res, next);
  });
});

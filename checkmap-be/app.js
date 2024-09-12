/** Express backend for Checkmap. */
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const seedDatabase = require('./seeddata/seed')
const {NotFoundError} = require('./expressError')
const {authenticateJWT} = require('./middleware/auth')
const authRouter = require('./routes/auth')
const userRouter = require('./routes/users')
const listRouter = require('./routes/lists')
const regionsRouter = require('./routes/regions')

const app = express();

seedDatabase();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use('/lists', listRouter);
listRouter.use('/:listID/regions', regionsRouter);

/** Handle 404 errors -- this matches everything */
app.use((req, res, next) => {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use((err, req, res, next) => {
  if(process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status }
  });
});

module.exports = app

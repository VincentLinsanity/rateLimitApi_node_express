"use strict";

const express = require("express");
const indexRouter = require("./routes/index");
const { API } = require("./config");
const { PORT, RATE_LIMITER_TIME, RATE_LIMITER_COUNT } = API;
const middleware = require("./middleware");
const rateLimiter = middleware.rateLimiter(
  RATE_LIMITER_TIME,
  RATE_LIMITER_COUNT
);
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", rateLimiter.checkRateLimiterByIP, indexRouter);

process.on("uncaughtException", err => {
  console.log(err);
});

app.listen(PORT, () => {
  console.log(`server listen on ${PORT}`);
  console.log(`server api rate limit time: ${RATE_LIMITER_TIME} seconds`);
  console.log(`server api rate limit count: ${RATE_LIMITER_COUNT} times`);
});

module.exports = app;

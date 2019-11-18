"use strict";

const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.send(req.rateLimiterStatus);
});

module.exports = router;

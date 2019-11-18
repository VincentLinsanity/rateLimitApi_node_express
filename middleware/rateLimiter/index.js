"use strict";

const { redis, REDIS_KEYS } = require("../../caches");

const RateLimiter = function(rateLimiterTime, rateLimiterCount) {
  const rateLimiter = {};

  const options = {
    RATE_LIMITER_TIME: rateLimiterTime || 60,
    RATE_LIMITER_COUNT: rateLimiterCount || 60
  };

  rateLimiter.checkRateLimiterByIP = async function(req, res, next) {
    const ip = req.ip;
    const key = REDIS_KEYS.API_RATE_LIMITER_IP(ip);
    let value = await redis.get(key);
    if (value >= options.RATE_LIMITER_COUNT) {
      req.rateLimiterStatus = "Error";
      await next();
      return;
    }
    if (!value) {
      await redis.set(key, 1);
      value = 1;
    } else if (value < options.RATE_LIMITER_COUNT) {
      await redis.incr(key);
      value++;
    }
    await redis.expire(key, options.RATE_LIMITER_TIME + 1);
    setTimeout(() => {
      redis.decr(key);
    }, options.RATE_LIMITER_TIME * 1000);
    req.rateLimiterStatus = `${value}`;
    await next();
  };

  return rateLimiter;
};

module.exports = RateLimiter;

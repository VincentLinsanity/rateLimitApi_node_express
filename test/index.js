"use strict";

const assert = require("assert");
require("../server");
const request = require("request-promise");
const { redis, REDIS_KEYS } = require("../caches");

describe("TEST RATE LIMITER", async () => {
  describe("initial step", async () => {
    it("clean redis", async () => {
      const rateLimitKeys = REDIS_KEYS.API_RATE_LIMITER_IP("*");
      const keys = await redis.keys(rateLimitKeys);
      for (let i = 0; i < keys.length; i++) {
        await redis.del(keys[i]);
      }
    });
  });

  describe("request step", async () => {
    it("first response must be 1", async () => {
      const response = await request("http://127.0.0.1:3001/");
      assert.equal(response, "1");
    });

    it("second response must be 2", async () => {
      const response = await request("http://127.0.0.1:3001/");
      assert.equal(response, "2");
    });

    it("after 59 times request must be 60", async () => {
      const tasks = [];
      for (let i = 0; i < 57; i++) {
        tasks.push(request("http://127.0.0.1:3001/"));
      }
      await Promise.all(tasks);
      const response = await request("http://127.0.0.1:3001/");
      assert.equal(response, "60");
    });

    it("after 60 times request must be Error", async () => {
      const response = await request("http://127.0.0.1:3001/");
      assert.equal(response, "Error");
    });
  });

  describe("release step", async () => {
    it("after 60 seconds, response mush be 1", async () => {
      await delay(60);
      const response = await request("http://127.0.0.1:3001/");
      assert.equal(response, "1");
    });
  });
});

const delay = s => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, s * 1000);
  });
};

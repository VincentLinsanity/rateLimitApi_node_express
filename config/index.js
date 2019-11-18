"use strict";

const path = require("path");
const pathBase = path.resolve(__dirname, "..");
const config = {
  env: process.env.ENV || "development",
  log: {
    dir: path.resolve(pathBase, "log")
  }
};

let overrides = {};
if (config.env === "development") {
  overrides = require("./config.json");
} else {
  overrides = require(`./config_${config.env}.json`);
}

Object.assign(config, overrides);

if (config.env !== "development") {
  config.REDIS = {
    SETTING: {
      cluster:
        process.env.REDIS_SETTING_CLUSTER || config.REDIS.SETTING.cluster,
      hosts: process.env.REDIS_SETTING_HOSTS || config.REDIS.SETTING.hosts,
      tls: process.env.REDIS_SETTING_TLS || config.REDIS.SETTING.tls,
      password:
        process.env.REDIS_SETTING_PASSWORD || config.REDIS.SETTING.password
    }
  };
}

module.exports = config;

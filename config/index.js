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
let ops_overrides = {};
if (config.env === "development") {
  overrides = require("./config.json");
} else {
  overrides = require(`./config_${config.env}.json`);
  ops_overrides = require(`./config_ops.json`);
}

Object.assign(config, overrides);
Object.assign(config, ops_overrides);

if (config.env !== "development") {
  config.REDIS = {
    SETTING: {
      cluster:
        process.env.REDIS_SETTING_CLUSTER || config.redis.activity.cluster,
      hosts: process.env.REDIS_SETTING_HOSTS || config.redis.activity.hosts,
      tls: process.env.REDIS_SETTING_TLS || config.redis.activity.tls,
      password:
        process.env.REDIS_SETTING_PASSWORD || config.redis.activity.password
    }
  };
}

module.exports = config;

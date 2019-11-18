"use strict";

const Redis = require("ioredis");
const config = require("../../config");
const { SETTING } = config.REDIS;
const { cluster, hosts, tls, password } = SETTING;
const options = { redisOptions: {} };
if (password !== "" && tls === "TRUE") {
  options.redisOptions = {
    password
  };
}
const nodes = [];
hosts.split(",").forEach(item => {
  const host = item.split(":")[0];
  const port = item.split(":")[1];
  nodes.push({
    host,
    port
  });
});
let client = {};
if (cluster === "TRUE") {
  client = new Redis.Cluster(nodes, options);
} else {
  client = new Redis({
    host: nodes[0].host,
    port: nodes[0].port,
    password
  });
}

client.on("error", error => {
  console.log(`redis connect fail, process exit, ${error}`);
  process.exit();
});

module.exports = client;

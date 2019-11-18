"use strict";

const self = {
  API_RATE_LIMITER_IP: ip => {
    return `API:RATE_LIMITER:${ip}`;
  }
};

module.exports = self;

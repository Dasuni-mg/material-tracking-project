const { Adapter } = require("./lib/adapter");

exports.builder = new Adapter.Builder()
  .rx()
  .regex(/(.+)\s+/)
  .shape((chunk) => chunk[1]);

const { Adapter } = require("./lib/adapter");

exports.builder = new Adapter.Builder()
  .rx()
  .regex(/\x02(.+)\s+/)
  .shape((chunk) => ({
    stable: chunk[1].substring(0, 1) === "S",
    reading: Number(chunk[1].substring(1)),
  }));

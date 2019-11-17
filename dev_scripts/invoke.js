process.env.NODE_ENV = "test";

require('dotenv').config()

const lambdaFn = require("../index");
const event = require("./test_events/standard");


async function run() {
  console.log(await lambdaFn.handler(event));
}

run();


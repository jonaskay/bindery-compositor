const path = require("path")

const publish = require(".")
const createConfig = require("./config").create
const createBucket = require("./bucket").create
const run = require("../run")
const { success } = require("../pubsub")
const cleanup = require("../cleanup")

jest.mock("./config")
jest.mock("./bucket")
jest.mock("../run")
jest.mock("../pubsub")
jest.mock("../cleanup")

beforeEach(() => {
  createConfig.mockImplementation(() => new Promise(resolve => resolve()))
  createBucket.mockImplementation(() => new Promise(resolve => resolve()))
  run.mockImplementation(() => new Promise(resolve => resolve()))
  success.mockImplementation(() => new Promise(resolve => resolve()))
  cleanup.mockImplementation(() => new Promise(resolve => resolve()))

  publish("my-zone", "myprefix-my-publication")
})

test("creates a config file", () => {
  expect(createConfig).toHaveBeenCalledWith(
    path.resolve(__dirname, "..", "..", "..", "compositor-template"),
    "my-publication"
  )
})

test("creates a bucket", () => {
  expect(createBucket).toHaveBeenCalledWith("my-publication")
})

test("runs the build process", () => {
  expect(run).toHaveBeenNthCalledWith(
    1,
    "yarn",
    ["workspace", "compositor-template", "build", "--prefix-paths"],
    __dirname
  )
})

test("runs the copy process", () => {
  expect(run).toHaveBeenNthCalledWith(2, "gsutil", [
    "-m",
    "cp",
    "-r",
    path.resolve(
      __dirname,
      "..",
      "..",
      "..",
      "compositor-template",
      "public",
      "**"
    ),
    "gs://my-publication",
  ])
})

test("sends a success message", () => {
  expect(success).toHaveBeenCalledWith("my-publication", "publish")
})

test("deletes the instance", () => {
  expect(cleanup).toHaveBeenCalledWith("my-zone", "myprefix-my-publication")
})

const path = require("path")

const compositor = require("./app")
const createConfig = require("./create-config")
const createBucket = require("./create-bucket")
const run = require("./run")
const publishMessage = require("./publish-message")
const cleanup = require("./cleanup")

jest.mock("./create-config")
jest.mock("./create-bucket")
jest.mock("./run")
jest.mock("./publish-message")
jest.mock("./cleanup")

beforeEach(() => {
  createConfig.mockImplementation(() => new Promise(resolve => resolve(42)))
  createBucket.mockImplementation(() => new Promise(resolve => resolve(42)))
  run.mockImplementation(() => new Promise(resolve => resolve(42)))
  cleanup.mockImplementation(() => new Promise(resolve => resolve(42)))

  compositor()
})

test("creates a config file", () => {
  expect(createConfig).toHaveBeenCalledWith(
    path.resolve(__dirname, "..", "..", "compositor-template"),
    "MyStorageBucket",
    "MyHostname"
  )
})

test("creates a bucket", () => {
  expect(createBucket).toHaveBeenCalledWith("MyHostname")
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
  expect(run).toHaveBeenNthCalledWith(
    2,
    "bin/copy",
    [],
    path.resolve(__dirname, "..")
  )
})

test("publishes the deploy message", () => {
  expect(publishMessage).toHaveBeenCalledWith("MyHostname", "MyTopic")
})

test("deletes the instance", () => {
  expect(cleanup).toHaveBeenCalledWith("MyComputeZone", "MyHostname")
})

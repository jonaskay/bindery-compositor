const path = require("path")

const compositor = require("./app")
const createConfig = require("./create-config")
const runProcess = require("./run-process")
const deleteInstance = require("./delete-instance")

jest.mock("./create-config")
jest.mock("./run-process")
jest.mock("./delete-instance")

beforeEach(() => {
  createConfig.mockImplementation(() => new Promise(resolve => resolve(42)))
  runProcess.mockImplementation(() => new Promise(resolve => resolve(42)))
  deleteInstance.mockImplementation(() => new Promise(resolve => resolve(42)))

  compositor()
})

test("creates a config file", () => {
  expect(createConfig).toHaveBeenCalledWith(
    path.resolve(__dirname, "..", "..", "compositor-template"),
    "MyStorageBucket",
    "MyHostname"
  )
})

test("runs the build process", () => {
  expect(runProcess).toHaveBeenNthCalledWith(
    1,
    "yarn",
    ["workspace", "compositor-template", "build", "--prefix-paths"],
    __dirname
  )
})

test("runs the copy process", () => {
  expect(runProcess).toHaveBeenNthCalledWith(
    2,
    "bin/copy",
    [],
    path.resolve(__dirname, "..")
  )
})

test("deletes the instance", () => {
  expect(deleteInstance).toHaveBeenCalledWith(
    "MyProjectID",
    "MyComputeZone",
    "MyHostname"
  )
})

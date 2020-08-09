const path = require("path")
const axios = require("axios")

const publish = require(".")
const createConfig = require("./config").create
const run = require("../run")
const { success } = require("../pubsub")
const cleanup = require("../cleanup")

jest.mock("axios")
jest.mock("./config")
jest.mock("../run")
jest.mock("../pubsub")
jest.mock("../cleanup")

beforeEach(() => {
  const payload = {
    data: {
      id: "my-project",
      type: "publication",
      attributes: {
        name: "my-name",
        title: "my-title",
      },
    },
  }
  axios.get.mockResolvedValue({ data: payload })

  createConfig.mockImplementation(() => new Promise(resolve => resolve()))
  run.mockImplementation(() => new Promise(resolve => resolve()))
  success.mockImplementation(() => new Promise(resolve => resolve()))
  cleanup.mockImplementation(() => new Promise(resolve => resolve()))

  publish("my-zone", "mytemplate-my-project", "my-bucket", "my-topic")
})

test("creates a config file", () => {
  expect(createConfig).toHaveBeenCalledWith(
    path.resolve(__dirname, "..", "..", "..", "compositor-template"),
    "my-name",
    "my-title"
  )
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
  expect(run).toHaveBeenNthCalledWith(4, "gsutil", [
    "-m",
    "cp",
    "-r",
    path.resolve(__dirname, "..", "..", "..", "compositor-template", "public"),
    "gs://my-bucket/my-name",
  ])
})

test("sends a success message", () => {
  expect(success).toHaveBeenCalledWith({ id: "my-project" }, "my-topic")
})

test("deletes the instance", () => {
  expect(cleanup).toHaveBeenCalledWith("my-zone", "mytemplate-my-project")
})

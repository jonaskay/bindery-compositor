const path = require("path")
const axios = require("axios")

const publish = require(".")
const createConfig = require("./config").create
const createBucket = require("./bucket").create
const run = require("../run")
const { success } = require("../pubsub")
const cleanup = require("../cleanup")

jest.mock("axios")
jest.mock("./config")
jest.mock("./bucket")
jest.mock("../run")
jest.mock("../pubsub")
jest.mock("../cleanup")

beforeEach(() => {
  const payload = {
    data: {
      id: 42,
      type: "publication",
      attributes: {
        name: "my-name",
        title: "my-title",
      },
    },
  }
  axios.get.mockResolvedValue({ data: payload })

  createConfig.mockImplementation(() => new Promise(resolve => resolve()))
  createBucket.mockImplementation(() => new Promise(resolve => resolve()))
  run.mockImplementation(() => new Promise(resolve => resolve()))
  success.mockImplementation(() => new Promise(resolve => resolve()))
  cleanup.mockImplementation(() => new Promise(resolve => resolve()))

  publish("my-zone", "myprefix-my-publication", "my-host")
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

test("creates a bucket", () => {
  expect(createBucket).toHaveBeenCalledWith("my-publication")
})

test("runs the create backend bucket process", () => {
  expect(run).toHaveBeenNthCalledWith(2, "gcloud", [
    "compute",
    "backend-buckets",
    "create",
    "published-my-publication",
    "--gcs-bucket-name=my-publication",
  ])
})

test("runs the add path matcher process", () => {
  expect(run).toHaveBeenNthCalledWith(3, "gcloud", [
    "compute",
    "url-maps",
    "add-path-matcher",
    "published",
    "--path-matcher-name=forward-my-publication",
    "--default-backend-bucket=published-my-publication",
    "--backend-bucket-path-rules=/my-name/=published-my-publication",
    "--existing-host=my-host",
  ])
})

test("runs the copy files process", () => {
  expect(run).toHaveBeenNthCalledWith(4, "gsutil", [
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

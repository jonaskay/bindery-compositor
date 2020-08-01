const path = require("path")

const unpublish = require(".")
const run = require("../run")
const { success } = require("../pubsub")
const cleanup = require("../cleanup")

jest.mock("../run")
jest.mock("../pubsub")
jest.mock("../cleanup")

beforeEach(() => {
  run.mockImplementation(() => new Promise(resolve => resolve()))
  success.mockImplementation(() => new Promise(resolve => resolve()))
  cleanup.mockImplementation(() => new Promise(resolve => resolve()))

  unpublish("my-zone", "myprefix-my-publication", "my-topic")
})

test("runs the delete bucket process", () => {
  expect(run).toHaveBeenCalledWith(
    "bin/delete",
    ["my-publication"],
    path.resolve(__dirname, "..", "..")
  )
})

test("sends a success message", () => {
  expect(success).toHaveBeenCalledWith("my-publication", "my-topic")
})

test("deletes the instance", () => {
  expect(cleanup).toHaveBeenCalledWith("my-zone", "myprefix-my-publication")
})

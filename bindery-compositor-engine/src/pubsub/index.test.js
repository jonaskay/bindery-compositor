const { success, error } = require(".")

let pubsub
let publish
let project

beforeEach(() => {
  publish = jest.fn()
  pubsub = { topic: jest.fn(() => ({ publish })) }

  project = { id: "foo", name: "bar" }
})

test("sends a valid success message", () => {
  const message = {
    project: { id: "foo", name: "bar" },
    error: {},
    timestamp: "1970-01-01T00:00:00.000Z",
  }
  const data = Buffer.from(JSON.stringify(message))

  success(project, "42", pubsub, new Date("1970-01-01"))

  expect(publish).toHaveBeenCalledWith(data)
})

test("sends a valid error message", () => {
  const message = {
    project: { id: "foo", name: "bar" },
    error: { name: "Error", message: "baz" },
    timestamp: "1970-01-01T00:00:00.000Z",
  }
  const data = Buffer.from(JSON.stringify(message))

  const err = new Error("baz")
  error(project, err, "42", pubsub, new Date("1970-01-01"))

  expect(publish).toHaveBeenCalledWith(data)
})

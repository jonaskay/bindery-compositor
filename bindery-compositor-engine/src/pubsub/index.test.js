const { success, error } = require(".")

let pubsub
let publish

beforeEach(() => {
  publish = jest.fn()
  pubsub = { topic: jest.fn(() => ({ publish })) }
})

test("sends a valid success message", () => {
  const message = {
    project: {
      id: "foo",
      name: "bar",
    },
    timestamp: "1970-01-01T00:00:00.000Z",
  }
  const data = Buffer.from(JSON.stringify(message))

  success({ id: "foo", name: "bar" }, "baz", pubsub, new Date("1970-01-01"))

  expect(publish).toHaveBeenCalledWith(data)
})

test("sends a valid error message", () => {
  const message = {
    error: {
      name: "Error",
      message: "foo",
    },
    timestamp: "1970-01-01T00:00:00.000Z",
  }
  const data = Buffer.from(JSON.stringify(message))

  error(new Error("foo"), "bar", pubsub, new Date("1970-01-01"))

  expect(publish).toHaveBeenCalledWith(data)
})

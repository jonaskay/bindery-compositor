const { success } = require(".")

test("sends a valid message", () => {
  const publish = jest.fn()
  const pubsub = { topic: jest.fn(() => ({ publish })) }

  const message = {
    project: {
      id: "foo",
      name: "bar",
    },
    status: "success",
    timestamp: "1970-01-01T00:00:00.000Z",
  }
  const data = Buffer.from(JSON.stringify(message))

  success({ id: "foo", name: "bar" }, "baz", pubsub, new Date("1970-01-01"))

  expect(publish).toHaveBeenCalledWith(data)
})

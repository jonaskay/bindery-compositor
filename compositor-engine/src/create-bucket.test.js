const createBucket = require("./create-bucket")

test("creates a new bucket", () => {
  const create = jest.fn()
  const bucket = jest.fn(() => ({ create }))
  const storage = { bucket }

  createBucket("foo", storage)

  expect(bucket).toHaveBeenCalledWith("foo")
  expect(create).toHaveBeenCalled()
})

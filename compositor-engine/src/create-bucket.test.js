const createBucket = require("./create-bucket")

test("creates a new bucket", done => {
  const makePublic = jest.fn(() => new Promise(resolve => resolve(42)))
  const create = jest.fn(() => new Promise(resolve => resolve(42)))
  const bucket = jest.fn(() => ({ create, makePublic }))
  const storage = { bucket }

  createBucket("foo", storage).then(() => {
    expect(bucket).toHaveBeenCalledWith("foo")
    expect(create).toHaveBeenCalled()
    expect(makePublic).toHaveBeenCalled()

    done()
  })
})

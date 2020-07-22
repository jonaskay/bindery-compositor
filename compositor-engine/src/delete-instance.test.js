const https = require("https")

const deleteInstance = require("./delete-instance")

jest.mock("http")
jest.mock("https")

test("sends a valid HTTP request", async () => {
  await deleteInstance("foo", "bar", "baz")

  expect(https.request.mock.calls[0][0].path).toBe(
    "/compute/v1/projects/foo/zones/bar/instances/baz"
  )
  expect(https.request.mock.calls[0][0].headers["Authorization"]).toBe(
    "Bearer qux"
  )
})

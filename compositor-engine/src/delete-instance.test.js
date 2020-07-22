const axios = require("axios")

const deleteInstance = require("./delete-instance")

jest.mock("axios")

test("sends a valid HTTP request", async () => {
  axios.get.mockResolvedValue({
    access_token: "qux",
    expires_in: 42,
    token_type: "Bearer",
  })

  await deleteInstance("foo", "bar", "baz")

  expect(
    axios.delete
  ).toHaveBeenCalledWith("/projects/foo/zones/bar/instances/baz", {
    baseURL: "https://www.googleapis.com/compute/v1",
    headers: { Authorization: "Bearer qux" },
  })
})

const axios = require("axios")
const path = require("path")
const fs = require("fs")

const createConfig = require("./create-config")

jest.mock("axios")

test("generates a valid config file", async () => {
  axios.get.mockResolvedValue({
    data: {
      data: {
        id: 42,
        type: "publication",
        attributes: {
          title: "foo",
        },
      },
    },
  })

  const destinationDir = path.resolve(__dirname, "..", "..", "tmp")
  const result = await createConfig(destinationDir, "bar", "baz")

  expect(fs.readFileSync(result, "utf8")).toMatchSnapshot()
})

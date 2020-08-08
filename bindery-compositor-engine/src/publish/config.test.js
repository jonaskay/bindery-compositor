const axios = require("axios")
const path = require("path")
const fs = require("fs")

const createConfig = require("./config").create

jest.mock("axios")

test("generates a valid config file", async () => {
  const destinationDir = path.resolve(__dirname, "..", "..", "..", "tmp")
  const result = await createConfig(destinationDir, "bar", "baz")

  expect(fs.readFileSync(result, "utf8")).toMatchSnapshot()
})

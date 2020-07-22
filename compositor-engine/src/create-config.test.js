const fs = require("fs")
const path = require("path")

const createConfig = require("./create-config")

test("generates a valid config file", async () => {
  const destinationDir = path.resolve(__dirname, "..", "..", "tmp")

  const result = await createConfig(destinationDir, "foo", "bar")

  expect(fs.readFileSync(result, "utf8")).toMatchSnapshot()
})

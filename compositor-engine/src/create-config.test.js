const fs = require("fs")
const path = require("path")
const createConfig = require("./create-config")

test("generates a valid config file", done => {
  const destinationDir = path.resolve(__dirname, "..", "..", "tmp")

  createConfig(destinationDir, "foo", "bar", () => {
    const result = path.resolve(destinationDir, "gatsby-config.js")
    expect(fs.readFileSync(result, "utf8")).toMatchSnapshot()

    done()
  })
})

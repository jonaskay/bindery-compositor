const path = require("path")

const createConfig = require("./src/create-config")
const runProcess = require("./src/run-process")
const deleteInstance = require("./src/delete-instance")

createConfig(
  path.resolve(__dirname, "..", "compositor-template"),
  process.env.GOOGLE_STORAGE_BUCKET,
  process.env.HOSTNAME,
  err => {
    if (err) return console.error(err)

    runProcess(
      "yarn",
      ["workspace", "compositor-template", "build", "--prefix-paths"],
      path.resolve(__dirname),
      code => {
        runProcess("bin/copy", [], path.resolve(__dirname), code => {
          deleteInstance(
            process.env.CLOUD_PROJECT_ID,
            process.env.COMPUTE_ENGINE_ZONE,
            process.env.HOSTNAME
          )
        })
      }
    )
  }
)

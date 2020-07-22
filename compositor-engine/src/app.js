const path = require("path")

const createConfig = require("./create-config")
const runProcess = require("./run-process")
const deleteInstance = require("./delete-instance")

module.exports = () => {
  createConfig(
    path.resolve(__dirname, "..", "compositor-template"),
    process.env.GOOGLE_STORAGE_BUCKET,
    process.env.HOSTNAME
  )
    .then(() => {
      return runProcess(
        "yarn",
        ["workspace", "compositor-template", "build", "--prefix-paths"],
        path.resolve(__dirname)
      )
    })
    .then(() => {
      return runProcess("bin/copy", [], path.resolve(__dirname))
    })
    .then(() => {
      return deleteInstance(
        process.env.CLOUD_PROJECT_ID,
        process.env.COMPUTE_ENGINE_ZONE,
        process.env.HOSTNAME
      )
    })
    .catch(err => console.error(err))
}

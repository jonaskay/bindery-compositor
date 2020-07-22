const path = require("path")

const createConfig = require("./create-config")
const runProcess = require("./run-process")
const deleteInstance = require("./delete-instance")

const runBuildProcess = () => {
  return runProcess(
    "yarn",
    ["workspace", "compositor-template", "build", "--prefix-paths"],
    path.resolve(__dirname)
  )
}

const runCopyProcess = () => {
  return runProcess("bin/copy", [], path.resolve(__dirname, ".."))
}

module.exports = () => {
  const storageBucket = process.env.GOOGLE_STORAGE_BUCKET
  const siteId = process.env.HOSTNAME
  const templateDir = path.resolve(__dirname, "..", "..", "compositor-template")

  createConfig(templateDir, storageBucket, siteId)
    .then(() => runBuildProcess())
    .then(() => runCopyProcess())
    .then(() => {
      const projectId = process.env.CLOUD_PROJECT_ID
      const computeZone = process.env.COMPUTE_ENGINE_ZONE

      return deleteInstance(projectId, computeZone, siteId)
    })
}

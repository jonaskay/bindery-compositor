const path = require("path")

const createConfig = require("./create-config")
const runProcess = require("./run-process")
const publishMessage = require("./publish-message")
const cleanup = require("./cleanup")

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
      const topic = process.env.PUBSUB_TOPIC

      return publishMessage(siteId, topic)
    })
    .then(() => {
      const computeZone = process.env.COMPUTE_ENGINE_ZONE

      return cleanup(computeZone, siteId)
    })
}

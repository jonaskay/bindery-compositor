const path = require("path")

const createConfig = require("./create-config")
const createBucket = require("./create-bucket")
const run = require("./run")
const publishMessage = require("./publish-message")
const cleanup = require("./cleanup")

const runCopyProcess = () => {
  return run("bin/copy", [], path.resolve(__dirname, ".."))
}

const runBuildProcess = () => {
  return run(
    "yarn",
    ["workspace", "compositor-template", "build", "--prefix-paths"],
    path.resolve(__dirname)
  )
}

module.exports = () => {
  const storageBucket = process.env.GOOGLE_STORAGE_BUCKET
  const siteId = process.env.HOSTNAME
  const computeZone = process.env.COMPUTE_ENGINE_ZONE
  const templateDir = path.resolve(__dirname, "..", "..", "compositor-template")

  createConfig(templateDir, storageBucket, siteId)
    .then(() => createBucket(siteId))
    .then(() => runBuildProcess())
    .then(() => runCopyProcess())
    .then(() => {
      const topic = process.env.PUBSUB_TOPIC

      return publishMessage(siteId, topic)
    })
    .then(() => cleanup(computeZone, siteId))
    .catch(err => {
      console.error(err)

      cleanup(computeZone, siteId)
    })
}

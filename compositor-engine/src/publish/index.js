const path = require("path")

const createConfig = require("./config").create
const createBucket = require("./bucket").create
const parseHostname = require("../hostname").parse
const run = require("../run")
const { success } = require("../pubsub")
const cleanup = require("../cleanup")

const runCopyProcess = publicationId => {
  return run("bin/copy", [publicationId], path.resolve(__dirname, "..", ".."))
}

const runBuildProcess = () => {
  return run(
    "yarn",
    ["workspace", "compositor-template", "build", "--prefix-paths"],
    path.resolve(__dirname)
  )
}

module.exports = (
  zone = process.env.COMPUTE_ZONE,
  instance = process.env.HOSTNAME,
  topic = process.env.PUBLISH_TOPIC
) => {
  const { publicationId } = parseHostname(instance)
  const templateDir = path.resolve(__dirname, "..", "..", "compositor-template")

  createConfig(templateDir, publicationId)
    .then(() => createBucket(publicationId))
    .then(() => runBuildProcess())
    .then(() => runCopyProcess(publicationId))
    .then(() => success(publicationId, topic))
    .then(() => cleanup(zone, instance))
    .catch(err => {
      console.error(err)

      cleanup(zone, instance)
    })
}

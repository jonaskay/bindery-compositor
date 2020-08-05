const path = require("path")

const createConfig = require("./config").create
const createBucket = require("./bucket").create
const parseHostname = require("../hostname").parse
const run = require("../run")
const { success } = require("../pubsub")
const cleanup = require("../cleanup")

const PUBLISH = "publish"

const templateDir = path.resolve(
  __dirname,
  "..",
  "..",
  "..",
  "compositor-template"
)

const runCopyProcess = publicationId => {
  return run("gsutil", [
    "-m",
    "cp",
    "-r",
    path.resolve(templateDir, "public", "**"),
    `gs://${publicationId}`,
  ])
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
  instance = process.env.HOSTNAME
) => {
  const { publicationId } = parseHostname(instance)

  createConfig(templateDir, publicationId)
    .then(() => createBucket(publicationId))
    .then(() => runBuildProcess())
    .then(() => runCopyProcess(publicationId))
    .then(() => success(publicationId, PUBLISH))
    .then(() => cleanup(zone, instance))
    .catch(err => {
      console.error(err)

      cleanup(zone, instance)
    })
}

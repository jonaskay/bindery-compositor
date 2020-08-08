const path = require("path")

const run = require("../run")
const parseHostname = require("../hostname").parse
const { success } = require("../pubsub")
const cleanup = require("../cleanup")

const UNPUBLISH = "unpublish"

module.exports = (
  zone = process.env.COMPUTE_ZONE,
  instance = process.env.HOSTNAME
) => {
  const { projectId } = parseHostname(instance)

  run("gsutil", ["rm", "-r", `gs://${projectId}`])
    .then(() => success(projectId, UNPUBLISH))
    .then(() => cleanup(zone, instance))
    .catch(err => {
      console.error(err)

      cleanup(zone, instance)
    })
}

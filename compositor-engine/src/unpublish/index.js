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
  const { publicationId } = parseHostname(instance)

  run("gsutil", ["rm", "-r", `gs://${publicationId}`])
    .then(() => success(publicationId, UNPUBLISH))
    .then(() => cleanup(zone, instance))
    .catch(err => {
      console.error(err)

      cleanup(zone, instance)
    })
}

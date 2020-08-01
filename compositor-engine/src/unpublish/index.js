const path = require("path")

const run = require("../run")
const parseHostname = require("../hostname").parse
const { success } = require("../pubsub")
const cleanup = require("../cleanup")

module.exports = (
  zone = process.env.COMPUTE_ZONE,
  instance = process.env.HOSTNAME,
  topic = process.env.UNPUBLISH_TOPIC
) => {
  const { publicationId } = parseHostname(instance)

  run("bin/delete", [publicationId], path.resolve(__dirname, "..", ".."))
    .then(() => success(publicationId, topic))
    .then(() => cleanup(zone, instance))
    .catch(err => {
      console.error(err)

      cleanup(zone, instance)
    })
}

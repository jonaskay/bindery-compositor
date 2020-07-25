const { PubSub } = require("@google-cloud/pubsub")

const SUCCESS = "success"

module.exports = (
  siteId,
  topicName,
  pubsub = new PubSub(),
  now = new Date()
) => {
  const timestamp = now.toISOString()
  const data = JSON.stringify({
    publication: siteId,
    status: SUCCESS,
    timestamp,
  })
  const dataBuffer = Buffer.from(data)

  return pubsub.topic(topicName).publish(dataBuffer)
}

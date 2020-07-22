const { PubSub } = require("@google-cloud/pubsub")

module.exports = (siteId, topicName) => {
  const data = JSON.stringify({ id: siteId, status: "deployed" })
  const dataBuffer = Buffer.from(data)

  return new PubSub().topic(topicName).publish(dataBuffer)
}

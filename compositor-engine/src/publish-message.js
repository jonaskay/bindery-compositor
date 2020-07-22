const { PubSub } = require("@google-cloud/pubsub")

module.exports = (siteId, topicName) => {
  const data = JSON.stringify({ id: siteId, status: "deployed" })

  return new PubSub().topic(topicName).publish(data)
}

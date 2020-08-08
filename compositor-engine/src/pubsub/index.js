const { PubSub } = require("@google-cloud/pubsub")

const SUCCESS = "success"

module.exports = {
  success: (project, topic, pubsub = new PubSub(), now = new Date()) => {
    const timestamp = now.toISOString()
    const data = JSON.stringify({
      project,
      status: SUCCESS,
      timestamp,
    })
    const dataBuffer = Buffer.from(data)

    return pubsub.topic(topic).publish(dataBuffer)
  },
}

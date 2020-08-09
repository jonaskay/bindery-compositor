const { PubSub } = require("@google-cloud/pubsub")

const publish = (message, topic, pubsub, date) => {
  const timestamp = date.toISOString()
  const data = JSON.stringify({ ...message, timestamp })
  const dataBuffer = Buffer.from(data)

  return pubsub.topic(topic).publish(dataBuffer)
}

module.exports = {
  success: (project, topic, pubsub = new PubSub(), now = new Date()) => {
    const message = { project, error: {} }

    return publish(message, topic, pubsub, now)
  },

  error: (project, err, topic, pubsub = new PubSub(), now = new Date()) => {
    const message = { project, error: { name: err.name, message: err.message } }

    return publish(message, topic, pubsub, now)
  },
}

const EventEmitter = require("events")

class FakeResponse extends EventEmitter {
  success() {
    this.emit("end")
  }
}

const https = jest.genMockFromModule("https")
https.request = jest.fn((options, callback) => {
  const res = new FakeResponse()

  callback(res)
  res.success()
})

module.exports = https

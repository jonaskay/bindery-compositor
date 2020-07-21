const EventEmitter = require("events")

class FakeResponse extends EventEmitter {
  success() {
    this.emit(
      "data",
      `{"access_token":"qux", "expires_in":42, "token_type":"Bearer"}`
    )

    this.emit("end")
  }
}

const http = jest.genMockFromModule("http")
http.get = jest.fn((options, callback) => {
  const res = new FakeResponse()

  callback(res)
  res.success()
})

module.exports = http

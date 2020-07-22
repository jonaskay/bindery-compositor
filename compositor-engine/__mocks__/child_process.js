const EventEmitter = require("events")

class FakeStream extends EventEmitter {
  setEncoding() {}
}

class FakeProcess extends EventEmitter {
  constructor() {
    super()

    this.stdout = new FakeStream()
    this.stderr = new FakeStream()
  }

  success() {
    this.stdout.emit("data", "✅")
    this.stderr.emit("data", "❌")

    this.emit("close")
  }

  fail() {
    this.emit("error", "🛑")
  }
}

const childProcess = jest.genMockFromModule("child_process")
childProcess.fake = new FakeProcess()
childProcess.spawn = jest.fn(() => childProcess.fake)

module.exports = childProcess

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

const spawn = () => {
  return new FakeProcess()
}

const childProcess = jest.genMockFromModule("child_process")
childProcess.spawn = spawn

module.exports = childProcess

const path = require("path")

const runProcess = require("./run-process")

jest.mock("child_process")

let childProcess
const callback = jest.fn()

beforeEach(() => {
  console.log = jest.fn()
  console.error = jest.fn()

  childProcess = runProcess("foo", [], path.resolve(__dirname), callback)
})

test("logs output from stdout", done => {
  childProcess.on("close", () => {
    expect(console.log.mock.calls[0][0]).toBe("✅")

    done()
  })

  childProcess.success()
})

test("logs output from stderr", done => {
  childProcess.on("close", () => {
    expect(console.error.mock.calls[0][0]).toBe("❌")

    done()
  })

  childProcess.success()
})

test("calls callback after close", done => {
  childProcess.on("close", () => {
    expect(callback).toHaveBeenCalled()

    done()
  })

  childProcess.success()
})

test("logs errors", done => {
  childProcess.on("error", () => {
    expect(console.error.mock.calls[0][0]).toBe("🛑")

    done()
  })

  childProcess.fail()
})

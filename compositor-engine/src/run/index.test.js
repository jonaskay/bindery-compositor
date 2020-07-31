const path = require("path")
const childProcess = require("child_process")

const run = require(".")

jest.mock("child_process")

beforeEach(() => {
  console.log = jest.fn()
  console.error = jest.fn()
})

test("logs output from stdout and stderr", done => {
  run("foo", [], path.resolve(__dirname)).then(() => {
    expect(console.log.mock.calls[0][0]).toBe("✅")
    expect(console.error.mock.calls[0][0]).toBe("❌")

    done()
  })

  childProcess.fake.success()
})

test("fails on errors", done => {
  run("foo", [], path.resolve(__dirname)).catch(err => {
    expect(err).toBe("🛑")

    done()
  })

  childProcess.fake.fail()
})

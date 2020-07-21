const buildSite = require("./build-site")

jest.mock("child_process")

const callback = jest.fn()
let build

beforeEach(() => {
  console.log = jest.fn()
  console.error = jest.fn()

  build = buildSite(callback)
})

test("logs output from stdout", done => {
  build.on("close", () => {
    expect(console.log.mock.calls[0][0]).toBe("✅")

    done()
  })

  build.success()
})

test("logs output from stderr", done => {
  build.on("close", () => {
    expect(console.error.mock.calls[0][0]).toBe("❌")

    done()
  })

  build.success()
})

test("calls callback after close", done => {
  build.on("close", () => {
    expect(callback).toHaveBeenCalled()

    done()
  })

  build.success()
})

test("logs errors", done => {
  build.on("error", () => {
    expect(console.error.mock.calls[0][0]).toBe("🛑")

    done()
  })

  build.fail()
})

const { parse } = require(".")

test("returns the prefix and publication id when hostname is valid", () => {
  expect(parse("foo-bar-baz")).toEqual({
    prefix: "foo",
    publicationId: "bar-baz",
  })
})

test("throws an error when hostname is invalid", () => {
  expect(() => parse("foo")).toThrow()
})

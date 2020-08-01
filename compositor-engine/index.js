const PUBLISH = "publish"
const UNPUBLISH = "unpublish"

if (process.argv.length === 2) {
  console.error("Expected at least one argument")
  process.exit(1)
}

switch (process.argv[2]) {
  case PUBLISH:
    require("./src/publish")()
    break
  case UNPUBLISH:
    require("./src/unpublish")()
    break
  default:
    console.error(`Expected ${PUBLISH} or ${UNPUBLISH} as argument`)
    process.exit(1)
}

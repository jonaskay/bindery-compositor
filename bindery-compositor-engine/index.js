const DEBUG = "debug"
const PUBLISH = "publish"

if (process.argv.length === 2) {
  console.error("Expected at least one argument")
  process.exit(1)
}

switch (process.argv[2]) {
  case DEBUG:
    console.log("Running in debug mode")
    break
  case PUBLISH:
    require("./src/publish")()
    break
  default:
    console.error(`Unknown argument "${process.argv[2]}"`)
    process.exit(1)
}

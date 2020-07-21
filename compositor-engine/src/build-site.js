const { spawn } = require("child_process")

const buildSite = callback => {
  const build = spawn("yarn", [
    "workspace",
    "compositor-template",
    "build",
    "--prefix-paths",
  ])

  build.stdout.setEncoding("utf8")
  build.stdout.on("data", data => console.log(data))

  build.stderr.setEncoding("utf8")
  build.stderr.on("data", data => console.error(data))

  build.on("error", err => console.error(err))

  build.on("close", callback)

  return build
}

module.exports = buildSite

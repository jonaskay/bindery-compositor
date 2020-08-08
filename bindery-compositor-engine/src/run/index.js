const { spawn } = require("child_process")

module.exports = (cmd, args, cwd = __dirname) => {
  const childProcess = spawn(cmd, args, { cwd })

  childProcess.stdout.setEncoding("utf8")
  childProcess.stdout.on("data", data => console.log(data))

  childProcess.stderr.setEncoding("utf8")
  childProcess.stderr.on("data", data => console.error(data))

  return new Promise((resolve, reject) => {
    childProcess.on("close", resolve)
    childProcess.on("error", reject)
  })
}

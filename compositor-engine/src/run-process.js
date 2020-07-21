const { spawn } = require("child_process")

const runProcess = (command, args, cwd, callback) => {
  const childProcess = spawn(command, args, { cwd })

  childProcess.stdout.setEncoding("utf8")
  childProcess.stdout.on("data", data => console.log(data))

  childProcess.stderr.setEncoding("utf8")
  childProcess.stderr.on("data", data => console.error(data))

  childProcess.on("error", err => console.error(err))

  childProcess.on("close", callback)

  return childProcess
}

module.exports = runProcess

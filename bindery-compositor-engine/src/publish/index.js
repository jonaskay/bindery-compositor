const path = require("path")
const axios = require("axios")

const createConfig = require("./config").create
const parseHostname = require("../hostname").parse
const run = require("../run")
const { success, error } = require("../pubsub")
const cleanup = require("../cleanup")

const templateDir = path.resolve(
  __dirname,
  "..",
  "..",
  "..",
  "bindery-compositor-template"
)

const runCopyProcess = (bucket, name) => {
  return run("gsutil", [
    "-m",
    "cp",
    "-r",
    path.resolve(templateDir, "public"),
    `gs://${bucket}/${name}`,
  ])
}

const runBuildProcess = () => {
  return run(
    "yarn",
    ["workspace", "bindery-compositor-template", "build", "--prefix-paths"],
    path.resolve(__dirname)
  )
}

const fetchPublicationData = projectId => {
  return axios
    .get(`/projects/${projectId}`, {
      baseURL: process.env.CONTENT_API_URL,
    })
    .then(res => ({
      name: res.data.data.attributes.name,
      title: res.data.data.attributes.title,
    }))
}

module.exports = (
  zone = process.env.COMPUTE_ZONE,
  instance = process.env.HOSTNAME,
  bucket = process.env.CLOUD_STORAGE_BUCKET,
  topic = process.env.PUBSUB_TOPIC
) => {
  const { projectId } = parseHostname(instance)

  const handleError = err => {
    console.error(err)

    error({ id: projectId }, err, topic)
      .then(() => {
        cleanup(zone, instance)
      })
      .catch(err => {
        console.error(err)

        cleanup(zone, instance)
      })
  }

  fetchPublicationData(projectId)
    .then(data => {
      const projectName = data.name
      const projectTitle = data.title

      return createConfig(templateDir, projectName, projectTitle)
        .then(() => runBuildProcess())
        .then(() => runCopyProcess(bucket, projectName))
        .then(() => success({ id: projectId }, topic))
        .then(() => cleanup(zone, instance))
        .catch(err => {
          handleError(err)
        })
    })
    .catch(err => {
      handleError(err)
    })
}

const path = require("path")
const axios = require("axios")

const createConfig = require("./config").create
const createBucket = require("./bucket").create
const parseHostname = require("../hostname").parse
const run = require("../run")
const { success } = require("../pubsub")
const cleanup = require("../cleanup")

const PUBLISH = "publish"

const templateDir = path.resolve(
  __dirname,
  "..",
  "..",
  "..",
  "compositor-template"
)

const runCopyFilesProcess = publicationId => {
  return run("gsutil", [
    "-m",
    "cp",
    "-r",
    path.resolve(templateDir, "public", "**"),
    `gs://${publicationId}`,
  ])
}

const runAddPathMatcherProcess = (
  publicationId,
  publicationName,
  backendBucket,
  host
) => {
  const forwardingRule = `forward-${publicationId}`

  return run("gcloud", [
    "compute",
    "url-maps",
    "add-path-matcher",
    "published",
    `--path-matcher-name=${forwardingRule}`,
    `--default-backend-bucket=${backendBucket}`,
    `--backend-bucket-path-rules=/${publicationName}/=${backendBucket}`,
    `--existing-host=${host}`,
  ])
}

const runCreateBackendBucketProcess = (publicationId, backendBucket) => {
  return run("gcloud", [
    "compute",
    "backend-buckets",
    "create",
    backendBucket,
    `--gcs-bucket-name=${publicationId}`,
  ])
}

const runBuildProcess = () => {
  return run(
    "yarn",
    ["workspace", "compositor-template", "build", "--prefix-paths"],
    path.resolve(__dirname)
  )
}

const fetchPublicationData = publicationId => {
  return axios
    .get(`/publications/${publicationId}`, {
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
  host = process.env.LOAD_BALANCER_HOST
) => {
  const { publicationId } = parseHostname(instance)
  const backendBucket = `published-${publicationId}`

  fetchPublicationData(publicationId).then(data => {
    const publicationName = data.name
    const publicationTitle = data.title

    return createConfig(templateDir, publicationName, publicationTitle)
      .then(() => runBuildProcess())
      .then(() => createBucket(publicationId))
      .then(() => runCreateBackendBucketProcess(publicationId, backendBucket))
      .then(() =>
        runAddPathMatcherProcess(
          publicationId,
          publicationName,
          backendBucket,
          host
        )
      )
      .then(() => runCopyFilesProcess(publicationId))
      .then(() => success(publicationId, PUBLISH))
      .then(() => cleanup(zone, instance))
      .catch(err => {
        console.error(err)

        cleanup(zone, instance)
      })
  })
}

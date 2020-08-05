const path = require("path")

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

const runAddPathMatcherProcess = (publicationId, backendBucket) => {
  const forwardingRule = `forward-${publicationId}`

  return run("gcloud", [
    "compute",
    "url-maps",
    "add-path-matcher",
    "published",
    `--path-matcher-name=${forwardingRule}`,
    `--default-backend-bucket=${backendBucket}`,
    `--backend-bucket-path-rules=/${publicationId}/=${backendBucket}`,
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

module.exports = (
  zone = process.env.COMPUTE_ZONE,
  instance = process.env.HOSTNAME
) => {
  const { publicationId } = parseHostname(instance)
  const backendBucket = `published-${publicationId}`

  createConfig(templateDir, publicationId)
    .then(() => runBuildProcess())
    .then(() => createBucket(publicationId))
    .then(() => runCreateBackendBucketProcess(publicationId, backendBucket))
    .then(() => runAddPathMatcherProcess(publicationId, backendBucket))
    .then(() => runCopyFilesProcess(publicationId))
    .then(() => success(publicationId, PUBLISH))
    .then(() => cleanup(zone, instance))
    .catch(err => {
      console.error(err)

      cleanup(zone, instance)
    })
}

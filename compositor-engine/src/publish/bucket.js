const { Storage } = require("@google-cloud/storage")

module.exports = {
  create: (publicationId, storage = new Storage()) => {
    const bucket = storage.bucket(publicationId)

    return bucket.create().then(() => bucket.makePublic({ includeFiles: true }))
  },
}

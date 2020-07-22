const http = require("http")
const https = require("https")

const fetchAccessToken = () => {
  return new Promise((resolve, reject) => {
    const req = http.get(
      {
        hostname: "metadata.google.internal",
        path: "/computeMetadata/v1/instance/service-accounts/default/token",
        headers: { "Metadata-Flavor": "Google" },
      },
      res => {
        let body = ""

        res.on("data", chunk => (body += chunk))

        res.on("end", () => {
          let accessToken
          try {
            accessToken = JSON.parse(body)["access_token"]
          } catch (err) {
            reject(err)
          }

          resolve(accessToken)
        })
      }
    )

    req.on("error", err => reject(err))
  })
}

const deleteInstance = (projectId, computeZone, instance) => {
  return new Promise((resolve, reject) => {
    fetchAccessToken()
      .then(accessToken => {
        const req = https.request(
          {
            hostname: "www.googleapis.com",
            path: `/compute/v1/projects/${projectId}/zones/${computeZone}/instances/${instance}`,
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
          res => resolve(res)
        )

        req.on("error", err => reject(err))

        req.end()
      })
      .catch(err => reject(err))
  })
}

module.exports = deleteInstance

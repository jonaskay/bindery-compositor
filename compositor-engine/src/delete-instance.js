const http = require("http")
const https = require("https")

const fetchAccessToken = callback => {
  http.get(
    {
      hostname: "metadata.google.internal",
      path: "/computeMetadata/v1/instance/service-accounts/default/token",
      headers: { "Metadata-Flavor": "Google" },
    },
    res => {
      let body = ""

      res.on("data", chunk => (body += chunk))
      res.on("end", () => callback(JSON.parse(body)["access_token"]))
    }
  )
}

const deleteInstance = (projectId, computeZone, instance) => {
  fetchAccessToken(accessToken => {
    https
      .request({
        hostname: "www.googleapis.com",
        path: `/compute/v1/projects/${projectId}/zones/${computeZone}/instances/${instance}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .end()
  })
}

module.exports = deleteInstance

const axios = require("axios")
const Compute = require("@google-cloud/compute")

const fetchAccessToken = () => {
  return axios
    .get("/instance/service-accounts/default/token", {
      baseURL: "http://metadata.google.internal/computeMetadata/v1",
      headers: {
        "Metadata-Flavor": "Google",
      },
    })
    .then(res => res.data["access_token"])
}

const deleteInstance = (projectId, zoneName, instanceName) => {
  const compute = new Compute()
  const zone = compute.zone(zoneName)
  const instance = zone.vm(instanceName)

  return instance.delete()
}

module.exports = deleteInstance

const axios = require("axios")

const fetchAccessToken = () => {
  return axios
    .get("/instance/service-accounts/default/token", {
      baseURL: "http://metadata.google.internal/computeMetadata/v1",
    })
    .then(res => res["access_token"])
    .catch(err => err)
}

const deleteInstance = (projectId, computeZone, instance) => {
  return fetchAccessToken().then(accessToken => {
    return axios.delete(
      `/projects/${projectId}/zones/${computeZone}/instances/${instance}`,
      {
        baseURL: "https://www.googleapis.com/compute/v1",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
  })
}

module.exports = deleteInstance

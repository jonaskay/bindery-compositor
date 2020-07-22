const Compute = require("@google-cloud/compute")

const deleteInstance = (zoneName, instanceName) => {
  const compute = new Compute()
  const zone = compute.zone(zoneName)
  const instance = zone.vm(instanceName)

  return instance.delete()
}

module.exports = deleteInstance

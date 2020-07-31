const Compute = require("@google-cloud/compute")

module.exports = (zoneName, instanceName) => {
  const compute = new Compute()
  const zone = compute.zone(zoneName)
  const instance = zone.vm(instanceName)

  return instance.delete()
}

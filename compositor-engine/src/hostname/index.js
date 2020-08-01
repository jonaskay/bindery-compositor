module.exports = {
  parse: hostname => {
    const re = /(?<prefix>[^\s-]+)-(?<publicationId>\S+)/
    const found = hostname.match(re)

    if (found === null) {
      throw "Invalid hostname"
    }

    return found.groups
  },
}

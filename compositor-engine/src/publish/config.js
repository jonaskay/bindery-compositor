const axios = require("axios")
const path = require("path")
const fs = require("fs").promises

const GATSBY_CONFIG = "gatsby-config.js"

const configData = (publicationName, publicationTitle) => `module.exports = {
  pathPrefix: "/${publicationName}",
  siteMetadata: {
    title: "${publicationTitle}",
    description: "Lorem ipsum",
    author: "@gatsbyjs",
  },
  plugins: [
    "gatsby-plugin-react-helmet",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: \`\${__dirname}/src/images\`,
      },
    },
    "gatsby-transformer-sharp",
    "gatsby-plugin-sharp",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "gatsby-starter-default",
        short_name: "starter",
        start_url: "/",
        background_color: "#663399",
        theme_color: "#663399",
        display: "minimal-ui",
        icon: "src/images/gatsby-icon.png",
      },
    },
  ],
}`

const fetchTitle = publicationId => {
  return axios
    .get(`/publications/${publicationId}`, {
      baseURL: process.env.CONTENT_API_URL,
    })
    .then(res => res.data.data.attributes.title)
}

module.exports = {
  create: (destinationDir, publicationId, publicationName) => {
    const filename = path.resolve(destinationDir, GATSBY_CONFIG)

    return fetchTitle(publicationId)
      .then(publicationTitle => {
        const data = configData(publicationName, publicationTitle)

        return fs.writeFile(filename, data)
      })
      .then(() => filename)
  },
}

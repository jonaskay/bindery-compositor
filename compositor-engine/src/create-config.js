const axios = require("axios")
const path = require("path")
const fs = require("fs").promises

const configData = (storageBucket, siteId, siteTitle) => `module.exports = {
  pathPrefix: "/${storageBucket}/${siteId}",
  siteMetadata: {
    title: "${siteTitle}",
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

const fetchTitle = siteId => {
  return axios
    .get(`/publications/${siteId}`, {
      baseURL: process.env.CONTENT_API_URL,
    })
    .then(res => res.data.data.attributes.title)
}

const createConfig = (destinationDir, storageBucket, siteId) => {
  const filename = path.resolve(destinationDir, "gatsby-config.js")

  return fetchTitle(siteId)
    .then(siteTitle => {
      const data = configData(storageBucket, siteId, siteTitle)

      return fs.writeFile(filename, data)
    })
    .then(() => filename)
}

module.exports = createConfig

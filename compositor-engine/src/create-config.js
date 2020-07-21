const fs = require("fs")
const path = require("path")

const config = (storageBucket, siteId) => `module.exports = {
  pathPrefix: "/${storageBucket}/${siteId}",
  siteMetadata: {
    title: "${siteId}",
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

const createConfig = (destinationDir, storageBucket, siteId, callback) => {
  fs.writeFile(
    path.resolve(destinationDir, "gatsby-config.js"),
    config(storageBucket, siteId),
    callback
  )
}

module.exports = createConfig

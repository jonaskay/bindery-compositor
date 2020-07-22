const fs = require("fs").promises
const path = require("path")

const configData = (storageBucket, siteId) => `module.exports = {
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

const createConfig = async (destinationDir, storageBucket, siteId) => {
  const filename = path.resolve(destinationDir, "gatsby-config.js")
  const data = configData(storageBucket, siteId)

  await fs.writeFile(filename, data)

  return filename
}

module.exports = createConfig

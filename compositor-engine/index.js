const path = require("path")
const fs = require("fs")
const { spawn, exec } = require("child_process")
const http = require("http")
const https = require("https")

const bucket = process.env.GOOGLE_STORAGE_BUCKET
const siteName = process.env.HOSTNAME

const content = `module.exports = {
  pathPrefix: "/${bucket}/${siteName}",
  siteMetadata: {
    title: "${siteName}",
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

fs.writeFile(
  path.resolve(__dirname, "..", "compositor-template", "gatsby-config.js"),
  content,
  err => {
    if (err) return console.error(err)

    console.log("Finished writing gatsby-config.js")
  }
)

const build = spawn("yarn", [
  "workspace",
  "compositor-template",
  "build",
  "--prefix-paths",
])

build.stdout.setEncoding("utf8")
build.stdout.on("data", data => console.log(data))

build.stderr.setEncoding("utf8")
build.stderr.on("data", data => console.error(data))

build.on("close", code => {
  console.log(`Build process exited with code ${code}`)

  exec("bin/copy", { cwd: path.resolve(__dirname) }, (err, stdout, stderr) => {
    if (err) return console.error(err)

    console.log(stdout)
    console.error(stderr)

    http.get(
      {
        hostname: "metadata.google.internal",
        path: "/computeMetadata/v1/instance/service-accounts/default/token",
        headers: {
          "Metadata-Flavor": "Google",
        },
      },
      res => {
        let body = ""

        res.on("data", chunk => (body += chunk))

        res.on("end", () => {
          const accessToken = JSON.parse(body)["access_token"]

          const req = https.request(
            {
              hostname: "www.googleapis.com",
              path: `/compute/v1/projects/${process.env.CLOUD_PROJECT_ID}/zones/${process.env.COMPUTE_ENGINE_ZONE}/instances/${process.env.HOSTNAME}`,
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
            res => {
              let body = ""

              res.on("data", chunk => (body += chunk))
            }
          )

          req.on("error", err => console.error(err))

          req.end()
        })
      }
    )
  })
})

build.on("error", err => console.error(err))

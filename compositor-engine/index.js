const path = require("path")
const { exec } = require("child_process")
const http = require("http")
const https = require("https")

const createConfig = require("./src/create-config")
const buildSite = require("./src/build-site")

createConfig(
  path.resolve(__dirname, "..", "compositor-template"),
  process.env.GOOGLE_STORAGE_BUCKET,
  process.env.HOSTNAME,
  err => {
    if (err) return console.error(err)

    buildSite(code => {
      exec(
        "bin/copy",
        { cwd: path.resolve(__dirname) },
        (err, stdout, stderr) => {
          if (err) return console.error(err)

          console.log(stdout)
          console.error(stderr)

          http.get(
            {
              hostname: "metadata.google.internal",
              path:
                "/computeMetadata/v1/instance/service-accounts/default/token",
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
        }
      )
    })
  }
)

const request = jest.fn()
request.mockReturnValue({ end: jest.fn() })

const https = jest.genMockFromModule("https")
https.request = request

module.exports = https

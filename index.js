const express = require("express")
const env = require("dotenv").config()
const axios = require("axios")
const app = express()
let port = process.env.PORT || 8000
let KEY = process.env.haveibeenpwned_key

app.get("/", (req, res) => {
  res.send(
    'Welcome to this humble API. You will find a "/breach/:account" endpoint, where the account is either a phone number in international format, or an email address. Please keep in mind that the value should be url encoded, and its a get request. Thank you.'
  )
})

app.get("/breach/:account", (req, res) => {
  const account = encodeURIComponent(req.params.account)
  const headers = { "hibp-api-key": KEY }
  const url = `https://haveibeenpwned.com/api/v3/breachedaccount/${account}`
  axios({
    method: "GET",
    url: url,
    headers: headers,
  })
    .then((response) => {
      const dataResponse = response.data
      const breachesArray = dataResponse.map((obj) => {
        return obj.Name
      })
      const breachesExtent = breachesArray.length
      if (breachesExtent < 1) {
        res.send({
          message:
            "Awesome! Your account has not been involved on any data breach that we know of ;)",
          breachesNames: [],
        })
        return
      } else if (breachesExtent === 1) {
        res.send({
          message: "Your account has been involved in 1 (one) data breach",
          breachesNames: breachesArray,
        })
      } else {
        res.send({
          message: `Your account has been involved in ${breachesExtent} breaches`,
          breachesNames: breachesArray,
        })
      }
    })
    .catch((error) => {
      res.status(400)
      res.send(
        "There has been an error processing your request. Please verify your request"
      )
      console.log(account, error)
    })
})

app.listen(port, () => {
  console.log(`data breach API is listening on port ${port}`)
})

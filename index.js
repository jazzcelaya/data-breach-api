const express = require('express');
const env = require('dotenv').config();
const axios = require('axios');
const app = express();
let port = process.env.PORT || 8000;
let KEY = process.env.haveibeenpwned_key;

app.get("/", (req, res ) =>{
    res.send('Hello World! :)')
})

app.get("/breach/:account", (req, res) => {
    const account = encodeURIComponent(req.params.account)
    const headers = {"hibp-api-key": KEY }
    const url = `https://haveibeenpwned.com/api/v3/breachedaccount/${account}`

    axios({
        method: 'GET',
        url: url,
        headers: headers
    }).then(response =>{
        const breachesArray = response.data
        const breachesExtent = breachesArray.length
        if(breachesExtent < 1){ 
            res.send(
                'Awesome! Your account has not been involved on any data breach that we know of ;)'
                )
            return
        } else if(breachesExtent === 1){ 
            res.send('Your account has been involved in 1 (one) data breach')
        } else{
        res.send(`Your account has been involved in ${breachesExtent} breaches`)
        }
    })
    .catch(error =>{
        res.status(400)
        res.send('There has been an error processing your request. Please verify your request')
        console.log(account, error)
    })
    
})

app.listen(port, () => {
    console.log(`data breach api is listening on port ${port}`)
})
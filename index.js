const express = require("express");
const app = express();
let port = process.env.PORT || 8000;

app.get("/", (req, res ) =>{
    res.send("Hello World! :)")
})

app.get("/breach", (req, res) => {
    res.send("This endpoint will be where the good stuff happens")
})

app.listen(port, () => {
    console.log(`data breach api is listening on port ${port}`)
})
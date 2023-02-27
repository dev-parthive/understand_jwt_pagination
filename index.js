const express = require("express")

require('colors')
require('dotenv').config()

const app = express()
const port = process.env.PORT ;
app.listen(port)

app.get('/test', (req, res) =>{
    res.send("server is running on port", port)
})
console.log(port.yellow)
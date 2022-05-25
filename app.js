require('dotenv').config()
const path = require('path');
const express = require('express')
const cors = require('cors')
const dataHandlingRoute = require('./api/routes/dataHandling')

const app = express()

app.use(express.urlencoded({ extended: true}))
app.use(express.json())

app.use(cors())
app.use(express.static(path.join(__dirname, 'public')));

app.use('/data', dataHandlingRoute)

app.get('/',(req,res)=>{
    res.sendFile('/public/index.html', {root: __dirname });
})

app.listen(3000, ()=>{
    console.log("listening on port 3000")
})
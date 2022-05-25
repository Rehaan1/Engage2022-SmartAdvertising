require('dotenv').config()
const path = require('path');
const express = require('express')
const cors = require('cors')

const app = express()

app.use(express.urlencoded({ extended: true}))
app.use(express.json())

app.use(cors())
app.use(express.static(path.join(__dirname, 'public')));

app.get('/',(req,res)=>{
    res.sendFile('/public/index.html', {root: __dirname });
})

app.post('/test',(req,res)=>{
    
    console.log(req.body)
    console.log(req.body.title)
    console.log(req.body.body)
    
    res.json({
        "message":"testing",
        "status":"200"
    })
})

app.listen(3000, ()=>{
    console.log("listening on port 3000")
})
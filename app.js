require('dotenv').config()
const path = require('path')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const dataHandlingRoute = require('./api/routes/dataHandling')

const app = express()

const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))

mongoose.connect(process.env.MONGODB_DB_URI, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    console.log('Connected to MongoDb Atlas')
  })
  .catch(err => {
    console.log('Error:' + err)
  })

app.use('/data', dataHandlingRoute)

app.get('/', (req, res) => {
  res.sendFile('/public/index.html', { root: __dirname })
})

app.listen(port, () => {
  console.log('listening on port 3000')
})

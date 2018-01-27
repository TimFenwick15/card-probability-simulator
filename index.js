'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(express.static('./src'))
app.use(bodyParser.json())
app.listen(8080, () => console.log('Listening on port 8080'))
const deck = require('./deck')

app.post('/simulate', (req, res) => {
  const d = new deck.Deck(req.body)
  res.end(d.simulate().result().toString())
})

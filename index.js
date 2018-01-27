'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(express.static('./src'))
app.use(bodyParser.json())

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on ${port}`));

const deck = require('./deck')

app.post('/simulate', (req, res) => {
  const d = new deck.Deck(req.body)
  res.end(d.simulate().result().toString())
})

'use strict'

const botCore = require('pinyin-bot-core')
const line = require('@line/bot-sdk')
const express = require('express')
const http = require('http')
const ip = require('ip')
const config = require('./config.json')

const client = new line.Client(config)

const handleEvent = async event => {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return null
  }

  return botCore.processMessage(event.message.text)
  .then(res => {
    client.replyMessage(event.replyToken, { type: 'text', text: res })
  })
}

const app = express()

app.get('/', (req, res) => {
  res.send('<a href="https://line.me/R/ti/p/5wyw_KMB3s">Add Pinyin Bot on LINE</a>')
})

app.post('/', line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
  .then(result => res.json(result))
  .catch(err => res.send(err))
})

const port = Number(process.env.PORT || 8080)
http.createServer(app).listen(port, ip.address(), err => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server running on http://${ip.address()}:${port}`)
})

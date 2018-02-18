'use strict'

const express = require('express')
const line = require('@line/bot-sdk')
const botCore = require('pinyin-bot-core')

const config = {
  channelAccessToken: 'TOKEN',
  channelSecret: 'SECRET'
}

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
  res.redirect(301, 'https://line.me/R/ti/p/5wyw_KMB3s')
})

app.post('/', line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
  .then(result => res.json(result))
  .catch(err => res.send(err))
})

app.listen(4444)


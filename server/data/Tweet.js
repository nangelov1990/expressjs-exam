'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const autoIncrement = require('mongoose-auto-increment')

const User = mongoose.model('User')

const requiredValidationMessage = '{PATH} is required'

const generateMessage = require('../utils/generateRandomText')

let tweetSchema = new Schema({
  message: { type: String, require: requiredValidationMessage },
  author: { type: Number, ref: 'User', require: requiredValidationMessage },
  tags: [{ type: String }],
  handles: [{ type: String, ref: 'User' }],
  likes: [{ type: String, ref: 'User' }],
  views: { type: Number, default: 0 }
}, { timestamps: true })

tweetSchema.pre('save', function (next) {
  if (this.isNew) {
    let tags = this.message.match(/#\w+/gi)
    if (tags) {
      tags.forEach(tag => {
        tag = tag.replace('#', '')
        this.tags.push(tag)
      })
    }

    let usernames = this.message.match(/@\w+/gi)
    if (usernames) {
      usernames.forEach(username => {
        username = username.replace('@', '')
        this.handles.push(username)
      })
    }

    next()
  }
})

let autoPopulateLead = function (next) {
  this.populate('author')
  next()
}
tweetSchema.pre('findOne', autoPopulateLead)
tweetSchema.pre('find', autoPopulateLead)

tweetSchema.path('message').validate(message => {
  return message && message.length <= 140
}, 'Message must not be more than 140 characters')

tweetSchema.plugin(autoIncrement.plugin, 'Tweet')

let Tweet = mongoose.model('Tweet', tweetSchema)

module.exports = {
  seedTweets
}

function seedTweets (numOfTweets, numOfUsers) {
  Tweet
    .find({})
    .catch(err => { console.error(err) })
    .then(tweets => {
      if (tweets.length > 0) return
      for (let i = 0; i < numOfTweets; i++) {
        let user = generateRandomUser(numOfUsers)
        let numOfAdditions = i % 3
        Tweet
          .create({
            message: generateRandomContent(numOfAdditions, numOfUsers),
            author: user
          }).catch(err => { console.error(err) })
          .then(tweet => {
            User
              .findOneAndUpdate(
                { _id: user },
                { $push: { tweets: tweet._id } }
              ).catch(err => { console.error(err) })
          })
      }
    })
}

function generateRandomUser (numOfUsers) {
  // get random number in between x & y -> Math.floor(Math.random() * ((y-x)+1) + x)
  return Math.floor(Math.random() * ((numOfUsers - 1) + 1) + 1)
}

function generateRandomUsername (numOfUsers) {
  // get random number in between x & y -> Math.floor(Math.random() * ((y-x)+1) + x)
  return 'user' + Math.floor(Math.random() * ((numOfUsers - 1) + 1) + 1)
}

function generateRandomHandle (numOfUsers) {
  return '@' + generateRandomUsername(numOfUsers)
}

function generateRandomTag () {
  return '#' + generateMessage('word')
}

function generateRandomContent (numOfAdditions, numOfUsers) {
  let message = generateMessage()
  for (let i = 0; i < numOfAdditions; i++) {
    let tag = generateRandomTag()
    let handle = generateRandomHandle(numOfUsers)
    message = [message, tag, handle].join(' ')
  }
  return message
}

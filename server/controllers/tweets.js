'use strict'
const Tweet = require('mongoose').model('Tweet')
const User = require('mongoose').model('User')

module.exports = {
  tag: (req, res, next) => {
    let tagName = req.params.tagName
    let heading = `#${tagName}`
    if (tagName) {
      Tweet
        .find({ tags: tagName })
        .sort({ createdAt: -1 })
        .limit(100)
        .catch(err => console.error(err))
        .then(tweets => {
          if (tweets.length > 0) {
            res.render('tweets/list', { heading, tweets })
          } else {
            let globalError = 'No tweets yet'
            res.render('tweets/list', { heading, globalError })
          }
        })
    } else {
      next()
    }
  },
  add: (req, res) => {
    let heading = 'Add tweet'
    res.render('tweets/add', { heading })
  },
  create: (req, res) => {
    let heading = 'Add tweet'
    let tweet = req.body
    tweet.author = req.user._id
    if (tweet.message === '') {
      let globalError = 'Please enter your tweet'
      res.render('tweets/add', { heading, globalError, tweet })
    } else {
        Tweet
          .create(tweet)
          .catch(err => console.error(err))
          .then(tweet => {
            if (!tweet) {
              let globalError = 'ValidationError: Message must not be more than 140 characters'
              res.render('tweets/add', { heading, globalError })
            } else {
              res.redirect('/')
            }
          })
    }
  },
  edit: (req, res) => {
    let heading = 'Edit tweet'
    let id = req.params.id
    let currentUser = req.user
    Tweet
      .findOne({ _id: id })
      .catch(err => console.error(err))
      .then(tweet => {
        if (currentUser.username === tweet.author ||
          currentUser.roles.includes('Admin')) {
          res.render('tweets/edit', { heading, tweet })
        } else {
          res.redirect('back')
        }
      })
  },
  put: (req, res) => {
    let input = req.body
    let id = req.params.id
    Tweet
      .findOneAndUpdate(
        { _id: id },
        input,
        { new: true }
      ).then(res.redirect('/'))
  },
  delete: (req, res) => {
    let id = req.params.id
    Tweet
      .findOneAndRemove({ _id: id })
      .then(
        User
          .findOneAndUpdate(
            { tweets: id },
            { $pull: { tweets: id } }
          ).catch(err => console.error(err))
          .then(res.redirect('/'))
      )
  },
  like: (req, res) => {
    let tweetId = req.params.id
    let username = req.user.username
    Tweet
      .findOneAndUpdate(
        { _id: tweetId },
        { $push: { likes: username } }
      ).then(res.redirect('back'))
  },
  dislike: (req, res) => {
    let tweetId = req.params.id
    let username = req.user.username
    Tweet
      .findOneAndUpdate(
        { _id: tweetId },
        { $pull: { likes: username } }
      ).then(res.redirect('back'))
  }
}

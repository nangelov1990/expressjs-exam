'use strict'
const User = require('mongoose').model('User')
const Tweet = require('mongoose').model('Tweet')
const encryption = require('../utils/encryption')

module.exports = {
  register: (req, res) => {
    let heading = 'Register'
    let user = req.body || {}
    res.render('users/register', { heading, user })
  },
  create: (req, res) => {
    let heading = 'Register'
    let user = req.body
    let confirmedPassIncorrect =
      user.password !== user.confirmPassword
    if (confirmedPassIncorrect) {
      let globalError = 'Passwords do not match'
      res.render('users/register', { heading, globalError, user })
    } else {
      user.salt = encryption.generateSalt()
      user.hashedPass = encryption.generateHashedPass(user.salt, user.password)

      User
        .create(user)
        .then(user => {
          req.logIn(user, (err, user) => {
            if (err) {
              let globalError = err
              res.render('users/register', { heading, globalError, user })
            } else {
              res.redirect('/')
            }
          })
        })
    }
  },
  login: (req, res) => {
    let heading = 'Log in'
    res.render('users/login', { heading })
  },
  logout: (req, res) => {
    req.logout()
    res.redirect('/')
  },
  authenticate: (req, res) => {
    let heading = 'Log in'
    let inputUser = req.body
    let returnUrl =
      req.header('referer').toString().split('?')[1] ||
      '/'
    User
      .findOne({ username: inputUser.username })
      .then(user => {
        if (user) {
          let correctPassword = false
          if (inputUser.password) {
            correctPassword = user.authenticate(inputUser.password)
          }

          if (!correctPassword) {
            res.render('users/login', { heading, globalError: 'Invalid username or password' })
          } else {
            req.logIn(user, (err, user) => {
              if (err) {
                console.error(err)
                res.status(500)
                res.render('users/login', { heading, globalError: 'Ooops, server error...' })
                return
              }
              res.redirect(returnUrl)
            })
          }
        } else {
          res.render('users/login', { heading, globalError: 'Invalid username or password' })
        }
      })
  },
  display: (req, res, next) => {
    let heading = 'User details'
    let username = req.params.username
    let currentUser = req.user
    User
      .findOne({ username: username })
      .populate(({
        path: 'tweets',
        options: { limit: 100, sort: { 'createdAt': -1 } }
      }))
      .catch(err => console.error(err))
      .then(user => {
        if (user) {
          Tweet
            .find({ handles: user.username })
            .catch(err => console.error(err))
            .then(handleTweets => {
              res.render('users/display', { heading, user, currentUser, handleTweets })
            })
        } else {
          console.log('No such user.')
          next()
        }
      })
  }
}

'use strict'
const home = require('./home')
const users = require('./users')
const tweets = require('./tweets')
const admins = require('./admins')

let notFound = (req, res) => {
  res.status = 404
  res.render('shared/layout', { heading: 'Error', globalError: '404 Not Found' })
}

module.exports = {
  home,
  users,
  tweets,
  admins,
  notFound
}

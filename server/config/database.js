'use strict'
const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')

mongoose.Promise = global.Promise

module.exports = config => {
  mongoose.connect(config.db)
  let db = mongoose.connection
  autoIncrement.initialize(db)

  db.once('open', err => {
    if (err) console.error(err)
    console.log('Mongo running')
  })
  db.on('error', err => console.error(err))

  let numberOfUsers = 20
  let numberOfTweets = 150
  require('../data/User').seedAdminUser()
  require('../data/User').seedUsers(numberOfUsers)
  require('../data/Tweet').seedTweets(numberOfTweets, numberOfUsers)
}

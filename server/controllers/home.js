'use strict'
const Tweet = require('mongoose').model('Tweet')

module.exports = {
  index: (req, res) => {
    Tweet
      .find({})
      .sort({ createdAt: -1 })
      .limit(100)
      .catch(err => console.error(err))
      .then(tweets => {
        // TODO: increase view counter
        res.render('tweets/list', { tweets })
      })
  }
}

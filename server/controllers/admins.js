'use strict'
const User = require('mongoose').model('User')

module.exports = {
  all: (req, res) => {
    User
      .find({ roles: 'Admin' })
      .then(admins => {
        res.render('admins/all', { admins })
      })
  },
  add: (req, res) => {
    User
      .find({ roles: { $ne: 'Admin' } })
      .then(users => {
        res.render('admins/add', { users })
      })
  },
  update: (req, res) => {
    let username = req.params.username
    User
      .findOneAndUpdate(
        { username: username },
        { $push: { roles: 'Admin' } }
      ).then(res.redirect('back'))
  },
  delete: (req, res) => {
    let username = req.params.username
    User
      .findOneAndUpdate(
        { username: username },
        { $pull: { roles: 'Admin' } }
      ).then(res.redirect('back'))
  }
}

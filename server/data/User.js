'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const autoIncrement = require('mongoose-auto-increment')

const encryption = require('../utils/encryption')

const requiredValidationMessage = '{PATH} is required'

const generateName = require('../utils/generateRandomText')

let userSchema = new Schema({
  username: { type: String, required: requiredValidationMessage, unique: true },
  firstName: { type: String, required: requiredValidationMessage },
  lastName: { type: String, required: requiredValidationMessage },
  salt: String,
  hashedPass: String,
  roles: [{ type: String, default: 'User' }],
  tweets: [{ type: Number, ref: 'Tweet' }]
})

userSchema.virtual('fullName').get(function () {
  return [this.firstName, this.lastName].join(' ')
})

userSchema.method({
  authenticate: function (password) {
    let correctPassword =
      encryption.generateHashedPass(this.salt, password) === this.hashedPass
    return correctPassword
  }
})
userSchema.plugin(autoIncrement.plugin, 'User')

let User = mongoose.model('User', userSchema)

module.exports = {
  seedAdminUser,
  seedUsers
}

function seedAdminUser () {
  User
    .find({})
    .catch(err => { console.error(err) })
    .then(users => {
      if (users.length > 0) return
      let salt = encryption.generateSalt()
      let hashedPass = encryption.generateHashedPass(salt, 'admin')
      User
        .create({
          username: 'admin',
          firstName: generateName('word'),
          lastName: generateName('word'),
          salt: salt,
          hashedPass: hashedPass,
          roles: 'Admin',
          tweets: []
        }).catch(err => console.error(err))
    })
}

function seedUsers (numOfUsers) {
  User
    .find({})
    .catch(err => { console.error(err) })
    .then(users => {
      if (users.length > 1) return
      for (let i = 1; i <= numOfUsers; i++) {
        let user = 'user' + i
        let salt = encryption.generateSalt()
        let hashedPass = encryption.generateHashedPass(salt, user)
        User
          .create({
            username: user,
            firstName: generateName('word'),
            lastName: generateName('word'),
            salt: salt,
            hashedPass: hashedPass,
            roles: [],
            tweets: []
          }).catch(err => console.error(err))
      }
    })
}

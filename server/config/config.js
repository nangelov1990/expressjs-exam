'use strict'
const path = require('path')
const rootPath = path.normalize(path.join(__dirname, '/../../'))

module.exports = {
  development: {
    rootPath,
    db: 'mongodb://localhost:27017/twitter-expressjs-exam',
    port: 2993,
    sessionSecret: '@-session-secret#'
  },
  production: {
    rootPath,
    db: 'mongodb://heroku_w68hcj3g:lm2kt5n925bngi2bloicphfcrj@ds031618.mlab.com:31618/heroku_w68hcj3g',
    port: process.env.NODE_ENV,
    sessionSecret: '@-session-secret#'
  }
}

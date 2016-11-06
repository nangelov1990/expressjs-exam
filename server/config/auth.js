'use strict'
module.exports = {
  isAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      next()
    } else {
      let returnUrl = '?' + req.originalUrl
      res.redirect('/users/login' + returnUrl)
    }
  },
  isInRole: (role) => {
    return (req, res, next) => {
      if (req.isAuthenticated() &&
          req.user.roles.indexOf(role) > -1) {
        next()
      } else {
        let returnUrl = '?' + req.originalUrl
        res.redirect('/users/login' + returnUrl)
      }
    }
  },
  isBanned: () => {
    return (req, res, next) => {
      if (req.isAuthenticated() &&
        !req.user.banned) {
        next()
      } else {
        let returnUrl = '?' + req.originalUrl
        res.redirect('/users/login' + returnUrl)
      }
    }
  }
}

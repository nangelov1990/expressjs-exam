'use strict'
const controllers = require('../controllers')
const auth = require('../config/auth')

module.exports = app => {
  app.get('/', controllers.home.index)
  app.get('/tweet', auth.isAuthenticated, controllers.tweets.add)
  app.post('/tweet/create', auth.isAuthenticated, controllers.tweets.create)
  app.get('/tweet/:id/edit', auth.isInRole('Admin'), controllers.tweets.edit)
  app.post('/tweet/:id/put', auth.isInRole('Admin'), controllers.tweets.put)
  app.post('/tweet/:id/delete', auth.isInRole('Admin'), controllers.tweets.delete)
  app.post('/tweet/:id/like', auth.isAuthenticated, controllers.tweets.like)
  app.post('/tweet/:id/dislike', auth.isAuthenticated, controllers.tweets.dislike)

  // TODO: Latest 100 with that tag
  app.get('/tag/:tagName', controllers.tweets.tag)

  app.get('/admins/all', auth.isInRole('Admin'), controllers.admins.all)
  app.get('/admins/add', auth.isInRole('Admin'), controllers.admins.add)
  app.post('/admins/:username/update', auth.isInRole('Admin'), controllers.admins.update)
  app.post('/admins/:username/delete', auth.isInRole('Admin'), controllers.admins.delete)

  // TODO: users functionality
  app.get('/users/register', controllers.users.register)
  app.post('/users/create', controllers.users.create)
  app.get('/users/login', controllers.users.login)
  app.post('/users/authenticate', controllers.users.authenticate)
  app.post('/users/logout', auth.isAuthenticated, controllers.users.logout)
  // TODO: user profile, show user's latest 100 tweets
  app.get('/profile/:username', auth.isAuthenticated, controllers.users.display)

  // TODO: admin functionality
  app.get('/admins/all', auth.isInRole('Admin'))
  app.get('/admins/add', auth.isInRole('Admin'))
  app.post('/admins/create', auth.isInRole('Admin'))

  app.all('*', controllers.notFound)
}

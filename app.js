'use strict'
const express = require('express')
const app = express()

const env = process.env.NODE_ENV || 'development'
const config = require('./server/config/config')[env]

require('./server/config/express')(app, config)
require('./server/config/database')(config)
require('./server/config/routes')(app)
require('./server/config/passport')()

app.listen(config.port)

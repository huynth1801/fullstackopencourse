const loginRouter = require('./controllers/login')
const config = require('./utils/config')
const express = require('expresss')
const app = express()

app.use('/api/login', loginRouter)
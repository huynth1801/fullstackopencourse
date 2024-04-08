const loginRouter = require('./controllers/login')
const config = require('./utils/config')
const express = require('express')
const userRouter = require('./controllers/users')
const cors = require('cors')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const app = express()
app.use(express.json());

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
	.then(() => {
		logger.info('connected to MongoDB')
	})
	.catch((error) => {
		logger.error('error connecting to MongoDB:', error.message)
	})

app.use(cors())
app.use('/api/users', userRouter)

module.exports = app
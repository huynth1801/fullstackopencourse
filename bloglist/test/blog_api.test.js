const mongoose = require('mongoose')
const supertest = require('supertest')
const { test, after, beforeEach, describe } = require('node:test')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

beforeEach(async () => {  
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash("kakakaka", 10)
    const user = new User({
       username: "ssss",
       name: "kkkkk",
       blogs: [],
       passwordHash
    })
  
    await user.save()
}, 100000)


describe('when there is initially one user in db', () => {
  beforeEach(async () => {
      await User.deleteMany({})

      const passwordHash = await bcrypt.hash('sekret', 10)
      const user = new User({ username: 'root', passwordHash })

      await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'miaa',
        name: 'miadhfkjsdhf',
        password: 'moimoi'
      }

      await api
          .post('/api/users')
          .send(newUser)
          .expect(201)
          .expect('Content-Type', /application\/json/)
      
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
      
      const usernames = usersAtEnd.map(u => u.username)
      expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username does not exist', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
        name: 'Ssdsduper',
        password: 'salainen',
    }

    const result = await api 
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/ )

    expect(result.body.error).toContain('password and username must be given')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('creation fails with proper statuscode and message if password does not exist', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
        name: 'Ssdsduper',
        username: 'salainen',
    }

    const result = await api 
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/ )

    expect(result.body.error).toContain('password and username must be given')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
          username: 'root',
          name: 'Super',
          password: 'salainen',
      }

      const result = await api 
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/ )

      expect(result.body.error).toContain('expected `username` to be unique')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('creation fails with proper statuscode and message if username is less than 3 characters', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
        username: 'ro',
        name: 'Sususususu',
        password: 'salainen',
    }

    const result = await api 
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/ )

    expect(result.body.error).toContain('password or username must be at least 3 characters long')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('creation fails with proper statuscode and message if password is less than three characters', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
        username: 'kakakaka',
        name: 'Superkakakak',
        password: 'sa',
    }

    const result = await api 
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/ )

    expect(result.body.error).toContain('password or username must be at least 3 characters long')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

})

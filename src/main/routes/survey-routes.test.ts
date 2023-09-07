import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'
import env from '../config/env'

let surveysCollection: Collection
let accountsCollection: Collection

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveysCollection = await MongoHelper.getCollection('surveys')
    accountsCollection = await MongoHelper.getCollection('accounts')
    await surveysCollection.deleteMany({})
    await accountsCollection.deleteMany({})
  })

  describe('POST /surveys', () => {
    test('Should return 403 if no accessToken is provided', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'Question',
          answers: [
            {
              answer: 'Answer 1',
              image: 'https://image-url.com'
            }, {
              answer: 'Answer 2'
            }
          ]
        })
        .expect(403)
    })

    test('Should return 204 if valid accessToken is provided', async () => {
      const res = await accountsCollection.insertOne({
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password',
        role: 'admin'
      })
      const id = res.ops[0]._id
      const accessToken = sign({ id }, env.jwtSecret)
      await accountsCollection.updateOne(
        { _id: id },
        { $set: { accessToken } }
      )
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'Question',
          answers: [
            {
              answer: 'Answer 1',
              image: 'https://image-url.com'
            }, {
              answer: 'Answer 2'
            }
          ]
        })
        .expect(204)
    })
  })

  describe('GET /surveys', () => {
    test('Should return 403 if no accessToken is provided', async () => {
      await request(app)
        .get('/api/surveys')
        .expect(403)
    })

    test('Should return 200 if valid accessToken is provided with at least one survey', async () => {
      const res = await accountsCollection.insertOne({
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password'
      })
      const id = res.ops[0]._id
      const accessToken = sign({ id }, env.jwtSecret)
      await accountsCollection.updateOne(
        { _id: id },
        { $set: { accessToken } }
      )
      await surveysCollection.insertOne({
        question: 'any_question',
        answers: [
          {
            answer: 'any_answer',
            image: 'any_image'
          }],
        date: new Date()
      })
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })
})

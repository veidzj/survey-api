import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import request from 'supertest'
import app from '@/main/config/app'
import env from '@/main/config/env'
import { MongoHelper } from '@/infra/db'

let surveysCollection: Collection
let accountsCollection: Collection

const mockAccessToken = async (): Promise<string> => {
  const res = await accountsCollection.insertOne({
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password'
  })
  const id = res.insertedId.toHexString()
  const accessToken = sign({ id }, env.jwtSecret)
  await accountsCollection.updateOne(
    { _id: res.insertedId },
    { $set: { accessToken } }
  )
  return accessToken
}

describe('Survey Result Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveysCollection = MongoHelper.getCollection('surveys')
    accountsCollection = MongoHelper.getCollection('accounts')
    await surveysCollection.deleteMany({})
    await accountsCollection.deleteMany({})
  })

  describe('PUT /surveys/:surveyId/results', () => {
    test('Should return 403 if no accessToken is provided', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .send({
          answer: 'any_answer'
        })
        .expect(403)
    })

    test('Should return 200 if valid accessToken and answer is provided', async () => {
      const accessToken = await mockAccessToken()
      const res = await surveysCollection.insertOne({
        question: 'Question',
        answers: [
          {
            answer: 'Answer 1',
            image: 'https://image-url.com'
          }, {
            answer: 'Answer 2'
          }
        ],
        date: new Date()
      })
      await request(app)
        .put(`/api/surveys/${res.insertedId.toHexString()}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'Answer 1'
        })
        .expect(200)
    })
  })

  describe('GET /surveys/:surveyId/results', () => {
    test('Should return 403 if no accessToken is provided', async () => {
      await request(app)
        .get('/api/surveys/any_id/results')
        .expect(403)
    })

    test('Should return 200 if valid accessToken and surveyId is provided', async () => {
      const accessToken = await mockAccessToken()
      const res = await surveysCollection.insertOne({
        question: 'Question',
        answers: [
          {
            answer: 'Answer 1',
            image: 'https://image-url.com'
          }, {
            answer: 'Answer 2'
          }
        ],
        date: new Date()
      })
      await request(app)
        .get(`/api/surveys/${res.insertedId.toHexString()}/results`)
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })
})

import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import request from 'supertest'
import { MongoHelper } from '@/infra/db'
import app from '@/main/config/app'
import env from '@/main/config/env'

let accountsCollection: Collection
let surveysCollection: Collection

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

describe('Survey GraphQL', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountsCollection = MongoHelper.getCollection('accounts')
    surveysCollection = MongoHelper.getCollection('surveys')
    await surveysCollection.deleteMany({})
    await accountsCollection.deleteMany({})
  })

  describe('Surveys Query', () => {
    const query = `
      query {
        surveys {
          id
          question
          answers {
            answer
            image
          }
          date
          didAnswer
        }
      }
    `

    test('Should return surveys on success', async () => {
      const accessToken = await mockAccessToken()
      const currentDate = new Date()
      await surveysCollection.insertOne({
        question: 'Question',
        answers: [
          {
            answer: 'Answer 1',
            image: 'https://image-url.com'
          }, {
            answer: 'Answer 2'
          }
        ],
        date: currentDate
      })
      const res = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .send({ query })
      expect(res.status).toBe(200)
      expect(res.body.data.surveys.length).toBe(1)
      expect(res.body.data.surveys[0].id).toBeTruthy()
      expect(res.body.data.surveys[0].question).toBe('Question')
      expect(res.body.data.surveys[0].date).toBe(currentDate.toISOString())
      expect(res.body.data.surveys[0].answers).toEqual([{
        answer: 'Answer 1',
        image: 'https://image-url.com'
      }, {
        answer: 'Answer 2',
        image: null
      }])
    })

    test('Should return AccessDeniedError if no token is provided', async () => {
      await surveysCollection.insertOne({
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
      const res = await request(app)
        .post('/graphql')
        .send({ query })
      expect(res.status).toBe(403)
      expect(res.body.data).toBeFalsy()
      expect(res.body.errors[0].message).toBe('Access denied')
    })
  })
})

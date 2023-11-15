import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import request from 'supertest'
import { Express } from 'express'
import { MongoHelper } from '@/infra/db'
import { setupApp } from '@/main/config/app'
import env from '@/main/config/env'

let accountsCollection: Collection
let surveysCollection: Collection
let app: Express

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

describe('SurveyResult GraphQL', () => {
  beforeAll(async () => {
    app = await setupApp()
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

  describe('SurveyResult Query', () => {
    test('Should return survey result on success', async () => {
      const accessToken = await mockAccessToken()
      const currentDate = new Date()
      const surveyRes = await surveysCollection.insertOne({
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
      const query = `
        query {
          surveyResult (surveyId: "${surveyRes.insertedId.toHexString()}") {
            question
            answers {
              answer
              count
              percent
              isCurrentAccountAnswer
            }
            date
          }
        }
      `
      const res = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .send({ query })
      expect(res.status).toBe(200)
      expect(res.body.data.surveyResult.question).toBe('Question')
      expect(res.body.data.surveyResult.date).toBe(currentDate.toISOString())
      expect(res.body.data.surveyResult.answers).toEqual([{
        answer: 'Answer 1',
        count: 0,
        percent: 0,
        isCurrentAccountAnswer: false
      }, {
        answer: 'Answer 2',
        count: 0,
        percent: 0,
        isCurrentAccountAnswer: false
      }])
    })

    test('Should return AccessDeniedError if no token is provided', async () => {
      const surveyRes = await surveysCollection.insertOne({
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
      const query = `
        query {
          surveyResult (surveyId: "${surveyRes.insertedId.toHexString()}") {
            question
            answers {
              answer
              count
              percent
              isCurrentAccountAnswer
            }
            date
          }
        }
      `
      const res = await request(app)
        .post('/graphql')
        .send({ query })
      expect(res.status).toBe(403)
      expect(res.body.data).toBeFalsy()
      expect(res.body.errors[0].message).toBe('Access denied')
    })
  })

  describe('SaveSurveyResult Mutation', () => {
    test('Should return survey result on success', async () => {
      const accessToken = await mockAccessToken()
      const currentDate = new Date()
      const surveyRes = await surveysCollection.insertOne({
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
      const query = `
        mutation {
          saveSurveyResult (surveyId: "${surveyRes.insertedId.toHexString()}", answer: "Answer 1") {
            question
            answers {
              answer
              count
              percent
              isCurrentAccountAnswer
            }
            date
          }
        }
      `
      const res = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .send({ query })
      expect(res.status).toBe(200)
      expect(res.body.data.saveSurveyResult.question).toBe('Question')
      expect(res.body.data.saveSurveyResult.date).toBe(currentDate.toISOString())
      expect(res.body.data.saveSurveyResult.answers).toEqual([{
        answer: 'Answer 1',
        count: 1,
        percent: 100,
        isCurrentAccountAnswer: true
      }, {
        answer: 'Answer 2',
        count: 0,
        percent: 0,
        isCurrentAccountAnswer: false
      }])
    })

    test('Should return AccessDeniedError if no token is provided', async () => {
      const surveyRes = await surveysCollection.insertOne({
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
      const query = `
        mutation {
          saveSurveyResult (surveyId: "${surveyRes.insertedId.toHexString()}", answer: "Answer 1") {
            question
            answers {
              answer
              count
              percent
              isCurrentAccountAnswer
            }
            date
          }
        }
      `
      const res = await request(app)
        .post('/graphql')
        .send({ query })
      expect(res.status).toBe(403)
      expect(res.body.data).toBeFalsy()
      expect(res.body.errors[0].message).toBe('Access denied')
    })
  })
})

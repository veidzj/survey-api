import { Collection } from 'mongodb'
import { createTestClient } from 'apollo-server-integration-testing'
import { ApolloServer, gql } from 'apollo-server-express'
import { sign } from 'jsonwebtoken'
import { makeApolloServer } from './helpers'
import { MongoHelper } from '@/infra/db'
import env from '@/main/config/env'

let accountsCollection: Collection
let surveysCollection: Collection
let apolloServer: ApolloServer

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
    apolloServer = makeApolloServer()
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
    const surveysQuery = gql`
      query surveys {
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
      const { query } = createTestClient({
        apolloServer,
        extendMockRequest: {
          headers: {
            'x-access-token': accessToken
          }
        }
      })
      const res: any = await query(surveysQuery, {
        variables: {
          email: 'valid_email@mail.com',
          password: 'valid_password'
        }
      })
      expect(res.data.surveys.length).toBe(1)
      expect(res.data.surveys[0].id).toBeTruthy()
      expect(res.data.surveys[0].question).toBe('Question')
      expect(res.data.surveys[0].date).toBe(currentDate.toISOString())
      expect(res.data.surveys[0].answers).toEqual([{
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
      const { query } = createTestClient({ apolloServer })
      const res: any = await query(surveysQuery, {
        variables: {
          email: 'valid_email@mail.com',
          password: 'valid_password'
        }
      })
      expect(res.data).toBeFalsy()
      expect(res.errors[0].message).toBe('Access denied')
    })
  })
})

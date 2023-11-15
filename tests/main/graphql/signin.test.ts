import { Collection } from 'mongodb'
import { hash } from 'bcrypt'
import request from 'supertest'
import { Express } from 'express'
import { MongoHelper } from '@/infra/db'
import { setupApp } from '@/main/config/app'
import env from '@/main/config/env'

let accountsCollection: Collection
let app: Express

describe('SignIn GraphQL', () => {
  beforeAll(async () => {
    app = await setupApp()
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountsCollection = MongoHelper.getCollection('accounts')
    await accountsCollection.deleteMany({})
  })

  describe('SignIn Query', () => {
    const query = `
      query {
        signIn (email: "valid_email@mail.com", password: "valid_password") {
          name
          accessToken
        }
      }
    `

    test('Should return an account on valid credentials', async () => {
      const password = await hash('valid_password', 12)
      await accountsCollection.insertOne({
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password
      })
      const res = await request(app)
        .post('/graphql')
        .send({ query })
      expect(res.status).toBe(200)
      expect(res.body.data.signIn.accessToken).toBeTruthy()
      expect(res.body.data.signIn.name).toBe('valid_name')
    })

    test('Should return UnauthorizedError on invalid credentials', async () => {
      const res = await request(app)
        .post('/graphql')
        .send({ query })
      expect(res.status).toBe(401)
      expect(res.body.data).toBeFalsy()
      expect(res.body.errors[0].message).toBe('Unauthorized')
    })
  })

  describe('SignUp Mutation', () => {
    const query = `
      mutation {
        signUp (name: "valid_name", email: "valid_email@mail.com", password: "valid_password", passwordConfirmation: "valid_password") {
          name
          accessToken
        }
      }
    `

    test('Should return an account on valid data', async () => {
      const res = await request(app)
        .post('/graphql')
        .send({ query })
      expect(res.status).toBe(200)
      expect(res.body.data.signUp.accessToken).toBeTruthy()
      expect(res.body.data.signUp.name).toBe('valid_name')
    })

    test('Should return EmailInUseError on email in use', async () => {
      const password = await hash('valid_password', 12)
      await accountsCollection.insertOne({
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password
      })
      const res = await request(app)
        .post('/graphql')
        .send({ query })
      expect(res.status).toBe(403)
      expect(res.body.data).toBeFalsy()
      expect(res.body.errors[0].message).toBe('The received email is already in use')
    })
  })
})

import { Collection } from 'mongodb'
import { hash } from 'bcrypt'
import request from 'supertest'
import { Express } from 'express'
import { setupApp } from '@/main/config/app'
import env from '@/main/config/env'
import { MongoHelper } from '@/infra/db'

let accountsCollection: Collection
let app: Express

describe('SignIn Routes', () => {
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

  describe('POST /signup', () => {
    test('Should return 200 on signup success', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'valid_name',
          email: 'valid_email@mail.com',
          password: 'valid_password',
          passwordConfirmation: 'valid_password'
        })
        .expect(200)
    })
  })

  describe('POST /signin', () => {
    test('Should return 200 on signin success', async () => {
      const password = await hash('valid_password', 12)
      await accountsCollection.insertOne({
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password
      })
      await request(app)
        .post('/api/signin')
        .send({
          email: 'valid_email@mail.com',
          password: 'valid_password'
        })
        .expect(200)
    })

    test('Should return 401 on signin unauthorized', async () => {
      await request(app)
        .post('/api/signin')
        .send({
          email: 'valid_email@mail.com',
          password: 'valid_password'
        })
        .expect(401)
    })
  })
})

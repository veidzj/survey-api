import { Collection } from 'mongodb'
import { hash } from 'bcrypt'
import { createTestClient } from 'apollo-server-integration-testing'
import { ApolloServer, gql } from 'apollo-server-express'
import { makeApolloServer } from './helpers'
import { MongoHelper } from '@/infra/db'
import env from '@/main/config/env'

let accountsCollection: Collection
let apolloServer: ApolloServer

describe('SignIn GraphQL', () => {
  beforeAll(async () => {
    apolloServer = makeApolloServer()
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountsCollection = await MongoHelper.getCollection('accounts')
    await accountsCollection.deleteMany({})
  })

  describe('SignIn Query', () => {
    const signInQuery = gql`
      query signIn ($email: String!, $password: String!) {
        signIn (email: $email, password: $password) {
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
      const { query } = createTestClient({ apolloServer })
      const res: any = await query(signInQuery, {
        variables: {
          email: 'valid_email@mail.com',
          password: 'valid_password'
        }
      })
      expect(res.data.signIn.accessToken).toBeTruthy()
      expect(res.data.signIn.name).toBe('valid_name')
    })
  })
})

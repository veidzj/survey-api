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

    test('Should return UnauthorizedError on invalid credentials', async () => {
      const { query } = createTestClient({ apolloServer })
      const res: any = await query(signInQuery, {
        variables: {
          email: 'invalid_email@mail.com',
          password: 'valid_password'
        }
      })
      expect(res.data).toBeFalsy()
      expect(res.errors[0].message).toBe('Unauthorized')
    })
  })

  describe('SignUp Mutation', () => {
    const signUpMutation = gql`
      mutation signUp ($name: String!, $email: String!, $password: String!, $passwordConfirmation: String!) {
        signUp (name: $name, email: $email, password: $password, passwordConfirmation: $passwordConfirmation) {
          name
          accessToken
        }
      }
    `

    test('Should return an account on valid data', async () => {
      const { mutate } = createTestClient({ apolloServer })
      const res: any = await mutate(signUpMutation, {
        variables: {
          name: 'valid_name',
          email: 'valid_email@mail.com',
          password: 'valid_password',
          passwordConfirmation: 'valid_password'
        }
      })
      expect(res.data.signUp.accessToken).toBeTruthy()
      expect(res.data.signUp.name).toBe('valid_name')
    })

    test('Should return EmailInUseError on email in use', async () => {
      const password = await hash('valid_password', 12)
      await accountsCollection.insertOne({
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password
      })
      const { mutate } = createTestClient({ apolloServer })
      const res: any = await mutate(signUpMutation, {
        variables: {
          name: 'valid_name',
          email: 'valid_email@mail.com',
          password: 'valid_password',
          passwordConfirmation: 'valid_password'
        }
      })
      expect(res.data).toBeFalsy()
      expect(res.errors[0].message).toBe('The received email is already in use')
    })
  })
})

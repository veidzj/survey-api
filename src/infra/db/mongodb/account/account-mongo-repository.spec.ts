import faker from 'faker'
import { Collection } from 'mongodb'
import { AccountMongoRepository } from './account-mongo-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { mockAddAccountParams } from '@/domain/test'
import env from '@/main/config/env'

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

let accountsCollection: Collection

describe('AccountMongoRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountsCollection = await MongoHelper.getCollection('accounts')
    await accountsCollection.deleteMany({})
  })

  describe('add()', () => {
    test('Should return an account on success', async () => {
      const sut = makeSut()
      const addAccountParams = mockAddAccountParams()
      const account = await sut.add(addAccountParams)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(addAccountParams.name)
      expect(account.email).toBe(addAccountParams.email)
      expect(account.password).toBe(addAccountParams.password)
    })
  })

  describe('loadByEmail()', () => {
    test('Should return an account on success', async () => {
      const sut = makeSut()
      const addAccountParams = mockAddAccountParams()
      await accountsCollection.insertOne(addAccountParams)
      const account = await sut.loadByEmail(addAccountParams.email)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(addAccountParams.name)
      expect(account.email).toBe(addAccountParams.email)
      expect(account.password).toBe(addAccountParams.password)
    })

    test('Should return null if loadByEmail fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByEmail(faker.internet.email())
      expect(account).toBeFalsy()
    })
  })

  describe('updateAccessToken()', () => {
    test('Should update the account acessToken on success', async () => {
      const sut = makeSut()
      const result = await accountsCollection.insertOne(mockAddAccountParams())
      const fakeAccount = result.ops[0]
      expect(fakeAccount.accessToken).toBeFalsy()
      const accessToken = faker.random.uuid()
      await sut.updateAccessToken(fakeAccount._id, accessToken)
      const account = await accountsCollection.findOne({ _id: fakeAccount._id })
      expect(account).toBeTruthy()
      expect(account.accessToken).toBe(accessToken)
    })
  })

  describe('loadByToken()', () => {
    let name = faker.name.findName()
    let email = faker.internet.email()
    let password = faker.internet.password()
    let accessToken = faker.random.uuid()

    beforeEach(() => {
      name = faker.name.findName()
      email = faker.internet.email()
      password = faker.internet.password()
      accessToken = faker.random.uuid()
    })

    test('Should return an account on success without role', async () => {
      const sut = makeSut()
      await accountsCollection.insertOne({
        name,
        email,
        password,
        accessToken
      })
      const account = await sut.loadByToken(accessToken)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(name)
      expect(account.email).toBe(email)
      expect(account.password).toBe(password)
    })

    test('Should return an account on success with admin role', async () => {
      const sut = makeSut()
      await accountsCollection.insertOne({
        name,
        email,
        password,
        accessToken,
        role: 'admin'
      })
      const account = await sut.loadByToken(accessToken, 'admin')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(name)
      expect(account.email).toBe(email)
      expect(account.password).toBe(password)
    })

    test('Should return null if invalid role is provided', async () => {
      const sut = makeSut()
      await accountsCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        accessToken: 'any_token'
      })
      const account = await sut.loadByToken(accessToken, 'admin')
      expect(account).toBeFalsy()
    })

    test('Should return an account if user is admin', async () => {
      const sut = makeSut()
      await accountsCollection.insertOne({
        name,
        email,
        password,
        accessToken,
        role: 'admin'
      })
      const account = await sut.loadByToken(accessToken)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(name)
      expect(account.email).toBe(email)
      expect(account.password).toBe(password)
    })

    test('Should return null if fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByEmail(accessToken)
      expect(account).toBeFalsy()
    })
  })
})

import { MongoHelper as sut } from './mongo-helper'
import env from '../../../../main/config/env'

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await sut.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await sut.disconnect()
  })

  test('Should reconnect if mongodb is down', async () => {
    let accountsCollection = await sut.getCollection('accounts')
    expect(accountsCollection).toBeTruthy()
    await sut.disconnect()
    accountsCollection = await sut.getCollection('accounts')
    expect(accountsCollection).toBeTruthy()
  })
})

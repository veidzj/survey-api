import faker from 'faker'
import { Collection } from 'mongodb'
import { LogMongoRepository } from './log-mongo-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import env from '@/main/config/env'

const makeSut = (): LogMongoRepository => {
  return new LogMongoRepository()
}

describe('LogMongoRepository', () => {
  let errorsCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    errorsCollection = await MongoHelper.getCollection('errors')
    await errorsCollection.deleteMany({})
  })

  test('Should create an error log on success', async () => {
    const sut = makeSut()
    await sut.logError(faker.random.words())
    const count = await errorsCollection.countDocuments()
    expect(count).toBe(1)
  })
})

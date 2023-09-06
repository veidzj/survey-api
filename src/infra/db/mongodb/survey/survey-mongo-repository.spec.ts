import { Collection } from 'mongodb'
import { SurveyMongoRepository } from './survey-mongo-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import env from '../../../../main/config/env'

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

let surveysCollection: Collection

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveysCollection = await MongoHelper.getCollection('surveys')
    await surveysCollection.deleteMany({})
  })

  describe('add()', () => {
    test('Should add a survey on success', async () => {
      const sut = makeSut()
      await sut.add({
        question: 'any_question',
        answers: [
          {
            answer: 'any_answer',
            image: 'any_image'
          },
          {
            answer: 'other_answer'
          }],
        date: new Date()
      })
      const survey = await surveysCollection.findOne({ question: 'any_question' })
      expect(survey).toBeTruthy()
    })
  })

  describe('loadAll()', () => {
    test('Should load all surveys on success', async () => {
      await surveysCollection.insertMany([{
        question: 'any_question',
        answers: [
          {
            answer: 'any_answer',
            image: 'any_image'
          }],
        date: new Date()
      }, {
        question: 'other_question',
        answers: [
          {
            answer: 'other_answer',
            image: 'other_image'
          }],
        date: new Date()
      }])
      const sut = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(2)
      expect(surveys[0].question).toBe('any_question')
      expect(surveys[1].question).toBe('other_question')
    })
  })
})

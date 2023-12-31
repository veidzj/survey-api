import { Collection, ObjectId } from 'mongodb'
import FakeObjectId from 'bson-objectid'
import { SurveyMongoRepository, MongoHelper } from '@/infra/db'
import { mockAddAccountParams, mockAddSurveyParams } from '@/../tests/domain/mocks'
import env from '@/main/config/env'

let surveysCollection: Collection
let surveysResultsCollection: Collection
let accountsCollection: Collection

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

const mockAccountId = async (): Promise<string> => {
  const res = await accountsCollection.insertOne(mockAddAccountParams())
  return res.insertedId.toHexString()
}

describe('SurveyMongoRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveysCollection = MongoHelper.getCollection('surveys')
    surveysResultsCollection = MongoHelper.getCollection('surveysResults')
    accountsCollection = MongoHelper.getCollection('accounts')
    await surveysCollection.deleteMany({})
    await surveysResultsCollection.deleteMany({})
    await accountsCollection.deleteMany({})
  })

  describe('add()', () => {
    test('Should add a survey on success', async () => {
      const sut = makeSut()
      await sut.add(mockAddSurveyParams())
      const count = await surveysCollection.countDocuments()
      expect(count).toBe(1)
    })
  })

  describe('loadAll()', () => {
    test('Should load all surveys on success', async () => {
      const accountId = await mockAccountId()
      const addSurveyModels = [mockAddSurveyParams(), mockAddSurveyParams()]
      const result = await surveysCollection.insertMany(addSurveyModels)
      const survey = await surveysCollection.findOne({ _id: result.insertedIds[0] })
      await surveysResultsCollection.insertOne({
        surveyId: survey._id,
        accountId: new ObjectId(accountId),
        answer: survey.answers[0].answer,
        date: new Date()
      })
      const sut = makeSut()
      const surveys = await sut.loadAll(accountId)
      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toBe(addSurveyModels[0].question)
      expect(surveys[0].didAnswer).toBe(true)
      expect(surveys[1].question).toBe(addSurveyModels[1].question)
      expect(surveys[1].didAnswer).toBe(false)
    })

    test('Should load empty list if there are no surveys', async () => {
      const accountId = await mockAccountId()
      const sut = makeSut()
      const surveys = await sut.loadAll(accountId)
      expect(surveys.length).toBe(0)
    })
  })

  describe('loadById()', () => {
    test('Should load a survey by id on success', async () => {
      const res = await surveysCollection.insertOne(mockAddSurveyParams())
      const sut = makeSut()
      const survey = await sut.loadById(res.insertedId.toHexString())
      expect(survey).toBeTruthy()
      expect(survey.id).toBeTruthy()
    })

    test('Should return empty array if survey does not exists', async () => {
      const sut = makeSut()
      const survey = await sut.loadAnswers(FakeObjectId().toHexString())
      expect(survey).toEqual([])
    })
  })

  describe('loadAnswers()', () => {
    test('Should load answers on success', async () => {
      const res = await surveysCollection.insertOne(mockAddSurveyParams())
      const survey = await surveysCollection.findOne({ _id: res.insertedId })
      const sut = makeSut()
      const answers = await sut.loadAnswers(survey._id.toHexString())
      expect(answers).toEqual([survey.answers[0].answer, survey.answers[1].answer])
    })

    test('Should return empty array if survey does not exists', async () => {
      const sut = makeSut()
      const answers = await sut.loadAnswers(FakeObjectId().toHexString())
      expect(answers).toEqual([])
    })
  })

  describe('checkById()', () => {
    test('Should return true if survey exists', async () => {
      const res = await surveysCollection.insertOne(mockAddSurveyParams())
      const sut = makeSut()
      const surveyExists = await sut.checkById(res.insertedId.toHexString())
      expect(surveyExists).toBe(true)
    })

    test('Should return false if survey does not exists', async () => {
      const sut = makeSut()
      const surveyExists = await sut.checkById(FakeObjectId().toHexString())
      expect(surveyExists).toBe(false)
    })
  })
})

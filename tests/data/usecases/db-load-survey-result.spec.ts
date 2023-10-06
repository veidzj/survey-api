import MockDate from 'mockdate'
import faker from 'faker'
import { DbLoadSurveyResult } from '@/data/usecases'
import { LoadSurveyResultRepositorySpy, LoadSurveyByIdRepositorySpy } from '@/tests/data/mocks'
import { throwError } from '@/tests/domain/mocks'

type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositoryStub: LoadSurveyResultRepositorySpy
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = new LoadSurveyResultRepositorySpy()
  const loadSurveyByIdRepositoryStub = new LoadSurveyByIdRepositorySpy()
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub)
  return {
    sut,
    loadSurveyResultRepositoryStub,
    loadSurveyByIdRepositoryStub
  }
}

let surveyId: string
let accountId: string

describe('DbLoadSurveyResult Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  beforeEach(() => {
    surveyId = faker.random.uuid()
    accountId = faker.random.uuid()
  })

  test('Should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    await sut.load(surveyId, accountId)
    expect(loadSurveyResultRepositoryStub.surveyId).toBe(surveyId)
    expect(loadSurveyResultRepositoryStub.accountId).toBe(accountId)
  })

  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockImplementationOnce(throwError)
    const promise = sut.load(surveyId, accountId)
    await expect(promise).rejects.toThrow()
  })

  test('Should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub } = makeSut()
    loadSurveyResultRepositoryStub.result = null
    await sut.load(surveyId, accountId)
    expect(loadSurveyByIdRepositoryStub.id).toBe(surveyId)
  })

  test('Should return survey result answers with count 0 if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub } = makeSut()
    loadSurveyResultRepositoryStub.result = null
    const surveyResult = await sut.load(surveyId, accountId)
    const { result } = loadSurveyByIdRepositoryStub
    expect(surveyResult).toEqual({
      surveyId: result.id,
      question: result.question,
      date: result.date,
      answers: result.answers.map(answer => Object.assign({}, answer, {
        count: 0,
        percent: 0,
        isCurrentAccountAnswer: false
      }))
    })
  })

  test('Should return a survey result on success', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const surveyResult = await sut.load(surveyId, accountId)
    expect(surveyResult).toEqual(loadSurveyResultRepositoryStub.result)
  })
})

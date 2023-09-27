import MockDate from 'mockdate'
import { DbSaveSurveyResult } from './db-save-survey-result'
import { LoadSurveyResultRepositorySpy, SaveSurveyResultRepositorySpy } from '@/data/test'
import { mockSaveSurveyResultParams, throwError } from '@/domain/test'

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepositorySpy
  loadSurveyResultRepositoryStub: LoadSurveyResultRepositorySpy
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = new SaveSurveyResultRepositorySpy()
  const loadSurveyResultRepositoryStub = new LoadSurveyResultRepositorySpy()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub, loadSurveyResultRepositoryStub)
  return {
    sut,
    saveSurveyResultRepositoryStub,
    loadSurveyResultRepositoryStub
  }
}

describe('DbSaveSurveyResult Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    const surveyResultData = mockSaveSurveyResultParams()
    await sut.save(surveyResultData)
    expect(saveSurveyResultRepositoryStub.saveSurveyResultParams).toEqual(surveyResultData)
  })

  test('Should call LoadSurveyResultRepository with corect value', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const surveyResultData = mockSaveSurveyResultParams()
    await sut.save(surveyResultData)
    expect(loadSurveyResultRepositoryStub.surveyId).toBe(surveyResultData.surveyId)
  })

  test('Should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockImplementationOnce(throwError)
    const promise = sut.save(mockSaveSurveyResultParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockImplementationOnce(throwError)
    const promise = sut.save(mockSaveSurveyResultParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should return a survey result on success', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const surveyResult = await sut.save(mockSaveSurveyResultParams())
    expect(surveyResult).toEqual(loadSurveyResultRepositoryStub.surveyResultModel)
  })
})

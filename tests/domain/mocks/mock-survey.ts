import faker from 'faker'
import { SurveyModel } from '@/domain/models/survey'
import { AddSurvey } from '@/domain/usecases/survey/add-survey'

export const mockSurveyModel = (): SurveyModel => ({
  id: faker.datatype.uuid(),
  question: faker.random.words(),
  answers: [{
    answer: faker.random.word(),
    image: faker.image.imageUrl()
  }, {
    answer: faker.random.word()
  }],
  date: faker.date.recent()
})

export const mockSurveyModels = (): SurveyModel[] => [
  mockSurveyModel(),
  mockSurveyModel()
]

export const mockAddSurveyParams = (): AddSurvey.Params => ({
  question: faker.random.words(),
  answers: [{
    answer: faker.random.word(),
    image: faker.image.imageUrl()
  }, {
    answer: faker.random.word()
  }],
  date: faker.date.recent()
})

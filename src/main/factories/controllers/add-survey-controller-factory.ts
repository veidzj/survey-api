import { Controller } from '@/presentation/protocols'
import { AddSurveyController } from '@/presentation/controllers/add-survey-controller'
import { makeAddSurveyValidation, makeDbAddSurvey, makeLogControllerDecorator } from '@/main/factories'

export const makeAddSurveyController = (): Controller => {
  const controller = new AddSurveyController(makeAddSurveyValidation(), makeDbAddSurvey())
  return makeLogControllerDecorator(controller)
}

import { Controller } from '@/presentation/protocols'
import { LoadSurveyResultController } from '@/presentation/controllers'
import { makeDbLoadSurveyById, makeDbLoadSurveyResult, makeLogControllerDecorator } from '@/main/factories'

export const makeLoadSurveyResultController = (): Controller => {
  const controller = new LoadSurveyResultController(makeDbLoadSurveyById(), makeDbLoadSurveyResult())
  return makeLogControllerDecorator(controller)
}

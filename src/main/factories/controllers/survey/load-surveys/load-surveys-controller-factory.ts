import { makeDbLoadSurveys } from '@/main/factories//usecases/survey/load-surveys/db-load-surveys-factory'
import { makeLogControllerDecorator } from '@/main/factories//decorators/log-controller-decorator-factory'
import { Controller } from '@/presentation/protocols'
import { LoadSurveysController } from '@/presentation/controllers/load-surveys-controller'

export const makeLoadSurveysController = (): Controller => {
  const controller = new LoadSurveysController(makeDbLoadSurveys())
  return makeLogControllerDecorator(controller)
}

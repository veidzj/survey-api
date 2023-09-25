import { Controller, LoadSurveyById, HttpRequest, HttpResponse } from './load-survey-result-controller-protocols'
import { forbidden } from '@/presentation/helpers/http/http-helpers'
import { InvalidParamError } from '@/presentation/errors'

export class LoadSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const survey = await this.loadSurveyById.loadById(httpRequest.params.surveyId)
    if (!survey) {
      return forbidden(new InvalidParamError('surveyId'))
    }
    return Promise.resolve(null)
  }
}

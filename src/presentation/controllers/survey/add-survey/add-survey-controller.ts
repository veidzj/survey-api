import { Controller, Validation, AddSurvey, HttpRequest, HttpResponse } from './add-survey-controller-protocols'
import { badRequest } from '../../../helpers/http/http-helpers'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = this.validation.validate(httpRequest.body)
    if (error) {
      return badRequest(new Error())
    }
    const { question, answers } = httpRequest.body
    await this.addSurvey.add({
      question,
      answers
    })
    return null
  }
}

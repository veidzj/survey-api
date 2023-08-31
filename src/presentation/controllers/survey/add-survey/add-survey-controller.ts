import { Controller, HttpRequest, HttpResponse, Validation } from './add-survey-controller-protocols'
import { badRequest } from '../../../helpers/http/http-helpers'

export class AddSurveyController implements Controller {
  constructor (private readonly validation: Validation) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = this.validation.validate(httpRequest.body)
    if (error) {
      return badRequest(new Error())
    }
    return new Promise(resolve => resolve(null))
  }
}
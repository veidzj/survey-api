import { SignInController } from './signin'
import { HttpRequest } from '../../protocols'
import { badRequest } from '../../helpers/http-helpers'
import { MissingParamError } from '../../errors'

interface SutTypes {
  sut: SignInController
}

const makeSut = (): SutTypes => {
  const sut = new SignInController()
  return {
    sut
  }
}

describe('SignIn Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        email: 'any_email@mail.com'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })
})

import { Controller } from '@/presentation/protocols'
import { makeSignUpValidation, makeDbAddAccount, makeDbAuthentication, makeLogControllerDecorator } from '@/main/factories'
import { SignUpController } from '@/presentation/controllers'

export const makeSignUpController = (): Controller => {
  const controller = new SignUpController(makeDbAddAccount(), makeSignUpValidation(), makeDbAuthentication())
  return makeLogControllerDecorator(controller)
}

import { Controller } from '@/presentation/protocols'
import { SignInController } from '@/presentation/controllers'
import { makeSignInValidation, makeDbAuthentication, makeLogControllerDecorator } from '@/main/factories'

export const makeSignInController = (): Controller => {
  const controller = new SignInController(makeSignInValidation(), makeDbAuthentication())
  return makeLogControllerDecorator(controller)
}

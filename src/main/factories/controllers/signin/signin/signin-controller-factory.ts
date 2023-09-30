import { makeSignInValidation } from './signin-validation-factory'
import { makeDbAuthentication } from '@/main/factories/usecases/account/authentication/db-authentication-factory'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { Controller } from '@/presentation/protocols'
import { SignInController } from '@/presentation/controllers/signin-controller'

export const makeSignInController = (): Controller => {
  const controller = new SignInController(makeSignInValidation(), makeDbAuthentication())
  return makeLogControllerDecorator(controller)
}

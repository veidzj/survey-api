import { Controller } from '../../../../presentation/protocols'
import { SignInController } from '../../../../presentation/controllers/signin/signin/signin-controller'
import { makeSignInValidation } from './signin-validation-factory'
import { makeDbAuthentication } from '../../usecases/authentication/db-authentication-factory'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'

export const makeSignInController = (): Controller => {
  const controller = new SignInController(makeSignInValidation(), makeDbAuthentication())
  return makeLogControllerDecorator(controller)
}
